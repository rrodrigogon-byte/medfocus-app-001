/**
 * MedFocus Breadcrumbs Component
 * Shows navigation path: Seção > Módulo
 */
import React from 'react';
import { View } from '../../types';

interface BreadcrumbsProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

// Map each view to its section and display name
const VIEW_MAP: Record<string, { section: string; sectionView: View; name: string }> = {
  // Principal
  dashboard: { section: 'Principal', sectionView: 'dashboard', name: 'Painel' },
  planner: { section: 'Principal', sectionView: 'dashboard', name: 'Cronograma' },
  timer: { section: 'Principal', sectionView: 'dashboard', name: 'Pomodoro' },
  weekly: { section: 'Principal', sectionView: 'dashboard', name: 'Checklist Semanal' },
  goals: { section: 'Principal', sectionView: 'dashboard', name: 'Metas Semanais' },
  assistant: { section: 'Principal', sectionView: 'dashboard', name: 'MedGenie AI' },
  gamification: { section: 'Principal', sectionView: 'dashboard', name: 'Conquistas & XP' },
  leaderboard: { section: 'Principal', sectionView: 'dashboard', name: 'Ranking' },
  progress: { section: 'Principal', sectionView: 'dashboard', name: 'Dashboard de Progresso' },

  // Estudo & Conteúdo
  studyContent: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Conteúdo de Estudo' },
  library: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Biblioteca Acadêmica' },
  'validated-library': { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Conteúdo Validado' },
  materials: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Materiais de Estudo' },
  resources: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Recursos Acadêmicos' },
  flashcardStudy: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Flashcards SM-2' },
  spacedRepetition: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Revisão Espaçada' },
  quiz: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Quiz Avançado' },
  smartSummary: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Resumos Inteligentes' },
  research: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Pesquisa Global' },
  disciplines: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Disciplinas Médicas' },
  videoAulas: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Vídeo-Aulas' },
  lectureTranscription: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Transcrição de Aulas' },
  myContent: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Meu Conteúdo' },
  clinicalCases: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Casos Clínicos' },
  battle: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Modo Batalha' },
  simulado: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Simulados ENAMED' },
  roadmap: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Jornada Médica' },
  guide: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Universidades' },
  academic: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Gestão Acadêmica' },
  calendar: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Calendário Acadêmico' },
  examCalendar: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Calendário de Provas' },
  heatmap: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Mapa de Desempenho' },
  offline: { section: 'Estudo & Conteúdo', sectionView: 'studyContent', name: 'Modo Offline' },

  // Prática Clínica & IA
  atlas: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Atlas Anatômico' },
  atlasAnalytics: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Atlas Analytics' },
  clinicalProtocols: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Protocolos Clínicos' },
  pharmaBible: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Bíblia Farmacológica' },
  bulario: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Bulário Digital' },
  medicineComparator: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Comparador de Medicamentos' },
  symptomChecker: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Verificador de Sintomas' },
  drugInteractionAdvanced: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Interações Medicamentosas' },
  diseaseGuides: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Guias de Doenças' },
  digitalPrescription: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Prescrição Digital' },
  medicalProcedures: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Procedimentos Médicos' },
  clinicalFlowcharts: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Fluxogramas Clínicos' },
  anvisaAlerts: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Alertas ANVISA' },
  mentalHealthHub: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Hub de Saúde Mental' },
  healthTips: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Dicas de Saúde' },
  prontuarioInteligente: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Prontuário Inteligente' },
  verificadorInteracoes: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Verificador de Interações' },
  literaturaAutomatica: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Literatura Automática' },
  triagemPreditiva: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Triagem Preditiva' },
  evidenceBasedHub: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Medicina Baseada em Evidências' },
  transcricaoClinica: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Transcrição Clínica' },
  evolucaoExames: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Evolução de Exames' },
  protocolosInteligentes: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Protocolos Inteligentes' },
  healthTimeline: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Health Timeline' },
  centralAlertas: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Central de Alertas' },
  interacoesOpenFDA: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Interações OpenFDA' },
  prontuarioZeroDigitacao: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Prontuário Zero Digitação' },
  jornadaDigitalPaciente: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Jornada Digital do Paciente' },
  biAvancado: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'BI Avançado' },
  gestaoDocumentos: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Gestão de Documentos' },
  hubAcademico: { section: 'Prática Clínica & IA', sectionView: 'atlas', name: 'Hub Acadêmico' },

  // Saúde Pública
  filaSUS: { section: 'Saúde Pública', sectionView: 'filaSUS', name: 'Fila do SUS' },
  localizadorUBS: { section: 'Saúde Pública', sectionView: 'filaSUS', name: 'Guia UBS/UPA' },
  carteiraVacinacao: { section: 'Saúde Pública', sectionView: 'filaSUS', name: 'Carteira de Vacinação' },
  direitosSUS: { section: 'Saúde Pública', sectionView: 'filaSUS', name: 'Meus Direitos no SUS' },
  doctorFinder: { section: 'Saúde Pública', sectionView: 'filaSUS', name: 'Encontre um Médico' },
  priceComparison: { section: 'Saúde Pública', sectionView: 'filaSUS', name: 'Preços de Medicamentos' },

  // MedFocusIA SaaS
  medfocusiaDashboard: { section: 'MedFocusIA SaaS', sectionView: 'medfocusiaDashboard', name: 'Dashboard Clínica' },
  medfocusiaPatients: { section: 'MedFocusIA SaaS', sectionView: 'medfocusiaDashboard', name: 'Gestão de Pacientes' },
  medfocusiaAgenda: { section: 'MedFocusIA SaaS', sectionView: 'medfocusiaDashboard', name: 'Agenda Médica' },
  medfocusiaDoctors: { section: 'MedFocusIA SaaS', sectionView: 'medfocusiaDashboard', name: 'Corpo Clínico' },
  medfocusiaLGPD: { section: 'MedFocusIA SaaS', sectionView: 'medfocusiaDashboard', name: 'LGPD & Compliance' },
  medfocusiaPlans: { section: 'MedFocusIA SaaS', sectionView: 'medfocusiaDashboard', name: 'Planos SaaS' },
  medfocusiaPEP: { section: 'MedFocusIA SaaS', sectionView: 'medfocusiaDashboard', name: 'Prontuário Eletrônico' },
  medfocusiaFinanceiro: { section: 'MedFocusIA SaaS', sectionView: 'medfocusiaDashboard', name: 'Financeiro' },
  medfocusiaTISS: { section: 'MedFocusIA SaaS', sectionView: 'medfocusiaDashboard', name: 'TISS Convênios' },
  medfocusiaTelemedicina: { section: 'MedFocusIA SaaS', sectionView: 'medfocusiaDashboard', name: 'Telemedicina' },
  medfocusiaRelatorios: { section: 'MedFocusIA SaaS', sectionView: 'medfocusiaDashboard', name: 'Relatórios & Analytics' },
  medfocusiaEstoque: { section: 'MedFocusIA SaaS', sectionView: 'medfocusiaDashboard', name: 'Estoque & Farmácia' },
  agendaInteligente: { section: 'MedFocusIA SaaS', sectionView: 'medfocusiaDashboard', name: 'Agenda Inteligente' },
  gestaoConvenios: { section: 'MedFocusIA SaaS', sectionView: 'medfocusiaDashboard', name: 'Gestão de Convênios' },
  controleAcesso: { section: 'MedFocusIA SaaS', sectionView: 'medfocusiaDashboard', name: 'Controle de Acesso' },
  painelAdminMaster: { section: 'MedFocusIA SaaS', sectionView: 'medfocusiaDashboard', name: 'Painel Admin Master' },
  faturamentoNFSe: { section: 'MedFocusIA SaaS', sectionView: 'medfocusiaDashboard', name: 'Faturamento & NFS-e' },
  crmMedico: { section: 'MedFocusIA SaaS', sectionView: 'medfocusiaDashboard', name: 'CRM Médico' },

  // ViralGram
  viralgramHub: { section: 'ViralGram', sectionView: 'viralgramHub', name: 'ViralGram Hub' },
  vgConteudoMedico: { section: 'ViralGram', sectionView: 'viralgramHub', name: 'Conteúdo Médico' },
  vgLinkedIn: { section: 'ViralGram', sectionView: 'viralgramHub', name: 'LinkedIn' },
  vgInstagram: { section: 'ViralGram', sectionView: 'viralgramHub', name: 'Instagram' },
  vgWhatsApp: { section: 'ViralGram', sectionView: 'viralgramHub', name: 'WhatsApp Business' },
  vgComplianceMedico: { section: 'ViralGram', sectionView: 'viralgramHub', name: 'Compliance Médico' },
  vgCalendarioEditorial: { section: 'ViralGram', sectionView: 'viralgramHub', name: 'Calendário Editorial' },
  vgAutoConteudo: { section: 'ViralGram', sectionView: 'viralgramHub', name: 'Auto Conteúdo IA' },
  vgMetricsAnalytics: { section: 'ViralGram', sectionView: 'viralgramHub', name: 'Métricas & Analytics' },
  vgDiagnosticoMarca: { section: 'ViralGram', sectionView: 'viralgramHub', name: 'Diagnóstico de Marca' },
  vgAgendamento: { section: 'ViralGram', sectionView: 'viralgramHub', name: 'Agendamento' },
  vgTemplates: { section: 'ViralGram', sectionView: 'viralgramHub', name: 'Templates' },

  // Professor
  professor: { section: 'Professor', sectionView: 'professor', name: 'Painel do Professor' },
  professorPortal: { section: 'Professor', sectionView: 'professor', name: 'Portal do Professor' },
  classroom: { section: 'Professor', sectionView: 'professor', name: 'Sala de Aula' },
  analyticsTeacher: { section: 'Professor', sectionView: 'professor', name: 'Analytics de Turma' },
  reports: { section: 'Professor', sectionView: 'professor', name: 'Exportar Relatórios' },
  editorialReview: { section: 'Professor', sectionView: 'professor', name: 'Revisão Editorial' },

  // Conta
  socialFeed: { section: 'Conta', sectionView: 'socialFeed', name: 'Feed Social' },
  studyRooms: { section: 'Conta', sectionView: 'socialFeed', name: 'Salas de Estudo' },
  notifications: { section: 'Conta', sectionView: 'socialFeed', name: 'Notificações' },
  pricing: { section: 'Conta', sectionView: 'socialFeed', name: 'Planos & Pagamento' },
  legalProtection: { section: 'Legal', sectionView: 'legalProtection', name: 'Proteção Legal' },
  adminDashboard: { section: 'Admin', sectionView: 'adminDashboard', name: 'Painel Admin' },
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentView, onNavigate }) => {
  const info = VIEW_MAP[currentView];
  if (!info) return null;

  return (
    <nav className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-0.5">
      <button
        onClick={() => onNavigate('dashboard')}
        className="hover:text-foreground transition-colors"
      >
        MedFocus
      </button>
      <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <button
        onClick={() => onNavigate(info.sectionView)}
        className="hover:text-foreground transition-colors"
      >
        {info.section}
      </button>
      <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <span className="text-foreground font-medium">{info.name}</span>
    </nav>
  );
};

export default Breadcrumbs;
