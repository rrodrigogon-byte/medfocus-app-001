#!/bin/bash

# =============================================================================
# MedFocus PhD - Quick Start Script
# =============================================================================
# This script quickly starts both backend and frontend in development mode

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  🚀 MedFocus PhD - Quick Start${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local not found. Running setup first...${NC}"
    echo ""
    bash scripts/setup-local.sh
    echo ""
fi

echo -e "${BLUE}Starting MedFocus PhD in development mode...${NC}"
echo ""
echo -e "${GREEN}📡 Backend:${NC}  http://localhost:3001"
echo -e "${GREEN}🌐 Frontend:${NC} http://localhost:5173"
echo -e "${GREEN}🔌 WebSocket:${NC} ws://localhost:3002"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Install concurrently if not present
if ! command -v concurrently &> /dev/null; then
    echo "Installing concurrently..."
    pnpm add -D concurrently
fi

# Start both servers
pnpm run dev:full
