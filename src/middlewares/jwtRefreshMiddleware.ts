import { Request, Response, NextFunction } from 'express';
import { jwtMiddleware } from './jwtMiddleware';

export const jwtRefreshMiddlware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.locals.secret = process.env.JWT_REFRESH_SECRET;
  jwtMiddleware(req, res, next);
}