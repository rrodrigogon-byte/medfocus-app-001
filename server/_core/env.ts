/**
 * Environment variables for MedFocus GCP deployment.
 * All Manus dependencies removed — uses Google Cloud services directly.
 */
export const ENV = {
  // App
  appId: process.env.VITE_APP_ID ?? "medfocus",
  isProduction: process.env.NODE_ENV === "production",
  port: parseInt(process.env.PORT || "8080"),

  // Database (Cloud SQL MySQL)
  databaseUrl: process.env.DATABASE_URL ?? "",

  // JWT Auth (standalone, no Manus OAuth)
  jwtSecret: process.env.JWT_SECRET ?? "medfocus-jwt-secret-2026-gcp",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  cookieSecret: process.env.JWT_SECRET ?? "medfocus-jwt-secret-2026-gcp",

  // Google Cloud / Vertex AI (Gemini)
  gcpProject: process.env.GOOGLE_CLOUD_PROJECT ?? "viralgram-4-0-rodrigo",
  gcpLocation: process.env.VERTEX_AI_LOCATION ?? "southamerica-east1",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",

  // Stripe (optional)
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  stripePublishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "",

  // CORS
  corsOrigin: process.env.CORS_ORIGIN ?? "*",

  // Owner (admin) email
  ownerEmail: process.env.OWNER_EMAIL ?? "rrodrigogon@gmail.com",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "rrodrigogon@gmail.com",
};
