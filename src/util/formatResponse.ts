import { Response } from "express";
import { ResponseType } from "../types/response";

export const formatResponse = (
  res: Response,
  data?: any,
  message?: string,
  success?: boolean
): void => {
  const response: ResponseType = {
    success: success ?? true,
    message: message ?? null,
    data: null,
  };

  if (data) {
    response.data = data;
  }

  res.json(response);
};
