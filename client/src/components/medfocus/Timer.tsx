
import React, { useState, useEffect, useRef } from 'react';

interface TimerSettings {
  pomodoro: number;
  short: number;
  long: number;
}

const Timer: React.FC = () => {
  const [settings, setSettings] = useState<TimerSettings>({
    pomodoro: 25,
    short: 5,
    long: 15
  });
  
  const [mode, setMode] = useState<'pomodoro' | 'short' | 'long'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const timerRef = useRef<number | null>(null);

  // Sincroniza o tempo restante quando as configurações ou o modo mudam
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(settings[mode] * 60);
    }
  }, [settings, mode]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      // Notificação básica do navegador
      if (Notification.permission === "granted") {
        new Notification("MedFocus: Ciclo Concluído!", { body: "Hora de descansar ou voltar ao foco." });
      }
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = (newMode: 'pomodoro' | 'short' | 'long' = mode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(settings[newMode] * 60);
  };

  const updateSetting = (key: keyof TimerSettings, value: number) => {
    const newVal = Math.max(1, Math.min(120, value)); // Limita entre 1 e 120 min
    setSettings(prev => ({ ...prev, [key]: newVal }));
  };

  // Cálculo da circunferência do círculo (2 * PI * r)
  // Com r=110, circ = 691.15
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / (settings[mode] * 60);
  const offset = circumference - (progress * circumference);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">Sessão de Foco Profundo</h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">Ajuste seu ciclo de produtividade</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[48px] shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full max-w-lg transition-colors">
        
        {/* Seleção de Modo */}
        <div className="flex gap-2 mb-10 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 w-full max-w-xs">
          {(['pomodoro', 'short', 'long'] as const).map(m => (
            <button
              key={m}
              onClick={() => resetTimer(m)}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                mode === m 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-700 dark:text-indigo-400' 
                : 'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              {m === 'pomodoro' ? 'Foco' : m === 'short' ? 'Pausa' : 'Longa'}
            </button>
          ))}
        </div>

        {/* Círculo de Progresso */}
        <div className="relative mb-10 group cursor-pointer" onClick={toggleTimer}>
          <svg width="260" height="260" viewBox="0 0 260 260" className="-rotate-90 drop-shadow-2xl">
            {/* Fundo do Círculo */}
            <circle
              cx="130"
              cy="130"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-100 dark:text-slate-800 transition-colors"
            />
            {/* Progresso Ativo */}
            <circle
              cx="130"
              cy="130"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="text-indigo-600 dark:text-indigo-500 transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-5xl font-black tracking-tighter text-black dark:text-white font-mono">
              {formatTime(timeLeft)}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] mt-2 ${isActive ? 'text-indigo-500 animate-pulse' : 'text-slate-400'}`}>
              {isActive ? 'Focando' : 'Pausado'}
            </span>
          </div>
        </div>

        {/* Controles Principais */}
        <div className="flex gap-4 w-full">
          <button 
            onClick={toggleTimer}
            className={`flex-1 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${
              isActive 
                ? 'bg-slate-950 text-white shadow-slate-200 dark:shadow-none' 
                : 'bg-indigo-600 text-white shadow-indigo-200 dark:shadow-none hover:bg-indigo-700'
            }`}
          >
            {isActive ? 'Interromper' : 'Iniciar Ciclo'}
          </button>
          
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-5 rounded-[24px] border-2 transition-all active:rotate-45 ${
              showSettings 
              ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
              : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500 hover:border-slate-200 dark:hover:border-slate-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>

        {/* Painel de Configurações Personalizáveis */}
        {showSettings && (
          <div className="mt-8 w-full space-y-4 pt-8 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-4 duration-300">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-4">Ajuste de Intervalos (min)</h4>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(settings) as Array<keyof TimerSettings>).map(key => (
                <div key={key} className="space-y-2">
                  <label className="block text-[9px] font-black text-slate-500 uppercase text-center">{key === 'pomodoro' ? 'Foco' : key === 'short' ? 'Pausa' : 'Longa'}</label>
                  <input 
                    type="number"
                    value={settings[key]}
                    onChange={(e) => updateSetting(key, parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-center py-3 rounded-xl font-bold text-sm border-2 border-transparent focus:border-indigo-500 outline-none transition-all text-black dark:text-white"
                  />
                </div>
              ))}
            </div>
            <p className="text-[9px] text-slate-400 text-center font-bold mt-4 uppercase">As alterações serão aplicadas no próximo ciclo.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 p-5 rounded-[24px]">
          <p className="text-[9px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-2">Neurociência</p>
          <p className="text-xs text-emerald-950 dark:text-emerald-200/80 font-bold leading-relaxed">Ciclos de foco intenso intercalados com pausas curtas otimizam a consolidação da memória de longo prazo.</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 p-5 rounded-[24px]">
          <p className="text-[9px] font-black text-indigo-800 dark:text-indigo-400 uppercase tracking-widest mb-2">Estado Atual</p>
          <p className="text-xs text-indigo-950 dark:text-indigo-200/80 font-bold leading-relaxed">Você está no modo {mode === 'pomodoro' ? 'estudo profundo' : 'recuperação cognitiva'}. Mantenha-se hidratado.</p>
        </div>
      </div>
    </div>
  );
};

export default Timer;
