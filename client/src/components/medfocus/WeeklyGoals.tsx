/**
 * WeeklyGoals — Sistema de Metas Semanais
 * Definir metas (questões, pomodoro, flashcards, simulados)
 * Acompanhar progresso com barras visuais e alertas de cumprimento
 */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Target, Plus, Trash2, CheckCircle2, Trophy, Flame,
  BookOpen, Clock, Brain, FileText, Sparkles, TrendingUp,
  AlertCircle, ChevronLeft, ChevronRight
} from 'lucide-react';

// ─── Goal Types ───────────────────────────────────────────────
const GOAL_TYPES = [
  { id: 'questions' as const, name: 'Questões Respondidas', icon: FileText, unit: 'questões', color: 'text-blue-500', bgColor: 'bg-blue-500', presets: [25, 50, 100, 200] },
  { id: 'pomodoro_hours' as const, name: 'Horas de Pomodoro', icon: Clock, unit: 'horas', color: 'text-red-500', bgColor: 'bg-red-500', presets: [3, 5, 10, 20] },
  { id: 'study_hours' as const, name: 'Horas de Estudo', icon: BookOpen, unit: 'horas', color: 'text-green-500', bgColor: 'bg-green-500', presets: [5, 10, 15, 25] },
  { id: 'flashcards' as const, name: 'Flashcards Revisados', icon: Brain, unit: 'cards', color: 'text-purple-500', bgColor: 'bg-purple-500', presets: [30, 50, 100, 200] },
  { id: 'simulados' as const, name: 'Simulados Completos', icon: Target, unit: 'simulados', color: 'text-orange-500', bgColor: 'bg-orange-500', presets: [1, 2, 3, 5] },
];

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

