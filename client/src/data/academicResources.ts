/**
 * MedFocus - Recursos Acadêmicos e Grades Curriculares
 * Dados de universidades brasileiras de medicina, livros recomendados,
 * fontes acadêmicas confiáveis (SciELO, PubMed, CAPES, etc.)
 */

// ============================================================
// TIPOS
// ============================================================

export interface University {
  id: string;
  name: string;
  shortName: string;
  state: string;
  city: string;
  type: 'federal' | 'estadual' | 'privada';
  ranking?: number; // posição no ranking nacional
  semesters: Semester[];
}

export interface Semester {
  number: number; // 1-12
  year: number; // 1-6
  half: 1 | 2; // 1º ou 2º semestre do ano
  label: string;
  disciplines: Discipline[];
}

export interface Discipline {
  code?: string;
  name: string;
  hours: number;
  category: DisciplineCategory;
  description?: string;
}

export type DisciplineCategory =
  | 'basica'
  | 'clinica'
  | 'cirurgica'
  | 'saude_publica'
  | 'etica_humanidades'
  | 'internato';

export interface BookRecommendation {
  title: string;
  author: string;
  edition?: string;
  publisher?: string;
  isbn?: string;
  category: DisciplineCategory | string;
  discipline: string; // nome da disciplina
  type: 'referencia' | 'complementar' | 'atlas' | 'manual' | 'consulta_rapida';
  free: boolean;
  purchaseUrl?: string;
  freeUrl?: string;
  description: string;
  yearRange: number[]; // anos do curso em que é mais útil [1,2] ou [3,4,5,6]
}

export interface AcademicSource {
  name: string;
  url: string;
  type: 'artigos' | 'teses' | 'livros' | 'diretrizes' | 'periodicos' | 'repositorio';
  description: string;
  language: 'pt' | 'en' | 'multi';
  free: boolean;
  institution?: string;
}

// ============================================================
// UNIVERSIDADES COM GRADES CURRICULARES
// ============================================================

