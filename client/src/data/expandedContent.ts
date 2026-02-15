/**
 * MedFocus — Conteúdo Expandido para 4°-6° Ano
 * Disciplinas adicionais: Psiquiatria, Ortopedia, Dermatologia, Infectologia
 * + Flashcards e Quizzes extras para Clínica Médica, Cirurgia, Pediatria, Ginecologia
 */

import { Flashcard, Quiz, SubjectBundle } from './preloadedContent';

// ─── EXTRA FLASHCARDS: CLÍNICA MÉDICA (ANO 4) ──────────────
export const extraFlashcardsClinica: Flashcard[] = [
  { front: 'Quais os critérios de Light para diferenciar transudato de exsudato pleural?', back: 'Exsudato se qualquer um: proteína pleural/sérica > 0,5 | LDH pleural/sérica > 0,6 | LDH pleural > 2/3 do limite superior sérico. Transudato: ICC, cirrose, síndrome nefrótica', difficulty: 'hard' },
  { front: 'Qual a classificação NYHA da insuficiência cardíaca?', back: 'I: sem limitação. II: limitação leve (dispneia aos esforços habituais). III: limitação moderada (dispneia aos pequenos esforços). IV: sintomas em repouso', difficulty: 'medium' },
  { front: 'Quais os critérios diagnósticos de Lupus (SLICC 2012)?', back: '≥ 4 de 11 critérios: rash malar, discoide, fotossensibilidade, úlceras orais, artrite, serosite, renal, neurológico, hematológico, imunológico, FAN+', difficulty: 'hard' },
  { front: 'Como diferenciar hipotireoidismo primário de central?', back: 'Primário: TSH alto + T4L baixo (tireoide falha). Central: TSH baixo/normal + T4L baixo (hipófise/hipotálamo falha). Hashimoto é a causa mais comum de primário', difficulty: 'medium' },
  { front: 'Quais os sinais de alarme na dispepsia?', back: 'Perda de peso, disfagia progressiva, vômitos persistentes, sangramento GI, anemia, massa abdominal, idade > 55 anos com sintomas novos → indicação de EDA', difficulty: 'easy' },
  { front: 'Qual o tratamento da crise hipertensiva com lesão de órgão-alvo?', back: 'Emergência hipertensiva: nitroprussiato de sódio IV ou nitroglicerina IV. Reduzir PA em 25% na 1ª hora. Urgência: captopril VO ou clonidina VO', difficulty: 'hard' },
  { front: 'Quais as causas de hipercalemia?', back: 'Insuficiência renal, acidose metabólica, uso de IECA/BRA/espironolactona, rabdomiólise, hemólise, insuficiência adrenal. ECG: onda T apiculada → alargamento QRS → FV', difficulty: 'medium' },
  { front: 'Qual a diferença entre síndrome nefrítica e nefrótica?', back: 'Nefrítica: hematúria + HAS + oligúria + edema leve (GNPE). Nefrótica: proteinúria > 3,5g/dia + hipoalbuminemia + edema + hiperlipidemia (lesão mínima em crianças)', difficulty: 'medium' },
];

export const extraQuizClinica: Quiz[] = [
  { question: 'Paciente com febre, sopro cardíaco novo e petéquias. Qual o diagnóstico mais provável?', options: ['Febre reumática', 'Endocardite infecciosa', 'Pericardite aguda', 'Miocardite viral'], correctIndex: 1, explanation: 'A tríade febre + sopro novo + fenômenos embólicos (petéquias, Janeway, Osler) sugere endocardite infecciosa. Critérios de Duke para diagnóstico.', source: 'Harrison 21ª ed., Cap. Endocardite' },
  { question: 'Qual o exame padrão-ouro para diagnóstico de embolia pulmonar?', options: ['D-dímero', 'Angiotomografia de tórax', 'Arteriografia pulmonar', 'Cintilografia V/Q'], correctIndex: 1, explanation: 'A angiotomografia (angio-TC) é o exame de escolha na prática clínica por alta sensibilidade e disponibilidade. D-dímero é para triagem (alto VPN).', source: 'ESC Guidelines on Pulmonary Embolism 2019' },
  { question: 'Paciente com icterícia, colúria e acolia fecal. Qual o padrão de icterícia?', options: ['Pré-hepática (hemolítica)', 'Hepática (hepatocelular)', 'Pós-hepática (obstrutiva)', 'Mista'], correctIndex: 2, explanation: 'Colúria + acolia fecal = padrão obstrutivo (colestático). A bilirrubina direta elevada é excretada na urina (colúria) mas não chega ao intestino (acolia).', source: 'Cecil Medicine, Cap. Icterícia' },
];

