/**
 * MedFocus — Gestão de Convênios Avançada (Sprint 26)
 * 
 * Sistema completo para gestão de convênios:
 * - Tabelas TUSS/CBHPM com valores atualizados
 * - Controle de glosas e recursos
 * - Faturamento por convênio com dashboard
 * - Gestão de autorizações e prazos
 * - Relatórios de produtividade por convênio
 * - Alertas de prazos e vencimentos
 * 
 * DISCLAIMER: Ferramenta exclusivamente educacional e de apoio ao estudo.
 */

import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

type StatusGuia = 'pendente' | 'autorizada' | 'executada' | 'faturada' | 'paga' | 'glosada' | 'recurso';
type AbaConvenio = 'dashboard' | 'tabelas' | 'guias' | 'glosas' | 'faturamento' | 'relatorios';

interface Convenio {
  id: string;
  nome: string;
  registroANS: string;
  tipo: 'saude' | 'odonto';
  contrato: string;
  vigencia: string;
  tabelaPrecos: 'TUSS' | 'CBHPM' | 'Própria';
  percentualRepasse: number;
  prazoFaturamento: number;
  prazoPagamento: number;
  ativo: boolean;
}

interface ProcedimentoTUSS {
  codigo: string;
  descricao: string;
  tabela: string;
  valorReferencia: number;
  valorConvenio: number;
  porte: string;
  filme?: number;
}

interface GuiaConvenio {
  id: string;
  numero: string;
  convenio: string;
  paciente: string;
  procedimento: string;
  codigoTUSS: string;
  valor: number;
  dataEmissao: string;
  dataExecucao?: string;
  status: StatusGuia;
  motivoGlosa?: string;
  valorGlosa?: number;
}

const CONVENIOS: Convenio[] = [
  { id: 'cv-01', nome: 'Unimed', registroANS: '301337', tipo: 'saude', contrato: 'CT-2024-001', vigencia: '01/2024 - 12/2026', tabelaPrecos: 'CBHPM', percentualRepasse: 85, prazoFaturamento: 30, prazoPagamento: 45, ativo: true },
  { id: 'cv-02', nome: 'Bradesco Saúde', registroANS: '005711', tipo: 'saude', contrato: 'CT-2024-002', vigencia: '03/2024 - 02/2027', tabelaPrecos: 'TUSS', percentualRepasse: 80, prazoFaturamento: 25, prazoPagamento: 60, ativo: true },
  { id: 'cv-03', nome: 'SulAmérica', registroANS: '006246', tipo: 'saude', contrato: 'CT-2024-003', vigencia: '06/2024 - 05/2027', tabelaPrecos: 'CBHPM', percentualRepasse: 82, prazoFaturamento: 30, prazoPagamento: 50, ativo: true },
  { id: 'cv-04', nome: 'Amil', registroANS: '326305', tipo: 'saude', contrato: 'CT-2024-004', vigencia: '01/2025 - 12/2027', tabelaPrecos: 'Própria', percentualRepasse: 75, prazoFaturamento: 20, prazoPagamento: 40, ativo: true },
  { id: 'cv-05', nome: 'NotreDame Intermédica', registroANS: '359017', tipo: 'saude', contrato: 'CT-2024-005', vigencia: '04/2024 - 03/2027', tabelaPrecos: 'TUSS', percentualRepasse: 78, prazoFaturamento: 25, prazoPagamento: 55, ativo: true },
];

