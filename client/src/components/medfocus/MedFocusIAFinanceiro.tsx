/**
 * MedFocusIA SaaS — Módulo Financeiro
 * Sprint 5: Fluxo de Caixa, DRE, Contas a Receber/Pagar, NFS-e, Pix, Boleto
 */
import React, { useState } from 'react';

// ============================================================
// Financial Data
// ============================================================
interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  paymentMethod: string;
  patient?: string;
  doctor?: string;
}

const TRANSACTIONS: Transaction[] = [
  { id: 'FIN-001', date: '01/03/2026', description: 'Consulta Cardiologia', category: 'Consultas', type: 'income', amount: 350.00, status: 'paid', paymentMethod: 'Pix', patient: 'Maria Silva', doctor: 'Dr. Carlos' },
  { id: 'FIN-002', date: '01/03/2026', description: 'Consulta Dermatologia', category: 'Consultas', type: 'income', amount: 280.00, status: 'paid', paymentMethod: 'Cartão Crédito', patient: 'João Santos', doctor: 'Dra. Ana' },
  { id: 'FIN-003', date: '01/03/2026', description: 'Retorno Ortopedia', category: 'Consultas', type: 'income', amount: 200.00, status: 'pending', paymentMethod: 'Boleto', patient: 'Pedro Costa', doctor: 'Dr. Roberto' },
  { id: 'FIN-004', date: '01/03/2026', description: 'Ecocardiograma', category: 'Exames', type: 'income', amount: 450.00, status: 'paid', paymentMethod: 'Convênio Unimed', patient: 'Ana Ferreira', doctor: 'Dr. Carlos' },
  { id: 'FIN-005', date: '01/03/2026', description: 'Consulta Ginecologia', category: 'Consultas', type: 'income', amount: 300.00, status: 'paid', paymentMethod: 'Pix', patient: 'Lucia Souza', doctor: 'Dra. Lucia' },
  { id: 'FIN-006', date: '01/03/2026', description: 'Telemedicina', category: 'Telemedicina', type: 'income', amount: 250.00, status: 'pending', paymentMethod: 'Link Pagamento', patient: 'Roberto Alves', doctor: 'Dr. Roberto' },
  { id: 'FIN-007', date: '28/02/2026', description: 'Aluguel da sala', category: 'Infraestrutura', type: 'expense', amount: 8500.00, status: 'paid', paymentMethod: 'Transferência' },
  { id: 'FIN-008', date: '28/02/2026', description: 'Folha de pagamento', category: 'Pessoal', type: 'expense', amount: 35000.00, status: 'paid', paymentMethod: 'Transferência' },
  { id: 'FIN-009', date: '28/02/2026', description: 'Material de consumo', category: 'Materiais', type: 'expense', amount: 2800.00, status: 'paid', paymentMethod: 'Cartão Corporativo' },
  { id: 'FIN-010', date: '28/02/2026', description: 'Software e licenças', category: 'Tecnologia', type: 'expense', amount: 1200.00, status: 'paid', paymentMethod: 'Cartão Crédito' },
  { id: 'FIN-011', date: '27/02/2026', description: 'Energia elétrica', category: 'Infraestrutura', type: 'expense', amount: 1850.00, status: 'paid', paymentMethod: 'Débito Automático' },
  { id: 'FIN-012', date: '27/02/2026', description: 'Internet e telefonia', category: 'Infraestrutura', type: 'expense', amount: 450.00, status: 'paid', paymentMethod: 'Débito Automático' },
  { id: 'FIN-013', date: '25/02/2026', description: 'Consulta Pediatria', category: 'Consultas', type: 'income', amount: 280.00, status: 'overdue', paymentMethod: 'Boleto', patient: 'Fernanda Lima', doctor: 'Dr. Fernando' },
  { id: 'FIN-014', date: '01/03/2026', description: 'Repasse Unimed - Fev/2026', category: 'Convênios', type: 'income', amount: 12450.00, status: 'pending', paymentMethod: 'Transferência' },
  { id: 'FIN-015', date: '01/03/2026', description: 'Repasse Bradesco Saúde - Fev/2026', category: 'Convênios', type: 'income', amount: 8900.00, status: 'pending', paymentMethod: 'Transferência' },
];

interface Invoice {
  id: string;
  number: string;
  patient: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  items: { description: string; quantity: number; unitPrice: number }[];
}

