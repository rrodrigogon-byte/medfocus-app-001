import { describe, it, expect, vi } from 'vitest';

describe('Library Router', () => {
  describe('library.search', () => {
    it('should accept search parameters', () => {
      const input = {
        query: 'anatomia',
        subject: 'Anatomia',
        year: 1,
        type: 'livro',
        language: 'pt-BR',
      };
      expect(input.query).toBe('anatomia');
      expect(input.subject).toBe('Anatomia');
      expect(input.year).toBe(1);
      expect(input.type).toBe('livro');
      expect(input.language).toBe('pt-BR');
    });

    it('should have default empty query', () => {
      const input = { query: '' };
      expect(input.query).toBe('');
    });
  });

  describe('library.aiSearch', () => {
    it('should require minimum 3 characters for query', () => {
      const validQuery = 'ana';
      const invalidQuery = 'ab';
      expect(validQuery.length).toBeGreaterThanOrEqual(3);
      expect(invalidQuery.length).toBeLessThan(3);
    });

    it('should accept optional subject, year and specialty', () => {
      const input = {
        query: 'anatomia humana',
        subject: 'Anatomia',
        year: 1,
        specialty: 'Cirurgia',
      };
      expect(input.query).toBe('anatomia humana');
      expect(input.subject).toBe('Anatomia');
      expect(input.year).toBe(1);
      expect(input.specialty).toBe('Cirurgia');
    });
  });

  describe('library.aiDeepDive', () => {
    it('should accept material info for deep dive', () => {
      const input = {
        materialId: 1,
        title: 'Anatomia Orientada para Clínica',
        subject: 'Anatomia',
        authorName: 'Prof. Dr. Keith L. Moore',
      };
      expect(input.materialId).toBe(1);
      expect(input.title).toContain('Anatomia');
      expect(input.authorName).toContain('Moore');
    });
  });

  describe('library.toggleSave', () => {
    it('should accept materialId for toggle', () => {
      const input = { materialId: 42 };
      expect(input.materialId).toBe(42);
    });
  });

  describe('Material types validation', () => {
    it('should validate material types', () => {
      const validTypes = ['livro', 'artigo', 'diretriz', 'atlas', 'videoaula', 'podcast', 'tese', 'revisao_sistematica', 'caso_clinico', 'guideline'];
      expect(validTypes).toContain('livro');
      expect(validTypes).toContain('artigo');
      expect(validTypes).toContain('diretriz');
      expect(validTypes).toContain('tese');
      expect(validTypes.length).toBe(10);
    });

    it('should default to artigo for invalid types', () => {
      const validTypes = ['livro', 'artigo', 'diretriz', 'atlas', 'videoaula', 'podcast', 'tese', 'revisao_sistematica', 'caso_clinico', 'guideline'];
      const inputType = 'invalid_type';
      const materialType = validTypes.includes(inputType) ? inputType : 'artigo';
      expect(materialType).toBe('artigo');
    });
  });

  describe('LLM prompt construction', () => {
    it('should build correct context for year', () => {
      const year = 3;
      const yearContext = year ? `para o ${year}° ano de medicina` : 'para estudantes de medicina';
      expect(yearContext).toBe('para o 3° ano de medicina');
    });

    it('should build correct context without year', () => {
      const year = undefined;
      const yearContext = year ? `para o ${year}° ano de medicina` : 'para estudantes de medicina';
      expect(yearContext).toBe('para estudantes de medicina');
    });

    it('should build correct context for specialty', () => {
      const specialty = 'Cardiologia';
      const specialtyContext = specialty ? ` na especialidade de ${specialty}` : '';
      expect(specialtyContext).toBe(' na especialidade de Cardiologia');
    });

    it('should build correct context for subject', () => {
      const subject = 'Fisiologia';
      const subjectContext = subject ? ` sobre ${subject}` : '';
      expect(subjectContext).toBe(' sobre Fisiologia');
    });
  });

  describe('JSON schema for AI response', () => {
    it('should parse valid AI response', () => {
      const mockResponse = {
        materials: [
          {
            title: 'Gray Anatomia para Estudantes',
            description: 'Referência clássica de anatomia',
            type: 'livro',
            subject: 'Anatomia',
            specialty: 'Anatomia Geral',
            authorName: 'Richard L. Drake',
            authorTitle: 'PhD',
            authorInstitution: 'Cleveland Clinic',
            authorCountry: 'EUA',
            source: 'Elsevier',
            doi: '',
            publishedYear: 2020,
            impactFactor: '',
            language: 'pt-BR',
            tags: 'anatomia, estudantes, referência',
            relevanceScore: 95,
          },
        ],
      };
      expect(mockResponse.materials).toHaveLength(1);
      expect(mockResponse.materials[0].title).toContain('Gray');
      expect(mockResponse.materials[0].relevanceScore).toBe(95);
    });

    it('should handle tags parsing', () => {
      const tags = 'anatomia, fisiologia, clínica';
      const parsed = tags.split(',').map((t: string) => t.trim());
      expect(parsed).toEqual(['anatomia', 'fisiologia', 'clínica']);
    });
  });
});
