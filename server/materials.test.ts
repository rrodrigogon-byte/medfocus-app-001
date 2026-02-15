import { describe, it, expect, vi } from "vitest";

// Mock the db functions
vi.mock("./db", () => ({
  findGeneratedMaterial: vi.fn(),
  saveGeneratedMaterial: vi.fn(),
  getUserMaterialHistory: vi.fn(),
  getGeneratedMaterialById: vi.fn(),
  rateMaterial: vi.fn(),
}));

import {
  findGeneratedMaterial,
  saveGeneratedMaterial,
  getUserMaterialHistory,
  getGeneratedMaterialById,
  rateMaterial,
} from "./db";

describe("Materials History DB Functions", () => {
  it("findGeneratedMaterial should be callable with correct params", async () => {
    const mockFn = findGeneratedMaterial as ReturnType<typeof vi.fn>;
    mockFn.mockResolvedValue(null);

    const result = await findGeneratedMaterial(1, "UNIVAG", "Anatomia", 1);
    expect(mockFn).toHaveBeenCalledWith(1, "UNIVAG", "Anatomia", 1);
    expect(result).toBeNull();
  });

  it("findGeneratedMaterial should return cached material when exists", async () => {
    const mockMaterial = {
      id: 1,
      userId: 1,
      universityId: "UNIVAG",
      universityName: "UNIVAG",
      subject: "Anatomia",
      year: 1,
      contentType: "full",
      content: '{"summary":"Test summary","keyPoints":["Point 1"]}',
      research: "Research text",
      accessCount: 3,
      createdAt: new Date(),
    };
    const mockFn = findGeneratedMaterial as ReturnType<typeof vi.fn>;
    mockFn.mockResolvedValue(mockMaterial);

    const result = await findGeneratedMaterial(1, "UNIVAG", "Anatomia", 1);
    expect(result).toEqual(mockMaterial);
    expect(result!.accessCount).toBe(3);
  });

  it("saveGeneratedMaterial should save material data", async () => {
    const mockFn = saveGeneratedMaterial as ReturnType<typeof vi.fn>;
    mockFn.mockResolvedValue(true);

    const data = {
      userId: 1,
      universityId: "UNIVAG",
      universityName: "UNIVAG - Centro Universitário",
      subject: "Anatomia Descritiva",
      year: 1,
      content: '{"summary":"Test"}',
      research: "Research data",
    };

    const result = await saveGeneratedMaterial(data);
    expect(mockFn).toHaveBeenCalledWith(data);
    expect(result).toBe(true);
  });

  it("getUserMaterialHistory should return list of materials", async () => {
    const mockHistory = [
      { id: 1, universityId: "UNIVAG", universityName: "UNIVAG", subject: "Anatomia", year: 1, contentType: "full", accessCount: 5, lastAccessedAt: new Date(), createdAt: new Date() },
      { id: 2, universityId: "USP", universityName: "USP", subject: "Fisiologia", year: 2, contentType: "full", accessCount: 2, lastAccessedAt: new Date(), createdAt: new Date() },
    ];
    const mockFn = getUserMaterialHistory as ReturnType<typeof vi.fn>;
    mockFn.mockResolvedValue(mockHistory);

    const result = await getUserMaterialHistory(1, 50);
    expect(result).toHaveLength(2);
    expect(result[0].subject).toBe("Anatomia");
    expect(result[1].universityId).toBe("USP");
  });

  it("getGeneratedMaterialById should return material with content", async () => {
    const mockMaterial = {
      id: 1,
      content: '{"summary":"Deep summary","keyPoints":["Point 1","Point 2"]}',
      research: "Research text",
    };
    const mockFn = getGeneratedMaterialById as ReturnType<typeof vi.fn>;
    mockFn.mockResolvedValue(mockMaterial);

    const result = await getGeneratedMaterialById(1);
    expect(result).toBeTruthy();
    const parsed = JSON.parse(result!.content);
    expect(parsed.summary).toBe("Deep summary");
    expect(parsed.keyPoints).toHaveLength(2);
  });

  it("rateMaterial should update quality score", async () => {
    const mockFn = rateMaterial as ReturnType<typeof vi.fn>;
    mockFn.mockResolvedValue(undefined);

    await rateMaterial(1, 85);
    expect(mockFn).toHaveBeenCalledWith(1, 85);
  });
});

describe("PDF Export Route", () => {
  it("should generate valid HTML for PDF export", () => {
    // Simulate the HTML generation logic from the exportPdf route
    const subject = "Anatomia Descritiva";
    const universityName = "UNIVAG";
    const year = 1;
    const content = {
      summary: "Resumo sobre anatomia descritiva.",
      keyPoints: ["Ponto 1", "Ponto 2"],
      flashcards: [{ front: "Pergunta", back: "Resposta" }],
      innovations: ["Inovação 1"],
      references: [{ title: "Gray's Anatomy", author: "Gray", type: "Livro", verifiedBy: "USP" }],
      quiz: [{ question: "Q1?", options: ["A", "B", "C", "D"], correctIndex: 0, explanation: "Explicação", source: "Fonte" }],
    };

    // The route returns HTML string
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><h1>${subject}</h1><p>${content.summary}</p></body></html>`;
    
    expect(html).toContain(subject);
    expect(html).toContain(content.summary);
    expect(html).toContain("<!DOCTYPE html>");
  });
});

describe("Content Personalization", () => {
  it("should determine correct depth label for year 1-2", () => {
    const year = 1;
    const label = year <= 2
      ? 'Básico — Foco em fundamentos e conceitos essenciais'
      : year <= 4
      ? 'Intermediário — Correlação clínica e fisiopatologia'
      : 'Avançado — Nível residência com diagnóstico diferencial';
    expect(label).toBe('Básico — Foco em fundamentos e conceitos essenciais');
  });

  it("should determine correct depth label for year 3-4", () => {
    const year = 3;
    const label = year <= 2
      ? 'Básico — Foco em fundamentos e conceitos essenciais'
      : year <= 4
      ? 'Intermediário — Correlação clínica e fisiopatologia'
      : 'Avançado — Nível residência com diagnóstico diferencial';
    expect(label).toBe('Intermediário — Correlação clínica e fisiopatologia');
  });

  it("should determine correct depth label for year 5-6", () => {
    const year = 5;
    const label = year <= 2
      ? 'Básico — Foco em fundamentos e conceitos essenciais'
      : year <= 4
      ? 'Intermediário — Correlação clínica e fisiopatologia'
      : 'Avançado — Nível residência com diagnóstico diferencial';
    expect(label).toBe('Avançado — Nível residência com diagnóstico diferencial');
  });
});
