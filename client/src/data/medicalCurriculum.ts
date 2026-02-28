/**
 * Currículo Completo do Curso de Medicina (6 anos)
 * Baseado nas Diretrizes Curriculares Nacionais (DCN) do MEC
 * e nos currículos da USP, UNICAMP, UNIFESP e UFMG
 */

export interface CurriculumModule {
  id: string;
  year: number;
  semester: number;
  name: string;
  category: 'basica' | 'clinica' | 'internato' | 'complementar';
  hours: number;
  description: string;
  topics: string[];
  references: string[];
  videoSuggestions?: string[];
}

export const MEDICAL_CURRICULUM: CurriculumModule[] = [
  // ═══════════════════════════════════════════════════════════
  // 1º ANO — CIÊNCIAS BÁSICAS
  // ═══════════════════════════════════════════════════════════
  {
    id: 'y1s1-anatomia', year: 1, semester: 1, name: 'Anatomia Humana I', category: 'basica', hours: 120,
    description: 'Estudo macroscópico do corpo humano: sistema locomotor (ossos, articulações, músculos), sistema cardiovascular e sistema respiratório.',
    topics: ['Introdução à anatomia e terminologia', 'Osteologia: esqueleto axial e apendicular', 'Artrologia: classificação das articulações', 'Miologia: músculos da cabeça, pescoço e tronco', 'Miologia: músculos dos membros superiores e inferiores', 'Sistema cardiovascular: coração e grandes vasos', 'Sistema respiratório: vias aéreas e pulmões', 'Anatomia de superfície e palpação', 'Anatomia radiológica básica', 'Dissecção cadavérica'],
    references: ['Gray\'s Anatomy for Students - Drake et al.', 'Netter Atlas de Anatomia Humana', 'Moore - Anatomia Orientada para a Clínica', 'Sobotta - Atlas de Anatomia Humana'],
  },
  {
    id: 'y1s1-histologia', year: 1, semester: 1, name: 'Histologia e Biologia Celular', category: 'basica', hours: 90,
    description: 'Estudo microscópico dos tecidos fundamentais e organelas celulares. Técnicas histológicas e microscopia.',
    topics: ['Técnicas histológicas e microscopia', 'Membrana plasmática e citoesqueleto', 'Organelas celulares', 'Núcleo e ciclo celular', 'Tecido epitelial de revestimento e glandular', 'Tecido conjuntivo propriamente dito', 'Tecido cartilaginoso e ósseo', 'Tecido muscular (liso, estriado, cardíaco)', 'Tecido nervoso', 'Sangue e hematopoiese'],
    references: ['Junqueira - Histologia Básica', 'Ross - Histologia: Texto e Atlas', 'Alberts - Biologia Molecular da Célula'],
  },
  {
    id: 'y1s1-bioquimica', year: 1, semester: 1, name: 'Bioquímica Médica', category: 'basica', hours: 90,
    description: 'Estudo das biomoléculas, enzimas, metabolismo energético e integração metabólica.',
    topics: ['Aminoácidos e proteínas', 'Enzimas e cinética enzimática', 'Carboidratos e glicólise', 'Ciclo de Krebs e cadeia respiratória', 'Metabolismo de lipídios e beta-oxidação', 'Metabolismo de aminoácidos e ciclo da ureia', 'Gliconeogênese e metabolismo do glicogênio', 'Integração metabólica (jejum vs alimentado)', 'Vitaminas e cofatores', 'Bioquímica clínica: marcadores laboratoriais'],
    references: ['Lehninger - Princípios de Bioquímica', 'Stryer - Bioquímica', 'Marzzoco - Bioquímica Básica', 'Harper - Bioquímica Ilustrada'],
  },
  {
    id: 'y1s1-biofisica', year: 1, semester: 1, name: 'Biofísica', category: 'basica', hours: 60,
    description: 'Princípios físicos aplicados à medicina: bioeletricidade, biomecânica, radiação e métodos diagnósticos por imagem.',
    topics: ['Bioeletricidade e potencial de membrana', 'Potencial de ação e condução nervosa', 'Biomecânica e ergonomia', 'Hemodinâmica e lei de Poiseuille', 'Mecânica respiratória', 'Acústica e audiometria', 'Óptica e refração', 'Radiação ionizante e proteção radiológica', 'Princípios de ultrassonografia', 'Princípios de ressonância magnética'],
    references: ['Heneine - Biofísica Básica', 'Duran - Biofísica: Fundamentos e Aplicações'],
  },
  {
    id: 'y1s2-anatomia2', year: 1, semester: 2, name: 'Anatomia Humana II', category: 'basica', hours: 120,
    description: 'Sistemas digestório, urinário, reprodutor, nervoso e endócrino. Anatomia topográfica e seccional.',
    topics: ['Sistema digestório: tubo digestivo e glândulas anexas', 'Sistema urinário: rins, ureteres, bexiga, uretra', 'Sistema reprodutor masculino', 'Sistema reprodutor feminino', 'Sistema nervoso central: encéfalo e medula', 'Sistema nervoso periférico: nervos e plexos', 'Sistema endócrino: glândulas', 'Órgãos dos sentidos', 'Anatomia topográfica do abdome e pelve', 'Anatomia seccional (TC e RM)'],
    references: ['Gray\'s Anatomy for Students', 'Netter Atlas de Anatomia Humana', 'Machado - Neuroanatomia Funcional'],
  },
  {
    id: 'y1s2-embriologia', year: 1, semester: 2, name: 'Embriologia Médica', category: 'basica', hours: 60,
    description: 'Desenvolvimento embrionário e fetal humano. Malformações congênitas e teratologia.',
    topics: ['Gametogênese e fecundação', 'Primeira semana: clivagem e implantação', 'Segunda semana: disco bilaminar', 'Terceira semana: gastrulação e neurulação', 'Quarta a oitava semana: organogênese', 'Desenvolvimento do sistema cardiovascular', 'Desenvolvimento do sistema nervoso', 'Desenvolvimento do sistema urogenital', 'Placenta e membranas fetais', 'Malformações congênitas e teratogênese'],
    references: ['Moore - Embriologia Clínica', 'Langman - Embriologia Médica', 'Sadler - Langman Embriologia Médica'],
  },
  {
    id: 'y1s2-genetica', year: 1, semester: 2, name: 'Genética Médica', category: 'basica', hours: 60,
    description: 'Princípios de genética humana, padrões de herança, citogenética, genética molecular e aconselhamento genético.',
    topics: ['Estrutura e função do DNA e RNA', 'Replicação, transcrição e tradução', 'Mutações e reparo do DNA', 'Herança mendeliana e extensões', 'Herança ligada ao X e mitocondrial', 'Citogenética: cariótipo e anomalias cromossômicas', 'Genética molecular: PCR, sequenciamento, CRISPR', 'Herança multifatorial e poligênica', 'Genética do câncer: oncogenes e supressores tumorais', 'Aconselhamento genético e diagnóstico pré-natal'],
    references: ['Thompson & Thompson - Genética Médica', 'Nussbaum - Genética Médica', 'Griffiths - Introdução à Genética'],
  },

  // ═══════════════════════════════════════════════════════════
  // 2º ANO — CIÊNCIAS BÁSICAS AVANÇADAS
  // ═══════════════════════════════════════════════════════════
  {
    id: 'y2s1-fisiologia1', year: 2, semester: 1, name: 'Fisiologia Humana I', category: 'basica', hours: 120,
    description: 'Fisiologia dos sistemas cardiovascular, respiratório, renal e digestório.',
    topics: ['Fisiologia celular: transporte e sinalização', 'Fisiologia cardiovascular: ciclo cardíaco, DC, PA', 'Eletrofisiologia cardíaca e ECG', 'Regulação da pressão arterial', 'Mecânica respiratória e ventilação', 'Trocas gasosas e transporte de O2/CO2', 'Controle da respiração', 'Filtração glomerular e função tubular', 'Equilíbrio ácido-base', 'Motilidade e secreção gastrointestinal'],
    references: ['Guyton - Tratado de Fisiologia Médica', 'Berne & Levy - Fisiologia', 'Costanzo - Fisiologia'],
  },
  {
    id: 'y2s1-fisiologia2', year: 2, semester: 2, name: 'Fisiologia Humana II', category: 'basica', hours: 120,
    description: 'Fisiologia dos sistemas nervoso, endócrino, reprodutor e musculoesquelético.',
    topics: ['Neurofisiologia: potencial de ação e sinapse', 'Fisiologia sensorial: dor, tato, visão, audição', 'Sistema nervoso autônomo', 'Fisiologia muscular: contração e fadiga', 'Eixo hipotálamo-hipófise', 'Tireoide e paratireoide', 'Suprarrenal: cortisol e catecolaminas', 'Pâncreas endócrino: insulina e glucagon', 'Fisiologia reprodutiva masculina', 'Fisiologia reprodutiva feminina e ciclo menstrual'],
    references: ['Guyton - Tratado de Fisiologia Médica', 'Kandel - Princípios de Neurociências'],
  },
  {
    id: 'y2s1-microbiologia', year: 2, semester: 1, name: 'Microbiologia Médica', category: 'basica', hours: 90,
    description: 'Bacteriologia, virologia, micologia e parasitologia médicas. Mecanismos de patogenicidade e diagnóstico laboratorial.',
    topics: ['Estrutura e classificação bacteriana', 'Cocos Gram-positivos: Staphylococcus, Streptococcus', 'Bacilos Gram-negativos: Enterobactérias, Pseudomonas', 'Micobactérias: tuberculose e hanseníase', 'Virologia geral: replicação viral', 'Vírus respiratórios: Influenza, SARS-CoV-2', 'HIV e hepatites virais', 'Micologia: Candida, Aspergillus, dermatófitos', 'Parasitologia: protozoários e helmintos', 'Diagnóstico microbiológico: culturas e PCR'],
    references: ['Murray - Microbiologia Médica', 'Levinson - Microbiologia Médica e Imunologia', 'Neves - Parasitologia Humana'],
  },
  {
    id: 'y2s1-imunologia', year: 2, semester: 1, name: 'Imunologia Médica', category: 'basica', hours: 60,
    description: 'Sistema imunológico: imunidade inata e adaptativa, hipersensibilidade, autoimunidade e imunodeficiências.',
    topics: ['Imunidade inata: barreiras, fagócitos, complemento', 'Imunidade adaptativa: linfócitos T e B', 'Apresentação de antígenos: MHC I e II', 'Imunoglobulinas: estrutura e funções', 'Resposta imune humoral e celular', 'Hipersensibilidade tipos I-IV', 'Autoimunidade: lúpus, AR, DM1', 'Imunodeficiências primárias e secundárias', 'Transplantes e rejeição', 'Vacinação e imunoterapia'],
    references: ['Abbas - Imunologia Celular e Molecular', 'Janeway - Imunobiologia'],
  },
  {
    id: 'y2s2-farmacologia1', year: 2, semester: 2, name: 'Farmacologia I', category: 'basica', hours: 90,
    description: 'Princípios de farmacocinética, farmacodinâmica e farmacologia do sistema nervoso autônomo e cardiovascular.',
    topics: ['Farmacocinética: absorção, distribuição, metabolismo, excreção', 'Farmacodinâmica: receptores e mecanismos de ação', 'Farmacologia colinérgica e anticolinérgica', 'Farmacologia adrenérgica e antiadrenérgica', 'Anti-hipertensivos: IECA, BRA, BCC, diuréticos', 'Antiarrítmicos', 'Anticoagulantes e antiplaquetários', 'Hipolipemiantes: estatinas e fibratos', 'Inotrópicos e vasodilatadores', 'Farmacologia da dor: AINEs e opioides'],
    references: ['Goodman & Gilman - Bases Farmacológicas da Terapêutica', 'Rang & Dale - Farmacologia', 'Katzung - Farmacologia Básica e Clínica'],
  },
  {
    id: 'y2s2-patologia1', year: 2, semester: 2, name: 'Patologia Geral', category: 'basica', hours: 90,
    description: 'Processos patológicos fundamentais: lesão celular, inflamação, reparo, distúrbios hemodinâmicos e neoplasias.',
    topics: ['Lesão e morte celular: necrose e apoptose', 'Adaptações celulares: hipertrofia, hiperplasia, atrofia, metaplasia', 'Inflamação aguda: mediadores e eventos vasculares', 'Inflamação crônica e granulomatosa', 'Reparo tecidual: regeneração e cicatrização', 'Distúrbios hemodinâmicos: edema, hemorragia, trombose', 'Embolia e infarto', 'Choque', 'Neoplasias: nomenclatura e classificação', 'Carcinogênese e biologia tumoral'],
    references: ['Robbins - Patologia Básica', 'Bogliolo - Patologia Geral', 'Kumar - Robbins & Cotran Patologia'],
  },

  // ═══════════════════════════════════════════════════════════
  // 3º ANO — TRANSIÇÃO BÁSICO-CLÍNICA
  // ═══════════════════════════════════════════════════════════
  {
    id: 'y3s1-semiologia', year: 3, semester: 1, name: 'Semiologia Médica', category: 'clinica', hours: 180,
    description: 'Anamnese, exame físico completo, raciocínio clínico e propedêutica dos sistemas.',
    topics: ['Relação médico-paciente e comunicação', 'Anamnese: HDA, HMP, HF, HS, RS', 'Exame físico geral: sinais vitais, estado geral', 'Semiologia da cabeça e pescoço', 'Semiologia cardiovascular: inspeção, palpação, ausculta', 'Semiologia respiratória: percussão, ausculta', 'Semiologia abdominal', 'Semiologia neurológica', 'Semiologia osteoarticular', 'Raciocínio clínico e diagnóstico diferencial'],
    references: ['Porto - Semiologia Médica', 'Bates - Propedêutica Médica', 'Rocco - Semiologia Médica'],
  },
  {
    id: 'y3s1-patologia2', year: 3, semester: 1, name: 'Patologia Especial', category: 'clinica', hours: 120,
    description: 'Patologia dos sistemas: cardiovascular, respiratório, digestório, urinário, endócrino, nervoso e hematológico.',
    topics: ['Aterosclerose e doença coronariana', 'Valvopatias e cardiomiopatias', 'Pneumonias e DPOC', 'Neoplasias pulmonares', 'Doenças do esôfago, estômago e intestino', 'Hepatopatias e cirrose', 'Glomerulopatias e nefropatias', 'Doenças da tireoide e diabetes', 'Anemias e leucemias', 'Neuropatologia: AVC e demências'],
    references: ['Robbins - Patologia Básica', 'Bogliolo - Patologia'],
  },
  {
    id: 'y3s1-farmacologia2', year: 3, semester: 2, name: 'Farmacologia II', category: 'clinica', hours: 90,
    description: 'Farmacologia dos antimicrobianos, quimioterápicos, SNC, endócrino e autacoides.',
    topics: ['Antibióticos: beta-lactâmicos, macrolídeos, quinolonas', 'Antifúngicos e antivirais', 'Antiparasitários', 'Quimioterapia antineoplásica', 'Ansiolíticos e hipnóticos: benzodiazepínicos', 'Antidepressivos: ISRS, tricíclicos, IRSN', 'Antipsicóticos: típicos e atípicos', 'Antiepilépticos', 'Corticosteroides e imunossupressores', 'Anti-histamínicos e antiasmáticos'],
    references: ['Goodman & Gilman', 'Rang & Dale - Farmacologia'],
  },
  {
    id: 'y3s2-epidemiologia', year: 3, semester: 2, name: 'Epidemiologia e Saúde Coletiva', category: 'clinica', hours: 90,
    description: 'Métodos epidemiológicos, vigilância em saúde, SUS, atenção primária e saúde da família.',
    topics: ['Conceitos básicos de epidemiologia', 'Medidas de frequência: incidência e prevalência', 'Estudos epidemiológicos: coorte, caso-controle, transversal', 'Testes diagnósticos: sensibilidade e especificidade', 'Vigilância epidemiológica e doenças de notificação', 'Sistema Único de Saúde (SUS): princípios e organização', 'Atenção Primária à Saúde e ESF', 'Políticas de saúde no Brasil', 'Bioestatística aplicada', 'Medicina baseada em evidências'],
    references: ['Medronho - Epidemiologia', 'Rouquayrol - Epidemiologia & Saúde', 'Fletcher - Epidemiologia Clínica'],
  },

  // ═══════════════════════════════════════════════════════════
  // 4º ANO — CLÍNICA
  // ═══════════════════════════════════════════════════════════
  {
    id: 'y4s1-clinicamedica', year: 4, semester: 1, name: 'Clínica Médica I', category: 'clinica', hours: 180,
    description: 'Cardiologia, pneumologia, nefrologia e reumatologia clínicas.',
    topics: ['Hipertensão arterial sistêmica', 'Insuficiência cardíaca', 'Síndromes coronarianas agudas', 'Arritmias cardíacas', 'Asma e DPOC', 'Pneumonias e tuberculose', 'Insuficiência renal aguda e crônica', 'Distúrbios hidroeletrolíticos', 'Artrite reumatoide e lúpus', 'Vasculites e espondiloartrites'],
    references: ['Harrison - Medicina Interna', 'Cecil - Tratado de Medicina Interna', 'Current Medical Diagnosis & Treatment'],
  },
  {
    id: 'y4s1-cirurgia', year: 4, semester: 1, name: 'Clínica Cirúrgica I', category: 'clinica', hours: 120,
    description: 'Princípios de cirurgia, trauma, cirurgia do aparelho digestivo e hérnias.',
    topics: ['Resposta metabólica ao trauma', 'Cicatrização e infecção cirúrgica', 'Pré e pós-operatório', 'Abdome agudo: diagnóstico diferencial', 'Apendicite e colecistite aguda', 'Obstrução intestinal', 'Hérnias inguinais e incisionais', 'Trauma: ATLS e abordagem inicial', 'Cirurgia do esôfago e estômago', 'Cirurgia colorretal'],
    references: ['Sabiston - Tratado de Cirurgia', 'Schwartz - Princípios de Cirurgia', 'ATLS - Advanced Trauma Life Support'],
  },
  {
    id: 'y4s2-pediatria', year: 4, semester: 2, name: 'Pediatria', category: 'clinica', hours: 120,
    description: 'Puericultura, doenças prevalentes na infância, neonatologia e urgências pediátricas.',
    topics: ['Crescimento e desenvolvimento infantil', 'Aleitamento materno e nutrição', 'Calendário vacinal', 'Infecções respiratórias agudas', 'Doenças exantemáticas', 'Diarreia aguda e desidratação', 'Infecção urinária na infância', 'Neonatologia: RN a termo e prematuro', 'Icterícia neonatal', 'Urgências pediátricas: convulsão febril, bronquiolite'],
    references: ['Nelson - Tratado de Pediatria', 'Marcondes - Pediatria Básica', 'SBP - Tratado de Pediatria'],
  },
  {
    id: 'y4s2-ginecologia', year: 4, semester: 2, name: 'Ginecologia e Obstetrícia', category: 'clinica', hours: 120,
    description: 'Saúde da mulher, pré-natal, parto, puerpério, patologias ginecológicas e planejamento familiar.',
    topics: ['Ciclo menstrual e distúrbios menstruais', 'Planejamento familiar e contracepção', 'Infecções sexualmente transmissíveis', 'Câncer de colo uterino e mama', 'Endometriose e miomas', 'Pré-natal: consultas e exames', 'Trabalho de parto e assistência ao parto', 'Síndromes hipertensivas na gestação', 'Diabetes gestacional', 'Hemorragias da gestação e puerpério'],
    references: ['Williams - Obstetrícia', 'Berek & Novak - Ginecologia', 'Zugaib - Obstetrícia'],
  },

  // ═══════════════════════════════════════════════════════════
  // 5º ANO — CLÍNICA AVANÇADA
  // ═══════════════════════════════════════════════════════════
  {
    id: 'y5s1-clinicamedica2', year: 5, semester: 1, name: 'Clínica Médica II', category: 'clinica', hours: 180,
    description: 'Endocrinologia, gastroenterologia, hematologia, infectologia e neurologia clínicas.',
    topics: ['Diabetes mellitus tipos 1 e 2', 'Doenças da tireoide: hipo e hipertireoidismo', 'Hepatites virais e cirrose hepática', 'Doença inflamatória intestinal', 'Anemias: ferropriva, megaloblástica, hemolítica', 'Leucemias e linfomas', 'HIV/AIDS e infecções oportunistas', 'Dengue, malária e leishmaniose', 'AVC isquêmico e hemorrágico', 'Epilepsia e cefaléias'],
    references: ['Harrison - Medicina Interna', 'Cecil - Tratado de Medicina Interna'],
  },
  {
    id: 'y5s1-psiquiatria', year: 5, semester: 1, name: 'Psiquiatria', category: 'clinica', hours: 90,
    description: 'Transtornos mentais, psicofarmacologia e abordagem do paciente psiquiátrico.',
    topics: ['Entrevista psiquiátrica e exame do estado mental', 'Transtornos de ansiedade: TAG, pânico, fobias', 'Transtorno depressivo maior', 'Transtorno bipolar', 'Esquizofrenia e transtornos psicóticos', 'Transtornos de personalidade', 'Transtornos alimentares', 'Dependência química: álcool e drogas', 'Psicofarmacologia: antidepressivos, ansiolíticos, antipsicóticos', 'Urgências psiquiátricas e risco de suicídio'],
    references: ['Kaplan & Sadock - Compêndio de Psiquiatria', 'Stahl - Psicofarmacologia'],
  },
  {
    id: 'y5s2-especialidades', year: 5, semester: 2, name: 'Especialidades Clínicas', category: 'clinica', hours: 180,
    description: 'Dermatologia, oftalmologia, otorrinolaringologia, ortopedia e urologia.',
    topics: ['Dermatologia: dermatites, psoríase, infecções cutâneas', 'Câncer de pele: melanoma e não-melanoma', 'Oftalmologia: glaucoma, catarata, retinopatia', 'Otorrinolaringologia: otite, sinusite, amigdalite', 'Ortopedia: fraturas, luxações, lombalgia', 'Ortopedia pediátrica: displasia do quadril, escoliose', 'Urologia: litíase renal, HPB, câncer de próstata', 'Medicina de emergência: PCR e ACLS', 'Medicina intensiva: ventilação mecânica, sepse', 'Geriatria: síndromes geriátricas'],
    references: ['Azulay - Dermatologia', 'Kanski - Oftalmologia Clínica', 'Hungria - Otorrinolaringologia', 'Barros Filho - Ortopedia e Traumatologia'],
  },

  // ═══════════════════════════════════════════════════════════
  // 5º-6º ANO — INTERNATO
  // ═══════════════════════════════════════════════════════════
  {
    id: 'y5-internato-cm', year: 5, semester: 2, name: 'Internato: Clínica Médica', category: 'internato', hours: 480,
    description: 'Estágio supervisionado em enfermarias, ambulatórios e pronto-socorro de clínica médica.',
    topics: ['Manejo de pacientes internados', 'Prescrição médica hospitalar', 'Interpretação de exames laboratoriais', 'Interpretação de ECG', 'Interpretação de radiografias', 'Procedimentos: punção venosa, gasometria, paracentese', 'Discussão de casos clínicos', 'Visita à beira do leito', 'Plantões em pronto-socorro', 'Cuidados paliativos'],
    references: ['Harrison - Medicina Interna', 'UpToDate', 'Whitebook - Decisão Clínica'],
  },
  {
    id: 'y6-internato-cirurgia', year: 6, semester: 1, name: 'Internato: Cirurgia', category: 'internato', hours: 480,
    description: 'Estágio supervisionado em cirurgia geral, centro cirúrgico e trauma.',
    topics: ['Avaliação pré-operatória', 'Técnica cirúrgica básica: suturas e nós', 'Assistência em cirurgias', 'Atendimento ao politraumatizado (ATLS)', 'Cirurgia do trauma: laparotomia, toracotomia', 'Cirurgia ambulatorial: pequenas cirurgias', 'Drenagem de abscessos', 'Cuidados pós-operatórios', 'Complicações cirúrgicas', 'Ética e comunicação em cirurgia'],
    references: ['Sabiston - Tratado de Cirurgia', 'ATLS Manual', 'Goffi - Técnica Cirúrgica'],
  },
  {
    id: 'y6-internato-pediatria', year: 6, semester: 1, name: 'Internato: Pediatria', category: 'internato', hours: 320,
    description: 'Estágio supervisionado em pediatria: enfermaria, ambulatório, UTI neonatal e puericultura.',
    topics: ['Consulta pediátrica e puericultura', 'Manejo de IVAS e pneumonia na infância', 'Tratamento de diarreia e desidratação', 'Cuidados com o recém-nascido', 'Reanimação neonatal', 'Aleitamento materno: manejo prático', 'Vacinação: aplicação e orientação', 'Urgências pediátricas', 'Maus-tratos e violência contra a criança', 'Saúde do adolescente'],
    references: ['Nelson - Tratado de Pediatria', 'SBP - Tratado de Pediatria'],
  },
  {
    id: 'y6-internato-go', year: 6, semester: 2, name: 'Internato: Ginecologia e Obstetrícia', category: 'internato', hours: 320,
    description: 'Estágio supervisionado em obstetrícia (pré-natal, parto, puerpério) e ginecologia.',
    topics: ['Consulta de pré-natal', 'Assistência ao parto normal e cesárea', 'Partograma', 'Emergências obstétricas: eclâmpsia, hemorragia', 'Puerpério: cuidados e complicações', 'Exame ginecológico e coleta de Papanicolaou', 'Planejamento familiar na prática', 'Manejo de sangramento uterino anormal', 'Climatério e menopausa', 'Violência sexual: acolhimento e profilaxia'],
    references: ['Williams - Obstetrícia', 'Zugaib - Obstetrícia', 'Berek & Novak - Ginecologia'],
  },
  {
    id: 'y6-internato-saude-coletiva', year: 6, semester: 2, name: 'Internato: Saúde Coletiva e APS', category: 'internato', hours: 240,
    description: 'Estágio em Unidades Básicas de Saúde, Estratégia Saúde da Família e gestão em saúde.',
    topics: ['Atenção Primária à Saúde na prática', 'Visita domiciliar e territorialização', 'Grupos de promoção da saúde', 'Manejo de doenças crônicas na APS', 'Saúde mental na APS', 'Saúde do idoso na comunidade', 'Vigilância epidemiológica local', 'Gestão de equipe de saúde da família', 'Educação em saúde', 'Medicina de família e comunidade'],
    references: ['Duncan - Medicina Ambulatorial', 'Starfield - Atenção Primária', 'Brasil - PNAB'],
  },

  // ═══════════════════════════════════════════════════════════
  // DISCIPLINAS COMPLEMENTARES
  // ═══════════════════════════════════════════════════════════
  {
    id: 'comp-etica', year: 3, semester: 1, name: 'Ética Médica e Bioética', category: 'complementar', hours: 60,
    description: 'Princípios éticos da prática médica, código de ética médica, bioética e relação médico-paciente.',
    topics: ['Código de Ética Médica (CEM)', 'Princípios da bioética: autonomia, beneficência, não-maleficência, justiça', 'Consentimento informado', 'Sigilo médico e suas exceções', 'Erro médico e responsabilidade profissional', 'Eutanásia, ortotanásia e distanásia', 'Pesquisa com seres humanos', 'Alocação de recursos em saúde', 'Dilemas éticos em UTI', 'Relação médico-paciente-família'],
    references: ['CFM - Código de Ética Médica', 'Beauchamp & Childress - Princípios de Ética Biomédica'],
  },
  {
    id: 'comp-medicina-legal', year: 4, semester: 1, name: 'Medicina Legal', category: 'complementar', hours: 60,
    description: 'Perícia médico-legal, traumatologia forense, tanatologia, toxicologia e sexologia forense.',
    topics: ['Documentos médico-legais: atestado, laudo, relatório', 'Traumatologia forense: lesões corporais', 'Tanatologia: diagnóstico de morte e cronotanatognose', 'Asfixiologia forense', 'Toxicologia forense', 'Sexologia forense', 'Psiquiatria forense: imputabilidade', 'Identificação médico-legal', 'Perícia em acidentes de trabalho', 'Antropologia forense'],
    references: ['Hércules - Medicina Legal', 'França - Medicina Legal'],
  },
  {
    id: 'comp-radiologia', year: 3, semester: 2, name: 'Radiologia e Diagnóstico por Imagem', category: 'complementar', hours: 60,
    description: 'Interpretação de exames de imagem: radiografia, ultrassonografia, tomografia e ressonância magnética.',
    topics: ['Princípios de radiologia e proteção radiológica', 'Radiografia de tórax: sistemática de interpretação', 'Radiografia de abdome', 'Radiografia óssea e articular', 'Ultrassonografia abdominal e obstétrica', 'Tomografia computadorizada: princípios e indicações', 'Ressonância magnética: princípios e indicações', 'Angiotomografia e angioressonância', 'Medicina nuclear: cintilografia e PET-CT', 'Radiologia intervencionista'],
    references: ['Novelline - Fundamentos de Radiologia', 'Sutton - Radiologia e Diagnóstico por Imagem', 'Cerri - Ultra-sonografia Abdominal'],
  },
];

export const CURRICULUM_YEARS = [
  { year: 1, name: '1º Ano', subtitle: 'Ciências Básicas', color: 'text-blue-400' },
  { year: 2, name: '2º Ano', subtitle: 'Ciências Básicas Avançadas', color: 'text-green-400' },
  { year: 3, name: '3º Ano', subtitle: 'Transição Básico-Clínica', color: 'text-yellow-400' },
  { year: 4, name: '4º Ano', subtitle: 'Clínica', color: 'text-orange-400' },
  { year: 5, name: '5º Ano', subtitle: 'Clínica Avançada', color: 'text-red-400' },
  { year: 6, name: '6º Ano', subtitle: 'Internato', color: 'text-purple-400' },
];

export const CURRICULUM_CATEGORIES = [
  { id: 'basica', name: 'Ciências Básicas', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'clinica', name: 'Ciências Clínicas', color: 'bg-green-500/20 text-green-400' },
  { id: 'internato', name: 'Internato', color: 'bg-purple-500/20 text-purple-400' },
  { id: 'complementar', name: 'Complementar', color: 'bg-yellow-500/20 text-yellow-400' },
];
