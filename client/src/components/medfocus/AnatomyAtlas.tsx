/**
 * AnatomyAtlas v4.0 - Atlas Anatomico 3D Interativo Avancado
 * Three.js + React Three Fiber com corpo humano completo,
 * disseccao por camadas, quiz 3D, patologia, modelos detalhados.
 * 
 * Referencias:
 * [1] Gray's Anatomy, 42nd Ed. Standring S. Elsevier, 2020.
 * [2] Netter Atlas of Human Anatomy, 8th Ed. Netter FH. Elsevier, 2023.
 * [3] Sobotta Atlas of Anatomy, 24th Ed. Paulsen F, Waschke J. Urban & Fischer, 2022.
 * [4] Moore's Clinically Oriented Anatomy, 9th Ed. Dalley AF, Agur AMR. Wolters Kluwer, 2022.
 * [5] Prometheus Atlas of Anatomy, 5th Ed. Schunke M et al. Thieme, 2022.
 * [6] Junqueira's Basic Histology, 16th Ed. Mescher AL. McGraw-Hill, 2021.
 * [7] Langman's Medical Embryology, 14th Ed. Sadler TW. Wolters Kluwer, 2019.
 * [8] Guyton & Hall Textbook of Medical Physiology, 14th Ed. Hall JE. Elsevier, 2020.
 * [9] Robbins & Cotran Pathologic Basis of Disease, 10th Ed. Kumar V et al. Elsevier, 2021.
 * [10] Williams Obstetrics, 26th Ed. Cunningham FG et al. McGraw-Hill, 2022.
 */
