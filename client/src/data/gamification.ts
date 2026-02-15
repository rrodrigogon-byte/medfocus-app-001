/**
 * MedFocus — Sistema de Gamificação
 * XP, Badges, Streaks e Níveis para motivar o estudo diário
 */

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // SVG path
  requirement: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'study' | 'streak' | 'quiz' | 'milestone';
}

export interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  totalStudyMinutes: number;
  totalQuizzes: number;
  totalCorrectAnswers: number;
  totalFlashcardsReviewed: number;
  totalSubjectsCompleted: number;
  badges: Badge[];
  dailyXpLog: Record<string, number>; // date -> xp earned
}

// XP per level (exponential curve)
export const XP_PER_LEVEL = [
  0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800, // 1-10
  4700, 5700, 6800, 8000, 9500, 11000, 13000, 15000, 17500, 20000, // 11-20
];

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Calouro',
  2: 'Estudante',
  3: 'Acadêmico',
  4: 'Dedicado',
  5: 'Aplicado',
  6: 'Competente',
  7: 'Avançado',
  8: 'Especialista',
  9: 'Mestre',
  10: 'Doutor',
  11: 'Professor',
  12: 'Pesquisador',
  13: 'Cientista',
  14: 'Referência',
  15: 'Autoridade',
  16: 'Eminência',
  17: 'Lenda',
  18: 'Gênio',
  19: 'Visionário',
  20: 'Hipócrates',
};