const PROCEDIMENTOS_TUSS: ProcedimentoTUSS[] = [
  { codigo: '10101012', descricao: 'Consulta em consultório (no horário normal)', tabela: 'TUSS', valorReferencia: 250.00, valorConvenio: 180.00, porte: '1C' },
  { codigo: '10101039', descricao: 'Consulta em pronto-socorro', tabela: 'TUSS', valorReferencia: 300.00, valorConvenio: 220.00, porte: '2A' },
  { codigo: '40301010', descricao: 'Eletrocardiograma convencional (até 12 derivações)', tabela: 'TUSS', valorReferencia: 65.00, valorConvenio: 45.00, porte: '1A', filme: 1 },
  { codigo: '40301028', descricao: 'Teste ergométrico (convencional)', tabela: 'TUSS', valorReferencia: 180.00, valorConvenio: 130.00, porte: '3A' },
  { codigo: '40301036', descricao: 'Ecocardiograma transtorácico', tabela: 'TUSS', valorReferencia: 280.00, valorConvenio: 200.00, porte: '5B' },
  { codigo: '40301044', descricao: 'MAPA (Monitorização Ambulatorial da PA 24h)', tabela: 'TUSS', valorReferencia: 200.00, valorConvenio: 150.00, porte: '3B' },
  { codigo: '40301052', descricao: 'Holter 24 horas', tabela: 'TUSS', valorReferencia: 220.00, valorConvenio: 160.00, porte: '3B' },
  { codigo: '40302016', descricao: 'Hemograma completo', tabela: 'TUSS', valorReferencia: 15.00, valorConvenio: 10.00, porte: '1A' },
  { codigo: '40302024', descricao: 'Glicemia de jejum', tabela: 'TUSS', valorReferencia: 8.00, valorConvenio: 5.50, porte: '1A' },
  { codigo: '40302032', descricao: 'Hemoglobina glicada (HbA1c)', tabela: 'TUSS', valorReferencia: 25.00, valorConvenio: 18.00, porte: '1A' },
  { codigo: '40302040', descricao: 'Perfil lipídico completo', tabela: 'TUSS', valorReferencia: 35.00, valorConvenio: 25.00, porte: '1A' },
  { codigo: '40302058', descricao: 'TSH (Hormônio Tireoestimulante)', tabela: 'TUSS', valorReferencia: 30.00, valorConvenio: 22.00, porte: '1A' },
];

const GUIAS_DEMO: GuiaConvenio[] = [
  { id: 'g-001', numero: 'TISS-2026-00145', convenio: 'Unimed', paciente: 'João Carlos Silva', procedimento: 'Consulta em consultório', codigoTUSS: '10101012', valor: 180, dataEmissao: '2026-02-28', dataExecucao: '2026-02-28', status: 'faturada' },
  { id: 'g-002', numero: 'TISS-2026-00146', convenio: 'Bradesco Saúde', paciente: 'Maria Fernanda Santos', procedimento: 'Ecocardiograma transtorácico', codigoTUSS: '40301036', valor: 200, dataEmissao: '2026-02-28', status: 'autorizada' },
  { id: 'g-003', numero: 'TISS-2026-00147', convenio: 'SulAmérica', paciente: 'Ana Beatriz Costa', procedimento: 'Teste ergométrico', codigoTUSS: '40301028', valor: 130, dataEmissao: '2026-02-27', dataExecucao: '2026-02-27', status: 'paga' },
  { id: 'g-004', numero: 'TISS-2026-00148', convenio: 'Amil', paciente: 'Pedro Augusto Lima', procedimento: 'MAPA 24h', codigoTUSS: '40301044', valor: 150, dataEmissao: '2026-02-26', dataExecucao: '2026-02-26', status: 'glosada', motivoGlosa: 'Ausência de justificativa clínica (M30)', valorGlosa: 150 },
  { id: 'g-005', numero: 'TISS-2026-00149', convenio: 'Unimed', paciente: 'Carlos Eduardo Rocha', procedimento: 'Holter 24h', codigoTUSS: '40301052', valor: 160, dataEmissao: '2026-02-25', status: 'pendente' },
  { id: 'g-006', numero: 'TISS-2026-00150', convenio: 'Bradesco Saúde', paciente: 'Fernanda Oliveira', procedimento: 'Consulta em consultório', codigoTUSS: '10101012', valor: 180, dataEmissao: '2026-02-24', dataExecucao: '2026-02-24', status: 'glosada', motivoGlosa: 'Duplicidade de cobrança (M12)', valorGlosa: 180 },
];

