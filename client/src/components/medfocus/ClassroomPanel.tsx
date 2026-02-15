/**
 * ClassroomPanel - Controle de Salas e Atividades por Professores
 * 
 * Permite professores criarem salas de aula virtuais, atribuírem atividades,
 * acompanharem o progresso dos alunos e gerenciarem turmas.
 * Alunos podem entrar em salas via código, ver atividades e acompanhar seu progresso.
 */
import React, { useState, useMemo } from 'react';
import { User } from '../../types';

interface ClassroomPanelProps {
  user: User;
}

interface Classroom {
  id: string;
  name: string;
  code: string;
  professor: string;
  subject: string;
  year: number;
  semester: number;
  university: string;
  description: string;
  students: number;
  maxStudents: number;
  activities: Activity[];
  createdAt: number;
  isActive: boolean;
}

interface Activity {
  id: string;
  title: string;
  type: 'quiz' | 'flashcards' | 'assignment' | 'reading' | 'discussion';
  description: string;
  dueDate: number;
  points: number;
  status: 'pending' | 'active' | 'completed' | 'overdue';
  completedBy: number; // percentage
  attachments?: string[];
}

interface StudentProgress {
  studentName: string;
  activitiesCompleted: number;
  totalActivities: number;
  averageScore: number;
  streak: number;
  lastActive: number;
  xpEarned: number;
}

type PanelView = 'list' | 'create' | 'detail' | 'join' | 'activity';

const MOCK_CLASSROOMS: Classroom[] = [
  {
    id: 'sala_1',
    name: 'Anatomia Humana - Turma A',
    code: 'MED-ANA-2026A',
    professor: 'Prof. Dr. Carlos Silva',
    subject: 'Anatomia',
    year: 1,
    semester: 1,
    university: 'USP',
    description: 'Turma de Anatomia Humana do 1º ano de Medicina. Inclui aulas teóricas, práticas em laboratório e avaliações semanais.',
    students: 45,
    maxStudents: 60,
    activities: [
      { id: 'a1', title: 'Quiz: Sistema Esquelético', type: 'quiz', description: 'Avaliação sobre ossos do membro superior e inferior', dueDate: Date.now() + 3 * 24 * 60 * 60 * 1000, points: 100, status: 'active', completedBy: 62 },
      { id: 'a2', title: 'Flashcards: Músculos do Tronco', type: 'flashcards', description: 'Revisão dos principais músculos do tronco com origem, inserção e ação', dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000, points: 50, status: 'active', completedBy: 35 },
      { id: 'a3', title: 'Leitura: Netter Cap. 4-6', type: 'reading', description: 'Leitura dos capítulos 4 a 6 do Atlas de Anatomia Humana (Netter)', dueDate: Date.now() + 5 * 24 * 60 * 60 * 1000, points: 30, status: 'pending', completedBy: 18 },
      { id: 'a4', title: 'Discussão: Caso Clínico - Fratura de Fêmur', type: 'discussion', description: 'Análise de caso clínico correlacionando anatomia com a clínica', dueDate: Date.now() - 1 * 24 * 60 * 60 * 1000, points: 80, status: 'completed', completedBy: 89 },
    ],
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    isActive: true,
  },
  {
    id: 'sala_2',
    name: 'Fisiologia Cardiovascular - Turma B',
    code: 'MED-FIS-2026B',
    professor: 'Profa. Dra. Ana Martins',
    subject: 'Fisiologia',
    year: 2,
    semester: 1,
    university: 'UNICAMP',
    description: 'Estudo aprofundado do sistema cardiovascular: hemodinâmica, eletrofisiologia cardíaca e regulação da pressão arterial.',
    students: 38,
    maxStudents: 50,
    activities: [
      { id: 'b1', title: 'Quiz: Ciclo Cardíaco', type: 'quiz', description: 'Avaliação sobre as fases do ciclo cardíaco e curvas de pressão-volume', dueDate: Date.now() + 2 * 24 * 60 * 60 * 1000, points: 100, status: 'active', completedBy: 45 },
      { id: 'b2', title: 'Trabalho: Regulação da PA', type: 'assignment', description: 'Trabalho escrito sobre mecanismos de regulação da pressão arterial', dueDate: Date.now() + 14 * 24 * 60 * 60 * 1000, points: 200, status: 'pending', completedBy: 5 },
    ],
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    isActive: true,
  },
  {
    id: 'sala_3',
    name: 'Clínica Médica I - Turma A',
    code: 'MED-CLI-2026A',
    professor: 'Prof. Dr. Roberto Almeida',
    subject: 'Clínica Médica',
    year: 4,
    semester: 1,
    university: 'UFMG',
    description: 'Introdução à semiologia e propedêutica médica. Anamnese, exame físico e raciocínio clínico.',
    students: 52,
    maxStudents: 60,
    activities: [
      { id: 'c1', title: 'Caso Clínico: Dor Torácica', type: 'discussion', description: 'Discussão de caso clínico de paciente com dor torácica aguda', dueDate: Date.now() + 1 * 24 * 60 * 60 * 1000, points: 150, status: 'active', completedBy: 70 },
      { id: 'c2', title: 'Quiz: Semiologia Cardíaca', type: 'quiz', description: 'Avaliação sobre ausculta cardíaca e sopros', dueDate: Date.now() + 4 * 24 * 60 * 60 * 1000, points: 100, status: 'active', completedBy: 28 },
    ],
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    isActive: true,
  },
];