import React, { useState, useMemo, useRef, useCallback, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Environment, ContactShadows, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import {
  Heart, Brain, Bone, Droplets, Wind, Utensils, Eye,
  Shield, Zap, Baby, Activity, ArrowLeft, BookOpen, Search,
  ChevronRight, GraduationCap, Stethoscope, Microscope,
  RotateCw, Info, Layers, Tag, ChevronDown, ChevronUp,
  X, Bookmark, ExternalLink, HelpCircle,
  CheckCircle, XCircle, Award, Target, Scissors
} from 'lucide-react';

// === TYPES ===
interface AnatomyAnnotation {
  position: [number, number, number];
  label: string;
  description: string;
  clinicalNote?: string;
}
interface PathologyData {
  name: string;
  description: string;
  visualChange: string;
  reference: string;
}
interface OrganData {
  id: string;
  name: string;
  nameEn: string;
  nameLatin: string;
  description: string;
  histology: string;
  embryology: string;
  bloodSupply: string;
  innervation: string;
  functions: string[];
  pathologies: PathologyData[];
  examTips: string[];
  surgicalNotes: string[];
  imagingNotes: string[];
  annotations: AnatomyAnnotation[];
  references: string[];
  shape3D: string;
  position3D: [number, number, number];
  scale3D: number;
  color3D: string;
}
interface BodySystemData {
  id: string;
  name: string;
  nameEn: string;
  icon: React.ElementType;
  color: string;
  threeColor: string;
  bgColor: string;
  year: number;
  description: string;
  organs: OrganData[];
  relatedSubjects: string[];
  clinicalRelevance: string[];
  keyTerms: string[];
  references: string[];
}
interface QuizQuestion {
  organId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// === DISSECTION LAYERS ===
const DISSECTION_LAYERS = [
  { id: 'skin', name: 'Pele & Subcutaneo', color: '#f5d0a9', opacity: 0.6, desc: 'Epiderme, derme, tecido subcutaneo [Gray Cap. 7]' },
  { id: 'muscle', name: 'Musculos', color: '#c0392b', opacity: 0.55, desc: 'Musculatura esqueletica e fascias [Netter Sec. 1]' },
  { id: 'organs', name: 'Orgaos', color: '#e74c3c', opacity: 0.75, desc: 'Visceras toracicas e abdominais [Moore Cap. 2-5]' },
  { id: 'vessels', name: 'Vasos & Nervos', color: '#3498db', opacity: 0.65, desc: 'Arterias, veias e nervos perifericos [Gray Cap. 3]' },
  { id: 'skeleton', name: 'Esqueleto', color: '#ecf0f1', opacity: 0.9, desc: '206 ossos do corpo humano adulto [Sobotta Cap. 1]' },
];
// === BODY SYSTEMS DATA (12 Systems, 3-5 organs each) ===
const BODY_SYSTEMS: BodySystemData[] = [
  {
    id: 'cardiovascular', name: 'Sistema Cardiovascular', nameEn: 'Cardiovascular System',
    icon: Heart, color: 'text-red-500', threeColor: '#ef4444', bgColor: 'bg-red-500/10', year: 1,
    description: 'Responsavel pelo transporte de sangue, nutrientes e oxigenio. Inclui coracao (4 camaras), arterias, veias, capilares e sistema linfatico associado. O coracao bombeia ~5L/min em repouso. [Guyton Cap. 9-24]',
    relatedSubjects: ['Anatomia', 'Fisiologia', 'Histologia', 'Cardiologia'],
    clinicalRelevance: ['IAM - principal causa de morte no Brasil (SBC 2023)', 'ICC - 2 milhoes de brasileiros afetados', 'HAS - prevalencia de 32,5% em adultos'],
    keyTerms: ['Debito cardiaco', 'Pre-carga', 'Pos-carga', 'Fracao de ejecao', 'Ciclo cardiaco'],
    references: ["Gray's Anatomy 42nd Ed, Cap. 56-60", "Netter Atlas 8th Ed, Plates 212-240", "Guyton & Hall 14th Ed, Cap. 9-24"],
    organs: [
      {
        id: 'coracao', name: 'Coracao', nameEn: 'Heart', nameLatin: 'Cor',
        description: 'Orgao muscular oco com 4 camaras (2 atrios, 2 ventriculos). Peso medio: 250-350g. Localizado no mediastino medio, entre T5-T8. Pericardio fibroso e seroso o envolvem. [Gray Cap. 56]',
        histology: 'Miocardio: fibras musculares estriadas cardiacas com discos intercalares (juncoes gap). Endocardio: endotelio + tecido conjuntivo. Epicardio: mesotelio + tecido adiposo. Sistema de conducao: celulas de Purkinje. [Junqueira Cap. 10]',
        embryology: 'Deriva do mesoderma esplancnico. Tubo cardiaco primitivo forma-se na 3a semana. Septacao atrial (septum primum e secundum) e ventricular entre 4a-8a semana. Foramen ovale fecha ao nascimento. [Langman Cap. 12]',
        bloodSupply: 'Coronaria direita (CD): no AV, parede inferior. Coronaria esquerda: DA (parede anterior, septo), Cx (parede lateral). Dominancia direita em 85%. [Netter Plate 216]',
        innervation: 'Simpatico: T1-T4 (cronotropismo+, inotropismo+). Parassimpatico: nervo vago (cronotropismo-). Plexo cardiaco superficial e profundo. [Gray Cap. 56]',
        functions: ['Bombeamento sanguineo (~5L/min)', 'Regulacao da pressao arterial', 'Secrecao de ANP e BNP', 'Conducao eletrica intrinseca'],
        pathologies: [
          { name: 'Infarto Agudo do Miocardio', description: 'Necrose do miocardio por oclusao coronariana. Troponina elevada, supra de ST.', visualChange: 'Area necrotica escurecida no miocardio', reference: 'Robbins Cap. 12' },
          { name: 'Insuficiencia Cardiaca', description: 'Incapacidade de manter debito cardiaco adequado. FE < 40% (ICFEr).', visualChange: 'Dilatacao das camaras cardiacas', reference: 'Guyton Cap. 22' },
          { name: 'Estenose Aortica', description: 'Estreitamento da valva aortica. Sopro sistolico ejetivo em foco aortico.', visualChange: 'Calcificacao e espessamento valvar', reference: 'Robbins Cap. 12' },
          { name: 'Fibrilacao Atrial', description: 'Arritmia mais comum. Ritmo irregularmente irregular. Risco de AVC.', visualChange: 'Atrios dilatados com tremulacao', reference: 'Guyton Cap. 13' }
        ],
        examTips: ['Dominancia coronariana: 85% direita', 'Valva mitral: 2 cuspides (bicuspide)', 'No de Keith-Flack = no sinusal (marcapasso)', 'Triangulo de Koch: localiza no AV'],
        surgicalNotes: ['Esternotomia mediana para CRM', 'Safena e mamaria como enxertos', 'TAVI para estenose aortica em idosos'],
        imagingNotes: ['ECO: FE, motilidade segmentar', 'Cate: anatomia coronariana', 'RNM: viabilidade miocardica', 'TC coronarias: escore de calcio'],
        annotations: [
          { position: [0, 0.3, 0.3], label: 'Atrio Direito', description: 'Recebe sangue venoso das veias cavas superior e inferior', clinicalNote: 'Local do no sinusal (marcapasso natural)' },
          { position: [0.3, 0.3, 0.2], label: 'Atrio Esquerdo', description: 'Recebe sangue oxigenado das 4 veias pulmonares', clinicalNote: 'Dilatacao na fibrilacao atrial' },
          { position: [0, -0.1, 0.3], label: 'Ventriculo Direito', description: 'Bombeia sangue para arteria pulmonar (circulacao pulmonar)', clinicalNote: 'Parede fina (3-5mm), pressao baixa' },
          { position: [0.3, -0.1, 0.2], label: 'Ventriculo Esquerdo', description: 'Bombeia sangue para aorta (circulacao sistemica)', clinicalNote: 'Parede espessa (12-15mm), alta pressao' },
          { position: [0.15, 0.5, 0.1], label: 'Arco Aortico', description: 'Origina tronco braquiocefalico, carotida comum E e subclavia E', clinicalNote: 'Coarctacao: HAS em MMSS, hipotensao em MMII' },
          { position: [-0.2, 0.1, 0.2], label: 'Valva Tricuspide', description: '3 cuspides: anterior, posterior, septal', clinicalNote: 'Insuficiencia na hipertensao pulmonar' }
        ],
        references: ["Gray's Anatomy 42nd Ed, Cap. 56", "Netter Plate 212-220", "Guyton Cap. 9-13", "Robbins Cap. 12"],
        shape3D: 'heart', position3D: [0, 0, 0], scale3D: 1, color3D: '#ef4444'
      },
      {
        id: 'aorta', name: 'Aorta', nameEn: 'Aorta', nameLatin: 'Aorta',
        description: 'Maior arteria do corpo. Origina-se do VE, forma o arco aortico e desce pelo torax e abdome. Diametro: 2.5-3.5cm na raiz. Divide-se em iliacas comuns em L4. [Gray Cap. 57]',
        histology: 'Arteria elastica: tunica intima (endotelio), media (laminas elasticas concentricas + musculo liso), adventicia (vasa vasorum). [Junqueira Cap. 11]',
        embryology: 'Arco aortico deriva do 4o arco faringeo esquerdo. Aorta descendente do tronco arterioso e aortas dorsais. [Langman Cap. 12]',
        bloodSupply: 'Vasa vasorum na adventicia e media externa. Difusao na intima.',
        innervation: 'Barorreceptores no arco aortico (nervo vago). Quimiorreceptores nos corpos aorticos.',
        functions: ['Conducao de sangue oxigenado', 'Efeito Windkessel (amortecimento)', 'Regulacao da PA via barorreceptores'],
        pathologies: [
          { name: 'Aneurisma de Aorta', description: 'Dilatacao > 50% do diametro normal. AAA > 5.5cm = indicacao cirurgica.', visualChange: 'Dilatacao focal da parede aortica', reference: 'Robbins Cap. 11' },
          { name: 'Disseccao Aortica', description: 'Separacao das camadas da parede. Dor toracica lancinante. Stanford A (ascendente) = cirurgia.', visualChange: 'Flap intimal separando lumen verdadeiro e falso', reference: 'Robbins Cap. 11' }
        ],
        examTips: ['Arco aortico: 3 ramos (tronco braquiocefalico, carotida comum E, subclavia E)', 'Bifurcacao aortica: nivel L4', 'Hiato aortico do diafragma: T12'],
        surgicalNotes: ['Reparo endovascular (EVAR) para AAA', 'Bentall para aneurisma de raiz'],
        imagingNotes: ['AngioTC: padrao-ouro para disseccao', 'USG abdominal: rastreio de AAA'],
        annotations: [
          { position: [0, 0.4, 0], label: 'Raiz da Aorta', description: 'Origem no VE, contem os seios de Valsalva', clinicalNote: 'Aneurisma de raiz na sindrome de Marfan' },
          { position: [0, 0.6, -0.2], label: 'Arco Aortico', description: '3 ramos principais', clinicalNote: 'Coarctacao distal a subclavia E' }
        ],
        references: ["Gray's Anatomy 42nd Ed, Cap. 57", "Netter Plate 221-225"],
        shape3D: 'tube', position3D: [0, 0.5, -0.1], scale3D: 0.6, color3D: '#dc2626'
      },
      {
        id: 'veia_cava', name: 'Veias Cavas', nameEn: 'Venae Cavae', nameLatin: 'Vena cava superior et inferior',
        description: 'VCS: drena cabeca, pescoco, MMSS e torax superior. VCI: drena abdome, pelve e MMII. Ambas desembocam no atrio direito. [Gray Cap. 57]',
        histology: 'Veias de grande calibre: tunica media fina com pouco musculo liso, adventicia espessa com vasa vasorum. Sem valvulas. [Junqueira Cap. 11]',
        embryology: 'VCS: veia cardinal anterior direita. VCI: formacao complexa a partir de veias subcardinais, supracardinais e vitelinas. [Langman Cap. 12]',
        bloodSupply: 'Vasa vasorum na adventicia.',
        innervation: 'Fibras simpaticas vasoconstritoras. Receptores de estiramento na juncao VCS-AD.',
        functions: ['Retorno venoso ao coracao direito', 'Reservatorio de volume sanguineo'],
        pathologies: [
          { name: 'Sindrome da VCS', description: 'Obstrucao da VCS por tumor mediastinal. Edema facial, pletora, circulacao colateral.', visualChange: 'Compressao extrinseca da VCS', reference: 'Robbins Cap. 11' }
        ],
        examTips: ['VCS: sem valvulas', 'VCI: drena veias hepaticas antes do AD', 'Filtro de VCI: prevencao de TEP'],
        surgicalNotes: ['Acesso venoso central via VCS (jugular, subclavia)'],
        imagingNotes: ['TC com contraste: avaliacao de trombose', 'Eco transesofagico: juncao VCS-AD'],
        annotations: [
          { position: [0.1, 0.5, 0.1], label: 'VCS', description: 'Veia cava superior - drena metade superior do corpo' },
          { position: [0.1, -0.5, 0.1], label: 'VCI', description: 'Veia cava inferior - drena metade inferior do corpo' }
        ],
        references: ["Gray's Anatomy 42nd Ed, Cap. 57", "Netter Plate 228-230"],
        shape3D: 'cylinder', position3D: [0.2, 0, 0], scale3D: 0.5, color3D: '#3b82f6'
      }
    ]
  },
  {
    id: 'nervoso', name: 'Sistema Nervoso', nameEn: 'Nervous System',
    icon: Brain, color: 'text-purple-500', threeColor: '#a855f7', bgColor: 'bg-purple-500/10', year: 1,
    description: 'Centro de controle do organismo. SNC (encefalo + medula espinal) e SNP (nervos cranianos e espinais). 86 bilhoes de neuronios. [Guyton Cap. 45-60]',
    relatedSubjects: ['Neuroanatomia', 'Neurofisiologia', 'Neurologia', 'Neurocirurgia'],
    clinicalRelevance: ['AVC: 2a causa de morte no mundo', 'Epilepsia: 50 milhoes de pessoas', 'Alzheimer: 55 milhoes no mundo'],
    keyTerms: ['Sinapses', 'Potencial de acao', 'Barreira hematoencefalica', 'Liquor cefalorraquidiano', 'Homunculos motor e sensitivo'],
    references: ["Gray's Anatomy 42nd Ed, Cap. 22-44", "Netter Atlas 8th Ed, Plates 100-160", "Guyton Cap. 45-60"],
    organs: [
      {
        id: 'cerebro', name: 'Cerebro', nameEn: 'Cerebrum', nameLatin: 'Cerebrum',
        description: 'Maior parte do encefalo (~1400g). 2 hemisferios com 4 lobos cada (frontal, parietal, temporal, occipital). Cortex cerebral: 2-4mm de substancia cinzenta com ~16 bilhoes de neuronios. [Gray Cap. 25]',
        histology: 'Cortex: 6 camadas (neocortex). Substancia branca: axonios mielinizados. Nucleos da base: caudado, putamen, globo palido. [Junqueira Cap. 9]',
        embryology: 'Deriva do prosencefalo (telencefalo). Vesiculas telencefalicas se expandem formando hemisferios. Comissuras: corpo caloso (semana 12-20). [Langman Cap. 17]',
        bloodSupply: 'Circulo de Willis. ACA: face medial. ACM: face lateral (mais acometida no AVC). ACP: face inferior e occipital. [Netter Plate 140]',
        innervation: 'Cortex motor primario (area 4): giro pre-central. Cortex sensitivo (areas 3,1,2): giro pos-central. Area de Broca (44,45): fala. Area de Wernicke (22): compreensao.',
        functions: ['Funcoes cognitivas superiores', 'Controle motor voluntario', 'Processamento sensorial', 'Linguagem e memoria', 'Consciencia e emocoes'],
        pathologies: [
          { name: 'AVC Isquemico', description: 'Oclusao arterial cerebral. 85% dos AVCs. Territorio da ACM mais comum.', visualChange: 'Area hipodensa no territorio vascular', reference: 'Robbins Cap. 28' },
          { name: 'Doenca de Alzheimer', description: 'Demencia neurodegenerativa. Placas amiloides e emaranhados neurofibrilares.', visualChange: 'Atrofia cortical difusa, alargamento de sulcos', reference: 'Robbins Cap. 28' },
          { name: 'Glioblastoma', description: 'Tumor cerebral primario mais agressivo (grau IV). Sobrevida media: 15 meses.', visualChange: 'Massa heterogenea com necrose central', reference: 'Robbins Cap. 28' }
        ],
        examTips: ['Homunculos de Penfield: representacao somatotopica', 'ACM: hemiparesia + afasia (hemisferio dominante)', 'Herniacao uncal: compressao do III nervo (midriase ipsilateral)'],
        surgicalNotes: ['Craniotomia pterional: acesso a fossa media', 'Awake surgery para tumores em area eloquente'],
        imagingNotes: ['TC sem contraste: 1o exame no AVC agudo', 'RNM difusao: isquemia em minutos', 'AngioTC: oclusao de grandes vasos'],
        annotations: [
          { position: [-0.25, 0.15, 0.2], label: 'Lobo Frontal', description: 'Funcoes executivas, planejamento, personalidade, area motora', clinicalNote: 'Lesao: sindrome frontal, abulia, desinibicao' },
          { position: [0.25, 0.15, 0.2], label: 'Lobo Parietal', description: 'Processamento somatossensorial, orientacao espacial', clinicalNote: 'Lesao: negligencia contralateral (hemisferio nao-dominante)' },
          { position: [-0.3, -0.1, 0.25], label: 'Lobo Temporal', description: 'Audicao, memoria, area de Wernicke', clinicalNote: 'Lesao: afasia de Wernicke (fluente, sem compreensao)' },
          { position: [0, 0.1, -0.3], label: 'Lobo Occipital', description: 'Processamento visual primario (area 17)', clinicalNote: 'Lesao: hemianopsia homonima contralateral' },
          { position: [0, 0.3, 0], label: 'Giro Pre-central', description: 'Cortex motor primario (area 4 de Brodmann)', clinicalNote: 'Homunculos motor: face e mao com maior representacao' }
        ],
        references: ["Gray's Cap. 25-28", "Netter Plates 100-120", "Guyton Cap. 47-51", "Robbins Cap. 28"],
        shape3D: 'brain', position3D: [0, 0, 0], scale3D: 1, color3D: '#a855f7'
      },
      {
        id: 'cerebelo', name: 'Cerebelo', nameEn: 'Cerebellum', nameLatin: 'Cerebellum',
        description: 'Localizado na fossa posterior. Coordenacao motora, equilibrio e aprendizado motor. Contem mais neuronios que o cerebro (~69 bilhoes de celulas granulares). [Gray Cap. 33]',
        histology: 'Cortex cerebelar: 3 camadas (molecular, Purkinje, granular). Celulas de Purkinje: maiores neuronios do cerebelo, inibitorio (GABA). [Junqueira Cap. 9]',
        embryology: 'Deriva do metencefalo (rombencefalo). Labios rombicos se fundem formando o vermis e hemisferios cerebelares. [Langman Cap. 17]',
        bloodSupply: 'AICA, PICA, ACS (ramos da arteria basilar e vertebrais). [Netter Plate 141]',
        innervation: 'Pedunculos cerebelares: superior (eferente), medio (aferente pontino), inferior (aferente espinal/vestibular).',
        functions: ['Coordenacao motora fina', 'Equilibrio e postura', 'Aprendizado motor', 'Funcoes cognitivas (estudos recentes)'],
        pathologies: [
          { name: 'Ataxia Cerebelar', description: 'Incoordenacao motora. Dismetria, disdiadococinesia, tremor intencional.', visualChange: 'Atrofia do vermis e hemisferios', reference: 'Robbins Cap. 28' },
          { name: 'Meduloblastoma', description: 'Tumor maligno mais comum da fossa posterior em criancas. Origina-se do vermis.', visualChange: 'Massa na linha media da fossa posterior', reference: 'Robbins Cap. 28' }
        ],
        examTips: ['Lesao do vermis: ataxia de tronco (axial)', 'Lesao hemisferica: ataxia apendicular (membros ipsilaterais)', 'PICA: sindrome de Wallenberg (lateral bulbar)'],
        surgicalNotes: ['Craniotomia suboccipital para tumores de fossa posterior'],
        imagingNotes: ['RNM: melhor exame para fossa posterior', 'TC: hidrocefalia obstrutiva'],
        annotations: [
          { position: [0, -0.25, -0.15], label: 'Vermis', description: 'Porcao mediana do cerebelo, controle axial', clinicalNote: 'Ataxia de tronco quando lesado' },
          { position: [0.2, -0.2, -0.1], label: 'Hemisferio Cerebelar', description: 'Controle motor apendicular ipsilateral', clinicalNote: 'Dismetria e tremor intencional ipsilateral' }
        ],
        references: ["Gray's Cap. 33", "Netter Plates 112-115", "Guyton Cap. 56"],
        shape3D: 'cerebellum', position3D: [0, -0.35, -0.2], scale3D: 0.5, color3D: '#9333ea'
      },
      {
        id: 'medula_espinal', name: 'Medula Espinal', nameEn: 'Spinal Cord', nameLatin: 'Medulla spinalis',
        description: 'Estrutura cilindrica de ~45cm no canal vertebral. De C1 ate L1-L2 (cone medular). Cauda equina abaixo. 31 pares de nervos espinais. [Gray Cap. 44]',
        histology: 'Substancia cinzenta central (H): cornos anterior (motor), posterior (sensitivo), lateral (autonomico). Substancia branca periferica: tratos ascendentes e descendentes. [Junqueira Cap. 9]',
        embryology: 'Deriva do tubo neural. Placa alar (sensitiva) e placa basal (motora). Defeitos de fechamento: espinha bifida, mielomeningocele. [Langman Cap. 17]',
        bloodSupply: 'Arteria espinal anterior (2/3 anteriores) e 2 arterias espinais posteriores (1/3 posterior). Arteria de Adamkiewicz (T9-T12). [Netter Plate 170]',
        innervation: '31 pares: 8 cervicais, 12 toracicos, 5 lombares, 5 sacrais, 1 coccigeo.',
        functions: ['Conducao de impulsos aferentes e eferentes', 'Arcos reflexos medulares', 'Controle autonomico (simpatico T1-L2, parassimpatico S2-S4)'],
        pathologies: [
          { name: 'Lesao Medular Traumatica', description: 'Secao medular completa ou incompleta. Choque medular inicial.', visualChange: 'Interrupcao da medula no nivel da lesao', reference: 'Robbins Cap. 28' },
          { name: 'Siringomielia', description: 'Cavitacao central da medula. Perda sensitiva dissociada (dor/temperatura preservando tato).', visualChange: 'Cavidade central na medula cervical', reference: 'Robbins Cap. 28' }
        ],
        examTips: ['Cone medular: L1-L2', 'Puncao lombar: L3-L4 ou L4-L5 (abaixo do cone)', 'Sindrome de Brown-Sequard: hemiseccao medular'],
        surgicalNotes: ['Laminectomia para descompressao', 'Fixacao com parafusos pediculares'],
        imagingNotes: ['RNM: padrao-ouro para medula', 'TC: avaliar fraturas vertebrais'],
        annotations: [
          { position: [0, 0, 0.1], label: 'Intumescencia Cervical', description: 'C4-T1: plexo braquial (MMSS)', clinicalNote: 'Lesao: tetraplegia' },
          { position: [0, -0.4, 0.1], label: 'Intumescencia Lombar', description: 'L1-S3: plexo lombossacral (MMII)', clinicalNote: 'Lesao: paraplegia' }
        ],
        references: ["Gray's Cap. 44", "Netter Plates 160-170", "Guyton Cap. 54-55"],
        shape3D: 'spinalcord', position3D: [0, -0.2, -0.15], scale3D: 0.4, color3D: '#c084fc'
      }
    ]
  },
  {
    id: 'respiratorio', name: 'Sistema Respiratorio', nameEn: 'Respiratory System',
    icon: Wind, color: 'text-sky-500', threeColor: '#0ea5e9', bgColor: 'bg-sky-500/10', year: 1,
    description: 'Trocas gasosas (O2/CO2). Vias aereas superiores (nariz, faringe, laringe) e inferiores (traqueia, bronquios, pulmoes). Superficie alveolar: ~70m2. [Guyton Cap. 38-42]',
    relatedSubjects: ['Anatomia', 'Fisiologia', 'Pneumologia', 'Cirurgia Toracica'],
    clinicalRelevance: ['DPOC: 3a causa de morte no mundo (GOLD 2024)', 'Pneumonia: principal causa de internacao', 'Asma: 300 milhoes no mundo'],
    keyTerms: ['Volume corrente', 'Capacidade vital', 'VEMS/CVF', 'Surfactante', 'Complacencia pulmonar'],
    references: ["Gray's Cap. 53-55", "Netter Plates 192-210", "Guyton Cap. 38-42"],
    organs: [
      {
        id: 'pulmoes', name: 'Pulmoes', nameEn: 'Lungs', nameLatin: 'Pulmones',
        description: 'Orgaos pares no torax. Pulmao direito: 3 lobos (superior, medio, inferior), 2 fissuras. Pulmao esquerdo: 2 lobos, 1 fissura, incisura cardiaca. ~300 milhoes de alveolos. [Gray Cap. 54]',
        histology: 'Bronquios: epithelio pseudoestratificado ciliado com celulas caliciformes. Alveolos: pneumocitos tipo I (trocas) e tipo II (surfactante). Macrofagos alveolares. [Junqueira Cap. 17]',
        embryology: 'Diverticulo respiratorio surge na 4a semana do intestino anterior. Fases: embrionaria, pseudoglandular, canalicular, sacular, alveolar. Surfactante a partir de 24 semanas. [Langman Cap. 14]',
        bloodSupply: 'Circulacao pulmonar: arteria pulmonar (sangue venoso). Circulacao bronquica: arterias bronquicas (nutricao). Drenagem venosa: veias pulmonares para AE.',
        innervation: 'Plexo pulmonar: simpatico (broncodilatacao) e parassimpatico/vago (broncoconstricao, secrecao).',
        functions: ['Trocas gasosas (hematose)', 'Regulacao do pH sanguineo', 'Producao de surfactante', 'Filtracao de microembolos', 'Conversao de angiotensina I em II (ECA)'],
        pathologies: [
          { name: 'Pneumonia', description: 'Infeccao do parenquima pulmonar. Lobar (pneumococo) ou broncopneumonia.', visualChange: 'Consolidacao lobar ou focos multiplos', reference: 'Robbins Cap. 15' },
          { name: 'DPOC/Enfisema', description: 'Destruicao dos septos alveolares. Hiperinsuflacao. Obstrucao ao fluxo aereo.', visualChange: 'Pulmoes hiperinsuflados, bolhas enfisematosas', reference: 'Robbins Cap. 15' },
          { name: 'Carcinoma Pulmonar', description: 'Tumor maligno mais letal. Tipos: adenocarcinoma, escamoso, pequenas celulas.', visualChange: 'Nodulo/massa pulmonar com espiculacoes', reference: 'Robbins Cap. 15' }
        ],
        examTips: ['Pulmao direito: 3 lobos, 10 segmentos', 'Pulmao esquerdo: 2 lobos, 8-9 segmentos', 'Bronquio principal direito: mais verticalizado (aspiracao)', 'Surfactante: a partir de 24 semanas (viabilidade fetal)'],
        surgicalNotes: ['Lobectomia: resseccao de lobo pulmonar', 'VATS: cirurgia toracica videoassistida', 'Drenagem pleural: 5o EIC, linha axilar media'],
        imagingNotes: ['RX torax: PA e perfil', 'TC torax: nodulos, massas, TEP', 'Broncoscopia: visualizacao direta das vias aereas'],
        annotations: [
          { position: [0.35, 0.1, 0.2], label: 'Lobo Superior D', description: 'Segmentos apical, posterior, anterior' },
          { position: [0.35, -0.1, 0.2], label: 'Lobo Medio', description: 'Segmentos lateral e medial (exclusivo do pulmao direito)' },
          { position: [0.3, -0.3, 0.15], label: 'Lobo Inferior D', description: 'Segmentos superior, basal medial, anterior, lateral, posterior' },
          { position: [-0.3, 0.1, 0.2], label: 'Lobo Superior E', description: 'Inclui lingula (equivalente ao lobo medio)' },
          { position: [-0.3, -0.2, 0.15], label: 'Lobo Inferior E', description: 'Semelhante ao direito, sem segmento basal medial' }
        ],
        references: ["Gray's Cap. 54", "Netter Plates 196-205", "Guyton Cap. 38-40", "Robbins Cap. 15"],
        shape3D: 'lungs', position3D: [0, 0, 0], scale3D: 1, color3D: '#0ea5e9'
      },
      {
        id: 'traqueia', name: 'Traqueia', nameEn: 'Trachea', nameLatin: 'Trachea',
        description: 'Tubo cartilaginoso de ~11cm, de C6 ate T4-T5 (carina). 16-20 aneis cartilaginosos em C (abertos posteriormente). Diametro: ~2cm. [Gray Cap. 53]',
        histology: 'Epithelio respiratorio (pseudoestratificado ciliado). Glandulas seromucosas submucosas. Musculo traqueal (posterior). Cartilagem hialina em C. [Junqueira Cap. 17]',
        embryology: 'Origina-se do diverticulo laringotraqueal na 4a semana. Separacao do esofago pelo septo traqueoesofagico. [Langman Cap. 14]',
        bloodSupply: 'Arterias tireoideas inferiores e arterias bronquicas.',
        innervation: 'Nervo laringeo recorrente (ramo do vago): sensibilidade abaixo das cordas vocais.',
        functions: ['Conducao de ar', 'Aquecimento e umidificacao', 'Defesa mucociliar'],
        pathologies: [
          { name: 'Estenose Traqueal', description: 'Estreitamento pos-intubacao prolongada ou trauma. Estridor inspiratorio.', visualChange: 'Estreitamento segmentar da traqueia', reference: 'Gray Cap. 53' }
        ],
        examTips: ['Carina: T4-T5 (bifurcacao)', 'Aneis em C: abertos posteriormente (musculo traqueal)', 'Traqueostomia: entre 2o e 3o anel (abaixo do istmo da tireoide)'],
        surgicalNotes: ['Traqueostomia: emergencia em obstrucao de via aerea', 'Cricotireoidostomia: acesso de emergencia'],
        imagingNotes: ['RX cervical lateral: avaliacao da coluna aerea', 'TC: estenose, tumores traqueais'],
        annotations: [
          { position: [0, 0.3, 0.1], label: 'Cartilagem Cricoide', description: 'Unico anel completo da via aerea, nivel C6' },
          { position: [0, -0.2, 0.1], label: 'Carina', description: 'Bifurcacao em bronquios principais D e E, nivel T4-T5' }
        ],
        references: ["Gray's Cap. 53", "Netter Plates 192-194"],
        shape3D: 'trachea', position3D: [0, 0.4, 0], scale3D: 0.5, color3D: '#94a3b8'
      }
    ]
  },
  {
    id: 'digestorio', name: 'Sistema Digestorio', nameEn: 'Digestive System',
    icon: Utensils, color: 'text-amber-500', threeColor: '#f59e0b', bgColor: 'bg-amber-500/10', year: 2,
    description: 'Digestao e absorcao de nutrientes. Tubo digestivo (~9m) + glandulas anexas (figado, pancreas, vesicula biliar). [Guyton Cap. 63-66]',
    relatedSubjects: ['Anatomia', 'Fisiologia', 'Gastroenterologia', 'Cirurgia do Aparelho Digestivo'],
    clinicalRelevance: ['Cancer colorretal: 3o mais comum', 'Cirrose hepatica: 1.5 milhao de mortes/ano', 'Doenca ulcerosa peptica'],
    keyTerms: ['Peristaltismo', 'Bile', 'Enzimas pancreaticas', 'Absorcao intestinal', 'Microbiota'],
    references: ["Gray's Cap. 61-70", "Netter Plates 260-310", "Guyton Cap. 63-66"],
    organs: [
      {
        id: 'figado', name: 'Figado', nameEn: 'Liver', nameLatin: 'Hepar',
        description: 'Maior glandula do corpo (~1500g). Localizado no hipocondrio direito. 4 lobos anatomicos (D, E, caudado, quadrado). 8 segmentos de Couinaud. Dupla vascularizacao: arteria hepatica (30%) e veia porta (70%). [Gray Cap. 65]',
        histology: 'Lobulos hepaticos hexagonais: hepatocitos dispostos em trabeculas radiadas. Triade portal: ramo da veia porta, arteria hepatica e ducto biliar. Sinusoides com celulas de Kupffer. Espaco de Disse. [Junqueira Cap. 16]',
        embryology: 'Diverticulo hepatico do intestino anterior (4a semana). Hematopoiese fetal ate o nascimento. [Langman Cap. 14]',
        bloodSupply: 'Arteria hepatica propria (ramo do tronco celiaco). Veia porta (confluencia da VMS + esplenica). Drenagem: veias hepaticas para VCI.',
        innervation: 'Plexo hepatico (simpatico + vago anterior). Capsula de Glisson: inervacao sensitiva (dor na distensao).',
        functions: ['Metabolismo de carboidratos, lipidios e proteinas', 'Producao de bile (600-1000mL/dia)', 'Sintese de albumina e fatores de coagulacao', 'Detoxificacao e metabolismo de farmacos', 'Armazenamento de glicogenio, ferro e vitaminas'],
        pathologies: [
          { name: 'Cirrose Hepatica', description: 'Fibrose difusa com nodulos de regeneracao. Causas: alcool, hepatites B/C, NASH.', visualChange: 'Figado nodular, reduzido, com fibrose', reference: 'Robbins Cap. 18' },
          { name: 'Hepatocarcinoma', description: 'Tumor hepatico primario mais comum. Associado a cirrose e hepatite B/C. AFP elevada.', visualChange: 'Massa hepatica hipervascular', reference: 'Robbins Cap. 18' },
          { name: 'Esteatose Hepatica', description: 'Acumulo de gordura nos hepatocitos. NAFLD/NASH. Pode progredir para cirrose.', visualChange: 'Figado aumentado, amarelado, brilhante', reference: 'Robbins Cap. 18' }
        ],
        examTips: ['Segmentos de Couinaud: 8 segmentos baseados na vascularizacao', 'Triade portal: veia porta + arteria hepatica + ducto biliar', 'Ligamento falciforme: divide lobos D e E anatomicamente', 'Espaco de Morrison: recesso hepatorrenal (liquido livre)'],
        surgicalNotes: ['Hepatectomia: baseada nos segmentos de Couinaud', 'Transplante hepatico: indicacoes (MELD score)', 'Colecistectomia videolaparoscopica'],
        imagingNotes: ['USG: 1o exame para figado', 'TC trifasica: caracterizacao de lesoes', 'RNM com Primovist: lesoes focais', 'Elastografia: grau de fibrose'],
        annotations: [
          { position: [0.2, 0.1, 0.3], label: 'Lobo Direito', description: 'Maior lobo, segmentos V-VIII de Couinaud' },
          { position: [-0.2, 0.1, 0.2], label: 'Lobo Esquerdo', description: 'Segmentos II-IV de Couinaud' },
          { position: [0, -0.1, 0.3], label: 'Porta Hepatis', description: 'Hilo hepatico: entrada da veia porta e arteria hepatica' },
          { position: [0.3, -0.15, 0.2], label: 'Vesicula Biliar', description: 'Armazena e concentra bile (30-50mL)', clinicalNote: 'Colelitiase: calculos biliares' }
        ],
        references: ["Gray's Cap. 65", "Netter Plates 280-290", "Guyton Cap. 70", "Robbins Cap. 18"],
        shape3D: 'liver', position3D: [0, 0, 0], scale3D: 1, color3D: '#92400e'
      },
      {
        id: 'estomago', name: 'Estomago', nameEn: 'Stomach', nameLatin: 'Gaster/Ventriculus',
        description: 'Orgao muscular em J no epigastrio. Regioes: cardia, fundo, corpo, antro, piloro. Capacidade: 1-1.5L. pH gastrico: 1.5-3.5. [Gray Cap. 62]',
        histology: 'Mucosa com glandulas gastricas: celulas parietais (HCl, fator intrinseco), principais (pepsinogenio), mucosas, enterocromafins (histamina), G (gastrina). [Junqueira Cap. 15]',
        embryology: 'Deriva do intestino anterior. Rotacao de 90 graus no sentido horario (curvatura maior para a esquerda). [Langman Cap. 14]',
        bloodSupply: 'Tronco celiaco: gastrica E, gastrica D, gastroepiploica D e E, gastricas curtas.',
        innervation: 'Vago anterior (Latarjet anterior) e posterior. Simpatico via plexo celiaco.',
        functions: ['Digestao proteica (pepsina)', 'Secrecao de HCl e fator intrinseco', 'Reservatorio alimentar', 'Secrecao de gastrina e grelina'],
        pathologies: [
          { name: 'Ulcera Peptica', description: 'Lesao da mucosa gastrica/duodenal. H. pylori (70-80%) e AINEs. Pode perfurar ou sangrar.', visualChange: 'Cratera na mucosa gastrica', reference: 'Robbins Cap. 17' },
          { name: 'Adenocarcinoma Gastrico', description: 'Tumor maligno mais comum do estomago. Tipos: intestinal (Lauren) e difuso (celulas em anel de sinete).', visualChange: 'Massa ulcerada ou espessamento difuso (linite plastica)', reference: 'Robbins Cap. 17' }
        ],
        examTips: ['Celula parietal: HCl + fator intrinseco (anemia perniciosa se destruida)', 'Vagotomia troncular: reduz secrecao acida', 'Triangulo de Calot: arteria cistica, ducto hepatico comum, ducto cistico'],
        surgicalNotes: ['Gastrectomia subtotal ou total', 'Vagotomia + piloroplastia (historico)', 'Fundoplicatura de Nissen (DRGE)'],
        imagingNotes: ['EDA: padrao-ouro para lesoes gastricas', 'Seriografia: avaliacao funcional', 'TC: estadiamento de neoplasias'],
        annotations: [
          { position: [-0.1, 0.2, 0.2], label: 'Fundo Gastrico', description: 'Porcao superior, acima da incisura cardiaca' },
          { position: [0, 0, 0.25], label: 'Corpo Gastrico', description: 'Maior porcao, celulas parietais e principais' },
          { position: [0.15, -0.2, 0.2], label: 'Antro Pilorico', description: 'Porcao distal, celulas G (gastrina)' }
        ],
        references: ["Gray's Cap. 62", "Netter Plates 265-270", "Robbins Cap. 17"],
        shape3D: 'stomach', position3D: [-0.3, -0.1, 0], scale3D: 0.7, color3D: '#d97706'
      }
    ]
  },
  {
    id: 'musculoesqueletico', name: 'Sistema Musculoesqueletico', nameEn: 'Musculoskeletal System',
    icon: Bone, color: 'text-stone-400', threeColor: '#a8a29e', bgColor: 'bg-stone-400/10', year: 1,
    description: '206 ossos, ~640 musculos esqueleticos. Suporte, protecao, movimento, hematopoiese e reserva mineral. [Gray Cap. 78-120]',
    relatedSubjects: ['Anatomia', 'Ortopedia', 'Reumatologia', 'Fisioterapia'],
    clinicalRelevance: ['Fraturas: trauma mais comum em emergencias', 'Osteoporose: 200 milhoes no mundo', 'Artrose: doenca articular mais prevalente'],
    keyTerms: ['Osteoblastos', 'Osteoclastos', 'Sarcomero', 'Placa motora', 'Articulacao sinovial'],
    references: ["Gray's Cap. 78-120", "Netter Plates 400-500", "Guyton Cap. 7-8"],
    organs: [
      {
        id: 'coluna', name: 'Coluna Vertebral', nameEn: 'Vertebral Column', nameLatin: 'Columna vertebralis',
        description: '33 vertebras: 7 cervicais, 12 toracicas, 5 lombares, 5 sacrais (fusionadas), 4 coccigeas. Curvaturas: lordose cervical e lombar, cifose toracica e sacral. Discos intervertebrais entre C2-S1. [Gray Cap. 42]',
        histology: 'Osso cortical (compacto) e trabecular (esponjoso). Disco: anel fibroso (fibrocartilagem) + nucleo pulposo (gel). Medula ossea vermelha nos corpos vertebrais. [Junqueira Cap. 8]',
        embryology: 'Esclerotomo dos somitos forma as vertebras. Notocorda persiste como nucleo pulposo. Ossificacao endocondral. [Langman Cap. 10]',
        bloodSupply: 'Arterias segmentares (intercostais, lombares). Plexo venoso vertebral interno (Batson).',
        innervation: 'Nervos espinais saem pelos forames intervertebrais. Nervo sinuvertebral: sensibilidade do disco.',
        functions: ['Suporte axial do corpo', 'Protecao da medula espinal', 'Mobilidade do tronco', 'Hematopoiese (medula ossea)'],
        pathologies: [
          { name: 'Hernia de Disco', description: 'Protrusao do nucleo pulposo. L4-L5 e L5-S1 mais comuns. Ciatica.', visualChange: 'Protrusao posterior do disco comprimindo raiz nervosa', reference: 'Gray Cap. 42' },
          { name: 'Espondilolistese', description: 'Deslizamento anterior de uma vertebra sobre outra. L5 sobre S1 mais comum.', visualChange: 'Desalinhamento vertebral anterior', reference: 'Moore Cap. 4' }
        ],
        examTips: ['C1 (Atlas): sem corpo vertebral', 'C2 (Axis): processo odontoide (dens)', 'L3-L4: nivel para puncao lombar em adultos', 'Dermatomos: C5 (deltoides), T4 (mamilos), T10 (umbigo), L4 (joelho)'],
        surgicalNotes: ['Discectomia: remocao do disco herniado', 'Artrodese: fusao vertebral com parafusos pediculares'],
        imagingNotes: ['RX: alinhamento, fraturas', 'RNM: disco, medula, raizes nervosas', 'TC: detalhes osseos, fraturas complexas'],
        annotations: [
          { position: [0, 0.5, -0.1], label: 'Cervical (C1-C7)', description: '7 vertebras, lordose, maior mobilidade' },
          { position: [0, 0.1, -0.15], label: 'Toracica (T1-T12)', description: '12 vertebras, cifose, articulam com costelas' },
          { position: [0, -0.3, -0.1], label: 'Lombar (L1-L5)', description: '5 vertebras, lordose, maiores corpos vertebrais' }
        ],
        references: ["Gray's Cap. 42-43", "Netter Plates 148-158", "Moore Cap. 4"],
        shape3D: 'spine', position3D: [0, 0, -0.2], scale3D: 1, color3D: '#d6d3d1'
      },
      {
        id: 'femur', name: 'Femur', nameEn: 'Femur', nameLatin: 'Os femoris',
        description: 'Maior e mais forte osso do corpo (~48cm). Cabeca articula com acetabulo (quadril). Condilos distais articulam com tibia (joelho). Angulo de inclinacao: 125 graus. [Gray Cap. 80]',
        histology: 'Diafise: osso cortical compacto com sistemas de Havers (osteons). Epifises: osso trabecular com medula vermelha. Periasteo: osteogenico. [Junqueira Cap. 8]',
        embryology: 'Ossificacao endocondral. Centro primario na diafise (8a semana fetal). Centros secundarios nas epifises (pos-natal). Placa de crescimento (fise) ate 18-25 anos. [Langman Cap. 10]',
        bloodSupply: 'Arteria femoral profunda (principal). Arterias circunflexas medial e lateral. Arteria do ligamento redondo (cabeca femoral em criancas).',
        innervation: 'Nervo femoral (L2-L4): quadriceps. Nervo obturatorio (L2-L4): adutores. Nervo ciatico (L4-S3): posteriores da coxa.',
        functions: ['Sustentacao do peso corporal', 'Locomocao', 'Insercao muscular', 'Hematopoiese (medula ossea)'],
        pathologies: [
          { name: 'Fratura do Colo Femoral', description: 'Comum em idosos com osteoporose. Risco de necrose avascular da cabeca femoral.', visualChange: 'Linha de fratura no colo femoral', reference: 'Moore Cap. 5' },
          { name: 'Necrose Avascular', description: 'Morte do osso da cabeca femoral por isquemia. Causas: fratura, corticoides, alcool.', visualChange: 'Colapso e deformidade da cabeca femoral', reference: 'Robbins Cap. 26' }
        ],
        examTips: ['Triangulo de Scarpa: arteria femoral, veia femoral, nervo femoral (NAV lateral para medial)', 'Fratura do colo: rotacao externa e encurtamento do membro', 'Classificacao de Garden: fraturas do colo femoral'],
        surgicalNotes: ['Artroplastia total do quadril (PTQ)', 'Fixacao com DHS ou parafusos canulados', 'Haste intramedular para fraturas diafisarias'],
        imagingNotes: ['RX: AP de bacia + perfil do quadril', 'RNM: necrose avascular precoce', 'TC: fraturas complexas do acetabulo'],
        annotations: [
          { position: [0, 0.4, 0.1], label: 'Cabeca Femoral', description: 'Articula com acetabulo, fovea para ligamento redondo' },
          { position: [0.1, 0.3, 0.1], label: 'Colo Femoral', description: 'Angulo de 125 graus, local comum de fratura em idosos' },
          { position: [0.15, 0.2, 0.1], label: 'Trocanter Maior', description: 'Insercao dos rotadores externos e abdutores' }
        ],
        references: ["Gray's Cap. 80", "Netter Plates 470-480", "Moore Cap. 5"],
        shape3D: 'bone_long', position3D: [0.3, -0.2, 0], scale3D: 0.8, color3D: '#e7e5e4'
      }
    ]
  },
  {
    id: 'urinario', name: 'Sistema Urinario', nameEn: 'Urinary System',
    icon: Droplets, color: 'text-yellow-500', threeColor: '#eab308', bgColor: 'bg-yellow-500/10', year: 2,
    description: 'Filtracao sanguinea, producao de urina, regulacao hidroeletrolitica e acido-basica. Rins, ureteres, bexiga e uretra. [Guyton Cap. 26-31]',
    relatedSubjects: ['Anatomia', 'Fisiologia', 'Nefrologia', 'Urologia'],
    clinicalRelevance: ['DRC: 850 milhoes no mundo', 'Litiase renal: 10% da populacao', 'IRA: complicacao hospitalar frequente'],
    keyTerms: ['Nefron', 'Taxa de filtracao glomerular', 'Sistema renina-angiotensina', 'ADH', 'Aldosterona'],
    references: ["Gray's Cap. 71-74", "Netter Plates 320-340", "Guyton Cap. 26-31"],
    organs: [
      {
        id: 'rins', name: 'Rins', nameEn: 'Kidneys', nameLatin: 'Renes',
        description: 'Orgaos retroperitoneais pares (~150g cada). T12-L3 (direito mais baixo). Cortex, medula (piramides), pelve renal. ~1 milhao de nefrons por rim. Filtram ~180L/dia (TFG ~125mL/min). [Gray Cap. 71]',
        histology: 'Nefron: corpusculo renal (glomerulo + capsula de Bowman) + tubulos (proximal, alca de Henle, distal, coletor). Aparelho justaglomerular: celulas granulares (renina) + macula densa. [Junqueira Cap. 19]',
        embryology: 'Pronefro (3a semana, regressivo) > Mesonefro (4a semana, transitorio) > Metanefro (5a semana, definitivo). Broto ureteral + blastema metanefrico. [Langman Cap. 15]',
        bloodSupply: 'Arteria renal (ramo direto da aorta em L1-L2). Segmentares > interlobares > arqueadas > interlobulares > aferentes > glomerulo > eferentes.',
        innervation: 'Plexo renal (simpatico T10-L1): vasoconstricao, estimula renina. Dor referida em T10-L1 (flanco).',
        functions: ['Filtracao glomerular', 'Reabsorcao tubular (99% do filtrado)', 'Secrecao tubular', 'Producao de eritropoietina', 'Ativacao da vitamina D', 'Regulacao da PA (renina)'],
        pathologies: [
          { name: 'Doenca Renal Cronica', description: 'TFG < 60mL/min por > 3 meses. Estagios 1-5 (KDIGO). Dialise quando TFG < 15.', visualChange: 'Rins reduzidos, corticais finos, perda da diferenciacao corticomedular', reference: 'Robbins Cap. 20' },
          { name: 'Nefrolitiase', description: 'Calculos renais. 80% oxalato de calcio. Colica renal: dor lombar irradiando para virilha.', visualChange: 'Calculos na pelve renal ou ureteres', reference: 'Robbins Cap. 20' },
          { name: 'Glomerulonefrite', description: 'Inflamacao glomerular. Hematuria, proteinuria, edema, HAS. Diversas etiologias.', visualChange: 'Glomerulos inflamados, proliferacao celular', reference: 'Robbins Cap. 20' }
        ],
        examTips: ['TFG normal: 90-120 mL/min/1.73m2', 'Rim direito mais baixo (figado)', 'Arteria renal: anterior a veia renal', 'Dor renal: flanco com irradiacao para virilha (T10-L1)'],
        surgicalNotes: ['Nefrectomia parcial ou radical', 'Transplante renal: fossa iliaca', 'Litotripsia extracorporea (LECO)'],
        imagingNotes: ['USG: 1o exame para rins', 'TC sem contraste: litiase', 'Cintilografia: funcao renal diferencial'],
        annotations: [
          { position: [0, 0.15, 0.2], label: 'Cortex Renal', description: 'Contem glomerulos e tubulos contorcidos' },
          { position: [0, -0.05, 0.2], label: 'Medula Renal', description: 'Piramides renais com alcas de Henle e ductos coletores' },
          { position: [0, -0.2, 0.1], label: 'Pelve Renal', description: 'Coleta urina dos calices, continua como ureter' }
        ],
        references: ["Gray's Cap. 71", "Netter Plates 320-330", "Guyton Cap. 26-29", "Robbins Cap. 20"],
        shape3D: 'kidney', position3D: [0, 0, 0], scale3D: 1, color3D: '#a16207'
      }
    ]
  },
  {
    id: 'endocrino', name: 'Sistema Endocrino', nameEn: 'Endocrine System',
    icon: Zap, color: 'text-emerald-500', threeColor: '#10b981', bgColor: 'bg-emerald-500/10', year: 2,
    description: 'Regulacao hormonal do metabolismo, crescimento, reproducao e homeostase. Glandulas: hipofise, tireoide, paratireoides, adrenais, pancreas endocrino, gonadas. [Guyton Cap. 75-83]',
    relatedSubjects: ['Endocrinologia', 'Fisiologia', 'Bioquimica'],
    clinicalRelevance: ['Diabetes mellitus: 537 milhoes no mundo', 'Hipotireoidismo: 5% da populacao', 'Sindrome de Cushing'],
    keyTerms: ['Eixo hipotalamo-hipofisario', 'Feedback negativo', 'Receptores hormonais', 'Segundo mensageiro'],
    references: ["Gray's Cap. 45-52", "Netter Plates 70-90", "Guyton Cap. 75-83"],
    organs: [
      {
        id: 'tireoide', name: 'Tireoide', nameEn: 'Thyroid', nameLatin: 'Glandula thyroidea',
        description: 'Glandula em borboleta na regiao cervical anterior (C5-T1). 2 lobos + istmo. Peso: 15-25g. Produz T3, T4 e calcitonina. Maior glandula endocrina. [Gray Cap. 45]',
        histology: 'Foliculos tireoidianos: celulas foliculares (T3/T4) ao redor de coloide (tireoglobulina). Celulas parafoliculares C (calcitonina). [Junqueira Cap. 20]',
        embryology: 'Diverticulo tireoidiano do assoalho da faringe (forame cego). Migra caudalmente pelo ducto tireoglosso. Cisto do ducto tireoglosso: massa cervical na linha media. [Langman Cap. 16]',
        bloodSupply: 'Arterias tireoideas superiores (carotida externa) e inferiores (tronco tireocervical). Arteria tireoidea ima (variante, 3%).',
        innervation: 'Nervo laringeo recorrente (posterior a glandula, risco cirurgico). Nervo laringeo superior (ramo externo: cricotireoideo).',
        functions: ['Producao de T3 e T4 (metabolismo basal)', 'Calcitonina (reducao do calcio serico)', 'Regulacao do metabolismo energetico', 'Desenvolvimento neural fetal'],
        pathologies: [
          { name: 'Hipotireoidismo', description: 'Deficiencia de hormonios tireoidianos. Hashimoto (autoimune) mais comum. Fadiga, ganho de peso, bradicardia.', visualChange: 'Glandula aumentada difusamente (bocio)', reference: 'Robbins Cap. 24' },
          { name: 'Carcinoma Papilifero', description: 'Tumor maligno mais comum da tireoide (80%). Bom prognostico. Corpos de psamoma.', visualChange: 'Nodulo tireoidiano solido, hipoecogenico', reference: 'Robbins Cap. 24' },
          { name: 'Doenca de Graves', description: 'Hipertireoidismo autoimune. Anticorpos anti-receptor de TSH (TRAb). Bocio difuso, exoftalmia, mixedema pre-tibial.', visualChange: 'Glandula aumentada difusamente, hipervascular', reference: 'Robbins Cap. 24' }
        ],
        examTips: ['Nervo laringeo recorrente: risco na tireoidectomia (rouquidao)', 'Paratireoides: 4 glandulas posteriores a tireoide', 'TSH: melhor exame de triagem tireoidiana', 'Bethesda: classificacao citologica de nodulos'],
        surgicalNotes: ['Tireoidectomia total ou parcial', 'Identificacao do nervo laringeo recorrente obrigatoria', 'Monitoramento de calcio pos-operatorio (hipoparatireoidismo)'],
        imagingNotes: ['USG cervical: 1o exame para nodulos', 'PAAF guiada por USG: citologia (Bethesda)', 'Cintilografia: nodulo quente vs frio'],
        annotations: [
          { position: [-0.15, 0, 0.15], label: 'Lobo Direito', description: 'Maior lobo em geral' },
          { position: [0.15, 0, 0.15], label: 'Lobo Esquerdo', description: 'Conectado pelo istmo' },
          { position: [0, 0, 0.18], label: 'Istmo', description: 'Conecta os dois lobos, anterior a traqueia (2o-3o anel)' }
        ],
        references: ["Gray's Cap. 45", "Netter Plates 74-78", "Guyton Cap. 77", "Robbins Cap. 24"],
        shape3D: 'thyroid', position3D: [0, 0, 0], scale3D: 1, color3D: '#10b981'
      }
    ]
  },
  {
    id: 'imunologico', name: 'Sistema Imunologico', nameEn: 'Immune System',
    icon: Shield, color: 'text-teal-500', threeColor: '#14b8a6', bgColor: 'bg-teal-500/10', year: 2,
    description: 'Defesa do organismo contra patogenos. Imunidade inata (barreiras, fagocitos, complemento) e adaptativa (linfocitos T e B, anticorpos). [Guyton Cap. 34-35]',
    relatedSubjects: ['Imunologia', 'Patologia', 'Infectologia', 'Hematologia'],
    clinicalRelevance: ['HIV/AIDS: 39 milhoes vivendo com HIV', 'Doencas autoimunes: 5-8% da populacao', 'Imunodeficiencias primarias'],
    keyTerms: ['Linfocitos T e B', 'Anticorpos (IgG, IgM, IgA, IgE)', 'MHC/HLA', 'Complemento', 'Citocinas'],
    references: ["Gray's Cap. 71-77", "Robbins Cap. 6-7", "Guyton Cap. 34-35"],
    organs: [
      {
        id: 'baco', name: 'Baco', nameEn: 'Spleen', nameLatin: 'Lien/Splen',
        description: 'Maior orgao linfoide (~150g). Hipocondrio esquerdo, entre 9a-11a costelas. Polpa vermelha (filtracao sanguinea) e polpa branca (funcao imune). Nao e palpavel normalmente. [Gray Cap. 73]',
        histology: 'Polpa branca: bainha linfoide periarteriolar (PALS, celulas T) + foliculos (celulas B). Polpa vermelha: sinusoides esplenicios + cordoes de Billroth. Zona marginal. [Junqueira Cap. 14]',
        embryology: 'Deriva do mesoderma do mesentero dorsal. Hematopoiese fetal ate o 5o mes. [Langman Cap. 14]',
        bloodSupply: 'Arteria esplenica (maior ramo do tronco celiaco). Veia esplenica drena para veia porta.',
        innervation: 'Plexo esplenico (simpatico). Sem inervacao parassimpatica significativa.',
        functions: ['Filtracao de hemacias velhas/defeituosas', 'Producao de anticorpos (polpa branca)', 'Reservatorio de plaquetas (30%)', 'Hematopoiese extramedular (se necessario)', 'Fagocitose de bacterias encapsuladas'],
        pathologies: [
          { name: 'Esplenomegalia', description: 'Aumento do baco. Causas: hipertensao portal, infeccoes, doencas hematologicas.', visualChange: 'Baco aumentado, ultrapassando rebordo costal', reference: 'Robbins Cap. 13' },
          { name: 'Ruptura Esplenica', description: 'Trauma abdominal (mais comum). Choque hemorragico. Esplenectomia de emergencia.', visualChange: 'Laceracoes no parenquima esplenico', reference: 'Moore Cap. 2' }
        ],
        examTips: ['Baco palpavel = esplenomegalia', 'Pos-esplenectomia: risco de infeccao por encapsulados (pneumococo, meningococo, H. influenzae)', 'Corpos de Howell-Jolly: inclusoes eritrocitarias pos-esplenectomia'],
        surgicalNotes: ['Esplenectomia: vacinacao previa obrigatoria', 'Esplenectomia parcial em criancas quando possivel'],
        imagingNotes: ['USG: tamanho e ecogenicidade', 'TC com contraste: trauma, lesoes focais'],
        annotations: [
          { position: [0, 0.1, 0.2], label: 'Polpa Branca', description: 'Tecido linfoide, producao de anticorpos' },
          { position: [0, -0.1, 0.2], label: 'Polpa Vermelha', description: 'Sinusoides, filtracao de hemacias' }
        ],
        references: ["Gray's Cap. 73", "Netter Plates 290-295", "Robbins Cap. 13"],
        shape3D: 'spleen', position3D: [0, 0, 0], scale3D: 0.8, color3D: '#14b8a6'
      }
    ]
  },
  {
    id: 'reprodutor_masculino', name: 'Sistema Reprodutor Masculino', nameEn: 'Male Reproductive System',
    icon: Activity, color: 'text-blue-500', threeColor: '#3b82f6', bgColor: 'bg-blue-500/10', year: 3,
    description: 'Producao de espermatozoides e hormonios masculinos. Testiculos, epididimo, ducto deferente, vesiculas seminais, prostata, penis. [Gray Cap. 75-77]',
    relatedSubjects: ['Urologia', 'Anatomia', 'Endocrinologia'],
    clinicalRelevance: ['Cancer de prostata: mais comum em homens', 'Hiperplasia prostatica benigna: 50% aos 50 anos', 'Infertilidade masculina: 40-50% dos casais inferteis'],
    keyTerms: ['Espermatogenese', 'Testosterona', 'PSA', 'Celulas de Leydig', 'Celulas de Sertoli'],
    references: ["Gray's Cap. 75-77", "Netter Plates 360-380", "Guyton Cap. 80-81"],
    organs: [
      {
        id: 'prostata', name: 'Prostata', nameEn: 'Prostate', nameLatin: 'Prostata',
        description: 'Glandula fibromuscular (~20g). Abaixo da bexiga, envolve a uretra prostatica. Zonas: periferica (70%, cancer), transicional (HPB), central. Secrecao: 30% do liquido seminal. [Gray Cap. 77]',
        histology: 'Glandulas tubuloalveolares em estroma fibromuscular. Epithelio colunar secretor. Corpora amilacea (concrecoes prostaticas). [Junqueira Cap. 21]',
        embryology: 'Brotamentos endodermicos do seio urogenital sob influencia da diidrotestosterona (DHT). Semana 10-12. [Langman Cap. 15]',
        bloodSupply: 'Arterias vesicais inferiores e retais medias. Plexo venoso prostatico (Santorini) drena para veias iliacas internas.',
        innervation: 'Plexo hipogastrico inferior. Nervos cavernosos (laterais a prostata - risco na prostatectomia).',
        functions: ['Secrecao prostatica (PSA, acido citrico, zinco)', 'Liquefacao do semen', 'Esfincteriano (uretra prostatica)'],
        pathologies: [
          { name: 'Hiperplasia Prostatica Benigna', description: 'Aumento da zona transicional. Sintomas obstrutivos urinarios (LUTS). Comum apos 50 anos.', visualChange: 'Aumento nodular da zona transicional', reference: 'Robbins Cap. 21' },
          { name: 'Adenocarcinoma de Prostata', description: 'Cancer mais comum em homens. Zona periferica. Gleason score para graduacao. PSA elevado.', visualChange: 'Nodulo duro na zona periferica ao toque retal', reference: 'Robbins Cap. 21' }
        ],
        examTips: ['Zona periferica: 70% do tecido, local do cancer', 'Zona transicional: HPB', 'PSA > 4 ng/mL: investigar', 'Gleason: soma dos 2 padroes mais prevalentes (2-10)'],
        surgicalNotes: ['Prostatectomia radical: cancer localizado', 'RTU-P: HPB sintomatica', 'Preservacao dos feixes neurovasculares: funcao eretil'],
        imagingNotes: ['RNM multiparametrica: padrao-ouro', 'USG transretal: biopsia guiada', 'PET-PSMA: estadiamento'],
        annotations: [
          { position: [0, 0.1, 0.15], label: 'Zona Periferica', description: '70% do tecido, local mais comum do cancer' },
          { position: [0, 0, 0.1], label: 'Zona Transicional', description: 'Local da HPB, envolve uretra prostatica' }
        ],
        references: ["Gray's Cap. 77", "Netter Plates 370-375", "Robbins Cap. 21"],
        shape3D: 'gland', position3D: [0, 0, 0], scale3D: 0.7, color3D: '#3b82f6'
      }
    ]
  },
  {
    id: 'reprodutor_feminino', name: 'Sistema Reprodutor Feminino', nameEn: 'Female Reproductive System',
    icon: Baby, color: 'text-pink-500', threeColor: '#ec4899', bgColor: 'bg-pink-500/10', year: 3,
    description: 'Producao de ovocitos, gestacao e parto. Ovarios, tubas uterinas, utero, vagina, vulva. Ciclo menstrual de ~28 dias. [Gray Cap. 75-77]',
    relatedSubjects: ['Ginecologia', 'Obstetricia', 'Anatomia', 'Endocrinologia'],
    clinicalRelevance: ['Cancer de mama: mais comum em mulheres', 'Cancer de colo uterino: HPV-relacionado', 'Endometriose: 10% das mulheres'],
    keyTerms: ['Ovulacao', 'Ciclo menstrual', 'Estrogeno', 'Progesterona', 'hCG'],
    references: ["Gray's Cap. 75-77", "Netter Plates 350-370", "Williams Obstetrics 26th Ed"],
    organs: [
      {
        id: 'utero', name: 'Utero', nameEn: 'Uterus', nameLatin: 'Uterus',
        description: 'Orgao muscular piriforme na pelve. Partes: fundo, corpo, istmo, colo (cervix). Tamanho: 7-8cm x 5cm x 2.5cm. Anteversao e anteflexao (posicao normal). [Gray Cap. 77]',
        histology: 'Endometrio: epithelio + estroma (funcional e basal). Miometrio: 3 camadas de musculo liso. Perimetrio: serosa peritoneal. Endometrio cicla sob influencia hormonal. [Junqueira Cap. 22]',
        embryology: 'Fusao dos ductos paramesonefricos (Mullerianos) na linha media. Septo reabsorvido. Anomalias: utero bicorno, septado, didelfo. [Langman Cap. 15]',
        bloodSupply: 'Arteria uterina (ramo da iliaca interna). Cruza o ureter ("agua passa por baixo da ponte"). Arteria ovarica (ramo direto da aorta).',
        innervation: 'Plexo hipogastrico inferior. Dor do corpo: T10-L1 (simpatico). Dor do colo: S2-S4 (parassimpatico).',
        functions: ['Implantacao do embriao', 'Nutricao fetal (placenta)', 'Contracao no parto', 'Menstruacao'],
        pathologies: [
          { name: 'Leiomioma Uterino', description: 'Tumor benigno mais comum do trato genital feminino. Dependente de estrogeno. Sangramento uterino anormal.', visualChange: 'Nodulos miometriais bem delimitados', reference: 'Robbins Cap. 22' },
          { name: 'Adenocarcinoma Endometrial', description: 'Cancer ginecologico mais comum em paises desenvolvidos. Tipo I: estrogeno-dependente (endometrioide).', visualChange: 'Espessamento endometrial irregular', reference: 'Robbins Cap. 22' },
          { name: 'Endometriose', description: 'Tecido endometrial fora do utero. Dismenorreia, dispareunia, infertilidade. Ovarios mais acometidos.', visualChange: 'Implantes endometrioticos em peritonio e ovarios', reference: 'Robbins Cap. 22' }
        ],
        examTips: ['Arteria uterina cruza o ureter (risco cirurgico)', 'Ligamento largo: peritoneo que envolve utero', 'Ligamento redondo: mantem anteversao', 'Fundo de saco de Douglas: ponto mais baixo da cavidade peritoneal feminina'],
        surgicalNotes: ['Histerectomia total ou subtotal', 'Miomectomia: preserva fertilidade', 'Cesariana: incisao de Pfannenstiel'],
        imagingNotes: ['USG transvaginal: 1o exame', 'RNM: miomas, adenomiose, estadiamento', 'Histeroscopia: avaliacao da cavidade'],
        annotations: [
          { position: [0, 0.2, 0.15], label: 'Fundo Uterino', description: 'Porcao superior, acima da insercao das tubas' },
          { position: [0, 0, 0.15], label: 'Corpo Uterino', description: 'Maior porcao, miometrio espesso' },
          { position: [0, -0.25, 0.1], label: 'Colo Uterino', description: 'Porcao inferior, canal cervical, juncao escamocolunar (JEC)' }
        ],
        references: ["Gray's Cap. 77", "Netter Plates 355-365", "Robbins Cap. 22", "Williams Obstetrics Cap. 2"],
        shape3D: 'uterus', position3D: [0, 0, 0], scale3D: 0.8, color3D: '#ec4899'
      }
    ]
  },
  {
    id: 'tegumentar', name: 'Sistema Tegumentar', nameEn: 'Integumentary System',
    icon: Eye, color: 'text-orange-500', threeColor: '#f97316', bgColor: 'bg-orange-500/10', year: 1,
    description: 'Maior orgao do corpo (~1.7m2, 4-5kg). Protecao, termorregulacao, sensacao, sintese de vitamina D. Epiderme, derme, hipoderme + anexos (pelos, unhas, glandulas). [Gray Cap. 7]',
    relatedSubjects: ['Dermatologia', 'Histologia', 'Cirurgia Plastica'],
    clinicalRelevance: ['Melanoma: cancer de pele mais letal', 'Psoríase: 2-3% da populacao', 'Queimaduras: regra dos 9 de Wallace'],
    keyTerms: ['Queratinizacao', 'Melanocitos', 'Celulas de Langerhans', 'Derme papilar e reticular'],
    references: ["Gray's Cap. 7", "Junqueira Cap. 18", "Robbins Cap. 25"],
    organs: [
      {
        id: 'pele', name: 'Pele', nameEn: 'Skin', nameLatin: 'Cutis',
        description: 'Epiderme (5 camadas: basal, espinhosa, granulosa, lucida, cornea) + Derme (papilar e reticular) + Hipoderme (tecido adiposo). Espessura: 0.5mm (palpebra) a 4mm (dorso). [Gray Cap. 7]',
        histology: 'Epiderme: queratinocitos (90%), melanocitos (cor), celulas de Langerhans (imune), celulas de Merkel (tato). Derme: colageno tipo I (80%), fibras elasticas, vasos, nervos. [Junqueira Cap. 18]',
        embryology: 'Epiderme: ectoderma superficial. Derme: mesoderma (tronco/membros) e crista neural (face). Melanocitos: crista neural. [Langman Cap. 18]',
        bloodSupply: 'Plexo subdermico e subpapilar. Anastomoses arteriovenosas (termorregulacao, especialmente em extremidades).',
        innervation: 'Mecanorreceptores: Meissner (tato fino), Pacini (pressao/vibracao), Ruffini (estiramento), Merkel (pressao sustentada). Terminacoes nervosas livres (dor, temperatura).',
        functions: ['Barreira fisica e imunologica', 'Termorregulacao (sudorese, vasodilatacao)', 'Sensacao (tato, dor, temperatura, pressao)', 'Sintese de vitamina D3 (UV-B)', 'Protecao contra UV (melanina)'],
        pathologies: [
          { name: 'Melanoma', description: 'Neoplasia maligna de melanocitos. ABCDE: Assimetria, Bordas irregulares, Cor variada, Diametro > 6mm, Evolucao.', visualChange: 'Lesao pigmentada irregular, assimetrica', reference: 'Robbins Cap. 25' },
          { name: 'Carcinoma Basocelular', description: 'Cancer de pele mais comum (80%). Crescimento lento, raro metastatizar. Lesao perola com telangiectasias.', visualChange: 'Nodulo perolado com borda elevada', reference: 'Robbins Cap. 25' }
        ],
        examTips: ['Regra dos 9 de Wallace: cabeca 9%, MMSS 9% cada, MMII 18% cada, tronco anterior 18%, posterior 18%, perineo 1%', 'Langer lines: linhas de tensao da pele (incisoes cirurgicas)', 'Melanocitos: 1 para cada 10-15 queratinocitos'],
        surgicalNotes: ['Biopsia excisional: lesoes suspeitas', 'Enxertos de pele: parcial ou total', 'Retalhos: rotacao, avanco, transposicao'],
        imagingNotes: ['Dermatoscopia: avaliacao de lesoes pigmentadas', 'USG de pele: profundidade de lesoes'],
        annotations: [
          { position: [0, 0.15, 0.2], label: 'Epiderme', description: '5 camadas, avascular, renovacao a cada 28 dias' },
          { position: [0, 0, 0.2], label: 'Derme', description: 'Tecido conjuntivo, vasos, nervos, anexos' },
          { position: [0, -0.15, 0.2], label: 'Hipoderme', description: 'Tecido adiposo, isolamento termico, reserva energetica' }
        ],
        references: ["Gray's Cap. 7", "Junqueira Cap. 18", "Robbins Cap. 25"],
        shape3D: 'skin_layers', position3D: [0, 0, 0], scale3D: 1, color3D: '#f97316'
      }
    ]
  },
  {
    id: 'linfatico', name: 'Sistema Linfatico', nameEn: 'Lymphatic System',
    icon: Droplets, color: 'text-lime-500', threeColor: '#84cc16', bgColor: 'bg-lime-500/10', year: 2,
    description: 'Drenagem do liquido intersticial, transporte de lipidios, defesa imunologica. Vasos linfaticos, linfonodos, timo, tonsilas, placas de Peyer. [Gray Cap. 71-74]',
    relatedSubjects: ['Imunologia', 'Oncologia', 'Cirurgia'],
    clinicalRelevance: ['Linfoma: Hodgkin e nao-Hodgkin', 'Linfedema: pos-mastectomia', 'Metastases linfonodais'],
    keyTerms: ['Linfa', 'Ducto toracico', 'Linfonodo sentinela', 'Celulas dendriticas'],
    references: ["Gray's Cap. 71-74", "Netter Plates 230-240", "Robbins Cap. 13"],
    organs: [
      {
        id: 'linfonodos', name: 'Linfonodos', nameEn: 'Lymph Nodes', nameLatin: 'Nodi lymphoidei',
        description: 'Orgaos encapsulados (0.1-2.5cm) distribuidos ao longo dos vasos linfaticos. ~600 no corpo. Cadeias: cervicais, axilares, inguinais, mediastinais, mesentericos. Filtracao da linfa e ativacao imune. [Gray Cap. 72]',
        histology: 'Cortex: foliculos linfoides (celulas B), centros germinativos (ativacao). Paracortex: celulas T. Medula: cordoes medulares (plasmocitos) e seios medulares. [Junqueira Cap. 14]',
        embryology: 'Derivam de sacos linfaticos mesodermicos. Colonizados por linfocitos do timo e medula ossea. [Langman Cap. 13]',
        bloodSupply: 'Arterias e veias hilares. Vasos linfaticos aferentes (capsula) e eferentes (hilo).',
        innervation: 'Fibras simpaticas perivasculares.',
        functions: ['Filtracao da linfa', 'Apresentacao de antigenos', 'Ativacao de linfocitos T e B', 'Producao de anticorpos', 'Vigilancia imunologica contra metastases'],
        pathologies: [
          { name: 'Linfadenopatia Reativa', description: 'Aumento benigno por infeccao ou inflamacao. Doloroso, movel, consistencia elastica.', visualChange: 'Linfonodo aumentado com centros germinativos proeminentes', reference: 'Robbins Cap. 13' },
          { name: 'Linfoma de Hodgkin', description: 'Celulas de Reed-Sternberg. Pico bimodal (20-30 e >50 anos). Disseminacao contígua. Sintomas B.', visualChange: 'Linfonodo com arquitetura apagada, celulas de Reed-Sternberg', reference: 'Robbins Cap. 13' }
        ],
        examTips: ['Linfonodo sentinela: 1o linfonodo de drenagem de um tumor', 'Virchow (supraclavicular E): metastase gastrica', 'Sister Mary Joseph: nodulo umbilical (metastase peritoneal)', 'Linfadenopatia > 2cm, duro, fixo, indolor = suspeita de malignidade'],
        surgicalNotes: ['Biopsia excisional: diagnostico de linfoma', 'Pesquisa de linfonodo sentinela: melanoma e mama', 'Esvaziamento cervical: cancer de cabeca e pescoco'],
        imagingNotes: ['USG: avaliacao de linfonodos superficiais', 'TC/PET-CT: estadiamento de linfomas', 'RNM: linfonodos pelvicos e retroperitoneais'],
        annotations: [
          { position: [0, 0.1, 0.15], label: 'Cortex', description: 'Foliculos linfoides com celulas B' },
          { position: [0, 0, 0.15], label: 'Paracortex', description: 'Zona T-dependente, celulas dendriticas' },
          { position: [0, -0.1, 0.1], label: 'Medula', description: 'Cordoes medulares com plasmocitos' }
        ],
        references: ["Gray's Cap. 72", "Netter Plates 230-235", "Robbins Cap. 13"],
        shape3D: 'lymphnode', position3D: [0, 0, 0], scale3D: 0.6, color3D: '#84cc16'
      }
    ]
  }
];
// === QUIZ QUESTIONS ===
const QUIZ_QUESTIONS: QuizQuestion[] = [
  { organId: 'coracao', question: 'Qual estrutura e o marcapasso natural do coracao?', options: ['No atrioventricular', 'No sinusal (sinoatrial)', 'Feixe de His', 'Fibras de Purkinje'], correctIndex: 1, explanation: 'O no sinusal (Keith-Flack), localizado no atrio direito, e o marcapasso natural com frequencia de 60-100 bpm. [Guyton Cap. 10]' },
  { organId: 'coracao', question: 'Qual arteria coronaria irriga a parede anterior do VE?', options: ['Coronaria direita', 'Circunflexa', 'Descendente anterior (DA)', 'Descendente posterior'], correctIndex: 2, explanation: 'A DA (ramo da coronaria esquerda) irriga a parede anterior do VE e 2/3 anteriores do septo IV. [Netter Plate 216]' },
  { organId: 'coracao', question: 'Quantas cuspides tem a valva mitral?', options: ['1', '2', '3', '4'], correctIndex: 1, explanation: 'A valva mitral (bicuspide) tem 2 cuspides: anterior e posterior. E a unica valva com 2 cuspides. [Gray Cap. 56]' },
  { organId: 'cerebro', question: 'Qual arteria e mais acometida no AVC isquemico?', options: ['ACA', 'ACM', 'ACP', 'Basilar'], correctIndex: 1, explanation: 'A ACM (arteria cerebral media) irriga a face lateral do hemisferio e e a mais acometida no AVC isquemico. [Netter Plate 140]' },
  { organId: 'cerebro', question: 'Onde se localiza a area de Broca?', options: ['Lobo temporal', 'Lobo parietal', 'Lobo frontal (areas 44-45)', 'Lobo occipital'], correctIndex: 2, explanation: 'Area de Broca: giro frontal inferior (areas 44-45 de Brodmann). Lesao causa afasia motora (nao-fluente). [Guyton Cap. 47]' },
  { organId: 'pulmoes', question: 'Quantos lobos tem o pulmao direito?', options: ['1', '2', '3', '4'], correctIndex: 2, explanation: 'Pulmao direito: 3 lobos (superior, medio, inferior) separados por 2 fissuras (horizontal e obliqua). [Gray Cap. 54]' },
  { organId: 'pulmoes', question: 'A partir de quantas semanas o feto produz surfactante?', options: ['16 semanas', '20 semanas', '24 semanas', '32 semanas'], correctIndex: 2, explanation: 'Pneumocitos tipo II produzem surfactante a partir de 24 semanas. Maturidade pulmonar adequada ~35 semanas. [Langman Cap. 14]' },
  { organId: 'figado', question: 'Qual a principal fonte de sangue para o figado?', options: ['Arteria hepatica (100%)', 'Veia porta (70%)', 'Veia cava inferior', 'Arteria mesenterica superior'], correctIndex: 1, explanation: 'A veia porta fornece ~70% do fluxo sanguineo hepatico (sangue rico em nutrientes do TGI). A arteria hepatica fornece ~30% (sangue oxigenado). [Gray Cap. 65]' },
  { organId: 'rins', question: 'Qual a TFG normal em adultos?', options: ['30-60 mL/min', '60-90 mL/min', '90-120 mL/min', '120-180 mL/min'], correctIndex: 2, explanation: 'TFG normal: 90-120 mL/min/1.73m2. Abaixo de 60 por mais de 3 meses = DRC. [Guyton Cap. 26]' },
  { organId: 'rins', question: 'Onde e produzida a renina?', options: ['Tubulo proximal', 'Alca de Henle', 'Aparelho justaglomerular', 'Ducto coletor'], correctIndex: 2, explanation: 'Renina e produzida pelas celulas granulares (justaglomerulares) da arteriola aferente, em resposta a hipotensao, hiponatremia ou estimulo simpatico. [Guyton Cap. 26]' },
  { organId: 'tireoide', question: 'Qual nervo esta em risco na tireoidectomia?', options: ['Nervo frenico', 'Nervo vago', 'Nervo laringeo recorrente', 'Nervo hipoglosso'], correctIndex: 2, explanation: 'O nervo laringeo recorrente passa posterior a tireoide. Lesao causa rouquidao (paralisia de corda vocal). [Gray Cap. 45]' },
  { organId: 'coluna', question: 'Em que nivel termina a medula espinal no adulto?', options: ['T12', 'L1-L2', 'L3-L4', 'S1'], correctIndex: 1, explanation: 'O cone medular termina em L1-L2 no adulto. Abaixo disso: cauda equina. Puncao lombar: L3-L4 ou L4-L5. [Gray Cap. 44]' },
  { organId: 'baco', question: 'Qual a principal consequencia da esplenectomia?', options: ['Anemia', 'Trombocitopenia', 'Risco de infeccao por encapsulados', 'Leucopenia'], correctIndex: 2, explanation: 'Pos-esplenectomia: risco aumentado de infeccao por bacterias encapsuladas (S. pneumoniae, N. meningitidis, H. influenzae). Vacinacao obrigatoria. [Robbins Cap. 13]' },
  { organId: 'utero', question: 'A arteria uterina cruza qual estrutura?', options: ['Nervo obturatorio', 'Ureter', 'Veia iliaca', 'Nervo pudendo'], correctIndex: 1, explanation: 'A arteria uterina cruza o ureter ("agua passa por baixo da ponte"). Risco de lesao ureteral na histerectomia. [Moore Cap. 3]' },
  { organId: 'pele', question: 'Qual a regra para estimar area de queimadura?', options: ['Regra dos 5', 'Regra dos 7', 'Regra dos 9 de Wallace', 'Regra dos 12'], correctIndex: 2, explanation: 'Regra dos 9 de Wallace: cabeca 9%, cada MMSS 9%, cada MMII 18%, tronco anterior 18%, posterior 18%, perineo 1%. [Gray Cap. 7]' },
  { organId: 'prostata', question: 'Em qual zona da prostata ocorre mais frequentemente o cancer?', options: ['Zona central', 'Zona transicional', 'Zona periferica', 'Zona anterior'], correctIndex: 2, explanation: 'A zona periferica contem ~70% do tecido prostatico e e o local mais comum do adenocarcinoma (70-80% dos casos). [Robbins Cap. 21]' },
  { organId: 'estomago', question: 'Qual celula gastrica produz o fator intrinseco?', options: ['Celula principal', 'Celula parietal', 'Celula G', 'Celula mucosa'], correctIndex: 1, explanation: 'A celula parietal produz HCl e fator intrinseco (essencial para absorcao de B12 no ileo). Destruicao autoimune = anemia perniciosa. [Guyton Cap. 64]' },
  { organId: 'linfonodos', question: 'O linfonodo de Virchow (supraclavicular esquerdo) sugere metastase de qual orgao?', options: ['Pulmao', 'Mama', 'Estomago', 'Prostata'], correctIndex: 2, explanation: 'O linfonodo de Virchow (supraclavicular esquerdo) e classicamente associado a metastase de cancer gastrico, via ducto toracico. [Robbins Cap. 13]' },
];
// === 3D MODEL COMPONENTS ===

// Full Body Silhouette for Dissection Mode
function FullBodyModel({ visibleLayers, onLayerClick }: { visibleLayers: string[]; onLayerClick: (layer: string) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => { if (groupRef.current) groupRef.current.rotation.y += 0.002; });

  return (
    <group ref={groupRef}>
      {/* Skeleton layer */}
      {visibleLayers.includes('skeleton') && (
        <group>
          {/* Skull */}
          <mesh position={[0, 1.55, 0]} onClick={() => onLayerClick('skeleton')}>
            <sphereGeometry args={[0.12, 24, 24]} />
            <meshPhysicalMaterial color="#e8e4df" roughness={0.6} metalness={0.1} transparent opacity={0.9} />
          </mesh>
          {/* Spine */}
          {Array.from({ length: 20 }, (_, i) => (
            <mesh key={`vert-${i}`} position={[0, 1.35 - i * 0.055, -0.03]}>
              <boxGeometry args={[0.04, 0.04, 0.04]} />
              <meshPhysicalMaterial color="#d6d3d1" roughness={0.5} metalness={0.1} transparent opacity={0.85} />
            </mesh>
          ))}
          {/* Ribcage */}
          {Array.from({ length: 6 }, (_, i) => (
            <group key={`rib-${i}`}>
              <mesh position={[0.08, 1.2 - i * 0.06, 0.02]} rotation={[0, 0, 0.3 + i * 0.05]}>
                <torusGeometry args={[0.08 + i * 0.005, 0.008, 8, 16, Math.PI * 0.7]} />
                <meshPhysicalMaterial color="#d6d3d1" roughness={0.5} transparent opacity={0.8} />
              </mesh>
              <mesh position={[-0.08, 1.2 - i * 0.06, 0.02]} rotation={[0, Math.PI, 0.3 + i * 0.05]}>
                <torusGeometry args={[0.08 + i * 0.005, 0.008, 8, 16, Math.PI * 0.7]} />
                <meshPhysicalMaterial color="#d6d3d1" roughness={0.5} transparent opacity={0.8} />
              </mesh>
            </group>
          ))}
          {/* Pelvis */}
          <mesh position={[0, 0.2, 0]}>
            <torusGeometry args={[0.12, 0.025, 8, 16, Math.PI]} />
            <meshPhysicalMaterial color="#d6d3d1" roughness={0.5} transparent opacity={0.85} />
          </mesh>
          {/* Femurs */}
          <mesh position={[0.08, -0.15, 0]}><cylinderGeometry args={[0.02, 0.025, 0.5, 12]} /><meshPhysicalMaterial color="#e8e4df" roughness={0.5} transparent opacity={0.85} /></mesh>
          <mesh position={[-0.08, -0.15, 0]}><cylinderGeometry args={[0.02, 0.025, 0.5, 12]} /><meshPhysicalMaterial color="#e8e4df" roughness={0.5} transparent opacity={0.85} /></mesh>
          {/* Tibias */}
          <mesh position={[0.08, -0.65, 0]}><cylinderGeometry args={[0.018, 0.02, 0.45, 12]} /><meshPhysicalMaterial color="#e8e4df" roughness={0.5} transparent opacity={0.85} /></mesh>
          <mesh position={[-0.08, -0.65, 0]}><cylinderGeometry args={[0.018, 0.02, 0.45, 12]} /><meshPhysicalMaterial color="#e8e4df" roughness={0.5} transparent opacity={0.85} /></mesh>
          {/* Humeri */}
          <mesh position={[0.2, 1.1, 0]} rotation={[0, 0, 0.15]}><cylinderGeometry args={[0.015, 0.018, 0.35, 12]} /><meshPhysicalMaterial color="#e8e4df" roughness={0.5} transparent opacity={0.85} /></mesh>
          <mesh position={[-0.2, 1.1, 0]} rotation={[0, 0, -0.15]}><cylinderGeometry args={[0.015, 0.018, 0.35, 12]} /><meshPhysicalMaterial color="#e8e4df" roughness={0.5} transparent opacity={0.85} /></mesh>
          {/* Forearms */}
          <mesh position={[0.23, 0.75, 0]}><cylinderGeometry args={[0.012, 0.015, 0.35, 12]} /><meshPhysicalMaterial color="#e8e4df" roughness={0.5} transparent opacity={0.85} /></mesh>
          <mesh position={[-0.23, 0.75, 0]}><cylinderGeometry args={[0.012, 0.015, 0.35, 12]} /><meshPhysicalMaterial color="#e8e4df" roughness={0.5} transparent opacity={0.85} /></mesh>
        </group>
      )}
      {/* Vessels layer */}
      {visibleLayers.includes('vessels') && (
        <group>
          {/* Aorta */}
          <mesh position={[0.02, 1.15, 0.02]}><cylinderGeometry args={[0.015, 0.015, 0.2, 12]} /><meshPhysicalMaterial color="#dc2626" roughness={0.3} transparent opacity={0.7} /></mesh>
          <mesh position={[0.02, 0.8, 0.01]}><cylinderGeometry args={[0.012, 0.015, 0.5, 12]} /><meshPhysicalMaterial color="#dc2626" roughness={0.3} transparent opacity={0.7} /></mesh>
          {/* Carotids */}
          <mesh position={[0.04, 1.4, 0.02]}><cylinderGeometry args={[0.008, 0.008, 0.2, 8]} /><meshPhysicalMaterial color="#dc2626" roughness={0.3} transparent opacity={0.65} /></mesh>
          <mesh position={[-0.04, 1.4, 0.02]}><cylinderGeometry args={[0.008, 0.008, 0.2, 8]} /><meshPhysicalMaterial color="#dc2626" roughness={0.3} transparent opacity={0.65} /></mesh>
          {/* Vena cava */}
          <mesh position={[-0.02, 0.9, -0.01]}><cylinderGeometry args={[0.013, 0.013, 0.6, 12]} /><meshPhysicalMaterial color="#3b82f6" roughness={0.3} transparent opacity={0.6} /></mesh>
          {/* Iliac arteries */}
          <mesh position={[0.06, 0.35, 0]} rotation={[0, 0, 0.2]}><cylinderGeometry args={[0.01, 0.01, 0.25, 8]} /><meshPhysicalMaterial color="#dc2626" roughness={0.3} transparent opacity={0.6} /></mesh>
          <mesh position={[-0.06, 0.35, 0]} rotation={[0, 0, -0.2]}><cylinderGeometry args={[0.01, 0.01, 0.25, 8]} /><meshPhysicalMaterial color="#dc2626" roughness={0.3} transparent opacity={0.6} /></mesh>
        </group>
      )}
      {/* Organs layer */}
      {visibleLayers.includes('organs') && (
        <group>
          {/* Heart */}
          <mesh position={[0.03, 1.12, 0.04]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshPhysicalMaterial color="#ef4444" roughness={0.3} metalness={0.1} transparent opacity={0.85} />
          </mesh>
          {/* Lungs */}
          <mesh position={[0.1, 1.15, 0.02]}><sphereGeometry args={[0.07, 16, 16]} /><meshPhysicalMaterial color="#f472b6" roughness={0.4} transparent opacity={0.6} /></mesh>
          <mesh position={[-0.07, 1.15, 0.02]}><sphereGeometry args={[0.065, 16, 16]} /><meshPhysicalMaterial color="#f472b6" roughness={0.4} transparent opacity={0.6} /></mesh>
          {/* Liver */}
          <mesh position={[0.08, 0.9, 0.03]}><dodecahedronGeometry args={[0.07, 1]} /><meshPhysicalMaterial color="#92400e" roughness={0.4} transparent opacity={0.8} /></mesh>
          {/* Stomach */}
          <mesh position={[-0.04, 0.88, 0.04]}><sphereGeometry args={[0.045, 16, 16]} /><meshPhysicalMaterial color="#d97706" roughness={0.4} transparent opacity={0.75} /></mesh>
          {/* Kidneys */}
          <mesh position={[0.08, 0.7, -0.02]}><capsuleGeometry args={[0.02, 0.03, 8, 16]} /><meshPhysicalMaterial color="#a16207" roughness={0.4} transparent opacity={0.8} /></mesh>
          <mesh position={[-0.08, 0.72, -0.02]}><capsuleGeometry args={[0.02, 0.03, 8, 16]} /><meshPhysicalMaterial color="#a16207" roughness={0.4} transparent opacity={0.8} /></mesh>
          {/* Intestines */}
          <mesh position={[0, 0.55, 0.03]}><torusGeometry args={[0.06, 0.02, 8, 16]} /><meshPhysicalMaterial color="#fbbf24" roughness={0.5} transparent opacity={0.6} /></mesh>
          {/* Bladder */}
          <mesh position={[0, 0.28, 0.03]}><sphereGeometry args={[0.03, 12, 12]} /><meshPhysicalMaterial color="#fde047" roughness={0.4} transparent opacity={0.7} /></mesh>
          {/* Brain */}
          <mesh position={[0, 1.6, 0]}><sphereGeometry args={[0.09, 20, 20]} /><meshPhysicalMaterial color="#c084fc" roughness={0.5} transparent opacity={0.7} /></mesh>
        </group>
      )}
      {/* Muscle layer */}
      {visibleLayers.includes('muscle') && (
        <group onClick={() => onLayerClick('muscle')}>
          {/* Torso muscles */}
          <mesh position={[0, 1.0, 0.03]}><boxGeometry args={[0.22, 0.55, 0.1]} /><meshPhysicalMaterial color="#c0392b" roughness={0.5} transparent opacity={0.45} /></mesh>
          {/* Deltoids */}
          <mesh position={[0.18, 1.22, 0]}><sphereGeometry args={[0.04, 12, 12]} /><meshPhysicalMaterial color="#e74c3c" roughness={0.5} transparent opacity={0.4} /></mesh>
          <mesh position={[-0.18, 1.22, 0]}><sphereGeometry args={[0.04, 12, 12]} /><meshPhysicalMaterial color="#e74c3c" roughness={0.5} transparent opacity={0.4} /></mesh>
          {/* Thigh muscles */}
          <mesh position={[0.08, -0.15, 0.02]}><capsuleGeometry args={[0.04, 0.35, 8, 16]} /><meshPhysicalMaterial color="#c0392b" roughness={0.5} transparent opacity={0.4} /></mesh>
          <mesh position={[-0.08, -0.15, 0.02]}><capsuleGeometry args={[0.04, 0.35, 8, 16]} /><meshPhysicalMaterial color="#c0392b" roughness={0.5} transparent opacity={0.4} /></mesh>
          {/* Calf muscles */}
          <mesh position={[0.08, -0.6, 0.02]}><capsuleGeometry args={[0.03, 0.3, 8, 16]} /><meshPhysicalMaterial color="#c0392b" roughness={0.5} transparent opacity={0.4} /></mesh>
          <mesh position={[-0.08, -0.6, 0.02]}><capsuleGeometry args={[0.03, 0.3, 8, 16]} /><meshPhysicalMaterial color="#c0392b" roughness={0.5} transparent opacity={0.4} /></mesh>
          {/* Arm muscles */}
          <mesh position={[0.21, 1.0, 0]}><capsuleGeometry args={[0.025, 0.25, 8, 16]} /><meshPhysicalMaterial color="#c0392b" roughness={0.5} transparent opacity={0.4} /></mesh>
          <mesh position={[-0.21, 1.0, 0]}><capsuleGeometry args={[0.025, 0.25, 8, 16]} /><meshPhysicalMaterial color="#c0392b" roughness={0.5} transparent opacity={0.4} /></mesh>
        </group>
      )}
      {/* Skin layer */}
      {visibleLayers.includes('skin') && (
        <group onClick={() => onLayerClick('skin')}>
          {/* Head */}
          <mesh position={[0, 1.55, 0]}><sphereGeometry args={[0.14, 24, 24]} /><meshPhysicalMaterial color="#f5d0a9" roughness={0.7} transparent opacity={0.5} /></mesh>
          {/* Neck */}
          <mesh position={[0, 1.38, 0]}><cylinderGeometry args={[0.04, 0.05, 0.1, 16]} /><meshPhysicalMaterial color="#f5d0a9" roughness={0.7} transparent opacity={0.5} /></mesh>
          {/* Torso */}
          <mesh position={[0, 1.0, 0]}><capsuleGeometry args={[0.13, 0.45, 12, 24]} /><meshPhysicalMaterial color="#f5d0a9" roughness={0.7} transparent opacity={0.45} /></mesh>
          {/* Arms */}
          <mesh position={[0.22, 1.0, 0]}><capsuleGeometry args={[0.035, 0.55, 8, 16]} /><meshPhysicalMaterial color="#f5d0a9" roughness={0.7} transparent opacity={0.45} /></mesh>
          <mesh position={[-0.22, 1.0, 0]}><capsuleGeometry args={[0.035, 0.55, 8, 16]} /><meshPhysicalMaterial color="#f5d0a9" roughness={0.7} transparent opacity={0.45} /></mesh>
          {/* Legs */}
          <mesh position={[0.08, -0.15, 0]}><capsuleGeometry args={[0.05, 0.4, 8, 16]} /><meshPhysicalMaterial color="#f5d0a9" roughness={0.7} transparent opacity={0.45} /></mesh>
          <mesh position={[-0.08, -0.15, 0]}><capsuleGeometry args={[0.05, 0.4, 8, 16]} /><meshPhysicalMaterial color="#f5d0a9" roughness={0.7} transparent opacity={0.45} /></mesh>
          <mesh position={[0.08, -0.6, 0]}><capsuleGeometry args={[0.04, 0.35, 8, 16]} /><meshPhysicalMaterial color="#f5d0a9" roughness={0.7} transparent opacity={0.45} /></mesh>
          <mesh position={[-0.08, -0.6, 0]}><capsuleGeometry args={[0.04, 0.35, 8, 16]} /><meshPhysicalMaterial color="#f5d0a9" roughness={0.7} transparent opacity={0.45} /></mesh>
        </group>
      )}
    </group>
  );
}

// Detailed Heart Model with 4 chambers
function HeartModel3D({ color, selected, onClick }: { color: string; selected: boolean; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      const beat = Math.sin(state.clock.elapsedTime * 4) * 0.02;
      meshRef.current.scale.setScalar(selected ? 1.05 + beat : 1);
    }
  });
  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x, y + 0.25);
    shape.bezierCurveTo(x, y + 0.25, x - 0.25, y, x - 0.25, y);
    shape.bezierCurveTo(x - 0.25, y - 0.15, x, y - 0.3, x, y - 0.5);
    shape.bezierCurveTo(x, y - 0.3, x + 0.25, y - 0.15, x + 0.25, y);
    shape.bezierCurveTo(x + 0.25, y, x, y + 0.25, x, y + 0.25);
    return shape;
  }, []);
  return (
    <group onClick={onClick}>
      <mesh ref={meshRef} position={[0, 0, -0.15]} castShadow>
        <extrudeGeometry args={[heartShape, { depth: 0.35, bevelEnabled: true, bevelSegments: 10, steps: 3, bevelSize: 0.06, bevelThickness: 0.06 }]} />
        <meshPhysicalMaterial color={color} roughness={0.25} metalness={0.15} clearcoat={0.6} transparent opacity={selected ? 0.9 : 0.8} />
      </mesh>
      {/* Atrial septum line */}
      <mesh position={[0, 0.12, 0.02]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.35, 0.003, 0.003]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.6} />
      </mesh>
      {/* Ventricular septum */}
      <mesh position={[0, -0.08, 0.02]}>
        <boxGeometry args={[0.003, 0.25, 0.003]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.6} />
      </mesh>
      {/* Aorta */}
      <mesh position={[0.05, 0.35, 0]} rotation={[0.2, 0, -0.3]}>
        <cylinderGeometry args={[0.04, 0.05, 0.2, 16]} />
        <meshPhysicalMaterial color="#dc2626" roughness={0.3} metalness={0.1} transparent opacity={0.75} />
      </mesh>
      {/* Pulmonary artery */}
      <mesh position={[-0.08, 0.3, 0.05]} rotation={[0.1, 0, 0.3]}>
        <cylinderGeometry args={[0.03, 0.04, 0.15, 12]} />
        <meshPhysicalMaterial color="#3b82f6" roughness={0.3} transparent opacity={0.7} />
      </mesh>
      {/* Coronary arteries */}
      <mesh position={[0.12, 0.05, 0.18]} rotation={[0, 0, 0.8]}>
        <torusGeometry args={[0.12, 0.008, 8, 24, Math.PI * 0.6]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.7} />
      </mesh>
      {selected && (
        <mesh ref={glowRef} position={[0, 0, -0.15]}>
          <extrudeGeometry args={[heartShape, { depth: 0.35, bevelEnabled: true, bevelSegments: 4, bevelSize: 0.12, bevelThickness: 0.08 }]} />
          <meshBasicMaterial color={color} transparent opacity={0.08} />
        </mesh>
      )}
    </group>
  );
}

