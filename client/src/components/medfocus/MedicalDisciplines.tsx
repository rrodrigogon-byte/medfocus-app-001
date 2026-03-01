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
  // === ANO 3 - Complementares ===
  {
    id: 'imagem', name: 'Diagnóstico por Imagem', year: 3, semester: 2, icon: '📷', color: '#6366F1',
    category: 'clinica', hours: 60,
    description: 'Radiologia convencional, ultrassonografia, tomografia, ressonância magnética.',
    objectives: ['Interpretar radiografias de tórax', 'Identificar achados tomográficos', 'Solicitar exames adequadamente'],
    topics: [
      { id: 'img1', name: 'Radiologia Convencional', description: 'Raio-X de tórax, abdome, ossos', keyPoints: ['Sist. ABCDE tórax', 'Níveis hidro-aéreos', 'Fraturas: regra de Ottawa'], references: ['Novelline Cap.1-5'] },
      { id: 'img2', name: 'Tomografia Computadorizada', description: 'TC de crânio, tórax, abdome', keyPoints: ['Janela óssea vs parenquimatosa', 'AVC isquêmico vs hemorrágico', 'Escala Hounsfield'], references: ['Novelline Cap.6-8'] },
      { id: 'img3', name: 'Ultrassonografia', description: 'USG abdominal, obstétrica, FAST', keyPoints: ['FAST: trauma', 'USG obstétrica: biometria fetal', 'Doppler vascular'], references: ['Rumack Cap.1-5'] },
      { id: 'img4', name: 'Ressonância Magnética', description: 'RM de crânio, coluna, articulações', keyPoints: ['T1 vs T2', 'Difusão: AVC agudo', 'Gadolínio: contraste'], references: ['Novelline Cap.9-10'] },
    ],
    mainReferences: ['Novelline RA. Fundamentos de Radiologia. 6ª ed.', 'Rumack CM. Diagnóstico por Ultrassonografia. 5ª ed.'],
  },
  {
    id: 'infectologia', name: 'Infectologia', year: 4, semester: 2, icon: '🦠', color: '#059669',
    category: 'clinica', hours: 90,
    description: 'Doenças infecciosas e parasitárias, antimicrobianos, infecções hospitalares.',
    objectives: ['Diagnosticar e tratar infecções prevalentes', 'Uso racional de antimicrobianos', 'Prevenção de IRAS'],
    topics: [
      { id: 'inf1', name: 'HIV/AIDS', description: 'Diagnóstico, estadiamento, TARV', keyPoints: ['CD4 < 200: AIDS', 'TARV: TDF+3TC+DTG', 'Profilaxias: PCP, toxo'], references: ['MS Protocolo HIV 2024'] },
      { id: 'inf2', name: 'Tuberculose', description: 'Diagnóstico, tratamento, ILTB', keyPoints: ['RIPE: 2 meses + RI: 4 meses', 'TRM-TB: diagnóstico rápido', 'ILTB: isoniazida 270 doses'], references: ['MS Manual TB 2024'] },
      { id: 'inf3', name: 'Hepatites Virais', description: 'A, B, C, D, E', keyPoints: ['HBV: HBsAg, Anti-HBs, Anti-HBc', 'HCV: DAAs cura > 95%', 'Vacinação: HBV universal'], references: ['MS Protocolo Hepatites 2024'] },
      { id: 'inf4', name: 'Arboviroses', description: 'Dengue, Zika, Chikungunya, Febre Amarela', keyPoints: ['Dengue: prova do laço, hematocrito', 'Sinais de alarme: dor abdominal, vômitos', 'Zika: microcefalia'], references: ['MS Dengue 2024'] },
    ],
    mainReferences: ['Veronesi R. Tratado de Infectologia. 6ª ed.', 'Mandell GL. Principles of Infectious Diseases. 9th ed.'],
  },
  {
    id: 'neurologia', name: 'Neurologia', year: 4, semester: 2, icon: '🧠', color: '#7C3AED',
    category: 'clinica', hours: 90,
    description: 'Doenças do sistema nervoso central e periférico.',
    objectives: ['Realizar exame neurológico completo', 'Diagnosticar AVC e epilepsia', 'Manejar cefaleias'],
    topics: [
      { id: 'neuro1', name: 'AVC', description: 'Isquêmico e hemorrágico', keyPoints: ['NIHSS: gravidade', 'Trombolítico: até 4,5h', 'Trombectomia: até 24h'], references: ['Rowland Cap.35-38'] },
      { id: 'neuro2', name: 'Epilepsia', description: 'Classificação, diagnóstico, tratamento', keyPoints: ['Focal vs generalizada', 'EEG: padrão', 'Monoterapia inicial'], references: ['Rowland Cap.25-27'] },
      { id: 'neuro3', name: 'Cefaleias', description: 'Migrânea, tensional, em salvas', keyPoints: ['Sinais de alarme: red flags', 'Migrânea: triptanos', 'Profilaxia: topiramato, propranolol'], references: ['Rowland Cap.8-10'] },
    ],
    mainReferences: ['Rowland LP. Merritt\'s Neurology. 14th ed.', 'Machado ABM. Neuroanatomia Funcional. 3ª ed.'],
  },
  {
    id: 'cardiologia', name: 'Cardiologia', year: 4, semester: 1, icon: '❤️', color: '#DC2626',
    category: 'clinica', hours: 90,
    description: 'Doenças cardiovasculares: diagnóstico, tratamento e prevenção.',
    objectives: ['Interpretar ECG', 'Manejar síndromes coronarianas', 'Tratar insuficiência cardíaca'],
    topics: [
      { id: 'card1', name: 'Eletrocardiograma', description: 'Interpretação sistemática do ECG', keyPoints: ['Ritmo, FC, eixo, intervalos', 'Supra de ST: IAM', 'BRE, BRD, bloqueios AV'], references: ['Braunwald Cap.13'] },
      { id: 'card2', name: 'Síndromes Coronarianas', description: 'IAM com e sem supra, angina instável', keyPoints: ['Troponina: marcador', 'IAMCSST: angioplastia < 90min', 'Dupla antiagregação'], references: ['Braunwald Cap.35-38'] },
      { id: 'card3', name: 'Insuficiência Cardíaca', description: 'IC sistólica e diastólica', keyPoints: ['FEVE reduzida vs preservada', 'IECA + BB + espironolactona + SGLT2i', 'BNP/NT-proBNP'], references: ['Braunwald Cap.25-27'] },
      { id: 'card4', name: 'Hipertensão Arterial', description: 'Diagnóstico, classificação, tratamento', keyPoints: ['MAPA, MRPA', 'Meta: < 130/80 mmHg', 'Crise hipertensiva: emergência vs urgência'], references: ['Diretriz SBC HAS 2024'] },
    ],
    mainReferences: ['Braunwald E. Heart Disease. 12th ed.', 'Diretriz SBC 2024'],
  },
  // === ANO 6 - INTERNATO ===
  {
    id: 'internato_cm', name: 'Internato - Clínica Médica', year: 6, semester: 1, icon: '🏥', color: '#3B82F6',
    category: 'estagio', hours: 480,
    description: 'Estágio obrigatório em enfermarias, ambulatórios e emergência de clínica médica.',
    objectives: ['Conduzir casos clínicos de forma autônoma', 'Prescrever e acompanhar pacientes internados', 'Realizar procedimentos básicos'],
    topics: [
      { id: 'icm1', name: 'Enfermaria de Clínica Médica', description: 'Manejo de pacientes internados', keyPoints: ['Evolução diária', 'Prescrição médica', 'Alta hospitalar'], references: ['Harrison Cap. diversos'] },
      { id: 'icm2', name: 'Ambulatório Geral', description: 'Consultas ambulatoriais', keyPoints: ['Anamnese completa', 'Exame físico dirigido', 'Plano terapêutico'], references: ['Harrison Cap. diversos'] },
      { id: 'icm3', name: 'Plantão de Emergência', description: 'Atendimento de urgência/emergência', keyPoints: ['Triagem: Manchester/ESI', 'ACLS/BLS', 'Sepse: pacote 1h'], references: ['ATLS, ACLS'] },
    ],
    mainReferences: ['Harrison TR. Principles of Internal Medicine. 21st ed.', 'Goldman L. Cecil Medicine. 27th ed.'],
  },
  {
    id: 'internato_cir', name: 'Internato - Cirurgia', year: 6, semester: 1, icon: '🔪', color: '#DC2626',
    category: 'estagio', hours: 480,
    description: 'Estágio obrigatório em centro cirúrgico, enfermaria cirúrgica e emergência.',
    objectives: ['Auxiliar em cirurgias', 'Manejar pós-operatório', 'Realizar suturas e drenagens'],
    topics: [
      { id: 'icir1', name: 'Centro Cirúrgico', description: 'Paramentação, instrumentação, técnica cirúrgica', keyPoints: ['Escovação, paramentação', 'Nós e suturas', 'Hemostasia'], references: ['Sabiston Cap.1-5'] },
      { id: 'icir2', name: 'Emergência Cirúrgica', description: 'Abdome agudo, trauma', keyPoints: ['ATLS: ABCDE', 'Abdome agudo: perfurativo, obstrutivo, inflamatório', 'FAST'], references: ['ATLS 10ª ed.'] },
    ],
    mainReferences: ['Sabiston DC. Textbook of Surgery. 21st ed.', 'ATLS. 10ª ed.'],
  },
  {
    id: 'internato_go', name: 'Internato - Ginecologia e Obstetrícia', year: 6, semester: 2, icon: '🤰', color: '#EC4899',
    category: 'estagio', hours: 480,
    description: 'Estágio obrigatório em pré-natal, centro obstétrico e ambulatório de ginecologia.',
    objectives: ['Acompanhar pré-natal', 'Assistir partos', 'Manejar emergências obstétricas'],
    topics: [
      { id: 'igo1', name: 'Pré-Natal', description: 'Consultas, exames, vacinas', keyPoints: ['Mínimo 6 consultas', 'Exames por trimestre', 'Suplementação: ácido fólico + ferro'], references: ['Rezende Cap.10-15'] },
      { id: 'igo2', name: 'Centro Obstétrico', description: 'Trabalho de parto, partograma', keyPoints: ['Fases: dilatação, expulsão, dequitação', 'Partograma: linha de alerta/ação', 'Episiotomia seletiva'], references: ['Rezende Cap.20-25'] },
    ],
    mainReferences: ['Rezende J. Obstetrícia. 14ª ed.', 'Berek JS. Berek & Novak\'s Gynecology. 16th ed.'],
  },
  {
    id: 'internato_ped', name: 'Internato - Pediatria', year: 6, semester: 2, icon: '👶', color: '#F472B6',
    category: 'estagio', hours: 480,
    description: 'Estágio obrigatório em puericultura, enfermaria pediátrica e emergência.',
    objectives: ['Realizar puericultura', 'Manejar doenças prevalentes na infância', 'Reanimação neonatal'],
    topics: [
      { id: 'iped1', name: 'Puericultura', description: 'Crescimento, desenvolvimento, vacinas', keyPoints: ['Curvas de crescimento OMS', 'Marcos do desenvolvimento', 'Calendário vacinal PNI'], references: ['Nelson Cap.1-10'] },
      { id: 'iped2', name: 'Emergência Pediátrica', description: 'PALS, desidratação, convulsão febril', keyPoints: ['PALS: algoritmos', 'Desidratação: planos A, B, C', 'Bronquiolite: suporte'], references: ['Nelson Cap.60-70'] },
    ],
    mainReferences: ['Nelson WE. Textbook of Pediatrics. 22nd ed.', 'SBP. Tratado de Pediatria. 5ª ed.'],
  },
  {
    id: 'internato_sc', name: 'Internato - Saúde Coletiva', year: 6, semester: 2, icon: '🌍', color: '#059669',
    category: 'estagio', hours: 240,
    description: 'Estágio em UBS, ESF, vigilância epidemiológica e gestão em saúde.',
    objectives: ['Atuar na Estratégia Saúde da Família', 'Realizar ações de vigilância', 'Compreender gestão do SUS'],
    topics: [
      { id: 'isc1', name: 'ESF e APS', description: 'Atenção Primária à Saúde', keyPoints: ['Território, adscrição', 'Visita domiciliar', 'Grupos operativos'], references: ['Starfield B. APS'] },
      { id: 'isc2', name: 'Vigilância em Saúde', description: 'Epidemiológica, sanitária, ambiental', keyPoints: ['Notificação compulsória', 'Investigação de surtos', 'Indicadores de saúde'], references: ['MS Guia de Vigilância'] },
    ],
    mainReferences: ['Starfield B. Atenção Primária.', 'Duncan BB. Medicina Ambulatorial. 5ª ed.'],
  },
  // === NOVAS DISCIPLINAS ===
  {
    id: 'geriatria', name: 'Geriatria e Gerontologia', year: 5, semester: 1, icon: '👴', color: '#6B7280',
    category: 'clinica', hours: 60,
    description: 'Saúde do idoso: síndromes geriátricas, polifarmácia, avaliação geriátrica ampla, cuidados paliativos.',
    objectives: ['Realizar avaliação geriátrica ampla', 'Manejar síndromes geriátricas', 'Prescrever com segurança no idoso'],
    topics: [
      { id: 'ger1', name: 'Avaliação Geriátrica Ampla', description: 'Funcionalidade, cognição, humor, mobilidade, nutrição', keyPoints: ['Katz (AVDs)', 'Lawton (AIVDs)', 'Mini-Mental (MEEM)', 'GDS-15 (depressão)'], references: ['Freitas EV. Tratado de Geriatria Cap.1-5'], clinicalCorrelation: 'Fragilidade, sarcopenia' },
      { id: 'ger2', name: 'Síndromes Geriátricas', description: 'Quedas, incontinência, delirium, demência, imobilidade', keyPoints: ['5 Is: instabilidade, incontinência, iatrogenia, insuficiência cognitiva, imobilidade', 'Delirium vs demência', 'Prevenção de quedas'], references: ['Freitas EV. Cap.10-20'], clinicalCorrelation: 'Fratura de fêmur, úlcera de pressão' },
      { id: 'ger3', name: 'Farmacologia Geriátrica', description: 'Polifarmácia, critérios de Beers, desprescrição', keyPoints: ['Critérios de Beers/STOPP-START', 'Cascata iatrogênica', 'Ajuste renal e hepático'], references: ['AGS Beers Criteria 2023'], clinicalCorrelation: 'Reações adversas, interações' },
      { id: 'ger4', name: 'Cuidados Paliativos', description: 'Controle de sintomas, comunicação, fim de vida', keyPoints: ['Escala de dor (EVA)', 'Escada analgésica OMS', 'Diretivas antecipadas de vontade', 'Comunicação de más notícias (SPIKES)'], references: ['ANCP Manual de Cuidados Paliativos'], clinicalCorrelation: 'Sedação paliativa, dispneia terminal' },
    ],
    mainReferences: ['Freitas EV. Tratado de Geriatria e Gerontologia. 5ª ed.', 'Moraes EN. Princípios Básicos de Geriatria. 2ª ed.'],
  },
  {
    id: 'genetica', name: 'Genética Médica', year: 2, semester: 2, icon: '🧬', color: '#7C3AED',
    category: 'basica', hours: 60,
    description: 'Genética clínica, padrões de herança, cromossomopatias, aconselhamento genético, genômica.',
    objectives: ['Reconhecer padrões de herança', 'Interpretar cariótipo', 'Realizar aconselhamento genético'],
    topics: [
      { id: 'gen1', name: 'Padrões de Herança', description: 'Autossômica dominante/recessiva, ligada ao X', keyPoints: ['AD: Marfan, NF1, Huntington', 'AR: fibrose cística, anemia falciforme', 'Ligada ao X: hemofilia, Duchenne'], references: ['Thompson Genética Cap.7'] },
      { id: 'gen2', name: 'Cromossomopatias', description: 'Aneuploidias, deleções, translocações', keyPoints: ['Down (trissomia 21)', 'Turner (45,X)', 'Klinefelter (47,XXY)', 'Patau, Edwards'], references: ['Thompson Cap.5-6'] },
      { id: 'gen3', name: 'Genômica e Farmacogenômica', description: 'Sequenciamento, terapia gênica, medicina personalizada', keyPoints: ['NGS: next-generation sequencing', 'CRISPR-Cas9', 'Farmacogenômica: CYP450'], references: ['Thompson Cap.18-19'] },
      { id: 'gen4', name: 'Aconselhamento Genético', description: 'Cálculo de risco, diagnóstico pré-natal', keyPoints: ['Heredograma', 'Amniocentese, biópsia de vilo corial', 'NIPT (teste pré-natal não invasivo)'], references: ['Thompson Cap.16'] },
    ],
    mainReferences: ['Thompson & Thompson. Genética Médica. 8ª ed.', 'Nussbaum RL. Genética Médica. 8ª ed.'],
  },
  {
    id: 'medicina_familia', name: 'Medicina de Família e Comunidade', year: 4, semester: 1, icon: '🏠', color: '#059669',
    category: 'clinica', hours: 120,
    description: 'Atenção primária à saúde, abordagem centrada na pessoa, longitudinalidade, integralidade.',
    objectives: ['Aplicar método clínico centrado na pessoa', 'Manejar problemas mais prevalentes na APS', 'Utilizar ferramentas de abordagem familiar'],
    topics: [
      { id: 'mfc1', name: 'Método Clínico Centrado na Pessoa', description: 'MCCP de Stewart, agenda do paciente', keyPoints: ['Explorar doença e experiência da doença', 'Entender a pessoa como um todo', 'Elaborar plano conjunto', 'Ser realista'], references: ['Stewart M. MCCP Cap.1-6'] },
      { id: 'mfc2', name: 'Abordagem Familiar', description: 'Genograma, FIRO, ciclo de vida familiar', keyPoints: ['Genograma: 3 gerações', 'Ecomapa', 'PRACTICE (ferramenta de crise)', 'Ciclo vital de Duvall'], references: ['McWhinney Cap.10-12'] },
      { id: 'mfc3', name: 'Problemas Prevalentes na APS', description: 'HAS, DM, lombalgia, IVAS, depressão', keyPoints: ['CIAP-2: classificação', 'Rastreamento: mama, colo, colorretal', 'Prevenção quaternária'], references: ['Duncan BB. Medicina Ambulatorial Cap.1-20'] },
      { id: 'mfc4', name: 'Saúde da Mulher na APS', description: 'Pré-natal de baixo risco, planejamento familiar, climatério', keyPoints: ['Pré-natal: mínimo 6 consultas', 'Métodos contraceptivos', 'Rastreamento de CA de mama e colo'], references: ['MS Cadernos de Atenção Básica'] },
      { id: 'mfc5', name: 'Saúde da Criança na APS', description: 'Puericultura, AIDPI, aleitamento materno', keyPoints: ['Marcos do desenvolvimento', 'Calendário vacinal PNI', 'AIDPI: classificação de risco', 'Aleitamento exclusivo até 6 meses'], references: ['MS Saúde da Criança'] },
    ],
    mainReferences: ['Duncan BB. Medicina Ambulatorial. 5ª ed.', 'Gusso G. Tratado de MFC. 2ª ed.', 'Stewart M. Medicina Centrada na Pessoa. 3ª ed.'],
  },
  {
    id: 'endocrinologia', name: 'Endocrinologia', year: 4, semester: 2, icon: '🦋', color: '#D97706',
    category: 'clinica', hours: 60,
    description: 'Doenças endócrinas: diabetes, tireoide, adrenal, hipófise, metabolismo ósseo.',
    objectives: ['Diagnosticar e tratar diabetes mellitus', 'Manejar doenças tireoidianas', 'Investigar doenças adrenais e hipofisárias'],
    topics: [
      { id: 'endo1', name: 'Diabetes Mellitus', description: 'DM1, DM2, gestacional, complicações', keyPoints: ['Critérios diagnósticos: GJ, TOTG, HbA1c', 'DM1: insulina desde o início', 'DM2: metformina + escalonamento', 'Complicações: retinopatia, nefropatia, neuropatia'], references: ['SBD Diretrizes 2024-2025'] },
      { id: 'endo2', name: 'Tireoide', description: 'Hipo/hipertireoidismo, nódulos, câncer', keyPoints: ['Hipotireoidismo: TSH alto, T4L baixo → levotiroxina', 'Graves: TRAb, metimazol', 'Nódulo: PAAF se > 1cm ou suspeito', 'Bethesda I-VI'], references: ['ATA Guidelines 2023'] },
      { id: 'endo3', name: 'Adrenal', description: 'Cushing, Addison, feocromocitoma, hiperaldosteronismo', keyPoints: ['Cushing: cortisol livre urinário, supressão com dexa', 'Addison: hiperpigmentação, hipotensão', 'Feocromocitoma: metanefrinas', 'Conn: aldosterona/renina'], references: ['Williams Endocrinology Cap.15-16'] },
      { id: 'endo4', name: 'Metabolismo Ósseo', description: 'Osteoporose, hiperparatireoidismo, Paget', keyPoints: ['DEXA: T-score ≤ -2,5', 'Bisfosfonatos: alendronato', 'HPT primário: hipercalcemia + PTH elevado'], references: ['Williams Cap.29-30'] },
    ],
    mainReferences: ['Vilar L. Endocrinologia Clínica. 7ª ed.', 'Williams RH. Williams Textbook of Endocrinology. 14th ed.'],
  },
  {
    id: 'gastroenterologia', name: 'Gastroenterologia', year: 4, semester: 2, icon: '🫁', color: '#DC2626',
    category: 'clinica', hours: 60,
    description: 'Doenças do aparelho digestivo: esôfago, estômago, intestinos, fígado, pâncreas.',
    objectives: ['Diagnosticar e tratar doenças gastrointestinais', 'Manejar hepatopatias crônicas', 'Indicar endoscopia e colonoscopia'],
    topics: [
      { id: 'gastro1', name: 'Doenças do Esôfago', description: 'DRGE, Barrett, acalasia, câncer', keyPoints: ['DRGE: IBP 4-8 semanas', 'Barrett: metaplasia intestinal', 'Acalasia: bico de pássaro', 'Ca esôfago: disfagia progressiva'], references: ['Sleisenger Cap.44-47'] },
      { id: 'gastro2', name: 'Doenças Gástricas', description: 'Úlcera péptica, H. pylori, câncer gástrico', keyPoints: ['H. pylori: claritromicina + amoxicilina + IBP', 'Úlcera gástrica: sempre biopsiar', 'Ca gástrico: Lauren (intestinal vs difuso)'], references: ['Sleisenger Cap.53-55'] },
      { id: 'gastro3', name: 'Hepatologia', description: 'Hepatites, cirrose, hepatocarcinoma', keyPoints: ['Hepatite B: HBsAg, anti-HBc, anti-HBs', 'Hepatite C: anti-HCV, PCR', 'Cirrose: Child-Pugh, MELD', 'CHC: rastreamento com USG + AFP'], references: ['Sleisenger Cap.79-85'] },
      { id: 'gastro4', name: 'Doenças Intestinais', description: 'DII, SII, doença celíaca, câncer colorretal', keyPoints: ['Crohn: transmural, qualquer segmento', 'RCU: mucosa, reto → cólon', 'Celíaca: anti-tTG IgA', 'CCR: colonoscopia a partir dos 45 anos'], references: ['Sleisenger Cap.115-127'] },
      { id: 'gastro5', name: 'Pâncreas e Vias Biliares', description: 'Pancreatite, colelitíase, colangite', keyPoints: ['Pancreatite aguda: Ranson, APACHE II', 'Colelitíase: colecistectomia VLP', 'Colangite: tríade de Charcot (febre, icterícia, dor)'], references: ['Sleisenger Cap.58-62'] },
    ],
    mainReferences: ['Sleisenger MH. Gastrointestinal and Liver Disease. 11th ed.', 'Dani R. Gastroenterologia Essencial. 4ª ed.'],
  },
  {
    id: 'hematologia', name: 'Hematologia', year: 4, semester: 1, icon: '🩸', color: '#B91C1C',
    category: 'clinica', hours: 60,
    description: 'Doenças do sangue: anemias, leucemias, linfomas, distúrbios da coagulação.',
    objectives: ['Classificar e tratar anemias', 'Reconhecer neoplasias hematológicas', 'Manejar distúrbios da hemostasia'],
    topics: [
      { id: 'hema1', name: 'Anemias', description: 'Ferropriva, megaloblástica, hemolítica, aplástica', keyPoints: ['Ferropriva: ferritina baixa, VCM baixo', 'Megaloblástica: B12/folato, VCM alto', 'Falciforme: eletroforese HbS', 'Hemolítica: reticulócitos altos, LDH alto, haptoglobina baixa'], references: ['Hoffbrand Cap.3-8'] },
      { id: 'hema2', name: 'Leucemias', description: 'LLA, LMA, LLC, LMC', keyPoints: ['LLA: criança, blastos linfoides', 'LMA: adulto, bastonetes de Auer', 'LMC: cromossomo Philadelphia', 'LLC: linfocitose, idoso'], references: ['Hoffbrand Cap.11-14'] },
      { id: 'hema3', name: 'Linfomas', description: 'Hodgkin e não-Hodgkin', keyPoints: ['Hodgkin: Reed-Sternberg, bimodal', 'NHL: mais comum, heterogêneo', 'Estadiamento: Ann Arbor'], references: ['Hoffbrand Cap.15-16'] },
      { id: 'hema4', name: 'Hemostasia', description: 'Coagulopatias, trombofilia, CIVD', keyPoints: ['Hemofilia A: fator VIII', 'Von Willebrand: mais comum', 'CIVD: consumo de fatores', 'Trombofilia: fator V Leiden'], references: ['Hoffbrand Cap.18-20'] },
    ],
    mainReferences: ['Hoffbrand AV. Fundamentos em Hematologia. 7ª ed.', 'Zago MA. Hematologia: Fundamentos e Prática. 2ª ed.'],
  },
  {
    id: 'nefrologia', name: 'Nefrologia', year: 4, semester: 2, icon: '🫘', color: '#7C2D12',
    category: 'clinica', hours: 60,
    description: 'Doenças renais: glomerulopatias, IRA, DRC, distúrbios eletrolíticos, diálise.',
    objectives: ['Classificar e manejar lesão renal aguda', 'Estadiar doença renal crônica', 'Corrigir distúrbios hidroeletrolíticos'],
    topics: [
      { id: 'nefro1', name: 'Lesão Renal Aguda', description: 'Pré-renal, renal, pós-renal, KDIGO', keyPoints: ['Pré-renal: FENa < 1%', 'NTA: principal causa renal', 'Pós-renal: obstrução', 'KDIGO: estágios 1-3'], references: ['Riella MC. Cap.15-18'] },
      { id: 'nefro2', name: 'Doença Renal Crônica', description: 'Estadiamento, progressão, TRS', keyPoints: ['Estágios G1-G5 (TFG)', 'IECA/BRA: nefroproteção', 'Diálise: TFG < 10-15 mL/min', 'Transplante renal'], references: ['KDIGO Guidelines 2024'] },
      { id: 'nefro3', name: 'Glomerulopatias', description: 'Síndrome nefrítica, nefrótica, GNRP', keyPoints: ['Nefrítica: hematúria, HAS, oligúria', 'Nefrótica: proteinúria > 3,5g, edema', 'GNDA pós-estreptocócica: C3 baixo', 'Lesão mínima: criança, corticoide'], references: ['Riella Cap.10-14'] },
      { id: 'nefro4', name: 'Distúrbios Hidroeletrolíticos', description: 'Na+, K+, Ca2+, Mg2+, ácido-base', keyPoints: ['Hiponatremia: mais comum', 'Hipercalemia: ECG + gluconato de Ca', 'Acidose metabólica: AG normal vs elevado', 'Alcalose metabólica: Cl-responsiva vs resistente'], references: ['Riella Cap.5-9'] },
    ],
    mainReferences: ['Riella MC. Princípios de Nefrologia e Distúrbios Hidroeletrolíticos. 6ª ed.', 'Brenner BM. The Kidney. 11th ed.'],
  },
  {
    id: 'pneumologia', name: 'Pneumologia', year: 4, semester: 1, icon: '🫁', color: '#0EA5E9',
    category: 'clinica', hours: 60,
    description: 'Doenças respiratórias: asma, DPOC, pneumonias, tuberculose, câncer de pulmão.',
    objectives: ['Interpretar espirometria e gasometria', 'Manejar asma e DPOC', 'Diagnosticar e tratar tuberculose'],
    topics: [
      { id: 'pneumo1', name: 'Asma', description: 'Diagnóstico, classificação, tratamento escalonado', keyPoints: ['Espirometria: obstrução reversível', 'Steps GINA 1-5', 'CI: pilar do tratamento', 'Crise: SABA + corticoide sistêmico'], references: ['GINA 2024'] },
      { id: 'pneumo2', name: 'DPOC', description: 'Diagnóstico, GOLD, exacerbações', keyPoints: ['VEF1/CVF < 0,7 pós-BD', 'GOLD A-E', 'LABA + LAMA ± CI', 'O2 domiciliar: PaO2 < 55'], references: ['GOLD 2024'] },
      { id: 'pneumo3', name: 'Pneumonias', description: 'PAC, PH, PAV, agentes, tratamento', keyPoints: ['PAC: CURB-65, pneumococo', 'PH: Pseudomonas, MRSA', 'Atípicos: Mycoplasma, Legionella', 'PAC leve: amoxicilina ou macrolídeo'], references: ['SBPT Diretrizes PAC 2022'] },
      { id: 'pneumo4', name: 'Tuberculose', description: 'Diagnóstico, RIPE, TB latente, MDR', keyPoints: ['BAAR + cultura + TRM-TB', 'RIPE: 2RHZE + 4RH', 'TB latente: isoniazida 6-9 meses', 'MDR: esquema especial'], references: ['MS Manual de TB 2024'] },
      { id: 'pneumo5', name: 'Câncer de Pulmão', description: 'CPNPC, CPPC, estadiamento, tratamento', keyPoints: ['Tabagismo: principal fator', 'CPNPC: 85% dos casos', 'Rastreamento: TC baixa dose (fumantes)', 'Estadiamento TNM'], references: ['NCCN Guidelines'] },
    ],
    mainReferences: ['Tarantino AB. Doenças Pulmonares. 6ª ed.', 'SBPT. Diretrizes Brasileiras.', 'GINA/GOLD Reports 2024.'],
  },
  {
    id: 'reumatologia', name: 'Reumatologia', year: 5, semester: 1, icon: '🦴', color: '#9333EA',
    category: 'clinica', hours: 60,
    description: 'Doenças autoimunes e do tecido conjuntivo: artrite reumatoide, lúpus, espondiloartrites.',
    objectives: ['Diagnosticar doenças autoimunes sistêmicas', 'Interpretar autoanticorpos', 'Manejar imunossupressão'],
    topics: [
      { id: 'reuma1', name: 'Artrite Reumatoide', description: 'Diagnóstico, DMARDs, biológicos', keyPoints: ['Critérios ACR/EULAR 2010', 'FR + anti-CCP', 'MTX: 1ª linha', 'Anti-TNF se refratário'], references: ['Firestein Cap.69-75'] },
      { id: 'reuma2', name: 'Lúpus Eritematoso Sistêmico', description: 'Manifestações, critérios, nefrite lúpica', keyPoints: ['Critérios SLICC/EULAR-ACR', 'FAN, anti-dsDNA, anti-Sm', 'Nefrite: classes I-VI', 'Hidroxicloroquina para todos'], references: ['Firestein Cap.79-82'] },
      { id: 'reuma3', name: 'Espondiloartrites', description: 'EA, artrite psoriásica, reativa', keyPoints: ['EA: sacroileíte, HLA-B27', 'Artrite psoriásica: dactilite', 'Reativa: artrite + uretrite + conjuntivite'], references: ['Firestein Cap.74-78'] },
      { id: 'reuma4', name: 'Vasculites', description: 'Grandes, médios e pequenos vasos', keyPoints: ['Grandes: Takayasu, arterite temporal', 'Médios: PAN, Kawasaki', 'Pequenos: ANCA (Wegener, MPA)', 'Imunocomplexos: crioglobulinemia'], references: ['Firestein Cap.87-92'] },
    ],
    mainReferences: ['Firestein GS. Kelley & Firestein\'s Textbook of Rheumatology. 11th ed.', 'Shinjo SK. Reumatologia. 2ª ed.'],
  },
  {
    id: 'anestesiologia', name: 'Anestesiologia', year: 5, semester: 2, icon: '💉', color: '#475569',
    category: 'cirurgica', hours: 60,
    description: 'Anestesia geral e regional, avaliação pré-anestésica, dor aguda e crônica.',
    objectives: ['Realizar avaliação pré-anestésica', 'Conhecer técnicas anestésicas', 'Manejar via aérea e dor'],
    topics: [
      { id: 'anest1', name: 'Avaliação Pré-Anestésica', description: 'ASA, Mallampati, jejum, exames', keyPoints: ['ASA I-VI', 'Mallampati I-IV', 'Jejum: 2h líquidos claros, 6h sólidos leves, 8h gordurosos', 'Exames conforme comorbidades'], references: ['Miller Cap.31-33'] },
      { id: 'anest2', name: 'Anestesia Geral', description: 'Indução, manutenção, despertar, agentes', keyPoints: ['Propofol: indução', 'Sevoflurano: manutenção inalatória', 'Opioides: fentanil, remifentanil', 'BNM: succinilcolina, rocurônio'], references: ['Miller Cap.34-40'] },
      { id: 'anest3', name: 'Anestesia Regional', description: 'Raqui, peridural, bloqueios periféricos', keyPoints: ['Raqui: subaracnoideo, bupivacaína hiperbárica', 'Peridural: cateter, analgesia pós-op', 'Bloqueios: USG-guiado'], references: ['Miller Cap.56-60'] },
      { id: 'anest4', name: 'Manejo da Via Aérea', description: 'IOT, via aérea difícil, cricotireoidostomia', keyPoints: ['Laringoscopia direta e videolaringoscopia', 'Dispositivos supraglóticos', 'Via aérea difícil: algoritmo ASA', 'Cricotireoidostomia: último recurso'], references: ['Miller Cap.44-47'] },
    ],
    mainReferences: ['Miller RD. Miller\'s Anesthesia. 9th ed.', 'Barash PG. Clinical Anesthesia. 8th ed.'],
  },
  {
    id: 'medicina_trabalho', name: 'Medicina do Trabalho', year: 3, semester: 2, icon: '🏭', color: '#CA8A04',
    category: 'saude_publica', hours: 60,
    description: 'Saúde do trabalhador: doenças ocupacionais, ergonomia, legislação, perícia.',
    objectives: ['Reconhecer doenças ocupacionais', 'Aplicar legislação trabalhista em saúde', 'Realizar exames ocupacionais'],
    topics: [
      { id: 'mtrab1', name: 'Doenças Ocupacionais', description: 'PAIR, LER/DORT, pneumoconioses, dermatoses', keyPoints: ['PAIR: perda auditiva por ruído', 'LER/DORT: movimentos repetitivos', 'Silicose, asbestose', 'Dermatite de contato ocupacional'], references: ['Mendes R. Patologia do Trabalho Cap.1-10'] },
      { id: 'mtrab2', name: 'Legislação e NRs', description: 'CLT, NRs, CAT, PCMSO, PGR', keyPoints: ['NR-7: PCMSO', 'NR-9: PGR (antigo PPRA)', 'CAT: comunicação de acidente', 'Nexo técnico epidemiológico'], references: ['NRs do MTE'] },
      { id: 'mtrab3', name: 'Exames Ocupacionais', description: 'Admissional, periódico, demissional, retorno, mudança de função', keyPoints: ['ASO: Atestado de Saúde Ocupacional', 'Exames complementares conforme risco', 'Periodicidade: anual ou bianual'], references: ['NR-7 PCMSO'] },
    ],
    mainReferences: ['Mendes R. Patologia do Trabalho. 3ª ed.', 'Vieira SI. Medicina Básica do Trabalho. 5ª ed.'],
  },
  {
    id: 'nutrologia', name: 'Nutrologia e Nutrição Clínica', year: 3, semester: 1, icon: '🥗', color: '#16A34A',
    category: 'clinica', hours: 60,
    description: 'Nutrição clínica, avaliação nutricional, terapia nutricional, distúrbios alimentares.',
    objectives: ['Realizar avaliação nutricional completa', 'Prescrever terapia nutricional', 'Manejar distúrbios alimentares'],
    topics: [
      { id: 'nutro1', name: 'Avaliação Nutricional', description: 'Antropometria, composição corporal, exames', keyPoints: ['IMC: < 18,5 desnutrição, > 30 obesidade', 'Circunferência abdominal', 'Albumina, pré-albumina, transferrina', 'ASG (Avaliação Subjetiva Global)'], references: ['Cuppari L. Cap.1-5'] },
      { id: 'nutro2', name: 'Terapia Nutricional', description: 'Enteral, parenteral, suplementação', keyPoints: ['TNE: sonda nasogástrica, nasoentérica', 'TNP: acesso central, formulação', 'Síndrome de realimentação: hipofosfatemia', 'Cálculo calórico: 25-30 kcal/kg/dia'], references: ['Cuppari L. Cap.10-15'] },
      { id: 'nutro3', name: 'Obesidade', description: 'Diagnóstico, tratamento clínico e cirúrgico', keyPoints: ['IMC ≥ 40 ou ≥ 35 com comorbidades: cirurgia', 'Bypass gástrico, sleeve', 'Medicamentos: semaglutida, liraglutida', 'Mudança de estilo de vida'], references: ['SBCBM Diretrizes'] },
      { id: 'nutro4', name: 'Distúrbios Alimentares', description: 'Anorexia nervosa, bulimia, compulsão alimentar', keyPoints: ['Anorexia: IMC < 17,5, amenorreia', 'Bulimia: purgação, sinal de Russell', 'TCAP: episódios de compulsão sem purgação'], references: ['DSM-5 Feeding Disorders'] },
    ],
    mainReferences: ['Cuppari L. Nutrição Clínica no Adulto. 4ª ed.', 'Waitzberg DL. Nutrição Oral, Enteral e Parenteral. 5ª ed.'],
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
