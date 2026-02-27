# ─── MedFocus — Cloud Run Dockerfile ─────────────────────────
# Multi-stage build for optimized production image

# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# Install pnpm and dependencies
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate && \
    pnpm install --frozen-lockfile --ignore-scripts 2>/dev/null || pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Set Stripe publishable key for Vite build (embedded at build time)
ENV VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51T4VwWERGTEVNd7ogGApG5uNqFCDJVe6v4IzTu0Pz9iDJtEs38tIX2oJCQ4xWBjzuP7fAS4zPgmuPswTXmgbTXxa00eYrXil1H

# Build frontend (Vite) and backend (esbuild)
RUN npx vite build && \
    npx esbuild server/_core/index.ts --bundle --platform=node --target=node20 \
      --outfile=dist/server.js \
      --external:better-sqlite3 --external:mysql2 \
      --external:@neondatabase/serverless --external:pg \
      --external:lightningcss --format=esm \
      --banner:js="import{createRequire as _cr}from'module';const require=globalThis.require||_cr(import.meta.url);"

# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /app

# Copy package files for production install
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# Install pnpm and production dependencies only
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate && \
    pnpm install --prod --frozen-lockfile --ignore-scripts 2>/dev/null || pnpm install --prod --no-frozen-lockfile

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy drizzle migrations
COPY --from=builder /app/drizzle ./drizzle

# Copy CMED medicine database (2304+ substances from ANVISA)
COPY --from=builder /app/server/data ./server/data

# Environment
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:8080/api/health || exit 1

# Start server
CMD ["node", "dist/server.js"]
