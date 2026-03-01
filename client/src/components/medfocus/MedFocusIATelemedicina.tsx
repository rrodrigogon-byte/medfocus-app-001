/**
 * MedFocus — Módulo de Telemedicina (Sprint 7)
 * 
 * Simulador educacional de teleconsulta para treinamento acadêmico.
 * NÃO é um serviço real de telemedicina.
 * 
 * Funcionalidades:
 * - Simulação de teleconsulta (treinamento)
 * - Sala de espera virtual (demo)
 * - Prontuário rápido de teleconsulta
 * - Prescrição digital pós-consulta (simulação)
 * - Relatórios de atendimento
 * - Conformidade com Resolução CFM nº 2.314/2022
 */

import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

type TelemedicinaTela = 'dashboard' | 'sala-espera' | 'consulta' | 'historico' | 'configuracoes';

interface ConsultaSimulada {
  id: string;
  paciente: string;
  data: string;
  hora: string;
  tipo: 'primeira-vez' | 'retorno' | 'urgencia';
  status: 'agendada' | 'em-andamento' | 'concluida' | 'cancelada';
  especialidade: string;
  motivo: string;
  duracao?: string;
  notas?: string;
}

const CONSULTAS_DEMO: ConsultaSimulada[] = [
  { id: 'TC-001', paciente: 'Maria Silva (fictício)', data: '2026-03-01', hora: '09:00', tipo: 'primeira-vez', status: 'agendada', especialidade: 'Clínica Geral', motivo: 'Cefaleia recorrente — avaliação inicial' },
  { id: 'TC-002', paciente: 'João Santos (fictício)', data: '2026-03-01', hora: '09:30', tipo: 'retorno', status: 'agendada', especialidade: 'Cardiologia', motivo: 'Retorno — controle de hipertensão' },
  { id: 'TC-003', paciente: 'Ana Oliveira (fictício)', data: '2026-03-01', hora: '10:00', tipo: 'urgencia', status: 'em-andamento', especialidade: 'Dermatologia', motivo: 'Lesão cutânea com alteração recente' },
  { id: 'TC-004', paciente: 'Carlos Pereira (fictício)', data: '2026-02-28', hora: '14:00', tipo: 'retorno', status: 'concluida', especialidade: 'Endocrinologia', motivo: 'Acompanhamento — diabetes tipo 2', duracao: '25 min', notas: 'Ajuste de metformina. Solicitar HbA1c em 3 meses.' },
  { id: 'TC-005', paciente: 'Lucia Ferreira (fictício)', data: '2026-02-28', hora: '15:30', tipo: 'primeira-vez', status: 'concluida', especialidade: 'Psiquiatria', motivo: 'Avaliação inicial — ansiedade', duracao: '40 min', notas: 'Encaminhamento para psicoterapia. Início de ISRS.' },
  { id: 'TC-006', paciente: 'Roberto Lima (fictício)', data: '2026-02-27', hora: '11:00', tipo: 'retorno', status: 'cancelada', especialidade: 'Ortopedia', motivo: 'Retorno — lombalgia crônica' },
];

