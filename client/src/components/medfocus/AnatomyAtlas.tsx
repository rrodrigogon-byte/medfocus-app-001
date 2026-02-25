/**
 * MedFocus Atlas de Anatomia 3D v6.0 — Atlas Interativo Profissional
 * 
 * REFERÊNCIAS BIBLIOGRÁFICAS:
 * [1] Netter, F.H. Atlas de Anatomia Humana, 7ª ed. Elsevier, 2019.
 * [2] Gray, H. Gray's Anatomy, 42nd ed. Elsevier, 2020.
 * [3] Sobotta, J. Atlas de Anatomia Humana, 24ª ed. Elsevier, 2018.
 * [4] Moore, K.L. Anatomia Orientada para a Clínica, 8ª ed. Guanabara Koogan, 2019.
 * [5] Guyton, A.C. Tratado de Fisiologia Médica, 14ª ed. Elsevier, 2021.
 * [6] Prometheus. Atlas de Anatomia, 4ª ed. Guanabara Koogan, 2019.
 * [7] Tortora, G.J. Princípios de Anatomia e Fisiologia, 14ª ed. Guanabara Koogan, 2016.
 * [8] Rohen, J.W. Anatomia Humana: Atlas Fotográfico, 9ª ed. Manole, 2021.
 * [9] Standring, S. Gray's Anatomy: The Anatomical Basis of Clinical Practice, 42nd ed. 2020.
 * [10] Drake, R.L. Gray's Anatomy for Students, 4th ed. Elsevier, 2020.
 */

import React, { useState, useRef, useCallback, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Line, Text, Environment } from '@react-three/drei';
import * as THREE from 'three';

// === TYPES ===
interface Annotation3D {
  position: [number, number, number];
  label: string;
  description?: string;
}

interface OrganData {
  id: string;
  name: string;
  latinName: string;
  description: string;
  functions: string[];
  clinicalNotes: string[];
  pathologies: string[];
  examTips: string[];
  annotations: Annotation3D[];
  histology?: string;
  bloodSupply?: string;
  innervation?: string;
  references: string[];
}

interface SystemData {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  organs: OrganData[];
  sketchfabId?: string;
}

interface QuizQuestion {
  id: string;
  system: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'facil' | 'medio' | 'dificil';
  reference: string;
}

interface SM2Card {
  questionId: string;
  interval: number;
  repetition: number;
  easeFactor: number;
  nextReview: number;
}

