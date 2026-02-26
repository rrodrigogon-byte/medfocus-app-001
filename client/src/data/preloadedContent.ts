/**
 * MedFocus — Conteúdo Pré-carregado por Disciplina
 * Resumos, Flashcards e Quizzes prontos para estudo offline
 * Elimina dependência da API do Dr. Focus para conteúdo básico
 */

export interface Flashcard {
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  source: string;
}

export interface SubjectBundle {
  id: string;
  name: string;
  year: number;
  summary: string;
  keyPoints: string[];
  clinicalCorrelation: string;
  flashcards: Flashcard[];
  quiz: Quiz[];
  references: { title: string; author: string; type: string }[];
  mnemonics: string[];
}

// ─── YEAR 1 ───────────────────────────────────────────────────
const anatomia: SubjectBundle = {
  id: 'anatomia', name: 'Anatomia Humana', year: 1,
  summary: 'A Anatomia Humana é a ciência que estuda a estrutura macroscópica do corpo humano. Divide-se em Anatomia Sistêmica (estudo por sistemas: esquelético, muscular, nervoso, cardiovascular, respiratório, digestório, urinário e reprodutor) e Anatomia Topográfica (estudo por regiões: cabeça, pescoço, tórax, abdome, pelve e membros). O conhecimento anatômico é a base para todas as especialidades médicas, sendo essencial para a prática cirúrgica, diagnóstico por imagem e exame físico.',
  keyPoints: [
    'O esqueleto humano possui 206 ossos no adulto, divididos em axial (80) e apendicular (126)',
    'Os músculos esqueléticos são responsáveis pela movimentação voluntária e representam ~40% do peso corporal',
    'O sistema nervoso central (encéfalo e medula espinhal) é protegido por meninges: dura-máter, aracnoide e pia-máter',
    'A vascularização arterial do encéfalo forma o Polígono de Willis, garantindo irrigação colateral',
    'O plexo braquial (C5-T1) inerva todo o membro superior — lesões causam déficits motores específicos',
    'O mediastino é dividido em superior e inferior (anterior, médio e posterior), contendo coração, grandes vasos e esôfago',
    'O peritônio forma pregas (mesentério, omento) que sustentam e protegem vísceras abdominais',
  ],
  clinicalCorrelation: 'Fraturas do colo do fêmur são comuns em idosos com osteoporose e podem comprometer a artéria circunflexa femoral medial, causando necrose avascular da cabeça do fêmur. Lesões do nervo radial no sulco do nervo radial do úmero causam "mão caída" (wrist drop).',
  flashcards: [
    { front: 'Quais são os ossos do carpo (fileira proximal)?', back: 'Escafoide, Semilunar, Piramidal e Pisiforme. Mnemônico: "Ela Sempre Pede Pizza"', difficulty: 'medium' },
    { front: 'O que é o Polígono de Willis?', back: 'Anastomose arterial na base do encéfalo formada pelas artérias cerebrais anteriores, comunicantes anteriores, carótidas internas, comunicantes posteriores e cerebrais posteriores', difficulty: 'hard' },
    { front: 'Quais nervos passam pelo canal inguinal no homem?', back: 'Nervo ilioinguinal e ramo genital do nervo genitofemoral, além do funículo espermático (ducto deferente, artéria testicular, plexo pampiniforme)', difficulty: 'hard' },
    { front: 'Qual músculo é o principal flexor do antebraço?', back: 'Bíceps braquial (também supinador). O braquial é o flexor puro do cotovelo.', difficulty: 'easy' },
    { front: 'Quais são as meninges e suas funções?', back: 'Dura-máter (proteção mecânica), Aracnoide (barreira hematomeníngea) e Pia-máter (aderida ao tecido nervoso, vascularização)', difficulty: 'easy' },
    { front: 'O que é o triângulo de Calot?', back: 'Triângulo formado pelo ducto hepático comum, ducto cístico e borda inferior do fígado. Contém a artéria cística — referência crucial na colecistectomia.', difficulty: 'hard' },
    { front: 'Quais são os forames da base do crânio e suas estruturas?', back: 'Forame magno (bulbo, artérias vertebrais), Forame jugular (IX, X, XI nervos, veia jugular interna), Forame oval (V3 — mandibular), Forame redondo (V2 — maxilar)', difficulty: 'hard' },
    { front: 'Qual a diferença entre artérias elásticas e musculares?', back: 'Elásticas (aorta, pulmonar): parede com lâminas elásticas, amortecem pulso. Musculares (radial, femoral): parede com músculo liso, regulam fluxo regional.', difficulty: 'medium' },
  ],
  quiz: [
    { question: 'Qual nervo é mais comumente lesado em fraturas do colo cirúrgico do úmero?', options: ['Nervo ulnar', 'Nervo axilar', 'Nervo radial', 'Nervo musculocutâneo'], correctIndex: 1, explanation: 'O nervo axilar passa pela região do colo cirúrgico do úmero e é vulnerável a fraturas nessa região, causando paralisia do deltoide e perda de sensibilidade na região lateral do ombro.', source: 'Moore — Anatomia Orientada para a Clínica, 8ª ed.' },
    { question: 'O ducto torácico drena a linfa para qual veia?', options: ['Veia jugular interna direita', 'Junção da veia jugular interna esquerda com a subclávia esquerda', 'Veia cava superior', 'Veia ázigos'], correctIndex: 1, explanation: 'O ducto torácico drena a linfa de 3/4 do corpo na junção venosa jugulo-subclávia esquerda (ângulo venoso esquerdo).', source: 'Netter — Atlas de Anatomia Humana, 7ª ed.' },
    { question: 'Qual estrutura passa pelo hiato esofágico do diafragma?', options: ['Aorta e ducto torácico', 'Esôfago e nervos vagos', 'Veia cava inferior', 'Tronco simpático'], correctIndex: 1, explanation: 'O hiato esofágico (T10) transmite o esôfago e os troncos vagais anterior e posterior. O hiato aórtico (T12) transmite a aorta e o ducto torácico.', source: 'Gray — Anatomia para Estudantes, 4ª ed.' },
    { question: 'Quantos pares de nervos espinhais existem?', options: ['29 pares', '31 pares', '33 pares', '35 pares'], correctIndex: 1, explanation: '31 pares: 8 cervicais, 12 torácicos, 5 lombares, 5 sacrais e 1 coccígeo.', source: 'Machado — Neuroanatomia Funcional, 3ª ed.' },
    { question: 'O músculo diafragma é inervado por qual nervo?', options: ['Nervo vago (X)', 'Nervo frênico (C3-C5)', 'Nervos intercostais', 'Nervo acessório (XI)'], correctIndex: 1, explanation: 'O nervo frênico (C3, C4, C5) é o principal nervo motor do diafragma. Mnemônico: "C3, 4, 5 keeps the diaphragm alive".', source: 'Moore — Anatomia Orientada para a Clínica, 8ª ed.' },
  ],
  references: [
    { title: 'Anatomia Orientada para a Clínica', author: 'Moore, Dalley & Agur', type: 'book' },
    { title: 'Atlas de Anatomia Humana', author: 'Frank H. Netter', type: 'book' },
    { title: 'Gray — Anatomia para Estudantes', author: 'Drake, Vogl & Mitchell', type: 'book' },
  ],
  mnemonics: [
    '"Ela Sempre Pede Pizza" — Ossos do carpo proximal: Escafoide, Semilunar, Piramidal, Pisiforme',
    '"C3, 4, 5 keeps the diaphragm alive" — Inervação do diafragma pelo nervo frênico',
    '"Robert Taylor Drinks Cold Beer" — Ramos do plexo braquial: Raízes, Troncos, Divisões, Cordões, Ramos',
  ],
};

