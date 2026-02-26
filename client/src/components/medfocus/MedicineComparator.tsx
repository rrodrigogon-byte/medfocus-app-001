import { useState, useCallback } from 'react';
import { trpc } from '../../lib/trpc';

// ============================================================
// COMPARADOR DE MEDICAMENTOS — Dados ANVISA/CMED (2304+ substâncias)
// Fonte: https://dados.anvisa.gov.br/dados/TA_PRECO_MEDICAMENTO.csv
// Atualização diária automática via Cloud Function
// ============================================================

const formatBRL = (v: number | null) => {
  if (v === null || v === undefined) return '—';
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const TARJAS = ['Todas', 'Venda Livre', 'Tarja Vermelha', 'Tarja Preta', 'Receita Amarela'];
const FORMAS = ['Todas', 'Comprimido', 'Cápsula', 'Injetável', 'Solução Oral', 'Tópico', 'Colírio', 'Inalatório', 'Ampola', 'Solução', 'Pó', 'Adesivo', 'Nasal', 'Supositório', 'Outro'];

export default function MedicineComparator() {
  const [busca, setBusca] = useState('');
  const [buscaDebounced, setBuscaDebounced] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [tarjaFiltro, setTarjaFiltro] = useState('Todas');
  const [formaFiltro, setFormaFiltro] = useState('Todas');
  const [soComGenerico, setSoComGenerico] = useState(false);
  const [ordenacao, setOrdenacao] = useState<'name' | 'price' | 'savings'>('savings');
  const [ordemDir, setOrdemDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [selecionado, setSelecionado] = useState<any | null>(null);
  const [pageSize] = useState(30);

  // Debounce search
  const [debounceTimer, setDebounceTimer] = useState<any>(null);
  const handleBuscaChange = useCallback((value: string) => {
    setBusca(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      setBuscaDebounced(value);
      setPage(1);
    }, 400);
    setDebounceTimer(timer);
  }, [debounceTimer]);

  // tRPC queries
  const statsQuery = trpc.cmed.stats.useQuery();
  const categoriesQuery = trpc.cmed.categories.useQuery();
  const searchQuery = trpc.cmed.search.useQuery({
    query: buscaDebounced || undefined,
    category: categoriaFiltro !== 'Todas' ? categoriaFiltro : undefined,
    tarja: tarjaFiltro !== 'Todas' ? tarjaFiltro : undefined,
    forma: formaFiltro !== 'Todas' ? formaFiltro : undefined,
    onlyWithGenerics: soComGenerico || undefined,
    page,
    pageSize,
    sortBy: ordenacao,
    sortOrder: ordemDir,
  });
  const topSavingsQuery = trpc.cmed.topSavings.useQuery({ limit: 10 });

  const stats = statsQuery.data;
  const categories = categoriesQuery.data || [];
  const searchResult = searchQuery.data;
  const medicines = searchResult?.medicines || [];
  const pagination = searchResult?.pagination;
  const topSavings = topSavingsQuery.data || [];

  // ============================================================
  // DETAIL VIEW
  // ============================================================
  if (selecionado) {
    const m = selecionado;
    const refPrice = m.referencia?.preco;
    const cheapestGeneric = m.genericos?.find((g: any) => g.preco !== null);
    const savings = refPrice && cheapestGeneric?.preco
      ? ((refPrice - cheapestGeneric.preco) / refPrice * 100).toFixed(1)
      : null;

    return (
      <div style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
        <button
          onClick={() => setSelecionado(null)}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            padding: '8px 16px',
            color: 'inherit',
            cursor: 'pointer',
            marginBottom: 24,
            fontSize: 14,
          }}
        >
          ← Voltar à lista
        </button>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{m.substancia}</h2>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 6,
              background: 'rgba(59,130,246,0.15)', color: '#3b82f6'
            }}>
              {m.classeNome || m.classeFull}
            </span>
            <span style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 6,
              background: m.tarja?.includes('Preta') ? 'rgba(239,68,68,0.15)' :
                         m.tarja?.includes('Vermelha') ? 'rgba(245,158,11,0.15)' :
                         'rgba(16,185,129,0.15)',
              color: m.tarja?.includes('Preta') ? '#ef4444' :
                     m.tarja?.includes('Vermelha') ? '#f59e0b' : '#10b981'
            }}>
              {m.tarja}
            </span>
            <span style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 6,
              background: 'rgba(168,85,247,0.15)', color: '#a855f7'
            }}>
              {m.formaFarmaceutica}
            </span>
          </div>
        </div>

        {/* Reference Product */}
        <div style={{
          background: 'rgba(59,130,246,0.08)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 12, padding: 20, marginBottom: 16
        }}>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Medicamento de Referência
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{m.referencia.nome}</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>{m.referencia.laboratorio}</div>
              <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>{m.referencia.apresentacao}</div>
              <div style={{ fontSize: 11, opacity: 0.4, marginTop: 2 }}>
                Tipo: {m.referencia.tipo} | EAN: {m.referencia.ean || '—'} | Reg: {m.referencia.registro || '—'}
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#3b82f6' }}>
              {formatBRL(refPrice)}
            </div>
          </div>
        </div>

        {/* Savings banner */}
        {savings && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 12, padding: 16, marginBottom: 16, textAlign: 'center'
          }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#10b981' }}>{savings}%</div>
            <div style={{ fontSize: 14, opacity: 0.8 }}>
              de economia com o genérico mais barato
              {refPrice && cheapestGeneric?.preco && (
                <span style={{ color: '#10b981', fontWeight: 700 }}>
                  {' '}(economize {formatBRL(refPrice - cheapestGeneric.preco)})
                </span>
              )}
            </div>
          </div>
        )}

        {/* Generics */}
        {m.genericos && m.genericos.length > 0 && (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#10b981' }}>
              Genéricos ({m.genericos.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {m.genericos.map((g: any, i: number) => {
                const econ = refPrice && g.preco ? ((refPrice - g.preco) / refPrice * 100) : 0;
                return (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)',
                    borderRadius: 10, padding: '12px 16px', flexWrap: 'wrap', gap: 8
                  }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {g.nome} <span style={{ fontSize: 12, opacity: 0.6 }}>({g.laboratorio})</span>
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.5 }}>{g.apresentacao}</div>
                      {econ > 0 && (
                        <div style={{ fontSize: 12, color: '#10b981' }}>
                          Economia de {econ.toFixed(1)}% vs referência
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#10b981' }}>
                      {formatBRL(g.preco)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Similars */}
        {m.similares && m.similares.length > 0 && (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#f59e0b' }}>
              Similares ({m.similares.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {m.similares.map((s: any, i: number) => {
                const econ = refPrice && s.preco ? ((refPrice - s.preco) / refPrice * 100) : 0;
                return (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)',
                    borderRadius: 10, padding: '12px 16px', flexWrap: 'wrap', gap: 8
                  }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {s.nome} <span style={{ fontSize: 12, opacity: 0.6 }}>({s.laboratorio})</span>
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.5 }}>{s.apresentacao}</div>
                      {econ > 0 && (
                        <div style={{ fontSize: 12, color: '#f59e0b' }}>
                          {econ > 0 ? `Economia de ${econ.toFixed(1)}%` : `${Math.abs(econ).toFixed(1)}% mais caro`}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#f59e0b' }}>
                      {formatBRL(s.preco)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {m.genericos?.length === 0 && m.similares?.length === 0 && (
          <div style={{ textAlign: 'center', padding: 32, opacity: 0.5 }}>
            Nenhum genérico ou similar registrado na ANVISA para esta substância.
          </div>
        )}

        {/* Where to Buy — Inline pharmacy info */}
        <div style={{
          background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: 12, padding: 20, marginBottom: 16, marginTop: 16
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#8b5cf6' }}>
            Onde Comprar
          </h3>
          <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 12 }}>
            Pesquise o preço real nas principais farmácias do Brasil:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
            {[
              { nome: 'Drogasil', cor: '#e53e3e', tel: '0800 770 0012', url: `https://www.drogasil.com.br/search?w=${encodeURIComponent(m.substancia)}` },
              { nome: 'Droga Raia', cor: '#3182ce', tel: '0800 770 0012', url: `https://www.drogaraia.com.br/search?w=${encodeURIComponent(m.substancia)}` },
              { nome: 'Pague Menos', cor: '#38a169', tel: '0800 275 1313', url: `https://www.paguemenos.com.br/busca?q=${encodeURIComponent(m.substancia)}` },
              { nome: 'Ultrafarma', cor: '#dd6b20', tel: '0800 771 1137', url: `https://www.ultrafarma.com.br/busca?q=${encodeURIComponent(m.substancia)}` },
              { nome: 'Farmácia Popular', cor: '#319795', tel: '136 (Disque Saúde)', url: 'https://www.gov.br/saude/pt-br/composicao/sctie/daf/programa-farmacia-popular' },
              { nome: 'Consulta Remédios', cor: '#805ad5', tel: '', url: `https://consultaremedios.com.br/busca?q=${encodeURIComponent(m.substancia)}` },
            ].map((f, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, padding: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: f.cor, flexShrink: 0 }} />
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{f.nome}</span>
                </div>
                {f.tel && (
                  <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>
                    📞 {f.tel}
                  </div>
                )}
                <a href={f.url} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-block', fontSize: 11, color: '#8b5cf6',
                  textDecoration: 'none', marginTop: 2,
                }}>
                  Buscar preço →
                </a>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, opacity: 0.5, marginTop: 12 }}>
            📱 <strong>WhatsApp Farmácia Popular:</strong> (61) 99425-0000 | 📞 <strong>Disque Saúde:</strong> 136
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: 12, padding: 16, fontSize: 12, opacity: 0.8, marginTop: 16
        }}>
          <strong>Aviso importante:</strong> Preços são PMC (Preço Máximo ao Consumidor) com ICMS 18%,
          conforme tabela oficial CMED/ANVISA. Preços reais podem variar conforme farmácia, região e promoções.
          Consulte sempre um médico ou farmacêutico antes de substituir medicamentos.
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN LIST VIEW
  // ============================================================
  return (
    <div style={{ padding: '24px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, margin: 0, fontWeight: 800 }}>
          Comparador de Medicamentos
        </h1>
        <p style={{ opacity: 0.7, fontSize: 14, marginTop: 6 }}>
          Base oficial ANVISA/CMED com {stats?.totalMedicines?.toLocaleString() || '2.300+'} substâncias ativas,
          preços de referência, genéricos e similares
        </p>
        {stats?.lastUpdate && (
          <p style={{ opacity: 0.4, fontSize: 12, marginTop: 4 }}>
            Última atualização: {stats.lastUpdate} | Fonte: {stats.source}
          </p>
        )}
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 10, marginBottom: 20
      }}>
        {[
          { value: stats?.totalMedicines?.toLocaleString() || '—', label: 'Substâncias', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
          { value: stats?.totalWithGenerics?.toLocaleString() || '—', label: 'Com Genéricos', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
          { value: stats?.totalWithSimilars?.toLocaleString() || '—', label: 'Com Similares', color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
          { value: stats?.totalCategories?.toLocaleString() || '—', label: 'Classes Terapêuticas', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
          { value: stats?.avgPrice ? formatBRL(stats.avgPrice) : '—', label: 'Preço Médio', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
        ].map((s, i) => (
          <div key={i} style={{
            background: s.bg, borderRadius: 10, padding: '14px 12px', textAlign: 'center',
            border: `1px solid ${s.color}22`
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Top Savings Banner */}
      {topSavings.length > 0 && !buscaDebounced && categoriaFiltro === 'Todas' && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(59,130,246,0.08))',
          borderRadius: 12, padding: 16, marginBottom: 20,
          border: '1px solid rgba(16,185,129,0.2)'
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
            Maiores Economias com Genéricos
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {topSavings.slice(0, 8).map((m: any, i: number) => (
              <div key={i} onClick={() => setSelecionado(m)} style={{
                minWidth: 140, background: 'rgba(0,0,0,0.2)', borderRadius: 8,
                padding: '10px 12px', cursor: 'pointer', flexShrink: 0,
                border: '1px solid rgba(16,185,129,0.15)',
                transition: 'all 0.2s'
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>
                  {m.savingsPercent}%
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>
                  {m.substancia.length > 20 ? m.substancia.substring(0, 20) + '...' : m.substancia}
                </div>
                <div style={{ fontSize: 10, opacity: 0.5 }}>{m.referencia?.nome}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          value={busca}
          onChange={(e) => handleBuscaChange(e.target.value)}
          placeholder="Buscar por substância, marca, laboratório ou classe terapêutica..."
          style={{
            width: '100%', padding: '12px 16px', borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.05)', color: 'inherit',
            fontSize: 15, outline: 'none', boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <select
          value={categoriaFiltro}
          onChange={(e) => { setCategoriaFiltro(e.target.value); setPage(1); }}
          style={{
            padding: '8px 12px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.15)',
            background: '#1a1a2e', color: 'inherit', fontSize: 13,
            maxWidth: 280
          }}
        >
          <option value="Todas">Todas as Classes</option>
          {categories.map((c: string) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={tarjaFiltro}
          onChange={(e) => { setTarjaFiltro(e.target.value); setPage(1); }}
          style={{
            padding: '8px 12px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.15)',
            background: '#1a1a2e', color: 'inherit', fontSize: 13
          }}
        >
          {TARJAS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select
          value={formaFiltro}
          onChange={(e) => { setFormaFiltro(e.target.value); setPage(1); }}
          style={{
            padding: '8px 12px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.15)',
            background: '#1a1a2e', color: 'inherit', fontSize: 13
          }}
        >
          {FORMAS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Sort & Filter toggles */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {([
            { key: 'savings' as const, label: '% Economia', dir: 'desc' as const },
            { key: 'name' as const, label: 'A-Z', dir: 'asc' as const },
            { key: 'price' as const, label: 'Menor Preço', dir: 'asc' as const },
          ]).map(o => (
            <button
              key={o.key}
              onClick={() => { setOrdenacao(o.key); setOrdemDir(o.dir); setPage(1); }}
              style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 12,
                border: ordenacao === o.key ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.12)',
                background: ordenacao === o.key ? 'rgba(16,185,129,0.2)' : 'transparent',
                color: ordenacao === o.key ? '#10b981' : 'inherit', cursor: 'pointer'
              }}
            >
              {o.label}
            </button>
          ))}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', opacity: 0.8 }}>
          <input
            type="checkbox"
            checked={soComGenerico}
            onChange={(e) => { setSoComGenerico(e.target.checked); setPage(1); }}
            style={{ accentColor: '#10b981' }}
          />
          Somente com genéricos
        </label>

        <span style={{ fontSize: 12, opacity: 0.4, marginLeft: 'auto' }}>
          {pagination ? `${pagination.total.toLocaleString()} resultado(s)` : '...'}
        </span>
      </div>

      {/* Loading */}
      {searchQuery.isLoading && (
        <div style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>Carregando...</div>
        </div>
      )}

      {/* Medicine List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {medicines.map((m: any) => {
          const refPrice = m.referencia?.preco;
          const cheapestGeneric = m.genericos?.find((g: any) => g.preco !== null);
          const economia = refPrice && cheapestGeneric?.preco
            ? ((refPrice - cheapestGeneric.preco) / refPrice * 100)
            : 0;
          const economiaValor = refPrice && cheapestGeneric?.preco
            ? refPrice - cheapestGeneric.preco
            : 0;

          return (
            <div
              key={m.id}
              onClick={() => setSelecionado(m)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '14px 18px', cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(16,185,129,0.3)';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(16,185,129,0.04)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{m.substancia}</span>
                  <span style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 4,
                    background: 'rgba(59,130,246,0.15)', color: '#3b82f6'
                  }}>
                    {m.referencia?.nome}
                  </span>
                  {m.tarja?.includes('Venda Livre') && (
                    <span style={{
                      fontSize: 9, padding: '2px 6px', borderRadius: 4,
                      background: 'rgba(16,185,129,0.15)', color: '#10b981'
                    }}>
                      SEM RECEITA
                    </span>
                  )}
                  {m.genericos?.length > 0 && (
                    <span style={{
                      fontSize: 9, padding: '2px 6px', borderRadius: 4,
                      background: 'rgba(168,85,247,0.15)', color: '#a855f7'
                    }}>
                      {m.genericos.length} genérico{m.genericos.length > 1 ? 's' : ''}
                    </span>
                  )}
                  {m.similares?.length > 0 && (
                    <span style={{
                      fontSize: 9, padding: '2px 6px', borderRadius: 4,
                      background: 'rgba(245,158,11,0.15)', color: '#f59e0b'
                    }}>
                      {m.similares.length} similar{m.similares.length > 1 ? 'es' : ''}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, opacity: 0.5, marginTop: 3 }}>
                  {m.classeNome || m.classeFull} — {m.formaFarmaceutica}
                </div>
                <div style={{ display: 'flex', gap: 14, marginTop: 6, fontSize: 12 }}>
                  <span>
                    Ref: <span style={{ color: refPrice ? '#3b82f6' : undefined }}>{formatBRL(refPrice)}</span>
                  </span>
                  {cheapestGeneric && (
                    <span>
                      Genérico: <strong style={{ color: '#10b981' }}>{formatBRL(cheapestGeneric.preco)}</strong>
                    </span>
                  )}
                  <span style={{ opacity: 0.4 }}>{m.totalApresentacoes} apresentações</span>
                </div>
              </div>

              {economia > 0 ? (
                <div style={{ textAlign: 'center', minWidth: 80 }}>
                  <div style={{
                    fontSize: 24, fontWeight: 800, lineHeight: 1,
                    color: economia > 60 ? '#10b981' : economia > 30 ? '#3b82f6' : '#f59e0b'
                  }}>
                    {economia.toFixed(0)}%
                  </div>
                  <div style={{ fontSize: 10, opacity: 0.5 }}>economia</div>
                  <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600, marginTop: 2 }}>
                    -{formatBRL(economiaValor)}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', minWidth: 80, opacity: 0.3, fontSize: 12 }}>
                  {m.genericos?.length === 0 ? 'Sem genérico' : '—'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {!searchQuery.isLoading && medicines.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
          <p>Nenhum medicamento encontrado com os filtros selecionados.</p>
          <p style={{ fontSize: 13 }}>Tente buscar por outro nome ou altere os filtros.</p>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: 8, marginTop: 24, flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            style={{
              padding: '8px 16px', borderRadius: 8, cursor: page <= 1 ? 'default' : 'pointer',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)', color: 'inherit',
              opacity: page <= 1 ? 0.3 : 1, fontSize: 13
            }}
          >
            ← Anterior
          </button>

          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: Math.min(7, pagination.totalPages) }, (_, i) => {
              let pageNum: number;
              if (pagination.totalPages <= 7) {
                pageNum = i + 1;
              } else if (page <= 4) {
                pageNum = i + 1;
              } else if (page >= pagination.totalPages - 3) {
                pageNum = pagination.totalPages - 6 + i;
              } else {
                pageNum = page - 3 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    border: pageNum === page ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                    background: pageNum === page ? 'rgba(16,185,129,0.2)' : 'transparent',
                    color: pageNum === page ? '#10b981' : 'inherit',
                    cursor: 'pointer', fontSize: 13, fontWeight: pageNum === page ? 700 : 400
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
            disabled={page >= pagination.totalPages}
            style={{
              padding: '8px 16px', borderRadius: 8,
              cursor: page >= pagination.totalPages ? 'default' : 'pointer',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)', color: 'inherit',
              opacity: page >= pagination.totalPages ? 0.3 : 1, fontSize: 13
            }}
          >
            Próxima →
          </button>

          <span style={{ fontSize: 12, opacity: 0.4, marginLeft: 8 }}>
            Página {page} de {pagination.totalPages}
          </span>
        </div>
      )}

      {/* Footer disclaimer */}
      <div style={{
        marginTop: 28, padding: 14,
        background: 'rgba(245,158,11,0.06)', borderRadius: 12,
        fontSize: 11, opacity: 0.7,
        border: '1px solid rgba(245,158,11,0.12)'
      }}>
        <strong>Aviso legal:</strong> Este comparador utiliza dados oficiais da tabela CMED/ANVISA
        (Câmara de Regulação do Mercado de Medicamentos). Os preços são PMC (Preço Máximo ao Consumidor)
        com ICMS 18% e são atualizados diariamente. Preços reais podem variar conforme farmácia, região
        e promoções. Nunca substitua um medicamento sem orientação do seu médico ou farmacêutico.
        Medicamentos genéricos são aprovados pela ANVISA com testes de bioequivalência que garantem
        a mesma eficácia do medicamento de referência.
      </div>
    </div>
  );
}
