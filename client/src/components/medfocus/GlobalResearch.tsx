
import React, { useState, useEffect } from 'react';
import { fetchGlobalResearch } from '../../services/gemini';

const GlobalResearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [research, setResearch] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trendingTopics] = useState([
    'Imunoterapia no Câncer de Pâncreas',
    'CRISPR em Doenças Genéticas',
    'IA no Diagnóstico Radiológico',
    'Vacinas de RNAm para HIV',
    'Microbioma e Saúde Mental'
  ]);

  const handleSearch = async (topic: string) => {
    setIsLoading(true);
    setSearchTerm(topic);
    try {
      const result = await fetchGlobalResearch(topic);
      setResearch(result);
    } catch (error) {
      setResearch("Erro ao buscar pesquisas. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      <header className="text-center space-y-4">
        <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
          Pesquisa <span className="text-indigo-600">Global</span>
        </h2>
        <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">Avanços Científicos em Tempo Real</p>
      </header>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="relative group">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
            placeholder="Pesquisar avanços, cientistas ou patologias..."
            className="w-full px-10 py-6 bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 rounded-[32px] outline-none focus:border-indigo-600 transition-all font-bold text-lg shadow-xl"
          />
          <button 
            onClick={() => handleSearch(searchTerm)}
            className="absolute right-4 top-4 bottom-4 bg-indigo-600 text-white px-8 rounded-[24px] font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all"
          >
            Buscar
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {trendingTopics.map((topic, idx) => (
            <button 
              key={idx}
              onClick={() => handleSearch(topic)}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-200"
            >
              # {topic}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 animate-pulse">Consultando bases científicas globais...</p>
        </div>
      ) : research && (
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-12 rounded-[56px] border border-slate-100 dark:border-slate-800 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white">Resultados da Pesquisa</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fonte: PubMed / NEJM / Nature Medicine</p>
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <div className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
              {research}
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Acesso via MedGenie AI Integration</p>
            <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Salvar na Biblioteca</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalResearch;
