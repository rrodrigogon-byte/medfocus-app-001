/**
 * MedFocus Admin Dashboard — Painel de Administração
 * Gerencia assinantes, receita, vendas e métricas da plataforma.
 */
import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';

interface AdminDashboardProps {
  userName?: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userName }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'subscribers' | 'revenue' | 'content' | 'settings'>('overview');

  // Fetch admin stats from backend
  const statsQuery = trpc.admin.stats.useQuery(undefined, { retry: false });
  const subscribersQuery = trpc.admin.subscribers.useQuery(undefined, { retry: false, enabled: activeTab === 'subscribers' });

  const stats = statsQuery.data || {
    totalUsers: 0,
    activeSubscribers: 0,
    trialUsers: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    churnRate: 0,
    newUsersToday: 0,
    newUsersWeek: 0,
  };

  const subscribers = subscribersQuery.data || [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-foreground tracking-tight">
            Painel de Administração
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Bem-vindo, {userName || 'Administrador'}. Gerencie sua plataforma MedFocus.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full border border-emerald-500/20">
            ADMIN
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl border border-border">
        {[
          { id: 'overview' as const, label: 'Visão Geral', icon: '📊' },
          { id: 'subscribers' as const, label: 'Assinantes', icon: '👥' },
          { id: 'revenue' as const, label: 'Receita', icon: '💰' },
          { id: 'content' as const, label: 'Conteúdo', icon: '📚' },
          { id: 'settings' as const, label: 'Configurações', icon: '⚙️' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total de Usuários"
              value={String(stats.totalUsers)}
              change={`+${stats.newUsersWeek} esta semana`}
              icon="👥"
              color="blue"
            />
            <KPICard
              title="Assinantes Ativos"
              value={String(stats.activeSubscribers)}
              change={`${stats.trialUsers} em trial`}
              icon="⭐"
              color="emerald"
            />
            <KPICard
              title="Receita Mensal (MRR)"
              value={formatCurrency(stats.monthlyRevenue)}
              change={`${formatCurrency(stats.yearlyRevenue)} anual`}
              icon="💰"
              color="amber"
            />
            <KPICard
              title="Taxa de Churn"
              value={`${stats.churnRate}%`}
              change={`${stats.newUsersToday} novos hoje`}
              icon="📉"
              color="red"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Receita por Plano</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium text-foreground">Plano Mensal (R$ 29,90)</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {formatCurrency(stats.activeSubscribers * 29.90 * 0.6)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-foreground">Plano Anual (R$ 250,00)</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {formatCurrency(stats.activeSubscribers * 250 * 0.4 / 12)}
                  </span>
                </div>
                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">Total MRR</span>
                  <span className="text-lg font-extrabold text-primary">{formatCurrency(stats.monthlyRevenue)}</span>
                </div>
              </div>
            </div>

            {/* User Funnel */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Funil de Conversão</h3>
              <div className="space-y-3">
                <FunnelBar label="Visitantes" value={stats.totalUsers} max={stats.totalUsers} color="bg-blue-500" />
                <FunnelBar label="Cadastrados" value={Math.round(stats.totalUsers * 0.7)} max={stats.totalUsers} color="bg-indigo-500" />
                <FunnelBar label="Trial Ativo" value={stats.trialUsers} max={stats.totalUsers} color="bg-amber-500" />
                <FunnelBar label="Assinantes" value={stats.activeSubscribers} max={stats.totalUsers} color="bg-emerald-500" />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Atividade Recente</h3>
            <div className="space-y-3">
              {statsQuery.isLoading ? (
                <p className="text-muted-foreground text-sm">Carregando atividades...</p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {stats.totalUsers > 0
                    ? `${stats.totalUsers} usuários registrados na plataforma. ${stats.activeSubscribers} assinantes ativos.`
                    : 'Nenhuma atividade registrada ainda. Os dados aparecerão conforme os usuários se cadastrarem.'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="text-lg font-bold text-foreground">Lista de Assinantes</h3>
              <p className="text-muted-foreground text-xs mt-1">Todos os usuários cadastrados na plataforma</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left p-3 font-semibold text-muted-foreground">Nome</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Email</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Plano</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Cadastro</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribersQuery.isLoading ? (
                    <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">Carregando...</td></tr>
                  ) : subscribers.length === 0 ? (
                    <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">Nenhum assinante encontrado</td></tr>
                  ) : (
                    (subscribers as any[]).map((sub: any, i: number) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="p-3 font-medium text-foreground">{sub.name || 'Sem nome'}</td>
                        <td className="p-3 text-muted-foreground">{sub.email || sub.openId}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            sub.plan === 'pro' ? 'bg-primary/10 text-primary' :
                            sub.plan === 'premium' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {sub.plan === 'pro' ? 'PRO' : sub.plan === 'premium' ? 'PREMIUM' : 'FREE'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            sub.trialActive ? 'bg-amber-500/10 text-amber-500' :
                            sub.plan !== 'free' ? 'bg-emerald-500/10 text-emerald-500' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {sub.trialActive ? 'TRIAL' : sub.plan !== 'free' ? 'ATIVO' : 'GRATUITO'}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground text-xs">{sub.createdAt ? formatDate(sub.createdAt) : '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">MRR (Receita Mensal)</p>
              <p className="text-3xl font-display font-extrabold text-primary">{formatCurrency(stats.monthlyRevenue)}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">ARR (Receita Anual)</p>
              <p className="text-3xl font-display font-extrabold text-emerald-500">{formatCurrency(stats.monthlyRevenue * 12)}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">Ticket Médio</p>
              <p className="text-3xl font-display font-extrabold text-amber-500">
                {stats.activeSubscribers > 0 ? formatCurrency(stats.monthlyRevenue / stats.activeSubscribers) : 'R$ 0,00'}
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Projeção de Receita</h3>
            <div className="space-y-4">
              {[
                { label: 'Cenário Conservador (50 assinantes)', monthly: 50 * 29.90, yearly: 50 * 29.90 * 12 },
                { label: 'Cenário Moderado (200 assinantes)', monthly: 200 * 29.90, yearly: 200 * 29.90 * 12 },
                { label: 'Cenário Otimista (500 assinantes)', monthly: 500 * 29.90, yearly: 500 * 29.90 * 12 },
                { label: 'Meta 1000 assinantes', monthly: 1000 * 29.90, yearly: 1000 * 29.90 * 12 },
              ].map((scenario, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <span className="text-sm font-medium text-foreground">{scenario.label}</span>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{formatCurrency(scenario.monthly)}/mês</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(scenario.yearly)}/ano</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Configuração Stripe</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Plano Mensal</span>
                <span className="text-sm font-bold text-foreground">R$ 29,90/mês</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Plano Anual</span>
                <span className="text-sm font-bold text-foreground">R$ 250,00/ano (economia de 30%)</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Trial Gratuito</span>
                <span className="text-sm font-bold text-foreground">7 dias (cartão obrigatório)</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Gateway de Pagamento</span>
                <span className="text-sm font-bold text-emerald-500">Stripe (Ativo)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Conteúdo da Plataforma</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Questões Quiz', count: '23+', icon: '📝' },
                { label: 'Casos Clínicos', count: '10+', icon: '🏥' },
                { label: 'Resumos IA', count: 'Ilimitado', icon: '🤖' },
                { label: 'Materiais Validados', count: '4+', icon: '📚' },
                { label: 'Flashcards', count: '50+', icon: '🗂️' },
                { label: 'Protocolos Clínicos', count: '15+', icon: '📋' },
                { label: 'Atlas Anatômico', count: '100+', icon: '🧬' },
                { label: 'Calculadoras', count: '20+', icon: '🔢' },
              ].map((item, i) => (
                <div key={i} className="bg-muted/30 rounded-xl p-4 text-center border border-border/50">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-lg font-bold text-foreground mt-2">{item.count}</p>
                  <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Referências Acadêmicas</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Todas as referências utilizadas na plataforma são de fontes acadêmicas validadas.
            </p>
            <div className="space-y-2">
              {[
                'Harrison\'s Principles of Internal Medicine (21st Ed.)',
                'Sociedade Brasileira de Cardiologia — Diretrizes 2024',
                'GINA 2024 — Global Initiative for Asthma',
                'Sepsis-3 — JAMA 2016',
                'Nelson Textbook of Pediatrics (22nd Ed.)',
                'Goodman & Gilman\'s Pharmacological Basis of Therapeutics',
                'ACOG Practice Bulletins',
                'UpToDate Clinical Decision Support',
                'PubMed / MEDLINE',
                'Cochrane Library — Systematic Reviews',
              ].map((ref, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-sm text-foreground">{ref}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Configurações da Plataforma</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div>
                  <p className="text-sm font-medium text-foreground">Proprietário</p>
                  <p className="text-xs text-muted-foreground">rrodrigogon@gmail.com</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full">Ativo</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div>
                  <p className="text-sm font-medium text-foreground">Domínio</p>
                  <p className="text-xs text-muted-foreground">medfocus-app-969630653332.southamerica-east1.run.app</p>
                </div>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-bold rounded-full">Cloud Run</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div>
                  <p className="text-sm font-medium text-foreground">Banco de Dados</p>
                  <p className="text-xs text-muted-foreground">Cloud SQL MySQL — viralgram-mysql</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full">Conectado</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div>
                  <p className="text-sm font-medium text-foreground">Stripe</p>
                  <p className="text-xs text-muted-foreground">Gateway de pagamento</p>
                </div>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full">Configurar</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">IA (Gemini)</p>
                  <p className="text-xs text-muted-foreground">Vertex AI — southamerica-east1</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full">Ativo</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const KPICard: React.FC<{ title: string; value: string; change: string; icon: string; color: string }> = ({ title, value, change, icon, color }) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    red: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border ${colorMap[color]}`}>{icon}</span>
      </div>
      <p className="text-2xl font-display font-extrabold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1 font-medium">{change}</p>
    </div>
  );
};

const FunnelBar: React.FC<{ label: string; value: number; max: number; color: string }> = ({ label, value, max, color }) => {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="text-xs font-bold text-muted-foreground">{value}</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export default AdminDashboard;
