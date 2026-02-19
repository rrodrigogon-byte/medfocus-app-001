/**
 * PublicProfile — Página pública do aluno
 * Badges, nível, estatísticas e histórico de simulados
 * Compartilhável via link: /perfil/:userId
 */
import { trpc } from '@/lib/trpc';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRoute } from 'wouter';
import {
  Trophy, Target, Flame, BookOpen, Brain, Clock,
  FileText, Star, Award, Share2, Copy, CheckCircle2,
  TrendingUp, Zap, Calendar, ArrowLeft, Loader2,
  GraduationCap, Shield
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Badge as GamificationBadge } from '@/data/gamification';

// ─── Level Titles ────────────────────────────────────────────
const LEVEL_TITLES: Record<number, string> = {
  1: 'Calouro', 2: 'Estudante', 3: 'Acadêmico', 4: 'Dedicado', 5: 'Aplicado',
  6: 'Competente', 7: 'Avançado', 8: 'Especialista', 9: 'Mestre', 10: 'Doutor',
  11: 'Professor', 12: 'Pesquisador', 13: 'Cientista', 14: 'Referência', 15: 'Autoridade',
  16: 'Eminência', 17: 'Lenda', 18: 'Gênio', 19: 'Visionário', 20: 'Hipócrates',
};

const XP_PER_LEVEL = [
  0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800,
  4700, 5700, 6800, 8000, 9500, 11000, 13000, 15000, 17500, 20000,
];

function getLevelFromXP(xp: number): number {
  for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
    if (xp >= XP_PER_LEVEL[i]) return i + 1;
  }
  return 1;
}

function getXPProgress(xp: number, level: number): number {
  const currentLevelXP = XP_PER_LEVEL[level - 1] || 0;
  const nextLevelXP = XP_PER_LEVEL[level] || XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return Math.min(100, Math.max(0, progress));
}

// ─── University Labels ───────────────────────────────────────
const UNIVERSITY_LABELS: Record<string, string> = {
  USP: 'USP', UNICAMP: 'UNICAMP', UNESP: 'UNESP', UNIFESP: 'UNIFESP',
  UFMG: 'UFMG', UFRJ: 'UFRJ', UFRGS: 'UFRGS', UFBA: 'UFBA',
  UFPR: 'UFPR', UFSC: 'UFSC', UNB: 'UnB', UFC: 'UFC',
  UFPE: 'UFPE', UFPA: 'UFPA', UFMA: 'UFMA', UFPB: 'UFPB',
};

