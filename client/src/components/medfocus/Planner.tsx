
import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../../types';

interface ScheduleEvent {
  id: string;
  date: string; // ISO format YYYY-MM-DD
  time: string; // HH:00 format
  title: string;
  type: string;
  color: string; // Tailwind color key
}

interface PlannerProps {
  user: User;
}

const Planner: React.FC<PlannerProps> = ({ user }) => {
  const storageKey = useMemo(() => 
    `medfocus_v9_planner_${user.email.replace(/[@.]/g, '_')}`, 
    [user.email]
  );

  const hours = useMemo(() => {
    const h = [];
    for (let i = 5; i <= 23; i++) {
      h.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return h;
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  
  const [schedule, setSchedule] = useState<ScheduleEvent[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Única fonte de verdade para persistência
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(schedule));
  }, [schedule, storageKey]);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '08:00',
    type: 'Aula',
    color: 'indigo'
  });

  const weekDays = useMemo(() => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(d.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, i) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      return dayDate;
    });
  }, [currentDate]);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const openModalForNew = (dateStr?: string, time?: string) => {
    setEditingEvent(null);
    setFormData({
      title: '',
      date: dateStr || formatDate(new Date()),
      time: time || '08:00',
      type: 'Aula',
      color: 'indigo'
    });
    setIsModalOpen(true);
  };

  const openModalForEdit = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      type: event.type,
      color: event.color
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingEvent) {
      setSchedule(prev => prev.map(ev => ev.id === editingEvent.id ? { ...ev, ...formData } : ev));
    } else {
      const newEvent: ScheduleEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        ...formData,
      };
      setSchedule(prev => [...prev, newEvent]);
    }
    
    setIsModalOpen(false);
  };

  // Função de exclusão robusta e definitiva
  const handleDeleteActivity = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Tem certeza que deseja excluir permanentemente este compromisso?')) {
      setSchedule(prev => prev.filter(item => item.id !== id));
      setIsModalOpen(false);
      setEditingEvent(null);
    }
  };

  const getTypeStyles = (color: string) => {
    const styles: Record<string, string> = {
      indigo: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800',
      emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800',
      amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800',
      sky: 'bg-sky-50 dark:bg-sky-900/30 text-sky-800 dark:text-sky-200 border-sky-200 dark:border-sky-800',
      rose: 'bg-rose-50 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800',
      violet: 'bg-violet-50 dark:bg-violet-900/30 text-violet-800 dark:text-violet-200 border-violet-200 dark:border-violet-800',
    };
    return styles[color] || styles.indigo;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter">Cronograma Médico</h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">Organização de Estudos</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d); }}
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Hoje</button>
            <button 
              onClick={() => { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d); }}
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
          
          <button 
            onClick={() => openModalForNew()}
            className="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            <span>Novo Item</span>
          </button>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="w-20 p-4 border-b border-r border-slate-100 dark:border-slate-800 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Hora</th>
                {weekDays.map(date => {
                  const isToday = formatDate(date) === formatDate(new Date());
                  return (
                    <th key={date.toString()} className={`p-4 border-b border-slate-100 dark:border-slate-800 text-center ${isToday ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        {date.toLocaleString('pt-BR', { weekday: 'short' }).slice(0, 3)}
                      </p>
                      <p className={`text-xl font-black ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-black dark:text-white'}`}>
                        {date.getDate()}
                      </p>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {hours.map(hour => (
                <tr key={hour} className="group/row">
                  <td className="p-4 border-b border-r border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 bg-slate-50/20">{hour}</td>
                  {weekDays.map(date => {
                    const dateStr = formatDate(date);
                    const event = schedule.find(e => e.date === dateStr && e.time === hour);
                    
                    return (
                      <td key={`${dateStr}-${hour}`} className="p-1.5 border-b border-slate-50 dark:border-slate-800/50 h-28 relative align-top transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30" onClick={() => !event && openModalForNew(dateStr, hour)}>
                        {event ? (
                          <div onClick={(e) => { e.stopPropagation(); openModalForEdit(event); }} className={`h-full w-full p-2.5 rounded-2xl text-left border cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md flex flex-col group/card relative ${getTypeStyles(event.color)}`}>
                            <div className="flex justify-between items-start gap-1">
                              <p className="text-[11px] font-black leading-tight uppercase tracking-tight line-clamp-2 pr-5">{event.title}</p>
                              <button 
                                onClick={(e) => handleDeleteActivity(e, event.id)}
                                className="absolute top-1.5 right-1.5 p-1.5 rounded-lg opacity-0 group-hover/card:opacity-100 bg-white/80 dark:bg-slate-800/80 hover:bg-rose-500 hover:text-white transition-all text-slate-400 z-20 shadow-sm"
                                title="Remover atividade"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                              </button>
                            </div>
                            <div className="mt-auto flex items-center justify-between">
                              <span className="text-[8px] font-black uppercase opacity-60 tracking-widest">{event.type}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full opacity-0 group/row:opacity-20 transition-opacity flex items-center justify-center text-indigo-600 dark:text-indigo-400 cursor-pointer">
                            <span className="text-2xl font-light">+</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 animate-in slide-in-from-bottom-8 duration-500 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">
                {editingEvent ? 'Editar Atividade' : 'Novo Agendamento'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-black dark:hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Título da Atividade</label>
                <input autoFocus required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Plantão Cirurgia" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-bold text-black dark:text-white" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Data</label>
                  <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-bold text-xs text-black dark:text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Horário</label>
                  <select value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none font-bold text-xs text-black dark:text-white cursor-pointer">
                    {hours.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Categoria e Cor</label>
                <div className="flex flex-wrap gap-2">
                  {['Aula', 'Prática', 'Laboratório', 'Estudo', 'Plantão'].map((type) => {
                    const colors: any = { Aula: 'indigo', Prática: 'emerald', Laboratório: 'amber', Estudo: 'sky', Plantão: 'rose' };
                    const isActive = formData.type === type;
                    return (
                      <button key={type} type="button" onClick={() => setFormData({...formData, type, color: colors[type]})} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${isActive ? `${getTypeStyles(colors[type])} ring-2 ring-offset-1 ring-indigo-200 dark:ring-offset-slate-900 scale-105 shadow-sm` : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 hover:border-slate-200'}`}>
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 flex flex-col gap-3">
                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none uppercase text-xs tracking-widest active:scale-95">
                  {editingEvent ? 'Atualizar Atividade' : 'Salvar no Cronograma'}
                </button>
                
                {editingEvent && (
                  <button 
                    type="button"
                    onClick={(e) => handleDeleteActivity(e, editingEvent.id)}
                    className="w-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-black py-4 rounded-2xl hover:bg-rose-100 dark:hover:bg-rose-900/40 border-2 border-rose-100 dark:border-rose-900/40 transition-all text-[10px] uppercase tracking-widest mt-2 flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    <span>Remover permanentemente</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
