/**
 * MedFocus — Estudo Interativo com Conteúdo Pré-carregado
 * Flashcards com Spaced Repetition, Quizzes e Resumos offline
 * Design: Medical Precision — Teal accent, card-based
 */
import React, { useState, useEffect } from 'react';
import { ALL_SUBJECTS, SubjectBundle, findSubjectContent } from '../../data/preloadedContent';
import { XP_ACTIONS } from '../../data/gamification';

type StudyMode = 'browse' | 'summary' | 'flashcards' | 'quiz' | 'results';

interface PreloadedStudyProps {
  onQuizComplete?: (correct: number, total: number) => void;
  onFlashcardReview?: () => void;
  onSubjectStudy?: (subjectName: string) => void;
}

const PreloadedStudy: React.FC<PreloadedStudyProps> = ({ onQuizComplete, onFlashcardReview, onSubjectStudy }) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectBundle | null>(null);
  const [mode, setMode] = useState<StudyMode>('browse');
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<boolean[]>([]);
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = ALL_SUBJECTS.filter(s => {
    const matchYear = filterYear === null || s.year === filterYear;
    const matchSearch = searchTerm === '' || s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchYear && matchSearch;
  });

  const startStudy = (subject: SubjectBundle, studyMode: StudyMode) => {
    setSelectedSubject(subject);
    setMode(studyMode);
    setCurrentFlashcard(0);
    setFlipped(false);
    setCurrentQuiz(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizScore(0);
    setQuizAnswers([]);
    // XP for starting study via hook callback
    if (onSubjectStudy) onSubjectStudy(subject.name);
  };

  const handleFlashcardNext = () => {
    if (!selectedSubject) return;
    // XP via hook callback
    if (onFlashcardReview) onFlashcardReview();
    if (currentFlashcard < selectedSubject.flashcards.length - 1) {
      setCurrentFlashcard(prev => prev + 1);
      setFlipped(false);
    } else {
      setMode('results');
    }
  };

  const handleQuizAnswer = (index: number) => {
    if (selectedAnswer !== null || !selectedSubject) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    const isCorrect = index === selectedSubject.quiz[currentQuiz].correctIndex;
    if (isCorrect) setQuizScore(prev => prev + 1);
    setQuizAnswers(prev => [...prev, isCorrect]);
  };

  const handleQuizNext = () => {
    if (!selectedSubject) return;
    if (currentQuiz < selectedSubject.quiz.length - 1) {
      setCurrentQuiz(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz completed - award XP via hook callback
      if (onQuizComplete) onQuizComplete(quizScore, selectedSubject.quiz.length);
      setMode('results');
    }
  };

  // ─── BROWSE MODE ─────────────────────────────────────────
  if (mode === 'browse') {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Biblioteca de Estudos</h2>
          <p className="text-sm text-muted-foreground mt-1">Conteúdo pré-carregado com resumos, flashcards e quizzes — funciona offline</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input
              type="text"
              placeholder="Buscar disciplina..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => setFilterYear(null)} className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${filterYear === null ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>Todos</button>
            {[1,2,3].map(y => (
              <button key={y} onClick={() => setFilterYear(y)} className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${filterYear === y ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>{y}° Ano</button>
            ))}
          </div>
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map(subject => (
            <div key={subject.id} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold text-primary/60 uppercase tracking-wider">{subject.year}° Ano</span>
                  <h3 className="text-base font-display font-bold text-foreground mt-0.5">{subject.name}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{subject.summary.substring(0, 120)}...</p>
              
              {/* Stats */}
              <div className="flex gap-3 mb-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2"/></svg>
                  {subject.flashcards.length} Flashcards
                </span>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907"/></svg>
                  {subject.quiz.length} Questões
                </span>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4"/></svg>
                  {subject.keyPoints.length} Pontos-chave
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button onClick={() => startStudy(subject, 'summary')} className="flex-1 py-2 bg-primary/10 text-primary text-xs font-semibold rounded-lg hover:bg-primary/20 transition-colors">Resumo</button>
                <button onClick={() => startStudy(subject, 'flashcards')} className="flex-1 py-2 bg-accent text-accent-foreground text-xs font-semibold rounded-lg hover:bg-accent/80 transition-colors">Flashcards</button>
                <button onClick={() => startStudy(subject, 'quiz')} className="flex-1 py-2 bg-muted text-foreground text-xs font-semibold rounded-lg hover:bg-muted/80 transition-colors">Quiz</button>
              </div>
            </div>
          ))}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm">Nenhuma disciplina encontrada para o filtro selecionado.</p>
          </div>
        )}
      </div>
    );
  }

  // ─── SUMMARY MODE ────────────────────────────────────────
  if (mode === 'summary' && selectedSubject) {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl">
        <button onClick={() => setMode('browse')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
          Voltar à Biblioteca
        </button>

        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{selectedSubject.year}° Ano</span>
          <h2 className="text-2xl font-display font-bold text-foreground mt-1">{selectedSubject.name}</h2>
        </div>

        {/* Summary */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
            Resumo Completo
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{selectedSubject.summary}</p>
        </div>

        {/* Key Points */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div>
            Pontos-Chave para Prova
          </h3>
          <div className="space-y-3">
            {selectedSubject.keyPoints.map((point, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Correlation */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg></div>
            Correlação Clínica
          </h3>
          <p className="text-sm text-foreground/80 leading-relaxed">{selectedSubject.clinicalCorrelation}</p>
        </div>

        {/* Mnemonics */}
        {selectedSubject.mnemonics.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg></div>
              Mnemônicos
            </h3>
            <div className="space-y-2">
              {selectedSubject.mnemonics.map((m, i) => (
                <div key={i} className="bg-amber-500/5 border border-amber-500/10 rounded-xl px-4 py-3">
                  <p className="text-sm text-foreground font-medium">{m}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-bold text-foreground mb-3">Referências Bibliográficas</h3>
          <div className="space-y-2">
            {selectedSubject.references.map((ref, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="w-5 h-5 rounded bg-muted flex items-center justify-center text-[9px] font-bold">{i+1}</span>
                <span><strong className="text-foreground">{ref.title}</strong> — {ref.author}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button onClick={() => { setMode('flashcards'); setCurrentFlashcard(0); setFlipped(false); }} className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm">Praticar Flashcards</button>
          <button onClick={() => { setMode('quiz'); setCurrentQuiz(0); setSelectedAnswer(null); setShowExplanation(false); setQuizScore(0); setQuizAnswers([]); }} className="flex-1 py-3 bg-accent text-accent-foreground font-semibold rounded-xl hover:bg-accent/80 transition-colors text-sm">Fazer Quiz</button>
        </div>
      </div>
    );
  }

  // ─── FLASHCARDS MODE ─────────────────────────────────────
  if (mode === 'flashcards' && selectedSubject) {
    const card = selectedSubject.flashcards[currentFlashcard];
    const progress = ((currentFlashcard + 1) / selectedSubject.flashcards.length) * 100;
    return (
      <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        <button onClick={() => setMode('browse')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
          Voltar
        </button>

        <div className="text-center">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{selectedSubject.name}</span>
          <h2 className="text-xl font-display font-bold text-foreground mt-1">Flashcards</h2>
          <p className="text-xs text-muted-foreground mt-1">{currentFlashcard + 1} de {selectedSubject.flashcards.length}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Flashcard */}
        <div
          onClick={() => setFlipped(!flipped)}
          className="relative cursor-pointer min-h-[280px] perspective-1000"
        >
          <div className={`w-full min-h-[280px] transition-all duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
            {/* Front */}
            <div className={`absolute inset-0 bg-card border-2 ${flipped ? 'border-primary/20' : 'border-border'} rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden ${flipped ? 'invisible' : ''}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider mb-4 ${card.difficulty === 'easy' ? 'text-green-500' : card.difficulty === 'medium' ? 'text-amber-500' : 'text-red-500'}`}>
                {card.difficulty === 'easy' ? 'Fácil' : card.difficulty === 'medium' ? 'Médio' : 'Difícil'}
              </span>
              <p className="text-base font-semibold text-foreground text-center leading-relaxed">{card.front}</p>
              <p className="text-xs text-muted-foreground mt-6">Toque para virar</p>
            </div>
            {/* Back */}
            <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/30 rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180 ${!flipped ? 'invisible' : ''}`}>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-4">Resposta</span>
              <p className="text-sm text-foreground text-center leading-relaxed">{card.back}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={() => { if (currentFlashcard > 0) { setCurrentFlashcard(prev => prev - 1); setFlipped(false); } }}
            disabled={currentFlashcard === 0}
            className="flex-1 py-3 bg-muted text-muted-foreground font-semibold rounded-xl hover:bg-accent disabled:opacity-30 transition-colors text-sm"
          >Anterior</button>
          <button
            onClick={handleFlashcardNext}
            className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm"
          >{currentFlashcard === selectedSubject.flashcards.length - 1 ? 'Finalizar' : 'Próximo'}</button>
        </div>
      </div>
    );
  }

  // ─── QUIZ MODE ───────────────────────────────────────────
  if (mode === 'quiz' && selectedSubject) {
    const q = selectedSubject.quiz[currentQuiz];
    const progress = ((currentQuiz + 1) / selectedSubject.quiz.length) * 100;
    return (
      <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        <button onClick={() => setMode('browse')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
          Voltar
        </button>

        <div className="text-center">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{selectedSubject.name}</span>
          <h2 className="text-xl font-display font-bold text-foreground mt-1">Quiz</h2>
          <p className="text-xs text-muted-foreground mt-1">Questão {currentQuiz + 1} de {selectedSubject.quiz.length}</p>
        </div>

        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Question */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-base font-semibold text-foreground leading-relaxed mb-6">{q.question}</p>
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let optClass = 'bg-muted/50 border-border hover:border-primary/30 hover:bg-primary/5';
              if (selectedAnswer !== null) {
                if (i === q.correctIndex) optClass = 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400';
                else if (i === selectedAnswer && i !== q.correctIndex) optClass = 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400';
                else optClass = 'bg-muted/30 border-border opacity-50';
              }
              return (
                <button
                  key={i}
                  onClick={() => handleQuizAnswer(i)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left px-5 py-3.5 border rounded-xl text-sm font-medium transition-all ${optClass}`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mt-5 p-4 bg-primary/5 border border-primary/20 rounded-xl animate-fade-in">
              <p className="text-xs font-bold text-primary mb-1">Explicação:</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{q.explanation}</p>
              <p className="text-[10px] text-muted-foreground mt-2">Fonte: {q.source}</p>
            </div>
          )}
        </div>

        {selectedAnswer !== null && (
          <button
            onClick={handleQuizNext}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm"
          >{currentQuiz === selectedSubject.quiz.length - 1 ? 'Ver Resultado' : 'Próxima Questão'}</button>
        )}
      </div>
    );
  }

  // ─── RESULTS MODE ────────────────────────────────────────
  if (mode === 'results' && selectedSubject) {
    const percentage = quizAnswers.length > 0 ? Math.round((quizScore / quizAnswers.length) * 100) : 100;
    return (
      <div className="space-y-6 animate-fade-in max-w-lg mx-auto text-center">
        <div className="py-8">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-display font-bold ${percentage >= 70 ? 'bg-green-500/10 text-green-500' : percentage >= 50 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
            {percentage}%
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mt-4">
            {percentage >= 80 ? 'Excelente!' : percentage >= 60 ? 'Bom trabalho!' : 'Continue praticando!'}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">{selectedSubject.name}</p>
          {quizAnswers.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">{quizScore} de {quizAnswers.length} corretas</p>
          )}
          <p className="text-xs text-primary mt-3 font-semibold">+{quizAnswers.length > 0 ? (quizScore * XP_ACTIONS.CORRECT_ANSWER + quizAnswers.length * XP_ACTIONS.COMPLETE_QUIZ) : selectedSubject.flashcards.length * XP_ACTIONS.REVIEW_FLASHCARD} XP ganhos!</p>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setMode('browse')} className="flex-1 py-3 bg-muted text-foreground font-semibold rounded-xl hover:bg-accent transition-colors text-sm">Biblioteca</button>
          <button onClick={() => startStudy(selectedSubject, quizAnswers.length > 0 ? 'quiz' : 'flashcards')} className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm">Refazer</button>
        </div>
      </div>
    );
  }

  return null;
};

export default PreloadedStudy;
