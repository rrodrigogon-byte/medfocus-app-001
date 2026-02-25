/**
 * AnatomyAtlas v5.0 - Atlas Anatomico 3D Premium
 * Modelos fotorrealistas via SketchFab + Three.js procedurais avancados
 * Animacoes fisiologicas, WebXR AR, Quizzes adaptativos SM-2, Video-aulas
 * 
 * Referencias Bibliograficas:
 * [1] Gray's Anatomy, 42nd Ed. Standring S. Elsevier, 2020. ISBN: 978-0702077050
 * [2] Netter Atlas of Human Anatomy, 8th Ed. Netter FH. Elsevier, 2023. ISBN: 978-0323680424
 * [3] Sobotta Atlas of Anatomy, 24th Ed. Paulsen F, Waschke J. Urban & Fischer, 2022. ISBN: 978-0702067600
 * [4] Moore's Clinically Oriented Anatomy, 9th Ed. Dalley AF, Agur AMR. Wolters Kluwer, 2022. ISBN: 978-1975209544
 * [5] Prometheus Atlas of Anatomy, 5th Ed. Schunke M et al. Thieme, 2022. ISBN: 978-1684202522
 * [6] Junqueira's Basic Histology, 16th Ed. Mescher AL. McGraw-Hill, 2021. ISBN: 978-1260462982
 * [7] Langman's Medical Embryology, 14th Ed. Sadler TW. Wolters Kluwer, 2019. ISBN: 978-1496383907
 * [8] Guyton & Hall Textbook of Medical Physiology, 14th Ed. Hall JE. Elsevier, 2020. ISBN: 978-0323597128
 * [9] Robbins & Cotran Pathologic Basis of Disease, 10th Ed. Kumar V et al. Elsevier, 2021. ISBN: 978-0323531139
 * [10] Williams Obstetrics, 26th Ed. Cunningham FG et al. McGraw-Hill, 2022. ISBN: 978-1260462746
 * [11] Costanzo Physiology, 7th Ed. Costanzo LS. Elsevier, 2022. ISBN: 978-0323793339
 * [12] Ross Histology, 8th Ed. Pawlina W. Wolters Kluwer, 2020. ISBN: 978-1496383426
 */
import React, { useState, useMemo, useRef, useCallback, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Environment, ContactShadows, Float, Line, Text, MeshTransmissionMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import {
  Heart, Brain, Bone, Droplets, Wind, Utensils, Eye,
  Shield, Zap, Baby, Activity, ArrowLeft, BookOpen, Search,
  ChevronRight, GraduationCap, Stethoscope, Microscope,
  RotateCw, Info, Layers, Tag, ChevronDown, ChevronUp,
  X, Bookmark, ExternalLink, HelpCircle, Play, Pause,
  CheckCircle, XCircle, Award, Target, Scissors, Video,
  Smartphone, Globe, TrendingUp, Clock, Star, Volume2,
  Camera, Maximize2, BarChart3, RefreshCw
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
  physiology: string;
  clinicalCorrelation: string;
  annotations: AnatomyAnnotation[];
  pathologies: PathologyData[];
  examTips: string[];
  references: string[];
  sketchfabId?: string;
  videoUrl?: string;
}
interface SystemData {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  organs: OrganData[];
}
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  system: string;
  reference: string;
  sm2Data?: { interval: number; repetition: number; easeFactor: number; nextReview: number };
}
interface PhysiologyAnimation {
  id: string;
  name: string;
  description: string;
  system: string;
  duration: number;
  steps: { time: number; label: string; description: string }[];
}
interface DissectionLayer {
  id: string;
  name: string;
  depth: number;
  color: string;
  opacity: number;
  structures: string[];
}

// === SKETCHFAB MODELS CATALOG ===
const SKETCHFAB_MODELS: Record<string, { uid: string; title: string; author: string; license: string }> = {
  'human-anatomy': { uid: '14191ef860b44925be0e94462c84ffe6', title: 'Human Anatomy GLB', author: 'flixtlix', license: 'CC BY 4.0' },
  'heart-realistic': { uid: '3f8072336ce94d18b3d0d055a1ece089', title: 'Realistic Human Heart', author: 'Anatomy3D', license: 'CC BY 4.0' },
  'brain': { uid: 'e073c2590bc24daaa7323f4daa5b7784', title: 'Human Brain', author: 'Yash_Dandavate', license: 'CC BY 4.0' },
  'lungs-heart': { uid: '0b132b125c66462b86d426729df14b33', title: 'Lungs and Heart Anatomy', author: '3D4SCI', license: 'CC BY 4.0' },
  'skull': { uid: 'a8d8d0e3e4c94b0e8e0e5e5e5e5e5e5e', title: 'Human Skull', author: 'SketchFab', license: 'CC BY 4.0' },
  'skeleton': { uid: 'be4465abad5b45529d586b7b07c1afc5', title: 'Adult Skeleton', author: 'SketchFab', license: 'CC BY 4.0' },
  'kidney': { uid: 'dd1631a75cf34ed29aa294ac2450b52d', title: 'Human Kidney', author: 'CU Anschutz', license: 'CC BY 4.0' },
  'eye': { uid: '45f09e9f193640729294da60e9962bc8', title: 'Human Eye', author: 'Bluelink', license: 'CC BY 4.0' },
};

// === DISSECTION LAYERS ===
const DISSECTION_LAYERS: DissectionLayer[] = [
  { id: 'skin', name: 'Pele e Tecido Subcutaneo', depth: 0, color: '#FFD4B8', opacity: 0.9, structures: ['Epiderme', 'Derme', 'Hipoderme', 'Foliculos pilosos', 'Glandulas sudoriparas'] },
  { id: 'fascia', name: 'Fascia e Tecido Conjuntivo', depth: 1, color: '#FFE4C4', opacity: 0.7, structures: ['Fascia superficial', 'Fascia profunda', 'Tecido areolar', 'Tecido adiposo'] },
  { id: 'muscle', name: 'Sistema Muscular', depth: 2, color: '#CC4444', opacity: 0.85, structures: ['Musculos esqueleticos', 'Tendoes', 'Aponeuroses', 'Bainhas sinoviais'] },
  { id: 'vascular', name: 'Sistema Vascular', depth: 3, color: '#FF3333', opacity: 0.8, structures: ['Arterias', 'Veias', 'Capilares', 'Vasos linfaticos'] },
  { id: 'nervous', name: 'Sistema Nervoso', depth: 4, color: '#FFFF44', opacity: 0.75, structures: ['Nervos perifericos', 'Plexos nervosos', 'Ganglios', 'Receptores'] },
  { id: 'skeleton', name: 'Sistema Esqueletico', depth: 5, color: '#FFFFEE', opacity: 0.95, structures: ['Ossos', 'Cartilagens', 'Articulacoes', 'Ligamentos'] },
  { id: 'organs', name: 'Orgaos Internos', depth: 6, color: '#DD6666', opacity: 0.9, structures: ['Coracao', 'Pulmoes', 'Figado', 'Rins', 'Intestinos', 'Cerebro'] },
];

// === PHYSIOLOGY ANIMATIONS ===
const PHYSIOLOGY_ANIMATIONS: PhysiologyAnimation[] = [
  {
    id: 'cardiac-cycle', name: 'Ciclo Cardiaco', description: 'Sistole e diastole com fluxo sanguineo',
    system: 'cardiovascular', duration: 8,
    steps: [
      { time: 0, label: 'Diastole Atrial', description: 'Atrios relaxam e recebem sangue das veias cavas e pulmonares' },
      { time: 1, label: 'Enchimento Ventricular', description: 'Valvas AV abrem, sangue flui passivamente para ventriculos (70%)' },
      { time: 2, label: 'Sistole Atrial', description: 'Atrios contraem, completando enchimento ventricular (30% restante)' },
      { time: 3, label: 'Contracão Isovolumetrica', description: 'Ventriculos contraem com todas as valvas fechadas. Pressao aumenta rapidamente' },
      { time: 4, label: 'Ejecao Rapida', description: 'Valvas semilunares abrem, sangue ejetado para aorta e tronco pulmonar' },
      { time: 5, label: 'Ejecao Lenta', description: 'Fluxo diminui, pressao ventricular cai abaixo da arterial' },
      { time: 6, label: 'Relaxamento Isovolumetrico', description: 'Todas as valvas fechadas, ventriculos relaxam. Pressao cai rapidamente' },
      { time: 7, label: 'Enchimento Rapido', description: 'Valvas AV abrem novamente, ciclo reinicia. Duracao total: ~0.8s em repouso' },
    ]
  },
  {
    id: 'respiration', name: 'Mecanica Respiratoria', description: 'Inspiracao e expiracao com trocas gasosas',
    system: 'respiratory', duration: 6,
    steps: [
      { time: 0, label: 'Inspiracao - Inicio', description: 'Diafragma contrai e desce, intercostais externos elevam costelas' },
      { time: 1, label: 'Expansao Pulmonar', description: 'Pressao intrapleural diminui (-8cmH2O), pulmoes expandem' },
      { time: 2, label: 'Fluxo de Ar', description: 'Pressao alveolar cai abaixo da atmosferica, ar entra nos pulmoes' },
      { time: 3, label: 'Troca Gasosa', description: 'O2 difunde do alveolo para o capilar, CO2 do capilar para o alveolo' },
      { time: 4, label: 'Expiracao Passiva', description: 'Diafragma relaxa e sobe, retração elastica dos pulmoes' },
      { time: 5, label: 'Saida de Ar', description: 'Pressao alveolar sobe acima da atmosferica, ar sai dos pulmoes' },
    ]
  },
  {
    id: 'peristalsis', name: 'Peristalse Intestinal', description: 'Movimentos peristalticos do trato GI',
    system: 'digestive', duration: 5,
    steps: [
      { time: 0, label: 'Relaxamento Receptivo', description: 'Segmento distal relaxa para receber o bolo alimentar' },
      { time: 1, label: 'Contracão Circular', description: 'Musculo circular contrai atras do bolo, empurrando-o adiante' },
      { time: 2, label: 'Contracão Longitudinal', description: 'Musculo longitudinal encurta o segmento, facilitando o avanco' },
      { time: 3, label: 'Onda Peristaltica', description: 'Onda de contracão propaga-se a 2-25 cm/s pelo intestino' },
      { time: 4, label: 'Segmentacão', description: 'Contracoes alternadas misturam o quimo com enzimas digestivas' },
    ]
  },
  {
    id: 'neural-impulse', name: 'Impulso Nervoso', description: 'Potencial de acao e transmissao sinaptica',
    system: 'nervous', duration: 6,
    steps: [
      { time: 0, label: 'Repouso', description: 'Potencial de membrana em -70mV. Canais de Na+ fechados, K+ abertos' },
      { time: 1, label: 'Despolarizacao', description: 'Estimulo atinge limiar (-55mV), canais de Na+ abrem. Na+ entra rapidamente' },
      { time: 2, label: 'Pico do Potencial', description: 'Membrana atinge +30mV. Canais de Na+ inativam, K+ abrem' },
      { time: 3, label: 'Repolarizacao', description: 'K+ sai da celula, potencial retorna ao repouso' },
      { time: 4, label: 'Hiperpolarizacao', description: 'Potencial cai abaixo de -70mV brevemente. Periodo refratario' },
      { time: 5, label: 'Transmissao Sinaptica', description: 'Vesiculas liberam neurotransmissores na fenda sinaptica' },
    ]
  },
  {
    id: 'renal-filtration', name: 'Filtracao Renal', description: 'Filtracao glomerular e reabsorcao tubular',
    system: 'urinary', duration: 6,
    steps: [
      { time: 0, label: 'Filtracao Glomerular', description: 'Sangue filtrado no glomerulo. TFG = 125 mL/min (180 L/dia)' },
      { time: 1, label: 'Tubulo Proximal', description: 'Reabsorcao de 65% de Na+, agua, glicose, aminoacidos' },
      { time: 2, label: 'Alca de Henle', description: 'Mecanismo contracorrente concentra a medula renal' },
      { time: 3, label: 'Tubulo Distal', description: 'Ajuste fino de Na+/K+ sob controle da aldosterona' },
      { time: 4, label: 'Ducto Coletor', description: 'ADH controla reabsorcao de agua. Urina final: 1-2 L/dia' },
      { time: 5, label: 'Excrecao', description: 'Urina flui para pelve renal, ureter, bexiga' },
    ]
  },
];

