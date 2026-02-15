// Quizzes Routes - Placeholder
import { Router } from "express";
export const quizzesRouter = Router();
quizzesRouter.get("/", (req, res) => res.json({ success: true, data: [] }));
