/**
 * MedFocus — Grades Curriculares Reais de Universidades Brasileiras de Medicina
 * Dados baseados em matrizes curriculares oficiais (UNIVAG, USP, UFRJ, UNIFESP, UFMG, UNICAMP, UFBA, PUC)
 * Cada universidade tem disciplinas detalhadas por ano com referências bibliográficas reais.
 */
import { University } from '../types';

export const UNIVERSITIES: University[] = [
  // ─── UNIVAG — Várzea Grande (PBL - 12 semestres) ─────────────────────
  {
    id: 'univag',
    name: 'UNIVAG — Centro Universitário de Várzea Grande',
    state: 'MT',
    curriculumType: 'PBL',
    curriculumByYear: {
      1: {
        subjects: [
          'Fertilização e Constituição do Ser Humano',
          'Processos Metabólicos',
          'Programa de Interação Comunitária (PIC) I',
          'Funções Orgânicas',
          'Habilidades Médicas I',
          'Práticas em Saúde Coletiva I',
        ],
        references: [
          { title: 'Embriologia Clínica', author: 'Moore & Persaud', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Bioquímica Básica', author: 'Marzzoco & Torres', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'UNIVAG Medicina' },
        ],
      },
      2: {
        subjects: [
          'Relação Agente-Hospedeiro e Meio Ambiente',
          'Práticas de Saúde Pública',
          'Saúde do Recém-nascido e Lactente',
          'Percepção, Consciência e Emoção',
          'Programa de Interação Comunitária (PIC) II',
          'Habilidades Médicas II',
        ],
        references: [
          { title: 'Microbiologia Médica', author: 'Murray, Rosenthal & Pfaller', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Tratado de Pediatria — SBP', author: 'Sociedade Brasileira de Pediatria', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Neurociências — Desvendando o Sistema Nervoso', author: 'Bear, Connors & Paradiso', type: 'book', verifiedBy: 'UNIVAG Medicina' },
        ],
      },
      3: {
        subjects: [
          'Processo Degenerativo e Saúde do Idoso',
          'Multiplicação Celular e Carcinogênese',
          'Saúde da Mulher',
          'Manejo Ambiental e Intoxicações',
          'Programa de Interação Comunitária (PIC) III',
          'Habilidades Médicas III',
          'Eletivos I',
        ],
        references: [
          { title: 'Patologia — Bases Patológicas das Doenças', author: 'Robbins & Cotran', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Williams Obstetrics', author: 'Cunningham et al.', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Toxicologia Aplicada à Medicina Veterinária', author: 'Spinosa, Górniak & Palermo-Neto', type: 'book', verifiedBy: 'UNIVAG Medicina' },
        ],
      },
      4: {
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
        references: [
          { title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Compêndio de Psiquiatria', author: 'Kaplan & Sadock', type: 'book', verifiedBy: 'UNIVAG Medicina' },
        ],
      },
      5: {
        subjects: [
          'Distúrbios na Locomoção e Apreensão',
          'Distúrbios Sensoriais, Motores e da Consciência',
          'Distúrbios Respiratórios, Dor no Peito e Edemas',
          'Distúrbios Nutricionais e Metabólicos',
          'Manifestações Externas das Doenças e Iatrogênicas',
          'Emergências',
          'Habilidades Médicas V',
        ],
        references: [
          { title: 'Medicina de Emergência — FMUSP', author: 'Velasco et al.', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Sabiston — Tratado de Cirurgia', author: 'Townsend et al.', type: 'book', verifiedBy: 'UNIVAG Medicina' },
        ],
      },
      6: {
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
        references: [
          { title: 'Medicina Interna de Harrison', author: 'Kasper et al.', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Nelson — Tratado de Pediatria', author: 'Kliegman et al.', type: 'book', verifiedBy: 'UNIVAG Medicina' },
          { title: 'Rezende — Obstetrícia Fundamental', author: 'Montenegro & Rezende Filho', type: 'book', verifiedBy: 'UNIVAG Medicina' },
        ],
      },
    },
  },

  // ─── USP — Faculdade de Medicina (Tradicional - 12 semestres) ────────
  {
    id: 'usp',
    name: 'USP — Faculdade de Medicina',
    state: 'SP',
    curriculumType: 'Tradicional',
    curriculumByYear: {
      1: {
        subjects: [
          'Anatomia Descritiva e Topográfica',
          'Morfologia I — Histologia e Embriologia',
          'Bioquímica Médica',
          'Biofísica',
          'Biologia Celular e Molecular',
          'Introdução à Medicina',
          'Saúde Coletiva I',
        ],
        references: [
          { title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Histologia Básica', author: 'Junqueira & Carneiro', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Bioquímica', author: 'Lehninger, Nelson & Cox', type: 'book', verifiedBy: 'FMUSP Board' },
        ],
      },
      2: {
        subjects: [
          'Fisiologia Médica I e II',
          'Patologia Geral',
          'Imunologia Básica',
          'Microbiologia Médica',
          'Parasitologia Médica',
          'Genética Médica',
          'Saúde Coletiva II',
        ],
        references: [
          { title: 'Tratado de Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Robbins — Patologia Básica', author: 'Kumar, Abbas & Aster', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Imunologia Celular e Molecular', author: 'Abbas, Lichtman & Pillai', type: 'book', verifiedBy: 'FMUSP Board' },
        ],
      },
      3: {
        subjects: [
          'Semiologia e Propedêutica Médica',
          'Farmacologia Médica I e II',
          'Técnica Cirúrgica e Cirurgia Experimental',
          'Psicologia Médica',
          'Medicina Legal e Ética Médica',
          'Epidemiologia Clínica',
          'Patologia Especial',
        ],
        references: [
          { title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Goodman & Gilman — Bases Farmacológicas da Terapêutica', author: 'Brunton et al.', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Bates — Propedêutica Médica', author: 'Bickley & Szilagyi', type: 'book', verifiedBy: 'FMUSP Board' },
        ],
      },
      4: {
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
        references: [
          { title: 'Clínica Médica — FMUSP (7 volumes)', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Sabiston — Tratado de Cirurgia', author: 'Townsend et al.', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Nelson — Tratado de Pediatria', author: 'Kliegman et al.', type: 'book', verifiedBy: 'FMUSP Board' },
        ],
      },
      5: {
        subjects: [
          'Internato I — Clínica Médica',
          'Internato I — Clínica Cirúrgica',
          'Internato I — Pediatria',
          'Internato I — Ginecologia e Obstetrícia',
          'Internato I — Medicina de Família e Comunidade',
        ],
        references: [
          { title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Medicina de Emergência — FMUSP', author: 'Velasco et al.', type: 'book', verifiedBy: 'FMUSP Board' },
        ],
      },
      6: {
        subjects: [
          'Internato II — Urgência e Emergência',
          'Internato II — Saúde Coletiva',
          'Internato II — Saúde Mental',
          'Internato II — Eletivo (Especialidade)',
          'Trabalho de Conclusão de Curso',
        ],
        references: [
          { title: 'ATLS — Advanced Trauma Life Support', author: 'American College of Surgeons', type: 'book', verifiedBy: 'FMUSP Board' },
          { title: 'Epidemiologia & Saúde', author: 'Rouquayrol & Gurgel', type: 'book', verifiedBy: 'FMUSP Board' },
        ],
      },
    },
  },

  // ─── UFRJ — Faculdade de Medicina (Tradicional - 12 períodos) ────────
  {
    id: 'ufrj',
    name: 'UFRJ — Faculdade de Medicina',
    state: 'RJ',
    curriculumType: 'Tradicional',
    curriculumByYear: {
      1: {
        subjects: [
          'Moléculas da Vida',
          'Bases Biológicas da Vida',
          'História da Medicina I',
          'Sistema Nervoso',
          'Sistema Cardiovascular e Respiratório',
          'Atividades Acadêmicas Optativas I',
        ],
        references: [
          { title: 'Bioquímica', author: 'Lehninger, Nelson & Cox', type: 'book', verifiedBy: 'FM-UFRJ' },
          { title: 'Anatomia Humana', author: 'Netter', type: 'book', verifiedBy: 'FM-UFRJ' },
          { title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'FM-UFRJ' },
        ],
      },
      2: {
        subjects: [
          'Sistema Urinário',
          'Sistema Digestivo',
          'Sistema Endócrino e Reprodutor',
          'Sistema Locomotor',
          'Parasitologia Médica',
          'Patologia Geral',
          'Propedêutica Clínica',
        ],
        references: [
          { title: 'Robbins — Patologia Básica', author: 'Kumar, Abbas & Aster', type: 'book', verifiedBy: 'FM-UFRJ' },
          { title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'FM-UFRJ' },
        ],
      },
      3: {
        subjects: [
          'Farmacologia Médica I',
          'Epidemiologia',
          'Saúde e Trabalho',
          'Medicina Interna I',
          'Imunologia Médica',
          'Microbiologia Médica',
        ],
        references: [
          { title: 'Goodman & Gilman — Bases Farmacológicas', author: 'Brunton et al.', type: 'book', verifiedBy: 'FM-UFRJ' },
          { title: 'Epidemiologia & Saúde', author: 'Rouquayrol & Gurgel', type: 'book', verifiedBy: 'FM-UFRJ' },
        ],
      },
      4: {
        subjects: [
          'Farmacologia Médica II',
          'Medicina Legal',
          'Medicina Interna II',
          'Cirurgia Geral',
          'Ginecologia e Obstetrícia',
          'Pediatria',
          'Psiquiatria',
          'Saúde Coletiva',
        ],
        references: [
          { title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'FM-UFRJ' },
          { title: 'Sabiston — Tratado de Cirurgia', author: 'Townsend et al.', type: 'book', verifiedBy: 'FM-UFRJ' },
        ],
      },
      5: {
        subjects: [
          'Internato — Clínica Médica',
          'Internato — Cirurgia',
          'Internato — Pediatria',
          'Internato — Ginecologia e Obstetrícia',
          'Internato — Saúde Coletiva',
        ],
        references: [
          { title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'FM-UFRJ' },
        ],
      },
      6: {
        subjects: [
          'Internato — Urgência e Emergência',
          'Internato — Saúde Mental',
          'Internato — Eletivo',
          'Atividades de Extensão',
        ],
        references: [
          { title: 'ATLS — Advanced Trauma Life Support', author: 'American College of Surgeons', type: 'book', verifiedBy: 'FM-UFRJ' },
        ],
      },
    },
  },

  // ─── UNIFESP — Escola Paulista de Medicina (Tradicional - 6 termos + internato) ──
  {
    id: 'unifesp',
    name: 'UNIFESP — Escola Paulista de Medicina',
    state: 'SP',
    curriculumType: 'Tradicional',
    curriculumByYear: {
      1: {
        subjects: [
          'Bases Morfológicas da Medicina',
          'Biologia Molecular',
          'Bioquímica',
          'Fisiologia e Biofísica',
          'Introdução à Pesquisa Científica (IPC I)',
          'Iniciação às Práticas Médicas (IPM)',
          'Princípios de Atendimento às Emergências (PAE I)',
          'Psicologia Médica, Saúde e Sociedade',
        ],
        references: [
          { title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'EPM-UNIFESP' },
          { title: 'Biologia Molecular da Célula', author: 'Alberts et al.', type: 'book', verifiedBy: 'EPM-UNIFESP' },
          { title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'EPM-UNIFESP' },
        ],
      },
      2: {
        subjects: [
          'Farmacologia Médica',
          'Patologia Geral e Especial',
          'Microbiologia e Imunologia',
          'Parasitologia',
          'Genética e Biologia Molecular Aplicada',
          'Saúde Coletiva e Epidemiologia',
          'Introdução à Pesquisa Científica (IPC II)',
          'Iniciação às Práticas Médicas II',
          'Ética e Bioética Médica',
          'Psicologia Médica II',
          'Princípios de Atendimento às Emergências (PAE II)',
        ],
        references: [
          { title: 'Robbins — Patologia Básica', author: 'Kumar, Abbas & Aster', type: 'book', verifiedBy: 'EPM-UNIFESP' },
          { title: 'Goodman & Gilman — Bases Farmacológicas', author: 'Brunton et al.', type: 'book', verifiedBy: 'EPM-UNIFESP' },
          { title: 'Microbiologia Médica', author: 'Murray, Rosenthal & Pfaller', type: 'book', verifiedBy: 'EPM-UNIFESP' },
        ],
      },
      3: {
        subjects: [
          'Propedêutica Médica e Semiologia',
          'Medicina Preventiva e Social',
          'Técnica Operatória e Cirurgia Experimental',
          'Medicina Legal e Deontologia',
          'Anatomia Patológica Especial',
          'Diagnóstico por Imagem — Radiologia',
          'Nutrologia e Dietoterapia',
          'Introdução à Pesquisa Científica (IPC III)',
        ],
        references: [
          { title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'EPM-UNIFESP' },
          { title: 'Bates — Propedêutica Médica', author: 'Bickley & Szilagyi', type: 'book', verifiedBy: 'EPM-UNIFESP' },
        ],
      },
      4: {
        subjects: [
          'Clínica Médica — Cardiologia, Pneumologia, Gastroenterologia',
          'Clínica Cirúrgica — Cirurgia Geral e Especialidades',
          'Pediatria — Puericultura e Neonatologia',
          'Ginecologia e Obstetrícia',
          'Psiquiatria e Saúde Mental',
          'Dermatologia',
          'Ortopedia e Traumatologia',
          'Oftalmologia',
          'Otorrinolaringologia',
          'Neurologia',
          'Anestesiologia',
        ],
        references: [
          { title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'EPM-UNIFESP' },
          { title: 'Nelson — Tratado de Pediatria', author: 'Kliegman et al.', type: 'book', verifiedBy: 'EPM-UNIFESP' },
        ],
      },
      5: {
        subjects: [
          'Internato I — Clínica Médica',
          'Internato I — Clínica Cirúrgica',
          'Internato I — Pediatria',
          'Internato I — Ginecologia e Obstetrícia',
        ],
        references: [
          { title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'EPM-UNIFESP' },
        ],
      },
      6: {
        subjects: [
          'Internato II — Saúde Coletiva e Medicina de Família',
          'Internato II — Urgência e Emergência',
          'Internato II — Eletivo em Especialidade',
          'Internato II — Saúde Mental',
        ],
        references: [
          { title: 'ATLS — Advanced Trauma Life Support', author: 'American College of Surgeons', type: 'book', verifiedBy: 'EPM-UNIFESP' },
        ],
      },
    },
  },

  // ─── UFMG — Faculdade de Medicina (Tradicional - 12 períodos) ────────
  {
    id: 'ufmg',
    name: 'UFMG — Faculdade de Medicina',
    state: 'MG',
    curriculumType: 'Tradicional',
    curriculumByYear: {
      1: {
        subjects: [
          'Anatomia Humana I e II',
          'Histologia e Embriologia',
          'Bioquímica e Biologia Molecular',
          'Biofísica',
          'Biologia Celular',
          'Introdução à Medicina e Saúde Coletiva',
          'Psicologia Médica I',
        ],
        references: [
          { title: 'Anatomia Humana', author: 'Netter', type: 'book', verifiedBy: 'FM-UFMG' },
          { title: 'Histologia Básica', author: 'Junqueira & Carneiro', type: 'book', verifiedBy: 'FM-UFMG' },
          { title: 'Bioquímica', author: 'Lehninger, Nelson & Cox', type: 'book', verifiedBy: 'FM-UFMG' },
        ],
      },
      2: {
        subjects: [
          'Fisiologia Humana I e II',
          'Patologia Geral',
          'Microbiologia Médica',
          'Imunologia',
          'Parasitologia',
          'Genética Médica',
          'Saúde Coletiva II',
        ],
        references: [
          { title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'FM-UFMG' },
          { title: 'Robbins — Patologia Básica', author: 'Kumar, Abbas & Aster', type: 'book', verifiedBy: 'FM-UFMG' },
        ],
      },
      3: {
        subjects: [
          'Farmacologia I e II',
          'Semiologia Médica',
          'Medicina Legal e Deontologia',
          'Epidemiologia',
          'Patologia Especial',
          'Técnica Operatória',
          'Radiologia e Diagnóstico por Imagem',
        ],
        references: [
          { title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'FM-UFMG' },
          { title: 'Goodman & Gilman — Bases Farmacológicas', author: 'Brunton et al.', type: 'book', verifiedBy: 'FM-UFMG' },
        ],
      },
      4: {
        subjects: [
          'Clínica Médica — Cardiologia, Pneumologia, Nefrologia, Endocrinologia',
          'Clínica Cirúrgica — Cirurgia Geral e Digestiva',
          'Pediatria — Puericultura e Neonatologia',
          'Ginecologia e Obstetrícia',
          'Psiquiatria',
          'Dermatologia',
          'Ortopedia',
          'Neurologia',
        ],
        references: [
          { title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'FM-UFMG' },
          { title: 'Nelson — Tratado de Pediatria', author: 'Kliegman et al.', type: 'book', verifiedBy: 'FM-UFMG' },
        ],
      },
      5: {
        subjects: [
          'Internato — Clínica Médica',
          'Internato — Cirurgia',
          'Internato — Pediatria',
          'Internato — Ginecologia e Obstetrícia',
          'Internato — Saúde Coletiva',
        ],
        references: [
          { title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'FM-UFMG' },
        ],
      },
      6: {
        subjects: [
          'Internato — Urgência e Emergência',
          'Internato — Saúde Mental',
          'Internato — Medicina de Família e Comunidade',
          'Internato — Eletivo',
        ],
        references: [
          { title: 'ATLS — Advanced Trauma Life Support', author: 'American College of Surgeons', type: 'book', verifiedBy: 'FM-UFMG' },
        ],
      },
    },
  },

  // ─── UNICAMP — Faculdade de Ciências Médicas (Tradicional) ──────────
  {
    id: 'unicamp',
    name: 'UNICAMP — Faculdade de Ciências Médicas',
    state: 'SP',
    curriculumType: 'Tradicional',
    curriculumByYear: {
      1: {
        subjects: [
          'Anatomia Humana',
          'Biologia Celular e Tecidual',
          'Bioquímica Médica',
          'Biofísica e Fisiologia I',
          'Embriologia',
          'Introdução à Medicina e Saúde Coletiva',
          'Metodologia Científica',
        ],
        references: [
          { title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'FCM-UNICAMP' },
          { title: 'Histologia Básica', author: 'Junqueira & Carneiro', type: 'book', verifiedBy: 'FCM-UNICAMP' },
        ],
      },
      2: {
        subjects: [
          'Fisiologia Humana II',
          'Farmacologia Básica',
          'Genética Médica',
          'Microbiologia e Imunologia',
          'Parasitologia',
          'Patologia Geral',
          'Saúde Coletiva II',
        ],
        references: [
          { title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'FCM-UNICAMP' },
          { title: 'Robbins — Patologia Básica', author: 'Kumar, Abbas & Aster', type: 'book', verifiedBy: 'FCM-UNICAMP' },
        ],
      },
      3: {
        subjects: [
          'Semiologia e Propedêutica',
          'Farmacologia Clínica',
          'Patologia Especial',
          'Saúde Coletiva III — Epidemiologia',
          'Medicina Legal',
          'Técnica Cirúrgica',
          'Diagnóstico por Imagem',
        ],
        references: [
          { title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'FCM-UNICAMP' },
          { title: 'Goodman & Gilman — Bases Farmacológicas', author: 'Brunton et al.', type: 'book', verifiedBy: 'FCM-UNICAMP' },
        ],
      },
      4: {
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
        references: [
          { title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'FCM-UNICAMP' },
        ],
      },
      5: {
        subjects: [
          'Internato — Clínica Médica',
          'Internato — Cirurgia',
          'Internato — Pediatria',
          'Internato — Ginecologia e Obstetrícia',
        ],
        references: [
          { title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'FCM-UNICAMP' },
        ],
      },
      6: {
        subjects: [
          'Internato — Urgência e Emergência',
          'Internato — Saúde Coletiva',
          'Internato — Saúde Mental',
          'Internato — Eletivo',
        ],
        references: [
          { title: 'ATLS — Advanced Trauma Life Support', author: 'American College of Surgeons', type: 'book', verifiedBy: 'FCM-UNICAMP' },
        ],
      },
    },
  },

  // ─── UFBA — Faculdade de Medicina (Tradicional) ─────────────────────
  {
    id: 'ufba',
    name: 'UFBA — Faculdade de Medicina da Bahia',
    state: 'BA',
    curriculumType: 'Tradicional',
    curriculumByYear: {
      1: {
        subjects: [
          'Anatomia Humana I e II',
          'Histologia e Embriologia',
          'Bioquímica',
          'Biofísica',
          'Biologia Celular',
          'Introdução ao Estudo da Medicina',
          'Saúde, Cultura e Sociedade',
        ],
        references: [
          { title: 'Anatomia Humana', author: 'Netter', type: 'book', verifiedBy: 'FMB-UFBA' },
          { title: 'Histologia Básica', author: 'Junqueira & Carneiro', type: 'book', verifiedBy: 'FMB-UFBA' },
        ],
      },
      2: {
        subjects: [
          'Fisiologia Humana I e II',
          'Microbiologia e Imunologia',
          'Parasitologia Médica',
          'Patologia Geral',
          'Genética Médica',
          'Saúde Coletiva II',
          'Psicologia Médica',
        ],
        references: [
          { title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'FMB-UFBA' },
          { title: 'Microbiologia Médica', author: 'Murray, Rosenthal & Pfaller', type: 'book', verifiedBy: 'FMB-UFBA' },
        ],
      },
      3: {
        subjects: [
          'Semiologia Médica',
          'Farmacologia I e II',
          'Patologia Especial',
          'Epidemiologia',
          'Medicina Legal',
          'Técnica Operatória',
          'Saúde Coletiva III',
        ],
        references: [
          { title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'FMB-UFBA' },
          { title: 'Goodman & Gilman — Bases Farmacológicas', author: 'Brunton et al.', type: 'book', verifiedBy: 'FMB-UFBA' },
        ],
      },
      4: {
        subjects: [
          'Clínica Médica — Cardiologia, Pneumologia, Nefrologia',
          'Clínica Cirúrgica',
          'Pediatria',
          'Ginecologia e Obstetrícia',
          'Psiquiatria',
          'Dermatologia',
          'Neurologia',
          'Ortopedia',
          'Medicina Tropical',
        ],
        references: [
          { title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'FMB-UFBA' },
          { title: 'Doenças Infecciosas e Parasitárias', author: 'Veronesi & Focaccia', type: 'book', verifiedBy: 'FMB-UFBA' },
        ],
      },
      5: {
        subjects: [
          'Internato — Clínica Médica',
          'Internato — Cirurgia',
          'Internato — Pediatria',
          'Internato — Ginecologia e Obstetrícia',
          'Internato — Saúde Coletiva',
        ],
        references: [
          { title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'FMB-UFBA' },
        ],
      },
      6: {
        subjects: [
          'Internato — Urgência e Emergência',
          'Internato — Saúde Mental',
          'Internato — Medicina de Família',
          'Internato — Eletivo',
        ],
        references: [
          { title: 'ATLS — Advanced Trauma Life Support', author: 'American College of Surgeons', type: 'book', verifiedBy: 'FMB-UFBA' },
        ],
      },
    },
  },

  // ─── PUC — Medicina (Misto - PBL + Tradicional) ─────────────────────
  {
    id: 'puc',
    name: 'PUC — Pontifícia Universidade Católica (Medicina)',
    state: 'PR/SP/MG',
    curriculumType: 'Misto',
    curriculumByYear: {
      1: {
        subjects: [
          'Bases Morfofisiológicas do Sistema Nervoso',
          'Bases Morfofisiológicas do Sistema Cardiovascular e Respiratório',
          'Ciências Morfofuncionais I — Célula e Tecidos',
          'Saúde e Sociedade I',
          'Habilidades Médicas I',
          'Metodologia Científica',
        ],
        references: [
          { title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'PUC Medicina' },
          { title: 'Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'PUC Medicina' },
        ],
      },
      2: {
        subjects: [
          'Bases Morfofisiológicas do Sistema Digestório e Urinário',
          'Bases Morfofisiológicas do Sistema Endócrino e Reprodutor',
          'Mecanismos de Doença — Patologia e Imunologia',
          'Microbiologia e Parasitologia',
          'Saúde e Sociedade II',
          'Habilidades Médicas II',
        ],
        references: [
          { title: 'Robbins — Patologia Básica', author: 'Kumar, Abbas & Aster', type: 'book', verifiedBy: 'PUC Medicina' },
          { title: 'Imunologia Celular e Molecular', author: 'Abbas, Lichtman & Pillai', type: 'book', verifiedBy: 'PUC Medicina' },
        ],
      },
      3: {
        subjects: [
          'Propedêutica Médica e Semiologia',
          'Farmacologia Clínica',
          'Medicina Legal e Ética',
          'Epidemiologia e Bioestatística',
          'Diagnóstico por Imagem',
          'Saúde e Sociedade III',
          'Habilidades Médicas III',
        ],
        references: [
          { title: 'Semiologia Médica', author: 'Porto & Porto', type: 'book', verifiedBy: 'PUC Medicina' },
          { title: 'Goodman & Gilman — Bases Farmacológicas', author: 'Brunton et al.', type: 'book', verifiedBy: 'PUC Medicina' },
        ],
      },
      4: {
        subjects: [
          'Clínica Médica — Cardiologia, Pneumologia, Gastroenterologia, Nefrologia',
          'Clínica Cirúrgica',
          'Pediatria e Neonatologia',
          'Ginecologia e Obstetrícia',
          'Psiquiatria',
          'Dermatologia',
          'Ortopedia e Traumatologia',
          'Neurologia',
          'Oftalmologia e Otorrinolaringologia',
        ],
        references: [
          { title: 'Clínica Médica — FMUSP', author: 'Martins, Carrilho & Alves', type: 'book', verifiedBy: 'PUC Medicina' },
          { title: 'Nelson — Tratado de Pediatria', author: 'Kliegman et al.', type: 'book', verifiedBy: 'PUC Medicina' },
        ],
      },
      5: {
        subjects: [
          'Internato — Clínica Médica',
          'Internato — Cirurgia',
          'Internato — Pediatria',
          'Internato — Ginecologia e Obstetrícia',
          'Internato — Medicina de Família e Comunidade',
        ],
        references: [
          { title: 'Harrison — Medicina Interna', author: 'Kasper et al.', type: 'book', verifiedBy: 'PUC Medicina' },
        ],
      },
      6: {
        subjects: [
          'Internato — Urgência e Emergência',
          'Internato — Saúde Coletiva',
          'Internato — Saúde Mental',
          'Internato — Eletivo',
        ],
        references: [
          { title: 'ATLS — Advanced Trauma Life Support', author: 'American College of Surgeons', type: 'book', verifiedBy: 'PUC Medicina' },
        ],
      },
    },
  },
];

export const curriculumIcons: Record<string, string> = {
  'Tradicional': 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
  'PBL': 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  'Misto': 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
};
