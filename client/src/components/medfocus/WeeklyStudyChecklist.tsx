/**
 * MedFocus Weekly Study Checklist — Premium Design
 * Organized weekly study planner with priorities
 */
import React, { useState, useEffect } from 'react';
import { User } from '../../types';

interface WeeklyTask {
  id: string; subject: string; topic: string; day: string; completed: boolean; priority: 'high' | 'medium' | 'low'; estimatedHours: number;
}

interface Props { user: User; onChecklistComplete?: () => void; }

const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
  high: { label: 'Alta', color: 'text-rose-600', bg: 'bg-rose-500/10' },
  medium: { label: 'Média', color: 'text-amber-600', bg: 'bg-amber-500/10' },
  low: { label: 'Baixa', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
};

const WeeklyStudyChecklist: React.FC<Props> = ({ user, onChecklistComplete }) => {
  const storageKey = `medfocus_weekly_checklist_${user.email.replace(/[@.]/g, '_')}`;
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState({ subject: '', topic: '', day: 'Segunda', priority: 'medium' as const, estimatedHours: 2 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(weeklyTasks)); }, [weeklyTasks, storageKey]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.subject.trim() || !newTask.topic.trim()) return;
    const task: WeeklyTask = { id: Date.now().toString(), ...newTask, completed: false };
    setWeeklyTasks(prev => [task, ...prev]);
    setNewTask({ subject: '', topic: '', day: 'Segunda', priority: 'medium', estimatedHours: 2 });
    setIsModalOpen(false);
  };

  const toggleTask = (id: string) => {
    setWeeklyTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      const task = prev.find(t => t.id === id);
      // Award XP only when marking as completed (not unchecking)
      if (task && !task.completed && onChecklistComplete) {
        onChecklistComplete();
      }
      return updated;
    });
  };
  const deleteTask = (id: string) => setWeeklyTasks(prev => prev.filter(t => t.id !== id));

  const getTasksByDay = (day: string) => weeklyTasks.filter(t => t.day === day);
  const completionRate = weeklyTasks.length > 0 ? Math.round((weeklyTasks.filter(t => t.completed).length / weeklyTasks.length) * 100) : 0;
  const totalHours = weeklyTasks.reduce((sum, t) => sum + (t.completed ? 0 : t.estimatedHours), 0);
  const pendingCount = weeklyTasks.filter(t => !t.completed).length;

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-extrabold text-foreground tracking-tight">Checklist Semanal</h2>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">Planejamento focado por disciplina e dia</p>
        </div>
        <button onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14"/></svg>
          Nova Tarefa
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Conclusão</p>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-display font-extrabold text-primary">{completionRate}%</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }} />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Pendentes</p>
          <span className="text-2xl font-display font-extrabold text-amber-500 mt-1 block">{pendingCount}</span>
          <p className="text-[10px] text-muted-foreground mt-1">de {weeklyTasks.length} tarefas</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Horas Restantes</p>
          <span className="text-2xl font-display font-extrabold text-foreground mt-1 block">{totalHours}h</span>
          <p className="text-[10px] text-muted-foreground mt-1">para completar</p>
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {days.map(day => {
          const dayTasks = getTasksByDay(day);
          const dayCompleted = dayTasks.filter(t => t.completed).length;
          return (
            <div key={day} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-display font-bold text-foreground text-sm">{day}</h3>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {dayCompleted}/{dayTasks.length}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3">
                {dayTasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground/60 text-center py-4 font-medium">Nenhuma tarefa</p>
                ) : (
                  <div className="space-y-2">
                    {dayTasks.map(task => (
                      <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-all group ${
                        task.completed ? 'bg-muted/30 border-border/50' : 'bg-card border-border hover:border-primary/30'
                      }`}>
                        <button onClick={() => toggleTask(task.id)}
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                            task.completed ? 'bg-primary border-primary' : 'border-border hover:border-primary'
                          }`}>
                          {task.completed && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${priorityConfig[task.priority].bg} ${priorityConfig[task.priority].color}`}>
                              {priorityConfig[task.priority].label}
                            </span>
                            <span className="text-[9px] font-semibold text-muted-foreground">{task.estimatedHours}h</span>
                          </div>
                          <p className={`text-sm font-semibold leading-tight ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.subject}</p>
                          <p className={`text-xs mt-0.5 ${task.completed ? 'line-through text-muted-foreground/60' : 'text-muted-foreground'}`}>{task.topic}</p>
                        </div>
                        <button onClick={() => deleteTask(task.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md opacity-0 group-hover:opacity-100 transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div className="bg-card w-full max-w-md rounded-xl shadow-2xl border border-border p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="font-display font-bold text-foreground text-lg mb-5">Nova Tarefa Semanal</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Disciplina</label>
                <input type="text" value={newTask.subject} onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                  placeholder="Ex: Anatomia Humana"
                  className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg outline-none text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Tópico</label>
                <input type="text" value={newTask.topic} onChange={(e) => setNewTask({ ...newTask, topic: e.target.value })}
                  placeholder="Ex: Ossos do Crânio"
                  className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg outline-none text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Dia</label>
                  <select value={newTask.day} onChange={(e) => setNewTask({ ...newTask, day: e.target.value })}
                    className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-lg outline-none text-sm font-medium focus:border-primary transition-all">
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Prioridade</label>
                  <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-lg outline-none text-sm font-medium focus:border-primary transition-all">
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Horas</label>
                  <input type="number" min="0.5" step="0.5" value={newTask.estimatedHours}
                    onChange={(e) => setNewTask({ ...newTask, estimatedHours: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-lg outline-none text-sm font-medium focus:border-primary transition-all" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-border text-muted-foreground rounded-lg text-sm font-semibold hover:bg-muted transition-all">
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-all">
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyStudyChecklist;
