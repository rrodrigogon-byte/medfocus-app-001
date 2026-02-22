# 🏠 MedFocus PhD - Setup Local para Validação

> **Guia Completo para Rodar o Projeto Localmente**
> 
> Data: Fevereiro 2026  
> Versão: 1.0 - Local Development

---

## 📋 Pré-requisitos

### Software Necessário

```bash
# Node.js 20+ (LTS)
node --version  # deve retornar v20.x.x ou superior

# pnpm (package manager)
npm install -g pnpm@10

# Git
git --version
```

---

## 🚀 Setup Inicial (Primeira Vez)

### 1. Clonar o Repositório

```bash
# Clone do repositório
git clone https://github.com/rrodrigogon-byte/medfocus-app-001.git
cd medfocus-app-001

# Checkout na branch com as especificações
git checkout feature/medfocus-phd-specification
```

### 2. Instalar Dependências

```bash
# Instalar todas as dependências
pnpm install

# Verificar se instalou corretamente
pnpm list
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Copiar template
cp .env.example .env.local

# Editar com suas configurações
nano .env.local
```

**Conteúdo do `.env.local`:**

```bash
# Database (SQLite local para desenvolvimento)
DATABASE_URL="file:./medfocus.db"

# JWT Secret (gerar um aleatório)
JWT_SECRET="seu-secret-super-seguro-aqui-use-64-chars-min"

# Google Gemini API (opcional para testes com IA)
GOOGLE_GEMINI_API_KEY="sua-chave-aqui"

# APIs Externas (opcional)
OPENFDA_API_KEY="sua-chave-fda"
NCBI_API_KEY="sua-chave-pubmed"

# Environment
NODE_ENV="development"
PORT=3001

# Frontend URL
VITE_API_URL="http://localhost:3001"
```

### 4. Inicializar Banco de Dados

```bash
# Criar banco de dados local (SQLite)
pnpm db:push

# Ou se precisar recriar do zero
rm -f medfocus.db
pnpm db:push
```

---

## 🏃 Rodando o Projeto

### Opção 1: Modo Desenvolvimento (Recomendado para validação)

```bash
# Terminal 1: Rodar o backend (servidor)
pnpm dev

# O servidor estará rodando em http://localhost:3001
# Hot reload está ativo (qualquer mudança recarrega automaticamente)
```

Abra outro terminal:

```bash
# Terminal 2: Rodar o frontend (client)
cd client
pnpm dev

# O frontend estará rodando em http://localhost:5173
# Acesse no navegador: http://localhost:5173
```

### Opção 2: Modo Produção (Build completo)

```bash
# Build do projeto completo
pnpm build

# Rodar em modo produção
pnpm start

# Acesse: http://localhost:3001
```

---

## 📁 Estrutura do Projeto

```
medfocus-app-001/
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   │   └── medfocus/      # Componentes específicos MedFocus
│   │   ├── pages/             # Páginas
│   │   ├── services/          # Serviços (API calls)
│   │   └── App.tsx            # App principal
│   └── package.json
│
├── server/                    # Backend (Node.js + TypeScript)
│   ├── _core/
│   │   ├── index.ts           # Servidor principal (Express)
│   │   ├── trpc.ts            # tRPC router
│   │   ├── dataApi.ts         # Database operations
│   │   └── llm.ts             # Google Gemini integration
│   ├── routes/                # Rotas da API
│   └── services/              # Serviços
│
├── shared/                    # Código compartilhado (types, utils)
│   └── types.ts
│
├── docs/                      # 📚 DOCUMENTAÇÃO COMPLETA
│   ├── README.md              # Índice de navegação
│   ├── MEDFOCUS_ANALYSIS_GUIDE.md
│   ├── MEDFOCUS_PHD_TECHNICAL_SPEC.md
│   ├── MEDFOCUS_PHD_PARTNERSHIPS.md
│   ├── MEDFOCUS_PHD_SECURITY.md
│   ├── MEDFOCUS_PHD_ROADMAP.md
│   └── MEDFOCUS_DATA_ECOSYSTEM.md
│
├── drizzle/                   # Migrations do banco de dados
├── package.json               # Dependências
├── tsconfig.json              # Configuração TypeScript
├── vite.config.ts             # Configuração Vite
└── .env.local                 # Variáveis de ambiente (criar)
```