// ─── EXTRA FLASHCARDS: CIRURGIA (ANO 4-5) ──────────────────
export const extraFlashcardsCirurgia: Flashcard[] = [
  { front: 'Quais os critérios de Ranson para pancreatite aguda?', back: 'Admissão: idade > 55, leucócitos > 16.000, glicose > 200, LDH > 350, AST > 250. 48h: queda Ht > 10%, aumento ureia > 5, Ca < 8, PaO2 < 60, déficit base > 4, sequestro líquido > 6L. ≥ 3 = grave', difficulty: 'hard' },
  { front: 'Qual a classificação de Hinchey para diverticulite?', back: 'I: abscesso pericólico. II: abscesso pélvico/retroperitoneal. III: peritonite purulenta generalizada. IV: peritonite fecal. I-II: ATB ± drenagem. III-IV: cirurgia de urgência (Hartmann)', difficulty: 'hard' },
  { front: 'Quais as indicações absolutas de cirurgia na úlcera péptica?', back: 'Perfuração, hemorragia incontrolável, obstrução pilórica refratária, suspeita de malignidade. Úlcera gástrica: sempre biopsiar (risco de CA gástrico)', difficulty: 'medium' },
  { front: 'Qual a diferença entre volvo de sigmoide e de ceco?', back: 'Sigmoide: mais comum (80%), idosos, constipação crônica, RX "grão de café", tentativa de descompressão por colonoscopia. Ceco: menos comum, RX com distensão em FID, tratamento cirúrgico', difficulty: 'hard' },
  { front: 'Quais os critérios de Alvarado para apendicite?', back: 'Migração da dor (1), anorexia (1), náusea/vômito (1), dor em FID (2), Blumberg (1), febre > 37,3 (1), leucocitose (2), desvio à esquerda (1). Total 10. ≥ 7 = alta probabilidade', difficulty: 'medium' },
  { front: 'O que é a tríade de Beck no tamponamento cardíaco?', back: 'Hipotensão + turgência jugular + abafamento de bulhas cardíacas. Tratamento: pericardiocentese de urgência (punção subxifoidea)', difficulty: 'easy' },
  { front: 'Qual a classificação ASA de risco anestésico?', back: 'ASA I: saudável. ASA II: doença sistêmica leve. ASA III: doença sistêmica grave. ASA IV: doença grave com risco de vida. ASA V: moribundo. ASA VI: morte cerebral (doador)', difficulty: 'medium' },
];

export const extraQuizCirurgia: Quiz[] = [
  { question: 'Paciente com dor abdominal em cólica, distensão e vômitos fecaloides. RX com níveis hidroaéreos em escada. Diagnóstico?', options: ['Apendicite aguda', 'Obstrução intestinal', 'Pancreatite aguda', 'Colecistite aguda'], correctIndex: 1, explanation: 'Dor em cólica + distensão + vômitos + parada de eliminação + RX com níveis hidroaéreos = obstrução intestinal. Causa mais comum: bridas/aderências pós-operatórias.', source: 'Sabiston 21ª ed.' },
  { question: 'Qual a conduta inicial no pneumotórax hipertensivo?', options: ['TC de tórax', 'Drenagem torácica em selo d\'água', 'Punção de alívio no 2° EIC na linha hemiclavicular', 'Intubação orotraqueal'], correctIndex: 2, explanation: 'Pneumotórax hipertensivo é diagnóstico CLÍNICO. Punção de alívio imediata antes da drenagem definitiva.', source: 'ATLS 10th Edition' },
];

// ─── EXTRA FLASHCARDS: PEDIATRIA (ANO 5) ────────────────────
export const extraFlashcardsPediatria: Flashcard[] = [
  { front: 'Quais os sinais de desconforto respiratório no RN?', back: 'Taquipneia (FR > 60), tiragem intercostal/subcostal, batimento de asa nasal, gemido expiratório, cianose central. Boletim de Silverman-Andersen para quantificar', difficulty: 'medium' },
  { front: 'Qual a diferença entre bronquiolite e asma na criança?', back: 'Bronquiolite: < 2 anos, primeiro episódio de sibilância, VSR, tratamento de suporte. Asma: > 2 anos, episódios recorrentes, atopia, responde a broncodilatador', difficulty: 'medium' },
  { front: 'Quais os sinais de alerta no desenvolvimento infantil?', back: 'Não sustenta cabeça aos 4m, não senta aos 9m, não anda aos 18m, não fala palavras aos 18m, não forma frases aos 3 anos, perda de habilidades adquiridas em qualquer idade', difficulty: 'easy' },
  { front: 'Qual o tratamento da desidratação grave na criança?', back: 'Plano C: SF 0,9% 20 mL/kg em bolus (pode repetir até 3x). Reavaliar após cada bolus. Se choque: expansão rápida. Após estabilização: manutenção com SG 5% + SF 0,9%', difficulty: 'hard' },
  { front: 'Quais as indicações de fototerapia na icterícia neonatal?', back: 'Baseado em nomograma de Bhutani: bilirrubina total acima do percentil 95 para idade em horas. RN prematuro tem limiar mais baixo. Exsanguineotransfusão se falha da fototerapia', difficulty: 'hard' },
  { front: 'Qual o calendário de introdução alimentar?', back: '0-6m: AME. 6m: frutas, legumes, cereais (papa principal). 7-8m: 2 papas principais. 9-11m: alimentação da família adaptada. 12m: leite de vaca integral. Evitar mel < 1 ano (botulismo)', difficulty: 'medium' },
  { front: 'Como diagnosticar meningite bacteriana na criança?', back: 'Febre + rigidez de nuca + alteração do sensório. RN: sinais inespecíficos (irritabilidade, fontanela abaulada). Punção lombar: pleocitose neutrofílica, glicose baixa, proteína alta. Gram + cultura', difficulty: 'hard' },
];

