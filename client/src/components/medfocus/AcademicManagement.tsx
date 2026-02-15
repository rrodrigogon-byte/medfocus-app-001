
import React, { useState } from 'react';
import { User } from '../../types';
import Grades from './Grades';
import Attendance from './Attendance';
import AcademicReport from './AcademicReport';

interface AcademicManagementProps {
  user: User;
}

const AcademicManagement: React.FC<AcademicManagementProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'grades' | 'attendance' | 'report'>('grades');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-black dark:text-white tracking-tighter uppercase">Gestão Acadêmica</h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">Notas, Médias e Frequência</p>
        </div>
        
        <div className="flex p-1.5 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-[24px] border border-slate-200 dark:border-slate-700 w-fit">
          <button
            onClick={() => setActiveTab('grades')}
            className={`px-6 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'grades'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Notas & Médias
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-6 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'attendance'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Frequência
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-6 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'report'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Relatório
          </button>
        </div>
      </header>

      <div className="mt-4">
        {activeTab === 'grades' && (
          <div className="animate-in slide-in-from-left-4 duration-500">
            <Grades user={user} />
          </div>
        )}
        {activeTab === 'attendance' && (
          <div className="animate-in slide-in-from-right-4 duration-500">
            <Attendance user={user} />
          </div>
        )}
        {activeTab === 'report' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <AcademicReport user={user} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicManagement;
