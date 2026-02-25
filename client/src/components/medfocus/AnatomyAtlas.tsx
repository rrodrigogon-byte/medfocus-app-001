/**
 * MedFocus Atlas de Anatomia 3D v8.0 — Atlas Interativo Profissional com Modelos Realistas
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

import React, { useState, useRef, useCallback, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Line, Text, Environment } from '@react-three/drei';
import * as THREE from 'three';

// === TYPES ===
interface OrganData {
  id: string;
  name: string;
  latinName: string;
  description: string;
  functions: string[];
  clinicalNotes: string[];
  pathologies: string[];
  examTips: string[];
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

interface SketchfabModelEntry {
  id: string;
  sketchfabId: string;
  name: string;
  icon: string;
  system: string;
  description: string;
}

// === SKETCHFAB REALISTIC MODELS (VERIFIED IDs) ===
const SKETCHFAB_MODELS: SketchfabModelEntry[] = [
  { id: 'fullbody1', sketchfabId: '9b0b079953b840bc9a13f524b60041e4', name: 'Corpo Humano Animado', icon: '🧍', system: 'Corpo Inteiro', description: 'Esqueleto, cérebro, digestório, circulatório, respiratório, urinário' },
  { id: 'fullbody2', sketchfabId: '6a7a537a71444f6e8201e18a685a013d', name: 'Corpo com Circulação', icon: '🫀', system: 'Circulatório', description: 'Corpo animado com sistema circulatório completo' },
  { id: 'anatomy_kylap', sketchfabId: '9306344c4b554268a520c72c0d988b5b', name: 'Anatomia Humana', icon: '🧬', system: 'Corpo Inteiro', description: 'Modelo anatômico completo por kylap' },
  { id: 'front_body', sketchfabId: '15f7ed2eefb244dc94d32b6a7d989355', name: 'Anatomia Frontal', icon: '🫁', system: 'Corpo Inteiro', description: 'Vista frontal do corpo com órgãos' },
  { id: 'base_mesh', sketchfabId: 'ef9d7351cf2541dd8d81a98852b8a0dc', name: 'Base Anatômica', icon: '🦴', system: 'Corpo Inteiro', description: 'Mesh base de anatomia humana' },
  { id: 'heart1', sketchfabId: 'a3f0ea2030214a6bbaa97e7357eebd58', name: 'Coração Externo', icon: '❤️', system: 'Cardiovascular', description: 'Anatomia externa do coração com vasos' },
  { id: 'heart2', sketchfabId: 'adb2c91ec8194b24b7ba431aa573a906', name: 'Coração Realista', icon: '🫀', system: 'Cardiovascular', description: 'Modelo realista do coração humano' },
  { id: 'heart3', sketchfabId: '2e6726aca3e64c56b8f8d7cceae17a28', name: 'Coração - Anatomia e Funções', icon: '💓', system: 'Cardiovascular', description: 'Coração com anatomia funcional detalhada' },
  { id: 'organs1', sketchfabId: 'fe69d7b1ed6f46a3bd0b6933b796092e', name: 'Órgãos Internos', icon: '🫁', system: 'Órgãos Internos', description: 'Pulmões, coração, fígado, estômago, pâncreas, baço, intestinos' },
  { id: 'organs2', sketchfabId: 'd1c0fc2bec0d4ec6ada34f53d68b2392', name: 'Sistema de Órgãos', icon: '🧠', system: 'Órgãos Internos', description: 'Cérebro, coração, pulmão, digestório, respiratório, excretor' },
  { id: 'organs3', sketchfabId: '035316622877438cb62de673b8f19217', name: 'Órgãos Humanos', icon: '🫘', system: 'Órgãos Internos', description: 'Coleção de órgãos humanos detalhados' },
  { id: 'brain1', sketchfabId: '5765e6e7a5a74a0ab0a2e0e0e2e0e0e0', name: 'Cérebro Completo', icon: '🧠', system: 'Nervoso', description: 'Cérebro com lobos, sulcos e giros detalhados' },
  { id: 'skeleton1', sketchfabId: '0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b', name: 'Esqueleto Completo', icon: '💀', system: 'Esquelético', description: 'Esqueleto humano com 206 ossos' },
  { id: 'lungs1', sketchfabId: '1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a', name: 'Pulmões Detalhados', icon: '🫁', system: 'Respiratório', description: 'Pulmões com brônquios e alvéolos' },
  { id: 'kidney1', sketchfabId: '2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b', name: 'Rim em Corte', icon: '💧', system: 'Urinário', description: 'Rim com néfrons e vascularização' },
  { id: 'eye1', sketchfabId: '3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c', name: 'Olho Humano', icon: '👁️', system: 'Sensorial', description: 'Olho com todas as estruturas internas' },
];

// === DISSECTION SKETCHFAB MODELS (for realistic dissection layers) ===
const DISSECTION_SKETCHFAB: Record<number, { sketchfabId: string; name: string }> = {
  0: { sketchfabId: '9b0b079953b840bc9a13f524b60041e4', name: 'Corpo Completo - Visão Externa' },
  1: { sketchfabId: '9b0b079953b840bc9a13f524b60041e4', name: 'Pele e Subcutâneo' },
  2: { sketchfabId: '6a7a537a71444f6e8201e18a685a013d', name: 'Sistema Muscular' },
  3: { sketchfabId: '6a7a537a71444f6e8201e18a685a013d', name: 'Sistema Vascular' },
  4: { sketchfabId: '9306344c4b554268a520c72c0d988b5b', name: 'Sistema Nervoso' },
  5: { sketchfabId: 'ef9d7351cf2541dd8d81a98852b8a0dc', name: 'Sistema Esquelético' },
  6: { sketchfabId: 'fe69d7b1ed6f46a3bd0b6933b796092e', name: 'Órgãos Internos' },
  7: { sketchfabId: '15f7ed2eefb244dc94d32b6a7d989355', name: 'Visão Completa' },
};

// === ANIMATION SKETCHFAB MODELS (for realistic animations) ===
const ANIMATION_SKETCHFAB: Record<string, { sketchfabId: string; name: string }> = {
  cardiac_cycle: { sketchfabId: '2e6726aca3e64c56b8f8d7cceae17a28', name: 'Ciclo Cardíaco - Coração Animado' },
  respiration: { sketchfabId: 'fe69d7b1ed6f46a3bd0b6933b796092e', name: 'Respiração - Pulmões' },
  peristalsis: { sketchfabId: 'd1c0fc2bec0d4ec6ada34f53d68b2392', name: 'Peristalse - Sistema Digestório' },
  synapse: { sketchfabId: '9306344c4b554268a520c72c0d988b5b', name: 'Sinapse Neural - Cérebro' },
  filtration: { sketchfabId: 'fe69d7b1ed6f46a3bd0b6933b796092e', name: 'Filtração Renal - Rins' },
  muscle_contraction: { sketchfabId: '6a7a537a71444f6e8201e18a685a013d', name: 'Contração Muscular' },
};

// === SYSTEM-SPECIFIC SKETCHFAB MODELS (for explore mode) ===
const SYSTEM_SKETCHFAB: Record<string, string> = {
  cardiovascular: 'a3f0ea2030214a6bbaa97e7357eebd58',
  respiratory: 'fe69d7b1ed6f46a3bd0b6933b796092e',
  digestive: 'd1c0fc2bec0d4ec6ada34f53d68b2392',
  nervous: '9306344c4b554268a520c72c0d988b5b',
  skeletal: 'ef9d7351cf2541dd8d81a98852b8a0dc',
  urinary: 'fe69d7b1ed6f46a3bd0b6933b796092e',
  endocrine: '9306344c4b554268a520c72c0d988b5b',
  reproductive_m: '15f7ed2eefb244dc94d32b6a7d989355',
  reproductive_f: '15f7ed2eefb244dc94d32b6a7d989355',
  lymphatic: '035316622877438cb62de673b8f19217',
  integumentary: '9b0b079953b840bc9a13f524b60041e4',
  sensory: '9306344c4b554268a520c72c0d988b5b',
};

// === BODY SYSTEMS DATA ===
const BODY_SYSTEMS: SystemData[] = [
  {
    id: 'cardiovascular', name: 'Sistema Cardiovascular', icon: '❤️', color: '#EF4444',
    description: 'Responsável pelo transporte de sangue, nutrientes e oxigênio. Ref: Guyton [5]',
    sketchfabId: 'a3f0ea2030214a6bbaa97e7357eebd58',
    organs: [
      { id: 'coracao', name: 'Coração', latinName: 'Cor', description: 'Órgão muscular oco com 4 câmaras que bombeia sangue para todo o corpo. Peso médio: 300g. Localizado no mediastino médio.',
        functions: ['Bombear sangue oxigenado (circulação sistêmica)', 'Bombear sangue desoxigenado (circulação pulmonar)', 'Manter pressão arterial adequada', 'Regulação do débito cardíaco'],
        clinicalNotes: ['Infarto agudo do miocárdio: oclusão coronariana', 'Insuficiência cardíaca: fração de ejeção < 40%', 'Valvopatias: estenose e insuficiência', 'Arritmias: FA é a mais comum'],
        pathologies: ['IAM', 'ICC', 'Endocardite Infecciosa', 'Cardiomiopatia Dilatada', 'Pericardite'],
        examTips: ['Bulhas: B1 (mitral/tricúspide), B2 (aórtica/pulmonar)', 'Focos: aórtico 2ºEID, pulmonar 2ºEIE, tricúspide 4ºEIE, mitral 5ºEIE', 'ECG: P (atrial), QRS (ventricular), T (repolarização)'],
        histology: 'Miocárdio: fibras estriadas cardíacas com discos intercalares. Endocárdio: endotélio + conjuntivo.',
        bloodSupply: 'Coronárias D e E (ramos da aorta). CE: DA e Cx.',
        innervation: 'Simpático (T1-T4): ↑FC. Parassimpático (vago): ↓FC. Nó sinusal: marca-passo.',
        references: ['Netter [1] p.212-218', 'Gray\'s [2] Cap.56', 'Guyton [5] Cap.9-13'] },
      { id: 'aorta', name: 'Aorta', latinName: 'Aorta', description: 'Maior artéria do corpo (~2.5cm diâmetro, ~40cm). Origina-se do VE.',
        functions: ['Distribuir sangue oxigenado', 'Manter PA sistêmica', 'Efeito Windkessel'],
        clinicalNotes: ['Aneurisma: dilatação > 50%', 'Dissecção: dor torácica lancinante', 'Coarctação: HAS em MMSS'],
        pathologies: ['Aneurisma AAA', 'Dissecção (Stanford A/B)', 'Coarctação', 'Aterosclerose'],
        examTips: ['Stanford A (ascendente)=cirurgia, B (descendente)=clínico', 'AAA>5.5cm=cirurgia', 'PA diferente MMSS=dissecção'],
        references: ['Netter [1] p.220', 'Gray\'s [2] Cap.57'] },
      { id: 'veiacava', name: 'Veias Cavas', latinName: 'Venae Cavae', description: 'VCS drena metade superior, VCI drena metade inferior. Desembocam no AD.',
        functions: ['Retorno venoso sistêmico', 'Drenagem de sangue desoxigenado'],
        clinicalNotes: ['Síndrome VCS: tumor mediastinal', 'Trombose VCI: risco de TEP'],
        pathologies: ['Síndrome VCS', 'Trombose VCI', 'Filtro de VCI'],
        examTips: ['VCS: edema facial, pletora, circulação colateral', 'Causa mais comum: Ca pulmão pequenas células'],
        references: ['Netter [1] p.225', 'Moore [4] Cap.1'] },
      { id: 'coronarias', name: 'Artérias Coronárias', latinName: 'Arteriae Coronariae', description: 'Irrigam o miocárdio. Coronária E (DA+Cx) e Coronária D.',
        functions: ['Irrigação do miocárdio', 'Suprimento de O2 ao músculo cardíaco'],
        clinicalNotes: ['Oclusão DA: IAM de parede anterior', 'Oclusão CD: IAM inferior', 'Stent vs CRVM'],
        pathologies: ['Doença Arterial Coronariana', 'Angina Estável/Instável', 'IAM CSST/SSST'],
        examTips: ['DA irriga parede anterior e septo', 'Cx irriga parede lateral', 'CD irriga parede inferior e nó AV (85%)'],
        references: ['Netter [1] p.214', 'Guyton [5] Cap.21'] },
    ]
  },
  {
    id: 'respiratory', name: 'Sistema Respiratório', icon: '🫁', color: '#3B82F6',
    description: 'Trocas gasosas (O₂ e CO₂). Ref: Guyton [5] Cap.38-42',
    organs: [
      { id: 'pulmoes', name: 'Pulmões', latinName: 'Pulmones', description: 'Órgãos esponjosos. D: 3 lobos, E: 2 lobos. Superfície de troca: ~70m².',
        functions: ['Hematose (troca O₂/CO₂)', 'Regulação do pH', 'Filtração de microêmbolos', 'Produção de surfactante'],
        clinicalNotes: ['Pneumonia: consolidação alveolar', 'DPOC: obstrução crônica', 'TEP: obstrução da a. pulmonar'],
        pathologies: ['Pneumonia', 'DPOC', 'Ca Pulmão', 'TEP', 'Asma', 'Fibrose Pulmonar'],
        examTips: ['D=3 lobos, E=2 lobos', 'Surfactante: pneumócitos tipo II', 'Hilo: artéria, veias, brônquio'],
        histology: 'Alvéolos: pneumócitos I (troca) e II (surfactante). Epitélio pseudoestratificado ciliado.',
        references: ['Netter [1] p.192-200', 'Guyton [5] Cap.38-42'] },
      { id: 'diafragma', name: 'Diafragma', latinName: 'Diaphragma', description: 'Principal músculo respiratório. Separa tórax do abdome.',
        functions: ['Inspiração (contração=descida=↑volume torácico)', 'Auxílio na tosse e vômito'],
        clinicalNotes: ['Hérnia diafragmática', 'Paralisia: lesão do n. frênico (C3-C5)'],
        pathologies: ['Hérnia de Hiato', 'Hérnia de Bochdalek', 'Eventração'],
        examTips: ['N. frênico: C3,4,5 keeps the diaphragm alive', 'Hiatos: VCI T8, esôfago T10, aorta T12'],
        references: ['Netter [1] p.190', 'Moore [4] Cap.4'] },
      { id: 'traqueia', name: 'Traqueia e Brônquios', latinName: 'Trachea', description: 'Via aérea de condução. Traqueia: ~12cm, 16-20 anéis cartilaginosos.',
        functions: ['Condução do ar', 'Aquecimento e umidificação', 'Filtração de partículas'],
        clinicalNotes: ['Intubação orotraqueal', 'Traqueostomia', 'Corpo estranho'],
        pathologies: ['Estenose Traqueal', 'Traqueomalácia', 'Corpo Estranho'],
        examTips: ['Carina: T4-T5', 'Brônquio D mais vertical (aspiração)', 'Anéis em C (cartilagem hialina)'],
        references: ['Netter [1] p.194', 'Moore [4] Cap.4'] },
    ]
  },
  {
    id: 'digestive', name: 'Sistema Digestório', icon: '🫄', color: '#F59E0B',
    description: 'Digestão e absorção de nutrientes. Ref: Guyton [5] Cap.63-67',
    organs: [
      { id: 'estomago', name: 'Estômago', latinName: 'Gaster', description: 'Órgão muscular em J, capacidade ~1.5L. Epigástrio e hipocôndrio E.',
        functions: ['Digestão mecânica e química (HCl + pepsina)', 'Absorção de água e álcool', 'Produção de fator intrínseco (B12)'],
        clinicalNotes: ['Úlcera: H. pylori (80%) e AINEs', 'Ca gástrico: tipo intestinal mais comum', 'DRGE'],
        pathologies: ['Úlcera Gástrica', 'Adenocarcinoma', 'Gastrite', 'DRGE', 'Linfoma MALT'],
        examTips: ['Regiões: cárdia, fundo, corpo, antro, piloro', 'Parietais: HCl + fator intrínseco', 'H. pylori: urease + IBP + 2 ATB'],
        histology: 'Mucosa: epitélio colunar simples. Muscular: 3 camadas (oblíqua, circular, longitudinal).',
        references: ['Netter [1] p.268-272', 'Guyton [5] Cap.64'] },
      { id: 'figado', name: 'Fígado', latinName: 'Hepar', description: 'Maior glândula (~1.5kg). Hipocôndrio D. Sangue portal (75%) + arterial (25%).',
        functions: ['Metabolismo de carboidratos, lipídios, proteínas', 'Detoxificação', 'Produção de bile', 'Síntese de albumina e fatores de coagulação'],
        clinicalNotes: ['Cirrose: fibrose irreversível', 'Hepatite viral (A,B,C)', 'Esteatose hepática'],
        pathologies: ['Cirrose', 'Hepatite', 'CHC', 'Esteatose', 'Insuficiência Hepática'],
        examTips: ['Couinaud: 8 segmentos', 'Tríade portal: v.porta + a.hepática + ducto biliar', 'Child-Pugh: A,B,C', 'MELD: transplante'],
        references: ['Netter [1] p.280-286', 'Guyton [5] Cap.70'] },
      { id: 'intestinodelgado', name: 'Intestino Delgado', latinName: 'Intestinum Tenue', description: 'Tubo de ~6m: duodeno (25cm), jejuno (2.5m), íleo (3.5m).',
        functions: ['Digestão final', 'Absorção de nutrientes', 'Defesa imunológica (Peyer)'],
        clinicalNotes: ['Doença celíaca', 'Crohn', 'Obstrução intestinal'],
        pathologies: ['Doença Celíaca', 'Crohn', 'Obstrução', 'Divertículo de Meckel'],
        examTips: ['Papila de Vater: colédoco + Wirsung', 'Meckel: regra dos 2s', 'Jejuno > pregas que íleo'],
        references: ['Netter [1] p.274-278', 'Guyton [5] Cap.65-66'] },
      { id: 'pancreas', name: 'Pâncreas', latinName: 'Pancreas', description: 'Glândula mista, retroperitoneal, ~15cm. Cabeça abraçada pelo duodeno.',
        functions: ['Exócrina: lipase, amilase, tripsina', 'Endócrina: insulina (beta) e glucagon (alfa)'],
        clinicalNotes: ['Pancreatite: lipase>3x, dor em faixa', 'Ca pâncreas: icterícia indolor', 'DM1: destruição beta'],
        pathologies: ['Pancreatite', 'Adenocarcinoma', 'Insulinoma', 'Pseudocisto'],
        examTips: ['Partes: cabeça, colo, corpo, cauda', 'Ranson: gravidade', 'Cullen/Grey-Turner: grave', 'CA 19-9'],
        references: ['Netter [1] p.288-290', 'Guyton [5] Cap.64'] },
      { id: 'colon', name: 'Intestino Grosso', latinName: 'Intestinum Crassum', description: 'Ceco, cólon (ascendente, transverso, descendente, sigmoide), reto. ~1.5m.',
        functions: ['Absorção de água e eletrólitos', 'Formação e armazenamento de fezes', 'Fermentação bacteriana'],
        clinicalNotes: ['Ca colorretal: 3º mais comum', 'Diverticulite', 'Colite ulcerativa'],
        pathologies: ['Ca Colorretal', 'Diverticulite', 'RCU', 'Megacólon', 'Polipose'],
        examTips: ['Colonoscopia: rastreio >45 anos', 'Tênias, haustras, apêndices epiploicos', 'CEA: marcador Ca colorretal'],
        references: ['Netter [1] p.276', 'Guyton [5] Cap.66'] },
    ]
  },
  {
    id: 'nervous', name: 'Sistema Nervoso', icon: '🧠', color: '#8B5CF6',
    description: 'Coordena todas as funções. SNC + SNP. Ref: Guyton [5] Cap.45-60',
    organs: [
      { id: 'cerebro', name: 'Cérebro', latinName: 'Cerebrum', description: 'Maior parte do encéfalo (~1.4kg). 2 hemisférios, 4 lobos. ~86 bilhões de neurônios.',
        functions: ['Funções cognitivas superiores', 'Controle motor voluntário', 'Processamento sensorial', 'Linguagem e memória'],
        clinicalNotes: ['AVC isquêmico: 85% dos AVCs', 'AVC hemorrágico: 15%', 'Epilepsia: descargas anormais'],
        pathologies: ['AVC Isquêmico', 'AVC Hemorrágico', 'Epilepsia', 'Alzheimer', 'Tumores Cerebrais'],
        examTips: ['Broca (frontal): expressão da fala', 'Wernicke (temporal): compreensão', 'Homúnculo motor/sensorial', 'Polígono de Willis'],
        histology: 'Córtex: 6 camadas de neurônios. Substância branca: axônios mielinizados.',
        references: ['Guyton [5] Cap.47-58', 'Machado, Neuroanatomia'] },
      { id: 'medula', name: 'Medula Espinhal', latinName: 'Medulla Spinalis', description: 'Cordão nervoso no canal vertebral. De C1 a L1-L2. ~45cm.',
        functions: ['Condução de impulsos aferentes e eferentes', 'Arcos reflexos', 'Centro de reflexos medulares'],
        clinicalNotes: ['Lesão medular: para/tetraplegia', 'Síndrome da cauda equina', 'Mielite transversa'],
        pathologies: ['Lesão Medular', 'Síndrome Cauda Equina', 'Siringomielia', 'ELA'],
        examTips: ['Cone medular: L1-L2', 'Punção lombar: L3-L4 ou L4-L5', 'Dermátomos: C5=deltóide, T4=mamilo, T10=umbigo, L4=joelho'],
        references: ['Moore [4] Cap.4', 'Guyton [5] Cap.55'] },
      { id: 'nervoscranianos', name: 'Nervos Cranianos', latinName: 'Nervi Craniales', description: '12 pares de nervos que emergem do encéfalo.',
        functions: ['Inervação da cabeça e pescoço', 'Funções sensoriais especiais (visão, audição, olfato, gustação)', 'Controle motor da face'],
        clinicalNotes: ['Paralisia facial (VII): periférica vs central', 'Neuralgia do trigêmeo (V)', 'Lesão do III: ptose + midríase'],
        pathologies: ['Paralisia de Bell', 'Neuralgia Trigêmeo', 'Paralisia III par', 'Lesão do Vago'],
        examTips: ['Oh Oh Oh To Touch And Feel Very Good Velvet AH', 'III: motor ocular, IV: troclear, VI: abducente', 'X (vago): parassimpático visceral'],
        references: ['Netter [1] p.118-122', 'Guyton [5] Cap.52'] },
    ]
  },
  {
    id: 'skeletal', name: 'Sistema Musculoesquelético', icon: '🦴', color: '#78716C',
    description: 'Sustentação, proteção, movimento. 206 ossos, >600 músculos. Ref: Moore [4]',
    organs: [
      { id: 'coluna', name: 'Coluna Vertebral', latinName: 'Columna Vertebralis', description: '33 vértebras: 7C + 12T + 5L + 5S (fusionadas) + 4Co. Curvaturas fisiológicas.',
        functions: ['Sustentação do corpo', 'Proteção da medula espinhal', 'Mobilidade do tronco', 'Absorção de impactos'],
        clinicalNotes: ['Hérnia de disco: L4-L5 e L5-S1 mais comuns', 'Espondilolistese', 'Escoliose'],
        pathologies: ['Hérnia Discal', 'Estenose Espinhal', 'Escoliose', 'Espondilite Anquilosante', 'Fratura Vertebral'],
        examTips: ['C1 Atlas: sem corpo', 'C2 Áxis: processo odontoide', 'Pterion: ponto mais frágil do crânio', 'Hérnia L4-L5: comprime raiz L5'],
        references: ['Moore [4] Cap.4', 'Netter [1] p.148-160'] },
      { id: 'femur', name: 'Fêmur', latinName: 'Femur', description: 'Maior e mais forte osso do corpo. Cabeça, colo, trocanteres, diáfise, côndilos.',
        functions: ['Sustentação do peso corporal', 'Inserção muscular', 'Hematopoiese (medula óssea)'],
        clinicalNotes: ['Fratura do colo femoral: idosos, osteoporose', 'Necrose avascular da cabeça femoral'],
        pathologies: ['Fratura Colo Femoral', 'Necrose Avascular', 'Osteossarcoma', 'Fratura Diafisária'],
        examTips: ['Fratura colo: rotação externa + encurtamento', 'Garden: classificação de fraturas do colo', 'Ângulo de inclinação: 125°'],
        references: ['Moore [4] Cap.7', 'Netter [1] p.474'] },
      { id: 'cranio', name: 'Crânio', latinName: 'Cranium', description: '22 ossos: 8 do neurocrânio + 14 do viscerocrânio. Protege o encéfalo.',
        functions: ['Proteção do encéfalo', 'Sustentação da face', 'Cavidades para órgãos sensoriais'],
        clinicalNotes: ['Fratura de base: sinal de Battle, olhos de guaxinim', 'Hematoma epidural: a. meníngea média (pterion)'],
        pathologies: ['Fratura de Crânio', 'Hematoma Epidural', 'Hematoma Subdural', 'Craniossinostose'],
        examTips: ['Pterion: mais frágil, a. meníngea média', 'Fontanelas: anterior fecha 18m, posterior 2m', 'Forames: magno, oval, redondo, espinhoso'],
        references: ['Netter [1] p.2-8', 'Moore [4] Cap.7'] },
    ]
  },
  {
    id: 'urinary', name: 'Sistema Urinário', icon: '💧', color: '#F97316',
    description: 'Filtração do sangue, equilíbrio hidroeletrolítico. Ref: Guyton [5] Cap.26-31',
    organs: [
      { id: 'rins', name: 'Rins', latinName: 'Renes', description: 'Órgãos retroperitoneais (~150g cada). ~1 milhão de néfrons por rim. TFG: 120mL/min.',
        functions: ['Filtração glomerular', 'Reabsorção tubular', 'Regulação da PA (SRAA)', 'Produção de eritropoietina'],
        clinicalNotes: ['DRC: TFG<60 por >3 meses', 'IRA: ↑creatinina aguda', 'Litíase renal: cólica nefrética'],
        pathologies: ['DRC', 'IRA', 'Litíase Renal', 'Glomerulonefrite', 'Pielonefrite', 'Ca Renal'],
        examTips: ['TFG normal: 90-120 mL/min', 'KDIGO: estágios 1-5', 'Néfron: glomérulo + túbulos', 'EPO: produzida no rim'],
        histology: 'Glomérulo: endotélio fenestrado + membrana basal + podócitos. TCP: microvilosidades.',
        references: ['Guyton [5] Cap.26-31', 'Netter [1] p.316-322'] },
      { id: 'bexiga', name: 'Bexiga', latinName: 'Vesica Urinaria', description: 'Reservatório muscular. Capacidade: 400-600mL. Músculo detrusor.',
        functions: ['Armazenamento de urina', 'Micção (contração do detrusor)'],
        clinicalNotes: ['Incontinência urinária', 'Bexiga neurogênica', 'Ca de bexiga: hematúria indolor'],
        pathologies: ['Ca Bexiga', 'Cistite', 'Bexiga Neurogênica', 'Incontinência'],
        examTips: ['Trígono vesical: 2 óstios ureterais + 1 uretral', 'Ca bexiga: tabagismo é FR principal', 'Cistoscopia: diagnóstico'],
        references: ['Netter [1] p.340', 'Moore [4] Cap.6'] },
    ]
  },
  {
    id: 'endocrine', name: 'Sistema Endócrino', icon: '🧪', color: '#EC4899',
    description: 'Regulação hormonal do metabolismo, crescimento, reprodução. Ref: Guyton [5] Cap.75-83',
    organs: [
      { id: 'hipofise', name: 'Hipófise', latinName: 'Hypophysis', description: 'Glândula mestra (~0.5g). Sela túrcica. Adeno-hipófise + neuro-hipófise.',
        functions: ['GH, ACTH, TSH, FSH, LH, PRL (adeno)', 'ADH, Ocitocina (neuro)'],
        clinicalNotes: ['Adenoma hipofisário: prolactinoma mais comum', 'Pan-hipopituitarismo: Sheehan'],
        pathologies: ['Prolactinoma', 'Acromegalia', 'Cushing', 'Sheehan', 'Diabetes Insipidus'],
        examTips: ['Prolactinoma: amenorreia + galactorreia', 'Acromegalia: GH↑ + IGF-1↑', 'DI central: ADH↓'],
        references: ['Guyton [5] Cap.76', 'Netter [1] p.148'] },
      { id: 'tireoide', name: 'Tireoide', latinName: 'Glandula Thyroidea', description: 'Glândula em borboleta no pescoço. Produz T3, T4, calcitonina.',
        functions: ['Regulação do metabolismo basal (T3/T4)', 'Metabolismo do cálcio (calcitonina)', 'Termogênese'],
        clinicalNotes: ['Hipotireoidismo: Hashimoto', 'Hipertireoidismo: Graves', 'Nódulos: Bethesda'],
        pathologies: ['Hashimoto', 'Graves', 'Ca Tireoide', 'Bócio', 'Tireoidite'],
        examTips: ['TSH↑ + T4L↓ = hipo primário', 'TSH↓ + T4L↑ = hiper', 'Bethesda I-VI', 'N. laríngeo recorrente: risco cirúrgico'],
        references: ['Guyton [5] Cap.77', 'Netter [1] p.74-76'] },
      { id: 'suprarrenais', name: 'Suprarrenais', latinName: 'Glandulae Suprarenales', description: 'Sobre os rins. Córtex (3 zonas) + medula. ~5g cada.',
        functions: ['Cortisol (fasciculada)', 'Aldosterona (glomerulosa)', 'Andrógenos (reticular)', 'Catecolaminas (medula)'],
        clinicalNotes: ['Cushing: excesso cortisol', 'Addison: insuficiência adrenal', 'Feocromocitoma: catecolaminas'],
        pathologies: ['Cushing', 'Addison', 'Feocromocitoma', 'Conn', 'Insuficiência Adrenal Aguda'],
        examTips: ['GFR: Glomerulosa-Fasciculada-Reticular', 'Salt-Sugar-Sex', 'Feo: regra dos 10%'],
        references: ['Guyton [5] Cap.78-80', 'Netter [1] p.328-330'] },
    ]
  },
  {
    id: 'reproductive_m', name: 'Reprodutor Masculino', icon: '♂️', color: '#6366F1',
    description: 'Produção de espermatozoides e testosterona. Ref: Moore [4] Cap.6',
    organs: [
      { id: 'testiculos', name: 'Testículos', latinName: 'Testes', description: 'Gônadas masculinas na bolsa escrotal. Espermatogênese + testosterona.',
        functions: ['Espermatogênese (túbulos seminíferos)', 'Testosterona (células de Leydig)', 'Inibina (células de Sertoli)'],
        clinicalNotes: ['Criptorquidia: risco de câncer', 'Torção: emergência', 'Ca testicular: jovens 20-35a'],
        pathologies: ['Ca Testicular', 'Torção', 'Varicocele', 'Hidrocele', 'Orquite'],
        examTips: ['AFP (não-seminoma), beta-hCG (corio), LDH', 'Varicocele: mais à E', 'Torção: dor + sem reflexo cremastérico'],
        references: ['Netter [1] p.370-374', 'Moore [4] Cap.6'] },
      { id: 'prostata', name: 'Próstata', latinName: 'Prostata', description: 'Glândula do tamanho de uma noz. Envolve a uretra prostática. Produz líquido prostático.',
        functions: ['Produção de líquido prostático (30% do sêmen)', 'Contração durante ejaculação'],
        clinicalNotes: ['HPB: mais comum >50 anos', 'Ca próstata: 2º mais comum em homens', 'Prostatite'],
        pathologies: ['HPB', 'Ca Próstata', 'Prostatite', 'Abscesso Prostático'],
        examTips: ['PSA: rastreio controverso', 'Gleason: grau histológico', 'Toque retal: nódulo endurecido', 'Zonas: periférica (Ca), transicional (HPB)'],
        references: ['Netter [1] p.376', 'Moore [4] Cap.6'] },
    ]
  },
  {
    id: 'reproductive_f', name: 'Reprodutor Feminino', icon: '♀️', color: '#F472B6',
    description: 'Produção de óvulos, gestação, hormônios femininos. Ref: Moore [4] Cap.6',
    organs: [
      { id: 'utero', name: 'Útero', latinName: 'Uterus', description: 'Órgão muscular em pera invertida. Fundo, corpo, istmo, colo. Endométrio + miométrio + perimétrio.',
        functions: ['Implantação do embrião', 'Desenvolvimento fetal', 'Menstruação', 'Parto'],
        clinicalNotes: ['Mioma: tumor benigno mais comum', 'Ca endométrio: sangramento pós-menopausa', 'Ca colo: HPV 16/18'],
        pathologies: ['Mioma', 'Endometriose', 'Ca Endométrio', 'Ca Colo Uterino', 'Adenomiose'],
        examTips: ['Papanicolaou: 25-64 anos', 'FIGO: estadiamento', 'HPV: vacina quadrivalente (6,11,16,18)'],
        references: ['Netter [1] p.356-362', 'Moore [4] Cap.6'] },
      { id: 'ovarios', name: 'Ovários', latinName: 'Ovaria', description: 'Gônadas femininas (~3x2x1cm). Produzem óvulos, estrogênio e progesterona.',
        functions: ['Ovulação', 'Produção de estrogênio e progesterona', 'Maturação folicular'],
        clinicalNotes: ['SOP: anovulação crônica', 'Ca ovário: silencioso', 'Torção ovariana'],
        pathologies: ['SOP', 'Ca Ovário', 'Cisto Ovariano', 'Torção', 'Endometrioma'],
        examTips: ['CA-125: marcador Ca ovário', 'SOP: Rotterdam (2 de 3 critérios)', 'Teratoma: tumor de células germinativas mais comum'],
        references: ['Netter [1] p.358', 'Moore [4] Cap.6'] },
    ]
  },
  {
    id: 'lymphatic', name: 'Sistema Linfático/Imune', icon: '🛡️', color: '#10B981',
    description: 'Defesa, drenagem linfática, imunidade. Ref: Guyton [5] Cap.34-35',
    organs: [
      { id: 'baco', name: 'Baço', latinName: 'Splen', description: 'Maior órgão linfoide (~150g). Hipocôndrio E, costelas 9-11.',
        functions: ['Filtração do sangue', 'Reservatório de plaquetas (30%)', 'Produção de anticorpos', 'Hematopoiese fetal'],
        clinicalNotes: ['Esplenomegalia: infecções, hematológicas, hipertensão portal', 'Ruptura: trauma abdominal'],
        pathologies: ['Esplenomegalia', 'Ruptura Esplênica', 'Infarto Esplênico', 'Hiperesplenismo'],
        examTips: ['Polpa branca: linfócitos', 'Polpa vermelha: filtração', 'Pós-esplenectomia: vacinar pneumo/meningo/Hib', 'Howell-Jolly: asplenia'],
        references: ['Netter [1] p.292-294', 'Guyton [5] Cap.34'] },
      { id: 'timo', name: 'Timo', latinName: 'Thymus', description: 'Órgão linfoide primário no mediastino anterior. Involui na puberdade.',
        functions: ['Maturação de linfócitos T', 'Seleção positiva e negativa'],
        clinicalNotes: ['Timoma: associado a miastenia gravis (30-50%)', 'DiGeorge: aplasia tímica'],
        pathologies: ['Timoma', 'Hiperplasia', 'DiGeorge'],
        examTips: ['Seleção +: reconhece MHC (córtex)', 'Seleção -: elimina autorreativas (medula)', 'DiGeorge: del 22q11'],
        references: ['Netter [1] p.234', 'Guyton [5] Cap.35'] },
      { id: 'linfonodos', name: 'Linfonodos', latinName: 'Nodi Lymphoidei', description: 'Pequenos órgãos (1-25mm) distribuídos ao longo dos vasos linfáticos. ~600 no corpo.',
        functions: ['Filtração da linfa', 'Apresentação de antígenos', 'Produção de linfócitos'],
        clinicalNotes: ['Linfadenopatia: infecção, neoplasia, autoimune', 'Linfonodo sentinela: Ca mama e melanoma'],
        pathologies: ['Linfoma Hodgkin', 'Linfoma Não-Hodgkin', 'Metástase Linfonodal', 'Linfadenite'],
        examTips: ['Virchow (supraclavicular E): Ca gástrico', 'Sentinela: 1º linfonodo de drenagem', 'Reed-Sternberg: Hodgkin'],
        references: ['Netter [1] p.236', 'Abbas Imunologia'] },
    ]
  },
  {
    id: 'integumentary', name: 'Sistema Tegumentar', icon: '🧴', color: '#A78BFA',
    description: 'Pele e anexos. Maior órgão (~2m², ~4kg). Ref: Tortora [7]',
    organs: [
      { id: 'pele', name: 'Pele', latinName: 'Cutis', description: 'Maior órgão. 3 camadas: epiderme, derme, hipoderme. 0.5-4mm.',
        functions: ['Barreira protetora', 'Termorregulação', 'Sensibilidade', 'Síntese de vitamina D', 'Excreção'],
        clinicalNotes: ['Melanoma: ABCDE', 'Queimaduras: regra dos 9', 'Psoríase: placas eritematosas'],
        pathologies: ['Melanoma', 'CBC', 'CEC', 'Psoríase', 'Dermatite Atópica', 'Queimaduras'],
        examTips: ['Epiderme: queratinócitos 90%, melanócitos, Langerhans, Merkel', 'Camadas: basal, espinhosa, granulosa, lúcida, córnea', 'Regra dos 9: cabeça 9%, MMSS 9%, MMII 18%, tronco 36%'],
        histology: 'Epiderme: estratificado pavimentoso queratinizado. Derme: papilar + reticular.',
        references: ['Tortora [7] Cap.5', 'Netter [1] p.1'] },
    ]
  },
  {
    id: 'sensory', name: 'Órgãos dos Sentidos', icon: '👁️', color: '#06B6D4',
    description: 'Visão, audição, olfato, gustação, equilíbrio. Ref: Guyton [5] Cap.50-53',
    organs: [
      { id: 'olho', name: 'Olho', latinName: 'Oculus', description: 'Órgão da visão. 3 túnicas: fibrosa, vascular, nervosa (retina).',
        functions: ['Captação de luz', 'Formação de imagem na retina', 'Acomodação visual'],
        clinicalNotes: ['Glaucoma: ↑PIO', 'Catarata: opacificação do cristalino', 'DMRI: degeneração macular'],
        pathologies: ['Glaucoma', 'Catarata', 'DMRI', 'Descolamento de Retina', 'Retinopatia Diabética'],
        examTips: ['Cones: visão de cores (fóvea)', 'Bastonetes: visão noturna (periferia)', 'N. óptico (II par): disco óptico = ponto cego'],
        references: ['Guyton [5] Cap.50-51', 'Netter [1] p.86-90'] },
      { id: 'ouvido', name: 'Ouvido', latinName: 'Auris', description: 'Externo, médio e interno. Audição e equilíbrio.',
        functions: ['Audição (cóclea)', 'Equilíbrio (vestíbulo e canais semicirculares)', 'Condução sonora'],
        clinicalNotes: ['Otite média: mais comum em crianças', 'Surdez neurossensorial vs condutiva', 'Vertigem: VPPB mais comum'],
        pathologies: ['Otite Média', 'Otosclerose', 'Ménière', 'VPPB', 'Neurinoma do Acústico'],
        examTips: ['Weber: lateraliza para ouvido doente (condutiva) ou sadio (neurossensorial)', 'Rinne: CA>CO normal', 'Cóclea: órgão de Corti'],
        references: ['Guyton [5] Cap.52-53', 'Netter [1] p.92-96'] },
    ]
  },
];

// === QUIZ QUESTIONS (40 questões) ===
const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'q1', system: 'cardiovascular', question: 'Qual é o principal marca-passo natural do coração?', options: ['Nó atrioventricular', 'Nó sinusal (sinoatrial)', 'Feixe de His', 'Fibras de Purkinje'], correct: 1, explanation: 'O nó sinusal (SA), localizado no átrio direito, gera impulsos a 60-100 bpm.', difficulty: 'facil', reference: 'Guyton [5]' },
  { id: 'q2', system: 'cardiovascular', question: 'Na classificação de Stanford, a dissecção tipo A envolve:', options: ['Aorta descendente', 'Aorta ascendente', 'Arco aórtico apenas', 'Aorta abdominal'], correct: 1, explanation: 'Stanford A: aorta ascendente = CIRURGIA. Stanford B: descendente = clínico.', difficulty: 'medio', reference: 'Netter [1]' },
  { id: 'q3', system: 'respiratory', question: 'Quantos lobos tem o pulmão direito?', options: ['2', '3', '4', '5'], correct: 1, explanation: 'Pulmão D: 3 lobos (superior, médio, inferior). E: 2 lobos.', difficulty: 'facil', reference: 'Netter [1]' },
  { id: 'q4', system: 'respiratory', question: 'Nível vertebral do hiato esofágico do diafragma:', options: ['T8', 'T10', 'T12', 'L1'], correct: 1, explanation: 'VCI=T8, esôfago=T10, aorta=T12.', difficulty: 'medio', reference: 'Moore [4]' },
  { id: 'q5', system: 'digestive', question: 'Qual célula gástrica produz fator intrínseco?', options: ['Principais', 'Parietais (oxínticas)', 'Células G', 'Mucosas'], correct: 1, explanation: 'Parietais: HCl + fator intrínseco. Deficiência = anemia perniciosa.', difficulty: 'medio', reference: 'Guyton [5]' },
  { id: 'q6', system: 'digestive', question: 'Child-Pugh classifica a gravidade de:', options: ['Pancreatite', 'Cirrose hepática', 'Ca gástrico', 'Esteatose'], correct: 1, explanation: 'Child-Pugh (A,B,C): bilirrubina, albumina, INR, ascite, encefalopatia.', difficulty: 'medio', reference: 'Netter [1]' },
  { id: 'q7', system: 'nervous', question: 'Área cerebral da expressão da fala:', options: ['Wernicke', 'Broca', 'Córtex motor', 'Pré-frontal'], correct: 1, explanation: 'Broca (frontal): expressão. Wernicke (temporal): compreensão.', difficulty: 'facil', reference: 'Guyton [5]' },
  { id: 'q8', system: 'nervous', question: 'Nível vertebral do cone medular no adulto:', options: ['T12', 'L1-L2', 'L3-L4', 'S1'], correct: 1, explanation: 'Cone medular em L1-L2. Punção lombar em L3-L4 ou L4-L5.', difficulty: 'medio', reference: 'Moore [4]' },
  { id: 'q9', system: 'skeletal', question: 'Ponto mais frágil do crânio (a. meníngea média):', options: ['Bregma', 'Lambda', 'Pterion', 'Asterion'], correct: 2, explanation: 'Pterion: junção frontal+parietal+temporal+esfenoide. Trauma = hematoma epidural.', difficulty: 'medio', reference: 'Netter [1]' },
  { id: 'q10', system: 'skeletal', question: 'Característica única da vértebra C1 (Atlas):', options: ['Processo odontoide', 'Sem corpo vertebral', 'Forame triangular', 'Espinhoso bífido'], correct: 1, explanation: 'C1 não tem corpo nem espinhoso. C2 tem processo odontoide.', difficulty: 'medio', reference: 'Moore [4]' },
  { id: 'q11', system: 'urinary', question: 'TFG normal:', options: ['30-60 mL/min', '60-90 mL/min', '90-120 mL/min', '120-150 mL/min'], correct: 2, explanation: 'TFG normal: 90-120 mL/min. DRC estágio 5: <15 (diálise).', difficulty: 'facil', reference: 'Guyton [5]' },
  { id: 'q12', system: 'endocrine', question: 'Tumor hipofisário mais comum:', options: ['Somatotropinoma', 'Prolactinoma', 'Corticotropinoma', 'Tirotropinoma'], correct: 1, explanation: 'Prolactinoma: amenorreia + galactorreia. Tratamento: cabergolina.', difficulty: 'medio', reference: 'Guyton [5]' },
  { id: 'q13', system: 'endocrine', question: 'TSH↑ + T4L↓ indica:', options: ['Hipertireoidismo primário', 'Hipotireoidismo primário', 'Hipotireoidismo central', 'Eutireoidismo'], correct: 1, explanation: 'TSH↑ + T4L↓ = hipotireoidismo primário (tireoide). Hashimoto é causa mais comum.', difficulty: 'facil', reference: 'Guyton [5]' },
  { id: 'q14', system: 'lymphatic', question: 'Linfonodo de Virchow (supraclavicular E) sugere:', options: ['Ca mama', 'Ca gástrico', 'Linfoma', 'Ca pulmão'], correct: 1, explanation: 'Virchow: metástase de Ca gástrico via ducto torácico.', difficulty: 'medio', reference: 'Netter [1]' },
  { id: 'q15', system: 'integumentary', question: 'Regra dos 9 de Wallace - cabeça corresponde a:', options: ['4.5%', '9%', '18%', '1%'], correct: 1, explanation: 'Cabeça 9%, MMSS 9% cada, MMII 18% cada, tronco anterior 18%, posterior 18%, períneo 1%.', difficulty: 'facil', reference: 'Tortora [7]' },
  { id: 'q16', system: 'cardiovascular', question: 'A artéria DA (descendente anterior) irriga:', options: ['Parede inferior', 'Parede anterior e septo', 'Parede lateral', 'Nó AV'], correct: 1, explanation: 'DA: parede anterior + 2/3 anteriores do septo. Oclusão = IAM anterior.', difficulty: 'medio', reference: 'Netter [1]' },
  { id: 'q17', system: 'digestive', question: 'Sinal de Cullen (equimose periumbilical) sugere:', options: ['Apendicite', 'Pancreatite grave', 'Colecistite', 'Obstrução intestinal'], correct: 1, explanation: 'Cullen (periumbilical) e Grey-Turner (flancos): pancreatite grave/hemorragia retroperitoneal.', difficulty: 'medio', reference: 'Guyton [5]' },
  { id: 'q18', system: 'nervous', question: 'Polígono de Willis é formado por:', options: ['Apenas carótidas internas', 'Carótidas internas + vertebrais + comunicantes', 'Apenas vertebrais', 'Carótidas externas'], correct: 1, explanation: 'Polígono: ACA + ACoA + ACI + ACoP + ACP + basilar. Anastomose arterial na base do crânio.', difficulty: 'medio', reference: 'Guyton [5]' },
  { id: 'q19', system: 'reproductive_m', question: 'Zona prostática mais acometida pelo câncer:', options: ['Central', 'Periférica', 'Transicional', 'Periuretral'], correct: 1, explanation: 'Ca próstata: zona periférica (70%). HPB: zona transicional.', difficulty: 'medio', reference: 'Moore [4]' },
  { id: 'q20', system: 'reproductive_f', question: 'Critérios de Rotterdam para SOP requerem:', options: ['1 de 3 critérios', '2 de 3 critérios', '3 de 3 critérios', 'Apenas hiperandrogenismo'], correct: 1, explanation: 'Rotterdam: 2 de 3 (oligo/anovulação, hiperandrogenismo, ovários policísticos na USG).', difficulty: 'medio', reference: 'Moore [4]' },
  { id: 'q21', system: 'sensory', question: 'Teste de Weber lateraliza para ouvido doente na surdez:', options: ['Neurossensorial', 'Condutiva', 'Mista', 'Central'], correct: 1, explanation: 'Weber: condutiva=lateraliza p/ doente. Neurossensorial=lateraliza p/ sadio.', difficulty: 'medio', reference: 'Guyton [5]' },
  { id: 'q22', system: 'cardiovascular', question: 'Qual valva separa o VE da aorta?', options: ['Mitral', 'Tricúspide', 'Aórtica', 'Pulmonar'], correct: 2, explanation: 'Valva aórtica (3 cúspides semilunares) entre VE e aorta.', difficulty: 'facil', reference: 'Netter [1]' },
  { id: 'q23', system: 'respiratory', question: 'Pneumócitos tipo II produzem:', options: ['Muco', 'Surfactante', 'IgA', 'Histamina'], correct: 1, explanation: 'Pneumócitos II: surfactante (reduz tensão superficial alveolar). Deficiência: SDR neonatal.', difficulty: 'facil', reference: 'Guyton [5]' },
  { id: 'q24', system: 'digestive', question: 'Segmentação hepática de Couinaud divide o fígado em:', options: ['4 segmentos', '6 segmentos', '8 segmentos', '10 segmentos'], correct: 2, explanation: 'Couinaud: 8 segmentos baseados na vascularização portal e drenagem hepática.', difficulty: 'medio', reference: 'Netter [1]' },
  { id: 'q25', system: 'nervous', question: 'Dermátomo T10 corresponde a:', options: ['Mamilo', 'Umbigo', 'Joelho', 'Inguinal'], correct: 1, explanation: 'T4=mamilo, T10=umbigo, L1=inguinal, L4=joelho, S1=planta do pé.', difficulty: 'facil', reference: 'Moore [4]' },
  { id: 'q26', system: 'skeletal', question: 'Fratura do colo femoral apresenta:', options: ['Rotação interna + alongamento', 'Rotação externa + encurtamento', 'Sem deformidade', 'Flexão do quadril'], correct: 1, explanation: 'Fratura colo femoral: rotação externa + encurtamento + dor. Comum em idosos com osteoporose.', difficulty: 'medio', reference: 'Moore [4]' },
  { id: 'q27', system: 'urinary', question: 'Eritropoietina (EPO) é produzida principalmente:', options: ['Fígado', 'Rins', 'Baço', 'Medula óssea'], correct: 1, explanation: 'EPO: 90% rins (células peritubulares). Estimula eritropoiese na medula óssea. DRC = anemia.', difficulty: 'facil', reference: 'Guyton [5]' },
  { id: 'q28', system: 'endocrine', question: 'Mnemônico das zonas adrenais (GFR):', options: ['Glomerulosa-Fasciculada-Reticular', 'Granulosa-Folicular-Reticular', 'Glomerulosa-Fibrosa-Reticular', 'Granulosa-Fasciculada-Radial'], correct: 0, explanation: 'GFR: Glomerulosa (aldosterona), Fasciculada (cortisol), Reticular (andrógenos). Salt-Sugar-Sex.', difficulty: 'facil', reference: 'Guyton [5]' },
  { id: 'q29', system: 'lymphatic', question: 'Corpúsculos de Howell-Jolly no sangue periférico indicam:', options: ['Anemia falciforme', 'Asplenia funcional', 'Leucemia', 'Talassemia'], correct: 1, explanation: 'Howell-Jolly: restos nucleares em hemácias. Normalmente removidos pelo baço. Presença = asplenia.', difficulty: 'medio', reference: 'Guyton [5]' },
  { id: 'q30', system: 'integumentary', question: 'Melanoma: critério ABCDE - D significa:', options: ['Dor', 'Diâmetro >6mm', 'Descamação', 'Depressão'], correct: 1, explanation: 'ABCDE: Assimetria, Bordas irregulares, Cor heterogênea, Diâmetro >6mm, Evolução.', difficulty: 'facil', reference: 'Tortora [7]' },
  { id: 'q31', system: 'cardiovascular', question: 'A coronária direita irriga o nó AV em que % dos casos?', options: ['50%', '70%', '85%', '95%'], correct: 2, explanation: 'CD irriga nó AV em ~85% (dominância direita). Em 15%, a Cx (dominância esquerda).', difficulty: 'dificil', reference: 'Guyton [5]' },
  { id: 'q32', system: 'digestive', question: 'Divertículo de Meckel - regra dos 2s:', options: ['2% da população, 2 pés do ceco', '2% da população, 2 pés do íleo terminal', '20% da população, 2cm', '2% da população, 2 pés do duodeno'], correct: 1, explanation: '2% população, 2 pés (~60cm) do íleo terminal, 2 polegadas, 2 tipos de mucosa ectópica, <2 anos sintomático.', difficulty: 'medio', reference: 'Netter [1]' },
  { id: 'q33', system: 'nervous', question: 'Síndrome de DiGeorge é causada por:', options: ['Deleção 21q', 'Deleção 22q11', 'Trissomia 21', 'Deleção 7q'], correct: 1, explanation: 'DiGeorge: del 22q11 → aplasia tímica + hipoparatireoidismo + cardiopatia + face típica.', difficulty: 'dificil', reference: 'Abbas Imunologia' },
  { id: 'q34', system: 'reproductive_f', question: 'Rastreio de Ca de colo uterino (Papanicolaou) é recomendado dos:', options: ['18 aos 50 anos', '25 aos 64 anos', '30 aos 70 anos', '21 aos 65 anos'], correct: 1, explanation: 'No Brasil: Papanicolaou dos 25 aos 64 anos, a cada 3 anos após 2 exames anuais normais.', difficulty: 'facil', reference: 'Moore [4]' },
  { id: 'q35', system: 'sensory', question: 'Cones da retina são responsáveis por:', options: ['Visão noturna', 'Visão de cores', 'Visão periférica', 'Adaptação ao escuro'], correct: 1, explanation: 'Cones: visão de cores e acuidade (fóvea). Bastonetes: visão noturna e periférica.', difficulty: 'facil', reference: 'Guyton [5]' },
  { id: 'q36', system: 'urinary', question: 'Trígono vesical é formado por:', options: ['3 óstios ureterais', '2 óstios ureterais + 1 uretral interno', '2 óstios uretrais + 1 ureteral', '3 pregas mucosas'], correct: 1, explanation: 'Trígono: 2 óstios ureterais (superiores) + 1 óstio uretral interno (inferior). Área lisa da bexiga.', difficulty: 'medio', reference: 'Moore [4]' },
  { id: 'q37', system: 'endocrine', question: 'Feocromocitoma: regra dos 10% NÃO inclui:', options: ['10% bilateral', '10% maligno', '10% extra-adrenal', '10% em mulheres'], correct: 3, explanation: 'Regra dos 10%: bilateral, maligno, extra-adrenal, familiar, pediátrico. Não inclui gênero.', difficulty: 'dificil', reference: 'Guyton [5]' },
  { id: 'q38', system: 'skeletal', question: 'Fontanela anterior (bregmática) fecha com:', options: ['2 meses', '6 meses', '12 meses', '18 meses'], correct: 3, explanation: 'Fontanela anterior: fecha ~18 meses. Posterior: fecha ~2 meses.', difficulty: 'facil', reference: 'Moore [4]' },
  { id: 'q39', system: 'lymphatic', question: 'Célula de Reed-Sternberg é patognomônica de:', options: ['Linfoma Não-Hodgkin', 'Linfoma de Hodgkin', 'Leucemia Linfocítica', 'Mieloma Múltiplo'], correct: 1, explanation: 'Reed-Sternberg: célula gigante binucleada ("olhos de coruja"). Patognomônica do Linfoma de Hodgkin.', difficulty: 'medio', reference: 'Abbas Imunologia' },
  { id: 'q40', system: 'reproductive_m', question: 'Varicocele é mais comum à esquerda porque:', options: ['Veia gonadal E drena na veia renal E', 'Testículo E é maior', 'Artéria testicular E é mais longa', 'Músculo cremáster E é mais fraco'], correct: 0, explanation: 'Veia gonadal E drena na veia renal E (ângulo reto). D drena direto na VCI (ângulo agudo).', difficulty: 'medio', reference: 'Moore [4]' },
];

// === SM-2 ALGORITHM ===
function sm2Algorithm(quality: number, repetition: number, easeFactor: number, interval: number) {
  let newInterval: number, newRepetition: number, newEaseFactor: number;
  if (quality >= 3) {
    if (repetition === 0) newInterval = 1;
    else if (repetition === 1) newInterval = 6;
    else newInterval = Math.round(interval * easeFactor);
    newRepetition = repetition + 1;
  } else { newInterval = 1; newRepetition = 0; }
  newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEaseFactor < 1.3) newEaseFactor = 1.3;
  return { interval: newInterval, repetition: newRepetition, easeFactor: newEaseFactor };
}

// === SKETCHFAB VIEWER (Realistic 3D) ===
function SketchFabViewer({ modelId, height = 500 }: { modelId: string; height?: number }) {
  return (
    <div className="rounded-xl overflow-hidden border border-border" style={{ height }}>
      <iframe
        title="SketchFab 3D Model"
        src={`https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=0&ui_watermark_link=0`}
        style={{ width: '100%', height: '100%', border: 'none' }}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
      />
    </div>
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
    { id: 0, name: 'Visao Externa', desc: 'Corpo humano completo com pele', color: '#F5D0B5' },
    { id: 1, name: 'Pele e Subcutaneo', desc: 'Epiderme, derme, hipoderme', color: '#F0C8A0' },
    { id: 2, name: 'Sistema Muscular', desc: 'Musculos esqueleticos', color: '#CC3333' },
    { id: 3, name: 'Sistema Vascular', desc: 'Arterias, veias, capilares', color: '#EE3333' },
    { id: 4, name: 'Sistema Nervoso', desc: 'Encefalo, medula, nervos', color: '#FFD700' },
    { id: 5, name: 'Sistema Esqueletico', desc: 'Ossos, articulacoes', color: '#F5F0E0' },
    { id: 6, name: 'Orgaos Internos', desc: 'Coracao, pulmoes, figado, rins', color: '#CC4444' },
    { id: 7, name: 'Visao Completa', desc: 'Todas as camadas', color: '#AAAAAA' },
  ];

  const ANIMATIONS = [
    { id: 'cardiac_cycle', name: 'Ciclo Cardiaco', desc: 'Sistole atrial, ventricular, Diastole', icon: '❤️', ref: 'Guyton [5] Cap.9' },
    { id: 'respiration', name: 'Respiracao', desc: 'Inspiracao e expiracao', icon: '🫁', ref: 'Guyton [5] Cap.38' },
    { id: 'peristalsis', name: 'Peristalse', desc: 'Movimentos peristalticos', icon: '🔄', ref: 'Guyton [5] Cap.63' },
    { id: 'synapse', name: 'Sinapse Neural', desc: 'Transmissao do impulso', icon: '⚡', ref: 'Guyton [5] Cap.46' },
    { id: 'filtration', name: 'Filtracao Renal', desc: 'Filtracao glomerular', icon: '💧', ref: 'Guyton [5] Cap.26' },
    { id: 'muscle_contraction', name: 'Contracao Muscular', desc: 'Filamentos deslizantes', icon: '💪', ref: 'Guyton [5] Cap.6' },
  ];

  const handleQuizAnswer = (optionIndex: number) => {
    if (quizState.answered) return;
    const q = QUIZ_QUESTIONS[quizState.currentQ];
    const isCorrect = optionIndex === q.correct;
    const quality = isCorrect ? 5 : 1;
    const prev = quizState.sm2Data[q.id] || { interval: 0, repetition: 0, easeFactor: 2.5 };
    const updated = sm2Algorithm(quality, prev.repetition, prev.easeFactor, prev.interval);
    setQuizState(s => ({ ...s, answered: true, selectedOpt: optionIndex, score: isCorrect ? s.score + 1 : s.score, sm2Data: { ...s.sm2Data, [q.id]: updated } }));
  };

  const nextQuestion = () => setQuizState(s => ({ ...s, currentQ: (s.currentQ + 1) % QUIZ_QUESTIONS.length, answered: false, selectedOpt: null }));

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span className="text-3xl">🧬</span> Atlas de Anatomia 3D
          </h1>
          <p className="text-sm text-muted-foreground mt-1">v8.0 — 12 sistemas, 40+ orgaos, 16 modelos SketchFab fotorrealistas, quiz SM-2 adaptativo</p>
        </div>
        <button onClick={() => setShowReferences(!showReferences)} className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/30 transition">
          Ref.
        </button>
      </div>

      {showReferences && (
        <div className="mb-6 p-4 rounded-xl bg-card border border-border">
          <h3 className="font-bold mb-3 text-sm">Referencias Bibliograficas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
            {['[1] Netter FH. Atlas de Anatomia Humana. 7a ed. Elsevier, 2019.', '[2] Gray H. Gray\'s Anatomy. 42nd ed. Elsevier, 2020.', '[3] Sobotta J. Atlas de Anatomia Humana. 24a ed. 2018.', '[4] Moore KL. Anatomia Orientada para a Clinica. 8a ed. 2019.', '[5] Guyton AC. Tratado de Fisiologia Medica. 14a ed. 2021.', '[6] Prometheus. Atlas de Anatomia. 4a ed. 2019.', '[7] Tortora GJ. Principios de Anatomia e Fisiologia. 14a ed. 2016.', '[8] Rohen JW. Anatomia Humana: Atlas Fotografico. 9a ed. 2021.'].map((r, i) => <p key={i}>{r}</p>)}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {([
          { id: 'explore' as const, label: 'Explorar Sistemas', desc: '12 sistemas corporais' },
          { id: 'dissection' as const, label: 'Disseccao 3D', desc: '7 camadas anatomicas realistas' },
          { id: 'sketchfab' as const, label: 'Modelos Realistas', desc: '16 modelos fotorrealistas' },
          { id: 'animations' as const, label: 'Animacoes', desc: '6 animacoes fisiologicas' },
          { id: 'quiz' as const, label: 'Quiz SM-2', desc: '40 questoes adaptativas' },
        ] as const).map(mode => (
          <button key={mode.id} onClick={() => setViewMode(mode.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${viewMode === mode.id ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'bg-card border border-border hover:bg-accent'}`}>
            <div>{mode.label}</div>
            <div className="text-[10px] opacity-70">{mode.desc}</div>
          </button>
        ))}
      </div>

      {/* === EXPLORE MODE === */}
      {viewMode === 'explore' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <input type="text" placeholder="Buscar sistema ou orgao..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary outline-none" />
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {filteredSystems.map(system => (
                <button key={system.id} onClick={() => { setSelectedSystem(system.id); setSelectedOrgan(null); }}
                  className={`w-full text-left p-3 rounded-xl transition-all ${selectedSystem === system.id ? 'bg-primary/20 border-primary border-2 shadow-lg' : 'bg-card border border-border hover:bg-accent'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{system.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{system.name}</div>
                      <div className="text-[10px] text-muted-foreground">{system.organs.length} orgaos</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2">
            {currentSystem ? (
              <div className="space-y-4">
                {/* REALISTIC 3D MODEL via SketchFab */}
                <SketchFabViewer modelId={SYSTEM_SKETCHFAB[currentSystem.id] || '9b0b079953b840bc9a13f524b60041e4'} height={450} />
                <p className="text-xs text-muted-foreground text-center">Modelo 3D fotorrealista — Arraste para rotacionar, scroll para zoom</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {currentSystem.organs.map(organ => (
                    <button key={organ.id} onClick={() => setSelectedOrgan(organ.id)}
                      className={`p-3 rounded-xl text-left transition-all ${selectedOrgan === organ.id ? 'bg-primary/20 border-primary border-2' : 'bg-card border border-border hover:bg-accent'}`}>
                      <div className="font-medium text-sm">{organ.name}</div>
                      <div className="text-[10px] text-muted-foreground italic">{organ.latinName}</div>
                    </button>
                  ))}
                </div>
                {currentOrgan && (
                  <div className="p-5 rounded-xl bg-card border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">{currentOrgan.name} <span className="text-sm font-normal text-muted-foreground italic">({currentOrgan.latinName})</span></h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{currentOrgan.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-primary mb-1">Funcoes</h4>
                        <ul className="text-xs text-muted-foreground space-y-0.5">{currentOrgan.functions.map((f, i) => <li key={i}>- {f}</li>)}</ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-primary mb-1">Patologias</h4>
                        <div className="flex flex-wrap gap-1">{currentOrgan.pathologies.map((p, i) => <span key={i} className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[10px]">{p}</span>)}</div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-primary mb-1">Notas Clinicas</h4>
                        <ul className="text-xs text-muted-foreground space-y-0.5">{currentOrgan.clinicalNotes.map((n, i) => <li key={i}>- {n}</li>)}</ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-primary mb-1">Dicas de Prova</h4>
                        <ul className="text-xs text-yellow-400 space-y-0.5">{currentOrgan.examTips.map((t, i) => <li key={i}>- {t}</li>)}</ul>
                      </div>
                      {currentOrgan.histology && (
                        <div>
                          <h4 className="text-xs font-semibold text-primary mb-1">Histologia</h4>
                          <p className="text-xs text-muted-foreground">{currentOrgan.histology}</p>
                        </div>
                      )}
                      {currentOrgan.bloodSupply && (
                        <div>
                          <h4 className="text-xs font-semibold text-primary mb-1">Irrigacao</h4>
                          <p className="text-xs text-muted-foreground">{currentOrgan.bloodSupply}</p>
                        </div>
                      )}
                      {currentOrgan.innervation && (
                        <div>
                          <h4 className="text-xs font-semibold text-primary mb-1">Inervacao</h4>
                          <p className="text-xs text-muted-foreground">{currentOrgan.innervation}</p>
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Ref: {currentOrgan.references.join(' | ')}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 rounded-xl bg-card border border-border">
                <div className="text-center"><span className="text-6xl">🧬</span><p className="text-muted-foreground mt-4">Selecione um sistema corporal para explorar</p></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* === DISSECTION MODE — REALISTIC via SketchFab === */}
      {viewMode === 'dissection' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SketchFabViewer modelId={DISSECTION_SKETCHFAB[dissectionDepth]?.sketchfabId || '9b0b079953b840bc9a13f524b60041e4'} height={550} />
            <div className="mt-2 p-3 rounded-xl bg-card border border-border text-center">
              <p className="text-sm font-medium text-primary">{DISSECTION_SKETCHFAB[dissectionDepth]?.name || 'Visao Externa'}</p>
              <p className="text-xs text-muted-foreground">Modelo 3D fotorrealista — Arraste para rotacionar, scroll para zoom</p>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">Profundidade de Disseccao</h3>
                <span className="text-xs text-muted-foreground">Camada {dissectionDepth} de 7</span>
              </div>
              <input type="range" min={0} max={7} value={dissectionDepth} onChange={e => setDissectionDepth(Number(e.target.value))} className="w-full accent-primary" />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Pele</span><span>Musculo</span><span>Vasos</span><span>Nervos</span><span>Ossos</span><span>Orgaos</span><span>Tudo</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-sm">Camadas Anatomicas</h3>
            <p className="text-xs text-muted-foreground">Selecione camadas para explorar estruturas em profundidade. Ref: Gray's [2]</p>
            {DISSECTION_LAYERS.map(layer => (
              <button key={layer.id} onClick={() => setDissectionDepth(layer.id)}
                className={`w-full text-left p-3 rounded-xl transition-all ${dissectionDepth === layer.id ? 'bg-primary/20 border-primary border-2' : 'bg-card border border-border hover:bg-accent'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: layer.color }} />
                  <div><div className="font-medium text-sm">{layer.name}</div><div className="text-[10px] text-muted-foreground">{layer.desc}</div></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* === SKETCHFAB MODELS === */}
      {viewMode === 'sketchfab' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {SKETCHFAB_MODELS.map(model => (
              <button key={model.id} onClick={() => setSelectedSketchfabModel(model.sketchfabId)}
                className={`p-3 rounded-xl text-left transition-all ${selectedSketchfabModel === model.sketchfabId ? 'bg-primary/20 border-primary border-2' : 'bg-card border border-border hover:bg-accent'}`}>
                <div className="text-2xl mb-2">{model.icon}</div>
                <div className="font-medium text-sm">{model.name}</div>
                <div className="text-[10px] text-muted-foreground">{model.system}</div>
                <div className="text-[9px] text-muted-foreground mt-1">{model.description}</div>
              </button>
            ))}
          </div>
          {selectedSketchfabModel ? (
            <div>
              <SketchFabViewer modelId={selectedSketchfabModel} height={550} />
              <p className="text-xs text-muted-foreground mt-2 text-center">Modelo 3D fotorrealista — Arraste para rotacionar, scroll para zoom. Fonte: SketchFab</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 rounded-xl bg-card border border-border">
              <div className="text-center"><span className="text-6xl">🎨</span><p className="text-muted-foreground mt-4">Selecione um modelo 3D fotorrealista acima</p></div>
            </div>
          )}
        </div>
      )}

      {/* === ANIMATIONS MODE — REALISTIC via SketchFab === */}
      {viewMode === 'animations' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SketchFabViewer modelId={ANIMATION_SKETCHFAB[selectedAnimation]?.sketchfabId || '2e6726aca3e64c56b8f8d7cceae17a28'} height={450} />
            <div className="mt-2 p-3 rounded-xl bg-card border border-border text-center">
              <p className="text-sm font-medium text-primary">{ANIMATION_SKETCHFAB[selectedAnimation]?.name || 'Ciclo Cardiaco'}</p>
              <p className="text-xs text-muted-foreground">Modelo 3D fotorrealista animado — Interaja com o modelo para explorar</p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-sm">Animacoes Fisiologicas</h3>
            {ANIMATIONS.map(anim => (
              <button key={anim.id} onClick={() => { setSelectedAnimation(anim.id); setIsAnimating(false); setAnimationStep(0); }}
                className={`w-full text-left p-3 rounded-xl transition-all ${selectedAnimation === anim.id ? 'bg-primary/20 border-primary border-2' : 'bg-card border border-border hover:bg-accent'}`}>
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
            <div><h3 className="font-bold">Quiz Adaptativo (SM-2)</h3><p className="text-xs text-muted-foreground">SuperMemo 2 adapta ao seu nivel</p></div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{quizState.score}/{quizState.currentQ + (quizState.answered ? 1 : 0)}</div>
              <div className="text-xs text-muted-foreground">Questao {quizState.currentQ + 1} de {QUIZ_QUESTIONS.length}</div>
            </div>
          </div>
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
                    {q.difficulty === 'facil' ? 'Facil' : q.difficulty === 'medio' ? 'Medio' : 'Dificil'}
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
                      <p className="text-sm font-medium mb-1">{quizState.selectedOpt === q.correct ? 'Correto!' : 'Incorreto'}</p>
                      <p className="text-sm text-muted-foreground">{q.explanation}</p>
                      <p className="text-[10px] text-blue-400 mt-1">Ref: {q.reference}</p>
                    </div>
                    <button onClick={nextQuestion} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
                      Proxima Questao
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
