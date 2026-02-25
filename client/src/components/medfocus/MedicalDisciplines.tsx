/**
 * MedFocus — Disciplinas Médicas v2.0
 * Todas as disciplinas do curso de Medicina (1º ao 6º ano)
 * Com conteúdo programático, objetivos, referências e progresso
 */
import { useState, useMemo } from 'react';

interface Topic {
  id: string;
  name: string;
  description: string;
  keyPoints: string[];
  clinicalCorrelation?: string;
  references: string[];
}

interface Discipline {
  id: string;
  name: string;
  year: number;
  semester: number;
  icon: string;
  color: string;
  category: 'basica' | 'clinica' | 'cirurgica' | 'saude_publica' | 'estagio';
  hours: number;
  description: string;
  objectives: string[];
  topics: Topic[];
  mainReferences: string[];
  professors?: string[];
}

const DISCIPLINES: Discipline[] = [
  // === ANO 1 ===
  {
    id: 'anatomia', name: 'Anatomia Humana', year: 1, semester: 1, icon: '🦴', color: '#78716C',
    category: 'basica', hours: 180,
    description: 'Estudo macroscópico e microscópico do corpo humano. Base fundamental para todas as especialidades médicas.',
    objectives: ['Identificar estruturas anatômicas em peças e imagens', 'Correlacionar anatomia com clínica', 'Dominar terminologia anatômica internacional'],
    topics: [
      { id: 'anat1', name: 'Introdução e Terminologia', description: 'Posição anatômica, planos, eixos, termos de relação e comparação', keyPoints: ['Posição anatômica padrão', 'Planos sagital, coronal, transversal', 'Termos: proximal/distal, medial/lateral'], references: ['Netter Cap.1', 'Moore Cap.1'] },
      { id: 'anat2', name: 'Sistema Esquelético', description: 'Osteologia: 206 ossos, articulações, classificação', keyPoints: ['Ossos longos, curtos, planos, irregulares', 'Articulações: sinartrose, anfiartrose, diartrose', 'Coluna: 7C+12T+5L+5S+4Co'], references: ['Netter Cap.2-4', 'Moore Cap.2-7'], clinicalCorrelation: 'Fraturas, osteoporose, artrite' },
      { id: 'anat3', name: 'Sistema Muscular', description: 'Miologia: músculos esqueléticos, origem, inserção, ação, inervação', keyPoints: ['Músculos da mímica facial (VII par)', 'Músculos mastigatórios (V par)', 'Manguito rotador: SITS'], references: ['Netter Cap.5-8', 'Moore Cap.2-7'], clinicalCorrelation: 'Lesões do manguito rotador, paralisia facial' },
      { id: 'anat4', name: 'Sistema Cardiovascular', description: 'Coração, vasos, circulação sistêmica e pulmonar', keyPoints: ['4 câmaras, 4 valvas', 'Coronárias: DA, Cx, CD', 'Polígono de Willis'], references: ['Netter Cap.9-10', 'Guyton Cap.9-13'], clinicalCorrelation: 'IAM, aneurismas, varizes' },
      { id: 'anat5', name: 'Sistema Respiratório', description: 'Vias aéreas, pulmões, pleura, mediastino', keyPoints: ['Pulmão D: 3 lobos, E: 2 lobos', 'Carina: T4-T5', 'Hiatos diafragmáticos'], references: ['Netter Cap.11', 'Moore Cap.4'], clinicalCorrelation: 'Pneumotórax, derrame pleural' },
      { id: 'anat6', name: 'Sistema Digestório', description: 'TGI, glândulas anexas, peritônio', keyPoints: ['Esôfago, estômago, intestinos', 'Fígado: 8 segmentos (Couinaud)', 'Pâncreas retroperitoneal'], references: ['Netter Cap.12-13', 'Moore Cap.5'], clinicalCorrelation: 'Apendicite, hérnias, obstrução' },
      { id: 'anat7', name: 'Sistema Nervoso', description: 'SNC e SNP, nervos cranianos, medula espinhal', keyPoints: ['12 pares cranianos', 'Plexos: cervical, braquial, lombar, sacral', 'Dermátomos'], references: ['Netter Cap.14-16', 'Machado Neuroanatomia'], clinicalCorrelation: 'AVC, lesão medular, neuropatias' },
      { id: 'anat8', name: 'Sistema Urogenital', description: 'Rins, ureteres, bexiga, órgãos reprodutores', keyPoints: ['Rins retroperitoneais', 'Trígono vesical', 'Testículos, ovários, útero'], references: ['Netter Cap.17-18', 'Moore Cap.6'], clinicalCorrelation: 'Litíase, HPB, miomas' },
    ],
    mainReferences: ['Netter FH. Atlas de Anatomia Humana. 7ª ed.', 'Moore KL. Anatomia Orientada para a Clínica. 8ª ed.', 'Sobotta J. Atlas de Anatomia Humana. 24ª ed.', 'Gray H. Gray\'s Anatomy. 42nd ed.'],
  },
  {
    id: 'histologia', name: 'Histologia e Embriologia', year: 1, semester: 1, icon: '🔬', color: '#EC4899',
    category: 'basica', hours: 120,
    description: 'Estudo microscópico dos tecidos e desenvolvimento embrionário humano.',
    objectives: ['Identificar tecidos ao microscópio', 'Compreender organogênese', 'Correlacionar histologia com patologia'],
    topics: [
      { id: 'hist1', name: 'Tecido Epitelial', description: 'Revestimento e glandular', keyPoints: ['Simples, estratificado, pseudoestratificado', 'Glândulas exócrinas e endócrinas', 'Membrana basal'], references: ['Junqueira Cap.4'] },
      { id: 'hist2', name: 'Tecido Conjuntivo', description: 'Propriamente dito, especializados', keyPoints: ['Fibras: colágeno, elásticas, reticulares', 'Células: fibroblastos, macrófagos, mastócitos', 'Cartilagem e osso'], references: ['Junqueira Cap.5-8'] },
      { id: 'hist3', name: 'Tecido Muscular', description: 'Esquelético, cardíaco, liso', keyPoints: ['Estriado esquelético: multinucleado', 'Cardíaco: discos intercalares', 'Liso: involuntário'], references: ['Junqueira Cap.10'] },
      { id: 'hist4', name: 'Tecido Nervoso', description: 'Neurônios e neuróglia', keyPoints: ['Corpo celular, dendritos, axônio', 'Bainha de mielina', 'Sinapse'], references: ['Junqueira Cap.9'] },
      { id: 'hist5', name: 'Embriologia Geral', description: 'Gametogênese, fecundação, gastrulação, neurulação', keyPoints: ['1ª-3ª semana: clivagem, implantação, gastrulação', '3 folhetos: ecto, meso, endoderma', 'Neurulação: placa → tubo neural'], references: ['Moore Embriologia Cap.1-5'] },
      { id: 'hist6', name: 'Embriologia Especial', description: 'Organogênese dos sistemas', keyPoints: ['Coração: 1º órgão funcional', 'Membros: 4ª-8ª semana', 'Período crítico: teratogênese'], references: ['Moore Embriologia Cap.6-20'] },
    ],
    mainReferences: ['Junqueira LC. Histologia Básica. 13ª ed.', 'Moore KL. Embriologia Clínica. 10ª ed.', 'Ross MH. Histologia: Texto e Atlas. 7ª ed.'],
  },
  {
    id: 'bioquimica', name: 'Bioquímica Médica', year: 1, semester: 1, icon: '🧪', color: '#F59E0B',
    category: 'basica', hours: 120,
    description: 'Bases moleculares dos processos biológicos. Metabolismo, enzimologia, biologia molecular.',
    objectives: ['Compreender vias metabólicas', 'Interpretar exames bioquímicos', 'Correlacionar erros metabólicos com doenças'],
    topics: [
      { id: 'bioq1', name: 'Aminoácidos e Proteínas', description: 'Estrutura, classificação, dobramento', keyPoints: ['20 aminoácidos essenciais/não-essenciais', 'Estrutura 1ª, 2ª, 3ª, 4ª', 'Hemoglobina: cooperatividade'], references: ['Lehninger Cap.3-5'] },
      { id: 'bioq2', name: 'Enzimologia', description: 'Cinética enzimática, regulação, inibição', keyPoints: ['Michaelis-Menten: Km e Vmax', 'Inibição competitiva e não-competitiva', 'Alosteria'], references: ['Lehninger Cap.6'] },
      { id: 'bioq3', name: 'Metabolismo de Carboidratos', description: 'Glicólise, gliconeogênese, ciclo de Krebs', keyPoints: ['Glicólise: 10 reações, 2 ATP', 'Ciclo de Krebs: 8 reações', 'Cadeia respiratória: 32-34 ATP'], references: ['Lehninger Cap.14-19'] },
      { id: 'bioq4', name: 'Metabolismo de Lipídios', description: 'Beta-oxidação, lipogênese, colesterol', keyPoints: ['Beta-oxidação: mitocondrial', 'Corpos cetônicos: jejum/DM1', 'Colesterol: HMG-CoA redutase'], references: ['Lehninger Cap.17,21'] },
      { id: 'bioq5', name: 'Biologia Molecular', description: 'DNA, RNA, replicação, transcrição, tradução', keyPoints: ['Replicação semiconservativa', 'Transcrição: RNA polimerase', 'Tradução: ribossomos'], references: ['Lehninger Cap.24-27'] },
    ],
    mainReferences: ['Nelson DL, Cox MM. Lehninger Princípios de Bioquímica. 7ª ed.', 'Stryer L. Bioquímica. 8ª ed.', 'Baynes JW. Bioquímica Médica. 4ª ed.'],
  },
  {
    id: 'fisiologia', name: 'Fisiologia Humana', year: 1, semester: 2, icon: '⚡', color: '#3B82F6',
    category: 'basica', hours: 180,
    description: 'Funcionamento dos sistemas orgânicos. Base para fisiopatologia e farmacologia.',
    objectives: ['Compreender mecanismos fisiológicos', 'Interpretar parâmetros vitais', 'Correlacionar fisiologia com patologia'],
    topics: [
      { id: 'fisio1', name: 'Fisiologia Cardiovascular', description: 'Ciclo cardíaco, hemodinâmica, regulação da PA', keyPoints: ['Débito cardíaco = FC × VS', 'PA = DC × RVP', 'Frank-Starling', 'Barorreceptores'], references: ['Guyton Cap.9-24'] },
      { id: 'fisio2', name: 'Fisiologia Respiratória', description: 'Mecânica ventilatória, trocas gasosas, transporte de O2/CO2', keyPoints: ['Volumes e capacidades pulmonares', 'Curva de dissociação da Hb', 'Equilíbrio ácido-base'], references: ['Guyton Cap.38-42'] },
      { id: 'fisio3', name: 'Fisiologia Renal', description: 'Filtração, reabsorção, secreção, concentração urinária', keyPoints: ['TFG: 120 mL/min', 'SRAA', 'ADH e aldosterona', 'Clearance de creatinina'], references: ['Guyton Cap.26-31'] },
      { id: 'fisio4', name: 'Fisiologia Digestória', description: 'Motilidade, secreção, digestão, absorção', keyPoints: ['Secreção gástrica: HCl + pepsina', 'Bile: emulsificação de gorduras', 'Absorção intestinal'], references: ['Guyton Cap.63-67'] },
      { id: 'fisio5', name: 'Neurofisiologia', description: 'Potencial de ação, sinapses, sistemas sensoriais e motores', keyPoints: ['Potencial de repouso: -70mV', 'Sinapse: neurotransmissores', 'Reflexos medulares'], references: ['Guyton Cap.45-60'] },
      { id: 'fisio6', name: 'Fisiologia Endócrina', description: 'Eixos hormonais, feedback, metabolismo', keyPoints: ['Eixo HHA, HHT, HHG', 'Insulina vs glucagon', 'Cortisol: ritmo circadiano'], references: ['Guyton Cap.75-83'] },
    ],
    mainReferences: ['Guyton AC, Hall JE. Tratado de Fisiologia Médica. 14ª ed.', 'Berne RM. Fisiologia. 7ª ed.', 'Costanzo LS. Fisiologia. 6ª ed.'],
  },
  {
    id: 'biofisica', name: 'Biofísica', year: 1, semester: 1, icon: '📡', color: '#6366F1',
    category: 'basica', hours: 60,
    description: 'Princípios físicos aplicados à medicina. Radiação, eletricidade biológica, biomecânica.',
    objectives: ['Compreender bases físicas dos métodos diagnósticos', 'Interpretar ECG e EEG', 'Entender princípios de imagem'],
    topics: [
      { id: 'biof1', name: 'Bioeletricidade', description: 'Potenciais de membrana, ECG, EEG', keyPoints: ['Equação de Nernst', 'ECG: derivações e ondas', 'EEG: ritmos cerebrais'], references: ['Guyton Cap.5'] },
      { id: 'biof2', name: 'Radiação e Imagem', description: 'Raios X, TC, RM, US', keyPoints: ['Raios X: atenuação', 'RM: ressonância de prótons', 'US: piezoelétrico'], references: ['Bushberg Physics'] },
    ],
    mainReferences: ['Guyton AC. Tratado de Fisiologia Médica. 14ª ed.', 'Bushberg JT. The Essential Physics of Medical Imaging.'],
  },
  // === ANO 2 ===
  {
    id: 'patologia', name: 'Patologia Geral e Especial', year: 2, semester: 1, icon: '🔎', color: '#EF4444',
    category: 'basica', hours: 180,
    description: 'Estudo das doenças: etiologia, patogenia, alterações morfológicas e funcionais.',
    objectives: ['Compreender mecanismos de doença', 'Interpretar laudos histopatológicos', 'Correlacionar patologia com clínica'],
    topics: [
      { id: 'pat1', name: 'Lesão e Morte Celular', description: 'Necrose, apoptose, adaptações celulares', keyPoints: ['Necrose: coagulativa, liquefativa, caseosa, gordurosa', 'Apoptose: programada', 'Adaptações: hipertrofia, hiperplasia, atrofia, metaplasia'], references: ['Robbins Cap.1-2'] },
      { id: 'pat2', name: 'Inflamação', description: 'Aguda e crônica, mediadores, reparo', keyPoints: ['Sinais cardinais: dor, calor, rubor, tumor, perda de função', 'Mediadores: histamina, prostaglandinas, citocinas', 'Granuloma: TB, sarcoidose'], references: ['Robbins Cap.3-4'] },
      { id: 'pat3', name: 'Neoplasias', description: 'Benignas e malignas, carcinogênese, estadiamento', keyPoints: ['TNM: tumor, nódulo, metástase', 'Proto-oncogenes e supressores', 'Marcadores tumorais'], references: ['Robbins Cap.7-8'] },
      { id: 'pat4', name: 'Distúrbios Hemodinâmicos', description: 'Edema, trombose, embolia, infarto, choque', keyPoints: ['Tríade de Virchow', 'TEP: Wells score', 'Choque: hipovolêmico, cardiogênico, distributivo'], references: ['Robbins Cap.5'] },
      { id: 'pat5', name: 'Patologia Sistêmica', description: 'Patologia de cada sistema orgânico', keyPoints: ['Cardiovascular: aterosclerose, IAM', 'Respiratório: DPOC, Ca pulmão', 'Digestório: cirrose, Ca colorretal'], references: ['Robbins Cap.10-29'] },
    ],
    mainReferences: ['Kumar V, Abbas AK. Robbins Patologia Básica. 10ª ed.', 'Bogliolo L. Patologia. 9ª ed.'],
  },
  {
    id: 'farmacologia', name: 'Farmacologia', year: 2, semester: 1, icon: '💊', color: '#10B981',
    category: 'basica', hours: 150,
    description: 'Estudo dos fármacos: farmacocinética, farmacodinâmica, classes terapêuticas.',
    objectives: ['Compreender mecanismos de ação', 'Prescrever racionalmente', 'Identificar interações e efeitos adversos'],
    topics: [
      { id: 'farm1', name: 'Farmacocinética', description: 'ADME: absorção, distribuição, metabolismo, excreção', keyPoints: ['Biodisponibilidade', 'Volume de distribuição', 'Meia-vida', 'Clearance'], references: ['Goodman Cap.2'] },
      { id: 'farm2', name: 'Farmacodinâmica', description: 'Receptores, agonistas, antagonistas, dose-resposta', keyPoints: ['Receptores: ionotrópicos, metabotrópicos, nucleares', 'Agonista parcial vs total', 'Potência vs eficácia'], references: ['Goodman Cap.3'] },
      { id: 'farm3', name: 'SNA: Colinérgicos e Adrenérgicos', description: 'Fármacos do sistema nervoso autônomo', keyPoints: ['Colinérgicos: muscarínicos e nicotínicos', 'Adrenérgicos: alfa e beta', 'Anticolinesterásicos'], references: ['Goodman Cap.8-12'] },
      { id: 'farm4', name: 'Anti-inflamatórios', description: 'AINEs e corticosteroides', keyPoints: ['AINEs: COX-1 e COX-2', 'Corticoides: mecanismo genômico', 'Efeitos adversos: gástrico, renal, CV'], references: ['Goodman Cap.38-39'] },
      { id: 'farm5', name: 'Antimicrobianos', description: 'Antibióticos, antifúngicos, antivirais', keyPoints: ['Beta-lactâmicos: parede celular', 'Quinolonas: DNA girase', 'Resistência bacteriana'], references: ['Goodman Cap.52-60'] },
      { id: 'farm6', name: 'Cardiovascular', description: 'Anti-hipertensivos, antiarrítmicos, anticoagulantes', keyPoints: ['IECA/BRA: SRAA', 'Betabloqueadores', 'Warfarina vs DOACs'], references: ['Goodman Cap.28-34'] },
      { id: 'farm7', name: 'SNC', description: 'Ansiolíticos, antidepressivos, antipsicóticos, antiepilépticos', keyPoints: ['Benzodiazepínicos: GABA-A', 'ISRS: serotonina', 'Antipsicóticos: D2'], references: ['Goodman Cap.17-24'] },
    ],
    mainReferences: ['Brunton LL. Goodman & Gilman: As Bases Farmacológicas da Terapêutica. 13ª ed.', 'Rang HP. Farmacologia. 9ª ed.', 'Katzung BG. Farmacologia Básica e Clínica. 14ª ed.'],
  },
  {
    id: 'microbiologia', name: 'Microbiologia e Imunologia', year: 2, semester: 1, icon: '🦠', color: '#8B5CF6',
    category: 'basica', hours: 120,
    description: 'Bactérias, vírus, fungos, parasitas e resposta imune.',
    objectives: ['Identificar agentes infecciosos', 'Compreender resposta imune', 'Correlacionar com doenças infecciosas'],
    topics: [
      { id: 'micro1', name: 'Bacteriologia', description: 'Gram+, Gram-, atípicas, micobactérias', keyPoints: ['Gram+: S. aureus, Streptococcus', 'Gram-: E. coli, Pseudomonas', 'BAAR: M. tuberculosis'], references: ['Murray Cap.12-30'] },
      { id: 'micro2', name: 'Virologia', description: 'DNA e RNA vírus, retrovírus', keyPoints: ['HIV: retrovírus, CD4', 'Hepatites: A,B,C,D,E', 'Influenza: hemaglutinina, neuraminidase'], references: ['Murray Cap.38-60'] },
      { id: 'micro3', name: 'Imunologia', description: 'Inata, adaptativa, hipersensibilidade, autoimunidade', keyPoints: ['Th1/Th2/Th17/Treg', 'Hipersensibilidade I-IV', 'MHC I e II'], references: ['Abbas Imunologia'] },
      { id: 'micro4', name: 'Parasitologia', description: 'Protozoários e helmintos', keyPoints: ['Malária: Plasmodium', 'Chagas: T. cruzi', 'Esquistossomose: S. mansoni'], references: ['Neves Parasitologia'] },
    ],
    mainReferences: ['Murray PR. Microbiologia Médica. 8ª ed.', 'Abbas AK. Imunologia Celular e Molecular. 9ª ed.', 'Neves DP. Parasitologia Humana. 13ª ed.'],
  },
  // === ANO 3 ===
  {
    id: 'semiologia', name: 'Semiologia Médica', year: 3, semester: 1, icon: '🩺', color: '#0EA5E9',
    category: 'clinica', hours: 180,
    description: 'Arte do exame clínico: anamnese, exame físico, raciocínio clínico.',
    objectives: ['Realizar anamnese completa', 'Executar exame físico sistematizado', 'Formular hipóteses diagnósticas'],
    topics: [
      { id: 'semio1', name: 'Anamnese', description: 'Identificação, QP, HDA, ISDA, antecedentes, hábitos', keyPoints: ['SAMPLE: sinais, alergias, medicações, passado, líquidos, eventos', 'Cronologia da doença', 'Relação médico-paciente'], references: ['Porto Semiologia Cap.1-3'] },
      { id: 'semio2', name: 'Exame Cardiovascular', description: 'Inspeção, palpação, ausculta cardíaca', keyPoints: ['Focos: aórtico, pulmonar, tricúspide, mitral', 'Bulhas: B1, B2, B3, B4', 'Sopros: sistólico, diastólico'], references: ['Porto Semiologia Cap.14'] },
      { id: 'semio3', name: 'Exame Respiratório', description: 'Inspeção, palpação, percussão, ausculta pulmonar', keyPoints: ['FTV: aumentado (consolidação), diminuído (derrame)', 'Percussão: timpânico, maciço, submaciço', 'MV, roncos, sibilos, estertores'], references: ['Porto Semiologia Cap.13'] },
      { id: 'semio4', name: 'Exame Abdominal', description: 'Inspeção, ausculta, percussão, palpação', keyPoints: ['9 regiões abdominais', 'RHA: presentes, aumentados, ausentes', 'Sinais: Murphy, Blumberg, Rovsing'], references: ['Porto Semiologia Cap.15'] },
      { id: 'semio5', name: 'Exame Neurológico', description: 'Estado mental, nervos cranianos, motor, sensorial, reflexos', keyPoints: ['Glasgow: 3-15', 'Reflexos: bicipital, patelar, aquileu', 'Babinski: lesão do 1º neurônio'], references: ['Porto Semiologia Cap.18'] },
    ],
    mainReferences: ['Porto CC. Semiologia Médica. 8ª ed.', 'Bates B. Propedêutica Médica. 12ª ed.'],
  },
  {
    id: 'clinicamedica', name: 'Clínica Médica', year: 3, semester: 2, icon: '🏥', color: '#EF4444',
    category: 'clinica', hours: 360,
    description: 'Diagnóstico e tratamento das doenças clínicas. Base do internato.',
    objectives: ['Diagnosticar doenças prevalentes', 'Prescrever tratamento adequado', 'Manejar emergências clínicas'],
    topics: [
      { id: 'cm1', name: 'Cardiologia', description: 'HAS, ICC, DAC, arritmias, valvopatias', keyPoints: ['HAS: meta <140/90 (geral), <130/80 (alto risco)', 'ICC: NYHA I-IV, FEVE', 'IAM: ECG + troponina + cateterismo'], references: ['Harrison Cap.265-280'] },
      { id: 'cm2', name: 'Pneumologia', description: 'Asma, DPOC, pneumonia, TEP, Ca pulmão', keyPoints: ['DPOC: GOLD A-D', 'Pneumonia: CURB-65', 'TEP: Wells + D-dímero + angioTC'], references: ['Harrison Cap.281-295'] },
      { id: 'cm3', name: 'Gastroenterologia', description: 'DRGE, úlcera, hepatites, cirrose, DII', keyPoints: ['H. pylori: IBP + 2 ATB', 'Cirrose: Child-Pugh, MELD', 'DII: Crohn vs RCU'], references: ['Harrison Cap.340-360'] },
      { id: 'cm4', name: 'Nefrologia', description: 'DRC, IRA, glomerulonefrites, litíase', keyPoints: ['KDIGO: estágios 1-5', 'IRA: pré-renal, renal, pós-renal', 'Síndrome nefrótica vs nefrítica'], references: ['Harrison Cap.305-315'] },
      { id: 'cm5', name: 'Endocrinologia', description: 'DM, tireoidopatias, adrenal, hipófise', keyPoints: ['DM2: metformina 1ª linha', 'Hipotireoidismo: levotiroxina', 'Cushing: cortisol 24h'], references: ['Harrison Cap.396-410'] },
      { id: 'cm6', name: 'Hematologia', description: 'Anemias, leucemias, linfomas, coagulopatias', keyPoints: ['Anemia ferropriva: ferritina↓', 'LMA vs LLA', 'Hodgkin vs Não-Hodgkin'], references: ['Harrison Cap.93-110'] },
      { id: 'cm7', name: 'Reumatologia', description: 'AR, LES, gota, espondiloartrites', keyPoints: ['AR: anti-CCP, FR', 'LES: FAN, anti-dsDNA', 'Gota: cristais de urato'], references: ['Harrison Cap.369-385'] },
      { id: 'cm8', name: 'Infectologia', description: 'HIV, TB, meningite, sepse, dengue', keyPoints: ['HIV: TARV, CD4, CV', 'TB: RIPE 6 meses', 'Sepse: qSOFA, SOFA'], references: ['Harrison Cap.197-230'] },
    ],
    mainReferences: ['Kasper DL. Harrison Medicina Interna. 21ª ed.', 'Goldman L. Cecil Medicina. 26ª ed.', 'Lopes AC. Tratado de Clínica Médica. 3ª ed.'],
  },
  // === ANO 4 ===
  {
    id: 'cirurgia', name: 'Clínica Cirúrgica', year: 4, semester: 1, icon: '🔪', color: '#DC2626',
    category: 'cirurgica', hours: 240,
    description: 'Princípios cirúrgicos, cirurgia do aparelho digestivo, trauma, urgências.',
    objectives: ['Indicar procedimentos cirúrgicos', 'Manejar pré e pós-operatório', 'Atender trauma (ATLS)'],
    topics: [
      { id: 'cir1', name: 'Pré e Pós-operatório', description: 'Avaliação, risco cirúrgico, complicações', keyPoints: ['ASA I-V', 'Goldman: risco cardíaco', 'Jejum pré-operatório'], references: ['Sabiston Cap.11-12'] },
      { id: 'cir2', name: 'Trauma (ATLS)', description: 'ABCDE, choque, trauma torácico, abdominal, craniano', keyPoints: ['ABCDE: via aérea, respiração, circulação, neurológico, exposição', 'FAST: líquido livre', 'Glasgow: TCE leve/moderado/grave'], references: ['ATLS Manual'] },
      { id: 'cir3', name: 'Abdome Agudo', description: 'Inflamatório, obstrutivo, perfurativo, vascular, hemorrágico', keyPoints: ['Apendicite: Alvarado score', 'Obstrução: brida (mais comum)', 'Perfuração: pneumoperitônio'], references: ['Sabiston Cap.47-52'] },
      { id: 'cir4', name: 'Hérnias', description: 'Inguinal, femoral, umbilical, incisional', keyPoints: ['Inguinal indireta: mais comum', 'Femoral: mulheres, risco de estrangulamento', 'Lichtenstein: tela'], references: ['Sabiston Cap.44'] },
    ],
    mainReferences: ['Townsend CM. Sabiston Tratado de Cirurgia. 20ª ed.', 'Schwartz SI. Princípios de Cirurgia. 11ª ed.'],
  },
  {
    id: 'pediatria', name: 'Pediatria', year: 4, semester: 1, icon: '👶', color: '#F472B6',
    category: 'clinica', hours: 240,
    description: 'Saúde da criança e do adolescente. Crescimento, desenvolvimento, doenças prevalentes.',
    objectives: ['Acompanhar crescimento e desenvolvimento', 'Diagnosticar doenças da infância', 'Orientar vacinação e puericultura'],
    topics: [
      { id: 'ped1', name: 'Neonatologia', description: 'RN a termo, prematuro, reanimação neonatal', keyPoints: ['Apgar: 1 e 5 min', 'Icterícia neonatal: Bhutani', 'SDR: surfactante'], references: ['Nelson Cap.94-110'] },
      { id: 'ped2', name: 'Puericultura', description: 'Crescimento, desenvolvimento, vacinação, alimentação', keyPoints: ['Marcos do desenvolvimento', 'Calendário vacinal PNI', 'Aleitamento materno exclusivo: 6 meses'], references: ['Nelson Cap.6-15'] },
      { id: 'ped3', name: 'Doenças Respiratórias', description: 'IVAS, pneumonia, bronquiolite, asma', keyPoints: ['Bronquiolite: VSR, <2 anos', 'Pneumonia: amoxicilina', 'Crupe: estridor + tosse ladrante'], references: ['Nelson Cap.400-420'] },
      { id: 'ped4', name: 'Doenças Exantemáticas', description: 'Sarampo, rubéola, varicela, escarlatina, eritema infeccioso', keyPoints: ['Sarampo: Koplik + exantema morbiliforme', 'Varicela: vesículas em diferentes estágios', 'Escarlatina: Strep grupo A'], references: ['Nelson Cap.246-260'] },
    ],
    mainReferences: ['Kliegman RM. Nelson Tratado de Pediatria. 21ª ed.', 'Burns DAR. Tratado de Pediatria (SBP). 4ª ed.'],
  },
  {
    id: 'ginecologia', name: 'Ginecologia e Obstetrícia', year: 4, semester: 2, icon: '🤰', color: '#EC4899',
    category: 'clinica', hours: 240,
    description: 'Saúde da mulher, gestação, parto, puerpério, doenças ginecológicas.',
    objectives: ['Acompanhar pré-natal', 'Assistir ao parto', 'Diagnosticar doenças ginecológicas'],
    topics: [
      { id: 'go1', name: 'Pré-natal', description: 'Consultas, exames, suplementação, complicações', keyPoints: ['Mínimo 6 consultas', 'Ácido fólico: pré-concepção', 'USG: 1º tri (TN), 2º tri (morfológico)'], references: ['Zugaib Cap.5-10'] },
      { id: 'go2', name: 'Parto', description: 'Trabalho de parto, mecanismo, cesárea, fórceps', keyPoints: ['Fases: dilatação, expulsão, dequitação', 'Partograma', 'Indicações de cesárea'], references: ['Zugaib Cap.15-20'] },
      { id: 'go3', name: 'Síndromes Hipertensivas', description: 'Pré-eclâmpsia, eclâmpsia, HELLP', keyPoints: ['PE: PA≥140/90 + proteinúria após 20 sem', 'HELLP: hemólise, enzimas hepáticas↑, plaquetas↓', 'MgSO4: prevenção de eclâmpsia'], references: ['Zugaib Cap.25'] },
      { id: 'go4', name: 'Oncologia Ginecológica', description: 'Ca mama, colo, endométrio, ovário', keyPoints: ['Mama: mamografia 50-69 anos (SUS)', 'Colo: Papanicolaou 25-64 anos', 'Endométrio: sangramento pós-menopausa'], references: ['Zugaib Cap.40-45'] },
    ],
    mainReferences: ['Zugaib M. Obstetrícia. 3ª ed.', 'Berek JS. Berek & Novak Ginecologia. 16ª ed.'],
  },
  // === ANO 5 ===
  {
    id: 'psiquiatria', name: 'Psiquiatria', year: 5, semester: 1, icon: '🧠', color: '#7C3AED',
    category: 'clinica', hours: 120,
    description: 'Transtornos mentais: diagnóstico, tratamento, reabilitação psicossocial.',
    objectives: ['Diagnosticar transtornos mentais (DSM-5)', 'Prescrever psicofármacos', 'Manejar emergências psiquiátricas'],
    topics: [
      { id: 'psiq1', name: 'Transtornos de Humor', description: 'Depressão, transtorno bipolar', keyPoints: ['Depressão: ≥5 critérios por ≥2 semanas', 'Bipolar I: mania, Bipolar II: hipomania', 'ISRS: 1ª linha para depressão'], references: ['Kaplan Cap.8'] },
      { id: 'psiq2', name: 'Esquizofrenia', description: 'Sintomas positivos, negativos, cognitivos', keyPoints: ['Positivos: delírios, alucinações', 'Negativos: embotamento, alogia', 'Antipsicóticos: típicos e atípicos'], references: ['Kaplan Cap.7'] },
      { id: 'psiq3', name: 'Transtornos de Ansiedade', description: 'TAG, pânico, TOC, TEPT, fobias', keyPoints: ['TAG: preocupação excessiva ≥6 meses', 'Pânico: ataques recorrentes', 'TOC: obsessões + compulsões'], references: ['Kaplan Cap.9'] },
    ],
    mainReferences: ['Sadock BJ. Kaplan & Sadock Psiquiatria. 11ª ed.', 'Stahl SM. Psicofarmacologia. 5ª ed.'],
  },
  {
    id: 'ortopedia', name: 'Ortopedia e Traumatologia', year: 5, semester: 1, icon: '🦿', color: '#78716C',
    category: 'cirurgica', hours: 120,
    description: 'Doenças do aparelho locomotor, fraturas, luxações, doenças degenerativas.',
    objectives: ['Diagnosticar fraturas e luxações', 'Indicar tratamento conservador vs cirúrgico', 'Reabilitar pacientes ortopédicos'],
    topics: [
      { id: 'orto1', name: 'Fraturas', description: 'Classificação, consolidação, complicações', keyPoints: ['AO: classificação', 'Consolidação: inflamatória, reparativa, remodelação', 'Complicações: síndrome compartimental, embolia gordurosa'], references: ['Sizínio Cap.1-5'] },
      { id: 'orto2', name: 'Coluna', description: 'Lombalgia, hérnia discal, escoliose', keyPoints: ['Hérnia L4-L5: comprime L5', 'Red flags: febre, perda de peso, déficit neurológico', 'Escoliose: Cobb >10°'], references: ['Sizínio Cap.20-25'] },
      { id: 'orto3', name: 'Ombro e Joelho', description: 'Lesões do manguito, LCA, menisco', keyPoints: ['Manguito: supraespinhal mais lesado', 'LCA: gaveta anterior, Lachman', 'Menisco: McMurray'], references: ['Sizínio Cap.10-15'] },
    ],
    mainReferences: ['Sizínio H. Ortopedia e Traumatologia. 5ª ed.', 'Rockwood CA. Fraturas em Adultos. 9ª ed.'],
  },
  {
    id: 'dermatologia', name: 'Dermatologia', year: 5, semester: 1, icon: '🧴', color: '#F97316',
    category: 'clinica', hours: 80,
    description: 'Doenças da pele, anexos e mucosas.',
    objectives: ['Descrever lesões elementares', 'Diagnosticar dermatoses comuns', 'Identificar lesões suspeitas de malignidade'],
    topics: [
      { id: 'derm1', name: 'Lesões Elementares', description: 'Mácula, pápula, placa, vesícula, bolha, pústula', keyPoints: ['Primárias: mácula, pápula, nódulo, vesícula', 'Secundárias: crosta, escama, cicatriz', 'Padrões: linear, anular, reticulado'], references: ['Azulay Cap.1-3'] },
      { id: 'derm2', name: 'Câncer de Pele', description: 'CBC, CEC, melanoma', keyPoints: ['CBC: mais comum, menos agressivo', 'CEC: 2º mais comum', 'Melanoma: ABCDE, Breslow'], references: ['Azulay Cap.40-42'] },
      { id: 'derm3', name: 'Dermatoses Infecciosas', description: 'Micoses, piodermites, viroses', keyPoints: ['Dermatofitose: KOH', 'Hanseníase: mancha hipocrômica + anestesia', 'Herpes: vesículas agrupadas'], references: ['Azulay Cap.15-25'] },
    ],
    mainReferences: ['Azulay RD. Dermatologia. 7ª ed.', 'Sampaio SAP. Dermatologia. 4ª ed.'],
  },
  {
    id: 'saude_publica', name: 'Saúde Coletiva / Epidemiologia', year: 2, semester: 2, icon: '🌍', color: '#059669',
    category: 'saude_publica', hours: 180,
    description: 'SUS, epidemiologia, políticas de saúde, vigilância, atenção primária.',
    objectives: ['Compreender o SUS', 'Aplicar métodos epidemiológicos', 'Atuar na atenção primária'],
    topics: [
      { id: 'sp1', name: 'SUS', description: 'Princípios, diretrizes, financiamento, gestão', keyPoints: ['Princípios: universalidade, integralidade, equidade', 'Diretrizes: descentralização, hierarquização, participação', 'Leis 8080/90 e 8142/90'], references: ['Rouquayrol Cap.1-5'] },
      { id: 'sp2', name: 'Epidemiologia', description: 'Medidas de frequência, estudos, vieses', keyPoints: ['Prevalência vs incidência', 'Estudos: coorte, caso-controle, transversal, ECR', 'Vieses: seleção, aferição, confusão'], references: ['Rouquayrol Cap.6-12'] },
      { id: 'sp3', name: 'Atenção Primária', description: 'ESF, PNAB, territorialização, longitudinalidade', keyPoints: ['ESF: médico, enfermeiro, ACS', 'Atributos: acesso, longitudinalidade, integralidade, coordenação', 'NASF: apoio matricial'], references: ['Starfield Atenção Primária'] },
      { id: 'sp4', name: 'Vigilância em Saúde', description: 'Epidemiológica, sanitária, ambiental', keyPoints: ['Doenças de notificação compulsória', 'Investigação de surtos', 'Vigilância sanitária: ANVISA'], references: ['Rouquayrol Cap.15-18'] },
    ],
    mainReferences: ['Rouquayrol MZ. Epidemiologia & Saúde. 8ª ed.', 'Medronho RA. Epidemiologia. 2ª ed.'],
  },
  // === ANO 5-6 (Internato) ===
  {
    id: 'emergencia', name: 'Medicina de Emergência', year: 5, semester: 2, icon: '🚑', color: '#DC2626',
    category: 'clinica', hours: 240,
    description: 'Atendimento de urgência e emergência. ACLS, ATLS, protocolos.',
    objectives: ['Realizar ABCDE', 'Manejar PCR (ACLS)', 'Tratar emergências clínicas e cirúrgicas'],
    topics: [
      { id: 'emerg1', name: 'Suporte Avançado de Vida (ACLS)', description: 'PCR, ritmos chocáveis e não-chocáveis', keyPoints: ['FV/TV sem pulso: choque', 'Assistolia/AESP: não chocar', 'Adrenalina 1mg a cada 3-5 min', 'Amiodarona: FV/TV refratária'], references: ['AHA ACLS 2020'] },
      { id: 'emerg2', name: 'Emergências Cardiovasculares', description: 'SCA, EAP, crise hipertensiva, dissecção', keyPoints: ['IAMCSST: reperfusão <12h', 'EAP: furosemida + VNI + nitrato', 'Emergência hipertensiva: nitroprussiato'], references: ['Harrison Cap.270-275'] },
      { id: 'emerg3', name: 'Emergências Neurológicas', description: 'AVC, status epiléptico, meningite', keyPoints: ['AVC isquêmico: trombolítico <4.5h', 'Status: diazepam → fenitoína', 'Meningite: ATB empírico imediato'], references: ['Harrison Cap.420-430'] },
    ],
    mainReferences: ['AHA. ACLS Provider Manual. 2020.', 'Martins HS. Emergências Clínicas (USP). 13ª ed.'],
  },
  {
    id: 'oftalmologia', name: 'Oftalmologia', year: 5, semester: 1, icon: '👁️', color: '#06B6D4',
    category: 'clinica', hours: 60,
    description: 'Doenças oculares: glaucoma, catarata, retinopatia, erros refrativos.',
    objectives: ['Realizar fundoscopia', 'Diagnosticar olho vermelho', 'Identificar emergências oculares'],
    topics: [
      { id: 'oftalmo1', name: 'Olho Vermelho', description: 'Conjuntivite, uveíte, glaucoma agudo, ceratite', keyPoints: ['Conjuntivite: hiperemia difusa, secreção', 'Glaucoma agudo: dor + midríase + PIO↑', 'Uveíte: dor + fotofobia + miose'], references: ['Kanski Cap.5-8'] },
      { id: 'oftalmo2', name: 'Glaucoma e Catarata', description: 'Crônico, agudo, catarata senil', keyPoints: ['Glaucoma: PIO↑, escavação, campo visual', 'Catarata: opacificação do cristalino', 'Tratamento: facoemulsificação'], references: ['Kanski Cap.10-12'] },
    ],
    mainReferences: ['Kanski JJ. Oftalmologia Clínica. 8ª ed.'],
  },
  {
    id: 'otorrino', name: 'Otorrinolaringologia', year: 5, semester: 1, icon: '👂', color: '#8B5CF6',
    category: 'clinica', hours: 60,
    description: 'Doenças do ouvido, nariz e garganta.',
    objectives: ['Diagnosticar otites e sinusites', 'Avaliar perda auditiva', 'Manejar epistaxe e tonsilite'],
    topics: [
      { id: 'orl1', name: 'Otologia', description: 'Otite média, otosclerose, VPPB', keyPoints: ['OMA: otalgia + abaulamento timpânico', 'VPPB: Dix-Hallpike + Epley', 'Colesteatoma: otite crônica'], references: ['Bailey Cap.130-140'] },
      { id: 'orl2', name: 'Rinologia e Faringologia', description: 'Sinusite, epistaxe, tonsilite, apneia', keyPoints: ['Sinusite: >10 dias de sintomas', 'Epistaxe: Kiesselbach (anterior)', 'SAOS: polissonografia'], references: ['Bailey Cap.40-60'] },
    ],
    mainReferences: ['Bailey BJ. Head & Neck Surgery - Otolaryngology. 6th ed.'],
  },
  {
    id: 'urologia', name: 'Urologia', year: 5, semester: 2, icon: '💧', color: '#F97316',
    category: 'cirurgica', hours: 80,
    description: 'Doenças do trato urinário e reprodutor masculino.',
    objectives: ['Diagnosticar litíase e HPB', 'Manejar retenção urinária', 'Rastrear Ca próstata'],
    topics: [
      { id: 'uro1', name: 'Litíase Urinária', description: 'Cólica nefrética, tipos de cálculos, tratamento', keyPoints: ['Cálcio oxalato: mais comum', 'TC sem contraste: padrão-ouro', '<5mm: conservador, >10mm: intervenção'], references: ['Campbell Cap.50-55'] },
      { id: 'uro2', name: 'HPB e Ca Próstata', description: 'Hiperplasia benigna, adenocarcinoma', keyPoints: ['HPB: alfa-bloqueador + 5-alfa-redutase', 'Ca: PSA + toque retal + biópsia', 'Gleason: grau histológico'], references: ['Campbell Cap.105-110'] },
    ],
    mainReferences: ['Wein AJ. Campbell-Walsh Urologia. 12ª ed.'],
  },
  {
    id: 'etica_medica', name: 'Ética e Bioética', year: 3, semester: 1, icon: '⚖️', color: '#64748B',
    category: 'saude_publica', hours: 60,
    description: 'Princípios éticos, código de ética médica, bioética, relação médico-paciente.',
    objectives: ['Aplicar princípios bioéticos', 'Conhecer o CEM', 'Resolver dilemas éticos'],
    topics: [
      { id: 'etica1', name: 'Princípios Bioéticos', description: 'Autonomia, beneficência, não-maleficência, justiça', keyPoints: ['Autonomia: consentimento informado', 'Beneficência: fazer o bem', 'Não-maleficência: primum non nocere', 'Justiça: distribuição equitativa'], references: ['Beauchamp Princípios'] },
      { id: 'etica2', name: 'Código de Ética Médica', description: 'CEM 2018, direitos e deveres', keyPoints: ['Sigilo médico', 'Atestado médico', 'Prontuário: documento legal', 'Erro médico: imperícia, imprudência, negligência'], references: ['CEM/CFM 2018'] },
    ],
    mainReferences: ['Beauchamp TL. Princípios de Ética Biomédica. 7ª ed.', 'CFM. Código de Ética Médica. 2018.'],
  },
  {
    id: 'medicina_legal', name: 'Medicina Legal', year: 5, semester: 2, icon: '🔍', color: '#475569',
    category: 'saude_publica', hours: 60,
    description: 'Perícia médica, traumatologia forense, tanatologia, sexologia forense.',
    objectives: ['Realizar exame de corpo de delito', 'Classificar lesões corporais', 'Determinar causa mortis'],
    topics: [
      { id: 'ml1', name: 'Traumatologia Forense', description: 'Lesões corporais, instrumentos, classificação', keyPoints: ['Lesão leve, grave, gravíssima', 'Instrumentos: cortante, contundente, perfurante', 'Fenômenos cadavéricos'], references: ['Hércules Cap.5-10'] },
      { id: 'ml2', name: 'Tanatologia', description: 'Morte, cronotanatognose, fenômenos cadavéricos', keyPoints: ['Morte encefálica: protocolo CFM', 'Livor mortis, rigor mortis, algor mortis', 'Cronotanatognose: tempo de morte'], references: ['Hércules Cap.15-20'] },
    ],
    mainReferences: ['Hércules HC. Medicina Legal. 14ª ed.', 'França GV. Medicina Legal. 11ª ed.'],
  },
];

