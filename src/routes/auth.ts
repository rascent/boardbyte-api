import * as bcrypt from 'bcrypt';
import { NextFunction, Request, Response, Router } from 'express';
import { google } from 'googleapis';

import { prisma } from '../db';
import { formatResponse } from '../util/formatResponse';
import { oauth2Client } from '../util/oauth2Client';
import { createUserToken } from '../util/jwt';
import { jwtMiddleware } from '../middlewares/jwtMiddleware';
import { Jwtpayload } from '../types/jwtPayload';

const users = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allUsers = await prisma.user.findMany();
    formatResponse(res, allUsers);
  } catch (error: any) {
    next(error);
  }
};

const login = async (
  req: Request<unknown, unknown, { email: string; password: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (!user.password) {
      res.status(401);
      throw new Error('User registered with social login');
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!passwordMatch) {
      res.status(401);
      throw new Error('Password does not match');
    }

    const tokenPayload: Jwtpayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const tokens = createUserToken(tokenPayload);
    await updateRefreshToken(user.id, tokens.refreshToken);
    formatResponse(res, { ...user, tokens });
  } catch (error: any) {
    next(error);
  }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (user) {
      throw new Error('User already exists');
    }

    const newUser = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hashSync(req.body.password, 10),
      },
    });

    const tokenPayload: Jwtpayload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    const tokens = createUserToken(tokenPayload);
    await updateRefreshToken(newUser.id, tokens.refreshToken);
    formatResponse(res, { ...newUser, tokens });
  } catch (error: any) {
    next(error);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateRefreshToken(res.locals.user.id);
    formatResponse(res);
  } catch (error: any) {
    next(error);
  }
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: res.locals.user.id as string,
      },
    });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const tokenPayload: Jwtpayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const tokens = createUserToken(tokenPayload);
    await updateRefreshToken(user.id, tokens.refreshToken);
    formatResponse(res, { tokens });
  } catch (error: any) {
    next(error);
  }
};

const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let redirectUri = req.query.redirect_uri as string;
    if (!redirectUri) {
      throw new Error('no redirect_url passed');
    }
    let googleAuth = oauth2Client.generateAuthUrl({
      redirect_uri: redirectUri,
      scope: ['email', 'profile'],
    });
    res.redirect(googleAuth);
  } catch (error: any) {
    next(error);
  }
};

const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { code, redirect_uri } = req.body;
    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri,
    });

    oauth2Client.setCredentials(tokens);
    let oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    let userInfo = await oauth2.userinfo.v2.me.get();

    let user = await prisma.user.findUnique({
      where: {
        email: userInfo.data.email as string,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: userInfo.data.name as string,
          email: userInfo.data.email as string,
          provider: 'google',
          providerId: userInfo.data.id,
          picture: userInfo.data.picture,
        },
      });
    }

    const tokenPayload: Jwtpayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const serverToken = createUserToken(tokenPayload);
    await updateRefreshToken(user.id, serverToken.refreshToken);
    formatResponse(res, { ...user, tokens: serverToken });

    formatResponse(res, userInfo.data);
  } catch (error: any) {
    next(error);
  }
};

export const updateRefreshToken = async (
  userId: string,
  refreshToken?: string,
) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      refreshToken: refreshToken ?? null,
    },
  });
};

export const handlleAuthRoutes = () => {
  const router = Router();

  router.get('/users', users);
  router.get('/refresh', jwtMiddleware, refreshToken);
  router.post('/login', login);
  router.post('/register', register);
  router.post('/logout', jwtMiddleware, logout);
  router.get('/google', googleAuth);
  router.post('/google/callback', googleCallback);

  return router;
};
