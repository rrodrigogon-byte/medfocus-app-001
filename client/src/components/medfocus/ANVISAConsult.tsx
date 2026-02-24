import React, { useState } from 'react';
import { trpc } from '../../lib/trpc';
import { toast } from 'sonner';

export default function ANVISAConsult() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [comparison, setComparison] = useState<string | null>(null);

  const searchMutation = trpc.anvisa.searchDrug.useMutation({
    onSuccess: (data) => { setResult(data); toast.success('Consulta ANVISA concluída!'); },
    onError: (err) => toast.error(`Erro: ${err.message}`),
  });

  const compareMutation = trpc.anvisa.compareGenerics.useMutation({
    onSuccess: (data) => { setComparison(data.comparison); toast.success('Comparação de genéricos concluída!'); },
    onError: (err) => toast.error(`Erro: ${err.message}`),
  });

  const handleSearch = () => {
    if (!query.trim()) { toast.error('Digite o nome do medicamento'); return; }
    searchMutation.mutate({ query: query.trim() });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-2xl p-6 border border-green-700/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-2xl">🇧🇷</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Consulta ANVISA</h2>
            <p className="text-green-300 text-sm">Informações regulatórias de medicamentos no Brasil — Registro, SUS, genéricos e preços</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
        <div className="flex gap-3">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Nome do medicamento (ex: Losartana, Metformina, Omeprazol)..." className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white text-lg" />
          <button onClick={handleSearch} disabled={searchMutation.isPending} className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500 disabled:opacity-50">
            {searchMutation.isPending ? '⏳' : '🔍 Consultar'}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{result.nome_comercial}</h3>
                <p className="text-green-400">{result.principio_ativo}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${result.tarja?.includes('preta') ? 'bg-black text-white border border-gray-600' : result.tarja?.includes('vermelha') ? 'bg-red-600 text-white' : 'bg-white text-gray-900'}`}>
                Tarja {result.tarja}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Classe Terapêutica</p>
                  <p className="text-white font-medium">{result.classe_terapeutica}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Registro ANVISA</p>
                  <p className="text-white font-medium">{result.registro_anvisa}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Classificação</p>
                  <p className="text-white font-medium">{result.classificacao}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Necessita Receita</p>
                  <p className="text-white font-medium">{result.necessita_receita}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Preço Aproximado (PMC)</p>
                  <p className="text-white font-medium">{result.preco_aproximado}</p>
                </div>
                <div className={`rounded-lg p-3 ${result.disponivel_sus ? 'bg-green-900/30 border border-green-700/50' : 'bg-red-900/30 border border-red-700/50'}`}>
                  <p className="text-xs text-gray-500">Disponível no SUS (RENAME)</p>
                  <p className={`font-bold ${result.disponivel_sus ? 'text-green-400' : 'text-red-400'}`}>
                    {result.disponivel_sus ? '✅ Sim — Disponível na rede pública' : '❌ Não disponível no SUS'}
                  </p>
                </div>
              </div>
            </div>

            {result.genericos_disponiveis?.length > 0 && (
              <div className="mt-4 bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 font-semibold mb-2">💊 Genéricos Disponíveis:</p>
                <div className="flex flex-wrap gap-2">
                  {result.genericos_disponiveis.map((g: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm">{g}</span>
                  ))}
                </div>
                <button onClick={() => compareMutation.mutate({ drugName: result.principio_ativo })} disabled={compareMutation.isPending} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-500 disabled:opacity-50">
                  {compareMutation.isPending ? '⏳ Comparando...' : '📊 Comparar Genéricos'}
                </button>
              </div>
            )}

            {result.observacoes && (
              <div className="mt-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
                <p className="text-xs text-yellow-400 font-semibold mb-1">📝 Observações:</p>
                <p className="text-sm text-yellow-300">{result.observacoes}</p>
              </div>
            )}
          </div>

          {comparison && (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-3">📊 Comparação de Genéricos</h3>
              <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap">{comparison}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
