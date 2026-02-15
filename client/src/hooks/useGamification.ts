/**
 * MedFocus — useGamification Hook
 * Integra XP com ações reais: Pomodoro, Quiz, Flashcard, Checklist
 * Emite eventos customizados para que qualquer componente possa reagir
 */
import { useState, useEffect, useCallback } from 'react';
import {
  GamificationState,
  loadGamification,
  saveGamification,
  addXP,
  XP_ACTIONS,
} from '../data/gamification';

// Custom event for cross-component communication
const XP_EVENT = 'medfocus:xp_gained';
const BADGE_EVENT = 'medfocus:badge_unlocked';

export interface XPGainEvent {
  amount: number;
  action: string;
  label: string;
}

export interface BadgeUnlockEvent {
  badgeName: string;
  xpReward: number;
}

export function useGamification() {
  const [state, setState] = useState<GamificationState>(loadGamification);

  // Sync with localStorage changes from other tabs/components
  useEffect(() => {
    const handler = () => setState(loadGamification());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const gainXP = useCallback((amount: number, action: string, label: string) => {
    setState(prev => {
      const oldBadges = prev.badges.filter(b => b.unlocked).map(b => b.id);
      const newState = addXP(prev, amount, action);
      saveGamification(newState);

      // Emit XP gained event
      window.dispatchEvent(new CustomEvent(XP_EVENT, {
        detail: { amount, action, label } as XPGainEvent,
      }));

      // Check for newly unlocked badges
      const newBadges = newState.badges.filter(b => b.unlocked && !oldBadges.includes(b.id));
      newBadges.forEach(badge => {
        window.dispatchEvent(new CustomEvent(BADGE_EVENT, {
          detail: { badgeName: badge.name, xpReward: badge.xpReward } as BadgeUnlockEvent,
        }));
      });

      return newState;
    });
  }, []);

  // Specific action handlers
  const completePomodoro = useCallback((minutes: number) => {
    setState(prev => {
      const updated = { ...prev, totalStudyMinutes: prev.totalStudyMinutes + minutes };
      const newState = addXP(updated, XP_ACTIONS.COMPLETE_POMODORO + Math.floor(minutes / 5), 'pomodoro');
      saveGamification(newState);
      window.dispatchEvent(new CustomEvent(XP_EVENT, {
        detail: { amount: XP_ACTIONS.COMPLETE_POMODORO + Math.floor(minutes / 5), action: 'pomodoro', label: `Pomodoro ${minutes}min concluído` },
      }));
      return newState;
    });
  }, []);

  const completeQuiz = useCallback((correct: number, total: number) => {
    setState(prev => {
      const updated = {
        ...prev,
        totalQuizzes: prev.totalQuizzes + 1,
        totalCorrectAnswers: prev.totalCorrectAnswers + correct,
      };
      const xpAmount = XP_ACTIONS.COMPLETE_QUIZ + (correct * XP_ACTIONS.CORRECT_ANSWER);
      const perfectBonus = correct === total ? 50 : 0;
      const newState = addXP(updated, xpAmount + perfectBonus, 'quiz');
      saveGamification(newState);
      window.dispatchEvent(new CustomEvent(XP_EVENT, {
        detail: { amount: xpAmount + perfectBonus, action: 'quiz', label: `Quiz: ${correct}/${total} corretas${perfectBonus ? ' (Perfeito!)' : ''}` },
      }));
      return newState;
    });
  }, []);

  const reviewFlashcard = useCallback(() => {
    setState(prev => {
      const updated = { ...prev, totalFlashcardsReviewed: prev.totalFlashcardsReviewed + 1 };
      const newState = addXP(updated, XP_ACTIONS.REVIEW_FLASHCARD, 'flashcard');
      saveGamification(newState);
      return newState;
    });
  }, []);

  const completeChecklistItem = useCallback(() => {
    gainXP(XP_ACTIONS.COMPLETE_CHECKLIST_ITEM, 'checklist', 'Item do checklist concluído');
  }, [gainXP]);

  const studySubject = useCallback((subjectName: string) => {
    setState(prev => {
      const updated = { ...prev, totalSubjectsCompleted: prev.totalSubjectsCompleted + 1 };
      const newState = addXP(updated, XP_ACTIONS.STUDY_SUBJECT, 'subject');
      saveGamification(newState);
      window.dispatchEvent(new CustomEvent(XP_EVENT, {
        detail: { amount: XP_ACTIONS.STUDY_SUBJECT, action: 'subject', label: `Estudou: ${subjectName}` },
      }));
      return newState;
    });
  }, []);

  const dailyLogin = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    if (state.lastStudyDate !== today) {
      const streakBonus = state.streak * XP_ACTIONS.STREAK_BONUS_PER_DAY;
      gainXP(XP_ACTIONS.DAILY_LOGIN + streakBonus, 'login', `Login diário (+${streakBonus} streak bonus)`);
    }
  }, [state.lastStudyDate, state.streak, gainXP]);

  return {
    state,
    gainXP,
    completePomodoro,
    completeQuiz,
    reviewFlashcard,
    completeChecklistItem,
    studySubject,
    dailyLogin,
  };
}

// Hook for listening to XP events (for toast notifications)
export function useXPNotifications(callback: (event: XPGainEvent) => void) {
  useEffect(() => {
    const handler = (e: Event) => callback((e as CustomEvent<XPGainEvent>).detail);
    window.addEventListener(XP_EVENT, handler);
    return () => window.removeEventListener(XP_EVENT, handler);
  }, [callback]);
}

export function useBadgeNotifications(callback: (event: BadgeUnlockEvent) => void) {
  useEffect(() => {
    const handler = (e: Event) => callback((e as CustomEvent<BadgeUnlockEvent>).detail);
    window.addEventListener(BADGE_EVENT, handler);
    return () => window.removeEventListener(BADGE_EVENT, handler);
  }, [callback]);
}
