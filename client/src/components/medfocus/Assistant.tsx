
import React, { useState, useRef, useEffect } from 'react';
import { askMedGenie } from '../../services/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isThinking?: boolean;
}

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! Sou o MedGenie. Notei que você está navegando pelo guia acadêmico. Posso explicar qualquer conceito do Guyton ou Harrison para você. Por onde começamos?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<'idle' | 'processing' | 'streaming'>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    setCloudStatus('processing');

    const response = await askMedGenie(userMsg);
    setMessages(prev => [...prev, { role: 'assistant', content: response || "Sem resposta do servidor Vertex AI." }]);
    setIsLoading(false);
    setCloudStatus('idle');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] space-y-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-none animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          <div>
            <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter">MedGenie AI</h2>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest">Global Medical Intelligence Node</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <div className={`w-1.5 h-1.5 rounded-full ${cloudStatus === 'idle' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`}></div>
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{cloudStatus === 'idle' ? 'Neural Link Ready' : 'Analyzing Context'}</span>
          </div>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-y-auto p-10 space-y-8 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] p-6 rounded-[32px] text-sm leading-relaxed transition-all ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none font-bold' 
                : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium'
            }`}>
              {msg.content.split('\n').map((line, idx) => (
                <p key={idx} className={idx > 0 ? 'mt-3' : ''}>{line}</p>
              ))}
              {msg.role === 'assistant' && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between opacity-50 group">
                  <span className="text-[8px] font-black uppercase tracking-widest">BigQuery ID: {Math.random().toString(36).substr(2, 9)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[32px] border border-slate-200 dark:border-slate-700 w-full max-w-xs flex flex-col gap-2">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase">Consultando Vertex AI...</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 p-4 bg-white/50 dark:bg-slate-900/50 rounded-[48px] border border-slate-200 dark:border-slate-800 backdrop-blur-md">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Me fale sobre as patologias do 3º ano na UNIVAG..."
          className="flex-1 px-8 py-5 bg-white dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-[32px] outline-none transition-all font-bold text-black dark:text-white"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-indigo-600 text-white px-10 rounded-[32px] hover:bg-indigo-700 transition-all shadow-xl active:scale-95 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
};

export default Assistant;
