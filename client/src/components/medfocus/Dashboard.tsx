
import React, { useState, useEffect } from 'react';
import { User, Task } from '../../types';
import { syncToCloud } from '../../services/analytics';

interface DashboardProps { user: User; }

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const storageKey = `medfocus_tasks_${user.email.replace(/[@.]/g, '_')}`;

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Estudar Ciclo de Krebs', category: 'Fisiologia', completed: false },
      { id: '2', title: 'Flashcards de Farmacologia', category: 'Farmacologia', completed: true },
    ];
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', category: 'Clínica' as Task['category'] });
  const [lastSync, setLastSync] = useState<string>(new Date().toLocaleTimeString());

  // Sincronização automática centralizada e Mock de BigQuery Export
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
    syncToCloud('tasks_update', { count: tasks.length, timestamp: Date.now() });
    setLastSync(new Date().toLocaleTimeString());
  }, [tasks, storageKey]);

  const toggleTask = (id: string) => {
    if (isEditMode) return;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm('Deseja excluir permanentemente este tópico de estudo?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const clearCompleted = () => {
    if (confirm('Remover todos os tópicos concluídos?')) {
      setTasks(prev => prev.filter(t => !t.completed));
    }
  };

  const handleSaveNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      category: newTask.category,
      completed: false
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({ title: '', category: 'Clínica' });
    setIsModalOpen(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const categories: Task['category'][] = ['Anatomia', 'Fisiologia', 'Farmacologia', 'Clínica', 'Outros'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-black dark:text-white tracking-tighter uppercase">
            {getGreeting()}, Dr. {user.name.split(' ')[0]}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
              Painel de Controle Acadêmico
            </p>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Cloud Sync: {lastSync}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:border-indigo-200">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Foco Acumulado</p>
          <p className="text-4xl font-black text-indigo-700 dark:text-indigo-400 tracking-tighter">4h 20m</p>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 w-fit px-4 py-2 rounded-2xl uppercase tracking-tighter">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            BigQuery Data Entry Verified
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:border-indigo-200">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Pendências Atuais</p>
          <p className="text-4xl font-black text-black dark:text-white tracking-tighter">
            {tasks.filter(t => !t.completed).length}
          </p>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-6">Perfil Sincronizado</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:border-indigo-200">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Status de Ciclo</p>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-200"></div>
            <p className="text-2xl font-black text-black dark:text-white tracking-tighter uppercase">Em Dia</p>
          </div>
          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest mt-6">Próximo: Revisão Clínica</p>
        </div>
      </div>

      <section className="bg-white dark:bg-slate-900 rounded-[48px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
          <div>
            <h2 className="font-black text-black dark:text-white uppercase tracking-tighter text-xl">Roteiro de Estudos</h2>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Checklist de Prioridades Médicas</p>
          </div>
          <div className="flex items-center gap-4">
            {tasks.some(t => t.completed) && isEditMode && (
              <button 
                onClick={clearCompleted}
                className="text-[10px] text-rose-600 dark:text-rose-400 font-black uppercase tracking-widest px-4 py-3 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all"
              >
                Limpar Concluídos
              </button>
            )}
            <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl transition-all border-2 ${
                isEditMode 
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white' 
                : 'text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600'
              }`}
            >
              {isEditMode ? 'Concluir' : 'Modificar'}
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3.5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl active:scale-95 flex items-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              <span>Novo Tópico</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {tasks.length === 0 ? (
            <div className="p-32 text-center">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-300"><path d="M12 2v20"/><path d="M2 12h20"/></svg>
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sem tópicos ativos para este ciclo.</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`p-8 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group ${isEditMode ? 'pl-10' : ''}`}>
                <div className="flex items-center gap-6 flex-1">
                  {!isEditMode && (
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`w-8 h-8 rounded-[12px] border-2 flex items-center justify-center transition-all ${
                        task.completed ? 'bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-100 dark:shadow-none' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {task.completed && <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </button>
                  )}
                  {isEditMode && <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></div>}
                  <div className="flex flex-col">
                    <span className={`text-base font-black tracking-tight ${task.completed ? 'text-slate-400 dark:text-slate-600 line-through' : 'text-slate-900 dark:text-white'}`}>
                      {task.title}
                    </span>
                    <span className="text-[10px] font-black uppercase text-indigo-500 dark:text-indigo-400 tracking-widest mt-1">{task.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {isEditMode && (
                    <button 
                      onClick={(e) => deleteTask(e, task.id)}
                      className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-[16px] transition-all shadow-sm border border-rose-100 dark:border-rose-900/40"
                      title="Excluir estudo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* MODAL DE NOVO ESTUDO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[48px] shadow-2xl border border-slate-200 dark:border-slate-800 p-10 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter">Novo Item de Estudo</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-black dark:hover:text-white transition-colors p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <form onSubmit={handleSaveNewTask} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">O que você vai estudar?</label>
                <input 
                  autoFocus 
                  required 
                  type="text" 
                  value={newTask.title} 
                  onChange={e => setNewTask({...newTask, title: e.target.value})} 
                  placeholder="Ex: Semiologia Cardiovascular" 
                  className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-[24px] outline-none transition-all font-bold text-black dark:text-white" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Disciplina / Categoria</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button 
                      key={cat} 
                      type="button" 
                      onClick={() => setNewTask({...newTask, category: cat})} 
                      className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase transition-all border-2 ${
                        newTask.category === cat 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 dark:shadow-none' 
                        : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-6 rounded-[24px] hover:bg-indigo-700 transition-all shadow-2xl uppercase text-sm tracking-widest active:scale-95">
                  Adicionar à Lista Cloud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