const bioquimica: SubjectBundle = {
  id: 'bioquimica', name: 'Bioquímica', year: 1,
  summary: 'A Bioquímica estuda as reações químicas que ocorrem nos organismos vivos. Abrange o metabolismo de carboidratos (glicólise, ciclo de Krebs, cadeia respiratória), lipídios (beta-oxidação, síntese de colesterol), aminoácidos e proteínas (síntese proteica, degradação), além de ácidos nucleicos (replicação, transcrição, tradução). É fundamental para compreender a fisiopatologia de doenças metabólicas como diabetes, dislipidemias e erros inatos do metabolismo.',
  keyPoints: [
    'A glicólise ocorre no citoplasma e produz 2 ATP, 2 NADH e 2 piruvato por molécula de glicose',
    'O ciclo de Krebs ocorre na matriz mitocondrial e gera 3 NADH, 1 FADH2, 1 GTP por volta',
    'A cadeia respiratória (fosforilação oxidativa) produz ~34 ATP via gradiente de prótons na membrana mitocondrial interna',
    'A beta-oxidação de ácidos graxos gera Acetil-CoA, NADH e FADH2 — cada ciclo remove 2 carbonos',
    'A insulina ativa a glicogênese e lipogênese; o glucagon ativa a glicogenólise e gliconeogênese',
    'Enzimas alostéricas regulam vias metabólicas: PFK-1 (glicólise), piruvato carboxilase (gliconeogênese)',
  ],
  clinicalCorrelation: 'Na diabetes tipo 2, a resistência à insulina impede a captação de glicose pelo GLUT-4 nos músculos e tecido adiposo, levando a hiperglicemia crônica. A cetoacidose diabética resulta da beta-oxidação excessiva com acúmulo de corpos cetônicos.',
  flashcards: [
    { front: 'Qual é a enzima reguladora da glicólise?', back: 'Fosfofrutocinase-1 (PFK-1). É ativada por AMP e frutose-2,6-bisfosfato; inibida por ATP e citrato.', difficulty: 'medium' },
    { front: 'Onde ocorre a cadeia respiratória?', back: 'Na membrana mitocondrial interna. Os complexos I-IV transferem elétrons e bombeiam H+; a ATP sintase (complexo V) usa o gradiente para sintetizar ATP.', difficulty: 'easy' },
    { front: 'O que é a gliconeogênese e onde ocorre?', back: 'Síntese de glicose a partir de precursores não-glicídicos (lactato, aminoácidos, glicerol). Ocorre principalmente no fígado e rins. Enzimas-chave: piruvato carboxilase, PEPCK, frutose-1,6-bisfosfatase, glicose-6-fosfatase.', difficulty: 'hard' },
    { front: 'Qual a diferença entre NAD+ e FAD?', back: 'NAD+ aceita 2 elétrons + 1 H+ (→ NADH); FAD aceita 2 elétrons + 2 H+ (→ FADH2). NADH gera ~2.5 ATP; FADH2 gera ~1.5 ATP na cadeia respiratória.', difficulty: 'medium' },
    { front: 'O que são corpos cetônicos?', back: 'Acetoacetato, beta-hidroxibutirato e acetona. Produzidos no fígado a partir de Acetil-CoA quando há excesso de beta-oxidação (jejum prolongado, diabetes descompensada).', difficulty: 'medium' },
  ],
  quiz: [
    { question: 'Quantos ATPs são produzidos na oxidação completa de 1 molécula de glicose?', options: ['2 ATP', '18 ATP', '~30-32 ATP', '~38 ATP'], correctIndex: 2, explanation: 'Glicólise (2 ATP + 2 NADH) + 2 Piruvato→Acetil-CoA (2 NADH) + 2 Ciclos de Krebs (6 NADH + 2 FADH2 + 2 GTP) = ~30-32 ATP total.', source: 'Lehninger — Princípios de Bioquímica, 7ª ed.' },
    { question: 'Qual vitamina é cofator do complexo piruvato desidrogenase?', options: ['Vitamina C', 'Tiamina (B1)', 'Vitamina D', 'Ácido fólico'], correctIndex: 1, explanation: 'O complexo piruvato desidrogenase requer 5 cofatores: tiamina (B1), riboflavina (B2/FAD), niacina (B3/NAD+), ácido pantotênico (CoA) e ácido lipoico.', source: 'Stryer — Bioquímica, 8ª ed.' },
    { question: 'Em qual condição há maior produção de corpos cetônicos?', options: ['Após refeição rica em carboidratos', 'Jejum prolongado', 'Exercício leve', 'Sono profundo'], correctIndex: 1, explanation: 'No jejum prolongado, a depleção de glicogênio hepático leva à mobilização de ácidos graxos e aumento da beta-oxidação, gerando excesso de Acetil-CoA que é desviado para cetogênese.', source: 'Lehninger — Princípios de Bioquímica, 7ª ed.' },
  ],
  references: [
    { title: 'Princípios de Bioquímica', author: 'Nelson & Cox (Lehninger)', type: 'book' },
    { title: 'Bioquímica', author: 'Jeremy M. Berg (Stryer)', type: 'book' },
    { title: 'Harper — Bioquímica Ilustrada', author: 'Murray et al.', type: 'book' },
  ],
  mnemonics: [
    '"Citrate Is Krebs Starting Substrate For Making Oxaloacetate" — Intermediários do Ciclo de Krebs',
    '"Kinase Adds Phosphate" — Cinases fosforilam; fosfatases desfosforilam',
  ],
};

const fisiologia: SubjectBundle = {
  id: 'fisiologia', name: 'Fisiologia Médica', year: 2,
  summary: 'A Fisiologia Médica estuda o funcionamento normal dos sistemas orgânicos. Abrange a fisiologia cardiovascular (ciclo cardíaco, regulação da pressão arterial), respiratória (mecânica ventilatória, trocas gasosas), renal (filtração glomerular, equilíbrio ácido-base), neurofisiologia (potencial de ação, sinapses, sistemas sensoriais) e endocrinologia (eixos hormonais, feedback). É a ponte entre as ciências básicas e a clínica médica.',
  keyPoints: [
    'O débito cardíaco = frequência cardíaca × volume sistólico (~5 L/min em repouso)',
    'A pressão arterial é regulada por barorreceptores (curto prazo) e sistema renina-angiotensina-aldosterona (longo prazo)',
    'A taxa de filtração glomerular (TFG) normal é ~125 mL/min ou ~180 L/dia',
    'O potencial de ação neuronal segue a sequência: repouso (-70mV) → despolarização → repolarização → hiperpolarização',
    'A curva de dissociação da hemoglobina é sigmoide — deslocada para direita por ↑CO2, ↑H+, ↑temperatura (efeito Bohr)',
    'O eixo hipotálamo-hipófise-adrenal regula cortisol via CRH → ACTH → cortisol (feedback negativo)',
  ],
  clinicalCorrelation: 'Na insuficiência cardíaca, a redução do débito cardíaco ativa o SRAA, causando retenção de sódio e água, edema e aumento da pré-carga. Os IECA (inibidores da ECA) bloqueiam a conversão de angiotensina I em II, reduzindo a pós-carga e a retenção hídrica.',
  flashcards: [
    { front: 'O que é o efeito Bohr?', back: 'Deslocamento da curva de dissociação da hemoglobina para a DIREITA por aumento de CO2, H+, temperatura e 2,3-DPG, facilitando a liberação de O2 nos tecidos ativos.', difficulty: 'medium' },
    { front: 'Qual a fórmula do débito cardíaco?', back: 'DC = FC × VS. Em repouso: ~70 bpm × ~70 mL = ~5 L/min. No exercício pode chegar a 25 L/min.', difficulty: 'easy' },
    { front: 'O que é a TFG e como é estimada clinicamente?', back: 'Taxa de Filtração Glomerular (~125 mL/min). Estimada pelo clearance de creatinina ou fórmulas CKD-EPI. Valores <60 mL/min/1.73m² por >3 meses = doença renal crônica.', difficulty: 'hard' },
    { front: 'Quais são os componentes do sistema RAAS?', back: 'Renina (rim) → Angiotensinogênio → Angiotensina I → ECA (pulmão) → Angiotensina II → Aldosterona (adrenal). Efeitos: vasoconstrição, retenção de Na+ e H2O.', difficulty: 'medium' },
    { front: 'O que determina a complacência pulmonar?', back: 'Capacidade do pulmão de se expandir. Depende do surfactante (reduz tensão superficial), fibras elásticas e volume pulmonar. Reduzida na fibrose; aumentada no enfisema.', difficulty: 'hard' },
  ],
  quiz: [
    { question: 'Qual fase do ciclo cardíaco tem maior duração em repouso?', options: ['Sístole atrial', 'Contração isovolumétrica', 'Ejeção ventricular', 'Diástole ventricular'], correctIndex: 3, explanation: 'A diástole ventricular ocupa ~2/3 do ciclo cardíaco em repouso (~0.5s de 0.8s total), permitindo o enchimento ventricular adequado.', source: 'Guyton — Tratado de Fisiologia Médica, 14ª ed.' },
    { question: 'O surfactante pulmonar é produzido por quais células?', options: ['Pneumócitos tipo I', 'Pneumócitos tipo II', 'Células de Clara', 'Macrófagos alveolares'], correctIndex: 1, explanation: 'Os pneumócitos tipo II produzem surfactante (dipalmitoilfosfatidilcolina), que reduz a tensão superficial alveolar e previne o colapso. Maturação a partir da 35ª semana gestacional.', source: 'Guyton — Tratado de Fisiologia Médica, 14ª ed.' },
    { question: 'Qual hormônio é o principal regulador da calcemia?', options: ['Calcitonina', 'PTH (paratormônio)', 'Vitamina D', 'Cortisol'], correctIndex: 1, explanation: 'O PTH aumenta a calcemia por: reabsorção óssea, reabsorção renal de Ca2+ e ativação da vitamina D (que aumenta absorção intestinal de Ca2+).', source: 'Berne & Levy — Fisiologia, 7ª ed.' },
  ],
  references: [
    { title: 'Tratado de Fisiologia Médica', author: 'Guyton & Hall', type: 'book' },
    { title: 'Fisiologia', author: 'Berne & Levy', type: 'book' },
    { title: 'Fisiologia Médica', author: 'Boron & Boulpaep', type: 'book' },
  ],
  mnemonics: [
    '"RAAS = Rim Ativa Angiotensina, Aldosterona Segura sódio"',
    '"Efeito Bohr: Baixo pH = Baixa afinidade da Hb por O2"',
  ],
};

