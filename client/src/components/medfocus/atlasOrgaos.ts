export interface ComponenteDissecacao {
  nome: string;
  descricao: string;
  imagem?: string;
}

export interface OrgaoData {
  id: string;
  nome: string;
  nomeLatim: string;
  imagem: string;
  sistema: string;
  descricao: string;
  funcao: string;
  localizacao: string;
  irrigacao: string;
  inervacao: string;
  patologias: string[];
  componentes: ComponenteDissecacao[];
  curiosidade: string;
}

export interface SistemaData {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  descricao: string;
}

export const SISTEMAS: SistemaData[] = [
  { id: 'cardiovascular', nome: 'Cardiovascular', icone: '\u2764\uFE0F', cor: '#ef4444', descricao: 'Responsavel pela circulacao do sangue' },
  { id: 'respiratorio', nome: 'Respiratorio', icone: '\uD83E\uDEC1', cor: '#3b82f6', descricao: 'Trocas gasosas e ventilacao pulmonar' },
  { id: 'nervoso', nome: 'Nervoso', icone: '\uD83E\uDDE0', cor: '#a855f7', descricao: 'Controle e coordenacao do organismo' },
  { id: 'digestorio', nome: 'Digestorio', icone: '\uD83C\uDF56', cor: '#f59e0b', descricao: 'Digestao e absorcao de nutrientes' },
  { id: 'urinario', nome: 'Urinario', icone: '\uD83D\uDCA7', cor: '#06b6d4', descricao: 'Filtracao do sangue e excrecao' },
  { id: 'endocrino', nome: 'Endocrino', icone: '\uD83E\uDD8B', cor: '#ec4899', descricao: 'Regulacao hormonal do organismo' },
  { id: 'musculoesqueletico', nome: 'Musculoesqueletico', icone: '\uD83E\uDDB4', cor: '#f97316', descricao: 'Sustentacao, protecao e movimento' },
  { id: 'reprodutor', nome: 'Reprodutor', icone: '\uD83E\uDDEC', cor: '#14b8a6', descricao: 'Reproducao humana' },
  { id: 'sentidos', nome: 'Orgaos dos Sentidos', icone: '\uD83D\uDC41\uFE0F', cor: '#8b5cf6', descricao: 'Captacao de estimulos sensoriais' },
];

const D = '/atlas-organs/dissecacao';

