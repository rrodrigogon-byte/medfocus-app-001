/**
 * Timeline Clínica Inteligente — Histórico Visual do Paciente
 * Sprint 63: Visualização cronológica de eventos clínicos
 * 
 * Funcionalidades:
 * - Timeline visual interativa com zoom temporal
 * - Categorias: consultas, exames, medicações, internações, cirurgias
 * - Filtros por tipo de evento e período
 * - Correlação entre eventos (causa-efeito)
 * - Alertas de interações e duplicidades
 * - Exportação do histórico
 */
import React, { useState, useMemo } from 'react';

interface ClinicalEvent {
  id: string;
  date: string;
  type: 'consulta' | 'exame' | 'medicacao' | 'internacao' | 'cirurgia' | 'vacina' | 'alerta';
  title: string;
  description: string;
  professional?: string;
  specialty?: string;
  location?: string;
  results?: string;
  severity?: 'normal' | 'attention' | 'critical';
  relatedEvents?: string[];
  tags?: string[];
}

interface PatientProfile {
  name: string;
  age: number;
  sex: string;
  bloodType: string;
  allergies: string[];
  conditions: string[];
}

const DEMO_PATIENT: PatientProfile = {
  name: 'Maria Aparecida Santos',
  age: 62,
  sex: 'Feminino',
  bloodType: 'A+',
  allergies: ['Dipirona', 'Contraste iodado'],
  conditions: ['Hipertensão arterial', 'Diabetes mellitus tipo 2', 'Dislipidemia', 'Hipotireoidismo'],
};

const DEMO_EVENTS: ClinicalEvent[] = [
  { id: 'e1', date: '2026-02-28', type: 'consulta', title: 'Consulta Cardiologia', description: 'Retorno para avaliação de PA e ajuste medicamentoso. PA 148/92. Adicionado anlodipino 5mg.', professional: 'Dr. Ricardo Almeida', specialty: 'Cardiologia', severity: 'attention', tags: ['HAS', 'ajuste-medicamentoso'] },
  { id: 'e2', date: '2026-02-25', type: 'exame', title: 'Hemoglobina Glicada (HbA1c)', description: 'HbA1c: 7.8% (meta <7%). Glicemia de jejum: 142 mg/dL.', results: 'HbA1c 7.8% — Acima da meta', severity: 'attention', tags: ['DM2', 'controle-glicemico'], relatedEvents: ['e5'] },
  { id: 'e3', date: '2026-02-20', type: 'medicacao', title: 'Início de Anlodipino 5mg', description: 'Prescrito anlodipino 5mg 1x/dia pela manhã para melhor controle pressórico.', professional: 'Dr. Ricardo Almeida', severity: 'normal', tags: ['HAS', 'anti-hipertensivo'], relatedEvents: ['e1'] },
  { id: 'e4', date: '2026-02-15', type: 'exame', title: 'Ecocardiograma Transtorácico', description: 'FE 58% (preservada). Disfunção diastólica grau I. HVE concêntrica leve. Sem valvopatias significativas.', results: 'FE 58% — Disfunção diastólica grau I', severity: 'attention', tags: ['HAS', 'cardiopatia-hipertensiva'] },
  { id: 'e5', date: '2026-02-10', type: 'consulta', title: 'Consulta Endocrinologia', description: 'Ajuste de metformina para 1000mg 12/12h. Solicitada HbA1c e perfil lipídico. Orientada dieta e atividade física.', professional: 'Dra. Camila Ferreira', specialty: 'Endocrinologia', severity: 'normal', tags: ['DM2', 'dislipidemia'] },
  { id: 'e6', date: '2026-02-01', type: 'vacina', title: 'Vacina Influenza 2026', description: 'Vacina influenza quadrivalente, dose anual. Sem reações adversas.', location: 'UBS Centro', severity: 'normal', tags: ['imunizacao'] },
  { id: 'e7', date: '2026-01-20', type: 'exame', title: 'Perfil Lipídico', description: 'CT: 245, LDL: 158, HDL: 42, TG: 225. Dislipidemia mista não controlada.', results: 'LDL 158 — Acima da meta (<100)', severity: 'critical', tags: ['dislipidemia', 'risco-cardiovascular'], relatedEvents: ['e5'] },
  { id: 'e8', date: '2026-01-15', type: 'medicacao', title: 'Aumento de Rosuvastatina', description: 'Rosuvastatina aumentada de 10mg para 20mg/dia devido LDL acima da meta.', professional: 'Dra. Camila Ferreira', severity: 'attention', tags: ['dislipidemia'], relatedEvents: ['e7'] },
  { id: 'e9', date: '2026-01-05', type: 'consulta', title: 'Consulta Clínica Geral', description: 'Check-up anual. Solicitados exames de rotina. Queixa de fadiga e ganho ponderal. TSH solicitado.', professional: 'Dr. Paulo Mendes', specialty: 'Clínica Médica', severity: 'normal', tags: ['check-up'] },
  { id: 'e10', date: '2025-12-20', type: 'exame', title: 'TSH e T4 Livre', description: 'TSH: 8.5 mUI/L (elevado). T4L: 0.7 ng/dL (baixo). Hipotireoidismo subclínico → clínico.', results: 'TSH 8.5 — Hipotireoidismo', severity: 'critical', tags: ['hipotireoidismo'], relatedEvents: ['e11'] },
  { id: 'e11', date: '2025-12-15', type: 'medicacao', title: 'Início de Levotiroxina 50mcg', description: 'Iniciada levotiroxina 50mcg em jejum pela manhã. Controle de TSH em 6 semanas.', professional: 'Dra. Camila Ferreira', severity: 'normal', tags: ['hipotireoidismo'], relatedEvents: ['e10'] },
  { id: 'e12', date: '2025-11-10', type: 'internacao', title: 'Internação — Crise Hipertensiva', description: 'Internada por crise hipertensiva (PA 220/130). Cefaleia intensa, náuseas. Tratada com nitroprussiato IV. Alta em 48h com ajuste medicamentoso.', location: 'Hospital São Lucas', severity: 'critical', tags: ['HAS', 'emergencia-hipertensiva'] },
  { id: 'e13', date: '2025-10-05', type: 'exame', title: 'Fundoscopia', description: 'Retinopatia hipertensiva grau II. Sem retinopatia diabética. Acompanhamento anual.', results: 'Retinopatia hipertensiva grau II', severity: 'attention', tags: ['HAS', 'retinopatia'] },
  { id: 'e14', date: '2025-08-20', type: 'cirurgia', title: 'Colecistectomia Videolaparoscópica', description: 'Colecistectomia por colelitíase sintomática. Procedimento sem intercorrências. Alta em 24h.', professional: 'Dr. Fernando Costa', location: 'Hospital São Lucas', severity: 'normal', tags: ['cirurgia', 'colecistectomia'] },
  { id: 'e15', date: '2025-06-15', type: 'alerta', title: 'Alerta: Interação Medicamentosa', description: 'Detectada interação entre Metformina e Contraste Iodado (risco de acidose láctica). Suspender metformina 48h antes de exames contrastados.', severity: 'critical', tags: ['interacao', 'alerta-seguranca'] },
];

