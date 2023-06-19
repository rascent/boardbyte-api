import { Router } from "express";
import { handlleAuthRoutes } from "./routes/auth";
import { handleSoundsRoutes } from "./routes/sounds";

export const handleRoutes = (router: Router) => {
  handlleAuthRoutes(router);
  handleSoundsRoutes(router);

  return router;
};
