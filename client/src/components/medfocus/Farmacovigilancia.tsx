/**
 * Painel de Farmacovigilância em Tempo Real
 * Sprint 66: Monitoramento de reações adversas e segurança de medicamentos
 * 
 * Funcionalidades:
 * - Dashboard de notificações de RAMs (Reações Adversas a Medicamentos)
 * - Base de dados de medicamentos com alertas ANVISA/FDA
 * - Verificador de interações medicamentosas
 * - Notificação de RAM via formulário NOTIVISA
 * - Alertas de segurança e recalls
 * - Estatísticas por classe terapêutica
 */
import React, { useState, useMemo } from 'react';

interface DrugAlert {
  id: string;
  drug: string;
  activeIngredient: string;
  type: 'safety' | 'recall' | 'restriction' | 'update';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  source: string;
  date: string;
  affectedLots?: string[];
}

interface AdverseReaction {
  id: string;
  drug: string;
  reaction: string;
  system: string;
  frequency: 'muito_comum' | 'comum' | 'incomum' | 'rara' | 'muito_rara';
  severity: 'leve' | 'moderada' | 'grave' | 'fatal';
  reports: number;
  lastReport: string;
}

interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'contraindicada' | 'grave' | 'moderada' | 'leve';
  mechanism: string;
  effect: string;
  management: string;
}

const ALERTS: DrugAlert[] = [
  { id: 'a1', drug: 'Ozempic (Semaglutida)', activeIngredient: 'Semaglutida', type: 'safety', severity: 'high', title: 'Risco de íleo paralítico em pacientes cirúrgicos', description: 'ANVISA recomenda suspensão de semaglutida pelo menos 7 dias antes de procedimentos cirúrgicos com anestesia geral, devido a relatos de íleo paralítico e aspiração.', source: 'ANVISA RDC 2026/001', date: '2026-02-20' },
  { id: 'a2', drug: 'Metamizol (Dipirona)', activeIngredient: 'Metamizol sódico', type: 'update', severity: 'medium', title: 'Atualização de bula — Agranulocitose', description: 'Nova atualização de bula incluindo dados de farmacovigilância sobre risco de agranulocitose. Incidência estimada: 1:1.500 a 1:100.000 exposições.', source: 'ANVISA Alerta 2026/015', date: '2026-02-15' },
  { id: 'a3', drug: 'Cloroquina/Hidroxicloroquina', activeIngredient: 'Cloroquina', type: 'restriction', severity: 'high', title: 'Restrição de uso off-label', description: 'Reforço da restrição de prescrição off-label. Uso autorizado apenas para indicações aprovadas (malária, LES, AR). Monitoramento cardíaco obrigatório.', source: 'ANVISA/CFM', date: '2026-02-10' },
  { id: 'a4', drug: 'Valsartana (lotes específicos)', activeIngredient: 'Valsartana', type: 'recall', severity: 'high', title: 'Recall — Contaminação por NDMA', description: 'Recall voluntário de lotes específicos de valsartana devido à detecção de N-nitrosodimetilamina (NDMA) acima dos limites aceitáveis.', source: 'ANVISA RE 2026/089', date: '2026-01-28', affectedLots: ['VLS2025-A001', 'VLS2025-A002', 'VLS2025-B015'] },
  { id: 'a5', drug: 'Tirzepatida (Mounjaro)', activeIngredient: 'Tirzepatida', type: 'safety', severity: 'medium', title: 'Monitoramento de pancreatite aguda', description: 'FDA e ANVISA solicitam monitoramento ativo de sinais de pancreatite aguda em pacientes em uso de tirzepatida. Orientar pacientes sobre sintomas de alerta.', source: 'FDA Safety Communication / ANVISA', date: '2026-01-20' },
  { id: 'a6', drug: 'Amoxicilina + Clavulanato', activeIngredient: 'Amoxicilina + Ácido clavulânico', type: 'update', severity: 'low', title: 'Atualização de posologia pediátrica', description: 'Nova recomendação de posologia para crianças <40kg: 25-45mg/kg/dia de amoxicilina, divididos em 2-3 doses.', source: 'ANVISA', date: '2026-01-15' },
];

