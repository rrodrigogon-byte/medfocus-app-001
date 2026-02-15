// Scraping Routes - Placeholder
import { Router } from "express";
export const scrapingRouter = Router();
scrapingRouter.get("/", (req, res) => res.json({ success: true, data: [] }));
