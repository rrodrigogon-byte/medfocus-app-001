/**
 * FlashcardStudy — SM-2 Spaced Repetition Flashcard System
 * Generate flashcards from topics or summaries, review with SM-2 algorithm
 */
import React, { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';

type ViewMode = 'decks' | 'review' | 'generate' | 'browse';

const SUBJECTS = [
  'Clínica Médica', 'Cirurgia', 'Pediatria', 'Ginecologia e Obstetrícia',
  'Saúde Coletiva', 'Medicina Preventiva', 'Cardiologia', 'Pneumologia',
  'Neurologia', 'Ortopedia', 'Dermatologia', 'Psiquiatria',
  'Endocrinologia', 'Nefrologia', 'Gastroenterologia', 'Infectologia',
];

const POPULAR_TOPICS = [
  'Insuficiência Cardíaca Congestiva', 'Diabetes Mellitus tipo 2',
  'Pneumonia Adquirida na Comunidade', 'Hipertensão Arterial Sistêmica',
  'Infecção do Trato Urinário', 'Asma Brônquica', 'DPOC',
  'Acidente Vascular Cerebral', 'Sepse e Choque Séptico',
  'Abdome Agudo', 'Pré-Eclâmpsia', 'Meningite Bacteriana',
];

const QUALITY_LABELS = [
  { value: 0, label: 'Não lembrei', color: 'bg-red-500', emoji: '😵' },
  { value: 1, label: 'Quase nada', color: 'bg-red-400', emoji: '😟' },
  { value: 2, label: 'Errei', color: 'bg-orange-400', emoji: '😐' },
  { value: 3, label: 'Difícil', color: 'bg-yellow-400', emoji: '🤔' },
  { value: 4, label: 'Bom', color: 'bg-emerald-400', emoji: '😊' },
  { value: 5, label: 'Fácil!', color: 'bg-emerald-500', emoji: '🎯' },
];

const FlashcardStudy: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState<ViewMode>('decks');
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Clínica Médica');
  const [cardCount, setCardCount] = useState(12);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [sessionStats, setSessionStats] = useState({ easy: 0, good: 0, hard: 0, again: 0 });

  // Queries
  const myDecks = trpc.flashcards.myDecks.useQuery(undefined, { enabled: isAuthenticated });
  const publicDecks = trpc.flashcards.publicDecks.useQuery();
  const dueCards = trpc.flashcards.getDueCards.useQuery(
    { deckId: selectedDeckId! },
    { enabled: !!selectedDeckId && view === 'review' }
  );
  const allCards = trpc.flashcards.getAllCards.useQuery(
    { deckId: selectedDeckId! },
    { enabled: !!selectedDeckId && view === 'review' }
  );

  // Mutations
  const generateFromTopic = trpc.flashcards.generateFromTopic.useMutation({
    onSuccess: (data) => {
      toast.success(`Deck criado com ${data.cards.length} flashcards!`);
      myDecks.refetch();
      setView('decks');
    },
    onError: () => toast.error('Erro ao gerar flashcards'),
  });

  const reviewMutation = trpc.flashcards.review.useMutation({
    onSuccess: () => {
      dueCards.refetch();
      allCards.refetch();
    },
  });

  const deleteDeckMutation = trpc.flashcards.deleteDeck.useMutation({
    onSuccess: () => {
      toast.success('Deck excluído');
      myDecks.refetch();
    },
  });

  const cards = useMemo(() => {
    if (dueCards.data && dueCards.data.length > 0) return dueCards.data;
    return allCards.data || [];
  }, [dueCards.data, allCards.data]);

  const currentCard = cards[currentCardIndex];

  const handleReview = (quality: number) => {
    if (!currentCard) return;
    reviewMutation.mutate({ cardId: currentCard.id, quality });
    
    // Update stats
    if (quality >= 4) setSessionStats(s => ({ ...s, easy: s.easy + 1 }));
    else if (quality === 3) setSessionStats(s => ({ ...s, good: s.good + 1 }));
    else if (quality >= 1) setSessionStats(s => ({ ...s, hard: s.hard + 1 }));
    else setSessionStats(s => ({ ...s, again: s.again + 1 }));

    setReviewedCount(r => r + 1);
    setShowAnswer(false);
    
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(i => i + 1);
    } else {
      toast.success(`Sessão completa! ${reviewedCount + 1} cards revisados.`);
    }
  };

  const startReview = (deckId: number) => {
    setSelectedDeckId(deckId);
    setCurrentCardIndex(0);
    setReviewedCount(0);
    setShowAnswer(false);
    setSessionStats({ easy: 0, good: 0, hard: 0, again: 0 });
    setView('review');
  };

  // ─── Generate View ─────────────────────────────────────
  if (view === 'generate') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('decks')} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <h2 className="text-xl font-display font-bold">Gerar Flashcards por IA</h2>
        </div>

        <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div>
              <h3 className="font-bold text-foreground">Baseado em Referências Científicas</h3>
              <p className="text-sm text-muted-foreground">Harrison, Sabiston, Nelson, Williams, Robbins, Guyton, Netter</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Tema</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Insuficiência Cardíaca Congestiva"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Especialidade</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground"
                >
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Quantidade</label>
                <select
                  value={cardCount}
                  onChange={(e) => setCardCount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground"
                >
                  {[5, 8, 10, 12, 15, 20, 25, 30].map(n => <option key={n} value={n}>{n} cards</option>)}
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                if (!topic.trim()) { toast.error('Digite um tema'); return; }
                generateFromTopic.mutate({ topic, subject, count: cardCount });
              }}
              disabled={generateFromTopic.isPending}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-colors disabled:opacity-50"
            >
              {generateFromTopic.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Gerando com IA...
                </span>
              ) : `Gerar ${cardCount} Flashcards`}
            </button>
          </div>
        </div>

        {/* Popular Topics */}
        <div>
          <h3 className="font-bold text-foreground mb-3">Temas Populares</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {POPULAR_TOPICS.map(t => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className={`px-3 py-2 rounded-lg text-sm border transition-colors text-left ${
                  topic === t ? 'bg-violet-500/20 border-violet-500/40 text-violet-300' : 'bg-muted/30 border-border hover:bg-muted/50 text-muted-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Review View ───────────────────────────────────────
  if (view === 'review') {
    const progress = cards.length > 0 ? ((currentCardIndex) / cards.length) * 100 : 0;
    const isComplete = currentCardIndex >= cards.length;

    if (isComplete || cards.length === 0) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => { setView('decks'); setSelectedDeckId(null); }} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <h2 className="text-xl font-display font-bold">Sessão Completa</h2>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {cards.length === 0 ? 'Nenhum card para revisar!' : 'Parabéns!'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {cards.length === 0
                ? 'Todos os cards estão em dia. Volte mais tarde!'
                : `Você revisou ${reviewedCount} flashcards nesta sessão.`}
            </p>

            {reviewedCount > 0 && (
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-emerald-500/10 rounded-xl p-3">
                  <div className="text-2xl font-bold text-emerald-400">{sessionStats.easy}</div>
                  <div className="text-xs text-muted-foreground">Fácil</div>
                </div>
                <div className="bg-yellow-500/10 rounded-xl p-3">
                  <div className="text-2xl font-bold text-yellow-400">{sessionStats.good}</div>
                  <div className="text-xs text-muted-foreground">Bom</div>
                </div>
                <div className="bg-orange-500/10 rounded-xl p-3">
                  <div className="text-2xl font-bold text-orange-400">{sessionStats.hard}</div>
                  <div className="text-xs text-muted-foreground">Difícil</div>
                </div>
                <div className="bg-red-500/10 rounded-xl p-3">
                  <div className="text-2xl font-bold text-red-400">{sessionStats.again}</div>
                  <div className="text-xs text-muted-foreground">Errei</div>
                </div>
              </div>
            )}

            <button
              onClick={() => { setView('decks'); setSelectedDeckId(null); }}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors"
            >
              Voltar aos Decks
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => { setView('decks'); setSelectedDeckId(null); }} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <h2 className="text-xl font-display font-bold">Revisão</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            {currentCardIndex + 1} / {cards.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {/* Flashcard */}
        <div
          onClick={() => !showAnswer && setShowAnswer(true)}
          className={`relative min-h-[320px] rounded-2xl border-2 p-8 flex flex-col justify-center cursor-pointer transition-all duration-300 ${
            showAnswer
              ? 'bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/30'
              : 'bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 border-violet-500/30 hover:border-violet-500/50'
          }`}
        >
          {/* Difficulty badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              currentCard.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
              currentCard.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {currentCard.difficulty === 'easy' ? 'Fácil' : currentCard.difficulty === 'hard' ? 'Difícil' : 'Médio'}
            </span>
          </div>

          {!showAnswer ? (
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-violet-400 mb-4">Pergunta</div>
              <p className="text-lg font-medium text-foreground leading-relaxed">{currentCard.front}</p>
              <div className="mt-6 text-sm text-muted-foreground">Toque para ver a resposta</div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-emerald-400 mb-4">Resposta</div>
              <p className="text-lg text-foreground leading-relaxed whitespace-pre-wrap">{currentCard.back}</p>
            </div>
          )}
        </div>

        {/* SM-2 Quality Buttons */}
        {showAnswer && (
          <div className="space-y-3">
            <p className="text-sm text-center text-muted-foreground">Como foi sua lembrança?</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {QUALITY_LABELS.map(q => (
                <button
                  key={q.value}
                  onClick={() => handleReview(q.value)}
                  disabled={reviewMutation.isPending}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border border-border hover:border-foreground/30 transition-all ${
                    q.value >= 4 ? 'hover:bg-emerald-500/10' :
                    q.value >= 2 ? 'hover:bg-yellow-500/10' : 'hover:bg-red-500/10'
                  }`}
                >
                  <span className="text-xl">{q.emoji}</span>
                  <span className="text-xs font-medium text-foreground">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Browse Public Decks ───────────────────────────────
  if (view === 'browse') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('decks')} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <h2 className="text-xl font-display font-bold">Decks da Comunidade</h2>
        </div>

        <div className="grid gap-3">
          {publicDecks.data?.map((deck: any) => (
            <div key={deck.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-foreground">{deck.title}</h3>
                <p className="text-sm text-muted-foreground">{deck.subject} · {deck.cardCount} cards · por {deck.userName}</p>
              </div>
              <button
                onClick={() => startReview(deck.id)}
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
              >
                Estudar
              </button>
            </div>
          ))}
          {(!publicDecks.data || publicDecks.data.length === 0) && (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum deck público disponível ainda.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Decks List View (Default) ─────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-foreground">Flashcards SM-2</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView('browse')}
            className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-sm font-medium transition-colors"
          >
            Comunidade
          </button>
          <button
            onClick={() => setView('generate')}
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            Gerar com IA
          </button>
        </div>
      </div>

      {/* SM-2 Explanation */}
      <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">Algoritmo SM-2 (SuperMemo)</h3>
            <p className="text-xs text-muted-foreground mt-1">
              O sistema calcula automaticamente quando revisar cada card. Cards difíceis aparecem mais cedo, fáceis mais tarde. 
              Quanto mais você revisa, mais eficiente fica a memorização de longo prazo.
            </p>
          </div>
        </div>
      </div>

      {/* My Decks */}
      <div>
        <h3 className="font-bold text-foreground mb-3">Meus Decks</h3>
        {myDecks.isLoading ? (
          <div className="flex justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-violet-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          </div>
        ) : myDecks.data && myDecks.data.length > 0 ? (
          <div className="grid gap-3">
            {myDecks.data.map((deck) => (
              <div key={deck.id} className="bg-card border border-border rounded-xl p-4 hover:border-violet-500/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground">{deck.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400">{deck.subject}</span>
                      <span className="text-xs text-muted-foreground">{deck.cardCount} cards</span>
                      {deck.description && <span className="text-xs text-muted-foreground truncate max-w-[200px]">{deck.description}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startReview(deck.id)}
                      className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
                    >
                      Revisar
                    </button>
                    <button
                      onClick={() => { if (confirm('Excluir este deck?')) deleteDeckMutation.mutate({ deckId: deck.id }); }}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
            <div className="text-4xl mb-3">📚</div>
            <h4 className="font-bold text-foreground mb-1">Nenhum deck criado</h4>
            <p className="text-sm text-muted-foreground mb-4">Gere flashcards com IA para começar a estudar</p>
            <button
              onClick={() => setView('generate')}
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
            >
              Gerar Primeiro Deck
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardStudy;
