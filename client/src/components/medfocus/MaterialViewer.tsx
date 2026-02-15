/**
 * Material Viewer - Interactive Study Area
 * PDF viewer, video player, text reader with annotations, AI features
 */

import React, { useState, useEffect, useRef } from 'react';
import { AcademicMaterial } from '../../types';
import { MaterialsAPI, Annotation, QuizQuestion, Flashcard, MindMap } from '../../services/materialsApi';

interface MaterialViewerProps {
  material: AcademicMaterial;
  userId: string;
  onClose: () => void;
}

type StudyMode = 'read' | 'quiz' | 'flashcards' | 'mindmap' | 'summary';

const MaterialViewer: React.FC<MaterialViewerProps> = ({ material, userId, onClose }) => {
  const [studyMode, setStudyMode] = useState<StudyMode>('read');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedText, setSelectedText] = useState('');
  const [showAnnotationMenu, setShowAnnotationMenu] = useState(false);
  const [annotationPosition, setAnnotationPosition] = useState({ x: 0, y: 0 });
  
  // AI Generated Content
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [mindMap, setMindMap] = useState<MindMap | null>(null);
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  
  // Flashcard State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showCardBack, setShowCardBack] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAnnotations();
  }, [material.id, userId]);

  const loadAnnotations = async () => {
    const annots = await MaterialsAPI.getAnnotations(material.id, userId);
    setAnnotations(annots);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    
    if (text && text.length > 0) {
      setSelectedText(text);
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      
      if (rect) {
        setAnnotationPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        });
        setShowAnnotationMenu(true);
      }
    } else {
      setShowAnnotationMenu(false);
    }
  };

  const addAnnotation = async (color: string) => {
    if (!selectedText) return;
    
    const newAnnotation = {
      materialId: material.id,
      userId,
      content: selectedText,
      position: { selection: selectedText },
      color,
    };
    
    const saved = await MaterialsAPI.saveAnnotation(material.id, newAnnotation);
    setAnnotations([...annotations, saved]);
    setShowAnnotationMenu(false);
    setSelectedText('');
  };

  const generateQuiz = async () => {
    setIsGenerating(true);
    try {
      // Mock content - in real app, would fetch actual material content
      const content = `${material.title}\n\n${material.description}`;
      const questions = await MaterialsAPI.generateQuizFromMaterial(content, 5);
      setQuiz(questions);
      setStudyMode('quiz');
      setCurrentQuestionIndex(0);
      setQuizScore({ correct: 0, total: 0 });
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Erro ao gerar quiz. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFlashcards = async () => {
    setIsGenerating(true);
    try {
      const content = `${material.title}\n\n${material.description}`;
      const cards = await MaterialsAPI.generateFlashcardsFromMaterial(content, 10);
      setFlashcards(cards);
      setStudyMode('flashcards');
      setCurrentCardIndex(0);
      setShowCardBack(false);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert('Erro ao gerar flashcards. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMindMapContent = async () => {
    setIsGenerating(true);
    try {
      const content = `${material.title}\n\n${material.description}`;
      const map = await MaterialsAPI.generateMindMap(content);
      setMindMap(map);
      setStudyMode('mindmap');
    } catch (error) {
      console.error('Error generating mind map:', error);
      alert('Erro ao gerar mapa mental. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSummaryContent = async () => {
    setIsGenerating(true);
    try {
      const content = `${material.title}\n\n${material.description}`;
      const summaryText = await MaterialsAPI.generateSummary(content, 'médio');
      setSummary(summaryText);
      setStudyMode('summary');
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Erro ao gerar resumo. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const isCorrect = answerIndex === quiz[currentQuestionIndex].correctIndex;
    if (isCorrect) {
      setQuizScore(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setQuizScore(prev => ({ ...prev, total: prev.total + 1 }));
    }
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

  const renderContent = () => {
    switch (studyMode) {
      case 'read':
        return (
          <div 
            ref={contentRef}
            className="prose prose-slate dark:prose-invert max-w-none p-8"
            onMouseUp={handleTextSelection}
          >
            <h1 className="text-3xl font-display font-bold mb-4">{material.title}</h1>
            <div className="flex items-center gap-3 mb-6 text-sm text-muted-foreground">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded">{material.type}</span>
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

            {/* Material Content Placeholder */}
            <div className="space-y-4">
              <p className="text-foreground">
                Este é o visualizador de materiais. Em uma implementação completa, aqui seria exibido:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li><strong>PDFs</strong>: Renderizados com biblioteca como react-pdf ou pdf.js</li>
                <li><strong>Vídeos</strong>: Player integrado com controles e transcrição</li>
                <li><strong>Slides</strong>: Visualizador de apresentações</li>
                <li><strong>Texto</strong>: Conteúdo formatado com markdown</li>
              </ul>
              
              <div className="mt-8 p-6 bg-muted/20 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Funcionalidades Disponíveis:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm">Seleção de texto e anotações coloridas</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm">Geração de quiz automático com IA</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm">Flashcards inteligentes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm">Mapas mentais gerados por IA</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm">Resumos automáticos</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm">Salvamento em nuvem</span>
                  </div>
                </div>
              </div>

              {annotations.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Suas Anotações ({annotations.length})</h3>
                  <div className="space-y-2">
                    {annotations.map(annotation => (
                      <div 
                        key={annotation.id}
                        className="p-3 rounded-lg border border-border"
                        style={{ borderLeftColor: annotation.color, borderLeftWidth: '4px' }}
                      >
                        <p className="text-sm text-foreground">{annotation.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(annotation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
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
          <div className="p-8 max-w-4xl mx-auto">
            {!isFinished ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground">
                      Questão {currentQuestionIndex + 1} de {quiz.length}
                    </h2>
                    <div className="text-sm font-semibold text-primary">
                      Acertos: {quizScore.correct}/{quizScore.total}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${((currentQuestionIndex + 1) / quiz.length) * 100}%` }}
                    />
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
                            showResult && isCorrect
                              ? 'border-green-500 bg-green-50 dark:bg-green-950'
                              : showResult && isSelected && !isCorrect
                              ? 'border-red-500 bg-red-50 dark:bg-red-950'
                              : isSelected
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center font-semibold">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="text-foreground">{option}</span>
                            {showResult && isCorrect && (
                              <span className="ml-auto text-green-600">✓</span>
                            )}
                            {showResult && isSelected && !isCorrect && (
                              <span className="ml-auto text-red-600">✗</span>
                            )}
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
                  <button
                    onClick={previousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-6 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Anterior
                  </button>
                  <button
                    onClick={nextQuestion}
                    disabled={!showExplanation || currentQuestionIndex === quiz.length - 1}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima →
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🎉</span>
                </div>
                <h2 className="text-2xl font-bold mb-4">Quiz Finalizado!</h2>
                <p className="text-xl mb-2">
                  Você acertou <span className="text-primary font-bold">{quizScore.correct}</span> de {quizScore.total} questões
                </p>
                <p className="text-muted-foreground mb-6">
                  Aproveitamento: {Math.round((quizScore.correct / quizScore.total) * 100)}%
                </p>
                <button
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setSelectedAnswer(null);
                    setShowExplanation(false);
                    setQuizScore({ correct: 0, total: 0 });
                  }}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  Refazer Quiz
                </button>
              </div>
            )}
          </div>
        );

      case 'flashcards':
        if (flashcards.length === 0) return null;
        
        const currentCard = flashcards[currentCardIndex];

        return (
          <div className="p-8 max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  Flashcard {currentCardIndex + 1} de {flashcards.length}
                </h2>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded">
                  {currentCard.category}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${((currentCardIndex + 1) / flashcards.length) * 100}%` }}
                />
              </div>
            </div>

            <div 
              className="bg-card border-2 border-border rounded-2xl p-12 min-h-[400px] flex items-center justify-center cursor-pointer hover:border-primary transition-all"
              onClick={() => setShowCardBack(!showCardBack)}
            >
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-4">
                  {showCardBack ? 'RESPOSTA' : 'PERGUNTA'} - Clique para virar
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  {showCardBack ? currentCard.back : currentCard.front}
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  if (currentCardIndex > 0) {
                    setCurrentCardIndex(prev => prev - 1);
                    setShowCardBack(false);
                  }
                }}
                disabled={currentCardIndex === 0}
                className="px-6 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50"
              >
                ← Anterior
              </button>
              <button
                onClick={() => setShowCardBack(!showCardBack)}
                className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80"
              >
                🔄 Virar Card
              </button>
              <button
                onClick={() => {
                  if (currentCardIndex < flashcards.length - 1) {
                    setCurrentCardIndex(prev => prev + 1);
                    setShowCardBack(false);
                  }
                }}
                disabled={currentCardIndex === flashcards.length - 1}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                Próximo →
              </button>
            </div>
          </div>
        );

      case 'mindmap':
        if (!mindMap) return null;

        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-8">{mindMap.centralTopic}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mindMap.branches.map((branch, index) => (
                <div 
                  key={index}
                  className="bg-card border-2 rounded-xl p-6"
                  style={{ borderColor: branch.color }}
                >
                  <h3 className="text-lg font-bold mb-4" style={{ color: branch.color }}>
                    {branch.title}
                  </h3>
                  <ul className="space-y-2">
                    {branch.subtopics.map((subtopic, idx) => (
                      <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{subtopic}</span>
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
          <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Resumo Gerado por IA</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="bg-card border border-border rounded-xl p-6">
                {summary.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-foreground">{paragraph}</p>
                ))}
              </div>
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
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </button>
            <div>
              <h1 className="font-semibold text-foreground">{material.title}</h1>
              <p className="text-xs text-muted-foreground">{material.universityName} • {material.subjectName}</p>
            </div>
          </div>

          {/* Study Mode Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStudyMode('read')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                studyMode === 'read'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              📖 Ler
            </button>
            <button
              onClick={quiz.length > 0 ? () => setStudyMode('quiz') : generateQuiz}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                studyMode === 'quiz'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              } disabled:opacity-50`}
            >
              ❓ Quiz
            </button>
            <button
              onClick={flashcards.length > 0 ? () => setStudyMode('flashcards') : generateFlashcards}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                studyMode === 'flashcards'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              } disabled:opacity-50`}
            >
              🗂️ Cards
            </button>
            <button
              onClick={mindMap ? () => setStudyMode('mindmap') : generateMindMapContent}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                studyMode === 'mindmap'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              } disabled:opacity-50`}
            >
              🧠 Mapa
            </button>
            <button
              onClick={summary ? () => setStudyMode('summary') : generateSummaryContent}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                studyMode === 'summary'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              } disabled:opacity-50`}
            >
              📝 Resumo
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="h-[calc(100vh-73px)] overflow-y-auto custom-scrollbar">
        {isGenerating ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-semibold text-primary">Gerando conteúdo com IA...</p>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </div>

      {/* Annotation Menu */}
      {showAnnotationMenu && (
        <div
          className="fixed bg-card border border-border rounded-lg shadow-lg p-2 flex gap-2 z-50"
          style={{
            left: `${annotationPosition.x}px`,
            top: `${annotationPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <button
            onClick={() => addAnnotation('#FFD700')}
            className="w-8 h-8 rounded bg-yellow-400 hover:scale-110 transition-transform"
            title="Amarelo"
          />
          <button
            onClick={() => addAnnotation('#90EE90')}
            className="w-8 h-8 rounded bg-green-400 hover:scale-110 transition-transform"
            title="Verde"
          />
          <button
            onClick={() => addAnnotation('#87CEEB')}
            className="w-8 h-8 rounded bg-blue-400 hover:scale-110 transition-transform"
            title="Azul"
          />
          <button
            onClick={() => addAnnotation('#FFB6C1')}
            className="w-8 h-8 rounded bg-pink-400 hover:scale-110 transition-transform"
            title="Rosa"
          />
        </div>
      )}
    </div>
  );
};

export default MaterialViewer;