export const DEFAULT_BADGES: Badge[] = [
  // Study badges
  { id: 'first_study', name: 'Primeiro Passo', description: 'Complete sua primeira sessão de estudo', icon: 'M13 10V3L4 14h7v7l9-11h-7z', requirement: '1 sessão de estudo', xpReward: 50, unlocked: false, category: 'study' },
  { id: 'study_10', name: 'Maratonista', description: 'Complete 10 sessões de estudo', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', requirement: '10 sessões', xpReward: 200, unlocked: false, category: 'study' },
  { id: 'study_50', name: 'Incansável', description: 'Complete 50 sessões de estudo', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0 .9.448 1.716 1.163 2.2', requirement: '50 sessões', xpReward: 500, unlocked: false, category: 'study' },
  { id: 'study_1h', name: 'Hora Cheia', description: 'Estude por 60 minutos em um dia', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', requirement: '60 min/dia', xpReward: 100, unlocked: false, category: 'study' },
  { id: 'study_5h', name: 'Plantão de Estudos', description: 'Acumule 5 horas de estudo', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', requirement: '5h total', xpReward: 300, unlocked: false, category: 'study' },
  // Streak badges
  { id: 'streak_3', name: 'Consistente', description: 'Mantenha um streak de 3 dias', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0 .9.448 1.716 1.163 2.2', requirement: '3 dias seguidos', xpReward: 150, unlocked: false, category: 'streak' },
  { id: 'streak_7', name: 'Semana Perfeita', description: 'Mantenha um streak de 7 dias', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', requirement: '7 dias seguidos', xpReward: 350, unlocked: false, category: 'streak' },
  { id: 'streak_30', name: 'Mês de Ouro', description: 'Mantenha um streak de 30 dias', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', requirement: '30 dias seguidos', xpReward: 1000, unlocked: false, category: 'streak' },
  // Quiz badges
  { id: 'quiz_first', name: 'Curioso', description: 'Complete seu primeiro quiz', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01', requirement: '1 quiz', xpReward: 50, unlocked: false, category: 'quiz' },
  { id: 'quiz_perfect', name: 'Nota 10', description: 'Acerte 100% de um quiz', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806', requirement: '100% em 1 quiz', xpReward: 200, unlocked: false, category: 'quiz' },
  { id: 'quiz_50', name: 'Veterano', description: 'Complete 50 quizzes', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21', requirement: '50 quizzes', xpReward: 500, unlocked: false, category: 'quiz' },
  // Milestone badges
  { id: 'all_subjects', name: 'Enciclopédia', description: 'Estude todas as disciplinas disponíveis', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', requirement: 'Todas as disciplinas', xpReward: 500, unlocked: false, category: 'milestone' },
  { id: 'flashcard_100', name: 'Memória de Elefante', description: 'Revise 100 flashcards', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', requirement: '100 flashcards', xpReward: 400, unlocked: false, category: 'milestone' },
  { id: 'level_10', name: 'Doutor Honorário', description: 'Alcance o nível 10', icon: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342', requirement: 'Nível 10', xpReward: 1000, unlocked: false, category: 'milestone' },
];

// XP rewards for actions
export const XP_ACTIONS = {
  COMPLETE_POMODORO: 25,
  COMPLETE_QUIZ: 30,
  CORRECT_ANSWER: 10,
  REVIEW_FLASHCARD: 5,
  COMPLETE_CHECKLIST_ITEM: 15,
  STUDY_SUBJECT: 20,
  DAILY_LOGIN: 10,
  STREAK_BONUS_PER_DAY: 5, // multiplied by streak count
};

const STORAGE_KEY = 'medfocus_gamification';

export function getDefaultState(): GamificationState {
  return {
    xp: 0,
    level: 1,
    streak: 0,
    longestStreak: 0,
    lastStudyDate: null,
    totalStudyMinutes: 0,
    totalQuizzes: 0,
    totalCorrectAnswers: 0,
    totalFlashcardsReviewed: 0,
    totalSubjectsCompleted: 0,
    badges: [...DEFAULT_BADGES],
    dailyXpLog: {},
  };
}

export function loadGamification(): GamificationState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to ensure new badges are included
      const defaultBadges = [...DEFAULT_BADGES];
      const savedBadgeIds = new Set(parsed.badges?.map((b: Badge) => b.id) || []);
      const mergedBadges = [
        ...(parsed.badges || []),
        ...defaultBadges.filter(b => !savedBadgeIds.has(b.id)),
      ];
      return { ...getDefaultState(), ...parsed, badges: mergedBadges };
    }
  } catch { /* ignore */ }
  return getDefaultState();
}

export function saveGamification(state: GamificationState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function calculateLevel(xp: number): number {
  for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
    if (xp >= XP_PER_LEVEL[i]) return i + 1;
  }
  return 1;
}

export function xpForNextLevel(level: number): number {
  return XP_PER_LEVEL[Math.min(level, XP_PER_LEVEL.length - 1)] || 20000;
}

export function xpProgress(xp: number, level: number): number {
  const currentLevelXp = XP_PER_LEVEL[level - 1] || 0;
  const nextLevelXp = xpForNextLevel(level);
  const progress = (xp - currentLevelXp) / (nextLevelXp - currentLevelXp);
  return Math.min(Math.max(progress, 0), 1);
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function addXP(state: GamificationState, amount: number, action?: string): GamificationState {
  const today = todayStr();
  const newXp = state.xp + amount;
  const newLevel = calculateLevel(newXp);
  const dailyXpLog = { ...state.dailyXpLog, [today]: (state.dailyXpLog[today] || 0) + amount };

  // Update streak
  let streak = state.streak;
  let longestStreak = state.longestStreak;
  if (state.lastStudyDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    if (state.lastStudyDate === yesterdayStr) {
      streak += 1;
    } else if (state.lastStudyDate !== today) {
      streak = 1;
    }
    longestStreak = Math.max(longestStreak, streak);
  }

  const newState: GamificationState = {
    ...state,
    xp: newXp,
    level: newLevel,
    streak,
    longestStreak,
    lastStudyDate: today,
    dailyXpLog,
  };

  // Check badge unlocks
  return checkBadges(newState);
}

function checkBadges(state: GamificationState): GamificationState {
  const badges = state.badges.map(b => {
    if (b.unlocked) return b;
    let shouldUnlock = false;
    switch (b.id) {
      case 'first_study': shouldUnlock = state.totalStudyMinutes > 0 || state.totalQuizzes > 0; break;
      case 'study_10': shouldUnlock = state.totalStudyMinutes >= 250; break;
      case 'study_50': shouldUnlock = state.totalStudyMinutes >= 1250; break;
      case 'study_1h': shouldUnlock = state.totalStudyMinutes >= 60; break;
      case 'study_5h': shouldUnlock = state.totalStudyMinutes >= 300; break;
      case 'streak_3': shouldUnlock = state.streak >= 3; break;
      case 'streak_7': shouldUnlock = state.streak >= 7; break;
      case 'streak_30': shouldUnlock = state.streak >= 30; break;
      case 'quiz_first': shouldUnlock = state.totalQuizzes >= 1; break;
      case 'quiz_50': shouldUnlock = state.totalQuizzes >= 50; break;
      case 'flashcard_100': shouldUnlock = state.totalFlashcardsReviewed >= 100; break;
      case 'level_10': shouldUnlock = state.level >= 10; break;
      case 'all_subjects': shouldUnlock = state.totalSubjectsCompleted >= 6; break;
    }
    if (shouldUnlock) {
      return { ...b, unlocked: true, unlockedAt: new Date().toISOString() };
    }
    return b;
  });
  return { ...state, badges };
}
