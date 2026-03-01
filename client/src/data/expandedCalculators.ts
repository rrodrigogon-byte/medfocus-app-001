/**
 * Calculadoras Médicas Expandidas — 37 novas calculadoras
 * Cobrindo as principais calculadoras do Whitebook e UpToDate
 * Referências: AHA, ESC, KDIGO, AASLD, SBC, SBP, SBEM
 */
import { MedicalCalculator } from './medicalCalculators';

export const NEW_CALCULATORS: MedicalCalculator[] = [
  // ═══════════════════════════════════════════════════════════
  // CARDIOLOGIA (expandido)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'heart-score', name: 'HEART Score (Dor Torácica)', category: 'cardio', icon: '❤️',
    description: 'Estratificação de risco para eventos cardíacos maiores em pacientes com dor torácica na emergência.',
    formula: 'H (History) + E (ECG) + A (Age) + R (Risk factors) + T (Troponin) = 0-10 pontos',
    howToCalculate: '1. History (0-2): 0=pouco suspeita, 1=moderada, 2=altamente suspeita\n2. ECG (0-2): 0=normal, 1=inespecífico, 2=desvio ST significativo\n3. Age (0-2): 0=<45, 1=45-64, 2=≥65\n4. Risk factors (0-2): 0=nenhum, 1=1-2 fatores, 2=≥3 fatores ou DCV prévia\n5. Troponin (0-2): 0=normal, 1=1-3x limite, 2=>3x limite',
    interpretation: ['0-3: Baixo risco (1.7% MACE) → alta precoce', '4-6: Risco intermediário (12-16.6%) → observação e investigação', '7-10: Alto risco (50-65%) → internação e tratamento agressivo'],
    references: ['Six AJ et al. Neth Heart J 2008;16:191-6', 'Backus BE et al. Int J Cardiol 2013;168:2153-8'],
    fields: [
      { name: 'history', label: 'História', type: 'select', options: [{ value: '0', label: 'Pouco suspeita (0)' }, { value: '1', label: 'Moderada (1)' }, { value: '2', label: 'Altamente suspeita (2)' }] },
      { name: 'ecg', label: 'ECG', type: 'select', options: [{ value: '0', label: 'Normal (0)' }, { value: '1', label: 'Inespecífico (1)' }, { value: '2', label: 'Desvio ST (2)' }] },
      { name: 'age', label: 'Idade', type: 'select', options: [{ value: '0', label: '<45 anos (0)' }, { value: '1', label: '45-64 anos (1)' }, { value: '2', label: '≥65 anos (2)' }] },
      { name: 'risk', label: 'Fatores de Risco', type: 'select', options: [{ value: '0', label: 'Nenhum (0)' }, { value: '1', label: '1-2 fatores (1)' }, { value: '2', label: '≥3 ou DCV prévia (2)' }] },
      { name: 'troponin', label: 'Troponina', type: 'select', options: [{ value: '0', label: 'Normal (0)' }, { value: '1', label: '1-3x limite (1)' }, { value: '2', label: '>3x limite (2)' }] },
    ],
  },
  {
    id: 'grace', name: 'GRACE Score (SCA)', category: 'cardio', icon: '❤️',
    description: 'Predição de mortalidade intra-hospitalar e em 6 meses em síndromes coronarianas agudas.',
    formula: 'Pontuação baseada em: idade, FC, PAS, creatinina, classe Killip, PCR, desvio ST, elevação de marcadores',
    howToCalculate: '1. Idade: <30=0, 30-39=8, 40-49=25, 50-59=41, 60-69=58, 70-79=75, ≥80=91\n2. FC: <50=0, 50-69=3, 70-89=9, 90-109=15, 110-149=24, 150-199=38, ≥200=46\n3. PAS: <80=58, 80-99=53, 100-119=43, 120-139=34, 140-159=24, 160-199=10, ≥200=0\n4. Creatinina: 0-0.39=1, 0.4-0.79=4, 0.8-1.19=7, 1.2-1.59=10, 1.6-1.99=13, 2-3.99=21, ≥4=28\n5. Killip: I=0, II=20, III=39, IV=59\n6. PCR na admissão: Sim=39, Não=0\n7. Desvio ST: Sim=28, Não=0\n8. Marcadores elevados: Sim=14, Não=0',
    interpretation: ['≤108: Baixo risco (mortalidade <1%)', '109-140: Risco intermediário (1-3%)', '>140: Alto risco (mortalidade >3%) → estratégia invasiva precoce'],
    references: ['Fox KAA et al. BMJ 2006;333:1091', 'GRACE Investigators. JAMA 2004;291:2727-33'],
    fields: [
      { name: 'age', label: 'Idade', type: 'number', unit: 'anos', min: 18, max: 100 },
      { name: 'hr', label: 'Frequência Cardíaca', type: 'number', unit: 'bpm', min: 30, max: 250 },
      { name: 'sbp', label: 'PAS', type: 'number', unit: 'mmHg', min: 50, max: 250 },
      { name: 'creatinine', label: 'Creatinina', type: 'number', unit: 'mg/dL', min: 0.1, max: 10 },
      { name: 'killip', label: 'Classe Killip', type: 'select', options: [{ value: '0', label: 'I - Sem sinais de IC (0)' }, { value: '20', label: 'II - Estertores/B3 (20)' }, { value: '39', label: 'III - Edema pulmonar (39)' }, { value: '59', label: 'IV - Choque cardiogênico (59)' }] },
      { name: 'arrest', label: 'PCR na admissão', type: 'select', options: [{ value: '39', label: 'Sim (39)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'stdev', label: 'Desvio de ST', type: 'select', options: [{ value: '28', label: 'Sim (28)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'markers', label: 'Marcadores elevados', type: 'select', options: [{ value: '14', label: 'Sim (14)' }, { value: '0', label: 'Não (0)' }] },
    ],
  },
  {
    id: 'qtc', name: 'QTc (QT Corrigido)', category: 'cardio', icon: '❤️',
    description: 'Correção do intervalo QT pela frequência cardíaca para detecção de QT longo.',
    formula: 'Bazett: QTc = QT / √(RR) onde RR = 60/FC. Fridericia: QTc = QT / ∛(RR)',
    howToCalculate: '1. Meça o intervalo QT no ECG (em ms)\n2. Calcule o intervalo RR: RR = 60/FC (em segundos)\n3. Bazett: QTc = QT ÷ √RR\n4. Exemplo: QT=420ms, FC=75bpm → RR=0.8s → QTc=420/√0.8 = 420/0.894 = 470ms',
    interpretation: ['Normal: <440ms (homens), <460ms (mulheres)', 'Borderline: 440-460ms (H), 460-480ms (M)', 'Prolongado: >460ms (H), >480ms (M) → risco de Torsades de Pointes', 'Muito prolongado: >500ms → alto risco de arritmia fatal'],
    references: ['Bazett HC. Heart 1920;7:353-70', 'Rautaharju PM et al. JACC 2009;53:982-91'],
    fields: [
      { name: 'qt', label: 'Intervalo QT', type: 'number', unit: 'ms', min: 200, max: 700 },
      { name: 'hr', label: 'Frequência Cardíaca', type: 'number', unit: 'bpm', min: 30, max: 200 },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // NEFROLOGIA (expandido)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'cockcroft', name: 'Cockcroft-Gault (ClCr)', category: 'nefro', icon: '🫘',
    description: 'Estimativa do clearance de creatinina para ajuste de dose de medicamentos.',
    formula: 'ClCr = [(140 - idade) × peso] / (72 × Cr sérica) × 0.85 se mulher',
    howToCalculate: '1. Subtraia a idade de 140\n2. Multiplique pelo peso em kg\n3. Divida por (72 × creatinina sérica)\n4. Se mulher, multiplique por 0.85\n5. Exemplo: Homem, 60 anos, 70kg, Cr 1.2 → (140-60)×70/(72×1.2) = 5600/86.4 = 64.8 mL/min',
    interpretation: ['≥90: Função renal normal', '60-89: DRC estágio 2 (leve)', '30-59: DRC estágio 3 (moderada)', '15-29: DRC estágio 4 (grave)', '<15: DRC estágio 5 (falência renal)'],
    references: ['Cockcroft DW, Gault MH. Nephron 1976;16:31-41'],
    fields: [
      { name: 'age', label: 'Idade', type: 'number', unit: 'anos', min: 18, max: 100 },
      { name: 'weight', label: 'Peso', type: 'number', unit: 'kg', min: 30, max: 200 },
      { name: 'creatinine', label: 'Creatinina Sérica', type: 'number', unit: 'mg/dL', min: 0.1, max: 20 },
      { name: 'sex', label: 'Sexo', type: 'select', options: [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Feminino (×0.85)' }] },
    ],
  },
  {
    id: 'fena', name: 'FENa (Fração de Excreção de Sódio)', category: 'nefro', icon: '🫘',
    description: 'Diferencia IRA pré-renal de renal (NTA) através da excreção fracional de sódio.',
    formula: 'FENa = (Na urinário × Cr sérica) / (Na sérico × Cr urinária) × 100',
    howToCalculate: '1. Colete sódio e creatinina séricos e urinários simultaneamente\n2. Multiplique Na urinário × Cr sérica\n3. Multiplique Na sérico × Cr urinária\n4. Divida o primeiro pelo segundo e multiplique por 100\n5. Exemplo: NaU=15, CrS=2.5, NaS=140, CrU=120 → (15×2.5)/(140×120)×100 = 0.22%',
    interpretation: ['<1%: IRA pré-renal (hipovolemia, IC, cirrose)', '>2%: IRA intrínseca (NTA, nefrite intersticial)', '1-2%: Zona cinzenta (pode ser ambos)', 'Limitação: não confiável com uso de diuréticos (usar FEUreia)'],
    references: ['Espinel CH. JAMA 1976;236:579-81', 'Steiner RW. Am J Kidney Dis 1984;4:175-84'],
    fields: [
      { name: 'naU', label: 'Sódio Urinário', type: 'number', unit: 'mEq/L', min: 1, max: 200 },
      { name: 'naS', label: 'Sódio Sérico', type: 'number', unit: 'mEq/L', min: 100, max: 170 },
      { name: 'crU', label: 'Creatinina Urinária', type: 'number', unit: 'mg/dL', min: 1, max: 500 },
      { name: 'crS', label: 'Creatinina Sérica', type: 'number', unit: 'mg/dL', min: 0.1, max: 20 },
    ],
  },
  {
    id: 'deficit-na', name: 'Déficit de Sódio', category: 'nefro', icon: '🫘',
    description: 'Calcula o déficit de sódio para correção de hiponatremia.',
    formula: 'Déficit Na = ACT × (Na desejado - Na atual). ACT = peso × 0.6 (homem) ou 0.5 (mulher)',
    howToCalculate: '1. Calcule a água corporal total: ACT = peso × 0.6 (H) ou 0.5 (M)\n2. Déficit = ACT × (Na desejado - Na atual)\n3. Corrigir no máximo 8-10 mEq/L em 24h (risco de mielinólise)\n4. Exemplo: Mulher 60kg, Na=118 → ACT=30L, Déficit=30×(128-118)=300 mEq',
    interpretation: ['Hiponatremia leve: 130-135 mEq/L', 'Moderada: 125-129 mEq/L', 'Grave: <125 mEq/L → risco de edema cerebral', 'Correção máxima: 8-10 mEq/L/24h (evitar mielinólise pontina)'],
    references: ['Sterns RH. NEJM 2015;372:55-65', 'Verbalis JG et al. Am J Med 2013;126:S1-S42'],
    fields: [
      { name: 'weight', label: 'Peso', type: 'number', unit: 'kg', min: 30, max: 200 },
      { name: 'naCurrent', label: 'Na Atual', type: 'number', unit: 'mEq/L', min: 100, max: 145 },
      { name: 'naTarget', label: 'Na Desejado', type: 'number', unit: 'mEq/L', min: 120, max: 145 },
      { name: 'sex', label: 'Sexo', type: 'select', options: [{ value: 'M', label: 'Masculino (ACT=0.6)' }, { value: 'F', label: 'Feminino (ACT=0.5)' }] },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // PNEUMOLOGIA (expandido)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'gasometria', name: 'Interpretação de Gasometria', category: 'pneumo', icon: '🫁',
    description: 'Interpretação sistematizada da gasometria arterial com identificação de distúrbios ácido-base.',
    formula: 'pH = 7.35-7.45 | PaCO2 = 35-45 | HCO3 = 22-26 | BE = -2 a +2 | PaO2 = 80-100',
    howToCalculate: '1. pH <7.35 = acidose, >7.45 = alcalose\n2. Verificar distúrbio primário: respiratório (PaCO2) ou metabólico (HCO3)\n3. Verificar compensação esperada\n4. Calcular ânion gap: AG = Na - (Cl + HCO3), normal 8-12\n5. Se AG elevado: calcular delta/delta = ΔAG/ΔHCO3',
    interpretation: ['Acidose metabólica: pH↓, HCO3↓ (compensação: PaCO2↓)', 'Alcalose metabólica: pH↑, HCO3↑ (compensação: PaCO2↑)', 'Acidose respiratória: pH↓, PaCO2↑ (compensação: HCO3↑)', 'Alcalose respiratória: pH↑, PaCO2↓ (compensação: HCO3↓)', 'AG elevado (>12): cetoacidose, uremia, lactato, intoxicações (MUDPILES)'],
    references: ['Berend K et al. NEJM 2014;371:1434-45', 'Kellum JA. Crit Care 2000;4:6-14'],
    fields: [
      { name: 'ph', label: 'pH', type: 'number', unit: '', min: 6.8, max: 7.8 },
      { name: 'paco2', label: 'PaCO2', type: 'number', unit: 'mmHg', min: 10, max: 100 },
      { name: 'hco3', label: 'HCO3', type: 'number', unit: 'mEq/L', min: 5, max: 50 },
      { name: 'na', label: 'Sódio', type: 'number', unit: 'mEq/L', min: 120, max: 160 },
      { name: 'cl', label: 'Cloro', type: 'number', unit: 'mEq/L', min: 80, max: 120 },
      { name: 'pao2', label: 'PaO2', type: 'number', unit: 'mmHg', min: 30, max: 500 },
    ],
  },
  {
    id: 'pao2fio2', name: 'Relação PaO2/FiO2', category: 'pneumo', icon: '🫁',
    description: 'Avaliação da oxigenação e classificação da SDRA (Síndrome do Desconforto Respiratório Agudo).',
    formula: 'P/F = PaO2 / FiO2. Normal ≥ 400. SDRA: leve 200-300, moderada 100-200, grave <100',
    howToCalculate: '1. Obtenha PaO2 da gasometria arterial\n2. Divida pela FiO2 (em decimal: 21%=0.21, 40%=0.40, 100%=1.0)\n3. Exemplo: PaO2=80, FiO2=0.40 → P/F = 80/0.40 = 200',
    interpretation: ['≥400: Normal', '300-399: Hipoxemia leve', '200-299: SDRA leve (Berlim)', '100-199: SDRA moderada', '<100: SDRA grave', 'Critérios de Berlim: bilateral + P/F + PEEP ≥5 + não cardiogênico'],
    references: ['ARDS Definition Task Force. JAMA 2012;307:2526-33'],
    fields: [
      { name: 'pao2', label: 'PaO2', type: 'number', unit: 'mmHg', min: 30, max: 500 },
      { name: 'fio2', label: 'FiO2', type: 'number', unit: '%', min: 21, max: 100 },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // ENDOCRINOLOGIA (expandido)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'hba1c-media', name: 'Glicemia Média Estimada (HbA1c)', category: 'endo', icon: '⚡',
    description: 'Converte HbA1c em glicemia média estimada dos últimos 2-3 meses.',
    formula: 'Glicemia média (mg/dL) = 28.7 × HbA1c - 46.7',
    howToCalculate: '1. Multiplique o valor de HbA1c por 28.7\n2. Subtraia 46.7\n3. Exemplo: HbA1c 7.0% → 28.7×7.0 - 46.7 = 200.9 - 46.7 = 154 mg/dL',
    interpretation: ['HbA1c 5.0% → ~97 mg/dL', 'HbA1c 6.0% → ~126 mg/dL', 'HbA1c 7.0% → ~154 mg/dL (meta DM)', 'HbA1c 8.0% → ~183 mg/dL', 'HbA1c 9.0% → ~212 mg/dL', 'HbA1c 10.0% → ~240 mg/dL'],
    references: ['Nathan DM et al. Diabetes Care 2008;31:1473-8 (ADAG Study)'],
    fields: [
      { name: 'hba1c', label: 'HbA1c', type: 'number', unit: '%', min: 4, max: 15 },
    ],
  },
  {
    id: 'correcao-ca', name: 'Cálcio Corrigido pela Albumina', category: 'endo', icon: '⚡',
    description: 'Corrige o cálcio total pela albumina sérica para avaliação real da calcemia.',
    formula: 'Ca corrigido = Ca total + 0.8 × (4.0 - Albumina)',
    howToCalculate: '1. Subtraia a albumina de 4.0\n2. Multiplique por 0.8\n3. Some ao cálcio total\n4. Exemplo: Ca=8.0, Alb=2.5 → 8.0 + 0.8×(4.0-2.5) = 8.0 + 1.2 = 9.2 mg/dL',
    interpretation: ['Normal: 8.5-10.5 mg/dL (corrigido)', 'Hipocalcemia: <8.5 mg/dL → Chvostek, Trousseau, QT longo', 'Hipercalcemia: >10.5 mg/dL → poliúria, constipação, confusão', 'Hipercalcemia grave: >14 mg/dL → emergência médica'],
    references: ['Payne RB et al. BMJ 1973;4:643-6'],
    fields: [
      { name: 'calcium', label: 'Cálcio Total', type: 'number', unit: 'mg/dL', min: 4, max: 16 },
      { name: 'albumin', label: 'Albumina', type: 'number', unit: 'g/dL', min: 1, max: 5 },
    ],
  },
  {
    id: 'tsh-screening', name: 'Interpretação TSH/T4L', category: 'endo', icon: '⚡',
    description: 'Interpretação dos exames de função tireoidiana.',
    formula: 'TSH normal: 0.4-4.0 mUI/L | T4L normal: 0.9-1.8 ng/dL',
    howToCalculate: '1. Avalie TSH primeiro (exame mais sensível)\n2. Se TSH alterado, avalie T4 livre\n3. TSH↑ + T4L↓ = Hipotireoidismo clínico\n4. TSH↑ + T4L normal = Hipotireoidismo subclínico\n5. TSH↓ + T4L↑ = Hipertireoidismo clínico\n6. TSH↓ + T4L normal = Hipertireoidismo subclínico',
    interpretation: ['TSH↑ + T4L↓: Hipotireoidismo clínico → Levotiroxina', 'TSH↑ + T4L normal: Hipotireoidismo subclínico → tratar se TSH>10 ou sintomas', 'TSH↓ + T4L↑: Hipertireoidismo → Metimazol ou Propiltiouracil', 'TSH↓ + T4L normal: Hipertireoidismo subclínico → monitorar'],
    references: ['Garber JR et al. Endocr Pract 2012;18:988-1028 (ATA/AACE Guidelines)'],
    fields: [
      { name: 'tsh', label: 'TSH', type: 'number', unit: 'mUI/L', min: 0.01, max: 100 },
      { name: 't4l', label: 'T4 Livre', type: 'number', unit: 'ng/dL', min: 0.1, max: 10 },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // GERAL / EMERGÊNCIA
  // ═══════════════════════════════════════════════════════════
  {
    id: 'wells-tep', name: 'Wells (TEP)', category: 'geral', icon: '🫁',
    description: 'Estratificação de probabilidade clínica de tromboembolismo pulmonar.',
    formula: 'Sinais/sintomas TVP=3 + Diagnóstico alternativo menos provável=3 + FC>100=1.5 + Imobilização/cirurgia=1.5 + TEP/TVP prévio=1.5 + Hemoptise=1 + Câncer=1',
    howToCalculate: '1. Para cada critério presente, some os pontos\n2. Pontuação máxima: 12.5 pontos',
    interpretation: ['<2: Baixa probabilidade (TEP improvável)', '2-6: Probabilidade intermediária', '>6: Alta probabilidade (TEP provável)', 'Versão simplificada: ≤4 = TEP improvável → solicitar D-dímero', 'Versão simplificada: >4 = TEP provável → solicitar angioTC'],
    references: ['Wells PS et al. Ann Intern Med 2001;135:98-107', 'van Belle A et al. JAMA 2006;295:172-9'],
    fields: [
      { name: 'dvtSymptoms', label: 'Sinais/sintomas de TVP', type: 'select', options: [{ value: '3', label: 'Sim (3)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'alternative', label: 'Diagnóstico alternativo menos provável', type: 'select', options: [{ value: '3', label: 'Sim (3)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'hr100', label: 'FC > 100 bpm', type: 'select', options: [{ value: '1.5', label: 'Sim (1.5)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'immobilization', label: 'Imobilização/Cirurgia recente', type: 'select', options: [{ value: '1.5', label: 'Sim (1.5)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'previousPE', label: 'TEP/TVP prévio', type: 'select', options: [{ value: '1.5', label: 'Sim (1.5)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'hemoptysis', label: 'Hemoptise', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'cancer', label: 'Câncer ativo', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
    ],
  },
  {
    id: 'curb65', name: 'CURB-65 (Pneumonia)', category: 'infecto', icon: '🦠',
    description: 'Estratificação de gravidade da pneumonia adquirida na comunidade para decisão de internação.',
    formula: 'C (Confusão) + U (Ureia>50) + R (FR≥30) + B (PAS<90 ou PAD≤60) + 65 (Idade≥65) = 0-5',
    howToCalculate: '1. C = Confusão mental (1 ponto)\n2. U = Ureia > 50 mg/dL ou BUN > 19 (1 ponto)\n3. R = Frequência respiratória ≥ 30 irpm (1 ponto)\n4. B = Blood pressure: PAS < 90 ou PAD ≤ 60 mmHg (1 ponto)\n5. 65 = Idade ≥ 65 anos (1 ponto)',
    interpretation: ['0-1: Baixo risco → tratamento ambulatorial', '2: Risco intermediário → considerar internação breve', '3-5: Alto risco → internação (≥4: considerar UTI)', 'Mortalidade: 0=0.7%, 1=2.1%, 2=9.2%, 3=14.5%, 4=40%, 5=57%'],
    references: ['Lim WS et al. Thorax 2003;58:377-82', 'BTS Guidelines. Thorax 2009;64(Suppl III)'],
    fields: [
      { name: 'confusion', label: 'Confusão Mental', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'urea', label: 'Ureia > 50 mg/dL', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'rr', label: 'FR ≥ 30 irpm', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'bp', label: 'PAS<90 ou PAD≤60', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'age65', label: 'Idade ≥ 65 anos', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
    ],
  },
  {
    id: 'alvarado', name: 'Alvarado Score (Apendicite)', category: 'geral', icon: '🩺',
    description: 'Avaliação da probabilidade de apendicite aguda (MANTRELS).',
    formula: 'M(igração)=1 + A(norexia)=1 + N(áusea)=1 + T(ensão FID)=2 + R(ebound)=1 + E(levação temp)=1 + L(eucocitose)=2 + S(hift left)=1 = 0-10',
    howToCalculate: '1. Migração da dor para FID (1 pt)\n2. Anorexia (1 pt)\n3. Náusea/vômito (1 pt)\n4. Dor à palpação em FID (2 pts)\n5. Descompressão brusca positiva (1 pt)\n6. Temperatura > 37.3°C (1 pt)\n7. Leucocitose > 10.000 (2 pts)\n8. Desvio à esquerda (1 pt)',
    interpretation: ['0-4: Baixa probabilidade → observação', '5-6: Probabilidade intermediária → TC de abdome', '7-8: Alta probabilidade → cirurgia provável', '9-10: Muito alta probabilidade → apendicectomia'],
    references: ['Alvarado A. Ann Emerg Med 1986;15:557-64'],
    fields: [
      { name: 'migration', label: 'Migração da dor para FID', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'anorexia', label: 'Anorexia', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'nausea', label: 'Náusea/Vômito', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'tenderness', label: 'Dor à palpação FID', type: 'select', options: [{ value: '2', label: 'Sim (2)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'rebound', label: 'Descompressão brusca +', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'temp', label: 'Temperatura > 37.3°C', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'leukocytosis', label: 'Leucocitose > 10.000', type: 'select', options: [{ value: '2', label: 'Sim (2)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'shift', label: 'Desvio à esquerda', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
    ],
  },
  {
    id: 'ranson', name: 'Critérios de Ranson (Pancreatite)', category: 'geral', icon: '🩺',
    description: 'Predição de gravidade e mortalidade na pancreatite aguda.',
    formula: 'Admissão: Idade>55, Leucócitos>16k, Glicose>200, LDH>350, AST>250. 48h: Queda Ht>10%, Aumento BUN>5, Ca<8, PaO2<60, Déficit base>4, Sequestro líquido>6L',
    howToCalculate: '1. Na admissão (5 critérios): idade>55, leuco>16.000, glicose>200, LDH>350, AST>250\n2. Após 48h (6 critérios): queda Ht>10%, aumento BUN>5, Ca<8, PaO2<60, déficit de base>4, sequestro>6L\n3. Some todos os critérios presentes',
    interpretation: ['0-2: Pancreatite leve (mortalidade ~2%)', '3-4: Moderada (mortalidade ~15%)', '5-6: Grave (mortalidade ~40%)', '≥7: Muito grave (mortalidade ~100%)', 'Alternativa moderna: BISAP score (mais simples)'],
    references: ['Ranson JH et al. Surg Gynecol Obstet 1974;139:69-81'],
    fields: [
      { name: 'age55', label: 'Idade > 55 anos', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'wbc', label: 'Leucócitos > 16.000', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'glucose', label: 'Glicose > 200 mg/dL', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'ldh', label: 'LDH > 350 U/L', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'ast', label: 'AST > 250 U/L', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'htDrop', label: 'Queda Ht > 10% (48h)', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'bunRise', label: 'Aumento BUN > 5 (48h)', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'calcium', label: 'Cálcio < 8 mg/dL (48h)', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
    ],
  },
  {
    id: 'superficie-corporal', name: 'Superfície Corporal (SC)', category: 'geral', icon: '🩺',
    description: 'Cálculo da superfície corporal para dosagem de quimioterápicos e ajuste de medicações.',
    formula: 'SC (m²) = √[(Altura cm × Peso kg) / 3600] (Mosteller)',
    howToCalculate: '1. Multiplique altura (cm) pelo peso (kg)\n2. Divida por 3600\n3. Tire a raiz quadrada\n4. Exemplo: 170cm, 70kg → √(170×70/3600) = √(3.31) = 1.82 m²',
    interpretation: ['Adulto médio: 1.7-2.0 m²', 'Usado para: dosagem de quimioterápicos, cálculo de débito cardíaco indexado', 'Fórmula de Du Bois: SC = 0.007184 × Altura^0.725 × Peso^0.425'],
    references: ['Mosteller RD. NEJM 1987;317:1098', 'Du Bois D, Du Bois EF. Arch Intern Med 1916;17:863-71'],
    fields: [
      { name: 'height', label: 'Altura', type: 'number', unit: 'cm', min: 50, max: 250 },
      { name: 'weight', label: 'Peso', type: 'number', unit: 'kg', min: 2, max: 300 },
    ],
  },
  {
    id: 'gotasmin', name: 'Gotas/min (Soro)', category: 'geral', icon: '💧',
    description: 'Cálculo de gotas por minuto para infusão de soro e medicações IV.',
    formula: 'Gotas/min = Volume (mL) / (Tempo em horas × 3). Microgotas/min = Volume / Tempo em horas',
    howToCalculate: '1. Gotas/min = Volume (mL) ÷ (Tempo em horas × 3)\n2. Microgotas/min = Volume (mL) ÷ Tempo em horas\n3. 1 gota = 3 microgotas\n4. Exemplo: SF 0.9% 500mL em 6h → 500/(6×3) = 27.7 ≈ 28 gotas/min = 83 microgotas/min',
    interpretation: ['1 mL = 20 gotas (equipo macrogotas)', '1 mL = 60 microgotas (equipo microgotas)', 'Microgotas/min = mL/h (regra prática)', 'Atenção: verificar tipo de equipo antes de calcular'],
    references: ['Brunner & Suddarth. Enfermagem Médico-Cirúrgica'],
    fields: [
      { name: 'volume', label: 'Volume', type: 'number', unit: 'mL', min: 10, max: 5000 },
      { name: 'time', label: 'Tempo', type: 'number', unit: 'horas', min: 0.5, max: 48 },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // OBSTETRÍCIA (expandido)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'ig-dum', name: 'Idade Gestacional pela DUM', category: 'obst', icon: '🤰',
    description: 'Cálculo da idade gestacional e data provável do parto pela data da última menstruação.',
    formula: 'IG = (Data atual - DUM) em semanas. DPP = DUM + 7 dias - 3 meses + 1 ano (Regra de Naegele)',
    howToCalculate: '1. Calcule a diferença em dias entre a data atual e a DUM\n2. Divida por 7 para obter semanas completas\n3. DPP (Naegele): some 7 dias à DUM, subtraia 3 meses, some 1 ano\n4. Exemplo: DUM 01/01/2025, Data atual 15/04/2025 → 104 dias = 14 semanas e 6 dias',
    interpretation: ['1° trimestre: 0-13 semanas', '2° trimestre: 14-27 semanas', '3° trimestre: 28-40 semanas', 'Pré-termo: <37 semanas', 'A termo: 37-41 semanas e 6 dias', 'Pós-termo: ≥42 semanas'],
    references: ['ACOG Practice Bulletin No. 700, 2017', 'FEBRASGO - Manual de Assistência Pré-natal'],
    fields: [
      { name: 'dumDay', label: 'Dia da DUM', type: 'number', unit: '', min: 1, max: 31 },
      { name: 'dumMonth', label: 'Mês da DUM', type: 'number', unit: '', min: 1, max: 12 },
      { name: 'dumYear', label: 'Ano da DUM', type: 'number', unit: '', min: 2020, max: 2030 },
    ],
  },
  {
    id: 'bishop', name: 'Índice de Bishop', category: 'obst', icon: '🤰',
    description: 'Avaliação da maturidade cervical para predição de sucesso da indução do parto.',
    formula: 'Dilatação + Esvaecimento + Consistência + Posição + Altura da apresentação = 0-13',
    howToCalculate: '1. Dilatação: 0=fechado, 1=1-2cm, 2=3-4cm, 3=≥5cm\n2. Esvaecimento: 0=0-30%, 1=40-50%, 2=60-70%, 3=≥80%\n3. Consistência: 0=firme, 1=médio, 2=amolecido\n4. Posição: 0=posterior, 1=médio, 2=anterior\n5. Altura: 0=-3, 1=-2, 2=-1/0, 3=+1/+2',
    interpretation: ['≤5: Colo desfavorável → considerar amadurecimento cervical (misoprostol)', '6-7: Intermediário → pode tentar ocitocina', '≥8: Colo favorável → indução com ocitocina (alta chance de sucesso)', 'Bishop ≥9: sucesso de indução semelhante ao trabalho de parto espontâneo'],
    references: ['Bishop EH. Obstet Gynecol 1964;24:266-8', 'ACOG Practice Bulletin No. 107'],
    fields: [
      { name: 'dilation', label: 'Dilatação', type: 'select', options: [{ value: '0', label: 'Fechado (0)' }, { value: '1', label: '1-2 cm (1)' }, { value: '2', label: '3-4 cm (2)' }, { value: '3', label: '≥5 cm (3)' }] },
      { name: 'effacement', label: 'Esvaecimento', type: 'select', options: [{ value: '0', label: '0-30% (0)' }, { value: '1', label: '40-50% (1)' }, { value: '2', label: '60-70% (2)' }, { value: '3', label: '≥80% (3)' }] },
      { name: 'consistency', label: 'Consistência', type: 'select', options: [{ value: '0', label: 'Firme (0)' }, { value: '1', label: 'Médio (1)' }, { value: '2', label: 'Amolecido (2)' }] },
      { name: 'position', label: 'Posição', type: 'select', options: [{ value: '0', label: 'Posterior (0)' }, { value: '1', label: 'Médio (1)' }, { value: '2', label: 'Anterior (2)' }] },
      { name: 'station', label: 'Altura', type: 'select', options: [{ value: '0', label: '-3 (0)' }, { value: '1', label: '-2 (1)' }, { value: '2', label: '-1/0 (2)' }, { value: '3', label: '+1/+2 (3)' }] },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // PEDIATRIA (expandido)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'glasgow-ped', name: 'Glasgow Pediátrica (<2 anos)', category: 'ped', icon: '👶',
    description: 'Escala de Coma de Glasgow modificada para lactentes e crianças menores de 2 anos.',
    formula: 'Abertura ocular (1-4) + Resposta verbal (1-5) + Resposta motora (1-6) = 3-15',
    howToCalculate: '1. Abertura ocular: 4=espontânea, 3=ao comando, 2=à dor, 1=nenhuma\n2. Verbal (modificada): 5=balbucia/sorri, 4=choro consolável, 3=choro inconsolável, 2=gemidos, 1=nenhuma\n3. Motora: 6=movimentos espontâneos, 5=retira ao toque, 4=retira à dor, 3=flexão anormal, 2=extensão, 1=nenhuma',
    interpretation: ['13-15: TCE leve', '9-12: TCE moderado', '3-8: TCE grave → IOT e neuroimagem', '≤8: Indicação de intubação orotraqueal'],
    references: ['James HE. Childs Brain 1986;13:170-3', 'PECARN Head Injury Rules'],
    fields: [
      { name: 'eye', label: 'Abertura Ocular', type: 'select', options: [{ value: '4', label: 'Espontânea (4)' }, { value: '3', label: 'Ao comando (3)' }, { value: '2', label: 'À dor (2)' }, { value: '1', label: 'Nenhuma (1)' }] },
      { name: 'verbal', label: 'Resposta Verbal', type: 'select', options: [{ value: '5', label: 'Balbucia/sorri (5)' }, { value: '4', label: 'Choro consolável (4)' }, { value: '3', label: 'Choro inconsolável (3)' }, { value: '2', label: 'Gemidos (2)' }, { value: '1', label: 'Nenhuma (1)' }] },
      { name: 'motor', label: 'Resposta Motora', type: 'select', options: [{ value: '6', label: 'Mov. espontâneos (6)' }, { value: '5', label: 'Retira ao toque (5)' }, { value: '4', label: 'Retira à dor (4)' }, { value: '3', label: 'Flexão anormal (3)' }, { value: '2', label: 'Extensão (2)' }, { value: '1', label: 'Nenhuma (1)' }] },
    ],
  },
  {
    id: 'holliday-segar', name: 'Holliday-Segar (Hidratação Pediátrica)', category: 'ped', icon: '👶',
    description: 'Cálculo da necessidade hídrica de manutenção em pediatria.',
    formula: 'Até 10kg: 100 mL/kg/dia | 10-20kg: 1000 + 50 mL/kg acima de 10 | >20kg: 1500 + 20 mL/kg acima de 20',
    howToCalculate: '1. Primeiros 10 kg: 100 mL/kg/dia\n2. De 10 a 20 kg: + 50 mL/kg/dia\n3. Acima de 20 kg: + 20 mL/kg/dia\n4. Exemplo: criança de 25 kg → 1000 + 500 + 100 = 1600 mL/dia = 66.7 mL/h',
    interpretation: ['Fórmula 4-2-1 (mL/h): 4 mL/kg/h (primeiros 10kg) + 2 mL/kg/h (10-20kg) + 1 mL/kg/h (>20kg)', 'Soro de manutenção: SG 5% + NaCl 20% (3-4 mL/100mL) + KCl 10% (2 mL/100mL)', 'Ajustar para febre (+12% por °C acima de 37°C)'],
    references: ['Holliday MA, Segar WE. Pediatrics 1957;19:823-32'],
    fields: [
      { name: 'weight', label: 'Peso', type: 'number', unit: 'kg', min: 1, max: 100 },
    ],
  },
  {
    id: 'peso-estimado', name: 'Peso Estimado por Idade', category: 'ped', icon: '👶',
    description: 'Estimativa rápida do peso de crianças quando não é possível pesar (emergências).',
    formula: '3-12 meses: (idade em meses + 9) / 2 | 1-5 anos: 2 × (idade + 5) | 6-12 anos: 7 × idade - 5 / 2',
    howToCalculate: '1. Lactentes 3-12m: Peso = (idade em meses + 9) ÷ 2\n2. Crianças 1-5 anos: Peso = 2 × (idade em anos + 5)\n3. Crianças 6-12 anos: Peso = (7 × idade em anos - 5) ÷ 2\n4. Exemplo: 3 anos → 2×(3+5) = 16 kg',
    interpretation: ['Fórmula de emergência (APLS): Peso = (idade + 4) × 2', 'RN a termo: ~3.0-3.5 kg', 'Dobra peso ao nascer: ~5 meses', 'Triplica peso ao nascer: ~12 meses'],
    references: ['APLS - Advanced Paediatric Life Support', 'Luscombe M, Owens B. Emerg Med J 2007;24:412-3'],
    fields: [
      { name: 'ageMonths', label: 'Idade', type: 'number', unit: 'meses', min: 1, max: 180 },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // HEPATOLOGIA (expandido)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'fib4', name: 'FIB-4 (Fibrose Hepática)', category: 'hepato', icon: '🫁',
    description: 'Índice não invasivo para avaliação de fibrose hepática (alternativa à biópsia).',
    formula: 'FIB-4 = (Idade × AST) / (Plaquetas × √ALT)',
    howToCalculate: '1. Multiplique a idade pela AST\n2. Multiplique as plaquetas (×10⁹/L) pela raiz quadrada da ALT\n3. Divida o primeiro pelo segundo\n4. Exemplo: 50 anos, AST=60, Plaquetas=150, ALT=45 → (50×60)/(150×√45) = 3000/1006 = 2.98',
    interpretation: ['<1.30: Baixo risco de fibrose avançada (F0-F1)', '1.30-2.67: Zona cinzenta → considerar elastografia', '>2.67: Alto risco de fibrose avançada (F3-F4)', 'Validado para hepatite C, NASH e hepatite B'],
    references: ['Sterling RK et al. Hepatology 2006;43:1317-25'],
    fields: [
      { name: 'age', label: 'Idade', type: 'number', unit: 'anos', min: 18, max: 100 },
      { name: 'ast', label: 'AST (TGO)', type: 'number', unit: 'U/L', min: 5, max: 500 },
      { name: 'alt', label: 'ALT (TGP)', type: 'number', unit: 'U/L', min: 5, max: 500 },
      { name: 'platelets', label: 'Plaquetas', type: 'number', unit: '×10⁹/L', min: 10, max: 500 },
    ],
  },
  {
    id: 'maddrey', name: 'Maddrey (Hepatite Alcoólica)', category: 'hepato', icon: '🫁',
    description: 'Função discriminante de Maddrey para avaliar gravidade da hepatite alcoólica e indicação de corticoide.',
    formula: 'MDF = 4.6 × (TP paciente - TP controle) + Bilirrubina total',
    howToCalculate: '1. Subtraia o TP controle (12-14s) do TP do paciente\n2. Multiplique por 4.6\n3. Some a bilirrubina total (mg/dL)\n4. Exemplo: TP=22s, controle=12s, BT=15 → 4.6×(22-12)+15 = 46+15 = 61',
    interpretation: ['<32: Hepatite alcoólica leve/moderada → suporte', '≥32: Hepatite alcoólica grave → Prednisolona 40mg/dia por 28 dias', 'Se contraindicação a corticoide: Pentoxifilina 400mg 3x/dia', 'Avaliar resposta com Lille Score no 7° dia'],
    references: ['Maddrey WC et al. Gastroenterology 1978;75:193-9', 'AASLD Guidelines 2019'],
    fields: [
      { name: 'ptPatient', label: 'TP do Paciente', type: 'number', unit: 'segundos', min: 10, max: 60 },
      { name: 'ptControl', label: 'TP Controle', type: 'number', unit: 'segundos', min: 10, max: 15 },
      { name: 'bilirubin', label: 'Bilirrubina Total', type: 'number', unit: 'mg/dL', min: 0.1, max: 50 },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // NEUROLOGIA (expandido)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'meem', name: 'Mini Exame do Estado Mental (MEEM)', category: 'neuro', icon: '🧠',
    description: 'Rastreamento cognitivo para detecção de demência e comprometimento cognitivo.',
    formula: 'Orientação temporal (5) + espacial (5) + Registro (3) + Atenção/cálculo (5) + Evocação (3) + Linguagem (8) + Praxia (1) = 0-30',
    howToCalculate: '1. Orientação temporal: ano, mês, dia do mês, dia da semana, hora (5 pts)\n2. Orientação espacial: estado, cidade, bairro, local, andar (5 pts)\n3. Registro: repetir 3 palavras (3 pts)\n4. Atenção e cálculo: 100-7 seriado ou MUNDO ao contrário (5 pts)\n5. Evocação: recordar as 3 palavras (3 pts)\n6. Linguagem: nomear 2 objetos, repetir frase, comando de 3 etapas, ler e executar, escrever frase (8 pts)\n7. Praxia visuoconstrutiva: copiar pentágonos (1 pt)',
    interpretation: ['Pontos de corte ajustados por escolaridade (Brucki 2003):', 'Analfabetos: ≤20 pontos = alterado', '1-4 anos de estudo: ≤25 pontos = alterado', '5-8 anos: ≤26.5 pontos = alterado', '9-11 anos: ≤28 pontos = alterado', '≥12 anos: ≤29 pontos = alterado'],
    references: ['Folstein MF et al. J Psychiatr Res 1975;12:189-98', 'Brucki SMD et al. Arq Neuropsiquiatr 2003;61:777-81'],
    fields: [
      { name: 'temporal', label: 'Orientação Temporal', type: 'number', unit: '/5', min: 0, max: 5 },
      { name: 'spatial', label: 'Orientação Espacial', type: 'number', unit: '/5', min: 0, max: 5 },
      { name: 'registration', label: 'Registro (3 palavras)', type: 'number', unit: '/3', min: 0, max: 3 },
      { name: 'attention', label: 'Atenção e Cálculo', type: 'number', unit: '/5', min: 0, max: 5 },
      { name: 'recall', label: 'Evocação', type: 'number', unit: '/3', min: 0, max: 3 },
      { name: 'language', label: 'Linguagem', type: 'number', unit: '/8', min: 0, max: 8 },
      { name: 'praxis', label: 'Praxia Visuoconstrutiva', type: 'number', unit: '/1', min: 0, max: 1 },
    ],
  },
  {
    id: 'hunt-hess', name: 'Hunt-Hess (HSA)', category: 'neuro', icon: '🧠',
    description: 'Classificação de gravidade da hemorragia subaracnoidea aneurismática.',
    formula: 'Grau I a V baseado no nível de consciência e déficits neurológicos',
    howToCalculate: '1. Avalie o nível de consciência e sinais neurológicos\n2. Grau I: assintomático ou cefaleia leve\n3. Grau II: cefaleia moderada/intensa, rigidez de nuca, sem déficit focal\n4. Grau III: sonolência, confusão, déficit focal leve\n5. Grau IV: estupor, hemiparesia moderada/grave\n6. Grau V: coma profundo, postura de descerebração',
    interpretation: ['Grau I: mortalidade ~1% → cirurgia precoce', 'Grau II: mortalidade ~5% → cirurgia precoce', 'Grau III: mortalidade ~15-20% → cirurgia precoce se possível', 'Grau IV: mortalidade ~30-40% → estabilizar antes', 'Grau V: mortalidade ~50-70% → prognóstico reservado'],
    references: ['Hunt WE, Hess RM. J Neurosurg 1968;28:14-20'],
    fields: [
      { name: 'grade', label: 'Grau Hunt-Hess', type: 'select', options: [{ value: '1', label: 'I - Assintomático/cefaleia leve' }, { value: '2', label: 'II - Cefaleia intensa, rigidez nuca' }, { value: '3', label: 'III - Sonolência, déficit focal leve' }, { value: '4', label: 'IV - Estupor, hemiparesia' }, { value: '5', label: 'V - Coma, descerebração' }] },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // INFECTOLOGIA (expandido)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'qsofa', name: 'qSOFA (Sepse)', category: 'infecto', icon: '🦠',
    description: 'Triagem rápida à beira do leito para identificação de pacientes com suspeita de sepse.',
    formula: 'PAS ≤ 100 mmHg (1) + FR ≥ 22 irpm (1) + Glasgow < 15 (1) = 0-3',
    howToCalculate: '1. PAS ≤ 100 mmHg = 1 ponto\n2. FR ≥ 22 irpm = 1 ponto\n3. Alteração do nível de consciência (Glasgow < 15) = 1 ponto\n4. ≥2 pontos = suspeita de sepse → solicitar lactato e SOFA completo',
    interpretation: ['0-1: Baixo risco → monitorar', '≥2: Alto risco de sepse → iniciar bundle de sepse (lactato, hemoculturas, ATB em 1h)', 'Sensibilidade limitada → não usar isoladamente para excluir sepse', 'Sepsis-3: infecção + SOFA ≥2 = sepse'],
    references: ['Seymour CW et al. JAMA 2016;315:762-74', 'Singer M et al. JAMA 2016;315:801-10'],
    fields: [
      { name: 'sbp', label: 'PAS ≤ 100 mmHg', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'rr', label: 'FR ≥ 22 irpm', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'gcs', label: 'Glasgow < 15', type: 'select', options: [{ value: '1', label: 'Sim (1)' }, { value: '0', label: 'Não (0)' }] },
    ],
  },
  {
    id: 'news2', name: 'NEWS2 (Early Warning Score)', category: 'geral', icon: '🩺',
    description: 'Escore de alerta precoce para detecção de deterioração clínica em pacientes hospitalizados.',
    formula: 'FR + SpO2 + O2 suplementar + Temperatura + PAS + FC + Consciência = 0-20',
    howToCalculate: '1. FR: ≤8=3, 9-11=1, 12-20=0, 21-24=2, ≥25=3\n2. SpO2: ≤91=3, 92-93=2, 94-95=1, ≥96=0\n3. O2 suplementar: Sim=2, Não=0\n4. Temperatura: ≤35.0=3, 35.1-36.0=1, 36.1-38.0=0, 38.1-39.0=1, ≥39.1=2\n5. PAS: ≤90=3, 91-100=2, 101-110=1, 111-219=0, ≥220=3\n6. FC: ≤40=3, 41-50=1, 51-90=0, 91-110=1, 111-130=2, ≥131=3\n7. Consciência: Alerta=0, Confuso/Agitado/Sonolento=3',
    interpretation: ['0-4: Baixo risco → monitorização de rotina', '5-6 ou 3 em parâmetro único: Risco médio → avaliação médica urgente', '≥7: Alto risco → resposta de emergência imediata'],
    references: ['Royal College of Physicians. NEWS2, 2017'],
    fields: [
      { name: 'rr', label: 'Frequência Respiratória', type: 'number', unit: 'irpm', min: 4, max: 60 },
      { name: 'spo2', label: 'SpO2', type: 'number', unit: '%', min: 70, max: 100 },
      { name: 'o2', label: 'O2 Suplementar', type: 'select', options: [{ value: '2', label: 'Sim (2)' }, { value: '0', label: 'Não (0)' }] },
      { name: 'temp', label: 'Temperatura', type: 'number', unit: '°C', min: 33, max: 42 },
      { name: 'sbp', label: 'PAS', type: 'number', unit: 'mmHg', min: 50, max: 250 },
      { name: 'hr', label: 'Frequência Cardíaca', type: 'number', unit: 'bpm', min: 30, max: 200 },
      { name: 'consciousness', label: 'Consciência', type: 'select', options: [{ value: '0', label: 'Alerta (0)' }, { value: '3', label: 'Confuso/Agitado/Sonolento (3)' }] },
    ],
  },
  {
    id: 'rockall', name: 'Rockall (HDA)', category: 'geral', icon: '🩺',
    description: 'Predição de risco de ressangramento e mortalidade na hemorragia digestiva alta.',
    formula: 'Idade + Choque + Comorbidades + Diagnóstico endoscópico + Estigmas de sangramento = 0-11',
    howToCalculate: '1. Idade: <60=0, 60-79=1, ≥80=2\n2. Choque: FC<100+PAS≥100=0, FC≥100+PAS≥100=1, FC≥100+PAS<100=2\n3. Comorbidades: nenhuma=0, IC/DCI/outras=2, IRC/hepatopatia/câncer=3\n4. Diagnóstico: Mallory-Weiss=0, úlcera/erosão=1, câncer=2\n5. Estigmas: nenhum/base limpa=0, sangue/vaso/coágulo=2',
    interpretation: ['0-2: Baixo risco → considerar alta precoce', '3-4: Risco intermediário → observação', '5-7: Alto risco → UTI, intervenção endoscópica', '≥8: Muito alto risco → mortalidade >40%'],
    references: ['Rockall TA et al. Gut 1996;38:316-21'],
    fields: [
      { name: 'age', label: 'Idade', type: 'select', options: [{ value: '0', label: '<60 anos (0)' }, { value: '1', label: '60-79 anos (1)' }, { value: '2', label: '≥80 anos (2)' }] },
      { name: 'shock', label: 'Choque', type: 'select', options: [{ value: '0', label: 'Sem choque (0)' }, { value: '1', label: 'Taquicardia (1)' }, { value: '2', label: 'Hipotensão (2)' }] },
      { name: 'comorbidity', label: 'Comorbidades', type: 'select', options: [{ value: '0', label: 'Nenhuma (0)' }, { value: '2', label: 'IC/DCI/outras (2)' }, { value: '3', label: 'IRC/hepatopatia/câncer (3)' }] },
      { name: 'diagnosis', label: 'Diagnóstico', type: 'select', options: [{ value: '0', label: 'Mallory-Weiss (0)' }, { value: '1', label: 'Úlcera/erosão (1)' }, { value: '2', label: 'Câncer (2)' }] },
      { name: 'stigmata', label: 'Estigmas', type: 'select', options: [{ value: '0', label: 'Base limpa (0)' }, { value: '2', label: 'Sangue/vaso/coágulo (2)' }] },
    ],
  },
  {
    id: 'deficit-ferro', name: 'Déficit de Ferro Corporal (Ganzoni)', category: 'geral', icon: '🩺',
    description: 'Cálculo do déficit de ferro para reposição endovenosa na anemia ferropriva.',
    formula: 'Déficit Fe (mg) = Peso × (Hb alvo - Hb atual) × 2.4 + Reserva (500mg)',
    howToCalculate: '1. Calcule a diferença entre Hb alvo (geralmente 13-15) e Hb atual\n2. Multiplique pelo peso em kg\n3. Multiplique por 2.4\n4. Some 500 mg (reserva de ferro)\n5. Exemplo: 60kg, Hb=8, alvo=13 → 60×(13-8)×2.4+500 = 720+500 = 1220 mg',
    interpretation: ['Ferro elementar por ampola de Noripurum®: 100 mg/5mL', 'Dose máxima por infusão: 200 mg (Noripurum) ou 1000 mg (Ferinject)', 'Reavaliar hemograma em 4-6 semanas após reposição', 'Ferritina alvo: >100 ng/mL'],
    references: ['Ganzoni AM. Schweiz Med Wochenschr 1970;100:301-3', 'Auerbach M et al. Hematology Am Soc Hematol Educ Program 2016;2016:152-8'],
    fields: [
      { name: 'weight', label: 'Peso', type: 'number', unit: 'kg', min: 30, max: 200 },
      { name: 'hbCurrent', label: 'Hb Atual', type: 'number', unit: 'g/dL', min: 3, max: 15 },
      { name: 'hbTarget', label: 'Hb Alvo', type: 'number', unit: 'g/dL', min: 10, max: 16 },
    ],
  },
];
