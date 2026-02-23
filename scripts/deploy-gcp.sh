#!/bin/bash

# =============================================================================
# MedFocus PhD - Deploy Automatizado para GCP
# =============================================================================
# Este script faz o deploy completo do backend no Google Cloud Run

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-medfocus-phd-prod}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="medfocus-backend"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Functions
print_header() {
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  $1${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

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

# Check prerequisites
check_prerequisites() {
    print_header "Verificando Pré-requisitos"
    
    # Check gcloud
    if ! command -v gcloud &> /dev/null; then
        print_error "gcloud CLI não encontrado. Instale: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    print_success "gcloud CLI encontrado"
    
    # Check docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker não encontrado. Instale: https://docs.docker.com/get-docker/"
        exit 1
    fi
    print_success "Docker encontrado"
    
    # Check authentication
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        print_error "Não autenticado no gcloud. Execute: gcloud auth login"
        exit 1
    fi
    print_success "Autenticado no gcloud"
}

# Set project
set_project() {
    print_header "Configurando Projeto GCP"
    
    print_info "Projeto: ${PROJECT_ID}"
    gcloud config set project "${PROJECT_ID}"
    
    print_success "Projeto configurado"
}

# Enable APIs
enable_apis() {
    print_header "Habilitando APIs Necessárias"
    
    APIS=(
        "cloudbuild.googleapis.com"
        "run.googleapis.com"
        "containerregistry.googleapis.com"
        "secretmanager.googleapis.com"
    )
    
    for api in "${APIS[@]}"; do
        print_info "Habilitando ${api}..."
        gcloud services enable "${api}" --quiet
    done
    
    print_success "APIs habilitadas"
}

# Build Docker image
build_image() {
    print_header "Construindo Imagem Docker"
    
    print_info "Building ${IMAGE_NAME}:latest"
    
    gcloud builds submit \
        --tag "${IMAGE_NAME}:latest" \
        --timeout=20m \
        .
    
    print_success "Imagem construída com sucesso"
}

# Deploy to Cloud Run
deploy_service() {
    print_header "Fazendo Deploy no Cloud Run"
    
    print_info "Deploying ${SERVICE_NAME} to ${REGION}"
    
    gcloud run deploy "${SERVICE_NAME}" \
        --image="${IMAGE_NAME}:latest" \
        --region="${REGION}" \
        --platform=managed \
        --allow-unauthenticated \
        --memory=2Gi \
        --cpu=2 \
        --min-instances=1 \
        --max-instances=10 \
        --port=8080 \
        --set-env-vars="NODE_ENV=production" \
        --timeout=300 \
        --quiet
    
    print_success "Deploy concluído"
}

# Get service URL
get_url() {
    print_header "Obtendo URL do Serviço"
    
    SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" \
        --region="${REGION}" \
        --format="value(status.url)")
    
    echo ""
    print_success "🚀 Serviço deployed com sucesso!"
    echo ""
    echo -e "${GREEN}URL:${NC} ${SERVICE_URL}"
    echo -e "${GREEN}Health Check:${NC} ${SERVICE_URL}/health"
    echo ""
}

# Main execution
main() {
    clear
    print_header "MedFocus PhD - Deploy Automatizado GCP"
    
    check_prerequisites
    set_project
    enable_apis
    build_image
    deploy_service
    get_url
    
    print_header "Deploy Completo!"
    print_success "Backend está rodando no Cloud Run"
    echo ""
    print_info "Próximos passos:"
    echo "  1. Configure as variáveis de ambiente no Cloud Run"
    echo "  2. Deploy as Cloud Functions (gcp/cloud-functions/)"
    echo "  3. Configure o Cloud Scheduler para jobs automáticos"
    echo ""
}

# Run
main
