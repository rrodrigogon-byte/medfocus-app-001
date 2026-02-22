# 🚀 MedFocus PhD - Guia de Desenvolvimento Local

## 📋 Índice
- [Pré-requisitos](#pré-requisitos)
- [Instalação Rápida](#instalação-rápida)
- [Configuração Detalhada](#configuração-detalhada)
- [Executando o Sistema](#executando-o-sistema)
- [Arquitetura Local](#arquitetura-local)
- [APIs e Dados Mock](#apis-e-dados-mock)
- [Comandos Úteis](#comandos-úteis)
- [Solução de Problemas](#solução-de-problemas)

---

## 🎯 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** (será instalado automaticamente pelo script)
- **Git** ([Download](https://git-scm.com/))
- Qualquer editor de código (recomendado: VSCode)

### Verificação de Versões

```bash
node --version   # v18.0.0 ou superior
npm --version    # 9.0.0 ou superior
git --version    # qualquer versão recente
```

---

## ⚡ Instalação Rápida

### Opção 1: Script Automático (Recomendado)

```bash
# Clone o repositório (se ainda não tiver)
git clone https://github.com/rrodrigogon-byte/medfocus-app-001.git
cd medfocus-app-001

# Execute o script de setup
bash scripts/setup-local.sh
```

O script irá:
- ✅ Verificar Node.js e instalar pnpm
- ✅ Instalar todas as dependências
- ✅ Criar arquivo `.env.local` com configurações locais
- ✅ Criar estrutura de diretórios
- ✅ Inicializar banco de dados SQLite
- ✅ Gerar dados mock para testes

### Opção 2: Setup Manual

```bash
# 1. Clone e entre no diretório
git clone https://github.com/rrodrigogon-byte/medfocus-app-001.git
cd medfocus-app-001

# 2. Instale pnpm (se não tiver)
npm install -g pnpm

# 3. Instale dependências
pnpm install

# 4. Configure ambiente
cp .env.example .env.local

# 5. Crie diretórios necessários
mkdir -p uploads logs cache data/mock-data data/exports config

# 6. Inicialize banco de dados
pnpm run db:push

# 7. Gere dados mock
node scripts/generate-mock-data.js
```

---

## ⚙️ Configuração Detalhada

### Arquivo `.env.local`

O arquivo `.env.local` já vem configurado para desenvolvimento local, mas você pode personalizá-lo:

```bash
# Edite o arquivo
nano .env.local
```

#### Configurações Principais

```env
# Servidor
PORT=3001                                    # Porta do backend
CLIENT_URL=http://localhost:5173             # URL do frontend

# Banco de Dados
DATABASE_URL=file:./medfocus-local.db        # SQLite local

# Feature Flags
ENABLE_MOCK_APIS=true                        # Usar dados mock
ENABLE_AI_FEATURES=true                      # Habilitar Gemini AI
```

### APIs Externas (Opcional)

Para usar APIs reais em vez de mocks:

1. **Gemini AI** (Google AI Studio)
   ```env
   GEMINI_API_KEY="sua-chave-aqui"
   ```
   Obtenha em: https://ai.google.dev/

2. **PubMed (NCBI)**
   ```env
   PUBMED_API_KEY="sua-chave-aqui"
   PUBMED_EMAIL="seu-email@exemplo.com"
   ```
   Registre-se em: https://www.ncbi.nlm.nih.gov/account/

3. **OpenFDA** (opcional, aumenta rate limits)
   ```env
   OPENFDA_API_KEY="sua-chave-aqui"
   ```

**Nota:** Com `ENABLE_MOCK_APIS=true`, o sistema funciona **sem** essas chaves.

---

## 🏃 Executando o Sistema

### Modo Desenvolvimento (Recomendado)

Abra **dois terminais**:

**Terminal 1 - Backend:**
```bash
pnpm run dev
```
- Backend rodando em `http://localhost:3001`
- WebSocket em `ws://localhost:3002`
- Hot-reload ativado

**Terminal 2 - Frontend:**
```bash
pnpm run client:dev
```
- Frontend rodando em `http://localhost:5173`
- Hot-reload ativado

### Modo Produção Local

```bash
# Build completo
pnpm run build

# Executar versão produção
pnpm run start
```

### Verificação de Saúde

Após iniciar, teste os endpoints:

```bash
# Health check do backend
curl http://localhost:3001/health

# Deve retornar:
# {"status":"ok","timestamp":"..."}
```

---

## 🏗️ Arquitetura Local

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Vite)                      │
│                 http://localhost:5173                   │
└────────────┬────────────────────────────────────────────┘
             │
             │ HTTP/WebSocket
             │
┌────────────▼────────────────────────────────────────────┐
│              Backend (Express + tRPC)                   │
│                http://localhost:3001                    │
│                 ws://localhost:3002                     │
└────────────┬────────────────────────────────────────────┘
             │
   ┌─────────┼─────────┬─────────────┬──────────────┐
   │         │         │             │              │
   ▼         ▼         ▼             ▼              ▼
┌──────┐ ┌──────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐
│SQLite│ │Mock  │ │ Gemini  │ │ PubMed   │ │ ANVISA   │
│ DB   │ │APIs  │ │   AI    │ │   API    │ │   API    │
└──────┘ └──────┘ └─────────┘ └──────────┘ └──────────┘
```

### Estrutura de Diretórios

```
medfocus-app-001/
├── client/               # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes UI
│   │   ├── pages/       # Páginas
│   │   └── lib/         # Utilitários
│   └── public/          # Assets estáticos
│
├── server/              # Backend Node.js
│   ├── _core/           # Núcleo do servidor
│   ├── routes/          # Rotas tRPC
│   └── services/        # Serviços de negócio
│
├── shared/              # Código compartilhado
│   ├── types/           # TypeScript types
│   └── utils/           # Utilitários comuns
│
├── docs/                # Documentação
│   ├── MEDFOCUS_PHD_TECHNICAL_SPEC.md
│   ├── MEDFOCUS_PHD_PARTNERSHIPS.md
│   └── README.md
│
├── scripts/             # Scripts de automação
│   ├── setup-local.sh
│   └── generate-mock-data.js
│
├── data/                # Dados locais
│   ├── mock-data/       # Dados gerados para testes
│   └── exports/         # Exportações
│
├── uploads/             # Arquivos enviados
├── logs/                # Logs da aplicação
└── cache/               # Cache local
```

---

## 🎭 APIs e Dados Mock

### Dados Mock Gerados

O script `generate-mock-data.js` cria:

- **100 medicamentos** com informações completas
- **50 patologias** com protocolos 3 camadas
- **50 calculadoras** médicas funcionais
- **30 diretrizes** de sociedades brasileiras

Arquivos gerados em: `data/mock-data/`

### Mock vs. Real APIs

| API | Mock (Padrão) | Real (com chave) |
|-----|---------------|------------------|
| **ANVISA** | ✅ 100 fármacos | ⚠️ Requer scraping |
| **OpenFDA** | ✅ Labels mock | ✅ Endpoint público |
| **PubMed** | ✅ Artigos mock | ✅ Com API key |
| **Gemini AI** | ✅ Respostas simuladas | ✅ Com API key |

### Exemplo de Mock API

```typescript
// server/services/mockApis.ts
export const mockAnvisaData = {
  getDrug: (id: string) => ({
    id,
    name: "Dipirona 500mg",
    manufacturer: "Eurofarma",
    registry: "1.0000.1234",
    price: "R$ 12.50"
  })
};
```

---

## 🛠️ Comandos Úteis

### Desenvolvimento

```bash
# Iniciar dev server (backend)
pnpm run dev

# Iniciar dev server (frontend - em outro terminal)
pnpm run client:dev

# Verificar tipos TypeScript
pnpm run check

# Formatar código
pnpm run format

# Executar testes
pnpm run test

# Executar testes em watch mode
pnpm run test:watch
```

### Banco de Dados

```bash
# Aplicar migrações
pnpm run db:push

# Gerar cliente Drizzle
pnpm run db:generate

# Abrir Drizzle Studio (visualizador de BD)
pnpm run db:studio
```

### Build e Deploy

```bash
# Build completo
pnpm run build

# Executar versão de produção
pnpm run start

# Analisar bundle size
pnpm run build -- --analyze
```

### Limpeza

```bash
# Limpar node_modules e reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Limpar cache e builds
rm -rf dist build cache logs/*.log

# Reset completo (cuidado!)
git clean -fdx
pnpm install
```

---

## 🔧 Solução de Problemas

### Problema: "Port 3001 already in use"

```bash
# Encontrar processo usando a porta
lsof -ti:3001

# Matar o processo (substitua PID)
kill -9 PID

# Ou use outro terminal para backend
PORT=3002 pnpm run dev
```

### Problema: "Cannot find module '@prisma/client'"

```bash
# Reinstalar dependências
pnpm install

# Gerar cliente Prisma/Drizzle
pnpm run db:push
```

### Problema: "Database is locked"

```bash
# Feche todos os processos do servidor

# Delete o banco e recrie
rm medfocus-local.db
pnpm run db:push
node scripts/generate-mock-data.js
```

### Problema: "CORS error"

Verifique `.env.local`:
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Problema: "Gemini API not responding"

Com mock habilitado:
```env
ENABLE_MOCK_APIS=true
```

Ou obtenha chave real:
```env
GEMINI_API_KEY="sua-chave-aqui"
```

### Logs e Debugging

```bash
# Ver logs em tempo real
tail -f logs/app.log

# Debug mode
LOG_LEVEL=debug pnpm run dev

# Ver requisições HTTP
DEBUG=express:* pnpm run dev
```

---

## 📚 Recursos Adicionais

### Documentação Técnica

- [Especificação Técnica Completa](./MEDFOCUS_PHD_TECHNICAL_SPEC.md)
- [Parcerias e APIs](./MEDFOCUS_PHD_PARTNERSHIPS.md)
- [Roadmap 2026](./MEDFOCUS_PHD_ROADMAP.md)
- [Análise Competitiva](./MEDFOCUS_ANALYSIS_GUIDE.md)

### APIs Externas

- [Google Gemini API](https://ai.google.dev/)
- [NCBI PubMed API](https://www.ncbi.nlm.nih.gov/home/develop/api/)
- [OpenFDA API](https://open.fda.gov/apis/)
- [ANVISA Dados Abertos](https://dados.anvisa.gov.br/)

### Comunidade e Suporte

- **GitHub**: [medfocus-app-001](https://github.com/rrodrigogon-byte/medfocus-app-001)
- **Issues**: Reporte bugs ou solicite features
- **Discussions**: Perguntas e discussões técnicas

---

## ✅ Checklist de Validação

Após setup, verifique se tudo está funcionando:

- [ ] Backend iniciando sem erros em `http://localhost:3001`
- [ ] Frontend acessível em `http://localhost:5173`
- [ ] WebSocket conectando em `ws://localhost:3002`
- [ ] Endpoint `/health` retornando `{"status":"ok"}`
- [ ] Dados mock carregados em `data/mock-data/`
- [ ] Login de teste funcionando
- [ ] Hot-reload funcionando (edite um arquivo e salve)
- [ ] Console sem erros críticos

---

## 🎉 Próximos Passos

Agora que o ambiente está configurado:

1. **Explore a aplicação**: Navegue pelas funcionalidades
2. **Teste os mocks**: Veja os dados gerados
3. **Leia a documentação**: Entenda a arquitetura
4. **Configure APIs reais**: Obtenha chaves de API (opcional)
5. **Desenvolva features**: Siga o roadmap em `MEDFOCUS_PHD_ROADMAP.md`

---

**Versão**: 1.0.0  
**Última atualização**: 2026-02-22  
**Autores**: MedFocus Team  

---

**🚀 Bom desenvolvimento!**
