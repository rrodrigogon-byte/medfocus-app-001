# 🏥 MedFocus PhD - Terminal de Inteligência Clínica

> **Versão Local de Desenvolvimento** - Sistema completo de educação médica com IA

[![Status](https://img.shields.io/badge/status-development-yellow)](https://github.com/rrodrigogon-byte/medfocus-app-001)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## 🚀 Quick Start (Para Validação Local)

### Instalação Automatizada

```bash
# 1. Clone o repositório
git clone https://github.com/rrodrigogon-byte/medfocus-app-001.git
cd medfocus-app-001

# 2. Execute o setup (instala tudo automaticamente)
bash scripts/setup-local.sh

# 3. Inicie o sistema completo
bash scripts/quick-start.sh
```

**Pronto!** Acesse em: http://localhost:5173

### Comandos Rápidos

```bash
pnpm run dev          # Backend apenas (porta 3001)
pnpm run dev:client   # Frontend apenas (porta 5173)
pnpm run dev:full     # Backend + Frontend juntos
pnpm run setup        # Configuração inicial completa
pnpm run mock:data    # Gerar dados de teste
```

---

## 📋 O Que Está Incluído

Esta versão local inclui:

✅ **Backend Completo** (Express + tRPC + SQLite)  
✅ **Frontend React** com Vite e TailwindCSS  
✅ **100+ Medicamentos** (dados mock da ANVISA)  
✅ **50 Patologias** com protocolos em 3 camadas  
✅ **50 Calculadoras Médicas** funcionais  
✅ **30 Diretrizes** de sociedades brasileiras  
✅ **WebSocket** para notificações em tempo real  
✅ **Gemini AI** integrado (com mock se não tiver API key)  

---

## 📚 Documentação

### Para Desenvolvedores

- **[Guia de Desenvolvimento Local](./LOCAL_DEVELOPMENT.md)** ⭐ COMECE AQUI
  - Setup detalhado passo a passo
  - Solução de problemas
  - Comandos úteis

### Especificações Técnicas

- [Especificação Técnica Completa](./docs/MEDFOCUS_PHD_TECHNICAL_SPEC.md)
- [Arquitetura de APIs e Data Pipeline](./docs/MEDFOCUS_PHD_API_ARCHITECTURE.md)
- [Parcerias e Integrações B2B](./docs/MEDFOCUS_PHD_PARTNERSHIPS.md)
- [Segurança e Compliance (LGPD/HIPAA)](./docs/MEDFOCUS_PHD_SECURITY.md)
- [Roadmap 2026-2027](./docs/MEDFOCUS_PHD_ROADMAP.md)
- [Análise Competitiva](./docs/MEDFOCUS_ANALYSIS_GUIDE.md)

### Navegação da Documentação

- [Índice Geral da Documentação](./docs/README.md)

---

## 🎯 Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** (instalado automaticamente pelo script)
- **Git** ([Download](https://git-scm.com/))

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────┐
│           Frontend (React + Vite + TailwindCSS)         │
│                  http://localhost:5173                  │
└────────────┬────────────────────────────────────────────┘
             │ tRPC + WebSocket
             │
┌────────────▼────────────────────────────────────────────┐
│         Backend (Express + tRPC + Socket.IO)            │
│              http://localhost:3001                      │
│               ws://localhost:3002                       │
└────────────┬────────────────────────────────────────────┘
             │
   ┌─────────┼─────────┬─────────────┬──────────────┐
   │         │         │             │              │
   ▼         ▼         ▼             ▼              ▼
┌──────┐ ┌──────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐
│SQLite│ │Mock  │ │ Gemini  │ │ PubMed   │ │ ANVISA   │
│  DB  │ │ APIs │ │   AI    │ │   API    │ │   API    │
└──────┘ └──────┘ └─────────┘ └──────────┘ └──────────┘
```

---

## 🔑 Funcionalidades Principais

### Para Estudantes de Medicina

- 📚 **Biblioteca Acadêmica Validada** - 30+ materiais de 7 universidades
- 🎯 **Quiz Adaptativos** - 463 questões reais do ENAMED/REVALIDA
- 🧠 **MedGenie AI** - Assistente inteligente baseado em Gemini
- 📊 **Dashboards de Performance** - Acompanhamento de estudos
- 🏆 **Gamificação** - Ranking e badges de conquistas
- 📱 **PWA/Offline** - Funciona sem internet

### Para Professores

- ✅ **Sistema de Validação** - Qualidade em 3 tiers
- 📋 **Dashboard de Impacto** - Métricas de contribuição
- 💬 **Fórum Acadêmico** - Discussões moderadas
- 📈 **Analytics** - Insights sobre uso do conteúdo

### MedFocus PhD (Em Desenvolvimento)

- 💊 **2000+ Medicamentos** - Base integrada com ANVISA/FDA
- 🏥 **Protocolos Clínicos** - 3 camadas (Plantão/Especialista/PhD)
- 🔬 **Fronteira da Ciência** - Últimos ensaios clínicos
- 🤝 **Colaboração Wiki** - Sistema de votação e reputação
- 🧮 **50+ Calculadoras** - Scores clínicos validados

---

## 🛠️ Stack Tecnológico

### Frontend
- React 19
- TypeScript 5.6
- Vite
- TailwindCSS
- Radix UI
- React Query
- tRPC Client

### Backend
- Node.js 18+
- Express.js
- tRPC
- Socket.IO
- SQLite (Drizzle ORM)
- JWT Authentication

### APIs & Serviços
- Google Gemini AI (1.5 Pro)
- ANVISA Dados Abertos
- OpenFDA
- PubMed (NCBI Entrez)
- ClinicalTrials.gov

---

## 📊 Status do Projeto

### ✅ Funcionalidades Implementadas

- [x] Sistema de autenticação (JWT + bcrypt)
- [x] Dashboard de estudante
- [x] Dashboard de professor
- [x] Biblioteca acadêmica com filtros
- [x] Sistema de validação em 3 tiers
- [x] Quiz adaptativos (Bloom taxonomy)
- [x] WebSocket para notificações em tempo real
- [x] Integração Gemini AI
- [x] Base de questões ENAMED/REVALIDA (463 questões)
- [x] Gamificação (ranking, badges)
- [x] PWA básico

### 🚧 Em Desenvolvimento (Roadmap 2026)

- [ ] EHR educacional (50 casos clínicos)
- [ ] Atlas de imagens médicas (500+ imagens)
- [ ] Database completo de medicamentos (2000+)
- [ ] 50+ calculadoras médicas
- [ ] App móvel nativo (iOS/Android)
- [ ] Analytics preditivo com ML
- [ ] API pública REST + OAuth2
- [ ] Parcerias B2B (Eurofarma, Cimed, etc.)

---

## 📦 Estrutura do Projeto

```
medfocus-app-001/
├── 📄 LOCAL_DEVELOPMENT.md    # Guia completo de desenvolvimento
├── 📄 README.md                # Este arquivo
├── 📁 client/                  # Frontend React
├── 📁 server/                  # Backend Node.js
├── 📁 shared/                  # Código compartilhado
├── 📁 docs/                    # Documentação técnica
├── 📁 scripts/                 # Scripts de automação
│   ├── setup-local.sh          # Setup completo
│   ├── quick-start.sh          # Início rápido
│   └── generate-mock-data.js   # Geração de dados
├── 📁 data/mock-data/          # Dados de teste
├── 📄 .env.example             # Template de variáveis
├── 📄 .env.local               # Configuração local (git-ignored)
└── 📄 package.json             # Dependências
```

---

## 🧪 Testes

```bash
# Executar todos os testes
pnpm run test

# Testes em modo watch
pnpm run test:watch

# Verificar tipos TypeScript
pnpm run check
```

---

## 🐛 Solução de Problemas Comuns

### Porta já em uso
```bash
# Matar processo na porta 3001
lsof -ti:3001 | xargs kill -9

# Ou usar porta alternativa
PORT=3002 pnpm run dev
```

### Erro de módulo não encontrado
```bash
# Limpar e reinstalar
pnpm run reset
```

### Banco de dados travado
```bash
# Resetar banco local
rm medfocus-local.db
pnpm run db:push
pnpm run mock:data
```

**Veja mais soluções em:** [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md#solução-de-problemas)

---

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

**Convenções de Commit:** Seguimos [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📞 Suporte e Contato

- **GitHub Issues**: [Reportar Bug](https://github.com/rrodrigogon-byte/medfocus-app-001/issues)
- **GitHub Discussions**: [Perguntas e Discussões](https://github.com/rrodrigogon-byte/medfocus-app-001/discussions)
- **Documentação**: [Wiki do Projeto](https://github.com/rrodrigogon-byte/medfocus-app-001/wiki)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🎯 Próximos Passos

1. **[Leia o Guia de Desenvolvimento](./LOCAL_DEVELOPMENT.md)** - Entenda o sistema
2. **Execute o setup** - `bash scripts/setup-local.sh`
3. **Explore a aplicação** - Navegue pelas funcionalidades
4. **Teste com dados mock** - Valide os fluxos principais
5. **Configure APIs reais** (opcional) - Para features completas
6. **Desenvolva novas features** - Siga o roadmap

---

## 🌟 Diferenciais Competitivos

| Feature | MedFocus PhD | Whitebook | AMBOSS | UpToDate |
|---------|--------------|-----------|---------|----------|
| EHR Educacional | ✅ | ❌ | ❌ | ❌ |
| Busca Semântica IA | ✅ | ❌ | 🟡 | 🟡 |
| Conteúdo 3 Camadas | ✅ | ❌ | ❌ | ❌ |
| Parcerias Indústria | ✅ | ❌ | ❌ | ❌ |
| ENAMED/REVALIDA | ✅ (463) | ❌ | 🟡 | ❌ |
| Currículo BR | ✅ | 🟡 | ❌ | ❌ |
| Open Source | ✅ | ❌ | ❌ | ❌ |

---

<div align="center">

**Feito com ❤️ pela equipe MedFocus**

[Website](#) • [Documentação](./docs/README.md) • [GitHub](https://github.com/rrodrigogon-byte/medfocus-app-001)

**v1.0.0** • 2026-02-22

</div>
