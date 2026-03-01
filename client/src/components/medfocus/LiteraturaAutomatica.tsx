/**
 * MedFocus — Automação da Literatura Médica (Sprint 12)
 * 
 * Diferencial: Campo de "Sugestões de Leitura" baseado no CID-10 selecionado.
 * Se o médico diagnosticar "Diabetes Tipo 2", o sistema puxa via API do PubMed
 * os 3 artigos mais recentes e relevantes sobre o tema.
 * 
 * APIs Reais Integradas:
 * - PubMed E-utilities: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/
 * - PubMed esearch + efetch para busca e recuperação de artigos
 * 
 * AVISO: Módulo educacional para apoio ao estudo e atualização científica.
 */

import React, { useState, useCallback } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface ArtigoPubMed {
  pmid: string;
  titulo: string;
  autores: string;
  journal: string;
  ano: string;
  abstract: string;
  doi: string;
  url: string;
  relevancia: 'alta' | 'media' | 'baixa';
}

interface CID10Item {
  codigo: string;
  descricao: string;
  termosPubMed: string[];
  categoria: string;
}

// ============================================================
// MAPEAMENTO CID-10 → TERMOS PubMed
// ============================================================
const CID10_DATABASE: CID10Item[] = [
  { codigo: 'E11', descricao: 'Diabetes mellitus tipo 2', termosPubMed: ['type 2 diabetes mellitus', 'T2DM treatment', 'metformin diabetes'], categoria: 'Endocrinologia' },
  { codigo: 'I10', descricao: 'Hipertensão essencial (primária)', termosPubMed: ['essential hypertension', 'blood pressure management', 'antihypertensive therapy'], categoria: 'Cardiologia' },
  { codigo: 'I25', descricao: 'Doença isquêmica crônica do coração', termosPubMed: ['chronic ischemic heart disease', 'coronary artery disease management'], categoria: 'Cardiologia' },
  { codigo: 'J45', descricao: 'Asma', termosPubMed: ['asthma treatment guidelines', 'bronchial asthma management'], categoria: 'Pneumologia' },
  { codigo: 'J44', descricao: 'Doença pulmonar obstrutiva crônica (DPOC)', termosPubMed: ['COPD management', 'chronic obstructive pulmonary disease treatment'], categoria: 'Pneumologia' },
  { codigo: 'F32', descricao: 'Episódio depressivo', termosPubMed: ['major depressive disorder treatment', 'depression pharmacotherapy'], categoria: 'Psiquiatria' },
  { codigo: 'F41', descricao: 'Transtornos ansiosos', termosPubMed: ['anxiety disorder treatment', 'generalized anxiety disorder'], categoria: 'Psiquiatria' },
  { codigo: 'K21', descricao: 'Doença do refluxo gastroesofágico (DRGE)', termosPubMed: ['GERD treatment', 'gastroesophageal reflux disease'], categoria: 'Gastroenterologia' },
  { codigo: 'M54', descricao: 'Dorsalgia (Lombalgia)', termosPubMed: ['low back pain management', 'chronic back pain treatment'], categoria: 'Ortopedia' },
  { codigo: 'N18', descricao: 'Doença renal crônica', termosPubMed: ['chronic kidney disease management', 'CKD progression'], categoria: 'Nefrologia' },
  { codigo: 'E78', descricao: 'Dislipidemia', termosPubMed: ['dyslipidemia treatment', 'statin therapy guidelines'], categoria: 'Endocrinologia' },
  { codigo: 'I48', descricao: 'Fibrilação atrial', termosPubMed: ['atrial fibrillation management', 'anticoagulation AF'], categoria: 'Cardiologia' },
  { codigo: 'I50', descricao: 'Insuficiência cardíaca', termosPubMed: ['heart failure treatment', 'HFrEF management guidelines'], categoria: 'Cardiologia' },
  { codigo: 'C50', descricao: 'Neoplasia maligna da mama', termosPubMed: ['breast cancer treatment', 'breast cancer screening'], categoria: 'Oncologia' },
  { codigo: 'E03', descricao: 'Hipotireoidismo', termosPubMed: ['hypothyroidism treatment', 'levothyroxine therapy'], categoria: 'Endocrinologia' },
  { codigo: 'G43', descricao: 'Enxaqueca', termosPubMed: ['migraine treatment', 'migraine prophylaxis'], categoria: 'Neurologia' },
  { codigo: 'B24', descricao: 'HIV/AIDS', termosPubMed: ['HIV treatment guidelines', 'antiretroviral therapy'], categoria: 'Infectologia' },
  { codigo: 'A15', descricao: 'Tuberculose', termosPubMed: ['tuberculosis treatment', 'TB management guidelines'], categoria: 'Infectologia' },
];