const INVOICES: Invoice[] = [
  { id: 'NF-001', number: '2026/000145', patient: 'Maria Silva', issueDate: '01/03/2026', dueDate: '15/03/2026', amount: 350.00, status: 'pending',
    items: [{ description: 'Consulta Cardiologia', quantity: 1, unitPrice: 350.00 }] },
  { id: 'NF-002', number: '2026/000144', patient: 'João Santos', issueDate: '01/03/2026', dueDate: '01/03/2026', amount: 280.00, status: 'paid',
    items: [{ description: 'Consulta Dermatologia', quantity: 1, unitPrice: 280.00 }] },
  { id: 'NF-003', number: '2026/000143', patient: 'Ana Ferreira', issueDate: '28/02/2026', dueDate: '15/03/2026', amount: 450.00, status: 'pending',
    items: [{ description: 'Ecocardiograma', quantity: 1, unitPrice: 450.00 }] },
  { id: 'NF-004', number: '2026/000142', patient: 'Fernanda Lima', issueDate: '25/02/2026', dueDate: '25/02/2026', amount: 280.00, status: 'overdue',
    items: [{ description: 'Consulta Pediatria', quantity: 1, unitPrice: 280.00 }] },
];

// ============================================================
// DRE Data (Demonstrativo de Resultados)
// ============================================================
const DRE_DATA = {
  period: 'Fevereiro 2026',
  revenue: {
    consultasParticulares: 45600,
    convenios: 38900,
    exames: 12800,
    telemedicina: 8500,
    procedimentos: 6200,
    total: 112000,
  },
  deductions: {
    impostos: 5600,
    glosas: 2100,
    descontos: 800,
    total: 8500,
  },
  netRevenue: 103500,
  expenses: {
    pessoal: 42000,
    aluguel: 8500,
    materiais: 4200,
    tecnologia: 3800,
    utilidades: 2300,
    marketing: 1500,
    outros: 1200,
    total: 63500,
  },
  operatingResult: 40000,
  financialResult: -1200,
  netResult: 38800,
};

