/**
 * MedFocus Atlas 3D Interativo Nativo v2.0
 * 
 * Sistema 3D interativo com modelos anatômicos realistas usando geometria procedural
 * avançada do Three.js (LatheGeometry, ExtrudeGeometry, ShapeGeometry, CubicBezierCurve3).
 * Cada órgão tem forma anatômica reconhecível, clicável com legendas e detalhes completos.
 * 
 * REFERÊNCIAS:
 * [1] Netter, F.H. Atlas de Anatomia Humana, 7ª ed. Elsevier, 2019.
 * [2] Gray, H. Gray's Anatomy, 42nd ed. Elsevier, 2020.
 * [3] Sobotta, J. Atlas de Anatomia Humana, 24ª ed. Elsevier, 2018.
 * [4] Moore, K.L. Anatomia Orientada para a Clínica, 8ª ed. Guanabara Koogan, 2019.
 * [5] Guyton, A.C. Tratado de Fisiologia Médica, 14ª ed. Elsevier, 2021.
 */

import React, { useState, useRef, useCallback, useMemo, Suspense } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Html, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================
// TYPES
// ============================================================
interface OrganInfo {
  id: string;
  name: string;
  latinName: string;
  system: string;
  description: string;
  functions: string[];
  location: string;
  dimensions: string;
  weight: string;
  bloodSupply: string;
  innervation: string;
  pathologies: string[];
  clinicalNotes: string[];
  histology: string;
  references: string[];
}