export function MedFocusIATelemedicina() {
  const [tela, setTela] = useState<TelemedicinaTela>('dashboard');
  const [consultaSelecionada, setConsultaSelecionada] = useState<ConsultaSimulada | null>(null);
  const [soapNotes, setSoapNotes] = useState({ subjetivo: '', objetivo: '', avaliacao: '', plano: '' });

  const consultas = CONSULTAS_DEMO;
  const agendadas = consultas.filter(c => c.status === 'agendada');
  const emAndamento = consultas.filter(c => c.status === 'em-andamento');
  const concluidas = consultas.filter(c => c.status === 'concluida');

  const statusColor = (s: string) => {
    switch (s) {
      case 'agendada': return 'text-blue-400 bg-blue-500/10';
      case 'em-andamento': return 'text-green-400 bg-green-500/10';
      case 'concluida': return 'text-gray-400 bg-gray-500/10';
      case 'cancelada': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400';
    }
  };

  const tipoLabel = (t: string) => {
    switch (t) {
      case 'primeira-vez': return { label: '1ª Consulta', color: 'text-purple-400 bg-purple-500/10' };
      case 'retorno': return { label: 'Retorno', color: 'text-blue-400 bg-blue-500/10' };
      case 'urgencia': return { label: 'Urgência', color: 'text-red-400 bg-red-500/10' };
      default: return { label: t, color: '' };
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="Telemedicina (Simulação)" showAIWarning showEmergencyInfo />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">📹</span> Telemedicina
          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-medium">SIMULAÇÃO EDUCACIONAL</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Simulador de teleconsulta para treinamento acadêmico — Conforme Resolução CFM nº 2.314/2022
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'dashboard' as TelemedicinaTela, label: 'Dashboard', icon: '📊' },
          { id: 'sala-espera' as TelemedicinaTela, label: 'Sala de Espera', icon: '🏥' },
          { id: 'consulta' as TelemedicinaTela, label: 'Teleconsulta', icon: '📹' },
          { id: 'historico' as TelemedicinaTela, label: 'Histórico', icon: '📋' },
          { id: 'configuracoes' as TelemedicinaTela, label: 'Configurações', icon: '⚙️' },
        ].map(t => (
          <button key={t.id} onClick={() => setTela(t.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tela === t.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border hover:bg-accent'
            }`}>
            <span className="mr-1">{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tela === 'dashboard' && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Agendadas Hoje', value: agendadas.length.toString(), icon: '📅', color: 'text-blue-400' },
              { label: 'Em Andamento', value: emAndamento.length.toString(), icon: '🟢', color: 'text-green-400' },
              { label: 'Concluídas (Semana)', value: concluidas.length.toString(), icon: '✅', color: 'text-emerald-400' },
              { label: 'Tempo Médio', value: '32 min', icon: '⏱️', color: 'text-purple-400' },
            ].map((kpi, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>{kpi.icon}</span>
                  <span className="text-xs text-muted-foreground">{kpi.label}</span>
                </div>
                <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Próximas consultas */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">📅 Próximas Teleconsultas (Simulação)</h3>
            <div className="space-y-3">
              {agendadas.map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/30 transition cursor-pointer"
                  onClick={() => { setConsultaSelecionada(c); setTela('consulta'); }}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">👤</div>
                    <div>
                      <p className="font-medium text-sm">{c.paciente}</p>
                      <p className="text-xs text-muted-foreground">{c.especialidade} — {c.motivo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{c.hora}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${tipoLabel(c.tipo).color}`}>{tipoLabel(c.tipo).label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regulamentação */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="font-bold text-blue-400 mb-3">📚 Referência: Resolução CFM nº 2.314/2022</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-foreground/80">
              <div>
                <p className="font-medium text-blue-300 mb-1">Requisitos para Teleconsulta:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Consentimento livre e esclarecido do paciente</li>
                  <li>• Registro em prontuário (CRM do médico obrigatório)</li>
                  <li>• Ambiente seguro e com privacidade</li>
                  <li>• Criptografia ponta a ponta</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-blue-300 mb-1">Modalidades Permitidas:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Teleconsulta (médico-paciente)</li>
                  <li>• Teleinterconsulta (médico-médico)</li>
                  <li>• Telediagnóstico</li>
                  <li>• Telemonitoramento</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sala de Espera */}
      {tela === 'sala-espera' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">🏥 Sala de Espera Virtual (Simulação)</h3>
            <div className="space-y-3">
              {[...emAndamento, ...agendadas].map((c, i) => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">{i + 1}</div>
                    <div>
                      <p className="font-medium text-sm">{c.paciente}</p>
                      <p className="text-xs text-muted-foreground">{c.especialidade} — {c.hora}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor(c.status)}`}>
                      {c.status === 'em-andamento' ? '🟢 Em atendimento' : '⏳ Aguardando'}
                    </span>
                    <button onClick={() => { setConsultaSelecionada(c); setTela('consulta'); }}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition">
                      Iniciar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Teleconsulta */}
      {tela === 'consulta' && (
        <div className="space-y-6">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2 text-xs text-yellow-300">
            ⚠️ <strong>SIMULAÇÃO EDUCACIONAL</strong> — Este módulo simula uma teleconsulta para fins de treinamento. Nenhum dado real de paciente deve ser inserido.
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Vídeo simulado */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center border border-border relative">
                <div className="text-center space-y-3">
                  <span className="text-6xl">📹</span>
                  <p className="text-muted-foreground text-sm">Área de Vídeo (Simulação)</p>
                  <p className="text-xs text-muted-foreground">Em um sistema real, aqui seria exibida a transmissão de vídeo criptografada</p>
                </div>
                {/* Controles */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                  {['🎤 Microfone', '📷 Câmera', '🖥️ Tela', '📋 Notas', '🔴 Encerrar'].map((btn, i) => (
                    <button key={i} className={`px-3 py-2 rounded-lg text-xs font-medium ${
                      i === 4 ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-card/80 text-foreground/70 hover:bg-card border border-border/50'
                    } transition`}>
                      {btn}
                    </button>
                  ))}
                </div>
              </div>

              {/* SOAP Notes */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold mb-4">📝 Registro SOAP — Teleconsulta</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { key: 'subjetivo', label: 'S — Subjetivo', placeholder: 'Queixa principal, HDA, antecedentes...' },
                    { key: 'objetivo', label: 'O — Objetivo', placeholder: 'Observações visuais, sinais vitais relatados...' },
                    { key: 'avaliacao', label: 'A — Avaliação', placeholder: 'Hipóteses diagnósticas, CID-10...' },
                    { key: 'plano', label: 'P — Plano', placeholder: 'Conduta, prescrição, exames, retorno...' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-xs font-bold text-primary mb-1 block">{field.label}</label>
                      <textarea
                        value={soapNotes[field.key as keyof typeof soapNotes]}
                        onChange={e => setSoapNotes(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full bg-background border border-border rounded-lg p-3 text-sm resize-none h-24 focus:border-primary focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Painel lateral */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-4">
                <h4 className="font-bold text-sm mb-3">👤 Paciente (Fictício)</h4>
                <div className="space-y-2 text-xs text-foreground/70">
                  <p><strong>Nome:</strong> {consultaSelecionada?.paciente || 'Maria Silva (fictício)'}</p>
                  <p><strong>Motivo:</strong> {consultaSelecionada?.motivo || 'Cefaleia recorrente'}</p>
                  <p><strong>Tipo:</strong> {consultaSelecionada ? tipoLabel(consultaSelecionada.tipo).label : '1ª Consulta'}</p>
                  <p><strong>Especialidade:</strong> {consultaSelecionada?.especialidade || 'Clínica Geral'}</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4">
                <h4 className="font-bold text-sm mb-3">📋 Checklist Teleconsulta</h4>
                <div className="space-y-2">
                  {[
                    'Consentimento do paciente obtido',
                    'Identidade verificada',
                    'Conexão estável confirmada',
                    'Ambiente com privacidade',
                    'CRM registrado no prontuário',
                    'Prescrição digital assinada',
                  ].map((item, i) => (
                    <label key={i} className="flex items-center gap-2 text-xs text-foreground/70 cursor-pointer">
                      <input type="checkbox" className="rounded accent-primary" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4">
                <h4 className="font-bold text-sm mb-3">⚡ Ações Rápidas</h4>
                <div className="space-y-2">
                  {['Prescrição Digital', 'Solicitar Exames', 'Atestado Médico', 'Encaminhamento', 'Exportar Prontuário'].map((action, i) => (
                    <button key={i} className="w-full text-left px-3 py-2 bg-background/50 rounded-lg text-xs hover:bg-accent transition border border-border/50">
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Histórico */}
      {tela === 'historico' && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">📋 Histórico de Teleconsultas (Simulação)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="p-3 text-xs text-muted-foreground">ID</th>
                  <th className="p-3 text-xs text-muted-foreground">Paciente</th>
                  <th className="p-3 text-xs text-muted-foreground">Data/Hora</th>
                  <th className="p-3 text-xs text-muted-foreground">Especialidade</th>
                  <th className="p-3 text-xs text-muted-foreground">Tipo</th>
                  <th className="p-3 text-xs text-muted-foreground">Status</th>
                  <th className="p-3 text-xs text-muted-foreground">Duração</th>
                </tr>
              </thead>
              <tbody>
                {consultas.map(c => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20 transition cursor-pointer">
                    <td className="p-3 font-mono text-xs">{c.id}</td>
                    <td className="p-3">{c.paciente}</td>
                    <td className="p-3 text-foreground/70">{c.data} {c.hora}</td>
                    <td className="p-3 text-foreground/70">{c.especialidade}</td>
                    <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${tipoLabel(c.tipo).color}`}>{tipoLabel(c.tipo).label}</span></td>
                    <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(c.status)}`}>{c.status}</span></td>
                    <td className="p-3 text-foreground/70">{c.duracao || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Configurações */}
      {tela === 'configuracoes' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">⚙️ Configurações de Telemedicina</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-primary">Configurações de Vídeo</h4>
                {['Qualidade HD (720p)', 'Gravação automática', 'Compartilhamento de tela', 'Fundo virtual'].map((opt, i) => (
                  <label key={i} className="flex items-center justify-between text-sm">
                    <span className="text-foreground/70">{opt}</span>
                    <div className="w-10 h-5 bg-primary/30 rounded-full relative cursor-pointer">
                      <div className={`w-4 h-4 rounded-full absolute top-0.5 transition-all ${i < 2 ? 'right-0.5 bg-primary' : 'left-0.5 bg-muted-foreground'}`} />
                    </div>
                  </label>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-primary">Conformidade</h4>
                {['Criptografia ponta a ponta (E2E)', 'Termo de consentimento obrigatório', 'Registro automático no prontuário', 'Assinatura digital ICP-Brasil'].map((opt, i) => (
                  <label key={i} className="flex items-center justify-between text-sm">
                    <span className="text-foreground/70">{opt}</span>
                    <div className="w-10 h-5 bg-primary/30 rounded-full relative cursor-pointer">
                      <div className="w-4 h-4 rounded-full absolute top-0.5 right-0.5 bg-primary" />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer disclaimer */}
      <EducationalDisclaimer variant="footer" showAIWarning />
    </div>
  );
}
