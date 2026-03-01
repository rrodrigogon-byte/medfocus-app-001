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
import ReportExporter from '../components/medfocus/ReportExporter';
import ProgressDashboard from '../components/medfocus/ProgressDashboard';
import OfflineStudy from '../components/medfocus/OfflineStudy';
import WeeklyGoals from '../components/medfocus/WeeklyGoals';
import Leaderboard from '../components/medfocus/Leaderboard';
import ClinicalCases from '../components/medfocus/ClinicalCases';
import QuestionBattle from '../components/medfocus/QuestionBattle';
import PerformanceHeatmap from '../components/medfocus/PerformanceHeatmap';
import SmartSummary from '../components/medfocus/SmartSummary';
import SocialFeed from '../components/medfocus/SocialFeed';
import FlashcardStudy from '../components/medfocus/FlashcardStudy';
import ExamCalendar from '../components/medfocus/ExamCalendar';
import XPToast from '../components/medfocus/XPToast';
import DiagnosisAssistant from '../components/medfocus/DiagnosisAssistant';
import MedicalCalculators from '../components/medfocus/MedicalCalculators';
import DrugInteractionChecker from '../components/medfocus/DrugInteractionChecker';
import FDADrugSearch from '../components/medfocus/FDADrugSearch';
import ANVISAConsult from '../components/medfocus/ANVISAConsult';
import CID10Lookup from '../components/medfocus/CID10Lookup';
import ClinicalProtocols from '../components/medfocus/ClinicalProtocols';
import PubMedResearch from '../components/medfocus/PubMedResearch';
import LectureTranscription from '../components/medfocus/LectureTranscription';
import MyContent from '../components/medfocus/MyContent';
import ProfessorPortal from '../components/medfocus/ProfessorPortal';
import PharmaBible from '../components/medfocus/PharmaBible';
import AdminDashboard from '../components/medfocus/AdminDashboard';
import ProPaywall from '../components/medfocus/ProPaywall';
import MedicalDisciplines from '../components/medfocus/MedicalDisciplines';
import VideoAulas from '../components/medfocus/VideoAulas';
import AtlasAnalytics from '../components/medfocus/AtlasAnalytics';
import MedicineComparator from '../components/medfocus/MedicineComparator';
import Bulario from '../components/medfocus/Bulario';
import DoctorFinder from '../components/medfocus/DoctorFinder';
import HospitalFinder from '../components/medfocus/HospitalFinder';
import DoctorRegistration from '../components/medfocus/DoctorRegistration';
import HealthTips from '../components/medfocus/HealthTips';
import PriceComparison from '../components/medfocus/PriceComparison';
import LegalProtection from '../components/medfocus/LegalProtection';
import FilaSUS from '../components/medfocus/FilaSUS';
import LocalizadorUBS from '../components/medfocus/LocalizadorUBS';
import CarteiraVacinacao from '../components/medfocus/CarteiraVacinacao';
import DireitosSUS from '../components/medfocus/DireitosSUS';
import SymptomChecker from '../components/medfocus/SymptomChecker';
import DrugInteractionAdvanced from '../components/medfocus/DrugInteractionAdvanced';
import MentalHealthHub from '../components/medfocus/MentalHealthHub';
import DiseaseGuides from '../components/medfocus/DiseaseGuides';
import DigitalPrescription from '../components/medfocus/DigitalPrescription';
import MedicalProcedures from '../components/medfocus/MedicalProcedures';
import ClinicalFlowcharts from '../components/medfocus/ClinicalFlowcharts';
import ANVISAAlerts from '../components/medfocus/ANVISAAlerts';
import EditorialReview from '../components/medfocus/EditorialReview';
import { MedFocusIADashboard, MedFocusIAPatients, MedFocusIAAgenda, MedFocusIADoctors, MedFocusIALGPD, MedFocusIAPlans } from '../components/medfocus/MedFocusIASaaS';
import { MedFocusIAPEP } from '../components/medfocus/MedFocusIAPEP';
import { MedFocusIAFinanceiro } from '../components/medfocus/MedFocusIAFinanceiro';
import { MedFocusIATISS } from '../components/medfocus/MedFocusIATISS';
import { LegalAcceptanceModal } from '../components/medfocus/LegalProtection';
import { useTheme } from '../contexts/ThemeContext';
import { trpc } from '@/lib/trpc';
import { useGamification } from '../hooks/useGamification';