export const extraQuizPediatria: Quiz[] = [
  { question: 'Criança de 3 anos com estridor inspiratório, tosse ladrante e rouquidão. Qual o diagnóstico?', options: ['Epiglotite', 'Laringotraqueíte (crupe)', 'Bronquiolite', 'Corpo estranho'], correctIndex: 1, explanation: 'Crupe viral: tosse ladrante + estridor + rouquidão, geralmente precedido por IVAS. Tratamento: dexametasona VO + nebulização com epinefrina se grave.', source: 'Nelson Pediatrics 21ª ed.' },
  { question: 'RN com 48h de vida, icterícia zona III de Kramer. Qual a conduta?', options: ['Observação clínica', 'Dosar bilirrubina e avaliar fototerapia', 'Exsanguineotransfusão imediata', 'Suspender aleitamento materno'], correctIndex: 1, explanation: 'Icterícia zona III nas primeiras 48h é precoce e pode indicar hemólise. Dosar BT e avaliar necessidade de fototerapia pelo nomograma.', source: 'SBP - Icterícia Neonatal 2021' },
  { question: 'Qual a principal causa de diarreia aguda em crianças < 5 anos?', options: ['E. coli', 'Rotavírus', 'Salmonella', 'Shigella'], correctIndex: 1, explanation: 'Rotavírus é a principal causa de diarreia aguda grave em < 5 anos. Vacina no calendário (2 e 4 meses). Tratamento: TRO + zinco por 10-14 dias.', source: 'OMS - Doenças Diarreicas 2023' },
];

// ─── EXTRA FLASHCARDS: GINECOLOGIA (ANO 5) ──────────────────
export const extraFlashcardsGineco: Flashcard[] = [
  { front: 'Quais as causas de sangramento uterino anormal?', back: 'PALM-COEIN: Pólipo, Adenomiose, Leiomioma, Malignidade, Coagulopatia, Ovulatória, Endometrial, Iatrogênica, Não classificada', difficulty: 'medium' },
  { front: 'Qual a conduta na pré-eclâmpsia grave?', back: 'Sulfato de magnésio (prevenção de eclâmpsia) + anti-hipertensivo (hidralazina IV ou nifedipino VO) + avaliar maturidade fetal. Se ≥ 34 semanas ou instabilidade materna: parto', difficulty: 'hard' },
  { front: 'Quais os métodos de rastreamento do câncer de mama?', back: 'Mamografia bienal dos 50-69 anos (MS) ou anual dos 40 anos (SBM/ACR). Autoexame: conscientização. USG mamária: complementar em mamas densas. RM: alto risco (BRCA+)', difficulty: 'medium' },
  { front: 'Qual a classificação de Bethesda para citologia cervical?', back: 'NILM (normal), ASC-US, ASC-H, LSIL (NIC I), HSIL (NIC II/III), AGC, carcinoma. ASC-US: repetir em 6m ou teste HPV. HSIL: colposcopia imediata', difficulty: 'hard' },
  { front: 'Quais os sinais de trabalho de parto verdadeiro?', back: 'Contrações regulares (≥ 2 em 10 min), progressivas em intensidade e frequência, dilatação cervical progressiva (≥ 4 cm = fase ativa), descida da apresentação', difficulty: 'easy' },
  { front: 'Qual a conduta no descolamento prematuro de placenta (DPP)?', back: 'Emergência obstétrica: sangramento vaginal escuro + dor abdominal + hipertonia uterina. Feto vivo + viável: cesárea de urgência. Feto morto: parto vaginal se possível. Tratar coagulopatia', difficulty: 'hard' },
];

export const extraQuizGineco: Quiz[] = [
  { question: 'Gestante de 32 semanas com PA 170/110, cefaleia e escotomas. Qual o diagnóstico e conduta imediata?', options: ['Eclâmpsia — parto imediato', 'Pré-eclâmpsia grave — sulfato de magnésio + anti-hipertensivo', 'HAS crônica — aumentar dose do anti-hipertensivo', 'HELLP — transfusão de plaquetas'], correctIndex: 1, explanation: 'PA ≥ 160/110 + sintomas = pré-eclâmpsia grave. Sulfato de magnésio para prevenção de eclâmpsia + hidralazina/nifedipino para controle pressórico.', source: 'ACOG Practice Bulletin - Hypertension in Pregnancy' },
  { question: 'Qual o método contraceptivo mais eficaz de longa duração?', options: ['Pílula combinada', 'DIU de cobre', 'Implante subdérmico', 'Injetável trimestral'], correctIndex: 2, explanation: 'Implante subdérmico (etonogestrel) tem a menor taxa de falha (0,05%). DIU de cobre e hormonal também são LARCs com alta eficácia (< 1%).', source: 'FEBRASGO - Contracepção 2023' },
];

