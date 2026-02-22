# 🗄️ MedFocus PhD - Modelo de Dados e Implementação

> **Firestore Schema, Sistema de Reputação, Gamificação e Roadmap**
> 
> Complemento à Especificação Técnica V2.0
> 
> Data: Fevereiro 2026

---

## 📊 Sistema de Reputação - Medical Trust Score (MTS)

### Algoritmo Completo

```typescript
interface MedicalTrustScore {
  user_id: string;
  current_score: number;
  tier: UserTier;
  authority_level: number;  // 1-10
  
  // Componentes do Score
  components: {
    // 1. Base por Credenciais (30% do total)
    credentials: {
      crm_verified: boolean;        // +100 pontos
      rqe_verified: boolean;        // +50 pontos (Registro de Qualificação de Especialista)
      phd_degree: boolean;          // +200 pontos
      university_affiliation: boolean; // +50 pontos
      lattes_cv_linked: boolean;    // +30 pontos
      h_index: number;              // +10 pontos por unidade
    };
    
    // 2. Contribuições (40% do total)
    contributions: {
      edits_approved: number;       // +10 pontos cada
      edits_rejected: number;       // -5 pontos cada
      papers_submitted: number;     // +15 pontos cada
      guidelines_curated: number;   // +25 pontos cada
      discussions_created: number;  // +2 pontos cada
      quality_responses: number;    // +5 pontos cada
    };
    
    // 3. Engajamento Comunitário (20% do total)
    community: {
      upvotes_received: number;     // +1 ponto cada
      downvotes_received: number;   // -2 pontos cada
      helpful_votes: number;        // +3 pontos cada
      responses_accepted: number;   // +8 pontos cada
      mentees_helped: number;       // +10 pontos cada
    };
    
    // 4. Qualidade Temporal (10% do total)
    temporal: {
      days_since_last_contribution: number; // Penalidade por inatividade
      consistency_score: number;    // 0-1, baseado em frequência regular
      recent_quality_trend: number; // -1 (piorando) a +1 (melhorando)
    };
  };
  
  // Badges e Conquistas
  badges: Array<{
    id: string;
    name: string;
    category: 'contribution' | 'expertise' | 'community' | 'special';
    icon: string;
    earned_at: Timestamp;
    public_display: boolean;
  }>;
  
  // Histórico
  history: Array<{
    date: Date;
    score: number;
    change: number;
    reason: string;
  }>;
  
  // Reputação por Especialidade
  specialty_scores: Record<string, {
    score: number;
    contributions: number;
    recognized_by_peers: number;
  }>;
  
  // Metadata
  last_calculated: Timestamp;
  next_recalculation: Timestamp;
}

// Função de Cálculo do MTS
function calculateMTS(user: User, data: UserContributionData): number {
  let score = 0;
  
  // 1. CREDENCIAIS (30%)
  const credScore = 
    (data.credentials.crm_verified ? 100 : 0) +
    (data.credentials.rqe_verified ? 50 : 0) +
    (data.credentials.phd_degree ? 200 : 0) +
    (data.credentials.university_affiliation ? 50 : 0) +
    (data.credentials.lattes_cv_linked ? 30 : 0) +
    (data.credentials.h_index * 10);
  
  score += credScore * 0.30;
  
  // 2. CONTRIBUIÇÕES (40%)
  const contribScore = 
    (data.contributions.edits_approved * 10) +
    (data.contributions.edits_rejected * -5) +
    (data.contributions.papers_submitted * 15) +
    (data.contributions.guidelines_curated * 25) +
    (data.contributions.discussions_created * 2) +
    (data.contributions.quality_responses * 5);
  
  score += contribScore * 0.40;
  
  // 3. ENGAJAMENTO COMUNITÁRIO (20%)
  const communityScore = 
    (data.community.upvotes_received * 1) +
    (data.community.downvotes_received * -2) +
    (data.community.helpful_votes * 3) +
    (data.community.responses_accepted * 8) +
    (data.community.mentees_helped * 10);
  
  score += communityScore * 0.20;
  
  // 4. QUALIDADE TEMPORAL (10%)
  let temporalScore = 100; // Base
  
  // Penalidade por inatividade
  if (data.temporal.days_since_last_contribution > 30) {
    temporalScore *= 0.9; // -10%
  }
  if (data.temporal.days_since_last_contribution > 90) {
    temporalScore *= 0.8; // -20% adicional
  }
  
  // Bonus por consistência
  temporalScore *= (1 + data.temporal.consistency_score * 0.2);
  
  // Ajuste por tendência de qualidade
  temporalScore *= (1 + data.temporal.recent_quality_trend * 0.1);
  
  score += temporalScore * 0.10;
  
  // Normalização (score máximo teórico ~1000)
  return Math.max(0, Math.round(score));
}

// Authority Level (usado para peso de voto)
function calculateAuthorityLevel(mts: number, tier: UserTier): number {
  let level = 1;
  
  // Base por MTS
  if (mts >= 900) level = 10;
  else if (mts >= 800) level = 9;
  else if (mts >= 700) level = 8;
  else if (mts >= 600) level = 7;
  else if (mts >= 500) level = 6;
  else if (mts >= 400) level = 5;
  else if (mts >= 300) level = 4;
  else if (mts >= 200) level = 3;
  else if (mts >= 100) level = 2;
  
  // Ajuste por tier
  const tierMultiplier = {
    student: 0.5,
    resident: 0.7,
    specialist: 1.0,
    phd: 1.3,
    curator: 1.5
  };
  
  level *= tierMultiplier[tier];
  
  return Math.min(10, Math.max(1, Math.round(level)));
}
```

