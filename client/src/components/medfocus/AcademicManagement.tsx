/**
 * MedFocus Academic Management — Premium Design
 * Unified grades, attendance and report management
 */
import React, { useState } from 'react';
import { User } from '../../types';
import Grades from './Grades';
import Attendance from './Attendance';
import AcademicReport from './AcademicReport';

interface Props { user: User; }

const tabs = [
  { id: 'grades', label: 'Notas & Médias', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { id: 'attendance', label: 'Frequência', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'report', label: 'Relatório', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
];

const AcademicManagement: React.FC<Props> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('grades');

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-extrabold text-foreground tracking-tight">Gestão Acadêmica</h2>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">Notas, frequência e desempenho</p>
        </div>
        <div className="flex p-1 bg-muted/50 rounded-lg border border-border/50">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                activeTab === tab.id ? 'bg-card text-primary shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'
              }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d={tab.icon} /></svg>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {activeTab === 'grades' && <Grades user={user} />}
        {activeTab === 'attendance' && <Attendance user={user} />}
        {activeTab === 'report' && <AcademicReport user={user} />}
      </div>
    </div>
  );
};

export default AcademicManagement;
