/**
 * Calculadoras Médicas Expandidas com Fórmulas e Ensino
 * Cada calculadora inclui a fórmula, explicação didática e interpretação
 */

export interface MedicalCalculator {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  formula: string;
  formulaLatex?: string;
  howToCalculate: string;
  interpretation: string[];
  references: string[];
  fields: { name: string; label: string; type: 'number' | 'select'; unit?: string; options?: { value: string; label: string }[]; min?: number; max?: number }[];
}

export const CALCULATOR_CATEGORIES = [
  { id: 'cardio', name: 'Cardiologia', icon: '❤️' },
  { id: 'nefro', name: 'Nefrologia', icon: '🫘' },
  { id: 'hepato', name: 'Hepatologia', icon: '🫁' },
  { id: 'neuro', name: 'Neurologia', icon: '🧠' },
  { id: 'endo', name: 'Endocrinologia', icon: '⚡' },
  { id: 'pneumo', name: 'Pneumologia', icon: '🫁' },
  { id: 'geral', name: 'Geral', icon: '🩺' },
  { id: 'obst', name: 'Obstetrícia', icon: '🤰' },
  { id: 'ped', name: 'Pediatria', icon: '👶' },
  { id: 'infecto', name: 'Infectologia', icon: '🦠' },
  { id: 'emergencia', name: 'Emergência', icon: '🚑' },
  { id: 'hemato', name: 'Hematologia', icon: '🩸' },
];

