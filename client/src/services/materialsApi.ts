/**
 * Materials API Service
 * Comprehensive service for managing academic materials
 * AI features now delegate to tRPC server-side LLM
 */

import { 
  AcademicMaterial, 
  MaterialFilter, 
  MaterialType,
  Semester 
} from '../types';

const API_BASE = '/api/materials'; // Server endpoint (to be implemented)

// ============================================================================
// Material CRUD Operations
// ============================================================================

export async function fetchMaterials(filter?: MaterialFilter): Promise<AcademicMaterial[]> {
  try {
    const params = new URLSearchParams();
    if (filter?.universityId) params.append('universityId', filter.universityId);
    if (filter?.year) params.append('year', filter.year.toString());
    if (filter?.semester) params.append('semester', filter.semester.toString());
    if (filter?.type) params.append('type', filter.type);
    if (filter?.subjectId) params.append('subjectId', filter.subjectId);
    if (filter?.searchTerm) params.append('search', filter.searchTerm);
    if (filter?.verified !== undefined) params.append('verified', filter.verified.toString());

    const response = await fetch(`${API_BASE}?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch materials');
    return await response.json();
  } catch (error) {
    console.error('Error fetching materials:', error);
    return getMockMaterials(filter);
  }
}

export async function getMaterial(id: string): Promise<AcademicMaterial | null> {
  try {
    const response = await fetch(`${API_BASE}/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching material:', error);
    return null;
  }
}

export async function uploadMaterial(
  file: File, 
  metadata: Partial<AcademicMaterial>
): Promise<AcademicMaterial> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('metadata', JSON.stringify(metadata));

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Upload failed');
  return await response.json();
}

export async function updateMaterial(
  id: string, 
  updates: Partial<AcademicMaterial>
): Promise<AcademicMaterial> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) throw new Error('Update failed');
  return await response.json();
}

export async function deleteMaterial(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Delete failed');
}

// ============================================================================
// AI-Powered Features (now use tRPC server-side)
// These functions are kept as interfaces for components that may still import them.
// For new code, use trpc.ai.* mutations directly.
// ============================================================================

export interface MaterialAnalysis {
  summary: string;
  keyTopics: string[];
  difficulty: 'iniciante' | 'intermediário' | 'avançado';
  estimatedReadingTime: number;
  suggestedPrerequisites: string[];
  relatedTopics: string[];
}

export async function analyzeMaterialWithAI(
  _materialContent: string,
  _materialType: MaterialType
): Promise<MaterialAnalysis> {
  throw new Error('Use trpc.ai.generateContent mutation instead');
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'fácil' | 'médio' | 'difícil';
}

export async function generateQuizFromMaterial(
  _materialContent: string,
  _numQuestions: number = 5
): Promise<QuizQuestion[]> {
  throw new Error('Use trpc.ai.generateQuiz mutation instead');
}

export interface Flashcard {
  front: string;
  back: string;
  category: string;
  difficulty: 'fácil' | 'médio' | 'difícil';
}

export async function generateFlashcardsFromMaterial(
  _materialContent: string,
  _numCards: number = 10
): Promise<Flashcard[]> {
  throw new Error('Use trpc.ai.generateFlashcards mutation instead');
}

export interface MindMap {
  centralTopic: string;
  branches: {
    title: string;
    subtopics: string[];
    color: string;
  }[];
}

export async function generateMindMap(_materialContent: string): Promise<MindMap> {
  throw new Error('Use trpc.ai.generateMindMap mutation instead');
}

export async function generateSummary(
  _materialContent: string,
  _summaryType: 'curto' | 'médio' | 'detalhado' = 'médio'
): Promise<string> {
  throw new Error('Use trpc.ai.generateSummary mutation instead');
}

// ============================================================================
// Comments & Reviews
// ============================================================================

export interface MaterialComment {
  id: string;
  materialId: string;
  userId: string;
  userName: string;
  content: string;
  rating?: number;
  createdAt: string;
  replies?: MaterialComment[];
}

export async function addComment(
  materialId: string,
  content: string,
  rating?: number
): Promise<MaterialComment> {
  const response = await fetch(`${API_BASE}/${materialId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, rating }),
  });

  if (!response.ok) throw new Error('Failed to add comment');
  return await response.json();
}

export async function getComments(materialId: string): Promise<MaterialComment[]> {
  try {
    const response = await fetch(`${API_BASE}/${materialId}/comments`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    return [];
  }
}

// ============================================================================
// Annotations
// ============================================================================

export interface Annotation {
  id: string;
  materialId: string;
  userId: string;
  content: string;
  position: {
    page?: number;
    offset?: number;
    selection?: string;
  };
  color: string;
  createdAt: string;
  updatedAt: string;
}

export async function saveAnnotation(
  materialId: string,
  annotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Annotation> {
  const response = await fetch(`${API_BASE}/${materialId}/annotations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(annotation),
  });

  if (!response.ok) throw new Error('Failed to save annotation');
  return await response.json();
}

export async function getAnnotations(materialId: string, userId: string): Promise<Annotation[]> {
  try {
    const response = await fetch(`${API_BASE}/${materialId}/annotations?userId=${userId}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    return [];
  }
}

export async function deleteAnnotation(annotationId: string): Promise<void> {
  await fetch(`${API_BASE}/annotations/${annotationId}`, {
    method: 'DELETE',
  });
}

// ============================================================================
// University Scrapers (Mock)
// ============================================================================

export interface UniversitySource {
  id: string;
  name: string;
  baseUrl: string;
  scraperConfig: {
    materialsSelector: string;
    titleSelector: string;
    linkSelector: string;
  };
}

export async function scrapeUniversityMaterials(
  universityId: string
): Promise<Partial<AcademicMaterial>[]> {
  console.log(`Scraping materials from university: ${universityId}`);
  return [];
}

// ============================================================================
// AI-Powered Recommendations (stub)
// ============================================================================

export interface MaterialRecommendation {
  material: AcademicMaterial;
  score: number;
  reason: string;
}

export async function getRecommendations(
  _userId: string,
  _context: {
    currentMaterial?: string;
    userHistory?: string[];
    preferences?: string[];
  }
): Promise<MaterialRecommendation[]> {
  return [];
}

// ============================================================================
// Mock Data (temporary until backend is implemented)
// ============================================================================

function getMockMaterials(filter?: MaterialFilter): AcademicMaterial[] {
  const mockMaterials: AcademicMaterial[] = [];

  let filtered = mockMaterials;

  if (filter?.universityId) {
    filtered = filtered.filter(m => m.universityId === filter.universityId);
  }
  if (filter?.year) {
    filtered = filtered.filter(m => m.year === filter.year);
  }
  if (filter?.semester) {
    filtered = filtered.filter(m => m.semester === filter.semester);
  }
  if (filter?.type) {
    filtered = filtered.filter(m => m.type === filter.type);
  }

  return filtered;
}

// ============================================================================
// Export all services
// ============================================================================

export const MaterialsAPI = {
  // CRUD
  fetchMaterials,
  getMaterial,
  uploadMaterial,
  updateMaterial,
  deleteMaterial,
  
  // AI Features (stubs — use tRPC mutations directly)
  analyzeMaterialWithAI,
  generateQuizFromMaterial,
  generateFlashcardsFromMaterial,
  generateMindMap,
  generateSummary,
  
  // Social
  addComment,
  getComments,
  
  // Annotations
  saveAnnotation,
  getAnnotations,
  deleteAnnotation,
  
  // Recommendations
  getRecommendations,
  
  // Scraping
  scrapeUniversityMaterials,
};
