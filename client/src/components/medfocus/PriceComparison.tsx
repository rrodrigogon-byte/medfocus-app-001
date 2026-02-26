/**
 * Comparador de Preços de Farmácias — Busque preços em farmácias online
 * Links diretos para as principais redes de farmácias do Brasil
 */
import { useState } from 'react';

const FARMACIAS = [
  { nome: 'Drogasil', url: 'https://www.drogasil.com.br/search?w=', cor: '#e11d48', logo: '💊' },
  { nome: 'Droga Raia', url: 'https://www.drogaraia.com.br/search?w=', cor: '#2563eb', logo: '💊' },
  { nome: 'Pague Menos', url: 'https://www.paguemenos.com.br/busca?q=', cor: '#16a34a', logo: '💊' },
  { nome: 'Drogaria São Paulo', url: 'https://www.drogariasaopaulo.com.br/search?w=', cor: '#dc2626', logo: '💊' },
  { nome: 'Panvel', url: 'https://www.panvel.com/panvel/buscarProduto.do?termoPesquisa=', cor: '#0d9488', logo: '💊' },
  { nome: 'Ultrafarma', url: 'https://www.ultrafarma.com.br/busca?q=', cor: '#7c3aed', logo: '💊' },
  { nome: 'Farmácia Popular', url: 'https://www.gov.br/saude/pt-br/composicao/sctie/daf/programa-farmacia-popular', cor: '#059669', logo: '🏥' },
];

const PROGRAMAS_DESCONTO = [
  {
    nome: 'Farmácia Popular do Brasil',
    desc: 'Medicamentos gratuitos ou com até 90% de desconto pelo SUS',
    medicamentos: 'Hipertensão, diabetes, asma, anticoncepcionais, osteoporose, Parkinson, glaucoma, rinite',
    como: 'Apresente receita médica e documento com CPF em qualquer farmácia credenciada',
    icone: '🏥',
    url: 'https://www.gov.br/saude/pt-br/composicao/sctie/daf/programa-farmacia-popular'
  },
  {
    nome: 'Programa Aqui Tem Farmácia Popular',
    desc: 'Rede privada credenciada com descontos do governo',
    medicamentos: 'Hipertensão (6 medicamentos gratuitos), diabetes (3 gratuitos), asma (3 gratuitos)',
    como: 'Procure farmácias com o selo "Aqui Tem Farmácia Popular"',
    icone: '💰',
    url: 'https://www.gov.br/saude/pt-br/composicao/sctie/daf/programa-farmacia-popular'
  },
  {
    nome: 'Programas de Laboratórios',
    desc: 'Descontos diretos dos fabricantes em medicamentos de marca',
    medicamentos: 'Diversos — cada laboratório tem seu programa',
    como: 'Cadastre-se no site do laboratório ou pergunte na farmácia',
    icone: '🏭',
    url: ''
  },
];

const MEDICAMENTOS_GRATUITOS = [
  { grupo: 'Hipertensão', medicamentos: ['Captopril 25mg', 'Atenolol 25mg', 'Hidroclorotiazida 25mg', 'Losartana 50mg', 'Anlodipino 5mg', 'Enalapril 5mg'], cor: '#ef4444' },
  { grupo: 'Diabetes', medicamentos: ['Metformina 500mg/850mg', 'Glibenclamida 5mg', 'Insulina NPH'], cor: '#3b82f6' },
  { grupo: 'Asma', medicamentos: ['Salbutamol 100mcg (spray)', 'Beclometasona 200mcg/250mcg', 'Brometo de Ipratrópio 0,25mg/ml'], cor: '#10b981' },
  { grupo: 'Anticoncepcionais', medicamentos: ['Etinilestradiol + Levonorgestrel', 'Noretisterona 0,35mg', 'Medroxiprogesterona 150mg'], cor: '#a855f7' },
  { grupo: 'Osteoporose', medicamentos: ['Alendronato de Sódio 70mg'], cor: '#f59e0b' },
  { grupo: 'Parkinson', medicamentos: ['Levodopa + Carbidopa', 'Levodopa + Benserazida'], cor: '#6366f1' },
];

