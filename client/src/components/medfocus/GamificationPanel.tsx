/**
 * MedFocus — Painel de Gamificação
 * XP, Nível, Streaks, Badges e Progresso
 * Design: Medical Precision — Teal accent
 */
import React, { useState, useEffect } from 'react';
import {
  loadGamification, saveGamification, GamificationState, Badge,
  LEVEL_TITLES, xpProgress, xpForNextLevel, XP_PER_LEVEL, XP_ACTIONS, addXP
} from '../../data/gamification';

type Tab = 'overview' | 'badges' | 'history';

const GamificationPanel: React.FC = () => {
  const [state, setState] = useState<GamificationState>(loadGamification());
  const [tab, setTab] = useState<Tab>('overview');
  const [badgeFilter, setBadgeFilter] = useState<string>('all');

  useEffect(() => {
    // Check daily login XP
    const today = new Date().toISOString().split('T')[0];
    if (state.lastStudyDate !== today) {
      const updated = addXP(state, XP_ACTIONS.DAILY_LOGIN, 'daily_login');
      setState(updated);
      saveGamification(updated);
    }
  }, []);

  // Refresh state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setState(loadGamification());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const progress = xpProgress(state.xp, state.level);
  const nextLevelXp = xpForNextLevel(state.level);
  const currentLevelXp = XP_PER_LEVEL[state.level - 1] || 0;
  const title = LEVEL_TITLES[Math.min(state.level, 20)] || 'Hipócrates';

  const unlockedBadges = state.badges.filter(b => b.unlocked);
  const lockedBadges = state.badges.filter(b => !b.unlocked);
  const filteredBadges = badgeFilter === 'all' ? state.badges :
    badgeFilter === 'unlocked' ? unlockedBadges : lockedBadges;

  // Last 7 days XP
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    return { date: key, day: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''), xp: state.dailyXpLog[key] || 0 };
  });
  const maxDailyXp = Math.max(...last7Days.map(d => d.xp), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Level Card */}
        <div className="col-span-2 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-primary"
                  strokeDasharray={`${progress * 264} 264`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-display font-bold text-primary">{state.level}</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary/60 uppercase tracking-wider">Nível {state.level}</p>
              <h3 className="text-lg font-display font-bold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{state.xp - currentLevelXp} / {nextLevelXp - currentLevelXp} XP para o próximo nível</p>
              <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0 .9.448 1.716 1.163 2.2"/></svg>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Streak</span>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{state.streak}</p>
          <p className="text-[10px] text-muted-foreground mt-1">dias seguidos (recorde: {state.longestStreak})</p>
        </div>

        {/* Total XP */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">XP Total</span>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{state.xp.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{unlockedBadges.length}/{state.badges.length} badges</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-fit">
        {([['overview', 'Visão Geral'], ['badges', 'Badges'], ['history', 'Histórico']] as [Tab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${tab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>{label}</button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Weekly XP Chart */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-bold text-foreground mb-4">XP nos últimos 7 dias</h3>
            <div className="flex items-end gap-2 h-32">
              {last7Days.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-bold text-muted-foreground">{d.xp > 0 ? d.xp : ''}</span>
                  <div className="w-full rounded-t-md bg-primary/20 relative overflow-hidden" style={{ height: `${Math.max((d.xp / maxDailyXp) * 100, 4)}%` }}>
                    <div className="absolute inset-0 bg-primary rounded-t-md" style={{ opacity: d.xp > 0 ? 1 : 0.2 }} />
                  </div>
                  <span className="text-[9px] text-muted-foreground capitalize">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Minutos Estudados', value: state.totalStudyMinutes, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { label: 'Quizzes Completos', value: state.totalQuizzes, icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907' },
              { label: 'Respostas Corretas', value: state.totalCorrectAnswers, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { label: 'Flashcards Revisados', value: state.totalFlashcardsReviewed, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2' },
            ].map((stat, i) => (
              <div key={i} className="bg-muted/30 rounded-xl p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-muted-foreground mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d={stat.icon}/></svg>
                <p className="text-xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* XP Actions Reference */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-bold text-foreground mb-3">Como ganhar XP</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { action: 'Completar Pomodoro', xp: XP_ACTIONS.COMPLETE_POMODORO },
                { action: 'Completar Quiz', xp: XP_ACTIONS.COMPLETE_QUIZ },
                { action: 'Resposta Correta', xp: XP_ACTIONS.CORRECT_ANSWER },
                { action: 'Revisar Flashcard', xp: XP_ACTIONS.REVIEW_FLASHCARD },
                { action: 'Completar Checklist', xp: XP_ACTIONS.COMPLETE_CHECKLIST_ITEM },
                { action: 'Estudar Disciplina', xp: XP_ACTIONS.STUDY_SUBJECT },
                { action: 'Login Diário', xp: XP_ACTIONS.DAILY_LOGIN },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-lg">
                  <span className="text-xs text-muted-foreground">{item.action}</span>
                  <span className="text-xs font-bold text-primary">+{item.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Badges Tab */}
      {tab === 'badges' && (
        <div className="space-y-4">
          <div className="flex gap-1.5">
            {['all', 'unlocked', 'locked'].map(f => (
              <button key={f} onClick={() => setBadgeFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${badgeFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {f === 'all' ? 'Todos' : f === 'unlocked' ? `Desbloqueados (${unlockedBadges.length})` : `Bloqueados (${lockedBadges.length})`}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredBadges.map(badge => (
              <div key={badge.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${badge.unlocked ? 'bg-card border-primary/20' : 'bg-muted/20 border-border opacity-60'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${badge.unlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${badge.unlocked ? 'text-primary' : 'text-muted-foreground'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d={badge.icon}/></svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-foreground">{badge.name}</h4>
                    {badge.unlocked && <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">+{badge.xpReward} XP</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{badge.description}</p>
                  {badge.unlocked && badge.unlockedAt && (
                    <p className="text-[9px] text-primary/60 mt-1">Desbloqueado em {new Date(badge.unlockedAt).toLocaleDateString('pt-BR')}</p>
                  )}
                  {!badge.unlocked && (
                    <p className="text-[9px] text-muted-foreground/60 mt-1">Requisito: {badge.requirement}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {tab === 'history' && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-bold text-foreground mb-4">Histórico de XP por Dia</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {Object.entries(state.dailyXpLog)
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 30)
              .map(([date, xp]) => (
                <div key={date} className="flex items-center justify-between px-4 py-3 bg-muted/30 rounded-xl">
                  <span className="text-sm text-foreground font-medium">{new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                  <span className="text-sm font-bold text-primary">+{xp} XP</span>
                </div>
              ))}
            {Object.keys(state.dailyXpLog).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum registro ainda. Comece a estudar para acumular XP!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GamificationPanel;
