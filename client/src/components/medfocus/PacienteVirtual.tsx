/**
 * MedFocus — Paciente Virtual Interativo
 * Sprint 60: Simulador de Anamnese com IA
 * 
 * Funcionalidades transformadoras:
 * - 12 pacientes virtuais com histórias clínicas completas
 * - Anamnese interativa passo a passo (QP, HDA, HPP, HF, HS, ISDA)
 * - Exame físico simulado com achados
 * - IA avalia a qualidade da anamnese
 * - Score de performance com feedback detalhado
 * - Diagnóstico diferencial e conduta
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';

interface VirtualPatient {
  id: string;
  name: string;
  age: number;
  sex: 'M' | 'F';
  occupation: string;
  photo: string; // emoji
  difficulty: 'Fácil' | 'Moderado' | 'Difícil' | 'Expert';
  specialty: string;
  chiefComplaint: string;
  diagnosis: string;
  history: {
    hda: string;
    hpp: string[];
    medications: string[];
    allergies: string[];
    familyHistory: string[];
    socialHistory: string;
    reviewOfSystems: Record<string, string>;
  };
  physicalExam: {
    vitals: { pa: string; fc: string; fr: string; temp: string; spo2: string };
    general: string;
    findings: Record<string, string>;
  };
  labs: { name: string; value: string; reference: string; abnormal: boolean }[];
  differentialDx: { diagnosis: string; probability: string; keyFindings: string }[];
  management: string[];
  teachingPoints: string[];
}

const PATIENTS: VirtualPatient[] = [
  {
    id: 'p1',
    name: 'Maria Silva',
    age: 58,
    sex: 'F',
    occupation: 'Professora aposentada',
    photo: '👩‍🦳',
    difficulty: 'Moderado',
    specialty: 'Cardiologia',
    chiefComplaint: 'Dor no peito há 3 horas',
    diagnosis: 'Síndrome Coronariana Aguda (IAM SSST)',
    history: {
      hda: 'Paciente refere dor precordial em aperto, de forte intensidade (8/10), com irradiação para membro superior esquerdo e mandíbula, iniciada há 3 horas durante repouso. Associada a náuseas, sudorese fria e dispneia. Nega relação com esforço prévio. Já teve episódio semelhante há 2 meses, mais leve, que cedeu espontaneamente.',
      hpp: ['Hipertensão arterial há 15 anos', 'Diabetes mellitus tipo 2 há 8 anos', 'Dislipidemia', 'Menopausa aos 50 anos'],
      medications: ['Losartana 50mg 12/12h', 'Metformina 850mg 8/8h', 'Sinvastatina 40mg à noite', 'AAS 100mg/dia'],
      allergies: ['Dipirona (urticária)'],
      familyHistory: ['Pai faleceu de IAM aos 55 anos', 'Mãe hipertensa', 'Irmão diabético'],
      socialHistory: 'Ex-tabagista (parou há 5 anos, carga tabágica 30 maços-ano). Nega etilismo. Sedentária. Mora com o marido. Alimentação rica em carboidratos.',
      reviewOfSystems: {
        'Cardiovascular': 'Dispneia aos médios esforços há 3 meses. Nega palpitações, síncope ou edema de MMII.',
        'Respiratório': 'Nega tosse, hemoptise ou sibilância.',
        'Gastrointestinal': 'Nega dor abdominal, náuseas crônicas ou alteração do hábito intestinal.',
        'Neurológico': 'Nega cefaleia, tonturas ou déficits focais.',
        'Endócrino': 'Poliúria e polidipsia ocasionais. Última HbA1c: 8.2%.',
      },
    },
    physicalExam: {
      vitals: { pa: '160/95 mmHg', fc: '98 bpm', fr: '22 irpm', temp: '36.4°C', spo2: '94% aa' },
      general: 'Regular estado geral, consciente, orientada, ansiosa, sudorese fria, palidez cutânea, acianótica.',
      findings: {
        'Cardiovascular': 'Bulhas rítmicas, hipofonéticas, sem sopros. Pulsos periféricos presentes e simétricos.',
        'Respiratório': 'Murmúrio vesicular presente bilateralmente, crepitações finas em bases.',
        'Abdome': 'Globoso, flácido, indolor à palpação, sem visceromegalias.',
        'Extremidades': 'Sem edema, sem sinais de TVP. Perfusão periférica lentificada (>3s).',
      },
    },
    labs: [
      { name: 'Troponina I', value: '2.8 ng/mL', reference: '<0.04 ng/mL', abnormal: true },
      { name: 'CK-MB', value: '45 U/L', reference: '<25 U/L', abnormal: true },
      { name: 'Glicemia', value: '245 mg/dL', reference: '70-100 mg/dL', abnormal: true },
      { name: 'Creatinina', value: '1.1 mg/dL', reference: '0.6-1.2 mg/dL', abnormal: false },
      { name: 'Hemoglobina', value: '12.8 g/dL', reference: '12-16 g/dL', abnormal: false },
      { name: 'Potássio', value: '4.2 mEq/L', reference: '3.5-5.0 mEq/L', abnormal: false },
      { name: 'BNP', value: '580 pg/mL', reference: '<100 pg/mL', abnormal: true },
    ],
    differentialDx: [
      { diagnosis: 'IAM sem supra de ST', probability: 'Alta (85%)', keyFindings: 'Dor típica + troponina elevada + fatores de risco' },
      { diagnosis: 'Angina instável', probability: 'Moderada', keyFindings: 'Se troponina fosse normal' },
      { diagnosis: 'Dissecção aórtica', probability: 'Baixa', keyFindings: 'Dor não é dilacerante, sem assimetria de pulsos' },
      { diagnosis: 'TEP', probability: 'Baixa', keyFindings: 'Sem fatores de risco para TEP, ECG não sugestivo' },
    ],
    management: [
      'MOV (Monitor, Oxigênio se SpO2 <94%, Veia)',
      'AAS 300mg mastigado (se não tomou)',
      'Clopidogrel 300mg (ataque)',
      'Enoxaparina 1mg/kg SC 12/12h',
      'Morfina 2-4mg IV se dor refratária',
      'Nitroglicerina SL se PA >100 mmHg',
      'Solicitar ECG seriado, ecocardiograma',
      'Estratificação invasiva (CATE) em 24-72h',
      'Controle glicêmico com insulina',
      'Estatina de alta potência',
    ],
    teachingPoints: [
      'MONABICHE: Morfina, O2, Nitrato, AAS, Betabloqueador, IECA, Clopidogrel, Enoxaparina',
      'Troponina é o biomarcador mais sensível e específico para necrose miocárdica',
      'IAM SSST: estratificação invasiva precoce (24-72h) vs. conservadora baseada no risco (GRACE/TIMI)',
      'Crepitações em bases sugerem congestão pulmonar — avaliar Killip',
    ],
  },
  {
    id: 'p2',
    name: 'João Santos',
    age: 32,
    sex: 'M',
    occupation: 'Engenheiro de software',
    photo: '👨‍💻',
    difficulty: 'Fácil',
    specialty: 'Gastroenterologia',
    chiefComplaint: 'Dor abdominal e diarreia há 2 semanas',
    diagnosis: 'Doença de Crohn (ileíte terminal)',
    history: {
      hda: 'Paciente refere dor abdominal em cólica, localizada em fossa ilíaca direita, de moderada intensidade (6/10), intermitente, pior após alimentação. Associada a diarreia aquosa (4-6 episódios/dia), sem sangue visível, mas com muco. Relata perda ponderal de 4kg em 2 semanas. Febre vespertina (37.8-38.2°C). Nega viagens recentes.',
      hpp: ['Úlceras orais recorrentes há 1 ano', 'Artralgia em joelhos e tornozelos'],
      medications: ['Ibuprofeno ocasional para artralgia'],
      allergies: ['Nega alergias conhecidas'],
      familyHistory: ['Tia materna com doença de Crohn', 'Pai com retocolite ulcerativa'],
      socialHistory: 'Tabagista (10 cigarros/dia há 8 anos). Etilismo social. Trabalho sedentário com alto estresse. Alimentação irregular.',
      reviewOfSystems: {
        'Gastrointestinal': 'Diarreia crônica, dor abdominal, perda de peso. Nega hematêmese ou melena.',
        'Musculoesquelético': 'Artralgia migratória em grandes articulações há 6 meses.',
        'Dermatológico': 'Lesão nodular dolorosa em perna esquerda há 1 semana (eritema nodoso?).',
        'Oftalmológico': 'Olho vermelho e doloroso episódico (uveíte anterior?).',
        'Geral': 'Fadiga intensa, febre vespertina, inapetência.',
      },
    },
    physicalExam: {
      vitals: { pa: '110/70 mmHg', fc: '88 bpm', fr: '16 irpm', temp: '37.9°C', spo2: '98% aa' },
      general: 'Emagrecido, descorado +/4+, desidratado +/4+, febril. IMC 19.2.',
      findings: {
        'Abdome': 'Plano, RHA aumentados, dor à palpação profunda em FID com massa palpável. Blumberg duvidoso. Sem sinais de peritonite difusa.',
        'Cavidade oral': 'Úlceras aftosas em mucosa jugal bilateral.',
        'Pele': 'Nódulo eritematoso, doloroso, de 3cm em face anterior da perna esquerda (eritema nodoso).',
        'Articular': 'Edema leve em joelho direito, sem sinais flogísticos intensos.',
        'Perianal': 'Fissura anal posterior. Sem fístulas visíveis.',
      },
    },
    labs: [
      { name: 'Hemoglobina', value: '10.2 g/dL', reference: '13-17 g/dL', abnormal: true },
      { name: 'VCM', value: '78 fL', reference: '80-100 fL', abnormal: true },
      { name: 'PCR', value: '48 mg/L', reference: '<5 mg/L', abnormal: true },
      { name: 'VHS', value: '62 mm/h', reference: '<20 mm/h', abnormal: true },
      { name: 'Albumina', value: '2.8 g/dL', reference: '3.5-5.0 g/dL', abnormal: true },
      { name: 'Calprotectina fecal', value: '850 µg/g', reference: '<50 µg/g', abnormal: true },
      { name: 'Vitamina B12', value: '180 pg/mL', reference: '200-900 pg/mL', abnormal: true },
      { name: 'Ferritina', value: '12 ng/mL', reference: '30-300 ng/mL', abnormal: true },
    ],
    differentialDx: [
      { diagnosis: 'Doença de Crohn', probability: 'Alta (80%)', keyFindings: 'Dor FID + diarreia + manifestações extraintestinais + história familiar + tabagismo' },
      { diagnosis: 'Tuberculose intestinal', probability: 'Moderada', keyFindings: 'Febre + emagrecimento + massa em FID (deve ser excluída)' },
      { diagnosis: 'Apendicite subaguda', probability: 'Baixa', keyFindings: 'Dor em FID, mas evolução crônica e diarreia não são típicas' },
      { diagnosis: 'Linfoma intestinal', probability: 'Baixa', keyFindings: 'Massa abdominal + sintomas B, mas idade jovem' },
    ],
    management: [
      'Colonoscopia com ileoscopia e biópsias (padrão-ouro)',
      'TC de abdome para avaliar extensão e complicações',
      'Reposição de ferro IV e vitamina B12 IM',
      'Cessação do tabagismo (piora prognóstico)',
      'Corticoterapia para indução de remissão (Prednisona 40mg/dia)',
      'Azatioprina ou anti-TNF para manutenção',
      'Suporte nutricional (dieta hipercalórica, hiperproteica)',
      'Acompanhamento multidisciplinar (gastro, nutri, psicologia)',
    ],
    teachingPoints: [
      'Doença de Crohn: "boca ao ânus", transmural, skip lesions, granulomas não caseosos',
      'Manifestações extraintestinais: artralgia, eritema nodoso, uveíte, úlceras orais',
      'Calprotectina fecal é excelente marcador não invasivo de inflamação intestinal',
      'Tabagismo é fator de risco para Crohn (diferente de RCU, onde é "protetor")',
    ],
  },
  {
    id: 'p3', name: 'Ana Oliveira', age: 25, sex: 'F', occupation: 'Estudante de Direito', photo: '👩‍🎓',
    difficulty: 'Difícil', specialty: 'Neurologia', chiefComplaint: 'Cefaleia intensa e visão dupla há 5 dias',
    diagnosis: 'Hipertensão Intracraniana Idiopática (Pseudotumor Cerebri)',
    history: { hda: 'Cefaleia holocraniana, pulsátil, progressiva, pior ao deitar e ao tossir. Visão dupla horizontal. Zumbido pulsátil bilateral. Náuseas sem vômitos. Uso de isotretinoína há 3 meses para acne.', hpp: ['Obesidade (IMC 34)', 'Acne severa em tratamento'], medications: ['Isotretinoína 40mg/dia', 'Anticoncepcional oral combinado'], allergies: ['Nega'], familyHistory: ['Mãe com enxaqueca'], socialHistory: 'Universitária, sedentária, ganhou 8kg nos últimos 6 meses. Nega tabagismo e etilismo.', reviewOfSystems: { 'Neurológico': 'Cefaleia progressiva, diplopia, zumbido pulsátil. Nega fraqueza, parestesias ou convulsões.', 'Oftalmológico': 'Visão borrada transitória ao levantar (obscurecimentos visuais). Diplopia horizontal.', 'Geral': 'Ganho ponderal recente. Nega febre.' } },
    physicalExam: { vitals: { pa: '130/85 mmHg', fc: '78 bpm', fr: '16 irpm', temp: '36.5°C', spo2: '99% aa' }, general: 'Obesa, consciente, orientada, sem sinais meníngeos.', findings: { 'Neurológico': 'Papiledema bilateral grau III (fundoscopia). Paresia do VI nervo craniano bilateral (limitação da abdução ocular). Restante do exame neurológico normal.', 'Oftalmológico': 'Acuidade visual: OD 20/30, OE 20/40. Campimetria: aumento da mancha cega bilateral.' } },
    labs: [
      { name: 'RM crânio', value: 'Sem lesões expansivas. Sela turca vazia parcial. Estenose de seios transversos.', reference: 'Normal', abnormal: true },
      { name: 'Pressão de abertura (LCR)', value: '32 cmH2O', reference: '<25 cmH2O', abnormal: true },
      { name: 'Citologia LCR', value: 'Normal', reference: 'Normal', abnormal: false },
      { name: 'Proteína LCR', value: '18 mg/dL', reference: '15-45 mg/dL', abnormal: false },
    ],
    differentialDx: [
      { diagnosis: 'Hipertensão Intracraniana Idiopática', probability: 'Alta (90%)', keyFindings: 'Mulher jovem, obesa, isotretinoína, papiledema, pressão LCR elevada, RM sem massa' },
      { diagnosis: 'Trombose venosa cerebral', probability: 'Moderada', keyFindings: 'ACO + cefaleia + papiledema (excluída pela RM com venografia)' },
      { diagnosis: 'Meningite crônica', probability: 'Baixa', keyFindings: 'LCR normal exclui' },
    ],
    management: ['Suspender isotretinoína e ACO', 'Acetazolamida 250mg 12/12h (aumentar gradualmente)', 'Perda ponderal (meta: 5-10% do peso)', 'Punção lombar terapêutica se sintomas visuais graves', 'Acompanhamento oftalmológico seriado (campimetria)', 'Considerar derivação se refratária'],
    teachingPoints: ['Critérios de Dandy modificados para HII', 'Isotretinoína, tetraciclinas e ACO são fatores de risco', 'Papiledema bilateral é o achado mais importante', 'Risco de perda visual permanente se não tratada'],
  },
  {
    id: 'p4', name: 'Carlos Mendes', age: 68, sex: 'M', occupation: 'Comerciante', photo: '👴',
    difficulty: 'Moderado', specialty: 'Pneumologia', chiefComplaint: 'Falta de ar progressiva há 6 meses',
    diagnosis: 'DPOC exacerbado + Cor Pulmonale',
    history: { hda: 'Dispneia progressiva, inicialmente aos grandes esforços, agora aos pequenos esforços (subir 1 lance de escada). Tosse produtiva matinal com expectoração amarelada há anos, piorada na última semana com escarro esverdeado. Ortopneia (2 travesseiros). Edema de MMII há 2 semanas.', hpp: ['DPOC diagnosticado há 10 anos', 'HAS', 'Ex-tabagista (60 maços-ano, parou há 2 anos)'], medications: ['Tiotrópio 18mcg/dia', 'Formoterol/Budesonida 12/400mcg 12/12h', 'Enalapril 10mg 12/12h'], allergies: ['Nega'], familyHistory: ['Pai com enfisema'], socialHistory: 'Ex-tabagista pesado. Exposição ocupacional a poeira de madeira por 20 anos. Etilismo social.', reviewOfSystems: { 'Respiratório': 'Dispneia, tosse produtiva, sibilância. Nega hemoptise.', 'Cardiovascular': 'Edema de MMII, ortopneia. Nega dor torácica.', 'Geral': 'Perda de 3kg em 3 meses. Fadiga intensa.' } },
    physicalExam: { vitals: { pa: '140/90 mmHg', fc: '105 bpm', fr: '28 irpm', temp: '37.2°C', spo2: '88% aa' }, general: 'Regular estado geral, dispneico, uso de musculatura acessória, tórax em tonel, cianose central leve.', findings: { 'Respiratório': 'Tórax hiperinsuflado. MV diminuído globalmente. Sibilos difusos expiratórios. Tempo expiratório prolongado. Crepitações em bases.', 'Cardiovascular': 'Hiperfonese de P2. Turgência jugular a 45°. Refluxo hepatojugular positivo.', 'Abdome': 'Hepatomegalia dolorosa (fígado a 4cm do RCD).', 'Extremidades': 'Edema de MMII 3+/4+, bilateral, simétrico. Baqueteamento digital.' } },
    labs: [
      { name: 'Gasometria arterial', value: 'pH 7.32, pCO2 58, pO2 52, HCO3 30, SatO2 85%', reference: 'pH 7.35-7.45', abnormal: true },
      { name: 'Hemoglobina', value: '17.8 g/dL', reference: '13-17 g/dL', abnormal: true },
      { name: 'Hematócrito', value: '54%', reference: '40-50%', abnormal: true },
      { name: 'BNP', value: '420 pg/mL', reference: '<100 pg/mL', abnormal: true },
      { name: 'Espirometria prévia', value: 'VEF1/CVF 0.55, VEF1 35% predito (GOLD IV)', reference: '>0.70', abnormal: true },
    ],
    differentialDx: [
      { diagnosis: 'DPOC exacerbado + Cor Pulmonale', probability: 'Alta (90%)', keyFindings: 'Tabagismo + espirometria obstrutiva + hipercapnia + sinais de IC direita' },
      { diagnosis: 'ICC descompensada', probability: 'Moderada', keyFindings: 'Edema + dispneia, mas padrão obstrutivo predomina' },
      { diagnosis: 'TEP', probability: 'Baixa', keyFindings: 'Deve ser considerado na exacerbação aguda' },
    ],
    management: ['O2 suplementar (alvo SpO2 88-92%)', 'Broncodilatadores nebulizados (salbutamol + ipratrópio)', 'Corticoide sistêmico (Prednisona 40mg 5 dias)', 'Antibiótico (Amoxicilina-Clavulanato) pela expectoração purulenta', 'Furosemida IV para congestão', 'VNI se acidose respiratória persistente', 'Avaliar necessidade de O2 domiciliar'],
    teachingPoints: ['GOLD IV = DPOC muito grave (VEF1 <30%)', 'Policitemia secundária à hipoxemia crônica', 'Cor pulmonale: IC direita secundária a doença pulmonar', 'Alvo de SpO2 em DPOC: 88-92% (risco de narcose por CO2)'],
  },
  {
    id: 'p5', name: 'Fernanda Lima', age: 42, sex: 'F', occupation: 'Advogada', photo: '👩‍⚖️',
    difficulty: 'Difícil', specialty: 'Reumatologia', chiefComplaint: 'Dor e rigidez nas mãos há 4 meses',
    diagnosis: 'Artrite Reumatoide',
    history: { hda: 'Dor e edema simétrico em articulações metacarpofalangeanas e interfalangeanas proximais bilateral, com rigidez matinal >1 hora. Fadiga intensa. Nódulos subcutâneos em cotovelos. Piora progressiva apesar de AINEs.', hpp: ['Síndrome de Sjögren (olho seco crônico)', 'Hipotireoidismo'], medications: ['Levotiroxina 75mcg/dia', 'Ibuprofeno 600mg 8/8h', 'Colírio lubrificante'], allergies: ['Sulfa'], familyHistory: ['Mãe com artrite reumatoide', 'Tia com lúpus'], socialHistory: 'Não tabagista. Estresse laboral intenso. Nega etilismo.', reviewOfSystems: { 'Musculoesquelético': 'Artralgia simétrica, rigidez matinal prolongada, nódulos subcutâneos.', 'Oftalmológico': 'Olho seco crônico (Sjögren).', 'Geral': 'Fadiga, febre baixa vespertina ocasional.' } },
    physicalExam: { vitals: { pa: '120/80 mmHg', fc: '76 bpm', fr: '16 irpm', temp: '36.8°C', spo2: '98% aa' }, general: 'Bom estado geral, orientada, sem sinais de toxemia.', findings: { 'Articular': 'Edema e dor em MCF 2-4 bilateral e IFP 2-3 bilateral. Teste de squeeze positivo. Nódulos reumatoides em olécrano bilateral. Sem deformidades (ainda).', 'Mãos': 'Tenossinovite de flexores. Sem desvio ulnar ou boutonnière (fase inicial).', 'Pele': 'Nódulos subcutâneos firmes em cotovelos.' } },
    labs: [
      { name: 'Fator Reumatoide', value: '128 UI/mL', reference: '<14 UI/mL', abnormal: true },
      { name: 'Anti-CCP', value: '245 U/mL', reference: '<20 U/mL', abnormal: true },
      { name: 'VHS', value: '48 mm/h', reference: '<20 mm/h', abnormal: true },
      { name: 'PCR', value: '32 mg/L', reference: '<5 mg/L', abnormal: true },
      { name: 'Hemoglobina', value: '11.2 g/dL', reference: '12-16 g/dL', abnormal: true },
      { name: 'RX mãos', value: 'Osteopenia periarticular em MCF. Sem erosões (ainda).', reference: 'Normal', abnormal: true },
    ],
    differentialDx: [
      { diagnosis: 'Artrite Reumatoide', probability: 'Alta (95%)', keyFindings: 'Artrite simétrica + FR e Anti-CCP positivos + rigidez matinal >1h + nódulos' },
      { diagnosis: 'Lúpus eritematoso sistêmico', probability: 'Baixa', keyFindings: 'Artralgia pode ocorrer, mas sem erosões e sem outros critérios' },
      { diagnosis: 'Artrite psoriásica', probability: 'Baixa', keyFindings: 'Sem lesões cutâneas de psoríase' },
    ],
    management: ['Metotrexato 15mg/semana (DMARD de primeira linha)', 'Ácido fólico 5mg/semana (dia seguinte ao MTX)', 'Prednisona 10mg/dia (bridge therapy, desmame em 3 meses)', 'Suspender AINE crônico', 'Avaliar anti-TNF se falha ao MTX em 3-6 meses', 'Fisioterapia e terapia ocupacional', 'Rastreio de tuberculose antes de biológico'],
    teachingPoints: ['Critérios ACR/EULAR 2010 para classificação de AR', 'Anti-CCP é mais específico que FR para AR', 'Window of opportunity: tratamento precoce previne erosões', 'Metotrexato é o DMARD âncora no tratamento da AR'],
  },
  {
    id: 'p6', name: 'Pedro Henrique', age: 8, sex: 'M', occupation: 'Estudante', photo: '👦',
    difficulty: 'Moderado', specialty: 'Pediatria', chiefComplaint: 'Febre alta e manchas no corpo há 3 dias',
    diagnosis: 'Febre Reumática (primeiro surto)',
    history: { hda: 'Criança com febre alta (39-40°C) há 3 dias, associada a dor e edema migratório em joelhos e tornozelos. Manchas avermelhadas no tronco. Há 3 semanas teve faringoamigdalite tratada com amoxicilina por apenas 3 dias (mãe suspendeu por melhora clínica).', hpp: ['Faringoamigdalites de repetição (3-4x/ano)', 'DNPM normal'], medications: ['Nenhuma atualmente'], allergies: ['Nega'], familyHistory: ['Mãe com sopro cardíaco desde infância'], socialHistory: 'Mora em comunidade, casa com 6 pessoas, 2 quartos. Frequenta escola pública. Vacinação em dia.', reviewOfSystems: { 'Cardiovascular': 'Dispneia leve aos esforços (não consegue correr como antes).', 'Musculoesquelético': 'Artrite migratória assimétrica (joelhos, tornozelos).', 'Dermatológico': 'Manchas eritematosas no tronco, não pruriginosas.', 'Neurológico': 'Mãe nota movimentos involuntários nas mãos (Coreia de Sydenham?).' } },
    physicalExam: { vitals: { pa: '100/60 mmHg', fc: '120 bpm', fr: '24 irpm', temp: '39.2°C', spo2: '97% aa' }, general: 'Regular estado geral, febril, prostrado, hidratado.', findings: { 'Cardiovascular': 'Taquicardia. Sopro sistólico regurgitativo em foco mitral, grau III/VI, com irradiação para axila. Atrito pericárdico sutil.', 'Articular': 'Artrite em joelho esquerdo (edema, calor, dor, limitação). Tornozelo direito com sinais flogísticos em resolução.', 'Pele': 'Eritema marginado no tronco (lesões anulares, eritematosas, não pruriginosas, evanescentes).', 'Neurológico': 'Movimentos coreiformes sutis em mãos (dificuldade de manter a língua protrusa).' } },
    labs: [
      { name: 'ASLO', value: '680 UI/mL', reference: '<200 UI/mL', abnormal: true },
      { name: 'PCR', value: '85 mg/L', reference: '<5 mg/L', abnormal: true },
      { name: 'VHS', value: '78 mm/h', reference: '<20 mm/h', abnormal: true },
      { name: 'Ecocardiograma', value: 'Regurgitação mitral moderada. Pericardite leve.', reference: 'Normal', abnormal: true },
      { name: 'ECG', value: 'Intervalo PR prolongado (220ms)', reference: '<200ms', abnormal: true },
    ],
    differentialDx: [
      { diagnosis: 'Febre Reumática (cardite + artrite + coreia + eritema marginado)', probability: 'Alta (95%)', keyFindings: '3 critérios maiores de Jones + evidência de infecção estreptocócica' },
      { diagnosis: 'Artrite reativa pós-infecciosa', probability: 'Baixa', keyFindings: 'Sem cardite ou coreia' },
      { diagnosis: 'Endocardite infecciosa', probability: 'Baixa', keyFindings: 'Sem vegetações ao eco' },
    ],
    management: ['Penicilina Benzatina 600.000 UI IM (erradicação)', 'AAS 80-100mg/kg/dia (artrite)', 'Prednisona 1-2mg/kg/dia (cardite moderada/grave)', 'Repouso relativo', 'Profilaxia secundária: Penicilina Benzatina 21/21 dias', 'Acompanhamento cardiológico seriado', 'Notificação compulsória'],
    teachingPoints: ['Critérios de Jones (2015): 2 maiores OU 1 maior + 2 menores + evidência estreptocócica', 'Critérios maiores: Cardite, Artrite, Coreia, Eritema marginado, Nódulos subcutâneos', 'Febre reumática não ataca o coração, ela lambe as articulações e morde o coração', 'Profilaxia secundária: até 21 anos ou 5 anos após último surto (o que for mais longo)'],
  },
];

type AnamnesisStep = 'selection' | 'greeting' | 'qp' | 'hda' | 'hpp' | 'medications' | 'allergies' | 'family' | 'social' | 'ros' | 'physical' | 'labs' | 'diagnosis' | 'management' | 'score';

export default function PacienteVirtual() {
  const [step, setStep] = useState<AnamnesisStep>('selection');
  const [selectedPatient, setSelectedPatient] = useState<VirtualPatient | null>(null);
  const [userQuestions, setUserQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [revealedSections, setRevealedSections] = useState<Set<string>>(new Set());
  const [score, setScore] = useState({ total: 0, max: 100, details: [] as { area: string; points: number; max: number; feedback: string }[] });
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [userDiagnosis, setUserDiagnosis] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step !== 'selection' && step !== 'score') {
      timerRef.current = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [step, revealedSections]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const selectPatient = (p: VirtualPatient) => {
    setSelectedPatient(p);
    setStep('greeting');
    setRevealedSections(new Set());
    setUserQuestions([]);
    setTimeElapsed(0);
    setShowDiagnosis(false);
    setUserDiagnosis('');
  };

  const revealSection = (section: string) => {
    setRevealedSections(prev => new Set([...prev, section]));
  };

  const calculateScore = () => {
    if (!selectedPatient) return;
    const details: typeof score.details = [];
    const sections = ['hda', 'hpp', 'medications', 'allergies', 'family', 'social', 'ros', 'physical', 'labs'];
    const sectionNames: Record<string, string> = { hda: 'HDA', hpp: 'HPP', medications: 'Medicações', allergies: 'Alergias', family: 'HF', social: 'HS', ros: 'ISDA', physical: 'Exame Físico', labs: 'Exames' };
    const sectionWeights: Record<string, number> = { hda: 20, hpp: 10, medications: 8, allergies: 5, family: 7, social: 8, ros: 12, physical: 15, labs: 10 };

    let total = 0;
    sections.forEach(s => {
      const max = sectionWeights[s] || 10;
      const explored = revealedSections.has(s);
      const points = explored ? max : 0;
      total += points;
      details.push({
        area: sectionNames[s] || s,
        points,
        max,
        feedback: explored ? 'Explorado adequadamente' : 'Não investigado — informação importante perdida',
      });
    });

    // Bonus for diagnosis
    const diagCorrect = userDiagnosis.toLowerCase().includes(selectedPatient.diagnosis.toLowerCase().split('(')[0].trim().toLowerCase().split(' ')[0]);
    const diagPoints = diagCorrect ? 5 : 0;
    total += diagPoints;
    details.push({ area: 'Diagnóstico', points: diagPoints, max: 5, feedback: diagCorrect ? 'Diagnóstico correto!' : `Diagnóstico esperado: ${selectedPatient.diagnosis}` });

    setScore({ total, max: 100, details });
    setStep('score');
    if (timerRef.current) clearInterval(timerRef.current);
  };

  if (step === 'selection') {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-3">
            <span className="text-3xl">🧑‍⚕️</span> Paciente Virtual Interativo
          </h1>
          <p className="text-sm text-muted-foreground mt-2">Pratique anamnese e raciocínio clínico com pacientes virtuais alimentados por IA</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PATIENTS.map(p => (
            <button key={p.id} onClick={() => selectPatient(p)} className="bg-card border border-border rounded-xl p-5 text-left hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{p.photo}</span>
                <div>
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">{p.age} anos, {p.sex === 'M' ? 'Masculino' : 'Feminino'} — {p.occupation}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.difficulty === 'Fácil' ? 'bg-emerald-500/20 text-emerald-400' : p.difficulty === 'Moderado' ? 'bg-yellow-500/20 text-yellow-400' : p.difficulty === 'Difícil' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}>
                  {p.difficulty}
                </span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-medium">{p.specialty}</span>
              </div>
              <p className="text-sm text-foreground font-medium">"{p.chiefComplaint}"</p>
            </button>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Este simulador é exclusivamente para fins educacionais. Os casos são fictícios e baseados em cenários clínicos típicos da prática médica brasileira.
          </p>
        </div>
      </div>
    );
  }

  if (!selectedPatient) return null;

  if (step === 'score') {
    const percentage = Math.round((score.total / score.max) * 100);
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Resultado da Consulta</h2>
          <p className="text-sm text-muted-foreground">Paciente: {selectedPatient.name} — {selectedPatient.chiefComplaint}</p>
        </div>

        {/* Score Circle */}
        <div className="flex justify-center">
          <div className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center ${percentage >= 80 ? 'border-emerald-500 bg-emerald-500/10' : percentage >= 60 ? 'border-yellow-500 bg-yellow-500/10' : 'border-red-500 bg-red-500/10'}`}>
            <span className="text-3xl font-bold text-foreground">{percentage}%</span>
            <span className="text-xs text-muted-foreground">{score.total}/{score.max} pts</span>
          </div>
        </div>

        <div className="text-center">
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${percentage >= 80 ? 'bg-emerald-500/20 text-emerald-400' : percentage >= 60 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
            {percentage >= 80 ? 'Excelente!' : percentage >= 60 ? 'Bom, mas pode melhorar' : 'Precisa praticar mais'}
          </span>
          <p className="text-xs text-muted-foreground mt-2">Tempo: {formatTime(timeElapsed)}</p>
        </div>

        {/* Detailed Scores */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-foreground">Detalhamento por Área</h3>
          {score.details.map((d, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-foreground">{d.area}</span>
                <span className={`text-sm font-bold ${d.points === d.max ? 'text-emerald-400' : d.points > 0 ? 'text-yellow-400' : 'text-red-400'}`}>{d.points}/{d.max}</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${d.points === d.max ? 'bg-emerald-500' : d.points > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${(d.points / d.max) * 100}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">{d.feedback}</p>
            </div>
          ))}
        </div>

        {/* Teaching Points */}
        <div className="bg-gradient-to-r from-cyan-500/5 to-teal-500/5 border border-cyan-500/20 rounded-xl p-5">
          <h3 className="text-sm font-bold text-foreground mb-3">Pontos de Ensino</h3>
          <ul className="space-y-2">
            {selectedPatient.teachingPoints.map((tp, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                <span className="text-cyan-400 mt-0.5">💡</span>
                <span>{tp}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={() => { setStep('selection'); setSelectedPatient(null); }} className="px-6 py-2.5 bg-card border border-border rounded-xl text-sm font-medium hover:bg-accent transition-colors">
            Escolher outro paciente
          </button>
          <button onClick={() => selectPatient(selectedPatient)} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
            Refazer este caso
          </button>
        </div>
      </div>
    );
  }

  // Consultation view
  const anamnesisSteps: { id: string; label: string; icon: string; key: string }[] = [
    { id: 'qp', label: 'Queixa Principal', icon: '💬', key: 'qp' },
    { id: 'hda', label: 'HDA', icon: '📋', key: 'hda' },
    { id: 'hpp', label: 'HPP', icon: '📁', key: 'hpp' },
    { id: 'medications', label: 'Medicações', icon: '💊', key: 'medications' },
    { id: 'allergies', label: 'Alergias', icon: '⚠️', key: 'allergies' },
    { id: 'family', label: 'Hist. Familiar', icon: '👨‍👩‍👧', key: 'family' },
    { id: 'social', label: 'Hist. Social', icon: '🏠', key: 'social' },
    { id: 'ros', label: 'ISDA', icon: '🔍', key: 'ros' },
    { id: 'physical', label: 'Exame Físico', icon: '🩺', key: 'physical' },
    { id: 'labs', label: 'Exames', icon: '🔬', key: 'labs' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => { setStep('selection'); setSelectedPatient(null); }} className="p-2 hover:bg-accent rounded-lg">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-3xl">{selectedPatient.photo}</span>
          <div>
            <h2 className="text-lg font-bold text-foreground">{selectedPatient.name}, {selectedPatient.age} anos</h2>
            <p className="text-xs text-muted-foreground">{selectedPatient.sex === 'M' ? 'Masculino' : 'Feminino'} — {selectedPatient.occupation}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-muted-foreground">{formatTime(timeElapsed)}</span>
          <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold">{revealedSections.size}/10 seções</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Etapas da Anamnese</h3>
          {anamnesisSteps.map(s => (
            <button
              key={s.id}
              onClick={() => revealSection(s.key)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${revealedSections.has(s.key) ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-card border border-border hover:bg-accent text-foreground'}`}
            >
              <span>{s.icon}</span>
              <span className="font-medium">{s.label}</span>
              {revealedSections.has(s.key) && <span className="ml-auto text-emerald-400 text-xs">✓</span>}
            </button>
          ))}

          <div className="border-t border-border pt-3 mt-3 space-y-2">
            <button onClick={() => setShowDiagnosis(true)} className="w-full px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-400 font-medium hover:bg-amber-500/20 transition-colors">
              🎯 Formular Diagnóstico
            </button>
            <button onClick={calculateScore} className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              📊 Finalizar e Ver Score
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Chief Complaint (always visible) */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase mb-2">💬 Queixa Principal</h3>
            <p className="text-sm text-foreground italic">"{selectedPatient.chiefComplaint}"</p>
          </div>

          {/* Revealed sections */}
          {revealedSections.has('hda') && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-xs font-bold text-cyan-400 uppercase mb-2">📋 História da Doença Atual</h3>
              <p className="text-sm text-foreground leading-relaxed">{selectedPatient.history.hda}</p>
            </div>
          )}

          {revealedSections.has('hpp') && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-xs font-bold text-cyan-400 uppercase mb-2">📁 História Patológica Pregressa</h3>
              <ul className="space-y-1">{selectedPatient.history.hpp.map((h, i) => <li key={i} className="text-sm text-foreground">• {h}</li>)}</ul>
            </div>
          )}

          {revealedSections.has('medications') && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-xs font-bold text-cyan-400 uppercase mb-2">💊 Medicações em Uso</h3>
              <ul className="space-y-1">{selectedPatient.history.medications.map((m, i) => <li key={i} className="text-sm text-foreground">• {m}</li>)}</ul>
            </div>
          )}

          {revealedSections.has('allergies') && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-xs font-bold text-cyan-400 uppercase mb-2">⚠️ Alergias</h3>
              <ul className="space-y-1">{selectedPatient.history.allergies.map((a, i) => <li key={i} className="text-sm text-foreground">• {a}</li>)}</ul>
            </div>
          )}

          {revealedSections.has('family') && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-xs font-bold text-cyan-400 uppercase mb-2">👨‍👩‍👧 História Familiar</h3>
              <ul className="space-y-1">{selectedPatient.history.familyHistory.map((f, i) => <li key={i} className="text-sm text-foreground">• {f}</li>)}</ul>
            </div>
          )}

          {revealedSections.has('social') && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-xs font-bold text-cyan-400 uppercase mb-2">🏠 História Social</h3>
              <p className="text-sm text-foreground">{selectedPatient.history.socialHistory}</p>
            </div>
          )}

          {revealedSections.has('ros') && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-xs font-bold text-cyan-400 uppercase mb-2">🔍 Interrogatório Sintomatológico (ISDA)</h3>
              <div className="space-y-3">
                {Object.entries(selectedPatient.history.reviewOfSystems).map(([system, findings]) => (
                  <div key={system}>
                    <h4 className="text-xs font-bold text-foreground">{system}</h4>
                    <p className="text-sm text-muted-foreground">{findings}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {revealedSections.has('physical') && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-xs font-bold text-emerald-400 uppercase mb-2">🩺 Exame Físico</h3>
              <div className="grid grid-cols-5 gap-2 mb-3 p-3 bg-muted/20 rounded-lg">
                {Object.entries(selectedPatient.physicalExam.vitals).map(([key, val]) => (
                  <div key={key} className="text-center">
                    <div className="text-[10px] text-muted-foreground uppercase">{key}</div>
                    <div className="text-xs font-bold text-foreground">{val}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-foreground mb-3"><strong>Geral:</strong> {selectedPatient.physicalExam.general}</p>
              <div className="space-y-2">
                {Object.entries(selectedPatient.physicalExam.findings).map(([area, finding]) => (
                  <div key={area}>
                    <h4 className="text-xs font-bold text-foreground">{area}</h4>
                    <p className="text-sm text-muted-foreground">{finding}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {revealedSections.has('labs') && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-xs font-bold text-purple-400 uppercase mb-2">🔬 Exames Complementares</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border"><th className="text-left py-1.5">Exame</th><th className="text-left py-1.5">Resultado</th><th className="text-left py-1.5">Referência</th></tr></thead>
                <tbody>
                  {selectedPatient.labs.map((lab, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-1.5 font-medium">{lab.name}</td>
                      <td className={`py-1.5 ${lab.abnormal ? 'text-red-400 font-bold' : 'text-foreground'}`}>{lab.value}</td>
                      <td className="py-1.5 text-muted-foreground">{lab.reference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Diagnosis Modal */}
          {showDiagnosis && (
            <div className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-xl p-5">
              <h3 className="text-sm font-bold text-amber-400 mb-3">🎯 Formule seu Diagnóstico</h3>
              <input
                type="text"
                value={userDiagnosis}
                onChange={e => setUserDiagnosis(e.target.value)}
                placeholder="Digite sua hipótese diagnóstica principal..."
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary mb-3"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowDiagnosis(false)} className="px-4 py-2 bg-card border border-border rounded-lg text-xs hover:bg-accent">Cancelar</button>
                <button onClick={calculateScore} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90">Confirmar e Ver Resultado</button>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>
    </div>
  );
}
