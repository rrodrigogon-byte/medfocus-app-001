/**
 * MedFocus — Simulador de Cirurgias e Procedimentos 3D
 * Sprint 43: Simulação interativa de procedimentos cirúrgicos com checklist, anatomia e avaliação
 */
import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface Procedimento {
  id: string;
  nome: string;
  especialidade: string;
  complexidade: 'Básica' | 'Intermediária' | 'Avançada';
  duracao: string;
  descricao: string;
  etapas: { ordem: number; titulo: string; descricao: string; dica: string; risco: string }[];
  instrumentos: string[];
  anatomia: string[];
  indicacoes: string[];
  contraindicacoes: string[];
  complicacoes: string[];
  referencia: string;
}

const procedimentos: Procedimento[] = [
  {
    id: 'apendicectomia', nome: 'Apendicectomia Laparoscópica', especialidade: 'Cirurgia Geral',
    complexidade: 'Intermediária', duracao: '45-90 min',
    descricao: 'Remoção cirúrgica do apêndice vermiforme por via laparoscópica, indicada em apendicite aguda.',
    etapas: [
      { ordem: 1, titulo: 'Posicionamento e Anestesia', descricao: 'Paciente em decúbito dorsal, anestesia geral com IOT.', dica: 'Verificar jejum mínimo de 8h e antibioticoprofilaxia com Cefazolina 2g IV.', risco: 'Broncoaspiração se jejum inadequado.' },
      { ordem: 2, titulo: 'Pneumoperitônio', descricao: 'Inserção da agulha de Veress na cicatriz umbilical, insuflação com CO2 até 12-15 mmHg.', dica: 'Teste da gota para confirmar posição intraperitoneal.', risco: 'Lesão de alça intestinal ou vascular.' },
      { ordem: 3, titulo: 'Inserção dos Trocartes', descricao: '3 trocartes: umbilical (10mm câmera), suprapúbico (5mm), FIE (5mm).', dica: 'Inserir sob visão direta após o primeiro trocarte.', risco: 'Lesão de epigástrica inferior.' },
      { ordem: 4, titulo: 'Identificação do Apêndice', descricao: 'Localizar o ceco e seguir as tênias até a base do apêndice.', dica: 'Posição de Trendelenburg com rotação lateral esquerda facilita a exposição.', risco: 'Confundir com divertículo de Meckel.' },
      { ordem: 5, titulo: 'Ligadura do Mesoapêndice', descricao: 'Cauterização ou clipagem da artéria apendicular no mesoapêndice.', dica: 'Usar bipolar para hemostasia cuidadosa.', risco: 'Sangramento da artéria apendicular.' },
      { ordem: 6, titulo: 'Secção da Base', descricao: 'Ligadura da base com endoloop ou grampeador linear, secção distal.', dica: 'Manter margem de 5mm do ceco. Cauterizar mucosa do coto.', risco: 'Fístula do coto apendicular.' },
      { ordem: 7, titulo: 'Revisão e Fechamento', descricao: 'Revisão da hemostasia, lavagem da cavidade se necessário, retirada da peça em endobag.', dica: 'Sempre enviar peça para anatomopatológico.', risco: 'Abscesso residual se lavagem inadequada.' },
    ],
    instrumentos: ['Agulha de Veress', 'Trocartes 5mm e 10mm', 'Óptica 30°', 'Pinça de apreensão', 'Tesoura laparoscópica', 'Bisturi elétrico bipolar', 'Endoloop', 'Endobag', 'Aspirador/irrigador'],
    anatomia: ['Apêndice vermiforme', 'Ceco', 'Íleo terminal', 'Artéria apendicular', 'Mesoapêndice', 'Tênias do cólon'],
    indicacoes: ['Apendicite aguda não complicada', 'Apendicite aguda complicada (relativa)', 'Apendicectomia incidental'],
    contraindicacoes: ['Coagulopatia grave não corrigida', 'Instabilidade hemodinâmica severa', 'Contraindicação à anestesia geral'],
    complicacoes: ['Infecção de sítio cirúrgico (3-5%)', 'Abscesso intra-abdominal (1-3%)', 'Fístula do coto (0.5%)', 'Sangramento (1%)', 'Lesão intestinal (0.1%)'],
    referencia: 'Sabiston Textbook of Surgery, 21st Ed. + SAGES Guidelines 2023'
  },
  {
    id: 'colecistectomia', nome: 'Colecistectomia Laparoscópica', especialidade: 'Cirurgia Geral',
    complexidade: 'Intermediária', duracao: '30-90 min',
    descricao: 'Remoção cirúrgica da vesícula biliar por via laparoscópica. Procedimento mais realizado no mundo.',
    etapas: [
      { ordem: 1, titulo: 'Posicionamento', descricao: 'Decúbito dorsal, Trendelenburg reverso, rotação lateral esquerda.', dica: 'Braço esquerdo junto ao corpo para posicionamento do cirurgião.', risco: 'Lesão de plexo braquial por posicionamento inadequado.' },
      { ordem: 2, titulo: 'Pneumoperitônio e Trocartes', descricao: '4 trocartes: umbilical 10mm, epigástrico 10mm, 2 subcostais direitos 5mm.', dica: 'Técnica de Hasson (aberta) é mais segura em reoperações.', risco: 'Lesão hepática pelo trocarte epigástrico.' },
      { ordem: 3, titulo: 'Exposição do Triângulo de Calot', descricao: 'Tração do infundíbulo lateralmente, dissecção do peritônio do triângulo hepatocístico.', dica: 'Obter a Visão Crítica de Segurança (CVS) antes de clipar qualquer estrutura.', risco: 'Lesão de via biliar principal (0.3-0.5%).' },
      { ordem: 4, titulo: 'Clipagem e Secção', descricao: 'Clipar artéria cística (2 proximais, 1 distal) e ducto cístico (2 proximais, 1 distal).', dica: 'NUNCA clipar sem CVS confirmada. Na dúvida, converter para aberta.', risco: 'Clipagem acidental do colédoco — complicação grave.' },
      { ordem: 5, titulo: 'Dissecção do Leito Hepático', descricao: 'Separar vesícula do leito hepático com cauterização monopolar ou hook.', dica: 'Manter plano de dissecção junto à vesícula para evitar lesão hepática.', risco: 'Sangramento do leito hepático.' },
      { ordem: 6, titulo: 'Retirada e Revisão', descricao: 'Retirar vesícula em endobag pelo portal umbilical. Revisar hemostasia do leito.', dica: 'Aspirar bile derramada. Verificar clips in situ.', risco: 'Biloma se houver lesão não identificada.' },
    ],
    instrumentos: ['Trocartes 5mm e 10mm', 'Óptica 30°', 'Grasper', 'Hook cautery', 'Clips de titânio', 'Aplicador de clips', 'Endobag', 'Aspirador'],
    anatomia: ['Vesícula biliar', 'Ducto cístico', 'Artéria cística', 'Triângulo de Calot', 'Colédoco', 'Artéria hepática direita', 'Fígado (leito vesicular)'],
    indicacoes: ['Colelitíase sintomática', 'Colecistite aguda', 'Pólipo vesicular > 10mm', 'Vesícula em porcelana'],
    contraindicacoes: ['Suspeita de câncer de vesícula', 'Coagulopatia grave', 'Cirrose com hipertensão portal grave'],
    complicacoes: ['Lesão de via biliar (0.3-0.5%)', 'Sangramento (0.5%)', 'Biloma (0.3%)', 'Lesão intestinal (0.1%)', 'Cálculo residual no colédoco (1-2%)'],
    referencia: 'SAGES Safe Cholecystectomy Guidelines 2023 + Strasberg SM, JACS 2010'
  },
  {
    id: 'sutura', nome: 'Técnicas de Sutura (Básico)', especialidade: 'Cirurgia Geral',
    complexidade: 'Básica', duracao: '15-30 min por técnica',
    descricao: 'Técnicas fundamentais de sutura para fechamento de feridas. Base para qualquer procedimento cirúrgico.',
    etapas: [
      { ordem: 1, titulo: 'Preparo do Campo', descricao: 'Antissepsia com clorexidina, anestesia local com lidocaína 2% sem vasoconstritor (ou com, conforme região).', dica: 'Dose máxima de lidocaína: 4.5mg/kg sem adrenalina, 7mg/kg com adrenalina.', risco: 'Intoxicação por anestésico local.' },
      { ordem: 2, titulo: 'Ponto Simples', descricao: 'Entrar perpendicular à pele a 5mm da borda, sair na mesma distância do outro lado. Nó quadrado.', dica: 'Everter as bordas. Tensão suficiente para aproximar sem isquemiar.', risco: 'Deiscência se tensão insuficiente, necrose se excessiva.' },
      { ordem: 3, titulo: 'Ponto Donati (Colchoeiro Vertical)', descricao: 'Ponto longe-longe, perto-perto. Entra a 10mm, sai a 10mm, retorna a 3mm, sai a 3mm.', dica: 'Excelente para eversão de bordas em áreas de tensão.', risco: 'Marcas de sutura ("railroad tracks") se mantido > 7 dias.' },
      { ordem: 4, titulo: 'Sutura Contínua Simples', descricao: 'Ponto simples inicial com nó, seguido de pontos contínuos sem cortar o fio. Nó final.', dica: 'Manter tensão uniforme. Ideal para feridas longas e lineares.', risco: 'Se romper em um ponto, toda a sutura pode abrir.' },
      { ordem: 5, titulo: 'Sutura Intradérmica', descricao: 'Passagem horizontal na derme, paralela à superfície, alternando os lados.', dica: 'Usar fio absorvível (Monocryl 4-0 ou 5-0). Melhor resultado estético.', risco: 'Hematoma subcutâneo se hemostasia inadequada.' },
      { ordem: 6, titulo: 'Retirada de Pontos', descricao: 'Face: 5-7 dias. Tronco: 10-14 dias. Extremidades: 7-10 dias. Articulações: 14 dias.', dica: 'Cortar o fio rente à pele de um lado e puxar pelo outro para evitar contaminação.', risco: 'Deiscência se retirada precoce, cicatriz se retirada tardia.' },
    ],
    instrumentos: ['Porta-agulha Mayo-Hegar', 'Pinça anatômica (Adson)', 'Pinça dente-de-rato', 'Tesoura de Metzenbaum', 'Tesoura de Mayo', 'Fios: Nylon 3-0 a 5-0, Vicryl 3-0 a 5-0, Monocryl 4-0 a 5-0'],
    anatomia: ['Epiderme', 'Derme', 'Subcutâneo', 'Fáscia', 'Músculo', 'Linhas de Langer'],
    indicacoes: ['Lacerações traumáticas', 'Fechamento de incisões cirúrgicas', 'Biópsias excisionais'],
    contraindicacoes: ['Ferida infectada (sutura primária)', 'Mordedura animal > 6h (exceto face)', 'Ferida com tecido desvitalizado extenso'],
    complicacoes: ['Infecção (2-5%)', 'Deiscência (1-3%)', 'Cicatriz hipertrófica', 'Queloide', 'Granuloma de corpo estranho'],
    referencia: 'Schwartz Principles of Surgery, 11th Ed. + ACS/ASE Surgical Skills Curriculum'
  },
  {
    id: 'intubacao', nome: 'Intubação Orotraqueal', especialidade: 'Anestesiologia / Emergência',
    complexidade: 'Intermediária', duracao: '2-5 min',
    descricao: 'Procedimento de via aérea definitiva. Inserção de tubo endotraqueal através da glote sob laringoscopia.',
    etapas: [
      { ordem: 1, titulo: 'Avaliação de Via Aérea', descricao: 'Mallampati, distância tireomentoniana, abertura oral, mobilidade cervical.', dica: 'Mallampati III-IV, DTM < 6cm, abertura < 3cm = via aérea difícil.', risco: 'Intubação impossível sem preparo para via aérea difícil.' },
      { ordem: 2, titulo: 'Pré-oxigenação', descricao: 'O2 100% por máscara facial por 3-5 minutos (8 respirações de capacidade vital).', dica: 'Objetivo: dessaturação de N2 e reserva de O2 para apneia segura de 3-5 min.', risco: 'Dessaturação rápida sem pré-oxigenação adequada.' },
      { ordem: 3, titulo: 'Indução em Sequência Rápida', descricao: 'Fentanil 1-3mcg/kg + Propofol 2mg/kg (ou Etomidato 0.3mg/kg) + Succinilcolina 1mg/kg.', dica: 'Pressão cricoide (Sellick) para prevenir aspiração. Aguardar 45-60s para fasciculações.', risco: 'Hipotensão com Propofol, hipertermia maligna com Succinilcolina.' },
      { ordem: 4, titulo: 'Laringoscopia', descricao: 'Lâmina curva (Macintosh) na valécula ou reta (Miller) elevando a epiglote. Visualizar cordas vocais.', dica: 'Manobra BURP (Back, Up, Right Pressure) melhora a visualização. Classificação Cormack-Lehane.', risco: 'Lesão dentária, laceração de mucosa.' },
      { ordem: 5, titulo: 'Inserção do Tubo', descricao: 'Tubo 7.0-7.5 (mulher) ou 7.5-8.0 (homem). Inserir até o cuff passar as cordas. Fixar a 21-23cm na comissura labial.', dica: 'Insuflar o cuff com 5-10mL de ar. Pressão do cuff: 20-30 cmH2O.', risco: 'Intubação esofágica ou endobrônquica.' },
      { ordem: 6, titulo: 'Confirmação', descricao: 'Capnografia (padrão-ouro), ausculta bilateral (ápices e bases), condensação no tubo, expansão torácica simétrica.', dica: 'Capnografia com onda quadrada = confirmação definitiva. Raio-X para posição (2-4cm acima da carina).', risco: 'Intubação esofágica não reconhecida = óbito.' },
    ],
    instrumentos: ['Laringoscópio (Macintosh 3-4 ou Miller 2-3)', 'Tubo endotraqueal 6.0-8.5', 'Guia/Bougie', 'Seringa 10mL (cuff)', 'Capnógrafo', 'Estetoscópio', 'Aspirador', 'Máscara laríngea (backup)', 'Kit de cricotireoidostomia (emergência)'],
    anatomia: ['Cavidade oral', 'Orofaringe', 'Epiglote', 'Valécula', 'Cordas vocais', 'Glote', 'Traqueia', 'Carina', 'Cartilagem cricoide'],
    indicacoes: ['Insuficiência respiratória aguda', 'Glasgow ≤ 8', 'Proteção de via aérea', 'Procedimentos cirúrgicos sob anestesia geral'],
    contraindicacoes: ['Transecção traqueal (relativa)', 'Fratura de laringe (relativa — considerar via cirúrgica)'],
    complicacoes: ['Intubação esofágica (2-5%)', 'Intubação endobrônquica (5-10%)', 'Lesão dentária (1%)', 'Edema de glote pós-extubação', 'Pneumotórax (raro)'],
    referencia: 'Miller\'s Anesthesia 9th Ed. + Difficult Airway Society Guidelines 2015 + ATLS 10th Ed.'
  },
  {
    id: 'acesso-venoso', nome: 'Acesso Venoso Central (Jugular Interna)', especialidade: 'Cirurgia / UTI',
    complexidade: 'Intermediária', duracao: '15-30 min',
    descricao: 'Inserção de cateter venoso central na veia jugular interna por técnica de Seldinger guiada por ultrassom.',
    etapas: [
      { ordem: 1, titulo: 'Indicação e Consentimento', descricao: 'Drogas vasoativas, NPT, acesso periférico impossível, monitorização de PVC.', dica: 'Sempre preferir USG-guiado. Reduz complicações em 50%.', risco: 'Procedimento sem indicação clara.' },
      { ordem: 2, titulo: 'Posicionamento', descricao: 'Trendelenburg 15°, cabeça virada para o lado oposto. Antissepsia ampla com clorexidina 2%.', dica: 'Trendelenburg ingurgita a veia e reduz risco de embolia aérea.', risco: 'Embolia aérea se paciente sentado.' },
      { ordem: 3, titulo: 'Localização com USG', descricao: 'Transdutor linear, eixo curto. Identificar JI (compressível, sem pulsação) lateral à carótida.', dica: 'Comprimir: veia colapsa, artéria não. Doppler confirma fluxo venoso.', risco: 'Punção acidental da carótida.' },
      { ordem: 4, titulo: 'Punção (Seldinger)', descricao: 'Agulha 18G a 45° sob visão do USG. Aspirar sangue venoso escuro. Inserir fio-guia em J.', dica: 'Fio-guia nunca deve passar de 20cm (risco de arritmia). Monitorizar ECG.', risco: 'Arritmia por fio-guia no átrio direito.' },
      { ordem: 5, titulo: 'Dilatação e Inserção', descricao: 'Incisão de 3mm com bisturi. Dilatar o trajeto. Inserir cateter sobre o fio-guia. Remover fio-guia.', dica: 'SEMPRE segurar o fio-guia com uma mão. Nunca soltar.', risco: 'Perda do fio-guia intravascular (corpo estranho).' },
      { ordem: 6, titulo: 'Confirmação e Fixação', descricao: 'Aspirar sangue de todas as vias. Flush com SF. Fixar com sutura. Curativo estéril. Raio-X de tórax.', dica: 'Raio-X confirma posição (ponta na junção VCS/AD) e exclui pneumotórax.', risco: 'Pneumotórax (1-3%), hemotórax, mau posicionamento.' },
    ],
    instrumentos: ['Kit de cateter venoso central (duplo ou triplo lúmen)', 'Ultrassom com transdutor linear', 'Capa estéril para USG', 'Agulha de punção 18G', 'Fio-guia em J', 'Dilatador', 'Bisturi nº 11', 'Seringa 10mL', 'Clorexidina 2%', 'Campos estéreis'],
    anatomia: ['Veia jugular interna', 'Artéria carótida comum', 'Músculo esternocleidomastoideo', 'Triângulo de Sedillot', 'Veia cava superior', 'Átrio direito', 'Cúpula pleural'],
    indicacoes: ['Drogas vasoativas', 'Nutrição parenteral total', 'Hemodiálise', 'Monitorização de PVC', 'Acesso periférico impossível'],
    contraindicacoes: ['Infecção no sítio de punção', 'Trombose da veia-alvo', 'Coagulopatia grave (relativa)', 'Pneumotórax contralateral'],
    complicacoes: ['Punção arterial (5-10%)', 'Pneumotórax (1-3%)', 'Infecção de cateter (5-10/1000 cateter-dia)', 'Trombose venosa (2-5%)', 'Embolia aérea (rara)', 'Arritmia por fio-guia'],
    referencia: 'NEJM Procedures: Central Venous Catheterization 2007 + CDC Guidelines for Prevention of Intravascular Catheter-Related Infections 2011'
  },
  {
    id: 'drenagem-torax', nome: 'Drenagem de Tórax (Toracostomia)', especialidade: 'Cirurgia / Emergência',
    complexidade: 'Intermediária', duracao: '15-20 min',
    descricao: 'Inserção de dreno tubular no espaço pleural para tratamento de pneumotórax, hemotórax ou derrame pleural.',
    etapas: [
      { ordem: 1, titulo: 'Indicação', descricao: 'Pneumotórax > 20%, hemotórax, derrame pleural sintomático, pneumotórax hipertensivo (após descompressão).', dica: 'Pneumotórax hipertensivo: descompressão com agulha ANTES da drenagem.', risco: 'Atraso na descompressão = parada cardíaca.' },
      { ordem: 2, titulo: 'Posicionamento e Preparo', descricao: '5º EIC, linha axilar média (triângulo de segurança). Antissepsia. Anestesia local até a pleura.', dica: 'Triângulo de segurança: borda anterior do latíssimo do dorso, borda lateral do peitoral maior, linha do mamilo.', risco: 'Inserção abaixo do diafragma = lesão abdominal.' },
      { ordem: 3, titulo: 'Incisão e Dissecção', descricao: 'Incisão de 3-4cm na borda superior da costela inferior. Dissecção romba com Kelly até a pleura.', dica: 'Borda SUPERIOR da costela para evitar o feixe vasculonervoso intercostal (borda inferior).', risco: 'Lesão de artéria intercostal = hemotórax iatrogênico.' },
      { ordem: 4, titulo: 'Entrada na Pleura', descricao: 'Perfurar a pleura com Kelly. Exploração digital para confirmar espaço pleural e excluir aderências.', dica: 'O dedo é o melhor instrumento. Sentir o pulmão, aderências, diafragma.', risco: 'Lesão pulmonar se inserção forçada sem exploração.' },
      { ordem: 5, titulo: 'Inserção do Dreno', descricao: 'Dreno 28-32Fr (hemotórax) ou 24-28Fr (pneumotórax). Direcionar posterior e apical.', dica: 'Todos os orifícios do dreno devem estar dentro do tórax. Clampar antes de conectar.', risco: 'Dreno subcutâneo (fora da pleura).' },
      { ordem: 6, titulo: 'Conexão e Fixação', descricao: 'Conectar ao selo d\'água. Verificar oscilação e borbulhamento. Fixar com sutura em U e bailarina.', dica: 'Oscilação = dreno na pleura. Borbulhamento = fístula aérea ativa. Raio-X de controle.', risco: 'Desconexão acidental = pneumotórax aberto.' },
    ],
    instrumentos: ['Dreno torácico 24-32Fr', 'Selo d\'água', 'Bisturi nº 22', 'Pinça Kelly curva', 'Porta-agulha', 'Fio Nylon 1-0', 'Lidocaína 2%', 'Seringa 20mL', 'Gaze e curativo oclusivo'],
    anatomia: ['Espaço pleural', 'Pleura parietal e visceral', 'Costelas', 'Feixe vasculonervoso intercostal', 'Diafragma', 'Pulmão', 'Triângulo de segurança'],
    indicacoes: ['Pneumotórax', 'Hemotórax', 'Derrame pleural volumoso', 'Empiema', 'Quilotórax', 'Pós-operatório de cirurgia torácica'],
    contraindicacoes: ['Coagulopatia grave (relativa)', 'Aderências pleurais extensas (relativa)'],
    complicacoes: ['Lesão pulmonar (1-2%)', 'Sangramento intercostal (1%)', 'Infecção/empiema (2%)', 'Dreno subcutâneo (5%)', 'Lesão diafragmática (rara)'],
    referencia: 'ATLS 10th Ed. + BTS Guidelines for Pleural Disease 2023 + Roberts & Hedges\' Clinical Procedures in Emergency Medicine'
  },
];

