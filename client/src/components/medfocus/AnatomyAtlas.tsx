/**
 * AnatomyAtlas v3.0 — Atlas Anatômico 3D Interativo
 * Three.js + React Three Fiber com modelos 3D procedurais,
 * rotação, zoom, anotações anatômicas, 12 sistemas corporais completos.
 * Referências: Gray's Anatomy 42nd Ed, Netter Atlas 7th Ed, Sobotta Atlas 24th Ed
 */
import React, { useState, useMemo, useRef, useCallback, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Html, Environment, ContactShadows, Float, Text, Billboard, Line } from '@react-three/drei';
import * as THREE from 'three';
import {
  Heart, Brain, Bone, Droplets, Wind, Utensils, Eye, Ear,
  Shield, Zap, Baby, Activity, ArrowLeft, BookOpen, Search,
  ChevronRight, GraduationCap, Stethoscope, Microscope,
  Moon, Sun, RotateCw, ZoomIn, ZoomOut, Maximize2, Info,
  Layers, Tag, FileText, AlertCircle, ChevronDown, ChevronUp,
  X, Bookmark, ExternalLink
} from 'lucide-react';

// ─── EXPANDED BODY SYSTEMS DATA (12 Systems) ─────────────────────
interface AnatomyAnnotation {
  position: [number, number, number];
  label: string;
  description: string;
  clinicalNote?: string;
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
  pathologies: string[];
  examTips: string[];
  surgicalNotes: string[];
  imagingNotes: string[];
  annotations: AnatomyAnnotation[];
  references: string[];
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

const BODY_SYSTEMS: BodySystemData[] = [
  {
    id: 'cardiovascular',
    name: 'Sistema Cardiovascular',
    nameEn: 'Cardiovascular System',
    icon: Heart,
    color: 'text-red-500',
    threeColor: '#ef4444',
    bgColor: 'bg-red-500/10',
    year: 1,
    description: 'Responsável pelo transporte de sangue, nutrientes e oxigênio. Inclui coração (4 câmaras), artérias, veias, capilares e sistema linfático associado. O coração bombeia ~5L/min em repouso.',
    relatedSubjects: ['Anatomia', 'Fisiologia', 'Histologia', 'Cardiologia', 'Cirurgia Cardiovascular', 'Hemodinâmica'],
    clinicalRelevance: [
      'IAM — principal causa de morte no Brasil (SBC 2023)',
      'ICC — 2 milhões de brasileiros afetados',
      'HAS — prevalência de 32,5% em adultos',
      'Arritmias cardíacas — fibrilação atrial mais comum',
      'Doença arterial coronariana',
      'Valvulopatias — estenose aórtica mais comum em idosos',
      'Endocardite infecciosa — critérios de Duke',
      'Dissecção aórtica — emergência cirúrgica',
    ],
    keyTerms: ['Sístole', 'Diástole', 'Débito cardíaco', 'Pré-carga', 'Pós-carga', 'Fração de ejeção', 'Ciclo cardíaco', 'Lei de Frank-Starling', 'Automatismo cardíaco', 'Sistema de condução'],
    references: [
      'Standring S. Gray\'s Anatomy. 42nd ed. Elsevier; 2020. Cap. 56-60.',
      'Netter FH. Atlas of Human Anatomy. 7th ed. Elsevier; 2019. Plates 212-240.',
      'Guyton AC, Hall JE. Textbook of Medical Physiology. 14th ed. Elsevier; 2020. Cap. 9-13.',
      'Braunwald E. Heart Disease. 12th ed. Elsevier; 2022.',
    ],
    organs: [
      {
        id: 'coracao', name: 'Coração', nameEn: 'Heart', nameLatin: 'Cor',
        description: 'Órgão muscular oco, cônico, ~300g no adulto. Localizado no mediastino médio, 2/3 à esquerda. Possui 4 câmaras: AD, AE, VD, VE. Envolvido pelo pericárdio (fibroso e seroso).',
        histology: 'Miocárdio: fibras musculares estriadas cardíacas com discos intercalares (gap junctions). Endocárdio: endotélio + tecido conjuntivo. Epicárdio: mesotélio + tecido adiposo.',
        embryology: 'Deriva do mesoderma esplâncnico (campo cardíaco primário e secundário). Tubo cardíaco primitivo forma-se na 3ª semana. Septação atrial e ventricular na 4ª-8ª semana.',
        bloodSupply: 'Coronária direita (CD): nó SA (60%), nó AV (80%), VD, parede inferior VE. Coronária esquerda: DA (septo anterior, parede anterior VE), Cx (parede lateral VE).',
        innervation: 'Simpático: T1-T4 (cronotropismo e inotropismo +). Parassimpático: nervo vago (cronotropismo -). Plexo cardíaco superficial e profundo.',
        functions: ['Bombeamento sanguíneo sistêmico e pulmonar', 'Regulação da pressão arterial', 'Produção de BNP/ANP', 'Função endócrina (peptídeos natriuréticos)'],
        pathologies: ['IAM (STEMI/NSTEMI)', 'ICC (FE reduzida/preservada)', 'Endocardite', 'Pericardite', 'Miocardite', 'Valvulopatias (EA, IM, EM)', 'Cardiopatias congênitas (CIA, CIV, PCA, T4F)'],
        examTips: [
          'Localização: mediastino médio, posterior ao esterno, anterior ao esôfago',
          'Irrigação: coronárias D e E (ramos da aorta ascendente)',
          'Projeção na parede torácica: 2° EIC D ao 5° EIC E (linha hemiclavicular)',
          'Ausculta: foco aórtico (2° EIC D), pulmonar (2° EIC E), tricúspide (4° EIC E), mitral (5° EIC E)',
          'ECG: derivações DI, DII, DIII, aVR, aVL, aVF, V1-V6',
        ],
        surgicalNotes: [
          'Esternotomia mediana: acesso padrão para cirurgia cardíaca',
          'Circulação extracorpórea (CEC): bypass cardiopulmonar',
          'Revascularização miocárdica: pontes de safena e mamária interna',
          'Troca valvar: próteses mecânicas (anticoagulação vitalícia) ou biológicas',
        ],
        imagingNotes: [
          'Ecocardiograma: avaliação de câmaras, valvas, FE, pericárdio',
          'Cateterismo cardíaco: padrão-ouro para coronariopatia',
          'RM cardíaca: avaliação de miocárdio, fibrose, viabilidade',
          'TC coronárias: escore de cálcio, angio-TC',
        ],
        annotations: [
          { position: [0, 0.3, 0.5], label: 'Átrio Direito', description: 'Recebe sangue venoso das veias cavas superior e inferior e do seio coronário', clinicalNote: 'Local de inserção de marca-passo' },
          { position: [-0.3, 0.3, 0.3], label: 'Átrio Esquerdo', description: 'Recebe sangue oxigenado das 4 veias pulmonares', clinicalNote: 'Aurícula esquerda: local comum de trombos na FA' },
          { position: [0.2, -0.2, 0.5], label: 'Ventrículo Direito', description: 'Bombeia sangue para a artéria pulmonar. Parede fina (~3mm)', clinicalNote: 'Dilatação no cor pulmonale' },
          { position: [-0.2, -0.3, 0.3], label: 'Ventrículo Esquerdo', description: 'Bombeia sangue para a aorta. Parede espessa (~13mm)', clinicalNote: 'Hipertrofia na HAS crônica' },
          { position: [0, 0.6, 0], label: 'Aorta Ascendente', description: 'Origem das coronárias. Diâmetro ~3cm', clinicalNote: 'Aneurisma >5.5cm = indicação cirúrgica' },
          { position: [0.3, 0.5, 0], label: 'Artéria Pulmonar', description: 'Tronco pulmonar bifurca em artérias pulmonares D e E', clinicalNote: 'TEP: obstrução por trombos' },
        ],
        references: [
          'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 56: Heart.',
          'Netter FH. Atlas of Human Anatomy. 7th ed. Plates 212-220.',
          'Moore KL. Clinically Oriented Anatomy. 8th ed. Cap. 1: Thorax.',
          'Tortora GJ. Principles of Anatomy and Physiology. 16th ed. Cap. 20.',
        ],
      },
      {
        id: 'aorta', name: 'Aorta', nameEn: 'Aorta', nameLatin: 'Aorta',
        description: 'Maior artéria do corpo (~2.5cm diâmetro). Origina-se do VE, forma o arco aórtico e desce como aorta torácica e abdominal até bifurcar nas ilíacas comuns (L4).',
        histology: 'Artéria elástica: túnica íntima (endotélio), média (lâminas elásticas + músculo liso), adventícia (vasa vasorum). Efeito Windkessel.',
        embryology: 'Arco aórtico: 4° arco aórtico esquerdo. Aorta descendente: aorta dorsal esquerda.',
        bloodSupply: 'Vasa vasorum na adventícia e terço externo da média.',
        innervation: 'Barorreceptores no arco aórtico (nervo vago) — reflexo barorreceptor.',
        functions: ['Distribuição de sangue oxigenado', 'Manutenção da pressão arterial (efeito Windkessel)', 'Amortecimento do pulso sistólico'],
        pathologies: ['Aneurisma de aorta (torácico/abdominal)', 'Dissecção aórtica (Stanford A/B, DeBakey I-III)', 'Coarctação da aorta', 'Aterosclerose aórtica', 'Aortite (Takayasu, sifilítica)'],
        examTips: [
          'Porções: ascendente → arco → descendente (torácica + abdominal)',
          'Ramos do arco: tronco braquiocefálico, carótida comum E, subclávia E',
          'Aorta abdominal: tronco celíaco (T12), mesentérica superior (L1), renais (L1-L2), mesentérica inferior (L3)',
          'Bifurcação: L4 (nível da crista ilíaca)',
          'Hiato aórtico do diafragma: T12',
        ],
        surgicalNotes: ['Reparo endovascular (EVAR) para aneurismas abdominais', 'Cirurgia de Bentall para aneurisma de raiz aórtica'],
        imagingNotes: ['Angio-TC: padrão-ouro para dissecção e aneurisma', 'USG abdominal: rastreio de AAA em homens >65 anos'],
        annotations: [
          { position: [0, 0.8, 0], label: 'Aorta Ascendente', description: 'Do VE até o arco. Origem das coronárias.' },
          { position: [0, 1.0, -0.3], label: 'Arco Aórtico', description: '3 ramos: tronco braquiocefálico, carótida comum E, subclávia E' },
          { position: [0, 0, -0.5], label: 'Aorta Descendente', description: 'Torácica (T4-T12) + Abdominal (T12-L4)' },
        ],
        references: [
          'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 57: Great Vessels.',
          'Netter FH. Atlas of Human Anatomy. 7th ed. Plates 221-228.',
        ],
      },
    ],
  },
  {
    id: 'nervoso',
    name: 'Sistema Nervoso',
    nameEn: 'Nervous System',
    icon: Brain,
    color: 'text-purple-500',
    threeColor: '#a855f7',
    bgColor: 'bg-purple-500/10',
    year: 1,
    description: 'Coordena e integra todas as funções do organismo. SNC (encéfalo + medula espinhal) e SNP (12 pares cranianos + 31 pares espinhais + SNA). ~86 bilhões de neurônios.',
    relatedSubjects: ['Neuroanatomia', 'Neurofisiologia', 'Neurologia', 'Neurocirurgia', 'Psiquiatria', 'Neuropatologia'],
    clinicalRelevance: [
      'AVC — 3ª causa de morte no Brasil, 1ª causa de incapacidade',
      'Epilepsia — 1-2% da população',
      'Doença de Parkinson — 2% >65 anos',
      'Doença de Alzheimer — principal causa de demência',
      'Meningites bacterianas — emergência neurológica',
      'Tumores do SNC — glioblastoma mais agressivo',
      'TCE — principal causa de morte em jovens',
      'Esclerose múltipla — doença desmielinizante mais comum',
    ],
    keyTerms: ['Sinapse', 'Potencial de ação', 'Neurotransmissores', 'BHE', 'Dermátomos', 'Pares cranianos', 'Homúnculo de Penfield', 'Vias ascendentes/descendentes', 'Polígono de Willis', 'LCR'],
    references: [
      'Machado A. Neuroanatomia Funcional. 3rd ed. Atheneu; 2014.',
      'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 22-42.',
      'Netter FH. Atlas of Human Anatomy. 7th ed. Plates 100-160.',
      'Kandel ER. Principles of Neural Science. 6th ed. McGraw-Hill; 2021.',
      'Adams & Victor\'s Principles of Neurology. 11th ed. McGraw-Hill; 2019.',
    ],
    organs: [
      {
        id: 'cerebro', name: 'Cérebro', nameEn: 'Cerebrum', nameLatin: 'Cerebrum',
        description: 'Maior porção do encéfalo (~1400g). 2 hemisférios com 4 lobos cada. Córtex cerebral: 6 camadas (neocórtex). Substância branca: fibras de associação, comissurais e de projeção.',
        histology: 'Córtex: 6 camadas (molecular, granular ext., piramidal ext., granular int., piramidal int., multiforme). Neurônios piramidais predominam. Células gliais: astrócitos, oligodendrócitos, micróglia.',
        embryology: 'Telencéfalo (prosencéfalo). Vesículas telencefálicas formam hemisférios na 5ª semana. Migração neuronal: 12-24 semanas gestacionais.',
        bloodSupply: 'Carótidas internas → ACAs + ACMs. Vertebrais → basilar → ACPs. Polígono de Willis: comunicação entre os sistemas.',
        innervation: 'Meninges: ramos meníngeos do trigêmeo (V1, V2, V3) e nervos espinhais cervicais superiores.',
        functions: ['Cognição e memória', 'Linguagem (Broca + Wernicke)', 'Controle motor voluntário', 'Percepção sensorial', 'Emoções (sistema límbico)', 'Funções executivas (córtex pré-frontal)'],
        pathologies: ['AVC isquêmico (ACM mais comum)', 'AVC hemorrágico', 'Tumores (glioblastoma, meningioma)', 'Alzheimer', 'Epilepsia', 'TCE', 'Encefalite', 'Hidrocefalia'],
        examTips: [
          'Lobo frontal: motor (giro pré-central), Broca (área 44-45), pré-frontal (executivo)',
          'Lobo parietal: sensorial (giro pós-central), integração sensorial',
          'Lobo temporal: auditivo, Wernicke (área 22), memória (hipocampo)',
          'Lobo occipital: visual (área 17)',
          'Homúnculo de Penfield: representação somatotópica no giro pré e pós-central',
          'AVC da ACM: hemiplegia contralateral + afasia (se hemisfério dominante)',
        ],
        surgicalNotes: ['Craniotomia: acesso ao parênquima cerebral', 'Neuronavegação: cirurgia guiada por imagem', 'Awake craniotomy: preservação de áreas eloquentes'],
        imagingNotes: ['TC sem contraste: 1° exame no AVC agudo', 'RM encéfalo: padrão-ouro para tumores e desmielinização', 'Angio-RM/TC: avaliação vascular'],
        annotations: [
          { position: [0, 0.5, 0.5], label: 'Lobo Frontal', description: 'Córtex motor primário, área de Broca, funções executivas', clinicalNote: 'Lesão: hemiplegia contralateral, afasia de Broca' },
          { position: [0, 0.5, -0.3], label: 'Lobo Parietal', description: 'Córtex somatossensorial primário, integração sensorial', clinicalNote: 'Lesão: hemianestesia, negligência espacial' },
          { position: [0.5, 0, 0.2], label: 'Lobo Temporal', description: 'Córtex auditivo, área de Wernicke, hipocampo', clinicalNote: 'Lesão: afasia de Wernicke, amnésia' },
          { position: [0, 0.3, -0.6], label: 'Lobo Occipital', description: 'Córtex visual primário (área 17)', clinicalNote: 'Lesão: hemianopsia homônima contralateral' },
          { position: [0, -0.3, 0], label: 'Corpo Caloso', description: 'Maior comissura cerebral — conecta os hemisférios', clinicalNote: 'Agenesia: síndrome de desconexão' },
        ],
        references: [
          'Machado A. Neuroanatomia Funcional. 3rd ed. Cap. 25-27.',
          'Netter FH. Atlas. 7th ed. Plates 100-115.',
          'Kandel ER. Principles of Neural Science. 6th ed. Cap. 17-20.',
        ],
      },
      {
        id: 'cerebelo', name: 'Cerebelo', nameEn: 'Cerebellum', nameLatin: 'Cerebellum',
        description: 'Localizado na fossa posterior, posterior ao tronco encefálico. ~10% do volume encefálico mas >50% dos neurônios. 3 lobos: anterior, posterior, floculonodular.',
        histology: 'Córtex cerebelar: 3 camadas (molecular, Purkinje, granular). Células de Purkinje: inibitórias (GABA). Fibras musgosas e trepadeiras.',
        embryology: 'Metencéfalo (rombencéfalo). Lábios rômbicos formam o cerebelo na 12ª semana.',
        bloodSupply: 'AICA (artéria cerebelar inferior anterior), PICA (posterior inferior), SCA (superior). Ramos da artéria basilar e vertebrais.',
        innervation: 'Pedúnculos cerebelares: superior (eferente), médio (aferente pontino), inferior (aferente/eferente).',
        functions: ['Coordenação motora fina', 'Equilíbrio e postura', 'Tônus muscular', 'Aprendizado motor', 'Funções cognitivas (lobo posterior)'],
        pathologies: ['Ataxia cerebelar', 'Tumores de fossa posterior (meduloblastoma em crianças)', 'AVC cerebelar (PICA)', 'Síndrome vermiana', 'Degeneração cerebelar alcoólica'],
        examTips: [
          'Vermis: equilíbrio axial (ataxia de tronco)',
          'Hemisférios: coordenação apendicular (dismetria, disdiadococinesia)',
          'Lesão cerebelar: ataxia IPSILATERAL (não cruza)',
          'Tríade: ataxia + nistagmo + disartria',
          'PICA: síndrome de Wallenberg (lateral bulbar)',
        ],
        surgicalNotes: ['Craniotomia suboccipital: acesso à fossa posterior', 'Risco: edema cerebelar com compressão do tronco'],
        imagingNotes: ['RM fossa posterior: melhor que TC (sem artefato ósseo)', 'TC: 1° exame na emergência'],
        annotations: [
          { position: [0, 0.2, 0], label: 'Vermis', description: 'Linha média — equilíbrio axial e postura' },
          { position: [0.4, 0, 0], label: 'Hemisfério D', description: 'Coordenação ipsilateral do membro superior e inferior direitos' },
          { position: [-0.4, 0, 0], label: 'Hemisfério E', description: 'Coordenação ipsilateral do membro superior e inferior esquerdos' },
        ],
        references: [
          'Machado A. Neuroanatomia Funcional. 3rd ed. Cap. 22.',
          'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 33.',
        ],
      },
    ],
  },
  {
    id: 'respiratorio',
    name: 'Sistema Respiratório',
    nameEn: 'Respiratory System',
    icon: Wind,
    color: 'text-sky-500',
    threeColor: '#0ea5e9',
    bgColor: 'bg-sky-500/10',
    year: 1,
    description: 'Trocas gasosas (O₂/CO₂) entre organismo e ambiente. Vias aéreas superiores (nariz, faringe, laringe) e inferiores (traqueia, brônquios, pulmões). Superfície alveolar: ~70m².',
    relatedSubjects: ['Anatomia', 'Fisiologia', 'Pneumologia', 'Cirurgia Torácica', 'Medicina Intensiva'],
    clinicalRelevance: [
      'Pneumonia — principal causa de internação por DRI',
      'Asma — 20 milhões de brasileiros',
      'DPOC — 4ª causa de morte no mundo',
      'Tuberculose — endêmica no Brasil (70 mil casos/ano)',
      'Câncer de pulmão — principal causa de morte por câncer',
      'TEP — emergência cardiovascular/pulmonar',
      'COVID-19 e SDRA',
      'Pneumotórax — espontâneo vs traumático',
    ],
    keyTerms: ['Hematose', 'Surfactante', 'Volume corrente', 'Capacidade vital', 'Espaço morto', 'Complacência', 'V/Q', 'Espirometria', 'Gasometria', 'PEEP'],
    references: [
      'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 53-55.',
      'Netter FH. Atlas. 7th ed. Plates 190-210.',
      'West JB. Respiratory Physiology. 11th ed. Wolters Kluwer; 2021.',
      'GOLD 2024. Global Strategy for COPD.',
      'GINA 2024. Global Strategy for Asthma.',
    ],
    organs: [
      {
        id: 'pulmoes', name: 'Pulmões', nameEn: 'Lungs', nameLatin: 'Pulmones',
        description: 'Órgãos pares na cavidade torácica. Pulmão D: 3 lobos (superior, médio, inferior), 10 segmentos. Pulmão E: 2 lobos (superior com língula, inferior), 8-9 segmentos. ~300 milhões de alvéolos.',
        histology: 'Brônquios: epitélio pseudoestratificado ciliado com células caliciformes. Bronquíolos: epitélio cúbico simples com células Clara. Alvéolos: pneumócitos I (trocas) e II (surfactante).',
        embryology: 'Endoderma do intestino anterior. Fases: embrionária (4-7 sem), pseudoglandular (7-17), canalicular (17-27), sacular (27-36), alveolar (36 sem - 8 anos).',
        bloodSupply: 'Circulação pulmonar: artérias pulmonares (sangue venoso para hematose). Circulação brônquica: artérias brônquicas (ramos da aorta — nutrição).',
        innervation: 'Plexo pulmonar: simpático (broncodilatação) e parassimpático/vago (broncoconstrição, secreção).',
        functions: ['Hematose (trocas gasosas O₂/CO₂)', 'Regulação do pH sanguíneo', 'Filtração de êmbolos', 'Produção de surfactante', 'Conversão de angiotensina I→II (ECA pulmonar)', 'Defesa imunológica (macrófagos alveolares)'],
        pathologies: ['Pneumonia (CAP, HAP)', 'DPOC (enfisema + bronquite crônica)', 'Asma', 'Fibrose pulmonar', 'Câncer de pulmão (CPNPC, CPPC)', 'Pneumotórax', 'Derrame pleural', 'TB pulmonar', 'SDRA'],
        examTips: [
          'Pulmão D: 3 lobos, 10 segmentos, brônquio principal mais vertical e curto',
          'Pulmão E: 2 lobos, 8-9 segmentos, impressão cardíaca, língula',
          'Hilo: brônquio principal, artéria pulmonar, veias pulmonares (2 em cada lado)',
          'Fissura oblíqua: ambos os pulmões. Fissura horizontal: apenas pulmão D',
          'Aspiração de corpo estranho: brônquio principal D (mais vertical)',
          'Toracocentese: 7° EIC, linha axilar posterior, borda superior da costela inferior',
        ],
        surgicalNotes: ['Lobectomia: ressecção de lobo (câncer estágio I-II)', 'Pneumonectomia: ressecção total', 'VATS: videotoracoscopia', 'Drenagem torácica: 5° EIC, linha axilar média'],
        imagingNotes: ['RX tórax PA e perfil: 1° exame', 'TC tórax: padrão-ouro para nódulos e massas', 'Broncoscopia: visualização direta das vias aéreas'],
        annotations: [
          { position: [0.4, 0.3, 0], label: 'Lobo Superior D', description: 'Segmentos: apical, posterior, anterior' },
          { position: [0.4, 0, 0], label: 'Lobo Médio D', description: 'Segmentos: lateral e medial' },
          { position: [0.4, -0.3, 0], label: 'Lobo Inferior D', description: 'Segmentos: superior, basal medial, anterior, lateral, posterior' },
          { position: [-0.4, 0.2, 0], label: 'Lobo Superior E', description: 'Inclui a língula (segmentos superior e inferior)' },
          { position: [-0.4, -0.3, 0], label: 'Lobo Inferior E', description: 'Segmentos: superior, basal anteromedial, lateral, posterior' },
        ],
        references: [
          'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 54: Lungs.',
          'West JB. Respiratory Physiology. 11th ed. Cap. 1-4.',
          'Netter FH. Atlas. 7th ed. Plates 192-200.',
        ],
      },
    ],
  },
  {
    id: 'digestorio',
    name: 'Sistema Digestório',
    nameEn: 'Digestive System',
    icon: Utensils,
    color: 'text-amber-500',
    threeColor: '#f59e0b',
    bgColor: 'bg-amber-500/10',
    year: 2,
    description: 'Digestão mecânica e química, absorção de nutrientes e eliminação de resíduos. Trato GI (~9m): boca → faringe → esôfago → estômago → intestino delgado → intestino grosso → reto → ânus. Glândulas anexas: fígado, pâncreas, vesícula biliar.',
    relatedSubjects: ['Anatomia', 'Fisiologia', 'Gastroenterologia', 'Cirurgia do Aparelho Digestivo', 'Nutrição', 'Hepatologia'],
    clinicalRelevance: [
      'DRGE — 12% da população brasileira',
      'Úlcera péptica e H. pylori — 50% da população mundial infectada',
      'Apendicite aguda — emergência cirúrgica mais comum',
      'Hepatites virais (B e C)',
      'Cirrose hepática — 8ª causa de morte',
      'Câncer colorretal — 3° câncer mais comum',
      'Câncer gástrico — 5° mais comum no Brasil',
      'Pancreatite aguda — biliar é a causa mais comum',
    ],
    keyTerms: ['Peristaltismo', 'Enzimas digestivas', 'Bile', 'Microbiota', 'Absorção', 'Motilidade', 'Esfíncter de Oddi', 'Tríade portal', 'Segmentação de Couinaud'],
    references: [
      'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 62-72.',
      'Netter FH. Atlas. 7th ed. Plates 260-310.',
      'Sabiston Textbook of Surgery. 21st ed. Elsevier; 2022.',
    ],
    organs: [
      {
        id: 'figado', name: 'Fígado', nameEn: 'Liver', nameLatin: 'Hepar',
        description: 'Maior glândula do corpo (~1500g). Hipocôndrio D + epigástrio. Dupla irrigação: artéria hepática (30%) + veia porta (70%). 8 segmentos (Couinaud). ~100 bilhões de hepatócitos.',
        histology: 'Lóbulos hepáticos hexagonais: hepatócitos em cordões, sinusoides, espaço de Disse, células de Kupffer (macrófagos), células estreladas (Ito — fibrose). Tríade portal: ramo da veia porta + artéria hepática + ducto biliar.',
        embryology: 'Divertículo hepático do intestino anterior (endoderma) na 4ª semana. Hematopoiese fetal (6ª semana - nascimento).',
        bloodSupply: 'Artéria hepática própria (ramo do tronco celíaco) + Veia porta (confluência da mesentérica superior + esplênica). Drenagem: veias hepáticas → VCI.',
        innervation: 'Plexo hepático: simpático (T7-T10) e parassimpático (vago anterior — ramo hepático).',
        functions: ['Metabolismo de carboidratos, lipídios e proteínas', 'Produção de bile (500-1000mL/dia)', 'Detoxificação e biotransformação', 'Síntese de fatores de coagulação (II, VII, IX, X)', 'Armazenamento de glicogênio, ferro, vitaminas A, D, B12', 'Produção de albumina', 'Metabolismo de bilirrubina'],
        pathologies: ['Hepatites virais (A, B, C, D, E)', 'Cirrose', 'Esteatose hepática (MASLD)', 'Hepatocarcinoma (CHC)', 'Insuficiência hepática aguda', 'Hipertensão portal', 'Abscesso hepático'],
        examTips: [
          'Segmentação de Couinaud: 8 segmentos baseados nas veias hepáticas e porta',
          'Dupla irrigação: artéria hepática + veia porta',
          'Espaço de Disse: entre hepatócitos e sinusoides — fibrose na cirrose',
          'Ligamento falciforme: divide lobos anatômicos D e E',
          'Tríade portal (espaço porta): veia porta + artéria hepática + ducto biliar',
          'Child-Pugh e MELD: classificação da cirrose',
        ],
        surgicalNotes: ['Hepatectomia: ressecção segmentar ou lobar', 'Transplante hepático: indicação MELD ≥15', 'Shunt portossistêmico (TIPS): hipertensão portal refratária'],
        imagingNotes: ['USG abdome: 1° exame (esteatose, nódulos, ascite)', 'TC trifásica: padrão-ouro para CHC (wash-in arterial, wash-out portal)', 'RM com contraste hepatoespecífico (Primovist)'],
        annotations: [
          { position: [0.3, 0.2, 0.3], label: 'Lobo Direito', description: 'Maior lobo — segmentos V, VI, VII, VIII' },
          { position: [-0.3, 0.2, 0.3], label: 'Lobo Esquerdo', description: 'Segmentos II, III, IV' },
          { position: [0, -0.1, 0.5], label: 'Porta Hepatis', description: 'Hilo hepático: tríade portal (veia porta, artéria hepática, ducto hepático comum)' },
          { position: [0.2, 0, 0.5], label: 'Vesícula Biliar', description: 'Armazena e concentra bile. Fundo, corpo, infundíbulo, colo' },
        ],
        references: [
          'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 65: Liver.',
          'Sabiston. 21st ed. Cap. 54: Liver.',
          'Netter FH. Atlas. 7th ed. Plates 280-290.',
        ],
      },
    ],
  },
  {
    id: 'musculoesqueletico',
    name: 'Sistema Musculoesquelético',
    nameEn: 'Musculoskeletal System',
    icon: Bone,
    color: 'text-stone-500',
    threeColor: '#78716c',
    bgColor: 'bg-stone-500/10',
    year: 1,
    description: 'Sustentação, proteção e movimento. 206 ossos no adulto, ~640 músculos esqueléticos, articulações sinoviais, tendões, ligamentos, cartilagens. Esqueleto axial (80 ossos) + apendicular (126 ossos).',
    relatedSubjects: ['Anatomia', 'Fisiologia', 'Ortopedia', 'Reumatologia', 'Fisiatria', 'Medicina Esportiva'],
    clinicalRelevance: [
      'Fraturas — classificação AO/OTA',
      'Artrose — doença articular mais comum',
      'Artrite reumatoide — 1% da população',
      'Lombalgia — queixa musculoesquelética mais comum',
      'Osteoporose — 10 milhões de brasileiros',
      'Lesões ligamentares do joelho (LCA)',
      'Síndrome do túnel do carpo',
      'Hérnia de disco lombar',
    ],
    keyTerms: ['Osteoblastos', 'Osteoclastos', 'Sarcômero', 'Contração muscular', 'Articulação sinovial', 'Remodelação óssea', 'Plexo braquial', 'Plexo lombossacral'],
    references: [
      'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 43-52, 78-84.',
      'Netter FH. Atlas. 7th ed. Plates 400-500.',
      'Hoppenfeld S. Physical Examination of the Spine and Extremities. Pearson; 1976.',
    ],
    organs: [
      {
        id: 'coluna', name: 'Coluna Vertebral', nameEn: 'Vertebral Column', nameLatin: 'Columna vertebralis',
        description: '33 vértebras: 7 cervicais, 12 torácicas, 5 lombares, 5 sacrais (fundidas), 4 coccígeas (fundidas). Curvaturas: lordose cervical e lombar, cifose torácica e sacral. Discos intervertebrais entre C2-S1.',
        histology: 'Osso cortical (compacto) + esponjoso (trabecular). Disco intervertebral: anel fibroso (fibrocartilagem) + núcleo pulposo (gelatinoso). Ligamentos: longitudinal anterior e posterior, amarelo, interespinhoso.',
        embryology: 'Esclerótomos dos somitos mesodérmicos. Notocorda → núcleo pulposo. Ossificação endocondral.',
        bloodSupply: 'Artérias segmentares (ramos da aorta). Artéria espinhal anterior e posteriores (medula).',
        innervation: 'Nervos espinhais: 8 cervicais, 12 torácicos, 5 lombares, 5 sacrais, 1 coccígeo.',
        functions: ['Sustentação do corpo e postura ereta', 'Proteção da medula espinhal', 'Mobilidade do tronco', 'Absorção de impactos (discos)', 'Hematopoiese (medula óssea vermelha)'],
        pathologies: ['Hérnia de disco (L4-L5 e L5-S1 mais comuns)', 'Espondilolistese', 'Escoliose', 'Fratura vertebral (osteoporótica, traumática)', 'Estenose do canal', 'Espondilite anquilosante', 'Metástases vertebrais'],
        examTips: [
          'C1 (atlas): sem corpo vertebral, sem processo espinhoso',
          'C2 (áxis): processo odontoide (dente)',
          'C7: vértebra proeminente (processo espinhoso longo e palpável)',
          'Curvaturas: lordose cervical/lombar (secundárias), cifose torácica/sacral (primárias)',
          'Medula espinhal termina em L1-L2 (cone medular)',
          'Punção lombar: L3-L4 ou L4-L5 (abaixo do cone medular)',
          'Dermátomos: C5 (deltóide), T4 (mamilo), T10 (umbigo), L1 (virilha), S1 (planta do pé)',
        ],
        surgicalNotes: ['Discectomia: remoção de disco herniado', 'Artrodese: fusão vertebral', 'Laminectomia: descompressão do canal'],
        imagingNotes: ['RX coluna: avaliação inicial', 'RM coluna: padrão-ouro para disco e medula', 'TC: fraturas e detalhes ósseos'],
        annotations: [
          { position: [0, 0.8, 0], label: 'Cervical (C1-C7)', description: '7 vértebras — maior mobilidade, menor carga' },
          { position: [0, 0.3, 0], label: 'Torácica (T1-T12)', description: '12 vértebras — articulação com costelas' },
          { position: [0, -0.2, 0], label: 'Lombar (L1-L5)', description: '5 vértebras — maior carga, hérnia de disco mais comum' },
          { position: [0, -0.6, 0], label: 'Sacro (S1-S5)', description: '5 vértebras fundidas — articulação sacroilíaca' },
        ],
        references: [
          'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 43: Back.',
          'Netter FH. Atlas. 7th ed. Plates 148-160.',
        ],
      },
    ],
  },
  {
    id: 'urinario',
    name: 'Sistema Urinário',
    nameEn: 'Urinary System',
    icon: Droplets,
    color: 'text-yellow-600',
    threeColor: '#ca8a04',
    bgColor: 'bg-yellow-500/10',
    year: 2,
    description: 'Filtração do sangue, produção de urina e regulação hidroeletrolítica. Rins (2), ureteres (2), bexiga (1), uretra (1). Filtração: ~180L/dia → 1-2L urina.',
    relatedSubjects: ['Anatomia', 'Fisiologia', 'Nefrologia', 'Urologia', 'Medicina Intensiva'],
    clinicalRelevance: [
      'DRC — 10% da população mundial',
      'IRA — 5-7% das internações hospitalares',
      'ITU — infecção bacteriana mais comum em mulheres',
      'Litíase renal — 10% da população',
      'Síndrome nefrótica e nefrítica',
      'Glomerulonefrites',
      'Câncer renal — carcinoma de células claras mais comum',
    ],
    keyTerms: ['Néfron', 'TFG', 'Reabsorção tubular', 'ADH', 'Aldosterona', 'SRAA', 'Clearance de creatinina', 'Proteinúria', 'Hematúria'],
    references: [
      'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 73-74.',
      'Netter FH. Atlas. 7th ed. Plates 320-340.',
      'Guyton AC. Textbook of Medical Physiology. 14th ed. Cap. 26-31.',
      'KDIGO 2024. Clinical Practice Guidelines for CKD.',
    ],
    organs: [
      {
        id: 'rins', name: 'Rins', nameEn: 'Kidneys', nameLatin: 'Renes',
        description: 'Órgãos pares retroperitoneais (~150g cada, 11x6x3cm). Rim D mais baixo (fígado). Cada rim: ~1 milhão de néfrons. Córtex (glomérulos + túbulos contorcidos) e medula (pirâmides renais + alças de Henle + ductos coletores).',
        histology: 'Néfron: glomérulo (capilares fenestrados + podócitos + membrana basal) + cápsula de Bowman + TCP + alça de Henle + TCD + ducto coletor. Aparelho justaglomerular: mácula densa + células granulares (renina).',
        embryology: 'Mesoderma intermediário. 3 estágios: pronefro (3ª sem, regride), mesonefro (4ª sem, transitório), metanefro (5ª sem, rim definitivo). Broto ureteral → sistema coletor. Blastema metanéfrico → néfrons.',
        bloodSupply: 'Artérias renais (ramos da aorta em L1-L2) → segmentares → interlobares → arqueadas → interlobulares → arteríolas aferentes → glomérulo → arteríolas eferentes → capilares peritubulares/vasa recta.',
        innervation: 'Plexo renal: simpático (T10-L1) — vasoconstrição, liberação de renina. Parassimpático: mínimo.',
        functions: ['Filtração glomerular (TFG ~125mL/min)', 'Regulação da PA (SRAA)', 'Equilíbrio ácido-base', 'Produção de eritropoietina', 'Ativação de vitamina D (1,25-dihidroxi)', 'Gliconeogênese', 'Regulação do cálcio e fósforo'],
        pathologies: ['DRC (estágios 1-5)', 'IRA (pré-renal, renal, pós-renal)', 'Glomerulonefrite', 'Pielonefrite', 'Carcinoma renal', 'Rim policístico (ADPKD)', 'Nefropatia diabética', 'Síndrome nefrótica'],
        examTips: [
          'Rim D mais baixo que o E (fígado)',
          'Irrigação: artérias renais (ramos diretos da aorta)',
          'Néfron: unidade funcional — glomérulo + túbulos + ducto coletor',
          'TFG normal: 90-120 mL/min/1.73m²',
          'Aparelho justaglomerular: regula TFG e secreta renina',
          'Sinal de Giordano: punho-percussão lombar positiva na pielonefrite',
        ],
        surgicalNotes: ['Nefrectomia parcial: tumores <7cm (T1)', 'Nefrectomia radical: tumores maiores', 'Transplante renal: TFG <15 ou diálise'],
        imagingNotes: ['USG renal: 1° exame (hidronefrose, cistos, cálculos)', 'TC abdome com contraste: estadiamento tumoral', 'Cintilografia renal (DMSA/DTPA): função renal diferencial'],
        annotations: [
          { position: [0.3, 0.3, 0], label: 'Córtex Renal', description: 'Glomérulos e túbulos contorcidos — filtração e reabsorção' },
          { position: [0.3, 0, 0], label: 'Medula Renal', description: 'Pirâmides renais — concentração da urina (alça de Henle)' },
          { position: [0, 0, 0.3], label: 'Pelve Renal', description: 'Coleta urina dos cálices maiores → ureter' },
          { position: [0, 0.4, 0.3], label: 'Hilo Renal', description: 'Artéria renal, veia renal, pelve renal (VAP — de anterior para posterior)' },
        ],
        references: [
          'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 73: Kidney.',
          'Guyton AC. 14th ed. Cap. 26: Urine Formation.',
          'KDIGO 2024 CKD Guidelines.',
        ],
      },
    ],
  },
  {
    id: 'endocrino',
    name: 'Sistema Endócrino',
    nameEn: 'Endocrine System',
    icon: Zap,
    color: 'text-emerald-500',
    threeColor: '#10b981',
    bgColor: 'bg-emerald-500/10',
    year: 2,
    description: 'Regulação de funções corporais por hormônios. Glândulas: hipotálamo, hipófise, tireoide, paratireoides, suprarrenais, pâncreas endócrino, gônadas, pineal. Eixos hormonais com feedback.',
    relatedSubjects: ['Fisiologia', 'Endocrinologia', 'Bioquímica', 'Farmacologia', 'Ginecologia'],
    clinicalRelevance: [
      'DM tipo 2 — 16 milhões de brasileiros',
      'DM tipo 1 — autoimune, pico na infância',
      'Hipotireoidismo — 5-10% da população',
      'Hipertireoidismo (Graves) — 0.5%',
      'Síndrome de Cushing',
      'Insuficiência adrenal (Addison)',
      'Feocromocitoma',
      'Nódulos tireoidianos — 50% da população >50 anos',
    ],
    keyTerms: ['Feedback negativo', 'Eixo HHA', 'Eixo HHT', 'Eixo HHG', 'Receptores hormonais', 'Hormônios tróficos', 'Glicemia', 'TSH', 'Cortisol', 'Insulina'],
    references: [
      'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 24, 71, 76.',
      'Guyton AC. 14th ed. Cap. 76-83.',
      'Williams Textbook of Endocrinology. 14th ed. Elsevier; 2020.',
      'ADA Standards of Care 2024.',
    ],
    organs: [
      {
        id: 'tireoide', name: 'Tireoide', nameEn: 'Thyroid', nameLatin: 'Glandula thyroidea',
        description: 'Glândula em borboleta na região cervical anterior (C5-T1). ~20g. 2 lobos + istmo. Produz T3, T4 (metabolismo) e calcitonina (cálcio). Maior glândula endócrina.',
        histology: 'Folículos tireoidianos: células foliculares (T3/T4) + coloide (tireoglobulina). Células parafoliculares (C): calcitonina. Estroma com capilares fenestrados.',
        embryology: 'Endoderma do assoalho faríngeo (forame cego da língua). Migração caudal pelo ducto tireoglosso (pode persistir como cisto).',
        bloodSupply: 'Artérias tireóideas superior (ramo da carótida externa) e inferior (ramo do tronco tireocervical). Artéria tireóidea ima (10%, ramo da aorta/braquiocefálica).',
        innervation: 'Simpático: gânglios cervicais. Nervo laríngeo recorrente (ramo do vago): passa posterior à tireoide — RISCO CIRÚRGICO. Nervo laríngeo superior (ramo externo): cricotireóideo.',
        functions: ['Regulação do metabolismo basal (T3/T4)', 'Crescimento e desenvolvimento (essencial no feto/neonato)', 'Termogênese', 'Regulação do cálcio (calcitonina — menor papel que PTH)'],
        pathologies: ['Hipotireoidismo (Hashimoto — mais comum)', 'Hipertireoidismo (Graves — mais comum)', 'Nódulos tireoidianos', 'Câncer de tireoide (papilar mais comum — 80%)', 'Tireoidite subaguda (De Quervain)', 'Bócio multinodular'],
        examTips: [
          'TSH: principal exame de triagem (↑ no hipo, ↓ no hiper)',
          'T4 livre: confirma diagnóstico',
          'Anti-TPO: Hashimoto. TRAb: Graves',
          'PAAF: avaliação de nódulos (Bethesda I-VI)',
          'Nervo laríngeo recorrente: risco na tireoidectomia (rouquidão)',
          'Câncer papilar: melhor prognóstico, disseminação linfática',
        ],
        surgicalNotes: ['Tireoidectomia total: câncer, Graves refratário', 'Lobectomia: nódulo suspeito unilateral', 'Risco: lesão do laríngeo recorrente (1-2%), hipoparatireoidismo'],
        imagingNotes: ['USG cervical: 1° exame para nódulos (TI-RADS)', 'Cintilografia: nódulo quente (hiperfuncionante) vs frio', 'PAAF guiada por USG: nódulos >1cm ou suspeitos'],
        annotations: [
          { position: [0.3, 0, 0.3], label: 'Lobo Direito', description: 'Maior que o esquerdo em 50% dos casos' },
          { position: [-0.3, 0, 0.3], label: 'Lobo Esquerdo', description: 'Relação posterior com nervo laríngeo recorrente E' },
          { position: [0, 0, 0.4], label: 'Istmo', description: 'Conecta os lobos — anterior à traqueia (2°-3° anel)' },
          { position: [0.2, 0.3, 0.2], label: 'Paratireoides', description: '4 glândulas (2 sup + 2 inf) — PTH (cálcio)' },
        ],
        references: [
          'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 24: Thyroid.',
          'Williams Endocrinology. 14th ed. Cap. 11-12.',
          'Haugen BR et al. ATA Guidelines Thyroid Nodules. Thyroid. 2016;26(1):1-133.',
        ],
      },
    ],
  },
  {
    id: 'imunologico',
    name: 'Sistema Imunológico',
    nameEn: 'Immune System',
    icon: Shield,
    color: 'text-indigo-500',
    threeColor: '#6366f1',
    bgColor: 'bg-indigo-500/10',
    year: 2,
    description: 'Defesa contra patógenos. Imunidade inata (inespecífica, rápida) e adaptativa (específica, memória). Órgãos linfoides primários (medula óssea, timo) e secundários (linfonodos, baço, MALT).',
    relatedSubjects: ['Imunologia', 'Microbiologia', 'Patologia', 'Infectologia', 'Reumatologia', 'Alergia', 'Oncologia'],
    clinicalRelevance: [
      'HIV/AIDS — 920 mil brasileiros vivendo com HIV',
      'Doenças autoimunes (LES, AR, esclerose múltipla)',
      'Alergias e anafilaxia',
      'Imunodeficiências primárias',
      'Transplante e rejeição',
      'Imunoterapia oncológica (anti-PD1, anti-CTLA4)',
      'Vacinação — programa nacional de imunizações',
    ],
    keyTerms: ['Antígeno', 'Anticorpo', 'Linfócitos T e B', 'MHC/HLA', 'Complemento', 'Citocinas', 'Imunoglobulinas', 'Células NK', 'Fagocitose', 'Apresentação de antígenos'],
    references: [
      'Abbas AK. Cellular and Molecular Immunology. 10th ed. Elsevier; 2022.',
      'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 71-72.',
      'Janeway\'s Immunobiology. 9th ed. Garland Science; 2017.',
    ],
    organs: [
      {
        id: 'baco', name: 'Baço', nameEn: 'Spleen', nameLatin: 'Lien/Splen',
        description: 'Maior órgão linfoide (~150g). Hipocôndrio E, posterior ao estômago. Intraperitoneal. Polpa branca (imune) e vermelha (filtração). Não é palpável normalmente.',
        histology: 'Polpa branca: bainha linfoide periarteriolar (PALS — linfócitos T) + folículos (linfócitos B). Polpa vermelha: cordões de Billroth + sinusoides esplênicos — filtração de hemácias.',
        embryology: 'Mesoderma do mesogástrio dorsal (5ª semana). Hematopoiese fetal transitória.',
        bloodSupply: 'Artéria esplênica (maior ramo do tronco celíaco). Veia esplênica → veia porta.',
        innervation: 'Plexo esplênico: simpático (plexo celíaco).',
        functions: ['Filtração de hemácias velhas/defeituosas', 'Produção de anticorpos (IgM)', 'Reservatório de plaquetas (30%)', 'Hematopoiese fetal', 'Remoção de corpúsculos de Howell-Jolly'],
        pathologies: ['Esplenomegalia (infecções, hipertensão portal, hematológicas)', 'Ruptura esplênica (trauma — emergência)', 'Asplenia funcional (anemia falciforme)', 'Infarto esplênico', 'Linfoma esplênico'],
        examTips: [
          'Palpável apenas quando aumentado 2-3x (esplenomegalia)',
          'Polpa branca: função imune (linfócitos T e B)',
          'Polpa vermelha: filtração de hemácias',
          'Esplenectomia: risco de infecções por encapsulados (pneumococo, meningococo, H. influenzae)',
          'Pós-esplenectomia: vacinação obrigatória + corpúsculos de Howell-Jolly no sangue periférico',
          'Sinal de Kehr: dor no ombro E por irritação diafragmática (ruptura esplênica)',
        ],
        surgicalNotes: ['Esplenectomia: trauma grau IV-V, PTI refratária', 'Esplenectomia parcial: preservação de função imune', 'Embolização esplênica: alternativa em trauma'],
        imagingNotes: ['USG abdome: medida do baço (normal <13cm)', 'TC com contraste: trauma, infarto, massas', 'Cintilografia: função esplênica'],
        annotations: [
          { position: [0, 0.2, 0.3], label: 'Polpa Branca', description: 'Tecido linfoide — resposta imune adaptativa' },
          { position: [0, -0.1, 0.3], label: 'Polpa Vermelha', description: 'Sinusoides — filtração de hemácias velhas' },
          { position: [-0.3, 0, 0], label: 'Hilo Esplênico', description: 'Artéria e veia esplênica, vasos linfáticos' },
        ],
        references: [
          'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 71: Spleen.',
          'Abbas AK. Immunology. 10th ed. Cap. 2.',
        ],
      },
    ],
  },
  {
    id: 'reprodutor_masculino',
    name: 'Sistema Reprodutor Masculino',
    nameEn: 'Male Reproductive System',
    icon: Activity,
    color: 'text-blue-500',
    threeColor: '#3b82f6',
    bgColor: 'bg-blue-500/10',
    year: 3,
    description: 'Produção de espermatozoides e hormônios sexuais masculinos. Testículos, epidídimo, ducto deferente, vesículas seminais, próstata, uretra, pênis.',
    relatedSubjects: ['Anatomia', 'Urologia', 'Endocrinologia', 'Oncologia'],
    clinicalRelevance: [
      'Hiperplasia prostática benigna — 50% dos homens >50 anos',
      'Câncer de próstata — 2° câncer mais comum em homens',
      'Câncer de testículo — mais comum em jovens (15-35 anos)',
      'Varicocele — causa mais comum de infertilidade masculina tratável',
      'Torção testicular — emergência urológica',
      'DSTs: HPV, sífilis, gonorreia, clamídia',
    ],
    keyTerms: ['Espermatogênese', 'Testosterona', 'PSA', 'Células de Leydig', 'Células de Sertoli', 'Eixo HHG', 'FSH', 'LH'],
    references: [
      'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 76-77.',
      'Netter FH. Atlas. 7th ed. Plates 360-380.',
      'Campbell-Walsh-Wein Urology. 12th ed. Elsevier; 2021.',
    ],
    organs: [
      {
        id: 'prostata', name: 'Próstata', nameEn: 'Prostate', nameLatin: 'Prostata',
        description: 'Glândula exócrina (~20g, tamanho de noz). Inferior à bexiga, anterior ao reto. Envolve a uretra prostática. Zonas: periférica (70%), central (25%), transicional (5%).',
        histology: 'Glândulas tubuloalveolares + estroma fibromuscular. Epitélio colunar secretor. Corpos amiláceos (concreções prostáticas) aumentam com idade.',
        embryology: 'Endoderma do seio urogenital. Desenvolvimento dependente de DHT (5α-redutase).',
        bloodSupply: 'Artéria vesical inferior (ramo da ilíaca interna). Plexo venoso prostático → plexo de Batson (metástases ósseas).',
        innervation: 'Plexo prostático: simpático (ejaculação) e parassimpático (secreção). Nervos cavernosos passam posterolateralmente — risco na prostatectomia.',
        functions: ['Secreção prostática (30% do sêmen)', 'PSA (liquefação do coágulo seminal)', 'Fosfatase ácida', 'Zinco e citrato'],
        pathologies: ['HPB (zona transicional)', 'Câncer de próstata (zona periférica — 70%)', 'Prostatite (aguda/crônica)', 'Abscesso prostático'],
        examTips: [
          'Toque retal: avaliação de tamanho, consistência, nódulos',
          'PSA: rastreio (>4ng/mL suspeito, mas não específico)',
          'HPB: zona transicional — sintomas obstrutivos (LUTS)',
          'Câncer: zona periférica — palpável ao toque retal',
          'Gleason score: graduação histológica (6-10)',
          'Metástases: ósseas (blásticas) via plexo de Batson',
        ],
        surgicalNotes: ['Prostatectomia radical: câncer localizado', 'RTU-P: HPB refratária', 'Risco: incontinência e disfunção erétil (nervos cavernosos)'],
        imagingNotes: ['USG transretal: biópsia guiada', 'RM multiparamétrica: PI-RADS (estadiamento)', 'Cintilografia óssea: metástases'],
        annotations: [
          { position: [0, 0.2, 0.3], label: 'Zona Periférica', description: '70% do tecido — local mais comum de câncer' },
          { position: [0, 0, 0.3], label: 'Zona Transicional', description: '5% do tecido — local da HPB' },
          { position: [0, 0, 0], label: 'Uretra Prostática', description: 'Atravessa a próstata — comprimida na HPB' },
        ],
        references: [
          'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 77: Prostate.',
          'Campbell-Walsh Urology. 12th ed. Cap. 106-110.',
        ],
      },
    ],
  },
  {
    id: 'reprodutor_feminino',
    name: 'Sistema Reprodutor Feminino',
    nameEn: 'Female Reproductive System',
    icon: Baby,
    color: 'text-pink-500',
    threeColor: '#ec4899',
    bgColor: 'bg-pink-500/10',
    year: 3,
    description: 'Produção de óvulos, hormônios sexuais femininos, gestação e parto. Ovários, tubas uterinas, útero, vagina, vulva, glândulas mamárias.',
    relatedSubjects: ['Anatomia', 'Ginecologia', 'Obstetrícia', 'Endocrinologia', 'Oncologia'],
    clinicalRelevance: [
      'Câncer de mama — câncer mais comum em mulheres',
      'Câncer de colo uterino — HPV (tipos 16 e 18)',
      'Endometriose — 10% das mulheres em idade reprodutiva',
      'Miomas uterinos — 50% das mulheres >35 anos',
      'SOP — causa mais comum de anovulação',
      'Gravidez ectópica — emergência ginecológica',
      'Pré-eclâmpsia — 5-8% das gestações',
    ],
    keyTerms: ['Ciclo menstrual', 'Ovulação', 'Estrogênio', 'Progesterona', 'FSH', 'LH', 'hCG', 'Endométrio', 'Placenta'],
    references: [
      'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 77-78.',
      'Netter FH. Atlas. 7th ed. Plates 340-360.',
      'Williams Obstetrics. 26th ed. McGraw-Hill; 2022.',
      'Berek & Novak\'s Gynecology. 16th ed. Wolters Kluwer; 2020.',
    ],
    organs: [
      {
        id: 'utero', name: 'Útero', nameEn: 'Uterus', nameLatin: 'Uterus',
        description: 'Órgão muscular piriforme (~7x5x2.5cm). Posição: anteversoflexão (80%). Partes: fundo, corpo, istmo, colo (ectocérvice + endocérvice). Camadas: endométrio, miométrio, perimétrio.',
        histology: 'Endométrio: epitélio colunar simples + estroma + glândulas (funcional + basal). Miométrio: 3 camadas de músculo liso. Perimétrio: serosa peritoneal.',
        embryology: 'Ductos paramesonéfricos (de Müller) — fusão na linha média. Anomalias: útero bicorno, septado, didelfo.',
        bloodSupply: 'Artéria uterina (ramo da ilíaca interna) — cruza o ureter ("água passa sob a ponte"). Anastomose com artéria ovárica.',
        innervation: 'Plexo uterovaginal: simpático (T10-L1) e parassimpático (S2-S4). Dor do parto: T10-L1.',
        functions: ['Implantação do embrião', 'Nutrição fetal (placenta)', 'Contrações no parto', 'Menstruação (descamação do endométrio funcional)'],
        pathologies: ['Miomas (leiomiomas — mais comum)', 'Adenomiose', 'Endometriose', 'Câncer de endométrio', 'Câncer de colo uterino (HPV)', 'Prolapso uterino', 'Gravidez ectópica cervical'],
        examTips: [
          'Posição normal: anteversoflexão',
          'Artéria uterina cruza o ureter (risco na histerectomia)',
          'Colo uterino: JEC (junção escamocolunar) — zona de transformação (Papanicolaou)',
          'Miomas: subserosos, intramurais, submucosos',
          'Câncer de endométrio: sangramento pós-menopausa',
          'Câncer de colo: rastreio com Papanicolaou (25-64 anos)',
        ],
        surgicalNotes: ['Histerectomia total: remoção de corpo + colo', 'Miomectomia: preservação da fertilidade', 'Conização: lesão intraepitelial de alto grau'],
        imagingNotes: ['USG transvaginal: 1° exame (miomas, endométrio, ovários)', 'RM pelve: estadiamento de câncer', 'Histeroscopia: visualização direta da cavidade'],
        annotations: [
          { position: [0, 0.3, 0], label: 'Fundo Uterino', description: 'Porção superior — acima da inserção das tubas' },
          { position: [0, 0, 0.3], label: 'Corpo Uterino', description: 'Porção principal — miométrio espesso' },
          { position: [0, -0.3, 0.2], label: 'Colo Uterino', description: 'Porção inferior — JEC (zona de transformação)' },
          { position: [0.4, 0.3, 0], label: 'Tuba Uterina D', description: 'Infundíbulo com fímbrias — captação do óvulo' },
        ],
        references: [
          'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 77: Uterus.',
          'Berek & Novak. 16th ed. Cap. 1-3.',
          'Williams Obstetrics. 26th ed. Cap. 3.',
        ],
      },
    ],
  },
  {
    id: 'tegumentar',
    name: 'Sistema Tegumentar',
    nameEn: 'Integumentary System',
    icon: Eye,
    color: 'text-orange-500',
    threeColor: '#f97316',
    bgColor: 'bg-orange-500/10',
    year: 1,
    description: 'Maior órgão do corpo (~1.5-2m², 3-4kg). Pele (epiderme + derme), hipoderme, anexos (pelos, unhas, glândulas sudoríparas e sebáceas). Funções: proteção, termorregulação, sensorial, imunológica.',
    relatedSubjects: ['Histologia', 'Dermatologia', 'Cirurgia Plástica', 'Patologia', 'Imunologia'],
    clinicalRelevance: [
      'Melanoma — câncer de pele mais letal',
      'Carcinoma basocelular — câncer de pele mais comum',
      'Psoríase — 2-3% da população',
      'Dermatite atópica — 15-20% das crianças',
      'Queimaduras — regra dos 9 de Wallace',
      'Úlceras de pressão',
      'Infecções cutâneas (celulite, erisipela, impetigo)',
    ],
    keyTerms: ['Queratinócitos', 'Melanócitos', 'Células de Langerhans', 'Derme papilar/reticular', 'Colágeno', 'Elastina', 'Glândulas écrinas/apócrinas'],
    references: [
      'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 7: Skin.',
      'Netter FH. Atlas. 7th ed. Plates 1-5.',
      'Fitzpatrick\'s Dermatology. 9th ed. McGraw-Hill; 2019.',
    ],
    organs: [
      {
        id: 'pele', name: 'Pele', nameEn: 'Skin', nameLatin: 'Cutis',
        description: 'Epiderme (epitélio estratificado pavimentoso queratinizado): 5 camadas (basal, espinhosa, granulosa, lúcida, córnea). Derme: papilar (tecido conjuntivo frouxo) + reticular (denso). Hipoderme: tecido adiposo.',
        histology: 'Epiderme: queratinócitos (90%), melanócitos (cor), células de Langerhans (imune), células de Merkel (tato). Derme: colágeno I e III, elastina, fibroblastos, mastócitos. Anexos: folículos pilosos, glândulas.',
        embryology: 'Epiderme: ectoderma. Derme: mesoderma (tronco/membros) e crista neural (face). Melanócitos: crista neural.',
        bloodSupply: 'Plexo subdérmico e subpapilar. Sem vasos na epiderme (nutrição por difusão).',
        innervation: 'Receptores: Meissner (tato fino), Pacini (pressão/vibração), Ruffini (estiramento), Merkel (tato sustentado), terminações livres (dor/temperatura).',
        functions: ['Barreira física e imunológica', 'Termorregulação (sudorese, vasodilatação/constrição)', 'Proteção UV (melanina)', 'Sensibilidade (tato, dor, temperatura)', 'Síntese de vitamina D', 'Excreção (suor)'],
        pathologies: ['Melanoma', 'CBC e CEC', 'Psoríase', 'Dermatite atópica/de contato', 'Queimaduras', 'Úlceras', 'Celulite/erisipela', 'Vitiligo', 'Acne'],
        examTips: [
          'ABCDE do melanoma: Assimetria, Bordas irregulares, Cor heterogênea, Diâmetro >6mm, Evolução',
          'Regra dos 9 de Wallace: cabeça 9%, MMSS 9% cada, tronco anterior/posterior 18% cada, MMII 18% cada, períneo 1%',
          'Breslow: espessura do melanoma (principal fator prognóstico)',
          'Dermatomas: distribuição segmentar da inervação cutânea',
          'Linhas de Langer: orientação das fibras de colágeno (incisões cirúrgicas)',
        ],
        surgicalNotes: ['Excisão com margens: melanoma (1-2cm conforme Breslow)', 'Cirurgia de Mohs: CBC/CEC em áreas nobres', 'Enxertos e retalhos: reconstrução'],
        imagingNotes: ['Dermatoscopia: avaliação de lesões pigmentadas', 'USG de partes moles: profundidade de lesões', 'Biópsia: excisional, incisional, punch'],
        annotations: [
          { position: [0, 0.3, 0.3], label: 'Epiderme', description: '5 camadas — queratinócitos, melanócitos, Langerhans' },
          { position: [0, 0, 0.3], label: 'Derme', description: 'Papilar (frouxo) + Reticular (denso) — colágeno, vasos, nervos' },
          { position: [0, -0.3, 0.3], label: 'Hipoderme', description: 'Tecido adiposo — isolamento térmico, reserva energética' },
        ],
        references: [
          'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 7.',
          'Fitzpatrick\'s Dermatology. 9th ed. Cap. 1-5.',
        ],
      },
    ],
  },
  {
    id: 'linfatico',
    name: 'Sistema Linfático',
    nameEn: 'Lymphatic System',
    icon: Droplets,
    color: 'text-teal-500',
    threeColor: '#14b8a6',
    bgColor: 'bg-teal-500/10',
    year: 2,
    description: 'Drenagem do líquido intersticial, transporte de lipídios, defesa imunológica. Vasos linfáticos, linfonodos (~600), ducto torácico, ducto linfático direito, tonsilas, MALT.',
    relatedSubjects: ['Anatomia', 'Imunologia', 'Oncologia', 'Cirurgia', 'Infectologia'],
    clinicalRelevance: [
      'Linfomas (Hodgkin e não-Hodgkin)',
      'Metástases linfonodais — estadiamento TNM',
      'Linfedema — pós-mastectomia, filariose',
      'Linfadenite/linfadenopatia',
      'Mononucleose infecciosa (EBV)',
      'Linfonodo sentinela — melanoma e mama',
    ],
    keyTerms: ['Linfa', 'Linfonodo sentinela', 'Ducto torácico', 'Cisterna do quilo', 'MALT', 'Placas de Peyer', 'Tonsilas', 'Quilotórax'],
    references: [
      'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 71-72.',
      'Netter FH. Atlas. 7th ed. Plates 230-250.',
    ],
    organs: [
      {
        id: 'linfonodos', name: 'Linfonodos', nameEn: 'Lymph Nodes', nameLatin: 'Nodi lymphoidei',
        description: '~600 linfonodos no corpo. Estrutura: córtex (folículos B), paracórtex (linfócitos T), medula (cordões medulares). Filtram a linfa e iniciam resposta imune.',
        histology: 'Cápsula fibrosa → seios subcapsulares → córtex (folículos primários e secundários com centros germinativos) → paracórtex (zona T) → medula (cordões e seios medulares).',
        embryology: 'Mesênquima — desenvolvimento a partir da 5ª semana. Colonização por linfócitos do timo e medula óssea.',
        bloodSupply: 'Artérias e veias hilares. Vênulas de endotélio alto (HEV): entrada de linfócitos do sangue.',
        innervation: 'Simpática: vasoconstrição.',
        functions: ['Filtração da linfa', 'Apresentação de antígenos', 'Ativação de linfócitos T e B', 'Produção de anticorpos', 'Memória imunológica'],
        pathologies: ['Linfadenopatia reacional', 'Linfoma de Hodgkin (célula de Reed-Sternberg)', 'Linfoma não-Hodgkin', 'Metástases linfonodais', 'Linfadenite tuberculosa (escrófula)', 'Sarcoidose'],
        examTips: [
          'Cadeias cervicais: infecções de cabeça e pescoço, linfomas',
          'Supraclavicular E (Virchow): metástase de câncer gástrico',
          'Axilar: mama, membro superior',
          'Inguinal: membro inferior, genitália',
          'Linfonodo sentinela: primeiro linfonodo de drenagem tumoral',
          'Biópsia excisional: diagnóstico de linfoma (não PAAF)',
        ],
        surgicalNotes: ['Biópsia de linfonodo sentinela: melanoma e mama', 'Linfadenectomia: esvaziamento cervical, axilar, inguinal', 'Mapeamento com azul patente ou tecnécio-99m'],
        imagingNotes: ['USG: avaliação de morfologia (hilo, córtex, forma)', 'TC/PET-CT: estadiamento de linfomas', 'RM: avaliação de cadeias profundas'],
        annotations: [
          { position: [0, 0.3, 0.3], label: 'Córtex', description: 'Folículos linfoides — linfócitos B, centros germinativos' },
          { position: [0, 0, 0.3], label: 'Paracórtex', description: 'Zona T — linfócitos T, células dendríticas' },
          { position: [0, -0.2, 0.3], label: 'Medula', description: 'Cordões medulares — plasmócitos, macrófagos' },
        ],
        references: [
          'Standring S. Gray\'s Anatomy. 42nd ed. Cap. 71.',
          'Abbas AK. Immunology. 10th ed. Cap. 2: Innate Immunity.',
        ],
      },
    ],
  },
];

// ─── 3D ORGAN MODELS (Procedural Geometry) ────────────────────────

function HeartModel({ color, selected, onClick }: { color: string; selected: boolean; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      const scale = selected ? 1.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05 : 1;
      meshRef.current.scale.setScalar(scale);
    }
    if (glowRef.current && selected) {
      glowRef.current.scale.setScalar(1.3 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
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

  const extrudeSettings = { depth: 0.3, bevelEnabled: true, bevelSegments: 8, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };

  return (
    <group onClick={onClick}>
      <mesh ref={meshRef} position={[0, 0, -0.15]} castShadow>
        <extrudeGeometry args={[heartShape, extrudeSettings]} />
        <meshPhysicalMaterial color={color} roughness={0.3} metalness={0.1} clearcoat={0.5} transparent opacity={selected ? 1 : 0.85} />
      </mesh>
      {selected && (
        <mesh ref={glowRef} position={[0, 0, -0.15]}>
          <extrudeGeometry args={[heartShape, { ...extrudeSettings, bevelSize: 0.1 }]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </mesh>
      )}
    </group>
  );
}

function BrainModel({ color, selected, onClick }: { color: string; selected: boolean; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
      const scale = selected ? 1.1 + Math.sin(state.clock.elapsedTime * 2) * 0.03 : 1;
      groupRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Left hemisphere */}
      <mesh position={[-0.22, 0.05, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32, 0, Math.PI]} />
        <meshPhysicalMaterial color={color} roughness={0.6} metalness={0.05} clearcoat={0.3} transparent opacity={selected ? 1 : 0.85} />
      </mesh>
      {/* Right hemisphere */}
      <mesh position={[0.22, 0.05, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32, Math.PI, Math.PI]} />
        <meshPhysicalMaterial color={color} roughness={0.6} metalness={0.05} clearcoat={0.3} transparent opacity={selected ? 1 : 0.85} />
      </mesh>
      {/* Cerebellum */}
      <mesh position={[0, -0.25, -0.15]} castShadow>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshPhysicalMaterial color={color} roughness={0.7} metalness={0.05} transparent opacity={selected ? 0.9 : 0.75} />
      </mesh>
      {/* Brain stem */}
      <mesh position={[0, -0.4, -0.05]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.25, 16]} />
        <meshPhysicalMaterial color={color} roughness={0.5} metalness={0.1} transparent opacity={selected ? 0.9 : 0.75} />
      </mesh>
      {/* Sulci lines */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[Math.cos(i * 0.5) * 0.15, 0.15 + Math.sin(i * 0.8) * 0.1, 0.2 + Math.cos(i) * 0.1]} rotation={[0, 0, i * 0.4]}>
          <torusGeometry args={[0.12, 0.008, 8, 32, Math.PI * 0.6]} />
          <meshBasicMaterial color="#9333ea" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function LungsModel({ color, selected, onClick }: { color: string; selected: boolean; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
      const breathe = Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
      groupRef.current.scale.set(1 + breathe, 1, 1 + breathe * 0.5);
    }
  });

  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Right lung (3 lobes) */}
      <mesh position={[0.3, 0.1, 0]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshPhysicalMaterial color={color} roughness={0.4} metalness={0.05} clearcoat={0.3} transparent opacity={selected ? 1 : 0.8} />
      </mesh>
      <mesh position={[0.35, -0.15, 0]} castShadow>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshPhysicalMaterial color={color} roughness={0.4} metalness={0.05} transparent opacity={selected ? 0.9 : 0.7} />
      </mesh>
      {/* Left lung (2 lobes) */}
      <mesh position={[-0.3, 0.05, 0]} castShadow>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshPhysicalMaterial color={color} roughness={0.4} metalness={0.05} clearcoat={0.3} transparent opacity={selected ? 1 : 0.8} />
      </mesh>
      {/* Trachea */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 16]} />
        <meshPhysicalMaterial color="#94a3b8" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Bronchi */}
      <mesh position={[0.15, 0.25, 0]} rotation={[0, 0, -0.5]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.2, 12]} />
        <meshPhysicalMaterial color="#94a3b8" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[-0.15, 0.25, 0]} rotation={[0, 0, 0.5]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.2, 12]} />
        <meshPhysicalMaterial color="#94a3b8" roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  );
}

