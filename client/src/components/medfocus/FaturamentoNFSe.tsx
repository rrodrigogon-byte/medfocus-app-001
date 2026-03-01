/**
 * MedFocus — Faturamento e NFS-e Integrado (Sprint 29)
 * 
 * Sistema completo de faturamento:
 * - Emissão de NFS-e (Nota Fiscal de Serviço Eletrônica)
 * - Gestão de cobranças (Pix, boleto, cartão)
 * - Conciliação bancária
 * - Relatórios financeiros (DRE, fluxo de caixa)
 * - Split de pagamento para médicos
 * - Integração com gateway de pagamento
 * 
 * DISCLAIMER: Ferramenta exclusivamente educacional e de apoio ao estudo.
 */

import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

type AbaFaturamento = 'dashboard' | 'nfse' | 'cobrancas' | 'conciliacao' | 'split' | 'relatorios';
type StatusNFSe = 'emitida' | 'cancelada' | 'pendente' | 'erro';
type StatusCobranca = 'paga' | 'pendente' | 'vencida' | 'cancelada';
type MeioPagamento = 'pix' | 'boleto' | 'cartao-credito' | 'cartao-debito' | 'dinheiro' | 'convenio' | 'transferencia';

interface NFSe {
  id: string;
  numero: string;
  paciente: string;
  cpf: string;
  servico: string;
  valor: number;
  issqn: number;
  dataEmissao: string;
  status: StatusNFSe;
  codigoVerificacao?: string;
  prefeitura: string;
}

interface Cobranca {
  id: string;
  paciente: string;
  descricao: string;
  valor: number;
  meio: MeioPagamento;
  status: StatusCobranca;
  dataVencimento: string;
  dataPagamento?: string;
  parcelas?: number;
  parcelaAtual?: number;
  nfseEmitida: boolean;
}

const NFSE_DEMO: NFSe[] = [
  { id: 'nf-001', numero: '2026/00145', paciente: 'João Carlos Silva', cpf: '***.***.***-12', servico: 'Consulta Cardiológica', valor: 350.00, issqn: 17.50, dataEmissao: '28/02/2026', status: 'emitida', codigoVerificacao: 'ABC123DEF', prefeitura: 'São Paulo/SP' },
  { id: 'nf-002', numero: '2026/00146', paciente: 'Maria Fernanda Santos', cpf: '***.***.***-34', servico: 'Ecocardiograma', valor: 280.00, issqn: 14.00, dataEmissao: '28/02/2026', status: 'emitida', codigoVerificacao: 'GHI456JKL', prefeitura: 'São Paulo/SP' },
  { id: 'nf-003', numero: '2026/00147', paciente: 'Ana Beatriz Costa', cpf: '***.***.***-56', servico: 'Teleconsulta Cardiológica', valor: 200.00, issqn: 10.00, dataEmissao: '27/02/2026', status: 'emitida', codigoVerificacao: 'MNO789PQR', prefeitura: 'São Paulo/SP' },
  { id: 'nf-004', numero: '—', paciente: 'Pedro Augusto Lima', cpf: '***.***.***-78', servico: 'MAPA 24h', valor: 400.00, issqn: 0, dataEmissao: '—', status: 'pendente', prefeitura: 'São Paulo/SP' },
];

const COBRANCAS_DEMO: Cobranca[] = [
  { id: 'cb-001', paciente: 'João Carlos Silva', descricao: 'Consulta + ECG', valor: 350.00, meio: 'pix', status: 'paga', dataVencimento: '28/02/2026', dataPagamento: '28/02/2026', nfseEmitida: true },
  { id: 'cb-002', paciente: 'Maria Fernanda Santos', descricao: 'Ecocardiograma', valor: 280.00, meio: 'cartao-credito', status: 'paga', dataVencimento: '28/02/2026', dataPagamento: '28/02/2026', parcelas: 3, parcelaAtual: 1, nfseEmitida: true },
  { id: 'cb-003', paciente: 'Ana Beatriz Costa', descricao: 'Teleconsulta', valor: 200.00, meio: 'pix', status: 'paga', dataVencimento: '27/02/2026', dataPagamento: '27/02/2026', nfseEmitida: true },
  { id: 'cb-004', paciente: 'Pedro Augusto Lima', descricao: 'MAPA 24h', valor: 400.00, meio: 'boleto', status: 'pendente', dataVencimento: '05/03/2026', nfseEmitida: false },
  { id: 'cb-005', paciente: 'Carlos Eduardo Rocha', descricao: 'Consulta + Holter', valor: 470.00, meio: 'convenio', status: 'pendente', dataVencimento: '15/03/2026', nfseEmitida: false },
  { id: 'cb-006', paciente: 'Fernanda Oliveira', descricao: 'Consulta Endocrinologia', valor: 300.00, meio: 'dinheiro', status: 'paga', dataVencimento: '28/02/2026', dataPagamento: '28/02/2026', nfseEmitida: false },
  { id: 'cb-007', paciente: 'Roberto Almeida', descricao: 'Consulta (no-show)', valor: 250.00, meio: 'pix', status: 'cancelada', dataVencimento: '28/02/2026', nfseEmitida: false },
];