interface BodySystem {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// ============================================================
// SYSTEMS
// ============================================================
const SYSTEMS: BodySystem[] = [
  { id: 'all', name: 'Todos', icon: '🫀', color: '#ffffff' },
  { id: 'cardiovascular', name: 'Cardiovascular', icon: '❤️', color: '#e74c3c' },
  { id: 'digestorio', name: 'Digestório', icon: '🫁', color: '#e67e22' },
  { id: 'nervoso', name: 'Nervoso', icon: '🧠', color: '#f1c40f' },
  { id: 'respiratorio', name: 'Respiratório', icon: '🫁', color: '#3498db' },
  { id: 'esqueletico', name: 'Esquelético', icon: '🦴', color: '#ecf0f1' },
  { id: 'muscular', name: 'Muscular', icon: '💪', color: '#c0392b' },
  { id: 'urinario', name: 'Urinário', icon: '💧', color: '#1abc9c' },
  { id: 'endocrino', name: 'Endócrino', icon: '🦋', color: '#9b59b6' },
  { id: 'reprodutor', name: 'Reprodutor', icon: '🧬', color: '#e91e63' },
];

// ============================================================
// ORGAN DATA
// ============================================================
const ORGANS: OrganInfo[] = [
  {
    id: 'heart', name: 'Coração', latinName: 'Cor', system: 'cardiovascular',
    description: 'Órgão muscular oco que bombeia sangue para todo o corpo através do sistema circulatório. Possui 4 câmaras: 2 átrios e 2 ventrículos.',
    functions: ['Bombeamento de sangue oxigenado para o corpo (circulação sistêmica)', 'Bombeamento de sangue desoxigenado para os pulmões (circulação pulmonar)', 'Manutenção da pressão arterial', 'Regulação do débito cardíaco'],
    location: 'Mediastino médio, entre os pulmões, posterior ao esterno',
    dimensions: '12 cm comprimento × 8 cm largura × 6 cm espessura',
    weight: '250-350g (adulto)',
    bloodSupply: 'Artérias coronárias direita e esquerda (ramos da aorta ascendente)',
    innervation: 'Plexo cardíaco (simpático e parassimpático via nervo vago)',
    pathologies: ['Infarto agudo do miocárdio', 'Insuficiência cardíaca', 'Arritmias', 'Valvulopatias', 'Cardiomiopatias', 'Endocardite'],
    clinicalNotes: ['O ápice do coração projeta-se no 5º espaço intercostal esquerdo', 'A ausculta cardíaca identifica 4 focos: aórtico, pulmonar, tricúspide e mitral', 'O ECG é o exame inicial para avaliação de arritmias'],
    histology: 'Miocárdio composto por cardiomiócitos com discos intercalares, endocárdio (endotélio), epicárdio (mesotélio)',
    references: ['Netter [1] Prancha 212-218', 'Gray [2] Cap. 56', 'Guyton [5] Cap. 9-13'],
  },
  {
    id: 'brain', name: 'Cérebro', latinName: 'Cerebrum', system: 'nervoso',
    description: 'Centro de controle do sistema nervoso, responsável por funções cognitivas, sensoriais e motoras. Dividido em dois hemisférios com córtex cerebral altamente pregueado.',
    functions: ['Processamento de informações sensoriais', 'Controle motor voluntário', 'Funções cognitivas superiores (memória, linguagem, raciocínio)', 'Regulação emocional e comportamental'],
    location: 'Cavidade craniana, protegido pelas meninges e líquor cefalorraquidiano',
    dimensions: '15 cm comprimento × 13 cm largura × 10 cm altura',
    weight: '1.300-1.400g (adulto)',
    bloodSupply: 'Artérias carótidas internas e artérias vertebrais (Polígono de Willis)',
    innervation: 'Nervos cranianos (I-XII) emergem do tronco encefálico',
    pathologies: ['AVC isquêmico e hemorrágico', 'Tumores cerebrais', 'Epilepsia', 'Doença de Alzheimer', 'Doença de Parkinson', 'Meningite'],
    clinicalNotes: ['O cérebro consome 20% do oxigênio corporal', 'A barreira hematoencefálica protege contra substâncias tóxicas', 'Áreas de Broca e Wernicke são essenciais para a linguagem'],
    histology: 'Substância cinzenta (corpos neuronais) e branca (axônios mielinizados), células gliais (astrócitos, oligodendrócitos, micróglia)',
    references: ['Netter [1] Prancha 105-120', 'Gray [2] Cap. 25-28', 'Guyton [5] Cap. 46-58'],
  },
  {
    id: 'lungs', name: 'Pulmões', latinName: 'Pulmones', system: 'respiratorio',
    description: 'Órgãos esponjosos responsáveis pelas trocas gasosas. O pulmão direito possui 3 lobos e o esquerdo 2 lobos, com aproximadamente 300 milhões de alvéolos.',
    functions: ['Trocas gasosas (O₂ e CO₂) nos alvéolos', 'Regulação do pH sanguíneo', 'Filtração de pequenos coágulos', 'Produção de surfactante pulmonar'],
    location: 'Cavidade torácica, lateralmente ao mediastino',
    dimensions: 'Pulmão D: 3 lobos (superior, médio, inferior). Pulmão E: 2 lobos (superior, inferior)',
    weight: 'Direito: ~600g, Esquerdo: ~500g',
    bloodSupply: 'Artérias pulmonares (circulação funcional), artérias brônquicas (circulação nutritiva)',
    innervation: 'Plexo pulmonar (simpático e parassimpático via nervo vago)',
    pathologies: ['Pneumonia', 'DPOC', 'Asma', 'Embolia pulmonar', 'Câncer de pulmão', 'Pneumotórax', 'Fibrose pulmonar'],
    clinicalNotes: ['A ausculta pulmonar identifica murmúrios vesiculares e ruídos adventícios', 'O pulmão direito é mais acometido por aspiração devido ao brônquio principal ser mais vertical', 'Capacidade vital ~4.800mL em homens adultos'],
    histology: 'Epitélio respiratório pseudoestratificado ciliado, pneumócitos tipo I e II nos alvéolos',
    references: ['Netter [1] Prancha 192-200', 'Gray [2] Cap. 54', 'Guyton [5] Cap. 38-42'],
  },
  {
    id: 'liver', name: 'Fígado', latinName: 'Hepar', system: 'digestorio',
    description: 'Maior glândula do corpo humano, essencial para o metabolismo, detoxificação, produção de bile e síntese proteica. Possui 4 lobos anatômicos.',
    functions: ['Metabolismo de carboidratos, lipídios e proteínas', 'Produção de bile (600-1000mL/dia)', 'Detoxificação de substâncias', 'Síntese de fatores de coagulação', 'Armazenamento de glicogênio e vitaminas'],
    location: 'Hipocôndrio direito e epigástrio, abaixo do diafragma',
    dimensions: '25-28 cm largura × 15-17 cm profundidade × 6-8 cm espessura',
    weight: '1.400-1.600g (adulto)',
    bloodSupply: 'Artéria hepática própria (30%) e veia porta (70%) — sistema porta-hepático',
    innervation: 'Plexo hepático (simpático e parassimpático via nervo vago)',
    pathologies: ['Hepatite viral (A, B, C)', 'Cirrose hepática', 'Esteatose hepática', 'Carcinoma hepatocelular', 'Insuficiência hepática'],
    clinicalNotes: ['O fígado tem capacidade regenerativa notável', 'A palpação hepática avalia hepatomegalia', 'Enzimas hepáticas (TGO, TGP, GGT) são marcadores de lesão'],
    histology: 'Hepatócitos organizados em lóbulos hepáticos com sinusóides, células de Kupffer e espaços de Disse',
    references: ['Netter [1] Prancha 277-282', 'Gray [2] Cap. 65', 'Guyton [5] Cap. 70'],
  },
  {
    id: 'kidneys', name: 'Rins', latinName: 'Renes', system: 'urinario',
    description: 'Órgãos pares em forma de feijão responsáveis pela filtração do sangue, produção de urina e regulação do equilíbrio hidroeletrolítico.',
    functions: ['Filtração glomerular (~180L/dia)', 'Regulação do equilíbrio hidroeletrolítico', 'Regulação da pressão arterial (sistema renina-angiotensina)', 'Produção de eritropoietina', 'Ativação da vitamina D'],
    location: 'Retroperitoneal, entre T12-L3, o rim direito ligeiramente mais baixo',
    dimensions: '11 cm comprimento × 6 cm largura × 3 cm espessura',
    weight: '120-170g cada',
    bloodSupply: 'Artérias renais (ramos diretos da aorta abdominal) — recebem 25% do débito cardíaco',
    innervation: 'Plexo renal (simpático T10-L1)',
    pathologies: ['Insuficiência renal aguda e crônica', 'Glomerulonefrite', 'Nefrolitíase', 'Pielonefrite', 'Síndrome nefrótica', 'Doença renal policística'],
    clinicalNotes: ['O sinal de Giordano avalia dor lombar renal', 'Taxa de filtração glomerular (TFG) normal: 90-120 mL/min', 'Creatinina e ureia são marcadores de função renal'],
    histology: 'Néfrons (glomérulos + túbulos), córtex renal e medula renal com pirâmides renais',
    references: ['Netter [1] Prancha 315-322', 'Gray [2] Cap. 74', 'Guyton [5] Cap. 26-31'],
  },
  {
    id: 'stomach', name: 'Estômago', latinName: 'Gaster', system: 'digestorio',
    description: 'Órgão muscular oco em forma de J que armazena e digere alimentos através de ácido clorídrico e enzimas proteolíticas.',
    functions: ['Armazenamento temporário de alimentos', 'Digestão mecânica (contrações peristálticas)', 'Digestão química (HCl + pepsina)', 'Produção de fator intrínseco (absorção de B12)', 'Secreção de gastrina'],
    location: 'Epigástrio e hipocôndrio esquerdo, entre esôfago e duodeno',
    dimensions: '25-30 cm comprimento, capacidade de 1-1,5L',
    weight: '150g (vazio)',
    bloodSupply: 'Artérias gástricas esquerda e direita, artérias gastroepiplóicas',
    innervation: 'Nervo vago (parassimpático) e plexo celíaco (simpático)',
    pathologies: ['Gastrite', 'Úlcera péptica', 'Câncer gástrico', 'DRGE', 'H. pylori'],
    clinicalNotes: ['O pH gástrico normal é 1,5-3,5', 'A endoscopia digestiva alta é o exame padrão-ouro', 'H. pylori está associado a úlceras e câncer gástrico'],
    histology: 'Mucosa gástrica com glândulas (células parietais, principais, mucosas, G e enterocromafins)',
    references: ['Netter [1] Prancha 263-268', 'Gray [2] Cap. 62', 'Guyton [5] Cap. 64'],
  },
  {
    id: 'intestine', name: 'Intestino Delgado', latinName: 'Intestinum tenue', system: 'digestorio',
    description: 'Porção mais longa do trato gastrointestinal (~6m), dividida em duodeno, jejuno e íleo. Principal local de absorção de nutrientes.',
    functions: ['Digestão final de carboidratos, proteínas e lipídios', 'Absorção de nutrientes, água e eletrólitos', 'Secreção de enzimas digestivas', 'Imunidade intestinal (placas de Peyer)'],
    location: 'Cavidade abdominal, entre o estômago e o intestino grosso',
    dimensions: '5-7 metros de comprimento',
    weight: '~1kg',
    bloodSupply: 'Artéria mesentérica superior',
    innervation: 'Plexo mesentérico superior, nervos vagos',
    pathologies: ['Doença celíaca', 'Doença de Crohn', 'Obstrução intestinal', 'Síndrome do intestino curto'],
    clinicalNotes: ['As vilosidades intestinais aumentam a superfície absortiva em 600x', 'O duodeno recebe bile e suco pancreático'],
    histology: 'Vilosidades com enterócitos, células caliciformes, células de Paneth e células enteroendócrinas',
    references: ['Netter [1] Prancha 269-274', 'Gray [2] Cap. 63', 'Guyton [5] Cap. 65'],
  },
  {
    id: 'spine', name: 'Coluna Vertebral', latinName: 'Columna vertebralis', system: 'esqueletico',
    description: 'Estrutura óssea central do esqueleto axial composta por 33 vértebras que protege a medula espinhal e suporta o tronco.',
    functions: ['Suporte estrutural do tronco', 'Proteção da medula espinhal', 'Absorção de impactos (discos intervertebrais)', 'Ancoragem para músculos e ligamentos'],
    location: 'Eixo central posterior do tronco, da base do crânio ao cóccix',
    dimensions: '70-75 cm (adulto). 7 cervicais + 12 torácicas + 5 lombares + 5 sacrais + 4 coccígeas',
    weight: '~500g',
    bloodSupply: 'Artérias vertebrais, intercostais e lombares',
    innervation: '31 pares de nervos espinhais',
    pathologies: ['Hérnia de disco', 'Espondilose', 'Escoliose', 'Estenose espinhal', 'Fraturas vertebrais'],
    clinicalNotes: ['Curvaturas fisiológicas: lordose cervical e lombar, cifose torácica e sacral', 'A hérnia de disco L4-L5 é a mais comum'],
    histology: 'Osso esponjoso com medula óssea, periósteo, discos fibrocartilagíneos',
    references: ['Netter [1] Prancha 148-160', 'Gray [2] Cap. 42', 'Moore [4] Cap. 4'],
  },
  {
    id: 'eye', name: 'Olho', latinName: 'Oculus', system: 'nervoso',
    description: 'Órgão sensorial da visão composto por três túnicas (fibrosa, vascular e nervosa) que capta e processa estímulos luminosos.',
    functions: ['Captação de luz e formação de imagens na retina', 'Acomodação visual (cristalino)', 'Proteção (pálpebras, lágrimas)', 'Visão de cores (cones) e noturna (bastonetes)'],
    location: 'Órbita ocular, protegido por ossos faciais',
    dimensions: '24 mm diâmetro anteroposterior',
    weight: '7-8g',
    bloodSupply: 'Artéria oftálmica (ramo da carótida interna), artéria central da retina',
    innervation: 'Nervo óptico (II par craniano), nervos oculomotor (III), troclear (IV) e abducente (VI)',
    pathologies: ['Glaucoma', 'Catarata', 'Retinopatia diabética', 'Degeneração macular', 'Descolamento de retina'],
    clinicalNotes: ['A pressão intraocular normal é 10-21 mmHg', 'O fundo de olho avalia a retina e vasos', 'A pupila se contrai com luz (reflexo fotomotor)'],
    histology: 'Retina com 10 camadas, córnea avascular com 5 camadas, cristalino com fibras transparentes',
    references: ['Netter [1] Prancha 83-90', 'Gray [2] Cap. 38', 'Moore [4] Cap. 7'],
  },
  {
    id: 'pancreas', name: 'Pâncreas', latinName: 'Pancreas', system: 'endocrino',
    description: 'Glândula mista (exócrina e endócrina) que produz enzimas digestivas e hormônios reguladores da glicemia (insulina e glucagon).',
    functions: ['Secreção exócrina de enzimas digestivas (lipase, amilase, tripsina)', 'Secreção endócrina de insulina (células beta)', 'Secreção de glucagon (células alfa)', 'Regulação da glicemia'],
    location: 'Retroperitoneal, posterior ao estômago, entre duodeno e baço',
    dimensions: '15-20 cm comprimento (cabeça, corpo e cauda)',
    weight: '70-100g',
    bloodSupply: 'Artérias pancreaticoduodenais e artéria esplênica',
    innervation: 'Nervos vagos e plexo celíaco',
    pathologies: ['Diabetes mellitus tipo 1 e 2', 'Pancreatite aguda e crônica', 'Câncer de pâncreas', 'Insulinoma'],
    clinicalNotes: ['A amilase e lipase séricas são marcadores de pancreatite', 'O câncer de cabeça de pâncreas causa icterícia obstrutiva', 'A hemoglobina glicada (HbA1c) avalia controle glicêmico'],
    histology: 'Ácinos serosos (exócrino) e ilhotas de Langerhans (endócrino com células alfa, beta, delta)',
    references: ['Netter [1] Prancha 283-286', 'Gray [2] Cap. 66', 'Guyton [5] Cap. 78'],
  },
  {
    id: 'thyroid', name: 'Tireoide', latinName: 'Glandula thyroidea', system: 'endocrino',
    description: 'Glândula endócrina em forma de borboleta que produz hormônios tireoidianos (T3 e T4) essenciais para o metabolismo.',
    functions: ['Produção de T3 (triiodotironina) e T4 (tiroxina)', 'Regulação do metabolismo basal', 'Produção de calcitonina (metabolismo do cálcio)', 'Crescimento e desenvolvimento'],
    location: 'Região cervical anterior, abaixo da cartilagem tireoide',
    dimensions: 'Cada lobo: 4-6 cm altura × 1,5-2 cm largura',
    weight: '15-25g',
    bloodSupply: 'Artérias tireóideas superior e inferior',
    innervation: 'Nervos laríngeos recorrente e superior',
    pathologies: ['Hipotireoidismo', 'Hipertireoidismo (Doença de Graves)', 'Bócio', 'Nódulos tireoidianos', 'Câncer de tireoide', 'Tireoidite de Hashimoto'],
    clinicalNotes: ['TSH é o exame inicial para avaliação tireoidiana', 'O nervo laríngeo recorrente pode ser lesado em cirurgias', 'A palpação cervical identifica nódulos'],
    histology: 'Folículos tireoidianos revestidos por epitélio cuboide com coloide, células parafoliculares (C)',
    references: ['Netter [1] Prancha 74-76', 'Gray [2] Cap. 31', 'Guyton [5] Cap. 77'],
  },
  {
    id: 'bladder', name: 'Bexiga', latinName: 'Vesica urinaria', system: 'urinario',
    description: 'Órgão muscular oco que armazena urina até a micção. Possui parede muscular (músculo detrusor) e revestimento de epitélio de transição.',
    functions: ['Armazenamento de urina (300-500mL)', 'Contração para micção (músculo detrusor)', 'Continência urinária (esfíncteres)'],
    location: 'Pelve, posterior à sínfise púbica',
    dimensions: 'Capacidade: 300-500mL (máximo ~800mL)',
    weight: '~50g (vazia)',
    bloodSupply: 'Artérias vesicais superior e inferior',
    innervation: 'Plexo vesical (simpático T11-L2, parassimpático S2-S4)',
    pathologies: ['Infecção urinária (cistite)', 'Incontinência urinária', 'Câncer de bexiga', 'Bexiga neurogênica', 'Retenção urinária'],
    clinicalNotes: ['A cistoscopia é o exame padrão-ouro para lesões vesicais', 'O volume residual pós-miccional >100mL é anormal', 'Hematúria indolor em idosos sugere câncer de bexiga'],
    histology: 'Epitélio de transição (urotélio), lâmina própria, músculo detrusor (3 camadas de músculo liso)',
    references: ['Netter [1] Prancha 340-344', 'Gray [2] Cap. 75', 'Moore [4] Cap. 3'],
  },
];

// ============================================================
// GEOMETRY BUILDERS — Anatomically accurate shapes
// ============================================================

/** Create a heart shape using LatheGeometry with custom profile */
function createHeartGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  // Heart profile using bezier curves
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0, -0.3, -0.5, -0.6, -0.5, -0.3);
  shape.bezierCurveTo(-0.5, 0.1, 0, 0.3, 0, 0.6);
  shape.bezierCurveTo(0, 0.3, 0.5, 0.1, 0.5, -0.3);
  shape.bezierCurveTo(0.5, -0.6, 0, -0.3, 0, 0);
  
  const extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 8 };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  geo.scale(0.7, 0.7, 0.7);
  return geo;
}

