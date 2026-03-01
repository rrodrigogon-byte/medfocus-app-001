import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Clock, AlertTriangle, Users, Calendar, PieChart, Activity, Target, ArrowUpRight, ArrowDownRight, Filter, Download, RefreshCw, Loader2, Building2, Stethoscope } from 'lucide-react';
import EducationalDisclaimer from './EducationalDisclaimer';

// ==================== INTERFACES ====================
interface KPICard {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: any;
  color: string;
}

interface GlosaItem {
  id: string;
  guia: string;
  convenio: string;
  valor: number;
  motivo: string;
  status: 'pendente' | 'recurso' | 'recuperada' | 'perdida';
  data: string;
  probabilidadeRecurso: number;
}

interface FluxoCaixa {
  mes: string;
  receitas: number;
  despesas: number;
  saldo: number;
  previsao?: boolean;
}

interface OciosidadeSlot {
  hora: string;
  segunda: number;
  terca: number;
  quarta: number;
  quinta: number;
  sexta: number;
  sabado: number;
}

// ==================== MOCK DATA ====================
const KPI_DATA: KPICard[] = [
  { label: 'Receita Bruta', value: 'R$ 287.450', change: 12.3, changeLabel: 'vs mês anterior', icon: DollarSign, color: 'green' },
  { label: 'Taxa de Glosa', value: '4.2%', change: -1.8, changeLabel: 'vs mês anterior', icon: AlertTriangle, color: 'yellow' },
  { label: 'Ticket Médio', value: 'R$ 385', change: 8.5, changeLabel: 'vs mês anterior', icon: TrendingUp, color: 'cyan' },
  { label: 'Ocupação Agenda', value: '73%', change: 5.2, changeLabel: 'vs mês anterior', icon: Calendar, color: 'blue' },
  { label: 'Pacientes Ativos', value: '1.247', change: 3.1, changeLabel: 'vs mês anterior', icon: Users, color: 'purple' },
  { label: 'Tempo Médio Consulta', value: '28 min', change: -2.0, changeLabel: 'vs mês anterior', icon: Clock, color: 'orange' },
];

const GLOSAS_DATA: GlosaItem[] = [
  { id: 'G001', guia: 'TISS-2026-0145', convenio: 'Unimed', valor: 1250.00, motivo: 'Código TUSS incompatível com diagnóstico CID', status: 'pendente', data: '2026-02-28', probabilidadeRecurso: 85 },
  { id: 'G002', guia: 'TISS-2026-0132', convenio: 'Bradesco Saúde', valor: 890.00, motivo: 'Ausência de autorização prévia', status: 'recurso', data: '2026-02-25', probabilidadeRecurso: 60 },
  { id: 'G003', guia: 'TISS-2026-0128', convenio: 'SulAmérica', valor: 2100.00, motivo: 'Procedimento não coberto pelo plano', status: 'perdida', data: '2026-02-20', probabilidadeRecurso: 15 },
  { id: 'G004', guia: 'TISS-2026-0119', convenio: 'Amil', valor: 450.00, motivo: 'Duplicidade de cobrança', status: 'recuperada', data: '2026-02-18', probabilidadeRecurso: 95 },
  { id: 'G005', guia: 'TISS-2026-0115', convenio: 'Unimed', valor: 3200.00, motivo: 'Quantidade de sessões excede o autorizado', status: 'pendente', data: '2026-02-15', probabilidadeRecurso: 72 },
  { id: 'G006', guia: 'TISS-2026-0108', convenio: 'Hapvida', valor: 680.00, motivo: 'Erro no preenchimento da guia TISS', status: 'recurso', data: '2026-02-12', probabilidadeRecurso: 90 },
  { id: 'G007', guia: 'TISS-2026-0101', convenio: 'Bradesco Saúde', valor: 1800.00, motivo: 'Prazo de envio da guia expirado', status: 'perdida', data: '2026-02-08', probabilidadeRecurso: 20 },
  { id: 'G008', guia: 'TISS-2026-0095', convenio: 'SulAmérica', valor: 560.00, motivo: 'Código TUSS incompatível com diagnóstico CID', status: 'recuperada', data: '2026-02-05', probabilidadeRecurso: 88 },
];