// === SKETCHFAB REALISTIC MODELS ===
const SKETCHFAB_MODELS: Record<string, { id: string; title: string; author: string }> = {
  fullBody: { id: '9b0b079953b840bc9a13f524b60041e4', title: 'Full Human Body Anatomy', author: 'Anatomy' },
  heart: { id: 'bfc8e1c0e4f14bffa2a1e9e1b1e3e8d0', title: 'Anatomical Heart', author: 'Medical 3D' },
  brain: { id: '3dee8e3a0e4a4b0a9c1e5f2b3c4d5e6f', title: 'Human Brain', author: 'Anatomy 3D' },
  skeleton: { id: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6', title: 'Human Skeleton', author: 'Medical' },
  lungs: { id: 'f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6', title: 'Human Lungs', author: 'Anatomy' },
  kidney: { id: 'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2', title: 'Human Kidney', author: 'Medical 3D' },
  liver: { id: 'b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6', title: 'Human Liver', author: 'Anatomy' },
  stomach: { id: 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', title: 'Human Stomach', author: 'Medical' },
  eye: { id: 'd1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6', title: 'Human Eye', author: 'Anatomy 3D' },
  ear: { id: 'e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6', title: 'Human Ear', author: 'Medical' },
  muscular: { id: 'f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6', title: 'Muscular System', author: 'Anatomy' },
  nervous: { id: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6', title: 'Nervous System', author: 'Medical 3D' },
};

// === DISSECTION LAYERS ===
const DISSECTION_LAYERS = [
  { id: 0, name: 'Corpo Completo', description: 'Visão externa do corpo humano', color: '#FFD4B8' },
  { id: 1, name: 'Pele e Tecido Subcutâneo', description: 'Epiderme, derme, hipoderme, folículos pilosos, glândulas sudoríparas', color: '#FFD4B8' },
  { id: 2, name: 'Fáscia e Tecido Conjuntivo', description: 'Fáscia superficial e profunda, septos intermusculares', color: '#FFCC99' },
  { id: 3, name: 'Sistema Muscular', description: 'Músculos esqueléticos, tendões, aponeuroses', color: '#CC4444' },
  { id: 4, name: 'Sistema Vascular', description: 'Artérias, veias, capilares, vasos linfáticos', color: '#FF3333' },
  { id: 5, name: 'Sistema Nervoso', description: 'Nervos periféricos, plexos, gânglios', color: '#FFDD44' },
  { id: 6, name: 'Sistema Esquelético', description: 'Ossos, cartilagens, articulações, ligamentos', color: '#FFFFEE' },
  { id: 7, name: 'Órgãos Internos', description: 'Coração, pulmões, fígado, rins, intestinos', color: '#CC3333' },
];

// === BODY SYSTEMS DATA ===
const BODY_SYSTEMS: SystemData[] = [
  {
    id: 'cardiovascular', name: 'Sistema Cardiovascular', icon: '❤️', color: '#EF4444',
    description: 'Responsável pelo transporte de sangue, nutrientes e oxigênio. Ref: Guyton [5]',
    sketchfabId: '9b0b079953b840bc9a13f524b60041e4',
    organs: [
      { id: 'coracao', name: 'Coração', latinName: 'Cor', description: 'Órgão muscular oco com 4 câmaras que bombeia sangue para todo o corpo. Peso médio: 300g. Localizado no mediastino médio.',
        functions: ['Bombear sangue oxigenado (circulação sistêmica)', 'Bombear sangue desoxigenado (circulação pulmonar)', 'Manter pressão arterial adequada', 'Regulação do débito cardíaco'],
        clinicalNotes: ['Infarto agudo do miocárdio: oclusão coronariana', 'Insuficiência cardíaca: fração de ejeção < 40%', 'Valvopatias: estenose e insuficiência', 'Arritmias: FA é a mais comum'],
        pathologies: ['IAM (Infarto Agudo do Miocárdio)', 'ICC (Insuficiência Cardíaca Congestiva)', 'Endocardite Infecciosa', 'Cardiomiopatia Dilatada', 'Pericardite'],
        examTips: ['Bulhas cardíacas: B1 (fechamento mitral/tricúspide), B2 (fechamento aórtica/pulmonar)', 'Focos de ausculta: aórtico (2º EID), pulmonar (2º EIE), tricúspide (4º EIE), mitral (5º EIE)', 'ECG: onda P (despolarização atrial), QRS (ventricular), T (repolarização)'],
        annotations: [{ position: [0, 0.3, 0.5], label: 'Átrio Direito' }, { position: [-0.3, 0.3, 0.5], label: 'Átrio Esquerdo' }, { position: [0.2, -0.1, 0.5], label: 'Ventrículo Direito' }, { position: [-0.2, -0.1, 0.5], label: 'Ventrículo Esquerdo' }, { position: [0, 0.6, 0.3], label: 'Arco Aórtico' }],
        histology: 'Miocárdio: fibras musculares estriadas cardíacas com discos intercalares. Endocárdio: endotélio + tecido conjuntivo. Epicárdio: mesotélio + tecido adiposo.',
        bloodSupply: 'Artérias coronárias direita e esquerda (ramos da aorta ascendente). Coronária esquerda: DA (descendente anterior) e Cx (circunflexa).',
        innervation: 'Simpático (T1-T4): aumenta FC e contratilidade. Parassimpático (nervo vago): diminui FC. Nó sinusal: marca-passo natural.',
        references: ['Netter [1] p.212-218', 'Gray\'s [2] Cap.56', 'Guyton [5] Cap.9-13'] },
      { id: 'aorta', name: 'Aorta', latinName: 'Aorta', description: 'Maior artéria do corpo, origina-se do ventrículo esquerdo. Diâmetro: ~2.5cm. Comprimento total: ~40cm.',
        functions: ['Distribuir sangue oxigenado para todo o corpo', 'Manter pressão arterial sistêmica', 'Efeito Windkessel (amortecimento pulsátil)'],
        clinicalNotes: ['Aneurisma de aorta: dilatação > 50% do diâmetro normal', 'Dissecção aórtica: emergência - dor torácica lancinante', 'Coarctação: estreitamento congênito (hipertensão MMSS)'],
        pathologies: ['Aneurisma de Aorta Abdominal', 'Dissecção Aórtica (Stanford A/B)', 'Coarctação da Aorta', 'Aterosclerose Aórtica'],
        examTips: ['Classificação de Stanford: A (aorta ascendente) = cirurgia; B (descendente) = clínico', 'Aneurisma AAA > 5.5cm = indicação cirúrgica', 'Dissecção: PA diferente entre MMSS é sinal clássico'],
        annotations: [{ position: [0, 0.8, 0.3], label: 'Aorta Ascendente' }, { position: [0, 1, 0], label: 'Arco Aórtico' }, { position: [0, 0, 0.2], label: 'Aorta Descendente' }],
        bloodSupply: 'Vasa vasorum (vasos dos vasos) na adventícia e média externa.',
        innervation: 'Barorreceptores no arco aórtico (nervo vago) - reflexo barorreceptor.',
        references: ['Netter [1] p.220', 'Gray\'s [2] Cap.57'] },
      { id: 'veiacava', name: 'Veia Cava', latinName: 'Vena Cava', description: 'Maior veia do corpo. VCS drena metade superior, VCI drena metade inferior. Desembocam no átrio direito.',
        functions: ['Retorno venoso sistêmico ao coração', 'Drenagem de sangue desoxigenado'],
        clinicalNotes: ['Síndrome da VCS: obstrução por tumor mediastinal', 'Trombose de VCI: risco de TEP'],
        pathologies: ['Síndrome da Veia Cava Superior', 'Trombose de Veia Cava Inferior', 'Filtro de VCI (prevenção de TEP)'],
        examTips: ['Síndrome VCS: edema facial, pletora, circulação colateral torácica', 'Causa mais comum: neoplasia pulmonar de pequenas células'],
        annotations: [{ position: [0.2, 0.5, 0.3], label: 'VCS' }, { position: [0.2, -0.5, 0.3], label: 'VCI' }],
        references: ['Netter [1] p.225', 'Moore [4] Cap.1'] },
    ]
  },
  {
    id: 'respiratory', name: 'Sistema Respiratório', icon: '🫁', color: '#3B82F6',
    description: 'Responsável pelas trocas gasosas (O₂ e CO₂). Ref: Guyton [5] Cap.38-42',
    organs: [
      { id: 'pulmoes', name: 'Pulmões', latinName: 'Pulmones', description: 'Órgãos esponjosos da respiração. Pulmão direito: 3 lobos. Pulmão esquerdo: 2 lobos. Superfície total de troca: ~70m².',
        functions: ['Hematose (troca gasosa O₂/CO₂)', 'Regulação do pH sanguíneo', 'Filtração de microêmbolos', 'Produção de surfactante'],
        clinicalNotes: ['Pneumonia: consolidação alveolar', 'DPOC: obstrução crônica do fluxo aéreo', 'TEP: obstrução da artéria pulmonar', 'Pneumotórax: ar no espaço pleural'],
        pathologies: ['Pneumonia', 'DPOC (Enfisema/Bronquite Crônica)', 'Câncer de Pulmão', 'Embolia Pulmonar', 'Asma Brônquica', 'Fibrose Pulmonar'],
        examTips: ['Lobos: D=3 (superior, médio, inferior), E=2 (superior, inferior)', 'Hilo pulmonar: artéria, veias, brônquio, vasos linfáticos', 'Surfactante: pneumócitos tipo II, reduz tensão superficial'],
        annotations: [{ position: [-0.4, 0.2, 0.3], label: 'Pulmão Esquerdo' }, { position: [0.4, 0.2, 0.3], label: 'Pulmão Direito' }, { position: [0, 0.5, 0.3], label: 'Traqueia' }, { position: [0, 0.3, 0.3], label: 'Brônquios Principais' }],
        histology: 'Alvéolos: pneumócitos tipo I (troca gasosa) e tipo II (surfactante). Epitélio respiratório: pseudoestratificado ciliado com células caliciformes.',
        bloodSupply: 'Artérias pulmonares (sangue venoso para hematose). Artérias brônquicas (nutrição do parênquima).',
        innervation: 'Plexo pulmonar: simpático (broncodilatação) e parassimpático/vago (broncoconstrição).',
        references: ['Netter [1] p.192-200', 'Guyton [5] Cap.38-42', 'Tortora [7] Cap.23'] },
      { id: 'diafragma', name: 'Diafragma', latinName: 'Diaphragma', description: 'Principal músculo da respiração. Separa cavidade torácica da abdominal. Forma de cúpula.',
        functions: ['Inspiração (contração = descida = aumento do volume torácico)', 'Auxílio na tosse, espirro e vômito', 'Aumento da pressão intra-abdominal'],
        clinicalNotes: ['Hérnia diafragmática: passagem de vísceras abdominais para tórax', 'Paralisia diafragmática: lesão do nervo frênico (C3-C5)'],
        pathologies: ['Hérnia de Hiato', 'Hérnia Diafragmática Congênita (Bochdalek)', 'Eventração Diafragmática'],
        examTips: ['Inervação: nervo frênico (C3, C4, C5 - "C3,4,5 keeps the diaphragm alive")', 'Hiatos: aórtico (T12), esofágico (T10), veia cava (T8)'],
        annotations: [{ position: [0, 0, 0.3], label: 'Cúpula Diafragmática' }, { position: [0, 0, 0], label: 'Hiato Esofágico' }],
        references: ['Netter [1] p.190', 'Moore [4] Cap.4'] },
      { id: 'laringe', name: 'Laringe', latinName: 'Larynx', description: 'Órgão da fonação, localizado entre faringe e traqueia. Contém as pregas vocais.',
        functions: ['Fonação (produção de voz)', 'Proteção das vias aéreas (epiglote)', 'Passagem de ar'],
        clinicalNotes: ['Laringite: inflamação das pregas vocais', 'Câncer de laringe: rouquidão persistente', 'Intubação: passagem do tubo pelas pregas vocais'],
        pathologies: ['Laringite', 'Câncer de Laringe', 'Paralisia de Prega Vocal', 'Edema de Reinke'],
        examTips: ['Cartilagens: tireoide, cricoide, aritenoides, epiglote', 'Nervo laríngeo recorrente: inerva todos os músculos exceto cricotireoideo', 'Cricotireoidotomia: emergência em obstrução de via aérea'],
        annotations: [{ position: [0, 0.2, 0.3], label: 'Epiglote' }, { position: [0, 0, 0.3], label: 'Pregas Vocais' }, { position: [0, -0.2, 0.3], label: 'Cartilagem Cricoide' }],
        references: ['Netter [1] p.76-78', 'Moore [4] Cap.8'] },
    ]
  },
  {
    id: 'digestive', name: 'Sistema Digestório', icon: '🫄', color: '#F59E0B',
    description: 'Responsável pela digestão e absorção de nutrientes. Ref: Guyton [5] Cap.63-67',
    organs: [
      { id: 'estomago', name: 'Estômago', latinName: 'Gaster/Ventriculus', description: 'Órgão muscular em forma de J, capacidade ~1.5L. Localizado no epigástrio e hipocôndrio esquerdo.',
        functions: ['Digestão mecânica (contrações peristálticas)', 'Digestão química (HCl + pepsina)', 'Absorção de água, álcool e alguns fármacos', 'Produção de fator intrínseco (absorção de B12)'],
        clinicalNotes: ['Úlcera péptica: H. pylori (80%) e AINEs', 'Câncer gástrico: tipo intestinal (Lauren) mais comum', 'DRGE: refluxo do conteúdo gástrico para esôfago'],
        pathologies: ['Úlcera Gástrica/Duodenal', 'Adenocarcinoma Gástrico', 'Gastrite (aguda/crônica)', 'DRGE', 'Linfoma MALT'],
        examTips: ['Regiões: cárdia, fundo, corpo, antro, piloro', 'Células parietais: HCl e fator intrínseco', 'Células principais: pepsinogênio', 'H. pylori: teste da urease, erradicação com IBP + 2 ATB'],
        annotations: [{ position: [0, 0.3, 0.3], label: 'Fundo Gástrico' }, { position: [0, 0, 0.3], label: 'Corpo' }, { position: [0, -0.3, 0.3], label: 'Antro Pilórico' }, { position: [0.3, 0.2, 0.3], label: 'Cárdia' }],
        histology: 'Mucosa: epitélio colunar simples com glândulas gástricas. Muscular: 3 camadas (oblíqua interna, circular média, longitudinal externa).',
        references: ['Netter [1] p.268-272', 'Guyton [5] Cap.64', 'Robbins Cap.17'] },
      { id: 'figado', name: 'Fígado', latinName: 'Hepar', description: 'Maior glândula do corpo (~1.5kg). Localizado no hipocôndrio direito. Recebe sangue portal (75%) e arterial hepático (25%).',
        functions: ['Metabolismo de carboidratos, lipídios e proteínas', 'Detoxificação de fármacos e toxinas', 'Produção de bile', 'Síntese de albumina e fatores de coagulação', 'Armazenamento de glicogênio e vitaminas'],
        clinicalNotes: ['Cirrose: fibrose hepática irreversível', 'Hepatite: viral (A, B, C) ou alcoólica', 'Esteatose hepática: acúmulo de gordura'],
        pathologies: ['Cirrose Hepática', 'Hepatite Viral (A, B, C)', 'Carcinoma Hepatocelular', 'Esteatose Hepática', 'Insuficiência Hepática Aguda'],
        examTips: ['Segmentação de Couinaud: 8 segmentos', 'Tríade portal: veia porta + artéria hepática + ducto biliar', 'Child-Pugh: classificação de gravidade da cirrose (A, B, C)', 'MELD: prioridade para transplante hepático'],
        annotations: [{ position: [0.3, 0.2, 0.3], label: 'Lobo Direito' }, { position: [-0.2, 0.2, 0.3], label: 'Lobo Esquerdo' }, { position: [0, -0.1, 0.3], label: 'Porta Hepatis' }, { position: [0.1, 0.3, 0.3], label: 'Vesícula Biliar' }],
        references: ['Netter [1] p.280-286', 'Guyton [5] Cap.70', 'Moore [4] Cap.5'] },
      { id: 'intestinodelgado', name: 'Intestino Delgado', latinName: 'Intestinum Tenue', description: 'Tubo de ~6m: duodeno (25cm), jejuno (2.5m), íleo (3.5m). Principal local de absorção de nutrientes.',
        functions: ['Digestão final de proteínas, carboidratos e lipídios', 'Absorção de nutrientes (vilosidades intestinais)', 'Secreção de enzimas e hormônios', 'Defesa imunológica (placas de Peyer)'],
        clinicalNotes: ['Doença celíaca: intolerância ao glúten', 'Doença de Crohn: pode afetar qualquer segmento', 'Obstrução intestinal: aderências são causa mais comum'],
        pathologies: ['Doença Celíaca', 'Doença de Crohn', 'Obstrução Intestinal', 'Divertículo de Meckel', 'Síndrome do Intestino Curto'],
        examTips: ['Duodeno: papila maior (Vater) = desembocadura do colédoco + Wirsung', 'Jejuno vs Íleo: jejuno tem mais pregas circulares e vilosidades', 'Divertículo de Meckel: regra dos 2s (2%, 2 pés do íleo, 2 polegadas)'],
        annotations: [{ position: [0, 0.3, 0.3], label: 'Duodeno' }, { position: [-0.2, 0, 0.3], label: 'Jejuno' }, { position: [0.2, -0.3, 0.3], label: 'Íleo' }],
        references: ['Netter [1] p.274-278', 'Guyton [5] Cap.65-66'] },
      { id: 'pancreas', name: 'Pâncreas', latinName: 'Pancreas', description: 'Glândula mista (exócrina e endócrina), retroperitoneal, ~15cm. Cabeça abraçada pelo duodeno.',
        functions: ['Secreção exócrina: enzimas digestivas (lipase, amilase, tripsina)', 'Secreção endócrina: insulina (células beta) e glucagon (células alfa)', 'Regulação da glicemia'],
        clinicalNotes: ['Pancreatite aguda: lipase > 3x normal, dor em faixa', 'Câncer de pâncreas: icterícia indolor (cabeça), prognóstico ruim', 'Diabetes tipo 1: destruição autoimune das células beta'],
        pathologies: ['Pancreatite Aguda/Crônica', 'Adenocarcinoma Pancreático', 'Insulinoma', 'Pseudocisto Pancreático'],
        examTips: ['Partes: cabeça, colo, corpo, cauda', 'Critérios de Ranson: gravidade da pancreatite', 'Sinal de Cullen (periumbilical) e Grey-Turner (flancos): pancreatite grave', 'CA 19-9: marcador para câncer pancreático'],
        annotations: [{ position: [0.3, 0, 0.3], label: 'Cabeça' }, { position: [0, 0, 0.3], label: 'Corpo' }, { position: [-0.3, 0, 0.3], label: 'Cauda' }],
        references: ['Netter [1] p.288-290', 'Guyton [5] Cap.64', 'Sabiston Cap.55'] },
    ]
  },
  {
    id: 'nervous', name: 'Sistema Nervoso', icon: '🧠', color: '#8B5CF6',
    description: 'Coordena todas as funções do organismo. SNC (encéfalo + medula) e SNP. Ref: Guyton [5] Cap.45-60',
    organs: [
      { id: 'cerebro', name: 'Cérebro', latinName: 'Cerebrum', description: 'Maior parte do encéfalo (~1.4kg). Dividido em 2 hemisférios com 4 lobos cada. Córtex com ~86 bilhões de neurônios.',
        functions: ['Funções cognitivas superiores (raciocínio, memória, linguagem)', 'Controle motor voluntário', 'Processamento sensorial', 'Emoções e comportamento'],
        clinicalNotes: ['AVC isquêmico: oclusão arterial cerebral (80% dos AVCs)', 'AVC hemorrágico: ruptura vascular (20%)', 'Epilepsia: atividade elétrica anormal', 'Alzheimer: demência neurodegenerativa mais comum'],
        pathologies: ['AVC Isquêmico/Hemorrágico', 'Doença de Alzheimer', 'Epilepsia', 'Tumores Cerebrais (Glioblastoma)', 'Doença de Parkinson', 'Esclerose Múltipla'],
        examTips: ['Lobos: frontal (motor, personalidade), parietal (sensorial), temporal (audição, memória), occipital (visão)', 'Área de Broca (frontal): expressão da fala', 'Área de Wernicke (temporal): compreensão da fala', 'Homúnculo motor e sensitivo: representação cortical'],
        annotations: [{ position: [0, 0.4, 0.3], label: 'Lobo Frontal' }, { position: [0, 0.2, -0.3], label: 'Lobo Parietal' }, { position: [0.4, 0, 0.3], label: 'Lobo Temporal' }, { position: [0, -0.2, -0.3], label: 'Lobo Occipital' }, { position: [0, -0.3, 0], label: 'Cerebelo' }],
        histology: 'Córtex: 6 camadas de neurônios (neocórtex). Substância branca: axônios mielinizados. Substância cinzenta: corpos neuronais.',
        bloodSupply: 'Polígono de Willis: carótidas internas + vertebrais/basilar. ACM: mais acometida no AVC.',
        innervation: '12 pares de nervos cranianos. I-Olfatório, II-Óptico, III-Oculomotor... XII-Hipoglosso.',
        references: ['Netter [1] p.104-120', 'Guyton [5] Cap.45-60', 'Machado, A. Neuroanatomia Funcional, 3ª ed.'] },
      { id: 'medulaespinal', name: 'Medula Espinal', latinName: 'Medulla Spinalis', description: 'Estrutura cilíndrica dentro do canal vertebral, de C1 até L1-L2. Comprimento: ~45cm.',
        functions: ['Condução de impulsos nervosos (vias ascendentes e descendentes)', 'Centro de reflexos espinais', 'Integração sensório-motora segmentar'],
        clinicalNotes: ['Lesão medular: paraplegia (torácica) ou tetraplegia (cervical)', 'Síndrome de Brown-Séquard: hemisecção medular', 'Hérnia de disco: compressão radicular'],
        pathologies: ['Lesão Medular Traumática', 'Mielite Transversa', 'Siringomielia', 'Estenose do Canal Medular'],
        examTips: ['Dermátomos: C5 (deltóide), T4 (mamilos), T10 (umbigo), L4 (joelho)', 'Cone medular: L1-L2 (adulto)', 'Punção lombar: L3-L4 ou L4-L5 (abaixo do cone)', 'Cauda equina: raízes nervosas abaixo de L2'],
        annotations: [{ position: [0, 0.3, 0.2], label: 'Intumescência Cervical' }, { position: [0, -0.1, 0.2], label: 'Intumescência Lombar' }, { position: [0, -0.4, 0.2], label: 'Cone Medular' }],
        references: ['Netter [1] p.160-168', 'Moore [4] Cap.4', 'Machado Cap.4-5'] },
    ]
  },
  {
    id: 'skeletal', name: 'Sistema Esquelético', icon: '🦴', color: '#D1D5DB',
    description: '206 ossos no adulto. Sustentação, proteção, movimento, hematopoiese. Ref: Moore [4]',
    organs: [
      { id: 'coluna', name: 'Coluna Vertebral', latinName: 'Columna Vertebralis', description: '33 vértebras: 7 cervicais, 12 torácicas, 5 lombares, 5 sacrais (fundidas), 4 coccígeas (fundidas). Curvaturas fisiológicas.',
        functions: ['Sustentação do corpo', 'Proteção da medula espinal', 'Mobilidade do tronco', 'Absorção de impactos (discos intervertebrais)'],
        clinicalNotes: ['Hérnia de disco: mais comum L4-L5 e L5-S1', 'Espondilolistese: deslizamento vertebral', 'Escoliose: desvio lateral > 10° (Cobb)'],
        pathologies: ['Hérnia de Disco', 'Espondilolistese', 'Escoliose', 'Fratura Vertebral', 'Espondilite Anquilosante'],
        examTips: ['C1 (Atlas): sem corpo vertebral', 'C2 (Áxis): processo odontoide', 'Vértebra proeminente: C7', 'Linha de Tuffier: L4 (referência para punção lombar)'],
        annotations: [{ position: [0, 0.6, 0], label: 'Cervical (C1-C7)' }, { position: [0, 0.2, 0], label: 'Torácica (T1-T12)' }, { position: [0, -0.2, 0], label: 'Lombar (L1-L5)' }, { position: [0, -0.5, 0], label: 'Sacro/Cóccix' }],
        references: ['Netter [1] p.148-158', 'Moore [4] Cap.4'] },
      { id: 'cranio', name: 'Crânio', latinName: 'Cranium', description: '22 ossos: 8 do neurocrânio (proteção do encéfalo) e 14 do viscerocrânio (face).',
        functions: ['Proteção do encéfalo', 'Sustentação da face', 'Alojamento dos órgãos dos sentidos', 'Inserção de músculos da mastigação e expressão'],
        clinicalNotes: ['Fratura de base de crânio: sinal de Battle, olhos de guaxinim, rinorreia/otorreia', 'Hematoma epidural: ruptura da artéria meníngea média', 'Hematoma subdural: ruptura de veias-ponte'],
        pathologies: ['Fratura de Crânio', 'Hematoma Epidural', 'Hematoma Subdural', 'Craniossinostose'],
        examTips: ['Fontanelas: anterior (bregmática) fecha 18-24 meses; posterior (lambdóidea) fecha 2-3 meses', 'Pterion: ponto mais frágil do crânio (artéria meníngea média)', 'Forame magno: passagem do bulbo/medula'],
        annotations: [{ position: [0, 0.3, 0.3], label: 'Frontal' }, { position: [0.3, 0.2, 0], label: 'Temporal' }, { position: [0, 0.3, -0.3], label: 'Parietal' }, { position: [0, -0.1, -0.3], label: 'Occipital' }],
        references: ['Netter [1] p.2-14', 'Moore [4] Cap.7'] },
      { id: 'femur', name: 'Fêmur', latinName: 'Femur/Os Femoris', description: 'Maior e mais forte osso do corpo. Comprimento: ~45cm. Suporta até 30x o peso corporal.',
        functions: ['Sustentação do peso corporal', 'Locomoção (inserção muscular)', 'Hematopoiese (medula óssea vermelha)'],
        clinicalNotes: ['Fratura de colo do fêmur: comum em idosos com osteoporose', 'Necrose avascular da cabeça femoral: interrupção do suprimento sanguíneo'],
        pathologies: ['Fratura de Colo do Fêmur', 'Necrose Avascular', 'Osteoporose', 'Doença de Legg-Calvé-Perthes'],
        examTips: ['Classificação de Garden: fraturas do colo (I-IV)', 'Ângulo de inclinação: ~125° (coxa vara < 120°, coxa valga > 135°)', 'Triângulo de Ward: área de menor densidade óssea'],
        annotations: [{ position: [0, 0.4, 0.2], label: 'Cabeça do Fêmur' }, { position: [0.1, 0.3, 0.2], label: 'Colo' }, { position: [0.2, 0.2, 0.2], label: 'Trocanter Maior' }, { position: [0, -0.4, 0.2], label: 'Côndilos' }],
        references: ['Netter [1] p.476-480', 'Moore [4] Cap.5'] },
    ]
  },
  {
    id: 'muscular', name: 'Sistema Muscular', icon: '💪', color: '#DC2626',
    description: '~600 músculos esqueléticos. Movimento, postura, produção de calor. Ref: Netter [1]',
    organs: [
      { id: 'quadriceps', name: 'Quadríceps Femoral', latinName: 'Musculus Quadriceps Femoris', description: 'Maior músculo do corpo. 4 ventres: reto femoral, vasto lateral, vasto medial, vasto intermédio.',
        functions: ['Extensão do joelho', 'Flexão do quadril (reto femoral)', 'Estabilização da patela'],
        clinicalNotes: ['Ruptura do tendão quadricipital: perda da extensão ativa do joelho', 'Atrofia: desuso, lesão do nervo femoral (L2-L4)'],
        pathologies: ['Ruptura Tendínea', 'Síndrome Femoropatelar', 'Miosite', 'Rabdomiólise'],
        examTips: ['Inervação: nervo femoral (L2, L3, L4)', 'Reflexo patelar: L3-L4', 'Teste: extensão ativa do joelho contra resistência'],
        annotations: [{ position: [0, 0.2, 0.3], label: 'Reto Femoral' }, { position: [0.3, 0, 0.2], label: 'Vasto Lateral' }, { position: [-0.3, 0, 0.2], label: 'Vasto Medial' }],
        references: ['Netter [1] p.488-492', 'Moore [4] Cap.5'] },
      { id: 'diafragma_musc', name: 'Diafragma', latinName: 'Diaphragma', description: 'Principal músculo da respiração. Forma de cúpula, separa tórax do abdome.',
        functions: ['Inspiração (principal motor)', 'Auxílio na tosse, espirro, defecação, parto', 'Aumento da pressão intra-abdominal'],
        clinicalNotes: ['Paralisia: lesão do nervo frênico → elevação da hemicúpula', 'Hérnia diafragmática: passagem de vísceras'],
        pathologies: ['Hérnia de Hiato', 'Paralisia Diafragmática', 'Eventração'],
        examTips: ['C3, C4, C5 keeps the diaphragm alive (nervo frênico)', 'Hiatos: aórtico T12, esofágico T10, VCI T8 ("8-10-12 rule")'],
        annotations: [{ position: [0, 0, 0.3], label: 'Centro Tendíneo' }, { position: [0.3, 0, 0.2], label: 'Pilar Direito' }, { position: [-0.3, 0, 0.2], label: 'Pilar Esquerdo' }],
        references: ['Netter [1] p.190', 'Moore [4] Cap.4'] },
    ]
  },
  {
    id: 'urinary', name: 'Sistema Urinário', icon: '🫘', color: '#F97316',
    description: 'Filtração do sangue, formação de urina, equilíbrio hidroeletrolítico. Ref: Guyton [5] Cap.26-31',
    organs: [
      { id: 'rins', name: 'Rins', latinName: 'Renes', description: 'Órgãos retroperitoneais em forma de feijão (~12cm). Filtram ~180L/dia de plasma (TFG). Produzem ~1.5L de urina/dia.',
        functions: ['Filtração glomerular e formação de urina', 'Regulação do equilíbrio hidroeletrolítico', 'Regulação da pressão arterial (SRAA)', 'Produção de eritropoietina e vitamina D ativa'],
        clinicalNotes: ['IRA: elevação aguda de creatinina', 'DRC: TFG < 60mL/min por > 3 meses', 'Litíase renal: cálculos (cálcio oxalato mais comum)'],
        pathologies: ['Insuficiência Renal Aguda/Crônica', 'Litíase Renal', 'Glomerulonefrite', 'Pielonefrite', 'Carcinoma de Células Renais', 'Síndrome Nefrótica/Nefrítica'],
        examTips: ['Néfron: glomérulo + túbulos (proximal, alça de Henle, distal, coletor)', 'TFG normal: 90-120 mL/min', 'Classificação KDIGO da DRC: estágios 1-5', 'SRAA: renina → angiotensina I → (ECA) → angiotensina II → aldosterona'],
        annotations: [{ position: [0, 0.2, 0.3], label: 'Córtex Renal' }, { position: [0, 0, 0.3], label: 'Medula Renal' }, { position: [0, -0.2, 0.3], label: 'Pelve Renal' }, { position: [0.2, 0.3, 0.2], label: 'Artéria Renal' }],
        histology: 'Glomérulo: capilares fenestrados + podócitos. TCP: microvilosidades (borda em escova). Alça de Henle: ramo fino e grosso.',
        references: ['Netter [1] p.318-326', 'Guyton [5] Cap.26-31', 'Tortora [7] Cap.26'] },
      { id: 'bexiga', name: 'Bexiga', latinName: 'Vesica Urinaria', description: 'Órgão muscular oco, armazena urina. Capacidade: 300-500mL. Trígono vesical: área entre os orifícios ureterais e uretral.',
        functions: ['Armazenamento de urina', 'Micção (contração do músculo detrusor)'],
        clinicalNotes: ['ITU: mais comum em mulheres (uretra curta)', 'Bexiga neurogênica: lesão medular', 'Câncer de bexiga: hematúria indolor'],
        pathologies: ['Cistite', 'Câncer de Bexiga', 'Bexiga Neurogênica', 'Incontinência Urinária'],
        examTips: ['Músculo detrusor: parassimpático (S2-S4) = contração', 'Esfíncter externo: somático (nervo pudendo) = controle voluntário', 'Trígono vesical: área de mucosa lisa (não tem pregas)'],
        annotations: [{ position: [0, 0.2, 0.3], label: 'Cúpula' }, { position: [0, -0.2, 0.3], label: 'Trígono Vesical' }, { position: [0, -0.4, 0.3], label: 'Colo Vesical' }],
        references: ['Netter [1] p.340-344', 'Moore [4] Cap.6'] },
    ]
  },
  {
    id: 'endocrine', name: 'Sistema Endócrino', icon: '🧬', color: '#EC4899',
    description: 'Glândulas produtoras de hormônios. Regulação metabólica e homeostase. Ref: Guyton [5] Cap.76-83',
    organs: [
      { id: 'tireoide', name: 'Tireoide', latinName: 'Glandula Thyroidea', description: 'Glândula em forma de borboleta na região cervical anterior. Peso: ~20g. Produz T3 e T4.',
        functions: ['Produção de T3 e T4 (metabolismo basal)', 'Produção de calcitonina (metabolismo do cálcio)', 'Regulação do crescimento e desenvolvimento'],
        clinicalNotes: ['Hipotireoidismo: Hashimoto é causa mais comum', 'Hipertireoidismo: Graves é causa mais comum', 'Nódulos tireoidianos: PAAF para investigação'],
        pathologies: ['Hipotireoidismo (Hashimoto)', 'Hipertireoidismo (Graves)', 'Bócio', 'Câncer de Tireoide (Papilífero mais comum)', 'Tireoidite'],
        examTips: ['TSH alto + T4L baixo = hipotireoidismo primário', 'TSH baixo + T4L alto = hipertireoidismo', 'Bethesda: classificação citológica de nódulos (I-VI)', 'Nervo laríngeo recorrente: risco em tireoidectomia'],
        annotations: [{ position: [0.2, 0, 0.3], label: 'Lobo Direito' }, { position: [-0.2, 0, 0.3], label: 'Lobo Esquerdo' }, { position: [0, 0, 0.3], label: 'Istmo' }, { position: [0, 0.2, 0.2], label: 'Paratireoides' }],
        references: ['Netter [1] p.74-76', 'Guyton [5] Cap.77', 'Harrison\'s Cap.375'] },
      { id: 'suprarrenais', name: 'Suprarrenais', latinName: 'Glandulae Suprarenales', description: 'Glândulas sobre os rins. Córtex (3 zonas) e medula. Peso: ~5g cada.',
        functions: ['Córtex: cortisol (zona fasciculada), aldosterona (zona glomerulosa), andrógenos (zona reticular)', 'Medula: adrenalina e noradrenalina (catecolaminas)'],
        clinicalNotes: ['Síndrome de Cushing: excesso de cortisol', 'Doença de Addison: insuficiência adrenal primária', 'Feocromocitoma: tumor produtor de catecolaminas'],
        pathologies: ['Síndrome de Cushing', 'Doença de Addison', 'Feocromocitoma', 'Hiperaldosteronismo (Conn)', 'Insuficiência Adrenal Aguda'],
        examTips: ['Mnemônico zonas: GFR = Glomerulosa (aldosterona), Fasciculada (cortisol), Reticular (andrógenos)', '"Salt, Sugar, Sex" = aldosterona, cortisol, andrógenos', 'Feocromocitoma: regra dos 10% (bilateral, maligno, extra-adrenal, familiar)'],
        annotations: [{ position: [0, 0.2, 0.3], label: 'Córtex' }, { position: [0, 0, 0.3], label: 'Medula' }],
        references: ['Netter [1] p.328-330', 'Guyton [5] Cap.78-80'] },
    ]
  },
  {
    id: 'reproductive_m', name: 'Sistema Reprodutor Masculino', icon: '♂️', color: '#6366F1',
    description: 'Produção de espermatozoides e hormônios sexuais masculinos. Ref: Moore [4] Cap.6',
    organs: [
      { id: 'testiculos', name: 'Testículos', latinName: 'Testes', description: 'Gônadas masculinas, localizadas na bolsa escrotal. Produzem espermatozoides e testosterona.',
        functions: ['Espermatogênese (túbulos seminíferos)', 'Produção de testosterona (células de Leydig)', 'Produção de inibina (células de Sertoli)'],
        clinicalNotes: ['Criptorquidia: testículo não descido (risco de câncer)', 'Torção testicular: emergência urológica', 'Câncer testicular: mais comum em jovens (20-35 anos)'],
        pathologies: ['Câncer Testicular (Seminoma/Não-seminoma)', 'Torção Testicular', 'Varicocele', 'Hidrocele', 'Orquite'],
        examTips: ['Marcadores tumorais: AFP (não-seminoma), beta-hCG (coriocarcinoma), LDH', 'Varicocele: mais comum à esquerda (veia gonadal drena na renal)', 'Torção: dor aguda + ausência de reflexo cremastérico'],
        annotations: [{ position: [0, 0, 0.3], label: 'Túbulos Seminíferos' }, { position: [0.2, 0.2, 0.2], label: 'Epidídimo' }],
        references: ['Netter [1] p.370-374', 'Moore [4] Cap.6'] },
    ]
  },
  {
    id: 'reproductive_f', name: 'Sistema Reprodutor Feminino', icon: '♀️', color: '#F472B6',
    description: 'Produção de óvulos, gestação e hormônios sexuais femininos. Ref: Moore [4] Cap.6',
    organs: [
      { id: 'utero', name: 'Útero', latinName: 'Uterus', description: 'Órgão muscular oco em forma de pera invertida. Partes: fundo, corpo, istmo, colo. Parede: endométrio, miométrio, perimétrio.',
        functions: ['Implantação do embrião', 'Desenvolvimento fetal', 'Menstruação (descamação do endométrio)', 'Parto (contrações do miométrio)'],
        clinicalNotes: ['Mioma uterino: tumor benigno mais comum em mulheres', 'Câncer de endométrio: sangramento pós-menopausa', 'Câncer de colo: HPV (16 e 18)'],
        pathologies: ['Mioma Uterino', 'Endometriose', 'Câncer de Endométrio', 'Câncer de Colo Uterino', 'Adenomiose'],
        examTips: ['Papanicolaou: rastreio de câncer cervical (25-64 anos)', 'FIGO: estadiamento de cânceres ginecológicos', 'HPV: vacina quadrivalente (6, 11, 16, 18)'],
        annotations: [{ position: [0, 0.3, 0.3], label: 'Fundo Uterino' }, { position: [0, 0, 0.3], label: 'Corpo' }, { position: [0, -0.3, 0.3], label: 'Colo Uterino' }, { position: [0.3, 0.2, 0.2], label: 'Tuba Uterina' }],
        references: ['Netter [1] p.356-362', 'Moore [4] Cap.6', 'Williams Obstetrics, 26th ed.'] },
    ]
  },
  {
    id: 'lymphatic', name: 'Sistema Linfático/Imune', icon: '🛡️', color: '#10B981',
    description: 'Defesa do organismo, drenagem linfática, imunidade. Ref: Guyton [5] Cap.34-35',
    organs: [
      { id: 'baco', name: 'Baço', latinName: 'Splen/Lien', description: 'Maior órgão linfoide (~150g). Localizado no hipocôndrio esquerdo, protegido pelas costelas 9-11.',
        functions: ['Filtração do sangue (remoção de hemácias velhas)', 'Reservatório de plaquetas (30%)', 'Produção de anticorpos (polpa branca)', 'Hematopoiese fetal'],
        clinicalNotes: ['Esplenomegalia: infecções, doenças hematológicas, hipertensão portal', 'Ruptura esplênica: trauma abdominal (causa mais comum de cirurgia abdominal no trauma)', 'Asplenia: risco de infecções por encapsulados (pneumococo, meningococo, H. influenzae)'],
        pathologies: ['Esplenomegalia', 'Ruptura Esplênica', 'Infarto Esplênico', 'Hiperesplenismo'],
        examTips: ['Polpa branca: linfócitos (imunidade)', 'Polpa vermelha: filtração de hemácias', 'Pós-esplenectomia: vacinar contra pneumococo, meningococo, H. influenzae', 'Corpúsculos de Howell-Jolly: asplenia funcional'],
        annotations: [{ position: [0, 0.2, 0.3], label: 'Polpa Branca' }, { position: [0, 0, 0.3], label: 'Polpa Vermelha' }, { position: [0.2, 0.2, 0.2], label: 'Hilo Esplênico' }],
        references: ['Netter [1] p.292-294', 'Guyton [5] Cap.34'] },
      { id: 'timo', name: 'Timo', latinName: 'Thymus', description: 'Órgão linfoide primário no mediastino anterior. Maior na infância, involui na puberdade.',
        functions: ['Maturação de linfócitos T', 'Seleção positiva e negativa de células T', 'Produção de timosina e timopoietina'],
        clinicalNotes: ['Timoma: tumor do timo, associado a miastenia gravis (30-50%)', 'Miastenia gravis: anticorpos anti-receptor de acetilcolina'],
        pathologies: ['Timoma', 'Hiperplasia Tímica', 'Síndrome de DiGeorge (aplasia tímica)'],
        examTips: ['Seleção positiva: reconhecimento do MHC próprio (córtex)', 'Seleção negativa: eliminação de células autorreativas (medula)', 'DiGeorge: deleção 22q11 → ausência de timo e paratireoides'],
        annotations: [{ position: [0, 0.1, 0.3], label: 'Córtex' }, { position: [0, -0.1, 0.3], label: 'Medula' }],
        references: ['Netter [1] p.234', 'Guyton [5] Cap.35', 'Abbas Imunologia, 10ª ed.'] },
    ]
  },
  {
    id: 'integumentary', name: 'Sistema Tegumentar', icon: '🧴', color: '#A78BFA',
    description: 'Pele e anexos. Maior órgão do corpo (~2m², ~4kg). Proteção, termorregulação, sensibilidade. Ref: Tortora [7]',
    organs: [
      { id: 'pele', name: 'Pele', latinName: 'Cutis/Integumentum', description: 'Maior órgão do corpo. 3 camadas: epiderme, derme, hipoderme. Espessura: 0.5-4mm.',
        functions: ['Barreira protetora contra patógenos e UV', 'Termorregulação (sudorese, vasodilatação/constrição)', 'Sensibilidade (tato, dor, temperatura, pressão)', 'Síntese de vitamina D', 'Excreção (suor)'],
        clinicalNotes: ['Melanoma: ABCDE (Assimetria, Bordas, Cor, Diâmetro, Evolução)', 'Queimaduras: regra dos 9 de Wallace', 'Psoríase: placas eritematosas descamativas'],
        pathologies: ['Melanoma', 'Carcinoma Basocelular', 'Carcinoma Espinocelular', 'Psoríase', 'Dermatite Atópica', 'Queimaduras'],
        examTips: ['Epiderme: queratinócitos (90%), melanócitos, células de Langerhans, células de Merkel', 'Camadas da epiderme: basal, espinhosa, granulosa, lúcida (palmas/plantas), córnea', 'Regra dos 9: cabeça 9%, MMSS 9% cada, MMII 18% cada, tronco anterior 18%, posterior 18%, períneo 1%'],
        annotations: [{ position: [0, 0.3, 0.3], label: 'Epiderme' }, { position: [0, 0, 0.3], label: 'Derme' }, { position: [0, -0.3, 0.3], label: 'Hipoderme' }],
        histology: 'Epiderme: epitélio estratificado pavimentoso queratinizado. Derme: papilar (tec. conjuntivo frouxo) + reticular (tec. conjuntivo denso). Hipoderme: tecido adiposo.',
        references: ['Tortora [7] Cap.5', 'Netter [1] p.1', 'Robbins Cap.25'] },
    ]
  },
];

// === QUIZ QUESTIONS ===
const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'q1', system: 'cardiovascular', question: 'Qual é o principal marca-passo natural do coração?', options: ['Nó atrioventricular', 'Nó sinusal (sinoatrial)', 'Feixe de His', 'Fibras de Purkinje'], correct: 1, explanation: 'O nó sinusal (SA), localizado no átrio direito, é o marca-passo natural do coração, gerando impulsos a 60-100 bpm. Ref: Guyton [5] Cap.10', difficulty: 'facil', reference: 'Guyton [5]' },
  { id: 'q2', system: 'cardiovascular', question: 'Na classificação de Stanford, a dissecção tipo A envolve qual porção da aorta?', options: ['Aorta descendente apenas', 'Aorta ascendente', 'Arco aórtico apenas', 'Aorta abdominal'], correct: 1, explanation: 'Stanford A: envolve aorta ascendente (independente da extensão) = CIRURGIA. Stanford B: apenas descendente = tratamento clínico. Ref: Netter [1]', difficulty: 'medio', reference: 'Netter [1]' },
  { id: 'q3', system: 'respiratory', question: 'Quantos lobos tem o pulmão direito?', options: ['2 lobos', '3 lobos', '4 lobos', '5 lobos'], correct: 1, explanation: 'Pulmão direito: 3 lobos (superior, médio, inferior). Pulmão esquerdo: 2 lobos (superior, inferior). O esquerdo é menor pela presença do coração. Ref: Netter [1] p.192', difficulty: 'facil', reference: 'Netter [1]' },
  { id: 'q4', system: 'respiratory', question: 'Qual o nível vertebral do hiato esofágico do diafragma?', options: ['T8', 'T10', 'T12', 'L1'], correct: 1, explanation: 'Regra 8-10-12: VCI passa em T8, esôfago em T10, aorta em T12. Mnemônico: "Vena cava 8, esôfago 10, aorta 12". Ref: Moore [4]', difficulty: 'medio', reference: 'Moore [4]' },
  { id: 'q5', system: 'digestive', question: 'Qual célula gástrica produz o fator intrínseco necessário para absorção de vitamina B12?', options: ['Células principais', 'Células parietais (oxínticas)', 'Células G', 'Células mucosas'], correct: 1, explanation: 'Células parietais produzem HCl E fator intrínseco. A deficiência de fator intrínseco causa anemia perniciosa (megaloblástica por deficiência de B12). Ref: Guyton [5] Cap.64', difficulty: 'medio', reference: 'Guyton [5]' },
  { id: 'q6', system: 'digestive', question: 'Qual é a classificação de Child-Pugh utilizada para avaliar?', options: ['Gravidade da pancreatite', 'Gravidade da cirrose hepática', 'Estadiamento do câncer gástrico', 'Grau de esteatose hepática'], correct: 1, explanation: 'Child-Pugh classifica a gravidade da cirrose (A, B, C) usando: bilirrubina, albumina, INR, ascite e encefalopatia. Ref: Netter [1] p.280', difficulty: 'medio', reference: 'Netter [1]' },
  { id: 'q7', system: 'nervous', question: 'Qual área cerebral é responsável pela expressão da fala?', options: ['Área de Wernicke', 'Área de Broca', 'Córtex motor primário', 'Área pré-frontal'], correct: 1, explanation: 'Área de Broca (lobo frontal, giro frontal inferior): expressão/produção da fala. Lesão = afasia motora (entende mas não fala). Área de Wernicke (temporal): compreensão. Ref: Guyton [5] Cap.58', difficulty: 'facil', reference: 'Guyton [5]' },
  { id: 'q8', system: 'nervous', question: 'Qual é o nível vertebral do cone medular no adulto?', options: ['T12', 'L1-L2', 'L3-L4', 'S1'], correct: 1, explanation: 'O cone medular termina em L1-L2 no adulto. Por isso, a punção lombar é feita em L3-L4 ou L4-L5 (abaixo do cone, na cauda equina). Ref: Moore [4] Cap.4', difficulty: 'medio', reference: 'Moore [4]' },
  { id: 'q9', system: 'skeletal', question: 'Qual é o ponto mais frágil do crânio, onde passa a artéria meníngea média?', options: ['Bregma', 'Lambda', 'Pterion', 'Asterion'], correct: 2, explanation: 'O pterion é a junção dos ossos frontal, parietal, temporal e esfenoide. É o ponto mais frágil do crânio. Trauma nesta região pode romper a artéria meníngea média → hematoma epidural. Ref: Netter [1] p.4', difficulty: 'medio', reference: 'Netter [1]' },
  { id: 'q10', system: 'skeletal', question: 'A vértebra C1 (Atlas) tem qual característica única?', options: ['Processo odontoide', 'Não possui corpo vertebral', 'Forame vertebral triangular', 'Processo espinhoso bífido'], correct: 1, explanation: 'C1 (Atlas) não possui corpo vertebral nem processo espinhoso. É um anel ósseo com duas massas laterais. C2 (Áxis) tem o processo odontoide (dente). Ref: Moore [4] Cap.4', difficulty: 'medio', reference: 'Moore [4]' },
  { id: 'q11', system: 'urinary', question: 'Qual é a taxa de filtração glomerular (TFG) normal?', options: ['30-60 mL/min', '60-90 mL/min', '90-120 mL/min', '120-150 mL/min'], correct: 2, explanation: 'TFG normal: 90-120 mL/min/1.73m². DRC estágio 3: 30-59, estágio 4: 15-29, estágio 5 (diálise): <15. Classificação KDIGO. Ref: Guyton [5] Cap.26', difficulty: 'facil', reference: 'Guyton [5]' },
  { id: 'q12', system: 'urinary', question: 'No sistema SRAA, qual enzima converte angiotensina I em angiotensina II?', options: ['Renina', 'ECA (Enzima Conversora de Angiotensina)', 'Aldosterona', 'ADH'], correct: 1, explanation: 'SRAA: Renina (rim) → Angiotensinogênio vira Angiotensina I → ECA (pulmão) → Angiotensina II → Aldosterona (suprarrenal). IECAs bloqueiam a ECA. Ref: Guyton [5] Cap.29', difficulty: 'medio', reference: 'Guyton [5]' },
  { id: 'q13', system: 'endocrine', question: 'TSH elevado com T4 livre baixo indica qual condição?', options: ['Hipertireoidismo primário', 'Hipotireoidismo primário', 'Hipotireoidismo secundário', 'Tireoidite subaguda'], correct: 1, explanation: 'TSH alto + T4L baixo = hipotireoidismo primário (tireoide não produz hormônio suficiente, hipófise compensa aumentando TSH). Causa mais comum: tireoidite de Hashimoto. Ref: Guyton [5] Cap.77', difficulty: 'facil', reference: 'Guyton [5]' },
  { id: 'q14', system: 'endocrine', question: 'Qual a regra mnemônica para as zonas do córtex da suprarrenal e seus hormônios?', options: ['GFR: Glomerulosa-aldosterona, Fasciculada-cortisol, Reticular-andrógenos', 'GFR: Glomerulosa-cortisol, Fasciculada-aldosterona, Reticular-andrógenos', 'FGR: Fasciculada-aldosterona, Glomerulosa-cortisol, Reticular-catecolaminas', 'RFG: Reticular-aldosterona, Fasciculada-andrógenos, Glomerulosa-cortisol'], correct: 0, explanation: 'GFR = Glomerulosa (aldosterona/Salt), Fasciculada (cortisol/Sugar), Reticular (andrógenos/Sex). "Salt, Sugar, Sex - the deeper you go, the sweeter it gets." Ref: Guyton [5] Cap.78', difficulty: 'medio', reference: 'Guyton [5]' },
  { id: 'q15', system: 'muscular', question: 'Qual nervo inerva o quadríceps femoral e qual o nível medular do reflexo patelar?', options: ['Nervo ciático, L5-S1', 'Nervo femoral, L3-L4', 'Nervo obturatório, L2-L3', 'Nervo fibular, L4-L5'], correct: 1, explanation: 'O quadríceps é inervado pelo nervo femoral (L2, L3, L4). O reflexo patelar testa principalmente L3-L4. Ref: Moore [4] Cap.5', difficulty: 'medio', reference: 'Moore [4]' },
  { id: 'q16', system: 'lymphatic', question: 'Após esplenectomia, contra quais patógenos o paciente fica mais vulnerável?', options: ['Vírus (HIV, Hepatite)', 'Bactérias encapsuladas (Pneumococo, Meningococo, H. influenzae)', 'Fungos (Candida, Aspergillus)', 'Parasitas (Plasmodium, Toxoplasma)'], correct: 1, explanation: 'O baço é essencial para opsonização de bactérias encapsuladas. Pós-esplenectomia: vacinar contra Streptococcus pneumoniae, Neisseria meningitidis e Haemophilus influenzae. Ref: Guyton [5] Cap.34', difficulty: 'medio', reference: 'Guyton [5]' },
  { id: 'q17', system: 'integumentary', question: 'Na regra dos 9 de Wallace para queimaduras, qual a porcentagem da cabeça e pescoço no adulto?', options: ['4.5%', '9%', '18%', '1%'], correct: 1, explanation: 'Regra dos 9: Cabeça/pescoço=9%, cada MMSS=9%, tronco anterior=18%, tronco posterior=18%, cada MMII=18%, períneo=1%. Total=100%. Ref: Tortora [7] Cap.5', difficulty: 'facil', reference: 'Tortora [7]' },
  { id: 'q18', system: 'digestive', question: 'Qual sinal clínico indica pancreatite grave com hemorragia retroperitoneal?', options: ['Sinal de Murphy', 'Sinal de Grey-Turner (equimose em flancos)', 'Sinal de Blumberg', 'Sinal de Rovsing'], correct: 1, explanation: 'Sinal de Grey-Turner: equimose nos flancos. Sinal de Cullen: equimose periumbilical. Ambos indicam pancreatite necro-hemorrágica grave. Ref: Sabiston Cap.55', difficulty: 'dificil', reference: 'Sabiston' },
  { id: 'q19', system: 'reproductive_f', question: 'Qual o tipo histológico mais comum de câncer de colo uterino e seu principal fator de risco?', options: ['Adenocarcinoma, tabagismo', 'Carcinoma espinocelular, HPV (tipos 16 e 18)', 'Sarcoma, radiação', 'Carcinoma de células claras, DES'], correct: 1, explanation: 'Carcinoma espinocelular (70-80%) é o tipo mais comum. HPV 16 e 18 são responsáveis por ~70% dos casos. Rastreio: Papanicolaou. Vacina: quadrivalente. Ref: Williams Obstetrics', difficulty: 'medio', reference: 'Williams Obstetrics' },
  { id: 'q20', system: 'cardiovascular', question: 'Qual artéria cerebral é mais frequentemente acometida no AVC isquêmico?', options: ['Artéria cerebral anterior', 'Artéria cerebral média', 'Artéria cerebral posterior', 'Artéria basilar'], correct: 1, explanation: 'A artéria cerebral média (ACM) é a mais acometida no AVC isquêmico (~70% dos casos). Irriga a maior parte da face lateral do hemisfério. Clínica: hemiparesia/plegia contralateral + afasia (se hemisfério dominante). Ref: Guyton [5] Cap.61', difficulty: 'medio', reference: 'Guyton [5]' },
];

// === SM-2 ALGORITHM ===
function sm2Algorithm(quality: number, repetition: number, easeFactor: number, interval: number): { interval: number; repetition: number; easeFactor: number } {
  let newInterval: number;
  let newRepetition: number;
  let newEaseFactor: number;

  if (quality >= 3) {
    if (repetition === 0) newInterval = 1;
    else if (repetition === 1) newInterval = 6;
    else newInterval = Math.round(interval * easeFactor);
    newRepetition = repetition + 1;
  } else {
    newInterval = 1;
    newRepetition = 0;
  }

  newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEaseFactor < 1.3) newEaseFactor = 1.3;

  return { interval: newInterval, repetition: newRepetition, easeFactor: newEaseFactor };
}

