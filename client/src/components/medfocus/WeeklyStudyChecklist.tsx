
import React, { useState, useEffect } from 'react';
import { User } from '../../types';

interface WeeklyTask {
  id: string;
  subject: string;
  topic: string;
  day: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
}

interface WeeklyStudyChecklistProps {
  user: User;
}

const WeeklyStudyChecklist: React.FC<WeeklyStudyChecklistProps> = ({ user }) => {
  const storageKey = `medfocus_weekly_checklist_${user.email.replace(/[@.]/g, '_')}`;
  
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [newTask, setNewTask] = useState({ subject: '', topic: '', day: 'Segunda', priority: 'medium' as const, estimatedHours: 2 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(weeklyTasks));
  }, [weeklyTasks, storageKey]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.subject.trim() || !newTask.topic.trim()) return;

    const task: WeeklyTask = {
      id: Date.now().toString(),
      subject: newTask.subject,
      topic: newTask.topic,
      day: newTask.day,
      completed: false,
      priority: newTask.priority,
      estimatedHours: newTask.estimatedHours
    };

    setWeeklyTasks(prev => [task, ...prev]);
    setNewTask({ subject: '', topic: '', day: 'Segunda', priority: 'medium', estimatedHours: 2 });
    setIsModalOpen(false);
  };

  const toggleTask = (id: string) => {
    setWeeklyTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    if (confirm('Deseja excluir esta tarefa?')) {
      setWeeklyTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const getTasksByDay = (day: string) => weeklyTasks.filter(t => t.day === day);
  const completionRate = weeklyTasks.length > 0 ? Math.round((weeklyTasks.filter(t => t.completed).length / weeklyTasks.length) * 100) : 0;
  const totalHours = weeklyTasks.reduce((sum, t) => sum + (t.completed ? 0 : t.estimatedHours), 0);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300';
      case 'medium': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'low': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
      default: return '';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
            Checklist Semanal
          </h2>
          <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] mt-2">Planejamento Focado por Disciplina</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-[24px] font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all shadow-lg"
        >
          + Adicionar Tarefa
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-[32px] border border-indigo-100 dark:border-indigo-800">
          <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Taxa de Conclusão</p>
          <p className="text-4xl font-black text-indigo-700 dark:text-indigo-300 mt-2">{completionRate}%</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-8 rounded-[32px] border border-emerald-100 dark:border-emerald-800">
          <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Tarefas Pendentes</p>
          <p className="text-4xl font-black text-emerald-700 dark:text-emerald-300 mt-2">{weeklyTasks.filter(t => !t.completed).length}</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-8 rounded-[32px] border border-amber-100 dark:border-amber-800">
          <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Horas Restantes</p>
          <p className="text-4xl font-black text-amber-700 dark:text-amber-300 mt-2">{totalHours}h</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {days.map(day => {
          const dayTasks = getTasksByDay(day);
          return (
            <div key={day} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-6">{day}</h3>
              
              {dayTasks.length === 0 ? (
                <p className="text-slate-400 text-[12px] font-bold">Nenhuma tarefa agendada</p>
              ) : (
                <div className="space-y-3">
                  {dayTasks.map(task => (
                    <div key={task.id} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-[16px] border border-slate-100 dark:border-slate-700 hover:border-indigo-200 transition-all group">
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className={`w-6 h-6 rounded-[8px] border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
                          task.completed ? 'bg-indigo-600 border-indigo-600 shadow-lg' : 'border-slate-200 dark:border-slate-600 hover:border-indigo-400'
                        }`}
                      >
                        {task.completed && <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{task.estimatedHours}h</span>
                        </div>
                        <p className={`font-bold text-slate-900 dark:text-white ${task.completed ? 'line-through text-slate-400' : ''}`}>
                          {task.subject}
                        </p>
                        <p className={`text-[12px] text-slate-500 dark:text-slate-400 ${task.completed ? 'line-through' : ''}`}>
                          {task.topic}
                        </p>
                      </div>

                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-[8px] opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] shadow-2xl border border-slate-200 dark:border-slate-800 p-10 animate-in slide-in-from-bottom-8 duration-500">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-8">Adicionar Tarefa Semanal</h3>

            <form onSubmit={handleAddTask} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Disciplina</label>
                <input 
                  type="text"
                  value={newTask.subject}
                  onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                  placeholder="Ex: Anatomia Humana"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] outline-none focus:border-indigo-600 transition-all font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tópico</label>
                <input 
                  type="text"
                  value={newTask.topic}
                  onChange={(e) => setNewTask({ ...newTask, topic: e.target.value })}
                  placeholder="Ex: Ossos do Crânio"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] outline-none focus:border-indigo-600 transition-all font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Dia</label>
                  <select 
                    value={newTask.day}
                    onChange={(e) => setNewTask({ ...newTask, day: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] outline-none focus:border-indigo-600 transition-all font-bold"
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Prioridade</label>
                  <select 
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] outline-none focus:border-indigo-600 transition-all font-bold"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Horas Estimadas</label>
                <input 
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={newTask.estimatedHours}
                  onChange={(e) => setNewTask({ ...newTask, estimatedHours: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] outline-none focus:border-indigo-600 transition-all font-bold"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-[16px] font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-[16px] font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all shadow-lg"
                >
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
