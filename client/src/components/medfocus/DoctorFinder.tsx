/**
 * Busca de Médicos — Encontre médicos por especialidade, região, estado e cidade
 * Integra com dados do CFM (Conselho Federal de Medicina)
 */
import { useState } from 'react';

const ESTADOS = [
  'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA',
  'PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'
];

const ESPECIALIDADES = [
  'Cardiologia','Dermatologia','Endocrinologia','Gastroenterologia','Geriatria',
  'Ginecologia e Obstetrícia','Hematologia','Infectologia','Medicina da Família',
  'Nefrologia','Neurologia','Oftalmologia','Oncologia','Ortopedia e Traumatologia',
  'Otorrinolaringologia','Pediatria','Pneumologia','Psiquiatria','Reumatologia',
  'Urologia','Cirurgia Geral','Cirurgia Plástica','Anestesiologia','Radiologia',
  'Medicina do Trabalho','Medicina Esportiva','Nutrologia','Mastologia',
  'Coloproctologia','Cirurgia Vascular','Medicina Intensiva','Patologia',
  'Medicina Legal','Genética Médica','Alergia e Imunologia'
].sort();

const DICAS_BUSCA = [
  { titulo: 'Verifique o CRM', desc: 'Sempre confirme o registro do médico no site do CRM do seu estado', icone: '✅', link: 'https://portal.cfm.org.br/busca-medicos/' },
  { titulo: 'SUS - Saúde da Família', desc: 'Procure a UBS (Unidade Básica de Saúde) mais próxima para atendimento gratuito', icone: '🏥', link: 'https://www.gov.br/saude/pt-br' },
  { titulo: 'Telemedicina', desc: 'Consultas online são regulamentadas pelo CFM desde 2022', icone: '💻', link: '' },
  { titulo: 'Planos de Saúde', desc: 'Consulte a ANS para verificar cobertura do seu plano', icone: '📋', link: 'https://www.gov.br/ans/pt-br' },
];

const LINKS_UTEIS = [
  { nome: 'CFM — Busca de Médicos', url: 'https://portal.cfm.org.br/busca-medicos/', desc: 'Verifique o registro de qualquer médico no Brasil' },
  { nome: 'Cadastro Nacional de Estabelecimentos de Saúde', url: 'https://cnes.datasus.gov.br/', desc: 'Encontre hospitais, clínicas e UBS' },
  { nome: 'ANS — Operadoras de Saúde', url: 'https://www.gov.br/ans/pt-br', desc: 'Agência Nacional de Saúde Suplementar' },
  { nome: 'SUS — Saúde Pública', url: 'https://www.gov.br/saude/pt-br', desc: 'Portal do Ministério da Saúde' },
  { nome: 'Doctoralia', url: 'https://www.doctoralia.com.br/', desc: 'Plataforma de agendamento de consultas' },
  { nome: 'BoaConsulta', url: 'https://www.boaconsulta.com/', desc: 'Agende consultas com desconto' },
];