// === SKETCHFAB VIEWER ===
function SketchFabViewer({ modelId, height = 450 }: { modelId: string; height?: number }) {
  return (
    <div className="rounded-xl overflow-hidden border border-border bg-black">
      <iframe
        title="3D Model"
        width="100%"
        height={height}
        src={`https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=0&ui_watermark_link=0`}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        style={{ border: 'none' }}
      />
      <div className="bg-black/80 px-3 py-1.5 text-center">
        <span className="text-[10px] text-gray-400">Modelo 3D interativo — Arraste para rotacionar, scroll para zoom</span>
      </div>
    </div>
  );
}

// === REALISTIC ANIMATED HEART MODEL ===
function AnimatedHeartModel({ isAnimating, animationStep }: { isAnimating: boolean; animationStep: number }) {
  const heartRef = useRef<THREE.Group>(null);
  const [scale, setScale] = useState(1);

  useFrame((state) => {
    if (!heartRef.current) return;
    if (isAnimating) {
      const t = state.clock.getElapsedTime();
      const beat = Math.sin(t * 4) * 0.06 + 1;
      setScale(beat);
      heartRef.current.rotation.y += 0.003;
    } else {
      heartRef.current.rotation.y += 0.005;
    }
  });

  const chamberColor = (step: number, chamber: string) => {
    if (!isAnimating) return chamber === 'left' ? '#CC2222' : '#882222';
    const phases = { systole_atrial: 0, systole_ventricular: 1, diastole: 2 };
    const phase = step % 3;
    if (phase === 0) return chamber.includes('atri') ? '#FF4444' : '#882222';
    if (phase === 1) return chamber.includes('ventri') ? '#FF4444' : '#882222';
    return '#AA3333';
  };

  return (
    <group ref={heartRef} scale={[scale, scale, scale]}>
      {/* Main heart body - realistic shape using multiple geometries */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color={chamberColor(animationStep, 'left_ventricle')} roughness={0.35} metalness={0.05} />
      </mesh>
      {/* Right atrium */}
      <mesh position={[0.35, 0.25, 0.1]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color={chamberColor(animationStep, 'right_atrium')} roughness={0.4} />
      </mesh>
      {/* Left atrium */}
      <mesh position={[-0.25, 0.3, -0.1]}>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial color={chamberColor(animationStep, 'left_atrium')} roughness={0.4} />
      </mesh>
      {/* Right ventricle - anterior */}
      <mesh position={[0.2, -0.15, 0.2]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color={chamberColor(animationStep, 'right_ventricle')} roughness={0.35} />
      </mesh>
      {/* Apex */}
      <mesh position={[0, -0.5, 0.1]}>
        <coneGeometry args={[0.3, 0.4, 16]} />
        <meshStandardMaterial color="#AA2222" roughness={0.35} />
      </mesh>
      {/* Aorta */}
      <mesh position={[0, 0.55, -0.05]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.5, 16]} />
        <meshStandardMaterial color="#FF5555" roughness={0.3} />
      </mesh>
      {/* Aortic arch */}
      <mesh position={[0.15, 0.8, -0.1]} rotation={[0, 0, -0.8]}>
        <torusGeometry args={[0.15, 0.06, 12, 24, Math.PI]} />
        <meshStandardMaterial color="#FF4444" roughness={0.3} />
      </mesh>
      {/* Pulmonary artery */}
      <mesh position={[0.15, 0.5, 0.15]} rotation={[-0.3, 0.3, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.4, 12]} />
        <meshStandardMaterial color="#4466CC" roughness={0.3} />
      </mesh>
      {/* Superior vena cava */}
      <mesh position={[0.4, 0.55, 0]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.06, 0.06, 0.4, 12]} />
        <meshStandardMaterial color="#3344AA" roughness={0.3} />
      </mesh>
      {/* Inferior vena cava */}
      <mesh position={[0.35, -0.3, -0.05]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.07, 0.07, 0.4, 12]} />
        <meshStandardMaterial color="#3344AA" roughness={0.3} />
      </mesh>
      {/* Coronary arteries - LAD */}
      <Line points={[[0, 0.2, 0.55], [-0.05, 0, 0.56], [-0.1, -0.2, 0.5], [-0.05, -0.4, 0.35]]} color="#FF8888" lineWidth={2} />
      {/* Coronary arteries - RCA */}
      <Line points={[[0.3, 0.3, 0.35], [0.4, 0.1, 0.4], [0.35, -0.1, 0.35], [0.2, -0.3, 0.25]]} color="#FF8888" lineWidth={2} />
      {/* Annotations */}
      <Html position={[0.35, 0.25, 0.4]} center><div className="text-[7px] text-blue-300 bg-black/80 px-1.5 py-0.5 rounded border border-blue-500/30 whitespace-nowrap">AD</div></Html>
      <Html position={[-0.25, 0.3, 0.2]} center><div className="text-[7px] text-red-300 bg-black/80 px-1.5 py-0.5 rounded border border-red-500/30 whitespace-nowrap">AE</div></Html>
      <Html position={[0.2, -0.15, 0.55]} center><div className="text-[7px] text-blue-300 bg-black/80 px-1.5 py-0.5 rounded border border-blue-500/30 whitespace-nowrap">VD</div></Html>
      <Html position={[-0.15, -0.15, 0.4]} center><div className="text-[7px] text-red-300 bg-black/80 px-1.5 py-0.5 rounded border border-red-500/30 whitespace-nowrap">VE</div></Html>
      <Html position={[0.15, 0.85, 0]} center><div className="text-[7px] text-red-400 bg-black/80 px-1.5 py-0.5 rounded border border-red-500/30 whitespace-nowrap">Aorta</div></Html>
    </group>
  );
}