---

### Sistema de Badges

```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'contribution' | 'expertise' | 'community' | 'special' | 'gamification';
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: {
    type: string;
    threshold: number;
    specialty?: string;
  }[];
}

const BADGES: Badge[] = [
  // CONTRIBUIÇÃO
  {
    id: 'first-edit',
    name: 'Primeira Contribuição',
    description: 'Sugeriu sua primeira edição na plataforma',
    category: 'contribution',
    icon: '✏️',
    rarity: 'common',
    requirements: [{ type: 'edits_suggested', threshold: 1 }]
  },
  {
    id: 'curator-bronze',
    name: 'Curador Bronze',
    description: '10 edições aprovadas pela comunidade',
    category: 'contribution',
    icon: '🥉',
    rarity: 'common',
    requirements: [{ type: 'edits_approved', threshold: 10 }]
  },
  {
    id: 'curator-silver',
    name: 'Curador Prata',
    description: '50 edições aprovadas',
    category: 'contribution',
    icon: '🥈',
    rarity: 'rare',
    requirements: [{ type: 'edits_approved', threshold: 50 }]
  },
  {
    id: 'curator-gold',
    name: 'Curador Ouro',
    description: '200 edições aprovadas',
    category: 'contribution',
    icon: '🥇',
    rarity: 'epic',
    requirements: [{ type: 'edits_approved', threshold: 200 }]
  },
  
  // EXPERTISE
  {
    id: 'cardio-expert',
    name: 'Expert em Cardiologia',
    description: '50 contribuições aprovadas em Cardiologia',
    category: 'expertise',
    icon: '❤️',
    rarity: 'rare',
    requirements: [
      { type: 'specialty_contributions', threshold: 50, specialty: 'Cardiologia' }
    ]
  },
  {
    id: 'phd-verified',
    name: 'PhD Verificado',
    description: 'Doutorado verificado pela plataforma',
    category: 'expertise',
    icon: '🎓',
    rarity: 'epic',
    requirements: [{ type: 'phd_degree', threshold: 1 }]
  },
  
  // COMUNIDADE
  {
    id: 'helpful-100',
    name: 'Super Útil',
    description: '100 votos "útil" recebidos',
    category: 'community',
    icon: '👍',
    rarity: 'rare',
    requirements: [{ type: 'helpful_votes', threshold: 100 }]
  },
  {
    id: 'mentor',
    name: 'Mentor',
    description: 'Ajudou 10 estudantes com dúvidas',
    category: 'community',
    icon: '🧑‍🏫',
    rarity: 'rare',
    requirements: [{ type: 'mentees_helped', threshold: 10 }]
  },
  
  // ESPECIAIS
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'Um dos primeiros 1000 usuários',
    category: 'special',
    icon: '🚀',
    rarity: 'legendary',
    requirements: [{ type: 'user_rank', threshold: 1000 }]
  },
  {
    id: 'trial-finder',
    name: 'Caçador de Evidências',
    description: 'Submeteu 25 trials do PubMed',
    category: 'special',
    icon: '🔬',
    rarity: 'epic',
    requirements: [{ type: 'papers_submitted', threshold: 25 }]
  },
  
  // GAMIFICAÇÃO
  {
    id: 'streak-7',
    name: 'Dedicado',
    description: '7 dias de streak',
    category: 'gamification',
    icon: '🔥',
    rarity: 'common',
    requirements: [{ type: 'streak_days', threshold: 7 }]
  },
  {
    id: 'streak-30',
    name: 'Comprometido',
    description: '30 dias de streak',
    category: 'gamification',
    icon: '🔥🔥',
    rarity: 'rare',
    requirements: [{ type: 'streak_days', threshold: 30 }]
  },
  {
    id: 'streak-100',
    name: 'Inabalável',
    description: '100 dias de streak',
    category: 'gamification',
    icon: '🔥🔥🔥',
    rarity: 'legendary',
    requirements: [{ type: 'streak_days', threshold: 100 }]
  },
  {
    id: 'level-10',
    name: 'Nível 10',
    description: 'Alcançou o nível 10',
    category: 'gamification',
    icon: '⭐',
    rarity: 'rare',
    requirements: [{ type: 'level', threshold: 10 }]
  },
  {
    id: 'quiz-master',
    name: 'Mestre dos Quizzes',
    description: '90% de acerto em 100 quizzes',
    category: 'gamification',
    icon: '🎯',
    rarity: 'epic',
    requirements: [
      { type: 'quizzes_attempted', threshold: 100 },
      { type: 'quiz_accuracy', threshold: 0.9 }
    ]
  }
];
```