export default function PublicProfile() {
  const [, params] = useRoute('/perfil/:userId');
  const userId = params?.userId ? parseInt(params.userId) : 0;
  const [copied, setCopied] = useState(false);

  const profileQuery = trpc.profile.public.useQuery(
    { userId },
    { enabled: userId > 0, retry: false }
  );

  const profile = profileQuery.data;

  // Parse badges from JSON
  const badges: GamificationBadge[] = useMemo(() => {
    if (!profile?.gamification?.badges) return [];
    try {
      return JSON.parse(profile.gamification.badges);
    } catch {
      return [];
    }
  }, [profile?.gamification?.badges]);

  const unlockedBadges = badges.filter(b => b.unlocked);
  const level = profile?.gamification?.level || getLevelFromXP(profile?.xp?.totalXP || 0);
  const levelTitle = LEVEL_TITLES[Math.min(level, 20)] || 'Estudante';
  const xpProgress = getXPProgress(profile?.xp?.totalXP || profile?.gamification?.totalXp || 0, level);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/perfil/${userId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success('Link copiado!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (profileQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (profileQuery.error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="py-12 text-center">
            <Shield className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Perfil não encontrado</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Este perfil não existe ou não está disponível.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao MedFocus
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const accuracy = profile.xp && profile.xp.questionsAnswered > 0
    ? Math.round((profile.xp.correctAnswers / profile.xp.questionsAnswered) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between mb-6">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
              <ArrowLeft className="w-4 h-4 mr-2" /> MedFocus
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-2">
              {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Compartilhar'}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-lg">
                {(profile.user.name || 'E')[0].toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{level}</span>
              </div>
            </div>

            {/* Name & Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold font-display">{profile.user.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 justify-center sm:justify-start">
                <BadgeUI variant="secondary" className="gap-1">
                  <Star className="w-3 h-3" /> Nível {level} — {levelTitle}
                </BadgeUI>
                {profile.user.universityId && (
                  <BadgeUI variant="outline" className="gap-1">
                    <GraduationCap className="w-3 h-3" />
                    {UNIVERSITY_LABELS[profile.user.universityId] || profile.user.universityId}
                    {profile.user.currentYear && ` · ${profile.user.currentYear}° ano`}
                  </BadgeUI>
                )}
                {profile.user.plan !== 'free' && (
                  <BadgeUI className="bg-amber-500/10 text-amber-600 border-amber-500/30 gap-1">
                    <Zap className="w-3 h-3" /> {profile.user.plan === 'premium' ? 'Premium' : 'Pro'}
                  </BadgeUI>
                )}
              </div>

              {/* XP Progress Bar */}
              <div className="mt-4 max-w-sm">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{(profile.xp?.totalXP || profile.gamification?.totalXp || 0).toLocaleString()} XP</span>
                  <span className="text-muted-foreground">Nível {level + 1}</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-1000"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Flame, label: 'Streak', value: `${profile.xp?.streak || profile.gamification?.currentStreak || 0} dias`, color: 'text-orange-500', bg: 'bg-orange-500/10' },
            { icon: FileText, label: 'Questões', value: (profile.xp?.questionsAnswered || 0).toLocaleString(), color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { icon: Target, label: 'Acurácia', value: `${accuracy}%`, color: 'text-green-500', bg: 'bg-green-500/10' },
            { icon: Trophy, label: 'Simulados', value: String(profile.simuladoStats.totalCompleted), color: 'text-purple-500', bg: 'bg-purple-500/10' },
          ].map(stat => (
            <Card key={stat.label}>
              <CardContent className="py-4 text-center">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Extended Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Clock, label: 'Pomodoro', value: `${Math.round((profile.xp?.pomodoroMinutes || 0) / 60)}h`, color: 'text-red-500' },
            { icon: Brain, label: 'Flashcards', value: (profile.xp?.flashcardsReviewed || 0).toLocaleString(), color: 'text-violet-500' },
            { icon: BookOpen, label: 'Metas Cumpridas', value: String(profile.goalsCompleted), color: 'text-teal-500' },
            { icon: TrendingUp, label: 'Maior Streak', value: `${profile.xp?.longestStreak || profile.gamification?.longestStreak || 0} dias`, color: 'text-amber-500' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
              <stat.icon className={`w-5 h-5 ${stat.color} shrink-0`} />
              <div>
                <p className="text-sm font-bold">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Badges */}
        {unlockedBadges.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Badges Conquistadas ({unlockedBadges.length}/{badges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {unlockedBadges.map(badge => (
                  <div key={badge.id} className="flex flex-col items-center p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path d={badge.icon} />
                      </svg>
                    </div>
                    <p className="text-xs font-bold">{badge.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{badge.description}</p>
                    <BadgeUI variant="secondary" className="mt-1.5 text-[9px]">+{badge.xpReward} XP</BadgeUI>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Simulado History */}
        {profile.recentSimulados.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Histórico de Simulados
                {profile.simuladoStats.avgScore > 0 && (
                  <BadgeUI variant="secondary" className="ml-auto text-xs">
                    Média: {profile.simuladoStats.avgScore}%
                  </BadgeUI>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profile.recentSimulados.map(sim => (
                  <div key={sim.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        (sim.score || 0) >= 70 ? 'bg-green-500/10' : (sim.score || 0) >= 50 ? 'bg-yellow-500/10' : 'bg-red-500/10'
                      }`}>
                        <span className={`text-sm font-bold ${
                          (sim.score || 0) >= 70 ? 'text-green-500' : (sim.score || 0) >= 50 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {sim.score || 0}%
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{sim.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="uppercase">{sim.examType}</span>
                          <span>·</span>
                          <span>{sim.correctAnswers}/{sim.totalQuestions} acertos</span>
                        </div>
                      </div>
                    </div>
                    {sim.completedAt && (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(sim.completedAt).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Member Since */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            Membro desde {new Date(profile.user.memberSince).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">
            MedFocus — Gerenciador de Estudos para Medicina
          </p>
        </div>
      </div>
    </div>
  );
}