// ─── NOVA DISCIPLINA: PSIQUIATRIA (ANO 5-6) ────────────────
const psiquiatria: SubjectBundle = {
  id: 'psiquiatria', name: 'Psiquiatria', year: 5,
  summary: 'A Psiquiatria é a especialidade médica dedicada ao diagnóstico, tratamento e prevenção dos transtornos mentais. Abrange desde transtornos de humor (depressão, bipolar) e ansiedade até psicoses (esquizofrenia), transtornos de personalidade, dependência química e emergências psiquiátricas. O diagnóstico é clínico, baseado em critérios do DSM-5/CID-11, e o tratamento combina psicofarmacologia com psicoterapia.',
  keyPoints: [
    'Depressão maior: ≥ 5 sintomas por ≥ 2 semanas (humor deprimido, anedonia, alteração sono/apetite/peso, fadiga, culpa, concentração, ideação suicida)',
    'Transtorno bipolar: tipo I (mania + depressão), tipo II (hipomania + depressão). Estabilizadores: lítio, valproato, lamotrigina',
    'Esquizofrenia: sintomas positivos (delírios, alucinações) + negativos (embotamento, alogia, avolição). Antipsicóticos típicos e atípicos',
    'TAG: ansiedade excessiva por ≥ 6 meses + ≥ 3 sintomas somáticos. Tratamento: ISRS + TCC',
    'Risco de suicídio: avaliar ideação, plano, meios, tentativas prévias, fatores de risco (depressão, abuso de substâncias, isolamento)',
    'Síndrome neuroléptica maligna: rigidez, febre, alteração do sensório, disautonomia — suspender antipsicótico + dantrolene',
  ],
  clinicalCorrelation: 'Paciente de 28 anos com humor deprimido há 3 semanas, insônia terminal, perda de 5 kg, anedonia e ideação suicida passiva. PHQ-9 = 22. Diagnóstico: episódio depressivo grave. Conduta: ISRS (sertralina 50 mg) + encaminhamento para psicoterapia + avaliação de risco suicida.',
  flashcards: [
    { front: 'Quais os critérios diagnósticos de episódio maníaco?', back: 'Humor elevado/irritável + ≥ 3 de: autoestima inflada, redução do sono, loquacidade, fuga de ideias, distraibilidade, agitação psicomotora, envolvimento em atividades de risco. Duração ≥ 1 semana ou internação', difficulty: 'hard' },
    { front: 'Quais os efeitos colaterais do lítio?', back: 'Tremor fino, poliúria/polidipsia (diabetes insipidus nefrogênico), hipotireoidismo, ganho de peso, acne. Nível terapêutico: 0,6-1,2 mEq/L. Intoxicação: tremor grosseiro, ataxia, confusão', difficulty: 'hard' },
    { front: 'Qual a diferença entre delírio e alucinação?', back: 'Delírio: crença falsa, fixa, irredutível à argumentação lógica. Alucinação: percepção sensorial sem estímulo externo (auditiva mais comum na esquizofrenia)', difficulty: 'easy' },
    { front: 'Quais os ISRS disponíveis e suas particularidades?', back: 'Fluoxetina (longa meia-vida), Sertralina (seguro na gestação), Paroxetina (mais sedativo), Citalopram/Escitalopram (menos interações), Fluvoxamina (TOC). Início de efeito: 2-4 semanas', difficulty: 'medium' },
    { front: 'Como manejar a agitação psicomotora na emergência?', back: 'Verbal: acolhimento, ambiente calmo. Farmacológico: haloperidol 5mg IM + prometazina 50mg IM. Alternativa: olanzapina 10mg IM. Contenção mecânica: último recurso', difficulty: 'medium' },
  ],
  quiz: [
    { question: 'Paciente com alucinações auditivas, delírio persecutório e embotamento afetivo há 8 meses. Diagnóstico?', options: ['Transtorno bipolar', 'Esquizofrenia', 'Transtorno esquizoafetivo', 'Transtorno delirante'], correctIndex: 1, explanation: 'Sintomas positivos + negativos por > 6 meses, com prejuízo funcional, preenchem critérios para esquizofrenia (DSM-5).', source: 'DSM-5, Critérios para Esquizofrenia' },
    { question: 'Qual o tratamento de primeira linha para TOC?', options: ['Benzodiazepínicos', 'ISRS em doses altas + TCC com exposição e prevenção de resposta', 'Antipsicóticos típicos', 'Estabilizadores de humor'], correctIndex: 1, explanation: 'ISRS em doses mais altas que para depressão + TCC com técnica de exposição e prevenção de resposta é o padrão-ouro para TOC.', source: 'APA Guidelines for OCD 2023' },
  ],
  references: [
    { title: 'Kaplan & Sadock Psiquiatria', author: 'Sadock et al.', type: 'Livro-texto' },
    { title: 'DSM-5-TR', author: 'American Psychiatric Association', type: 'Manual diagnóstico' },
    { title: 'Stahl Psicofarmacologia', author: 'Stephen Stahl', type: 'Livro-texto' },
  ],
  mnemonics: [
    'Depressão "SIG E CAPS": Sleep, Interest, Guilt, Energy, Concentration, Appetite, Psychomotor, Suicidality',
    'Mania "DIG FAST": Distractibility, Indiscretion, Grandiosity, Flight of ideas, Activity, Sleep deficit, Talkativeness',
  ],
};

