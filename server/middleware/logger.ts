/**
 * Request Logger Middleware
 */
import { Request, Response, NextFunction } from "express";

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();

  // Log request
  console.log(`📥 ${req.method} ${req.path}`);

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode < 400 ? "✅" : "❌";
    
    console.log(
      `${statusColor} ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
  });

  next();
}