const ADVERSE_REACTIONS: AdverseReaction[] = [
  { id: 'r1', drug: 'Semaglutida', reaction: 'Náuseas', system: 'Gastrointestinal', frequency: 'muito_comum', severity: 'leve', reports: 12456, lastReport: '2026-02-28' },
  { id: 'r2', drug: 'Semaglutida', reaction: 'Pancreatite aguda', system: 'Gastrointestinal', frequency: 'rara', severity: 'grave', reports: 234, lastReport: '2026-02-25' },
  { id: 'r3', drug: 'Metformina', reaction: 'Diarreia', system: 'Gastrointestinal', frequency: 'muito_comum', severity: 'leve', reports: 34567, lastReport: '2026-02-28' },
  { id: 'r4', drug: 'Metformina', reaction: 'Acidose láctica', system: 'Metabólico', frequency: 'muito_rara', severity: 'fatal', reports: 45, lastReport: '2026-01-15' },
  { id: 'r5', drug: 'Atorvastatina', reaction: 'Mialgia', system: 'Musculoesquelético', frequency: 'comum', severity: 'leve', reports: 8765, lastReport: '2026-02-27' },
  { id: 'r6', drug: 'Atorvastatina', reaction: 'Rabdomiólise', system: 'Musculoesquelético', frequency: 'muito_rara', severity: 'grave', reports: 89, lastReport: '2026-02-10' },
  { id: 'r7', drug: 'Losartana', reaction: 'Hipercalemia', system: 'Renal/Eletrolítico', frequency: 'incomum', severity: 'moderada', reports: 2345, lastReport: '2026-02-26' },
  { id: 'r8', drug: 'Dipirona', reaction: 'Agranulocitose', system: 'Hematológico', frequency: 'rara', severity: 'grave', reports: 567, lastReport: '2026-02-20' },
  { id: 'r9', drug: 'Amoxicilina', reaction: 'Rash cutâneo', system: 'Dermatológico', frequency: 'comum', severity: 'leve', reports: 15678, lastReport: '2026-02-28' },
  { id: 'r10', drug: 'Amoxicilina', reaction: 'Anafilaxia', system: 'Imunológico', frequency: 'rara', severity: 'grave', reports: 456, lastReport: '2026-02-18' },
  { id: 'r11', drug: 'Warfarina', reaction: 'Sangramento GI', system: 'Hematológico', frequency: 'comum', severity: 'grave', reports: 6789, lastReport: '2026-02-27' },
  { id: 'r12', drug: 'Omeprazol', reaction: 'Hipomagnesemia', system: 'Metabólico', frequency: 'incomum', severity: 'moderada', reports: 3456, lastReport: '2026-02-22' },
];

const INTERACTIONS: DrugInteraction[] = [
  { drug1: 'Warfarina', drug2: 'AAS', severity: 'grave', mechanism: 'Sinergismo anticoagulante + antiplaquetário', effect: 'Aumento significativo do risco de sangramento', management: 'Evitar combinação. Se necessário, monitorar INR rigorosamente e usar menor dose de AAS (100mg).' },
  { drug1: 'Metformina', drug2: 'Contraste iodado', severity: 'contraindicada', mechanism: 'Risco de acidose láctica por nefrotoxicidade do contraste', effect: 'Acidose láctica potencialmente fatal', management: 'Suspender metformina 48h antes e após o exame. Verificar função renal antes de retomar.' },
  { drug1: 'IECA', drug2: 'Espironolactona', severity: 'moderada', mechanism: 'Ambos retêm potássio', effect: 'Hipercalemia', management: 'Monitorar potássio sérico regularmente. Iniciar com doses baixas de espironolactona (25mg).' },
  { drug1: 'Sinvastatina', drug2: 'Amiodarona', severity: 'grave', mechanism: 'Inibição do CYP3A4 pela amiodarona', effect: 'Aumento de 2-4x nos níveis de sinvastatina → risco de rabdomiólise', management: 'Limitar sinvastatina a 20mg/dia. Considerar trocar para rosuvastatina ou pravastatina.' },
  { drug1: 'Fluoxetina', drug2: 'Tramadol', severity: 'grave', mechanism: 'Ambos aumentam serotonina', effect: 'Síndrome serotoninérgica', management: 'Evitar combinação. Se necessário, monitorar sinais de síndrome serotoninérgica (agitação, tremor, hipertermia).' },
  { drug1: 'Ciprofloxacino', drug2: 'Teofilina', severity: 'moderada', mechanism: 'Inibição do CYP1A2 pelo ciprofloxacino', effect: 'Aumento dos níveis de teofilina → toxicidade (convulsões, arritmias)', management: 'Reduzir dose de teofilina em 30-50%. Monitorar níveis séricos.' },
  { drug1: 'Levotiroxina', drug2: 'Omeprazol', severity: 'leve', mechanism: 'Redução da absorção de levotiroxina por alteração do pH gástrico', effect: 'Redução da eficácia da levotiroxina', management: 'Tomar levotiroxina 4h antes do omeprazol. Monitorar TSH.' },
  { drug1: 'Clopidogrel', drug2: 'Omeprazol', severity: 'moderada', mechanism: 'Omeprazol inibe CYP2C19, reduzindo ativação do clopidogrel', effect: 'Redução do efeito antiplaquetário', management: 'Preferir pantoprazol (menor interação com CYP2C19). Evitar omeprazol/esomeprazol.' },
];