/** Create brain shape — two hemispheres with sulci texture */
function createBrainGeometry(): THREE.BufferGeometry {
  const group = new THREE.Group();
  // Left hemisphere
  const leftGeo = new THREE.SphereGeometry(0.45, 32, 32);
  leftGeo.translate(-0.2, 0, 0);
  // Right hemisphere  
  const rightGeo = new THREE.SphereGeometry(0.45, 32, 32);
  rightGeo.translate(0.2, 0, 0);
  // Merge
  const merged = new THREE.BufferGeometry();
  const leftPos = leftGeo.attributes.position.array;
  const rightPos = rightGeo.attributes.position.array;
  const positions = new Float32Array(leftPos.length + rightPos.length);
  positions.set(leftPos, 0);
  positions.set(rightPos, leftPos.length);
  // Add wrinkle displacement
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i], y = positions[i+1], z = positions[i+2];
    const noise = Math.sin(x * 12) * Math.cos(y * 10) * Math.sin(z * 14) * 0.03;
    positions[i] += noise;
    positions[i+1] += noise * 0.5;
    positions[i+2] += noise;
  }
  merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  merged.computeVertexNormals();
  merged.scale(0.8, 0.65, 0.7);
  return merged;
}

/** Create lung shape using LatheGeometry with anatomical profile */
function createLungGeometry(side: 'left' | 'right'): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  // Lung profile — wider at base, narrower at apex
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = t * 1.2 - 0.6;
    let r: number;
    if (t < 0.1) r = t * 3; // base taper
    else if (t < 0.7) r = 0.3 + Math.sin(t * Math.PI) * 0.15; // body
    else r = (1 - t) * 1.0; // apex taper
    points.push(new THREE.Vector2(Math.max(r, 0.02), y));
  }
  const geo = new THREE.LatheGeometry(points, 24);
  geo.scale(side === 'right' ? 1.1 : 1.0, 1, 0.7);
  geo.center();
  return geo;
}

