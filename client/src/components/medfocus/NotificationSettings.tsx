/**
 * MedFocus — Notification Settings Panel
 * Configure study reminders, streak alerts, and push notifications
 */
import React, { useState } from 'react';
import { useNotifications, NotificationSettings as NotifSettings } from '../../hooks/useNotifications';

const NotificationSettingsPanel: React.FC = () => {
  const {
    permission,
    settings,
    requestPermission,
    updateSettings,
    isSupported,
  } = useNotifications();

  const [showSuccess, setShowSuccess] = useState(false);

  const handleEnable = async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const reminderTimes = [
    { label: '06:00 — Madrugador', hour: 6, minute: 0 },
    { label: '08:00 — Manhã', hour: 8, minute: 0 },
    { label: '10:00 — Meio da Manhã', hour: 10, minute: 0 },
    { label: '14:00 — Tarde', hour: 14, minute: 0 },
    { label: '17:00 — Fim da Tarde', hour: 17, minute: 0 },
    { label: '19:00 — Noite', hour: 19, minute: 0 },
    { label: '21:00 — Noite Avançada', hour: 21, minute: 0 },
  ];

  if (!isSupported) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Notificações</h2>
          <p className="text-sm text-muted-foreground mt-1">Seu navegador não suporta notificações push</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-amber-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-amber-600 font-medium">
            Para receber notificações, use um navegador compatível como Chrome, Firefox ou Edge.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Notificações & Lembretes</h2>
        <p className="text-sm text-muted-foreground mt-1">Configure lembretes diários para manter seu streak e rotina de estudos</p>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm font-medium text-emerald-600">Notificações ativadas com sucesso!</p>
        </div>
      )}

      {/* Permission Status */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              permission === 'granted' ? 'bg-primary/10' : 'bg-muted'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${permission === 'granted' ? 'text-primary' : 'text-muted-foreground'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Notificações Push</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {permission === 'granted' ? 'Ativadas — você receberá lembretes' :
                 permission === 'denied' ? 'Bloqueadas — desbloqueie nas configurações do navegador' :
                 'Desativadas — ative para receber lembretes de estudo'}
              </p>
            </div>
          </div>
          {permission !== 'granted' && permission !== 'denied' && (
            <button
              onClick={handleEnable}
              className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Ativar
            </button>
          )}
          {permission === 'granted' && (
            <div className="flex items-center gap-2 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold">Ativo</span>
            </div>
          )}
          {permission === 'denied' && (
            <span className="text-xs text-rose-500 font-medium">Bloqueado</span>
          )}
        </div>
      </div>

      {/* Settings */}
      {permission === 'granted' && (
        <div className="space-y-4">
          {/* Study Reminder */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Lembrete de Estudo Diário</h4>
                  <p className="text-xs text-muted-foreground">Receba um lembrete para estudar todos os dias</p>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ studyReminder: !settings.studyReminder })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.studyReminder ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.studyReminder ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {settings.studyReminder && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-3">Horário do lembrete:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {reminderTimes.map((time) => (
                    <button
                      key={`${time.hour}-${time.minute}`}
                      onClick={() => updateSettings({ reminderHour: time.hour, reminderMinute: time.minute })}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        settings.reminderHour === time.hour && settings.reminderMinute === time.minute
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {time.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Streak Reminder */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Alerta de Streak</h4>
                  <p className="text-xs text-muted-foreground">Aviso quando seu streak está em risco</p>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ streakReminder: !settings.streakReminder })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.streakReminder ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.streakReminder ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>

          {/* Break Reminder */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Lembrete de Pausa</h4>
                  <p className="text-xs text-muted-foreground">Aviso para descansar após sessões longas</p>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ breakReminder: !settings.breakReminder })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.breakReminder ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.breakReminder ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>

          {/* PWA Install Hint */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">Instale o MedFocus</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Para receber notificações mesmo com o navegador fechado, instale o MedFocus como app. 
                  No Chrome, clique em <strong className="text-foreground">⋮ → Instalar aplicativo</strong>. 
                  No Safari, toque em <strong className="text-foreground">Compartilhar → Adicionar à Tela de Início</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSettingsPanel;
