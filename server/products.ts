/**
 * MedFocus — Stripe Products & Plans
 * Centralized product definitions for subscription management
 * 
 * Regras de negócio:
 * - Trial de 7 dias gratuito (requer cartão de crédito cadastrado)
 * - Plano Pro mensal: R$ 29,90/mês
 * - Plano Pro anual: R$ 250,00/ano (equivale a ~R$ 20,83/mês)
 * - Após trial, cobrança automática no cartão cadastrado
 */

export const PLANS = {
  free: {
    id: 'free',
    name: 'MedFocus Free',
    description: 'Acesso básico ao MedFocus',
    price: 0,
    yearlyPrice: 0,
    currency: 'brl',
    interval: 'month' as const,
    trialDays: 0,
    features: [
      'Acesso ao Dashboard',
      'Cronograma básico',
      'Pomodoro Timer',
      'Checklist semanal',
      '3 consultas ao MedGenie AI por dia',
      'Conteúdo pré-carregado (1° e 2° ano)',
    ],
    limits: {
      aiQueriesPerDay: 3,
      contentYears: [1, 2],
      flashcardsPerDay: 10,
      quizzesPerDay: 3,
    },
  },
  pro: {
    id: 'pro',
    name: 'MedFocus Pro',
    description: 'Acesso completo para estudantes dedicados',
    price: 2990, // R$ 29,90/mês
    yearlyPrice: 25000, // R$ 250,00/ano
    currency: 'brl',
    interval: 'month' as const,
    trialDays: 7,
    features: [
      'Tudo do plano Free',
      'MedGenie AI ilimitado',
      'Conteúdo completo (1° ao 6° ano)',
      'Flashcards e Quizzes ilimitados',
      'Gerador de materiais de estudo',
      'Pesquisa Global com IA',
      'Gamificação completa (XP, Badges, Streaks)',
      'Notificações push de estudo',
      'Modo Batalha multiplayer',
      'Casos Clínicos com IA',
      'Resumos inteligentes',
      'Quiz Avançado',
      'Relatórios PDF exportáveis',
      'Simulados de Residência',
      'Atlas Anatômico interativo',
      'Apoio Diagnóstico IA',
      'Protocolos Clínicos IA',
      'FDA Drugs + ANVISA avançado',
      'Interações Medicamentosas IA',
      'Portal do Professor',
      'Sala de Aula virtual',
      'Analytics de Turma',
    ],
    limits: {
      aiQueriesPerDay: -1,
      contentYears: [1, 2, 3, 4, 5, 6],
      flashcardsPerDay: -1,
      quizzesPerDay: -1,
    },
  },
} as const;

export type PlanId = keyof typeof PLANS;
export type Plan = (typeof PLANS)[PlanId];

/**
 * Módulos que requerem plano Pro (pago)
 */
export const PRO_MODULES: string[] = [
  'smartSummary', 'clinicalCases', 'battle', 'quiz', 'atlas',
  'simulado', 'diagnosisAssistant', 'clinicalProtocols', 'fdaDrugs',
  'drugInteractions', 'classroom', 'analytics', 'professor',
  'validated-library', 'reports', 'flashcardStudy', 'lectureTranscription',
  'myContent', 'pharmaBible', 'pubmedResearch', 'studyRooms', 'socialFeed',
];

/**
 * Módulos gratuitos (disponíveis no plano Free)
 */
export const FREE_MODULES: string[] = [
  'dashboard', 'planner', 'timer', 'assistant', 'academic', 'guide',
  'research', 'weekly', 'library', 'studyContent', 'gamification',
  'notifications', 'pricing', 'resources', 'spacedRepetition', 'roadmap',
  'calendar', 'examCalendar', 'progress', 'goals', 'leaderboard',
  'heatmap', 'medicalCalculators', 'anvisaConsult', 'cid10', 'offline', 'materials',
];

/**
 * Verifica se o usuário tem acesso a um módulo
 */
export function hasAccess(userPlan: string, moduleId: string, trialActive?: boolean): boolean {
  if (userPlan === 'admin') return true;
  if (FREE_MODULES.includes(moduleId)) return true;
  if (trialActive) return true;
  if (userPlan === 'pro' || userPlan === 'premium') return true;
  return false;
}
