# 🚀 MedFocus PhD - Guia de Deploy Rápido GCP

**Tempo estimado**: 15-20 minutos  
**Custo mensal estimado**: ~R$ 1.365 (USD $273)

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- ✅ Conta Google Cloud Platform ativa
- ✅ Projeto GCP criado com billing habilitado
- ✅ Google Cloud SDK instalado localmente
- ✅ Docker instalado (para build local)
- ✅ Acesso ao repositório GitHub

---

## ⚡ Deploy em 3 Comandos

### 1. Clone e Configure

```bash
# Clone o repositório
git clone https://github.com/rrodrigogon-byte/medfocus-app-001.git
cd medfocus-app-001

# Checkout branch de produção
git checkout feature/medfocus-phd-specification

# Configure variáveis de ambiente
export GCP_PROJECT_ID="seu-projeto-id"
export GCP_REGION="us-central1"
```

### 2. Autentique no GCP

```bash
# Login no Google Cloud
gcloud auth login

# Configure o projeto
gcloud config set project $GCP_PROJECT_ID
```

### 3. Execute o Deploy

```bash
# Deploy automatizado
bash scripts/deploy-gcp.sh
```

**Pronto!** O script irá:
- ✅ Verificar pré-requisitos
- ✅ Habilitar APIs necessárias
- ✅ Construir imagem Docker
- ✅ Fazer deploy no Cloud Run
- ✅ Retornar a URL pública

---

## 🎯 Deploy Manual (Passo a Passo)

Se preferir controle total, siga:

### Passo 1: Habilitar APIs

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  containerregistry.googleapis.com \
  secretmanager.googleapis.com
```

### Passo 2: Build da Imagem

```bash
# Via Cloud Build (recomendado)
gcloud builds submit --tag gcr.io/$GCP_PROJECT_ID/medfocus-backend

# Ou via Docker local
docker build -t gcr.io/$GCP_PROJECT_ID/medfocus-backend .
docker push gcr.io/$GCP_PROJECT_ID/medfocus-backend
```

### Passo 3: Deploy no Cloud Run

```bash
gcloud run deploy medfocus-backend \
  --image=gcr.io/$GCP_PROJECT_ID/medfocus-backend:latest \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --memory=2Gi \
  --cpu=2 \
  --min-instances=1 \
  --max-instances=10 \
  --port=8080 \
  --set-env-vars="NODE_ENV=production"
```

### Passo 4: Obter URL

```bash
gcloud run services describe medfocus-backend \
  --region=us-central1 \
  --format="value(status.url)"
```

---

## 🔐 Configurar Secrets (Opcional mas Recomendado)

### Criar Secrets no Secret Manager

```bash
# Gemini API Key
echo -n "sua-gemini-api-key" | \
  gcloud secrets create gemini-api-key --data-file=-

# Database URL (se PostgreSQL)
echo -n "postgresql://user:pass@host/db" | \
  gcloud secrets create database-url --data-file=-

# JWT Secret
echo -n "seu-jwt-secret-super-secreto" | \
  gcloud secrets create jwt-secret --data-file=-
```

### Dar Acesso ao Cloud Run

```bash
# Obter service account do Cloud Run
SERVICE_ACCOUNT=$(gcloud run services describe medfocus-backend \
  --region=us-central1 \
  --format="value(spec.template.spec.serviceAccountName)")

# Conceder acesso aos secrets
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor"
```

### Atualizar Cloud Run com Secrets

```bash
gcloud run services update medfocus-backend \
  --region=us-central1 \
  --update-secrets=GEMINI_API_KEY=gemini-api-key:latest \
  --update-secrets=DATABASE_URL=database-url:latest \
  --update-secrets=JWT_SECRET=jwt-secret:latest
```

---

## 📦 Deploy das Cloud Functions

### Deploy PubMed Ingestion

```bash
cd gcp/cloud-functions/pubmed-ingestion

gcloud functions deploy pubmed-ingestion \
  --gen2 \
  --runtime=python39 \
  --region=us-central1 \
  --source=. \
  --entry-point=pubmed_ingestion_handler \
  --trigger-http \
  --memory=512MB \
  --timeout=540s \
  --set-env-vars=GCP_PROJECT_ID=$GCP_PROJECT_ID
```

### Deploy ANVISA/FDA Ingestion

```bash
cd ../anvisa-fda-ingestion

gcloud functions deploy anvisa-fda-ingestion \
  --gen2 \
  --runtime=python39 \
  --region=us-central1 \
  --source=. \
  --entry-point=anvisa_fda_ingestion_handler \
  --trigger-http \
  --memory=512MB \
  --timeout=540s \
  --set-env-vars=GCP_PROJECT_ID=$GCP_PROJECT_ID
