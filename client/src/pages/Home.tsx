/**
 * MedFocus Main Application Page
 * Design: Medical Precision — Teal accent, Outfit display, Plus Jakarta Sans body
 */
import React, { useState, useEffect } from 'react';
import { User, View } from '../types';
import Login from '../components/medfocus/Login';
import Dashboard from '../components/medfocus/Dashboard';
import Planner from '../components/medfocus/Planner';
import Timer from '../components/medfocus/Timer';
import Assistant from '../components/medfocus/Assistant';
import Sidebar from '../components/medfocus/Sidebar';
import AcademicManagement from '../components/medfocus/AcademicManagement';
import AcademicGuide from '../components/medfocus/AcademicGuide';
import GlobalResearch from '../components/medfocus/GlobalResearch';
import StudyMaterialGenerator from '../components/medfocus/StudyMaterialGenerator';
import WeeklyStudyChecklist from '../components/medfocus/WeeklyStudyChecklist';
import { useTheme } from '../contexts/ThemeContext';

const MedFocusApp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const savedUser = localStorage.getItem('medfocus_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch { localStorage.removeItem('medfocus_user'); }
    }
  }, []);

  const handleLogin = (name: string, email: string) => {
    const newUser = { name, email, isLoggedIn: true };
    setUser(newUser);
    setCurrentView('dashboard');
    localStorage.setItem('medfocus_user', JSON.stringify(newUser));
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('medfocus_user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('medfocus_user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'planner': return <Planner user={user} />;
      case 'timer': return <Timer />;
      case 'assistant': return <Assistant />;
      case 'academic': return <AcademicManagement user={user} />;
      case 'guide': return <AcademicGuide user={user} onUpdateUser={handleUpdateUser} />;
      case 'research': return <GlobalResearch />;
      case 'materials': return <StudyMaterialGenerator university={user.universityId || 'USP'} year={user.currentYear || 1} subjects={['Anatomia', 'Fisiologia', 'Farmacologia', 'Clínica']} />;
      case 'weekly': return <WeeklyStudyChecklist user={user} />;
      default: return <Dashboard user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onLogout={handleLogout}
        userName={user.name}
      />
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="md:hidden w-8" /> {/* spacer for mobile hamburger */}
            <h2 className="text-sm font-display font-bold text-foreground capitalize">
              {currentView === 'dashboard' ? 'Painel' : 
               currentView === 'guide' ? 'Universidades' :
               currentView === 'planner' ? 'Cronograma' :
               currentView === 'materials' ? 'Materiais de Estudo' :
               currentView === 'timer' ? 'Pomodoro' :
               currentView === 'weekly' ? 'Checklist Semanal' :
               currentView === 'academic' ? 'Gestão Acadêmica' :
               currentView === 'assistant' ? 'MedGenie AI' :
               currentView === 'research' ? 'Pesquisa Global' : currentView}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Alternar tema">
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default MedFocusApp;