---

## 🎮 Sistema de Gamificação

### XP e Níveis

```typescript
interface GamificationSystem {
  // XP por ação
  xp_rewards: {
    // Estudo
    disease_viewed: 5;
    disease_bookmarked: 3;
    calculator_used: 2;
    drug_searched: 2;
    
    // Quizzes
    quiz_attempted: 10;
    quiz_perfect: 50;       // 100% de acerto
    quiz_streak_5: 25;      // 5 quizzes consecutivos corretos
    
    // Flashcards
    flashcard_created: 5;
    flashcard_reviewed: 2;
    flashcard_mastered: 10; // SM-2 ease > 2.5
    
    // Modo Round
    round_prepared: 15;
    round_feedback_positive: 30;
    
    // Residência
    residency_question_correct: 20;
    residency_question_wrong: 5; // XP por tentar
    
    // Colaboração
    edit_suggested: 10;
    edit_approved: 50;
    discussion_created: 15;
    quality_response: 25;
    upvote_received: 3;
    
    // Social
    referral_signup: 100;
    referral_conversion: 500;
    
    // Daily/Weekly
    daily_login: 5;
    daily_goal_completed: 30;
    weekly_goal_completed: 100;
  };
  
  // Tabela de Níveis
  levels: Array<{
    level: number;
    xp_required: number;
    title: string;
    rewards: string[];
  }>;
}

// Sistema de Níveis (Exponencial)
const LEVEL_SYSTEM = [
  { level: 1, xp: 0, title: 'Calouro', rewards: [] },
  { level: 2, xp: 100, title: 'Estudante', rewards: ['Badge Iniciante'] },
  { level: 3, xp: 250, title: 'Dedicado', rewards: [] },
  { level: 4, xp: 500, title: 'Aprendiz', rewards: [] },
  { level: 5, xp: 1000, title: 'Praticante', rewards: ['10% desconto Premium'] },
  { level: 6, xp: 1750, title: 'Experiente', rewards: [] },
  { level: 7, xp: 2750, title: 'Avançado', rewards: [] },
  { level: 8, xp: 4000, title: 'Especialista', rewards: [] },
  { level: 9, xp: 5500, title: 'Mestre', rewards: [] },
  { level: 10, xp: 7500, title: 'PhD', rewards: ['1 mês Premium grátis', 'Badge Especial'] },
  { level: 11, xp: 10000, title: 'Professor', rewards: [] },
  { level: 12, xp: 13000, title: 'Curador', rewards: [] },
  { level: 13, xp: 16500, title: 'Autoridade', rewards: [] },
  { level: 14, xp: 20500, title: 'Luminar', rewards: [] },
  { level: 15, xp: 25000, title: 'Lenda', rewards: ['Acesso vitalício Premium'] }
];

// Cálculo de XP para próximo nível
function getXPForNextLevel(currentLevel: number): number {
  const next = LEVEL_SYSTEM.find(l => l.level === currentLevel + 1);
  return next ? next.xp : Infinity;
}

// Progressão percentual
function getLevelProgress(currentXP: number, currentLevel: number): number {
  const currentLevelXP = LEVEL_SYSTEM.find(l => l.level === currentLevel)!.xp;
  const nextLevelXP = getXPForNextLevel(currentLevel);
  
  if (nextLevelXP === Infinity) return 100;
  
  const xpInCurrentLevel = currentXP - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
  
  return (xpInCurrentLevel / xpNeededForNextLevel) * 100;
}
```

---

### Sistema de Streaks

```typescript
interface StreakSystem {
  user_id: string;
  
  // Streak atual
  current_streak: number;
  longest_streak: number;
  last_activity_date: Date;
  
  // Histórico
  streak_history: Array<{
    start_date: Date;
    end_date: Date;
    length: number;
    reason_ended?: string;
  }>;
  
  // Proteção de Streak
  freeze_tokens: number;    // Tokens para "congelar" streak por 1 dia
  frozen_days: number;      // Dias atualmente congelados
  
  // Notificações
  reminder_time: string;    // "20:00" - hora do lembrete
  reminder_enabled: boolean;
}

// Lógica de Streak
async function updateStreak(userId: string): Promise<StreakUpdate> {
  const streak = await getStreak(userId);
  const now = new Date();
  const lastActivity = new Date(streak.last_activity_date);
  
  // Diferença em dias
  const daysDiff = differenceInDays(now, lastActivity);
  
  if (daysDiff === 0) {
    // Mesmo dia, não atualiza streak
    return { updated: false, current_streak: streak.current_streak };
  }
  
  if (daysDiff === 1) {
    // Dia consecutivo, incrementa streak
    streak.current_streak++;
    streak.longest_streak = Math.max(streak.longest_streak, streak.current_streak);
    
    // XP bonus por milestone
    let xpBonus = 0;
    if (streak.current_streak % 7 === 0) xpBonus = 50;
    if (streak.current_streak % 30 === 0) xpBonus = 200;
    if (streak.current_streak % 100 === 0) xpBonus = 1000;
    
    return { 
      updated: true, 
      current_streak: streak.current_streak,
      xp_bonus: xpBonus
    };
  }
  
  if (daysDiff > 1) {
    // Verificar se tem freeze tokens
    if (streak.frozen_days > 0) {
      // Streak protegido
      streak.frozen_days--;
      return { updated: false, current_streak: streak.current_streak, freeze_used: true };
    }
    
    // Perdeu o streak
    streak.streak_history.push({
      start_date: lastActivity,
      end_date: lastActivity,
      length: streak.current_streak,
      reason_ended: 'Inatividade'
    });
    
    streak.current_streak = 1; // Recomeça
    
    return { 
      updated: true, 
      current_streak: 1, 
      streak_lost: true,
      previous_streak: streak.streak_history[streak.streak_history.length - 1].length
    };
  }
}

// Sistema de Freeze Tokens
function earnFreezeToken(reason: string): boolean {
  // Ganhar tokens por:
  // - Completar 10 dias de streak: +1 token
  // - Atingir nível 5, 10, 15: +2 tokens
  // - Compra (Premium): +5 tokens/mês
  // - Conquistas especiais: +1 token
  
  return true;
}
```

