import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import jwt from "jsonwebtoken";

export const validateRequest = (
  schema: ZodTypeAny,
  source: "body" | "params" | "query" = "body",
) => {
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

export const validateAuthorizationHeader = (
  req: Request | any,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    // Check if header exists
    if (!authHeader) {
      res.status(401).json({ message: "Missing authorization header" });
      return;
    }

    // Check if header has Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Invalid authorization header format. Expected 'Bearer <token>'" });
      return;
    }

    // Check JWT_SECRET is configured
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET not configured");
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    // Extract token
    const token = authHeader.substring(7).trim();
    
    if (!token) {
      res.status(401).json({ message: "Token is required" });
      return;
    }

    // Verify and decode token
    const decoded = jwt.verify(token, jwtSecret) as any;

    // Validate decoded payload has required fields
    if (!decoded.id) {
      res.status(401).json({ message: "Invalid token: missing user id" });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      if (error.name === "TokenExpiredError") {
        res.status(401).json({ message: "Token has expired" });
        return;
      }
      if (error.name === "JsonWebTokenError") {
        res.status(401).json({ message: "Invalid token" });
        return;
      }
    }
    
    console.error("Authorization error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
