/**
 * MedFocus — Preços de Medicamentos v2.0
 * Comparativo completo com base CMED/ANVISA (2.304 substâncias, 6.193+ produtos).
 * Busca inteligente por nome comercial, genérico, substância, laboratório e nomes populares.
 * Farmácias reais por cidade/estado com fallback para preço estadual.
 * Mostra genéricos, similares e marcas concorrentes com laboratório fabricante.
 */
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ESTADOS_CIDADES_COMPLETO, ESTADOS_NOMES } from './cidadesBrasil';
import { FARMACIAS, getFarmaciasParaCidade, type Farmacia } from './farmaciasDB';
import { ALIASES_POPULARES, FARMACIA_POPULAR_GRATUITOS, LABORATORIOS_PRINCIPAIS, classificarTarja, getClasseTerapeutica } from './medicamentosDB';

// Tipo para medicamento da base CMED
interface CmedProduto {
  nome: string;
  laboratorio: string;
  preco: number;
  apresentacao: string;
  tipo: string;
  apresentacoes?: number;
  ean?: string;
}

interface CmedMedicamento {
  id: number;
  substancia: string;
  referencia: CmedProduto;
  genericos: CmedProduto[];
  similares: CmedProduto[];
}

interface CmedData {
  metadata: any;
  categories: string[];
  medicines: CmedMedicamento[];
}

// Tipo para resultado de busca
interface ResultadoBusca {
  substancia: string;
  classe: string;
  tarja: string;
  farmaciaPopular: boolean;
  referencia: CmedProduto;
  genericos: CmedProduto[];
  similares: CmedProduto[];
  todosOsProdutos: CmedProduto[];
  menorPreco: number;
  maiorPreco: number;
  totalProdutos: number;
  matchType: 'substancia' | 'referencia' | 'generico' | 'similar' | 'alias' | 'laboratorio';
}

// Cache da base CMED carregada
let cmedCache: CmedData | null = null;

