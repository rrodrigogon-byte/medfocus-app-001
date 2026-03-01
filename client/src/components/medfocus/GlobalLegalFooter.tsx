/**
 * MedFocus — Rodapé Legal Global
 * 
 * Componente de rodapé fixo que aparece em todas as páginas da plataforma,
 * reforçando a natureza educacional do MedFocus.
 */

import React from 'react';

export default function GlobalLegalFooter() {
  return (
    <footer className="w-full border-t border-border/40 bg-card/50 backdrop-blur-sm px-4 py-3 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="text-sm">🛡️</span>
          <p>
            <strong>MedFocus</strong> — Plataforma educacional e biblioteca acadêmica. 
            <strong> Não somos médicos.</strong> Todo conteúdo é para fins de estudo e referência.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hover:text-primary cursor-pointer transition">Termos de Uso</span>
          <span className="text-border">|</span>
          <span className="hover:text-primary cursor-pointer transition">Política de Privacidade</span>
          <span className="text-border">|</span>
          <span className="hover:text-primary cursor-pointer transition">Disclaimer</span>
        </div>
      </div>
    </footer>
  );
}
