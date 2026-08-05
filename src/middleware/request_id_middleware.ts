import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export const requestIdMiddleware = (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const requestId = uuidv4();
  req.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);
  next();
};
