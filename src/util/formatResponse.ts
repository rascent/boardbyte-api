import { Response } from 'express';
import { ResponseType } from '../types/response';
import { ResponseTypeDefault } from '../types/response';

export const formatResponse = <T>(res: Response, data?: T, message?: string, success?: boolean): void => {
  let response = ResponseTypeDefault as ResponseType<T>;

  if (data) {
    response = {
      ...response,
      data,
    } as ResponseType<T>;
  }

  res.json(response);
};
