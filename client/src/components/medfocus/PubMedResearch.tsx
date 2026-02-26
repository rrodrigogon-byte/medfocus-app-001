import React, { useState } from 'react';
import { trpc } from '../../lib/trpc';
import { toast } from 'sonner';

export default function PubMedResearch() {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const searchMutation = trpc.pubmed.search.useMutation({
    onSuccess: (data) => { setArticles(data); toast.success(`${data.length} artigos encontrados!`); },
    onError: (err) => toast.error(`Erro: ${err.message}`),
  });

  const analyzeMutation = trpc.pubmed.analyzeArticle.useMutation({
    onSuccess: (data) => { setAnalysis(data.analysis); toast.success('Análise crítica concluída!'); },
    onError: (err) => toast.error(`Erro: ${err.message}`),
  });

  const handleSearch = () => {
    if (!query.trim()) return;
    searchMutation.mutate({ query: query.trim(), maxResults: 15 });
  };

  const handleAnalyze = (article: any) => {
    setSelectedArticle(article);
    analyzeMutation.mutate({
      title: article.title,
      abstractText: article.abstractText,
      journal: article.journal,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 rounded-2xl p-6 border border-amber-700/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center text-2xl">📚</div>
          <div>
            <h2 className="text-2xl font-bold text-white">PubMed Research</h2>
            <p className="text-amber-300 text-sm">Pesquisa científica avançada via NCBI/PubMed com análise crítica por IA</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
        <div className="flex gap-3">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Pesquisar artigos científicos (ex: COVID-19 treatment, diabetes management)..." className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white text-lg" />
          <button onClick={handleSearch} disabled={searchMutation.isPending} className="px-6 py-3 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-500 disabled:opacity-50">
            {searchMutation.isPending ? '⏳ Buscando...' : '🔍 Pesquisar'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white">📄 Resultados ({articles.length})</h3>
          {articles.map((article, i) => (
            <div key={i} className={`bg-gray-900 rounded-xl p-4 border transition-all cursor-pointer ${selectedArticle?.pmid === article.pmid ? 'border-amber-500' : 'border-gray-700 hover:border-gray-600'}`} onClick={() => setSelectedArticle(article)}>
              <h4 className="text-sm font-bold text-white leading-tight">{article.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{article.authors?.slice(0, 3).join(', ')}{article.authors?.length > 3 ? ' et al.' : ''}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-amber-900/30 text-amber-300 px-2 py-0.5 rounded">{article.journal}</span>
                <span className="text-xs text-gray-500">{article.pubDate}</span>
                {article.doi && <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">DOI</a>}
              </div>
              <button onClick={(e) => { e.stopPropagation(); handleAnalyze(article); }} className="mt-2 px-3 py-1 bg-amber-600 text-white rounded text-xs hover:bg-amber-500">
                🤖 Análise Crítica com IA
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {selectedArticle && (
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-700 sticky top-4">
              <h3 className="text-lg font-bold text-white mb-2">{selectedArticle.title}</h3>
              <p className="text-sm text-gray-400 mb-1">{selectedArticle.authors?.join(', ')}</p>
              <p className="text-sm text-amber-400 mb-3">{selectedArticle.journal} — {selectedArticle.pubDate}</p>
              {selectedArticle.pmid && (
                <a href={`https://pubmed.ncbi.nlm.nih.gov/${selectedArticle.pmid}/`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">
                  Ver no PubMed (PMID: {selectedArticle.pmid})
                </a>
              )}
              {selectedArticle.abstractText && (
                <div className="mt-3 bg-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-500 font-semibold mb-2">Abstract:</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{selectedArticle.abstractText}</p>
                </div>
              )}
              {analysis && selectedArticle?.pmid === selectedArticle?.pmid && (
                <div className="mt-4 bg-amber-900/20 border border-amber-700/50 rounded-lg p-4">
                  <p className="text-xs text-amber-400 font-semibold mb-2">🤖 Análise Crítica (Dr. Focus IA):</p>
                  <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{analysis}</div>
                </div>
              )}
              {analyzeMutation.isPending && (
                <div className="mt-4 flex items-center gap-2 text-amber-400">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Gerando análise crítica...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
