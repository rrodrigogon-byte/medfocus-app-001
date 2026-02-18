/**
 * MedFocus Main Application Page
 * Design: Medical Precision — Teal accent, Outfit display, Plus Jakarta Sans body
 * Auth: Manus OAuth (Gmail) + Guest mode
 */
import React, { useState, useEffect } from 'react';
import { User, View } from '../types';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
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
import PreloadedStudy from '../components/medfocus/PreloadedStudy';
import AcademicLibrary from '../components/medfocus/AcademicLibrary';
import ValidatedLibrary from '../components/medfocus/ValidatedLibrary';
import ProgressiveQuizSystem from '../components/medfocus/ProgressiveQuizSystem';
import ProfessorDashboard from '../components/medfocus/ProfessorDashboard';
import GamificationPanel from '../components/medfocus/GamificationPanel';
import NotificationSettingsPanel from '../components/medfocus/NotificationSettings';
import PricingPlans from '../components/medfocus/PricingPlans';
import AcademicResourcesPanel from '../components/medfocus/AcademicResourcesPanel';
import SpacedRepetitionPanel from '../components/medfocus/SpacedRepetitionPanel';
import ClassroomPanel from '../components/medfocus/ClassroomPanel';
import TeacherAnalyticsPanel from '../components/medfocus/TeacherAnalyticsPanel';
import MedicalRoadmap from '../components/medfocus/MedicalRoadmap';
import SimuladoENAMED from '../components/medfocus/SimuladoENAMED';
import AnatomyAtlas from '../components/medfocus/AnatomyAtlas';
import StudyRooms from '../components/medfocus/StudyRooms';
import AcademicCalendar from '../components/medfocus/AcademicCalendar';
import XPToast from '../components/medfocus/XPToast';
import { useTheme } from '../contexts/ThemeContext';
import { trpc } from '@/lib/trpc';
import { useGamification } from '../hooks/useGamification';

