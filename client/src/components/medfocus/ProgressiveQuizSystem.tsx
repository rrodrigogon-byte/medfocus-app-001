/**
 * Progressive Quiz System — Year-Adaptive Medical Education
 * 
 * Quiz difficulty adapts to student's year (1st-6th):
 * 1º Ano: Básico - Conhecimento e Compreensão (Bloom)
 * 2º Ano: Básico/Intermediário - Compreensão e Aplicação
 * 3º Ano: Intermediário - Aplicação e Análise
 * 4º Ano: Intermediário/Avançado - Análise e Síntese
 * 5º Ano: Avançado - Síntese e Avaliação
 * 6º Ano: Residência - Aplicação clínica complexa
 * 
 * Goal: 100% theoretical mastery so university focus can be on practice and discussion
 */
import React, { useState, useMemo, useEffect } from 'react';
import { ProgressiveQuiz, MedicalYear } from '../../types';

interface ProgressiveQuizSystemProps {
  currentYear: MedicalYear;
  subjectId: string;
  materialId?: string;
  onComplete?: (score: number, correct: number, total: number) => void;
}

const ProgressiveQuizSystem: React.FC<ProgressiveQuizSystemProps> = ({
  currentYear,
  subjectId,
  materialId,
  onComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; correct: boolean; timeSpent: number }[]>([]);
  const [startTime, setStartTime] = useState(Date.now());

  // Comprehensive quiz database with validated medical references
  const allQuizzes: ProgressiveQuiz[] = [
    // 1º Ano - Anatomia Básica
    {
      id: 'q1_anatomia_basico',
      question: 'Qual é a camada mais externa do coração?',
      options: [
        'Endocárdio',
        'Miocárdio',
        'Epicárdio',
        'Pericárdio',
      ],
      correctIndex: 2,
      explanation: 'O epicárdio é a camada mais externa do coração, sendo também chamado de pericárdio visceral. O pericárdio é uma membrana que envolve o coração externamente.',
      difficulty: 'basico',
      targetYear: 1,
      topics: ['anatomia', 'cardiologia'],
      bloomLevel: 'conhecimento',
      estimatedTime: 30,
      references: [
        {
          id: 'ref_gray',
          title: 'Gray\'s Anatomia',
          authors: ['Susan Standring'],
          source: 'Elsevier',
          year: 2020,
          quality: 'gold',
        },
      ],
    },
    // 2º Ano - Fisiologia Intermediária
    {
      id: 'q2_fisiologia_inter',
      question: 'Um paciente apresenta hiponatremia. Qual hormônio está PRINCIPALMENTE envolvido na regulação do sódio sérico?',
      options: [
        'Hormônio antidiurético (ADH)',
        'Aldosterona',
        'Hormônio natriurético atrial (ANP)',
        'Cortisol',
      ],
      correctIndex: 1,
      explanation: 'A aldosterona é o principal hormônio regulador do sódio, atuando no túbulo coletor renal para aumentar a reabsorção de Na+ e excreção de K+. O ADH regula principalmente água, não sódio diretamente.',
      difficulty: 'intermediario',
      targetYear: 2,
      topics: ['fisiologia', 'nefrologia', 'endocrinologia'],
      bloomLevel: 'compreensao',
      estimatedTime: 45,
      references: [
        {
          id: 'ref_guyton',
          title: 'Guyton & Hall - Tratado de Fisiologia Médica',
          authors: ['John E. Hall'],
          source: 'Elsevier',
          year: 2020,
          quality: 'gold',
        },
      ],
    },
    // 3º Ano - Farmacologia Aplicação
    {
      id: 'q3_farma_aplicacao',
      question: 'Um paciente hipertenso apresenta tosse seca persistente após início de enalapril. Qual é o mecanismo farmacológico dessa reação adversa?',
      options: [
        'Aumento de bradicinina devido à inibição da ECA',
        'Bloqueio direto dos receptores de angiotensina II',
        'Broncoconstrição por liberação de histamina',
        'Estimulação de receptores colinérgicos pulmonares',
      ],
      correctIndex: 0,
      explanation: 'Os IECAs (como enalapril) inibem a enzima conversora de angiotensina (ECA), que também degrada bradicinina. O acúmulo de bradicinina causa tosse seca em até 15% dos pacientes. Nestes casos, considerar trocar para BRA (bloqueadores dos receptores de angiotensina).',
      difficulty: 'intermediario',
      targetYear: 3,
      topics: ['farmacologia', 'cardiologia', 'hipertensão'],
      bloomLevel: 'aplicacao',
      estimatedTime: 60,
      references: [
        {
          id: 'ref_katzung',
          title: 'Farmacologia Básica e Clínica - Katzung',
          authors: ['Bertram G. Katzung'],
          source: 'McGraw-Hill',
          year: 2021,
          quality: 'gold',
        },
      ],
    },
    // 4º Ano - Clínica Análise
    {
      id: 'q4_clinica_analise',
      question: 'Paciente de 65 anos com dispneia aos esforços, crepitações bibasais, B3 à ausculta e BNP elevado. Qual a provável classificação funcional NYHA e qual intervenção tem MAIOR impacto na mortalidade?',
      options: [
        'NYHA II; Betabloqueador (carvedilol ou metoprolol)',
        'NYHA III; Diurético (furosemida)',
        'NYHA II; IECA/BRA',
        'NYHA IV; Digoxina',
      ],
      correctIndex: 0,
      explanation: 'Quadro sugere ICC NYHA II (sintomas aos esforços moderados). Entre as opções, betabloqueadores (carvedilol, bisoprolol, metoprolol succinato) têm evidência robusta de redução de mortalidade em IC com FE reduzida. IECAs/BRAs também reduzem mortalidade, mas a questão pede MAIOR impacto - ambos são comparáveis, mas betabloqueadores são resposta mais específica considerando o conjunto.',
      difficulty: 'avancado',
      targetYear: 4,
      topics: ['cardiologia', 'insuficiência cardíaca', 'farmacoterapia'],
      bloomLevel: 'analise',
      estimatedTime: 90,
      references: [
        {
          id: 'ref_acc_aha',
          title: 'ACC/AHA Heart Failure Guidelines 2022',
          authors: ['American College of Cardiology'],
          source: 'Circulation',
          year: 2022,
          quality: 'gold',
          citationCount: 2450,
        },
      ],
    },
    // 5º Ano - Síntese Clínica
    {
      id: 'q5_sintese_clinica',
      question: 'Paciente de 58 anos, diabético, apresenta dor torácica típica + supra ST em DII, DIII e aVF. PA 90/60, FC 45 bpm. Conduta IMEDIATA mais adequada:',
      options: [
        'AAS + clopidogrel + angioplastia primária + atropina se sintomático',
        'Trombolítico (tenecteplase) + atropina + marca-passo temporário',
        'Betabloqueador EV + AAS + heparina + cateterismo eletivo',
        'Nitroglicerina SL + morfina + AAS + cateterismo urgente',
      ],
      correctIndex: 0,
      explanation: 'IAM inferior (DII, DIII, aVF) com instabilidade hemodinâmica e bradicardia. Angioplastia primária é superior a trombolítico em centros com capacidade (tempo porta-balão <90-120min). Atropina se bradicardia sintomática. Betabloqueador está CONTRAINDICADO (bradicardia + hipotensão). Questão exige síntese de protocolos ACS + interpretação hemodinâmica.',
      difficulty: 'avancado',
      targetYear: 5,
      topics: ['cardiologia', 'emergência', 'síndrome coronariana aguda'],
      bloomLevel: 'sintese',
      estimatedTime: 120,
      references: [
        {
          id: 'ref_stemi_guidelines',
          title: 'ESC Guidelines for STEMI Management',
          authors: ['European Society of Cardiology'],
          source: 'European Heart Journal',
          year: 2023,
          quality: 'gold',
          citationCount: 3200,
        },
      ],
    },
    // 6º Ano - Residência
    {
      id: 'q6_residencia',
      question: 'Gestante de 32 semanas com diagnóstico recente de hipertireoidismo (TSH <0,01, T4L elevado). Apresenta taquicardia, tremores e perda ponderal. Qual a melhor conduta considerando risco fetal e materno?',
      options: [
        'Propiltiouracil (PTU) na menor dose efetiva + propranolol + monitorar T4L materno e crescimento fetal',
        'Metimazol + atenolol + ultrassom obstétrico mensal',
        'Radioiodo (I-131) em dose fracionada para evitar toxicidade fetal',
        'Tireoidectomia subtotal imediata no 2º trimestre',
      ],
      correctIndex: 0,
      explanation: 'Em gestantes, PTU é preferido no 1º trimestre (menor risco de aplasia cutis); no 2º/3º trimestres, ambos PTU e metimazol podem ser usados, mas PTU já iniciado geralmente é mantido. Radioiodo é CONTRAINDICADO (ablação de tireoide fetal). Betabloqueador para sintomas adrenérgicos (propranolol preferível a atenolol). Cirurgia reservada para casos refratários. Meta: T4L no limite superior da normalidade para evitar hipotireoidismo fetal. Questão típica de prova de residência - integração obstetrícia + endocrinologia + farmacoterapia.',
      difficulty: 'residencia',
      targetYear: 6,
      topics: ['endocrinologia', 'obstetrícia', 'hipertireoidismo', 'farmacoterapia'],
      bloomLevel: 'avaliacao',
      estimatedTime: 150,
      references: [
        {
          id: 'ref_thyroid_pregnancy',
          title: 'Management of Thyroid Dysfunction during Pregnancy and Postpartum',
          authors: ['American Thyroid Association'],
          source: 'Thyroid',
          year: 2023,
          quality: 'gold',
          citationCount: 1850,
        },
      ],
    },
    // ===== NOVAS QUESTÕES - CLÍNICA MÉDICA =====
    // 1º Ano - Clínica Médica Básica
    {
      id: 'q7_clinica_semiologia',
      question: 'Na ausculta cardíaca, qual foco corresponde à válvula mitral?',
      options: [
        'Foco aórtico (2º EID)',
        'Foco pulmonar (2º EIE)',
        'Foco tricúspide (base do apêndice xifoide)',
        'Foco mitral (ápice, 5º EIE na LHC)',
      ],
      correctIndex: 3,
      explanation: 'O foco mitral localiza-se no ápice do coração, no 5º espaço intercostal esquerdo na linha hemiclavicular. É o melhor local para auscultar a válvula mitral e detectar sopros mitrais.',
      difficulty: 'basico',
      targetYear: 1,
      topics: ['clinica-medica', 'semiologia', 'cardiologia'],
      bloomLevel: 'conhecimento',
      estimatedTime: 25,
      references: [
        { id: 'ref_porto', title: 'Semiologia Médica', authors: ['Celmo Celeno Porto'], source: 'Guanabara Koogan', year: 2019, quality: 'gold' },
      ],
    },
    {
      id: 'q8_clinica_sinais',
      question: 'O sinal de Blumberg positivo indica:',
      options: [
        'Derrame pleural',
        'Irritação peritoneal',
        'Hepatomegalia',
        'Obstrução intestinal',
      ],
      correctIndex: 1,
      explanation: 'O sinal de Blumberg (dor à descompressão brusca do abdome) é um sinal clássico de irritação peritoneal, sendo fundamental na avaliação de abdome agudo, especialmente apendicite.',
      difficulty: 'basico',
      targetYear: 1,
      topics: ['clinica-medica', 'semiologia', 'cirurgia'],
      bloomLevel: 'conhecimento',
      estimatedTime: 20,
      references: [
        { id: 'ref_porto2', title: 'Semiologia Médica', authors: ['Celmo Celeno Porto'], source: 'Guanabara Koogan', year: 2019, quality: 'gold' },
      ],
    },
    {
      id: 'q9_clinica_pressao',
      question: 'Segundo as Diretrizes Brasileiras de Hipertensão (2020), qual é o valor de pressão arterial que define hipertensão estágio 1?',
      options: [
        'PAS 120-129 e/ou PAD 80-84 mmHg',
        'PAS 130-139 e/ou PAD 85-89 mmHg',
        'PAS 140-159 e/ou PAD 90-99 mmHg',
        'PAS ≥ 160 e/ou PAD ≥ 100 mmHg',
      ],
      correctIndex: 2,
      explanation: 'Hipertensão estágio 1 é definida como PAS 140-159 e/ou PAD 90-99 mmHg. Valores de 130-139/85-89 são classificados como pré-hipertensão.',
      difficulty: 'basico',
      targetYear: 1,
      topics: ['clinica-medica', 'cardiologia', 'hipertensão'],
      bloomLevel: 'conhecimento',
      estimatedTime: 30,
      references: [
        { id: 'ref_dbha', title: 'Diretrizes Brasileiras de Hipertensão Arterial', authors: ['Sociedade Brasileira de Cardiologia'], source: 'Arq Bras Cardiol', year: 2020, quality: 'gold' },
      ],
    },
    // 2º Ano - Clínica Médica Intermediária
    {
      id: 'q10_clinica_diabetes',
      question: 'Qual é o critério diagnóstico de Diabetes Mellitus pela hemoglobina glicada (HbA1c)?',
      options: [
        'HbA1c ≥ 5,7%',
        'HbA1c ≥ 6,0%',
        'HbA1c ≥ 6,5%',
        'HbA1c ≥ 7,0%',
      ],
      correctIndex: 2,
      explanation: 'O diagnóstico de DM é feito com HbA1c ≥ 6,5% (confirmada em 2 medidas). Valores entre 5,7-6,4% indicam pré-diabetes. HbA1c ≥ 7,0% é meta terapêutica, não critério diagnóstico.',
      difficulty: 'intermediario',
      targetYear: 2,
      topics: ['clinica-medica', 'endocrinologia', 'diabetes'],
      bloomLevel: 'compreensao',
      estimatedTime: 30,
      references: [
        { id: 'ref_sbd', title: 'Diretrizes da Sociedade Brasileira de Diabetes 2023', authors: ['Sociedade Brasileira de Diabetes'], source: 'Editora Clannad', year: 2023, quality: 'gold' },
        { id: 'ref_ada', title: 'Standards of Care in Diabetes', authors: ['American Diabetes Association'], source: 'Diabetes Care', year: 2024, quality: 'gold' },
      ],
    },
    {
      id: 'q11_clinica_ecg',
      question: 'No eletrocardiograma, o intervalo PR normal tem duração de:',
      options: [
        '0,06 a 0,10 segundos',
        '0,12 a 0,20 segundos',
        '0,22 a 0,28 segundos',
        '0,30 a 0,40 segundos',
      ],
      correctIndex: 1,
      explanation: 'O intervalo PR normal varia de 0,12 a 0,20 segundos (120-200ms). Valores acima de 200ms indicam bloqueio atrioventricular de 1º grau. O intervalo PR representa o tempo de condução do impulso do nó sinusal ao ventrículo.',
      difficulty: 'intermediario',
      targetYear: 2,
      topics: ['clinica-medica', 'cardiologia', 'eletrocardiografia'],
      bloomLevel: 'compreensao',
      estimatedTime: 25,
      references: [
        { id: 'ref_ecg', title: 'Eletrocardiograma em 7 Minutos', authors: ['Emanuel Goldberger'], source: 'Elsevier', year: 2018, quality: 'gold' },
      ],
    },
    {
      id: 'q12_clinica_pneumonia',
      question: 'Qual é o agente etiológico mais comum da pneumonia adquirida na comunidade (PAC) em adultos?',
      options: [
        'Haemophilus influenzae',
        'Staphylococcus aureus',
        'Streptococcus pneumoniae',
        'Klebsiella pneumoniae',
      ],
      correctIndex: 2,
      explanation: 'O Streptococcus pneumoniae (pneumococo) é o agente mais frequente da PAC em todas as faixas etárias. A cobertura empírica para pneumococo é obrigatória em qualquer esquema de tratamento de PAC.',
      difficulty: 'intermediario',
      targetYear: 2,
      topics: ['clinica-medica', 'pneumologia', 'infectologia'],
      bloomLevel: 'conhecimento',
      estimatedTime: 20,
      references: [
        { id: 'ref_sbpt', title: 'Diretrizes Brasileiras para PAC em Adultos Imunocompetentes', authors: ['Sociedade Brasileira de Pneumologia e Tisiologia'], source: 'J Bras Pneumol', year: 2022, quality: 'gold' },
      ],
    },
    // 3º Ano - Clínica Médica Avançada
    {
      id: 'q13_clinica_iam',
      question: 'Paciente de 55 anos, tabagista, chega ao PS com dor torácica típica há 2 horas. ECG mostra supradesnivelamento de ST em DII, DIII e aVF. Qual a conduta IMEDIATA mais adequada?',
      options: [
        'Solicitar troponina e aguardar resultado',
        'Iniciar heparina e encaminhar para cateterismo em 24h',
        'Angioplastia primária (ICP) em até 90 minutos',
        'Trombólise apenas se não houver serviço de hemodinâmica',
      ],
      correctIndex: 2,
      explanation: 'No IAM com supra de ST (IAMCSST), a reperfusão imediata é a prioridade. A angioplastia primária (ICP) é o tratamento de escolha quando disponível em até 90 minutos (porta-balão). A trombólise é alternativa quando ICP não está disponível em tempo hábil.',
      difficulty: 'avancado',
      targetYear: 3,
      topics: ['clinica-medica', 'cardiologia', 'emergência'],
      bloomLevel: 'aplicacao',
      estimatedTime: 60,
      references: [
        { id: 'ref_sbc_iam', title: 'Diretriz de Síndromes Coronárias Agudas com Supradesnivelamento do ST', authors: ['Sociedade Brasileira de Cardiologia'], source: 'Arq Bras Cardiol', year: 2022, quality: 'gold' },
      ],
    },
    {
      id: 'q14_clinica_sepse',
      question: 'Segundo o Sepsis-3, qual critério define sepse?',
      options: [
        'SIRS + infecção suspeita',
        'Infecção suspeita + aumento ≥ 2 pontos no SOFA',
        'Infecção + hipotensão arterial',
        'Infecção + lactato > 4 mmol/L',
      ],
      correctIndex: 1,
      explanation: 'Desde o Sepsis-3 (2016), sepse é definida como disfunção orgânica ameaçadora à vida causada por resposta desregulada do hospedeiro à infecção, operacionalizada como aumento ≥ 2 pontos no escore SOFA. Os critérios de SIRS foram abandonados por baixa especificidade.',
      difficulty: 'avancado',
      targetYear: 3,
      topics: ['clinica-medica', 'infectologia', 'terapia intensiva'],
      bloomLevel: 'analise',
      estimatedTime: 45,
      references: [
        { id: 'ref_sepsis3', title: 'The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3)', authors: ['Singer M', 'Deutschman CS', 'Seymour CW'], source: 'JAMA', year: 2016, quality: 'gold', citationCount: 15000 },
      ],
    },
    {
      id: 'q15_clinica_asma',
      question: 'Paciente asmático em uso de salbutamol de resgate 3x/semana e com despertar noturno 1x/mês. Segundo o GINA, qual a classificação do controle da asma?',
      options: [
        'Controlada',
        'Parcialmente controlada',
        'Não controlada',
        'Exacerbação grave',
      ],
      correctIndex: 1,
      explanation: 'Pelo GINA, asma controlada: sintomas diurnos ≤2x/sem, sem despertar noturno, sem limitação de atividades, resgate ≤2x/sem. Parcialmente controlada: 1-2 critérios presentes. Não controlada: 3-4 critérios. Este paciente tem resgate >2x/sem (parcialmente controlada).',
      difficulty: 'intermediario',
      targetYear: 3,
      topics: ['clinica-medica', 'pneumologia', 'asma'],
      bloomLevel: 'aplicacao',
      estimatedTime: 45,
      references: [
        { id: 'ref_gina', title: 'Global Strategy for Asthma Management and Prevention (GINA)', authors: ['Global Initiative for Asthma'], source: 'GINA Report', year: 2024, quality: 'gold' },
      ],
    },
    // 4º Ano - Clínica Médica Complexa
    {
      id: 'q16_clinica_lupus',
      question: 'Paciente feminina, 28 anos, apresenta artralgia, rash malar, proteinuria 2g/24h e FAN 1:640 padrão homogêneo. Anti-dsDNA positivo. Qual a conduta mais adequada para a nefrite lúpica?',
      options: [
        'Prednisona isolada em dose alta',
        'Hidroxicloroquina isolada',
        'Indução com micofenolato ou ciclofosfamida + corticoide',
        'Anti-inflamatórios não esteroidais',
      ],
      correctIndex: 2,
      explanation: 'Nefrite lúpica classe III/IV requer terapia de indução com imunossupressor (micofenolato de mofetila ou ciclofosfamida IV) associado a corticoide. A hidroxicloroquina deve ser mantida em todos os pacientes com LES, mas não é suficiente para nefrite.',
      difficulty: 'avancado',
      targetYear: 4,
      topics: ['clinica-medica', 'reumatologia', 'nefrologia'],
      bloomLevel: 'analise',
      estimatedTime: 60,
      references: [
        { id: 'ref_eular', title: 'EULAR/ERA-EDTA recommendations for the management of lupus nephritis', authors: ['Fanouriakis A', 'Kostopoulou M'], source: 'Ann Rheum Dis', year: 2020, quality: 'gold' },
      ],
    },
    {
      id: 'q17_clinica_cirrose',
      question: 'Paciente cirrótico com ascite tensa e creatinina em elevação. Sodémia de 125 mEq/L. Qual a principal hipótese para a lesão renal?',
      options: [
        'Necrose tubular aguda',
        'Glomerulonefrite membranosa',
        'Síndrome hepatorrenal',
        'Nefrite intersticial por drogas',
      ],
      correctIndex: 2,
      explanation: 'A síndrome hepatorrenal (SHR) é uma complicação grave da cirrose avançada com ascite. Caracteriza-se por vasodilatação esplâncnica, redução do volume arterial efetivo e vasoconstrição renal. A hiponatremia dilucional é um marcador de gravidade.',
      difficulty: 'avancado',
      targetYear: 4,
      topics: ['clinica-medica', 'hepatologia', 'nefrologia'],
      bloomLevel: 'analise',
      estimatedTime: 60,
      references: [
        { id: 'ref_easl', title: 'EASL Clinical Practice Guidelines on the management of hepatorenal syndrome', authors: ['European Association for the Study of the Liver'], source: 'J Hepatol', year: 2023, quality: 'gold' },
      ],
    },
    // 5º Ano - Clínica Avançada
    {
      id: 'q18_clinica_choque',
      question: 'Paciente em choque séptico refratário a noradrenalina 0,5 mcg/kg/min. Lactato 6 mmol/L. Qual a próxima medida mais adequada?',
      options: [
        'Dobrar a dose de noradrenalina',
        'Associar vasopressina (até 0,03 U/min)',
        'Iniciar adrenalina em dose alta',
        'Suspender vasopressor e iniciar dobutamina',
      ],
      correctIndex: 1,
      explanation: 'No choque séptico refratário à noradrenalina, o Surviving Sepsis Campaign recomenda associar vasopressina (até 0,03 U/min) como segundo vasopressor, em vez de escalonar noradrenalina indefinidamente. A vasopressina atua por mecanismo diferente (receptores V1) e pode reduzir a dose de catecolaminas.',
      difficulty: 'avancado',
      targetYear: 5,
      topics: ['clinica-medica', 'terapia intensiva', 'emergência'],
      bloomLevel: 'sintese',
      estimatedTime: 60,
      references: [
        { id: 'ref_ssc', title: 'Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021', authors: ['Evans L', 'Rhodes A', 'Alhazzani W'], source: 'Intensive Care Med', year: 2021, quality: 'gold', citationCount: 5000 },
      ],
    },
    // 6º Ano - Nível Residência
    {
      id: 'q19_clinica_residencia',
      question: 'Mulher de 65 anos, diabética e hipertensa, apresenta edema agudo de pulmão com PA 220x120 mmHg. ECG com sobrecarga ventricular esquerda. Qual o anti-hipertensivo de escolha nesta emergência?',
      options: [
        'Captopril sublingual',
        'Nitroprussiato de sódio IV',
        'Nifedipino sublingual',
        'Clonidina oral',
      ],
      correctIndex: 1,
      explanation: 'No edema agudo de pulmão hipertensivo (emergência hipertensiva com lesão de órgão-alvo), o nitroprussiato de sódio IV é o vasodilatador de escolha por seu efeito rápido e titulável. Nifedipino sublingual é CONTRAINDICADO por causar hipotensão imprevisível. Captopril sublingual não tem absorção sublingual comprovada.',
      difficulty: 'residencia',
      targetYear: 6,
      topics: ['clinica-medica', 'cardiologia', 'emergência', 'hipertensão'],
      bloomLevel: 'avaliacao',
      estimatedTime: 60,
      references: [
        { id: 'ref_dbha2', title: 'Diretrizes Brasileiras de Hipertensão Arterial – Capítulo Emergências', authors: ['Sociedade Brasileira de Cardiologia'], source: 'Arq Bras Cardiol', year: 2020, quality: 'gold' },
      ],
    },
    // ===== PEDIATRIA =====
    {
      id: 'q20_pediatria_bronquiolite',
      question: 'Lactente de 4 meses com coriza, tosse e sibilos difusos. Qual o agente etiológico mais provável?',
      options: [
        'Influenza A',
        'Vírus Sincicial Respiratório (VSR)',
        'Adenovirus',
        'Parainfluenza',
      ],
      correctIndex: 1,
      explanation: 'O Vírus Sincicial Respiratório (VSR) é o agente mais comum da bronquiolite viral aguda em lactentes, responsável por 50-80% dos casos. O tratamento é suportivo (oxigênio, hidratação).',
      difficulty: 'intermediario',
      targetYear: 2,
      topics: ['clinica-medica', 'pediatria', 'pneumologia'],
      bloomLevel: 'conhecimento',
      estimatedTime: 25,
      references: [
        { id: 'ref_nelson', title: 'Nelson Textbook of Pediatrics', authors: ['Kliegman RM', 'St Geme JW'], source: 'Elsevier', year: 2020, quality: 'gold' },
      ],
    },
    // ===== GINECOLOGIA =====
    {
      id: 'q21_gineco_preeclampsia',
      question: 'Gestante de 32 semanas com PA 160x110 mmHg, proteinuria 3+ e cefaleia intensa. Qual a conduta prioritária?',
      options: [
        'Sulfato de magnésio e anti-hipertensivo IV',
        'Parto cesáreo imediato sem estabilização',
        'Observação clínica por 48h',
        'Nifedipino oral e alta hospitalar',
      ],
      correctIndex: 0,
      explanation: 'Na pré-eclâmpsia grave com sinais de iminencia de eclâmpsia (cefaleia intensa), a prioridade é estabilização materna com sulfato de magnésio (prevenção de convulsões) e anti-hipertensivo IV (hidralazina ou labetalol). A resolução da gestação é indicada após estabilização.',
      difficulty: 'avancado',
      targetYear: 3,
      topics: ['clinica-medica', 'ginecologia', 'obstetricia'],
      bloomLevel: 'aplicacao',
      estimatedTime: 45,
      references: [
        { id: 'ref_acog', title: 'Gestational Hypertension and Preeclampsia: ACOG Practice Bulletin', authors: ['American College of Obstetricians and Gynecologists'], source: 'Obstet Gynecol', year: 2020, quality: 'gold' },
      ],
    },
    // ===== SAÚDE COLETIVA =====
    {
      id: 'q22_saude_coletiva',
      question: 'No calendário nacional de vacinação, a vacina BCG deve ser administrada:',
      options: [
        'Ao nascer, dose única',
        'Aos 2 meses, com reforço aos 4 meses',
        'Aos 6 meses, dose única',
        'Ao nascer, com reforço aos 6 anos',
      ],
      correctIndex: 0,
      explanation: 'A BCG (Bacilo de Calmette-Guérin) é administrada ao nascer em dose única, preferencialmente nas primeiras 12 horas de vida. Protege contra formas graves de tuberculose (meningite tuberculosa e TB miliar) em crianças.',
      difficulty: 'basico',
      targetYear: 1,
      topics: ['clinica-medica', 'saude-coletiva', 'pediatria'],
      bloomLevel: 'conhecimento',
      estimatedTime: 20,
      references: [
        { id: 'ref_pni', title: 'Programa Nacional de Imunizações - Calendário Nacional de Vacinação', authors: ['Ministério da Saúde'], source: 'MS/SVS', year: 2024, quality: 'gold' },
      ],
    },
    // ===== FARMACOLOGIA =====
    {
      id: 'q23_farmaco_antibiotico',
      question: 'Qual é o mecanismo de ação das penicilinas?',
      options: [
        'Inibição da síntese proteica (subunidade 30S)',
        'Inibição da síntese de parede celular (PBPs)',
        'Inibição da síntese de ácido fólico',
        'Inibição da DNA girase',
      ],
      correctIndex: 1,
      explanation: 'As penicilinas são antibióticos beta-lactâmicos que inibem a síntese de parede celular bacteriana ao se ligar às Proteínas Ligadoras de Penicilina (PBPs), impedindo a transpeptidação do peptidoglicano.',
      difficulty: 'basico',
      targetYear: 2,
      topics: ['clinica-medica', 'farmacologia', 'infectologia'],
      bloomLevel: 'conhecimento',
      estimatedTime: 25,
      references: [
        { id: 'ref_goodman', title: 'Goodman & Gilman: As Bases Farmacológicas da Terapêutica', authors: ['Brunton LL', 'Hilal-Dandan R'], source: 'McGraw-Hill', year: 2023, quality: 'gold' },
      ],
    },
  ];

  // Filter quizzes based on year and subject
  const availableQuizzes = useMemo(() => {
    return allQuizzes.filter(quiz => {
      // Filter by subject - match any topic that starts with or equals subjectId
      if (subjectId) {
        const normalizedSubject = subjectId.toLowerCase().replace(/[\s-_]+/g, '-');
        const matchesTopic = quiz.topics.some(t => {
          const normalizedTopic = t.toLowerCase().replace(/[\s-_]+/g, '-');
          return normalizedTopic === normalizedSubject || normalizedTopic.includes(normalizedSubject) || normalizedSubject.includes(normalizedTopic);
        });
        if (!matchesTopic) return false;
      }
      
      // Filter by year - show questions for current year and below
      if (quiz.targetYear > currentYear) return false;
      
      return true;
    });
  }, [allQuizzes, currentYear, subjectId, materialId]);;

  const currentQuestion = availableQuizzes[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / availableQuizzes.length) * 100;

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return; // Already answered
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const isCorrect = selectedAnswer === currentQuestion.correctIndex;

    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.id,
        correct: isCorrect,
        timeSpent,
      },
    ]);

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < availableQuizzes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setStartTime(Date.now());
    } else {
      // Quiz completed
      const correctCount = answers.filter(a => a.correct).length + (selectedAnswer === currentQuestion.correctIndex ? 1 : 0);
      const totalCount = availableQuizzes.length;
      const score = Math.round((correctCount / totalCount) * 100);
      
      if (onComplete) {
        onComplete(score, correctCount, totalCount);
      }
    }
  };

  if (availableQuizzes.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <span className="text-4xl">📝</span>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Nenhum quiz disponível</h3>
        <p className="text-muted-foreground">
          Ainda não há questões para este tópico e ano
        </p>
      </div>
    );
  }

  // Difficulty color mapping
  const difficultyConfig = {
    basico: { label: 'Básico', color: 'bg-green-100 text-green-800 border-green-200' },
    intermediario: { label: 'Intermediário', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    avancado: { label: 'Avançado', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    residencia: { label: 'Residência', color: 'bg-red-100 text-red-800 border-red-200' },
  };

  const bloomConfig = {
    conhecimento: { icon: '📖', label: 'Conhecimento' },
    compreensao: { icon: '💡', label: 'Compreensão' },
    aplicacao: { icon: '🔧', label: 'Aplicação' },
    analise: { icon: '🔍', label: 'Análise' },
    sintese: { icon: '🧩', label: 'Síntese' },
    avaliacao: { icon: '⚖️', label: 'Avaliação' },
  };

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Quiz Progressivo - {currentYear}º Ano
              </h1>
              <p className="text-muted-foreground">
                Questão {currentQuestionIndex + 1} de {availableQuizzes.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {answers.filter(a => a.correct).length} / {answers.length}
              </div>
              <div className="text-xs text-muted-foreground">corretas até agora</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-card border border-border rounded-xl p-8 mb-6">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${difficultyConfig[currentQuestion.difficulty].color}`}>
              {difficultyConfig[currentQuestion.difficulty].label}
            </span>
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              {bloomConfig[currentQuestion.bloomLevel].icon} {bloomConfig[currentQuestion.bloomLevel].label}
            </span>
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-muted text-foreground border border-border">
              ⏱️ ~{currentQuestion.estimatedTime}s
            </span>
            {currentQuestion.targetYear && (
              <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                📚 {currentQuestion.targetYear}º Ano
              </span>
            )}
          </div>

          {/* Question */}
          <h2 className="text-xl font-bold text-foreground mb-6 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctIndex;
              const showResult = showExplanation;

              let optionClass = 'bg-muted hover:bg-muted/80 border-border';
              
              if (showResult) {
                if (isCorrect) {
                  optionClass = 'bg-green-50 border-green-500 ring-2 ring-green-200';
                } else if (isSelected && !isCorrect) {
                  optionClass = 'bg-red-50 border-red-500 ring-2 ring-red-200';
                }
              } else if (isSelected) {
                optionClass = 'bg-primary/10 border-primary ring-2 ring-primary/20';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 border-2 rounded-xl text-left transition-all ${optionClass} ${
                    showExplanation ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      showResult && isCorrect ? 'bg-green-500 text-white' :
                      showResult && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                      isSelected ? 'bg-primary text-primary-foreground' :
                      'bg-background text-foreground'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className={`text-sm font-medium ${
                      showResult && isCorrect ? 'text-green-900' :
                      showResult && isSelected && !isCorrect ? 'text-red-900' :
                      'text-foreground'
                    }`}>
                      {option}
                    </span>
                    {showResult && isCorrect && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600 ml-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-600 ml-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`mt-6 p-5 rounded-xl border-2 ${
              selectedAnswer === currentQuestion.correctIndex
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3 mb-3">
                {selectedAnswer === currentQuestion.correctIndex ? (
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-2 ${
                    selectedAnswer === currentQuestion.correctIndex ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {selectedAnswer === currentQuestion.correctIndex ? 'Correto! 🎉' : 'Incorreto'}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    selectedAnswer === currentQuestion.correctIndex ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>

              {/* References */}
              {currentQuestion.references.length > 0 && (
                <div className="mt-4 pt-4 border-t border-current/20">
                  <h4 className="text-xs font-bold text-foreground/70 mb-2">📚 REFERÊNCIAS:</h4>
                  {currentQuestion.references.map(ref => (
                    <div key={ref.id} className="text-xs text-foreground/60 mb-1">
                      <span className="font-semibold">{ref.title}</span>
                      {' — '}
                      <span>{ref.authors.join(', ')}</span>
                      {' • '}
                      <span>{ref.source}, {ref.year}</span>
                      {ref.quality === 'gold' && <span className="ml-2">🥇</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            {!showExplanation ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className={`flex-1 py-3 px-6 rounded-lg font-bold text-white transition-all ${
                  selectedAnswer === null
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                Confirmar Resposta
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all"
              >
                {currentQuestionIndex < availableQuizzes.length - 1 ? 'Próxima Questão →' : 'Finalizar Quiz 🎯'}
              </button>
            )}
          </div>
        </div>

        {/* Topics */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-2">Tópicos abordados:</h3>
          <div className="flex flex-wrap gap-2">
            {currentQuestion.topics.map(topic => (
              <span key={topic} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressiveQuizSystem;
