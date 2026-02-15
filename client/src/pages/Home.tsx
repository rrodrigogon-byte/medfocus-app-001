/**
 * MedFocus Main Application Page
 * Design: Clinical Precision — Swiss Medical Design
 * Teal accent, Space Grotesk headings, IBM Plex Sans body
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
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('medfocus_user');
      }
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

  const ThemeToggle = () => (
    <button 
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-[100] p-3 bg-card border border-border rounded-lg shadow-lg hover:scale-105 active:scale-95 transition-all text-foreground"
      aria-label="Alternar tema"
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      )}
    </button>
  );

  if (!user) {
    return (
      <>
        <ThemeToggle />
        <Login onLogin={handleLogin} />
      </>
    );
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
    <div className="flex h-screen bg-background text-foreground overflow-hidden transition-colors duration-300">
      <ThemeToggle />
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onLogout={handleLogout}
        userName={user.name}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto animate-fade-in">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default MedFocusApp;
