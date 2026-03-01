import React, { useState, useMemo } from 'react';
import { trpc } from '../../lib/trpc';
import { toast } from 'sonner';
import EducationalDisclaimer from './EducationalDisclaimer';

// ── Capítulos CID-10 para navegação rápida ─────────────────────
const CID10_CHAPTERS = [
  { range: 'A00-B99', title: 'Doenças infecciosas e parasitárias', icon: '🦠', color: 'bg-red-600' },
  { range: 'C00-D48', title: 'Neoplasias (tumores)', icon: '🎗️', color: 'bg-pink-600' },
  { range: 'D50-D89', title: 'Doenças do sangue e imunológicas', icon: '🩸', color: 'bg-rose-600' },
  { range: 'E00-E90', title: 'Doenças endócrinas, nutricionais e metabólicas', icon: '⚗️', color: 'bg-amber-600' },
  { range: 'F00-F99', title: 'Transtornos mentais e comportamentais', icon: '🧠', color: 'bg-purple-600' },
  { range: 'G00-G99', title: 'Doenças do sistema nervoso', icon: '⚡', color: 'bg-indigo-600' },
  { range: 'H00-H59', title: 'Doenças do olho e anexos', icon: '👁️', color: 'bg-cyan-600' },
  { range: 'H60-H95', title: 'Doenças do ouvido e apófise mastoide', icon: '👂', color: 'bg-teal-600' },
  { range: 'I00-I99', title: 'Doenças do aparelho circulatório', icon: '❤️', color: 'bg-red-700' },
  { range: 'J00-J99', title: 'Doenças do aparelho respiratório', icon: '🫁', color: 'bg-blue-600' },
  { range: 'K00-K93', title: 'Doenças do aparelho digestivo', icon: '🫃', color: 'bg-orange-600' },
  { range: 'L00-L99', title: 'Doenças da pele e tecido subcutâneo', icon: '🩹', color: 'bg-yellow-600' },
  { range: 'M00-M99', title: 'Doenças do sistema osteomuscular', icon: '🦴', color: 'bg-stone-600' },
  { range: 'N00-N99', title: 'Doenças do aparelho geniturinário', icon: '🫘', color: 'bg-emerald-600' },
  { range: 'O00-O99', title: 'Gravidez, parto e puerpério', icon: '🤰', color: 'bg-pink-500' },
  { range: 'P00-P96', title: 'Afecções perinatais', icon: '👶', color: 'bg-sky-600' },
  { range: 'Q00-Q99', title: 'Malformações congênitas', icon: '🧬', color: 'bg-violet-600' },
  { range: 'R00-R99', title: 'Sintomas e sinais anormais', icon: '🔍', color: 'bg-gray-600' },
  { range: 'S00-T98', title: 'Lesões, envenenamentos e causas externas', icon: '🚑', color: 'bg-red-500' },
  { range: 'V01-Y98', title: 'Causas externas de morbidade e mortalidade', icon: '⚠️', color: 'bg-yellow-700' },
  { range: 'Z00-Z99', title: 'Fatores que influenciam o estado de saúde', icon: '📋', color: 'bg-green-600' },
];

// ── Códigos mais usados (acesso rápido) ────────────────────────
const QUICK_CODES = [
  { code: 'I10', desc: 'Hipertensão essencial (primária)' },
  { code: 'E11', desc: 'Diabetes mellitus tipo 2' },
  { code: 'J06', desc: 'IVAS (Infecção vias aéreas superiores)' },
  { code: 'M54', desc: 'Dorsalgia (dor nas costas)' },
  { code: 'J18', desc: 'Pneumonia por microrganismo NE' },
  { code: 'I21', desc: 'Infarto agudo do miocárdio' },
  { code: 'F32', desc: 'Episódio depressivo' },
  { code: 'F41', desc: 'Transtornos ansiosos' },
  { code: 'K29', desc: 'Gastrite e duodenite' },
  { code: 'N39', desc: 'Infecção do trato urinário' },
  { code: 'A09', desc: 'Diarreia e gastroenterite infecciosa' },
  { code: 'R50', desc: 'Febre de origem desconhecida' },
  { code: 'J45', desc: 'Asma' },
  { code: 'E78', desc: 'Dislipidemia' },
  { code: 'I64', desc: 'AVC não especificado' },
  { code: 'B34', desc: 'Infecção viral NE (COVID-19: U07.1)' },
];

