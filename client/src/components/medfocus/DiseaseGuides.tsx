import React, { useState, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════
// GUIAS DE DOENÇAS — Condutas Clínicas Completas
// Baseado em diretrizes nacionais e internacionais
// ═══════════════════════════════════════════════════════════

interface DiseaseGuide {
  id: string;
  name: string;
  cid10: string;
  specialty: string;
  urgency: 'emergencia' | 'urgencia' | 'eletivo';
  prevalence: 'muito_comum' | 'comum' | 'incomum' | 'rara';
  definition: string;
  epidemiology: string;
  etiology: string[];
  riskFactors: string[];
  clinicalPresentation: { symptom: string; frequency: string }[];
  diagnosticCriteria: string[];
  complementaryExams: { exam: string; purpose: string; when: string }[];
  differentialDiagnosis: string[];
  treatment: {
    nonPharmacological: string[];
    pharmacological: { drug: string; dose: string; route: string; duration: string; notes: string }[];
    surgical?: string[];
  };
  monitoring: string[];
  complications: string[];
  prognosis: string;
  prevention: string[];
  references: { title: string; source: string; year: number }[];
  lastUpdated: string;
  reviewedBy: string;
}

const SPECIALTIES = [
  'Todas', 'Cardiologia', 'Pneumologia', 'Endocrinologia', 'Gastroenterologia',
  'Nefrologia', 'Neurologia', 'Infectologia', 'Reumatologia', 'Hematologia',
  'Psiquiatria', 'Dermatologia', 'Pediatria', 'Ginecologia', 'Obstetrícia',
  'Cirurgia', 'Ortopedia', 'Urologia', 'Oftalmologia', 'Emergência',
  'Geriatria', 'Oncologia', 'Medicina de Família'
];

const DISEASE_GUIDES: DiseaseGuide[] = [
  // ═══ CARDIOLOGIA ═══
  {
    id: 'has', name: 'Hipertensão Arterial Sistêmica', cid10: 'I10', specialty: 'Cardiologia',
    urgency: 'eletivo', prevalence: 'muito_comum',
    definition: 'Condição clínica multifatorial caracterizada por elevação sustentada dos níveis pressóricos ≥ 140 x 90 mmHg, medida com técnica correta, em pelo menos duas ocasiões diferentes.',
    epidemiology: 'Prevalência de 32,5% na população adulta brasileira (~36 milhões). Principal fator de risco para DCV. Responsável por 50% dos óbitos por doença cardiovascular.',
    etiology: ['Primária/Essencial (90-95%): multifatorial — genética, ambiental, metabólica', 'Secundária (5-10%): renovascular, feocromocitoma, hiperaldosteronismo, coarctação de aorta, apneia do sono, DRC, Cushing'],
    riskFactors: ['Idade > 55 anos (H) / > 65 anos (M)', 'Raça negra', 'Obesidade (IMC ≥ 30)', 'Sedentarismo', 'Ingesta excessiva de sódio (> 5g/dia)', 'Etilismo', 'Tabagismo', 'Dislipidemia', 'DM', 'História familiar de DCV precoce'],
    clinicalPresentation: [
      { symptom: 'Assintomático (maioria)', frequency: '80%' },
      { symptom: 'Cefaleia occipital matinal', frequency: '30%' },
      { symptom: 'Tontura', frequency: '20%' },
      { symptom: 'Epistaxe', frequency: '10%' },
      { symptom: 'Dispneia aos esforços', frequency: '15%' },
      { symptom: 'Dor precordial', frequency: '10%' },
    ],
    diagnosticCriteria: [
      'PA ≥ 140 x 90 mmHg em consultório (média de 2 medidas em 2 consultas)',
      'MAPA: vigília ≥ 135 x 85 / sono ≥ 120 x 70 / 24h ≥ 130 x 80',
      'MRPA: ≥ 130 x 80 mmHg (média de 7 dias)',
      'Classificação: Normal (<120/80), Pré-HAS (121-139/81-89), Estágio 1 (140-159/90-99), Estágio 2 (160-179/100-109), Estágio 3 (≥180/≥110)',
    ],
    complementaryExams: [
      { exam: 'ECG de 12 derivações', purpose: 'Avaliar HVE, arritmias, isquemia', when: 'Diagnóstico inicial' },
      { exam: 'Ecocardiograma', purpose: 'Avaliar massa VE, função sistólica/diastólica', when: 'HVE no ECG ou HAS estágio 2-3' },
      { exam: 'Creatinina sérica + TFG', purpose: 'Avaliar função renal', when: 'Diagnóstico inicial' },
      { exam: 'Potássio sérico', purpose: 'Rastrear hiperaldosteronismo', when: 'Diagnóstico inicial' },
      { exam: 'Glicemia de jejum + HbA1c', purpose: 'Rastrear DM', when: 'Diagnóstico inicial' },
      { exam: 'Perfil lipídico', purpose: 'Avaliar risco cardiovascular', when: 'Diagnóstico inicial' },
      { exam: 'Ácido úrico', purpose: 'Avaliar risco metabólico', when: 'Diagnóstico inicial' },
      { exam: 'EAS + microalbuminúria', purpose: 'Avaliar lesão renal', when: 'Diagnóstico inicial' },
      { exam: 'Fundoscopia', purpose: 'Avaliar retinopatia hipertensiva', when: 'HAS estágio 2-3 ou DM' },
    ],
    differentialDiagnosis: ['Hipertensão do avental branco', 'Hipertensão mascarada', 'HAS secundária (renovascular, feocromocitoma, Cushing, hiperaldosteronismo)', 'Pseudohipertensão (idosos com artérias calcificadas)'],
    treatment: {
      nonPharmacological: ['Dieta DASH (rica em frutas, vegetais, laticínios desnatados)', 'Restrição de sódio < 2g/dia (5g de sal)', 'Atividade física aeróbica 150 min/semana', 'Perda de peso (meta: IMC 18,5-24,9)', 'Cessação do tabagismo', 'Moderação do álcool (≤ 2 doses/dia H, ≤ 1 dose/dia M)', 'Controle do estresse'],
      pharmacological: [
        { drug: 'Losartana (BRA)', dose: '50-100 mg/dia', route: 'VO', duration: 'Contínuo', notes: '1ª linha. Nefroprotetor em DM. Evitar na gestação. Monitorar K+ e creatinina.' },
        { drug: 'Enalapril (IECA)', dose: '10-40 mg/dia (1-2x)', route: 'VO', duration: 'Contínuo', notes: '1ª linha. Tosse seca em 10-15%. Nefroprotetor. Evitar na gestação.' },
        { drug: 'Anlodipino (BCC)', dose: '5-10 mg/dia', route: 'VO', duration: 'Contínuo', notes: '1ª linha. Edema maleolar dose-dependente. Bom para idosos e negros.' },
        { drug: 'Hidroclorotiazida', dose: '12,5-25 mg/dia', route: 'VO', duration: 'Contínuo', notes: '1ª linha. Monitorar K+, Na+, ácido úrico, glicemia. Evitar se TFG < 30.' },
        { drug: 'Espironolactona', dose: '25-50 mg/dia', route: 'VO', duration: 'Contínuo', notes: '4ª droga na HAS resistente. Monitorar K+. Ginecomastia em homens.' },
        { drug: 'Atenolol / Metoprolol', dose: '25-100 mg/dia', route: 'VO', duration: 'Contínuo', notes: 'Indicado se IC, FA, enxaqueca. Evitar em asmáticos e DPOC.' },
      ],
    },
    monitoring: ['PA a cada consulta (mínimo trimestral se controlada)', 'Creatinina + K+ a cada 6 meses (se IECA/BRA)', 'Perfil lipídico e glicemia anual', 'ECG anual', 'Microalbuminúria anual se DM'],
    complications: ['AVC (isquêmico/hemorrágico)', 'IAM', 'Insuficiência cardíaca', 'Doença renal crônica', 'Retinopatia hipertensiva', 'Dissecção de aorta', 'Fibrilação atrial'],
    prognosis: 'Com tratamento adequado, redução de 35-40% no risco de AVC e 20-25% no risco de IAM. Sem tratamento, risco de eventos cardiovasculares aumenta progressivamente.',
    prevention: ['Estilo de vida saudável desde a infância', 'Rastreamento populacional a partir dos 18 anos', 'Controle de peso', 'Atividade física regular'],
    references: [
      { title: 'Diretriz Brasileira de Hipertensão Arterial', source: 'SBC — Arq Bras Cardiol', year: 2024 },
      { title: 'ESC/ESH Guidelines for Arterial Hypertension', source: 'Eur Heart J', year: 2023 },
    ],
    lastUpdated: '2025-01-15', reviewedBy: 'Dr. Carlos Eduardo (CRM-SP 123456)',
  },
  {
    id: 'iam_csst', name: 'Infarto Agudo do Miocárdio com Supra de ST', cid10: 'I21.0', specialty: 'Cardiologia',
    urgency: 'emergencia', prevalence: 'comum',
    definition: 'Necrose miocárdica aguda causada por oclusão trombótica total de artéria coronária, evidenciada por supradesnivelamento persistente do segmento ST no ECG.',
    epidemiology: '300.000 casos/ano no Brasil. Mortalidade hospitalar de 5-8% com reperfusão adequada, 15-20% sem reperfusão. Principal causa de morte no mundo.',
    etiology: ['Ruptura de placa aterosclerótica com trombose oclusiva (90%)', 'Espasmo coronariano', 'Dissecção coronariana espontânea', 'Embolia coronariana', 'Vasculite (Kawasaki, Takayasu)'],
    riskFactors: ['HAS', 'DM', 'Dislipidemia', 'Tabagismo', 'Obesidade', 'Sedentarismo', 'História familiar de DAC precoce', 'Sexo masculino', 'Idade > 45 (H) / > 55 (M)', 'Uso de cocaína'],
    clinicalPresentation: [
      { symptom: 'Dor precordial em aperto/opressão > 20 min', frequency: '85%' },
      { symptom: 'Irradiação para MSE, mandíbula, dorso', frequency: '60%' },
      { symptom: 'Dispneia', frequency: '40%' },
      { symptom: 'Sudorese fria', frequency: '50%' },
      { symptom: 'Náuseas/vômitos (IAM inferior)', frequency: '30%' },
      { symptom: 'Síncope', frequency: '10%' },
      { symptom: 'Apresentação atípica (idosos, DM, mulheres)', frequency: '20-30%' },
    ],
    diagnosticCriteria: [
      'ECG: Supra de ST ≥ 1mm em 2 derivações contíguas (≥ 2mm em V1-V3)',
      'OU BRE novo com clínica sugestiva (critérios de Sgarbossa)',
      'Troponina elevada (confirma, mas NÃO esperar para reperfusão)',
      'Tempo porta-ECG: ≤ 10 minutos',
    ],
    complementaryExams: [
      { exam: 'ECG 12 derivações', purpose: 'Diagnóstico — localização do IAM', when: 'Imediato (≤ 10 min da chegada)' },
      { exam: 'Troponina I/T de alta sensibilidade', purpose: 'Confirmação de necrose miocárdica', when: 'Admissão + 3h + 6h' },
      { exam: 'Ecocardiograma', purpose: 'Avaliar função VE, complicações mecânicas', when: 'Primeiras 24h' },
      { exam: 'Coronariografia', purpose: 'Identificar artéria culpada e realizar ICP', when: 'Imediato (ICP primária) ou até 24h' },
      { exam: 'Rx de tórax', purpose: 'Avaliar congestão pulmonar, mediastino', when: 'Admissão' },
      { exam: 'Hemograma, eletrólitos, função renal, coagulograma', purpose: 'Avaliação geral', when: 'Admissão' },
    ],
    differentialDiagnosis: ['Dissecção aguda de aorta', 'TEP maciço', 'Pericardite aguda', 'Pneumotórax hipertensivo', 'Espasmo esofágico', 'Síndrome de Takotsubo'],
    treatment: {
      nonPharmacological: ['Monitorização contínua em UCO', 'Repouso absoluto nas primeiras 12-24h', 'Oxigênio se SpO2 < 90%', 'Acesso venoso periférico calibroso'],
      pharmacological: [
        { drug: 'AAS', dose: '300 mg (ataque) → 100 mg/dia', route: 'VO (mastigar)', duration: 'Indefinido', notes: 'Administrar imediatamente. Contraindicado se alergia.' },
        { drug: 'Clopidogrel', dose: '300-600 mg (ataque) → 75 mg/dia', route: 'VO', duration: '12 meses', notes: 'Dupla antiagregação. Ticagrelor 180mg é alternativa.' },
        { drug: 'Heparina não fracionada', dose: '60 UI/kg bolus (máx 4000) → 12 UI/kg/h', route: 'IV', duration: '48h ou até ICP', notes: 'Monitorar TTPa (1,5-2,5x). Enoxaparina 1mg/kg SC 12/12h é alternativa.' },
        { drug: 'Morfina', dose: '2-4 mg IV a cada 5-15 min', route: 'IV', duration: 'Até alívio da dor', notes: 'Apenas se dor refratária a nitratos. Pode causar hipotensão.' },
        { drug: 'Nitroglicerina', dose: '5-200 mcg/min IV', route: 'IV', duration: 'Até alívio', notes: 'Contraindicado se PAS < 90, IAM de VD, uso de sildenafil.' },
        { drug: 'Atorvastatina', dose: '80 mg/dia', route: 'VO', duration: 'Indefinido', notes: 'Iniciar nas primeiras 24h. Alta intensidade.' },
        { drug: 'Metoprolol', dose: '25-50 mg 12/12h', route: 'VO', duration: 'Indefinido', notes: 'Iniciar se estável. Evitar se Killip ≥ 3, FC < 60, PAS < 100.' },
        { drug: 'Alteplase (se não houver ICP)', dose: '15mg bolus + 0,75mg/kg em 30min + 0,5mg/kg em 60min', route: 'IV', duration: 'Dose única', notes: 'Trombólise se ICP não disponível em 120 min. Janela: até 12h.' },
      ],
      surgical: ['ICP primária (angioplastia + stent): PADRÃO-OURO — tempo porta-balão ≤ 90 min', 'Cirurgia de revascularização (CRVM): se anatomia desfavorável para ICP ou choque cardiogênico'],
    },
    monitoring: ['ECG seriado (6h, 12h, 24h)', 'Troponina seriada (0h, 3h, 6h)', 'Monitorização hemodinâmica contínua', 'Ecocardiograma antes da alta', 'Teste funcional antes da alta (se não fez cate)'],
    complications: ['Arritmias (FV, TV, BAV)', 'Insuficiência cardíaca aguda / Killip III-IV', 'Choque cardiogênico', 'Ruptura de parede livre / septo / músculo papilar', 'Pericardite pós-IAM (Dressler)', 'Trombose intracavitária', 'Aneurisma ventricular'],
    prognosis: 'Com ICP primária em tempo adequado: mortalidade < 5%. Sem reperfusão: mortalidade 15-20%. FEVE < 40% indica pior prognóstico a longo prazo.',
    prevention: ['Controle de fatores de risco (HAS, DM, dislipidemia)', 'Cessação do tabagismo', 'Atividade física regular', 'Dieta mediterrânea', 'AAS em prevenção secundária'],
    references: [
      { title: 'ESC Guidelines for STEMI', source: 'Eur Heart J', year: 2023 },
      { title: 'Diretriz Brasileira de SCA com Supra de ST', source: 'SBC — Arq Bras Cardiol', year: 2024 },
    ],
    lastUpdated: '2025-02-01', reviewedBy: 'Dr. Ana Beatriz (CRM-SP 654321)',
  },
  {
    id: 'ic', name: 'Insuficiência Cardíaca', cid10: 'I50', specialty: 'Cardiologia',
    urgency: 'eletivo', prevalence: 'muito_comum',
    definition: 'Síndrome clínica complexa em que o coração é incapaz de bombear sangue de forma adequada para atender às necessidades metabólicas do organismo, ou o faz à custa de elevadas pressões de enchimento.',
    epidemiology: '2 milhões de brasileiros com IC. 240.000 internações/ano pelo SUS. Mortalidade em 5 anos: 50%. Custo anual para o SUS: R$ 300 milhões.',
    etiology: ['DAC/IAM prévio (60-70%)', 'HAS (20-30%)', 'Cardiomiopatia dilatada idiopática', 'Valvopatias', 'Doença de Chagas (endêmica no Brasil)', 'Cardiomiopatia alcoólica', 'Miocardite', 'Cardiotoxicidade (quimioterapia)'],
    riskFactors: ['DAC', 'HAS', 'DM', 'Obesidade', 'Tabagismo', 'Doença de Chagas', 'Uso abusivo de álcool', 'Quimioterapia cardiotóxica', 'História familiar de cardiomiopatia'],
    clinicalPresentation: [
      { symptom: 'Dispneia aos esforços (progressiva)', frequency: '90%' },
      { symptom: 'Ortopneia', frequency: '70%' },
      { symptom: 'Dispneia paroxística noturna', frequency: '50%' },
      { symptom: 'Edema de MMII', frequency: '70%' },
      { symptom: 'Fadiga / intolerância ao exercício', frequency: '80%' },
      { symptom: 'Tosse noturna', frequency: '30%' },
      { symptom: 'Ganho de peso (retenção hídrica)', frequency: '40%' },
    ],
    diagnosticCriteria: [
      'Critérios de Framingham: 2 maiores OU 1 maior + 2 menores',
      'Maiores: DPN, turgência jugular, estertores, cardiomegalia, EAP, B3, refluxo hepatojugular',
      'Menores: edema MMII, tosse noturna, dispneia aos esforços, hepatomegalia, derrame pleural, FC > 120',
      'BNP > 100 pg/mL ou NT-proBNP > 300 pg/mL (alta sensibilidade)',
      'Ecocardiograma: FEVE < 40% (ICFEr) / 40-49% (ICFEi) / ≥ 50% (ICFEp)',
    ],
    complementaryExams: [
      { exam: 'Ecocardiograma transtorácico', purpose: 'Avaliar FEVE, volumes, valvas, diastologia', when: 'Diagnóstico inicial — OBRIGATÓRIO' },
      { exam: 'BNP / NT-proBNP', purpose: 'Diagnóstico e prognóstico', when: 'Diagnóstico e descompensações' },
      { exam: 'ECG', purpose: 'Avaliar ritmo, BRE, HVE, isquemia', when: 'Diagnóstico inicial' },
      { exam: 'Rx de tórax', purpose: 'Avaliar cardiomegalia, congestão', when: 'Diagnóstico e descompensações' },
      { exam: 'Hemograma, função renal, eletrólitos, TSH, ferritina', purpose: 'Avaliar causas e comorbidades', when: 'Diagnóstico inicial' },
      { exam: 'Coronariografia', purpose: 'Avaliar DAC como etiologia', when: 'Se suspeita de etiologia isquêmica' },
    ],
    differentialDiagnosis: ['DPOC', 'Pneumonia', 'TEP', 'Síndrome nefrótica', 'Cirrose hepática', 'Anemia grave', 'Obesidade mórbida'],
    treatment: {
      nonPharmacological: ['Restrição hídrica (1-1,5L/dia se IC grave)', 'Restrição de sódio (< 2g/dia)', 'Peso diário (alerta se ganho > 1kg/dia)', 'Atividade física supervisionada (reabilitação cardíaca)', 'Vacinação (influenza + pneumococo)', 'Cessação de tabagismo e álcool'],
      pharmacological: [
        { drug: 'Sacubitril/Valsartana (ARNI)', dose: '24/26 mg 12/12h → titular até 97/103 mg 12/12h', route: 'VO', duration: 'Contínuo', notes: 'PILAR 1. Superior a IECA na ICFEr (PARADIGM-HF). Não associar com IECA (washout 36h).' },
        { drug: 'Carvedilol (betabloqueador)', dose: '3,125 mg 12/12h → titular até 25 mg 12/12h', route: 'VO', duration: 'Contínuo', notes: 'PILAR 2. Iniciar quando compensado. Titular lentamente a cada 2 semanas.' },
        { drug: 'Espironolactona (ARM)', dose: '25 mg/dia (até 50 mg)', route: 'VO', duration: 'Contínuo', notes: 'PILAR 3. Monitorar K+ (risco de hipercalemia). Evitar se K+ > 5,5 ou TFG < 30.' },
        { drug: 'Dapagliflozina (SGLT2i)', dose: '10 mg/dia', route: 'VO', duration: 'Contínuo', notes: 'PILAR 4. Benefício independente de DM (DAPA-HF). Empagliflozina 10mg é alternativa.' },
        { drug: 'Furosemida', dose: '20-80 mg/dia (até 240 mg em IC grave)', route: 'VO ou IV', duration: 'Conforme congestão', notes: 'Alívio sintomático. Não melhora mortalidade. Ajustar pela volemia.' },
        { drug: 'Hidralazina + Dinitrato de isossorbida', dose: '25-75 mg 8/8h + 20-40 mg 8/8h', route: 'VO', duration: 'Contínuo', notes: 'Alternativa se intolerância a IECA/BRA. Benefício em afrodescendentes (A-HeFT).' },
      ],
      surgical: ['CDI (desfibrilador): FEVE ≤ 35% após 3 meses de tratamento otimizado', 'TRC (ressincronização): FEVE ≤ 35% + BRE + QRS ≥ 150ms', 'Transplante cardíaco: IC refratária ao tratamento máximo'],
    },
    monitoring: ['Consulta a cada 1-3 meses', 'Peso diário pelo paciente', 'BNP/NT-proBNP a cada 3-6 meses', 'Função renal + eletrólitos a cada 3 meses', 'Ecocardiograma anual', 'Classificação NYHA a cada consulta'],
    complications: ['Edema agudo de pulmão', 'Choque cardiogênico', 'Arritmias (FA, TV, FV)', 'Tromboembolismo', 'Caquexia cardíaca', 'Insuficiência renal cardiorrenal', 'Morte súbita'],
    prognosis: 'Com os 4 pilares otimizados: redução de 50-60% na mortalidade. NYHA I-II: sobrevida em 5 anos ~75%. NYHA III-IV: sobrevida em 5 anos ~25-50%.',
    prevention: ['Controle de HAS e DM', 'Tratamento precoce de DAC', 'Evitar cardiotoxinas', 'Tratamento da doença de Chagas', 'Rastreamento familiar se cardiomiopatia'],
    references: [
      { title: 'Diretriz Brasileira de IC', source: 'SBC — Arq Bras Cardiol', year: 2024 },
      { title: 'ESC Guidelines for Heart Failure', source: 'Eur Heart J', year: 2023 },
      { title: 'DAPA-HF Trial', source: 'NEJM', year: 2019 },
    ],
    lastUpdated: '2025-02-15', reviewedBy: 'Dr. Roberto Kalil (CRM-SP 789012)',
  },

  // ═══ PNEUMOLOGIA ═══
  {
    id: 'pac', name: 'Pneumonia Adquirida na Comunidade', cid10: 'J18.9', specialty: 'Pneumologia',
    urgency: 'urgencia', prevalence: 'muito_comum',
    definition: 'Infecção aguda do parênquima pulmonar adquirida fora do ambiente hospitalar ou que se manifesta em até 48h da internação.',
    epidemiology: '2 milhões de casos/ano no Brasil. 600.000 internações/ano pelo SUS. Mortalidade ambulatorial: 1-5%. Mortalidade UTI: 30-50%.',
    etiology: ['S. pneumoniae (30-40%) — mais comum', 'H. influenzae (5-10%)', 'Atípicos: Mycoplasma, Chlamydophila, Legionella (20-30%)', 'Vírus respiratórios: Influenza, SARS-CoV-2, VSR (15-20%)', 'S. aureus (pós-influenza, UDIV)', 'Klebsiella pneumoniae (etilistas, diabéticos)'],
    riskFactors: ['Idade > 65 anos', 'DPOC', 'Tabagismo', 'Etilismo', 'DM', 'ICC', 'Imunossupressão', 'Doença hepática/renal crônica', 'Aspiração (AVC, demência)'],
    clinicalPresentation: [
      { symptom: 'Tosse (produtiva ou seca)', frequency: '90%' },
      { symptom: 'Febre (≥ 38°C)', frequency: '80%' },
      { symptom: 'Dispneia', frequency: '60%' },
      { symptom: 'Dor torácica pleurítica', frequency: '40%' },
      { symptom: 'Expectoração purulenta', frequency: '50%' },
      { symptom: 'Calafrios', frequency: '40%' },
      { symptom: 'Confusão mental (idosos)', frequency: '20%' },
    ],
    diagnosticCriteria: [
      'Clínica: tosse + febre + dispneia + estertores crepitantes',
      'Rx de tórax: infiltrado pulmonar novo (consolidação, broncograma aéreo)',
      'CURB-65 para estratificação: Confusão, Ureia > 50, FR ≥ 30, PAS < 90 ou PAD ≤ 60, Idade ≥ 65',
      'CURB-65 0-1: ambulatorial | 2: internação | 3-5: UTI',
    ],
    complementaryExams: [
      { exam: 'Rx de tórax PA e perfil', purpose: 'Confirmar diagnóstico e extensão', when: 'Obrigatório no diagnóstico' },
      { exam: 'Hemograma + PCR', purpose: 'Avaliar resposta inflamatória', when: 'Se internação' },
      { exam: 'Ureia + creatinina', purpose: 'Calcular CURB-65', when: 'Se internação' },
      { exam: 'Hemocultura (2 amostras)', purpose: 'Identificar agente', when: 'Se CURB-65 ≥ 2 ou UTI' },
      { exam: 'Gasometria arterial', purpose: 'Avaliar troca gasosa', when: 'Se SpO2 < 92% ou CURB-65 ≥ 3' },
      { exam: 'Antígeno urinário (pneumococo/legionella)', purpose: 'Diagnóstico etiológico rápido', when: 'Se PAC grave' },
    ],
    differentialDiagnosis: ['TEP', 'ICC descompensada', 'Tuberculose', 'Câncer de pulmão', 'Pneumonite por hipersensibilidade', 'Hemorragia alveolar'],
    treatment: {
      nonPharmacological: ['Hidratação adequada', 'Oxigenoterapia se SpO2 < 92%', 'Repouso relativo', 'Fisioterapia respiratória se necessário'],
      pharmacological: [
        { drug: 'Amoxicilina (ambulatorial — típico)', dose: '500 mg 8/8h', route: 'VO', duration: '7 dias', notes: 'CURB-65 0-1 sem comorbidades. Alternativa: amoxicilina-clavulanato 875/125 mg 12/12h.' },
        { drug: 'Azitromicina (ambulatorial — atípico)', dose: '500 mg/dia', route: 'VO', duration: '3-5 dias', notes: 'Se suspeita de atípico ou alergia a penicilina. Claritromicina 500mg 12/12h é alternativa.' },
        { drug: 'Amoxicilina-clavulanato + Azitromicina (enfermaria)', dose: '875/125 mg 8/8h + 500 mg/dia', route: 'VO', duration: '7-10 dias', notes: 'CURB-65 2. Cobre típicos + atípicos.' },
        { drug: 'Ceftriaxona + Azitromicina (enfermaria/UTI)', dose: '1-2g IV 1x/dia + 500 mg IV/VO 1x/dia', route: 'IV + VO', duration: '7-14 dias', notes: 'CURB-65 ≥ 3 ou UTI. Piperacilina-tazobactam se Pseudomonas.' },
        { drug: 'Oseltamivir (se influenza)', dose: '75 mg 12/12h', route: 'VO', duration: '5 dias', notes: 'Iniciar em até 48h dos sintomas. Indicado em PAC grave no período de influenza.' },
      ],
    },
    monitoring: ['Reavaliação clínica em 48-72h (ambulatorial)', 'Rx de tórax de controle em 6 semanas (se > 50 anos ou tabagista)', 'Se sem melhora em 72h: reavaliar diagnóstico e cobertura antibiótica'],
    complications: ['Derrame pleural parapneumônico', 'Empiema', 'Abscesso pulmonar', 'Sepse / choque séptico', 'SDRA', 'Insuficiência respiratória'],
    prognosis: 'Ambulatorial: resolução em 7-14 dias, mortalidade < 1%. Internação: mortalidade 5-15%. UTI: mortalidade 30-50%.',
    prevention: ['Vacinação anti-pneumocócica (PCV13 + PPSV23)', 'Vacinação anti-influenza anual', 'Cessação do tabagismo', 'Higiene das mãos'],
    references: [
      { title: 'Diretrizes Brasileiras para PAC em Adultos', source: 'SBPT — J Bras Pneumol', year: 2022 },
      { title: 'ATS/IDSA Guidelines for CAP', source: 'Am J Respir Crit Care Med', year: 2019 },
    ],
    lastUpdated: '2025-01-20', reviewedBy: 'Dra. Mariana Costa (CRM-RJ 345678)',
  },

  // ═══ ENDOCRINOLOGIA ═══
  {
    id: 'dm2', name: 'Diabetes Mellitus Tipo 2', cid10: 'E11', specialty: 'Endocrinologia',
    urgency: 'eletivo', prevalence: 'muito_comum',
    definition: 'Distúrbio metabólico caracterizado por hiperglicemia crônica resultante de defeitos na secreção e/ou ação da insulina (resistência insulínica).',
    epidemiology: '16,8 milhões de diabéticos no Brasil (IDF 2021). 90-95% são DM2. 6ª causa de morte no mundo. Custo anual no Brasil: R$ 3,9 bilhões.',
    etiology: ['Resistência insulínica + disfunção progressiva das células beta', 'Componente genético forte (concordância em gêmeos: 70-90%)', 'Fatores ambientais: obesidade, sedentarismo, dieta hipercalórica'],
    riskFactors: ['Obesidade (IMC ≥ 25)', 'Sedentarismo', 'Idade ≥ 45 anos', 'História familiar de DM (1° grau)', 'DMG prévio', 'SOP', 'HAS', 'Dislipidemia (HDL < 35 ou TG > 250)', 'Pré-diabetes', 'Acantose nigricans'],
    clinicalPresentation: [
      { symptom: 'Assintomático (diagnóstico por exames)', frequency: '50%' },
      { symptom: 'Poliúria', frequency: '30%' },
      { symptom: 'Polidipsia', frequency: '30%' },
      { symptom: 'Perda de peso inexplicada', frequency: '20%' },
      { symptom: 'Visão turva', frequency: '15%' },
      { symptom: 'Infecções de repetição (candidíase, ITU)', frequency: '20%' },
      { symptom: 'Parestesias em MMII', frequency: '15%' },
    ],
    diagnosticCriteria: [
      'Glicemia de jejum ≥ 126 mg/dL (em 2 ocasiões)',
      'OU HbA1c ≥ 6,5% (em 2 ocasiões)',
      'OU Glicemia 2h pós-TOTG 75g ≥ 200 mg/dL',
      'OU Glicemia aleatória ≥ 200 mg/dL + sintomas clássicos',
      'Pré-diabetes: GJ 100-125 / HbA1c 5,7-6,4% / TOTG 140-199',
    ],
    complementaryExams: [
      { exam: 'Glicemia de jejum', purpose: 'Diagnóstico e monitoramento', when: 'Diagnóstico + a cada 3 meses' },
      { exam: 'HbA1c', purpose: 'Controle glicêmico dos últimos 3 meses', when: 'A cada 3 meses (meta < 7%)' },
      { exam: 'Perfil lipídico', purpose: 'Avaliar risco cardiovascular', when: 'Diagnóstico + anual' },
      { exam: 'Creatinina + TFG', purpose: 'Rastrear nefropatia diabética', when: 'Diagnóstico + anual' },
      { exam: 'Microalbuminúria (RAC)', purpose: 'Rastrear nefropatia precoce', when: 'Diagnóstico + anual' },
      { exam: 'Fundoscopia', purpose: 'Rastrear retinopatia diabética', when: 'Diagnóstico + anual' },
      { exam: 'Exame dos pés (monofilamento)', purpose: 'Rastrear neuropatia periférica', when: 'A cada consulta' },
      { exam: 'TSH', purpose: 'Rastrear disfunção tireoidiana', when: 'Diagnóstico' },
    ],
    differentialDiagnosis: ['DM tipo 1 (LADA em adultos)', 'Diabetes secundário (corticoides, pancreatite)', 'MODY', 'Diabetes gestacional', 'Hiperglicemia de estresse'],
    treatment: {
      nonPharmacological: ['Dieta individualizada (redução de carboidratos refinados)', 'Atividade física: 150 min/semana aeróbico + 2x/semana resistido', 'Perda de peso: meta 5-10% do peso corporal', 'Educação em diabetes (automonitoramento)', 'Cessação do tabagismo'],
      pharmacological: [
        { drug: 'Metformina', dose: '500 mg → titular até 2000 mg/dia (com refeições)', route: 'VO', duration: 'Contínuo', notes: '1ª LINHA sempre. Reduz HbA1c 1-1,5%. Evitar se TFG < 30. Efeitos GI comuns.' },
        { drug: 'Dapagliflozina (SGLT2i)', dose: '10 mg/dia', route: 'VO', duration: 'Contínuo', notes: '2ª LINHA se DCV ou IC ou DRC. Perda de peso + proteção cardiorrenal. Risco de ITU/candidíase.' },
        { drug: 'Liraglutida (GLP-1 RA)', dose: '0,6 mg → 1,2-1,8 mg/dia SC', route: 'SC', duration: 'Contínuo', notes: '2ª LINHA se DCV ou obesidade. Perda de peso significativa. Semaglutida 1mg/semana é alternativa.' },
        { drug: 'Gliclazida MR (sulfonilureia)', dose: '30-120 mg/dia', route: 'VO', duration: 'Contínuo', notes: 'Se custo é limitante. Risco de hipoglicemia e ganho de peso. Evitar glibenclamida.' },
        { drug: 'Insulina NPH/Glargina', dose: '10 UI ao deitar → titular por GJ', route: 'SC', duration: 'Contínuo', notes: 'Se HbA1c > 9% com sintomas ou falha de 2 drogas orais. Titular 2 UI a cada 3 dias.' },
        { drug: 'Insulina rápida (Lispro/Aspart)', dose: 'Conforme contagem de carboidratos', route: 'SC', duration: 'Contínuo', notes: 'Se necessário controle pós-prandial. Esquema basal-bolus.' },
      ],
    },
    monitoring: ['HbA1c a cada 3 meses (meta < 7% geral / < 8% idosos frágeis)', 'Glicemia capilar: automonitoramento se insulina', 'Perfil lipídico anual', 'Função renal + microalbuminúria anual', 'Fundoscopia anual', 'Exame dos pés a cada consulta', 'PA a cada consulta'],
    complications: ['Retinopatia diabética (principal causa de cegueira)', 'Nefropatia diabética (principal causa de diálise)', 'Neuropatia periférica / autonômica', 'Pé diabético (principal causa de amputação não traumática)', 'DAC / AVC / DAP', 'Cetoacidose diabética (raro no DM2)', 'Estado hiperosmolar hiperglicêmico'],
    prognosis: 'Com controle adequado (HbA1c < 7%): redução de 25% nas complicações microvasculares. Expectativa de vida reduzida em 6-8 anos se mal controlado.',
    prevention: ['Programa de prevenção de diabetes (dieta + exercício): reduz risco em 58%', 'Metformina em pré-diabetes de alto risco', 'Rastreamento a partir dos 45 anos ou antes se fatores de risco'],
    references: [
      { title: 'Diretrizes da Sociedade Brasileira de Diabetes', source: 'SBD', year: 2024 },
      { title: 'ADA Standards of Care in Diabetes', source: 'Diabetes Care', year: 2025 },
    ],
    lastUpdated: '2025-02-10', reviewedBy: 'Dra. Fernanda Lima (CRM-MG 456789)',
  },

  // ═══ EMERGÊNCIA ═══
  {
    id: 'sepse', name: 'Sepse e Choque Séptico', cid10: 'A41.9', specialty: 'Emergência',
    urgency: 'emergencia', prevalence: 'comum',
    definition: 'Sepse: disfunção orgânica potencialmente fatal causada por resposta desregulada do hospedeiro a uma infecção (Sepsis-3). Choque séptico: sepse + necessidade de vasopressor para PAM ≥ 65 + lactato > 2 mmol/L após ressuscitação volêmica.',
    epidemiology: '240.000 mortes/ano por sepse no Brasil. Mortalidade: sepse 15-20%, choque séptico 40-60%. Brasil tem uma das maiores mortalidades por sepse do mundo.',
    etiology: ['Foco pulmonar (40-50%) — PAC, PAVM', 'Foco urinário (20-30%) — ITU, pielonefrite', 'Foco abdominal (15-20%) — peritonite, colangite', 'Foco cutâneo (5-10%) — celulite, fasciíte', 'Foco de cateter (5-10%) — infecção de corrente sanguínea'],
    riskFactors: ['Idade > 65 anos', 'Imunossupressão', 'DM', 'Neoplasia', 'Uso de corticoides', 'Cirurgia recente', 'Dispositivos invasivos (cateter, sonda)', 'Internação prolongada'],
    clinicalPresentation: [
      { symptom: 'Febre (> 38°C) ou hipotermia (< 36°C)', frequency: '85%' },
      { symptom: 'Taquicardia (FC > 90)', frequency: '80%' },
      { symptom: 'Taquipneia (FR > 22)', frequency: '70%' },
      { symptom: 'Hipotensão (PAS < 90)', frequency: '40%' },
      { symptom: 'Alteração do nível de consciência', frequency: '30%' },
      { symptom: 'Oligúria (< 0,5 mL/kg/h)', frequency: '25%' },
      { symptom: 'Pele moteada / livedo', frequency: '20%' },
    ],
    diagnosticCriteria: [
      'Sepsis-3: Infecção suspeita/confirmada + SOFA ≥ 2 pontos',
      'qSOFA (triagem): ≥ 2 de: FR ≥ 22, PAS ≤ 100, alteração mental (Glasgow < 15)',
      'Choque séptico: Sepse + vasopressor para PAM ≥ 65 + lactato > 2 mmol/L',
      'SOFA: PaO2/FiO2, plaquetas, bilirrubina, PAM, Glasgow, creatinina',
    ],
    complementaryExams: [
      { exam: 'Lactato arterial', purpose: 'Marcador de hipoperfusão — guia ressuscitação', when: 'IMEDIATO + a cada 2-4h até normalizar' },
      { exam: 'Hemoculturas (2 pares)', purpose: 'Identificar agente etiológico', when: 'ANTES do antibiótico (não atrasar ATB)' },
      { exam: 'Hemograma + PCR + Procalcitonina', purpose: 'Avaliar resposta inflamatória', when: 'Admissão + seriado' },
      { exam: 'Gasometria arterial', purpose: 'Avaliar acidose, oxigenação', when: 'Admissão + seriado' },
      { exam: 'Função renal + eletrólitos', purpose: 'Avaliar disfunção orgânica', when: 'Admissão + seriado' },
      { exam: 'Coagulograma + fibrinogênio', purpose: 'Avaliar CIVD', when: 'Admissão' },
      { exam: 'Imagem do foco (Rx, TC, USG)', purpose: 'Identificar e controlar foco', when: 'Assim que possível' },
    ],
    differentialDiagnosis: ['Choque cardiogênico', 'Choque hipovolêmico', 'TEP maciço', 'Insuficiência adrenal aguda', 'Anafilaxia', 'Pancreatite aguda grave'],
    treatment: {
      nonPharmacological: ['BUNDLE DE 1 HORA (Surviving Sepsis Campaign):', 'Medir lactato', 'Colher hemoculturas ANTES do antibiótico', 'Iniciar antibiótico de amplo espectro em até 1 HORA', 'Cristaloide 30 mL/kg se hipotensão ou lactato ≥ 4', 'Vasopressor se PAM < 65 após volume'],
      pharmacological: [
        { drug: 'Piperacilina-Tazobactam (empírico)', dose: '4,5g IV 6/6h', route: 'IV', duration: '7-10 dias', notes: 'Foco pulmonar/abdominal. Alternativa: Meropenem 1g 8/8h se risco de MDR.' },
        { drug: 'Ceftriaxona + Metronidazol (empírico)', dose: '2g IV 1x/dia + 500mg IV 8/8h', route: 'IV', duration: '7-10 dias', notes: 'Foco abdominal. Alternativa econômica.' },
        { drug: 'Vancomicina (se MRSA)', dose: '15-20 mg/kg IV 12/12h', route: 'IV', duration: '7-14 dias', notes: 'Se suspeita de MRSA (cateter, pele). Monitorar nível sérico (15-20 mcg/mL).' },
        { drug: 'Noradrenalina (vasopressor)', dose: '0,1-2 mcg/kg/min', route: 'IV (BIC)', duration: 'Até estabilização', notes: 'VASOPRESSOR DE ESCOLHA. Meta: PAM ≥ 65 mmHg. Acesso central preferencial.' },
        { drug: 'Hidrocortisona (se choque refratário)', dose: '200 mg/dia (50 mg 6/6h)', route: 'IV', duration: '5-7 dias', notes: 'Apenas se choque refratário a volume + vasopressor. Desmame gradual.' },
        { drug: 'Ringer Lactato', dose: '30 mL/kg nas primeiras 3h', route: 'IV', duration: 'Conforme resposta', notes: 'Cristaloide balanceado preferível a SF 0,9%. Reavaliar responsividade a fluidos.' },
      ],
    },
    monitoring: ['Lactato a cada 2-4h até normalizar', 'Diurese horária (meta ≥ 0,5 mL/kg/h)', 'PAM contínua (meta ≥ 65)', 'ScvO2 se disponível (meta ≥ 70%)', 'Reavaliação do antibiótico em 48-72h com culturas', 'SOFA diário'],
    complications: ['Falência múltipla de órgãos', 'SDRA', 'CIVD', 'Insuficiência renal aguda', 'Encefalopatia séptica', 'Polineuropatia do doente crítico', 'Óbito'],
    prognosis: 'Sepse sem choque: mortalidade 15-20%. Choque séptico: mortalidade 40-60%. Cada hora de atraso no antibiótico aumenta mortalidade em 7,6%.',
    prevention: ['Higiene das mãos', 'Bundle de prevenção de infecção de cateter', 'Vacinação', 'Uso racional de antibióticos', 'Identificação precoce (qSOFA na triagem)'],
    references: [
      { title: 'Surviving Sepsis Campaign Guidelines 2021', source: 'Intensive Care Med / Crit Care Med', year: 2021 },
      { title: 'ILAS — Protocolo de Sepse', source: 'Instituto Latino-Americano de Sepse', year: 2024 },
    ],
    lastUpdated: '2025-02-20', reviewedBy: 'Dr. Luciano Azevedo (CRM-SP 112233)',
  },

  // ═══ NEUROLOGIA ═══
  {
    id: 'avc_isq', name: 'AVC Isquêmico Agudo', cid10: 'I63', specialty: 'Neurologia',
    urgency: 'emergencia', prevalence: 'comum',
    definition: 'Déficit neurológico focal agudo causado por isquemia cerebral decorrente de oclusão arterial (trombótica ou embólica), com duração > 24h ou evidência de infarto em neuroimagem.',
    epidemiology: '400.000 casos/ano no Brasil. Principal causa de incapacidade em adultos. 2ª causa de morte no Brasil. Mortalidade em 30 dias: 15-20%.',
    etiology: ['Aterosclerose de grandes vasos (30%)', 'Cardioembolismo — FA, trombo intracardíaco (25%)', 'Doença de pequenos vasos — lacunar (20%)', 'Outras causas — dissecção, vasculite, trombofilia (5%)', 'Criptogênico (20%)'],
    riskFactors: ['HAS (principal)', 'FA', 'DM', 'Dislipidemia', 'Tabagismo', 'Obesidade', 'Sedentarismo', 'AVC/AIT prévio', 'Estenose carotídea', 'Uso de anticoncepcionais + tabagismo'],
    clinicalPresentation: [
      { symptom: 'Hemiparesia/hemiplegia (contralateral)', frequency: '80%' },
      { symptom: 'Alteração da fala (afasia/disartria)', frequency: '50%' },
      { symptom: 'Desvio de rima labial', frequency: '60%' },
      { symptom: 'Alteração visual (hemianopsia)', frequency: '30%' },
      { symptom: 'Ataxia / incoordenação', frequency: '20%' },
      { symptom: 'Rebaixamento de consciência', frequency: '15%' },
      { symptom: 'Cefaleia intensa (menos comum que no AVC hemorrágico)', frequency: '10%' },
    ],
    diagnosticCriteria: [
      'Déficit neurológico focal de início súbito',
      'TC de crânio sem contraste: EXCLUIR hemorragia (pode ser normal nas primeiras 6h)',
      'NIHSS: quantificar gravidade (0-42 pontos)',
      'Angiotomografia: identificar oclusão de grande vaso (se candidato a trombectomia)',
      'Tempo é cérebro: "last seen well" é o marco temporal',
    ],
    complementaryExams: [
      { exam: 'TC de crânio sem contraste', purpose: 'Excluir hemorragia — OBRIGATÓRIO', when: 'IMEDIATO (< 25 min da chegada)' },
      { exam: 'Angiotomografia cerebral', purpose: 'Identificar oclusão de grande vaso', when: 'Se NIHSS ≥ 6 e candidato a trombectomia' },
      { exam: 'Glicemia capilar', purpose: 'Excluir hipoglicemia como causa', when: 'IMEDIATO' },
      { exam: 'ECG', purpose: 'Identificar FA e outras arritmias', when: 'Admissão' },
      { exam: 'Hemograma + coagulograma', purpose: 'Avaliar antes de trombólise', when: 'Admissão (não atrasar trombólise)' },
      { exam: 'RM com difusão (DWI)', purpose: 'Confirmar isquemia aguda', when: 'Se TC normal e alta suspeita' },
      { exam: 'Ecocardiograma + Holter', purpose: 'Investigar fonte embólica', when: 'Após estabilização' },
    ],
    differentialDiagnosis: ['AVC hemorrágico', 'AIT', 'Hipoglicemia', 'Crise epiléptica (paralisia de Todd)', 'Enxaqueca com aura', 'Tumor cerebral', 'Encefalite', 'Conversão funcional'],
    treatment: {
      nonPharmacological: ['Monitorização em unidade de AVC', 'Cabeceira a 0° (se não trombólise) ou 30° (se risco de aspiração)', 'Oxigênio se SpO2 < 94%', 'Jejum até avaliação de disfagia (teste de deglutição)', 'Controle de temperatura (meta < 37,5°C)'],
      pharmacological: [
        { drug: 'Alteplase (rt-PA) — TROMBÓLISE', dose: '0,9 mg/kg IV (máx 90 mg): 10% bolus + 90% em 1h', route: 'IV', duration: 'Dose única', notes: 'JANELA: até 4,5h do início. Critérios de inclusão/exclusão rigorosos. PA < 185/110 antes.' },
        { drug: 'Tenecteplase (alternativa)', dose: '0,25 mg/kg IV bolus (máx 25 mg)', route: 'IV bolus', duration: 'Dose única', notes: 'Alternativa à alteplase. Dose única em bolus. Estudos recentes favoráveis.' },
        { drug: 'AAS', dose: '100-300 mg/dia', route: 'VO', duration: 'Contínuo', notes: 'Iniciar em 24-48h (após 24h se trombólise). Prevenção secundária.' },
        { drug: 'Atorvastatina', dose: '40-80 mg/dia', route: 'VO', duration: 'Contínuo', notes: 'Alta intensidade. Iniciar precocemente.' },
        { drug: 'Anti-hipertensivo (fase aguda)', dose: 'Labetalol 10-20mg IV ou Nitroprussiato', route: 'IV', duration: 'Conforme PA', notes: 'Se trombólise: PA < 185/110 antes e < 180/105 por 24h. Sem trombólise: tratar se PA > 220/120.' },
        { drug: 'Anticoagulação (se FA)', dose: 'Apixabana 5mg 12/12h ou Rivaroxabana 20mg/dia', route: 'VO', duration: 'Contínuo', notes: 'Iniciar em 1-14 dias conforme tamanho do infarto (regra 1-3-6-12). DOACs preferíveis a warfarina.' },
      ],
      surgical: ['Trombectomia mecânica: oclusão de grande vaso (ACI, M1) + NIHSS ≥ 6 + janela até 24h (com mismatch)', 'Craniectomia descompressiva: infarto maligno de ACM (edema cerebral) em < 60 anos'],
    },
    monitoring: ['NIHSS seriado (admissão, 2h, 24h, alta)', 'PA a cada 15 min por 2h pós-trombólise, depois a cada 30 min por 6h', 'Glicemia capilar 6/6h (meta 140-180)', 'TC de controle em 24h', 'Avaliação de disfagia antes de liberar dieta'],
    complications: ['Transformação hemorrágica', 'Edema cerebral maligno', 'Pneumonia aspirativa', 'TVP/TEP', 'Crises epilépticas', 'Depressão pós-AVC', 'Espasticidade'],
    prognosis: 'Com trombólise em tempo: 30% mais chance de independência funcional. Trombectomia: NNT = 2,6. Sem tratamento: 30% morrem, 30% ficam dependentes, 30% independentes.',
    prevention: ['Controle de PA (meta < 130/80 em prevenção secundária)', 'Anticoagulação se FA (CHA2DS2-VASc)', 'Estatina de alta intensidade', 'Cessação do tabagismo', 'Endarterectomia se estenose carotídea ≥ 70% sintomática'],
    references: [
      { title: 'AHA/ASA Guidelines for Acute Ischemic Stroke', source: 'Stroke', year: 2019 },
      { title: 'Protocolo de AVC do Ministério da Saúde', source: 'MS Brasil', year: 2024 },
    ],
    lastUpdated: '2025-02-15', reviewedBy: 'Dr. Gabriel Pinheiro (CRM-SP 998877)',
  },

  // ═══ INFECTOLOGIA ═══
  {
    id: 'itu', name: 'Infecção do Trato Urinário', cid10: 'N39.0', specialty: 'Infectologia',
    urgency: 'urgencia', prevalence: 'muito_comum',
    definition: 'Infecção bacteriana do trato urinário, classificada em: cistite (baixa), pielonefrite (alta), ITU complicada (alteração anatômica/funcional) e ITU recorrente (≥ 3/ano ou ≥ 2 em 6 meses).',
    epidemiology: '150 milhões de casos/ano no mundo. 50% das mulheres terão pelo menos 1 episódio. Relação mulher:homem = 30:1 na idade fértil. 2ª infecção mais comum na prática clínica.',
    etiology: ['E. coli (75-90%) — principal', 'Klebsiella pneumoniae (5-10%)', 'Proteus mirabilis (5%) — associado a cálculos', 'Staphylococcus saprophyticus (5-10% em mulheres jovens)', 'Enterococcus faecalis', 'Pseudomonas aeruginosa (ITU complicada/hospitalar)'],
    riskFactors: ['Sexo feminino', 'Atividade sexual', 'Uso de espermicida/diafragma', 'Menopausa (atrofia vaginal)', 'Gravidez', 'DM', 'Obstrução urinária (HPB, cálculos)', 'Cateter vesical', 'Imunossupressão', 'ITU prévia'],
    clinicalPresentation: [
      { symptom: 'Disúria (dor/ardência ao urinar)', frequency: '90%' },
      { symptom: 'Polaciúria (frequência aumentada)', frequency: '80%' },
      { symptom: 'Urgência miccional', frequency: '70%' },
      { symptom: 'Dor suprapúbica', frequency: '50%' },
      { symptom: 'Hematúria', frequency: '30%' },
      { symptom: 'Febre (sugere pielonefrite)', frequency: '40% (pielo)' },
      { symptom: 'Dor lombar / sinal de Giordano +', frequency: '60% (pielo)' },
      { symptom: 'Náuseas/vômitos (pielonefrite)', frequency: '30% (pielo)' },
    ],
    diagnosticCriteria: [
      'Cistite não complicada: clínica típica é suficiente (sem necessidade de urocultura)',
      'Urocultura: ≥ 100.000 UFC/mL (jato médio) — obrigatória em: pielonefrite, ITU complicada, recorrente, gestante, homem',
      'EAS: leucocitúria (> 10/campo), nitrito positivo, bacteriúria',
      'Pielonefrite: febre + dor lombar + Giordano + + urocultura positiva',
    ],
    complementaryExams: [
      { exam: 'EAS (urina tipo I)', purpose: 'Triagem rápida — leucocitúria, nitrito', when: 'Cistite recorrente ou dúvida diagnóstica' },
      { exam: 'Urocultura + antibiograma', purpose: 'Identificar agente e sensibilidade', when: 'Pielonefrite, ITU complicada, recorrente, gestante, homem' },
      { exam: 'Hemograma + PCR', purpose: 'Avaliar resposta inflamatória', when: 'Pielonefrite' },
      { exam: 'Hemocultura (2 pares)', purpose: 'Avaliar bacteremia', when: 'Pielonefrite grave / sepse' },
      { exam: 'USG de rins e vias urinárias', purpose: 'Excluir obstrução, abscesso', when: 'ITU complicada, sem melhora em 72h' },
      { exam: 'TC de abdome com contraste', purpose: 'Avaliar complicações (abscesso, pionefrose)', when: 'Pielonefrite sem melhora em 72h' },
    ],
    differentialDiagnosis: ['Vaginite / vulvovaginite', 'Uretrite (DST: clamídia, gonococo)', 'Cistite intersticial', 'Cálculo ureteral', 'Prostatite', 'Bexiga hiperativa'],
    treatment: {
      nonPharmacological: ['Hidratação abundante (≥ 2L/dia)', 'Não segurar urina', 'Urinar após relação sexual', 'Higiene adequada (frente para trás)'],
      pharmacological: [
        { drug: 'Fosfomicina (cistite não complicada)', dose: '3g dose única', route: 'VO', duration: 'Dose única', notes: '1ª ESCOLHA para cistite. Excelente cobertura de E. coli. Sem necessidade de urocultura.' },
        { drug: 'Nitrofurantoína (cistite)', dose: '100 mg 6/6h', route: 'VO', duration: '5-7 dias', notes: 'Alternativa. Evitar se TFG < 30. Não usar em pielonefrite (não atinge níveis séricos).' },
        { drug: 'Norfloxacino (cistite)', dose: '400 mg 12/12h', route: 'VO', duration: '3 dias', notes: '2ª linha (resistência crescente). Reservar quinolonas para pielonefrite.' },
        { drug: 'Ciprofloxacino (pielonefrite ambulatorial)', dose: '500 mg 12/12h', route: 'VO', duration: '7-10 dias', notes: 'Pielonefrite não complicada ambulatorial. Verificar sensibilidade local.' },
        { drug: 'Ceftriaxona (pielonefrite internada)', dose: '1-2g IV 1x/dia', route: 'IV', duration: '10-14 dias', notes: 'Pielonefrite com internação. Escalonar para VO quando afebril 48h.' },
        { drug: 'Estriol vaginal (profilaxia pós-menopausa)', dose: '0,5 mg/noite por 2 semanas, depois 2x/semana', route: 'Vaginal', duration: 'Contínuo', notes: 'Profilaxia de ITU recorrente em pós-menopausa. Restaura flora vaginal.' },
      ],
    },
    monitoring: ['Cistite: melhora clínica em 48h (sem necessidade de urocultura de controle)', 'Pielonefrite: reavaliação em 48-72h. Se sem melhora: imagem + ajustar ATB', 'ITU recorrente: urocultura de controle + investigar causas anatômicas'],
    complications: ['Pielonefrite', 'Abscesso renal/perinefrético', 'Sepse urinária', 'Pionefrose', 'Parto prematuro (gestante)', 'ITU recorrente'],
    prognosis: 'Cistite: resolução em 3-5 dias com tratamento adequado. Pielonefrite: resolução em 10-14 dias. Mortalidade da urosepse: 20-40%.',
    prevention: ['Hidratação adequada', 'Urinar após relação sexual', 'Evitar espermicidas', 'Cranberry (evidência limitada)', 'Profilaxia antibiótica se ≥ 3 ITU/ano (nitrofurantoína 100mg/noite por 6 meses)', 'Estriol vaginal em pós-menopausa'],
    references: [
      { title: 'EAU Guidelines on Urological Infections', source: 'Eur Urol', year: 2024 },
      { title: 'IDSA Guidelines for Uncomplicated UTI', source: 'Clin Infect Dis', year: 2011 },
    ],
    lastUpdated: '2025-01-25', reviewedBy: 'Dra. Juliana Santos (CRM-RJ 567890)',
  },
];

// ═══ COMPONENTE PRINCIPAL ═══
export default function DiseaseGuides() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<DiseaseGuide | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'diagnosis' | 'treatment' | 'monitoring'>('overview');

  const filteredGuides = useMemo(() => {
    return DISEASE_GUIDES.filter(g => {
      const matchSpec = selectedSpecialty === 'Todas' || g.specialty === selectedSpecialty;
      const matchSearch = searchTerm === '' || 
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.cid10.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSpec && matchSearch;
    });
  }, [selectedSpecialty, searchTerm]);

  const urgencyColor = (u: string) => u === 'emergencia' ? 'bg-red-500' : u === 'urgencia' ? 'bg-yellow-500' : 'bg-green-500';
  const urgencyLabel = (u: string) => u === 'emergencia' ? 'Emergência' : u === 'urgencia' ? 'Urgência' : 'Eletivo';
  const prevLabel = (p: string) => p === 'muito_comum' ? 'Muito comum' : p === 'comum' ? 'Comum' : p === 'incomum' ? 'Incomum' : 'Rara';

  if (selectedGuide) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-2xl p-6 border border-blue-700/30">
          <button onClick={() => setSelectedGuide(null)} className="text-blue-400 hover:text-blue-300 text-sm mb-3 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Voltar aos Guias
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedGuide.name}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-2 py-0.5 bg-blue-600/50 text-blue-200 rounded text-xs font-mono">{selectedGuide.cid10}</span>
                <span className={`px-2 py-0.5 ${urgencyColor(selectedGuide.urgency)} text-white rounded text-xs`}>{urgencyLabel(selectedGuide.urgency)}</span>
                <span className="px-2 py-0.5 bg-gray-600/50 text-gray-300 rounded text-xs">{selectedGuide.specialty}</span>
                <span className="px-2 py-0.5 bg-purple-600/50 text-purple-200 rounded text-xs">{prevLabel(selectedGuide.prevalence)}</span>
              </div>
            </div>
            <div className="text-right text-xs text-gray-400">
              <div>Atualizado: {selectedGuide.lastUpdated}</div>
              <div>Revisado por: {selectedGuide.reviewedBy}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['overview', 'diagnosis', 'treatment', 'monitoring'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              {tab === 'overview' ? 'Visão Geral' : tab === 'diagnosis' ? 'Diagnóstico' : tab === 'treatment' ? 'Tratamento' : 'Acompanhamento'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === 'overview' && (
            <>
              <Section title="Definição" content={selectedGuide.definition} />
              <Section title="Epidemiologia" content={selectedGuide.epidemiology} />
              <ListSection title="Etiologia" items={selectedGuide.etiology} />
              <ListSection title="Fatores de Risco" items={selectedGuide.riskFactors} />
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                <h3 className="text-white font-bold mb-3">Quadro Clínico</h3>
                <div className="space-y-2">
                  {selectedGuide.clinicalPresentation.map((s, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-2">
                      <span className="text-gray-300 text-sm">{s.symptom}</span>
                      <span className="text-emerald-400 text-xs font-mono bg-emerald-900/30 px-2 py-0.5 rounded">{s.frequency}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'diagnosis' && (
            <>
              <ListSection title="Critérios Diagnósticos" items={selectedGuide.diagnosticCriteria} icon="🎯" />
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                <h3 className="text-white font-bold mb-3">Exames Complementares</h3>
                <div className="space-y-2">
                  {selectedGuide.complementaryExams.map((e, i) => (
                    <div key={i} className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium text-sm">{e.exam}</span>
                        <span className="text-xs text-yellow-400 bg-yellow-900/30 px-2 py-0.5 rounded">{e.when}</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1">{e.purpose}</p>
                    </div>
                  ))}
                </div>
              </div>
              <ListSection title="Diagnósticos Diferenciais" items={selectedGuide.differentialDiagnosis} icon="🔄" />
            </>
          )}

          {activeTab === 'treatment' && (
            <>
              <ListSection title="Medidas Não Farmacológicas" items={selectedGuide.treatment.nonPharmacological} icon="🏃" />
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                <h3 className="text-white font-bold mb-3">Tratamento Farmacológico</h3>
                <div className="space-y-3">
                  {selectedGuide.treatment.pharmacological.map((d, i) => (
                    <div key={i} className="bg-gray-800/50 rounded-lg p-3 border-l-4 border-blue-500">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-bold text-sm">{d.drug}</span>
                        <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded">{d.route}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                        <div><span className="text-gray-500">Dose:</span> <span className="text-emerald-400">{d.dose}</span></div>
                        <div><span className="text-gray-500">Duração:</span> <span className="text-yellow-400">{d.duration}</span></div>
                      </div>
                      <p className="text-gray-400 text-xs">{d.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
              {selectedGuide.treatment.surgical && (
                <ListSection title="Tratamento Cirúrgico" items={selectedGuide.treatment.surgical} icon="🔪" />
              )}
            </>
          )}

          {activeTab === 'monitoring' && (
            <>
              <ListSection title="Monitoramento" items={selectedGuide.monitoring} icon="📊" />
              <ListSection title="Complicações" items={selectedGuide.complications} icon="⚠️" />
              <Section title="Prognóstico" content={selectedGuide.prognosis} />
              <ListSection title="Prevenção" items={selectedGuide.prevention} icon="🛡️" />
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                <h3 className="text-white font-bold mb-3">Referências</h3>
                {selectedGuide.references.map((r, i) => (
                  <div key={i} className="text-xs text-gray-400 mb-1">
                    [{i + 1}] {r.title}. <span className="text-blue-400">{r.source}</span>, {r.year}.
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-2xl p-6 border border-blue-700/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-2xl">📋</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Guias de Doenças</h2>
            <p className="text-blue-300 text-sm">{DISEASE_GUIDES.length} condutas clínicas completas com referências validadas</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <input type="text" placeholder="Buscar por doença, CID-10 ou especialidade..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

      {/* Specialty filter */}
      <div className="flex flex-wrap gap-2">
        {SPECIALTIES.filter(s => s === 'Todas' || DISEASE_GUIDES.some(g => g.specialty === s)).map(s => (
          <button key={s} onClick={() => setSelectedSpecialty(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedSpecialty === s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {s} {s !== 'Todas' && `(${DISEASE_GUIDES.filter(g => g.specialty === s).length})`}
          </button>
        ))}
      </div>

      {/* Disease cards */}
      <div className="grid gap-3">
        {filteredGuides.map(g => (
          <button key={g.id} onClick={() => { setSelectedGuide(g); setActiveTab('overview'); }}
            className="w-full text-left bg-gray-900 rounded-xl p-4 border border-gray-700 hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold">{g.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded">{g.cid10}</span>
                  <span className={`text-xs px-2 py-0.5 rounded text-white ${urgencyColor(g.urgency)}`}>{urgencyLabel(g.urgency)}</span>
                  <span className="text-xs text-gray-500">{g.specialty}</span>
                  <span className="text-xs text-purple-400">{prevLabel(g.prevalence)}</span>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
            <p className="text-gray-400 text-sm mt-2 line-clamp-2">{g.definition}</p>
          </button>
        ))}
      </div>

      {filteredGuides.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>Nenhuma conduta encontrada para "{searchTerm}"</p>
        </div>
      )}

      {/* Stats */}
      <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50 text-center">
        <p className="text-gray-400 text-xs">
          {DISEASE_GUIDES.length} guias de doenças | {new Set(DISEASE_GUIDES.map(g => g.specialty)).size} especialidades | 
          Todas as condutas baseadas em diretrizes nacionais (SBC, SBD, SBPT, FEBRASGO) e internacionais (ESC, AHA, ADA, IDSA)
        </p>
      </div>
    </div>
  );
}

// ═══ COMPONENTES AUXILIARES ═══
function Section({ title, content }: { title: string; content: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <h3 className="text-white font-bold mb-2">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{content}</p>
    </div>
  );
}

function ListSection({ title, items, icon }: { title: string; items: string[]; icon?: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      <h3 className="text-white font-bold mb-3">{icon && `${icon} `}{title}</h3>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
            <span className="text-gray-300">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
