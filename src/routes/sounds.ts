import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";

const createSound = async (req: Request, res: Response, next: NextFunction) => {
  const prisma = new PrismaClient();
  try {
    const newSound = await prisma.sound.create({
      data: { sellerId: 1, ...req.body },
    });

    res.json({ newSound });
  } catch (error: any) {
    next(error.message);
  }
};

const getAllSounds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prisma = new PrismaClient();
  try {
    const allSounds = await prisma.sound.findMany();
    res.json({ allSounds });
  } catch (error: any) {
    next(error.message);
  }
};

const getSoundById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prisma = new PrismaClient();
  try {
    const singleSound = await prisma.sound.findUnique({
      where: {
        id: req.params.id,
      },
    });

    res.json({ singleSound });
  } catch (error: any) {
    next(error.message);
  }
};

const updateSound = async (req: Request, res: Response, next: NextFunction) => {
  const prisma = new PrismaClient();
  try {
    const updatedSound = await prisma.sound.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });
    res.json({ updatedSound });
  } catch (error: any) {
    next(error.message);
  }
};

const deleteSound = async (req: Request, res: Response, next: NextFunction) => {
  const prisma = new PrismaClient();
  try {
    await prisma.sound.delete({
      where: {
        id: req.params.id,
      },
    });

    res.sendStatus(200);
  } catch (error: any) {
    next(error.message);
  }
};

export const handleSoundsRoutes = (router: Router) => {
  router.post("/sounds", createSound);
  router.get("/sounds", getAllSounds);
  router.get("/sounds/:id", getSoundById);
  router.put("/sounds/:id", updateSound);
  router.delete("/sounds/:id", deleteSound);
};
