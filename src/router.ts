import { Router } from 'express';
import { handlleAuthRoutes } from './routes/auth';
import { handleSoundsRoutes } from './routes/sounds';
import { jwtMiddleware } from './middlewares/jwtMiddleware';

export const handleRoutes = () => {
  const router = Router();

  router.use('/auth', handlleAuthRoutes());
  router.use('/sounds', jwtMiddleware, handleSoundsRoutes());

  return router;
};
