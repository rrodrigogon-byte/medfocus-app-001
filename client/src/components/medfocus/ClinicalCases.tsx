/**
 * Casos Clínicos Interativos — Visual + Referências Científicas de Elite
 * Baseado em Harrison, Cecil, Nelson, Schwartz, Williams, Kaplan & Sadock
 * Cada fase tem perguntas de múltipla escolha + chat livre + citações bibliográficas
 */
import React, { useState, useRef, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Streamdown } from 'streamdown';
import {
import EducationalDisclaimer from './EducationalDisclaimer';
  Stethoscope, Brain, FlaskConical, ClipboardList, Pill,
  ChevronRight, Trophy, Loader2, Send, ArrowLeft, Sparkles,
  User, Heart, Activity, Clock, BookOpen, CheckCircle, XCircle,
  AlertTriangle, Thermometer, Droplets, Wind, Zap
} from 'lucide-react';

const SPECIALTIES = [
  { id: 'Clínica Médica', icon: '🫀', color: 'from-red-500/20 to-red-600/5', accent: 'text-red-400', border: 'border-red-500/20', books: 'Harrison · Cecil · CMDT' },
  { id: 'Cirurgia', icon: '🔪', color: 'from-orange-500/20 to-orange-600/5', accent: 'text-orange-400', border: 'border-orange-500/20', books: 'Sabiston · Schwartz' },
  { id: 'Pediatria', icon: '👶', color: 'from-blue-500/20 to-blue-600/5', accent: 'text-blue-400', border: 'border-blue-500/20', books: 'Nelson · SBP · Rudolph' },
  { id: 'Ginecologia e Obstetrícia', icon: '🤰', color: 'from-pink-500/20 to-pink-600/5', accent: 'text-pink-400', border: 'border-pink-500/20', books: 'Williams · Berek · Rezende' },
  { id: 'Saúde Coletiva', icon: '🏥', color: 'from-green-500/20 to-green-600/5', accent: 'text-green-400', border: 'border-green-500/20', books: 'Medronho · Rouquayrol · Park' },
  { id: 'Medicina de Família', icon: '👨‍⚕️', color: 'from-teal-500/20 to-teal-600/5', accent: 'text-teal-400', border: 'border-teal-500/20', books: 'Duncan · McWhinney' },
  { id: 'Psiquiatria', icon: '🧠', color: 'from-purple-500/20 to-purple-600/5', accent: 'text-purple-400', border: 'border-purple-500/20', books: 'Kaplan & Sadock · Stahl' },
  { id: 'Ortopedia', icon: '🦴', color: 'from-amber-500/20 to-amber-600/5', accent: 'text-amber-400', border: 'border-amber-500/20', books: 'Campbell · Rockwood' },
];

const PHASES = [
  { id: 'anamnesis' as const, label: 'Anamnese', icon: ClipboardList, hint: 'Faça perguntas ao paciente sobre sintomas, histórico, medicações...', color: 'text-blue-400' },
  { id: 'physical_exam' as const, label: 'Exame Físico', icon: Stethoscope, hint: 'Descreva o exame que deseja realizar', color: 'text-green-400' },
  { id: 'lab_tests' as const, label: 'Exames', icon: FlaskConical, hint: 'Solicite exames laboratoriais ou de imagem', color: 'text-purple-400' },
  { id: 'hypothesis' as const, label: 'Hipótese', icon: Brain, hint: 'Formule suas hipóteses diagnósticas', color: 'text-amber-400' },
  { id: 'treatment' as const, label: 'Conduta', icon: Pill, hint: 'Proponha o tratamento e conduta', color: 'text-red-400' },
];

type PhaseId = typeof PHASES[number]['id'];

interface PhaseQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Reference {
  book: string;
  edition?: string;
  chapter?: string;
  page?: string;
  keyPoint?: string;
}

interface CaseData {
  title: string;
  patientInfo: {
    age: number;
    sex: string;
    chiefComplaint: string;
    history?: string;
    pastHistory?: string;
    medications?: string[];
    socialHistory?: string;
    familyHistory?: string;
    vitalSigns: Record<string, string>;
  };
  physicalExam?: Record<string, string>;
  labResults?: Record<string, string>;
  correctDiagnosis?: string;
  keyFindings?: string[];
  differentialDiagnoses?: string[];
  recommendedTests?: string[];
  treatment?: string;
  references?: Reference[];
  phaseQuestions?: Record<string, PhaseQuestion[]>;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  phase: PhaseId;
}