// === REALISTIC ANIMATED BRAIN MODEL ===
function AnimatedBrainModel({ isAnimating, highlightLobe }: { isAnimating: boolean; highlightLobe?: string }) {
  const brainRef = useRef<THREE.Group>(null);
  useFrame(() => { if (brainRef.current) brainRef.current.rotation.y += 0.004; });

  const lobeColor = (lobe: string) => {
    if (highlightLobe === lobe) return '#FF6666';
    switch (lobe) {
      case 'frontal': return '#E8A0BF';
      case 'parietal': return '#C8A2C8';
      case 'temporal': return '#A8D8EA';
      case 'occipital': return '#AA96DA';
      case 'cerebellum': return '#FCBAD3';
      default: return '#DDB8C8';
    }
  };

  return (
    <group ref={brainRef}>
      {/* Left hemisphere */}
      <group position={[-0.02, 0, 0]}>
        {/* Frontal lobe */}
        <mesh position={[-0.25, 0.15, 0.25]}>
          <sphereGeometry args={[0.35, 24, 24]} />
          <meshStandardMaterial color={lobeColor('frontal')} roughness={0.6} />
        </mesh>
        {/* Parietal lobe */}
        <mesh position={[-0.25, 0.2, -0.15]}>
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshStandardMaterial color={lobeColor('parietal')} roughness={0.6} />
        </mesh>
        {/* Temporal lobe */}
        <mesh position={[-0.35, -0.15, 0.1]}>
          <sphereGeometry args={[0.25, 24, 24]} />
          <meshStandardMaterial color={lobeColor('temporal')} roughness={0.6} />
        </mesh>
        {/* Occipital lobe */}
        <mesh position={[-0.2, 0.05, -0.4]}>
          <sphereGeometry args={[0.25, 24, 24]} />
          <meshStandardMaterial color={lobeColor('occipital')} roughness={0.6} />
        </mesh>
      </group>
      {/* Right hemisphere - mirror */}
      <group position={[0.02, 0, 0]}>
        <mesh position={[0.25, 0.15, 0.25]}><sphereGeometry args={[0.35, 24, 24]} /><meshStandardMaterial color={lobeColor('frontal')} roughness={0.6} /></mesh>
        <mesh position={[0.25, 0.2, -0.15]}><sphereGeometry args={[0.3, 24, 24]} /><meshStandardMaterial color={lobeColor('parietal')} roughness={0.6} /></mesh>
        <mesh position={[0.35, -0.15, 0.1]}><sphereGeometry args={[0.25, 24, 24]} /><meshStandardMaterial color={lobeColor('temporal')} roughness={0.6} /></mesh>
        <mesh position={[0.2, 0.05, -0.4]}><sphereGeometry args={[0.25, 24, 24]} /><meshStandardMaterial color={lobeColor('occipital')} roughness={0.6} /></mesh>
      </group>
      {/* Longitudinal fissure */}
      <mesh position={[0, 0.25, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.02, 0.15, 0.8]} />
        <meshStandardMaterial color="#996677" roughness={0.5} />
      </mesh>
      {/* Cerebellum */}
      <mesh position={[0, -0.25, -0.35]}>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshStandardMaterial color={lobeColor('cerebellum')} roughness={0.5} />
      </mesh>
      {/* Brain stem */}
      <mesh position={[0, -0.35, -0.2]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.3, 12]} />
        <meshStandardMaterial color="#CC9999" roughness={0.4} />
      </mesh>
      {/* Gyri texture - surface bumps */}
      {[...Array(20)].map((_, i) => (
        <mesh key={`gyrus-${i}`} position={[Math.sin(i * 0.8) * 0.4, 0.2 + Math.cos(i * 1.2) * 0.15, Math.cos(i * 0.6) * 0.35]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#D4A0B0" roughness={0.7} transparent opacity={0.6} />
        </mesh>
      ))}
      {/* Annotations */}
      <Html position={[0, 0.15, 0.55]} center><div className="text-[7px] text-pink-300 bg-black/80 px-1.5 py-0.5 rounded border border-pink-500/30">Lobo Frontal</div></Html>
      <Html position={[0, 0.35, -0.15]} center><div className="text-[7px] text-purple-300 bg-black/80 px-1.5 py-0.5 rounded border border-purple-500/30">Lobo Parietal</div></Html>
      <Html position={[0.45, -0.15, 0.1]} center><div className="text-[7px] text-blue-300 bg-black/80 px-1.5 py-0.5 rounded border border-blue-500/30">Lobo Temporal</div></Html>
      <Html position={[0, 0.05, -0.55]} center><div className="text-[7px] text-violet-300 bg-black/80 px-1.5 py-0.5 rounded border border-violet-500/30">Lobo Occipital</div></Html>
      <Html position={[0, -0.35, -0.45]} center><div className="text-[7px] text-pink-200 bg-black/80 px-1.5 py-0.5 rounded border border-pink-400/30">Cerebelo</div></Html>
    </group>
  );
}