function GenericOrganModel({ color, selected, onClick, shape = 'sphere' }: { color: string; selected: boolean; onClick: () => void; shape?: string }) {
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
      case 'bone': return <cylinderGeometry args={[0.05, 0.08, 0.8, 16]} />;
      case 'gland': return <icosahedronGeometry args={[0.3, 2]} />;
      case 'shield': return <octahedronGeometry args={[0.35, 2]} />;
      case 'tube': return <torusGeometry args={[0.25, 0.08, 16, 32]} />;
      case 'flat': return <boxGeometry args={[0.6, 0.4, 0.1]} />;
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
        <mesh scale={1.2}>
          {geometry}
          <meshBasicMaterial color={color} transparent opacity={0.1} wireframe />
        </mesh>
      )}
    </group>
  );
}

// ─── 3D Annotation Labels ─────────────────────────────────────────
function AnnotationPoint({ annotation, visible, onClick }: { annotation: AnatomyAnnotation; visible: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  
  if (!visible) return null;
  
  return (
    <group position={annotation.position}>
      <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} onClick={onClick}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color={hovered ? '#22d3ee' : '#ffffff'} />
      </mesh>
      {/* Connection line */}
      <Line points={[[0, 0, 0], [0, 0.15, 0.1]]} color="#22d3ee" lineWidth={1} transparent opacity={0.6} />
      <Html position={[0, 0.2, 0.15]} center distanceFactor={3} style={{ pointerEvents: 'none' }}>
        <div className={`px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap transition-all ${hovered ? 'bg-cyan-500 text-white scale-110' : 'bg-gray-800/90 text-cyan-300'}`}>
          {annotation.label}
        </div>
      </Html>
    </group>
  );
}