// Detailed Brain Model with gyri and sulci
function BrainModel3D({ color, selected, onClick }: { color: string; selected: boolean; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
      const s = selected ? 1.08 + Math.sin(state.clock.elapsedTime * 1.5) * 0.02 : 1;
      groupRef.current.scale.setScalar(s);
    }
  });
  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Left hemisphere */}
      <mesh position={[-0.22, 0.05, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32, 0, Math.PI]} />
        <meshPhysicalMaterial color={color} roughness={0.55} metalness={0.05} clearcoat={0.2} transparent opacity={selected ? 1 : 0.85} />
      </mesh>
      {/* Right hemisphere */}
      <mesh position={[0.22, 0.05, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32, Math.PI, Math.PI]} />
        <meshPhysicalMaterial color={color} roughness={0.55} metalness={0.05} clearcoat={0.2} transparent opacity={selected ? 1 : 0.85} />
      </mesh>
      {/* Longitudinal fissure */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.01, 0.3, 0.5]} />
        <meshBasicMaterial color="#581c87" transparent opacity={0.4} />
      </mesh>
      {/* Cerebellum */}
      <mesh position={[0, -0.28, -0.18]} castShadow>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshPhysicalMaterial color="#7c3aed" roughness={0.65} metalness={0.05} transparent opacity={selected ? 0.9 : 0.75} />
      </mesh>
      {/* Brain stem */}
      <mesh position={[0, -0.42, -0.08]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.25, 16]} />
        <meshPhysicalMaterial color="#6d28d9" roughness={0.5} metalness={0.1} transparent opacity={0.8} />
      </mesh>
      {/* Sulci (grooves) */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[Math.cos(i * 0.7) * 0.18, 0.15 + Math.sin(i * 0.9) * 0.12, 0.18 + Math.cos(i * 0.5) * 0.12]} rotation={[Math.random() * 0.3, 0, i * 0.35]}>
          <torusGeometry args={[0.1 + Math.random() * 0.05, 0.006, 6, 20, Math.PI * 0.5]} />
          <meshBasicMaterial color="#581c87" transparent opacity={0.35} />
        </mesh>
      ))}
      {/* Lateral sulcus (Sylvian fissure) */}
      <mesh position={[-0.25, -0.05, 0.2]} rotation={[0, 0.3, -0.4]}>
        <boxGeometry args={[0.2, 0.005, 0.005]} />
        <meshBasicMaterial color="#4c1d95" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.25, -0.05, 0.2]} rotation={[0, -0.3, 0.4]}>
        <boxGeometry args={[0.2, 0.005, 0.005]} />
        <meshBasicMaterial color="#4c1d95" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// Detailed Lungs Model with lobes and bronchi