export const UNIVERSITIES: University[] = [
  {
    id: 'usp',
    name: 'Universidade de São Paulo - Faculdade de Medicina',
    shortName: 'USP (FMUSP)',
    state: 'SP',
    city: 'São Paulo',
    type: 'estadual',
    ranking: 1,
    semesters: [
      {
        number: 1, year: 1, half: 1, label: '1º Semestre',
        disciplines: [
          { code: '6700001', name: 'Fundamentos das Ciências Médicas', hours: 210, category: 'basica' },
          { code: '6700002', name: 'Fundamentos Morfofuncionais da Medicina', hours: 210, category: 'basica' },
          { code: 'MSP1010', name: 'Introdução à Medicina e à Saúde', hours: 75, category: 'saude_publica' },
          { code: 'MSP1041', name: 'Processo Saúde-Doença-Cuidado I', hours: 90, category: 'saude_publica' },
          { code: 'MSP4211', name: 'Discussão Integrada de Casos I', hours: 90, category: 'clinica' },
        ]
      },
      {
        number: 2, year: 1, half: 2, label: '2º Semestre',
        disciplines: [
          { code: '6700003', name: 'Princípios do Desenvolvimento das Doenças', hours: 210, category: 'basica' },
          { code: '6700004', name: 'Sistema Digestório I', hours: 60, category: 'basica' },
          { code: '6700013', name: 'Farmacologia Básica I', hours: 30, category: 'basica' },
          { code: 'MSP2061', name: 'Sistema Nervoso I', hours: 30, category: 'basica' },
          { code: 'MSP3161', name: 'Ciclo da Vida I', hours: 30, category: 'basica' },
        ]
      },
      {
        number: 3, year: 2, half: 1, label: '3º Semestre',
        disciplines: [
          { code: '6700005', name: 'Sistema Locomotor 1', hours: 45, category: 'basica' },
          { code: '6700006', name: 'Fundamentos da Endocrinologia e Metabologia', hours: 60, category: 'basica' },
          { code: '6700007', name: 'Sistema Reprodutor Feminino', hours: 45, category: 'basica' },
          { code: '6700009', name: 'Sistema Respiratório I', hours: 75, category: 'basica' },
          { code: '6700010', name: 'Sistema Urinário I', hours: 90, category: 'basica' },
          { code: 'MSP1042', name: 'Processo Saúde-Doença-Cuidado II', hours: 90, category: 'saude_publica' },
          { code: 'MSP1290', name: 'Fundamentos da Pesquisa Científica em Medicina', hours: 75, category: 'etica_humanidades' },
          { code: 'MSP4212', name: 'Discussão Integrada de Casos II', hours: 75, category: 'clinica' },
          { code: 'MSP4226', name: 'Prática em Anatomia Cirúrgica', hours: 30, category: 'cirurgica' },
        ]
      },
      {
        number: 4, year: 2, half: 2, label: '4º Semestre',
        disciplines: [
          { code: '6700008', name: 'Fundamentos do Sistema Cardiovascular', hours: 60, category: 'basica' },
          { code: '6700012', name: 'Genética Humana e Médica e Oncogenética', hours: 60, category: 'basica' },
          { code: 'MSP1043', name: 'Processo Saúde-Doença-Cuidado II - 2ª parte', hours: 75, category: 'saude_publica' },
          { code: 'MSP2042', name: 'Medicina do Trabalho e Saúde do Trabalhador', hours: 30, category: 'saude_publica' },
          { code: 'MSP2052', name: 'Sistema Respiratório II', hours: 75, category: 'clinica' },
          { code: 'MSP2082', name: 'Sistema Digestório II', hours: 60, category: 'clinica' },
          { code: 'MSP3162', name: 'Ciclo da Vida II', hours: 75, category: 'basica' },
        ]
      },
      {
        number: 5, year: 3, half: 1, label: '5º Semestre',
        disciplines: [
          { code: '6700014', name: 'Moléstias Transmissíveis', hours: 165, category: 'clinica' },
          { code: '6700017', name: 'Bases em Neurologia e Psiquiatria', hours: 180, category: 'clinica' },
          { code: 'MSP1044', name: 'Processo Saúde-Doença-Cuidado III', hours: 45, category: 'saude_publica' },
          { code: 'MSP2062', name: 'Aspectos Cardiovasculares de Medicina', hours: 60, category: 'clinica' },
          { code: 'MSP2112', name: 'Bases Fisiológicas da Nefrologia', hours: 60, category: 'clinica' },
          { code: 'MSP2141', name: 'Sistema Tegumentar (Pele e Anexos)', hours: 105, category: 'clinica' },
        ]
      },
      {
        number: 6, year: 3, half: 2, label: '6º Semestre',
        disciplines: [
          { name: 'Terapêutica Farmacológica I', hours: 30, category: 'clinica' },
          { name: 'Discussão Integrada de Casos III', hours: 75, category: 'clinica' },
          { name: 'Sistemas Imunológico, Hematológico e Reumatológico', hours: 105, category: 'clinica' },
          { name: 'Sistema Nervoso II', hours: 60, category: 'clinica' },
          { name: 'Sistema Urinário II', hours: 60, category: 'clinica' },
          { name: 'Sistema Locomotor 2', hours: 75, category: 'clinica' },
          { name: 'Aspectos Endocrinológicos e Metabólicos', hours: 60, category: 'clinica' },
        ]
      },
      {
        number: 7, year: 4, half: 1, label: '7º Semestre',
        disciplines: [
          { name: 'Clínica Médica', hours: 300, category: 'clinica' },
          { name: 'Cirurgia', hours: 180, category: 'cirurgica' },
          { name: 'Terapêutica Farmacológica II', hours: 30, category: 'clinica' },
        ]
      },
      {
        number: 8, year: 4, half: 2, label: '8º Semestre',
        disciplines: [
          { name: 'Pediatria', hours: 240, category: 'clinica' },
          { name: 'Ginecologia e Obstetrícia', hours: 240, category: 'clinica' },
          { name: 'Ortopedia e Traumatologia', hours: 60, category: 'cirurgica' },
          { name: 'Otorrinolaringologia', hours: 60, category: 'cirurgica' },
        ]
      },
      {
        number: 9, year: 5, half: 1, label: '9º Semestre (Internato)',
        disciplines: [
          { name: 'Estágio em Clínica Médica', hours: 360, category: 'internato' },
          { name: 'Estágio em Cirurgia', hours: 360, category: 'internato' },
        ]
      },
      {
        number: 10, year: 5, half: 2, label: '10º Semestre (Internato)',
        disciplines: [
          { name: 'Estágio em Pediatria', hours: 360, category: 'internato' },
          { name: 'Estágio em Ginecologia e Obstetrícia', hours: 360, category: 'internato' },
          { name: 'Estágio em Psiquiatria', hours: 120, category: 'internato' },
          { name: 'Estágio em Dermatologia', hours: 120, category: 'internato' },
        ]
      },
      {
        number: 11, year: 6, half: 1, label: '11º Semestre (Internato)',
        disciplines: [
          { name: 'Estágio Integrado em Urgência e Emergência', hours: 360, category: 'internato' },
          { name: 'Estágio em Medicina Preventiva e Social', hours: 240, category: 'internato' },
        ]
      },
      {
        number: 12, year: 6, half: 2, label: '12º Semestre (Internato)',
        disciplines: [
          { name: 'Estágio Integrado em Clínica Médica II', hours: 360, category: 'internato' },
          { name: 'Estágio Integrado em Cirurgia II', hours: 240, category: 'internato' },
          { name: 'Temas de Medicina Preventiva', hours: 60, category: 'saude_publica' },
        ]
      },
    ]
  },
  {
    id: 'unicamp',
    name: 'Universidade Estadual de Campinas - Faculdade de Ciências Médicas',
    shortName: 'UNICAMP (FCM)',
    state: 'SP',
    city: 'Campinas',
    type: 'estadual',
    ranking: 2,
    semesters: [
      {
        number: 1, year: 1, half: 1, label: '1º Semestre',
        disciplines: [
          { name: 'Biologia Celular e Tecidual', hours: 120, category: 'basica' },
          { name: 'Anatomia Humana I', hours: 120, category: 'basica' },
          { name: 'Bioquímica', hours: 90, category: 'basica' },
          { name: 'Introdução à Medicina', hours: 60, category: 'etica_humanidades' },
          { name: 'Saúde e Sociedade I', hours: 60, category: 'saude_publica' },
        ]
      },
      {
        number: 2, year: 1, half: 2, label: '2º Semestre',
        disciplines: [
          { name: 'Anatomia Humana II', hours: 120, category: 'basica' },
          { name: 'Fisiologia Humana I', hours: 120, category: 'basica' },
          { name: 'Embriologia e Genética', hours: 90, category: 'basica' },
          { name: 'Saúde e Sociedade II', hours: 60, category: 'saude_publica' },
          { name: 'Psicologia Médica', hours: 30, category: 'etica_humanidades' },
        ]
      },
      {
        number: 3, year: 2, half: 1, label: '3º Semestre',
        disciplines: [
          { name: 'Fisiologia Humana II', hours: 120, category: 'basica' },
          { name: 'Microbiologia', hours: 90, category: 'basica' },
          { name: 'Parasitologia', hours: 60, category: 'basica' },
          { name: 'Imunologia', hours: 60, category: 'basica' },
          { name: 'Farmacologia I', hours: 90, category: 'basica' },
          { name: 'Saúde e Sociedade III', hours: 60, category: 'saude_publica' },
        ]
      },
      {
        number: 4, year: 2, half: 2, label: '4º Semestre',
        disciplines: [
          { name: 'Patologia Geral', hours: 120, category: 'basica' },
          { name: 'Farmacologia II', hours: 90, category: 'basica' },
          { name: 'Semiologia I', hours: 120, category: 'clinica' },
          { name: 'Saúde e Sociedade IV', hours: 60, category: 'saude_publica' },
          { name: 'Bioética', hours: 30, category: 'etica_humanidades' },
        ]
      },
      {
        number: 5, year: 3, half: 1, label: '5º Semestre',
        disciplines: [
          { name: 'Semiologia II', hours: 120, category: 'clinica' },
          { name: 'Patologia Especial', hours: 120, category: 'clinica' },
          { name: 'Clínica Médica I', hours: 120, category: 'clinica' },
          { name: 'Cirurgia I', hours: 90, category: 'cirurgica' },
          { name: 'Epidemiologia Clínica', hours: 60, category: 'saude_publica' },
        ]
      },
      {
        number: 6, year: 3, half: 2, label: '6º Semestre',
        disciplines: [
          { name: 'Clínica Médica II', hours: 120, category: 'clinica' },
          { name: 'Cirurgia II', hours: 90, category: 'cirurgica' },
          { name: 'Pediatria I', hours: 90, category: 'clinica' },
          { name: 'Ginecologia e Obstetrícia I', hours: 90, category: 'clinica' },
          { name: 'Medicina Legal', hours: 60, category: 'etica_humanidades' },
        ]
      },
      {
        number: 7, year: 4, half: 1, label: '7º Semestre',
        disciplines: [
          { name: 'Clínica Médica III', hours: 180, category: 'clinica' },
          { name: 'Cirurgia III', hours: 120, category: 'cirurgica' },
          { name: 'Pediatria II', hours: 120, category: 'clinica' },
          { name: 'Psiquiatria', hours: 90, category: 'clinica' },
        ]
      },
      {
        number: 8, year: 4, half: 2, label: '8º Semestre',
        disciplines: [
          { name: 'Ginecologia e Obstetrícia II', hours: 120, category: 'clinica' },
          { name: 'Ortopedia e Traumatologia', hours: 90, category: 'cirurgica' },
          { name: 'Oftalmologia', hours: 60, category: 'clinica' },
          { name: 'Otorrinolaringologia', hours: 60, category: 'clinica' },
          { name: 'Dermatologia', hours: 60, category: 'clinica' },
          { name: 'Urologia', hours: 60, category: 'clinica' },
        ]
      },
      {
        number: 9, year: 5, half: 1, label: '9º Semestre (Internato)',
        disciplines: [
          { name: 'Internato em Clínica Médica', hours: 480, category: 'internato' },
          { name: 'Internato em Cirurgia', hours: 240, category: 'internato' },
        ]
      },
      {
        number: 10, year: 5, half: 2, label: '10º Semestre (Internato)',
        disciplines: [
          { name: 'Internato em Pediatria', hours: 360, category: 'internato' },
          { name: 'Internato em Ginecologia e Obstetrícia', hours: 360, category: 'internato' },
        ]
      },
      {
        number: 11, year: 6, half: 1, label: '11º Semestre (Internato)',
        disciplines: [
          { name: 'Internato em Urgência e Emergência', hours: 360, category: 'internato' },
          { name: 'Internato em Saúde Coletiva', hours: 240, category: 'internato' },
        ]
      },
      {
        number: 12, year: 6, half: 2, label: '12º Semestre (Internato)',
        disciplines: [
          { name: 'Internato Eletivo', hours: 480, category: 'internato' },
          { name: 'Internato em Medicina Interna e Geriatria', hours: 240, category: 'internato' },
        ]
      },
    ]
  },
  {
    id: 'ufrj',
    name: 'Universidade Federal do Rio de Janeiro - Faculdade de Medicina',
    shortName: 'UFRJ',
    state: 'RJ',
    city: 'Rio de Janeiro',
    type: 'federal',
    ranking: 3,
    semesters: [
      {
        number: 1, year: 1, half: 1, label: '1º Semestre',
        disciplines: [
          { name: 'Anatomia Humana I', hours: 150, category: 'basica' },
          { name: 'Biologia Celular e Molecular', hours: 90, category: 'basica' },
          { name: 'Histologia e Embriologia I', hours: 90, category: 'basica' },
          { name: 'Bioquímica Médica I', hours: 90, category: 'basica' },
          { name: 'Introdução à Medicina', hours: 60, category: 'etica_humanidades' },
        ]
      },
      {
        number: 2, year: 1, half: 2, label: '2º Semestre',
        disciplines: [
          { name: 'Anatomia Humana II', hours: 150, category: 'basica' },
          { name: 'Fisiologia I', hours: 120, category: 'basica' },
          { name: 'Histologia e Embriologia II', hours: 90, category: 'basica' },
          { name: 'Bioquímica Médica II', hours: 90, category: 'basica' },
          { name: 'Saúde Coletiva I', hours: 60, category: 'saude_publica' },
        ]
      },
      {
        number: 3, year: 2, half: 1, label: '3º Semestre',
        disciplines: [
          { name: 'Fisiologia II', hours: 120, category: 'basica' },
          { name: 'Microbiologia e Imunologia', hours: 120, category: 'basica' },
          { name: 'Parasitologia', hours: 60, category: 'basica' },
          { name: 'Farmacologia I', hours: 90, category: 'basica' },
          { name: 'Genética Médica', hours: 60, category: 'basica' },
          { name: 'Saúde Coletiva II', hours: 60, category: 'saude_publica' },
        ]
      },
      {
        number: 4, year: 2, half: 2, label: '4º Semestre',
        disciplines: [
          { name: 'Patologia Geral', hours: 120, category: 'basica' },
          { name: 'Farmacologia II', hours: 90, category: 'basica' },
          { name: 'Semiologia Médica', hours: 150, category: 'clinica' },
          { name: 'Saúde Coletiva III', hours: 60, category: 'saude_publica' },
          { name: 'Ética Médica', hours: 30, category: 'etica_humanidades' },
        ]
      },
      {
        number: 5, year: 3, half: 1, label: '5º Semestre',
        disciplines: [
          { name: 'Clínica Médica I', hours: 180, category: 'clinica' },
          { name: 'Cirurgia I', hours: 120, category: 'cirurgica' },
          { name: 'Patologia Especial', hours: 90, category: 'clinica' },
          { name: 'Doenças Infecciosas', hours: 90, category: 'clinica' },
        ]
      },
      {
        number: 6, year: 3, half: 2, label: '6º Semestre',
        disciplines: [
          { name: 'Clínica Médica II', hours: 180, category: 'clinica' },
          { name: 'Cirurgia II', hours: 120, category: 'cirurgica' },
          { name: 'Pediatria I', hours: 120, category: 'clinica' },
          { name: 'Ginecologia e Obstetrícia I', hours: 120, category: 'clinica' },
        ]
      },
      {
        number: 7, year: 4, half: 1, label: '7º Semestre',
        disciplines: [
          { name: 'Clínica Médica III', hours: 240, category: 'clinica' },
          { name: 'Cirurgia III', hours: 120, category: 'cirurgica' },
          { name: 'Pediatria II', hours: 120, category: 'clinica' },
          { name: 'Psiquiatria', hours: 90, category: 'clinica' },
        ]
      },
      {
        number: 8, year: 4, half: 2, label: '8º Semestre',
        disciplines: [
          { name: 'Ginecologia e Obstetrícia II', hours: 120, category: 'clinica' },
          { name: 'Ortopedia', hours: 90, category: 'cirurgica' },
          { name: 'Oftalmologia', hours: 60, category: 'clinica' },
          { name: 'Otorrinolaringologia', hours: 60, category: 'clinica' },
          { name: 'Dermatologia', hours: 60, category: 'clinica' },
          { name: 'Medicina Legal', hours: 60, category: 'etica_humanidades' },
        ]
      },
      {
        number: 9, year: 5, half: 1, label: '9º Semestre (Internato)',
        disciplines: [
          { name: 'Internato em Clínica Médica', hours: 480, category: 'internato' },
          { name: 'Internato em Cirurgia', hours: 240, category: 'internato' },
        ]
      },
      {
        number: 10, year: 5, half: 2, label: '10º Semestre (Internato)',
        disciplines: [
          { name: 'Internato em Pediatria', hours: 360, category: 'internato' },
          { name: 'Internato em Ginecologia e Obstetrícia', hours: 360, category: 'internato' },
        ]
      },
      {
        number: 11, year: 6, half: 1, label: '11º Semestre (Internato)',
        disciplines: [
          { name: 'Internato em Urgência e Emergência', hours: 360, category: 'internato' },
          { name: 'Internato em Saúde Mental', hours: 240, category: 'internato' },
        ]
      },
      {
        number: 12, year: 6, half: 2, label: '12º Semestre (Internato)',
        disciplines: [
          { name: 'Internato Eletivo', hours: 480, category: 'internato' },
          { name: 'Internato em Saúde Coletiva', hours: 240, category: 'internato' },
        ]
      },
    ]
  },
  {
    id: 'ufmg',
    name: 'Universidade Federal de Minas Gerais - Faculdade de Medicina',
    shortName: 'UFMG (FM)',
    state: 'MG',
    city: 'Belo Horizonte',
    type: 'federal',
    ranking: 3,
    semesters: [
      {
        number: 1, year: 1, half: 1, label: '1º Semestre',
        disciplines: [
          { code: 'IMA175', name: 'Anatomia Sistêmica', hours: 120, category: 'basica' },
          { code: 'BIQ119', name: 'Bioquímica I', hours: 90, category: 'basica' },
          { code: 'GEE006', name: 'Genética', hours: 60, category: 'basica' },
          { code: 'MOF057', name: 'Biologia Celular Aplicada à Medicina', hours: 60, category: 'basica' },
          { code: 'MOF611', name: 'Embriologia Médica', hours: 45, category: 'basica' },
          { code: 'MED143', name: 'Introdução à Pesquisa Científica I', hours: 30, category: 'etica_humanidades' },
          { code: 'MPS118', name: 'Ciências Sociais Aplicadas à Saúde', hours: 60, category: 'saude_publica' },
        ]
      },
      {
        number: 2, year: 1, half: 2, label: '2º Semestre',
        disciplines: [
          { code: 'FIB124', name: 'Biofísica e Fisiologia', hours: 120, category: 'basica' },
          { code: 'BIQ608', name: 'Imunologia Médica', hours: 60, category: 'basica' },
          { code: 'MOF060', name: 'Neuroanatomia Médica', hours: 90, category: 'basica' },
          { code: 'MOF058', name: 'Histofisiologia dos Sistemas', hours: 90, category: 'basica' },
          { code: 'MED146', name: 'Tutoria', hours: 30, category: 'etica_humanidades' },
          { code: 'PSQ001', name: 'Bases Humanísticas e Psicologia Médica', hours: 45, category: 'etica_humanidades' },
          { code: 'MED145', name: 'Iniciação à Atenção Primária à Saúde I', hours: 60, category: 'saude_publica' },
        ]
      },
      {
        number: 3, year: 2, half: 1, label: '3º Semestre',
        disciplines: [
          { name: 'Farmacologia I', hours: 90, category: 'basica' },
          { name: 'Patologia Geral', hours: 120, category: 'basica' },
          { name: 'Microbiologia', hours: 90, category: 'basica' },
          { name: 'Parasitologia', hours: 60, category: 'basica' },
          { name: 'Semiologia Médica I', hours: 120, category: 'clinica' },
        ]
      },
      {
        number: 4, year: 2, half: 2, label: '4º Semestre',
        disciplines: [
          { name: 'Farmacologia II', hours: 90, category: 'basica' },
          { name: 'Patologia Especial', hours: 120, category: 'basica' },
          { name: 'Semiologia Médica II', hours: 120, category: 'clinica' },
          { name: 'Saúde Coletiva I', hours: 60, category: 'saude_publica' },
          { name: 'Psicologia Médica', hours: 30, category: 'etica_humanidades' },
        ]
      },
      {
        number: 5, year: 3, half: 1, label: '5º Semestre',
        disciplines: [
          { name: 'Clínica Médica I', hours: 180, category: 'clinica' },
          { name: 'Cirurgia I', hours: 120, category: 'cirurgica' },
          { name: 'Psiquiatria I', hours: 60, category: 'clinica' },
          { name: 'Diagnóstico por Imagem', hours: 60, category: 'clinica' },
          { name: 'Anatomia Patológica I', hours: 90, category: 'basica' },
        ]
      },
      {
        number: 6, year: 3, half: 2, label: '6º Semestre',
        disciplines: [
          { name: 'Clínica Médica II', hours: 180, category: 'clinica' },
          { name: 'Cirurgia II', hours: 120, category: 'cirurgica' },
          { name: 'Anatomia Patológica II', hours: 60, category: 'basica' },
          { name: 'Pediatria I', hours: 90, category: 'clinica' },
          { name: 'Medicina Legal', hours: 60, category: 'etica_humanidades' },
        ]
      },
      {
        number: 7, year: 4, half: 1, label: '7º Semestre',
        disciplines: [
          { name: 'Clínica Médica III', hours: 180, category: 'clinica' },
          { name: 'Ginecologia Básica', hours: 120, category: 'clinica' },
          { name: 'Pediatria II', hours: 90, category: 'clinica' },
          { name: 'Ortopedia e Traumatologia', hours: 60, category: 'cirurgica' },
        ]
      },
      {
        number: 8, year: 4, half: 2, label: '8º Semestre',
        disciplines: [
          { name: 'Clínica Médica IV', hours: 120, category: 'clinica' },
          { name: 'Obstetrícia', hours: 120, category: 'clinica' },
          { name: 'Oftalmologia', hours: 60, category: 'clinica' },
          { name: 'Otorrinolaringologia', hours: 60, category: 'clinica' },
          { name: 'Dermatologia', hours: 60, category: 'clinica' },
        ]
      },
      {
        number: 9, year: 5, half: 1, label: '9º Semestre (Internato)',
        disciplines: [
          { name: 'Internato em Clínica Médica', hours: 480, category: 'internato' },
          { name: 'Internato em Cirurgia', hours: 240, category: 'internato' },
        ]
      },
      {
        number: 10, year: 5, half: 2, label: '10º Semestre (Internato)',
        disciplines: [
          { name: 'Internato em Pediatria', hours: 360, category: 'internato' },
          { name: 'Internato em Ginecologia e Obstetrícia', hours: 360, category: 'internato' },
        ]
      },
      {
        number: 11, year: 6, half: 1, label: '11º Semestre (Internato)',
        disciplines: [
          { name: 'Internato em Urgência e Emergência', hours: 360, category: 'internato' },
          { name: 'Internato em Saúde Mental', hours: 240, category: 'internato' },
          { name: 'Internato em Saúde Coletiva', hours: 120, category: 'internato' },
        ]
      },
      {
        number: 12, year: 6, half: 2, label: '12º Semestre (Internato)',
        disciplines: [
          { name: 'Internato Eletivo', hours: 480, category: 'internato' },
          { name: 'Internato em Medicina de Família', hours: 240, category: 'internato' },
        ]
      },
    ]
  },
  {
    id: 'ufba',
    name: 'Universidade Federal da Bahia - Faculdade de Medicina da Bahia',
    shortName: 'UFBA (FMB)',
    state: 'BA',
    city: 'Salvador',
    type: 'federal',
    ranking: 5,
    semesters: [
      {
        number: 1, year: 1, half: 1, label: '1º Semestre',
        disciplines: [
          { code: 'BIOE09', name: 'Biologia Celular e Molecular Aplicada à Medicina', hours: 60, category: 'basica' },
          { code: 'ICSG51', name: 'Histologia Médica I', hours: 60, category: 'basica' },
          { code: 'ICSG01', name: 'Anatomia de Sistemas I', hours: 90, category: 'basica' },
          { code: 'ICSG02', name: 'Bioquímica Médica I', hours: 60, category: 'basica' },
          { code: 'MEDD78', name: 'Urgência e Emergência I', hours: 30, category: 'clinica' },
          { code: 'MEDD80', name: 'Bioética e Ética Médica I', hours: 90, category: 'etica_humanidades' },
        ]
      },
      {
        number: 2, year: 1, half: 2, label: '2º Semestre',
        disciplines: [
          { code: 'ICSG03', name: 'Biofísica III', hours: 45, category: 'basica' },
          { code: 'ICSG52', name: 'Histologia Médica II', hours: 60, category: 'basica' },
          { code: 'ICSG05', name: 'Neuroanatomia Humana', hours: 60, category: 'basica' },
          { code: 'ICSG06', name: 'Fisiologia Médica Geral I', hours: 90, category: 'basica' },
          { code: 'ICSG07', name: 'Anatomia de Sistemas II', hours: 60, category: 'basica' },
          { code: 'MEDD83', name: 'Epidemiologia', hours: 30, category: 'saude_publica' },
          { code: 'MEDD81', name: 'Pediatria I', hours: 60, category: 'clinica' },
        ]
      },
      {
        number: 3, year: 2, half: 1, label: '3º Semestre',
        disciplines: [
          { code: 'ICSG09', name: 'Bioquímica Médica II', hours: 30, category: 'basica' },
          { code: 'ICSG10', name: 'Fisiologia dos Órgãos e Sistemas', hours: 90, category: 'basica' },
          { code: 'ICSG11', name: 'Anatomia de Sistemas III', hours: 60, category: 'basica' },
          { code: 'MEDD65', name: 'Semiologia Médica', hours: 165, category: 'clinica' },
          { code: 'MEDD86', name: 'Medicina Social I', hours: 75, category: 'saude_publica' },
        ]
      },
      {
        number: 4, year: 2, half: 2, label: '4º Semestre',
        disciplines: [
          { code: 'ICSG12', name: 'Parasitologia Humana II', hours: 45, category: 'basica' },
          { code: 'ICSG13', name: 'Farmacologia I', hours: 60, category: 'basica' },
          { code: 'ICSG14', name: 'Microbiologia V', hours: 60, category: 'basica' },
          { code: 'ISCA83', name: 'Política de Saúde I', hours: 45, category: 'saude_publica' },
          { code: 'MEDD88', name: 'Medicina de Família e Comunidade I', hours: 165, category: 'saude_publica' },
          { code: 'MEDD89', name: 'Imunopatologia', hours: 75, category: 'basica' },
        ]
      },
      {
        number: 5, year: 3, half: 1, label: '5º Semestre',
        disciplines: [
          { code: 'ICSG15', name: 'Farmacologia II', hours: 60, category: 'basica' },
          { code: 'MEDD01', name: 'Clínica Médica I', hours: 150, category: 'clinica' },
          { code: 'MEDD02', name: 'Técnica Operatória e Cirurgia Experimental', hours: 60, category: 'cirurgica' },
          { code: 'MEDD03', name: 'Diagnóstico por Imagem I', hours: 30, category: 'clinica' },
          { code: 'MEDD04', name: 'Anatomia Patológica I', hours: 75, category: 'basica' },
          { code: 'MEDD05', name: 'Saúde Mental I', hours: 45, category: 'clinica' },
        ]
      },
      {
        number: 6, year: 3, half: 2, label: '6º Semestre',
        disciplines: [
          { code: 'MEDD98', name: 'Clínica Médica II', hours: 165, category: 'clinica' },
          { code: 'MEDD99', name: 'Cirurgia I', hours: 45, category: 'cirurgica' },
          { code: 'MEDE01', name: 'Anatomia Patológica II', hours: 60, category: 'basica' },
          { code: 'MEDE04', name: 'Pediatria II', hours: 75, category: 'clinica' },
          { code: 'MEDE05', name: 'Ginecologia e Obstetrícia I', hours: 45, category: 'clinica' },
          { code: 'MEDE06', name: 'Medicina Legal', hours: 30, category: 'etica_humanidades' },
        ]
      },
      {
        number: 7, year: 4, half: 1, label: '7º Semestre',
        disciplines: [
          { code: 'MEDE07', name: 'Clínica Médica III', hours: 90, category: 'clinica' },
          { code: 'MEDE08', name: 'Cirurgia II', hours: 30, category: 'cirurgica' },
          { code: 'MEDE09', name: 'Ortopedia e Traumatologia', hours: 60, category: 'cirurgica' },
          { code: 'MEDE10', name: 'Oftalmologia', hours: 105, category: 'clinica' },
          { code: 'MEDE11', name: 'Otorrinolaringologia', hours: 60, category: 'clinica' },
          { code: 'MEDE12', name: 'Dermatologia', hours: 45, category: 'clinica' },
          { code: 'MEDE13', name: 'Urologia', hours: 60, category: 'clinica' },
        ]
      },
      {
        number: 8, year: 4, half: 2, label: '8º Semestre',
        disciplines: [
          { code: 'MEDE16', name: 'Clínica Médica IV', hours: 120, category: 'clinica' },
          { code: 'MEDE17', name: 'Cirurgia III', hours: 75, category: 'cirurgica' },
          { code: 'MEDE18', name: 'Ginecologia e Obstetrícia II', hours: 45, category: 'clinica' },
          { code: 'MEDE19', name: 'Saúde Mental III', hours: 60, category: 'clinica' },
          { code: 'MEDE21', name: 'Pediatria IV', hours: 45, category: 'clinica' },
          { code: 'MEDE56', name: 'Emergência Médica', hours: 30, category: 'clinica' },
        ]
      },
      {
        number: 9, year: 5, half: 1, label: '9º Semestre (Internato)',
        disciplines: [
          { name: 'Internato em Clínica Médica', hours: 330, category: 'internato' },
          { name: 'Internato em Cirurgia', hours: 330, category: 'internato' },
          { name: 'Internato em Pediatria', hours: 330, category: 'internato' },
        ]
      },
      {
        number: 10, year: 5, half: 2, label: '10º Semestre (Internato)',
        disciplines: [
          { name: 'Internato em Ginecologia e Obstetrícia', hours: 330, category: 'internato' },
          { name: 'Internato em Saúde Coletiva', hours: 330, category: 'internato' },
          { name: 'Internato em Saúde Mental', hours: 330, category: 'internato' },
        ]
      },
      {
        number: 11, year: 6, half: 1, label: '11º Semestre (Internato)',
        disciplines: [
          { name: 'Internato em Urgência e Emergência', hours: 330, category: 'internato' },
          { name: 'Internato Eletivo I', hours: 330, category: 'internato' },
        ]
      },
      {
        number: 12, year: 6, half: 2, label: '12º Semestre (Internato)',
        disciplines: [
          { name: 'Internato Eletivo II', hours: 330, category: 'internato' },
          { name: 'Internato em Medicina de Família', hours: 330, category: 'internato' },
        ]
      },
    ]
  },
];

