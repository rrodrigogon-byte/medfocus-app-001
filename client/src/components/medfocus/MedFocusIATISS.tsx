/**
 * MedFocusIA SaaS — Módulo TISS (Convênios e Operadoras)
 * Sprint 6: Guias TISS XML 4.01.00, Autorização, Glosas, Relatórios Anti-Glosa
 * Conformidade: ANS TISS 4.0, TUSS
 */
import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

// ============================================================
// TISS Data Types
// ============================================================
interface InsurancePlan {
  id: string;
  insurer: string;
  ansCode: string;
  planName: string;
  contractNumber: string;
  status: 'active' | 'inactive';
  patientsCount: number;
  monthlyRevenue: number;
  glossRate: number;
}

interface TISSGuide {
  id: string;
  guideNumber: string;
  type: 'consultation' | 'exam' | 'sadt' | 'hospitalization';
  patient: string;
  doctor: string;
  insurer: string;
  procedures: { tussCode: string; description: string; quantity: number; value: number }[];
  totalValue: number;
  authorizedValue: number;
  status: 'pending' | 'authorized' | 'denied' | 'gloss' | 'paid' | 'appealed';
  sentAt: string;
  authorizedAt?: string;
}

interface Gloss {
  id: string;
  guideId: string;
  guideNumber: string;
  patient: string;
  insurer: string;
  type: 'technical' | 'administrative' | 'clinical';
  reason: string;
  value: number;
  appealStatus: 'not_appealed' | 'appealed' | 'accepted' | 'rejected';
  date: string;
}

// ============================================================
// Sample Data
// ============================================================
const INSURANCE_PLANS: InsurancePlan[] = [
  { id: '1', insurer: 'Unimed', ansCode: '352501', planName: 'Unimed Nacional', contractNumber: 'UNI-2026-001', status: 'active', patientsCount: 342, monthlyRevenue: 38900, glossRate: 4.2 },
  { id: '2', insurer: 'Bradesco Saúde', ansCode: '005711', planName: 'Bradesco Saúde Top', contractNumber: 'BRA-2026-002', status: 'active', patientsCount: 189, monthlyRevenue: 22400, glossRate: 6.1 },
  { id: '3', insurer: 'SulAmérica', ansCode: '006246', planName: 'SulAmérica Prestige', contractNumber: 'SUL-2026-003', status: 'active', patientsCount: 156, monthlyRevenue: 18700, glossRate: 3.8 },
  { id: '4', insurer: 'Amil', ansCode: '326305', planName: 'Amil 700', contractNumber: 'AMI-2026-004', status: 'active', patientsCount: 98, monthlyRevenue: 12300, glossRate: 7.5 },
  { id: '5', insurer: 'Hapvida', ansCode: '368253', planName: 'Hapvida Nacional', contractNumber: 'HAP-2026-005', status: 'active', patientsCount: 67, monthlyRevenue: 8400, glossRate: 5.3 },
  { id: '6', insurer: 'NotreDame Intermédica', ansCode: '359017', planName: 'GNDI Prata', contractNumber: 'NDI-2026-006', status: 'inactive', patientsCount: 0, monthlyRevenue: 0, glossRate: 0 },
];

