#!/bin/bash

# =============================================================================
# MedFocus PhD - Local Development Setup Script
# =============================================================================
# This script sets up the complete local development environment
# Run with: bash scripts/setup-local.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  $1${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

# =============================================================================
# MAIN SETUP PROCESS
# =============================================================================

print_header "MedFocus PhD - Local Environment Setup"

# Check Node.js version
print_info "Checking Node.js version..."
NODE_VERSION=$(node --version 2>/dev/null || echo "none")
if [[ "$NODE_VERSION" == "none" ]]; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
print_success "Node.js $NODE_VERSION detected"

# Check if pnpm is installed
print_info "Checking for pnpm..."
if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm not found. Installing pnpm..."
    npm install -g pnpm
    print_success "pnpm installed successfully"
else
    print_success "pnpm is already installed"
fi

# Install dependencies
print_header "Installing Dependencies"
print_info "Installing npm packages (this may take a few minutes)..."
pnpm install
print_success "Dependencies installed successfully"

# Setup environment files
print_header "Setting up Environment"
if [ ! -f ".env.local" ]; then
    print_info "Creating .env.local from .env.example..."
    cp .env.example .env.local
    print_success ".env.local created"
else
    print_warning ".env.local already exists. Skipping..."
fi

# Create necessary directories
print_header "Creating Directory Structure"
DIRS=(
    "uploads"
    "logs"
    "cache"
    "data/mock-data"
    "data/exports"
    "config"
)

for dir in "${DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        print_success "Created directory: $dir"
    else
        print_info "Directory already exists: $dir"
    fi
done

# Initialize database
print_header "Initializing Database"
print_info "Running database migrations..."
pnpm run db:push || print_warning "Database migration failed. May need manual setup."

# Generate mock data
print_info "Generating mock data for local development..."
node scripts/generate-mock-data.js || print_warning "Mock data generation failed. Will create manually if needed."

# Build the project
print_header "Building Project"
print_info "Running TypeScript compilation check..."
pnpm run check || print_warning "TypeScript check found issues. Review before continuing."

# Success message
print_header "Setup Complete!"
echo ""
print_success "✅ MedFocus PhD local environment is ready!"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Review and update .env.local with your API keys (optional for mock mode)"
echo "  2. Start the development server with:"
echo -e "     ${GREEN}pnpm run dev${NC}"
echo ""
echo "  3. In another terminal, start the client with:"
echo -e "     ${GREEN}pnpm run client:dev${NC}"
echo ""
echo -e "${BLUE}Access the application:${NC}"
echo "  🌐 Frontend: http://localhost:5173"
echo "  🔌 Backend API: http://localhost:3001"
echo "  📡 WebSocket: ws://localhost:3002"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "  pnpm run dev          - Start backend server"
echo "  pnpm run format       - Format code with Prettier"
echo "  pnpm run test         - Run tests"
echo "  pnpm run db:push      - Update database schema"
echo ""
echo -e "${YELLOW}Note:${NC} Mock APIs are enabled by default (ENABLE_MOCK_APIS=true)"
echo "       This allows testing without real API keys."
echo ""
print_success "Happy coding! 🚀"
echo ""