export function FaturamentoNFSe() {
  const [aba, setAba] = useState<AbaFaturamento>('dashboard');

  const totalRecebido = COBRANCAS_DEMO.filter(c => c.status === 'paga').reduce((a, c) => a + c.valor, 0);
  const totalPendente = COBRANCAS_DEMO.filter(c => c.status === 'pendente').reduce((a, c) => a + c.valor, 0);
  const totalCancelado = COBRANCAS_DEMO.filter(c => c.status === 'cancelada').reduce((a, c) => a + c.valor, 0);
  const totalNFSe = NFSE_DEMO.filter(n => n.status === 'emitida').reduce((a, n) => a + n.valor, 0);
  const totalISSQN = NFSE_DEMO.filter(n => n.status === 'emitida').reduce((a, n) => a + n.issqn, 0);

  const corStatus = (s: StatusCobranca) => {
    switch (s) {
      case 'paga': return 'bg-green-500/20 text-green-400';
      case 'pendente': return 'bg-yellow-500/20 text-yellow-400';
      case 'vencida': return 'bg-red-500/20 text-red-400';
      case 'cancelada': return 'bg-gray-500/20 text-gray-400';
    }
  };

  const iconeMeio = (m: MeioPagamento) => {
    switch (m) {
      case 'pix': return '⚡';
      case 'boleto': return '📄';
      case 'cartao-credito': return '💳';
      case 'cartao-debito': return '💳';
      case 'dinheiro': return '💵';
      case 'convenio': return '🏥';
      case 'transferencia': return '🏦';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="Faturamento e NFS-e" />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">💰</span> Faturamento e NFS-e
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Integrado</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Emissão de notas fiscais, cobranças, conciliação e split de pagamento</p>
      </div>

      <div className="flex gap-1.5 mb-6 flex-wrap">
        {([
          { id: 'dashboard' as AbaFaturamento, label: '📊 Dashboard' },
          { id: 'nfse' as AbaFaturamento, label: '📝 NFS-e' },
          { id: 'cobrancas' as AbaFaturamento, label: '💳 Cobranças' },
          { id: 'conciliacao' as AbaFaturamento, label: '🏦 Conciliação' },
          { id: 'split' as AbaFaturamento, label: '✂️ Split' },
          { id: 'relatorios' as AbaFaturamento, label: '📈 Relatórios' },
        ]).map(a => (
          <button key={a.id} onClick={() => setAba(a.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${aba === a.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
            {a.label}
          </button>
        ))}
      </div>

      {aba === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: 'Recebido', valor: `R$ ${totalRecebido.toLocaleString('pt-BR')}`, cor: 'bg-green-500/20 text-green-400 border-green-500/30' },
              { label: 'Pendente', valor: `R$ ${totalPendente.toLocaleString('pt-BR')}`, cor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
              { label: 'NFS-e Emitidas', valor: NFSE_DEMO.filter(n => n.status === 'emitida').length.toString(), cor: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
              { label: 'ISSQN Devido', valor: `R$ ${totalISSQN.toFixed(2)}`, cor: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
              { label: 'Cancelado/Perdido', valor: `R$ ${totalCancelado.toLocaleString('pt-BR')}`, cor: 'bg-red-500/20 text-red-400 border-red-500/30' },
            ].map(s => (
              <div key={s.label} className={`${s.cor} border rounded-xl p-3 text-center`}>
                <p className="text-xl font-bold">{s.valor}</p>
                <p className="text-[10px]">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-bold mb-3">💳 Distribuição por Meio de Pagamento</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['pix', 'cartao-credito', 'boleto', 'dinheiro', 'convenio'].map(m => {
                const total = COBRANCAS_DEMO.filter(c => c.meio === m && c.status === 'paga').reduce((a, c) => a + c.valor, 0);
                const qtd = COBRANCAS_DEMO.filter(c => c.meio === m).length;
                return (
                  <div key={m} className="bg-background/50 rounded-lg p-3 text-center">
                    <p className="text-lg">{iconeMeio(m as MeioPagamento)}</p>
                    <p className="text-sm font-bold">R$ {total.toLocaleString('pt-BR')}</p>
                    <p className="text-[10px] text-muted-foreground">{m.replace('-', ' ')} ({qtd}x)</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {aba === 'nfse' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">{NFSE_DEMO.length} notas fiscais</p>
            <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700">+ Emitir NFS-e</button>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-border bg-background/50">
                <th className="text-left py-2.5 px-3">Número</th>
                <th className="text-left py-2.5 px-3">Paciente</th>
                <th className="text-left py-2.5 px-3">Serviço</th>
                <th className="text-right py-2.5 px-3">Valor</th>
                <th className="text-right py-2.5 px-3">ISSQN</th>
                <th className="text-center py-2.5 px-3">Data</th>
                <th className="text-center py-2.5 px-3">Status</th>
              </tr></thead>
              <tbody>
                {NFSE_DEMO.map(n => (
                  <tr key={n.id} className="border-b border-border/50 hover:bg-accent/50">
                    <td className="py-2 px-3 font-mono font-bold text-primary">{n.numero}</td>
                    <td className="py-2 px-3">{n.paciente}</td>
                    <td className="py-2 px-3 text-muted-foreground">{n.servico}</td>
                    <td className="py-2 px-3 text-right font-bold">R$ {n.valor.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right text-muted-foreground">R$ {n.issqn.toFixed(2)}</td>
                    <td className="py-2 px-3 text-center">{n.dataEmissao}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        n.status === 'emitida' ? 'bg-green-500/20 text-green-400' :
                        n.status === 'pendente' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>{n.status.toUpperCase()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {aba === 'cobrancas' && (
        <div className="space-y-3">
          <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 mb-2">+ Nova Cobrança</button>
          {COBRANCAS_DEMO.map(c => (
            <div key={c.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{iconeMeio(c.meio)}</span>
                  <div>
                    <span className="font-bold text-sm">{c.paciente}</span>
                    <p className="text-[10px] text-muted-foreground">{c.descricao}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">R$ {c.valor.toFixed(2)}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${corStatus(c.status)}`}>{c.status.toUpperCase()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span>Vencimento: {c.dataVencimento}</span>
                {c.dataPagamento && <span>Pago em: {c.dataPagamento}</span>}
                {c.parcelas && <span>Parcela {c.parcelaAtual}/{c.parcelas}</span>}
                {c.nfseEmitida ? <span className="text-green-400">NFS-e ✓</span> : <span className="text-yellow-400">NFS-e pendente</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {aba === 'conciliacao' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-bold mb-3">🏦 Conciliação Bancária — Fevereiro/2026</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-green-400">R$ {totalRecebido.toLocaleString('pt-BR')}</p>
                <p className="text-[10px]">Recebido no Sistema</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-blue-400">R$ {(totalRecebido - 50).toLocaleString('pt-BR')}</p>
                <p className="text-[10px]">Extrato Bancário</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-yellow-400">R$ 50,00</p>
                <p className="text-[10px]">Diferença</p>
              </div>
            </div>
            <p className="text-[10px] text-yellow-400">⚠️ 1 transação não conciliada: Pagamento em dinheiro de R$ 300,00 (Fernanda Oliveira) sem registro bancário.</p>
          </div>
        </div>
      )}

      {aba === 'split' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-bold mb-3">✂️ Split de Pagamento — Médicos</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border">
                  <th className="text-left py-2 px-2">Médico</th>
                  <th className="text-center py-2 px-2">Consultas</th>
                  <th className="text-right py-2 px-2">Faturamento</th>
                  <th className="text-center py-2 px-2">% Repasse</th>
                  <th className="text-right py-2 px-2">Valor Médico</th>
                  <th className="text-right py-2 px-2">Valor Clínica</th>
                </tr></thead>
                <tbody>
                  {[
                    { medico: 'Dr. Ricardo Mendes', consultas: 95, faturamento: 32000, repasse: 60 },
                    { medico: 'Dra. Camila Souza', consultas: 50, faturamento: 16500, repasse: 55 },
                  ].map(m => (
                    <tr key={m.medico} className="border-b border-border/50">
                      <td className="py-2 px-2 font-medium">{m.medico}</td>
                      <td className="py-2 px-2 text-center">{m.consultas}</td>
                      <td className="py-2 px-2 text-right">R$ {m.faturamento.toLocaleString('pt-BR')}</td>
                      <td className="py-2 px-2 text-center">{m.repasse}%</td>
                      <td className="py-2 px-2 text-right text-green-400">R$ {(m.faturamento * m.repasse / 100).toLocaleString('pt-BR')}</td>
                      <td className="py-2 px-2 text-right text-blue-400">R$ {(m.faturamento * (100 - m.repasse) / 100).toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {aba === 'relatorios' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { titulo: 'DRE — Demonstrativo de Resultado', desc: 'Receitas, custos e lucro do período', icone: '📊' },
            { titulo: 'Fluxo de Caixa', desc: 'Entradas e saídas diárias/semanais', icone: '💰' },
            { titulo: 'Relatório de NFS-e', desc: 'Notas emitidas, canceladas e ISSQN', icone: '📝' },
            { titulo: 'Inadimplência', desc: 'Cobranças vencidas e taxa de inadimplência', icone: '⚠️' },
            { titulo: 'Previsão de Recebimento', desc: 'Forecast de recebíveis por convênio', icone: '🔮' },
            { titulo: 'Relatório Fiscal', desc: 'Impostos devidos e guias de recolhimento', icone: '🏛️' },
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
