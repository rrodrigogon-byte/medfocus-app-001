/**
 * MedFocus Server — Main entry point for GCP Cloud Run deployment.
 * Standalone Express + tRPC server (no Manus dependencies).
 */
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { setupBattleWs } from "../battleWs";
import { ENV } from "./env";

async function startServer() {
  const app = express();
  const server = createServer(app);

  // CORS for Cloud Run
  app.use(cors({
    origin: ENV.corsOrigin === "*" ? true : ENV.corsOrigin.split(","),
    credentials: true,
  }));

  // Trust proxy for Cloud Run (behind load balancer)
  app.set("trust proxy", true);

  // Stripe webhook MUST be before express.json() for signature verification
  try {
    const { handleStripeWebhook } = await import("../stripe-webhook");
    app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
  } catch (e) {
    console.warn("[Stripe] Webhook handler not available:", e);
  }

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Health check for Cloud Run
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "2.0.0",
      environment: ENV.isProduction ? "production" : "development",
    });
  });

  // Auth routes (register, login, logout)
  registerOAuthRoutes(app);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // ─── CMED Medicine API Endpoints ─────────────────────────────
  // Serve full CMED medicines data for frontend PriceComparison
  app.get('/api/cmed/medicines', async (req, res) => {
    try {
      const { searchMedicines, getCMEDMetadata, getCMEDCategories } = await import('../services/cmedService');
      const metadata = getCMEDMetadata();
      const categories = getCMEDCategories();
      const result = searchMedicines({ query: '', page: 1, pageSize: 10000 });
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.json({ metadata, categories, medicines: result.medicines });
    } catch (err: any) {
      console.error('[CMED] Error serving medicines:', err.message);
      res.status(500).json({ metadata: {}, categories: [], medicines: [] });
    }
  });

  // CMED refresh endpoint for Cloud Scheduler
  app.get('/api/cmed/refresh', async (_req, res) => {
    try {
      const { refreshCMEDData } = await import('../services/cmedService');
      const result = await refreshCMEDData();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Serve static files / Vite dev server
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = ENV.port;

  // Setup WebSocket for real-time battles
  setupBattleWs(server);

  server.listen(port, "0.0.0.0", () => {
    console.log(`MedFocus Server running on http://0.0.0.0:${port}/`);
    console.log(`Environment: ${ENV.isProduction ? "production" : "development"}`);
    console.log(`API endpoints: http://0.0.0.0:${port}/api/`);
    console.log(`tRPC endpoint: http://0.0.0.0:${port}/api/trpc`);
  });

  // Graceful shutdown for Cloud Run
  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully...");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    console.log("SIGINT received, shutting down...");
    server.close(() => {
      process.exit(0);
    });
  });
}

startServer().catch((error) => {
  console.error("Failed to start MedFocus server:", error);
  process.exit(1);
});