const farmacologia: SubjectBundle = {
  id: 'farmacologia', name: 'Farmacologia', year: 3,
  summary: 'A Farmacologia estuda a interação entre fármacos e o organismo. Divide-se em Farmacocinética (absorção, distribuição, metabolismo e excreção — ADME) e Farmacodinâmica (mecanismo de ação, receptores, dose-resposta). Abrange classes terapêuticas fundamentais: anti-hipertensivos, antibióticos, anti-inflamatórios, analgésicos, psicotrópicos e quimioterápicos. É essencial para a prescrição racional e segura de medicamentos.',
  keyPoints: [
    'Farmacocinética (ADME): Absorção → Distribuição → Metabolismo (fígado, CYP450) → Excreção (renal)',
    'Biodisponibilidade oral é reduzida pelo efeito de primeira passagem hepática',
    'Meia-vida (t½) determina o intervalo entre doses — steady state em ~5 meias-vidas',
    'Agonistas ativam receptores; antagonistas bloqueiam sem ativar; agonistas parciais ativam parcialmente',
    'IECA (captopril, enalapril) inibem a ECA → ↓angiotensina II → vasodilatação + ↓aldosterona',
    'Beta-bloqueadores (propranolol, atenolol) reduzem FC e contratilidade → ↓DC e ↓PA',
    'AINEs inibem COX-1/COX-2 → ↓prostaglandinas → efeito anti-inflamatório, analgésico e antipirético',
  ],
  clinicalCorrelation: 'A warfarina é metabolizada pelo CYP2C9. Polimorfismos genéticos e interações medicamentosas (ex: fluconazol inibe CYP2C9) podem potencializar seu efeito anticoagulante, aumentando o risco de sangramento. O monitoramento do INR é essencial.',
  flashcards: [
    { front: 'O que é o efeito de primeira passagem?', back: 'Metabolização do fármaco pelo fígado antes de atingir a circulação sistêmica, reduzindo a biodisponibilidade oral. Exemplo: nitroglicerina tem alta primeira passagem → uso sublingual.', difficulty: 'medium' },
    { front: 'Qual a diferença entre IECA e BRA?', back: 'IECA (enalapril) inibem a enzima conversora de angiotensina → ↓Ang II + ↑bradicinina (tosse seca). BRA (losartana) bloqueiam o receptor AT1 da Ang II → sem acúmulo de bradicinina.', difficulty: 'medium' },
    { front: 'O que é o CYP450?', back: 'Família de enzimas hepáticas responsáveis pelo metabolismo de ~75% dos fármacos. Principais isoformas: CYP3A4 (mais abundante), CYP2D6, CYP2C9, CYP2C19, CYP1A2.', difficulty: 'hard' },
    { front: 'Qual o mecanismo dos AINEs?', back: 'Inibem ciclo-oxigenase (COX): COX-1 (constitutiva — proteção gástrica, agregação plaquetária) e COX-2 (induzida — inflamação). AINEs não seletivos inibem ambas; coxibes são seletivos COX-2.', difficulty: 'medium' },
    { front: 'O que é índice terapêutico?', back: 'IT = DL50/DE50. Quanto MAIOR o IT, mais SEGURO o fármaco. Fármacos com IT estreito (digoxina, warfarina, lítio) requerem monitoramento sérico.', difficulty: 'easy' },
  ],
  quiz: [
    { question: 'Qual efeito adverso é característico dos IECA?', options: ['Hipercalemia', 'Tosse seca', 'Broncoespasmo', 'Ambas A e B'], correctIndex: 3, explanation: 'IECA causam tosse seca (acúmulo de bradicinina) e hipercalemia (↓aldosterona → ↓excreção de K+). A tosse é motivo frequente de troca para BRA.', source: 'Goodman & Gilman — Bases Farmacológicas da Terapêutica, 13ª ed.' },
    { question: 'Qual antibiótico inibe a síntese de parede celular bacteriana?', options: ['Azitromicina', 'Ciprofloxacino', 'Amoxicilina', 'Gentamicina'], correctIndex: 2, explanation: 'Beta-lactâmicos (penicilinas, cefalosporinas, carbapenêmicos) inibem as PBPs (proteínas ligadoras de penicilina), impedindo a síntese de peptidoglicano da parede celular.', source: 'Rang & Dale — Farmacologia, 9ª ed.' },
    { question: 'Qual é o antídoto para intoxicação por paracetamol?', options: ['Flumazenil', 'N-acetilcisteína', 'Naloxona', 'Atropina'], correctIndex: 1, explanation: 'A N-acetilcisteína (NAC) repõe os estoques de glutationa hepática, neutralizando o metabólito tóxico NAPQI gerado pelo CYP2E1.', source: 'Goodman & Gilman, 13ª ed.' },
  ],
  references: [
    { title: 'Bases Farmacológicas da Terapêutica', author: 'Goodman & Gilman', type: 'book' },
    { title: 'Farmacologia', author: 'Rang & Dale', type: 'book' },
    { title: 'Farmacologia Básica e Clínica', author: 'Katzung', type: 'book' },
  ],
  mnemonics: [
    '"ADME" — Absorção, Distribuição, Metabolismo, Excreção',
    '"IECA = Tosse; BRA = Sem tosse" — Diferença clínica principal',
    '"5 meias-vidas para steady state" — Regra de equilíbrio farmacocinético',
  ],
};

