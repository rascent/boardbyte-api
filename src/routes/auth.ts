import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response, Router } from "express";

import { prisma } from "../db";
import { formatResponse } from "../util/formatResponse";
import { User } from "@prisma/client";

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
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (!user.password) {
      res.status(401);
      throw new Error("User registered with social login");
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      res.status(401);
      throw new Error("Password does not match");
    }

    formatResponse(res, user);
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
      throw new Error("User already exists");
    }

    const newUser = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hashSync(req.body.password, 10),
      },
    });

    formatResponse(res, newUser);
  } catch (error: any) {
    next(error);
  }
};

export const handlleAuthRoutes = () => {
  const router = Router();

  router.get("/users", users);
  router.post("/login", login);
  router.post("/register", register);

  return router;
};
