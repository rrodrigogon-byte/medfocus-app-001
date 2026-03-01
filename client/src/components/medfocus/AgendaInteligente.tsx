/**
 * MedFocus — Agenda Inteligente com IA (Sprint 25)
 * 
 * Sistema avançado de agendamento com:
 * - Agendamento preditivo (IA sugere melhores horários)
 * - Lembretes automáticos via WhatsApp
 * - Visualização semanal/diária/mensal
 * - Gestão de encaixes e lista de espera
 * - Bloqueio de horários e intervalos
 * - Confirmação automática de consultas
 * - Analytics de no-show e taxa de ocupação
 * 
 * DISCLAIMER: Ferramenta exclusivamente educacional e de apoio ao estudo.
 */

import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

type VisaoAgenda = 'dia' | 'semana' | 'mes';
type StatusConsulta = 'agendada' | 'confirmada' | 'em-atendimento' | 'concluida' | 'cancelada' | 'no-show' | 'lista-espera';
type TipoConsulta = 'primeira-vez' | 'retorno' | 'urgencia' | 'telemedicina' | 'procedimento' | 'exame';

interface Consulta {
  id: string;
  paciente: string;
  telefone: string;
  medico: string;
  especialidade: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  tipo: TipoConsulta;
  status: StatusConsulta;
  convenio?: string;
  observacao?: string;
  lembreteEnviado: boolean;
  confirmadoPor?: 'whatsapp' | 'telefone' | 'app' | 'presencial';
  valorConsulta?: number;
}

interface HorarioDisponivel {
  hora: string;
  disponivel: boolean;
  motivo?: string;
}

interface SugestaoIA {
  tipo: string;
  mensagem: string;
  acao?: string;
  prioridade: 'alta' | 'media' | 'baixa';
}

const CONSULTAS_DEMO: Consulta[] = [
  { id: 'c-001', paciente: 'João Carlos Silva', telefone: '(11) 99999-1234', medico: 'Dr. Ricardo Mendes', especialidade: 'Cardiologia', data: '2026-03-01', horaInicio: '08:00', horaFim: '08:30', tipo: 'retorno', status: 'confirmada', convenio: 'Unimed', lembreteEnviado: true, confirmadoPor: 'whatsapp', valorConsulta: 250 },
  { id: 'c-002', paciente: 'Maria Fernanda Santos', telefone: '(11) 98888-5678', medico: 'Dr. Ricardo Mendes', especialidade: 'Cardiologia', data: '2026-03-01', horaInicio: '08:30', horaFim: '09:00', tipo: 'primeira-vez', status: 'agendada', convenio: 'Bradesco Saúde', lembreteEnviado: true, valorConsulta: 350 },
  { id: 'c-003', paciente: 'Pedro Augusto Lima', telefone: '(11) 97777-9012', medico: 'Dr. Ricardo Mendes', especialidade: 'Cardiologia', data: '2026-03-01', horaInicio: '09:00', horaFim: '09:30', tipo: 'retorno', status: 'confirmada', lembreteEnviado: true, confirmadoPor: 'telefone', valorConsulta: 250 },
  { id: 'c-004', paciente: 'Ana Beatriz Costa', telefone: '(11) 96666-3456', medico: 'Dr. Ricardo Mendes', especialidade: 'Cardiologia', data: '2026-03-01', horaInicio: '09:30', horaFim: '10:00', tipo: 'telemedicina', status: 'agendada', convenio: 'SulAmérica', lembreteEnviado: false, valorConsulta: 200 },
  { id: 'c-005', paciente: 'Carlos Eduardo Rocha', telefone: '(11) 95555-7890', medico: 'Dr. Ricardo Mendes', especialidade: 'Cardiologia', data: '2026-03-01', horaInicio: '10:30', horaFim: '11:00', tipo: 'procedimento', status: 'confirmada', observacao: 'MAPA 24h — Instalação', lembreteEnviado: true, confirmadoPor: 'app', valorConsulta: 400 },
  { id: 'c-006', paciente: 'Fernanda Oliveira', telefone: '(11) 94444-1234', medico: 'Dra. Camila Souza', especialidade: 'Endocrinologia', data: '2026-03-01', horaInicio: '08:00', horaFim: '08:40', tipo: 'primeira-vez', status: 'confirmada', convenio: 'Amil', lembreteEnviado: true, confirmadoPor: 'whatsapp', valorConsulta: 300 },
  { id: 'c-007', paciente: 'Roberto Almeida', telefone: '(11) 93333-5678', medico: 'Dra. Camila Souza', especialidade: 'Endocrinologia', data: '2026-03-01', horaInicio: '08:40', horaFim: '09:20', tipo: 'retorno', status: 'no-show', lembreteEnviado: true, valorConsulta: 250 },
  { id: 'c-008', paciente: 'Luciana Martins', telefone: '(11) 92222-9012', medico: 'Dra. Camila Souza', especialidade: 'Endocrinologia', data: '2026-03-01', horaInicio: '09:20', horaFim: '10:00', tipo: 'retorno', status: 'agendada', convenio: 'Unimed', lembreteEnviado: false, valorConsulta: 250 },
  { id: 'c-009', paciente: 'Marcos Vinícius Pereira', telefone: '(11) 91111-3456', medico: 'Dr. Ricardo Mendes', especialidade: 'Cardiologia', data: '2026-03-01', horaInicio: '11:00', horaFim: '11:30', tipo: 'urgencia', status: 'em-atendimento', observacao: 'Dor torácica — encaixe de urgência', lembreteEnviado: false, valorConsulta: 350 },
  { id: 'c-010', paciente: 'Juliana Ribeiro', telefone: '(11) 90000-7890', medico: 'Dr. Ricardo Mendes', especialidade: 'Cardiologia', data: '2026-03-02', horaInicio: '08:00', horaFim: '08:30', tipo: 'retorno', status: 'agendada', convenio: 'Unimed', lembreteEnviado: false, valorConsulta: 250 },
];

