/**
 * MedFocus — useNotifications Hook
 * Gerencia notificações push, permissões e lembretes de estudo
 */
import { useState, useEffect, useCallback } from 'react';

export interface NotificationSettings {
  enabled: boolean;
  studyReminder: boolean;
  reminderHour: number; // 0-23
  reminderMinute: number; // 0-59
  streakReminder: boolean;
  breakReminder: boolean;
  goalAlertEnabled: boolean; // Alert when below 50% of weekly goal on Wednesday
}

const STORAGE_KEY = 'medfocus_notification_settings';

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  studyReminder: true,
  reminderHour: 19, // 7 PM
  reminderMinute: 0,
  streakReminder: true,
  breakReminder: true,
  goalAlertEnabled: true,
};

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [reminderTimer, setReminderTimer] = useState<number | null>(null);

  // Check current permission
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Save settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Schedule local reminders
  useEffect(() => {
    if (!settings.enabled || !settings.studyReminder) {
      if (reminderTimer) {
        clearInterval(reminderTimer);
        setReminderTimer(null);
      }
      return;
    }

    // Check every minute if it's time for a reminder
    const timer = window.setInterval(() => {
      const now = new Date();
      if (now.getHours() === settings.reminderHour && now.getMinutes() === settings.reminderMinute) {
        showLocalNotification(
          'MedFocus — Hora de Estudar!',
          'Mantenha seu streak ativo. Dedique pelo menos 15 minutos aos estudos hoje.'
        );
      }
    }, 60000);

    setReminderTimer(timer);
    return () => clearInterval(timer);
  }, [settings.enabled, settings.studyReminder, settings.reminderHour, settings.reminderMinute]);

  // Listen for snooze messages from service worker
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'SNOOZE_REMINDER') {
        const delay = (event.data.delay || 30) * 60 * 1000;
        setTimeout(() => {
          showLocalNotification(
            'MedFocus — Lembrete Adiado',
            'Você pediu para ser lembrado. Hora de voltar aos estudos!'
          );
        }, delay);
      }
    };
    navigator.serviceWorker?.addEventListener('message', handler);
    return () => navigator.serviceWorker?.removeEventListener('message', handler);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    
    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === 'granted') {
      setSettings(prev => ({ ...prev, enabled: true }));
      // Show welcome notification
      showLocalNotification(
        'MedFocus — Notificações Ativadas!',
        'Você receberá lembretes de estudo diários para manter seu streak.'
      );
      return true;
    }
    return false;
  }, []);

  const showLocalNotification = useCallback((title: string, body: string) => {
    if (permission !== 'granted') return;
    
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body,
          icon: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663109238085/luEmcExPIjQEtqNO.png',
          badge: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663109238085/luEmcExPIjQEtqNO.png',
          tag: 'medfocus-local',
        } as NotificationOptions);
      });
    } else {
      new Notification(title, { body, icon: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663109238085/luEmcExPIjQEtqNO.png' });
    }
  }, [permission]);

  const updateSettings = useCallback((updates: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  // Streak reminder - call this from the app when user hasn't studied today
  const sendStreakReminder = useCallback((currentStreak: number) => {
    if (!settings.streakReminder || permission !== 'granted') return;
    showLocalNotification(
      `MedFocus — Streak de ${currentStreak} dias em risco!`,
      'Estude pelo menos 15 minutos hoje para manter seu streak ativo.'
    );
  }, [settings.streakReminder, permission, showLocalNotification]);

  // Break reminder after long study session
  const sendBreakReminder = useCallback((studyMinutes: number) => {
    if (!settings.breakReminder || permission !== 'granted') return;
    showLocalNotification(
      'MedFocus — Hora de uma Pausa',
      `Você já estudou ${studyMinutes} minutos. Faça uma pausa de 10 minutos para manter o foco.`
    );
  }, [settings.breakReminder, permission, showLocalNotification]);

  // Goal alert — fires when user is below 50% of weekly goal mid-week
  const sendGoalAlert = useCallback((goalName: string, currentPct: number, targetValue: number) => {
    if (!settings.goalAlertEnabled || permission !== 'granted') return;
    showLocalNotification(
      `MedFocus — Meta "${goalName}" em risco!`,
      `Você está em ${currentPct}% da meta semanal (alvo: ${targetValue}). Ainda dá tempo de recuperar — foque nos estudos hoje!`
    );
  }, [settings.goalAlertEnabled, permission, showLocalNotification]);

  return {
    permission,
    settings,
    requestPermission,
    updateSettings,
    showLocalNotification,
    sendStreakReminder,
    sendBreakReminder,
    sendGoalAlert,
    isSupported: 'Notification' in window,
  };
}