export default function Home() {
  const { user: authUser, loading: authLoading, isAuthenticated, logout: oauthLogout } = useAuth();
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const { theme, toggleTheme } = useTheme();
  const gamification = useGamification();

  // Daily login XP
  useEffect(() => {
    if (localUser) {
      gamification.dailyLogin();
    }
  }, [localUser?.name]);

  // Sync OAuth user to local state
  useEffect(() => {
    if (isAuthenticated && authUser) {
      const oauthUser: User = {
        id: authUser.id?.toString() || `oauth_${Date.now()}`,
        name: authUser.name || 'Estudante',
        email: authUser.email || '',
        isLoggedIn: true,
        role: 'student',
        universityId: localStorage.getItem('medfocus_universityId') || undefined,
        currentYear: Number(localStorage.getItem('medfocus_currentYear')) || undefined,
      };
      setLocalUser(oauthUser);
      localStorage.setItem('medfocus_user', JSON.stringify(oauthUser));
    }
  }, [isAuthenticated, authUser]);

  // Load saved local user (guest mode)
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      const savedUser = localStorage.getItem('medfocus_user');
      if (savedUser) {
        try { setLocalUser(JSON.parse(savedUser)); } catch { localStorage.removeItem('medfocus_user'); }
      }
    }
  }, [isAuthenticated, authLoading]);

  const handleLogin = (name: string, email: string) => {
    const newUser: User = { id: `guest_${Date.now()}`, name, email, isLoggedIn: true, role: 'student' };
    setLocalUser(newUser);
    setCurrentView('dashboard');
    localStorage.setItem('medfocus_user', JSON.stringify(newUser));
  };

  const handleOAuthLogin = () => {
    window.location.href = getLoginUrl();
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (!localUser) return;
    const updatedUser = { ...localUser, ...updates };
    setLocalUser(updatedUser);
    localStorage.setItem('medfocus_user', JSON.stringify(updatedUser));
    if (updates.universityId) localStorage.setItem('medfocus_universityId', updates.universityId);
    if (updates.currentYear) localStorage.setItem('medfocus_currentYear', String(updates.currentYear));
  };

  const handleLogout = () => {
    setLocalUser(null);
    localStorage.removeItem('medfocus_user');
    localStorage.removeItem('medfocus_universityId');
    localStorage.removeItem('medfocus_currentYear');
    if (isAuthenticated) {
      oauthLogout();
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <p className="text-muted-foreground text-sm font-medium">Carregando MedFocus...</p>
        </div>
      </div>
    );
  }

  // Show login if no user
  if (!localUser) {
    return <Login onLogin={handleLogin} onOAuthLogin={handleOAuthLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard user={localUser} />;
      case 'planner': return <Planner user={localUser} />;
      case 'timer': return <Timer onPomodoroComplete={gamification.completePomodoro} />;
      case 'assistant': return <Assistant />;
      case 'academic': return <AcademicManagement user={localUser} />;
      case 'guide': return <AcademicGuide user={localUser} onUpdateUser={handleUpdateUser} />;
      case 'research': return <GlobalResearch />;
      case 'materials': return <StudyMaterialGenerator university={localUser.universityId || 'USP'} year={localUser.currentYear || 1} subjects={['Anatomia', 'Fisiologia', 'Farmacologia', 'Clínica']} />;
      case 'weekly': return <WeeklyStudyChecklist user={localUser} onChecklistComplete={gamification.completeChecklistItem} />;
      case 'library': return <AcademicLibrary />;
      case 'studyContent': return <PreloadedStudy onQuizComplete={gamification.completeQuiz} onFlashcardReview={gamification.reviewFlashcard} onSubjectStudy={gamification.studySubject} />;
      case 'gamification': return <GamificationPanel />;
      case 'notifications': return <NotificationSettingsPanel />;
      case 'pricing': return <PricingPlans />;
      case 'resources': return <AcademicResourcesPanel />;
      case 'spacedRepetition': return <SpacedRepetitionPanel />;
      case 'classroom': return <ClassroomPanel user={localUser} />;
      case 'analytics': return <TeacherAnalyticsPanel />;
      case 'roadmap': return <MedicalRoadmap currentYear={localUser.currentYear || 1} onSelectYear={(y) => { handleUpdateUser({ currentYear: y }); setCurrentView('guide'); }} />;
      case 'simulado': return <SimuladoENAMED />;
      case 'atlas': return <AnatomyAtlas />;
      case 'studyRooms': return <StudyRooms />;
      case 'calendar': return <AcademicCalendar />;
      case 'validated-library': return <ValidatedLibrary userRole={localUser.role === 'admin' ? 'professor' : 'student'} currentYear={(localUser.currentYear || 1) as 1|2|3|4|5|6} />;
      case 'quiz': return <ProgressiveQuizSystem currentYear={(localUser.currentYear || 1) as 1|2|3|4|5|6} subjectId="clinica-medica" onComplete={gamification.completeQuiz} />;
      case 'professor': return <ProfessorDashboard professor={{
            id: localUser.id,
            name: localUser.name,
            email: localUser.email,
            universityId: localUser.universityId || 'USP',
            universityName: 'Universidade',
            role: 'professor',
            specialties: localUser.specialties || [],
            verifiedCredentials: localUser.verifiedCredentials || false,
            lattes: undefined,
            orcid: undefined,
            googleScholar: undefined,
            canValidateMaterials: true,
            canCreateStudyRooms: true,
            canModerateContent: localUser.role === 'admin',
            materialsContributed: 0,
            studentsImpacted: 0,
            validationsPerformed: 0,
          }} />;
      default: return <Dashboard user={localUser} />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <XPToast />
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onLogout={handleLogout}
        userName={localUser.name}
        isOAuth={isAuthenticated}
      />
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="md:hidden w-8" />
            <h2 className="text-sm font-display font-bold text-foreground capitalize">
              {currentView === 'dashboard' ? 'Painel' : 
               currentView === 'guide' ? 'Universidades' :
               currentView === 'planner' ? 'Cronograma' :
               currentView === 'materials' ? 'Materiais de Estudo' :
               currentView === 'library' ? 'Biblioteca Acadêmica' :
               currentView === 'studyContent' ? 'Conteúdo de Estudo' :
               currentView === 'timer' ? 'Pomodoro' :
               currentView === 'weekly' ? 'Checklist Semanal' :
               currentView === 'academic' ? 'Gestão Acadêmica' :
               currentView === 'assistant' ? 'MedGenie AI' :
               currentView === 'research' ? 'Pesquisa Global' :
               currentView === 'gamification' ? 'Conquistas & XP' :
               currentView === 'notifications' ? 'Notificações' :
               currentView === 'pricing' ? 'Planos & Assinatura' :
               currentView === 'resources' ? 'Recursos Acadêmicos' :
               currentView === 'validated-library' ? 'Conteúdo Validado' :
               currentView === 'quiz' ? 'Quiz Avançado' :
               currentView === 'professor' ? 'Painel do Professor' :
               currentView === 'spacedRepetition' ? 'Revisão Espaçada SM-2' :
               currentView === 'classroom' ? 'Sala de Aula' :
               currentView === 'analytics' ? 'Analytics de Turma' :
               currentView === 'roadmap' ? 'Jornada Médica' :
               currentView === 'simulado' ? 'Simulados ENAMED' :
               currentView === 'atlas' ? 'Atlas Anatômico' :
               currentView === 'studyRooms' ? 'Salas de Estudo' :
               currentView === 'calendar' ? 'Calendário Acadêmico' : currentView}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                Premium
              </span>
            )}
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
}