export const ORGAOS: OrgaoData[] = [
  // ═══════════════════ CARDIOVASCULAR ═══════════════════
  {
    id: 'coracao', nome: 'Coracao', nomeLatim: 'Cor', imagem: '/atlas-organs/coracao.png', sistema: 'cardiovascular',
    descricao: 'Orgao muscular oco que bombeia sangue para todo o corpo. Possui 4 camaras: 2 atrios e 2 ventriculos.',
    funcao: 'Bombear sangue oxigenado para o corpo e sangue desoxigenado para os pulmoes.',
    localizacao: 'Mediastino medio, entre os pulmoes, posterior ao esterno.',
    irrigacao: 'Arterias coronarias direita e esquerda (ramos da aorta ascendente).',
    inervacao: 'Plexo cardiaco (simpatico e parassimpatico via nervo vago).',
    patologias: ['Infarto Agudo do Miocardio', 'Insuficiencia Cardiaca', 'Arritmias', 'Valvopatias', 'Endocardite'],
    componentes: [
      { nome: 'Vista Externa', descricao: 'Visao geral externa do coracao com vasos', imagem: `${D}/coracao-vista-externa.png` },
      { nome: 'Corte Sagital', descricao: 'Secao sagital revelando camaras internas', imagem: `${D}/coracao-corte-sagital.png` },
      { nome: 'Miocardio', descricao: 'Camada muscular responsavel pela contracao', imagem: `${D}/miocardio.png` },
      { nome: 'Endocardio', descricao: 'Revestimento interno das camaras', imagem: `${D}/endocardio.png` },
      { nome: 'Atrio Direito', descricao: 'Recebe sangue venoso das veias cavas', imagem: `${D}/atrio-direito.png` },
      { nome: 'Atrio Esquerdo', descricao: 'Recebe sangue oxigenado das veias pulmonares', imagem: `${D}/atrio-esquerdo.png` },
      { nome: 'Ventriculo Direito', descricao: 'Bombeia sangue para a arteria pulmonar', imagem: `${D}/ventriculo-direito.png` },
      { nome: 'Ventriculo Esquerdo', descricao: 'Bombeia sangue para a aorta', imagem: `${D}/ventriculo-esquerdo.png` },
      { nome: 'Valvula Tricuspide', descricao: 'Entre atrio e ventriculo direito', imagem: `${D}/valvula-tricuspide.png` },
      { nome: 'Valvula Mitral (Bicuspide)', descricao: 'Entre atrio e ventriculo esquerdo', imagem: `${D}/valvula-mitral-bicuspide.png` },
      { nome: 'Valvula Pulmonar', descricao: 'Na saida do ventriculo direito', imagem: `${D}/valvula-pulmonar.png` },
      { nome: 'Valvula Aortica', descricao: 'Na saida do ventriculo esquerdo', imagem: `${D}/valvula-aortica.png` },
      { nome: 'Septo Interventricular', descricao: 'Parede entre os ventriculos', imagem: `${D}/septo-interventricular.png` },
      { nome: 'Arteria Pulmonar', descricao: 'Leva sangue desoxigenado aos pulmoes', imagem: `${D}/arteria-pulmonar.png` },
      { nome: 'Veias Pulmonares', descricao: 'Trazem sangue oxigenado dos pulmoes', imagem: `${D}/veias-pulmonares.png` },
    ],
    curiosidade: 'O coracao bate cerca de 100.000 vezes por dia, bombeando aproximadamente 7.500 litros de sangue.',
  },
  {
    id: 'aorta', nome: 'Aorta', nomeLatim: 'Aorta', imagem: '/atlas-organs/aorta.png', sistema: 'cardiovascular',
    descricao: 'Maior arteria do corpo humano, origina-se do ventriculo esquerdo e distribui sangue oxigenado.',
    funcao: 'Conduzir sangue oxigenado do coracao para todo o corpo.',
    localizacao: 'Origina-se no ventriculo esquerdo, percorre torax e abdomen.',
    irrigacao: 'Vasa vasorum (pequenos vasos na parede arterial).',
    inervacao: 'Plexo aortico (simpatico).',
    patologias: ['Aneurisma de Aorta', 'Disseccao Aortica', 'Coarctacao da Aorta', 'Aterosclerose'],
    componentes: [
      { nome: 'Aorta (Visao Geral)', descricao: 'Visao completa da aorta e ramificacoes', imagem: `${D}/aorta.png` },
      { nome: 'Aorta Ascendente', descricao: 'Parte inicial, origina as coronarias', imagem: `${D}/aorta-ascendente.png` },
      { nome: 'Arco Aortico', descricao: 'Curva superior com ramos para cabeca e MMSS', imagem: `${D}/arco-aortico.png` },
      { nome: 'Aorta Descendente', descricao: 'Percorre torax e abdomen', imagem: `${D}/aorta-descendente.png` },
      { nome: 'Arterias Carotidas Comuns', descricao: 'Ramos do arco para o cerebro', imagem: `${D}/arterias-carotidas-comuns.png` },
      { nome: 'Arterias Subclavias', descricao: 'Ramos do arco para MMSS', imagem: `${D}/arterias-subclavias.png` },
    ],
    curiosidade: 'A aorta tem diametro de 2,5-3,5 cm e suporta pressoes de ate 120 mmHg.',
  },
  {
    id: 'veia-cava-superior', nome: 'Veia Cava Superior', nomeLatim: 'Vena cava superior', imagem: '/atlas-organs/veia-cava-superior.png', sistema: 'cardiovascular',
    descricao: 'Grande veia que drena sangue da cabeca, pescoco e membros superiores para o atrio direito.',
    funcao: 'Retornar sangue venoso da metade superior do corpo ao coracao.',
    localizacao: 'Mediastino superior, anterior a traqueia.',
    irrigacao: 'Vasa vasorum.',
    inervacao: 'Plexo simpatico.',
    patologias: ['Sindrome da Veia Cava Superior', 'Trombose'],
    componentes: [
      { nome: 'Veia Cava Superior', descricao: 'Tronco principal da VCS', imagem: `${D}/veia-cava-superior.png` },
      { nome: 'Veias Braquiocefalicas', descricao: 'Formam a VCS por confluencia', imagem: `${D}/veias-braquiocefalicas.png` },
    ],
    curiosidade: 'A sindrome da VCS pode ser causada por tumores mediastinais.',
  },
  {
    id: 'veia-cava-inferior', nome: 'Veia Cava Inferior', nomeLatim: 'Vena cava inferior', imagem: '/atlas-organs/veia-cava-inferior.png', sistema: 'cardiovascular',
    descricao: 'Maior veia do corpo, drena sangue da metade inferior do corpo para o atrio direito.',
    funcao: 'Retornar sangue venoso da metade inferior do corpo ao coracao.',
    localizacao: 'Retroperitoneal, a direita da aorta abdominal.',
    irrigacao: 'Vasa vasorum.',
    inervacao: 'Plexo simpatico.',
    patologias: ['Trombose da VCI', 'Sindrome de Budd-Chiari'],
    componentes: [
      { nome: 'Veia Cava Inferior', descricao: 'Tronco principal da VCI', imagem: `${D}/veia-cava-inferior.png` },
      { nome: 'Veias Iliacas Comuns', descricao: 'Formam a VCI por confluencia', imagem: `${D}/veias-iliacas-comuns.png` },
    ],
    curiosidade: 'A VCI nao possui valvulas em grande parte de seu trajeto.',
  },
  {
    id: 'arterias-coronarias', nome: 'Arterias Coronarias', nomeLatim: 'Arteriae coronariae', imagem: '/atlas-organs/arterias-coronarias.png', sistema: 'cardiovascular',
    descricao: 'Vasos que irrigam o miocardio, originam-se dos seios aorticos.',
    funcao: 'Fornecer sangue oxigenado ao musculo cardiaco.',
    localizacao: 'Superficie do coracao, nos sulcos coronarios.',
    irrigacao: 'Auto-irrigacao do miocardio.',
    inervacao: 'Plexo cardiaco.',
    patologias: ['Doenca Arterial Coronariana', 'Angina', 'Infarto do Miocardio'],
    componentes: [
      { nome: 'Arterias Coronarias (Visao Geral)', descricao: 'Visao completa das coronarias', imagem: `${D}/arterias-coronarias.png` },
      { nome: 'Arteria Coronaria Direita', descricao: 'Irriga VD e parede inferior do VE', imagem: `${D}/arteria-coronaria-direita.png` },
      { nome: 'Arteria Coronaria Esquerda', descricao: 'Tronco que se divide em DA e Cx', imagem: `${D}/arteria-coronaria-esquerda.png` },
      { nome: 'Ramo Interventricular Anterior (DA)', descricao: 'Irriga parede anterior do VE e septo', imagem: `${D}/ramo-interventricular-anterior-descendente-anterior.png` },
      { nome: 'Ramo Circunflexo', descricao: 'Irriga parede lateral do VE', imagem: `${D}/ramo-circunflexo.png` },
    ],
    curiosidade: 'A obstrucao da DA e conhecida como "arteria da viuva" por sua alta mortalidade.',
  },
  // ═══════════════════ RESPIRATORIO ═══════════════════
  {
    id: 'pulmoes', nome: 'Pulmoes', nomeLatim: 'Pulmones', imagem: '/atlas-organs/pulmoes.png', sistema: 'respiratorio',
    descricao: 'Orgaos esponjosos responsaveis pelas trocas gasosas. Direito: 3 lobos. Esquerdo: 2 lobos.',
    funcao: 'Realizar trocas gasosas (O2 e CO2) nos alveolos pulmonares.',
    localizacao: 'Cavidade toracica, lateralmente ao mediastino.',
    irrigacao: 'Arterias pulmonares (funcional) e bronquicas (nutritiva).',
    inervacao: 'Plexo pulmonar (simpatico e parassimpatico via nervo vago).',
    patologias: ['Pneumonia', 'DPOC', 'Asma', 'Embolia Pulmonar', 'Cancer de Pulmao'],
    componentes: [
      { nome: 'Pulmao Direito', descricao: '3 lobos (superior, medio, inferior)', imagem: `${D}/pulmao-direito-vista-externa-com-lobos.png` },
      { nome: 'Pulmao Esquerdo', descricao: '2 lobos (superior, inferior)', imagem: `${D}/pulmao-esquerdo-vista-externa-com-lobos.png` },
      { nome: 'Bronquios Principais', descricao: 'Entradas dos pulmoes', imagem: `${D}/bronquios-principais.png` },
      { nome: 'Bronquios Lobares', descricao: 'Ramificacoes para cada lobo', imagem: `${D}/bronquios-lobares.png` },
      { nome: 'Alveolos', descricao: 'Unidades funcionais de troca gasosa', imagem: `${D}/alveolos.png` },
    ],
    curiosidade: 'Os pulmoes possuem cerca de 300 milhoes de alveolos com area total de ~70m2.',
  },
  {
    id: 'traqueia', nome: 'Traqueia', nomeLatim: 'Trachea', imagem: '/atlas-organs/traqueia.png', sistema: 'respiratorio',
    descricao: 'Tubo cartilaginoso que conduz ar da laringe aos bronquios.',
    funcao: 'Conduzir ar entre a laringe e os bronquios, filtrar e aquecer o ar.',
    localizacao: 'Regiao cervical anterior, da laringe ate a carina (T4-T5).',
    irrigacao: 'Arterias tireoideas inferiores.',
    inervacao: 'Nervo laringeo recorrente e nervo vago.',
    patologias: ['Traqueite', 'Estenose Traqueal', 'Traqueomalacia'],
    componentes: [
      { nome: 'Traqueia (Tubo Completo)', descricao: 'Visao geral do tubo traqueal', imagem: `${D}/traqueia-tubo-completo.png` },
      { nome: 'Aneis Traqueais', descricao: '16-20 aneis cartilaginosos em C', imagem: `${D}/aneis-traqueais.png` },
      { nome: 'Carina', descricao: 'Bifurcacao em bronquios principais', imagem: `${D}/carina.png` },
    ],
    curiosidade: 'A traqueia tem cerca de 10-12 cm de comprimento e 2,5 cm de diametro.',
  },
  {
    id: 'laringe', nome: 'Laringe', nomeLatim: 'Larynx', imagem: '/atlas-organs/laringe.png', sistema: 'respiratorio',
    descricao: 'Orgao da fonacao que conecta a faringe a traqueia.',
    funcao: 'Producao de voz, protecao das vias aereas durante a degluticao.',
    localizacao: 'Regiao cervical anterior, nivel C3-C6.',
    irrigacao: 'Arterias laringeas superior e inferior.',
    inervacao: 'Nervos laringeos superior e recorrente (ramos do vago).',
    patologias: ['Laringite', 'Nodulos Vocais', 'Cancer de Laringe', 'Paralisia de Cordas Vocais'],
    componentes: [
      { nome: 'Cartilagem Tireoide', descricao: 'Pomo de Adao, maior cartilagem' },
      { nome: 'Cartilagem Cricoide', descricao: 'Anel inferior completo' },
      { nome: 'Epiglote', descricao: 'Aba que protege a via aerea' },
      { nome: 'Cordas Vocais', descricao: 'Pregas vocais verdadeiras' },
    ],
    curiosidade: 'As cordas vocais vibram entre 100-300 Hz durante a fonacao.',
  },
  {
    id: 'diafragma', nome: 'Diafragma', nomeLatim: 'Diaphragma', imagem: '/atlas-organs/diafragma.png', sistema: 'respiratorio',
    descricao: 'Principal musculo da respiracao, separa torax do abdomen.',
    funcao: 'Contracao para inspiracao, relaxamento para expiracao.',
    localizacao: 'Limite entre cavidades toracica e abdominal.',
    irrigacao: 'Arterias frenicas superior e inferior.',
    inervacao: 'Nervo frenico (C3-C5).',
    patologias: ['Hernia Diafragmatica', 'Paralisia Diafragmatica', 'Hernia de Hiato'],
    componentes: [
      { nome: 'Cupula Direita', descricao: 'Mais elevada (figado abaixo)' },
      { nome: 'Cupula Esquerda', descricao: 'Ligeiramente mais baixa' },
      { nome: 'Hiato Esofagico', descricao: 'Passagem do esofago' },
      { nome: 'Hiato Aortico', descricao: 'Passagem da aorta' },
    ],
    curiosidade: 'O soluco e uma contracao involuntaria e espamodica do diafragma.',
  },
  // ═══════════════════ NERVOSO ═══════════════════
  {
    id: 'cerebro', nome: 'Cerebro', nomeLatim: 'Cerebrum', imagem: '/atlas-organs/cerebro.png', sistema: 'nervoso',
    descricao: 'Centro de controle do sistema nervoso com funcoes cognitivas, sensoriais e motoras.',
    funcao: 'Processamento sensorial, controle motor, funcoes cognitivas superiores.',
    localizacao: 'Cavidade craniana, protegido pelas meninges.',
    irrigacao: 'Arterias carotidas internas e vertebrais (Poligono de Willis).',
    inervacao: 'Nervos cranianos (I-XII).',
    patologias: ['AVC', 'Tumores Cerebrais', 'Epilepsia', 'Alzheimer', 'Parkinson'],
    componentes: [
      { nome: 'Cerebro (Vista Externa)', descricao: 'Visao geral dos hemisferios cerebrais', imagem: `${D}/cerebro-vista-externa.png` },
      { nome: 'Cortex Cerebral', descricao: 'Camada externa de substancia cinzenta', imagem: `${D}/cortex-cerebral.png` },
      { nome: 'Lobo Frontal', descricao: 'Funcoes executivas, personalidade, area motora', imagem: `${D}/lobo-frontal.png` },
      { nome: 'Lobo Parietal', descricao: 'Sensibilidade, orientacao espacial', imagem: `${D}/lobo-parietal.png` },
      { nome: 'Lobo Temporal', descricao: 'Audicao, memoria, linguagem', imagem: `${D}/lobo-temporal.png` },
      { nome: 'Lobo Occipital', descricao: 'Processamento visual', imagem: `${D}/lobo-occipital.png` },
      { nome: 'Corpo Caloso', descricao: 'Conexao entre hemisferios', imagem: `${D}/corpo-caloso.png` },
      { nome: 'Talamo', descricao: 'Centro de retransmissao sensorial', imagem: `${D}/talamo.png` },
      { nome: 'Hipotalamo', descricao: 'Controle de funcoes vitais e hormonais', imagem: `${D}/hipotalamo.png` },
      { nome: 'Ganglios da Base', descricao: 'Controle motor extrapiramidal', imagem: `${D}/ganglios-da-base.png` },
    ],
    curiosidade: 'O cerebro consome 20% do oxigenio corporal apesar de representar apenas 2% do peso.',
  },
  {
    id: 'cerebelo', nome: 'Cerebelo', nomeLatim: 'Cerebellum', imagem: '/atlas-organs/cerebelo.png', sistema: 'nervoso',
    descricao: 'Estrutura posterior do encefalo responsavel pela coordenacao motora e equilibrio.',
    funcao: 'Coordenacao de movimentos, equilibrio, tono muscular.',
    localizacao: 'Fossa craniana posterior, abaixo do cerebro.',
    irrigacao: 'Arterias cerebelares (superior, inferior anterior e posterior).',
    inervacao: 'Pedunculos cerebelares (superior, medio, inferior).',
    patologias: ['Ataxia Cerebelar', 'Tumores do Cerebelo', 'Sindrome Vertiginosa'],
    componentes: [
      { nome: 'Cerebelo (Vista Completa)', descricao: 'Visao geral do cerebelo', imagem: `${D}/cerebelo-vista-completa.png` },
      { nome: 'Hemisferios Cerebelares', descricao: 'Partes laterais, coordenacao fina', imagem: `${D}/hemisferios-cerebelares.png` },
      { nome: 'Verme Cerebelar', descricao: 'Parte central, equilibrio e postura', imagem: `${D}/verme-cerebelar.png` },
    ],
    curiosidade: 'O cerebelo contem mais de 50% dos neuronios do encefalo.',
  },
  {
    id: 'tronco-encefalico', nome: 'Tronco Encefalico', nomeLatim: 'Truncus encephalicus', imagem: '/atlas-organs/tronco-encefalico.png', sistema: 'nervoso',
    descricao: 'Estrutura que conecta o cerebro a medula espinhal, controla funcoes vitais.',
    funcao: 'Controle de funcoes vitais (respiracao, FC, PA), passagem de vias nervosas.',
    localizacao: 'Base do encefalo, anterior ao cerebelo.',
    irrigacao: 'Arteria basilar e ramos.',
    inervacao: 'Origem dos nervos cranianos III-XII.',
    patologias: ['AVC de Tronco', 'Tumores do Tronco', 'Morte Encefalica'],
    componentes: [
      { nome: 'Tronco Encefalico (Completo)', descricao: 'Visao geral do tronco encefalico', imagem: `${D}/tronco-encefalico-completo.png` },
      { nome: 'Mesencefalo', descricao: 'Parte superior, reflexos visuais e auditivos', imagem: `${D}/mesencefalo.png` },
      { nome: 'Ponte', descricao: 'Parte media, conexao cerebro-cerebelo', imagem: `${D}/ponte.png` },
      { nome: 'Bulbo (Medula Oblonga)', descricao: 'Parte inferior, centros vitais', imagem: `${D}/bulbo.png` },
    ],
    curiosidade: 'A morte encefalica e definida pela ausencia de funcao do tronco encefalico.',
  },
  {
    id: 'medula-espinhal', nome: 'Medula Espinhal', nomeLatim: 'Medulla spinalis', imagem: '/atlas-organs/medula-espinhal.png', sistema: 'nervoso',
    descricao: 'Estrutura nervosa cilindrica dentro do canal vertebral que transmite impulsos nervosos.',
    funcao: 'Conducao de impulsos nervosos, arcos reflexos.',
    localizacao: 'Canal vertebral, de C1 ate L1-L2 (cone medular).',
    irrigacao: 'Arteria espinhal anterior e posteriores.',
    inervacao: '31 pares de nervos espinhais.',
    patologias: ['Lesao Medular', 'Mielite Transversa', 'Siringomielia'],
    componentes: [
      { nome: 'Medula Espinhal (Segmento)', descricao: 'Segmento com nervos espinhais', imagem: `${D}/medula-espinhal-segmento-com-nervos-espinhais.png` },
      { nome: 'Substancia Cinzenta', descricao: 'Forma de H, corpos neuronais', imagem: `${D}/substancia-cinzenta-em-forma-de-h.png` },
      { nome: 'Substancia Branca', descricao: 'Tratos ascendentes e descendentes', imagem: `${D}/substancia-branca.png` },
    ],
    curiosidade: 'A medula espinhal tem apenas 45 cm de comprimento e 1 cm de diametro.',
  },
  {
    id: 'nervo-optico', nome: 'Nervo Optico', nomeLatim: 'Nervus opticus', imagem: '/atlas-organs/nervo-optico.png', sistema: 'nervoso',
    descricao: 'II par craniano que transmite informacoes visuais da retina ao cerebro.',
    funcao: 'Transmitir impulsos visuais da retina ao cortex visual occipital.',
    localizacao: 'Da retina ao quiasma optico, passando pelo canal optico.',
    irrigacao: 'Arteria oftalmica.',
    inervacao: 'Fibras aferentes visuais.',
    patologias: ['Neurite Optica', 'Papiledema', 'Atrofia Optica', 'Glaucoma'],
    componentes: [
      { nome: 'Nervo Optico (Trajeto)', descricao: 'Trajeto do olho ao cerebro', imagem: `${D}/nervo-optico-trajeto-do-olho-ao-cerebro.png` },
      { nome: 'Quiasma Optico', descricao: 'Cruzamento parcial das fibras' },
    ],
    curiosidade: 'O nervo optico contem cerca de 1,2 milhao de fibras nervosas.',
  },
  // ═══════════════════ DIGESTORIO ═══════════════════
  {
    id: 'estomago', nome: 'Estomago', nomeLatim: 'Gaster', imagem: '/atlas-organs/estomago.png', sistema: 'digestorio',
    descricao: 'Orgao muscular oco em forma de J que armazena e digere alimentos.',
    funcao: 'Armazenamento, digestao mecanica e quimica dos alimentos.',
    localizacao: 'Epigastrio e hipocondrio esquerdo.',
    irrigacao: 'Arterias gastricas e gastroepiploicas.',
    inervacao: 'Nervo vago e plexo celiaco.',
    patologias: ['Gastrite', 'Ulcera Peptica', 'Cancer Gastrico', 'DRGE'],
    componentes: [
      { nome: 'Estomago (Vista Externa)', descricao: 'Visao geral externa do estomago', imagem: `${D}/estomago-vista-externa.png` },
      { nome: 'Corte Sagital do Estomago', descricao: 'Secao revelando camadas internas', imagem: `${D}/corte-sagital-do-estomago-revelando-camadas.png` },
      { nome: 'Esofago (Parte Inferior)', descricao: 'Juncao esofago-gastrica', imagem: `${D}/esofago-parte-inferior.png` },
      { nome: 'Piloro', descricao: 'Valvula de saida para o duodeno', imagem: `${D}/piloro-valvula-de-saida-do-estomago.png` },
    ],
    curiosidade: 'O estomago produz cerca de 2-3 litros de suco gastrico por dia.',
  },
  {
    id: 'intestino-delgado', nome: 'Intestino Delgado', nomeLatim: 'Intestinum tenue', imagem: '/atlas-organs/intestino-delgado.png', sistema: 'digestorio',
    descricao: 'Porcao do TGI onde ocorre a maior parte da digestao e absorcao de nutrientes.',
    funcao: 'Digestao final e absorcao de nutrientes, agua e eletrolitos.',
    localizacao: 'Cavidade abdominal, entre estomago e ceco.',
    irrigacao: 'Arteria mesenterica superior.',
    inervacao: 'Plexo mesenterica e nervo vago.',
    patologias: ['Doenca de Crohn', 'Doenca Celiaca', 'Obstrucao Intestinal'],
    componentes: [
      { nome: 'Intestino Delgado (Completo)', descricao: 'Duodeno, jejuno e ileo', imagem: `${D}/intestino-delgado-duodeno-jejuno-ileo.png` },
      { nome: 'Vilosidades Intestinais', descricao: 'Representacao microscopica das vilosidades', imagem: `${D}/vilosidades-intestinais.png` },
    ],
    curiosidade: 'O intestino delgado tem area de absorcao de ~200 m2 gracas as vilosidades.',
  },
  {
    id: 'intestino-grosso', nome: 'Intestino Grosso', nomeLatim: 'Intestinum crassum', imagem: '/atlas-organs/intestino-grosso.png', sistema: 'digestorio',
    descricao: 'Porcao final do TGI responsavel pela absorcao de agua e formacao das fezes.',
    funcao: 'Absorcao de agua e eletrolitos, formacao e armazenamento de fezes.',
    localizacao: 'Cavidade abdominal, emoldurando o intestino delgado.',
    irrigacao: 'Arterias mesentericas superior e inferior.',
    inervacao: 'Plexo mesenterica, nervos esplancnicos.',
    patologias: ['Retocolite Ulcerativa', 'Cancer Colorretal', 'Diverticulite', 'Polipos'],
    componentes: [
      { nome: 'Intestino Grosso (Completo)', descricao: 'Colon ascendente, transverso, descendente e sigmoide', imagem: `${D}/intestino-grosso-colon-ascendente-transverso-descendente-sigmoide.png` },
      { nome: 'Reto e Anus', descricao: 'Porcao final do trato digestorio', imagem: `${D}/reto-e-anus.png` },
    ],
    curiosidade: 'O intestino grosso abriga trilhoes de bacterias que formam a microbiota intestinal.',
  },
  {
    id: 'figado', nome: 'Figado', nomeLatim: 'Hepar', imagem: '/atlas-organs/figado.png', sistema: 'digestorio',
    descricao: 'Maior glandula do corpo, essencial para metabolismo, detoxificacao e producao de bile.',
    funcao: 'Metabolismo, producao de bile, detoxificacao, sintese de proteinas plasmaticas.',
    localizacao: 'Hipocondrio direito e epigastrio.',
    irrigacao: 'Arteria hepatica propria (30%) e veia porta (70%).',
    inervacao: 'Plexo hepatico.',
    patologias: ['Hepatite', 'Cirrose', 'Esteatose', 'Carcinoma Hepatocelular'],
    componentes: [
      { nome: 'Figado (Vista Externa)', descricao: 'Visao geral com lobos', imagem: `${D}/figado-vista-externa-com-lobos.png` },
      { nome: 'Lobulo Hepatico', descricao: 'Representacao microscopica do lobulo', imagem: `${D}/lobulo-hepatico-representacao-microscopica.png` },
    ],
    curiosidade: 'O figado tem capacidade regenerativa: pode se recuperar com apenas 25% do tecido original.',
  },
  {
    id: 'pancreas', nome: 'Pancreas', nomeLatim: 'Pancreas', imagem: '/atlas-organs/pancreas.png', sistema: 'digestorio',
    descricao: 'Glandula mista (exocrina e endocrina) que produz enzimas digestivas e hormonios.',
    funcao: 'Producao de insulina, glucagon (endocrina) e enzimas digestivas (exocrina).',
    localizacao: 'Retroperitoneal, posterior ao estomago.',
    irrigacao: 'Arterias pancreaticoduodenais e esplenica.',
    inervacao: 'Plexo celiaco e nervo vago.',
    patologias: ['Diabetes Mellitus', 'Pancreatite', 'Cancer de Pancreas'],
    componentes: [
      { nome: 'Pancreas (Cabeca, Corpo, Cauda)', descricao: 'Visao geral das 3 porcoes', imagem: `${D}/pancreas-cabeca-corpo-cauda.png` },
      { nome: 'Ducto Pancreatico Principal', descricao: 'Drena secrecoes para o duodeno', imagem: `${D}/ducto-pancreatico-principal.png` },
    ],
    curiosidade: 'As ilhotas de Langerhans representam apenas 1-2% da massa pancreatica.',
  },
  {
    id: 'vesicula-biliar', nome: 'Vesicula Biliar', nomeLatim: 'Vesica biliaris', imagem: '/atlas-organs/vesicula-biliar.png', sistema: 'digestorio',
    descricao: 'Orgao piriforme que armazena e concentra a bile produzida pelo figado.',
    funcao: 'Armazenar, concentrar e liberar bile para digestao de gorduras.',
    localizacao: 'Fossa da vesicula biliar, face visceral do figado.',
    irrigacao: 'Arteria cistica (ramo da hepatica direita).',
    inervacao: 'Plexo celiaco e nervo vago.',
    patologias: ['Colelitiase', 'Colecistite', 'Coledocolitiase'],
    componentes: [
      { nome: 'Vesicula Biliar (Vista Externa)', descricao: 'Visao geral da vesicula', imagem: `${D}/vesicula-biliar-vista-externa.png` },
      { nome: 'Ducto Cistico e Ducto Coledoco', descricao: 'Vias biliares extra-hepaticas', imagem: `${D}/ducto-cistico-e-ducto-coledoco.png` },
    ],
    curiosidade: 'A vesicula biliar armazena 30-50 mL de bile concentrada.',
  },
  // ═══════════════════ URINARIO ═══════════════════
  {
    id: 'rins', nome: 'Rins', nomeLatim: 'Renes', imagem: '/atlas-organs/rins.png', sistema: 'urinario',
    descricao: 'Orgaos pares em forma de feijao responsaveis pela filtracao do sangue.',
    funcao: 'Filtracao glomerular, regulacao hidroeletrolitica, producao de eritropoietina.',
    localizacao: 'Retroperitoneal, entre T12-L3.',
    irrigacao: 'Arterias renais (ramos da aorta abdominal).',
    inervacao: 'Plexo renal (simpatico T10-L1).',
    patologias: ['Insuficiencia Renal', 'Glomerulonefrite', 'Nefrolitiase', 'Pielonefrite'],
    componentes: [
      { nome: 'Rim (Vista Externa)', descricao: 'Visao geral externa do rim', imagem: `${D}/rim-vista-externa.png` },
      { nome: 'Corte Sagital do Rim', descricao: 'Cortex, medula e pelve renal', imagem: `${D}/corte-sagital-do-rim-cortex-medula-pelve-renal.png` },
      { nome: 'Nefron', descricao: 'Unidade funcional microscopica', imagem: `${D}/nefron-representacao-microscopica.png` },
    ],
    curiosidade: 'Os rins filtram cerca de 180 litros de sangue por dia, produzindo 1-2L de urina.',
  },
  {
    id: 'bexiga-urinaria', nome: 'Bexiga Urinaria', nomeLatim: 'Vesica urinaria', imagem: '/atlas-organs/bexiga-urinaria.png', sistema: 'urinario',
    descricao: 'Orgao muscular oco que armazena urina ate a miccao.',
    funcao: 'Armazenamento de urina e contracao para miccao.',
    localizacao: 'Pelve, posterior a sinfise pubica.',
    irrigacao: 'Arterias vesicais superior e inferior.',
    inervacao: 'Plexo vesical (parassimpatico S2-S4).',
    patologias: ['Cistite', 'Incontinencia Urinaria', 'Cancer de Bexiga'],
    componentes: [
      { nome: 'Bexiga (Vista Externa)', descricao: 'Visao geral da bexiga', imagem: `${D}/bexiga-urinaria-vista-externa.png` },
      { nome: 'Corte da Bexiga', descricao: 'Musculo detrusor e trigono vesical', imagem: `${D}/corte-da-bexiga-musculo-detrusor-trigono.png` },
    ],
    curiosidade: 'A bexiga pode armazenar ate 500 mL, mas a vontade de urinar surge com 200-300 mL.',
  },
  {
    id: 'ureteres', nome: 'Ureteres', nomeLatim: 'Ureteres', imagem: '/atlas-organs/ureteres.png', sistema: 'urinario',
    descricao: 'Tubos musculares que conduzem urina dos rins a bexiga por peristaltismo.',
    funcao: 'Transportar urina dos rins ate a bexiga urinaria.',
    localizacao: 'Retroperitoneal, da pelve renal ate a bexiga.',
    irrigacao: 'Arterias renais, gonadais e vesicais.',
    inervacao: 'Plexo renal e hipogastrico.',
    patologias: ['Calculo Ureteral', 'Estenose Ureteral', 'Refluxo Vesicoureteral'],
    componentes: [
      { nome: 'Ureteres (Trajeto Completo)', descricao: 'Trajeto dos rins a bexiga', imagem: `${D}/ureteres-trajeto-completo.png` },
    ],
    curiosidade: 'Cada ureter tem cerca de 25-30 cm e 3-4 mm de diametro.',
  },
  // ═══════════════════ ENDOCRINO ═══════════════════
  {
    id: 'tireoide', nome: 'Tireoide', nomeLatim: 'Glandula thyroidea', imagem: '/atlas-organs/tireoide.png', sistema: 'endocrino',
    descricao: 'Glandula endocrina em forma de borboleta que regula o metabolismo.',
    funcao: 'Producao de T3, T4 e calcitonina para regulacao metabolica.',
    localizacao: 'Regiao cervical anterior, abaixo da cartilagem tireoide.',
    irrigacao: 'Arterias tireoideas superior e inferior.',
    inervacao: 'Nervos laringeos recorrentes e superiores.',
    patologias: ['Hipotireoidismo', 'Hipertireoidismo', 'Bocio', 'Cancer de Tireoide'],
    componentes: [
      { nome: 'Tireoide (Lobos e Istmo)', descricao: 'Lobos direito, esquerdo e istmo', imagem: `${D}/tireoide-lobos-direito-e-esquerdo-istmo.png` },
      { nome: 'Glandulas Paratireoides', descricao: 'Posterior a tireoide, regulam calcio', imagem: `${D}/glandulas-paratireoides-posterior-a-tireoide.png` },
    ],
    curiosidade: 'A tireoide e a maior glandula endocrina do corpo humano.',
  },
  {
    id: 'glandulas-adrenais', nome: 'Glandulas Adrenais', nomeLatim: 'Glandulae suprarenales', imagem: '/atlas-organs/glandulas-adrenais.png', sistema: 'endocrino',
    descricao: 'Glandulas endocrinas situadas sobre os rins que produzem hormonios vitais.',
    funcao: 'Producao de cortisol, aldosterona, adrenalina e noradrenalina.',
    localizacao: 'Polo superior de cada rim, retroperitoneal.',
    irrigacao: 'Arterias suprarrenais (superior, media, inferior).',
    inervacao: 'Nervos esplancnicos (simpatico).',
    patologias: ['Sindrome de Cushing', 'Doenca de Addison', 'Feocromocitoma', 'Hiperaldosteronismo'],
    componentes: [
      { nome: 'Glandula Adrenal (Cortex e Medula)', descricao: 'Cortex com 3 zonas e medula', imagem: `${D}/glandula-adrenal-cortex-e-medula.png` },
    ],
    curiosidade: 'A medula adrenal e derivada da crista neural (tecido nervoso).',
  },
  {
    id: 'hipofise', nome: 'Hipofise', nomeLatim: 'Hypophysis', imagem: '/atlas-organs/hipofise.png', sistema: 'endocrino',
    descricao: 'Glandula mestra do sistema endocrino, controla outras glandulas.',
    funcao: 'Producao de GH, TSH, ACTH, FSH, LH, prolactina, ADH, ocitocina.',
    localizacao: 'Sela turcica do osso esfenoide, base do cerebro.',
    irrigacao: 'Arterias hipofisarias superior e inferior.',
    inervacao: 'Eixo hipotalamo-hipofisario.',
    patologias: ['Adenoma Hipofisario', 'Hipopituitarismo', 'Diabetes Insipidus', 'Acromegalia'],
    componentes: [
      { nome: 'Hipofise (Adeno e Neuro)', descricao: 'Adenoipofise e neuroipofise', imagem: `${D}/hipofise-adenoipofise-e-neuroipofise.png` },
    ],
    curiosidade: 'A hipofise tem o tamanho de uma ervilha (1 cm) mas controla todo o sistema endocrino.',
  },
  // ═══════════════════ MUSCULOESQUELETICO ═══════════════════
  {
    id: 'cranio', nome: 'Cranio', nomeLatim: 'Cranium', imagem: '/atlas-organs/cranio.png', sistema: 'musculoesqueletico',
    descricao: 'Estrutura ossea que protege o encefalo e abriga orgaos dos sentidos.',
    funcao: 'Protecao do encefalo, suporte para face e orgaos sensoriais.',
    localizacao: 'Extremidade superior do esqueleto axial.',
    irrigacao: 'Arterias meningeas (media e anterior).',
    inervacao: 'Nervos cranianos e ramos do trigemeo.',
    patologias: ['Fraturas Cranianas', 'Hematoma Epidural', 'Hematoma Subdural'],
    componentes: [
      { nome: 'Cranio (Visao Geral)', descricao: 'Vista frontal e lateral', imagem: `${D}/cranio.png` },
      { nome: 'Ossos do Cranio', descricao: 'Frontal, parietal, temporal, occipital', imagem: `${D}/ossos-do-cranio-frontal-parietal-temporal-occipital.png` },
    ],
    curiosidade: 'O cranio e formado por 22 ossos, sendo 8 do neurocranio e 14 do viscerocranio.',
  },
  {
    id: 'coluna-vertebral', nome: 'Coluna Vertebral', nomeLatim: 'Columna vertebralis', imagem: '/atlas-organs/coluna-vertebral.png', sistema: 'musculoesqueletico',
    descricao: 'Eixo osseo do corpo composto por 33 vertebras articuladas.',
    funcao: 'Sustentacao, protecao da medula espinhal, movimento do tronco.',
    localizacao: 'Regiao posterior do tronco, do cranio ao coccix.',
    irrigacao: 'Arterias vertebrais e segmentares.',
    inervacao: '31 pares de nervos espinhais.',
    patologias: ['Hernia de Disco', 'Espondilose', 'Escoliose', 'Estenose Espinhal'],
    componentes: [
      { nome: 'Coluna Vertebral (Completa)', descricao: 'Segmentos cervical, toracico, lombar e sacral', imagem: `${D}/coluna-vertebral-segmentos-cervical-toracico-lombar-sacral.png` },
      { nome: 'Vertebra', descricao: 'Corpo, arco e processos vertebrais', imagem: `${D}/vertebra-corpo-arco-processos.png` },
      { nome: 'Disco Intervertebral', descricao: 'Amortecedor entre vertebras', imagem: `${D}/disco-intervertebral.png` },
    ],
    curiosidade: 'A coluna vertebral tem 4 curvaturas que funcionam como molas de amortecimento.',
  },
  {
    id: 'femur', nome: 'Femur', nomeLatim: 'Femur', imagem: '/atlas-organs/femur.png', sistema: 'musculoesqueletico',
    descricao: 'Maior e mais forte osso do corpo humano, localizado na coxa.',
    funcao: 'Sustentacao do peso corporal, locomocao, insercao muscular.',
    localizacao: 'Coxa, entre quadril e joelho.',
    irrigacao: 'Arteria femoral e circunflexas.',
    inervacao: 'Nervo femoral e obturatorio.',
    patologias: ['Fratura de Femur', 'Necrose Avascular da Cabeca', 'Osteoporose'],
    componentes: [
      { nome: 'Femur (Cabeca, Colo, Diafise)', descricao: 'Visao completa do femur', imagem: `${D}/femur-cabeca-colo-diafise.png` },
    ],
    curiosidade: 'O femur pode suportar ate 30 vezes o peso corporal durante atividades de impacto.',
  },
  {
    id: 'musculo-biceps', nome: 'Musculo Biceps Braquial', nomeLatim: 'Musculus biceps brachii', imagem: '/atlas-organs/musculo-biceps.png', sistema: 'musculoesqueletico',
    descricao: 'Musculo do braco com duas cabecas, principal flexor do cotovelo.',
    funcao: 'Flexao do cotovelo, supinacao do antebraco.',
    localizacao: 'Compartimento anterior do braco.',
    irrigacao: 'Arteria braquial.',
    inervacao: 'Nervo musculocutaneo (C5-C6).',
    patologias: ['Tendinite Bicipital', 'Ruptura do Tendao', 'Sindrome de Popeye'],
    componentes: [
      { nome: 'Biceps Braquial (Origem e Insercao)', descricao: 'Cabeca longa, curta, ventre e tendao', imagem: `${D}/musculo-biceps-braquial-origem-e-insercao.png` },
    ],
    curiosidade: 'O biceps e um dos musculos mais conhecidos, mas nao e o principal flexor do cotovelo (e o braquial).',
  },
  // ═══════════════════ REPRODUTOR ═══════════════════
  {
    id: 'utero-ovarios', nome: 'Utero e Ovarios', nomeLatim: 'Uterus et Ovaria', imagem: '/atlas-organs/utero-ovarios.png', sistema: 'reprodutor',
    descricao: 'Orgaos do sistema reprodutor feminino responsaveis pela gestacao e producao de ovulos.',
    funcao: 'Gestacao (utero), producao de ovulos e hormonios (ovarios).',
    localizacao: 'Pelve feminina, entre bexiga e reto.',
    irrigacao: 'Arterias uterinas e ovaricas.',
    inervacao: 'Plexo hipogastrico inferior.',
    patologias: ['Mioma Uterino', 'Endometriose', 'Cancer de Ovario', 'SOP'],
    componentes: [
      { nome: 'Utero (Fundo, Corpo, Colo)', descricao: 'Visao completa do utero', imagem: `${D}/utero-fundo-corpo-colo.png` },
      { nome: 'Ovarios e Tubas Uterinas', descricao: 'Producao de ovulos e captacao', imagem: `${D}/ovarios-e-tubas-uterinas.png` },
    ],
    curiosidade: 'O utero pode expandir de 7 cm para 35 cm durante a gestacao.',
  },
  {
    id: 'testiculos-prostata', nome: 'Testiculos e Prostata', nomeLatim: 'Testes et Prostata', imagem: '/atlas-organs/testiculos-prostata.png', sistema: 'reprodutor',
    descricao: 'Orgaos do sistema reprodutor masculino para producao de espermatozoides e hormonios.',
    funcao: 'Producao de espermatozoides e testosterona (testiculos), secrecao prostatica (prostata).',
    localizacao: 'Testiculos: bolsa escrotal. Prostata: abaixo da bexiga.',
    irrigacao: 'Arterias testiculares e vesicais inferiores.',
    inervacao: 'Plexo testicular e hipogastrico.',
    patologias: ['Cancer de Prostata', 'Hiperplasia Prostatica', 'Cancer de Testiculo', 'Varicocele'],
    componentes: [
      { nome: 'Testiculos e Epididimo', descricao: 'Producao e maturacao de espermatozoides', imagem: `${D}/testiculos-e-epididimo.png` },
      { nome: 'Prostata e Vesiculas Seminais', descricao: 'Secrecao do liquido seminal', imagem: `${D}/prostata-e-vesiculas-seminais.png` },
    ],
    curiosidade: 'A prostata produz cerca de 30% do volume do liquido seminal.',
  },
  // ═══════════════════ SENTIDOS ═══════════════════
  {
    id: 'olho-humano', nome: 'Olho Humano', nomeLatim: 'Oculus humanus', imagem: '/atlas-organs/olho-humano.png', sistema: 'sentidos',
    descricao: 'Orgao sensorial da visao com sistema optico complexo.',
    funcao: 'Captacao de luz, formacao de imagens, percepcao visual.',
    localizacao: 'Orbita craniana.',
    irrigacao: 'Arteria oftalmica.',
    inervacao: 'Nervo optico (II), oculomotor (III), troclear (IV), abducente (VI).',
    patologias: ['Glaucoma', 'Catarata', 'Degeneracao Macular', 'Retinopatia Diabetica'],
    componentes: [
      { nome: 'Olho Humano (Completo)', descricao: 'Cornea, iris, cristalino, retina', imagem: `${D}/olho-humano-cornea-iris-cristalino-retina.png` },
    ],
    curiosidade: 'O olho humano pode distinguir cerca de 10 milhoes de cores diferentes.',
  },
  {
    id: 'orelha-humana', nome: 'Orelha Humana', nomeLatim: 'Auris humana', imagem: '/atlas-organs/orelha-humana.png', sistema: 'sentidos',
    descricao: 'Orgao da audicao e equilibrio com tres porcoes: externa, media e interna.',
    funcao: 'Audicao (captacao e transmissao de ondas sonoras) e equilibrio.',
    localizacao: 'Osso temporal do cranio.',
    irrigacao: 'Arteria labirintica (ramo da basilar).',
    inervacao: 'Nervo vestibulococlear (VIII par craniano).',
    patologias: ['Otite Media', 'Surdez Neurossensorial', 'Vertigem', 'Doenca de Meniere'],
    componentes: [
      { nome: 'Orelha Humana (Completa)', descricao: 'Externa, media e interna', imagem: `${D}/orelha-humana-externa-media-interna.png` },
      { nome: 'Cadeia de Ossiculos', descricao: 'Martelo, bigorna e estribo', imagem: `${D}/cadeia-de-ossiculos-martelo-bigorna-estribo.png` },
      { nome: 'Coclea e Canais Semicirculares', descricao: 'Audicao e equilibrio', imagem: `${D}/coclea-e-canais-semicirculares.png` },
    ],
    curiosidade: 'O estribo e o menor osso do corpo humano, com apenas 3 mm.',
  },
];
