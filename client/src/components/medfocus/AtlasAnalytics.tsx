/**
 * MedFocus — Atlas Analytics v1.0
 * Tracking de uso do Atlas para entender quais sistemas são mais acessados
 */
import { useState, useMemo } from 'react';

interface SystemUsage {
  id: string;
  name: string;
  icon: string;
  views: number;
  avgTime: string;
  quizAttempts: number;
  quizAvgScore: number;
  sketchfabViews: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
}

interface DailyUsage {
  date: string;
  views: number;
  uniqueUsers: number;
  quizCompleted: number;
  avgSessionTime: number;
}

const SYSTEM_USAGE: SystemUsage[] = [
  { id: 'cardiovascular', name: 'Cardiovascular', icon: '❤️', views: 4520, avgTime: '12:30', quizAttempts: 890, quizAvgScore: 72, sketchfabViews: 1200, trend: 'up', trendPercent: 15 },
  { id: 'nervous', name: 'Nervoso', icon: '🧠', views: 3890, avgTime: '14:20', quizAttempts: 720, quizAvgScore: 65, sketchfabViews: 980, trend: 'up', trendPercent: 22 },
  { id: 'digestive', name: 'Digestório', icon: '🫄', views: 3210, avgTime: '10:45', quizAttempts: 650, quizAvgScore: 70, sketchfabViews: 750, trend: 'stable', trendPercent: 2 },
  { id: 'respiratory', name: 'Respiratório', icon: '🫁', views: 2980, avgTime: '11:15', quizAttempts: 580, quizAvgScore: 74, sketchfabViews: 680, trend: 'up', trendPercent: 8 },
  { id: 'skeletal', name: 'Musculoesquelético', icon: '🦴', views: 2750, avgTime: '9:30', quizAttempts: 520, quizAvgScore: 68, sketchfabViews: 890, trend: 'up', trendPercent: 12 },
  { id: 'urinary', name: 'Urinário', icon: '💧', views: 2100, avgTime: '8:45', quizAttempts: 410, quizAvgScore: 71, sketchfabViews: 420, trend: 'down', trendPercent: -5 },
  { id: 'endocrine', name: 'Endócrino', icon: '🧪', views: 1980, avgTime: '10:00', quizAttempts: 380, quizAvgScore: 66, sketchfabViews: 350, trend: 'up', trendPercent: 18 },
  { id: 'reproductive_m', name: 'Reprodutor Masc.', icon: '♂️', views: 1650, avgTime: '7:30', quizAttempts: 320, quizAvgScore: 73, sketchfabViews: 280, trend: 'stable', trendPercent: 1 },
  { id: 'reproductive_f', name: 'Reprodutor Fem.', icon: '♀️', views: 1820, avgTime: '8:15', quizAttempts: 350, quizAvgScore: 75, sketchfabViews: 310, trend: 'up', trendPercent: 10 },
  { id: 'lymphatic', name: 'Linfático/Imune', icon: '🛡️', views: 1450, avgTime: '9:00', quizAttempts: 280, quizAvgScore: 64, sketchfabViews: 220, trend: 'up', trendPercent: 25 },
  { id: 'integumentary', name: 'Tegumentar', icon: '🧴', views: 1200, avgTime: '6:30', quizAttempts: 240, quizAvgScore: 78, sketchfabViews: 380, trend: 'stable', trendPercent: 0 },
  { id: 'sensory', name: 'Órgãos dos Sentidos', icon: '👁️', views: 1100, avgTime: '7:00', quizAttempts: 210, quizAvgScore: 69, sketchfabViews: 190, trend: 'down', trendPercent: -3 },
];

const DAILY_USAGE: DailyUsage[] = [
  { date: '2026-02-19', views: 1250, uniqueUsers: 320, quizCompleted: 85, avgSessionTime: 18 },
  { date: '2026-02-20', views: 1380, uniqueUsers: 345, quizCompleted: 92, avgSessionTime: 20 },
  { date: '2026-02-21', views: 1520, uniqueUsers: 380, quizCompleted: 105, avgSessionTime: 22 },
  { date: '2026-02-22', views: 890, uniqueUsers: 220, quizCompleted: 55, avgSessionTime: 15 },
  { date: '2026-02-23', views: 780, uniqueUsers: 195, quizCompleted: 48, avgSessionTime: 14 },
  { date: '2026-02-24', views: 1450, uniqueUsers: 360, quizCompleted: 98, avgSessionTime: 21 },
  { date: '2026-02-25', views: 1600, uniqueUsers: 400, quizCompleted: 110, avgSessionTime: 23 },
];