const patologia: SubjectBundle = {
  id: 'patologia', name: 'Patologia Geral', year: 2,
  summary: 'A Patologia Geral estuda os mecanismos fundamentais das doenças. Abrange lesão e morte celular (necrose, apoptose), inflamação (aguda e crônica), reparo tecidual (regeneração, cicatrização), distúrbios hemodinâmicos (trombose, embolia, infarto), neoplasias (benignas e malignas) e imunopatologia. É a disciplina que conecta as ciências básicas ao raciocínio clínico diagnóstico.',
  keyPoints: [
    'Necrose: morte celular patológica com inflamação. Tipos: coagulativa (isquemia), liquefativa (SNC), caseosa (TB), gordurosa (pancreatite)',
    'Apoptose: morte celular programada SEM inflamação — via intrínseca (mitocondrial) e extrínseca (receptores de morte)',
    'Inflamação aguda: vasodilatação, ↑permeabilidade, migração de neutrófilos. Mediadores: histamina, prostaglandinas, leucotrienos',
    'Inflamação crônica: macrófagos, linfócitos, fibrose. Granuloma = macrófagos epitelioides + células gigantes (TB, sarcoidose)',
    'Tríade de Virchow (trombose): lesão endotelial + estase sanguínea + hipercoagulabilidade',
    'Neoplasias: benignas (bem diferenciadas, encapsuladas, crescimento lento) vs malignas (invasão, metástase, anaplasia)',
  ],
  clinicalCorrelation: 'O infarto agudo do miocárdio é um exemplo clássico de necrose coagulativa por isquemia. A área infartada evolui de necrose (horas) → inflamação aguda (dias) → tecido de granulação (semanas) → cicatriz fibrosa (meses). A troponina sérica é o biomarcador mais sensível e específico.',
  flashcards: [
    { front: 'Quais são os tipos de necrose?', back: 'Coagulativa (isquemia — preserva arquitetura), Liquefativa (SNC, abscessos), Caseosa (tuberculose — aspecto de queijo), Gordurosa (pancreatite — saponificação), Fibrinoide (vasculites)', difficulty: 'medium' },
    { front: 'O que é a Tríade de Virchow?', back: '3 fatores que predispõem à trombose: 1) Lesão endotelial, 2) Estase ou turbulência do fluxo, 3) Hipercoagulabilidade. Exemplo: TVP em paciente imobilizado pós-cirurgia.', difficulty: 'easy' },
    { front: 'Qual a diferença entre neoplasia benigna e maligna?', back: 'Benigna: bem diferenciada, crescimento lento, encapsulada, sem metástase. Maligna: pouco diferenciada (anaplasia), crescimento rápido, invasiva, metástase hematogênica/linfática.', difficulty: 'easy' },
    { front: 'O que é um granuloma?', back: 'Agregado de macrófagos epitelioides ± células gigantes multinucleadas ± necrose central. Causas: TB, sarcoidose, fungos, corpo estranho. Indica inflamação crônica granulomatosa.', difficulty: 'medium' },
    { front: 'Quais são os sinais cardinais da inflamação?', back: 'Calor, Rubor, Tumor (edema), Dolor e Functio laesa (perda de função). Descritos por Celsius e Virchow.', difficulty: 'easy' },
  ],
  quiz: [
    { question: 'Qual tipo de necrose é característico do infarto cerebral?', options: ['Coagulativa', 'Liquefativa', 'Caseosa', 'Gordurosa'], correctIndex: 1, explanation: 'O SNC sofre necrose liquefativa devido ao alto conteúdo lipídico e enzimas lisossomais, resultando em cavidade cística preenchida por líquido.', source: 'Robbins — Patologia Básica, 10ª ed.' },
    { question: 'Qual mediador é responsável pela vasodilatação na inflamação aguda?', options: ['Leucotrieno B4', 'Histamina', 'IL-8', 'TNF-alfa'], correctIndex: 1, explanation: 'A histamina (liberada por mastócitos) causa vasodilatação e aumento da permeabilidade vascular nos primeiros minutos da inflamação aguda.', source: 'Robbins — Patologia Básica, 10ª ed.' },
    { question: 'Qual via de metástase é mais comum nos carcinomas?', options: ['Hematogênica', 'Linfática', 'Transcelômica', 'Por contiguidade'], correctIndex: 1, explanation: 'Carcinomas (tumores epiteliais) metastatizam preferencialmente por via linfática para linfonodos regionais. Sarcomas preferem via hematogênica.', source: 'Robbins — Patologia Básica, 10ª ed.' },
  ],
  references: [
    { title: 'Patologia — Bases Patológicas das Doenças', author: 'Robbins & Cotran', type: 'book' },
    { title: 'Patologia Básica', author: 'Kumar, Abbas & Aster', type: 'book' },
    { title: 'Patologia Geral', author: 'Bogliolo', type: 'book' },
  ],
  mnemonics: [
    '"Calor, Rubor, Tumor, Dolor, Functio laesa" — 5 sinais cardinais da inflamação',
    '"Tríade de Virchow: Endotélio, Estase, Estado (hipercoagulável)"',
  ],
};

const semiologia: SubjectBundle = {
  id: 'semiologia', name: 'Semiologia Médica', year: 3,
  summary: 'A Semiologia Médica é a arte e ciência do exame clínico. Ensina a coleta da anamnese (história clínica completa), o exame físico sistematizado (inspeção, palpação, percussão, ausculta) e a interpretação de sinais e sintomas para formular hipóteses diagnósticas. É a disciplina que transforma o estudante em médico, desenvolvendo o raciocínio clínico e a relação médico-paciente.',
  keyPoints: [
    'Anamnese: identificação, QP, HDA, interrogatório sistemático, antecedentes pessoais/familiares, hábitos de vida',
    'Exame físico geral: estado geral, nível de consciência (Glasgow), sinais vitais (PA, FC, FR, T°, SpO2)',
    'Ausculta cardíaca: focos (aórtico, pulmonar, tricúspide, mitral), bulhas (B1, B2), sopros (sistólicos, diastólicos)',
    'Ausculta pulmonar: murmúrio vesicular, estertores crepitantes (pneumonia), sibilos (asma), roncos (secreção)',
    'Palpação abdominal: superficial → profunda, sinais de irritação peritoneal (Blumberg), hepatimetria, esplenometria',
    'Exame neurológico: pares cranianos (I-XII), força muscular (0-5), reflexos profundos, sensibilidade, coordenação',
  ],
  clinicalCorrelation: 'O sinal de Murphy positivo (dor à palpação do hipocôndrio direito durante inspiração profunda) é altamente sugestivo de colecistite aguda. A manobra de Blumberg (dor à descompressão brusca) indica irritação peritoneal, presente na apendicite e peritonite.',
  flashcards: [
    { front: 'Quais são os focos de ausculta cardíaca?', back: 'Aórtico (2° EID), Pulmonar (2° EIE), Tricúspide (borda esternal esquerda baixa), Mitral (5° EIE na LHC — ictus cordis). Mnemônico: "APTiM"', difficulty: 'easy' },
    { front: 'O que é a Escala de Coma de Glasgow?', back: 'Avalia nível de consciência: Abertura ocular (1-4) + Resposta verbal (1-5) + Resposta motora (1-6) = 3-15. ≤8 = coma grave (indicação de IOT).', difficulty: 'medium' },
    { front: 'O que indica o sinal de Blumberg?', back: 'Dor à descompressão brusca do abdome = irritação peritoneal. Positivo na apendicite (ponto de McBurney), peritonite, perfuração de víscera oca.', difficulty: 'easy' },
    { front: 'Quais são os tipos de estertores pulmonares?', back: 'Crepitantes (finos): líquido alveolar — pneumonia, EAP. Bolhosos (grossos): secreção em vias aéreas maiores — bronquiectasia. Sibilos: broncoespasmo — asma, DPOC.', difficulty: 'medium' },
  ],
  quiz: [
    { question: 'Qual manobra avalia irritação meníngea?', options: ['Blumberg', 'Brudzinski', 'Murphy', 'Giordano'], correctIndex: 1, explanation: 'O sinal de Brudzinski (flexão involuntária dos joelhos ao fletir o pescoço) e o sinal de Kernig (dor ao estender o joelho com quadril fletido) indicam irritação meníngea — meningite.', source: 'Porto — Semiologia Médica, 8ª ed.' },
    { question: 'Qual é o ponto de McBurney?', options: ['Terço médio da linha entre umbigo e crista ilíaca direita', 'Hipocôndrio direito', 'Fossa ilíaca esquerda', 'Epigástrio'], correctIndex: 0, explanation: 'O ponto de McBurney localiza-se na junção do terço lateral com os dois terços mediais da linha entre a espinha ilíaca ântero-superior direita e o umbigo. Dor nesse ponto sugere apendicite.', source: 'Porto — Semiologia Médica, 8ª ed.' },
  ],
  references: [
    { title: 'Semiologia Médica', author: 'Celmo Celeno Porto', type: 'book' },
    { title: 'Propedêutica Médica', author: 'Bates', type: 'book' },
    { title: 'Exame Clínico', author: 'Dalgalarrondo', type: 'book' },
  ],
  mnemonics: [
    '"APTiM" — Focos de ausculta: Aórtico, Pulmonar, Tricúspide, Mitral',
    '"Glasgow ≤8 = Intuba" — Indicação de via aérea definitiva',
  ],
};