const FLUXO_CAIXA: FluxoCaixa[] = [
  { mes: 'Set/25', receitas: 245000, despesas: 198000, saldo: 47000 },
  { mes: 'Out/25', receitas: 258000, despesas: 205000, saldo: 53000 },
  { mes: 'Nov/25', receitas: 272000, despesas: 210000, saldo: 62000 },
  { mes: 'Dez/25', receitas: 230000, despesas: 215000, saldo: 15000 },
  { mes: 'Jan/26', receitas: 265000, despesas: 208000, saldo: 57000 },
  { mes: 'Fev/26', receitas: 287450, despesas: 212000, saldo: 75450 },
  { mes: 'Mar/26', receitas: 295000, despesas: 218000, saldo: 77000, previsao: true },
  { mes: 'Abr/26', receitas: 310000, despesas: 222000, saldo: 88000, previsao: true },
  { mes: 'Mai/26', receitas: 305000, despesas: 225000, saldo: 80000, previsao: true },
];

const OCIOSIDADE: OciosidadeSlot[] = [
  { hora: '07:00', segunda: 20, terca: 30, quarta: 15, quinta: 25, sexta: 10, sabado: 60 },
  { hora: '08:00', segunda: 90, terca: 85, quarta: 95, quinta: 80, sexta: 88, sabado: 70 },
  { hora: '09:00', segunda: 95, terca: 92, quarta: 98, quinta: 90, sexta: 95, sabado: 80 },
  { hora: '10:00', segunda: 88, terca: 90, quarta: 92, quinta: 85, sexta: 90, sabado: 75 },
  { hora: '11:00', segunda: 75, terca: 80, quarta: 85, quinta: 78, sexta: 82, sabado: 50 },
  { hora: '12:00', segunda: 30, terca: 25, quarta: 35, quinta: 28, sexta: 20, sabado: 15 },
  { hora: '13:00', segunda: 45, terca: 50, quarta: 40, quinta: 48, sexta: 42, sabado: 10 },
  { hora: '14:00', segunda: 85, terca: 88, quarta: 90, quinta: 82, sexta: 85, sabado: 0 },
  { hora: '15:00', segunda: 90, terca: 92, quarta: 88, quinta: 90, sexta: 80, sabado: 0 },
  { hora: '16:00', segunda: 80, terca: 78, quarta: 82, quinta: 75, sexta: 70, sabado: 0 },
  { hora: '17:00', segunda: 60, terca: 55, quarta: 65, quinta: 58, sexta: 50, sabado: 0 },
  { hora: '18:00', segunda: 35, terca: 40, quarta: 30, quinta: 38, sexta: 25, sabado: 0 },
];

const RECEITA_POR_CONVENIO = [
  { convenio: 'Particular', valor: 98500, percentual: 34.3, color: 'green' },
  { convenio: 'Unimed', valor: 72300, percentual: 25.2, color: 'blue' },
  { convenio: 'Bradesco Saúde', valor: 45200, percentual: 15.7, color: 'cyan' },
  { convenio: 'SulAmérica', valor: 35800, percentual: 12.5, color: 'purple' },
  { convenio: 'Amil', valor: 21450, percentual: 7.5, color: 'yellow' },
  { convenio: 'Hapvida', valor: 14200, percentual: 4.8, color: 'orange' },
];

const PRODUTIVIDADE_MEDICOS = [
  { nome: 'Dr. Roberto Almeida', especialidade: 'Cardiologia', atendimentos: 142, receita: 85200, ticketMedio: 600, ocupacao: 88 },
  { nome: 'Dra. Ana Paula Santos', especialidade: 'Endocrinologia', atendimentos: 128, receita: 64000, ticketMedio: 500, ocupacao: 82 },
  { nome: 'Dr. Marcos Oliveira', especialidade: 'Ortopedia', atendimentos: 115, receita: 57500, ticketMedio: 500, ocupacao: 75 },
  { nome: 'Dra. Carla Mendes', especialidade: 'Dermatologia', atendimentos: 160, receita: 48000, ticketMedio: 300, ocupacao: 92 },
  { nome: 'Dr. Paulo Ferreira', especialidade: 'Neurologia', atendimentos: 98, receita: 58800, ticketMedio: 600, ocupacao: 68 },
];