// ─── 3D Scene Component ───────────────────────────────────────────
function AtlasScene({ system, selectedOrgan, onOrganClick, showAnnotations, onAnnotationClick }: {
  system: BodySystemData;
  selectedOrgan: string | null;
  onOrganClick: (id: string) => void;
  showAnnotations: boolean;
  onAnnotationClick: (a: AnatomyAnnotation) => void;
}) {
  const organ = system.organs.find(o => o.id === selectedOrgan) || system.organs[0];
  
  const getOrganModel = () => {
    const props = { color: system.threeColor, selected: true, onClick: () => {} };
    switch (system.id) {
      case 'cardiovascular': return <HeartModel {...props} />;
      case 'nervoso': return <BrainModel {...props} />;
      case 'respiratorio': return <LungsModel {...props} />;
      case 'digestorio': return <GenericOrganModel {...props} shape="liver" />;
      case 'musculoesqueletico': return <GenericOrganModel {...props} shape="bone" />;
      case 'urinario': return <GenericOrganModel {...props} shape="kidney" />;
      case 'endocrino': return <GenericOrganModel {...props} shape="gland" />;
      case 'imunologico': return <GenericOrganModel {...props} shape="shield" />;
      case 'reprodutor_masculino': return <GenericOrganModel {...props} shape="gland" />;
      case 'reprodutor_feminino': return <GenericOrganModel {...props} shape="tube" />;
      case 'tegumentar': return <GenericOrganModel {...props} shape="flat" />;
      case 'linfatico': return <GenericOrganModel {...props} shape="shield" />;
      default: return <GenericOrganModel {...props} />;
    }
  };

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} />
      <pointLight position={[0, 2, 3]} intensity={0.5} color={system.threeColor} />
      
      <Suspense fallback={null}>
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          {getOrganModel()}
        </Float>
        
        {/* Annotations */}
        {organ && organ.annotations.map((a, i) => (
          <AnnotationPoint key={i} annotation={a} visible={showAnnotations} onClick={() => onAnnotationClick(a)} />
        ))}
        
        <ContactShadows position={[0, -0.8, 0]} opacity={0.4} scale={3} blur={2} />
        <Environment preset="studio" />
      </Suspense>
      
      <OrbitControls enablePan={false} minDistance={1} maxDistance={5} autoRotate={false} makeDefault />
      
      {/* Grid helper */}
      <gridHelper args={[4, 20, '#1e293b', '#0f172a']} position={[0, -0.8, 0]} />
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────
const AnatomyAtlas: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'histology' | 'clinical' | 'imaging' | 'references'>('overview');
  const [selectedAnnotation, setSelectedAnnotation] = useState<AnatomyAnnotation | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

  const filteredSystems = useMemo(() => {
    let systems = BODY_SYSTEMS;
    if (filterYear) systems = systems.filter(s => s.year === filterYear);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      systems = systems.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.nameEn.toLowerCase().includes(term) ||
        s.organs.some(o => o.name.toLowerCase().includes(term) || o.nameLatin.toLowerCase().includes(term)) ||
        s.keyTerms.some(t => t.toLowerCase().includes(term)) ||
        s.clinicalRelevance.some(c => c.toLowerCase().includes(term)) ||
        s.organs.some(o => o.pathologies.some(p => p.toLowerCase().includes(term)))
      );
    }
    return systems;
  }, [filterYear, searchTerm]);

  const currentSystem = BODY_SYSTEMS.find(s => s.id === selectedSystem);
  const currentOrgan = currentSystem?.organs.find(o => o.id === selectedOrgan) || (currentSystem?.organs[0]);

  // ─── 3D Detail View ─────────────────────────────────────
  if (currentSystem) {
    const Icon = currentSystem.icon;
    return (
      <div className="space-y-4 max-w-7xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => { setSelectedSystem(null); setSelectedOrgan(null); setActiveTab('overview'); }} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" /> Voltar ao Atlas
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAnnotations(!showAnnotations)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${showAnnotations ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
              <Tag className="w-3 h-3 inline mr-1" /> Anotações
            </button>
          </div>
        </div>

        {/* System Title */}
        <div className="flex items-center gap-4 bg-gray-900/80 rounded-2xl p-5 border border-gray-800">
          <div className={`w-14 h-14 rounded-xl ${currentSystem.bgColor} flex items-center justify-center`}>
            <Icon className={`w-7 h-7 ${currentSystem.color}`} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{currentSystem.name}</h2>
            <p className="text-sm text-gray-400">{currentSystem.nameEn} — {currentSystem.year}° ano</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500">{currentSystem.organs.length} órgão(s)</span>
            <div className="flex gap-1 mt-1">
              {currentSystem.organs.map(o => (
                <button key={o.id} onClick={() => setSelectedOrgan(o.id)} className={`px-2 py-0.5 rounded text-xs transition-all ${selectedOrgan === o.id || (!selectedOrgan && o.id === currentSystem.organs[0].id) ? 'bg-cyan-500/20 text-cyan-300' : 'bg-gray-800 text-gray-500 hover:text-gray-300'}`}>
                  {o.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 3D Viewer */}
          <div className="bg-gray-950 rounded-2xl border border-gray-800 overflow-hidden" style={{ height: '500px' }}>
            <div className="absolute top-3 left-3 z-10 flex gap-1">
              <span className="px-2 py-1 bg-gray-900/90 rounded text-[10px] text-cyan-300 font-mono border border-gray-700">
                3D Interativo — Arraste para rotacionar
              </span>
            </div>
            <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }} shadows style={{ background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)' }}>
              <AtlasScene
                system={currentSystem}
                selectedOrgan={selectedOrgan}
                onOrganClick={setSelectedOrgan}
                showAnnotations={showAnnotations}
                onAnnotationClick={setSelectedAnnotation}
              />
            </Canvas>
          </div>

          {/* Info Panel */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-900 rounded-xl p-1">
              {[
                { id: 'overview' as const, label: 'Visão Geral', icon: Info },
                { id: 'histology' as const, label: 'Histologia', icon: Microscope },
                { id: 'clinical' as const, label: 'Clínica', icon: Stethoscope },
                { id: 'imaging' as const, label: 'Imagem', icon: Eye },
                { id: 'references' as const, label: 'Referências', icon: BookOpen },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === tab.id ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-500 hover:text-gray-300'}`}>
                  <tab.icon className="w-3 h-3" /> {tab.label}
                </button>
              ))}
            </div>

            {currentOrgan && (
              <div className="space-y-3">
                {/* Organ Header */}
                <div className="bg-gray-900/80 rounded-xl p-4 border border-gray-800">
                  <h3 className="text-lg font-bold text-white">{currentOrgan.name}</h3>
                  <p className="text-xs text-gray-500 font-mono">{currentOrgan.nameEn} — <em>{currentOrgan.nameLatin}</em></p>
                  <p className="text-sm text-gray-300 mt-2 leading-relaxed">{currentOrgan.description}</p>
                </div>

                {activeTab === 'overview' && (
                  <>
                    {/* Functions */}
                    <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800">
                      <button onClick={() => toggleSection('functions')} className="w-full flex items-center justify-between">
                        <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2"><Activity className="w-4 h-4" /> Funções</h4>
                        {expandedSections.functions === false ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronUp className="w-4 h-4 text-gray-500" />}
                      </button>
                      {expandedSections.functions !== false && (
                        <ul className="mt-2 space-y-1">
                          {currentOrgan.functions.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-emerald-400 mt-0.5">▸</span> {f}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Blood Supply & Innervation */}
                    <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800">
                      <h4 className="text-sm font-bold text-red-400 flex items-center gap-2 mb-2"><Heart className="w-4 h-4" /> Vascularização</h4>
                      <p className="text-sm text-gray-300">{currentOrgan.bloodSupply}</p>
                      <h4 className="text-sm font-bold text-yellow-400 flex items-center gap-2 mt-3 mb-2"><Zap className="w-4 h-4" /> Inervação</h4>
                      <p className="text-sm text-gray-300">{currentOrgan.innervation}</p>
                    </div>

                    {/* Pathologies */}
                    <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800">
                      <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2 mb-2"><AlertCircle className="w-4 h-4" /> Patologias</h4>
                      <div className="flex flex-wrap gap-1">
                        {currentOrgan.pathologies.map((p, i) => (
                          <span key={i} className="px-2 py-0.5 bg-orange-500/10 text-orange-300 rounded text-xs border border-orange-500/20">{p}</span>
                        ))}
                      </div>
                    </div>

                    {/* Exam Tips */}
                    <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800">
                      <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2 mb-2"><GraduationCap className="w-4 h-4" /> Dicas para Provas</h4>
                      <ul className="space-y-1">
                        {currentOrgan.examTips.map((t, i) => (
                          <li key={i} className="text-xs text-gray-300 bg-blue-500/5 rounded px-2 py-1.5 border-l-2 border-blue-500/30">{t}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {activeTab === 'histology' && (
                  <>
                    <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800">
                      <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2 mb-2"><Microscope className="w-4 h-4" /> Histologia</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">{currentOrgan.histology}</p>
                    </div>
                    <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800">
                      <h4 className="text-sm font-bold text-pink-400 flex items-center gap-2 mb-2"><Baby className="w-4 h-4" /> Embriologia</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">{currentOrgan.embryology}</p>
                    </div>
                  </>
                )}

                {activeTab === 'clinical' && (
                  <>
                    <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800">
                      <h4 className="text-sm font-bold text-red-400 flex items-center gap-2 mb-2"><Stethoscope className="w-4 h-4" /> Notas Cirúrgicas</h4>
                      <ul className="space-y-1">
                        {currentOrgan.surgicalNotes.map((n, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-red-400 mt-0.5">⚕</span> {n}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Clinical Relevance */}
                    <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800">
                      <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-2"><AlertCircle className="w-4 h-4" /> Relevância Clínica do Sistema</h4>
                      <ul className="space-y-1">
                        {currentSystem.clinicalRelevance.map((c, i) => (
                          <li key={i} className="text-xs text-gray-300 bg-amber-500/5 rounded px-2 py-1.5 border-l-2 border-amber-500/30">{c}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {activeTab === 'imaging' && (
                  <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800">
                    <h4 className="text-sm font-bold text-sky-400 flex items-center gap-2 mb-2"><Eye className="w-4 h-4" /> Notas de Imagem</h4>
                    <ul className="space-y-1">
                      {currentOrgan.imagingNotes.map((n, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-sky-400 mt-0.5">📷</span> {n}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'references' && (
                  <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800">
                    <h4 className="text-sm font-bold text-gray-300 flex items-center gap-2 mb-3"><BookOpen className="w-4 h-4" /> Referências Bibliográficas</h4>
                    <ul className="space-y-2">
                      {[...currentOrgan.references, ...currentSystem.references].map((ref, i) => (
                        <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                          <span className="text-cyan-400 font-bold shrink-0">[{i + 1}]</span>
                          <span>{ref}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Key Terms */}
        <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800">
          <h4 className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Termos-Chave</h4>
          <div className="flex flex-wrap gap-1">
            {currentSystem.keyTerms.map((t, i) => (
              <span key={i} className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-xs border border-gray-700">{t}</span>
            ))}
          </div>
        </div>

        {/* Annotation Modal */}
        {selectedAnnotation && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAnnotation(null)}>
            <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-cyan-500/30 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-cyan-300">{selectedAnnotation.label}</h3>
                <button onClick={() => setSelectedAnnotation(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <p className="text-sm text-gray-300 mb-3">{selectedAnnotation.description}</p>
              {selectedAnnotation.clinicalNote && (
                <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
                  <p className="text-xs text-amber-300 font-bold mb-1">Nota Clínica:</p>
                  <p className="text-sm text-amber-200">{selectedAnnotation.clinicalNote}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Main Atlas Grid View ─────────────────────────────────
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-cyan-500/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Layers className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Atlas Anatômico 3D Interativo</h2>
            <p className="text-sm text-gray-400">{BODY_SYSTEMS.length} sistemas corporais com modelos 3D, anotações e referências validadas</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Referências: Gray's Anatomy 42nd Ed, Netter Atlas 7th Ed, Sobotta 24th Ed, Guyton Physiology 14th Ed, Moore Clinically Oriented Anatomy 8th Ed
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar sistema, órgão, patologia, termo..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterYear(null)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${!filterYear ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-gray-900 text-gray-500 border border-gray-700 hover:text-gray-300'}`}>
            Todos
          </button>
          {[1, 2, 3, 4].map(y => (
            <button key={y} onClick={() => setFilterYear(y)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${filterYear === y ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-gray-900 text-gray-500 border border-gray-700 hover:text-gray-300'}`}>
              {y}° Ano
            </button>
          ))}
        </div>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSystems.map(system => {
          const SysIcon = system.icon;
          return (
            <button
              key={system.id}
              onClick={() => { setSelectedSystem(system.id); setSelectedOrgan(null); setActiveTab('overview'); }}
              className="group p-5 rounded-2xl border border-gray-800 bg-gray-900/50 text-left transition-all hover:border-cyan-500/30 hover:bg-gray-900/80 hover:shadow-lg hover:shadow-cyan-500/5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-11 h-11 rounded-xl ${system.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <SysIcon className={`w-5 h-5 ${system.color}`} />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{system.name}</p>
                  <p className="text-[10px] text-gray-500">{system.nameEn} — {system.year}° Ano</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2 mb-3">{system.description}</p>
              <div className="flex flex-wrap gap
-1">
                {system.organs.slice(0, 3).map(o => (
                  <span key={o.id} className="px-1.5 py-0.5 bg-gray-800 text-gray-500 rounded text-[10px]">{o.name}</span>
                ))}
                {system.organs.length > 3 && <span className="text-[10px] text-gray-600">+{system.organs.length - 3}</span>}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                <span className="text-[10px] text-gray-600">{system.clinicalRelevance.length} condições clínicas</span>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 transition-colors" />
              </div>
            </button>
          );
        })}
      </div>

      {filteredSystems.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Nenhum sistema encontrado para "{searchTerm}"</p>
          <button onClick={() => { setSearchTerm(''); setFilterYear(null); }} className="mt-2 text-cyan-400 text-sm hover:underline">Limpar filtros</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800 text-center">
          <p className="text-2xl font-bold text-cyan-400">{BODY_SYSTEMS.length}</p>
          <p className="text-xs text-gray-500">Sistemas Corporais</p>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800 text-center">
          <p className="text-2xl font-bold text-emerald-400">{BODY_SYSTEMS.reduce((acc, s) => acc + s.organs.length, 0)}</p>
          <p className="text-xs text-gray-500">Órgãos Detalhados</p>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800 text-center">
          <p className="text-2xl font-bold text-purple-400">{BODY_SYSTEMS.reduce((acc, s) => acc + s.organs.reduce((a, o) => a + o.annotations.length, 0), 0)}</p>
          <p className="text-xs text-gray-500">Anotações 3D</p>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800 text-center">
          <p className="text-2xl font-bold text-amber-400">{BODY_SYSTEMS.reduce((acc, s) => acc + s.references.length + s.organs.reduce((a, o) => a + o.references.length, 0), 0)}</p>
          <p className="text-xs text-gray-500">Referências Validadas</p>
        </div>
      </div>

      {/* References Footer */}
      <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-800">
        <h4 className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-2"><BookOpen className="w-3 h-3" /> Fontes Principais</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {[
            'Standring S. Gray\'s Anatomy: The Anatomical Basis of Clinical Practice. 42nd ed. Elsevier; 2020.',
            'Netter FH. Atlas of Human Anatomy. 7th ed. Elsevier; 2019.',
            'Moore KL, Dalley AF. Clinically Oriented Anatomy. 8th ed. Wolters Kluwer; 2018.',
            'Guyton AC, Hall JE. Textbook of Medical Physiology. 14th ed. Elsevier; 2020.',
            'Machado A. Neuroanatomia Funcional. 3rd ed. Atheneu; 2014.',
            'Sobotta J. Atlas of Human Anatomy. 24th ed. Elsevier; 2018.',
            'Tortora GJ. Principles of Anatomy and Physiology. 16th ed. Wiley; 2020.',
            'Junqueira LC, Carneiro J. Histologia Básica. 13th ed. Guanabara Koogan; 2017.',
          ].map((ref, i) => (
            <p key={i} className="text-[10px] text-gray-500">[{i + 1}] {ref}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnatomyAtlas;