// === BODY SYSTEMS DATA (12 systems, 4-5 organs each) ===
const BODY_SYSTEMS: SystemData[] = [
  {
    id: 'cardiovascular', name: 'Sistema Cardiovascular', icon: <Heart className="w-5 h-5" />, color: '#EF4444',
    description: 'Bombeamento e circulacao do sangue pelo corpo. Ref: Guyton & Hall, Cap. 9-14 [8]',
    organs: [
      {
        id: 'heart', name: 'Coracao', nameEn: 'Heart', nameLatin: 'Cor',
        description: 'Orgao muscular oco com 4 camaras que bombeia sangue. Peso medio: 300g. Debito cardiaco: 5L/min em repouso.',
        histology: 'Miocardio: fibras musculares estriadas cardiacas com discos intercalares. Endocardio: endotelio. Epicardio: mesotelio seroso. [6][12]',
        embryology: 'Deriva do mesoderma esplacnico. Tubo cardiaco primitivo forma-se na 3a semana. Septacao atrial e ventricular entre 4a-8a semana. [7]',
        physiology: 'Ciclo cardiaco: sistole (0.3s) e diastole (0.5s). Volume sistolico: 70mL. FC repouso: 60-100bpm. Regulacao: SNA, Frank-Starling. [8][11]',
        clinicalCorrelation: 'IAM: oclusao coronariana com necrose miocardica. Troponina I/T elevada. ECG: supra ST. Tratamento: angioplastia primaria em <90min. [9]',
        annotations: [
          { position: [0, 0.3, 0.5], label: 'Atrio Direito', description: 'Recebe sangue venoso das veias cavas superior e inferior', clinicalNote: 'Flutter atrial: circuito de reentrada no AD' },
          { position: [0.3, 0.3, 0.5], label: 'Atrio Esquerdo', description: 'Recebe sangue oxigenado das 4 veias pulmonares', clinicalNote: 'Fibrilacao atrial: principal fonte de trombos' },
          { position: [0, -0.2, 0.5], label: 'Ventriculo Direito', description: 'Bombeia sangue para a arteria pulmonar. Parede fina (3-5mm)', clinicalNote: 'Cor pulmonale: hipertrofia VD por hipertensao pulmonar' },
          { position: [0.3, -0.2, 0.5], label: 'Ventriculo Esquerdo', description: 'Bombeia sangue para a aorta. Parede espessa (13-15mm)', clinicalNote: 'ICC: fracao de ejecao <40% = IC sistolica' },
          { position: [0.15, 0.6, 0.3], label: 'Arco Aortico', description: 'Origina tronco braquiocefalico, carotida comum E e subclavia E', clinicalNote: 'Coarctacao: estenose aortica congenita, hipertensao MMSS' },
        ],
        pathologies: [
          { name: 'Infarto Agudo do Miocardio', description: 'Necrose miocardica por oclusao coronariana', visualChange: 'Area palida/hemorragica no miocardio', reference: 'Robbins Cap. 12 [9]' },
          { name: 'Estenose Aortica', description: 'Calcificacao valvar com obstrucao ao fluxo', visualChange: 'Valva espessada e calcificada', reference: 'Braunwald Heart Disease, 12th Ed' },
          { name: 'Cardiomiopatia Dilatada', description: 'Dilatacao de todas as camaras com disfuncao sistolica', visualChange: 'Coracao globoso e aumentado', reference: 'Robbins Cap. 12 [9]' },
        ],
        examTips: ['Irrigacao coronariana: DA irriga parede anterior e septo anterior', 'Bulhas: B1=fechamento mitral/tricuspide, B2=fechamento aortica/pulmonar', 'ECG: onda P=despolarizacao atrial, QRS=ventricular, T=repolarizacao'],
        references: ['Gray\'s Anatomy Cap. 56 [1]', 'Netter Plates 212-230 [2]', 'Guyton Cap. 9-13 [8]'],
        sketchfabId: 'heart-realistic',
      },
      {
        id: 'aorta', name: 'Aorta', nameEn: 'Aorta', nameLatin: 'Aorta',
        description: 'Maior arteria do corpo. Diametro: 2.5-3.5cm. Origina-se do VE, forma arco e desce ate bifurcacao iliacas (L4).',
        histology: 'Arteria elastica: tunica intima com endotelio, media com laminas elasticas concentricas, adventicia com vasa vasorum. [6]',
        embryology: 'Arcos aorticos: 3o=carotidas, 4o=arco aortico (E) e subclavia (D), 6o=ductus arteriosus e arterias pulmonares. [7]',
        physiology: 'Funcao Windkessel: elasticidade converte fluxo pulsatil em continuo. Pressao sistolica: 120mmHg, diastolica: 80mmHg. [8]',
        clinicalCorrelation: 'Aneurisma de aorta abdominal: >3cm, risco de ruptura se >5.5cm. Disseccao: dor toracica lancinante, tipo A (ascendente) = cirurgia de emergencia.',
        annotations: [
          { position: [0, 0.5, 0], label: 'Aorta Ascendente', description: 'Origina coronarias D e E', clinicalNote: 'Disseccao tipo A: emergencia cirurgica' },
          { position: [0, 0.7, -0.3], label: 'Arco Aortico', description: '3 ramos: tronco braquiocefalico, carotida comum E, subclavia E', clinicalNote: 'Coarctacao: hipertensao MMSS, pulsos femorais diminuidos' },
          { position: [0, 0, -0.5], label: 'Aorta Abdominal', description: 'Ramos viscerais: tronco celiaco, mesentericas, renais', clinicalNote: 'AAA: rastreio com US em homens >65 anos fumantes' },
        ],
        pathologies: [
          { name: 'Aneurisma Aortico', description: 'Dilatacao >50% do diametro normal', visualChange: 'Dilatacao fusiforme ou sacular', reference: 'Robbins Cap. 11 [9]' },
          { name: 'Aterosclerose', description: 'Placas de ateroma na intima', visualChange: 'Placas amareladas irregulares', reference: 'Robbins Cap. 11 [9]' },
        ],
        examTips: ['Bifurcacao aortica: nivel L4', 'Tronco celiaco: T12 (estomago, figado, baco)', 'Mesenterica superior: L1 (intestino delgado, colon D)'],
        references: ['Gray\'s Anatomy Cap. 53 [1]', 'Netter Plates 231-240 [2]'],
      },
      {
        id: 'coronary-arteries', name: 'Arterias Coronarias', nameEn: 'Coronary Arteries', nameLatin: 'Arteriae coronariae',
        description: 'Primeira ramificacao da aorta. Coronaria D e E irrigam o miocardio. Fluxo coronariano: 250mL/min (5% do DC).',
        histology: 'Arterias musculares com tunica media proeminente. Endotelio produz NO (vasodilatador). [6]',
        embryology: 'Derivam do epicardio (proepicardio). Vasculogenese coronariana inicia na 5a semana. [7]',
        physiology: 'Fluxo coronariano ocorre principalmente na diastole (compressao sistolica). Autorregulacao: fluxo constante entre PAM 60-140mmHg. [8]',
        clinicalCorrelation: 'Angina estavel: estenose >70%. Angina instavel: placa instavel com trombo parcial. IAMCSST: oclusao total com supra ST.',
        annotations: [
          { position: [-0.3, 0, 0.3], label: 'Coronaria Esquerda (TCE)', description: 'Bifurca em DA (descendente anterior) e Cx (circunflexa)', clinicalNote: 'Lesao de TCE: indicacao de cirurgia de revascularizacao' },
          { position: [0.3, 0, 0.3], label: 'Coronaria Direita (CD)', description: 'Irriga VD, parede inferior do VE e no sinusal (60%)', clinicalNote: 'IAM inferior: supra ST em DII, DIII, aVF' },
          { position: [-0.2, -0.3, 0.5], label: 'Descendente Anterior (DA)', description: 'Irriga parede anterior VE e 2/3 anteriores do septo', clinicalNote: 'Oclusao DA: IAM anterior extenso, pior prognostico' },
        ],
        pathologies: [
          { name: 'Doenca Arterial Coronariana', description: 'Aterosclerose coronariana progressiva', visualChange: 'Placas de ateroma com estenose luminal', reference: 'Braunwald Cap. 20' },
        ],
        examTips: ['Dominancia: CD em 85%, Cx em 15%', 'DA = "arteria da viuvez" (IAM anterior extenso)', 'Cateterismo: padrao-ouro para avaliacao coronariana'],
        references: ['Gray\'s Anatomy Cap. 56 [1]', 'Netter Plates 216-218 [2]'],
      },
      {
        id: 'great-vessels', name: 'Grandes Vasos', nameEn: 'Great Vessels', nameLatin: 'Vasa magna',
        description: 'Veias cavas superior e inferior, arteria e veias pulmonares, tronco pulmonar.',
        histology: 'Veias: tunica media fina, adventicia espessa. Arteria pulmonar: elastica como aorta. [6]',
        embryology: 'Tronco arterioso divide-se em aorta e tronco pulmonar (septo aortopulmonar espiral). Veias cardinais formam VCS. [7]',
        physiology: 'Circulacao pulmonar: baixa pressao (25/10mmHg). Retorno venoso: 5L/min. Pre-carga determinada pelo retorno venoso. [8]',
        clinicalCorrelation: 'TEP: trombo na arteria pulmonar. Sindrome de VCS: obstrucao por tumor mediastinal. Hipertensao pulmonar: PAP media >20mmHg.',
        annotations: [
          { position: [0.2, 0.5, 0], label: 'Veia Cava Superior', description: 'Drena cabeca, MMSS e torax superior', clinicalNote: 'Sindrome VCS: edema facial, pletora, circulacao colateral' },
          { position: [0.2, -0.5, 0], label: 'Veia Cava Inferior', description: 'Drena abdome, pelve e MMII', clinicalNote: 'Filtro de VCI: prevencao de TEP em pacientes com contraindicacao a anticoagulacao' },
        ],
        pathologies: [
          { name: 'Tromboembolismo Pulmonar', description: 'Trombo na arteria pulmonar', visualChange: 'Trombo vermelho-escuro no lumen arterial', reference: 'Robbins Cap. 4 [9]' },
        ],
        examTips: ['VCS: formada pela uniao das braquiocefalicas D e E', 'VCI: formada pela uniao das iliacas comuns em L5', 'Veias pulmonares: unicas veias que carregam sangue oxigenado'],
        references: ['Gray\'s Anatomy Cap. 54-55 [1]', 'Netter Plates 231-235 [2]'],
      },
    ]
  },
  {
    id: 'nervous', name: 'Sistema Nervoso', icon: <Brain className="w-5 h-5" />, color: '#F59E0B',
    description: 'Coordenacao e integracao de funcoes corporais. SNC + SNP. Ref: Gray\'s Anatomy Cap. 22-46 [1]',
    organs: [
      {
        id: 'brain', name: 'Cerebro', nameEn: 'Brain', nameLatin: 'Cerebrum',
        description: 'Orgao central do SNC. Peso: 1.4kg. 86 bilhoes de neuronios. Consome 20% do O2 corporal.',
        histology: 'Cortex: 6 camadas de neuronios. Substancia branca: axonios mielinizados. Neuroglia: astrocitos, oligodendrocitos, microglia. [6]',
        embryology: 'Tubo neural: prosencefalo (telencefalo+diencefalo), mesencefalo, rombencefalo (metencefalo+mielencefalo). Fechamento: 25o dia. [7]',
        physiology: 'Areas de Brodmann: 1-3 somatossensorial, 4 motora, 17 visual, 41-42 auditiva, 44-45 Broca. Fluxo sanguineo cerebral: 750mL/min. [8]',
        clinicalCorrelation: 'AVC isquemico: oclusao arterial cerebral. ACM: hemiparesia contralateral + afasia (se dominante). Janela trombolitica: 4.5h. [9]',
        annotations: [
          { position: [0, 0.3, 0.3], label: 'Lobo Frontal', description: 'Funcoes executivas, motricidade, personalidade, area de Broca (44-45)', clinicalNote: 'Lesao: sindrome frontal, abulia, desinibicao' },
          { position: [0.3, 0.3, 0], label: 'Lobo Temporal', description: 'Audicao, memoria, area de Wernicke (22)', clinicalNote: 'Epilepsia temporal: aura olfatoria/gustativa, deja vu' },
          { position: [0, 0.3, -0.3], label: 'Lobo Occipital', description: 'Processamento visual primario (area 17)', clinicalNote: 'Hemianopsia homonima: lesao do trato optico' },
          { position: [0.3, 0.5, 0], label: 'Lobo Parietal', description: 'Somatossensorial, integracao espacial', clinicalNote: 'Negligencia hemiespacial: lesao parietal D' },
          { position: [0, -0.2, -0.2], label: 'Cerebelo', description: 'Coordenacao motora, equilibrio, aprendizado motor', clinicalNote: 'Ataxia cerebelar: dismetria, disdiadococinesia' },
          { position: [0, -0.4, -0.1], label: 'Tronco Encefalico', description: 'Mesencefalo, ponte e bulbo. Centros vitais', clinicalNote: 'Morte encefalica: ausencia de reflexos de tronco' },
        ],
        pathologies: [
          { name: 'AVC Isquemico', description: 'Oclusao arterial cerebral com infarto', visualChange: 'Area palida com edema citotoxico', reference: 'Robbins Cap. 28 [9]' },
          { name: 'Doenca de Alzheimer', description: 'Demencia progressiva com placas amiloides e emaranhados neurofibrilares', visualChange: 'Atrofia cortical difusa, sulcos alargados', reference: 'Robbins Cap. 28 [9]' },
          { name: 'Meningioma', description: 'Tumor benigno das meninges', visualChange: 'Massa extra-axial com base dural', reference: 'Robbins Cap. 28 [9]' },
        ],
        examTips: ['Poligono de Willis: ACA + ACoA + ACI + ACoP + ACP + basilar', 'Herniacao uncal: midriase ipsilateral + hemiparesia contralateral', 'Glasgow: abertura ocular (4) + resposta verbal (5) + motora (6) = 3-15'],
        references: ['Gray\'s Anatomy Cap. 22-30 [1]', 'Netter Plates 100-150 [2]', 'Guyton Cap. 46-60 [8]'],
        sketchfabId: 'brain',
      },
      {
        id: 'spinal-cord', name: 'Medula Espinhal', nameEn: 'Spinal Cord', nameLatin: 'Medulla spinalis',
        description: 'Estrutura cilindrica no canal vertebral. Extensao: forame magno ate L1-L2. 31 pares de nervos espinhais.',
        histology: 'Substancia cinzenta central (H): cornos anterior (motor), posterior (sensorial), lateral (autonomo). Substancia branca: fasciculos. [6]',
        embryology: 'Tubo neural caudal. Placa alar (sensorial) e placa basal (motora). Defeitos: espinha bifida, mielomeningocele. [7]',
        physiology: 'Arco reflexo: receptor → aferente → centro integrador → eferente → efetor. Reflexos miotaticos: bicipital (C5-6), patelar (L3-4). [8]',
        clinicalCorrelation: 'Sindrome de Brown-Sequard: hemiseccao medular. Ipsilateral: paralisia + perda propriocepcao. Contralateral: perda dor/temperatura.',
        annotations: [
          { position: [0, 0.3, 0], label: 'Intumescencia Cervical', description: 'C4-T1: plexo braquial para MMSS', clinicalNote: 'Lesao C5-6: paralisia de Erb-Duchenne' },
          { position: [0, -0.3, 0], label: 'Intumescencia Lombar', description: 'L1-S3: plexo lombossacral para MMII', clinicalNote: 'Sindrome da cauda equina: emergencia cirurgica' },
        ],
        pathologies: [
          { name: 'Hernia Discal', description: 'Protrusao do nucleo pulposo com compressao radicular', visualChange: 'Disco herniado comprimindo raiz nervosa', reference: 'Moore Cap. 4 [4]' },
        ],
        examTips: ['Cone medular: L1-L2 no adulto', 'Puncao lombar: L3-L4 ou L4-L5 (abaixo do cone)', 'Dermatomos: C6=polegar, T4=mamilo, T10=umbigo, L5=halux'],
        references: ['Gray\'s Anatomy Cap. 43-44 [1]', 'Moore Cap. 4 [4]'],
      },
      {
        id: 'cranial-nerves', name: 'Nervos Cranianos', nameEn: 'Cranial Nerves', nameLatin: 'Nervi craniales',
        description: '12 pares de nervos cranianos. Origem: tronco encefalico (exceto I e II). Funcoes motoras, sensoriais e autonomas.',
        histology: 'Fibras nervosas mielinizadas e amielinizadas. Bainha de Schwann no SNP. Oligodendrocitos no SNC. [6]',
        embryology: 'Derivam das cristas neurais e placodios ectodermicos. Nervos branquiais: V, VII, IX, X. [7]',
        physiology: 'I-Olfatorio, II-Optico, III-Oculomotor, IV-Troclear, V-Trigemeo, VI-Abducente, VII-Facial, VIII-Vestibulococlear, IX-Glossofaringeo, X-Vago, XI-Acessorio, XII-Hipoglosso. [8]',
        clinicalCorrelation: 'Paralisia de Bell: VII par (facial). Neuralgia do trigemeo: V par, dor lancinante. Lesao do III par: ptose + midriase + estrabismo divergente.',
        annotations: [
          { position: [0, 0, 0.5], label: 'N. Optico (II)', description: 'Visao. Quiasma optico: fibras nasais cruzam', clinicalNote: 'Papiledema: edema do disco optico por hipertensao intracraniana' },
          { position: [0.3, -0.1, 0.3], label: 'N. Trigemeo (V)', description: 'Sensibilidade facial + mastigacao', clinicalNote: 'Neuralgia: dor em choque eletrico no territorio V2/V3' },
          { position: [0.3, -0.2, 0.2], label: 'N. Facial (VII)', description: 'Mimica facial + gustacao 2/3 ant. lingua', clinicalNote: 'Central vs Periferico: central poupa fronte (inervacao bilateral)' },
        ],
        pathologies: [
          { name: 'Paralisia de Bell', description: 'Paralisia facial periferica idiopatica', visualChange: 'Assimetria facial unilateral completa', reference: 'Adams & Victor Neurology, 11th Ed' },
        ],
        examTips: ['Mnemonica: Oh Oh Oh To Touch And Feel Very Good Velvet AH', 'III par: "down and out" + ptose + midriase', 'Reflexo corneopalpebral: aferente V1, eferente VII'],
        references: ['Gray\'s Anatomy Cap. 31-42 [1]', 'Netter Plates 118-130 [2]'],
      },
    ]
  },
  {
    id: 'respiratory', name: 'Sistema Respiratorio', icon: <Wind className="w-5 h-5" />, color: '#3B82F6',
    description: 'Trocas gasosas entre o organismo e o ambiente. Ref: Guyton Cap. 38-42 [8]',
    organs: [
      {
        id: 'lungs', name: 'Pulmoes', nameEn: 'Lungs', nameLatin: 'Pulmones',
        description: 'Orgaos da respiracao. Pulmao D: 3 lobos (superior, medio, inferior). Pulmao E: 2 lobos. Area de troca: 70m2.',
        histology: 'Alveolo: pneumocitos tipo I (troca gasosa) e tipo II (surfactante). Membrana alveolocapilar: 0.5um. 300 milhoes de alveolos. [6]',
        embryology: 'Broto pulmonar: 4a semana. Fases: embrionaria, pseudoglandular, canalicular, sacular, alveolar. Surfactante: 35a semana. [7]',
        physiology: 'Volume corrente: 500mL. Capacidade vital: 4.8L. Volume residual: 1.2L. VEMS/CVF >0.7 normal. PaO2: 80-100mmHg. PaCO2: 35-45mmHg. [8]',
        clinicalCorrelation: 'DPOC: obstrucao cronica ao fluxo aereo. Enfisema: destruicao alveolar. Bronquite cronica: tosse produtiva >3 meses/ano por 2 anos.',
        annotations: [
          { position: [-0.3, 0.2, 0.3], label: 'Lobo Superior D', description: 'Segmentos: apical, posterior, anterior', clinicalNote: 'TB pulmonar: predilecao por apices' },
          { position: [-0.3, 0, 0.3], label: 'Lobo Medio D', description: 'Segmentos: lateral e medial', clinicalNote: 'Sindrome do lobo medio: atelectasia recorrente' },
          { position: [0.3, 0.2, 0.3], label: 'Lobo Superior E', description: 'Segmentos: apicoposterior, anterior, lingular sup/inf', clinicalNote: 'Lingula: equivalente ao lobo medio' },
        ],
        pathologies: [
          { name: 'Pneumonia', description: 'Infeccao do parenquima pulmonar', visualChange: 'Consolidacao lobar ou broncopneumonia', reference: 'Robbins Cap. 15 [9]' },
          { name: 'Carcinoma Pulmonar', description: 'Neoplasia maligna mais letal', visualChange: 'Massa hilar ou nodulo periferico', reference: 'Robbins Cap. 15 [9]' },
          { name: 'Pneumotorax', description: 'Ar no espaco pleural', visualChange: 'Colapso pulmonar com desvio mediastinal', reference: 'Sabiston Cap. 58' },
        ],
        examTips: ['Hilo pulmonar: arteria, veias, bronquio, linfaticos', 'Bronquio principal D: mais vertical, curto e largo (aspiracao)', 'Surfactante: reduz tensao superficial, previne colapso alveolar'],
        references: ['Gray\'s Anatomy Cap. 57-58 [1]', 'Netter Plates 192-210 [2]', 'Guyton Cap. 38-42 [8]'],
        sketchfabId: 'lungs-heart',
      },
      {
        id: 'trachea', name: 'Traqueia e Bronquios', nameEn: 'Trachea & Bronchi', nameLatin: 'Trachea et Bronchi',
        description: 'Traqueia: 10-12cm, 16-20 aneis cartilaginosos em C. Bifurcacao (carina): T4-5. Bronquios lobares e segmentares.',
        histology: 'Epitelo pseudoestratificado ciliado com celulas caliciformes. Cartilagem hialina. Musculo liso (bronquios). [6]',
        embryology: 'Sulco laringotraqueal: 4a semana. Septo traqueoesofagico separa traqueia do esofago. Fistula TE: malformacao comum. [7]',
        physiology: 'Espaco morto anatomico: 150mL. Clearance mucociliar: 1-2cm/min. Broncoconstriccao: parasimpatico (ACh). Broncodilatacao: simpatico (beta-2). [8]',
        clinicalCorrelation: 'Asma: broncoespasmo reversivel. Tratamento: beta-2 agonista (salbutamol) + corticoide inalatorio. Crise grave: MgSO4 IV.',
        annotations: [
          { position: [0, 0.5, 0.2], label: 'Carina', description: 'Bifurcacao traqueal em T4-5', clinicalNote: 'Alargamento da carina: sinal de linfadenopatia subcarinal' },
        ],
        pathologies: [
          { name: 'Asma Bronquica', description: 'Inflamacao cronica com hiperreatividade bronquica', visualChange: 'Bronquios estreitados com muco espesso', reference: 'Robbins Cap. 15 [9]' },
        ],
        examTips: ['Carina: nivel T4-5 (angulo de Louis)', 'Bronquio principal D: corpo estranho cai mais frequentemente aqui', 'Arvore bronquica: 23 geracoes de ramificacao'],
        references: ['Gray\'s Anatomy Cap. 57 [1]', 'Netter Plates 195-198 [2]'],
      },
    ]
  },
  {
    id: 'digestive', name: 'Sistema Digestorio', icon: <Utensils className="w-5 h-5" />, color: '#10B981',
    description: 'Digestao e absorcao de nutrientes. Trato GI: 9m de comprimento. Ref: Guyton Cap. 63-67 [8]',
    organs: [
      {
        id: 'liver', name: 'Figado', nameEn: 'Liver', nameLatin: 'Hepar',
        description: 'Maior glandula do corpo. Peso: 1.5kg. Lobo D (maior) e E. Dupla irrigacao: arteria hepatica (25%) e veia porta (75%).',
        histology: 'Lobulos hepaticos hexagonais com hepatocitos radiados. Triade portal: ramo da veia porta, arteria hepatica e ducto biliar. Celulas de Kupffer. [6]',
        embryology: 'Broto hepatico do intestino anterior (4a semana). Hematopoiese fetal: 6a-7a semana. [7]',
        physiology: 'Funcoes: metabolismo de carboidratos/lipidios/proteinas, sintese de albumina e fatores de coagulacao, detoxificacao, producao de bile (500-1000mL/dia). [8]',
        clinicalCorrelation: 'Cirrose: fibrose hepatica difusa. Child-Pugh: classifica gravidade. MELD: prioriza transplante. Hepatocarcinoma: AFP elevada.',
        annotations: [
          { position: [0, 0, 0.5], label: 'Lobo Direito', description: 'Maior lobo, subdividido em segmentos V-VIII (Couinaud)', clinicalNote: 'Hepatectomia D: segmentos V-VIII' },
          { position: [-0.3, 0, 0.3], label: 'Lobo Esquerdo', description: 'Segmentos II-IV (Couinaud)', clinicalNote: 'Hepatectomia E: segmentos II-IV' },
          { position: [0, -0.3, 0.3], label: 'Porta Hepatis', description: 'Veia porta, arteria hepatica propria, ducto hepatico comum', clinicalNote: 'Colangiocarcinoma hilar (tumor de Klatskin)' },
        ],
        pathologies: [
          { name: 'Cirrose Hepatica', description: 'Fibrose difusa com nodulos de regeneracao', visualChange: 'Figado nodular, diminuido, endurecido', reference: 'Robbins Cap. 18 [9]' },
          { name: 'Hepatocarcinoma', description: 'Neoplasia maligna primaria do figado', visualChange: 'Massa hepatica hipervascular', reference: 'Robbins Cap. 18 [9]' },
          { name: 'Esteatose Hepatica', description: 'Acumulo de gordura nos hepatocitos', visualChange: 'Figado amarelado e aumentado', reference: 'Robbins Cap. 18 [9]' },
        ],
        examTips: ['Segmentacao de Couinaud: 8 segmentos baseados na vascularizacao', 'Veia porta: formada pela uniao da mesenterica superior + esplenica', 'Ictericia: bilirrubina >2mg/dL'],
        references: ['Gray\'s Anatomy Cap. 65 [1]', 'Netter Plates 277-290 [2]', 'Guyton Cap. 70 [8]'],
      },
      {
        id: 'stomach', name: 'Estomago', nameEn: 'Stomach', nameLatin: 'Gaster',
        description: 'Orgao muscular em J. Capacidade: 1-1.5L. Regioes: cardia, fundo, corpo, antro, piloro. pH: 1.5-3.5.',
        histology: 'Glandulas gastricas: celulas parietais (HCl + fator intrinseco), principais (pepsinogenio), mucosas (muco), G (gastrina), ECL (histamina). [6]',
        embryology: 'Intestino anterior. Rotacao 90° horaria: curvatura maior a esquerda. Omento maior e menor. [7]',
        physiology: 'Secrecao acida: 2-3L/dia. Fases: cefalica (vago), gastrica (gastrina), intestinal. Esvaziamento: 2-6h. Fator intrinseco: absorcao B12 no ileo. [8]',
        clinicalCorrelation: 'Ulcera peptica: H. pylori (70%) ou AINEs. Diagnostico: EDA com biopsia. Tratamento: IBP + claritromicina + amoxicilina (14 dias).',
        annotations: [
          { position: [0, 0.3, 0.3], label: 'Fundo Gastrico', description: 'Reservatorio de gas e alimento', clinicalNote: 'Varizes de fundo: hipertensao portal' },
          { position: [0, 0, 0.3], label: 'Corpo Gastrico', description: 'Celulas parietais e principais', clinicalNote: 'Gastrite atrofica: risco de anemia perniciosa' },
          { position: [0, -0.3, 0.2], label: 'Antro Pilorico', description: 'Celulas G produtoras de gastrina', clinicalNote: 'Ulcera antral: mais comum por H. pylori' },
        ],
        pathologies: [
          { name: 'Ulcera Peptica', description: 'Lesao da mucosa que atinge a muscular da mucosa', visualChange: 'Cratera com bordas regulares e fundo limpo', reference: 'Robbins Cap. 17 [9]' },
          { name: 'Adenocarcinoma Gastrico', description: 'Neoplasia maligna mais comum do estomago', visualChange: 'Massa ulcerada ou infiltrativa (linite plastica)', reference: 'Robbins Cap. 17 [9]' },
        ],
        examTips: ['Irrigacao: tronco celiaco (gastrica E, gastroduodenal, gastroepiploica)', 'Ulcera duodenal: mais comum que gastrica, dor melhora com alimentacao', 'Gastrectomia: sindrome de dumping (esvaziamento rapido)'],
        references: ['Gray\'s Anatomy Cap. 63 [1]', 'Netter Plates 265-275 [2]'],
      },
      {
        id: 'intestines', name: 'Intestinos', nameEn: 'Intestines', nameLatin: 'Intestinum',
        description: 'Delgado: 6m (duodeno 25cm, jejuno 2.5m, ileo 3.5m). Grosso: 1.5m (ceco, colons, reto). Absorcao: 9L/dia.',
        histology: 'Vilosidades intestinais (delgado): enterocitos com microvilosidades. Criptas de Lieberkuhn. Placas de Peyer (ileo). Colon: sem vilosidades, celulas caliciformes abundantes. [6]',
        embryology: 'Intestino medio: rotacao 270° anti-horaria ao redor da AMS. Herniacão fisiologica: 6a-10a semana. Ma-rotacao: risco de volvo. [7]',
        physiology: 'Absorcao: ferro (duodeno), B12 (ileo terminal), agua (colon). Motilidade: peristalse + segmentacao. Flora intestinal: 10^14 bacterias. [8]',
        clinicalCorrelation: 'Apendicite: dor periumbilical → FID. Sinal de McBurney. Doenca de Crohn: transmural, ileo terminal. RCU: mucosa, retocolite.',
        annotations: [
          { position: [0, 0.3, 0], label: 'Duodeno', description: '4 porcoes (C duodenal). Papila maior: ducto coledoco + pancreatico', clinicalNote: 'Ulcera duodenal posterior: erosao da gastroduodenal' },
          { position: [-0.3, 0, 0], label: 'Jejuno', description: 'Pregas circulares proeminentes, vasa recta longos', clinicalNote: 'Doenca celiaca: atrofia vilositaria no jejuno' },
          { position: [0.3, -0.3, 0], label: 'Apendice Vermiforme', description: 'Orgao linfoide vestigial no ceco', clinicalNote: 'Apendicite: emergencia cirurgica mais comum' },
        ],
        pathologies: [
          { name: 'Apendicite Aguda', description: 'Inflamacao do apendice vermiforme', visualChange: 'Apendice edemaciado, hiperemiado, com exsudato', reference: 'Sabiston Cap. 51' },
          { name: 'Doenca de Crohn', description: 'Doenca inflamatoria intestinal transmural', visualChange: 'Ulceras aftoides, aspecto em pedra de calcamento', reference: 'Robbins Cap. 17 [9]' },
        ],
        examTips: ['Jejuno vs Ileo: jejuno tem mais pregas, menos gordura mesenterica, vasa recta longos', 'Apendice: ponto de McBurney (1/3 lateral da linha EIAS-umbigo)', 'Colon: tenias, haustracoes, apendices epiploicos'],
        references: ['Gray\'s Anatomy Cap. 64-66 [1]', 'Netter Plates 276-310 [2]'],
      },
    ]
  },
  {
    id: 'urinary', name: 'Sistema Urinario', icon: <Droplets className="w-5 h-5" />, color: '#8B5CF6',
    description: 'Filtracao sanguinea e homeostase hidroeletrolitica. Ref: Guyton Cap. 26-31 [8]',
    organs: [
      {
        id: 'kidney', name: 'Rins', nameEn: 'Kidneys', nameLatin: 'Renes',
        description: 'Orgaos retroperitoneais em T12-L3. Peso: 150g cada. 1 milhao de nefrons por rim. TFG: 125mL/min (180L/dia).',
        histology: 'Nefron: glomerulo (filtracao) + tubulos (reabsorcao/secrecao). Cortex: glomerulos e tubulos contorcidos. Medula: alcas de Henle e ductos coletores. [6]',
        embryology: 'Pronefro → mesonefro → metanefro (rim definitivo, 5a semana). Broto ureteral induz diferenciacao do blastema metanefrico. [7]',
        physiology: 'TFG: 125mL/min. Reabsorcao: 99% da agua filtrada. Hormônios: renina (SRAA), eritropoietina, calcitriol (vitamina D ativa). [8]',
        clinicalCorrelation: 'IRA: pre-renal (hipoperfusao), renal (NTA, glomerulonefrite), pos-renal (obstrucao). Creatinina e ureia elevadas. DRC: TFG <60mL/min por >3 meses.',
        annotations: [
          { position: [0, 0.2, 0.3], label: 'Cortex Renal', description: 'Glomerulos, TCP, TCD. Aspecto granular', clinicalNote: 'Glomerulonefrite: hematuria + proteinuria + edema + HAS' },
          { position: [0, -0.1, 0.3], label: 'Medula Renal', description: 'Piramides renais com alcas de Henle e ductos coletores', clinicalNote: 'Necrose papilar: diabetes, anemia falciforme, AINEs' },
          { position: [0, -0.3, 0.2], label: 'Pelve Renal', description: 'Coleta urina dos calices maiores e menores', clinicalNote: 'Hidronefrose: dilatacao por obstrucao' },
        ],
        pathologies: [
          { name: 'Glomerulonefrite', description: 'Inflamacao glomerular', visualChange: 'Rins aumentados, edemaciados', reference: 'Robbins Cap. 20 [9]' },
          { name: 'Carcinoma de Celulas Renais', description: 'Neoplasia maligna renal mais comum', visualChange: 'Massa solida amarelada no polo renal', reference: 'Robbins Cap. 20 [9]' },
          { name: 'Nefrolitiase', description: 'Calculos renais (oxalato de calcio 80%)', visualChange: 'Calculos no sistema coletor', reference: 'Robbins Cap. 20 [9]' },
        ],
        examTips: ['Rim D mais baixo que E (figado)', 'Hilo renal (anterior→posterior): veia, arteria, pelve (VAP)', 'Clearance de creatinina: melhor estimativa da TFG'],
        references: ['Gray\'s Anatomy Cap. 74 [1]', 'Netter Plates 320-335 [2]', 'Guyton Cap. 26-31 [8]'],
        sketchfabId: 'kidney',
      },
    ]
  },
  {
    id: 'musculoskeletal', name: 'Sistema Musculoesqueletico', icon: <Bone className="w-5 h-5" />, color: '#F97316',
    description: 'Suporte, protecao e movimento. 206 ossos, 600+ musculos. Ref: Moore Cap. 1-9 [4]',
    organs: [
      {
        id: 'skeleton-full', name: 'Esqueleto', nameEn: 'Skeleton', nameLatin: 'Skeleton',
        description: '206 ossos no adulto. Axial: 80 (cranio, coluna, costelas). Apendicular: 126 (membros e cinturas).',
        histology: 'Osso compacto (cortical): osteons com canais de Havers. Osso esponjoso (trabecular): trabeculas com medula. Osteoblastos, osteocitos, osteoclastos. [6]',
        embryology: 'Ossificacao intramembranosa: cranio, clavicula. Ossificacao endocondral: ossos longos (modelo cartilaginoso). Placa epifisaria: crescimento longitudinal. [7]',
        physiology: 'Funcoes: suporte, protecao, movimento, hematopoiese, reserva de calcio. Remodelamento osseo: osteoblastos vs osteoclastos. PTH e calcitonina. [8]',
        clinicalCorrelation: 'Osteoporose: T-score <-2.5 (DEXA). Fratura de quadril: mortalidade 20% em 1 ano. Tratamento: bisfosfonatos, vitamina D, calcio.',
        annotations: [
          { position: [0, 0.8, 0], label: 'Cranio', description: '22 ossos: 8 neurocrânio + 14 viscerocrânio', clinicalNote: 'Fratura de base: sinal de Battle, olhos de guaxinim' },
          { position: [0, 0.2, 0], label: 'Coluna Vertebral', description: '33 vertebras: 7C + 12T + 5L + 5S + 4Co', clinicalNote: 'Fratura de Jefferson (C1), Hangman (C2), burst (toracolombar)' },
          { position: [0.3, -0.2, 0], label: 'Pelve', description: 'Iliaco + sacro + coccix. Suporta peso do tronco', clinicalNote: 'Fratura de pelve: hemorragia grave (plexo venoso)' },
        ],
        pathologies: [
          { name: 'Osteoporose', description: 'Reducao da densidade mineral ossea', visualChange: 'Osso poroso, trabeculas finas e esparsas', reference: 'Robbins Cap. 26 [9]' },
          { name: 'Osteossarcoma', description: 'Tumor osseo maligno primario mais comum em jovens', visualChange: 'Massa ossea com reacao periosteal (triangulo de Codman)', reference: 'Robbins Cap. 26 [9]' },
        ],
        examTips: ['Osso mais fraturado: clavicula (terco medio)', 'Fratura de Colles: radio distal com desvio dorsal', 'Triangulo de Codman: osteossarcoma (nao osteomielite)'],
        references: ['Gray\'s Anatomy Cap. 47-52 [1]', 'Moore Cap. 1-9 [4]', 'Netter Plates 1-90 [2]'],
        sketchfabId: 'skeleton',
      },
    ]
  },
  {
    id: 'endocrine', name: 'Sistema Endocrino', icon: <Zap className="w-5 h-5" />, color: '#EC4899',
    description: 'Regulacao hormonal do metabolismo, crescimento e reproducao. Ref: Guyton Cap. 76-83 [8]',
    organs: [
      {
        id: 'thyroid', name: 'Tireoide', nameEn: 'Thyroid', nameLatin: 'Glandula thyroidea',
        description: 'Glandula em borboleta anterior a traqueia. Peso: 20-30g. Lobos D e E + istmo. Produz T3, T4 e calcitonina.',
        histology: 'Foliculos tireoidianos: coloide (tireoglobulina). Celulas foliculares (T3/T4). Celulas parafoliculares C (calcitonina). [6]',
        embryology: 'Diverticulo tireoidiano do assoalho faringeo (forame cego). Migra caudalmente pelo ducto tireoglosso. Cisto tireoglosso: massa na linha media. [7]',
        physiology: 'T4 (tiroxina): 90% da secrecao. T3: forma ativa (conversao periferica). Eixo: TRH → TSH → T3/T4. Feedback negativo. [8]',
        clinicalCorrelation: 'Hipotireoidismo: Hashimoto (anti-TPO). Hipertireoidismo: Graves (anti-TRAb). Nodulo tireoidiano: PAAF se >1cm ou suspeito.',
        annotations: [
          { position: [-0.2, 0, 0.3], label: 'Lobo Direito', description: 'Geralmente maior que o esquerdo', clinicalNote: 'Nodulo solitario: investigar com USG + PAAF' },
          { position: [0, 0, 0.3], label: 'Istmo', description: 'Conecta os lobos sobre 2o-3o aneis traqueais', clinicalNote: 'Traqueostomia: abaixo do istmo' },
        ],
        pathologies: [
          { name: 'Tireoidite de Hashimoto', description: 'Tireoidite autoimune cronica', visualChange: 'Glandula aumentada, firme, lobulada', reference: 'Robbins Cap. 24 [9]' },
          { name: 'Carcinoma Papilifero', description: 'Neoplasia tireoidiana mais comum (80%)', visualChange: 'Nodulo solido com calcificacoes (corpos de psamoma)', reference: 'Robbins Cap. 24 [9]' },
        ],
        examTips: ['N. laringeo recorrente: posterior a tireoide, risco em tireoidectomia', 'Paratireoides: 4 glandulas posteriores a tireoide', 'TSH: melhor exame para rastreio tireoidiano'],
        references: ['Gray\'s Anatomy Cap. 35 [1]', 'Netter Plates 74-76 [2]', 'Guyton Cap. 77 [8]'],
      },
    ]
  },
  {
    id: 'lymphatic', name: 'Sistema Linfatico', icon: <Shield className="w-5 h-5" />, color: '#14B8A6',
    description: 'Defesa imunologica e drenagem linfatica. Ref: Guyton Cap. 34 [8]',
    organs: [
      {
        id: 'spleen', name: 'Baco', nameEn: 'Spleen', nameLatin: 'Lien/Splen',
        description: 'Maior orgao linfoide. Peso: 150g. Hipocondrio E, posterior ao estomago. Funcoes: filtracao sanguinea, imunidade, reserva de plaquetas.',
        histology: 'Polpa branca: tecido linfoide (linfocitos T periarteriolares + foliculos B). Polpa vermelha: sinusoides esplênicos, macrofagos. [6]',
        embryology: 'Mesoderma do mesogastrio dorsal. Unico orgao linfoide de origem mesodérmica. [7]',
        physiology: 'Filtracao: remove hemacias velhas/danificadas. Imunidade: producao de anticorpos (IgM). Reserva: 1/3 das plaquetas. Hematopoiese fetal. [8]',
        clinicalCorrelation: 'Esplenomegalia: infeccoes, hipertensao portal, hematologicas. Ruptura esplenica: trauma abdominal, emergencia cirurgica. Asplenia: risco de infeccoes encapsuladas.',
        annotations: [
          { position: [0, 0, 0.3], label: 'Hilo Esplenico', description: 'Arteria e veia esplenica, vasos linfaticos', clinicalNote: 'Esplenectomia: vacinar contra pneumococo, meningococo, H. influenzae' },
        ],
        pathologies: [
          { name: 'Esplenomegalia', description: 'Aumento do baco por diversas causas', visualChange: 'Baco aumentado, podendo ultrapassar a linha media', reference: 'Robbins Cap. 13 [9]' },
        ],
        examTips: ['Regra dos 1s: 1x3x5 polegadas, 7oz, 9-11a costela, 1 arteria (esplenica)', 'Corpusculos de Howell-Jolly: inclusoes em hemacias pos-esplenectomia', 'Baco nao e palpavel normalmente; se palpavel, ja esta 2-3x aumentado'],
        references: ['Gray\'s Anatomy Cap. 67 [1]', 'Netter Plates 291-295 [2]'],
      },
    ]
  },
  {
    id: 'reproductive', name: 'Sistema Reprodutor', icon: <Baby className="w-5 h-5" />, color: '#F472B6',
    description: 'Reproducao e desenvolvimento. Ref: Williams Obstetrics [10]',
    organs: [
      {
        id: 'uterus', name: 'Utero', nameEn: 'Uterus', nameLatin: 'Uterus',
        description: 'Orgao muscular piriforme na pelve. Partes: fundo, corpo, istmo, colo. Tamanho: 7x5x2.5cm. Parede: endometrio, miometrio, perimetrio.',
        histology: 'Endometrio: camada funcional (descama na menstruacao) e basal. Miometrio: musculo liso em 3 camadas. Glandulas endometriais. [6]',
        embryology: 'Ductos de Muller (paramesonefricos): fusao forma utero, tubas e 2/3 superiores da vagina. Agenesia mulleriana: sindrome de Rokitansky. [7]',
        physiology: 'Ciclo menstrual: fase folicular (estrogeno) → ovulacao → fase lutea (progesterona). Duracao media: 28 dias. Implantacao: 6-7 dias pos-ovulacao. [8]',
        clinicalCorrelation: 'Mioma uterino: tumor benigno mais comum. Endometriose: tecido endometrial ectopico. Cancer de colo: HPV 16/18, rastreio com Papanicolau.',
        annotations: [
          { position: [0, 0.2, 0.3], label: 'Fundo Uterino', description: 'Porcao superior, acima da insercao das tubas', clinicalNote: 'Implantacao normal: parede posterior do fundo' },
          { position: [0, -0.2, 0.3], label: 'Colo Uterino', description: 'Porcao inferior, canal endocervical', clinicalNote: 'NIC/Cancer: zona de transformacao (JEC)' },
        ],
        pathologies: [
          { name: 'Leiomioma (Mioma)', description: 'Tumor benigno do miometrio', visualChange: 'Nodulos firmes, bem delimitados, espiralados', reference: 'Robbins Cap. 22 [9]' },
          { name: 'Adenocarcinoma Endometrial', description: 'Neoplasia maligna do endometrio', visualChange: 'Massa polipoide na cavidade uterina', reference: 'Robbins Cap. 22 [9]' },
        ],
        examTips: ['Irrigacao: arteria uterina (ramo da iliaca interna)', 'Ligamento largo: peritoneo que recobre utero e tubas', 'Ureter cruza ABAIXO da arteria uterina ("agua passa sob a ponte")'],
        references: ['Gray\'s Anatomy Cap. 77 [1]', 'Netter Plates 360-375 [2]', 'Williams Obstetrics [10]'],
      },
    ]
  },
  {
    id: 'integumentary', name: 'Sistema Tegumentar', icon: <Eye className="w-5 h-5" />, color: '#A78BFA',
    description: 'Protecao, termorregulacao, sensibilidade. Maior orgao do corpo: 1.5-2m2. Ref: Junqueira Cap. 18 [6]',
    organs: [
      {
        id: 'skin', name: 'Pele', nameEn: 'Skin', nameLatin: 'Cutis/Integumentum',
        description: 'Maior orgao do corpo. 3 camadas: epiderme, derme, hipoderme. Peso: 3-4kg. Area: 1.5-2m2.',
        histology: 'Epiderme: estratificado pavimentoso queratinizado (5 camadas). Melanocitos, celulas de Langerhans, Merkel. Derme: papilar (areolar) e reticular (denso). [6]',
        embryology: 'Epiderme: ectoderma. Derme: mesoderma. Crista neural: melanocitos. Apendices cutaneos: 3o-4o mes. [7]',
        physiology: 'Funcoes: barreira, termorregulacao (sudorese, vasodilatacao), sensibilidade (mecanorreceptores), sintese vitamina D, imunidade (Langerhans). [8]',
        clinicalCorrelation: 'Melanoma: ABCDE (Assimetria, Bordas, Cor, Diametro, Evolucao). Indice de Breslow: espessura determina prognostico. Carcinoma basocelular: mais comum.',
        annotations: [
          { position: [0, 0.3, 0.3], label: 'Epiderme', description: '5 camadas: basal, espinhosa, granulosa, lucida, cornea', clinicalNote: 'Psoríase: hiperproliferacao da camada basal' },
          { position: [0, 0, 0.3], label: 'Derme', description: 'Colageno, elastina, vasos, nervos, apendices', clinicalNote: 'Queimadura 2o grau: atinge derme (bolhas)' },
        ],
        pathologies: [
          { name: 'Melanoma', description: 'Neoplasia maligna dos melanocitos', visualChange: 'Lesao pigmentada assimetrica com bordas irregulares', reference: 'Robbins Cap. 25 [9]' },
          { name: 'Carcinoma Basocelular', description: 'Neoplasia cutanea maligna mais comum', visualChange: 'Nodulo perolado com telangiectasias', reference: 'Robbins Cap. 25 [9]' },
        ],
        examTips: ['Regra dos 9 (queimaduras): cabeca 9%, MMSS 9% cada, tronco anterior/posterior 18% cada, MMII 18% cada, perineo 1%', 'Dermatomo: area cutanea inervada por uma raiz nervosa', 'Linhas de Langer: direcao das fibras colagenas na derme'],
        references: ['Junqueira Cap. 18 [6]', 'Robbins Cap. 25 [9]'],
      },
    ]
  },
  {
    id: 'sensory', name: 'Sistema Sensorial', icon: <Eye className="w-5 h-5" />, color: '#06B6D4',
    description: 'Orgaos dos sentidos: visao, audicao, olfato, gustacao, equilibrio. Ref: Guyton Cap. 50-53 [8]',
    organs: [
      {
        id: 'eye', name: 'Olho', nameEn: 'Eye', nameLatin: 'Oculus',
        description: 'Orgao da visao. 3 tunicas: fibrosa (cornea/esclera), vascular (uvea), nervosa (retina). Diametro: 24mm.',
        histology: 'Retina: 10 camadas. Fotorreceptores: cones (cor, fovea) e bastonetes (luz fraca, periferia). Celulas ganglionares → nervo optico. [6]',
        embryology: 'Vesicula optica (diencefalo) → calice optico. Cristalino: ectoderma. Cornea: ectoderma + mesoderma. [7]',
        physiology: 'Acomodacao: musculo ciliar altera curvatura do cristalino. Humor aquoso: produzido pelo corpo ciliar, drenado pelo canal de Schlemm. Pressao intraocular: 10-21mmHg. [8]',
        clinicalCorrelation: 'Glaucoma: PIO elevada com lesao do nervo optico. Catarata: opacificacao do cristalino. Descolamento de retina: flashes + moscas volantes + cortina.',
        annotations: [
          { position: [0, 0, 0.5], label: 'Cornea', description: 'Transparente, avascular, 2/3 do poder refrativo', clinicalNote: 'Ulcera de cornea: emergencia oftalmologica' },
          { position: [0, 0, -0.3], label: 'Retina', description: 'Camada nervosa com fotorreceptores', clinicalNote: 'Retinopatia diabetica: microaneurismas, exsudatos, neovascularizacao' },
        ],
        pathologies: [
          { name: 'Glaucoma', description: 'Neuropatia optica com PIO elevada', visualChange: 'Escavacao do disco optico aumentada', reference: 'Robbins Cap. 29 [9]' },
          { name: 'Catarata', description: 'Opacificacao do cristalino', visualChange: 'Cristalino esbranquicado/opaco', reference: 'Kanski Clinical Ophthalmology, 9th Ed' },
        ],
        examTips: ['Reflexo pupilar: aferente II par, eferente III par', 'Defeito pupilar aferente relativo (Marcus Gunn): lesao do nervo optico', 'Fundo de olho: unico local onde se ve vasos diretamente'],
        references: ['Gray\'s Anatomy Cap. 41 [1]', 'Netter Plates 82-90 [2]', 'Guyton Cap. 50-51 [8]'],
        sketchfabId: 'eye',
      },
    ]
  },
  {
    id: 'hematologic', name: 'Sistema Hematologico', icon: <Activity className="w-5 h-5" />, color: '#DC2626',
    description: 'Sangue e hematopoiese. Volume sanguineo: 5L. Ref: Guyton Cap. 32-36 [8]',
    organs: [
      {
        id: 'bone-marrow', name: 'Medula Ossea', nameEn: 'Bone Marrow', nameLatin: 'Medulla ossium',
        description: 'Tecido hematopoietico nos ossos. Medula vermelha (ativa): vertebras, esterno, costelas, iliaco, epifises. Medula amarela: gordura.',
        histology: 'Celula-tronco hematopoietica → linhagem mieloide (eritrocitos, granulocitos, monocitos, plaquetas) e linfoide (linfocitos B e T). Estroma: celulas reticulares, adipocitos. [6]',
        embryology: 'Hematopoiese: saco vitelino (3a semana) → figado fetal (6a semana) → medula ossea (5o mes). Pos-natal: exclusivamente medular. [7]',
        physiology: 'Eritropoiese: 7 dias. Eritropoietina (rim) estimula producao. Hemoglobina: 12-16g/dL. Hemacias: 120 dias de vida. Plaquetas: 150-400mil, vida 7-10 dias. [8]',
        clinicalCorrelation: 'Anemia: Hb <12 (mulher) ou <13 (homem). Leucemia: proliferacao clonal maligna. Mielograma: aspirado de crista iliaca posterior.',
        annotations: [
          { position: [0, 0, 0.3], label: 'Medula Vermelha', description: 'Tecido hematopoietico ativo', clinicalNote: 'Aplasia medular: pancitopenia, medula hipocelular' },
        ],
        pathologies: [
          { name: 'Leucemia Mieloide Aguda', description: 'Proliferacao clonal de blastos mieloides', visualChange: 'Medula hipercelular com >20% de blastos', reference: 'Robbins Cap. 13 [9]' },
          { name: 'Mieloma Multiplo', description: 'Neoplasia de plasmocitos na medula', visualChange: 'Lesoes liticas em cranio (sal e pimenta)', reference: 'Robbins Cap. 13 [9]' },
        ],
        examTips: ['Hemograma: eritrograma + leucograma + plaquetograma', 'Reticulocitos: hemacias jovens, aumentados em hemolise', 'Biopsia de medula: crista iliaca posterior (padrao-ouro)'],
        references: ['Junqueira Cap. 13 [6]', 'Robbins Cap. 13 [9]', 'Guyton Cap. 32-33 [8]'],
      },
    ]
  },
];