const YEAR_COLORS: Record<number, string> = { 1: '#3B82F6', 2: '#8B5CF6', 3: '#EF4444', 4: '#F59E0B', 5: '#10B981', 6: '#EC4899' };
const CATEGORY_LABELS: Record<string, string> = { basica: 'Ciências Básicas', clinica: 'Clínica', cirurgica: 'Cirúrgica', saude_publica: 'Saúde Pública', estagio: 'Internato' };

export default function MedicalDisciplines() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  const filteredDisciplines = useMemo(() => {
    let d = DISCIPLINES;
    if (selectedYear) d = d.filter(x => x.year === selectedYear);
    if (searchTerm) d = d.filter(x => x.name.toLowerCase().includes(searchTerm.toLowerCase()) || x.topics.some(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())));
    return d;
  }, [selectedYear, searchTerm]);

  const currentDiscipline = DISCIPLINES.find(d => d.id === selectedDiscipline);
  const currentTopic = currentDiscipline?.topics.find(t => t.id === selectedTopic);

  const totalHours = DISCIPLINES.reduce((s, d) => s + d.hours, 0);
  const totalTopics = DISCIPLINES.reduce((s, d) => s + d.topics.length, 0);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">📚</span> Disciplinas Médicas
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{DISCIPLINES.length} disciplinas • {totalTopics} tópicos • {totalHours}h de conteúdo • 1º ao 6º ano</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        {[1, 2, 3, 4, 5, 6].map(year => {
          const yearDiscs = DISCIPLINES.filter(d => d.year === year);
          return (
            <button key={year} onClick={() => setSelectedYear(selectedYear === year ? null : year)}
              className={`p-3 rounded-xl text-center transition-all ${selectedYear === year ? 'ring-2 ring-primary bg-primary/10' : 'bg-card border border-border hover:bg-accent'}`}>
              <div className="text-lg font-bold" style={{ color: YEAR_COLORS[year] }}>{year}º Ano</div>
              <div className="text-xs text-muted-foreground">{yearDiscs.length} disc. • {yearDiscs.reduce((s, d) => s + d.hours, 0)}h</div>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <input type="text" placeholder="🔍 Buscar disciplina ou tópico..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary outline-none mb-6" />

      {/* Grid */}
      {!selectedDiscipline ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDisciplines.map(d => (
            <button key={d.id} onClick={() => { setSelectedDiscipline(d.id); setSelectedTopic(null); }}
              className="p-4 rounded-xl bg-card border border-border hover:bg-accent text-left transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{d.icon}</span>
                <div>
                  <div className="font-bold text-sm">{d.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: YEAR_COLORS[d.year] + '20', color: YEAR_COLORS[d.year] }}>{d.year}º Ano</span>
                    <span className="text-[10px] text-muted-foreground">{d.hours}h</span>
                    <span className="text-[10px] text-muted-foreground">{d.topics.length} tópicos</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{d.description}</p>
            </button>
          ))}
        </div>
      ) : (
        <div>
          {/* Back button */}
          <button onClick={() => { setSelectedDiscipline(null); setSelectedTopic(null); }} className="mb-4 px-3 py-1.5 rounded-lg bg-card border border-border text-sm hover:bg-accent">
            ← Voltar
          </button>

          {currentDiscipline && (
            <div className="space-y-6">
              {/* Header */}
              <div className="p-5 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{currentDiscipline.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold">{currentDiscipline.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: YEAR_COLORS[currentDiscipline.year] + '20', color: YEAR_COLORS[currentDiscipline.year] }}>{currentDiscipline.year}º Ano • {currentDiscipline.semester}º Sem</span>
                      <span className="text-xs text-muted-foreground">{currentDiscipline.hours}h</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent">{CATEGORY_LABELS[currentDiscipline.category]}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{currentDiscipline.description}</p>
                <div className="mt-3">
                  <h4 className="text-xs font-semibold text-primary mb-1">Objetivos de Aprendizagem</h4>
                  <ul className="text-xs text-muted-foreground space-y-0.5">{currentDiscipline.objectives.map((o, i) => <li key={i}>• {o}</li>)}</ul>
                </div>
                <div className="mt-3">
                  <h4 className="text-xs font-semibold text-primary mb-1">Referências Principais</h4>
                  <ul className="text-xs text-muted-foreground space-y-0.5">{currentDiscipline.mainReferences.map((r, i) => <li key={i}>📖 {r}</li>)}</ul>
                </div>
              </div>

              {/* Topics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentDiscipline.topics.map(topic => (
                  <button key={topic.id} onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
                    className={`p-4 rounded-xl text-left transition-all ${selectedTopic === topic.id ? 'bg-primary/10 border-primary border-2' : 'bg-card border border-border hover:bg-accent'}`}>
                    <div className="font-medium text-sm">{topic.name}</div>
                    <p className="text-xs text-muted-foreground mt-1">{topic.description}</p>
                    {selectedTopic === topic.id && (
                      <div className="mt-3 space-y-3">
                        <div>
                          <h5 className="text-xs font-semibold text-primary mb-1">Pontos-Chave</h5>
                          <ul className="text-xs text-muted-foreground space-y-0.5">{topic.keyPoints.map((k, i) => <li key={i}>• {k}</li>)}</ul>
                        </div>
                        {topic.clinicalCorrelation && (
                          <div>
                            <h5 className="text-xs font-semibold text-primary mb-1">Correlação Clínica</h5>
                            <p className="text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded-lg">{topic.clinicalCorrelation}</p>
                          </div>
                        )}
                        <div className="text-[10px] text-muted-foreground">Ref: {topic.references.join(' | ')}</div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
