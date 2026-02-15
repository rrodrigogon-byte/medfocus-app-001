/**
 * MedFocus — XP Toast Notification
 * Exibe notificação flutuante quando o usuário ganha XP
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useXPNotifications, useBadgeNotifications, XPGainEvent, BadgeUnlockEvent } from '../../hooks/useGamification';

interface ToastItem {
  id: number;
  type: 'xp' | 'badge';
  message: string;
  amount?: number;
  visible: boolean;
}

let toastId = 0;

const XPToast: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((type: 'xp' | 'badge', message: string, amount?: number) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, type, message, amount, visible: true }]);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: false } : t));
    }, 2500);
    
    // Remove from DOM after animation
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  useXPNotifications(useCallback((event: XPGainEvent) => {
    addToast('xp', event.label, event.amount);
  }, [addToast]));

  useBadgeNotifications(useCallback((event: BadgeUnlockEvent) => {
    addToast('badge', `Badge desbloqueada: ${event.badgeName}`, event.xpReward);
  }, [addToast]));

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 ${
            toast.visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          } ${
            toast.type === 'badge'
              ? 'bg-amber-500/90 border-amber-400/50 text-white'
              : 'bg-teal-500/90 border-teal-400/50 text-white'
          }`}
        >
          {toast.type === 'xp' ? (
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15l-2 5l9-11h-7l2-5l-9 11h7z"/>
              </svg>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">{toast.message}</p>
          </div>
          {toast.amount && (
            <span className="text-sm font-extrabold whitespace-nowrap">
              +{toast.amount} XP
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default XPToast;