function LungsModel3D({ color, selected, onClick }: { color: string; selected: boolean; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
      const breathe = Math.sin(state.clock.elapsedTime * 1.2) * 0.04;
      groupRef.current.scale.set(1 + breathe, 1, 1 + breathe * 0.5);
    }
  });
  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Right lung - 3 lobes */}
      <mesh position={[0.32, 0.12, 0]} castShadow>
        <sphereGeometry args={[0.28, 28, 28]} />
        <meshPhysicalMaterial color={color} roughness={0.4} clearcoat={0.2} transparent opacity={selected ? 0.85 : 0.7} />
      </mesh>
      <mesh position={[0.35, -0.05, 0]} castShadow>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshPhysicalMaterial color={color} roughness={0.4} transparent opacity={selected ? 0.8 : 0.65} />
      </mesh>
      <mesh position={[0.3, -0.22, 0]} castShadow>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshPhysicalMaterial color={color} roughness={0.4} transparent opacity={selected ? 0.8 : 0.65} />
      </mesh>
      {/* Left lung - 2 lobes */}
      <mesh position={[-0.3, 0.08, 0]} castShadow>
        <sphereGeometry args={[0.26, 28, 28]} />
        <meshPhysicalMaterial color={color} roughness={0.4} clearcoat={0.2} transparent opacity={selected ? 0.85 : 0.7} />
      </mesh>
      <mesh position={[-0.28, -0.18, 0]} castShadow>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshPhysicalMaterial color={color} roughness={0.4} transparent opacity={selected ? 0.8 : 0.65} />
      </mesh>
      {/* Cardiac notch (left lung) */}
      <mesh position={[-0.15, -0.05, 0.12]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.3} />
      </mesh>
      {/* Fissures */}
      <mesh position={[0.33, 0.03, 0.15]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.35, 0.003, 0.003]} />
        <meshBasicMaterial color="#0369a1" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.33, -0.12, 0.12]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.3, 0.003, 0.003]} />
        <meshBasicMaterial color="#0369a1" transparent opacity={0.5} />
      </mesh>
      {/* Trachea */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 16]} />
        <meshPhysicalMaterial color="#94a3b8" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Bronchi */}
      <mesh position={[0.15, 0.28, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.025, 0.03, 0.2, 12]} />
        <meshPhysicalMaterial color="#94a3b8" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[-0.13, 0.28, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.025, 0.03, 0.18, 12]} />
        <meshPhysicalMaterial color="#94a3b8" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Tracheal rings */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[0, 0.35 + i * 0.04, 0.04]}>
          <torusGeometry args={[0.04, 0.004, 6, 16, Math.PI * 1.4]} />
          <meshPhysicalMaterial color="#cbd5e1" roughness={0.3} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// Generic Organ Model (enhanced)
