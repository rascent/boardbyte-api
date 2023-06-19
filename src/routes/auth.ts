import * as bcrypt from "bcrypt";

import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";

const users = async (req: Request, res: Response, next: NextFunction) => {
  const prisma = new PrismaClient();
  try {
    const allUsers = await prisma.user.findMany();
    res.json(allUsers);
  } catch (error: any) {
    next(error.message);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.password) {
      throw new Error("User registered with social login");
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      throw new Error("Password does not match");
    }

    res.json(user);
  } catch (error: any) {
    next(error.message);
  }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  const prisma = new PrismaClient();
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

    res.json(newUser);
  } catch (error: any) {
    next(error.message);
  }
};

export const handlleAuthRoutes = (router: Router) => {
  router.get("/users", users);
  router.post("/login", login);
  router.post("/register", register);
};
