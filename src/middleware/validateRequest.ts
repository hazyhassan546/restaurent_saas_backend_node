import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

export const validateRequest = (schema: ZodTypeAny, source: "body" | "params" | "query" = "body") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join(".") || "request",
          message: issue.message,
        })),
      });
      return;
    }

    req[source] = result.data;
    next();
  };
};

export const validateAuthorizationHeader = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  next();
};