export default function CID10Lookup() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'chapters' | 'quick'>('search');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const searchMutation = trpc.cid10.search.useMutation({
    onSuccess: (data) => {
      setResults(data.results || []);
      if (query.trim() && !history.includes(query.trim())) {
        setHistory(prev => [query.trim(), ...prev].slice(0, 10));
      }
    },
    onError: (err) => toast.error(`Erro: ${err.message}`),
  });

  const handleSearch = (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    if (q) setQuery(q);
    searchMutation.mutate({ query: searchQuery.trim() });
    setActiveTab('search');
  };

  const handleChapterClick = (range: string) => {
    setSelectedChapter(range);
    const letter = range.charAt(0);
    handleSearch(letter);
  };

  const copyCode = (code: string, desc: string) => {
    navigator.clipboard.writeText(`${code} - ${desc}`);
    toast.success(`Copiado: ${code} - ${desc}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      <EducationalDisclaimer variant="compact" moduleName="Consulta CID-10" dismissible={false} />

      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900/50 to-purple-900/50 rounded-2xl p-6 border border-violet-700/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center text-2xl">📑</div>
          <div>
            <h2 className="text-2xl font-bold text-white">CID-10 — Classificação Internacional de Doenças</h2>
            <p className="text-violet-300 text-sm">10ª Revisão (OMS) — Busca inteligente por nome, sintoma ou código</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-violet-300">21</div>
            <div className="text-xs text-violet-400">Capítulos</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-violet-300">2.036</div>
            <div className="text-xs text-violet-400">Categorias (3 dígitos)</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-violet-300">12.420</div>
            <div className="text-xs text-violet-400">Subcategorias (4 dígitos)</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Buscar por doença, sintoma ou código (ex: diabetes, J18, infarto, hipertensão)..."
            className="flex-1 bg-muted border border-border rounded-lg px-4 py-3 text-foreground text-lg focus:ring-2 focus:ring-violet-500 outline-none"
          />
          <button
            onClick={() => handleSearch()}
            disabled={searchMutation.isPending}
            className="px-6 py-3 bg-violet-600 text-white rounded-lg font-bold hover:bg-violet-500 disabled:opacity-50 transition-colors"
          >
            {searchMutation.isPending ? (
              <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : '🔍 Buscar'}
          </button>
        </div>
        {history.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs text-muted-foreground">Recentes:</span>
            {history.map((h, i) => (
              <button key={i} onClick={() => handleSearch(h)} className="text-xs bg-violet-600/20 text-violet-300 px-2 py-0.5 rounded hover:bg-violet-600/40 transition-colors">
                {h}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'search', label: '🔍 Resultados', count: results.length },
          { id: 'chapters', label: '📖 Capítulos CID-10', count: 21 },
          { id: 'quick', label: '⚡ Códigos Frequentes', count: QUICK_CODES.length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-violet-600 text-white' : 'bg-card border border-border text-muted-foreground hover:bg-accent'}`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Search Results */}
      {activeTab === 'search' && (
        <>
          {results.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}</p>
              {results.map((r, i) => (
                <div key={i} className="bg-card rounded-xl p-5 border border-border hover:border-violet-600 transition-all group">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => copyCode(r.code, r.description)}
                      title="Clique para copiar"
                      className="bg-violet-600 text-white px-3 py-2 rounded-lg font-mono font-bold text-lg min-w-[80px] text-center hover:bg-violet-500 transition-colors shrink-0"
                    >
                      {r.code}
                    </button>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-foreground">{r.description}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {r.category && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{r.category}</span>}
                        {r.chapter && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{r.chapter}</span>}
                      </div>
                      {r.includes?.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-green-400 font-semibold">Inclui:</p>
                          <p className="text-sm text-muted-foreground">{r.includes.join('; ')}</p>
                        </div>
                      )}
                      {r.excludes?.length > 0 && (
                        <div className="mt-1">
                          <p className="text-xs text-red-400 font-semibold">Exclui:</p>
                          <p className="text-sm text-muted-foreground">{r.excludes.join('; ')}</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => copyCode(r.code, r.description)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-violet-400 hover:text-violet-300 transition-all"
                    >
                      📋 Copiar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-5xl mb-3">🔍</p>
              <p className="text-lg font-medium">Busque por doença, sintoma ou código CID-10</p>
              <p className="text-sm mt-1">Exemplos: "diabetes", "J18.9", "infarto agudo", "depressão"</p>
            </div>
          )}
        </>
      )}

      {/* Chapters */}
      {activeTab === 'chapters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {CID10_CHAPTERS.map((ch, i) => (
            <button
              key={i}
              onClick={() => handleChapterClick(ch.range)}
              className={`p-4 rounded-xl border text-left hover:border-violet-500 transition-all ${selectedChapter === ch.range ? 'border-violet-500 bg-violet-600/10' : 'border-border bg-card hover:bg-accent'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${ch.color} rounded-lg flex items-center justify-center text-lg`}>
                  {ch.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs text-violet-400">{ch.range}</div>
                  <div className="text-sm font-medium text-foreground truncate">{ch.title}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Quick Codes */}
      {activeTab === 'quick' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Códigos CID-10 mais utilizados na prática clínica. Clique para buscar detalhes.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {QUICK_CODES.map((qc, i) => (
              <button
                key={i}
                onClick={() => handleSearch(qc.code)}
                className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-violet-500 hover:bg-accent transition-all text-left"
              >
                <div className="bg-violet-600 text-white px-3 py-1.5 rounded-lg font-mono font-bold min-w-[60px] text-center text-sm">
                  {qc.code}
                </div>
                <span className="text-sm text-foreground">{qc.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-card border border-border rounded-xl p-4 text-center">
        <p className="text-xs text-muted-foreground">
          CID-10 — Classificação Estatística Internacional de Doenças e Problemas Relacionados à Saúde, 10ª Revisão.
          Publicada pela Organização Mundial da Saúde (OMS). Versão brasileira: DATASUS/MS.
        </p>
      </div>
    </div>
  );
}
