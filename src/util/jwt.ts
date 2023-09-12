import jwt from 'jsonwebtoken';

import { Jwtpayload } from '../types/jwtPayload';
import { Tokens } from '../types/tokens';

export const generateToken = (data: object, secret: string, expirationTime: number): string => {
  return jwt.sign(data, secret, {
    expiresIn: expirationTime,
  });
};

const generateAccessToken = (data: object): string => {
  return generateToken(data, process.env.JWT_SECRET as string, 60 * 60 * 24 * 3);
};

const generateRefreshToken = (data: object): string => {
  return generateToken(data, process.env.JWT_REFRESH_SECRET as string, 60 * 60 * 24 * 30);
};

export const createUserToken = (data: Jwtpayload): Tokens => {
  return {
    accessToken: generateAccessToken(data),
    refreshToken: generateRefreshToken(data),
  };
};

export const verifyToken = (token: string, secret: string) => {
  console.log({ token, secret });
  const payload = jwt.verify(token, secret);
  if (!payload) {
    return;
  }

  return payload;
};
