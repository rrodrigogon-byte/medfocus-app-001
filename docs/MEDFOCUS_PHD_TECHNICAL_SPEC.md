# 🎓 MedFocus PhD - Especificação Técnica Completa
## Terminal de Inteligência Clínica de Próxima Geração

> **Versão:** 1.0  
> **Data:** Fevereiro 2026  
> **Status:** Especificação Técnica - Ready for Implementation  
> **Objetivo:** Superar Whitebook, UpToDate e AMBOSS com inteligência clínica em tempo real

---

## 📋 Índice

1. [Visão e Posicionamento](#visão-e-posicionamento)
2. [Arquitetura Técnica GCP](#arquitetura-técnica-gcp)
3. [Data Lakehouse Médico](#data-lakehouse-médico)
4. [Modelo de Dados Firestore](#modelo-de-dados-firestore)
5. [As 4 Telas Principais](#as-4-telas-principais)
6. [Sistema de Busca Semântica](#sistema-de-busca-semântica)
7. [Integração de APIs Externas](#integração-de-apis-externas)
8. [Sistema de Curadoria e Trust Layer](#sistema-de-curadoria-e-trust-layer)
9. [Stack Tecnológica Completa](#stack-tecnológica-completa)
10. [Roadmap de Implementação](#roadmap-de-implementação)
11. [Estimativas e Recursos](#estimativas-e-recursos)

---

## 🎯 Visão e Posicionamento

### O Problema

**Whitebook, UpToDate e AMBOSS** são ferramentas passivas de consulta:
- ❌ Dados estáticos (atualizações lentas)
- ❌ Busca por palavra-chave (não entende contexto)
- ❌ Sem integração com fontes regulatórias em tempo real
- ❌ Não diferencia urgência vs profundidade acadêmica
- ❌ Zero colaboração da comunidade médica

### A Solução: MedFocus PhD

**Terminal de Inteligência Clínica** que opera em 3 camadas:

#### Camada 1: Plantão (Always Available)
- ⚡ **SLA: 99.99% uptime**
- 📱 Offline-first (cache local de condutas essenciais)
- 🚀 Resposta < 200ms
- 💊 Doses, calculadoras, fluxogramas de emergência

#### Camada 2: Especialista (Clinical Decision Support)
- 🧠 Busca semântica com contexto clínico
- 📊 Critérios diagnósticos detalhados
- 💉 Drug interactions em tempo real
- 🔬 Guidelines das sociedades médicas

#### Camada 3: PhD/Frontier (Research Intelligence)
- 📚 Últimos 5 RCTs de cada patologia
- 🧬 Mecanismos moleculares interativos
- 📈 Gráficos de trials com endpoints
- 📖 Exportação de citações (BibTeX, RIS, ABNT)
- 🌐 Alertas de novos estudos (PubMed)

### Diferencial Competitivo

| Recurso | Whitebook | UpToDate | AMBOSS | **MedFocus PhD** |
|---------|-----------|----------|--------|------------------|
| **Condutas Básicas** | ✅ | ✅ | ✅ | ✅✅ (offline) |
| **Busca Semântica** | ❌ | ⚠️ | ⚠️ | ✅✅ (NLP) |
| **Integração ANVISA** | ❌ | ❌ | ❌ | ✅✅ (real-time) |
| **Alertas FDA** | ❌ | ⚠️ | ❌ | ✅✅ |
| **PubMed Live** | ❌ | ⚠️ | ⚠️ | ✅✅ (últimos 5 RCTs) |
| **Modo PhD** | ❌ | ❌ | ❌ | ✅✅ (único) |
| **Colaboração Médica** | ❌ | ❌ | ❌ | ✅✅ (verificada) |
| **Exportação Citações** | ❌ | ❌ | ❌ | ✅✅ (BibTeX/RIS) |
| **Transparência (Audit Trail)** | ❌ | ❌ | ❌ | ✅✅ |
| **Preço (estudante)** | 💰💰 | 💰💰💰 | 💰💰 | 💰 (freemium) |

---

## 🏗️ Arquitetura Técnica GCP

### Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────┤
│  Flutter App (iOS/Android)    │    React Web (PWA)          │
│  - Offline-first (Hive)       │    - Service Worker         │
│  - Local cache (50MB)         │    - IndexedDB cache        │
└──────────────────┬────────────────────────────┬─────────────┘
                   │                            │
                   ▼                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  GOOGLE CLOUD PLATFORM                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         CLOUD LOAD BALANCER (Global)               │    │
│  │         - SSL Termination                          │    │
│  │         - DDoS Protection                          │    │
│  └──────────────────┬─────────────────────────────────┘    │
│                     │                                       │
│     ┌───────────────┼───────────────────┐                  │
│     ▼               ▼                   ▼                   │
│  ┌─────────┐  ┌──────────┐      ┌─────────────┐           │
│  │   API   │  │  Search  │      │   Static    │           │
│  │ Gateway │  │  Engine  │      │   Assets    │           │
│  │  (Kong) │  │  (Algolia│      │  (CDN/GCS)  │           │
│  └────┬────┘  │   or     │      └─────────────┘           │
│       │       │ Elastic) │                                 │
│       │       └─────┬────┘                                 │
│       │             │                                       │
│  ┌────┴─────────────┴────────────────────────────────┐    │
│  │          MICROSERVICES (Cloud Run)                │    │
│  ├───────────────────────────────────────────────────┤    │
│  │                                                    │    │
│  │  ┌──────────────┐  ┌──────────────┐             │    │
│  │  │   Auth       │  │   Content    │             │    │
│  │  │   Service    │  │   Service    │             │    │
│  │  │ (Always On)  │  │ (Auto-scale) │             │    │
│  │  └──────────────┘  └──────────────┘             │    │
│  │                                                    │    │
│  │  ┌──────────────┐  ┌──────────────┐             │    │
│  │  │   Clinical   │  │   Drug       │             │    │
│  │  │   Decision   │  │   Database   │             │    │
│  │  │   Service    │  │   Service    │             │    │
│  │  └──────────────┘  └──────────────┘             │    │
│  │                                                    │    │
│  │  ┌──────────────┐  ┌──────────────┐             │    │
│  │  │   Research   │  │   Integration│             │    │
│  │  │   Service    │  │   Service    │             │    │
│  │  │   (PhD Mode) │  │ (APIs ext.)  │             │    │
│  │  └──────────────┘  └──────────────┘             │    │
│  │                                                    │    │
│  │  ┌──────────────┐  ┌──────────────┐             │    │
│  │  │ Collaboration│  │  Analytics   │             │    │
│  │  │   Service    │  │   Service    │             │    │
│  │  └──────────────┘  └──────────────┘             │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              DATA LAYER                            │    │
│  ├────────────────────────────────────────────────────┤    │
│  │                                                     │    │
│  │  ┌──────────────┐  ┌──────────────┐              │    │
│  │  │   Firestore  │  │   BigQuery   │              │    │
│  │  │ (Operational)│  │ (Data Lake)  │              │    │
│  │  │  - Real-time │  │  - Analytics │              │    │
│  │  │  - User data │  │  - ML models │              │    │
│  │  └──────────────┘  └──────────────┘              │    │
│  │                                                     │    │
│  │  ┌──────────────┐  ┌──────────────┐              │    │
│  │  │  Cloud SQL   │  │   Memorystore│              │    │
│  │  │ (PostgreSQL) │  │    (Redis)   │              │    │
│  │  │  - Relations │  │  - Caching   │              │    │
│  │  └──────────────┘  └──────────────┘              │    │
│  │                                                     │    │
│  │  ┌──────────────┐  ┌──────────────┐              │    │
│  │  │ Cloud Storage│  │  Vertex AI   │              │    │
│  │  │ (GCS Bucket) │  │  - NLP/LLM   │              │    │
│  │  │  - PDFs/Imgs │  │  - Embeddings│              │    │
│  │  └──────────────┘  └──────────────┘              │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         INTEGRATION LAYER (Cloud Tasks)            │    │
│  ├────────────────────────────────────────────────────┤    │
│  │                                                     │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │    │
│  │  │  ANVISA  │  │ OpenFDA  │  │  PubMed  │        │    │
│  │  │  Crawler │  │   API    │  │   API    │        │    │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘        │    │
│  │       │             │             │               │    │
│  │       └─────────────┼─────────────┘               │    │
│  │                     │                              │    │
│  │              ┌──────▼──────┐                      │    │
│  │              │  BigQuery   │                      │    │
│  │              │  Ingestion  │                      │    │
│  │              └─────────────┘                      │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         OBSERVABILITY (Cloud Monitoring)           │    │
│  ├────────────────────────────────────────────────────┤    │
│  │  - Cloud Logging                                   │    │
│  │  - Cloud Trace                                     │    │
│  │  - Error Reporting                                 │    │
│  │  - Uptime Checks                                   │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Microserviços Detalhados

#### 1. **Auth Service** (Always-On)
**Responsabilidade:** Autenticação e autorização  
**Stack:** Node.js + Express + Firebase Auth  
**SLA:** 99.99%  
**Scaling:** Sempre 3+ instâncias (multi-region)

**Endpoints:**
```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
GET    /auth/verify-token
POST   /auth/verify-crm  (verifica CRM médico)
```

**Features:**
- JWT com refresh tokens
- OAuth2 (Google, Facebook)
- 2FA (TOTP)
- Verificação de CRM (integração CFM)
- Rate limiting (100 req/min por IP)

---

#### 2. **Content Service** (Auto-scale)
**Responsabilidade:** Gerenciamento de conteúdo médico (condutas, protocolos)  
**Stack:** Node.js + Express + Firestore  
**SLA:** 99.9%  
**Scaling:** Auto-scale (1-20 instâncias)

**Endpoints:**
```
GET    /content/conduct/:id
GET    /content/search
GET    /content/pathology/:cid
POST   /content/contribute  (médicos verificados)
GET    /content/updates     (changelog)
```

**Features:**
- Versionamento de conteúdo (Git-like)
- Aprovação por curadoria (3 médicos)
- Cache agressivo (Redis, 1h TTL)
- Offline package generation

---

#### 3. **Clinical Decision Service** (Critical)
**Responsabilidade:** Calculadoras, algoritmos clínicos, scores  
**Stack:** Python + FastAPI + NumPy  
**SLA:** 99.9%  
**Scaling:** Auto-scale (2-10 instâncias)

**Endpoints:**
```
POST   /calculate/risk-score
POST   /calculate/drug-dose
POST   /calculate/clearance
GET    /algorithms/tree/:condition
```

**Features:**
- 100+ calculadoras médicas
- Algoritmos de decisão (árvores)
- Ajuste de dose renal/hepático
- Interações medicamentosas

---

#### 4. **Drug Database Service**
**Responsabilidade:** Banco de dados de medicamentos  
**Stack:** Node.js + PostgreSQL + Redis  
**SLA:** 99.9%  
**Scaling:** Auto-scale (2-10 instâncias)

**Endpoints:**
```
GET    /drug/search?q=enalapril
GET    /drug/:id/interactions
GET    /drug/:id/dosage
POST   /drug/check-interactions  (múltiplos medicamentos)
GET    /drug/class/:therapeutic-class
```

**Fonte de Dados:**
- ANVISA Bulário Eletrônico (scraping diário)
- DrugBank (open data)
- Rename (Ministério da Saúde)
- OpenFDA (alertas internacionais)

---

#### 5. **Research Service (PhD Mode)**
**Responsabilidade:** Integração com literatura científica  
**Stack:** Python + FastAPI + Vertex AI  
**SLA:** 99.5%  
**Scaling:** Auto-scale (1-5 instâncias)

**Endpoints:**
```
GET    /research/pubmed/latest/:condition
POST   /research/export-citations
GET    /research/rct/:disease  (últimos 5 RCTs)
GET    /research/guidelines/:society
POST   /research/ai-summary   (Vertex AI summarization)
```

**Features:**
- PubMed E-utilities integration
- Filtros automáticos (RCTs, meta-análises)
- Exportação BibTeX/RIS/ABNT
- Summarization com Gemini/Vertex AI
- Alert system (novos estudos)

---

#### 6. **Integration Service**
**Responsabilidade:** Integração com APIs externas  
**Stack:** Python + FastAPI + Cloud Tasks  
**SLA:** 95% (não-crítico)  
**Scaling:** Auto-scale (1-5 instâncias)

**APIs Integradas:**

**ANVISA (Brasil):**
- DOU (Diário Oficial da União) scraping
- Bulário Eletrônico
- Alertas de farmacovigilância
- Registro de genéricos

**OpenFDA (EUA):**
```
https://api.fda.gov/drug/label.json
https://api.fda.gov/drug/event.json  (adverse events)
```

**NCBI PubMed:**
```
https://eutils.ncbi.nlm.nih.gov/entrez/eutils/
```

**Sociedades Médicas:**
- SBC (Sociedade Brasileira de Cardiologia) - RSS feed
- SBPT (Pneumologia) - PDF parsing
- AHA (American Heart Association) - API
- ESC (European Society of Cardiology) - RSS

---

#### 7. **Collaboration Service**
**Responsabilidade:** Discussões, contribuições da comunidade  
**Stack:** Node.js + Firestore + Cloud Pub/Sub  
**SLA:** 99%  
**Scaling:** Auto-scale (1-5 instâncias)

**Endpoints:**
```
GET    /collab/threads/:conduct-id
POST   /collab/thread
POST   /collab/reply
POST   /collab/vote
POST   /collab/report  (denúncia)
GET    /collab/feed    (timeline)
```

**Features:**
- Threads de discussão por conduta
- Upvote/Downvote (Reddit-like)
- Moderação por badges (médicos verificados)
- Feed de atividades
- Notificações real-time (Firestore listeners)

---

#### 8. **Analytics Service**
**Responsabilidade:** Tracking, métricas, ML  
**Stack:** Python + BigQuery + Vertex AI  
**SLA:** 95%  
**Scaling:** Auto-scale (1-3 instâncias)

**Endpoints:**
```
POST   /analytics/track-event
GET    /analytics/user-stats/:user-id
GET    /analytics/content-popularity
POST   /analytics/predict-needs  (ML recommendation)
```

**Features:**
- Event tracking (busca, leitura, calculadoras)
- User behavior analysis
- Content recommendation (Vertex AI)
- A/B testing framework

---

## 🗄️ Data Lakehouse Médico

### Arquitetura do Data Lake (BigQuery)

```
BigQuery Dataset: medfocus_lakehouse
├── raw_data/
│   ├── anvisa_raw           (dados brutos ANVISA)
│   ├── fda_raw              (dados brutos FDA)
│   ├── pubmed_raw           (artigos PubMed)
│   └── guidelines_raw       (PDFs de sociedades)
│
├── processed/
│   ├── drugs_processed      (medicamentos normalizados)
│   ├── studies_processed    (RCTs processados)
│   ├── guidelines_processed (diretrizes estruturadas)
│   └── alerts_processed     (alertas consolidados)
│
├── enriched/
│   ├── drug_interactions    (matriz de interações)
│   ├── evidence_scores      (scores de evidência)
│   ├── clinical_pathways    (fluxogramas decisão)
│   └── embeddings           (vetores semânticos - Vertex AI)
│
└── analytics/
    ├── user_behavior        (eventos de uso)
    ├── content_performance  (popularidade de conteúdo)
    ├── search_queries       (queries e resultados)
    └── ml_features          (features para modelos)
```

### Pipeline de Ingestão

**Diário (Cloud Scheduler + Cloud Functions):**
```python
# Cloud Function: anvisa_daily_scraper
def scrape_anvisa(event, context):
    """
    Scrape ANVISA DOU para novos registros de medicamentos
    """
    dou_url = "https://www.in.gov.br/consulta"
    # Scraping logic
    # Parse HTML
    # Insert into BigQuery raw_data/anvisa_raw
    # Trigger Cloud Task para processamento
```

**Horário (a cada 6h):**
```python
# Cloud Function: fda_alerts_fetcher
def fetch_fda_alerts(event, context):
    """
    Busca novos alertas no OpenFDA
    """
    url = "https://api.fda.gov/drug/event.json?limit=100"
    # Fetch API
    # Insert into BigQuery raw_data/fda_raw
```

**Semanal:**
```python
# Cloud Function: guidelines_updater
def update_guidelines(event, context):
    """
    Checa RSS feeds de sociedades médicas
    """
    societies = ['SBC', 'SBPT', 'AHA', 'ESC']
    for society in societies:
        # Fetch RSS
        # Download PDF se novo
        # Upload to GCS
        # Trigger Vertex AI Document AI para parsing
```

### Processamento (Cloud Dataflow)

**Pipeline: Drug Enrichment**
```python
import apache_beam as beam

def enrich_drug_data(element):
    """
    Enriquecer dados de medicamento com múltiplas fontes
    """
    drug = element
    
    # Buscar ANVISA
    anvisa_data = fetch_anvisa(drug['name'])
    
    # Buscar FDA
    fda_data = fetch_fda(drug['name'])
    
    # Buscar DrugBank
    drugbank_data = fetch_drugbank(drug['id'])
    
    # Merge
    enriched = {
        **drug,
        'anvisa': anvisa_data,
        'fda': fda_data,
        'drugbank': drugbank_data,
        'last_updated': datetime.now()
    }
    
    return enriched

# Pipeline
(p
 | 'Read from BigQuery' >> beam.io.ReadFromBigQuery(table='raw_data.drugs')
 | 'Enrich' >> beam.Map(enrich_drug_data)
 | 'Write to BigQuery' >> beam.io.WriteToBigQuery(table='enriched.drugs')
)
```

---

## 📊 Modelo de Dados Firestore

### Estrutura de Documentos

#### Collection: `conducts` (Condutas Médicas)

```json
{
  "id": "conduct_icc_2026",
  "version": "3.2",
  "last_updated": "2026-02-15T10:30:00Z",
  "audit_trail": [
    {
      "editor": "user_dr_joao_123",
      "timestamp": "2026-02-15T10:30:00Z",
      "changes": "Atualização de dose de Sacubitril/Valsartan conforme ESC 2025",
      "approved_by": ["user_dr_maria_456", "user_dr_carlos_789"]
    }
  ],
  
  "pathology": {
    "name": "Insuficiência Cardíaca Congestiva",
    "cid10": "I50.0",
    "cid11": "BA00",
    "synonyms": ["ICC", "IC", "Heart Failure"],
    "category": "Cardiologia"
  },
  
  "layers": {
    "layer_1_plantao": {
      "summary": "IC descompensada: Furosemida 40mg IV, Restrição hídrica, O2 se SpO2 <90%",
      "emergency_flowchart_url": "gs://medfocus/flowcharts/ic_emergency.svg",
      "key_drugs": [
        {
          "drug_id": "drug_furosemida",
          "dose": "40-80mg IV",
          "frequency": "12/12h",
          "route": "Intravenosa",
          "monitoring": "Diurese, eletrólitos, creatinina"
        }
      ],
      "calculators": ["calc_nyha", "calc_dose_furosemida"],
      "evidence_level": "A",
      "guideline": {
        "source": "SBC 2025",
        "url": "https://..."
      }
    },
    
    "layer_2_especialista": {
      "diagnostic_criteria": {
        "framingham": {
          "major": ["Dispneia paroxística noturna", "Edema agudo de pulmão"],
          "minor": ["Hepatomegalia", "Taquicardia >120bpm"]
        },
        "ecocardiograma": {
          "fe_reduced": "<40%",
          "fe_preserved": "≥50%",
          "fe_mid_range": "40-49%"
        }
      },
      
      "treatment_algorithm": {
        "fe_reduced": {
          "step_1": "IECA ou BRA",
          "step_2": "Betabloqueador",
          "step_3": "Espironolactona",
          "step_4": "Sacubitril/Valsartan (se FE <35%)"
        }
      },
      
      "subgroups": [
        {
          "name": "IC com FE preservada",
          "treatment": "Controle de comorbidades, diuréticos se congestão"
        }
      ],
      
      "contraindications": [
        "IECA: Gestação, Angioedema prévio, Estenose bilateral de artéria renal"
      ],
      
      "monitoring": {
        "labs": ["Creatinina", "Potássio", "BNP/NT-proBNP"],
        "imaging": ["Ecocardiograma (6-12 meses)"]
      }
    },
    
    "layer_3_phd": {
      "mechanism": {
        "description": "IC resulta de sobrecarga hemodinâmica crônica → remodelamento ventricular → ativação neuro-hormonal (SNS, SRAA) → retenção de Na/H2O",
        "interactive_diagram_url": "gs://medfocus/diagrams/ic_mechanism_interactive.html"
      },
      
      "latest_rcts": [
        {
          "pmid": "35678901",
          "title": "EMPEROR-Preserved: Empagliflozin in Heart Failure with Preserved EF",
          "year": 2025,
          "journal": "New England Journal of Medicine",
          "n": 5988,
          "primary_endpoint": "CV death or HF hospitalization: HR 0.79 (95% CI 0.69-0.90)",
          "conclusion": "Empagliflozin reduz eventos em IC-FEp",
          "citation_bibtex": "@article{EMPEROR2025, ...}",
          "full_text_url": "https://www.nejm.org/..."
        }
      ],
      
      "molecular_targets": [
        {
          "target": "Neprilisina",
          "drug": "Sacubitril",
          "mechanism": "Inibição da degradação de peptídeos natriuréticos"
        }
      ],
      
      "controversy": [
        {
          "topic": "Timing de Sacubitril/Valsartan",
          "debate": "Iniciar precocemente vs aguardar otimização de IECA/BRA?",
          "references": ["PMID:35678902", "PMID:35678903"]
        }
      ],
      
      "export_citation": {
        "bibtex": "...",
        "ris": "...",
        "abnt": "..."
      }
    }
  },
  
  "trust_seal": {
    "level": "green",  // green, blue, yellow
    "description": "Baseado em Diretriz SBC 2025",
    "validators": [
      {
        "user_id": "user_dr_joao_123",
        "crm": "CRM-SP 123456",
        "specialty": "Cardiologia",
        "institution": "InCor USP",
        "timestamp": "2026-02-15T10:30:00Z"
      }
    ],
    "evidence_grade": "A",
    "last_review": "2026-02-15"
  },
  
  "collaboration": {
    "thread_id": "thread_icc_001",
    "contributions_count": 23,
    "last_contribution": "2026-02-20T14:00:00Z"
  },
  
  "analytics": {
    "views": 15234,
    "unique_users": 3456,
    "avg_time_spent": 245,  // segundos
    "layer_distribution": {
      "layer_1": 0.60,
      "layer_2": 0.30,
      "layer_3": 0.10
    }
  }
}
```

#### Collection: `drugs`

```json
{
  "id": "drug_enalapril_001",
  "generic_name": "Enalapril",
  "brand_names": ["Renitec", "Vasopril", "Eupressin"],
  "therapeutic_class": "IECA (Inibidor da ECA)",
  "atc_code": "C09AA02",
  
  "anvisa": {
    "registration_number": "1234567890",
    "status": "Válido",
    "last_update": "2026-01-15",
    "bula_url": "https://consultas.anvisa.gov.br/..."
  },
  
  "fda": {
    "black_box_warnings": [
      "Contraindicado na gestação - Categoria D"
    ],
    "adverse_events": {
      "total_reports": 15678,
      "serious": 2345,
      "death": 123
    }
  },
  
  "pharmacology": {
    "mechanism": "Inibição da ECA → redução de Angiotensina II → vasodilatação",
    "absorption": "60% oral",
    "half_life": "11 horas (ativo: enalaprilat)",
    "metabolism": "Hepática (pró-droga)",
    "excretion": "Renal (60%)"
  },
  
  "indications": [
    "Hipertensão arterial sistêmica",
    "Insuficiência cardíaca",
    "Pós-IAM com disfunção de VE"
  ],
  
  "contraindications": [
    "Gestação",
    "Angioedema prévio com IECA",
    "Estenose bilateral de artéria renal"
  ],
  
  "dosage": {
    "adult": {
      "has": {
        "initial": "5mg 1x/dia",
        "maintenance": "10-20mg 1-2x/dia",
        "max": "40mg/dia"
      },
      "ic": {
        "initial": "2.5mg 2x/dia",
        "target": "10mg 2x/dia",
        "titration": "Dobrar dose a cada 2 semanas se tolerado"
      }
    },
    "pediatric": {
      "dose": "0.1-0.5 mg/kg/dia",
      "max": "20mg/dia"
    },
    "renal_impairment": {
      "clcr_30_60": "Reduzir 50%",
      "clcr_10_30": "Reduzir 75%",
      "hemodialysis": "2.5mg pós-diálise"
    }
  },
  
  "adverse_effects": {
    "common": ["Tosse seca (10-20%)", "Tontura", "Cefaleia"],
    "serious": ["Angioedema (0.1-0.5%)", "Hipercalemia", "Insuficiência renal aguda"]
  },
  
  "interactions": [
    {
      "drug": "Espironolactona",
      "severity": "moderate",
      "mechanism": "Risco de hipercalemia",
      "management": "Monitorar K+ semanalmente no início"
    },
    {
      "drug": "AINEs",
      "severity": "moderate",
      "mechanism": "Redução do efeito anti-hipertensivo + risco renal",
      "management": "Evitar uso crônico"
    }
  ],
  
  "monitoring": {
    "baseline": ["Creatinina", "Potássio", "PA"],
    "follow_up": ["Creatinina e K+ em 1-2 semanas", "PA em 2-4 semanas"]
  },
  
  "pregnancy": {
    "category": "D",
    "description": "Contraindicado - risco de malformações fetais"
  },
  
  "cost": {
    "brazil": {
      "generic": "R$ 5-15/mês",
      "brand": "R$ 30-50/mês"
    },
    "sus_available": true
  }
}
```

#### Collection: `calculators`

```json
{
  "id": "calc_timi_risk_score",
  "name": "TIMI Risk Score (IAM)",
  "category": "Cardiologia",
  "type": "risk_stratification",
  
  "description": "Estratificação de risco em pacientes com IAM sem supra de ST",
  
  "variables": [
    {
      "id": "age",
      "label": "Idade ≥65 anos",
      "type": "boolean",
      "points": 1
    },
    {
      "id": "risk_factors",
      "label": "≥3 Fatores de risco (HAS, DM, dislipidemia, tabagismo, história familiar)",
      "type": "boolean",
      "points": 1
    },
    {
      "id": "known_cad",
      "label": "DAC conhecida (estenose ≥50%)",
      "type": "boolean",
      "points": 1
    },
    {
      "id": "aspirin",
      "label": "Uso de AAS nos últimos 7 dias",
      "type": "boolean",
      "points": 1
    },
    {
      "id": "angina",
      "label": "Angina grave (≥2 episódios em 24h)",
      "type": "boolean",
      "points": 1
    },
    {
      "id": "st_deviation",
      "label": "Desvio de ST ≥0.5mm",
      "type": "boolean",
      "points": 1
    },
    {
      "id": "troponin",
      "label": "Troponina elevada",
      "type": "boolean",
      "points": 1
    }
  ],
  
  "interpretation": {
    "0-1": {
      "risk": "Baixo",
      "mortality_14d": "4.7%",
      "recommendation": "Considerar estratégia conservadora"
    },
    "2": {
      "risk": "Baixo-Intermediário",
      "mortality_14d": "8.3%",
      "recommendation": "Estratificação invasiva se troponina positiva"
    },
    "3-4": {
      "risk": "Intermediário-Alto",
      "mortality_14d": "13.2%",
      "recommendation": "Estratificação invasiva precoce (<24h)"
    },
    "5-7": {
      "risk": "Alto",
      "mortality_14d": "26.2%",
      "recommendation": "Estratificação invasiva urgente (<2h)"
    }
  },
  
  "references": [
    {
      "citation": "Antman EM, et al. JAMA. 2000;284:835-842.",
      "pmid": "10938172"
    }
  ],
  
  "formula": "sum(points)",
  "unit": "pontos",
  
  "validation": {
    "cohort": "TIMI 11B, ESSENCE",
    "n": 7081,
    "c_statistic": 0.65
  }
}
```

#### Collection: `collaboration_threads`

```json
{
  "id": "thread_icc_debate_sacubitril",
  "conduct_id": "conduct_icc_2026",
  "type": "discussion",
  
  "author": {
    "user_id": "user_dr_ana_987",
    "name": "Dra. Ana Silva",
    "crm": "CRM-RJ 987654",
    "specialty": "Cardiologia",
    "institution": "Hospital Samaritano RJ",
    "verified": true,
    "reputation": 2345
  },
  
  "title": "Timing ideal para iniciar Sacubitril/Valsartan",
  
  "content": "Caros colegas, tenho observado que muitos pacientes com IC-FEr chegam ao ambulatório já em uso de IECA/BRA otimizado. Vocês têm iniciado Sacubitril/Valsartan imediatamente ou aguardam algum período? O PARADIGM-HF exigia 4 semanas de IECA estável, mas será que isso se aplica à prática?",
  
  "created_at": "2026-02-20T14:00:00Z",
  "updated_at": "2026-02-20T14:00:00Z",
  
  "votes": {
    "upvotes": 23,
    "downvotes": 2,
    "score": 21
  },
  
  "replies": [
    {
      "id": "reply_001",
      "author": {
        "user_id": "user_dr_pedro_654",
        "name": "Dr. Pedro Costa",
        "crm": "CRM-SP 654321",
        "specialty": "Cardiologia",
        "verified": true
      },
      "content": "Dra. Ana, excelente pergunta! Na minha prática no InCor, temos iniciado após 4 semanas de IECA estável, conforme protocolo do PARADIGM-HF. Recentemente publicamos um estudo observacional...",
      "created_at": "2026-02-20T15:30:00Z",
      "votes": {
        "upvotes": 18,
        "score": 18
      },
      "references": [
        {
          "pmid": "35678904",
          "title": "Timing of Sacubitril/Valsartan initiation in clinical practice",
          "journal": "Arq Bras Cardiol"
        }
      ]
    }
  ],
  
  "tags": ["IC-FEr", "Sacubitril/Valsartan", "PARADIGM-HF"],
  
  "moderation": {
    "status": "approved",
    "flagged": false,
    "reviewed_by": "moderator_001"
  },
  
  "analytics": {
    "views": 1234,
    "unique_viewers": 567,
    "avg_time_spent": 180
  }
}
```

#### Collection: `user_phd_library` (My PhD)

```json
{
  "user_id": "user_student_maria_123",
  
  "folders": [
    {
      "id": "folder_ic",
      "name": "Insuficiência Cardíaca - Dissertação",
      "created_at": "2026-01-10T10:00:00Z",
      "color": "#FF6B6B"
    }
  ],
  
  "saved_articles": [
    {
      "id": "saved_001",
      "pmid": "35678901",
      "folder_id": "folder_ic",
      "title": "EMPEROR-Preserved: Empagliflozin in Heart Failure with Preserved EF",
      "authors": ["Anker SD", "Butler J"],
      "journal": "N Engl J Med",
      "year": 2025,
      "citation": {
        "bibtex": "@article{Anker2025, ...}",
        "ris": "TY  - JOUR\nAU  - Anker, SD\n...",
        "abnt": "ANKER, SD et al. EMPEROR-Preserved..."
      },
      "notes": "Importante para minha revisão - empagliflozin reduz eventos",
      "highlights": ["HR 0.79", "FEp"],
      "saved_at": "2026-02-15T16:00:00Z"
    }
  ],
  
  "export_history": [
    {
      "id": "export_001",
      "timestamp": "2026-02-20T10:00:00Z",
      "format": "bibtex",
      "articles_count": 45,
      "download_url": "gs://medfocus/exports/user_student_maria_123/export_001.bib"
    }
  ],
  
  "alerts": [
    {
      "id": "alert_001",
      "type": "new_study",
      "condition": "Insuficiência Cardíaca",
      "frequency": "weekly",
      "last_sent": "2026-02-17T09:00:00Z"
    }
  ]
}
```

---

## 🎨 As 4 Telas Principais (UX/UI)

### Tela 1: O "Cockpit" (Home Híbrida)

**Componentes:**

```
┌─────────────────────────────────────────────────────────────┐
│  [🔍 Busca Universal]  [👤 Perfil]  [📚 My PhD]  [⚙️]      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🔍 ┌──────────────────────────────────────────────────┐   │
│     │ "Paciente 70 anos, IC com FE reduzida..."       │   │
│     └──────────────────────────────────────────────────┘   │
│        💡 Sugestões: Insuficiência Cardíaca FEr          │
│                       Dose de Sacubitril/Valsartan       │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  📰 Tendências em Cardiologia (sua especialidade)  │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  🔥 Novo RCT: Empagliflozin em IC-FEp              │   │
│  │     NEJM • Há 2 dias • 1.2k visualizações           │   │
│  │  ────────────────────────────────────────────────    │   │
│  │  📊 Atualização SBC 2026: Diretrizes de IC         │   │
│  │     SBC • Há 1 semana                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ 🧮           │  │ 📋           │  │ 💊           │     │
│  │ Calculadoras │  │ CID-11       │  │ Bulário      │     │
│  │              │  │ Browse       │  │ ANVISA       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  📚 Recentemente Acessado:                                  │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐             │
│  │ IAM STEMI  │ │ Sepse      │ │ PCR        │             │
│  └────────────┘ └────────────┘ └────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- **Busca Universal:** NLP (Vertex AI) para entender queries clínicas
- **Cards de Tendência:** Personalizados por especialidade do usuário
- **Acesso Rápido:** Ícones grandes para calculadoras, CID, bulário
- **Recentemente Acessado:** Histórico de condutas consultadas

---

### Tela 2: Visão em Camadas (O Diferencial)

**Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  ← Voltar    Insuficiência Cardíaca Congestiva             │
│              CID-10: I50.0 | CID-11: BA00                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [Nível 1: Plantão] [Nível 2: Especialista] [Nível 3: PhD] │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  🚨 EMERGÊNCIA - IC DESCOMPENSADA                   │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │                                                       │   │
│  │  📋 Conduta Imediata:                                │   │
│  │  1. O2 se SpO2 <90% (alvo 94-98%)                   │   │
│  │  2. Furosemida 40-80mg IV                            │   │
│  │  3. Restrição hídrica (<1.5L/dia)                    │   │
│  │  4. Monitorar diurese, PA, eletrólitos               │   │
│  │                                                       │   │
│  │  💊 Medicações de Urgência:                          │   │
│  │  ┌───────────────────────────────────────────┐       │   │
│  │  │ Furosemida                                │       │   │
│  │  │ • Dose: 40-80mg IV                        │       │   │
│  │  │ • Frequência: 12/12h                      │       │   │
│  │  │ • Monitorar: K+, Creatinina               │       │   │
│  │  │ [Ver bula] [Interações]                   │       │   │
│  │  └───────────────────────────────────────────┘       │   │
│  │                                                       │   │
│  │  📊 Calculadoras Úteis:                              │   │
│  │  [NYHA Class] [Dose Furosemida] [TFG]               │   │
│  │                                                       │   │
│  │  📄 Fluxograma:                                      │   │
│  │  [Ver Algoritmo de IC Aguda] [Download PDF]         │   │
│  │                                                       │   │
│  │  ✅ Selo: Baseado em Diretriz SBC 2025              │   │
│  │  📚 Referência: Diretriz SBC de IC 2025             │   │
│  │     Última revisão: 15/02/2026                       │   │
│  │     Revisado por: Dr. João Silva (CRM-SP 123456)    │   │
│  │                                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  💬 Discussão (23 contribuições)                            │
│  [Abrir thread] [Adicionar experiência de campo]           │
└─────────────────────────────────────────────────────────────┘
```

**Toggle entre Níveis:**

**Nível 2 (Especialista):** Ativa quando usuário clica no toggle
```
┌─────────────────────────────────────────────────────────────┐
│  📋 CRITÉRIOS DIAGNÓSTICOS                                  │
│                                                              │
│  Framingham:                                                 │
│  • Critérios Maiores: [expandir lista]                      │
│  • Critérios Menores: [expandir lista]                      │
│                                                              │
│  Ecocardiograma:                                             │
│  • FE <40%: IC com FE reduzida (IC-FEr)                     │
│  • FE 40-49%: IC com FE intermediária                        │
│  • FE ≥50%: IC com FE preservada (IC-FEp)                   │
│                                                              │
│  🎯 ALGORITMO DE TRATAMENTO (IC-FEr)                        │
│                                                              │
│  Step 1: IECA ou BRA                                         │
│  ├─ Enalapril 5mg → 10-20mg                                 │
│  └─ Losartan 25mg → 50-100mg                                │
│                                                              │
│  Step 2: Betabloqueador                                      │
│  ├─ Carvedilol 3.125mg → 25mg 2x/dia                        │
│  └─ Metoprolol succinato 12.5mg → 200mg                     │
│                                                              │
│  Step 3: Espironolactona                                     │
│  └─ 25mg → 50mg (se K+ <5.0 e Creat <2.5)                   │
│                                                              │
│  Step 4: Sacubitril/Valsartan (se FE <35%)                  │
│  └─ Substituir IECA/BRA após 36h washout                    │
│                                                              │
│  ⚠️ CONTRAINDICAÇÕES                                         │
│  • IECA: Gestação, Angioedema, Estenose bilateral renal    │
│  • Betabloqueador: BAV 2º/3º grau, Asma grave              │
│  • Espironolactona: K+ >5.0, Creat >2.5                     │
│                                                              │
│  📊 MONITORAMENTO                                            │
│  • Baseline: Creatinina, K+, BNP, ECG, ECO                  │
│  • Follow-up: Creat e K+ em 1-2 sem, ECO em 6-12 meses     │
└─────────────────────────────────────────────────────────────┘
```

**Nível 3 (PhD/Frontier):**
```
┌─────────────────────────────────────────────────────────────┐
│  🧬 MECANISMO FISIOPATOLÓGICO                               │
│                                                              │
│  [Diagrama Interativo 3D]                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Sobrecarga Hemodinâmica                           │     │
│  │         ↓                                           │     │
│  │  Remodelamento Ventricular                         │     │
│  │         ↓                                           │     │
│  │  Ativação Neuro-hormonal (SNS ↑, SRAA ↑)          │     │
│  │         ↓                                           │     │
│  │  Retenção de Na/H2O + Vasoconstrição               │     │
│  │         ↓                                           │     │
│  │  Descompensação Clínica                            │     │
│  └────────────────────────────────────────────────────┘     │
│  [Explorar mecanismo molecular]                              │
│                                                              │
│  📚 ÚLTIMOS 5 RCTs RELEVANTES                               │
│                                                              │
│  1. EMPEROR-Preserved (2025) - Empagliflozin em IC-FEp     │
│     ├─ N: 5988                                              │
│     ├─ Endpoint: CV death ou HF hosp → HR 0.79 (0.69-0.90) │
│     ├─ Conclusão: Redução de 21% em eventos                │
│     └─ [Ler abstract] [Ver gráfico Kaplan-Meier] [Citar]   │
│                                                              │
│  2. PARADIGM-HF (2024 - Follow-up 5 anos)                  │
│     ├─ Sacubitril/Valsartan vs Enalapril                    │
│     ├─ Benefit mantido em longo prazo                       │
│     └─ [Ler] [Citar]                                        │
│                                                              │
│  [Ver todos os estudos]                                      │
│                                                              │
│  🎯 ALVOS MOLECULARES                                        │
│                                                              │
│  • Neprilisina (inibida por Sacubitril)                     │
│    └─ ↑ Peptídeos natriuréticos → vasodilatação            │
│                                                              │
│  • SGLT2 (inibida por Empagliflozin)                        │
│    └─ Natriurese, ↓ remodelamento                           │
│                                                              │
│  ⚠️ CONTROVÉRSIAS E DEBATES                                  │
│                                                              │
│  "Timing de Sacubitril/Valsartan: Iniciar precocemente?"   │
│  • Debate: [Ler thread] [Adicionar opinião]                │
│  • Referências: PMID 35678902, PMID 35678903               │
│                                                              │
│  📖 EXPORTAR CITAÇÕES                                        │
│  [BibTeX] [RIS (EndNote)] [ABNT] [APA] [Vancouver]         │
│                                                              │
│  🔔 Criar alerta para novos estudos de "Insuficiência Cardíaca" │
└─────────────────────────────────────────────────────────────┘
```

---

### Tela 3: Lab Colaborativo

```
┌─────────────────────────────────────────────────────────────┐
│  ← Voltar    Discussões: Insuficiência Cardíaca            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [🔍 Buscar] [➕ Nova Discussão] [🏆 Top Contribuidores]    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔥 Hot Topic                                         │   │
│  │                                                       │   │
│  │ 💬 Timing de Sacubitril/Valsartan                    │   │
│  │    Por: Dra. Ana Silva (CRM-RJ 987654) • Há 2 dias  │   │
│  │    ▲ 23  💬 8 respostas                              │   │
│  │                                                       │   │
│  │    "Tenho observado que muitos pacientes chegam     │   │
│  │     ao ambulatório já em IECA otimizado. Vocês      │   │
│  │     iniciam Sacubitril imediatamente ou aguardam?" │   │
│  │                                                       │   │
│  │    [Expandir thread] [Responder]                     │   │
│  │                                                       │   │
│  │    Última resposta: Dr. Pedro Costa (InCor USP)     │   │
│  │    "Na nossa prática, aguardamos 4 semanas..."      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📄 Experiência de Campo                              │   │
│  │                                                       │   │
│  │ 💡 Caso de IC com FE recuperada após Carvedilol     │   │
│  │    Por: Dr. Carlos Mendes (CRM-SP 123789) • Há 5d   │   │
│  │    ▲ 15  💬 3 respostas                              │   │
│  │                                                       │   │
│  │    "Paciente com IC-FEr (FE 28%) após IAM, iniciado │   │
│  │     em Carvedilol. ECO após 6 meses: FE 55%..."     │   │
│  │                                                       │   │
│  │    [Ler mais] [Responder]                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📚 Submissão de Conteúdo                             │   │
│  │                                                       │   │
│  │ 📎 Novo estudo: "Dapagliflozin em IC-FEp"           │   │
│  │    Por: Dra. Fernanda Lima • Há 1 semana            │   │
│  │    ▲ 32  Status: ✅ Processado pela IA              │   │
│  │                                                       │   │
│  │    "Anexei o PDF do estudo DELIVER. A IA já         │   │
│  │     sugeriu atualização na conduta de IC-FEp."      │   │
│  │                                                       │   │
│  │    [Ver sugestão da IA] [Votar] [Comentar]          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  📊 Estatísticas:                                            │
│  • 234 threads ativos                                        │
│  • 1.2k contribuições (últimos 30 dias)                     │
│  • 89% de médicos verificados                                │
└─────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- **Thread System:** Discussões aninhadas (Reddit-like)
- **Upvote/Downvote:** Reputação baseada em contribuições
- **Verificação:** Apenas médicos com CRM podem postar
- **Submissão de PDFs:** IA (Vertex AI Document AI) processa e sugere atualizações
- **Moderação:** Flagging system + moderadores

---

### Tela 4: Gestor de Referências (My PhD)

```
┌─────────────────────────────────────────────────────────────┐
│  ← Voltar    My PhD Library                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [🔍 Buscar] [➕ Nova Pasta] [📤 Exportar Tudo] [⚙️]        │
│                                                              │
│  📁 Minhas Pastas:                                           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ 📕 IC        │ │ 📘 IAM       │ │ 📗 Arritmias │        │
│  │ 45 artigos   │ │ 23 artigos   │ │ 12 artigos   │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                              │
│  🔥 Recentemente Salvos:                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📄 EMPEROR-Preserved: Empagliflozin in HF-PEF       │   │
│  │    Anker SD, Butler J et al.                        │   │
│  │    N Engl J Med. 2025;392:123-134                   │   │
│  │    PMID: 35678901                                    │   │
│  │                                                       │   │
│  │    Pasta: 📕 IC                                      │   │
│  │    Salvo em: 15/02/2026                              │   │
│  │                                                       │   │
│  │    📝 Minhas Notas:                                  │   │
│  │    "Importante para minha revisão - empagliflozin   │   │
│  │     reduz eventos em 21%"                            │   │
│  │                                                       │   │
│  │    🖍️ Destaques: "HR 0.79", "FEp"                   │   │
│  │                                                       │   │
│  │    [Ler abstract] [PDF completo] [Citar] [Editar]   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📄 PARADIGM-HF: Sacubitril/Valsartan vs Enalapril   │   │
│  │    McMurray JJ et al.                                │   │
│  │    N Engl J Med. 2024;371:993-1004                   │   │
│  │    PMID: 25176015                                    │   │
│  │                                                       │   │
│  │    Pasta: 📕 IC                                      │   │
│  │    [Citar] [Ver notas]                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  📤 Exportar:                                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Selecione pasta: [📕 IC ▼]                           │  │
│  │ Formato: [BibTeX ▼] [RIS] [ABNT] [APA] [Vancouver]  │  │
│  │                                                        │  │
│  │ [📥 Exportar 45 artigos]                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  🔔 Alertas Configurados:                                    │
│  • "Insuficiência Cardíaca" - Semanal                       │
│  • "Sacubitril/Valsartan" - Mensal                          │
│  [Gerenciar alertas]                                         │
│                                                              │
│  📊 Estatísticas:                                            │
│  • 80 artigos salvos                                         │
│  • 15 exportações realizadas                                 │
│  • Última exportação: 20/02/2026                             │
└─────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- **Organização por Pastas:** Arrastar e soltar
- **Notas e Destaques:** Annotations direto nos artigos
- **Exportação Multi-formato:** BibTeX, RIS, ABNT, APA, Vancouver
- **Alertas Automáticos:** Novos estudos via PubMed RSS
- **Sincronização:** Cloud sync (Firestore)

---

## 🔍 Sistema de Busca Semântica

### Arquitetura de Busca

```
┌─────────────────────────────────────────────────────────────┐
│                 USER QUERY                                   │
│   "Paciente 70 anos, IC com FE reduzida, qual dose de      │
│    Sacubitril/Valsartan?"                                    │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│          NLP PROCESSING (Vertex AI)                          │
├─────────────────────────────────────────────────────────────┤
│  1. Entity Extraction:                                       │
│     - Age: 70 anos                                           │
│     - Condition: Insuficiência Cardíaca                      │
│     - Phenotype: FE reduzida (IC-FEr)                        │
│     - Intent: Dose de medicamento                            │
│     - Drug: Sacubitril/Valsartan                             │
│                                                               │
│  2. Query Embedding (text-embedding-004):                    │
│     vector[768] = [0.123, -0.456, ...]                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│          MULTI-SOURCE SEARCH                                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│  │   Firestore   │  │   BigQuery    │  │  Algolia      │   │
│  │   (Conducts)  │  │  (Analytics)  │  │  (Full-text)  │   │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘   │
│          │                  │                  │            │
│          │                  │                  │            │
│  Vector similarity    Context ranking    Keyword match      │
│  (cosine distance)    (PageRank-like)    (BM25)             │
└──────────┬──────────────────┬──────────────────┬────────────┘
           │                  │                  │
           └──────────────────┼──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│          RESULT FUSION & RANKING                             │
├─────────────────────────────────────────────────────────────┤
│  Weighted Score:                                             │
│  - Vector similarity: 50%                                    │
│  - Keyword relevance: 30%                                    │
│  - Context (user specialty, recency): 20%                    │
│                                                               │
│  Results:                                                     │
│  1. Conduct: IC-FEr - Tratamento (Score: 0.95) ✅           │
│  2. Drug: Sacubitril/Valsartan (Score: 0.92) ✅             │
│  3. Calculator: Dose Sacubitril/Valsartan (Score: 0.88) ✅  │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│          ANSWER SYNTHESIS (Gemini Pro)                       │
├─────────────────────────────────────────────────────────────┤
│  Contexto: Paciente 70 anos com IC-FEr                      │
│  Resposta Sintetizada:                                       │
│                                                               │
│  "Para paciente com Insuficiência Cardíaca com FE reduzida, │
│   a dose de Sacubitril/Valsartan é:                          │
│                                                               │
│   • Dose inicial: 49/51mg 2x/dia                             │
│   • Dobrar dose após 2-4 semanas se tolerado                 │
│   • Dose alvo: 97/103mg 2x/dia                               │
│                                                               │
│   ⚠️ Importante:                                              │
│   - Aguardar washout de 36h se estava em IECA               │
│   - Monitorar PA, K+, creatinina                             │
│   - Contraindicado se K+ >5.5 ou TFG <30                     │
│                                                               │
│   📚 Referência: Diretriz SBC 2025, PARADIGM-HF"            │
│                                                               │
│  [Ver conduta completa] [Abrir calculadora]                  │
└─────────────────────────────────────────────────────────────┘
```

### Implementação Técnica

#### 1. **Indexação de Conteúdo (Cloud Functions)**

```python
from google.cloud import aiplatform
from vertexai.language_models import TextEmbeddingModel

def index_conduct(conduct_data):
    """
    Gera embeddings para busca semântica
    """
    # Modelo de embedding
    model = TextEmbeddingModel.from_pretrained("text-embedding-004")
    
    # Texto a ser embeddado
    text = f"""
    {conduct_data['pathology']['name']}
    {conduct_data['layers']['layer_1_plantao']['summary']}
    {conduct_data['layers']['layer_2_especialista']['diagnostic_criteria']}
    """
    
    # Gerar embedding
    embeddings = model.get_embeddings([text])
    vector = embeddings[0].values  # 768-dimensional vector
    
    # Armazenar no Firestore
    conduct_ref = db.collection('conducts').document(conduct_data['id'])
    conduct_ref.update({
        'embedding': vector,
        'indexed_at': firestore.SERVER_TIMESTAMP
    })
```

#### 2. **Query Processing (Backend)**

```typescript
// services/search.ts
import { VertexAI } from '@google-cloud/aiplatform';
import { Firestore } from '@google-cloud/firestore';

interface SearchQuery {
  query: string;
  user_specialty?: string;
  filters?: {
    category?: string;
    evidence_level?: string;
  };
}

async function semanticSearch(query: SearchQuery) {
  // 1. Extract entities com Vertex AI NLP
  const entities = await extractEntities(query.query);
  
  // 2. Generate query embedding
  const queryVector = await generateEmbedding(query.query);
  
  // 3. Vector search in Firestore
  // (Note: Firestore não tem vector search nativo, usar Algolia ou Vertex AI Vector Search)
  const vectorResults = await vertexVectorSearch(queryVector);
  
  // 4. Keyword search in Algolia
  const keywordResults = await algoliaSearch(query.query);
  
  // 5. Merge and rank
  const mergedResults = mergeResults(vectorResults, keywordResults, {
    weights: { vector: 0.5, keyword: 0.3, context: 0.2 },
    user_context: { specialty: query.user_specialty }
  });
  
  // 6. Synthesize answer com Gemini
  const answer = await synthesizeAnswer(query.query, mergedResults[0]);
  
  return {
    answer,
    results: mergedResults,
    entities
  };
}

async function extractEntities(text: string) {
  const model = vertex.preview.language.LanguageServiceClient();
  
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
    language: 'pt'
  };
  
  const [result] = await model.analyzeEntities({ document });
  
  return {
    age: extractAge(result.entities),
    condition: extractCondition(result.entities),
    drug: extractDrug(result.entities),
    intent: classifyIntent(text)
  };
}
```

#### 3. **Algolia Index Configuration**

```javascript
// Algolia index settings
const index = client.initIndex('conducts');

index.setSettings({
  searchableAttributes: [
    'pathology.name',
    'pathology.synonyms',
    'pathology.cid10',
    'layers.layer_1_plantao.summary',
    'layers.layer_2_especialista.diagnostic_criteria',
    'layers.layer_3_phd.latest_rcts.title'
  ],
  attributesForFaceting: [
    'pathology.category',
    'trust_seal.level',
    'trust_seal.evidence_grade'
  ],
  customRanking: [
    'desc(analytics.views)',
    'desc(trust_seal.evidence_grade)',
    'desc(last_updated)'
  ],
  ranking: [
    'typo',
    'geo',
    'words',
    'filters',
    'proximity',
    'attribute',
    'exact',
    'custom'
  ]
});
```

---

## 🔗 Integração de APIs Externas

### 1. **ANVISA (Brasil)**

#### Web Scraping do DOU

```python
# cloud_functions/anvisa_scraper.py
import requests
from bs4 import BeautifulSoup
from google.cloud import bigquery

def scrape_dou_daily(request):
    """
    Scrape Diário Oficial da União para novos registros
    Cloud Function executada diariamente (Cloud Scheduler)
    """
    url = "https://www.in.gov.br/consulta"
    params = {
        'q': 'ANVISA registro medicamento',
        'publishDate': 'today'
    }
    
    response = requests.get(url, params=params)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Parse registros
    registros = []
    for article in soup.find_all('article', class_='resultado'):
        titulo = article.find('h5').text
        if 'medicamento' in titulo.lower():
            registro = {
                'titulo': titulo,
                'data': article.find('span', class_='data').text,
                'url': article.find('a')['href'],
                'scrape_timestamp': datetime.now().isoformat()
            }
            registros.append(registro)
    
    # Insert into BigQuery
    client = bigquery.Client()
    table_id = "medfocus_lakehouse.raw_data.anvisa_raw"
    
    errors = client.insert_rows_json(table_id, registros)
    
    if not errors:
        print(f"Inserted {len(registros)} registros")
        # Trigger notification
        notify_new_anvisa_registrations(registros)
    else:
        print(f"Errors: {errors}")
    
    return {'status': 'success', 'count': len(registros)}

def notify_new_anvisa_registrations(registros):
    """
    Notifica usuários sobre novos registros relevantes
    """
    from google.cloud import pubsub_v1
    
    publisher = pubsub_v1.PublisherClient()
    topic_path = publisher.topic_path('medfocus', 'anvisa-updates')
    
    for registro in registros:
        message_json = json.dumps(registro)
        future = publisher.publish(topic_path, message_json.encode('utf-8'))
        print(f"Published message ID: {future.result()}")
```

#### Bulário Eletrônico API

```python
# services/anvisa_api.py
import requests

class AnvisaBularioAPI:
    BASE_URL = "https://consultas.anvisa.gov.br/api/consulta/bulario"
    
    def search_drug(self, nome_comercial: str = None, principio_ativo: str = None):
        """
        Busca medicamento no bulário ANVISA
        """
        params = {}
        if nome_comercial:
            params['nomeProduto'] = nome_comercial
        if principio_ativo:
            params['nomePrincipioAtivo'] = principio_ativo
        
        response = requests.get(f"{self.BASE_URL}/medicamentos", params=params)
        return response.json()
    
    def get_bula(self, numero_registro: str):
        """
        Baixa bula em PDF
        """
        url = f"{self.BASE_URL}/bula/{numero_registro}"
        response = requests.get(url)
        
        if response.status_code == 200:
            # Upload to GCS
            from google.cloud import storage
            client = storage.Client()
            bucket = client.bucket('medfocus-bulas')
            blob = bucket.blob(f"{numero_registro}.pdf")
            blob.upload_from_string(response.content, content_type='application/pdf')
            
            return blob.public_url
        else:
            return None
```

---

### 2. **OpenFDA (EUA)**

```python
# services/openfda_api.py
import requests
from datetime import datetime, timedelta

class OpenFDAAPI:
    BASE_URL = "https://api.fda.gov"
    
    def get_drug_labels(self, generic_name: str):
        """
        Busca labels (bulas) no FDA
        """
        url = f"{self.BASE_URL}/drug/label.json"
        params = {
            'search': f'openfda.generic_name:"{generic_name}"',
            'limit': 5
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        # Extract black box warnings
        results = []
        for result in data.get('results', []):
            warnings = result.get('boxed_warning', [])
            results.append({
                'generic_name': generic_name,
                'brand_name': result.get('openfda', {}).get('brand_name', []),
                'black_box_warnings': warnings,
                'indications': result.get('indications_and_usage', []),
                'contraindications': result.get('contraindications', [])
            })
        
        return results
    
    def get_adverse_events(self, drug_name: str, days_back: int = 90):
        """
        Busca adverse events recentes
        """
        url = f"{self.BASE_URL}/drug/event.json"
        
        # Date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)
        date_range = f"[{start_date.strftime('%Y%m%d')}+TO+{end_date.strftime('%Y%m%d')}]"
        
        params = {
            'search': f'patient.drug.medicinalproduct:"{drug_name}"+AND+receivedate:{date_range}',
            'count': 'patient.reaction.reactionmeddrapt.exact'
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        # Aggregate reactions
        reactions = []
        for item in data.get('results', []):
            reactions.append({
                'reaction': item.get('term'),
                'count': item.get('count')
            })
        
        # Sort by count
        reactions.sort(key=lambda x: x['count'], reverse=True)
        
        return reactions[:20]  # Top 20
```

---

### 3. **NCBI PubMed E-utilities**

```python
# services/pubmed_api.py
import requests
import xml.etree.ElementTree as ET

class PubMedAPI:
    BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
    API_KEY = "YOUR_NCBI_API_KEY"  # Register at NCBI
    
    def search_rcts(self, condition: str, limit: int = 5):
        """
        Busca últimos 5 RCTs de uma condição
        """
        # 1. ESearch - get PMIDs
        search_url = f"{self.BASE_URL}/esearch.fcgi"
        query = f'"{condition}"[Title/Abstract] AND "randomized controlled trial"[Publication Type] AND ("last 2 years"[PDat])'
        
        params = {
            'db': 'pubmed',
            'term': query,
            'retmax': limit,
            'retmode': 'json',
            'sort': 'pub date',
            'api_key': self.API_KEY
        }
        
        response = requests.get(search_url, params=params)
        data = response.json()
        pmids = data['esearchresult']['idlist']
        
        # 2. ESummary - get article details
        summary_url = f"{self.BASE_URL}/esummary.fcgi"
        params = {
            'db': 'pubmed',
            'id': ','.join(pmids),
            'retmode': 'json',
            'api_key': self.API_KEY
        }
        
        response = requests.get(summary_url, params=params)
        data = response.json()
        
        articles = []
        for pmid in pmids:
            article_data = data['result'][pmid]
            articles.append({
                'pmid': pmid,
                'title': article_data['title'],
                'authors': article_data['authors'],
                'journal': article_data['fulljournalname'],
                'pubdate': article_data['pubdate'],
                'doi': article_data.get('elocationid', ''),
                'abstract_url': f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/"
            })
        
        # 3. EFetch - get abstracts
        for article in articles:
            abstract = self.fetch_abstract(article['pmid'])
            article['abstract'] = abstract
        
        return articles
    
    def fetch_abstract(self, pmid: str):
        """
        Busca abstract completo
        """
        url = f"{self.BASE_URL}/efetch.fcgi"
        params = {
            'db': 'pubmed',
            'id': pmid,
            'retmode': 'xml',
            'api_key': self.API_KEY
        }
        
        response = requests.get(url, params=params)
        root = ET.fromstring(response.content)
        
        abstract_texts = root.findall('.//AbstractText')
        abstract = ' '.join([text.text for text in abstract_texts if text.text])
        
        return abstract
    
    def export_citation(self, pmid: str, format: str = 'bibtex'):
        """
        Exporta citação em formato específico
        """
        # Fetch article data
        url = f"{self.BASE_URL}/efetch.fcgi"
        params = {
            'db': 'pubmed',
            'id': pmid,
            'retmode': 'xml',
            'api_key': self.API_KEY
        }
        
        response = requests.get(url, params=params)
        root = ET.fromstring(response.content)
        
        # Extract metadata
        article = root.find('.//Article')
        title = article.find('.//ArticleTitle').text
        journal = article.find('.//Journal/Title').text
        year = article.find('.//PubDate/Year').text
        authors = [f"{author.find('LastName').text}, {author.find('Initials').text}" 
                   for author in article.findall('.//Author')]
        
        if format == 'bibtex':
            return self._format_bibtex(pmid, title, authors, journal, year)
        elif format == 'ris':
            return self._format_ris(pmid, title, authors, journal, year)
        elif format == 'abnt':
            return self._format_abnt(pmid, title, authors, journal, year)
    
    def _format_bibtex(self, pmid, title, authors, journal, year):
        first_author_last_name = authors[0].split(',')[0]
        return f"""@article{{{first_author_last_name}{year},
  title={{{title}}},
  author={{{' and '.join(authors)}}},
  journal={{{journal}}},
  year={{{year}}},
  pmid={{{pmid}}}
}}"""
    
    def _format_ris(self, pmid, title, authors, journal, year):
        ris = f"TY  - JOUR\n"
        for author in authors:
            ris += f"AU  - {author}\n"
        ris += f"TI  - {title}\n"
        ris += f"T2  - {journal}\n"
        ris += f"PY  - {year}\n"
        ris += f"UR  - https://pubmed.ncbi.nlm.nih.gov/{pmid}/\n"
        ris += f"ER  - \n"
        return ris
    
    def _format_abnt(self, pmid, title, authors, journal, year):
        authors_str = '; '.join(authors)
        return f"{authors_str}. {title}. {journal}, {year}. Disponível em: <https://pubmed.ncbi.nlm.nih.gov/{pmid}/>."
```

---

## 🛡️ Sistema de Curadoria e Trust Layer

### Selo de Verificação (Trust Seal)

#### Níveis de Selo

```typescript
enum TrustLevel {
  GREEN = 'green',    // Baseado em Diretriz
  BLUE = 'blue',      // Consenso de Especialistas
  YELLOW = 'yellow'   // Evidência Emergente/PhD
}

interface TrustSeal {
  level: TrustLevel;
  description: string;
  validators: Validator[];
  evidence_grade: 'A' | 'B' | 'C' | 'D';
  last_review: Date;
  guideline_source?: {
    organization: string;  // "SBC", "AHA", "ESC"
    year: number;
    url: string;
  };
}

interface Validator {
  user_id: string;
  crm: string;
  specialty: string;
  institution: string;
  timestamp: Date;
  comments?: string;
}
```

#### Critérios de Validação

**Selo Verde (Green) - Baseado em Diretriz:**
- Conteúdo extraído diretamente de diretriz de sociedade médica reconhecida
- Atualizada nos últimos 2 anos
- Validado por pelo menos 1 médico especialista
- Evidence grade A ou B

**Selo Azul (Blue) - Consenso de Especialistas:**
- Validado por 3+ médicos especialistas verificados
- De pelo menos 2 instituições diferentes
- Evidência robusta (RCTs, meta-análises)
- Evidence grade B ou C

**Selo Amarelo (Yellow) - Evidência Emergente:**
- Conteúdo baseado em estudos recentes (< 6 meses)
- Ainda não incorporado em diretrizes
- Validado por 2+ médicos
- Evidence grade C ou D
- Tag "PhD/Frontier"

---

### Audit Trail (Histórico de Edições)

```typescript
interface AuditEntry {
  editor: {
    user_id: string;
    name: string;
    crm: string;
  };
  timestamp: Date;
  changes: {
    field: string;
    old_value: any;
    new_value: any;
  }[];
  reason: string;
  approved_by: string[];  // user_ids de quem aprovou
  approval_status: 'pending' | 'approved' | 'rejected';
}

// Exemplo de uso
const audit_trail: AuditEntry[] = [
  {
    editor: {
      user_id: "user_dr_joao_123",
      name: "Dr. João Silva",
      crm: "CRM-SP 123456"
    },
    timestamp: new Date("2026-02-15T10:30:00Z"),
    changes: [
      {
        field: "layers.layer_1_plantao.key_drugs[0].dose",
        old_value: "40mg IV",
        new_value: "40-80mg IV"
      }
    ],
    reason: "Atualização conforme Diretriz SBC 2025 - dose pode ser ajustada",
    approved_by: ["user_dr_maria_456", "user_dr_carlos_789"],
    approval_status: "approved"
  }
];
```

#### Workflow de Aprovação

```
┌─────────────────────────────────────────────────────────────┐
│  1. Médico Verificado propõe edição                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Edição fica com status "pending"                         │
│     Notificação enviada para curadores (3 médicos)           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Curadores revisam:                                       │
│     - ✅ Aprovam (2/3 votos → aprovado)                      │
│     - ❌ Rejeitam (2/3 votos → rejeitado)                    │
│     - 💬 Pedem revisão (comentários)                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Se aprovado:                                             │
│     - Edição aplicada ao conteúdo                            │
│     - Audit trail atualizado                                 │
│     - Notificação ao editor original                         │
│     - Badge de "Contribuidor" para o editor                  │
└─────────────────────────────────────────────────────────────┘
```

---

### Sistema de Reputação

```typescript
interface UserReputation {
  user_id: string;
  total_points: number;
  level: number;  // 1-10
  badges: Badge[];
  contributions: {
    edits_proposed: number;
    edits_approved: number;
    edits_rejected: number;
    validations_performed: number;
    discussions_started: number;
    upvotes_received: number;
  };
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  earned_at: Date;
}

// Exemplos de badges
const badges = {
  contributor: {
    name: "Contribuidor",
    description: "Primeira edição aprovada",
    icon: "🌟"
  },
  expert_validator: {
    name: "Validador Expert",
    description: "100+ validações realizadas",
    icon: "✅"
  },
  researcher: {
    name: "Pesquisador",
    description: "10+ artigos submetidos",
    icon: "📚"
  },
  community_leader: {
    name: "Líder Comunitário",
    description: "1000+ upvotes recebidos",
    icon: "👑"
  }
};
```

---

## 💻 Stack Tecnológica Completa

### Backend

```yaml
Cloud Platform: Google Cloud Platform (GCP)

Compute:
  - Cloud Run (microservices, serverless)
  - Cloud Functions (event-driven tasks)
  - Cloud Tasks (async job queue)

Databases:
  - Firestore (operational data, real-time)
  - Cloud SQL PostgreSQL (relational data)
  - BigQuery (data warehouse, analytics)
  - Memorystore Redis (caching, sessions)

Storage:
  - Cloud Storage (GCS) - files, PDFs, images
  - Vertex AI Vector Search (embeddings)

AI/ML:
  - Vertex AI (Gemini Pro, embeddings, NLP)
  - Document AI (PDF parsing)
  - Natural Language API (entity extraction)

Integration:
  - Cloud Pub/Sub (messaging)
  - Cloud Scheduler (cron jobs)
  - Workflows (orchestration)

Search:
  - Algolia (full-text search, faceted)
  - Vertex AI Vector Search (semantic)

Observability:
  - Cloud Logging
  - Cloud Monitoring
  - Cloud Trace
  - Error Reporting

Security:
  - Identity Platform (Firebase Auth)
  - Cloud Armor (DDoS protection)
  - Secret Manager (API keys)
  - Cloud KMS (encryption)

Languages & Frameworks:
  - Node.js 20.x + TypeScript 5.x
  - Python 3.12 + FastAPI
  - Express.js 4.x
```

### Frontend

```yaml
Web:
  - React 19.x
  - TypeScript 5.x
  - Vite 7.x (build tool)
  - TailwindCSS 4.x
  - Radix UI (components)
  - tRPC (type-safe API)
  - React Query (data fetching)
  - Zustand (state management)
  - React Hook Form (forms)
  - Recharts (charts)

Mobile:
  - Flutter 3.x
  - Dart 3.x
  - Riverpod (state management)
  - Hive (local database, offline)
  - Dio (HTTP client)
  - Flutter Hooks

PWA:
  - Service Worker (offline-first)
  - IndexedDB (client-side storage)
  - Web Push API (notifications)

Design:
  - Figma (design system)
  - Framer Motion (animations)
```

### DevOps & CI/CD

```yaml
Version Control:
  - GitHub (repositories)
  - Git Flow (branching strategy)

CI/CD:
  - GitHub Actions
  - Cloud Build

Infrastructure as Code:
  - Terraform
  - Cloud Deployment Manager

Containers:
  - Docker
  - Artifact Registry (container registry)

Monitoring:
  - Datadog (APM)
  - Sentry (error tracking)
  - Uptime Robot (uptime monitoring)
```

---

## 📅 Roadmap de Implementação

### Phase 1: MVP Foundations (Q1 2026 - 3 meses)

**Objetivo:** Paridade com Whitebook + Infraestrutura GCP

#### Mês 1: Infraestrutura e Backend Base
- ✅ Setup GCP project
- ✅ Microservices architecture (Auth, Content, Clinical Decision)
- ✅ Firestore schema implementation
- ✅ Auth Service (JWT + CRM verification)
- ✅ Content Service MVP (100 condutas essenciais)

#### Mês 2: Features Core
- ✅ Drug Database MVP (500 medicamentos)
- ✅ Calculadoras médicas (Top 50)
- ✅ ANVISA integration (Bulário Eletrônico)
- ✅ OpenFDA integration (Black Box Warnings)
- ✅ Web app (React) - Telas 1 e 2 (Cockpit + Camadas)

#### Mês 3: Busca e Mobile
- ✅ Sistema de busca semântica (Vertex AI + Algolia)
- ✅ Flutter app MVP (iOS + Android)
- ✅ Offline-first (Hive local storage)
- ✅ PWA implementation (Service Worker)
- ✅ Deploy e testes beta

**Entregáveis:**
- ✅ 100 condutas médicas (layers 1 e 2)
- ✅ 500 medicamentos com interações
- ✅ 50 calculadoras médicas
- ✅ Apps web e mobile funcionais
- ✅ Busca semântica operacional

---

### Phase 2: Research & Collaboration (Q2 2026 - 3 meses)

**Objetivo:** Modo PhD + Lab Colaborativo

#### Mês 4: Research Service
- ✅ PubMed E-utilities integration
- ✅ Layer 3 (PhD) implementation
- ✅ Export de citações (BibTeX/RIS/ABNT)
- ✅ Últimos 5 RCTs automáticos por condição
- ✅ Tela 4 (My PhD Library)

#### Mês 5: Collaboration Tools
- ✅ Collaboration Service (threads, replies)
- ✅ Tela 3 (Lab Colaborativo)
- ✅ Sistema de upvote/downvote
- ✅ Moderação e flagging
- ✅ Notificações real-time (Firestore listeners)

#### Mês 6: Trust Layer
- ✅ Sistema de curadoria (3 médicos)
- ✅ Audit trail completo
- ✅ Selo de verificação (Green/Blue/Yellow)
- ✅ Sistema de reputação e badges
- ✅ PDF submission + IA parsing (Document AI)

**Entregáveis:**
- ✅ Modo PhD funcional (layer 3)
- ✅ Lab colaborativo ativo
- ✅ Sistema de validação robusto
- ✅ 300+ condutas médicas completas (3 layers)

---

### Phase 3: Data Lakehouse & Intelligence (Q3 2026 - 3 meses)

**Objetivo:** BigQuery Data Lake + Analytics Preditivo

#### Mês 7: Data Pipeline
- ✅ BigQuery lakehouse setup
- ✅ Cloud Dataflow pipelines (ETL)
- ✅ ANVISA DOU scraping diário
- ✅ Sociedades médicas RSS feeds
- ✅ Enrichment automático de drugs

#### Mês 8: Analytics Service
- ✅ Analytics Service (tracking, metrics)
- ✅ User behavior analysis
- ✅ Content performance dashboard
- ✅ A/B testing framework
- ✅ Search query analysis

#### Mês 9: ML & Recommendations
- ✅ Vertex AI model training (recommendations)
- ✅ Predição de necessidades de estudo
- ✅ Weak areas identification
- ✅ Alertas inteligentes de novos estudos
- ✅ Dashboard de analytics para admins

**Entregáveis:**
- ✅ Data lakehouse operacional
- ✅ Analytics preditivo funcionando
- ✅ Recomendações personalizadas
- ✅ 1000+ condutas médicas

---

### Phase 4: Scale & Expansion (Q4 2026 - 3 meses)

**Objetivo:** Expansão de conteúdo + Parcerias

#### Mês 10: Conteúdo Massivo
- ✅ Expansão para 2000+ condutas
- ✅ Drug database completo (3000+ medicamentos)
- ✅ 100+ calculadoras
- ✅ Guidelines de 20+ sociedades médicas
- ✅ Atlas de imagens médicas (500+ imagens)

#### Mês 11: Advanced Features
- ✅ API pública v1
- ✅ Webhooks para integrações
- ✅ Modo escuro
- ✅ Multilingual (EN, ES)
- ✅ Voice search (Speech-to-Text)

#### Mês 12: Go-to-Market
- ✅ Beta launch (médicos selecionados)
- ✅ Parcerias com universidades
- ✅ Integração com sistemas hospitalares
- ✅ Planos de assinatura (freemium)
- ✅ Marketing e PR

**Entregáveis:**
- ✅ Plataforma completa e escalável
- ✅ 2000+ condutas, 3000+ medicamentos
- ✅ API pública documentada
- ✅ 10.000+ usuários ativos (meta)

---

## 💰 Estimativas e Recursos

### Budget Estimado

#### Infraestrutura (GCP)

**MVP (Fase 1-2, até 1.000 usuários ativos):**
```
Cloud Run (microservices):        $200/mês
Firestore (reads/writes):          $150/mês
Cloud SQL PostgreSQL (db-f1-micro): $50/mês
Memorystore Redis (1GB):          $100/mês
Cloud Storage (GCS):               $30/mês
Vertex AI (Gemini Pro):           $300/mês (estimativa)
Algolia (Search):                 $100/mês
Cloud Functions:                   $50/mês
Cloud Tasks:                       $20/mês
Networking:                        $50/mês
──────────────────────────────────────────
Total MVP:                      ~$1.050/mês
```

**Scale (Fase 3-4, até 10.000 usuários ativos):**
```
Cloud Run (auto-scale):          $800/mês
Firestore:                       $600/mês
Cloud SQL (db-n1-standard-2):    $250/mês
Memorystore Redis (5GB):         $350/mês
Cloud Storage:                   $150/mês
Vertex AI:                     $1.000/mês
Algolia:                         $300/mês
BigQuery:                        $400/mês
Cloud Functions:                 $150/mês
Cloud Tasks:                      $50/mês
Networking + CDN:                $200/mês
──────────────────────────────────────────
Total Scale:                   ~$4.250/mês
```

**Produção (100.000 usuários ativos):**
```
Estimativa:                  $15.000-25.000/mês
```

---

#### Equipe Recomendada

**Fase 1-2 (MVP):**
```
1x Tech Lead (Backend)         $8k-12k/mês
1x Senior Backend Engineer     $6k-10k/mês
1x Senior Frontend Engineer    $6k-10k/mês
1x Mobile Engineer (Flutter)   $6k-10k/mês
1x DevOps Engineer             $6k-10k/mês
1x Product Designer (UI/UX)    $5k-8k/mês
1x Product Manager             $6k-10k/mês
1x QA Engineer                 $4k-7k/mês
──────────────────────────────────────────
Total Equipe:              $47k-77k/mês
                           $564k-924k/ano
```

**Fase 3-4 (Scale):**
```
+ 1x Backend Engineer          $6k-10k/mês
+ 1x Data Engineer (BigQuery)  $7k-12k/mês
+ 1x ML Engineer (Vertex AI)   $8k-14k/mês
+ 1x Content Manager (médico)  $5k-8k/mês
──────────────────────────────────────────
Total adicional:           $26k-44k/mês

Total Equipe (Scale):      $73k-121k/mês
                           $876k-1.452M/ano
```

---

#### Ferramentas e Licenças

```
GitHub Team:                      $4/user/mês
Figma Professional:              $12/user/mês
Datadog APM:                    $15/host/mês
Sentry (Error Tracking):         $26/mês (Team)
Algolia (Search):               $100-300/mês
Domain + SSL:                    $50/ano
──────────────────────────────────────────
Total:                        ~$500/mês
```

---

#### Marketing e Aquisição

```
Google Ads:                  $2.000-5.000/mês
Facebook/Instagram Ads:      $1.000-3.000/mês
Content Marketing:           $1.000-2.000/mês
PR e eventos:                $1.000-3.000/mês
──────────────────────────────────────────
Total:                       $5.000-13.000/mês
```

---

### Budget Total Resumido (Ano 1)

```
Infraestrutura (GCP):         $50.000-80.000
Equipe (8-12 pessoas):       $564.000-1.452.000
Ferramentas:                   $6.000
Marketing:                    $60.000-156.000
Legal/Contabilidade:          $20.000
Contingência (10%):           $70.000-170.000
──────────────────────────────────────────
TOTAL ANO 1:              $770.000-1.884.000
```

**Budget conservador (MVP focus):** ~$800k  
**Budget agressivo (Scale fast):** ~$1.5M-2M

---

### ROI Estimado

#### Modelo de Receita (Freemium)

**Planos:**
```
Free (Estudantes):
  - 100 condutas
  - 20 calculadoras
  - Sem PhD mode
  - Ads

Basic ($10/mês):
  - Acesso completo a condutas (layer 1-2)
  - Todas calculadoras
  - Drug database
  - Sem ads

Pro ($30/mês):
  - Tudo do Basic
  - PhD mode (layer 3)
  - My PhD Library
  - Exportação de citações
  - Alertas ilimitados

Institucional ($500-2.000/mês):
  - Licença para hospitais/universidades
  - API access
  - White-label (futuro)
  - Suporte dedicado

Professores:
  - FREE (acesso completo)
  - Ferramentas de curadoria
```

#### Projeção de Usuários e Receita

**Ano 1:**
```
Q1: 1.000 usuários (beta)
    - Free: 900
    - Basic: 80 ($800/mês)
    - Pro: 20 ($600/mês)
    MRR: $1.400

Q2: 5.000 usuários
    - Free: 4.000
    - Basic: 800 ($8.000/mês)
    - Pro: 200 ($6.000/mês)
    MRR: $14.000

Q3: 15.000 usuários
    - Free: 12.000
    - Basic: 2.400 ($24.000/mês)
    - Pro: 600 ($18.000/mês)
    MRR: $42.000

Q4: 30.000 usuários
    - Free: 24.000
    - Basic: 4.800 ($48.000/mês)
    - Pro: 1.200 ($36.000/mês)
    MRR: $84.000
──────────────────────────────────────────
ARR (Q4): $1.008.000
```

**Break-even:** ~18 meses (com growth moderado)

---

## 🎯 Próximos Passos Imediatos

### Prioridade P0 (Próximos 7 dias)

1. **Definir Modelo de Dados Final:**
   - ✅ Revisar estrutura Firestore proposta
   - ✅ Validar com equipe técnica
   - ✅ Criar scripts de migração (se necessário)

2. **Prototipar Telas:**
   - ✅ Figma mockups das 4 telas principais
   - ✅ Validar UX com médicos (5-10 usuários)
   - ✅ Iterar baseado em feedback

3. **Setup GCP Project:**
   - ✅ Criar projeto GCP
   - ✅ Configurar billing
   - ✅ Setup Terraform (IaC)
   - ✅ Deploy de microservice básico (Auth Service)

4. **Kick-off Técnico:**
   - ✅ Definir sprints (2 semanas)
   - ✅ Criar backlog no Jira/Linear
   - ✅ Setup repositórios GitHub
   - ✅ Configurar CI/CD (GitHub Actions)

---

### Perguntas para Discussão

1. **Budget:** Qual é o budget disponível? MVP ($800k) ou Scale ($1.5M-2M)?

2. **Timeline:** 12 meses para v1 é viável? Há flexibilidade?

3. **Equipe:** Contratar full-time ou outsourcing parcial?

4. **Modelo de Dados:** Firestore (proposto) vs PostgreSQL como primary database?
   - Firestore: Melhor para real-time, escalabilidade, mobile-first
   - PostgreSQL: Melhor para queries complexas, joins, transações

5. **Modo PhD:** É MVP ou pode ser Fase 2?

6. **Parcerias:** Há interesse em parcerias com universidades/hospitais desde o início?

7. **Regulatório:** Precisamos de certificação ANVISA ou CFM?

---

## 📚 Referências e Recursos

### Documentação Técnica
- [Google Cloud Platform](https://cloud.google.com/docs)
- [Vertex AI](https://cloud.google.com/vertex-ai/docs)
- [Firestore](https://firebase.google.com/docs/firestore)
- [Flutter](https://flutter.dev/docs)
- [React](https://react.dev/)

### APIs
- [ANVISA Bulário](https://consultas.anvisa.gov.br/)
- [OpenFDA API](https://open.fda.gov/apis/)
- [NCBI E-utilities](https://www.ncbi.nlm.nih.gov/books/NBK25501/)

### Inspiração
- [Whitebook](https://whitebook.com.br/)
- [UpToDate](https://www.uptodate.com/)
- [AMBOSS](https://www.amboss.com/)
- [EHR Go](https://ehrgo.com/)

---

**Documento Preparado Por:** Equipe MedFocus  
**Data:** Fevereiro 2026  
**Versão:** 1.0 PhD  
**Próxima Revisão:** Definir após kick-off  

---

## 📞 Próxima Ação

**Você decide:**

**Opção A:** Desenhar modelo de dados Firestore detalhado para todas as collections  
**Opção B:** Criar protótipo Figma das telas de colaboração  
**Opção C:** Definir arquitetura GCP completa com diagrama de serviços  
**Opção D:** Planejar pipeline de ingestão de dados (ANVISA, FDA, PubMed)  

**Qual caminho seguimos?**