```

### Deploy Document AI Processor

```bash
cd ../document-ai-processor

gcloud functions deploy document-ai-processor \
  --gen2 \
  --runtime=python39 \
  --region=us-central1 \
  --source=. \
  --entry-point=document_ai_handler \
  --trigger-bucket=medfocus-guidelines-upload \
  --memory=1GB \
  --timeout=540s \
  --set-env-vars=GCP_PROJECT_ID=$GCP_PROJECT_ID
```

---

## ⏰ Configurar Cloud Scheduler

### Job Semanal - PubMed

```bash
gcloud scheduler jobs create http pubmed-weekly \
  --location=us-central1 \
  --schedule="0 2 * * 1" \
  --time-zone="America/Sao_Paulo" \
  --uri="https://us-central1-$GCP_PROJECT_ID.cloudfunctions.net/pubmed-ingestion" \
  --http-method=POST
```

### Job Diário - ANVISA/FDA

```bash
gcloud scheduler jobs create http anvisa-fda-daily \
  --location=us-central1 \
  --schedule="0 3 * * *" \
  --time-zone="America/Sao_Paulo" \
  --uri="https://us-central1-$GCP_PROJECT_ID.cloudfunctions.net/anvisa-fda-ingestion" \
  --http-method=POST
```

---

## 🌐 Deploy do Frontend (Opção Vercel - Mais Rápido)

### Via Vercel CLI

```bash
# Instale Vercel CLI
npm install -g vercel

# Deploy
cd medfocus-app-001
vercel --prod

# Configure variáveis de ambiente no dashboard Vercel:
# VITE_API_URL = sua-url-cloud-run
```

### Via GitHub Integration

1. Vá para https://vercel.com
2. Import repository: `rrodrigogon-byte/medfocus-app-001`
3. Configure:
   - Framework: Vite
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Environment Variables:
   - `VITE_API_URL` = URL do Cloud Run

---

## ✅ Verificação de Deploy

### Health Checks

```bash
# Backend
curl https://seu-servico-cloud-run.run.app/health

# Esperado: {"status":"ok","timestamp":"..."}

# Cloud Functions
gcloud functions call pubmed-ingestion --region=us-central1
```

### Monitoramento

```bash
# Logs do Cloud Run
gcloud run services logs read medfocus-backend --region=us-central1

# Logs das Cloud Functions
gcloud functions logs read pubmed-ingestion --region=us-central1
```

---

## 💰 Estimativa de Custos Mensal

| Serviço | Custo USD | Custo BRL |
|---------|-----------|-----------|
| Cloud Run (backend) | $60 | R$ 300 |
| Cloud Functions (3x) | $5 | R$ 25 |
| BigQuery (100GB) | $22.50 | R$ 112 |
| Cloud Storage (500GB) | $10 | R$ 50 |
| Firestore | $6 | R$ 30 |
| Vertex AI (1M tokens) | $70 | R$ 350 |
| Document AI | $15 | R$ 75 |
| Pub/Sub | $4 | R$ 20 |
| Cloud CDN (1TB) | $85 | R$ 425 |
| **TOTAL** | **~$273** | **~R$ 1.365** |

---

## 🐛 Troubleshooting

### Erro: "Permission denied"

```bash
# Verifique permissões
gcloud projects get-iam-policy $GCP_PROJECT_ID

# Adicione role de editor ao seu usuário
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="user:seu-email@gmail.com" \
  --role="roles/editor"
```

### Erro: "Quota exceeded"

```bash
# Verifique quotas
gcloud compute project-info describe --project=$GCP_PROJECT_ID

# Solicite aumento via console GCP
```

### Build timeout

```bash
# Aumentar timeout do Cloud Build
gcloud builds submit --timeout=30m --tag gcr.io/$GCP_PROJECT_ID/medfocus-backend
```

---

## 📞 Suporte

- **Documentação GCP**: https://cloud.google.com/run/docs
- **GitHub Issues**: https://github.com/rrodrigogon-byte/medfocus-app-001/issues
- **Guia Completo**: Ver `gcp/GCP_DEPLOY_GUIDE.md`

---

## 🎉 Próximos Passos Após Deploy

1. ✅ Acesse a URL do Cloud Run
2. ✅ Configure domínio customizado (opcional)
3. ✅ Configure CDN para frontend
4. ✅ Habilite monitoramento e alertas
5. ✅ Configure backups automáticos
6. ✅ Teste end-to-end

---

**Tempo total estimado**: 15-20 minutos  
**Dificuldade**: Intermediária  
**Resultado**: Sistema em produção no GCP

🚀 **Bom deploy!**
