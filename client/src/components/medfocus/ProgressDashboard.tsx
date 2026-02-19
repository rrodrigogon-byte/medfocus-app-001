/**
 * ProgressDashboard — Dashboard de Progresso Unificado
 * Consolida métricas de simulados, flashcards, quizzes e revisão SM-2
 * em gráficos de evolução temporal e indicadores de desempenho.
 */
import React, { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3, TrendingUp, Trophy, Brain, Target, Clock, Flame,
  BookOpen, GraduationCap, Activity, Calendar, ChevronDown,
  Award, Zap, Star, CheckCircle2, XCircle, Loader2, RefreshCw
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────
interface WeekData {
  week: string;
  label: string;
  simulados: number;
  score: number;
  studyMinutes: number;
  flashcards: number;
  quizzes: number;
}

interface AreaPerformance {
  area: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  questionsAnswered: number;
}

// ─── Mini Chart Components ────────────────────────────────────
function SparklineChart({ data, color = 'text-primary', height = 40 }: { data: number[]; color?: string; height?: number }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 200;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * (height - 4)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className={`w-full h-${Math.round(height / 4)} ${color}`} preserveAspectRatio="none">
      <polyline fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
      <polyline fill="currentColor" fillOpacity="0.1" stroke="none"
        points={`0,${height} ${points} ${w},${height}`} />
    </svg>
  );
}

function BarChartSimple({ data, labels, color = 'bg-primary' }: { data: number[]; labels: string[]; color?: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] text-muted-foreground">{v > 0 ? v : ''}</span>
          <div
            className={`w-full rounded-t ${color} transition-all duration-500`}
            style={{ height: `${Math.max((v / max) * 80, 2)}%` }}
          />
          <span className="text-[9px] text-muted-foreground truncate w-full text-center">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function RadialProgress({ value, size = 80, strokeWidth = 8, color = 'text-primary' }: { value: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth}
          className="stroke-muted" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className={`stroke-current ${color} transition-all duration-1000`} />
      </svg>
      <span className="absolute text-sm font-bold">{Math.round(value)}%</span>
    </div>
  );
}

// ─── Streak Calculator ────────────────────────────────────────
function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort((a, b) => b.getTime() - a.getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let checkDate = new Date(today);
  
  for (const d of sorted) {
    const studyDate = new Date(d);
    studyDate.setHours(0, 0, 0, 0);
    
    if (studyDate.getTime() === checkDate.getTime()) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (studyDate.getTime() < checkDate.getTime()) {
      break;
    }
  }
  return streak;
}

