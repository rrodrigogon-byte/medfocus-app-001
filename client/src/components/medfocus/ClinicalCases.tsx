/**
 * Casos Clínicos Interativos — Simulador de raciocínio clínico com IA
 * O aluno recebe um caso e interage passo a passo: anamnese → exame físico → exames → hipótese → conduta
 */
import React, { useState, useRef, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Streamdown } from 'streamdown';
import {
  Stethoscope, Brain, FlaskConical, ClipboardList, Pill,
  ChevronRight, Trophy, Loader2, Send, ArrowLeft, Sparkles,
  User, Heart, Activity, ThermometerSun, Clock
} from 'lucide-react';

const SPECIALTIES = [
  { id: 'Clínica Médica', icon: '🫀', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  { id: 'Cirurgia', icon: '🔪', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  { id: 'Pediatria', icon: '👶', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { id: 'Ginecologia e Obstetrícia', icon: '🤰', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  { id: 'Saúde Coletiva', icon: '🏥', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  { id: 'Medicina de Família', icon: '👨‍⚕️', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  { id: 'Psiquiatria', icon: '🧠', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { id: 'Ortopedia', icon: '🦴', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
];

const PHASES = [
  { id: 'anamnesis' as const, label: 'Anamnese', icon: ClipboardList, hint: 'Faça perguntas ao paciente sobre sintomas, histórico, medicações...' },
  { id: 'physical_exam' as const, label: 'Exame Físico', icon: Stethoscope, hint: 'Descreva o exame que deseja realizar (ausculta, palpação, etc.)' },
  { id: 'lab_tests' as const, label: 'Exames', icon: FlaskConical, hint: 'Solicite exames laboratoriais ou de imagem' },
  { id: 'hypothesis' as const, label: 'Hipótese', icon: Brain, hint: 'Formule suas hipóteses diagnósticas' },
  { id: 'treatment' as const, label: 'Conduta', icon: Pill, hint: 'Proponha o tratamento e conduta' },
];

type PhaseId = typeof PHASES[number]['id'];

interface CaseData {
  title: string;
  patientInfo: {
    age: number;
    sex: string;
    chiefComplaint: string;
    vitalSigns: Record<string, string>;
  };
  correctDiagnosis?: string;
  keyFindings?: string[];
  differentialDiagnoses?: string[];
  recommendedTests?: string[];
  treatment?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  phase: PhaseId;
}

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
  const [treatment, setTreatment] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const startCase = trpc.clinicalCase.start.useMutation();
  const interact = trpc.clinicalCase.interact.useMutation();
  const completeCase = trpc.clinicalCase.complete.useMutation();
  const { data: caseHistory, refetch: refetchHistory } = trpc.clinicalCase.list.useQuery();

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
        setView('active');
        toast.success('Caso clínico gerado!');
      }
    } catch (e) {
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

  const handleComplete = async () => {
    if (!activeCaseId || !diagnosis.trim()) {
      toast.error('Informe seu diagnóstico');
      return;
    }
    setIsLoading(true);
    try {
      const result = await completeCase.mutateAsync({ caseId: activeCaseId, diagnosis, treatment });
      setEvaluation(result);
      setShowCompletion(true);
      refetchHistory();
    } catch {
      toast.error('Erro ao finalizar caso');
    }
    setIsLoading(false);
  };

  // ─── Menu View ────────────────────────────────────────────────
  if (view === 'menu') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-teal-400" />
              Casos Clínicos Interativos
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Pratique raciocínio clínico com pacientes virtuais gerados por IA
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setView('history')}>
            <Clock className="w-4 h-4 mr-1" /> Histórico
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SPECIALTIES.map(spec => (
            <Card key={spec.id} className="border-border/50 hover:border-teal-500/30 transition-all cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{spec.icon}</span>
                  <h3 className="font-semibold text-foreground">{spec.id}</h3>
                </div>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'hard'] as const).map(diff => (
                    <Button
                      key={diff}
                      size="sm"
                      variant="outline"
                      className={`flex-1 text-xs ${diff === 'easy' ? 'hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30' : diff === 'medium' ? 'hover:bg-yellow-500/10 hover:text-yellow-400 hover:border-yellow-500/30' : 'hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'}`}
                      onClick={() => handleStartCase(spec.id, diff)}
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : diff === 'easy' ? 'Fácil' : diff === 'medium' ? 'Médio' : 'Difícil'}
                    </Button>
                  ))}
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
              <Card key={c.id} className="border-border/50">
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

  // ─── Active Case View ─────────────────────────────────────────
  const phaseIndex = PHASES.findIndex(p => p.id === currentPhase);
  const currentPhaseInfo = PHASES[phaseIndex];

  if (showCompletion && evaluation) {
    return (
      <div className="space-y-6">
        <Card className="border-teal-500/30 bg-teal-500/5">
          <CardContent className="p-8 text-center space-y-4">
            <Trophy className="w-16 h-16 text-teal-400 mx-auto" />
            <h2 className="text-2xl font-display font-bold text-foreground">Caso Finalizado!</h2>
            <div className="text-5xl font-bold text-teal-400">{evaluation.evaluation?.score || 0}/100</div>
            <p className="text-sm text-muted-foreground">+{evaluation.xpEarned} XP ganhos</p>
            <div className="text-left max-w-lg mx-auto mt-4 p-4 rounded-lg bg-background/50 border border-border/50">
              <Streamdown>{evaluation.evaluation?.feedback || 'Avaliação não disponível.'}</Streamdown>
            </div>
            <Button onClick={() => { setView('menu'); setShowCompletion(false); setEvaluation(null); }} className="mt-4 bg-teal-600 hover:bg-teal-700">
              Novo Caso
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
      </div>

      {/* Patient Info Card */}
      {caseData?.patientInfo && (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{caseData.patientInfo.sex === 'M' ? 'Masculino' : 'Feminino'}, {caseData.patientInfo.age} anos</span>
              </div>
              {Object.entries(caseData.patientInfo.vitalSigns || {}).map(([key, val]) => (
                <div key={key} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Activity className="w-3 h-3" />
                  <span className="font-medium">{key}:</span> {val}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Phase Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {PHASES.map((phase, i) => {
          const Icon = phase.icon;
          const isActive = phase.id === currentPhase;
          const isPast = i < phaseIndex;
          return (
            <button
              key={phase.id}
              onClick={() => setCurrentPhase(phase.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' :
                isPast ? 'bg-muted/50 text-foreground' : 'text-muted-foreground hover:bg-muted/30'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {phase.label}
              {i < PHASES.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground/50" />}
            </button>
          );
        })}
      </div>

      {/* Chat Area */}
      <Card className="border-border/50 min-h-[350px] max-h-[450px] flex flex-col">
        <CardContent className="p-4 flex-1 overflow-y-auto space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-teal-400/50" />
              <p className="text-sm">{currentPhaseInfo?.hint}</p>
            </div>
          )}
          {messages.filter(m => m.phase === currentPhase || true).map((msg, i) => (
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
                value={treatment}
                onChange={e => setTreatment(e.target.value)}
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
