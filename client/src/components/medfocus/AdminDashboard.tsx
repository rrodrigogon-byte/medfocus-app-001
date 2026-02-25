/**
 * MedFocus Admin Dashboard v2.0 — Painel de Administração Completo
 * CRUD de usuários, gestão de planos, validade de acesso, convites gratuitos.
 */
import React, { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';

interface AdminDashboardProps {
  userName?: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userName }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'revenue' | 'content' | 'partnerships' | 'settings'>('overview');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<any>(null);
  const [searchUsers, setSearchUsers] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newUser, setNewUser] = useState({ name: '', email: '', plan: 'pro' as string, role: 'user' as string, validityDays: 30, notes: '' });
  const [editData, setEditData] = useState({ name: '', email: '', plan: '', role: '', validityDays: 0, notes: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const statsQuery = trpc.admin.stats.useQuery(undefined, { retry: false });
  const subscribersQuery = trpc.admin.subscribers.useQuery(undefined, { retry: false });
  const addUserMutation = trpc.admin.addUser.useMutation();
  const updateUserMutation = trpc.admin.updateUser.useMutation();
  const deleteUserMutation = trpc.admin.deleteUser.useMutation();

  const stats = statsQuery.data || { totalUsers: 0, activeSubscribers: 0, trialUsers: 0, monthlyRevenue: 0, yearlyRevenue: 0, churnRate: 0, newUsersToday: 0, newUsersWeek: 0 };
  const allSubscribers = (subscribersQuery.data || []) as any[];

  const filteredSubscribers = allSubscribers.filter(sub => {
    const matchSearch = searchUsers === '' ||
      (sub.name || '').toLowerCase().includes(searchUsers.toLowerCase()) ||
      (sub.email || '').toLowerCase().includes(searchUsers.toLowerCase());
    const matchPlan = filterPlan === 'all' || sub.plan === filterPlan;
    const matchStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && sub.plan !== 'free' && !sub.trialActive) ||
      (filterStatus === 'trial' && sub.trialActive) ||
      (filterStatus === 'free' && sub.plan === 'free' && !sub.trialActive) ||
      (filterStatus === 'expired' && (sub.accessExpiry || sub.trialEndDate) && new Date(sub.accessExpiry || sub.trialEndDate) < new Date());
    return matchSearch && matchPlan && matchStatus;
  });

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); } }, [toast]);

  const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-';
  const daysRemaining = (expiry: string) => {
    if (!expiry) return null;
    const diff = Math.ceil((new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleAddUser = async () => {
    setActionLoading(true);
    try {
      await addUserMutation.mutateAsync({
        name: newUser.name, email: newUser.email,
        plan: newUser.plan as any, role: newUser.role as any,
        validityDays: newUser.validityDays, notes: newUser.notes,
      });
      setToast({ msg: `Usuario ${newUser.name} adicionado com sucesso!`, type: 'success' });
      setShowAddUser(false);
      setNewUser({ name: '', email: '', plan: 'pro', role: 'user', validityDays: 30, notes: '' });
      subscribersQuery.refetch(); statsQuery.refetch();
    } catch (e: any) { setToast({ msg: `Erro ao adicionar: ${e.message}`, type: 'error' }); }
    setActionLoading(false);
  };

  const handleUpdateUser = async () => {
    if (!showEditUser) return;
    setActionLoading(true);
    try {
      await updateUserMutation.mutateAsync({
        userId: showEditUser.id, name: editData.name, email: editData.email,
        plan: editData.plan as any, role: editData.role as any,
        validityDays: editData.validityDays, notes: editData.notes,
      });
      setToast({ msg: `Usuario ${editData.name} atualizado com sucesso!`, type: 'success' });
      setShowEditUser(null); subscribersQuery.refetch(); statsQuery.refetch();
    } catch (e: any) { setToast({ msg: `Erro ao atualizar: ${e.message}`, type: 'error' }); }
    setActionLoading(false);
  };

  const handleDeleteUser = async () => {
    if (!showDeleteConfirm) return;
    setActionLoading(true);
    try {
      await deleteUserMutation.mutateAsync({ userId: showDeleteConfirm.id });
      setToast({ msg: `Usuario ${showDeleteConfirm.name || showDeleteConfirm.email} removido.`, type: 'success' });
      setShowDeleteConfirm(null); subscribersQuery.refetch(); statsQuery.refetch();
    } catch (e: any) { setToast({ msg: `Erro ao remover: ${e.message}`, type: 'error' }); }
    setActionLoading(false);
  };

  const openEditUser = (sub: any) => {
    setEditData({
      name: sub.name || '', email: sub.email || '', plan: sub.plan || 'free',
      role: sub.role || 'user',
      validityDays: (sub.accessExpiry || sub.trialEndDate) ? Math.max(0, Math.ceil((new Date(sub.accessExpiry || sub.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0,
      notes: sub.adminNotes || '',
    });
    setShowEditUser(sub);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium animate-in slide-in-from-right ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-foreground tracking-tight">Painel de Administracao</h1>
          <p className="text-muted-foreground text-sm mt-1">Bem-vindo, {userName || 'Administrador'}. Gerencie sua plataforma MedFocus.</p>
        </div>
        <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full border border-emerald-500/20">ADMIN</span>
      </div>

      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl border border-border overflow-x-auto">
        {([
          { id: 'overview' as const, label: 'Visao Geral', icon: '📊' },
          { id: 'users' as const, label: 'Gestao de Usuarios', icon: '👥' },
          { id: 'revenue' as const, label: 'Receita', icon: '💰' },
          { id: 'partnerships' as const, label: 'Parcerias', icon: '🏫' },
          { id: 'content' as const, label: 'Conteudo', icon: '📚' },
          { id: 'settings' as const, label: 'Configuracoes', icon: '⚙️' },
        ]).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            <span className="mr-1.5">{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* === OVERVIEW === */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="Total de Usuarios" value={String(stats.totalUsers)} change={`+${stats.newUsersWeek} esta semana`} icon="👥" color="blue" />
            <KPICard title="Assinantes Ativos" value={String(stats.activeSubscribers)} change={`${stats.trialUsers} em trial`} icon="⭐" color="emerald" />
            <KPICard title="Receita Mensal" value={formatCurrency(stats.monthlyRevenue)} change={`ARR: ${formatCurrency(stats.monthlyRevenue * 12)}`} icon="💰" color="amber" />
            <KPICard title="Churn Rate" value={`${stats.churnRate}%`} change={`+${stats.newUsersToday} hoje`} icon="📉" color="red" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Funil de Conversao</h3>
              <div className="space-y-3">
                <FunnelBar label="Visitantes → Cadastro" value={stats.totalUsers} max={Math.max(stats.totalUsers * 3, 1)} color="bg-blue-500" />
                <FunnelBar label="Cadastro → Trial" value={stats.trialUsers} max={Math.max(stats.totalUsers, 1)} color="bg-amber-500" />
                <FunnelBar label="Trial → Assinante" value={stats.activeSubscribers} max={Math.max(stats.totalUsers, 1)} color="bg-emerald-500" />
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Acoes Rapidas</h3>
              <div className="space-y-2">
                <button onClick={() => { setActiveTab('users'); setTimeout(() => setShowAddUser(true), 100); }} className="w-full text-left p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition">
                  <span className="text-sm font-medium text-emerald-400">➕ Adicionar Usuario Gratuito</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Convide alguem com acesso gratuito por tempo limitado</p>
                </button>
                <button onClick={() => setActiveTab('partnerships')} className="w-full text-left p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition">
                  <span className="text-sm font-medium text-blue-400">🏫 Gerenciar Parcerias</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Universidades e turmas com desconto</p>
                </button>
                <button onClick={() => subscribersQuery.refetch()} className="w-full text-left p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition">
                  <span className="text-sm font-medium text-amber-400">🔄 Atualizar Dados</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Recarregar metricas e lista de usuarios</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === USER MANAGEMENT === */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <input type="text" placeholder="🔍 Buscar por nome ou email..." value={searchUsers} onChange={e => setSearchUsers(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary outline-none" />
            <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-card border border-border text-sm">
              <option value="all">Todos os Planos</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="premium">Premium</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-card border border-border text-sm">
              <option value="all">Todos os Status</option>
              <option value="active">Ativo</option>
              <option value="trial">Trial</option>
              <option value="free">Gratuito</option>
              <option value="expired">Expirado</option>
            </select>
            <button onClick={() => setShowAddUser(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition shadow-lg">
              ➕ Adicionar Usuario
            </button>
          </div>

          <p className="text-xs text-muted-foreground">{filteredSubscribers.length} usuario(s) encontrado(s) de {allSubscribers.length} total</p>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left p-3 font-semibold text-muted-foreground">Nome</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Email</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Plano</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Role</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Validade</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Cadastro</th>
                    <th className="text-left p-3 font-semibold text-muted-foreground">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribersQuery.isLoading ? (
                    <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">Carregando...</td></tr>
                  ) : filteredSubscribers.length === 0 ? (
                    <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">Nenhum usuario encontrado</td></tr>
                  ) : (
                    filteredSubscribers.map((sub: any, i: number) => {
                      const days = sub.trialEndDate ? daysRemaining(sub.trialEndDate) : null;
                      const isExpired = days !== null && days <= 0;
                      return (
                        <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="p-3 font-medium text-foreground">{sub.name || 'Sem nome'}</td>
                          <td className="p-3 text-muted-foreground text-xs">{sub.email || sub.openId}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${sub.plan === 'pro' ? 'bg-primary/10 text-primary' : sub.plan === 'premium' ? 'bg-amber-500/10 text-amber-500' : 'bg-muted text-muted-foreground'}`}>
                              {sub.plan?.toUpperCase() || 'FREE'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${sub.role === 'admin' ? 'bg-red-500/10 text-red-400' : 'bg-muted text-muted-foreground'}`}>
                              {sub.role === 'admin' ? 'ADMIN' : 'USER'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              isExpired ? 'bg-red-500/10 text-red-400' :
                              sub.trialActive ? 'bg-amber-500/10 text-amber-500' :
                              sub.plan !== 'free' ? 'bg-emerald-500/10 text-emerald-500' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {isExpired ? 'EXPIRADO' : sub.trialActive ? 'TRIAL' : sub.plan !== 'free' ? 'ATIVO' : 'GRATUITO'}
                            </span>
                          </td>
                          <td className="p-3 text-xs">
                            {days !== null ? (
                              <span className={`font-medium ${days <= 7 ? 'text-red-400' : days <= 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {isExpired ? 'Expirado' : `${days} dias`}
                              </span>
                            ) : sub.plan !== 'free' ? (
                              <span className="text-emerald-400 font-medium">Ilimitado</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-3 text-muted-foreground text-xs">{sub.createdAt ? formatDate(sub.createdAt) : '-'}</td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <button onClick={() => openEditUser(sub)} className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/20 transition font-medium" title="Editar">
                                ✏️ Editar
                              </button>
                              <button onClick={() => setShowDeleteConfirm(sub)} className="px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition font-medium" title="Excluir">
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ADD USER MODAL */}
          {showAddUser && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowAddUser(false)}>
              <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg space-y-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">➕ Adicionar Novo Usuario</h3>
                  <button onClick={() => setShowAddUser(false)} className="text-muted-foreground hover:text-foreground text-xl">✕</button>
                </div>
                <p className="text-xs text-muted-foreground">O admin pode adicionar usuarios com acesso gratuito por tempo limitado ou ilimitado.</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Nome Completo *</label>
                    <input type="text" value={newUser.name} onChange={e => setNewUser(s => ({ ...s, name: e.target.value }))}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:ring-2 focus:ring-primary outline-none"
                      placeholder="Dr. Joao Silva" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Email *</label>
                    <input type="email" value={newUser.email} onChange={e => setNewUser(s => ({ ...s, email: e.target.value }))}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:ring-2 focus:ring-primary outline-none"
                      placeholder="joao@universidade.edu.br" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">Plano</label>
                      <select value={newUser.plan} onChange={e => setNewUser(s => ({ ...s, plan: e.target.value }))}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-background border border-border text-sm">
                        <option value="free">Free</option>
                        <option value="pro">Pro (Gratuito)</option>
                        <option value="premium">Premium (Gratuito)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">Funcao</label>
                      <select value={newUser.role} onChange={e => setNewUser(s => ({ ...s, role: e.target.value }))}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-background border border-border text-sm">
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Validade do Acesso (dias)</label>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {[7, 30, 90, 180, 365, 0].map(d => (
                        <button key={d} onClick={() => setNewUser(s => ({ ...s, validityDays: d }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${newUser.validityDays === d ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
                          {d === 0 ? 'Ilimitado' : `${d}d`}
                        </button>
                      ))}
                    </div>
                    <input type="number" value={newUser.validityDays} onChange={e => setNewUser(s => ({ ...s, validityDays: Number(e.target.value) }))}
                      className="w-full mt-2 px-4 py-2 rounded-xl bg-background border border-border text-sm" placeholder="Ou digite o numero de dias" min={0} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Observacoes (opcional)</label>
                    <textarea value={newUser.notes} onChange={e => setNewUser(s => ({ ...s, notes: e.target.value }))}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-background border border-border text-sm resize-none h-20"
                      placeholder="Ex: Professor convidado, parceria universidade X..." />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowAddUser(false)} className="flex-1 py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-accent transition">Cancelar</button>
                  <button onClick={handleAddUser} disabled={actionLoading || !newUser.name || !newUser.email}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition disabled:opacity-50">
                    {actionLoading ? 'Adicionando...' : '✅ Adicionar Usuario'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EDIT USER MODAL */}
          {showEditUser && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowEditUser(null)}>
              <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg space-y-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">✏️ Editar Usuario</h3>
                  <button onClick={() => setShowEditUser(null)} className="text-muted-foreground hover:text-foreground text-xl">✕</button>
                </div>
                <p className="text-xs text-muted-foreground">ID: {showEditUser.id} | OpenID: {showEditUser.openId?.substring(0, 12)}...</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Nome</label>
                    <input type="text" value={editData.name} onChange={e => setEditData(s => ({ ...s, name: e.target.value }))}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Email</label>
                    <input type="email" value={editData.email} onChange={e => setEditData(s => ({ ...s, email: e.target.value }))}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">Plano</label>
                      <select value={editData.plan} onChange={e => setEditData(s => ({ ...s, plan: e.target.value }))}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-background border border-border text-sm">
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">Funcao</label>
                      <select value={editData.role} onChange={e => setEditData(s => ({ ...s, role: e.target.value }))}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-background border border-border text-sm">
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Renovar Validade (dias a partir de hoje)</label>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {[0, 7, 30, 90, 180, 365].map(d => (
                        <button key={d} onClick={() => setEditData(s => ({ ...s, validityDays: d }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${editData.validityDays === d ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
                          {d === 0 ? 'Ilimitado' : `${d}d`}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Observacoes</label>
                    <textarea value={editData.notes} onChange={e => setEditData(s => ({ ...s, notes: e.target.value }))}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-background border border-border text-sm resize-none h-20" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowEditUser(null)} className="flex-1 py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-accent transition">Cancelar</button>
                  <button onClick={handleUpdateUser} disabled={actionLoading}
                    className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition disabled:opacity-50">
                    {actionLoading ? 'Salvando...' : '💾 Salvar Alteracoes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DELETE CONFIRM MODAL */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(null)}>
              <div className="bg-card border border-red-500/30 rounded-2xl p-6 w-full max-w-md space-y-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-red-400">🗑️ Confirmar Exclusao</h3>
                <p className="text-sm text-muted-foreground">
                  Tem certeza que deseja excluir o usuario <strong className="text-foreground">{showDeleteConfirm.name || showDeleteConfirm.email}</strong>?
                  Esta acao nao pode ser desfeita.
                </p>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-medium hover:bg-accent transition">Cancelar</button>
                  <button onClick={handleDeleteUser} disabled={actionLoading}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition disabled:opacity-50">
                    {actionLoading ? 'Excluindo...' : '🗑️ Excluir Usuario'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* === REVENUE === */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <p className="text-muted-foreground text-xs font-semibold uppercase mb-2">MRR (Receita Mensal)</p>
              <p className="text-3xl font-display font-extrabold text-primary">{formatCurrency(stats.monthlyRevenue)}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <p className="text-muted-foreground text-xs font-semibold uppercase mb-2">ARR (Receita Anual)</p>
              <p className="text-3xl font-display font-extrabold text-emerald-500">{formatCurrency(stats.monthlyRevenue * 12)}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <p className="text-muted-foreground text-xs font-semibold uppercase mb-2">Ticket Medio</p>
              <p className="text-3xl font-display font-extrabold text-amber-500">{formatCurrency(stats.activeSubscribers > 0 ? stats.monthlyRevenue / stats.activeSubscribers : 0)}</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">Tabela de Precos Atual</h3>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="text-left p-2">Plano</th><th className="text-left p-2">Mensal</th><th className="text-left p-2">Anual</th><th className="text-left p-2">Desc.</th></tr></thead>
              <tbody>
                <tr className="border-b border-border/50"><td className="p-2 font-medium">Estudante</td><td className="p-2">R$ 49,99</td><td className="p-2">R$ 479,90</td><td className="p-2 text-emerald-400">20%</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-medium">Medico</td><td className="p-2">R$ 45,99</td><td className="p-2">R$ 441,50</td><td className="p-2 text-emerald-400">20%</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-medium">Professor</td><td className="p-2">R$ 9,99</td><td className="p-2">R$ 95,90</td><td className="p-2 text-emerald-400">20%</td></tr>
                <tr><td className="p-2 font-medium">Parceria Uni (anual)</td><td className="p-2">-</td><td className="p-2">R$ 287,94</td><td className="p-2 text-emerald-400">40%</td></tr>
              </tbody>
            </table>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">Projecao de Receita</h3>
            <div className="space-y-3">
              {[
                { label: 'Cenario Conservador (50 assinantes)', monthly: 50 * 49.99 },
                { label: 'Cenario Moderado (200 assinantes)', monthly: 200 * 49.99 },
                { label: 'Cenario Otimista (500 assinantes)', monthly: 500 * 49.99 },
                { label: 'Meta 1000 assinantes', monthly: 1000 * 49.99 },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <span className="text-sm font-medium">{s.label}</span>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{formatCurrency(s.monthly)}/mes</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(s.monthly * 12)}/ano</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === PARTNERSHIPS === */}
      {activeTab === 'partnerships' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-2">🏫 Parcerias Universitarias</h3>
            <p className="text-sm text-muted-foreground mb-4">Gerencie parcerias com universidades. Minimo 30 alunos, professor mentor gratuito, 40% de desconto no plano anual.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                <p className="text-2xl font-bold text-blue-400">0</p>
                <p className="text-xs text-muted-foreground">Parcerias Ativas</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <p className="text-2xl font-bold text-emerald-400">0</p>
                <p className="text-xs text-muted-foreground">Alunos em Parceria</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                <p className="text-2xl font-bold text-amber-400">0</p>
                <p className="text-xs text-muted-foreground">Solicitacoes Pendentes</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <h4 className="font-semibold text-sm mb-2">Regras de Parceria</h4>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">●</span> Minimo de 30 assinaturas por turma</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">●</span> Professor mentor cadastra e envia convites aos 30 alunos</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">●</span> Professor mentor tem acesso gratuito enquanto a parceria estiver ativa</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">●</span> 40% de desconto no plano anual para todos os alunos da turma</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">●</span> Comprovacao universitaria obrigatoria (formulario de contato)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* === CONTENT === */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">📚 Conteudo da Plataforma</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Calculadoras', count: 15, icon: '🧮' },
                { label: 'Protocolos', count: 10, icon: '📋' },
                { label: 'Atlas 3D (Sistemas)', count: 12, icon: '🧬' },
                { label: 'Materiais Biblioteca', count: 38, icon: '📖' },
                { label: 'Flashcards', count: '500+', icon: '🃏' },
                { label: 'Questoes Quiz', count: 40, icon: '❓' },
                { label: 'Animacoes', count: 6, icon: '▶️' },
                { label: 'Modelos SketchFab', count: 12, icon: '🎨' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border text-center">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-xl font-bold mt-2">{item.count}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === SETTINGS === */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">Configuracoes da Plataforma</h3>
            <div className="space-y-4">
              {[
                { label: 'Proprietario', value: 'rodrigo.goncalves@uisa.com.br', color: 'emerald' },
                { label: 'Dominio', value: 'medfocus-app-ul6txuf2eq-rj.a.run.app', color: 'blue' },
                { label: 'Banco de Dados', value: 'Cloud SQL MySQL', color: 'emerald' },
                { label: 'Stripe', value: 'Gateway de pagamento (modo teste)', color: 'amber' },
                { label: 'IA (Gemini)', value: 'Vertex AI — southamerica-east1', color: 'emerald' },
                { label: 'Storage', value: 'AWS S3 — medfocus-uploads', color: 'emerald' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.value}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    item.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' :
                    item.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-amber-500/10 text-amber-500'
                  }`}>Ativo</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
