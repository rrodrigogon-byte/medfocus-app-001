import React, { useState, useEffect, lazy, Suspense } from 'react';
import { User, View } from '../types';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import Login from '../components/medfocus/Login';
import Dashboard from '../components/medfocus/Dashboard';
import Sidebar from '../components/medfocus/Sidebar';
import XPToast from '../components/medfocus/XPToast';
import Breadcrumbs from '../components/medfocus/Breadcrumbs';
import ProPaywall from '../components/medfocus/ProPaywall';
import { MedFocusIADashboard, MedFocusIAPatients, MedFocusIAAgenda, MedFocusIADoctors, MedFocusIALGPD, MedFocusIAPlans } from '../components/medfocus/MedFocusIASaaS';
import { MedFocusIAPEP } from '../components/medfocus/MedFocusIAPEP';
import { MedFocusIAFinanceiro } from '../components/medfocus/MedFocusIAFinanceiro';
import { MedFocusIATISS } from '../components/medfocus/MedFocusIATISS';
import { MedFocusIATelemedicina } from '../components/medfocus/MedFocusIATelemedicina';
import { MedFocusIARelatorios } from '../components/medfocus/MedFocusIARelatorios';
import { MedFocusIAEstoque } from '../components/medfocus/MedFocusIAEstoque';
import { ProntuarioInteligente } from '../components/medfocus/ProntuarioInteligente';
import { VerificadorInteracoes } from '../components/medfocus/VerificadorInteracoes';
import { LiteraturaAutomatica } from '../components/medfocus/LiteraturaAutomatica';
import { TriagemPreditiva } from '../components/medfocus/TriagemPreditiva';
import { ViralGramHub } from '../components/medfocus/ViralGramHub';
import { VGConteudoMedico } from '../components/medfocus/VGConteudoMedico';
import { VGLinkedIn } from '../components/medfocus/VGLinkedIn';
import { VGInstagram } from '../components/medfocus/VGInstagram';
import { VGWhatsApp } from '../components/medfocus/VGWhatsApp';
import { VGComplianceMedico } from '../components/medfocus/VGComplianceMedico';
import { EvidenceBasedHub } from '../components/medfocus/EvidenceBasedHub';
import { TranscricaoClinica } from '../components/medfocus/TranscricaoClinica';
import { EvolucaoExames } from '../components/medfocus/EvolucaoExames';
import { ProtocolosInteligentes } from '../components/medfocus/ProtocolosInteligentes';
import { HealthTimeline } from '../components/medfocus/HealthTimeline';
import { CentralAlertas } from '../components/medfocus/CentralAlertas';
import { AgendaInteligente } from '../components/medfocus/AgendaInteligente';
import { GestaoConvenios } from '../components/medfocus/GestaoConvenios';
import { ControleAcesso } from '../components/medfocus/ControleAcesso';
import { PainelAdminMaster } from '../components/medfocus/PainelAdminMaster';
import { FaturamentoNFSe } from '../components/medfocus/FaturamentoNFSe';
import { CRMMedico } from '../components/medfocus/CRMMedico';
import { LegalAcceptanceModal } from '../components/medfocus/LegalProtection';
import { useTheme } from '../contexts/ThemeContext';
import { trpc } from '@/lib/trpc';
import { useGamification } from '../hooks/useGamification';

