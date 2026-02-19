
export interface Task {
  id: string;
  title: string;
  category: 'Anatomia' | 'Fisiologia' | 'Farmacologia' | 'Clínica' | 'Outros';
  completed: boolean;
  dueDate?: string;
}

export interface Reference {
  title: string;
  author: string;
  type: 'book' | 'article' | 'video' | 'research';
  url?: string;
  verifiedBy?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  source: string;
}

export interface SubjectContent {
  summary: string;
  keyPoints: string[];
  visualPrompt: string;
  innovations: string[];
  references: Reference[];
  quiz: QuizQuestion[];
}

export interface YearContent {
  subjects: string[];
  references: Reference[];
  videoId?: string;
  phase?: string;             // e.g. 'Básico', 'Clínico', 'Internato'
  description?: string;       // Descrição do período
  skills?: string[];          // Habilidades desenvolvidas
  practicalHours?: number;    // Horas de prática
}

export interface University {
  id: string;
  name: string;
  state: string;
  city?: string;
  curriculumType: 'PBL' | 'Tradicional' | 'Misto';
  curriculumByYear: Record<number, YearContent>;
  // MEC / ENAMED data
  mecScore?: number;          // Conceito MEC (1-5)
  enamScore?: number;         // Nota ENAMED (1-5)
  enamYear?: number;          // Ano da avaliação ENAMED
  // Metadata
  category?: 'federal' | 'estadual' | 'municipal' | 'privada' | 'comunitaria';
  foundedYear?: number;
  monthlyFee?: string;        // e.g. 'Gratuita' or 'R$ 12.000'
  totalSeats?: number;        // Vagas por ano
  duration?: string;          // e.g. '12 semestres'
  shift?: string;             // e.g. 'Integral'
  website?: string;
  // Rankings
  rufRanking?: number;        // Ranking Universitário Folha
  qsRanking?: number;         // QS World (se aplicável)
}

export type UserRole = 'student' | 'professor' | 'coordinator' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
  role: UserRole;
  universityId?: string;
  currentYear?: number;
  professorProfile?: ProfessorProfile;
  specialties?: string[];
  verifiedCredentials?: boolean;
}

export type View = 
  | 'dashboard' 
  | 'planner' 
  | 'timer' 
  | 'assistant' 
  | 'academic' 
  | 'guide' 
  | 'research' 
  | 'materials' 
  | 'weekly' 
  | 'library' 
  | 'studyContent'
  | 'validated-library'
  | 'quiz'
  | 'professor'
  | 'gamification'
  | 'pricing'
  | 'notifications'
  | 'resources'
  | 'spacedRepetition'
  | 'classroom'
  | 'analytics'
  | 'roadmap'
  | 'simulado'
  | 'atlas'
  | 'studyRooms'
  | 'calendar'
  | 'reports'
  | 'progress'
  | 'offline'
  | 'goals'
  | 'leaderboard'
  | 'clinicalCases'
  | 'battle'
  | 'heatmap'
  | 'smartSummary'
  | 'socialFeed'
  | 'flashcardStudy'
  | 'examCalendar';

// Fix: Adding missing interfaces for Grades component
export interface GradeItem {
  id: string;
  title: string;
  value: number;
  weight: number;
}

export interface Subject {
  id: string;
  name: string;
  exams: GradeItem[];
  assignments: GradeItem[];
  targetAverage: number;
}

// Fix: Adding missing interface for Attendance component
export interface AttendanceSubject {
  id: string;
  name: string;
  totalClasses: number;
  absences: number;
  requiredPresence: number;
}

// ============================================================================
// Academic Materials System - Types for university content aggregation
// ============================================================================

export type MaterialType = 
  | 'apostila'      // Handouts/Study guides
  | 'artigo'        // Scientific articles
  | 'livro'         // Books
  | 'video'         // Video lectures
  | 'slides'        // Presentation slides
  | 'exercicio'     // Exercises/problem sets
  | 'prova'         // Past exams
  | 'resumo'        // Summaries
  | 'pesquisa';     // Research papers

export type Semester = 1 | 2;

export interface AcademicMaterial {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  
  // Metadata - University and Academic Context
  universityId: string;
  universityName: string;
  department?: string;
  course: string;              // e.g., "Medicina", "Enfermagem"
  
  // Academic Period
  year: number;                // Academic year (1-6 for Medicine)
  semester: Semester;          // 1 or 2
  academicYear?: string;       // e.g., "2024"
  
  // Subject/Discipline
  subjectId: string;
  subjectName: string;         // e.g., "Anatomia", "Fisiologia"
  module?: string;             // e.g., "Aparelho Cardiovascular"
  
  // Content Details
  authors?: string[];
  professor?: string;
  fileUrl?: string;
  externalUrl?: string;
  thumbnailUrl?: string;
  pageCount?: number;
  duration?: number;           // For videos (in minutes)
  