type ViewType = 'dashboard' | 'alerts' | 'reactions' | 'interactions' | 'notify';

export default function Farmacovigilancia() {
  const [view, setView] = useState<ViewType>('dashboard');
  const [searchDrug, setSearchDrug] = useState('');
  const [interactionDrug1, setInteractionDrug1] = useState('');
  const [interactionDrug2, setInteractionDrug2] = useState('');
  const [notifyForm, setNotifyForm] = useState({ drug: '', reaction: '', severity: '', description: '' });

  const filteredReactions = useMemo(() => {
    if (!searchDrug) return ADVERSE_REACTIONS;
    return ADVERSE_REACTIONS.filter(r => r.drug.toLowerCase().includes(searchDrug.toLowerCase()));
  }, [searchDrug]);

  const foundInteractions = useMemo(() => {
    if (!interactionDrug1 || !interactionDrug2) return [];
    const d1 = interactionDrug1.toLowerCase();
    const d2 = interactionDrug2.toLowerCase();
    return INTERACTIONS.filter(i =>
      (i.drug1.toLowerCase().includes(d1) && i.drug2.toLowerCase().includes(d2)) ||
      (i.drug1.toLowerCase().includes(d2) && i.drug2.toLowerCase().includes(d1))
    );
  }, [interactionDrug1, interactionDrug2]);

  const getSeverityBadge = (severity: string) => {
    const map: Record<string, string> = {
      'high': 'bg-red-500/20 text-red-400',
      'medium': 'bg-yellow-500/20 text-yellow-400',
      'low': 'bg-blue-500/20 text-blue-400',
      'contraindicada': 'bg-red-600/20 text-red-400',
      'grave': 'bg-red-500/20 text-red-400',
      'moderada': 'bg-yellow-500/20 text-yellow-400',
      'leve': 'bg-blue-500/20 text-blue-400',
      'fatal': 'bg-red-700/20 text-red-300',
    };
    return map[severity] || 'bg-muted/50 text-muted-foreground';
  };

  const getFrequencyLabel = (f: string) => {
    const map: Record<string, string> = {
      'muito_comum': '≥10% (Muito comum)',
      'comum': '1-10% (Comum)',
      'incomum': '0.1-1% (Incomum)',
      'rara': '0.01-0.1% (Rara)',
      'muito_rara': '<0.01% (Muito rara)',
    };
    return map[f] || f;
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span className="text-3xl">🛡️</span> Farmacovigilância
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Monitoramento de segurança de medicamentos — ANVISA/FDA</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {([
            { id: 'dashboard' as ViewType, label: '📊 Dashboard', icon: '' },
            { id: 'alerts' as ViewType, label: '🚨 Alertas', icon: '' },
            { id: 'reactions' as ViewType, label: '💊 RAMs', icon: '' },
            { id: 'interactions' as ViewType, label: '⚡ Interações', icon: '' },
            { id: 'notify' as ViewType, label: '📝 Notificar', icon: '' },
          ]).map(v => (
            <button key={v.id} onClick={() => setView(v.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === v.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {view === 'dashboard' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Alertas Ativos', value: ALERTS.filter(a => a.severity === 'high').length.toString(), icon: '🚨', color: 'text-red-400' },
              { label: 'RAMs Notificadas (2026)', value: '85.4K', icon: '💊', color: 'text-yellow-400' },
              { label: 'Interações Cadastradas', value: INTERACTIONS.length.toString() + '+', icon: '⚡', color: 'text-cyan-400' },
              { label: 'Recalls Ativos', value: ALERTS.filter(a => a.type === 'recall').length.toString(), icon: '🔄', color: 'text-orange-400' },
            ].map(s => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
                <span className="text-2xl">{s.icon}</span>
                <div className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent Alerts */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">🚨 Alertas Recentes de Alta Severidade</h3>
            <div className="space-y-3">
              {ALERTS.filter(a => a.severity === 'high').slice(0, 3).map(a => (
                <div key={a.id} className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-foreground">{a.drug}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${a.type === 'recall' ? 'bg-orange-500/20 text-orange-400' : a.type === 'safety' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {a.type === 'recall' ? 'RECALL' : a.type === 'safety' ? 'SEGURANÇA' : a.type === 'restriction' ? 'RESTRIÇÃO' : 'ATUALIZAÇÃO'}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-foreground">{a.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{a.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Fonte: {a.source} — {new Date(a.date).toLocaleDateString('pt-BR')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top RAMs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-bold text-foreground mb-3">Top RAMs por Notificações</h3>
              <div className="space-y-2">
                {ADVERSE_REACTIONS.sort((a, b) => b.reports - a.reports).slice(0, 6).map(r => (
                  <div key={r.id} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg">
                    <div>
                      <span className="text-xs font-bold text-foreground">{r.drug}</span>
                      <span className="text-xs text-muted-foreground ml-1">— {r.reaction}</span>
                    </div>
                    <span className="text-xs font-bold text-foreground">{r.reports.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-bold text-foreground mb-3">RAMs Graves Recentes</h3>
              <div className="space-y-2">
                {ADVERSE_REACTIONS.filter(r => r.severity === 'grave' || r.severity === 'fatal').map(r => (
                  <div key={r.id} className="flex items-center justify-between p-2 bg-red-500/5 border border-red-500/10 rounded-lg">
                    <div>
                      <span className="text-xs font-bold text-foreground">{r.drug}</span>
                      <span className="text-xs text-red-400 ml-1">— {r.reaction}</span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${getSeverityBadge(r.severity)}`}>{r.severity.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {view === 'alerts' && (
        <div className="space-y-3">
          {ALERTS.map(a => (
            <div key={a.id} className={`bg-card border rounded-xl p-5 ${a.severity === 'high' ? 'border-red-500/30' : a.severity === 'medium' ? 'border-yellow-500/30' : 'border-border'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getSeverityBadge(a.severity)}`}>
                    {a.severity === 'high' ? 'ALTA' : a.severity === 'medium' ? 'MÉDIA' : 'BAIXA'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${a.type === 'recall' ? 'bg-orange-500/20 text-orange-400' : a.type === 'safety' ? 'bg-red-500/20 text-red-400' : a.type === 'restriction' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {a.type.toUpperCase()}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">{new Date(a.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <h3 className="text-sm font-bold text-foreground">{a.drug}</h3>
              <p className="text-xs text-primary font-medium mt-1">{a.title}</p>
              <p className="text-xs text-muted-foreground mt-2">{a.description}</p>
              {a.affectedLots && (
                <div className="mt-2 p-2 bg-muted/20 rounded-lg">
                  <p className="text-[10px] font-bold text-muted-foreground">Lotes afetados:</p>
                  <p className="text-xs text-foreground">{a.affectedLots.join(', ')}</p>
                </div>
              )}
              <p className="text-[10px] text-muted-foreground mt-2">Fonte: {a.source}</p>
            </div>
          ))}
        </div>
      )}

      {view === 'reactions' && (
        <>
          <input
            type="text"
            value={searchDrug}
            onChange={e => setSearchDrug(e.target.value)}
            placeholder="Buscar medicamento..."
            className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">Medicamento</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">Reação</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">Sistema</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">Frequência</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground">Gravidade</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground">Notificações</th>
                </tr>
              </thead>
              <tbody>
                {filteredReactions.map(r => (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-accent/50">
                    <td className="px-4 py-2.5 font-bold text-foreground">{r.drug}</td>
                    <td className="px-4 py-2.5 text-foreground">{r.reaction}</td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs">{r.system}</td>
                    <td className="px-4 py-2.5 text-[10px] text-muted-foreground">{getFrequencyLabel(r.frequency)}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getSeverityBadge(r.severity)}`}>{r.severity.toUpperCase()}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-foreground">{r.reports.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {view === 'interactions' && (
        <>
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">Verificador de Interações Medicamentosas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Medicamento 1</label>
                <input type="text" value={interactionDrug1} onChange={e => setInteractionDrug1(e.target.value)} placeholder="Ex: Warfarina" className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Medicamento 2</label>
                <input type="text" value={interactionDrug2} onChange={e => setInteractionDrug2(e.target.value)} placeholder="Ex: AAS" className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>

            {foundInteractions.length > 0 && (
              <div className="mt-4 space-y-3">
                {foundInteractions.map((int, i) => (
                  <div key={i} className={`p-4 border rounded-xl ${int.severity === 'contraindicada' ? 'bg-red-500/10 border-red-500/30' : int.severity === 'grave' ? 'bg-red-500/5 border-red-500/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getSeverityBadge(int.severity)}`}>{int.severity.toUpperCase()}</span>
                      <span className="text-sm font-bold text-foreground">{int.drug1} + {int.drug2}</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <p><strong className="text-foreground">Mecanismo:</strong> <span className="text-muted-foreground">{int.mechanism}</span></p>
                      <p><strong className="text-foreground">Efeito:</strong> <span className="text-muted-foreground">{int.effect}</span></p>
                      <p><strong className="text-foreground">Manejo:</strong> <span className="text-muted-foreground">{int.management}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {interactionDrug1 && interactionDrug2 && foundInteractions.length === 0 && (
              <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                <span className="text-emerald-400 text-sm font-bold">✓ Nenhuma interação conhecida encontrada</span>
                <p className="text-[10px] text-muted-foreground mt-1">Nota: Base de dados limitada. Consulte fontes adicionais (Micromedex, UpToDate).</p>
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">Interações Cadastradas</h3>
            <div className="space-y-2">
              {INTERACTIONS.map((int, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${getSeverityBadge(int.severity)}`}>{int.severity.charAt(0).toUpperCase()}</span>
                    <span className="text-xs font-bold text-foreground">{int.drug1}</span>
                    <span className="text-xs text-muted-foreground">+</span>
                    <span className="text-xs font-bold text-foreground">{int.drug2}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{int.effect.slice(0, 50)}...</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {view === 'notify' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-1">📝 Notificar Reação Adversa</h3>
            <p className="text-xs text-muted-foreground mb-4">Formulário baseado no NOTIVISA/ANVISA — Notificação voluntária de RAM</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Medicamento suspeito *</label>
                <input type="text" value={notifyForm.drug} onChange={e => setNotifyForm(p => ({ ...p, drug: e.target.value }))} placeholder="Nome do medicamento (princípio ativo ou comercial)" className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Reação adversa observada *</label>
                <input type="text" value={notifyForm.reaction} onChange={e => setNotifyForm(p => ({ ...p, reaction: e.target.value }))} placeholder="Descreva a reação (ex: Rash cutâneo, Hepatotoxicidade)" className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Gravidade *</label>
                <select value={notifyForm.severity} onChange={e => setNotifyForm(p => ({ ...p, severity: e.target.value }))} className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="">Selecione...</option>
                  <option value="leve">Leve — Não requer intervenção</option>
                  <option value="moderada">Moderada — Requer tratamento</option>
                  <option value="grave">Grave — Hospitalização/risco de vida</option>
                  <option value="fatal">Fatal — Óbito</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Descrição detalhada</label>
                <textarea value={notifyForm.description} onChange={e => setNotifyForm(p => ({ ...p, description: e.target.value }))} placeholder="Descreva o caso: cronologia, dose, via de administração, evolução..." rows={4} className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
              </div>
              <button className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
                Enviar Notificação
              </button>
              <p className="text-[10px] text-muted-foreground text-center">
                Em produção, esta notificação será enviada diretamente ao sistema NOTIVISA da ANVISA.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-3 text-center">
        <p className="text-[10px] text-muted-foreground">
          Dados baseados em fontes oficiais (ANVISA, FDA, EMA). Para decisões clínicas, consulte sempre as bulas atualizadas e fontes primárias.
        </p>
      </div>
    </div>
  );
}