const MOCK_STUDENTS: StudentProgress[] = [
  { studentName: 'Maria Oliveira', activitiesCompleted: 12, totalActivities: 15, averageScore: 87, streak: 5, lastActive: Date.now() - 2 * 60 * 60 * 1000, xpEarned: 2450 },
  { studentName: 'João Santos', activitiesCompleted: 14, totalActivities: 15, averageScore: 92, streak: 12, lastActive: Date.now() - 30 * 60 * 1000, xpEarned: 3100 },
  { studentName: 'Ana Costa', activitiesCompleted: 10, totalActivities: 15, averageScore: 78, streak: 3, lastActive: Date.now() - 24 * 60 * 60 * 1000, xpEarned: 1890 },
  { studentName: 'Pedro Lima', activitiesCompleted: 15, totalActivities: 15, averageScore: 95, streak: 15, lastActive: Date.now() - 1 * 60 * 60 * 1000, xpEarned: 3650 },
  { studentName: 'Carla Souza', activitiesCompleted: 8, totalActivities: 15, averageScore: 72, streak: 0, lastActive: Date.now() - 3 * 24 * 60 * 60 * 1000, xpEarned: 1420 },
  { studentName: 'Lucas Ferreira', activitiesCompleted: 11, totalActivities: 15, averageScore: 84, streak: 7, lastActive: Date.now() - 5 * 60 * 60 * 1000, xpEarned: 2200 },
];

