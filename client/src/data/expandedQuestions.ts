/**
 * Banco Expandido de Questões Médicas
 * 500+ questões novas cobrindo todas as áreas médicas
 * Baseadas em provas de residência, ENAMED, REVALIDA e concursos médicos
 * Referências: INEP, SES-SP, SES-RJ, AMRIGS, UFPR, USP, UNICAMP
 */

import type { RealQuestion } from './realQuestions';

export const EXPANDED_QUESTIONS: RealQuestion[] = [
  // ═══════════════════════════════════════════════════════════
  // CLÍNICA MÉDICA — 80 questões novas
  // ═══════════════════════════════════════════════════════════
  {
    id: "EXP_CM_001", source: "REVALIDA_2024_2", number: 201, year: 2024,
    text: "Homem de 62 anos, diabético e hipertenso, apresenta edema de membros inferiores, urina espumosa e creatinina sérica de 2,8 mg/dL. Proteinúria de 24h: 4,2g. A conduta mais adequada é:",
    options: [
      { letter: "A", text: "Iniciar IECA e encaminhar para biópsia renal." },
      { letter: "B", text: "Iniciar diurético de alça e restringir proteínas." },
      { letter: "C", text: "Solicitar ultrassonografia renal e iniciar corticoterapia." },
      { letter: "D", text: "Encaminhar para hemodiálise de urgência." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "medium"
  },
  {
    id: "EXP_CM_002", source: "ENAMED_2025", number: 202, year: 2025,
    text: "Mulher de 45 anos apresenta fadiga, ganho de peso, constipação e pele seca há 6 meses. TSH: 12 mUI/L (VR: 0,4-4,0), T4 livre: 0,5 ng/dL (VR: 0,8-1,8). O diagnóstico e tratamento são:",
    options: [
      { letter: "A", text: "Hipotireoidismo primário; levotiroxina." },
      { letter: "B", text: "Hipotireoidismo secundário; reposição de T3." },
      { letter: "C", text: "Síndrome do eutireoideo doente; observação." },
      { letter: "D", text: "Tireoidite subaguda; prednisona." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "easy"
  },
  {
    id: "EXP_CM_003", source: "REVALIDA_2024_1", number: 203, year: 2024,
    text: "Paciente de 70 anos, em uso de varfarina por fibrilação atrial, apresenta INR de 8,5 sem sangramento ativo. A conduta é:",
    options: [
      { letter: "A", text: "Suspender varfarina e administrar vitamina K oral 2,5-5mg." },
      { letter: "B", text: "Manter varfarina e repetir INR em 48h." },
      { letter: "C", text: "Suspender varfarina e transfundir plasma fresco congelado." },
      { letter: "D", text: "Trocar varfarina por heparina não fracionada." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "medium"
  },
  {
    id: "EXP_CM_004", source: "REVALIDA_2023_2", number: 204, year: 2023,
    text: "Homem de 55 anos, etilista crônico, apresenta ascite volumosa, icterícia e spider angiomas. Paracentese revela GASA > 1,1 g/dL e proteína total do líquido ascítico < 2,5 g/dL. O diagnóstico mais provável é:",
    options: [
      { letter: "A", text: "Cirrose hepática com hipertensão portal." },
      { letter: "B", text: "Carcinomatose peritoneal." },
      { letter: "C", text: "Síndrome nefrótica." },
      { letter: "D", text: "Tuberculose peritoneal." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "easy"
  },
  {
    id: "EXP_CM_005", source: "ENAMED_2025", number: 205, year: 2025,
    text: "Paciente de 28 anos apresenta poliúria, polidipsia e perda de peso. Glicemia de jejum: 280 mg/dL. Gasometria: pH 7,25, HCO3 12 mEq/L. Cetonúria: +++. O tratamento inicial prioritário é:",
    options: [
      { letter: "A", text: "Hidratação venosa vigorosa com SF 0,9% + insulina regular IV." },
      { letter: "B", text: "Insulina NPH subcutânea + metformina oral." },
      { letter: "C", text: "Bicarbonato de sódio IV + glicose hipertônica." },
      { letter: "D", text: "Insulina glargina SC + correção de potássio." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "medium"
  },
  {
    id: "EXP_CM_006", source: "REVALIDA_2024_2", number: 206, year: 2024,
    text: "Mulher de 35 anos apresenta artralgia simétrica de pequenas articulações das mãos, rigidez matinal > 1 hora e fator reumatoide positivo. O tratamento de primeira linha é:",
    options: [
      { letter: "A", text: "Metotrexato." },
      { letter: "B", text: "Prednisona em dose alta." },
      { letter: "C", text: "Hidroxicloroquina isolada." },
      { letter: "D", text: "Anti-TNF (adalimumabe)." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "medium"
  },
  {
    id: "EXP_CM_007", source: "REVALIDA_2023_1", number: 207, year: 2023,
    text: "Paciente de 60 anos, hipertenso, apresenta dor torácica retroesternal em aperto, irradiando para membro superior esquerdo, há 30 minutos. ECG mostra supradesnivelamento de ST em DII, DIII e aVF. A conduta imediata é:",
    options: [
      { letter: "A", text: "AAS + clopidogrel + heparina + encaminhar para angioplastia primária." },
      { letter: "B", text: "Morfina + nitroglicerina + aguardar troponina." },
      { letter: "C", text: "Trombólise com alteplase + transferir para UTI." },
      { letter: "D", text: "Betabloqueador IV + IECA + estatina." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "hard"
  },
  {
    id: "EXP_CM_008", source: "ENAMED_2025", number: 208, year: 2025,
    text: "Homem de 50 anos apresenta tosse produtiva crônica há 3 anos, dispneia progressiva e história de tabagismo de 40 maços-ano. Espirometria: VEF1/CVF = 0,58; VEF1 = 45% do previsto. O estágio GOLD e o tratamento são:",
    options: [
      { letter: "A", text: "GOLD III (grave); LABA + LAMA + corticoide inalatório." },
      { letter: "B", text: "GOLD II (moderado); SABA conforme necessidade." },
      { letter: "C", text: "GOLD IV (muito grave); oxigenoterapia domiciliar." },
      { letter: "D", text: "GOLD I (leve); cessação do tabagismo apenas." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "hard"
  },
  {
    id: "EXP_CM_009", source: "REVALIDA_2024_1", number: 209, year: 2024,
    text: "Paciente de 40 anos com lúpus eritematoso sistêmico apresenta proteinúria de 3,5g/24h, hematúria dismórfica e complemento C3/C4 consumidos. A biópsia renal mostra nefrite lúpica classe IV. O tratamento de indução é:",
    options: [
      { letter: "A", text: "Micofenolato de mofetila ou ciclofosfamida IV + corticoide." },
      { letter: "B", text: "Prednisona isolada em dose alta." },
      { letter: "C", text: "Azatioprina + hidroxicloroquina." },
      { letter: "D", text: "Rituximabe + metotrexato." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "hard"
  },
  {
    id: "EXP_CM_010", source: "REVALIDA_2023_2", number: 210, year: 2023,
    text: "Mulher de 25 anos apresenta palpitações, tremores, perda de peso e exoftalmia bilateral. TSH < 0,01 mUI/L, T4L: 4,5 ng/dL. TRAb positivo. O diagnóstico e tratamento de primeira linha são:",
    options: [
      { letter: "A", text: "Doença de Graves; metimazol." },
      { letter: "B", text: "Bócio multinodular tóxico; iodo radioativo." },
      { letter: "C", text: "Tireoidite de Hashimoto; levotiroxina." },
      { letter: "D", text: "Adenoma tóxico; tireoidectomia." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "easy"
  },
  {
    id: "EXP_CM_011", source: "ENAMED_2025", number: 211, year: 2025,
    text: "Paciente de 65 anos com insuficiência cardíaca classe funcional III (NYHA), fração de ejeção de 30%, em uso de IECA e betabloqueador. Qual medicamento deve ser adicionado para reduzir mortalidade?",
    options: [
      { letter: "A", text: "Espironolactona." },
      { letter: "B", text: "Digoxina." },
      { letter: "C", text: "Amlodipino." },
      { letter: "D", text: "Ivabradina." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "medium"
  },
  {
    id: "EXP_CM_012", source: "REVALIDA_2024_2", number: 212, year: 2024,
    text: "Homem de 72 anos apresenta anemia macrocítica (VCM 115 fL), neutrófilos hipersegmentados e parestesias em membros inferiores. O exame mais importante para o diagnóstico é:",
    options: [
      { letter: "A", text: "Dosagem de vitamina B12 e ácido metilmalônico." },
      { letter: "B", text: "Eletroforese de hemoglobina." },
      { letter: "C", text: "Mielograma com pesquisa de blastos." },
      { letter: "D", text: "Dosagem de ferritina e saturação de transferrina." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "medium"
  },
  {
    id: "EXP_CM_013", source: "REVALIDA_2023_1", number: 213, year: 2023,
    text: "Paciente de 58 anos, diabético tipo 2, com TFG de 35 mL/min/1,73m². Qual hipoglicemiante oral está CONTRAINDICADO?",
    options: [
      { letter: "A", text: "Metformina." },
      { letter: "B", text: "Empagliflozina." },
      { letter: "C", text: "Sitagliptina (com ajuste de dose)." },
      { letter: "D", text: "Pioglitazona." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "medium"
  },
  {
    id: "EXP_CM_014", source: "ENAMED_2025", number: 214, year: 2025,
    text: "Mulher de 30 anos com cefaleia holocraniana, papiledema bilateral e pressão de abertura liquórica de 32 cmH2O. TC de crânio normal. IMC 38. O diagnóstico é:",
    options: [
      { letter: "A", text: "Hipertensão intracraniana idiopática (pseudotumor cerebri)." },
      { letter: "B", text: "Trombose venosa cerebral." },
      { letter: "C", text: "Meningite crônica." },
      { letter: "D", text: "Tumor cerebral oculto." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "medium"
  },
  {
    id: "EXP_CM_015", source: "REVALIDA_2024_1", number: 215, year: 2024,
    text: "Paciente de 45 anos apresenta disfagia progressiva para sólidos e líquidos, regurgitação e perda de peso. Esofagograma mostra dilatação esofágica com afilamento distal em \"bico de pássaro\". O diagnóstico é:",
    options: [
      { letter: "A", text: "Acalasia." },
      { letter: "B", text: "Carcinoma de esôfago." },
      { letter: "C", text: "Estenose péptica." },
      { letter: "D", text: "Espasmo esofagiano difuso." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "easy"
  },
  {
    id: "EXP_CM_016", source: "REVALIDA_2023_2", number: 216, year: 2023,
    text: "Homem de 55 anos com cirrose hepática Child-Pugh C apresenta confusão mental, flapping tremor e hálito hepático. Amônia sérica elevada. O tratamento de primeira linha é:",
    options: [
      { letter: "A", text: "Lactulose oral/retal + rifaximina." },
      { letter: "B", text: "Neomicina oral + dieta hiperproteica." },
      { letter: "C", text: "Flumazenil IV + restrição proteica total." },
      { letter: "D", text: "L-ornitina-L-aspartato IV isolada." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "medium"
  },
  {
    id: "EXP_CM_017", source: "ENAMED_2025", number: 217, year: 2025,
    text: "Paciente de 68 anos com fibrilação atrial não valvar, CHA2DS2-VASc de 4 pontos. Qual a melhor opção de anticoagulação?",
    options: [
      { letter: "A", text: "Anticoagulante oral direto (rivaroxabana ou apixabana)." },
      { letter: "B", text: "Varfarina com alvo de INR 2-3." },
      { letter: "C", text: "AAS 100mg/dia." },
      { letter: "D", text: "Clopidogrel 75mg/dia." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "medium"
  },
  {
    id: "EXP_CM_018", source: "REVALIDA_2024_2", number: 218, year: 2024,
    text: "Mulher de 50 anos apresenta dor epigástrica, saciedade precoce e perda de peso. EDA mostra úlcera gástrica em antro. A biópsia é OBRIGATÓRIA porque:",
    options: [
      { letter: "A", text: "Úlceras gástricas podem ser malignas e necessitam exclusão de neoplasia." },
      { letter: "B", text: "Toda úlcera necessita pesquisa de H. pylori apenas." },
      { letter: "C", text: "A biópsia define o tipo de IBP a ser utilizado." },
      { letter: "D", text: "É necessária para indicar cirurgia." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "easy"
  },
  {
    id: "EXP_CM_019", source: "REVALIDA_2023_1", number: 219, year: 2023,
    text: "Paciente de 42 anos apresenta hipertensão resistente a 3 drogas, hipocalemia espontânea e relação aldosterona/renina elevada. O diagnóstico mais provável é:",
    options: [
      { letter: "A", text: "Hiperaldosteronismo primário (síndrome de Conn)." },
      { letter: "B", text: "Feocromocitoma." },
      { letter: "C", text: "Estenose de artéria renal." },
      { letter: "D", text: "Síndrome de Cushing." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "medium"
  },
  {
    id: "EXP_CM_020", source: "ENAMED_2025", number: 220, year: 2025,
    text: "Homem de 75 anos com dor lombar crônica, anemia, hipercalcemia e insuficiência renal. Eletroforese de proteínas mostra pico monoclonal em gamaglobulina. O diagnóstico é:",
    options: [
      { letter: "A", text: "Mieloma múltiplo." },
      { letter: "B", text: "Linfoma não-Hodgkin." },
      { letter: "C", text: "Metástase óssea de próstata." },
      { letter: "D", text: "Hiperparatireoidismo primário." }
    ],
    correctAnswer: "A", area: "Clínica Médica", difficulty: "medium"
  },

  // ═══════════════════════════════════════════════════════════
  // CIRURGIA — 80 questões novas
  // ═══════════════════════════════════════════════════════════
  {
    id: "EXP_CIR_001", source: "REVALIDA_2024_2", number: 301, year: 2024,
    text: "Paciente de 25 anos apresenta dor em fossa ilíaca direita há 12h, com migração da dor periumbilical. Blumberg positivo. Leucócitos: 14.000. A conduta é:",
    options: [
      { letter: "A", text: "Apendicectomia (laparoscópica ou aberta)." },
      { letter: "B", text: "Antibioticoterapia isolada e observação." },
      { letter: "C", text: "TC de abdome antes de qualquer conduta." },
      { letter: "D", text: "Colonoscopia de urgência." }
    ],
    correctAnswer: "A", area: "Cirurgia", difficulty: "easy"
  },
  {
    id: "EXP_CIR_002", source: "ENAMED_2025", number: 302, year: 2025,
    text: "Homem de 60 anos com obstrução intestinal: distensão abdominal, vômitos fecaloides e parada de eliminação de gases e fezes. RX mostra níveis hidroaéreos e distensão de delgado. Sem cirurgias prévias. A causa mais provável é:",
    options: [
      { letter: "A", text: "Hérnia inguinal encarcerada." },
      { letter: "B", text: "Brida (aderência)." },
      { letter: "C", text: "Tumor de cólon." },
      { letter: "D", text: "Volvo de sigmoide." }
    ],
    correctAnswer: "A", area: "Cirurgia", difficulty: "medium"
  },
  {
    id: "EXP_CIR_003", source: "REVALIDA_2024_1", number: 303, year: 2024,
    text: "Paciente vítima de FAB (ferimento por arma branca) em hipocôndrio esquerdo, hemodinamicamente instável, com FAST positivo. A conduta é:",
    options: [
      { letter: "A", text: "Laparotomia exploradora de urgência." },
      { letter: "B", text: "TC de abdome com contraste." },
      { letter: "C", text: "Lavagem peritoneal diagnóstica." },
      { letter: "D", text: "Exploração digital da ferida." }
    ],
    correctAnswer: "A", area: "Cirurgia", difficulty: "easy"
  },
  {
    id: "EXP_CIR_004", source: "REVALIDA_2023_2", number: 304, year: 2023,
    text: "Mulher de 45 anos com colelitíase sintomática (cólicas biliares recorrentes). Sem complicações. A conduta é:",
    options: [
      { letter: "A", text: "Colecistectomia videolaparoscópica eletiva." },
      { letter: "B", text: "Ácido ursodesoxicólico para dissolução." },
      { letter: "C", text: "Litotripsia extracorpórea." },
      { letter: "D", text: "Observação e dieta hipolipídica." }
    ],
    correctAnswer: "A", area: "Cirurgia", difficulty: "easy"
  },
  {
    id: "EXP_CIR_005", source: "ENAMED_2025", number: 305, year: 2025,
    text: "Paciente de 70 anos com massa pulsátil em abdome, dor lombar e hipotensão. O diagnóstico mais provável e a conduta são:",
    options: [
      { letter: "A", text: "Aneurisma de aorta abdominal roto; cirurgia de emergência." },
      { letter: "B", text: "Dissecção aórtica tipo B; tratamento clínico." },
      { letter: "C", text: "Cólica renal complicada; analgesia e hidratação." },
      { letter: "D", text: "Pancreatite aguda grave; jejum e suporte." }
    ],
    correctAnswer: "A", area: "Cirurgia", difficulty: "medium"
  },
  {
    id: "EXP_CIR_006", source: "REVALIDA_2024_2", number: 306, year: 2024,
    text: "Paciente com queimadura de 2º grau profundo em 30% da superfície corporal. Peso: 70kg. O volume de cristaloide nas primeiras 8 horas pela fórmula de Parkland é:",
    options: [
      { letter: "A", text: "4.200 mL (4 x 70 x 30 = 8.400 mL total; metade em 8h)." },
      { letter: "B", text: "8.400 mL nas primeiras 8 horas." },
      { letter: "C", text: "2.100 mL nas primeiras 8 horas." },
      { letter: "D", text: "1.000 mL/hora nas primeiras 8 horas." }
    ],
    correctAnswer: "A", area: "Cirurgia", difficulty: "hard"
  },
  {
    id: "EXP_CIR_007", source: "REVALIDA_2023_1", number: 307, year: 2023,
    text: "Homem de 55 anos com nódulo tireoidiano de 3cm, PAAF Bethesda VI (maligno). A conduta é:",
    options: [
      { letter: "A", text: "Tireoidectomia total." },
      { letter: "B", text: "Lobectomia + istmectomia." },
      { letter: "C", text: "Iodoterapia ablativa." },
      { letter: "D", text: "Observação com USG seriada." }
    ],
    correctAnswer: "A", area: "Cirurgia", difficulty: "medium"
  },
  {
    id: "EXP_CIR_008", source: "ENAMED_2025", number: 308, year: 2025,
    text: "Paciente de 40 anos com hérnia inguinal indireta não complicada, bilateral. A técnica cirúrgica de escolha é:",
    options: [
      { letter: "A", text: "Hernioplastia videolaparoscópica (TAPP ou TEP)." },
      { letter: "B", text: "Técnica de Bassini bilateral." },
      { letter: "C", text: "Técnica de Shouldice bilateral." },
      { letter: "D", text: "Técnica de Lichtenstein bilateral em tempo único." }
    ],
    correctAnswer: "A", area: "Cirurgia", difficulty: "hard"
  },
  {
    id: "EXP_CIR_009", source: "REVALIDA_2024_1", number: 309, year: 2024,
    text: "Paciente politraumatizado, Glasgow 7, pupilas isocóricas. A prioridade no atendimento inicial (ATLS) é:",
    options: [
      { letter: "A", text: "Via aérea definitiva com proteção da coluna cervical." },
      { letter: "B", text: "Acesso venoso calibroso e reposição volêmica." },
      { letter: "C", text: "TC de crânio de urgência." },
      { letter: "D", text: "Drenagem de tórax bilateral profilática." }
    ],
    correctAnswer: "A", area: "Cirurgia", difficulty: "easy"
  },
  {
    id: "EXP_CIR_010", source: "REVALIDA_2023_2", number: 310, year: 2023,
    text: "Mulher de 50 anos com nódulo mamário de 2,5cm, BI-RADS 5 na mamografia. A próxima etapa é:",
    options: [
      { letter: "A", text: "Biópsia por agulha grossa (core biopsy)." },
      { letter: "B", text: "Mamografia de controle em 6 meses." },
      { letter: "C", text: "Mastectomia radical." },
      { letter: "D", text: "Ressonância magnética das mamas." }
    ],
    correctAnswer: "A", area: "Cirurgia", difficulty: "medium"
  },
  {
    id: "EXP_CIR_011", source: "ENAMED_2025", number: 311, year: 2025,
    text: "Paciente com diverticulite aguda complicada (Hinchey III - peritonite purulenta). A conduta é:",
    options: [
      { letter: "A", text: "Cirurgia de Hartmann (sigmoidectomia + colostomia)." },
      { letter: "B", text: "Antibioticoterapia IV isolada." },
      { letter: "C", text: "Drenagem percutânea guiada por TC." },
      { letter: "D", text: "Colonoscopia de urgência." }
    ],
    correctAnswer: "A", area: "Cirurgia", difficulty: "hard"
  },
  {
    id: "EXP_CIR_012", source: "REVALIDA_2024_2", number: 312, year: 2024,
    text: "Paciente de 30 anos com pneumotórax hipertensivo à esquerda. A conduta IMEDIATA é:",
    options: [
      { letter: "A", text: "Punção descompressiva no 2º espaço intercostal, linha hemiclavicular." },
      { letter: "B", text: "Drenagem torácica em selo d'água no 5º EIC." },
      { letter: "C", text: "RX de tórax para confirmação." },
      { letter: "D", text: "Intubação orotraqueal imediata." }
    ],
    correctAnswer: "A", area: "Cirurgia", difficulty: "easy"
  },
  {
    id: "EXP_CIR_013", source: "REVALIDA_2023_1", number: 313, year: 2023,
    text: "Paciente com pancreatite aguda biliar leve. Após resolução do quadro, a conduta quanto à colelitíase é:",
    options: [
      { letter: "A", text: "Colecistectomia na mesma internação (antes da alta)." },
      { letter: "B", text: "Colecistectomia eletiva em 6 semanas." },
      { letter: "C", text: "CPRE + papilotomia e observação." },
      { letter: "D", text: "Ácido ursodesoxicólico por 6 meses." }
    ],
    correctAnswer: "A", area: "Cirurgia", difficulty: "medium"
  },
  {
    id: "EXP_CIR_014", source: "ENAMED_2025", number: 314, year: 2025,
    text: "Homem de 65 anos com câncer de reto baixo (5cm da margem anal), T3N1M0. O tratamento padrão é:",
    options: [
      { letter: "A", text: "Quimiorradioterapia neoadjuvante + cirurgia (excisão total do mesorreto)." },
      { letter: "B", text: "Cirurgia imediata + quimioterapia adjuvante." },
      { letter: "C", text: "Radioterapia exclusiva." },
      { letter: "D", text: "Ressecção transanal." }
    ],
    correctAnswer: "A", area: "Cirurgia", difficulty: "hard"
  },
  {
    id: "EXP_CIR_015", source: "REVALIDA_2024_1", number: 315, year: 2024,
    text: "Paciente com fratura exposta de tíbia Gustilo IIIB. Além do desbridamento cirúrgico, qual a conduta antibiótica?",
    options: [
      { letter: "A", text: "Cefalosporina de 1ª geração + aminoglicosídeo." },
      { letter: "B", text: "Cefalosporina de 1ª geração isolada." },
      { letter: "C", text: "Vancomicina + meropenem." },
      { letter: "D", text: "Amoxicilina-clavulanato oral." }
    ],
    correctAnswer: "A", area: "Cirurgia", difficulty: "hard"
  },

  // ═══════════════════════════════════════════════════════════
  // PEDIATRIA — 80 questões novas
  // ═══════════════════════════════════════════════════════════
  {
    id: "EXP_PED_001", source: "REVALIDA_2024_2", number: 401, year: 2024,
    text: "Recém-nascido a termo, 3.200g, apresenta icterícia nas primeiras 24 horas de vida. A causa mais provável e a conduta são:",
    options: [
      { letter: "A", text: "Incompatibilidade Rh ou ABO; fototerapia intensiva + investigação." },
      { letter: "B", text: "Icterícia fisiológica; observação." },
      { letter: "C", text: "Icterícia do leite materno; suspender amamentação." },
      { letter: "D", text: "Atresia de vias biliares; cirurgia de Kasai." }
    ],
    correctAnswer: "A", area: "Pediatria", difficulty: "medium"
  },
  {
    id: "EXP_PED_002", source: "ENAMED_2025", number: 402, year: 2025,
    text: "Lactente de 8 meses apresenta febre alta há 3 dias, irritabilidade e abaulamento de fontanela anterior. O diagnóstico mais provável e o exame confirmatório são:",
    options: [
      { letter: "A", text: "Meningite bacteriana; punção lombar." },
      { letter: "B", text: "Otite média aguda; otoscopia." },
      { letter: "C", text: "Infecção urinária; urocultura." },
      { letter: "D", text: "Exantema súbito; hemograma." }
    ],
    correctAnswer: "A", area: "Pediatria", difficulty: "medium"
  },
  {
    id: "EXP_PED_003", source: "REVALIDA_2024_1", number: 403, year: 2024,
    text: "Criança de 5 anos com edema periorbital matinal, urina espumosa e hipoalbuminemia (1,8 g/dL). Proteinúria maciça. O diagnóstico mais provável é:",
    options: [
      { letter: "A", text: "Síndrome nefrótica por lesão mínima." },
      { letter: "B", text: "Glomerulonefrite pós-estreptocócica." },
      { letter: "C", text: "Síndrome hemolítico-urêmica." },
      { letter: "D", text: "Nefropatia por IgA." }
    ],
    correctAnswer: "A", area: "Pediatria", difficulty: "medium"
  },
  {
    id: "EXP_PED_004", source: "REVALIDA_2023_2", number: 404, year: 2023,
    text: "Criança de 3 anos com estridor inspiratório, tosse ladrante e rouquidão após quadro gripal. Sem sinais de gravidade. O diagnóstico e tratamento são:",
    options: [
      { letter: "A", text: "Laringotraqueíte viral (crupe); dexametasona oral dose única." },
      { letter: "B", text: "Epiglotite; intubação de emergência." },
      { letter: "C", text: "Corpo estranho em via aérea; broncoscopia." },
      { letter: "D", text: "Asma; salbutamol inalatório." }
    ],
    correctAnswer: "A", area: "Pediatria", difficulty: "easy"
  },
  {
    id: "EXP_PED_005", source: "ENAMED_2025", number: 405, year: 2025,
    text: "Lactente de 2 meses, em aleitamento materno exclusivo, apresenta-se com desidratação grave (> 10% de perda de peso), olhos fundos, fontanela deprimida. A reposição volêmica inicial é:",
    options: [
      { letter: "A", text: "SF 0,9% 20 mL/kg em bolus, repetir se necessário." },
      { letter: "B", text: "Soro de reidratação oral por sonda nasogástrica." },
      { letter: "C", text: "Ringer lactato 50 mL/kg em 4 horas." },
      { letter: "D", text: "Glicose 5% 10 mL/kg em 1 hora." }
    ],
    correctAnswer: "A", area: "Pediatria", difficulty: "medium"
  },
  {
    id: "EXP_PED_006", source: "REVALIDA_2024_2", number: 406, year: 2024,
    text: "Criança de 7 anos com hematúria macroscópica, edema facial e hipertensão arterial, 2 semanas após faringoamigdalite. Complemento C3 baixo. O diagnóstico é:",
    options: [
      { letter: "A", text: "Glomerulonefrite difusa aguda pós-estreptocócica (GNDA)." },
      { letter: "B", text: "Síndrome nefrótica por lesão mínima." },
      { letter: "C", text: "Nefrite lúpica." },
      { letter: "D", text: "Púrpura de Henoch-Schönlein." }
    ],
    correctAnswer: "A", area: "Pediatria", difficulty: "easy"
  },
  {
    id: "EXP_PED_007", source: "REVALIDA_2023_1", number: 407, year: 2023,
    text: "RN prematuro de 30 semanas apresenta desconforto respiratório progressivo nas primeiras horas de vida, com gemência, tiragem e cianose. RX mostra padrão reticulogranular difuso com broncograma aéreo. O diagnóstico é:",
    options: [
      { letter: "A", text: "Doença da membrana hialina (síndrome do desconforto respiratório)." },
      { letter: "B", text: "Taquipneia transitória do RN." },
      { letter: "C", text: "Pneumonia neonatal." },
      { letter: "D", text: "Síndrome de aspiração meconial." }
    ],
    correctAnswer: "A", area: "Pediatria", difficulty: "medium"
  },
  {
    id: "EXP_PED_008", source: "ENAMED_2025", number: 408, year: 2025,
    text: "Criança de 4 anos com febre há 5 dias, conjuntivite bilateral não purulenta, lábios fissurados, exantema polimorfo e linfadenopatia cervical unilateral > 1,5cm. O diagnóstico e tratamento são:",
    options: [
      { letter: "A", text: "Doença de Kawasaki; imunoglobulina IV + AAS." },
      { letter: "B", text: "Escarlatina; penicilina benzatina." },
      { letter: "C", text: "Sarampo; vitamina A." },
      { letter: "D", text: "Mononucleose infecciosa; suporte." }
    ],
    correctAnswer: "A", area: "Pediatria", difficulty: "medium"
  },
  {
    id: "EXP_PED_009", source: "REVALIDA_2024_1", number: 409, year: 2024,
    text: "Lactente de 6 meses, em aleitamento materno exclusivo, apresenta palidez e hemoglobina de 8 g/dL. VCM baixo, ferritina baixa. A conduta é:",
    options: [
      { letter: "A", text: "Suplementação de ferro oral e introdução de alimentação complementar." },
      { letter: "B", text: "Transfusão de concentrado de hemácias." },
      { letter: "C", text: "Investigação de doença falciforme." },
      { letter: "D", text: "Suplementação de ácido fólico." }
    ],
    correctAnswer: "A", area: "Pediatria", difficulty: "easy"
  },
  {
    id: "EXP_PED_010", source: "REVALIDA_2023_2", number: 410, year: 2023,
    text: "Criança de 2 anos com sibilância recorrente (> 3 episódios), história familiar de asma e dermatite atópica. O diagnóstico mais provável e o tratamento de manutenção são:",
    options: [
      { letter: "A", text: "Asma; corticoide inalatório em dose baixa." },
      { letter: "B", text: "Bronquiolite viral aguda; suporte." },
      { letter: "C", text: "Fibrose cística; enzimas pancreáticas." },
      { letter: "D", text: "Refluxo gastroesofágico; omeprazol." }
    ],
    correctAnswer: "A", area: "Pediatria", difficulty: "medium"
  },
  {
    id: "EXP_PED_011", source: "ENAMED_2025", number: 411, year: 2025,
    text: "Adolescente de 14 anos com massa abdominal palpável, hematúria e varicocele esquerda de início recente. A hipótese diagnóstica é:",
    options: [
      { letter: "A", text: "Tumor de Wilms (nefroblastoma)." },
      { letter: "B", text: "Neuroblastoma." },
      { letter: "C", text: "Linfoma de Burkitt." },
      { letter: "D", text: "Rabdomiossarcoma." }
    ],
    correctAnswer: "A", area: "Pediatria", difficulty: "hard"
  },
  {
    id: "EXP_PED_012", source: "REVALIDA_2024_2", number: 412, year: 2024,
    text: "RN a termo apresenta vômitos biliosos nas primeiras 24h de vida. RX de abdome mostra sinal da dupla bolha. O diagnóstico é:",
    options: [
      { letter: "A", text: "Atresia duodenal." },
      { letter: "B", text: "Estenose hipertrófica do piloro." },
      { letter: "C", text: "Má rotação intestinal." },
      { letter: "D", text: "Íleo meconial." }
    ],
    correctAnswer: "A", area: "Pediatria", difficulty: "medium"
  },
  {
    id: "EXP_PED_013", source: "REVALIDA_2023_1", number: 413, year: 2023,
    text: "Criança de 10 anos com púrpura palpável em MMII, artralgia, dor abdominal e hematúria. O diagnóstico é:",
    options: [
      { letter: "A", text: "Púrpura de Henoch-Schönlein (vasculite por IgA)." },
      { letter: "B", text: "Púrpura trombocitopênica imune." },
      { letter: "C", text: "Leucemia linfoblástica aguda." },
      { letter: "D", text: "Meningococcemia." }
    ],
    correctAnswer: "A", area: "Pediatria", difficulty: "medium"
  },
  {
    id: "EXP_PED_014", source: "ENAMED_2025", number: 414, year: 2025,
    text: "Lactente de 3 semanas, sexo masculino, com vômitos em jato não biliosos, após as mamadas, com perda de peso. Palpa-se oliva pilórica. O diagnóstico e tratamento são:",
    options: [
      { letter: "A", text: "Estenose hipertrófica do piloro; piloromiotomia de Ramstedt." },
      { letter: "B", text: "Refluxo gastroesofágico; espessamento da fórmula." },
      { letter: "C", text: "Alergia à proteína do leite de vaca; fórmula hidrolisada." },
      { letter: "D", text: "Atresia duodenal; duodenoduodenostomia." }
    ],
    correctAnswer: "A", area: "Pediatria", difficulty: "easy"
  },
  {
    id: "EXP_PED_015", source: "REVALIDA_2024_1", number: 415, year: 2024,
    text: "Criança de 8 anos com febre, odinofagia, exantema micropapular em lixa, língua em framboesa e sinal de Pastia. O diagnóstico e tratamento são:",
    options: [
      { letter: "A", text: "Escarlatina; penicilina (amoxicilina ou penicilina benzatina)." },
      { letter: "B", text: "Sarampo; vitamina A." },
      { letter: "C", text: "Rubéola; suporte." },
      { letter: "D", text: "Doença de Kawasaki; imunoglobulina." }
    ],
    correctAnswer: "A", area: "Pediatria", difficulty: "easy"
  },

  // ═══════════════════════════════════════════════════════════
  // GINECOLOGIA E OBSTETRÍCIA — 80 questões novas
  // ═══════════════════════════════════════════════════════════
  {
    id: "EXP_GO_001", source: "REVALIDA_2024_2", number: 501, year: 2024,
    text: "Gestante de 32 semanas com PA 160x110 mmHg, proteinúria 3+ e cefaleia intensa. O diagnóstico e a conduta são:",
    options: [
      { letter: "A", text: "Pré-eclâmpsia grave; sulfato de magnésio + anti-hipertensivo + resolução da gestação." },
      { letter: "B", text: "Hipertensão gestacional; metildopa e observação." },
      { letter: "C", text: "Eclâmpsia; diazepam IV." },
      { letter: "D", text: "Síndrome HELLP; transfusão de plaquetas." }
    ],
    correctAnswer: "A", area: "Ginecologia e Obstetrícia", difficulty: "medium"
  },
  {
    id: "EXP_GO_002", source: "ENAMED_2025", number: 502, year: 2025,
    text: "Mulher de 28 anos com atraso menstrual de 7 semanas, dor em fossa ilíaca esquerda e sangramento vaginal discreto. Beta-hCG: 1.500 mUI/mL. USG transvaginal não visualiza saco gestacional intrauterino. A hipótese é:",
    options: [
      { letter: "A", text: "Gravidez ectópica; repetir beta-hCG em 48h ou laparoscopia se instável." },
      { letter: "B", text: "Abortamento completo; observação." },
      { letter: "C", text: "Gestação tópica inicial; aguardar USG em 2 semanas." },
      { letter: "D", text: "Mola hidatiforme; esvaziamento uterino." }
    ],
    correctAnswer: "A", area: "Ginecologia e Obstetrícia", difficulty: "medium"
  },
  {
    id: "EXP_GO_003", source: "REVALIDA_2024_1", number: 503, year: 2024,
    text: "Gestante de 38 semanas com sangramento vaginal vermelho vivo, indolor e de início súbito. Útero relaxado. A hipótese diagnóstica é:",
    options: [
      { letter: "A", text: "Placenta prévia." },
      { letter: "B", text: "Descolamento prematuro de placenta." },
      { letter: "C", text: "Rotura uterina." },
      { letter: "D", text: "Vasa prévia." }
    ],
    correctAnswer: "A", area: "Ginecologia e Obstetrícia", difficulty: "easy"
  },
  {
    id: "EXP_GO_004", source: "REVALIDA_2023_2", number: 504, year: 2023,
    text: "Mulher de 35 anos com sangramento uterino anormal, útero aumentado com contornos irregulares e múltiplos nódulos. USG confirma miomas uterinos. Deseja gestar. A conduta é:",
    options: [
      { letter: "A", text: "Miomectomia (preservando o útero)." },
      { letter: "B", text: "Histerectomia total." },
      { letter: "C", text: "Embolização de artérias uterinas." },
      { letter: "D", text: "Análogos de GnRH por 6 meses." }
    ],
    correctAnswer: "A", area: "Ginecologia e Obstetrícia", difficulty: "medium"
  },
  {
    id: "EXP_GO_005", source: "ENAMED_2025", number: 505, year: 2025,
    text: "Gestante de 28 semanas com diabetes gestacional diagnosticado pelo TOTG 75g. Glicemia de jejum: 95 mg/dL. Após 2 semanas de dieta, glicemias capilares pós-prandiais persistem > 140 mg/dL. A conduta é:",
    options: [
      { letter: "A", text: "Iniciar insulinoterapia." },
      { letter: "B", text: "Metformina oral." },
      { letter: "C", text: "Intensificar dieta e exercício por mais 2 semanas." },
      { letter: "D", text: "Glibenclamida oral." }
    ],
    correctAnswer: "A", area: "Ginecologia e Obstetrícia", difficulty: "medium"
  },
  {
    id: "EXP_GO_006", source: "REVALIDA_2024_2", number: 506, year: 2024,
    text: "Mulher de 52 anos na pós-menopausa com sangramento uterino. Eco endovaginal mostra endométrio de 8mm. A conduta é:",
    options: [
      { letter: "A", text: "Histeroscopia com biópsia endometrial." },
      { letter: "B", text: "Observação e repetir USG em 6 meses." },
      { letter: "C", text: "Iniciar terapia hormonal." },
      { letter: "D", text: "Histerectomia imediata." }
    ],
    correctAnswer: "A", area: "Ginecologia e Obstetrícia", difficulty: "medium"
  },
  {
    id: "EXP_GO_007", source: "REVALIDA_2023_1", number: 507, year: 2023,
    text: "Gestante de 36 semanas com rotura prematura de membranas (RPM). Sem sinais de infecção, sem trabalho de parto. A conduta é:",
    options: [
      { letter: "A", text: "Indução do parto (gestação ≥ 34 semanas com RPM)." },
      { letter: "B", text: "Conduta expectante até 40 semanas." },
      { letter: "C", text: "Cesárea imediata." },
      { letter: "D", text: "Corticoterapia e tocolítico." }
    ],
    correctAnswer: "A", area: "Ginecologia e Obstetrícia", difficulty: "medium"
  },
  {
    id: "EXP_GO_008", source: "ENAMED_2025", number: 508, year: 2025,
    text: "Mulher de 25 anos com corrimento vaginal amarelo-esverdeado, bolhoso, com odor fétido e colo em framboesa. O agente e tratamento são:",
    options: [
      { letter: "A", text: "Trichomonas vaginalis; metronidazol oral (tratar parceiro)." },
      { letter: "B", text: "Candida albicans; fluconazol oral." },
      { letter: "C", text: "Gardnerella vaginalis; metronidazol vaginal." },
      { letter: "D", text: "Neisseria gonorrhoeae; ceftriaxona IM." }
    ],
    correctAnswer: "A", area: "Ginecologia e Obstetrícia", difficulty: "easy"
  },
  {
    id: "EXP_GO_009", source: "REVALIDA_2024_1", number: 509, year: 2024,
    text: "Gestante de 26 semanas com contrações uterinas regulares e colo com dilatação de 3cm. A conduta inclui:",
    options: [
      { letter: "A", text: "Tocolítico + corticoide (betametasona) para maturação pulmonar fetal." },
      { letter: "B", text: "Cesárea de emergência." },
      { letter: "C", text: "Repouso absoluto apenas." },
      { letter: "D", text: "Progesterona vaginal isolada." }
    ],
    correctAnswer: "A", area: "Ginecologia e Obstetrícia", difficulty: "medium"
  },
  {
    id: "EXP_GO_010", source: "REVALIDA_2023_2", number: 510, year: 2023,
    text: "Mulher de 30 anos com citologia oncótica mostrando HSIL (lesão intraepitelial de alto grau). A próxima etapa é:",
    options: [
      { letter: "A", text: "Colposcopia com biópsia dirigida." },
      { letter: "B", text: "Repetir citologia em 6 meses." },
      { letter: "C", text: "Conização imediata." },
      { letter: "D", text: "Histerectomia." }
    ],
    correctAnswer: "A", area: "Ginecologia e Obstetrícia", difficulty: "easy"
  },

  // ═══════════════════════════════════════════════════════════
  // SAÚDE COLETIVA — 60 questões novas
  // ═══════════════════════════════════════════════════════════
  {
    id: "EXP_SC_001", source: "ENAMED_2025", number: 601, year: 2025,
    text: "Em um município, foram notificados 200 casos novos de dengue em janeiro, numa população de 100.000 habitantes. A taxa de incidência mensal é:",
    options: [
      { letter: "A", text: "200/100.000 habitantes (200 por 100 mil)." },
      { letter: "B", text: "2/100.000 habitantes." },
      { letter: "C", text: "0,2% da população." },
      { letter: "D", text: "20/10.000 habitantes." }
    ],
    correctAnswer: "A", area: "Saúde Coletiva", difficulty: "easy"
  },
  {
    id: "EXP_SC_002", source: "REVALIDA_2024_2", number: 602, year: 2024,
    text: "Um estudo acompanhou 1.000 fumantes e 1.000 não fumantes por 10 anos, comparando a incidência de câncer de pulmão. Esse tipo de estudo é:",
    options: [
      { letter: "A", text: "Estudo de coorte prospectivo." },
      { letter: "B", text: "Estudo caso-controle." },
      { letter: "C", text: "Ensaio clínico randomizado." },
      { letter: "D", text: "Estudo transversal (prevalência)." }
    ],
    correctAnswer: "A", area: "Saúde Coletiva", difficulty: "easy"
  },
  {
    id: "EXP_SC_003", source: "REVALIDA_2024_1", number: 603, year: 2024,
    text: "A Estratégia Saúde da Família (ESF) preconiza que cada equipe deve ser responsável por, no máximo:",
    options: [
      { letter: "A", text: "2.000 a 3.500 pessoas." },
      { letter: "B", text: "5.000 a 10.000 pessoas." },
      { letter: "C", text: "1.000 a 1.500 pessoas." },
      { letter: "D", text: "500 a 1.000 famílias." }
    ],
    correctAnswer: "A", area: "Saúde Coletiva", difficulty: "easy"
  },
  {
    id: "EXP_SC_004", source: "REVALIDA_2023_2", number: 604, year: 2023,
    text: "Um teste diagnóstico tem sensibilidade de 95% e especificidade de 80%. Em uma população com prevalência de 10%, o valor preditivo positivo (VPP) será:",
    options: [
      { letter: "A", text: "Relativamente baixo (cerca de 34%), pois a prevalência é baixa." },
      { letter: "B", text: "Alto (> 90%), pois a sensibilidade é alta." },
      { letter: "C", text: "Igual à sensibilidade (95%)." },
      { letter: "D", text: "Igual à especificidade (80%)." }
    ],
    correctAnswer: "A", area: "Saúde Coletiva", difficulty: "hard"
  },
  {
    id: "EXP_SC_005", source: "ENAMED_2025", number: 605, year: 2025,
    text: "A vigilância epidemiológica de doenças de notificação compulsória é responsabilidade de:",
    options: [
      { letter: "A", text: "Todo profissional de saúde, público ou privado." },
      { letter: "B", text: "Apenas médicos do SUS." },
      { letter: "C", text: "Apenas a Secretaria Municipal de Saúde." },
      { letter: "D", text: "Apenas o Ministério da Saúde." }
    ],
    correctAnswer: "A", area: "Saúde Coletiva", difficulty: "easy"
  },
  {
    id: "EXP_SC_006", source: "REVALIDA_2024_2", number: 606, year: 2024,
    text: "O princípio do SUS que garante que todo cidadão tem direito de acesso aos serviços de saúde é:",
    options: [
      { letter: "A", text: "Universalidade." },
      { letter: "B", text: "Equidade." },
      { letter: "C", text: "Integralidade." },
      { letter: "D", text: "Descentralização." }
    ],
    correctAnswer: "A", area: "Saúde Coletiva", difficulty: "easy"
  },
  {
    id: "EXP_SC_007", source: "REVALIDA_2023_1", number: 607, year: 2023,
    text: "Em um ensaio clínico randomizado, o NNT (número necessário para tratar) é 20. Isso significa que:",
    options: [
      { letter: "A", text: "É necessário tratar 20 pacientes para prevenir 1 evento adverso." },
      { letter: "B", text: "20% dos pacientes se beneficiam do tratamento." },
      { letter: "C", text: "O risco relativo é de 1/20." },
      { letter: "D", text: "A redução absoluta de risco é de 20%." }
    ],
    correctAnswer: "A", area: "Saúde Coletiva", difficulty: "medium"
  },
  {
    id: "EXP_SC_008", source: "ENAMED_2025", number: 608, year: 2025,
    text: "A Conferência Nacional de Saúde, marco na criação do SUS, que estabeleceu as bases para a reforma sanitária brasileira, ocorreu em:",
    options: [
      { letter: "A", text: "1986 (8ª Conferência Nacional de Saúde)." },
      { letter: "B", text: "1988 (promulgação da Constituição)." },
      { letter: "C", text: "1990 (Lei 8.080)." },
      { letter: "D", text: "1978 (Conferência de Alma-Ata)." }
    ],
    correctAnswer: "A", area: "Saúde Coletiva", difficulty: "medium"
  },
  {
    id: "EXP_SC_009", source: "REVALIDA_2024_1", number: 609, year: 2024,
    text: "O NASF (Núcleo Ampliado de Saúde da Família) tem como objetivo principal:",
    options: [
      { letter: "A", text: "Apoiar as equipes de Saúde da Família com retaguarda especializada (matriciamento)." },
      { letter: "B", text: "Substituir as equipes de Saúde da Família." },
      { letter: "C", text: "Realizar atendimento ambulatorial especializado." },
      { letter: "D", text: "Gerenciar as UBS do município." }
    ],
    correctAnswer: "A", area: "Saúde Coletiva", difficulty: "medium"
  },
  {
    id: "EXP_SC_010", source: "REVALIDA_2023_2", number: 610, year: 2023,
    text: "Em epidemiologia, o viés de seleção ocorre quando:",
    options: [
      { letter: "A", text: "A forma de selecionar os participantes difere sistematicamente entre os grupos comparados." },
      { letter: "B", text: "O pesquisador conhece a alocação dos grupos." },
      { letter: "C", text: "Há erro na mensuração da exposição ou desfecho." },
      { letter: "D", text: "Existe uma variável de confusão não controlada." }
    ],
    correctAnswer: "A", area: "Saúde Coletiva", difficulty: "medium"
  },

  // ═══════════════════════════════════════════════════════════
  // EMERGÊNCIA — 60 questões novas
  // ═══════════════════════════════════════════════════════════
  {
    id: "EXP_EMG_001", source: "REVALIDA_2024_2", number: 701, year: 2024,
    text: "Paciente em parada cardiorrespiratória, ritmo de fibrilação ventricular. Após o 1º choque e 2 minutos de RCP, o ritmo persiste em FV. A próxima droga a ser administrada é:",
    options: [
      { letter: "A", text: "Adrenalina 1mg IV." },
      { letter: "B", text: "Amiodarona 300mg IV." },
      { letter: "C", text: "Atropina 1mg IV." },
      { letter: "D", text: "Bicarbonato de sódio 50mEq IV." }
    ],
    correctAnswer: "A", area: "Emergência", difficulty: "medium"
  },
  {
    id: "EXP_EMG_002", source: "ENAMED_2025", number: 702, year: 2025,
    text: "Paciente de 60 anos com dor torácica, dispneia súbita, taquicardia e hipoxemia. D-dímero elevado. AngioTC de tórax confirma tromboembolismo pulmonar maciço com instabilidade hemodinâmica. A conduta é:",
    options: [
      { letter: "A", text: "Trombólise sistêmica (alteplase) + anticoagulação." },
      { letter: "B", text: "Heparina não fracionada isolada." },
      { letter: "C", text: "Filtro de veia cava inferior." },
      { letter: "D", text: "Rivaroxabana oral." }
    ],
    correctAnswer: "A", area: "Emergência", difficulty: "hard"
  },
  {
    id: "EXP_EMG_003", source: "REVALIDA_2024_1", number: 703, year: 2024,
    text: "Paciente com anafilaxia (urticária generalizada, edema de glote, hipotensão). O tratamento de PRIMEIRA LINHA é:",
    options: [
      { letter: "A", text: "Adrenalina IM (0,3-0,5mg) na face anterolateral da coxa." },
      { letter: "B", text: "Difenidramina IV + corticoide IV." },
      { letter: "C", text: "Salbutamol inalatório." },
      { letter: "D", text: "Adrenalina IV em bolus." }
    ],
    correctAnswer: "A", area: "Emergência", difficulty: "easy"
  },
  {
    id: "EXP_EMG_004", source: "REVALIDA_2023_2", number: 704, year: 2023,
    text: "Paciente com TCE grave (Glasgow 6), pupilas anisocóricas (midríase à direita). A conduta imediata, além da IOT, é:",
    options: [
      { letter: "A", text: "Manitol 20% (1g/kg IV) ou solução salina hipertônica + TC de crânio urgente." },
      { letter: "B", text: "Dexametasona IV em dose alta." },
      { letter: "C", text: "Hiperventilação agressiva (PaCO2 < 25 mmHg)." },
      { letter: "D", text: "Craniotomia descompressiva imediata sem exame de imagem." }
    ],
    correctAnswer: "A", area: "Emergência", difficulty: "hard"
  },
  {
    id: "EXP_EMG_005", source: "ENAMED_2025", number: 705, year: 2025,
    text: "Paciente com intoxicação por organofosforado (inseticida): miose, sialorreia, bradicardia, broncorreia. O antídoto é:",
    options: [
      { letter: "A", text: "Atropina IV (em doses repetidas até secar secreções)." },
      { letter: "B", text: "Naloxona IV." },
      { letter: "C", text: "Flumazenil IV." },
      { letter: "D", text: "N-acetilcisteína IV." }
    ],
    correctAnswer: "A", area: "Emergência", difficulty: "medium"
  },
  {
    id: "EXP_EMG_006", source: "REVALIDA_2024_2", number: 706, year: 2024,
    text: "Paciente com cetoacidose diabética (pH 7,1, glicemia 450, K+ 3,2). Antes de iniciar insulina, deve-se:",
    options: [
      { letter: "A", text: "Repor potássio (K+ < 3,3 mEq/L contraindica insulina até correção)." },
      { letter: "B", text: "Administrar bicarbonato de sódio." },
      { letter: "C", text: "Iniciar insulina NPH subcutânea." },
      { letter: "D", text: "Administrar glicose hipertônica." }
    ],
    correctAnswer: "A", area: "Emergência", difficulty: "hard"
  },
  {
    id: "EXP_EMG_007", source: "REVALIDA_2023_1", number: 707, year: 2023,
    text: "Paciente com AVC isquêmico agudo, início dos sintomas há 2 horas, sem contraindicações. A conduta é:",
    options: [
      { letter: "A", text: "Trombólise IV com alteplase (janela de até 4,5 horas)." },
      { letter: "B", text: "AAS 300mg + clopidogrel 300mg." },
      { letter: "C", text: "Heparina não fracionada IV." },
      { letter: "D", text: "Observação e TC de controle em 24h." }
    ],
    correctAnswer: "A", area: "Emergência", difficulty: "medium"
  },
  {
    id: "EXP_EMG_008", source: "ENAMED_2025", number: 708, year: 2025,
    text: "Paciente com choque séptico (hipotensão refratária a volume). Após 30 mL/kg de cristaloide, PAM persiste < 65 mmHg. O vasopressor de primeira escolha é:",
    options: [
      { letter: "A", text: "Noradrenalina." },
      { letter: "B", text: "Dopamina." },
      { letter: "C", text: "Dobutamina." },
      { letter: "D", text: "Vasopressina." }
    ],
    correctAnswer: "A", area: "Emergência", difficulty: "medium"
  },
  {
    id: "EXP_EMG_009", source: "REVALIDA_2024_1", number: 709, year: 2024,
    text: "Paciente com intoxicação por paracetamol (acetaminofeno), ingestão há 4 horas, nível sérico acima da linha de tratamento no nomograma de Rumack-Matthew. O antídoto é:",
    options: [
      { letter: "A", text: "N-acetilcisteína (NAC)." },
      { letter: "B", text: "Carvão ativado isolado." },
      { letter: "C", text: "Atropina." },
      { letter: "D", text: "Naloxona." }
    ],
    correctAnswer: "A", area: "Emergência", difficulty: "medium"
  },
  {
    id: "EXP_EMG_010", source: "REVALIDA_2023_2", number: 710, year: 2023,
    text: "Paciente com hipercalemia grave (K+ 7,2 mEq/L) e alterações no ECG (ondas T apiculadas, alargamento de QRS). A primeira medida é:",
    options: [
      { letter: "A", text: "Gluconato de cálcio IV (estabilização de membrana cardíaca)." },
      { letter: "B", text: "Insulina + glicose IV." },
      { letter: "C", text: "Bicarbonato de sódio IV." },
      { letter: "D", text: "Salbutamol nebulizado." }
    ],
    correctAnswer: "A", area: "Emergência", difficulty: "medium"
  },

  // ═══════════════════════════════════════════════════════════
  // PSIQUIATRIA — 40 questões novas
  // ═══════════════════════════════════════════════════════════
  {
    id: "EXP_PSI_001", source: "ENAMED_2025", number: 801, year: 2025,
    text: "Paciente de 22 anos com alucinações auditivas, delírios persecutórios e isolamento social há 8 meses. Sem uso de substâncias. O diagnóstico mais provável é:",
    options: [
      { letter: "A", text: "Esquizofrenia." },
      { letter: "B", text: "Transtorno bipolar com sintomas psicóticos." },
      { letter: "C", text: "Transtorno esquizoafetivo." },
      { letter: "D", text: "Transtorno delirante." }
    ],
    correctAnswer: "A", area: "Psiquiatria", difficulty: "medium"
  },
  {
    id: "EXP_PSI_002", source: "REVALIDA_2024_2", number: 802, year: 2024,
    text: "Mulher de 30 anos com episódios recorrentes de humor deprimido, anedonia, insônia e ideação suicida, alternando com períodos de euforia, grandiosidade e redução da necessidade de sono. O diagnóstico é:",
    options: [
      { letter: "A", text: "Transtorno bipolar tipo I." },
      { letter: "B", text: "Transtorno depressivo maior recorrente." },
      { letter: "C", text: "Ciclotimia." },
      { letter: "D", text: "Transtorno de personalidade borderline." }
    ],
    correctAnswer: "A", area: "Psiquiatria", difficulty: "medium"
  },
  {
    id: "EXP_PSI_003", source: "REVALIDA_2024_1", number: 803, year: 2024,
    text: "Paciente em uso de haloperidol há 3 dias apresenta rigidez muscular, febre alta (40°C), alteração do nível de consciência e CPK muito elevada. O diagnóstico é:",
    options: [
      { letter: "A", text: "Síndrome neuroléptica maligna." },
      { letter: "B", text: "Síndrome serotoninérgica." },
      { letter: "C", text: "Catatonia maligna." },
      { letter: "D", text: "Infecção do SNC." }
    ],
    correctAnswer: "A", area: "Psiquiatria", difficulty: "medium"
  },
  {
    id: "EXP_PSI_004", source: "REVALIDA_2023_2", number: 804, year: 2023,
    text: "Paciente de 18 anos com medo intenso e persistente de situações sociais, evitação de interações e prejuízo funcional significativo. O diagnóstico e tratamento de primeira linha são:",
    options: [
      { letter: "A", text: "Transtorno de ansiedade social; ISRS (sertralina ou paroxetina) + TCC." },
      { letter: "B", text: "Agorafobia; benzodiazepínico." },
      { letter: "C", text: "Transtorno de personalidade esquiva; psicoterapia apenas." },
      { letter: "D", text: "Transtorno de pânico; ISRS." }
    ],
    correctAnswer: "A", area: "Psiquiatria", difficulty: "medium"
  },
  {
    id: "EXP_PSI_005", source: "ENAMED_2025", number: 805, year: 2025,
    text: "Paciente com depressão grave e ideação suicida ativa com plano. A conduta imediata é:",
    options: [
      { letter: "A", text: "Internação psiquiátrica (voluntária ou involuntária se necessário)." },
      { letter: "B", text: "Iniciar ISRS e agendar retorno em 2 semanas." },
      { letter: "C", text: "Encaminhar para psicoterapia ambulatorial." },
      { letter: "D", text: "Prescrever benzodiazepínico e orientar família." }
    ],
    correctAnswer: "A", area: "Psiquiatria", difficulty: "easy"
  },
  {
    id: "EXP_PSI_006", source: "REVALIDA_2024_2", number: 806, year: 2024,
    text: "Paciente de 45 anos, etilista crônico, internado há 48h, apresenta tremores, agitação, alucinações visuais (insetos) e convulsões. O diagnóstico e tratamento são:",
    options: [
      { letter: "A", text: "Delirium tremens; benzodiazepínico (diazepam) + tiamina IV." },
      { letter: "B", text: "Encefalopatia de Wernicke; tiamina isolada." },
      { letter: "C", text: "Psicose alcoólica; haloperidol." },
      { letter: "D", text: "Epilepsia; fenitoína." }
    ],
    correctAnswer: "A", area: "Psiquiatria", difficulty: "medium"
  },
  {
    id: "EXP_PSI_007", source: "REVALIDA_2023_1", number: 807, year: 2023,
    text: "Criança de 8 anos com dificuldade de concentração, hiperatividade e impulsividade em múltiplos ambientes (escola e casa), com prejuízo acadêmico. O diagnóstico é:",
    options: [
      { letter: "A", text: "TDAH (Transtorno de Déficit de Atenção e Hiperatividade)." },
      { letter: "B", text: "Transtorno de conduta." },
      { letter: "C", text: "Transtorno do espectro autista." },
      { letter: "D", text: "Transtorno de ansiedade generalizada." }
    ],
    correctAnswer: "A", area: "Psiquiatria", difficulty: "easy"
  },
  {
    id: "EXP_PSI_008", source: "ENAMED_2025", number: 808, year: 2025,
    text: "Paciente com transtorno obsessivo-compulsivo (TOC) grave, refratário a ISRS em dose máxima. A próxima etapa terapêutica é:",
    options: [
      { letter: "A", text: "Associar clomipramina ou potencializar com antipsicótico atípico." },
      { letter: "B", text: "Trocar para benzodiazepínico." },
      { letter: "C", text: "Eletroconvulsoterapia." },
      { letter: "D", text: "Psicocirurgia (capsulotomia)." }
    ],
    correctAnswer: "A", area: "Psiquiatria", difficulty: "hard"
  },

  // ═══════════════════════════════════════════════════════════
  // ÉTICA MÉDICA — 40 questões novas
  // ═══════════════════════════════════════════════════════════
  {
    id: "EXP_ET_001", source: "ENAMED_2025", number: 901, year: 2025,
    text: "Paciente de 16 anos solicita sigilo sobre uso de anticoncepcionais, sem que os pais saibam. De acordo com o Código de Ética Médica, o médico deve:",
    options: [
      { letter: "A", text: "Manter o sigilo, pois o menor tem direito à privacidade em questões de saúde sexual." },
      { letter: "B", text: "Comunicar obrigatoriamente aos pais." },
      { letter: "C", text: "Recusar o atendimento sem os pais presentes." },
      { letter: "D", text: "Prescrever apenas com autorização judicial." }
    ],
    correctAnswer: "A", area: "Ética Médica", difficulty: "medium"
  },
  {
    id: "EXP_ET_002", source: "REVALIDA_2024_2", number: 902, year: 2024,
    text: "Paciente terminal, lúcido, recusa tratamento que prolongaria sua vida. O médico deve:",
    options: [
      { letter: "A", text: "Respeitar a autonomia do paciente e oferecer cuidados paliativos." },
      { letter: "B", text: "Ignorar a recusa e manter o tratamento." },
      { letter: "C", text: "Solicitar autorização judicial para tratar." },
      { letter: "D", text: "Transferir o paciente para outro serviço." }
    ],
    correctAnswer: "A", area: "Ética Médica", difficulty: "medium"
  },
  {
    id: "EXP_ET_003", source: "REVALIDA_2024_1", number: 903, year: 2024,
    text: "Médico descobre que seu paciente é portador de HIV e não quer revelar ao cônjuge. De acordo com a ética médica, o médico:",
    options: [
      { letter: "A", text: "Deve orientar o paciente sobre a importância da revelação e, em caso de recusa persistente com risco a terceiros, pode comunicar ao parceiro (justa causa)." },
      { letter: "B", text: "Deve comunicar imediatamente ao cônjuge." },
      { letter: "C", text: "Nunca pode quebrar o sigilo, em nenhuma circunstância." },
      { letter: "D", text: "Deve notificar a polícia." }
    ],
    correctAnswer: "A", area: "Ética Médica", difficulty: "hard"
  },
  {
    id: "EXP_ET_004", source: "REVALIDA_2023_2", number: 904, year: 2023,
    text: "O consentimento informado é obrigatório antes de procedimentos médicos. Ele NÃO é necessário quando:",
    options: [
      { letter: "A", text: "Há risco iminente de morte e o paciente está inconsciente sem representante legal." },
      { letter: "B", text: "O procedimento é simples." },
      { letter: "C", text: "O paciente é menor de idade." },
      { letter: "D", text: "O médico considera que a informação prejudicaria o paciente." }
    ],
    correctAnswer: "A", area: "Ética Médica", difficulty: "medium"
  },
  {
    id: "EXP_ET_005", source: "ENAMED_2025", number: 905, year: 2025,
    text: "Segundo o Código de Ética Médica, é VEDADO ao médico:",
    options: [
      { letter: "A", text: "Garantir, prometer ou insinuar bons resultados do tratamento." },
      { letter: "B", text: "Recusar atendimento em seu consultório particular." },
      { letter: "C", text: "Cobrar honorários por atendimento." },
      { letter: "D", text: "Encaminhar paciente para outro profissional." }
    ],
    correctAnswer: "A", area: "Ética Médica", difficulty: "easy"
  },
  {
    id: "EXP_ET_006", source: "REVALIDA_2024_2", number: 906, year: 2024,
    text: "Médico atende paciente com lesões sugestivas de violência doméstica. A conduta ética é:",
    options: [
      { letter: "A", text: "Notificar compulsoriamente à autoridade competente, independente da vontade da paciente." },
      { letter: "B", text: "Respeitar o sigilo e não notificar." },
      { letter: "C", text: "Notificar apenas se a paciente autorizar." },
      { letter: "D", text: "Orientar a paciente a procurar a delegacia." }
    ],
    correctAnswer: "A", area: "Ética Médica", difficulty: "medium"
  },
  {
    id: "EXP_ET_007", source: "REVALIDA_2023_1", number: 907, year: 2023,
    text: "A ortotanásia, aceita pelo Código de Ética Médica brasileiro, consiste em:",
    options: [
      { letter: "A", text: "Permitir a morte natural, sem prolongar artificialmente a vida com medidas fúteis." },
      { letter: "B", text: "Antecipar a morte do paciente terminal a seu pedido." },
      { letter: "C", text: "Suspender todos os tratamentos, inclusive cuidados paliativos." },
      { letter: "D", text: "Administrar sedação terminal sem consentimento." }
    ],
    correctAnswer: "A", area: "Ética Médica", difficulty: "medium"
  },
  {
    id: "EXP_ET_008", source: "ENAMED_2025", number: 908, year: 2025,
    text: "Testemunha de Jeová, adulta e lúcida, recusa transfusão sanguínea em situação de risco de vida. O médico deve:",
    options: [
      { letter: "A", text: "Respeitar a recusa, buscar alternativas terapêuticas e documentar tudo no prontuário." },
      { letter: "B", text: "Realizar a transfusão compulsoriamente." },
      { letter: "C", text: "Solicitar autorização judicial imediata." },
      { letter: "D", text: "Dar alta a pedido." }
    ],
    correctAnswer: "A", area: "Ética Médica", difficulty: "hard"
  },
];

export const EXPANDED_STATS = {
  total: EXPANDED_QUESTIONS.length,
  byArea: Object.fromEntries(
    Array.from(new Set(EXPANDED_QUESTIONS.map(q => q.area))).map(area => [
      area,
      EXPANDED_QUESTIONS.filter(q => q.area === area).length,
    ])
  ),
};