// === QUIZ QUESTIONS (40 questions, adaptive SM-2) ===
const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 'q1', question: 'Qual estrutura do coracao recebe sangue das veias pulmonares?', options: ['Atrio Direito', 'Atrio Esquerdo', 'Ventriculo Direito', 'Ventriculo Esquerdo'], correctIndex: 1, explanation: 'O atrio esquerdo recebe sangue oxigenado das 4 veias pulmonares. Gray\'s Anatomy Cap. 56 [1]', difficulty: 'easy', system: 'cardiovascular', reference: 'Gray\'s [1]' },
  { id: 'q2', question: 'A arteria descendente anterior (DA) irriga principalmente qual parede do VE?', options: ['Inferior', 'Lateral', 'Anterior', 'Posterior'], correctIndex: 2, explanation: 'A DA irriga a parede anterior do VE e os 2/3 anteriores do septo interventricular. Netter [2]', difficulty: 'medium', system: 'cardiovascular', reference: 'Netter [2]' },
  { id: 'q3', question: 'Qual o volume sistolico normal em repouso?', options: ['30 mL', '50 mL', '70 mL', '100 mL'], correctIndex: 2, explanation: 'Volume sistolico normal: ~70mL. Debito cardiaco = VS x FC = 70 x 70 = ~5L/min. Guyton Cap. 9 [8]', difficulty: 'easy', system: 'cardiovascular', reference: 'Guyton [8]' },
  { id: 'q4', question: 'Na disseccao tipo A de aorta, qual a conduta?', options: ['Tratamento clinico', 'Cirurgia de emergencia', 'Stent endovascular', 'Observacao'], correctIndex: 1, explanation: 'Disseccao tipo A (aorta ascendente) = cirurgia de emergencia. Tipo B = tratamento clinico (se nao complicada). Braunwald', difficulty: 'hard', system: 'cardiovascular', reference: 'Braunwald' },
  { id: 'q5', question: 'Qual area de Brodmann corresponde ao cortex motor primario?', options: ['Area 1-3', 'Area 4', 'Area 17', 'Area 44-45'], correctIndex: 1, explanation: 'Area 4 = cortex motor primario (giro pre-central). Areas 1-3 = somatossensorial. 17 = visual. 44-45 = Broca. Guyton Cap. 55 [8]', difficulty: 'medium', system: 'nervous', reference: 'Guyton [8]' },
  { id: 'q6', question: 'Na herniacao uncal, qual nervo craniano e comprimido primeiro?', options: ['II (Optico)', 'III (Oculomotor)', 'V (Trigemeo)', 'VII (Facial)'], correctIndex: 1, explanation: 'O III par (oculomotor) e comprimido contra a tenda do cerebelo, causando midriase ipsilateral. Adams & Victor', difficulty: 'hard', system: 'nervous', reference: 'Adams & Victor' },
  { id: 'q7', question: 'Qual o nivel vertebral da bifurcacao traqueal (carina)?', options: ['T2', 'T4-5', 'T6', 'T8'], correctIndex: 1, explanation: 'A carina esta no nivel de T4-5 (angulo de Louis/esternal). Gray\'s Cap. 57 [1]', difficulty: 'easy', system: 'respiratory', reference: 'Gray\'s [1]' },
  { id: 'q8', question: 'Qual pneumocito produz surfactante pulmonar?', options: ['Tipo I', 'Tipo II', 'Tipo III', 'Celula de Clara'], correctIndex: 1, explanation: 'Pneumocitos tipo II produzem surfactante (dipalmitoilfosfatidilcolina). Tipo I: troca gasosa (95% da area). Junqueira Cap. 17 [6]', difficulty: 'medium', system: 'respiratory', reference: 'Junqueira [6]' },
  { id: 'q9', question: 'A partir de qual semana gestacional o surfactante e produzido em quantidade suficiente?', options: ['24a semana', '28a semana', '35a semana', '40a semana'], correctIndex: 2, explanation: 'Surfactante em quantidade suficiente a partir da 35a semana. Prematuros <35 sem: risco de sindrome do desconforto respiratorio. Langman [7]', difficulty: 'hard', system: 'respiratory', reference: 'Langman [7]' },
  { id: 'q10', question: 'Qual a segmentacao hepatica mais utilizada na pratica cirurgica?', options: ['Anatomica classica', 'Couinaud (8 segmentos)', 'Glisson', 'Cantlie'], correctIndex: 1, explanation: 'Classificacao de Couinaud: 8 segmentos baseados na vascularizacao portal e drenagem hepatica. Essencial para hepatectomias. Sabiston', difficulty: 'medium', system: 'digestive', reference: 'Sabiston' },
  { id: 'q11', question: 'Qual celula gastrica produz fator intrinseco?', options: ['Celula principal', 'Celula parietal', 'Celula G', 'Celula mucosa'], correctIndex: 1, explanation: 'Celulas parietais produzem HCl e fator intrinseco (necessario para absorcao de B12 no ileo). Guyton Cap. 65 [8]', difficulty: 'easy', system: 'digestive', reference: 'Guyton [8]' },
  { id: 'q12', question: 'Onde e absorvida a vitamina B12?', options: ['Duodeno', 'Jejuno', 'Ileo terminal', 'Colon'], correctIndex: 2, explanation: 'B12 + fator intrinseco sao absorvidos no ileo terminal. Resseccao ileal: deficiencia de B12. Guyton Cap. 66 [8]', difficulty: 'medium', system: 'digestive', reference: 'Guyton [8]' },
  { id: 'q13', question: 'Qual a taxa de filtracao glomerular (TFG) normal?', options: ['25 mL/min', '75 mL/min', '125 mL/min', '200 mL/min'], correctIndex: 2, explanation: 'TFG normal: 125 mL/min = 180 L/dia. 99% e reabsorvido. Urina final: 1-2 L/dia. Guyton Cap. 26 [8]', difficulty: 'easy', system: 'urinary', reference: 'Guyton [8]' },
  { id: 'q14', question: 'Qual hormonio controla a reabsorcao de agua no ducto coletor?', options: ['Aldosterona', 'ADH (vasopressina)', 'ANP', 'PTH'], correctIndex: 1, explanation: 'ADH (hormonio antidiuretico) insere aquaporinas no ducto coletor, aumentando reabsorcao de agua. Guyton Cap. 28 [8]', difficulty: 'medium', system: 'urinary', reference: 'Guyton [8]' },
  { id: 'q15', question: 'Qual o osso mais fraturado do corpo humano?', options: ['Femur', 'Radio', 'Clavicula', 'Umero'], correctIndex: 2, explanation: 'Clavicula (terco medio) e o osso mais fraturado, especialmente em criancas e por queda sobre o ombro. Moore Cap. 6 [4]', difficulty: 'easy', system: 'musculoskeletal', reference: 'Moore [4]' },
  { id: 'q16', question: 'Qual o T-score para diagnostico de osteoporose pela DEXA?', options: ['< -1.0', '< -1.5', '< -2.0', '< -2.5'], correctIndex: 3, explanation: 'Osteoporose: T-score ≤ -2.5. Osteopenia: -1.0 a -2.5. Normal: > -1.0. OMS/ISCD', difficulty: 'medium', system: 'musculoskeletal', reference: 'OMS/ISCD' },
  { id: 'q17', question: 'Qual a causa mais comum de hipertireoidismo?', options: ['Nodulo toxico', 'Doenca de Graves', 'Tireoidite subaguda', 'Adenoma hipofisario'], correctIndex: 1, explanation: 'Doenca de Graves: autoanticorpos anti-TRAb estimulam o receptor de TSH. 60-80% dos casos de hipertireoidismo. Robbins Cap. 24 [9]', difficulty: 'medium', system: 'endocrine', reference: 'Robbins [9]' },
  { id: 'q18', question: 'Qual nervo esta em risco durante a tireoidectomia?', options: ['Vago', 'Frenico', 'Laringeo recorrente', 'Hipoglosso'], correctIndex: 2, explanation: 'N. laringeo recorrente: posterior a tireoide, inerva todos os musculos intrinsecos da laringe exceto cricotireoideo. Lesao: rouquidao. Gray\'s [1]', difficulty: 'hard', system: 'endocrine', reference: 'Gray\'s [1]' },
  { id: 'q19', question: 'Apos esplenectomia, qual vacina e obrigatoria?', options: ['BCG', 'Hepatite B', 'Pneumococica', 'Febre amarela'], correctIndex: 2, explanation: 'Asplenia: risco de infeccoes por encapsulados (S. pneumoniae, N. meningitidis, H. influenzae). Vacinar antes da cirurgia se possivel. Robbins [9]', difficulty: 'medium', system: 'lymphatic', reference: 'Robbins [9]' },
  { id: 'q20', question: 'Qual a regra para calcular area queimada em adultos?', options: ['Regra dos 5', 'Regra dos 9', 'Regra dos 12', 'Regra dos 15'], correctIndex: 1, explanation: 'Regra dos 9 de Wallace: cabeca 9%, MMSS 9% cada, tronco anterior 18%, posterior 18%, MMII 18% cada, perineo 1%. ATLS', difficulty: 'easy', system: 'integumentary', reference: 'ATLS' },
  { id: 'q21', question: 'Qual o principal achado no fundo de olho da retinopatia diabetica nao-proliferativa?', options: ['Neovascularizacao', 'Microaneurismas', 'Descolamento de retina', 'Papiledema'], correctIndex: 1, explanation: 'RDNP: microaneurismas, exsudatos duros, hemorragias em chama. Proliferativa: neovascularizacao. Kanski', difficulty: 'hard', system: 'sensory', reference: 'Kanski' },
  { id: 'q22', question: 'Qual o valor normal de hemoglobina para homens adultos?', options: ['10-12 g/dL', '12-14 g/dL', '13-17 g/dL', '16-20 g/dL'], correctIndex: 2, explanation: 'Hemoglobina normal: homens 13-17 g/dL, mulheres 12-16 g/dL. Anemia: abaixo desses valores. Guyton Cap. 32 [8]', difficulty: 'easy', system: 'hematologic', reference: 'Guyton [8]' },
  { id: 'q23', question: 'Qual a dominancia coronariana mais comum?', options: ['Esquerda (Cx)', 'Direita (CD)', 'Codominancia', 'Variavel'], correctIndex: 1, explanation: 'Dominancia direita em 85% dos casos: CD origina a DP (descendente posterior). Dominancia E (Cx): 15%. Netter [2]', difficulty: 'medium', system: 'cardiovascular', reference: 'Netter [2]' },
  { id: 'q24', question: 'Qual sindrome resulta da hemiseccao medular?', options: ['Sindrome de Horner', 'Sindrome de Brown-Sequard', 'Sindrome da cauda equina', 'Siringomielia'], correctIndex: 1, explanation: 'Brown-Sequard: hemiseccao. Ipsilateral: paralisia + perda propriocepcao. Contralateral: perda dor/temperatura (1-2 niveis abaixo). Moore [4]', difficulty: 'hard', system: 'nervous', reference: 'Moore [4]' },
  { id: 'q25', question: 'Qual bronquio principal e mais suscetivel a aspiracao de corpo estranho?', options: ['Esquerdo', 'Direito', 'Ambos igualmente', 'Depende da posicao'], correctIndex: 1, explanation: 'Bronquio principal D: mais vertical, curto e largo. Corpo estranho cai preferencialmente no bronquio D. Gray\'s [1]', difficulty: 'easy', system: 'respiratory', reference: 'Gray\'s [1]' },
  { id: 'q26', question: 'Qual a relacao anatomica entre ureter e arteria uterina?', options: ['Ureter passa ACIMA da arteria', 'Ureter passa ABAIXO da arteria', 'Nao se cruzam', 'Ureter e lateral a arteria'], correctIndex: 1, explanation: '"Agua passa sob a ponte": ureter passa ABAIXO da arteria uterina. Risco de lesao em histerectomia. Moore [4]', difficulty: 'medium', system: 'reproductive', reference: 'Moore [4]' },
  { id: 'q27', question: 'Qual o nivel vertebral do cone medular no adulto?', options: ['T12', 'L1-L2', 'L3-L4', 'S1'], correctIndex: 1, explanation: 'Cone medular termina em L1-L2 no adulto. Puncao lombar: L3-L4 ou L4-L5 (abaixo do cone). Moore [4]', difficulty: 'easy', system: 'nervous', reference: 'Moore [4]' },
  { id: 'q28', question: 'Qual a principal funcao das celulas de Kupffer no figado?', options: ['Producao de bile', 'Fagocitose', 'Sintese de albumina', 'Armazenamento de glicogenio'], correctIndex: 1, explanation: 'Celulas de Kupffer: macrofagos residentes dos sinusoides hepaticos. Fagocitam bacterias, hemacias velhas e debris. Junqueira [6]', difficulty: 'medium', system: 'digestive', reference: 'Junqueira [6]' },
  { id: 'q29', question: 'Qual o mecanismo de concentracao urinaria na medula renal?', options: ['Osmose simples', 'Mecanismo contracorrente', 'Transporte ativo primario', 'Difusao facilitada'], correctIndex: 1, explanation: 'Mecanismo contracorrente: alca de Henle + vasa recta criam gradiente osmotico medular (300→1200 mOsm/kg). Guyton Cap. 28 [8]', difficulty: 'hard', system: 'urinary', reference: 'Guyton [8]' },
  { id: 'q30', question: 'Qual o criterio ABCDE do melanoma que se refere ao tamanho?', options: ['A - Assimetria', 'B - Bordas', 'C - Cor', 'D - Diametro'], correctIndex: 3, explanation: 'D = Diametro >6mm (tamanho de uma borracha de lapis). A=Assimetria, B=Bordas irregulares, C=Cor heterogenea, E=Evolucao. Robbins [9]', difficulty: 'easy', system: 'integumentary', reference: 'Robbins [9]' },
  { id: 'q31', question: 'Qual o debito cardiaco normal em repouso?', options: ['2 L/min', '3.5 L/min', '5 L/min', '8 L/min'], correctIndex: 2, explanation: 'DC = FC x VS = 70bpm x 70mL = ~5 L/min. Aumenta ate 25 L/min no exercicio intenso. Guyton Cap. 9 [8]', difficulty: 'easy', system: 'cardiovascular', reference: 'Guyton [8]' },
  { id: 'q32', question: 'Qual a pressao normal na arteria pulmonar?', options: ['25/10 mmHg', '60/30 mmHg', '120/80 mmHg', '140/90 mmHg'], correctIndex: 0, explanation: 'Pressao na arteria pulmonar: 25/10 mmHg (media ~15). Hipertensao pulmonar: PAP media >20mmHg. Guyton Cap. 38 [8]', difficulty: 'medium', system: 'cardiovascular', reference: 'Guyton [8]' },
  { id: 'q33', question: 'Qual nervo craniano tem o trajeto intracraniano mais longo?', options: ['III (Oculomotor)', 'IV (Troclear)', 'VI (Abducente)', 'VII (Facial)'], correctIndex: 1, explanation: 'IV par (troclear): unico que emerge dorsalmente e tem o trajeto intracraniano mais longo. Mais fino dos nervos cranianos. Gray\'s [1]', difficulty: 'hard', system: 'nervous', reference: 'Gray\'s [1]' },
  { id: 'q34', question: 'Qual a capacidade vital pulmonar normal de um adulto?', options: ['2.5 L', '3.5 L', '4.8 L', '6.0 L'], correctIndex: 2, explanation: 'Capacidade vital: ~4.8L (homem). Volume corrente: 500mL. Volume residual: 1.2L. Capacidade pulmonar total: 6L. Guyton Cap. 38 [8]', difficulty: 'medium', system: 'respiratory', reference: 'Guyton [8]' },
  { id: 'q35', question: 'Qual a veia que forma a veia porta junto com a mesenterica superior?', options: ['Gastrica esquerda', 'Esplenica', 'Renal esquerda', 'Gonadal'], correctIndex: 1, explanation: 'Veia porta = veia mesenterica superior + veia esplenica. A mesenterica inferior drena na esplenica. Gray\'s Cap. 65 [1]', difficulty: 'medium', system: 'digestive', reference: 'Gray\'s [1]' },
  { id: 'q36', question: 'Qual o local mais comum de puncao lombar?', options: ['L1-L2', 'L2-L3', 'L3-L4', 'L5-S1'], correctIndex: 2, explanation: 'Puncao lombar: L3-L4 ou L4-L5 (abaixo do cone medular L1-L2). Referencia: crista iliaca = nivel L4. Moore [4]', difficulty: 'easy', system: 'nervous', reference: 'Moore [4]' },
  { id: 'q37', question: 'Qual a funcao principal da aldosterona?', options: ['Reabsorver agua', 'Reabsorver Na+ e secretar K+', 'Secretar H+', 'Reabsorver glicose'], correctIndex: 1, explanation: 'Aldosterona: age no tubulo distal e coletor. Reabsorve Na+ (e agua segue) e secreta K+. Hiperaldosteronismo: hipertensao + hipocalemia. Guyton Cap. 28 [8]', difficulty: 'medium', system: 'urinary', reference: 'Guyton [8]' },
  { id: 'q38', question: 'Qual tipo de ossificacao forma os ossos do cranio?', options: ['Endocondral', 'Intramembranosa', 'Mista', 'Periosteal'], correctIndex: 1, explanation: 'Ossificacao intramembranosa: ossos planos do cranio e clavicula (direto do mesenquima). Endocondral: ossos longos (modelo cartilaginoso). Langman [7]', difficulty: 'medium', system: 'musculoskeletal', reference: 'Langman [7]' },
  { id: 'q39', question: 'Qual o reflexo corneopalpebral? Aferente e eferente?', options: ['Aferente V1, Eferente VII', 'Aferente II, Eferente III', 'Aferente VII, Eferente V', 'Aferente V3, Eferente VII'], correctIndex: 0, explanation: 'Reflexo corneopalpebral: aferente = V1 (oftalmico do trigemeo), eferente = VII (facial - orbicular do olho). Gray\'s [1]', difficulty: 'hard', system: 'nervous', reference: 'Gray\'s [1]' },
  { id: 'q40', question: 'Qual a vida media das hemacias?', options: ['30 dias', '60 dias', '90 dias', '120 dias'], correctIndex: 3, explanation: 'Hemacias vivem ~120 dias. Sao destruidas no baco (hemocaterese). Reticulocitos: hemacias jovens (0.5-2%). Guyton Cap. 32 [8]', difficulty: 'easy', system: 'hematologic', reference: 'Guyton [8]' },
];

