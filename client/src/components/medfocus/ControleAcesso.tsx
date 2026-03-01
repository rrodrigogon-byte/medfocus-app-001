/**
 * MedFocus — Controle de Acesso e Permissões RBAC (Sprint 27)
 * 
 * Sistema de controle de acesso multi-clínica:
 * - Perfis: Admin Master, Médico, Recepção, Financeiro, Enfermagem
 * - Permissões granulares por módulo
 * - Multi-clínica com segregação de dados
 * - Logs de auditoria (LGPD)
 * - Gestão de convites e onboarding
 * 
 * DISCLAIMER: Ferramenta exclusivamente educacional e de apoio ao estudo.
 */

import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

type PerfilUsuario = 'admin-master' | 'medico' | 'recepcao' | 'financeiro' | 'enfermagem' | 'estagiario' | 'custom';
type AbaRBAC = 'usuarios' | 'perfis' | 'permissoes' | 'clinicas' | 'auditoria';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  clinicas: string[];
  ativo: boolean;
  ultimoAcesso: string;
  criadoEm: string;
  crm?: string;
  especialidade?: string;
  foto?: string;
}

interface Permissao {
  modulo: string;
  visualizar: boolean;
  criar: boolean;
  editar: boolean;
  excluir: boolean;
  exportar: boolean;
}

interface Clinica {
  id: string;
  nome: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  responsavel: string;
  totalUsuarios: number;
  ativa: boolean;
}

interface LogAuditoria {
  id: string;
  usuario: string;
  acao: string;
  modulo: string;
  detalhes: string;
  ip: string;
  dataHora: string;
  clinica: string;
}

const USUARIOS: Usuario[] = [
  { id: 'u-001', nome: 'Dr. Ricardo Mendes', email: 'ricardo@medfocus.com', perfil: 'admin-master', clinicas: ['Clínica Central', 'Unidade Norte'], ativo: true, ultimoAcesso: '01/03/2026 08:30', criadoEm: '01/01/2025', crm: 'CRM/SP 123456', especialidade: 'Cardiologia' },
  { id: 'u-002', nome: 'Dra. Camila Souza', email: 'camila@medfocus.com', perfil: 'medico', clinicas: ['Clínica Central'], ativo: true, ultimoAcesso: '01/03/2026 07:45', criadoEm: '15/03/2025', crm: 'CRM/SP 654321', especialidade: 'Endocrinologia' },
  { id: 'u-003', nome: 'Ana Paula Silva', email: 'ana@medfocus.com', perfil: 'recepcao', clinicas: ['Clínica Central'], ativo: true, ultimoAcesso: '01/03/2026 07:00', criadoEm: '01/06/2025' },
  { id: 'u-004', nome: 'Carlos Ferreira', email: 'carlos@medfocus.com', perfil: 'financeiro', clinicas: ['Clínica Central', 'Unidade Norte'], ativo: true, ultimoAcesso: '28/02/2026 17:30', criadoEm: '01/08/2025' },
  { id: 'u-005', nome: 'Enfª. Maria Clara', email: 'maria@medfocus.com', perfil: 'enfermagem', clinicas: ['Clínica Central'], ativo: true, ultimoAcesso: '01/03/2026 06:30', criadoEm: '15/09/2025' },
  { id: 'u-006', nome: 'Dr. Paulo Henrique', email: 'paulo@medfocus.com', perfil: 'medico', clinicas: ['Unidade Norte'], ativo: false, ultimoAcesso: '15/02/2026 14:00', criadoEm: '01/11/2025', crm: 'CRM/SP 789012', especialidade: 'Clínica Geral' },
  { id: 'u-007', nome: 'Juliana Estagiária', email: 'juliana@medfocus.com', perfil: 'estagiario', clinicas: ['Clínica Central'], ativo: true, ultimoAcesso: '28/02/2026 16:00', criadoEm: '01/02/2026' },
];

const CLINICAS: Clinica[] = [
  { id: 'cl-01', nome: 'Clínica Central', cnpj: '12.345.678/0001-90', endereco: 'Av. Paulista, 1000 — São Paulo/SP', telefone: '(11) 3000-1000', responsavel: 'Dr. Ricardo Mendes', totalUsuarios: 5, ativa: true },
  { id: 'cl-02', nome: 'Unidade Norte', cnpj: '12.345.678/0002-71', endereco: 'R. Augusta, 500 — São Paulo/SP', telefone: '(11) 3000-2000', responsavel: 'Dr. Ricardo Mendes', totalUsuarios: 3, ativa: true },
];

