/**
 * MedFocus Pomodoro Timer — Premium Design
 * Focus session timer with circular progress
 */
import React, { useState, useEffect, useRef } from 'react';

interface TimerSettings { pomodoro: number; short: number; long: number; }

const Timer: React.FC = () => {
  const [settings, setSettings] = useState<TimerSettings>({ pomodoro: 25, short: 5, long: 15 });
  const [mode, setMode] = useState<'pomodoro' | 'short' | 'long'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => { if (!isActive) setTimeLeft(settings[mode] * 60); }, [settings, mode]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (Notification.permission === "granted") new Notification("MedFocus: Ciclo Concluído!", { body: "Hora de descansar ou voltar ao foco." });
    } else { if (timerRef.current) clearInterval(timerRef.current); }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = (m: 'pomodoro' | 'short' | 'long' = mode) => { setIsActive(false); setMode(m); setTimeLeft(settings[m] * 60); };
  const updateSetting = (k: keyof TimerSettings, v: number) => setSettings(prev => ({ ...prev, [k]: Math.max(1, Math.min(120, v)) }));

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / (settings[mode] * 60);
  const offset = circumference - (progress * circumference);

  return (
    <div className="flex flex-col items-center space-y-6 py-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-display font-extrabold text-foreground tracking-tight">Sessão de Foco</h2>
        <p className="text-xs text-muted-foreground font-medium mt-0.5">Técnica Pomodoro para estudo profundo</p>
      </div>

      {/* Timer Card */}
      <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center w-full max-w-md">
        {/* Mode Tabs */}
        <div className="flex gap-1 mb-8 p-1 bg-muted/50 rounded-lg border border-border/50 w-full max-w-xs">
          {(['pomodoro', 'short', 'long'] as const).map(m => (
            <button key={m} onClick={() => resetTimer(m)}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                mode === m ? 'bg-card text-primary shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'
              }`}>
              {m === 'pomodoro' ? 'Foco' : m === 'short' ? 'Pausa' : 'Longa'}
            </button>
          ))}
        </div>

        {/* Circular Progress */}
        <div className="relative mb-8 cursor-pointer group" onClick={toggleTimer}>
          <svg width="240" height="240" viewBox="0 0 240 240" className="-rotate-90">
            <circle cx="120" cy="120" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/50" />
            <circle cx="120" cy="120" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent"
              strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
              className="text-primary transition-all duration-1000 ease-linear" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-4xl font-display font-extrabold tracking-tight text-foreground font-mono">{formatTime(timeLeft)}</span>
            <span className={`text-[10px] font-semibold uppercase tracking-wider mt-1 ${isActive ? 'text-primary animate-pulse-soft' : 'text-muted-foreground'}`}>
              {isActive ? 'Focando...' : 'Clique para iniciar'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 w-full">
          <button onClick={toggleTimer}
            className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all active:scale-95 ${
              isActive ? 'bg-foreground text-background' : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}>
            {isActive ? 'Pausar' : 'Iniciar Ciclo'}
          </button>
          <button onClick={() => resetTimer(mode)}
            className="px-4 py-3 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
          </button>
          <button onClick={() => setShowSettings(!showSettings)}
            className={`px-4 py-3 rounded-lg border transition-all ${showSettings ? 'bg-primary/10 border-primary/30 text-primary' : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.1a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-6 w-full space-y-3 pt-6 border-t border-border animate-slide-up">
            <p className="text-xs font-semibold text-muted-foreground text-center">Ajuste de Intervalos (min)</p>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(settings) as Array<keyof TimerSettings>).map(key => (
                <div key={key}>
                  <label className="block text-[10px] font-semibold text-muted-foreground text-center mb-1">{key === 'pomodoro' ? 'Foco' : key === 'short' ? 'Pausa' : 'Longa'}</label>
                  <input type="number" value={settings[key]} onChange={(e) => updateSetting(key, parseInt(e.target.value) || 1)}
                    className="w-full bg-muted/50 text-center py-2.5 rounded-lg font-semibold text-sm border border-border focus:border-primary outline-none transition-all text-foreground" />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground text-center">Alterações aplicadas no próximo ciclo</p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
        <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Neurociência</p>
          <p className="text-xs text-foreground/70 font-medium leading-relaxed">Ciclos de foco intercalados com pausas otimizam a memória de longo prazo.</p>
        </div>
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
          <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Estado Atual</p>
          <p className="text-xs text-foreground/70 font-medium leading-relaxed">Modo {mode === 'pomodoro' ? 'estudo profundo' : 'recuperação cognitiva'}. Mantenha-se hidratado.</p>
        </div>
      </div>
    </div>
  );
};

export default Timer;
