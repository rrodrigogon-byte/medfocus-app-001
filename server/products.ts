/**
 * MedFocus — Planos e Produtos v2.0
 * 
 * Estrutura de Planos:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ PERFIL          │ MENSAL      │ ANUAL (20% desc)  │ PARCERIA   │
 * ├─────────────────┼─────────────┼───────────────────┼────────────┤
 * │ Estudante       │ R$ 49,99    │ R$ 479,90/ano     │ 40% desc   │
 * │ Médico          │ R$ 45,99    │ R$ 441,50/ano     │ —          │
 * │ Professor       │ R$ 9,99     │ R$ 95,90/ano      │ GRÁTIS*    │
 * │ Admin           │ GRÁTIS      │ GRÁTIS            │ —          │
 * └─────────────────────────────────────────────────────────────────┘
 * 
 * * Professor é gratuito na Parceria Universitária (min. 30 alunos)
 * * Parceria: 40% desconto no plano anual, mínimo 30 assinaturas
 * * Professor envia comprovação de vínculo universitário
 * * Trial de 7 dias gratuito para todos os planos
 */

export const PLANS = {
  free: {
    id: 'free',
    name: 'MedFocus Free',
    description: 'Acesso básico ao MedFocus',
    targetAudience: 'todos',
    price: 0,
    yearlyPrice: 0,
    partnershipYearlyPrice: 0,
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
      'Calculadoras médicas básicas',
      'CID-10 e ANVISA (consulta)',
      'Gamificação básica',
    ],
    limits: {
      aiQueriesPerDay: 3,
      contentYears: [1, 2],
      flashcardsPerDay: 10,
      quizzesPerDay: 3,
    },
  },
  estudante: {
    id: 'estudante',
    name: 'MedFocus Estudante',
    description: 'Plano completo para estudantes de medicina',
    targetAudience: 'estudante',
    price: 4999, // R$ 49,99/mês
    yearlyPrice: 47990, // R$ 479,90/ano (20% desconto)
    partnershipYearlyPrice: 28794, // R$ 287,94/ano (40% desconto sobre anual)
    currency: 'brl',
    interval: 'month' as const,
    trialDays: 7,
    features: [
      'Tudo do plano Free',
      'MedGenie AI ilimitado',
      'Conteúdo completo (1° ao 6° ano)',
      'Flashcards e Quizzes ilimitados',
      'Gerador de materiais com IA',
      'Transcrição de aulas ilimitada',
      'Pesquisa Global + PubMed',
      'Interações Medicamentosas IA',
      'FDA Drugs + ANVISA avançado',
      'Protocolos Clínicos IA',
      'Modo Batalha multiplayer',
      'Casos Clínicos com IA',
      'Resumos inteligentes',
      'Quiz Avançado',
      'Simulados de Residência',
      'Atlas Anatômico 3D interativo',
      'Apoio Diagnóstico IA',
      'Relatórios PDF exportáveis',
      'Área do Aluno completa',
      'Interação com Professor',
      'Correções por IA supervisionada',
    ],
    limits: {
      aiQueriesPerDay: -1,
      contentYears: [1, 2, 3, 4, 5, 6],
      flashcardsPerDay: -1,
      quizzesPerDay: -1,
    },
  },
  medico: {
    id: 'medico',
    name: 'MedFocus Médico',
    description: 'Plano profissional para médicos em exercício',
    targetAudience: 'medico',
    price: 4599, // R$ 45,99/mês
    yearlyPrice: 44150, // R$ 441,50/ano (20% desconto)
    partnershipYearlyPrice: 0,
    currency: 'brl',
    interval: 'month' as const,
    trialDays: 7,
    features: [
      'Tudo do plano Estudante',
      'Calculadoras médicas avançadas (15+)',
      'Protocolos Clínicos completos',
      'Apoio Diagnóstico IA avançado',
      'Interações Medicamentosas completas',
      'Atlas Anatômico 3D profissional',
      'Pesquisa PubMed ilimitada',
      'Bulário completo ANVISA + FDA',
      'Guia de Doenças expandido',
      'Condutas Médicas baseadas em evidência',
      'Atualizações de guidelines em tempo real',
      'Relatórios clínicos exportáveis',
      'Suporte prioritário',
    ],
    limits: {
      aiQueriesPerDay: -1,
      contentYears: [1, 2, 3, 4, 5, 6],
      flashcardsPerDay: -1,
      quizzesPerDay: -1,
    },
  },
  professor: {
    id: 'professor',
    name: 'MedFocus Professor',
    description: 'Plano para docentes universitários (requer comprovação)',
    targetAudience: 'professor',
    price: 999, // R$ 9,99/mês
    yearlyPrice: 9590, // R$ 95,90/ano (20% desconto)
    partnershipYearlyPrice: 0, // GRÁTIS na parceria universitária
    currency: 'brl',
    interval: 'month' as const,
    trialDays: 7,
    requiresVerification: true,
    features: [
      'Tudo do plano Estudante',
      'Portal do Professor completo',
      'Upload de conteúdo e materiais',
      'Correções assistidas por IA',
      'Confirmação/rejeição de correções IA',
      'Tirar dúvidas dos alunos',
      'Sala de Aula virtual',
      'Analytics de Turma avançado',
      'Gestão de turmas e notas',
      'Compartilhamento de materiais',
      'Gerador de provas com IA',
      'Relatórios de desempenho',
      'Suporte prioritário VIP',
    ],
    limits: {
      aiQueriesPerDay: -1,
      contentYears: [1, 2, 3, 4, 5, 6],
      flashcardsPerDay: -1,
      quizzesPerDay: -1,
    },
  },
} as const;

/**
 * Configuração de Parceria Universitária
 */
export const PARTNERSHIP_CONFIG = {
  minSubscriptions: 30,
  studentDiscount: 0.40, // 40% desconto no plano anual
  professorFree: true, // Professor é gratuito na parceria
  billingInterval: 'year' as const,
  description: 'Parceria Universitária — 40% de desconto no plano anual para turmas com mínimo de 30 alunos. Professor mentor é gratuito.',
};

export type PlanId = keyof typeof PLANS;
export type Plan = (typeof PLANS)[PlanId];

/**
 * Módulos que requerem plano pago
 */
export const PRO_MODULES: string[] = [
  'smartSummary', 'clinicalCases', 'battle', 'quiz', 'atlas',
  'simulado', 'diagnosisAssistant', 'clinicalProtocols', 'fdaDrugs',
  'drugInteractions', 'classroom', 'analytics', 'professor',
  'validated-library', 'reports', 'flashcardStudy', 'lectureTranscription',
  'myContent', 'pharmaBible', 'pubmedResearch', 'studyRooms', 'socialFeed',
];

/**
 * Módulos gratuitos
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
  if (['estudante', 'medico', 'professor', 'pro', 'premium'].includes(userPlan)) return true;
  return false;
}