export default function PriceComparison() {
  const [busca, setBusca] = useState('');
  const [abaAtiva, setAbaAtiva] = useState<'busca' | 'gratuitos' | 'programas'>('busca');

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, margin: 0, fontWeight: 800 }}>💰 Preços de Medicamentos</h1>
        <p style={{ opacity: 0.7, fontSize: 14, marginTop: 6 }}>
          Compare preços nas principais farmácias e descubra medicamentos gratuitos
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {([
          { id: 'busca' as const, label: '🔍 Comparar Preços', },
          { id: 'gratuitos' as const, label: '🏥 Medicamentos Gratuitos' },
          { id: 'programas' as const, label: '💰 Programas de Desconto' },
        ]).map(tab => (
          <button key={tab.id} onClick={() => setAbaAtiva(tab.id)} style={{
            padding: '10px 18px', borderRadius: 10, fontSize: 13, cursor: 'pointer', fontWeight: 600,
            border: abaAtiva === tab.id ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.12)',
            background: abaAtiva === tab.id ? 'rgba(16,185,129,0.15)' : 'transparent',
            color: abaAtiva === tab.id ? '#10b981' : 'inherit'
          }}>{tab.label}</button>
        ))}
      </div>

      {abaAtiva === 'busca' && (
        <>
          <div style={{ marginBottom: 20 }}>
            <input type="text" value={busca} onChange={e => setBusca(e.target.value)}
              placeholder="Digite o nome do medicamento para comparar preços..."
              style={{
                width: '100%', padding: '14px 18px', borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
                color: 'inherit', fontSize: 16, outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          {busca.trim() && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
                Comparar "{busca}" nas farmácias:
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                {FARMACIAS.map((farm, i) => (
                  <a key={i} href={`${farm.url}${encodeURIComponent(busca)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 10, padding: '12px 16px', textDecoration: 'none', color: 'inherit',
                      transition: 'border-color 0.15s'
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = farm.cor + '60'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  >
                    <span style={{ fontSize: 20 }}>{farm.logo}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: farm.cor }}>{farm.nome}</div>
                      <div style={{ fontSize: 11, opacity: 0.5 }}>Ver preço →</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {!busca.trim() && (
            <div style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <p style={{ fontSize: 15 }}>Digite o nome de um medicamento acima para comparar preços</p>
              <p style={{ fontSize: 12 }}>Exemplos: Dipirona, Losartana, Omeprazol, Amoxicilina</p>
            </div>
          )}
        </>
      )}

      {abaAtiva === 'gratuitos' && (
        <>
          <div style={{
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 14, padding: 16, marginBottom: 20
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#10b981', marginBottom: 6 }}>
              🏥 Farmácia Popular — Medicamentos 100% Gratuitos
            </h3>
            <p style={{ fontSize: 13, opacity: 0.7, margin: 0 }}>
              O Programa Farmácia Popular oferece medicamentos gratuitos para hipertensão, diabetes e asma.
              Basta apresentar receita médica e documento com CPF em qualquer farmácia credenciada.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {MEDICAMENTOS_GRATUITOS.map((grupo, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: 18
              }}>
                <h4 style={{
                  fontSize: 15, fontWeight: 700, marginBottom: 10, display: 'flex',
                  alignItems: 'center', gap: 8
                }}>
                  <span style={{
                    width: 10, height: 10, borderRadius: '50%', background: grupo.cor, display: 'inline-block'
                  }}></span>
                  {grupo.grupo}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {grupo.medicamentos.map((med, j) => (
                    <div key={j} style={{
                      fontSize: 13, padding: '6px 10px', background: 'rgba(16,185,129,0.06)',
                      borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6
                    }}>
                      <span style={{ color: '#10b981', fontWeight: 700, fontSize: 11 }}>GRÁTIS</span>
                      <span>{med}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {abaAtiva === 'programas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {PROGRAMAS_DESCONTO.map((prog, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: 14 }}>
                <span style={{ fontSize: 36 }}>{prog.icone}</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{prog.nome}</h3>
                  <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>{prog.desc}</p>
                  <div style={{ fontSize: 12, marginBottom: 6 }}>
                    <strong>Medicamentos:</strong> <span style={{ opacity: 0.7 }}>{prog.medicamentos}</span>
                  </div>
                  <div style={{ fontSize: 12, marginBottom: 10 }}>
                    <strong>Como acessar:</strong> <span style={{ opacity: 0.7 }}>{prog.como}</span>
                  </div>
                  {prog.url && (
                    <a href={prog.url} target="_blank" rel="noopener noreferrer"
                      style={{
                        fontSize: 12, color: '#3b82f6', textDecoration: 'none', fontWeight: 600,
                        padding: '6px 14px', borderRadius: 6, border: '1px solid rgba(59,130,246,0.3)',
                        background: 'rgba(59,130,246,0.08)', display: 'inline-block'
                      }}>
                      Saiba mais →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{
        marginTop: 24, padding: 14, background: 'rgba(245,158,11,0.06)',
        borderRadius: 12, fontSize: 11, opacity: 0.7, border: '1px solid rgba(245,158,11,0.12)'
      }}>
        <strong>Importante:</strong> Os preços podem variar conforme a região e a farmácia. Sempre compare antes de comprar.
        Medicamentos genéricos têm a mesma eficácia dos de referência e custam até 60% menos.
        Nunca compre medicamentos sem receita quando exigida.
      </div>
    </div>
  );
}
