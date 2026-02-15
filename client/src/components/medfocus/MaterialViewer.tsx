/**
 * Material Viewer - Interactive Study Area
 * Uses tRPC backend for AI-powered content generation (Quiz, Flashcards, Mind Map, Summary)
 */

import React, { useState } from 'react';
import { AcademicMaterial } from '../../types';
import { trpc } from '@/lib/trpc';
import { Streamdown } from 'streamdown';

interface MaterialViewerProps {
  material: AcademicMaterial;
  userId: string;
  onClose: () => void;
}

type StudyMode = 'read' | 'quiz' | 'flashcards' | 'mindmap' | 'summary';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: string;
}

interface FlashcardItem {
  front: string;
  back: string;
  difficulty: string;
}

interface MindMapNode {
  label: string;
  children: { label: string; children?: { label: string }[] }[];
}

const MaterialViewer: React.FC<MaterialViewerProps> = ({ material, userId, onClose }) => {
  const [studyMode, setStudyMode] = useState<StudyMode>('read');
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Generated Content
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
  const [mindMap, setMindMap] = useState<{ title: string; nodes: MindMapNode[] } | null>(null);
  const [summary, setSummary] = useState('');

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

  // Flashcard State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showCardBack, setShowCardBack] = useState(false);

  // tRPC mutations
  const quizMutation = trpc.ai.generateQuiz.useMutation();
  const flashcardsMutation = trpc.ai.generateFlashcards.useMutation();
  const mindMapMutation = trpc.ai.generateMindMap.useMutation();
  const summaryMutation = trpc.ai.generateSummary.useMutation();

  const materialInput = {
    title: material.title,
    subject: material.subjectName || 'Medicina',
    description: material.description || '',
  };

  const generateQuiz = async () => {
    setIsGenerating(true);
    try {
      const result = await quizMutation.mutateAsync(materialInput);
      setQuiz(result.questions || []);
      setStudyMode('quiz');
      setCurrentQuestionIndex(0);
      setQuizScore({ correct: 0, total: 0 });
      setSelectedAnswer(null);
      setShowExplanation(false);
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFlashcards = async () => {
    setIsGenerating(true);
    try {
      const result = await flashcardsMutation.mutateAsync(materialInput);
      setFlashcards(result.cards || []);
      setStudyMode('flashcards');
      setCurrentCardIndex(0);
      setShowCardBack(false);
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMindMapContent = async () => {
    setIsGenerating(true);
    try {
      const result = await mindMapMutation.mutateAsync(materialInput);
      setMindMap(result);
      setStudyMode('mindmap');
    } catch (error) {
      console.error('Error generating mind map:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSummaryContent = async () => {
    setIsGenerating(true);
    try {
      const result = await summaryMutation.mutateAsync(materialInput);
      setSummary(result);
      setStudyMode('summary');
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    const isCorrect = answerIndex === quiz[currentQuestionIndex].correctIndex;
    setQuizScore(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const nodeColors = ['#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444', '#3b82f6', '#ec4899'];

  const renderContent = () => {
    switch (studyMode) {
      case 'read':
        return (
          <div className="prose prose-slate dark:prose-invert max-w-none p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-4">{material.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mb-6 text-sm text-muted-foreground">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded font-medium">{material.type}</span>
              <span>{material.universityName}</span>
              <span>•</span>
              <span>{material.year}º Ano - {material.semester}º Sem</span>
              <span>•</span>
              <span>{material.subjectName}</span>
            </div>

            <div className="mb-6 p-4 bg-muted/30 rounded-lg">
              <h3 className="text-sm font-semibold text-foreground mb-2">Descrição</h3>
              <p className="text-sm text-muted-foreground">{material.description}</p>
            </div>

            {(material.fileUrl || material.externalUrl) && (
              <div className="mb-6">
                <a
                  href={material.fileUrl || material.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Acessar Material Original
                </a>
              </div>
            )}

            <div className="space-y-4">
              <div className="mt-4 p-6 bg-muted/20 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-3">Ferramentas de Estudo com IA</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use os botões acima para gerar conteúdo interativo com inteligência artificial:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold">❓</span>
                    <div>
                      <span className="text-sm font-medium">Quiz</span>
                      <p className="text-xs text-muted-foreground">5 questões estilo ENARE/Residência</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold">🗂️</span>
                    <div>
                      <span className="text-sm font-medium">Flashcards</span>
                      <p className="text-xs text-muted-foreground">8 cards para revisão espaçada</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold">🧠</span>
                    <div>
                      <span className="text-sm font-medium">Mapa Mental</span>
                      <p className="text-xs text-muted-foreground">Estrutura visual do conteúdo</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold">📝</span>
                    <div>
                      <span className="text-sm font-medium">Resumo</span>
                      <p className="text-xs text-muted-foreground">Resumo acadêmico com referências</p>
                    </div>
                  </div>
                </div>
              </div>

              {material.tags && material.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {material.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'quiz':
        if (quiz.length === 0) return null;
        const currentQuestion = quiz[currentQuestionIndex];
        const isFinished = currentQuestionIndex === quiz.length - 1 && showExplanation;

        return (
          <div className="p-6 md:p-8 max-w-4xl mx-auto">
            {!isFinished ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground">
                      Questão {currentQuestionIndex + 1} de {quiz.length}
                    </h2>
                    <div className="flex items-center gap-3">
                      {currentQuestion.difficulty && (
                        <span className={`px-2 py-1 text-xs rounded font-medium ${
                          currentQuestion.difficulty === 'hard' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                          currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        }`}>
                          {currentQuestion.difficulty === 'hard' ? 'Difícil' : currentQuestion.difficulty === 'medium' ? 'Médio' : 'Fácil'}
                        </span>
                      )}
                      <div className="text-sm font-semibold text-primary">
                        Acertos: {quizScore.correct}/{quizScore.total}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${((currentQuestionIndex + 1) / quiz.length) * 100}%` }} />
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 mb-6">
                  <p className="text-lg text-foreground mb-6">{currentQuestion.question}</p>
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect = index === currentQuestion.correctIndex;
                      const showResult = showExplanation;
                      return (
                        <button
                          key={index}
                          onClick={() => handleQuizAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            showResult && isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950' :
                            showResult && isSelected && !isCorrect ? 'border-red-500 bg-red-50 dark:bg-red-950' :
                            isSelected ? 'border-primary bg-primary/10' :
                            'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold text-sm">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="text-foreground">{option}</span>
                            {showResult && isCorrect && <span className="ml-auto text-green-600 text-lg">✓</span>}
                            {showResult && isSelected && !isCorrect && <span className="ml-auto text-red-600 text-lg">✗</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {showExplanation && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold text-foreground mb-2">Explicação:</h3>
                    <p className="text-sm text-foreground">{currentQuestion.explanation}</p>
                  </div>
                )}

                <div className="flex justify-between">
                  <button onClick={previousQuestion} disabled={currentQuestionIndex === 0}
                    className="px-6 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                    ← Anterior
                  </button>
                  <button onClick={nextQuestion} disabled={!showExplanation || currentQuestionIndex === quiz.length - 1}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                    Próxima →
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🎉</span>
                </div>
                <h2 className="text-2xl font-bold mb-4">Quiz Finalizado!</h2>
                <p className="text-xl mb-2">
                  Você acertou <span className="text-primary font-bold">{quizScore.correct}</span> de {quizScore.total} questões
                </p>
                <p className="text-muted-foreground mb-6">
                  Aproveitamento: {quizScore.total > 0 ? Math.round((quizScore.correct / quizScore.total) * 100) : 0}%
                </p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => { setCurrentQuestionIndex(0); setSelectedAnswer(null); setShowExplanation(false); setQuizScore({ correct: 0, total: 0 }); }}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                    Refazer Quiz
                  </button>
                  <button onClick={generateQuiz}
                    className="px-6 py-3 border border-border rounded-lg hover:bg-muted">
                    Gerar Novo Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'flashcards':
        if (flashcards.length === 0) return null;
        const currentCard = flashcards[currentCardIndex];

        return (
          <div className="p-6 md:p-8 max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  Flashcard {currentCardIndex + 1} de {flashcards.length}
                </h2>
                {currentCard.difficulty && (
                  <span className={`px-2 py-1 text-xs rounded font-medium ${
                    currentCard.difficulty === 'hard' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                    currentCard.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                    'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  }`}>
                    {currentCard.difficulty === 'hard' ? 'Difícil' : currentCard.difficulty === 'medium' ? 'Médio' : 'Fácil'}
                  </span>
                )}
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${((currentCardIndex + 1) / flashcards.length) * 100}%` }} />
              </div>
            </div>

            <div
              className="bg-card border-2 border-border rounded-2xl p-8 md:p-12 min-h-[350px] flex items-center justify-center cursor-pointer hover:border-primary transition-all"
              onClick={() => setShowCardBack(!showCardBack)}
            >
              <div className="text-center max-w-lg">
                <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
                  {showCardBack ? '✅ Resposta' : '❓ Pergunta'} — Clique para virar
                </p>
                <p className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed">
                  {showCardBack ? currentCard.back : currentCard.front}
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={() => { if (currentCardIndex > 0) { setCurrentCardIndex(prev => prev - 1); setShowCardBack(false); } }}
                disabled={currentCardIndex === 0}
                className="px-5 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 text-sm">
                ← Anterior
              </button>
              <button onClick={() => setShowCardBack(!showCardBack)}
                className="px-5 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 text-sm">
                🔄 Virar
              </button>
              <button onClick={() => { if (currentCardIndex < flashcards.length - 1) { setCurrentCardIndex(prev => prev + 1); setShowCardBack(false); } }}
                disabled={currentCardIndex === flashcards.length - 1}
                className="px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 text-sm">
                Próximo →
              </button>
            </div>
          </div>
        );

      case 'mindmap':
        if (!mindMap) return null;
        return (
          <div className="p-6 md:p-8 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">{mindMap.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mindMap.nodes.map((node, index) => (
                <div key={index} className="bg-card border-2 rounded-xl p-5" style={{ borderColor: nodeColors[index % nodeColors.length] }}>
                  <h3 className="text-base font-bold mb-3" style={{ color: nodeColors[index % nodeColors.length] }}>
                    {node.label}
                  </h3>
                  <ul className="space-y-2">
                    {node.children.map((child, idx) => (
                      <li key={idx} className="text-sm text-foreground">
                        <div className="flex items-start gap-2">
                          <span style={{ color: nodeColors[index % nodeColors.length] }}>•</span>
                          <div>
                            <span className="font-medium">{child.label}</span>
                            {child.children && child.children.length > 0 && (
                              <ul className="ml-4 mt-1 space-y-1">
                                {child.children.map((sub, si) => (
                                  <li key={si} className="text-xs text-muted-foreground flex items-start gap-1">
                                    <span>–</span>
                                    <span>{sub.label}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="p-6 md:p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Resumo Gerado por IA</h2>
            <div className="bg-card border border-border rounded-xl p-6">
              <Streamdown>{summary}</Streamdown>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </button>
            <div className="min-w-0">
              <h1 className="font-semibold text-foreground text-sm md:text-base truncate">{material.title}</h1>
              <p className="text-xs text-muted-foreground truncate">{material.universityName} • {material.subjectName}</p>
            </div>
          </div>

          {/* Study Mode Tabs */}
          <div className="flex items-center gap-1 md:gap-2 overflow-x-auto">
            <button onClick={() => setStudyMode('read')}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                studyMode === 'read' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}>
              📖 Ler
            </button>
            <button onClick={quiz.length > 0 ? () => setStudyMode('quiz') : generateQuiz} disabled={isGenerating}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                studyMode === 'quiz' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              } disabled:opacity-50`}>
              ❓ Quiz
            </button>
            <button onClick={flashcards.length > 0 ? () => setStudyMode('flashcards') : generateFlashcards} disabled={isGenerating}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                studyMode === 'flashcards' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              } disabled:opacity-50`}>
              🗂️ Cards
            </button>
            <button onClick={mindMap ? () => setStudyMode('mindmap') : generateMindMapContent} disabled={isGenerating}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                studyMode === 'mindmap' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              } disabled:opacity-50`}>
              🧠 Mapa
            </button>
            <button onClick={summary ? () => setStudyMode('summary') : generateSummaryContent} disabled={isGenerating}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                studyMode === 'summary' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              } disabled:opacity-50`}>
              📝 Resumo
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="h-[calc(100vh-65px)] overflow-y-auto custom-scrollbar">
        {isGenerating ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-semibold text-primary">Gerando conteúdo com IA...</p>
              <p className="text-xs text-muted-foreground mt-1">Isso pode levar alguns segundos</p>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default MaterialViewer;