// ─── NOVA DISCIPLINA: ORTOPEDIA E TRAUMATOLOGIA (ANO 4-5) ──
const ortopedia: SubjectBundle = {
  id: 'ortopedia', name: 'Ortopedia e Traumatologia', year: 4,
  summary: 'A Ortopedia e Traumatologia abrange o diagnóstico e tratamento de doenças e lesões do sistema musculoesquelético. Inclui fraturas, luxações, lesões ligamentares, doenças degenerativas (osteoartrose), doenças metabólicas ósseas (osteoporose), tumores ósseos, infecções (osteomielite) e deformidades congênitas.',
  keyPoints: [
    'Classificação de Gustilo-Anderson para fraturas expostas: I (< 1cm, limpa), II (1-10cm), IIIA/B/C (> 10cm, contaminada, lesão vascular)',
    'Fratura de quadril no idoso: colo femoral (Garden I-IV) vs transtrocantérica. Colo desviada: prótese. Transtrocantérica: fixação interna',
    'Síndrome compartimental: dor desproporcional, dor à extensão passiva, parestesias. Pressão > 30 mmHg → fasciotomia de urgência',
    'Osteoartrose: doença degenerativa articular mais comum. Joelho e quadril. RX: redução do espaço articular, osteófitos, esclerose subcondral',
    'Luxação de ombro: anterior (95%) — sinal da dragona, RX AP + axilar. Redução: Kocher ou Hipócrates',
    'Lesão do LCA: mecanismo de torção do joelho, teste de Lachman e gaveta anterior positivos. RM para confirmar',
    'Osteoporose: T-score ≤ -2,5 na densitometria. Tratamento: cálcio + vitamina D + bisfosfonatos',
  ],
  clinicalCorrelation: 'Paciente de 75 anos, queda da própria altura, dor no quadril direito, membro inferior encurtado e em rotação externa. RX: fratura do colo femoral Garden IV. Conduta: artroplastia parcial do quadril em até 48h.',
  flashcards: [
    { front: 'Quais os sinais de fratura de base de crânio?', back: 'Sinal do guaxinim (equimose periorbital bilateral), sinal de Battle (equimose retroauricular), otorreia/rinorreia (fístula liquórica), hemotímpano', difficulty: 'medium' },
    { front: 'Qual a classificação de Garden para fraturas do colo femoral?', back: 'I: incompleta/impactada. II: completa sem desvio. III: completa com desvio parcial. IV: completa com desvio total. I-II: fixação com parafusos. III-IV em idosos: prótese', difficulty: 'hard' },
    { front: 'Quais os 6 P\'s da síndrome compartimental?', back: 'Pain (dor desproporcional), Pressure (tensão), Paresthesia (parestesia), Paralysis (paralisia), Pallor (palidez), Pulselessness (ausência de pulso — sinal tardio)', difficulty: 'medium' },
    { front: 'Qual a conduta na fratura exposta?', back: 'ATB profilático (cefalosporina 1ª geração ± aminoglicosídeo se grave), profilaxia antitetânica, lavagem copiosa, desbridamento cirúrgico, fixação (externa se contaminada)', difficulty: 'hard' },
    { front: 'Quais as fraturas mais comuns na criança?', back: 'Fratura em galho verde (cortical incompleta), fratura em torus/buckle (compressão), fratura da placa de crescimento (Salter-Harris I-V). Remodelação óssea é maior em crianças', difficulty: 'medium' },
  ],
  quiz: [
    { question: 'Paciente com dor intensa na perna após fratura de tíbia, dor à extensão passiva dos dedos e parestesias. Diagnóstico?', options: ['Trombose venosa profunda', 'Síndrome compartimental', 'Lesão de nervo fibular', 'Osteomielite aguda'], correctIndex: 1, explanation: 'Dor desproporcional + dor à extensão passiva + parestesias após fratura = síndrome compartimental. Fasciotomia de urgência.', source: 'Campbell\'s Operative Orthopaedics' },
    { question: 'Qual o tratamento da luxação anterior do ombro?', options: ['Imobilização por 6 semanas', 'Redução fechada + imobilização', 'Cirurgia de Bankart imediata', 'Fisioterapia isolada'], correctIndex: 1, explanation: 'Redução fechada + imobilização com tipoia por 3-4 semanas. Cirurgia se recorrência.', source: 'Rockwood & Green\'s Fractures in Adults' },
  ],
  references: [
    { title: 'Campbell\'s Operative Orthopaedics', author: 'Azar et al.', type: 'Livro-texto' },
    { title: 'Rockwood & Green\'s Fractures', author: 'Bucholz et al.', type: 'Livro-texto' },
  ],
  mnemonics: [
    'Salter-Harris: "SALTR" — Straight across (I), Above (II), Lower (III), Through (IV), Rammed (V)',
    'Síndrome compartimental: "6 P\'s" — Pain, Pressure, Paresthesia, Paralysis, Pallor, Pulselessness',
  ],
};

// ─── NOVA DISCIPLINA: DERMATOLOGIA (ANO 4-5) ───────────────
const dermatologia: SubjectBundle = {
  id: 'dermatologia', name: 'Dermatologia', year: 4,
  summary: 'A Dermatologia estuda as doenças da pele, mucosas, cabelos e unhas. Na graduação médica, o foco está nas dermatoses mais prevalentes: dermatites, infecções cutâneas, psoríase, hanseníase, câncer de pele e manifestações cutâneas de doenças sistêmicas.',
  keyPoints: [
    'Lesões elementares: mácula, pápula, placa, nódulo, vesícula, bolha, pústula, úlcera, erosão, crosta, escama',
    'Dermatite atópica: prurido + xerose + distribuição típica por idade (face em lactentes, flexuras em crianças)',
    'Psoríase: placas eritematodescamativas, sinal da vela e do orvalho sanguinolento, couro cabeludo e extensoras',
    'Hanseníase: manchas hipocrômicas/eritematosas com alteração de sensibilidade + espessamento neural',
    'Melanoma: regra ABCDE — Assimetria, Bordas irregulares, Cores variadas, Diâmetro > 6mm, Evolução',
    'CBC: tumor de pele mais comum (70%), pérola translúcida com telangiectasias, raramente metastatiza',
  ],
  clinicalCorrelation: 'Paciente de 45 anos com lesão nodular perolada com telangiectasias na asa nasal, crescimento lento há 1 ano. Diagnóstico: carcinoma basocelular nodular. Conduta: biópsia excisional com margens de segurança.',
  flashcards: [
    { front: 'Qual a regra ABCDE do melanoma?', back: 'A: Assimetria. B: Bordas irregulares. C: Cores variadas. D: Diâmetro > 6mm. E: Evolução. Qualquer critério → biópsia excisional', difficulty: 'easy' },
    { front: 'Como classificar a hanseníase operacionalmente?', back: 'PB (paucibacilar): até 5 lesões, baciloscopia negativa. Tratamento: rifampicina + dapsona por 6 meses. MB (multibacilar): > 5 lesões. Tratamento: rifampicina + dapsona + clofazimina por 12 meses', difficulty: 'medium' },
    { front: 'Quais os tipos de micose superficial mais comuns?', back: 'Tinea corporis (corpo), tinea pedis (pé de atleta), tinea cruris (virilha), tinea capitis (couro cabeludo — crianças), onicomicose (unhas). Diagnóstico: KOH + cultura', difficulty: 'medium' },
    { front: 'Qual a diferença entre pênfigo e penfigoide bolhoso?', back: 'Pênfigo vulgar: bolhas flácidas, Nikolsky +, acantólise (intraepidérmica). Penfigoide: bolhas tensas, Nikolsky -, subepidérmica. Penfigoide é mais comum e menos grave', difficulty: 'hard' },
    { front: 'Quais as manifestações cutâneas do LES?', back: 'Rash malar (asa de borboleta), fotossensibilidade, lúpus discoide, alopecia, úlceras orais, fenômeno de Raynaud, livedo reticular, vasculite cutânea', difficulty: 'medium' },
  ],
  quiz: [
    { question: 'Paciente com mancha hipocrômica no dorso, sem sensibilidade ao toque e espessamento do nervo ulnar. Diagnóstico?', options: ['Vitiligo', 'Pitiríase versicolor', 'Hanseníase', 'Dermatite de contato'], correctIndex: 2, explanation: 'Mancha com alteração de sensibilidade + espessamento neural = hanseníase até que se prove o contrário.', source: 'MS - Guia de Hanseníase 2024' },
    { question: 'Qual o tipo de câncer de pele mais letal?', options: ['Carcinoma basocelular', 'Carcinoma espinocelular', 'Melanoma', 'Sarcoma de Kaposi'], correctIndex: 2, explanation: 'Melanoma representa apenas 3% dos cânceres de pele, mas é responsável pela maioria das mortes.', source: 'INCA - Câncer de Pele 2024' },
  ],
  references: [
    { title: 'Fitzpatrick\'s Dermatology', author: 'Kang et al.', type: 'Livro-texto' },
    { title: 'Azulay Dermatologia', author: 'Azulay & Azulay', type: 'Livro-texto' },
  ],
  mnemonics: [
    'Melanoma ABCDE: "Assimetria, Bordas, Cores, Diâmetro, Evolução"',
    'Hanseníase PQT-PB: "RD6" — Rifampicina + Dapsona por 6 meses',
  ],
};

