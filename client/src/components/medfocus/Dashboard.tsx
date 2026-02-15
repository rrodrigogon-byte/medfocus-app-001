/**
 * MedFocus Dashboard — Premium Design
 * Hero banner with generated image, metric cards with depth, modern task list
 */
import React, { useState, useEffect } from 'react';
import { User, Task } from '../../types';
import { syncToCloud } from '../../services/analytics';

const DASHBOARD_HERO = "https://private-us-east-1.manuscdn.com/sessionFile/IjuoZIpKtB1FShC9GQ88GW/sandbox/gZMRigkW6C4ldwaPiTYiad-img-2_1771179157000_na1fn_bWVkZm9jdXMtZGFzaGJvYXJkLWhlcm8.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSWp1b1pJcEt0QjFGU2hDOUdRODhHVy9zYW5kYm94L2daTVJpZ2tXNkM0bGR3YVBpVFlpYWQtaW1nLTJfMTc3MTE3OTE1NzAwMF9uYTFmbl9iV1ZrWm05amRYTXRaR0Z6YUdKdllYSmtMV2hsY204LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=LyTSRO6ZGn~dENox4~oGn3TGOXpMD8GD7T3L9ddXsMU63ykPu~XMkRfR0vGOb5QsGiYYkWWZpabPeK-AkyDmoesuQUndYVphVQAJ-u2M4y9Yu-6rVXj9jAwYi09sEKhn5k7viC0ShM-0n9awqcAPyfwt23mqRK9bvK-OwC-furaxiUWslwM0xivvs-jiRRP7fxZ7zDZwsKgg16xfEk7wYXl5GQM38DVL0aERyeBp24RQ~C7BjCc789hvr4B2HUxdDYI5Ue83QbOl--HyQ13aZsPjdlkY7fBbex9~rknipzHA4pdLCYP3lPu1IZGvg7cBU0ztqAo59ivKldaugph7~g__";

interface DashboardProps { user: User; }

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const storageKey = `medfocus_tasks_${user.email.replace(/[@.]/g, '_')}`;

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Estudar Ciclo de Krebs', category: 'Fisiologia', completed: false },
      { id: '2', title: 'Flashcards de Farmacologia', category: 'Farmacologia', completed: true },
      { id: '3', title: 'Revisão Anatomia — Membro Superior', category: 'Anatomia', completed: false },
      { id: '4', title: 'Caso Clínico: Infarto Agudo', category: 'Clínica', completed: false },
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', category: 'Clínica' as Task['category'] });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
    syncToCloud('tasks_update', { count: tasks.length, timestamp: Date.now() });
  }, [tasks, storageKey]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleSaveNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    const task: Task = { id: Date.now().toString(), title: newTask.title, category: newTask.category, completed: false };
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

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const categories: Task['category'][] = ['Anatomia', 'Fisiologia', 'Farmacologia', 'Clínica', 'Outros'];

  const categoryColors: Record<string, string> = {
    'Anatomia': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    'Fisiologia': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Farmacologia': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'Clínica': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Outros': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden h-48 md:h-56">
        <img src={DASHBOARD_HERO} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c1829]/95 via-[#0f2035]/80 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center p-8">
          <p className="text-teal-300/80 text-xs font-semibold uppercase tracking-wider mb-1">{getGreeting()}</p>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
            Dr. {user.name.split(' ')[0]}
          </h1>
          <p className="text-white/50 text-sm font-medium mt-1 max-w-md">
            {pendingCount > 0 ? `Você tem ${pendingCount} tópicos pendentes para hoje.` : 'Todos os tópicos foram concluídos!'}
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">Progresso</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            </div>
          </div>
          <p className="text-2xl font-display font-extrabold text-foreground">{progressPercent}%</p>
          <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">Pendentes</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
          </div>
          <p className="text-2xl font-display font-extrabold text-foreground">{pendingCount}</p>
          <p className="text-xs text-muted-foreground mt-1 font-medium">tópicos restantes</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">Concluídos</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <p className="text-2xl font-display font-extrabold text-foreground">{completedCount}</p>
          <p className="text-xs text-muted-foreground mt-1 font-medium">finalizados</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground">Status</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-soft" />
          </div>
          <p className="text-2xl font-display font-extrabold text-foreground">Ativo</p>
          <p className="text-xs text-primary mt-1 font-semibold">Dados sincronizados</p>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-5 md:p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-foreground text-lg">Roteiro de Estudos</h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">{tasks.length} tópicos no ciclo atual</p>
          </div>
          <button onClick={() => setIsModalOpen(true)}
            className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-all active:scale-95 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M12 5v14m-7-7h14"/></svg>
            Novo Tópico
          </button>
        </div>

        <div className="divide-y divide-border">
          {tasks.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              </div>
              <p className="text-sm font-semibold text-muted-foreground">Nenhum tópico adicionado.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Clique em "Novo Tópico" para começar.</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="px-5 md:px-6 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors group">
                <button onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                    task.completed ? 'bg-primary border-primary' : 'border-border hover:border-primary/50'
                  }`}>
                  {task.completed && <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </button>
                <div className="flex-1 min-w-0">
                  <span className={`text-sm font-medium block truncate ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {task.title}
                  </span>
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-md shrink-0 ${categoryColors[task.category] || categoryColors['Outros']}`}>
                  {task.category}
                </span>
                <button onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-destructive/10 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-display font-bold text-foreground">Novo Tópico de Estudo</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSaveNewTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tópico</label>
                <input type="text" required value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl outline-none transition-all text-foreground font-medium placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                  placeholder="Ex: Revisão de Bioquímica — Lipídeos" autoFocus />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Categoria</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button key={cat} type="button" onClick={() => setNewTask({...newTask, category: cat})}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        newTask.category === cat ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/50'
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-all active:scale-[0.98] text-sm mt-2">
                Adicionar ao Roteiro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