// ─── YEAR 4: CLÍNICA MÉDICA ──────────────────────────────────
const clinicaMedica: SubjectBundle = {
  id: 'clinica-medica', name: 'Clínica Médica', year: 4,
  summary: 'A Clínica Médica é a especialidade que integra o conhecimento de todas as áreas da medicina interna. Abrange o diagnóstico e tratamento de doenças sistêmicas como hipertensão arterial, diabetes mellitus, insuficiência cardíaca, doenças pulmonares obstrutivas, hepatopatias, nefropatias e distúrbios hematológicos. O raciocínio clínico é baseado na anamnese detalhada, exame físico sistematizado e interpretação de exames complementares.',
  keyPoints: [
    'Hipertensão arterial: PA ≥ 140/90 mmHg — principal fator de risco cardiovascular modificável',
    'Diabetes Mellitus tipo 2: resistência insulínica + disfunção de células beta — HbA1c ≥ 6,5% para diagnóstico',
    'Insuficiência Cardíaca: fração de ejeção preservada (ICFEp) vs reduzida (ICFEr) — tratamento com IECA/BRA + betabloqueador + espironolactona',
    'DPOC: obstrução crônica ao fluxo aéreo — VEF1/CVF < 0,7 pós-broncodilatador',
    'Cirrose hepática: classificação de Child-Pugh (A, B, C) e MELD para prognóstico e transplante',
    'Doença Renal Crônica: TFG < 60 mL/min por > 3 meses — estadiamento G1 a G5',
    'Anemia ferropriva: microcítica e hipocrômica — ferritina baixa é o marcador mais sensível',
  ],
  clinicalCorrelation: 'Paciente de 58 anos, hipertenso e diabético, apresenta edema de membros inferiores, dispneia aos esforços e estertores crepitantes bibasais. ECG mostra sobrecarga de VE. Diagnóstico: ICC descompensada. Conduta: furosemida IV + otimizar IECA + controle glicêmico.',
  flashcards: [
    { front: 'Quais os critérios de Framingham para ICC?', back: 'Maiores: DPN, estase jugular, estertores, cardiomegalia, EAP, B3, PVC > 16. Menores: edema MMII, tosse noturna, dispneia aos esforços, hepatomegalia, derrame pleural, FC > 120', difficulty: 'hard' },
    { front: 'Qual a tríade clássica da cetoacidose diabética?', back: 'Hiperglicemia (> 250 mg/dL) + Cetonemia/cetonúria + Acidose metabólica (pH < 7,3 e HCO3 < 18)', difficulty: 'medium' },
    { front: 'Como classificar a gravidade da DPOC pelo GOLD?', back: 'GOLD 1: VEF1 ≥ 80% | GOLD 2: 50-79% | GOLD 3: 30-49% | GOLD 4: < 30%', difficulty: 'medium' },
    { front: 'Quais são os 4 pilares do tratamento da ICFEr?', back: 'IECA/BRA (ou sacubitril-valsartana) + Betabloqueador + Antagonista mineralocorticoide + Inibidor SGLT2 (dapagliflozina/empagliflozina)', difficulty: 'hard' },
    { front: 'Qual o alvo de HbA1c para a maioria dos diabéticos?', back: 'HbA1c < 7% para a maioria. Idosos frágeis: < 8%. Jovens sem comorbidades: < 6,5%', difficulty: 'easy' },
  ],
  quiz: [
    { question: 'Paciente com PA 160/100 mmHg, creatinina 2,5 mg/dL e proteinúria. Qual anti-hipertensivo de escolha?', options: ['Anlodipino', 'IECA ou BRA', 'Hidroclorotiazida', 'Clonidina'], correctIndex: 1, explanation: 'IECA/BRA são nefroprotetores e reduzem proteinúria, sendo primeira escolha em nefropatia diabética.', source: 'Harrison 21ª ed., Cap. Nefropatia Diabética' },
    { question: 'Qual exame confirma o diagnóstico de DPOC?', options: ['Radiografia de tórax', 'Espirometria pós-broncodilatador', 'Gasometria arterial', 'TC de tórax'], correctIndex: 1, explanation: 'A espirometria com VEF1/CVF < 0,7 pós-broncodilatador confirma obstrução crônica ao fluxo aéreo.', source: 'GOLD 2024 Guidelines' },
  ],
  references: [
    { title: 'Harrison Medicina Interna', author: 'Kasper et al.', type: 'Livro-texto' },
    { title: 'Cecil Medicina', author: 'Goldman & Schafer', type: 'Livro-texto' },
    { title: 'GOLD 2024 Report', author: 'Global Initiative for COPD', type: 'Guideline' },
  ],
  mnemonics: [
    'ICC Critérios Maiores: "DEsCaRBo" — DPN, Estase jugular, eStertores, Cardiomegalia, Refluxo hepatojugular, B3',
    'Causas de Cirrose: "ABCDE" — Álcool, B (hepatite B), C (hepatite C), Drogas, Esteatose (NASH)',
  ],
};