export function GestaoConvenios() {
  const [aba, setAba] = useState<AbaConvenio>('dashboard');
  const [buscaTUSS, setBuscaTUSS] = useState('');
  const [convenioSelecionado, setConvenioSelecionado] = useState<string>('todos');

  const guiasFiltradas = GUIAS_DEMO.filter(g => convenioSelecionado === 'todos' || g.convenio === convenioSelecionado);
  const totalFaturado = guiasFiltradas.filter(g => g.status === 'faturada' || g.status === 'paga').reduce((a, g) => a + g.valor, 0);
  const totalGlosado = guiasFiltradas.filter(g => g.status === 'glosada').reduce((a, g) => a + (g.valorGlosa || 0), 0);
  const totalPendente = guiasFiltradas.filter(g => g.status === 'pendente' || g.status === 'autorizada').reduce((a, g) => a + g.valor, 0);
  const taxaGlosa = guiasFiltradas.length > 0 ? Math.round((guiasFiltradas.filter(g => g.status === 'glosada').length / guiasFiltradas.length) * 100) : 0;

  const procsFiltrados = PROCEDIMENTOS_TUSS.filter(p =>
    buscaTUSS === '' || p.codigo.includes(buscaTUSS) || p.descricao.toLowerCase().includes(buscaTUSS.toLowerCase())
  );

  const corStatus = (s: StatusGuia) => {
    switch (s) {
      case 'pendente': return 'bg-yellow-500/20 text-yellow-400';
      case 'autorizada': return 'bg-blue-500/20 text-blue-400';
      case 'executada': return 'bg-purple-500/20 text-purple-400';
      case 'faturada': return 'bg-orange-500/20 text-orange-400';
      case 'paga': return 'bg-green-500/20 text-green-400';
      case 'glosada': return 'bg-red-500/20 text-red-400';
      case 'recurso': return 'bg-pink-500/20 text-pink-400';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="Gestão de Convênios" />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">🏥</span> Gestão de Convênios Avançada
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">TUSS/CBHPM</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Tabelas de preços, controle de glosas, faturamento e autorizações</p>
      </div>

      {/* Abas */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {([
          { id: 'dashboard' as AbaConvenio, label: '📊 Dashboard', },
          { id: 'tabelas' as AbaConvenio, label: '📋 Tabelas TUSS' },
          { id: 'guias' as AbaConvenio, label: '📄 Guias' },
          { id: 'glosas' as AbaConvenio, label: '❌ Glosas' },
          { id: 'faturamento' as AbaConvenio, label: '💰 Faturamento' },
          { id: 'relatorios' as AbaConvenio, label: '📈 Relatórios' },
        ]).map(a => (
          <button key={a.id} onClick={() => setAba(a.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${aba === a.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {aba === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Faturado (Mês)', valor: `R$ ${totalFaturado.toLocaleString('pt-BR')}`, cor: 'bg-green-500/20 text-green-400 border-green-500/30' },
              { label: 'Glosado', valor: `R$ ${totalGlosado.toLocaleString('pt-BR')}`, cor: 'bg-red-500/20 text-red-400 border-red-500/30' },
              { label: 'Pendente', valor: `R$ ${totalPendente.toLocaleString('pt-BR')}`, cor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
              { label: 'Taxa de Glosa', valor: `${taxaGlosa}%`, cor: taxaGlosa > 10 ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
            ].map(s => (
              <div key={s.label} className={`${s.cor} border rounded-xl p-4 text-center`}>
                <p className="text-xl font-bold">{s.valor}</p>
                <p className="text-[10px] mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-bold mb-3">🏥 Convênios Ativos</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border">
                  <th className="text-left py-2 px-2">Convênio</th>
                  <th className="text-left py-2 px-2">ANS</th>
                  <th className="text-left py-2 px-2">Tabela</th>
                  <th className="text-center py-2 px-2">Repasse</th>
                  <th className="text-center py-2 px-2">Prazo Fat.</th>
                  <th className="text-center py-2 px-2">Prazo Pgto.</th>
                  <th className="text-center py-2 px-2">Status</th>
                </tr></thead>
                <tbody>
                  {CONVENIOS.map(c => (
                    <tr key={c.id} className="border-b border-border/50 hover:bg-accent/50">
                      <td className="py-2 px-2 font-medium">{c.nome}</td>
                      <td className="py-2 px-2 text-muted-foreground">{c.registroANS}</td>
                      <td className="py-2 px-2">{c.tabelaPrecos}</td>
                      <td className="py-2 px-2 text-center">{c.percentualRepasse}%</td>
                      <td className="py-2 px-2 text-center">{c.prazoFaturamento}d</td>
                      <td className="py-2 px-2 text-center">{c.prazoPagamento}d</td>
                      <td className="py-2 px-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${c.ativo ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {c.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tabelas TUSS */}
      {aba === 'tabelas' && (
        <div className="space-y-4">
          <input type="text" value={buscaTUSS} onChange={e => setBuscaTUSS(e.target.value)}
            placeholder="Buscar por código TUSS ou descrição..."
            className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm" />
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border bg-background/50">
                  <th className="text-left py-2.5 px-3">Código TUSS</th>
                  <th className="text-left py-2.5 px-3">Descrição</th>
                  <th className="text-center py-2.5 px-3">Porte</th>
                  <th className="text-right py-2.5 px-3">Valor Ref.</th>
                  <th className="text-right py-2.5 px-3">Valor Conv.</th>
                  <th className="text-center py-2.5 px-3">Diferença</th>
                </tr></thead>
                <tbody>
                  {procsFiltrados.map(p => {
                    const diff = Math.round(((p.valorConvenio - p.valorReferencia) / p.valorReferencia) * 100);
                    return (
                      <tr key={p.codigo} className="border-b border-border/50 hover:bg-accent/50">
                        <td className="py-2 px-3 font-mono font-bold text-primary">{p.codigo}</td>
                        <td className="py-2 px-3">{p.descricao}</td>
                        <td className="py-2 px-3 text-center">{p.porte}</td>
                        <td className="py-2 px-3 text-right">R$ {p.valorReferencia.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right font-bold">R$ {p.valorConvenio.toFixed(2)}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`text-[10px] ${diff < 0 ? 'text-red-400' : 'text-green-400'}`}>{diff}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground text-center">Tabela TUSS — Terminologia Unificada da Saúde Suplementar (ANS). Valores de referência CBHPM 2024.</p>
        </div>
      )}

      {/* Guias */}
      {aba === 'guias' && (
        <div className="space-y-4">
          <div className="flex gap-2 mb-3">
            <select value={convenioSelecionado} onChange={e => setConvenioSelecionado(e.target.value)}
              className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs">
              <option value="todos">Todos os convênios</option>
              {CONVENIOS.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
            </select>
            <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700">+ Nova Guia</button>
          </div>
          <div className="space-y-2">
            {guiasFiltradas.map(g => (
              <div key={g.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-primary font-bold">{g.numero}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${corStatus(g.status)}`}>{g.status.toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-bold">R$ {g.valor.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span>👤 {g.paciente}</span>
                  <span className="text-muted-foreground">•</span>
                  <span>🏥 {g.convenio}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{g.codigoTUSS} — {g.procedimento}</span>
                </div>
                {g.motivoGlosa && (
                  <div className="mt-2 bg-red-500/10 border border-red-500/30 rounded-lg p-2">
                    <p className="text-[10px] text-red-400"><strong>Motivo da Glosa:</strong> {g.motivoGlosa}</p>
                    <button className="text-[10px] text-primary hover:underline mt-1">Abrir Recurso →</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Glosas */}
      {aba === 'glosas' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-red-400">R$ {totalGlosado.toLocaleString('pt-BR')}</p>
              <p className="text-[10px] text-red-300">Total Glosado (Mês)</p>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-yellow-400">{GUIAS_DEMO.filter(g => g.status === 'glosada').length}</p>
              <p className="text-[10px] text-yellow-300">Guias Glosadas</p>
            </div>
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-purple-400">{taxaGlosa}%</p>
              <p className="text-[10px] text-purple-300">Taxa de Glosa</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-bold mb-3">🧠 Análise Anti-Glosa (IA)</h3>
            <div className="space-y-2">
              {[
                { motivo: 'M30 — Ausência de justificativa clínica', freq: 3, sugestao: 'Incluir CID-10 e justificativa na solicitação de MAPA/Holter' },
                { motivo: 'M12 — Duplicidade de cobrança', freq: 2, sugestao: 'Verificar se há guias duplicadas antes de faturar' },
                { motivo: 'M07 — Procedimento não coberto', freq: 1, sugestao: 'Conferir tabela de cobertura do convênio antes de solicitar' },
              ].map((g, i) => (
                <div key={i} className="bg-background/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-red-400">{g.motivo}</span>
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">{g.freq}x</span>
                  </div>
                  <p className="text-[10px] text-green-400">💡 Sugestão: {g.sugestao}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Faturamento */}
      {aba === 'faturamento' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-bold mb-3">💰 Resumo de Faturamento por Convênio</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border">
                  <th className="text-left py-2 px-2">Convênio</th>
                  <th className="text-center py-2 px-2">Guias</th>
                  <th className="text-right py-2 px-2">Faturado</th>
                  <th className="text-right py-2 px-2">Recebido</th>
                  <th className="text-right py-2 px-2">Glosado</th>
                  <th className="text-center py-2 px-2">Taxa Glosa</th>
                </tr></thead>
                <tbody>
                  {CONVENIOS.map(c => {
                    const guiasConv = GUIAS_DEMO.filter(g => g.convenio === c.nome);
                    const fat = guiasConv.filter(g => g.status === 'faturada' || g.status === 'paga').reduce((a, g) => a + g.valor, 0);
                    const rec = guiasConv.filter(g => g.status === 'paga').reduce((a, g) => a + g.valor, 0);
                    const glo = guiasConv.filter(g => g.status === 'glosada').reduce((a, g) => a + (g.valorGlosa || 0), 0);
                    const taxa = guiasConv.length > 0 ? Math.round((guiasConv.filter(g => g.status === 'glosada').length / guiasConv.length) * 100) : 0;
                    return (
                      <tr key={c.id} className="border-b border-border/50 hover:bg-accent/50">
                        <td className="py-2 px-2 font-medium">{c.nome}</td>
                        <td className="py-2 px-2 text-center">{guiasConv.length}</td>
                        <td className="py-2 px-2 text-right">R$ {fat.toFixed(2)}</td>
                        <td className="py-2 px-2 text-right text-green-400">R$ {rec.toFixed(2)}</td>
                        <td className="py-2 px-2 text-right text-red-400">R$ {glo.toFixed(2)}</td>
                        <td className="py-2 px-2 text-center">
                          <span className={`text-[10px] ${taxa > 10 ? 'text-red-400' : 'text-green-400'}`}>{taxa}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs">📤 Exportar XML TISS</button>
            <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs">📊 Gerar Relatório</button>
          </div>
        </div>
      )}

      {/* Relatórios */}
      {aba === 'relatorios' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { titulo: 'Produtividade por Convênio', desc: 'Análise de volume e valor por operadora', icone: '📊' },
            { titulo: 'Análise de Glosas', desc: 'Motivos, frequência e impacto financeiro', icone: '❌' },
            { titulo: 'Tempo de Recebimento', desc: 'Prazo médio de pagamento por convênio', icone: '⏰' },
            { titulo: 'Comparativo Mensal', desc: 'Evolução do faturamento mês a mês', icone: '📈' },
            { titulo: 'Procedimentos Mais Realizados', desc: 'Ranking de procedimentos por volume', icone: '🏆' },
            { titulo: 'Previsão de Recebimento', desc: 'Forecast baseado em guias faturadas', icone: '🔮' },
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
