import React, { useState, useMemo, useCallback } from 'react';
import { SISTEMAS, ORGAOS, type OrgaoData, type SistemaData } from './atlasOrgaos';

export default function Interactive3DAtlas() {
  const [sistemaAtivo, setSistemaAtivo] = useState<string>('todos');
  const [orgaoSelecionado, setOrgaoSelecionado] = useState<OrgaoData | null>(null);
  const [abaDetalhe, setAbaDetalhe] = useState<'info' | 'dissecacao' | 'patologias'>('info');
  const [zoom, setZoom] = useState(1);
  const [busca, setBusca] = useState('');
  const [compAtivo, setCompAtivo] = useState<number | null>(null);

  const orgaosFiltrados = useMemo(() => {
    let lista = ORGAOS;
    if (sistemaAtivo !== 'todos') lista = lista.filter(o => o.sistema === sistemaAtivo);
    if (busca.trim()) {
      const q = busca.toLowerCase();
      lista = lista.filter(o =>
        o.nome.toLowerCase().includes(q) ||
        o.nomeLatim.toLowerCase().includes(q) ||
        o.descricao.toLowerCase().includes(q)
      );
    }
    return lista;
  }, [sistemaAtivo, busca]);

  const sistemaDoOrgao = useCallback((sid: string) => SISTEMAS.find(s => s.id === sid), []);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* HEADER */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-white">Atlas Anatomico Interativo 3D</h1>
        <p className="text-sm text-gray-400">34 orgaos humanos em alta definicao | 9 sistemas corporais | Nomenclatura anatomica completa</p>
      </div>

      {/* BUSCA */}
      <input type="text" value={busca} onChange={e => setBusca(e.target.value)}
        placeholder="Buscar orgao, sistema ou estrutura..."
        className="w-full px-4 py-2.5 bg-gray-800/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500" />

      {/* SISTEMAS */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button onClick={() => { setSistemaAtivo('todos'); setOrgaoSelecionado(null); }}
          className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
            sistemaAtivo === 'todos' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}>
          Todos (34)
        </button>
        {SISTEMAS.map(s => {
          const count = ORGAOS.filter(o => o.sistema === s.id).length;
          return (
            <button key={s.id} onClick={() => { setSistemaAtivo(s.id); setOrgaoSelecionado(null); }}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                sistemaAtivo === s.id ? 'border-emerald-500 text-white' : 'border-gray-700 text-gray-400 hover:bg-gray-700'}`}
              style={sistemaAtivo === s.id ? { backgroundColor: s.cor + '33', borderColor: s.cor } : { backgroundColor: 'rgb(31,41,55)' }}>
              {s.icone} {s.nome} ({count})
            </button>
          );
        })}
      </div>

      {/* LAYOUT PRINCIPAL */}
      {orgaoSelecionado ? (
        <OrgaoDetalhe
          orgao={orgaoSelecionado}
          sistema={sistemaDoOrgao(orgaoSelecionado.sistema)}
          abaDetalhe={abaDetalhe}
          setAbaDetalhe={setAbaDetalhe}
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          compAtivo={compAtivo}
          setCompAtivo={setCompAtivo}
          onVoltar={() => { setOrgaoSelecionado(null); setCompAtivo(null); setZoom(1); }}
        />
      ) : (
        <GradeOrgaos orgaos={orgaosFiltrados} onSelect={(o) => { setOrgaoSelecionado(o); setAbaDetalhe('info'); setCompAtivo(null); setZoom(1); }} sistemaDoOrgao={sistemaDoOrgao} />
      )}
    </div>
  );
}

/* ─────────────────── GRADE DE ORGAOS ─────────────────── */
function GradeOrgaos({ orgaos, onSelect, sistemaDoOrgao }: {
  orgaos: OrgaoData[];
  onSelect: (o: OrgaoData) => void;
  sistemaDoOrgao: (sid: string) => SistemaData | undefined;
}) {
  if (orgaos.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Nenhum orgao encontrado.</p>
        <p className="text-gray-600 text-sm mt-1">Tente outra busca ou selecione outro sistema.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {orgaos.map(orgao => {
        const sis = sistemaDoOrgao(orgao.sistema);
        return (
          <button key={orgao.id} onClick={() => onSelect(orgao)}
            className="group bg-gray-800/60 border border-gray-700/50 rounded-xl overflow-hidden hover:border-emerald-500/60 transition-all hover:shadow-lg hover:shadow-emerald-500/10 text-left">
            <div className="relative aspect-square bg-gray-900/80 overflow-hidden">
              <img src={orgao.imagem} alt={orgao.nome} loading="lazy"
                className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium"
                style={{ backgroundColor: (sis?.cor || '#666') + '44', color: sis?.cor || '#999', border: `1px solid ${(sis?.cor || '#666')}66` }}>
                {sis?.icone}
              </div>
            </div>
            <div className="p-2.5">
              <h3 className="text-xs font-semibold text-white leading-tight">{orgao.nome}</h3>
              <p className="text-[10px] text-gray-500 italic">{orgao.nomeLatim}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────── DETALHE DO ORGAO ─────────────────── */
function OrgaoDetalhe({ orgao, sistema, abaDetalhe, setAbaDetalhe, zoom, onZoomIn, onZoomOut, onResetZoom, compAtivo, setCompAtivo, onVoltar }: {
  orgao: OrgaoData;
  sistema: SistemaData | undefined;
  abaDetalhe: 'info' | 'dissecacao' | 'patologias';
  setAbaDetalhe: (a: 'info' | 'dissecacao' | 'patologias') => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  compAtivo: number | null;
  setCompAtivo: (i: number | null) => void;
  onVoltar: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* BARRA SUPERIOR */}
      <div className="flex items-center justify-between">
        <button onClick={onVoltar} className="flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
          <span>&#8592;</span> Voltar ao Atlas
        </button>
        <div className="flex items-center gap-2">
          {sistema && (
            <span className="px-2 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: sistema.cor + '22', color: sistema.cor, border: `1px solid ${sistema.cor}44` }}>
              {sistema.icone} {sistema.nome}
            </span>
          )}
        </div>
      </div>

      {/* LAYOUT 2 COLUNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* COLUNA ESQUERDA — IMAGEM */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl overflow-hidden">
          <div className="relative" style={{ minHeight: '400px' }}>
            <div className="flex items-center justify-center p-4 overflow-hidden" style={{ minHeight: '400px' }}>
              <img src={orgao.imagem} alt={orgao.nome}
                className="max-w-full max-h-[500px] object-contain transition-transform duration-300"
                style={{ transform: `scale(${zoom})` }} />
            </div>
            {/* CONTROLES DE ZOOM */}
            <div className="absolute bottom-3 right-3 flex gap-1.5">
              <button onClick={onZoomOut} className="w-8 h-8 bg-gray-800/90 border border-gray-600 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center justify-center">-</button>
              <button onClick={onResetZoom} className="px-2 h-8 bg-gray-800/90 border border-gray-600 rounded-lg text-white text-xs hover:bg-gray-700 flex items-center justify-center">{Math.round(zoom * 100)}%</button>
              <button onClick={onZoomIn} className="w-8 h-8 bg-gray-800/90 border border-gray-600 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center justify-center">+</button>
            </div>
            {/* NOME DO ORGAO */}
            <div className="absolute top-3 left-3 bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-lg px-3 py-2">
              <h2 className="text-lg font-bold text-white">{orgao.nome}</h2>
              <p className="text-xs text-gray-400 italic">{orgao.nomeLatim}</p>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA — INFORMACOES */}
        <div className="space-y-3">
          {/* ABAS */}
          <div className="flex gap-1.5">
            {([
              { id: 'info' as const, label: 'Informacoes' },
              { id: 'dissecacao' as const, label: 'Dissecacao' },
              { id: 'patologias' as const, label: 'Patologias' },
            ]).map(tab => (
              <button key={tab.id} onClick={() => setAbaDetalhe(tab.id)}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  abaDetalhe === tab.id ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* CONTEUDO DA ABA */}
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 max-h-[500px] overflow-y-auto">
            {abaDetalhe === 'info' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Descricao</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{orgao.descricao}</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <InfoItem titulo="Funcao" valor={orgao.funcao} />
                  <InfoItem titulo="Localizacao" valor={orgao.localizacao} />
                  <InfoItem titulo="Irrigacao" valor={orgao.irrigacao} />
                  <InfoItem titulo="Inervacao" valor={orgao.inervacao} />
                </div>
                <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-amber-400 mb-1">Curiosidade Clinica</h4>
                  <p className="text-xs text-amber-200/80">{orgao.curiosidade}</p>
                </div>
              </div>
            )}

            {abaDetalhe === 'dissecacao' && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                  Componentes Anatomicos ({orgao.componentes.length})
                </h4>
                {orgao.componentes.map((comp, i) => (
                  <button key={i} onClick={() => setCompAtivo(compAtivo === i ? null : i)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      compAtivo === i
                        ? 'bg-emerald-600/15 border-emerald-500/40'
                        : 'bg-gray-900/50 border-gray-700/30 hover:border-gray-600'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-600/20 text-emerald-400 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                        <span className="text-sm font-medium text-white">{comp.nome}</span>
                      </div>
                      <span className="text-gray-500 text-xs">{compAtivo === i ? '\u25B2' : '\u25BC'}</span>
                    </div>
                    {compAtivo === i && (
                      <p className="text-xs text-gray-400 mt-2 ml-8">{comp.descricao}</p>
                    )}
                  </button>
                ))}
              </div>
            )}

            {abaDetalhe === 'patologias' && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                  Patologias Associadas ({orgao.patologias.length})
                </h4>
                {orgao.patologias.map((pat, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-900/50 border border-gray-700/30 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                    <span className="text-sm text-white">{pat}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── COMPONENTES AUXILIARES ─────────────────── */
function InfoItem({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="bg-gray-900/40 border border-gray-700/20 rounded-lg p-3">
      <h5 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">{titulo}</h5>
      <p className="text-xs text-gray-300">{valor}</p>
    </div>
  );
}
