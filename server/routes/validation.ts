// Validation Routes - Placeholder
import { Router } from "express";
export const validationRouter = Router();
validationRouter.get("/pending", (req, res) => res.json({ success: true, pending: [] }));