// ── Lazy-loaded components (code splitting) ──
const Planner = lazy(() => import('../components/medfocus/Planner'));
const Timer = lazy(() => import('../components/medfocus/Timer'));
const Assistant = lazy(() => import('../components/medfocus/Assistant'));
const AcademicManagement = lazy(() => import('../components/medfocus/AcademicManagement'));
const AcademicGuide = lazy(() => import('../components/medfocus/AcademicGuide'));
const GlobalResearch = lazy(() => import('../components/medfocus/GlobalResearch'));
const StudyMaterialGenerator = lazy(() => import('../components/medfocus/StudyMaterialGenerator'));
const WeeklyStudyChecklist = lazy(() => import('../components/medfocus/WeeklyStudyChecklist'));
const PreloadedStudy = lazy(() => import('../components/medfocus/PreloadedStudy'));
const AcademicLibrary = lazy(() => import('../components/medfocus/AcademicLibrary'));
const ValidatedLibrary = lazy(() => import('../components/medfocus/ValidatedLibrary'));
const ProgressiveQuizSystem = lazy(() => import('../components/medfocus/ProgressiveQuizSystem'));
const ProfessorDashboard = lazy(() => import('../components/medfocus/ProfessorDashboard'));
const GamificationPanel = lazy(() => import('../components/medfocus/GamificationPanel'));
const NotificationSettingsPanel = lazy(() => import('../components/medfocus/NotificationSettings'));
const PricingPlans = lazy(() => import('../components/medfocus/PricingPlans'));
const AcademicResourcesPanel = lazy(() => import('../components/medfocus/AcademicResourcesPanel'));
const SpacedRepetitionPanel = lazy(() => import('../components/medfocus/SpacedRepetitionPanel'));
const ClassroomPanel = lazy(() => import('../components/medfocus/ClassroomPanel'));
const TeacherAnalyticsPanel = lazy(() => import('../components/medfocus/TeacherAnalyticsPanel'));
const MedicalRoadmap = lazy(() => import('../components/medfocus/MedicalRoadmap'));
const SimuladoENAMED = lazy(() => import('../components/medfocus/SimuladoENAMED'));
const AnatomyAtlas = lazy(() => import('../components/medfocus/AnatomyAtlas'));
const StudyRooms = lazy(() => import('../components/medfocus/StudyRooms'));
const AcademicCalendar = lazy(() => import('../components/medfocus/AcademicCalendar'));
const ReportExporter = lazy(() => import('../components/medfocus/ReportExporter'));
const ProgressDashboard = lazy(() => import('../components/medfocus/ProgressDashboard'));
const OfflineStudy = lazy(() => import('../components/medfocus/OfflineStudy'));
const WeeklyGoals = lazy(() => import('../components/medfocus/WeeklyGoals'));
const Leaderboard = lazy(() => import('../components/medfocus/Leaderboard'));
const ClinicalCases = lazy(() => import('../components/medfocus/ClinicalCases'));
const QuestionBattle = lazy(() => import('../components/medfocus/QuestionBattle'));
const PerformanceHeatmap = lazy(() => import('../components/medfocus/PerformanceHeatmap'));
const SmartSummary = lazy(() => import('../components/medfocus/SmartSummary'));
const SocialFeed = lazy(() => import('../components/medfocus/SocialFeed'));
const FlashcardStudy = lazy(() => import('../components/medfocus/FlashcardStudy'));
const ExamCalendar = lazy(() => import('../components/medfocus/ExamCalendar'));
const DiagnosisAssistant = lazy(() => import('../components/medfocus/DiagnosisAssistant'));
const MedicalCalculators = lazy(() => import('../components/medfocus/MedicalCalculators'));
const DrugInteractionChecker = lazy(() => import('../components/medfocus/DrugInteractionChecker'));
const FDADrugSearch = lazy(() => import('../components/medfocus/FDADrugSearch'));
const ANVISAConsult = lazy(() => import('../components/medfocus/ANVISAConsult'));
const CID10Lookup = lazy(() => import('../components/medfocus/CID10Lookup'));
const ClinicalProtocols = lazy(() => import('../components/medfocus/ClinicalProtocols'));
const PubMedResearch = lazy(() => import('../components/medfocus/PubMedResearch'));
const LectureTranscription = lazy(() => import('../components/medfocus/LectureTranscription'));
const MyContent = lazy(() => import('../components/medfocus/MyContent'));
const ProfessorPortal = lazy(() => import('../components/medfocus/ProfessorPortal'));
const PharmaBible = lazy(() => import('../components/medfocus/PharmaBible'));
const AdminDashboard = lazy(() => import('../components/medfocus/AdminDashboard'));
const MedicalDisciplines = lazy(() => import('../components/medfocus/MedicalDisciplines'));
const VideoAulas = lazy(() => import('../components/medfocus/VideoAulas'));
const AtlasAnalytics = lazy(() => import('../components/medfocus/AtlasAnalytics'));
const MedicineComparator = lazy(() => import('../components/medfocus/MedicineComparator'));
const Bulario = lazy(() => import('../components/medfocus/Bulario'));
const DoctorFinder = lazy(() => import('../components/medfocus/DoctorFinder'));
const HospitalFinder = lazy(() => import('../components/medfocus/HospitalFinder'));
const DoctorRegistration = lazy(() => import('../components/medfocus/DoctorRegistration'));
const HealthTips = lazy(() => import('../components/medfocus/HealthTips'));
const PriceComparison = lazy(() => import('../components/medfocus/PriceComparison'));
const LegalProtection = lazy(() => import('../components/medfocus/LegalProtection'));
const FilaSUS = lazy(() => import('../components/medfocus/FilaSUS'));
const LocalizadorUBS = lazy(() => import('../components/medfocus/LocalizadorUBS'));
const CarteiraVacinacao = lazy(() => import('../components/medfocus/CarteiraVacinacao'));
const DireitosSUS = lazy(() => import('../components/medfocus/DireitosSUS'));
const SymptomChecker = lazy(() => import('../components/medfocus/SymptomChecker'));
const DrugInteractionAdvanced = lazy(() => import('../components/medfocus/DrugInteractionAdvanced'));
const MentalHealthHub = lazy(() => import('../components/medfocus/MentalHealthHub'));
const DiseaseGuides = lazy(() => import('../components/medfocus/DiseaseGuides'));
const DigitalPrescription = lazy(() => import('../components/medfocus/DigitalPrescription'));
const MedicalProcedures = lazy(() => import('../components/medfocus/MedicalProcedures'));
const ClinicalFlowcharts = lazy(() => import('../components/medfocus/ClinicalFlowcharts'));
const ANVISAAlerts = lazy(() => import('../components/medfocus/ANVISAAlerts'));
const EditorialReview = lazy(() => import('../components/medfocus/EditorialReview'));
const ProntuarioZeroDigitacao = lazy(() => import('../components/medfocus/ProntuarioZeroDigitacao'));
const JornadaDigitalPaciente = lazy(() => import('../components/medfocus/JornadaDigitalPaciente'));
const BIAvancado = lazy(() => import('../components/medfocus/BIAvancado'));
const GestaoDocumentos = lazy(() => import('../components/medfocus/GestaoDocumentos'));
const HubAcademico = lazy(() => import('../components/medfocus/HubAcademico'));
const InteracoesOpenFDA = lazy(() => import('../components/medfocus/InteracoesOpenFDA'));
const VGCalendarioEditorial = lazy(() => import('../components/medfocus/VGCalendarioEditorial'));
const VGAutoConteudo = lazy(() => import('../components/medfocus/VGAutoConteudo'));
const VGMetricsAnalytics = lazy(() => import('../components/medfocus/VGMetricsAnalytics'));
const VGDiagnosticoMarca = lazy(() => import('../components/medfocus/VGDiagnosticoMarca'));
const VGAgendamento = lazy(() => import('../components/medfocus/VGAgendamento'));
const VGTemplates = lazy(() => import('../components/medfocus/VGTemplates'));
const IALaudosImagem = lazy(() => import('../components/medfocus/IALaudosImagem'));
const ImportacaoBackup = lazy(() => import('../components/medfocus/ImportacaoBackup'));
const RelatoriosTISS = lazy(() => import('../components/medfocus/RelatoriosTISS'));
const AssinaturaDigital = lazy(() => import('../components/medfocus/AssinaturaDigital'));
const PWAOffline = lazy(() => import('../components/medfocus/PWAOffline'));
const BancoQuestoesExpanded = lazy(() => import('../components/medfocus/BancoQuestoesExpanded'));
const SimuladorCirurgias = lazy(() => import('../components/medfocus/SimuladorCirurgias'));
const RNDSIntegracao = lazy(() => import('../components/medfocus/RNDSIntegracao'));
const ResidenciaMedica = lazy(() => import('../components/medfocus/ResidenciaMedica'));
const CentralEmergencia = lazy(() => import('../components/medfocus/CentralEmergencia'));
const PesquisaClinica = lazy(() => import('../components/medfocus/PesquisaClinica'));
const PainelEpidemiologia = lazy(() => import('../components/medfocus/PainelEpidemiologia'));
const EducacaoContinuada = lazy(() => import('../components/medfocus/EducacaoContinuada'));
const MarketplaceMedico = lazy(() => import('../components/medfocus/MarketplaceMedico'));
const AnalyticsDashboard = lazy(() => import('../components/medfocus/AnalyticsDashboard'));
const MedFocusCopilot = lazy(() => import('../components/medfocus/MedFocusCopilot'));
const PacienteVirtual = lazy(() => import('../components/medfocus/PacienteVirtual'));
const MapaSaudeBrasil = lazy(() => import('../components/medfocus/MapaSaudeBrasil'));
const GeradorLaudos = lazy(() => import('../components/medfocus/GeradorLaudos'));
const TimelineClinica = lazy(() => import('../components/medfocus/TimelineClinica'));
const MedFocusAcademy = lazy(() => import('../components/medfocus/MedFocusAcademy'));
const ComparadorProtocolos = lazy(() => import('../components/medfocus/ComparadorProtocolos'));
const Farmacovigilancia = lazy(() => import('../components/medfocus/Farmacovigilancia'));
/**
 * MedFocus Main Application Page
 * Design: Medical Precision — Teal accent, Outfit display, Plus Jakarta Sans body
 * Auth: Manus OAuth (Gmail) + Guest mode
 */

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
      case 'medfocusiaTelemedicina': return <MedFocusIATelemedicina />;
      case 'medfocusiaRelatorios': return <MedFocusIARelatorios />;
      case 'medfocusiaEstoque': return <MedFocusIAEstoque />;
      case 'prontuarioInteligente': return <ProntuarioInteligente />;
      case 'verificadorInteracoes': return <VerificadorInteracoes />;
      case 'literaturaAutomatica': return <LiteraturaAutomatica />;
      case 'triagemPreditiva': return <TriagemPreditiva />;
      case 'viralgramHub': return <ViralGramHub />;
      case 'vgConteudoMedico': return <VGConteudoMedico />;
      case 'vgLinkedIn': return <VGLinkedIn />;
      case 'vgInstagram': return <VGInstagram />;
      case 'vgWhatsApp': return <VGWhatsApp />;
      case 'vgComplianceMedico': return <VGComplianceMedico />;
      case 'evidenceBasedHub': return <EvidenceBasedHub />;
      case 'transcricaoClinica': return <TranscricaoClinica />;
      case 'evolucaoExames': return <EvolucaoExames />;
      case 'protocolosInteligentes': return <ProtocolosInteligentes />;
      case 'healthTimeline': return <HealthTimeline />;
      case 'centralAlertas': return <CentralAlertas />;
      case 'agendaInteligente': return <AgendaInteligente />;
      case 'gestaoConvenios': return <GestaoConvenios />;
      case 'controleAcesso': return <ControleAcesso />;
      case 'painelAdminMaster': return <PainelAdminMaster />;
      case 'faturamentoNFSe': return <FaturamentoNFSe />;
      case 'crmMedico': return <CRMMedico />;
      case 'prontuarioZeroDigitacao': return <ProntuarioZeroDigitacao />;
      case 'jornadaDigitalPaciente': return <JornadaDigitalPaciente />;
      case 'biAvancado': return <BIAvancado />;
      case 'gestaoDocumentos': return <GestaoDocumentos />;
      case 'hubAcademico': return <HubAcademico />;
      case 'interacoesOpenFDA': return <InteracoesOpenFDA />;
      case 'vgCalendarioEditorial': return <VGCalendarioEditorial />;
      case 'vgAutoConteudo': return <VGAutoConteudo />;
      case 'vgMetricsAnalytics': return <VGMetricsAnalytics />;
      case 'vgDiagnosticoMarca': return <VGDiagnosticoMarca />;
      case 'vgAgendamento': return <VGAgendamento />;
      case 'vgTemplates': return <VGTemplates />;
      case 'iaLaudosImagem': return <IALaudosImagem />;
      case 'importacaoBackup': return <ImportacaoBackup />;
      case 'relatoriosTISS': return <RelatoriosTISS />;
      case 'assinaturaDigital': return <AssinaturaDigital />;
      case 'pwaOffline': return <PWAOffline />;
      case 'bancoQuestoesExpanded': return <BancoQuestoesExpanded />;
      case 'simuladorCirurgias': return <SimuladorCirurgias />;
      case 'rndsIntegracao': return <RNDSIntegracao />;
      case 'residenciaMedica': return <ResidenciaMedica />;
      case 'centralEmergencia': return <CentralEmergencia />;
      case 'pesquisaClinica': return <PesquisaClinica />;
      case 'painelEpidemiologia': return <PainelEpidemiologia />;
      case 'educacaoContinuada': return <EducacaoContinuada />;
      case 'marketplaceMedico': return <MarketplaceMedico />;
      case 'analyticsDashboard': return <AnalyticsDashboard />;
      case 'medFocusCopilot': return <MedFocusCopilot />;
      case 'pacienteVirtual': return <PacienteVirtual />;
      case 'mapaSaudeBrasil': return <MapaSaudeBrasil />;
      case 'geradorLaudos': return <GeradorLaudos />;
      case 'timelineClinica': return <TimelineClinica />;
      case 'medFocusAcademy': return <MedFocusAcademy />;
      case 'comparadorProtocolos': return <ComparadorProtocolos />;
      case 'farmacovigilancia': return <Farmacovigilancia />;
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
          <Breadcrumbs currentView={currentView} onNavigate={setCurrentView} />
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
              <p className="text-sm text-muted-foreground mt-4">Carregando módulo...</p>
            </div>
          }>
            {renderView()}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
