/**
 * MedFocus — Painel Administrativo Master (Sprint 28)
 * 
 * Dashboard executivo multi-unidade com:
 * - KPIs em tempo real por clínica
 * - BI integrado (faturamento, ocupação, produtividade)
 * - Comparativo entre unidades
 * - Alertas operacionais
 * - Metas e OKRs
 * - Exportação de relatórios gerenciais
 * 
 * DISCLAIMER: Ferramenta exclusivamente educacional e de apoio ao estudo.
 */

import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

type AbaAdmin = 'visao-geral' | 'unidades' | 'financeiro' | 'produtividade' | 'metas' | 'alertas';
type Periodo = 'hoje' | 'semana' | 'mes' | 'trimestre' | 'ano';

interface KPIUnidade {
  clinica: string;
  consultas: number;
  faturamento: number;
  ocupacao: number;
  noShow: number;
  satisfacao: number;
  ticketMedio: number;
  novos: number;
  retornos: number;
}

interface AlertaOperacional {
  tipo: 'critico' | 'atencao' | 'info';
  mensagem: string;
  clinica: string;
  dataHora: string;
}

const KPIS: KPIUnidade[] = [
  { clinica: 'Clínica Central', consultas: 145, faturamento: 48500, ocupacao: 87, noShow: 8, satisfacao: 4.7, ticketMedio: 334, novos: 32, retornos: 113 },
  { clinica: 'Unidade Norte', consultas: 98, faturamento: 31200, ocupacao: 72, noShow: 12, satisfacao: 4.5, ticketMedio: 318, novos: 21, retornos: 77 },
  { clinica: 'Unidade Sul', consultas: 67, faturamento: 22800, ocupacao: 65, noShow: 15, satisfacao: 4.3, ticketMedio: 340, novos: 15, retornos: 52 },
];

const ALERTAS: AlertaOperacional[] = [
  { tipo: 'critico', mensagem: 'Taxa de no-show acima de 15% na Unidade Sul — ação necessária', clinica: 'Unidade Sul', dataHora: '01/03/2026 08:00' },
  { tipo: 'atencao', mensagem: 'Ocupação abaixo de 70% na Unidade Norte — considerar remanejamento', clinica: 'Unidade Norte', dataHora: '01/03/2026 07:30' },
  { tipo: 'atencao', mensagem: 'Faturamento de convênio Amil com 3 guias pendentes há +30 dias', clinica: 'Clínica Central', dataHora: '28/02/2026 17:00' },
  { tipo: 'info', mensagem: 'Meta mensal de consultas atingida na Clínica Central (145/140)', clinica: 'Clínica Central', dataHora: '28/02/2026 16:00' },
  { tipo: 'info', mensagem: 'Novo médico Dr. Paulo Henrique cadastrado na Unidade Norte', clinica: 'Unidade Norte', dataHora: '27/02/2026 10:00' },
];

const METAS = [
  { nome: 'Consultas/Mês', meta: 350, atual: 310, unidade: 'consultas' },
  { nome: 'Faturamento Mensal', meta: 120000, atual: 102500, unidade: 'R$' },
  { nome: 'Taxa de Ocupação', meta: 85, atual: 75, unidade: '%' },
  { nome: 'Satisfação (NPS)', meta: 4.8, atual: 4.5, unidade: '/5.0' },
  { nome: 'Taxa de No-Show', meta: 5, atual: 11, unidade: '%' },
  { nome: 'Novos Pacientes', meta: 80, atual: 68, unidade: 'pacientes' },
];