// ─── Vital Sign Visual Card ────────────────────────────────────
const VitalSignCard = ({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) => (
  <div className="flex flex-col items-center p-3 rounded-xl bg-background/50 border border-border/30 min-w-[80px]">
    <Icon className={`w-4 h-4 ${color} mb-1`} />
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-bold text-foreground">{value}</span>
  </div>
);

// ─── Reference Badge ────────────────────────────────────────────
const ReferenceBadge = ({ ref: reference }: { ref: Reference }) => (
  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
    <BookOpen className="w-3 h-3 text-amber-400" />
    <span className="text-amber-300 font-medium">{reference.book}</span>
    {reference.chapter && <span className="text-amber-400/60">Cap. {reference.chapter}</span>}
  </div>
);

// ─── Phase Question Component ───────────────────────────────────
const PhaseQuestionCard = ({ question, onAnswer }: { question: PhaseQuestion; onAnswer: (correct: boolean) => void }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    onAnswer(idx === question.correct);
  };

  return (
    <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-2">
          <Brain className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-sm font-medium text-foreground">{question.question}</p>
        </div>
        <div className="space-y-2">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.correct;
            const isSelected = i === selected;
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={showResult}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all border ${
                  showResult && isCorrect ? 'bg-green-500/15 border-green-500/30 text-green-300' :
                  showResult && isSelected && !isCorrect ? 'bg-red-500/15 border-red-500/30 text-red-300' :
                  isSelected ? 'bg-primary/10 border-primary/30' :
                  'bg-background/50 border-border/30 hover:border-border/60 hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="flex-1">{opt}</span>
                  {showResult && isCorrect && <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
        {showResult && (
          <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 leading-relaxed">
            <BookOpen className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
            {question.explanation}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ClinicalCases: React.FC = () => {
  const [view, setView] = useState<'menu' | 'active' | 'history'>('menu');
  const [activeCaseId, setActiveCaseId] = useState<number | null>(null);
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [currentPhase, setCurrentPhase] = useState<PhaseId>('anamnesis');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentInput, setTreatmentInput] = useState('');
  const [phaseScores, setPhaseScores] = useState<Record<string, { correct: number; total: number }>>({});
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const startCase = trpc.clinicalCase.start.useMutation();
  const interact = trpc.clinicalCase.interact.useMutation();
  const completeCase = trpc.clinicalCase.complete.useMutation();
  const { data: caseHistory, refetch: refetchHistory } = trpc.clinicalCase.list.useQuery(undefined, { retry: false });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartCase = async (specialty: string, difficulty: 'easy' | 'medium' | 'hard') => {
    setIsLoading(true);
    try {
      const result = await startCase.mutateAsync({ specialty, difficulty });
      if (result.caseId) {
        setActiveCaseId(result.caseId);
        setCaseData(result.caseData);
        setCurrentPhase('anamnesis');
        setMessages([]);
        setPhaseScores({});
        setView('active');
        toast.success('Caso clínico gerado com referências científicas!');
      }
    } catch {
      toast.error('Erro ao gerar caso clínico');
    }
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || !activeCaseId) return;
    const userMsg: ChatMessage = { role: 'user', content: input, phase: currentPhase };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    try {
      const result = await interact.mutateAsync({ caseId: activeCaseId, message: input, phase: currentPhase });
      const aiMsg: ChatMessage = { role: 'assistant', content: result.response, phase: currentPhase };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      toast.error('Erro na interação');
    }
    setIsLoading(false);
  };

  const handlePhaseQuestionAnswer = (phaseId: string, correct: boolean) => {
    setPhaseScores(prev => ({
      ...prev,
      [phaseId]: {
        correct: (prev[phaseId]?.correct || 0) + (correct ? 1 : 0),
        total: (prev[phaseId]?.total || 0) + 1,
      }
    }));
  };

  const handleComplete = async () => {
    if (!activeCaseId || !diagnosis.trim()) {
      toast.error('Informe seu diagnóstico');
      return;
    }
    setIsLoading(true);
    try {
      const result = await completeCase.mutateAsync({ caseId: activeCaseId, diagnosis, treatment: treatmentInput });
      setEvaluation(result);
      setShowCompletion(true);
      refetchHistory();
    } catch {
      toast.error('Erro ao finalizar caso');
    }
    setIsLoading(false);
  };

  const vitalSignIcons: Record<string, { icon: React.ElementType; color: string }> = {
    PA: { icon: Heart, color: 'text-red-400' },
    FC: { icon: Activity, color: 'text-pink-400' },
    FR: { icon: Wind, color: 'text-blue-400' },
    Temp: { icon: Thermometer, color: 'text-orange-400' },
    SpO2: { icon: Droplets, color: 'text-cyan-400' },
    Peso: { icon: User, color: 'text-green-400' },
    Altura: { icon: User, color: 'text-green-400' },
    IMC: { icon: Zap, color: 'text-yellow-400' },
  };

  // ─── Menu View ────────────────────────────────────────────────
  if (view === 'menu') {
    return (
      <div className="space-y-6">
      <EducationalDisclaimer variant="banner" moduleName="Casos Clínicos" />
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-teal-400" />
              Casos Clínicos Interativos
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Baseados nos melhores livros de medicina do mundo — com perguntas e referências científicas
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setView('history')}>
            <Clock className="w-4 h-4 mr-1" /> Histórico
          </Button>
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Dificuldade:</span>
          {(['easy', 'medium', 'hard'] as const).map(d => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                selectedDifficulty === d
                  ? d === 'easy' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    d === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    'bg-red-500/20 text-red-400 border-red-500/30'
                  : 'border-border/30 text-muted-foreground hover:border-border/60'
              }`}
            >
              {d === 'easy' ? '🟢 Fácil' : d === 'medium' ? '🟡 Médio' : '🔴 Difícil'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SPECIALTIES.map(spec => (
            <Card key={spec.id} className={`${spec.border} hover:border-teal-500/30 transition-all cursor-pointer group overflow-hidden`}>
              <CardContent className="p-0">
                <div className={`bg-gradient-to-r ${spec.color} p-5`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{spec.icon}</span>
                      <div>
                        <h3 className="font-semibold text-foreground">{spec.id}</h3>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> {spec.books}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={() => handleStartCase(spec.id, selectedDifficulty)}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <>
                        <Sparkles className="w-4 h-4 mr-1" />
                        Iniciar Caso {selectedDifficulty === 'easy' ? 'Fácil' : selectedDifficulty === 'medium' ? 'Médio' : 'Difícil'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // ─── History View ─────────────────────────────────────────────
  if (view === 'history') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setView('menu')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <h2 className="text-lg font-display font-bold">Histórico de Casos</h2>
        </div>
        {!caseHistory?.length ? (
          <Card className="border-border/50"><CardContent className="p-8 text-center text-muted-foreground">Nenhum caso realizado ainda.</CardContent></Card>
        ) : (
          <div className="space-y-3">
            {caseHistory.map((c: any) => (
              <Card key={c.id} className="border-border/50 hover:border-border/80 transition-all">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{c.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{c.specialty}</Badge>
                      <Badge variant="outline" className="text-xs">{c.difficulty === 'easy' ? 'Fácil' : c.difficulty === 'medium' ? 'Médio' : 'Difícil'}</Badge>
                      {c.currentPhase === 'completed' && c.score != null && (
                        <Badge className={`text-xs ${c.score >= 70 ? 'bg-green-500/20 text-green-400' : c.score >= 40 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                          {c.score}/100
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString('pt-BR')}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── Completion View ──────────────────────────────────────────
  const phaseIndex = PHASES.findIndex(p => p.id === currentPhase);
  const currentPhaseInfo = PHASES[phaseIndex];

  if (showCompletion && evaluation) {
    const totalCorrect = Object.values(phaseScores).reduce((s, v) => s + v.correct, 0);
    const totalQuestions = Object.values(phaseScores).reduce((s, v) => s + v.total, 0);
    const evalData = evaluation.evaluation || {};

    return (
      <div className="space-y-6">
        <Card className="border-teal-500/30 bg-gradient-to-br from-teal-500/10 to-transparent overflow-hidden">
          <CardContent className="p-8 text-center space-y-4">
            <Trophy className="w-16 h-16 text-teal-400 mx-auto" />
            <h2 className="text-2xl font-display font-bold text-foreground">Caso Finalizado!</h2>
            <div className="text-5xl font-bold text-teal-400">{evalData.score || 0}/100</div>
            <p className="text-sm text-muted-foreground">+{evaluation.xpEarned} XP ganhos</p>

            {/* Phase Scores */}
            {totalQuestions > 0 && (
              <div className="flex justify-center gap-3 flex-wrap">
                {Object.entries(phaseScores).map(([phase, score]) => (
                  <div key={phase} className="px-3 py-2 rounded-lg bg-background/50 border border-border/30 text-xs">
                    <span className="text-muted-foreground">{PHASES.find(p => p.id === phase)?.label}:</span>
                    <span className={`ml-1 font-bold ${score.correct === score.total ? 'text-green-400' : 'text-yellow-400'}`}>
                      {score.correct}/{score.total}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Feedback */}
            <div className="text-left max-w-lg mx-auto mt-4 p-4 rounded-lg bg-background/50 border border-border/50">
              <Streamdown>{evalData.feedback || 'Avaliação não disponível.'}</Streamdown>
            </div>

            {/* Learning Points */}
            {evalData.learningPoints && evalData.learningPoints.length > 0 && (
              <div className="text-left max-w-lg mx-auto p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <h4 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> Pontos de Aprendizado
                </h4>
                <ul className="space-y-1">
                  {evalData.learningPoints.map((point: string, i: number) => (
                    <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* References */}
            {evalData.references && evalData.references.length > 0 && (
              <div className="text-left max-w-lg mx-auto p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-1">
                  <BookOpen className="w-4 h-4" /> Referências Bibliográficas
                </h4>
                <div className="space-y-2">
                  {evalData.references.map((ref: Reference, i: number) => (
                    <div key={i} className="text-xs text-foreground/70">
                      <span className="font-medium text-blue-300">{ref.book}</span>
                      {ref.chapter && <span> — Cap. {ref.chapter}</span>}
                      {ref.keyPoint && <span className="block text-muted-foreground mt-0.5 italic">"{ref.keyPoint}"</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={() => { setView('menu'); setShowCompletion(false); setEvaluation(null); }} className="mt-4 bg-teal-600 hover:bg-teal-700">
              Novo Caso
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Active Case View ─────────────────────────────────────────
  const phaseQuestions = caseData?.phaseQuestions?.[currentPhase] || [];
  const phaseMessages = messages.filter(m => m.phase === currentPhase);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setView('menu')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h3 className="font-semibold text-foreground">{caseData?.title || 'Caso Clínico'}</h3>
            <p className="text-xs text-muted-foreground">{caseData?.patientInfo?.chiefComplaint}</p>
          </div>
        </div>
        {/* Phase Score */}
        {Object.keys(phaseScores).length > 0 && (
          <div className="flex items-center gap-1">
            {Object.entries(phaseScores).map(([phase, score]) => (
              <div key={phase} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                score.correct === score.total ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {score.correct}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Visual Patient Card */}
      {caseData?.patientInfo && (
        <Card className="border-border/50 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-teal-500/20 border-2 border-teal-500/30 flex items-center justify-center">
                <User className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Paciente {caseData.patientInfo.sex === 'M' ? 'Masculino' : 'Feminino'}, {caseData.patientInfo.age} anos
                </p>
                <p className="text-xs text-muted-foreground">QP: {caseData.patientInfo.chiefComplaint}</p>
              </div>
            </div>

            {/* Vital Signs Grid */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {Object.entries(caseData.patientInfo.vitalSigns || {}).map(([key, val]) => {
                const iconData = vitalSignIcons[key] || { icon: Activity, color: 'text-muted-foreground' };
                return <VitalSignCard key={key} label={key} value={val} icon={iconData.icon} color={iconData.color} />;
              })}
            </div>
          </div>

          {/* Patient History (collapsible) */}
          {caseData.patientInfo.history && (
            <div className="px-4 py-3 border-t border-border/20 text-xs text-foreground/80 space-y-1">
              <p><span className="font-medium text-foreground">HDA:</span> {caseData.patientInfo.history}</p>
              {caseData.patientInfo.pastHistory && <p><span className="font-medium text-foreground">AP:</span> {caseData.patientInfo.pastHistory}</p>}
              {caseData.patientInfo.medications && caseData.patientInfo.medications.length > 0 && (
                <p><span className="font-medium text-foreground">Medicações:</span> {caseData.patientInfo.medications.join(', ')}</p>
              )}
              {caseData.patientInfo.familyHistory && <p><span className="font-medium text-foreground">HF:</span> {caseData.patientInfo.familyHistory}</p>}
            </div>
          )}
        </Card>
      )}

      {/* References Bar */}
      {caseData?.references && caseData.references.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {caseData.references.slice(0, 3).map((ref, i) => (
            <ReferenceBadge key={i} ref={ref} />
          ))}
        </div>
      )}

      {/* Phase Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {PHASES.map((phase, i) => {
          const Icon = phase.icon;
          const isActive = phase.id === currentPhase;
          const isPast = i < phaseIndex;
          const score = phaseScores[phase.id];
          return (
            <button
              key={phase.id}
              onClick={() => setCurrentPhase(phase.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' :
                isPast ? 'bg-muted/50 text-foreground' : 'text-muted-foreground hover:bg-muted/30'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? phase.color : ''}`} />
              {phase.label}
              {score && (
                <span className={`ml-1 text-[10px] ${score.correct === score.total ? 'text-green-400' : 'text-yellow-400'}`}>
                  {score.correct}/{score.total}
                </span>
              )}
              {i < PHASES.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground/50" />}
            </button>
          );
        })}
      </div>

      {/* Phase Questions (Multiple Choice) */}
      {phaseQuestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Questão da Fase — Responda antes de prosseguir
          </h4>
          {phaseQuestions.map((q, i) => (
            <PhaseQuestionCard key={`${currentPhase}-${i}`} question={q} onAnswer={(correct) => handlePhaseQuestionAnswer(currentPhase, correct)} />
          ))}
        </div>
      )}

      {/* Physical Exam Results (shown in physical_exam phase) */}
      {currentPhase === 'physical_exam' && caseData?.physicalExam && (
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-4">
            <h4 className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5" /> Achados do Exame Físico
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(caseData.physicalExam).filter(([_, v]) => v).map(([key, val]) => (
                <div key={key} className="text-xs p-2 rounded bg-background/30 border border-border/20">
                  <span className="font-medium text-green-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="text-foreground/80 ml-1">{val}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lab Results (shown in lab_tests phase) */}
      {currentPhase === 'lab_tests' && caseData?.labResults && (
        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardContent className="p-4">
            <h4 className="text-xs font-semibold text-purple-400 mb-2 flex items-center gap-1">
              <FlaskConical className="w-3.5 h-3.5" /> Resultados de Exames
            </h4>
            <div className="space-y-2">
              {Object.entries(caseData.labResults).filter(([_, v]) => v).map(([key, val]) => (
                <div key={key} className="text-xs p-2 rounded bg-background/30 border border-border/20">
                  <span className="font-medium text-purple-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="text-foreground/80 ml-1">{val}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Area */}
      <Card className="border-border/50 min-h-[250px] max-h-[350px] flex flex-col">
        <CardContent className="p-4 flex-1 overflow-y-auto space-y-3">
          {phaseMessages.length === 0 && (
            <div className="text-center text-muted-foreground py-6">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-teal-400/50" />
              <p className="text-sm">{currentPhaseInfo?.hint}</p>
              <p className="text-xs mt-1 text-muted-foreground/60">Converse livremente com o paciente/caso</p>
            </div>
          )}
          {phaseMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white'
                  : 'bg-muted/50 text-foreground border border-border/30'
              }`}>
                {msg.role === 'assistant' ? <Streamdown>{msg.content}</Streamdown> : msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted/50 rounded-xl px-4 py-3 border border-border/30">
                <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </CardContent>

        {/* Input */}
        <div className="p-3 border-t border-border/30">
          {currentPhase === 'treatment' ? (
            <div className="space-y-3">
              <Textarea
                placeholder="Seu diagnóstico final..."
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                className="resize-none text-sm"
                rows={2}
              />
              <Textarea
                placeholder="Conduta/tratamento proposto..."
                value={treatmentInput}
                onChange={e => setTreatmentInput(e.target.value)}
                className="resize-none text-sm"
                rows={2}
              />
              <div className="flex gap-2">
                <Button onClick={handleSend} disabled={!input.trim() || isLoading} variant="outline" className="flex-1">
                  <Send className="w-4 h-4 mr-1" /> Discutir
                </Button>
                <Button onClick={handleComplete} disabled={!diagnosis.trim() || isLoading} className="flex-1 bg-teal-600 hover:bg-teal-700">
                  <Trophy className="w-4 h-4 mr-1" /> Finalizar Caso
                </Button>
              </div>
              <Textarea
                placeholder="Pergunte algo antes de finalizar..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                className="resize-none text-sm"
                rows={1}
              />
            </div>
          ) : (
            <div className="flex gap-2">
              <Textarea
                placeholder={currentPhaseInfo?.hint || 'Digite sua mensagem...'}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                className="resize-none text-sm flex-1"
                rows={2}
              />
              <Button onClick={handleSend} disabled={!input.trim() || isLoading} className="bg-teal-600 hover:bg-teal-700 self-end">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ClinicalCases;
