/**
 * MedFocus — Módulo de Estoque e Farmácia (Sprint 9)
 * 
 * Simulador educacional de gestão de estoque hospitalar e farmácia.
 * 
 * Funcionalidades:
 * - Controle de estoque de medicamentos e insumos
 * - Alertas de validade e estoque mínimo
 * - Gestão de lotes e rastreabilidade
 * - Curva ABC de medicamentos
 * - Pedidos de compra
 * - Controle de psicotrópicos (Portaria 344/98)
 */

import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

type EstoqueTela = 'dashboard' | 'medicamentos' | 'insumos' | 'alertas' | 'pedidos';

interface ItemEstoque {
  id: string;
  nome: string;
  principioAtivo: string;
  categoria: string;
  lote: string;
  validade: string;
  quantidade: number;
  estoqueMinimo: number;
  preco: string;
  fornecedor: string;
  controlado: boolean;
  curvaABC: 'A' | 'B' | 'C';
}

const ESTOQUE_DEMO: ItemEstoque[] = [
  { id: 'MED-001', nome: 'Dipirona 500mg (cx 20)', principioAtivo: 'Dipirona sódica', categoria: 'Analgésico', lote: 'L2026-A01', validade: '2027-06-15', quantidade: 450, estoqueMinimo: 100, preco: 'R$ 8,90', fornecedor: 'Distribuidora Saúde', controlado: false, curvaABC: 'A' },
  { id: 'MED-002', nome: 'Amoxicilina 500mg (cx 21)', principioAtivo: 'Amoxicilina tri-hidratada', categoria: 'Antibiótico', lote: 'L2026-B03', validade: '2027-03-20', quantidade: 180, estoqueMinimo: 50, preco: 'R$ 22,50', fornecedor: 'Pharma Brasil', controlado: false, curvaABC: 'A' },
  { id: 'MED-003', nome: 'Losartana 50mg (cx 30)', principioAtivo: 'Losartana potássica', categoria: 'Anti-hipertensivo', lote: 'L2026-C05', validade: '2027-09-10', quantidade: 320, estoqueMinimo: 80, preco: 'R$ 15,90', fornecedor: 'MedSupply', controlado: false, curvaABC: 'A' },
  { id: 'MED-004', nome: 'Rivotril 2mg (cx 30)', principioAtivo: 'Clonazepam', categoria: 'Benzodiazepínico', lote: 'L2026-D02', validade: '2027-01-30', quantidade: 45, estoqueMinimo: 20, preco: 'R$ 18,70', fornecedor: 'Roche', controlado: true, curvaABC: 'B' },
  { id: 'MED-005', nome: 'Omeprazol 20mg (cx 28)', principioAtivo: 'Omeprazol', categoria: 'IBP', lote: 'L2026-E07', validade: '2026-08-25', quantidade: 280, estoqueMinimo: 60, preco: 'R$ 12,40', fornecedor: 'Distribuidora Saúde', controlado: false, curvaABC: 'A' },
  { id: 'MED-006', nome: 'Ritalina 10mg (cx 30)', principioAtivo: 'Metilfenidato', categoria: 'Psicoestimulante', lote: 'L2026-F01', validade: '2027-04-15', quantidade: 12, estoqueMinimo: 15, preco: 'R$ 45,90', fornecedor: 'Novartis', controlado: true, curvaABC: 'B' },
  { id: 'INS-001', nome: 'Luva Procedimento M (cx 100)', principioAtivo: '—', categoria: 'Insumo', lote: 'L2026-G04', validade: '2028-12-31', quantidade: 85, estoqueMinimo: 30, preco: 'R$ 32,00', fornecedor: 'MedSupply', controlado: false, curvaABC: 'B' },
  { id: 'INS-002', nome: 'Seringa 5ml c/ agulha (cx 100)', principioAtivo: '—', categoria: 'Insumo', lote: 'L2026-H02', validade: '2028-06-30', quantidade: 120, estoqueMinimo: 40, preco: 'R$ 28,50', fornecedor: 'BD Medical', controlado: false, curvaABC: 'B' },
  { id: 'MED-007', nome: 'Insulina NPH 100UI (frasco)', principioAtivo: 'Insulina humana NPH', categoria: 'Antidiabético', lote: 'L2026-I01', validade: '2026-05-10', quantidade: 25, estoqueMinimo: 10, preco: 'R$ 35,00', fornecedor: 'Novo Nordisk', controlado: false, curvaABC: 'A' },
  { id: 'MED-008', nome: 'Morfina 10mg/ml (amp)', principioAtivo: 'Sulfato de morfina', categoria: 'Opioide', lote: 'L2026-J03', validade: '2027-02-28', quantidade: 8, estoqueMinimo: 10, preco: 'R$ 12,80', fornecedor: 'Cristália', controlado: true, curvaABC: 'C' },
];