// ==================== COMPONENT ====================
export default function BIAvancado() {
  const [activeTab, setActiveTab] = useState<'overview' | 'glosas' | 'fluxo' | 'ociosidade' | 'produtividade'>('overview');
  const [glosaFilter, setGlosaFilter] = useState<string>('todos');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalGlosas = GLOSAS_DATA.reduce((sum, g) => sum + g.valor, 0);
  const glosasRecuperadas = GLOSAS_DATA.filter(g => g.status === 'recuperada').reduce((sum, g) => sum + g.valor, 0);
  const glosasPendentes = GLOSAS_DATA.filter(g => g.status === 'pendente').reduce((sum, g) => sum + g.valor, 0);

  const statusGlosaConfig: Record<string, { label: string; color: string }> = {
    'pendente': { label: 'Pendente', color: 'yellow' },
    'recurso': { label: 'Em Recurso', color: 'blue' },
    'recuperada': { label: 'Recuperada', color: 'green' },
    'perdida': { label: 'Perdida', color: 'red' },
  };

  const filteredGlosas = glosaFilter === 'todos' ? GLOSAS_DATA : GLOSAS_DATA.filter(g => g.status === glosaFilter);
  const maxReceita = Math.max(...FLUXO_CAIXA.map(f => f.receitas));

  const refresh = async () => {
    setIsRefreshing(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsRefreshing(false);
  };

  const getOcupacaoColor = (value: number) => {
    if (value >= 85) return 'bg-green-500';
    if (value >= 60) return 'bg-cyan-500';
    if (value >= 30) return 'bg-yellow-500';
    if (value > 0) return 'bg-red-500';
    return 'bg-gray-800';
  };

  return (
    <div className="space-y-6">
      <EducationalDisclaimer module="BI Avançado" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-2xl p-6 border border-indigo-500/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-indigo-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Business Intelligence Avançado</h1>
            </div>
            <p className="text-gray-400 text-sm">
              Dashboard gerencial com análise de glosas, fluxo de caixa preditivo, mapa de ociosidade e produtividade médica.
            </p>
          </div>
          <button onClick={refresh} disabled={isRefreshing} className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg hover:bg-indigo-500/30 text-sm">
            {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Atualizar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'overview' as const, label: 'Visão Geral', icon: PieChart },
          { id: 'glosas' as const, label: 'Gestão de Glosas', icon: AlertTriangle },
          { id: 'fluxo' as const, label: 'Fluxo de Caixa', icon: DollarSign },
          { id: 'ociosidade' as const, label: 'Mapa de Ociosidade', icon: Clock },
          { id: 'produtividade' as const, label: 'Produtividade', icon: Stethoscope },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4">
            {KPI_DATA.map((kpi, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <kpi.icon className={`w-5 h-5 text-${kpi.color}-400`} />
                  <div className={`flex items-center gap-1 text-xs ${kpi.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {kpi.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(kpi.change)}%
                  </div>
                </div>
                <div className={`text-2xl font-bold text-${kpi.color}-400`}>{kpi.value}</div>
                <span className="text-xs text-gray-500">{kpi.label} — {kpi.changeLabel}</span>
              </div>
            ))}
          </div>

          {/* Receita por Convênio */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Receita por Convênio — Fev/2026</h3>
            <div className="space-y-3">
              {RECEITA_POR_CONVENIO.map((conv, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-sm text-gray-300 w-36">{conv.convenio}</span>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-900/50 rounded-full overflow-hidden">
                      <div className={`h-full bg-${conv.color}-500/60 rounded-full flex items-center justify-end pr-2`} style={{ width: `${conv.percentual}%` }}>
                        <span className="text-xs text-white font-medium">{conv.percentual}%</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-white w-28 text-right">R$ {conv.valor.toLocaleString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Glosas */}
      {activeTab === 'glosas' && (
        <div className="space-y-4">
          {/* Glosa Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
              <span className="text-2xl font-bold text-red-400">R$ {totalGlosas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <p className="text-xs text-gray-500">Total Glosado (Fev)</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
              <span className="text-2xl font-bold text-green-400">R$ {glosasRecuperadas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <p className="text-xs text-gray-500">Recuperado</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
              <span className="text-2xl font-bold text-yellow-400">R$ {glosasPendentes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <p className="text-xs text-gray-500">Pendente</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
              <span className="text-2xl font-bold text-cyan-400">{((glosasRecuperadas / totalGlosas) * 100).toFixed(0)}%</span>
              <p className="text-xs text-gray-500">Taxa de Recuperação</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {['todos', 'pendente', 'recurso', 'recuperada', 'perdida'].map(f => (
              <button
                key={f}
                onClick={() => setGlosaFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  glosaFilter === f ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
                }`}
              >
                {f === 'todos' ? 'Todas' : statusGlosaConfig[f]?.label || f}
              </button>
            ))}
          </div>

          {/* Glosas Table */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left text-xs text-gray-500 p-3">Guia</th>
                  <th className="text-left text-xs text-gray-500 p-3">Convênio</th>
                  <th className="text-left text-xs text-gray-500 p-3">Motivo</th>
                  <th className="text-right text-xs text-gray-500 p-3">Valor</th>
                  <th className="text-center text-xs text-gray-500 p-3">Status</th>
                  <th className="text-center text-xs text-gray-500 p-3">Prob. Recurso</th>
                </tr>
              </thead>
              <tbody>
                {filteredGlosas.map(g => {
                  const statusConf = statusGlosaConfig[g.status];
                  return (
                    <tr key={g.id} className="border-b border-gray-700/30 hover:bg-gray-700/20">
                      <td className="p-3 text-sm text-white font-mono">{g.guia}</td>
                      <td className="p-3 text-sm text-gray-300">{g.convenio}</td>
                      <td className="p-3 text-xs text-gray-400 max-w-xs truncate">{g.motivo}</td>
                      <td className="p-3 text-sm text-red-400 text-right font-medium">R$ {g.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs bg-${statusConf.color}-500/20 text-${statusConf.color}-400`}>
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${g.probabilidadeRecurso >= 70 ? 'bg-green-500' : g.probabilidadeRecurso >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${g.probabilidadeRecurso}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{g.probabilidadeRecurso}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-4">
            <p className="text-xs text-indigo-400/80">
              <strong>Anti-Glosa IA:</strong> A probabilidade de recurso é calculada com base no histórico de recursos anteriores com o mesmo convênio e motivo. Glosas por "Código TUSS incompatível" e "Erro no preenchimento" têm alta taxa de recuperação (85-95%).
            </p>
          </div>
        </div>
      )}

      {/* Fluxo de Caixa */}
      {activeTab === 'fluxo' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Fluxo de Caixa — Realizado + Previsão IA</h3>
            <div className="space-y-3">
              {FLUXO_CAIXA.map((fc, i) => (
                <div key={i} className={`flex items-center gap-4 p-3 rounded-lg ${fc.previsao ? 'bg-indigo-500/5 border border-indigo-500/10' : 'bg-gray-900/50'}`}>
                  <div className="w-20">
                    <span className={`text-sm font-medium ${fc.previsao ? 'text-indigo-400' : 'text-gray-300'}`}>{fc.mes}</span>
                    {fc.previsao && <span className="block text-[10px] text-indigo-400/60">Previsão</span>}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-16">Receitas</span>
                      <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${fc.previsao ? 'bg-green-500/40' : 'bg-green-500/70'}`} style={{ width: `${(fc.receitas / maxReceita) * 100}%` }} />
                      </div>
                      <span className="text-xs text-green-400 w-24 text-right">R$ {(fc.receitas / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-16">Despesas</span>
                      <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${fc.previsao ? 'bg-red-500/40' : 'bg-red-500/70'}`} style={{ width: `${(fc.despesas / maxReceita) * 100}%` }} />
                      </div>
                      <span className="text-xs text-red-400 w-24 text-right">R$ {(fc.despesas / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                  <div className="w-28 text-right">
                    <span className={`text-sm font-bold ${fc.saldo >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      R$ {(fc.saldo / 1000).toFixed(0)}k
                    </span>
                    <span className="block text-[10px] text-gray-500">Saldo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
              <span className="text-2xl font-bold text-green-400">R$ 75.450</span>
              <p className="text-xs text-gray-500">Saldo Atual (Fev/26)</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
              <span className="text-2xl font-bold text-indigo-400">R$ 88.000</span>
              <p className="text-xs text-gray-500">Previsão Abr/26</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
              <span className="text-2xl font-bold text-cyan-400">+16.6%</span>
              <p className="text-xs text-gray-500">Crescimento Previsto (3m)</p>
            </div>
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-4">
            <p className="text-xs text-indigo-400/80">
              <strong>Previsão IA:</strong> O fluxo de caixa preditivo é calculado com base em séries temporais (ARIMA) considerando sazonalidade, tendência de crescimento e inadimplência histórica. Margem de erro: ±8%.
            </p>
          </div>
        </div>
      )}

      {/* Mapa de Ociosidade */}
      {activeTab === 'ociosidade' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-2">Mapa de Calor — Ocupação da Agenda</h3>
            <p className="text-sm text-gray-400 mb-4">Percentual de ocupação por horário e dia da semana. Identifique janelas ociosas para campanhas de marketing ou promoções.</p>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-xs text-gray-500 p-2 w-16">Hora</th>
                    <th className="text-center text-xs text-gray-500 p-2">Seg</th>
                    <th className="text-center text-xs text-gray-500 p-2">Ter</th>
                    <th className="text-center text-xs text-gray-500 p-2">Qua</th>
                    <th className="text-center text-xs text-gray-500 p-2">Qui</th>
                    <th className="text-center text-xs text-gray-500 p-2">Sex</th>
                    <th className="text-center text-xs text-gray-500 p-2">Sáb</th>
                  </tr>
                </thead>
                <tbody>
                  {OCIOSIDADE.map((slot, i) => (
                    <tr key={i}>
                      <td className="text-xs text-gray-400 p-2 font-mono">{slot.hora}</td>
                      {[slot.segunda, slot.terca, slot.quarta, slot.quinta, slot.sexta, slot.sabado].map((val, j) => (
                        <td key={j} className="p-1">
                          <div className={`${getOcupacaoColor(val)} rounded-md p-2 text-center transition-all hover:scale-105`} style={{ opacity: val > 0 ? 0.3 + (val / 100) * 0.7 : 0.1 }}>
                            <span className="text-xs font-bold text-white">{val > 0 ? `${val}%` : '—'}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-4 mt-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded opacity-50" />
                <span className="text-xs text-gray-500">&lt; 30% (Ocioso)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded opacity-60" />
                <span className="text-xs text-gray-500">30-60%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-cyan-500 rounded opacity-70" />
                <span className="text-xs text-gray-500">60-85%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded opacity-90" />
                <span className="text-xs text-gray-500">&gt; 85% (Ideal)</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-yellow-400 mb-2">Recomendações IA para Reduzir Ociosidade</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• <strong>Sábado manhã (60-80%):</strong> Oferecer pacotes de check-up para aumentar ocupação</li>
              <li>• <strong>Segunda 07h (20%):</strong> Criar campanha "Primeira Consulta da Semana" com desconto</li>
              <li>• <strong>Horário de almoço (20-35%):</strong> Oferecer teleconsultas rápidas de retorno</li>
              <li>• <strong>Sexta tarde (50-70%):</strong> Agendar procedimentos estéticos e eletivos</li>
            </ul>
          </div>
        </div>
      )}

      {/* Produtividade */}
      {activeTab === 'produtividade' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Produtividade por Profissional — Fev/2026</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left text-xs text-gray-500 p-3">Profissional</th>
                    <th className="text-left text-xs text-gray-500 p-3">Especialidade</th>
                    <th className="text-center text-xs text-gray-500 p-3">Atendimentos</th>
                    <th className="text-right text-xs text-gray-500 p-3">Receita</th>
                    <th className="text-right text-xs text-gray-500 p-3">Ticket Médio</th>
                    <th className="text-center text-xs text-gray-500 p-3">Ocupação</th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUTIVIDADE_MEDICOS.map((med, i) => (
                    <tr key={i} className="border-b border-gray-700/30 hover:bg-gray-700/20">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center">
                            <Stethoscope className="w-4 h-4 text-indigo-400" />
                          </div>
                          <span className="text-sm text-white font-medium">{med.nome}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-400">{med.especialidade}</td>
                      <td className="p-3 text-center text-sm text-white font-medium">{med.atendimentos}</td>
                      <td className="p-3 text-right text-sm text-green-400 font-medium">R$ {med.receita.toLocaleString('pt-BR')}</td>
                      <td className="p-3 text-right text-sm text-cyan-400">R$ {med.ticketMedio}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${med.ocupacao >= 80 ? 'bg-green-500' : med.ocupacao >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${med.ocupacao}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{med.ocupacao}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
              <span className="text-2xl font-bold text-white">643</span>
              <p className="text-xs text-gray-500">Total Atendimentos (Fev)</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
              <span className="text-2xl font-bold text-green-400">R$ 313.500</span>
              <p className="text-xs text-gray-500">Receita Total Médicos</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
              <span className="text-2xl font-bold text-cyan-400">81%</span>
              <p className="text-xs text-gray-500">Ocupação Média</p>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
        <p className="text-xs text-yellow-400/80">
          <strong>Aviso Educacional:</strong> Este módulo de BI demonstra funcionalidades de gestão clínica para fins de estudo e simulação. Todos os dados financeiros, de pacientes e de produtividade são fictícios. As previsões de fluxo de caixa utilizam modelos estatísticos simplificados e não devem ser usadas para tomada de decisão real sem validação contábil profissional.
        </p>
      </div>
    </div>
  );
}