export const EXPANDED_CALCULATORS: MedicalCalculator[] = [
  // ═══════════════════════════════════════════════════════════
  // CARDIOLOGIA
  // ═══════════════════════════════════════════════════════════
  {
    id: 'framingham', name: 'Escore de Framingham', category: 'cardio', icon: '❤️',
    description: 'Estima o risco cardiovascular em 10 anos baseado em fatores de risco clássicos.',
    formula: 'Pontuação baseada em: idade, sexo, colesterol total, HDL, PAS, tabagismo, diabetes. Risco = 1 - S₀^exp(Σβᵢxᵢ - M)',
    howToCalculate: '1. Atribua pontos para cada fator de risco conforme a tabela de Framingham\n2. Some todos os pontos\n3. Consulte a tabela de conversão para obter o risco percentual em 10 anos\n4. Exemplo: Homem, 55 anos (6 pts), CT 240 (3 pts), HDL 45 (1 pt), PAS 140 tratada (2 pts), fumante (2 pts), não diabético (0) = 14 pts → Risco ~16%',
    interpretation: [
      'Baixo risco: <5% em 10 anos',
      'Risco intermediário: 5-20% em 10 anos',
      'Alto risco: >20% em 10 anos ou DM/aterosclerose prévia',
      'Muito alto risco: >20% + fatores agravantes',
    ],
    references: ['Wilson PWF et al. Circulation 1998;97:1837-47', 'D\'Agostino RB et al. Circulation 2008;117:743-53'],
    fields: [
      { name: 'age', label: 'Idade', type: 'number', unit: 'anos', min: 20, max: 79 },
      { name: 'sex', label: 'Sexo', type: 'select', options: [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Feminino' }] },
      { name: 'totalCholesterol', label: 'Colesterol Total', type: 'number', unit: 'mg/dL', min: 100, max: 400 },
      { name: 'hdl', label: 'HDL', type: 'number', unit: 'mg/dL', min: 20, max: 100 },
      { name: 'sbp', label: 'PAS', type: 'number', unit: 'mmHg', min: 80, max: 200 },
      { name: 'smoking', label: 'Tabagismo', type: 'select', options: [{ value: 'yes', label: 'Sim' }, { value: 'no', label: 'Não' }] },
      { name: 'diabetes', label: 'Diabetes', type: 'select', options: [{ value: 'yes', label: 'Sim' }, { value: 'no', label: 'Não' }] },
    ],
  },
  {
    id: 'chadsvasc', name: 'CHA₂DS₂-VASc', category: 'cardio', icon: '❤️',
    description: 'Avalia risco de AVC em pacientes com fibrilação atrial para indicação de anticoagulação.',
    formula: 'C (IC/FE≤40%) = 1 + H (HAS) = 1 + A₂ (Idade≥75) = 2 + D (DM) = 1 + S₂ (AVC/AIT prévio) = 2 + V (Doença vascular) = 1 + A (Idade 65-74) = 1 + Sc (Sexo feminino) = 1',
    howToCalculate: '1. Para cada critério presente, some os pontos correspondentes\n2. C = Insuficiência Cardíaca Congestiva (1 ponto)\n3. H = Hipertensão (1 ponto)\n4. A₂ = Age ≥ 75 anos (2 pontos)\n5. D = Diabetes Mellitus (1 ponto)\n6. S₂ = Stroke/AIT/tromboembolismo prévio (2 pontos)\n7. V = Vascular disease - IAM, DAP, placa aórtica (1 ponto)\n8. A = Age 65-74 anos (1 ponto)\n9. Sc = Sex category feminino (1 ponto)\n10. Pontuação máxima: 9 pontos',
    interpretation: [
      '0 pontos (homem): baixo risco, sem necessidade de anticoagulação',
      '1 ponto (homem) ou 1-2 (mulher): considerar anticoagulação',
      '≥2 pontos (homem) ou ≥3 (mulher): anticoagulação recomendada (DOACs ou varfarina)',
      'Risco anual de AVC: 0 pts=0%, 1=1.3%, 2=2.2%, 3=3.2%, 4=4.0%, 5=6.7%, 6=9.8%, 7=9.6%, 8=6.7%, 9=15.2%',
    ],
    references: ['Lip GYH et al. Chest 2010;137:263-72', 'ESC Guidelines FA 2020'],
    fields: [
      { name: 'chf', label: 'IC/FE≤40%', type: 'select', options: [{ value: '1', label: 'Sim (1 pt)' }, { value: '0', label: 'Não (0 pt)' }] },
      { name: 'hypertension', label: 'Hipertensão', type: 'select', options: [{ value: '1', label: 'Sim (1 pt)' }, { value: '0', label: 'Não (0 pt)' }] },
      { name: 'age75', label: 'Idade ≥75 anos', type: 'select', options: [{ value: '2', label: 'Sim (2 pts)' }, { value: '0', label: 'Não (0 pt)' }] },
      { name: 'diabetes', label: 'Diabetes', type: 'select', options: [{ value: '1', label: 'Sim (1 pt)' }, { value: '0', label: 'Não (0 pt)' }] },
      { name: 'stroke', label: 'AVC/AIT prévio', type: 'select', options: [{ value: '2', label: 'Sim (2 pts)' }, { value: '0', label: 'Não (0 pt)' }] },
      { name: 'vascular', label: 'Doença vascular', type: 'select', options: [{ value: '1', label: 'Sim (1 pt)' }, { value: '0', label: 'Não (0 pt)' }] },
      { name: 'age65', label: 'Idade 65-74 anos', type: 'select', options: [{ value: '1', label: 'Sim (1 pt)' }, { value: '0', label: 'Não (0 pt)' }] },
      { name: 'female', label: 'Sexo feminino', type: 'select', options: [{ value: '1', label: 'Sim (1 pt)' }, { value: '0', label: 'Não (0 pt)' }] },
    ],
  },
  {
    id: 'hasbled', name: 'HAS-BLED', category: 'cardio', icon: '🩸',
    description: 'Avalia risco de sangramento em pacientes anticoagulados com fibrilação atrial.',
    formula: 'H (HAS descontrolada) + A (Alteração renal/hepática, 1 pt cada) + S (Stroke) + B (Bleeding) + L (Labile INR) + E (Elderly ≥65) + D (Drugs/álcool, 1 pt cada). Máximo: 9 pts.',
    howToCalculate: '1. H = Hipertensão não controlada (PAS>160): 1 ponto\n2. A = Alteração renal (diálise, Cr>2.3) e/ou hepática (cirrose, bilirrubina>2x): 1 ponto cada (máx 2)\n3. S = AVC prévio: 1 ponto\n4. B = Sangramento prévio ou predisposição: 1 ponto\n5. L = INR lábil (TTR<60%): 1 ponto\n6. E = Idade >65 anos: 1 ponto\n7. D = Drogas (AAS, AINEs) e/ou álcool (≥8 doses/sem): 1 ponto cada (máx 2)',
    interpretation: [
      '0-2 pontos: baixo risco de sangramento',
      '≥3 pontos: alto risco — cautela com anticoagulação, corrigir fatores modificáveis',
      'HAS-BLED alto NÃO contraindica anticoagulação, mas indica necessidade de monitoramento mais frequente',
    ],
    references: ['Pisters R et al. Chest 2010;138:1093-100'],
    fields: [
      { name: 'hypertension', label: 'HAS descontrolada (PAS>160)', type: 'select', options: [{ value: '1', label: 'Sim' }, { value: '0', label: 'Não' }] },
      { name: 'renal', label: 'Alteração renal', type: 'select', options: [{ value: '1', label: 'Sim' }, { value: '0', label: 'Não' }] },
      { name: 'liver', label: 'Alteração hepática', type: 'select', options: [{ value: '1', label: 'Sim' }, { value: '0', label: 'Não' }] },
      { name: 'stroke', label: 'AVC prévio', type: 'select', options: [{ value: '1', label: 'Sim' }, { value: '0', label: 'Não' }] },
      { name: 'bleeding', label: 'Sangramento prévio', type: 'select', options: [{ value: '1', label: 'Sim' }, { value: '0', label: 'Não' }] },
      { name: 'labile', label: 'INR lábil (TTR<60%)', type: 'select', options: [{ value: '1', label: 'Sim' }, { value: '0', label: 'Não' }] },
      { name: 'elderly', label: 'Idade >65 anos', type: 'select', options: [{ value: '1', label: 'Sim' }, { value: '0', label: 'Não' }] },
      { name: 'drugs', label: 'Drogas (AAS/AINEs)', type: 'select', options: [{ value: '1', label: 'Sim' }, { value: '0', label: 'Não' }] },
      { name: 'alcohol', label: 'Álcool (≥8 doses/sem)', type: 'select', options: [{ value: '1', label: 'Sim' }, { value: '0', label: 'Não' }] },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // NEFROLOGIA
  // ═══════════════════════════════════════════════════════════
  {
    id: 'ckdepi', name: 'CKD-EPI (TFG estimada)', category: 'nefro', icon: '🫘',
    description: 'Estima a taxa de filtração glomerular a partir da creatinina sérica.',
    formula: 'TFGe = 141 × min(Cr/κ, 1)^α × max(Cr/κ, 1)^(-1.209) × 0.993^idade × [1.018 se feminino] × [1.159 se negro]\nOnde κ = 0.7 (F) ou 0.9 (M), α = -0.329 (F) ou -0.411 (M)',
    howToCalculate: '1. Obtenha a creatinina sérica (mg/dL), idade, sexo e raça\n2. Calcule κ: 0.7 para mulheres, 0.9 para homens\n3. Calcule α: -0.329 para mulheres, -0.411 para homens\n4. Calcule min(Cr/κ, 1): se Cr/κ < 1, use Cr/κ; senão use 1\n5. Calcule max(Cr/κ, 1): se Cr/κ > 1, use Cr/κ; senão use 1\n6. Aplique a fórmula completa\n7. Exemplo: Mulher, 60 anos, Cr=1.0 → Cr/κ=1.0/0.7=1.43 → min=1, max=1.43 → TFGe = 141 × 1 × 1.43^(-1.209) × 0.993^60 × 1.018 ≈ 72 mL/min/1.73m²',
    interpretation: [
      'G1: TFG ≥90 — Normal ou alta',
      'G2: TFG 60-89 — Levemente diminuída',
      'G3a: TFG 45-59 — Leve a moderadamente diminuída',
      'G3b: TFG 30-44 — Moderada a gravemente diminuída',
      'G4: TFG 15-29 — Gravemente diminuída',
      'G5: TFG <15 — Falência renal (indicação de diálise)',
    ],
    references: ['Levey AS et al. Ann Intern Med 2009;150:604-12', 'KDIGO 2012 Clinical Practice Guideline'],
    fields: [
      { name: 'creatinine', label: 'Creatinina sérica', type: 'number', unit: 'mg/dL', min: 0.1, max: 20 },
      { name: 'age', label: 'Idade', type: 'number', unit: 'anos', min: 18, max: 100 },
      { name: 'sex', label: 'Sexo', type: 'select', options: [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Feminino' }] },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // HEPATOLOGIA
  // ═══════════════════════════════════════════════════════════
  {
    id: 'meld', name: 'MELD Score', category: 'hepato', icon: '🫁',
    description: 'Model for End-Stage Liver Disease. Prediz mortalidade em 3 meses em pacientes com doença hepática crônica. Usado para priorização na fila de transplante hepático.',
    formula: 'MELD = 3.78 × ln(Bilirrubina) + 11.2 × ln(INR) + 9.57 × ln(Creatinina) + 6.43\nValores mínimos: 1.0 para cada variável. Se diálise 2x/sem: Cr = 4.0',
    howToCalculate: '1. Obtenha: bilirrubina total (mg/dL), INR e creatinina (mg/dL)\n2. Se qualquer valor <1, use 1\n3. Se creatinina >4 ou diálise 2x/semana, use Cr=4\n4. Calcule o logaritmo natural (ln) de cada valor\n5. Aplique a fórmula: 3.78×ln(Bil) + 11.2×ln(INR) + 9.57×ln(Cr) + 6.43\n6. Arredonde para o inteiro mais próximo\n7. Exemplo: Bil=3.0, INR=1.5, Cr=1.2 → 3.78×1.10 + 11.2×0.41 + 9.57×0.18 + 6.43 = 4.16 + 4.59 + 1.72 + 6.43 = 16.9 → MELD = 17',
    interpretation: [
      'MELD <10: mortalidade em 3 meses ~2%',
      'MELD 10-19: mortalidade em 3 meses ~6%',
      'MELD 20-29: mortalidade em 3 meses ~20%',
      'MELD 30-39: mortalidade em 3 meses ~53%',
      'MELD ≥40: mortalidade em 3 meses ~71%',
      'No Brasil: MELD ≥11 para entrar na fila de transplante',
    ],
    references: ['Kamath PS et al. Hepatology 2001;33:464-70', 'UNOS/OPTN Policy'],
    fields: [
      { name: 'bilirubin', label: 'Bilirrubina total', type: 'number', unit: 'mg/dL', min: 0.1, max: 50 },
      { name: 'inr', label: 'INR', type: 'number', unit: '', min: 0.5, max: 10 },
      { name: 'creatinine', label: 'Creatinina', type: 'number', unit: 'mg/dL', min: 0.1, max: 10 },
      { name: 'dialysis', label: 'Diálise 2x/sem', type: 'select', options: [{ value: 'yes', label: 'Sim' }, { value: 'no', label: 'Não' }] },
    ],
  },
  {
    id: 'childpugh', name: 'Child-Pugh', category: 'hepato', icon: '🫁',
    description: 'Classifica a gravidade da cirrose hepática e prediz mortalidade.',
    formula: 'Soma de pontos (5 critérios, 1-3 pts cada): Bilirrubina, Albumina, INR, Ascite, Encefalopatia. Total: 5-15 pontos.',
    howToCalculate: '1. Bilirrubina: <2=1pt, 2-3=2pts, >3=3pts\n2. Albumina: >3.5=1pt, 2.8-3.5=2pts, <2.8=3pts\n3. INR: <1.7=1pt, 1.7-2.3=2pts, >2.3=3pts\n4. Ascite: ausente=1pt, leve=2pts, moderada/grave=3pts\n5. Encefalopatia: ausente=1pt, grau I-II=2pts, grau III-IV=3pts\n6. Some todos os pontos',
    interpretation: [
      'Child A (5-6 pts): cirrose compensada, sobrevida 1 ano ~100%, 2 anos ~85%',
      'Child B (7-9 pts): comprometimento funcional significativo, sobrevida 1 ano ~80%, 2 anos ~60%',
      'Child C (10-15 pts): cirrose descompensada, sobrevida 1 ano ~45%, 2 anos ~35%',
    ],
    references: ['Pugh RN et al. Br J Surg 1973;60:646-9'],
    fields: [
      { name: 'bilirubin', label: 'Bilirrubina total', type: 'number', unit: 'mg/dL', min: 0.1, max: 50 },
      { name: 'albumin', label: 'Albumina', type: 'number', unit: 'g/dL', min: 1, max: 6 },
      { name: 'inr', label: 'INR', type: 'number', unit: '', min: 0.5, max: 10 },
      { name: 'ascites', label: 'Ascite', type: 'select', options: [{ value: '1', label: 'Ausente' }, { value: '2', label: 'Leve' }, { value: '3', label: 'Moderada/Grave' }] },
      { name: 'encephalopathy', label: 'Encefalopatia', type: 'select', options: [{ value: '1', label: 'Ausente' }, { value: '2', label: 'Grau I-II' }, { value: '3', label: 'Grau III-IV' }] },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // NEUROLOGIA
  // ═══════════════════════════════════════════════════════════
  {
    id: 'glasgow', name: 'Escala de Coma de Glasgow', category: 'neuro', icon: '🧠',
    description: 'Avalia o nível de consciência baseado em abertura ocular, resposta verbal e resposta motora.',
    formula: 'GCS = Abertura Ocular (1-4) + Resposta Verbal (1-5) + Resposta Motora (1-6). Total: 3-15.',
    howToCalculate: '1. Abertura Ocular: Espontânea=4, Ao comando=3, À dor=2, Nenhuma=1\n2. Resposta Verbal: Orientada=5, Confusa=4, Palavras inapropriadas=3, Sons incompreensíveis=2, Nenhuma=1\n3. Resposta Motora: Obedece comandos=6, Localiza dor=5, Flexão normal=4, Flexão anormal (decorticação)=3, Extensão (descerebração)=2, Nenhuma=1\n4. Some os 3 componentes\n5. Registre como: GCS X (OxVxMx). Ex: GCS 11 (O3V4M4)',
    interpretation: [
      'GCS 15: normal',
      'GCS 13-14: TCE leve',
      'GCS 9-12: TCE moderado',
      'GCS 3-8: TCE grave (indicação de IOT)',
      'GCS ≤8: coma — proteger via aérea',
      'Pupilas: avaliar reatividade (componente adicional: P1=reativas, P2=1 fixa, P0=ambas fixas)',
    ],
    references: ['Teasdale G, Jennett B. Lancet 1974;2:81-4', 'Teasdale G et al. J Neurosurg 2014;120:1373-81'],
    fields: [
      { name: 'eye', label: 'Abertura Ocular', type: 'select', options: [{ value: '4', label: 'Espontânea (4)' }, { value: '3', label: 'Ao comando (3)' }, { value: '2', label: 'À dor (2)' }, { value: '1', label: 'Nenhuma (1)' }] },
      { name: 'verbal', label: 'Resposta Verbal', type: 'select', options: [{ value: '5', label: 'Orientada (5)' }, { value: '4', label: 'Confusa (4)' }, { value: '3', label: 'Palavras inapropriadas (3)' }, { value: '2', label: 'Sons incompreensíveis (2)' }, { value: '1', label: 'Nenhuma (1)' }] },
      { name: 'motor', label: 'Resposta Motora', type: 'select', options: [{ value: '6', label: 'Obedece comandos (6)' }, { value: '5', label: 'Localiza dor (5)' }, { value: '4', label: 'Flexão normal (4)' }, { value: '3', label: 'Flexão anormal (3)' }, { value: '2', label: 'Extensão (2)' }, { value: '1', label: 'Nenhuma (1)' }] },
    ],
  },
  {
    id: 'nihss', name: 'NIHSS (AVC)', category: 'neuro', icon: '🧠',
    description: 'National Institutes of Health Stroke Scale. Quantifica a gravidade do AVC isquêmico.',
    formula: 'Soma de 11 itens (0-42 pontos): nível de consciência, olhar, campo visual, paralisia facial, força motora (MMSS e MMII), ataxia, sensibilidade, linguagem, disartria, extinção/negligência.',
    howToCalculate: '1. Avalie cada um dos 11 domínios neurológicos\n2. Pontue cada item de 0 (normal) a 2-4 (déficit grave)\n3. Some todos os pontos\n4. Itens: 1a-Nível consciência, 1b-Perguntas, 1c-Comandos, 2-Olhar, 3-Campo visual, 4-Paralisia facial, 5a/b-Força MMSS, 6a/b-Força MMII, 7-Ataxia, 8-Sensibilidade, 9-Linguagem, 10-Disartria, 11-Extinção',
    interpretation: [
      '0: sem déficit',
      '1-4: AVC menor',
      '5-15: AVC moderado',
      '16-20: AVC moderado a grave',
      '21-42: AVC grave',
      'NIHSS ≥6: considerar trombólise (se <4.5h) ou trombectomia mecânica (se <24h com oclusão de grande vaso)',
    ],
    references: ['Brott T et al. Stroke 1989;20:864-70', 'AHA/ASA Guidelines 2019'],
    fields: [
      { name: 'consciousness', label: '1a. Nível de consciência', type: 'select', options: [{ value: '0', label: 'Alerta (0)' }, { value: '1', label: 'Sonolento (1)' }, { value: '2', label: 'Estuporoso (2)' }, { value: '3', label: 'Coma (3)' }] },
      { name: 'questions', label: '1b. Perguntas (mês/idade)', type: 'select', options: [{ value: '0', label: 'Ambas corretas (0)' }, { value: '1', label: 'Uma correta (1)' }, { value: '2', label: 'Nenhuma (2)' }] },
      { name: 'commands', label: '1c. Comandos (fechar olhos/apertar mão)', type: 'select', options: [{ value: '0', label: 'Ambos corretos (0)' }, { value: '1', label: 'Um correto (1)' }, { value: '2', label: 'Nenhum (2)' }] },
      { name: 'gaze', label: '2. Olhar conjugado', type: 'select', options: [{ value: '0', label: 'Normal (0)' }, { value: '1', label: 'Paralisia parcial (1)' }, { value: '2', label: 'Desvio forçado (2)' }] },
      { name: 'visual', label: '3. Campo visual', type: 'select', options: [{ value: '0', label: 'Normal (0)' }, { value: '1', label: 'Hemianopsia parcial (1)' }, { value: '2', label: 'Hemianopsia completa (2)' }, { value: '3', label: 'Cegueira bilateral (3)' }] },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // GERAL
  // ═══════════════════════════════════════════════════════════
  {
    id: 'imc', name: 'IMC (Índice de Massa Corporal)', category: 'geral', icon: '⚖️',
    description: 'Avalia o estado nutricional baseado na relação peso/altura.',
    formula: 'IMC = Peso (kg) / Altura² (m²)',
    howToCalculate: '1. Meça o peso em quilogramas (kg)\n2. Meça a altura em metros (m)\n3. Eleve a altura ao quadrado (altura × altura)\n4. Divida o peso pela altura ao quadrado\n5. Exemplo: 80 kg, 1.75 m → IMC = 80 / (1.75 × 1.75) = 80 / 3.0625 = 26.1 kg/m²',
    interpretation: [
      '<18.5: Baixo peso',
      '18.5-24.9: Peso normal (eutrófico)',
      '25.0-29.9: Sobrepeso',
      '30.0-34.9: Obesidade grau I',
      '35.0-39.9: Obesidade grau II',
      '≥40.0: Obesidade grau III (mórbida)',
      'Idosos (>65 anos): considerar IMC 22-27 como normal',
    ],
    references: ['WHO Technical Report Series 894, 2000', 'ABESO - Diretrizes Brasileiras de Obesidade 2016'],
    fields: [
      { name: 'weight', label: 'Peso', type: 'number', unit: 'kg', min: 20, max: 300 },
      { name: 'height', label: 'Altura', type: 'number', unit: 'm', min: 0.5, max: 2.5 },
    ],
  },
  {
    id: 'wells-tvp', name: 'Wells (TVP)', category: 'geral', icon: '🦵',
    description: 'Avalia a probabilidade clínica de trombose venosa profunda.',
    formula: 'Soma de critérios clínicos: câncer ativo (+1), paralisia/imobilização (+1), acamado >3 dias ou cirurgia <12 sem (+1), dor à palpação (+1), edema de toda perna (+1), edema >3cm (+1), edema depressível (+1), veias colaterais (+1), TVP prévia (+1), diagnóstico alternativo provável (-2).',
    howToCalculate: '1. Avalie cada critério clínico\n2. Some os pontos positivos e subtraia os negativos\n3. Classifique a probabilidade\n4. Exemplo: paciente com edema unilateral (+1), dor à palpação (+1), cirurgia recente (+1), sem diagnóstico alternativo (0) = 3 pontos → alta probabilidade',
    interpretation: [
      '≤0 pontos: baixa probabilidade (5% de TVP) → D-dímero',
      '1-2 pontos: probabilidade moderada (17% de TVP) → D-dímero',
      '≥3 pontos: alta probabilidade (53% de TVP) → USG Doppler direto',
      'D-dímero negativo + baixa/moderada probabilidade: exclui TVP',
      'D-dímero positivo ou alta probabilidade: USG Doppler venoso',
    ],
    references: ['Wells PS et al. Lancet 1997;350:1795-8', 'Wells PS et al. NEJM 2003;349:1227-35'],
    fields: [
      { name: 'cancer', label: 'Câncer ativo', type: 'select', options: [{ value: '1', label: 'Sim (+1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'paralysis', label: 'Paralisia/imobilização MI', type: 'select', options: [{ value: '1', label: 'Sim (+1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'bedridden', label: 'Acamado >3d ou cirurgia <12sem', type: 'select', options: [{ value: '1', label: 'Sim (+1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'tenderness', label: 'Dor à palpação', type: 'select', options: [{ value: '1', label: 'Sim (+1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'swelling', label: 'Edema de toda a perna', type: 'select', options: [{ value: '1', label: 'Sim (+1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'calf', label: 'Diferença >3cm na panturrilha', type: 'select', options: [{ value: '1', label: 'Sim (+1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'pitting', label: 'Edema depressível (cacifo)', type: 'select', options: [{ value: '1', label: 'Sim (+1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'collateral', label: 'Veias colaterais superficiais', type: 'select', options: [{ value: '1', label: 'Sim (+1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'previous', label: 'TVP prévia documentada', type: 'select', options: [{ value: '1', label: 'Sim (+1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'alternative', label: 'Diagnóstico alternativo provável', type: 'select', options: [{ value: '-2', label: 'Sim (-2)' }, { value: '0', label: 'Não (0)' }] },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // OBSTETRÍCIA
  // ═══════════════════════════════════════════════════════════
  {
    id: 'dpp', name: 'Data Provável do Parto (DPP)', category: 'obst', icon: '🤰',
    description: 'Calcula a data provável do parto pela regra de Naegele.',
    formula: 'DPP = DUM + 7 dias - 3 meses + 1 ano (Regra de Naegele)\nOu: DPP = DUM + 280 dias (40 semanas)',
    howToCalculate: '1. Obtenha a Data da Última Menstruação (DUM)\n2. Some 7 dias à DUM\n3. Subtraia 3 meses\n4. Some 1 ano\n5. Exemplo: DUM = 15/01/2026 → 15+7=22, jan-3=outubro, 2026 → DPP = 22/10/2026\n6. Alternativa: some 280 dias à DUM\n7. Se DUM incerta: USG do 1º trimestre (CRL) é o método mais preciso',
    interpretation: [
      'Parto a termo: 37-42 semanas',
      'Pré-termo: <37 semanas',
      'Pós-termo: >42 semanas',
      'A DPP é uma estimativa — apenas 5% dos partos ocorrem na data prevista',
      'USG do 1º trimestre tem margem de erro de ±5 dias',
    ],
    references: ['ACOG Practice Bulletin No. 700, 2017', 'Zugaib - Obstetrícia'],
    fields: [
      { name: 'dumDay', label: 'Dia da DUM', type: 'number', unit: '', min: 1, max: 31 },
      { name: 'dumMonth', label: 'Mês da DUM', type: 'number', unit: '', min: 1, max: 12 },
      { name: 'dumYear', label: 'Ano da DUM', type: 'number', unit: '', min: 2020, max: 2030 },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // PEDIATRIA
  // ═══════════════════════════════════════════════════════════
  {
    id: 'apgar', name: 'Escore de Apgar', category: 'ped', icon: '👶',
    description: 'Avalia a vitalidade do recém-nascido no 1º e 5º minuto de vida.',
    formula: 'A (Aparência/cor) + P (Pulso/FC) + G (Gesticulação/reflexos) + A (Atividade/tônus) + R (Respiração). Cada item: 0-2 pontos. Total: 0-10.',
    howToCalculate: '1. Aparência (cor): cianose central=0, extremidades cianóticas=1, rosado=2\n2. Pulso (FC): ausente=0, <100 bpm=1, ≥100 bpm=2\n3. Gesticulação (reflexos): sem resposta=0, careta=1, choro/tosse/espirro=2\n4. Atividade (tônus): flácido=0, alguma flexão=1, movimentos ativos=2\n5. Respiração: ausente=0, irregular/fraca=1, choro forte=2\n6. Avalie no 1º e 5º minuto. Se <7 no 5º min, repetir a cada 5 min até 20 min.',
    interpretation: [
      '7-10: RN em boas condições',
      '4-6: asfixia moderada — estimulação e VPP',
      '0-3: asfixia grave — reanimação neonatal imediata',
      'Apgar do 1º minuto: reflete necessidade de reanimação',
      'Apgar do 5º minuto: melhor preditor de prognóstico',
      'Apgar NÃO deve ser usado isoladamente para definir asfixia perinatal',
    ],
    references: ['Apgar V. Curr Res Anesth Analg 1953;32:260-7', 'AAP/AHA - Neonatal Resuscitation Program'],
    fields: [
      { name: 'appearance', label: 'Aparência (cor)', type: 'select', options: [{ value: '0', label: 'Cianose central (0)' }, { value: '1', label: 'Extremidades cianóticas (1)' }, { value: '2', label: 'Rosado (2)' }] },
      { name: 'pulse', label: 'Pulso (FC)', type: 'select', options: [{ value: '0', label: 'Ausente (0)' }, { value: '1', label: '<100 bpm (1)' }, { value: '2', label: '≥100 bpm (2)' }] },
      { name: 'grimace', label: 'Gesticulação (reflexos)', type: 'select', options: [{ value: '0', label: 'Sem resposta (0)' }, { value: '1', label: 'Careta (1)' }, { value: '2', label: 'Choro/tosse (2)' }] },
      { name: 'activity', label: 'Atividade (tônus)', type: 'select', options: [{ value: '0', label: 'Flácido (0)' }, { value: '1', label: 'Alguma flexão (1)' }, { value: '2', label: 'Movimentos ativos (2)' }] },
      { name: 'respiration', label: 'Respiração', type: 'select', options: [{ value: '0', label: 'Ausente (0)' }, { value: '1', label: 'Irregular/fraca (1)' }, { value: '2', label: 'Choro forte (2)' }] },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // INFECTOLOGIA
  // ═══════════════════════════════════════════════════════════
  {
    id: 'sofa', name: 'SOFA Score (Sepse)', category: 'infecto', icon: '🦠',
    description: 'Sequential Organ Failure Assessment. Avalia disfunção orgânica em pacientes críticos. Aumento ≥2 pontos = sepse.',
    formula: 'Soma de 6 sistemas (0-4 pts cada): Respiratório (PaO2/FiO2), Coagulação (plaquetas), Hepático (bilirrubina), Cardiovascular (PAM/vasopressores), Neurológico (Glasgow), Renal (creatinina/diurese). Total: 0-24.',
    howToCalculate: '1. Respiratório: PaO2/FiO2 ≥400=0, <400=1, <300=2, <200 com VM=3, <100 com VM=4\n2. Coagulação: Plaq ≥150=0, <150=1, <100=2, <50=3, <20=4\n3. Hepático: Bil <1.2=0, 1.2-1.9=1, 2.0-5.9=2, 6.0-11.9=3, ≥12=4\n4. Cardiovascular: PAM≥70=0, PAM<70=1, Dopa≤5=2, Dopa>5 ou Nora≤0.1=3, Dopa>15 ou Nora>0.1=4\n5. Neurológico: GCS 15=0, 13-14=1, 10-12=2, 6-9=3, <6=4\n6. Renal: Cr<1.2=0, 1.2-1.9=1, 2.0-3.4=2, 3.5-4.9=3, ≥5.0=4',
    interpretation: [
      'SOFA 0-1: mortalidade <10%',
      'SOFA 2-3: mortalidade ~10%',
      'SOFA 4-5: mortalidade ~15-20%',
      'SOFA 6-7: mortalidade ~20-25%',
      'SOFA ≥8: mortalidade >30%',
      'Aumento ≥2 pontos do basal = critério de SEPSE (Sepsis-3)',
      'qSOFA (triagem): PAS≤100 + FR≥22 + GCS<15 (≥2 = suspeita de sepse)',
    ],
    references: ['Singer M et al. JAMA 2016;315:801-10 (Sepsis-3)', 'Vincent JL et al. Intensive Care Med 1996;22:707-10'],
    fields: [
      { name: 'pao2fio2', label: 'PaO2/FiO2', type: 'number', unit: 'mmHg', min: 50, max: 600 },
      { name: 'platelets', label: 'Plaquetas', type: 'number', unit: '×10³/μL', min: 1, max: 500 },
      { name: 'bilirubin', label: 'Bilirrubina', type: 'number', unit: 'mg/dL', min: 0.1, max: 30 },
      { name: 'map', label: 'PAM', type: 'number', unit: 'mmHg', min: 30, max: 150 },
      { name: 'gcs', label: 'Glasgow', type: 'number', unit: '', min: 3, max: 15 },
      { name: 'creatinine', label: 'Creatinina', type: 'number', unit: 'mg/dL', min: 0.1, max: 15 },
    ],
  },
];

import { NEW_CALCULATORS } from './expandedCalculators';

// Merge all calculators: original 13 + 27 new = 40 total
export const ALL_CALCULATORS: MedicalCalculator[] = [...EXPANDED_CALCULATORS, ...NEW_CALCULATORS];