// ============================================================
// LIVROS RECOMENDADOS POR DISCIPLINA
// ============================================================

export const BOOK_RECOMMENDATIONS: BookRecommendation[] = [
  // ANATOMIA
  {
    title: 'Netter Atlas de Anatomia Humana',
    author: 'Frank H. Netter',
    edition: '8ª edição',
    publisher: 'Elsevier',
    discipline: 'Anatomia',
    category: 'basica',
    type: 'atlas',
    free: false,
    purchaseUrl: 'https://www.amazon.com.br/dp/8535291520',
    description: 'Atlas de anatomia mais vendido no mundo. Ilustrações detalhadas divididas por sistemas, excelente para visualização por diferentes ângulos.',
    yearRange: [1, 2],
  },
  {
    title: 'Sobotta: Atlas de Anatomia Humana',
    author: 'Friedrich Paulsen, Jens Waschke',
    edition: '24ª edição',
    publisher: 'Guanabara Koogan',
    discipline: 'Anatomia',
    category: 'basica',
    type: 'atlas',
    free: false,
    purchaseUrl: 'https://www.amazon.com.br/dp/8527738392',
    description: 'Atlas respeitado mundialmente com ilustrações realistas. Cada capítulo começa com contextualização prática.',
    yearRange: [1, 2],
  },
  {
    title: "Gray's Anatomy for Students",
    author: 'Richard Drake, A. Wayne Vogl, Adam Mitchell',
    edition: '4ª edição',
    publisher: 'Elsevier',
    discipline: 'Anatomia',
    category: 'basica',
    type: 'referencia',
    free: false,
    purchaseUrl: 'https://www.amazon.com.br/dp/8535291539',
    description: 'Abordagem didática para estudantes com correlações clínicas. Ideal para quem quer entender anatomia aplicada.',
    yearRange: [1, 2],
  },
  {
    title: 'Moore: Anatomia Orientada para a Clínica',
    author: 'Keith L. Moore, Arthur F. Dalley',
    edition: '9ª edição',
    publisher: 'Guanabara Koogan',
    discipline: 'Anatomia',
    category: 'basica',
    type: 'referencia',
    free: false,
    description: 'Referência com forte correlação clínica. Ideal para entender a anatomia no contexto da prática médica.',
    yearRange: [1, 2],
  },

  // HISTOLOGIA
  {
    title: 'Histologia Básica: Texto e Atlas',
    author: 'Luiz C. Junqueira, José Carneiro',
    edition: '14ª edição',
    publisher: 'Guanabara Koogan',
    discipline: 'Histologia',
    category: 'basica',
    type: 'referencia',
    free: false,
    description: 'Referência brasileira em histologia. Combina texto e atlas com abordagem didática de biologia celular dos tecidos.',
    yearRange: [1],
  },

  // FISIOLOGIA
  {
    title: 'Guyton & Hall: Tratado de Fisiologia Médica',
    author: 'John E. Hall',
    edition: '14ª edição',
    publisher: 'Elsevier',
    discipline: 'Fisiologia',
    category: 'basica',
    type: 'referencia',
    free: false,
    purchaseUrl: 'https://www.amazon.com.br/dp/8535291547',
    description: 'Referência mundial em fisiologia médica. Abordagem clara e detalhada de todos os sistemas do corpo humano.',
    yearRange: [1, 2],
  },
  {
    title: 'Berne & Levy: Fisiologia',
    author: 'Bruce M. Koeppen, Bruce A. Stanton',
    edition: '7ª edição',
    publisher: 'Elsevier',
    discipline: 'Fisiologia',
    category: 'basica',
    type: 'complementar',
    free: false,
    description: 'Alternativa consagrada ao Guyton com abordagem mais detalhada em alguns sistemas.',
    yearRange: [1, 2],
  },

  // BIOQUÍMICA
  {
    title: 'Lehninger: Princípios de Bioquímica',
    author: 'David L. Nelson, Michael M. Cox',
    edition: '8ª edição',
    publisher: 'Artmed',
    discipline: 'Bioquímica',
    category: 'basica',
    type: 'referencia',
    free: false,
    description: 'Clássico da bioquímica. Abordagem completa das bases moleculares da vida.',
    yearRange: [1],
  },

  // FARMACOLOGIA
  {
    title: 'Goodman & Gilman: As Bases Farmacológicas da Terapêutica',
    author: 'Laurence L. Brunton',
    edition: '14ª edição',
    publisher: 'McGraw-Hill',
    discipline: 'Farmacologia',
    category: 'basica',
    type: 'referencia',
    free: false,
    description: 'Referência mundial em farmacologia. Abordagem completa dos mecanismos de ação e uso terapêutico dos fármacos.',
    yearRange: [2, 3],
  },
  {
    title: 'Rang & Dale: Farmacologia',
    author: 'James M. Ritter, Rod J. Flower',
    edition: '9ª edição',
    publisher: 'Elsevier',
    discipline: 'Farmacologia',
    category: 'basica',
    type: 'complementar',
    free: false,
    description: 'Didático e ilustrado, ideal para estudantes. Abordagem integrada da farmacologia.',
    yearRange: [2, 3],
  },

  // PATOLOGIA
  {
    title: 'Robbins & Cotran: Bases Patológicas das Doenças',
    author: 'Vinay Kumar, Abul K. Abbas, Jon C. Aster',
    edition: '10ª edição',
    publisher: 'Elsevier',
    discipline: 'Patologia',
    category: 'basica',
    type: 'referencia',
    free: false,
    purchaseUrl: 'https://www.amazon.com.br/dp/8535291555',
    description: '"Bíblia" da patologia. Abordagem completa das bases celulares e moleculares das doenças humanas.',
    yearRange: [2, 3],
  },
  {
    title: 'Bogliolo: Patologia',
    author: 'Geraldo Brasileiro Filho',
    edition: '10ª edição',
    publisher: 'Guanabara Koogan',
    discipline: 'Patologia',
    category: 'basica',
    type: 'referencia',
    free: false,
    description: 'Referência brasileira em patologia. Abordagem adaptada à realidade epidemiológica do Brasil.',
    yearRange: [2, 3],
  },

  // SEMIOLOGIA
  {
    title: 'Porto: Semiologia Médica',
    author: 'Celmo Celeno Porto',
    edition: '9ª edição',
    publisher: 'Guanabara Koogan',
    discipline: 'Semiologia',
    category: 'clinica',
    type: 'referencia',
    free: false,
    description: 'Referência brasileira nº 1 em semiologia. Abordagem completa do exame clínico.',
    yearRange: [2, 3],
  },
  {
    title: 'Bates: Propedêutica Médica',
    author: 'Lynn S. Bickley',
    edition: '13ª edição',
    publisher: 'Guanabara Koogan',
    discipline: 'Semiologia',
    category: 'clinica',
    type: 'referencia',
    free: false,
    description: 'Referência internacional em propedêutica. Abordagem sistemática do exame físico.',
    yearRange: [2, 3],
  },

  // CLÍNICA MÉDICA
  {
    title: 'Harrison: Princípios de Medicina Interna',
    author: 'J. Larry Jameson, Anthony S. Fauci et al.',
    edition: '21ª edição',
    publisher: 'McGraw-Hill',
    discipline: 'Clínica Médica',
    category: 'clinica',
    type: 'referencia',
    free: false,
    purchaseUrl: 'https://www.amazon.com.br/dp/8580556341',
    description: '"Bíblia" da clínica médica. Mais de 400 capítulos escritos por especialistas cobrindo todas as condições clínicas.',
    yearRange: [3, 4, 5, 6],
  },
  {
    title: 'Goldman-Cecil Medicina',
    author: 'Lee Goldman, Andrew I. Schafer',
    edition: '26ª edição',
    publisher: 'Elsevier',
    discipline: 'Clínica Médica',
    category: 'clinica',
    type: 'referencia',
    free: false,
    description: 'Referência mundial em medicina interna. Edição brasileira adaptada com epidemiologia e tratamento vinculados ao Brasil.',
    yearRange: [3, 4, 5, 6],
  },
  {
    title: 'Manual do Residente de Clínica Médica (FMUSP)',
    author: 'EEP HC-FMUSP',
    publisher: 'Manole',
    discipline: 'Clínica Médica',
    category: 'clinica',
    type: 'manual',
    free: false,
    description: 'Manual prático elaborado pela Escola de Educação Permanente do HC-FMUSP. Cobre cuidados paliativos até promoção da saúde.',
    yearRange: [4, 5, 6],
  },

  // CIRURGIA
  {
    title: 'Sabiston: Tratado de Cirurgia',
    author: 'Courtney M. Townsend Jr. et al.',
    edition: '21ª edição',
    publisher: 'Elsevier',
    discipline: 'Cirurgia',
    category: 'cirurgica',
    type: 'referencia',
    free: false,
    description: 'Principal referência em cirurgia geral desde 1936. Abrange todas as áreas da cirurgia.',
    yearRange: [3, 4, 5, 6],
  },
  {
    title: 'Zollinger: Atlas de Cirurgia',
    author: 'E. Christopher Ellison, Robert M. Zollinger',
    edition: '10ª edição',
    publisher: 'McGraw-Hill',
    discipline: 'Cirurgia',
    category: 'cirurgica',
    type: 'atlas',
    free: false,
    description: 'Atlas de referência com ilustrações detalhadas de procedimentos cirúrgicos gastrointestinais, vasculares e laparoscópicos.',
    yearRange: [3, 4, 5, 6],
  },

  // PEDIATRIA
  {
    title: 'Tratado Brasileiro de Pediatria (SBP)',
    author: 'Sociedade Brasileira de Pediatria',
    edition: '5ª edição',
    publisher: 'Manole',
    discipline: 'Pediatria',
    category: 'clinica',
    type: 'referencia',
    free: false,
    description: 'Livro-texto de pediatria mais utilizado no Brasil. 40 capítulos cobrindo prevenção, diagnóstico e tratamento.',
    yearRange: [4, 5, 6],
  },
  {
    title: 'Nelson: Tratado de Pediatria',
    author: 'Robert M. Kliegman et al.',
    edition: '21ª edição',
    publisher: 'Elsevier',
    discipline: 'Pediatria',
    category: 'clinica',
    type: 'referencia',
    free: false,
    description: 'Referência internacional em pediatria. Abordagem completa das doenças da infância e adolescência.',
    yearRange: [4, 5, 6],
  },

  // GINECOLOGIA E OBSTETRÍCIA
  {
    title: 'Williams Obstetrícia',
    author: 'F. Gary Cunningham et al.',
    edition: '26ª edição',
    publisher: 'McGraw-Hill',
    discipline: 'Ginecologia e Obstetrícia',
    category: 'clinica',
    type: 'referencia',
    free: false,
    description: '"Bíblia" da obstetrícia. Visão abrangente da gestação, parto e cuidados pós-parto.',
    yearRange: [4, 5, 6],
  },
  {
    title: 'Berek e Novak: Tratado de Ginecologia',
    author: 'Jonathan S. Berek',
    edition: '16ª edição',
    publisher: 'Guanabara Koogan',
    discipline: 'Ginecologia e Obstetrícia',
    category: 'clinica',
    type: 'referencia',
    free: false,
    description: 'Referência em ginecologia. Abordagem detalhada de patologias, tratamentos e intervenções ginecológicas.',
    yearRange: [4, 5, 6],
  },
  {
    title: 'Zugaib: Obstetrícia',
    author: 'Marcelo Zugaib',
    publisher: 'Manole',
    discipline: 'Ginecologia e Obstetrícia',
    category: 'clinica',
    type: 'referencia',
    free: false,
    description: 'Referência brasileira em obstetrícia, elaborada pelo departamento de obstetrícia da FMUSP.',
    yearRange: [4, 5, 6],
  },

  // PSIQUIATRIA
  {
    title: 'Kaplan & Sadock: Compêndio de Psiquiatria',
    author: 'Benjamin J. Sadock, Virginia A. Sadock',
    edition: '12ª edição',
    publisher: 'Artmed',
    discipline: 'Psiquiatria',
    category: 'clinica',
    type: 'referencia',
    free: false,
    description: 'Referência mundial em psiquiatria. Abordagem completa dos transtornos mentais.',
    yearRange: [3, 4, 5, 6],
  },
  {
    title: 'Psicopatologia e Semiologia dos Transtornos Mentais',
    author: 'Paulo Dalgalarrondo',
    edition: '3ª edição',
    publisher: 'Artmed',
    discipline: 'Psiquiatria',
    category: 'clinica',
    type: 'referencia',
    free: false,
    description: 'Referência brasileira em psicopatologia. Abordagem didática dos sinais e sintomas psiquiátricos.',
    yearRange: [3, 4, 5, 6],
  },

  // ORTOPEDIA
  {
    title: 'Sizínio: Ortopedia e Traumatologia',
    author: 'Herbert Sizínio et al.',
    edition: '6ª edição',
    publisher: 'Artmed',
    discipline: 'Ortopedia',
    category: 'cirurgica',
    type: 'referencia',
    free: false,
    description: 'Referência brasileira em ortopedia e traumatologia. Abordagem completa das patologias musculoesqueléticas.',
    yearRange: [4, 5, 6],
  },

  // MICROBIOLOGIA
  {
    title: 'Murray: Microbiologia Médica',
    author: 'Patrick R. Murray, Ken S. Rosenthal',
    edition: '9ª edição',
    publisher: 'Elsevier',
    discipline: 'Microbiologia',
    category: 'basica',
    type: 'referencia',
    free: false,
    description: 'Referência completa em microbiologia médica com abordagem integrada de bactérias, vírus, fungos e parasitas.',
    yearRange: [2, 3],
  },

  // IMUNOLOGIA
  {
    title: 'Abbas: Imunologia Celular e Molecular',
    author: 'Abul K. Abbas, Andrew H. Lichtman',
    edition: '10ª edição',
    publisher: 'Elsevier',
    discipline: 'Imunologia',
    category: 'basica',
    type: 'referencia',
    free: false,
    description: 'Referência mundial em imunologia. Abordagem clara dos mecanismos imunológicos.',
    yearRange: [2],
  },

  // EPIDEMIOLOGIA
  {
    title: 'Rouquayrol: Epidemiologia & Saúde',
    author: 'Maria Zélia Rouquayrol, Naomar de Almeida Filho',
    edition: '8ª edição',
    publisher: 'Medbook',
    discipline: 'Epidemiologia',
    category: 'saude_publica',
    type: 'referencia',
    free: false,
    description: 'Referência brasileira em epidemiologia. Abordagem adaptada à realidade do SUS.',
    yearRange: [1, 2, 3],
  },

  // CONSULTA RÁPIDA
  {
    title: 'Whitebook Clinical Decision',
    author: 'Whitebook',
    discipline: 'Clínica Médica',
    category: 'clinica',
    type: 'consulta_rapida',
    free: false,
    freeUrl: 'https://whitebook.com.br',
    description: 'App e livro de consulta rápida mais famoso do Brasil. Estruturado para rápida visualização de fluxos, condutas e prescrições.',
    yearRange: [3, 4, 5, 6],
  },
];