const SUGESTOES_IA: SugestaoIA[] = [
  { tipo: '📊 Otimização', mensagem: 'Terça-feira tem 35% de no-show. Sugestão: agendar 2 encaixes extras às 10h e 14h.', acao: 'Aplicar sugestão', prioridade: 'alta' },
  { tipo: '📱 Lembrete', mensagem: 'Ana Beatriz Costa (09:30) não confirmou. Enviar lembrete via WhatsApp?', acao: 'Enviar lembrete', prioridade: 'alta' },
  { tipo: '⏰ Encaixe', mensagem: 'Horário das 10:00-10:30 livre. 3 pacientes na lista de espera compatíveis.', acao: 'Ver lista de espera', prioridade: 'media' },
  { tipo: '🔄 Retorno', mensagem: 'João Carlos Silva deveria retornar em 15 dias (HAS). Sugerir agendamento para 15/03?', acao: 'Agendar retorno', prioridade: 'media' },
  { tipo: '💰 Faturamento', mensagem: 'Luciana Martins (Unimed) não tem lembrete enviado. Confirmar para evitar glosa.', acao: 'Enviar confirmação', prioridade: 'alta' },
  { tipo: '📈 Tendência', mensagem: 'Últimas 4 semanas: aumento de 20% em teleconsultas. Considere ampliar horários de telemedicina.', prioridade: 'baixa' },
];

