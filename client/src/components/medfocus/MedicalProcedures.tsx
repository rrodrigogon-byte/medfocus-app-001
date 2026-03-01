import React, { useState, useMemo } from 'react';
import { EXPANDED_PROCEDURES } from '../../data/expandedProcedures';
interface Procedure {
  id: string;
  name: string;
  category: string;
  difficulty: 'basico' | 'intermediario' | 'avancado';
  setting: string;
  indication: string[];
  contraindications: string[];
  materials: string[];
  steps: { step: number; title: string; description: string; tip?: string; warning?: string }[];
  complications: string[];
  postProcedure: string[];
  reference: string;
}

const PROCEDURES: Procedure[] = [
  {
    id: 'acesso_periferico', name: 'Acesso Venoso Periférico', category: 'Acessos Vasculares', difficulty: 'basico', setting: 'Enfermaria / Emergência / Ambulatório',
    indication: ['Administração de medicamentos IV', 'Hidratação venosa', 'Hemotransfusão', 'Coleta de exames'],
    contraindications: ['Fístula arteriovenosa no membro', 'Linfedema', 'Infecção local', 'Mastectomia ipsilateral'],
    materials: ['Luvas de procedimento', 'Garrote (torniquete)', 'Algodão com álcool 70%', 'Cateter periférico (jelco) 18G-22G', 'Equipo de soro', 'Esparadrapo/filme transparente', 'Seringa 10mL com SF 0,9%'],
    steps: [
      { step: 1, title: 'Preparação', description: 'Identificar o paciente, explicar o procedimento e obter consentimento verbal. Higienizar as mãos e calçar luvas de procedimento.' },
      { step: 2, title: 'Escolha do sítio', description: 'Preferir veias do dorso da mão ou antebraço (cefálica, basílica, mediana). Evitar áreas de flexão. Começar distalmente.', tip: 'Pedir ao paciente para abrir e fechar a mão repetidamente ajuda a dilatar as veias.' },
      { step: 3, title: 'Garroteamento', description: 'Aplicar o garrote 10-15 cm acima do local de punção. Deve ocluir retorno venoso sem comprometer pulso arterial.', warning: 'Não manter garrote por mais de 2 minutos (risco de hemoconcentração).' },
      { step: 4, title: 'Antissepsia', description: 'Realizar antissepsia com álcool 70% em movimentos circulares de dentro para fora. Aguardar secar.' },
      { step: 5, title: 'Punção', description: 'Tracionar a pele distalmente para fixar a veia. Inserir o cateter com bisel para cima, ângulo de 15-30°. Ao observar refluxo de sangue na câmara, avançar mais 2mm e deslizar a cânula sobre a agulha.', tip: 'Reduzir o ângulo após o flash de sangue para não transfixar a veia.' },
      { step: 6, title: 'Fixação', description: 'Soltar o garrote. Conectar o equipo ou salinizar com 5-10mL de SF 0,9%. Fixar com filme transparente ou esparadrapo. Anotar data, hora e calibre.' },
      { step: 7, title: 'Documentação', description: 'Registrar em prontuário: local, calibre do cateter, número de tentativas e intercorrências.' },
    ],
    complications: ['Hematoma', 'Flebite', 'Infiltração/extravasamento', 'Infecção local', 'Embolia aérea (raro)', 'Punção arterial acidental'],
    postProcedure: ['Trocar cateter a cada 72-96h (ou antes se sinais de flebite)', 'Observar sinais de flebite: dor, calor, rubor, endurecimento', 'Flush com SF 0,9% antes e após medicações'],
    reference: 'Manual de Procedimentos — USP / ATLS 10ª ed.',
  },
  {
    id: 'acesso_central', name: 'Acesso Venoso Central (Jugular Interna)', category: 'Acessos Vasculares', difficulty: 'avancado', setting: 'UTI / Centro Cirúrgico / Emergência',
    indication: ['Drogas vasoativas', 'Nutrição parenteral', 'Hemodiálise', 'Monitorização de PVC', 'Acesso periférico difícil'],
    contraindications: ['Infecção no sítio de punção', 'Coagulopatia grave (INR > 2, plaquetas < 50.000)', 'Trombose venosa local', 'Pneumotórax contralateral'],
    materials: ['Kit de cateter venoso central (duplo ou triplo lúmen)', 'Campo estéril, gorro, máscara, avental, luvas estéreis', 'Clorexidina alcoólica 2%', 'Lidocaína 1% sem vasoconstritor', 'Seringa 10mL, agulha de punção', 'Fio guia (Seldinger)', 'Dilatador', 'Bisturi nº 11', 'USG vascular (OBRIGATÓRIO)'],
    steps: [
      { step: 1, title: 'Posicionamento', description: 'Paciente em Trendelenburg (15-30°). Cabeça virada para o lado contralateral. Identificar anatomia: triângulo de Sedillot (entre as cabeças do ECM).', tip: 'Trendelenburg aumenta o calibre da veia jugular e reduz risco de embolia aérea.' },
      { step: 2, title: 'Paramentação', description: 'Barreira máxima: gorro, máscara, avental estéril, luvas estéreis, campo estéril amplo cobrindo o paciente.' },
      { step: 3, title: 'Antissepsia', description: 'Clorexidina alcoólica 2% em movimentos circulares amplos. Aguardar secar completamente (2 minutos).' },
      { step: 4, title: 'Localização por USG', description: 'Identificar a veia jugular interna com USG (compressível, sem pulsação). Confirmar perviedade e posição em relação à carótida.', warning: 'NUNCA puncionar sem USG. A punção às cegas aumenta complicações em 3-5x.' },
      { step: 5, title: 'Anestesia local', description: 'Infiltrar lidocaína 1% no trajeto da punção (pele e subcutâneo). Aspirar antes de injetar para evitar injeção intravascular.' },
      { step: 6, title: 'Punção (Seldinger)', description: 'Puncionar a veia sob visão ultrassonográfica com agulha conectada à seringa. Ao aspirar sangue venoso escuro, desconectar a seringa e introduzir o fio guia pelo lúmen da agulha.', warning: 'Se sangue vermelho vivo e pulsátil = ARTÉRIA. Retirar e comprimir por 10 minutos.' },
      { step: 7, title: 'Dilatação e inserção', description: 'Retirar a agulha mantendo o fio guia. Fazer pequena incisão com bisturi. Passar o dilatador sobre o fio guia. Retirar o dilatador e inserir o cateter sobre o fio guia. Retirar o fio guia.', warning: 'NUNCA soltar o fio guia. Risco de migração intravascular.' },
      { step: 8, title: 'Confirmação e fixação', description: 'Aspirar sangue de todos os lúmens. Salinizar. Fixar com sutura (fio 2-0 ou 3-0). Curativo oclusivo estéril. Solicitar Rx de tórax para confirmar posição da ponta (junção VCS/AD).' },
    ],
    complications: ['Pneumotórax', 'Hemotórax', 'Punção arterial (carótida)', 'Arritmia (fio guia no coração)', 'Embolia aérea', 'Infecção de corrente sanguínea', 'Trombose venosa'],
    postProcedure: ['Rx de tórax pós-procedimento OBRIGATÓRIO', 'Curativo com clorexidina a cada 48h (transparente) ou 24h (gaze)', 'Avaliar necessidade diariamente — remover assim que possível', 'Bundle de prevenção de infecção de cateter'],
    reference: 'ATLS 10ª ed. / NEJM Procedures — Central Venous Catheterization 2023',
  },
  {
    id: 'intubacao', name: 'Intubação Orotraqueal', category: 'Via Aérea', difficulty: 'avancado', setting: 'Emergência / UTI / Centro Cirúrgico',
    indication: ['Insuficiência respiratória aguda', 'Glasgow ≤ 8', 'Proteção de via aérea (risco de aspiração)', 'Procedimento cirúrgico sob anestesia geral'],
    contraindications: ['Relativas: via aérea difícil prevista (considerar via aérea cirúrgica)', 'Trauma cervical (manter estabilização manual)', 'Obstrução supraglótica (considerar cricotireoidostomia)'],
    materials: ['Laringoscópio (lâmina curva Macintosh 3-4 ou reta Miller)', 'Tubo orotraqueal (TOT) 7.0-8.0 (mulher) / 7.5-8.5 (homem)', 'Guia/mandril (bougie)', 'Seringa 10mL (para cuff)', 'Capnógrafo', 'Estetoscópio', 'Aspirador', 'Ambu + máscara', 'Drogas: Fentanil, Etomidato/Propofol/Ketamina, Succinilcolina/Rocurônio', 'Plano B: máscara laríngea, bougie, videolaringoscópio'],
    steps: [
      { step: 1, title: 'Avaliação LEMON', description: 'L: Look (aparência externa), E: Evaluate 3-3-2, M: Mallampati, O: Obstruction, N: Neck mobility. Preparar plano B se via aérea difícil.', tip: 'Sempre ter plano B e C antes de iniciar. Carro de via aérea difícil disponível.' },
      { step: 2, title: 'Pré-oxigenação', description: 'O2 100% por máscara com reservatório por 3-5 minutos (ou 8 respirações profundas). Meta: SpO2 > 98%. Posição olfativa (sniffing position).', warning: 'Não ventilar com Ambu antes da IOT (risco de distensão gástrica e aspiração) — exceto se SpO2 < 93%.' },
      { step: 3, title: 'Sequência Rápida de Intubação (SRI)', description: 'Pré-tratamento: Fentanil 1-3 mcg/kg IV (3 min antes). Indução: Etomidato 0,3 mg/kg IV OU Propofol 1,5-2 mg/kg OU Ketamina 1-2 mg/kg. Paralisia: Succinilcolina 1,5 mg/kg OU Rocurônio 1,2 mg/kg.', warning: 'Succinilcolina CONTRAINDICADA em: hipercalemia, queimados > 48h, lesão medular, miopatias, história familiar de hipertermia maligna.' },
      { step: 4, title: 'Laringoscopia', description: 'Abrir a boca com técnica de tesoura. Inserir lâmina pela direita, deslocando a língua para esquerda. Avançar até a valécula (Macintosh) ou epiglote (Miller). Elevar para cima e para frente (45°) — NÃO fazer alavanca nos dentes.', tip: 'BURP (backward-upward-rightward pressure) na cartilagem tireoidea melhora a visualização.' },
      { step: 5, title: 'Inserção do tubo', description: 'Visualizar as cordas vocais (Cormack-Lehane I-IV). Inserir o TOT pela corda vocal direita. Avançar até o cuff ultrapassar as cordas (marca 21-23 cm na comissura labial em adultos). Insuflar o cuff com 5-10 mL de ar.' },
      { step: 6, title: 'Confirmação', description: 'CAPNOGRAFIA: padrão-ouro (onda de CO2 expirado). Ausculta: 5 pontos (epigástrio, bases e ápices bilaterais). Expansão torácica simétrica. SpO2 mantida.', warning: 'Se intubação esofágica: retirar IMEDIATAMENTE, ventilar com Ambu e tentar novamente.' },
      { step: 7, title: 'Fixação', description: 'Fixar o tubo com cadarço ou dispositivo comercial. Solicitar Rx de tórax (ponta do tubo 2-4 cm acima da carina). Conectar ao ventilador mecânico.' },
    ],
    complications: ['Intubação esofágica', 'Intubação seletiva (bronquial direita)', 'Trauma dentário', 'Laceração de via aérea', 'Aspiração', 'Hipoxemia durante o procedimento', 'Instabilidade hemodinâmica', 'Laringoespasmo/broncoespasmo'],
    postProcedure: ['Rx de tórax para confirmar posição', 'Pressão do cuff: 20-30 cmH2O', 'Sedação contínua (Midazolam + Fentanil ou Propofol)', 'Cabeceira elevada 30-45°', 'Protocolo de prevenção de PAV'],
    reference: 'Manual of Emergency Airway Management (Walls) 5ª ed. / ATLS 10ª ed.',
  },
  {
    id: 'toracocentese', name: 'Toracocentese', category: 'Procedimentos Torácicos', difficulty: 'intermediario', setting: 'Enfermaria / Emergência / UTI',
    indication: ['Derrame pleural para diagnóstico (todo derrame novo)', 'Derrame pleural volumoso com dispneia (alívio)', 'Empiema (drenagem)'],
    contraindications: ['Coagulopatia grave não corrigida (INR > 2, plaquetas < 25.000)', 'Infecção de pele no local', 'Derrame muito pequeno (< 1 cm na USG)', 'Ventilação mecânica com PEEP alta (relativa)'],
    materials: ['Luvas estéreis, campo estéril', 'Clorexidina alcoólica 2%', 'Lidocaína 1-2% com agulha 22G e 25G', 'Jelco 14G ou agulha de toracocentese', 'Seringa 20-60 mL', 'Torneira de 3 vias', 'Frascos para coleta (bioquímica, citologia, cultura)', 'USG (RECOMENDADO para guiar)'],
    steps: [
      { step: 1, title: 'Posicionamento', description: 'Paciente sentado, inclinado para frente, com braços apoiados sobre mesa. Se acamado: decúbito lateral com lado afetado para cima.', tip: 'USG point-of-care para marcar o local ideal de punção (reduz complicações em 50%).' },
      { step: 2, title: 'Localização', description: 'Percussão: identificar macicez. Local de punção: 1-2 espaços intercostais abaixo do limite superior do derrame, na linha axilar posterior ou média. Sempre na borda SUPERIOR da costela inferior (feixe vasculonervoso na borda inferior).', warning: 'NUNCA puncionar abaixo do 9° espaço intercostal (risco de lesão de órgãos abdominais).' },
      { step: 3, title: 'Antissepsia e anestesia', description: 'Antissepsia ampla com clorexidina. Campo estéril. Anestesia local com lidocaína: pele → subcutâneo → periósteo da costela → pleura parietal (aspirar antes de injetar em cada plano).' },
      { step: 4, title: 'Punção', description: 'Inserir a agulha/jelco perpendicular à parede torácica, na borda superior da costela, aspirando continuamente. Ao aspirar líquido pleural, avançar a cânula e retirar a agulha (se jelco). Conectar torneira de 3 vias.', tip: 'Manter a seringa sempre conectada para evitar entrada de ar.' },
      { step: 5, title: 'Coleta/Drenagem', description: 'Diagnóstica: coletar 50-100 mL em frascos (bioquímica: proteínas, LDH, glicose, pH; citologia; cultura + BAAR). Terapêutica: drenar até 1.500 mL por sessão.', warning: 'Não drenar mais de 1.500 mL de uma vez (risco de edema pulmonar de reexpansão).' },
      { step: 6, title: 'Finalização', description: 'Retirar a agulha/jelco ao final da expiração. Curativo oclusivo. Rx de tórax de controle (excluir pneumotórax).' },
    ],
    complications: ['Pneumotórax (5-10% sem USG, < 1% com USG)', 'Hemotórax (lesão de artéria intercostal)', 'Infecção', 'Edema pulmonar de reexpansão', 'Reação vasovagal', 'Lesão de órgãos abdominais'],
    postProcedure: ['Rx de tórax de controle em 1-2h', 'Observar sinais de pneumotórax: dispneia, dor torácica, enfisema subcutâneo', 'Analisar líquido: critérios de Light (transudato vs exsudato)'],
    reference: 'Roberts & Hedges — Clinical Procedures in Emergency Medicine 7ª ed.',
  },
  {
    id: 'paracentese', name: 'Paracentese Abdominal', category: 'Procedimentos Abdominais', difficulty: 'intermediario', setting: 'Enfermaria / Emergência',
    indication: ['Ascite de início recente (diagnóstica)', 'Peritonite bacteriana espontânea (PBE) suspeita', 'Ascite tensa com desconforto respiratório (terapêutica)'],
    contraindications: ['CIVD clinicamente evidente (relativa)', 'Infecção de parede abdominal no local', 'Distensão de alças intestinais (íleo)', 'Gestação avançada'],
    materials: ['Luvas estéreis, campo estéril', 'Clorexidina alcoólica 2%', 'Lidocaína 1-2%', 'Jelco 14-16G ou agulha de paracentese', 'Seringa 20-60 mL', 'Frascos para coleta', 'Bolsa coletora (se terapêutica)', 'Albumina 20% (se > 5L drenados)'],
    steps: [
      { step: 1, title: 'Posicionamento', description: 'Decúbito dorsal com cabeceira levemente elevada. Esvaziar bexiga antes do procedimento (sondagem se necessário).' },
      { step: 2, title: 'Localização', description: 'Ponto de McBurney invertido (QIE): junção do terço lateral com dois terços mediais da linha entre EIAS esquerda e umbigo. Alternativa: linha alba infraumbilical.', tip: 'USG para confirmar presença de líquido e ausência de alças no trajeto.' },
      { step: 3, title: 'Antissepsia e anestesia', description: 'Antissepsia ampla com clorexidina. Anestesia local com lidocaína em todos os planos até o peritônio.' },
      { step: 4, title: 'Punção (técnica em Z)', description: 'Tracionar a pele 2 cm caudalmente antes de puncionar (cria trajeto em Z que previne vazamento). Inserir a agulha perpendicular aspirando. Ao aspirar líquido ascítico, avançar a cânula.', tip: 'A técnica em Z é fundamental para evitar vazamento crônico de líquido ascítico.' },
      { step: 5, title: 'Coleta/Drenagem', description: 'Diagnóstica: coletar 50-100 mL (celularidade, albumina, proteínas, cultura em frasco de hemocultura). Terapêutica: drenar o necessário com bolsa coletora.', warning: 'Se drenar > 5 litros: repor albumina 6-8g por litro drenado (previne disfunção circulatória).' },
      { step: 6, title: 'Finalização', description: 'Retirar a agulha e liberar a tração da pele (Z fecha). Curativo oclusivo. Manter decúbito lateral direito por 2h (sela o trajeto).' },
    ],
    complications: ['Vazamento de líquido ascítico', 'Infecção', 'Hematoma de parede', 'Perfuração intestinal (raro)', 'Disfunção circulatória pós-paracentese (se > 5L sem albumina)'],
    postProcedure: ['Analisar GASA (Gradiente Albumina Soro-Ascite) ≥ 1,1 = hipertensão portal', 'PMN > 250/mm³ = PBE → iniciar ceftriaxona', 'Monitorar PA e diurese se paracentese de grande volume'],
    reference: 'AASLD Practice Guidelines — Management of Ascites 2021',
  },
  {
    id: 'sutura', name: 'Sutura de Ferimentos', category: 'Procedimentos Cirúrgicos Básicos', difficulty: 'basico', setting: 'Emergência / Ambulatório / UBS',
    indication: ['Ferimentos cortantes ou cortocontusos limpos', 'Ferimentos com menos de 6-8h (face: até 24h)', 'Ferimentos que necessitam de aproximação de bordas'],
    contraindications: ['Ferimentos contaminados > 6-8h (exceto face)', 'Mordedura animal (exceto face)', 'Ferimentos com perda tecidual extensa', 'Infecção ativa no local'],
    materials: ['Luvas estéreis', 'Campo estéril', 'SF 0,9% para irrigação (500mL-1L)', 'Seringa 20mL com agulha 18G (irrigação sob pressão)', 'Lidocaína 1-2% (com ou sem epinefrina)', 'Porta-agulha', 'Pinça anatômica/dente de rato', 'Tesoura', 'Fio de sutura (Nylon 4-0 a 6-0 conforme local)', 'Gaze estéril', 'Curativo'],
    steps: [
      { step: 1, title: 'Avaliação do ferimento', description: 'Avaliar profundidade, extensão, comprometimento de estruturas (tendões, nervos, vasos). Verificar status vacinal antitetânico. Documentar com foto se possível.' },
      { step: 2, title: 'Anestesia', description: 'Bloqueio local com lidocaína 1-2% (dose máxima: 4,5 mg/kg sem epinefrina, 7 mg/kg com epinefrina). Infiltrar nas bordas do ferimento. Aguardar 3-5 minutos.', warning: 'NÃO usar epinefrina em extremidades (dedos, orelhas, nariz, pênis) — risco de necrose.' },
      { step: 3, title: 'Limpeza e irrigação', description: 'Irrigação abundante com SF 0,9% sob pressão (seringa 20mL + agulha 18G). Mínimo 200mL por cm de ferimento. Desbridar tecido desvitalizado se necessário.' },
      { step: 4, title: 'Sutura — Ponto simples', description: 'Montar o fio no porta-agulha (2/3 da agulha). Entrar perpendicular à pele a 3-5mm da borda. Atravessar a derme profundamente. Sair na borda oposta à mesma distância e profundidade. Dar o nó: 3 laçadas no primeiro nó (nó de cirurgião), 2 no segundo, 1 no terceiro.', tip: 'A agulha deve entrar e sair perpendicular à pele para everter as bordas (não inverter).' },
      { step: 5, title: 'Espaçamento', description: 'Pontos a cada 3-5mm. Tensão suficiente para aproximar bordas sem isquemiar. As bordas devem ficar levemente evertidas.', tip: 'Se as bordas inverterem, o ponto está muito superficial. Aprofundar.' },
      { step: 6, title: 'Curativo', description: 'Limpar com SF 0,9%. Aplicar pomada antibiótica (mupirocina ou neomicina). Curativo oclusivo com gaze estéril.' },
    ],
    complications: ['Infecção', 'Deiscência', 'Hematoma', 'Cicatriz hipertrófica/queloide', 'Lesão de nervo/tendão não identificada'],
    postProcedure: ['Manter curativo seco por 24-48h', 'Lavar com água e sabão após 48h', 'Retirada de pontos: Face 5-7 dias, Tronco 7-10 dias, Extremidades 10-14 dias', 'Sinais de alerta: vermelhidão progressiva, secreção purulenta, febre', 'Profilaxia antitetânica se indicada'],
    reference: 'Sabiston Textbook of Surgery 21ª ed. / Roberts & Hedges 7ª ed.',
  },
  {
    id: 'sondagem_vesical', name: 'Sondagem Vesical de Demora', category: 'Procedimentos Urológicos', difficulty: 'basico', setting: 'Enfermaria / Emergência / UTI / Centro Cirúrgico',
    indication: ['Retenção urinária aguda', 'Monitorização de débito urinário (paciente crítico)', 'Procedimento cirúrgico prolongado', 'Irrigação vesical'],
    contraindications: ['Trauma uretral (sangue no meato, hematoma perineal, próstata não palpável)', 'Estenose uretral conhecida (relativa)', 'Infecção uretral ativa'],
    materials: ['Kit de sondagem vesical estéril', 'Sonda Foley (14-16 Fr mulher / 16-18 Fr homem)', 'Luvas estéreis', 'Campo estéril fenestrado', 'Clorexidina aquosa 0,2% ou PVPI tópico', 'Gel de lidocaína 2% estéril', 'Seringa 10-20 mL com água destilada (para balonete)', 'Bolsa coletora de sistema fechado'],
    steps: [
      { step: 1, title: 'Preparação', description: 'Explicar o procedimento ao paciente. Posicionar: mulher em posição ginecológica, homem em decúbito dorsal. Higienizar as mãos. Abrir o kit estéril.' },
      { step: 2, title: 'Antissepsia', description: 'Mulher: afastar os lábios e limpar de cima para baixo (meato → períneo) com clorexidina. Homem: retrair o prepúcio, limpar a glande em movimentos circulares do meato para fora.', warning: 'Técnica estritamente asséptica. Qualquer quebra de técnica = trocar material.' },
      { step: 3, title: 'Lubrificação', description: 'Mulher: lubrificar a ponta da sonda com gel de lidocaína. Homem: instilar 10-20 mL de gel de lidocaína 2% na uretra, aguardar 3-5 minutos.', tip: 'No homem, a lubrificação intrauretral é essencial para conforto e prevenção de trauma.' },
      { step: 4, title: 'Inserção', description: 'Mulher: identificar o meato uretral (acima do introito vaginal), inserir a sonda suavemente até retorno de urina + 2-3 cm. Homem: segurar o pênis a 90° (retifica a uretra), inserir até retorno de urina + 2-3 cm.', warning: 'Se resistência no homem: NÃO forçar. Pode ser HPB ou estenose. Chamar urologia.' },
      { step: 5, title: 'Fixação do balonete', description: 'Insuflar o balonete com 10 mL de água destilada (NUNCA SF — cristaliza). Tracionar suavemente até sentir resistência (balonete no colo vesical).' },
      { step: 6, title: 'Fixação e conexão', description: 'Conectar à bolsa coletora de sistema fechado. Fixar a sonda na coxa (mulher) ou abdome inferior (homem). Manter bolsa abaixo do nível da bexiga.' },
    ],
    complications: ['ITU associada a cateter (principal)', 'Trauma uretral', 'Falso trajeto', 'Hematúria', 'Parafimose (se não reposicionar prepúcio)', 'Espasmo vesical'],
    postProcedure: ['Avaliar necessidade diariamente — remover o mais precoce possível', 'Higiene do meato 2x/dia', 'Manter sistema fechado (nunca desconectar)', 'Esvaziar bolsa regularmente', 'Trocar sonda a cada 2-4 semanas se uso prolongado'],
    reference: 'EAU Guidelines on Urological Infections 2024 / ANVISA — Medidas de Prevenção de ITU',
  },
  {
    id: 'puncao_lombar', name: 'Punção Lombar (Coleta de LCR)', category: 'Procedimentos Neurológicos', difficulty: 'intermediario', setting: 'Emergência / Enfermaria / UTI',
    indication: ['Meningite (suspeita)', 'Hemorragia subaracnoidea (TC normal + suspeita clínica)', 'Esclerose múltipla', 'Hidrocefalia de pressão normal (teste terapêutico)', 'Hipertensão intracraniana idiopática'],
    contraindications: ['Hipertensão intracraniana com efeito de massa (TC antes!)', 'Coagulopatia grave (INR > 1,5, plaquetas < 50.000)', 'Infecção no local de punção', 'Abscesso epidural'],
    materials: ['Kit de punção lombar estéril', 'Agulha de punção lombar (20-22G, atraumática tipo Sprotte/Whitacre)', 'Manômetro de pressão de LCR', 'Frascos estéreis (3-4)', 'Clorexidina alcoólica 2%', 'Lidocaína 1-2%', 'Luvas estéreis, campo estéril'],
    steps: [
      { step: 1, title: 'Indicação e TC prévia', description: 'Avaliar indicação. Realizar TC de crânio ANTES se: imunossupressão, história de lesão de SNC, convulsão recente, papiledema, déficit focal, Glasgow < 15.', warning: 'NÃO atrasar antibiótico na meningite para fazer TC ou PL. Colher hemocultura e iniciar ATB.' },
      { step: 2, title: 'Posicionamento', description: 'Decúbito lateral esquerdo, posição fetal (flexão máxima do tronco, joelhos no peito, queixo no peito). Alternativa: sentado inclinado para frente.', tip: 'A posição fetal abre os espaços intervertebrais. Pedir ao paciente para "abraçar os joelhos".' },
      { step: 3, title: 'Localização', description: 'Palpar as cristas ilíacas (linha de Tuffier = L4). Puncionar em L3-L4 ou L4-L5 (abaixo do cone medular em adultos).', warning: 'NUNCA puncionar acima de L2 em adultos (risco de lesão medular).' },
      { step: 4, title: 'Antissepsia e anestesia', description: 'Antissepsia ampla com clorexidina. Campo estéril. Anestesia local com lidocaína na pele e tecido subcutâneo.' },
      { step: 5, title: 'Punção', description: 'Inserir a agulha na linha média, com bisel paralelo ao eixo longitudinal da coluna, direcionada levemente cranialmente (10-15°). Avançar lentamente. Ao sentir "pop" (ligamento amarelo + dura-máter), retirar o mandril e verificar gotejamento de LCR.', tip: 'Se encontrar osso, retirar até o subcutâneo e redirecionar mais cranialmente.' },
      { step: 6, title: 'Medição de pressão e coleta', description: 'Conectar manômetro: pressão de abertura normal 10-20 cmH2O. Coletar 1-2 mL em cada frasco (total 8-15 mL): Frasco 1 (bioquímica: proteínas, glicose), Frasco 2 (microbiologia: Gram, cultura, BAAR, tinta da China), Frasco 3 (citologia), Frasco 4 (especiais: PCR, bandas oligoclonais).' },
      { step: 7, title: 'Finalização', description: 'Recolocar o mandril antes de retirar a agulha. Curativo oclusivo. Repouso em decúbito dorsal por 1-2h (controverso, mas reduz cefaleia pós-punção).' },
    ],
    complications: ['Cefaleia pós-punção (10-30% — usar agulha atraumática reduz para < 5%)', 'Herniação cerebral (se HIC não avaliada)', 'Infecção (meningite iatrogênica)', 'Hematoma epidural', 'Dor radicular transitória'],
    postProcedure: ['Repouso por 1-2h', 'Hidratação abundante', 'Se cefaleia pós-punção: repouso, cafeína, analgésicos. Se refratária: blood patch epidural', 'Resultado de Gram/cultura em 24-48h'],
    reference: 'Merritt\'s Neurology 14ª ed. / IDSA Guidelines for Meningitis 2017',
  },
];

