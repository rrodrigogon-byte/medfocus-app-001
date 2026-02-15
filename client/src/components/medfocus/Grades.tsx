
import React, { useState, useEffect } from 'react';
import { User, Subject, GradeItem } from '../../types';

interface GradesProps {
  user: User;
}

const Grades: React.FC<GradesProps> = ({ user }) => {
  const storageKey = `medfocus_grades_${user.email.replace(/[@.]/g, '_')}`;

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Modal de Disciplina
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [targetAverage, setTargetAverage] = useState(7.0);

  // Modal de Nota
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [activeGradeSubject, setActiveGradeSubject] = useState<{id: string, type: 'exams' | 'assignments'} | null>(null);
  const [gradeFormData, setGradeFormData] = useState({
    title: '',
    value: '',
    weight: '1'
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(subjects));
  }, [subjects, storageKey]);

  const addSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    const newSubject: Subject = {
      id: Date.now().toString(),
      name: newSubjectName,
      exams: [],
      assignments: [],
      targetAverage: targetAverage
    };

    setSubjects(prev => [newSubject, ...prev]);
    setNewSubjectName('');
    setIsModalOpen(false);
  };

  const deleteSubject = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Excluir esta disciplina e todas as suas notas?')) {
      setSubjects(prev => prev.filter(s => s.id !== id));
    }
  };

  const openGradeModal = (subjectId: string, type: 'exams' | 'assignments') => {
    setActiveGradeSubject({ id: subjectId, type });
    setGradeFormData({ title: '', value: '', weight: '1' });
    setIsGradeModalOpen(true);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGradeSubject || !gradeFormData.title.trim() || !gradeFormData.value) return;

    const newValue = parseFloat(gradeFormData.value);
    const newWeight = parseFloat(gradeFormData.weight) || 1;

    setSubjects(prev => prev.map(s => {
      if (s.id === activeGradeSubject.id) {
        const newItem: GradeItem = { 
          id: Date.now().toString(), 
          title: gradeFormData.title, 
          value: newValue, 
          weight: newWeight 
        };
        const updatedList = [...s[activeGradeSubject.type], newItem];
        return { ...s, [activeGradeSubject.type]: updatedList };
      }
      return s;
    }));

    setIsGradeModalOpen(false);
    setActiveGradeSubject(null);
  };

  const deleteGrade = (e: React.MouseEvent, subjectId: string, type: 'exams' | 'assignments', gradeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSubjects(prev => prev.map(s => {
      if (s.id === subjectId) {
        return { ...s, [type]: s[type].filter(g => g.id !== gradeId) };
      }
      return s;
    }));
  };

  const calculateAverage = (subject: Subject) => {
    const allItems = [...subject.exams, ...subject.assignments];
    if (allItems.length === 0) return 0;

    const totalWeighted = allItems.reduce((acc, item) => acc + (item.value * item.weight), 0);
    const totalWeights = allItems.reduce((acc, item) => acc + item.weight, 0);

    return totalWeights === 0 ? 0 : totalWeighted / totalWeights;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-black dark:text-white tracking-tighter uppercase">Desempenho Acadêmico</h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">Gestão de Médias e Resultados</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          <span>Adicionar Disciplina</span>
        </button>
      </header>

      {subjects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-20 text-center border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Nenhuma disciplina cadastrada ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {subjects.map(subject => {
            const avg = calculateAverage(subject);
            const statusColor = avg >= subject.targetAverage ? 'text-emerald-500' : 'text-rose-500';
            const progress = Math.min((avg / 10) * 100, 100);

            return (
              <div key={subject.id} className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:shadow-md">
                <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-800/20">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">{subject.name}</h3>
                      <button 
                        onClick={(e) => deleteSubject(e, subject.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-1000 ${avg >= subject.targetAverage ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-4xl font-black tracking-tighter ${statusColor}`}>{avg.toFixed(1)}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Média Atual / Meta: {subject.targetAverage}</p>
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Provas */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Provas</h4>
                      <button 
                        onClick={() => openGradeModal(subject.id, 'exams')} 
                        className="text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase hover:underline"
                      >
                        + Adicionar Prova
                      </button>
                    </div>
                    <div className="space-y-2">
                      {subject.exams.length === 0 ? <p className="text-[10px] text-slate-300 dark:text-slate-600 font-bold italic">Nenhuma prova registrada.</p> : 
                        subject.exams.map(g => (
                          <div key={g.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group">
                            <span className="text-xs font-bold text-black dark:text-white uppercase tracking-tight">{g.title} <span className="text-[9px] text-slate-400">(Peso {g.weight})</span></span>
                            <div className="flex items-center gap-3">
                              <span className={`text-sm font-black ${g.value >= subject.targetAverage ? 'text-emerald-500' : 'text-rose-500'}`}>{g.value.toFixed(1)}</span>
                              <button onClick={(e) => deleteGrade(e, subject.id, 'exams', g.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
                              </button>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>

                  {/* Trabalhos */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trabalhos / Outros</h4>
                      <button 
                        onClick={() => openGradeModal(subject.id, 'assignments')} 
                        className="text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase hover:underline"
                      >
                        + Adicionar Trabalho
                      </button>
                    </div>
                    <div className="space-y-2">
                      {subject.assignments.length === 0 ? <p className="text-[10px] text-slate-300 dark:text-slate-600 font-bold italic">Nenhum trabalho registrado.</p> : 
                        subject.assignments.map(g => (
                          <div key={g.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group">
                            <span className="text-xs font-bold text-black dark:text-white uppercase tracking-tight">{g.title} <span className="text-[9px] text-slate-400">(Peso {g.weight})</span></span>
                            <div className="flex items-center gap-3">
                              <span className={`text-sm font-black ${g.value >= subject.targetAverage ? 'text-emerald-500' : 'text-rose-500'}`}>{g.value.toFixed(1)}</span>
                              <button onClick={(e) => deleteGrade(e, subject.id, 'assignments', g.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
                              </button>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Adicionar Disciplina */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">Nova Disciplina</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-black dark:hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <form onSubmit={addSubject} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nome da Matéria</label>
                <input 
                  autoFocus required type="text" 
                  value={newSubjectName} 
                  onChange={e => setNewSubjectName(e.target.value)} 
                  placeholder="Ex: Anatomia Sistêmica" 
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-bold text-black dark:text-white" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Média de Aprovação (Meta)</label>
                <input 
                  required type="number" step="0.5" min="0" max="10"
                  value={targetAverage} 
                  onChange={e => setTargetAverage(parseFloat(e.target.value))} 
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-bold text-black dark:text-white" 
                />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl uppercase text-xs tracking-widest active:scale-95">
                  Cadastrar Disciplina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NOVO Modal Adicionar Nota */}
      {isGradeModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[40px] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-black dark:text-white uppercase tracking-tighter">
                Adicionar {activeGradeSubject?.type === 'exams' ? 'Prova' : 'Trabalho'}
              </h3>
              <button onClick={() => setIsGradeModalOpen(false)} className="text-slate-400 hover:text-black dark:hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Título/Nome</label>
                <input 
                  autoFocus required type="text" 
                  value={gradeFormData.title} 
                  onChange={e => setGradeFormData({...gradeFormData, title: e.target.value})} 
                  placeholder="Ex: P1 ou Seminário" 
                  className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none transition-all font-bold text-black dark:text-white" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Nota (0-10)</label>
                  <input 
                    required type="number" step="0.1" min="0" max="10"
                    value={gradeFormData.value} 
                    onChange={e => setGradeFormData({...gradeFormData, value: e.target.value})} 
                    placeholder="8.5"
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none transition-all font-bold text-black dark:text-white" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Peso</label>
                  <input 
                    required type="number" step="0.1" min="0.1"
                    value={gradeFormData.weight} 
                    onChange={e => setGradeFormData({...gradeFormData, weight: e.target.value})} 
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none transition-all font-bold text-black dark:text-white" 
                  />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg uppercase text-[10px] tracking-widest active:scale-95">
                  Salvar Nota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grades;