export function AgendaInteligente() {
  const [visao, setVisao] = useState<VisaoAgenda>('dia');
  const [dataSelecionada, setDataSelecionada] = useState('2026-03-01');
  const [consultas, setConsultas] = useState(CONSULTAS_DEMO);
  const [consultaSelecionada, setConsultaSelecionada] = useState<Consulta | null>(null);
  const [mostrarIA, setMostrarIA] = useState(true);
  const [filtroMedico, setFiltroMedico] = useState<string>('todos');
  const [mostrarNovaConsulta, setMostrarNovaConsulta] = useState(false);

  const consultasDoDia = consultas.filter(c => c.data === dataSelecionada && (filtroMedico === 'todos' || c.medico === filtroMedico));
  const medicos = [...new Set(consultas.map(c => c.medico))];

  const totalDia = consultasDoDia.length;
  const confirmadas = consultasDoDia.filter(c => c.status === 'confirmada' || c.status === 'em-atendimento' || c.status === 'concluida').length;
  const noShows = consultasDoDia.filter(c => c.status === 'no-show').length;
  const faturamentoDia = consultasDoDia.filter(c => c.status !== 'cancelada' && c.status !== 'no-show').reduce((acc, c) => acc + (c.valorConsulta || 0), 0);
  const taxaOcupacao = Math.round((totalDia / 16) * 100); // 16 slots de 30min (8h-16h)

  const corStatus = (s: StatusConsulta) => {
    switch (s) {
      case 'confirmada': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'agendada': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'em-atendimento': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'concluida': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      case 'cancelada': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'no-show': return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'lista-espera': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
    }
  };

  const iconeTipo = (t: TipoConsulta) => {
    switch (t) {
      case 'primeira-vez': return '🆕';
      case 'retorno': return '🔄';
      case 'urgencia': return '🚨';
      case 'telemedicina': return '📹';
      case 'procedimento': return '🔧';
      case 'exame': return '🧪';
    }
  };

  const horarios = Array.from({ length: 17 }, (_, i) => {
    const h = Math.floor(i / 2) + 8;
    const m = i % 2 === 0 ? '00' : '30';
    return `${h.toString().padStart(2, '0')}:${m}`;
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="Agenda Inteligente" />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span className="text-3xl">📅</span> Agenda Inteligente
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">IA</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Agendamento preditivo com lembretes automáticos e otimização por IA</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMostrarIA(!mostrarIA)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${mostrarIA ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
            🧠 Sugestões IA
          </button>
          <button onClick={() => setMostrarNovaConsulta(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition">
            + Nova Consulta
          </button>
        </div>
      </div>

      {/* KPIs do Dia */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Consultas Hoje', valor: totalDia, cor: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
          { label: 'Confirmadas', valor: confirmadas, cor: 'bg-green-500/20 text-green-400 border-green-500/30' },
          { label: 'No-Show', valor: noShows, cor: 'bg-red-500/20 text-red-400 border-red-500/30' },
          { label: 'Ocupação', valor: `${taxaOcupacao}%`, cor: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
          { label: 'Faturamento', valor: `R$ ${faturamentoDia.toLocaleString('pt-BR')}`, cor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
        ].map(s => (
          <div key={s.label} className={`${s.cor} border rounded-xl p-3 text-center`}>
            <p className="text-xl font-bold">{s.valor}</p>
            <p className="text-[10px]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Sugestões da IA */}
      {mostrarIA && (
        <div className="mb-6 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/30 rounded-xl p-4">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">🧠 Sugestões Inteligentes da IA</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {SUGESTOES_IA.map((s, i) => (
              <div key={i} className={`bg-card/80 border rounded-lg p-3 ${
                s.prioridade === 'alta' ? 'border-red-500/30' : s.prioridade === 'media' ? 'border-yellow-500/30' : 'border-border'
              }`}>
                <p className="text-[10px] font-bold mb-1">{s.tipo}</p>
                <p className="text-xs text-foreground/70">{s.mensagem}</p>
                {s.acao && (
                  <button className="mt-2 text-[10px] text-primary hover:underline font-medium">{s.acao} →</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controles */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex gap-1.5">
          {(['dia', 'semana', 'mes'] as const).map(v => (
            <button key={v} onClick={() => setVisao(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${visao === v ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
              {v === 'dia' ? '📋 Dia' : v === 'semana' ? '📅 Semana' : '📆 Mês'}
            </button>
          ))}
        </div>
        <input type="date" value={dataSelecionada} onChange={e => setDataSelecionada(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs" />
        <select value={filtroMedico} onChange={e => setFiltroMedico(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs">
          <option value="todos">Todos os médicos</option>
          {medicos.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Agenda do Dia */}
      {!consultaSelecionada ? (
        <div className="space-y-2">
          {horarios.map(hora => {
            const consultasHora = consultasDoDia.filter(c => c.horaInicio === hora);
            return (
              <div key={hora} className="flex gap-3 items-start">
                <div className="w-14 text-xs text-muted-foreground font-mono pt-2 text-right">{hora}</div>
                <div className="flex-1 min-h-[48px]">
                  {consultasHora.length > 0 ? (
                    <div className="space-y-1">
                      {consultasHora.map(c => (
                        <div key={c.id} onClick={() => setConsultaSelecionada(c)}
                          className={`border rounded-lg p-3 cursor-pointer transition hover:border-primary/50 ${
                            c.status === 'em-atendimento' ? 'border-yellow-500/50 bg-yellow-500/5 animate-pulse' :
                            c.status === 'no-show' ? 'border-red-500/30 bg-red-500/5 opacity-60' : 'border-border bg-card'
                          }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>{iconeTipo(c.tipo)}</span>
                              <span className="font-bold text-sm">{c.paciente}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${corStatus(c.status)}`}>
                                {c.status.replace('-', ' ').toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {c.convenio && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">{c.convenio}</span>}
                              <span className="text-[10px] text-muted-foreground">{c.horaInicio}-{c.horaFim}</span>
                              {c.lembreteEnviado && <span className="text-[10px]" title="Lembrete enviado">📱✓</span>}
                              {c.confirmadoPor && <span className="text-[10px]" title={`Confirmado via ${c.confirmadoPor}`}>✅</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] text-muted-foreground">{c.medico} • {c.especialidade}</span>
                            {c.observacao && <span className="text-[10px] text-yellow-400">📝 {c.observacao}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-dashed border-border/50 rounded-lg p-2 text-center text-[10px] text-muted-foreground/50 hover:border-primary/30 cursor-pointer transition">
                      Horário disponível
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detalhe da Consulta */
        <div className="space-y-4">
          <button onClick={() => setConsultaSelecionada(null)} className="text-sm text-primary hover:underline">← Voltar à agenda</button>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{iconeTipo(consultaSelecionada.tipo)}</span>
              <div>
                <h3 className="text-lg font-bold">{consultaSelecionada.paciente}</h3>
                <p className="text-xs text-muted-foreground">{consultaSelecionada.medico} • {consultaSelecionada.especialidade}</p>
              </div>
              <span className={`ml-auto text-xs px-2 py-1 rounded-full border ${corStatus(consultaSelecionada.status)}`}>
                {consultaSelecionada.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground">Data</p>
                <p className="text-sm font-bold">{new Date(consultaSelecionada.data + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground">Horário</p>
                <p className="text-sm font-bold">{consultaSelecionada.horaInicio} - {consultaSelecionada.horaFim}</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground">Telefone</p>
                <p className="text-sm font-bold">{consultaSelecionada.telefone}</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground">Valor</p>
                <p className="text-sm font-bold">R$ {consultaSelecionada.valorConsulta?.toLocaleString('pt-BR')}</p>
              </div>
            </div>

            {consultaSelecionada.convenio && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-3">
                <p className="text-xs"><strong>Convênio:</strong> {consultaSelecionada.convenio}</p>
              </div>
            )}
            {consultaSelecionada.observacao && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-3">
                <p className="text-xs"><strong>Observação:</strong> {consultaSelecionada.observacao}</p>
              </div>
            )}

            <div className="flex gap-2 flex-wrap mt-4">
              <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700">✅ Confirmar</button>
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700">📱 Enviar Lembrete WhatsApp</button>
              <button className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg text-xs hover:bg-yellow-700">📋 Abrir Prontuário</button>
              <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs hover:bg-purple-700">🔄 Reagendar</button>
              <button className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700">❌ Cancelar</button>
            </div>
          </div>

          {/* Histórico do Paciente */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h4 className="text-sm font-bold mb-3">📋 Histórico de Consultas do Paciente</h4>
            <div className="space-y-2">
              {[
                { data: '28/02/2026', medico: 'Dr. Ricardo Mendes', tipo: 'Retorno', status: 'Concluída' },
                { data: '15/02/2026', medico: 'Dr. Ricardo Mendes', tipo: 'Primeira vez', status: 'Concluída' },
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between bg-background/50 rounded-lg p-2">
                  <span className="text-xs">{h.data} — {h.medico}</span>
                  <span className="text-[10px] text-muted-foreground">{h.tipo} • {h.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Nova Consulta */}
      {mostrarNovaConsulta && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">📅 Nova Consulta</h3>
            <div className="space-y-3">
              {[
                { label: 'Paciente', placeholder: 'Nome do paciente' },
                { label: 'Telefone', placeholder: '(11) 99999-9999' },
                { label: 'Médico', placeholder: 'Selecione o médico' },
                { label: 'Data', placeholder: 'DD/MM/AAAA', type: 'date' },
                { label: 'Horário', placeholder: 'HH:MM' },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-medium block mb-1">{f.label}</label>
                  <input type={f.type || 'text'} placeholder={f.placeholder}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium block mb-1">Tipo</label>
                <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                  <option>Primeira vez</option><option>Retorno</option><option>Urgência</option>
                  <option>Telemedicina</option><option>Procedimento</option><option>Exame</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Convênio</label>
                <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                  <option>Particular</option><option>Unimed</option><option>Bradesco Saúde</option>
                  <option>SulAmérica</option><option>Amil</option><option>NotreDame Intermédica</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Observação</label>
                <textarea placeholder="Observações sobre a consulta..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm h-20 resize-none" />
              </div>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                <p className="text-xs">🧠 <strong>Sugestão IA:</strong> Melhor horário disponível para este paciente: <strong>10:00</strong> (baseado no histórico de comparecimento e preferências).</p>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setMostrarNovaConsulta(false)} className="px-4 py-2 bg-card border border-border rounded-lg text-xs">Cancelar</button>
                <button onClick={() => setMostrarNovaConsulta(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium">Agendar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <EducationalDisclaimer variant="footer" />
    </div>
  );
}