export default function PriceComparison() {
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [selectedFarmacias, setSelectedFarmacias] = useState<Set<string>>(new Set());
  const [selectedMed, setSelectedMed] = useState<ResultadoBusca | null>(null);
  const [expandedFarmacia, setExpandedFarmacia] = useState<string | null>(null);
  const [expandedProduto, setExpandedProduto] = useState<string | null>(null);
  const [tab, setTab] = useState<'comparar' | 'gratuitos' | 'descontos'>('comparar');
  const [cmedData, setCmedData] = useState<CmedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'referencia' | 'generico' | 'similar'>('todos');
  const [filtroLab, setFiltroLab] = useState('');

  // Carregar base CMED
  useEffect(() => {
    if (cmedCache) {
      setCmedData(cmedCache);
      setLoading(false);
      return;
    }
    fetch('/api/cmed/medicines')
      .then(r => r.json())
      .then(data => {
        cmedCache = data;
        setCmedData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cidadesDoEstado = useMemo(() => {
    if (!estado) return [];
    return (ESTADOS_CIDADES_COMPLETO[estado] || []).sort();
  }, [estado]);

  const farmaciasNaCidade = useMemo(() => {
    const farmacias = getFarmaciasParaCidade(estado, cidade);
    // Inicializar seleção
    if (selectedFarmacias.size === 0 && farmacias.length > 0) {
      setSelectedFarmacias(new Set(farmacias.map(f => f.id)));
    }
    return farmacias;
  }, [estado, cidade]);

  // Busca inteligente na base CMED
  const resultadosBusca = useMemo(() => {
    if (!cmedData || !search.trim() || search.trim().length < 2) return [];
    const q = search.trim().toLowerCase();
    const meds = cmedData.medicines;
    const resultados: ResultadoBusca[] = [];
    const substanciasJaAdicionadas = new Set<string>();

    // 1. Buscar por aliases populares (ex: "viagra" → Sildenafila + Tadalafila)
    const aliasSubstancias: string[] = [];
    for (const [alias, subs] of Object.entries(ALIASES_POPULARES)) {
      if (alias.includes(q) || q.includes(alias)) {
        aliasSubstancias.push(...subs);
      }
    }

    // 2. Buscar nos medicamentos
    for (const med of meds) {
      const sub = med.substancia.toLowerCase();
      const refNome = med.referencia?.nome?.toLowerCase() || '';
      const refLab = med.referencia?.laboratorio?.toLowerCase() || '';
      
      let matchType: ResultadoBusca['matchType'] | null = null;

      // Match por alias
      if (aliasSubstancias.some(a => sub.includes(a.toLowerCase()) || a.toLowerCase().includes(sub))) {
        matchType = 'alias';
      }
      // Match por substância
      else if (sub.includes(q)) {
        matchType = 'substancia';
      }
      // Match por nome de referência
      else if (refNome.includes(q)) {
        matchType = 'referencia';
      }
      // Match por laboratório
      else if (refLab.includes(q)) {
        matchType = 'laboratorio';
      }
      // Match por genéricos
      else if (med.genericos?.some(g => g.nome?.toLowerCase().includes(q) || g.laboratorio?.toLowerCase().includes(q))) {
        matchType = 'generico';
      }
      // Match por similares
      else if (med.similares?.some(s => s.nome?.toLowerCase().includes(q) || s.laboratorio?.toLowerCase().includes(q))) {
        matchType = 'similar';
      }

      if (matchType && !substanciasJaAdicionadas.has(med.substancia)) {
        substanciasJaAdicionadas.add(med.substancia);
        
        const todosOsProdutos: CmedProduto[] = [];
        if (med.referencia?.preco) {
          todosOsProdutos.push({ ...med.referencia, tipo: 'Referência' });
        }
        (med.genericos || []).forEach(g => todosOsProdutos.push({ ...g, tipo: 'Genérico' }));
        (med.similares || []).forEach(s => todosOsProdutos.push({ ...s, tipo: 'Similar' }));

        const precos = todosOsProdutos.filter(p => p.preco > 0).map(p => p.preco);
        const isFarmaciaPopular = FARMACIA_POPULAR_GRATUITOS.some(fp => 
          med.substancia.toUpperCase().includes(fp) || fp.includes(med.substancia.toUpperCase().split(';')[0])
        );

        resultados.push({
          substancia: med.substancia,
          classe: getClasseTerapeutica(med.substancia),
          tarja: classificarTarja(med.substancia),
          farmaciaPopular: isFarmaciaPopular,
          referencia: med.referencia ? { ...med.referencia, tipo: 'Referência' } : { nome: '-', laboratorio: '-', preco: 0, apresentacao: '-', tipo: 'Referência' },
          genericos: (med.genericos || []).map(g => ({ ...g, tipo: 'Genérico' })),
          similares: (med.similares || []).map(s => ({ ...s, tipo: 'Similar' })),
          todosOsProdutos,
          menorPreco: precos.length > 0 ? Math.min(...precos) : 0,
          maiorPreco: precos.length > 0 ? Math.max(...precos) : 0,
          totalProdutos: todosOsProdutos.length,
          matchType,
        });
      }
    }

    // Ordenar: alias primeiro, depois substância, depois referência, etc.
    const prioridade: Record<string, number> = { alias: 0, substancia: 1, referencia: 2, generico: 3, similar: 4, laboratorio: 5 };
    resultados.sort((a, b) => prioridade[a.matchType] - prioridade[b.matchType]);

    return resultados.slice(0, 50); // Limitar a 50 resultados
  }, [cmedData, search]);

  const toggleFarmacia = (id: string) => {
    const next = new Set(selectedFarmacias);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedFarmacias(next);
  };

  const selectAll = () => setSelectedFarmacias(new Set(farmaciasNaCidade.map(f => f.id)));
  const deselectAll = () => setSelectedFarmacias(new Set());

  // Filtrar produtos do medicamento selecionado
  const produtosFiltrados = useMemo(() => {
    if (!selectedMed) return [];
    let produtos = selectedMed.todosOsProdutos;
    if (filtroTipo !== 'todos') {
      const tipoMap: Record<string, string> = { referencia: 'Referência', generico: 'Genérico', similar: 'Similar' };
      produtos = produtos.filter(p => p.tipo === tipoMap[filtroTipo]);
    }
    if (filtroLab) {
      produtos = produtos.filter(p => p.laboratorio.toLowerCase().includes(filtroLab.toLowerCase()));
    }
    return produtos.sort((a, b) => a.preco - b.preco);
  }, [selectedMed, filtroTipo, filtroLab]);

  // Laboratórios únicos do medicamento selecionado
  const labsDoMedicamento = useMemo(() => {
    if (!selectedMed) return [];
    return Array.from(new Set(selectedMed.todosOsProdutos.map(p => p.laboratorio))).sort();
  }, [selectedMed]);

  const GRATUITOS = [
    { nome: 'Losartana 25mg/50mg', classe: 'Anti-hipertensivo' },
    { nome: 'Captopril 25mg', classe: 'Anti-hipertensivo' },
    { nome: 'Hidroclorotiazida 25mg', classe: 'Diurético' },
    { nome: 'Enalapril 5mg/10mg', classe: 'Anti-hipertensivo' },
    { nome: 'Atenolol 25mg/50mg', classe: 'Anti-hipertensivo' },
    { nome: 'Propranolol 40mg', classe: 'Anti-hipertensivo' },
    { nome: 'Anlodipino 5mg/10mg', classe: 'Anti-hipertensivo' },
    { nome: 'Metformina 500mg/850mg', classe: 'Antidiabético' },
    { nome: 'Glibenclamida 5mg', classe: 'Antidiabético' },
    { nome: 'Insulina NPH 100UI/mL', classe: 'Antidiabético' },
    { nome: 'Insulina Regular 100UI/mL', classe: 'Antidiabético' },
    { nome: 'Sinvastatina 10mg/20mg/40mg', classe: 'Estatina' },
    { nome: 'Salbutamol aerossol 100mcg', classe: 'Broncodilatador' },
    { nome: 'Beclometasona aerossol 200mcg', classe: 'Corticosteroide' },
    { nome: 'Brometo de Ipratrópio 0,25mg/mL', classe: 'Broncodilatador' },
    { nome: 'Carbidopa + Levodopa 25/250mg', classe: 'Antiparkinsoniano' },
    { nome: 'Diazepam 5mg', classe: 'Ansiolítico' },
    { nome: 'Fluoxetina 20mg', classe: 'Antidepressivo' },
    { nome: 'Amitriptilina 25mg', classe: 'Antidepressivo' },
    { nome: 'Sertralina 50mg', classe: 'Antidepressivo' },
    { nome: 'Carbamazepina 200mg', classe: 'Anticonvulsivante' },
    { nome: 'Fenobarbital 100mg', classe: 'Anticonvulsivante' },
    { nome: 'Ácido Fólico 5mg', classe: 'Vitamina' },
    { nome: 'Sulfato Ferroso 40mg', classe: 'Suplemento' },
  ];

  const tarjaColor = (tarja: string) => {
    switch(tarja) {
      case 'preta': return 'bg-gray-900 text-white border-gray-600';
      case 'vermelha': return 'bg-red-900/30 text-red-300 border-red-700/50';
      case 'amarela': return 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50';
      default: return 'bg-green-900/30 text-green-300 border-green-700/50';
    }
  };

  const tipoColor = (tipo: string) => {
    switch(tipo) {
      case 'Referência': return 'bg-blue-600 text-white';
      case 'Genérico': return 'bg-emerald-600 text-white';
      case 'Similar': return 'bg-purple-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Preços de Medicamentos</h1>
        <p className="text-gray-400">Compare preços entre farmácias da sua cidade e encontre o melhor preço</p>
        {cmedData && (
          <p className="text-xs text-gray-500">
            Base CMED/ANVISA: {cmedData.medicines?.length?.toLocaleString()} substâncias | 
            Atualizado: {cmedData.metadata?.lastUpdate || 'N/A'}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 justify-center flex-wrap">
        {([
          { id: 'comparar' as const, label: 'Comparar Preços', icon: '💊' },
          { id: 'gratuitos' as const, label: 'Medicamentos Gratuitos', icon: '🏥' },
          { id: 'descontos' as const, label: 'Programas de Desconto', icon: '💰' },
        ]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'comparar' && (
        <>
          {/* Filtros Estado/Cidade */}
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white">Filtrar por localização</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select value={estado} onChange={e => { setEstado(e.target.value); setCidade(''); setSelectedFarmacias(new Set()); }}
                className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm">
                <option value="">Todos os Estados</option>
                {Object.keys(ESTADOS_CIDADES_COMPLETO).sort().map(uf => (
                  <option key={uf} value={uf}>{uf} — {ESTADOS_NOMES[uf]}</option>
                ))}
              </select>
              <select value={cidade} onChange={e => { setCidade(e.target.value); setSelectedFarmacias(new Set()); }} disabled={!estado}
                className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm disabled:opacity-50">
                <option value="">Todas as Cidades</option>
                {cidadesDoEstado.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Seleção de Farmácias */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">
                  Farmácias {cidade ? `em ${cidade}` : estado ? `em ${ESTADOS_NOMES[estado] || estado}` : ''} ({farmaciasNaCidade.length})
                </h3>
                <div className="flex gap-2">
                  <button onClick={selectAll} className="text-xs text-emerald-400 hover:underline">Todas</button>
                  <button onClick={deselectAll} className="text-xs text-red-400 hover:underline">Limpar</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {farmaciasNaCidade.map(f => (
                  <button key={f.id} onClick={() => toggleFarmacia(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      selectedFarmacias.has(f.id) ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-gray-600 bg-gray-800 text-gray-400'}`}>
                    <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: f.cor }} />
                    {f.nome}
                    {f.tipo === 'governo' && <span className="ml-1 text-cyan-400 text-[10px]">GOV</span>}
                    {f.tipo === 'regional' && <span className="ml-1 text-yellow-400 text-[10px]">REG</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Busca */}
          <div className="relative">
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setSelectedMed(null); }}
              placeholder="Buscar por nome, substância, marca ou laboratório (ex: Viagra, Dipirona, CIMED, Tadalafila...)"
              className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" />
            {search.trim().length > 0 && search.trim().length < 2 && (
              <p className="text-xs text-gray-500 mt-1 ml-2">Digite pelo menos 2 caracteres para buscar...</p>
            )}
            {loading && <p className="text-xs text-yellow-400 mt-1 ml-2">Carregando base de medicamentos...</p>}
          </div>

          {/* Detalhes do medicamento selecionado */}
          {selectedMed ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedMed.substancia}</h2>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-sm text-gray-400">{selectedMed.classe}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${tarjaColor(selectedMed.tarja)}`}>
                        {selectedMed.tarja === 'sem' ? 'Sem tarja' : `Tarja ${selectedMed.tarja}`}
                      </span>
                      {selectedMed.farmaciaPopular && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-600 text-white">Farmácia Popular</span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => { setSelectedMed(null); setExpandedProduto(null); setFiltroTipo('todos'); setFiltroLab(''); }}
                    className="text-sm text-emerald-400 hover:underline whitespace-nowrap">← Voltar</button>
                </div>

                {/* Resumo de preços */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  <div className="bg-gray-900/60 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Menor preço</p>
                    <p className="text-lg font-bold text-emerald-400">
                      R$ {selectedMed.menorPreco.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <div className="bg-gray-900/60 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Maior preço</p>
                    <p className="text-lg font-bold text-red-400">
                      R$ {selectedMed.maiorPreco.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <div className="bg-gray-900/60 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Total de produtos</p>
                    <p className="text-lg font-bold text-white">{selectedMed.totalProdutos}</p>
                  </div>
                  <div className="bg-gray-900/60 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Economia</p>
                    <p className="text-lg font-bold text-yellow-400">
                      {selectedMed.maiorPreco > 0 ? `${((1 - selectedMed.menorPreco / selectedMed.maiorPreco) * 100).toFixed(0)}%` : '-'}
                    </p>
                  </div>
                </div>

                {/* Referência */}
                {selectedMed.referencia.preco > 0 && (
                  <div className="mt-4 bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
                    <p className="text-xs text-blue-400 font-semibold mb-1">Medicamento de Referência</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{selectedMed.referencia.nome}</p>
                        <p className="text-xs text-gray-400">{selectedMed.referencia.laboratorio}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{selectedMed.referencia.apresentacao}</p>
                      </div>
                      <p className="text-lg font-bold text-blue-300">R$ {selectedMed.referencia.preco.toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Filtros de tipo e laboratório */}
              <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-gray-400 mr-2">Filtrar:</span>
                  {(['todos', 'referencia', 'generico', 'similar'] as const).map(t => (
                    <button key={t} onClick={() => setFiltroTipo(t)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        filtroTipo === t ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
                      {t === 'todos' ? `Todos (${selectedMed.totalProdutos})` :
                       t === 'referencia' ? `Referência (1)` :
                       t === 'generico' ? `Genéricos (${selectedMed.genericos.length})` :
                       `Similares (${selectedMed.similares.length})`}
                    </button>
                  ))}
                  <select value={filtroLab} onChange={e => setFiltroLab(e.target.value)}
                    className="ml-auto px-2 py-1 bg-gray-900 border border-gray-600 rounded-lg text-white text-xs">
                    <option value="">Todos os Laboratórios</option>
                    {labsDoMedicamento.map(l => (
                      <option key={l} value={l}>{l.length > 40 ? l.substring(0, 40) + '...' : l}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lista de produtos */}
              <div className="space-y-2">
                {produtosFiltrados.map((prod, i) => {
                  const isMin = i === 0 && prod.preco > 0;
                  const isExpanded = expandedProduto === `${prod.nome}-${prod.laboratorio}-${i}`;
                  return (
                    <div key={`${prod.nome}-${i}`}
                      className={`rounded-lg border transition-all overflow-hidden ${
                        isMin ? 'border-emerald-500/50' : 'border-gray-700/50'}`}>
                      <div onClick={() => setExpandedProduto(isExpanded ? null : `${prod.nome}-${prod.laboratorio}-${i}`)}
                        className={`flex items-center justify-between p-3 cursor-pointer transition-all ${
                          isMin ? 'bg-emerald-500/10' : 'bg-gray-900/50 hover:bg-gray-800/80'}`}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${tipoColor(prod.tipo)}`}>{prod.tipo}</span>
                            <span className="text-sm font-medium text-white truncate">{prod.nome}</span>
                            {isMin && <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full">Menor preço</span>}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{prod.laboratorio}</p>
                        </div>
                        <div className="flex items-center gap-3 ml-3">
                          <span className={`font-bold text-sm ${isMin ? 'text-emerald-400' : 'text-white'}`}>
                            R$ {prod.preco.toFixed(2).replace('.', ',')}
                          </span>
                          <span className="text-gray-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="px-4 py-3 bg-gray-900/80 border-t border-gray-700/50 space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">Apresentação:</span>
                              <span className="text-white ml-1">{prod.apresentacao}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Laboratório:</span>
                              <span className="text-white ml-1">{prod.laboratorio}</span>
                            </div>
                            {prod.ean && (
                              <div>
                                <span className="text-gray-500">EAN:</span>
                                <span className="text-white ml-1">{prod.ean}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-gray-500">Tipo:</span>
                              <span className="text-white ml-1">{prod.tipo}</span>
                            </div>
                          </div>
                          {/* Links para buscar nas farmácias selecionadas */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {farmaciasNaCidade.filter(f => selectedFarmacias.has(f.id)).slice(0, 5).map(f => (
                              <a key={f.id} href={f.urlBusca(prod.nome || selectedMed.substancia)} target="_blank" rel="noopener noreferrer"
                                className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-[10px] text-gray-300 hover:border-emerald-500 hover:text-emerald-300 transition-all">
                                <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: f.cor }} />
                                Buscar na {f.nome}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {produtosFiltrados.length === 0 && selectedMed && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhum produto encontrado com os filtros selecionados.</p>
                  </div>
                )}
              </div>

              {/* Farmácias onde comprar */}
              <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Onde comprar {cidade ? `em ${cidade}` : estado ? `em ${ESTADOS_NOMES[estado]}` : ''}
                </h3>
                <div className="space-y-2">
                  {farmaciasNaCidade.filter(f => selectedFarmacias.has(f.id)).map(f => {
                    const isExpanded = expandedFarmacia === f.id;
                    return (
                      <div key={f.id} className="rounded-lg border border-gray-700/50 overflow-hidden">
                        <div onClick={() => setExpandedFarmacia(isExpanded ? null : f.id)}
                          className="flex items-center justify-between p-3 cursor-pointer bg-gray-900/50 hover:bg-gray-800/80 transition-all">
                          <div className="flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: f.cor }} />
                            <span className="text-sm font-medium text-white">{f.nome}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                              f.tipo === 'governo' ? 'bg-cyan-600 text-white' : f.tipo === 'regional' ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-white'
                            }`}>{f.tipo === 'governo' ? 'GOV' : f.tipo === 'regional' ? 'Regional' : 'Nacional'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <a href={f.urlBusca(selectedMed.referencia.nome || selectedMed.substancia)} target="_blank" rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="text-xs text-emerald-400 hover:underline">Ver preços →</a>
                            <span className="text-gray-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="px-4 py-3 bg-gray-900/80 border-t border-gray-700/50 space-y-3">
                            <p className="text-xs text-gray-400">{f.descricao}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <span className="text-emerald-400 text-sm mt-0.5">📍</span>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase">Endereço</p>
                                    <p className="text-sm text-white">{f.contato.endereco}</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-emerald-400 text-sm mt-0.5">📞</span>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase">Telefone</p>
                                    <p className="text-sm text-white">{f.contato.telefone}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <span className="text-emerald-400 text-sm mt-0.5">💬</span>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase">WhatsApp</p>
                                    <p className="text-sm text-white">{f.contato.whatsapp}</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-emerald-400 text-sm mt-0.5">🕐</span>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase">Horário</p>
                                    <p className="text-sm text-white">{f.contato.horario}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <a href={`tel:${f.contato.telefone.replace(/\D/g, '')}`}
                                className="flex-1 text-center px-3 py-2 bg-emerald-600/20 border border-emerald-600/40 rounded-lg text-emerald-300 text-xs font-medium hover:bg-emerald-600/30 transition-all">
                                📞 Ligar
                              </a>
                              {f.contato.whatsapp !== 'Não disponível' && (
                                <a href={`https://wa.me/55${f.contato.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                                  className="flex-1 text-center px-3 py-2 bg-green-600/20 border border-green-600/40 rounded-lg text-green-300 text-xs font-medium hover:bg-green-600/30 transition-all">
                                  💬 WhatsApp
                                </a>
                              )}
                              <a href={f.urlBusca(selectedMed.referencia.nome || selectedMed.substancia)} target="_blank" rel="noopener noreferrer"
                                className="flex-1 text-center px-3 py-2 bg-blue-600/20 border border-blue-600/40 rounded-lg text-blue-300 text-xs font-medium hover:bg-blue-600/30 transition-all">
                                🌐 Ver no Site
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Lista de resultados da busca */
            <div className="space-y-2">
              {resultadosBusca.map((med, i) => (
                <div key={`${med.substancia}-${i}`} onClick={() => { setSelectedMed(med); setFiltroTipo('todos'); setFiltroLab(''); }}
                  className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 cursor-pointer hover:border-emerald-500/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-white text-sm">{med.referencia.nome !== '-' ? med.referencia.nome : med.substancia}</h3>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${tarjaColor(med.tarja)}`}>
                          {med.tarja === 'sem' ? 'OTC' : med.tarja.charAt(0).toUpperCase() + med.tarja.slice(1)}
                        </span>
                        {med.farmaciaPopular && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-600 text-white">F. Popular</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{med.substancia} — {med.classe}</p>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
                        {med.genericos.length > 0 && <span className="text-emerald-400">{med.genericos.length} genérico(s)</span>}
                        {med.similares.length > 0 && <span className="text-purple-400">{med.similares.length} similar(es)</span>}
                        <span>{med.totalProdutos} produto(s)</span>
                        {med.referencia.laboratorio !== '-' && <span className="truncate max-w-[200px]">{med.referencia.laboratorio}</span>}
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <div className="text-sm font-bold text-emerald-400">
                        {med.menorPreco > 0 ? `A partir de R$ ${med.menorPreco.toFixed(2).replace('.', ',')}` : 'Consultar'}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {med.matchType === 'alias' && '🔍 Nome popular'}
                        {med.matchType === 'laboratorio' && '🏭 Laboratório'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {search.trim().length >= 2 && resultadosBusca.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">Nenhum medicamento encontrado para "{search}"</p>
                  <p className="text-sm">Tente buscar pelo nome da substância, marca comercial ou laboratório.</p>
                  <p className="text-xs mt-2 text-gray-600">Exemplos: Dipirona, Viagra, Tadalafila, CIMED, Eurofarma</p>
                </div>
              )}
              {search.trim().length < 2 && !loading && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">Digite o nome do medicamento para buscar</p>
                  <p className="text-sm">Busque por nome comercial, genérico, substância ou laboratório</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {['Dipirona', 'Viagra', 'Losartana', 'Omeprazol', 'Ozempic', 'Rivotril', 'CIMED'].map(ex => (
                      <button key={ex} onClick={() => setSearch(ex)}
                        className="px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-lg text-xs text-gray-300 hover:border-emerald-500 hover:text-emerald-300 transition-all">
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {tab === 'gratuitos' && (
        <div className="space-y-4">
          <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-xl p-4">
            <h3 className="text-lg font-bold text-cyan-300 mb-2">Farmácia Popular — Medicamentos Gratuitos</h3>
            <p className="text-sm text-gray-400 mb-4">
              O Programa Farmácia Popular oferece medicamentos gratuitos para hipertensão, diabetes, asma e outras condições.
              Apresente receita médica e CPF em qualquer farmácia credenciada.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {GRATUITOS.map((med, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                  <span className="text-cyan-400 text-lg">✓</span>
                  <div className="flex-1">
                    <span className="text-sm text-white">{med.nome}</span>
                    <span className="text-[10px] text-gray-500 ml-2">{med.classe}</span>
                  </div>
                  <span className="text-xs bg-cyan-600 text-white px-2 py-0.5 rounded-full">Grátis</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 text-sm text-gray-400">
            <strong className="text-white">Como obter:</strong> Apresente receita médica e CPF em qualquer farmácia credenciada.
            Consulte em <a href="https://www.gov.br/saude/pt-br/composicao/sctie/daf/programa-farmacia-popular" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">gov.br/farmacia-popular</a>.
          </div>
        </div>
      )}

      {tab === 'descontos' && (
        <div className="space-y-4">
          {[
            { nome: 'Consulta Remédios', desc: 'Compare preços em tempo real entre farmácias online de todo o Brasil', url: 'https://consultaremedios.com.br' },
            { nome: 'Programa Farmácia Popular', desc: 'Medicamentos gratuitos ou com até 90% de desconto pelo SUS', url: 'https://www.gov.br/saude/pt-br/composicao/sctie/daf/programa-farmacia-popular' },
            { nome: 'FarmáciasApp', desc: 'Descontos de até 80% em medicamentos genéricos via aplicativo', url: 'https://www.farmaciasapp.com.br' },
            { nome: 'Programa Viva Saúde (Pacheco/DPSP)', desc: 'Descontos em medicamentos de marca com cadastro gratuito nas redes Pacheco e São Paulo', url: 'https://www.drogariaspacheco.com.br/vivasaude' },
            { nome: 'Programa Raia Drogasil', desc: 'Descontos personalizados com cartão fidelidade nas redes Drogasil e Droga Raia', url: 'https://www.rd.com.br/' },
            { nome: 'Programa Panvel Mais', desc: 'Descontos e cashback na rede Panvel (Sul do Brasil)', url: 'https://www.panvel.com/panvel/panvelMais.do' },
          ].map((p, i) => (
            <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
              className="block bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 hover:border-emerald-500/50 transition-all">
              <h3 className="font-semibold text-white">{p.nome}</h3>
              <p className="text-sm text-gray-400 mt-1">{p.desc}</p>
            </a>
          ))}
        </div>
      )}

      <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-4 text-sm text-amber-200/80">
        <strong>Importante:</strong> Preços de referência baseados na tabela CMED/ANVISA (PMC - Preço Máximo ao Consumidor).
        Valores reais podem variar conforme a farmácia, região e promoções vigentes. Sempre confirme o preço na farmácia.
      </div>
    </div>
  );
}
