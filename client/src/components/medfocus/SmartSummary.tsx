/**
 * Gerador de Resumos Inteligentes — IA gera resumos estruturados de qualquer tema médico
 * Com mnemônicos, tabelas e opção de compartilhar
 */
import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Streamdown } from 'streamdown';
import {
  BookOpen, Sparkles, Loader2, Copy, Share2, Globe, Lock,
  ArrowLeft, Clock, Search, Brain
} from 'lucide-react';

const QUICK_TOPICS = [
  { topic: 'Insuficiência Cardíaca', specialty: 'Clínica Médica' },
  { topic: 'Apendicite Aguda', specialty: 'Cirurgia' },
  { topic: 'Bronquiolite Viral Aguda', specialty: 'Pediatria' },
  { topic: 'Pré-Eclâmpsia', specialty: 'Ginecologia e Obstetrícia' },
  { topic: 'Diabetes Mellitus Tipo 2', specialty: 'Clínica Médica' },
  { topic: 'Pneumonia Adquirida na Comunidade', specialty: 'Clínica Médica' },
  { topic: 'Fratura de Fêmur', specialty: 'Ortopedia' },
  { topic: 'Transtorno Depressivo Maior', specialty: 'Psiquiatria' },
];

const SmartSummary: React.FC = () => {
  const [view, setView] = useState<'input' | 'result' | 'history' | 'community'>('input');
  const [topic, setTopic] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [shareCode, setShareCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = trpc.summary.generate.useMutation();
  const { data: mySummaries, refetch: refetchMine } = trpc.summary.list.useQuery();
  const { data: publicSummaries } = trpc.summary.public.useQuery();
  const togglePublic = trpc.summary.togglePublic.useMutation();

  const handleGenerate = async (t?: string, s?: string) => {
    const topicToUse = t || topic;
    if (!topicToUse.trim()) { toast.error('Digite um tema'); return; }
    setIsGenerating(true);
    try {
      const result = await generateSummary.mutateAsync({ topic: topicToUse, specialty: s || specialty || undefined });
      setGeneratedContent(result.content);
      setShareCode(result.shareCode);
      setView('result');
      refetchMine();
      toast.success('Resumo gerado!');
    } catch {
      toast.error('Erro ao gerar resumo');
    }
    setIsGenerating(false);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/resumo/${shareCode}`);
    toast.success('Link copiado!');
  };

  // ─── Input View ───────────────────────────────────────────────
  if (view === 'input') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-400" />
              Resumos Inteligentes
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              IA gera resumos completos com mnemônicos e tabelas
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setView('community')}>
              <Globe className="w-4 h-4 mr-1" /> Comunidade
            </Button>
            <Button variant="outline" size="sm" onClick={() => setView('history')}>
              <Clock className="w-4 h-4 mr-1" /> Meus Resumos
            </Button>
          </div>
        </div>

        {/* Search Input */}
        <Card className="border-indigo-500/20">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-indigo-400" />
              <div>
                <h3 className="font-semibold text-foreground">Gerar Novo Resumo</h3>
                <p className="text-xs text-muted-foreground">Digite qualquer tema médico</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Ex: Insuficiência Cardíaca Congestiva" value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleGenerate(); }}
                className="flex-1" />
              <Button onClick={() => handleGenerate()} disabled={isGenerating || !topic.trim()}
                className="bg-indigo-600 hover:bg-indigo-700">
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Topics */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Temas Populares</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {QUICK_TOPICS.map(qt => (
              <button key={qt.topic}
                onClick={() => { setTopic(qt.topic); setSpecialty(qt.specialty); handleGenerate(qt.topic, qt.specialty); }}
                disabled={isGenerating}
                className="text-left p-3 rounded-xl border border-border/30 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all">
                <p className="text-sm font-medium text-foreground">{qt.topic}</p>
                <p className="text-xs text-muted-foreground">{qt.specialty}</p>
              </button>
            ))}
          </div>
        </div>

        {isGenerating && (
          <Card className="border-indigo-500/20 bg-indigo-500/5">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-10 h-10 text-indigo-400 mx-auto animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">Gerando resumo com IA...</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Isso pode levar alguns segundos</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ─── Result View ──────────────────────────────────────────────
  if (view === 'result') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setView('input')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyShareLink}>
              <Share2 className="w-4 h-4 mr-1" /> Compartilhar
            </Button>
          </div>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-6 prose prose-sm dark:prose-invert max-w-none">
            <Streamdown>{generatedContent}</Streamdown>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── History View ─────────────────────────────────────────────
  if (view === 'history') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setView('input')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <h2 className="text-lg font-display font-bold">Meus Resumos</h2>
        </div>
        {!mySummaries?.length ? (
          <Card className="border-border/50"><CardContent className="p-8 text-center text-muted-foreground">Nenhum resumo gerado ainda.</CardContent></Card>
        ) : (
          <div className="space-y-3">
            {mySummaries.map((s: any) => (
              <Card key={s.id} className="border-border/50 hover:border-border transition-all cursor-pointer"
                onClick={() => { setGeneratedContent(s.content || s.summaryContent); setShareCode(s.shareCode || ''); setView('result'); }}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{s.topic}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {s.specialty && <Badge variant="outline" className="text-xs">{s.specialty || s.summarySpecialty}</Badge>}
                      <span className="text-xs text-muted-foreground">{new Date(s.createdAt || s.summaryCreatedAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.isPublic ? <Globe className="w-4 h-4 text-green-400" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                    <Button size="sm" variant="ghost" onClick={(e) => {
                      e.stopPropagation();
                      togglePublic.mutateAsync({ id: s.id, isPublic: !s.isPublic }).then(() => { refetchMine(); toast.success(s.isPublic ? 'Resumo privado' : 'Resumo público'); });
                    }}>
                      {s.isPublic ? 'Tornar Privado' : 'Publicar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── Community View ───────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => setView('input')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        <h2 className="text-lg font-display font-bold">Resumos da Comunidade</h2>
      </div>
      {!publicSummaries?.length ? (
        <Card className="border-border/50"><CardContent className="p-8 text-center text-muted-foreground">Nenhum resumo público ainda. Seja o primeiro!</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {publicSummaries.map((item: any) => (
            <Card key={item.summary.id} className="border-border/50 hover:border-border transition-all cursor-pointer"
              onClick={() => { setGeneratedContent(item.summary.content || item.summary.summaryContent); setShareCode(item.summary.shareCode || ''); setView('result'); }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.summary.topic}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {item.summary.specialty && <Badge variant="outline" className="text-xs">{item.summary.specialty || item.summary.summarySpecialty}</Badge>}
                      <span className="text-xs text-muted-foreground">por {item.user?.name || 'Anônimo'}</span>
                    </div>
                  </div>
                  <Brain className="w-5 h-5 text-indigo-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartSummary;