// Merge expanded procedures
const EXPANDED_AS_PROCS: Procedure[] = EXPANDED_PROCEDURES.filter(e => !PROCEDURES.some(p => p.id === e.id)).map(e => ({
  ...e, category: e.specialty, setting: 'Hospital/Ambulatório',
}));
const ALL_PROCEDURES = [...PROCEDURES, ...EXPANDED_AS_PROCS];
const CATEGORIES = ['Todos', ...new Set(ALL_PROCEDURES.map(p => p.category))];
const diffColor = (d: string) => d === 'basico' ? 'bg-green-500' : d === 'intermediario' ? 'bg-yellow-500' : 'bg-red-500';
const diffLabel = (d: string) => d === 'basico' ? 'Básico' : d === 'intermediario' ? 'Intermediário' : 'Avançado';

export default function MedicalProcedures() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    return ALL_PROCEDURES.filter(p => {
      const matchCat = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchSearch = searchTerm === '' || p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchTerm]);

  const toggleStep = (step: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(step)) next.delete(step); else next.add(step);
      return next;
    });
  };

  if (selectedProcedure) {
    const p = selectedProcedure;
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <button onClick={() => { setSelectedProcedure(null); setCurrentStep(0); setCompletedSteps(new Set()); }}
          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Voltar
        </button>

        <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 rounded-2xl p-6 border border-emerald-700/30">
          <h2 className="text-2xl font-bold text-white">{p.name}</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className={`px-2 py-0.5 ${diffColor(p.difficulty)} text-white rounded text-xs`}>{diffLabel(p.difficulty)}</span>
            <span className="text-gray-400 text-xs">{p.category}</span>
            <span className="text-gray-500 text-xs">{p.setting}</span>
          </div>
        </div>

        {/* Indications & Contraindications */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-green-700/30">
            <h3 className="text-green-400 font-bold mb-2">Indicações</h3>
            {p.indication.map((i, idx) => <div key={idx} className="text-sm text-gray-300 mb-1">• {i}</div>)}
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-red-700/30">
            <h3 className="text-red-400 font-bold mb-2">Contraindicações</h3>
            {p.contraindications.map((c, idx) => <div key={idx} className="text-sm text-gray-300 mb-1">• {c}</div>)}
          </div>
        </div>

        {/* Materials checklist */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
          <h3 className="text-white font-bold mb-3">Materiais Necessários</h3>
          <div className="grid grid-cols-2 gap-1">
            {p.materials.map((m, i) => (
              <label key={i} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                <input type="checkbox" className="rounded border-gray-600 bg-gray-800 text-emerald-500" />
                {m}
              </label>
            ))}
          </div>
        </div>

        {/* Step-by-step guide */}
        <div className="bg-gray-900 rounded-xl p-4 border border-blue-700/30">
          <h3 className="text-white font-bold mb-4">Passo a Passo ({completedSteps.size}/{p.steps.length})</h3>
          <div className="relative">
            {/* Progress bar */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-700" />
            <div className="absolute left-5 top-0 w-0.5 bg-blue-500 transition-all" style={{ height: `${(completedSteps.size / p.steps.length) * 100}%` }} />

            <div className="space-y-4">
              {p.steps.map((s, i) => (
                <div key={i} className={`relative pl-12 ${currentStep === i ? 'opacity-100' : 'opacity-70'}`}>
                  <button onClick={() => { setCurrentStep(i); toggleStep(s.step); }}
                    className={`absolute left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      completedSteps.has(s.step) ? 'bg-emerald-600 border-emerald-500 text-white' : currentStep === i ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-600 text-gray-400'
                    }`}>
                    {completedSteps.has(s.step) ? '✓' : s.step}
                  </button>
                  <div className={`bg-gray-800/50 rounded-lg p-3 border ${currentStep === i ? 'border-blue-500/50' : 'border-gray-700/50'}`}>
                    <h4 className="text-white font-bold text-sm">{s.title}</h4>
                    <p className="text-gray-300 text-sm mt-1">{s.description}</p>
                    {s.tip && (
                      <div className="mt-2 bg-blue-900/20 rounded p-2 border border-blue-700/30">
                        <span className="text-blue-400 text-xs font-bold">DICA: </span>
                        <span className="text-blue-300 text-xs">{s.tip}</span>
                      </div>
                    )}
                    {s.warning && (
                      <div className="mt-2 bg-red-900/20 rounded p-2 border border-red-700/30">
                        <span className="text-red-400 text-xs font-bold">ATENÇÃO: </span>
                        <span className="text-red-300 text-xs">{s.warning}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}
            className="flex-1 py-2 bg-gray-800 text-gray-300 rounded-lg disabled:opacity-30">Passo Anterior</button>
          <button onClick={() => { toggleStep(p.steps[currentStep].step); setCurrentStep(Math.min(p.steps.length - 1, currentStep + 1)); }}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">
            {currentStep === p.steps.length - 1 ? 'Concluir' : 'Próximo Passo →'}
          </button>
        </div>

        {/* Complications & Post */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-orange-700/30">
            <h3 className="text-orange-400 font-bold mb-2">Complicações</h3>
            {p.complications.map((c, i) => <div key={i} className="text-sm text-gray-300 mb-1">• {c}</div>)}
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
            <h3 className="text-white font-bold mb-2">Cuidados Pós-Procedimento</h3>
            {p.postProcedure.map((c, i) => <div key={i} className="text-sm text-gray-300 mb-1">• {c}</div>)}
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center">Referência: {p.reference}</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 rounded-2xl p-6 border border-emerald-700/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-2xl">🔧</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Procedimentos Médicos</h2>
            <p className="text-emerald-300 text-sm">{ALL_PROCEDURES.length} procedimentos com guia passo a passo, checklist de materiais e dicas práticas</p>
          </div>
        </div>
      </div>

      <input type="text" placeholder="Buscar procedimento..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500" />

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setSelectedCategory(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${selectedCategory === c ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map(p => (
          <button key={p.id} onClick={() => setSelectedProcedure(p)}
            className="w-full text-left bg-gray-900 rounded-xl p-4 border border-gray-700 hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold">{p.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded text-white ${diffColor(p.difficulty)}`}>{diffLabel(p.difficulty)}</span>
                  <span className="text-xs text-gray-500">{p.category}</span>
                  <span className="text-xs text-gray-600">{p.steps.length} passos</span>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