export function MedFocusIAEstoque() {
  const [tela, setTela] = useState<EstoqueTela>('dashboard');
  const [busca, setBusca] = useState('');

  const itens = ESTOQUE_DEMO;
  const alertasValidade = itens.filter(i => {
    const val = new Date(i.validade);
    const hoje = new Date();
    const diff = (val.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);
    return diff < 180;
  });
  const alertasEstoque = itens.filter(i => i.quantidade <= i.estoqueMinimo);
  const controlados = itens.filter(i => i.controlado);

  const filtrados = itens.filter(i =>
    !busca || i.nome.toLowerCase().includes(busca.toLowerCase()) ||
    i.principioAtivo.toLowerCase().includes(busca.toLowerCase()) ||
    i.id.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="compact" moduleName="Estoque e Farmácia" dismissible={false} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">💊</span> Estoque & Farmácia
          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-medium">SIMULAÇÃO</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestão de estoque hospitalar e farmácia — Dados fictícios para treinamento
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'dashboard' as EstoqueTela, label: 'Dashboard', icon: '📊' },
          { id: 'medicamentos' as EstoqueTela, label: 'Medicamentos', icon: '💊' },
          { id: 'insumos' as EstoqueTela, label: 'Insumos', icon: '🩹' },
          { id: 'alertas' as EstoqueTela, label: `Alertas (${alertasValidade.length + alertasEstoque.length})`, icon: '⚠️' },
          { id: 'pedidos' as EstoqueTela, label: 'Pedidos', icon: '📦' },
        ].map(t => (
          <button key={t.id} onClick={() => setTela(t.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tela === t.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border hover:bg-accent'
            }`}>
            <span className="mr-1">{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tela === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total de Itens', value: itens.length.toString(), icon: '📦', color: 'text-blue-400' },
              { label: 'Controlados', value: controlados.length.toString(), icon: '🔒', color: 'text-red-400' },
              { label: 'Estoque Baixo', value: alertasEstoque.length.toString(), icon: '⚠️', color: 'text-yellow-400' },
              { label: 'Próx. Vencimento', value: alertasValidade.length.toString(), icon: '📅', color: 'text-orange-400' },
            ].map((kpi, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>{kpi.icon}</span>
                  <span className="text-xs text-muted-foreground">{kpi.label}</span>
                </div>
                <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Curva ABC */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">📊 Curva ABC de Medicamentos</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {['A', 'B', 'C'].map(curva => {
                const itensCurva = itens.filter(i => i.curvaABC === curva);
                return (
                  <div key={curva} className={`rounded-lg p-4 border ${
                    curva === 'A' ? 'bg-green-500/10 border-green-500/30' :
                    curva === 'B' ? 'bg-yellow-500/10 border-yellow-500/30' :
                    'bg-red-500/10 border-red-500/30'
                  }`}>
                    <h4 className={`font-bold text-lg mb-2 ${
                      curva === 'A' ? 'text-green-400' : curva === 'B' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      Curva {curva} — {itensCurva.length} itens
                    </h4>
                    <p className="text-xs text-foreground/70 mb-2">
                      {curva === 'A' ? 'Alto giro — 70% do consumo' :
                       curva === 'B' ? 'Médio giro — 20% do consumo' :
                       'Baixo giro — 10% do consumo'}
                    </p>
                    <div className="space-y-1">
                      {itensCurva.map(item => (
                        <p key={item.id} className="text-xs text-foreground/60">{item.nome}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controlados */}
          {controlados.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <h3 className="font-bold text-red-400 mb-3">🔒 Medicamentos Controlados (Portaria 344/98)</h3>
              <p className="text-xs text-foreground/70 mb-4">
                Medicamentos sujeitos a controle especial conforme a Portaria SVS/MS nº 344/1998.
                Requerem receituário especial e escrituração no SNGPC.
              </p>
              <div className="space-y-2">
                {controlados.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{item.nome}</p>
                      <p className="text-xs text-foreground/60">{item.principioAtivo} — Lote: {item.lote}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${item.quantidade <= item.estoqueMinimo ? 'text-red-400' : 'text-foreground'}`}>
                        {item.quantidade} un.
                      </p>
                      <p className="text-xs text-foreground/60">Mín: {item.estoqueMinimo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Medicamentos / Insumos */}
      {(tela === 'medicamentos' || tela === 'insumos') && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar por nome, princípio ativo ou código..."
              className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
            <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium">
              + Novo Item
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left bg-muted/20">
                    <th className="p-3 text-xs text-muted-foreground">Código</th>
                    <th className="p-3 text-xs text-muted-foreground">Nome</th>
                    <th className="p-3 text-xs text-muted-foreground">Lote</th>
                    <th className="p-3 text-xs text-muted-foreground">Validade</th>
                    <th className="p-3 text-xs text-muted-foreground">Qtd</th>
                    <th className="p-3 text-xs text-muted-foreground">Preço</th>
                    <th className="p-3 text-xs text-muted-foreground">ABC</th>
                    <th className="p-3 text-xs text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados
                    .filter(i => tela === 'medicamentos' ? i.categoria !== 'Insumo' : i.categoria === 'Insumo')
                    .map(item => (
                    <tr key={item.id} className="border-b border-border/50 hover:bg-muted/10 transition">
                      <td className="p-3 font-mono text-xs">{item.id}</td>
                      <td className="p-3">
                        <p className="font-medium">{item.nome}</p>
                        <p className="text-xs text-foreground/60">{item.principioAtivo}</p>
                      </td>
                      <td className="p-3 text-foreground/70 font-mono text-xs">{item.lote}</td>
                      <td className="p-3 text-foreground/70">{item.validade}</td>
                      <td className={`p-3 font-bold ${item.quantidade <= item.estoqueMinimo ? 'text-red-400' : ''}`}>
                        {item.quantidade}
                      </td>
                      <td className="p-3 text-foreground/70">{item.preco}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          item.curvaABC === 'A' ? 'text-green-400 bg-green-500/10' :
                          item.curvaABC === 'B' ? 'text-yellow-400 bg-yellow-500/10' :
                          'text-red-400 bg-red-500/10'
                        }`}>{item.curvaABC}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {item.controlado && <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">🔒</span>}
                          {item.quantidade <= item.estoqueMinimo && <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400">⚠️</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Alertas */}
      {tela === 'alertas' && (
        <div className="space-y-6">
          {alertasEstoque.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <h3 className="font-bold text-red-400 mb-4">⚠️ Estoque Abaixo do Mínimo</h3>
              <div className="space-y-2">
                {alertasEstoque.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{item.nome}</p>
                      <p className="text-xs text-foreground/60">Estoque: {item.quantidade} | Mínimo: {item.estoqueMinimo}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
                      Gerar Pedido
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {alertasValidade.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <h3 className="font-bold text-yellow-400 mb-4">📅 Próximos ao Vencimento (180 dias)</h3>
              <div className="space-y-2">
                {alertasValidade.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{item.nome}</p>
                      <p className="text-xs text-foreground/60">Lote: {item.lote} | Validade: {item.validade}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                      Vence em breve
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pedidos */}
      {tela === 'pedidos' && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">📦 Pedidos de Compra (Simulação)</h3>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium">+ Novo Pedido</button>
          </div>
          <div className="space-y-3">
            {[
              { id: 'PC-2026-015', fornecedor: 'Distribuidora Saúde', itens: 8, valor: 'R$ 2.450,00', status: 'aprovado', data: '2026-02-28' },
              { id: 'PC-2026-014', fornecedor: 'Pharma Brasil', itens: 5, valor: 'R$ 1.890,00', status: 'entregue', data: '2026-02-25' },
              { id: 'PC-2026-013', fornecedor: 'MedSupply', itens: 12, valor: 'R$ 4.320,00', status: 'pendente', data: '2026-03-01' },
            ].map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                <div>
                  <p className="font-medium text-sm">{p.id} — {p.fornecedor}</p>
                  <p className="text-xs text-foreground/60">{p.itens} itens | {p.data}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{p.valor}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    p.status === 'aprovado' ? 'text-blue-400 bg-blue-500/10' :
                    p.status === 'entregue' ? 'text-green-400 bg-green-500/10' :
                    'text-yellow-400 bg-yellow-500/10'
                  }`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <EducationalDisclaimer variant="footer" />
    </div>
  );
}
