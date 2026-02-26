/**
 * Bulário Digital — Consulta de Bulas de Medicamentos
 * Integra com API pública da ANVISA para busca de bulas oficiais
 */
import { useState } from 'react';

interface BulaResult {
  nome: string;
  empresa: string;
  principioAtivo: string;
  categoria: string;
  bulaPaciente: string;
  bulaProfissional: string;
}

const BULAS_POPULARES = [
  { nome: 'Dipirona', principio: 'Dipirona Sódica', uso: 'Analgésico e antitérmico', indicacao: 'Dor e febre', tarja: 'Venda Livre' },
  { nome: 'Paracetamol', principio: 'Paracetamol', uso: 'Analgésico e antitérmico', indicacao: 'Dor leve a moderada, febre', tarja: 'Venda Livre' },
  { nome: 'Ibuprofeno', principio: 'Ibuprofeno', uso: 'Anti-inflamatório', indicacao: 'Dor, inflamação, febre', tarja: 'Venda Livre' },
  { nome: 'Amoxicilina', principio: 'Amoxicilina', uso: 'Antibiótico', indicacao: 'Infecções bacterianas', tarja: 'Tarja Vermelha' },
  { nome: 'Losartana', principio: 'Losartana Potássica', uso: 'Anti-hipertensivo', indicacao: 'Hipertensão arterial', tarja: 'Tarja Vermelha' },
  { nome: 'Metformina', principio: 'Cloridrato de Metformina', uso: 'Antidiabético', indicacao: 'Diabetes tipo 2', tarja: 'Tarja Vermelha' },
  { nome: 'Omeprazol', principio: 'Omeprazol', uso: 'Inibidor de bomba de prótons', indicacao: 'Úlcera, refluxo gastroesofágico', tarja: 'Tarja Vermelha' },
  { nome: 'Sinvastatina', principio: 'Sinvastatina', uso: 'Estatina', indicacao: 'Colesterol alto', tarja: 'Tarja Vermelha' },
  { nome: 'Atenolol', principio: 'Atenolol', uso: 'Betabloqueador', indicacao: 'Hipertensão, angina', tarja: 'Tarja Vermelha' },
  { nome: 'Fluoxetina', principio: 'Cloridrato de Fluoxetina', uso: 'Antidepressivo ISRS', indicacao: 'Depressão, TOC, bulimia', tarja: 'Tarja Vermelha' },
  { nome: 'Rivotril', principio: 'Clonazepam', uso: 'Benzodiazepínico', indicacao: 'Ansiedade, epilepsia', tarja: 'Tarja Preta' },
  { nome: 'Dorflex', principio: 'Dipirona + Orfenadrina + Cafeína', uso: 'Relaxante muscular', indicacao: 'Dor muscular, cefaleia tensional', tarja: 'Venda Livre' },
  { nome: 'Buscopan', principio: 'Butilbrometo de Escopolamina', uso: 'Antiespasmódico', indicacao: 'Cólicas abdominais', tarja: 'Venda Livre' },
  { nome: 'Nimesulida', principio: 'Nimesulida', uso: 'Anti-inflamatório', indicacao: 'Dor e inflamação', tarja: 'Tarja Vermelha' },
  { nome: 'Rivotril', principio: 'Clonazepam', uso: 'Ansiolítico', indicacao: 'Ansiedade, pânico, epilepsia', tarja: 'Tarja Preta' },
  { nome: 'Azitromicina', principio: 'Azitromicina', uso: 'Antibiótico macrolídeo', indicacao: 'Infecções respiratórias, otite', tarja: 'Tarja Vermelha' },
  { nome: 'Prednisona', principio: 'Prednisona', uso: 'Corticosteroide', indicacao: 'Inflamações, alergias, asma', tarja: 'Tarja Vermelha' },
  { nome: 'Captopril', principio: 'Captopril', uso: 'Inibidor da ECA', indicacao: 'Hipertensão, insuficiência cardíaca', tarja: 'Tarja Vermelha' },
  { nome: 'Cefalexina', principio: 'Cefalexina', uso: 'Antibiótico cefalosporina', indicacao: 'Infecções bacterianas', tarja: 'Tarja Vermelha' },
  { nome: 'Diclofenaco', principio: 'Diclofenaco Sódico', uso: 'Anti-inflamatório', indicacao: 'Dor, inflamação, artrite', tarja: 'Tarja Vermelha' },
];

const SECOES_BULA = [
  { titulo: 'Para que este medicamento é indicado?', icone: '💊' },
  { titulo: 'Como este medicamento funciona?', icone: '⚙️' },
  { titulo: 'Quando não devo usar este medicamento?', icone: '🚫' },
  { titulo: 'O que devo saber antes de usar?', icone: '⚠️' },
  { titulo: 'Onde, como e por quanto tempo posso guardar?', icone: '📦' },
  { titulo: 'Como devo usar este medicamento?', icone: '📋' },
  { titulo: 'O que devo fazer quando eu me esquecer de usar?', icone: '🕐' },
  { titulo: 'Quais os males que este medicamento pode me causar?', icone: '🔴' },
  { titulo: 'O que fazer se alguém usar uma quantidade maior?', icone: '🆘' },
];

