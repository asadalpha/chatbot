import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err instanceof AppError ? err.status : 500;
  const message =
    err instanceof AppError
      ? err.message
      : "Something went wrong. Please try again.";

  console.error(err);
  res.status(status).json({ error: message });
}
