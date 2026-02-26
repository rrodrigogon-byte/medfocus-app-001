/**
 * MedFocus Atlas 3D Interativo v3.0
 * 
 * Renderiza órgãos 3D usando grupos de meshes primitivos do Three.js.
 * Cada órgão é composto por múltiplas primitivas (esferas, cilindros, etc.)
 * posicionadas para formar a silhueta anatômica reconhecível.
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
    description: 'Centro de controle do sistema nervoso, responsável por funções cognitivas, sensoriais e motoras.',
    functions: ['Processamento de informações sensoriais', 'Controle motor voluntário', 'Funções cognitivas superiores', 'Regulação emocional e comportamental'],
    location: 'Cavidade craniana, protegido pelas meninges e líquor cefalorraquidiano',
    dimensions: '15 cm comprimento × 13 cm largura × 10 cm altura',
    weight: '1.300-1.400g (adulto)',
    bloodSupply: 'Artérias carótidas internas e artérias vertebrais (Polígono de Willis)',
    innervation: 'Nervos cranianos (I-XII) emergem do tronco encefálico',
    pathologies: ['AVC isquêmico e hemorrágico', 'Tumores cerebrais', 'Epilepsia', 'Doença de Alzheimer', 'Doença de Parkinson'],
    clinicalNotes: ['O cérebro consome 20% do oxigênio corporal', 'A barreira hematoencefálica protege contra substâncias tóxicas'],
    histology: 'Substância cinzenta (corpos neuronais) e branca (axônios mielinizados), células gliais',
    references: ['Netter [1] Prancha 105-120', 'Gray [2] Cap. 25-28', 'Guyton [5] Cap. 46-58'],
  },
  {
    id: 'lungs', name: 'Pulmões', latinName: 'Pulmones', system: 'respiratorio',
    description: 'Órgãos esponjosos responsáveis pelas trocas gasosas. O pulmão direito possui 3 lobos e o esquerdo 2 lobos.',
    functions: ['Trocas gasosas (O₂ e CO₂) nos alvéolos', 'Regulação do pH sanguíneo', 'Filtração de pequenos coágulos', 'Produção de surfactante pulmonar'],
    location: 'Cavidade torácica, lateralmente ao mediastino',
    dimensions: 'Pulmão D: 3 lobos. Pulmão E: 2 lobos',
    weight: 'Direito: ~600g, Esquerdo: ~500g',
    bloodSupply: 'Artérias pulmonares (circulação funcional), artérias brônquicas (circulação nutritiva)',
    innervation: 'Plexo pulmonar (simpático e parassimpático via nervo vago)',
    pathologies: ['Pneumonia', 'DPOC', 'Asma', 'Embolia pulmonar', 'Câncer de pulmão', 'Pneumotórax'],
    clinicalNotes: ['A ausculta pulmonar identifica murmúrios vesiculares e ruídos adventícios', 'O pulmão direito é mais acometido por aspiração'],
    histology: 'Epitélio respiratório pseudoestratificado ciliado, pneumócitos tipo I e II nos alvéolos',
    references: ['Netter [1] Prancha 192-200', 'Gray [2] Cap. 54', 'Guyton [5] Cap. 38-42'],
  },
  {
    id: 'liver', name: 'Fígado', latinName: 'Hepar', system: 'digestorio',
    description: 'Maior glândula do corpo humano, essencial para o metabolismo, detoxificação, produção de bile e síntese proteica.',
    functions: ['Metabolismo de carboidratos, lipídios e proteínas', 'Produção de bile (600-1000mL/dia)', 'Detoxificação de substâncias', 'Síntese de fatores de coagulação'],
    location: 'Hipocôndrio direito e epigástrio, abaixo do diafragma',
    dimensions: '25-28 cm largura × 15-17 cm profundidade × 6-8 cm espessura',
    weight: '1.400-1.600g (adulto)',
    bloodSupply: 'Artéria hepática própria (30%) e veia porta (70%)',
    innervation: 'Plexo hepático (simpático e parassimpático via nervo vago)',
    pathologies: ['Hepatite viral (A, B, C)', 'Cirrose hepática', 'Esteatose hepática', 'Carcinoma hepatocelular'],
    clinicalNotes: ['O fígado tem capacidade regenerativa notável', 'Enzimas hepáticas (TGO, TGP, GGT) são marcadores de lesão'],
    histology: 'Hepatócitos organizados em lóbulos hepáticos com sinusóides, células de Kupffer',
    references: ['Netter [1] Prancha 277-282', 'Gray [2] Cap. 65', 'Guyton [5] Cap. 70'],
  },
  {
    id: 'kidneys', name: 'Rins', latinName: 'Renes', system: 'urinario',
    description: 'Órgãos pares em forma de feijão responsáveis pela filtração do sangue e produção de urina.',
    functions: ['Filtração glomerular (~180L/dia)', 'Regulação do equilíbrio hidroeletrolítico', 'Regulação da pressão arterial', 'Produção de eritropoietina'],
    location: 'Retroperitoneal, entre T12-L3',
    dimensions: '11 cm comprimento × 6 cm largura × 3 cm espessura',
    weight: '120-170g cada',
    bloodSupply: 'Artérias renais (ramos diretos da aorta abdominal)',
    innervation: 'Plexo renal (simpático T10-L1)',
    pathologies: ['Insuficiência renal aguda e crônica', 'Glomerulonefrite', 'Nefrolitíase', 'Pielonefrite'],
    clinicalNotes: ['O sinal de Giordano avalia dor lombar renal', 'TFG normal: 90-120 mL/min'],
    histology: 'Néfrons (glomérulos + túbulos), córtex renal e medula renal',
    references: ['Netter [1] Prancha 315-322', 'Gray [2] Cap. 74', 'Guyton [5] Cap. 26-31'],
  },
  {
    id: 'stomach', name: 'Estômago', latinName: 'Gaster', system: 'digestorio',
    description: 'Órgão muscular oco em forma de J que armazena e digere alimentos.',
    functions: ['Armazenamento temporário de alimentos', 'Digestão mecânica e química', 'Produção de fator intrínseco', 'Secreção de gastrina'],
    location: 'Epigástrio e hipocôndrio esquerdo',
    dimensions: '25-30 cm comprimento, capacidade de 1-1,5L',
    weight: '150g (vazio)',
    bloodSupply: 'Artérias gástricas esquerda e direita, artérias gastroepiplóicas',
    innervation: 'Nervo vago (parassimpático) e plexo celíaco (simpático)',
    pathologies: ['Gastrite', 'Úlcera péptica', 'Câncer gástrico', 'DRGE', 'H. pylori'],
    clinicalNotes: ['O pH gástrico normal é 1,5-3,5', 'A endoscopia digestiva alta é o exame padrão-ouro'],
    histology: 'Mucosa gástrica com glândulas (células parietais, principais, mucosas)',
    references: ['Netter [1] Prancha 263-268', 'Gray [2] Cap. 62', 'Guyton [5] Cap. 64'],
  },
  {
    id: 'intestine', name: 'Intestino', latinName: 'Intestinum', system: 'digestorio',
    description: 'Porção mais longa do trato gastrointestinal (~6m). Principal local de absorção de nutrientes.',
    functions: ['Digestão final de nutrientes', 'Absorção de nutrientes e água', 'Secreção de enzimas digestivas', 'Imunidade intestinal (placas de Peyer)'],
    location: 'Cavidade abdominal, entre estômago e cólon',
    dimensions: '~6m de comprimento total',
    weight: '~2kg',
    bloodSupply: 'Artéria mesentérica superior',
    innervation: 'Plexo mesentérico e nervo vago',
    pathologies: ['Doença de Crohn', 'Retocolite ulcerativa', 'Síndrome do intestino irritável', 'Obstrução intestinal'],
    clinicalNotes: ['O intestino delgado tem vilosidades que aumentam a área de absorção', 'O íleo terminal absorve vitamina B12'],
    histology: 'Vilosidades intestinais, criptas de Lieberkühn, células caliciformes',
    references: ['Netter [1] Prancha 269-276', 'Gray [2] Cap. 63'],
  },
  {
    id: 'spine', name: 'Coluna Vertebral', latinName: 'Columna vertebralis', system: 'esqueletico',
    description: 'Estrutura óssea composta por 33 vértebras que protege a medula espinhal.',
    functions: ['Proteção da medula espinhal', 'Suporte estrutural do corpo', 'Movimentação do tronco', 'Absorção de impactos'],
    location: 'Região posterior do tronco, do crânio ao cóccix',
    dimensions: '~70 cm de comprimento',
    weight: '~1kg',
    bloodSupply: 'Artérias vertebrais e segmentares',
    innervation: 'Nervos espinhais (31 pares)',
    pathologies: ['Hérnia de disco', 'Espondilose', 'Escoliose', 'Estenose espinhal'],
    clinicalNotes: ['7 cervicais, 12 torácicas, 5 lombares, 5 sacrais, 4 coccígeas', 'A medula espinhal termina em L1-L2 (cone medular)'],
    histology: 'Osso compacto e esponjoso, discos intervertebrais (anel fibroso + núcleo pulposo)',
    references: ['Netter [1] Prancha 148-160', 'Gray [2] Cap. 42'],
  },
  {
    id: 'eye', name: 'Olho', latinName: 'Oculus', system: 'nervoso',
    description: 'Órgão sensorial da visão, composto por câmaras anterior e posterior, cristalino e retina.',
    functions: ['Captação de luz', 'Formação de imagens na retina', 'Acomodação visual', 'Percepção de cores e profundidade'],
    location: 'Órbita craniana',
    dimensions: '~24 mm de diâmetro',
    weight: '~7g',
    bloodSupply: 'Artéria oftálmica (ramo da carótida interna)',
    innervation: 'Nervo óptico (II par craniano)',
    pathologies: ['Glaucoma', 'Catarata', 'Degeneração macular', 'Retinopatia diabética'],
    clinicalNotes: ['A pressão intraocular normal é 10-21 mmHg', 'O fundo de olho avalia a retina e vasos'],
    histology: 'Retina com fotorreceptores (cones e bastonetes), córnea, cristalino',
    references: ['Netter [1] Prancha 83-90', 'Gray [2] Cap. 40'],
  },
  {
    id: 'pancreas', name: 'Pâncreas', latinName: 'Pancreas', system: 'endocrino',
    description: 'Glândula mista (exócrina e endócrina) que produz enzimas digestivas e hormônios.',
    functions: ['Produção de insulina e glucagon (ilhotas de Langerhans)', 'Secreção de enzimas digestivas', 'Regulação da glicemia', 'Produção de bicarbonato'],
    location: 'Retroperitoneal, posterior ao estômago',
    dimensions: '15-20 cm comprimento',
    weight: '70-100g',
    bloodSupply: 'Artérias pancreaticoduodenais e esplênica',
    innervation: 'Plexo celíaco e nervo vago',
    pathologies: ['Diabetes mellitus tipo 1 e 2', 'Pancreatite aguda e crônica', 'Câncer de pâncreas'],
    clinicalNotes: ['A insulina é produzida pelas células beta', 'O glucagon é produzido pelas células alfa'],
    histology: 'Ácinos pancreáticos (exócrino), ilhotas de Langerhans (endócrino)',
    references: ['Netter [1] Prancha 283-286', 'Gray [2] Cap. 66', 'Guyton [5] Cap. 78'],
  },
  {
    id: 'thyroid', name: 'Tireoide', latinName: 'Glandula thyroidea', system: 'endocrino',
    description: 'Glândula endócrina em forma de borboleta que regula o metabolismo.',
    functions: ['Produção de T3 e T4', 'Regulação do metabolismo basal', 'Crescimento e desenvolvimento', 'Produção de calcitonina'],
    location: 'Região anterior do pescoço, abaixo da cartilagem tireoide',
    dimensions: '5 cm altura × 5 cm largura',
    weight: '15-25g',
    bloodSupply: 'Artérias tireoideas superior e inferior',
    innervation: 'Nervos laríngeos recorrentes e superiores',
    pathologies: ['Hipotireoidismo', 'Hipertireoidismo (Graves)', 'Bócio', 'Câncer de tireoide', 'Tireoidite de Hashimoto'],
    clinicalNotes: ['TSH é o principal exame de triagem', 'O iodo é essencial para a síntese hormonal'],
    histology: 'Folículos tireoidianos preenchidos por coloide, células parafoliculares (C)',
    references: ['Netter [1] Prancha 73-76', 'Gray [2] Cap. 33', 'Guyton [5] Cap. 77'],
  },
  {
    id: 'bladder', name: 'Bexiga', latinName: 'Vesica urinaria', system: 'urinario',
    description: 'Órgão muscular oco que armazena urina até a micção.',
    functions: ['Armazenamento de urina (300-500mL)', 'Contração para micção (músculo detrusor)', 'Controle esfincteriano'],
    location: 'Pelve, posterior à sínfise púbica',
    dimensions: 'Capacidade de 300-500mL',
    weight: '~50g (vazia)',
    bloodSupply: 'Artérias vesicais superior e inferior',
    innervation: 'Plexo vesical (parassimpático S2-S4, simpático T11-L2)',
    pathologies: ['Infecção urinária (cistite)', 'Incontinência urinária', 'Câncer de bexiga', 'Bexiga neurogênica'],
    clinicalNotes: ['A micção é controlada pelo reflexo miccional', 'O trígono vesical contém os óstios ureterais e a uretra'],
    histology: 'Epitélio de transição (urotélio), músculo detrusor (liso)',
    references: ['Netter [1] Prancha 340-345', 'Gray [2] Cap. 75'],
  },
];

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

// Organ positions in the body (x, y, z)
const ORGAN_POSITIONS: Record<string, [number, number, number]> = {
  brain: [0, 2.1, 0],
  eye: [0.12, 2.0, 0.25],
  thyroid: [0, 1.7, 0.15],
  heart: [-0.08, 0.85, 0.15],
  lungs: [0.25, 0.9, 0],
  liver: [0.2, 0.45, 0.1],
  stomach: [-0.15, 0.55, 0.15],
  pancreas: [0, 0.35, 0.05],
  kidneys: [-0.25, 0.3, -0.1],
  intestine: [0, 0.05, 0.1],
  bladder: [0, -0.25, 0.1],
  spine: [0, 0.6, -0.2],
};

// ============================================================
// ORGAN 3D COMPONENTS — Each organ is a group of primitives
// ============================================================

/** Heart — composed of two lobes and aorta */
function HeartModel({ color, emissive, emissiveIntensity, opacity }: { color: string; emissive: string; emissiveIntensity: number; opacity: number }) {
  const matProps = { color, roughness: 0.4, metalness: 0.1, clearcoat: 0.3, transparent: true, opacity, emissive, emissiveIntensity };
  return (
    <group scale={[0.28, 0.28, 0.28]}>
      {/* Left ventricle */}
      <mesh position={[-0.15, -0.1, 0]} rotation={[0, 0, 0.2]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Right ventricle */}
      <mesh position={[0.15, -0.1, 0]} rotation={[0, 0, -0.2]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Atria (top) */}
      <mesh position={[-0.12, 0.25, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      <mesh position={[0.12, 0.25, 0]}>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Aorta */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.3, 16]} />
        <meshPhysicalMaterial {...matProps} color="#660000" />
      </mesh>
      {/* Aortic arch */}
      <mesh position={[0.12, 0.55, 0]} rotation={[0, 0, -0.8]}>
        <cylinderGeometry args={[0.06, 0.08, 0.25, 12]} />
        <meshPhysicalMaterial {...matProps} color="#660000" />
      </mesh>
      {/* Apex (bottom point) */}
      <mesh position={[0, -0.45, 0]}>
        <coneGeometry args={[0.25, 0.3, 16]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
    </group>
  );
}

/** Brain — two hemispheres with cerebellum */
function BrainModel({ color, emissive, emissiveIntensity, opacity }: { color: string; emissive: string; emissiveIntensity: number; opacity: number }) {
  const matProps = { color, roughness: 0.6, metalness: 0.05, transparent: true, opacity, emissive, emissiveIntensity };
  return (
    <group scale={[0.35, 0.35, 0.35]}>
      {/* Left hemisphere */}
      <mesh position={[-0.22, 0.05, 0]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Right hemisphere */}
      <mesh position={[0.22, 0.05, 0]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Frontal lobe bump */}
      <mesh position={[0, 0.1, 0.25]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Cerebellum */}
      <mesh position={[0, -0.2, -0.2]}>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshPhysicalMaterial {...matProps} color="#D4A0A4" />
      </mesh>
      {/* Brain stem */}
      <mesh position={[0, -0.4, -0.1]}>
        <cylinderGeometry args={[0.08, 0.06, 0.25, 12]} />
        <meshPhysicalMaterial {...matProps} color="#C89898" />
      </mesh>
    </group>
  );
}

/** Lungs — two lobed structures */
function LungsModel({ color, emissive, emissiveIntensity, opacity }: { color: string; emissive: string; emissiveIntensity: number; opacity: number }) {
  const matProps = { color, roughness: 0.5, metalness: 0.05, transparent: true, opacity, emissive, emissiveIntensity };
  return (
    <group scale={[0.3, 0.3, 0.3]}>
      {/* Right lung - 3 lobes */}
      <mesh position={[0.35, 0.1, 0]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      <mesh position={[0.4, -0.2, 0]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      <mesh position={[0.35, 0.35, 0]}>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Left lung - 2 lobes */}
      <mesh position={[-0.35, 0.05, 0]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      <mesh position={[-0.35, -0.2, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Trachea */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.4, 12]} />
        <meshPhysicalMaterial {...matProps} color="#CC8888" />
      </mesh>
      {/* Bronchi */}
      <mesh position={[0.15, 0.35, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.03, 0.04, 0.25, 8]} />
        <meshPhysicalMaterial {...matProps} color="#CC8888" />
      </mesh>
      <mesh position={[-0.15, 0.35, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.03, 0.04, 0.25, 8]} />
        <meshPhysicalMaterial {...matProps} color="#CC8888" />
      </mesh>
    </group>
  );
}

/** Liver — large wedge shape */
function LiverModel({ color, emissive, emissiveIntensity, opacity }: { color: string; emissive: string; emissiveIntensity: number; opacity: number }) {
  const matProps = { color, roughness: 0.4, metalness: 0.1, transparent: true, opacity, emissive, emissiveIntensity };
  return (
    <group scale={[0.35, 0.25, 0.25]}>
      {/* Main body - right lobe (larger) */}
      <mesh position={[0.15, 0, 0]} scale={[1.3, 0.7, 0.9]}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Left lobe (smaller) */}
      <mesh position={[-0.3, 0.05, 0]} scale={[0.8, 0.6, 0.7]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Gallbladder */}
      <mesh position={[0.25, -0.15, 0.15]} scale={[0.4, 0.6, 0.4]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshPhysicalMaterial {...matProps} color="#2E8B57" />
      </mesh>
    </group>
  );
}

/** Kidneys — bean-shaped pair */
function KidneysModel({ color, emissive, emissiveIntensity, opacity }: { color: string; emissive: string; emissiveIntensity: number; opacity: number }) {
  const matProps = { color, roughness: 0.4, metalness: 0.1, transparent: true, opacity, emissive, emissiveIntensity };
  return (
    <group scale={[0.25, 0.25, 0.25]}>
      {/* Left kidney */}
      <group position={[-0.4, 0, 0]}>
        <mesh scale={[0.6, 1, 0.5]}>
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
        {/* Hilum indent */}
        <mesh position={[0.12, 0, 0]} scale={[0.3, 0.5, 0.3]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshPhysicalMaterial color="#1a1a2e" transparent opacity={0.6} />
        </mesh>
        {/* Ureter */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshPhysicalMaterial {...matProps} color="#D4A574" />
        </mesh>
      </group>
      {/* Right kidney */}
      <group position={[0.4, -0.05, 0]}>
        <mesh scale={[0.6, 1, 0.5]}>
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
        <mesh position={[-0.12, 0, 0]} scale={[0.3, 0.5, 0.3]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshPhysicalMaterial color="#1a1a2e" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshPhysicalMaterial {...matProps} color="#D4A574" />
        </mesh>
      </group>
      {/* Adrenal glands */}
      <mesh position={[-0.4, 0.25, 0]} scale={[0.5, 0.2, 0.4]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshPhysicalMaterial {...matProps} color="#DAA520" />
      </mesh>
      <mesh position={[0.4, 0.2, 0]} scale={[0.5, 0.2, 0.4]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshPhysicalMaterial {...matProps} color="#DAA520" />
      </mesh>
    </group>
  );
}

/** Stomach — J-shaped */
function StomachModel({ color, emissive, emissiveIntensity, opacity }: { color: string; emissive: string; emissiveIntensity: number; opacity: number }) {
  const matProps = { color, roughness: 0.5, metalness: 0.05, transparent: true, opacity, emissive, emissiveIntensity };
  return (
    <group scale={[0.25, 0.25, 0.25]}>
      {/* Fundus (top dome) */}
      <mesh position={[-0.15, 0.25, 0]}>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0, 0]} scale={[0.8, 1.2, 0.7]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Pylorus (bottom curve) */}
      <mesh position={[0.2, -0.25, 0]} scale={[0.6, 0.5, 0.5]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Esophageal junction */}
      <mesh position={[-0.1, 0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.15, 12]} />
        <meshPhysicalMaterial {...matProps} color="#C4A882" />
      </mesh>
      {/* Duodenal junction */}
      <mesh position={[0.3, -0.2, 0]} rotation={[0, 0, -1.2]}>
        <cylinderGeometry args={[0.04, 0.05, 0.15, 12]} />
        <meshPhysicalMaterial {...matProps} color="#C4A882" />
      </mesh>
    </group>
  );
}

/** Intestine — coiled tube */
function IntestineModel({ color, emissive, emissiveIntensity, opacity }: { color: string; emissive: string; emissiveIntensity: number; opacity: number }) {
  const matProps = { color, roughness: 0.5, metalness: 0.05, transparent: true, opacity, emissive, emissiveIntensity };
  const coils: JSX.Element[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 4;
    const r = 0.15 + i * 0.02;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const y = (i - 4) * 0.06;
    coils.push(
      <mesh key={i} position={[x, y, z]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
    );
  }
  return (
    <group scale={[0.45, 0.35, 0.4]}>
      {coils}
      {/* Large intestine frame */}
      <mesh position={[0.35, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
        <meshPhysicalMaterial {...matProps} color="#C4A882" />
      </mesh>
      <mesh position={[-0.35, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
        <meshPhysicalMaterial {...matProps} color="#C4A882" />
      </mesh>
      <mesh position={[0, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.7, 8]} />
        <meshPhysicalMaterial {...matProps} color="#C4A882" />
      </mesh>
    </group>
  );
}

/** Spine — stacked vertebrae */
function SpineModel({ color, emissive, emissiveIntensity, opacity }: { color: string; emissive: string; emissiveIntensity: number; opacity: number }) {
  const matProps = { color, roughness: 0.3, metalness: 0.15, transparent: true, opacity, emissive, emissiveIntensity };
  const vertebrae: JSX.Element[] = [];
  for (let i = 0; i < 14; i++) {
    const y = (i - 7) * 0.075;
    const size = 0.04 + (i < 7 ? i * 0.003 : (14 - i) * 0.003);
    vertebrae.push(
      <group key={i}>
        <mesh position={[0, y, 0]}>
          <cylinderGeometry args={[size, size + 0.005, 0.04, 8]} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
        {/* Spinous process */}
        <mesh position={[0, y, -0.06]}>
          <boxGeometry args={[0.01, 0.03, 0.04]} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
        {/* Disc */}
        {i < 13 && (
          <mesh position={[0, y + 0.037, 0]}>
            <cylinderGeometry args={[size * 0.9, size * 0.9, 0.015, 8]} />
            <meshPhysicalMaterial color="#4488AA" roughness={0.6} transparent opacity={opacity * 0.7} />
          </mesh>
        )}
      </group>
    );
  }
  return <group scale={[0.7, 0.7, 0.7]}>{vertebrae}</group>;
}

/** Eye — sphere with iris */
function EyeModel({ color, emissive, emissiveIntensity, opacity }: { color: string; emissive: string; emissiveIntensity: number; opacity: number }) {
  const matProps = { color, roughness: 0.2, metalness: 0.0, transparent: true, opacity, emissive, emissiveIntensity };
  return (
    <group scale={[0.2, 0.2, 0.2]}>
      {/* Sclera */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshPhysicalMaterial {...matProps} clearcoat={0.8} />
      </mesh>
      {/* Iris */}
      <mesh position={[0, 0, 0.27]}>
        <circleGeometry args={[0.12, 32]} />
        <meshPhysicalMaterial color="#4169E1" roughness={0.3} />
      </mesh>
      {/* Pupil */}
      <mesh position={[0, 0, 0.28]}>
        <circleGeometry args={[0.05, 32]} />
        <meshPhysicalMaterial color="#000000" />
      </mesh>
      {/* Cornea (transparent dome) */}
      <mesh position={[0, 0, 0.08]} scale={[0.5, 0.5, 0.3]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.15} clearcoat={1} />
      </mesh>
      {/* Optic nerve */}
      <mesh position={[0, 0, -0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.15, 8]} />
        <meshPhysicalMaterial color="#FFE4B5" roughness={0.5} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

/** Pancreas — elongated */
function PancreasModel({ color, emissive, emissiveIntensity, opacity }: { color: string; emissive: string; emissiveIntensity: number; opacity: number }) {
  const matProps = { color, roughness: 0.5, metalness: 0.05, transparent: true, opacity, emissive, emissiveIntensity };
  return (
    <group scale={[0.3, 0.2, 0.2]}>
      {/* Head (larger) */}
      <mesh position={[0.25, 0, 0]} scale={[1.2, 1, 1]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0, 0]} scale={[1, 0.7, 0.7]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Tail */}
      <mesh position={[-0.25, 0.03, 0]} scale={[0.8, 0.5, 0.5]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Connecting body */}
      <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.09, 0.35, 12]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
    </group>
  );
}

/** Thyroid — butterfly shape */
function ThyroidModel({ color, emissive, emissiveIntensity, opacity }: { color: string; emissive: string; emissiveIntensity: number; opacity: number }) {
  const matProps = { color, roughness: 0.4, metalness: 0.1, transparent: true, opacity, emissive, emissiveIntensity };
  return (
    <group scale={[0.15, 0.15, 0.15]}>
      {/* Right lobe */}
      <mesh position={[0.15, 0, 0]} scale={[0.5, 1.2, 0.4]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Left lobe */}
      <mesh position={[-0.15, 0, 0]} scale={[0.5, 1.2, 0.4]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Isthmus (connecting bridge) */}
      <mesh position={[0, -0.05, 0]} scale={[1, 0.3, 0.3]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
    </group>
  );
}

/** Bladder — rounded pouch */
function BladderModel({ color, emissive, emissiveIntensity, opacity }: { color: string; emissive: string; emissiveIntensity: number; opacity: number }) {
  const matProps = { color, roughness: 0.5, metalness: 0.05, transparent: true, opacity, emissive, emissiveIntensity };
  return (
    <group scale={[0.2, 0.2, 0.2]}>
      {/* Main body */}
      <mesh scale={[1, 0.8, 0.8]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Dome (top) */}
      <mesh position={[0, 0.15, 0]} scale={[0.9, 0.5, 0.7]}>
        <sphereGeometry args={[0.25, 20, 20]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Urethra */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.15, 8]} />
        <meshPhysicalMaterial {...matProps} color="#C8A0C8" />
      </mesh>
      {/* Ureters entering */}
      <mesh position={[-0.12, 0.1, -0.1]} rotation={[0.3, 0, 0.3]}>
        <cylinderGeometry args={[0.015, 0.015, 0.2, 6]} />
        <meshPhysicalMaterial {...matProps} color="#D4A574" />
      </mesh>
      <mesh position={[0.12, 0.1, -0.1]} rotation={[0.3, 0, -0.3]}>
        <cylinderGeometry args={[0.015, 0.015, 0.2, 6]} />
        <meshPhysicalMaterial {...matProps} color="#D4A574" />
      </mesh>
    </group>
  );
}

// Map organ IDs to their 3D model components
function getOrganComponent(organId: string): React.FC<{ color: string; emissive: string; emissiveIntensity: number; opacity: number }> {
  switch (organId) {
    case 'heart': return HeartModel;
    case 'brain': return BrainModel;
    case 'lungs': return LungsModel;
    case 'liver': return LiverModel;
    case 'kidneys': return KidneysModel;
    case 'stomach': return StomachModel;
    case 'intestine': return IntestineModel;
    case 'spine': return SpineModel;
    case 'eye': return EyeModel;
    case 'pancreas': return PancreasModel;
    case 'thyroid': return ThyroidModel;
    case 'bladder': return BladderModel;
    default: return ({ color, opacity }: any) => (
      <mesh><sphereGeometry args={[0.2, 16, 16]} /><meshPhysicalMaterial color={color} transparent opacity={opacity} /></mesh>
    );
  }
}

// ============================================================
// 3D ORGAN WRAPPER
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
  const groupRef = useRef<THREE.Group>(null);
  const visible = systemFilter === 'all' || organ.system === systemFilter;

  const colors = ORGAN_COLORS[organ.id] || { main: '#888', highlight: '#aaa' };
  const position = ORGAN_POSITIONS[organ.id] || [0, 0, 0];

  const OrganComponent = useMemo(() => getOrganComponent(organ.id), [organ.id]);

  useFrame((state) => {
    if (!groupRef.current || !visible) return;
    if (isSelected) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
    // Subtle breathing animation
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.015;
    groupRef.current.scale.set(breathe, breathe, breathe);
  });

  if (!visible) return null;

  const currentColor = isHovered || isSelected ? colors.highlight : colors.main;
  const currentOpacity = isSelected ? 1 : isHovered ? 0.95 : 0.85;
  const currentEmissive = isSelected ? colors.highlight : '#000000';
  const currentEmissiveIntensity = isSelected ? 0.3 : 0;

  return (
    <group position={position as any}>
      <group
        ref={groupRef}
        onClick={(e: any) => { e.stopPropagation(); onSelect(); }}
        onPointerOver={(e: any) => { e.stopPropagation(); onHover(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { onUnhover(); document.body.style.cursor = 'default'; }}
      >
        <OrganComponent
          color={currentColor}
          emissive={currentEmissive}
          emissiveIntensity={currentEmissiveIntensity}
          opacity={currentOpacity}
        />
      </group>
      {/* Label */}
      {(isHovered || isSelected) && (
        <Html center distanceFactor={3} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(0,0,0,0.9)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            border: `2px solid ${colors.highlight}`,
            boxShadow: `0 0 15px ${colors.highlight}40`,
          }}>
            {organ.name}
            <div style={{ fontSize: '11px', opacity: 0.7, fontStyle: 'italic' }}>{organ.latinName}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// ============================================================
// BODY OUTLINE
// ============================================================
function BodyOutline() {
  return (
    <group>
      {/* Head */}
      <mesh position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="#1a2a3e" transparent opacity={0.08} roughness={0.9} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.15, 16]} />
        <meshStandardMaterial color="#1a2a3e" transparent opacity={0.06} roughness={0.9} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.35, 0.3, 1.3, 16]} />
        <meshStandardMaterial color="#1a2a3e" transparent opacity={0.06} roughness={0.9} />
      </mesh>
      {/* Pelvis */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.3, 0.25, 0.35, 16]} />
        <meshStandardMaterial color="#1a2a3e" transparent opacity={0.05} roughness={0.9} />
      </mesh>
      {/* Arms */}
      {[-1, 1].map(side => (
        <mesh key={`arm-${side}`} position={[side * 0.5, 1.1, 0]} rotation={[0, 0, side * 0.15]}>
          <cylinderGeometry args={[0.06, 0.05, 0.9, 8]} />
          <meshStandardMaterial color="#1a2a3e" transparent opacity={0.04} roughness={0.9} />
        </mesh>
      ))}
      {/* Legs */}
      {[-1, 1].map(side => (
        <mesh key={`leg-${side}`} position={[side * 0.15, -0.5, 0]}>
          <cylinderGeometry args={[0.09, 0.07, 1.0, 8]} />
          <meshStandardMaterial color="#1a2a3e" transparent opacity={0.04} roughness={0.9} />
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.0} castShadow />
      <directionalLight position={[-3, 4, -3]} intensity={0.4} />
      <pointLight position={[0, 3, 3]} intensity={0.6} color="#ffffff" />
      <pointLight position={[2, 1, -2]} intensity={0.3} color="#4488ff" />
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
          <SectionList title="Funções" items={organ.functions} color={colors.highlight} />
          <Field label="Localização" value={organ.location} />
          <Field label="Dimensões" value={organ.dimensions} />
          <Field label="Peso" value={organ.weight} />
          <Field label="Irrigação" value={organ.bloodSupply} />
          <Field label="Inervação" value={organ.innervation} />
        </div>
      )}

      {tab === 'clinical' && (
        <div style={{ color: '#ccc', fontSize: '13px', lineHeight: 1.6 }}>
          <SectionList title="Patologias" items={organ.pathologies} color="#e74c3c" />
          <SectionList title="Notas Clínicas" items={organ.clinicalNotes} color="#3498db" />
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

function SectionList({ title, items, color }: { title: string; items: string[]; color: string }) {
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
  const filteredOrgans = useMemo(() => ORGANS.filter(o => systemFilter === 'all' || o.system === systemFilter), [systemFilter]);

  return (
    <div style={{ width: '100%', height: '700px', position: 'relative', background: '#0a0f1a', borderRadius: '12px', overflow: 'hidden' }}>
      {/* System filter buttons */}
      <div style={{
        position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexWrap: 'wrap', gap: '6px', zIndex: 5, justifyContent: 'center', maxWidth: '90%',
      }}>
        {SYSTEMS.map(sys => (
          <button key={sys.id} onClick={() => setSystemFilter(sys.id)} style={{
            padding: '6px 14px', border: `1px solid ${sys.color}40`, borderRadius: '20px',
            background: systemFilter === sys.id ? sys.color + '25' : 'rgba(0,0,0,0.6)',
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
        background: 'rgba(0,0,0,0.7)', borderRadius: '12px', padding: '10px',
        backdropFilter: 'blur(10px)', maxHeight: 'calc(100% - 80px)', overflowY: 'auto',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <p style={{ color: '#888', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>
          Estruturas ({filteredOrgans.length})
        </p>
        {filteredOrgans.map(organ => {
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
                background: isActive ? colors.highlight + '20' : hoveredOrgan === organ.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: isActive ? colors.highlight : '#ccc', fontSize: '12px', fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: colors.main, flexShrink: 0, boxShadow: isActive ? `0 0 8px ${colors.highlight}` : 'none' }} />
                {organ.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 1.5, 3.5], fov: 45 }}
        shadows
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0a0f1a');
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
      >
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

      {/* Detail panel */}
      {selectedOrganData && (
        <DetailPanel organ={selectedOrganData} onClose={() => setSelectedOrgan(null)} />
      )}

      {/* Instructions */}
      {!selectedOrgan && (
        <div style={{
          position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.7)', padding: '10px 24px', borderRadius: '20px',
          color: '#aaa', fontSize: '13px', backdropFilter: 'blur(8px)', whiteSpace: 'nowrap',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          Clique em um orgao para ver detalhes | Arraste para rotacionar | Scroll para zoom
        </div>
      )}
    </div>
  );
}