function GenericOrganModel3D({ color, selected, onClick, shape = 'sphere' }: { color: string; selected: boolean; onClick: () => void; shape?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004;
      const scale = selected ? 1.08 + Math.sin(state.clock.elapsedTime * 2) * 0.03 : 1;
      meshRef.current.scale.setScalar(scale);
    }
  });
  const geometry = useMemo(() => {
    switch (shape) {
      case 'kidney': return <capsuleGeometry args={[0.2, 0.3, 16, 32]} />;
      case 'liver': return <dodecahedronGeometry args={[0.4, 2]} />;
      case 'bone_long': return <cylinderGeometry args={[0.04, 0.06, 0.9, 16]} />;
      case 'gland': return <icosahedronGeometry args={[0.3, 2]} />;
      case 'spleen': return <capsuleGeometry args={[0.18, 0.25, 12, 24]} />;
      case 'tube': return <torusGeometry args={[0.25, 0.08, 16, 32]} />;
      case 'stomach': return <sphereGeometry args={[0.35, 24, 24]} />;
      case 'thyroid': return <torusGeometry args={[0.2, 0.06, 12, 24, Math.PI * 1.5]} />;
      case 'uterus': return <icosahedronGeometry args={[0.28, 2]} />;
      case 'lymphnode': return <icosahedronGeometry args={[0.25, 3]} />;
      case 'skin_layers': return <boxGeometry args={[0.6, 0.4, 0.15]} />;
      case 'spine': return <cylinderGeometry args={[0.05, 0.05, 1.0, 8]} />;
      case 'trachea': return <cylinderGeometry args={[0.06, 0.06, 0.6, 16]} />;
      case 'cylinder': return <cylinderGeometry args={[0.06, 0.06, 0.8, 16]} />;
      case 'spinalcord': return <cylinderGeometry args={[0.04, 0.04, 0.7, 12]} />;
      case 'cerebellum': return <sphereGeometry args={[0.25, 24, 24]} />;
      default: return <sphereGeometry args={[0.35, 32, 32]} />;
    }
  }, [shape]);
  return (
    <group onClick={onClick}>
      <mesh ref={meshRef} castShadow>
        {geometry}
        <meshPhysicalMaterial color={color} roughness={0.35} metalness={0.1} clearcoat={0.4} transparent opacity={selected ? 1 : 0.85} />
      </mesh>
      {selected && (
        <mesh scale={1.15}>
          {geometry}
          <meshBasicMaterial color={color} transparent opacity={0.08} wireframe />
        </mesh>
      )}
    </group>
  );
}