/** Create liver shape — large wedge-shaped organ */
function createLiverGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.6, 0.1, 0.8, 0.3, 0.7, 0.0);
  shape.bezierCurveTo(0.6, -0.2, 0.3, -0.3, 0, -0.2);
  shape.bezierCurveTo(-0.3, -0.1, -0.5, 0.1, -0.4, 0.2);
  shape.bezierCurveTo(-0.3, 0.15, -0.1, 0.05, 0, 0);
  const extrudeSettings = { depth: 0.3, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 6 };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  geo.scale(1.2, 1.0, 1.0);
  return geo;
}

/** Create kidney shape — bean shape using LatheGeometry */
function createKidneyGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  // Bean/kidney shape
  shape.moveTo(0, -0.35);
  shape.bezierCurveTo(0.25, -0.35, 0.35, -0.15, 0.3, 0);
  shape.bezierCurveTo(0.25, 0.15, 0.25, 0.3, 0, 0.35);
  shape.bezierCurveTo(-0.15, 0.35, -0.25, 0.2, -0.2, 0.05);
  shape.bezierCurveTo(-0.15, -0.05, -0.15, -0.15, -0.2, -0.05);
  shape.bezierCurveTo(-0.25, 0.05, -0.3, -0.1, -0.2, -0.25);
  shape.bezierCurveTo(-0.1, -0.35, 0, -0.35, 0, -0.35);
  const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 6 };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  geo.scale(0.8, 0.8, 0.8);
  return geo;
}

