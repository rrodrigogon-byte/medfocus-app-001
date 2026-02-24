/**
 * Feed Social de Conquistas — Timeline de atividades dos colegas
 * Com curtidas, comentários e filtro por universidade
 */
import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Heart, MessageCircle, Trophy, Flame, Swords, Brain,
  BookOpen, Target, Sparkles, Send, ChevronDown, ChevronUp,
  Users, Loader2
} from 'lucide-react';

const EVENT_ICONS: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  badge_earned: { icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  simulado_completed: { icon: Target, color: 'text-teal-400', bg: 'bg-teal-500/10' },
  streak_milestone: { icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  clinical_case_solved: { icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  battle_won: { icon: Swords, color: 'text-red-400', bg: 'bg-red-500/10' },
  level_up: { icon: Sparkles, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  goal_completed: { icon: Target, color: 'text-green-400', bg: 'bg-green-500/10' },
  summary_shared: { icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
};

const SocialFeed: React.FC = () => {
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});

  const { data: feedItems, refetch, isLoading, isError } = trpc.feed.list.useQuery({}, { retry: false });
  const likeMutation = trpc.feed.like.useMutation();
  const commentMutation = trpc.feed.comment.useMutation();

  const handleLike = async (feedItemId: number) => {
    try {
      await likeMutation.mutateAsync({ feedItemId });
      refetch();
    } catch {
      toast.error('Erro ao curtir');
    }
  };

  const handleComment = async (feedItemId: number) => {
    const content = commentInputs[feedItemId]?.trim();
    if (!content) return;
    try {
      await commentMutation.mutateAsync({ feedItemId, content });
      setCommentInputs(prev => ({ ...prev, [feedItemId]: '' }));
      refetch();
      toast.success('Comentário enviado!');
    } catch {
      toast.error('Erro ao comentar');
    }
  };

  const toggleComments = (id: number) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const timeAgo = (date: Date | string) => {
    const now = new Date();
    const d = new Date(date);
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return 'agora';
    if (diff < 3600) return `${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-pink-400" />
            Feed de Conquistas
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Veja o que seus colegas estão conquistando
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
        </div>
      ) : !feedItems?.length ? (
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhuma atividade ainda.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Complete simulados, casos clínicos e metas para aparecer aqui!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {feedItems.map((item: any) => {
            const eventConfig = EVENT_ICONS[item.feed.eventType] || EVENT_ICONS.badge_earned;
            const Icon = eventConfig.icon;
            const isExpanded = expandedComments.has(item.feed.id);

            return (
              <Card key={item.feed.id} className="border-border/50 hover:border-border/80 transition-all">
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${eventConfig.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${eventConfig.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground">{item.user?.name || 'Anônimo'}</span>
                        <span className="text-xs text-muted-foreground">{timeAgo(item.feed.createdAt || item.feed.feedCreatedAt)}</span>
                      </div>
                      <p className="text-sm text-foreground mt-0.5">{item.feed.title || item.feed.feedTitle}</p>
                      {(item.feed.description || item.feed.feedDescription) && (
                        <p className="text-xs text-muted-foreground mt-1">{item.feed.description || item.feed.feedDescription}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-3 pl-13">
                    <button
                      onClick={() => handleLike(item.feed.id)}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${item.isLiked ? 'text-pink-400' : 'text-muted-foreground hover:text-pink-400'}`}
                    >
                      <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-pink-400' : ''}`} />
                      {(item.feed.likes || item.feed.feedLikes || 0) > 0 && <span>{item.feed.likes || item.feed.feedLikes}</span>}
                    </button>
                    <button
                      onClick={() => toggleComments(item.feed.id)}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Comentar
                    </button>
                  </div>

                  {/* Comments */}
                  {isExpanded && (
                    <div className="mt-3 pl-13 space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Escreva um comentário..."
                          value={commentInputs[item.feed.id] || ''}
                          onChange={e => setCommentInputs(prev => ({ ...prev, [item.feed.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter') handleComment(item.feed.id); }}
                          className="text-sm"
                        />
                        <Button size="sm" variant="ghost" onClick={() => handleComment(item.feed.id)}
                          disabled={!commentInputs[item.feed.id]?.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
