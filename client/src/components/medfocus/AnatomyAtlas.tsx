/**
 * AnatomyAtlas — Atlas Anatômico Interativo
 * SVGs clicáveis dos sistemas do corpo humano, vinculados às disciplinas de cada ano.
 */
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Heart, Brain, Bone, Droplets, Wind, Utensils, Eye, Ear,
  Shield, Zap, Baby, Activity, ArrowLeft, BookOpen, Search,
  ChevronRight, GraduationCap, Stethoscope, Microscope,
  Moon, Sun
} from 'lucide-react';

// ─── Body Systems Data ─────────────────────────────────────────
interface BodySystem {
  id: string;
  name: string;
  nameEn: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  year: number; // Primary year of study
  description: string;
  organs: Organ[];
  relatedSubjects: string[];
  clinicalRelevance: string[];
  keyTerms: string[];
}

interface Organ {
  id: string;
  name: string;
  description: string;
  functions: string[];
  pathologies: string[];
  examTips: string[];
}

const BODY_SYSTEMS: BodySystem[] = [
  {
    id: 'cardiovascular',
    name: 'Sistema Cardiovascular',
    nameEn: 'Cardiovascular System',
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    year: 1,
    description: 'Responsável pelo transporte de sangue, nutrientes e oxigênio para todo o corpo. Inclui o coração, artérias, veias e capilares.',
    relatedSubjects: ['Anatomia', 'Fisiologia', 'Histologia', 'Cardiologia', 'Cirurgia Cardiovascular'],
    clinicalRelevance: [
      'Infarto Agudo do Miocárdio (IAM) — principal causa de morte no Brasil',
      'Insuficiência Cardíaca Congestiva (ICC)',
      'Hipertensão Arterial Sistêmica (HAS)',
      'Arritmias cardíacas e ECG',
      'Doença arterial coronariana',
      'Valvulopatias',
    ],
    keyTerms: ['Sístole', 'Diástole', 'Débito cardíaco', 'Pré-carga', 'Pós-carga', 'Fração de ejeção', 'Ciclo cardíaco'],
    organs: [
      {
        id: 'coracao', name: 'Coração',
        description: 'Órgão muscular oco que bombeia sangue para todo o corpo. Possui 4 câmaras: 2 átrios e 2 ventrículos.',
        functions: ['Bombeamento sanguíneo', 'Regulação da pressão arterial', 'Produção de peptídeo natriurético atrial'],
        pathologies: ['IAM', 'ICC', 'Endocardite', 'Pericardite', 'Miocardite', 'Valvulopatias'],
        examTips: ['Localização: mediastino médio', 'Irrigação: coronárias D e E', 'Inervação: plexo cardíaco (simpático e parassimpático)'],
      },
      {
        id: 'aorta', name: 'Aorta',
        description: 'Maior artéria do corpo. Origina-se do ventrículo esquerdo e distribui sangue oxigenado para todo o organismo.',
        functions: ['Distribuição de sangue oxigenado', 'Manutenção da pressão arterial', 'Efeito Windkessel'],
        pathologies: ['Aneurisma de aorta', 'Dissecção aórtica', 'Coarctação da aorta', 'Aterosclerose'],
        examTips: ['Porções: ascendente, arco, descendente (torácica e abdominal)', 'Ramos do arco: tronco braquiocefálico, carótida comum E, subclávia E'],
      },
      {
        id: 'veias_cavas', name: 'Veias Cavas',
        description: 'Veias cavas superior e inferior — drenam sangue venoso de todo o corpo para o átrio direito.',
        functions: ['Retorno venoso ao coração', 'Drenagem do sangue desoxigenado'],
        pathologies: ['Síndrome da veia cava superior', 'Trombose venosa profunda'],
        examTips: ['VCS: drena cabeça, pescoço, MMSS', 'VCI: drena abdome, pelve, MMII', 'VCI atravessa o diafragma no nível T8'],
      },
    ],
  },
  {
    id: 'nervoso',
    name: 'Sistema Nervoso',
    nameEn: 'Nervous System',
    icon: Brain,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    year: 1,
    description: 'Coordena e integra todas as funções do organismo. Dividido em SNC (encéfalo e medula espinhal) e SNP (nervos e gânglios).',
    relatedSubjects: ['Neuroanatomia', 'Neurofisiologia', 'Neurologia', 'Neurocirurgia', 'Psiquiatria'],
    clinicalRelevance: [
      'AVC (Acidente Vascular Cerebral) — urgência neurológica',
      'Epilepsia e crises convulsivas',
      'Doença de Parkinson e Alzheimer',
      'Meningites e encefalites',
      'Tumores do SNC',
      'Neuropatias periféricas',
    ],
    keyTerms: ['Sinapse', 'Potencial de ação', 'Neurotransmissores', 'Barreira hematoencefálica', 'Dermátomos', 'Pares cranianos'],
    organs: [
      {
        id: 'cerebro', name: 'Cérebro',
        description: 'Maior porção do encéfalo. Dividido em 2 hemisférios com 4 lobos cada: frontal, parietal, temporal e occipital.',
        functions: ['Cognição e memória', 'Linguagem', 'Controle motor voluntário', 'Percepção sensorial', 'Emoções'],
        pathologies: ['AVC isquêmico/hemorrágico', 'Tumores cerebrais', 'Alzheimer', 'Epilepsia', 'TCE'],
        examTips: ['Área de Broca (lobo frontal): expressão da fala', 'Área de Wernicke (lobo temporal): compreensão', 'Homúnculo de Penfield: giro pré e pós-central'],
      },
      {
        id: 'cerebelo', name: 'Cerebelo',
        description: 'Localizado na fossa posterior. Responsável pela coordenação motora, equilíbrio e tônus muscular.',
        functions: ['Coordenação motora fina', 'Equilíbrio', 'Tônus muscular', 'Aprendizado motor'],
        pathologies: ['Ataxia cerebelar', 'Tumores de fossa posterior', 'Síndrome vermiana'],
        examTips: ['Vermis: equilíbrio axial', 'Hemisférios: coordenação apendicular', 'Lesão: ataxia ipsilateral'],
      },
      {
        id: 'medula_espinhal', name: 'Medula Espinhal',
        description: 'Estrutura cilíndrica que se estende do forame magno até L1-L2. Conduz impulsos entre o encéfalo e o corpo.',
        functions: ['Condução de impulsos nervosos', 'Arcos reflexos', 'Integração sensório-motora'],
        pathologies: ['Lesão medular', 'Mielite transversa', 'Siringomielia', 'Compressão medular'],
        examTips: ['Termina no cone medular (L1-L2)', 'Cauda equina abaixo de L2', 'Punção lombar: L3-L4 ou L4-L5'],
      },
    ],
  },
  {
    id: 'respiratorio',
    name: 'Sistema Respiratório',
    nameEn: 'Respiratory System',
    icon: Wind,
    color: 'text-sky-500',
    bgColor: 'bg-sky-500/10',
    year: 1,
    description: 'Responsável pelas trocas gasosas (O₂ e CO₂) entre o organismo e o meio ambiente.',
    relatedSubjects: ['Anatomia', 'Fisiologia', 'Pneumologia', 'Cirurgia Torácica'],
    clinicalRelevance: [
      'Pneumonia — principal causa de internação',
      'Asma e DPOC',
      'Tuberculose — endêmica no Brasil',
      'Câncer de pulmão',
      'Embolia pulmonar',
      'Insuficiência respiratória aguda',
    ],
    keyTerms: ['Hematose', 'Surfactante', 'Volume corrente', 'Capacidade vital', 'Espaço morto', 'Complacência pulmonar'],
    organs: [
      {
        id: 'pulmoes', name: 'Pulmões',
        description: 'Órgãos pares localizados na cavidade torácica. Pulmão direito: 3 lobos. Pulmão esquerdo: 2 lobos.',
        functions: ['Trocas gasosas (hematose)', 'Regulação do pH sanguíneo', 'Filtração de êmbolos', 'Produção de surfactante'],
        pathologies: ['Pneumonia', 'DPOC', 'Asma', 'Fibrose pulmonar', 'Câncer de pulmão', 'Pneumotórax'],
        examTips: ['Pulmão D: 3 lobos, 10 segmentos', 'Pulmão E: 2 lobos, 8-9 segmentos', 'Hilo: brônquio, artéria e veias pulmonares'],
      },
      {
        id: 'traqueia', name: 'Traqueia',
        description: 'Tubo cartilaginoso que conecta a laringe aos brônquios principais. Possui 16-20 anéis cartilaginosos em forma de C.',
        functions: ['Condução do ar', 'Aquecimento e umidificação', 'Defesa mucociliar'],
        pathologies: ['Traqueíte', 'Estenose traqueal', 'Corpo estranho', 'Intubação orotraqueal'],
        examTips: ['Bifurcação: carina (T4-T5)', 'Brônquio D mais vertical — aspiração mais comum à direita', 'Anéis em C: parede posterior membranosa'],
      },
    ],
  },
  {
    id: 'digestorio',
    name: 'Sistema Digestório',
    nameEn: 'Digestive System',
    icon: Utensils,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    year: 2,
    description: 'Responsável pela digestão, absorção de nutrientes e eliminação de resíduos. Inclui o trato gastrointestinal e glândulas anexas.',
    relatedSubjects: ['Anatomia', 'Fisiologia', 'Gastroenterologia', 'Cirurgia do Aparelho Digestivo', 'Nutrição'],
    clinicalRelevance: [
      'Úlcera péptica e H. pylori',
      'Doença do refluxo gastroesofágico (DRGE)',
      'Apendicite aguda — emergência cirúrgica',
      'Hepatites virais',
      'Cirrose hepática',
      'Câncer colorretal',
    ],
    keyTerms: ['Peristaltismo', 'Enzimas digestivas', 'Bile', 'Microbiota intestinal', 'Absorção', 'Motilidade'],
    organs: [
      {
        id: 'estomago', name: 'Estômago',
        description: 'Órgão muscular em forma de J. Responsável pela digestão mecânica e química dos alimentos.',
        functions: ['Digestão proteica (pepsina)', 'Secreção de HCl', 'Fator intrínseco (absorção de B12)', 'Reservatório alimentar'],
        pathologies: ['Úlcera gástrica', 'Gastrite', 'Câncer gástrico', 'DRGE'],
        examTips: ['Regiões: cárdia, fundo, corpo, antro, piloro', 'Irrigação: tronco celíaco', 'Células parietais: HCl e fator intrínseco'],
      },
      {
        id: 'figado', name: 'Fígado',
        description: 'Maior glândula do corpo. Localizado no hipocôndrio direito. Possui funções metabólicas, excretoras e de síntese.',
        functions: ['Metabolismo de carboidratos, lipídios e proteínas', 'Produção de bile', 'Detoxificação', 'Síntese de fatores de coagulação', 'Armazenamento de glicogênio'],
        pathologies: ['Hepatites', 'Cirrose', 'Esteatose hepática', 'Hepatocarcinoma', 'Insuficiência hepática'],
        examTips: ['Segmentação de Couinaud: 8 segmentos', 'Dupla irrigação: artéria hepática + veia porta', 'Espaço de Disse: entre hepatócitos e sinusoides'],
      },
      {
        id: 'intestino_delgado', name: 'Intestino Delgado',
        description: 'Dividido em duodeno, jejuno e íleo. Principal local de digestão e absorção de nutrientes.',
        functions: ['Digestão final dos alimentos', 'Absorção de nutrientes', 'Secreção de hormônios entéricos', 'Defesa imunológica (placas de Peyer)'],
        pathologies: ['Doença celíaca', 'Doença de Crohn', 'Obstrução intestinal', 'Síndrome do intestino curto'],
        examTips: ['Duodeno: porções superior, descendente, horizontal, ascendente', 'Papila maior: desembocadura do colédoco + Wirsung', 'Jejuno: mais pregueado, íleo: placas de Peyer'],
      },
    ],
  },
  {
    id: 'musculoesqueletico',
    name: 'Sistema Musculoesquelético',
    nameEn: 'Musculoskeletal System',
    icon: Bone,
    color: 'text-stone-500',
    bgColor: 'bg-stone-500/10',
    year: 1,
    description: 'Fornece sustentação, proteção e movimento ao corpo. Composto por ossos, músculos, articulações, tendões e ligamentos.',
    relatedSubjects: ['Anatomia', 'Fisiologia', 'Ortopedia', 'Reumatologia', 'Fisiatria'],
    clinicalRelevance: [
      'Fraturas — classificação e tratamento',
      'Artrose e artrite reumatoide',
      'Lombalgia — queixa mais comum',
      'Osteoporose',
      'Lesões ligamentares do joelho',
      'Síndrome do túnel do carpo',
    ],
    keyTerms: ['Osteoblastos', 'Osteoclastos', 'Sarcômero', 'Contração muscular', 'Articulação sinovial', 'Remodelação óssea'],
    organs: [
      {
        id: 'coluna_vertebral', name: 'Coluna Vertebral',
        description: '33 vértebras: 7 cervicais, 12 torácicas, 5 lombares, 5 sacrais (fundidas), 4 coccígeas (fundidas).',
        functions: ['Sustentação do corpo', 'Proteção da medula espinhal', 'Mobilidade do tronco', 'Absorção de impactos'],
        pathologies: ['Hérnia de disco', 'Espondilolistese', 'Escoliose', 'Fratura vertebral', 'Estenose do canal'],
        examTips: ['C1 (atlas): sem corpo vertebral', 'C2 (áxis): processo odontoide', 'Curvaturas: lordose cervical/lombar, cifose torácica/sacral'],
      },
      {
        id: 'membro_superior', name: 'Membro Superior',
        description: 'Composto por ombro, braço, antebraço e mão. Articulações: glenoumeral, cotovelo, punho.',
        functions: ['Manipulação de objetos', 'Expressão gestual', 'Equilíbrio'],
        pathologies: ['Síndrome do manguito rotador', 'Epicondilite', 'Fratura de Colles', 'Síndrome do túnel do carpo'],
        examTips: ['Plexo braquial: C5-T1', 'Nervo mediano: túnel do carpo', 'Nervo ulnar: canal de Guyon'],
      },
    ],
  },
  {
    id: 'urinario',
    name: 'Sistema Urinário',
    nameEn: 'Urinary System',
    icon: Droplets,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-500/10',
    year: 2,
    description: 'Responsável pela filtração do sangue, produção de urina e regulação do equilíbrio hidroeletrolítico.',
    relatedSubjects: ['Anatomia', 'Fisiologia', 'Nefrologia', 'Urologia'],
    clinicalRelevance: [
      'Insuficiência renal aguda e crônica',
      'Infecção do trato urinário (ITU)',
      'Litíase renal (cálculos)',
      'Síndrome nefrótica e nefrítica',
      'Glomerulonefrites',
    ],
    keyTerms: ['Néfron', 'Taxa de filtração glomerular', 'Reabsorção tubular', 'ADH', 'Aldosterona', 'Sistema renina-angiotensina'],
    organs: [
      {
        id: 'rins', name: 'Rins',
        description: 'Órgãos pares retroperitoneais. Cada rim possui ~1 milhão de néfrons, unidades funcionais de filtração.',
        functions: ['Filtração glomerular', 'Regulação da pressão arterial', 'Equilíbrio ácido-base', 'Produção de eritropoietina', 'Ativação de vitamina D'],
        pathologies: ['DRC', 'IRA', 'Glomerulonefrite', 'Pielonefrite', 'Carcinoma renal', 'Rim policístico'],
        examTips: ['Rim D mais baixo (fígado)', 'Irrigação: artérias renais (ramos da aorta)', 'Néfron: glomérulo + túbulos + ducto coletor'],
      },
    ],
  },
  {
    id: 'endocrino',
    name: 'Sistema Endócrino',
    nameEn: 'Endocrine System',
    icon: Zap,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    year: 2,
    description: 'Regula funções corporais através de hormônios secretados por glândulas endócrinas.',
    relatedSubjects: ['Fisiologia', 'Endocrinologia', 'Bioquímica', 'Farmacologia'],
    clinicalRelevance: [
      'Diabetes Mellitus tipos 1 e 2',
      'Hipo e hipertireoidismo',
      'Síndrome de Cushing',
      'Insuficiência adrenal',
      'Distúrbios da hipófise',
    ],
    keyTerms: ['Feedback negativo', 'Eixo hipotálamo-hipófise', 'Receptores hormonais', 'Hormônios tróficos', 'Glicemia'],
    organs: [
      {
        id: 'tireoide', name: 'Tireoide',
        description: 'Glândula em forma de borboleta na região cervical anterior. Produz T3 e T4 (metabolismo) e calcitonina.',
        functions: ['Regulação do metabolismo basal', 'Crescimento e desenvolvimento', 'Regulação do cálcio (calcitonina)'],
        pathologies: ['Hipotireoidismo (Hashimoto)', 'Hipertireoidismo (Graves)', 'Nódulos tireoidianos', 'Câncer de tireoide'],
        examTips: ['Irrigação: artérias tireóideas superior e inferior', 'Nervo laríngeo recorrente: risco cirúrgico', 'TSH: principal exame de triagem'],
      },
      {
        id: 'pancreas_endocrino', name: 'Pâncreas (Endócrino)',
        description: 'Ilhotas de Langerhans: células alfa (glucagon), beta (insulina), delta (somatostatina).',
        functions: ['Regulação da glicemia', 'Metabolismo de carboidratos', 'Homeostase energética'],
        pathologies: ['Diabetes tipo 1 e 2', 'Insulinoma', 'Glucagonoma', 'Cetoacidose diabética'],
        examTips: ['Células beta: 60-80% das ilhotas', 'Insulina: único hormônio hipoglicemiante', 'HbA1c: controle glicêmico dos últimos 3 meses'],
      },
    ],
  },
  {
    id: 'imunologico',
    name: 'Sistema Imunológico',
    nameEn: 'Immune System',
    icon: Shield,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    year: 2,
    description: 'Defesa do organismo contra patógenos. Inclui imunidade inata (inespecífica) e adaptativa (específica).',
    relatedSubjects: ['Imunologia', 'Microbiologia', 'Patologia', 'Infectologia', 'Reumatologia', 'Alergia'],
    clinicalRelevance: [
      'HIV/AIDS',
      'Doenças autoimunes (LES, AR)',
      'Alergias e anafilaxia',
      'Imunodeficiências primárias',
      'Transplante e rejeição',
      'Vacinação',
    ],
    keyTerms: ['Antígeno', 'Anticorpo', 'Linfócitos T e B', 'MHC/HLA', 'Complemento', 'Citocinas', 'Imunoglobulinas'],
    organs: [
      {
        id: 'timo', name: 'Timo',
        description: 'Órgão linfoide primário localizado no mediastino anterior. Local de maturação dos linfócitos T.',
        functions: ['Maturação de linfócitos T', 'Seleção positiva e negativa', 'Tolerância central'],
        pathologies: ['Timoma', 'Miastenia gravis (associação)', 'Síndrome de DiGeorge (aplasia tímica)'],
        examTips: ['Involução após puberdade', 'Seleção positiva: córtex', 'Seleção negativa: medula'],
      },
      {
        id: 'baco', name: 'Baço',
        description: 'Maior órgão linfoide. Localizado no hipocôndrio esquerdo. Filtra sangue e participa da resposta imune.',
        functions: ['Filtração de hemácias velhas', 'Produção de anticorpos', 'Reservatório de plaquetas', 'Hematopoiese fetal'],
        pathologies: ['Esplenomegalia', 'Ruptura esplênica (trauma)', 'Asplenia funcional (anemia falciforme)'],
        examTips: ['Polpa branca: função imune', 'Polpa vermelha: filtração', 'Esplenectomia: risco de infecções encapsuladas'],
      },
    ],
  },
];

