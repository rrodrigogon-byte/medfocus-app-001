/**
 * MedGenie AI — Chat Interface
 * Integrado com LLM via tRPC backend
 */
import React, { useState, useRef, useEffect } from 'react';
import { trpc } from '../../lib/trpc';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! Sou o **MedGenie**, seu tutor médico com IA. Posso explicar qualquer conceito de medicina, gerar resumos, criar flashcards e responder dúvidas sobre qualquer disciplina. Por onde começamos?' }
  ]);
  const [input, setInput] = useState('');
  const [cloudStatus, setCloudStatus] = useState<'idle' | 'processing'>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.ai.chat.useMutation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setCloudStatus('processing');

    try {
      const response = await chatMutation.mutateAsync({ message: userMsg });
      setMessages(prev => [...prev, { role: 'assistant', content: response || "Sem resposta no momento." }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente." }]);
    }
    setCloudStatus('idle');
  };

  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    return text.split('\n').map((line, idx) => {
      // Bold
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={idx} className={idx > 0 ? 'mt-2' : ''} dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] space-y-4 animate-fade-in">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">MedGenie AI</h2>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Tutor Médico Inteligente</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl border border-border">
          <div className={`w-1.5 h-1.5 rounded-full ${cloudStatus === 'idle' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
            {cloudStatus === 'idle' ? 'Pronto' : 'Analisando...'}
          </span>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 bg-card rounded-2xl border border-border overflow-y-auto p-6 space-y-6 custom-scrollbar"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground font-medium' 
                : 'bg-muted text-foreground border border-border'
            }`}>
              {renderContent(msg.content)}
            </div>
          </div>
        ))}
        {chatMutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-muted p-5 rounded-2xl border border-border max-w-xs flex flex-col gap-2">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              </div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase">Consultando IA...</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          'Explique o ciclo de Krebs',
          'Diagnóstico diferencial de dor torácica',
          'Resumo de Farmacologia Cardiovascular',
          'Flashcards de Anatomia do Coração',
        ].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => { setInput(suggestion); }}
            className="shrink-0 px-3 py-1.5 bg-muted text-muted-foreground text-[10px] font-semibold rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors border border-border"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="flex gap-3 p-3 bg-card rounded-2xl border border-border">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Pergunte qualquer coisa sobre medicina..."
          className="flex-1 px-5 py-3 bg-background border border-border rounded-xl outline-none text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
        <button 
          onClick={handleSend}
          disabled={chatMutation.isPending}
          className="bg-primary text-primary-foreground px-6 rounded-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
};

export default Assistant;
