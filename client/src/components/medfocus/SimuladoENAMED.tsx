/**
 * SimuladoENAMED — Simulados estilo ENAMED/REVALIDA
 * Banco de questões REAIS do INEP (domínio público) + geradas por IA
 * Cronômetro real, relatório de desempenho por área, estatísticas de acerto.
 */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Clock, Play, CheckCircle2, XCircle, BarChart3, Trophy, Brain,
  ArrowRight, ArrowLeft, Flag, AlertTriangle, Loader2, RefreshCw,
  Target, Stethoscope, Pill, Baby, Scissors, Heart, Activity,
  BookOpen, GraduationCap, ChevronDown, FileText, Sparkles,
  Database, Download, Shield
} from 'lucide-react';
import { REAL_QUESTIONS, QUESTION_STATS, type RealQuestion } from '@/data/realQuestions';

// ─── Medical Areas ─────────────────────────────────────────────
const MEDICAL_AREAS = [
  { id: 'clinica_medica', name: 'Clínica Médica', realName: 'Clínica Médica', icon: Stethoscope, color: 'text-blue-500' },
  { id: 'cirurgia', name: 'Cirurgia', realName: 'Cirurgia', icon: Scissors, color: 'text-red-500' },
  { id: 'pediatria', name: 'Pediatria', realName: 'Pediatria', icon: Baby, color: 'text-green-500' },
  { id: 'ginecologia_obstetricia', name: 'Ginecologia e Obstetrícia', realName: 'Ginecologia e Obstetrícia', icon: Heart, color: 'text-pink-500' },
  { id: 'saude_coletiva', name: 'Saúde Coletiva', realName: 'Saúde Coletiva', icon: Activity, color: 'text-purple-500' },
  { id: 'saude_mental', name: 'Saúde Mental', realName: 'Psiquiatria', icon: Brain, color: 'text-yellow-500' },
  { id: 'urgencia_emergencia', name: 'Urgência e Emergência', realName: 'Emergência', icon: AlertTriangle, color: 'text-orange-500' },
  { id: 'etica_medica', name: 'Ética Médica', realName: 'Ética Médica', icon: Shield, color: 'text-teal-500' },
];

const EXAM_TYPES = [
  { id: 'enamed', name: 'ENAMED', description: 'Exame Nacional de Avaliação da Formação Médica', questions: 80, time: 300 },
  { id: 'revalida', name: 'REVALIDA', description: 'Exame Nacional de Revalidação de Diplomas Médicos', questions: 100, time: 300 },
  { id: 'residencia', name: 'Residência Médica', description: 'Simulado estilo prova de residência', questions: 60, time: 240 },
];

const QUESTION_SOURCES = [
  { id: 'real', name: 'Questões Oficiais', description: `${QUESTION_STATS.total} questões reais do INEP`, icon: FileText },
  { id: 'ai', name: 'Questões por IA', description: 'Geradas sob demanda pela IA', icon: Sparkles },
  { id: 'mixed', name: 'Misto', description: 'Combina questões reais + IA', icon: Database },
];

interface Question {
  id?: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  area?: string;
  source?: 'real' | 'ai';
  realSource?: string;
  realNumber?: number;
  realYear?: number;
}

interface SimuladoConfig {
  examType: 'enamed' | 'revalida' | 'residencia' | 'custom';
  areas: string[];
  totalQuestions: number;
  timeLimit: number;
  difficulty: 'facil' | 'medio' | 'dificil';
  questionSource: 'real' | 'ai' | 'mixed';
}

type SimuladoPhase = 'config' | 'loading' | 'exam' | 'review' | 'results';

// ─── Helper: Convert real questions to internal format ─────────
function convertRealQuestion(rq: RealQuestion): Question {
  const correctIdx = rq.options.findIndex(o => o.letter === rq.correctAnswer);
  return {
    question: rq.text,
    options: rq.options.map(o => o.text),
    correctIndex: correctIdx >= 0 ? correctIdx : 0,
    explanation: `Questão ${rq.number} da prova ${rq.source.replace('_', ' ')} (${rq.year}). Gabarito oficial INEP: alternativa ${rq.correctAnswer}.`,
    area: MEDICAL_AREAS.find(a => a.realName === rq.area)?.id || 'clinica_medica',
    source: 'real',
    realSource: rq.source,
    realNumber: rq.number,
    realYear: rq.year,
  };
}