// ============================================================
// FINANCIAL MODULE
// ============================================================
export const MedFocusIAFinanceiro: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'invoices' | 'dre' | 'cashflow'>('dashboard');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [showNewTransaction, setShowNewTransaction] = useState(false);

  const totalIncome = TRANSACTIONS.filter(t => t.type === 'income' && t.status === 'paid').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = TRANSACTIONS.filter(t => t.type === 'expense' && t.status === 'paid').reduce((sum, t) => sum + t.amount, 0);
  const totalPending = TRANSACTIONS.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
  const totalOverdue = TRANSACTIONS.filter(t => t.status === 'overdue').reduce((sum, t) => sum + t.amount, 0);

  const statusColors: Record<string, string> = {
    paid: 'bg-emerald-500/20 text-emerald-400',
    pending: 'bg-amber-500/20 text-amber-400',
    overdue: 'bg-red-500/20 text-red-400',
    cancelled: 'bg-gray-500/20 text-gray-400',
  };
  const statusLabels: Record<string, string> = {
    paid: 'Pago', pending: 'Pendente', overdue: 'Vencido', cancelled: 'Cancelado',
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'transactions', label: 'Lançamentos', icon: '💳' },
    { id: 'invoices', label: 'Notas Fiscais', icon: '📄' },
    { id: 'dre', label: 'DRE', icon: '📈' },
    { id: 'cashflow', label: 'Fluxo de Caixa', icon: '💰' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Módulo Financeiro</h1>
          <p className="text-sm text-gray-400 mt-1">Fluxo de Caixa | DRE | NFS-e | Pix | Boleto | Convênios</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowNewTransaction(!showNewTransaction)}
            className="px-4 py-2 bg-cyan-500 text-white text-sm font-bold rounded-lg hover:bg-cyan-600 transition">
            + Novo Lançamento
          </button>
          <button className="px-4 py-2 bg-purple-500/20 text-purple-400 text-sm font-bold rounded-lg hover:bg-purple-500/30 transition border border-purple-500/30">
            Exportar Relatório
          </button>
        </div>
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

      {/* ── DASHBOARD TAB ── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Receita (Mês)', value: formatCurrency(totalIncome), change: '+18%', icon: '📈', color: 'from-emerald-500 to-teal-500' },
              { label: 'Despesas (Mês)', value: formatCurrency(totalExpense), change: '-5%', icon: '📉', color: 'from-red-500 to-orange-500' },
              { label: 'A Receber', value: formatCurrency(totalPending), change: '8 faturas', icon: '⏳', color: 'from-amber-500 to-yellow-500' },
              { label: 'Vencidos', value: formatCurrency(totalOverdue), change: '1 fatura', icon: '⚠️', color: 'from-red-500 to-pink-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-xs text-gray-400">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                <div className={`h-1 rounded-full bg-gradient-to-r ${stat.color} mt-3 opacity-60`} />
              </div>
            ))}
          </div>

          {/* Revenue by Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
              <h3 className="text-sm font-bold text-white mb-4">Receita por Categoria</h3>
              <div className="space-y-3">
                {[
                  { cat: 'Consultas Particulares', value: 45600, pct: 40.7, color: 'bg-cyan-500' },
                  { cat: 'Convênios', value: 38900, pct: 34.7, color: 'bg-blue-500' },
                  { cat: 'Exames', value: 12800, pct: 11.4, color: 'bg-purple-500' },
                  { cat: 'Telemedicina', value: 8500, pct: 7.6, color: 'bg-emerald-500' },
                  { cat: 'Procedimentos', value: 6200, pct: 5.5, color: 'bg-amber-500' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">{item.cat}</span>
                      <span className="text-white font-medium">{formatCurrency(item.value)} ({item.pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-700/30 rounded-full h-2">
                      <div className={`${item.color} h-2 rounded-full transition-all`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
              <h3 className="text-sm font-bold text-white mb-4">Despesas por Categoria</h3>
              <div className="space-y-3">
                {[
                  { cat: 'Pessoal', value: 42000, pct: 66.1, color: 'bg-red-500' },
                  { cat: 'Aluguel', value: 8500, pct: 13.4, color: 'bg-orange-500' },
                  { cat: 'Materiais', value: 4200, pct: 6.6, color: 'bg-amber-500' },
                  { cat: 'Tecnologia', value: 3800, pct: 6.0, color: 'bg-purple-500' },
                  { cat: 'Utilidades', value: 2300, pct: 3.6, color: 'bg-blue-500' },
                  { cat: 'Marketing', value: 1500, pct: 2.4, color: 'bg-pink-500' },
                  { cat: 'Outros', value: 1200, pct: 1.9, color: 'bg-gray-500' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">{item.cat}</span>
                      <span className="text-white font-medium">{formatCurrency(item.value)} ({item.pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-700/30 rounded-full h-2">
                      <div className={`${item.color} h-2 rounded-full transition-all`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
            <h3 className="text-sm font-bold text-white mb-4">Métodos de Pagamento (Março 2026)</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { method: 'Pix', value: 'R$ 12.450', pct: '35%', icon: '⚡' },
                { method: 'Convênio', value: 'R$ 21.350', pct: '42%', icon: '🏥' },
                { method: 'Cartão', value: 'R$ 5.600', pct: '11%', icon: '💳' },
                { method: 'Boleto', value: 'R$ 3.200', pct: '6%', icon: '📄' },
                { method: 'Dinheiro', value: 'R$ 2.800', pct: '6%', icon: '💵' },
              ].map((pm, i) => (
                <div key={i} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/30 text-center">
                  <span className="text-2xl">{pm.icon}</span>
                  <div className="text-sm font-bold text-white mt-2">{pm.value}</div>
                  <div className="text-xs text-gray-400">{pm.method} ({pm.pct})</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TRANSACTIONS TAB ── */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {/* New Transaction Form */}
          {showNewTransaction && (
            <div className="bg-gray-800/50 rounded-xl border border-cyan-500/30 p-5">
              <h3 className="text-sm font-bold text-white mb-4">Novo Lançamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Tipo</label>
                  <select className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none">
                    <option>Receita</option>
                    <option>Despesa</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Descrição</label>
                  <input type="text" placeholder="Ex: Consulta Cardiologia" className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Valor (R$)</label>
                  <input type="number" placeholder="0,00" className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Categoria</label>
                  <select className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none">
                    <option>Consultas</option>
                    <option>Exames</option>
                    <option>Procedimentos</option>
                    <option>Convênios</option>
                    <option>Telemedicina</option>
                    <option>Pessoal</option>
                    <option>Infraestrutura</option>
                    <option>Materiais</option>
                    <option>Tecnologia</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Forma de Pagamento</label>
                  <select className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none">
                    <option>Pix</option>
                    <option>Cartão de Crédito</option>
                    <option>Cartão de Débito</option>
                    <option>Boleto</option>
                    <option>Transferência</option>
                    <option>Dinheiro</option>
                    <option>Convênio</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Paciente (opcional)</label>
                  <input type="text" placeholder="Nome do paciente" className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 bg-cyan-500 text-white text-sm font-bold rounded-lg hover:bg-cyan-600 transition">Salvar</button>
                <button onClick={() => setShowNewTransaction(false)} className="px-4 py-2 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition">Cancelar</button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-2">
            {(['all', 'income', 'expense'] as const).map(type => (
              <button key={type} onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterType === type ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-gray-800/50 text-gray-400 hover:text-white'}`}>
                {type === 'all' ? 'Todos' : type === 'income' ? 'Receitas' : 'Despesas'}
              </button>
            ))}
          </div>

          {/* Transactions Table */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Data</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Descrição</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Categoria</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Paciente</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Pagamento</th>
                  <th className="text-right text-xs text-gray-400 font-semibold p-4">Valor</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.filter(t => filterType === 'all' || t.type === filterType).map(t => (
                  <tr key={t.id} className="border-b border-gray-700/20 hover:bg-gray-700/20 transition">
                    <td className="p-4 text-sm text-gray-400 font-mono">{t.date}</td>
                    <td className="p-4 text-sm text-white">{t.description}</td>
                    <td className="p-4"><span className="px-2 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded">{t.category}</span></td>
                    <td className="p-4 text-sm text-gray-400">{t.patient || '—'}</td>
                    <td className="p-4 text-xs text-gray-400">{t.paymentMethod}</td>
                    <td className={`p-4 text-sm font-bold text-right ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[t.status]}`}>
                        {statusLabels[t.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── INVOICES TAB ── */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Notas Fiscais de Serviço (NFS-e)</h3>
            <button className="px-4 py-2 bg-cyan-500 text-white text-sm font-bold rounded-lg hover:bg-cyan-600 transition">
              + Emitir NFS-e
            </button>
          </div>

          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Número</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Paciente</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Emissão</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Vencimento</th>
                  <th className="text-right text-xs text-gray-400 font-semibold p-4">Valor</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Status</th>
                  <th className="text-left text-xs text-gray-400 font-semibold p-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map(inv => (
                  <tr key={inv.id} className="border-b border-gray-700/20 hover:bg-gray-700/20 transition">
                    <td className="p-4 text-sm text-cyan-400 font-mono">{inv.number}</td>
                    <td className="p-4 text-sm text-white">{inv.patient}</td>
                    <td className="p-4 text-sm text-gray-400">{inv.issueDate}</td>
                    <td className="p-4 text-sm text-gray-400">{inv.dueDate}</td>
                    <td className="p-4 text-sm text-white font-bold text-right">{formatCurrency(inv.amount)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[inv.status]}`}>
                        {statusLabels[inv.status]}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded hover:bg-cyan-500/30 transition">Ver</button>
                        <button className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded hover:bg-purple-500/30 transition">PDF</button>
                        {inv.status === 'pending' && (
                          <button className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded hover:bg-emerald-500/30 transition">Pix</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pix QR Code */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
            <h3 className="text-sm font-bold text-white mb-3">Cobrança via Pix</h3>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
                <div className="text-4xl text-gray-800">QR</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-300">Chave Pix: <span className="text-cyan-400 font-mono">clinica@medfocusia.com</span></div>
                <div className="text-sm text-gray-300">Banco: <span className="text-white">Banco do Brasil</span></div>
                <div className="text-sm text-gray-300">CNPJ: <span className="text-white font-mono">12.345.678/0001-90</span></div>
                <button className="px-4 py-2 bg-cyan-500/20 text-cyan-400 text-sm font-bold rounded-lg hover:bg-cyan-500/30 transition border border-cyan-500/30 mt-2">
                  Gerar Link de Pagamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DRE TAB ── */}
      {activeTab === 'dre' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">DRE — Demonstrativo de Resultados ({DRE_DATA.period})</h3>
            <button className="px-4 py-2 bg-purple-500/20 text-purple-400 text-sm font-bold rounded-lg hover:bg-purple-500/30 transition border border-purple-500/30">
              Exportar PDF
            </button>
          </div>

          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50 bg-gray-900/30">
                  <th className="text-left text-xs text-gray-400 font-semibold p-4" colSpan={2}>Descrição</th>
                  <th className="text-right text-xs text-gray-400 font-semibold p-4">Valor</th>
                </tr>
              </thead>
              <tbody>
                {/* Revenue */}
                <tr className="border-b border-gray-700/20 bg-emerald-500/5">
                  <td className="p-4 text-sm font-bold text-emerald-400" colSpan={2}>RECEITA BRUTA</td>
                  <td className="p-4 text-sm font-bold text-emerald-400 text-right">{formatCurrency(DRE_DATA.revenue.total)}</td>
                </tr>
                {Object.entries(DRE_DATA.revenue).filter(([k]) => k !== 'total').map(([key, value]) => (
                  <tr key={key} className="border-b border-gray-700/10">
                    <td className="p-4 pl-8 text-sm text-gray-300" colSpan={2}>
                      {key === 'consultasParticulares' ? 'Consultas Particulares' :
                       key === 'convenios' ? 'Convênios' :
                       key === 'exames' ? 'Exames' :
                       key === 'telemedicina' ? 'Telemedicina' : 'Procedimentos'}
                    </td>
                    <td className="p-4 text-sm text-gray-300 text-right">{formatCurrency(value)}</td>
                  </tr>
                ))}
                {/* Deductions */}
                <tr className="border-b border-gray-700/20 bg-amber-500/5">
                  <td className="p-4 text-sm font-bold text-amber-400" colSpan={2}>(-) DEDUÇÕES</td>
                  <td className="p-4 text-sm font-bold text-amber-400 text-right">({formatCurrency(DRE_DATA.deductions.total)})</td>
                </tr>
                {Object.entries(DRE_DATA.deductions).filter(([k]) => k !== 'total').map(([key, value]) => (
                  <tr key={key} className="border-b border-gray-700/10">
                    <td className="p-4 pl-8 text-sm text-gray-400" colSpan={2}>
                      {key === 'impostos' ? 'Impostos (ISS, PIS, COFINS)' :
                       key === 'glosas' ? 'Glosas de Convênios' : 'Descontos'}
                    </td>
                    <td className="p-4 text-sm text-gray-400 text-right">({formatCurrency(value)})</td>
                  </tr>
                ))}
                {/* Net Revenue */}
                <tr className="border-b border-gray-700/30 bg-blue-500/5">
                  <td className="p-4 text-sm font-bold text-blue-400" colSpan={2}>RECEITA LÍQUIDA</td>
                  <td className="p-4 text-sm font-bold text-blue-400 text-right">{formatCurrency(DRE_DATA.netRevenue)}</td>
                </tr>
                {/* Expenses */}
                <tr className="border-b border-gray-700/20 bg-red-500/5">
                  <td className="p-4 text-sm font-bold text-red-400" colSpan={2}>(-) DESPESAS OPERACIONAIS</td>
                  <td className="p-4 text-sm font-bold text-red-400 text-right">({formatCurrency(DRE_DATA.expenses.total)})</td>
                </tr>
                {Object.entries(DRE_DATA.expenses).filter(([k]) => k !== 'total').map(([key, value]) => (
                  <tr key={key} className="border-b border-gray-700/10">
                    <td className="p-4 pl-8 text-sm text-gray-400" colSpan={2}>
                      {key === 'pessoal' ? 'Pessoal e Encargos' :
                       key === 'aluguel' ? 'Aluguel e Condomínio' :
                       key === 'materiais' ? 'Materiais de Consumo' :
                       key === 'tecnologia' ? 'Tecnologia e Software' :
                       key === 'utilidades' ? 'Utilidades (Energia, Água, Internet)' :
                       key === 'marketing' ? 'Marketing e Publicidade' : 'Outros'}
                    </td>
                    <td className="p-4 text-sm text-gray-400 text-right">({formatCurrency(value)})</td>
                  </tr>
                ))}
                {/* Operating Result */}
                <tr className="border-b border-gray-700/30 bg-purple-500/5">
                  <td className="p-4 text-sm font-bold text-purple-400" colSpan={2}>RESULTADO OPERACIONAL</td>
                  <td className="p-4 text-sm font-bold text-purple-400 text-right">{formatCurrency(DRE_DATA.operatingResult)}</td>
                </tr>
                {/* Financial Result */}
                <tr className="border-b border-gray-700/20">
                  <td className="p-4 pl-8 text-sm text-gray-400" colSpan={2}>Resultado Financeiro (juros, taxas)</td>
                  <td className="p-4 text-sm text-gray-400 text-right">({formatCurrency(Math.abs(DRE_DATA.financialResult))})</td>
                </tr>
                {/* Net Result */}
                <tr className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10">
                  <td className="p-4 text-lg font-bold text-emerald-400" colSpan={2}>RESULTADO LÍQUIDO</td>
                  <td className="p-4 text-lg font-bold text-emerald-400 text-right">{formatCurrency(DRE_DATA.netResult)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Margin Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Margem Bruta', value: '92.4%', desc: 'Receita Líquida / Receita Bruta', color: 'text-emerald-400' },
              { label: 'Margem Operacional', value: '35.7%', desc: 'Resultado Operacional / Receita Líquida', color: 'text-blue-400' },
              { label: 'Margem Líquida', value: '34.6%', desc: 'Resultado Líquido / Receita Líquida', color: 'text-purple-400' },
            ].map((m, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 text-center">
                <div className={`text-3xl font-bold ${m.color}`}>{m.value}</div>
                <div className="text-sm text-white font-medium mt-1">{m.label}</div>
                <div className="text-xs text-gray-500 mt-1">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CASH FLOW TAB ── */}
      {activeTab === 'cashflow' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Fluxo de Caixa — Março 2026</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-gray-800/50 text-gray-300 text-xs rounded-lg hover:bg-gray-700 transition">Diário</button>
              <button className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-lg border border-cyan-500/30">Semanal</button>
              <button className="px-3 py-1.5 bg-gray-800/50 text-gray-300 text-xs rounded-lg hover:bg-gray-700 transition">Mensal</button>
            </div>
          </div>

          {/* Cash Flow Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-xl border border-emerald-500/30 p-5">
              <div className="text-xs text-gray-400 mb-1">Saldo Inicial</div>
              <div className="text-2xl font-bold text-emerald-400">R$ 145.230,00</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl border border-blue-500/30 p-5">
              <div className="text-xs text-gray-400 mb-1">Entradas Previstas</div>
              <div className="text-2xl font-bold text-blue-400">R$ 112.000,00</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl border border-amber-500/30 p-5">
              <div className="text-xs text-gray-400 mb-1">Saídas Previstas</div>
              <div className="text-2xl font-bold text-amber-400">R$ 63.500,00</div>
            </div>
          </div>

          {/* Weekly Flow */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
            <h3 className="text-sm font-bold text-white mb-4">Fluxo Semanal</h3>
            <div className="space-y-3">
              {[
                { week: 'Semana 1 (01-07/03)', income: 28500, expense: 15200, balance: 158530 },
                { week: 'Semana 2 (08-14/03)', income: 31200, expense: 18400, balance: 171330 },
                { week: 'Semana 3 (15-21/03)', income: 26800, expense: 14900, balance: 183230 },
                { week: 'Semana 4 (22-28/03)', income: 25500, expense: 15000, balance: 193730 },
              ].map((w, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700/30">
                  <div className="text-sm text-white font-medium w-48">{w.week}</div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Entradas</div>
                      <div className="text-sm font-bold text-emerald-400">{formatCurrency(w.income)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Saídas</div>
                      <div className="text-sm font-bold text-red-400">{formatCurrency(w.expense)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Saldo</div>
                      <div className="text-sm font-bold text-cyan-400">{formatCurrency(w.balance)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projected Balance */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl border border-emerald-500/20 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-emerald-400">Saldo Projetado Final (31/03/2026)</div>
                <div className="text-3xl font-bold text-white mt-1">R$ 193.730,00</div>
                <div className="text-xs text-emerald-400/70 mt-1">+33.4% em relação ao saldo inicial</div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-xs text-gray-300">Total Entradas: {formatCurrency(112000)}</div>
                <div className="text-xs text-gray-300">Total Saídas: {formatCurrency(63500)}</div>
                <div className="text-xs text-emerald-400 font-bold">Resultado: {formatCurrency(48500)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