// ─── YEAR 4-5: CIRURGIA ──────────────────────────────────────
const cirurgia: SubjectBundle = {
  id: 'cirurgia', name: 'Cirurgia Geral', year: 4,
  summary: 'A Cirurgia Geral abrange o diagnóstico e tratamento cirúrgico de doenças do aparelho digestivo, parede abdominal, sistema endócrino, mama e trauma. Inclui o manejo do abdome agudo (inflamatório, obstrutivo, perfurativo, vascular e hemorrágico), hérnias, doenças das vias biliares, apendicite, e princípios de cirurgia oncológica. O conhecimento de anatomia cirúrgica, técnica operatória e cuidados pré e pós-operatórios é fundamental.',
  keyPoints: [
    'Abdome agudo inflamatório: apendicite (ponto de McBurney), colecistite (sinal de Murphy), diverticulite (FIE)',
    'Abdome agudo obstrutivo: distensão + vômitos + parada de eliminação de gases e fezes — RX com níveis hidroaéreos',
    'Abdome agudo perfurativo: pneumoperitônio no RX (sinal de Jobert) — cirurgia de urgência',
    'Hérnias inguinais: direta (triângulo de Hesselbach) vs indireta (pelo anel inguinal profundo)',
    'Colecistite aguda: critérios de Tóquio (TG18) para gravidade — colecistectomia laparoscópica precoce',
    'Trauma: ABCDE do ATLS — Airway, Breathing, Circulation, Disability, Exposure',
    'Classificação de Clavien-Dindo para complicações pós-operatórias (graus I a V)',
  ],
  clinicalCorrelation: 'Paciente de 25 anos com dor em FID há 12h, migração da dor periumbilical, febre 38,2°C e Blumberg positivo. Leucocitose com desvio à esquerda. Diagnóstico: apendicite aguda. Conduta: apendicectomia (laparoscópica preferencial).',
  flashcards: [
    { front: 'Quais os limites do triângulo de Hesselbach?', back: 'Medial: borda lateral do músculo reto abdominal. Lateral: vasos epigástricos inferiores. Inferior: ligamento inguinal (de Poupart)', difficulty: 'hard' },
    { front: 'Qual a diferença entre hérnia inguinal direta e indireta?', back: 'Direta: protrusão pelo triângulo de Hesselbach (medial aos vasos epigástricos). Indireta: pelo anel inguinal profundo (lateral aos vasos), pode descer ao escroto', difficulty: 'medium' },
    { front: 'Quais os sinais de irritação peritoneal?', back: 'Blumberg (descompressão dolorosa), Rovsing (dor em FID ao comprimir FIE), defesa muscular involuntária, rigidez abdominal (abdome em tábua)', difficulty: 'medium' },
    { front: 'O que é a tríade de Charcot?', back: 'Febre com calafrios + Icterícia + Dor em hipocôndrio direito — indica colangite aguda', difficulty: 'easy' },
    { front: 'Qual a pêntade de Reynolds?', back: 'Tríade de Charcot + Hipotensão + Confusão mental — indica colangite supurativa grave', difficulty: 'hard' },
  ],
  quiz: [
    { question: 'Paciente com dor abdominal súbita, rigidez abdominal e pneumoperitônio no RX. Qual o diagnóstico?', options: ['Apendicite aguda', 'Abdome agudo perfurativo', 'Pancreatite aguda', 'Obstrução intestinal'], correctIndex: 1, explanation: 'Pneumoperitônio indica perfuração de víscera oca (úlcera péptica perfurada é a causa mais comum).', source: 'Sabiston Textbook of Surgery, 21ª ed.' },
    { question: 'Qual o primeiro passo no atendimento ao politraumatizado?', options: ['Acesso venoso calibroso', 'Via aérea com proteção cervical', 'Controle de hemorragia', 'Avaliação neurológica'], correctIndex: 1, explanation: 'O ABCDE do ATLS prioriza via aérea (A) com proteção da coluna cervical como primeiro passo.', source: 'ATLS 10th Edition' },
  ],
  references: [
    { title: 'Sabiston Textbook of Surgery', author: 'Townsend et al.', type: 'Livro-texto' },
    { title: 'Schwartz Principles of Surgery', author: 'Brunicardi et al.', type: 'Livro-texto' },
    { title: 'ATLS Student Manual', author: 'American College of Surgeons', type: 'Manual' },
  ],
  mnemonics: [
    'ATLS: "ABCDE" — Airway, Breathing, Circulation, Disability, Exposure',
    'Abdome agudo: "IOPVH" — Inflamatório, Obstrutivo, Perfurativo, Vascular, Hemorrágico',
  ],
};

// ─── YEAR 5: PEDIATRIA ───────────────────────────────────────
const pediatria: SubjectBundle = {
  id: 'pediatria', name: 'Pediatria', year: 5,
  summary: 'A Pediatria abrange o cuidado integral da criança e do adolescente, desde o período neonatal até os 18 anos. Inclui puericultura (acompanhamento do crescimento e desenvolvimento), calendário vacinal, aleitamento materno, doenças exantemáticas, infecções respiratórias agudas (IRA), doenças diarreicas, desnutrição e urgências pediátricas. O conhecimento das particularidades fisiológicas de cada faixa etária é essencial para o diagnóstico e tratamento adequados.',
  keyPoints: [
    'Aleitamento materno exclusivo até 6 meses — reduz mortalidade infantil em até 13%',
    'Marcos do desenvolvimento: sustento cefálico (3m), sentar sem apoio (6m), andar (12m), falar frases (2a)',
    'Calendário vacinal: BCG e Hepatite B ao nascer, Pentavalente aos 2/4/6 meses, Tríplice viral aos 12 meses',
    'IVAS: principal causa de consulta pediátrica — maioria viral, antibiótico apenas se bacteriana',
    'Doenças exantemáticas: sarampo (Koplik), rubéola (Forchheimer), varicela (vesículas em céu estrelado)',
    'Desidratação: classificação OMS (sem desidratação, alguma, grave) — TRO ou hidratação venosa',
    'Escala de Apgar: avaliação do RN ao 1° e 5° minuto (FC, respiração, tônus, irritabilidade, cor)',
  ],
  clinicalCorrelation: 'Lactente de 8 meses com febre alta há 3 dias, seguida de exantema maculopapular difuso após defervescência. Diagnóstico: exantema súbito (roséola — HHV-6). Conduta: suporte clínico, sem necessidade de antiviral.',
  flashcards: [
    { front: 'Quais os marcos do desenvolvimento motor no primeiro ano?', back: '3m: sustento cefálico | 6m: sentar sem apoio | 9m: engatinhar | 12m: andar com apoio. Variação normal de ±2 meses', difficulty: 'medium' },
    { front: 'Qual a diferença entre sarampo e rubéola no exantema?', back: 'Sarampo: exantema craniocaudal (começa na face), manchas de Koplik na mucosa oral. Rubéola: exantema difuso + linfadenopatia retroauricular + manchas de Forchheimer no palato', difficulty: 'hard' },
    { front: 'Como classificar desidratação pela OMS?', back: 'Sem desidratação: < 5% perda. Alguma: 5-10% (olhos fundos, sede, sinal da prega). Grave: > 10% (letargia, pulso fraco, enchimento capilar > 5s)', difficulty: 'medium' },
    { front: 'Qual o esquema de TRO na desidratação?', back: 'Plano A: domicílio, oferecer líquidos. Plano B: TRO na unidade (75 mL/kg em 4h). Plano C: hidratação venosa (SF 0,9% 20 mL/kg em bolus)', difficulty: 'medium' },
    { front: 'Quando suspeitar de pneumonia bacteriana em criança?', back: 'Taquipneia (FR > 50 em < 1 ano, > 40 em 1-5 anos) + febre + tiragem subcostal. RX: consolidação lobar. Tratamento: amoxicilina VO', difficulty: 'easy' },
  ],
  quiz: [
    { question: 'Lactente de 4 meses com febre, tosse e FR = 58 irpm. Qual o diagnóstico mais provável?', options: ['Bronquiolite', 'Pneumonia bacteriana', 'Laringite', 'Asma'], correctIndex: 1, explanation: 'Taquipneia (FR > 50 em < 1 ano) + febre sugere pneumonia bacteriana. Bronquiolite tem sibilância predominante.', source: 'Nelson Textbook of Pediatrics, 21ª ed.' },
    { question: 'Qual vacina é aplicada ao nascimento?', options: ['Pentavalente', 'BCG + Hepatite B', 'Tríplice viral', 'Rotavírus'], correctIndex: 1, explanation: 'BCG (tuberculose) e Hepatite B são aplicadas nas primeiras 12 horas de vida.', source: 'Calendário Nacional de Vacinação - MS 2024' },
  ],
  references: [
    { title: 'Nelson Textbook of Pediatrics', author: 'Kliegman et al.', type: 'Livro-texto' },
    { title: 'Tratado de Pediatria - SBP', author: 'Sociedade Brasileira de Pediatria', type: 'Livro-texto' },
    { title: 'Calendário Nacional de Vacinação', author: 'Ministério da Saúde', type: 'Guideline' },
  ],
  mnemonics: [
    'APGAR: "Aparência, Pulso, Gesticulação, Atividade, Respiração"',
    'Exantemáticas: "SR VER CE" — Sarampo, Rubéola, Varicela, Eritema infeccioso, Roséola, COVID, Escarlatina',
  ],
};

