# 🔍 GUIA DE ANÁLISE DE CÓDIGO - MEDFOCUS PhD

**Data:** 23 de fevereiro de 2026  
**Objetivo:** Facilitar a análise e compreensão do código-base

---

## 📑 ÍNDICE

1. [Onde Começar](#onde-começar)
2. [Fluxos Críticos](#fluxos-críticos)
3. [Padrões de Código](#padrões-de-código)
4. [Pontos de Atenção](#pontos-de-atenção)
5. [Checklist de Revisão](#checklist-de-revisão)

---

## 🎯 ONDE COMEÇAR

### Para Entender o Sistema (順序 recomendada)

#### 1️⃣ **Documentação Geral** (30 min)
```
📄 README.md                        - Overview do projeto
📄 COMPLETE_PROJECT_ANALYSIS.md     - Análise completa (39 KB)
📄 PROJECT_FILE_INDEX.md            - Índice de todos os arquivos
📄 TECHNICAL_ARCHITECTURE.md        - Arquitetura técnica
```

**O que aprender:**
- Objetivo do projeto
- Stack tecnológico
- Estrutura de diretórios
- Custos e ROI

---

#### 2️⃣ **Backend Core** (45 min)

##### Ordem de leitura:
```
1. server/_core/index.ts          - Entry point do servidor
   ↓ Entenda: Middleware stack, rotas, WebSocket

2. server/_core/trpc.ts            - Configuração tRPC
   ↓ Entenda: Type-safety, context, procedures

3. server/routers.ts               - Lista de routers
   ↓ Entenda: Estrutura de APIs disponíveis

4. server/routes/auth.ts           - Autenticação
   ↓ Entenda: Login, JWT, OAuth

5. server/routes/materials.ts      - Materiais acadêmicos
   ↓ Entenda: CRUD, validação, upload

6. server/routes/quizzes.ts        - Quizzes
   ↓ Entenda: Simulados, attempts, leaderboard
```

**Conceitos-chave:**
- **tRPC:** Type-safe API sem necessidade de OpenAPI manual
- **Drizzle ORM:** Query builder type-safe (similar ao Prisma)
- **JWT:** Autenticação stateless com refresh tokens

---

#### 3️⃣ **Frontend Core** (45 min)

##### Ordem de leitura:
```
1. client/src/main.tsx             - Entry point React
   ↓ Entenda: Providers (tRPC, Query, Theme)

2. client/src/App.tsx              - Componente raiz
   ↓ Entenda: Error boundary, routing

3. client/src/lib/trpc.ts          - Cliente tRPC
   ↓ Entenda: Como fazer API calls type-safe

4. client/src/components/medfocus/Dashboard.tsx
   ↓ Entenda: Estrutura de um componente principal

5. client/src/components/medfocus/Assistant.tsx
   ↓ Entenda: Integração com Gemini (IA)

6. client/src/components/medfocus/QuestionBattle.tsx
   ↓ Entenda: WebSocket para multiplayer
```

**Conceitos-chave:**
- **tRPC Client:** Auto-complete e type checking nas API calls
- **TanStack Query:** Cache automático, re-fetch inteligente
- **Radix UI:** Componentes acessíveis e customizáveis

---

#### 4️⃣ **GCP Cloud Functions** (30 min)

##### Ordem de leitura:
```
1. gcp/cloud-functions/pubmed-ingestion/main.py
   ↓ Entenda: Scraping PubMed, embeddings, BigQuery

2. gcp/cloud-functions/anvisa-fda-ingestion/main.py
   ↓ Entenda: Monitor regulatório, detecção de mudanças

3. gcp/cloud-functions/document-ai-processor/main.py
   ↓ Entenda: Extração de PDFs, validação humana
```

**Conceitos-chave:**
- **Vertex AI Embeddings:** Vetorização semântica para RAG
- **BigQuery Streaming:** Inserção em tempo real
- **Pub/Sub:** Event-driven architecture

---

#### 5️⃣ **Configurações GCP** (20 min)

##### Ordem de leitura:
```
1. gcp/config/med-brain-system-instructions.md
   ↓ Entenda: Prompts do Gemini, 3 níveis de resposta

2. gcp/config/partner-api-spec.yaml
   ↓ Entenda: API B2B para laboratórios

3. Dockerfile
   ↓ Entenda: Build multi-stage, otimizações

4. cloudbuild.yaml
   ↓ Entenda: Pipeline CI/CD
```

---

## 🔄 FLUXOS CRÍTICOS

### Fluxo 1: Autenticação (Login)

```
USER (Browser)
    ↓ POST /api/trpc/auth.login { email, password }
server/routes/auth.ts:login()
    ↓ Busca user no DB (Drizzle)
    ↓ Verifica senha (bcrypt)
    ↓ Gera JWT (access + refresh)
    ↓ Armazena refresh_token no DB
    ↓ Retorna { user, accessToken, refreshToken }
USER (Browser)
    ↓ Armazena em localStorage
    ↓ Redireciona para /dashboard
```

**Arquivos envolvidos:**
- `server/routes/auth.ts` (linha ~50): `login` procedure
- `server/middleware/auth.ts` (linha ~15): `authMiddleware`
- `client/src/_core/hooks/useAuth.ts` (linha ~30): `useAuth` hook

---

### Fluxo 2: Realizar Quiz

```
USER (Browser)
    ↓ Acessa /quizzes → SimuladoENAMED.tsx
    ↓ Seleciona "ENAMED 2024 - Cardiologia"
    ↓ trpc.quizzes.get.useQuery({ id })
SERVER (tRPC)
    ↓ server/routes/quizzes.ts:get()
    ↓ SELECT * FROM quizzes WHERE id = ?
    ↓ Retorna { quiz, questions[] }
USER (Browser)
    ↓ Renderiza questões
    ↓ Usuário responde todas
    ↓ trpc.quizzes.attempt.useMutation({ quiz_id, answers })
SERVER (tRPC)
    ↓ server/routes/quizzes.ts:attempt()
    ↓ Calcula score (compara answers com gabarito)
    ↓ INSERT INTO quiz_attempts (user_id, quiz_id, score, answers)
    ↓ UPDATE user_stats SET quizzes_completed++, total_xp += score*10
    ↓ Retorna { score, feedback, ranking_position }
USER (Browser)
    ↓ Mostra resultado + animação XP
    ↓ XPToast.tsx renderiza "+250 XP"
```

**Arquivos envolvidos:**
- `client/src/components/medfocus/SimuladoENAMED.tsx`
- `server/routes/quizzes.ts` (linha ~80): `attempt` procedure
- `client/src/components/medfocus/XPToast.tsx`
- `client/src/hooks/useGamification.ts`

---

### Fluxo 3: Med-Brain (IA Assistant)

```
USER (Browser)
    ↓ Digita "Dose de Dapagliflozina para IC?"
    ↓ trpc.assistant.query.useMutation({ query, level: 'doctor' })
SERVER (tRPC)
    ↓ server/routes/assistant.ts:query()
    ↓ Chama queryMedBrain() (server/_core/llm.ts)
        ↓ STEP 1: Gera embedding da query (Vertex AI)
        ↓ STEP 2: Busca top-10 estudos similares (BigQuery)
            ↓ SELECT * FROM pubmed_studies
            ↓ ORDER BY COSINE_DISTANCE(embedding, @query_embedding)
            ↓ LIMIT 10
        ↓ STEP 3: Busca diretrizes (BigQuery)
            ↓ SELECT * FROM medical_guidelines
            ↓ WHERE specialty = 'Cardiology'
        ↓ STEP 4: Constrói contexto RAG (concatena estudos + diretrizes)
        ↓ STEP 5: Chama Gemini 2.5 Pro
            ↓ Envia: system_instructions + context + query
            ↓ Recebe: JSON { answer, action_buttons, sources }
    ↓ Retorna resposta estruturada
USER (Browser)
    ↓ Assistant.tsx renderiza Markdown
    ↓ Botões de ação ("Ver Bula ANVISA", etc)
    ↓ Sources tags (PMID:xxx, SBC_2024)
```

**Arquivos envolvidos:**
- `client/src/components/medfocus/Assistant.tsx`
- `server/routes/assistant.ts`
- `server/_core/llm.ts` (linha ~100): `queryMedBrain()`
- `gcp/config/med-brain-system-instructions.md`

---

### Fluxo 4: Data Ingestion (PubMed)

```
CLOUD SCHEDULER
    ↓ Trigger semanal (segunda 02:00)
    ↓ HTTP POST → Cloud Function
CLOUD FUNCTION (pubmed-ingestion)
    ↓ gcp/cloud-functions/pubmed-ingestion/main.py:main()
    ↓ FOR each drug in TOP_500_DRUGS:
        ↓ Busca no PubMed (BioPython)
            ↓ query = f'"{drug}" AND "Randomized Controlled Trial"'
            ↓ results = Entrez.esearch(retmax=100)
        ↓ Fetch detalhes (título, abstract, DOI)
        ↓ Gera embeddings (Vertex AI text-embedding-004)
        ↓ INSERT INTO BigQuery (pubmed_studies)
    ↓ Publica evento Pub/Sub → "new_studies"
PUB/SUB
    ↓ Backend recebe evento
    ↓ Notifica usuários inscritos
```

**Arquivos envolvidos:**
- `gcp/cloud-functions/pubmed-ingestion/main.py`
- `gcp/cloud-functions/pubmed-ingestion/requirements.txt`

---

## 📐 PADRÕES DE CÓDIGO

### Pattern 1: tRPC Procedure (Backend)

```typescript
// server/routes/example.ts

import { router, publicProcedure, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';

export const exampleRouter = router({
  // ─────────────────────────────────────────────────────────
  // PROCEDURE PÚBLICO (sem autenticação)
  // ─────────────────────────────────────────────────────────
  list: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).optional().default(20),
      offset: z.number().min(0).optional().default(0)
    }))
    .query(async ({ input, ctx }) => {
      const items = await ctx.db.items.findMany({
        limit: input.limit,
        offset: input.offset
      });
      return items;
    }),

  // ─────────────────────────────────────────────────────────
  // PROCEDURE PROTEGIDO (requer autenticação)
  // ─────────────────────────────────────────────────────────
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(3).max(255),
      content: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      // ctx.user está disponível (injetado pelo authMiddleware)
      const item = await ctx.db.items.insert({
        ...input,
        author_id: ctx.user.id,
        created_at: new Date()
      });
      
      return item;
    }),

  // ─────────────────────────────────────────────────────────
  // PROCEDURE COM VALIDAÇÃO DE ROLE
  // ─────────────────────────────────────────────────────────
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const item = await ctx.db.items.findOne({ id: input.id });
      
      // Validar permissão
      if (item.author_id !== ctx.user.id && ctx.user.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Você não tem permissão para deletar este item'
        });
      }
      
      await ctx.db.items.delete({ id: input.id });
      return { success: true };
    })
});
```

---

### Pattern 2: tRPC Client Usage (Frontend)

```typescript
// client/src/components/Example.tsx

import { trpc } from '@/lib/trpc';

export function ExampleComponent() {
  // ──────────────────────────────────────────────────────
  // QUERY (GET data)
  // ──────────────────────────────────────────────────────
  const { data: items, isLoading, error } = trpc.example.list.useQuery({
    limit: 20,
    offset: 0
  }, {
    // Opções do TanStack Query
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    refetchOnWindowFocus: false
  });

  // ──────────────────────────────────────────────────────
  // MUTATION (POST/PUT/DELETE data)
  // ──────────────────────────────────────────────────────
  const utils = trpc.useContext(); // Para invalidar cache

  const createItem = trpc.example.create.useMutation({
    onSuccess: () => {
      // Invalida cache → re-fetch automático
      utils.example.list.invalidate();
      toast.success('Item criado com sucesso!');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleSubmit = (data: FormData) => {
    createItem.mutate({
      title: data.title,
      content: data.content
    });
  };

  // ──────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <ItemList items={items} />
      <CreateForm onSubmit={handleSubmit} loading={createItem.isLoading} />
    </div>
  );
}
```

---

### Pattern 3: Drizzle ORM Queries

```typescript
// server/services/database.ts

import { db } from '../db';
import { users, materials, quizzes } from '../../drizzle/schema';
import { eq, and, gte, desc } from 'drizzle-orm';

// ──────────────────────────────────────────────────────
// SELECT simples
// ──────────────────────────────────────────────────────
const user = await db.select()
  .from(users)
  .where(eq(users.email, 'user@example.com'))
  .limit(1)
  .then(rows => rows[0]);

// ──────────────────────────────────────────────────────
// SELECT com filtros múltiplos
// ──────────────────────────────────────────────────────
const recentMaterials = await db.select()
  .from(materials)
  .where(
    and(
      eq(materials.specialty, 'Cardiology'),
      eq(materials.validation_status, 'approved'),
      gte(materials.created_at, new Date('2024-01-01'))
    )
  )
  .orderBy(desc(materials.created_at))
  .limit(20);

// ──────────────────────────────────────────────────────
// JOIN (inner join)
// ──────────────────────────────────────────────────────
const materialsWithAuthors = await db.select({
  material: materials,
  author: users
})
  .from(materials)
  .innerJoin(users, eq(materials.author_id, users.id))
  .where(eq(materials.specialty, 'Cardiology'));

// ──────────────────────────────────────────────────────
// INSERT
// ──────────────────────────────────────────────────────
const newQuiz = await db.insert(quizzes).values({
  title: 'ENAMED 2024 - Cardiologia',
  type: 'enamed',
  difficulty: 'hard',
  questions: JSON.stringify([...]),
  created_by: userId
}).returning(); // Retorna o objeto inserido

// ──────────────────────────────────────────────────────
// UPDATE
// ──────────────────────────────────────────────────────
await db.update(users)
  .set({ total_xp: users.total_xp + 100 })
  .where(eq(users.id, userId));

// ──────────────────────────────────────────────────────
// DELETE
// ──────────────────────────────────────────────────────
await db.delete(materials)
  .where(eq(materials.id, materialId));
```

---

### Pattern 4: React Component (MedFocus)

```tsx
// client/src/components/medfocus/ExampleFeature.tsx

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface ExampleFeatureProps {
  userId: number;
}

export function ExampleFeature({ userId }: ExampleFeatureProps) {
  // ──────────────────────────────────────────────────────
  // STATE
  // ──────────────────────────────────────────────────────
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // ──────────────────────────────────────────────────────
  // DATA FETCHING (tRPC)
  // ──────────────────────────────────────────────────────
  const { data, isLoading } = trpc.example.list.useQuery({
    limit: 10
  });

  const updateMutation = trpc.example.update.useMutation({
    onSuccess: () => {
      toast.success('Atualizado com sucesso!');
    }
  });

  // ──────────────────────────────────────────────────────
  // HANDLERS
  // ──────────────────────────────────────────────────────
  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  const handleUpdate = () => {
    if (!selectedId) return;
    
    updateMutation.mutate({
      id: selectedId,
      data: { /* ... */ }
    });
  };

  // ──────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────
  if (isLoading) {
    return <ExampleFeatureSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Feature</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.map(item => (
            <div
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={cn(
                "p-4 rounded-lg cursor-pointer transition",
                selectedId === item.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        <Button
          onClick={handleUpdate}
          disabled={!selectedId || updateMutation.isLoading}
          className="mt-4"
        >
          {updateMutation.isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </CardContent>
    </Card>
  );
}

// Skeleton para loading
function ExampleFeatureSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full mb-4" />
        ))}
      </CardContent>
    </Card>
  );
}
```

---

## ⚠️ PONTOS DE ATENÇÃO

### 1. Segurança

#### ✅ Boas Práticas Implementadas
```typescript
// ✅ Validação de input com Zod
.input(z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50)
}))

// ✅ Hash de senhas (bcrypt)
const hashedPassword = await bcrypt.hash(password, 10);

// ✅ JWT com expiração
jwt.sign(payload, secret, { expiresIn: '15m' });

// ✅ Sanitização de HTML (evita XSS)
import DOMPurify from 'dompurify';
const cleanHTML = DOMPurify.sanitize(userInput);

// ✅ Rate limiting (Express)
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100 // 100 requests por IP
});
app.use('/api', limiter);
```

#### ⚠️ Pontos a Revisar
- [ ] **SQL Injection:** Drizzle ORM previne, mas verificar raw queries
- [ ] **CSRF:** Implementar tokens CSRF para forms
- [ ] **CORS:** Verificar se origin está restrito ao frontend
- [ ] **Secrets:** NUNCA commitar `.env` com secrets reais

---

### 2. Performance

#### ✅ Otimizações Implementadas
```typescript
// ✅ Lazy loading de componentes React
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// ✅ Memoização
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// ✅ Code splitting (Vite automático)
// Cada rota é um chunk separado

// ✅ Cache agressivo (TanStack Query)
staleTime: 5 * 60 * 1000 // 5 minutos
```

#### ⚠️ Pontos a Revisar
- [ ] **N+1 Queries:** Usar JOINs em vez de queries em loop
- [ ] **Large Payloads:** Paginar listas grandes (limit/offset)
- [ ] **Images:** Comprimir e usar WebP
- [ ] **Bundle Size:** Analisar com `npm run build -- --analyze`

---

### 3. Tipos TypeScript

#### ✅ Type Safety
```typescript
// ✅ tRPC garante type-safety end-to-end
type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

// ✅ Zod schemas são convertidos para tipos TS
const userSchema = z.object({
  name: z.string(),
  age: z.number()
});
type User = z.infer<typeof userSchema>;

// ✅ Drizzle ORM gera tipos automaticamente
const user = await db.select().from(users); // user é tipado!
```

#### ⚠️ Pontos a Revisar
- [ ] **any types:** Evitar `any`, usar `unknown` se necessário
- [ ] **Type assertions:** Minimizar uso de `as Type`
- [ ] **Strict mode:** Manter `strict: true` no tsconfig.json

---

## ✅ CHECKLIST DE REVISÃO

### Backend

- [ ] **Autenticação:**
  - [ ] JWT implementado corretamente?
  - [ ] Refresh tokens funcionando?
  - [ ] Passwords hasheados com bcrypt?

- [ ] **Validação:**
  - [ ] Todos os inputs validados com Zod?
  - [ ] Mensagens de erro claras?

- [ ] **Database:**
  - [ ] Migrations aplicadas?
  - [ ] Índices criados nas colunas filtradas?
  - [ ] Foreign keys definidas?

- [ ] **APIs:**
  - [ ] Todas as rotas documentadas?
  - [ ] Rate limiting configurado?
  - [ ] Logging de erros ativo?

- [ ] **Testes:**
  - [ ] Testes unitários para routers críticos?
  - [ ] Mocks de DB e serviços externos?

---

### Frontend

- [ ] **Performance:**
  - [ ] Lazy loading implementado?
  - [ ] Images otimizadas?
  - [ ] Code splitting ativo?

- [ ] **UX:**
  - [ ] Loading states (skeletons)?
  - [ ] Error states com mensagens claras?
  - [ ] Empty states ("Nenhum item encontrado")?

- [ ] **Acessibilidade:**
  - [ ] Semantic HTML?
  - [ ] ARIA labels nos botões?
  - [ ] Keyboard navigation?

- [ ] **Type Safety:**
  - [ ] Sem `any` types?
  - [ ] Props tipadas corretamente?

---

### GCP

- [ ] **Cloud Functions:**
  - [ ] Timeouts configurados?
  - [ ] Memory adequada (256-512 MB)?
  - [ ] Error handling robusto?

- [ ] **BigQuery:**
  - [ ] Tabelas particionadas?
  - [ ] Queries otimizadas (usar clustering)?
  - [ ] Custo monitorado?

- [ ] **Vertex AI:**
  - [ ] Rate limits respeitados?
  - [ ] Embeddings cached quando possível?

---

### Deploy

- [ ] **Docker:**
  - [ ] Multi-stage build?
  - [ ] .dockerignore configurado?
  - [ ] Imagem < 300 MB?

- [ ] **Cloud Run:**
  - [ ] Health check endpoint (/health)?
  - [ ] Auto-scaling configurado (min=1, max=10)?
  - [ ] Secrets via Secret Manager (não em env vars)?

- [ ] **CI/CD:**
  - [ ] Pipeline com testes automatizados?
  - [ ] Deploy apenas na branch `main`?
  - [ ] Rollback automático se health check falhar?

---

## 📚 RECURSOS ÚTEIS

### Documentação Oficial

- **tRPC:** https://trpc.io/docs
- **Drizzle ORM:** https://orm.drizzle.team/docs
- **TanStack Query:** https://tanstack.com/query/latest/docs
- **Radix UI:** https://www.radix-ui.com/primitives/docs
- **Vite:** https://vitejs.dev/guide
- **Vertex AI:** https://cloud.google.com/vertex-ai/docs

### Comandos Úteis

```bash
# Backend
npm run dev          # Inicia servidor dev (porta 3000)
npm run build        # Build produção
npm run test         # Roda testes
npm run check        # Type check sem compilar
npm run db:push      # Aplica migrations

# Frontend
npm run dev:client   # Inicia Vite dev (porta 5173)
npm run build        # Build para produção

# Ambos
npm run dev:full     # Backend + Frontend simultâneo

# Database
npm run db:studio    # Abre Drizzle Studio (GUI)
npm run db:generate  # Gera novas migrations

# GCP
bash scripts/deploy-gcp.sh    # Deploy completo
gcloud run logs read --limit=50   # Ver logs
```

---

## 🎓 DICAS PARA NOVOS DESENVOLVEDORES

### 1. Entenda o Fluxo de Dados

```
USER → Frontend (React)
        ↓ tRPC Client
      Backend (Express + tRPC)
        ↓ Drizzle ORM
      Database (SQLite/PostgreSQL)
```

### 2. Use Type-Safety a Seu Favor

```typescript
// ❌ Ruim (sem type safety)
fetch('/api/users')
  .then(res => res.json())
  .then(data => {
    console.log(data.users); // Pode não existir!
  });

// ✅ Bom (com tRPC)
const { data } = trpc.users.list.useQuery();
console.log(data.users); // Type checked!
```

### 3. Aproveite o Cache

```typescript
// Cache agressivo para dados que mudam pouco
const { data: universities } = trpc.universities.list.useQuery(undefined, {
  staleTime: Infinity, // Nunca expira
  cacheTime: Infinity
});

// Re-fetch frequente para dados voláteis
const { data: notifications } = trpc.notifications.list.useQuery(undefined, {
  staleTime: 0, // Sempre re-fetch
  refetchInterval: 30000 // A cada 30s
});
```

### 4. Leia os Erros com Atenção

```typescript
// tRPC retorna erros estruturados
try {
  await trpc.materials.create.mutate(data);
} catch (error) {
  if (error.data?.code === 'UNAUTHORIZED') {
    // Redirecionar para login
  } else if (error.data?.code === 'BAD_REQUEST') {
    // Mostrar erros de validação
    console.log(error.data.zodError);
  }
}
```

---

## 🎯 PRÓXIMOS PASSOS

Após entender o código, considere:

1. **Contribuir com features:**
   - Interface Student-PhD (3 camadas)
   - Dashboard para laboratórios
   - Testes E2E

2. **Melhorar performance:**
   - Implementar Service Worker (PWA)
   - Otimizar queries BigQuery
   - Adicionar Redis para cache

3. **Documentar:**
   - Escrever JSDoc para funções complexas
   - Criar Storybook para componentes UI
   - Gravar vídeos tutoriais

---

**Documento gerado automaticamente**  
**Data:** 23-Feb-2026  
**Versão:** 1.0

---

*Este guia é vivo e deve ser atualizado conforme o código evolui.*
