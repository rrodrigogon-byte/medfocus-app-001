/**
 * MedFocus — Módulo de Relatórios e Analytics (Sprint 8)
 * 
 * Painel de relatórios gerenciais para gestão de clínicas (simulação educacional).
 * 
 * Funcionalidades:
 * - Dashboard executivo com KPIs
 * - Relatórios de atendimento
 * - Análise de produtividade médica
 * - Indicadores de qualidade
 * - Relatórios financeiros consolidados
 * - Exportação em PDF/Excel
 */

import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

type RelatorioTela = 'executivo' | 'atendimentos' | 'produtividade' | 'qualidade' | 'financeiro';

interface KPI {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
}

const KPIS_EXECUTIVO: KPI[] = [
  { label: 'Atendimentos (Mês)', value: '1.247', change: '+12%', positive: true, icon: '🏥' },
  { label: 'Receita Bruta', value: 'R$ 387.500', change: '+8%', positive: true, icon: '💰' },
  { label: 'Ticket Médio', value: 'R$ 310,70', change: '+3%', positive: true, icon: '📊' },
  { label: 'Taxa de Retorno', value: '34%', change: '-2%', positive: false, icon: '🔄' },
  { label: 'NPS Pacientes', value: '87', change: '+5', positive: true, icon: '⭐' },
  { label: 'Taxa de Glosa', value: '4.2%', change: '-1.3%', positive: true, icon: '📉' },
  { label: 'Ocupação Agenda', value: '78%', change: '+6%', positive: true, icon: '📅' },
  { label: 'Tempo Médio Espera', value: '18 min', change: '-4 min', positive: true, icon: '⏱️' },
];

const ATENDIMENTOS_MES = [
  { mes: 'Set/25', consultas: 980, retornos: 320, urgencias: 45, total: 1345 },
  { mes: 'Out/25', consultas: 1020, retornos: 340, urgencias: 38, total: 1398 },
  { mes: 'Nov/25', consultas: 1050, retornos: 310, urgencias: 52, total: 1412 },
  { mes: 'Dez/25', consultas: 890, retornos: 280, urgencias: 30, total: 1200 },
  { mes: 'Jan/26', consultas: 1100, retornos: 350, urgencias: 42, total: 1492 },
  { mes: 'Fev/26', consultas: 1080, retornos: 330, urgencias: 37, total: 1447 },
];

const PRODUTIVIDADE_MEDICOS = [
  { nome: 'Dr. Roberto Almeida', crm: 'CRM/SP 123456', especialidade: 'Cardiologia', atendimentos: 186, receita: 'R$ 74.400', ticketMedio: 'R$ 400', ocupacao: '92%' },
  { nome: 'Dra. Camila Santos', crm: 'CRM/SP 234567', especialidade: 'Dermatologia', atendimentos: 210, receita: 'R$ 63.000', ticketMedio: 'R$ 300', ocupacao: '88%' },
  { nome: 'Dr. Fernando Costa', crm: 'CRM/SP 345678', especialidade: 'Ortopedia', atendimentos: 145, receita: 'R$ 72.500', ticketMedio: 'R$ 500', ocupacao: '76%' },
  { nome: 'Dra. Juliana Lima', crm: 'CRM/SP 456789', especialidade: 'Ginecologia', atendimentos: 198, receita: 'R$ 59.400', ticketMedio: 'R$ 300', ocupacao: '85%' },
  { nome: 'Dr. Marcos Oliveira', crm: 'CRM/SP 567890', especialidade: 'Clínica Geral', atendimentos: 245, receita: 'R$ 49.000', ticketMedio: 'R$ 200', ocupacao: '95%' },
  { nome: 'Dra. Patrícia Ferreira', crm: 'CRM/SP 678901', especialidade: 'Endocrinologia', atendimentos: 163, receita: 'R$ 48.900', ticketMedio: 'R$ 300', ocupacao: '82%' },
];