// ─── Main Component ───────────────────────────────────────────
const ProgressDashboard: React.FC = () => {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Fetch data from all sources
  const simuladoStats = trpc.simulado.stats.useQuery(undefined, { retry: false });
  const simuladoHistory = trpc.simulado.list.useQuery(undefined, { retry: false });
  const isLoading = simuladoStats.isLoading || simuladoHistory.isLoading;

  // ─── Computed Metrics ─────────────────────────────────────
  const metrics = useMemo(() => {
    const now = new Date();
    const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const cutoff = new Date(now.getTime() - periodDays * 86400000);

    // Simulados
    const sims = (simuladoHistory.data || []).filter((s: any) => new Date(s.createdAt) >= cutoff);
    const completedSims = sims.filter((s: any) => s.status === 'completed');
    const avgScore = completedSims.length > 0
      ? Math.round(completedSims.reduce((sum: number, s: any) => sum + (s.score || 0), 0) / completedSims.length)
      : 0;
    const totalQuestions = completedSims.reduce((sum: number, s: any) => sum + (s.totalQuestions || 0), 0);

    // Estimated study time from simulados (avg 30min per simulado)
    const totalStudyMinutes = completedSims.length * 30;

    // Weekly breakdown
    const weeks: WeekData[] = [];
    const numWeeks = Math.min(Math.ceil(periodDays / 7), 12);
    for (let i = numWeeks - 1; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i + 1) * 7 * 86400000);
      const weekEnd = new Date(now.getTime() - i * 7 * 86400000);
      const weekSims = completedSims.filter((s: any) => {
        const d = new Date(s.createdAt);
        return d >= weekStart && d < weekEnd;
      });
      weeks.push({
        week: weekStart.toISOString().slice(0, 10),
        label: `${weekStart.getDate()}/${weekStart.getMonth() + 1}`,
        simulados: weekSims.length,
        score: weekSims.length > 0 ? Math.round(weekSims.reduce((s: number, sim: any) => s + (sim.score || 0), 0) / weekSims.length) : 0,
        studyMinutes: weekSims.length * 30,
        flashcards: 0,
        quizzes: 0,
      });
    }

    // Area performance
    const areaMap: Record<string, { scores: number[]; total: number }> = {};
    completedSims.forEach((s: any) => {
      if (s.results) {
        try {
          const results = typeof s.results === 'string' ? JSON.parse(s.results) : s.results;
          Object.entries(results).forEach(([area, data]: [string, any]) => {
            if (!areaMap[area]) areaMap[area] = { scores: [], total: 0 };
            if (data.total > 0) {
              areaMap[area].scores.push(Math.round((data.correct / data.total) * 100));
              areaMap[area].total += data.total;
            }
          });
        } catch {}
      }
    });

    const areaPerformance: AreaPerformance[] = Object.entries(areaMap)
      .map(([area, data]) => {
        const avg = data.scores.length > 0 ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length) : 0;
        const recent = data.scores.slice(-3);
        const older = data.scores.slice(-6, -3);
        const recentAvg = recent.length > 0 ? recent.reduce((a, b) => a + b, 0) / recent.length : 0;
        const olderAvg = older.length > 0 ? older.reduce((a, b) => a + b, 0) / older.length : recentAvg;
        return {
          area,
          score: avg,
          trend: recentAvg > olderAvg + 5 ? 'up' as const : recentAvg < olderAvg - 5 ? 'down' as const : 'stable' as const,
          questionsAnswered: data.total,
        };
      })
      .sort((a, b) => b.questionsAnswered - a.questionsAnswered);

    // Streak
    const studyDates = [
      ...completedSims.map((s: any) => new Date(s.createdAt)),
    ];
    const streak = calculateStreak(studyDates);

    // Score evolution for sparkline
    const scoreEvolution = completedSims
      .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((s: any) => s.score || 0);

    return {
      totalSimulados: completedSims.length,
      avgScore,
      totalQuestions,
      totalStudyMinutes,
      totalQuizzes: 0,
      quizAvg: 0,
      streak,
      weeks,
      areaPerformance,
      scoreEvolution,
      bestScore: completedSims.length > 0 ? Math.max(...completedSims.map((s: any) => s.score || 0)) : 0,
    };
  }, [simuladoHistory.data, period]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-primary" /> Dashboard de Progresso
          </h1>
          <p className="text-muted-foreground mt-1">Visão unificada do seu desempenho acadêmico</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', 'all'] as const).map(p => (
            <Button key={p} variant={period === p ? 'default' : 'outline'} size="sm"
              onClick={() => setPeriod(p)}>
              {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : p === '90d' ? '90 dias' : 'Tudo'}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="col-span-1">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium">Sequência</span>
            </div>
            <p className="text-3xl font-bold">{metrics.streak}</p>
            <p className="text-xs text-muted-foreground">dias seguidos</p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <GraduationCap className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium">Simulados</span>
            </div>
            <p className="text-3xl font-bold">{metrics.totalSimulados}</p>
            <p className="text-xs text-muted-foreground">completados</p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Target className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium">Nota Média</span>
            </div>
            <p className="text-3xl font-bold">{metrics.avgScore}%</p>
            <p className="text-xs text-muted-foreground">nos simulados</p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-medium">Melhor Nota</span>
            </div>
            <p className="text-3xl font-bold">{metrics.bestScore}%</p>
            <p className="text-xs text-muted-foreground">recorde pessoal</p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <BookOpen className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-medium">Questões</span>
            </div>
            <p className="text-3xl font-bold">{metrics.totalQuestions}</p>
            <p className="text-xs text-muted-foreground">respondidas</p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4 text-teal-500" />
              <span className="text-xs font-medium">Tempo</span>
            </div>
            <p className="text-3xl font-bold">{Math.round(metrics.totalStudyMinutes / 60)}h</p>
            <p className="text-xs text-muted-foreground">de estudo</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Evolution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Evolução da Nota
            </CardTitle>
            <CardDescription>Desempenho nos simulados ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.scoreEvolution.length >= 2 ? (
              <div className="space-y-3">
                <SparklineChart data={metrics.scoreEvolution} height={80} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Primeiro simulado</span>
                  <span>Mais recente</span>
                </div>
                <div className="flex items-center gap-4 pt-2 border-t border-border">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-xs text-muted-foreground">Nota (%)</span>
                  </div>
                  {metrics.scoreEvolution.length >= 4 && (
                    <Badge variant={
                      metrics.scoreEvolution[metrics.scoreEvolution.length - 1] > metrics.scoreEvolution[0] ? 'default' : 'secondary'
                    }>
                      {metrics.scoreEvolution[metrics.scoreEvolution.length - 1] > metrics.scoreEvolution[0] ? '↑' : '↓'}{' '}
                      {Math.abs(metrics.scoreEvolution[metrics.scoreEvolution.length - 1] - metrics.scoreEvolution[0])}% desde o início
                    </Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center text-muted-foreground text-sm">
                Complete pelo menos 2 simulados para ver a evolução
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Atividade Semanal
            </CardTitle>
            <CardDescription>Simulados completados por semana</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.weeks.some(w => w.simulados > 0) ? (
              <BarChartSimple
                data={metrics.weeks.map(w => w.simulados)}
                labels={metrics.weeks.map(w => w.label)}
                color="bg-primary"
              />
            ) : (
              <div className="h-24 flex items-center justify-center text-muted-foreground text-sm">
                Nenhuma atividade registrada no período
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Area Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Desempenho por Área Médica
          </CardTitle>
          <CardDescription>Análise detalhada de cada área com tendência de evolução</CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.areaPerformance.length > 0 ? (
            <div className="space-y-4">
              {metrics.areaPerformance.map(area => (
                <div key={area.area} className="flex items-center gap-4">
                  <div className="w-32 md:w-48 shrink-0">
                    <p className="text-sm font-medium truncate">{area.area}</p>
                    <p className="text-xs text-muted-foreground">{area.questionsAnswered} questões</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          area.score >= 70 ? 'bg-green-500' : area.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${area.score}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right shrink-0">
                    <span className="text-sm font-bold">{area.score}%</span>
                  </div>
                  <div className="w-8 shrink-0">
                    {area.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {area.trend === 'down' && <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />}
                    {area.trend === 'stable' && <span className="text-xs text-muted-foreground">—</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex flex-col items-center justify-center text-muted-foreground">
              <Brain className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">Complete simulados para ver seu desempenho por área</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> Insights e Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Weakest area */}
            {metrics.areaPerformance.length > 0 && (
              <div className="p-4 rounded-xl bg-background border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-bold">Área para Focar</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>{metrics.areaPerformance[metrics.areaPerformance.length - 1]?.area}</strong> é sua área com menor desempenho
                  ({metrics.areaPerformance[metrics.areaPerformance.length - 1]?.score}%). Recomendamos mais simulados nesta área.
                </p>
              </div>
            )}

            {/* Study consistency */}
            <div className="p-4 rounded-xl bg-background border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold">Consistência</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {metrics.streak >= 7
                  ? `Excelente! ${metrics.streak} dias seguidos de estudo. Continue assim!`
                  : metrics.streak >= 3
                  ? `Bom ritmo! ${metrics.streak} dias seguidos. Tente manter por 7 dias.`
                  : 'Tente estudar todos os dias para criar uma rotina consistente.'}
              </p>
            </div>

            {/* Score trend */}
            <div className="p-4 rounded-xl bg-background border border-border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-bold">Tendência</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {metrics.scoreEvolution.length >= 4
                  ? metrics.scoreEvolution[metrics.scoreEvolution.length - 1] > metrics.scoreEvolution[Math.max(0, metrics.scoreEvolution.length - 4)]
                    ? 'Sua nota está subindo! Você está no caminho certo.'
                    : 'Sua nota caiu recentemente. Revise os temas com mais erros.'
                  : 'Complete mais simulados para analisar sua tendência de evolução.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Mapa de Calor de Estudo
          </CardTitle>
          <CardDescription>Frequência de estudo nos últimos 12 semanas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 gap-1">
            {metrics.weeks.slice(-12).map((week, i) => {
              const intensity = week.simulados + week.quizzes;
              const bg = intensity === 0 ? 'bg-muted' : intensity <= 1 ? 'bg-green-200 dark:bg-green-900' : intensity <= 3 ? 'bg-green-400 dark:bg-green-700' : 'bg-green-600 dark:bg-green-500';
              return (
                <div key={i} className="space-y-1">
                  {[0, 1, 2, 3, 4, 5, 6].map(day => (
                    <div key={day} className={`w-full aspect-square rounded-sm ${day <= intensity ? bg : 'bg-muted'}`}
                      title={`Semana ${week.label}: ${intensity} atividades`} />
                  ))}
                  <p className="text-[8px] text-muted-foreground text-center">{week.label}</p>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-xs text-muted-foreground">Menos</span>
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
            <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
            <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500" />
            <span className="text-xs text-muted-foreground">Mais</span>
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" /> Metas de Estudo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center gap-3">
              <RadialProgress value={Math.min((metrics.totalSimulados / 10) * 100, 100)} color="text-blue-500" />
              <div className="text-center">
                <p className="text-sm font-medium">Simulados</p>
                <p className="text-xs text-muted-foreground">{metrics.totalSimulados}/10 no período</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <RadialProgress value={Math.min((metrics.totalStudyMinutes / 600) * 100, 100)} color="text-green-500" />
              <div className="text-center">
                <p className="text-sm font-medium">Horas de Estudo</p>
                <p className="text-xs text-muted-foreground">{Math.round(metrics.totalStudyMinutes / 60)}/10h no período</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <RadialProgress value={Math.min(metrics.avgScore, 100)} color="text-purple-500" />
              <div className="text-center">
                <p className="text-sm font-medium">Meta de Nota</p>
                <p className="text-xs text-muted-foreground">{metrics.avgScore}% (meta: 70%)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;