// ─── NOVA DISCIPLINA: INFECTOLOGIA (ANO 5-6) ───────────────
const infectologia: SubjectBundle = {
  id: 'infectologia', name: 'Infectologia', year: 5,
  summary: 'A Infectologia estuda as doenças causadas por agentes infecciosos e seu tratamento com antimicrobianos. Abrange infecções comunitárias, infecções hospitalares, HIV/AIDS, tuberculose, hepatites virais, arboviroses, ISTs e uso racional de antibióticos.',
  keyPoints: [
    'HIV/AIDS: diagnóstico com teste rápido + Western Blot. CD4 < 200 = AIDS. TARV: TDF + 3TC + DTG',
    'Tuberculose: tosse ≥ 3 semanas, febre vespertina, sudorese noturna, emagrecimento. RIPE por 6 meses',
    'Dengue: febre + mialgia + cefaleia retroorbitária. Sinais de alarme: dor abdominal, vômitos, sangramento, letargia',
    'Meningite bacteriana: febre + rigidez de nuca + alteração do sensório. Ceftriaxona empírica',
    'ITU: disúria + polaciúria + urgência. Cistite: fosfomicina ou nitrofurantoína. Pielonefrite: ciprofloxacino ou ceftriaxona',
    'Hepatite B: HBsAg + anti-HBc IgM = aguda. HBsAg > 6 meses = crônica. Anti-HBs isolado = vacinação',
  ],
  clinicalCorrelation: 'Paciente de 35 anos, HIV+, CD4 = 150, com tosse há 4 semanas, febre vespertina e emagrecimento de 8 kg. RX: infiltrado em ápices pulmonares. BAAR: positivo. Diagnóstico: tuberculose pulmonar + HIV. Conduta: iniciar RIPE e TARV após 2 semanas.',
  flashcards: [
    { front: 'Qual o esquema RIPE para tuberculose?', back: 'Fase intensiva (2 meses): Rifampicina + Isoniazida + Pirazinamida + Etambutol. Fase de manutenção (4 meses): Rifampicina + Isoniazida. Total: 6 meses', difficulty: 'medium' },
    { front: 'Quais os sinais de alarme da dengue?', back: 'Dor abdominal intensa, vômitos persistentes, acúmulo de líquidos, sangramento de mucosas, letargia, hepatomegalia > 2cm, aumento progressivo do Ht', difficulty: 'medium' },
    { front: 'Como interpretar a sorologia de hepatite B?', back: 'HBsAg+/anti-HBc IgM+ = aguda. HBsAg+/anti-HBc IgG+ = crônica. Anti-HBs+/anti-HBc+ = cura. Anti-HBs+ isolado = vacinação', difficulty: 'hard' },
    { front: 'Qual o esquema preferencial de TARV no Brasil?', back: 'TDF (tenofovir) + 3TC (lamivudina) + DTG (dolutegravir). Iniciar para todos com HIV, independente de CD4', difficulty: 'medium' },
    { front: 'Quais as ISTs que causam úlcera genital?', back: 'Sífilis (cancro duro: úlcera única, indolor). Herpes genital (vesículas dolorosas, recorrente). Cancro mole (úlceras múltiplas, dolorosas). Linfogranuloma venéreo (úlcera + linfadenopatia)', difficulty: 'hard' },
  ],
  quiz: [
    { question: 'Paciente com febre há 5 dias, petéquias, prova do laço positiva e plaquetas 85.000. Diagnóstico?', options: ['Leptospirose', 'Dengue com sinais de alarme', 'Malária', 'Febre tifoide'], correctIndex: 1, explanation: 'Febre + manifestações hemorrágicas + plaquetopenia em área endêmica = dengue. Prova do laço positiva e plaquetas < 100.000 indicam sinais de alarme.', source: 'MS - Dengue 2024' },
    { question: 'Qual o tratamento da sífilis primária?', options: ['Azitromicina 1g VO dose única', 'Penicilina benzatina 2,4 milhões UI IM dose única', 'Doxiciclina 100mg VO 14 dias', 'Ceftriaxona 500mg IM dose única'], correctIndex: 1, explanation: 'Penicilina benzatina 2,4 milhões UI IM dose única é o tratamento padrão para sífilis primária e secundária.', source: 'PCDT IST - MS 2022' },
  ],
  references: [
    { title: 'Mandell\'s Infectious Diseases', author: 'Bennett et al.', type: 'Livro-texto' },
    { title: 'Veronesi Infectologia', author: 'Focaccia', type: 'Livro-texto' },
  ],
  mnemonics: [
    'TB RIPE: "Rifampicina, Isoniazida, Pirazinamida, Etambutol" — 2RIPE + 4RI',
    'Dengue alarme: "DAVS LHH" — Dor abdominal, Acúmulo líquidos, Vômitos, Sangramento, Letargia, Hepatomegalia, Hematócrito ↑',
  ],
};