const especialidades = [...new Set(procedimentos.map(p => p.especialidade))];

const SimuladorCirurgias: React.FC = () => {
  const [view, setView] = useState<'lista' | 'simulacao' | 'avaliacao'>('lista');
  const [selected, setSelected] = useState<Procedimento | null>(null);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [checklistCompleto, setChecklistCompleto] = useState<Record<number, boolean>>({});
  const [filtroEsp, setFiltroEsp] = useState('Todas');
  const [filtroComplexidade, setFiltroComplexidade] = useState('Todas');
  const [showDica, setShowDica] = useState<Record<number, boolean>>({});
  const [showRisco, setShowRisco] = useState<Record<number, boolean>>({});
  const [pontuacao, setPontuacao] = useState(0);
  const [tempoInicio, setTempoInicio] = useState<number>(0);
  const [tempoFinal, setTempoFinal] = useState<number>(0);

  const iniciarSimulacao = (proc: Procedimento) => {
    setSelected(proc);
    setView('simulacao');
    setEtapaAtual(0);
    setChecklistCompleto({});
    setShowDica({});
    setShowRisco({});
    setPontuacao(0);
    setTempoInicio(Date.now());
  };

  const completarEtapa = (idx: number) => {
    setChecklistCompleto(prev => ({ ...prev, [idx]: true }));
    setPontuacao(prev => prev + 10);
    if (idx < (selected?.etapas.length || 0) - 1) {
      setEtapaAtual(idx + 1);
    }
  };

  const finalizarSimulacao = () => {
    setTempoFinal(Date.now());
    setView('avaliacao');
  };

  const todasCompletas = selected ? Object.keys(checklistCompleto).length === selected.etapas.length : false;

  const filtrados = procedimentos.filter(p => {
    if (filtroEsp !== 'Todas' && p.especialidade !== filtroEsp) return false;
    if (filtroComplexidade !== 'Todas' && p.complexidade !== filtroComplexidade) return false;
    return true;
  });

  const tempoGasto = tempoFinal > 0 ? Math.round((tempoFinal - tempoInicio) / 1000) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <EducationalDisclaimer moduleName="Simulador de Cirurgias e Procedimentos" />

      {view === 'lista' && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">🔬 Simulador de Cirurgias e Procedimentos</h1>
            <p className="text-gray-400">Treine procedimentos cirúrgicos passo a passo com checklist, anatomia e avaliação</p>
          </div>

          <div className="flex gap-4 mb-6 flex-wrap">
            <select value={filtroEsp} onChange={e => setFiltroEsp(e.target.value)} className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2">
              <option>Todas</option>
              {especialidades.map(e => <option key={e}>{e}</option>)}
            </select>
            <select value={filtroComplexidade} onChange={e => setFiltroComplexidade(e.target.value)} className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2">
              <option>Todas</option>
              <option>Básica</option>
              <option>Intermediária</option>
              <option>Avançada</option>
            </select>
            <span className="text-gray-500 self-center">{filtrados.length} procedimento(s)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtrados.map(proc => (
              <div key={proc.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-emerald-500/50 transition-all cursor-pointer" onClick={() => iniciarSimulacao(proc)}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-white">{proc.nome}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${proc.complexidade === 'Básica' ? 'bg-green-500/20 text-green-400' : proc.complexidade === 'Intermediária' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{proc.complexidade}</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{proc.descricao}</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>🏥 {proc.especialidade}</span>
                  <span>⏱ {proc.duracao}</span>
                  <span>📋 {proc.etapas.length} etapas</span>
                </div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {proc.anatomia.slice(0, 3).map(a => <span key={a} className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">{a}</span>)}
                  {proc.anatomia.length > 3 && <span className="text-xs text-gray-500">+{proc.anatomia.length - 3}</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'simulacao' && selected && (
        <>
          <div className="flex justify-between items-center">
            <button onClick={() => setView('lista')} className="text-emerald-400 hover:text-emerald-300">← Voltar</button>
            <h2 className="text-xl font-bold text-white">{selected.nome}</h2>
            <span className="text-gray-400">Etapa {etapaAtual + 1}/{selected.etapas.length}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${(Object.keys(checklistCompleto).length / selected.etapas.length) * 100}%` }} />
          </div>

          {/* Etapas */}
          <div className="space-y-3">
            {selected.etapas.map((etapa, idx) => (
              <div key={idx} className={`border rounded-xl p-4 transition-all ${checklistCompleto[idx] ? 'bg-emerald-500/10 border-emerald-500/30' : idx === etapaAtual ? 'bg-gray-800 border-emerald-500' : 'bg-gray-800/30 border-gray-700'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${checklistCompleto[idx] ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300'}`}>{checklistCompleto[idx] ? '✓' : etapa.ordem}</span>
                      <h4 className="text-white font-semibold">{etapa.titulo}</h4>
                    </div>
                    <p className="text-gray-400 text-sm ml-11">{etapa.descricao}</p>

                    {showDica[idx] && <div className="ml-11 mt-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300 text-sm">💡 <strong>Dica:</strong> {etapa.dica}</div>}
                    {showRisco[idx] && <div className="ml-11 mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">⚠️ <strong>Risco:</strong> {etapa.risco}</div>}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => setShowDica(prev => ({ ...prev, [idx]: !prev[idx] }))} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded hover:bg-blue-500/30">Dica</button>
                    <button onClick={() => setShowRisco(prev => ({ ...prev, [idx]: !prev[idx] }))} className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500/30">Risco</button>
                    {!checklistCompleto[idx] && <button onClick={() => completarEtapa(idx)} className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded hover:bg-emerald-500/30">✓ Concluir</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {todasCompletas && (
            <button onClick={finalizarSimulacao} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all">🏆 Finalizar Simulação e Ver Avaliação</button>
          )}

          {/* Info Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <h4 className="text-emerald-400 font-semibold mb-2">🔧 Instrumentos</h4>
              <ul className="space-y-1">{selected.instrumentos.map(i => <li key={i} className="text-gray-400 text-sm">• {i}</li>)}</ul>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <h4 className="text-blue-400 font-semibold mb-2">🫀 Anatomia Relevante</h4>
              <ul className="space-y-1">{selected.anatomia.map(a => <li key={a} className="text-gray-400 text-sm">• {a}</li>)}</ul>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <h4 className="text-red-400 font-semibold mb-2">⚠️ Complicações</h4>
              <ul className="space-y-1">{selected.complicacoes.map(c => <li key={c} className="text-gray-400 text-sm">• {c}</li>)}</ul>
            </div>
          </div>

          <div className="text-xs text-gray-600 text-center mt-4">Ref: {selected.referencia}</div>
        </>
      )}

      {view === 'avaliacao' && selected && (
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold text-white">🏆 Simulação Concluída!</h2>
          <p className="text-gray-400">{selected.nome}</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="text-3xl font-bold text-emerald-400">{pontuacao}</div>
              <div className="text-gray-500 text-sm">Pontos</div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-400">{selected.etapas.length}/{selected.etapas.length}</div>
              <div className="text-gray-500 text-sm">Etapas</div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="text-3xl font-bold text-yellow-400">{Math.floor(tempoGasto / 60)}:{String(tempoGasto % 60).padStart(2, '0')}</div>
              <div className="text-gray-500 text-sm">Tempo</div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-left">
            <h3 className="text-white font-semibold mb-3">📋 Checklist de Competências</h3>
            <div className="space-y-2">
              {selected.etapas.map((e, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-gray-300">{e.titulo}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={() => iniciarSimulacao(selected)} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">🔄 Repetir</button>
            <button onClick={() => setView('lista')} className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">📋 Outros Procedimentos</button>
          </div>

          <div className="text-xs text-gray-600 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
            ⚠️ Este simulador é exclusivamente para fins educacionais e de treinamento. Não substitui a prática supervisionada em ambiente hospitalar.
          </div>
        </div>
      )}
    </div>
  );
};

export default SimuladorCirurgias;
