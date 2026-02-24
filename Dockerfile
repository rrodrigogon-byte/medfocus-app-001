# ─── MedFocus — Cloud Run Dockerfile ─────────────────────────
# Multi-stage build for optimized production image

# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# Install dependencies
RUN pnpm install --frozen-lockfile --ignore-scripts 2>/dev/null || pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Build frontend (Vite) and backend (esbuild)
RUN pnpm run build

# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

# Copy package files for production install
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile --ignore-scripts 2>/dev/null || pnpm install --prod --no-frozen-lockfile

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy drizzle migrations
COPY --from=builder /app/drizzle ./drizzle

# Environment
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:8080/api/health || exit 1

# Start server
CMD ["node", "dist/index.js"]
