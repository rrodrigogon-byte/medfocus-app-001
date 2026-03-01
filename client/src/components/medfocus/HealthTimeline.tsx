/**
 * MedFocus — Dashboard de Saúde do Paciente / Health Timeline (Sprint 23)
 * 
 * Visão 360° do paciente com timeline interativa:
 * - Timeline cronológica de eventos de saúde
 * - Resumo de comorbidades e medicações ativas
 * - Gráficos de sinais vitais
 * - Score de risco cardiovascular (Framingham / ASCVD)
 * - Alergias e alertas críticos
 * - Integração com todos os módulos do MedFocus
 * 
 * DISCLAIMER: Ferramenta exclusivamente educacional e de apoio ao estudo.
 */

import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface EventoSaude {
  id: string;
  data: string;
  tipo: 'consulta' | 'exame' | 'internacao' | 'cirurgia' | 'medicacao' | 'vacina' | 'alerta';
  titulo: string;
  descricao: string;
  profissional?: string;
  local?: string;
  resultados?: string[];
  cid?: string;
}

interface PacienteDemo {
  nome: string;
  idade: number;
  sexo: string;
  dataNascimento: string;
  cpf: string;
  tipoSanguineo: string;
  comorbidades: string[];
  medicacoesAtivas: { nome: string; dose: string; frequencia: string; inicio: string }[];
  alergias: { substancia: string; tipo: string; gravidade: string }[];
  sinaisVitais: { data: string; pas: number; pad: number; fc: number; temp: number; spo2: number; peso: number }[];
  eventos: EventoSaude[];
  riscoCv: { score: number; classificacao: string; fatores: string[] };
}

const PACIENTE_DEMO: PacienteDemo = {
  nome: 'João Carlos Silva', idade: 58, sexo: 'Masculino', dataNascimento: '15/03/1967',
  cpf: '***.***.***-**', tipoSanguineo: 'O+',
  comorbidades: ['Hipertensão Arterial (I10)', 'Diabetes Mellitus Tipo 2 (E11)', 'Dislipidemia (E78.5)', 'Obesidade Grau I (E66.0)'],
  medicacoesAtivas: [
    { nome: 'Losartana', dose: '100mg', frequencia: '1x/dia (manhã)', inicio: '2023-06' },
    { nome: 'Metformina', dose: '850mg', frequencia: '2x/dia (café e jantar)', inicio: '2024-01' },
    { nome: 'Atorvastatina', dose: '20mg', frequencia: '1x/dia (noite)', inicio: '2024-03' },
    { nome: 'AAS', dose: '100mg', frequencia: '1x/dia (almoço)', inicio: '2024-06' },
  ],
  alergias: [
    { substancia: 'Dipirona', tipo: 'Medicamentosa', gravidade: 'Moderada — Urticária' },
    { substancia: 'Contraste Iodado', tipo: 'Reação adversa', gravidade: 'Grave — Anafilaxia' },
  ],
  sinaisVitais: [
    { data: '2025-08', pas: 148, pad: 95, fc: 78, temp: 36.5, spo2: 97, peso: 92 },
    { data: '2025-10', pas: 142, pad: 92, fc: 76, temp: 36.4, spo2: 98, peso: 90 },
    { data: '2025-12', pas: 138, pad: 88, fc: 74, temp: 36.6, spo2: 97, peso: 88 },
    { data: '2026-01', pas: 135, pad: 86, fc: 72, temp: 36.5, spo2: 98, peso: 87 },
    { data: '2026-02', pas: 132, pad: 84, fc: 70, temp: 36.4, spo2: 98, peso: 86 },
  ],
  eventos: [
    { id: 'ev-001', data: '2026-02-28', tipo: 'consulta', titulo: 'Consulta de Retorno — Cardiologia', descricao: 'Reavaliação de HAS e DM2. PA controlada com losartana 100mg. HbA1c em queda (6.9%). Manter conduta.', profissional: 'Dr. Ricardo Mendes (CRM 12345)', cid: 'I10' },
    { id: 'ev-002', data: '2026-02-15', tipo: 'exame', titulo: 'Exames Laboratoriais', descricao: 'Perfil metabólico completo.', resultados: ['HbA1c: 6.9%', 'Glicemia jejum: 128 mg/dL', 'Colesterol Total: 192 mg/dL', 'LDL: 108 mg/dL', 'Creatinina: 0.9 mg/dL'] },
    { id: 'ev-003', data: '2026-01-10', tipo: 'medicacao', titulo: 'Ajuste de Medicação', descricao: 'Aumento de Losartana de 50mg para 100mg por controle pressórico subótimo.' },
    { id: 'ev-004', data: '2025-12-05', tipo: 'vacina', titulo: 'Vacina Influenza 2025', descricao: 'Vacinação anual contra Influenza. Lote: INF2025-BR.', local: 'UBS Central' },
    { id: 'ev-005', data: '2025-11-20', tipo: 'consulta', titulo: 'Consulta — Endocrinologia', descricao: 'Avaliação de DM2. HbA1c 7.2%. Mantida metformina. Orientação nutricional reforçada.', profissional: 'Dra. Ana Paula Costa (CRM 67890)', cid: 'E11' },
    { id: 'ev-006', data: '2025-09-15', tipo: 'exame', titulo: 'Ecocardiograma Transtorácico', descricao: 'FEVE 62%. Hipertrofia ventricular esquerda leve. Sem valvopatias significativas.', resultados: ['FEVE: 62%', 'HVE leve (septo 12mm)', 'Sem derrame pericárdico'] },
    { id: 'ev-007', data: '2025-06-10', tipo: 'internacao', titulo: 'Internação — Crise Hipertensiva', descricao: 'Admitido com PA 200/120 mmHg, cefaleia intensa. Tratado com nitroprussiato IV. Alta em 48h com ajuste medicamentoso.', local: 'Hospital São Lucas' },
    { id: 'ev-008', data: '2024-12-01', tipo: 'cirurgia', titulo: 'Colecistectomia Videolaparoscópica', descricao: 'Colecistectomia eletiva por colelitíase sintomática. Procedimento sem intercorrências.', profissional: 'Dr. Marcos Oliveira (CRM 11111)', local: 'Hospital São Lucas' },
  ],
  riscoCv: {
    score: 18.5,
    classificacao: 'Alto Risco',
    fatores: ['Idade > 55 anos', 'Sexo masculino', 'HAS', 'DM2', 'Dislipidemia', 'Obesidade', 'Sedentarismo'],
  },
};