const EVENT_CONFIG: Record<ClinicalEvent['type'], { icon: string; color: string; label: string }> = {
  consulta: { icon: '🩺', color: 'cyan', label: 'Consulta' },
  exame: { icon: '🔬', color: 'purple', label: 'Exame' },
  medicacao: { icon: '💊', color: 'blue', label: 'Medicação' },
  internacao: { icon: '🏥', color: 'red', label: 'Internação' },
  cirurgia: { icon: '🔪', color: 'orange', label: 'Cirurgia' },
  vacina: { icon: '💉', color: 'green', label: 'Vacina' },
  alerta: { icon: '⚠️', color: 'yellow', label: 'Alerta' },
};

export default function TimelineClinica() {
  const [selectedTypes, setSelectedTypes] = useState<Set<ClinicalEvent['type']>>(new Set(['consulta', 'exame', 'medicacao', 'internacao', 'cirurgia', 'vacina', 'alerta']));
  const [selectedEvent, setSelectedEvent] = useState<ClinicalEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'timeline' | 'summary' | 'medications'>('timeline');

  const toggleType = (type: ClinicalEvent['type']) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  };

  const filteredEvents = useMemo(() => {
    return DEMO_EVENTS
      .filter(e => selectedTypes.has(e.type))
      .filter(e => !searchTerm || e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.description.toLowerCase().includes(searchTerm.toLowerCase()) || e.tags?.some(t => t.includes(searchTerm.toLowerCase())))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedTypes, searchTerm]);

  const eventsByMonth = useMemo(() => {
    const groups: Record<string, ClinicalEvent[]> = {};
    filteredEvents.forEach(e => {
      const month = e.date.slice(0, 7);
      if (!groups[month]) groups[month] = [];
      groups[month].push(e);
    });
    return groups;
  }, [filteredEvents]);

  const currentMedications = [
    { name: 'Losartana 50mg', dose: '1cp 12/12h', since: '2024-03', indication: 'HAS' },
    { name: 'Anlodipino 5mg', dose: '1cp pela manhã', since: '2026-02', indication: 'HAS' },
    { name: 'Metformina 1000mg', dose: '1cp 12/12h', since: '2023-08', indication: 'DM2' },
    { name: 'Rosuvastatina 20mg', dose: '1cp à noite', since: '2026-01', indication: 'Dislipidemia' },
    { name: 'Levotiroxina 50mcg', dose: '1cp em jejum', since: '2025-12', indication: 'Hipotireoidismo' },
    { name: 'AAS 100mg', dose: '1cp após almoço', since: '2025-11', indication: 'Prevenção CV' },
  ];

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500/50 bg-red-500/5';
      case 'attention': return 'border-yellow-500/50 bg-yellow-500/5';
      default: return 'border-border bg-card';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span className="text-3xl">📋</span> Timeline Clínica Inteligente
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Histórico visual cronológico do paciente</p>
        </div>
        <div className="flex gap-2">
          {(['timeline', 'summary', 'medications'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === v ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
              {v === 'timeline' ? '📅 Timeline' : v === 'summary' ? '📊 Resumo' : '💊 Medicações'}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Card */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-full flex items-center justify-center text-2xl">👩‍🦳</div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{DEMO_PATIENT.name}</h2>
              <p className="text-xs text-muted-foreground">{DEMO_PATIENT.age} anos • {DEMO_PATIENT.sex} • Tipo sanguíneo: {DEMO_PATIENT.bloodType}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {DEMO_PATIENT.allergies.map(a => (
              <span key={a} className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] text-red-400 font-bold">⚠️ {a}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {DEMO_PATIENT.conditions.map(c => (
            <span key={c} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-medium">{c}</span>
          ))}
        </div>
      </div>

      {view === 'timeline' && (
        <>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar eventos..."
              className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex flex-wrap gap-1.5">
              {(Object.entries(EVENT_CONFIG) as [ClinicalEvent['type'], typeof EVENT_CONFIG[ClinicalEvent['type']]][]).map(([type, config]) => (
                <button key={type} onClick={() => toggleType(type)} className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${selectedTypes.has(type) ? `bg-${config.color}-500/20 text-${config.color}-400 border border-${config.color}-500/30` : 'bg-muted/30 text-muted-foreground border border-transparent'}`}>
                  {config.icon} {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

            {Object.entries(eventsByMonth).map(([month, events]) => (
              <div key={month} className="mb-6">
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <div className="w-12 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary-foreground">
                      {new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </span>
                  <span className="text-[10px] text-muted-foreground">({events.length} eventos)</span>
                </div>

                <div className="space-y-3 ml-2">
                  {events.map(event => {
                    const config = EVENT_CONFIG[event.type];
                    return (
                      <div key={event.id} className="flex items-start gap-3 relative">
                        {/* Dot */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm z-10 shrink-0 ${event.severity === 'critical' ? 'bg-red-500/20 ring-2 ring-red-500/50' : event.severity === 'attention' ? 'bg-yellow-500/20' : 'bg-muted/50'}`}>
                          {config.icon}
                        </div>

                        {/* Card */}
                        <button
                          onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                          className={`flex-1 border rounded-xl p-3 text-left transition-all hover:shadow-md ${getSeverityColor(event.severity)} ${selectedEvent?.id === event.id ? 'ring-2 ring-primary/50' : ''}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-bold text-foreground">{event.title}</h4>
                            <span className="text-[10px] text-muted-foreground">{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>

                          {/* Expanded details */}
                          {selectedEvent?.id === event.id && (
                            <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                              {event.professional && <p className="text-xs text-foreground"><strong>Profissional:</strong> {event.professional}</p>}
                              {event.specialty && <p className="text-xs text-foreground"><strong>Especialidade:</strong> {event.specialty}</p>}
                              {event.location && <p className="text-xs text-foreground"><strong>Local:</strong> {event.location}</p>}
                              {event.results && (
                                <div className="p-2 bg-muted/20 rounded-lg">
                                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Resultado</p>
                                  <p className="text-xs text-foreground font-medium">{event.results}</p>
                                </div>
                              )}
                              {event.tags && (
                                <div className="flex flex-wrap gap-1">
                                  {event.tags.map(t => <span key={t} className="px-1.5 py-0.5 bg-muted/50 rounded text-[9px] text-muted-foreground">#{t}</span>)}
                                </div>
                              )}
                              {event.relatedEvents && event.relatedEvents.length > 0 && (
                                <div className="text-[10px] text-primary">
                                  🔗 {event.relatedEvents.length} evento(s) relacionado(s)
                                </div>
                              )}
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Event counts */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-4">Resumo de Eventos (Últimos 12 meses)</h3>
            <div className="space-y-3">
              {(Object.entries(EVENT_CONFIG) as [ClinicalEvent['type'], typeof EVENT_CONFIG[ClinicalEvent['type']]][]).map(([type, config]) => {
                const count = DEMO_EVENTS.filter(e => e.type === type).length;
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{config.icon}</span>
                      <span className="text-sm text-foreground">{config.label}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Critical alerts */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-4">Alertas Críticos</h3>
            <div className="space-y-3">
              {DEMO_EVENTS.filter(e => e.severity === 'critical').map(e => (
                <div key={e.id} className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{EVENT_CONFIG[e.type].icon}</span>
                    <span className="text-xs font-bold text-foreground">{e.title}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{e.results || e.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{new Date(e.date).toLocaleDateString('pt-BR')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Conditions timeline */}
          <div className="bg-card border border-border rounded-xl p-5 md:col-span-2">
            <h3 className="text-sm font-bold text-foreground mb-4">Condições Crônicas Ativas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DEMO_PATIENT.conditions.map(c => (
                <div key={c} className="p-3 bg-muted/20 border border-border rounded-lg">
                  <h4 className="text-sm font-bold text-foreground">{c}</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {c.includes('Hipertensão') ? 'Última PA: 148/92 mmHg — Controle subótimo' :
                     c.includes('Diabetes') ? 'Última HbA1c: 7.8% — Acima da meta (<7%)' :
                     c.includes('Dislipidemia') ? 'Último LDL: 158 mg/dL — Acima da meta (<100)' :
                     'TSH: 8.5 — Em tratamento com levotiroxina'}
                  </p>
                  <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                    <div className={`h-full rounded-full ${c.includes('Hipertensão') ? 'bg-yellow-500 w-3/5' : c.includes('Diabetes') ? 'bg-yellow-500 w-1/2' : c.includes('Dislipidemia') ? 'bg-red-500 w-2/5' : 'bg-emerald-500 w-3/4'}`} />
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1">
                    {c.includes('Hipertensão') ? 'Controle: 60%' : c.includes('Diabetes') ? 'Controle: 50%' : c.includes('Dislipidemia') ? 'Controle: 40%' : 'Controle: 75%'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'medications' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">Medicação</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">Posologia</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">Indicação</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">Desde</th>
                </tr>
              </thead>
              <tbody>
                {currentMedications.map((med, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-accent/50">
                    <td className="px-4 py-3 font-bold text-foreground">{med.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{med.dose}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px]">{med.indication}</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{med.since}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <h3 className="text-sm font-bold text-red-400 mb-2">⚠️ Alertas de Medicação</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <p className="text-xs text-foreground"><strong>Metformina + Contraste Iodado:</strong> Suspender metformina 48h antes e após exames com contraste (risco de acidose láctica).</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-400">•</span>
                <p className="text-xs text-foreground"><strong>Levotiroxina:</strong> Tomar em jejum, 30-60min antes do café. Não tomar junto com metformina (reduz absorção).</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-400">•</span>
                <p className="text-xs text-foreground"><strong>Rosuvastatina:</strong> Monitorar CPK e função hepática. Atenção a mialgia.</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-bold text-foreground mb-2">💊 Polifarmácia — Análise</h3>
            <p className="text-xs text-muted-foreground">Paciente em uso de <strong>6 medicamentos</strong> de uso contínuo. Risco de interações: <span className="text-yellow-400 font-bold">Moderado</span>. Recomenda-se reconciliação medicamentosa periódica.</p>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-3 text-center">
        <p className="text-[10px] text-muted-foreground">
          Dados fictícios para demonstração. Em produção, integra-se com PEP/RNDS para dados reais do paciente.
        </p>
      </div>
    </div>
  );
}
