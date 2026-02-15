
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
}

export interface University {
  id: string;
  name: string;
  state: string;
  curriculumType: 'PBL' | 'Tradicional' | 'Misto';
  curriculumByYear: Record<number, YearContent>;
}

export interface User {
  name: string;
  email: string;
  isLoggedIn: boolean;
  universityId?: string;
  currentYear?: number;
}

export type View = 'dashboard' | 'planner' | 'timer' | 'assistant' | 'academic' | 'guide' | 'research' | 'materials' | 'weekly' | 'library' | 'gamification';

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
