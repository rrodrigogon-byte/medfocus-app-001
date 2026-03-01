/**
 * MedFocus — CRM Médico (Sprint 30)
 * 
 * Sistema de CRM para gestão de pacientes:
 * - Funil de pacientes (lead → agendado → atendido → fidelizado)
 * - Campanhas de retenção e reativação
 * - NPS e pesquisa de satisfação
 * - Segmentação de pacientes
 * - Automação de follow-up
 * - Análise de churn e lifetime value
 * 
 * DISCLAIMER: Ferramenta exclusivamente educacional e de apoio ao estudo.
 */

import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

type AbaCRM = 'funil' | 'pacientes' | 'campanhas' | 'nps' | 'automacao' | 'analytics';
type EtapaFunil = 'lead' | 'agendado' | 'atendido' | 'retorno' | 'fidelizado' | 'inativo';

interface PacienteCRM {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  etapa: EtapaFunil;
  origem: string;
  ultimaConsulta?: string;
  proximaConsulta?: string;
  totalConsultas: number;
  valorTotal: number;
  nps?: number;
  tags: string[];
  risco: 'baixo' | 'medio' | 'alto';
}

interface Campanha {
  id: string;
  nome: string;
  tipo: 'retencao' | 'reativacao' | 'aniversario' | 'preventivo' | 'follow-up';
  canal: 'whatsapp' | 'email' | 'sms';
  status: 'ativa' | 'pausada' | 'concluida';
  enviados: number;
  abertos: number;
  convertidos: number;
  dataInicio: string;
}

const PACIENTES_CRM: PacienteCRM[] = [
  { id: 'p-001', nome: 'João Carlos Silva', telefone: '(11) 9****-1234', email: 'j***@email.com', etapa: 'fidelizado', origem: 'Indicação', ultimaConsulta: '28/02/2026', proximaConsulta: '28/05/2026', totalConsultas: 12, valorTotal: 4200, nps: 10, tags: ['Hipertenso', 'Cardiopata', 'VIP'], risco: 'baixo' },
  { id: 'p-002', nome: 'Maria Fernanda Santos', telefone: '(11) 9****-5678', email: 'm***@email.com', etapa: 'retorno', origem: 'Google', ultimaConsulta: '28/02/2026', proximaConsulta: '15/03/2026', totalConsultas: 3, valorTotal: 830, nps: 9, tags: ['Diabetes', 'Check-up'], risco: 'baixo' },
  { id: 'p-003', nome: 'Ana Beatriz Costa', telefone: '(11) 9****-9012', email: 'a***@email.com', etapa: 'atendido', origem: 'Instagram', ultimaConsulta: '27/02/2026', totalConsultas: 1, valorTotal: 200, tags: ['Primeira consulta'], risco: 'medio' },
  { id: 'p-004', nome: 'Pedro Augusto Lima', telefone: '(11) 9****-3456', email: 'p***@email.com', etapa: 'agendado', origem: 'Convênio', proximaConsulta: '05/03/2026', totalConsultas: 0, valorTotal: 0, tags: ['Novo'], risco: 'baixo' },
  { id: 'p-005', nome: 'Carlos Eduardo Rocha', telefone: '(11) 9****-7890', email: 'c***@email.com', etapa: 'inativo', origem: 'Indicação', ultimaConsulta: '15/08/2025', totalConsultas: 5, valorTotal: 1800, nps: 7, tags: ['Hipertenso', 'Risco churn'], risco: 'alto' },
  { id: 'p-006', nome: 'Fernanda Oliveira', telefone: '(11) 9****-2345', email: 'f***@email.com', etapa: 'lead', origem: 'Site', totalConsultas: 0, valorTotal: 0, tags: ['Lead quente'], risco: 'medio' },
  { id: 'p-007', nome: 'Roberto Almeida', telefone: '(11) 9****-6789', email: 'r***@email.com', etapa: 'inativo', origem: 'Google', ultimaConsulta: '10/06/2025', totalConsultas: 2, valorTotal: 600, nps: 5, tags: ['No-show', 'Risco churn'], risco: 'alto' },
];

const CAMPANHAS: Campanha[] = [
  { id: 'cp-01', nome: 'Reativação — Pacientes Inativos +90 dias', tipo: 'reativacao', canal: 'whatsapp', status: 'ativa', enviados: 45, abertos: 38, convertidos: 8, dataInicio: '15/02/2026' },
  { id: 'cp-02', nome: 'Lembrete de Retorno — Cardiologia', tipo: 'follow-up', canal: 'whatsapp', status: 'ativa', enviados: 23, abertos: 20, convertidos: 15, dataInicio: '01/02/2026' },
  { id: 'cp-03', nome: 'Aniversariantes do Mês — Março', tipo: 'aniversario', canal: 'email', status: 'ativa', enviados: 12, abertos: 9, convertidos: 3, dataInicio: '01/03/2026' },
  { id: 'cp-04', nome: 'Check-up Preventivo — Pacientes 40+', tipo: 'preventivo', canal: 'whatsapp', status: 'pausada', enviados: 67, abertos: 52, convertidos: 18, dataInicio: '01/01/2026' },
];