// ─── YEAR 5: GINECOLOGIA E OBSTETRÍCIA ───────────────────────
const ginecologia: SubjectBundle = {
  id: 'ginecologia', name: 'Ginecologia e Obstetrícia', year: 5,
  summary: 'A Ginecologia e Obstetrícia (GO) é a especialidade que cuida da saúde da mulher em todas as fases da vida. A Ginecologia abrange distúrbios menstruais, infecções genitais, contracepção, climatério e rastreamento de câncer (colo uterino e mama). A Obstetrícia acompanha a gestação, parto e puerpério, incluindo pré-natal, complicações gestacionais (pré-eclâmpsia, diabetes gestacional, placenta prévia) e assistência ao parto normal e cesárea.',
  keyPoints: [
    'Pré-natal: mínimo 6 consultas (MS) — 1ª até 12 semanas, mensal até 28s, quinzenal até 36s, semanal até o parto',
    'Pré-eclâmpsia: PA ≥ 140/90 após 20 semanas + proteinúria — risco de eclâmpsia (convulsão) e HELLP',
    'Diabetes gestacional: TOTG 75g entre 24-28 semanas — jejum ≥ 92, 1h ≥ 180, 2h ≥ 153 mg/dL',
    'Rastreamento cervical: Papanicolaou dos 25 aos 64 anos, a cada 3 anos após 2 normais consecutivos',
    'Contracepção: DIU de cobre (não hormonal, 10 anos), DIU hormonal (levonorgestrel, 5 anos), pílula, implante',
    'Partograma: registro gráfico do trabalho de parto — dilatação cervical + descida da apresentação',
    'Sulfato de magnésio: droga de escolha para prevenção e tratamento de eclâmpsia (esquema Zuspan ou Pritchard)',
  ],
  clinicalCorrelation: 'Gestante de 32 semanas com PA 160/110, cefaleia intensa, escotomas e proteinúria 3+. Diagnóstico: pré-eclâmpsia grave. Conduta: sulfato de magnésio (prevenção de eclâmpsia) + anti-hipertensivo (hidralazina IV) + avaliação de maturidade fetal para possível interrupção.',
  flashcards: [
    { front: 'Quais os critérios diagnósticos de pré-eclâmpsia?', back: 'PA ≥ 140/90 mmHg após 20 semanas de gestação + proteinúria ≥ 300 mg/24h (ou relação proteína/creatinina ≥ 0,3). Sem proteinúria: considerar se plaquetopenia, elevação de transaminases, creatinina > 1,1 ou sintomas cerebrais/visuais', difficulty: 'hard' },
    { front: 'Qual a diferença entre placenta prévia e DPP?', back: 'Placenta prévia: sangramento indolor, vermelho vivo, útero relaxado. DPP (descolamento prematuro): dor intensa, sangramento escuro, útero hipertônico ("útero de Couvelaire")', difficulty: 'hard' },
    { front: 'Quais exames são obrigatórios no pré-natal?', back: 'Hemograma, tipagem ABO/Rh, glicemia, VDRL, HIV, HBsAg, EAS, urocultura, toxoplasmose IgG/IgM, ultrassom obstétrico', difficulty: 'medium' },
    { front: 'Quando indicar cesárea eletiva?', back: 'Placenta prévia total, iteratividade (2+ cesáreas), apresentação pélvica (controverso), HIV com CV > 1000, herpes genital ativo, macrossomia > 4,5kg em diabéticas', difficulty: 'medium' },
    { front: 'O que é a síndrome HELLP?', back: 'Hemolysis (hemólise) + Elevated Liver enzymes (elevação de transaminases) + Low Platelets (plaquetopenia < 100.000). Complicação grave da pré-eclâmpsia', difficulty: 'hard' },
  ],
  quiz: [
    { question: 'Gestante de 28 semanas com sangramento vaginal indolor e abundante. Qual o diagnóstico mais provável?', options: ['DPP', 'Placenta prévia', 'Rotura uterina', 'Vasa prévia'], correctIndex: 1, explanation: 'Sangramento indolor, vermelho vivo, sem hipertonia uterina é clássico de placenta prévia.', source: 'Williams Obstetrics, 26ª ed.' },
    { question: 'Qual a droga de escolha para prevenção de eclâmpsia?', options: ['Diazepam', 'Fenitoína', 'Sulfato de magnésio', 'Hidralazina'], correctIndex: 2, explanation: 'O sulfato de magnésio é superior a todos os anticonvulsivantes na prevenção e tratamento da eclâmpsia (estudo MAGPIE).', source: 'MAGPIE Trial, Lancet 2002' },
  ],
  references: [
    { title: 'Williams Obstetrics', author: 'Cunningham et al.', type: 'Livro-texto' },
    { title: 'Tratado de Obstetrícia Febrasgo', author: 'Febrasgo', type: 'Livro-texto' },
    { title: 'Manual de Pré-Natal e Puerpério', author: 'Ministério da Saúde', type: 'Guideline' },
  ],
  mnemonics: [
    'HELLP: "Hemólise, Elevated Liver, Low Platelets"',
    'Pré-eclâmpsia grave: "CHOP" — Cefaleia, Hiperreflexia, Oligúria, Proteinúria maciça',
  ],
};

// ─── YEAR 6: SAÚDE COLETIVA / MEDICINA PREVENTIVA ────────────
const saudeColetiva: SubjectBundle = {
  id: 'saude-coletiva', name: 'Saúde Coletiva', year: 6,
  summary: 'A Saúde Coletiva integra epidemiologia, políticas de saúde e gestão do SUS. Abrange vigilância epidemiológica, atenção primária à saúde (APS), estratégia de saúde da família (ESF), indicadores de saúde, determinantes sociais e programas nacionais de imunização, controle de doenças crônicas e saúde mental. É fundamental para a prova de residência e para a prática médica no contexto do sistema público brasileiro.',
  keyPoints: [
    'SUS: princípios doutrinários (universalidade, equidade, integralidade) e organizativos (descentralização, regionalização, hierarquização)',
    'APS: porta de entrada preferencial do SUS — ESF com equipe mínima: médico, enfermeiro, técnico de enfermagem, ACS',
    'Epidemiologia: incidência (casos novos/população) vs prevalência (casos existentes/população)',
    'Vigilância epidemiológica: doenças de notificação compulsória (dengue, tuberculose, COVID-19, meningite)',
    'Indicadores de saúde: TMI (taxa de mortalidade infantil), TMM (taxa de mortalidade materna), esperança de vida',
    'Determinantes sociais: modelo de Dahlgren e Whitehead — condições socioeconômicas influenciam saúde',
    'Programa Nacional de Imunização (PNI): um dos maiores do mundo, cobertura vacinal como indicador de APS',
  ],
  clinicalCorrelation: 'UBS atende comunidade com alta prevalência de diabetes e hipertensão. A equipe ESF implementa busca ativa, grupos de educação em saúde e monitoramento de HbA1c. Resultado: redução de 30% nas internações por complicações em 1 ano — exemplo de APS resolutiva.',
  flashcards: [
    { front: 'Quais são os princípios doutrinários do SUS?', back: 'Universalidade (acesso a todos), Equidade (tratar desiguais de forma desigual) e Integralidade (atenção completa: promoção, prevenção, tratamento e reabilitação)', difficulty: 'easy' },
    { front: 'Qual a diferença entre incidência e prevalência?', back: 'Incidência: casos NOVOS em um período (mede risco). Prevalência: todos os casos EXISTENTES em um momento (mede carga da doença). Prevalência = Incidência × Duração', difficulty: 'medium' },
    { front: 'O que é a Estratégia Saúde da Família (ESF)?', back: 'Modelo de APS do SUS com equipe multiprofissional (médico, enfermeiro, técnico de enfermagem, 4-6 ACS) responsável por território definido de até 3.500 pessoas', difficulty: 'easy' },
    { front: 'Quais doenças são de notificação compulsória imediata?', back: 'Dengue grave, meningite, sarampo, raiva humana, botulismo, cólera, febre amarela, malária (fora da região endêmica), COVID-19 grave, SRAG', difficulty: 'hard' },
  ],
  quiz: [
    { question: 'Qual princípio do SUS garante que todos os cidadãos têm direito ao acesso?', options: ['Equidade', 'Integralidade', 'Universalidade', 'Descentralização'], correctIndex: 2, explanation: 'Universalidade é o princípio que garante acesso a todos os cidadãos brasileiros, independente de contribuição.', source: 'Lei 8.080/1990 — Lei Orgânica da Saúde' },
  ],
  references: [
    { title: 'Epidemiologia & Saúde', author: 'Rouquayrol & Almeida Filho', type: 'Livro-texto' },
    { title: 'Lei 8.080/1990', author: 'Congresso Nacional', type: 'Legislação' },
    { title: 'Política Nacional de Atenção Básica', author: 'Ministério da Saúde', type: 'Guideline' },
  ],
  mnemonics: [
    'SUS Doutrinários: "UEI" — Universalidade, Equidade, Integralidade',
    'Níveis de prevenção: "PPPTR" — Promoção, Proteção, Precoce (diagnóstico), Prevenção de incapacidade, Reabilitação',
  ],
};