// Módulos que requerem plano Pro
const PRO_MODULES = new Set([
  'smartSummary', 'clinicalCases', 'battle', 'quiz',
  'simulado', 'diagnosisAssistant', 'clinicalProtocols', 'fdaDrugs',
  'drugInteractions', 'classroom', 'analytics', 'professor',
  'validated-library', 'reports', 'flashcardStudy', 'lectureTranscription',
  'myContent', 'pharmaBible', 'pubmedResearch', 'studyRooms', 'socialFeed',
  'disciplines', 'videoAulas', 'atlasAnalytics',
]);

const MODULE_NAMES: Record<string, string> = {
  smartSummary: 'Resumos Inteligentes',
  clinicalCases: 'Casos Clínicos com IA',
  battle: 'Modo Batalha',
  quiz: 'Quiz Avançado',
  atlas: 'Atlas Anatômico',
  simulado: 'Simulados de Residência',
  diagnosisAssistant: 'Apoio Diagnóstico IA',
  clinicalProtocols: 'Protocolos Clínicos',
  fdaDrugs: 'FDA Drugs',
  drugInteractions: 'Interações Medicamentosas',
  classroom: 'Sala de Aula',
  analytics: 'Analytics de Turma',
  professor: 'Painel do Professor',
  'validated-library': 'Conteúdo Validado',
  reports: 'Relatórios PDF',
  flashcardStudy: 'Flashcards SM-2',
  lectureTranscription: 'Transcrição de Aulas',
  myContent: 'Meu Conteúdo',
  pharmaBible: 'Bíblia Farmacológica',
  pubmedResearch: 'PubMed Research',
  studyRooms: 'Salas de Estudo',
  socialFeed: 'Feed Social',
  professorPortal: 'Portal do Professor',
  disciplines: 'Disciplinas Médicas',
  videoAulas: 'Vídeo-Aulas',
  atlasAnalytics: 'Atlas Analytics',
  medicineComparator: 'Comparador de Medicamentos',
};