// ─── Helper: Get real questions by area ────────────────────────
function getRealQuestionsByArea(areaIds: string[], count: number, examType?: string): Question[] {
  const areaNames = areaIds.map(id => MEDICAL_AREAS.find(a => a.id === id)?.realName).filter(Boolean);
  let filtered = REAL_QUESTIONS.filter(q => areaNames.includes(q.area));
  
  // Filter by exam type if specified
  if (examType === 'enamed') {
    const enamed = filtered.filter(q => q.source === 'ENAMED_2025');
    if (enamed.length >= count * 0.5) filtered = enamed;
  } else if (examType === 'revalida') {
    const revalida = filtered.filter(q => q.source.startsWith('REVALIDA_'));
    if (revalida.length >= count * 0.5) filtered = revalida;
  }
  
  // Shuffle and take
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(convertRealQuestion);
}

// ─── Timer Component ───────────────────────────────────────────
function ExamTimer({ totalSeconds, onTimeUp, isPaused }: { totalSeconds: number; onTimeUp: () => void; isPaused: boolean }) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, onTimeUp]);

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  const pct = (remaining / totalSeconds) * 100;
  const isLow = pct < 15;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg ${isLow ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-muted text-foreground'}`}>
      <Clock className="w-5 h-5" />
      <span>{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
    </div>
  );
}

