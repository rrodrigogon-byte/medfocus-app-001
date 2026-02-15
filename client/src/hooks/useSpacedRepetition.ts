/**
 * Sistema de Revisão Espaçada SM-2 (Anki-like)
 * 
 * Implementação do algoritmo SuperMemo 2 para agendamento inteligente
 * de revisões de flashcards baseado no desempenho do estudante.
 * 
 * Referência: Wozniak, P.A. (1990). SuperMemo algorithm SM-2.
 * https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */

import { useState, useCallback, useEffect } from 'react';

// Qualidade da resposta (0-5 no SM-2 original)
export type ResponseQuality = 0 | 1 | 2 | 3 | 4 | 5;

// Labels para cada nível de qualidade
export const QUALITY_LABELS: Record<ResponseQuality, { label: string; color: string; description: string }> = {
  0: { label: 'Esqueci', color: '#ef4444', description: 'Não lembrei nada' },
  1: { label: 'Errei', color: '#f97316', description: 'Resposta incorreta, mas reconheci ao ver' },
  2: { label: 'Difícil', color: '#eab308', description: 'Resposta incorreta, mas parecia fácil ao rever' },
  3: { label: 'Regular', color: '#22c55e', description: 'Resposta correta com dificuldade significativa' },
  4: { label: 'Bom', color: '#14b8a6', description: 'Resposta correta após hesitação' },
  5: { label: 'Fácil', color: '#3b82f6', description: 'Resposta correta sem hesitação' },
};

export interface SM2Card {
  id: string;
  front: string;
  back: string;
  subject: string;
  // SM-2 parameters
  repetition: number;     // n: repetition number (0 = new)
  easeFactor: number;     // EF: easiness factor (min 1.3)
  interval: number;       // I(n): inter-repetition interval in days
  nextReview: number;     // timestamp of next review
  lastReview: number;     // timestamp of last review
  // Stats
  totalReviews: number;
  correctReviews: number;
  streak: number;
  lapses: number;         // number of times card was forgotten
}

export interface ReviewSession {
  id: string;
  startTime: number;
  endTime: number | null;
  cardsReviewed: number;
  correctCount: number;
  averageQuality: number;
  subject: string | null;
}

export interface SpacedRepetitionStats {
  totalCards: number;
  newCards: number;
  dueCards: number;
  learningCards: number;
  matureCards: number;
  averageEaseFactor: number;
  retentionRate: number;
  streakDays: number;
  totalReviews: number;
  todayReviews: number;
  forecastNext7Days: number[];
}

const STORAGE_KEY = 'medfocus_sm2_cards';
const SESSIONS_KEY = 'medfocus_sm2_sessions';
const SETTINGS_KEY = 'medfocus_sm2_settings';

export interface SM2Settings {
  newCardsPerDay: number;
  reviewsPerDay: number;
  easyBonus: number;
  intervalModifier: number;
  lapseInterval: number;
  graduatingInterval: number;
  learningSteps: number[]; // in minutes
}

const DEFAULT_SETTINGS: SM2Settings = {
  newCardsPerDay: 20,
  reviewsPerDay: 100,
  easyBonus: 1.3,
  intervalModifier: 1.0,
  lapseInterval: 1,
  graduatingInterval: 1,
  learningSteps: [1, 10, 60], // 1min, 10min, 1h
};

/**
 * Algoritmo SM-2 Core
 * 
 * EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
 * onde q é a qualidade da resposta (0-5)
 * 
 * Se q >= 3 (resposta correta):
 *   I(1) = 1 dia
 *   I(2) = 6 dias
 *   I(n) = I(n-1) * EF para n > 2
 * 
 * Se q < 3 (resposta incorreta):
 *   Reiniciar repetições (n = 0)
 */