---

### Metas Semanais

```typescript
interface WeeklyGoals {
  user_id: string;
  week_start: Date;
  week_end: Date;
  
  goals: {
    // Metas de estudo
    diseases_to_study: {
      target: number;
      current: number;
      percentage: number;
    };
    
    // Metas de quizzes
    quizzes_to_complete: {
      target: number;
      current: number;
      min_accuracy: number;  // Ex: 70%
    };
    
    // Metas de flashcards
    flashcards_to_review: {
      target: number;
      current: number;
    };
    
    // Metas de residência (opcional)
    residency_questions: {
      target: number;
      current: number;
    };
    
    // Meta de modo round (internos)
    rounds_to_prepare: {
      target: number;
      current: number;
    };
  };
  
  // Recompensas
  completion_reward: {
    xp: number;
    freeze_tokens: number;
    premium_trial_days?: number;
  };
  
  // Status
  completed: boolean;
  completion_date?: Date;
}

// Sugestão Inteligente de Metas (ML)
async function suggestWeeklyGoals(userId: string): Promise<WeeklyGoals> {
  const history = await getUserHistory(userId);
  const avgPerformance = calculateAveragePerformance(history);
  
  // Ajustar metas baseado em desempenho passado
  // Se usuário completou 80% das metas na última semana, aumentar 10%
  // Se completou <50%, diminuir 20%
  
  const adjustment = 
    avgPerformance > 0.8 ? 1.1 :
    avgPerformance < 0.5 ? 0.8 :
    1.0;
  
  return {
    user_id: userId,
    week_start: startOfWeek(new Date()),
    week_end: endOfWeek(new Date()),
    goals: {
      diseases_to_study: {
        target: Math.round(10 * adjustment),
        current: 0,
        percentage: 0
      },
      quizzes_to_complete: {
        target: Math.round(20 * adjustment),
        current: 0,
        min_accuracy: 0.7
      },
      flashcards_to_review: {
        target: Math.round(50 * adjustment),
        current: 0
      },
      residency_questions: {
        target: Math.round(15 * adjustment),
        current: 0
      },
      rounds_to_prepare: {
        target: 3,
        current: 0
      }
    },
    completion_reward: {
      xp: 100,
      freeze_tokens: 1
    },
    completed: false
  };
}
```

---

## 🔌 Integrações de APIs Externas

### 1. ANVISA (Bulário Eletrônico)

**Endpoint Base:** `https://consultas.anvisa.gov.br/api/consulta/bulario/`

**Cloud Function - Ingestão:**
```typescript
// functions/anvisa-ingestion/index.ts
import { Firestore } from '@google-cloud/firestore';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface AnvisaMedication {
  numero_registro: string;
  nome_produto: string;
  principio_ativo: string;
  classe_terapeutica: string;
  empresa: string;
  pdf_url: string;
}

export async function ingestAnvisaBulario() {
  const firestore = new Firestore();
  
  // 1. Buscar medicamentos atualizados
  const response = await axios.get(
    'https://dados.gov.br/api/3/action/datastore_search',
    {
      params: {
        resource_id: 'c5f8ffd9-3a0a-48ed-84bd-c5f8be92c08b',
        limit: 10000
      }
    }
  );
  
  const medications: AnvisaMedication[] = response.data.result.records;
  
  // 2. Para cada medicamento, extrair informações do PDF
  for (const med of medications) {
    try {
      // Download do PDF do bulário
      const pdfBuffer = await downloadPDF(med.pdf_url);
      
      // Parsear PDF com Vertex AI Document AI
      const parsedData = await parseWithVertexAI(pdfBuffer);
      
      // Estruturar dados
      const medicationData = {
        id: med.numero_registro,
        generic_name: med.principio_ativo,
        brand_names: [med.nome_produto],
        anvisa_registration: med.numero_registro,
        therapeutic_class: med.classe_terapeutica,
        manufacturer: med.empresa,
        
        // Extraído do bulário
        indications: parsedData.indications,
        contraindications: parsedData.contraindications,
        dosing: parsedData.dosing,
        adverse_effects: parsedData.adverse_effects,
        interactions: parsedData.interactions,
        
        last_updated: new Date(),
        source: 'ANVISA'
      };
      
      // Salvar no Firestore
      await firestore
        .collection('medications')
        .doc(med.numero_registro)
        .set(medicationData, { merge: true });
      
      console.log(`Processed: ${med.nome_produto}`);
      
    } catch (error) {
      console.error(`Error processing ${med.nome_produto}:`, error);
    }
  }
  
  return { processed: medications.length };
}

// Parsear PDF com Vertex AI Document AI
async function parseWithVertexAI(pdfBuffer: Buffer) {
  const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
  const client = new DocumentProcessorServiceClient();
  
  const request = {
    name: 'projects/PROJECT_ID/locations/us/processors/PROCESSOR_ID',
    rawDocument: {
      content: pdfBuffer.toString('base64'),
      mimeType: 'application/pdf'
    }
  };
  
  const [result] = await client.processDocument(request);
  const { document } = result;
  
  // Extrair seções estruturadas
  return {
    indications: extractSection(document, 'INDICAÇÕES'),
    contraindications: extractSection(document, 'CONTRAINDICAÇÕES'),
    dosing: extractSection(document, 'POSOLOGIA'),
    adverse_effects: extractSection(document, 'REAÇÕES ADVERSAS'),
    interactions: extractSection(document, 'INTERAÇÕES MEDICAMENTOSAS')
  };
}
```

