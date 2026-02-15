
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
