/**
 * ClassroomPanel - Controle de Salas e Atividades por Professores
 * 
 * Conectado ao banco de dados via tRPC.
 * Professores: criar salas, atribuir atividades, ver progresso dos alunos.
 * Alunos: entrar em salas via código, ver atividades, submeter respostas.
 */
import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface ClassroomPanelProps {
  user: User;
}

type PanelView = 'list' | 'create' | 'detail' | 'join' | 'createActivity';

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'quiz': return '❓';
    case 'flashcards': return '🃏';
    case 'assignment': return '📝';
    case 'reading': return '📖';
    case 'discussion': return '💬';
    default: return '📋';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-teal-500/10 text-teal-500';
    case 'draft': return 'bg-blue-500/10 text-blue-500';
    case 'completed': return 'bg-green-500/10 text-green-500';
    case 'archived': return 'bg-gray-500/10 text-gray-500';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active': return 'Ativa';
    case 'draft': return 'Rascunho';
    case 'completed': return 'Concluída';
    case 'archived': return 'Arquivada';
    default: return status;
  }
};

const formatDate = (d: Date | string | null | undefined) => {
  if (!d) return '—';
  const date = new Date(d);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const ClassroomPanel: React.FC<ClassroomPanelProps> = ({ user }) => {
  const [view, setView] = useState<PanelView>('list');
  const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newClassroom, setNewClassroom] = useState({
    name: '', subject: '', year: 1, semester: 1, university: '', description: '', maxStudents: 60,
  });
  const [newActivity, setNewActivity] = useState({
    title: '', type: 'quiz' as 'quiz' | 'flashcards' | 'assignment' | 'reading' | 'discussion',
    description: '', points: 100, dueDate: '',
  });

  const isProfessor = user.role === 'admin' || user.role === 'professor';
  const utils = trpc.useUtils();

  // ─── Queries ─────────────────────────────
  const { data: classroomsData, isLoading: loadingClassrooms, isError: classroomsError } = trpc.classroom.myClassrooms.useQuery(undefined, {
    retry: false,
  });

  const { data: selectedClassroom } = trpc.classroom.getById.useQuery(
    { id: selectedClassroomId! },
    { enabled: !!selectedClassroomId }
  );

  const { data: enrollmentsData } = trpc.classroom.enrollments.useQuery(
    { classroomId: selectedClassroomId! },
    { enabled: !!selectedClassroomId && isProfessor }
  );

  const { data: activitiesData } = trpc.classroom.activities.useQuery(
    { classroomId: selectedClassroomId! },
    { enabled: !!selectedClassroomId }
  );

  const { data: analyticsData } = trpc.classroom.analytics.useQuery(
    { classroomId: selectedClassroomId! },
    { enabled: !!selectedClassroomId && isProfessor }
  );

  // ─── Mutations ─────────────────────────────
  const createMutation = trpc.classroom.create.useMutation({
    onSuccess: (room) => {
      toast.success(`Sala "${room.name}" criada! Código: ${room.code}`);
      utils.classroom.myClassrooms.invalidate();
      setView('list');
      setNewClassroom({ name: '', subject: '', year: 1, semester: 1, university: '', description: '', maxStudents: 60 });
    },
    onError: (err) => toast.error(err.message),
  });

  const joinMutation = trpc.classroom.join.useMutation({
    onSuccess: (room) => {
      toast.success(`Você entrou na sala "${room.name}"!`);
      utils.classroom.myClassrooms.invalidate();
      setSelectedClassroomId(room.id);
      setView('detail');
      setJoinCode('');
    },
    onError: (err) => toast.error(err.message),
  });

  const createActivityMutation = trpc.classroom.createActivity.useMutation({
    onSuccess: () => {
      toast.success('Atividade criada com sucesso!');
      utils.classroom.activities.invalidate({ classroomId: selectedClassroomId! });
      setView('detail');
      setNewActivity({ title: '', type: 'quiz', description: '', points: 100, dueDate: '' });
    },
    onError: (err) => toast.error(err.message),
  });

  const removeStudentMutation = trpc.classroom.removeStudent.useMutation({
    onSuccess: () => {
      toast.success('Aluno removido da sala.');
      utils.classroom.enrollments.invalidate({ classroomId: selectedClassroomId! });
      utils.classroom.analytics.invalidate({ classroomId: selectedClassroomId! });
    },
    onError: (err) => toast.error(err.message),
  });

  const updateActivityMutation = trpc.classroom.updateActivity.useMutation({
    onSuccess: () => {
      toast.success('Atividade atualizada!');
      utils.classroom.activities.invalidate({ classroomId: selectedClassroomId! });
    },
    onError: (err) => toast.error(err.message),
  });

  // ─── Derived Data ─────────────────────────────
  const allClassrooms = useMemo(() => {
    if (!classroomsData) return [];
    return [...classroomsData.asProfessor, ...classroomsData.asStudent];
  }, [classroomsData]);

  const filteredClassrooms = useMemo(() => {
    if (!searchTerm) return allClassrooms;
    const term = searchTerm.toLowerCase();
    return allClassrooms.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.subject.toLowerCase().includes(term) ||
      c.university.toLowerCase().includes(term)
    );
  }, [allClassrooms, searchTerm]);

  // ─── Loading State ─────────────────────────────
  if (loadingClassrooms && !classroomsError) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Carregando salas...</p>
        </div>
      </div>
    );
  }

  // ─── List View ─────────────────────────────
  const renderList = () => (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar sala..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground border-0 focus:ring-2 focus:ring-teal-500"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setView('join')}
            className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-medium text-foreground hover:border-teal-500/50 transition-colors"
          >
            Entrar com Código
          </button>
          {isProfessor && (
            <button
              onClick={() => setView('create')}
              className="px-4 py-2.5 bg-teal-500 text-white rounded-xl text-sm font-medium hover:bg-teal-600 transition-colors"
            >
              + Criar Sala
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">Minhas Salas</p>
          <p className="text-2xl font-bold text-foreground">{allClassrooms.length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">Como Professor</p>
          <p className="text-2xl font-bold text-teal-500">{classroomsData?.asProfessor.length || 0}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">Como Aluno</p>
          <p className="text-2xl font-bold text-blue-500">{classroomsData?.asStudent.length || 0}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">Salas Ativas</p>
          <p className="text-2xl font-bold text-green-500">
            {allClassrooms.filter(c => c.isActive).length}
          </p>
        </div>
      </div>

      {/* Classroom Cards */}
      <div className="space-y-3">
        {filteredClassrooms.map(classroom => (
          <div
            key={classroom.id}
            onClick={() => { setSelectedClassroomId(classroom.id); setView('detail'); }}
            className="bg-card rounded-xl border border-border p-4 hover:border-teal-500/30 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-foreground">{classroom.name}</h3>
                  {classroom.isActive && <span className="w-2 h-2 rounded-full bg-green-500" />}
                </div>
                <p className="text-xs text-muted-foreground">{classroom.university} · {classroom.year}º ano · {classroom.semester}º sem</p>
                {classroom.description && (
                  <p className="text-xs text-muted-foreground mt-1">{classroom.description.slice(0, 100)}...</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-mono text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded">{classroom.code}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{classroom.subject}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClassrooms.length === 0 && (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <div className="text-4xl mb-4">🏫</div>
          <h3 className="text-lg font-bold text-foreground mb-2">Nenhuma sala encontrada</h3>
          <p className="text-muted-foreground text-sm">
            {isProfessor ? 'Crie sua primeira sala de aula para começar.' : 'Entre em uma sala usando o código fornecido pelo professor.'}
          </p>
        </div>
      )}
    </div>
  );

  // ─── Detail View ─────────────────────────────
  const renderDetail = () => {
    if (!selectedClassroom) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => { setView('list'); setSelectedClassroomId(null); }} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">{selectedClassroom.name}</h2>
            <p className="text-xs text-muted-foreground">{selectedClassroom.university} · {selectedClassroom.year}º ano · {selectedClassroom.subject}</p>
          </div>
          <span className="text-xs font-mono text-teal-500 bg-teal-500/10 px-3 py-1 rounded-lg">{selectedClassroom.code}</span>
        </div>

        {/* Classroom Stats */}
        {analyticsData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-card rounded-xl p-3 border border-border text-center">
              <p className="text-xl font-bold text-foreground">{analyticsData.enrolledStudents}</p>
              <p className="text-[10px] text-muted-foreground">Alunos</p>
            </div>
            <div className="bg-card rounded-xl p-3 border border-border text-center">
              <p className="text-xl font-bold text-teal-500">{analyticsData.activeActivities}</p>
              <p className="text-[10px] text-muted-foreground">Ativas</p>
            </div>
            <div className="bg-card rounded-xl p-3 border border-border text-center">
              <p className="text-xl font-bold text-blue-500">{analyticsData.totalSubmissions}</p>
              <p className="text-[10px] text-muted-foreground">Submissões</p>
            </div>
            <div className="bg-card rounded-xl p-3 border border-border text-center">
              <p className="text-xl font-bold text-green-500">{analyticsData.completionRate}%</p>
              <p className="text-[10px] text-muted-foreground">Conclusão</p>
            </div>
          </div>
        )}

        {/* Activities */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-foreground">Atividades ({activitiesData?.length || 0})</h3>
            {isProfessor && (
              <button
                onClick={() => setView('createActivity')}
                className="text-xs text-teal-500 hover:text-teal-400 font-medium"
              >
                + Nova Atividade
              </button>
            )}
          </div>
          <div className="space-y-2">
            {activitiesData?.map(activity => (
              <div key={activity.id} className="bg-card rounded-xl border border-border p-4 hover:border-teal-500/30 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{getActivityIcon(activity.type)}</span>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{activity.title}</h4>
                      {activity.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getStatusColor(activity.status)}`}>
                          {getStatusLabel(activity.status)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Prazo: {formatDate(activity.dueDate)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {activity.points} pts
                        </span>
                      </div>
                    </div>
                  </div>
                  {isProfessor && activity.status === 'draft' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateActivityMutation.mutate({ id: activity.id, status: 'active' });
                      }}
                      className="text-[10px] px-2 py-1 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                    >
                      Ativar
                    </button>
                  )}
                </div>
              </div>
            ))}
            {(!activitiesData || activitiesData.length === 0) && (
              <div className="text-center py-8 bg-muted/50 rounded-xl">
                <p className="text-sm text-muted-foreground">Nenhuma atividade ainda.</p>
              </div>
            )}
          </div>
        </div>

        {/* Enrolled Students (Professor View) */}
        {isProfessor && enrollmentsData && enrollmentsData.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">Alunos Matriculados ({enrollmentsData.length})</h3>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-xs text-muted-foreground font-medium">Aluno</th>
                      <th className="text-center p-3 text-xs text-muted-foreground font-medium">Email</th>
                      <th className="text-center p-3 text-xs text-muted-foreground font-medium">Matriculado em</th>
                      <th className="text-right p-3 text-xs text-muted-foreground font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollmentsData.map((enrollment: any) => (
                      <tr key={enrollment.id} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-teal-500/20 flex items-center justify-center text-[10px] font-bold text-teal-500">
                              {enrollment.student?.name?.charAt(0) || '?'}
                            </div>
                            <span className="text-sm text-foreground font-medium">{enrollment.student?.name || 'Desconhecido'}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center text-xs text-muted-foreground">{enrollment.student?.email || '—'}</td>
                        <td className="p-3 text-center text-xs text-muted-foreground">{formatDate(enrollment.enrolledAt)}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => removeStudentMutation.mutate({ enrollmentId: enrollment.id })}
                            className="text-[10px] text-red-500 hover:text-red-400"
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* At-Risk Students Alert */}
        {isProfessor && analyticsData && analyticsData.atRiskStudents.length > 0 && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <h3 className="text-sm font-bold text-red-500 mb-2">Alunos em Risco ({analyticsData.atRiskStudents.length})</h3>
            <p className="text-xs text-muted-foreground mb-3">Alunos com média abaixo de 60% nas atividades avaliadas.</p>
            <div className="space-y-2">
              {analyticsData.atRiskStudents.map((student: any) => (
                <div key={student.id} className="flex items-center justify-between bg-card rounded-lg p-2 border border-border">
                  <span className="text-sm text-foreground">{student.name || student.email}</span>
                  <span className="text-xs font-medium text-red-500">{Math.round(student.avgScore)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── Join View ─────────────────────────────
  const renderJoin = () => (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setView('list')} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h2 className="text-lg font-bold text-foreground">Entrar em uma Sala</h2>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div className="text-center mb-4">
          <div className="text-4xl mb-3">🔑</div>
          <p className="text-sm text-muted-foreground">
            Digite o código fornecido pelo seu professor para entrar na sala de aula.
          </p>
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-medium">Código da Sala</label>
          <input
            type="text"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Ex: ABC123"
            className="w-full mt-1 px-4 py-3 bg-muted rounded-xl text-center text-lg font-mono text-foreground placeholder:text-muted-foreground border-0 focus:ring-2 focus:ring-teal-500 tracking-wider"
          />
        </div>

        <button
          onClick={() => joinMutation.mutate({ code: joinCode })}
          disabled={joinCode.length < 4 || joinMutation.isPending}
          className="w-full py-3 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {joinMutation.isPending ? 'Entrando...' : 'Entrar na Sala'}
        </button>
      </div>
    </div>
  );

  // ─── Create View (Professor only) ─────────────────────────────
  const renderCreate = () => (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setView('list')} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h2 className="text-lg font-bold text-foreground">Criar Nova Sala</h2>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground font-medium">Nome da Sala</label>
          <input
            type="text"
            value={newClassroom.name}
            onChange={e => setNewClassroom(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ex: Anatomia Humana - Turma A"
            className="w-full mt-1 px-4 py-2.5 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground border-0 focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground font-medium">Disciplina</label>
            <input
              type="text"
              value={newClassroom.subject}
              onChange={e => setNewClassroom(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Ex: Anatomia"
              className="w-full mt-1 px-4 py-2.5 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground border-0 focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium">Universidade</label>
            <input
              type="text"
              value={newClassroom.university}
              onChange={e => setNewClassroom(prev => ({ ...prev, university: e.target.value }))}
              placeholder="Ex: USP"
              className="w-full mt-1 px-4 py-2.5 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground border-0 focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-muted-foreground font-medium">Ano</label>
            <select
              value={newClassroom.year}
              onChange={e => setNewClassroom(prev => ({ ...prev, year: Number(e.target.value) }))}
              className="w-full mt-1 px-3 py-2.5 bg-muted rounded-xl text-sm text-foreground border-0 focus:ring-2 focus:ring-teal-500"
            >
              {[1,2,3,4,5,6].map(y => <option key={y} value={y}>{y}º ano</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium">Semestre</label>
            <select
              value={newClassroom.semester}
              onChange={e => setNewClassroom(prev => ({ ...prev, semester: Number(e.target.value) }))}
              className="w-full mt-1 px-3 py-2.5 bg-muted rounded-xl text-sm text-foreground border-0 focus:ring-2 focus:ring-teal-500"
            >
              <option value={1}>1º sem</option>
              <option value={2}>2º sem</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium">Máx. Alunos</label>
            <input
              type="number"
              value={newClassroom.maxStudents}
              onChange={e => setNewClassroom(prev => ({ ...prev, maxStudents: Number(e.target.value) }))}
              className="w-full mt-1 px-3 py-2.5 bg-muted rounded-xl text-sm text-foreground border-0 focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-medium">Descrição</label>
          <textarea
            value={newClassroom.description}
            onChange={e => setNewClassroom(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descreva a sala, objetivos e metodologia..."
            rows={3}
            className="w-full mt-1 px-4 py-2.5 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground border-0 focus:ring-2 focus:ring-teal-500 resize-none"
          />
        </div>

        <button
          onClick={() => createMutation.mutate(newClassroom)}
          disabled={!newClassroom.name || !newClassroom.subject || !newClassroom.university || createMutation.isPending}
          className="w-full py-3 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createMutation.isPending ? 'Criando...' : 'Criar Sala de Aula'}
        </button>

        <p className="text-[10px] text-muted-foreground text-center">
          Um código único será gerado automaticamente para compartilhar com seus alunos.
        </p>
      </div>
    </div>
  );

  // ─── Create Activity View ─────────────────────────────
  const renderCreateActivity = () => (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setView('detail')} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <h2 className="text-lg font-bold text-foreground">Nova Atividade</h2>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground font-medium">Título</label>
          <input
            type="text"
            value={newActivity.title}
            onChange={e => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Ex: Quiz - Sistema Esquelético"
            className="w-full mt-1 px-4 py-2.5 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground border-0 focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground font-medium">Tipo</label>
            <select
              value={newActivity.type}
              onChange={e => setNewActivity(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full mt-1 px-3 py-2.5 bg-muted rounded-xl text-sm text-foreground border-0 focus:ring-2 focus:ring-teal-500"
            >
              <option value="quiz">Quiz</option>
              <option value="flashcards">Flashcards</option>
              <option value="assignment">Trabalho</option>
              <option value="reading">Leitura</option>
              <option value="discussion">Discussão</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium">Pontuação</label>
            <input
              type="number"
              value={newActivity.points}
              onChange={e => setNewActivity(prev => ({ ...prev, points: Number(e.target.value) }))}
              className="w-full mt-1 px-3 py-2.5 bg-muted rounded-xl text-sm text-foreground border-0 focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-medium">Data de Entrega</label>
          <input
            type="date"
            value={newActivity.dueDate}
            onChange={e => setNewActivity(prev => ({ ...prev, dueDate: e.target.value }))}
            className="w-full mt-1 px-4 py-2.5 bg-muted rounded-xl text-sm text-foreground border-0 focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-medium">Descrição</label>
          <textarea
            value={newActivity.description}
            onChange={e => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descreva a atividade..."
            rows={3}
            className="w-full mt-1 px-4 py-2.5 bg-muted rounded-xl text-sm text-foreground placeholder:text-muted-foreground border-0 focus:ring-2 focus:ring-teal-500 resize-none"
          />
        </div>

        <button
          onClick={() => {
            if (!selectedClassroomId) return;
            createActivityMutation.mutate({
              classroomId: selectedClassroomId,
              title: newActivity.title,
              type: newActivity.type,
              description: newActivity.description || undefined,
              points: newActivity.points,
              dueDate: newActivity.dueDate ? new Date(newActivity.dueDate) : undefined,
            });
          }}
          disabled={!newActivity.title || createActivityMutation.isPending}
          className="w-full py-3 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createActivityMutation.isPending ? 'Criando...' : 'Criar Atividade'}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {view === 'list' && renderList()}
      {view === 'detail' && renderDetail()}
      {view === 'join' && renderJoin()}
      {view === 'create' && renderCreate()}
      {view === 'createActivity' && renderCreateActivity()}
    </div>
  );
};

export default ClassroomPanel;