// Annotation Point in 3D
function AnnotationPoint3D({ annotation, visible, onClick }: { annotation: AnatomyAnnotation; visible: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  if (!visible) return null;
  return (
    <group position={annotation.position}>
      <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} onClick={onClick}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshBasicMaterial color={hovered ? '#22d3ee' : '#ffffff'} />
      </mesh>
      <Line points={[[0, 0, 0], [0, 0.12, 0.08]]} color="#22d3ee" lineWidth={1} transparent opacity={0.5} />
      <Html position={[0, 0.16, 0.1]} center distanceFactor={3} style={{ pointerEvents: 'none' }}>
        <div className={`px-2 py-1 rounded text-[9px] font-bold whitespace-nowrap transition-all ${hovered ? 'bg-cyan-500 text-white scale-110' : 'bg-gray-800/90 text-cyan-300 border border-cyan-500/20'}`}>
          {annotation.label}
        </div>
      </Html>
    </group>
  );
}

// Atlas Scene for individual organ viewing
function AtlasScene3D({ system, selectedOrgan, onOrganClick, showAnnotations, onAnnotationClick }: {
  system: BodySystemData;
  selectedOrgan: string | null;
  onOrganClick: (id: string) => void;
  showAnnotations: boolean;
  onAnnotationClick: (a: AnatomyAnnotation) => void;
}) {
  const organ = system.organs.find(o => o.id === selectedOrgan) || system.organs[0];
  const getOrganModel = () => {
    const props = { color: organ?.color3D || system.threeColor, selected: true, onClick: () => {} };
    if (organ?.shape3D === 'heart') return <HeartModel3D {...props} />;
    if (organ?.shape3D === 'brain') return <BrainModel3D {...props} />;
    if (organ?.shape3D === 'lungs') return <LungsModel3D {...props} />;
    return <GenericOrganModel3D {...props} shape={organ?.shape3D || 'sphere'} />;
  };
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} />
      <pointLight position={[0, 2, 3]} intensity={0.5} color={system.threeColor} />
      <Suspense fallback={null}>
        <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.2}>
          {getOrganModel()}
        </Float>
        {organ && organ.annotations.map((a, i) => (
          <AnnotationPoint3D key={i} annotation={a} visible={showAnnotations} onClick={() => onAnnotationClick(a)} />
        ))}
        <ContactShadows position={[0, -0.8, 0]} opacity={0.4} scale={3} blur={2} />
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls enablePan={false} minDistance={1} maxDistance={5} autoRotate={false} makeDefault />
      <gridHelper args={[4, 20, '#1e293b', '#0f172a']} position={[0, -0.8, 0]} />
    </>
  );
}