const TISS_GUIDES: TISSGuide[] = [
  {
    id: 'G-001', guideNumber: 'TISS-2026-000145', type: 'consultation', patient: 'Maria Silva', doctor: 'Dr. Carlos Mendes',
    insurer: 'Unimed', procedures: [{ tussCode: '10101012', description: 'Consulta em consultório', quantity: 1, value: 150.00 }],
    totalValue: 150.00, authorizedValue: 150.00, status: 'authorized', sentAt: '01/03/2026', authorizedAt: '01/03/2026',
  },
  {
    id: 'G-002', guideNumber: 'TISS-2026-000144', type: 'exam', patient: 'João Santos', doctor: 'Dra. Ana Oliveira',
    insurer: 'Bradesco Saúde', procedures: [
      { tussCode: '40301630', description: 'Hemograma completo', quantity: 1, value: 25.00 },
      { tussCode: '40302040', description: 'Glicemia de jejum', quantity: 1, value: 12.00 },
      { tussCode: '40302199', description: 'Colesterol total', quantity: 1, value: 18.00 },
    ],
    totalValue: 55.00, authorizedValue: 55.00, status: 'authorized', sentAt: '28/02/2026', authorizedAt: '01/03/2026',
  },
  {
    id: 'G-003', guideNumber: 'TISS-2026-000143', type: 'sadt', patient: 'Ana Ferreira', doctor: 'Dr. Carlos Mendes',
    insurer: 'Unimed', procedures: [{ tussCode: '41001044', description: 'Ecocardiograma transtorácico', quantity: 1, value: 350.00 }],
    totalValue: 350.00, authorizedValue: 350.00, status: 'paid', sentAt: '25/02/2026', authorizedAt: '26/02/2026',
  },
  {
    id: 'G-004', guideNumber: 'TISS-2026-000142', type: 'consultation', patient: 'Pedro Costa', doctor: 'Dr. Roberto Lima',
    insurer: 'SulAmérica', procedures: [{ tussCode: '10101012', description: 'Consulta em consultório', quantity: 1, value: 180.00 }],
    totalValue: 180.00, authorizedValue: 0, status: 'pending', sentAt: '01/03/2026',
  },
  {
    id: 'G-005', guideNumber: 'TISS-2026-000141', type: 'exam', patient: 'Carlos Ribeiro', doctor: 'Dr. Carlos Mendes',
    insurer: 'Amil', procedures: [
      { tussCode: '41001036', description: 'Eletrocardiograma', quantity: 1, value: 80.00 },
      { tussCode: '41001044', description: 'Ecocardiograma transtorácico', quantity: 1, value: 350.00 },
    ],
    totalValue: 430.00, authorizedValue: 80.00, status: 'gloss', sentAt: '27/02/2026', authorizedAt: '28/02/2026',
  },
  {
    id: 'G-006', guideNumber: 'TISS-2026-000140', type: 'consultation', patient: 'Lucia Souza', doctor: 'Dra. Lucia Souza',
    insurer: 'Bradesco Saúde', procedures: [{ tussCode: '10101012', description: 'Consulta em consultório', quantity: 1, value: 160.00 }],
    totalValue: 160.00, authorizedValue: 0, status: 'denied', sentAt: '26/02/2026',
  },
  {
    id: 'G-007', guideNumber: 'TISS-2026-000139', type: 'sadt', patient: 'Roberto Alves', doctor: 'Dr. Roberto Lima',
    insurer: 'Hapvida', procedures: [{ tussCode: '41001052', description: 'Ultrassonografia abdominal total', quantity: 1, value: 180.00 }],
    totalValue: 180.00, authorizedValue: 180.00, status: 'authorized', sentAt: '25/02/2026', authorizedAt: '26/02/2026',
  },
];

const GLOSSES: Gloss[] = [
  { id: 'GL-001', guideId: 'G-005', guideNumber: 'TISS-2026-000141', patient: 'Carlos Ribeiro', insurer: 'Amil',
    type: 'clinical', reason: 'Procedimento não compatível com CID informado', value: 350.00, appealStatus: 'appealed', date: '28/02/2026' },
  { id: 'GL-002', guideId: 'G-006', guideNumber: 'TISS-2026-000140', patient: 'Lucia Souza', insurer: 'Bradesco Saúde',
    type: 'administrative', reason: 'Carteirinha vencida no momento do atendimento', value: 160.00, appealStatus: 'not_appealed', date: '27/02/2026' },
  { id: 'GL-003', guideId: 'G-010', guideNumber: 'TISS-2026-000135', patient: 'Fernanda Lima', insurer: 'Unimed',
    type: 'technical', reason: 'Código TUSS incorreto para o procedimento', value: 85.00, appealStatus: 'accepted', date: '20/02/2026' },
  { id: 'GL-004', guideId: 'G-012', guideNumber: 'TISS-2026-000133', patient: 'Jorge Mendes', insurer: 'SulAmérica',
    type: 'clinical', reason: 'Exame sem justificativa clínica adequada', value: 220.00, appealStatus: 'rejected', date: '18/02/2026' },
  { id: 'GL-005', guideId: 'G-015', guideNumber: 'TISS-2026-000130', patient: 'Carla Dias', insurer: 'Amil',
    type: 'administrative', reason: 'Prazo de envio da guia excedido', value: 180.00, appealStatus: 'not_appealed', date: '15/02/2026' },
];

