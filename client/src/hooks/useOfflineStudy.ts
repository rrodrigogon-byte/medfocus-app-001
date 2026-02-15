/**
 * useOfflineStudy - Hook para gerenciar modo offline de estudo
 * 
 * Cacheia flashcards, quizzes e materiais de estudo no Service Worker
 * para permitir estudo sem internet. Sincroniza progresso ao reconectar.
 */
import { useState, useEffect, useCallback } from 'react';

interface CacheStatus {
  caches: Record<string, number>;
  online: boolean;
}

interface StudyDataToCache {
  key: string;
  content: any;
}

export function useOfflineStudy() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Listen for SW messages
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'CACHE_STATUS') {
        setCacheStatus(event.data.data);
      }
    };
    navigator.serviceWorker?.addEventListener('message', handler);
    return () => navigator.serviceWorker?.removeEventListener('message', handler);
  }, []);

  // Cache study data for offline use
  const cacheStudyData = useCallback(async (data: StudyDataToCache) => {
    const reg = await navigator.serviceWorker?.ready;
    if (!reg?.active) return;
    reg.active.postMessage({ type: 'CACHE_STUDY_DATA', data });
  }, []);

  // Cache flashcards for offline
  const cacheFlashcards = useCallback(async (subject: string, cards: any[]) => {
    await cacheStudyData({
      key: `flashcards-${subject}`,
      content: { subject, cards, cachedAt: Date.now() },
    });
  }, [cacheStudyData]);

  // Cache quiz for offline
  const cacheQuiz = useCallback(async (quizId: string, questions: any[]) => {
    await cacheStudyData({
      key: `quiz-${quizId}`,
      content: { quizId, questions, cachedAt: Date.now() },
    });
  }, [cacheStudyData]);

  // Cache study material for offline
  const cacheMaterial = useCallback(async (materialId: string, content: any) => {
    await cacheStudyData({
      key: `material-${materialId}`,
      content: { materialId, ...content, cachedAt: Date.now() },
    });
  }, [cacheStudyData]);

  // Queue progress update for sync when back online
  const queueProgressSync = useCallback(async (data: any) => {
    await cacheStudyData({
      key: `pending-progress-${Date.now()}`,
      content: data,
    });
    // Request background sync if available
    try {
      const reg = await navigator.serviceWorker?.ready;
      if (reg && 'sync' in reg) {
        await (reg as any).sync.register('sync-study-progress');
      }
    } catch (e) {
      // Background sync not supported, will sync on next page load
    }
  }, [cacheStudyData]);

  // Queue quiz submission for sync
  const queueQuizSubmission = useCallback(async (data: any) => {
    await cacheStudyData({
      key: `quiz-submission-${Date.now()}`,
      content: data,
    });
    try {
      const reg = await navigator.serviceWorker?.ready;
      if (reg && 'sync' in reg) {
        await (reg as any).sync.register('sync-quiz-submissions');
      }
    } catch (e) {
      // Will sync on reconnect
    }
  }, [cacheStudyData]);

  // Get cached study data
  const getCachedData = useCallback(async (key: string): Promise<any | null> => {
    try {
      const cache = await caches.open('medfocus-study-v1');
      const response = await cache.match(new Request(`/offline-study/${key}`));
      if (!response) return null;
      return await response.json();
    } catch {
      return null;
    }
  }, []);

  // Get all cached flashcard sets
  const getCachedFlashcards = useCallback(async (): Promise<string[]> => {
    try {
      const cache = await caches.open('medfocus-study-v1');
      const keys = await cache.keys();
      return keys
        .filter(k => k.url.includes('/offline-study/flashcards-'))
        .map(k => {
          const url = new URL(k.url);
          return url.pathname.replace('/offline-study/flashcards-', '');
        });
    } catch {
      return [];
    }
  }, []);

  // Get all cached quizzes
  const getCachedQuizzes = useCallback(async (): Promise<string[]> => {
    try {
      const cache = await caches.open('medfocus-study-v1');
      const keys = await cache.keys();
      return keys
        .filter(k => k.url.includes('/offline-study/quiz-') && !k.url.includes('submission'))
        .map(k => {
          const url = new URL(k.url);
          return url.pathname.replace('/offline-study/quiz-', '');
        });
    } catch {
      return [];
    }
  }, []);

  // Clear all study cache
  const clearStudyCache = useCallback(async () => {
    const reg = await navigator.serviceWorker?.ready;
    if (reg?.active) {
      reg.active.postMessage({ type: 'CLEAR_STUDY_CACHE' });
    }
  }, []);

  // Request cache status from SW
  const refreshCacheStatus = useCallback(async () => {
    const reg = await navigator.serviceWorker?.ready;
    if (reg?.active) {
      reg.active.postMessage({ type: 'GET_CACHE_STATUS' });
    }
  }, []);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && !isSyncing) {
      setIsSyncing(true);
      // Trigger background sync
      navigator.serviceWorker?.ready.then(async (reg) => {
        try {
          if ('sync' in reg) {
            await (reg as any).sync.register('sync-study-progress');
            await (reg as any).sync.register('sync-quiz-submissions');
          }
        } catch {
          // Background sync not supported
        }
        setIsSyncing(false);
      });
    }
  }, [isOnline]);

  return {
    isOnline,
    isSyncing,
    cacheStatus,
    cacheFlashcards,
    cacheQuiz,
    cacheMaterial,
    queueProgressSync,
    queueQuizSubmission,
    getCachedData,
    getCachedFlashcards,
    getCachedQuizzes,
    clearStudyCache,
    refreshCacheStatus,
  };
}