// Dissection Scene
function DissectionScene({ visibleLayers, onLayerClick }: { visibleLayers: string[]; onLayerClick: (layer: string) => void }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={0.9} castShadow />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} />
      <pointLight position={[0, 2, 3]} intensity={0.4} color="#22d3ee" />
      <Suspense fallback={null}>
        <FullBodyModel visibleLayers={visibleLayers} onLayerClick={onLayerClick} />
        <ContactShadows position={[0, -0.95, 0]} opacity={0.5} scale={4} blur={2.5} />
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls enablePan={false} minDistance={1.5} maxDistance={6} autoRotate autoRotateSpeed={0.5} makeDefault />
      <gridHelper args={[4, 20, '#1e293b', '#0f172a']} position={[0, -0.95, 0]} />
    </>
  );
}
// === MAIN COMPONENT ===
type ViewMode = 'systems' | 'organ' | 'dissection' | 'quiz';
type DetailTab = 'overview' | 'histology' | 'clinical' | 'imaging' | 'references';

export default function AnatomyAtlas() {
  const [selectedSystem, setSelectedSystem] = useState<BodySystemData | null>(null);
  const [selectedOrganId, setSelectedOrganId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('systems');
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>('overview');
  const [selectedAnnotation, setSelectedAnnotation] = useState<AnatomyAnnotation | null>(null);
  const [bookmarkedOrgans, setBookmarkedOrgans] = useState<string[]>([]);
  const [showPathology, setShowPathology] = useState(false);
  
  // Dissection state
  const [visibleLayers, setVisibleLayers] = useState<string[]>(['skin', 'muscle', 'organs', 'vessels', 'skeleton']);
  
  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const selectedOrgan = useMemo(() => {
    if (!selectedSystem || !selectedOrganId) return null;
    return selectedSystem.organs.find(o => o.id === selectedOrganId) || null;
  }, [selectedSystem, selectedOrganId]);

  const filteredSystems = useMemo(() => {
    return BODY_SYSTEMS.filter(s => {
      const matchesSearch = !searchQuery || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.organs.some(o => o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.nameLatin.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesYear = !yearFilter || s.year === yearFilter;
      return matchesSearch && matchesYear;
    });
  }, [searchQuery, yearFilter]);

  const totalOrgans = useMemo(() => BODY_SYSTEMS.reduce((acc, s) => acc + s.organs.length, 0), []);
  const totalAnnotations = useMemo(() => BODY_SYSTEMS.reduce((acc, s) => acc + s.organs.reduce((a, o) => a + o.annotations.length, 0), 0), []);
  const totalPathologies = useMemo(() => BODY_SYSTEMS.reduce((acc, s) => acc + s.organs.reduce((a, o) => a + o.pathologies.length, 0), 0), []);

  const toggleLayer = (layerId: string) => {
    setVisibleLayers(prev => prev.includes(layerId) ? prev.filter(l => l !== layerId) : [...prev, layerId]);
  };

  const startQuiz = (systemId?: string) => {
    let questions = [...QUIZ_QUESTIONS];
    if (systemId) {
      const systemOrgans = BODY_SYSTEMS.find(s => s.id === systemId)?.organs.map(o => o.id) || [];
      questions = questions.filter(q => systemOrgans.includes(q.organId));
    }
    const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, Math.min(10, questions.length));
    setQuizQuestions(shuffled);
    setCurrentQuizIndex(0);
    setQuizAnswer(null);
    setQuizScore(0);
    setQuizCompleted(false);
    setViewMode('quiz');
  };

  const answerQuiz = (index: number) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(index);
    if (index === quizQuestions[currentQuizIndex].correctIndex) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuizQuestion = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setQuizAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const toggleBookmark = (organId: string) => {
    setBookmarkedOrgans(prev => prev.includes(organId) ? prev.filter(id => id !== organId) : [...prev, organId]);
  };

  const selectSystem = (system: BodySystemData) => {
    setSelectedSystem(system);
    setSelectedOrganId(system.organs[0]?.id || null);
    setViewMode('organ');
    setActiveDetailTab('overview');
    setSelectedAnnotation(null);
    setShowPathology(false);
  };

  const goBack = () => {
    if (viewMode === 'organ') {
      setSelectedSystem(null);
      setSelectedOrganId(null);
      setViewMode('systems');
    } else if (viewMode === 'dissection' || viewMode === 'quiz') {
      setViewMode('systems');
    }
  };

  // === DETAIL TABS ===
  const detailTabs: { id: DetailTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Visao Geral', icon: Info },
    { id: 'histology', label: 'Histologia', icon: Microscope },
    { id: 'clinical', label: 'Clinica', icon: Stethoscope },
    { id: 'imaging', label: 'Imagem', icon: Eye },
    { id: 'references', label: 'Referencias', icon: BookOpen },
  ];

  // === RENDER ===
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {viewMode !== 'systems' && (
                <button onClick={goBack} className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  Atlas de Anatomia 3D
                </h1>
                <p className="text-xs text-gray-400">
                  {viewMode === 'systems' && `${BODY_SYSTEMS.length} sistemas | ${totalOrgans} orgaos | ${totalAnnotations} anotacoes | ${totalPathologies} patologias`}
                  {viewMode === 'organ' && selectedSystem && `${selectedSystem.name} - ${selectedSystem.organs.length} orgaos`}
                  {viewMode === 'dissection' && 'Modo Disseccao - Remova camadas para explorar'}
                  {viewMode === 'quiz' && `Quiz - Questao ${currentQuizIndex + 1}/${quizQuestions.length}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setViewMode('dissection'); setVisibleLayers(['skin', 'muscle', 'organs', 'vessels', 'skeleton']); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${viewMode === 'dissection' ? 'bg-cyan-500 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'}`}>
                <Scissors className="w-3.5 h-3.5" /> Disseccao
              </button>
              <button onClick={() => startQuiz()}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${viewMode === 'quiz' ? 'bg-emerald-500 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'}`}>
                <HelpCircle className="w-3.5 h-3.5" /> Quiz
              </button>
              <button onClick={() => setShowAnnotations(!showAnnotations)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${showAnnotations ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-gray-800/50 text-gray-400'}`}>
                <Tag className="w-3.5 h-3.5" /> Rotulos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SYSTEMS VIEW */}
      {viewMode === 'systems' && (
        <div className="max-w-[1600px] mx-auto px-4 py-6">
          {/* Search & Filters */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Buscar sistema, orgao ou termo latino..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50" />
            </div>
            <div className="flex gap-1.5">
              {[null, 1, 2, 3, 4, 5, 6].map(y => (
                <button key={y ?? 'all'} onClick={() => setYearFilter(y)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${yearFilter === y ? 'bg-cyan-500 text-white' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'}`}>
                  {y ? `${y}o Ano` : 'Todos'}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-cyan-400">{BODY_SYSTEMS.length}</div>
              <div className="text-xs text-gray-400">Sistemas</div>
            </div>
            <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">{totalOrgans}</div>
              <div className="text-xs text-gray-400">Orgaos</div>
            </div>
            <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-purple-400">{totalAnnotations}</div>
              <div className="text-xs text-gray-400">Anotacoes 3D</div>
            </div>
            <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-red-400">{totalPathologies}</div>
              <div className="text-xs text-gray-400">Patologias</div>
            </div>
          </div>

          {/* Systems Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSystems.map(system => {
              const Icon = system.icon;
              return (
                <button key={system.id} onClick={() => selectSystem(system)}
                  className={`${system.bgColor} border border-gray-700/30 rounded-xl p-4 text-left hover:border-gray-600/50 transition-all group hover:scale-[1.02]`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-lg bg-gray-800/50 ${system.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] bg-gray-800/50 px-2 py-0.5 rounded-full text-gray-400">{system.year}o Ano</span>
                  </div>
                  <h3 className="font-bold text-sm mb-1 group-hover:text-cyan-300 transition-colors">{system.name}</h3>
                  <p className="text-[11px] text-gray-400 mb-2 line-clamp-2">{system.nameEn}</p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <span>{system.organs.length} orgaos</span>
                    <span>|</span>
                    <span>{system.organs.reduce((a, o) => a + o.annotations.length, 0)} anotacoes</span>
                    <span>|</span>
                    <span>{system.organs.reduce((a, o) => a + o.pathologies.length, 0)} patologias</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* References Footer */}
          <div className="mt-8 p-4 bg-gray-800/20 border border-gray-700/20 rounded-xl">
            <h3 className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Referencias Bibliograficas</h3>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500">
              <div>[1] Gray's Anatomy, 42nd Ed. Standring S. Elsevier, 2020.</div>
              <div>[2] Netter Atlas of Human Anatomy, 8th Ed. Netter FH. Elsevier, 2023.</div>
              <div>[3] Sobotta Atlas of Anatomy, 24th Ed. Paulsen F, Waschke J. Urban & Fischer, 2022.</div>
              <div>[4] Moore's Clinically Oriented Anatomy, 9th Ed. Dalley AF, Agur AMR. Wolters Kluwer, 2022.</div>
              <div>[5] Prometheus Atlas of Anatomy, 5th Ed. Schunke M et al. Thieme, 2022.</div>
              <div>[6] Junqueira's Basic Histology, 16th Ed. Mescher AL. McGraw-Hill, 2021.</div>
              <div>[7] Langman's Medical Embryology, 14th Ed. Sadler TW. Wolters Kluwer, 2019.</div>
              <div>[8] Guyton & Hall Textbook of Medical Physiology, 14th Ed. Hall JE. Elsevier, 2020.</div>
              <div>[9] Robbins & Cotran Pathologic Basis of Disease, 10th Ed. Kumar V et al. Elsevier, 2021.</div>
              <div>[10] Williams Obstetrics, 26th Ed. Cunningham FG et al. McGraw-Hill, 2022.</div>
            </div>
          </div>
        </div>
      )}

      {/* DISSECTION VIEW */}
      {viewMode === 'dissection' && (
        <div className="flex h-[calc(100vh-64px)]">
          {/* 3D Canvas */}
          <div className="flex-1 relative">
            <Canvas camera={{ position: [0, 0.5, 3], fov: 50 }} shadows>
              <DissectionScene visibleLayers={visibleLayers} onLayerClick={toggleLayer} />
            </Canvas>
            {/* Layer Controls Overlay */}
            <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 w-56">
              <h3 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Camadas de Disseccao</h3>
              {DISSECTION_LAYERS.map(layer => (
                <button key={layer.id} onClick={() => toggleLayer(layer.id)}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs mb-1 transition-all ${visibleLayers.includes(layer.id) ? 'bg-gray-800/80 text-white' : 'bg-gray-800/20 text-gray-600 line-through'}`}>
                  <div className="w-3 h-3 rounded-full border-2" style={{ backgroundColor: visibleLayers.includes(layer.id) ? layer.color : 'transparent', borderColor: layer.color }} />
                  <div className="flex-1">
                    <div className="font-medium">{layer.name}</div>
                    <div className="text-[9px] text-gray-500">{layer.desc}</div>
                  </div>
                  {visibleLayers.includes(layer.id) ? <Eye className="w-3 h-3 text-cyan-400" /> : <X className="w-3 h-3 text-gray-600" />}
                </button>
              ))}
              <div className="flex gap-1.5 mt-2">
                <button onClick={() => setVisibleLayers(['skin', 'muscle', 'organs', 'vessels', 'skeleton'])}
                  className="flex-1 px-2 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-[10px] font-medium hover:bg-cyan-500/30">
                  Mostrar Tudo
                </button>
                <button onClick={() => setVisibleLayers(['skeleton'])}
                  className="flex-1 px-2 py-1.5 bg-gray-700/50 text-gray-300 rounded-lg text-[10px] font-medium hover:bg-gray-700/70">
                  So Esqueleto
                </button>
              </div>
            </div>
            {/* Info overlay */}
            <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 max-w-xs">
              <p className="text-xs text-gray-300"><strong className="text-cyan-400">Modo Disseccao:</strong> Clique nas camadas a direita para remover/adicionar. Arraste para rotacionar o modelo. Scroll para zoom.</p>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ VIEW */}
      {viewMode === 'quiz' && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          {quizCompleted ? (
            <div className="bg-gray-800/30 border border-gray-700/30 rounded-2xl p-8 text-center">
              <Award className={`w-16 h-16 mx-auto mb-4 ${quizScore >= quizQuestions.length * 0.7 ? 'text-yellow-400' : quizScore >= quizQuestions.length * 0.5 ? 'text-blue-400' : 'text-gray-400'}`} />
              <h2 className="text-2xl font-bold mb-2">Quiz Concluido!</h2>
              <p className="text-4xl font-bold mb-2">
                <span className={quizScore >= quizQuestions.length * 0.7 ? 'text-emerald-400' : quizScore >= quizQuestions.length * 0.5 ? 'text-yellow-400' : 'text-red-400'}>
                  {quizScore}/{quizQuestions.length}
                </span>
              </p>
              <p className="text-gray-400 mb-1">{Math.round((quizScore / quizQuestions.length) * 100)}% de acerto</p>
              <p className="text-sm text-gray-500 mb-6">
                {quizScore >= quizQuestions.length * 0.9 ? 'Excelente! Dominio completo!' :
                 quizScore >= quizQuestions.length * 0.7 ? 'Muito bom! Continue estudando!' :
                 quizScore >= quizQuestions.length * 0.5 ? 'Bom, mas revise os pontos fracos.' :
                 'Precisa revisar mais. Nao desista!'}
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => startQuiz()} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600">Novo Quiz</button>
                <button onClick={goBack} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600">Voltar ao Atlas</button>
              </div>
            </div>
          ) : quizQuestions.length > 0 && (
            <div className="bg-gray-800/30 border border-gray-700/30 rounded-2xl p-6">
              {/* Progress */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-gray-400">Questao {currentQuizIndex + 1} de {quizQuestions.length}</span>
                <span className="text-xs text-emerald-400 font-medium">Acertos: {quizScore}</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-1.5 mb-6">
                <div className="bg-cyan-500 h-1.5 rounded-full transition-all" style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }} />
              </div>
              {/* Question */}
              <h3 className="text-lg font-bold mb-6">{quizQuestions[currentQuizIndex].question}</h3>
              {/* Options */}
              <div className="space-y-2 mb-6">
                {quizQuestions[currentQuizIndex].options.map((option, i) => {
                  const isCorrect = i === quizQuestions[currentQuizIndex].correctIndex;
                  const isSelected = quizAnswer === i;
                  const showResult = quizAnswer !== null;
                  return (
                    <button key={i} onClick={() => answerQuiz(i)} disabled={quizAnswer !== null}
                      className={`w-full p-3 rounded-xl text-left text-sm transition-all flex items-center gap-3 ${
                        showResult && isCorrect ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 border' :
                        showResult && isSelected && !isCorrect ? 'bg-red-500/20 border-red-500/50 text-red-300 border' :
                        !showResult ? 'bg-gray-800/50 border border-gray-700/30 hover:border-cyan-500/30 text-gray-200' :
                        'bg-gray-800/30 border border-gray-700/20 text-gray-500'
                      }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        showResult && isCorrect ? 'bg-emerald-500 text-white' :
                        showResult && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {showResult && isCorrect ? <CheckCircle className="w-4 h-4" /> :
                         showResult && isSelected && !isCorrect ? <XCircle className="w-4 h-4" /> :
                         String.fromCharCode(65 + i)}
                      </div>
                      {option}
                    </button>
                  );
                })}
              </div>
              {/* Explanation */}
              {quizAnswer !== null && (
                <div className="bg-gray-800/50 border border-gray-700/30 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-300"><strong className="text-cyan-400">Explicacao:</strong> {quizQuestions[currentQuizIndex].explanation}</p>
                </div>
              )}
              {quizAnswer !== null && (
                <button onClick={nextQuizQuestion} className="w-full py-2.5 bg-cyan-500 text-white rounded-xl text-sm font-medium hover:bg-cyan-600 transition-colors">
                  {currentQuizIndex < quizQuestions.length - 1 ? 'Proxima Questao' : 'Ver Resultado'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ORGAN VIEW */}
      {viewMode === 'organ' && selectedSystem && (
        <div className="flex h-[calc(100vh-64px)]">
          {/* Left Sidebar - Organ List */}
          <div className="w-56 border-r border-gray-800/50 bg-gray-900/50 overflow-y-auto">
            <div className="p-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Orgaos do Sistema</h3>
              {selectedSystem.organs.map(organ => (
                <button key={organ.id} onClick={() => { setSelectedOrganId(organ.id); setActiveDetailTab('overview'); setSelectedAnnotation(null); }}
                  className={`w-full text-left p-2.5 rounded-lg mb-1 transition-all text-xs ${selectedOrganId === organ.id ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300' : 'hover:bg-gray-800/50 text-gray-400'}`}>
                  <div className="font-medium">{organ.name}</div>
                  <div className="text-[10px] text-gray-500 italic">{organ.nameLatin}</div>
                </button>
              ))}
              <div className="mt-3 pt-3 border-t border-gray-800/50">
                <button onClick={() => startQuiz(selectedSystem.id)}
                  className="w-full py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/30 flex items-center justify-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" /> Quiz deste Sistema
                </button>
              </div>
              {/* System Info */}
              <div className="mt-3 pt-3 border-t border-gray-800/50">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-1">Relevancia Clinica</h4>
                {selectedSystem.clinicalRelevance.map((c, i) => (
                  <p key={i} className="text-[10px] text-gray-500 mb-1 flex items-start gap-1">
                    <AlertCircle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" /> {c}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Center - 3D Canvas */}
          <div className="flex-1 relative">
            <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }} shadows>
              <AtlasScene3D
                system={selectedSystem}
                selectedOrgan={selectedOrganId}
                onOrganClick={setSelectedOrganId}
                showAnnotations={showAnnotations}
                onAnnotationClick={setSelectedAnnotation}
              />
            </Canvas>
            {/* Annotation popup */}
            {selectedAnnotation && (
              <div className="absolute top-4 left-4 bg-gray-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4 max-w-xs z-10">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-bold text-cyan-400">{selectedAnnotation.label}</h4>
                  <button onClick={() => setSelectedAnnotation(null)} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
                </div>
                <p className="text-xs text-gray-300 mb-2">{selectedAnnotation.description}</p>
                {selectedAnnotation.clinicalNote && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                    <p className="text-[10px] text-red-300"><strong>Nota Clinica:</strong> {selectedAnnotation.clinicalNote}</p>
                  </div>
                )}
              </div>
            )}
            {/* Controls info */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <div className="bg-gray-900/70 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] text-gray-400 flex items-center gap-1.5">
                <RotateCw className="w-3 h-3" /> Arraste para rotacionar
              </div>
              <button onClick={() => setShowPathology(!showPathology)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-medium flex items-center gap-1.5 transition-all ${showPathology ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-gray-900/70 text-gray-400'}`}>
                <AlertCircle className="w-3 h-3" /> Patologias
              </button>
            </div>
          </div>

          {/* Right Panel - Details */}
          <div className="w-96 border-l border-gray-800/50 bg-gray-900/50 overflow-y-auto">
            {selectedOrgan && (
              <div className="p-4">
                {/* Organ Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-bold">{selectedOrgan.name}</h2>
                    <p className="text-xs text-gray-400 italic">{selectedOrgan.nameLatin} | {selectedOrgan.nameEn}</p>
                  </div>
                  <button onClick={() => toggleBookmark(selectedOrgan.id)}
                    className={`p-1.5 rounded-lg transition-all ${bookmarkedOrgans.includes(selectedOrgan.id) ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-800/50 text-gray-500 hover:text-yellow-400'}`}>
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                {/* Detail Tabs */}
                <div className="flex gap-1 mb-4 overflow-x-auto">
                  {detailTabs.map(tab => {
                    const TabIcon = tab.icon;
                    return (
                      <button key={tab.id} onClick={() => setActiveDetailTab(tab.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap flex items-center gap-1 transition-all ${activeDetailTab === tab.id ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-gray-800/30 text-gray-500 hover:text-gray-300'}`}>
                        <TabIcon className="w-3 h-3" /> {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div className="space-y-4">
                  {activeDetailTab === 'overview' && (
                    <>
                      <div className="bg-gray-800/30 rounded-xl p-3">
                        <h4 className="text-xs font-bold text-cyan-400 mb-1">Descricao</h4>
                        <p className="text-xs text-gray-300 leading-relaxed">{selectedOrgan.description}</p>
                      </div>
                      <div className="bg-gray-800/30 rounded-xl p-3">
                        <h4 className="text-xs font-bold text-blue-400 mb-1">Vascularizacao</h4>
                        <p className="text-xs text-gray-300">{selectedOrgan.bloodSupply}</p>
                      </div>
                      <div className="bg-gray-800/30 rounded-xl p-3">
                        <h4 className="text-xs font-bold text-yellow-400 mb-1">Inervacao</h4>
                        <p className="text-xs text-gray-300">{selectedOrgan.innervation}</p>
                      </div>
                      <div className="bg-gray-800/30 rounded-xl p-3">
                        <h4 className="text-xs font-bold text-emerald-400 mb-1">Funcoes</h4>
                        <ul className="space-y-1">
                          {selectedOrgan.functions.map((f, i) => (
                            <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                              <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" /> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-gray-800/30 rounded-xl p-3">
                        <h4 className="text-xs font-bold text-purple-400 mb-1">Embriologia</h4>
                        <p className="text-xs text-gray-300">{selectedOrgan.embryology}</p>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                        <h4 className="text-xs font-bold text-yellow-400 mb-1 flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> Dicas de Prova</h4>
                        <ul className="space-y-1">
                          {selectedOrgan.examTips.map((tip, i) => (
                            <li key={i} className="text-xs text-yellow-200/80 flex items-start gap-1.5">
                              <Target className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" /> {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {activeDetailTab === 'histology' && (
                    <div className="bg-gray-800/30 rounded-xl p-3">
                      <h4 className="text-xs font-bold text-purple-400 mb-2 flex items-center gap-1"><Microscope className="w-3.5 h-3.5" /> Histologia</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">{selectedOrgan.histology}</p>
                    </div>
                  )}

                  {activeDetailTab === 'clinical' && (
                    <>
                      {selectedOrgan.pathologies.map((path, i) => (
                        <div key={i} className="bg-red-500/5 border border-red-500/20 rounded-xl p-3">
                          <h4 className="text-xs font-bold text-red-400 mb-1">{path.name}</h4>
                          <p className="text-xs text-gray-300 mb-1">{path.description}</p>
                          <p className="text-[10px] text-gray-500"><strong>Aspecto:</strong> {path.visualChange}</p>
                          <p className="text-[10px] text-gray-600 mt-1">Ref: {path.reference}</p>
                        </div>
                      ))}
                      <div className="bg-gray-800/30 rounded-xl p-3">
                        <h4 className="text-xs font-bold text-blue-400 mb-1">Notas Cirurgicas</h4>
                        <ul className="space-y-1">
                          {selectedOrgan.surgicalNotes.map((note, i) => (
                            <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                              <Scissors className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" /> {note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {activeDetailTab === 'imaging' && (
                    <div className="bg-gray-800/30 rounded-xl p-3">
                      <h4 className="text-xs font-bold text-sky-400 mb-2 flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Notas de Imagem</h4>
                      <ul className="space-y-1.5">
                        {selectedOrgan.imagingNotes.map((note, i) => (
                          <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                            <ChevronRight className="w-3 h-3 text-sky-400 mt-0.5 flex-shrink-0" /> {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeDetailTab === 'references' && (
                    <div className="bg-gray-800/30 rounded-xl p-3">
                      <h4 className="text-xs font-bold text-gray-300 mb-2 flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Referencias</h4>
                      <ul className="space-y-1.5">
                        {selectedOrgan.references.map((ref, i) => (
                          <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                            <ExternalLink className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" /> {ref}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
