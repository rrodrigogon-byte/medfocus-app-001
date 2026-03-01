/**
 * MedFocus — Componente Global de Disclaimer Educacional
 * 
 * Componente reutilizável que exibe avisos legais em todos os módulos sensíveis.
 * Garante que o usuário esteja sempre ciente de que a plataforma é exclusivamente
 * educacional e de apoio acadêmico.
 * 
 * Uso: <EducationalDisclaimer variant="banner" /> ou <EducationalDisclaimer variant="footer" />
 */

import React, { useState } from 'react';

type DisclaimerVariant = 'banner' | 'footer' | 'compact' | 'modal-reminder';

interface EducationalDisclaimerProps {
  variant?: DisclaimerVariant;
  moduleName?: string;
  showAIWarning?: boolean;
  showEmergencyInfo?: boolean;
  dismissible?: boolean;
}

/**
 * Banner principal — exibido no topo dos módulos sensíveis
 */
function BannerDisclaimer({ moduleName, showAIWarning, showEmergencyInfo, dismissible }: Omit<EducationalDisclaimerProps, 'variant'>) {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) return null;

  return (
    <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 relative">
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 text-yellow-400/60 hover:text-yellow-400 text-lg leading-none"
          aria-label="Fechar aviso"
        >
          &times;
        </button>
      )}
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0 mt-0.5">⚠️</span>
        <div className="space-y-2 text-sm">
          <p className="font-bold text-yellow-400">
            AVISO LEGAL — CONTEÚDO EXCLUSIVAMENTE EDUCACIONAL
          </p>
          <p className="text-foreground/85 leading-relaxed">
            {moduleName ? `O módulo "${moduleName}" é` : 'Este conteúdo é'} uma <strong>ferramenta de apoio ao estudo e referência acadêmica</strong>. 
            O MedFocus é uma biblioteca e guia estudantil — <strong>não somos médicos, não realizamos consultas, 
            diagnósticos ou prescrições</strong>. Nenhuma informação aqui substitui a avaliação presencial de um 
            profissional de saúde habilitado.
          </p>
          
          {showAIWarning && (
            <p className="text-foreground/75 leading-relaxed bg-purple-500/10 border border-purple-500/20 rounded-lg p-2.5 mt-2">
              <strong className="text-purple-400">🤖 Aviso sobre IA:</strong> Respostas geradas por Inteligência Artificial 
              podem conter imprecisões e <strong>não constituem opinião médica</strong>. Sempre verifique com fontes primárias 
              e literatura científica reconhecida.
            </p>
          )}
          
          {showEmergencyInfo && (
            <p className="text-foreground/75 leading-relaxed bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 mt-2">
              <strong className="text-red-400">🚨 Emergência:</strong> Em caso de emergência médica, 
              ligue para o <strong>SAMU (192)</strong> ou dirija-se ao pronto-socorro mais próximo.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Footer — exibido no rodapé dos módulos
 */
function FooterDisclaimer({ showAIWarning }: Omit<EducationalDisclaimerProps, 'variant'>) {
  return (
    <div className="mt-6 pt-4 border-t border-border/50">
      <div className="flex items-center gap-2 text-xs text-muted-foreground leading-relaxed">
        <span className="text-base flex-shrink-0">🛡️</span>
        <p>
          <strong>MedFocus</strong> é uma plataforma educacional e biblioteca acadêmica. 
          Não somos médicos e não praticamos medicina. Todo conteúdo é para fins de estudo e referência.
          {showAIWarning && ' Respostas de IA podem conter imprecisões — verifique sempre com fontes primárias.'}
          {' '}Ao utilizar, você concorda com nossos{' '}
          <span className="text-primary cursor-pointer hover:underline">Termos de Uso</span> e{' '}
          <span className="text-primary cursor-pointer hover:underline">Política de Privacidade</span>.
        </p>
      </div>
    </div>
  );
}

/**
 * Compact — uma linha simples para módulos menos sensíveis
 */
function CompactDisclaimer() {
  return (
    <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
      <span>📚</span>
      <span>Conteúdo exclusivamente educacional e de referência acadêmica. Não substitui orientação médica profissional.</span>
    </div>
  );
}

/**
 * Modal Reminder — lembrete periódico para módulos críticos (ex: Symptom Checker, Diagnosis)
 */
function ModalReminderDisclaimer({ moduleName, onContinue }: { moduleName?: string; onContinue: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-lg w-full shadow-2xl">
        <div className="p-6 border-b border-border bg-gradient-to-r from-yellow-500/10 to-transparent">
          <h2 className="text-lg font-bold flex items-center gap-2 text-yellow-400">
            ⚠️ Lembrete Importante
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground/90 leading-relaxed">
            Você está acessando <strong>{moduleName || 'um módulo educacional'}</strong> do MedFocus.
          </p>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 space-y-3 text-sm">
            <p className="leading-relaxed">
              <strong>O MedFocus é um guia estudantil e biblioteca acadêmica.</strong> Nós não somos médicos 
              e não praticamos medicina. Este módulo é uma ferramenta de apoio ao estudo e não deve ser 
              utilizado para:
            </p>
            <ul className="space-y-1.5 text-foreground/80">
              <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Diagnosticar doenças ou condições médicas</li>
              <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Prescrever medicamentos ou tratamentos</li>
              <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Substituir uma consulta médica presencial</li>
              <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Tomar decisões clínicas sem supervisão profissional</li>
            </ul>
          </div>
          <p className="text-xs text-muted-foreground">
            Em caso de emergência, ligue <strong>SAMU 192</strong> ou dirija-se ao pronto-socorro mais próximo.
          </p>
        </div>
        <div className="p-6 border-t border-border flex justify-end">
          <button
            onClick={onContinue}
            className="px-6 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-all"
          >
            Entendi — Continuar para Estudo
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente principal exportado
 */
export default function EducationalDisclaimer({
  variant = 'banner',
  moduleName,
  showAIWarning = false,
  showEmergencyInfo = false,
  dismissible = true,
}: EducationalDisclaimerProps) {
  switch (variant) {
    case 'banner':
      return <BannerDisclaimer moduleName={moduleName} showAIWarning={showAIWarning} showEmergencyInfo={showEmergencyInfo} dismissible={dismissible} />;
    case 'footer':
      return <FooterDisclaimer showAIWarning={showAIWarning} />;
    case 'compact':
      return <CompactDisclaimer />;
    default:
      return <BannerDisclaimer moduleName={moduleName} showAIWarning={showAIWarning} showEmergencyInfo={showEmergencyInfo} dismissible={dismissible} />;
  }
}

/**
 * Export do Modal Reminder para uso em módulos críticos
 */
export { ModalReminderDisclaimer };

/**
 * Hook para controlar a exibição do modal reminder por sessão
 */
export function useDisclaimerReminder(moduleId: string) {
  const storageKey = `medfocus_disclaimer_${moduleId}`;
  const [shown, setShown] = useState(() => {
    const lastShown = sessionStorage.getItem(storageKey);
    return lastShown === 'true';
  });

  const markAsShown = () => {
    sessionStorage.setItem(storageKey, 'true');
    setShown(true);
  };

  return { needsReminder: !shown, markAsShown };
}
