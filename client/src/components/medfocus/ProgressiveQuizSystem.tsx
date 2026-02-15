/**
 * Progressive Quiz System — Year-Adaptive Medical Education
 * 
 * Quiz difficulty adapts to student's year (1st-6th):
 * 1º Ano: Básico - Conhecimento e Compreensão (Bloom)
 * 2º Ano: Básico/Intermediário - Compreensão e Aplicação
 * 3º Ano: Intermediário - Aplicação e Análise
 * 4º Ano: Intermediário/Avançado - Análise e Síntese
 * 5º Ano: Avançado - Síntese e Avaliação
 * 6º Ano: Residência - Aplicação clínica complexa
 * 
 * Goal: 100% theoretical mastery so university focus can be on practice and discussion
 */
import React, { useState, useMemo, useEffect } from 'react';
import { ProgressiveQuiz, MedicalYear } from '../../types';

interface ProgressiveQuizSystemProps {
  currentYear: MedicalYear;
  subjectId: string;
  materialId?: string;
  onComplete?: (score: number, correct: number, total: number) => void;
}

const ProgressiveQuizSystem: React.FC<ProgressiveQuizSystemProps> = ({
  currentYear,
  subjectId,
  materialId,
  onComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; correct: boolean; timeSpent: number }[]>([]);
  const [startTime, setStartTime] = useState(Date.now());

  // Mock quiz data - In production, this would come from AI generation or database
  const allQuizzes: ProgressiveQuiz[] = [
    // 1º Ano - Anatomia Básica
    {
      id: 'q1_anatomia_basico',
      question: 'Qual é a camada mais externa do coração?',
      options: [
        'Endocárdio',
        'Miocárdio',
        'Epicárdio',
        'Pericárdio',
      ],
      correctIndex: 2,
      explanation: 'O epicárdio é a camada mais externa do coração, sendo também chamado de pericárdio visceral. O pericárdio é uma membrana que envolve o coração externamente.',
      difficulty: 'basico',
      targetYear: 1,
      topics: ['anatomia', 'cardiologia'],
      bloomLevel: 'conhecimento',
      estimatedTime: 30,
      references: [
        {
          id: 'ref_gray',
          title: 'Gray\'s Anatomia',
          authors: ['Susan Standring'],
          source: 'Elsevier',
          year: 2020,
          quality: 'gold',
        },
      ],
    },
    // 2º Ano - Fisiologia Intermediária
    {
      id: 'q2_fisiologia_inter',
      question: 'Um paciente apresenta hiponatremia. Qual hormônio está PRINCIPALMENTE envolvido na regulação do sódio sérico?',
      options: [
        'Hormônio antidiurético (ADH)',
        'Aldosterona',
        'Hormônio natriurético atrial (ANP)',
        'Cortisol',
      ],
      correctIndex: 1,
      explanation: 'A aldosterona é o principal hormônio regulador do sódio, atuando no túbulo coletor renal para aumentar a reabsorção de Na+ e excreção de K+. O ADH regula principalmente água, não sódio diretamente.',
      difficulty: 'intermediario',
      targetYear: 2,
      topics: ['fisiologia', 'nefrologia', 'endocrinologia'],
      bloomLevel: 'compreensao',
      estimatedTime: 45,
      references: [
        {
          id: 'ref_guyton',
          title: 'Guyton & Hall - Tratado de Fisiologia Médica',
          authors: ['John E. Hall'],
          source: 'Elsevier',
          year: 2020,
          quality: 'gold',
        },
      ],
    },
    // 3º Ano - Farmacologia Aplicação
    {
      id: 'q3_farma_aplicacao',
      question: 'Um paciente hipertenso apresenta tosse seca persistente após início de enalapril. Qual é o mecanismo farmacológico dessa reação adversa?',
      options: [
        'Aumento de bradicinina devido à inibição da ECA',
        'Bloqueio direto dos receptores de angiotensina II',
        'Broncoconstrição por liberação de histamina',
        'Estimulação de receptores colinérgicos pulmonares',
      ],
      correctIndex: 0,
      explanation: 'Os IECAs (como enalapril) inibem a enzima conversora de angiotensina (ECA), que também degrada bradicinina. O acúmulo de bradicinina causa tosse seca em até 15% dos pacientes. Nestes casos, considerar trocar para BRA (bloqueadores dos receptores de angiotensina).',
      difficulty: 'intermediario',
      targetYear: 3,
      topics: ['farmacologia', 'cardiologia', 'hipertensão'],
      bloomLevel: 'aplicacao',
      estimatedTime: 60,
      references: [
        {
          id: 'ref_katzung',
          title: 'Farmacologia Básica e Clínica - Katzung',
          authors: ['Bertram G. Katzung'],
          source: 'McGraw-Hill',
          year: 2021,
          quality: 'gold',
        },
      ],
    },
    // 4º Ano - Clínica Análise
    {
      id: 'q4_clinica_analise',
      question: 'Paciente de 65 anos com dispneia aos esforços, crepitações bibasais, B3 à ausculta e BNP elevado. Qual a provável classificação funcional NYHA e qual intervenção tem MAIOR impacto na mortalidade?',
      options: [
        'NYHA II; Betabloqueador (carvedilol ou metoprolol)',
        'NYHA III; Diurético (furosemida)',
        'NYHA II; IECA/BRA',
        'NYHA IV; Digoxina',
      ],
      correctIndex: 0,
      explanation: 'Quadro sugere ICC NYHA II (sintomas aos esforços moderados). Entre as opções, betabloqueadores (carvedilol, bisoprolol, metoprolol succinato) têm evidência robusta de redução de mortalidade em IC com FE reduzida. IECAs/BRAs também reduzem mortalidade, mas a questão pede MAIOR impacto - ambos são comparáveis, mas betabloqueadores são resposta mais específica considerando o conjunto.',
      difficulty: 'avancado',
      targetYear: 4,
      topics: ['cardiologia', 'insuficiência cardíaca', 'farmacoterapia'],
      bloomLevel: 'analise',
      estimatedTime: 90,
      references: [
        {
          id: 'ref_acc_aha',
          title: 'ACC/AHA Heart Failure Guidelines 2022',
          authors: ['American College of Cardiology'],
          source: 'Circulation',
          year: 2022,
          quality: 'gold',
          citationCount: 2450,
        },
      ],
    },
    // 5º Ano - Síntese Clínica
    {
      id: 'q5_sintese_clinica',
      question: 'Paciente de 58 anos, diabético, apresenta dor torácica típica + supra ST em DII, DIII e aVF. PA 90/60, FC 45 bpm. Conduta IMEDIATA mais adequada:',
      options: [
        'AAS + clopidogrel + angioplastia primária + atropina se sintomático',
        'Trombolítico (tenecteplase) + atropina + marca-passo temporário',
        'Betabloqueador EV + AAS + heparina + cateterismo eletivo',
        'Nitroglicerina SL + morfina + AAS + cateterismo urgente',
      ],
      correctIndex: 0,
      explanation: 'IAM inferior (DII, DIII, aVF) com instabilidade hemodinâmica e bradicardia. Angioplastia primária é superior a trombolítico em centros com capacidade (tempo porta-balão <90-120min). Atropina se bradicardia sintomática. Betabloqueador está CONTRAINDICADO (bradicardia + hipotensão). Questão exige síntese de protocolos ACS + interpretação hemodinâmica.',
      difficulty: 'avancado',
      targetYear: 5,
      topics: ['cardiologia', 'emergência', 'síndrome coronariana aguda'],
      bloomLevel: 'sintese',
      estimatedTime: 120,
      references: [
        {
          id: 'ref_stemi_guidelines',
          title: 'ESC Guidelines for STEMI Management',
          authors: ['European Society of Cardiology'],
          source: 'European Heart Journal',
          year: 2023,
          quality: 'gold',
          citationCount: 3200,
        },
      ],
    },
    // 6º Ano - Residência
    {
      id: 'q6_residencia',
      question: 'Gestante de 32 semanas com diagnóstico recente de hipertireoidismo (TSH <0,01, T4L elevado). Apresenta taquicardia, tremores e perda ponderal. Qual a melhor conduta considerando risco fetal e materno?',
      options: [
        'Propiltiouracil (PTU) na menor dose efetiva + propranolol + monitorar T4L materno e crescimento fetal',
        'Metimazol + atenolol + ultrassom obstétrico mensal',
        'Radioiodo (I-131) em dose fracionada para evitar toxicidade fetal',
        'Tireoidectomia subtotal imediata no 2º trimestre',
      ],
      correctIndex: 0,
      explanation: 'Em gestantes, PTU é preferido no 1º trimestre (menor risco de aplasia cutis); no 2º/3º trimestres, ambos PTU e metimazol podem ser usados, mas PTU já iniciado geralmente é mantido. Radioiodo é CONTRAINDICADO (ablação de tireoide fetal). Betabloqueador para sintomas adrenérgicos (propranolol preferível a atenolol). Cirurgia reservada para casos refratários. Meta: T4L no limite superior da normalidade para evitar hipotireoidismo fetal. Questão típica de prova de residência - integração obstetrícia + endocrinologia + farmacoterapia.',
      difficulty: 'residencia',
      targetYear: 6,
      topics: ['endocrinologia', 'obstetrícia', 'hipertireoidismo', 'farmacoterapia'],
      bloomLevel: 'avaliacao',
      estimatedTime: 150,
      references: [
        {
          id: 'ref_thyroid_pregnancy',
          title: 'Management of Thyroid Dysfunction during Pregnancy and Postpartum',
          authors: ['American Thyroid Association'],
          source: 'Thyroid',
          year: 2023,
          quality: 'gold',
          citationCount: 1850,
        },
      ],
    },
  ];

  // Filter quizzes based on year and subject
  const availableQuizzes = useMemo(() => {
    return allQuizzes.filter(quiz => {
      // Filter by subject
      if (subjectId && !quiz.topics.includes(subjectId)) return false;
      
      // Filter by year - show questions for current year and below
      if (quiz.targetYear > currentYear) return false;
      
      // If material-specific, filter by material
      // (In production, this would check quiz.materialId === materialId)
      
      return true;
    });
  }, [allQuizzes, currentYear, subjectId, materialId]);

  const currentQuestion = availableQuizzes[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / availableQuizzes.length) * 100;

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return; // Already answered
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const isCorrect = selectedAnswer === currentQuestion.correctIndex;

    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.id,
        correct: isCorrect,
        timeSpent,
      },
    ]);

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < availableQuizzes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setStartTime(Date.now());
    } else {
      // Quiz completed
      const correctCount = answers.filter(a => a.correct).length + (selectedAnswer === currentQuestion.correctIndex ? 1 : 0);
      const totalCount = availableQuizzes.length;
      const score = Math.round((correctCount / totalCount) * 100);
      
      if (onComplete) {
        onComplete(score, correctCount, totalCount);
      }
    }
  };

  if (availableQuizzes.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <span className="text-4xl">📝</span>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Nenhum quiz disponível</h3>
        <p className="text-muted-foreground">
          Ainda não há questões para este tópico e ano
        </p>
      </div>
    );
  }

  // Difficulty color mapping
  const difficultyConfig = {
    basico: { label: 'Básico', color: 'bg-green-100 text-green-800 border-green-200' },
    intermediario: { label: 'Intermediário', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    avancado: { label: 'Avançado', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    residencia: { label: 'Residência', color: 'bg-red-100 text-red-800 border-red-200' },
  };

  const bloomConfig = {
    conhecimento: { icon: '📖', label: 'Conhecimento' },
    compreensao: { icon: '💡', label: 'Compreensão' },
    aplicacao: { icon: '🔧', label: 'Aplicação' },
    analise: { icon: '🔍', label: 'Análise' },
    sintese: { icon: '🧩', label: 'Síntese' },
    avaliacao: { icon: '⚖️', label: 'Avaliação' },
  };

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Quiz Progressivo - {currentYear}º Ano
              </h1>
              <p className="text-muted-foreground">
                Questão {currentQuestionIndex + 1} de {availableQuizzes.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {answers.filter(a => a.correct).length} / {answers.length}
              </div>
              <div className="text-xs text-muted-foreground">corretas até agora</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-card border border-border rounded-xl p-8 mb-6">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${difficultyConfig[currentQuestion.difficulty].color}`}>
              {difficultyConfig[currentQuestion.difficulty].label}
            </span>
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              {bloomConfig[currentQuestion.bloomLevel].icon} {bloomConfig[currentQuestion.bloomLevel].label}
            </span>
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-muted text-foreground border border-border">
              ⏱️ ~{currentQuestion.estimatedTime}s
            </span>
            {currentQuestion.targetYear && (
              <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                📚 {currentQuestion.targetYear}º Ano
              </span>
            )}
          </div>

          {/* Question */}
          <h2 className="text-xl font-bold text-foreground mb-6 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctIndex;
              const showResult = showExplanation;

              let optionClass = 'bg-muted hover:bg-muted/80 border-border';
              
              if (showResult) {
                if (isCorrect) {
                  optionClass = 'bg-green-50 border-green-500 ring-2 ring-green-200';
                } else if (isSelected && !isCorrect) {
                  optionClass = 'bg-red-50 border-red-500 ring-2 ring-red-200';
                }
              } else if (isSelected) {
                optionClass = 'bg-primary/10 border-primary ring-2 ring-primary/20';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 border-2 rounded-xl text-left transition-all ${optionClass} ${
                    showExplanation ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      showResult && isCorrect ? 'bg-green-500 text-white' :
                      showResult && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                      isSelected ? 'bg-primary text-primary-foreground' :
                      'bg-background text-foreground'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className={`text-sm font-medium ${
                      showResult && isCorrect ? 'text-green-900' :
                      showResult && isSelected && !isCorrect ? 'text-red-900' :
                      'text-foreground'
                    }`}>
                      {option}
                    </span>
                    {showResult && isCorrect && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600 ml-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-600 ml-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`mt-6 p-5 rounded-xl border-2 ${
              selectedAnswer === currentQuestion.correctIndex
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3 mb-3">
                {selectedAnswer === currentQuestion.correctIndex ? (
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-2 ${
                    selectedAnswer === currentQuestion.correctIndex ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {selectedAnswer === currentQuestion.correctIndex ? 'Correto! 🎉' : 'Incorreto'}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    selectedAnswer === currentQuestion.correctIndex ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>

              {/* References */}
              {currentQuestion.references.length > 0 && (
                <div className="mt-4 pt-4 border-t border-current/20">
                  <h4 className="text-xs font-bold text-foreground/70 mb-2">📚 REFERÊNCIAS:</h4>
                  {currentQuestion.references.map(ref => (
                    <div key={ref.id} className="text-xs text-foreground/60 mb-1">
                      <span className="font-semibold">{ref.title}</span>
                      {' — '}
                      <span>{ref.authors.join(', ')}</span>
                      {' • '}
                      <span>{ref.source}, {ref.year}</span>
                      {ref.quality === 'gold' && <span className="ml-2">🥇</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            {!showExplanation ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className={`flex-1 py-3 px-6 rounded-lg font-bold text-white transition-all ${
                  selectedAnswer === null
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                Confirmar Resposta
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all"
              >
                {currentQuestionIndex < availableQuizzes.length - 1 ? 'Próxima Questão →' : 'Finalizar Quiz 🎯'}
              </button>
            )}
          </div>
        </div>

        {/* Topics */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-2">Tópicos abordados:</h3>
          <div className="flex flex-wrap gap-2">
            {currentQuestion.topics.map(topic => (
              <span key={topic} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressiveQuizSystem;
