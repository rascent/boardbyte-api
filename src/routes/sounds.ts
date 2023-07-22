import { NextFunction, Request, Response, Router } from 'express';

import { prisma } from '../db';
import { formatResponse } from '../util/formatResponse';

const createSound = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newSound = await prisma.sound.create({
      data: { sellerId: 1, ...req.body },
    });

    formatResponse(res, newSound);
  } catch (error: any) {
    next(error);
  }
};

const getAllSounds = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allSounds = await prisma.sound.findMany();
    formatResponse(res, allSounds);
  } catch (error: any) {
    next(error);
  }
};

const getSoundById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const singleSound = await prisma.sound.findUnique({
      where: {
        id: req.params.id,
      },
    });

    formatResponse(res, singleSound);
  } catch (error: any) {
    next(error);
  }
};

const updateSound = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedSound = await prisma.sound.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });
    formatResponse(res, updatedSound);
  } catch (error: any) {
    next(error);
  }
};

const deleteSound = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.sound.delete({
      where: {
        id: req.params.id,
      },
    });

    formatResponse(res, null, 'Sound deleted');
  } catch (error: any) {
    next(error);
  }
};

export const handleSoundsRoutes = () => {
  const router = Router();

  router.post('/', createSound);
  router.get('/', getAllSounds);
  router.get('/:id', getSoundById);
  router.put('/:id', updateSound);
  router.delete('/:id', deleteSound);

  return router;
};
