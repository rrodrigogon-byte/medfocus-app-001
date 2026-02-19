/**
 * Modo Batalha — Duelo de Questões em Tempo Real via WebSocket
 * Matchmaking, convite por código, sincronização de respostas, placar ao vivo
 */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { REAL_QUESTIONS } from '@/data/realQuestions';
import {
  Swords, Trophy, Loader2, Copy, ArrowLeft, Zap, Clock,
  CheckCircle, XCircle, Users, Shield, Crown, Timer, Wifi, WifiOff, Share2
} from 'lucide-react';

interface QuestionData {
  id: string;
  text: string;
  options: { letter: string; text: string }[];
  correctAnswer: string;
  area: string;
  source: string;
}

type BattleView = 'menu' | 'waiting' | 'playing' | 'result' | 'solo' | 'history';

const SPECIALTIES = [
  'Clínica Médica', 'Cirurgia', 'Pediatria', 'Ginecologia e Obstetrícia',
  'Saúde Coletiva', 'Medicina de Família', 'Psiquiatria', 'Ortopedia',
];

const QuestionBattle: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<BattleView>('menu');
  const [connected, setConnected] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(10);

  // Real-time battle state
  const [hostName, setHostName] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hostScore, setHostScore] = useState(0);
  const [guestScore, setGuestScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswerResult, setShowAnswerResult] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [opponentAnswered, setOpponentAnswered] = useState(false);
  const [rtTimer, setRtTimer] = useState(30);
  const [battleResult, setBattleResult] = useState<any>(null);
  const [waitingNext, setWaitingNext] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(0);

  // Solo mode state
  const [soloQIndex, setSoloQIndex] = useState(0);
  const [soloScore, setSoloScore] = useState(0);
  const [soloSelected, setSoloSelected] = useState<number | null>(null);
  const [soloShowExplanation, setSoloShowExplanation] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const msgHandlerRef = useRef<(msg: any) => void>(() => {});

  const { data: battleHistory } = trpc.battle.list.useQuery();

  const soloQuestions = useMemo(() => {
    const shuffled = [...REAL_QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, totalQuestions);
  }, [totalQuestions, view]);

  // ─── WebSocket Connection ─────────────────────────────────────
  useEffect(() => {
    msgHandlerRef.current = (msg: any) => {
      switch (msg.type) {
        case 'room_created':
          setRoomCode(msg.code);
          setIsHost(true);
          setView('waiting');
          break;
        case 'waiting_for_opponent':
          setView('waiting');
          break;
        case 'joined_room':
          setRoomCode(msg.code);
          setHostName(msg.hostName);
          setIsHost(false);
          setView('waiting');
          toast.success(`Entrou na sala de ${msg.hostName}!`);
          break;
        case 'player_joined':
          setGuestName(msg.guestName);
          toast.success(`${msg.guestName} entrou na batalha!`);
          break;
        case 'battle_started':
          setView('playing');
          setHostName(msg.hostName);
          setGuestName(msg.guestName);
          setCurrentQuestion(msg.question);
          setQuestionIndex(msg.questionIndex);
          setHostScore(0);
          setGuestScore(0);
          setSelectedAnswer(null);
          setShowAnswerResult(false);
          setOpponentAnswered(false);
          setWaitingNext(false);
          setRtTimer(30);
          setQuestionStartTime(Date.now());
          toast.success('Batalha iniciada!');
          break;
        case 'opponent_answered':
          setOpponentAnswered(true);
          break;
        case 'answer_result':
          setCorrectAnswer(msg.correctAnswer);
          setShowAnswerResult(true);
          setHostScore(msg.hostScore);
          setGuestScore(msg.guestScore);
          break;
        case 'question_complete':
          setWaitingNext(true);
          setHostScore(msg.hostScore);
          setGuestScore(msg.guestScore);
          break;
        case 'next_question':
          setCurrentQuestion(msg.question);
          setQuestionIndex(msg.questionIndex);
          setHostScore(msg.hostScore);
          setGuestScore(msg.guestScore);
          setSelectedAnswer(null);
          setShowAnswerResult(false);
          setCorrectAnswer(null);
          setOpponentAnswered(false);
          setWaitingNext(false);
          setRtTimer(30);
          setQuestionStartTime(Date.now());
          break;
        case 'battle_complete':
          setBattleResult(msg);
          setView('result');
          break;
        case 'opponent_disconnected':
          toast.error('Oponente desconectou');
          setView('menu');
          break;
        case 'error':
          toast.error(msg.message);
          break;
      }
    };
  }, []);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/battle`);
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        msgHandlerRef.current(msg);
      } catch {}
    };
    wsRef.current = ws;
    return () => { ws.close(); if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Timer for real-time battles
  useEffect(() => {
    if (view === 'playing' && !showAnswerResult && !waitingNext) {
      timerRef.current = setInterval(() => {
        setRtTimer(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [view, showAnswerResult, waitingNext, questionIndex]);

  const send = (msg: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  };

  // ─── Actions ──────────────────────────────────────────────────
  const handleCreateRoom = () => {
    send({ type: 'create_room', userId: user?.id?.toString() || 'anon', userName: user?.name || 'Jogador', totalQuestions, specialty });
  };

  const handleJoinRoom = () => {
    if (!joinCode.trim()) { toast.error('Digite o código da sala'); return; }
    send({ type: 'join_room', code: joinCode.trim(), userId: user?.id?.toString() || 'anon', userName: user?.name || 'Jogador' });
  };

  const handleQuickMatch = () => {
    send({ type: 'quick_match', userId: user?.id?.toString() || 'anon', userName: user?.name || 'Jogador', totalQuestions, specialty });
  };

  const handleStartBattle = () => { send({ type: 'start_battle' }); };

  const handleRtAnswer = (letter: string) => {
    if (selectedAnswer || showAnswerResult) return;
    setSelectedAnswer(letter);
    if (timerRef.current) clearInterval(timerRef.current);
    send({ type: 'answer', questionIndex, answerLetter: letter, timeMs: Date.now() - questionStartTime });
  };

  const copyCode = () => { navigator.clipboard.writeText(roomCode); toast.success('Código copiado!'); };

  // Solo handlers
  const handleSoloAnswer = (idx: number) => {
    if (soloSelected !== null) return;
    const q = soloQuestions[soloQIndex];
    const correctIdx = q.options.findIndex(o => o.letter === q.correctAnswer);
    setSoloSelected(idx);
    setSoloShowExplanation(true);
    if (idx === correctIdx) setSoloScore(prev => prev + 1);
  };

  const handleSoloNext = () => {
    if (soloQIndex + 1 >= soloQuestions.length) {
      setBattleResult({ winner: 'solo', hostScore: soloScore, totalQuestions: soloQuestions.length });
      setView('result');
      return;
    }
    setSoloQIndex(prev => prev + 1);
    setSoloSelected(null);
    setSoloShowExplanation(false);
  };

  // ─── Menu View ────────────────────────────────────────────────
  if (view === 'menu') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
              <Swords className="w-6 h-6 text-orange-400" /> Modo Batalha
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Duelo de questões em tempo real contra outros estudantes</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs ${connected ? 'text-green-400 border-green-500/30' : 'text-red-400 border-red-500/30'}`}>
              {connected ? <><Wifi className="w-3 h-3 mr-1" /> Online</> : <><WifiOff className="w-3 h-3 mr-1" /> Offline</>}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setView('history')}>
              <Clock className="w-4 h-4 mr-1" /> Histórico
            </Button>
          </div>
        </div>

        {/* Settings */}
        <Card className="border-border/50">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Configurações</h3>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Número de questões</label>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map(n => (
                  <button key={n} onClick={() => setTotalQuestions(n)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${totalQuestions === n ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'border-border/30 text-muted-foreground hover:border-border/60'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Especialidade (opcional)</label>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setSpecialty(null)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${!specialty ? 'bg-teal-500/20 text-teal-400 border-teal-500/30' : 'border-border/30 text-muted-foreground hover:border-border/60'}`}>
                  Todas
                </button>
                {SPECIALTIES.map(s => (
                  <button key={s} onClick={() => setSpecialty(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${specialty === s ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'border-border/30 text-muted-foreground hover:border-border/60'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-orange-500/20 hover:border-orange-500/40 transition-all cursor-pointer group" onClick={handleQuickMatch}>
            <CardContent className="p-5 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="font-semibold text-foreground">Partida Rápida</h3>
              <p className="text-xs text-muted-foreground">Encontre um oponente automaticamente</p>
            </CardContent>
          </Card>

          <Card className="border-teal-500/20 hover:border-teal-500/40 transition-all cursor-pointer group" onClick={handleCreateRoom}>
            <CardContent className="p-5 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-teal-400" />
              </div>
              <h3 className="font-semibold text-foreground">Criar Sala</h3>
              <p className="text-xs text-muted-foreground">Convide um amigo por código</p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/20 hover:border-purple-500/40 transition-all">
            <CardContent className="p-5 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto">
                <Users className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="font-semibold text-foreground">Entrar na Sala</h3>
              <div className="flex gap-2">
                <Input placeholder="Código" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} className="text-center text-sm uppercase font-mono" maxLength={6} />
                <Button size="sm" onClick={handleJoinRoom} className="bg-purple-600 hover:bg-purple-700">Entrar</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer group" onClick={() => { setSoloQIndex(0); setSoloScore(0); setSoloSelected(null); setSoloShowExplanation(false); setView('solo'); }}>
            <CardContent className="p-5 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground">Treino Solo</h3>
              <p className="text-xs text-muted-foreground">Pratique sozinho</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ─── Waiting View ─────────────────────────────────────────────
  if (view === 'waiting') {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setView('menu')}><ArrowLeft className="w-4 h-4 mr-1" /> Voltar</Button>
        <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto animate-pulse">
              <Swords className="w-10 h-10 text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-foreground">Aguardando Oponente</h2>
              <p className="text-sm text-muted-foreground mt-1">Compartilhe o código abaixo</p>
            </div>
            {roomCode && (
              <div className="flex items-center justify-center gap-3">
                <div className="px-6 py-3 rounded-xl bg-background border-2 border-orange-500/30 font-mono text-2xl font-bold text-orange-400 tracking-[0.3em]">{roomCode}</div>
                <Button variant="outline" size="sm" onClick={copyCode}><Copy className="w-4 h-4" /></Button>
              </div>
            )}
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-2"><Crown className="w-6 h-6 text-teal-400" /></div>
                <p className="text-sm font-medium text-foreground">{isHost ? (user?.name || 'Você') : hostName}</p>
                <Badge variant="outline" className="text-[10px] text-teal-400 border-teal-500/30">Host</Badge>
              </div>
              <Swords className="w-6 h-6 text-muted-foreground" />
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-2">
                  {guestName ? <Users className="w-6 h-6 text-purple-400" /> : <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />}
                </div>
                <p className="text-sm font-medium text-foreground">{guestName || 'Aguardando...'}</p>
              </div>
            </div>
            {isHost && guestName && (
              <Button onClick={handleStartBattle} className="bg-orange-600 hover:bg-orange-700 text-white">
                <Zap className="w-4 h-4 mr-1" /> Iniciar Batalha!
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Real-time Playing View ───────────────────────────────────
  if (view === 'playing' && currentQuestion) {
    return (
      <div className="space-y-4">
        {/* Scoreboard */}
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-teal-500/10 via-transparent to-purple-500/10 border border-border/30">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">{isHost ? 'Você' : hostName}</p>
            <p className="text-2xl font-bold text-teal-400">{hostScore}</p>
          </div>
          <div className="text-center">
            <Badge variant="outline" className="text-xs text-muted-foreground">{questionIndex + 1}/{totalQuestions}</Badge>
            <div className={`mt-1 text-lg font-bold font-mono ${rtTimer <= 5 ? 'text-red-400 animate-pulse' : rtTimer <= 10 ? 'text-yellow-400' : 'text-foreground'}`}>
              <Timer className="w-4 h-4 inline mr-1" />{rtTimer}s
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">{isHost ? guestName : 'Você'}</p>
            <p className="text-2xl font-bold text-purple-400">{guestScore}</p>
          </div>
        </div>

        {opponentAnswered && !showAnswerResult && (
          <div className="text-center text-xs text-amber-400 animate-pulse">Oponente já respondeu!</div>
        )}

        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-[10px]">{currentQuestion.area}</Badge>
              <Badge variant="outline" className="text-[10px]">{currentQuestion.source}</Badge>
            </div>
            <p className="text-sm text-foreground leading-relaxed mb-4">{currentQuestion.text}</p>
            <div className="space-y-2">
              {currentQuestion.options.map(opt => {
                const isSelected = selectedAnswer === opt.letter;
                const isCorrectOpt = showAnswerResult && opt.letter === correctAnswer;
                const isWrong = showAnswerResult && isSelected && opt.letter !== correctAnswer;
                return (
                  <button key={opt.letter} onClick={() => handleRtAnswer(opt.letter)} disabled={!!selectedAnswer || showAnswerResult}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border flex items-center gap-3 ${
                      isCorrectOpt ? 'bg-green-500/15 border-green-500/40 text-green-300' :
                      isWrong ? 'bg-red-500/15 border-red-500/40 text-red-300' :
                      isSelected && !showAnswerResult ? 'bg-orange-500/15 border-orange-500/40 text-orange-300' :
                      'bg-background/50 border-border/30 hover:border-orange-500/30 hover:bg-orange-500/5'
                    }`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCorrectOpt ? 'bg-green-500/30 text-green-300' : isWrong ? 'bg-red-500/30 text-red-300' : isSelected ? 'bg-orange-500/30 text-orange-300' : 'bg-muted/50 text-muted-foreground'
                    }`}>{opt.letter}</span>
                    <span className="flex-1">{opt.text}</span>
                    {isCorrectOpt && <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />}
                    {isWrong && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {waitingNext && (
          <div className="text-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-orange-400 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Próxima questão em instantes...</p>
          </div>
        )}
      </div>
    );
  }

  // ─── Solo Playing View ────────────────────────────────────────
  if (view === 'solo') {
    const q = soloQuestions[soloQIndex];
    if (!q) return null;
    const progress = ((soloQIndex + 1) / soloQuestions.length) * 100;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setView('menu')}><ArrowLeft className="w-4 h-4 mr-1" /> Sair</Button>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">{soloQIndex + 1}/{soloQuestions.length}</Badge>
            <Badge className="bg-orange-500/20 text-orange-400 text-xs"><Trophy className="w-3 h-3 mr-1" /> {soloScore}</Badge>
          </div>
        </div>
        <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3"><Badge variant="outline" className="text-xs">{q.area}</Badge></div>
            <p className="text-sm text-foreground leading-relaxed">{q.text}</p>
          </CardContent>
        </Card>
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const correctIdx = q.options.findIndex(o => o.letter === q.correctAnswer);
            const isSelected = soloSelected === i;
            const isCorrect = i === correctIdx;
            return (
              <button key={i} onClick={() => handleSoloAnswer(i)} disabled={soloSelected !== null}
                className={`w-full text-left p-4 rounded-xl border transition-all text-sm ${
                  soloShowExplanation && isCorrect ? 'bg-green-500/10 border-green-500/40 text-green-400' :
                  soloShowExplanation && isSelected && !isCorrect ? 'bg-red-500/10 border-red-500/40 text-red-400' :
                  'bg-card/50 border-border/30 hover:border-border/60'
                }`}>
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs mt-0.5 opacity-60">{opt.letter}</span>
                  <span className="flex-1">{opt.text}</span>
                  {soloShowExplanation && isCorrect && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />}
                  {soloShowExplanation && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
        {soloShowExplanation && (
          <Button onClick={handleSoloNext} className="w-full bg-orange-600 hover:bg-orange-700">
            {soloQIndex + 1 >= soloQuestions.length ? 'Ver Resultado' : 'Próxima Questão'}
          </Button>
        )}
      </div>
    );
  }

  // ─── Result View ──────────────────────────────────────────────
  if (view === 'result' && battleResult) {
    const isSolo = battleResult.winner === 'solo';
    const myScore = isSolo ? battleResult.hostScore : (isHost ? battleResult.hostScore : battleResult.guestScore);
    const total = battleResult.totalQuestions;
    const pct = Math.round((myScore / total) * 100);
    const won = !isSolo && ((isHost && battleResult.winner === 'host') || (!isHost && battleResult.winner === 'guest'));
    const draw = battleResult.winner === 'draw';

    return (
      <div className="space-y-6">
        <Card className={`overflow-hidden ${isSolo ? 'border-blue-500/30' : won ? 'border-yellow-500/30' : draw ? 'border-blue-500/30' : 'border-red-500/30'}`}>
          <div className={`p-8 text-center space-y-4 bg-gradient-to-br ${
            isSolo ? 'from-blue-500/10 to-teal-500/5' : won ? 'from-yellow-500/10 to-orange-500/5' : draw ? 'from-blue-500/10 to-teal-500/5' : 'from-red-500/10 to-pink-500/5'
          }`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
              isSolo || draw ? 'bg-blue-500/20' : won ? 'bg-yellow-500/20' : 'bg-red-500/20'
            }`}>
              {isSolo ? <Trophy className="w-10 h-10 text-blue-400" /> :
               won ? <Crown className="w-10 h-10 text-yellow-400" /> :
               draw ? <Swords className="w-10 h-10 text-blue-400" /> :
               <Shield className="w-10 h-10 text-red-400" />}
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              {isSolo ? 'Treino Finalizado!' : won ? 'Vitória!' : draw ? 'Empate!' : 'Derrota'}
            </h2>
            <div className="text-5xl font-bold text-orange-400">{myScore}/{total}</div>
            <p className="text-muted-foreground">{pct}% de acerto</p>
            {!isSolo && (
              <div className="flex items-center justify-center gap-8 py-2">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Você</p>
                  <p className="text-2xl font-bold text-teal-400">{isHost ? battleResult.hostScore : battleResult.guestScore}</p>
                </div>
                <span className="text-muted-foreground">×</span>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{isHost ? battleResult.guestName : battleResult.hostName}</p>
                  <p className="text-2xl font-bold text-purple-400">{isHost ? battleResult.guestScore : battleResult.hostScore}</p>
                </div>
              </div>
            )}
            <Button onClick={() => { setView('menu'); setBattleResult(null); }} className="bg-orange-600 hover:bg-orange-700">Nova Batalha</Button>
          </div>
        </Card>
      </div>
    );
  }

  // ─── History View ─────────────────────────────────────────────
  if (view === 'history') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setView('menu')}><ArrowLeft className="w-4 h-4 mr-1" /> Voltar</Button>
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
  }

  return (
    <div className="text-center py-8">
      <Loader2 className="w-8 h-8 animate-spin text-orange-400 mx-auto" />
      <p className="text-sm text-muted-foreground mt-2">Conectando...</p>
    </div>
  );
};

export default QuestionBattle;