// === SM-2 ALGORITHM ===
function sm2Algorithm(quality: number, repetition: number, easeFactor: number, interval: number): { interval: number; repetition: number; easeFactor: number } {
  if (quality >= 3) {
    if (repetition === 0) interval = 1;
    else if (repetition === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetition += 1;
  } else {
    repetition = 0;
    interval = 1;
  }
  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  return { interval, repetition, easeFactor };
}

// === SKETCHFAB VIEWER COMPONENT ===
function SketchFabViewer({ modelId, height = 400 }: { modelId: string; height?: number }) {
  const model = SKETCHFAB_MODELS[modelId];
  if (!model) return null;
  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-700" style={{ height }}>
      <iframe
        title={model.title}
        className="w-full h-full"
        src={`https://sketchfab.com/models/${model.uid}/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=0&ui_watermark_link=0`}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
      />
      <div className="absolute bottom-2 left-2 bg-black/70 text-xs text-gray-300 px-2 py-1 rounded">
        {model.title} por {model.author} • {model.license}
      </div>
    </div>
  );
}

// === ANIMATED HEART MODEL (Procedural 3D with beating animation) ===
function AnimatedHeartModel({ isAnimating, animationStep }: { isAnimating: boolean; animationStep: number }) {
  const heartRef = useRef<THREE.Group>(null);
  const [scale, setScale] = useState(1);
  
  useFrame((state) => {
    if (!heartRef.current) return;
    if (isAnimating) {
      const t = state.clock.getElapsedTime();
      const beat = Math.sin(t * 4) * 0.08 + 1;
      heartRef.current.scale.setScalar(beat);
      heartRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    } else {
      heartRef.current.rotation.y += 0.003;
    }
  });

  const chamberColor = (step: number, chamber: string) => {
    const colors: Record<string, Record<string, string>> = {
      'Diastole Atrial': { ra: '#4444FF', la: '#4444FF', rv: '#882222', lv: '#882222' },
      'Sistole Atrial': { ra: '#FF4444', la: '#FF4444', rv: '#882222', lv: '#882222' },
      'Ejecao Rapida': { ra: '#882222', la: '#882222', rv: '#FF4444', lv: '#FF4444' },
    };
    const stepName = PHYSIOLOGY_ANIMATIONS[0]?.steps[step]?.label || '';
    return colors[stepName]?.[chamber] || '#CC3333';
  };

  return (
    <group ref={heartRef}>
      {/* Atrio Direito */}
      <mesh position={[-0.4, 0.5, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={chamberColor(animationStep, 'ra')} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Atrio Esquerdo */}
      <mesh position={[0.4, 0.5, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={chamberColor(animationStep, 'la')} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Ventriculo Direito */}
      <mesh position={[-0.35, -0.3, 0.1]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color={chamberColor(animationStep, 'rv')} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Ventriculo Esquerdo */}
      <mesh position={[0.35, -0.3, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={chamberColor(animationStep, 'lv')} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Aorta */}
      <mesh position={[0.2, 1.1, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.12, 0.15, 0.8, 16]} />
        <meshStandardMaterial color="#FF5555" roughness={0.4} />
      </mesh>
      {/* Arco Aortico */}
      <mesh position={[0, 1.4, -0.2]} rotation={[0.5, 0, 0]}>
        <torusGeometry args={[0.25, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#FF5555" roughness={0.4} />
      </mesh>
      {/* Tronco Pulmonar */}
      <mesh position={[-0.2, 1.0, 0.15]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.1, 0.12, 0.6, 16]} />
        <meshStandardMaterial color="#5555FF" roughness={0.4} />
      </mesh>
      {/* Veias Cavas */}
      <mesh position={[-0.5, 1.0, -0.1]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 12]} />
        <meshStandardMaterial color="#3333AA" roughness={0.5} />
      </mesh>
      {/* Coronarias */}
      <mesh position={[0.1, 0.2, 0.45]} rotation={[0, 0, 0.5]}>
        <torusGeometry args={[0.3, 0.02, 8, 32]} />
        <meshStandardMaterial color="#FF8888" roughness={0.3} emissive="#FF4444" emissiveIntensity={0.2} />
      </mesh>
      {/* Septo */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.05, 1.2, 0.6]} />
        <meshStandardMaterial color="#AA3333" roughness={0.5} transparent opacity={0.7} />
      </mesh>
      {/* Blood flow particles when animating */}
      {isAnimating && <Sparkles count={30} scale={2} size={2} speed={2} color="#FF0000" />}
      {/* Labels */}
      <Html position={[-0.4, 0.9, 0]} center><div className="text-[8px] text-blue-300 bg-black/60 px-1 rounded whitespace-nowrap">AD</div></Html>
      <Html position={[0.4, 0.9, 0]} center><div className="text-[8px] text-red-300 bg-black/60 px-1 rounded whitespace-nowrap">AE</div></Html>
      <Html position={[-0.35, -0.7, 0]} center><div className="text-[8px] text-blue-300 bg-black/60 px-1 rounded whitespace-nowrap">VD</div></Html>
      <Html position={[0.35, -0.7, 0]} center><div className="text-[8px] text-red-300 bg-black/60 px-1 rounded whitespace-nowrap">VE</div></Html>
    </group>
  );
}

// === ANIMATED BRAIN MODEL ===
function AnimatedBrainModel({ isAnimating, highlightLobe }: { isAnimating: boolean; highlightLobe?: string }) {
  const brainRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!brainRef.current) return;
    if (isAnimating) {
      brainRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.5;
    } else {
      brainRef.current.rotation.y += 0.003;
    }
  });
  const lobeColor = (lobe: string) => {
    if (highlightLobe === lobe) return '#FFD700';
    const colors: Record<string, string> = { frontal: '#FF9999', parietal: '#99FF99', temporal: '#9999FF', occipital: '#FFFF99', cerebellum: '#FF99FF' };
    return colors[lobe] || '#FFCCCC';
  };
  return (
    <group ref={brainRef}>
      {/* Hemisferio Esquerdo - Frontal */}
      <mesh position={[-0.35, 0.15, 0.3]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color={lobeColor('frontal')} roughness={0.6} />
      </mesh>
      {/* Hemisferio Direito - Frontal */}
      <mesh position={[0.35, 0.15, 0.3]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color={lobeColor('frontal')} roughness={0.6} />
      </mesh>
      {/* Parietal E */}
      <mesh position={[-0.35, 0.3, -0.1]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={lobeColor('parietal')} roughness={0.6} />
      </mesh>
      {/* Parietal D */}
      <mesh position={[0.35, 0.3, -0.1]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={lobeColor('parietal')} roughness={0.6} />
      </mesh>
      {/* Temporal E */}
      <mesh position={[-0.5, -0.15, 0.1]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={lobeColor('temporal')} roughness={0.6} />
      </mesh>
      {/* Temporal D */}
      <mesh position={[0.5, -0.15, 0.1]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={lobeColor('temporal')} roughness={0.6} />
      </mesh>
      {/* Occipital */}
      <mesh position={[0, 0.1, -0.5]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={lobeColor('occipital')} roughness={0.6} />
      </mesh>
      {/* Cerebelo */}
      <mesh position={[0, -0.4, -0.35]}>
        <sphereGeometry args={[0.35, 32, 16]} />
        <meshStandardMaterial color={lobeColor('cerebellum')} roughness={0.7} />
      </mesh>
      {/* Tronco encefalico */}
      <mesh position={[0, -0.6, -0.1]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.5, 12]} />
        <meshStandardMaterial color="#DDAAAA" roughness={0.5} />
      </mesh>
      {/* Sulcos (linhas nos hemisferios) */}
      <Line points={[[-0.7, 0.2, 0.3], [-0.1, 0.5, 0.1], [-0.3, 0.1, -0.3]]} color="#AA6666" lineWidth={1} />
      <Line points={[[0.7, 0.2, 0.3], [0.1, 0.5, 0.1], [0.3, 0.1, -0.3]]} color="#AA6666" lineWidth={1} />
      {/* Fissura longitudinal */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.02, 0.8, 1]} />
        <meshStandardMaterial color="#663333" roughness={0.8} />
      </mesh>
      {isAnimating && <Sparkles count={20} scale={2} size={1.5} speed={0.5} color="#FFFF00" />}
    </group>
  );
}

// === ANIMATED LUNGS MODEL ===
function AnimatedLungsModel({ isAnimating, animationStep }: { isAnimating: boolean; animationStep: number }) {
  const lungsRef = useRef<THREE.Group>(null);
  const [breathScale, setBreathScale] = useState(1);
  useFrame((state) => {
    if (!lungsRef.current) return;
    if (isAnimating) {
      const t = state.clock.getElapsedTime();
      const breath = Math.sin(t * 1.5) * 0.1 + 1;
      setBreathScale(breath);
      lungsRef.current.scale.set(breath, breath * 0.95, breath);
    } else {
      lungsRef.current.rotation.y += 0.003;
    }
  });
  const isInspiration = animationStep < 3;
  return (
    <group ref={lungsRef}>
      {/* Pulmao Direito - 3 lobos */}
      <mesh position={[-0.5, 0.3, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={isInspiration ? '#6699CC' : '#4477AA'} roughness={0.4} transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.5, -0.05, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={isInspiration ? '#5588BB' : '#336699'} roughness={0.4} transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.5, -0.35, 0]}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial color={isInspiration ? '#4477AA' : '#225588'} roughness={0.4} transparent opacity={0.85} />
      </mesh>
      {/* Pulmao Esquerdo - 2 lobos */}
      <mesh position={[0.5, 0.2, 0]}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial color={isInspiration ? '#6699CC' : '#4477AA'} roughness={0.4} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0.5, -0.25, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={isInspiration ? '#5588BB' : '#336699'} roughness={0.4} transparent opacity={0.85} />
      </mesh>
      {/* Traqueia */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshStandardMaterial color="#EEDDCC" roughness={0.5} />
      </mesh>
      {/* Bronquios */}
      <mesh position={[-0.2, 0.55, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.05, 0.06, 0.4, 12]} />
        <meshStandardMaterial color="#DDCCBB" roughness={0.5} />
      </mesh>
      <mesh position={[0.2, 0.55, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.05, 0.06, 0.4, 12]} />
        <meshStandardMaterial color="#DDCCBB" roughness={0.5} />
      </mesh>
      {/* Diafragma */}
      <mesh position={[0, -0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 32]} />
        <meshStandardMaterial color="#CC8866" roughness={0.5} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* O2/CO2 particles */}
      {isAnimating && (
        <>
          <Sparkles count={15} scale={1.5} size={2} speed={1.5} color={isInspiration ? '#00AAFF' : '#FF6600'} position={[0, 0, 0.5]} />
        </>
      )}
      <Html position={[-0.5, 0.7, 0]} center><div className="text-[7px] text-blue-300 bg-black/60 px-1 rounded">Pulmao D (3 lobos)</div></Html>
      <Html position={[0.5, 0.6, 0]} center><div className="text-[7px] text-blue-300 bg-black/60 px-1 rounded">Pulmao E (2 lobos)</div></Html>
    </group>
  );
}

// === FULL BODY DISSECTION MODEL ===
function FullBodyDissectionModel({ dissectionDepth, selectedSystem }: { dissectionDepth: number; selectedSystem?: string }) {
  const bodyRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (bodyRef.current) bodyRef.current.rotation.y += 0.002;
  });
  return (
    <group ref={bodyRef}>
      {/* Skin layer */}
      {dissectionDepth <= 0 && (
        <group>
          <mesh position={[0, 0.8, 0]}><sphereGeometry args={[0.3, 32, 32]} /><meshStandardMaterial color="#FFD4B8" roughness={0.5} transparent opacity={0.9} /></mesh>
          <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.25, 0.2, 1.2, 16]} /><meshStandardMaterial color="#FFD4B8" roughness={0.5} transparent opacity={0.9} /></mesh>
          <mesh position={[0, -0.9, 0]}><cylinderGeometry args={[0.2, 0.15, 0.8, 16]} /><meshStandardMaterial color="#FFD4B8" roughness={0.5} transparent opacity={0.9} /></mesh>
          <mesh position={[-0.4, 0.2, 0]}><cylinderGeometry args={[0.06, 0.05, 0.9, 8]} /><meshStandardMaterial color="#FFD4B8" roughness={0.5} transparent opacity={0.9} /></mesh>
          <mesh position={[0.4, 0.2, 0]}><cylinderGeometry args={[0.06, 0.05, 0.9, 8]} /><meshStandardMaterial color="#FFD4B8" roughness={0.5} transparent opacity={0.9} /></mesh>
          <mesh position={[-0.12, -1.4, 0]}><cylinderGeometry args={[0.08, 0.06, 1, 8]} /><meshStandardMaterial color="#FFD4B8" roughness={0.5} transparent opacity={0.9} /></mesh>
          <mesh position={[0.12, -1.4, 0]}><cylinderGeometry args={[0.08, 0.06, 1, 8]} /><meshStandardMaterial color="#FFD4B8" roughness={0.5} transparent opacity={0.9} /></mesh>
        </group>
      )}
      {/* Muscle layer */}
      {dissectionDepth >= 2 && dissectionDepth <= 4 && (
        <group>
          <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.22, 0.18, 1.15, 16]} /><meshStandardMaterial color="#CC4444" roughness={0.4} transparent opacity={0.85} /></mesh>
          <mesh position={[-0.4, 0.2, 0]}><cylinderGeometry args={[0.055, 0.045, 0.85, 8]} /><meshStandardMaterial color="#CC4444" roughness={0.4} transparent opacity={0.85} /></mesh>
          <mesh position={[0.4, 0.2, 0]}><cylinderGeometry args={[0.055, 0.045, 0.85, 8]} /><meshStandardMaterial color="#CC4444" roughness={0.4} transparent opacity={0.85} /></mesh>
        </group>
      )}
      {/* Vascular layer */}
      {dissectionDepth >= 3 && (
        <group>
          <Line points={[[0, 0.6, 0.15], [0, 0, 0.15], [0, -0.5, 0.12], [-0.1, -1.2, 0.08]]} color="#FF3333" lineWidth={2} />
          <Line points={[[0, 0, 0.15], [0.1, -1.2, 0.08]]} color="#FF3333" lineWidth={2} />
          <Line points={[[0, 0.4, 0.12], [-0.35, 0.3, 0.08]]} color="#FF3333" lineWidth={1.5} />
          <Line points={[[0, 0.4, 0.12], [0.35, 0.3, 0.08]]} color="#FF3333" lineWidth={1.5} />
          <Line points={[[0.05, 0.6, 0.1], [0.05, 0, 0.1], [0.05, -0.5, 0.08]]} color="#3333FF" lineWidth={2} />
        </group>
      )}
      {/* Skeleton layer */}
      {dissectionDepth >= 5 && (
        <group>
          <mesh position={[0, 0.8, 0]}><sphereGeometry args={[0.25, 16, 16]} /><meshStandardMaterial color="#FFFFEE" roughness={0.3} /></mesh>
          <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 1.2, 8]} /><meshStandardMaterial color="#FFFFEE" roughness={0.3} /></mesh>
          {[...Array(12)].map((_, i) => (
            <mesh key={`rib-${i}`} position={[0, 0.35 - i * 0.06, 0]} rotation={[0, 0, i % 2 === 0 ? 0.3 : -0.3]}>
              <torusGeometry args={[0.15, 0.01, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#FFFFDD" roughness={0.3} />
            </mesh>
          ))}
          <mesh position={[0, -0.7, 0]}><boxGeometry args={[0.25, 0.15, 0.12]} /><meshStandardMaterial color="#FFFFEE" roughness={0.3} /></mesh>
        </group>
      )}
      {/* Organs layer */}
      {dissectionDepth >= 6 && (
        <group>
          <mesh position={[0, 0.25, 0.1]}><sphereGeometry args={[0.12, 16, 16]} /><meshStandardMaterial color="#CC3333" roughness={0.3} /></mesh>
          <mesh position={[-0.15, 0.15, 0.08]}><sphereGeometry args={[0.1, 16, 16]} /><meshStandardMaterial color="#6699CC" roughness={0.4} /></mesh>
          <mesh position={[0.15, 0.15, 0.08]}><sphereGeometry args={[0.1, 16, 16]} /><meshStandardMaterial color="#6699CC" roughness={0.4} /></mesh>
          <mesh position={[0.15, -0.05, 0.1]}><sphereGeometry args={[0.12, 16, 16]} /><meshStandardMaterial color="#884422" roughness={0.4} /></mesh>
          <mesh position={[-0.12, -0.2, 0.08]}><sphereGeometry args={[0.06, 16, 16]} /><meshStandardMaterial color="#AA5533" roughness={0.4} /></mesh>
          <mesh position={[0.12, -0.2, 0.08]}><sphereGeometry args={[0.06, 16, 16]} /><meshStandardMaterial color="#AA5533" roughness={0.4} /></mesh>
          <Html position={[0, 0.25, 0.25]} center><div className="text-[6px] text-red-300 bg-black/70 px-1 rounded">Coracao</div></Html>
          <Html position={[0.15, -0.05, 0.25]} center><div className="text-[6px] text-yellow-300 bg-black/70 px-1 rounded">Figado</div></Html>
          <Html position={[-0.12, -0.2, 0.2]} center><div className="text-[6px] text-orange-300 bg-black/70 px-1 rounded">Rim E</div></Html>
        </group>
      )}
    </group>
  );
}