/** Create stomach shape — J-shaped organ */
function createStomachGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.4);
  shape.bezierCurveTo(0.3, 0.4, 0.5, 0.2, 0.4, -0.1);
  shape.bezierCurveTo(0.3, -0.4, 0.1, -0.5, -0.1, -0.3);
  shape.bezierCurveTo(-0.2, -0.2, -0.3, 0, -0.3, 0.2);
  shape.bezierCurveTo(-0.3, 0.35, -0.15, 0.4, 0, 0.4);
  const extrudeSettings = { depth: 0.25, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 5 };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  return geo;
}

/** Create intestine shape — coiled tube */
function createIntestineGeometry(): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.3, 0),
    new THREE.Vector3(0.3, 0.2, 0.1),
    new THREE.Vector3(0.2, 0, -0.1),
    new THREE.Vector3(-0.2, -0.1, 0.1),
    new THREE.Vector3(-0.3, -0.3, -0.1),
    new THREE.Vector3(0, -0.4, 0),
    new THREE.Vector3(0.2, -0.2, 0.1),
    new THREE.Vector3(0.1, 0, -0.1),
    new THREE.Vector3(-0.1, 0.1, 0.1),
  ]);
  const geo = new THREE.TubeGeometry(curve, 64, 0.06, 12, false);
  geo.center();
  geo.scale(1.2, 1.2, 1.2);
  return geo;
}

/** Create spine — stacked cylinders */
function createSpineGeometry(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 12; i++) {
    const vertebra = new THREE.CylinderGeometry(0.08, 0.09, 0.06, 8);
    vertebra.translate(0, i * 0.08 - 0.44, 0);
    geos.push(vertebra);
    if (i < 11) {
      const disc = new THREE.CylinderGeometry(0.07, 0.07, 0.02, 8);
      disc.translate(0, i * 0.08 + 0.04 - 0.44, 0);
      geos.push(disc);
    }
  }
  // Simple merge by using the first geometry and scaling
  const spineGeo = new THREE.CylinderGeometry(0.08, 0.1, 1.2, 12);
  // Add bumps for vertebrae
  const pos = spineGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const bump = Math.cos(y * 30) * 0.015;
    pos.setX(i, pos.getX(i) + bump);
    pos.setZ(i, pos.getZ(i) + bump);
  }
  spineGeo.computeVertexNormals();
  return spineGeo;
}

