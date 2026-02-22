# MedFocus PhD - Guia de Deploy GCP

## 📋 Índice
- [Pré-requisitos](#pré-requisitos)
- [Arquitetura GCP](#arquitetura-gcp)
- [Setup Inicial](#setup-inicial)
- [Deploy dos Componentes](#deploy-dos-componentes)
- [Configuração de APIs Externas](#configuração-de-apis-externas)
- [Monitoramento](#monitoramento)
- [Custos Estimados](#custos-estimados)

---

## 🎯 Pré-requisitos

### Conta GCP

1. **Criar Projeto GCP**:
   ```bash
   gcloud projects create medfocus-phd-prod --name="MedFocus PhD Production"
   gcloud config set project medfocus-phd-prod
   ```

2. **Habilitar Billing**:
   - Vincular conta de cobrança ao projeto
   - Configurar alertas de budget

3. **Habilitar APIs necessárias**:
   ```bash
   gcloud services enable \
     cloudfunctions.googleapis.com \
     bigquery.googleapis.com \
     storage.googleapis.com \
     documentai.googleapis.com \
     aiplatform.googleapis.com \
     pubsub.googleapis.com \
     firestore.googleapis.com \
     cloudscheduler.googleapis.com \
     apigee.googleapis.com
   ```

### Ferramentas Locais

```bash
# Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Terraform (opcional, mas recomendado)
brew install terraform  # macOS
# ou
sudo apt-get install terraform  # Linux

# Python 3.9+
python --version  # deve ser >= 3.9
```

---

## 🏗️ Arquitetura GCP

```
┌─────────────────────────────────────────────────────────────────┐
│                      INTERNET / USUÁRIOS                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────────┐  ┌─────────────┐
│   Cloud      │  │   Apigee API     │  │  Firebase   │
│   Load       │  │   Gateway        │  │    Auth     │
│   Balancer   │  │  (Partner API)   │  │             │
└──────┬───────┘  └────────┬─────────┘  └──────┬──────┘
       │                   │                    │
       │         ┌─────────┴─────────┬──────────┘
       │         │                   │
       ▼         ▼                   ▼
┌──────────────────────────────────────────┐
│         Cloud Run (Backend API)          │
│        Express + tRPC + WebSockets       │
└────────────────┬─────────────────────────┘
                 │
    ┌────────────┼────────────┬─────────────┬────────────┐
    │            │            │             │            │
    ▼            ▼            ▼             ▼            ▼
┌────────┐  ┌─────────┐  ┌────────┐  ┌──────────┐  ┌─────────┐
│ Cloud  │  │ Cloud   │  │Document│  │ Vertex   │  │ Cloud   │
│ Func   │  │ Func    │  │   AI   │  │   AI     │  │ Pub/Sub │
│ PubMed │  │ANVISA   │  │Processor│ │ (Gemini) │  │(Alerts) │
│        │  │   FDA   │  │        │  │          │  │         │
└───┬────┘  └────┬────┘  └───┬────┘  └────┬─────┘  └────┬────┘
    │            │           │            │             │
    │            │           │            │             │
    └────────────┴───────────┴────────────┴─────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
           ┌────▼─────┐            ┌─────▼──────┐
           │ BigQuery │            │ Firestore  │
           │(Data     │            │ (Realtime  │
           │Warehouse)│            │   Data)    │
           └──────────┘            └────────────┘
```

---

## 🚀 Setup Inicial

### 1. Criar Buckets GCS

```bash
# Bucket para Cloud Functions
gsutil mb -p medfocus-phd-prod -c STANDARD -l us-central1 \
  gs://medfocus-cloud-functions

# Bucket para uploads de diretrizes (PDFs)
gsutil mb -p medfocus-phd-prod -c STANDARD -l us-central1 \
  gs://medfocus-guidelines-upload

# Bucket para dados processados
gsutil mb -p medfocus-phd-prod -c STANDARD -l us-central1 \
  gs://medfocus-processed-data
```

### 2. Criar Datasets BigQuery

```bash
# Dataset para dados brutos
bq mk --dataset \
  --location=US \
  --description="Raw data from external APIs" \
  medfocus-phd-prod:medfocus_raw_data

# Dataset para dados processados
bq mk --dataset \
  --location=US \
  --description="Processed and validated data" \
  medfocus-phd-prod:medfocus_processed_data

# Dataset para analytics
bq mk --dataset \
  --location=US \
  --description="Analytics and metrics" \
  medfocus-phd-prod:medfocus_analytics
```

### 3. Criar Tabelas BigQuery

```bash
# Tabela de artigos PubMed
bq mk --table \
  medfocus-phd-prod:medfocus_raw_data.pubmed_articles \
  gcp/config/schemas/pubmed_articles_schema.json

# Tabela de medicamentos ANVISA
bq mk --table \
  medfocus-phd-prod:medfocus_raw_data.anvisa_drugs \
  gcp/config/schemas/anvisa_drugs_schema.json

# Tabela de diretrizes parseadas
bq mk --table \
  medfocus-phd-prod:medfocus_raw_data.parsed_guidelines \
  gcp/config/schemas/parsed_guidelines_schema.json
```

### 4. Configurar Firestore

```bash
# Criar banco Firestore (modo Native)
gcloud firestore databases create \
  --region=us-central1

# Collections serão criadas automaticamente pelo código
```

### 5. Criar Tópicos Pub/Sub

```bash
# Tópico para alertas de segurança
gcloud pubsub topics create medfocus-drug-alerts

# Tópico para validação de conteúdo
gcloud pubsub topics create medfocus-content-validation

# Criar subscrições
gcloud pubsub subscriptions create medfocus-alerts-sub \
  --topic=medfocus-drug-alerts

gcloud pubsub subscriptions create medfocus-validation-sub \
  --topic=medfocus-content-validation
```

---

## 📦 Deploy dos Componentes

### 1. Cloud Function: PubMed Ingestion

```bash
cd gcp/cloud-functions/pubmed-ingestion

# Deploy
gcloud functions deploy pubmed-ingestion \
  --gen2 \
  --runtime=python39 \
  --region=us-central1 \
  --source=. \
  --entry-point=pubmed_ingestion_handler \
  --trigger-http \
  --allow-unauthenticated=false \
  --memory=512MB \
  --timeout=540s \
  --set-env-vars=GCP_PROJECT_ID=medfocus-phd-prod \
  --service-account=cloud-functions@medfocus-phd-prod.iam.gserviceaccount.com
```

### 2. Cloud Function: ANVISA/FDA Ingestion

```bash
cd ../anvisa-fda-ingestion

gcloud functions deploy anvisa-fda-ingestion \
  --gen2 \
  --runtime=python39 \
  --region=us-central1 \
  --source=. \
  --entry-point=anvisa_fda_ingestion_handler \
  --trigger-http \
  --allow-unauthenticated=false \
  --memory=512MB \
  --timeout=540s \
  --set-env-vars=GCP_PROJECT_ID=medfocus-phd-prod \
  --service-account=cloud-functions@medfocus-phd-prod.iam.gserviceaccount.com
```

### 3. Cloud Function: Document AI Processor

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
  --set-env-vars=\
GCP_PROJECT_ID=medfocus-phd-prod,\
DOCUMENT_AI_PROCESSOR_ID=YOUR_PROCESSOR_ID,\
GCS_BUCKET_NAME=medfocus-guidelines-upload \
  --service-account=cloud-functions@medfocus-phd-prod.iam.gserviceaccount.com
```

### 4. Configurar Cloud Scheduler

```bash
# Job semanal - PubMed
gcloud scheduler jobs create http pubmed-weekly \
  --location=us-central1 \
  --schedule="0 2 * * 1" \
  --time-zone="America/Sao_Paulo" \
  --uri="https://us-central1-medfocus-phd-prod.cloudfunctions.net/pubmed-ingestion" \
  --http-method=POST \
  --oidc-service-account-email=cloud-scheduler@medfocus-phd-prod.iam.gserviceaccount.com

# Job diário - ANVISA/FDA
gcloud scheduler jobs create http anvisa-fda-daily \
  --location=us-central1 \
  --schedule="0 3 * * *" \
  --time-zone="America/Sao_Paulo" \
  --uri="https://us-central1-medfocus-phd-prod.cloudfunctions.net/anvisa-fda-ingestion" \
  --http-method=POST \
  --oidc-service-account-email=cloud-scheduler@medfocus-phd-prod.iam.gserviceaccount.com
```

### 5. Deploy Backend (Cloud Run)

```bash
cd /home/user/webapp

# Build container
gcloud builds submit --tag gcr.io/medfocus-phd-prod/backend

# Deploy to Cloud Run
gcloud run deploy medfocus-backend \
  --image gcr.io/medfocus-phd-prod/backend \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --min-instances 1 \
  --max-instances 10 \
  --set-env-vars=\
NODE_ENV=production,\
DATABASE_URL="postgresql://...",\
GEMINI_API_KEY="...",\
BQ_PROJECT_ID=medfocus-phd-prod
```

### 6. Deploy Frontend (Cloud Storage + CDN)

```bash
# Build frontend
pnpm run build

# Upload to GCS
gsutil -m rsync -r -d dist/ gs://medfocus-frontend

# Configurar como website
gsutil web set -m index.html -e 404.html gs://medfocus-frontend

# Configurar Cloud CDN (via console ou gcloud)
```

---

## 🔑 Configuração de APIs Externas

### PubMed (NCBI)

1. Registre-se em: https://www.ncbi.nlm.nih.gov/account/
2. Obtenha API key em: https://www.ncbi.nlm.nih.gov/account/settings/
3. Adicione ao Secret Manager:

```bash
echo -n "YOUR_PUBMED_API_KEY" | \
  gcloud secrets create pubmed-api-key \
  --replication-policy="automatic" \
  --data-file=-
```

### Gemini / Vertex AI

```bash
# Criar API key no AI Studio: https://ai.google.dev/
echo -n "YOUR_GEMINI_API_KEY" | \
  gcloud secrets create gemini-api-key \
  --replication-policy="automatic" \
  --data-file=-
```

### Document AI

```bash
# Criar processor
gcloud documentai processors create \
  --location=us \
  --type=HEALTH_CARE_EXTRACTION \
  --display-name="MedFocus Guidelines Processor"

# Anotar o PROCESSOR_ID retornado
```

---

## 📊 Monitoramento

### Dashboards

```bash
# Criar dashboard de métricas
gcloud monitoring dashboards create --config-from-file=gcp/config/monitoring-dashboard.json
```

### Alertas

```bash
# Alerta de erro rate alto
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="High Error Rate" \
  --condition-display-name="Error rate > 5%" \
  --condition-threshold-value=0.05 \
  --condition-threshold-duration=300s
```

### Logs

```bash
# Ver logs em tempo real
gcloud functions logs read pubmed-ingestion --limit 50 --region us-central1

# Buscar erros
gcloud logging read "severity>=ERROR" --limit 50 --format json
```

---

## 💰 Custos Estimados (Mensal)

| Serviço | Uso Estimado | Custo USD |
|---------|--------------|-----------|
| **Cloud Functions** | 1M invocações | $0.40 |
| **Cloud Run** | 1M requests | $60.00 |
| **BigQuery** | 100GB storage, 500GB processed | $22.50 |
| **Cloud Storage** | 500GB | $10.00 |
| **Firestore** | 10M reads, 1M writes | $6.00 |
| **Vertex AI** (Gemini) | 1M tokens | $70.00 |
| **Document AI** | 1000 páginas | $15.00 |
| **Pub/Sub** | 100M mensagens | $4.00 |
| **Cloud CDN** | 1TB egress | $85.00 |
| **Cloud Scheduler** | 2 jobs | $0.20 |
| **TOTAL** | | **~$273/mês** |

**Otimizações**:
- Usar Committed Use Discounts (CUD) → economizar 30-50%
- Cache CDN agressivo → reduzir Cloud Run calls
- Batch processing → reduzir Cloud Functions invocations

---

## 🔒 Segurança

### IAM Roles

```bash
# Service account para Cloud Functions
gcloud iam service-accounts create cloud-functions \
  --display-name="Cloud Functions Service Account"

# Conceder permissões
gcloud projects add-iam-policy-binding medfocus-phd-prod \
  --member="serviceAccount:cloud-functions@medfocus-phd-prod.iam.gserviceaccount.com" \
  --role="roles/bigquery.dataEditor"

gcloud projects add-iam-policy-binding medfocus-phd-prod \
  --member="serviceAccount:cloud-functions@medfocus-phd-prod.iam.gserviceaccount.com" \
  --role="roles/storage.objectViewer"
```

### Secrets Management

```bash
# Criar secret para database URL
echo -n "postgresql://user:pass@host/db" | \
  gcloud secrets create database-url \
  --replication-policy="automatic" \
  --data-file=-

# Conceder acesso ao Cloud Run
gcloud secrets add-iam-policy-binding database-url \
  --member="serviceAccount:CLOUD_RUN_SERVICE_ACCOUNT@medfocus-phd-prod.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## ✅ Checklist de Deploy

- [ ] Projeto GCP criado e billing configurado
- [ ] APIs habilitadas
- [ ] Buckets GCS criados
- [ ] Datasets BigQuery criados
- [ ] Firestore configurado
- [ ] Tópicos Pub/Sub criados
- [ ] Cloud Functions deployed
- [ ] Cloud Scheduler jobs configurados
- [ ] Document AI processor criado
- [ ] Secrets configurados no Secret Manager
- [ ] Backend deployed no Cloud Run
- [ ] Frontend deployed no GCS + CDN
- [ ] Monitoring dashboard configurado
- [ ] Alertas configurados
- [ ] Testes end-to-end executados

---

## 🆘 Troubleshooting

### Cloud Function não executa

```bash
# Verificar logs
gcloud functions logs read FUNCTION_NAME --limit 100

# Verificar IAM
gcloud functions describe FUNCTION_NAME --region us-central1
```

### BigQuery insert falha

```bash
# Verificar schema da tabela
bq show --schema --format=prettyjson medfocus-phd-prod:medfocus_raw_data.TABLE_NAME

# Testar insert manual
bq query --use_legacy_sql=false 'SELECT * FROM `medfocus-phd-prod.medfocus_raw_data.TABLE_NAME` LIMIT 10'
```

### Document AI timeout

- Aumentar `--timeout` para 540s
- Processar PDFs menores que 50 páginas por vez
- Usar batch processing para PDFs grandes

---

**Versão**: 1.0.0  
**Última atualização**: 2026-02-22  
**Autor**: MedFocus Team
