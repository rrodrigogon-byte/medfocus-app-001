/**
 * MedFocus Onboarding Tour — Guia Interativo para Novos Usuários
 * Apresenta os 5 módulos principais da plataforma com animações suaves
 */
import React, { useState, useEffect } from 'react';
import { View } from '../../types';

interface OnboardingTourProps {
  onComplete: () => void;
  onNavigate: (view: View) => void;
  userName: string;
}

interface TourStep {
  title: string;
  description: string;
  icon: string;
  highlight: string;
  action?: View;
  tip: string;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete, onNavigate, userName }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [animating, setAnimating] = useState(false);

  const steps: TourStep[] = [
    {
      title: 'Bem-vindo ao MedFocus!',
      description: `Olá, ${userName}! O MedFocus é a plataforma de medicina com IA mais avançada do Brasil. Vamos fazer um tour rápido pelos principais recursos para você aproveitar ao máximo.`,
      icon: '🎓',
      highlight: 'Sua jornada começa aqui',
      tip: 'O MedFocus é uma ferramenta educacional de apoio ao estudo médico. Não substitui a orientação de profissionais de saúde.',
    },
    {
      title: 'Dr. Focus — Seu Assistente de IA',
      description: 'O Dr. Focus (MedGenie AI) é seu assistente pessoal de IA médica. Ele pode gerar resumos, explicar conceitos complexos, criar flashcards e auxiliar em diagnósticos diferenciais para estudo.',
      icon: '🤖',
      highlight: 'IA & Ferramentas',
      action: 'assistant',
      tip: 'Pergunte qualquer coisa sobre medicina e o Dr. Focus responde com referências científicas.',
    },
    {
      title: 'Atlas Anatômico 3D',
      description: 'Explore o corpo humano em 3D interativo com React Three Fiber. Navegue por 15 sistemas, faça dissecação virtual e estude anatomia de forma imersiva.',
      icon: '🫀',
      highlight: 'IA & Ferramentas',
      action: 'atlas',
      tip: 'Clique nos órgãos para ver detalhes e use a dissecação para explorar camadas.',
    },
    {
      title: 'Flashcards com Repetição Espaçada',
      description: 'Estude com o algoritmo SM-2, cientificamente comprovado para memorização de longo prazo. Crie seus próprios flashcards ou use os gerados pela IA.',
      icon: '🧠',
      highlight: 'Estudo IA',
      action: 'studyContent',
      tip: 'A repetição espaçada aumenta em até 200% a retenção de informações.',
    },
    {
      title: 'Calculadoras Médicas',
      description: 'Acesse calculadoras validadas como CHA₂DS₂-VASc, Glasgow, APACHE II, Wells, MELD e muito mais. Ferramentas práticas para o dia a dia clínico.',
      icon: '🔢',
      highlight: 'IA & Ferramentas',
      action: 'medicalCalculators',
      tip: 'Todas as calculadoras seguem as fórmulas oficiais das sociedades médicas.',
    },
    {
      title: 'Casos Clínicos com IA',
      description: 'Pratique com casos clínicos gerados por IA em 24 especialidades. Cada caso simula um cenário real com anamnese, exame físico, exames complementares e conduta.',
      icon: '🏥',
      highlight: 'IA & Ferramentas',
      action: 'clinicalCases',
      tip: 'Os casos são gerados com base em protocolos clínicos atualizados.',
    },
    {
      title: 'Pronto para começar!',
      description: 'Você agora conhece os principais recursos do MedFocus. Explore à vontade — use a busca no menu lateral para encontrar qualquer módulo rapidamente. Bons estudos!',
      icon: '🚀',
      highlight: 'Boa sorte!',
      tip: 'Dica: Use o campo de busca no menu lateral para encontrar qualquer funcionalidade.',
    },
  ];

  const currentTourStep = steps[currentStep];
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const goNext = () => {
    if (currentStep < totalSteps - 1) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setAnimating(false);
      }, 200);
    } else {
      handleComplete();
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setAnimating(false);
      }, 200);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('medfocus_onboarding_complete', 'true');
    setIsVisible(false);
    onComplete();
  };

  const handleTryModule = () => {
    if (currentTourStep.action) {
      onNavigate(currentTourStep.action);
      handleComplete();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4">
        {/* Card */}
        <div className={`bg-card border border-border rounded-2xl shadow-2xl overflow-hidden transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}>
          {/* Progress bar */}
          <div className="h-1 bg-muted">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Header */}
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{currentTourStep.icon}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-muted-foreground px-2 py-0.5 bg-primary/10 rounded-full text-primary">
                  {currentTourStep.highlight}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {currentStep + 1}/{totalSteps}
                </span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">{currentTourStep.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{currentTourStep.description}</p>
          </div>

          {/* Tip */}
          <div className="px-6 pt-4">
            <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/10 rounded-lg">
              <span className="text-primary text-sm mt-0.5">💡</span>
              <p className="text-xs text-muted-foreground leading-relaxed">{currentTourStep.tip}</p>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-1.5 px-6 pt-4">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => { setAnimating(true); setTimeout(() => { setCurrentStep(i); setAnimating(false); }, 200); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep ? 'w-6 bg-primary' : i < currentStep ? 'w-1.5 bg-primary/40' : 'w-1.5 bg-muted-foreground/20'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={goPrev}
                  className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  Anterior
                </button>
              )}
              <button
                onClick={handleComplete}
                className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pular tour
              </button>
            </div>
            <div className="flex gap-2">
              {currentTourStep.action && (
                <button
                  onClick={handleTryModule}
                  className="px-4 py-2 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  Experimentar
                </button>
              )}
              <button
                onClick={goNext}
                className="px-5 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              >
                {currentStep === totalSteps - 1 ? 'Começar!' : 'Próximo'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