export default function Home() {
  const { user: authUser, loading: authLoading, isAuthenticated, logout: oauthLogout } = useAuth();
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [termsAccepted, setTermsAccepted] = useState(() => {
    return localStorage.getItem('medfocus_terms_accepted') === 'true';
  });
  const { theme, toggleTheme } = useTheme();
  const gamification = useGamification();

  // Check user subscription status (must be before any conditional returns)
  const subscriptionQuery = trpc.stripe.getSubscription.useQuery(undefined, { 
    retry: false,
    enabled: isAuthenticated,
  });
  const userPlan = subscriptionQuery.data?.plan || 'free';
  const hasFullAccess = subscriptionQuery.data?.hasFullAccess || false;
  const isGuest = !isAuthenticated;

  // Daily login XP
  useEffect(() => {
    if (localUser) {
      gamification.dailyLogin();
    }
  }, [localUser?.name]);

  // Sync OAuth user to local state
  useEffect(() => {
    if (isAuthenticated && authUser) {
      const dbRole = (authUser as any).role || 'student';
      const userRole = dbRole === 'admin' ? 'admin' : dbRole === 'professor' ? 'professor' : 'student';
      const oauthUser: User = {
        id: authUser.id?.toString() || `oauth_${Date.now()}`,
        name: authUser.name || 'Estudante',
        email: authUser.email || '',
        isLoggedIn: true,
        role: userRole as any,
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

  const handleLogin = (name: string, email: string, role?: string) => {
    const userRole = role === 'admin' ? 'admin' : 'student';
    const newUser: User = { id: email, name, email, isLoggedIn: true, role: userRole as any };
    setLocalUser(newUser);
    setCurrentView('dashboard');
    localStorage.setItem('medfocus_user', JSON.stringify(newUser));
    // Reload to activate the session cookie set by the backend
    window.location.reload();
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
    // Check if current view requires Pro and user doesn't have access
    if (PRO_MODULES.has(currentView) && !hasFullAccess && !isGuest) {
      return (
        <ProPaywall
          moduleName={MODULE_NAMES[currentView] || currentView}
          onUpgrade={() => setCurrentView('pricing')}
        />
      );
    }
    // Guest users trying to access PRO modules see paywall too
    if (PRO_MODULES.has(currentView) && isGuest) {
      return (
        <ProPaywall
          moduleName={MODULE_NAMES[currentView] || currentView}
          moduleDescription="Faça login com sua conta Google e assine o plano Pro para acessar este recurso."
          onUpgrade={() => setCurrentView('pricing')}
        />
      );
    }
    switch (currentView) {
      case 'dashboard': return <Dashboard user={localUser} />;
      case 'planner': return <Planner user={localUser} />;
      case 'timer': return <Timer onPomodoroComplete={gamification.completePomodoro} />;
      case 'assistant': return <Assistant />;
      case 'academic': return <AcademicManagement user={localUser} />;
      case 'guide': return <AcademicGuide user={localUser} onUpdateUser={handleUpdateUser} />;
      case 'research': return <GlobalResearch />;
      case 'materials': return <StudyMaterialGenerator university={localUser.universityId || 'USP'} year={localUser.currentYear || 1} subjects={['Anatomia', 'Fisiologia', 'Farmacologia', 'Clínica Médica', 'Patologia', 'Bioquímica', 'Microbiologia', 'Imunologia', 'Cardiologia', 'Neurologia', 'Pediatria', 'Ginecologia', 'Cirurgia', 'Ortopedia', 'Dermatologia', 'Psiquiatria', 'Emergência', 'Oncologia', 'Radiologia', 'Saúde Pública', 'Infectologia', 'Endocrinologia', 'Nefrologia', 'Pneumologia', 'Gastroenterologia', 'Hematologia', 'Reumatologia', 'Urologia', 'Oftalmologia', 'Otorrinolaringologia']} />;
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
      case 'reports': return <ReportExporter />;
      case 'progress': return <ProgressDashboard />;
      case 'offline': return <OfflineStudy />;
      case 'goals': return <WeeklyGoals />;
      case 'leaderboard': return <Leaderboard />;
      case 'clinicalCases': return <ClinicalCases />;
      case 'battle': return <QuestionBattle />;
      case 'heatmap': return <PerformanceHeatmap />;
      case 'smartSummary': return <SmartSummary />;
      case 'socialFeed': return <SocialFeed />;
      case 'flashcardStudy': return <FlashcardStudy />;
      case 'examCalendar': return <ExamCalendar />;
      case 'diagnosisAssistant': return <DiagnosisAssistant />;
      case 'medicalCalculators': return <MedicalCalculators />;
      case 'drugInteractions': return <DrugInteractionChecker />;
      case 'fdaDrugs': return <FDADrugSearch />;
      case 'anvisaConsult': return <ANVISAConsult />;
      case 'cid10': return <CID10Lookup />;
      case 'clinicalProtocols': return <ClinicalProtocols />;
      case 'pubmedResearch': return <PubMedResearch />;
      case 'lectureTranscription': return <LectureTranscription />;
      case 'myContent': return <MyContent />;
      case 'professorPortal': return <ProfessorPortal />;
      case 'pharmaBible': return <PharmaBible />;
      case 'adminDashboard': return <AdminDashboard userName={localUser?.name} />;
      case 'disciplines': return <MedicalDisciplines />;
      case 'videoAulas': return <VideoAulas />;
      case 'atlasAnalytics': return <AtlasAnalytics />;
      case 'medicineComparator': return <MedicineComparator />;
      case 'bulario': return <Bulario />;
      case 'doctorFinder': return <DoctorFinder />;
      case 'hospitalFinder': return <HospitalFinder />;
      case 'doctorRegistration': return <DoctorRegistration />;
      case 'healthTips': return <HealthTips />;
      case 'priceComparison': return <PriceComparison />;
      case 'legalProtection': return <LegalProtection />;
      case 'filaSUS': return <FilaSUS />;
      case 'localizadorUBS': return <LocalizadorUBS />;
      case 'carteiraVacinacao': return <CarteiraVacinacao />;
      case 'direitosSUS': return <DireitosSUS />;
      case 'symptomChecker': return <SymptomChecker />;
      case 'drugInteractionAdvanced': return <DrugInteractionAdvanced />;
      case 'mentalHealthHub': return <MentalHealthHub />;
      case 'diseaseGuides': return <DiseaseGuides />;
      case 'digitalPrescription': return <DigitalPrescription />;
      case 'medicalProcedures': return <MedicalProcedures />;
      case 'clinicalFlowcharts': return <ClinicalFlowcharts />;
      case 'anvisaAlerts': return <ANVISAAlerts />;
      case 'editorialReview': return <EditorialReview />;
      case 'medfocusiaDashboard': return <MedFocusIADashboard />;
      case 'medfocusiaPatients': return <MedFocusIAPatients />;
      case 'medfocusiaAgenda': return <MedFocusIAAgenda />;
      case 'medfocusiaDoctors': return <MedFocusIADoctors />;
      case 'medfocusiaLGPD': return <MedFocusIALGPD />;
      case 'medfocusiaPlans': return <MedFocusIAPlans />;
      case 'medfocusiaPEP': return <MedFocusIAPEP />;
      case 'medfocusiaFinanceiro': return <MedFocusIAFinanceiro />;
      case 'medfocusiaTISS': return <MedFocusIATISS />;
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
      {!termsAccepted && (
        <LegalAcceptanceModal onAccept={() => {
          localStorage.setItem('medfocus_terms_accepted', 'true');
          setTermsAccepted(true);
        }} />
      )}
      <XPToast />
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onLogout={handleLogout}
        userName={localUser.name}
        isOAuth={isAuthenticated}
        userRole={localUser.role === 'admin' ? 'admin' : localUser.role === 'professor' ? 'professor' : 'student'}
        userPlan={(localUser as any).plan || 'free'}
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
               currentView === 'calendar' ? 'Calendário Acadêmico' :
               currentView === 'reports' ? 'Exportar Relatórios' :
               currentView === 'progress' ? 'Dashboard de Progresso' :
               currentView === 'offline' ? 'Modo Offline' :
               currentView === 'goals' ? 'Metas Semanais' :
               currentView === 'leaderboard' ? 'Ranking' :
               currentView === 'clinicalCases' ? 'Casos Clínicos' :
               currentView === 'battle' ? 'Modo Batalha' :
               currentView === 'heatmap' ? 'Mapa de Desempenho' :
               currentView === 'smartSummary' ? 'Resumos Inteligentes' :
               currentView === 'socialFeed' ? 'Feed Social' :
               currentView === 'flashcardStudy' ? 'Flashcards SM-2' :
               currentView === 'examCalendar' ? 'Calendário de Provas' :
               currentView === 'lectureTranscription' ? 'Transcrição de Aulas' :
               currentView === 'myContent' ? 'Meu Conteúdo' :
               currentView === 'professorPortal' ? 'Portal do Professor' :
               currentView === 'pharmaBible' ? 'Bíblia Farmacológica' :
               currentView === 'bulario' ? 'Bulário Digital' :
               currentView === 'doctorFinder' ? 'Encontre um Médico' :
               currentView === 'healthTips' ? 'Dicas de Saúde' :
               currentView === 'priceComparison' ? 'Preços de Medicamentos' :
               currentView === 'legalProtection' ? 'Proteção Legal da Plataforma' :
               currentView === 'medicineComparator' ? 'Comparador de Medicamentos' :
               currentView === 'adminDashboard' ? 'Painel Admin' :
               currentView === 'disciplines' ? 'Disciplinas Médicas' :
               currentView === 'videoAulas' ? 'Vídeo-Aulas' :
               currentView === 'atlasAnalytics' ? 'Atlas Analytics' :
               currentView === 'filaSUS' ? 'Fila do SUS' :
               currentView === 'localizadorUBS' ? 'Guia UBS/UPA' :
               currentView === 'carteiraVacinacao' ? 'Carteira de Vacinação' :
               currentView === 'direitosSUS' ? 'Meus Direitos no SUS' :
               currentView === 'symptomChecker' ? 'Verificador de Sintomas' :
               currentView === 'drugInteractionAdvanced' ? 'Interações Medicamentosas' :
               currentView === 'mentalHealthHub' ? 'Hub de Saúde Mental' :
               currentView === 'diseaseGuides' ? 'Guias de Doenças' :
               currentView === 'digitalPrescription' ? 'Prescrição Digital' :
               currentView === 'medicalProcedures' ? 'Procedimentos Médicos' :
               currentView === 'clinicalFlowcharts' ? 'Fluxogramas Clínicos' :
               currentView === 'anvisaAlerts' ? 'Alertas ANVISA' :
               currentView === 'editorialReview' ? 'Revisão Editorial' :
               currentView === 'medfocusiaDashboard' ? 'Dashboard Clínica' :
               currentView === 'medfocusiaPatients' ? 'Gestão de Pacientes' :
               currentView === 'medfocusiaAgenda' ? 'Agenda Médica' :
               currentView === 'medfocusiaDoctors' ? 'Corpo Clínico' :
               currentView === 'medfocusiaLGPD' ? 'LGPD & Compliance' :
               currentView === 'medfocusiaPlans' ? 'Planos SaaS' : currentView}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {hasFullAccess && (
              <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                {subscriptionQuery.data?.trialActive ? `Trial (${subscriptionQuery.data.trialDaysLeft}d)` : 'PRO'}
              </span>
            )}
            {!hasFullAccess && isAuthenticated && (
              <button
                onClick={() => setCurrentView('pricing')}
                className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 hover:bg-amber-400/20 transition-colors"
              >
                Upgrade Pro
              </button>
            )}
            {isAuthenticated && authUser?.id && (
              <button
                onClick={() => {
                  const url = `${window.location.origin}/perfil/${authUser.id}`;
                  navigator.clipboard.writeText(url).then(() => {
                    import('sonner').then(m => m.toast.success('Link do perfil copiado!'));
                  });
                }}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Compartilhar perfil"
                title="Compartilhar meu perfil"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </button>
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