const INDICADORES_QUALIDADE = [
  { indicador: 'Satisfação do Paciente (NPS)', meta: '≥ 80', resultado: '87', status: 'atingida' },
  { indicador: 'Taxa de Infecção Hospitalar', meta: '< 5%', resultado: '2.1%', status: 'atingida' },
  { indicador: 'Tempo Médio de Espera', meta: '< 20 min', resultado: '18 min', status: 'atingida' },
  { indicador: 'Taxa de Retorno em 48h', meta: '< 3%', resultado: '2.8%', status: 'atingida' },
  { indicador: 'Completude do Prontuário', meta: '≥ 95%', resultado: '91%', status: 'atencao' },
  { indicador: 'Taxa de Cancelamento', meta: '< 10%', resultado: '12%', status: 'critica' },
  { indicador: 'Adesão a Protocolos Clínicos', meta: '≥ 90%', resultado: '93%', status: 'atingida' },
  { indicador: 'Taxa de Glosa', meta: '< 5%', resultado: '4.2%', status: 'atingida' },
];

export function MedFocusIARelatorios() {
  const [tela, setTela] = useState<RelatorioTela>('executivo');

  const statusBadge = (s: string) => {
    switch (s) {
      case 'atingida': return 'text-green-400 bg-green-500/10';
      case 'atencao': return 'text-yellow-400 bg-yellow-500/10';
      case 'critica': return 'text-red-400 bg-red-500/10';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="compact" moduleName="Relatórios e Analytics" dismissible={false} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">📊</span> Relatórios & Analytics
          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-medium">SIMULAÇÃO</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Painel gerencial com indicadores de desempenho — Dados fictícios para treinamento
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'executivo' as RelatorioTela, label: 'Executivo', icon: '📊' },
          { id: 'atendimentos' as RelatorioTela, label: 'Atendimentos', icon: '🏥' },
          { id: 'produtividade' as RelatorioTela, label: 'Produtividade', icon: '📈' },
          { id: 'qualidade' as RelatorioTela, label: 'Qualidade', icon: '⭐' },
          { id: 'financeiro' as RelatorioTela, label: 'Financeiro', icon: '💰' },
        ].map(t => (
          <button key={t.id} onClick={() => setTela(t.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tela === t.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border hover:bg-accent'
            }`}>
            <span className="mr-1">{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Dashboard Executivo */}
      {tela === 'executivo' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {KPIS_EXECUTIVO.map((kpi, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>{kpi.icon}</span>
                  <span className="text-xs text-muted-foreground">{kpi.label}</span>
                </div>
                <p className="text-xl font-bold">{kpi.value}</p>
                <p className={`text-xs mt-1 ${kpi.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {kpi.positive ? '↑' : '↓'} {kpi.change} vs. mês anterior
                </p>
              </div>
            ))}
          </div>

          {/* Resumo mensal */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">📈 Evolução Mensal de Atendimentos</h3>
              <button className="px-3 py-1.5 bg-primary/20 text-primary rounded-lg text-xs font-medium hover:bg-primary/30 transition">
                Exportar PDF
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="p-3 text-xs text-muted-foreground">Mês</th>
                    <th className="p-3 text-xs text-muted-foreground">Consultas</th>
                    <th className="p-3 text-xs text-muted-foreground">Retornos</th>
                    <th className="p-3 text-xs text-muted-foreground">Urgências</th>
                    <th className="p-3 text-xs text-muted-foreground font-bold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ATENDIMENTOS_MES.map((m, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="p-3 font-medium">{m.mes}</td>
                      <td className="p-3 text-foreground/70">{m.consultas.toLocaleString()}</td>
                      <td className="p-3 text-foreground/70">{m.retornos.toLocaleString()}</td>
                      <td className="p-3 text-foreground/70">{m.urgencias}</td>
                      <td className="p-3 font-bold text-primary">{m.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Atendimentos */}
      {tela === 'atendimentos' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">🏥 Relatório de Atendimentos por Especialidade</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { esp: 'Clínica Geral', atend: 312, perc: '25%', bar: 'w-full' },
                { esp: 'Cardiologia', atend: 186, perc: '15%', bar: 'w-3/5' },
                { esp: 'Dermatologia', atend: 210, perc: '17%', bar: 'w-2/3' },
                { esp: 'Ortopedia', atend: 145, perc: '12%', bar: 'w-1/2' },
                { esp: 'Ginecologia', atend: 198, perc: '16%', bar: 'w-2/3' },
                { esp: 'Endocrinologia', atend: 163, perc: '13%', bar: 'w-1/2' },
              ].map((e, i) => (
                <div key={i} className="bg-background/50 rounded-lg p-4 border border-border/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{e.esp}</span>
                    <span className="text-xs text-muted-foreground">{e.perc}</span>
                  </div>
                  <p className="text-lg font-bold text-primary mb-2">{e.atend}</p>
                  <div className="w-full bg-border/30 rounded-full h-2">
                    <div className={`bg-primary rounded-full h-2 ${e.bar}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Produtividade */}
      {tela === 'produtividade' && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">📈 Produtividade do Corpo Clínico (Simulação)</h3>
            <button className="px-3 py-1.5 bg-primary/20 text-primary rounded-lg text-xs font-medium">Exportar Excel</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="p-3 text-xs text-muted-foreground">Profissional</th>
                  <th className="p-3 text-xs text-muted-foreground">CRM</th>
                  <th className="p-3 text-xs text-muted-foreground">Especialidade</th>
                  <th className="p-3 text-xs text-muted-foreground">Atendimentos</th>
                  <th className="p-3 text-xs text-muted-foreground">Receita</th>
                  <th className="p-3 text-xs text-muted-foreground">Ticket Médio</th>
                  <th className="p-3 text-xs text-muted-foreground">Ocupação</th>
                </tr>
              </thead>
              <tbody>
                {PRODUTIVIDADE_MEDICOS.map((m, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition">
                    <td className="p-3 font-medium">{m.nome}</td>
                    <td className="p-3 text-foreground/70 font-mono text-xs">{m.crm}</td>
                    <td className="p-3 text-foreground/70">{m.especialidade}</td>
                    <td className="p-3 font-bold">{m.atendimentos}</td>
                    <td className="p-3 text-green-400">{m.receita}</td>
                    <td className="p-3 text-foreground/70">{m.ticketMedio}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        parseInt(m.ocupacao) >= 90 ? 'text-green-400 bg-green-500/10' :
                        parseInt(m.ocupacao) >= 80 ? 'text-blue-400 bg-blue-500/10' :
                        'text-yellow-400 bg-yellow-500/10'
                      }`}>{m.ocupacao}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Qualidade */}
      {tela === 'qualidade' && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold mb-4">⭐ Indicadores de Qualidade Assistencial</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="p-3 text-xs text-muted-foreground">Indicador</th>
                  <th className="p-3 text-xs text-muted-foreground">Meta</th>
                  <th className="p-3 text-xs text-muted-foreground">Resultado</th>
                  <th className="p-3 text-xs text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {INDICADORES_QUALIDADE.map((ind, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-3 font-medium">{ind.indicador}</td>
                    <td className="p-3 text-foreground/70">{ind.meta}</td>
                    <td className="p-3 font-bold">{ind.resultado}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadge(ind.status)}`}>
                        {ind.status === 'atingida' ? '✓ Atingida' : ind.status === 'atencao' ? '⚠ Atenção' : '✗ Crítica'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Financeiro */}
      {tela === 'financeiro' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Receita Bruta', value: 'R$ 387.500', icon: '💰', color: 'text-green-400' },
              { label: 'Despesas Totais', value: 'R$ 198.300', icon: '📉', color: 'text-red-400' },
              { label: 'Lucro Líquido', value: 'R$ 189.200', icon: '📊', color: 'text-emerald-400' },
            ].map((kpi, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{kpi.icon}</span>
                  <span className="text-sm text-muted-foreground">{kpi.label}</span>
                </div>
                <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">💰 Receita por Fonte de Pagamento</h3>
            <div className="space-y-3">
              {[
                { fonte: 'Convênios (TISS)', valor: 'R$ 178.250', perc: 46, color: 'bg-blue-500' },
                { fonte: 'Particular', valor: 'R$ 112.500', perc: 29, color: 'bg-green-500' },
                { fonte: 'Pix', valor: 'R$ 54.250', perc: 14, color: 'bg-purple-500' },
                { fonte: 'Cartão de Crédito', valor: 'R$ 27.125', perc: 7, color: 'bg-yellow-500' },
                { fonte: 'Boleto', valor: 'R$ 15.375', perc: 4, color: 'bg-orange-500' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-32 text-sm text-foreground/70">{f.fonte}</div>
                  <div className="flex-1">
                    <div className="w-full bg-border/30 rounded-full h-4">
                      <div className={`${f.color} rounded-full h-4 flex items-center justify-end pr-2`} style={{ width: `${f.perc}%` }}>
                        <span className="text-[10px] font-bold text-white">{f.perc}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-28 text-right text-sm font-medium">{f.valor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <EducationalDisclaimer variant="footer" />
    </div>
  );
}