---

### 2. OpenFDA (Drug Labels)

**Endpoint Base:** `https://api.fda.gov/drug/label.json`

**Cloud Function - Monitoramento de Alertas:**
```typescript
// functions/fda-alerts/index.ts
import { BigQuery } from '@google-cloud/bigquery';
import axios from 'axios';

interface FDALabel {
  openfda: {
    brand_name: string[];
    generic_name: string[];
    substance_name: string[];
  };
  boxed_warning?: string[];
  warnings?: string[];
  adverse_reactions?: string[];
  drug_interactions?: string[];
}

export async function monitorFDAAlerts() {
  const bigquery = new BigQuery();
  
  // Buscar labels atualizadas nas últimas 24h
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0].replace(/-/g, '');
  
  const response = await axios.get('https://api.fda.gov/drug/label.json', {
    params: {
      search: `effective_time:[${yesterday} TO ${new Date().toISOString().split('T')[0].replace(/-/g, '')}]`,
      limit: 100
    }
  });
  
  const labels: FDALabel[] = response.data.results;
  
  // Filtrar apenas labels com Black Box Warnings
  const criticalAlerts = labels.filter(l => l.boxed_warning && l.boxed_warning.length > 0);
  
  for (const label of criticalAlerts) {
    // Cross-reference com medicamentos no Brasil
    const brazilianMeds = await findBrazilianEquivalent(label.openfda.generic_name[0]);
    
    if (brazilianMeds.length > 0) {
      // Criar alerta no sistema
      await createAlert({
        type: 'black_box_warning',
        medication: label.openfda.generic_name[0],
        brazilian_equivalents: brazilianMeds,
        warning_text: label.boxed_warning[0],
        source: 'FDA',
        severity: 'critical',
        created_at: new Date()
      });
      
      // Notificar usuários que usaram este medicamento recentemente
      await notifyAffectedUsers(brazilianMeds);
    }
  }
  
  return { alerts_processed: criticalAlerts.length };
}
```

---

### 3. PubMed (NCBI E-utilities)

**Endpoint Base:** `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/`

**Cloud Function - Ingestão de Trials:**
```typescript
// functions/pubmed-trials/index.ts
import axios from 'axios';
import { Firestore } from '@google-cloud/firestore';
import { VertexAI } from '@google-cloud/vertexai';

interface PubMedArticle {
  pmid: string;
  title: string;
  abstract: string;
  authors: string[];
  journal: string;
  publication_date: string;
  doi: string;
  mesh_terms: string[];
}

export async function ingestRecentTrials() {
  const firestore = new Firestore();
  const vertexai = new VertexAI({ project: 'PROJECT_ID' });
  
  // Buscar trials dos últimos 7 dias
  const query = `
    (randomized controlled trial[pt] OR clinical trial[pt])
    AND (
      "heart failure"[mesh] OR
      "myocardial infarction"[mesh] OR
      "diabetes mellitus"[mesh] OR
      "hypertension"[mesh]
    )
    AND ("last 7 days"[pdat])
  `;
  
  // 1. Buscar IDs
  const searchResponse = await axios.get(
    'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi',
    {
      params: {
        db: 'pubmed',
        term: query,
        retmax: 100,
        retmode: 'json'
      }
    }
  );
  
  const pmids = searchResponse.data.esearchresult.idlist;
  
  // 2. Fetch detalhes
  const fetchResponse = await axios.get(
    'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi',
    {
      params: {
        db: 'pubmed',
        id: pmids.join(','),
        retmode: 'xml'
      }
    }
  );
  
  const articles = parsePubMedXML(fetchResponse.data);
  
  // 3. Para cada artigo, gerar embedding e linkar com doenças
  for (const article of articles) {
    // Gerar embedding do abstract
    const embedding = await generateEmbedding(article.abstract);
    
    // Encontrar doenças relacionadas via vector search
    const relatedDiseases = await findRelatedDiseases(embedding);
    
    // Salvar artigo
    await firestore.collection('pubmed_articles').doc(article.pmid).set({
      ...article,
      embedding: embedding,
      related_diseases: relatedDiseases.map(d => d.id),
      ingested_at: new Date()
    });
    
    // Atualizar doenças com referência ao artigo
    for (const disease of relatedDiseases) {
      await firestore
        .collection('diseases')
        .doc(disease.id)
        .update({
          'layers.phd_frontier.recent_trials': FieldValue.arrayUnion({
            name: article.title,
            pmid: article.pmid,
            year: parseInt(article.publication_date.split('-')[0]),
            journal: article.journal,
            link: `https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`
          })
        });
    }
  }
  
  return { trials_processed: articles.length };
}

// Gerar embedding com Vertex AI
async function generateEmbedding(text: string): Promise<number[]> {
  const vertexai = new VertexAI({ project: 'PROJECT_ID' });
  const model = vertexai.preview.getGenerativeModel({ model: 'text-embedding-005' });
  
  const result = await model.embedContent(text);
  return result.embedding.values;
}
```