// ─── NOVA DISCIPLINA: OFTALMOLOGIA (ANO 5-6) ─────────────────
const oftalmologia: SubjectBundle = {
  id: 'oftalmologia', name: 'Oftalmologia', year: 5,
  summary: 'A Oftalmologia estuda as doenças do olho e seus anexos. Na graduação, o foco está em emergências oculares, glaucoma, catarata, retinopatia diabética, olho vermelho e exame oftalmológico básico.',
  keyPoints: [
    'Glaucoma agudo: dor ocular intensa + olho vermelho + midríase média fixa + náusea/vômito. Emergência!',
    'Catarata: opacificação do cristalino, causa mais comum de cegueira reversível no mundo',
    'Retinopatia diabética: microaneurismas → exsudatos → neovascularização. Rastreio anual com fundo de olho',
    'Olho vermelho: conjuntivite (difuso), uveíte (injeção ciliar), glaucoma agudo (misto), hemorragia subconjuntival',
    'Descolamento de retina: flashes luminosos + moscas volantes + cortina visual. Emergência cirúrgica',
    'Reflexo vermelho: teste do olhinho obrigatório no RN. Ausente → retinoblastoma, catarata congênita',
  ],
  clinicalCorrelation: 'Paciente de 65 anos, diabético há 20 anos, com perda visual progressiva bilateral. Fundo de olho: microaneurismas, exsudatos duros e neovascularização. Diagnóstico: retinopatia diabética proliferativa. Conduta: fotocoagulação a laser + controle glicêmico rigoroso.',
  flashcards: [
    { front: 'Qual a diferença entre glaucoma de ângulo aberto e fechado?', back: 'Ângulo aberto: crônico, assintomático, perda de campo visual periférico progressiva, PIO elevada. Ângulo fechado: agudo, dor intensa, olho vermelho, midríase média fixa, náusea. Tratamento agudo: pilocarpina + timolol + acetazolamida', difficulty: 'hard' },
    { front: 'Quais as causas de olho vermelho que são emergência?', back: 'Glaucoma agudo (dor + midríase), uveíte anterior (dor + miose + fotofobia), ceratite (dor + defeito epitelial), endoftalmite (pós-cirúrgica), corpo estranho perfurante', difficulty: 'medium' },
    { front: 'Como classificar a retinopatia diabética?', back: 'Não proliferativa: leve (microaneurismas), moderada (exsudatos), grave (hemorragias em 4 quadrantes OU veias em rosário OU IRMA). Proliferativa: neovascularização → fotocoagulação', difficulty: 'hard' },
    { front: 'Qual o exame para rastreio de glaucoma?', back: 'Tonometria (PIO > 21 mmHg), gonioscopia (ângulo), campimetria (campo visual), fundoscopia (escavação do disco óptico > 0,6). Rastreio: > 40 anos, história familiar, negros, míopes', difficulty: 'medium' },
    { front: 'O que é a ambliopia e como tratar?', back: 'Olho preguiçoso: redução da acuidade visual sem causa orgânica, por privação visual na infância. Causas: estrabismo, anisometropia, catarata congênita. Tratamento: oclusão do olho bom (tampão) antes dos 7 anos', difficulty: 'medium' },
  ],
  quiz: [
    { question: 'Paciente de 60 anos com dor ocular intensa, náusea, olho vermelho e pupila em midríase média fixa. Diagnóstico?', options: ['Conjuntivite bacteriana', 'Uveíte anterior', 'Glaucoma agudo de ângulo fechado', 'Ceratite herpética'], correctIndex: 2, explanation: 'Dor intensa + olho vermelho + midríase média fixa + náusea = glaucoma agudo. Emergência oftalmológica!', source: 'Kanski Clinical Ophthalmology' },
    { question: 'Qual a principal causa de cegueira irreversível no mundo?', options: ['Catarata', 'Glaucoma', 'Degeneração macular', 'Retinopatia diabética'], correctIndex: 1, explanation: 'Glaucoma é a principal causa de cegueira irreversível. Catarata é a principal causa de cegueira reversível.', source: 'OMS - World Report on Vision 2019' },
  ],
  references: [
    { title: 'Kanski Clinical Ophthalmology', author: 'Bowling', type: 'Livro-texto' },
    { title: 'Oftalmologia Básica', author: 'Vaughan & Asbury', type: 'Livro-texto' },
  ],
  mnemonics: [
    'Olho vermelho emergência: "GUCE" — Glaucoma agudo, Uveíte, Ceratite, Endoftalmite',
    'Retinopatia diabética: "MEG-N" — Microaneurismas, Exsudatos, hemorraGias, Neovascularização',
  ],
};