export function CRMMedico() {
  const [aba, setAba] = useState<AbaCRM>('funil');

  const etapas: { id: EtapaFunil; label: string; cor: string }[] = [
    { id: 'lead', label: 'Lead', cor: 'bg-gray-500' },
    { id: 'agendado', label: 'Agendado', cor: 'bg-blue-500' },
    { id: 'atendido', label: 'Atendido', cor: 'bg-purple-500' },
    { id: 'retorno', label: 'Retorno', cor: 'bg-orange-500' },
    { id: 'fidelizado', label: 'Fidelizado', cor: 'bg-green-500' },
    { id: 'inativo', label: 'Inativo', cor: 'bg-red-500' },
  ];

  const totalLTV = PACIENTES_CRM.reduce((a, p) => a + p.valorTotal, 0);
  const mediaLTV = Math.round(totalLTV / PACIENTES_CRM.filter(p => p.totalConsultas > 0).length);
  const taxaRetencao = Math.round((PACIENTES_CRM.filter(p => p.etapa === 'fidelizado' || p.etapa === 'retorno').length / PACIENTES_CRM.filter(p => p.totalConsultas > 0).length) * 100);
  const taxaChurn = Math.round((PACIENTES_CRM.filter(p => p.etapa === 'inativo').length / PACIENTES_CRM.length) * 100);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="CRM Médico" />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">🎯</span> CRM Médico
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">Retenção</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Funil de pacientes, campanhas de retenção, NPS e automação de follow-up</p>
      </div>

      <div className="flex gap-1.5 mb-6 flex-wrap">
        {([
          { id: 'funil' as AbaCRM, label: '🔄 Funil' },
          { id: 'pacientes' as AbaCRM, label: '👥 Pacientes' },
          { id: 'campanhas' as AbaCRM, label: '📣 Campanhas' },
          { id: 'nps' as AbaCRM, label: '⭐ NPS' },
          { id: 'automacao' as AbaCRM, label: '🤖 Automação' },
          { id: 'analytics' as AbaCRM, label: '📊 Analytics' },
        ]).map(a => (
          <button key={a.id} onClick={() => setAba(a.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${aba === a.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Funil */}
      {aba === 'funil' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'LTV Médio', valor: `R$ ${mediaLTV}`, cor: 'bg-green-500/20 text-green-400 border-green-500/30' },
              { label: 'Taxa Retenção', valor: `${taxaRetencao}%`, cor: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
              { label: 'Taxa Churn', valor: `${taxaChurn}%`, cor: taxaChurn > 20 ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
              { label: 'Total Pacientes', valor: PACIENTES_CRM.length.toString(), cor: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
            ].map(s => (
              <div key={s.label} className={`${s.cor} border rounded-xl p-3 text-center`}>
                <p className="text-xl font-bold">{s.valor}</p>
                <p className="text-[10px]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Visual Funnel */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-bold mb-4">🔄 Funil de Pacientes</h3>
            <div className="space-y-2">
              {etapas.map(e => {
                const count = PACIENTES_CRM.filter(p => p.etapa === e.id).length;
                const pct = Math.round((count / PACIENTES_CRM.length) * 100);
                return (
                  <div key={e.id} className="flex items-center gap-3">
                    <span className="text-xs w-20 text-right font-medium">{e.label}</span>
                    <div className="flex-1 bg-background rounded-full h-8 relative overflow-hidden">
                      <div className={`${e.cor} h-8 rounded-full flex items-center px-3 transition-all`} style={{ width: `${Math.max(pct, 10)}%` }}>
                        <span className="text-[10px] text-white font-bold">{count} ({pct}%)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Pacientes */}
      {aba === 'pacientes' && (
        <div className="space-y-3">
          {PACIENTES_CRM.map(p => {
            const etapa = etapas.find(e => e.id === p.etapa)!;
            return (
              <div key={p.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${etapa.cor}`} />
                    <div>
                      <span className="font-bold text-sm">{p.nome}</span>
                      <p className="text-[10px] text-muted-foreground">{p.email} • {p.telefone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">R$ {p.valorTotal.toLocaleString('pt-BR')}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      p.risco === 'baixo' ? 'bg-green-500/20 text-green-400' :
                      p.risco === 'medio' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>Risco {p.risco}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${etapa.cor}/20 text-${etapa.cor.replace('bg-', '').replace('-500', '-400')}`}>{etapa.label}</span>
                  <span className="text-[10px] text-muted-foreground">{p.totalConsultas} consultas</span>
                  <span className="text-[10px] text-muted-foreground">Origem: {p.origem}</span>
                  {p.nps !== undefined && <span className="text-[10px] text-muted-foreground">NPS: {p.nps}</span>}
                  {p.tags.map(t => <span key={t} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">{t}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Campanhas */}
      {aba === 'campanhas' && (
        <div className="space-y-4">
          <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700">+ Nova Campanha</button>
          {CAMPANHAS.map(c => {
            const taxaAbertura = Math.round((c.abertos / c.enviados) * 100);
            const taxaConversao = Math.round((c.convertidos / c.enviados) * 100);
            return (
              <div key={c.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-sm">{c.nome}</h4>
                    <p className="text-[10px] text-muted-foreground">{c.canal.toUpperCase()} • Iniciada em {c.dataInicio}</p>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    c.status === 'ativa' ? 'bg-green-500/20 text-green-400' :
                    c.status === 'pausada' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>{c.status.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-background/50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold">{c.enviados}</p>
                    <p className="text-[10px] text-muted-foreground">Enviados</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold">{c.abertos}</p>
                    <p className="text-[10px] text-muted-foreground">Abertos ({taxaAbertura}%)</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-green-400">{c.convertidos}</p>
                    <p className="text-[10px] text-muted-foreground">Convertidos</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-primary">{taxaConversao}%</p>
                    <p className="text-[10px] text-muted-foreground">Conversão</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NPS */}
      {aba === 'nps' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {(() => {
              const comNPS = PACIENTES_CRM.filter(p => p.nps !== undefined);
              const promotores = comNPS.filter(p => p.nps! >= 9).length;
              const neutros = comNPS.filter(p => p.nps! >= 7 && p.nps! < 9).length;
              const detratores = comNPS.filter(p => p.nps! < 7).length;
              const npsScore = Math.round(((promotores - detratores) / comNPS.length) * 100);
              return [
                { label: 'NPS Score', valor: npsScore, cor: npsScore >= 50 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
                { label: 'Promotores (9-10)', valor: promotores, cor: 'bg-green-500/20 text-green-400 border-green-500/30' },
                { label: 'Detratores (0-6)', valor: detratores, cor: 'bg-red-500/20 text-red-400 border-red-500/30' },
              ];
            })().map(s => (
              <div key={s.label} className={`${s.cor} border rounded-xl p-4 text-center`}>
                <p className="text-2xl font-bold">{s.valor}</p>
                <p className="text-[10px]">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-bold mb-3">📊 Respostas NPS</h3>
            {PACIENTES_CRM.filter(p => p.nps !== undefined).map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-xs">{p.nome}</span>
                <span className={`text-sm font-bold ${p.nps! >= 9 ? 'text-green-400' : p.nps! >= 7 ? 'text-yellow-400' : 'text-red-400'}`}>{p.nps}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Automação */}
      {aba === 'automacao' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold">🤖 Automações Ativas</h3>
          {[
            { nome: 'Lembrete de Consulta (24h antes)', canal: 'WhatsApp', trigger: 'Agendamento confirmado', status: 'ativa', enviados: 234 },
            { nome: 'Follow-up Pós-Consulta (48h)', canal: 'WhatsApp', trigger: 'Consulta realizada', status: 'ativa', enviados: 189 },
            { nome: 'Reativação — 90 dias sem consulta', canal: 'WhatsApp', trigger: 'Inatividade > 90 dias', status: 'ativa', enviados: 45 },
            { nome: 'Pesquisa NPS (7 dias pós-consulta)', canal: 'E-mail', trigger: 'Consulta realizada', status: 'ativa', enviados: 156 },
            { nome: 'Aniversário do Paciente', canal: 'WhatsApp', trigger: 'Data de nascimento', status: 'ativa', enviados: 78 },
            { nome: 'Lembrete de Retorno (30 dias antes)', canal: 'WhatsApp', trigger: 'Retorno agendado', status: 'pausada', enviados: 0 },
          ].map((a, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold">{a.nome}</h4>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${a.status === 'ativa' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{a.status.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span>📱 {a.canal}</span>
                <span>⚡ Trigger: {a.trigger}</span>
                <span>📤 {a.enviados} enviados</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics */}
      {aba === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { titulo: 'Origem dos Pacientes', desc: 'De onde vêm seus pacientes (Google, Instagram, Indicação)', icone: '🌐' },
            { titulo: 'Lifetime Value (LTV)', desc: 'Valor médio gerado por paciente ao longo do tempo', icone: '💎' },
            { titulo: 'Taxa de Retorno', desc: 'Percentual de pacientes que retornam para novas consultas', icone: '🔄' },
            { titulo: 'Análise de Churn', desc: 'Pacientes que pararam de frequentar e motivos', icone: '📉' },
            { titulo: 'ROI de Campanhas', desc: 'Retorno sobre investimento em marketing e retenção', icone: '📊' },
            { titulo: 'Previsão de Demanda', desc: 'Forecast de consultas baseado em histórico e sazonalidade', icone: '🔮' },
          ].map((r, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 cursor-pointer transition">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{r.icone}</span>
                <div>
                  <h4 className="text-sm font-bold">{r.titulo}</h4>
                  <p className="text-[10px] text-muted-foreground">{r.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <EducationalDisclaimer variant="footer" />
    </div>
  );
}