// ─── Results Chart ─────────────────────────────────────────────
function AreaChart({ results }: { results: Record<string, { correct: number; total: number }> }) {
  const areas = Object.entries(results);
  return (
    <div className="space-y-3">
      {areas.map(([area, data]) => {
        const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
        const areaInfo = MEDICAL_AREAS.find(a => a.id === area);
        return (
          <div key={area} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{areaInfo?.name || area}</span>
              <span className="text-muted-foreground">{data.correct}/{data.total} ({pct}%)</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Stats Banner ──────────────────────────────────────────────
function RealQuestionsBanner() {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="py-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm flex items-center gap-2">
              Banco de Questões Oficiais INEP
              <Badge variant="secondary" className="text-xs">Domínio Público</Badge>
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {QUESTION_STATS.total} questões reais extraídas das provas oficiais do ENAMED 2025, REVALIDA 2024/1, 2024/2, 2023/1 e 2023/2 com gabarito definitivo do INEP.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              {Object.entries(QUESTION_STATS.bySource).map(([src, count]) => (
                <span key={src} className="text-xs bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full">
                  {src.replace(/_/g, ' ')}: {count as number} questões
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(QUESTION_STATS.byArea).map(([area, count]) => (
                <span key={area} className="text-xs text-muted-foreground">
                  {area}: {count as number}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Component ────────────────────────────────────────────
const SimuladoENAMED: React.FC = () => {
  const [phase, setPhase] = useState<SimuladoPhase>('config');
  const [config, setConfig] = useState<SimuladoConfig>({
    examType: 'enamed', areas: [], totalQuestions: 30, timeLimit: 60, difficulty: 'medio',
    questionSource: 'mixed'
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);
  const [simuladoId, setSimuladoId] = useState<number | null>(null);
  const [startTime] = useState(() => Date.now());
  const [showNav, setShowNav] = useState(false);

  const generateMutation = trpc.simulado.generateQuestions.useMutation();
  const createMutation = trpc.simulado.create.useMutation();
  const completeMutation = trpc.simulado.complete.useMutation();
  const statsQuery = trpc.simulado.stats.useQuery(undefined, { retry: false });
  const historyQuery = trpc.simulado.list.useQuery(undefined, { retry: false });

  // ─── Start Exam ──────────────────────────────────────────────
  const startExam = useCallback(async () => {
    if (config.areas.length === 0) {
      toast.error('Selecione pelo menos uma área médica');
      return;
    }
    setPhase('loading');
    try {
      // Create simulado record
      const sim = await createMutation.mutateAsync({
        title: `Simulado ${config.examType.toUpperCase()} - ${new Date().toLocaleDateString('pt-BR')}`,
        examType: config.examType,
        totalQuestions: config.totalQuestions,
        timeLimit: config.timeLimit,
        areas: config.areas,
      });
      setSimuladoId(sim.id);

      const allQuestions: Question[] = [];

      if (config.questionSource === 'real' || config.questionSource === 'mixed') {
        // Get real questions
        const realCount = config.questionSource === 'real' ? config.totalQuestions : Math.ceil(config.totalQuestions * 0.6);
        const realQs = getRealQuestionsByArea(config.areas, realCount, config.examType);
        allQuestions.push(...realQs);
      }

      if (config.questionSource === 'ai' || config.questionSource === 'mixed') {
        // Generate AI questions for remaining slots
        const aiCount = config.questionSource === 'ai' ? config.totalQuestions : Math.max(config.totalQuestions - allQuestions.length, 5);
        const questionsPerArea = Math.ceil(aiCount / config.areas.length);
        
        for (const area of config.areas) {
          try {
            const generated = await generateMutation.mutateAsync({
              area,
              examType: config.examType as 'enamed' | 'revalida' | 'residencia',
              count: Math.min(questionsPerArea, 5),
              difficulty: config.difficulty,
            });
            allQuestions.push(...generated.map((q: any) => ({ ...q, area, source: 'ai' as const })));
          } catch (e) {
            console.error(`Erro ao gerar questões IA para ${area}:`, e);
          }
        }
      }

      if (allQuestions.length === 0) {
        toast.error('Não foi possível obter questões. Tente novamente.');
        setPhase('config');
        return;
      }

      // Shuffle and limit
      const shuffled = allQuestions.sort(() => Math.random() - 0.5).slice(0, config.totalQuestions);
      setQuestions(shuffled);
      setAnswers({});
      setFlagged(new Set());
      setCurrentQ(0);
      setPhase('exam');

      const realCount = shuffled.filter(q => q.source === 'real').length;
      const aiCount = shuffled.filter(q => q.source === 'ai').length;
      toast.success(`Simulado iniciado! ${shuffled.length} questões (${realCount} oficiais INEP + ${aiCount} IA)`);
    } catch (e) {
      toast.error('Erro ao iniciar simulado');
      setPhase('config');
    }
  }, [config, createMutation, generateMutation]);

  // ─── Finish Exam ─────────────────────────────────────────────
  const finishExam = useCallback(async () => {
    const timeSpent = Math.round((Date.now() - startTime) / 60000);
    let correct = 0;
    const areaResults: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q, idx) => {
      const area = q.area || 'geral';
      if (!areaResults[area]) areaResults[area] = { correct: 0, total: 0 };
      areaResults[area].total++;
      if (answers[idx] === q.correctIndex) {
        correct++;
        areaResults[area].correct++;
      }
    });

    const score = Math.round((correct / questions.length) * 100);

    if (simuladoId) {
      try {
        await completeMutation.mutateAsync({
          simuladoId,
          score,
          correctAnswers: correct,
          timeSpent,
          results: JSON.stringify(areaResults),
        });
      } catch (e) {
        console.error('Erro ao salvar resultado:', e);
      }
    }

    setPhase('results');
    toast.success(`Simulado finalizado! Nota: ${score}%`);
  }, [questions, answers, simuladoId, startTime, completeMutation]);

  const handleTimeUp = useCallback(() => {
    toast.warning('Tempo esgotado!');
    finishExam();
  }, [finishExam]);

  // ─── Computed Results ────────────────────────────────────────
  const results = useMemo(() => {
    let correct = 0;
    const areaResults: Record<string, { correct: number; total: number }> = {};
    const sourceResults = { real: { correct: 0, total: 0 }, ai: { correct: 0, total: 0 } };
    
    questions.forEach((q, idx) => {
      const area = q.area || 'geral';
      if (!areaResults[area]) areaResults[area] = { correct: 0, total: 0 };
      areaResults[area].total++;
      
      const src = q.source || 'ai';
      sourceResults[src].total++;
      
      if (answers[idx] === q.correctIndex) {
        correct++;
        areaResults[area].correct++;
        sourceResults[src].correct++;
      }
    });
    return {
      correct, total: questions.length,
      score: questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0,
      areaResults, sourceResults
    };
  }, [questions, answers]);

  // ─── CONFIG PHASE ────────────────────────────────────────────
  if (phase === 'config') {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header with stats */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-primary" /> Simulados ENAMED/REVALIDA
            </h1>
            <p className="text-muted-foreground mt-1">Pratique com questões oficiais do INEP e geradas por IA</p>
          </div>
          {statsQuery.data && (
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{statsQuery.data.totalCompleted}</p>
                <p className="text-xs text-muted-foreground">Simulados</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{Math.round(statsQuery.data.avgScore)}%</p>
                <p className="text-xs text-muted-foreground">Média</p>
              </div>
            </div>
          )}
        </div>

        {/* Real Questions Banner */}
        <RealQuestionsBanner />

        {/* Question Source Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Database className="w-5 h-5" /> Fonte das Questões</CardTitle>
            <CardDescription>Escolha entre questões oficiais do INEP, geradas por IA, ou uma combinação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {QUESTION_SOURCES.map(src => {
                const Icon = src.icon;
                return (
                  <button
                    key={src.id}
                    onClick={() => setConfig(c => ({ ...c, questionSource: src.id as any }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${config.questionSource === src.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-5 h-5 text-primary" />
                      <p className="font-bold">{src.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{src.description}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Exam Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Tipo de Prova</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {EXAM_TYPES.map(exam => (
                <button
                  key={exam.id}
                  onClick={() => setConfig(c => ({ ...c, examType: exam.id as any, totalQuestions: Math.min(c.totalQuestions, exam.questions), timeLimit: exam.time }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${config.examType === exam.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                >
                  <p className="font-bold text-lg">{exam.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{exam.description}</p>
                  <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{exam.questions} questões</span>
                    <span>{exam.time} min</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Areas Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Target className="w-5 h-5" /> Áreas Médicas</CardTitle>
            <CardDescription>Selecione as áreas que deseja praticar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {MEDICAL_AREAS.map(area => {
                const Icon = area.icon;
                const selected = config.areas.includes(area.id);
                const realCount = REAL_QUESTIONS.filter(q => q.area === area.realName).length;
                return (
                  <button
                    key={area.id}
                    onClick={() => setConfig(c => ({
                      ...c,
                      areas: selected ? c.areas.filter(a => a !== area.id) : [...c.areas, area.id]
                    }))}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${selected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${area.color}`} />
                      <span className="text-sm font-medium">{area.name}</span>
                    </div>
                    {realCount > 0 && (
                      <span className="text-xs text-muted-foreground mt-1 block">{realCount} questões reais</span>
                    )}
                  </button>
                );
              })}
            </div>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setConfig(c => ({ ...c, areas: MEDICAL_AREAS.map(a => a.id) }))}>
              Selecionar Todas
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Activity className="w-5 h-5" /> Configurações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Questões</label>
                <select
                  value={config.totalQuestions}
                  onChange={e => setConfig(c => ({ ...c, totalQuestions: Number(e.target.value) }))}
                  className="w-full mt-1 p-2 rounded-lg border border-border bg-background text-foreground"
                >
                  {[10, 15, 20, 30, 40, 50].map(n => (
                    <option key={n} value={n}>{n} questões</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Tempo (minutos)</label>
                <select
                  value={config.timeLimit}
                  onChange={e => setConfig(c => ({ ...c, timeLimit: Number(e.target.value) }))}
                  className="w-full mt-1 p-2 rounded-lg border border-border bg-background text-foreground"
                >
                  {[30, 60, 90, 120, 180, 240, 300].map(n => (
                    <option key={n} value={n}>{n} minutos</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Dificuldade</label>
                <select
                  value={config.difficulty}
                  onChange={e => setConfig(c => ({ ...c, difficulty: e.target.value as any }))}
                  className="w-full mt-1 p-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="facil">Fácil</option>
                  <option value="medio">Médio</option>
                  <option value="dificil">Difícil</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button size="lg" className="w-full" onClick={startExam} disabled={config.areas.length === 0}>
          <Play className="w-5 h-5 mr-2" /> Iniciar Simulado
        </Button>

        {/* History */}
        {historyQuery.data && historyQuery.data.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Histórico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {historyQuery.data.slice(0, 5).map((sim: any) => (
                  <div key={sim.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{sim.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(sim.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={sim.status === 'completed' ? 'default' : 'secondary'}>
                        {sim.status === 'completed' ? `${sim.score}%` : 'Em andamento'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ─── LOADING PHASE ───────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg font-medium">
          {config.questionSource === 'real' ? 'Selecionando questões oficiais INEP...' :
           config.questionSource === 'ai' ? 'Gerando questões com IA...' :
           'Combinando questões oficiais + IA...'}
        </p>
        <p className="text-sm text-muted-foreground">Preparando simulado {config.examType.toUpperCase()} para as áreas selecionadas</p>
      </div>
    );
  }

  // ─── EXAM PHASE ──────────────────────────────────────────────
  if (phase === 'exam' || phase === 'review') {
    const q = questions[currentQ];
    if (!q) return null;
    const isReview = phase === 'review';
    const answered = answers[currentQ] !== undefined;
    const isCorrect = answers[currentQ] === q.correctIndex;

    return (
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between sticky top-0 z-20 bg-background/95 backdrop-blur py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              {currentQ + 1}/{questions.length}
            </Badge>
            {q.source === 'real' && (
              <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-600">
                <FileText className="w-3 h-3 mr-1" /> INEP
              </Badge>
            )}
            {q.source === 'ai' && (
              <Badge variant="secondary" className="text-xs bg-purple-500/10 text-purple-600">
                <Sparkles className="w-3 h-3 mr-1" /> IA
              </Badge>
            )}
            {flagged.has(currentQ) && <Flag className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
          </div>
          {!isReview && <ExamTimer totalSeconds={config.timeLimit * 60} onTimeUp={handleTimeUp} isPaused={false} />}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowNav(!showNav)}>
              <ChevronDown className="w-4 h-4 mr-1" /> Navegação
            </Button>
            {!isReview && (
              <Button variant="destructive" size="sm" onClick={finishExam}>
                Finalizar
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigation Grid */}
        {showNav && (
          <div className="p-4 bg-muted/50 rounded-xl border border-border">
            <div className="flex flex-wrap gap-2">
              {questions.map((qq, idx) => (
                <button
                  key={idx}
                  onClick={() => { setCurrentQ(idx); setShowExplanation(false); }}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all relative ${
                    idx === currentQ ? 'bg-primary text-primary-foreground' :
                    isReview ? (answers[idx] === questions[idx].correctIndex ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700') :
                    answers[idx] !== undefined ? 'bg-primary/20 text-primary' :
                    flagged.has(idx) ? 'bg-yellow-500/20 text-yellow-700' :
                    'bg-muted text-muted-foreground'
                  }`}
                >
                  {idx + 1}
                  {qq.source === 'real' && <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-500" />}
                </button>
              ))}
            </div>
            <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-primary/20" /> Respondida</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-yellow-500/20" /> Marcada</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> INEP</span>
            </div>
          </div>
        )}

        {/* Question Card */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">{MEDICAL_AREAS.find(a => a.id === q.area)?.name || q.area}</Badge>
                {q.realSource && (
                  <Badge variant="outline" className="text-xs">
                    {q.realSource.replace('_', ' ')} — Q{q.realNumber} ({q.realYear})
                  </Badge>
                )}
                {isReview && (
                  <Badge variant={isCorrect ? 'default' : 'destructive'}>
                    {isCorrect ? 'Correta' : 'Incorreta'}
                  </Badge>
                )}
              </div>
              {!isReview && (
                <Button
                  variant="ghost" size="sm"
                  onClick={() => setFlagged(prev => {
                    const next = new Set(prev);
                    next.has(currentQ) ? next.delete(currentQ) : next.add(currentQ);
                    return next;
                  })}
                >
                  <Flag className={`w-4 h-4 ${flagged.has(currentQ) ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                </Button>
              )}
            </div>
            <p className="text-base leading-relaxed mt-3 whitespace-pre-wrap">{q.question}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {q.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = answers[currentQ] === idx;
              const isCorrectOpt = idx === q.correctIndex;
              let optClass = 'border-border hover:border-primary/50 hover:bg-primary/5';
              if (isReview || showExplanation) {
                if (isCorrectOpt) optClass = 'border-green-500 bg-green-500/10';
                else if (isSelected && !isCorrectOpt) optClass = 'border-red-500 bg-red-500/10';
                else optClass = 'border-border opacity-60';
              } else if (isSelected) {
                optClass = 'border-primary bg-primary/10';
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (!isReview && !showExplanation) {
                      setAnswers(prev => ({ ...prev, [currentQ]: idx }));
                    }
                  }}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex gap-3 items-start ${optClass}`}
                >
                  <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0">
                    {letter}
                  </span>
                  <span className="text-sm leading-relaxed">{opt}</span>
                  {(isReview || showExplanation) && isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 ml-auto" />}
                  {(isReview || showExplanation) && isSelected && !isCorrectOpt && <XCircle className="w-5 h-5 text-red-500 shrink-0 ml-auto" />}
                </button>
              );
            })}

            {/* Explanation */}
            {(isReview || showExplanation) && q.explanation && (
              <div className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <p className="text-sm font-bold text-blue-600 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Explicação
                </p>
                <p className="text-sm leading-relaxed text-foreground/80">{q.explanation}</p>
              </div>
            )}

            {!isReview && answered && !showExplanation && (
              <Button variant="outline" size="sm" onClick={() => setShowExplanation(true)} className="mt-2">
                Ver Explicação
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            disabled={currentQ === 0}
            onClick={() => { setCurrentQ(c => c - 1); setShowExplanation(false); }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            {Object.keys(answers).length}/{questions.length} respondidas
          </span>
          <Button
            disabled={currentQ === questions.length - 1}
            onClick={() => { setCurrentQ(c => c + 1); setShowExplanation(false); }}
          >
            Próxima <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // ─── RESULTS PHASE ───────────────────────────────────────────
  if (phase === 'results') {
    const passed = results.score >= 60;
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Score Card */}
        <Card className={`border-2 ${passed ? 'border-green-500/50' : 'border-red-500/50'}`}>
          <CardContent className="pt-8 pb-8 text-center">
            <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-4 ${passed ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              {passed ? <Trophy className="w-12 h-12 text-green-500" /> : <Target className="w-12 h-12 text-red-500" />}
            </div>
            <h2 className="text-4xl font-bold">{results.score}%</h2>
            <p className="text-lg text-muted-foreground mt-1">
              {results.correct} de {results.total} questões corretas
            </p>
            <Badge variant={passed ? 'default' : 'destructive'} className="mt-3">
              {passed ? 'Aprovado' : 'Reprovado'} (mínimo 60%)
            </Badge>
          </CardContent>
        </Card>

        {/* Source Breakdown */}
        {(results.sourceResults.real.total > 0 && results.sourceResults.ai.total > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Database className="w-5 h-5" /> Desempenho por Fonte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
                  <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Questões Oficiais INEP</p>
                  <p className="text-2xl font-bold mt-1">
                    {results.sourceResults.real.total > 0 ? Math.round((results.sourceResults.real.correct / results.sourceResults.real.total) * 100) : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground">{results.sourceResults.real.correct}/{results.sourceResults.real.total}</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-center">
                  <Sparkles className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Questões IA</p>
                  <p className="text-2xl font-bold mt-1">
                    {results.sourceResults.ai.total > 0 ? Math.round((results.sourceResults.ai.correct / results.sourceResults.ai.total) * 100) : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground">{results.sourceResults.ai.correct}/{results.sourceResults.ai.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Area Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Desempenho por Área</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart results={results.areaResults} />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => { setPhase('review'); setCurrentQ(0); setShowExplanation(false); }}>
            <BookOpen className="w-4 h-4 mr-2" /> Revisar Questões
          </Button>
          <Button className="flex-1" onClick={() => { setPhase('config'); setQuestions([]); setAnswers({}); }}>
            <RefreshCw className="w-4 h-4 mr-2" /> Novo Simulado
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default SimuladoENAMED;