---

### 4. Sociedades Médicas (RSS + PDF Parsing)

**Cloud Function - Diretrizes:**
```typescript
// functions/guidelines-parser/index.ts
import axios from 'axios';
import Parser from 'rss-parser';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';

const MEDICAL_SOCIETIES_RSS = [
  {
    name: 'SBC',
    url: 'https://www.portal.cardiol.br/rss/diretrizes',
    specialty: 'Cardiologia'
  },
  {
    name: 'SBPT',
    url: 'https://sbpt.org.br/rss/diretrizes',
    specialty: 'Pneumologia'
  },
  {
    name: 'AHA',
    url: 'https://professional.heart.org/en/guidelines-and-statements/rss',
    specialty: 'Cardiologia'
  },
  {
    name: 'ESC',
    url: 'https://www.escardio.org/Guidelines/RSS',
    specialty: 'Cardiologia'
  }
];

export async function ingestGuidelines() {
  const parser = new Parser();
  
  for (const society of MEDICAL_SOCIETIES_RSS) {
    const feed = await parser.parseURL(society.url);
    
    for (const item of feed.items) {
      // Verificar se é diretriz nova
      if (!item.title.toLowerCase().includes('diretriz')) continue;
      
      // Download do PDF
      const pdfUrl = extractPDFLink(item.content);
      if (!pdfUrl) continue;
      
      const pdfBuffer = await downloadPDF(pdfUrl);
      
      // Parsear PDF com Document AI
      const structured = await parseGuidelinePDF(pdfBuffer);
      
      // Salvar no Firestore
      await firestore.collection('guidelines').add({
        society: society.name,
        specialty: society.specialty,
        title: item.title,
        publication_date: new Date(item.pubDate),
        pdf_url: pdfUrl,
        
        // Conteúdo estruturado
        recommendations: structured.recommendations,
        evidence_levels: structured.evidence_levels,
        
        ingested_at: new Date()
      });
      
      // Atualizar condutas relacionadas
      await updateRelatedDiseases(structured);
    }
  }
}

// Extrair recomendações estruturadas
async function parseGuidelinePDF(pdfBuffer: Buffer) {
  const client = new DocumentProcessorServiceClient();
  
  const request = {
    name: 'projects/PROJECT_ID/locations/us/processors/GUIDELINE_PROCESSOR',
    rawDocument: {
      content: pdfBuffer.toString('base64'),
      mimeType: 'application/pdf'
    }
  };
  
  const [result] = await client.processDocument(request);
  
  // Identificar classes de recomendação
  // Classe I: "É recomendado", "Deve-se"
  // Classe IIa: "É razoável", "Pode ser considerado"
  // Classe IIb: "Pode ser considerado"
  // Classe III: "Não é recomendado"
  
  return {
    recommendations: extractRecommendations(result.document),
    evidence_levels: extractEvidenceLevels(result.document)
  };
}
```

---

## 🚀 Roadmap de Implementação (2026)

### **Fase 1: Foundation (Q1 2026 - Jan-Mar)**
**Duração: 12 semanas**  
**Objetivo: MVP funcional com infraestrutura GCP**

#### Sprint 1-2 (Semanas 1-4): Infraestrutura
- [ ] Setup do projeto GCP
- [ ] Configuração de Firestore + BigQuery
- [ ] Deploy de Cloud Functions base
- [ ] CI/CD com Cloud Build
- [ ] Setup de ambientes (dev/staging/prod)
- [ ] Monitoramento (Cloud Logging/Monitoring)

#### Sprint 3-4 (Semanas 5-8): Backend Core
- [ ] Auth Service (Firebase Auth + JWT)
- [ ] Content Service (CRUD de doenças)
- [ ] Drug Database (integração ANVISA - MVP)
- [ ] API Gateway (rate limiting, CORS)
- [ ] Sistema de busca textual (Firestore)

