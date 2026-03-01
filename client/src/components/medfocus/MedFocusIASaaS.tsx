/**
 * MedFocusIA SaaS — Multi-Tenant Clinical Management System
 * 6 views: Dashboard, Patients, Agenda, Doctors, LGPD, Plans
 */
import React, { useState } from 'react';

// ============================================================
// 1. DASHBOARD CLÍNICA
// ============================================================
export const MedFocusIADashboard: React.FC = () => {
  const stats = [
    { label: 'Pacientes Ativos', value: '1.247', change: '+12%', icon: '👥', color: 'from-blue-500 to-cyan-500' },
    { label: 'Consultas Hoje', value: '38', change: '+5', icon: '📅', color: 'from-emerald-500 to-teal-500' },
    { label: 'Faturamento Mensal', value: 'R$ 89.450', change: '+18%', icon: '💰', color: 'from-amber-500 to-orange-500' },
    { label: 'Taxa Ocupação', value: '87%', change: '+3%', icon: '📊', color: 'from-purple-500 to-pink-500' },
  ];
  const recentAppointments = [
    { patient: 'Maria Silva', doctor: 'Dr. Carlos Mendes', specialty: 'Cardiologia', time: '08:00', status: 'confirmed' },
    { patient: 'João Santos', doctor: 'Dra. Ana Oliveira', specialty: 'Dermatologia', time: '08:30', status: 'waiting' },
    { patient: 'Pedro Costa', doctor: 'Dr. Roberto Lima', specialty: 'Ortopedia', time: '09:00', status: 'in_progress' },
    { patient: 'Ana Ferreira', doctor: 'Dra. Lucia Souza', specialty: 'Ginecologia', time: '09:30', status: 'confirmed' },
    { patient: 'Carlos Ribeiro', doctor: 'Dr. Carlos Mendes', specialty: 'Cardiologia', time: '10:00', status: 'confirmed' },
  ];
  const statusColors: Record<string, string> = {
    confirmed: 'bg-blue-500/20 text-blue-400', waiting: 'bg-amber-500/20 text-amber-400',
    in_progress: 'bg-emerald-500/20 text-emerald-400', cancelled: 'bg-red-500/20 text-red-400',
  };
  const statusLabels: Record<string, string> = {
    confirmed: 'Confirmado', waiting: 'Aguardando', in_progress: 'Em atendimento', cancelled: 'Cancelado',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard — Clínica MedFocus</h1>
          <p className="text-sm text-gray-400 mt-1">Sistema Multi-Tenant SaaS | LGPD Compliant | FHIR R4</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-full border border-cyan-500/30">SaaS v10.0</span>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">LGPD ✓</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xs text-emerald-400 font-semibold">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            <div className={`h-1 rounded-full bg-gradient-to-r ${stat.color} mt-3 opacity-60`} />
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
        <h3 className="text-lg font-bold text-white mb-4">Consultas de Hoje</h3>
        <div className="space-y-3">
          {recentAppointments.map((apt, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
                  {apt.patient.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{apt.patient}</div>
                  <div className="text-xs text-gray-400">{apt.doctor} — {apt.specialty}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300 font-mono">{apt.time}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[apt.status]}`}>
                  {statusLabels[apt.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Info */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
        <h3 className="text-lg font-bold text-white mb-4">Arquitetura do Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Auth Service', port: '3001', desc: 'JWT, RBAC, 2FA, Multi-Tenant', status: 'online' },
            { title: 'Patient Service', port: '3002', desc: 'CRUD, LGPD, CPF AES-256-GCM', status: 'online' },
            { title: 'Agenda Service', port: '3003', desc: 'Consultas, Médicos, Agendas', status: 'online' },
          ].map((svc, i) => (
            <div key={i} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white">{svc.title}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-xs text-gray-400">Porta: {svc.port}</div>
              <div className="text-xs text-gray-500 mt-1">{svc.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
          <div className="text-xs text-cyan-400 font-semibold">Stack: Node.js 20 + TypeScript + PostgreSQL 16 + Redis 7.2 + GCP Cloud Run</div>
          <div className="text-xs text-cyan-400/70 mt-1">Conformidade: LGPD + CFM + FHIR R4 + ANS TISS 4.0</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 2. PACIENTES (LGPD Compliant)
// ============================================================
export const MedFocusIAPatients: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const patients = [
    { id: 1, name: 'Maria da Silva Santos', cpf: '***.***.***-45', birth: '15/03/1985', phone: '(65) 99999-1234', lastVisit: '28/02/2026', status: 'active', insurance: 'Unimed' },
    { id: 2, name: 'João Pedro Costa', cpf: '***.***.***-78', birth: '22/07/1990', phone: '(65) 98888-5678', lastVisit: '27/02/2026', status: 'active', insurance: 'SUS' },
    { id: 3, name: 'Ana Beatriz Ferreira', cpf: '***.***.***-12', birth: '10/11/1978', phone: '(65) 97777-9012', lastVisit: '25/02/2026', status: 'active', insurance: 'Bradesco Saúde' },
    { id: 4, name: 'Carlos Eduardo Ribeiro', cpf: '***.***.***-34', birth: '05/09/1965', phone: '(65) 96666-3456', lastVisit: '20/02/2026', status: 'inactive', insurance: 'Amil' },
    { id: 5, name: 'Lucia Helena Souza', cpf: '***.***.***-56', birth: '18/01/1992', phone: '(65) 95555-7890', lastVisit: '01/03/2026', status: 'active', insurance: 'SUS' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Pacientes</h1>
          <p className="text-sm text-gray-400 mt-1">CPF criptografado AES-256-GCM | LGPD Art. 18 Compliant</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-cyan-500 text-white text-sm font-bold rounded-lg hover:bg-cyan-600 transition">
          + Novo Paciente
        </button>
      </div>

      {/* LGPD Notice */}
      <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20 flex items-center gap-3">
        <span className="text-amber-400">🔒</span>
        <div className="text-xs text-amber-400">
          <strong>LGPD:</strong> Dados sensíveis criptografados. CPF mascarado por padrão. Acesso registrado em log de auditoria.
          Pacientes podem solicitar portabilidade (Art. 18, V) e exclusão (Art. 18, VI) a qualquer momento.
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input type="text" placeholder="Buscar paciente por nome, CPF ou convênio..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none" />
      </div>

      {/* New Patient Form */}
      {showForm && (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
          <h3 className="text-lg font-bold text-white mb-4">Cadastro de Paciente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Nome Completo', 'CPF', 'Data de Nascimento', 'Telefone', 'Email', 'Convênio', 'Endereço', 'CEP'].map(field => (
              <div key={field}>
                <label className="text-xs text-gray-400 mb-1 block">{field}</label>
                <input type="text" className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none" />
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
            <label className="flex items-center gap-2 text-xs text-cyan-400">
              <input type="checkbox" className="rounded" />
              <span>Paciente concorda com o Termo de Consentimento para tratamento de dados (LGPD Art. 7, I)</span>
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 bg-cyan-500 text-white text-sm font-bold rounded-lg hover:bg-cyan-600 transition">Salvar</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600 transition">Cancelar</button>
          </div>
        </div>
      )}

      {/* Patients Table */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="text-left text-xs text-gray-400 font-semibold p-4">Paciente</th>
              <th className="text-left text-xs text-gray-400 font-semibold p-4">CPF</th>
              <th className="text-left text-xs text-gray-400 font-semibold p-4">Nascimento</th>
              <th className="text-left text-xs text-gray-400 font-semibold p-4">Convênio</th>
              <th className="text-left text-xs text-gray-400 font-semibold p-4">Última Consulta</th>
              <th className="text-left text-xs text-gray-400 font-semibold p-4">Status</th>
              <th className="text-left text-xs text-gray-400 font-semibold p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {patients.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.insurance.toLowerCase().includes(search.toLowerCase())).map(p => (
              <tr key={p.id} className="border-b border-gray-700/20 hover:bg-gray-700/20 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs">
                      {p.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm text-white font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-400 font-mono">{p.cpf}</td>
                <td className="p-4 text-sm text-gray-400">{p.birth}</td>
                <td className="p-4"><span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">{p.insurance}</span></td>
                <td className="p-4 text-sm text-gray-400">{p.lastVisit}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {p.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <button className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded hover:bg-cyan-500/30 transition">Prontuário</button>
                    <button className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded hover:bg-gray-700 transition">Editar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================
// 3. AGENDA MÉDICA
// ============================================================
export const MedFocusIAAgenda: React.FC = () => {
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);
  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(i / 2) + 7;
    const min = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${min}`;
  });
  const appointments: Record<string, { patient: string; doctor: string; type: string; status: string }> = {
    '07:00': { patient: 'Maria Silva', doctor: 'Dr. Carlos', type: 'Consulta', status: 'confirmed' },
    '07:30': { patient: 'João Santos', doctor: 'Dr. Carlos', type: 'Retorno', status: 'confirmed' },
    '08:00': { patient: 'Pedro Costa', doctor: 'Dra. Ana', type: 'Primeira vez', status: 'waiting' },
    '09:00': { patient: 'Ana Ferreira', doctor: 'Dr. Roberto', type: 'Exame', status: 'confirmed' },
    '09:30': { patient: 'Carlos Ribeiro', doctor: 'Dr. Carlos', type: 'Consulta', status: 'in_progress' },
    '10:30': { patient: 'Lucia Souza', doctor: 'Dra. Ana', type: 'Retorno', status: 'confirmed' },
    '14:00': { patient: 'Roberto Alves', doctor: 'Dr. Roberto', type: 'Telemedicina', status: 'confirmed' },
    '15:00': { patient: 'Fernanda Lima', doctor: 'Dr. Carlos', type: 'Consulta', status: 'confirmed' },
  };
  const statusColors: Record<string, string> = {
    confirmed: 'border-l-blue-500 bg-blue-500/10', waiting: 'border-l-amber-500 bg-amber-500/10',
    in_progress: 'border-l-emerald-500 bg-emerald-500/10',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agenda Médica</h1>
          <p className="text-sm text-gray-400 mt-1">Detecção de conflitos | Consultas recorrentes | Telemedicina</p>
        </div>
        <button className="px-4 py-2 bg-cyan-500 text-white text-sm font-bold rounded-lg hover:bg-cyan-600 transition">
          + Nova Consulta
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <input type="date" value={selectedDate} className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none" readOnly />
        <div className="flex gap-2">
          {['Dr. Carlos', 'Dra. Ana', 'Dr. Roberto', 'Todos'].map(doc => (
            <button key={doc} className="px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-xs text-gray-300 hover:border-cyan-500/50 transition">
              {doc}
            </button>
          ))}
        </div>
      </div>

      {/* Time Grid */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
        <div className="space-y-1">
          {timeSlots.map(time => {
            const apt = appointments[time];
            return (
              <div key={time} className={`flex items-center gap-4 p-3 rounded-lg border-l-4 ${apt ? statusColors[apt.status] : 'border-l-gray-700/30 bg-gray-900/20'} transition hover:bg-gray-700/20`}>
                <span className="text-sm font-mono text-gray-400 w-12">{time}</span>
                {apt ? (
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-white">{apt.patient}</span>
                      <span className="text-xs text-gray-400 ml-2">— {apt.doctor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded">{apt.type}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-gray-600">Disponível</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 4. CORPO CLÍNICO (Doctors)
// ============================================================
export const MedFocusIADoctors: React.FC = () => {
  const doctors = [
    { name: 'Dr. Carlos Mendes', crm: 'CRM/MT 12345', specialty: 'Cardiologia', patients: 342, rating: 4.8, status: 'online', schedule: 'Seg-Sex 07:00-17:00' },
    { name: 'Dra. Ana Oliveira', crm: 'CRM/MT 23456', specialty: 'Dermatologia', patients: 256, rating: 4.9, status: 'online', schedule: 'Seg-Qui 08:00-16:00' },
    { name: 'Dr. Roberto Lima', crm: 'CRM/MT 34567', specialty: 'Ortopedia', patients: 198, rating: 4.7, status: 'offline', schedule: 'Ter-Sex 09:00-18:00' },
    { name: 'Dra. Lucia Souza', crm: 'CRM/MT 45678', specialty: 'Ginecologia', patients: 412, rating: 4.9, status: 'online', schedule: 'Seg-Sex 07:00-15:00' },
    { name: 'Dr. Fernando Alves', crm: 'CRM/MT 56789', specialty: 'Pediatria', patients: 567, rating: 4.8, status: 'online', schedule: 'Seg-Sex 08:00-17:00' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Corpo Clínico</h1>
          <p className="text-sm text-gray-400 mt-1">Gestão de médicos, escalas e especialidades</p>
        </div>
        <button className="px-4 py-2 bg-cyan-500 text-white text-sm font-bold rounded-lg hover:bg-cyan-600 transition">
          + Cadastrar Médico
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doc, i) => (
          <div key={i} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5 hover:border-cyan-500/30 transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                {doc.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{doc.name}</div>
                <div className="text-xs text-gray-400">{doc.crm}</div>
              </div>
              <span className={`ml-auto w-2.5 h-2.5 rounded-full ${doc.status === 'online' ? 'bg-emerald-400' : 'bg-gray-500'}`} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs"><span className="text-gray-400">Especialidade</span><span className="text-white font-medium">{doc.specialty}</span></div>
              <div className="flex justify-between text-xs"><span className="text-gray-400">Pacientes</span><span className="text-white font-medium">{doc.patients}</span></div>
              <div className="flex justify-between text-xs"><span className="text-gray-400">Avaliação</span><span className="text-amber-400 font-medium">★ {doc.rating}</span></div>
              <div className="flex justify-between text-xs"><span className="text-gray-400">Horário</span><span className="text-white font-medium">{doc.schedule}</span></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-1.5 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-lg hover:bg-cyan-500/30 transition">Agenda</button>
              <button className="flex-1 px-3 py-1.5 bg-gray-700/50 text-gray-300 text-xs rounded-lg hover:bg-gray-700 transition">Editar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// 5. LGPD & COMPLIANCE
// ============================================================
export const MedFocusIALGPD: React.FC = () => {
  const lgpdRights = [
    { article: 'Art. 18, I', right: 'Confirmação de tratamento', status: 'implemented', desc: 'Endpoint GET /patients/:id/lgpd/data-exists' },
    { article: 'Art. 18, II', right: 'Acesso aos dados', status: 'implemented', desc: 'Endpoint GET /patients/:id/lgpd/export' },
    { article: 'Art. 18, III', right: 'Correção de dados', status: 'implemented', desc: 'Endpoint PUT /patients/:id com validação' },
    { article: 'Art. 18, IV', right: 'Anonimização', status: 'implemented', desc: 'Função anonymizePatient() com hash irreversível' },
    { article: 'Art. 18, V', right: 'Portabilidade', status: 'implemented', desc: 'Export FHIR R4 JSON + PDF' },
    { article: 'Art. 18, VI', right: 'Eliminação', status: 'implemented', desc: 'Soft-delete com retenção legal de 20 anos (CFM)' },
    { article: 'Art. 18, VII', right: 'Informação sobre compartilhamento', status: 'implemented', desc: 'Log de acesso com IP, user-agent, timestamp' },
    { article: 'Art. 18, VIII', right: 'Revogação do consentimento', status: 'implemented', desc: 'Endpoint DELETE /patients/:id/lgpd/consent' },
    { article: 'Art. 18, IX', right: 'Revisão de decisões automatizadas', status: 'planned', desc: 'Revisão humana de triagem IA' },
  ];
  const auditLog = [
    { time: '01/03/2026 08:15', user: 'Dr. Carlos Mendes', action: 'VIEW_PATIENT', target: 'Maria Silva (ID: 1247)', ip: '189.40.xxx.xxx' },
    { time: '01/03/2026 08:12', user: 'Recepção', action: 'CREATE_APPOINTMENT', target: 'João Santos → Dr. Carlos', ip: '189.40.xxx.xxx' },
    { time: '01/03/2026 08:00', user: 'Sistema', action: 'BACKUP_ENCRYPTED', target: 'Database snapshot', ip: 'internal' },
    { time: '28/02/2026 17:45', user: 'Admin', action: 'EXPORT_DATA', target: 'Relatório mensal (anonimizado)', ip: '189.40.xxx.xxx' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">LGPD & Compliance</h1>
        <p className="text-sm text-gray-400 mt-1">Lei Geral de Proteção de Dados | CFM | FHIR R4 | ANS TISS 4.0</p>
      </div>

      {/* Compliance Score */}
      <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl border border-emerald-500/30 p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-emerald-400">98%</div>
            <div className="text-sm text-emerald-400/80">Score de Conformidade LGPD</div>
          </div>
          <div className="text-right space-y-1">
            <div className="text-xs text-gray-300">✅ Criptografia AES-256-GCM</div>
            <div className="text-xs text-gray-300">✅ Audit Log completo</div>
            <div className="text-xs text-gray-300">✅ Consentimento registrado</div>
            <div className="text-xs text-gray-300">✅ DPO designado</div>
          </div>
        </div>
      </div>

      {/* LGPD Rights Implementation */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
        <h3 className="text-lg font-bold text-white mb-4">Direitos do Titular (Art. 18 LGPD)</h3>
        <div className="space-y-2">
          {lgpdRights.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${r.status === 'implemented' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <div>
                  <span className="text-xs text-cyan-400 font-mono mr-2">{r.article}</span>
                  <span className="text-sm text-white">{r.right}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 max-w-xs text-right">{r.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
        <h3 className="text-lg font-bold text-white mb-4">Log de Auditoria</h3>
        <div className="space-y-2">
          {auditLog.map((log, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 font-mono w-36">{log.time}</span>
                <span className="text-xs text-white">{log.user}</span>
                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-[10px] font-bold rounded">{log.action}</span>
              </div>
              <div className="text-xs text-gray-500">{log.target}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 6. PLANOS SaaS
// ============================================================
export const MedFocusIAPlans: React.FC = () => {
  const plans = [
    { name: 'Starter', price: 'R$ 297', period: '/mês', color: 'from-blue-500 to-cyan-500', features: ['1 clínica', 'Até 3 médicos', '500 pacientes', 'Agenda básica', 'Suporte email', 'LGPD básico'], popular: false },
    { name: 'Professional', price: 'R$ 597', period: '/mês', color: 'from-cyan-500 to-emerald-500', features: ['3 clínicas', 'Até 10 médicos', '2.000 pacientes', 'Agenda + Telemedicina', 'Suporte prioritário', 'LGPD completo', 'Relatórios avançados', 'API REST'], popular: true },
    { name: 'Enterprise', price: 'R$ 1.497', period: '/mês', color: 'from-purple-500 to-pink-500', features: ['Ilimitadas clínicas', 'Médicos ilimitados', 'Pacientes ilimitados', 'Telemedicina + IA', 'Suporte 24/7', 'LGPD + DPO dedicado', 'FHIR R4 + ANS TISS', 'API + Webhooks', 'White-label'], popular: false },
    { name: 'Custom', price: 'Sob consulta', period: '', color: 'from-amber-500 to-orange-500', features: ['Infraestrutura dedicada', 'SLA personalizado', 'Integração HL7/FHIR', 'On-premise opcional', 'Treinamento presencial', 'Desenvolvimento sob demanda'], popular: false },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Planos MedFocusIA SaaS</h1>
        <p className="text-sm text-gray-400 mt-1">Sistema Multi-Tenant para Clínicas e Hospitais</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan, i) => (
          <div key={i} className={`bg-gray-800/50 rounded-xl border ${plan.popular ? 'border-cyan-500/50 ring-1 ring-cyan-500/20' : 'border-gray-700/50'} p-5 relative`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-cyan-500 text-white text-xs font-bold rounded-full">
                Mais Popular
              </div>
            )}
            <div className={`text-lg font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>{plan.name}</div>
            <div className="mt-2">
              <span className="text-3xl font-bold text-white">{plan.price}</span>
              <span className="text-sm text-gray-400">{plan.period}</span>
            </div>
            <ul className="mt-4 space-y-2">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 text-xs text-gray-300">
                  <span className="text-emerald-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <button className={`w-full mt-4 py-2 rounded-lg text-sm font-bold transition ${plan.popular ? 'bg-cyan-500 text-white hover:bg-cyan-600' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'}`}>
              {plan.price === 'Sob consulta' ? 'Fale Conosco' : 'Começar Agora'}
            </button>
          </div>
        ))}
      </div>

      {/* Compliance Badges */}
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {['LGPD Compliant', 'CFM Regulamentado', 'FHIR R4', 'ANS TISS 4.0', 'ISO 27001', 'SOC 2 Type II'].map(badge => (
          <span key={badge} className="px-3 py-1 bg-gray-800/50 border border-gray-700/50 rounded-full text-xs text-gray-400">{badge}</span>
        ))}
      </div>
    </div>
  );
};
