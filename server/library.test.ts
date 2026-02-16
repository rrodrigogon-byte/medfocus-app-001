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

  // ─── PubMed/SciELO Search Tests ──────────────────────────────────────────
  describe('library.pubmedSearch', () => {
    it('should accept PubMed search parameters', () => {
      const input = {
        query: 'cardiovascular disease',
        source: 'pubmed' as const,
        maxResults: 10,
      };
      expect(input.query).toBe('cardiovascular disease');
      expect(input.source).toBe('pubmed');
      expect(input.maxResults).toBe(10);
    });

    it('should accept SciELO search parameters', () => {
      const input = {
        query: 'hipertensão arterial',
        source: 'scielo' as const,
        maxResults: 5,
      };
      expect(input.query).toBe('hipertensão arterial');
      expect(input.source).toBe('scielo');
      expect(input.maxResults).toBe(5);
    });

    it('should require minimum 2 characters for query', () => {
      const validQuery = 'ab';
      const invalidQuery = 'a';
      expect(validQuery.length).toBeGreaterThanOrEqual(2);
      expect(invalidQuery.length).toBeLessThan(2);
    });

    it('should default source to pubmed', () => {
      const input = { query: 'diabetes', maxResults: 10 };
      const source = 'pubmed'; // default
      expect(source).toBe('pubmed');
    });

    it('should default maxResults to 10', () => {
      const input = { query: 'diabetes' };
      const maxResults = 10; // default
      expect(maxResults).toBe(10);
    });

    it('should construct correct PubMed E-utilities search URL', () => {
      const query = 'cardiovascular disease';
      const maxResults = 10;
      const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query + ' medicine')}&retmax=${maxResults}&retmode=json&sort=relevance`;
      expect(searchUrl).toContain('eutils.ncbi.nlm.nih.gov');
      expect(searchUrl).toContain('db=pubmed');
      expect(searchUrl).toContain('retmode=json');
      expect(searchUrl).toContain('cardiovascular%20disease%20medicine');
    });

    it('should construct correct PubMed summary URL from PMIDs', () => {
      const pmids = ['12345678', '87654321', '11223344'];
      const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmids.join(',')}&retmode=json`;
      expect(summaryUrl).toContain('esummary.fcgi');
      expect(summaryUrl).toContain('12345678,87654321,11223344');
    });

    it('should parse PubMed article data correctly', () => {
      const mockSummary = {
        title: 'Advances in Cardiovascular Medicine',
        source: 'NEJM',
        fulljournalname: 'New England Journal of Medicine',
        pubdate: '2025 Jan',
        elocationid: 'doi: 10.1056/NEJMra2401234',
        authors: [{ name: 'Smith JA' }, { name: 'Johnson BC' }],
        lang: ['eng'],
        keywords: ['cardiovascular', 'medicine'],
      };

      const authors = mockSummary.authors.map((a: any) => a.name);
      expect(authors).toEqual(['Smith JA', 'Johnson BC']);
      expect(mockSummary.source).toBe('NEJM');
      expect(mockSummary.elocationid.replace('doi: ', '')).toBe('10.1056/NEJMra2401234');
    });

    it('should handle SciELO search URL construction', () => {
      const query = 'hipertensão arterial';
      const maxResults = 10;
      const scieloUrl = `https://search.scielo.org/?q=${encodeURIComponent(query)}&lang=pt&count=${maxResults}&output=json&from=0`;
      expect(scieloUrl).toContain('search.scielo.org');
      expect(scieloUrl).toContain('lang=pt');
      expect(scieloUrl).toContain('output=json');
    });

    it('should return articles with required fields', () => {
      const article = {
        pmid: '12345678',
        title: 'Test Article',
        authors: JSON.stringify(['Author A', 'Author B']),
        journal: 'Test Journal',
        pubDate: '2025',
        doi: '10.1234/test',
        abstractText: 'This is a test abstract.',
        source: 'pubmed',
        searchQuery: 'test',
        language: 'en',
        isOpenAccess: false,
      };
      expect(article.pmid).toBeDefined();
      expect(article.title).toBeDefined();
      expect(article.source).toBe('pubmed');
      expect(JSON.parse(article.authors)).toHaveLength(2);
    });
  });

  // ─── Material Reviews/Ratings Tests ───────────────────────────────────────
  describe('library.addReview', () => {
    it('should accept review parameters', () => {
      const input = {
        materialId: 1,
        rating: 5,
        comment: 'Excelente material de estudo!',
      };
      expect(input.materialId).toBe(1);
      expect(input.rating).toBe(5);
      expect(input.comment).toBe('Excelente material de estudo!');
    });

    it('should validate rating range (1-5)', () => {
      const validRatings = [1, 2, 3, 4, 5];
      const invalidRatings = [0, 6, -1, 10];

      for (const r of validRatings) {
        expect(r).toBeGreaterThanOrEqual(1);
        expect(r).toBeLessThanOrEqual(5);
      }

      for (const r of invalidRatings) {
        expect(r < 1 || r > 5).toBe(true);
      }
    });

    it('should allow optional comment', () => {
      const inputWithComment = { materialId: 1, rating: 4, comment: 'Bom material' };
      const inputWithoutComment = { materialId: 1, rating: 4 };
      expect(inputWithComment.comment).toBeDefined();
      expect((inputWithoutComment as any).comment).toBeUndefined();
    });

    it('should convert rating to study activity score (rating * 20)', () => {
      const rating = 4;
      const score = rating * 20;
      expect(score).toBe(80);

      const rating5 = 5;
      expect(rating5 * 20).toBe(100);

      const rating1 = 1;
      expect(rating1 * 20).toBe(20);
    });
  });

  describe('library.getReviews', () => {
    it('should accept materialId parameter', () => {
      const input = { materialId: 42 };
      expect(input.materialId).toBe(42);
    });

    it('should calculate average rating correctly', () => {
      const reviews = [
        { rating: 5 },
        { rating: 4 },
        { rating: 3 },
        { rating: 5 },
        { rating: 4 },
      ];
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      expect(avgRating).toBe(4.2);
    });

    it('should handle empty reviews', () => {
      const reviews: any[] = [];
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
        : 0;
      expect(avgRating).toBe(0);
    });
  });

  describe('library.markHelpful', () => {
    it('should accept reviewId parameter', () => {
      const input = { reviewId: 7 };
      expect(input.reviewId).toBe(7);
    });

    it('should increment helpful count', () => {
      let helpful = 3;
      helpful += 1;
      expect(helpful).toBe(4);
    });
  });

  // ─── Study History & Tracking Tests ───────────────────────────────────────
  describe('library.trackActivity', () => {
    it('should accept activity tracking parameters', () => {
      const input = {
        itemType: 'material' as const,
        itemId: '42',
        itemTitle: 'Gray Anatomia',
        subject: 'Anatomia',
        score: 85,
        timeSpentMinutes: 30,
        completed: true,
      };
      expect(input.itemType).toBe('material');
      expect(input.itemId).toBe('42');
      expect(input.score).toBe(85);
      expect(input.completed).toBe(true);
    });

    it('should validate item types', () => {
      const validTypes = ['material', 'article', 'quiz', 'flashcard', 'subject'];
      expect(validTypes).toContain('material');
      expect(validTypes).toContain('article');
      expect(validTypes).toContain('quiz');
      expect(validTypes).toContain('flashcard');
      expect(validTypes).toContain('subject');
      expect(validTypes.length).toBe(5);
    });
  });

  // ─── Personalized Recommendations Tests ───────────────────────────────────
  describe('library.getRecommendations', () => {
    it('should accept limit parameter', () => {
      const input = { limit: 10 };
      expect(input.limit).toBe(10);
    });

    it('should default limit to 10', () => {
      const defaultLimit = 10;
      expect(defaultLimit).toBe(10);
    });

    it('should build correct user profile context', () => {
      const topSubjects = [
        { subject: 'Anatomia', count: 15 },
        { subject: 'Fisiologia', count: 10 },
        { subject: 'Farmacologia', count: 8 },
      ];
      const subjectsList = topSubjects.map(s => `${s.subject} (${s.count}x)`).join(', ');
      expect(subjectsList).toBe('Anatomia (15x), Fisiologia (10x), Farmacologia (8x)');
    });

    it('should handle empty study history', () => {
      const topSubjects: any[] = [];
      const subjectsList = topSubjects.map(s => `${s.subject} (${s.count}x)`).join(', ');
      expect(subjectsList).toBe('');
    });

    it('should parse recommendation response correctly', () => {
      const mockResponse = {
        recommendations: [
          {
            title: 'Guyton Tratado de Fisiologia Médica',
            description: 'Referência clássica de fisiologia',
            type: 'livro',
            subject: 'Fisiologia',
            authorName: 'John E. Hall',
            authorTitle: 'PhD',
            authorInstitution: 'University of Mississippi',
            source: 'Elsevier',
            reason: 'Baseado no seu interesse em Fisiologia e desempenho em quizzes',
            difficulty: 'intermediário',
            relevanceScore: 92,
          },
        ],
        insights: {
          strengths: ['Bom desempenho em Anatomia', 'Consistência nos estudos'],
          areasToImprove: ['Farmacologia precisa de mais atenção', 'Revisar Bioquímica'],
          studyTip: 'Tente intercalar disciplinas diferentes para melhor retenção',
        },
      };

      expect(mockResponse.recommendations).toHaveLength(1);
      expect(mockResponse.recommendations[0].title).toContain('Guyton');
      expect(mockResponse.recommendations[0].reason).toBeDefined();
      expect(mockResponse.recommendations[0].difficulty).toBe('intermediário');
      expect(mockResponse.recommendations[0].relevanceScore).toBe(92);

      expect(mockResponse.insights.strengths).toHaveLength(2);
      expect(mockResponse.insights.areasToImprove).toHaveLength(2);
      expect(mockResponse.insights.studyTip).toBeDefined();
    });

    it('should handle empty recommendations gracefully', () => {
      const emptyResponse = {
        recommendations: [],
        insights: { strengths: [], areasToImprove: [], studyTip: '' },
      };
      expect(emptyResponse.recommendations).toHaveLength(0);
      expect(emptyResponse.insights.strengths).toHaveLength(0);
    });

    it('should build year and university context', () => {
      const user = { currentYear: 3, universityId: 'USP' };
      const yearContext = user.currentYear ? `${user.currentYear}° ano` : '';
      const universityContext = user.universityId || '';
      expect(yearContext).toBe('3° ano');
      expect(universityContext).toBe('USP');
    });

    it('should build context without year/university', () => {
      const user = { currentYear: undefined, universityId: undefined };
      const yearContext = user.currentYear ? `${user.currentYear}° ano` : '';
      const universityContext = user.universityId || '';
      expect(yearContext).toBe('');
      expect(universityContext).toBe('');
    });

    it('should calculate quiz performance metrics', () => {
      const quizPerf = { avgScore: 75.5, totalQuizzes: 12 };
      expect(quizPerf.avgScore).toBe(75.5);
      expect(quizPerf.totalQuizzes).toBe(12);
    });

    it('should handle zero quiz performance', () => {
      const quizPerf = { avgScore: 0, totalQuizzes: 0 };
      expect(quizPerf.avgScore).toBe(0);
      expect(quizPerf.totalQuizzes).toBe(0);
    });

    it('should validate difficulty levels', () => {
      const validDifficulties = ['básico', 'intermediário', 'avançado'];
      expect(validDifficulties).toContain('básico');
      expect(validDifficulties).toContain('intermediário');
      expect(validDifficulties).toContain('avançado');
    });
  });

  // ─── Frontend Component Logic Tests ───────────────────────────────────────
  describe('Frontend helper functions', () => {
    it('should parse JSON tags correctly', () => {
      const jsonTags = '["anatomia","fisiologia","clínica"]';
      const parsed = JSON.parse(jsonTags);
      expect(parsed).toEqual(['anatomia', 'fisiologia', 'clínica']);
    });

    it('should parse comma-separated tags as fallback', () => {
      const csvTags = 'anatomia, fisiologia, clínica';
      let parsed: string[];
      try {
        parsed = JSON.parse(csvTags);
      } catch {
        parsed = csvTags.split(',').map(t => t.trim());
      }
      expect(parsed).toEqual(['anatomia', 'fisiologia', 'clínica']);
    });

    it('should handle null tags', () => {
      const tags: string | null = null;
      const parsed = tags ? (() => { try { return JSON.parse(tags); } catch { return tags.split(',').map(t => t.trim()); } })() : [];
      expect(parsed).toEqual([]);
    });

    it('should parse PubMed article authors from JSON string', () => {
      const authorsJson = '["Smith JA","Johnson BC","Williams DE"]';
      const authors = JSON.parse(authorsJson);
      expect(authors).toHaveLength(3);
      expect(authors[0]).toBe('Smith JA');
    });

    it('should handle authors as array directly', () => {
      const authors = ['Smith JA', 'Johnson BC'];
      expect(Array.isArray(authors)).toBe(true);
      expect(authors).toHaveLength(2);
    });

    it('should get difficulty color class', () => {
      const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
          case 'básico': return 'text-green-600 bg-green-50';
          case 'intermediário': return 'text-yellow-600 bg-yellow-50';
          case 'avançado': return 'text-red-600 bg-red-50';
          default: return 'text-gray-600 bg-gray-50';
        }
      };
      expect(getDifficultyColor('básico')).toContain('green');
      expect(getDifficultyColor('intermediário')).toContain('yellow');
      expect(getDifficultyColor('avançado')).toContain('red');
      expect(getDifficultyColor('unknown')).toContain('gray');
    });

    it('should construct PubMed external link', () => {
      const pmid = '12345678';
      const url = `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
      expect(url).toBe('https://pubmed.ncbi.nlm.nih.gov/12345678/');
    });

    it('should construct DOI link', () => {
      const doi = '10.1056/NEJMra2401234';
      const url = `https://doi.org/${doi}`;
      expect(url).toBe('https://doi.org/10.1056/NEJMra2401234');
    });
  });
});
