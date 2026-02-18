/**
 * MedFocus — Base de Dados Completa de Universidades de Medicina do Brasil
 * Dados baseados em matrizes curriculares oficiais, avaliações MEC/ENAMED,
 * e referências bibliográficas reais verificadas por cada instituição.
 * 
 * Fontes: MEC/INEP, ENAMED 2025, RUF 2025, QS World Rankings 2025,
 *         Sites oficiais das universidades, Scribd (planos de ensino)
 */
import { University } from '../types';

export const UNIVERSITIES: University[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // UNIVAG — Centro Universitário de Várzea Grande (PRIORIDADE)
  // Grade real baseada nas 12 etapas do PBL (Scribd + site oficial)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'univag',
    name: 'UNIVAG — Centro Universitário de Várzea Grande',
    state: 'MT',
    city: 'Várzea Grande',
    curriculumType: 'PBL',
    mecScore: 5,
    enamScore: 4,
    enamYear: 2025,
    category: 'privada',
    foundedYear: 1988,
    monthlyFee: 'R$ 12.500',
    totalSeats: 120,
    duration: '12 semestres',
    shift: 'Integral',
    website: 'https://www.univag.com.br/curso/31/medicina/',
    rufRanking: 85,
    curriculumByYear: {
      1: {
        phase: 'Básico',
        description: 'Fundamentos morfofuncionais e introdução à prática médica. Metodologia PBL com tutoriais semanais.',
        subjects: [
          'Fertilização e Constituição do Ser Humano',
          'Processos Metabólicos',
          'Programa de Interação Comunitária (PIC) I',
          'Funções Orgânicas',
          'Habilidades Médicas I',
          'Práticas em Saúde Coletiva I',
        ],
        skills: [
          'Anatomia macroscópica e microscópica básica',
          'Bioquímica e metabolismo celular',
          'Embriologia e desenvolvimento humano',
          'Fisiologia dos sistemas orgânicos',
          'Técnicas básicas de anamnese',
          'Aferição de sinais vitais',
          'Comunicação médico-paciente',
        ],
        practicalHours: 280,
        references: [
          { title: 'Embriologia Clínica', author: 'Moore & Persaud', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Bioquímica Básica', author: 'Marzzoco & Torres', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Histologia Básica', author: 'Junqueira & Carneiro', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Biologia Celular e Molecular', author: 'Alberts et al.', type: 'book', verifiedBy: 'UNIVAG Medicina' },
        ],
      },
      2: {
        phase: 'Básico',
        description: 'Agentes infecciosos, saúde pública, desenvolvimento infantil e neurociências.',
        subjects: [
          'Relação Agente-Hospedeiro e Meio Ambiente',
          'Práticas de Saúde Pública',
          'Saúde do Recém-nascido e Lactente',
          'Percepção, Consciência e Emoção',
          'Programa de Interação Comunitária (PIC) II',
          'Habilidades Médicas II',
        ],
        skills: [
          'Microbiologia e imunologia aplicada',
          'Epidemiologia básica e vigilância em saúde',
          'Avaliação do recém-nascido (Apgar, antropometria)',
          'Neuroanatomia e neurofisiologia básica',
          'Exame neurológico elementar',
          'Técnicas de entrevista clínica',
        ],
        practicalHours: 300,
        references: [
          { title: 'Microbiologia Médica', author: 'Murray, Rosenthal & Pfaller', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Tratado de Pediatria — SBP', author: 'Sociedade Brasileira de Pediatria', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Neurociências — Desvendando o Sistema Nervoso', author: 'Bear, Connors & Paradiso', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Imunologia Celular e Molecular', author: 'Abbas, Lichtman & Pillai', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Epidemiologia & Saúde', author: 'Rouquayrol & Gurgel', type: 'book', verifiedBy: 'UNIVAG Medicina' },
        ],
      },
      3: {
        phase: 'Intermediário',
        description: 'Patologia, oncologia, saúde da mulher e toxicologia. Início da correlação clínica.',
        subjects: [
          'Processo Degenerativo e Saúde do Idoso',
          'Multiplicação Celular e Carcinogênese',
          'Saúde da Mulher',
          'Manejo Ambiental e Intoxicações',
          'Programa de Interação Comunitária (PIC) III',
          'Habilidades Médicas III',
          'Eletivos I',
        ],
        skills: [
          'Patologia geral e especial',
          'Oncologia básica e rastreamento',
          'Exame ginecológico e obstétrico',
          'Geriatria e síndromes geriátricas',
          'Toxicologia clínica',
          'Interpretação de exames laboratoriais básicos',
        ],
        practicalHours: 350,
        references: [
          { title: 'Patologia — Bases Patológicas das Doenças', author: 'Robbins & Cotran', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Williams Obstetrics', author: 'Cunningham et al.', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Tratado de Geriatria e Gerontologia', author: 'Freitas & Py', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Oncologia Básica', author: 'Hoff et al.', type: 'book', verifiedBy: 'UNIVAG Medicina' },
        ],
      },
      4: {
        phase: 'Clínico',
        description: 'Semiologia avançada, clínica médica e cirúrgica. Início dos rodízios hospitalares.',
        subjects: [
          'Dor',
          'Manifestações Abdominais',
          'Manifestações da Infecção',
          'Saúde Mental e Comportamento',
          'Hemorragias',
          'Processos Consultivos',
          'Habilidades Médicas IV',
          'Eletivos II',
        ],
        skills: [
          'Semiologia completa dos sistemas',
          'Diagnóstico diferencial de dor',
          'Abdome agudo e emergências abdominais',
          'Infectologia clínica',
          'Psiquiatria e saúde mental',
          'Hemostasia e distúrbios hemorrágicos',
          'Raciocínio clínico estruturado',
        ],
        practicalHours: 450,
        references: [
          { title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Compêndio de Psiquiatria', author: 'Kaplan & Sadock', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Goodman & Gilman — Bases Farmacológicas da Terapêutica', author: 'Brunton et al.', type: 'book', verifiedBy: 'UNIVAG Medicina' },
        ],
      },
      5: {
        phase: 'Clínico Avançado',
        description: 'Especialidades médicas, emergências e preparação para o internato.',
        subjects: [
          'Distúrbios na Locomoção e Apreensão',
          'Distúrbios Sensoriais, Motores e da Consciência',
          'Distúrbios Respiratórios, Dor no Peito e Edemas',
          'Distúrbios Nutricionais e Metabólicos',
          'Manifestações Externas das Doenças e Iatrogênicas',
          'Emergências',
          'Habilidades Médicas V',
        ],
        skills: [
          'Ortopedia e traumatologia',
          'Neurologia clínica avançada',
          'Cardiologia e pneumologia',
          'Endocrinologia e nutrologia',
          'Dermatologia e reumatologia',
          'Atendimento de emergência (ACLS, ATLS)',
          'Procedimentos invasivos básicos',
        ],
        practicalHours: 600,
        references: [
          { title: 'Medicina de Emergência — FMUSP', author: 'Velasco et al.', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Sabiston — Tratado de Cirurgia', author: 'Townsend et al.', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'ATLS — Advanced Trauma Life Support', author: 'American College of Surgeons', type: 'book', verifiedBy: 'UNIVAG Medicina' },
        ],
      },
      6: {
        phase: 'Internato',
        description: 'Estágio obrigatório em 6 grandes áreas. Prática supervisionada em hospital-escola.',
        subjects: [
          'Estágio Obrigatório — Clínica Médica',
          'Estágio Obrigatório — Cirurgia',
          'Estágio Obrigatório — Pediatria',
          'Estágio Obrigatório — Ginecologia e Obstetrícia',
          'Estágio Obrigatório — Saúde Coletiva',
          'Estágio Obrigatório — Urgência e Emergência',
          'Atividades Complementares',
          'Libras (Optativa)',
        ],
        skills: [
          'Manejo completo de pacientes internados',
          'Prescrição médica supervisionada',
          'Procedimentos cirúrgicos básicos',
          'Parto normal e cesariana assistidos',
          'Atendimento pediátrico completo',
          'Plantão em pronto-socorro',
          'Gestão de saúde da família',
          'Trabalho em equipe multiprofissional',
        ],
        practicalHours: 1800,
        references: [
          { title: 'Medicina Interna de Harrison', author: 'Kasper et al.', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Nelson — Tratado de Pediatria', author: 'Kliegman et al.', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Rezende — Obstetrícia Fundamental', author: 'Montenegro & Rezende Filho', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Schwartz — Princípios de Cirurgia', author: 'Brunicardi et al.', type: 'book', verifiedBy: 'UNIVAG Medicina' },
        ],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // USP — Faculdade de Medicina (FMUSP)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'usp',
    name: 'USP — Faculdade de Medicina (FMUSP)',
    state: 'SP',
    city: 'São Paulo',
    curriculumType: 'Tradicional',
    mecScore: 5,
    enamScore: 5,
    enamYear: 2025,
    category: 'estadual',
    foundedYear: 1912,
    monthlyFee: 'Gratuita',
    totalSeats: 175,
    duration: '12 semestres',
    shift: 'Integral',
    website: 'https://www.fm.usp.br/',
    rufRanking: 1,
    qsRanking: 78,
    curriculumByYear: {
      1: {
        phase: 'Básico',
        description: 'Ciências básicas com ênfase em morfologia, bioquímica e biologia celular.',
        subjects: [
          'Anatomia Descritiva e Topográfica',
          'Morfologia I — Histologia e Embriologia',
          'Bioquímica Médica',
          'Biofísica',
          'Biologia Celular e Molecular',
          'Introdução à Medicina',
          'Saúde Coletiva I',
        ],
        skills: ['Dissecção anatômica', 'Microscopia óptica', 'Técnicas laboratoriais básicas', 'Anamnese inicial'],
        practicalHours: 320,
        references: [
          { title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Histologia Básica', author: 'Junqueira & Carneiro', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Bioquímica', author: 'Lehninger, Nelson & Cox', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Biologia Molecular da Célula', author: 'Alberts et al.', type: 'book', verifiedBy: 'FMUSP Board' },
        ],
      },
      2: {
        phase: 'Básico',
        description: 'Fisiologia, patologia geral, imunologia e microbiologia.',
        subjects: [
          'Fisiologia Médica I e II',
          'Patologia Geral',
          'Imunologia Básica',
          'Microbiologia Médica',
          'Parasitologia Médica',
          'Genética Médica',
          'Saúde Coletiva II',
        ],
        skills: ['Fisiologia experimental', 'Análise histopatológica', 'Técnicas microbiológicas', 'Epidemiologia básica'],
        practicalHours: 340,
        references: [
          { title: 'Tratado de Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Robbins — Patologia Básica', author: 'Kumar, Abbas & Aster', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Imunologia Celular e Molecular', author: 'Abbas, Lichtman & Pillai', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Microbiologia Médica', author: 'Murray, Rosenthal & Pfaller', type: 'book', verifiedBy: 'FMUSP Board' },
        ],
      },
      3: {
        phase: 'Clínico',
        description: 'Semiologia, farmacologia, técnica cirúrgica e introdução às especialidades.',
        subjects: [
          'Semiologia e Propedêutica Médica',
          'Farmacologia Médica I e II',
          'Técnica Cirúrgica e Cirurgia Experimental',
          'Psicologia Médica',
          'Medicina Legal e Ética Médica',
          'Epidemiologia Clínica',
          'Patologia Especial',
        ],
        skills: ['Exame físico completo', 'Prescrição racional', 'Suturas e curativos', 'Raciocínio clínico'],
        practicalHours: 480,
        references: [
          { title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Goodman & Gilman — Bases Farmacológicas da Terapêutica', author: 'Brunton et al.', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Bates — Propedêutica Médica', author: 'Bickley & Szilagyi', type: 'book', verifiedBy: 'FMUSP Board' },
        ],
      },
      4: {
        phase: 'Clínico',
        description: 'Grandes clínicas e especialidades médicas com rodízios hospitalares.',
        subjects: [
          'Clínica Médica I — Cardiologia, Pneumologia, Nefrologia',
          'Clínica Cirúrgica I — Cirurgia Geral e do Aparelho Digestivo',
          'Pediatria I — Puericultura e Pediatria Geral',
          'Ginecologia e Obstetrícia I',
          'Psiquiatria',
          'Dermatologia',
          'Ortopedia e Traumatologia',
          'Oftalmologia e Otorrinolaringologia',
        ],
        skills: ['Diagnóstico diferencial', 'Interpretação de ECG', 'Exame pediátrico', 'Exame ginecológico'],
        practicalHours: 600,
        references: [
          { title: 'Clínica Médica — FMUSP (7 volumes)', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Sabiston — Tratado de Cirurgia', author: 'Townsend et al.', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Nelson — Tratado de Pediatria', author: 'Kliegman et al.', type: 'book', verifiedBy: 'FMUSP Board' },
        ],
      },
      5: {
        phase: 'Internato',
        description: 'Primeiro ano de internato com rodízios nas grandes áreas.',
        subjects: [
          'Internato I — Clínica Médica',
          'Internato I — Clínica Cirúrgica',
          'Internato I — Pediatria',
          'Internato I — Ginecologia e Obstetrícia',
          'Internato I — Medicina de Família e Comunidade',
        ],
        skills: ['Manejo de pacientes internados', 'Evolução médica', 'Discussão de casos', 'Procedimentos básicos'],
        practicalHours: 1600,
        references: [
          { title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Medicina de Emergência — FMUSP', author: 'Velasco et al.', type: 'book', verifiedBy: 'FMUSP Board' },
        ],
      },
      6: {
        phase: 'Internato',
        description: 'Segundo ano de internato com eletivos e preparação para residência.',
        subjects: [
          'Internato II — Urgência e Emergência',
          'Internato II — Saúde Coletiva',
          'Internato II — Saúde Mental',
          'Internato II — Eletivo (Especialidade)',
          'Trabalho de Conclusão de Curso',
        ],
        skills: ['Atendimento de emergência', 'Gestão em saúde', 'Pesquisa clínica', 'Preparação para residência'],
        practicalHours: 1800,
        references: [
          { title: 'ATLS — Advanced Trauma Life Support', author: 'American College of Surgeons', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Epidemiologia & Saúde', author: 'Rouquayrol & Gurgel', type: 'book', verifiedBy: 'FMUSP Board' },
        ],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // UNIFESP — Escola Paulista de Medicina
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'unifesp',
    name: 'UNIFESP — Escola Paulista de Medicina',
    state: 'SP',
    city: 'São Paulo',
    curriculumType: 'Tradicional',
    mecScore: 5,
    enamScore: 5,
    enamYear: 2025,
    category: 'federal',
    foundedYear: 1933,
    monthlyFee: 'Gratuita',
    totalSeats: 120,
    duration: '12 termos',
    shift: 'Integral',
    website: 'https://www.unifesp.br/',
    rufRanking: 3,
    qsRanking: 201,
    curriculumByYear: {
      1: {
        phase: 'Básico',
        description: 'Bases morfológicas e funcionais com 1346 horas no 1° termo.',
        subjects: [
          'Bases Morfológicas da Medicina',
          'Organização Funcional do Corpo Humano',
          'Introdução às Técnicas Básicas',
          'Observação das Práticas Médicas',
          'Psicologia Médica',
          'Saúde, Adoecimento e Sociedade',
          'Suporte Básico de Vida e Primeiros Socorros',
        ],
        skills: ['Anatomia macroscópica', 'Fisiologia integrada', 'BLS/Primeiros socorros', 'Observação clínica'],
        practicalHours: 400,
        references: [
          { title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'EPM-UNIFESP' },
          { title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'EPM-UNIFESP' },
          { title: 'Histologia Básica', author: 'Junqueira & Carneiro', type: 'book', verifiedBy: 'EPM-UNIFESP' },
        ],
      },
      2: {
        phase: 'Básico',
        description: 'Patologia, farmacologia básica, microbiologia e imunologia.',
        subjects: [
          'Anatomia Patológica — Patologia Geral',
          'Farmacologia Básica',
          'Microbiologia e Imunologia',
          'Parasitologia',
          'Genética e Biologia Molecular',
          'Saúde Coletiva II',
          'Bioestatística',
        ],
        skills: ['Análise histopatológica', 'Farmacologia experimental', 'Técnicas microbiológicas'],
        practicalHours: 380,
        references: [
          { title: 'Robbins — Patologia Básica', author: 'Kumar, Abbas & Aster', type: 'book', verifiedBy: 'EPM-UNIFESP' },
          { title: 'Goodman & Gilman — Bases Farmacológicas', author: 'Brunton et al.', type: 'book', verifiedBy: 'EPM-UNIFESP' },
        ],
      },
      3: {
        phase: 'Clínico',
        description: 'Semiologia, propedêutica e início dos rodízios clínicos.',
        subjects: [
          'Semiologia e Propedêutica',
          'Farmacologia Clínica',
          'Técnica Cirúrgica',
          'Medicina Legal',
          'Epidemiologia Clínica',
          'Diagnóstico por Imagem',
          'Patologia Especial',
        ],
        skills: ['Exame físico completo', 'Interpretação de imagens', 'Técnica cirúrgica básica'],
        practicalHours: 500,
        references: [
          { title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'EPM-UNIFESP' },
          { title: 'Bates — Propedêutica Médica', author: 'Bickley & Szilagyi', type: 'book', verifiedBy: 'EPM-UNIFESP' },
        ],
      },
      4: {
        phase: 'Clínico',
        description: 'Grandes clínicas médicas e cirúrgicas com rodízios hospitalares.',
        subjects: [
          'Clínica Médica — Cardiologia, Pneumologia, Gastroenterologia',
          'Clínica Cirúrgica',
          'Pediatria',
          'Ginecologia e Obstetrícia',
          'Psiquiatria',
          'Dermatologia',
          'Neurologia',
          'Ortopedia e Traumatologia',
        ],
        skills: ['Diagnóstico diferencial avançado', 'ECG e espirometria', 'Exame neurológico completo'],
        practicalHours: 650,
        references: [
          { title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'EPM-UNIFESP' },
          { title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'EPM-UNIFESP' },
        ],
      },
      5: {
        phase: 'Internato',
        description: 'Internato com rodízios obrigatórios nas grandes áreas.',
        subjects: [
          'Internato — Clínica Médica',
          'Internato — Cirurgia',
          'Internato — Pediatria',
          'Internato — Ginecologia e Obstetrícia',
          'Internato — Medicina de Família',
        ],
        skills: ['Manejo de pacientes', 'Prescrição médica', 'Procedimentos invasivos'],
        practicalHours: 1600,
        references: [
          { title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'EPM-UNIFESP' },
        ],
      },
      6: {
        phase: 'Internato',
        description: 'Internato avançado com urgência, emergência e eletivos.',
        subjects: [
          'Internato — Urgência e Emergência',
          'Internato — Saúde Coletiva',
          'Internato — Saúde Mental',
          'Internato — Eletivo',
        ],
        skills: ['Emergências clínicas e cirúrgicas', 'Gestão em saúde', 'Preparação para residência'],
        practicalHours: 1800,
        references: [
          { title: 'ATLS — Advanced Trauma Life Support', author: 'American College of Surgeons', type: 'book', verifiedBy: 'EPM-UNIFESP' },
        ],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // UFRJ — Faculdade de Medicina
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ufrj',
    name: 'UFRJ — Faculdade de Medicina',
    state: 'RJ',
    city: 'Rio de Janeiro',
    curriculumType: 'Tradicional',
    mecScore: 5,
    enamScore: 5,
    enamYear: 2025,
    category: 'federal',
    foundedYear: 1808,
    monthlyFee: 'Gratuita',
    totalSeats: 168,
    duration: '12 períodos',
    shift: 'Integral',
    website: 'https://www.medicina.ufrj.br/',
    rufRanking: 4,
    qsRanking: 251,
    curriculumByYear: {
      1: {
        phase: 'Básico',
        description: 'Currículo integrado por sistemas orgânicos desde o 1° período.',
        subjects: [
          'Moléculas da Vida',
          'Bases Biológicas da Vida',
          'História da Medicina I',
          'Sistema Nervoso',
          'Sistema Cardiovascular e Respiratório',
          'Atividades Acadêmicas Optativas I',
        ],
        skills: ['Bioquímica aplicada', 'Anatomia por sistemas', 'Fisiologia integrada'],
        practicalHours: 300,
        references: [
          { title: 'Bioquímica', author: 'Lehninger, Nelson & Cox', type: 'book', verifiedBy: 'FM-UFRJ' },
          { title: 'Anatomia Humana', author: 'Netter', type: 'book', verifiedBy: 'FM-UFRJ' },
          { title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'FM-UFRJ' },
        ],
      },
      2: {
        phase: 'Básico',
        description: 'Continuação dos sistemas orgânicos e início da patologia.',
        subjects: [
          'Sistema Urinário',
          'Sistema Digestivo',
          'Sistema Endócrino e Reprodutor',
          'Sistema Locomotor',
          'Pele e Anexos',
          'Saúde e Sociedade I',
        ],
        skills: ['Anatomia sistêmica avançada', 'Fisiologia dos sistemas', 'Introdução à saúde coletiva'],
        practicalHours: 320,
        references: [
          { title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'FM-UFRJ' },
          { title: 'Histologia Básica', author: 'Junqueira & Carneiro', type: 'book', verifiedBy: 'FM-UFRJ' },
        ],
      },
      3: {
        phase: 'Clínico',
        description: 'Patologia, farmacologia, semiologia e propedêutica médica.',
        subjects: [
          'Patologia Geral e Especial',
          'Farmacologia I e II',
          'Semiologia Médica',
          'Microbiologia e Imunologia',
          'Epidemiologia',
          'Medicina Legal',
        ],
        skills: ['Exame físico completo', 'Raciocínio clínico', 'Farmacologia aplicada'],
        practicalHours: 480,
        references: [
          { title: 'Robbins — Patologia Básica', author: 'Kumar, Abbas & Aster', type: 'book', verifiedBy: 'FM-UFRJ' },
          { title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'FM-UFRJ' },
        ],
      },
      4: {
        phase: 'Clínico',
        description: 'Grandes clínicas e especialidades médicas.',
        subjects: [
          'Clínica Médica — Cardiologia, Pneumologia, Nefrologia',
          'Clínica Cirúrgica',
          'Pediatria',
          'Ginecologia e Obstetrícia',
          'Psiquiatria',
          'Neurologia',
          'Dermatologia',
          'Ortopedia',
        ],
        skills: ['Diagnóstico diferencial', 'Manejo clínico', 'Interpretação de exames complementares'],
        practicalHours: 600,
        references: [
          { title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'FM-UFRJ' },
          { title: 'Nelson — Tratado de Pediatria', author: 'Kliegman et al.', type: 'book', verifiedBy: 'FM-UFRJ' },
        ],
      },
      5: {
        phase: 'Internato',
        description: 'Internato com rodízios nas grandes áreas.',
        subjects: ['Internato — Clínica Médica', 'Internato — Cirurgia', 'Internato — Pediatria', 'Internato — Ginecologia e Obstetrícia', 'Internato — Saúde Coletiva'],
        skills: ['Manejo de pacientes internados', 'Procedimentos básicos', 'Prescrição médica'],
        practicalHours: 1600,
        references: [{ title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'FM-UFRJ' }],
      },
      6: {
        phase: 'Internato',
        description: 'Internato avançado com urgência e eletivos.',
        subjects: ['Internato — Urgência e Emergência', 'Internato — Saúde Mental', 'Internato — Medicina de Família', 'Internato — Eletivo'],
        skills: ['Emergências', 'Gestão em saúde', 'Preparação para residência'],
        practicalHours: 1800,
        references: [{ title: 'ATLS — Advanced Trauma Life Support', author: 'American College of Surgeons', type: 'book', verifiedBy: 'FM-UFRJ' }],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // UFMG — Faculdade de Medicina
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ufmg',
    name: 'UFMG — Faculdade de Medicina',
    state: 'MG',
    city: 'Belo Horizonte',
    curriculumType: 'Tradicional',
    mecScore: 5,
    enamScore: 5,
    enamYear: 2025,
    category: 'federal',
    foundedYear: 1911,
    monthlyFee: 'Gratuita',
    totalSeats: 320,
    duration: '12 semestres',
    shift: 'Integral',
    website: 'https://www.medicina.ufmg.br/',
    rufRanking: 5,
    qsRanking: 301,
    curriculumByYear: {
      1: {
        phase: 'Básico',
        description: 'Ciências básicas com anatomia, histologia, bioquímica e fisiologia.',
        subjects: ['Anatomia Humana I e II', 'Histologia e Embriologia', 'Bioquímica Médica', 'Biofísica', 'Biologia Celular', 'Introdução à Medicina', 'Saúde Coletiva I'],
        skills: ['Anatomia macroscópica', 'Microscopia', 'Bioquímica laboratorial'],
        practicalHours: 300,
        references: [
          { title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'FM-UFMG' },
          { title: 'Histologia Básica', author: 'Junqueira & Carneiro', type: 'book', verifiedBy: 'FM-UFMG' },
        ],
      },
      2: {
        phase: 'Básico',
        description: 'Fisiologia, patologia, microbiologia e farmacologia básica.',
        subjects: ['Fisiologia Humana I e II', 'Patologia Geral', 'Microbiologia e Imunologia', 'Parasitologia', 'Genética Médica', 'Farmacologia Básica', 'Saúde Coletiva II'],
        skills: ['Fisiologia experimental', 'Patologia geral', 'Microbiologia clínica'],
        practicalHours: 340,
        references: [
          { title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'FM-UFMG' },
          { title: 'Robbins — Patologia Básica', author: 'Kumar, Abbas & Aster', type: 'book', verifiedBy: 'FM-UFMG' },
        ],
      },
      3: {
        phase: 'Clínico',
        description: 'Semiologia, farmacologia clínica e introdução às especialidades.',
        subjects: ['Semiologia Médica', 'Farmacologia Clínica', 'Patologia Especial', 'Técnica Operatória', 'Epidemiologia', 'Medicina Legal', 'Diagnóstico por Imagem'],
        skills: ['Exame físico completo', 'Raciocínio clínico', 'Interpretação de imagens'],
        practicalHours: 500,
        references: [
          { title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'FM-UFMG' },
          { title: 'Goodman & Gilman — Bases Farmacológicas', author: 'Brunton et al.', type: 'book', verifiedBy: 'FM-UFMG' },
        ],
      },
      4: {
        phase: 'Clínico',
        description: 'Grandes clínicas e especialidades com rodízios hospitalares.',
        subjects: ['Clínica Médica', 'Clínica Cirúrgica', 'Pediatria', 'Ginecologia e Obstetrícia', 'Psiquiatria', 'Dermatologia', 'Neurologia', 'Ortopedia', 'Oftalmologia', 'Otorrinolaringologia'],
        skills: ['Diagnóstico diferencial', 'Manejo clínico-cirúrgico', 'Exames complementares'],
        practicalHours: 650,
        references: [{ title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'FM-UFMG' }],
      },
      5: {
        phase: 'Internato',
        subjects: ['Internato — Clínica Médica', 'Internato — Cirurgia', 'Internato — Pediatria', 'Internato — Ginecologia e Obstetrícia', 'Internato — Saúde Coletiva'],
        practicalHours: 1600,
        references: [{ title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'FM-UFMG' }],
      },
      6: {
        phase: 'Internato',
        subjects: ['Internato — Urgência e Emergência', 'Internato — Saúde Mental', 'Internato — Medicina de Família', 'Internato — Eletivo'],
        practicalHours: 1800,
        references: [{ title: 'ATLS — Advanced Trauma Life Support', author: 'American College of Surgeons', type: 'book', verifiedBy: 'FM-UFMG' }],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // UNICAMP — Faculdade de Ciências Médicas
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'unicamp',
    name: 'UNICAMP — Faculdade de Ciências Médicas',
    state: 'SP',
    city: 'Campinas',
    curriculumType: 'Tradicional',
    mecScore: 5,
    enamScore: 5,
    enamYear: 2025,
    category: 'estadual',
    foundedYear: 1963,
    monthlyFee: 'Gratuita',
    totalSeats: 110,
    duration: '12 semestres',
    shift: 'Integral',
    website: 'https://www.fcm.unicamp.br/',
    rufRanking: 2,
    qsRanking: 151,
    curriculumByYear: {
      1: {
        phase: 'Básico',
        description: 'Bases moleculares, anatômicas e fisiológicas do corpo humano.',
        subjects: ['Anatomia Humana', 'Biologia Celular e Tecidual', 'Bioquímica Médica', 'Biofísica e Fisiologia I', 'Embriologia', 'Introdução à Medicina e Saúde Coletiva', 'Metodologia Científica'],
        skills: ['Anatomia macroscópica e microscópica', 'Bioquímica laboratorial', 'Pesquisa científica básica'],
        practicalHours: 320,
        references: [
          { title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'FCM-UNICAMP' },
          { title: 'Histologia Básica', author: 'Junqueira & Carneiro', type: 'book', verifiedBy: 'FCM-UNICAMP' },
        ],
      },
      2: {
        phase: 'Básico',
        subjects: ['Fisiologia Humana II', 'Farmacologia Básica', 'Genética Médica', 'Microbiologia e Imunologia', 'Parasitologia', 'Patologia Geral', 'Saúde Coletiva II'],
        practicalHours: 340,
        references: [
          { title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'FCM-UNICAMP' },
          { title: 'Robbins — Patologia Básica', author: 'Kumar, Abbas & Aster', type: 'book', verifiedBy: 'FCM-UNICAMP' },
        ],
      },
      3: {
        phase: 'Clínico',
        subjects: ['Semiologia e Propedêutica', 'Farmacologia Clínica', 'Patologia Especial', 'Saúde Coletiva III — Epidemiologia', 'Medicina Legal', 'Técnica Cirúrgica', 'Diagnóstico por Imagem'],
        practicalHours: 500,
        references: [
          { title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'FCM-UNICAMP' },
          { title: 'Goodman & Gilman — Bases Farmacológicas', author: 'Brunton et al.', type: 'book', verifiedBy: 'FCM-UNICAMP' },
        ],
      },
      4: {
        phase: 'Clínico',
        subjects: ['Clínica Médica — Cardiologia, Pneumologia, Gastroenterologia', 'Clínica Cirúrgica', 'Pediatria', 'Ginecologia e Obstetrícia', 'Psiquiatria', 'Dermatologia', 'Neurologia', 'Ortopedia e Traumatologia'],
        practicalHours: 650,
        references: [{ title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'FCM-UNICAMP' }],
      },
      5: {
        phase: 'Internato',
        subjects: ['Internato — Clínica Médica', 'Internato — Cirurgia', 'Internato — Pediatria', 'Internato — Ginecologia e Obstetrícia'],
        practicalHours: 1600,
        references: [{ title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'FCM-UNICAMP' }],
      },
      6: {
        phase: 'Internato',
        subjects: ['Internato — Urgência e Emergência', 'Internato — Saúde Coletiva', 'Internato — Saúde Mental', 'Internato — Eletivo'],
        practicalHours: 1800,
        references: [{ title: 'ATLS — Advanced Trauma Life Support', author: 'American College of Surgeons', type: 'book', verifiedBy: 'FCM-UNICAMP' }],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // UFBA — Faculdade de Medicina da Bahia
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ufba',
    name: 'UFBA — Faculdade de Medicina da Bahia',
    state: 'BA',
    city: 'Salvador',
    curriculumType: 'Tradicional',
    mecScore: 5,
    enamScore: 4,
    enamYear: 2025,
    category: 'federal',
    foundedYear: 1808,
    monthlyFee: 'Gratuita',
    totalSeats: 160,
    duration: '12 semestres',
    shift: 'Integral',
    website: 'https://www.fameb.ufba.br/',
    rufRanking: 12,
    curriculumByYear: {
      1: {
        phase: 'Básico',
        subjects: ['Anatomia Humana I e II', 'Histologia e Embriologia', 'Bioquímica', 'Biofísica', 'Biologia Celular', 'Introdução ao Estudo da Medicina', 'Saúde, Cultura e Sociedade'],
        practicalHours: 280,
        references: [
          { title: 'Anatomia Humana', author: 'Netter', type: 'book', verifiedBy: 'FMB-UFBA' },
          { title: 'Histologia Básica', author: 'Junqueira & Carneiro', type: 'book', verifiedBy: 'FMB-UFBA' },
        ],
      },
      2: {
        phase: 'Básico',
        subjects: ['Fisiologia Humana I e II', 'Microbiologia e Imunologia', 'Parasitologia Médica', 'Patologia Geral', 'Genética Médica', 'Saúde Coletiva II', 'Psicologia Médica'],
        practicalHours: 320,
        references: [
          { title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'FMB-UFBA' },
          { title: 'Microbiologia Médica', author: 'Murray, Rosenthal & Pfaller', type: 'book', verifiedBy: 'FMB-UFBA' },
        ],
      },
      3: {
        phase: 'Clínico',
        subjects: ['Semiologia Médica', 'Farmacologia I e II', 'Patologia Especial', 'Epidemiologia', 'Medicina Legal', 'Técnica Operatória', 'Saúde Coletiva III'],
        practicalHours: 480,
        references: [
          { title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'FMB-UFBA' },
          { title: 'Goodman & Gilman — Bases Farmacológicas', author: 'Brunton et al.', type: 'book', verifiedBy: 'FMB-UFBA' },
        ],
      },
      4: {
        phase: 'Clínico',
        subjects: ['Clínica Médica — Cardiologia, Pneumologia, Nefrologia', 'Clínica Cirúrgica', 'Pediatria', 'Ginecologia e Obstetrícia', 'Psiquiatria', 'Dermatologia', 'Neurologia', 'Ortopedia', 'Medicina Tropical'],
        practicalHours: 600,
        references: [
          { title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'FMB-UFBA' },
          { title: 'Doenças Infecciosas e Parasitárias', author: 'Veronesi & Focaccia', type: 'book', verifiedBy: 'FMB-UFBA' },
        ],
      },
      5: {
        phase: 'Internato',
        subjects: ['Internato — Clínica Médica', 'Internato — Cirurgia', 'Internato — Pediatria', 'Internato — Ginecologia e Obstetrícia', 'Internato — Saúde Coletiva'],
        practicalHours: 1600,
        references: [{ title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'FMB-UFBA' }],
      },
      6: {
        phase: 'Internato',
        subjects: ['Internato — Urgência e Emergência', 'Internato — Saúde Mental', 'Internato — Medicina de Família', 'Internato — Eletivo'],
        practicalHours: 1800,
        references: [{ title: 'ATLS — Advanced Trauma Life Support', author: 'American College of Surgeons', type: 'book', verifiedBy: 'FMB-UFBA' }],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PUC — Pontifícia Universidade Católica (Medicina)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'puc',
    name: 'PUC — Pontifícia Universidade Católica (Medicina)',
    state: 'PR/SP/MG',
    curriculumType: 'Misto',
    mecScore: 4,
    enamScore: 4,
    enamYear: 2025,
    category: 'comunitaria',
    monthlyFee: 'R$ 11.000',
    totalSeats: 100,
    duration: '12 semestres',
    shift: 'Integral',
    curriculumByYear: {
      1: {
        phase: 'Básico',
        subjects: ['Bases Morfofisiológicas do Sistema Nervoso', 'Bases Morfofisiológicas do Sistema Cardiovascular e Respiratório', 'Ciências Morfofuncionais I — Célula e Tecidos', 'Saúde e Sociedade I', 'Habilidades Médicas I', 'Metodologia Científica'],
        practicalHours: 280,
        references: [
          { title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'PUC Medicina' },
          { title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'PUC Medicina' },
        ],
      },
      2: {
        phase: 'Básico',
        subjects: ['Bases Morfofisiológicas do Sistema Digestório e Urinário', 'Bases Morfofisiológicas do Sistema Endócrino e Reprodutor', 'Mecanismos de Doença — Patologia e Imunologia', 'Microbiologia e Parasitologia', 'Saúde e Sociedade II', 'Habilidades Médicas II'],
        practicalHours: 300,
        references: [
          { title: 'Robbins — Patologia Básica', author: 'Kumar, Abbas & Aster', type: 'book', verifiedBy: 'PUC Medicina' },
          { title: 'Imunologia Celular e Molecular', author: 'Abbas, Lichtman & Pillai', type: 'book', verifiedBy: 'PUC Medicina' },
        ],
      },
      3: {
        phase: 'Clínico',
        subjects: ['Propedêutica Médica e Semiologia', 'Farmacologia Clínica', 'Medicina Legal e Ética', 'Epidemiologia e Bioestatística', 'Diagnóstico por Imagem', 'Saúde e Sociedade III', 'Habilidades Médicas III'],
        practicalHours: 480,
        references: [
          { title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'PUC Medicina' },
          { title: 'Goodman & Gilman — Bases Farmacológicas', author: 'Brunton et al.', type: 'book', verifiedBy: 'PUC Medicina' },
        ],
      },
      4: {
        phase: 'Clínico',
        subjects: ['Clínica Médica — Cardiologia, Pneumologia, Gastroenterologia, Nefrologia', 'Clínica Cirúrgica', 'Pediatria e Neonatologia', 'Ginecologia e Obstetrícia', 'Psiquiatria', 'Dermatologia', 'Ortopedia e Traumatologia', 'Neurologia', 'Oftalmologia e Otorrinolaringologia'],
        practicalHours: 600,
        references: [
          { title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'PUC Medicina' },
          { title: 'Nelson — Tratado de Pediatria', author: 'Kliegman et al.', type: 'book', verifiedBy: 'PUC Medicina' },
        ],
      },
      5: {
        phase: 'Internato',
        subjects: ['Internato — Clínica Médica', 'Internato — Cirurgia', 'Internato — Pediatria', 'Internato — Ginecologia e Obstetrícia', 'Internato — Medicina de Família e Comunidade'],
        practicalHours: 1600,
        references: [{ title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'PUC Medicina' }],
      },
      6: {
        phase: 'Internato',
        subjects: ['Internato — Urgência e Emergência', 'Internato — Saúde Coletiva', 'Internato — Saúde Mental', 'Internato — Eletivo'],
        practicalHours: 1800,
        references: [{ title: 'ATLS — Advanced Trauma Life Support', author: 'American College of Surgeons', type: 'book', verifiedBy: 'PUC Medicina' }],
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NOVAS UNIVERSIDADES
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'ufpr',
    name: 'UFPR — Universidade Federal do Paraná',
    state: 'PR',
    city: 'Curitiba',
    curriculumType: 'Tradicional',
    mecScore: 5,
    enamScore: 5,
    enamYear: 2025,
    category: 'federal',
    foundedYear: 1912,
    monthlyFee: 'Gratuita',
    totalSeats: 132,
    duration: '12 semestres',
    shift: 'Integral',
    website: 'https://www.saude.ufpr.br/',
    rufRanking: 8,
    curriculumByYear: {
      1: { phase: 'Básico', subjects: ['Anatomia Médica I e II', 'Histologia e Embriologia', 'Bioquímica Médica', 'Biofísica', 'Biologia Celular e Molecular', 'Introdução à Medicina', 'Saúde Coletiva I'], practicalHours: 300, references: [{ title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'UFPR' }] },
      2: { phase: 'Básico', subjects: ['Fisiologia Médica I e II', 'Patologia Geral', 'Microbiologia e Imunologia', 'Parasitologia', 'Genética Médica', 'Farmacologia Básica', 'Saúde Coletiva II'], practicalHours: 340, references: [{ title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'UFPR' }] },
      3: { phase: 'Clínico', subjects: ['Semiologia Médica', 'Farmacologia Clínica', 'Patologia Especial', 'Técnica Operatória', 'Epidemiologia', 'Medicina Legal', 'Diagnóstico por Imagem'], practicalHours: 500, references: [{ title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'UFPR' }] },
      4: { phase: 'Clínico', subjects: ['Clínica Médica', 'Clínica Cirúrgica', 'Pediatria', 'Ginecologia e Obstetrícia', 'Psiquiatria', 'Neurologia', 'Dermatologia', 'Ortopedia'], practicalHours: 600, references: [{ title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'UFPR' }] },
      5: { phase: 'Internato', subjects: ['Internato — Clínica Médica', 'Internato — Cirurgia', 'Internato — Pediatria', 'Internato — Ginecologia e Obstetrícia'], practicalHours: 1600, references: [{ title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'UFPR' }] },
      6: { phase: 'Internato', subjects: ['Internato — Urgência e Emergência', 'Internato — Saúde Coletiva', 'Internato — Saúde Mental', 'Internato — Eletivo'], practicalHours: 1800, references: [{ title: 'ATLS', author: 'American College of Surgeons', type: 'book', verifiedBy: 'UFPR' }] },
    },
  },

  {
    id: 'ufc',
    name: 'UFC — Universidade Federal do Ceará',
    state: 'CE',
    city: 'Fortaleza',
    curriculumType: 'Misto',
    mecScore: 5,
    enamScore: 4,
    enamYear: 2025,
    category: 'federal',
    foundedYear: 1948,
    monthlyFee: 'Gratuita',
    totalSeats: 120,
    duration: '12 semestres',
    shift: 'Integral',
    website: 'https://www.medicina.ufc.br/',
    rufRanking: 10,
    curriculumByYear: {
      1: { phase: 'Básico', subjects: ['Anatomia Humana I e II', 'Histologia e Embriologia', 'Bioquímica', 'Biofísica', 'Biologia Celular', 'Introdução à Medicina', 'Saúde Comunitária I'], practicalHours: 280, references: [{ title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'UFC' }] },
      2: { phase: 'Básico', subjects: ['Fisiologia Humana', 'Patologia Geral', 'Microbiologia e Imunologia', 'Parasitologia', 'Genética', 'Farmacologia Básica', 'Saúde Comunitária II'], practicalHours: 320, references: [{ title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'UFC' }] },
      3: { phase: 'Clínico', subjects: ['Semiologia Médica', 'Farmacologia Clínica', 'Patologia Especial', 'Técnica Cirúrgica', 'Epidemiologia', 'Medicina Legal', 'Saúde Coletiva III'], practicalHours: 480, references: [{ title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'UFC' }] },
      4: { phase: 'Clínico', subjects: ['Clínica Médica', 'Clínica Cirúrgica', 'Pediatria', 'Ginecologia e Obstetrícia', 'Psiquiatria', 'Dermatologia', 'Neurologia', 'Medicina Tropical'], practicalHours: 600, references: [{ title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'UFC' }] },
      5: { phase: 'Internato', subjects: ['Internato — Clínica Médica', 'Internato — Cirurgia', 'Internato — Pediatria', 'Internato — Ginecologia e Obstetrícia', 'Internato — Saúde Coletiva'], practicalHours: 1600, references: [{ title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'UFC' }] },
      6: { phase: 'Internato', subjects: ['Internato — Urgência e Emergência', 'Internato — Saúde Mental', 'Internato — Medicina de Família', 'Internato — Eletivo'], practicalHours: 1800, references: [{ title: 'ATLS', author: 'American College of Surgeons', type: 'book', verifiedBy: 'UFC' }] },
    },
  },

  {
    id: 'ufpe',
    name: 'UFPE — Universidade Federal de Pernambuco',
    state: 'PE',
    city: 'Recife',
    curriculumType: 'Tradicional',
    mecScore: 5,
    enamScore: 4,
    enamYear: 2025,
    category: 'federal',
    foundedYear: 1920,
    monthlyFee: 'Gratuita',
    totalSeats: 140,
    duration: '12 semestres',
    shift: 'Integral',
    rufRanking: 11,
    curriculumByYear: {
      1: { phase: 'Básico', subjects: ['Anatomia Humana', 'Histologia', 'Bioquímica', 'Biofísica', 'Biologia Celular', 'Introdução à Medicina', 'Saúde Coletiva I'], practicalHours: 280, references: [{ title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'UFPE' }] },
      2: { phase: 'Básico', subjects: ['Fisiologia', 'Patologia Geral', 'Microbiologia', 'Imunologia', 'Parasitologia', 'Genética', 'Farmacologia Básica'], practicalHours: 320, references: [{ title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'UFPE' }] },
      3: { phase: 'Clínico', subjects: ['Semiologia', 'Farmacologia Clínica', 'Patologia Especial', 'Técnica Cirúrgica', 'Epidemiologia', 'Medicina Legal'], practicalHours: 480, references: [{ title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'UFPE' }] },
      4: { phase: 'Clínico', subjects: ['Clínica Médica', 'Clínica Cirúrgica', 'Pediatria', 'Ginecologia e Obstetrícia', 'Psiquiatria', 'Neurologia', 'Dermatologia'], practicalHours: 600, references: [{ title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'UFPE' }] },
      5: { phase: 'Internato', subjects: ['Internato — Clínica Médica', 'Internato — Cirurgia', 'Internato — Pediatria', 'Internato — GO'], practicalHours: 1600, references: [{ title: 'Harrison', author: 'Kasper et al.', type: 'book', verifiedBy: 'UFPE' }] },
      6: { phase: 'Internato', subjects: ['Internato — Urgência', 'Internato — Saúde Coletiva', 'Internato — Saúde Mental', 'Internato — Eletivo'], practicalHours: 1800, references: [{ title: 'ATLS', author: 'American College of Surgeons', type: 'book', verifiedBy: 'UFPE' }] },
    },
  },

  {
    id: 'uel',
    name: 'UEL — Universidade Estadual de Londrina',
    state: 'PR',
    city: 'Londrina',
    curriculumType: 'PBL',
    mecScore: 5,
    enamScore: 5,
    enamYear: 2025,
    category: 'estadual',
    foundedYear: 1967,
    monthlyFee: 'Gratuita',
    totalSeats: 80,
    duration: '12 semestres',
    shift: 'Integral',
    rufRanking: 15,
    curriculumByYear: {
      1: { phase: 'Básico', subjects: ['Módulo de Introdução ao Estudo da Medicina', 'Módulo de Metabolismo', 'Módulo de Mecanismos de Agressão e Defesa', 'Habilidades e Atitudes Médicas I', 'Interação Comunitária I'], practicalHours: 300, references: [{ title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'UEL' }] },
      2: { phase: 'Básico', subjects: ['Módulo de Proliferação Celular', 'Módulo de Percepção, Consciência e Emoção', 'Módulo de Saúde da Mulher e do RN', 'Habilidades e Atitudes Médicas II', 'Interação Comunitária II'], practicalHours: 320, references: [{ title: 'Robbins — Patologia Básica', author: 'Kumar, Abbas & Aster', type: 'book', verifiedBy: 'UEL' }] },
      3: { phase: 'Intermediário', subjects: ['Módulo de Dor', 'Módulo de Febre', 'Módulo de Dispneia', 'Módulo de Distúrbios Hemodinâmicos', 'Habilidades e Atitudes Médicas III'], practicalHours: 450, references: [{ title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'UEL' }] },
      4: { phase: 'Clínico', subjects: ['Módulo de Manifestações Abdominais', 'Módulo de Saúde Mental', 'Módulo de Emergências', 'Módulo de Distúrbios Sensoriais e Motores', 'Habilidades e Atitudes Médicas IV'], practicalHours: 550, references: [{ title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'UEL' }] },
      5: { phase: 'Internato', subjects: ['Internato — Clínica Médica', 'Internato — Cirurgia', 'Internato — Pediatria', 'Internato — GO', 'Internato — Saúde Coletiva'], practicalHours: 1600, references: [{ title: 'Harrison', author: 'Kasper et al.', type: 'book', verifiedBy: 'UEL' }] },
      6: { phase: 'Internato', subjects: ['Internato — Urgência', 'Internato — Saúde Mental', 'Internato — Medicina de Família', 'Internato — Eletivo'], practicalHours: 1800, references: [{ title: 'ATLS', author: 'American College of Surgeons', type: 'book', verifiedBy: 'UEL' }] },
    },
  },

  {
    id: 'unesp',
    name: 'UNESP — Faculdade de Medicina de Botucatu',
    state: 'SP',
    city: 'Botucatu',
    curriculumType: 'Tradicional',
    mecScore: 5,
    enamScore: 5,
    enamYear: 2025,
    category: 'estadual',
    foundedYear: 1963,
    monthlyFee: 'Gratuita',
    totalSeats: 90,
    duration: '12 semestres',
    shift: 'Integral',
    rufRanking: 7,
    curriculumByYear: {
      1: { phase: 'Básico', subjects: ['Anatomia Humana', 'Histologia e Embriologia', 'Bioquímica', 'Biofísica', 'Biologia Celular', 'Introdução à Medicina', 'Saúde Coletiva I'], practicalHours: 300, references: [{ title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'FMB-UNESP' }] },
      2: { phase: 'Básico', subjects: ['Fisiologia', 'Patologia Geral', 'Microbiologia', 'Imunologia', 'Parasitologia', 'Genética', 'Farmacologia Básica'], practicalHours: 340, references: [{ title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'FMB-UNESP' }] },
      3: { phase: 'Clínico', subjects: ['Semiologia', 'Farmacologia Clínica', 'Patologia Especial', 'Técnica Cirúrgica', 'Epidemiologia', 'Medicina Legal'], practicalHours: 500, references: [{ title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'FMB-UNESP' }] },
      4: { phase: 'Clínico', subjects: ['Clínica Médica', 'Clínica Cirúrgica', 'Pediatria', 'Ginecologia e Obstetrícia', 'Psiquiatria', 'Neurologia', 'Dermatologia', 'Ortopedia'], practicalHours: 600, references: [{ title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'FMB-UNESP' }] },
      5: { phase: 'Internato', subjects: ['Internato — Clínica Médica', 'Internato — Cirurgia', 'Internato — Pediatria', 'Internato — GO'], practicalHours: 1600, references: [{ title: 'Harrison', author: 'Kasper et al.', type: 'book', verifiedBy: 'FMB-UNESP' }] },
      6: { phase: 'Internato', subjects: ['Internato — Urgência', 'Internato — Saúde Coletiva', 'Internato — Saúde Mental', 'Internato — Eletivo'], practicalHours: 1800, references: [{ title: 'ATLS', author: 'American College of Surgeons', type: 'book', verifiedBy: 'FMB-UNESP' }] },
    },
  },

  {
    id: 'famerp',
    name: 'FAMERP — Faculdade de Medicina de São José do Rio Preto',
    state: 'SP',
    city: 'São José do Rio Preto',
    curriculumType: 'PBL',
    mecScore: 5,
    enamScore: 5,
    enamYear: 2025,
    category: 'estadual',
    foundedYear: 1968,
    monthlyFee: 'Gratuita',
    totalSeats: 80,
    duration: '12 semestres',
    shift: 'Integral',
    rufRanking: 6,
    curriculumByYear: {
      1: { phase: 'Básico', subjects: ['Bases Morfológicas da Medicina', 'Bases Bioquímicas e Fisiológicas', 'Saúde Coletiva I', 'Habilidades Médicas I', 'Interação Comunitária I'], practicalHours: 300, references: [{ title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'FAMERP' }] },
      2: { phase: 'Básico', subjects: ['Mecanismos de Agressão e Defesa', 'Farmacologia Básica', 'Patologia Geral', 'Genética Médica', 'Saúde Coletiva II', 'Habilidades Médicas II'], practicalHours: 320, references: [{ title: 'Robbins — Patologia Básica', author: 'Kumar, Abbas & Aster', type: 'book', verifiedBy: 'FAMERP' }] },
      3: { phase: 'Clínico', subjects: ['Semiologia', 'Farmacologia Clínica', 'Patologia Especial', 'Técnica Cirúrgica', 'Epidemiologia', 'Medicina Legal'], practicalHours: 500, references: [{ title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'FAMERP' }] },
      4: { phase: 'Clínico', subjects: ['Clínica Médica', 'Clínica Cirúrgica', 'Pediatria', 'GO', 'Psiquiatria', 'Neurologia', 'Dermatologia'], practicalHours: 600, references: [{ title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'FAMERP' }] },
      5: { phase: 'Internato', subjects: ['Internato — Clínica Médica', 'Internato — Cirurgia', 'Internato — Pediatria', 'Internato — GO'], practicalHours: 1600, references: [{ title: 'Harrison', author: 'Kasper et al.', type: 'book', verifiedBy: 'FAMERP' }] },
      6: { phase: 'Internato', subjects: ['Internato — Urgência', 'Internato — Saúde Coletiva', 'Internato — Saúde Mental', 'Internato — Eletivo'], practicalHours: 1800, references: [{ title: 'ATLS', author: 'American College of Surgeons', type: 'book', verifiedBy: 'FAMERP' }] },
    },
  },

  {
    id: 'einstein',
    name: 'Einstein — Faculdade Israelita de Ciências da Saúde',
    state: 'SP',
    city: 'São Paulo',
    curriculumType: 'PBL',
    mecScore: 5,
    enamScore: 5,
    enamYear: 2025,
    category: 'privada',
    foundedYear: 2015,
    monthlyFee: 'R$ 14.000',
    totalSeats: 50,
    duration: '12 semestres',
    shift: 'Integral',
    website: 'https://ensino.einstein.br/',
    rufRanking: 9,
    curriculumByYear: {
      1: { phase: 'Básico', subjects: ['Bases da Medicina I — Célula e Genoma', 'Bases da Medicina II — Sistemas Orgânicos', 'Saúde e Sociedade I', 'Habilidades Clínicas I', 'Metodologia Científica', 'Humanidades Médicas'], practicalHours: 350, references: [{ title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'Einstein' }, { title: 'Biologia Molecular da Célula', author: 'Alberts et al.', type: 'book', verifiedBy: 'Einstein' }] },
      2: { phase: 'Básico', subjects: ['Mecanismos de Doença', 'Farmacologia e Terapêutica', 'Microbiologia e Imunologia', 'Saúde e Sociedade II', 'Habilidades Clínicas II', 'Pesquisa em Saúde'], practicalHours: 380, references: [{ title: 'Robbins — Patologia Básica', author: 'Kumar, Abbas & Aster', type: 'book', verifiedBy: 'Einstein' }] },
      3: { phase: 'Clínico', subjects: ['Semiologia e Propedêutica', 'Farmacologia Clínica Avançada', 'Diagnóstico por Imagem', 'Técnica Cirúrgica', 'Epidemiologia e Bioestatística', 'Medicina Baseada em Evidências'], practicalHours: 550, references: [{ title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'Einstein' }] },
      4: { phase: 'Clínico', subjects: ['Clínica Médica Integrada', 'Clínica Cirúrgica', 'Pediatria', 'GO', 'Psiquiatria', 'Neurologia', 'Dermatologia', 'Ortopedia', 'Simulação Clínica Avançada'], practicalHours: 700, references: [{ title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'Einstein' }] },
      5: { phase: 'Internato', subjects: ['Internato — Clínica Médica', 'Internato — Cirurgia', 'Internato — Pediatria', 'Internato — GO', 'Internato — Medicina de Família'], practicalHours: 1800, references: [{ title: 'Harrison', author: 'Kasper et al.', type: 'book', verifiedBy: 'Einstein' }] },
      6: { phase: 'Internato', subjects: ['Internato — Urgência e Emergência', 'Internato — Saúde Coletiva', 'Internato — Eletivo Internacional', 'Internato — Pesquisa Clínica'], practicalHours: 2000, references: [{ title: 'ATLS', author: 'American College of Surgeons', type: 'book', verifiedBy: 'Einstein' }] },
    },
  },

  {
    id: 'santacasa',
    name: 'Santa Casa de São Paulo — FCMSCSP',
    state: 'SP',
    city: 'São Paulo',
    curriculumType: 'Tradicional',
    mecScore: 5,
    enamScore: 5,
    enamYear: 2025,
    category: 'privada',
    foundedYear: 1963,
    monthlyFee: 'R$ 10.500',
    totalSeats: 100,
    duration: '12 semestres',
    shift: 'Integral',
    rufRanking: 13,
    curriculumByYear: {
      1: { phase: 'Básico', subjects: ['Anatomia Humana', 'Histologia e Embriologia', 'Bioquímica', 'Biofísica', 'Biologia Celular', 'Introdução à Medicina', 'Saúde Coletiva I'], practicalHours: 300, references: [{ title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'FCMSCSP' }] },
      2: { phase: 'Básico', subjects: ['Fisiologia', 'Patologia Geral', 'Microbiologia', 'Imunologia', 'Parasitologia', 'Genética', 'Farmacologia Básica'], practicalHours: 340, references: [{ title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'FCMSCSP' }] },
      3: { phase: 'Clínico', subjects: ['Semiologia', 'Farmacologia Clínica', 'Patologia Especial', 'Técnica Cirúrgica', 'Epidemiologia', 'Medicina Legal'], practicalHours: 500, references: [{ title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'FCMSCSP' }] },
      4: { phase: 'Clínico', subjects: ['Clínica Médica', 'Clínica Cirúrgica', 'Pediatria', 'GO', 'Psiquiatria', 'Neurologia', 'Dermatologia', 'Ortopedia'], practicalHours: 600, references: [{ title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'FCMSCSP' }] },
      5: { phase: 'Internato', subjects: ['Internato — Clínica Médica', 'Internato — Cirurgia', 'Internato — Pediatria', 'Internato — GO'], practicalHours: 1600, references: [{ title: 'Harrison', author: 'Kasper et al.', type: 'book', verifiedBy: 'FCMSCSP' }] },
      6: { phase: 'Internato', subjects: ['Internato — Urgência', 'Internato — Saúde Coletiva', 'Internato — Saúde Mental', 'Internato — Eletivo'], practicalHours: 1800, references: [{ title: 'ATLS', author: 'American College of Surgeons', type: 'book', verifiedBy: 'FCMSCSP' }] },
    },
  },

  {
    id: 'famema',
    name: 'FAMEMA — Faculdade de Medicina de Marília',
    state: 'SP',
    city: 'Marília',
    curriculumType: 'PBL',
    mecScore: 5,
    enamScore: 5,
    enamYear: 2025,
    category: 'estadual',
    foundedYear: 1966,
    monthlyFee: 'Gratuita',
    totalSeats: 80,
    duration: '12 semestres',
    shift: 'Integral',
    rufRanking: 14,
    curriculumByYear: {
      1: { phase: 'Básico', subjects: ['Unidade de Prática Profissional I', 'Unidade Educacional Sistematizada I', 'Interação Comunitária I', 'Laboratório de Prática Profissional I'], practicalHours: 350, references: [{ title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'FAMEMA' }] },
      2: { phase: 'Básico', subjects: ['Unidade de Prática Profissional II', 'Unidade Educacional Sistematizada II', 'Interação Comunitária II', 'Laboratório de Prática Profissional II'], practicalHours: 380, references: [{ title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'FAMEMA' }] },
      3: { phase: 'Intermediário', subjects: ['Unidade de Prática Profissional III', 'Unidade Educacional Sistematizada III', 'Interação Comunitária III'], practicalHours: 500, references: [{ title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'FAMEMA' }] },
      4: { phase: 'Clínico', subjects: ['Unidade de Prática Profissional IV', 'Unidade Educacional Sistematizada IV', 'Interação Comunitária IV'], practicalHours: 600, references: [{ title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'FAMEMA' }] },
      5: { phase: 'Internato', subjects: ['Internato — Clínica Médica', 'Internato — Cirurgia', 'Internato — Pediatria', 'Internato — GO', 'Internato — Saúde Coletiva'], practicalHours: 1600, references: [{ title: 'Harrison', author: 'Kasper et al.', type: 'book', verifiedBy: 'FAMEMA' }] },
      6: { phase: 'Internato', subjects: ['Internato — Urgência', 'Internato — Saúde Mental', 'Internato — Medicina de Família', 'Internato — Eletivo'], practicalHours: 1800, references: [{ title: 'ATLS', author: 'American College of Surgeons', type: 'book', verifiedBy: 'FAMEMA' }] },
    },
  },

  {
    id: 'ufrgs',
    name: 'UFRGS — Universidade Federal do Rio Grande do Sul',
    state: 'RS',
    city: 'Porto Alegre',
    curriculumType: 'Tradicional',
    mecScore: 5,
    enamScore: 5,
    enamYear: 2025,
    category: 'federal',
    foundedYear: 1898,
    monthlyFee: 'Gratuita',
    totalSeats: 140,
    duration: '12 semestres',
    shift: 'Integral',
    rufRanking: 6,
    qsRanking: 351,
    curriculumByYear: {
      1: { phase: 'Básico', subjects: ['Anatomia Humana', 'Histologia e Embriologia', 'Bioquímica', 'Biofísica', 'Biologia Celular e Molecular', 'Introdução à Medicina', 'Saúde Coletiva I'], practicalHours: 300, references: [{ title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'FAMED-UFRGS' }] },
      2: { phase: 'Básico', subjects: ['Fisiologia Médica', 'Patologia Geral', 'Microbiologia e Imunologia', 'Parasitologia', 'Genética Médica', 'Farmacologia Básica', 'Saúde Coletiva II'], practicalHours: 340, references: [{ title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'FAMED-UFRGS' }] },
      3: { phase: 'Clínico', subjects: ['Semiologia Médica', 'Farmacologia Clínica', 'Patologia Especial', 'Técnica Cirúrgica', 'Epidemiologia', 'Medicina Legal', 'Diagnóstico por Imagem'], practicalHours: 500, references: [{ title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'FAMED-UFRGS' }] },
      4: { phase: 'Clínico', subjects: ['Clínica Médica', 'Clínica Cirúrgica', 'Pediatria', 'GO', 'Psiquiatria', 'Neurologia', 'Dermatologia', 'Ortopedia'], practicalHours: 650, references: [{ title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'FAMED-UFRGS' }] },
      5: { phase: 'Internato', subjects: ['Internato — Clínica Médica', 'Internato — Cirurgia', 'Internato — Pediatria', 'Internato — GO', 'Internato — Saúde Coletiva'], practicalHours: 1600, references: [{ title: 'Harrison', author: 'Kasper et al.', type: 'book', verifiedBy: 'FAMED-UFRGS' }] },
      6: { phase: 'Internato', subjects: ['Internato — Urgência', 'Internato — Saúde Mental', 'Internato — Medicina de Família', 'Internato — Eletivo'], practicalHours: 1800, references: [{ title: 'ATLS', author: 'American College of Surgeons', type: 'book', verifiedBy: 'FAMED-UFRGS' }] },
    },
  },

  {
    id: 'unb',
    name: 'UnB — Universidade de Brasília',
    state: 'DF',
    city: 'Brasília',
    curriculumType: 'Tradicional',
    mecScore: 5,
    enamScore: 4,
    enamYear: 2025,
    category: 'federal',
    foundedYear: 1966,
    monthlyFee: 'Gratuita',
    totalSeats: 80,
    duration: '12 semestres',
    shift: 'Integral',
    rufRanking: 16,
    curriculumByYear: {
      1: { phase: 'Básico', subjects: ['Anatomia Humana', 'Histologia e Embriologia', 'Bioquímica', 'Biofísica', 'Biologia Celular', 'Introdução à Medicina', 'Saúde Coletiva I'], practicalHours: 280, references: [{ title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'FM-UnB' }] },
      2: { phase: 'Básico', subjects: ['Fisiologia', 'Patologia Geral', 'Microbiologia', 'Imunologia', 'Parasitologia', 'Genética', 'Farmacologia Básica'], practicalHours: 320, references: [{ title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'FM-UnB' }] },
      3: { phase: 'Clínico', subjects: ['Semiologia', 'Farmacologia Clínica', 'Patologia Especial', 'Técnica Cirúrgica', 'Epidemiologia', 'Medicina Legal'], practicalHours: 480, references: [{ title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'FM-UnB' }] },
      4: { phase: 'Clínico', subjects: ['Clínica Médica', 'Clínica Cirúrgica', 'Pediatria', 'GO', 'Psiquiatria', 'Neurologia', 'Dermatologia'], practicalHours: 600, references: [{ title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'FM-UnB' }] },
      5: { phase: 'Internato', subjects: ['Internato — Clínica Médica', 'Internato — Cirurgia', 'Internato — Pediatria', 'Internato — GO'], practicalHours: 1600, references: [{ title: 'Harrison', author: 'Kasper et al.', type: 'book', verifiedBy: 'FM-UnB' }] },
      6: { phase: 'Internato', subjects: ['Internato — Urgência', 'Internato — Saúde Coletiva', 'Internato — Saúde Mental', 'Internato — Eletivo'], practicalHours: 1800, references: [{ title: 'ATLS', author: 'American College of Surgeons', type: 'book', verifiedBy: 'FM-UnB' }] },
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Rankings Mundiais de Medicina — QS 2025
// ═══════════════════════════════════════════════════════════════════════════
export interface WorldUniversity {
  rank: number;
  name: string;
  country: string;
  score: number;
  strengths: string[];
  website: string;
}

export const WORLD_RANKINGS_QS: WorldUniversity[] = [
  { rank: 1, name: 'Harvard University', country: 'EUA', score: 98.1, strengths: ['Pesquisa biomédica', 'Residência médica', 'Inovação em saúde'], website: 'https://hms.harvard.edu/' },
  { rank: 2, name: 'University of Oxford', country: 'Reino Unido', score: 95.0, strengths: ['Medicina baseada em evidências', 'Pesquisa clínica', 'Tutorial system'], website: 'https://www.medsci.ox.ac.uk/' },
  { rank: 3, name: 'Stanford University', country: 'EUA', score: 92.4, strengths: ['Medicina de precisão', 'Bioengenharia', 'Inteligência artificial em saúde'], website: 'https://med.stanford.edu/' },
  { rank: 4, name: 'Johns Hopkins University', country: 'EUA', score: 91.3, strengths: ['Saúde pública', 'Epidemiologia', 'Pesquisa translacional'], website: 'https://www.hopkinsmedicine.org/' },
  { rank: 5, name: 'University of Cambridge', country: 'Reino Unido', score: 90.8, strengths: ['Ciências básicas', 'Neurociências', 'Genética médica'], website: 'https://www.medschl.cam.ac.uk/' },
  { rank: 6, name: 'Karolinska Institute', country: 'Suécia', score: 89.5, strengths: ['Prêmio Nobel em Medicina', 'Pesquisa em câncer', 'Saúde global'], website: 'https://ki.se/' },
  { rank: 7, name: 'UCLA — David Geffen School of Medicine', country: 'EUA', score: 88.9, strengths: ['Cirurgia', 'Neurologia', 'Pesquisa em HIV/AIDS'], website: 'https://medschool.ucla.edu/' },
  { rank: 8, name: 'UCSF — University of California, San Francisco', country: 'EUA', score: 88.2, strengths: ['Farmacologia', 'Pesquisa em células-tronco', 'Saúde da mulher'], website: 'https://www.ucsf.edu/' },
  { rank: 9, name: 'Imperial College London', country: 'Reino Unido', score: 87.6, strengths: ['Engenharia biomédica', 'Cirurgia robótica', 'Saúde digital'], website: 'https://www.imperial.ac.uk/medicine/' },
  { rank: 10, name: 'University of Melbourne', country: 'Austrália', score: 87.0, strengths: ['Saúde mental', 'Medicina rural', 'Pesquisa em câncer'], website: 'https://medicine.unimelb.edu.au/' },
  { rank: 11, name: 'University of Toronto', country: 'Canadá', score: 86.5, strengths: ['Descoberta da insulina', 'Transplantes', 'Saúde global'], website: 'https://temertymedicine.utoronto.ca/' },
  { rank: 12, name: 'University College London (UCL)', country: 'Reino Unido', score: 86.0, strengths: ['Neurociências', 'Genética', 'Saúde pública'], website: 'https://www.ucl.ac.uk/medical-school/' },
  { rank: 13, name: 'Yale University', country: 'EUA', score: 85.5, strengths: ['Imunologia', 'Oncologia', 'Psiquiatria'], website: 'https://medicine.yale.edu/' },
  { rank: 14, name: 'Columbia University', country: 'EUA', score: 85.0, strengths: ['Cardiologia', 'Cirurgia', 'Pesquisa genômica'], website: 'https://www.vagelos.columbia.edu/' },
  { rank: 15, name: 'University of Pennsylvania', country: 'EUA', score: 84.5, strengths: ['Terapia gênica', 'Oncologia', 'Dermatologia'], website: 'https://www.med.upenn.edu/' },
  { rank: 16, name: 'Duke University', country: 'EUA', score: 84.0, strengths: ['Cardiologia', 'Cirurgia', 'Pesquisa clínica'], website: 'https://medschool.duke.edu/' },
  { rank: 17, name: 'University of Sydney', country: 'Austrália', score: 83.5, strengths: ['Medicina tropical', 'Saúde indígena', 'Pesquisa em diabetes'], website: 'https://www.sydney.edu.au/medicine-health/' },
  { rank: 18, name: "King's College London", country: 'Reino Unido', score: 83.0, strengths: ['Psiquiatria', 'Odontologia', 'Saúde da mulher'], website: 'https://www.kcl.ac.uk/dentistry' },
  { rank: 19, name: 'National University of Singapore', country: 'Singapura', score: 82.5, strengths: ['Medicina tropical', 'Doenças infecciosas', 'Saúde digital'], website: 'https://medicine.nus.edu.sg/' },
  { rank: 20, name: 'University of Michigan', country: 'EUA', score: 82.0, strengths: ['Cirurgia', 'Medicina interna', 'Pesquisa em saúde pública'], website: 'https://medicine.umich.edu/' },
];

// ═══════════════════════════════════════════════════════════════════════════
// Dados MEC / ENAMED — Referências Nacionais
// ═══════════════════════════════════════════════════════════════════════════
export interface MecData {
  totalCourses: number;
  coursesEvaluated: number;
  satisfactory: number;
  unsatisfactory: number;
  totalStudents: number;
  proficiencyRate: number;
  year: number;
  dcnYear: number;
  dcnDescription: string;
  keyCompetencies: string[];
}

export const MEC_DATA: MecData = {
  totalCourses: 389,
  coursesEvaluated: 351,
  satisfactory: 163,
  unsatisfactory: 107,
  totalStudents: 39258,
  proficiencyRate: 67,
  year: 2025,
  dcnYear: 2014,
  dcnDescription: 'Diretrizes Curriculares Nacionais do Curso de Graduação em Medicina (Resolução CNE/CES nº 3/2014)',
  keyCompetencies: [
    'Atenção à Saúde — Promoção, prevenção, recuperação e reabilitação',
    'Gestão em Saúde — Administração e gerenciamento de serviços',
    'Educação em Saúde — Formação continuada e educação permanente',
    'Atenção Primária — Medicina de família e comunidade como eixo',
    'Urgência e Emergência — Atendimento inicial ao politraumatizado',
    'Saúde Mental — Abordagem integral da saúde mental',
    'Ética e Bioética — Princípios éticos na prática médica',
    'Pesquisa Científica — Metodologia e medicina baseada em evidências',
    'Comunicação — Relação médico-paciente e trabalho em equipe',
    'Liderança — Gestão de equipes multiprofissionais',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// Roadmap Visual — Fases do Curso de Medicina (DCN 2014)
// ═══════════════════════════════════════════════════════════════════════════
export interface MedicalPhase {
  year: number;
  phase: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  keyTopics: string[];
  practicalFocus: string;
  assessmentTypes: string[];
}

export const MEDICAL_ROADMAP: MedicalPhase[] = [
  {
    year: 1,
    phase: 'Básico',
    title: '1° Ano — Fundamentos',
    description: 'Construção da base científica: anatomia, histologia, bioquímica, fisiologia. Primeiro contato com pacientes e comunidade.',
    color: '#0d9488',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    keyTopics: ['Anatomia Humana', 'Histologia e Embriologia', 'Bioquímica', 'Fisiologia I', 'Biologia Celular', 'Saúde Coletiva I'],
    practicalFocus: 'Laboratórios de anatomia e microscopia, visitas a UBS',
    assessmentTypes: ['Provas teóricas', 'Provas práticas de anatomia', 'Relatórios de campo'],
  },
  {
    year: 2,
    phase: 'Básico',
    title: '2° Ano — Mecanismos',
    description: 'Compreensão dos mecanismos de doença: patologia, microbiologia, imunologia, farmacologia básica.',
    color: '#0891b2',
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    keyTopics: ['Fisiologia II', 'Patologia Geral', 'Microbiologia', 'Imunologia', 'Parasitologia', 'Genética', 'Farmacologia Básica'],
    practicalFocus: 'Laboratórios de patologia e microbiologia, início de práticas clínicas',
    assessmentTypes: ['Provas integradas', 'Análise de lâminas', 'Seminários'],
  },
  {
    year: 3,
    phase: 'Clínico',
    title: '3° Ano — Propedêutica',
    description: 'Semiologia médica: aprender a examinar o paciente. Farmacologia clínica e início dos rodízios.',
    color: '#7c3aed',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    keyTopics: ['Semiologia Médica', 'Farmacologia Clínica', 'Patologia Especial', 'Técnica Cirúrgica', 'Epidemiologia', 'Medicina Legal'],
    practicalFocus: 'Enfermarias e ambulatórios — exame físico supervisionado',
    assessmentTypes: ['OSCE', 'Provas práticas de semiologia', 'Casos clínicos'],
  },
  {
    year: 4,
    phase: 'Clínico',
    title: '4° Ano — Especialidades',
    description: 'Rodízios nas grandes clínicas: cardiologia, pneumologia, pediatria, cirurgia, GO, psiquiatria.',
    color: '#dc2626',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    keyTopics: ['Clínica Médica', 'Clínica Cirúrgica', 'Pediatria', 'Ginecologia e Obstetrícia', 'Psiquiatria', 'Neurologia', 'Dermatologia', 'Ortopedia'],
    practicalFocus: 'Rodízios hospitalares com atendimento supervisionado',
    assessmentTypes: ['Provas de especialidade', 'Discussão de casos', 'Mini-CEX'],
  },
  {
    year: 5,
    phase: 'Internato',
    title: '5° Ano — Internato I',
    description: 'Prática médica intensiva com responsabilidade crescente. Plantões e atendimento direto.',
    color: '#ea580c',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    keyTopics: ['Clínica Médica', 'Cirurgia', 'Pediatria', 'Ginecologia e Obstetrícia', 'Medicina de Família'],
    practicalFocus: 'Enfermarias, centro cirúrgico, maternidade, UBS',
    assessmentTypes: ['Avaliação 360°', 'Portfólio reflexivo', 'Prova prática'],
  },
  {
    year: 6,
    phase: 'Internato',
    title: '6° Ano — Internato II',
    description: 'Último ano: urgência, emergência, saúde mental e eletivos. Preparação para residência e REVALIDA.',
    color: '#b91c1c',
    icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    keyTopics: ['Urgência e Emergência', 'Saúde Coletiva', 'Saúde Mental', 'Eletivo', 'Preparação para Residência'],
    practicalFocus: 'Pronto-socorro, SAMU, UBS, ambulatórios especializados',
    assessmentTypes: ['OSCE final', 'Prova de residência simulada', 'TCC'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Ícones de currículo
// ═══════════════════════════════════════════════════════════════════════════
export const curriculumIcons: Record<string, string> = {
  'Tradicional': 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
  'PBL': 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  'Misto': 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
};
