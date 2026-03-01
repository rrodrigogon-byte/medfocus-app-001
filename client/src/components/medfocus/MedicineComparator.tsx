import { useState, useCallback, useMemo } from 'react';
import { trpc } from '../../lib/trpc';
import EducationalDisclaimer from './EducationalDisclaimer';

// ============================================================
// COMPARADOR DE MEDICAMENTOS — Dados ANVISA/CMED (2304+ substâncias)
// Fonte: https://dados.anvisa.gov.br/dados/TA_PRECO_MEDICAMENTO.csv
// Atualização diária automática via Cloud Function
// ============================================================

const formatBRL = (v: number | null | undefined) => {
  if (v === null || v === undefined || isNaN(v)) return '—';
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

/** Extrai a quantidade de unidades da string de apresentação (ex: "X 30" → 30) */
const extractQty = (apresentacao: string): number => {
  const match = apresentacao?.match(/X\s*(\d+)\s*$/i);
  return match ? parseInt(match[1], 10) : 1;
};

/** Calcula preço por unidade */
const pricePerUnit = (preco: number | null, apresentacao: string): number | null => {
  if (!preco) return null;
  const qty = extractQty(apresentacao);
  return qty > 0 ? preco / qty : preco;
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
  const [showAllRef, setShowAllRef] = useState(false);
  const [showAllGen, setShowAllGen] = useState(false);
  const [showAllSim, setShowAllSim] = useState(false);

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
  // DETAIL VIEW — Corrigido com preço por unidade e validação
  // ============================================================
  if (selecionado) {
    const m = selecionado;

    // Collect ALL products with prices for correct statistics
    const allProducts: { nome: string; lab: string; preco: number; apresentacao: string; tipo: string; precoUnit: number; qty: number }[] = [];

    // Reference products
    if (m.referencia?.preco) {
      const qty = extractQty(m.referencia.apresentacao);
      allProducts.push({
        nome: m.referencia.nome,
        lab: m.referencia.laboratorio,
        preco: m.referencia.preco,
        apresentacao: m.referencia.apresentacao,
        tipo: 'Referência',
        precoUnit: m.referencia.preco / (qty || 1),
        qty,
      });
    }
    // Generics
    (m.genericos || []).forEach((g: any) => {
      if (g.preco) {
        const qty = extractQty(g.apresentacao);
        allProducts.push({
          nome: g.nome,
          lab: g.laboratorio,
          preco: g.preco,
          apresentacao: g.apresentacao,
          tipo: 'Genérico',
          precoUnit: g.preco / (qty || 1),
          qty,
        });
      }
    });
    // Similars
    (m.similares || []).forEach((s: any) => {
      if (s.preco) {
        const qty = extractQty(s.apresentacao);
        allProducts.push({
          nome: s.nome,
          lab: s.laboratorio,
          preco: s.preco,
          apresentacao: s.apresentacao,
          tipo: 'Similar',
          precoUnit: s.preco / (qty || 1),
          qty,
        });
      }
    });

    // Calculate CORRECT stats using price per unit
    const unitPrices = allProducts.map(p => p.precoUnit).filter(p => p > 0);
    const minUnitPrice = unitPrices.length > 0 ? Math.min(...unitPrices) : null;
    const maxUnitPrice = unitPrices.length > 0 ? Math.max(...unitPrices) : null;
    const refUnitPrice = m.referencia?.preco ? m.referencia.preco / (extractQty(m.referencia.apresentacao) || 1) : null;

    // Correct savings calculation: compare reference unit price vs cheapest generic unit price
    const genericUnitPrices = allProducts.filter(p => p.tipo === 'Genérico').map(p => p.precoUnit);
    const cheapestGenericUnit = genericUnitPrices.length > 0 ? Math.min(...genericUnitPrices) : null;
    const savingsPercent = refUnitPrice && cheapestGenericUnit && refUnitPrice > cheapestGenericUnit
      ? ((refUnitPrice - cheapestGenericUnit) / refUnitPrice * 100)
      : null;
    // Cap savings at 99.9% — 100% would mean the generic is free, which is impossible
    const validSavings = savingsPercent !== null ? Math.min(savingsPercent, 99.9) : null;

    const totalProdutos = (m.genericos?.length || 0) + (m.similares?.length || 0) + 1;

    // Group generics by presentation for better comparison
    const refApresentacao = m.referencia?.apresentacao || '';
    const refQty = extractQty(refApresentacao);

    return (
      <div style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
        <EducationalDisclaimer variant="banner" moduleName="Comparador de Medicamentos" />
        <button
          onClick={() => { setSelecionado(null); setShowAllRef(false); setShowAllGen(false); setShowAllSim(false); }}
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
          ← Voltar
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
              background: m.tarja?.includes('Preta') || m.tarja?.includes('Especial') ? 'rgba(239,68,68,0.15)' :
                         m.tarja?.includes('Vermelha') || m.tarja?.includes('Simples') ? 'rgba(245,158,11,0.15)' :
                         'rgba(16,185,129,0.15)',
              color: m.tarja?.includes('Preta') || m.tarja?.includes('Especial') ? '#ef4444' :
                     m.tarja?.includes('Vermelha') || m.tarja?.includes('Simples') ? '#f59e0b' : '#10b981'
            }}>
              {m.tarja}
            </span>
            {m.formaFarmaceutica && m.formaFarmaceutica !== 'Outro' && (
              <span style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 6,
                background: 'rgba(168,85,247,0.15)', color: '#a855f7'
              }}>
                {m.formaFarmaceutica}
              </span>
            )}
          </div>
        </div>

        {/* Summary Stats — CORRECTED */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 10, marginBottom: 20
        }}>
          <div style={{
            background: 'rgba(16,185,129,0.08)', borderRadius: 10, padding: '14px 12px', textAlign: 'center',
            border: '1px solid rgba(16,185,129,0.15)'
          }}>
            <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>Menor preço/un.</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>
              {minUnitPrice ? formatBRL(minUnitPrice) : '—'}
            </div>
          </div>
          <div style={{
            background: 'rgba(239,68,68,0.08)', borderRadius: 10, padding: '14px 12px', textAlign: 'center',
            border: '1px solid rgba(239,68,68,0.15)'
          }}>
            <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>Maior preço/un.</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#ef4444' }}>
              {maxUnitPrice ? formatBRL(maxUnitPrice) : '—'}
            </div>
          </div>
          <div style={{
            background: 'rgba(59,130,246,0.08)', borderRadius: 10, padding: '14px 12px', textAlign: 'center',
            border: '1px solid rgba(59,130,246,0.15)'
          }}>
            <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>Total de produtos</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#3b82f6' }}>{totalProdutos}</div>
          </div>
          <div style={{
            background: validSavings ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
            borderRadius: 10, padding: '14px 12px', textAlign: 'center',
            border: validSavings ? '1px solid rgba(16,185,129,0.15)' : '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>Economia c/ genérico</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: validSavings ? '#10b981' : 'inherit', opacity: validSavings ? 1 : 0.3 }}>
              {validSavings ? `${validSavings.toFixed(1)}%` : '—'}
            </div>
          </div>
        </div>

        {/* Info about price comparison */}
        <div style={{
          background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)',
          borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 11, color: 'rgba(255,255,255,0.6)'
        }}>
          Os preços acima são calculados por <strong>unidade</strong> (comprimido/cápsula/ampola) para permitir comparação justa entre apresentações de diferentes quantidades. Preços PMC (Preço Máximo ao Consumidor) com ICMS 18%, conforme tabela CMED/ANVISA.
        </div>

        {/* Reference Product */}
        <div style={{
          background: 'rgba(59,130,246,0.08)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 12, padding: 20, marginBottom: 16
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 12, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1 }}>
              Medicamento de Referência ({m.referencia?.apresentacoes || 1} apresentações)
            </div>
            <div style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(59,130,246,0.2)', color: '#3b82f6' }}>
              Ref.
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{m.referencia?.nome}</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>{m.referencia?.laboratorio}</div>
              <div style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>{m.referencia?.apresentacao}</div>
              <div style={{ fontSize: 11, opacity: 0.4, marginTop: 2 }}>
                EAN: {m.referencia?.ean || '—'} | Reg: {m.referencia?.registro || '—'}
              </div>
              {refUnitPrice && refQty > 1 && (
                <div style={{ fontSize: 11, color: '#3b82f6', marginTop: 4 }}>
                  {formatBRL(refUnitPrice)}/unidade ({refQty} un.)
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#3b82f6' }}>
                {formatBRL(m.referencia?.preco)}
              </div>
              <div style={{ fontSize: 11, opacity: 0.5 }}>PMC c/ ICMS 18%</div>
              {m.referencia?.pf && (
                <div style={{ fontSize: 11, opacity: 0.4 }}>PF: {formatBRL(m.referencia.pf)}</div>
              )}
            </div>
          </div>
        </div>

        {/* Savings banner — CORRECTED */}
        {validSavings && validSavings > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 12, padding: 16, marginBottom: 16, textAlign: 'center'
          }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#10b981' }}>{validSavings.toFixed(1)}%</div>
            <div style={{ fontSize: 14, opacity: 0.8 }}>
              de economia com o genérico mais barato (por unidade)
              {refUnitPrice && cheapestGenericUnit && (
                <span style={{ color: '#10b981', fontWeight: 700 }}>
                  {' '}(economize {formatBRL(refUnitPrice - cheapestGenericUnit)}/un.)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Summary Cards: Referência, Genéricos, Similares */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          <div style={{
            background: 'rgba(59,130,246,0.08)', borderRadius: 10, padding: 14, textAlign: 'center',
            border: '1px solid rgba(59,130,246,0.15)'
          }}>
            <div style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600 }}>Referência</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>1</div>
            <div style={{ fontSize: 11, opacity: 0.5 }}>{formatBRL(m.referencia?.preco)}</div>
          </div>
          <div style={{
            background: 'rgba(16,185,129,0.08)', borderRadius: 10, padding: 14, textAlign: 'center',
            border: '1px solid rgba(16,185,129,0.15)'
          }}>
            <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Genéricos</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{m.genericos?.length || 0}</div>
            <div style={{ fontSize: 11, opacity: 0.5 }}>
              {m.genericos?.length > 0 ? `A partir de ${formatBRL(Math.min(...(m.genericos || []).filter((g: any) => g.preco).map((g: any) => g.preco)))}` : 'Nenhum'}
            </div>
          </div>
          <div style={{
            background: 'rgba(168,85,247,0.08)', borderRadius: 10, padding: 14, textAlign: 'center',
            border: '1px solid rgba(168,85,247,0.15)'
          }}>
            <div style={{ fontSize: 12, color: '#a855f7', fontWeight: 600 }}>Similares</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{m.similares?.length || 0}</div>
            <div style={{ fontSize: 11, opacity: 0.5 }}>
              {m.similares?.length > 0 ? `A partir de ${formatBRL(Math.min(...(m.similares || []).filter((s: any) => s.preco).map((s: any) => s.preco)))}` : 'Nenhum'}
            </div>
          </div>
        </div>

        {/* Generics List */}
        {m.genericos && m.genericos.length > 0 && (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#10b981' }}>
              Genéricos ({m.genericos.length} produtos)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {(showAllGen ? m.genericos : m.genericos.slice(0, 5)).map((g: any, i: number) => {
                const gQty = extractQty(g.apresentacao);
                const gUnit = g.preco ? g.preco / (gQty || 1) : null;
                const econ = refUnitPrice && gUnit ? ((refUnitPrice - gUnit) / refUnitPrice * 100) : 0;
                const validEcon = Math.min(econ, 99.9);
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
                      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                        {gUnit && gQty > 1 && (
                          <span style={{ fontSize: 11, color: '#10b981' }}>
                            {formatBRL(gUnit)}/un. ({gQty} un.)
                          </span>
                        )}
                        {validEcon > 0 && (
                          <span style={{ fontSize: 11, color: '#10b981' }}>
                            {validEcon.toFixed(1)}% economia vs ref.
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#10b981' }}>
                        {formatBRL(g.preco)}
                      </div>
                      <div style={{ fontSize: 10, opacity: 0.4 }}>PMC</div>
                    </div>
                  </div>
                );
              })}
              {m.genericos.length > 5 && (
                <button
                  onClick={() => setShowAllGen(!showAllGen)}
                  style={{
                    padding: '8px 16px', borderRadius: 8, fontSize: 12,
                    border: '1px solid rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.05)',
                    color: '#10b981', cursor: 'pointer', textAlign: 'center'
                  }}
                >
                  {showAllGen ? '▲ Mostrar menos' : `▼ + ${m.genericos.length - 5} mais apresentações`}
                </button>
              )}
            </div>
          </>
        )}

        {/* Similars List */}
        {m.similares && m.similares.length > 0 && (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#a855f7' }}>
              Similares ({m.similares.length} produtos)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {(showAllSim ? m.similares : m.similares.slice(0, 5)).map((s: any, i: number) => {
                const sQty = extractQty(s.apresentacao);
                const sUnit = s.preco ? s.preco / (sQty || 1) : null;
                const econ = refUnitPrice && sUnit ? ((refUnitPrice - sUnit) / refUnitPrice * 100) : 0;
                const validEcon = Math.min(econ, 99.9);
                return (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)',
                    borderRadius: 10, padding: '12px 16px', flexWrap: 'wrap', gap: 8
                  }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {s.nome} <span style={{ fontSize: 12, opacity: 0.6 }}>({s.laboratorio})</span>
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.5 }}>{s.apresentacao}</div>
                      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                        {sUnit && sQty > 1 && (
                          <span style={{ fontSize: 11, color: '#a855f7' }}>
                            {formatBRL(sUnit)}/un. ({sQty} un.)
                          </span>
                        )}
                        {validEcon > 0 && (
                          <span style={{ fontSize: 11, color: '#a855f7' }}>
                            {validEcon.toFixed(1)}% economia vs ref.
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#a855f7' }}>
                        {formatBRL(s.preco)}
                      </div>
                      <div style={{ fontSize: 10, opacity: 0.4 }}>PMC</div>
                    </div>
                  </div>
                );
              })}
              {m.similares.length > 5 && (
                <button
                  onClick={() => setShowAllSim(!showAllSim)}
                  style={{
                    padding: '8px 16px', borderRadius: 8, fontSize: 12,
                    border: '1px solid rgba(168,85,247,0.2)', background: 'rgba(168,85,247,0.05)',
                    color: '#a855f7', cursor: 'pointer', textAlign: 'center'
                  }}
                >
                  {showAllSim ? '▲ Mostrar menos' : `▼ + ${m.similares.length - 5} mais apresentações`}
                </button>
              )}
            </div>
          </>
        )}

        {m.genericos?.length === 0 && m.similares?.length === 0 && (
          <div style={{ textAlign: 'center', padding: 32, opacity: 0.5 }}>
            Nenhum genérico ou similar registrado na ANVISA para esta substância.
          </div>
        )}

        {/* Where to Buy */}
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
                    Tel: {f.tel}
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
        </div>

        {/* Disclaimer */}
        <div style={{
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: 12, padding: 16, fontSize: 12, opacity: 0.8, marginTop: 16
        }}>
          <strong>Aviso importante:</strong> Preços são PMC (Preço Máximo ao Consumidor) com ICMS 18%,
          conforme tabela oficial CMED/ANVISA. Preços reais podem variar conforme farmácia, região e promoções.
          A comparação de economia é feita por <strong>preço unitário</strong> (por comprimido/cápsula/ampola)
          para garantir uma comparação justa entre apresentações de diferentes quantidades.
          Consulte sempre um médico ou farmacêutico antes de substituir medicamentos.
          Medicamentos genéricos são aprovados pela ANVISA com testes de bioequivalência.
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
                  {Math.min(m.savingsPercent, 99.9).toFixed(1)}%
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
          const refQ = extractQty(m.referencia?.apresentacao || '');
          const refUnit = refPrice ? refPrice / (refQ || 1) : null;
          const cheapestGeneric = m.genericos?.find((g: any) => g.preco !== null);
          const cheapGenUnit = cheapestGeneric?.preco ? cheapestGeneric.preco / (extractQty(cheapestGeneric.apresentacao) || 1) : null;
          const economia = refUnit && cheapGenUnit
            ? Math.min(((refUnit - cheapGenUnit) / refUnit * 100), 99.9)
            : 0;
          const economiaValor = refUnit && cheapGenUnit
            ? refUnit - cheapGenUnit
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
                  {m.classeNome || m.classeFull}
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
                  <div style={{ fontSize: 10, opacity: 0.5 }}>economia/un.</div>
                  <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600, marginTop: 2 }}>
                    -{formatBRL(economiaValor)}/un.
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
        e promoções. A comparação de economia é calculada por <strong>preço unitário</strong> para
        garantir comparação justa entre apresentações de diferentes quantidades.
        Nunca substitua um medicamento sem orientação do seu médico ou farmacêutico.
        Medicamentos genéricos são aprovados pela ANVISA com testes de bioequivalência que garantem
        a mesma eficácia do medicamento de referência.
      </div>
    </div>
  );
}