function getWeekLabel(weekStart: string): string {
  const start = new Date(weekStart + 'T00:00:00');
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}`;
  return `${fmt(start)} — ${fmt(end)}`;
}

export default function WeeklyGoals() {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedGoalType, setSelectedGoalType] = useState<typeof GOAL_TYPES[number] | null>(null);
  const [targetValue, setTargetValue] = useState(0);

  const weekStart = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + currentWeekOffset * 7);
    return getWeekStart(d);
  }, [currentWeekOffset]);

  const goalsQuery = trpc.goals.list.useQuery({ weekStart }, { retry: false });
  const createGoal = trpc.goals.create.useMutation({
    onSuccess: () => {
      goalsQuery.refetch();
      setShowAddGoal(false);
      setSelectedGoalType(null);
      setTargetValue(0);
      toast.success('Meta criada!');
    },
  });
  const deleteGoal = trpc.goals.delete.useMutation({
    onSuccess: () => {
      goalsQuery.refetch();
      toast.success('Meta removida');
    },
  });

  const { sendGoalAlert, settings: notifSettings, permission: notifPermission } = useNotifications();
  const alertSentRef = useRef<string>(''); // track which week we already alerted

  const goals = goalsQuery.data || [];
  const completedCount = goals.filter(g => g.completed).length;
  const totalCount = goals.length;
  const overallProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isCurrentWeek = currentWeekOffset === 0;

  // ─── Mid-week goal alert (Wednesday check) ────────────────
  useEffect(() => {
    if (!isCurrentWeek || goals.length === 0) return;
    if (notifPermission !== 'granted' || !notifSettings.goalAlertEnabled) return;

    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun, 3=Wed
    // Only fire on Wednesday (3) or later in the week
    if (dayOfWeek < 3) return;

    // Prevent duplicate alerts for the same week
    const alertKey = `goal_alert_${weekStart}`;
    if (alertSentRef.current === alertKey) return;

    const belowThreshold = goals.filter(g => {
      if (g.completed) return false;
      const pct = g.targetValue > 0 ? Math.round((g.currentValue / g.targetValue) * 100) : 0;
      return pct < 50;
    });

    if (belowThreshold.length > 0) {
      alertSentRef.current = alertKey;
      // Also persist in localStorage to avoid re-alerting on page refresh
      const storageKey = `medfocus_${alertKey}`;
      if (localStorage.getItem(storageKey)) return;
      localStorage.setItem(storageKey, 'sent');

      belowThreshold.forEach(g => {
        const goalType = GOAL_TYPES.find(gt => gt.id === g.goalType);
        const pct = g.targetValue > 0 ? Math.round((g.currentValue / g.targetValue) * 100) : 0;
        sendGoalAlert(goalType?.name || g.goalType, pct, g.targetValue);
      });
    }
  }, [goals, isCurrentWeek, weekStart, notifPermission, notifSettings.goalAlertEnabled, sendGoalAlert]);

  const handleCreateGoal = () => {
    if (!selectedGoalType || targetValue <= 0) return;
    createGoal.mutate({ weekStart, goalType: selectedGoalType.id, targetValue });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display flex items-center gap-2">
            <Target className="w-7 h-7 text-primary" />
            Metas Semanais
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Defina e acompanhe suas metas de estudo semanais
          </p>
        </div>
        {isCurrentWeek && (
          <Button onClick={() => setShowAddGoal(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Nova Meta
          </Button>
        )}
      </div>

      {/* Mid-week Warning Banner */}
      {isCurrentWeek && new Date().getDay() >= 3 && goals.some(g => !g.completed && g.targetValue > 0 && Math.round((g.currentValue / g.targetValue) * 100) < 50) && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="font-bold text-sm text-amber-700 dark:text-amber-400">Metas em risco!</p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/70">
                  Já estamos na metade da semana e algumas metas estão abaixo de 50%. Foque nos estudos para recuperar!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Week Navigator */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setCurrentWeekOffset(prev => prev - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-center">
              <p className="font-bold text-lg">{getWeekLabel(weekStart)}</p>
              <p className="text-xs text-muted-foreground">
                {isCurrentWeek ? 'Semana Atual' : currentWeekOffset > 0 ? 'Próxima Semana' : 'Semana Anterior'}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setCurrentWeekOffset(prev => prev + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          {totalCount > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progresso Geral</span>
                <span className="font-bold">{completedCount}/{totalCount} metas ({overallProgress}%)</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${overallProgress === 100 ? 'bg-green-500' : overallProgress >= 50 ? 'bg-yellow-500' : 'bg-primary'}`}
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Goal Dialog */}
      {showAddGoal && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg">Nova Meta Semanal</CardTitle>
            <CardDescription>Escolha o tipo de meta e defina o valor alvo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedGoalType ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {GOAL_TYPES.filter(gt => !goals.some(g => g.goalType === gt.id)).map(gt => (
                  <button
                    key={gt.id}
                    onClick={() => { setSelectedGoalType(gt); setTargetValue(gt.presets[1]); }}
                    className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                  >
                    <gt.icon className={`w-6 h-6 ${gt.color} mb-2`} />
                    <p className="font-medium text-sm">{gt.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">Meta em {gt.unit}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <selectedGoalType.icon className={`w-6 h-6 ${selectedGoalType.color}`} />
                  <div>
                    <p className="font-bold">{selectedGoalType.name}</p>
                    <p className="text-xs text-muted-foreground">Defina quantos(as) {selectedGoalType.unit} por semana</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedGoalType.presets.map(preset => (
                    <button
                      key={preset}
                      onClick={() => setTargetValue(preset)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${targetValue === preset ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/30'}`}
                    >
                      {preset} {selectedGoalType.unit}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Personalizado:</span>
                  <input
                    type="number"
                    value={targetValue}
                    onChange={e => setTargetValue(parseInt(e.target.value) || 0)}
                    min={1}
                    className="w-24 px-3 py-1.5 rounded-lg border border-border bg-background text-sm"
                  />
                  <span className="text-sm text-muted-foreground">{selectedGoalType.unit}</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateGoal} disabled={targetValue <= 0 || createGoal.isPending} className="gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Criar Meta
                  </Button>
                  <Button variant="outline" onClick={() => { setShowAddGoal(false); setSelectedGoalType(null); }}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Goals List */}
      {goals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma meta definida para esta semana</p>
            {isCurrentWeek && (
              <Button variant="outline" className="mt-4 gap-2" onClick={() => setShowAddGoal(true)}>
                <Plus className="w-4 h-4" /> Definir Metas
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map(goal => {
            const goalType = GOAL_TYPES.find(gt => gt.id === goal.goalType);
            if (!goalType) return null;
            const pct = goal.targetValue > 0 ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)) : 0;
            const Icon = goalType.icon;

            return (
              <Card key={goal.id} className={`transition-all ${goal.completed ? 'border-green-500/30 bg-green-500/5' : ''}`}>
                <CardContent className="py-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${goal.completed ? 'bg-green-500/10' : 'bg-muted'}`}>
                        {goal.completed ? (
                          <Trophy className="w-5 h-5 text-green-500" />
                        ) : (
                          <Icon className={`w-5 h-5 ${goalType.color}`} />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{goalType.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {goal.currentValue} / {goal.targetValue} {goalType.unit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {goal.completed && (
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Concluída
                        </Badge>
                      )}
                      {isCurrentWeek && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteGoal.mutate({ goalId: goal.id })}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className={`font-bold ${goal.completed ? 'text-green-500' : ''}`}>{pct}%</span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${goal.completed ? 'bg-green-500' : pct >= 75 ? 'bg-yellow-500' : goalType.bgColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  {!goal.completed && pct >= 75 && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-yellow-600">
                      <Flame className="w-3.5 h-3.5" />
                      <span>Quase lá! Faltam {goal.targetValue - goal.currentValue} {goalType.unit}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Weekly Summary */}
      {totalCount > 0 && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="py-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Resumo da Semana</h3>
                <p className="text-sm text-muted-foreground">
                  {completedCount === totalCount
                    ? '🎉 Todas as metas concluídas! Parabéns!'
                    : `${completedCount} de ${totalCount} metas concluídas. Continue focado!`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
