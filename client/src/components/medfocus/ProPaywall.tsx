/**
 * MedFocus ProPaywall — Tela de bloqueio para módulos PRO
 * Exibida quando o usuário tenta acessar um módulo que requer plano Pro
 */
import React from 'react';

interface ProPaywallProps {
  moduleName: string;
  moduleDescription?: string;
  onUpgrade: () => void;
  features?: string[];
}

const ProPaywall: React.FC<ProPaywallProps> = ({ moduleName, moduleDescription, onUpgrade, features }) => {
  const defaultFeatures = [
    'MedGenie AI ilimitado',
    'Conteúdo completo (1° ao 6° ano)',
    'Flashcards e Quizzes ilimitados',
    'Simulados de Residência',
    'Casos Clínicos com IA',
    'Modo Batalha multiplayer',
  ];

  const displayFeatures = features || defaultFeatures;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 animate-fade-in">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Lock Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-teal-500/20 border border-primary/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-foreground">
            {moduleName}
          </h2>
          <p className="text-sm text-muted-foreground">
            {moduleDescription || `Este recurso está disponível exclusivamente no plano MedFocus Pro.`}
          </p>
        </div>

        {/* Pro Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
          <span className="text-xs font-bold text-primary">Recurso PRO</span>
        </div>

        {/* Features Preview */}
        <div className="bg-card border border-border rounded-xl p-4 text-left space-y-2">
          <p className="text-xs font-bold text-foreground mb-3">O que você ganha com o Pro:</p>
          {displayFeatures.map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span className="text-xs text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <button
            onClick={onUpgrade}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            Começar 7 Dias Grátis — R$ 29,90/mês
          </button>
          <p className="text-[10px] text-muted-foreground">
            7 dias grátis com cartão de crédito. Cancele a qualquer momento.
            <br />
            Ou R$ 250,00/ano (economize R$ 108,80)
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 text-muted-foreground pt-2">
          <div className="flex items-center gap-1 text-[10px]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            Seguro
          </div>
          <div className="flex items-center gap-1 text-[10px]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Sem compromisso
          </div>
          <div className="flex items-center gap-1 text-[10px]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            7 dias grátis
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProPaywall;