/** Create eye shape — sphere with iris detail */
function createEyeGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.25, 32, 32);
  // Slightly flatten front
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const z = pos.getZ(i);
    if (z > 0.15) {
      pos.setZ(i, z * 0.85 + 0.04);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

/** Create pancreas — elongated curved shape */
function createPancreasGeometry(): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.4, 0, 0),
    new THREE.Vector3(-0.15, 0.05, 0.02),
    new THREE.Vector3(0.1, 0.02, -0.02),
    new THREE.Vector3(0.35, -0.05, 0),
  ]);
  const geo = new THREE.TubeGeometry(curve, 32, 0.08, 12, false);
  // Thicken the head (left side)
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    if (x < -0.2) {
      const scale = 1.5 + ((-0.2 - x) / 0.2) * 0.5;
      pos.setY(i, pos.getY(i) * scale);
      pos.setZ(i, pos.getZ(i) * scale);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

/** Create thyroid — butterfly shape */
function createThyroidGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  // Right lobe
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.05, 0.15, 0.15, 0.25, 0.12, 0.1);
  shape.bezierCurveTo(0.1, 0, 0.15, -0.15, 0.12, -0.2);
  shape.bezierCurveTo(0.08, -0.25, 0.02, -0.1, 0, 0);
  // Left lobe
  shape.bezierCurveTo(-0.02, -0.1, -0.08, -0.25, -0.12, -0.2);
  shape.bezierCurveTo(-0.15, -0.15, -0.1, 0, -0.12, 0.1);
  shape.bezierCurveTo(-0.15, 0.25, -0.05, 0.15, 0, 0);
  const extrudeSettings = { depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 4 };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  geo.scale(2.5, 2.5, 2.5);
  return geo;
}

/** Create bladder — rounded pouch */
function createBladderGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const y = t * 0.6 - 0.3;
    let r: number;
    if (t < 0.15) r = t * 1.5; // neck
    else if (t < 0.8) r = 0.22 + Math.sin((t - 0.15) / 0.65 * Math.PI) * 0.1; // body
    else r = (1 - t) * 1.1; // dome
    points.push(new THREE.Vector2(Math.max(r, 0.01), y));
  }
  const geo = new THREE.LatheGeometry(points, 24);
  geo.center();
  return geo;
}

// Map organ IDs to geometry creators
function getOrganGeometry(organId: string): THREE.BufferGeometry {
  switch (organId) {
    case 'heart': return createHeartGeometry();
    case 'brain': return createBrainGeometry();
    case 'lungs': return createLungGeometry('right');
    case 'liver': return createLiverGeometry();
    case 'kidneys': return createKidneyGeometry();
    case 'stomach': return createStomachGeometry();
    case 'intestine': return createIntestineGeometry();
    case 'spine': return createSpineGeometry();
    case 'eye': return createEyeGeometry();
    case 'pancreas': return createPancreasGeometry();
    case 'thyroid': return createThyroidGeometry();
    case 'bladder': return createBladderGeometry();
    default: return new THREE.SphereGeometry(0.3, 32, 32);
  }
}

// Organ colors — anatomically appropriate
const ORGAN_COLORS: Record<string, { main: string; highlight: string }> = {
  heart: { main: '#8B0000', highlight: '#DC143C' },
  brain: { main: '#E8B4B8', highlight: '#FFB6C1' },
  lungs: { main: '#FFB6C1', highlight: '#FF69B4' },
  liver: { main: '#8B4513', highlight: '#CD853F' },
  kidneys: { main: '#A0522D', highlight: '#D2691E' },
  stomach: { main: '#DEB887', highlight: '#F5DEB3' },
  intestine: { main: '#D2B48C', highlight: '#F5DEB3' },
  spine: { main: '#FFFFF0', highlight: '#FFFFFF' },
  eye: { main: '#F5F5F5', highlight: '#FFFFFF' },
  pancreas: { main: '#FFE4B5', highlight: '#FFDEAD' },
  thyroid: { main: '#CD5C5C', highlight: '#F08080' },
  bladder: { main: '#DDA0DD', highlight: '#EE82EE' },
};

// Organ positions in the body
const ORGAN_POSITIONS: Record<string, [number, number, number]> = {
  heart: [-0.08, 0.85, 0.15],
  brain: [0, 2.1, 0],
  lungs: [0.25, 0.9, 0],
  liver: [0.2, 0.45, 0.1],
  kidneys: [-0.25, 0.35, -0.1],
  stomach: [-0.1, 0.55, 0.15],
  intestine: [0, 0.05, 0.1],
  spine: [0, 0.6, -0.2],
  eye: [0.12, 2.0, 0.25],
  pancreas: [0, 0.4, 0],
  thyroid: [0, 1.7, 0.15],
  bladder: [0, -0.25, 0.1],
};

const ORGAN_SCALES: Record<string, [number, number, number]> = {
  heart: [0.35, 0.35, 0.35],
  brain: [0.5, 0.5, 0.5],
  lungs: [0.35, 0.4, 0.3],
  liver: [0.45, 0.35, 0.35],
  kidneys: [0.3, 0.3, 0.3],
  stomach: [0.35, 0.35, 0.3],
  intestine: [0.5, 0.4, 0.4],
  spine: [0.3, 0.5, 0.3],
  eye: [0.2, 0.2, 0.2],
  pancreas: [0.4, 0.3, 0.3],
  thyroid: [0.15, 0.15, 0.15],
  bladder: [0.25, 0.25, 0.25],
};

