
import React, { useMemo } from 'react';
import { User, Subject, AttendanceSubject } from '../../types';

interface AcademicReportProps {
  user: User;
}

const AcademicReport: React.FC<AcademicReportProps> = ({ user }) => {
  const gradesKey = `medfocus_grades_${user.email.replace(/[@.]/g, '_')}`;
  const attendanceKey = `medfocus_attendance_${user.email.replace(/[@.]/g, '_')}`;

  const subjects = useMemo(() => {
    const saved = localStorage.getItem(gradesKey);
    return saved ? (JSON.parse(saved) as Subject[]) : [];
  }, [gradesKey]);

  const attendanceSubjects = useMemo(() => {
    const saved = localStorage.getItem(attendanceKey);
    return saved ? (JSON.parse(saved) as AttendanceSubject[]) : [];
  }, [attendanceKey]);

  const reportData = useMemo(() => {
    const calculateAverage = (subject: Subject) => {
      const allItems = [...subject.exams, ...subject.assignments];
      if (allItems.length === 0) return 0;
      const totalWeighted = allItems.reduce((acc, item) => acc + (item.value * item.weight), 0);
      const totalWeights = allItems.reduce((acc, item) => acc + item.weight, 0);
      return totalWeights === 0 ? 0 : totalWeighted / totalWeights;
    };

    const subjectStats = subjects.map(s => {
      const avg = calculateAverage(s);
      const attendance = attendanceSubjects.find(a => a.name === s.name);
      const presence = attendance ? ((attendance.totalClasses - attendance.absences) / attendance.totalClasses) * 100 : null;
      
      return {
        name: s.name,
        average: avg,
        target: s.targetAverage,
        presence: presence,
        requiredPresence: attendance?.requiredPresence || 75,
        status: (avg >= s.targetAverage && (presence === null || presence >= (attendance?.requiredPresence || 75))) ? 'Aprovado' : 'Em Risco'
      };
    });

    const globalAverage = subjects.length > 0 
      ? subjects.reduce((acc, s) => acc + calculateAverage(s), 0) / subjects.length 
      : 0;

    const totalAbsences = attendanceSubjects.reduce((acc, s) => acc + s.absences, 0);

    return { subjectStats, globalAverage, totalAbsences };
  }, [subjects, attendanceSubjects]);

  if (subjects.length === 0 && attendanceSubjects.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-[40px] p-20 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Adicione disciplinas para gerar o relatório.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Média Global</p>
          <h3 className="text-5xl font-black tracking-tighter">{reportData.globalAverage.toFixed(1)}</h3>
          <p className="text-[10px] font-bold mt-4 bg-white/20 w-fit px-3 py-1 rounded-full">Desempenho Geral</p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total de Faltas</p>
          <h3 className="text-5xl font-black text-black dark:text-white tracking-tighter">{reportData.totalAbsences}</h3>
          <p className="text-[10px] font-bold text-slate-500 mt-4">Acumulado no Semestre</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Disciplinas</p>
          <h3 className="text-5xl font-black text-black dark:text-white tracking-tighter">{reportData.subjectStats.length}</h3>
          <p className="text-[10px] font-bold text-slate-500 mt-4">Em Monitoramento</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tighter">Detalhamento por Disciplina</h3>
          <button 
            onClick={() => window.print()}
            className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline"
          >
            Exportar PDF
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Disciplina</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Média</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Frequência</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {reportData.subjectStats.map((stat, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-6">
                    <p className="text-sm font-black text-black dark:text-white uppercase">{stat.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold">Meta: {stat.target}</p>
                  </td>
                  <td className="p-6">
                    <span className={`text-lg font-black ${stat.average >= stat.target ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {stat.average.toFixed(1)}
                    </span>
                  </td>
                  <td className="p-6">
                    {stat.presence !== null ? (
                      <div>
                        <p className={`text-sm font-black ${stat.presence >= stat.requiredPresence ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {stat.presence.toFixed(1)}%
                        </p>
                        <div className="w-20 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full ${stat.presence >= stat.requiredPresence ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            style={{ width: `${stat.presence}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-300 font-bold italic">N/A</span>
                    )}
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      stat.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                    }`}>
                      {stat.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-[32px] p-8">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <div>
            <h4 className="text-sm font-black text-amber-800 dark:text-amber-400 uppercase tracking-tight mb-1">Análise do MedGenie</h4>
            <p className="text-xs text-amber-700 dark:text-amber-500/80 font-bold leading-relaxed">
              {reportData.globalAverage < 7 
                ? "Atenção: Sua média global está abaixo da meta recomendada. Foque em revisar os tópicos com menor desempenho e utilize o MedGenie para gerar flashcards de reforço."
                : "Excelente desempenho! Você está mantendo uma média sólida. Continue com o cronograma atual e utilize o tempo extra para aprofundar em temas complexos."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicReport;
