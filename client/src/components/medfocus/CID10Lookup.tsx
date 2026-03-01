import React, { useState } from 'react';
import { trpc } from '../../lib/trpc';
import { toast } from 'sonner';
import EducationalDisclaimer from './EducationalDisclaimer';

export default function CID10Lookup() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const searchMutation = trpc.cid10.search.useMutation({
    onSuccess: (data) => { setResults(data.results || []); },
    onError: (err) => toast.error(`Erro: ${err.message}`),
  });

  const handleSearch = () => {
    if (!query.trim()) return;
    searchMutation.mutate({ query: query.trim() });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <EducationalDisclaimer variant="compact" moduleName="Consulta CID-10" dismissible={false} />
      <div className="bg-gradient-to-r from-violet-900/50 to-purple-900/50 rounded-2xl p-6 border border-violet-700/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center text-2xl">📑</div>
          <div>
            <h2 className="text-2xl font-bold text-white">CID-10 — Classificação Internacional de Doenças</h2>
            <p className="text-violet-300 text-sm">Busca inteligente de códigos CID-10 por nome da doença, sintoma ou código</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
        <div className="flex gap-3">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Buscar por doença, sintoma ou código (ex: diabetes, J18, infarto)..." className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white text-lg" />
          <button onClick={handleSearch} disabled={searchMutation.isPending} className="px-6 py-3 bg-violet-600 text-white rounded-lg font-bold hover:bg-violet-500 disabled:opacity-50">
            {searchMutation.isPending ? '⏳' : '🔍 Buscar'}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((r, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-5 border border-gray-700 hover:border-violet-600 transition-all">
              <div className="flex items-start gap-4">
                <div className="bg-violet-600 text-white px-3 py-2 rounded-lg font-mono font-bold text-lg min-w-[80px] text-center">
                  {r.code}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white">{r.description}</h4>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{r.category}</span>
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{r.chapter}</span>
                  </div>
                  {r.includes?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-green-400 font-semibold">Inclui:</p>
                      <p className="text-sm text-gray-400">{r.includes.join('; ')}</p>
                    </div>
                  )}
                  {r.excludes?.length > 0 && (
                    <div className="mt-1">
                      <p className="text-xs text-red-400 font-semibold">Exclui:</p>
                      <p className="text-sm text-gray-400">{r.excludes.join('; ')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
