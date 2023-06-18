import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prisma = new PrismaClient();
  try {
    const newProduct = await prisma.products.create({
      data: { sellerId: 1, ...req.body },
    });

    res.json({ newProduct });
  } catch (error: any) {
    next(error.message);
  }
};

const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prisma = new PrismaClient();
  try {
    const allProducts = await prisma.products.findMany();
    res.json({ allProducts });
  } catch (error: any) {
    next(error.message);
  }
};

const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prisma = new PrismaClient();
  try {
    const singleProduct = await prisma.products.findUnique({
      where: {
        id: req.params.id,
      },
    });

    res.json({ singleProduct });
  } catch (error: any) {
    next(error.message);
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prisma = new PrismaClient();
  try {
    const updatedProduct = await prisma.products.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });
    res.json({ updatedProduct });
  } catch (error: any) {
    next(error.message);
  }
};

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prisma = new PrismaClient();
  try {
    await prisma.products.delete({
      where: {
        id: req.params.id,
      },
    });

    res.sendStatus(200);
  } catch (error: any) {
    next(error.message);
  }
};

export const handleProductsRoutes = (router: Router) => {
  router.post("/products", createProduct);
  router.get("/products", getAllProducts);
  router.get("/products/:id", getProductById);
  router.put("/products/:id", updateProduct);
  router.delete("/products/:id", deleteProduct);
};