const FEATURE_USAGE = [
  { name: 'Explorar Sistemas', usage: 42, color: '#3B82F6' },
  { name: 'Dissecção por Camadas', usage: 25, color: '#EF4444' },
  { name: 'Modelos SketchFab', usage: 18, color: '#8B5CF6' },
  { name: 'Quiz Adaptativo', usage: 10, color: '#10B981' },
  { name: 'Animações Fisiológicas', usage: 5, color: '#F59E0B' },
];

export default function AtlasAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [sortBy, setSortBy] = useState<'views' | 'quiz' | 'time'>('views');

  const sortedSystems = useMemo(() => {
    const s = [...SYSTEM_USAGE];
    if (sortBy === 'views') s.sort((a, b) => b.views - a.views);
    if (sortBy === 'quiz') s.sort((a, b) => b.quizAvgScore - a.quizAvgScore);
    if (sortBy === 'time') s.sort((a, b) => parseInt(b.avgTime) - parseInt(a.avgTime));
    return s;
  }, [sortBy]);

  const totalViews = SYSTEM_USAGE.reduce((s, u) => s + u.views, 0);
  const totalQuiz = SYSTEM_USAGE.reduce((s, u) => s + u.quizAttempts, 0);
  const avgScore = Math.round(SYSTEM_USAGE.reduce((s, u) => s + u.quizAvgScore, 0) / SYSTEM_USAGE.length);
  const maxViews = Math.max(...SYSTEM_USAGE.map(s => s.views));

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">📊</span> Atlas Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Métricas de uso do Atlas de Anatomia 3D — Entenda quais sistemas são mais acessados</p>
      </div>

      {/* Time range selector */}
      <div className="flex gap-2 mb-6">
        {(['7d', '30d', '90d'] as const).map(range => (
          <button key={range} onClick={() => setTimeRange(range)}
            className={`px-3 py-1.5 rounded-lg text-xs ${timeRange === range ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
            {range === '7d' ? '7 dias' : range === '30d' ? '30 dias' : '90 dias'}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="text-xs text-muted-foreground mb-1">Total de Visualizações</div>
          <div className="text-2xl font-bold text-blue-400">{totalViews.toLocaleString()}</div>
          <div className="text-xs text-green-400 mt-1">↑ 12% vs período anterior</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="text-xs text-muted-foreground mb-1">Quiz Realizados</div>
          <div className="text-2xl font-bold text-green-400">{totalQuiz.toLocaleString()}</div>
          <div className="text-xs text-green-400 mt-1">↑ 8% vs período anterior</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="text-xs text-muted-foreground mb-1">Score Médio Quiz</div>
          <div className="text-2xl font-bold text-yellow-400">{avgScore}%</div>
          <div className="text-xs text-green-400 mt-1">↑ 3% vs período anterior</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="text-xs text-muted-foreground mb-1">Usuários Ativos</div>
          <div className="text-2xl font-bold text-purple-400">400</div>
          <div className="text-xs text-green-400 mt-1">↑ 15% vs período anterior</div>
        </div>
      </div>

      {/* Daily chart (text-based) */}
      <div className="p-4 rounded-xl bg-card border border-border mb-6">
        <h3 className="font-bold text-sm mb-3">📈 Visualizações Diárias</h3>
        <div className="space-y-2">
          {DAILY_USAGE.map(day => (
            <div key={day.date} className="flex items-center gap-3">
              <div className="w-20 text-xs text-muted-foreground">{new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' })}</div>
              <div className="flex-1 h-6 bg-accent rounded-full overflow-hidden relative">
                <div className="h-full bg-primary/60 rounded-full transition-all" style={{ width: `${(day.views / 1600) * 100}%` }} />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium">{day.views}</span>
              </div>
              <div className="w-16 text-xs text-muted-foreground text-right">{day.uniqueUsers} users</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Systems ranking */}
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">🏆 Ranking de Sistemas</h3>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="text-xs bg-accent rounded-lg px-2 py-1 border border-border">
              <option value="views">Por Views</option>
              <option value="quiz">Por Score Quiz</option>
              <option value="time">Por Tempo</option>
            </select>
          </div>
          <div className="space-y-2">
            {sortedSystems.map((sys, i) => (
              <div key={sys.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50">
                <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
                <span className="text-lg">{sys.icon}</span>
                <div className="flex-1">
                  <div className="text-xs font-medium">{sys.name}</div>
                  <div className="w-full h-1.5 bg-accent rounded-full mt-1">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(sys.views / maxViews) * 100}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium">{sys.views.toLocaleString()}</div>
                  <div className={`text-[10px] ${sys.trend === 'up' ? 'text-green-400' : sys.trend === 'down' ? 'text-red-400' : 'text-muted-foreground'}`}>
                    {sys.trend === 'up' ? '↑' : sys.trend === 'down' ? '↓' : '→'} {Math.abs(sys.trendPercent)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature usage */}
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-card border border-border">
            <h3 className="font-bold text-sm mb-3">🎯 Uso por Funcionalidade</h3>
            <div className="space-y-3">
              {FEATURE_USAGE.map(f => (
                <div key={f.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">{f.name}</span>
                    <span className="text-xs font-medium">{f.usage}%</span>
                  </div>
                  <div className="w-full h-3 bg-accent rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${f.usage}%`, backgroundColor: f.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz performance */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <h3 className="font-bold text-sm mb-3">🧠 Performance no Quiz por Sistema</h3>
            <div className="space-y-2">
              {[...SYSTEM_USAGE].sort((a, b) => b.quizAvgScore - a.quizAvgScore).slice(0, 6).map(sys => (
                <div key={sys.id} className="flex items-center gap-2">
                  <span className="text-sm">{sys.icon}</span>
                  <div className="flex-1 text-xs">{sys.name}</div>
                  <div className="w-24 h-2 bg-accent rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: `${sys.quizAvgScore}%`,
                      backgroundColor: sys.quizAvgScore >= 75 ? '#22c55e' : sys.quizAvgScore >= 60 ? '#f59e0b' : '#ef4444'
                    }} />
                  </div>
                  <span className="text-xs font-medium w-10 text-right">{sys.quizAvgScore}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed table */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <h3 className="font-bold text-sm mb-3">📋 Detalhamento Completo</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2">Sistema</th>
                <th className="text-right py-2 px-2">Views</th>
                <th className="text-right py-2 px-2">Tempo Médio</th>
                <th className="text-right py-2 px-2">Quiz</th>
                <th className="text-right py-2 px-2">Score</th>
                <th className="text-right py-2 px-2">3D Views</th>
                <th className="text-right py-2 px-2">Trend</th>
              </tr>
            </thead>
            <tbody>
              {sortedSystems.map(sys => (
                <tr key={sys.id} className="border-b border-border/50 hover:bg-accent/30">
                  <td className="py-2 px-2"><span className="mr-1">{sys.icon}</span>{sys.name}</td>
                  <td className="text-right py-2 px-2 font-medium">{sys.views.toLocaleString()}</td>
                  <td className="text-right py-2 px-2">{sys.avgTime}</td>
                  <td className="text-right py-2 px-2">{sys.quizAttempts}</td>
                  <td className="text-right py-2 px-2">
                    <span className={sys.quizAvgScore >= 75 ? 'text-green-400' : sys.quizAvgScore >= 60 ? 'text-yellow-400' : 'text-red-400'}>
                      {sys.quizAvgScore}%
                    </span>
                  </td>
                  <td className="text-right py-2 px-2">{sys.sketchfabViews}</td>
                  <td className="text-right py-2 px-2">
                    <span className={sys.trend === 'up' ? 'text-green-400' : sys.trend === 'down' ? 'text-red-400' : 'text-muted-foreground'}>
                      {sys.trend === 'up' ? '↑' : sys.trend === 'down' ? '↓' : '→'}{Math.abs(sys.trendPercent)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
