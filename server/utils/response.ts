import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

export function sendSuccess<T>(res: Response, data?: T, message?: string, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    ...(data !== undefined && { data }),
    ...(message && { message }),
  });
}

export function sendError(res: Response, message: string, statusCode = 400, errors?: any[]) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
}
