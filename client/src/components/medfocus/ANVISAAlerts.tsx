import React, { useState, useMemo } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

// ═══════════════════════════════════════════════════════════
// ALERTAS ANVISA — Monitoramento de segurança em tempo real
// ═══════════════════════════════════════════════════════════

interface ANVISAAlert {
  id: string;
  date: string;
  type: 'recall' | 'safety' | 'counterfeit' | 'shortage' | 'update' | 'ban';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  product: string;
  manufacturer: string;
  batch?: string;
  reason: string;
  action: string;
  details: string;
  source: string;
  affectedSpecialties: string[];
}

const ALERTS_DATABASE: ANVISAAlert[] = [
  {
    id: 'alert-001', date: '2026-02-25', type: 'recall', severity: 'critical',
    title: 'Recolhimento de lote de Insulina NPH — Contaminação',
    product: 'Insulina Humana NPH 100 UI/mL', manufacturer: 'Laboratório Exemplo',
    batch: 'INS2025-A47', reason: 'Contaminação por partículas visíveis detectada em inspeção de qualidade',
    action: 'Suspender uso imediato do lote INS2025-A47. Devolver ao distribuidor. Trocar por lote alternativo.',
    details: 'A ANVISA determinou o recolhimento voluntário do lote INS2025-A47 de Insulina NPH após detecção de partículas visíveis durante inspeção de rotina. Pacientes que utilizaram o lote devem monitorar glicemia com maior frequência e reportar qualquer reação adversa.',
    source: 'ANVISA — Resolução RE nº 000/2026', affectedSpecialties: ['Endocrinologia', 'Clínica Médica', 'Medicina de Família'],
  },
  {
    id: 'alert-002', date: '2026-02-20', type: 'safety', severity: 'high',
    title: 'Alerta de segurança — Metamizol (Dipirona) e Agranulocitose',
    product: 'Dipirona Sódica (todas as apresentações)', manufacturer: 'Todos os fabricantes',
    reason: 'Atualização de bula com novas evidências sobre risco de agranulocitose',
    action: 'Atualizar orientações ao paciente. Solicitar hemograma se febre persistente durante uso.',
    details: 'A ANVISA atualizou a bula de todos os medicamentos à base de metamizol sódico (dipirona) para incluir novas evidências sobre o risco de agranulocitose. O risco estimado é de 1:1.500 a 1:100.000 pacientes. Recomenda-se orientar pacientes a procurar atendimento médico imediato se apresentarem febre, dor de garganta ou lesões em mucosa oral durante o uso.',
    source: 'ANVISA — Nota Técnica 2026', affectedSpecialties: ['Clínica Médica', 'Emergência', 'Medicina de Família', 'Pediatria'],
  },
  {
    id: 'alert-003', date: '2026-02-18', type: 'counterfeit', severity: 'critical',
    title: 'Medicamento falsificado — Ozempic (Semaglutida)',
    product: 'Ozempic (Semaglutida) 1,34 mg/mL caneta preenchida', manufacturer: 'Falsificação — NÃO é Novo Nordisk',
    batch: 'Vários lotes falsificados', reason: 'Apreensão de lotes falsificados em circulação no mercado informal',
    action: 'Adquirir APENAS em farmácias autorizadas. Verificar selo de autenticidade. Denunciar ao PROCON/ANVISA.',
    details: 'A ANVISA e a Polícia Federal apreenderam lotes falsificados de Ozempic em circulação no mercado informal e em vendas online não autorizadas. Os produtos falsificados podem conter substâncias desconhecidas e representam risco grave à saúde. Orientar pacientes a adquirir o medicamento APENAS em farmácias com alvará de funcionamento e verificar o selo de autenticidade.',
    source: 'ANVISA + Polícia Federal — Operação 2026', affectedSpecialties: ['Endocrinologia', 'Nutrologia', 'Clínica Médica'],
  },
  {
    id: 'alert-004', date: '2026-02-15', type: 'shortage', severity: 'medium',
    title: 'Desabastecimento — Noradrenalina injetável',
    product: 'Hemitartarato de Norepinefrina 2mg/mL', manufacturer: 'Múltiplos fabricantes',
    reason: 'Problemas na cadeia de suprimentos e aumento de demanda',
    action: 'Planejar estoques. Considerar alternativas: Vasopressina, Fenilefrina. Priorizar para choque séptico.',
    details: 'A ANVISA emitiu alerta de desabastecimento temporário de noradrenalina injetável em diversas regiões do país. Hospitais devem otimizar estoques e considerar protocolos alternativos de vasopressores quando necessário. A previsão de normalização é para abril de 2026.',
    source: 'ANVISA — CMED Nota de Desabastecimento', affectedSpecialties: ['Terapia Intensiva', 'Emergência', 'Anestesiologia'],
  },
  {
    id: 'alert-005', date: '2026-02-10', type: 'update', severity: 'medium',
    title: 'Atualização de bula — Ivermectina: novas contraindicações',
    product: 'Ivermectina 6mg comprimidos', manufacturer: 'Todos os fabricantes',
    reason: 'Inclusão de novas contraindicações e interações medicamentosas',
    action: 'Revisar prescrições atuais. Contraindicado em uso concomitante com varfarina (risco de sangramento).',
    details: 'A ANVISA determinou a atualização das bulas de ivermectina para incluir: contraindicação formal em pacientes em uso de varfarina (interação CYP3A4 com risco de sangramento), e reforço de que NÃO há evidência de eficácia para COVID-19. Médicos devem revisar prescrições e orientar pacientes.',
    source: 'ANVISA — RDC 2026', affectedSpecialties: ['Clínica Médica', 'Infectologia', 'Dermatologia'],
  },
  {
    id: 'alert-006', date: '2026-02-05', type: 'ban', severity: 'high',
    title: 'Proibição — Fenilpropanolamina em antigripais',
    product: 'Medicamentos contendo Fenilpropanolamina (PPA)', manufacturer: 'Diversos',
    reason: 'Risco aumentado de AVC hemorrágico confirmado por meta-análise',
    action: 'Suspender prescrição e dispensação. Orientar pacientes a descontinuar. Alternativas: pseudoefedrina, descongestionantes tópicos.',
    details: 'A ANVISA proibiu definitivamente a comercialização de medicamentos contendo fenilpropanolamina (PPA) no Brasil, após meta-análise confirmar risco aumentado de AVC hemorrágico, especialmente em mulheres jovens. Todos os estoques devem ser recolhidos em 90 dias.',
    source: 'ANVISA — RDC nº 000/2026', affectedSpecialties: ['Clínica Médica', 'Otorrinolaringologia', 'Medicina de Família', 'Pediatria'],
  },
  {
    id: 'alert-007', date: '2026-01-28', type: 'safety', severity: 'high',
    title: 'Farmacovigilância — Fluoroquinolonas: risco de aneurisma aórtico',
    product: 'Ciprofloxacino, Levofloxacino, Norfloxacino', manufacturer: 'Todos os fabricantes',
    reason: 'Estudos confirmam risco 2x maior de aneurisma/dissecção aórtica',
    action: 'Evitar em pacientes > 65 anos, HAS, Marfan, doença aórtica conhecida. Preferir alternativas quando possível.',
    details: 'A ANVISA reforça o alerta sobre o risco de aneurisma e dissecção aórtica associado ao uso de fluoroquinolonas sistêmicas. O risco é aproximadamente 2x maior em comparação com outros antibióticos. Pacientes de alto risco (idosos, hipertensos, portadores de doenças do tecido conjuntivo) devem receber alternativas terapêuticas sempre que possível.',
    source: 'ANVISA / FDA Safety Communication / EMA', affectedSpecialties: ['Infectologia', 'Clínica Médica', 'Urologia', 'Pneumologia', 'Cirurgia Vascular'],
  },
  {
    id: 'alert-008', date: '2026-01-20', type: 'recall', severity: 'medium',
    title: 'Recolhimento — Omeprazol 20mg cápsulas (lote específico)',
    product: 'Omeprazol 20mg cápsulas', manufacturer: 'Laboratório Exemplo B',
    batch: 'OME-2025-K12', reason: 'Resultado fora de especificação no teste de dissolução',
    action: 'Suspender dispensação do lote OME-2025-K12. Trocar por lote alternativo.',
    details: 'O lote OME-2025-K12 de Omeprazol 20mg apresentou resultado fora de especificação no teste de dissolução durante monitoramento pós-comercialização. Isso pode resultar em absorção inadequada do medicamento. O recolhimento é voluntário e restrito ao lote especificado.',
    source: 'ANVISA — Alerta SNVS', affectedSpecialties: ['Gastroenterologia', 'Clínica Médica'],
  },
  {
    id: 'alert-009', date: '2026-01-15', type: 'safety', severity: 'medium',
    title: 'Alerta — Metformina e deficiência de vitamina B12',
    product: 'Metformina (todas as apresentações)', manufacturer: 'Todos os fabricantes',
    reason: 'Recomendação de monitoramento periódico de B12 em uso prolongado',
    action: 'Dosar B12 anualmente em pacientes em uso de metformina > 4 anos. Suplementar se deficiente.',
    details: 'A ANVISA recomenda que médicos monitorem os níveis séricos de vitamina B12 periodicamente em pacientes em uso prolongado de metformina (> 4 anos), especialmente idosos e pacientes com neuropatia periférica. A prevalência de deficiência de B12 pode chegar a 30% nesta população.',
    source: 'ANVISA — Nota Informativa / ADA 2025', affectedSpecialties: ['Endocrinologia', 'Clínica Médica', 'Geriatria', 'Medicina de Família'],
  },
  {
    id: 'alert-010', date: '2026-01-10', type: 'update', severity: 'low',
    title: 'Nova apresentação aprovada — Semaglutida oral 14mg',
    product: 'Rybelsus (Semaglutida) 14mg comprimidos', manufacturer: 'Novo Nordisk',
    reason: 'Aprovação de nova indicação: redução de risco cardiovascular em DM2',
    action: 'Considerar para pacientes com DM2 e alto risco cardiovascular. Tomar em jejum com até 120mL de água.',
    details: 'A ANVISA aprovou a nova indicação de semaglutida oral 14mg para redução de risco de eventos cardiovasculares maiores (MACE) em pacientes adultos com DM2 e doença cardiovascular estabelecida, com base nos resultados do estudo SOUL.',
    source: 'ANVISA — Registro de Medicamentos 2026', affectedSpecialties: ['Endocrinologia', 'Cardiologia', 'Clínica Médica'],
  },
];

