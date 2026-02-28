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

  // Seed library with free medical books
  app.get('/api/library/seed', async (_req, res) => {
    try {
      const { saveLibraryMaterial } = await import('../db');
      const { FREE_BOOKS } = await import('../../client/src/data/freeBooks');
      let seeded = 0;
      for (const book of FREE_BOOKS) {
        const id = await saveLibraryMaterial({
          title: book.title,
          description: book.description,
          type: book.type as any,
          subject: book.category || 'Medicina',
          authorName: book.author,
          authorInstitution: book.institution || undefined,
          source: book.source || undefined,
          externalUrl: book.url || undefined,
          publishedYear: book.year || undefined,
          relevanceScore: Math.round(book.rating * 10) || 85,
          language: book.language === 'pt-BR' ? 'pt' : book.language || 'pt',
          tags: book.tags?.join(',') || undefined,
        });
        if (id) seeded++;
      }
      res.json({ success: true, seeded, total: FREE_BOOKS.length });
    } catch (err: any) {
      console.error('[SEED] Error seeding library:', err.message);
      res.status(500).json({ success: false, message: err.message });
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

  // ─── CNES Hospital/Clinic API Endpoints ──────────────────────
  // Search establishments from DataSUS CNES API
  app.get('/api/cnes/estabelecimentos', async (req, res) => {
    try {
      const { searchEstabelecimentos } = await import('../services/cnesService');
      const { uf, municipio, tipo, limit, offset } = req.query;
      const result = await searchEstabelecimentos({
        uf: uf as string,
        municipio: municipio ? Number(municipio) : undefined,
        tipoUnidade: tipo ? Number(tipo) : undefined,
        limit: limit ? Number(limit) : 20,
        offset: offset ? Number(offset) : 0,
      });
      res.setHeader('Cache-Control', 'public, max-age=1800');
      res.json(result);
    } catch (err: any) {
      console.error('[CNES] Error:', err.message);
      res.status(500).json({ estabelecimentos: [], total_estimado: 0, error: err.message });
    }
  });

  // Get paginated results (multiple pages) for a state/type
  app.get('/api/cnes/buscar', async (req, res) => {
    try {
      const { fetchEstabelecimentosPaginados } = await import('../services/cnesService');
      const { uf, municipio, tipo, paginas } = req.query;
      const results = await fetchEstabelecimentosPaginados({
        uf: uf as string,
        municipio: municipio ? Number(municipio) : undefined,
        tipoUnidade: tipo ? Number(tipo) : undefined,
        maxPages: paginas ? Number(paginas) : 5,
      });
      res.setHeader('Cache-Control', 'public, max-age=1800');
      res.json({ estabelecimentos: results, total: results.length });
    } catch (err: any) {
      console.error('[CNES] Buscar error:', err.message);
      res.status(500).json({ estabelecimentos: [], total: 0, error: err.message });
    }
  });

  // Get single establishment by CNES code
  app.get('/api/cnes/estabelecimento/:codigo', async (req, res) => {
    try {
      const { getEstabelecimentoByCnes } = await import('../services/cnesService');
      const result = await getEstabelecimentoByCnes(Number(req.params.codigo));
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'Estabelecimento não encontrado' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get hospitals with bed data
  app.get('/api/cnes/hospitais-leitos', async (req, res) => {
    try {
      const { getHospitaisComLeitos } = await import('../services/cnesService');
      const { limit, offset } = req.query;
      const result = await getHospitaisComLeitos({
        limit: limit ? Number(limit) : 20,
        offset: offset ? Number(offset) : 0,
      });
      res.setHeader('Cache-Control', 'public, max-age=1800');
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ hospitais: [], total_estimado: 0, error: err.message });
    }
  });

  // Get CNES stats and unit types
  app.get('/api/cnes/stats', async (_req, res) => {
    try {
      const { getCnesStats, getRelevantUnitTypes } = await import('../services/cnesService');
      res.json({ stats: getCnesStats(), tiposUnidade: getRelevantUnitTypes() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Video Lessons API Endpoints ────────────────────────────
  // Get approved videos
  app.get('/api/videos', async (req, res) => {
    try {
      const status = (req.query.status as string) || 'approved';
      // For now return empty — DB videos will be populated as professors upload
      res.json({ videos: [], total: 0 });
    } catch (err: any) {
      res.status(500).json({ videos: [], error: err.message });
    }
  });

  // Submit a new video for approval
  app.post('/api/videos', async (req, res) => {
    try {
      const { title, discipline, professor, description, year, semester, difficulty, topics, externalLink, duration } = req.body;
      if (!title || !discipline || !professor) {
        return res.status(400).json({ error: 'Título, disciplina e professor são obrigatórios' });
      }
      // TODO: Save to DB when video_lessons table is migrated
      console.log('[VIDEO] New submission:', title, 'by', professor);
      res.json({ success: true, message: 'Vídeo enviado para aprovação', id: Date.now() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── ANVISA Bula / Bíblia Farmacológica API ─────────────────
  app.get('/api/anvisa/bula/search', async (req, res) => {
    try {
      const nome = req.query.nome as string;
      if (!nome) return res.status(400).json({ error: 'Parâmetro "nome" é obrigatório' });
      const { searchBulasAnvisa } = await import('../services/anvisaBulaService');
      const bulas = await searchBulasAnvisa(nome);
      res.json({ bulas, total: bulas.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/anvisa/farmaco/:nome', async (req, res) => {
    try {
      const { getDrugInfo } = await import('../services/anvisaBulaService');
      const info = await getDrugInfo(req.params.nome);
      res.json(info);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/anvisa/farmaco-db', async (req, res) => {
    try {
      const { getAvailableDrugs } = await import('../services/anvisaBulaService');
      res.json({ drugs: getAvailableDrugs() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Mercado Pago API Endpoints ────────────────────────
  // Webhook for Mercado Pago notifications
  app.post('/api/mercadopago/webhook', async (req, res) => {
    try {
      const { processMPWebhook } = await import('../services/mercadoPagoService');
      const result = await processMPWebhook(req.body);
      console.log('[MercadoPago] Webhook result:', result);

      if (result.action === 'payment_approved' || result.action === 'subscription_activated') {
        // Activate user subscription
        if (result.userId) {
          try {
            const { getDb } = await import('../db');
            const { users } = await import('../../drizzle/schema');
            const { eq } = await import('drizzle-orm');
            const db = await getDb();
            if (db) {
              const trialEnd = new Date();
              trialEnd.setDate(trialEnd.getDate() + 7);
              await db.update(users)
                .set({
                  plan: result.planId || 'estudante',
                  trialActive: true,
                  trialEndDate: trialEnd,
                  subscriptionStatus: 'active',
                  paymentGateway: 'mercadopago',
                  mpSubscriptionId: result.paymentId || null,
                })
                .where(eq(users.id, result.userId));
              console.log(`[MercadoPago] User ${result.userId} activated with plan ${result.planId}`);
            }
          } catch (dbErr: any) {
            console.error('[MercadoPago] DB update error:', dbErr.message);
          }
        }
      }

      res.status(200).json({ received: true });
    } catch (err: any) {
      console.error('[MercadoPago] Webhook error:', err.message);
      res.status(200).json({ received: true }); // Always return 200 to avoid retries
    }
  });

  // Create Mercado Pago checkout
  app.post('/api/mercadopago/create-checkout', async (req, res) => {
    try {
      const { createMPCheckoutPreference, isMPConfigured } = await import('../services/mercadoPagoService');
      if (!isMPConfigured()) {
        return res.status(500).json({ error: 'Mercado Pago não configurado' });
      }
      const { userId, userEmail, userName, planId, interval, partnershipCode } = req.body;
      const origin = req.headers.origin || process.env.APP_URL || 'https://medfocus-app-969630653332.southamerica-east1.run.app';

      // Use Checkout Pro preference (works immediately, supports Pix/Card/Boleto)
      const result = await createMPCheckoutPreference({
        userId,
        userEmail: userEmail || '',
        userName: userName || '',
        planId: planId || 'estudante',
        interval: interval || 'monthly',
        partnershipCode,
        origin,
      });

      res.json({ url: result.initPoint, preferenceId: result.preferenceId });
    } catch (err: any) {
      console.error('[MercadoPago] Checkout creation error:', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // Create Mercado Pago Checkout Pro preference (simpler, one-click)
  app.post('/api/mercadopago/create-preference', async (req, res) => {
    try {
      const { createMPCheckoutPreference, isMPConfigured } = await import('../services/mercadoPagoService');
      if (!isMPConfigured()) {
        return res.status(500).json({ error: 'Mercado Pago não configurado' });
      }
      const { userId, userEmail, userName, planId, interval, partnershipCode } = req.body;
      const origin = req.headers.origin || process.env.APP_URL || 'https://medfocus-app-969630653332.southamerica-east1.run.app';

      const result = await createMPCheckoutPreference({
        userId,
        userEmail: userEmail || '',
        userName: userName || '',
        planId: planId || 'estudante',
        interval: interval || 'monthly',
        partnershipCode,
        origin,
      });

      res.json({ url: result.initPoint, preferenceId: result.preferenceId });
    } catch (err: any) {
      console.error('[MercadoPago] Preference creation error:', err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // Check Mercado Pago configuration status
  app.get('/api/mercadopago/status', async (_req, res) => {
    const { isMPConfigured } = await import('../services/mercadoPagoService');
    res.json({
      configured: isMPConfigured(),
      gateway: 'mercadopago',
      methods: ['pix', 'credit_card', 'debit_card', 'boleto'],
    });
  });

  // Payment gateway status (which gateways are available)
  app.get('/api/payment/gateways', async (_req, res) => {
    const { isMPConfigured } = await import('../services/mercadoPagoService');
    const stripeConfigured = !!ENV.stripeSecretKey;
    const mpConfigured = isMPConfigured();
    res.json({
      mercadopago: { available: mpConfigured, primary: true, methods: ['pix', 'credit_card', 'debit_card', 'boleto'] },
      stripe: { available: stripeConfigured, primary: false, methods: ['card'] },
      recommended: mpConfigured ? 'mercadopago' : (stripeConfigured ? 'stripe' : 'none'),
    });
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