// ============================================================
// TISS MODULE
// ============================================================
export const MedFocusIATISS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'guides' | 'glosses' | 'reports'>('plans');
  const [showNewGuide, setShowNewGuide] = useState(false);

  const totalGuidesMonth = TISS_GUIDES.length;
  const totalAuthorized = TISS_GUIDES.filter(g => g.status === 'authorized' || g.status === 'paid').length;
  const totalGlossValue = GLOSSES.reduce((sum, g) => sum + g.value, 0);
  const totalRevenueConvenios = INSURANCE_PLANS.reduce((sum, p) => sum + p.monthlyRevenue, 0);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const guideStatusColors: Record<string, string> = {
    pending: 'bg-amber-500/20 text-amber-400',
    authorized: 'bg-emerald-500/20 text-emerald-400',
    denied: 'bg-red-500/20 text-red-400',
    gloss: 'bg-orange-500/20 text-orange-400',
    paid: 'bg-blue-500/20 text-blue-400',
    appealed: 'bg-purple-500/20 text-purple-400',
  };
  const guideStatusLabels: Record<string, string> = {
    pending: 'Pendente', authorized: 'Autorizada', denied: 'Negada',
    gloss: 'Glosada', paid: 'Paga', appealed: 'Recurso',
  };
  const guideTypeLabels: Record<string, string> = {
    consultation: 'Consulta', exam: 'Exame', sadt: 'SP/SADT', hospitalization: 'Internação',
  };
  const glossTypeColors: Record<string, string> = {
    technical: 'bg-blue-500/20 text-blue-400',
    administrative: 'bg-amber-500/20 text-amber-400',
    clinical: 'bg-red-500/20 text-red-400',
  };
  const glossTypeLabels: Record<string, string> = {
    technical: 'Técnica', administrative: 'Administrativa', clinical: 'Clínica',
  };
  const appealStatusColors: Record<string, string> = {
    not_appealed: 'bg-gray-500/20 text-gray-400',
    appealed: 'bg-purple-500/20 text-purple-400',
    accepted: 'bg-emerald-500/20 text-emerald-400',
    rejected: 'bg-red-500/20 text-red-400',
  };
  const appealStatusLabels: Record<string, string> = {
    not_appealed: 'Sem Recurso', appealed: 'Em Recurso', accepted: 'Aceito', rejected: 'Rejeitado',
  };

  const tabs = [
    { id: 'plans', label: 'Convênios', icon: '🏥' },
    { id: 'guides', label: 'Guias TISS', icon: '📋' },
    { id: 'glosses', label: 'Glosas', icon: '⚠️' },
    { id: 'reports', label: 'Relatórios', icon: '📊' },
  ];

  return (
    <div className="space-y-6">
      <EducationalDisclaimer variant="compact" moduleName="TISS Convênios" dismissible={false} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">TISS — Convênios e Operadoras</h1>
          <p className="text-sm text-gray-400 mt-1">Guias TISS XML 4.01.00 | Autorização Automática | Anti-Glosa | ANS Compliant</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full border border-blue-500/30">TISS 4.01.00</span>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">ANS ✓</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Receita Convênios', value: formatCurrency(totalRevenueConvenios), icon: '💰', color: 'from-emerald-500 to-teal-500' },
          { label: 'Guias no Mês', value: totalGuidesMonth.toString(), icon: '📋', color: 'from-blue-500 to-cyan-500' },
          { label: 'Taxa Autorização', value: `${Math.round(totalAuthorized / totalGuidesMonth * 100)}%`, icon: '✅', color: 'from-purple-500 to-pink-500' },
          { label: 'Glosas Pendentes', value: formatCurrency(totalGlossValue), icon: '⚠️', color: 'from-red-500 to-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{stat.icon}</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            <div className={`h-1 rounded-full bg-gradient-to-r ${stat.color} mt-2 opacity-60`} />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700/50 pb-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.id ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
            <span className="mr-1">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ── PLANS TAB ── */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Convênios Cadastrados</h3>
            <button className="px-4 py-2 bg-cyan-500 text-white text-sm font-bold rounded-lg hover:bg-cyan-600 transition">
              + Cadastrar Convênio
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INSURANCE_PLANS.filter(p => p.status === 'active').map(plan => (
              <div key={plan.id} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5 hover:border-cyan-500/30 transition">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-lg font-bold text-white">{plan.insurer}</div>
                    <div className="text-xs text-gray-400">{plan.planName}</div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full">Ativo</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Código ANS</span>
                    <span className="text-cyan-400 font-mono">{plan.ansCode}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Contrato</span>
                    <span className="text-white font-mono">{plan.contractNumber}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Pacientes</span>
                    <span className="text-white font-medium">{plan.patientsCount}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Receita Mensal</span>
                    <span className="text-emerald-400 font-bold">{formatCurrency(plan.monthlyRevenue)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Taxa de Glosa</span>
                    <span className={`font-bold ${plan.glossRate > 5 ? 'text-red-400' : plan.glossRate > 3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {plan.glossRate}%
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-3 py-1.5 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-lg hover:bg-cyan-500/30 transition">Guias</button>
                  <button className="flex-1 px-3 py-1.5 bg-gray-700/50 text-gray-300 text-xs rounded-lg hover:bg-gray-700 transition">Editar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── GUIDES TAB ── */}
      {activeTab === 'guides' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Guias TISS</h3>
            <button onClick={() => setShowNewGuide(!showNewGuide)}
              className="px-4 py-2 bg-cyan-500 text-white text-sm font-bold rounded-lg hover:bg-cyan-600 transition">
              + Nova Guia TISS
            </button>
          </div>

          {/* New Guide Form */}
          {showNewGuide && (
            <div className="bg-gray-800/50 rounded-xl border border-cyan-500/30 p-5">
              <h3 className="text-sm font-bold text-white mb-4">Nova Guia TISS</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Tipo de Guia</label>
                  <select className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none">
                    <option>Consulta</option>
                    <option>SP/SADT (Exames)</option>
                    <option>Internação</option>
                    <option>Honorários</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Convênio</label>
                  <select className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none">
                    {INSURANCE_PLANS.filter(p => p.status === 'active').map(p => (
                      <option key={p.id}>{p.insurer} — {p.planName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Paciente</label>
                  <input type="text" placeholder="Buscar paciente..." className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Médico Executante</label>
                  <select className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none">
                    <option>Dr. Carlos Mendes — CRM/MT 12345</option>
                    <option>Dra. Ana Oliveira — CRM/MT 23456</option>
                    <option>Dr. Roberto Lima — CRM/MT 34567</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Código TUSS</label>
                  <input type="text" placeholder="Ex: 10101012" className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">CID-10 Principal</label>
                  <input type="text" placeholder="Ex: I10" className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 bg-cyan-500 text-white text-sm font-bold rounded-lg hover:bg-cyan-600 transition">Gerar Guia XML</button>
                <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-lg hover:bg-emerald-500/30 transition border border-emerald-500/30">Enviar para Autorização</button>
                <button onClick={() => setShowNewGuide(false)} className="px-4 py-2 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition">Cancelar</button>
              </div>
            </div>
          )}

          {/* Guides Table */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Guia</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Tipo</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Paciente</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Convênio</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Procedimentos</th>
                  <th className="text-right text-xs text-gray-400 font-semibold p-4">Valor</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Status</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {TISS_GUIDES.map(guide => (
                  <tr key={guide.id} className="border-b border-gray-700/20 hover:bg-gray-700/20 transition">
                    <td className="p-4 text-xs text-cyan-400 font-mono">{guide.guideNumber}</td>
                    <td className="p-4"><span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">{guideTypeLabels[guide.type]}</span></td>
                    <td className="p-4 text-sm text-white">{guide.patient}</td>
                    <td className="p-4 text-sm text-gray-300">{guide.insurer}</td>
                    <td className="p-4">
                      <div className="text-xs text-gray-400">
                        {guide.procedures.map(p => p.description).join(', ').substring(0, 40)}
                        {guide.procedures.map(p => p.description).join(', ').length > 40 ? '...' : ''}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-white font-bold text-right">{formatCurrency(guide.totalValue)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${guideStatusColors[guide.status]}`}>
                        {guideStatusLabels[guide.status]}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded hover:bg-cyan-500/30 transition">XML</button>
                        {guide.status === 'gloss' && (
                          <button className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded hover:bg-purple-500/30 transition">Recurso</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TISS XML Preview */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
            <h3 className="text-sm font-bold text-white mb-3">Exemplo XML TISS 4.01.00</h3>
            <pre className="text-xs text-gray-400 bg-gray-900/50 rounded-lg p-4 overflow-x-auto font-mono">
{`<?xml version="1.0" encoding="UTF-8"?>
<ans:mensagemTISS xmlns:ans="http://www.ans.gov.br/padroes/tiss/schemas">
  <ans:cabecalho>
    <ans:identificacaoTransacao>
      <ans:tipoTransacao>ENVIO_LOTE_GUIAS</ans:tipoTransacao>
      <ans:sequencialTransacao>1</ans:sequencialTransacao>
      <ans:dataRegistroTransacao>2026-03-01</ans:dataRegistroTransacao>
    </ans:identificacaoTransacao>
    <ans:origem>
      <ans:identificacaoPrestador>
        <ans:codigoPrestadorNaOperadora>12345</ans:codigoPrestadorNaOperadora>
      </ans:identificacaoPrestador>
    </ans:origem>
    <ans:destino>
      <ans:registroANS>352501</ans:registroANS>
    </ans:destino>
    <ans:versaoPadrao>4.01.00</ans:versaoPadrao>
  </ans:cabecalho>
</ans:mensagemTISS>`}
            </pre>
          </div>
        </div>
      )}

      {/* ── GLOSSES TAB ── */}
      {activeTab === 'glosses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Gestão de Glosas</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full border border-red-500/30">
                {GLOSSES.filter(g => g.appealStatus === 'not_appealed').length} sem recurso
              </span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full border border-purple-500/30">
                {GLOSSES.filter(g => g.appealStatus === 'appealed').length} em recurso
              </span>
            </div>
          </div>

          {/* Gloss Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Glosado', value: formatCurrency(totalGlossValue), color: 'text-red-400' },
              { label: 'Recuperável', value: formatCurrency(GLOSSES.filter(g => g.appealStatus !== 'rejected').reduce((s, g) => s + g.value, 0)), color: 'text-amber-400' },
              { label: 'Recuperado', value: formatCurrency(GLOSSES.filter(g => g.appealStatus === 'accepted').reduce((s, g) => s + g.value, 0)), color: 'text-emerald-400' },
              { label: 'Perdido', value: formatCurrency(GLOSSES.filter(g => g.appealStatus === 'rejected').reduce((s, g) => s + g.value, 0)), color: 'text-gray-400' },
            ].map((stat, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Glosses Table */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Guia</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Paciente</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Convênio</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Tipo</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Motivo</th>
                  <th className="text-right text-xs text-gray-400 font-semibold p-4">Valor</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Recurso</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {GLOSSES.map(gloss => (
                  <tr key={gloss.id} className="border-b border-gray-700/20 hover:bg-gray-700/20 transition">
                    <td className="p-4 text-xs text-cyan-400 font-mono">{gloss.guideNumber}</td>
                    <td className="p-4 text-sm text-white">{gloss.patient}</td>
                    <td className="p-4 text-sm text-gray-300">{gloss.insurer}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${glossTypeColors[gloss.type]}`}>
                        {glossTypeLabels[gloss.type]}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-400 max-w-xs">{gloss.reason}</td>
                    <td className="p-4 text-sm text-red-400 font-bold text-right">{formatCurrency(gloss.value)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${appealStatusColors[gloss.appealStatus]}`}>
                        {appealStatusLabels[gloss.appealStatus]}
                      </span>
                    </td>
                    <td className="p-4">
                      {gloss.appealStatus === 'not_appealed' && (
                        <button className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded hover:bg-purple-500/30 transition">
                          Contestar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Anti-Gloss Tips */}
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl border border-purple-500/20 p-5">
            <h3 className="text-sm font-bold text-purple-400 mb-3">Sistema Anti-Glosa (IA)</h3>
            <div className="space-y-2">
              {[
                'Verificar CID-10 compatível com procedimento TUSS antes do envio',
                'Validar carteirinha do convênio no momento do check-in',
                'Enviar guias dentro do prazo contratual (máx. 30 dias)',
                'Incluir justificativa clínica detalhada para exames de alto custo',
                'Conferir autorização prévia para procedimentos que exigem',
              ].map((tip, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                  <span className="text-emerald-400">✓</span> {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── REPORTS TAB ── */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Relatórios de Convênios</h3>

          {/* Revenue by Insurer */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
            <h3 className="text-sm font-bold text-white mb-4">Receita por Operadora (Fevereiro 2026)</h3>
            <div className="space-y-3">
              {INSURANCE_PLANS.filter(p => p.status === 'active').sort((a, b) => b.monthlyRevenue - a.monthlyRevenue).map((plan, i) => {
                const maxRevenue = Math.max(...INSURANCE_PLANS.map(p => p.monthlyRevenue));
                const pct = (plan.monthlyRevenue / maxRevenue * 100);
                const colors = ['bg-cyan-500', 'bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500'];
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">{plan.insurer} ({plan.patientsCount} pacientes)</span>
                      <span className="text-white font-bold">{formatCurrency(plan.monthlyRevenue)}</span>
                    </div>
                    <div className="w-full bg-gray-700/30 rounded-full h-3">
                      <div className={`${colors[i % colors.length]} h-3 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700/30 flex justify-between">
              <span className="text-sm font-bold text-white">Total Convênios</span>
              <span className="text-sm font-bold text-emerald-400">{formatCurrency(totalRevenueConvenios)}</span>
            </div>
          </div>

          {/* Gloss Analysis */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
            <h3 className="text-sm font-bold text-white mb-4">Análise de Glosas por Operadora</h3>
            <div className="space-y-3">
              {INSURANCE_PLANS.filter(p => p.status === 'active').map((plan, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white font-medium w-40">{plan.insurer}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Taxa Glosa</div>
                      <div className={`text-sm font-bold ${plan.glossRate > 5 ? 'text-red-400' : plan.glossRate > 3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {plan.glossRate}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Valor Glosado</div>
                      <div className="text-sm font-bold text-red-400">{formatCurrency(plan.monthlyRevenue * plan.glossRate / 100)}</div>
                    </div>
                    <div className="w-24 bg-gray-700/30 rounded-full h-2">
                      <div className={`h-2 rounded-full ${plan.glossRate > 5 ? 'bg-red-500' : plan.glossRate > 3 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(plan.glossRate * 10, 100)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-500/20 text-blue-400 text-sm font-bold rounded-lg hover:bg-blue-500/30 transition border border-blue-500/30">
              Exportar Relatório PDF
            </button>
            <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-lg hover:bg-emerald-500/30 transition border border-emerald-500/30">
              Exportar Excel
            </button>
            <button className="px-4 py-2 bg-purple-500/20 text-purple-400 text-sm font-bold rounded-lg hover:bg-purple-500/30 transition border border-purple-500/30">
              Lote TISS XML
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