---

## 🧪 Validando o Sistema

### 1. Verificar Backend

```bash
# Com o servidor rodando, testar endpoints:

# Health check
curl http://localhost:3001/api/health

# Verificar banco de dados
curl http://localhost:3001/api/status
```

### 2. Verificar Frontend

Abra o navegador em `http://localhost:5173` e valide:

- ✅ Login funciona
- ✅ Dashboard carrega
- ✅ Navegação funciona
- ✅ Quizzes funcionam
- ✅ Biblioteca funciona

### 3. Verificar Funcionalidades Específicas

**Testar Sistema de Validação:**
```bash
# Acessar no navegador
http://localhost:5173/validated-library
```

**Testar Quizzes Progressivos:**
```bash
http://localhost:5173/progressive-quiz
```

**Testar Dashboard do Professor:**
```bash
http://localhost:5173/professor-dashboard
```

---

## 📚 Validando a Documentação

### Ler a Documentação Completa

```bash
# Abrir documentação no navegador
cd docs

# Ler índice principal
cat README.md

# Ler análise competitiva
cat MEDFOCUS_ANALYSIS_GUIDE.md

# Ler especificação técnica
cat MEDFOCUS_PHD_TECHNICAL_SPEC.md

# Ler parcerias B2B
cat MEDFOCUS_PHD_PARTNERSHIPS.md

# Ler segurança
cat MEDFOCUS_PHD_SECURITY.md

# Ler roadmap
cat MEDFOCUS_PHD_ROADMAP.md
```

### Ou usando um visualizador Markdown

```bash
# Instalar visualizador (opcional)
npm install -g markdown-preview-cli

# Visualizar documento
markdown-preview docs/README.md
```

---

## 🔧 Comandos Úteis

### Desenvolvimento

```bash
# Rodar servidor em modo watch (hot reload)
pnpm dev

# Verificar tipos TypeScript
pnpm check

# Formatar código
pnpm format

# Rodar testes
pnpm test
```

### Banco de Dados

```bash
# Gerar migrations
pnpm db:generate

# Aplicar migrations
pnpm db:push

# Abrir Drizzle Studio (UI para o banco)
pnpm db:studio
```

### Build

```bash
# Build completo (frontend + backend)
pnpm build

# Build apenas frontend
cd client && pnpm build

# Build apenas backend
pnpm build:server
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"

```bash
# Limpar node_modules e reinstalar
rm -rf node_modules
rm -f pnpm-lock.yaml
pnpm install
```

### Erro: "Port 3001 already in use"

```bash
# Encontrar processo usando a porta
lsof -i :3001

# Matar o processo
kill -9 <PID>

# Ou mudar a porta no .env.local
PORT=3002
```

### Erro: "Database locked"

```bash
# Fechar todas as conexões e recriar
rm -f medfocus.db
pnpm db:push
```

### Erro: React "multiple copies"

```bash
# Limpar cache do Vite
rm -rf client/node_modules/.vite
rm -rf node_modules/.vite

# Reinstalar
pnpm install
```

---

## 📊 Dados de Teste (Seed)

### Criar Usuários de Teste

```bash
# Criar arquivo seed.ts
cat > server/seed.ts << 'EOF'
import { db } from './db';
import { users } from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  // Criar usuário estudante
  await db.insert(users).values({
    email: 'estudante@medfocus.com',
    password: await bcrypt.hash('senha123', 10),
    name: 'João Silva',
    role: 'student',
    university: 'USP',
    graduationYear: 2028
  });

  // Criar usuário professor
  await db.insert(users).values({
    email: 'professor@medfocus.com',
    password: await bcrypt.hash('senha123', 10),
    name: 'Dr. Maria Santos',
    role: 'professor',
    specialty: 'Cardiologia',
    crm: '123456',
    crmState: 'SP'
  });

  console.log('Seed completed!');
}

