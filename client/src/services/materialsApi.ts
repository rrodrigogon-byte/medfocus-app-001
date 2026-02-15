/**
 * Materials API Service
 * Comprehensive service for managing academic materials with AI integration
 */

import { GoogleGenAI, Type } from "@google/genai";
import { 
  AcademicMaterial, 
  MaterialFilter, 
  MaterialType,
  Semester 
} from '../types';

const API_BASE = '/api/materials'; // Server endpoint (to be implemented)

// ============================================================================
// AI Service Integration
// ============================================================================

const apiKey = (import.meta as any).env?.VITE_GOOGLE_API_KEY || '';

let _ai: GoogleGenAI | null = null;
function getAI() {
  if (!_ai) {
    if (!apiKey) {
      throw new Error('API_KEY_NOT_SET');
    }
    _ai = new GoogleGenAI({ apiKey });
  }
  return _ai;
}

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
    // Return mock data for now
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
// AI-Powered Features
// ============================================================================

export interface MaterialAnalysis {
  summary: string;
  keyTopics: string[];
  difficulty: 'iniciante' | 'intermediário' | 'avançado';
  estimatedReadingTime: number; // in minutes
  suggestedPrerequisites: string[];
  relatedTopics: string[];
}

export async function analyzeMaterialWithAI(
  materialContent: string,
  materialType: MaterialType
): Promise<MaterialAnalysis> {
  try {
    const prompt = `Analise este material acadêmico de medicina (tipo: ${materialType}).

CONTEÚDO:
${materialContent.slice(0, 5000)} // Limit to first 5000 chars

Retorne uma análise estruturada incluindo:
1. Resumo executivo (2-3 frases)
2. Principais tópicos abordados
3. Nível de dificuldade
4. Tempo estimado de leitura
5. Pré-requisitos sugeridos
6. Tópicos relacionados para estudo complementar`;

    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
            difficulty: { type: Type.STRING },
            estimatedReadingTime: { type: Type.NUMBER },
            suggestedPrerequisites: { type: Type.ARRAY, items: { type: Type.STRING } },
            relatedTopics: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error('AI analysis error:', error);
    throw new Error('Análise de IA indisponível');
  }
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'fácil' | 'médio' | 'difícil';
}

export async function generateQuizFromMaterial(
  materialContent: string,
  numQuestions: number = 5
): Promise<QuizQuestion[]> {
  try {
    const prompt = `Com base neste material de medicina, gere ${numQuestions} questões de múltipla escolha estilo residência médica.

MATERIAL:
${materialContent.slice(0, 5000)}

REQUISITOS:
- Questões contextualizadas e aplicadas
- 5 alternativas por questão
- Explicação detalhada da resposta correta
- Misture dificuldades (fácil, médio, difícil)
- Foco em raciocínio clínico`;

    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.NUMBER },
                  explanation: { type: Type.STRING },
                  difficulty: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{"questions":[]}');
    return result.questions || [];
  } catch (error) {
    console.error('Quiz generation error:', error);
    throw new Error('Geração de quiz indisponível');
  }
}

export interface Flashcard {
  front: string;
  back: string;
  category: string;
  difficulty: 'fácil' | 'médio' | 'difícil';
}

export async function generateFlashcardsFromMaterial(
  materialContent: string,
  numCards: number = 10
): Promise<Flashcard[]> {
  try {
    const prompt = `Crie ${numCards} flashcards de alta qualidade baseados neste material de medicina.

MATERIAL:
${materialContent.slice(0, 5000)}

FORMATO:
- Frente: Pergunta objetiva ou conceito
- Verso: Resposta completa mas concisa
- Use Active Recall e Spaced Repetition principles
- Foque em conceitos-chave e aplicações clínicas`;

    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                  category: { type: Type.STRING },
                  difficulty: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{"flashcards":[]}');
    return result.flashcards || [];
  } catch (error) {
    console.error('Flashcard generation error:', error);
    throw new Error('Geração de flashcards indisponível');
  }
}

export interface MindMap {
  centralTopic: string;
  branches: {
    title: string;
    subtopics: string[];
    color: string;
  }[];
}

export async function generateMindMap(materialContent: string): Promise<MindMap> {
  try {
    const prompt = `Crie um mapa mental estruturado deste material médico.

MATERIAL:
${materialContent.slice(0, 5000)}

ESTRUTURA:
- Tópico central claro
- 4-6 ramos principais
- 3-5 subtópicos por ramo
- Hierarquia lógica de conceitos`;

    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            centralTopic: { type: Type.STRING },
            branches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  subtopics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  color: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error('Mind map generation error:', error);
    throw new Error('Geração de mapa mental indisponível');
  }
}

export async function generateSummary(
  materialContent: string,
  summaryType: 'curto' | 'médio' | 'detalhado' = 'médio'
): Promise<string> {
  try {
    const lengthGuide = {
      curto: '150-200 palavras',
      médio: '300-400 palavras',
      detalhado: '600-800 palavras'
    };

    const prompt = `Crie um resumo ${summaryType} (${lengthGuide[summaryType]}) deste material médico.

MATERIAL:
${materialContent.slice(0, 8000)}

REQUISITOS:
- Foco em conceitos essenciais
- Linguagem clara e objetiva
- Estrutura com tópicos quando apropriado
- Inclua correlações clínicas importantes`;

    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || '';
  } catch (error) {
    console.error('Summary generation error:', error);
    throw new Error('Geração de resumo indisponível');
  }
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
// University Scrapers (Mock - Real implementation would be server-side)
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
  // This would be implemented server-side with proper web scraping
  // For now, return empty array
  console.log(`Scraping materials from university: ${universityId}`);
  return [];
}

// ============================================================================
// AI-Powered Recommendations
// ============================================================================

export interface MaterialRecommendation {
  material: AcademicMaterial;
  score: number;
  reason: string;
}

export async function getRecommendations(
  userId: string,
  context: {
    currentMaterial?: string;
    userHistory?: string[];
    preferences?: string[];
  }
): Promise<MaterialRecommendation[]> {
  try {
    const prompt = `Com base no perfil do usuário e contexto de estudo, recomende materiais acadêmicos de medicina.

CONTEXTO:
- Material atual: ${context.currentMaterial || 'Nenhum'}
- Histórico recente: ${context.userHistory?.join(', ') || 'Nenhum'}
- Interesses: ${context.preferences?.join(', ') || 'Não especificado'}

Retorne 5 recomendações com score de relevância (0-1) e justificativa.`;

    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Parse AI response and match with actual materials
    // This is simplified - real implementation would query database
    return [];
  } catch (error) {
    console.error('Recommendation error:', error);
    return [];
  }
}

// ============================================================================
// Mock Data (temporary until backend is implemented)
// ============================================================================

function getMockMaterials(filter?: MaterialFilter): AcademicMaterial[] {
  // Return filtered mock data based on filter
  const mockMaterials: AcademicMaterial[] = [
    // ... (existing mock materials from AcademicLibrary component)
  ];

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
  
  // AI Features
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