const PERMISSOES_PERFIL: Record<PerfilUsuario, Permissao[]> = {
  'admin-master': [
    { modulo: 'Prontuário', visualizar: true, criar: true, editar: true, excluir: true, exportar: true },
    { modulo: 'Agenda', visualizar: true, criar: true, editar: true, excluir: true, exportar: true },
    { modulo: 'Financeiro', visualizar: true, criar: true, editar: true, excluir: true, exportar: true },
    { modulo: 'Convênios/TISS', visualizar: true, criar: true, editar: true, excluir: true, exportar: true },
    { modulo: 'Pacientes', visualizar: true, criar: true, editar: true, excluir: true, exportar: true },
    { modulo: 'Relatórios', visualizar: true, criar: true, editar: true, excluir: true, exportar: true },
    { modulo: 'Usuários/RBAC', visualizar: true, criar: true, editar: true, excluir: true, exportar: true },
    { modulo: 'Auditoria', visualizar: true, criar: false, editar: false, excluir: false, exportar: true },
  ],
  'medico': [
    { modulo: 'Prontuário', visualizar: true, criar: true, editar: true, excluir: false, exportar: true },
    { modulo: 'Agenda', visualizar: true, criar: true, editar: true, excluir: false, exportar: false },
    { modulo: 'Financeiro', visualizar: false, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Convênios/TISS', visualizar: true, criar: true, editar: false, excluir: false, exportar: false },
    { modulo: 'Pacientes', visualizar: true, criar: true, editar: true, excluir: false, exportar: false },
    { modulo: 'Relatórios', visualizar: true, criar: false, editar: false, excluir: false, exportar: true },
    { modulo: 'Usuários/RBAC', visualizar: false, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Auditoria', visualizar: false, criar: false, editar: false, excluir: false, exportar: false },
  ],
  'recepcao': [
    { modulo: 'Prontuário', visualizar: false, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Agenda', visualizar: true, criar: true, editar: true, excluir: true, exportar: false },
    { modulo: 'Financeiro', visualizar: true, criar: true, editar: false, excluir: false, exportar: false },
    { modulo: 'Convênios/TISS', visualizar: true, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Pacientes', visualizar: true, criar: true, editar: true, excluir: false, exportar: false },
    { modulo: 'Relatórios', visualizar: false, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Usuários/RBAC', visualizar: false, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Auditoria', visualizar: false, criar: false, editar: false, excluir: false, exportar: false },
  ],
  'financeiro': [
    { modulo: 'Prontuário', visualizar: false, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Agenda', visualizar: true, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Financeiro', visualizar: true, criar: true, editar: true, excluir: true, exportar: true },
    { modulo: 'Convênios/TISS', visualizar: true, criar: true, editar: true, excluir: false, exportar: true },
    { modulo: 'Pacientes', visualizar: true, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Relatórios', visualizar: true, criar: true, editar: false, excluir: false, exportar: true },
    { modulo: 'Usuários/RBAC', visualizar: false, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Auditoria', visualizar: true, criar: false, editar: false, excluir: false, exportar: true },
  ],
  'enfermagem': [
    { modulo: 'Prontuário', visualizar: true, criar: true, editar: false, excluir: false, exportar: false },
    { modulo: 'Agenda', visualizar: true, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Financeiro', visualizar: false, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Convênios/TISS', visualizar: false, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Pacientes', visualizar: true, criar: true, editar: true, excluir: false, exportar: false },
    { modulo: 'Relatórios', visualizar: false, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Usuários/RBAC', visualizar: false, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Auditoria', visualizar: false, criar: false, editar: false, excluir: false, exportar: false },
  ],
  'estagiario': [
    { modulo: 'Prontuário', visualizar: true, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Agenda', visualizar: true, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Financeiro', visualizar: false, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Convênios/TISS', visualizar: false, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Pacientes', visualizar: true, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Relatórios', visualizar: false, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Usuários/RBAC', visualizar: false, criar: false, editar: false, excluir: false, exportar: false },
    { modulo: 'Auditoria', visualizar: false, criar: false, editar: false, excluir: false, exportar: false },
  ],
  'custom': [],
};

const LOGS_AUDITORIA: LogAuditoria[] = [
  { id: 'log-01', usuario: 'Dr. Ricardo Mendes', acao: 'Visualizou', modulo: 'Prontuário', detalhes: 'Prontuário de João Carlos Silva', ip: '189.100.x.x', dataHora: '01/03/2026 08:35', clinica: 'Clínica Central' },
  { id: 'log-02', usuario: 'Ana Paula Silva', acao: 'Criou', modulo: 'Agenda', detalhes: 'Agendamento para Maria Fernanda Santos', ip: '189.100.x.x', dataHora: '01/03/2026 08:20', clinica: 'Clínica Central' },
  { id: 'log-03', usuario: 'Carlos Ferreira', acao: 'Exportou', modulo: 'Financeiro', detalhes: 'Relatório financeiro fevereiro/2026', ip: '189.100.x.x', dataHora: '28/02/2026 17:30', clinica: 'Clínica Central' },
  { id: 'log-04', usuario: 'Dra. Camila Souza', acao: 'Editou', modulo: 'Prontuário', detalhes: 'Evolução de Fernanda Oliveira', ip: '189.100.x.x', dataHora: '28/02/2026 16:45', clinica: 'Clínica Central' },
  { id: 'log-05', usuario: 'Dr. Ricardo Mendes', acao: 'Desativou', modulo: 'Usuários/RBAC', detalhes: 'Usuário Dr. Paulo Henrique desativado', ip: '189.100.x.x', dataHora: '28/02/2026 15:00', clinica: 'Unidade Norte' },
];

export function ControleAcesso() {
  const [aba, setAba] = useState<AbaRBAC>('usuarios');
  const [perfilSelecionado, setPerfilSelecionado] = useState<PerfilUsuario>('admin-master');

  const corPerfil = (p: PerfilUsuario) => {
    switch (p) {
      case 'admin-master': return 'bg-red-500/20 text-red-400';
      case 'medico': return 'bg-blue-500/20 text-blue-400';
      case 'recepcao': return 'bg-green-500/20 text-green-400';
      case 'financeiro': return 'bg-yellow-500/20 text-yellow-400';
      case 'enfermagem': return 'bg-purple-500/20 text-purple-400';
      case 'estagiario': return 'bg-gray-500/20 text-gray-400';
      case 'custom': return 'bg-orange-500/20 text-orange-400';
    }
  };

  const labelPerfil = (p: PerfilUsuario) => {
    switch (p) {
      case 'admin-master': return 'Admin Master';
      case 'medico': return 'Médico';
      case 'recepcao': return 'Recepção';
      case 'financeiro': return 'Financeiro';
      case 'enfermagem': return 'Enfermagem';
      case 'estagiario': return 'Estagiário';
      case 'custom': return 'Personalizado';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="Controle de Acesso" />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">🔐</span> Controle de Acesso e Permissões
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">RBAC</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Gestão de usuários, perfis, permissões e auditoria multi-clínica</p>
      </div>

      {/* Abas */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {([
          { id: 'usuarios' as AbaRBAC, label: '👥 Usuários' },
          { id: 'perfis' as AbaRBAC, label: '🎭 Perfis' },
          { id: 'permissoes' as AbaRBAC, label: '🔑 Permissões' },
          { id: 'clinicas' as AbaRBAC, label: '🏥 Clínicas' },
          { id: 'auditoria' as AbaRBAC, label: '📋 Auditoria' },
        ]).map(a => (
          <button key={a.id} onClick={() => setAba(a.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${aba === a.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Usuários */}
      {aba === 'usuarios' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">{USUARIOS.length} usuários cadastrados</p>
            <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700">+ Convidar Usuário</button>
          </div>
          <div className="space-y-2">
            {USUARIOS.map(u => (
              <div key={u.id} className={`bg-card border rounded-xl p-4 transition ${u.ativo ? 'border-border hover:border-primary/50' : 'border-border/50 opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                      {u.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{u.nome}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${corPerfil(u.perfil)}`}>{labelPerfil(u.perfil)}</span>
                        {!u.ativo && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">Inativo</span>}
                      </div>
                      <p className="text-[10px] text-muted-foreground">{u.email} {u.crm && `• ${u.crm}`} {u.especialidade && `• ${u.especialidade}`}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">Último acesso: {u.ultimoAcesso}</p>
                    <p className="text-[10px] text-muted-foreground">Clínicas: {u.clinicas.join(', ')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Perfis */}
      {aba === 'perfis' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(['admin-master', 'medico', 'recepcao', 'financeiro', 'enfermagem', 'estagiario'] as PerfilUsuario[]).map(p => {
            const perms = PERMISSOES_PERFIL[p];
            const totalPerms = perms.reduce((a, pm) => a + (pm.visualizar ? 1 : 0) + (pm.criar ? 1 : 0) + (pm.editar ? 1 : 0) + (pm.excluir ? 1 : 0) + (pm.exportar ? 1 : 0), 0);
            const maxPerms = perms.length * 5;
            return (
              <div key={p} className={`bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition ${perfilSelecionado === p ? 'border-primary' : ''}`}
                onClick={() => { setPerfilSelecionado(p); setAba('permissoes'); }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${corPerfil(p)}`}>{labelPerfil(p)}</span>
                  <span className="text-[10px] text-muted-foreground">{USUARIOS.filter(u => u.perfil === p).length} usuários</span>
                </div>
                <div className="w-full bg-background rounded-full h-2 mb-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${(totalPerms / maxPerms) * 100}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground">{totalPerms}/{maxPerms} permissões ativas</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Permissões */}
      {aba === 'permissoes' && (
        <div className="space-y-4">
          <div className="flex gap-1.5 flex-wrap mb-3">
            {(['admin-master', 'medico', 'recepcao', 'financeiro', 'enfermagem', 'estagiario'] as PerfilUsuario[]).map(p => (
              <button key={p} onClick={() => setPerfilSelecionado(p)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition ${perfilSelecionado === p ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
                {labelPerfil(p)}
              </button>
            ))}
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-border bg-background/50">
                <th className="text-left py-2.5 px-3">Módulo</th>
                <th className="text-center py-2.5 px-3">👁 Ver</th>
                <th className="text-center py-2.5 px-3">➕ Criar</th>
                <th className="text-center py-2.5 px-3">✏️ Editar</th>
                <th className="text-center py-2.5 px-3">🗑 Excluir</th>
                <th className="text-center py-2.5 px-3">📤 Exportar</th>
              </tr></thead>
              <tbody>
                {PERMISSOES_PERFIL[perfilSelecionado].map(p => (
                  <tr key={p.modulo} className="border-b border-border/50">
                    <td className="py-2 px-3 font-medium">{p.modulo}</td>
                    {[p.visualizar, p.criar, p.editar, p.excluir, p.exportar].map((v, i) => (
                      <td key={i} className="py-2 px-3 text-center">
                        <span className={`text-sm ${v ? 'text-green-400' : 'text-red-400/50'}`}>{v ? '✅' : '❌'}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Clínicas */}
      {aba === 'clinicas' && (
        <div className="space-y-4">
          <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700">+ Nova Clínica/Unidade</button>
          {CLINICAS.map(c => (
            <div key={c.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-sm">{c.nome}</h4>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${c.ativa ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {c.ativa ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
                <div><span className="text-muted-foreground">CNPJ:</span> {c.cnpj}</div>
                <div><span className="text-muted-foreground">Endereço:</span> {c.endereco}</div>
                <div><span className="text-muted-foreground">Telefone:</span> {c.telefone}</div>
                <div><span className="text-muted-foreground">Responsável:</span> {c.responsavel}</div>
              </div>
              <p className="text-[10px] text-primary mt-2">{c.totalUsuarios} usuários vinculados</p>
            </div>
          ))}
        </div>
      )}

      {/* Auditoria */}
      {aba === 'auditoria' && (
        <div className="space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-3">
            <p className="text-xs">⚖️ <strong>LGPD — Art. 37:</strong> O controlador e o operador devem manter registro das operações de tratamento de dados pessoais que realizarem. Todos os acessos são registrados automaticamente.</p>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-border bg-background/50">
                <th className="text-left py-2.5 px-3">Data/Hora</th>
                <th className="text-left py-2.5 px-3">Usuário</th>
                <th className="text-center py-2.5 px-3">Ação</th>
                <th className="text-left py-2.5 px-3">Módulo</th>
                <th className="text-left py-2.5 px-3">Detalhes</th>
                <th className="text-left py-2.5 px-3">Clínica</th>
              </tr></thead>
              <tbody>
                {LOGS_AUDITORIA.map(l => (
                  <tr key={l.id} className="border-b border-border/50 hover:bg-accent/50">
                    <td className="py-2 px-3 text-muted-foreground font-mono">{l.dataHora}</td>
                    <td className="py-2 px-3">{l.usuario}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        l.acao === 'Criou' ? 'bg-green-500/20 text-green-400' :
                        l.acao === 'Editou' ? 'bg-blue-500/20 text-blue-400' :
                        l.acao === 'Excluiu' || l.acao === 'Desativou' ? 'bg-red-500/20 text-red-400' :
                        l.acao === 'Exportou' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>{l.acao}</span>
                    </td>
                    <td className="py-2 px-3">{l.modulo}</td>
                    <td className="py-2 px-3 text-muted-foreground">{l.detalhes}</td>
                    <td className="py-2 px-3 text-muted-foreground">{l.clinica}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <EducationalDisclaimer variant="footer" />
    </div>
  );
}
