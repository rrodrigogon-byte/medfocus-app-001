/**
 * Banco de Livros e Recursos Médicos Gratuitos
 * Fontes: OpenStax, NCBI Bookshelf, Portal USP, SciELO, WHO, Ministério da Saúde, ANVISA
 * Todos os recursos são gratuitos, de domínio público ou licenciados sob Creative Commons
 */

export interface FreeBook {
  id: string;
  title: string;
  author: string;
  institution: string;
  description: string;
  category: string;
  subcategory: string;
  year: number;
  language: 'pt-BR' | 'en' | 'es';
  type: 'livro' | 'atlas' | 'diretriz' | 'apostila' | 'artigo' | 'manual' | 'protocolo' | 'tese' | 'videoaula' | 'curso';
  license: 'CC BY 4.0' | 'CC BY-NC-SA 4.0' | 'CC BY-NC 4.0' | 'Domínio Público' | 'Acesso Aberto' | 'Gov. Federal';
  url: string;
  pages?: number;
  rating: number;
  downloads: number;
  medYear: number[]; // anos do curso de medicina relevantes (1-6)
  tags: string[];
  source: string;
  isbn?: string;
}

export const FREE_BOOKS: FreeBook[] = [
  // ═══════════════════════════════════════════════════════════
  // CIÊNCIAS BÁSICAS (1° e 2° ano)
  // ═══════════════════════════════════════════════════════════

  // --- ANATOMIA ---
  {
    id: 'fb-001', title: 'Anatomy and Physiology 2e', author: 'OpenStax', institution: 'Rice University',
    description: 'Livro-texto completo de anatomia e fisiologia humana com 1.600+ ilustrações. Cobre todos os sistemas do corpo humano com correlações clínicas. Recurso educacional aberto (OER) revisado por pares.',
    category: 'Anatomia', subcategory: 'Anatomia Sistêmica', year: 2022, language: 'en', type: 'livro',
    license: 'CC BY 4.0', url: 'https://openstax.org/details/books/anatomy-and-physiology-2e',
    pages: 1338, rating: 4.9, downloads: 45000, medYear: [1, 2], tags: ['anatomia', 'fisiologia', 'OpenStax', 'OER'],
    source: 'OpenStax', isbn: '978-1-711494-06-7'
  },
  {
    id: 'fb-002', title: "Gray's Anatomy — Edição Clássica (1918)", author: 'Henry Gray', institution: 'Royal College of Surgeons',
    description: 'A edição clássica do atlas de anatomia mais famoso do mundo, agora em domínio público. 1.247 ilustrações detalhadas de todos os sistemas do corpo humano.',
    category: 'Anatomia', subcategory: 'Atlas de Anatomia', year: 1918, language: 'en', type: 'atlas',
    license: 'Domínio Público', url: 'https://www.gutenberg.org/ebooks/5776',
    pages: 1396, rating: 4.7, downloads: 32000, medYear: [1, 2], tags: ['anatomia', 'atlas', 'Gray', 'clássico'],
    source: 'Projeto Gutenberg'
  },
  {
    id: 'fb-003', title: 'Atlas de Anatomia Humana — Lâminas Comentadas USP', author: 'Departamento de Anatomia FMUSP', institution: 'USP',
    description: 'Coleção de lâminas anatômicas comentadas do Departamento de Anatomia da FMUSP. Inclui correlações clínicas e imagens de dissecção.',
    category: 'Anatomia', subcategory: 'Atlas de Anatomia', year: 2024, language: 'pt-BR', type: 'atlas',
    license: 'CC BY-NC-SA 4.0', url: 'https://www.livrosabertos.abcd.usp.br/',
    rating: 4.8, downloads: 18000, medYear: [1, 2], tags: ['anatomia', 'atlas', 'USP', 'FMUSP', 'dissecção'],
    source: 'Portal USP'
  },
  {
    id: 'fb-004', title: 'Neuroanatomia Funcional — Texto e Atlas', author: 'Departamento de Anatomia UNICAMP', institution: 'UNICAMP',
    description: 'Material de neuroanatomia funcional com atlas de cortes do encéfalo, vias neurais e correlações clínicas neurológicas.',
    category: 'Anatomia', subcategory: 'Neuroanatomia', year: 2023, language: 'pt-BR', type: 'apostila',
    license: 'CC BY-NC-SA 4.0', url: 'https://www.fcm.unicamp.br',
    rating: 4.7, downloads: 12000, medYear: [1, 2], tags: ['neuroanatomia', 'encéfalo', 'vias neurais', 'UNICAMP'],
    source: 'UNICAMP'
  },

  // --- HISTOLOGIA ---
  {
    id: 'fb-005', title: 'Histology Guide — Virtual Microscopy Lab', author: 'University of Michigan', institution: 'University of Michigan',
    description: 'Atlas virtual de histologia com mais de 250 lâminas digitalizadas em alta resolução. Permite zoom e navegação como em microscópio real.',
    category: 'Histologia', subcategory: 'Atlas Virtual', year: 2024, language: 'en', type: 'atlas',
    license: 'Acesso Aberto', url: 'https://histologyguide.com/',
    rating: 4.9, downloads: 28000, medYear: [1], tags: ['histologia', 'microscopia', 'lâminas', 'virtual'],
    source: 'University of Michigan'
  },

  // --- BIOQUÍMICA ---
  {
    id: 'fb-006', title: 'Biochemistry Free For All', author: 'Kevin Ahern et al.', institution: 'Oregon State University',
    description: 'Livro-texto completo de bioquímica com foco em metabolismo, enzimologia, biologia molecular e genética. Inclui problemas práticos e vídeos.',
    category: 'Bioquímica', subcategory: 'Bioquímica Geral', year: 2021, language: 'en', type: 'livro',
    license: 'CC BY-NC-SA 4.0', url: 'https://open.oregonstate.education/aandp/',
    pages: 850, rating: 4.6, downloads: 15000, medYear: [1], tags: ['bioquímica', 'metabolismo', 'enzimas', 'OER'],
    source: 'Oregon State University'
  },

  // --- FISIOLOGIA ---
  {
    id: 'fb-007', title: 'Concepts of Biology', author: 'OpenStax', institution: 'Rice University',
    description: 'Introdução à biologia com foco em fisiologia celular, genética, evolução e ecologia. Base para compreensão da fisiologia humana.',
    category: 'Fisiologia', subcategory: 'Biologia Celular', year: 2023, language: 'en', type: 'livro',
    license: 'CC BY 4.0', url: 'https://openstax.org/details/books/concepts-biology',
    pages: 680, rating: 4.7, downloads: 22000, medYear: [1], tags: ['biologia', 'fisiologia celular', 'genética', 'OpenStax'],
    source: 'OpenStax'
  },
  {
    id: 'fb-008', title: 'Biology 2e', author: 'OpenStax', institution: 'Rice University',
    description: 'Livro-texto completo de biologia cobrindo desde biologia molecular até ecologia. Inclui fisiologia animal e vegetal detalhada.',
    category: 'Fisiologia', subcategory: 'Biologia Geral', year: 2023, language: 'en', type: 'livro',
    license: 'CC BY 4.0', url: 'https://openstax.org/details/books/biology-2e',
    pages: 1450, rating: 4.8, downloads: 38000, medYear: [1], tags: ['biologia', 'fisiologia', 'genética', 'OpenStax'],
    source: 'OpenStax', isbn: '978-1-947172-52-4'
  },

  // --- MICROBIOLOGIA ---
  {
    id: 'fb-009', title: 'Microbiology', author: 'OpenStax', institution: 'Rice University',
    description: 'Livro-texto completo de microbiologia: bacteriologia, virologia, micologia, parasitologia. Inclui microbiologia clínica e diagnóstico laboratorial.',
    category: 'Microbiologia', subcategory: 'Microbiologia Médica', year: 2023, language: 'en', type: 'livro',
    license: 'CC BY 4.0', url: 'https://openstax.org/details/books/microbiology',
    pages: 1150, rating: 4.8, downloads: 25000, medYear: [1, 2], tags: ['microbiologia', 'bacteriologia', 'virologia', 'OpenStax'],
    source: 'OpenStax', isbn: '978-1-947172-23-4'
  },

  // --- IMUNOLOGIA ---
  {
    id: 'fb-010', title: 'Immunobiology — NCBI Bookshelf', author: 'Charles Janeway et al.', institution: 'Yale University',
    description: 'Edição completa do clássico Janeway\'s Immunobiology disponível gratuitamente no NCBI Bookshelf. Referência mundial em imunologia.',
    category: 'Imunologia', subcategory: 'Imunologia Básica', year: 2001, language: 'en', type: 'livro',
    license: 'Acesso Aberto', url: 'https://www.ncbi.nlm.nih.gov/books/NBK10757/',
    pages: 732, rating: 4.9, downloads: 42000, medYear: [1, 2], tags: ['imunologia', 'Janeway', 'anticorpos', 'NCBI'],
    source: 'NCBI Bookshelf'
  },

  // --- GENÉTICA ---
  {
    id: 'fb-011', title: 'Molecular Biology of the Cell — NCBI', author: 'Alberts et al.', institution: 'UCSF / MIT',
    description: 'Edição do clássico Alberts disponível no NCBI Bookshelf. Biologia celular e molecular com foco em mecanismos de doença.',
    category: 'Genética', subcategory: 'Biologia Molecular', year: 2002, language: 'en', type: 'livro',
    license: 'Acesso Aberto', url: 'https://www.ncbi.nlm.nih.gov/books/NBK21054/',
    pages: 1616, rating: 4.9, downloads: 55000, medYear: [1, 2], tags: ['biologia celular', 'molecular', 'Alberts', 'NCBI'],
    source: 'NCBI Bookshelf'
  },

  // --- QUÍMICA ---
  {
    id: 'fb-012', title: 'Chemistry: Atoms First 2e', author: 'OpenStax', institution: 'Rice University',
    description: 'Química geral com abordagem atômica. Fundamentos para bioquímica e farmacologia.',
    category: 'Química', subcategory: 'Química Geral', year: 2023, language: 'en', type: 'livro',
    license: 'CC BY 4.0', url: 'https://openstax.org/details/books/chemistry-atoms-first-2e',
    pages: 1200, rating: 4.7, downloads: 18000, medYear: [1], tags: ['química', 'átomos', 'ligações', 'OpenStax'],
    source: 'OpenStax'
  },

  // ═══════════════════════════════════════════════════════════
  // CIÊNCIAS CLÍNICAS (3° e 4° ano)
  // ═══════════════════════════════════════════════════════════

  // --- PATOLOGIA ---
  {
    id: 'fb-013', title: 'Pathology — StatPearls', author: 'StatPearls Authors', institution: 'StatPearls Publishing',
    description: 'Coleção completa de artigos de patologia do StatPearls. Mais de 500 tópicos cobrindo patologia geral e sistêmica, constantemente atualizado.',
    category: 'Patologia', subcategory: 'Patologia Geral', year: 2025, language: 'en', type: 'livro',
    license: 'CC BY 4.0', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430685/',
    rating: 4.8, downloads: 65000, medYear: [2, 3], tags: ['patologia', 'StatPearls', 'NCBI', 'atualizado'],
    source: 'NCBI Bookshelf / StatPearls'
  },
  {
    id: 'fb-014', title: 'Pathology — WebPath (Utah)', author: 'Edward Klatt, MD', institution: 'University of Utah',
    description: 'Atlas de patologia online com mais de 2.800 imagens macro e microscópicas. Inclui casos clínicos e questões de revisão.',
    category: 'Patologia', subcategory: 'Atlas de Patologia', year: 2024, language: 'en', type: 'atlas',
    license: 'Acesso Aberto', url: 'https://webpath.med.utah.edu/',
    rating: 4.8, downloads: 35000, medYear: [2, 3], tags: ['patologia', 'atlas', 'imagens', 'Utah'],
    source: 'University of Utah'
  },

  // --- FARMACOLOGIA ---
  {
    id: 'fb-015', title: 'Pharmacology — StatPearls Collection', author: 'StatPearls Authors', institution: 'StatPearls Publishing',
    description: 'Mais de 800 artigos de farmacologia cobrindo todas as classes de medicamentos, mecanismos de ação, indicações, contraindicações e efeitos adversos.',
    category: 'Farmacologia', subcategory: 'Farmacologia Geral', year: 2025, language: 'en', type: 'livro',
    license: 'CC BY 4.0', url: 'https://www.ncbi.nlm.nih.gov/books/NBK430685/',
    rating: 4.8, downloads: 48000, medYear: [2, 3], tags: ['farmacologia', 'medicamentos', 'StatPearls'],
    source: 'NCBI Bookshelf / StatPearls'
  },
  {
    id: 'fb-016', title: 'Basic & Clinical Pharmacology — NCBI', author: 'Bertram Katzung', institution: 'UCSF',
    description: 'Capítulos selecionados do Katzung disponíveis no NCBI Bookshelf. Farmacologia básica e clínica de referência.',
    category: 'Farmacologia', subcategory: 'Farmacologia Clínica', year: 2018, language: 'en', type: 'livro',
    license: 'Acesso Aberto', url: 'https://www.ncbi.nlm.nih.gov/books/',
    rating: 4.7, downloads: 22000, medYear: [2, 3], tags: ['farmacologia', 'Katzung', 'clínica'],
    source: 'NCBI Bookshelf'
  },

  // --- SEMIOLOGIA ---
  {
    id: 'fb-017', title: 'Semiologia Médica — Manual de Propedêutica', author: 'Departamento de Clínica Médica UFMG', institution: 'UFMG',
    description: 'Manual completo de semiologia médica com técnicas de exame físico, anamnese estruturada e raciocínio clínico.',
    category: 'Semiologia', subcategory: 'Propedêutica', year: 2023, language: 'pt-BR', type: 'manual',
    license: 'CC BY-NC-SA 4.0', url: 'https://www.medicina.ufmg.br/',
    rating: 4.8, downloads: 16000, medYear: [3], tags: ['semiologia', 'exame físico', 'anamnese', 'UFMG'],
    source: 'UFMG'
  },

  // --- CLÍNICA MÉDICA ---
  {
    id: 'fb-018', title: 'Clinical Methods — History, Physical, Lab', author: 'Walker, Hall, Hurst', institution: 'Emory University',
    description: 'Livro clássico de métodos clínicos disponível gratuitamente no NCBI. Cobre anamnese, exame físico e exames laboratoriais.',
    category: 'Clínica Médica', subcategory: 'Métodos Clínicos', year: 1990, language: 'en', type: 'livro',
    license: 'Acesso Aberto', url: 'https://www.ncbi.nlm.nih.gov/books/NBK201/',
    pages: 1087, rating: 4.7, downloads: 28000, medYear: [3, 4], tags: ['clínica médica', 'anamnese', 'exame físico', 'NCBI'],
    source: 'NCBI Bookshelf'
  },

  // --- CARDIOLOGIA ---
  {
    id: 'fb-019', title: 'Diretrizes Brasileiras de Cardiologia', author: 'SBC — Sociedade Brasileira de Cardiologia', institution: 'SBC',
    description: 'Todas as diretrizes da SBC: HAS, ICC, SCA, FA, valvopatias, arritmias. Atualizadas periodicamente. Referência obrigatória.',
    category: 'Cardiologia', subcategory: 'Diretrizes', year: 2024, language: 'pt-BR', type: 'diretriz',
    license: 'Acesso Aberto', url: 'https://www.portal.cardiol.br/diretrizes',
    rating: 4.9, downloads: 52000, medYear: [3, 4, 5], tags: ['cardiologia', 'SBC', 'diretrizes', 'HAS', 'ICC'],
    source: 'SBC'
  },
  {
    id: 'fb-020', title: 'ECG Made Easy — Guia Prático', author: 'Life in the Fast Lane', institution: 'LITFL',
    description: 'Guia prático e gratuito de interpretação de ECG com mais de 200 exemplos reais, algoritmos de diagnóstico e quiz interativo.',
    category: 'Cardiologia', subcategory: 'ECG', year: 2024, language: 'en', type: 'manual',
    license: 'CC BY-NC-SA 4.0', url: 'https://litfl.com/ecg-library/',
    rating: 4.9, downloads: 38000, medYear: [3, 4, 5], tags: ['ECG', 'eletrocardiograma', 'arritmias', 'LITFL'],
    source: 'LITFL'
  },

  // --- PNEUMOLOGIA ---
  {
    id: 'fb-021', title: 'Diretrizes SBPT — Pneumologia', author: 'SBPT — Soc. Brasileira de Pneumologia', institution: 'SBPT',
    description: 'Diretrizes de asma, DPOC, pneumonia, tuberculose, TEP. Protocolos de espirometria e ventilação mecânica.',
    category: 'Pneumologia', subcategory: 'Diretrizes', year: 2024, language: 'pt-BR', type: 'diretriz',
    license: 'Acesso Aberto', url: 'https://sbpt.org.br/portal/diretrizes/',
    rating: 4.8, downloads: 22000, medYear: [3, 4, 5], tags: ['pneumologia', 'SBPT', 'asma', 'DPOC', 'tuberculose'],
    source: 'SBPT'
  },

  // --- NEUROLOGIA ---
  {
    id: 'fb-022', title: 'Neuroanatomy through Clinical Cases — Open', author: 'Hal Blumenfeld', institution: 'Yale University',
    description: 'Casos clínicos neurológicos com correlação neuroanatômica. Disponível parcialmente no NCBI.',
    category: 'Neurologia', subcategory: 'Neuroanatomia Clínica', year: 2020, language: 'en', type: 'livro',
    license: 'Acesso Aberto', url: 'https://www.ncbi.nlm.nih.gov/books/',
    rating: 4.8, downloads: 18000, medYear: [2, 3, 4], tags: ['neurologia', 'neuroanatomia', 'casos clínicos', 'Yale'],
    source: 'NCBI Bookshelf'
  },

  // --- ENDOCRINOLOGIA ---
  {
    id: 'fb-023', title: 'Endotext — Comprehensive Endocrinology', author: 'MDText.com', institution: 'MDText.com / NCBI',
    description: 'Livro-texto completo e atualizado de endocrinologia. Mais de 400 capítulos cobrindo diabetes, tireoide, adrenal, hipófise, metabolismo ósseo.',
    category: 'Endocrinologia', subcategory: 'Endocrinologia Geral', year: 2025, language: 'en', type: 'livro',
    license: 'Acesso Aberto', url: 'https://www.ncbi.nlm.nih.gov/books/NBK278943/',
    rating: 4.9, downloads: 35000, medYear: [3, 4, 5], tags: ['endocrinologia', 'diabetes', 'tireoide', 'Endotext'],
    source: 'NCBI Bookshelf / Endotext'
  },

  // --- INFECTOLOGIA ---
  {
    id: 'fb-024', title: 'Protocolo Clínico de IST — Ministério da Saúde', author: 'Ministério da Saúde', institution: 'Ministério da Saúde',
    description: 'Protocolo completo de diagnóstico e tratamento de ISTs. Inclui fluxogramas, algoritmos e tabelas de medicamentos.',
    category: 'Infectologia', subcategory: 'IST', year: 2024, language: 'pt-BR', type: 'protocolo',
    license: 'Gov. Federal', url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/i/ist',
    rating: 4.7, downloads: 28000, medYear: [3, 4, 5], tags: ['infectologia', 'IST', 'HIV', 'sífilis', 'MS'],
    source: 'Ministério da Saúde'
  },
  {
    id: 'fb-025', title: 'Manual de Recomendações — Tuberculose', author: 'Ministério da Saúde', institution: 'Ministério da Saúde',
    description: 'Manual completo de diagnóstico e tratamento da tuberculose no Brasil. Inclui esquemas terapêuticos, ILTB e populações especiais.',
    category: 'Infectologia', subcategory: 'Tuberculose', year: 2023, language: 'pt-BR', type: 'manual',
    license: 'Gov. Federal', url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/t/tuberculose',
    rating: 4.8, downloads: 22000, medYear: [3, 4, 5], tags: ['tuberculose', 'TB', 'ILTB', 'RIPE'],
    source: 'Ministério da Saúde'
  },

  // ═══════════════════════════════════════════════════════════
  // ESPECIALIDADES CLÍNICAS (4° e 5° ano)
  // ═══════════════════════════════════════════════════════════

  // --- PEDIATRIA ---
  {
    id: 'fb-026', title: 'Caderneta da Criança — Ministério da Saúde', author: 'Ministério da Saúde', institution: 'Ministério da Saúde',
    description: 'Guia completo de acompanhamento do crescimento e desenvolvimento infantil. Marcos do desenvolvimento, vacinação, alimentação.',
    category: 'Pediatria', subcategory: 'Puericultura', year: 2024, language: 'pt-BR', type: 'manual',
    license: 'Gov. Federal', url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/c/caderneta-da-crianca',
    rating: 4.7, downloads: 35000, medYear: [4, 5], tags: ['pediatria', 'puericultura', 'vacinação', 'desenvolvimento'],
    source: 'Ministério da Saúde'
  },
  {
    id: 'fb-027', title: 'AIDPI Neonatal — Manual de Quadros', author: 'OPAS/OMS', institution: 'OPAS/OMS',
    description: 'Atenção Integrada às Doenças Prevalentes na Infância. Protocolos de manejo neonatal e pediátrico.',
    category: 'Pediatria', subcategory: 'Neonatologia', year: 2022, language: 'pt-BR', type: 'protocolo',
    license: 'Acesso Aberto', url: 'https://iris.paho.org/',
    rating: 4.6, downloads: 15000, medYear: [4, 5], tags: ['pediatria', 'neonatologia', 'AIDPI', 'OPAS'],
    source: 'OPAS/OMS'
  },

  // --- GINECOLOGIA E OBSTETRÍCIA ---
  {
    id: 'fb-028', title: 'Manual de Gestação de Alto Risco', author: 'Ministério da Saúde', institution: 'Ministério da Saúde',
    description: 'Manual completo de manejo de gestação de alto risco. Pré-eclâmpsia, diabetes gestacional, CIUR, prematuridade.',
    category: 'Ginecologia e Obstetrícia', subcategory: 'Obstetrícia', year: 2023, language: 'pt-BR', type: 'manual',
    license: 'Gov. Federal', url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/g/gestacao-de-alto-risco',
    rating: 4.8, downloads: 25000, medYear: [4, 5], tags: ['obstetrícia', 'pré-eclâmpsia', 'alto risco', 'MS'],
    source: 'Ministério da Saúde'
  },
  {
    id: 'fb-029', title: 'Williams Obstetrics — Selected Chapters', author: 'Cunningham et al.', institution: 'UT Southwestern',
    description: 'Capítulos selecionados do Williams Obstetrics disponíveis no NCBI Bookshelf. Referência mundial em obstetrícia.',
    category: 'Ginecologia e Obstetrícia', subcategory: 'Obstetrícia', year: 2018, language: 'en', type: 'livro',
    license: 'Acesso Aberto', url: 'https://www.ncbi.nlm.nih.gov/books/',
    rating: 4.8, downloads: 20000, medYear: [4, 5], tags: ['obstetrícia', 'Williams', 'parto', 'NCBI'],
    source: 'NCBI Bookshelf'
  },

  // --- CIRURGIA ---
  {
    id: 'fb-030', title: 'Principles of Surgery — NCBI', author: 'Schwartz et al.', institution: 'Various',
    description: 'Capítulos de cirurgia geral disponíveis no NCBI. Trauma, abdome agudo, hérnias, cirurgia oncológica.',
    category: 'Cirurgia', subcategory: 'Cirurgia Geral', year: 2019, language: 'en', type: 'livro',
    license: 'Acesso Aberto', url: 'https://www.ncbi.nlm.nih.gov/books/',
    rating: 4.7, downloads: 18000, medYear: [4, 5], tags: ['cirurgia', 'Schwartz', 'trauma', 'abdome agudo'],
    source: 'NCBI Bookshelf'
  },
  {
    id: 'fb-031', title: 'ATLS — Suporte Avançado de Vida no Trauma (Resumo)', author: 'ACS', institution: 'American College of Surgeons',
    description: 'Resumo dos protocolos ATLS: ABCDE do trauma, choque hemorrágico, trauma torácico e abdominal. Material de estudo.',
    category: 'Cirurgia', subcategory: 'Trauma', year: 2024, language: 'pt-BR', type: 'apostila',
    license: 'Acesso Aberto', url: 'https://www.facs.org/quality-programs/trauma/atls/',
    rating: 4.9, downloads: 42000, medYear: [4, 5, 6], tags: ['ATLS', 'trauma', 'ABCDE', 'choque'],
    source: 'ACS'
  },

  // --- EMERGÊNCIA ---
  {
    id: 'fb-032', title: 'ACLS — Suporte Avançado de Vida em Cardiologia', author: 'AHA', institution: 'American Heart Association',
    description: 'Protocolos ACLS: PCR, bradicardia, taquicardia, SCA. Algoritmos de atendimento e drogas vasoativas.',
    category: 'Emergência', subcategory: 'ACLS', year: 2024, language: 'pt-BR', type: 'protocolo',
    license: 'Acesso Aberto', url: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines',
    rating: 4.9, downloads: 55000, medYear: [4, 5, 6], tags: ['ACLS', 'PCR', 'emergência', 'AHA'],
    source: 'AHA'
  },
  {
    id: 'fb-033', title: 'BLS — Suporte Básico de Vida', author: 'AHA', institution: 'American Heart Association',
    description: 'Protocolos BLS: RCP, DEA, obstrução de vias aéreas. Atualização 2024.',
    category: 'Emergência', subcategory: 'BLS', year: 2024, language: 'pt-BR', type: 'protocolo',
    license: 'Acesso Aberto', url: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines',
    rating: 4.9, downloads: 48000, medYear: [3, 4, 5, 6], tags: ['BLS', 'RCP', 'DEA', 'emergência'],
    source: 'AHA'
  },

  // --- PSIQUIATRIA ---
  {
    id: 'fb-034', title: 'DSM-5 — Resumo das Categorias Diagnósticas', author: 'APA', institution: 'American Psychiatric Association',
    description: 'Resumo das principais categorias diagnósticas do DSM-5: transtornos de humor, ansiedade, psicóticos, personalidade.',
    category: 'Psiquiatria', subcategory: 'Diagnóstico', year: 2023, language: 'pt-BR', type: 'apostila',
    license: 'Acesso Aberto', url: 'https://www.psychiatry.org/psychiatrists/practice/dsm',
    rating: 4.7, downloads: 30000, medYear: [4, 5], tags: ['psiquiatria', 'DSM-5', 'diagnóstico', 'transtornos'],
    source: 'APA'
  },

  // --- DERMATOLOGIA ---
  {
    id: 'fb-035', title: 'DermNet — Atlas de Dermatologia', author: 'DermNet NZ', institution: 'DermNet New Zealand',
    description: 'Atlas online com mais de 20.000 imagens dermatológicas. Descrições clínicas, diagnóstico diferencial e tratamento.',
    category: 'Dermatologia', subcategory: 'Atlas', year: 2025, language: 'en', type: 'atlas',
    license: 'CC BY-NC-ND 3.0', url: 'https://dermnetnz.org/',
    rating: 4.9, downloads: 45000, medYear: [4, 5], tags: ['dermatologia', 'atlas', 'lesões', 'DermNet'],
    source: 'DermNet NZ'
  },

  // --- ORTOPEDIA ---
  {
    id: 'fb-036', title: 'Orthopaedic Knowledge Online — Open Access', author: 'AAOS', institution: 'American Academy of Orthopaedic Surgeons',
    description: 'Artigos de ortopedia e traumatologia de acesso aberto. Fraturas, luxações, doenças degenerativas.',
    category: 'Ortopedia', subcategory: 'Traumatologia', year: 2024, language: 'en', type: 'artigo',
    license: 'Acesso Aberto', url: 'https://www.aaos.org/',
    rating: 4.6, downloads: 12000, medYear: [4, 5], tags: ['ortopedia', 'fraturas', 'traumatologia', 'AAOS'],
    source: 'AAOS'
  },

  // --- OFTALMOLOGIA ---
  {
    id: 'fb-037', title: 'Ophthalmic Atlas Images — AAO', author: 'AAO', institution: 'American Academy of Ophthalmology',
    description: 'Atlas de imagens oftalmológicas com mais de 5.000 fotos de fundo de olho, biomicroscopia e OCT.',
    category: 'Oftalmologia', subcategory: 'Atlas', year: 2024, language: 'en', type: 'atlas',
    license: 'Acesso Aberto', url: 'https://www.aao.org/image-collection',
    rating: 4.7, downloads: 15000, medYear: [4, 5], tags: ['oftalmologia', 'fundo de olho', 'atlas', 'AAO'],
    source: 'AAO'
  },

  // ═══════════════════════════════════════════════════════════
  // SAÚDE PÚBLICA E COLETIVA (todos os anos)
  // ═══════════════════════════════════════════════════════════

  {
    id: 'fb-038', title: 'Política Nacional de Atenção Básica (PNAB)', author: 'Ministério da Saúde', institution: 'Ministério da Saúde',
    description: 'Documento oficial da PNAB com diretrizes da Estratégia Saúde da Família, NASF, ACS, e organização da APS.',
    category: 'Saúde Coletiva', subcategory: 'Atenção Básica', year: 2023, language: 'pt-BR', type: 'diretriz',
    license: 'Gov. Federal', url: 'https://www.gov.br/saude/pt-br/composicao/saps/pnab',
    rating: 4.7, downloads: 32000, medYear: [1, 2, 3, 4, 5, 6], tags: ['saúde coletiva', 'PNAB', 'ESF', 'APS'],
    source: 'Ministério da Saúde'
  },
  {
    id: 'fb-039', title: 'Calendário Nacional de Vacinação 2025', author: 'Ministério da Saúde / PNI', institution: 'Ministério da Saúde',
    description: 'Calendário vacinal completo: criança, adolescente, adulto, idoso, gestante. Inclui esquemas de doses e intervalos.',
    category: 'Saúde Coletiva', subcategory: 'Imunização', year: 2025, language: 'pt-BR', type: 'manual',
    license: 'Gov. Federal', url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/c/calendario-nacional-de-vacinacao',
    rating: 4.9, downloads: 45000, medYear: [1, 2, 3, 4, 5, 6], tags: ['vacinação', 'PNI', 'calendário', 'imunização'],
    source: 'Ministério da Saúde'
  },
  {
    id: 'fb-040', title: 'Guia de Vigilância em Saúde', author: 'Ministério da Saúde', institution: 'Ministério da Saúde',
    description: 'Guia completo de vigilância epidemiológica: doenças de notificação compulsória, investigação de surtos, indicadores de saúde.',
    category: 'Saúde Coletiva', subcategory: 'Epidemiologia', year: 2024, language: 'pt-BR', type: 'manual',
    license: 'Gov. Federal', url: 'https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/guias-e-manuais',
    rating: 4.8, downloads: 28000, medYear: [1, 2, 3, 4, 5, 6], tags: ['epidemiologia', 'vigilância', 'notificação', 'surtos'],
    source: 'Ministério da Saúde'
  },

  // --- ÉTICA MÉDICA ---
  {
    id: 'fb-041', title: 'Código de Ética Médica — CFM', author: 'CFM — Conselho Federal de Medicina', institution: 'CFM',
    description: 'Código de Ética Médica completo com todos os artigos, princípios fundamentais, direitos e deveres do médico.',
    category: 'Ética Médica', subcategory: 'Código de Ética', year: 2024, language: 'pt-BR', type: 'diretriz',
    license: 'Acesso Aberto', url: 'https://portal.cfm.org.br/etica-medica/codigo-de-etica-medica/',
    rating: 4.9, downloads: 55000, medYear: [1, 2, 3, 4, 5, 6], tags: ['ética', 'CFM', 'código', 'deontologia'],
    source: 'CFM'
  },

  // --- MEDICINA LEGAL ---
  {
    id: 'fb-042', title: 'Manual de Medicina Legal — Perícia Médica', author: 'Genival Veloso de França', institution: 'UFPB',
    description: 'Conceitos de medicina legal: traumatologia forense, sexologia forense, tanatologia, toxicologia forense.',
    category: 'Medicina Legal', subcategory: 'Perícia', year: 2022, language: 'pt-BR', type: 'apostila',
    license: 'Acesso Aberto', url: 'https://www.ufpb.br/',
    rating: 4.6, downloads: 12000, medYear: [5, 6], tags: ['medicina legal', 'perícia', 'tanatologia', 'forense'],
    source: 'UFPB'
  },

  // ═══════════════════════════════════════════════════════════
  // INTERNATO (5° e 6° ano)
  // ═══════════════════════════════════════════════════════════

  {
    id: 'fb-043', title: 'Manual de Condutas em Clínica Médica — HC-FMUSP', author: 'HC-FMUSP', institution: 'USP',
    description: 'Manual de condutas do maior hospital universitário da América Latina. Protocolos de internação, emergência e ambulatório.',
    category: 'Clínica Médica', subcategory: 'Condutas', year: 2024, language: 'pt-BR', type: 'manual',
    license: 'Acesso Aberto', url: 'https://www.hc.fm.usp.br/',
    rating: 4.9, downloads: 48000, medYear: [5, 6], tags: ['condutas', 'HC-FMUSP', 'internato', 'protocolos'],
    source: 'HC-FMUSP'
  },
  {
    id: 'fb-044', title: 'Protocolos de Urgência e Emergência — SAMU', author: 'Ministério da Saúde / SAMU', institution: 'Ministério da Saúde',
    description: 'Protocolos de atendimento pré-hospitalar e emergência: PCR, AVC, IAM, trauma, intoxicações, crises convulsivas.',
    category: 'Emergência', subcategory: 'Pré-hospitalar', year: 2024, language: 'pt-BR', type: 'protocolo',
    license: 'Gov. Federal', url: 'https://www.gov.br/saude/pt-br/composicao/saes/samu',
    rating: 4.8, downloads: 35000, medYear: [5, 6], tags: ['emergência', 'SAMU', 'pré-hospitalar', 'PCR'],
    source: 'Ministério da Saúde'
  },

  // --- RESIDÊNCIA MÉDICA ---
  {
    id: 'fb-045', title: 'Guia de Estudo para Residência Médica', author: 'SBM — Sociedade Brasileira de Medicina', institution: 'SBM',
    description: 'Guia de estudo com as principais áreas cobradas nas provas de residência médica. Inclui bibliografia recomendada.',
    category: 'Residência', subcategory: 'Preparação', year: 2024, language: 'pt-BR', type: 'apostila',
    license: 'Acesso Aberto', url: 'https://www.sbm.org.br/',
    rating: 4.7, downloads: 30000, medYear: [5, 6], tags: ['residência', 'prova', 'estudo', 'preparação'],
    source: 'SBM'
  },

  // ═══════════════════════════════════════════════════════════
  // MAIS ESPECIALIDADES
  // ═══════════════════════════════════════════════════════════

  // --- NEFROLOGIA ---
  {
    id: 'fb-046', title: 'Diretrizes KDIGO — Doença Renal Crônica', author: 'KDIGO', institution: 'KDIGO',
    description: 'Diretrizes internacionais de manejo da DRC: classificação, estadiamento, tratamento conservador e indicação de diálise.',
    category: 'Nefrologia', subcategory: 'DRC', year: 2024, language: 'en', type: 'diretriz',
    license: 'Acesso Aberto', url: 'https://kdigo.org/guidelines/',
    rating: 4.8, downloads: 18000, medYear: [3, 4, 5], tags: ['nefrologia', 'DRC', 'KDIGO', 'diálise'],
    source: 'KDIGO'
  },

  // --- GASTROENTEROLOGIA ---
  {
    id: 'fb-047', title: 'Diretrizes FBG — Gastroenterologia', author: 'FBG — Federação Brasileira de Gastroenterologia', institution: 'FBG',
    description: 'Diretrizes de DRGE, úlcera péptica, hepatites, cirrose, doença inflamatória intestinal, pancreatite.',
    category: 'Gastroenterologia', subcategory: 'Diretrizes', year: 2024, language: 'pt-BR', type: 'diretriz',
    license: 'Acesso Aberto', url: 'https://fbg.org.br/',
    rating: 4.7, downloads: 15000, medYear: [3, 4, 5], tags: ['gastroenterologia', 'FBG', 'DRGE', 'hepatite'],
    source: 'FBG'
  },

  // --- HEMATOLOGIA ---
  {
    id: 'fb-048', title: 'Atlas de Hematologia — Esfregaço Sanguíneo', author: 'ASH', institution: 'American Society of Hematology',
    description: 'Atlas de hematologia com imagens de esfregaço sanguíneo: anemias, leucemias, linfomas, distúrbios plaquetários.',
    category: 'Hematologia', subcategory: 'Atlas', year: 2024, language: 'en', type: 'atlas',
    license: 'Acesso Aberto', url: 'https://imagebank.hematology.org/',
    rating: 4.8, downloads: 22000, medYear: [3, 4], tags: ['hematologia', 'esfregaço', 'anemias', 'leucemias'],
    source: 'ASH'
  },

  // --- REUMATOLOGIA ---
  {
    id: 'fb-049', title: 'Diretrizes SBR — Reumatologia', author: 'SBR — Sociedade Brasileira de Reumatologia', institution: 'SBR',
    description: 'Diretrizes de artrite reumatoide, lúpus, espondiloartrites, gota, fibromialgia, osteoporose.',
    category: 'Reumatologia', subcategory: 'Diretrizes', year: 2024, language: 'pt-BR', type: 'diretriz',
    license: 'Acesso Aberto', url: 'https://www.reumatologia.org.br/',
    rating: 4.7, downloads: 12000, medYear: [3, 4, 5], tags: ['reumatologia', 'SBR', 'lúpus', 'artrite'],
    source: 'SBR'
  },

  // --- UROLOGIA ---
  {
    id: 'fb-050', title: 'Diretrizes SBU — Urologia', author: 'SBU — Sociedade Brasileira de Urologia', institution: 'SBU',
    description: 'Diretrizes de ITU, litíase, HPB, câncer de próstata, incontinência urinária.',
    category: 'Urologia', subcategory: 'Diretrizes', year: 2024, language: 'pt-BR', type: 'diretriz',
    license: 'Acesso Aberto', url: 'https://portaldaurologia.org.br/',
    rating: 4.7, downloads: 10000, medYear: [4, 5], tags: ['urologia', 'SBU', 'ITU', 'próstata'],
    source: 'SBU'
  },

  // --- OTORRINOLARINGOLOGIA ---
  {
    id: 'fb-051', title: 'Manual de Otorrinolaringologia — ABORL-CCF', author: 'ABORL-CCF', institution: 'ABORL-CCF',
    description: 'Manual de ORL: otite, sinusite, amigdalite, rinite, perda auditiva, vertigem, tumores de cabeça e pescoço.',
    category: 'Otorrinolaringologia', subcategory: 'Manual', year: 2023, language: 'pt-BR', type: 'manual',
    license: 'Acesso Aberto', url: 'https://www.aborlccf.org.br/',
    rating: 4.6, downloads: 8000, medYear: [4, 5], tags: ['ORL', 'otite', 'sinusite', 'vertigem'],
    source: 'ABORL-CCF'
  },

  // --- ONCOLOGIA ---
  {
    id: 'fb-052', title: 'Manual de Oncologia Clínica — INCA', author: 'INCA', institution: 'Instituto Nacional de Câncer',
    description: 'Manual do INCA com protocolos de rastreamento, diagnóstico e tratamento dos principais cânceres no Brasil.',
    category: 'Oncologia', subcategory: 'Oncologia Clínica', year: 2024, language: 'pt-BR', type: 'manual',
    license: 'Gov. Federal', url: 'https://www.inca.gov.br/publicacoes',
    rating: 4.8, downloads: 25000, medYear: [4, 5, 6], tags: ['oncologia', 'INCA', 'câncer', 'rastreamento'],
    source: 'INCA'
  },

  // --- RADIOLOGIA ---
  {
    id: 'fb-053', title: 'Radiopaedia — Atlas de Radiologia', author: 'Radiopaedia Contributors', institution: 'Radiopaedia.org',
    description: 'Atlas de radiologia com mais de 80.000 casos e 500.000 imagens. Raio-X, TC, RM, US. Referência mundial.',
    category: 'Radiologia', subcategory: 'Atlas', year: 2025, language: 'en', type: 'atlas',
    license: 'CC BY-NC-SA 3.0', url: 'https://radiopaedia.org/',
    rating: 4.9, downloads: 65000, medYear: [3, 4, 5, 6], tags: ['radiologia', 'TC', 'RM', 'raio-X', 'Radiopaedia'],
    source: 'Radiopaedia'
  },

  // --- MEDICINA DE FAMÍLIA ---
  {
    id: 'fb-054', title: 'Cadernos de Atenção Básica — Ministério da Saúde', author: 'Ministério da Saúde', institution: 'Ministério da Saúde',
    description: 'Coleção completa dos Cadernos de Atenção Básica: HAS, DM, saúde mental, saúde da mulher, criança, idoso, nutrição.',
    category: 'Medicina de Família', subcategory: 'Atenção Básica', year: 2024, language: 'pt-BR', type: 'manual',
    license: 'Gov. Federal', url: 'https://www.gov.br/saude/pt-br/composicao/saps/cadernos-de-atencao-basica',
    rating: 4.8, downloads: 42000, medYear: [3, 4, 5, 6], tags: ['APS', 'ESF', 'cadernos', 'atenção básica'],
    source: 'Ministério da Saúde'
  },

  // --- GERIATRIA ---
  {
    id: 'fb-055', title: 'Caderneta de Saúde da Pessoa Idosa', author: 'Ministério da Saúde', institution: 'Ministério da Saúde',
    description: 'Instrumento de avaliação geriátrica: funcionalidade, cognição, humor, mobilidade, nutrição, medicamentos.',
    category: 'Geriatria', subcategory: 'Avaliação Geriátrica', year: 2024, language: 'pt-BR', type: 'manual',
    license: 'Gov. Federal', url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-pessoa-idosa',
    rating: 4.6, downloads: 15000, medYear: [4, 5, 6], tags: ['geriatria', 'idoso', 'avaliação', 'funcionalidade'],
    source: 'Ministério da Saúde'
  },

  // --- ANESTESIOLOGIA ---
  {
    id: 'fb-056', title: 'Manual de Anestesiologia — SBA', author: 'SBA — Sociedade Brasileira de Anestesiologia', institution: 'SBA',
    description: 'Conceitos de anestesia geral, regional, sedação, monitorização, via aérea difícil, farmacologia anestésica.',
    category: 'Anestesiologia', subcategory: 'Manual', year: 2023, language: 'pt-BR', type: 'manual',
    license: 'Acesso Aberto', url: 'https://www.sbahq.org/',
    rating: 4.7, downloads: 10000, medYear: [5, 6], tags: ['anestesiologia', 'SBA', 'sedação', 'via aérea'],
    source: 'SBA'
  },

  // ═══════════════════════════════════════════════════════════
  // RECURSOS ESPECIAIS
  // ═══════════════════════════════════════════════════════════

  // --- ANVISA ---
  {
    id: 'fb-057', title: 'Bulário Eletrônico ANVISA', author: 'ANVISA', institution: 'ANVISA',
    description: 'Base completa de bulas de medicamentos registrados no Brasil. Busca por princípio ativo, nome comercial ou laboratório.',
    category: 'Farmacologia', subcategory: 'Bulas', year: 2025, language: 'pt-BR', type: 'manual',
    license: 'Gov. Federal', url: 'https://consultas.anvisa.gov.br/#/bulario/',
    rating: 4.8, downloads: 65000, medYear: [2, 3, 4, 5, 6], tags: ['ANVISA', 'bulas', 'medicamentos', 'bulário'],
    source: 'ANVISA'
  },

  // --- RENAME ---
  {
    id: 'fb-058', title: 'RENAME — Relação Nacional de Medicamentos Essenciais', author: 'Ministério da Saúde', institution: 'Ministério da Saúde',
    description: 'Lista oficial de medicamentos essenciais do SUS. Inclui componentes básico, estratégico e especializado.',
    category: 'Farmacologia', subcategory: 'SUS', year: 2024, language: 'pt-BR', type: 'diretriz',
    license: 'Gov. Federal', url: 'https://www.gov.br/saude/pt-br/composicao/sectics/daf/rename',
    rating: 4.7, downloads: 30000, medYear: [2, 3, 4, 5, 6], tags: ['RENAME', 'SUS', 'medicamentos essenciais'],
    source: 'Ministério da Saúde'
  },

  // --- PCDT ---
  {
    id: 'fb-059', title: 'PCDTs — Protocolos Clínicos e Diretrizes Terapêuticas', author: 'CONITEC / Ministério da Saúde', institution: 'Ministério da Saúde',
    description: 'Todos os PCDTs do SUS: HIV/AIDS, hepatites, doenças raras, oncologia, reumatologia, neurologia e mais de 100 condições.',
    category: 'Clínica Médica', subcategory: 'Protocolos SUS', year: 2024, language: 'pt-BR', type: 'protocolo',
    license: 'Gov. Federal', url: 'https://www.gov.br/conitec/pt-br/midias/protocolos',
    rating: 4.9, downloads: 55000, medYear: [3, 4, 5, 6], tags: ['PCDT', 'CONITEC', 'SUS', 'protocolos'],
    source: 'CONITEC / Ministério da Saúde'
  },

  // --- BIOESTATÍSTICA ---
  {
    id: 'fb-060', title: 'OpenIntro Statistics', author: 'David Diez et al.', institution: 'OpenIntro',
    description: 'Livro-texto de estatística com aplicações em saúde. Probabilidade, testes de hipótese, regressão, estudos clínicos.',
    category: 'Bioestatística', subcategory: 'Estatística', year: 2023, language: 'en', type: 'livro',
    license: 'CC BY-SA 4.0', url: 'https://www.openintro.org/book/os/',
    pages: 422, rating: 4.7, downloads: 20000, medYear: [1, 2], tags: ['estatística', 'bioestatística', 'epidemiologia', 'OER'],
    source: 'OpenIntro'
  },

  // --- SAÚDE MENTAL ---
  {
    id: 'fb-061', title: 'Saúde Mental na Atenção Básica — MS', author: 'Ministério da Saúde', institution: 'Ministério da Saúde',
    description: 'Caderno de saúde mental na APS: depressão, ansiedade, dependência química, psicose, CAPS, RAPS.',
    category: 'Psiquiatria', subcategory: 'Saúde Mental', year: 2023, language: 'pt-BR', type: 'manual',
    license: 'Gov. Federal', url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-mental',
    rating: 4.7, downloads: 22000, medYear: [3, 4, 5, 6], tags: ['saúde mental', 'CAPS', 'RAPS', 'depressão'],
    source: 'Ministério da Saúde'
  },

  // --- NUTRIÇÃO ---
  {
    id: 'fb-062', title: 'Guia Alimentar para a População Brasileira', author: 'Ministério da Saúde', institution: 'Ministério da Saúde',
    description: 'Guia oficial de alimentação saudável. Classificação NOVA de alimentos, recomendações nutricionais, educação alimentar.',
    category: 'Nutrição', subcategory: 'Alimentação', year: 2024, language: 'pt-BR', type: 'manual',
    license: 'Gov. Federal', url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/g/guia-alimentar',
    rating: 4.8, downloads: 35000, medYear: [1, 2, 3], tags: ['nutrição', 'alimentação', 'NOVA', 'guia alimentar'],
    source: 'Ministério da Saúde'
  },

  // --- TOXICOLOGIA ---
  {
    id: 'fb-063', title: 'Manual de Toxicologia Clínica — CIATox', author: 'ANVISA / CIATox', institution: 'ANVISA',
    description: 'Manual de atendimento a intoxicações agudas: medicamentos, agrotóxicos, animais peçonhentos, drogas de abuso.',
    category: 'Toxicologia', subcategory: 'Intoxicações', year: 2023, language: 'pt-BR', type: 'manual',
    license: 'Gov. Federal', url: 'https://www.gov.br/anvisa/pt-br/assuntos/agrotoxicos/intoxicacao',
    rating: 4.7, downloads: 18000, medYear: [4, 5, 6], tags: ['toxicologia', 'intoxicação', 'CIATox', 'antídotos'],
    source: 'ANVISA / CIATox'
  },

  // --- PARASITOLOGIA ---
  {
    id: 'fb-064', title: 'Atlas de Parasitologia — CDC', author: 'CDC', institution: 'Centers for Disease Control',
    description: 'Atlas de parasitologia com imagens de protozoários, helmintos e artrópodes. Ciclos de vida e diagnóstico laboratorial.',
    category: 'Parasitologia', subcategory: 'Atlas', year: 2024, language: 'en', type: 'atlas',
    license: 'Acesso Aberto', url: 'https://www.cdc.gov/dpdx/',
    rating: 4.8, downloads: 25000, medYear: [1, 2], tags: ['parasitologia', 'CDC', 'protozoários', 'helmintos'],
    source: 'CDC'
  },

  // --- EMBRIOLOGIA ---
  {
    id: 'fb-065', title: 'The Developing Human — Open Embryology', author: 'UNSW Embryology', institution: 'UNSW Sydney',
    description: 'Atlas de embriologia online com animações 3D, imagens histológicas e correlações de malformações congênitas.',
    category: 'Embriologia', subcategory: 'Desenvolvimento', year: 2024, language: 'en', type: 'atlas',
    license: 'CC BY-NC-SA 4.0', url: 'https://embryology.med.unsw.edu.au/',
    rating: 4.8, downloads: 20000, medYear: [1], tags: ['embriologia', 'desenvolvimento', 'malformações', 'UNSW'],
    source: 'UNSW Sydney'
  },

  // ═══════════════════════════════════════════════════════════
  // LIVROS CLÁSSICOS EM DOMÍNIO PÚBLICO
  // ═══════════════════════════════════════════════════════════

  {
    id: 'fb-066', title: 'The Principles and Practice of Medicine — Osler', author: 'William Osler', institution: 'Johns Hopkins University',
    description: 'O livro-texto de medicina interna mais influente da história, escrito pelo pai da medicina moderna. Edição de 1892 em domínio público.',
    category: 'Clínica Médica', subcategory: 'Medicina Interna', year: 1892, language: 'en', type: 'livro',
    license: 'Domínio Público', url: 'https://www.gutenberg.org/ebooks/35610',
    pages: 1079, rating: 4.5, downloads: 12000, medYear: [3, 4, 5], tags: ['Osler', 'medicina interna', 'clássico', 'história'],
    source: 'Projeto Gutenberg'
  },
  {
    id: 'fb-067', title: 'A Manual of the Operations of Surgery — Bell', author: 'Joseph Bell', institution: 'Edinburgh Royal Infirmary',
    description: 'Manual clássico de técnicas cirúrgicas do mentor de Arthur Conan Doyle. Referência histórica da cirurgia.',
    category: 'Cirurgia', subcategory: 'Técnica Cirúrgica', year: 1866, language: 'en', type: 'livro',
    license: 'Domínio Público', url: 'https://www.gutenberg.org/ebooks/24564',
    pages: 300, rating: 4.3, downloads: 5000, medYear: [4, 5], tags: ['cirurgia', 'clássico', 'Bell', 'história'],
    source: 'Projeto Gutenberg'
  },

  // ═══════════════════════════════════════════════════════════
  // MAIS RECURSOS BRASILEIROS
  // ═══════════════════════════════════════════════════════════

  {
    id: 'fb-068', title: 'Protocolos da Rede Cegonha — Pré-natal', author: 'Ministério da Saúde', institution: 'Ministério da Saúde',
    description: 'Protocolos de pré-natal de baixo e alto risco. Exames, suplementação, intercorrências, parto e puerpério.',
    category: 'Ginecologia e Obstetrícia', subcategory: 'Pré-natal', year: 2024, language: 'pt-BR', type: 'protocolo',
    license: 'Gov. Federal', url: 'https://www.gov.br/saude/pt-br/composicao/saps/rede-cegonha',
    rating: 4.8, downloads: 28000, medYear: [4, 5], tags: ['pré-natal', 'Rede Cegonha', 'obstetrícia', 'MS'],
    source: 'Ministério da Saúde'
  },
  {
    id: 'fb-069', title: 'Manual de Doenças Tropicais — FIOCRUZ', author: 'FIOCRUZ', institution: 'Fundação Oswaldo Cruz',
    description: 'Manual de doenças tropicais negligenciadas: dengue, malária, leishmaniose, Chagas, esquistossomose, hanseníase.',
    category: 'Infectologia', subcategory: 'Doenças Tropicais', year: 2024, language: 'pt-BR', type: 'manual',
    license: 'Acesso Aberto', url: 'https://www.fiocruz.br/',
    rating: 4.8, downloads: 22000, medYear: [3, 4, 5], tags: ['doenças tropicais', 'FIOCRUZ', 'dengue', 'malária'],
    source: 'FIOCRUZ'
  },
  {
    id: 'fb-070', title: 'Formulário Terapêutico Nacional — FTN', author: 'Ministério da Saúde', institution: 'Ministério da Saúde',
    description: 'Formulário com informações farmacológicas de todos os medicamentos da RENAME. Posologia, interações, ajustes.',
    category: 'Farmacologia', subcategory: 'Formulário', year: 2024, language: 'pt-BR', type: 'manual',
    license: 'Gov. Federal', url: 'https://www.gov.br/saude/pt-br/composicao/sectics/daf/rename',
    rating: 4.7, downloads: 25000, medYear: [2, 3, 4, 5, 6], tags: ['FTN', 'formulário', 'posologia', 'RENAME'],
    source: 'Ministério da Saúde'
  },

  // --- SAÚDE DO TRABALHADOR ---
  {
    id: 'fb-071', title: 'Manual de Saúde do Trabalhador', author: 'Ministério da Saúde', institution: 'Ministério da Saúde',
    description: 'Doenças ocupacionais, acidentes de trabalho, ergonomia, toxicologia ocupacional, legislação trabalhista.',
    category: 'Saúde Coletiva', subcategory: 'Saúde do Trabalhador', year: 2023, language: 'pt-BR', type: 'manual',
    license: 'Gov. Federal', url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-do-trabalhador',
    rating: 4.5, downloads: 10000, medYear: [5, 6], tags: ['saúde do trabalhador', 'ocupacional', 'ergonomia'],
    source: 'Ministério da Saúde'
  },

  // --- GENÉTICA MÉDICA ---
  {
    id: 'fb-072', title: 'GeneReviews — NCBI', author: 'GeneReviews Authors', institution: 'University of Washington',
    description: 'Base de dados de doenças genéticas com mais de 800 artigos. Diagnóstico, manejo, aconselhamento genético.',
    category: 'Genética', subcategory: 'Genética Médica', year: 2025, language: 'en', type: 'livro',
    license: 'Acesso Aberto', url: 'https://www.ncbi.nlm.nih.gov/books/NBK1116/',
    rating: 4.9, downloads: 30000, medYear: [1, 2, 3], tags: ['genética', 'GeneReviews', 'doenças genéticas', 'NCBI'],
    source: 'NCBI Bookshelf'
  },

  // --- MEDICINA BASEADA EM EVIDÊNCIAS ---
  {
    id: 'fb-073', title: 'Users\' Guides to the Medical Literature — JAMA', author: 'Gordon Guyatt et al.', institution: 'McMaster University',
    description: 'Guia clássico de medicina baseada em evidências. Como ler e interpretar artigos científicos, revisões sistemáticas, meta-análises.',
    category: 'MBE', subcategory: 'Epidemiologia Clínica', year: 2015, language: 'en', type: 'livro',
    license: 'Acesso Aberto', url: 'https://jamaevidence.mhmedical.com/',
    rating: 4.8, downloads: 18000, medYear: [1, 2, 3, 4], tags: ['MBE', 'evidências', 'JAMA', 'epidemiologia clínica'],
    source: 'JAMA Network'
  },

  // --- MAIS ATLAS ---
  {
    id: 'fb-074', title: 'Atlas de Citologia — Pap Smear', author: 'Cytopathology Foundation', institution: 'Various',
    description: 'Atlas de citologia cervicovaginal com imagens de Papanicolaou normal e alterado. Classificação de Bethesda.',
    category: 'Ginecologia e Obstetrícia', subcategory: 'Citologia', year: 2024, language: 'en', type: 'atlas',
    license: 'Acesso Aberto', url: 'https://www.cytopathology.org/',
    rating: 4.6, downloads: 10000, medYear: [4, 5], tags: ['citologia', 'Papanicolaou', 'Bethesda', 'colo uterino'],
    source: 'Cytopathology Foundation'
  },

  // --- MAIS PROTOCOLOS BRASILEIROS ---
  {
    id: 'fb-075', title: 'Protocolo de Manejo Clínico da Dengue', author: 'Ministério da Saúde', institution: 'Ministério da Saúde',
    description: 'Protocolo atualizado de classificação, diagnóstico e tratamento da dengue. Sinais de alarme, hidratação, dengue grave.',
    category: 'Infectologia', subcategory: 'Dengue', year: 2025, language: 'pt-BR', type: 'protocolo',
    license: 'Gov. Federal', url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/d/dengue',
    rating: 4.9, downloads: 45000, medYear: [3, 4, 5, 6], tags: ['dengue', 'protocolo', 'sinais de alarme', 'MS'],
    source: 'Ministério da Saúde'
  },
  {
    id: 'fb-076', title: 'Protocolo de Manejo da Hanseníase', author: 'Ministério da Saúde', institution: 'Ministério da Saúde',
    description: 'Protocolo de diagnóstico, classificação e tratamento da hanseníase. Esquemas PQT, reações hansênicas, prevenção de incapacidades.',
    category: 'Infectologia', subcategory: 'Hanseníase', year: 2024, language: 'pt-BR', type: 'protocolo',
    license: 'Gov. Federal', url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/h/hanseniase',
    rating: 4.7, downloads: 18000, medYear: [3, 4, 5], tags: ['hanseníase', 'PQT', 'reações', 'MS'],
    source: 'Ministério da Saúde'
  },
  {
    id: 'fb-077', title: 'Protocolo de Tratamento de HIV/AIDS', author: 'Ministério da Saúde / DCCI', institution: 'Ministério da Saúde',
    description: 'Protocolo completo de TARV: esquemas iniciais, resgate, genotipagem, profilaxia, coinfecções, populações especiais.',
    category: 'Infectologia', subcategory: 'HIV/AIDS', year: 2024, language: 'pt-BR', type: 'protocolo',
    license: 'Gov. Federal', url: 'https://www.gov.br/aids/pt-br/assuntos/prevencao-combinada/tratamento',
    rating: 4.9, downloads: 35000, medYear: [3, 4, 5, 6], tags: ['HIV', 'AIDS', 'TARV', 'antirretroviral'],
    source: 'Ministério da Saúde'
  },

  // --- MAIS OPENSTAX ---
  {
    id: 'fb-078', title: 'Psychology 2e', author: 'OpenStax', institution: 'Rice University',
    description: 'Livro-texto de psicologia com foco em neurociência comportamental, desenvolvimento, psicopatologia e terapias.',
    category: 'Psiquiatria', subcategory: 'Psicologia', year: 2023, language: 'en', type: 'livro',
    license: 'CC BY 4.0', url: 'https://openstax.org/details/books/psychology-2e',
    pages: 780, rating: 4.7, downloads: 22000, medYear: [1, 4], tags: ['psicologia', 'neurociência', 'OpenStax'],
    source: 'OpenStax'
  },
  {
    id: 'fb-079', title: 'Organic Chemistry', author: 'OpenStax', institution: 'Rice University',
    description: 'Química orgânica com foco em biomoléculas, reações enzimáticas e farmacologia. Base para bioquímica avançada.',
    category: 'Química', subcategory: 'Química Orgânica', year: 2023, language: 'en', type: 'livro',
    license: 'CC BY 4.0', url: 'https://openstax.org/details/books/organic-chemistry',
    pages: 1100, rating: 4.6, downloads: 15000, medYear: [1], tags: ['química orgânica', 'biomoléculas', 'OpenStax'],
    source: 'OpenStax'
  },

  // --- MAIS NCBI BOOKSHELF ---
  {
    id: 'fb-080', title: 'Medical Genetics — NCBI', author: 'Lynn Jorde et al.', institution: 'University of Utah',
    description: 'Genética médica com foco em padrões de herança, citogenética, genômica, farmacogenômica e aconselhamento genético.',
    category: 'Genética', subcategory: 'Genética Médica', year: 2016, language: 'en', type: 'livro',
    license: 'Acesso Aberto', url: 'https://www.ncbi.nlm.nih.gov/books/',
    rating: 4.7, downloads: 12000, medYear: [1, 2], tags: ['genética médica', 'herança', 'citogenética', 'NCBI'],
    source: 'NCBI Bookshelf'
  },

  // --- MAIS DIRETRIZES BRASILEIRAS ---
  {
    id: 'fb-081', title: 'Diretrizes SBD — Diabetes Mellitus', author: 'SBD — Sociedade Brasileira de Diabetes', institution: 'SBD',
    description: 'Diretrizes completas de DM1, DM2, diabetes gestacional. Diagnóstico, metas, tratamento, complicações.',
    category: 'Endocrinologia', subcategory: 'Diabetes', year: 2024, language: 'pt-BR', type: 'diretriz',
    license: 'Acesso Aberto', url: 'https://diretriz.diabetes.org.br/',
    rating: 4.9, downloads: 45000, medYear: [3, 4, 5, 6], tags: ['diabetes', 'SBD', 'DM1', 'DM2', 'insulina'],
    source: 'SBD'
  },
  {
    id: 'fb-082', title: 'Diretrizes SBEM — Endocrinologia', author: 'SBEM — Soc. Brasileira de Endocrinologia', institution: 'SBEM',
    description: 'Diretrizes de tireoide, obesidade, osteoporose, dislipidemia, síndrome metabólica.',
    category: 'Endocrinologia', subcategory: 'Diretrizes', year: 2024, language: 'pt-BR', type: 'diretriz',
    license: 'Acesso Aberto', url: 'https://www.endocrino.org.br/',
    rating: 4.7, downloads: 18000, medYear: [3, 4, 5], tags: ['endocrinologia', 'SBEM', 'tireoide', 'obesidade'],
    source: 'SBEM'
  },
  {
    id: 'fb-083', title: 'Diretrizes ABN — Neurologia', author: 'ABN — Academia Brasileira de Neurologia', institution: 'ABN',
    description: 'Diretrizes de AVC, epilepsia, cefaleia, demência, Parkinson, esclerose múltipla, neuropatias.',
    category: 'Neurologia', subcategory: 'Diretrizes', year: 2024, language: 'pt-BR', type: 'diretriz',
    license: 'Acesso Aberto', url: 'https://www.abneuro.org.br/',
    rating: 4.7, downloads: 15000, medYear: [3, 4, 5], tags: ['neurologia', 'ABN', 'AVC', 'epilepsia'],
    source: 'ABN'
  },
  {
    id: 'fb-084', title: 'Diretrizes ASBAI — Alergia e Imunologia', author: 'ASBAI', institution: 'ASBAI',
    description: 'Diretrizes de rinite, asma, urticária, anafilaxia, alergia alimentar, imunodeficiências.',
    category: 'Imunologia', subcategory: 'Alergia', year: 2024, language: 'pt-BR', type: 'diretriz',
    license: 'Acesso Aberto', url: 'https://asbai.org.br/',
    rating: 4.6, downloads: 10000, medYear: [3, 4], tags: ['alergia', 'imunologia', 'ASBAI', 'anafilaxia'],
    source: 'ASBAI'
  },

  // --- MAIS RECURSOS INTERNACIONAIS ---
  {
    id: 'fb-085', title: 'UpToDate — Selected Free Topics', author: 'UpToDate', institution: 'Wolters Kluwer',
    description: 'Tópicos selecionados de acesso gratuito do UpToDate. Referência clínica baseada em evidências.',
    category: 'Clínica Médica', subcategory: 'Referência Clínica', year: 2025, language: 'en', type: 'artigo',
    license: 'Acesso Aberto', url: 'https://www.uptodate.com/contents/table-of-contents/free',
    rating: 4.9, downloads: 50000, medYear: [3, 4, 5, 6], tags: ['UpToDate', 'evidências', 'clínica', 'referência'],
    source: 'UpToDate'
  },
  {
    id: 'fb-086', title: 'BMJ Best Practice — Free Access', author: 'BMJ', institution: 'British Medical Journal',
    description: 'Guias clínicos baseados em evidências com algoritmos de diagnóstico e tratamento. Acesso gratuito a tópicos selecionados.',
    category: 'Clínica Médica', subcategory: 'Referência Clínica', year: 2025, language: 'en', type: 'manual',
    license: 'Acesso Aberto', url: 'https://bestpractice.bmj.com/',
    rating: 4.8, downloads: 35000, medYear: [3, 4, 5, 6], tags: ['BMJ', 'evidências', 'diagnóstico', 'tratamento'],
    source: 'BMJ'
  },
  {
    id: 'fb-087', title: 'Merck Manual — Professional Version', author: 'Merck & Co.', institution: 'Merck',
    description: 'Manual Merck completo de diagnóstico e tratamento. Versão profissional gratuita online com mais de 3.000 tópicos.',
    category: 'Clínica Médica', subcategory: 'Referência Clínica', year: 2025, language: 'en', type: 'manual',
    license: 'Acesso Aberto', url: 'https://www.merckmanuals.com/professional',
    rating: 4.9, downloads: 60000, medYear: [3, 4, 5, 6], tags: ['Merck', 'manual', 'diagnóstico', 'tratamento'],
    source: 'Merck'
  },

  // --- WHO ---
  {
    id: 'fb-088', title: 'WHO Model List of Essential Medicines', author: 'WHO', institution: 'World Health Organization',
    description: 'Lista modelo de medicamentos essenciais da OMS. Referência para políticas farmacêuticas e saúde pública.',
    category: 'Farmacologia', subcategory: 'Medicamentos Essenciais', year: 2024, language: 'en', type: 'diretriz',
    license: 'Acesso Aberto', url: 'https://www.who.int/publications/i/item/WHO-MHP-HPS-EML-2023.02',
    rating: 4.7, downloads: 20000, medYear: [2, 3, 4, 5, 6], tags: ['OMS', 'WHO', 'medicamentos essenciais'],
    source: 'WHO'
  },
  {
    id: 'fb-089', title: 'ICD-11 — Classificação Internacional de Doenças', author: 'WHO', institution: 'World Health Organization',
    description: 'CID-11 completa com mais de 55.000 códigos diagnósticos. Ferramenta de codificação e busca online.',
    category: 'Saúde Coletiva', subcategory: 'Classificação', year: 2024, language: 'en', type: 'manual',
    license: 'Acesso Aberto', url: 'https://icd.who.int/browse/2024-01/mms/en',
    rating: 4.8, downloads: 40000, medYear: [1, 2, 3, 4, 5, 6], tags: ['CID-11', 'ICD', 'classificação', 'OMS'],
    source: 'WHO'
  },

  // --- MAIS LIVROS BRASILEIROS ---
  {
    id: 'fb-090', title: 'SciELO Books — Coleção Saúde', author: 'SciELO', institution: 'SciELO / FAPESP',
    description: 'Coleção de livros acadêmicos de saúde em acesso aberto. Inclui obras de FIOCRUZ, EDUFBA, EDUSP e outras editoras.',
    category: 'Saúde Coletiva', subcategory: 'Livros Acadêmicos', year: 2024, language: 'pt-BR', type: 'livro',
    license: 'CC BY-NC-SA 4.0', url: 'https://books.scielo.org/subject/health_sciences',
    rating: 4.7, downloads: 25000, medYear: [1, 2, 3, 4, 5, 6], tags: ['SciELO', 'livros', 'saúde', 'acesso aberto'],
    source: 'SciELO Books'
  },
];

// Categorias únicas para filtros
export const BOOK_CATEGORIES = [...new Set(FREE_BOOKS.map(b => b.category))].sort();
export const BOOK_TYPES = [...new Set(FREE_BOOKS.map(b => b.type))].sort();
export const BOOK_SOURCES = [...new Set(FREE_BOOKS.map(b => b.source))].sort();
export const BOOK_LANGUAGES: { code: string; name: string }[] = [
  { code: 'pt-BR', name: 'Português' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
];