  // Metadata
  tags: string[];
  language: string;            // "pt-BR", "en", etc.
  createdAt: string;
  updatedAt: string;
  uploadedBy?: string;
  
  // Engagement
  downloads: number;
  views: number;
  rating?: number;             // 0-5 stars
  verified: boolean;           // Verified by institution/admin
}

export interface MaterialFilter {
  universityId?: string;
  year?: number;
  semester?: Semester;
  subjectId?: string;
  type?: MaterialType;
  searchTerm?: string;
  tags?: string[];
  verified?: boolean;
}

export interface UniversityMaterialStats {
  universityId: string;
  universityName: string;
  totalMaterials: number;
  materialsByType: Record<MaterialType, number>;
  materialsByYear: Record<number, number>;
  lastUpdated: string;
}

export interface MaterialCollection {
  id: string;
  name: string;
  description: string;
  materials: AcademicMaterial[];
  createdBy: string;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
}

// ============================================================================
// Academic Validation and Quality System
// ============================================================================

export type ReferenceQuality = 'gold' | 'silver' | 'bronze' | 'pending';

export interface AcademicReference {
  id: string;
  title: string;
  authors: string[];
  source: string; // Journal name, Publisher, etc.
  year: number;
  doi?: string;
  pmid?: string; // PubMed ID
  isbn?: string;
  url?: string;
  quality: ReferenceQuality;
  verifiedBy?: string; // Professor/Institution ID
  citationCount?: number;
}

export interface ValidatedContent {
  materialId: string;
  references: AcademicReference[];
  reviewedBy: string[]; // Professor IDs
  reviewDate: string;
  qualityScore: number; // 0-100
  isConsensus: boolean; // Agreed by multiple professors
}

// ============================================================================
// Progressive Learning System (Year 1-6)
// ============================================================================

export type MedicalYear = 1 | 2 | 3 | 4 | 5 | 6;

export interface ProgressiveQuiz {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'basico' | 'intermediario' | 'avancado' | 'residencia';
  targetYear: MedicalYear; // Which year this question is appropriate for
  topics: string[];
  bloomLevel: 'conhecimento' | 'compreensao' | 'aplicacao' | 'analise' | 'sintese' | 'avaliacao';
  estimatedTime: number; // seconds
  references: AcademicReference[];
}

export interface LearningPath {
  year: MedicalYear;
  semester: Semester;
  subjects: {
    subjectId: string;
    subjectName: string;
    prerequisites: string[];
    coreCompetencies: string[];
    practicalSkills: string[];
    theoreticalDepth: number; // 0-100
  }[];
}

// ============================================================================
// Professor and Instructor Features
// ============================================================================

export type ProfessorRole = 'professor' | 'coordinator' | 'guest_lecturer';

export interface ProfessorProfile {
  id: string;
  name: string;
  email: string;
  universityId: string;
  universityName: string;
  role: ProfessorRole;
  specialties: string[];
  verifiedCredentials: boolean;
  
  // Academic credentials
  lattes?: string; // Lattes CV URL
  orcid?: string;
  googleScholar?: string;
  
  // Platform features
  canValidateMaterials: boolean;
  canCreateStudyRooms: boolean;
  canModerateContent: boolean;
  
  // Statistics
  materialsContributed: number;
  studentsImpacted: number;
  validationsPerformed: number;
}

export interface StudyRoom {
  id: string;
  name: string;
  description: string;
  professorId: string;
  professorName: string;
  universityId: string;
  
  // Access control
  isPublic: boolean;
  enrollmentCode?: string;
  maxStudents?: number;
  
  // Content
  materials: string[]; // Material IDs
  announcements: Announcement[];
  assignments: Assignment[];
  
  // Schedule
  meetingSchedule?: {
    day: string;
    time: string;
    location: string;
  }[];
  
  // Participants
  students: string[]; // Student IDs
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  studyRoomId: string;
  title: string;
  content: string;
  attachments?: string[];
  createdAt: string;
  createdBy: string;
  isPinned: boolean;
}

export interface Assignment {
  id: string;
  studyRoomId: string;
  title: string;
  description: string;
  materials: string[]; // Material IDs
  dueDate: string;
  submissions: Submission[];
  createdAt: string;
  createdBy: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  attachments?: string[];
  submittedAt: string;
  grade?: number;
  feedback?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

// ============================================================================
// Content Quality Tiers
// ============================================================================

export type ContentTier = 'validated' | 'community' | 'experimental';

export interface TieredMaterial extends AcademicMaterial {
  tier: ContentTier;
  validationStatus: {
    isValidated: boolean;
    validatedBy: string[]; // Professor IDs
    validationDate?: string;
    qualityScore: number;
    hasConsensus: boolean;
  };
  references: AcademicReference[];
}