// ============================================================
// 3D ORGAN COMPONENT
// ============================================================
function OrganMesh({ organ, isSelected, isHovered, onSelect, onHover, onUnhover, systemFilter }: {
  organ: OrganInfo;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: () => void;
  onUnhover: () => void;
  systemFilter: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const visible = systemFilter === 'all' || organ.system === systemFilter;

  const geometry = useMemo(() => getOrganGeometry(organ.id), [organ.id]);
  const colors = ORGAN_COLORS[organ.id] || { main: '#888', highlight: '#aaa' };
  const position = ORGAN_POSITIONS[organ.id] || [0, 0, 0];
  const scale = ORGAN_SCALES[organ.id] || [0.3, 0.3, 0.3];

  useFrame((state) => {
    if (!meshRef.current || !visible) return;
    if (isSelected) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    // Breathing animation
    const breathe = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
    meshRef.current.scale.set(
      scale[0] * (1 + breathe),
      scale[1] * (1 + breathe),
      scale[2] * (1 + breathe)
    );
  });

  if (!visible) return null;

  return (
    <group position={position as any}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        scale={scale as any}
        onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onSelect(); }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onHover(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { onUnhover(); document.body.style.cursor = 'default'; }}
      >
        <meshPhysicalMaterial
          color={isHovered || isSelected ? colors.highlight : colors.main}
          roughness={0.4}
          metalness={0.1}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          transparent
          opacity={isSelected ? 1 : isHovered ? 0.95 : 0.85}
          emissive={isSelected ? colors.highlight : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>
      {/* Label */}
      {(isHovered || isSelected) && (
        <Html center distanceFactor={3} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            border: `1px solid ${colors.highlight}`,
          }}>
            {organ.name}
            <div style={{ fontSize: '10px', opacity: 0.7, fontStyle: 'italic' }}>{organ.latinName}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// ============================================================
// BODY OUTLINE — transparent anatomical silhouette
// ============================================================
function BodyOutline() {
  return (
    <group>
      {/* Head */}
      <mesh position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.08} roughness={0.9} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.15, 16]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.06} roughness={0.9} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.35, 0.3, 1.3, 16]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.06} roughness={0.9} />
      </mesh>
      {/* Pelvis */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.3, 0.25, 0.35, 16]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.05} roughness={0.9} />
      </mesh>
      {/* Arms */}
      {[-1, 1].map(side => (
        <mesh key={`arm-${side}`} position={[side * 0.5, 1.1, 0]} rotation={[0, 0, side * 0.15]}>
          <cylinderGeometry args={[0.06, 0.05, 0.9, 8]} />
          <meshStandardMaterial color="#1a1a2e" transparent opacity={0.04} roughness={0.9} />
        </mesh>
      ))}
      {/* Legs */}
      {[-1, 1].map(side => (
        <mesh key={`leg-${side}`} position={[side * 0.15, -0.5, 0]}>
          <cylinderGeometry args={[0.09, 0.07, 1.0, 8]} />
          <meshStandardMaterial color="#1a1a2e" transparent opacity={0.04} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================
// MAIN SCENE
// ============================================================
function AnatomyScene({ selectedOrgan, setSelectedOrgan, hoveredOrgan, setHoveredOrgan, systemFilter }: {
  selectedOrgan: string | null;
  setSelectedOrgan: (id: string | null) => void;
  hoveredOrgan: string | null;
  setHoveredOrgan: (id: string | null) => void;
  systemFilter: string;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 4, -3]} intensity={0.3} />
      <pointLight position={[0, 3, 3]} intensity={0.5} color="#ffffff" />
      <BodyOutline />
      {ORGANS.map(organ => (
        <OrganMesh
          key={organ.id}
          organ={organ}
          isSelected={selectedOrgan === organ.id}
          isHovered={hoveredOrgan === organ.id}
          onSelect={() => setSelectedOrgan(selectedOrgan === organ.id ? null : organ.id)}
          onHover={() => setHoveredOrgan(organ.id)}
          onUnhover={() => setHoveredOrgan(null)}
          systemFilter={systemFilter}
        />
      ))}
      <ContactShadows position={[0, -1.1, 0]} opacity={0.3} scale={4} blur={2} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1.5}
        maxDistance={8}
        target={[0, 0.8, 0]}
      />
      <Environment preset="studio" />
    </>
  );
}

