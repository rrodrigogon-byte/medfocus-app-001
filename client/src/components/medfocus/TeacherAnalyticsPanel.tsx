/**
 * TeacherAnalyticsPanel - Painel de Analytics para Professores
 * 
 * Gráficos de desempenho por turma, taxa de conclusão de atividades
 * e alertas de alunos em risco. Conectado ao banco via tRPC.
 */
import React, { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';

const TeacherAnalyticsPanel: React.FC = () => {
  const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(null);

  // Fetch all classrooms for the professor
  const { data: classroomsData, isLoading: loadingClassrooms, isError: classroomsError } = trpc.classroom.myClassrooms.useQuery(undefined, { retry: false });

  // Fetch analytics for selected classroom
  const { data: analytics, isLoading: loadingAnalytics } = trpc.classroom.analytics.useQuery(
    { classroomId: selectedClassroomId! },
    { enabled: !!selectedClassroomId }
  );

  // Fetch activities for selected classroom
  const { data: activitiesData } = trpc.classroom.activities.useQuery(
    { classroomId: selectedClassroomId! },
    { enabled: !!selectedClassroomId }
  );

  // Fetch enrollments for selected classroom
  const { data: enrollmentsData } = trpc.classroom.enrollments.useQuery(
    { classroomId: selectedClassroomId! },
    { enabled: !!selectedClassroomId }
  );

  const professorClassrooms = classroomsData?.asProfessor || [];

  // Auto-select first classroom
  React.useEffect(() => {
    if (professorClassrooms.length > 0 && !selectedClassroomId) {
      setSelectedClassroomId(professorClassrooms[0].id);
    }
  }, [professorClassrooms, selectedClassroomId]);

  // Activity type distribution
  const activityTypeDistribution = useMemo(() => {
    if (!activitiesData) return [];
    const counts: Record<string, number> = {};
    activitiesData.forEach(a => {
      counts[a.type] = (counts[a.type] || 0) + 1;
    });
    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  }, [activitiesData]);

  // Activity status distribution
  const activityStatusDistribution = useMemo(() => {
    if (!activitiesData) return [];
    const counts: Record<string, number> = {};
    activitiesData.forEach(a => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [activitiesData]);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      quiz: 'Quiz', flashcards: 'Flashcards', assignment: 'Trabalho',
      reading: 'Leitura', discussion: 'Discussão',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      quiz: '#14b8a6', flashcards: '#3b82f6', assignment: '#f59e0b',
      reading: '#8b5cf6', discussion: '#ec4899',
    };
    return colors[type] || '#6b7280';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Ativa', draft: 'Rascunho', completed: 'Concluída', archived: 'Arquivada',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: '#14b8a6', draft: '#3b82f6', completed: '#22c55e', archived: '#6b7280',
    };
    return colors[status] || '#6b7280';
  };

  // Loading state
  if (loadingClassrooms && !classroomsError) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  // No classrooms or auth error
  if (classroomsError || professorClassrooms.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-xl border border-border">
        <div className="text-5xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-foreground mb-2">Analytics de Turma</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
          {classroomsError ? 'Faça login com sua conta de professor para acessar os analytics das suas turmas.' : 'Crie uma sala de aula na seção "Sala de Aula" para começar a acompanhar o desempenho dos seus alunos.'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-6">
          <div className="bg-muted/50 rounded-xl p-4 border border-border">
            <div className="text-2xl mb-2">👥</div>
            <h4 className="text-sm font-bold text-foreground">Gestão de Turmas</h4>
            <p className="text-xs text-muted-foreground mt-1">Acompanhe o progresso de cada aluno em tempo real</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 border border-border">
            <div className="text-2xl mb-2">📈</div>
            <h4 className="text-sm font-bold text-foreground">Métricas Detalhadas</h4>
            <p className="text-xs text-muted-foreground mt-1">Taxa de conclusão, médias e distribuição por atividade</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 border border-border">
            <div className="text-2xl mb-2">⚠️</div>
            <h4 className="text-sm font-bold text-foreground">Alertas de Risco</h4>
            <p className="text-xs text-muted-foreground mt-1">Identifique alunos com desempenho abaixo do esperado</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedClassroom = professorClassrooms.find(c => c.id === selectedClassroomId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Analytics de Turma</h2>
          <p className="text-sm text-muted-foreground">Acompanhe o desempenho e identifique alunos em risco</p>
        </div>
        <select
          value={selectedClassroomId || ''}
          onChange={e => setSelectedClassroomId(Number(e.target.value))}
          className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-teal-500 min-w-[240px]"
        >
          {professorClassrooms.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Loading analytics */}
      {loadingAnalytics && (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {analytics && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <KPICard label="Alunos" value={analytics.enrolledStudents} color="text-foreground" />
            <KPICard label="Atividades" value={analytics.totalActivities} color="text-teal-500" />
            <KPICard label="Ativas" value={analytics.activeActivities} color="text-blue-500" />
            <KPICard label="Submissões" value={analytics.totalSubmissions} color="text-purple-500" />
            <KPICard label="Avaliadas" value={analytics.gradedSubmissions} color="text-amber-500" />
            <KPICard label="Conclusão" value={`${analytics.completionRate}%`} color="text-green-500" />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Completion Rate Gauge */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-sm font-bold text-foreground mb-4">Taxa de Conclusão</h3>
              <div className="flex items-center justify-center py-4">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
                    <circle
                      cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                      className="text-teal-500"
                      strokeDasharray={`${analytics.completionRate * 2.64} ${264 - analytics.completionRate * 2.64}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-foreground">{analytics.completionRate}%</span>
                      <p className="text-[10px] text-muted-foreground">conclusão</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="text-center p-2 bg-muted rounded-lg">
                  <p className="text-lg font-bold text-foreground">{analytics.avgScore}</p>
                  <p className="text-[10px] text-muted-foreground">Média Geral</p>
                </div>
                <div className="text-center p-2 bg-muted rounded-lg">
                  <p className="text-lg font-bold text-foreground">{analytics.gradedSubmissions}/{analytics.totalSubmissions}</p>
                  <p className="text-[10px] text-muted-foreground">Avaliadas</p>
                </div>
              </div>
            </div>

            {/* Activity Type Distribution */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-sm font-bold text-foreground mb-4">Distribuição por Tipo de Atividade</h3>
              {activityTypeDistribution.length > 0 ? (
                <div className="space-y-3">
                  {activityTypeDistribution.map(({ type, count }) => {
                    const total = activitiesData?.length || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-foreground">{getTypeLabel(type)}</span>
                          <span className="text-xs text-muted-foreground">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: getTypeColor(type) }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">Nenhuma atividade criada.</div>
              )}

              {/* Status breakdown */}
              {activityStatusDistribution.length > 0 && (
                <div className="mt-6 pt-4 border-t border-border">
                  <h4 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {activityStatusDistribution.map(({ status, count }) => (
                      <span
                        key={status}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                        style={{ backgroundColor: `${getStatusColor(status)}15`, color: getStatusColor(status) }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getStatusColor(status) }} />
                        {getStatusLabel(status)}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activities Detail Table */}
          {activitiesData && activitiesData.length > 0 && (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-bold text-foreground">Detalhes das Atividades</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-3 text-xs text-muted-foreground font-medium">Atividade</th>
                      <th className="text-center p-3 text-xs text-muted-foreground font-medium">Tipo</th>
                      <th className="text-center p-3 text-xs text-muted-foreground font-medium">Status</th>
                      <th className="text-center p-3 text-xs text-muted-foreground font-medium">Pontos</th>
                      <th className="text-center p-3 text-xs text-muted-foreground font-medium">Prazo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activitiesData.map(activity => (
                      <tr key={activity.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{getActivityIcon(activity.type)}</span>
                            <div>
                              <p className="text-sm font-medium text-foreground">{activity.title}</p>
                              {activity.description && (
                                <p className="text-[10px] text-muted-foreground line-clamp-1">{activity.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${getTypeColor(activity.type)}15`, color: getTypeColor(activity.type) }}>
                            {getTypeLabel(activity.type)}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${getStatusColor(activity.status)}15`, color: getStatusColor(activity.status) }}>
                            {getStatusLabel(activity.status)}
                          </span>
                        </td>
                        <td className="p-3 text-center text-xs text-foreground">{activity.points} pts</td>
                        <td className="p-3 text-center text-xs text-muted-foreground">
                          {activity.dueDate ? new Date(activity.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* At-Risk Students Alert */}
          {analytics.atRiskStudents.length > 0 && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-red-500">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-500">Alunos em Risco ({analytics.atRiskStudents.length})</h3>
                  <p className="text-xs text-muted-foreground">Alunos com média abaixo de 60% nas atividades avaliadas</p>
                </div>
              </div>
              <div className="space-y-2">
                {analytics.atRiskStudents.map((student: any) => (
                  <div key={student.id} className="flex items-center justify-between bg-card rounded-xl p-3 border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-xs font-bold text-red-500">
                        {(student.name || student.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{student.name || 'Sem nome'}</p>
                        <p className="text-[10px] text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-500">{Math.round(student.avgScore)}%</p>
                      <p className="text-[10px] text-muted-foreground">média</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No at-risk students */}
          {analytics.atRiskStudents.length === 0 && analytics.gradedSubmissions > 0 && (
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-green-500">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-green-500">Todos os alunos estão bem!</h3>
                  <p className="text-xs text-muted-foreground">Nenhum aluno com média abaixo de 60% foi identificado.</p>
                </div>
              </div>
            </div>
          )}

          {/* Enrolled Students */}
          {enrollmentsData && enrollmentsData.length > 0 && (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-bold text-foreground">Alunos Matriculados ({enrollmentsData.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-3 text-xs text-muted-foreground font-medium">Aluno</th>
                      <th className="text-center p-3 text-xs text-muted-foreground font-medium">Email</th>
                      <th className="text-center p-3 text-xs text-muted-foreground font-medium">Matriculado em</th>
                      <th className="text-center p-3 text-xs text-muted-foreground font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollmentsData.map((enrollment: any) => {
                      const isAtRisk = analytics.atRiskStudents.some((s: any) => s.id === enrollment.studentId);
                      return (
                        <tr key={enrollment.id} className={`border-b border-border/50 hover:bg-muted/30 ${isAtRisk ? 'bg-red-500/5' : ''}`}>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${isAtRisk ? 'bg-red-500/20 text-red-500' : 'bg-teal-500/20 text-teal-500'}`}>
                                {(enrollment.student?.name || '?').charAt(0)}
                              </div>
                              <span className="text-sm text-foreground font-medium">{enrollment.student?.name || 'Desconhecido'}</span>
                              {isAtRisk && <span className="text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-500 rounded font-medium">EM RISCO</span>}
                            </div>
                          </td>
                          <td className="p-3 text-center text-xs text-muted-foreground">{enrollment.student?.email || '—'}</td>
                          <td className="p-3 text-center text-xs text-muted-foreground">
                            {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString('pt-BR') : '—'}
                          </td>
                          <td className="p-3 text-center">
                            <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-500 rounded font-medium">
                              {enrollment.status || 'active'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── Helper Components ─────────────────────────────

function KPICard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function getActivityIcon(type: string) {
  const icons: Record<string, string> = {
    quiz: '❓', flashcards: '🃏', assignment: '📝', reading: '📖', discussion: '💬',
  };
  return icons[type] || '📋';
}

export default TeacherAnalyticsPanel;