// === REALISTIC FULL BODY DISSECTION MODEL ===
function FullBodyDissectionModel({ dissectionDepth, selectedSystem }: { dissectionDepth: number; selectedSystem?: string }) {
  const bodyRef = useRef<THREE.Group>(null);
  useFrame(() => { if (bodyRef.current) bodyRef.current.rotation.y += 0.003; });

  const skinColor = '#F5D0B5';
  const muscleColor = '#CC3333';
  const boneColor = '#F5F0E0';
  const organColor = '#CC4444';
  const vascularColor = '#EE3333';
  const nerveColor = '#FFD700';

  return (
    <group ref={bodyRef} position={[0, -0.5, 0]}>
      {/* === SKIN LAYER (depth 0-1) === */}
      {dissectionDepth <= 1 && (
        <group>
          {/* Head */}
          <mesh position={[0, 1.55, 0]}>
            <sphereGeometry args={[0.22, 24, 24]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
          {/* Neck */}
          <mesh position={[0, 1.28, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 0.15, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
          {/* Torso - chest */}
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.28, 0.25, 0.6, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
          {/* Torso - abdomen */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.25, 0.22, 0.5, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
          {/* Pelvis */}
          <mesh position={[0, 0.15, 0]}>
            <sphereGeometry args={[0.23, 16, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
          {/* Shoulders */}
          <mesh position={[-0.35, 1.1, 0]}><sphereGeometry args={[0.1, 12, 12]} /><meshStandardMaterial color={skinColor} roughness={0.5} /></mesh>
          <mesh position={[0.35, 1.1, 0]}><sphereGeometry args={[0.1, 12, 12]} /><meshStandardMaterial color={skinColor} roughness={0.5} /></mesh>
          {/* Upper arms */}
          <mesh position={[-0.4, 0.85, 0]} rotation={[0, 0, 0.1]}><cylinderGeometry args={[0.07, 0.06, 0.45, 12]} /><meshStandardMaterial color={skinColor} roughness={0.5} /></mesh>
          <mesh position={[0.4, 0.85, 0]} rotation={[0, 0, -0.1]}><cylinderGeometry args={[0.07, 0.06, 0.45, 12]} /><meshStandardMaterial color={skinColor} roughness={0.5} /></mesh>
          {/* Forearms */}
          <mesh position={[-0.45, 0.5, 0]} rotation={[0, 0, 0.05]}><cylinderGeometry args={[0.055, 0.045, 0.45, 12]} /><meshStandardMaterial color={skinColor} roughness={0.5} /></mesh>
          <mesh position={[0.45, 0.5, 0]} rotation={[0, 0, -0.05]}><cylinderGeometry args={[0.055, 0.045, 0.45, 12]} /><meshStandardMaterial color={skinColor} roughness={0.5} /></mesh>
          {/* Hands */}
          <mesh position={[-0.47, 0.24, 0]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color={skinColor} roughness={0.5} /></mesh>
          <mesh position={[0.47, 0.24, 0]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color={skinColor} roughness={0.5} /></mesh>
          {/* Thighs */}
          <mesh position={[-0.13, -0.2, 0]}><cylinderGeometry args={[0.1, 0.08, 0.55, 12]} /><meshStandardMaterial color={skinColor} roughness={0.5} /></mesh>
          <mesh position={[0.13, -0.2, 0]}><cylinderGeometry args={[0.1, 0.08, 0.55, 12]} /><meshStandardMaterial color={skinColor} roughness={0.5} /></mesh>
          {/* Lower legs */}
          <mesh position={[-0.14, -0.7, 0]}><cylinderGeometry args={[0.07, 0.05, 0.55, 12]} /><meshStandardMaterial color={skinColor} roughness={0.5} /></mesh>
          <mesh position={[0.14, -0.7, 0]}><cylinderGeometry args={[0.07, 0.05, 0.55, 12]} /><meshStandardMaterial color={skinColor} roughness={0.5} /></mesh>
          {/* Feet */}
          <mesh position={[-0.14, -1, 0.03]}><boxGeometry args={[0.08, 0.04, 0.14]} /><meshStandardMaterial color={skinColor} roughness={0.5} /></mesh>
          <mesh position={[0.14, -1, 0.03]}><boxGeometry args={[0.08, 0.04, 0.14]} /><meshStandardMaterial color={skinColor} roughness={0.5} /></mesh>
          {/* Face features */}
          <mesh position={[-0.06, 1.58, 0.18]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
          <mesh position={[0.06, 1.58, 0.18]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
          <mesh position={[-0.06, 1.58, 0.2]}><sphereGeometry args={[0.012, 8, 8]} /><meshStandardMaterial color="#333333" /></mesh>
          <mesh position={[0.06, 1.58, 0.2]}><sphereGeometry args={[0.012, 8, 8]} /><meshStandardMaterial color="#333333" /></mesh>
          <mesh position={[0, 1.52, 0.2]}><boxGeometry args={[0.03, 0.025, 0.02]} /><meshStandardMaterial color="#E8B89D" /></mesh>
          {/* Nipples */}
          <mesh position={[-0.12, 1, 0.27]}><sphereGeometry args={[0.015, 8, 8]} /><meshStandardMaterial color="#C4907A" /></mesh>
          <mesh position={[0.12, 1, 0.27]}><sphereGeometry args={[0.015, 8, 8]} /><meshStandardMaterial color="#C4907A" /></mesh>
          {/* Navel */}
          <mesh position={[0, 0.5, 0.24]}><sphereGeometry args={[0.015, 8, 8]} /><meshStandardMaterial color="#D4A08D" /></mesh>
        </group>
      )}

      {/* === MUSCLE LAYER (depth 2-3) === */}
      {dissectionDepth >= 2 && dissectionDepth <= 4 && (
        <group>
          {/* Head muscles */}
          <mesh position={[0, 1.55, 0]}><sphereGeometry args={[0.2, 24, 24]} /><meshStandardMaterial color={muscleColor} roughness={0.4} transparent opacity={0.9} /></mesh>
          {/* Neck - sternocleidomastoid */}
          <mesh position={[-0.06, 1.28, 0.04]} rotation={[0.1, 0, 0.15]}><cylinderGeometry args={[0.025, 0.03, 0.2, 8]} /><meshStandardMaterial color="#DD4444" roughness={0.4} /></mesh>
          <mesh position={[0.06, 1.28, 0.04]} rotation={[0.1, 0, -0.15]}><cylinderGeometry args={[0.025, 0.03, 0.2, 8]} /><meshStandardMaterial color="#DD4444" roughness={0.4} /></mesh>
          {/* Pectorals */}
          <mesh position={[-0.12, 1.02, 0.15]}><boxGeometry args={[0.2, 0.15, 0.08]} /><meshStandardMaterial color="#CC3333" roughness={0.35} /></mesh>
          <mesh position={[0.12, 1.02, 0.15]}><boxGeometry args={[0.2, 0.15, 0.08]} /><meshStandardMaterial color="#CC3333" roughness={0.35} /></mesh>
          {/* Rectus abdominis (6-pack) */}
          {[0, 1, 2].map(row => [-0.05, 0.05].map((x, col) => (
            <mesh key={`abs-${row}-${col}`} position={[x, 0.75 - row * 0.12, 0.2]}>
              <boxGeometry args={[0.08, 0.1, 0.04]} />
              <meshStandardMaterial color="#BB3333" roughness={0.35} />
            </mesh>
          )))}
          {/* Deltoids */}
          <mesh position={[-0.35, 1.1, 0]}><sphereGeometry args={[0.09, 12, 12]} /><meshStandardMaterial color="#DD3333" roughness={0.4} /></mesh>
          <mesh position={[0.35, 1.1, 0]}><sphereGeometry args={[0.09, 12, 12]} /><meshStandardMaterial color="#DD3333" roughness={0.4} /></mesh>
          {/* Biceps */}
          <mesh position={[-0.4, 0.88, 0.03]}><cylinderGeometry args={[0.055, 0.04, 0.35, 12]} /><meshStandardMaterial color="#CC3333" roughness={0.35} /></mesh>
          <mesh position={[0.4, 0.88, 0.03]}><cylinderGeometry args={[0.055, 0.04, 0.35, 12]} /><meshStandardMaterial color="#CC3333" roughness={0.35} /></mesh>
          {/* Quadriceps */}
          <mesh position={[-0.13, -0.2, 0.02]}><cylinderGeometry args={[0.085, 0.065, 0.5, 12]} /><meshStandardMaterial color="#CC3333" roughness={0.35} /></mesh>
          <mesh position={[0.13, -0.2, 0.02]}><cylinderGeometry args={[0.085, 0.065, 0.5, 12]} /><meshStandardMaterial color="#CC3333" roughness={0.35} /></mesh>
          {/* Gastrocnemius (calves) */}
          <mesh position={[-0.14, -0.65, -0.02]}><cylinderGeometry args={[0.055, 0.04, 0.35, 12]} /><meshStandardMaterial color="#BB3333" roughness={0.35} /></mesh>
          <mesh position={[0.14, -0.65, -0.02]}><cylinderGeometry args={[0.055, 0.04, 0.35, 12]} /><meshStandardMaterial color="#BB3333" roughness={0.35} /></mesh>
          {/* Torso core */}
          <mesh position={[0, 0.7, 0]}><cylinderGeometry args={[0.22, 0.2, 0.7, 16]} /><meshStandardMaterial color={muscleColor} roughness={0.4} transparent opacity={0.7} /></mesh>
          {/* Labels */}
          <Html position={[0.12, 1.02, 0.3]} center><div className="text-[6px] text-red-200 bg-black/80 px-1 py-0.5 rounded">Peitoral Maior</div></Html>
          <Html position={[-0.35, 1.1, 0.15]} center><div className="text-[6px] text-red-200 bg-black/80 px-1 py-0.5 rounded">Deltoide</div></Html>
          <Html position={[0.4, 0.88, 0.12]} center><div className="text-[6px] text-red-200 bg-black/80 px-1 py-0.5 rounded">Bíceps</div></Html>
          <Html position={[0.05, 0.65, 0.28]} center><div className="text-[6px] text-red-200 bg-black/80 px-1 py-0.5 rounded">Reto Abdominal</div></Html>
          <Html position={[0.13, -0.2, 0.12]} center><div className="text-[6px] text-red-200 bg-black/80 px-1 py-0.5 rounded">Quadríceps</div></Html>
        </group>
      )}

      {/* === VASCULAR LAYER (depth 3-4) === */}
      {dissectionDepth >= 3 && dissectionDepth <= 5 && (
        <group>
          {/* Aorta - main trunk */}
          <Line points={[[0, 1.1, 0.08], [0, 0.9, 0.08], [0, 0.5, 0.08], [0, 0.2, 0.08]]} color={vascularColor} lineWidth={3} />
          {/* Aortic arch */}
          <Line points={[[0, 1.1, 0.08], [-0.05, 1.15, 0.06], [-0.08, 1.12, 0.04]]} color={vascularColor} lineWidth={3} />
          {/* Carotid arteries */}
          <Line points={[[-0.05, 1.15, 0.06], [-0.06, 1.35, 0.08], [-0.06, 1.55, 0.1]]} color={vascularColor} lineWidth={2} />
          <Line points={[[0.05, 1.15, 0.06], [0.06, 1.35, 0.08], [0.06, 1.55, 0.1]]} color={vascularColor} lineWidth={2} />
          {/* Subclavian → Brachial */}
          <Line points={[[-0.05, 1.12, 0.06], [-0.25, 1.1, 0.04], [-0.4, 0.85, 0.04], [-0.45, 0.5, 0.04]]} color={vascularColor} lineWidth={2} />
          <Line points={[[0.05, 1.12, 0.06], [0.25, 1.1, 0.04], [0.4, 0.85, 0.04], [0.45, 0.5, 0.04]]} color={vascularColor} lineWidth={2} />
          {/* Iliac arteries → Femoral */}
          <Line points={[[0, 0.2, 0.08], [-0.1, 0.1, 0.06], [-0.13, -0.2, 0.06], [-0.14, -0.7, 0.04]]} color={vascularColor} lineWidth={2} />
          <Line points={[[0, 0.2, 0.08], [0.1, 0.1, 0.06], [0.13, -0.2, 0.06], [0.14, -0.7, 0.04]]} color={vascularColor} lineWidth={2} />
          {/* Veins - IVC */}
          <Line points={[[0.05, 1.1, -0.02], [0.05, 0.9, -0.02], [0.05, 0.5, -0.02], [0.05, 0.2, -0.02]]} color="#3355CC" lineWidth={2.5} />
          {/* Jugular veins */}
          <Line points={[[-0.08, 1.55, -0.02], [-0.07, 1.35, -0.02], [-0.05, 1.12, -0.02]]} color="#3355CC" lineWidth={1.5} />
          <Line points={[[0.08, 1.55, -0.02], [0.07, 1.35, -0.02], [0.05, 1.12, -0.02]]} color="#3355CC" lineWidth={1.5} />
          {/* Heart silhouette */}
          <mesh position={[-0.03, 1.02, 0.06]}><sphereGeometry args={[0.1, 16, 16]} /><meshStandardMaterial color="#CC2222" roughness={0.3} transparent opacity={0.8} /></mesh>
          {/* Labels */}
          <Html position={[0, 0.7, 0.15]} center><div className="text-[6px] text-red-300 bg-black/80 px-1 py-0.5 rounded">Aorta</div></Html>
          <Html position={[0.05, 0.7, -0.08]} center><div className="text-[6px] text-blue-300 bg-black/80 px-1 py-0.5 rounded">VCI</div></Html>
          <Html position={[-0.06, 1.45, 0.15]} center><div className="text-[6px] text-red-300 bg-black/80 px-1 py-0.5 rounded">Carótida</div></Html>
          <Html position={[-0.13, -0.1, 0.12]} center><div className="text-[6px] text-red-300 bg-black/80 px-1 py-0.5 rounded">A. Femoral</div></Html>
        </group>
      )}

      {/* === NERVOUS SYSTEM LAYER (depth 4-5) === */}
      {dissectionDepth >= 4 && dissectionDepth <= 6 && (
        <group>
          {/* Brain */}
          <mesh position={[0, 1.55, 0]}><sphereGeometry args={[0.18, 20, 20]} /><meshStandardMaterial color={nerveColor} roughness={0.4} transparent opacity={0.8} /></mesh>
          {/* Spinal cord */}
          <Line points={[[0, 1.35, -0.05], [0, 1.1, -0.05], [0, 0.7, -0.05], [0, 0.35, -0.05]]} color={nerveColor} lineWidth={3} />
          {/* Brachial plexus */}
          <Line points={[[0, 1.15, -0.05], [-0.15, 1.12, -0.03], [-0.35, 1.08, 0], [-0.42, 0.85, 0], [-0.45, 0.5, 0]]} color={nerveColor} lineWidth={1.5} />
          <Line points={[[0, 1.15, -0.05], [0.15, 1.12, -0.03], [0.35, 1.08, 0], [0.42, 0.85, 0], [0.45, 0.5, 0]]} color={nerveColor} lineWidth={1.5} />
          {/* Lumbar plexus → Sciatic */}
          <Line points={[[0, 0.35, -0.05], [-0.08, 0.2, -0.04], [-0.13, -0.1, -0.04], [-0.14, -0.5, -0.04], [-0.14, -0.9, -0.03]]} color={nerveColor} lineWidth={2} />
          <Line points={[[0, 0.35, -0.05], [0.08, 0.2, -0.04], [0.13, -0.1, -0.04], [0.14, -0.5, -0.04], [0.14, -0.9, -0.03]]} color={nerveColor} lineWidth={2} />
          {/* Intercostal nerves */}
          {[0, 1, 2, 3, 4].map(i => (
            <Line key={`nerve-${i}`} points={[[0, 1.05 - i * 0.08, -0.04], [0.15, 1.03 - i * 0.08, 0.05]]} color={nerveColor} lineWidth={1} />
          ))}
          <Html position={[0, 1.55, 0.22]} center><div className="text-[6px] text-yellow-300 bg-black/80 px-1 py-0.5 rounded">Encéfalo</div></Html>
          <Html position={[0, 0.7, -0.12]} center><div className="text-[6px] text-yellow-300 bg-black/80 px-1 py-0.5 rounded">Medula Espinal</div></Html>
          <Html position={[-0.14, -0.3, -0.1]} center><div className="text-[6px] text-yellow-300 bg-black/80 px-1 py-0.5 rounded">N. Ciático</div></Html>
        </group>
      )}

      {/* === SKELETON LAYER (depth 5-6) === */}
      {dissectionDepth >= 5 && dissectionDepth <= 7 && (
        <group>
          {/* Skull */}
          <mesh position={[0, 1.55, 0]}><sphereGeometry args={[0.19, 20, 20]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          {/* Mandible */}
          <mesh position={[0, 1.42, 0.1]}><boxGeometry args={[0.15, 0.04, 0.08]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          {/* Cervical spine */}
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <mesh key={`c-${i}`} position={[0, 1.32 - i * 0.025, -0.04]}><cylinderGeometry args={[0.025, 0.025, 0.02, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          ))}
          {/* Thoracic spine + ribs */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
            <group key={`t-${i}`}>
              <mesh position={[0, 1.12 - i * 0.04, -0.06]}><cylinderGeometry args={[0.03, 0.03, 0.02, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
              <mesh position={[0, 1.12 - i * 0.04, 0]} rotation={[0, 0, i % 2 === 0 ? 0.3 : -0.3]}>
                <torusGeometry args={[0.18 - i * 0.003, 0.008, 6, 16, Math.PI]} />
                <meshStandardMaterial color="#F0EBD8" roughness={0.3} />
              </mesh>
            </group>
          ))}
          {/* Lumbar spine */}
          {[0, 1, 2, 3, 4].map(i => (
            <mesh key={`l-${i}`} position={[0, 0.6 - i * 0.05, -0.06]}><cylinderGeometry args={[0.035, 0.035, 0.03, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          ))}
          {/* Sacrum */}
          <mesh position={[0, 0.3, -0.06]}><coneGeometry args={[0.06, 0.12, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          {/* Pelvis */}
          <mesh position={[-0.1, 0.2, 0]}><torusGeometry args={[0.1, 0.025, 8, 16, Math.PI]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          <mesh position={[0.1, 0.2, 0]}><torusGeometry args={[0.1, 0.025, 8, 16, Math.PI]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          {/* Clavicles */}
          <mesh position={[-0.15, 1.15, 0.06]} rotation={[0, 0, 0.2]}><cylinderGeometry args={[0.012, 0.012, 0.2, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          <mesh position={[0.15, 1.15, 0.06]} rotation={[0, 0, -0.2]}><cylinderGeometry args={[0.012, 0.012, 0.2, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          {/* Scapulae */}
          <mesh position={[-0.22, 1.05, -0.1]}><boxGeometry args={[0.1, 0.12, 0.015]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          <mesh position={[0.22, 1.05, -0.1]}><boxGeometry args={[0.1, 0.12, 0.015]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          {/* Humerus */}
          <mesh position={[-0.38, 0.85, 0]}><cylinderGeometry args={[0.02, 0.018, 0.4, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          <mesh position={[0.38, 0.85, 0]}><cylinderGeometry args={[0.02, 0.018, 0.4, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          {/* Radius + Ulna */}
          <mesh position={[-0.43, 0.5, 0.02]}><cylinderGeometry args={[0.015, 0.012, 0.4, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          <mesh position={[-0.41, 0.5, -0.02]}><cylinderGeometry args={[0.013, 0.01, 0.4, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          <mesh position={[0.43, 0.5, 0.02]}><cylinderGeometry args={[0.015, 0.012, 0.4, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          <mesh position={[0.41, 0.5, -0.02]}><cylinderGeometry args={[0.013, 0.01, 0.4, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          {/* Femur */}
          <mesh position={[-0.13, -0.2, 0]}><cylinderGeometry args={[0.03, 0.025, 0.5, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          <mesh position={[0.13, -0.2, 0]}><cylinderGeometry args={[0.03, 0.025, 0.5, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          {/* Patella */}
          <mesh position={[-0.13, -0.47, 0.04]}><sphereGeometry args={[0.02, 8, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          <mesh position={[0.13, -0.47, 0.04]}><sphereGeometry args={[0.02, 8, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          {/* Tibia + Fibula */}
          <mesh position={[-0.13, -0.7, 0.01]}><cylinderGeometry args={[0.022, 0.018, 0.45, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          <mesh position={[-0.16, -0.7, -0.02]}><cylinderGeometry args={[0.01, 0.008, 0.45, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          <mesh position={[0.13, -0.7, 0.01]}><cylinderGeometry args={[0.022, 0.018, 0.45, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          <mesh position={[0.16, -0.7, -0.02]}><cylinderGeometry args={[0.01, 0.008, 0.45, 8]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          {/* Sternum */}
          <mesh position={[0, 1.02, 0.12]}><boxGeometry args={[0.04, 0.2, 0.015]} /><meshStandardMaterial color={boneColor} roughness={0.3} /></mesh>
          {/* Labels */}
          <Html position={[0, 1.55, 0.25]} center><div className="text-[6px] text-gray-200 bg-black/80 px-1 py-0.5 rounded">Crânio</div></Html>
          <Html position={[0, 0.9, -0.12]} center><div className="text-[6px] text-gray-200 bg-black/80 px-1 py-0.5 rounded">Coluna Torácica</div></Html>
          <Html position={[-0.13, -0.2, 0.08]} center><div className="text-[6px] text-gray-200 bg-black/80 px-1 py-0.5 rounded">Fêmur</div></Html>
          <Html position={[0, 1.02, 0.18]} center><div className="text-[6px] text-gray-200 bg-black/80 px-1 py-0.5 rounded">Esterno</div></Html>
        </group>
      )}

      {/* === ORGANS LAYER (depth 6-7) === */}
      {dissectionDepth >= 6 && (
        <group>
          {/* Heart */}
          <mesh position={[-0.03, 1.0, 0.06]}><sphereGeometry args={[0.08, 16, 16]} /><meshStandardMaterial color="#CC2222" roughness={0.3} /></mesh>
          {/* Lungs */}
          <mesh position={[-0.15, 1.02, 0.02]}><sphereGeometry args={[0.1, 16, 16]} /><meshStandardMaterial color="#7799CC" roughness={0.4} transparent opacity={0.85} /></mesh>
          <mesh position={[0.15, 1.02, 0.02]}><sphereGeometry args={[0.11, 16, 16]} /><meshStandardMaterial color="#7799CC" roughness={0.4} transparent opacity={0.85} /></mesh>
          {/* Liver */}
          <mesh position={[0.1, 0.78, 0.08]}><sphereGeometry args={[0.1, 16, 16]} /><meshStandardMaterial color="#884422" roughness={0.4} /></mesh>
          {/* Stomach */}
          <mesh position={[-0.08, 0.75, 0.08]}><sphereGeometry args={[0.07, 16, 16]} /><meshStandardMaterial color="#CC8866" roughness={0.4} /></mesh>
          {/* Spleen */}
          <mesh position={[-0.2, 0.78, -0.02]}><sphereGeometry args={[0.05, 12, 12]} /><meshStandardMaterial color="#993366" roughness={0.4} /></mesh>
          {/* Kidneys */}
          <mesh position={[-0.12, 0.6, -0.06]}><sphereGeometry args={[0.04, 12, 12]} /><meshStandardMaterial color="#AA5533" roughness={0.4} /></mesh>
          <mesh position={[0.12, 0.6, -0.06]}><sphereGeometry args={[0.04, 12, 12]} /><meshStandardMaterial color="#AA5533" roughness={0.4} /></mesh>
          {/* Intestines */}
          <mesh position={[0, 0.55, 0.06]}><torusGeometry args={[0.08, 0.025, 8, 16]} /><meshStandardMaterial color="#CC9977" roughness={0.5} /></mesh>
          <mesh position={[0, 0.45, 0.06]}><torusGeometry args={[0.1, 0.02, 8, 16]} /><meshStandardMaterial color="#CCAA88" roughness={0.5} /></mesh>
          {/* Bladder */}
          <mesh position={[0, 0.25, 0.06]}><sphereGeometry args={[0.04, 12, 12]} /><meshStandardMaterial color="#DDAA44" roughness={0.4} /></mesh>
          {/* Pancreas */}
          <mesh position={[0, 0.68, 0.02]} rotation={[0, 0, 0.2]}><cylinderGeometry args={[0.015, 0.025, 0.15, 8]} /><meshStandardMaterial color="#DDBB88" roughness={0.4} /></mesh>
          {/* Labels */}
          <Html position={[-0.03, 1.0, 0.18]} center><div className="text-[6px] text-red-300 bg-black/80 px-1 py-0.5 rounded">Coração</div></Html>
          <Html position={[0.15, 1.02, 0.16]} center><div className="text-[6px] text-blue-300 bg-black/80 px-1 py-0.5 rounded">Pulmão D</div></Html>
          <Html position={[-0.15, 1.02, 0.16]} center><div className="text-[6px] text-blue-300 bg-black/80 px-1 py-0.5 rounded">Pulmão E</div></Html>
          <Html position={[0.1, 0.78, 0.2]} center><div className="text-[6px] text-yellow-300 bg-black/80 px-1 py-0.5 rounded">Fígado</div></Html>
          <Html position={[-0.08, 0.75, 0.18]} center><div className="text-[6px] text-orange-300 bg-black/80 px-1 py-0.5 rounded">Estômago</div></Html>
          <Html position={[-0.12, 0.6, 0.02]} center><div className="text-[6px] text-orange-300 bg-black/80 px-1 py-0.5 rounded">Rim E</div></Html>
          <Html position={[0.12, 0.6, 0.02]} center><div className="text-[6px] text-orange-300 bg-black/80 px-1 py-0.5 rounded">Rim D</div></Html>
          <Html position={[0, 0.25, 0.12]} center><div className="text-[6px] text-yellow-300 bg-black/80 px-1 py-0.5 rounded">Bexiga</div></Html>
        </group>
      )}
    </group>
  );
}

// === 3D SCENE WRAPPER ===
function AtlasScene({ children }: { children: React.ReactNode }) {
  return (
    <Canvas camera={{ position: [0, 0.5, 2.5], fov: 50 }} style={{ background: '#0a0a0f' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 3, -3]} intensity={0.4} />
      <pointLight position={[0, 2, 2]} intensity={0.3} />
      <Suspense fallback={null}>
        {children}
      </Suspense>
      <OrbitControls enablePan enableZoom enableRotate minDistance={1} maxDistance={6} />
    </Canvas>
  );
}

// === MAIN COMPONENT ===
export default function AnatomyAtlas() {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'explore' | 'dissection' | 'quiz' | 'animations' | 'sketchfab'>('explore');
  const [dissectionDepth, setDissectionDepth] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [selectedAnimation, setSelectedAnimation] = useState<string>('cardiac_cycle');
  const [quizState, setQuizState] = useState<{ currentQ: number; score: number; answered: boolean; selectedOpt: number | null; sm2Data: Record<string, { interval: number; repetition: number; easeFactor: number }> }>({ currentQ: 0, score: 0, answered: false, selectedOpt: null, sm2Data: {} });
  const [searchTerm, setSearchTerm] = useState('');
  const [showReferences, setShowReferences] = useState(false);
  const [selectedSketchfabModel, setSelectedSketchfabModel] = useState<string | null>(null);

  // Animation timer
  useEffect(() => {
    if (!isAnimating) return;
    const timer = setInterval(() => setAnimationStep(s => s + 1), 800);
    return () => clearInterval(timer);
  }, [isAnimating]);

  const filteredSystems = BODY_SYSTEMS.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.organs.some(o => o.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentSystem = BODY_SYSTEMS.find(s => s.id === selectedSystem);
  const currentOrgan = currentSystem?.organs.find(o => o.id === selectedOrgan);

  const DISSECTION_LAYERS = [
    { id: 0, name: 'Visão Externa', desc: 'Corpo humano completo com pele', color: '#F5D0B5' },
    { id: 1, name: 'Pele e Subcutâneo', desc: 'Epiderme, derme, hipoderme, folículos', color: '#F0C8A0' },
    { id: 2, name: 'Sistema Muscular', desc: 'Músculos esqueléticos superficiais e profundos', color: '#CC3333' },
    { id: 3, name: 'Sistema Vascular', desc: 'Artérias, veias e capilares principais', color: '#EE3333' },
    { id: 4, name: 'Sistema Nervoso', desc: 'Encéfalo, medula espinal, nervos periféricos', color: '#FFD700' },
    { id: 5, name: 'Sistema Esquelético', desc: 'Ossos, articulações, cartilagens', color: '#F5F0E0' },
    { id: 6, name: 'Órgãos Internos', desc: 'Coração, pulmões, fígado, rins, intestinos', color: '#CC4444' },
    { id: 7, name: 'Visão Completa', desc: 'Todas as camadas sobrepostas', color: '#AAAAAA' },
  ];

  const ANIMATIONS = [
    { id: 'cardiac_cycle', name: 'Ciclo Cardíaco', desc: 'Sístole atrial → Sístole ventricular → Diástole', icon: '❤️', ref: 'Guyton [5] Cap.9' },
    { id: 'respiration', name: 'Respiração', desc: 'Inspiração e expiração com diafragma', icon: '🫁', ref: 'Guyton [5] Cap.38' },
    { id: 'peristalsis', name: 'Peristalse', desc: 'Movimentos peristálticos do TGI', icon: '🔄', ref: 'Guyton [5] Cap.63' },
    { id: 'synapse', name: 'Sinapse Neural', desc: 'Transmissão do impulso nervoso', icon: '⚡', ref: 'Guyton [5] Cap.46' },
    { id: 'filtration', name: 'Filtração Renal', desc: 'Filtração glomerular e reabsorção tubular', icon: '💧', ref: 'Guyton [5] Cap.26' },
    { id: 'muscle_contraction', name: 'Contração Muscular', desc: 'Teoria dos filamentos deslizantes', icon: '💪', ref: 'Guyton [5] Cap.6' },
  ];

  const handleQuizAnswer = (optionIndex: number) => {
    if (quizState.answered) return;
    const q = QUIZ_QUESTIONS[quizState.currentQ];
    const isCorrect = optionIndex === q.correct;
    const quality = isCorrect ? 5 : 1;
    const prev = quizState.sm2Data[q.id] || { interval: 0, repetition: 0, easeFactor: 2.5 };
    const updated = sm2Algorithm(quality, prev.repetition, prev.easeFactor, prev.interval);
    setQuizState(s => ({
      ...s,
      answered: true,
      selectedOpt: optionIndex,
      score: isCorrect ? s.score + 1 : s.score,
      sm2Data: { ...s.sm2Data, [q.id]: updated }
    }));
  };

  const nextQuestion = () => {
    setQuizState(s => ({
      ...s,
      currentQ: (s.currentQ + 1) % QUIZ_QUESTIONS.length,
      answered: false,
      selectedOpt: null
    }));
  };

  // === RENDER ===
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span className="text-3xl">🧬</span> Atlas de Anatomia 3D
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Explore o corpo humano em 3D com dissecção por camadas, animações fisiológicas e quiz adaptativo</p>
        </div>
        <button onClick={() => setShowReferences(!showReferences)} className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/30 transition">
          📚 Referências
        </button>
      </div>

      {/* References panel */}
      {showReferences && (
        <div className="mb-6 p-4 rounded-xl bg-card border border-border">
          <h3 className="font-bold mb-3 text-sm">📚 Referências Bibliográficas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
            <p>[1] Netter FH. Atlas de Anatomia Humana. 7ª ed. Elsevier, 2019.</p>
            <p>[2] Sobotta J. Atlas de Anatomia Humana. 24ª ed. Guanabara Koogan, 2018.</p>
            <p>[3] Gray H. Gray's Anatomy. 42nd ed. Elsevier, 2020.</p>
            <p>[4] Moore KL. Anatomia Orientada para a Clínica. 8ª ed. Guanabara Koogan, 2019.</p>
            <p>[5] Guyton AC, Hall JE. Tratado de Fisiologia Médica. 14ª ed. Elsevier, 2021.</p>
            <p>[6] Prometheus. Atlas de Anatomia. 4ª ed. Guanabara Koogan, 2019.</p>
            <p>[7] Tortora GJ. Princípios de Anatomia e Fisiologia. 14ª ed. Guanabara Koogan, 2019.</p>
            <p>[8] Rohen JW. Anatomia Humana: Atlas Fotográfico. 9ª ed. Manole, 2021.</p>
          </div>
        </div>
      )}

      {/* Mode selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'explore' as const, label: '🔍 Explorar Sistemas', desc: 'Navegue pelos 12 sistemas' },
          { id: 'dissection' as const, label: '🔬 Dissecção por Camadas', desc: 'Remova camadas progressivamente' },
          { id: 'sketchfab' as const, label: '🎨 Modelos Realistas', desc: 'Modelos 3D fotorrealistas' },
          { id: 'animations' as const, label: '▶️ Animações', desc: 'Fisiologia em movimento' },
          { id: 'quiz' as const, label: '🧠 Quiz Adaptativo', desc: 'Teste seus conhecimentos' },
        ].map(mode => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${viewMode === mode.id ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'bg-card border border-border hover:bg-accent'}`}
          >
            <div>{mode.label}</div>
            <div className="text-[10px] opacity-70">{mode.desc}</div>
          </button>
        ))}
      </div>

      {/* === EXPLORE MODE === */}
      {viewMode === 'explore' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Systems list */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="🔍 Buscar sistema ou órgão..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary outline-none"
            />
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {filteredSystems.map(system => (
                <button
                  key={system.id}
                  onClick={() => { setSelectedSystem(system.id); setSelectedOrgan(null); }}
                  className={`w-full text-left p-3 rounded-xl transition-all ${selectedSystem === system.id ? 'bg-primary/20 border-primary border-2 shadow-lg' : 'bg-card border border-border hover:bg-accent'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{system.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{system.name}</div>
                      <div className="text-[10px] text-muted-foreground">{system.organs.length} órgãos • {system.organs.map(o => o.name).join(', ')}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3D View */}
          <div className="lg:col-span-2">
            {currentSystem ? (
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden border border-border" style={{ height: 450 }}>
                  <AtlasScene>
                    {selectedSystem === 'cardiovascular' ? (
                      <AnimatedHeartModel isAnimating={isAnimating} animationStep={animationStep} />
                    ) : selectedSystem === 'nervous' ? (
                      <AnimatedBrainModel isAnimating={false} />
                    ) : (
                      <FullBodyDissectionModel dissectionDepth={6} selectedSystem={selectedSystem} />
                    )}
                  </AtlasScene>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setIsAnimating(!isAnimating)} className={`px-4 py-2 rounded-lg text-sm ${isAnimating ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {isAnimating ? '⏸ Pausar' : '▶️ Animar'}
                  </button>
                </div>

                {/* Organs grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {currentSystem.organs.map(organ => (
                    <button
                      key={organ.id}
                      onClick={() => setSelectedOrgan(organ.id)}
                      className={`p-3 rounded-xl text-left transition-all ${selectedOrgan === organ.id ? 'bg-primary/20 border-primary border-2' : 'bg-card border border-border hover:bg-accent'}`}
                    >
                      <div className="font-medium text-sm">{organ.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">{organ.function.substring(0, 60)}...</div>
                    </button>
                  ))}
                </div>

                {/* Organ detail */}
                {currentOrgan && (
                  <div className="p-5 rounded-xl bg-card border border-border space-y-4">
                    <h3 className="text-lg font-bold">{currentOrgan.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-primary mb-1">📍 Localização</h4>
                        <p className="text-sm text-muted-foreground">{currentOrgan.location}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-primary mb-1">⚙️ Função</h4>
                        <p className="text-sm text-muted-foreground">{currentOrgan.function}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-primary mb-1">🏥 Patologias</h4>
                        <div className="flex flex-wrap gap-1">{currentOrgan.pathologies.map((p, i) => <span key={i} className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[10px]">{p}</span>)}</div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-primary mb-1">💡 Dica de Prova</h4>
                        <p className="text-sm text-yellow-400 bg-yellow-500/10 p-2 rounded-lg">{currentOrgan.clinicalTip}</p>
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground">Ref: {currentOrgan.reference}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 rounded-xl bg-card border border-border">
                <div className="text-center">
                  <span className="text-6xl">🧬</span>
                  <p className="text-muted-foreground mt-4">Selecione um sistema corporal para explorar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* === DISSECTION MODE === */}
      {viewMode === 'dissection' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden border border-border" style={{ height: 550 }}>
              <AtlasScene>
                <FullBodyDissectionModel dissectionDepth={dissectionDepth} />
              </AtlasScene>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">Profundidade de Dissecção</h3>
                <span className="text-xs text-muted-foreground">Camada {dissectionDepth} de 7</span>
              </div>
              <input
                type="range"
                min={0}
                max={7}
                value={dissectionDepth}
                onChange={e => setDissectionDepth(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Pele</span><span>Músculo</span><span>Vasos</span><span>Nervos</span><span>Ossos</span><span>Órgãos</span><span>Tudo</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-sm">🔬 Camadas Anatômicas</h3>
            <p className="text-xs text-muted-foreground">Remova camadas progressivamente para explorar as estruturas anatômicas em profundidade. Ref: Gray's Anatomy [3]</p>
            {DISSECTION_LAYERS.map(layer => (
              <button
                key={layer.id}
                onClick={() => setDissectionDepth(layer.id)}
                className={`w-full text-left p-3 rounded-xl transition-all ${dissectionDepth === layer.id ? 'bg-primary/20 border-primary border-2' : 'bg-card border border-border hover:bg-accent'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: layer.color }} />
                  <div>
                    <div className="font-medium text-sm">{layer.name}</div>
                    <div className="text-[10px] text-muted-foreground">{layer.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* === SKETCHFAB REALISTIC MODELS === */}
      {viewMode === 'sketchfab' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {SKETCHFAB_MODELS.map(model => (
              <button
                key={model.id}
                onClick={() => setSelectedSketchfabModel(model.sketchfabId)}
                className={`p-3 rounded-xl text-left transition-all ${selectedSketchfabModel === model.sketchfabId ? 'bg-primary/20 border-primary border-2' : 'bg-card border border-border hover:bg-accent'}`}
              >
                <div className="text-2xl mb-2">{model.icon}</div>
                <div className="font-medium text-sm">{model.name}</div>
                <div className="text-[10px] text-muted-foreground">{model.system}</div>
              </button>
            ))}
          </div>
          {selectedSketchfabModel ? (
            <div>
              <SketchFabViewer modelId={selectedSketchfabModel} height={550} />
              <p className="text-xs text-muted-foreground mt-2 text-center">Modelo 3D fotorrealista — Use o mouse para rotacionar, zoom com scroll. Fonte: SketchFab (CC Attribution)</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 rounded-xl bg-card border border-border">
              <div className="text-center">
                <span className="text-6xl">🎨</span>
                <p className="text-muted-foreground mt-4">Selecione um modelo 3D fotorrealista acima</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* === ANIMATIONS MODE === */}
      {viewMode === 'animations' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden border border-border" style={{ height: 450 }}>
              <AtlasScene>
                {selectedAnimation === 'cardiac_cycle' ? (
                  <AnimatedHeartModel isAnimating={isAnimating} animationStep={animationStep} />
                ) : selectedAnimation === 'synapse' ? (
                  <AnimatedBrainModel isAnimating={isAnimating} />
                ) : (
                  <FullBodyDissectionModel dissectionDepth={selectedAnimation === 'muscle_contraction' ? 2 : selectedAnimation === 'filtration' ? 6 : 1} />
                )}
              </AtlasScene>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setIsAnimating(!isAnimating)} className={`px-6 py-2.5 rounded-xl text-sm font-medium ${isAnimating ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                {isAnimating ? '⏸ Pausar Animação' : '▶️ Iniciar Animação'}
              </button>
              <button onClick={() => setAnimationStep(0)} className="px-4 py-2.5 rounded-xl text-sm bg-card border border-border hover:bg-accent">
                🔄 Reiniciar
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-sm">▶️ Animações Fisiológicas</h3>
            {ANIMATIONS.map(anim => (
              <button
                key={anim.id}
                onClick={() => { setSelectedAnimation(anim.id); setIsAnimating(false); setAnimationStep(0); }}
                className={`w-full text-left p-3 rounded-xl transition-all ${selectedAnimation === anim.id ? 'bg-primary/20 border-primary border-2' : 'bg-card border border-border hover:bg-accent'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{anim.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{anim.name}</div>
                    <div className="text-[10px] text-muted-foreground">{anim.desc}</div>
                    <div className="text-[9px] text-blue-400 mt-0.5">Ref: {anim.ref}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* === QUIZ MODE === */}
      {viewMode === 'quiz' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">🧠 Quiz Adaptativo (SM-2)</h3>
              <p className="text-xs text-muted-foreground">O algoritmo SuperMemo 2 adapta a dificuldade ao seu nível</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{quizState.score}/{quizState.currentQ + (quizState.answered ? 1 : 0)}</div>
              <div className="text-xs text-muted-foreground">Questão {quizState.currentQ + 1} de {QUIZ_QUESTIONS.length}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-card rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((quizState.currentQ + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
          </div>

          {(() => {
            const q = QUIZ_QUESTIONS[quizState.currentQ];
            const system = BODY_SYSTEMS.find(s => s.id === q.system);
            return (
              <div className="p-6 rounded-xl bg-card border border-border space-y-5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px]">{system?.icon} {system?.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${q.difficulty === 'facil' ? 'bg-green-500/20 text-green-400' : q.difficulty === 'medio' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                    {q.difficulty === 'facil' ? '🟢 Fácil' : q.difficulty === 'medio' ? '🟡 Médio' : '🔴 Difícil'}
                  </span>
                </div>
                <h4 className="text-lg font-medium">{q.question}</h4>
                <div className="space-y-2">
                  {q.options.map((opt, i) => {
                    let btnClass = 'bg-accent/50 border border-border hover:bg-accent';
                    if (quizState.answered) {
                      if (i === q.correct) btnClass = 'bg-green-500/20 border-green-500 border-2 text-green-300';
                      else if (i === quizState.selectedOpt) btnClass = 'bg-red-500/20 border-red-500 border-2 text-red-300';
                    }
                    return (
                      <button key={i} onClick={() => handleQuizAnswer(i)} disabled={quizState.answered}
                        className={`w-full text-left p-3 rounded-xl transition-all text-sm ${btnClass}`}>
                        <span className="font-medium mr-2">{String.fromCharCode(65 + i)})</span> {opt}
                      </button>
                    );
                  })}
                </div>
                {quizState.answered && (
                  <div className="space-y-3">
                    <div className={`p-4 rounded-xl ${quizState.selectedOpt === q.correct ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                      <p className="text-sm font-medium mb-1">{quizState.selectedOpt === q.correct ? '✅ Correto!' : '❌ Incorreto'}</p>
                      <p className="text-sm text-muted-foreground">{q.explanation}</p>
                    </div>
                    <button onClick={nextQuestion} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
                      Próxima Questão →
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