export function HealthTimeline() {
  const [tela, setTela] = useState<'visaoGeral' | 'timeline' | 'sinaisVitais' | 'risco'>('visaoGeral');
  const [filtroEvento, setFiltroEvento] = useState('todos');

  const p = PACIENTE_DEMO;

  const iconeEvento = (tipo: EventoSaude['tipo']) => {
    switch (tipo) {
      case 'consulta': return { icon: '🩺', cor: 'bg-blue-500/20 border-blue-500/50 text-blue-400' };
      case 'exame': return { icon: '🧪', cor: 'bg-green-500/20 border-green-500/50 text-green-400' };
      case 'internacao': return { icon: '🏥', cor: 'bg-red-500/20 border-red-500/50 text-red-400' };
      case 'cirurgia': return { icon: '🔪', cor: 'bg-orange-500/20 border-orange-500/50 text-orange-400' };
      case 'medicacao': return { icon: '💊', cor: 'bg-purple-500/20 border-purple-500/50 text-purple-400' };
      case 'vacina': return { icon: '💉', cor: 'bg-teal-500/20 border-teal-500/50 text-teal-400' };
      case 'alerta': return { icon: '⚠️', cor: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' };
    }
  };

  const eventosFiltrados = filtroEvento === 'todos' ? p.eventos : p.eventos.filter(e => e.tipo === filtroEvento);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="Dashboard de Saúde do Paciente" />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">❤️</span> Dashboard de Saúde do Paciente
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full font-medium">Health Timeline</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visão 360° do paciente com timeline de eventos, sinais vitais, medicações e score de risco cardiovascular
        </p>
      </div>

      {/* Cabeçalho do Paciente */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
            {p.nome.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">{p.nome}</h2>
            <p className="text-xs text-muted-foreground">{p.idade} anos | {p.sexo} | Nasc: {p.dataNascimento} | Tipo: {p.tipoSanguineo}</p>
          </div>
          {p.alergias.length > 0 && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl px-4 py-2">
              <p className="text-[10px] text-red-400 font-bold">⚠️ ALERGIAS</p>
              {p.alergias.map((a, i) => <p key={i} className="text-xs text-red-300">{a.substancia} — {a.gravidade}</p>)}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'visaoGeral' as const, label: '📊 Visão Geral' },
          { id: 'timeline' as const, label: `📅 Timeline (${p.eventos.length})` },
          { id: 'sinaisVitais' as const, label: '❤️ Sinais Vitais' },
          { id: 'risco' as const, label: '⚠️ Risco CV' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setTela(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              tela === tab.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border hover:bg-accent'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Visão Geral */}
      {tela === 'visaoGeral' && (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold text-sm mb-3">🏥 Comorbidades</h3>
            <div className="space-y-2">
              {p.comorbidades.map((c, i) => (
                <div key={i} className="bg-background/50 rounded-lg p-2 text-xs">{c}</div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold text-sm mb-3">💊 Medicações Ativas ({p.medicacoesAtivas.length})</h3>
            <div className="space-y-2">
              {p.medicacoesAtivas.map((m, i) => (
                <div key={i} className="bg-background/50 rounded-lg p-2">
                  <p className="text-xs font-bold">{m.nome} {m.dose}</p>
                  <p className="text-[10px] text-muted-foreground">{m.frequencia} | Desde {m.inicio}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-bold text-sm mb-3">❤️ Últimos Sinais Vitais</h3>
              {(() => {
                const sv = p.sinaisVitais[p.sinaisVitais.length - 1];
                return (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-background/50 rounded-lg p-2 text-center"><p className="text-lg font-bold text-red-400">{sv.pas}/{sv.pad}</p><p className="text-[10px] text-muted-foreground">PA (mmHg)</p></div>
                    <div className="bg-background/50 rounded-lg p-2 text-center"><p className="text-lg font-bold text-pink-400">{sv.fc}</p><p className="text-[10px] text-muted-foreground">FC (bpm)</p></div>
                    <div className="bg-background/50 rounded-lg p-2 text-center"><p className="text-lg font-bold text-blue-400">{sv.spo2}%</p><p className="text-[10px] text-muted-foreground">SpO2</p></div>
                    <div className="bg-background/50 rounded-lg p-2 text-center"><p className="text-lg font-bold text-yellow-400">{sv.temp}°C</p><p className="text-[10px] text-muted-foreground">Temp</p></div>
                    <div className="bg-background/50 rounded-lg p-2 text-center"><p className="text-lg font-bold text-green-400">{sv.peso}kg</p><p className="text-[10px] text-muted-foreground">Peso</p></div>
                    <div className="bg-background/50 rounded-lg p-2 text-center"><p className="text-lg font-bold text-purple-400">{(sv.peso / (1.75 * 1.75)).toFixed(1)}</p><p className="text-[10px] text-muted-foreground">IMC</p></div>
                  </div>
                );
              })()}
            </div>

            <div className={`rounded-xl p-4 border ${p.riscoCv.score > 20 ? 'bg-red-500/10 border-red-500/30' : p.riscoCv.score > 10 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold">Score de Risco CV</p>
                  <p className="text-[10px] text-muted-foreground">{p.riscoCv.classificacao}</p>
                </div>
                <p className={`text-2xl font-bold ${p.riscoCv.score > 20 ? 'text-red-400' : p.riscoCv.score > 10 ? 'text-orange-400' : 'text-green-400'}`}>{p.riscoCv.score}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      {tela === 'timeline' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {['todos', 'consulta', 'exame', 'internacao', 'cirurgia', 'medicacao', 'vacina'].map(f => (
              <button key={f} onClick={() => setFiltroEvento(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  filtroEvento === f ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'
                }`}>{f === 'todos' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
            ))}
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-4">
              {eventosFiltrados.map(ev => {
                const ie = iconeEvento(ev.tipo);
                return (
                  <div key={ev.id} className="relative pl-14">
                    <div className={`absolute left-3 w-7 h-7 rounded-full ${ie.cor} border flex items-center justify-center text-sm z-10`}>
                      {ie.icon}
                    </div>
                    <div className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm">{ev.titulo}</h4>
                        <span className="text-xs text-muted-foreground">{ev.data}</span>
                      </div>
                      <p className="text-xs text-foreground/70">{ev.descricao}</p>
                      {ev.profissional && <p className="text-[10px] text-primary mt-1">{ev.profissional}</p>}
                      {ev.local && <p className="text-[10px] text-muted-foreground">{ev.local}</p>}
                      {ev.resultados && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {ev.resultados.map((r, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-background text-foreground/70">{r}</span>
                          ))}
                        </div>
                      )}
                      {ev.cid && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary mt-2 inline-block">{ev.cid}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sinais Vitais */}
      {tela === 'sinaisVitais' && (
        <div className="space-y-4">
          <h3 className="font-bold">❤️ Evolução dos Sinais Vitais</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { nome: 'Pressão Arterial', dados: p.sinaisVitais.map(sv => ({ data: sv.data, valor: sv.pas, valor2: sv.pad })), unidade: 'mmHg', ref: '< 140/90', cor: 'text-red-400' },
              { nome: 'Frequência Cardíaca', dados: p.sinaisVitais.map(sv => ({ data: sv.data, valor: sv.fc })), unidade: 'bpm', ref: '60-100', cor: 'text-pink-400' },
              { nome: 'Peso Corporal', dados: p.sinaisVitais.map(sv => ({ data: sv.data, valor: sv.peso })), unidade: 'kg', ref: 'IMC 18.5-24.9', cor: 'text-green-400' },
              { nome: 'SpO2', dados: p.sinaisVitais.map(sv => ({ data: sv.data, valor: sv.spo2 })), unidade: '%', ref: '≥ 95%', cor: 'text-blue-400' },
            ].map(sv => (
              <div key={sv.nome} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm">{sv.nome}</h4>
                  <span className="text-xs text-muted-foreground">Ref: {sv.ref}</span>
                </div>
                <div className="flex items-end gap-2">
                  {sv.dados.map((d: any, i: number) => (
                    <div key={i} className="flex-1 text-center">
                      <p className={`text-sm font-bold ${sv.cor}`}>
                        {d.valor2 ? `${d.valor}/${d.valor2}` : d.valor}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">{d.data}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risco CV */}
      {tela === 'risco' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">⚠️ Score de Risco Cardiovascular</h3>
            <div className="text-center py-6">
              <p className={`text-6xl font-bold ${p.riscoCv.score > 20 ? 'text-red-400' : p.riscoCv.score > 10 ? 'text-orange-400' : 'text-green-400'}`}>
                {p.riscoCv.score}%
              </p>
              <p className="text-sm text-muted-foreground mt-2">Risco de evento CV em 10 anos</p>
              <p className={`text-lg font-bold mt-1 ${p.riscoCv.score > 20 ? 'text-red-400' : p.riscoCv.score > 10 ? 'text-orange-400' : 'text-green-400'}`}>
                {p.riscoCv.classificacao}
              </p>
            </div>
            <div className="w-full bg-background rounded-full h-3 mt-4">
              <div className={`h-3 rounded-full ${p.riscoCv.score > 20 ? 'bg-red-500' : p.riscoCv.score > 10 ? 'bg-orange-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(p.riscoCv.score * 2, 100)}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>Baixo (&lt;5%)</span><span>Intermediário (5-20%)</span><span>Alto (&gt;20%)</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">📋 Fatores de Risco Identificados</h3>
            <div className="space-y-2">
              {p.riscoCv.fatores.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-red-500/10 rounded-lg p-3">
                  <span className="text-red-400">⚠️</span>
                  <p className="text-xs">{f}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-xs text-blue-400">
                <strong>Referência:</strong> Score baseado no Framingham Risk Score adaptado para população brasileira (SBC 2019) e ASCVD Risk Calculator (ACC/AHA 2013).
              </p>
            </div>
          </div>
        </div>
      )}

      <EducationalDisclaimer variant="footer" />
    </div>
  );
}