export default function DoctorFinder() {
  const [estado, setEstado] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [buscaCRM, setBuscaCRM] = useState('');

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, margin: 0, fontWeight: 800 }}>🩺 Encontre um Médico</h1>
        <p style={{ opacity: 0.7, fontSize: 14, marginTop: 6 }}>
          Busque médicos por especialidade e região em todo o Brasil
        </p>
      </div>

      {/* Search by CRM */}
      <div style={{
        background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)',
        borderRadius: 14, padding: 20, marginBottom: 20
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          ✅ Verificar CRM do Médico
        </h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input type="text" value={buscaCRM} onChange={e => setBuscaCRM(e.target.value)}
            placeholder="Digite o número do CRM..."
            style={{
              flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
              color: 'inherit', fontSize: 14, outline: 'none'
            }}
          />
          <select value={estado} onChange={e => setEstado(e.target.value)}
            style={{
              padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)', color: 'inherit', fontSize: 14, outline: 'none'
            }}>
            <option value="">Estado</option>
            {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
          </select>
          <a href={`https://portal.cfm.org.br/busca-medicos/?crm=${buscaCRM}&uf=${estado}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: '10px 20px', borderRadius: 8, background: '#3b82f6',
              color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
            🔍 Buscar no CFM
          </a>
        </div>
      </div>

      {/* Search by specialty */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14, padding: 20, marginBottom: 20
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🔎 Buscar por Especialidade</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
          <select value={especialidade} onChange={e => setEspecialidade(e.target.value)}
            style={{
              flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
              color: 'inherit', fontSize: 14, outline: 'none'
            }}>
            <option value="">Selecione a especialidade...</option>
            {ESPECIALIDADES.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <select value={estado} onChange={e => setEstado(e.target.value)}
            style={{
              padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)', color: 'inherit', fontSize: 14, outline: 'none'
            }}>
            <option value="">Estado</option>
            {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a href={`https://portal.cfm.org.br/busca-medicos/?especialidade=${encodeURIComponent(especialidade)}&uf=${estado}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: '10px 20px', borderRadius: 8, background: 'rgba(16,185,129,0.15)',
              color: '#10b981', fontSize: 13, fontWeight: 600, textDecoration: 'none',
              border: '1px solid rgba(16,185,129,0.3)'
            }}>
            🔍 Buscar no CFM
          </a>
          <a href={`https://www.doctoralia.com.br/${especialidade ? encodeURIComponent(especialidade.toLowerCase().replace(/ /g, '-')) : 'medico'}/${estado ? estado.toLowerCase() : ''}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: '10px 20px', borderRadius: 8, background: 'rgba(59,130,246,0.15)',
              color: '#3b82f6', fontSize: 13, fontWeight: 600, textDecoration: 'none',
              border: '1px solid rgba(59,130,246,0.3)'
            }}>
            📅 Agendar na Doctoralia
          </a>
          <a href={`https://www.boaconsulta.com/busca?q=${encodeURIComponent(especialidade)}&uf=${estado}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: '10px 20px', borderRadius: 8, background: 'rgba(168,85,247,0.15)',
              color: '#a855f7', fontSize: 13, fontWeight: 600, textDecoration: 'none',
              border: '1px solid rgba(168,85,247,0.3)'
            }}>
            💰 BoaConsulta (desconto)
          </a>
        </div>
      </div>

      {/* Quick tips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginBottom: 20 }}>
        {DICAS_BUSCA.map((dica, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: 16
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{dica.icone}</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{dica.titulo}</div>
            <div style={{ fontSize: 12, opacity: 0.6, lineHeight: 1.5 }}>{dica.desc}</div>
            {dica.link && (
              <a href={dica.link} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, color: '#3b82f6', textDecoration: 'none', marginTop: 8, display: 'inline-block' }}>
                Acessar →
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Useful links */}
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🔗 Links Úteis</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {LINKS_UTEIS.map((link, i) => (
          <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, padding: '12px 16px', textDecoration: 'none', color: 'inherit',
              transition: 'border-color 0.15s'
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(59,130,246,0.3)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#3b82f6' }}>{link.nome}</div>
              <div style={{ fontSize: 12, opacity: 0.5, marginTop: 2 }}>{link.desc}</div>
            </div>
            <span style={{ fontSize: 18, opacity: 0.3 }}>→</span>
          </a>
        ))}
      </div>

      <div style={{
        marginTop: 24, padding: 14, background: 'rgba(245,158,11,0.06)',
        borderRadius: 12, fontSize: 11, opacity: 0.7, border: '1px solid rgba(245,158,11,0.12)'
      }}>
        <strong>Importante:</strong> Em caso de emergência, ligue 192 (SAMU) ou dirija-se ao pronto-socorro mais próximo.
        Para atendimento pelo SUS, procure a UBS do seu bairro.
      </div>
    </div>
  );
}
