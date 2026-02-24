/**
 * Leaderboard — Ranking entre Alunos
 * Leaderboard por universidade com XP, streaks e estatísticas
 * Períodos: semanal, mensal, geral
 */
import React, { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Trophy, Medal, Crown, Flame, Star, TrendingUp,
  Zap, Target, BookOpen, Brain, Clock, ChevronRight,
  Award, Users, GraduationCap, Sparkles
} from 'lucide-react';

const PERIODS = [
  { id: 'weekly' as const, name: 'Semanal', icon: Clock },
  { id: 'monthly' as const, name: 'Mensal', icon: TrendingUp },
  { id: 'alltime' as const, name: 'Geral', icon: Trophy },
];

const RANK_ICONS = [Crown, Medal, Award];
const RANK_COLORS = ['text-yellow-500', 'text-gray-400', 'text-amber-600'];
const RANK_BG = ['bg-yellow-500/10 border-yellow-500/30', 'bg-gray-400/10 border-gray-400/30', 'bg-amber-600/10 border-amber-600/30'];

function getLevelInfo(totalXP: number) {
  const level = Math.floor(totalXP / 500) + 1;
  const xpInLevel = totalXP % 500;
  const xpForNext = 500;
  const titles = ['Calouro', 'Estudante', 'Acadêmico', 'Residente Jr.', 'Residente', 'Especialista', 'Mestre', 'Doutor', 'Professor', 'Catedrático'];
  const title = titles[Math.min(level - 1, titles.length - 1)];
  return { level, xpInLevel, xpForNext, title };
}

