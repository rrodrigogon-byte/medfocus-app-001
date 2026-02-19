/**
 * Modo Batalha de Questões — Duelo 1v1 entre alunos com questões aleatórias
 */
import React, { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { REAL_QUESTIONS } from '@/data/realQuestions';
import {
  Swords, Trophy, Copy, Users, ArrowLeft, Loader2,
  CheckCircle, XCircle, Clock, Share2, Zap
} from 'lucide-react';

const QuestionBattle: React.FC = () => {
  const [view, setView] = useState<'menu' | 'waiting' | 'playing' | 'result' | 'history'>('menu');
  const [battleId, setBattleId] = useState<number | null>(null);
  const [inviteCode, setInviteCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(10);

  const createBattle = trpc.battle.create.useMutation();
  const joinBattle = trpc.battle.join.useMutation();
  const answerQuestion = trpc.battle.answer.useMutation();
  const { data: battleHistory } = trpc.battle.list.useQuery();

  // Get random questions for the battle (client-side for solo practice)
  const battleQuestions = useMemo(() => {
    const shuffled = [...REAL_QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, totalQuestions);
  }, [totalQuestions, battleId]);

  const handleCreate = async () => {
    try {
      const result = await createBattle.mutateAsync({ totalQuestions });
      setBattleId(result.battleId);
      setInviteCode(result.inviteCode);
      setView('waiting');
      toast.success('Batalha criada! Compartilhe o código.');
    } catch {
      toast.error('Erro ao criar batalha');
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    try {
      const result = await joinBattle.mutateAsync({ code: joinCode });
      setBattleId(result.battleId);
      setCurrentQIndex(0);
      setMyScore(0);
      setAnswers({});
      setView('playing');
      toast.success('Entrou na batalha!');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao entrar na batalha');
    }
  };

  const handleStartSolo = () => {
    setCurrentQIndex(0);
    setMyScore(0);
    setAnswers({});
    setSelectedAnswer(null);
    setShowExplanation(false);
    setView('playing');
  };

  const handleAnswer = async (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    const q = battleQuestions[currentQIndex];
    if (!q) return;
    const correctIdx = q.options.findIndex(o => o.letter === q.correctAnswer);
    const isCorrect = answerIndex === correctIdx;
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    if (isCorrect) setMyScore(prev => prev + 1);
    setAnswers(prev => ({ ...prev, [currentQIndex]: answerIndex }));

    if (battleId) {
      try {
        await answerQuestion.mutateAsync({ battleId, questionIndex: currentQIndex, answerIndex, isCorrect });
      } catch {}
    }
  };

  const handleNext = () => {
    if (currentQIndex + 1 >= battleQuestions.length) {
      setView('result');
      return;
    }
    setCurrentQIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    toast.success('Código copiado!');
  };

  // ─── Menu ─────────────────────────────────────────────────────
  if (view === 'menu') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
              <Swords className="w-6 h-6 text-orange-400" />
              Modo Batalha
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Desafie colegas em duelos de questões médicas
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setView('history')}>
            <Clock className="w-4 h-4 mr-1" /> Histórico
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Create Battle */}
          <Card className="border-orange-500/20 hover:border-orange-500/40 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Criar Batalha</h3>
                  <p className="text-xs text-muted-foreground">Gere um código e convide um colega</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Questões:</span>
                {[5, 10, 15, 20].map(n => (
                  <Button key={n} size="sm" variant={totalQuestions === n ? 'default' : 'outline'}
                    className={totalQuestions === n ? 'bg-orange-600 hover:bg-orange-700' : ''}
                    onClick={() => setTotalQuestions(n)}>{n}</Button>
                ))}
              </div>
              <Button onClick={handleCreate} disabled={createBattle.isPending} className="w-full bg-orange-600 hover:bg-orange-700">
                {createBattle.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Swords className="w-4 h-4 mr-1" />}
                Criar Batalha
              </Button>
            </CardContent>
          </Card>

          {/* Join Battle */}
          <Card className="border-blue-500/20 hover:border-blue-500/40 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Entrar em Batalha</h3>
                  <p className="text-xs text-muted-foreground">Use o código de um colega</p>
                </div>
              </div>
              <Input placeholder="Código da batalha (ex: ABC123)" value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())} className="text-center font-mono text-lg" />
              <Button onClick={handleJoin} disabled={!joinCode.trim() || joinBattle.isPending} className="w-full" variant="outline">
                {joinBattle.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                Entrar na Batalha
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Solo Practice */}
        <Card className="border-border/50">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Treino Solo</h3>
              <p className="text-xs text-muted-foreground">Pratique sozinho com {totalQuestions} questões aleatórias</p>
            </div>
            <Button onClick={handleStartSolo} variant="outline">
              Iniciar Treino
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Waiting for opponent ─────────────────────────────────────
  if (view === 'waiting') {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setView('menu')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        <Card className="border-orange-500/20">
          <CardContent className="p-8 text-center space-y-4">
            <Swords className="w-16 h-16 text-orange-400 mx-auto animate-pulse" />
            <h2 className="text-xl font-display font-bold">Aguardando Oponente</h2>
            <p className="text-muted-foreground">Compartilhe o código abaixo com seu colega:</p>
            <div className="flex items-center justify-center gap-3">
              <div className="text-4xl font-mono font-bold text-orange-400 tracking-widest bg-orange-500/10 px-6 py-3 rounded-xl">
                {inviteCode}
              </div>
              <Button size="sm" variant="outline" onClick={copyCode}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={handleStartSolo} variant="outline" className="mt-4">
              Começar sozinho enquanto espera
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Playing ──────────────────────────────────────────────────
  if (view === 'playing') {
    const q = battleQuestions[currentQIndex];
    if (!q) return null;
    const options = q.options;
    const progress = ((currentQIndex + 1) / battleQuestions.length) * 100;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setView('menu')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Sair
          </Button>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">{currentQIndex + 1}/{battleQuestions.length}</Badge>
            <Badge className="bg-orange-500/20 text-orange-400 text-xs">
              <Trophy className="w-3 h-3 mr-1" /> {myScore}
            </Badge>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {/* Question */}
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs">{q.area}</Badge>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{q.text}</p>
          </CardContent>
        </Card>

        {/* Options */}
        <div className="space-y-2">
          {options.map((opt, i) => {
            const isSelected = selectedAnswer === i;
            const correctIdx2 = q.options.findIndex(o => o.letter === q.correctAnswer);
    const isCorrect = i === correctIdx2;
            const showResult = showExplanation;
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-4 rounded-xl border transition-all text-sm ${
                  showResult && isCorrect ? 'bg-green-500/10 border-green-500/40 text-green-400' :
                  showResult && isSelected && !isCorrect ? 'bg-red-500/10 border-red-500/40 text-red-400' :
                  isSelected ? 'bg-teal-500/10 border-teal-500/40' :
                  'bg-card/50 border-border/30 hover:border-border/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs mt-0.5 opacity-60">{String.fromCharCode(65 + i)}</span>
                  <span className="flex-1">{typeof opt === 'string' ? opt : opt.text}</span>
                  {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <Card className="border-teal-500/20 bg-teal-500/5">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-teal-400 mb-1">Resposta correta:</p>
              <p className="text-sm text-foreground/80">{q.correctAnswer}) {q.options.find(o => o.letter === q.correctAnswer)?.text}</p>
            </CardContent>
          </Card>
        )}

        {showExplanation && (
          <Button onClick={handleNext} className="w-full bg-orange-600 hover:bg-orange-700">
            {currentQIndex + 1 >= battleQuestions.length ? 'Ver Resultado' : 'Próxima Questão'}
          </Button>
        )}
      </div>
    );
  }

  // ─── Result ───────────────────────────────────────────────────
  if (view === 'result') {
    const percentage = Math.round((myScore / battleQuestions.length) * 100);
    return (
      <div className="space-y-6">
        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardContent className="p-8 text-center space-y-4">
            <Trophy className={`w-16 h-16 mx-auto ${percentage >= 70 ? 'text-yellow-400' : percentage >= 40 ? 'text-orange-400' : 'text-muted-foreground'}`} />
            <h2 className="text-2xl font-display font-bold text-foreground">Batalha Finalizada!</h2>
            <div className="text-5xl font-bold text-orange-400">{myScore}/{battleQuestions.length}</div>
            <p className="text-muted-foreground">{percentage}% de acerto</p>
            <div className="flex gap-3 justify-center mt-4">
              <Button onClick={() => { setView('menu'); setBattleId(null); }} variant="outline">
                Voltar ao Menu
              </Button>
              <Button onClick={handleStartSolo} className="bg-orange-600 hover:bg-orange-700">
                Jogar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── History ──────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => setView('menu')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        <h2 className="text-lg font-display font-bold">Histórico de Batalhas</h2>
      </div>
      {!battleHistory?.length ? (
        <Card className="border-border/50"><CardContent className="p-8 text-center text-muted-foreground">Nenhuma batalha realizada.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {battleHistory.map((b: any) => (
            <Card key={b.id} className="border-border/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Batalha #{b.id}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{b.totalQuestions} questões</Badge>
                    <Badge variant="outline" className="text-xs">{b.status}</Badge>
                  </div>
                </div>
                <span className="text-sm font-mono text-muted-foreground">{b.inviteCode}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionBattle;
