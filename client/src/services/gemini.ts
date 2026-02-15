
import { GoogleGenAI, Type } from "@google/genai";

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

export async function generateDeepContent(subject: string, universityName: string, year: number) {
  try {
    const prompt = `VOCÊ É O MEDGENIE, UM TUTOR MÉDICO DE ELITE. 
    ESTOU ESTUDANDO: ${subject} na ${universityName}, ${year}º Ano.
    
    GERAR MATERIAL DE EXCELÊNCIA:
    1. SUMÁRIO EXECUTIVO: Profundo, com foco em fisiopatologia e correlação clínica. Use referências como Harrison ou Guyton.
    2. KEY POINTS: 5 pontos críticos que caem em provas de residência (ENARE/USP/AMP).
    3. FLASHCARDS: 3 flashcards no formato (Pergunta na frente / Resposta no verso) para Active Recall.
    4. ATLAS VISUAL: Descreva um esquema isométrico para visualização mental.
    5. QUIZ: 2 questões complexas com justificativas.
    6. REFERÊNCIAS: Cite livros e capítulos específicos.

    RETORNE EM JSON RIGOROSO.`;

    const response = await getAI().models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING }
                }
              }
            },
            visualPrompt: { type: Type.STRING },
            innovations: { type: Type.ARRAY, items: { type: Type.STRING } },
            references: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  author: { type: Type.STRING },
                  type: { type: Type.STRING },
                  verifiedBy: { type: Type.STRING }
                }
              }
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.NUMBER },
                  explanation: { type: Type.STRING },
                  source: { type: Type.STRING }
                }
              }
            }
          },
          required: ["summary", "keyPoints", "flashcards", "visualPrompt", "quiz", "references"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    if (error.message?.includes('quota')) {
      throw new Error('QUOTA_EXCEEDED');
    }
    throw error;
  }
}

export async function fetchGlobalResearch(topic: string) {
  try {
    const prompt = `Traga os 2 artigos mais relevantes de 2024/2025 sobre "${topic}" do PubMed/NEJM. Resumo de 1 frase cada e DOI.`;
    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview', // Flash é mais barato para buscas simples
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text || '';
  } catch (error: any) {
    return "Pesquisa global temporariamente indisponível devido ao limite de requisições.";
  }
}

export async function askMedGenie(message: string) {
  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: "Você é o MedGenie, tutor médico sênior. Responda com base em evidências.",
      },
    });
    return response.text || '';
  } catch (error) {
    return "Estou em repouso médico (limite de cota atingido). Tente novamente em alguns minutos.";
  }
}