seed();
EOF

# Executar seed
tsx server/seed.ts
```

### Logins de Teste

Após o seed:

**Estudante:**
- Email: `estudante@medfocus.com`
- Senha: `senha123`

**Professor:**
- Email: `professor@medfocus.com`
- Senha: `senha123`

---

## 🌐 Acessando de Outro Dispositivo

Se quiser testar no celular ou outro computador na mesma rede:

```bash
# Descobrir seu IP local
ifconfig | grep "inet " | grep -v 127.0.0.1

# Exemplo: 192.168.1.100

# Acessar de outro dispositivo:
# http://192.168.1.100:5173 (frontend)
# http://192.168.1.100:3001 (backend)
```

---

## 📱 Testando Funcionalidades Mobile (PWA)

```bash
# Com o servidor rodando, acesse pelo navegador mobile

# Chrome/Edge: Menu > Add to Home Screen
# Safari: Share > Add to Home Screen

# Testar offline:
# 1. Adicionar à tela inicial
# 2. Ativar modo avião
# 3. Abrir o app
# 4. Validar que flashcards e quizzes funcionam offline
```

---

## 📋 Checklist de Validação

### Backend
- [ ] Servidor inicia sem erros
- [ ] Banco de dados criado corretamente
- [ ] Endpoints respondem (health check)
- [ ] Autenticação funciona (login/register)
- [ ] tRPC routes funcionam

### Frontend
- [ ] Build sem erros
- [ ] Hot reload funciona
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Navegação funciona
- [ ] Todos os componentes renderizam

### Funcionalidades Core
- [ ] Sistema de validação (3 tiers)
- [ ] Quizzes progressivos
- [ ] Flashcards com SM-2
- [ ] Gamificação (XP, badges)
- [ ] Casos clínicos
- [ ] Simulados ENAMED/REVALIDA
- [ ] Atlas anatômico
- [ ] Biblioteca acadêmica

### Documentação
- [ ] Todos os 6 documentos .md acessíveis
- [ ] README.md na pasta docs/ navegável
- [ ] Links entre documentos funcionam
- [ ] Formatação Markdown correta

---

## 🎯 Próximos Passos Após Validação

1. **Validar Documentação**
   - Ler todos os documentos em `docs/`
   - Verificar se o roadmap faz sentido
   - Validar projeções financeiras

2. **Validar Arquitetura Técnica**
   - Revisar `MEDFOCUS_PHD_TECHNICAL_SPEC.md`
   - Validar modelo de dados proposto
   - Confirmar stack tecnológico (GCP vs alternativas)

3. **Validar Estratégia de Parcerias**
   - Revisar `MEDFOCUS_PHD_PARTNERSHIPS.md`
   - Ajustar pricing tiers se necessário
   - Confirmar alvos de laboratórios

4. **Validar Segurança**
   - Revisar `MEDFOCUS_PHD_SECURITY.md`
   - Confirmar compliance LGPD
   - Validar políticas de acesso

5. **Aprovar Roadmap**
   - Revisar `MEDFOCUS_PHD_ROADMAP.md`
   - Ajustar timeline se necessário
   - Aprovar budget e contratações

---

## 📞 Suporte

**Dúvidas ou problemas?**

1. Verificar este documento primeiro
2. Verificar `docs/README.md` para documentação completa
3. Abrir issue no GitHub
4. Contato: dev@medfocus.com.br

---

## ✅ Validação Completa

Após rodar e validar tudo:

```bash
# Criar tag de validação
git tag -a v1.0-validated -m "Documentação e especificação validadas"

# Push da tag
git push origin v1.0-validated
```

---

**Última atualização:** Fevereiro 2026  
**Mantido por:** Equipe MedFocus PhD  
**Status:** Pronto para validação local