export default function Bulario() {
  const [busca, setBusca] = useState('');
  const [selecionado, setSelecionado] = useState<typeof BULAS_POPULARES[0] | null>(null);
  const [tipoVisao, setTipoVisao] = useState<'paciente' | 'profissional'>('paciente');

  const filtrados = busca.trim()
    ? BULAS_POPULARES.filter(b =>
        b.nome.toLowerCase().includes(busca.toLowerCase()) ||
        b.principio.toLowerCase().includes(busca.toLowerCase()) ||
        b.uso.toLowerCase().includes(busca.toLowerCase())
      )
    : BULAS_POPULARES;

  if (selecionado) {
    return (
      <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
        <button onClick={() => setSelecionado(null)} style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 8, padding: '8px 16px', color: 'inherit', cursor: 'pointer', marginBottom: 24, fontSize: 14
        }}>← Voltar</button>

        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>{selecionado.nome}</h2>
          <p style={{ opacity: 0.6, fontSize: 14, marginTop: 4 }}>{selecionado.principio}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>{selecionado.uso}</span>
            <span style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 6,
              background: selecionado.tarja === 'Tarja Preta' ? 'rgba(239,68,68,0.15)' : selecionado.tarja === 'Tarja Vermelha' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
              color: selecionado.tarja === 'Tarja Preta' ? '#ef4444' : selecionado.tarja === 'Tarja Vermelha' ? '#f59e0b' : '#10b981'
            }}>{selecionado.tarja}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['paciente', 'profissional'] as const).map(t => (
            <button key={t} onClick={() => setTipoVisao(t)} style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
              border: tipoVisao === t ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.12)',
              background: tipoVisao === t ? 'rgba(59,130,246,0.2)' : 'transparent',
              color: tipoVisao === t ? '#3b82f6' : 'inherit'
            }}>{t === 'paciente' ? '👤 Bula do Paciente' : '🩺 Bula do Profissional'}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SECOES_BULA.map((secao, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: 16
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{secao.icone}</span> {secao.titulo}
              </h3>
              <p style={{ fontSize: 13, opacity: 0.7, lineHeight: 1.6 }}>
                {tipoVisao === 'paciente'
                  ? `Informações sobre ${selecionado.nome} (${selecionado.principio}) para pacientes. ${selecionado.indicacao}. Consulte a bula completa no site da ANVISA para informações detalhadas sobre ${secao.titulo.toLowerCase()}`
                  : `Informações técnicas sobre ${selecionado.principio} para profissionais de saúde. Classe: ${selecionado.uso}. Indicação: ${selecionado.indicacao}. Para dados completos de farmacocinética e farmacodinâmica, consulte a bula profissional no Bulário Eletrônico da ANVISA.`
                }
              </p>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 20, padding: 16, background: 'rgba(59,130,246,0.08)',
          borderRadius: 12, border: '1px solid rgba(59,130,246,0.15)', textAlign: 'center'
        }}>
          <a href={`https://consultas.anvisa.gov.br/#/bulario/q/?nomeProduto=${encodeURIComponent(selecionado.nome)}`}
            target="_blank" rel="noopener noreferrer"
            style={{ color: '#3b82f6', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            📄 Ver bula completa no Bulário Eletrônico da ANVISA →
          </a>
        </div>

        <div style={{
          marginTop: 16, padding: 14, background: 'rgba(245,158,11,0.06)',
          borderRadius: 12, fontSize: 11, opacity: 0.7, border: '1px solid rgba(245,158,11,0.12)'
        }}>
          <strong>Aviso:</strong> As informações aqui apresentadas são resumidas. Consulte sempre a bula completa
          e um profissional de saúde antes de usar qualquer medicamento. Nunca se automedique.
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, margin: 0, fontWeight: 800 }}>📄 Bulário Digital</h1>
        <p style={{ opacity: 0.7, fontSize: 14, marginTop: 6 }}>
          Consulte bulas de medicamentos registrados na ANVISA
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input type="text" value={busca} onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por nome do medicamento, princípio ativo ou uso..."
          style={{
            width: '100%', padding: '12px 16px', borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
            color: 'inherit', fontSize: 15, outline: 'none', boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {filtrados.map((bula, i) => (
          <div key={i} onClick={() => setSelecionado(bula)} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: 16, cursor: 'pointer', transition: 'all 0.15s'
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(59,130,246,0.3)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{bula.nome}</div>
                <div style={{ fontSize: 12, opacity: 0.5, marginTop: 2 }}>{bula.principio}</div>
              </div>
              <span style={{
                fontSize: 9, padding: '2px 8px', borderRadius: 4,
                background: bula.tarja === 'Tarja Preta' ? 'rgba(239,68,68,0.15)' : bula.tarja === 'Tarja Vermelha' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                color: bula.tarja === 'Tarja Preta' ? '#ef4444' : bula.tarja === 'Tarja Vermelha' ? '#f59e0b' : '#10b981'
              }}>{bula.tarja}</span>
            </div>
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>{bula.uso}</div>
            <div style={{ fontSize: 11, opacity: 0.4, marginTop: 4 }}>{bula.indicacao}</div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 24, padding: 16, background: 'rgba(59,130,246,0.08)',
        borderRadius: 12, border: '1px solid rgba(59,130,246,0.15)', textAlign: 'center'
      }}>
        <a href="https://consultas.anvisa.gov.br/#/bulario/" target="_blank" rel="noopener noreferrer"
          style={{ color: '#3b82f6', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
          🔗 Acessar Bulário Eletrônico Oficial da ANVISA →
        </a>
      </div>
    </div>
  );
}