function calculateSM2(
  card: SM2Card,
  quality: ResponseQuality,
  settings: SM2Settings
): Partial<SM2Card> {
  const now = Date.now();
  let { repetition, easeFactor, interval, streak, lapses, totalReviews, correctReviews } = card;

  // Update ease factor
  const newEF = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  totalReviews += 1;

  if (quality >= 3) {
    // Correct response
    correctReviews += 1;
    streak += 1;

    if (repetition === 0) {
      interval = settings.graduatingInterval;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * newEF * settings.intervalModifier);
    }

    // Easy bonus
    if (quality === 5) {
      interval = Math.round(interval * settings.easyBonus);
    }

    repetition += 1;
  } else {
    // Incorrect response - lapse
    lapses += 1;
    streak = 0;
    repetition = 0;
    interval = settings.lapseInterval;
  }

  // Cap interval at 365 days
  interval = Math.min(interval, 365);

  const nextReview = now + interval * 24 * 60 * 60 * 1000;

  return {
    repetition,
    easeFactor: newEF,
    interval,
    nextReview,
    lastReview: now,
    totalReviews,
    correctReviews,
    streak,
    lapses,
  };
}

function createNewCard(id: string, front: string, back: string, subject: string): SM2Card {
  return {
    id,
    front,
    back,
    subject,
    repetition: 0,
    easeFactor: 2.5,
    interval: 0,
    nextReview: 0,
    lastReview: 0,
    totalReviews: 0,
    correctReviews: 0,
    streak: 0,
    lapses: 0,
  };
}