#### Sprint 5-6 (Semanas 9-12): Frontend Base
- [ ] Flutter mobile app scaffold
- [ ] React web app scaffold
- [ ] Tela de login/registro
- [ ] Tela Cockpit (Home)
- [ ] Tela de Conduta (Camada 1 apenas)
- [ ] Busca universal

**Entregáveis Q1:**
- ✅ 100 doenças cadastradas (Camada 1 completa)
- ✅ 500 medicamentos no drug database
- ✅ Apps mobile e web funcionais
- ✅ 1000 usuários beta (estudantes testadores)

---

### **Fase 2: Intelligence Layer (Q2 2026 - Abr-Jun)**
**Duração: 12 semanas**  
**Objetivo: IA, RAG e busca semântica**

#### Sprint 7-8 (Semanas 13-16): IA Generativa
- [ ] Intelligence Service (Python/FastAPI)
- [ ] Integração Vertex AI Gemini Pro
- [ ] RAG pipeline (LangChain)
- [ ] Vertex AI Vector Search
- [ ] Geração de embeddings (batch)

#### Sprint 9-10 (Semanas 17-20): Busca Avançada
- [ ] Busca semântica (vector search)
- [ ] NLP query understanding
- [ ] Voice search (Google Speech-to-Text)
- [ ] Google Lens integration (análise de imagens)
- [ ] Suggestion engine

#### Sprint 11-12 (Semanas 21-24): Modo Round & Flashcards
- [ ] "Modo Preceptor" (geração de pitch)
- [ ] Text-to-Speech (Google Cloud TTS)
- [ ] Geração de flashcards por IA
- [ ] Integração Anki (export)
- [ ] Integração Notion/Obsidian

**Entregáveis Q2:**
- ✅ Busca semântica funcional
- ✅ RAG respondendo perguntas
- ✅ Modo Round em produção
- ✅ 10.000 usuários ativos

---

### **Fase 3: PhD Layer (Q3 2026 - Jul-Set)**
**Duração: 12 semanas**  
**Objetivo: Camada 3 (PhD/Frontier) e colaboração**

#### Sprint 13-14 (Semanas 25-28): Camada PhD
- [ ] Completar Camada 3 para 100 doenças principais
- [ ] Integração PubMed (trials recentes)
- [ ] Sistema de citações (BibTeX/ABNT/Vancouver)
- [ ] My PhD Library (dashboard de referências)
- [ ] Exportação acadêmica

#### Sprint 15-16 (Semanas 29-32): Colaboração
- [ ] Collaboration Service
- [ ] Sistema de sugestões de edição
- [ ] Voting system (upvote/downvote)
- [ ] Medical Trust Score (MTS)
- [ ] Badges e autoridade

#### Sprint 17-18 (Semanas 33-36): Diretrizes e Alertas
- [ ] Ingestão de diretrizes (SBC, SBPT, AHA, ESC)
- [ ] Monitoramento FDA (alertas críticos)
- [ ] Push notifications
- [ ] Email alerts
- [ ] Dashboard de alertas

**Entregáveis Q3:**
- ✅ Camada 3 (PhD) completa
- ✅ Sistema de colaboração ativo
- ✅ 50+ PhDs contribuindo
- ✅ 50.000 usuários

---

### **Fase 4: Gamification & Expansion (Q4 2026 - Out-Dez)**
**Duração: 12 semanas**  
**Objetivo: Gamificação completa e expansão de conteúdo**

#### Sprint 19-20 (Semanas 37-40): Gamificação
- [ ] Sistema de XP e níveis
- [ ] Badges e conquistas
- [ ] Streaks e metas semanais
- [ ] Leaderboards
- [ ] Rewards (descontos, premium trial)

#### Sprint 21-22 (Semanas 41-44): Expansão de Conteúdo
- [ ] 500 doenças (todas as 3 camadas)
- [ ] 2000 medicamentos
- [ ] 50 calculadoras médicas
- [ ] Atlas de imagens (100 imagens iniciais)
- [ ] Quizzes de residência (500 questões)

#### Sprint 23-24 (Semanas 45-48): Analytics & Otimização
- [ ] Analytics Service completo
- [ ] ML para weak areas
- [ ] Predição de performance ENAMED
- [ ] Dashboards administrativos
- [ ] Performance optimization

**Entregáveis Q4:**
- ✅ 500 doenças completas
- ✅ Gamificação full
- ✅ 100.000 usuários
- ✅ 10% de conversão para Premium

---

### **Fase 5: Advanced Features (Q1 2027 - Jan-Mar)**
**Duração: 12 semanas**  
**Objetivo: Features diferenciadas e mobile nativo**

#### Sprint 25-26 (Semanas 49-52): Mobile Nativo
- [ ] React Native refactor (se necessário)
- [ ] Offline-first architecture
- [ ] SQLite local
- [ ] Background sync
- [ ] Widgets

#### Sprint 27-28 (Semanas 53-56): Browser Extension
- [ ] Chrome extension
- [ ] Firefox extension
- [ ] Sidebar integration
- [ ] Highlight-to-search
- [ ] Auto-citation

