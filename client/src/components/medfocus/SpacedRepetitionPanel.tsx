/**
 * SpacedRepetitionPanel - Sistema de Revisão Espaçada SM-2
 * 
 * Interface completa para revisão de flashcards com algoritmo SM-2,
 * estatísticas de desempenho, previsão de revisões e importação de cards.
 */
import React, { useState, useMemo, useCallback } from 'react';
import { useSpacedRepetition, QUALITY_LABELS, type ResponseQuality, type SM2Card } from '../../hooks/useSpacedRepetition';
import { ALL_SUBJECTS } from '../../data/preloadedContent';

type PanelView = 'dashboard' | 'review' | 'browse' | 'import' | 'settings' | 'stats';

const SpacedRepetitionPanel: React.FC = () => {
  const sr = useSpacedRepetition();
  const [view, setView] = useState<PanelView>('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionCards, setSessionCards] = useState<SM2Card[]>([]);

  const stats = useMemo(() => sr.getStats(selectedSubject), [sr, selectedSubject]);
  const subjects = useMemo(() => sr.getSubjects(), [sr]);
  const dueCards = useMemo(() => sr.getDueCards(selectedSubject), [sr, selectedSubject]);

  // Import flashcards from preloaded content
  const handleImportSubject = useCallback((subjectName: string) => {
    const subject = ALL_SUBJECTS.find(s => s.name === subjectName);
    if (!subject) return;

    const cardsToImport = subject.flashcards.map((fc, i) => ({
      id: `${subjectName}_fc_${i}`,
      front: fc.front,
      back: fc.back,
      subject: subjectName,
    }));

    sr.importCards(cardsToImport);
  }, [sr]);

  // Start review session
  const handleStartReview = useCallback(() => {
    const cards = sr.getDueCards(selectedSubject);
    if (cards.length === 0) return;
    
    setSessionCards(cards.slice(0, sr.settings.reviewsPerDay));
    setCurrentCardIndex(0);
    setShowAnswer(false);
    sr.startSession(selectedSubject);
    setView('review');
  }, [sr, selectedSubject]);

  // Handle card review
  const handleReview = useCallback((quality: ResponseQuality) => {
    const card = sessionCards[currentCardIndex];
    if (!card) return;
    
    sr.reviewCard(card.id, quality);
    
    if (currentCardIndex < sessionCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      const session = sr.endSession();
      setView('dashboard');
      if (session) {
        // Session completed
      }
    }
  }, [sr, sessionCards, currentCardIndex]);

  // Dashboard View
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground font-medium">Total de Cards</p>
          <p className="text-2xl font-bold text-foreground">{stats.totalCards}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground font-medium">Para Revisar Hoje</p>
          <p className="text-2xl font-bold text-teal-500">{stats.dueCards + Math.min(stats.newCards, sr.settings.newCardsPerDay)}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground font-medium">Taxa de Retenção</p>
          <p className="text-2xl font-bold text-green-500">{stats.retentionRate.toFixed(0)}%</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground font-medium">Revisões Hoje</p>
          <p className="text-2xl font-bold text-blue-500">{stats.todayReviews}</p>
        </div>
      </div>

      {/* Start Review Button */}
      {(stats.dueCards > 0 || stats.newCards > 0) && (
        <button
          onClick={handleStartReview}
          className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 3l14 9-14 9V3z"/></svg>
          Iniciar Revisão ({stats.dueCards} pendentes + {Math.min(stats.newCards, sr.settings.newCardsPerDay)} novos)
        </button>
      )}

      {stats.totalCards === 0 && (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <div className="text-4xl mb-4">🧠</div>
          <h3 className="text-lg font-bold text-foreground mb-2">Nenhum card importado</h3>
          <p className="text-muted-foreground mb-4">
            Importe flashcards das disciplinas para começar a usar o sistema de revisão espaçada.
          </p>
          <button
            onClick={() => setView('import')}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Importar Cards
          </button>
        </div>
      )}

      {/* Subject Filter */}
      {subjects.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">Disciplinas</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedSubject(undefined)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                !selectedSubject ? 'bg-teal-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Todas
            </button>
            {subjects.map(s => (
              <button
                key={s.name}
                onClick={() => setSelectedSubject(s.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedSubject === s.name ? 'bg-teal-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {s.name} ({s.due + s.new})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 7-Day Forecast */}
      {stats.totalCards > 0 && (
        <div className="bg-card rounded-xl p-4 border border-border">
          <h3 className="text-sm font-bold text-foreground mb-3">Previsão de Revisões (7 dias)</h3>
          <div className="flex items-end gap-2 h-24">
            {stats.forecastNext7Days.map((count, i) => {
              const maxCount = Math.max(...stats.forecastNext7Days, 1);
              const height = (count / maxCount) * 100;
              const days = ['Hoje', 'Amanhã', 'D+2', 'D+3', 'D+4', 'D+5', 'D+6'];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">{count}</span>
                  <div
                    className="w-full rounded-t-md bg-teal-500/20"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  >
                    <div
                      className="w-full h-full rounded-t-md bg-teal-500 transition-all"
                      style={{ opacity: i === 0 ? 1 : 0.6 }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{days[i]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Card Distribution */}
      {stats.totalCards > 0 && (
        <div className="bg-card rounded-xl p-4 border border-border">
          <h3 className="text-sm font-bold text-foreground mb-3">Distribuição de Cards</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-1">
                <span className="text-sm font-bold text-blue-500">{stats.newCards}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Novos</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-1">
                <span className="text-sm font-bold text-orange-500">{stats.learningCards}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Aprendendo</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-1">
                <span className="text-sm font-bold text-green-500">{stats.matureCards}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Maduros</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-1">
                <span className="text-sm font-bold text-red-500">{stats.dueCards}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Pendentes</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setView('import')}
          className="p-3 bg-card rounded-xl border border-border hover:border-teal-500/50 transition-colors text-center"
        >
          <span className="text-xl">📥</span>
          <p className="text-xs text-muted-foreground mt-1">Importar</p>
        </button>
        <button
          onClick={() => setView('browse')}
          className="p-3 bg-card rounded-xl border border-border hover:border-teal-500/50 transition-colors text-center"
        >
          <span className="text-xl">📋</span>
          <p className="text-xs text-muted-foreground mt-1">Navegar</p>
        </button>
        <button
          onClick={() => setView('settings')}
          className="p-3 bg-card rounded-xl border border-border hover:border-teal-500/50 transition-colors text-center"
        >
          <span className="text-xl">⚙️</span>
          <p className="text-xs text-muted-foreground mt-1">Config</p>
        </button>
      </div>
    </div>
  );

  // Review View
  const renderReview = () => {
    const card = sessionCards[currentCardIndex];
    if (!card) return null;

    const progress = ((currentCardIndex + 1) / sessionCards.length) * 100;

    return (
      <div className="space-y-4">
        {/* Progress */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sr.endSession();
              setView('dashboard');
            }}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div className="flex-1">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {currentCardIndex + 1}/{sessionCards.length}
          </span>
        </div>

        {/* Subject badge */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-teal-500/10 text-teal-500 rounded text-xs font-medium">
            {card.subject}
          </span>
          {card.repetition === 0 && (
            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded text-xs font-medium">
              Novo
            </span>
          )}
          {card.lapses > 0 && (
            <span className="px-2 py-0.5 bg-red-500/10 text-red-500 rounded text-xs font-medium">
              {card.lapses} lapso(s)
            </span>
          )}
        </div>

        {/* Card */}
        <div
          className="min-h-[300px] bg-card rounded-2xl border border-border p-6 flex flex-col items-center justify-center cursor-pointer select-none"
          onClick={() => !showAnswer && setShowAnswer(true)}
        >
          <div className="text-center max-w-lg">
            <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
              {showAnswer ? 'Resposta' : 'Pergunta'}
            </p>
            <p className="text-lg font-medium text-foreground leading-relaxed">
              {showAnswer ? card.back : card.front}
            </p>
          </div>

          {!showAnswer && (
            <div className="mt-8">
              <p className="text-sm text-muted-foreground">Toque para ver a resposta</p>
            </div>
          )}
        </div>

        {/* Answer Buttons */}
        {showAnswer && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground text-center">Como foi sua resposta?</p>
            <div className="grid grid-cols-3 gap-2">
              {([0, 1, 2, 3, 4, 5] as ResponseQuality[]).map(q => {
                const info = QUALITY_LABELS[q];
                return (
                  <button
                    key={q}
                    onClick={() => handleReview(q)}
                    className="p-3 rounded-xl border border-border hover:border-current transition-all text-center"
                    style={{ color: info.color }}
                  >
                    <p className="text-sm font-bold">{info.label}</p>
                    <p className="text-[10px] opacity-70 mt-0.5">{info.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Import View
  const renderImport = () => {
    const importedSubjects = new Set(sr.cards.map(c => c.subject));

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setView('dashboard')} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <h2 className="text-lg font-bold text-foreground">Importar Flashcards</h2>
        </div>

        <p className="text-sm text-muted-foreground">
          Selecione as disciplinas para importar seus flashcards ao sistema de revisão espaçada.
        </p>

        <div className="space-y-2">
          {ALL_SUBJECTS.map(subject => {
            const isImported = importedSubjects.has(subject.name);
            const cardCount = subject.flashcards.length;
            return (
              <div
                key={subject.name}
                className="flex items-center justify-between p-3 bg-card rounded-xl border border-border"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{subject.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {cardCount} flashcards · {subject.year}º ano
                  </p>
                </div>
                <button
                  onClick={() => handleImportSubject(subject.name)}
                  disabled={isImported}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isImported
                      ? 'bg-green-500/10 text-green-500 cursor-default'
                      : 'bg-teal-500 text-white hover:bg-teal-600'
                  }`}
                >
                  {isImported ? '✓ Importado' : 'Importar'}
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            ALL_SUBJECTS.forEach(s => handleImportSubject(s.name));
          }}
          className="w-full py-3 bg-teal-500/10 text-teal-500 rounded-xl font-medium hover:bg-teal-500/20 transition-colors"
        >
          Importar Todas as Disciplinas
        </button>
      </div>
    );
  };

  // Browse View
  const renderBrowse = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredCards = sr.cards.filter(c => {
      if (selectedSubject && c.subject !== selectedSubject) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return c.front.toLowerCase().includes(term) || c.back.toLowerCase().includes(term);
      }
      return true;
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setView('dashboard')} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <h2 className="text-lg font-bold text-foreground">Navegar Cards ({filteredCards.length})</h2>
        </div>

        <input
          type="text"
          placeholder="Buscar por conteúdo..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground border-0 focus:ring-2 focus:ring-teal-500"
        />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedSubject(undefined)}
            className={`px-3 py-1 rounded-lg text-xs ${!selectedSubject ? 'bg-teal-500 text-white' : 'bg-muted text-muted-foreground'}`}
          >
            Todas
          </button>
          {subjects.map(s => (
            <button
              key={s.name}
              onClick={() => setSelectedSubject(s.name)}
              className={`px-3 py-1 rounded-lg text-xs ${selectedSubject === s.name ? 'bg-teal-500 text-white' : 'bg-muted text-muted-foreground'}`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {filteredCards.slice(0, 50).map(card => {
            const intervalText = card.interval === 0 ? 'Novo' :
              card.interval < 1 ? `${Math.round(card.interval * 24)}h` :
              card.interval === 1 ? '1 dia' : `${card.interval} dias`;
            
            return (
              <div key={card.id} className="p-3 bg-card rounded-xl border border-border">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{card.front}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{card.back}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      card.repetition === 0 ? 'bg-blue-500/10 text-blue-500' :
                      card.interval >= 21 ? 'bg-green-500/10 text-green-500' :
                      'bg-orange-500/10 text-orange-500'
                    }`}>
                      {intervalText}
                    </span>
                    <button
                      onClick={() => sr.resetCard(card.id)}
                      className="p-1 rounded hover:bg-muted text-muted-foreground"
                      title="Resetar card"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                  <span>EF: {card.easeFactor.toFixed(2)}</span>
                  <span>Revisões: {card.totalReviews}</span>
                  <span>Acertos: {card.totalReviews > 0 ? Math.round((card.correctReviews / card.totalReviews) * 100) : 0}%</span>
                  <span>Sequência: {card.streak}</span>
                </div>
              </div>
            );
          })}
          {filteredCards.length > 50 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              Mostrando 50 de {filteredCards.length} cards
            </p>
          )}
        </div>
      </div>
    );
  };

  // Settings View
  const renderSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setView('dashboard')} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h2 className="text-lg font-bold text-foreground">Configurações SM-2</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-card rounded-xl p-4 border border-border space-y-3">
          <h3 className="text-sm font-bold text-foreground">Limites Diários</h3>
          <div>
            <label className="text-xs text-muted-foreground">Cards novos por dia</label>
            <input
              type="number"
              value={sr.settings.newCardsPerDay}
              onChange={e => sr.updateSettings({ newCardsPerDay: parseInt(e.target.value) || 20 })}
              className="w-full mt-1 px-3 py-2 bg-muted rounded-lg text-sm text-foreground border-0"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Revisões por dia (máximo)</label>
            <input
              type="number"
              value={sr.settings.reviewsPerDay}
              onChange={e => sr.updateSettings({ reviewsPerDay: parseInt(e.target.value) || 100 })}
              className="w-full mt-1 px-3 py-2 bg-muted rounded-lg text-sm text-foreground border-0"
            />
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border space-y-3">
          <h3 className="text-sm font-bold text-foreground">Parâmetros do Algoritmo</h3>
          <div>
            <label className="text-xs text-muted-foreground">Bônus para "Fácil" (multiplicador)</label>
            <input
              type="number"
              step="0.1"
              value={sr.settings.easyBonus}
              onChange={e => sr.updateSettings({ easyBonus: parseFloat(e.target.value) || 1.3 })}
              className="w-full mt-1 px-3 py-2 bg-muted rounded-lg text-sm text-foreground border-0"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Modificador de intervalo</label>
            <input
              type="number"
              step="0.1"
              value={sr.settings.intervalModifier}
              onChange={e => sr.updateSettings({ intervalModifier: parseFloat(e.target.value) || 1.0 })}
              className="w-full mt-1 px-3 py-2 bg-muted rounded-lg text-sm text-foreground border-0"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Intervalo após lapso (dias)</label>
            <input
              type="number"
              value={sr.settings.lapseInterval}
              onChange={e => sr.updateSettings({ lapseInterval: parseInt(e.target.value) || 1 })}
              className="w-full mt-1 px-3 py-2 bg-muted rounded-lg text-sm text-foreground border-0"
            />
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border">
          <h3 className="text-sm font-bold text-foreground mb-2">Sobre o Algoritmo SM-2</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            O SuperMemo 2 (SM-2) é um algoritmo de revisão espaçada desenvolvido por Piotr Wozniak em 1987. 
            Ele calcula o intervalo ideal entre revisões baseado na facilidade de cada card e na qualidade 
            das suas respostas. Cards mais difíceis são revisados com mais frequência, enquanto cards fáceis 
            têm intervalos progressivamente maiores, otimizando a retenção de longo prazo.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            🧠 Revisão Espaçada
          </h1>
          <p className="text-sm text-muted-foreground">
            Algoritmo SM-2 para memorização de longo prazo
          </p>
        </div>
        {view !== 'dashboard' && view !== 'review' && (
          <button
            onClick={() => setView('dashboard')}
            className="px-3 py-1.5 bg-muted rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Voltar
          </button>
        )}
      </div>

      {/* Content */}
      {view === 'dashboard' && renderDashboard()}
      {view === 'review' && renderReview()}
      {view === 'import' && renderImport()}
      {view === 'browse' && renderBrowse()}
      {view === 'settings' && renderSettings()}
    </div>
  );
};

export default SpacedRepetitionPanel;