export default function Leaderboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');
  const [filterUniversity, setFilterUniversity] = useState(false);
  const [showActivities, setShowActivities] = useState(false);

  const myXP = trpc.xp.me.useQuery(undefined, { retry: false });
  const leaderboard = trpc.xp.leaderboard.useQuery({
    period,
    universityId: filterUniversity ? (myXP.data?.universityId || undefined) : undefined,
  }, { retry: false });
  const activities = trpc.xp.activities.useQuery({ limit: 15 }, { enabled: showActivities, retry: false });

  const myData = myXP.data;
  const levelInfo = myData ? getLevelInfo(myData.totalXP) : null;
  const myRank = useMemo(() => {
    if (!leaderboard.data || !user) return null;
    const idx = leaderboard.data.findIndex((e: any) => e.userId === user.id);
    return idx >= 0 ? idx + 1 : null;
  }, [leaderboard.data, user]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-display flex items-center gap-2">
          <Trophy className="w-7 h-7 text-yellow-500" />
          Ranking de Alunos
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Compete com outros estudantes de medicina e suba no ranking
        </p>
      </div>

      {/* My XP Card */}
      {myData && levelInfo && (
        <Card className="bg-gradient-to-br from-primary/5 via-background to-primary/10 border-primary/20">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-black text-primary">{levelInfo.level}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{levelInfo.title}</h3>
                    <Badge variant="outline" className="text-xs">Nível {levelInfo.level}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {myData.totalXP.toLocaleString()} XP total
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(levelInfo.xpInLevel / levelInfo.xpForNext) * 100}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{levelInfo.xpInLevel}/{levelInfo.xpForNext}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-xl font-black">{myData.streak}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Streak</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-xl font-black">{myData.weeklyXP}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">XP Semanal</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-xl font-black">{myData.simuladosCompleted}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Simulados</p>
                </div>
                {myRank && (
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <Medal className="w-4 h-4 text-primary" />
                      <span className="text-xl font-black">#{myRank}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Posição</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
              <div className="bg-background/60 rounded-xl p-3 text-center">
                <BookOpen className="w-4 h-4 text-green-500 mx-auto mb-1" />
                <p className="text-lg font-bold">{myData.questionsAnswered}</p>
                <p className="text-xs text-muted-foreground">Questões</p>
              </div>
              <div className="bg-background/60 rounded-xl p-3 text-center">
                <Target className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <p className="text-lg font-bold">
                  {myData.questionsAnswered > 0 ? Math.round((myData.correctAnswers / myData.questionsAnswered) * 100) : 0}%
                </p>
                <p className="text-xs text-muted-foreground">Acerto</p>
              </div>
              <div className="bg-background/60 rounded-xl p-3 text-center">
                <Clock className="w-4 h-4 text-red-500 mx-auto mb-1" />
                <p className="text-lg font-bold">{Math.round(myData.pomodoroMinutes / 60)}h</p>
                <p className="text-xs text-muted-foreground">Pomodoro</p>
              </div>
              <div className="bg-background/60 rounded-xl p-3 text-center">
                <Brain className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                <p className="text-lg font-bold">{myData.flashcardsReviewed}</p>
                <p className="text-xs text-muted-foreground">Flashcards</p>
              </div>
              <div className="bg-background/60 rounded-xl p-3 text-center">
                <Flame className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                <p className="text-lg font-bold">{myData.longestStreak}</p>
                <p className="text-xs text-muted-foreground">Melhor Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Period Selector + Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex gap-2">
          {PERIODS.map(p => (
            <Button
              key={p.id}
              variant={period === p.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(p.id)}
              className="gap-1.5"
            >
              <p.icon className="w-3.5 h-3.5" />
              {p.name}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterUniversity ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterUniversity(!filterUniversity)}
            className="gap-1.5"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            {filterUniversity ? 'Minha Universidade' : 'Todas'}
          </Button>
          <Button
            variant={showActivities ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowActivities(!showActivities)}
            className="gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Atividades
          </Button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Top Estudantes — {PERIODS.find(p => p.id === period)?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leaderboard.isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-muted/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !leaderboard.data || leaderboard.data.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum estudante no ranking ainda</p>
              <p className="text-xs text-muted-foreground mt-1">Complete simulados e estude para aparecer aqui!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.data.map((entry: any, idx: number) => {
                const isMe = user && entry.userId === user.id;
                const RankIcon = idx < 3 ? RANK_ICONS[idx] : null;
                const entryLevel = getLevelInfo(entry.totalXP);
                const accuracy = entry.questionsAnswered > 0 ? Math.round((entry.correctAnswers / entry.questionsAnswered) * 100) : 0;

                return (
                  <div
                    key={entry.userId}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isMe ? 'bg-primary/10 border border-primary/30' :
                      idx < 3 ? `${RANK_BG[idx]} border` : 'hover:bg-muted/50'
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-10 text-center">
                      {RankIcon ? (
                        <RankIcon className={`w-6 h-6 mx-auto ${RANK_COLORS[idx]}`} />
                      ) : (
                        <span className="text-lg font-bold text-muted-foreground">#{idx + 1}</span>
                      )}
                    </div>

                    {/* Avatar + Name */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-bold text-sm truncate ${isMe ? 'text-primary' : ''}`}>
                          {entry.userName || 'Estudante'}
                          {isMe && <span className="text-xs ml-1">(Você)</span>}
                        </p>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          Nv.{entryLevel.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        {entry.universityId && <span>{entry.universityId}</span>}
                        <span className="flex items-center gap-0.5">
                          <Flame className="w-3 h-3 text-orange-400" /> {entry.streak}d
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Target className="w-3 h-3 text-blue-400" /> {accuracy}%
                        </span>
                      </div>
                    </div>

                    {/* XP */}
                    <div className="text-right">
                      <p className="font-black text-lg text-primary">
                        {(entry.xp || 0).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">XP</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* XP Activities */}
      {showActivities && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activities.isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-muted/50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : !activities.data || activities.data.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">Nenhuma atividade registrada</p>
            ) : (
              <div className="space-y-2">
                {activities.data.map((act: any) => (
                  <div key={act.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{act.description || act.activityType}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(act.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                      +{act.xpEarned} XP
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* XP Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Como Ganhar XP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { action: 'Questão correta', xp: '+10 XP', icon: BookOpen, color: 'text-green-500' },
              { action: 'Simulado completo', xp: '+50 XP', icon: Target, color: 'text-blue-500' },
              { action: 'Pomodoro completo', xp: '+15 XP', icon: Clock, color: 'text-red-500' },
              { action: 'Flashcard revisado', xp: '+5 XP', icon: Brain, color: 'text-purple-500' },
              { action: 'Streak 7 dias', xp: '+50 XP', icon: Flame, color: 'text-orange-500' },
              { action: 'Meta concluída', xp: '+30 XP', icon: Trophy, color: 'text-yellow-500' },
            ].map(item => (
              <div key={item.action} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.action}</p>
                </div>
                <Badge variant="outline" className="text-xs font-bold">{item.xp}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
