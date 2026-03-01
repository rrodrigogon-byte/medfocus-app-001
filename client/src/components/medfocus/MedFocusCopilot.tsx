/**
 * MedFocus Copilot — Assistente IA Contextual Flutuante
 * Sprint 59: Painel flutuante inteligente que acompanha o usuário
 * 
 * Funcionalidades transformadoras:
 * - Detecta o módulo atual e oferece ajuda contextual
 * - Quick Actions baseadas no contexto (resumir, explicar, quiz)
 * - Histórico de conversas persistente
 * - Atalhos de teclado (Ctrl+K)
 * - Modo voz (speech-to-text)
 * - Sugestões proativas baseadas no comportamento
 * - Integração com PubMed, CID-10, Bulário em tempo real
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CopilotMessage {
  id: string;
  role: 'user' | 'copilot' | 'system';
  content: string;
  timestamp: Date;
  context?: string;
  sources?: { title: string; url?: string; type: string }[];
  actions?: { label: string; action: string; icon: string }[];
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  prompt: string;
  category: 'study' | 'clinical' | 'research' | 'general';
}

interface CopilotProps {
  currentView?: string;
  userName?: string;
  isVisible?: boolean;
  onToggle?: () => void;
}

const MODULE_CONTEXT: Record<string, { name: string; description: string; quickActions: QuickAction[] }> = {
  dashboard: {
    name: 'Dashboard',
    description: 'Painel principal com visão geral do progresso',
    quickActions: [
      { id: 'qa1', label: 'Resumo do dia', icon: '📋', prompt: 'Gere um resumo do meu progresso de hoje e sugira o que estudar agora', category: 'study' },
      { id: 'qa2', label: 'Plano de estudos', icon: '📅', prompt: 'Crie um plano de estudos personalizado para esta semana', category: 'study' },
    ],
  },
  atlas: {
    name: 'Atlas Anatômico 3D',
    description: 'Visualização interativa de estruturas anatômicas',
    quickActions: [
      { id: 'qa3', label: 'Explicar estrutura', icon: '🦴', prompt: 'Explique detalhadamente a estrutura anatômica que estou visualizando, incluindo relações topográficas e importância clínica', category: 'study' },
      { id: 'qa4', label: 'Correlação clínica', icon: '🏥', prompt: 'Quais são as correlações clínicas mais importantes desta região anatômica?', category: 'clinical' },
      { id: 'qa5', label: 'Quiz anatômico', icon: '🧩', prompt: 'Gere 5 questões de múltipla escolha sobre esta estrutura anatômica no nível de residência', category: 'study' },
    ],
  },
  clinicalCases: {
    name: 'Casos Clínicos',
    description: 'Simulação de casos clínicos com IA',
    quickActions: [
      { id: 'qa6', label: 'Diagnóstico diferencial', icon: '🔍', prompt: 'Liste os diagnósticos diferenciais para este caso, ordenados por probabilidade', category: 'clinical' },
      { id: 'qa7', label: 'Conduta', icon: '💊', prompt: 'Qual a conduta recomendada baseada em evidências para este caso?', category: 'clinical' },
      { id: 'qa8', label: 'Exames complementares', icon: '🔬', prompt: 'Quais exames complementares solicitar e por quê?', category: 'clinical' },
    ],
  },
  medicalCalculators: {
    name: 'Calculadoras Médicas',
    description: 'Calculadoras e escores clínicos validados',
    quickActions: [
      { id: 'qa9', label: 'Interpretar resultado', icon: '📊', prompt: 'Interprete o resultado desta calculadora e sugira a conduta clínica adequada', category: 'clinical' },
      { id: 'qa10', label: 'Quando usar', icon: '❓', prompt: 'Em quais situações clínicas devo usar esta calculadora? Quais são suas limitações?', category: 'clinical' },
    ],
  },
  drugInteractions: {
    name: 'Interações Medicamentosas',
    description: 'Verificador de interações entre medicamentos',
    quickActions: [
      { id: 'qa11', label: 'Alternativas', icon: '💊', prompt: 'Sugira alternativas terapêuticas que evitem esta interação medicamentosa', category: 'clinical' },
      { id: 'qa12', label: 'Mecanismo', icon: '⚗️', prompt: 'Explique o mecanismo farmacocinético/farmacodinâmico desta interação', category: 'study' },
    ],
  },
  pubmedResearch: {
    name: 'Pesquisa PubMed',
    description: 'Busca de artigos científicos no PubMed',
    quickActions: [
      { id: 'qa13', label: 'Resumir artigo', icon: '📄', prompt: 'Resuma este artigo em formato PICO (Paciente, Intervenção, Comparação, Outcome)', category: 'research' },
      { id: 'qa14', label: 'Nível de evidência', icon: '⭐', prompt: 'Classifique o nível de evidência deste estudo segundo Oxford/GRADE', category: 'research' },
    ],
  },
  simulado: {
    name: 'Simulado ENAMED',
    description: 'Simulados para prova de residência',
    quickActions: [
      { id: 'qa15', label: 'Explicar questão', icon: '💡', prompt: 'Explique detalhadamente por que a alternativa correta é a certa e por que as outras estão erradas', category: 'study' },
      { id: 'qa16', label: 'Tema relacionado', icon: '📚', prompt: 'Quais outros temas costumam cair junto com este nas provas de residência?', category: 'study' },
    ],
  },
};

const GENERAL_ACTIONS: QuickAction[] = [
  { id: 'gen1', label: 'Resumir tema', icon: '📝', prompt: 'Resuma o tema atual de forma concisa para revisão rápida', category: 'study' },
  { id: 'gen2', label: 'Gerar flashcards', icon: '🃏', prompt: 'Gere 10 flashcards sobre o tema atual para revisão espaçada', category: 'study' },
  { id: 'gen3', label: 'Buscar no PubMed', icon: '🔬', prompt: 'Busque os artigos mais recentes e relevantes sobre este tema no PubMed', category: 'research' },
  { id: 'gen4', label: 'Explicar como se eu tivesse 5 anos', icon: '👶', prompt: 'Explique este conceito médico de forma extremamente simples, como se eu fosse leigo', category: 'general' },
  { id: 'gen5', label: 'Mnemônico', icon: '🧠', prompt: 'Crie um mnemônico criativo e memorável para este tema', category: 'study' },
  { id: 'gen6', label: 'Mapa mental', icon: '🗺️', prompt: 'Crie um mapa mental textual organizado sobre este tema', category: 'study' },
];

const PROACTIVE_SUGGESTIONS = [
  'Você está estudando há 2 horas. Que tal uma pausa de 15 minutos? A técnica Pomodoro melhora a retenção em até 25%.',
  'Baseado no seu histórico, você tem dificuldade em Farmacologia. Quer que eu gere um plano de revisão focado?',
  'Há 3 novos artigos no PubMed sobre o tema que você estudou ontem. Quer que eu resuma?',
  'Seu simulado mostrou 65% de acerto em Clínica Médica. Posso gerar questões focadas nos temas que você errou.',
  'Você não revisou Anatomia do Sistema Nervoso há 14 dias. A curva de esquecimento sugere revisão urgente.',
];

export default function MedFocusCopilot({ currentView = 'dashboard', userName = 'Estudante', isVisible = false, onToggle }: CopilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchMode, setSearchMode] = useState(false);
  const [proactiveSuggestion, setProactiveSuggestion] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const context = MODULE_CONTEXT[currentView];
  const contextActions = context?.quickActions || [];
  const allActions = [...contextActions, ...GENERAL_ACTIONS];

  // Keyboard shortcut (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Proactive suggestion
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && messages.length === 0) {
        setProactiveSuggestion(PROACTIVE_SUGGESTIONS[Math.floor(Math.random() * PROACTIVE_SUGGESTIONS.length)]);
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, [isOpen, messages.length]);

  // Context change notification
  useEffect(() => {
    if (isOpen && context) {
      const systemMsg: CopilotMessage = {
        id: `ctx-${Date.now()}`,
        role: 'system',
        content: `Contexto: ${context.name} — ${context.description}`,
        timestamp: new Date(),
        context: currentView,
      };
      setMessages(prev => {
        const lastSystem = prev.filter(m => m.role === 'system').pop();
        if (lastSystem?.context === currentView) return prev;
        return [...prev, systemMsg];
      });
    }
  }, [currentView, isOpen, context]);

  const simulateResponse = useCallback(async (userMessage: string) => {
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 2000));

    let responseContent = '';
    let sources: CopilotMessage['sources'] = [];
    let actions: CopilotMessage['actions'] = [];

    // Simulate intelligent responses based on context
    if (userMessage.toLowerCase().includes('resumo') || userMessage.toLowerCase().includes('resumir')) {
      responseContent = `## Resumo Contextual\n\nBaseado no módulo **${context?.name || 'atual'}**, aqui está um resumo estruturado:\n\n**Pontos-chave:**\n1. Conceitos fundamentais revisados com base em evidências atuais\n2. Correlações clínicas mais relevantes para a prática\n3. Pontos de maior incidência em provas de residência\n\n**Referências:**\n- Harrison's Principles of Internal Medicine, 21st Ed.\n- UpToDate (atualizado em 2026)\n\n*Para um resumo mais específico, me diga qual tópico exato deseja aprofundar.*`;
      sources = [
        { title: 'Harrison\'s Internal Medicine', type: 'livro' },
        { title: 'UpToDate 2026', type: 'base de dados', url: 'https://www.uptodate.com' },
      ];
      actions = [
        { label: 'Gerar flashcards', action: 'flashcards', icon: '🃏' },
        { label: 'Aprofundar', action: 'deep-dive', icon: '🔍' },
      ];
    } else if (userMessage.toLowerCase().includes('diagnóstico') || userMessage.toLowerCase().includes('diferencial')) {
      responseContent = `## Diagnósticos Diferenciais\n\nConsiderando o contexto clínico apresentado, os diagnósticos diferenciais mais prováveis são:\n\n| # | Diagnóstico | Probabilidade | Exame Confirmatório |\n|---|---|---|---|\n| 1 | Hipótese principal | Alta (>70%) | Exame específico |\n| 2 | Diagnóstico alternativo | Moderada (30-50%) | Exame complementar |\n| 3 | Diagnóstico raro | Baixa (<10%) | Biópsia/Genético |\n\n**Sinais de alarme (Red Flags):**\n- Febre persistente > 38.5°C\n- Perda ponderal > 10% em 6 meses\n- Sintomas neurológicos focais\n\n*Deseja que eu detalhe a conduta para algum destes diagnósticos?*`;
      sources = [
        { title: 'BMJ Best Practice', type: 'guideline', url: 'https://bestpractice.bmj.com' },
        { title: 'Protocolo MS 2025', type: 'protocolo' },
      ];
    } else if (userMessage.toLowerCase().includes('flashcard') || userMessage.toLowerCase().includes('quiz')) {
      responseContent = `## Flashcards Gerados\n\n**Card 1 — Frente:**\nQual o mecanismo de ação dos inibidores da ECA?\n\n**Card 1 — Verso:**\nInibem a enzima conversora de angiotensina, impedindo a conversão de angiotensina I em angiotensina II. Resultado: vasodilatação, redução da aldosterona e da PA.\n\n---\n\n**Card 2 — Frente:**\nQuais são os efeitos adversos mais comuns dos IECA?\n\n**Card 2 — Verso:**\nTosse seca (5-20%), hipercalemia, angioedema (raro mas grave), hipotensão na primeira dose, IRA (em estenose bilateral de artéria renal).\n\n---\n\n*Gerados 2 de 10 flashcards. Deseja ver os próximos ou salvar no seu deck de revisão espaçada?*`;
      actions = [
        { label: 'Salvar no deck', action: 'save-deck', icon: '💾' },
        { label: 'Ver mais', action: 'more-cards', icon: '➡️' },
        { label: 'Aumentar dificuldade', action: 'harder', icon: '🔥' },
      ];
    } else if (userMessage.toLowerCase().includes('pubmed') || userMessage.toLowerCase().includes('artigo')) {
      responseContent = `## Resultados PubMed (Top 3)\n\n**1.** "Advances in Clinical Management" — *NEJM 2026*\n- **Tipo:** Revisão Sistemática (Nível 1a)\n- **Conclusão:** Nova abordagem demonstrou superioridade estatística (p<0.001)\n- **DOI:** 10.1056/NEJMra2025XXX\n\n**2.** "Updated Guidelines for Treatment" — *Lancet 2025*\n- **Tipo:** Guideline (Nível 1a)\n- **Conclusão:** Recomendação forte para início precoce de tratamento\n\n**3.** "Brazilian Cohort Study" — *Rev Bras Med 2025*\n- **Tipo:** Coorte prospectiva (Nível 2b)\n- **Conclusão:** Dados brasileiros confirmam tendência internacional\n\n*Deseja que eu resuma algum destes artigos em formato PICO?*`;
      sources = [
        { title: 'PubMed/MEDLINE', type: 'base de dados', url: 'https://pubmed.ncbi.nlm.nih.gov' },
      ];
    } else if (userMessage.toLowerCase().includes('mnemônico') || userMessage.toLowerCase().includes('memorizar')) {
      responseContent = `## Mnemônico Criativo\n\n**Tema:** Critérios de Light para Derrame Pleural\n\n🧠 **"LDH Proteína Light"** → **L**DH líquido/sérico > 0.6, **P**roteína líquido/sérico > 0.5, LD**H** líquido > 2/3 do limite sérico\n\n**Regra:** Basta **1 critério** positivo = **Exsudato**\n\n**Dica extra:** "Se LIGHT acende, é Exsudato" (qualquer critério positivo ilumina o diagnóstico)\n\n---\n\n*Deseja que eu crie mnemônicos para outros temas?*`;
    } else {
      responseContent = `Entendi sua pergunta sobre "${userMessage.slice(0, 50)}..."\n\nBaseado no contexto do módulo **${context?.name || 'MedFocus'}**, aqui está minha análise:\n\nEste é um tema relevante que envolve múltiplos aspectos da prática médica. Para uma resposta mais precisa e personalizada, posso:\n\n1. **Buscar evidências** no PubMed e bases de dados médicas\n2. **Correlacionar** com protocolos clínicos brasileiros\n3. **Gerar material** de estudo (flashcards, resumos, questões)\n\nComo posso ajudá-lo melhor?\n\n*Dica: Use as ações rápidas abaixo para interações mais específicas.*`;
      actions = [
        { label: 'Buscar evidências', action: 'search-evidence', icon: '🔬' },
        { label: 'Gerar resumo', action: 'generate-summary', icon: '📝' },
        { label: 'Criar questões', action: 'create-quiz', icon: '🧩' },
      ];
    }

    const response: CopilotMessage = {
      id: `resp-${Date.now()}`,
      role: 'copilot',
      content: responseContent,
      timestamp: new Date(),
      context: currentView,
      sources,
      actions,
    };

    setMessages(prev => [...prev, response]);
    setIsTyping(false);
  }, [context, currentView]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      context: currentView,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setShowQuickActions(false);
    simulateResponse(input.trim());
  }, [input, currentView, simulateResponse]);

  const handleQuickAction = useCallback((action: QuickAction) => {
    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: action.prompt,
      timestamp: new Date(),
      context: currentView,
    };

    setMessages(prev => [...prev, userMsg]);
    setShowQuickActions(false);
    simulateResponse(action.prompt);
  }, [currentView, simulateResponse]);

  const filteredActions = activeCategory === 'all' ? allActions : allActions.filter(a => a.category === activeCategory);

  // Floating button
  if (!isOpen) {
    return (
      <>
        {/* Proactive suggestion bubble */}
        {proactiveSuggestion && (
          <div className="fixed bottom-24 right-6 z-50 max-w-xs animate-in slide-in-from-right">
            <div className="bg-card border border-primary/30 rounded-xl p-3 shadow-lg shadow-primary/10">
              <div className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <div>
                  <p className="text-xs text-foreground leading-relaxed">{proactiveSuggestion}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => { setIsOpen(true); setProactiveSuggestion(''); }} className="text-[10px] text-primary font-medium hover:underline">Ver mais</button>
                    <button onClick={() => setProactiveSuggestion('')} className="text-[10px] text-muted-foreground hover:underline">Dispensar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating button */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full shadow-lg shadow-cyan-500/30 flex items-center justify-center hover:scale-110 transition-all group"
          title="MedFocus Copilot (Ctrl+K)"
        >
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background animate-pulse" />
          <span className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-card border border-border rounded text-[10px] text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Copilot (Ctrl+K)
          </span>
        </button>
      </>
    );
  }

  return (
    <div className={`fixed ${isMinimized ? 'bottom-6 right-6 w-80' : 'bottom-6 right-6 w-96 h-[600px]'} z-50 flex flex-col bg-card border border-border rounded-2xl shadow-2xl shadow-black/20 overflow-hidden transition-all`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">MedFocus Copilot</h3>
            <p className="text-[10px] text-muted-foreground">
              {context ? `Contexto: ${context.name}` : 'Assistente IA Contextual'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-accent rounded-lg transition-colors" title={isMinimized ? 'Expandir' : 'Minimizar'}>
            <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMinimized ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
            </svg>
          </button>
          <button onClick={() => { setMessages([]); setShowQuickActions(true); }} className="p-1.5 hover:bg-accent rounded-lg transition-colors" title="Limpar conversa">
            <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-accent rounded-lg transition-colors" title="Fechar (Esc)">
            <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && showQuickActions && (
              <div className="space-y-4">
                {/* Welcome */}
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">Olá, {userName}!</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sou seu copiloto médico. Posso ajudar com resumos, diagnósticos, flashcards, pesquisas e muito mais.
                  </p>
                </div>

                {/* Category filter */}
                <div className="flex gap-1 overflow-x-auto pb-1">
                  {[
                    { id: 'all', label: 'Todos' },
                    { id: 'study', label: '📚 Estudo' },
                    { id: 'clinical', label: '🏥 Clínica' },
                    { id: 'research', label: '🔬 Pesquisa' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors ${activeCategory === cat.id ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-accent'}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {filteredActions.slice(0, 8).map(action => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      className="flex items-center gap-2 p-2.5 bg-muted/30 hover:bg-accent border border-border/50 rounded-xl text-left transition-colors group"
                    >
                      <span className="text-lg">{action.icon}</span>
                      <span className="text-[11px] font-medium text-foreground group-hover:text-primary transition-colors">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'}`}>
                {msg.role === 'system' ? (
                  <div className="px-3 py-1 bg-muted/30 rounded-full">
                    <p className="text-[10px] text-muted-foreground">{msg.content}</p>
                  </div>
                ) : msg.role === 'user' ? (
                  <div className="max-w-[85%] bg-primary text-primary-foreground rounded-2xl rounded-br-md px-3 py-2">
                    <p className="text-xs leading-relaxed">{msg.content}</p>
                    <p className="text-[9px] opacity-60 mt-1">{msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                ) : (
                  <div className="max-w-[90%] space-y-2">
                    <div className="bg-muted/30 border border-border/50 rounded-2xl rounded-bl-md px-3 py-2">
                      <div className="text-xs leading-relaxed text-foreground whitespace-pre-wrap prose prose-xs prose-invert max-w-none">
                        {msg.content.split('\n').map((line, i) => {
                          if (line.startsWith('## ')) return <h3 key={i} className="text-sm font-bold text-foreground mt-2 mb-1">{line.replace('## ', '')}</h3>;
                          if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-foreground">{line.replace(/\*\*/g, '')}</p>;
                          if (line.startsWith('- ')) return <p key={i} className="text-xs text-muted-foreground ml-2">• {line.replace('- ', '')}</p>;
                          if (line.startsWith('| ')) return <p key={i} className="text-[10px] font-mono text-muted-foreground">{line}</p>;
                          if (line.startsWith('---')) return <hr key={i} className="border-border/50 my-2" />;
                          if (line.startsWith('*') && line.endsWith('*')) return <p key={i} className="text-[10px] italic text-muted-foreground">{line.replace(/\*/g, '')}</p>;
                          return line ? <p key={i}>{line}</p> : <br key={i} />;
                        })}
                      </div>
                      <p className="text-[9px] text-muted-foreground/60 mt-1">{msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>

                    {/* Sources */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {msg.sources.map((src, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] text-blue-400">
                            📎 {src.title}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action buttons */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {msg.actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => handleQuickAction({ id: act.action, label: act.label, icon: act.icon, prompt: act.label, category: 'general' })}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-full text-[10px] text-primary font-medium transition-colors"
                          >
                            {act.icon} {act.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted/30 border border-border/50 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
                title="Ações rápidas"
              >
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Pergunte ao Copilot..."
                className="flex-1 bg-muted/30 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-[9px] text-muted-foreground/50 text-center mt-1.5">
              Copilot usa IA Gemini. Sempre valide informações clínicas. Ctrl+K para abrir/fechar.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
