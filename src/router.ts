import { Router } from "express";
import { handlleAuthRoutes } from "./routes/auth";
import { handleSoundsRoutes } from "./routes/sounds";

export const handleRoutes = () => {
  const router = Router();

  router.use("/auth", handlleAuthRoutes());
  router.use("/sounds", handleSoundsRoutes());

  return router;
};