// ============================================================
// FONTES ACADÊMICAS CONFIÁVEIS
// ============================================================

export const ACADEMIC_SOURCES: AcademicSource[] = [
  // ARTIGOS CIENTÍFICOS
  {
    name: 'SciELO Brasil',
    url: 'https://www.scielo.br/',
    type: 'artigos',
    description: 'Biblioteca eletrônica de periódicos científicos brasileiros em acesso aberto. Principal fonte de artigos científicos em português.',
    language: 'pt',
    free: true,
  },
  {
    name: 'PubMed',
    url: 'https://pubmed.ncbi.nlm.nih.gov/',
    type: 'artigos',
    description: 'Base de dados mundial com mais de 39 milhões de citações de literatura biomédica. Referência internacional para pesquisa médica.',
    language: 'en',
    free: true,
  },
  {
    name: 'Portal de Periódicos CAPES',
    url: 'https://www.periodicos.capes.gov.br/',
    type: 'periodicos',
    description: 'Acesso a conteúdo científico diversificado: livros, normas técnicas, patentes e estatísticas. Acesso via instituição de ensino.',
    language: 'multi',
    free: true,
    institution: 'CAPES/MEC',
  },
  {
    name: 'LILACS',
    url: 'https://lilacs.bvsalud.org/',
    type: 'artigos',
    description: 'Literatura Latino-Americana e do Caribe em Ciências da Saúde. Maior índice da literatura científica em saúde da América Latina.',
    language: 'multi',
    free: true,
    institution: 'BIREME/OPAS/OMS',
  },
  {
    name: 'Google Scholar',
    url: 'https://scholar.google.com.br/',
    type: 'artigos',
    description: 'Motor de busca acadêmico que indexa artigos, teses, livros e resumos de diversas fontes acadêmicas.',
    language: 'multi',
    free: true,
  },

  // TESES E DISSERTAÇÕES
  {
    name: 'Biblioteca Digital de Teses e Dissertações da USP',
    url: 'https://www.teses.usp.br/',
    type: 'teses',
    description: 'Portal com todas as teses e dissertações da USP em acesso aberto. Inclui trabalhos da FMUSP.',
    language: 'pt',
    free: true,
    institution: 'USP',
  },
  {
    name: 'Catálogo de Teses & Dissertações CAPES',
    url: 'https://catalogodeteses.capes.gov.br/',
    type: 'teses',
    description: 'Catálogo nacional de teses e dissertações de todas as universidades brasileiras credenciadas pela CAPES.',
    language: 'pt',
    free: true,
    institution: 'CAPES/MEC',
  },
  {
    name: 'BDTD - Biblioteca Digital Brasileira de Teses e Dissertações',
    url: 'https://bdtd.ibict.br/',
    type: 'teses',
    description: 'Integra os sistemas de informação de teses e dissertações existentes nas instituições brasileiras de ensino e pesquisa.',
    language: 'pt',
    free: true,
    institution: 'IBICT',
  },
  {
    name: 'Repositório Institucional UNICAMP',
    url: 'https://repositorio.unicamp.br/',
    type: 'teses',
    description: 'Repositório digital da UNICAMP com teses, dissertações e produção científica da FCM.',
    language: 'pt',
    free: true,
    institution: 'UNICAMP',
  },
  {
    name: 'Pantheon UFRJ',
    url: 'https://pantheon.ufrj.br/',
    type: 'teses',
    description: 'Repositório institucional da UFRJ com produção acadêmica da Faculdade de Medicina.',
    language: 'pt',
    free: true,
    institution: 'UFRJ',
  },

  // LIVROS ABERTOS
  {
    name: 'SciELO Livros',
    url: 'https://books.scielo.org/',
    type: 'livros',
    description: 'Coleção de ebooks em acesso aberto em Humanidades, Ciências Sociais e Saúde Pública de editoras acadêmicas do Brasil.',
    language: 'pt',
    free: true,
  },
  {
    name: 'Portal do Livro Aberto',
    url: 'https://livroaberto.ibict.br/',
    type: 'livros',
    description: 'Reúne, divulga e preserva publicações oficiais em ciência, tecnologia e inovação.',
    language: 'pt',
    free: true,
    institution: 'IBICT',
  },
  {
    name: 'NCBI Bookshelf',
    url: 'https://www.ncbi.nlm.nih.gov/books/',
    type: 'livros',
    description: 'Coleção de livros biomédicos gratuitos do National Center for Biotechnology Information (EUA).',
    language: 'en',
    free: true,
    institution: 'NIH/NCBI',
  },
  {
    name: 'OpenStax',
    url: 'https://openstax.org/',
    type: 'livros',
    description: 'Livros-texto gratuitos e revisados por pares. Inclui Anatomy & Physiology, Microbiology e outros.',
    language: 'en',
    free: true,
    institution: 'Rice University',
  },

  // DIRETRIZES E PROTOCOLOS
  {
    name: 'Ministério da Saúde - Protocolos Clínicos',
    url: 'https://www.gov.br/saude/pt-br/assuntos/protocolos-clinicos-e-diretrizes-terapeuticas-pcdt',
    type: 'diretrizes',
    description: 'Protocolos Clínicos e Diretrizes Terapêuticas (PCDT) oficiais do SUS para diversas condições de saúde.',
    language: 'pt',
    free: true,
    institution: 'Ministério da Saúde',
  },
  {
    name: 'AMB - Diretrizes Clínicas',
    url: 'https://amb.org.br/diretrizes/',
    type: 'diretrizes',
    description: 'Diretrizes clínicas da Associação Médica Brasileira baseadas em evidências.',
    language: 'pt',
    free: true,
    institution: 'AMB',
  },
  {
    name: 'UpToDate',
    url: 'https://www.uptodate.com/',
    type: 'diretrizes',
    description: 'Recurso de apoio à decisão clínica baseado em evidências. Acesso via instituição de ensino.',
    language: 'en',
    free: false,
  },

  // REPOSITÓRIOS
  {
    name: 'Repositório da Faculdade de Medicina da USP',
    url: 'https://repositorio.usp.br/result.php?filter[]=unidadeUSP:%22FM%22',
    type: 'repositorio',
    description: 'Produção científica da Faculdade de Medicina da USP: artigos, teses, dissertações e trabalhos acadêmicos.',
    language: 'pt',
    free: true,
    institution: 'FMUSP',
  },
];

// ============================================================
// HELPERS
// ============================================================

export function getUniversityById(id: string): University | undefined {
  return UNIVERSITIES.find(u => u.id === id);
}

export function getBooksByDiscipline(discipline: string): BookRecommendation[] {
  return BOOK_RECOMMENDATIONS.filter(b =>
    b.discipline.toLowerCase().includes(discipline.toLowerCase())
  );
}

export function getBooksByYear(year: number): BookRecommendation[] {
  return BOOK_RECOMMENDATIONS.filter(b => b.yearRange.includes(year));
}

export function getFreeResources(): AcademicSource[] {
  return ACADEMIC_SOURCES.filter(s => s.free);
}

export function getSourcesByType(type: AcademicSource['type']): AcademicSource[] {
  return ACADEMIC_SOURCES.filter(s => s.type === type);
}

export function getCategoryLabel(cat: DisciplineCategory): string {
  const labels: Record<DisciplineCategory, string> = {
    basica: 'Ciências Básicas',
    clinica: 'Clínica',
    cirurgica: 'Cirúrgica',
    saude_publica: 'Saúde Pública',
    etica_humanidades: 'Ética e Humanidades',
    internato: 'Internato',
  };
  return labels[cat] || cat;
}
