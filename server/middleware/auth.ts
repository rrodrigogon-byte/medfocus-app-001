/**
 * Authentication Middleware
 * JWT-based authentication with role checking
 */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "medfocus-dev-secret-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    universityId?: string;
  };
}

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  universityId?: string;
}

/**
 * Generate JWT token
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Middleware to authenticate requests
 */
export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  const payload = verifyToken(token);
  
  if (!payload) {
    res.status(403).json({ error: "Invalid or expired token" });
    return;
  }

  req.user = payload;
  next();
}

/**
 * Middleware to check if user has specific role
 */
export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ 
        error: "Insufficient permissions",
        required: roles,
        current: req.user.role,
      });
      return;
    }

    next();
  };
}

/**
 * Middleware to check if user is a professor
 */
export function requireProfessor(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  if (!["professor", "coordinator", "admin"].includes(req.user.role)) {
    res.status(403).json({ 
      error: "Professor access required",
      current: req.user.role,
    });
    return;
  }

  next();
}

/**
 * Middleware to check if user can validate materials
 */
export function requireValidator(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  if (!["professor", "coordinator", "admin"].includes(req.user.role)) {
    res.status(403).json({ 
      error: "Content validation permission required",
      current: req.user.role,
    });
    return;
  }

  next();
}

/**
 * Middleware to check if user is admin or coordinator
 */
export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  if (!["admin", "coordinator"].includes(req.user.role)) {
    res.status(403).json({ 
      error: "Admin access required",
      current: req.user.role,
    });
    return;
  }

  next();
}
