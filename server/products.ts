/**
 * MedFocus — Stripe Products & Plans
 * Centralized product definitions for subscription management
 */

export const PLANS = {
  free: {
    id: 'free',
    name: 'MedFocus Free',
    description: 'Acesso básico ao MedFocus',
    price: 0,
    currency: 'brl',
    interval: 'month' as const,
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
    price: 2990, // R$ 29,90
    currency: 'brl',
    interval: 'month' as const,
    features: [
      'Tudo do plano Free',
      'MedGenie AI ilimitado',
      'Conteúdo completo (1° ao 6° ano)',
      'Flashcards e Quizzes ilimitados',
      'Gerador de materiais de estudo',
      'Pesquisa Global com IA',
      'Gamificação completa (XP, Badges, Streaks)',
      'Notificações push de estudo',
    ],
    limits: {
      aiQueriesPerDay: -1, // unlimited
      contentYears: [1, 2, 3, 4, 5, 6],
      flashcardsPerDay: -1,
      quizzesPerDay: -1,
    },
  },
  premium: {
    id: 'premium',
    name: 'MedFocus Premium',
    description: 'Preparação completa para residência',
    price: 4990, // R$ 49,90
    currency: 'brl',
    interval: 'month' as const,
    features: [
      'Tudo do plano Pro',
      'Simulados de residência (ENARE, USP, AMP)',
      'Mentoria IA personalizada',
      'Relatórios de desempenho avançados',
      'Acesso prioritário a novos recursos',
      'Suporte dedicado',
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