const ClassroomPanel: React.FC<ClassroomPanelProps> = ({ user }) => {
  const [view, setView] = useState<PanelView>('list');
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newClassroom, setNewClassroom] = useState({
    name: '', subject: '', year: 1, semester: 1, university: '', description: '', maxStudents: 60,
  });

  const isProfessor = user.role === 'admin' || user.role === 'professor';

  const filteredClassrooms = useMemo(() => {
    return MOCK_CLASSROOMS.filter(c => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return c.name.toLowerCase().includes(term) || c.subject.toLowerCase().includes(term) || c.professor.toLowerCase().includes(term);
      }
      return true;
    });
  }, [searchTerm]);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'quiz': return '❓';
      case 'flashcards': return '🃏';
      case 'assignment': return '📝';
      case 'reading': return '📖';
      case 'discussion': return '💬';
    }
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'active': return 'bg-teal-500/10 text-teal-500';
      case 'pending': return 'bg-blue-500/10 text-blue-500';
      case 'completed': return 'bg-green-500/10 text-green-500';
      case 'overdue': return 'bg-red-500/10 text-red-500';
    }
  };

  const getStatusLabel = (status: Activity['status']) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'pending': return 'Pendente';
      case 'completed': return 'Concluída';
      case 'overdue': return 'Atrasada';
    }
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const formatTimeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const hours = Math.floor(diff / (60 * 60 * 1000));
    if (hours < 1) return 'Agora';
    if (hours < 24) return `${hours}h atrás`;
    return `${Math.floor(hours / 24)}d atrás`;
  };

  // List View
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
          <p className="text-2xl font-bold text-foreground">{filteredClassrooms.length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">Atividades Ativas</p>
          <p className="text-2xl font-bold text-teal-500">
            {filteredClassrooms.reduce((sum, c) => sum + c.activities.filter(a => a.status === 'active').length, 0)}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">Total Alunos</p>
          <p className="text-2xl font-bold text-blue-500">
            {filteredClassrooms.reduce((sum, c) => sum + c.students, 0)}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">Média Conclusão</p>
          <p className="text-2xl font-bold text-green-500">
            {Math.round(filteredClassrooms.reduce((sum, c) => sum + c.activities.reduce((s, a) => s + a.completedBy, 0) / Math.max(c.activities.length, 1), 0) / Math.max(filteredClassrooms.length, 1))}%
          </p>
        </div>
      </div>

      {/* Classroom Cards */}
      <div className="space-y-3">
        {filteredClassrooms.map(classroom => (
          <div
            key={classroom.id}
            onClick={() => { setSelectedClassroom(classroom); setView('detail'); }}
            className="bg-card rounded-xl border border-border p-4 hover:border-teal-500/30 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-foreground">{classroom.name}</h3>
                  {classroom.isActive && (
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{classroom.professor} · {classroom.university}</p>
                <p className="text-xs text-muted-foreground mt-1">{classroom.description.slice(0, 100)}...</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-mono text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded">{classroom.code}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{classroom.students}/{classroom.maxStudents} alunos</p>
              </div>
            </div>

            {/* Activity Summary */}
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
              {classroom.activities.filter(a => a.status === 'active').slice(0, 3).map(activity => (
                <span key={activity.id} className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                  {getActivityIcon(activity.type)} {activity.title.slice(0, 25)}...
                </span>
              ))}
              {classroom.activities.filter(a => a.status === 'active').length > 3 && (
                <span className="text-[10px] text-muted-foreground">
                  +{classroom.activities.filter(a => a.status === 'active').length - 3} mais
                </span>
              )}
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

  // Detail View
  const renderDetail = () => {
    if (!selectedClassroom) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => { setView('list'); setSelectedClassroom(null); }} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">{selectedClassroom.name}</h2>
            <p className="text-xs text-muted-foreground">{selectedClassroom.professor} · {selectedClassroom.university} · {selectedClassroom.year}º ano</p>
          </div>
          <span className="text-xs font-mono text-teal-500 bg-teal-500/10 px-3 py-1 rounded-lg">{selectedClassroom.code}</span>
        </div>

        {/* Classroom Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-3 border border-border text-center">
            <p className="text-xl font-bold text-foreground">{selectedClassroom.students}</p>
            <p className="text-[10px] text-muted-foreground">Alunos</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border text-center">
            <p className="text-xl font-bold text-teal-500">{selectedClassroom.activities.filter(a => a.status === 'active').length}</p>
            <p className="text-[10px] text-muted-foreground">Ativas</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border text-center">
            <p className="text-xl font-bold text-green-500">
              {Math.round(selectedClassroom.activities.reduce((s, a) => s + a.completedBy, 0) / Math.max(selectedClassroom.activities.length, 1))}%
            </p>
            <p className="text-[10px] text-muted-foreground">Conclusão</p>
          </div>
        </div>

        {/* Activities */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-foreground">Atividades</h3>
            {isProfessor && (
              <button className="text-xs text-teal-500 hover:text-teal-400 font-medium">
                + Nova Atividade
              </button>
            )}
          </div>
          <div className="space-y-2">
            {selectedClassroom.activities.map(activity => (
              <div key={activity.id} className="bg-card rounded-xl border border-border p-4 hover:border-teal-500/30 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{getActivityIcon(activity.type)}</span>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{activity.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
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
                  <div className="text-right shrink-0">
                    <div className="w-12 h-12 rounded-full border-2 border-teal-500/30 flex items-center justify-center">
                      <span className="text-xs font-bold text-teal-500">{activity.completedBy}%</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${activity.completedBy}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Progress (Professor View) */}
        {isProfessor && (
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">Progresso dos Alunos</h3>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-xs text-muted-foreground font-medium">Aluno</th>
                      <th className="text-center p-3 text-xs text-muted-foreground font-medium">Atividades</th>
                      <th className="text-center p-3 text-xs text-muted-foreground font-medium">Média</th>
                      <th className="text-center p-3 text-xs text-muted-foreground font-medium">Streak</th>
                      <th className="text-center p-3 text-xs text-muted-foreground font-medium">XP</th>
                      <th className="text-right p-3 text-xs text-muted-foreground font-medium">Último Acesso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_STUDENTS.map((student, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-teal-500/20 flex items-center justify-center text-[10px] font-bold text-teal-500">
                              {student.studentName.charAt(0)}
                            </div>
                            <span className="text-sm text-foreground font-medium">{student.studentName}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-sm text-foreground">{student.activitiesCompleted}/{student.totalActivities}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`text-sm font-medium ${student.averageScore >= 80 ? 'text-green-500' : student.averageScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {student.averageScore}%
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-sm text-foreground">{student.streak} 🔥</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-sm text-teal-500 font-medium">{student.xpEarned.toLocaleString()}</span>
                        </td>
                        <td className="p-3 text-right">
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(student.lastActive)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Join View
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
            placeholder="MED-XXX-0000X"
            className="w-full mt-1 px-4 py-3 bg-muted rounded-xl text-center text-lg font-mono text-foreground placeholder:text-muted-foreground border-0 focus:ring-2 focus:ring-teal-500 tracking-wider"
          />
        </div>

        <button
          onClick={() => {
            // Find classroom by code
            const found = MOCK_CLASSROOMS.find(c => c.code === joinCode);
            if (found) {
              setSelectedClassroom(found);
              setView('detail');
              setJoinCode('');
            }
          }}
          disabled={joinCode.length < 5}
          className="w-full py-3 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Entrar na Sala
        </button>

        {joinCode.length >= 5 && !MOCK_CLASSROOMS.find(c => c.code === joinCode) && (
          <p className="text-xs text-red-500 text-center">Código não encontrado. Verifique com seu professor.</p>
        )}
      </div>

      {/* Quick Access */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="text-sm font-bold text-foreground mb-3">Salas Disponíveis</h3>
        <div className="space-y-2">
          {MOCK_CLASSROOMS.slice(0, 3).map(c => (
            <button
              key={c.id}
              onClick={() => { setSelectedClassroom(c); setView('detail'); }}
              className="w-full flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-left"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">{c.professor} · {c.university}</p>
              </div>
              <span className="text-[10px] font-mono text-teal-500">{c.code}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Create View (Professor only)
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
          onClick={() => setView('list')}
          disabled={!newClassroom.name || !newClassroom.subject}
          className="w-full py-3 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Criar Sala de Aula
        </button>

        <p className="text-[10px] text-muted-foreground text-center">
          Um código único será gerado automaticamente para compartilhar com seus alunos.
        </p>
      </div>
    </div>
  );

  return (
    <div>
      {view === 'list' && renderList()}
      {view === 'detail' && renderDetail()}
      {view === 'join' && renderJoin()}
      {view === 'create' && renderCreate()}
    </div>
  );
};

export default ClassroomPanel;