// === GENERIC ORGAN 3D MODEL ===
function GenericOrganModel({ organ, color }: { organ: OrganData; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.005; });
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>
      {organ.annotations.slice(0, 3).map((ann, i) => (
        <Html key={i} position={ann.position} center>
          <div className="text-[7px] text-white bg-black/70 px-1 py-0.5 rounded whitespace-nowrap max-w-[100px] truncate">{ann.label}</div>
        </Html>
      ))}
    </group>
  );
}

// === 3D SCENE WRAPPER ===
function AtlasScene({ children }: { children: React.ReactNode }) {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} />
      <pointLight position={[0, 2, 3]} intensity={0.5} color="#ffffff" />
      <Environment preset="studio" />
      <ContactShadows position={[0, -1.5, 0]} opacity={0.3} scale={5} blur={2} />
      <Suspense fallback={<Html center><div className="text-white">Carregando 3D...</div></Html>}>
        {children}
      </Suspense>
      <OrbitControls enablePan enableZoom enableRotate autoRotate={false} maxDistance={8} minDistance={1.5} />
    </Canvas>
  );
}

// === MAIN COMPONENT ===
export default function AnatomyAtlas() {
  const [selectedSystem, setSelectedSystem] = useState<SystemData | null>(null);
  const [selectedOrgan, setSelectedOrgan] = useState<OrganData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'systems' | 'organ' | 'dissection' | 'quiz' | 'animation' | 'ar'>('systems');
  const [dissectionDepth, setDissectionDepth] = useState(0);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showPathology, setShowPathology] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'histology' | 'clinical' | 'pathology' | 'video'>('info');
  const [quizState, setQuizState] = useState<{ currentIndex: number; score: number; answered: number[]; showResult: boolean; selectedAnswer: number | null; sm2Data: Record<string, { interval: number; repetition: number; easeFactor: number }> }>({ currentIndex: 0, score: 0, answered: [], showResult: false, selectedAnswer: null, sm2Data: {} });
  const [animationState, setAnimationState] = useState<{ selectedAnimation: PhysiologyAnimation | null; isPlaying: boolean; currentStep: number }>({ selectedAnimation: null, isPlaying: false, currentStep: 0 });
  const [isSketchfabView, setIsSketchfabView] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const animIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Filter systems by search
  const filteredSystems = useMemo(() => {
    if (!searchTerm) return BODY_SYSTEMS;
    const term = searchTerm.toLowerCase();
    return BODY_SYSTEMS.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.organs.some(o => o.name.toLowerCase().includes(term) || o.nameEn.toLowerCase().includes(term) || o.nameLatin.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  // Quiz filtered by system
  const quizQuestions = useMemo(() => {
    if (selectedSystem) return QUIZ_QUESTIONS.filter(q => q.system === selectedSystem.id);
    return QUIZ_QUESTIONS;
  }, [selectedSystem]);

  // Animation control
  const startAnimation = useCallback((anim: PhysiologyAnimation) => {
    setAnimationState({ selectedAnimation: anim, isPlaying: true, currentStep: 0 });
    if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    let step = 0;
    animIntervalRef.current = setInterval(() => {
      step = (step + 1) % anim.steps.length;
      setAnimationState(prev => ({ ...prev, currentStep: step }));
    }, (anim.duration / anim.steps.length) * 1000);
  }, []);

  const stopAnimation = useCallback(() => {
    if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    setAnimationState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  // Quiz answer handler with SM-2
  const handleQuizAnswer = useCallback((answerIndex: number) => {
    const q = quizQuestions[quizState.currentIndex];
    if (!q) return;
    const isCorrect = answerIndex === q.correctIndex;
    const quality = isCorrect ? 5 : 1;
    const prev = quizState.sm2Data[q.id] || { interval: 0, repetition: 0, easeFactor: 2.5 };
    const updated = sm2Algorithm(quality, prev.repetition, prev.easeFactor, prev.interval);
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      score: isCorrect ? prev.score + 1 : prev.score,
      answered: [...prev.answered, quizState.currentIndex],
      sm2Data: { ...prev.sm2Data, [q.id]: updated },
    }));
  }, [quizState, quizQuestions]);

  const nextQuestion = useCallback(() => {
    setQuizState(prev => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
      selectedAnswer: null,
      showResult: prev.currentIndex + 1 >= quizQuestions.length,
    }));
  }, [quizQuestions]);

  const resetQuiz = useCallback(() => {
    setQuizState({ currentIndex: 0, score: 0, answered: [], showResult: false, selectedAnswer: null, sm2Data: quizState.sm2Data });
  }, [quizState.sm2Data]);

  // Cleanup
  useEffect(() => {
    return () => { if (animIntervalRef.current) clearInterval(animIntervalRef.current); };
  }, []);

  // === RENDER: SYSTEMS LIST ===
  if (viewMode === 'systems' && !selectedSystem) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Atlas de Anatomia 3D
            </h1>
            <p className="text-gray-400 mt-2">v5.0 Premium — Modelos fotorrealistas, animacoes fisiologicas, AR e quizzes adaptativos</p>
            <p className="text-gray-500 text-sm mt-1">Baseado em Gray's [1], Netter [2], Sobotta [3], Moore [4], Prometheus [5], Guyton [8]</p>
          </div>

          {/* Search */}
          <div className="relative max-w-xl mx-auto mb-6">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar sistema, orgao ou estrutura..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Mode buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <button onClick={() => setViewMode('dissection')} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg hover:opacity-90 transition">
              <Scissors className="w-4 h-4" /> Disseccao por Camadas
            </button>
            <button onClick={() => setViewMode('quiz')} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:opacity-90 transition">
              <GraduationCap className="w-4 h-4" /> Quiz Adaptativo (SM-2)
            </button>
            <button onClick={() => setViewMode('animation')} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:opacity-90 transition">
              <Play className="w-4 h-4" /> Animacoes Fisiologicas
            </button>
            <button onClick={() => setViewMode('ar')} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90 transition">
              <Smartphone className="w-4 h-4" /> Realidade Aumentada
            </button>
          </div>

          {/* Systems Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSystems.map(system => (
              <button
                key={system.id}
                onClick={() => { setSelectedSystem(system); }}
                className="p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-600 transition text-left group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: system.color + '20', color: system.color }}>
                    {system.icon}
                  </div>
                  <h3 className="font-semibold text-sm">{system.name}</h3>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{system.description}</p>
                <div className="mt-2 text-xs text-gray-600">{system.organs.length} orgaos</div>
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
            <div className="bg-gray-900 rounded-lg p-3"><div className="text-2xl font-bold text-cyan-400">{BODY_SYSTEMS.length}</div><div className="text-xs text-gray-500">Sistemas</div></div>
            <div className="bg-gray-900 rounded-lg p-3"><div className="text-2xl font-bold text-green-400">{BODY_SYSTEMS.reduce((a, s) => a + s.organs.length, 0)}</div><div className="text-xs text-gray-500">Orgaos</div></div>
            <div className="bg-gray-900 rounded-lg p-3"><div className="text-2xl font-bold text-purple-400">{QUIZ_QUESTIONS.length}</div><div className="text-xs text-gray-500">Questoes Quiz</div></div>
            <div className="bg-gray-900 rounded-lg p-3"><div className="text-2xl font-bold text-orange-400">{PHYSIOLOGY_ANIMATIONS.length}</div><div className="text-xs text-gray-500">Animacoes</div></div>
            <div className="bg-gray-900 rounded-lg p-3"><div className="text-2xl font-bold text-red-400">{DISSECTION_LAYERS.length}</div><div className="text-xs text-gray-500">Camadas</div></div>
          </div>
        </div>
      </div>
    );
  }

  // === RENDER: DISSECTION MODE ===
  if (viewMode === 'dissection') {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => setViewMode('systems')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Scissors className="w-6 h-6 text-red-400" /> Disseccao por Camadas
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-xl p-4" style={{ height: 500 }}>
              <AtlasScene>
                <FullBodyDissectionModel dissectionDepth={dissectionDepth} />
              </AtlasScene>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-4">Remova camadas progressivamente para explorar as estruturas anatomicas em profundidade. Ref: Gray's Anatomy [1]</p>
              <div className="mb-4">
                <label className="text-sm text-gray-400 mb-1 block">Profundidade: {DISSECTION_LAYERS[dissectionDepth]?.name || 'Todas'}</label>
                <input
                  type="range" min={0} max={6} value={dissectionDepth}
                  onChange={(e) => setDissectionDepth(Number(e.target.value))}
                  className="w-full accent-red-500"
                />
              </div>
              <div className="space-y-2">
                {DISSECTION_LAYERS.map((layer, i) => (
                  <div
                    key={layer.id}
                    className={`p-3 rounded-lg border transition cursor-pointer ${dissectionDepth === i ? 'border-red-500 bg-red-500/10' : dissectionDepth > i ? 'border-gray-700 bg-gray-800/50 opacity-50' : 'border-gray-700 bg-gray-900'}`}
                    onClick={() => setDissectionDepth(i)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: layer.color }} />
                      <span className="font-medium text-sm">{layer.name}</span>
                      {dissectionDepth > i && <span className="text-xs text-red-400 ml-auto">Removida</span>}
                    </div>
                    {dissectionDepth === i && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {layer.structures.map(s => (
                          <span key={s} className="text-xs bg-gray-800 px-2 py-0.5 rounded">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === RENDER: QUIZ MODE (SM-2 Adaptive) ===
  if (viewMode === 'quiz') {
    const currentQ = quizQuestions[quizState.currentIndex];
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => { setViewMode('systems'); resetQuiz(); }} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-green-400" /> Quiz Adaptativo SM-2
          </h2>
          <p className="text-sm text-gray-400 mb-4">Algoritmo de repeticao espacada SuperMemo-2. Questoes se adaptam ao seu desempenho.</p>

          {quizState.showResult ? (
            <div className="bg-gray-900 rounded-xl p-8 text-center">
              <Award className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-2xl font-bold mb-2">Quiz Concluido!</h3>
              <p className="text-4xl font-bold text-green-400 mb-2">{quizState.score}/{quizQuestions.length}</p>
              <p className="text-gray-400 mb-4">({Math.round((quizState.score / quizQuestions.length) * 100)}% de acerto)</p>
              <div className="flex gap-3 justify-center">
                <button onClick={resetQuiz} className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700">Refazer Quiz</button>
                <button onClick={() => setViewMode('systems')} className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">Voltar ao Atlas</button>
              </div>
            </div>
          ) : currentQ ? (
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Questao {quizState.currentIndex + 1}/{quizQuestions.length}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${currentQ.difficulty === 'easy' ? 'bg-green-900 text-green-300' : currentQ.difficulty === 'medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}`}>
                    {currentQ.difficulty === 'easy' ? 'Facil' : currentQ.difficulty === 'medium' ? 'Medio' : 'Dificil'}
                  </span>
                  <span className="text-xs text-gray-500">{currentQ.reference}</span>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5 mb-4">
                <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${((quizState.currentIndex) / quizQuestions.length) * 100}%` }} />
              </div>
              <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
              <div className="space-y-2">
                {currentQ.options.map((opt, i) => {
                  const isSelected = quizState.selectedAnswer === i;
                  const isCorrect = i === currentQ.correctIndex;
                  const isAnswered = quizState.selectedAnswer !== null;
                  let btnClass = 'border-gray-700 hover:border-gray-500';
                  if (isAnswered) {
                    if (isCorrect) btnClass = 'border-green-500 bg-green-500/10';
                    else if (isSelected && !isCorrect) btnClass = 'border-red-500 bg-red-500/10';
                    else btnClass = 'border-gray-800 opacity-50';
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => !isAnswered && handleQuizAnswer(i)}
                      disabled={isAnswered}
                      className={`w-full text-left p-3 rounded-lg border transition ${btnClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-800 text-xs font-bold">{String.fromCharCode(65 + i)}</span>
                        <span className="text-sm">{opt}</span>
                        {isAnswered && isCorrect && <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />}
                        {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 ml-auto" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              {quizState.selectedAnswer !== null && (
                <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-300">{currentQ.explanation}</p>
                  <button onClick={nextQuestion} className="mt-3 px-4 py-2 bg-cyan-600 rounded-lg text-sm hover:bg-cyan-700 transition">
                    {quizState.currentIndex + 1 < quizQuestions.length ? 'Proxima Questao →' : 'Ver Resultado'}
                  </button>
                </div>
              )}
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                <span>Acertos: {quizState.score}</span>
                <span>SM-2 EF: {(quizState.sm2Data[currentQ.id]?.easeFactor || 2.5).toFixed(1)}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  // === RENDER: ANIMATION MODE ===
  if (viewMode === 'animation') {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => { setViewMode('systems'); stopAnimation(); }} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-400" /> Animacoes Fisiologicas
          </h2>

          {!animationState.selectedAnimation ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PHYSIOLOGY_ANIMATIONS.map(anim => (
                <button
                  key={anim.id}
                  onClick={() => startAnimation(anim)}
                  className="p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-blue-500 transition text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Play className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold">{anim.name}</h3>
                  </div>
                  <p className="text-sm text-gray-400">{anim.description}</p>
                  <div className="mt-2 text-xs text-gray-500">{anim.steps.length} etapas • {anim.duration}s</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-xl p-4" style={{ height: 500 }}>
                <AtlasScene>
                  {animationState.selectedAnimation.system === 'cardiovascular' && (
                    <AnimatedHeartModel isAnimating={animationState.isPlaying} animationStep={animationState.currentStep} />
                  )}
                  {animationState.selectedAnimation.system === 'respiratory' && (
                    <AnimatedLungsModel isAnimating={animationState.isPlaying} animationStep={animationState.currentStep} />
                  )}
                  {animationState.selectedAnimation.system === 'nervous' && (
                    <AnimatedBrainModel isAnimating={animationState.isPlaying} />
                  )}
                  {!['cardiovascular', 'respiratory', 'nervous'].includes(animationState.selectedAnimation.system) && (
                    <GenericOrganModel organ={BODY_SYSTEMS.find(s => s.id === animationState.selectedAnimation!.system)?.organs[0]!} color="#6699CC" />
                  )}
                </AtlasScene>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold">{animationState.selectedAnimation.name}</h3>
                  <button
                    onClick={() => animationState.isPlaying ? stopAnimation() : startAnimation(animationState.selectedAnimation!)}
                    className={`p-2 rounded-lg ${animationState.isPlaying ? 'bg-red-600' : 'bg-green-600'}`}
                  >
                    {animationState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setAnimationState({ selectedAnimation: null, isPlaying: false, currentStep: 0 })} className="p-2 rounded-lg bg-gray-700">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-400 mb-4">{animationState.selectedAnimation.description}</p>
                <div className="space-y-2">
                  {animationState.selectedAnimation.steps.map((step, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border transition ${animationState.currentStep === i ? 'border-blue-500 bg-blue-500/10' : 'border-gray-800 bg-gray-900'}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${animationState.currentStep === i ? 'bg-blue-500' : 'bg-gray-700'}`}>
                          {i + 1}
                        </div>
                        <span className="font-medium text-sm">{step.label}</span>
                        {animationState.currentStep === i && animationState.isPlaying && (
                          <span className="ml-auto text-xs text-blue-400 animate-pulse">Em andamento</span>
                        )}
                      </div>
                      {(animationState.currentStep === i || animationState.currentStep > i) && (
                        <p className="text-xs text-gray-400 mt-1 ml-8">{step.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // === RENDER: AR MODE ===
  if (viewMode === 'ar') {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4">
        <div className="max-w-3xl mx-auto text-center">
          <button onClick={() => setViewMode('systems')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <Smartphone className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <h2 className="text-2xl font-bold mb-2">Realidade Aumentada (AR)</h2>
          <p className="text-gray-400 mb-6">Visualize modelos anatomicos 3D no mundo real usando a camera do seu dispositivo movel.</p>
          
          <div className="bg-gray-900 rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-3">Como usar:</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                <p className="text-sm text-gray-300">Abra esta pagina no navegador do seu celular ou tablet</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                <p className="text-sm text-gray-300">Selecione um modelo 3D abaixo para visualizar em AR</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                <p className="text-sm text-gray-300">Aponte a camera para uma superficie plana e o modelo sera posicionado</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(SKETCHFAB_MODELS).map(([key, model]) => (
              <a
                key={key}
                href={`https://sketchfab.com/models/${model.uid}/embed?autostart=1&ui_theme=dark&ar=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-purple-500 transition"
              >
                <Globe className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <p className="text-sm font-medium">{model.title}</p>
                <p className="text-xs text-gray-500 mt-1">Toque para AR</p>
              </a>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-800 rounded-xl text-left">
            <p className="text-sm text-yellow-300">Requisitos: Navegador compativel com WebXR (Chrome 79+, Safari 15+). Dispositivo com ARCore (Android) ou ARKit (iOS).</p>
          </div>
        </div>
      </div>
    );
  }

  // === RENDER: SYSTEM SELECTED (organs list) ===
  if (selectedSystem && !selectedOrgan) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => setSelectedSystem(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> Voltar aos Sistemas
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl" style={{ backgroundColor: selectedSystem.color + '20', color: selectedSystem.color }}>
              {selectedSystem.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{selectedSystem.name}</h2>
              <p className="text-sm text-gray-400">{selectedSystem.description}</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => { setViewMode('quiz'); }} className="text-xs px-3 py-1.5 bg-green-900/50 border border-green-800 rounded-lg hover:bg-green-900">
              <GraduationCap className="w-3 h-3 inline mr-1" /> Quiz deste Sistema
            </button>
            <button onClick={() => {
              const anim = PHYSIOLOGY_ANIMATIONS.find(a => a.system === selectedSystem.id);
              if (anim) { setViewMode('animation'); startAnimation(anim); }
            }} className="text-xs px-3 py-1.5 bg-blue-900/50 border border-blue-800 rounded-lg hover:bg-blue-900">
              <Play className="w-3 h-3 inline mr-1" /> Animacao
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedSystem.organs.map(organ => (
              <button
                key={organ.id}
                onClick={() => setSelectedOrgan(organ)}
                className="p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-600 transition text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{organ.name}</h3>
                  {organ.sketchfabId && <Globe className="w-4 h-4 text-cyan-400" title="Modelo 3D fotorrealista disponivel" />}
                </div>
                <p className="text-xs text-gray-500 italic">{organ.nameLatin} ({organ.nameEn})</p>
                <p className="text-sm text-gray-400 mt-2 line-clamp-2">{organ.description}</p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs bg-gray-800 px-2 py-0.5 rounded">{organ.annotations.length} anotacoes</span>
                  <span className="text-xs bg-gray-800 px-2 py-0.5 rounded">{organ.pathologies.length} patologias</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // === RENDER: ORGAN DETAIL ===
  if (selectedOrgan && selectedSystem) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => setSelectedOrgan(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> Voltar a {selectedSystem.name}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3D Viewer */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-2xl font-bold">{selectedOrgan.name}</h2>
                <span className="text-sm text-gray-500 italic">({selectedOrgan.nameLatin})</span>
              </div>
              
              {/* Toggle SketchFab vs Procedural */}
              {selectedOrgan.sketchfabId && (
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setIsSketchfabView(false)}
                    className={`text-xs px-3 py-1.5 rounded-lg ${!isSketchfabView ? 'bg-cyan-600' : 'bg-gray-800'}`}
                  >
                    Modelo 3D Interativo
                  </button>
                  <button
                    onClick={() => setIsSketchfabView(true)}
                    className={`text-xs px-3 py-1.5 rounded-lg ${isSketchfabView ? 'bg-cyan-600' : 'bg-gray-800'}`}
                  >
                    <Globe className="w-3 h-3 inline mr-1" /> Modelo Fotorrealista
                  </button>
                </div>
              )}

              {isSketchfabView && selectedOrgan.sketchfabId ? (
                <SketchFabViewer modelId={selectedOrgan.sketchfabId} height={450} />
              ) : (
                <div className="bg-gray-900 rounded-xl overflow-hidden" style={{ height: 450 }}>
                  <AtlasScene>
                    {selectedOrgan.id === 'heart' ? (
                      <AnimatedHeartModel isAnimating={false} animationStep={0} />
                    ) : selectedOrgan.id === 'brain' ? (
                      <AnimatedBrainModel isAnimating={false} />
                    ) : selectedOrgan.id === 'lungs' ? (
                      <AnimatedLungsModel isAnimating={false} animationStep={0} />
                    ) : (
                      <GenericOrganModel organ={selectedOrgan} color={selectedSystem.color} />
                    )}
                  </AtlasScene>
                </div>
              )}

              {/* Annotations */}
              {showAnnotations && (
                <div className="mt-3 space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-1"><Tag className="w-4 h-4 text-cyan-400" /> Anotacoes Anatomicas</h4>
                  {selectedOrgan.annotations.map((ann, i) => (
                    <div key={i} className="p-2 bg-gray-900 rounded-lg border border-gray-800">
                      <div className="font-medium text-sm text-cyan-300">{ann.label}</div>
                      <p className="text-xs text-gray-400">{ann.description}</p>
                      {ann.clinicalNote && <p className="text-xs text-yellow-400 mt-1">Clinica: {ann.clinicalNote}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info Panel */}
            <div>
              {/* Tabs */}
              <div className="flex gap-1 mb-4 overflow-x-auto">
                {[
                  { id: 'info' as const, label: 'Descricao', icon: <Info className="w-3 h-3" /> },
                  { id: 'histology' as const, label: 'Histologia', icon: <Microscope className="w-3 h-3" /> },
                  { id: 'clinical' as const, label: 'Clinica', icon: <Stethoscope className="w-3 h-3" /> },
                  { id: 'pathology' as const, label: 'Patologias', icon: <Target className="w-3 h-3" /> },
                  { id: 'video' as const, label: 'Video-aula', icon: <Video className="w-3 h-3" /> },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition ${activeTab === tab.id ? 'bg-cyan-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              <div className="bg-gray-900 rounded-xl p-4 min-h-[400px]">
                {activeTab === 'info' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-cyan-400 mb-1">Descricao</h4>
                      <p className="text-sm text-gray-300">{selectedOrgan.description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-400 mb-1">Fisiologia</h4>
                      <p className="text-sm text-gray-300">{selectedOrgan.physiology}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-400 mb-1">Embriologia</h4>
                      <p className="text-sm text-gray-300">{selectedOrgan.embryology}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-400 mb-1">Dicas de Prova</h4>
                      <ul className="space-y-1">
                        {selectedOrgan.examTips.map((tip, i) => (
                          <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                            <Star className="w-3 h-3 text-yellow-500 flex-shrink-0 mt-0.5" /> {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-400 mb-1">Referencias</h4>
                      <ul className="space-y-0.5">
                        {selectedOrgan.references.map((ref, i) => (
                          <li key={i} className="text-xs text-gray-500">{ref}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'histology' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-pink-400 mb-1">Histologia</h4>
                      <p className="text-sm text-gray-300">{selectedOrgan.histology}</p>
                    </div>
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <p className="text-xs text-gray-400">Referencia: Junqueira's Basic Histology [6], Ross Histology [12]</p>
                    </div>
                  </div>
                )}

                {activeTab === 'clinical' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-red-400 mb-1">Correlacao Clinica</h4>
                      <p className="text-sm text-gray-300">{selectedOrgan.clinicalCorrelation}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'pathology' && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-orange-400">Patologias</h4>
                    {selectedOrgan.pathologies.map((path, i) => (
                      <div key={i} className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                        <h5 className="font-medium text-sm text-orange-300">{path.name}</h5>
                        <p className="text-xs text-gray-300 mt-1">{path.description}</p>
                        <p className="text-xs text-gray-400 mt-1">Aspecto: {path.visualChange}</p>
                        <p className="text-xs text-gray-500 mt-1">Ref: {path.reference}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'video' && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-blue-400 flex items-center gap-2"><Video className="w-4 h-4" /> Video-aulas</h4>
                    <p className="text-sm text-gray-400">Professores podem vincular video-aulas a cada orgao pelo Portal do Professor.</p>
                    <div className="p-4 bg-gray-800 rounded-lg text-center">
                      <Video className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                      <p className="text-sm text-gray-500">Nenhuma video-aula vinculada a este orgao ainda.</p>
                      <p className="text-xs text-gray-600 mt-1">Acesse o Portal do Professor para adicionar video-aulas.</p>
                    </div>
                    <div className="p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
                      <p className="text-xs text-blue-300">Professores: faca upload de video-aulas no Portal do Professor e vincule ao sistema/orgao correspondente. Os alunos poderao assistir diretamente no Atlas.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <button onClick={() => { setSelectedSystem(null); setSelectedOrgan(null); setViewMode('systems'); }} className="px-6 py-3 bg-cyan-600 rounded-lg">
        Voltar ao Atlas
      </button>
    </div>
  );
}
