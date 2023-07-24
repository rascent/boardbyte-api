import { NextFunction, Request, Response } from 'express';

import { verifyToken } from '../util/jwt';
import { prisma } from '../db';
import { Jwtpayload } from '../types/jwtPayload';

export const jwtMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const token = authHeader.split(' ')[1];

    const payload = verifyToken(token) as Jwtpayload;
    if (!payload) {
      res.status(403);
      throw new Error('Forbidden');
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user || !user.refreshToken) {
      res.status(403);
      throw new Error('Forbidden');
    }

    res.locals.user = user;
    next();
  } catch (error: any) {
    next(error);
  }
};