// ─── NOVA DISCIPLINA: UROLOGIA (ANO 5-6) ──────────────────────
const urologia: SubjectBundle = {
  id: 'urologia', name: 'Urologia', year: 5,
  summary: 'A Urologia estuda as doenças do trato urinário e do sistema reprodutor masculino. Na graduação, o foco está em litíase renal, hiperplasia prostática benigna, câncer de próstata, infecções urinárias, trauma renal e emergências urológicas.',
  keyPoints: [
    'Litíase renal: cólica lombar + hematúria. 80% cálcio. TC sem contraste é padrão-ouro. < 5mm: expulsão espontânea',
    'HPB: sintomas obstrutivos (jato fraco, hesitação) + irritativos (noctúria, urgência). PSA + toque retal',
    'Câncer de próstata: rastreio controverso. PSA > 4 + toque retal alterado → biópsia. Gleason para estadiamento',
    'Torção testicular: emergência! Dor escrotal aguda + reflexo cremastérico ausente. Exploração cirúrgica em < 6h',
    'Fimose: fisiológica até 3-4 anos. Patológica: balanopostite de repetição → circuncisão',
    'Trauma renal: classificação AAST I-V. Graus I-III: conservador. IV-V: cirúrgico se instabilidade',
  ],
  clinicalCorrelation: 'Paciente masculino de 35 anos com dor lombar direita súbita, intensa, irradiando para região inguinal, com hematúria microscópica. TC sem contraste: cálculo de 4mm em ureter distal. Conduta: analgesia (AINE + opioide), hidratação, tamsulosina para facilitar expulsão.',
  flashcards: [
    { front: 'Qual a conduta na litíase renal conforme o tamanho?', back: '< 5mm: expulsão espontânea (90%), analgesia + tamsulosina. 5-10mm: LECO ou ureteroscopia. 10-20mm: ureteroscopia ou nefrolitotripsia percutânea. > 20mm: percutânea. Coraliforme: percutânea', difficulty: 'hard' },
    { front: 'Quais os sinais de torção testicular?', back: 'Dor escrotal aguda intensa, náusea/vômito, testículo elevado e horizontalizado, reflexo cremastérico ausente, sinal de Prehn negativo. USG Doppler: ausência de fluxo. Cirurgia em < 6h!', difficulty: 'medium' },
    { front: 'Como interpretar o PSA?', back: 'PSA total > 4 ng/mL: suspeita. PSA livre/total < 25%: maior risco de câncer. Velocidade PSA > 0,75/ano: suspeita. Densidade PSA > 0,15: suspeita. PSA pode elevar em: HPB, prostatite, biópsia, ejaculação recente', difficulty: 'hard' },
    { front: 'Qual a classificação de Gleason no câncer de próstata?', back: 'Soma dos 2 padrões histológicos mais prevalentes (1-5 cada). Gleason 6 (3+3): baixo risco. 7 (3+4 ou 4+3): intermediário. 8-10: alto risco. Hoje usa-se ISUP: Grau 1 (Gleason 6) a Grau 5 (Gleason 9-10)', difficulty: 'hard' },
    { front: 'Quais as indicações de cirurgia na HPB?', back: 'Retenção urinária refratária, ITU de repetição, hematúria recorrente, litíase vesical, insuficiência renal por obstrução, divertículo vesical grande. Cirurgia: RTU-P (padrão) ou prostatectomia aberta se > 80g', difficulty: 'medium' },
  ],
  quiz: [
    { question: 'Adolescente de 14 anos com dor escrotal aguda há 3 horas, testículo elevado e reflexo cremastérico ausente. Conduta?', options: ['USG Doppler e aguardar resultado', 'Antibioticoterapia para epididimite', 'Exploração cirúrgica imediata', 'Analgesia e observação'], correctIndex: 2, explanation: 'Torção testicular é emergência cirúrgica. Não atrasar com exames. Exploração em < 6h para salvar o testículo.', source: 'Campbell-Walsh Urology' },
    { question: 'Qual o exame padrão-ouro para diagnóstico de litíase renal?', options: ['Ultrassonografia', 'Radiografia simples de abdome', 'TC de abdome sem contraste', 'Urografia excretora'], correctIndex: 2, explanation: 'TC sem contraste tem sensibilidade > 95% para cálculos renais, incluindo os radiotransparentes (ácido úrico).', source: 'AUA Guidelines on Urolithiasis 2023' },
  ],
  references: [
    { title: 'Campbell-Walsh-Wein Urology', author: 'Partin et al.', type: 'Livro-texto' },
    { title: 'Smith\'s General Urology', author: 'Tanagho & McAninch', type: 'Livro-texto' },
  ],
  mnemonics: [
    'Litíase: "CHOP" — Cálcio (80%), Hidratação, Oxalato, Purina (ácido úrico)',
    'Torção testicular: "6 horas" — tempo máximo para salvar o testículo',
  ],
};

// ─── EXPORTAÇÃO ─────────────────────────────────────────────
export const EXPANDED_SUBJECTS: SubjectBundle[] = [
  psiquiatria, ortopedia, dermatologia, infectologia, oftalmologia, urologia,
];

export { psiquiatria, ortopedia, dermatologia, infectologia, oftalmologia, urologia };