// ─── YEAR 6: EMERGÊNCIA E URGÊNCIA ───────────────────────────
const emergencia: SubjectBundle = {
  id: 'emergencia', name: 'Medicina de Emergência', year: 6,
  summary: 'A Medicina de Emergência abrange o atendimento inicial de condições que ameaçam a vida: parada cardiorrespiratória (PCR), síndrome coronariana aguda (SCA), acidente vascular cerebral (AVC), sepse, anafilaxia, intoxicações e trauma grave. O domínio dos protocolos ACLS, BLS e ATLS é essencial para todo médico, independente da especialidade.',
  keyPoints: [
    'PCR: BLS (C-A-B) — Compressões 100-120/min, profundidade 5-6 cm, permitir retorno torácico completo',
    'ACLS: ritmos chocáveis (FV/TV sem pulso) vs não chocáveis (assistolia/AESP) — epinefrina 1mg a cada 3-5 min',
    'SCA: IAMCSST (supra de ST) — reperfusão em até 12h (angioplastia primária < 90 min ou trombolítico < 30 min)',
    'AVC isquêmico: trombólise com alteplase até 4,5h do início dos sintomas — TC sem contraste para excluir hemorragia',
    'Sepse: qSOFA ≥ 2 (PAS ≤ 100, FR ≥ 22, Glasgow < 15) — antibiótico em até 1 hora + ressuscitação volêmica',
    'Anafilaxia: epinefrina IM 0,3-0,5 mg (face anterolateral da coxa) — NUNCA IV em bolus',
    'Intoxicação por paracetamol: N-acetilcisteína como antídoto — nomograma de Rumack-Matthew',
  ],
  clinicalCorrelation: 'Paciente de 62 anos com dor torácica opressiva há 2h, irradiação para MSE, sudorese e náuseas. ECG: supra de ST em DII, DIII e aVF. Diagnóstico: IAM inferior. Conduta: AAS + clopidogrel + heparina + encaminhar para angioplastia primária em até 90 minutos.',
  flashcards: [
    { front: 'Qual a sequência do BLS?', back: 'C-A-B: Compressões (30) → Abertura de via aérea → Breathing (2 ventilações). Compressões: 100-120/min, 5-6 cm de profundidade', difficulty: 'easy' },
    { front: 'Quais os ritmos chocáveis na PCR?', back: 'Fibrilação Ventricular (FV) e Taquicardia Ventricular sem pulso (TV). Tratamento: desfibrilação + epinefrina + amiodarona', difficulty: 'medium' },
    { front: 'Qual o tempo-porta para trombólise no AVC isquêmico?', back: 'Até 4,5 horas do início dos sintomas. Alteplase 0,9 mg/kg (máx 90 mg), 10% em bolus + 90% em 1 hora. TC sem contraste ANTES para excluir hemorragia', difficulty: 'hard' },
    { front: 'Qual a dose de epinefrina na anafilaxia?', back: 'Epinefrina IM 0,3-0,5 mg (adultos) ou 0,01 mg/kg (crianças). Via IM na face anterolateral da coxa. Pode repetir a cada 5-15 min', difficulty: 'medium' },
  ],
  quiz: [
    { question: 'Paciente em PCR com ritmo de assistolia. Qual a conduta?', options: ['Desfibrilação imediata', 'Epinefrina 1mg IV + RCP', 'Amiodarona 300mg IV', 'Cardioversão sincronizada'], correctIndex: 1, explanation: 'Assistolia é ritmo NÃO chocável. Conduta: RCP de alta qualidade + epinefrina 1mg IV a cada 3-5 min + tratar causas reversíveis (5H e 5T).', source: 'AHA ACLS Guidelines 2020' },
    { question: 'Qual o primeiro exame no AVC agudo?', options: ['Ressonância magnética', 'Angiografia cerebral', 'TC de crânio sem contraste', 'Punção lombar'], correctIndex: 2, explanation: 'TC sem contraste é o primeiro exame para diferenciar AVC isquêmico de hemorrágico e definir conduta (trombólise vs cirurgia).', source: 'AHA/ASA Stroke Guidelines 2019' },
  ],
  references: [
    { title: 'ACLS Provider Manual', author: 'American Heart Association', type: 'Manual' },
    { title: 'Tintinalli Emergency Medicine', author: 'Tintinalli et al.', type: 'Livro-texto' },
    { title: 'ATLS Student Manual', author: 'American College of Surgeons', type: 'Manual' },
  ],
  mnemonics: [
    'PCR 5H: "Hipovolemia, Hipóxia, Hidrogênio (acidose), Hipo/Hipercalemia, Hipotermia"',
    'PCR 5T: "Tensão (pneumotórax), Tamponamento, Toxinas, Trombose pulmonar, Trombose coronariana"',
    'SCA: "MONAB" — Morfina, Oxigênio (se SpO2 < 94%), Nitrato, AAS, Betabloqueador',
  ],
};

// ─── MASTER INDEX ─────────────────────────────────────────────
import { EXPANDED_SUBJECTS, extraFlashcardsClinica, extraQuizClinica, extraFlashcardsCirurgia, extraQuizCirurgia, extraFlashcardsPediatria, extraQuizPediatria, extraFlashcardsGineco, extraQuizGineco } from './expandedContent';

// Merge extra content into existing subjects
clinicaMedica.flashcards = [...clinicaMedica.flashcards, ...extraFlashcardsClinica];
clinicaMedica.quiz = [...clinicaMedica.quiz, ...extraQuizClinica];
cirurgia.flashcards = [...cirurgia.flashcards, ...extraFlashcardsCirurgia];
cirurgia.quiz = [...cirurgia.quiz, ...extraQuizCirurgia];
pediatria.flashcards = [...pediatria.flashcards, ...extraFlashcardsPediatria];
pediatria.quiz = [...pediatria.quiz, ...extraQuizPediatria];
ginecologia.flashcards = [...ginecologia.flashcards, ...extraFlashcardsGineco];
ginecologia.quiz = [...ginecologia.quiz, ...extraQuizGineco];

export const ALL_SUBJECTS: SubjectBundle[] = [
  anatomia, bioquimica, fisiologia, patologia, farmacologia, semiologia,
  clinicaMedica, cirurgia, pediatria, ginecologia, saudeColetiva, emergencia,
  ...EXPANDED_SUBJECTS,
];

// Map subject names to bundles for quick lookup
export const SUBJECT_MAP: Record<string, SubjectBundle> = {};
ALL_SUBJECTS.forEach(s => {
  SUBJECT_MAP[s.name.toLowerCase()] = s;
  SUBJECT_MAP[s.id] = s;
});

/**
 * Find the best matching preloaded content for a given subject name
 */
export function findSubjectContent(subjectName: string): SubjectBundle | null {
  const lower = subjectName.toLowerCase();
  // Exact match
  if (SUBJECT_MAP[lower]) return SUBJECT_MAP[lower];
  // Partial match
  for (const s of ALL_SUBJECTS) {
    if (lower.includes(s.id) || s.name.toLowerCase().includes(lower) || lower.includes(s.name.toLowerCase().split(' ')[0])) {
      return s;
    }
  }
  return null;
}

/**
 * Get all subjects available for a given year
 */
export function getSubjectsByYear(year: number): SubjectBundle[] {
  return ALL_SUBJECTS.filter(s => s.year === year);
}
