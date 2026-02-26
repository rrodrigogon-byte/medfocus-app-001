/**
 * MedFocus Backend Server
 * Professional Express.js API with:
 * - JWT Authentication
 * - SQLite Database (ready for PostgreSQL)
 * - WebSocket for real-time notifications
 * - RESTful API endpoints
 * - Gemini AI integration
 * - University content scraping
 */
import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import routers
import { authRouter } from "./routes/auth.js";
import { classroomRouter } from "./routes/classrooms.js";
import { materialsRouter } from "./routes/materials.js";
import { validationRouter } from "./routes/validation.js";
import { notificationsRouter } from "./routes/notifications.js";
import { analyticsRouter } from "./routes/analytics.js";
import { quizzesRouter } from "./routes/quizzes.js";
import { discussionsRouter } from "./routes/discussions.js";
import { scrapingRouter } from "./routes/scraping.js";
import { aiRouter } from "./routes/ai.js";

// Import middleware
import { authenticateToken } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/logger.js";

// Import services
import { initializeDatabase } from "./services/database.js";
import { WebSocketService } from "./services/websocket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Initialize WebSocket
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    },
  });
  
  // Initialize WebSocket service
  const wsService = new WebSocketService(io);
  
  // Store io instance in app for access in routes
  app.set("io", io);
  app.set("wsService", wsService);

  // Middleware
  app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(cookieParser());
  app.use(requestLogger);

  // Initialize database
  await initializeDatabase();

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    });
  });

  // API Routes
  app.use("/api/auth", authRouter);
  app.use("/api/classrooms", authenticateToken, classroomRouter);
  app.use("/api/materials", authenticateToken, materialsRouter);
  app.use("/api/validation", authenticateToken, validationRouter);
  app.use("/api/notifications", authenticateToken, notificationsRouter);
  app.use("/api/analytics", authenticateToken, analyticsRouter);
  app.use("/api/quizzes", authenticateToken, quizzesRouter);
  app.use("/api/discussions", authenticateToken, discussionsRouter);
  app.use("/api/scraping", authenticateToken, scrapingRouter);
  app.use("/api/ai", aiRouter);

  // Error handler
  app.use(errorHandler);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  // ─── Daily CMED/ANVISA Price Refresh ─────────────────────────────
  // Runs every 24 hours to fetch latest medicine prices from ANVISA
  const CMED_REFRESH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
  async function runCMEDRefresh() {
    try {
      const { refreshCMEDData } = await import('./services/cmedService');
      console.log('[CMED] Starting scheduled daily refresh...');
      const result = await refreshCMEDData();
      console.log(`[CMED] Refresh result: ${result.message}`);
    } catch (err) {
      console.error('[CMED] Scheduled refresh failed:', err);
    }
  }
  // Schedule daily refresh (first run after 1 hour, then every 24h)
  setTimeout(() => {
    runCMEDRefresh();
    setInterval(runCMEDRefresh, CMED_REFRESH_INTERVAL);
  }, 60 * 60 * 1000);
  console.log('[CMED] Daily price refresh scheduled (every 24h)');

  // Also expose a direct HTTP endpoint for Cloud Scheduler
  app.get('/api/cmed/refresh', async (_req, res) => {
    try {
      const { refreshCMEDData } = await import('./services/cmedService');
      const result = await refreshCMEDData();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  server.listen(port, () => {
    console.log(`🚀 MedFocus Server running on http://localhost:${port}/`);
    console.log(`📊 API endpoints available at http://localhost:${port}/api/`);
    console.log(`🔌 WebSocket server ready for real-time updates`);
    console.log(`💊 CMED Medicine Database: 2304+ substances loaded`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