export function PainelAdminMaster() {
  const [aba, setAba] = useState<AbaAdmin>('visao-geral');
  const [periodo, setPeriodo] = useState<Periodo>('mes');

  const totalConsultas = KPIS.reduce((a, k) => a + k.consultas, 0);
  const totalFaturamento = KPIS.reduce((a, k) => a + k.faturamento, 0);
  const mediaOcupacao = Math.round(KPIS.reduce((a, k) => a + k.ocupacao, 0) / KPIS.length);
  const mediaNoShow = Math.round(KPIS.reduce((a, k) => a + k.noShow, 0) / KPIS.length);
  const mediaSatisfacao = (KPIS.reduce((a, k) => a + k.satisfacao, 0) / KPIS.length).toFixed(1);
  const totalNovos = KPIS.reduce((a, k) => a + k.novos, 0);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="Painel Administrativo" />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span className="text-3xl">👑</span> Painel Admin Master
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Multi-Unidade</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Visão executiva consolidada de todas as unidades</p>
        </div>
        <div className="flex gap-1.5">
          {(['hoje', 'semana', 'mes', 'trimestre', 'ano'] as Periodo[]).map(p => (
            <button key={p} onClick={() => setPeriodo(p)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition ${periodo === p ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Abas */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {([
          { id: 'visao-geral' as AbaAdmin, label: '📊 Visão Geral' },
          { id: 'unidades' as AbaAdmin, label: '🏥 Unidades' },
          { id: 'financeiro' as AbaAdmin, label: '💰 Financeiro' },
          { id: 'produtividade' as AbaAdmin, label: '📈 Produtividade' },
          { id: 'metas' as AbaAdmin, label: '🎯 Metas/OKRs' },
          { id: 'alertas' as AbaAdmin, label: '🔔 Alertas' },
        ]).map(a => (
          <button key={a.id} onClick={() => setAba(a.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${aba === a.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Visão Geral */}
      {aba === 'visao-geral' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Consultas', valor: totalConsultas, cor: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '📋' },
              { label: 'Faturamento', valor: `R$ ${(totalFaturamento / 1000).toFixed(1)}k`, cor: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '💰' },
              { label: 'Ocupação', valor: `${mediaOcupacao}%`, cor: mediaOcupacao >= 80 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: '📊' },
              { label: 'No-Show', valor: `${mediaNoShow}%`, cor: mediaNoShow <= 10 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30', icon: '❌' },
              { label: 'Satisfação', valor: mediaSatisfacao, cor: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: '⭐' },
              { label: 'Novos Pacientes', valor: totalNovos, cor: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: '🆕' },
            ].map(s => (
              <div key={s.label} className={`${s.cor} border rounded-xl p-3 text-center`}>
                <p className="text-lg">{s.icon}</p>
                <p className="text-xl font-bold">{s.valor}</p>
                <p className="text-[10px]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Comparativo por Unidade */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-bold mb-3">🏥 Comparativo por Unidade</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border">
                  <th className="text-left py-2 px-2">Unidade</th>
                  <th className="text-center py-2 px-2">Consultas</th>
                  <th className="text-right py-2 px-2">Faturamento</th>
                  <th className="text-center py-2 px-2">Ocupação</th>
                  <th className="text-center py-2 px-2">No-Show</th>
                  <th className="text-center py-2 px-2">NPS</th>
                  <th className="text-right py-2 px-2">Ticket Médio</th>
                  <th className="text-center py-2 px-2">Novos</th>
                </tr></thead>
                <tbody>
                  {KPIS.map(k => (
                    <tr key={k.clinica} className="border-b border-border/50 hover:bg-accent/50">
                      <td className="py-2 px-2 font-medium">{k.clinica}</td>
                      <td className="py-2 px-2 text-center">{k.consultas}</td>
                      <td className="py-2 px-2 text-right font-bold">R$ {k.faturamento.toLocaleString('pt-BR')}</td>
                      <td className="py-2 px-2 text-center">
                        <span className={k.ocupacao >= 80 ? 'text-green-400' : k.ocupacao >= 70 ? 'text-yellow-400' : 'text-red-400'}>{k.ocupacao}%</span>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span className={k.noShow <= 10 ? 'text-green-400' : 'text-red-400'}>{k.noShow}%</span>
                      </td>
                      <td className="py-2 px-2 text-center">{k.satisfacao}</td>
                      <td className="py-2 px-2 text-right">R$ {k.ticketMedio}</td>
                      <td className="py-2 px-2 text-center">{k.novos}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-primary/30 font-bold">
                    <td className="py-2 px-2">TOTAL</td>
                    <td className="py-2 px-2 text-center">{totalConsultas}</td>
                    <td className="py-2 px-2 text-right">R$ {totalFaturamento.toLocaleString('pt-BR')}</td>
                    <td className="py-2 px-2 text-center">{mediaOcupacao}%</td>
                    <td className="py-2 px-2 text-center">{mediaNoShow}%</td>
                    <td className="py-2 px-2 text-center">{mediaSatisfacao}</td>
                    <td className="py-2 px-2 text-right">R$ {Math.round(totalFaturamento / totalConsultas)}</td>
                    <td className="py-2 px-2 text-center">{totalNovos}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Alertas Recentes */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-bold mb-3">🔔 Alertas Recentes</h3>
            <div className="space-y-2">
              {ALERTAS.slice(0, 3).map((a, i) => (
                <div key={i} className={`rounded-lg p-3 ${
                  a.tipo === 'critico' ? 'bg-red-500/10 border border-red-500/30' :
                  a.tipo === 'atencao' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                  'bg-blue-500/10 border border-blue-500/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs">{a.tipo === 'critico' ? '🚨' : a.tipo === 'atencao' ? '⚠️' : 'ℹ️'} {a.mensagem}</p>
                    <span className="text-[10px] text-muted-foreground">{a.clinica}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Metas/OKRs */}
      {aba === 'metas' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold">🎯 Metas do Período ({periodo})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {METAS.map(m => {
              const isInverse = m.nome === 'Taxa de No-Show';
              const progresso = isInverse ? Math.max(0, Math.min(100, ((m.meta * 2 - m.atual) / m.meta) * 100)) : Math.min(100, (m.atual / m.meta) * 100);
              const atingida = isInverse ? m.atual <= m.meta : m.atual >= m.meta;
              return (
                <div key={m.nome} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold">{m.nome}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${atingida ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {atingida ? 'Atingida' : 'Em progresso'}
                    </span>
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-2xl font-bold">{m.unidade === 'R$' ? `R$ ${(m.atual / 1000).toFixed(1)}k` : m.atual}</span>
                    <span className="text-xs text-muted-foreground mb-1">/ {m.unidade === 'R$' ? `R$ ${(m.meta / 1000).toFixed(0)}k` : m.meta}{m.unidade !== 'R$' ? m.unidade : ''}</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all ${atingida ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${Math.min(progresso, 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{Math.round(progresso)}% da meta</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Alertas */}
      {aba === 'alertas' && (
        <div className="space-y-3">
          {ALERTAS.map((a, i) => (
            <div key={i} className={`bg-card border rounded-xl p-4 ${
              a.tipo === 'critico' ? 'border-red-500/50' : a.tipo === 'atencao' ? 'border-yellow-500/50' : 'border-border'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{a.tipo === 'critico' ? '🚨' : a.tipo === 'atencao' ? '⚠️' : 'ℹ️'}</span>
                  <span className="text-sm">{a.mensagem}</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">{a.clinica}</p>
                  <p className="text-[10px] text-muted-foreground">{a.dataHora}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Unidades, Financeiro, Produtividade — simplified views */}
      {(aba === 'unidades' || aba === 'financeiro' || aba === 'produtividade') && (
        <div className="space-y-4">
          {KPIS.map(k => (
            <div key={k.clinica} className="bg-card border border-border rounded-xl p-4">
              <h4 className="font-bold text-sm mb-3">{k.clinica}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {aba === 'unidades' && [
                  { label: 'Consultas', valor: k.consultas },
                  { label: 'Ocupação', valor: `${k.ocupacao}%` },
                  { label: 'NPS', valor: k.satisfacao },
                  { label: 'Novos', valor: k.novos },
                ].map(s => (
                  <div key={s.label} className="bg-background/50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold">{s.valor}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
                {aba === 'financeiro' && [
                  { label: 'Faturamento', valor: `R$ ${k.faturamento.toLocaleString('pt-BR')}` },
                  { label: 'Ticket Médio', valor: `R$ ${k.ticketMedio}` },
                  { label: 'Consultas', valor: k.consultas },
                  { label: 'No-Show (perda)', valor: `R$ ${Math.round(k.faturamento * k.noShow / 100).toLocaleString('pt-BR')}` },
                ].map(s => (
                  <div key={s.label} className="bg-background/50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold">{s.valor}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
                {aba === 'produtividade' && [
                  { label: 'Consultas/Dia', valor: Math.round(k.consultas / 22) },
                  { label: 'Retornos', valor: k.retornos },
                  { label: 'Taxa Retorno', valor: `${Math.round((k.retornos / k.consultas) * 100)}%` },
                  { label: 'Novos/Mês', valor: k.novos },
                ].map(s => (
                  <div key={s.label} className="bg-background/50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold">{s.valor}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <EducationalDisclaimer variant="footer" />
    </div>
  );
}