export function useSpacedRepetition() {
  const [cards, setCards] = useState<SM2Card[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [sessions, setSessions] = useState<ReviewSession[]>(() => {
    try {
      const saved = localStorage.getItem(SESSIONS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [settings, setSettings] = useState<SM2Settings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch { return DEFAULT_SETTINGS; }
  });

  const [currentSession, setCurrentSession] = useState<ReviewSession | null>(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Import flashcards from preloaded content
  const importCards = useCallback((
    newCards: Array<{ id: string; front: string; back: string; subject: string }>
  ) => {
    setCards(prev => {
      const existingIds = new Set(prev.map(c => c.id));
      const toAdd = newCards
        .filter(c => !existingIds.has(c.id))
        .map(c => createNewCard(c.id, c.front, c.back, c.subject));
      return [...prev, ...toAdd];
    });
  }, []);

  // Get cards due for review
  const getDueCards = useCallback((subject?: string): SM2Card[] => {
    const now = Date.now();
    return cards
      .filter(c => {
        if (subject && c.subject !== subject) return false;
        return c.nextReview <= now || c.repetition === 0;
      })
      .sort((a, b) => {
        // New cards first, then by due date
        if (a.repetition === 0 && b.repetition !== 0) return -1;
        if (a.repetition !== 0 && b.repetition === 0) return 1;
        return a.nextReview - b.nextReview;
      });
  }, [cards]);

  // Review a card
  const reviewCard = useCallback((cardId: string, quality: ResponseQuality) => {
    setCards(prev => prev.map(card => {
      if (card.id !== cardId) return card;
      const updates = calculateSM2(card, quality, settings);
      return { ...card, ...updates };
    }));

    // Update current session
    setCurrentSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        cardsReviewed: prev.cardsReviewed + 1,
        correctCount: prev.correctCount + (quality >= 3 ? 1 : 0),
        averageQuality: (prev.averageQuality * prev.cardsReviewed + quality) / (prev.cardsReviewed + 1),
      };
    });
  }, [settings]);

  // Start a review session
  const startSession = useCallback((subject?: string): ReviewSession => {
    const session: ReviewSession = {
      id: `session_${Date.now()}`,
      startTime: Date.now(),
      endTime: null,
      cardsReviewed: 0,
      correctCount: 0,
      averageQuality: 0,
      subject: subject || null,
    };
    setCurrentSession(session);
    return session;
  }, []);

  // End current session
  const endSession = useCallback(() => {
    if (currentSession) {
      const completed = { ...currentSession, endTime: Date.now() };
      setSessions(prev => [...prev, completed]);
      setCurrentSession(null);
      return completed;
    }
    return null;
  }, [currentSession]);

  // Get statistics
  const getStats = useCallback((subject?: string): SpacedRepetitionStats => {
    const now = Date.now();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    const filtered = subject ? cards.filter(c => c.subject === subject) : cards;

    const newCards = filtered.filter(c => c.repetition === 0);
    const dueCards = filtered.filter(c => c.nextReview <= now && c.repetition > 0);
    const learningCards = filtered.filter(c => c.repetition > 0 && c.interval < 21);
    const matureCards = filtered.filter(c => c.interval >= 21);

    const totalReviews = filtered.reduce((sum, c) => sum + c.totalReviews, 0);
    const correctReviews = filtered.reduce((sum, c) => sum + c.correctReviews, 0);
    const retentionRate = totalReviews > 0 ? (correctReviews / totalReviews) * 100 : 0;

    const avgEF = filtered.length > 0
      ? filtered.reduce((sum, c) => sum + c.easeFactor, 0) / filtered.length
      : 2.5;

    // Today's reviews
    const todayReviews = filtered.filter(c => c.lastReview >= todayStart).length;

    // Forecast next 7 days
    const forecast: number[] = [];
    for (let i = 0; i < 7; i++) {
      const dayStart = todayStart + i * 24 * 60 * 60 * 1000;
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      const count = filtered.filter(c =>
        c.nextReview >= dayStart && c.nextReview < dayEnd && c.repetition > 0
      ).length;
      forecast.push(count);
    }

    // Streak calculation
    let streakDays = 0;
    const sortedSessions = [...sessions]
      .filter(s => !subject || s.subject === subject)
      .sort((a, b) => b.startTime - a.startTime);
    
    if (sortedSessions.length > 0) {
      let checkDate = new Date();
      checkDate.setHours(0, 0, 0, 0);
      
      for (const session of sortedSessions) {
        const sessionDate = new Date(session.startTime);
        sessionDate.setHours(0, 0, 0, 0);
        
        if (sessionDate.getTime() === checkDate.getTime()) {
          streakDays++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (sessionDate.getTime() < checkDate.getTime()) {
          break;
        }
      }
    }

    return {
      totalCards: filtered.length,
      newCards: newCards.length,
      dueCards: dueCards.length,
      learningCards: learningCards.length,
      matureCards: matureCards.length,
      averageEaseFactor: avgEF,
      retentionRate,
      streakDays,
      totalReviews,
      todayReviews,
      forecastNext7Days: forecast,
    };
  }, [cards, sessions]);

  // Get subjects with card counts
  const getSubjects = useCallback(() => {
    const subjectMap = new Map<string, { total: number; due: number; new: number }>();
    const now = Date.now();
    
    for (const card of cards) {
      const existing = subjectMap.get(card.subject) || { total: 0, due: 0, new: 0 };
      existing.total++;
      if (card.repetition === 0) existing.new++;
      else if (card.nextReview <= now) existing.due++;
      subjectMap.set(card.subject, existing);
    }
    
    return Array.from(subjectMap.entries()).map(([name, counts]) => ({
      name,
      ...counts,
    }));
  }, [cards]);

  // Delete a card
  const deleteCard = useCallback((cardId: string) => {
    setCards(prev => prev.filter(c => c.id !== cardId));
  }, []);

  // Reset a card
  const resetCard = useCallback((cardId: string) => {
    setCards(prev => prev.map(card => {
      if (card.id !== cardId) return card;
      return createNewCard(card.id, card.front, card.back, card.subject);
    }));
  }, []);

  // Update settings
  const updateSettings = useCallback((updates: Partial<SM2Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    cards,
    settings,
    currentSession,
    importCards,
    getDueCards,
    reviewCard,
    startSession,
    endSession,
    getStats,
    getSubjects,
    deleteCard,
    resetCard,
    updateSettings,
  };
}