// ─── Human Body SVG Component ──────────────────────────────────
function HumanBodySVG({ selectedSystem, onSystemClick }: { selectedSystem: string | null; onSystemClick: (id: string) => void }) {
  const systemPositions: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {
    nervoso: { cx: 150, cy: 55, rx: 30, ry: 35 },
    respiratorio: { cx: 150, cy: 155, rx: 40, ry: 30 },
    cardiovascular: { cx: 150, cy: 190, rx: 25, ry: 25 },
    digestorio: { cx: 150, cy: 250, rx: 35, ry: 40 },
    endocrino: { cx: 150, cy: 115, rx: 20, ry: 15 },
    urinario: { cx: 150, cy: 305, rx: 30, ry: 20 },
    musculoesqueletico: { cx: 150, cy: 370, rx: 45, ry: 50 },
    imunologico: { cx: 85, cy: 210, rx: 20, ry: 20 },
  };

  return (
    <svg viewBox="0 0 300 450" className="w-full max-w-[280px] mx-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Body outline */}
      <path
        d="M150 20 C170 20 185 35 185 55 C185 75 175 85 175 95 L195 95 C210 95 220 105 225 120 L245 180 C250 195 245 200 235 200 L210 195 L205 240 C205 260 210 280 210 300 L215 380 C215 400 205 420 195 430 L175 430 C170 420 165 400 165 380 L160 320 L155 320 L150 380 C150 400 145 420 140 430 L120 430 C110 420 100 400 100 380 L105 300 C105 280 110 260 110 240 L105 195 L80 200 C70 200 65 195 70 180 L90 120 C95 105 105 95 120 95 L140 95 C140 85 130 75 130 55 C130 35 140 20 150 20Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-muted-foreground/30"
      />
      
      {/* System hotspots */}
      {BODY_SYSTEMS.map(system => {
        const pos = systemPositions[system.id];
        if (!pos) return null;
        const isSelected = selectedSystem === system.id;
        const colorMap: Record<string, string> = {
          cardiovascular: '#ef4444', nervoso: '#a855f7', respiratorio: '#0ea5e9',
          digestorio: '#f59e0b', musculoesqueletico: '#78716c', urinario: '#ca8a04',
          endocrino: '#10b981', imunologico: '#6366f1',
        };
        const color = colorMap[system.id] || '#6b7280';
        return (
          <g key={system.id} onClick={() => onSystemClick(system.id)} className="cursor-pointer">
            <ellipse
              cx={pos.cx} cy={pos.cy} rx={pos.rx} ry={pos.ry}
              fill={color}
              fillOpacity={isSelected ? 0.4 : 0.15}
              stroke={color}
              strokeWidth={isSelected ? 2.5 : 1}
              className="transition-all duration-300 hover:fill-opacity-30"
            />
            <text
              x={pos.cx} y={pos.cy + 4}
              textAnchor="middle"
              fontSize="8"
              fill={color}
              fontWeight="bold"
              className="pointer-events-none select-none"
            >
              {system.name.split(' ').pop()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Main Component ────────────────────────────────────────────
const AnatomyAtlas: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [atlasDarkMode, setAtlasDarkMode] = useState(true);
  const [filterYear, setFilterYear] = useState<number | null>(null);

  const filteredSystems = useMemo(() => {
    let systems = BODY_SYSTEMS;
    if (filterYear) systems = systems.filter(s => s.year === filterYear);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      systems = systems.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.organs.some(o => o.name.toLowerCase().includes(term)) ||
        s.keyTerms.some(t => t.toLowerCase().includes(term)) ||
        s.clinicalRelevance.some(c => c.toLowerCase().includes(term))
      );
    }
    return systems;
  }, [filterYear, searchTerm]);

  const currentSystem = BODY_SYSTEMS.find(s => s.id === selectedSystem);
  const currentOrgan = currentSystem?.organs.find(o => o.id === selectedOrgan);

  // ─── Organ Detail View ─────────────────────────────────────
  if (currentOrgan && currentSystem) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => setSelectedOrgan(null)} className="mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para {currentSystem.name}
        </Button>
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${currentSystem.bgColor} flex items-center justify-center`}>
                <Microscope className={`w-6 h-6 ${currentSystem.color}`} />
              </div>
              <div>
                <CardTitle className="text-xl">{currentOrgan.name}</CardTitle>
                <CardDescription>{currentSystem.name}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-foreground/80 leading-relaxed">{currentOrgan.description}</p>

            <div>
              <h4 className="font-bold text-sm text-foreground mb-2 flex items-center gap-2"><Activity className="w-4 h-4" /> Funções</h4>
              <div className="grid gap-2">
                {currentOrgan.functions.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-foreground mb-2 flex items-center gap-2"><Stethoscope className="w-4 h-4" /> Patologias Principais</h4>
              <div className="flex flex-wrap gap-2">
                {currentOrgan.pathologies.map((p, i) => (
                  <Badge key={i} variant="secondary">{p}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-foreground mb-2 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Dicas para Provas</h4>
              <div className="space-y-2">
                {currentOrgan.examTips.map((tip, i) => (
                  <div key={i} className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-sm text-foreground/80">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── System Detail View ────────────────────────────────────
  if (currentSystem) {
    const Icon = currentSystem.icon;
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => setSelectedSystem(null)} className="mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Atlas
        </Button>

        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-xl ${currentSystem.bgColor} flex items-center justify-center`}>
                <Icon className={`w-7 h-7 ${currentSystem.color}`} />
              </div>
              <div>
                <CardTitle className="text-xl">{currentSystem.name}</CardTitle>
                <CardDescription>{currentSystem.nameEn} — Estudado no {currentSystem.year}° ano</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-foreground/80 leading-relaxed">{currentSystem.description}</p>

            {/* Organs */}
            <div>
              <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Microscope className="w-5 h-5" /> Órgãos e Estruturas
              </h4>
              <div className="grid gap-3">
                {currentSystem.organs.map(organ => (
                  <button
                    key={organ.id}
                    onClick={() => setSelectedOrgan(organ.id)}
                    className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 text-left transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-foreground">{organ.name}</p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{organ.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {organ.pathologies.slice(0, 3).map((p, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{p}</Badge>
                      ))}
                      {organ.pathologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{organ.pathologies.length - 3}</Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Clinical Relevance */}
            <div>
              <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Stethoscope className="w-5 h-5" /> Relevância Clínica
              </h4>
              <div className="space-y-2">
                {currentSystem.clinicalRelevance.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Terms */}
            <div>
              <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Termos-Chave
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentSystem.keyTerms.map((term, i) => (
                  <Badge key={i} variant="secondary">{term}</Badge>
                ))}
              </div>
            </div>

            {/* Related Subjects */}
            <div>
              <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" /> Disciplinas Relacionadas
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentSystem.relatedSubjects.map((sub, i) => (
                  <Badge key={i} variant="outline">{sub}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Main Atlas View ───────────────────────────────────────
  return (
    <div className={`space-y-6 max-w-5xl mx-auto transition-colors duration-300 ${atlasDarkMode ? 'atlas-dark-mode' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Atlas Anatômico Interativo</h2>
          <p className="text-sm opacity-70 mt-1">Explore os sistemas do corpo humano com conteúdo vinculado às disciplinas de cada ano</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAtlasDarkMode(!atlasDarkMode)}
          className={`gap-2 ${atlasDarkMode ? 'bg-slate-800 text-amber-300 border-slate-600 hover:bg-slate-700 hover:text-amber-200' : ''}`}
        >
          {atlasDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {atlasDarkMode ? 'Modo Claro' : 'Modo Escuro'}
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar sistema, órgão, patologia..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2">
          <Button variant={filterYear === null ? 'default' : 'outline'} size="sm" onClick={() => setFilterYear(null)}>Todos</Button>
          {[1, 2, 3, 4].map(y => (
            <Button key={y} variant={filterYear === y ? 'default' : 'outline'} size="sm" onClick={() => setFilterYear(y)}>
              {y}° Ano
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Body */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Corpo Humano</CardTitle>
            <CardDescription>Clique em um sistema para explorar</CardDescription>
          </CardHeader>
          <CardContent>
            <HumanBodySVG selectedSystem={selectedSystem} onSystemClick={setSelectedSystem} />
          </CardContent>
        </Card>

        {/* Systems Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredSystems.map(system => {
            const Icon = system.icon;
            return (
              <button
                key={system.id}
                onClick={() => setSelectedSystem(system.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                  selectedSystem === system.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg ${system.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${system.color}`} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{system.name}</p>
                    <p className="text-xs text-muted-foreground">{system.year}° Ano</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{system.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {system.organs.slice(0, 3).map(o => (
                    <Badge key={o.id} variant="outline" className="text-[10px]">{o.name}</Badge>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnatomyAtlas;