#### Sprint 29-30 (Semanas 57-60): API Pública
- [ ] RESTful API documentada
- [ ] OAuth 2.0 para terceiros
- [ ] SDKs (Python, JavaScript)
- [ ] Developer portal
- [ ] Webhook system

**Entregáveis Q1 2027:**
- ✅ Mobile app nativo (iOS + Android)
- ✅ Browser extension
- ✅ API pública
- ✅ 250.000 usuários

---

## 📊 Métricas de Sucesso KPIs

### Métricas de Produto

#### Acquisition (Aquisição)
- **Novos usuários/mês:** 10k (Q2) → 50k (Q4)
- **Fonte de aquisição:**
  - Organic search: 40%
  - Referral (estudantes): 30%
  - Universidades: 20%
  - Ads: 10%
- **Custo de aquisição (CAC):** < R$ 10/usuário

#### Activation (Ativação)
- **% que completa onboarding:** > 70%
- **% que usa busca nas primeiras 24h:** > 60%
- **% que salva conteúdo:** > 40%

#### Retention (Retenção)
- **DAU/MAU ratio:** > 25%
- **Retention D7:** > 40%
- **Retention D30:** > 20%
- **Churn rate:** < 5%/mês

#### Revenue (Receita)
- **MRR (Monthly Recurring Revenue):**
  - Q2: R$ 50k
  - Q3: R$ 150k
  - Q4: R$ 300k
- **Conversion rate (free → premium):** > 10%
- **LTV/CAC:** > 5:1

#### Referral (Indicação)
- **% usuários que indicam:** > 30%
- **Viral coefficient:** > 1.2
- **NPS (Net Promoter Score):** > 50

### Métricas de Conteúdo

#### Qualidade
- **% materiais tier VALIDATED:** > 60%
- **Rating médio:** > 4.5/5
- **% conteúdo revisado (últimos 6 meses):** > 80%

#### Engajamento
- **Média de doenças vistas/usuário/mês:** > 15
- **Média de medicamentos buscados/usuário/mês:** > 10
- **% usuários usando modo round:** > 30% (internos)

#### Colaboração
- **Edições sugeridas/mês:** > 500
- **Taxa de aprovação:** 60-80%
- **PhDs ativos/mês:** > 100

### Métricas Técnicas

#### Performance
- **Uptime:** > 99.9%
- **API latency (p95):** < 300ms
- **Time to First Byte:** < 200ms
- **Mobile crash rate:** < 0.5%

#### IA
- **Acurácia do RAG:** > 90%
- **Relevância da busca semântica:** > 85%
- **Taxa de hallucination:** < 5%

---

## 💰 Modelo de Negócio

### Pricing Tiers

#### **Free (Camada 1)**
- Acesso completo à Camada 1 (Plantão)
- 100 doenças
- Drug database básico
- 20 calculadoras
- Anúncios não invasivos

#### **Student (R$ 29,90/mês)**
- Tudo do Free
- Camada 2 completa (Especialista)
- Todas as 500 doenças
- Drug database completo
- 50 calculadoras
- Modo Round
- Quizzes de residência
- Sem anúncios

#### **Premium PhD (R$ 79,90/mês)**
- Tudo do Student
- Camada 3 completa (PhD/Frontier)
- RAG ilimitado
- Exportação acadêmica
- API access
- Prioridade no suporte
- Freeze tokens extras (5/mês)

#### **University (custom)**
- Licença institucional
- Customização de conteúdo
- Analytics de turma
- White-label (opcional)
- SSO integration
- Suporte dedicado

### Estratégia de Monetização

1. **Freemium:** 90% usuários free, 10% pagantes
2. **Upsell:** Push notifications de features premium
3. **Trials:** 14 dias grátis de Premium
4. **Desconto anual:** 20% off (pagar 10 meses, receber 12)
5. **Bundle universitário:** 50% off para grupos de 100+
6. **Gamificação:** Ganhar premium por contribuições (top 1% mensal)

---

## 🎯 Próximos Passos Imediatos

### Semana 1-2: Setup Inicial
1. **Criar projeto GCP**
   - Habilitar APIs necessárias
   - Configurar billing e quotas
   - Setup de permissões IAM

2. **Configurar Firestore**
   - Criar database
   - Definir security rules
   - Criar collections iniciais

3. **Setup de desenvolvimento**
   - Repositórios Git (monorepo ou multi-repo)
   - CI/CD pipeline (Cloud Build)
   - Environments (dev/staging/prod)

### Semana 3-4: Primeiro Microserviço
1. **Auth Service**
   - Firebase Authentication setup
   - JWT token generation
   - CRM verification (mock inicial)

2. **Content Service (MVP)**
   - CRUD de doenças
   - 10 doenças iniciais (Camada 1)
   - API básica

3. **Frontend Scaffold**
   - Flutter app básico
   - Login screen
   - Home com busca

---

**Documento preparado por:** Equipe MedFocus PhD  
**Data:** Fevereiro 2026  
**Versão:** 2.0  
**Próxima revisão:** Abril 2026