// ============================================================
// DETAIL PANEL
// ============================================================
function DetailPanel({ organ, onClose }: { organ: OrganInfo; onClose: () => void }) {
  const [tab, setTab] = useState<'info' | 'clinical' | 'histology'>('info');
  const colors = ORGAN_COLORS[organ.id] || { main: '#888', highlight: '#aaa' };

  return (
    <div style={{
      position: 'absolute', top: 0, right: 0, width: '380px', height: '100%',
      background: 'linear-gradient(180deg, rgba(15,20,30,0.97) 0%, rgba(10,15,25,0.98) 100%)',
      borderLeft: `2px solid ${colors.highlight}40`,
      overflowY: 'auto', padding: '20px', zIndex: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ color: colors.highlight, margin: 0, fontSize: '22px' }}>{organ.name}</h2>
          <p style={{ color: '#888', margin: '2px 0 0', fontSize: '13px', fontStyle: 'italic' }}>{organ.latinName}</p>
        </div>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: '18px',
          width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
        }}>✕</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        {[
          { key: 'info' as const, label: 'Anatomia' },
          { key: 'clinical' as const, label: 'Clínica' },
          { key: 'histology' as const, label: 'Histologia' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer',
            background: tab === t.key ? colors.highlight + '30' : 'rgba(255,255,255,0.05)',
            color: tab === t.key ? colors.highlight : '#aaa', fontSize: '12px', fontWeight: 600,
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'info' && (
        <div style={{ color: '#ccc', fontSize: '13px', lineHeight: 1.6 }}>
          <p style={{ marginBottom: '12px' }}>{organ.description}</p>
          <Section title="Funções" items={organ.functions} color={colors.highlight} />
          <Field label="Localização" value={organ.location} />
          <Field label="Dimensões" value={organ.dimensions} />
          <Field label="Peso" value={organ.weight} />
          <Field label="Irrigação" value={organ.bloodSupply} />
          <Field label="Inervação" value={organ.innervation} />
        </div>
      )}

      {tab === 'clinical' && (
        <div style={{ color: '#ccc', fontSize: '13px', lineHeight: 1.6 }}>
          <Section title="Patologias" items={organ.pathologies} color="#e74c3c" />
          <Section title="Notas Clínicas" items={organ.clinicalNotes} color="#3498db" />
        </div>
      )}

      {tab === 'histology' && (
        <div style={{ color: '#ccc', fontSize: '13px', lineHeight: 1.6 }}>
          <h4 style={{ color: colors.highlight, marginBottom: '8px' }}>Histologia</h4>
          <p>{organ.histology}</p>
          <h4 style={{ color: '#888', marginTop: '16px', marginBottom: '8px' }}>Referências</h4>
          {organ.references.map((ref, i) => (
            <p key={i} style={{ fontSize: '11px', color: '#666', margin: '2px 0' }}>{ref}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function Section({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <h4 style={{ color, marginBottom: '6px', fontSize: '14px' }}>{title}</h4>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '3px', fontSize: '12px' }}>
          <span style={{ color, flexShrink: 0 }}>•</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <span style={{ color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      <p style={{ margin: '2px 0 0', fontSize: '12px' }}>{value}</p>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Interactive3DAtlas() {
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  const [hoveredOrgan, setHoveredOrgan] = useState<string | null>(null);
  const [systemFilter, setSystemFilter] = useState('all');

  const selectedOrganData = useMemo(() => ORGANS.find(o => o.id === selectedOrgan), [selectedOrgan]);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '700px', position: 'relative', background: '#0a0f1a' }}>
      {/* System filter buttons */}
      <div style={{
        position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexWrap: 'wrap', gap: '6px', zIndex: 5, justifyContent: 'center', maxWidth: '90%',
      }}>
        {SYSTEMS.map(sys => (
          <button key={sys.id} onClick={() => setSystemFilter(sys.id)} style={{
            padding: '6px 14px', border: `1px solid ${sys.color}40`, borderRadius: '20px',
            background: systemFilter === sys.id ? sys.color + '25' : 'rgba(0,0,0,0.5)',
            color: systemFilter === sys.id ? sys.color : '#888',
            cursor: 'pointer', fontSize: '12px', fontWeight: 600, backdropFilter: 'blur(8px)',
            transition: 'all 0.2s',
          }}>
            {sys.icon} {sys.name}
          </button>
        ))}
      </div>

      {/* Organ list sidebar */}
      <div style={{
        position: 'absolute', top: '60px', left: '12px', width: '180px', zIndex: 5,
        background: 'rgba(0,0,0,0.6)', borderRadius: '12px', padding: '10px',
        backdropFilter: 'blur(8px)', maxHeight: 'calc(100% - 80px)', overflowY: 'auto',
      }}>
        <p style={{ color: '#888', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>
          Estruturas ({ORGANS.filter(o => systemFilter === 'all' || o.system === systemFilter).length})
        </p>
        {ORGANS.filter(o => systemFilter === 'all' || o.system === systemFilter).map(organ => {
          const colors = ORGAN_COLORS[organ.id] || { main: '#888', highlight: '#aaa' };
          const isActive = selectedOrgan === organ.id;
          return (
            <button key={organ.id} onClick={() => setSelectedOrgan(isActive ? null : organ.id)}
              onMouseEnter={() => setHoveredOrgan(organ.id)}
              onMouseLeave={() => setHoveredOrgan(null)}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '6px 10px',
                border: isActive ? `1px solid ${colors.highlight}` : '1px solid transparent',
                borderRadius: '8px', cursor: 'pointer', marginBottom: '3px',
                background: isActive ? colors.highlight + '20' : hoveredOrgan === organ.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                color: isActive ? colors.highlight : '#ccc', fontSize: '12px', fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.main, flexShrink: 0 }} />
                {organ.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3D Canvas */}
      <div style={{ width: '100%', height: '100%', minHeight: '700px' }}>
        <Canvas camera={{ position: [0, 1.5, 3.5], fov: 45 }} shadows>
          <Suspense fallback={null}>
            <AnatomyScene
              selectedOrgan={selectedOrgan}
              setSelectedOrgan={setSelectedOrgan}
              hoveredOrgan={hoveredOrgan}
              setHoveredOrgan={setHoveredOrgan}
              systemFilter={systemFilter}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Detail panel */}
      {selectedOrganData && (
        <DetailPanel organ={selectedOrganData} onClose={() => setSelectedOrgan(null)} />
      )}

      {/* Instructions */}
      {!selectedOrgan && (
        <div style={{
          position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.6)', padding: '8px 20px', borderRadius: '20px',
          color: '#888', fontSize: '12px', backdropFilter: 'blur(8px)', whiteSpace: 'nowrap',
        }}>
          🖱️ Clique em um órgão para ver detalhes • Arraste para rotacionar • Scroll para zoom
        </div>
      )}
    </div>
  );
}
