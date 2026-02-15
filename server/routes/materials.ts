// Materials Routes - Placeholder
import { Router } from "express";
export const materialsRouter = Router();
materialsRouter.get("/", (req, res) => res.json({ success: true, materials: [] }));
