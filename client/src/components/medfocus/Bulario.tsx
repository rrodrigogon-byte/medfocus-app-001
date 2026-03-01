/**
 * MedFocus — Bulário Digital
 * 27.000+ medicamentos da base oficial ANVISA/CMED com busca, filtros e paginação.
 */
import React, { useState, useEffect } from 'react';
import { trpc } from '../../lib/trpc';
import EducationalDisclaimer from './EducationalDisclaimer';

const TIPOS = ['Todos', 'Genérico', 'Similar', 'Referência', 'Biológico', 'Outros'];
const TARJAS = ['Todas', 'Sem Tarja', 'Tarja Vermelha', 'Tarja Preta'];

export default function Bulario() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [tipo, setTipo] = useState('Todos');
  const [tarja, setTarja] = useState('Todas');
  const [page, setPage] = useState(1);
  const [selectedMed, setSelectedMed] = useState<any>(null);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQuery(query); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [query]);

  const statsQuery = trpc.bulario.stats.useQuery();
  const searchQuery = trpc.bulario.search.useQuery({
    query: debouncedQuery || undefined,
    tipo: tipo !== 'Todos' ? tipo : undefined,
    tarja: tarja !== 'Todas' ? tarja : undefined,
    page,
    pageSize: 40,
  });

  const stats = statsQuery.data;
  const results = searchQuery.data;
  const loading = searchQuery.isLoading;

  const formatPrice = (p: number) => p > 0 ? `R$ ${p.toFixed(2).replace('.', ',')}` : '—';

  const getTarjaColor = (t: string) => {
    if (t === 'Tarja Preta') return 'bg-gray-900 text-white';
    if (t === 'Tarja Vermelha') return 'bg-red-600 text-white';
    return 'bg-green-600 text-white';
  };

  const getTipoColor = (t: string) => {
    if (t === 'Genérico') return 'text-emerald-400';
    if (t === 'Similar') return 'text-blue-400';
    if (t === 'Referência') return 'text-amber-400';
    if (t === 'Biológico') return 'text-purple-400';
    return 'text-gray-400';
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <EducationalDisclaimer variant="compact" moduleName="Bulário" dismissible={false} />
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Bulário Digital</h1>
        <p className="text-gray-400">
          Base oficial ANVISA/CMED com {stats?.totalEntries?.toLocaleString('pt-BR') || '27.000+'} medicamentos registrados
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-gray-800/60 rounded-xl p-4 text-center border border-gray-700/50">
            <div className="text-2xl font-bold text-emerald-400">{stats.totalEntries?.toLocaleString('pt-BR')}</div>
            <div className="text-xs text-gray-400 mt-1">Medicamentos</div>
          </div>
          <div className="bg-gray-800/60 rounded-xl p-4 text-center border border-gray-700/50">
            <div className="text-2xl font-bold text-blue-400">{stats.totalSubstances?.toLocaleString('pt-BR')}</div>
            <div className="text-xs text-gray-400 mt-1">Substâncias</div>
          </div>
          <div className="bg-gray-800/60 rounded-xl p-4 text-center border border-gray-700/50">
            <div className="text-2xl font-bold text-amber-400">{stats.totalLabs?.toLocaleString('pt-BR')}</div>
            <div className="text-xs text-gray-400 mt-1">Laboratórios</div>
          </div>
          <div className="bg-gray-800/60 rounded-xl p-4 text-center border border-gray-700/50">
            <div className="text-2xl font-bold text-purple-400">{stats.totalClasses?.toLocaleString('pt-BR')}</div>
            <div className="text-xs text-gray-400 mt-1">Classes Terapêuticas</div>
          </div>
          <div className="bg-gray-800/60 rounded-xl p-4 text-center border border-gray-700/50">
            <div className="text-2xl font-bold text-rose-400">{stats.tipos?.['Genérico']?.toLocaleString('pt-BR') || '—'}</div>
            <div className="text-xs text-gray-400 mt-1">Genéricos</div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="space-y-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por nome, substância, laboratório, classe terapêutica ou EAN..."
          className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
        />
        <div className="flex flex-wrap gap-3">
          <select
            value={tipo}
            onChange={e => { setTipo(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
          >
            {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={tarja}
            onChange={e => { setTarja(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
          >
            {TARJAS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {results && (
            <div className="flex items-center text-sm text-gray-400 ml-auto">
              {results.pagination.total.toLocaleString('pt-BR')} resultado(s)
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
        </div>
      ) : results && results.entries.length > 0 ? (
        <div className="space-y-2">
          {results.entries.map((med: any) => (
            <div
              key={med.id}
              onClick={() => setSelectedMed(selectedMed?.id === med.id ? null : med)}
              className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 cursor-pointer hover:border-emerald-500/50 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white">{med.produto}</h3>
                    <span className={`text-xs font-medium ${getTipoColor(med.tipo)}`}>{med.tipo}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getTarjaColor(med.tarja)}`}>{med.tarja}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{med.substancia}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{med.laboratorio} • {med.apresentacao}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-emerald-400">{formatPrice(med.preco)}</div>
                  <div className="text-xs text-gray-500">PMC 18%</div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedMed?.id === med.id && (
                <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Classe:</span>
                      <p className="text-gray-300">{med.classe || '—'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">EAN:</span>
                      <p className="text-gray-300">{med.ean || '—'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Registro ANVISA:</span>
                      <p className="text-gray-300">{med.registro || '—'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Apresentação:</span>
                      <p className="text-gray-300">{med.apresentacao}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <a
                      href={`https://consultas.anvisa.gov.br/#/bulario/q/?nomeProduto=${encodeURIComponent(med.produto)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg transition-colors"
                    >
                      Ver Bula na ANVISA
                    </a>
                    <a
                      href={`https://consultaremedios.com.br/busca?termo=${encodeURIComponent(med.produto)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                    >
                      Consultar Preços
                    </a>
                    {med.ean && (
                      <a
                        href={`https://cosmos.bluesoft.com.br/produtos/${med.ean}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded-lg transition-colors"
                      >
                        Ver EAN/GTIN
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Nenhum medicamento encontrado.</p>
          <p className="text-sm mt-1">Tente buscar por outro nome ou altere os filtros.</p>
        </div>
      )}

      {/* Pagination */}
      {results && results.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm disabled:opacity-40 hover:bg-gray-700"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-400">
            Página {page} de {results.pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(results.pagination.totalPages, page + 1))}
            disabled={page >= results.pagination.totalPages}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm disabled:opacity-40 hover:bg-gray-700"
          >
            Próxima
          </button>
        </div>
      )}

      {/* Legal Notice */}
      <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-4 text-sm text-amber-200/80">
        <strong>Aviso legal:</strong> Este bulário utiliza dados oficiais da tabela CMED/ANVISA. Para bulas completas,
        consulte o site da ANVISA. Nunca se automedique. Consulte sempre um médico ou farmacêutico.
      </div>
    </div>
  );
}