export function LiteraturaAutomatica() {
  const [buscaCID, setBuscaCID] = useState('');
  const [cidSelecionado, setCidSelecionado] = useState<CID10Item | null>(null);
  const [artigos, setArtigos] = useState<ArtigoPubMed[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [buscaLivre, setBuscaLivre] = useState('');
  const [sugestoesCID, setSugestoesCID] = useState<CID10Item[]>([]);
  const [totalResultados, setTotalResultados] = useState(0);
  const [tela, setTela] = useState<'cid' | 'livre' | 'salvos'>('cid');
  const [artigosSalvos, setArtigosSalvos] = useState<ArtigoPubMed[]>([]);
  const [artigoExpandido, setArtigoExpandido] = useState<string | null>(null);

  // Buscar artigos na PubMed API real
  const buscarPubMed = useCallback(async (termos: string[]) => {
    setBuscando(true);
    setArtigos([]);
    
    try {
      const query = termos.join(' OR ');
      
      // Etapa 1: esearch para obter PMIDs
      const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=6&sort=date&retmode=json`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();
      
      const pmids = searchData?.esearchresult?.idlist || [];
      setTotalResultados(parseInt(searchData?.esearchresult?.count || '0'));
      
      if (pmids.length === 0) {
        setBuscando(false);
        return;
      }
      
      // Etapa 2: efetch para obter detalhes dos artigos
      const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmids.join(',')}&retmode=xml`;
      const fetchRes = await fetch(fetchUrl);
      const xmlText = await fetchRes.text();
      
      // Parse XML simples
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const articles = xmlDoc.querySelectorAll('PubmedArticle');
      
      const artigosProcessados: ArtigoPubMed[] = [];
      
      articles.forEach((article, index) => {
        const pmid = article.querySelector('PMID')?.textContent || '';
        const titulo = article.querySelector('ArticleTitle')?.textContent || 'Sem título';
        
        // Autores
        const authorNodes = article.querySelectorAll('Author');
        const autores: string[] = [];
        authorNodes.forEach(a => {
          const lastName = a.querySelector('LastName')?.textContent || '';
          const initials = a.querySelector('Initials')?.textContent || '';
          if (lastName) autores.push(`${lastName} ${initials}`);
        });
        
        const journal = article.querySelector('Journal Title')?.textContent || 
                        article.querySelector('ISOAbbreviation')?.textContent || 
                        article.querySelector('MedlineTA')?.textContent || 'N/A';
        
        const year = article.querySelector('PubDate Year')?.textContent || 
                     article.querySelector('Year')?.textContent || 'N/A';
        
        const abstractText = article.querySelector('AbstractText')?.textContent || 'Abstract não disponível.';
        
        // DOI
        const articleIds = article.querySelectorAll('ArticleId');
        let doi = '';
        articleIds.forEach(id => {
          if (id.getAttribute('IdType') === 'doi') doi = id.textContent || '';
        });
        
        artigosProcessados.push({
          pmid,
          titulo,
          autores: autores.slice(0, 3).join(', ') + (autores.length > 3 ? ' et al.' : ''),
          journal,
          ano: year,
          abstract: abstractText.substring(0, 800),
          doi,
          url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
          relevancia: index < 2 ? 'alta' : index < 4 ? 'media' : 'baixa',
        });
      });
      
      setArtigos(artigosProcessados);
    } catch (error) {
      console.error('Erro ao buscar PubMed:', error);
      // Fallback com dados simulados em caso de erro de rede
      setArtigos([{
        pmid: 'ERRO',
        titulo: 'Erro ao consultar PubMed',
        autores: 'N/A',
        journal: 'N/A',
        ano: 'N/A',
        abstract: 'Não foi possível conectar à API do PubMed. Verifique sua conexão com a internet.',
        doi: '',
        url: 'https://pubmed.ncbi.nlm.nih.gov/',
        relevancia: 'baixa',
      }]);
    }
    
    setBuscando(false);
  }, []);

  // Filtrar CIDs
  const handleBuscaCID = (valor: string) => {
    setBuscaCID(valor);
    if (valor.length >= 2) {
      const filtrados = CID10_DATABASE.filter(c =>
        c.codigo.toLowerCase().includes(valor.toLowerCase()) ||
        c.descricao.toLowerCase().includes(valor.toLowerCase()) ||
        c.categoria.toLowerCase().includes(valor.toLowerCase())
      );
      setSugestoesCID(filtrados);
    } else {
      setSugestoesCID([]);
    }
  };

  const selecionarCID = (cid: CID10Item) => {
    setCidSelecionado(cid);
    setBuscaCID(`${cid.codigo} - ${cid.descricao}`);
    setSugestoesCID([]);
    buscarPubMed(cid.termosPubMed);
  };

  const salvarArtigo = (artigo: ArtigoPubMed) => {
    if (!artigosSalvos.find(a => a.pmid === artigo.pmid)) {
      setArtigosSalvos(prev => [...prev, artigo]);
    }
  };

  const relevanciaInfo = (r: string) => {
    switch(r) {
      case 'alta': return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', label: 'Alta Relevância' };
      case 'media': return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', label: 'Média Relevância' };
      default: return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Relevante' };
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="Literatura Médica Automatizada (Educacional)" showAIWarning />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">📚</span> Automação da Literatura Médica
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-medium">PubMed API</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sugestões de leitura baseadas no CID-10 — Artigos recentes e relevantes do PubMed em tempo real
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'cid' as const, label: '🏷️ Por CID-10' },
          { id: 'livre' as const, label: '🔍 Busca Livre' },
          { id: 'salvos' as const, label: `📌 Salvos (${artigosSalvos.length})` },
        ].map(tab => (
          <button key={tab.id} onClick={() => setTela(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              tela === tab.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border hover:bg-accent'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Busca por CID-10 */}
      {tela === 'cid' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 border-2 border-green-500/30 rounded-2xl p-6">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              🏷️ Selecione o CID-10 do Diagnóstico
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              O sistema buscará automaticamente os artigos mais recentes e relevantes no PubMed para o diagnóstico selecionado.
            </p>
            <div className="relative">
              <input
                type="text"
                value={buscaCID}
                onChange={e => handleBuscaCID(e.target.value)}
                placeholder="Digite o código CID-10 ou nome da doença (ex: E11, Diabetes, I10, Hipertensão)..."
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
              {sugestoesCID.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-10 max-h-64 overflow-y-auto">
                  {sugestoesCID.map(cid => (
                    <button key={cid.codigo} onClick={() => selecionarCID(cid)}
                      className="w-full text-left px-4 py-3 hover:bg-accent transition border-b border-border/50 last:border-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-primary text-sm">{cid.codigo}</span>
                          <span className="text-sm ml-2">{cid.descricao}</span>
                        </div>
                        <span className="text-xs bg-muted/50 px-2 py-0.5 rounded text-muted-foreground">{cid.categoria}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CIDs Populares */}
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">CIDs mais consultados:</p>
              <div className="flex flex-wrap gap-2">
                {CID10_DATABASE.slice(0, 8).map(cid => (
                  <button key={cid.codigo} onClick={() => selecionarCID(cid)}
                    className="text-xs px-3 py-1.5 rounded-full bg-card border border-border hover:border-primary/30 transition">
                    <span className="font-mono font-bold text-primary">{cid.codigo}</span> {cid.descricao}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CID Selecionado */}
          {cidSelecionado && (
            <div className="bg-card border border-primary/30 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-bold">
                  <span className="font-mono text-primary">{cidSelecionado.codigo}</span> — {cidSelecionado.descricao}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Categoria: {cidSelecionado.categoria} | Termos de busca: {cidSelecionado.termosPubMed.join(', ')}
                </p>
              </div>
              {totalResultados > 0 && (
                <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                  {totalResultados.toLocaleString()} artigos encontrados
                </span>
              )}
            </div>
          )}

          {/* Resultados */}
          {renderArtigos()}
        </div>
      )}

      {/* Busca Livre */}
      {tela === 'livre' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-3">🔍 Busca Livre no PubMed</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={buscaLivre}
                onChange={e => setBuscaLivre(e.target.value)}
                placeholder="Ex: SGLT2 inhibitors heart failure, COVID-19 long term effects..."
                className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none"
                onKeyDown={e => e.key === 'Enter' && buscarPubMed([buscaLivre])}
              />
              <button onClick={() => buscarPubMed([buscaLivre])}
                disabled={!buscaLivre || buscando}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 shadow-lg transition disabled:opacity-50">
                {buscando ? '⏳ Buscando...' : '🔍 Buscar'}
              </button>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="text-xs text-muted-foreground">Sugestões:</span>
              {['SGLT2 inhibitors', 'GLP-1 receptor agonist', 'immunotherapy cancer', 'artificial intelligence diagnosis', 'telemedicine outcomes'].map(s => (
                <button key={s} onClick={() => { setBuscaLivre(s); buscarPubMed([s]); }}
                  className="text-xs px-2 py-1 rounded-full bg-muted/50 hover:bg-muted text-foreground/70 transition">
                  {s}
                </button>
              ))}
            </div>
          </div>
          {renderArtigos()}
        </div>
      )}

      {/* Artigos Salvos */}
      {tela === 'salvos' && (
        <div className="space-y-4">
          {artigosSalvos.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-2xl mb-2">📌</p>
              <p className="text-muted-foreground">Nenhum artigo salvo ainda.</p>
              <p className="text-xs text-muted-foreground mt-1">Busque por CID-10 ou termo livre e salve os artigos relevantes.</p>
            </div>
          ) : (
            artigosSalvos.map(artigo => renderArtigoCard(artigo, false))
          )}
        </div>
      )}

      <EducationalDisclaimer variant="footer" showAIWarning />
    </div>
  );

  function renderArtigos() {
    return (
      <>
        {buscando && (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Consultando PubMed (eutils.ncbi.nlm.nih.gov)...</p>
            <p className="text-xs text-muted-foreground mt-1">Buscando artigos mais recentes e relevantes...</p>
          </div>
        )}

        {!buscando && artigos.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              📄 {artigos.length} Artigos Sugeridos
              <span className="text-xs text-muted-foreground">(ordenados por data de publicação)</span>
            </h3>
            {artigos.map(artigo => renderArtigoCard(artigo, true))}
          </div>
        )}
      </>
    );
  }

  function renderArtigoCard(artigo: ArtigoPubMed, showSave: boolean) {
    const rel = relevanciaInfo(artigo.relevancia);
    const expandido = artigoExpandido === artigo.pmid;
    
    return (
      <div key={artigo.pmid} className={`bg-card border rounded-xl p-5 transition hover:border-primary/30 ${rel.border}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${rel.bg} ${rel.text}`}>{rel.label}</span>
              <span className="text-xs font-mono text-muted-foreground">PMID: {artigo.pmid}</span>
              <span className="text-xs text-muted-foreground">{artigo.ano}</span>
            </div>
            <h4 className="font-medium text-sm leading-relaxed mb-2">{artigo.titulo}</h4>
            <p className="text-xs text-muted-foreground">{artigo.autores}</p>
            <p className="text-xs text-primary/70 mt-1">{artigo.journal}</p>
          </div>
          <div className="flex flex-col gap-2">
            <a href={artigo.url} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30 transition text-center">
              📖 PubMed
            </a>
            {showSave && (
              <button onClick={() => salvarArtigo(artigo)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition text-center ${
                  artigosSalvos.find(a => a.pmid === artigo.pmid)
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}>
                {artigosSalvos.find(a => a.pmid === artigo.pmid) ? '✓ Salvo' : '📌 Salvar'}
              </button>
            )}
          </div>
        </div>
        
        {/* Abstract expandível */}
        <button onClick={() => setArtigoExpandido(expandido ? null : artigo.pmid)}
          className="text-xs text-primary mt-3 hover:underline">
          {expandido ? '▲ Ocultar Abstract' : '▼ Ver Abstract'}
        </button>
        
        {expandido && (
          <div className="mt-3 bg-background/50 rounded-lg p-4 border border-border/50">
            <p className="text-xs text-foreground/70 leading-relaxed">{artigo.abstract}</p>
            {artigo.doi && (
              <p className="text-xs text-muted-foreground mt-2">DOI: {artigo.doi}</p>
            )}
          </div>
        )}
      </div>
    );
  }
}
