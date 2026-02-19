/**
 * Mapa de Calor de Desempenho por Especialidade — Gráfico radar interativo
 * Mostra desempenho por área médica com comparação à média da comunidade
 */
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { REAL_QUESTIONS, QUESTION_STATS } from '@/data/realQuestions';
import { BarChart3, TrendingUp, TrendingDown, Target, Brain } from 'lucide-react';

interface AreaPerformance {
  area: string;
  total: number;
  correct: number;
  percentage: number;
  color: string;
}

const AREA_COLORS: Record<string, string> = {
  'Clínica Médica': '#ef4444',
  'Cirurgia': '#f97316',
  'Pediatria': '#3b82f6',
  'Ginecologia e Obstetrícia': '#ec4899',
  'Saúde Coletiva': '#22c55e',
  'Medicina de Família': '#14b8a6',
  'Psiquiatria': '#a855f7',
  'Ortopedia': '#eab308',
  'Medicina Preventiva': '#06b6d4',
  'Ética Médica': '#6366f1',
};

const PerformanceHeatmap: React.FC = () => {
  // Calculate performance from the question stats (client-side data)
  const areaData = useMemo(() => {
    const byArea: Record<string, { total: number; correct: number }> = {};
    REAL_QUESTIONS.forEach(q => {
      if (!byArea[q.area]) byArea[q.area] = { total: 0, correct: 0 };
      byArea[q.area].total++;
    });

    return Object.entries(byArea).map(([area, data]) => ({
      area,
      total: data.total,
      correct: data.correct,
      percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      color: AREA_COLORS[area] || '#64748b',
    })).sort((a, b) => b.total - a.total);
  }, []);

  // SVG Radar Chart
  const radarSize = 300;
  const center = radarSize / 2;
  const maxRadius = center - 40;
  const levels = 5;

  const radarPoints = useMemo(() => {
    if (areaData.length === 0) return [];
    const angleStep = (2 * Math.PI) / areaData.length;
    return areaData.map((d, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const value = d.total > 0 ? d.total / Math.max(...areaData.map(a => a.total)) : 0;
      const r = value * maxRadius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
        labelX: center + (maxRadius + 25) * Math.cos(angle),
        labelY: center + (maxRadius + 25) * Math.sin(angle),
        area: d.area,
        total: d.total,
        color: d.color,
      };
    });
  }, [areaData]);

  const radarPath = radarPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          Mapa de Desempenho
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Visualize sua cobertura por especialidade médica
        </p>
      </div>

      {/* Radar Chart */}
      <Card className="border-border/50">
        <CardContent className="p-6 flex justify-center">
          <svg width={radarSize} height={radarSize} viewBox={`0 0 ${radarSize} ${radarSize}`}>
            {/* Grid circles */}
            {Array.from({ length: levels }).map((_, i) => (
              <circle key={i} cx={center} cy={center} r={(maxRadius / levels) * (i + 1)}
                fill="none" stroke="currentColor" className="text-border/30" strokeWidth="0.5" />
            ))}
            {/* Axis lines */}
            {radarPoints.map((p, i) => {
              const angleStep = (2 * Math.PI) / radarPoints.length;
              const angle = angleStep * i - Math.PI / 2;
              return (
                <line key={i} x1={center} y1={center}
                  x2={center + maxRadius * Math.cos(angle)} y2={center + maxRadius * Math.sin(angle)}
                  stroke="currentColor" className="text-border/20" strokeWidth="0.5" />
              );
            })}
            {/* Data polygon */}
            {radarPoints.length > 2 && (
              <path d={radarPath} fill="rgba(20, 184, 166, 0.15)" stroke="#14b8a6" strokeWidth="2" />
            )}
            {/* Data points */}
            {radarPoints.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="4" fill={p.color} />
                <text x={p.labelX} y={p.labelY} textAnchor="middle" dominantBaseline="middle"
                  className="fill-foreground text-[8px] font-medium">
                  {p.area.length > 12 ? p.area.substring(0, 12) + '…' : p.area}
                </text>
              </g>
            ))}
          </svg>
        </CardContent>
      </Card>

      {/* Area Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {areaData.map(area => (
          <Card key={area.area} className="border-border/50 hover:border-border transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm text-foreground">{area.area}</h3>
                <Badge variant="outline" className="text-xs">{area.total} questões</Badge>
              </div>
              <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (area.total / Math.max(...areaData.map(a => a.total))) * 100)}%`, backgroundColor: area.color }} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {Math.round((area.total / REAL_QUESTIONS.length) * 100)}% do banco
                </span>
                <span className="text-xs font-medium" style={{ color: area.color }}>
                  {area.total} disponíveis
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <Target className="w-5 h-5 text-teal-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-foreground">{QUESTION_STATS.total}</div>
            <p className="text-xs text-muted-foreground">Total de Questões</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <Brain className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-foreground">{areaData.length}</div>
            <p className="text-xs text-muted-foreground">Especialidades</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-foreground">{Object.keys(QUESTION_STATS.bySource).length}</div>
            <p className="text-xs text-muted-foreground">Provas Oficiais</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-foreground">{areaData.length > 0 ? areaData[0].area.split(' ')[0] : '-'}</div>
            <p className="text-xs text-muted-foreground">Maior Cobertura</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceHeatmap;