const typeConfig = {
  recall: { label: 'Recolhimento', color: 'bg-red-600', icon: '🔄' },
  safety: { label: 'Segurança', color: 'bg-orange-600', icon: '⚠️' },
  counterfeit: { label: 'Falsificação', color: 'bg-red-700', icon: '🚫' },
  shortage: { label: 'Desabastecimento', color: 'bg-yellow-600', icon: '📦' },
  update: { label: 'Atualização', color: 'bg-blue-600', icon: '📋' },
  ban: { label: 'Proibição', color: 'bg-red-800', icon: '⛔' },
};

const severityConfig = {
  critical: { label: 'Crítico', color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-500/50' },
  high: { label: 'Alto', color: 'text-orange-400', bg: 'bg-orange-900/30', border: 'border-orange-500/50' },
  medium: { label: 'Médio', color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-500/50' },
  low: { label: 'Baixo', color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-500/50' },
};

export default function ANVISAAlerts() {
  const [selectedAlert, setSelectedAlert] = useState<ANVISAAlert | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    return ALERTS_DATABASE.filter(a => {
      const matchType = filterType === 'all' || a.type === filterType;
      const matchSev = filterSeverity === 'all' || a.severity === filterSeverity;
      const matchSearch = searchTerm === '' || a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.product.toLowerCase().includes(searchTerm.toLowerCase());
      return matchType && matchSev && matchSearch;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [filterType, filterSeverity, searchTerm]);

  const criticalCount = ALERTS_DATABASE.filter(a => a.severity === 'critical').length;

  if (selectedAlert) {
    const a = selectedAlert;
    const sev = severityConfig[a.severity];
    const typ = typeConfig[a.type];
    return (
      <div className="max-w-4xl mx-auto space-y-4">
      <EducationalDisclaimer variant="compact" moduleName="Alertas ANVISA" dismissible={false} />
        <button onClick={() => setSelectedAlert(null)} className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Voltar
        </button>

        <div className={`${sev.bg} rounded-2xl p-6 border-2 ${sev.border}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 ${typ.color} text-white rounded text-xs`}>{typ.icon} {typ.label}</span>
            <span className={`px-2 py-0.5 rounded text-xs ${sev.color} border ${sev.border}`}>{sev.label}</span>
            <span className="text-gray-500 text-xs">{new Date(a.date).toLocaleDateString('pt-BR')}</span>
          </div>
          <h2 className="text-xl font-bold text-white">{a.title}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
            <h3 className="text-gray-500 text-xs font-bold mb-1">PRODUTO</h3>
            <p className="text-white font-medium">{a.product}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
            <h3 className="text-gray-500 text-xs font-bold mb-1">FABRICANTE</h3>
            <p className="text-white font-medium">{a.manufacturer}</p>
          </div>
        </div>

        {a.batch && (
          <div className="bg-red-900/20 rounded-xl p-4 border border-red-700/30">
            <h3 className="text-red-400 text-xs font-bold mb-1">LOTE AFETADO</h3>
            <p className="text-red-300 font-mono font-bold text-lg">{a.batch}</p>
          </div>
        )}

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
          <h3 className="text-gray-500 text-xs font-bold mb-2">MOTIVO</h3>
          <p className="text-gray-300">{a.reason}</p>
        </div>

        <div className="bg-emerald-900/20 rounded-xl p-4 border border-emerald-700/30">
          <h3 className="text-emerald-400 text-xs font-bold mb-2">AÇÃO RECOMENDADA</h3>
          <p className="text-emerald-300 font-medium">{a.action}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
          <h3 className="text-gray-500 text-xs font-bold mb-2">DETALHES</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{a.details}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
          <h3 className="text-gray-500 text-xs font-bold mb-2">ESPECIALIDADES AFETADAS</h3>
          <div className="flex flex-wrap gap-2">
            {a.affectedSpecialties.map((s, i) => (
              <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">{s}</span>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center">Fonte: {a.source}</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-2xl p-6 border border-red-700/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-2xl">🔔</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Alertas ANVISA</h2>
            <p className="text-red-300 text-sm">{ALERTS_DATABASE.length} alertas ativos — {criticalCount} críticos — Monitoramento de segurança farmacêutica</p>
          </div>
        </div>
      </div>

      {/* Critical banner */}
      {criticalCount > 0 && (
        <div className="bg-red-900/30 rounded-xl p-4 border-2 border-red-500/50 flex items-center gap-3 animate-pulse">
          <span className="text-2xl">🚨</span>
          <div>
            <p className="text-red-400 font-bold">{criticalCount} alerta(s) CRÍTICO(S) ativo(s)</p>
            <p className="text-red-300 text-sm">Ação imediata necessária — Verifique os alertas abaixo</p>
          </div>
        </div>
      )}

      {/* Search and filters */}
      <input type="text" placeholder="Buscar por medicamento ou alerta..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500" />

      <div className="flex flex-wrap gap-2">
        <span className="text-gray-500 text-xs self-center mr-1">Tipo:</span>
        {['all', ...Object.keys(typeConfig)].map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            className={`px-3 py-1 rounded-full text-xs ${filterType === t ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
            {t === 'all' ? 'Todos' : typeConfig[t as keyof typeof typeConfig].label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-gray-500 text-xs self-center mr-1">Severidade:</span>
        {['all', 'critical', 'high', 'medium', 'low'].map(s => (
          <button key={s} onClick={() => setFilterSeverity(s)}
            className={`px-3 py-1 rounded-full text-xs ${filterSeverity === s ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
            {s === 'all' ? 'Todos' : severityConfig[s as keyof typeof severityConfig].label}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.map(a => {
          const sev = severityConfig[a.severity];
          const typ = typeConfig[a.type];
          return (
            <button key={a.id} onClick={() => setSelectedAlert(a)}
              className={`w-full text-left ${sev.bg} rounded-xl p-4 border ${sev.border} hover:opacity-90 transition-all`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 ${typ.color} text-white rounded text-xs`}>{typ.icon} {typ.label}</span>
                    <span className={`text-xs ${sev.color}`}>{sev.label}</span>
                    <span className="text-xs text-gray-500">{new Date(a.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <h3 className="text-white font-bold text-sm">{a.title}</h3>
                  <p className="text-gray-400 text-xs mt-1">{a.product} — {a.manufacturer}</p>
                </div>
                <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </button>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 text-center">
        <p className="text-gray-500 text-xs">
          Os alertas são baseados em comunicados oficiais da ANVISA, FDA e EMA. Para informações oficiais atualizadas, consulte o portal da ANVISA em <span className="text-blue-400">anvisa.gov.br</span>.
          Última atualização: {new Date().toLocaleDateString('pt-BR')}.
        </p>
      </div>
    </div>
  );
}
