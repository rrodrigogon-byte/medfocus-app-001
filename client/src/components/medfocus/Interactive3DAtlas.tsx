import React, { useState, useMemo, useCallback } from 'react';
import { SISTEMAS, ORGAOS, type OrgaoData, type SistemaData, type ComponenteDissecacao } from './atlasOrgaos';

export default function Interactive3DAtlas() {
  const [sistemaAtivo, setSistemaAtivo] = useState<string>('todos');
  const [orgaoSelecionado, setOrgaoSelecionado] = useState<OrgaoData | null>(null);
  const [abaDetalhe, setAbaDetalhe] = useState<'info' | 'dissecacao' | 'patologias'>('info');
  const [zoom, setZoom] = useState(1);
  const [busca, setBusca] = useState('');
  const [compAtivo, setCompAtivo] = useState<number | null>(null);
  const [imagemAtual, setImagemAtual] = useState<string>('');

  const orgaosFiltrados = useMemo(() => {
    let lista = ORGAOS;
    if (sistemaAtivo !== 'todos') lista = lista.filter(o => o.sistema === sistemaAtivo);
    if (busca.trim()) {
      const q = busca.toLowerCase();
      lista = lista.filter(o =>
        o.nome.toLowerCase().includes(q) ||
        o.nomeLatim.toLowerCase().includes(q) ||
        o.descricao.toLowerCase().includes(q) ||
        o.componentes.some(c => c.nome.toLowerCase().includes(q))
      );
    }
    return lista;
  }, [sistemaAtivo, busca]);

  const sistemaDoOrgao = useCallback((sid: string) => SISTEMAS.find(s => s.id === sid), []);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  const handleSelectOrgao = (o: OrgaoData) => {
    setOrgaoSelecionado(o);
    setImagemAtual(o.imagem);
    setAbaDetalhe('info');
    setCompAtivo(null);
    setZoom(1);
  };

  const handleSelectComponente = (i: number, comp: ComponenteDissecacao) => {
    if (compAtivo === i) {
      setCompAtivo(null);
      if (orgaoSelecionado) setImagemAtual(orgaoSelecionado.imagem);
    } else {
      setCompAtivo(i);
      if (comp.imagem) {
        setImagemAtual(comp.imagem);
        setZoom(1);
      }
    }
  };

  const handleVoltar = () => {
    setOrgaoSelecionado(null);
    setCompAtivo(null);
    setZoom(1);
    setImagemAtual('');
  };

  const handleVoltarImgOriginal = () => {
    if (orgaoSelecionado) {
      setImagemAtual(orgaoSelecionado.imagem);
      setCompAtivo(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* HEADER */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-white">Atlas Anatomico Interativo 3D</h1>
        <p className="text-sm text-gray-400">
          57 órgãos | 134 imagens reais | 11 sistemas corporais | Nomenclatura anatomica completa
        </p>
      </div>

      {/* BUSCA */}
      <input type="text" value={busca} onChange={e => setBusca(e.target.value)}
        placeholder="Buscar orgao, sistema, estrutura ou componente..."
        className="w-full px-4 py-2.5 bg-gray-800/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500" />

      {/* SISTEMAS */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button onClick={() => { setSistemaAtivo('todos'); setOrgaoSelecionado(null); setCompAtivo(null); }}
          className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
            sistemaAtivo === 'todos' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}>
          Todos ({ORGAOS.length})
        </button>
        {SISTEMAS.map(s => {
          const count = ORGAOS.filter(o => o.sistema === s.id).length;
          return (
            <button key={s.id} onClick={() => { setSistemaAtivo(s.id); setOrgaoSelecionado(null); setCompAtivo(null); }}
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
          onSelectComponente={handleSelectComponente}
          onVoltar={handleVoltar}
          onVoltarImgOriginal={handleVoltarImgOriginal}
          imagemAtual={imagemAtual}
        />
      ) : (
        <GradeOrgaos orgaos={orgaosFiltrados} onSelect={handleSelectOrgao} sistemaDoOrgao={sistemaDoOrgao} />
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
        const compCount = orgao.componentes.filter(c => c.imagem).length;
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
              {compCount > 0 && (
                <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-emerald-600/80 text-white">
                  {compCount} img
                </div>
              )}
            </div>
            <div className="p-2.5">
              <h3 className="text-xs font-semibold text-white leading-tight">{orgao.nome}</h3>
              <p className="text-[10px] text-gray-500 italic">{orgao.nomeLatim}</p>
              <p className="text-[10px] text-gray-600 mt-0.5">{orgao.componentes.length} componentes</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────── DETALHE DO ORGAO ─────────────────── */
function OrgaoDetalhe({ orgao, sistema, abaDetalhe, setAbaDetalhe, zoom, onZoomIn, onZoomOut, onResetZoom, compAtivo, onSelectComponente, onVoltar, onVoltarImgOriginal, imagemAtual }: {
  orgao: OrgaoData;
  sistema: SistemaData | undefined;
  abaDetalhe: 'info' | 'dissecacao' | 'patologias';
  setAbaDetalhe: (a: 'info' | 'dissecacao' | 'patologias') => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  compAtivo: number | null;
  onSelectComponente: (i: number, comp: ComponenteDissecacao) => void;
  onVoltar: () => void;
  onVoltarImgOriginal: () => void;
  imagemAtual: string;
}) {
  const isComponenteImg = imagemAtual !== orgao.imagem;
  const compAtivoData = compAtivo !== null ? orgao.componentes[compAtivo] : null;

  return (
    <div className="space-y-4">
      {/* BARRA SUPERIOR */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <button onClick={onVoltar} className="flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
          <span>&#8592;</span> Voltar ao Atlas
        </button>
        <div className="flex items-center gap-2">
          {isComponenteImg && (
            <button onClick={onVoltarImgOriginal}
              className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors border border-gray-600">
              Ver Orgao Original
            </button>
          )}
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
          <div className="relative" style={{ minHeight: '420px' }}>
            <div className="flex items-center justify-center p-4 overflow-hidden" style={{ minHeight: '420px' }}>
              <img src={imagemAtual} alt={compAtivoData?.nome || orgao.nome}
                className="max-w-full max-h-[500px] object-contain transition-transform duration-300"
                style={{ transform: `scale(${zoom})` }} />
            </div>
            {/* CONTROLES DE ZOOM */}
            <div className="absolute bottom-3 right-3 flex gap-1.5">
              <button onClick={onZoomOut} className="w-8 h-8 bg-gray-800/90 border border-gray-600 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center justify-center">-</button>
              <button onClick={onResetZoom} className="px-2 h-8 bg-gray-800/90 border border-gray-600 rounded-lg text-white text-xs hover:bg-gray-700 flex items-center justify-center">{Math.round(zoom * 100)}%</button>
              <button onClick={onZoomIn} className="w-8 h-8 bg-gray-800/90 border border-gray-600 rounded-lg text-white text-sm hover:bg-gray-700 flex items-center justify-center">+</button>
            </div>
            {/* NOME DO ORGAO / COMPONENTE */}
            <div className="absolute top-3 left-3 bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-lg px-3 py-2 max-w-[70%]">
              {isComponenteImg && compAtivoData ? (
                <>
                  <p className="text-[10px] text-emerald-400 uppercase tracking-wider">Componente</p>
                  <h2 className="text-base font-bold text-white leading-tight">{compAtivoData.nome}</h2>
                  <p className="text-[10px] text-gray-400 mt-0.5">{orgao.nome} — {orgao.nomeLatim}</p>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-white">{orgao.nome}</h2>
                  <p className="text-xs text-gray-400 italic">{orgao.nomeLatim}</p>
                </>
              )}
            </div>
          </div>

          {/* MINIATURAS DOS COMPONENTES COM IMAGEM */}
          {orgao.componentes.filter(c => c.imagem).length > 1 && (
            <div className="border-t border-gray-700/50 p-3">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Componentes com imagem ({orgao.componentes.filter(c => c.imagem).length})</p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {/* Miniatura do orgao original */}
                <button onClick={onVoltarImgOriginal}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                    !isComponenteImg ? 'border-emerald-500 ring-1 ring-emerald-500/30' : 'border-gray-700 hover:border-gray-500'}`}>
                  <img src={orgao.imagem} alt={orgao.nome} className="w-full h-full object-contain bg-gray-900 p-0.5" />
                </button>
                {orgao.componentes.map((comp, i) => {
                  if (!comp.imagem) return null;
                  const isActive = compAtivo === i;
                  return (
                    <button key={i} onClick={() => onSelectComponente(i, comp)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                        isActive ? 'border-emerald-500 ring-1 ring-emerald-500/30' : 'border-gray-700 hover:border-gray-500'}`}
                      title={comp.nome}>
                      <img src={comp.imagem} alt={comp.nome} className="w-full h-full object-contain bg-gray-900 p-0.5" loading="lazy" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* COLUNA DIREITA — INFORMACOES */}
        <div className="space-y-3">
          {/* ABAS */}
          <div className="flex gap-1.5">
            {([
              { id: 'info' as const, label: 'Informacoes', icon: '\uD83D\uDCCB' },
              { id: 'dissecacao' as const, label: `Dissecacao (${orgao.componentes.length})`, icon: '\uD83D\uDD2C' },
              { id: 'patologias' as const, label: `Patologias (${orgao.patologias.length})`, icon: '\u26A0\uFE0F' },
            ]).map(tab => (
              <button key={tab.id} onClick={() => { setAbaDetalhe(tab.id); }}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  abaDetalhe === tab.id ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* CONTEUDO DA ABA */}
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 max-h-[520px] overflow-y-auto scrollbar-thin">
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
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Componentes Anatomicos ({orgao.componentes.length})
                  </h4>
                  <span className="text-[10px] text-gray-500">
                    {orgao.componentes.filter(c => c.imagem).length} com imagem
                  </span>
                </div>
                {orgao.componentes.map((comp, i) => {
                  const isActive = compAtivo === i;
                  const hasImg = !!comp.imagem;
                  return (
                    <button key={i} onClick={() => onSelectComponente(i, comp)}
                      className={`w-full text-left rounded-lg border transition-all ${
                        isActive
                          ? 'bg-emerald-600/15 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                          : 'bg-gray-900/50 border-gray-700/30 hover:border-gray-600 hover:bg-gray-900/70'}`}>
                      <div className="flex items-start gap-3 p-3">
                        {/* MINIATURA */}
                        {hasImg ? (
                          <div className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                            isActive ? 'border-emerald-500' : 'border-gray-700'}`}>
                            <img src={comp.imagem} alt={comp.nome} className="w-full h-full object-contain bg-gray-900 p-0.5" loading="lazy" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
                            <span className="text-gray-600 text-lg">{i + 1}</span>
                          </div>
                        )}
                        {/* TEXTO */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white leading-tight">{comp.nome}</span>
                            {hasImg && (
                              <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-medium bg-emerald-600/20 text-emerald-400 border border-emerald-600/30">
                                IMG
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{comp.descricao}</p>
                          {isActive && hasImg && (
                            <p className="text-[10px] text-emerald-400 mt-1.5 flex items-center gap-1">
                              <span>&#x1F4F7;</span> Imagem exibida no painel esquerdo
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {abaDetalhe === 'patologias' && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                  Patologias Associadas ({orgao.patologias.length})
                </h4>
                {orgao.patologias.map((pat, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-700/30 rounded-lg hover:bg-gray-900/70 transition-colors">
                    <span className="w-7 h-7 rounded-full bg-red-600/20 text-red-400 text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                    <div>
                      <span className="text-sm text-white font-medium">{pat}</span>
                    </div>
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
