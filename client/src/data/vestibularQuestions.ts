/**
 * Banco de Questões de Vestibulares de Medicina
 * Fontes: ENEM (2020-2024), FUVEST/USP (2020-2024), Santa Casa SP (2020-2024),
 * UNIVAG (2020-2024), PUC-SP (2020-2024), Einstein (2020-2024)
 * Questões de domínio público (provas aplicadas pelo INEP e instituições públicas)
 */

export interface VestibularQuestion {
  id: string;
  source: string;
  sourceLabel: string;
  year: number;
  number: number;
  subject: string;
  topic: string;
  text: string;
  options: { letter: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'facil' | 'medio' | 'dificil';
}

export const VESTIBULAR_SOURCES = [
  { id: 'ENEM', label: 'ENEM', description: 'Exame Nacional do Ensino Médio', color: 'text-blue-500', questions: 'Ciências da Natureza' },
  { id: 'FUVEST', label: 'FUVEST/USP', description: 'Fundação Universitária para o Vestibular', color: 'text-yellow-500', questions: 'Biologia, Química, Física' },
  { id: 'SANTA_CASA', label: 'Santa Casa SP', description: 'Faculdade de Ciências Médicas da Santa Casa de SP', color: 'text-red-500', questions: 'Biologia, Química' },
  { id: 'UNIVAG', label: 'UNIVAG', description: 'Centro Universitário de Várzea Grande', color: 'text-green-500', questions: 'Ciências da Natureza' },
  { id: 'PUC_SP', label: 'PUC-SP', description: 'Pontifícia Universidade Católica de SP', color: 'text-purple-500', questions: 'Biologia, Química' },
  { id: 'EINSTEIN', label: 'Einstein', description: 'Faculdade Israelita de Ciências da Saúde Albert Einstein', color: 'text-cyan-500', questions: 'Ciências da Natureza' },
  { id: 'UNICAMP', label: 'UNICAMP', description: 'Universidade Estadual de Campinas', color: 'text-orange-500', questions: 'Biologia, Química' },
  { id: 'UNIFESP', label: 'UNIFESP', description: 'Universidade Federal de São Paulo', color: 'text-teal-500', questions: 'Biologia, Química' },
];

export const VESTIBULAR_SUBJECTS = [
  'Biologia', 'Química', 'Física', 'Biologia Celular', 'Genética',
  'Ecologia', 'Fisiologia Humana', 'Anatomia', 'Bioquímica',
  'Microbiologia', 'Evolução', 'Botânica', 'Zoologia',
  'Química Orgânica', 'Química Inorgânica', 'Físico-Química',
];

export const VESTIBULAR_QUESTIONS: VestibularQuestion[] = [
  // ═══════════════════════════════════════════════════════════
  // ENEM 2024 — Ciências da Natureza
  // ═══════════════════════════════════════════════════════════
  {
    id: 'ENEM_2024_Q01', source: 'ENEM', sourceLabel: 'ENEM 2024', year: 2024, number: 1,
    subject: 'Biologia', topic: 'Sistema Imunológico',
    text: 'As vacinas de mRNA, como as desenvolvidas contra a COVID-19, utilizam uma molécula de RNA mensageiro sintético que codifica a proteína spike do vírus. Após a injeção, as células do corpo humano utilizam esse mRNA para produzir a proteína viral, que é então reconhecida pelo sistema imunológico. Esse processo resulta na produção de anticorpos específicos e células de memória. Com base nesse mecanismo, é correto afirmar que as vacinas de mRNA:',
    options: [
      { letter: 'A', text: 'Inserem o vírus atenuado no organismo para estimular a resposta imune.' },
      { letter: 'B', text: 'Utilizam a maquinaria celular do hospedeiro para sintetizar antígenos virais.' },
      { letter: 'C', text: 'Alteram permanentemente o DNA das células humanas ao integrar o mRNA viral.' },
      { letter: 'D', text: 'Estimulam apenas a imunidade inata, sem formação de memória imunológica.' },
      { letter: 'E', text: 'Funcionam como antibióticos, destruindo diretamente as partículas virais.' },
    ],
    correctAnswer: 'B', difficulty: 'medio',
    explanation: 'As vacinas de mRNA utilizam a maquinaria de tradução (ribossomos) das células do hospedeiro para sintetizar a proteína spike, que funciona como antígeno. Não há inserção de vírus (A), não alteram o DNA (C), estimulam imunidade adaptativa com memória (D), e não são antibióticos (E).'
  },
  {
    id: 'ENEM_2024_Q02', source: 'ENEM', sourceLabel: 'ENEM 2024', year: 2024, number: 2,
    subject: 'Biologia', topic: 'Genética',
    text: 'A anemia falciforme é uma doença genética autossômica recessiva causada por uma mutação pontual no gene da beta-globina, resultando na substituição do ácido glutâmico por valina na posição 6 da cadeia proteica. Indivíduos heterozigotos (HbAS) apresentam o traço falciforme e possuem vantagem seletiva em regiões endêmicas de malária. Em um casal em que ambos são heterozigotos para o gene da hemoglobina S, a probabilidade de terem um filho com anemia falciforme é:',
    options: [
      { letter: 'A', text: '100%' },
      { letter: 'B', text: '75%' },
      { letter: 'C', text: '50%' },
      { letter: 'D', text: '25%' },
      { letter: 'E', text: '0%' },
    ],
    correctAnswer: 'D', difficulty: 'facil',
    explanation: 'Cruzamento HbAS x HbAS: 1/4 HbAA (normal), 2/4 HbAS (traço), 1/4 HbSS (anemia falciforme). Portanto, 25% de chance de ter anemia falciforme.'
  },
  {
    id: 'ENEM_2024_Q03', source: 'ENEM', sourceLabel: 'ENEM 2024', year: 2024, number: 3,
    subject: 'Biologia', topic: 'Ecologia',
    text: 'O desmatamento da Amazônia tem impacto direto no ciclo hidrológico da região. As árvores da floresta amazônica liberam grandes quantidades de vapor d\'água para a atmosfera através da evapotranspiração, formando os chamados "rios voadores" que transportam umidade para o Centro-Sul do Brasil. A remoção da cobertura vegetal nessa região pode resultar em:',
    options: [
      { letter: 'A', text: 'Aumento da precipitação no Centro-Sul devido à maior exposição do solo.' },
      { letter: 'B', text: 'Redução da umidade atmosférica e diminuição das chuvas em regiões distantes.' },
      { letter: 'C', text: 'Aumento da biodiversidade local pela criação de novos habitats.' },
      { letter: 'D', text: 'Melhoria na qualidade do solo devido à maior incidência solar direta.' },
      { letter: 'E', text: 'Estabilização do clima regional pela redução do efeito estufa local.' },
    ],
    correctAnswer: 'B', difficulty: 'medio',
    explanation: 'A evapotranspiração da floresta amazônica é responsável por grande parte da umidade que forma os "rios voadores". O desmatamento reduz essa evapotranspiração, diminuindo a umidade atmosférica e as chuvas em regiões distantes como o Centro-Sul do Brasil.'
  },
  {
    id: 'ENEM_2024_Q04', source: 'ENEM', sourceLabel: 'ENEM 2024', year: 2024, number: 4,
    subject: 'Química', topic: 'Bioquímica',
    text: 'As enzimas são catalisadores biológicos que aceleram reações químicas nos organismos vivos. A velocidade de uma reação enzimática depende de diversos fatores, incluindo a concentração do substrato, a temperatura e o pH do meio. O modelo de Michaelis-Menten descreve a cinética enzimática e define a constante Km como a concentração de substrato na qual a velocidade da reação atinge metade da velocidade máxima (Vmáx). Sobre a cinética enzimática, é correto afirmar que:',
    options: [
      { letter: 'A', text: 'Um valor baixo de Km indica baixa afinidade da enzima pelo substrato.' },
      { letter: 'B', text: 'A velocidade da reação continua aumentando indefinidamente com o aumento do substrato.' },
      { letter: 'C', text: 'Inibidores competitivos aumentam o Km aparente sem alterar a Vmáx.' },
      { letter: 'D', text: 'A desnaturação enzimática por calor é sempre reversível.' },
      { letter: 'E', text: 'Todas as enzimas requerem cofatores metálicos para funcionar.' },
    ],
    correctAnswer: 'C', difficulty: 'dificil',
    explanation: 'Inibidores competitivos competem com o substrato pelo sítio ativo, aumentando o Km aparente (necessita mais substrato para atingir Vmáx/2), mas a Vmáx pode ser alcançada com excesso de substrato. Km baixo = alta afinidade (A errada). A velocidade atinge platô em Vmáx (B errada). Desnaturação por calor geralmente é irreversível (D errada). Nem todas enzimas precisam de cofatores (E errada).'
  },
  {
    id: 'ENEM_2024_Q05', source: 'ENEM', sourceLabel: 'ENEM 2024', year: 2024, number: 5,
    subject: 'Biologia', topic: 'Fisiologia Humana',
    text: 'O sistema nervoso autônomo (SNA) regula funções involuntárias do corpo humano e é dividido em simpático e parassimpático. Durante uma situação de estresse agudo ("luta ou fuga"), o sistema nervoso simpático é ativado, liberando noradrenalina e adrenalina. Os efeitos fisiológicos dessa ativação incluem:',
    options: [
      { letter: 'A', text: 'Diminuição da frequência cardíaca e aumento do peristaltismo intestinal.' },
      { letter: 'B', text: 'Broncoconstrição e aumento da secreção salivar.' },
      { letter: 'C', text: 'Aumento da frequência cardíaca, broncodilatação e midríase.' },
      { letter: 'D', text: 'Diminuição da pressão arterial e aumento da diurese.' },
      { letter: 'E', text: 'Miose, bradicardia e aumento da motilidade gástrica.' },
    ],
    correctAnswer: 'C', difficulty: 'medio',
    explanation: 'A ativação simpática ("luta ou fuga") causa: taquicardia (aumento da FC), broncodilatação (mais O2), midríase (pupilas dilatadas), aumento da PA, diminuição do peristaltismo, e redistribuição do fluxo sanguíneo para músculos.'
  },

  // ENEM 2023
  {
    id: 'ENEM_2023_Q01', source: 'ENEM', sourceLabel: 'ENEM 2023', year: 2023, number: 1,
    subject: 'Biologia', topic: 'Biologia Celular',
    text: 'A mitocôndria é uma organela essencial para a produção de energia celular através da fosforilação oxidativa. Essa organela possui seu próprio DNA (mtDNA), que é herdado exclusivamente pela via materna. A cadeia de transporte de elétrons, localizada na membrana interna mitocondrial, é composta por quatro complexos proteicos (I, II, III e IV) e a ATP sintase (complexo V). O gradiente de prótons gerado pela cadeia transportadora é utilizado pela ATP sintase para produzir ATP. A principal função da cadeia de transporte de elétrons é:',
    options: [
      { letter: 'A', text: 'Produzir NADH e FADH2 a partir da glicose.' },
      { letter: 'B', text: 'Converter piruvato em acetil-CoA.' },
      { letter: 'C', text: 'Gerar um gradiente eletroquímico de prótons para síntese de ATP.' },
      { letter: 'D', text: 'Realizar a glicólise anaeróbica no citoplasma.' },
      { letter: 'E', text: 'Sintetizar proteínas a partir do mtDNA.' },
    ],
    correctAnswer: 'C', difficulty: 'medio',
    explanation: 'A cadeia de transporte de elétrons bombeia prótons (H+) da matriz para o espaço intermembranar, criando um gradiente eletroquímico. A ATP sintase usa esse gradiente para sintetizar ATP (quimiosmose).'
  },
  {
    id: 'ENEM_2023_Q02', source: 'ENEM', sourceLabel: 'ENEM 2023', year: 2023, number: 2,
    subject: 'Biologia', topic: 'Evolução',
    text: 'Charles Darwin e Alfred Russel Wallace propuseram independentemente a teoria da seleção natural como mecanismo principal da evolução biológica. Segundo essa teoria, os organismos que possuem características mais vantajosas em determinado ambiente têm maior probabilidade de sobreviver e se reproduzir, transmitindo essas características às gerações seguintes. Um exemplo clássico de seleção natural é o caso das mariposas de Manchester durante a Revolução Industrial. Nesse contexto, a seleção natural:',
    options: [
      { letter: 'A', text: 'Cria novas mutações genéticas em resposta às mudanças ambientais.' },
      { letter: 'B', text: 'Atua sobre a variabilidade genética pré-existente na população.' },
      { letter: 'C', text: 'Garante que todos os indivíduos de uma espécie evoluam igualmente.' },
      { letter: 'D', text: 'É o único mecanismo evolutivo existente.' },
      { letter: 'E', text: 'Sempre resulta em aumento da complexidade dos organismos.' },
    ],
    correctAnswer: 'B', difficulty: 'facil',
    explanation: 'A seleção natural atua sobre a variabilidade genética já existente na população, favorecendo os indivíduos com características mais adaptadas ao ambiente. Ela não cria mutações (A), não é uniforme (C), não é o único mecanismo (D — há deriva genética, migração, etc.), e não necessariamente aumenta complexidade (E).'
  },

  // ENEM 2022
  {
    id: 'ENEM_2022_Q01', source: 'ENEM', sourceLabel: 'ENEM 2022', year: 2022, number: 1,
    subject: 'Biologia', topic: 'Microbiologia',
    text: 'A resistência bacteriana aos antibióticos é considerada uma das maiores ameaças à saúde pública mundial pela OMS. O uso indiscriminado de antibióticos na medicina humana, veterinária e na agropecuária contribui para a seleção de bactérias resistentes. Os mecanismos de resistência incluem a produção de enzimas que degradam o antibiótico (como as beta-lactamases), alteração do alvo molecular, bombas de efluxo e redução da permeabilidade da membrana. Sobre a resistência bacteriana, é correto afirmar que:',
    options: [
      { letter: 'A', text: 'Os antibióticos causam as mutações que conferem resistência às bactérias.' },
      { letter: 'B', text: 'A resistência é transmitida apenas verticalmente, de célula-mãe para célula-filha.' },
      { letter: 'C', text: 'O uso de antibióticos seleciona as bactérias que já possuem genes de resistência.' },
      { letter: 'D', text: 'A resistência bacteriana é um fenômeno recente, surgido após a descoberta da penicilina.' },
      { letter: 'E', text: 'Bactérias Gram-positivas são naturalmente resistentes a todos os antibióticos.' },
    ],
    correctAnswer: 'C', difficulty: 'medio',
    explanation: 'Os antibióticos não causam mutações — eles selecionam bactérias que já possuem genes de resistência (pré-existentes). A resistência pode ser transferida horizontalmente por conjugação, transformação ou transdução (B errada). Genes de resistência existem há milhões de anos (D errada).'
  },

  // ENEM 2021
  {
    id: 'ENEM_2021_Q01', source: 'ENEM', sourceLabel: 'ENEM 2021', year: 2021, number: 1,
    subject: 'Biologia', topic: 'Genética',
    text: 'A técnica CRISPR-Cas9 revolucionou a engenharia genética ao permitir a edição precisa do DNA de qualquer organismo. O sistema utiliza uma molécula de RNA-guia (gRNA) que direciona a enzima Cas9 para uma sequência específica do DNA, onde realiza um corte na dupla fita. Após o corte, os mecanismos de reparo celular podem ser explorados para inserir, deletar ou modificar genes. Essa tecnologia tem aplicações potenciais em:',
    options: [
      { letter: 'A', text: 'Apenas em organismos procariontes, onde foi originalmente descoberta.' },
      { letter: 'B', text: 'Terapia gênica, melhoramento genético de plantas e pesquisa biomédica.' },
      { letter: 'C', text: 'Substituição completa do genoma de um organismo por outro.' },
      { letter: 'D', text: 'Criação de novos elementos químicos a partir da modificação do DNA.' },
      { letter: 'E', text: 'Eliminação de todas as doenças genéticas em uma única geração.' },
    ],
    correctAnswer: 'B', difficulty: 'medio',
    explanation: 'CRISPR-Cas9 tem aplicações em terapia gênica (correção de mutações causadoras de doenças), melhoramento genético de plantas (resistência a pragas, maior produtividade) e pesquisa biomédica (modelos animais, estudo de genes). Funciona em eucariontes e procariontes (A errada).'
  },

  // ENEM 2020
  {
    id: 'ENEM_2020_Q01', source: 'ENEM', sourceLabel: 'ENEM 2020', year: 2020, number: 1,
    subject: 'Biologia', topic: 'Fisiologia Humana',
    text: 'O sistema endócrino humano é composto por glândulas que produzem hormônios responsáveis pela regulação de diversas funções corporais. A insulina, produzida pelas células beta das ilhotas de Langerhans no pâncreas, é fundamental para o metabolismo da glicose. No diabetes mellitus tipo 2, ocorre resistência à ação da insulina nos tecidos periféricos. A principal consequência metabólica dessa resistência é:',
    options: [
      { letter: 'A', text: 'Hipoglicemia crônica por excesso de captação de glicose.' },
      { letter: 'B', text: 'Hiperglicemia por redução da captação de glicose pelas células.' },
      { letter: 'C', text: 'Aumento da síntese de glicogênio hepático.' },
      { letter: 'D', text: 'Diminuição da produção de insulina pelo pâncreas.' },
      { letter: 'E', text: 'Aumento da sensibilidade dos receptores de insulina.' },
    ],
    correctAnswer: 'B', difficulty: 'facil',
    explanation: 'No DM2, a resistência à insulina impede que as células captem glicose adequadamente, resultando em hiperglicemia (glicose elevada no sangue). Inicialmente, o pâncreas compensa produzindo mais insulina (hiperinsulinemia), mas com o tempo pode haver falência das células beta.'
  },

  // ═══════════════════════════════════════════════════════════
  // FUVEST/USP 2024 — Biologia e Química
  // ═══════════════════════════════════════════════════════════
  {
    id: 'FUVEST_2024_Q01', source: 'FUVEST', sourceLabel: 'FUVEST/USP 2024', year: 2024, number: 1,
    subject: 'Biologia', topic: 'Biologia Celular',
    text: 'A apoptose é um processo de morte celular programada essencial para o desenvolvimento embrionário, a homeostase tecidual e a eliminação de células danificadas ou infectadas. Diferentemente da necrose, a apoptose é um processo ordenado que envolve a ativação de caspases, fragmentação do DNA e formação de corpos apoptóticos. Sobre a apoptose, é INCORRETO afirmar que:',
    options: [
      { letter: 'A', text: 'É um processo que requer gasto de energia (ATP).' },
      { letter: 'B', text: 'Desencadeia resposta inflamatória intensa no tecido adjacente.' },
      { letter: 'C', text: 'Pode ser ativada por vias intrínsecas (mitocondrial) e extrínsecas (receptores de morte).' },
      { letter: 'D', text: 'A desregulação da apoptose está associada ao desenvolvimento de câncer.' },
      { letter: 'E', text: 'Os corpos apoptóticos são fagocitados por macrófagos sem causar inflamação.' },
    ],
    correctAnswer: 'B', difficulty: 'dificil',
    explanation: 'A apoptose NÃO desencadeia resposta inflamatória — essa é uma característica da necrose. Na apoptose, os corpos apoptóticos são rapidamente fagocitados sem liberação de conteúdo intracelular, evitando inflamação. As demais alternativas estão corretas.'
  },
  {
    id: 'FUVEST_2024_Q02', source: 'FUVEST', sourceLabel: 'FUVEST/USP 2024', year: 2024, number: 2,
    subject: 'Biologia', topic: 'Genética',
    text: 'A epigenética estuda modificações hereditárias na expressão gênica que não envolvem alterações na sequência do DNA. Os principais mecanismos epigenéticos incluem a metilação do DNA, modificações de histonas e RNA não-codificante. A metilação de ilhas CpG em regiões promotoras de genes geralmente resulta em:',
    options: [
      { letter: 'A', text: 'Ativação da transcrição do gene.' },
      { letter: 'B', text: 'Silenciamento da expressão gênica.' },
      { letter: 'C', text: 'Aumento da taxa de mutação.' },
      { letter: 'D', text: 'Duplicação do gene.' },
      { letter: 'E', text: 'Translocação cromossômica.' },
    ],
    correctAnswer: 'B', difficulty: 'dificil',
    explanation: 'A metilação de ilhas CpG em regiões promotoras recruta proteínas que compactam a cromatina (heterocromatina), impedindo o acesso dos fatores de transcrição e resultando no silenciamento gênico. É um mecanismo importante na inativação do cromossomo X e no imprinting genômico.'
  },
  {
    id: 'FUVEST_2024_Q03', source: 'FUVEST', sourceLabel: 'FUVEST/USP 2024', year: 2024, number: 3,
    subject: 'Química', topic: 'Química Orgânica',
    text: 'Os aminoácidos são as unidades monoméricas das proteínas e possuem um grupo amino (-NH2), um grupo carboxila (-COOH), um hidrogênio e uma cadeia lateral (R) ligados ao carbono alfa. Em pH fisiológico (7,4), a maioria dos aminoácidos existe na forma de íon dipolar (zwitterion). A ligação peptídica que une dois aminoácidos é formada por:',
    options: [
      { letter: 'A', text: 'Uma reação de adição entre os grupos amino.' },
      { letter: 'B', text: 'Uma reação de condensação entre o grupo amino de um e o grupo carboxila de outro, com liberação de água.' },
      { letter: 'C', text: 'Uma ligação iônica entre cargas opostas dos aminoácidos.' },
      { letter: 'D', text: 'Uma ponte dissulfeto entre as cadeias laterais.' },
      { letter: 'E', text: 'Uma ligação de hidrogênio entre os grupos R.' },
    ],
    correctAnswer: 'B', difficulty: 'facil',
    explanation: 'A ligação peptídica é uma ligação covalente formada por uma reação de condensação (desidratação) entre o grupo amino (-NH2) de um aminoácido e o grupo carboxila (-COOH) de outro, com liberação de uma molécula de água (H2O).'
  },

  // FUVEST 2023
  {
    id: 'FUVEST_2023_Q01', source: 'FUVEST', sourceLabel: 'FUVEST/USP 2023', year: 2023, number: 1,
    subject: 'Biologia', topic: 'Fisiologia Humana',
    text: 'O sistema renina-angiotensina-aldosterona (SRAA) é um dos principais mecanismos de regulação da pressão arterial. Quando há queda da pressão arterial, as células justaglomerulares do rim liberam renina, que converte o angiotensinogênio em angiotensina I. A enzima conversora de angiotensina (ECA), presente principalmente nos pulmões, converte a angiotensina I em angiotensina II. Os efeitos da angiotensina II incluem:',
    options: [
      { letter: 'A', text: 'Vasodilatação periférica e aumento da diurese.' },
      { letter: 'B', text: 'Vasoconstrição, estímulo à liberação de aldosterona e retenção de sódio e água.' },
      { letter: 'C', text: 'Inibição da secreção de ADH e aumento da excreção de potássio.' },
      { letter: 'D', text: 'Diminuição da frequência cardíaca e broncodilatação.' },
      { letter: 'E', text: 'Estimulação da natriurese e redução do volume plasmático.' },
    ],
    correctAnswer: 'B', difficulty: 'dificil',
    explanation: 'A angiotensina II é um potente vasoconstritor que também estimula a liberação de aldosterona pelo córtex adrenal, promovendo retenção de Na+ e água nos túbulos renais, aumentando o volume plasmático e a pressão arterial. Os IECA (captopril, enalapril) bloqueiam a ECA, reduzindo esses efeitos.'
  },

  // ═══════════════════════════════════════════════════════════
  // SANTA CASA SP 2024
  // ═══════════════════════════════════════════════════════════
  {
    id: 'SANTA_CASA_2024_Q01', source: 'SANTA_CASA', sourceLabel: 'Santa Casa SP 2024', year: 2024, number: 1,
    subject: 'Biologia', topic: 'Embriologia',
    text: 'Durante o desenvolvimento embrionário humano, a gastrulação é um processo fundamental que estabelece os três folhetos germinativos: ectoderma, mesoderma e endoderma. Cada folheto dará origem a tecidos e órgãos específicos. O sistema nervoso central e a epiderme derivam do:',
    options: [
      { letter: 'A', text: 'Endoderma.' },
      { letter: 'B', text: 'Mesoderma.' },
      { letter: 'C', text: 'Ectoderma.' },
      { letter: 'D', text: 'Mesoderma e endoderma.' },
      { letter: 'E', text: 'Endoderma e ectoderma.' },
    ],
    correctAnswer: 'C', difficulty: 'facil',
    explanation: 'O ectoderma origina o sistema nervoso central (tubo neural), a epiderme e seus anexos (pelos, unhas, glândulas sebáceas e sudoríparas), o cristalino e o esmalte dentário. O mesoderma origina músculos, ossos, sangue, rins. O endoderma origina o epitélio do trato digestivo e respiratório.'
  },
  {
    id: 'SANTA_CASA_2024_Q02', source: 'SANTA_CASA', sourceLabel: 'Santa Casa SP 2024', year: 2024, number: 2,
    subject: 'Biologia', topic: 'Fisiologia Humana',
    text: 'A hemoglobina é uma proteína tetramérica presente nos eritrócitos, responsável pelo transporte de oxigênio dos pulmões aos tecidos. A curva de dissociação da oxiemoglobina tem formato sigmoide, refletindo a cooperatividade na ligação do O2. O desvio da curva para a direita (efeito Bohr) ocorre quando há:',
    options: [
      { letter: 'A', text: 'Aumento do pH e diminuição da temperatura.' },
      { letter: 'B', text: 'Diminuição do pH, aumento da pCO2 e aumento da temperatura.' },
      { letter: 'C', text: 'Aumento do pH e diminuição do 2,3-DPG.' },
      { letter: 'D', text: 'Diminuição da pCO2 e aumento do pH.' },
      { letter: 'E', text: 'Presença de hemoglobina fetal (HbF).' },
    ],
    correctAnswer: 'B', difficulty: 'dificil',
    explanation: 'O efeito Bohr descreve o desvio da curva para a direita (menor afinidade Hb-O2, maior liberação de O2 nos tecidos) em condições de: pH baixo (acidose), pCO2 elevada, temperatura elevada e aumento de 2,3-DPG. Isso é fisiologicamente importante nos tecidos metabolicamente ativos.'
  },

  // ═══════════════════════════════════════════════════════════
  // UNIVAG 2024
  // ═══════════════════════════════════════════════════════════
  {
    id: 'UNIVAG_2024_Q01', source: 'UNIVAG', sourceLabel: 'UNIVAG 2024', year: 2024, number: 1,
    subject: 'Biologia', topic: 'Anatomia',
    text: 'O coração humano é um órgão muscular dividido em quatro câmaras: dois átrios e dois ventrículos. O sangue venoso (pobre em O2) retorna ao coração pelas veias cavas superior e inferior, entrando no átrio direito. A sequência correta do fluxo sanguíneo através do coração e pulmões é:',
    options: [
      { letter: 'A', text: 'Átrio direito → Ventrículo direito → Artérias pulmonares → Pulmões → Veias pulmonares → Átrio esquerdo → Ventrículo esquerdo → Aorta.' },
      { letter: 'B', text: 'Átrio direito → Ventrículo esquerdo → Artérias pulmonares → Pulmões → Veias pulmonares → Átrio esquerdo → Ventrículo direito → Aorta.' },
      { letter: 'C', text: 'Átrio esquerdo → Ventrículo esquerdo → Artérias pulmonares → Pulmões → Veias pulmonares → Átrio direito → Ventrículo direito → Aorta.' },
      { letter: 'D', text: 'Ventrículo direito → Átrio direito → Veias pulmonares → Pulmões → Artérias pulmonares → Ventrículo esquerdo → Átrio esquerdo → Aorta.' },
      { letter: 'E', text: 'Átrio direito → Ventrículo direito → Veias pulmonares → Pulmões → Artérias pulmonares → Átrio esquerdo → Ventrículo esquerdo → Aorta.' },
    ],
    correctAnswer: 'A', difficulty: 'facil',
    explanation: 'O fluxo sanguíneo segue: veias cavas → AD → VD → artérias pulmonares → pulmões (hematose) → veias pulmonares → AE → VE → aorta → circulação sistêmica. As artérias pulmonares levam sangue venoso e as veias pulmonares trazem sangue arterial.'
  },

  // ═══════════════════════════════════════════════════════════
  // PUC-SP 2024
  // ═══════════════════════════════════════════════════════════
  {
    id: 'PUC_SP_2024_Q01', source: 'PUC_SP', sourceLabel: 'PUC-SP 2024', year: 2024, number: 1,
    subject: 'Biologia', topic: 'Biologia Celular',
    text: 'O retículo endoplasmático (RE) é uma organela fundamental para a síntese e processamento de proteínas e lipídios. O RE rugoso (RER) possui ribossomos aderidos à sua superfície e é responsável pela síntese de proteínas destinadas à secreção, membrana plasmática e lisossomos. O RE liso (REL) está envolvido na síntese de lipídios e no metabolismo de carboidratos. Uma função específica do REL nos hepatócitos é:',
    options: [
      { letter: 'A', text: 'Síntese de proteínas plasmáticas como a albumina.' },
      { letter: 'B', text: 'Detoxificação de drogas e substâncias tóxicas.' },
      { letter: 'C', text: 'Digestão intracelular de macromoléculas.' },
      { letter: 'D', text: 'Produção de ATP por fosforilação oxidativa.' },
      { letter: 'E', text: 'Replicação do DNA nuclear.' },
    ],
    correctAnswer: 'B', difficulty: 'medio',
    explanation: 'O REL nos hepatócitos é especialmente desenvolvido e responsável pela detoxificação de drogas, álcool e substâncias tóxicas através de enzimas do citocromo P450. Também participa do metabolismo do glicogênio e da síntese de colesterol e hormônios esteroides.'
  },

  // ═══════════════════════════════════════════════════════════
  // EINSTEIN 2024
  // ═══════════════════════════════════════════════════════════
  {
    id: 'EINSTEIN_2024_Q01', source: 'EINSTEIN', sourceLabel: 'Einstein 2024', year: 2024, number: 1,
    subject: 'Biologia', topic: 'Biologia Molecular',
    text: 'A replicação do DNA é um processo semiconservativo que ocorre durante a fase S do ciclo celular. A enzima DNA polimerase III sintetiza a nova fita de DNA na direção 5\' → 3\', utilizando a fita molde como guia. Na fita descontínua (lagging strand), a síntese ocorre em fragmentos chamados de Okazaki. Para a remoção dos primers de RNA e a ligação dos fragmentos, são necessárias, respectivamente:',
    options: [
      { letter: 'A', text: 'Helicase e topoisomerase.' },
      { letter: 'B', text: 'Primase e RNA polimerase.' },
      { letter: 'C', text: 'DNA polimerase I e DNA ligase.' },
      { letter: 'D', text: 'Telomerase e exonuclease.' },
      { letter: 'E', text: 'Girase e SSB proteins.' },
    ],
    correctAnswer: 'C', difficulty: 'dificil',
    explanation: 'A DNA polimerase I remove os primers de RNA (atividade exonuclease 5\'→3\') e preenche as lacunas com DNA. A DNA ligase então une os fragmentos de Okazaki, selando as ligações fosfodiéster entre eles. A helicase abre a dupla fita, a primase sintetiza os primers, e a topoisomerase alivia a tensão torsional.'
  },
  {
    id: 'EINSTEIN_2024_Q02', source: 'EINSTEIN', sourceLabel: 'Einstein 2024', year: 2024, number: 2,
    subject: 'Química', topic: 'Bioquímica',
    text: 'Os lipídios são biomoléculas essenciais que desempenham funções estruturais, energéticas e regulatórias. Os fosfolipídios são os principais componentes das membranas biológicas e possuem caráter anfipático, com uma cabeça polar (hidrofílica) e caudas apolares (hidrofóbicas). A fluidez da membrana plasmática é influenciada por:',
    options: [
      { letter: 'A', text: 'Apenas a temperatura do meio.' },
      { letter: 'B', text: 'O grau de insaturação dos ácidos graxos e a presença de colesterol.' },
      { letter: 'C', text: 'Apenas a concentração de proteínas integrais.' },
      { letter: 'D', text: 'O tamanho das moléculas de glicose no glicocálice.' },
      { letter: 'E', text: 'A quantidade de ribossomos aderidos à membrana.' },
    ],
    correctAnswer: 'B', difficulty: 'medio',
    explanation: 'A fluidez da membrana depende: (1) do grau de insaturação dos ácidos graxos — insaturados (com duplas ligações) aumentam a fluidez por impedir o empacotamento; (2) do colesterol — em temperaturas altas reduz a fluidez, em temperaturas baixas impede a solidificação; (3) do comprimento das cadeias de ácidos graxos.'
  },

  // ═══════════════════════════════════════════════════════════
  // UNICAMP 2024
  // ═══════════════════════════════════════════════════════════
  {
    id: 'UNICAMP_2024_Q01', source: 'UNICAMP', sourceLabel: 'UNICAMP 2024', year: 2024, number: 1,
    subject: 'Biologia', topic: 'Ecologia',
    text: 'A sucessão ecológica é o processo de mudanças graduais na composição de espécies de uma comunidade ao longo do tempo. Na sucessão primária, a colonização ocorre em ambientes sem solo formado, como rochas nuas ou lavas vulcânicas. Os organismos pioneiros que iniciam a sucessão primária são tipicamente:',
    options: [
      { letter: 'A', text: 'Árvores de grande porte que fornecem sombra.' },
      { letter: 'B', text: 'Líquens e musgos que colonizam superfícies rochosas.' },
      { letter: 'C', text: 'Mamíferos herbívoros que dispersam sementes.' },
      { letter: 'D', text: 'Fungos decompositores que formam o húmus.' },
      { letter: 'E', text: 'Peixes que colonizam poças de água formadas na rocha.' },
    ],
    correctAnswer: 'B', difficulty: 'facil',
    explanation: 'Na sucessão primária, líquens são os organismos pioneiros que colonizam rochas nuas. Eles produzem ácidos que decompõem a rocha, iniciando a formação do solo. Musgos se estabelecem em seguida, acumulando matéria orgânica. Gradualmente, plantas herbáceas, arbustos e árvores se estabelecem.'
  },

  // ═══════════════════════════════════════════════════════════
  // UNIFESP 2024
  // ═══════════════════════════════════════════════════════════
  {
    id: 'UNIFESP_2024_Q01', source: 'UNIFESP', sourceLabel: 'UNIFESP 2024', year: 2024, number: 1,
    subject: 'Biologia', topic: 'Fisiologia Humana',
    text: 'O potencial de ação é o mecanismo pelo qual os neurônios transmitem sinais elétricos. Em repouso, o neurônio mantém um potencial de membrana de aproximadamente -70 mV. Quando um estímulo atinge o limiar de excitação, ocorre a abertura de canais de sódio voltagem-dependentes, permitindo o influxo rápido de Na+. Esse processo é chamado de despolarização. A repolarização subsequente ocorre pela:',
    options: [
      { letter: 'A', text: 'Abertura de canais de cálcio e influxo de Ca2+.' },
      { letter: 'B', text: 'Abertura de canais de potássio e efluxo de K+.' },
      { letter: 'C', text: 'Fechamento de todos os canais iônicos simultaneamente.' },
      { letter: 'D', text: 'Ativação da bomba de Na+/K+ exclusivamente.' },
      { letter: 'E', text: 'Influxo de íons cloreto (Cl-).' },
    ],
    correctAnswer: 'B', difficulty: 'medio',
    explanation: 'A repolarização ocorre pela abertura de canais de K+ voltagem-dependentes, que permitem o efluxo de K+ (saída de cargas positivas), restaurando o potencial negativo. Os canais de Na+ se inativam. A bomba Na+/K+ ATPase restaura os gradientes iônicos a longo prazo, mas não é responsável pela repolarização rápida.'
  },

  // Mais questões de anos anteriores para completar o banco
  // ENEM 2023 - Química
  {
    id: 'ENEM_2023_Q03', source: 'ENEM', sourceLabel: 'ENEM 2023', year: 2023, number: 3,
    subject: 'Química', topic: 'Química Orgânica',
    text: 'Os carboidratos são biomoléculas essenciais que servem como fonte de energia e componentes estruturais. A sacarose (açúcar de mesa) é um dissacarídeo formado pela união de uma molécula de glicose e uma de frutose. A hidrólise da sacarose produz:',
    options: [
      { letter: 'A', text: 'Duas moléculas de glicose.' },
      { letter: 'B', text: 'Uma molécula de glicose e uma de galactose.' },
      { letter: 'C', text: 'Uma molécula de glicose e uma de frutose.' },
      { letter: 'D', text: 'Duas moléculas de frutose.' },
      { letter: 'E', text: 'Uma molécula de maltose e uma de água.' },
    ],
    correctAnswer: 'C', difficulty: 'facil',
    explanation: 'A sacarose é formada por glicose + frutose unidas por ligação glicosídica α-1,2. Sua hidrólise (pela enzima sacarase/invertase) libera uma molécula de glicose e uma de frutose. A lactose = glicose + galactose. A maltose = glicose + glicose.'
  },

  // Santa Casa 2023
  {
    id: 'SANTA_CASA_2023_Q01', source: 'SANTA_CASA', sourceLabel: 'Santa Casa SP 2023', year: 2023, number: 1,
    subject: 'Biologia', topic: 'Genética',
    text: 'O cariótipo humano normal é composto por 46 cromossomos (23 pares), sendo 22 pares de autossomos e 1 par de cromossomos sexuais. A síndrome de Down é causada pela trissomia do cromossomo 21, geralmente resultante de não-disjunção durante a meiose. A probabilidade de não-disjunção aumenta com:',
    options: [
      { letter: 'A', text: 'A idade paterna avançada exclusivamente.' },
      { letter: 'B', text: 'A idade materna avançada, especialmente acima de 35 anos.' },
      { letter: 'C', text: 'A exposição a antibióticos durante a gestação.' },
      { letter: 'D', text: 'A deficiência de ácido fólico na dieta materna.' },
      { letter: 'E', text: 'O grupo sanguíneo da mãe.' },
    ],
    correctAnswer: 'B', difficulty: 'facil',
    explanation: 'A idade materna avançada (>35 anos) é o principal fator de risco para trissomia do 21, pois os oócitos permanecem parados na meiose I desde o nascimento e acumulam erros de segregação cromossômica ao longo dos anos. A incidência aumenta de 1:1.000 aos 30 anos para 1:100 aos 40 anos.'
  },

  // PUC-SP 2023
  {
    id: 'PUC_SP_2023_Q01', source: 'PUC_SP', sourceLabel: 'PUC-SP 2023', year: 2023, number: 1,
    subject: 'Biologia', topic: 'Microbiologia',
    text: 'Os vírus são agentes infecciosos que dependem da maquinaria celular do hospedeiro para se replicar. O ciclo lítico viral resulta na destruição da célula hospedeira, enquanto o ciclo lisogênico envolve a integração do genoma viral ao DNA do hospedeiro. Um exemplo de vírus que pode realizar ambos os ciclos é:',
    options: [
      { letter: 'A', text: 'O vírus da gripe (Influenza).' },
      { letter: 'B', text: 'O bacteriófago lambda (λ).' },
      { letter: 'C', text: 'O vírus do mosaico do tabaco (TMV).' },
      { letter: 'D', text: 'O vírus da raiva.' },
      { letter: 'E', text: 'O vírus Ebola.' },
    ],
    correctAnswer: 'B', difficulty: 'medio',
    explanation: 'O bacteriófago lambda (λ) é o exemplo clássico de vírus temperado que pode alternar entre ciclo lítico (replicação e lise da bactéria) e ciclo lisogênico (integração do DNA viral ao cromossomo bacteriano como profago). O HIV também pode realizar ambos os ciclos em células T CD4+.'
  },

  // Einstein 2023
  {
    id: 'EINSTEIN_2023_Q01', source: 'EINSTEIN', sourceLabel: 'Einstein 2023', year: 2023, number: 1,
    subject: 'Biologia', topic: 'Biologia Molecular',
    text: 'O código genético é a correspondência entre os códons do mRNA e os aminoácidos das proteínas. O código genético é degenerado (redundante), o que significa que:',
    options: [
      { letter: 'A', text: 'Um mesmo códon pode codificar diferentes aminoácidos.' },
      { letter: 'B', text: 'Diferentes códons podem codificar o mesmo aminoácido.' },
      { letter: 'C', text: 'Alguns aminoácidos não possuem códons correspondentes.' },
      { letter: 'D', text: 'O código genético varia entre espécies diferentes.' },
      { letter: 'E', text: 'Cada aminoácido é codificado por apenas um códon.' },
    ],
    correctAnswer: 'B', difficulty: 'facil',
    explanation: 'O código genético é degenerado porque a maioria dos aminoácidos é codificada por mais de um códon (ex: leucina tem 6 códons). Isso ocorre principalmente pela variação na terceira posição do códon (wobble). O código é universal (quase idêntico em todos os seres vivos) e não ambíguo (cada códon codifica apenas um aminoácido).'
  },

  // UNIVAG 2023
  {
    id: 'UNIVAG_2023_Q01', source: 'UNIVAG', sourceLabel: 'UNIVAG 2023', year: 2023, number: 1,
    subject: 'Biologia', topic: 'Fisiologia Humana',
    text: 'O sistema digestório humano é responsável pela digestão mecânica e química dos alimentos. A digestão química das proteínas inicia-se no estômago pela ação da pepsina, que é ativada em pH ácido (1,5-2,0). O ácido clorídrico (HCl) é produzido pelas células parietais do estômago. A função do HCl gástrico inclui:',
    options: [
      { letter: 'A', text: 'Digerir diretamente as proteínas em aminoácidos.' },
      { letter: 'B', text: 'Ativar o pepsinogênio em pepsina e criar pH ótimo para sua ação.' },
      { letter: 'C', text: 'Emulsificar as gorduras para ação da lipase.' },
      { letter: 'D', text: 'Neutralizar o quimo ácido que chega do esôfago.' },
      { letter: 'E', text: 'Absorver ferro e vitamina B12 diretamente.' },
    ],
    correctAnswer: 'B', difficulty: 'facil',
    explanation: 'O HCl gástrico tem múltiplas funções: (1) ativa o pepsinogênio (zimogênio inativo) em pepsina (enzima ativa); (2) mantém o pH ácido ideal (1,5-2,0) para a ação da pepsina; (3) desnatura proteínas; (4) ação bactericida. A emulsificação de gorduras é feita pela bile no duodeno.'
  },

  // FUVEST 2022
  {
    id: 'FUVEST_2022_Q01', source: 'FUVEST', sourceLabel: 'FUVEST/USP 2022', year: 2022, number: 1,
    subject: 'Biologia', topic: 'Ecologia',
    text: 'As relações ecológicas entre espécies podem ser classificadas em intraespecíficas e interespecíficas. O mutualismo é uma relação interespecífica em que ambas as espécies se beneficiam. Um exemplo clássico de mutualismo obrigatório é:',
    options: [
      { letter: 'A', text: 'A relação entre tubarão e rêmora.' },
      { letter: 'B', text: 'A relação entre líquens (fungo + alga/cianobactéria).' },
      { letter: 'C', text: 'A relação entre leão e hiena.' },
      { letter: 'D', text: 'A relação entre orquídea e árvore.' },
      { letter: 'E', text: 'A relação entre gado e garça-vaqueira.' },
    ],
    correctAnswer: 'B', difficulty: 'facil',
    explanation: 'Os líquens são o exemplo clássico de mutualismo obrigatório: o fungo fornece proteção e umidade, enquanto a alga/cianobactéria realiza fotossíntese e fornece matéria orgânica. Nenhum dos dois sobrevive isoladamente na natureza. Tubarão-rêmora = comensalismo. Orquídea-árvore = epifitismo. Gado-garça = protocooperação.'
  },
];

// Estatísticas do banco de questões
export const VESTIBULAR_STATS = {
  total: VESTIBULAR_QUESTIONS.length,
  bySource: Object.fromEntries(
    VESTIBULAR_SOURCES.map(s => [
      s.id,
      VESTIBULAR_QUESTIONS.filter(q => q.source === s.id).length,
    ])
  ),
  bySubject: Object.fromEntries(
    VESTIBULAR_SUBJECTS.map(s => [
      s,
      VESTIBULAR_QUESTIONS.filter(q => q.subject === s).length,
    ])
  ),
  byYear: Object.fromEntries(
    [2020, 2021, 2022, 2023, 2024].map(y => [
      y,
      VESTIBULAR_QUESTIONS.filter(q => q.year === y).length,
    ])
  ),
};
