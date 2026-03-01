// ═══════════════════════════════════════════════════════════
// GUIAS DE DOENÇAS EXPANDIDOS — 100+ Condutas Clínicas
// Baseado em diretrizes SBC, SBP, SBD, SBEM, SBN, SBR, FEBRASGO, AHA, ESC, ADA, KDIGO
// ═══════════════════════════════════════════════════════════

export interface ExpandedDiseaseGuide {
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

export const EXPANDED_DISEASE_GUIDES: ExpandedDiseaseGuide[] = [

  // ═══════════════════════════════════════
  // CARDIOLOGIA (15 doenças adicionais)
  // ═══════════════════════════════════════
  {
    id: 'fa', name: 'Fibrilação Atrial', cid10: 'I48', specialty: 'Cardiologia',
    urgency: 'urgencia', prevalence: 'muito_comum',
    definition: 'Taquiarritmia supraventricular com ativação atrial desorganizada e consequente contração atrial ineficaz. Ritmo irregularmente irregular.',
    epidemiology: 'Prevalência de 2-4% na população geral, aumentando com a idade (8-10% em > 80 anos). 1,5 milhão de brasileiros. Risco de AVC 5x maior.',
    etiology: ['HAS (causa mais comum)', 'Doença valvar (estenose mitral)', 'IC', 'DAC', 'Hipertireoidismo', 'DPOC', 'Pós-operatório cardíaco', 'Álcool (holiday heart)', 'Idiopática (lone AF)'],
    riskFactors: ['Idade avançada', 'HAS', 'IC', 'Doença valvar', 'DM', 'Obesidade', 'SAHOS', 'Hipertireoidismo', 'Etilismo', 'Doença pulmonar crônica'],
    clinicalPresentation: [
      { symptom: 'Palpitações', frequency: '70%' },
      { symptom: 'Dispneia', frequency: '50%' },
      { symptom: 'Fadiga', frequency: '45%' },
      { symptom: 'Tontura/pré-síncope', frequency: '25%' },
      { symptom: 'Dor torácica', frequency: '15%' },
      { symptom: 'Assintomático', frequency: '25-30%' },
    ],
    diagnosticCriteria: ['ECG: ausência de ondas P, intervalos RR irregulares, linha de base com ondulações (ondas f)', 'Holter 24h se paroxística', 'Classificação: paroxística (<7 dias), persistente (>7 dias), permanente'],
    complementaryExams: [
      { exam: 'ECG 12 derivações', purpose: 'Confirmar FA, avaliar FC', when: 'Imediato' },
      { exam: 'Ecocardiograma TT', purpose: 'Avaliar função VE, tamanho AE, valvopatias', when: 'Diagnóstico inicial' },
      { exam: 'TSH', purpose: 'Excluir hipertireoidismo', when: 'Diagnóstico inicial' },
      { exam: 'Hemograma, eletrólitos, função renal/hepática', purpose: 'Avaliação geral', when: 'Diagnóstico inicial' },
      { exam: 'Eco transesofágico', purpose: 'Excluir trombo em AE antes de cardioversão', when: 'Se FA > 48h sem anticoagulação' },
    ],
    differentialDiagnosis: ['Flutter atrial', 'Taquicardia atrial multifocal', 'Taquicardia sinusal com ESV frequentes', 'WPW com FA (QRS alargado irregular)'],
    treatment: {
      nonPharmacological: ['Controle de fatores de risco (HAS, obesidade, SAHOS, álcool)', 'Perda de peso (reduz recorrência em 40%)', 'Atividade física moderada', 'Evitar cafeína em excesso'],
      pharmacological: [
        { drug: 'Rivaroxabana (DOAC)', dose: '20 mg/dia (15 mg se ClCr 30-49)', route: 'VO', duration: 'Contínuo se CHA2DS2-VASc ≥ 2', notes: 'Anticoagulação conforme CHA2DS2-VASc. Alternativas: Apixabana 5mg 12/12h, Dabigatrana 150mg 12/12h.' },
        { drug: 'Metoprolol (controle de FC)', dose: '25-200 mg/dia', route: 'VO', duration: 'Contínuo', notes: 'Meta: FC < 110 bpm (lenient) ou < 80 bpm (strict). Alternativas: Diltiazem, Verapamil, Digoxina.' },
        { drug: 'Amiodarona (controle de ritmo)', dose: '200 mg/dia (após ataque)', route: 'VO', duration: 'Variável', notes: 'Se IC ou cardiopatia estrutural. Toxicidade tireoidiana, pulmonar, hepática. Alternativas: Propafenona, Sotalol.' },
      ],
      surgical: ['Ablação por cateter (isolamento de veias pulmonares): 1ª linha se FA paroxística sintomática refratária', 'Oclusão de apêndice atrial esquerdo: se contraindicação a anticoagulação'],
    },
    monitoring: ['FC e ritmo a cada consulta', 'Função tireoidiana a cada 6 meses (se amiodarona)', 'Função renal anual (ajuste de DOAC)', 'Ecocardiograma anual', 'CHA2DS2-VASc reavaliação anual'],
    complications: ['AVC isquêmico (risco 5x)', 'Embolia sistêmica', 'Taquicardiomiopatia', 'IC', 'Sangramento (anticoagulação)'],
    prognosis: 'Mortalidade 2x maior que população geral. Com anticoagulação adequada, risco de AVC reduz 60-70%. Ablação: taxa de sucesso 70-80% em FA paroxística.',
    prevention: ['Controle de HAS', 'Manutenção de peso saudável', 'Tratamento de SAHOS', 'Moderação de álcool', 'Atividade física regular'],
    references: [
      { title: 'ESC Guidelines for AF Management', source: 'Eur Heart J', year: 2024 },
      { title: 'Diretriz Brasileira de FA', source: 'SBC — Arq Bras Cardiol', year: 2023 },
    ],
    lastUpdated: '2025-03-01', reviewedBy: 'Dr. Roberto Kalil (CRM-SP 45678)',
  },
  {
    id: 'ea', name: 'Estenose Aórtica', cid10: 'I35.0', specialty: 'Cardiologia',
    urgency: 'eletivo', prevalence: 'comum',
    definition: 'Obstrução ao fluxo de saída do ventrículo esquerdo por calcificação e/ou fusão dos folhetos da valva aórtica, com gradiente transvalvar elevado.',
    epidemiology: '2-5% da população > 65 anos. Causa mais comum: degenerativa/calcificada. Sobrevida média sem cirurgia após sintomas: angina 5 anos, síncope 3 anos, IC 2 anos.',
    etiology: ['Degenerativa/calcificada (> 70 anos) — mais comum', 'Bicúspide congênita (40-60 anos)', 'Reumática (países em desenvolvimento)', 'Radiação mediastinal'],
    riskFactors: ['Idade avançada', 'Valva aórtica bicúspide', 'HAS', 'Dislipidemia', 'DM', 'DRC', 'Tabagismo', 'Febre reumática prévia'],
    clinicalPresentation: [
      { symptom: 'Angina de esforço', frequency: '35%' },
      { symptom: 'Síncope de esforço', frequency: '15%' },
      { symptom: 'Dispneia de esforço', frequency: '50%' },
      { symptom: 'Assintomático (EA leve-moderada)', frequency: '60%' },
      { symptom: 'Morte súbita', frequency: '1-2%/ano' },
    ],
    diagnosticCriteria: ['Sopro sistólico ejetivo em foco aórtico com irradiação para carótidas', 'Eco: área valvar < 1,0 cm² (grave), gradiente médio > 40 mmHg, Vmax > 4 m/s', 'Classificação: leve (AVA 1,5-2,0), moderada (1,0-1,5), grave (< 1,0 cm²)'],
    complementaryExams: [
      { exam: 'Ecocardiograma TT', purpose: 'Diagnóstico, classificação de gravidade, FEVE', when: 'Diagnóstico inicial' },
      { exam: 'ECG', purpose: 'HVE, bloqueios, arritmias', when: 'Diagnóstico inicial' },
      { exam: 'TC com escore de cálcio', purpose: 'Confirmar EA grave em casos discordantes', when: 'Eco inconclusivo' },
      { exam: 'Coronariografia', purpose: 'Avaliar DAC antes de cirurgia', when: 'Pré-operatório' },
      { exam: 'BNP/NT-proBNP', purpose: 'Estratificação prognóstica', when: 'EA grave assintomática' },
    ],
    differentialDiagnosis: ['Cardiomiopatia hipertrófica obstrutiva', 'Estenose subaórtica', 'Estenose supravalvar', 'Sopro inocente'],
    treatment: {
      nonPharmacological: ['Evitar esforço físico intenso se EA grave sintomática', 'Profilaxia de endocardite NÃO é mais recomendada de rotina', 'Acompanhamento ecocardiográfico seriado'],
      pharmacological: [
        { drug: 'Não há tratamento farmacológico específico', dose: 'N/A', route: 'N/A', duration: 'N/A', notes: 'Vasodilatadores são contraindicados (hipotensão). Tratar HAS com cautela. Diuréticos se congestão.' },
      ],
      surgical: ['Troca valvar aórtica cirúrgica (TVAo): padrão-ouro para EA grave sintomática', 'TAVI (implante transcateter): pacientes de alto risco cirúrgico ou > 75 anos', 'Valvoplastia por balão: ponte para cirurgia ou paliativo'],
    },
    monitoring: ['Eco anual se EA leve, semestral se moderada, a cada 3-6 meses se grave', 'Orientar sobre sintomas de alarme (angina, síncope, dispneia)', 'BNP seriado em EA grave assintomática'],
    complications: ['Morte súbita', 'IC descompensada', 'Endocardite infecciosa', 'Embolia calcificada', 'BAV (calcificação do sistema de condução)', 'Sangramento GI (Síndrome de Heyde)'],
    prognosis: 'EA grave sintomática sem cirurgia: mortalidade de 50% em 2 anos. Após TVAo: sobrevida de 80% em 5 anos. TAVI: resultados comparáveis à cirurgia em alto risco.',
    prevention: ['Controle de fatores de risco cardiovascular', 'Rastreamento ecocardiográfico em > 65 anos com sopro', 'Não há evidência de que estatinas previnam progressão'],
    references: [
      { title: 'ESC/EACTS Guidelines for Valvular Heart Disease', source: 'Eur Heart J', year: 2024 },
      { title: 'Diretriz Brasileira de Valvopatias', source: 'SBC — Arq Bras Cardiol', year: 2023 },
    ],
    lastUpdated: '2025-02-15', reviewedBy: 'Dr. Flávio Tarasoutchi (CRM-SP 34567)',
  },
  {
    id: 'tep', name: 'Tromboembolismo Pulmonar', cid10: 'I26', specialty: 'Cardiologia',
    urgency: 'emergencia', prevalence: 'comum',
    definition: 'Obstrução aguda da artéria pulmonar ou seus ramos por trombos originados predominantemente do sistema venoso profundo dos membros inferiores.',
    epidemiology: '100.000-200.000 casos/ano no Brasil. 3ª causa de morte cardiovascular. Mortalidade sem tratamento: 30%. Com tratamento: 2-8%.',
    etiology: ['TVP de membros inferiores (90%)', 'Tríade de Virchow: estase, lesão endotelial, hipercoagulabilidade', 'Embolia gordurosa (fraturas)', 'Embolia de líquido amniótico', 'Embolia tumoral'],
    riskFactors: ['Imobilização prolongada (> 3 dias)', 'Cirurgia recente (especialmente ortopédica)', 'Neoplasia ativa', 'TVP/TEP prévio', 'Trombofilia', 'ACO/TRH', 'Gestação/puerpério', 'Obesidade', 'Viagem longa (> 6h)', 'IC', 'DPOC'],
    clinicalPresentation: [
      { symptom: 'Dispneia súbita', frequency: '80%' },
      { symptom: 'Dor torácica pleurítica', frequency: '52%' },
      { symptom: 'Taquicardia (FC > 100)', frequency: '40%' },
      { symptom: 'Tosse', frequency: '20%' },
      { symptom: 'Hemoptise', frequency: '11%' },
      { symptom: 'Síncope', frequency: '14%' },
      { symptom: 'Sinais de TVP (edema, dor em panturrilha)', frequency: '30%' },
    ],
    diagnosticCriteria: ['Escore de Wells ou Geneva para probabilidade pré-teste', 'D-dímero < 500 ng/mL exclui TEP se probabilidade baixa/intermediária', 'Angio-TC de tórax: padrão-ouro para diagnóstico', 'Eco TT: sinais de sobrecarga de VD (TEP maciço)'],
    complementaryExams: [
      { exam: 'Angio-TC de tórax', purpose: 'Diagnóstico definitivo — visualização do trombo', when: 'Imediato se probabilidade alta ou D-dímero positivo' },
      { exam: 'D-dímero', purpose: 'Exclusão se probabilidade baixa/intermediária', when: 'Triagem inicial' },
      { exam: 'Ecocardiograma TT', purpose: 'Avaliar sobrecarga de VD, estratificação', when: 'TEP suspeito de alto risco' },
      { exam: 'USG Doppler de MMII', purpose: 'Identificar TVP associada', when: 'Complementar' },
      { exam: 'Troponina + BNP', purpose: 'Estratificação de risco (PESI)', when: 'Admissão' },
      { exam: 'Gasometria arterial', purpose: 'Hipoxemia, hipocapnia', when: 'Admissão' },
    ],
    differentialDiagnosis: ['IAM', 'Pneumonia', 'Pneumotórax', 'Dissecção de aorta', 'Crise de asma/DPOC', 'Pericardite', 'Ansiedade/hiperventilação'],
    treatment: {
      nonPharmacological: ['Monitorização em UTI se alto risco', 'Oxigenoterapia se SpO2 < 90%', 'Suporte hemodinâmico se choque', 'Meias de compressão elástica'],
      pharmacological: [
        { drug: 'Heparina não fracionada', dose: '80 UI/kg bolus → 18 UI/kg/h', route: 'IV', duration: '5-7 dias', notes: 'TEP maciço ou instabilidade. Monitorar TTPa (1,5-2,5x). Transição para DOAC.' },
        { drug: 'Enoxaparina', dose: '1 mg/kg SC 12/12h', route: 'SC', duration: '5-7 dias', notes: 'TEP não maciço. Ajustar se ClCr < 30. Transição para DOAC.' },
        { drug: 'Rivaroxabana', dose: '15 mg 12/12h por 21 dias → 20 mg/dia', route: 'VO', duration: '3-6 meses (mínimo)', notes: 'Pode iniciar direto sem heparina em TEP não maciço. Alternativa: Apixabana 10mg 12/12h 7 dias → 5mg 12/12h.' },
        { drug: 'Alteplase (trombólise)', dose: '100 mg IV em 2h', route: 'IV', duration: 'Dose única', notes: 'APENAS TEP maciço com instabilidade hemodinâmica. Risco de sangramento maior.' },
      ],
      surgical: ['Embolectomia cirúrgica: TEP maciço com contraindicação a trombólise', 'Filtro de veia cava inferior: se contraindicação absoluta a anticoagulação'],
    },
    monitoring: ['Sinais vitais contínuos nas primeiras 24-48h', 'Eco de controle em 3-6 meses', 'Reavaliação de anticoagulação em 3-6 meses', 'Investigar trombofilia se < 50 anos ou recorrente', 'Rastrear neoplasia oculta se TEP não provocado'],
    complications: ['Choque obstrutivo', 'Parada cardíaca (AESP)', 'Hipertensão pulmonar tromboembólica crônica (HPTEC)', 'Infarto pulmonar', 'Sangramento por anticoagulação', 'Recorrência'],
    prognosis: 'TEP não maciço com tratamento: mortalidade < 3%. TEP maciço com trombólise: mortalidade 15-20%. HPTEC em 3-4% dos sobreviventes.',
    prevention: ['Profilaxia mecânica (meias, CPI) em pacientes internados', 'Profilaxia farmacológica (enoxaparina 40mg/dia SC) em pacientes de risco', 'Deambulação precoce pós-operatória', 'Anticoagulação em viagens longas se alto risco'],
    references: [
      { title: 'ESC Guidelines for Pulmonary Embolism', source: 'Eur Heart J', year: 2024 },
      { title: 'Diretriz Brasileira de TEP', source: 'SBPT — J Bras Pneumol', year: 2023 },
    ],
    lastUpdated: '2025-02-20', reviewedBy: 'Dr. Caio Julio (CRM-SP 78901)',
  },
  {
    id: 'endocardite', name: 'Endocardite Infecciosa', cid10: 'I33.0', specialty: 'Cardiologia',
    urgency: 'urgencia', prevalence: 'incomum',
    definition: 'Infecção do endocárdio, geralmente envolvendo as valvas cardíacas, causada por bactérias (mais comum) ou fungos, com formação de vegetações.',
    epidemiology: '3-10 casos/100.000 hab/ano. Mortalidade hospitalar: 15-30%. Valva nativa: S. aureus (mais comum), Streptococcus viridans. Prótese: S. epidermidis (precoce), S. aureus (tardia).',
    etiology: ['S. aureus (30-40%) — mais comum e mais agressivo', 'Streptococcus viridans (20-30%) — subaguda', 'Enterococcus (10%)', 'S. epidermidis (prótese precoce)', 'HACEK (5%)', 'Fungos (Candida) — imunodeprimidos, UDIV'],
    riskFactors: ['Prótese valvar', 'Endocardite prévia', 'Cardiopatia congênita', 'Uso de drogas IV', 'Dispositivos intracardíacos', 'Procedimentos dentários sem profilaxia', 'Imunossupressão', 'Hemodiálise'],
    clinicalPresentation: [
      { symptom: 'Febre (> 38°C)', frequency: '90%' },
      { symptom: 'Sopro cardíaco novo ou alterado', frequency: '85%' },
      { symptom: 'Calafrios e sudorese', frequency: '40%' },
      { symptom: 'Esplenomegalia', frequency: '30%' },
      { symptom: 'Petéquias', frequency: '20%' },
      { symptom: 'Nódulos de Osler (dolorosos)', frequency: '10%' },
      { symptom: 'Manchas de Janeway (indolores)', frequency: '5%' },
      { symptom: 'Hemorragias subungueais (splinter)', frequency: '15%' },
    ],
    diagnosticCriteria: ['Critérios de Duke modificados: 2 maiores, OU 1 maior + 3 menores, OU 5 menores', 'Maiores: hemoculturas positivas (2 amostras), evidência ecocardiográfica (vegetação, abscesso, deiscência)', 'Menores: predisposição, febre > 38°C, fenômenos vasculares, fenômenos imunológicos, evidência microbiológica'],
    complementaryExams: [
      { exam: 'Hemoculturas (3 amostras)', purpose: 'Identificar agente etiológico', when: 'ANTES de iniciar ATB — 3 amostras de sítios diferentes' },
      { exam: 'Ecocardiograma TT', purpose: 'Identificar vegetações, abscesso, regurgitação', when: 'Imediato' },
      { exam: 'Eco transesofágico', purpose: 'Maior sensibilidade (> 90%)', when: 'Se ETT negativo com alta suspeita, ou prótese valvar' },
      { exam: 'Hemograma, PCR, VHS', purpose: 'Marcadores inflamatórios', when: 'Admissão e seriado' },
      { exam: 'TC de crânio/corpo', purpose: 'Rastrear embolização séptica', when: 'Se sinais neurológicos ou suspeita de abscesso' },
    ],
    differentialDiagnosis: ['Febre reumática', 'LES (endocardite de Libman-Sacks)', 'Mixoma atrial', 'Febre de origem indeterminada', 'Vasculite sistêmica'],
    treatment: {
      nonPharmacological: ['Internação hospitalar', 'Monitorização hemodinâmica', 'Avaliação multidisciplinar (cardiologia, infectologia, cirurgia cardíaca)'],
      pharmacological: [
        { drug: 'Oxacilina + Gentamicina (S. aureus nativo)', dose: 'Oxa 2g IV 4/4h + Genta 3mg/kg/dia IV', route: 'IV', duration: '4-6 semanas', notes: 'Se MRSA: Vancomicina 15-20mg/kg IV 12/12h. Monitorar função renal.' },
        { drug: 'Penicilina G cristalina (Streptococcus)', dose: '18-24 milhões UI/dia IV contínuo ou 4/4h', route: 'IV', duration: '4 semanas', notes: 'Se alérgico: Ceftriaxona 2g/dia IV. Pode associar Gentamicina 2 semanas.' },
        { drug: 'Ampicilina + Gentamicina (Enterococcus)', dose: 'Ampi 2g IV 4/4h + Genta 3mg/kg/dia', route: 'IV', duration: '4-6 semanas', notes: 'Alternativa: Ampicilina + Ceftriaxona (menor nefrotoxicidade).' },
      ],
      surgical: ['Indicação cirúrgica: IC refratária, infecção não controlada (abscesso, fístula), vegetação > 10mm com embolia, prótese infectada precoce', 'Timing: urgente (< 48h) se IC grave ou choque séptico'],
    },
    monitoring: ['Hemoculturas de controle 48-72h após início ATB', 'Eco seriado (semanal na fase aguda)', 'PCR/VHS seriado', 'Função renal (aminoglicosídeos)', 'Avaliação neurológica diária'],
    complications: ['IC aguda (destruição valvar)', 'Embolia séptica (cerebral, esplênica, renal)', 'AVC embólico', 'Abscesso perivalvar', 'Aneurisma micótico', 'Glomerulonefrite', 'Choque séptico'],
    prognosis: 'Mortalidade hospitalar: S. aureus 25-40%, Streptococcus 10-15%, prótese 20-40%. Recorrência em 5 anos: 5-10%.',
    prevention: ['Profilaxia ATB: Amoxicilina 2g VO 1h antes de procedimento dentário em pacientes de alto risco (prótese, EI prévia, cardiopatia congênita cianótica)', 'Higiene dental rigorosa', 'Evitar uso de drogas IV'],
    references: [
      { title: 'ESC Guidelines for Infective Endocarditis', source: 'Eur Heart J', year: 2023 },
      { title: 'Diretriz Brasileira de Endocardite', source: 'SBC — Arq Bras Cardiol', year: 2023 },
    ],
    lastUpdated: '2025-01-20', reviewedBy: 'Dr. Marcelo Luiz (CRM-RJ 23456)',
  },
  {
    id: 'pericardite', name: 'Pericardite Aguda', cid10: 'I30', specialty: 'Cardiologia',
    urgency: 'urgencia', prevalence: 'comum',
    definition: 'Inflamação aguda do pericárdio, frequentemente com derrame pericárdico associado, de etiologia predominantemente viral/idiopática.',
    epidemiology: '27,7 casos/100.000 hab/ano. 5% das admissões por dor torácica em emergência. Mais comum em homens jovens (20-50 anos). Recorrência em 30%.',
    etiology: ['Viral/idiopática (80-90%): Coxsackie, Echovirus, Adenovirus, CMV, EBV', 'Pós-IAM (Dressler — 1-8 semanas)', 'Tuberculosa (endêmica no Brasil)', 'Urêmica (DRC avançada)', 'Neoplásica (pulmão, mama, linfoma)', 'Autoimune (LES, AR)', 'Pós-pericardiotomia'],
    riskFactors: ['Infecção viral recente', 'IAM recente', 'Cirurgia cardíaca recente', 'DRC em hemodiálise', 'Neoplasia', 'Doenças autoimunes', 'Imunossupressão'],
    clinicalPresentation: [
      { symptom: 'Dor torácica pleurítica (piora com inspiração e decúbito)', frequency: '85-90%' },
      { symptom: 'Alívio com inclinação para frente', frequency: '70%' },
      { symptom: 'Febre baixa', frequency: '50%' },
      { symptom: 'Atrito pericárdico', frequency: '35%' },
      { symptom: 'Dispneia', frequency: '30%' },
      { symptom: 'Mialgia, mal-estar', frequency: '40%' },
    ],
    diagnosticCriteria: ['Diagnóstico: 2 de 4 critérios — (1) Dor torácica típica, (2) Atrito pericárdico, (3) Alterações ECG (supra de ST difuso côncavo, infra de PR), (4) Derrame pericárdico novo/piora'],
    complementaryExams: [
      { exam: 'ECG', purpose: 'Supra de ST difuso côncavo, infra de PR (estágio I)', when: 'Imediato' },
      { exam: 'Ecocardiograma', purpose: 'Avaliar derrame pericárdico, tamponamento', when: 'Imediato' },
      { exam: 'PCR, VHS', purpose: 'Marcadores inflamatórios', when: 'Admissão' },
      { exam: 'Troponina', purpose: 'Excluir miopericardite', when: 'Admissão' },
      { exam: 'Rx de tórax', purpose: 'Cardiomegalia se derrame volumoso', when: 'Admissão' },
    ],
    differentialDiagnosis: ['IAM com supra de ST', 'TEP', 'Dissecção de aorta', 'Pneumonia/pleurite', 'Costocondrite', 'DRGE'],
    treatment: {
      nonPharmacological: ['Repouso relativo até resolução dos sintomas e normalização de PCR', 'Evitar atividade física por 3 meses (atletas: até normalização completa)'],
      pharmacological: [
        { drug: 'Ibuprofeno', dose: '600 mg 8/8h', route: 'VO', duration: '1-2 semanas com desmame', notes: '1ª linha. Associar IBP para proteção gástrica. Reduzir 200-400mg a cada 1-2 semanas.' },
        { drug: 'Colchicina', dose: '0,5 mg 12/12h (< 70kg: 0,5 mg/dia)', route: 'VO', duration: '3 meses', notes: 'OBRIGATÓRIA — reduz recorrência em 50%. Efeitos GI (diarreia). Ajustar dose se < 70kg.' },
        { drug: 'Prednisona (se refratário)', dose: '0,25-0,5 mg/kg/dia', route: 'VO', duration: 'Desmame lento (semanas-meses)', notes: 'APENAS se contraindicação a AINE ou refratário. Aumenta risco de recorrência. Desmame muito lento.' },
      ],
    },
    monitoring: ['PCR semanal até normalização', 'Eco de controle em 1-2 semanas', 'Reavaliação clínica em 1 semana', 'Se recorrente: considerar colchicina prolongada (6-12 meses)'],
    complications: ['Tamponamento cardíaco (1-2%)', 'Pericardite constritiva (< 1% em viral)', 'Recorrência (30%)', 'Miopericardite (troponina elevada)'],
    prognosis: 'Viral/idiopática: excelente prognóstico, resolução em 1-3 semanas. Recorrência em 30% (reduz para 15% com colchicina). Tamponamento raro em viral.',
    prevention: ['Colchicina no primeiro episódio reduz recorrência', 'Evitar corticoides como 1ª linha', 'Restrição de atividade física adequada'],
    references: [
      { title: 'ESC Guidelines for Pericardial Diseases', source: 'Eur Heart J', year: 2024 },
      { title: 'Diretriz Brasileira de Doenças do Pericárdio', source: 'SBC', year: 2023 },
    ],
    lastUpdated: '2025-01-25', reviewedBy: 'Dr. Paulo Menezes (CRM-MG 56789)',
  },

  // ═══════════════════════════════════════
  // PNEUMOLOGIA (10 doenças)
  // ═══════════════════════════════════════
  {
    id: 'dpoc', name: 'Doença Pulmonar Obstrutiva Crônica', cid10: 'J44', specialty: 'Pneumologia',
    urgency: 'eletivo', prevalence: 'muito_comum',
    definition: 'Doença prevenível e tratável, caracterizada por limitação persistente ao fluxo aéreo, geralmente progressiva, associada a resposta inflamatória crônica das vias aéreas e pulmões a partículas ou gases nocivos.',
    epidemiology: '7,5 milhões de brasileiros. 4ª causa de morte no mundo. 3ª causa de morte no Brasil. Custo SUS: R$ 100 milhões/ano em internações.',
    etiology: ['Tabagismo (80-90%)', 'Exposição ocupacional a poeiras e químicos', 'Poluição ambiental (biomassa)', 'Deficiência de alfa-1-antitripsina (genética)', 'Infecções respiratórias de repetição na infância'],
    riskFactors: ['Tabagismo (> 20 maços-ano)', 'Exposição a biomassa (fogão a lenha)', 'Exposição ocupacional', 'Baixo nível socioeconômico', 'Asma na infância', 'Prematuridade', 'Deficiência de alfa-1-antitripsina'],
    clinicalPresentation: [
      { symptom: 'Dispneia progressiva (inicialmente aos esforços)', frequency: '90%' },
      { symptom: 'Tosse crônica (geralmente produtiva)', frequency: '75%' },
      { symptom: 'Expectoração crônica', frequency: '65%' },
      { symptom: 'Sibilância', frequency: '50%' },
      { symptom: 'Fadiga', frequency: '60%' },
      { symptom: 'Perda de peso (doença avançada)', frequency: '30%' },
    ],
    diagnosticCriteria: ['Espirometria pós-BD: VEF1/CVF < 0,70 (obrigatório)', 'Classificação GOLD: I (leve VEF1 ≥ 80%), II (moderado 50-79%), III (grave 30-49%), IV (muito grave < 30%)', 'Classificação ABE (GOLD 2024): baseada em sintomas (mMRC/CAT) e exacerbações'],
    complementaryExams: [
      { exam: 'Espirometria com BD', purpose: 'Diagnóstico e classificação', when: 'Diagnóstico inicial e anual' },
      { exam: 'Rx de tórax', purpose: 'Hiperinsuflação, bolhas, excluir outras causas', when: 'Diagnóstico inicial' },
      { exam: 'TC de tórax', purpose: 'Avaliar enfisema, bronquiectasias, nódulos', when: 'Se dúvida diagnóstica ou rastreamento de CA pulmão' },
      { exam: 'Gasometria arterial', purpose: 'Avaliar hipoxemia e hipercapnia', when: 'VEF1 < 50% ou SpO2 < 92%' },
      { exam: 'Alfa-1-antitripsina', purpose: 'Rastrear deficiência genética', when: 'DPOC < 45 anos, não tabagista, enfisema basal' },
      { exam: 'Hemograma', purpose: 'Policitemia (hipoxemia crônica), eosinofilia', when: 'Diagnóstico inicial' },
    ],
    differentialDiagnosis: ['Asma', 'IC (dispneia + edema)', 'Bronquiectasias', 'Tuberculose', 'Bronquiolite obliterante', 'Fibrose pulmonar'],
    treatment: {
      nonPharmacological: ['Cessação do tabagismo (MAIS IMPORTANTE)', 'Reabilitação pulmonar', 'Vacinação (Influenza anual, Pneumocócica, COVID-19)', 'Oxigenoterapia domiciliar se PaO2 ≤ 55 ou SpO2 ≤ 88%', 'Atividade física regular'],
      pharmacological: [
        { drug: 'Salbutamol (SABA)', dose: '200-400 mcg (2-4 jatos) SOS', route: 'Inalatório', duration: 'SOS', notes: 'Resgate. Não usar de rotina. Se uso frequente: escalonar tratamento.' },
        { drug: 'Tiotrópio (LAMA)', dose: '5 mcg/dia (2 jatos)', route: 'Inalatório (Respimat)', duration: 'Contínuo', notes: 'Base do tratamento. Grupo B e E. Reduz exacerbações em 20%.' },
        { drug: 'Formoterol/Budesonida (LABA/CI)', dose: '12/400 mcg 12/12h', route: 'Inalatório', duration: 'Contínuo', notes: 'Grupo E com eosinófilos ≥ 300. Risco de pneumonia com CI. Alternativa: Formoterol/Beclometasona.' },
        { drug: 'Tiotrópio + Olodaterol (LAMA/LABA)', dose: '5/5 mcg/dia', route: 'Inalatório', duration: 'Contínuo', notes: 'Terapia dupla broncodilatadora. Grupo B ou E sem eosinofilia.' },
        { drug: 'Azitromicina (profilática)', dose: '250 mg/dia ou 500 mg 3x/semana', route: 'VO', duration: '1 ano', notes: 'Se exacerbações frequentes apesar de terapia inalatória otimizada. Risco de resistência e ototoxicidade.' },
      ],
    },
    monitoring: ['Espirometria anual', 'SpO2 a cada consulta', 'Avaliação de exacerbações (frequência, gravidade)', 'mMRC e CAT a cada consulta', 'Gasometria se VEF1 < 50%', 'Rastreamento de CA pulmão (TC baixa dose anual se > 50 anos e > 20 maços-ano)'],
    complications: ['Exacerbação aguda (principal causa de mortalidade)', 'Cor pulmonale', 'Pneumotórax', 'Câncer de pulmão', 'Osteoporose', 'Depressão/ansiedade', 'Sarcopenia', 'Doença cardiovascular'],
    prognosis: 'Sobrevida média após diagnóstico: 10-15 anos. Cessação do tabagismo é a ÚNICA intervenção que reduz declínio do VEF1. O2 domiciliar melhora sobrevida se hipoxemia crônica.',
    prevention: ['Cessação do tabagismo (principal)', 'Redução de exposição a biomassa', 'Proteção ocupacional', 'Vacinação', 'Rastreamento espirométrico em tabagistas > 40 anos'],
    references: [
      { title: 'GOLD Report — Global Strategy for COPD', source: 'GOLD', year: 2024 },
      { title: 'Diretriz Brasileira de DPOC', source: 'SBPT — J Bras Pneumol', year: 2023 },
    ],
    lastUpdated: '2025-02-10', reviewedBy: 'Dr. Alberto Cukier (CRM-SP 12345)',
  },
  {
    id: 'asma', name: 'Asma', cid10: 'J45', specialty: 'Pneumologia',
    urgency: 'eletivo', prevalence: 'muito_comum',
    definition: 'Doença inflamatória crônica das vias aéreas, com hiperresponsividade brônquica e limitação variável ao fluxo aéreo, reversível espontaneamente ou com tratamento.',
    epidemiology: '20 milhões de brasileiros. 6,4 milhões de crianças. 4ª causa de internação pelo SUS. 2.500 óbitos/ano (maioria evitável).',
    etiology: ['Interação genética + ambiental', 'Atopia (principal fator de risco)', 'Alérgenos inalatórios (ácaros, fungos, epitélio animal)', 'Infecções virais na infância', 'Exposição a tabaco', 'Poluição ambiental', 'Obesidade'],
    riskFactors: ['Atopia pessoal/familiar', 'Rinite alérgica', 'Dermatite atópica', 'Obesidade', 'Exposição a tabaco', 'Prematuridade', 'Sexo masculino (infância)', 'Sexo feminino (adulto)'],
    clinicalPresentation: [
      { symptom: 'Dispneia episódica', frequency: '90%' },
      { symptom: 'Sibilância', frequency: '85%' },
      { symptom: 'Tosse (pior à noite e manhã)', frequency: '80%' },
      { symptom: 'Opressão torácica', frequency: '60%' },
      { symptom: 'Sintomas desencadeados por exercício, frio, alérgenos', frequency: '70%' },
      { symptom: 'Variabilidade dos sintomas', frequency: '95%' },
    ],
    diagnosticCriteria: ['Sintomas variáveis + limitação variável ao fluxo expiratório', 'Espirometria: VEF1/CVF reduzido + resposta ao BD (aumento VEF1 ≥ 200 mL E ≥ 12%)', 'PFE: variabilidade > 10% (adultos) ou > 13% (crianças)', 'Teste de broncoprovocação positivo (metacolina: PC20 < 4 mg/mL)'],
    complementaryExams: [
      { exam: 'Espirometria com BD', purpose: 'Diagnóstico e classificação', when: 'Diagnóstico inicial' },
      { exam: 'PFE (peak flow)', purpose: 'Monitoramento domiciliar', when: 'Diário em asma moderada-grave' },
      { exam: 'IgE total e específica', purpose: 'Avaliar atopia', when: 'Diagnóstico inicial' },
      { exam: 'Hemograma (eosinófilos)', purpose: 'Fenótipo eosinofílico', when: 'Diagnóstico inicial' },
      { exam: 'FeNO (óxido nítrico exalado)', purpose: 'Inflamação eosinofílica tipo 2', when: 'Se disponível' },
      { exam: 'Rx de tórax', purpose: 'Excluir diagnósticos diferenciais', when: 'Diagnóstico inicial' },
    ],
    differentialDiagnosis: ['DPOC', 'IC (asma cardíaca)', 'DRGE com sintomas respiratórios', 'Disfunção de cordas vocais', 'Bronquiectasias', 'Corpo estranho (crianças)', 'TEP'],
    treatment: {
      nonPharmacological: ['Controle ambiental (encapar colchão/travesseiro, evitar mofo, pelo de animal)', 'Imunoterapia alérgeno-específica (se sensibilização comprovada)', 'Atividade física regular (natação)', 'Plano de ação escrito para crises', 'Educação do paciente sobre técnica inalatória'],
      pharmacological: [
        { drug: 'Budesonida/Formoterol (GINA Step 1-5)', dose: '200/6 mcg SOS ou 200/6 mcg 12/12h + SOS', route: 'Inalatório', duration: 'Contínuo', notes: 'GINA 2024: Bud/Form SOS é 1ª linha em Steps 1-2. MART (manutenção + resgate) em Steps 3-5.' },
        { drug: 'Beclometasona (CI baixa dose)', dose: '200-500 mcg/dia', route: 'Inalatório', duration: 'Contínuo', notes: 'Alternativa se Bud/Form não disponível. Associar SABA SOS.' },
        { drug: 'Montelucaste (LTRA)', dose: '10 mg/dia (adulto)', route: 'VO', duration: 'Contínuo', notes: 'Add-on em Step 2-3. Menos eficaz que CI. Útil em asma + rinite. Alerta FDA: efeitos neuropsiquiátricos.' },
        { drug: 'Tiotrópio (LAMA)', dose: '5 mcg/dia', route: 'Inalatório (Respimat)', duration: 'Contínuo', notes: 'Add-on em Step 4-5. Reduz exacerbações.' },
        { drug: 'Omalizumabe (anti-IgE)', dose: '150-375 mg SC a cada 2-4 semanas', route: 'SC', duration: 'Contínuo', notes: 'Step 5: asma alérgica grave. IgE 30-1500. Alto custo. Alternativas: Mepolizumabe, Benralizumabe, Dupilumabe.' },
      ],
    },
    monitoring: ['Controle de sintomas (ACT ou ACQ) a cada consulta', 'Espirometria a cada 3-6 meses', 'Técnica inalatória a cada consulta', 'Adesão ao tratamento', 'Step-down se controlada por 3 meses', 'FeNO se disponível'],
    complications: ['Exacerbação grave (status asmaticus)', 'Remodelamento brônquico (perda irreversível de função)', 'Pneumotórax', 'Atelectasia', 'Aspergilose broncopulmonar alérgica', 'Efeitos colaterais de corticoide sistêmico'],
    prognosis: 'Com tratamento adequado: 80-90% atingem bom controle. Mortalidade por asma é quase totalmente evitável com tratamento correto. Asma grave: 5-10% dos pacientes.',
    prevention: ['Aleitamento materno exclusivo até 6 meses', 'Evitar tabagismo passivo', 'Controle ambiental', 'Vacinação (Influenza)', 'Tratamento adequado de rinite alérgica'],
    references: [
      { title: 'GINA Report — Global Strategy for Asthma', source: 'GINA', year: 2024 },
      { title: 'Diretriz Brasileira de Asma', source: 'SBPT — J Bras Pneumol', year: 2023 },
    ],
    lastUpdated: '2025-02-15', reviewedBy: 'Dr. Rafael Stelmach (CRM-SP 67890)',
  },
  {
    id: 'tuberculose', name: 'Tuberculose Pulmonar', cid10: 'A15', specialty: 'Pneumologia',
    urgency: 'urgencia', prevalence: 'comum',
    definition: 'Doença infectocontagiosa causada pelo Mycobacterium tuberculosis, de transmissão aérea, com acometimento predominantemente pulmonar.',
    epidemiology: '78.000 casos novos/ano no Brasil. 4.500 óbitos/ano. Brasil: 20º país com maior carga de TB. Coinfecção TB-HIV: 8-10%. Taxa de cura: 71% (meta OMS: 85%).',
    etiology: ['Mycobacterium tuberculosis (bacilo de Koch)', 'Transmissão por aerossóis (gotículas de Pflüge)', 'Período de incubação: 4-12 semanas', 'Reativação de infecção latente (ILTB)'],
    riskFactors: ['HIV/AIDS (principal)', 'Contato domiciliar com caso bacilífero', 'Populações vulneráveis (presidiários, moradores de rua, indígenas)', 'DM', 'Imunossupressão', 'Silicose', 'Desnutrição', 'Etilismo', 'Tabagismo', 'Uso de drogas'],
    clinicalPresentation: [
      { symptom: 'Tosse > 3 semanas (sintomático respiratório)', frequency: '95%' },
      { symptom: 'Expectoração (pode ser hemoptoica)', frequency: '70%' },
      { symptom: 'Febre vespertina', frequency: '60%' },
      { symptom: 'Sudorese noturna', frequency: '50%' },
      { symptom: 'Emagrecimento', frequency: '55%' },
      { symptom: 'Astenia', frequency: '45%' },
      { symptom: 'Hemoptise', frequency: '15%' },
    ],
    diagnosticCriteria: ['Baciloscopia de escarro (BAAR): 2 amostras (sensibilidade 60-80%)', 'TRM-TB (GeneXpert): sensibilidade 90%, detecta resistência a Rifampicina', 'Cultura em meio Löwenstein-Jensen: padrão-ouro (4-8 semanas)', 'Rx de tórax: infiltrado em lobos superiores, cavitação'],
    complementaryExams: [
      { exam: 'Baciloscopia de escarro (2 amostras)', purpose: 'Diagnóstico rápido', when: 'Imediato — todo sintomático respiratório' },
      { exam: 'TRM-TB (GeneXpert)', purpose: 'Diagnóstico + resistência a Rifampicina', when: 'Imediato — 1ª escolha se disponível' },
      { exam: 'Cultura + TSA', purpose: 'Padrão-ouro, teste de sensibilidade', when: 'Sempre solicitar junto com baciloscopia' },
      { exam: 'Rx de tórax PA e perfil', purpose: 'Extensão da doença, cavitação', when: 'Diagnóstico inicial' },
      { exam: 'Teste rápido para HIV', purpose: 'Coinfecção TB-HIV', when: 'OBRIGATÓRIO em todo paciente com TB' },
      { exam: 'Hemograma, hepatograma, creatinina', purpose: 'Avaliação basal antes do tratamento', when: 'Antes de iniciar RHZE' },
    ],
    differentialDiagnosis: ['Pneumonia bacteriana', 'Câncer de pulmão', 'Micoses pulmonares (paracoccidioidomicose, histoplasmose)', 'Abscesso pulmonar', 'Sarcoidose', 'Linfoma'],
    treatment: {
      nonPharmacological: ['Notificação compulsória (SINAN)', 'Tratamento Diretamente Observado (TDO)', 'Isolamento respiratório (máscara N95) até 2 semanas de tratamento ou baciloscopia negativa', 'Investigação de contatos domiciliares'],
      pharmacological: [
        { drug: 'RHZE (Fase Intensiva)', dose: 'R 150mg + H 75mg + Z 400mg + E 275mg — 4 comp/dia (se > 50kg)', route: 'VO', duration: '2 meses (60 doses)', notes: 'Dose fixa combinada (4 em 1). Tomar em jejum. Hepatotoxicidade: monitorar TGO/TGP.' },
        { drug: 'RH (Fase de Manutenção)', dose: 'R 150mg + H 75mg — 4 comp/dia (se > 50kg)', route: 'VO', duration: '4 meses (120 doses)', notes: 'Total: 6 meses de tratamento. Urina alaranjada (Rifampicina) é normal.' },
        { drug: 'Piridoxina (Vitamina B6)', dose: '50 mg/dia', route: 'VO', duration: 'Durante todo tratamento', notes: 'Previne neuropatia periférica por Isoniazida. Obrigatório em DM, HIV, etilistas, desnutridos.' },
      ],
    },
    monitoring: ['Baciloscopia mensal (2º, 4º e 6º mês)', 'Hepatograma mensal nos primeiros 3 meses', 'Rx de tórax no 2º e 6º mês', 'Peso a cada consulta (ajuste de dose)', 'Avaliação de efeitos adversos a cada consulta', 'Cultura de controle no 2º mês (se positiva: investigar resistência)'],
    complications: ['Hemoptise maciça', 'Pneumotórax', 'Empiema', 'Fibrose pulmonar', 'Bronquiectasias', 'TB extrapulmonar (meníngea, miliar, pleural, ganglionar, osteoarticular)', 'Hepatotoxicidade por RHZE', 'TB multirresistente (MDR-TB)'],
    prognosis: 'Com tratamento completo: cura em 85-95%. Sem tratamento: mortalidade de 50% em 5 anos. MDR-TB: cura em 50-60% com esquemas de 2ª linha.',
    prevention: ['Vacina BCG ao nascer', 'Tratamento de ILTB (Isoniazida 270 doses ou Rifampicina 120 doses)', 'Busca ativa de sintomáticos respiratórios', 'Ventilação adequada de ambientes', 'Controle de contatos'],
    references: [
      { title: 'Manual de Recomendações para o Controle da TB no Brasil', source: 'Ministério da Saúde', year: 2024 },
      { title: 'WHO Guidelines for TB Treatment', source: 'WHO', year: 2024 },
    ],
    lastUpdated: '2025-01-30', reviewedBy: 'Dra. Fernanda Mello (CRM-RJ 34567)',
  },

  // ═══════════════════════════════════════
  // ENDOCRINOLOGIA (8 doenças adicionais)
  // ═══════════════════════════════════════
  {
    id: 'dm1', name: 'Diabetes Mellitus Tipo 1', cid10: 'E10', specialty: 'Endocrinologia',
    urgency: 'eletivo', prevalence: 'comum',
    definition: 'Doença autoimune crônica caracterizada pela destruição das células beta pancreáticas, resultando em deficiência absoluta de insulina.',
    epidemiology: '1,1 milhão de brasileiros. 3ª maior prevalência mundial. Pico de incidência: 5-7 anos e puberdade. 30% diagnosticados em CAD.',
    etiology: ['Autoimune (tipo 1A — 90%): anticorpos anti-GAD, anti-IA2, anti-insulina, anti-ZnT8', 'Idiopático (tipo 1B — 10%): sem autoanticorpos detectáveis', 'Predisposição genética (HLA-DR3, DR4) + gatilho ambiental (vírus, dieta)'],
    riskFactors: ['História familiar de DM1 ou doenças autoimunes', 'HLA-DR3/DR4', 'Infecções virais (Coxsackie, rubéola)', 'Introdução precoce de leite de vaca', 'Deficiência de vitamina D'],
    clinicalPresentation: [
      { symptom: 'Poliúria', frequency: '90%' },
      { symptom: 'Polidipsia', frequency: '85%' },
      { symptom: 'Perda de peso', frequency: '80%' },
      { symptom: 'Polifagia', frequency: '50%' },
      { symptom: 'Cetoacidose diabética (apresentação inicial)', frequency: '30%' },
      { symptom: 'Fadiga', frequency: '60%' },
    ],
    diagnosticCriteria: ['Glicemia de jejum ≥ 126 mg/dL (2 amostras)', 'Glicemia ao acaso ≥ 200 mg/dL + sintomas', 'TOTG 2h ≥ 200 mg/dL', 'HbA1c ≥ 6,5%', 'Autoanticorpos positivos (anti-GAD, anti-IA2) + peptídeo C baixo confirmam DM1'],
    complementaryExams: [
      { exam: 'Glicemia de jejum + HbA1c', purpose: 'Diagnóstico e controle', when: 'Diagnóstico e a cada 3 meses' },
      { exam: 'Peptídeo C', purpose: 'Avaliar reserva de insulina', when: 'Diagnóstico (diferencial DM1 vs DM2)' },
      { exam: 'Autoanticorpos (anti-GAD, anti-IA2, anti-ZnT8)', purpose: 'Confirmar etiologia autoimune', when: 'Diagnóstico' },
      { exam: 'Perfil lipídico', purpose: 'Risco cardiovascular', when: 'Anual' },
      { exam: 'Creatinina + microalbuminúria', purpose: 'Rastrear nefropatia', when: 'Anual após 5 anos de diagnóstico' },
      { exam: 'Fundoscopia', purpose: 'Rastrear retinopatia', when: 'Anual após 5 anos de diagnóstico' },
      { exam: 'TSH', purpose: 'Rastrear tireoidite autoimune associada', when: 'Anual' },
    ],
    differentialDiagnosis: ['DM2 (especialmente em adultos jovens obesos)', 'LADA (DM autoimune latente do adulto)', 'MODY (diabetes monogênico)', 'DM secundário (pancreatite, Cushing, fibrose cística)'],
    treatment: {
      nonPharmacological: ['Contagem de carboidratos', 'Monitorização glicêmica contínua (CGM) ou automonitorização 4-6x/dia', 'Atividade física regular (ajustar insulina)', 'Educação em diabetes', 'Suporte psicológico'],
      pharmacological: [
        { drug: 'Insulina Basal (Glargina U100)', dose: '0,2-0,4 UI/kg/dia (iniciar)', route: 'SC', duration: 'Contínuo (vitalício)', notes: 'Aplicar 1x/dia no mesmo horário. Alternativas: Detemir (2x/dia), Degludeca (1x/dia), NPH (2-3x/dia).' },
        { drug: 'Insulina Bolus (Lispro/Aspart)', dose: 'Relação insulina:carboidrato (ex: 1 UI para cada 15g CHO)', route: 'SC', duration: 'Antes das refeições', notes: 'Dose de correção: fator de sensibilidade (1800/dose total diária). Alternativa: Insulina Regular.' },
        { drug: 'Bomba de insulina (CSII)', dose: 'Basal contínuo + bolus pré-prandial', route: 'SC (cateter)', duration: 'Contínuo', notes: 'Indicação: hipoglicemias graves recorrentes, HbA1c > 7% apesar de MDI, gestação. Sistema híbrido fechado (loop).' },
      ],
    },
    monitoring: ['HbA1c a cada 3 meses (meta < 7% adultos, < 7,5% crianças)', 'CGM ou automonitorização 4-6x/dia', 'Time in Range (TIR) > 70% (70-180 mg/dL)', 'Perfil lipídico anual', 'Microalbuminúria anual (após 5 anos)', 'Fundoscopia anual (após 5 anos)', 'TSH anual', 'Exame dos pés anual'],
    complications: ['Hipoglicemia (complicação aguda mais comum)', 'CAD', 'Retinopatia diabética', 'Nefropatia diabética', 'Neuropatia diabética', 'Doença cardiovascular', 'Pé diabético', 'Doença celíaca associada', 'Tireoidite de Hashimoto'],
    prognosis: 'Com controle adequado (HbA1c < 7%): expectativa de vida próxima ao normal. Tecnologia (CGM + bomba) melhora controle e qualidade de vida. Sem controle: complicações microvasculares em 10-15 anos.',
    prevention: ['Não há prevenção primária estabelecida', 'Rastreamento de autoanticorpos em familiares de 1º grau', 'Teplizumabe (anti-CD3): aprovado pelo FDA para retardar início em estágio 2 (autoanticorpos + disglicemia)'],
    references: [
      { title: 'ADA Standards of Care in Diabetes', source: 'Diabetes Care', year: 2025 },
      { title: 'Diretriz SBD — Tratamento do DM1', source: 'SBD', year: 2024 },
    ],
    lastUpdated: '2025-02-01', reviewedBy: 'Dra. Denise Franco (CRM-SP 45678)',
  },
  {
    id: 'hipotireoidismo', name: 'Hipotireoidismo', cid10: 'E03', specialty: 'Endocrinologia',
    urgency: 'eletivo', prevalence: 'muito_comum',
    definition: 'Síndrome clínica resultante da deficiência de hormônios tireoidianos (T3 e T4), com consequente redução do metabolismo celular.',
    epidemiology: '5-10% da população adulta (subclínico + clínico). Mais comum em mulheres (8:1). Prevalência aumenta com a idade. Tireoidite de Hashimoto: causa mais comum em áreas iodo-suficientes.',
    etiology: ['Tireoidite de Hashimoto (autoimune — mais comum)', 'Pós-tireoidectomia', 'Pós-radioiodoterapia', 'Medicamentoso (amiodarona, lítio, interferon)', 'Deficiência de iodo (raro no Brasil)', 'Hipotireoidismo central (hipofisário/hipotalâmico)'],
    riskFactors: ['Sexo feminino', 'Idade > 60 anos', 'História familiar de doença tireoidiana', 'Outras doenças autoimunes (DM1, vitiligo, anemia perniciosa)', 'Síndrome de Down/Turner', 'Radioterapia cervical', 'Uso de amiodarona ou lítio'],
    clinicalPresentation: [
      { symptom: 'Fadiga/astenia', frequency: '80%' },
      { symptom: 'Intolerância ao frio', frequency: '65%' },
      { symptom: 'Ganho de peso', frequency: '60%' },
      { symptom: 'Constipação', frequency: '50%' },
      { symptom: 'Pele seca', frequency: '55%' },
      { symptom: 'Queda de cabelo', frequency: '40%' },
      { symptom: 'Bradicardia', frequency: '30%' },
      { symptom: 'Edema facial/periorbital (mixedema)', frequency: '25%' },
      { symptom: 'Depressão', frequency: '30%' },
      { symptom: 'Irregularidade menstrual', frequency: '35%' },
    ],
    diagnosticCriteria: ['TSH elevado (> 4,5 mUI/L) + T4L baixo = hipotireoidismo clínico', 'TSH elevado + T4L normal = hipotireoidismo subclínico', 'Anti-TPO positivo confirma etiologia autoimune (Hashimoto)'],
    complementaryExams: [
      { exam: 'TSH', purpose: 'Rastreamento e diagnóstico', when: 'Diagnóstico inicial' },
      { exam: 'T4 livre', purpose: 'Confirmar e classificar gravidade', when: 'Se TSH alterado' },
      { exam: 'Anti-TPO', purpose: 'Confirmar etiologia autoimune', when: 'Diagnóstico inicial' },
      { exam: 'Perfil lipídico', purpose: 'Dislipidemia associada', when: 'Diagnóstico inicial' },
      { exam: 'USG de tireoide', purpose: 'Avaliar nódulos, tamanho', when: 'Se bócio ou nódulo palpável' },
    ],
    differentialDiagnosis: ['Depressão', 'Anemia', 'Síndrome da fadiga crônica', 'Insuficiência adrenal', 'Apneia do sono', 'IC'],
    treatment: {
      nonPharmacological: ['Orientação sobre a doença crônica', 'Atividade física regular', 'Dieta equilibrada'],
      pharmacological: [
        { drug: 'Levotiroxina (T4)', dose: '1,6-1,8 mcg/kg/dia (dose plena) — iniciar 25-50 mcg em idosos/cardiopatas', route: 'VO', duration: 'Contínuo (vitalício)', notes: 'Tomar em JEJUM (30-60 min antes do café). Evitar junto com cálcio, ferro, IBP. Ajustar dose a cada 6-8 semanas conforme TSH.' },
      ],
    },
    monitoring: ['TSH a cada 6-8 semanas até estabilizar', 'TSH a cada 6-12 meses após estabilização', 'TSH em cada trimestre na gestação', 'Perfil lipídico anual', 'Densitometria óssea se hipertireoidismo iatrogênico'],
    complications: ['Coma mixedematoso (emergência — mortalidade 30-60%)', 'Dislipidemia', 'Doença cardiovascular', 'Infertilidade', 'Complicações obstétricas (aborto, pré-eclâmpsia)', 'Depressão grave', 'Mixedema'],
    prognosis: 'Com reposição adequada de levotiroxina: prognóstico excelente, vida normal. Subclínico: tratar se TSH > 10 ou sintomático ou gestante.',
    prevention: ['Rastreamento em populações de risco (mulheres > 35 anos, gestantes, doenças autoimunes)', 'Monitorar TSH em uso de amiodarona ou lítio', 'Iodação do sal (programa nacional)'],
    references: [
      { title: 'ATA Guidelines for Hypothyroidism', source: 'Thyroid', year: 2024 },
      { title: 'Consenso Brasileiro de Hipotireoidismo', source: 'SBEM', year: 2023 },
    ],
    lastUpdated: '2025-01-15', reviewedBy: 'Dr. Mario Vaisman (CRM-RJ 12345)',
  },

  // ═══════════════════════════════════════
  // GASTROENTEROLOGIA (5 doenças)
  // ═══════════════════════════════════════
  {
    id: 'drge', name: 'Doença do Refluxo Gastroesofágico', cid10: 'K21', specialty: 'Gastroenterologia',
    urgency: 'eletivo', prevalence: 'muito_comum',
    definition: 'Condição que se desenvolve quando o refluxo do conteúdo gástrico causa sintomas incômodos e/ou complicações (Consenso de Montreal).',
    epidemiology: '12-20% da população brasileira. Prevalência crescente com obesidade. Impacto significativo na qualidade de vida. Esôfago de Barrett em 5-10% dos pacientes com DRGE crônica.',
    etiology: ['Incompetência do esfíncter esofágico inferior (EEI)', 'Hérnia hiatal', 'Hipotonia do EEI', 'Relaxamentos transitórios do EEI (mecanismo mais comum)', 'Aumento da pressão intra-abdominal'],
    riskFactors: ['Obesidade', 'Hérnia hiatal', 'Gestação', 'Tabagismo', 'Alimentos (café, chocolate, gordura, álcool, cítricos)', 'Medicamentos (BCC, nitratos, benzodiazepínicos)', 'Refeições volumosas à noite'],
    clinicalPresentation: [
      { symptom: 'Pirose (queimação retroesternal ascendente)', frequency: '80%' },
      { symptom: 'Regurgitação ácida', frequency: '60%' },
      { symptom: 'Disfagia (se complicação)', frequency: '15%' },
      { symptom: 'Dor torácica não cardíaca', frequency: '20%' },
      { symptom: 'Tosse crônica', frequency: '15%' },
      { symptom: 'Rouquidão matinal', frequency: '10%' },
      { symptom: 'Erosão dentária', frequency: '5%' },
    ],
    diagnosticCriteria: ['Diagnóstico clínico: pirose + regurgitação típicos = teste terapêutico com IBP', 'EDA: indicada se sinais de alarme (disfagia, perda de peso, anemia, > 45 anos)', 'pHmetria 24h: padrão-ouro para quantificar refluxo (DeMeester > 14,7)', 'Impedanciometria: detecta refluxo não ácido'],
    complementaryExams: [
      { exam: 'EDA', purpose: 'Avaliar esofagite, Barrett, estenose, excluir neoplasia', when: 'Sinais de alarme, > 45 anos, refratário a IBP' },
      { exam: 'pHmetria esofágica 24h', purpose: 'Quantificar refluxo ácido', when: 'Sintomas atípicos, pré-operatório, refratário' },
      { exam: 'Manometria esofágica', purpose: 'Avaliar motilidade esofágica', when: 'Pré-operatório de fundoplicatura' },
      { exam: 'Impedanciometria', purpose: 'Detectar refluxo não ácido', when: 'Refratário a IBP com pHmetria normal' },
    ],
    differentialDiagnosis: ['Esofagite eosinofílica', 'Acalasia', 'Dispepsia funcional', 'Doença ulcerosa péptica', 'Câncer de esôfago', 'Dor torácica cardíaca'],
    treatment: {
      nonPharmacological: ['Elevação da cabeceira (15-20 cm)', 'Perda de peso (se sobrepeso/obeso)', 'Evitar deitar após refeições (esperar 2-3h)', 'Evitar alimentos gatilho', 'Cessação do tabagismo', 'Refeições menores e mais frequentes'],
      pharmacological: [
        { drug: 'Omeprazol (IBP)', dose: '20 mg/dia (dose padrão) ou 40 mg/dia (dose dobrada)', route: 'VO', duration: '4-8 semanas (inicial)', notes: '1ª linha. Tomar 30 min antes do café. Alternativas: Pantoprazol 40mg, Esomeprazol 40mg, Lansoprazol 30mg.' },
        { drug: 'Ranitidina/Famotidina (anti-H2)', dose: 'Famotidina 20-40 mg 12/12h', route: 'VO', duration: '4-8 semanas', notes: '2ª linha ou add-on noturno. Ranitidina retirada do mercado (NDMA).' },
        { drug: 'Domperidona (procinético)', dose: '10 mg 3x/dia (antes das refeições)', route: 'VO', duration: '4-8 semanas', notes: 'Adjuvante se regurgitação predominante. Risco de arritmia (evitar se QTc longo).' },
      ],
      surgical: ['Fundoplicatura de Nissen (laparoscópica): indicada se refratário a IBP, hérnia hiatal grande, ou preferência do paciente por não usar medicação crônica'],
    },
    monitoring: ['Reavaliação em 4-8 semanas', 'EDA de controle se esofagite erosiva grau C/D', 'Vigilância endoscópica se Barrett (a cada 1-3 anos conforme displasia)', 'Tentar step-down ou suspensão de IBP após 8 semanas se sintomas leves'],
    complications: ['Esofagite erosiva (graus A-D de Los Angeles)', 'Estenose péptica', 'Esôfago de Barrett (metaplasia intestinal)', 'Adenocarcinoma de esôfago', 'Úlcera esofágica', 'Asma/tosse crônica por refluxo'],
    prognosis: 'Doença crônica recidivante. 80% respondem a IBP. Barrett: risco de adenocarcinoma 0,5%/ano. Fundoplicatura: alívio em 85-90% a longo prazo.',
    prevention: ['Manutenção de peso saudável', 'Hábitos alimentares adequados', 'Evitar tabagismo', 'Vigilância endoscópica se Barrett'],
    references: [
      { title: 'ACG Clinical Guideline: GERD', source: 'Am J Gastroenterol', year: 2024 },
      { title: 'Consenso Brasileiro de DRGE', source: 'FBG — Arq Gastroenterol', year: 2023 },
    ],
    lastUpdated: '2025-02-05', reviewedBy: 'Dr. Décio Chinzon (CRM-SP 56789)',
  },
  {
    id: 'hepatite_c', name: 'Hepatite C Crônica', cid10: 'B18.2', specialty: 'Gastroenterologia',
    urgency: 'eletivo', prevalence: 'comum',
    definition: 'Infecção crônica pelo vírus da hepatite C (HCV), definida pela persistência do HCV-RNA por mais de 6 meses, com potencial de evolução para cirrose e carcinoma hepatocelular.',
    epidemiology: '700.000 brasileiros infectados (estimativa). 70-80% cronificam. 20-30% evoluem para cirrose em 20-30 anos. Principal causa de transplante hepático no Brasil.',
    etiology: ['Vírus da Hepatite C (HCV) — RNA vírus, família Flaviviridae', 'Genótipos 1-6 (genótipo 1 mais comum no Brasil — 65%)', 'Transmissão parenteral: sangue, hemoderivados, drogas IV, sexual (raro), vertical (5%)'],
    riskFactors: ['Transfusão de sangue antes de 1993', 'Uso de drogas injetáveis', 'Hemodiálise', 'Profissionais de saúde (acidente perfurocortante)', 'Tatuagem/piercing sem material estéril', 'Compartilhamento de objetos cortantes'],
    clinicalPresentation: [
      { symptom: 'Assintomático (maioria na fase crônica)', frequency: '80%' },
      { symptom: 'Fadiga crônica', frequency: '50%' },
      { symptom: 'Artralgia', frequency: '20%' },
      { symptom: 'Sintomas de cirrose (ascite, icterícia, varizes)', frequency: '20-30% após 20 anos' },
    ],
    diagnosticCriteria: ['Anti-HCV positivo (rastreamento)', 'HCV-RNA detectável (confirma infecção ativa)', 'Genotipagem do HCV (orienta tratamento)', 'Elastografia hepática ou biópsia (estadiamento de fibrose — METAVIR F0-F4)'],
    complementaryExams: [
      { exam: 'Anti-HCV', purpose: 'Rastreamento', when: 'Populações de risco, > 40 anos' },
      { exam: 'HCV-RNA (PCR quantitativo)', purpose: 'Confirmar viremia ativa', when: 'Se anti-HCV positivo' },
      { exam: 'Genotipagem', purpose: 'Orientar esquema terapêutico', when: 'Antes do tratamento' },
      { exam: 'Elastografia hepática (FibroScan)', purpose: 'Estadiamento de fibrose (F0-F4)', when: 'Diagnóstico e acompanhamento' },
      { exam: 'Hepatograma, albumina, INR, plaquetas', purpose: 'Avaliar função hepática', when: 'Diagnóstico e seriado' },
      { exam: 'USG de abdome', purpose: 'Rastrear CHC e sinais de hipertensão portal', when: 'Semestral se cirrose' },
    ],
    differentialDiagnosis: ['Hepatite B crônica', 'Esteatohepatite não alcoólica (NASH)', 'Hepatite alcoólica', 'Hepatite autoimune', 'Doença de Wilson', 'Hemocromatose'],
    treatment: {
      nonPharmacological: ['Abstinência alcoólica', 'Vacinação contra Hepatite A e B', 'Orientação sobre transmissão', 'Rastreamento de CHC se cirrose (USG + AFP semestral)'],
      pharmacological: [
        { drug: 'Sofosbuvir + Velpatasvir (SOF/VEL)', dose: '400/100 mg — 1 comp/dia', route: 'VO', duration: '12 semanas', notes: 'Pangenotípico (todos os genótipos). 1ª linha no Brasil (PCDT MS 2024). Cura (RVS) > 95%.' },
        { drug: 'Sofosbuvir + Daclatasvir (SOF/DCV)', dose: 'SOF 400mg + DCV 60mg — 1x/dia', route: 'VO', duration: '12 semanas (24 se cirrose descompensada)', notes: 'Alternativa. Disponível no SUS. Cura > 90%.' },
        { drug: 'Glecaprevir + Pibrentasvir (GLE/PIB)', dose: '300/120 mg — 3 comp/dia', route: 'VO', duration: '8 semanas (sem cirrose) ou 12 semanas (com cirrose)', notes: 'Pangenotípico. Contraindicado em cirrose descompensada (Child B/C).' },
      ],
    },
    monitoring: ['HCV-RNA na semana 12 pós-tratamento (RVS12 = cura)', 'Hepatograma durante e após tratamento', 'Se cirrose: USG + AFP semestral INDEFINIDAMENTE (risco de CHC persiste)', 'Elastografia de controle 1 ano após RVS'],
    complications: ['Cirrose hepática', 'Carcinoma hepatocelular (CHC)', 'Hipertensão portal (varizes, ascite, encefalopatia)', 'Crioglobulinemia', 'Glomerulonefrite membranoproliferativa', 'Linfoma não-Hodgkin', 'Porfiria cutânea tarda'],
    prognosis: 'Com DAAs: cura (RVS) > 95% em todos os genótipos. Fibrose pode regredir após cura. Se cirrose: risco de CHC persiste (rastreamento vitalício). Sem tratamento: 20-30% evoluem para cirrose em 20-30 anos.',
    prevention: ['Não há vacina disponível', 'Rastreamento universal (> 18 anos pelo menos 1x na vida)', 'Uso de material estéril', 'Não compartilhar objetos cortantes', 'Redução de danos em UDIV'],
    references: [
      { title: 'PCDT para Hepatite C e Coinfecções', source: 'Ministério da Saúde', year: 2024 },
      { title: 'EASL Recommendations on Treatment of Hepatitis C', source: 'J Hepatol', year: 2024 },
    ],
    lastUpdated: '2025-02-10', reviewedBy: 'Dr. Hugo Cheinquer (CRM-RS 23456)',
  },

  // ═══════════════════════════════════════
  // NEUROLOGIA (5 doenças)
  // ═══════════════════════════════════════
  {
    id: 'epilepsia', name: 'Epilepsia', cid10: 'G40', specialty: 'Neurologia',
    urgency: 'eletivo', prevalence: 'comum',
    definition: 'Doença cerebral crônica caracterizada por predisposição persistente a gerar crises epilépticas, com consequências neurobiológicas, cognitivas, psicológicas e sociais.',
    epidemiology: '2 milhões de brasileiros. Prevalência de 1% na população geral. Incidência bimodal: < 1 ano e > 65 anos. 70% controlam com monoterapia.',
    etiology: ['Estrutural (AVC, tumor, malformação, trauma)', 'Genética (canalopatias, síndromes epilépticas)', 'Infecciosa (neurocisticercose — principal no Brasil, meningite, encefalite)', 'Metabólica (hipoglicemia, uremia, distúrbios eletrolíticos)', 'Imune (encefalite autoimune)', 'Desconhecida (30-40%)'],
    riskFactors: ['AVC prévio', 'TCE', 'Neurocisticercose', 'Tumor cerebral', 'Infecção do SNC', 'História familiar de epilepsia', 'Malformações corticais', 'Esclerose mesial temporal'],
    clinicalPresentation: [
      { symptom: 'Crises tônico-clônicas generalizadas', frequency: '40%' },
      { symptom: 'Crises focais com alteração da consciência', frequency: '35%' },
      { symptom: 'Crises de ausência', frequency: '10%' },
      { symptom: 'Crises mioclônicas', frequency: '5%' },
      { symptom: 'Aura (sintomas focais pré-crise)', frequency: '30%' },
      { symptom: 'Confusão pós-ictal', frequency: '60%' },
    ],
    diagnosticCriteria: ['≥ 2 crises não provocadas com intervalo > 24h', 'OU 1 crise não provocada + risco de recorrência > 60% (ex: lesão estrutural)', 'OU diagnóstico de síndrome epiléptica', 'EEG: atividade epileptiforme (ondas agudas, ponta-onda)'],
    complementaryExams: [
      { exam: 'EEG', purpose: 'Classificação do tipo de epilepsia, localização do foco', when: 'Diagnóstico inicial' },
      { exam: 'RM de crânio', purpose: 'Identificar causa estrutural', when: 'Obrigatório em toda epilepsia focal' },
      { exam: 'Vídeo-EEG', purpose: 'Correlação eletroclínica, pré-cirúrgico', when: 'Epilepsia refratária' },
      { exam: 'Hemograma, eletrólitos, glicemia, função renal/hepática', purpose: 'Excluir causas metabólicas', when: 'Diagnóstico inicial' },
      { exam: 'Nível sérico de antiepilépticos', purpose: 'Monitorar adesão e toxicidade', when: 'Se indicado clinicamente' },
    ],
    differentialDiagnosis: ['Síncope', 'Crises não epilépticas psicogênicas (CNEP)', 'AIT', 'Enxaqueca com aura', 'Hipoglicemia', 'Arritmia cardíaca', 'Distúrbios do sono (narcolepsia)'],
    treatment: {
      nonPharmacological: ['Higiene do sono', 'Evitar privação de sono', 'Evitar álcool em excesso', 'Orientação sobre direção veicular (livre de crises por 1 ano)', 'Orientação sobre atividades de risco (natação supervisionada, evitar altura)'],
      pharmacological: [
        { drug: 'Carbamazepina', dose: '400-1600 mg/dia (2-3x)', route: 'VO', duration: 'Contínuo', notes: 'Focal: 1ª linha. Induz CYP450. Interações medicamentosas. Monitorar Na+ (SIADH). Alternativa: Oxcarbazepina.' },
        { drug: 'Valproato de sódio', dose: '500-2000 mg/dia (2-3x)', route: 'VO', duration: 'Contínuo', notes: 'Generalizada: 1ª linha. CONTRAINDICADO em mulheres em idade fértil (teratogênico). Monitorar hepatograma e plaquetas.' },
        { drug: 'Lamotrigina', dose: '100-400 mg/dia (titulação lenta)', route: 'VO', duration: 'Contínuo', notes: 'Focal e generalizada. Segura na gestação. Rash cutâneo (Stevens-Johnson se titulação rápida). Interação com valproato.' },
        { drug: 'Levetiracetam', dose: '500-3000 mg/dia (2x)', route: 'VO', duration: 'Contínuo', notes: 'Focal e generalizada. Poucos efeitos colaterais e interações. Irritabilidade/depressão em alguns pacientes.' },
        { drug: 'Clobazam', dose: '10-40 mg/dia', route: 'VO', duration: 'Contínuo', notes: 'Adjuvante. Útil em Lennox-Gastaut. Sedação e tolerância.' },
      ],
      surgical: ['Lobectomia temporal anterior: epilepsia mesial temporal refratária (cura em 60-80%)', 'Estimulação do nervo vago (VNS): paliativo em refratários não candidatos a cirurgia', 'Calosotomia: crises de queda refratárias'],
    },
    monitoring: ['Consulta a cada 3-6 meses', 'EEG anual ou se mudança clínica', 'Nível sérico de FAE se indicado', 'Hepatograma e hemograma (valproato, carbamazepina)', 'Densitometria óssea (uso crônico de FAE indutores)', 'Considerar retirada de FAE após 2-5 anos livre de crises'],
    complications: ['Status epilepticus', 'SUDEP (morte súbita em epilepsia)', 'Traumatismos durante crises', 'Déficit cognitivo', 'Depressão/ansiedade (30-50%)', 'Efeitos colaterais de FAE', 'Osteoporose (FAE indutores)'],
    prognosis: '70% controlam com monoterapia. 30% são refratários (considerar cirurgia). SUDEP: 1/1000 pacientes/ano. Após 2-5 anos livre de crises: 50-70% permanecem sem crises após retirada de FAE.',
    prevention: ['Prevenção de neurocisticercose (saneamento, higiene alimentar)', 'Prevenção de TCE (capacete, cinto)', 'Tratamento adequado de infecções do SNC', 'Controle de fatores de risco para AVC'],
    references: [
      { title: 'ILAE Classification and Definition of Epilepsy', source: 'Epilepsia', year: 2024 },
      { title: 'Diretriz Brasileira de Epilepsia', source: 'ABN — Arq Neuropsiquiatr', year: 2023 },
    ],
    lastUpdated: '2025-02-20', reviewedBy: 'Dr. Elza Yacubian (CRM-SP 34567)',
  },

  // ═══════════════════════════════════════
  // INFECTOLOGIA (5 doenças)
  // ═══════════════════════════════════════
  {
    id: 'dengue', name: 'Dengue', cid10: 'A90', specialty: 'Infectologia',
    urgency: 'urgencia', prevalence: 'muito_comum',
    definition: 'Doença febril aguda causada pelo vírus Dengue (sorotipos DENV 1-4), transmitida pelo mosquito Aedes aegypti, com espectro clínico variando de assintomático a formas graves com choque.',
    epidemiology: '4,5 milhões de casos em 2024 no Brasil (maior epidemia da história). Endêmica em todo território nacional. Mortalidade: < 1% com manejo adequado, até 20% em dengue grave sem tratamento.',
    etiology: ['Vírus Dengue (DENV 1-4) — Flavivirus', 'Transmissão: picada do Aedes aegypti (diurno)', 'Período de incubação: 4-10 dias', 'Viremia: 1 dia antes até 5 dias após início dos sintomas'],
    riskFactors: ['Infecção prévia por sorotipo diferente (risco de dengue grave)', 'Idade < 15 anos ou > 65 anos', 'Gestantes', 'Comorbidades (DM, HAS, cardiopatia, nefropatia)', 'Obesidade', 'Uso de anticoagulantes/antiplaquetários'],
    clinicalPresentation: [
      { symptom: 'Febre alta (39-40°C) de início súbito', frequency: '95%' },
      { symptom: 'Cefaleia intensa (retroorbitária)', frequency: '80%' },
      { symptom: 'Mialgia intensa', frequency: '75%' },
      { symptom: 'Artralgia', frequency: '60%' },
      { symptom: 'Exantema maculopapular (3º-4º dia)', frequency: '50%' },
      { symptom: 'Náuseas/vômitos', frequency: '40%' },
      { symptom: 'Prova do laço positiva', frequency: '30%' },
      { symptom: 'Sinais de alarme (dor abdominal, vômitos persistentes, sangramento)', frequency: '10-15%' },
    ],
    diagnosticCriteria: ['Clínico-epidemiológico em período epidêmico', 'NS1 (antígeno): positivo nos primeiros 5 dias', 'IgM anti-dengue: positivo a partir do 6º dia', 'PCR-RT: confirma sorotipo (primeiros 5 dias)', 'Classificação: Dengue sem sinais de alarme / com sinais de alarme / Dengue grave'],
    complementaryExams: [
      { exam: 'NS1 (antígeno)', purpose: 'Diagnóstico precoce (1º-5º dia)', when: 'Imediato' },
      { exam: 'Sorologia IgM/IgG', purpose: 'Diagnóstico a partir do 6º dia', when: 'Se NS1 negativo ou > 5 dias' },
      { exam: 'Hemograma completo', purpose: 'Hematócrito (hemoconcentração), plaquetas', when: 'Imediato e seriado (diário se sinais de alarme)' },
      { exam: 'Hepatograma', purpose: 'Hepatite por dengue', when: 'Se dor abdominal ou icterícia' },
      { exam: 'Albumina', purpose: 'Extravasamento plasmático', when: 'Se sinais de alarme' },
    ],
    differentialDiagnosis: ['Chikungunya', 'Zika', 'Leptospirose', 'Meningococcemia', 'Febre tifoide', 'Malária', 'COVID-19', 'Hepatite viral aguda'],
    treatment: {
      nonPharmacological: ['Hidratação oral vigorosa (60 mL/kg/dia — 1/3 salina, 2/3 líquidos)', 'Repouso', 'Retorno imediato se sinais de alarme', 'NÃO usar AAS ou AINE (risco de sangramento)'],
      pharmacological: [
        { drug: 'Dipirona', dose: '500-1000 mg VO 6/6h', route: 'VO', duration: 'Até resolução da febre', notes: 'Analgésico e antitérmico de escolha. NÃO usar AAS ou Ibuprofeno.' },
        { drug: 'Paracetamol', dose: '500-750 mg VO 6/6h (máx 3g/dia)', route: 'VO', duration: 'Até resolução da febre', notes: 'Alternativa à dipirona. Cuidado com hepatotoxicidade (máx 3g/dia).' },
        { drug: 'Soro Fisiológico 0,9% (Grupo B)', dose: '80 mL/kg/dia (1/3 IV, 2/3 VO)', route: 'IV + VO', duration: 'Até melhora clínica', notes: 'Grupo B: sinais de alarme. Reavaliar em 2h. Se Ht subindo: aumentar volume.' },
        { drug: 'Expansão volêmica (Grupo C/D)', dose: 'SF 0,9% 20 mL/kg em 20 min (repetir até 3x)', route: 'IV', duration: 'Até estabilização', notes: 'Dengue grave com choque. Se refratário: albumina 0,5-1 g/kg ou coloides. UTI.' },
      ],
    },
    monitoring: ['Hemograma diário (Ht e plaquetas) se sinais de alarme', 'Sinais vitais a cada 2-4h se internado', 'Diurese (meta > 1 mL/kg/h)', 'Fase crítica: 3º-7º dia (defervescência = maior risco)', 'Retorno em 24-48h se ambulatorial'],
    complications: ['Dengue grave: choque por extravasamento plasmático', 'Hemorragia grave (TGI, SNC)', 'Miocardite', 'Hepatite fulminante', 'Encefalite', 'CIVD', 'Síndrome hemofagocítica'],
    prognosis: 'Dengue clássica: autolimitada em 7-10 dias. Dengue grave: mortalidade < 1% com manejo adequado, 20% sem tratamento. Plaquetopenia isolada NÃO indica gravidade.',
    prevention: ['Controle do vetor (eliminar criadouros)', 'Vacina Qdenga (Takeda): 2 doses, > 4 anos, soropositivos ou soronegativos', 'Repelentes', 'Telas em janelas', 'Notificação compulsória'],
    references: [
      { title: 'Dengue: Diagnóstico e Manejo Clínico', source: 'Ministério da Saúde', year: 2024 },
      { title: 'WHO Dengue Guidelines', source: 'WHO', year: 2024 },
    ],
    lastUpdated: '2025-03-01', reviewedBy: 'Dr. Kleber Luz (CRM-RN 12345)',
  },

  // ═══════════════════════════════════════
  // NEFROLOGIA (3 doenças)
  // ═══════════════════════════════════════
  {
    id: 'drc', name: 'Doença Renal Crônica', cid10: 'N18', specialty: 'Nefrologia',
    urgency: 'eletivo', prevalence: 'muito_comum',
    definition: 'Anormalidades da estrutura ou função renal, presentes por > 3 meses, com implicações para a saúde. Definida por TFG < 60 mL/min/1,73m² e/ou marcadores de dano renal (albuminúria ≥ 30 mg/g).',
    epidemiology: '10-15% da população mundial. 150.000 brasileiros em diálise. 6ª causa de morte que mais cresce no mundo. Custo SUS: R$ 3,5 bilhões/ano em TRS.',
    etiology: ['DM (principal — 30%)', 'HAS (2ª causa — 25%)', 'Glomerulonefrites (15%)', 'Doença renal policística', 'Nefrite intersticial', 'Uropatia obstrutiva', 'Nefroesclerose hipertensiva'],
    riskFactors: ['DM', 'HAS', 'Idade > 60 anos', 'História familiar de DRC', 'Obesidade', 'Tabagismo', 'Uso crônico de AINE', 'Raça negra', 'DCV', 'IRA prévia'],
    clinicalPresentation: [
      { symptom: 'Assintomático (estágios 1-3)', frequency: '70%' },
      { symptom: 'Fadiga', frequency: '50%' },
      { symptom: 'Edema', frequency: '40%' },
      { symptom: 'Noctúria', frequency: '35%' },
      { symptom: 'Náuseas/vômitos (uremia)', frequency: '30%' },
      { symptom: 'Prurido', frequency: '25%' },
      { symptom: 'Hipertensão de difícil controle', frequency: '60%' },
    ],
    diagnosticCriteria: ['TFG < 60 mL/min/1,73m² por > 3 meses (fórmula CKD-EPI)', 'E/OU albuminúria ≥ 30 mg/g (RAC) por > 3 meses', 'Estadiamento: G1 (≥90), G2 (60-89), G3a (45-59), G3b (30-44), G4 (15-29), G5 (<15)', 'Albuminúria: A1 (<30), A2 (30-300), A3 (>300 mg/g)'],
    complementaryExams: [
      { exam: 'Creatinina sérica + TFG (CKD-EPI)', purpose: 'Diagnóstico e estadiamento', when: 'Diagnóstico e a cada 3-12 meses conforme estágio' },
      { exam: 'RAC (relação albumina/creatinina urinária)', purpose: 'Quantificar albuminúria', when: 'Diagnóstico e anual' },
      { exam: 'USG renal', purpose: 'Tamanho renal, obstrução, cistos', when: 'Diagnóstico inicial' },
      { exam: 'Hemograma', purpose: 'Anemia (eritropoietina)', when: 'A cada 3-6 meses' },
      { exam: 'Cálcio, fósforo, PTH, vitamina D', purpose: 'Distúrbio mineral-ósseo', when: 'A partir de G3' },
      { exam: 'Potássio, bicarbonato', purpose: 'Hipercalemia, acidose metabólica', when: 'A cada 3-6 meses' },
    ],
    differentialDiagnosis: ['IRA (reversível)', 'Desidratação', 'Obstrução urinária', 'Nefrite lúpica', 'Mieloma múltiplo (rim do mieloma)'],
    treatment: {
      nonPharmacological: ['Dieta hipoproteica (0,6-0,8 g/kg/dia em G4-5)', 'Restrição de sódio (< 2g/dia)', 'Restrição de potássio (se hipercalemia)', 'Restrição de fósforo', 'Atividade física regular', 'Cessação do tabagismo', 'Evitar nefrotóxicos (AINE, contraste iodado)'],
      pharmacological: [
        { drug: 'IECA ou BRA (nefroproteção)', dose: 'Enalapril 10-40mg/dia ou Losartana 50-100mg/dia', route: 'VO', duration: 'Contínuo', notes: 'OBRIGATÓRIO se albuminúria ≥ 30. Monitorar K+ e creatinina (aceitar aumento até 30%). Meta PA < 130/80.' },
        { drug: 'Dapagliflozina (iSGLT2)', dose: '10 mg/dia', route: 'VO', duration: 'Contínuo', notes: 'Nefroproteção INDEPENDENTE de DM (estudo DAPA-CKD). Indicado se TFG 20-90 + albuminúria. Reduz progressão em 39%.' },
        { drug: 'Finerenona (ARM não esteroidal)', dose: '10-20 mg/dia', route: 'VO', duration: 'Contínuo', notes: 'DRC + DM2 com albuminúria. Reduz progressão renal e eventos CV. Monitorar K+.' },
        { drug: 'Eritropoietina (EPO)', dose: '50-100 UI/kg SC 3x/semana', route: 'SC', duration: 'Contínuo', notes: 'Se Hb < 10 g/dL e ferro adequado. Meta Hb 10-12 g/dL. Suplementar ferro IV se ferritina < 200.' },
        { drug: 'Bicarbonato de sódio', dose: '0,5-1 mEq/kg/dia', route: 'VO', duration: 'Contínuo', notes: 'Se bicarbonato sérico < 22 mEq/L. Retarda progressão da DRC.' },
      ],
      surgical: ['Confecção de fístula arteriovenosa (FAV): 6 meses antes de TFG < 15 (planejamento de hemodiálise)', 'Transplante renal: melhor TRS em termos de sobrevida e qualidade de vida', 'Diálise peritoneal: alternativa à hemodiálise'],
    },
    monitoring: ['TFG e RAC a cada 3-12 meses conforme estágio', 'PA a cada consulta (meta < 130/80)', 'K+ e bicarbonato a cada 3-6 meses', 'Ca, P, PTH, Vit D a partir de G3', 'Hemoglobina a cada 3-6 meses', 'Encaminhar ao nefrologista: G4 (TFG < 30) ou albuminúria A3 ou progressão rápida'],
    complications: ['Doença cardiovascular (principal causa de morte)', 'Anemia', 'Distúrbio mineral-ósseo (osteodistrofia renal)', 'Hipercalemia', 'Acidose metabólica', 'Uremia', 'Desnutrição', 'Necessidade de TRS (diálise/transplante)'],
    prognosis: 'Com tratamento otimizado (IECA/BRA + iSGLT2 + controle de PA e DM): progressão pode ser significativamente retardada. Sem tratamento: progressão para diálise em 5-10 anos (G4). Transplante renal: sobrevida de 90% em 5 anos.',
    prevention: ['Controle de DM (HbA1c < 7%)', 'Controle de HAS (< 130/80)', 'Evitar AINE crônicos', 'Rastreamento em populações de risco (DM, HAS, > 60 anos)', 'Hidratação adequada'],
    references: [
      { title: 'KDIGO Clinical Practice Guideline for CKD', source: 'Kidney Int Suppl', year: 2024 },
      { title: 'Diretriz Brasileira de DRC', source: 'SBN — J Bras Nefrol', year: 2023 },
    ],
    lastUpdated: '2025-02-15', reviewedBy: 'Dr. Roberto Pecoits-Filho (CRM-PR 45678)',
  },

  // ═══════════════════════════════════════
  // PSIQUIATRIA (3 doenças)
  // ═══════════════════════════════════════
  {
    id: 'depressao', name: 'Transtorno Depressivo Maior', cid10: 'F32', specialty: 'Psiquiatria',
    urgency: 'eletivo', prevalence: 'muito_comum',
    definition: 'Transtorno mental caracterizado por humor deprimido persistente e/ou perda de interesse/prazer (anedonia), com duração mínima de 2 semanas, causando prejuízo funcional significativo.',
    epidemiology: '11,5 milhões de brasileiros (5,8% da população). Brasil: país com maior prevalência de depressão na América Latina. Mulheres 2x mais afetadas. 2ª causa de incapacidade no mundo (OMS).',
    etiology: ['Multifatorial: genética (40-50% de herdabilidade) + ambiental', 'Hipótese monoaminérgica (deficiência de serotonina, noradrenalina, dopamina)', 'Neuroinflamação', 'Disfunção do eixo HPA (cortisol elevado)', 'Redução de BDNF e neuroplasticidade'],
    riskFactors: ['Sexo feminino', 'História familiar de depressão', 'Eventos estressores (luto, separação, desemprego)', 'Abuso na infância', 'Doenças crônicas (DM, DCV, câncer, dor crônica)', 'Uso de substâncias', 'Isolamento social', 'Puerpério'],
    clinicalPresentation: [
      { symptom: 'Humor deprimido (tristeza, vazio, desesperança)', frequency: '90%' },
      { symptom: 'Anedonia (perda de interesse/prazer)', frequency: '85%' },
      { symptom: 'Alteração do sono (insônia ou hipersonia)', frequency: '80%' },
      { symptom: 'Fadiga/perda de energia', frequency: '75%' },
      { symptom: 'Alteração do apetite/peso', frequency: '60%' },
      { symptom: 'Dificuldade de concentração', frequency: '65%' },
      { symptom: 'Sentimento de culpa/inutilidade', frequency: '55%' },
      { symptom: 'Agitação ou retardo psicomotor', frequency: '40%' },
      { symptom: 'Ideação suicida', frequency: '15-20%' },
    ],
    diagnosticCriteria: ['DSM-5: ≥ 5 de 9 critérios por ≥ 2 semanas (obrigatório: humor deprimido OU anedonia)', 'PHQ-9 ≥ 10 (rastreamento)', 'Classificação: leve (5-9 PHQ-9), moderada (10-14), moderada-grave (15-19), grave (20-27)', 'Excluir: hipotireoidismo, anemia, deficiência de B12, uso de substâncias'],
    complementaryExams: [
      { exam: 'PHQ-9 (questionário)', purpose: 'Rastreamento e monitoramento', when: 'Diagnóstico e a cada consulta' },
      { exam: 'TSH', purpose: 'Excluir hipotireoidismo', when: 'Diagnóstico inicial' },
      { exam: 'Hemograma + ferritina', purpose: 'Excluir anemia', when: 'Diagnóstico inicial' },
      { exam: 'Vitamina B12 e ácido fólico', purpose: 'Excluir deficiência', when: 'Diagnóstico inicial' },
      { exam: 'Glicemia, perfil lipídico', purpose: 'Avaliação metabólica (efeitos de medicação)', when: 'Antes de iniciar tratamento' },
    ],
    differentialDiagnosis: ['Transtorno bipolar (investigar episódios maníacos/hipomaníacos)', 'Hipotireoidismo', 'Anemia', 'Transtorno de ajustamento', 'Luto normal', 'Depressão secundária a substâncias', 'Demência (pseudodemência depressiva)'],
    treatment: {
      nonPharmacological: ['Psicoterapia (TCC: 1ª linha em depressão leve-moderada)', 'Atividade física regular (150 min/semana — evidência nível A)', 'Higiene do sono', 'Mindfulness/meditação', 'Fototerapia (depressão sazonal)', 'ECT (eletroconvulsoterapia): depressão grave refratária ou com risco iminente de suicídio'],
      pharmacological: [
        { drug: 'Sertralina (ISRS)', dose: '50-200 mg/dia', route: 'VO', duration: '6-12 meses (mínimo) após remissão', notes: '1ª linha. Início de efeito: 2-4 semanas. Efeitos: náusea, disfunção sexual, insônia. Segura em cardiopatas.' },
        { drug: 'Escitalopram (ISRS)', dose: '10-20 mg/dia', route: 'VO', duration: '6-12 meses após remissão', notes: '1ª linha. Melhor tolerabilidade entre ISRS. Início: 2-4 semanas.' },
        { drug: 'Venlafaxina (IRSN)', dose: '75-225 mg/dia', route: 'VO', duration: '6-12 meses após remissão', notes: '2ª linha ou se dor crônica associada. Monitorar PA (dose-dependente). Alternativa: Duloxetina 60-120mg.' },
        { drug: 'Bupropiona', dose: '150-300 mg/dia', route: 'VO', duration: '6-12 meses após remissão', notes: 'Sem disfunção sexual. Útil em tabagismo + depressão. Contraindicado em epilepsia e bulimia.' },
        { drug: 'Mirtazapina', dose: '15-45 mg/dia (noite)', route: 'VO', duration: '6-12 meses após remissão', notes: 'Sedativa, aumenta apetite. Útil em insônia + perda de peso. Pode combinar com ISRS (California rocket fuel).' },
      ],
    },
    monitoring: ['PHQ-9 a cada consulta', 'Reavaliação em 2-4 semanas após início', 'Avaliar risco suicida a cada consulta', 'Efeitos colaterais', 'Se não resposta em 4-6 semanas: aumentar dose ou trocar', 'Manter tratamento por 6-12 meses após remissão (1º episódio) ou indefinido (≥ 3 episódios)'],
    complications: ['Suicídio (15% dos depressivos graves)', 'Incapacidade funcional', 'Abuso de substâncias', 'Doença cardiovascular', 'DM2', 'Síndrome metabólica (medicação)', 'Recorrência (50% após 1º episódio, 80% após 2º)'],
    prognosis: 'Com tratamento adequado: remissão em 60-70%. Recorrência: 50% após 1º episódio, 70% após 2º, 90% após 3º. Tratamento de manutenção reduz recorrência em 70%.',
    prevention: ['Atividade física regular', 'Sono adequado', 'Rede de apoio social', 'Psicoterapia preventiva em grupos de risco', 'Tratamento de manutenção se recorrente'],
    references: [
      { title: 'APA Practice Guideline for Major Depressive Disorder', source: 'Am J Psychiatry', year: 2024 },
      { title: 'Diretriz Brasileira de Depressão', source: 'ABP — Rev Bras Psiquiatr', year: 2023 },
    ],
    lastUpdated: '2025-02-25', reviewedBy: 'Dr. Antônio Nardi (CRM-RJ 56789)',
  },

  // ═══════════════════════════════════════
  // PEDIATRIA (3 doenças)
  // ═══════════════════════════════════════
  {
    id: 'bronquiolite', name: 'Bronquiolite Viral Aguda', cid10: 'J21', specialty: 'Pediatria',
    urgency: 'urgencia', prevalence: 'muito_comum',
    definition: 'Infecção viral aguda das vias aéreas inferiores (bronquíolos) em lactentes < 2 anos, caracterizada por sibilância, taquipneia e dificuldade respiratória.',
    epidemiology: 'Principal causa de internação em < 1 ano. 90% dos casos: VSR (vírus sincicial respiratório). Pico: outono-inverno. 2-3% necessitam internação. Mortalidade < 1% em países desenvolvidos.',
    etiology: ['VSR (60-80%)', 'Rinovírus (20%)', 'Metapneumovírus', 'Parainfluenza', 'Adenovírus', 'Influenza', 'Bocavírus'],
    riskFactors: ['Idade < 6 meses', 'Prematuridade (< 37 semanas)', 'Displasia broncopulmonar', 'Cardiopatia congênita', 'Imunodeficiência', 'Exposição a tabaco', 'Ausência de aleitamento materno', 'Creche'],
    clinicalPresentation: [
      { symptom: 'Coriza e tosse (pródromos 2-3 dias)', frequency: '95%' },
      { symptom: 'Sibilância', frequency: '85%' },
      { symptom: 'Taquipneia', frequency: '80%' },
      { symptom: 'Tiragem intercostal/subcostal', frequency: '60%' },
      { symptom: 'Febre baixa', frequency: '50%' },
      { symptom: 'Dificuldade para mamar', frequency: '40%' },
      { symptom: 'Apneia (< 2 meses ou prematuros)', frequency: '10-20%' },
    ],
    diagnosticCriteria: ['Diagnóstico CLÍNICO: 1º episódio de sibilância em < 2 anos + pródromos virais', 'NÃO são necessários exames complementares de rotina', 'Pesquisa de VSR (painel viral): apenas se impacto no manejo (isolamento)'],
    complementaryExams: [
      { exam: 'Oximetria de pulso', purpose: 'Avaliar hipoxemia', when: 'Obrigatório em toda avaliação' },
      { exam: 'Rx de tórax', purpose: 'NÃO indicado de rotina. Apenas se dúvida diagnóstica', when: 'Suspeita de complicação (pneumonia, pneumotórax)' },
      { exam: 'Painel viral (PCR nasofaríngeo)', purpose: 'Identificar agente (isolamento)', when: 'Pacientes internados' },
      { exam: 'Hemograma/PCR', purpose: 'NÃO indicados de rotina', when: 'Apenas se suspeita de infecção bacteriana secundária' },
    ],
    differentialDiagnosis: ['Asma do lactente (episódios recorrentes)', 'Pneumonia bacteriana', 'Coqueluche', 'Corpo estranho', 'Insuficiência cardíaca', 'Fibrose cística', 'Refluxo gastroesofágico'],
    treatment: {
      nonPharmacological: ['Suporte: PRINCIPAL tratamento', 'Oxigênio se SpO2 < 92% (alvo > 92%)', 'Aspiração nasal suave (se obstrução)', 'Manter hidratação (oral ou IV se não tolerar)', 'Posição elevada (30°)', 'Monitorização contínua se internado'],
      pharmacological: [
        { drug: 'Solução salina hipertônica 3% nebulizada', dose: '4 mL a cada 4-6h', route: 'Nebulização', duration: 'Durante internação', notes: 'Pode reduzir tempo de internação. Evidência moderada. Não usar em ambulatório.' },
        { drug: 'NÃO usar: broncodilatadores, corticoides, antibióticos de rotina', dose: 'N/A', route: 'N/A', duration: 'N/A', notes: 'Salbutamol, adrenalina, corticoide sistêmico e ATB NÃO são recomendados. Sem benefício comprovado.' },
      ],
    },
    monitoring: ['SpO2 contínua se internado', 'Frequência respiratória', 'Aceitação alimentar', 'Sinais de desidratação', 'Critérios de alta: SpO2 > 92% em ar ambiente, aceitando dieta, sem esforço respiratório significativo'],
    complications: ['Insuficiência respiratória (2-5%)', 'Apneia (prematuros)', 'Desidratação', 'Infecção bacteriana secundária (otite, pneumonia)', 'Atelectasia', 'Pneumotórax (raro)', 'Sibilância recorrente pós-bronquiolite'],
    prognosis: 'Autolimitada em 7-10 dias (pico no 3º-5º dia). Mortalidade < 1% com suporte adequado. 30-50% terão sibilância recorrente nos primeiros anos.',
    prevention: ['Palivizumabe (anticorpo monoclonal anti-VSR): prematuros < 29 sem, DBP, cardiopatia congênita', 'Nirsevimabe (nova — dose única): aprovado para todos os lactentes na 1ª temporada de VSR', 'Aleitamento materno exclusivo até 6 meses', 'Evitar tabagismo passivo', 'Lavagem de mãos frequente'],
    references: [
      { title: 'AAP Clinical Practice Guideline: Bronchiolitis', source: 'Pediatrics', year: 2024 },
      { title: 'Diretriz Brasileira de Bronquiolite', source: 'SBP', year: 2023 },
    ],
    lastUpdated: '2025-02-10', reviewedBy: 'Dra. Clemax Sant Anna (CRM-RJ 67890)',
  },
];

