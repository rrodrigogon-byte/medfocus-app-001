
import React, { useState, useEffect } from 'react';
import { User, AttendanceSubject } from '../../types';

interface AttendanceProps {
  user: User;
}

const Attendance: React.FC<AttendanceProps> = ({ user }) => {
  const storageKey = `medfocus_attendance_${user.email.replace(/[@.]/g, '_')}`;

  const [subjects, setSubjects] = useState<AttendanceSubject[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    totalClasses: 80,
    requiredPresence: 75
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(subjects));
  }, [subjects, storageKey]);

  const addSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newSubject: AttendanceSubject = {
      id: Date.now().toString(),
      name: formData.name,
      totalClasses: formData.totalClasses,
      absences: 0,
      requiredPresence: formData.requiredPresence
    };

    setSubjects(prev => [newSubject, ...prev]);
    setFormData({ name: '', totalClasses: 80, requiredPresence: 75 });
    setIsModalOpen(false);
  };

  const updateAbsence = (id: string, delta: number) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === id) {
        const newVal = Math.max(0, Math.min(s.totalClasses, s.absences + delta));
        return { ...s, absences: newVal };
      }
      return s;
    }));
  };

  const deleteSubject = (id: string) => {
    if (confirm('Excluir monitoramento desta disciplina?')) {
      setSubjects(prev => prev.filter(s => s.id !== id));
    }
  };

  const calculateInfo = (subject: AttendanceSubject) => {
    const presence = ((subject.totalClasses - subject.absences) / subject.totalClasses) * 100;
    const maxAbsences = Math.floor(subject.totalClasses * (1 - (subject.requiredPresence / 100)));
    const remainingAbsences = maxAbsences - subject.absences;
    
    let status: 'safe' | 'warning' | 'critical' = 'safe';
    if (presence < subject.requiredPresence) status = 'critical';
    else if (presence < subject.requiredPresence + 10) status = 'warning';

    return { presence, maxAbsences, remainingAbsences, status };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-black dark:text-white tracking-tighter uppercase">Frequência Acadêmica</h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">Gestão de Presença e Limite de Faltas</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          <span>Monitorar Disciplina</span>
        </button>
      </header>

      {subjects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-20 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Nenhuma disciplina sendo monitorada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map(subject => {
            const info = calculateInfo(subject);
            const statusColors = {
              safe: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20',
              warning: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20',
              critical: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20'
            };
            const barColors = {
              safe: 'bg-emerald-500',
              warning: 'bg-amber-500',
              critical: 'bg-rose-500'
            };

            return (
              <div key={subject.id} className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex flex-col transition-all hover:shadow-md relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter truncate max-w-[200px]">{subject.name}</h3>
                      <button onClick={() => deleteSubject(subject.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
                      </button>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aulas Totais: {subject.totalClasses}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${statusColors[info.status]}`}>
                    {info.presence.toFixed(1)}% PRESENÇA
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${barColors[info.status]}`} 
                      style={{ width: `${info.presence}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Faltas Registradas</p>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => updateAbsence(subject.id, -1)}
                          className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-all active:scale-90 flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                        </button>
                        <span className="text-3xl font-black text-black dark:text-white tabular-nums w-8 text-center">{subject.absences}</span>
                        <button 
                          onClick={() => updateAbsence(subject.id, 1)}
                          className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-all active:scale-90 flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        </button>
                      </div>
                    </div>

                    <div className="text-right bg-slate-50 dark:bg-slate-800/50 p-4 rounded-[24px] border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Margem de Erro</p>
                      <p className={`text-xl font-black tracking-tighter ${info.remainingAbsences < 0 ? 'text-rose-500' : 'text-indigo-600 dark:text-indigo-400'}`}>
                        {info.remainingAbsences < 0 ? 'REPROVADO' : `${info.remainingAbsences} FALTAS DISP.`}
                      </p>
                      <p className="text-[8px] font-bold text-slate-400">Limite: {info.maxAbsences} faltas</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">Configurar Monitoramento</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-black dark:hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <form onSubmit={addSubject} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Disciplina</label>
                <input 
                  autoFocus required type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="Ex: Patologia Médica II" 
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-bold text-black dark:text-white" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Total de Aulas</label>
                  <input 
                    required type="number" min="1"
                    value={formData.totalClasses} 
                    onChange={e => setFormData({...formData, totalClasses: parseInt(e.target.value)})} 
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none transition-all font-bold text-black dark:text-white" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">% Presença Exigida</label>
                  <input 
                    required type="number" min="0" max="100"
                    value={formData.requiredPresence} 
                    onChange={e => setFormData({...formData, requiredPresence: parseInt(e.target.value)})} 
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none transition-all font-bold text-black dark:text-white" 
                  />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl uppercase text-xs tracking-widest active:scale-95">
                  Iniciar Monitoramento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
