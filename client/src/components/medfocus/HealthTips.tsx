import React, { useState, useMemo } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface Tip {
  id: string;
  titulo: string;
  categoria: string;
  resumo: string;
  conteudo: string;
  detalhes: string[];
  fonte: string;
  icone: string;
  urgencia?: 'baixa' | 'media' | 'alta';
  publicoAlvo?: string;
}

const TIPS: Tip[] = [
  // ── NUTRIÇÃO ──────────────────────────────────────────────
  { id:'1', titulo:'Hidratação: Quanto de água beber por dia?', categoria:'Nutrição', resumo:'A quantidade ideal varia conforme peso e atividade física.', conteudo:'A recomendação geral é de 35mL/kg/dia. Uma pessoa de 70kg deve ingerir aproximadamente 2,5 litros. Em dias quentes ou durante exercício físico, aumente 500mL a 1L. Alimentos como frutas e vegetais contribuem com 20% da ingestão hídrica.', detalhes:['Urina clara = boa hidratação','Sinais de desidratação: urina escura, boca seca, fadiga, tontura','Idosos têm menor percepção de sede — atenção redobrada','Café e chá contam parcialmente (efeito diurético leve)','Gestantes: aumentar 300mL/dia; lactantes: 700mL/dia'], fonte:'OMS / Sociedade Brasileira de Nefrologia', icone:'💧', urgencia:'baixa', publicoAlvo:'Todos' },
  { id:'2', titulo:'O Prato Saudável: Guia Alimentar Brasileiro', categoria:'Nutrição', resumo:'Metade vegetais, 1/4 proteínas, 1/4 carboidratos integrais.', conteudo:'O Guia Alimentar do Ministério da Saúde recomenda priorizar alimentos in natura e minimamente processados. Evite ultraprocessados (refrigerantes, salgadinhos, biscoitos recheados). Consuma 5 porções de frutas e vegetais por dia.', detalhes:['Limite sal: 5g/dia (1 colher de chá)','Limite açúcar livre: 25g/dia (6 colheres de chá)','Prefira grãos integrais (arroz integral, aveia, quinoa)','Proteínas: varie entre carnes magras, ovos, leguminosas','Gorduras boas: azeite, castanhas, abacate, peixes'], fonte:'Guia Alimentar MS 2014 / OMS', icone:'🥗', urgencia:'baixa', publicoAlvo:'Todos' },
  { id:'3', titulo:'Vitamina D: A vitamina do sol', categoria:'Nutrição', resumo:'Deficiência afeta 50% dos brasileiros, mesmo em país tropical.', conteudo:'A vitamina D é essencial para saúde óssea, imunidade e prevenção de doenças crônicas. A principal fonte é a exposição solar (15-20 min/dia, braços e pernas, sem protetor). Alimentos ricos: salmão, sardinha, gema de ovo, cogumelos.', detalhes:['Nível ideal: 30-60 ng/mL no sangue','Deficiência (<20 ng/mL): suplementação necessária','Dose usual: 1.000-2.000 UI/dia (adultos)','Idosos, obesos e pele escura: maior risco de deficiência','Excesso (>100 ng/mL) pode causar hipercalcemia'], fonte:'SBEM / Endocrine Society 2024', icone:'☀️', urgencia:'media', publicoAlvo:'Todos' },
  { id:'4', titulo:'Ferro e Anemia: Sinais e prevenção', categoria:'Nutrição', resumo:'Anemia ferropriva é a carência nutricional mais comum no mundo.', conteudo:'Afeta 30% das mulheres em idade fértil no Brasil. Sintomas: cansaço, palidez, queda de cabelo, unhas quebradiças, falta de ar. Fontes de ferro heme (melhor absorção): carnes vermelhas, fígado. Fontes não-heme: feijão, lentilha, espinafre — combine com vitamina C.', detalhes:['Hemoglobina normal: H 13-17 g/dL, M 12-16 g/dL','Ferritina <30 ng/mL já indica depleção de estoque','Gestantes: suplementação obrigatória (40-60mg Fe/dia)','Chá e café reduzem absorção — evite nas refeições','Suplementação: sulfato ferroso em jejum com suco de laranja'], fonte:'OMS / SBH / MS', icone:'🩸', urgencia:'media', publicoAlvo:'Mulheres, gestantes, crianças' },

  // ── EXERCÍCIOS ────────────────────────────────────────────
  { id:'5', titulo:'150 Minutos de Atividade Física por Semana', categoria:'Exercícios', resumo:'A OMS recomenda 150 min de atividade moderada ou 75 min intensa.', conteudo:'Exercício regular reduz 30% o risco cardiovascular, 27% diabetes tipo 2, 25% câncer de mama e cólon. Comece com caminhadas de 30 minutos, 5 vezes por semana. Inclua fortalecimento muscular 2 vezes por semana para prevenir sarcopenia.', detalhes:['Moderada: caminhada rápida, bicicleta, natação leve','Intensa: corrida, HIIT, esportes competitivos','Idosos: adicione exercícios de equilíbrio 3x/semana','Crianças: 60 min/dia de atividade moderada a vigorosa','Sedentarismo mata 5 milhões/ano globalmente'], fonte:'OMS 2020 / AHA / ACSM', icone:'🏃', urgencia:'baixa', publicoAlvo:'Todos' },
  { id:'6', titulo:'Alongamento e Flexibilidade', categoria:'Exercícios', resumo:'Alongar reduz dores, melhora postura e previne lesões.', conteudo:'Realize alongamentos estáticos após exercícios (nunca com músculo frio). Mantenha cada posição por 15-30 segundos, sem dor. Yoga e Pilates são excelentes para flexibilidade global. Profissionais que ficam sentados devem alongar a cada 2 horas.', detalhes:['Alongamento dinâmico: antes do exercício','Alongamento estático: após o exercício','Foco: isquiotibiais, quadríceps, lombar, cervical','Não force além do limite — dor indica lesão','Benefícios: reduz estresse, melhora circulação'], fonte:'ACSM / COFFITO', icone:'🧘', urgencia:'baixa', publicoAlvo:'Todos' },

  // ── SONO ──────────────────────────────────────────────────
  { id:'7', titulo:'Sono: 7-9 Horas de Descanso Reparador', categoria:'Sono', resumo:'Privação crônica de sono aumenta risco de obesidade, diabetes e depressão.', conteudo:'O sono é tão importante quanto alimentação e exercício. Durante o sono profundo ocorre consolidação da memória, reparo tecidual e regulação hormonal. A privação crônica (< 6h/noite) aumenta em 48% o risco de doença cardíaca.', detalhes:['Horários regulares: dormir e acordar no mesmo horário','Evite telas (luz azul) 1 hora antes de dormir','Quarto: escuro, silencioso, temperatura 18-22°C','Sem cafeína após 14h (meia-vida: 5-6 horas)','Álcool fragmenta o sono — evite como "indutor"','Melatonina: 0,5-3mg, 30 min antes (sob orientação)'], fonte:'National Sleep Foundation / SBSONO', icone:'😴', urgencia:'media', publicoAlvo:'Todos' },
  { id:'8', titulo:'Apneia do Sono: O perigo silencioso', categoria:'Sono', resumo:'Afeta 33% dos adultos e aumenta risco cardiovascular em 3x.', conteudo:'A Síndrome da Apneia Obstrutiva do Sono (SAOS) causa paradas respiratórias durante o sono. Sintomas: ronco alto, sonolência diurna excessiva, acordar com boca seca, cefaleia matinal. Diagnóstico: polissonografia. Tratamento: CPAP, perda de peso, cirurgia.', detalhes:['Fatores de risco: obesidade, pescoço >40cm, idade >50','Escala de Epworth >10: suspeitar de SAOS','CPAP é padrão-ouro (adesão melhora com máscara nasal)','Sem tratamento: HAS, arritmia, AVC, acidentes','Crianças: adenoide/amígdalas — avaliação otorrino'], fonte:'AASM / ABSono / SBPT', icone:'💤', urgencia:'alta', publicoAlvo:'Adultos, obesos, roncadores' },

  // ── SAÚDE MENTAL ──────────────────────────────────────────
  { id:'9', titulo:'Ansiedade e Depressão: Sinais de Alerta', categoria:'Saúde Mental', resumo:'Transtornos mentais afetam 1 em 4 brasileiros. São tratáveis.', conteudo:'O Brasil é o país mais ansioso do mundo (OMS). Sinais de depressão: tristeza persistente >2 semanas, perda de interesse, alterações de sono e apetite, fadiga, dificuldade de concentração, pensamentos negativos recorrentes. Procure ajuda profissional.', detalhes:['CVV (Centro de Valorização da Vida): 188 — 24h','CAPS: atendimento gratuito pelo SUS','Psicoterapia (TCC) + medicação: melhor combinação','Exercício físico: efeito antidepressivo comprovado','Meditação mindfulness: reduz ansiedade em 30%','Não é fraqueza — é doença neurobiológica tratável'], fonte:'OMS / ABP / CFP / CVV', icone:'🧠', urgencia:'alta', publicoAlvo:'Todos' },
  { id:'10', titulo:'Burnout: Esgotamento Profissional', categoria:'Saúde Mental', resumo:'Reconhecido pela OMS como doença ocupacional (CID-11: QD85).', conteudo:'Síndrome de Burnout é resultado de estresse crônico no trabalho. Três dimensões: exaustão emocional, despersonalização e baixa realização profissional. Profissionais de saúde são os mais afetados (até 60% dos médicos residentes).', detalhes:['Sinais: exaustão constante, cinismo, queda de produtividade','Diferença de depressão: Burnout é contextual (trabalho)','Tratamento: psicoterapia, mudanças organizacionais','Prevenção: limites claros, pausas, hobbies, sono','Direito trabalhista: afastamento pelo INSS (B91)','Escala MBI (Maslach Burnout Inventory) para diagnóstico'], fonte:'OMS CID-11 / CFM / MS', icone:'🔥', urgencia:'alta', publicoAlvo:'Profissionais de saúde, professores' },

  // ── PREVENÇÃO ─────────────────────────────────────────────
  { id:'11', titulo:'Vacinas Essenciais para Adultos', categoria:'Prevenção', resumo:'Adultos também precisam manter o calendário vacinal em dia.', conteudo:'O Programa Nacional de Imunizações (PNI) oferece vacinas gratuitas para todas as idades. Muitos adultos estão com esquema incompleto, especialmente Hepatite B e dTpa. A vacinação é a medida de saúde pública com melhor custo-efetividade.', detalhes:['Influenza: anual (março-abril)','COVID-19: doses de reforço conforme MS','Hepatite B: 3 doses (verificar anti-HBs)','dT/dTpa: reforço a cada 10 anos','Febre Amarela: dose única (áreas endêmicas)','60+: Pneumocócica 23v, Herpes Zóster (Shingrix)','Gestantes: dTpa (20ª semana), Influenza'], fonte:'PNI / SBIm / MS 2025', icone:'💉', urgencia:'media', publicoAlvo:'Todos' },
  { id:'12', titulo:'Pressão Arterial: Conheça Seus Números', categoria:'Prevenção', resumo:'Hipertensão afeta 1 em 4 brasileiros e é o principal fator de risco para AVC.', conteudo:'A hipertensão arterial sistêmica (HAS) é silenciosa — 50% dos hipertensos não sabem que têm. Meça regularmente. Normal: <120/80 mmHg. Pré-HAS: 120-139/80-89. HAS estágio 1: 140-159/90-99. HAS estágio 2: ≥160/100.', detalhes:['Reduza sal para <5g/dia (leia rótulos)','DASH diet: frutas, vegetais, laticínios magros','Exercício: reduz 5-8 mmHg','Perda de peso: cada 1kg = -1 mmHg','Álcool: máximo 1 dose/dia (mulheres), 2 (homens)','Medicação: não interrompa sem orientação médica','Meta: <130/80 para diabéticos e alto risco CV'], fonte:'SBC / Diretriz HAS 2020 / AHA/ACC 2017', icone:'❤️', urgencia:'alta', publicoAlvo:'Adultos >18 anos' },
  { id:'13', titulo:'Diabetes: Prevenção e Controle', categoria:'Prevenção', resumo:'DM2 pode ser prevenido com mudanças no estilo de vida em 58% dos casos.', conteudo:'O Brasil tem 17 milhões de diabéticos (IDF 2024). Glicemia de jejum normal: <100 mg/dL. Pré-diabetes: 100-125. Diabetes: ≥126 (2 medidas). O estudo DPP mostrou que perda de 5-7% do peso + 150min exercício/semana reduz 58% o risco.', detalhes:['HbA1c: meta <7% (individualizar)','Automonitoramento: glicemia capilar ou CGM','Pé diabético: examine os pés diariamente','Rastreio: fundo de olho anual, microalbuminúria','Metformina: primeira linha no DM2','Insulina: não é "último recurso" — é tratamento eficaz','Hipoglicemia (<70): suco, mel, glicose — regra 15/15'], fonte:'SBD / ADA 2025 / IDF', icone:'🩺', urgencia:'alta', publicoAlvo:'Adultos, obesos, histórico familiar' },
  { id:'14', titulo:'Câncer: Rastreamento que Salva Vidas', categoria:'Prevenção', resumo:'Detecção precoce aumenta em até 95% a chance de cura.', conteudo:'Os programas de rastreamento do INCA e sociedades médicas recomendam exames periódicos para os cânceres mais prevalentes. O câncer de mama é o mais comum em mulheres; o de próstata em homens. Câncer colorretal é o 3º mais comum em ambos os sexos.', detalhes:['Mama: mamografia 40+ anual (SBM) ou 50+ bienal (INCA)','Colo uterino: Papanicolau 25-64 anos, a cada 3 anos','Colorretal: colonoscopia 45+ a cada 10 anos','Próstata: PSA + toque 50+ (45 se negro ou histórico)','Pulmão: TC baixa dose 50-80 anos, ≥20 maços-ano','Pele: autoexame mensal, dermatologista anual','Sinais de alerta: ABCDE (melanoma), sangramento'], fonte:'INCA / SBM / SBU / ACS 2025', icone:'🎗️', urgencia:'alta', publicoAlvo:'Adultos >40 anos' },

  // ── SAÚDE DA MULHER ───────────────────────────────────────
  { id:'15', titulo:'Saúde da Mulher: Exames Preventivos', categoria:'Saúde da Mulher', resumo:'Papanicolau e mamografia são os pilares da prevenção feminina.', conteudo:'Além do rastreamento oncológico, a saúde da mulher inclui planejamento reprodutivo, saúde óssea e cardiovascular. Após a menopausa, o risco cardiovascular se iguala ao do homem. A reposição hormonal deve ser individualizada.', detalhes:['Papanicolau: início aos 25 anos, a cada 3 anos','Mamografia: 40+ anual (SBM/CBR)','Densitometria óssea: 65+ ou pós-menopausa precoce','Perfil lipídico e glicemia: a partir dos 20 anos','Ácido fólico: 400mcg/dia se planeja engravidar','Endometriose: dor pélvica + infertilidade — investigar','Menopausa: TRH individualizada (janela de oportunidade)'], fonte:'FEBRASGO / SBM / INCA / MS', icone:'👩', urgencia:'media', publicoAlvo:'Mulheres' },
  { id:'16', titulo:'Gestação Saudável: Pré-natal completo', categoria:'Saúde da Mulher', resumo:'Mínimo 6 consultas de pré-natal (MS). Ideal: mensal até 28 sem, quinzenal até 36, semanal até o parto.', conteudo:'O pré-natal adequado reduz mortalidade materna e neonatal. Exames essenciais: hemograma, tipagem, glicemia, sorologias (HIV, sífilis, hepatite B, toxoplasmose), urina, ultrassom morfológico (20-24 sem), TOTG 75g (24-28 sem).', detalhes:['Ácido fólico: 400mcg/dia (4 sem antes até 12 sem)','Ferro: 40mg/dia a partir do 2º trimestre','Vacinas: dTpa (20ª sem), Influenza','Ganho de peso: IMC normal 11,5-16kg total','Sinais de alerta: sangramento, PA >140/90, edema súbito','Aleitamento materno exclusivo: 6 meses (OMS)','Parto: escolha informada — via de parto não é preferência'], fonte:'MS / FEBRASGO / OMS / NICE', icone:'🤰', urgencia:'alta', publicoAlvo:'Gestantes' },

  // ── SAÚDE DO HOMEM ────────────────────────────────────────
  { id:'17', titulo:'Saúde do Homem: Check-up Essencial', categoria:'Saúde do Homem', resumo:'Homens vivem em média 7 anos menos que mulheres. Prevenção é essencial.', conteudo:'A Política Nacional de Atenção Integral à Saúde do Homem (PNAISH) busca reduzir a morbimortalidade masculina. Homens procuram menos o médico e têm maior prevalência de tabagismo, alcoolismo e comportamentos de risco.', detalhes:['PSA + toque retal: 50+ (45 se histórico ou negro)','Colesterol total e frações: a partir dos 20 anos','Glicemia de jejum: a partir dos 35 anos','Colonoscopia: a partir dos 45 anos','PA: aferição anual a partir dos 18 anos','Testosterona: investigar se fadiga + libido baixa + >40','Não ignore: dor no peito, sangue nas fezes, perda de peso'], fonte:'SBU / AUA / INCA / PNAISH-MS', icone:'👨', urgencia:'media', publicoAlvo:'Homens' },

  // ── EMERGÊNCIAS ───────────────────────────────────────────
  { id:'18', titulo:'Primeiros Socorros: Salve Vidas', categoria:'Emergências', resumo:'Saber agir nos primeiros minutos pode ser a diferença entre vida e morte.', conteudo:'Em emergências, ligue 192 (SAMU) ou 193 (Bombeiros). Cada minuto sem RCP em parada cardíaca reduz 10% a chance de sobrevivência. O DEA (desfibrilador) em locais públicos é obrigatório por lei em muitos estados.', detalhes:['PCR: C-A-B — Compressões (100-120/min), Via Aérea, Respiração','Engasgo: Manobra de Heimlich (5 compressões abdominais)','AVC: F-A-S-T — Face, Arm, Speech, Time → 192','Queimadura: água corrente fria 20 min (não gelo)','Convulsão: proteja a cabeça, lateralize, NÃO coloque nada na boca','Hemorragia: compressão direta com pano limpo','Fratura: imobilize, não tente alinhar'], fonte:'AHA 2025 / SAMU / ILCOR', icone:'🚑', urgencia:'alta', publicoAlvo:'Todos' },
  { id:'19', titulo:'Infarto (IAM): Reconheça e Aja Rápido', categoria:'Emergências', resumo:'Tempo é músculo. Cada minuto conta para salvar o coração.', conteudo:'O infarto agudo do miocárdio (IAM) mata 1 brasileiro a cada 5 minutos. Sintomas clássicos: dor/pressão no peito >20 min, irradiação para braço esquerdo, mandíbula ou costas, sudorese fria, náusea. Em mulheres: sintomas atípicos (fadiga, dispneia).', detalhes:['Ligue 192 (SAMU) imediatamente','AAS 200mg mastigado (se não alérgico)','Tempo porta-balão ideal: <90 minutos','Não dirija — aguarde ambulância','Fatores de risco: HAS, DM, tabagismo, dislipidemia','Prevenção: controle de fatores + exercício + dieta','Reabilitação cardíaca: essencial após o evento'], fonte:'SBC / AHA / ESC 2023', icone:'💔', urgencia:'alta', publicoAlvo:'Todos, especialmente >40 anos' },

  // ── SAÚDE BUCAL ───────────────────────────────────────────
  { id:'20', titulo:'Saúde Bucal: Mais que Estética', categoria:'Saúde Bucal', resumo:'Problemas bucais afetam a saúde sistêmica — periodontite ligada a doenças cardíacas.', conteudo:'A doença periodontal afeta 50% dos adultos brasileiros. Bactérias da boca podem entrar na corrente sanguínea e causar endocardite, agravar diabetes e aumentar risco de parto prematuro. A prevenção é simples e acessível.', detalhes:['Escove 3x/dia com creme dental fluoretado (1.000+ ppm)','Fio dental diário — remove 40% da placa','Dentista: visita a cada 6 meses','Troque a escova a cada 3 meses','Câncer bucal: autoexame mensal (feridas >15 dias)','Crianças: primeira consulta ao 1º dente','Diabéticos: risco 3x maior de periodontite'], fonte:'CFO / ADA / SBP / MS', icone:'🦷', urgencia:'baixa', publicoAlvo:'Todos' },

  // ── SAÚDE INFANTIL ────────────────────────────────────────
  { id:'21', titulo:'Desenvolvimento Infantil: Marcos Importantes', categoria:'Saúde Infantil', resumo:'Acompanhar os marcos do desenvolvimento permite intervenção precoce.', conteudo:'A Caderneta de Saúde da Criança do MS traz os marcos de desenvolvimento motor, linguagem, social e cognitivo. Atrasos identificados precocemente têm melhor prognóstico com estimulação adequada. O pediatra deve avaliar em todas as consultas.', detalhes:['2 meses: sorriso social, sustenta a cabeça brevemente','6 meses: senta com apoio, balbucia, pega objetos','12 meses: anda com apoio, fala 2-3 palavras, pinça','18 meses: anda sozinho, 10+ palavras, torre de 3 cubos','2 anos: corre, frases de 2 palavras, brinca de faz-de-conta','Sinais de alerta: não olha nos olhos, não responde ao nome','TEA: rastreamento M-CHAT aos 18 e 24 meses'], fonte:'SBP / MS / AAP / CDC', icone:'👶', urgencia:'media', publicoAlvo:'Pais, pediatras' },
  { id:'22', titulo:'Aleitamento Materno: O Melhor Alimento', categoria:'Saúde Infantil', resumo:'OMS recomenda aleitamento materno exclusivo até 6 meses e complementado até 2 anos.', conteudo:'O leite materno é o alimento mais completo para o bebê. Contém anticorpos (IgA), probióticos, DHA e todos os nutrientes necessários. Reduz mortalidade infantil em 13%, diarreia em 50%, infecções respiratórias em 33%.', detalhes:['Colostro (1-5 dias): rico em anticorpos — "primeira vacina"','Livre demanda: sem horários fixos','Pega correta: boca bem aberta, aréola visível acima','Não oferecer água, chá ou fórmula sem indicação médica','Banco de Leite Humano: doação salva prematuros','Benefícios para a mãe: reduz câncer de mama e ovário','Volta ao trabalho: direito a 2 pausas de 30 min para amamentar'], fonte:'OMS / MS / SBP / UNICEF', icone:'🤱', urgencia:'media', publicoAlvo:'Mães, gestantes' },

  // ── SAÚDE DO IDOSO ────────────────────────────────────────
  { id:'23', titulo:'Envelhecimento Saudável: Prevenção de Quedas', categoria:'Saúde do Idoso', resumo:'Quedas são a principal causa de morte acidental em idosos >65 anos.', conteudo:'1 em cada 3 idosos cai pelo menos 1 vez por ano. Fraturas de fêmur têm mortalidade de 20-30% em 1 ano. A prevenção envolve exercícios de equilíbrio, revisão de medicamentos, adaptação do ambiente domiciliar e correção visual.', detalhes:['Exercícios: Tai Chi reduz quedas em 50%','Revisão medicamentosa: benzodiazepínicos, anti-hipertensivos','Ambiente: barras no banheiro, iluminação, tapetes antiderrapantes','Vitamina D: 800-1.000 UI/dia (previne quedas e fraturas)','Calçados: sola antiderrapante, evitar chinelos','Visão: consulta oftalmológica anual','Osteoporose: densitometria + cálcio + vitamina D'], fonte:'SBGG / OMS / AGS / Cochrane', icone:'🧓', urgencia:'alta', publicoAlvo:'Idosos >65 anos, cuidadores' },
  { id:'24', titulo:'Demência e Alzheimer: Sinais Precoces', categoria:'Saúde do Idoso', resumo:'Diagnóstico precoce permite tratamento que retarda a progressão.', conteudo:'A doença de Alzheimer é a causa mais comum de demência (60-70%). Afeta 1,2 milhão de brasileiros. Novos tratamentos anti-amiloide (lecanemab, donanemab) mostram benefício em fases iniciais. Fatores modificáveis podem prevenir até 40% dos casos.', detalhes:['Sinais precoces: esquecimento recente, desorientação, dificuldade com palavras','Mini-Mental (MEEM): rastreamento — ponto de corte varia por escolaridade','12 fatores modificáveis (Lancet 2024): educação, audição, depressão, isolamento, HAS, DM, obesidade, sedentarismo, tabagismo, álcool, poluição, TCE','Reserva cognitiva: leitura, jogos, socialização, música','Cuidador: atenção ao estresse e burnout do cuidador','ILPI: quando necessário, sem culpa'], fonte:'ABN / Lancet Commission 2024 / Alzheimer Association', icone:'🧩', urgencia:'alta', publicoAlvo:'Idosos, familiares' },

  // ── SAÚDE OCUPACIONAL ─────────────────────────────────────
  { id:'25', titulo:'Ergonomia no Trabalho: Previna LER/DORT', categoria:'Saúde Ocupacional', resumo:'Lesões por esforço repetitivo afetam milhões de trabalhadores brasileiros.', conteudo:'LER/DORT são a principal causa de afastamento do trabalho no Brasil. Incluem tendinite, síndrome do túnel do carpo, epicondilite e cervicalgia. A prevenção envolve ergonomia adequada, pausas regulares e ginástica laboral.', detalhes:['Monitor: topo na altura dos olhos, 50-70cm de distância','Cadeira: pés apoiados, joelhos 90°, lombar apoiada','Pausas: 5-10 min a cada 50 min de trabalho','Mouse e teclado: punho neutro, sem apoio rígido','Ginástica laboral: 10-15 min/dia','NR-17: norma regulamentadora de ergonomia','Sintomas persistentes: procure médico do trabalho'], fonte:'COFFITO / MTE NR-17 / INSS', icone:'💻', urgencia:'media', publicoAlvo:'Trabalhadores de escritório' },

  // ── DOENÇAS INFECCIOSAS ───────────────────────────────────
  { id:'26', titulo:'Dengue: Prevenção e Sinais de Alarme', categoria:'Doenças Infecciosas', resumo:'Brasil registrou 6 milhões de casos em 2024. Conheça os sinais de gravidade.', conteudo:'A dengue é transmitida pelo Aedes aegypti. Sintomas: febre alta (39-40°C), dor retro-orbital, mialgia, artralgia, exantema. A maioria dos casos é leve, mas a dengue grave (hemorrágica) pode ser fatal. Hidratação é o pilar do tratamento.', detalhes:['Sinais de alarme: dor abdominal intensa, vômitos persistentes, sangramento','Prova do laço: >20 petéquias (adulto) = positiva','Hidratação: 60-80 mL/kg/dia (adulto) VO','NÃO use AAS ou ibuprofeno (risco de sangramento)','Paracetamol: analgésico de escolha','Vacina Qdenga: 4-60 anos, 2 doses (aprovada ANVISA)','Prevenção: elimine água parada, use repelente DEET'], fonte:'MS / OPAS / OMS / ANVISA', icone:'🦟', urgencia:'alta', publicoAlvo:'Todos (áreas endêmicas)' },
  { id:'27', titulo:'ISTs: Prevenção e Testagem Regular', categoria:'Doenças Infecciosas', resumo:'HIV, sífilis e HPV são preveníveis. Teste-se regularmente.', conteudo:'As Infecções Sexualmente Transmissíveis (ISTs) afetam milhões de brasileiros. A sífilis congênita aumentou 1.000% em 10 anos. O HIV tem tratamento eficaz (indetectável = intransmissível). O HPV causa câncer de colo uterino — a vacina previne.', detalhes:['Preservativo: método mais eficaz de prevenção','PrEP (HIV): 1 comprimido/dia para grupos de risco','PEP (HIV): até 72h após exposição — emergência','Teste rápido: HIV, sífilis, hepatite B/C — gratuito no SUS','HPV: vacina 9-14 anos (meninos e meninas) — 2 doses','Sífilis: penicilina benzatina é o tratamento','I=I: pessoa com HIV indetectável não transmite'], fonte:'MS / UNAIDS / OMS / SBI', icone:'🛡️', urgencia:'alta', publicoAlvo:'Adultos sexualmente ativos' },

  // ── SAÚDE DIGITAL ─────────────────────────────────────────
  { id:'28', titulo:'Saúde Digital: Uso Consciente de Telas', categoria:'Saúde Digital', resumo:'Uso excessivo de telas afeta sono, visão, postura e saúde mental.', conteudo:'Brasileiros passam em média 9h/dia em telas. A luz azul suprime melatonina e prejudica o sono. A síndrome visual do computador (CVS) afeta 70% dos usuários. Redes sociais estão associadas a aumento de ansiedade e depressão em jovens.', detalhes:['Regra 20-20-20: a cada 20 min, olhe 20 pés (6m) por 20 seg','Crianças <2 anos: zero telas (OMS/SBP)','2-5 anos: máximo 1h/dia com supervisão','Filtro de luz azul: ativar após 18h','Postura: monitor na altura dos olhos','Redes sociais: limite 30 min/dia para saúde mental','Nomofobia: medo de ficar sem celular — busque ajuda'], fonte:'OMS / SBP / AAP / SBO', icone:'📱', urgencia:'media', publicoAlvo:'Todos, especialmente jovens' },

  // ── MEIO AMBIENTE E SAÚDE ─────────────────────────────────
  { id:'29', titulo:'Poluição do Ar e Saúde Respiratória', categoria:'Meio Ambiente', resumo:'Poluição do ar causa 7 milhões de mortes prematuras por ano no mundo.', conteudo:'Material particulado (PM2.5) penetra nos alvéolos e entra na corrente sanguínea. Aumenta risco de asma, DPOC, câncer de pulmão, AVC e demência. Queimadas no Brasil agravam o problema sazonalmente. Grupos vulneráveis: crianças, idosos, cardiopatas.', detalhes:['PM2.5 >25 μg/m³: prejudicial (OMS: <5 μg/m³ ideal)','Dias de alta poluição: evite exercício ao ar livre','Use máscara N95/PFF2 em dias críticos','Plantas purificadoras: espada-de-são-jorge, jiboia','Umidificador: alivia ressecamento em queimadas','Asma: mantenha bombinha de resgate acessível','Monitoramento: app IQAir para qualidade do ar'], fonte:'OMS / SBPT / Lancet Countdown', icone:'🌫️', urgencia:'media', publicoAlvo:'Todos' },

  // ── PRIMEIROS SOCORROS PSICOLÓGICOS ───────────────────────
  { id:'30', titulo:'Primeiros Socorros Psicológicos', categoria:'Saúde Mental', resumo:'Saber acolher alguém em crise emocional é tão importante quanto RCP.', conteudo:'Os Primeiros Socorros Psicológicos (PSP) são uma abordagem baseada em evidências para ajudar pessoas em sofrimento agudo. Não é psicoterapia — é acolhimento humanizado. Qualquer pessoa pode aprender. O modelo RAPID (OMS) é o mais utilizado.', detalhes:['R: Rapport — estabeleça conexão empática','A: Assessment — avalie necessidades e riscos','P: Prioritize — identifique o mais urgente','I: Intervention — ofereça suporte prático','D: Disposition — encaminhe para ajuda profissional','NÃO diga: "vai passar", "poderia ser pior", "seja forte"','DIGA: "estou aqui", "como posso ajudar?", "você não está sozinho"'], fonte:'OMS / IASC / Cruz Vermelha / CFP', icone:'🤝', urgencia:'alta', publicoAlvo:'Todos' },
];

const CATS = ['Todas', ...[...new Set(TIPS.map(t => t.categoria))].sort()];
const URGENCIA_COLORS = { baixa: 'text-green-400 bg-green-400/10', media: 'text-yellow-400 bg-yellow-400/10', alta: 'text-red-400 bg-red-400/10' };
const URGENCIA_LABELS = { baixa: 'Informativo', media: 'Importante', alta: 'Essencial' };

export default function HealthTips() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('Todas');
  const [sel, setSel] = useState<Tip | null>(null);
  const [urgFilter, setUrgFilter] = useState<string>('todas');

  const filtered = useMemo(() => TIPS.filter(t => {
    const s = search.toLowerCase();
    const matchSearch = !s || t.titulo.toLowerCase().includes(s) || t.resumo.toLowerCase().includes(s) || t.conteudo.toLowerCase().includes(s);
    const matchCat = cat === 'Todas' || t.categoria === cat;
    const matchUrg = urgFilter === 'todas' || t.urgencia === urgFilter;
    return matchSearch && matchCat && matchUrg;
  }), [search, cat, urgFilter]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-6xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="Dicas de Saúde Baseadas em Evidências" showEmergencyInfo />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">💡</span> Dicas de Saúde Baseadas em Evidências
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {TIPS.length} artigos validados por fontes médicas oficiais (OMS, MS, sociedades médicas)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { v: TIPS.length, l: 'Artigos', c: 'text-primary' },
          { v: new Set(TIPS.map(t => t.categoria)).size, l: 'Categorias', c: 'text-blue-400' },
          { v: TIPS.filter(t => t.urgencia === 'alta').length, l: 'Essenciais', c: 'text-red-400' },
          { v: TIPS.filter(t => t.categoria === 'Prevenção').length, l: 'Prevenção', c: 'text-green-400' },
          { v: new Set(TIPS.flatMap(t => t.fonte.split(' / '))).size, l: 'Fontes Oficiais', c: 'text-orange-400' },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${s.c}`}>{s.v}</div>
            <div className="text-xs text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por doença, sintoma, tema..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary outline-none"
        />
        <div className="flex flex-wrap gap-2">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${cat === c ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['todas', 'alta', 'media', 'baixa'].map(u => (
            <button key={u} onClick={() => setUrgFilter(u)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${urgFilter === u ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
              {u === 'todas' ? 'Todas Prioridades' : URGENCIA_LABELS[u as keyof typeof URGENCIA_LABELS]}
            </button>
          ))}
        </div>
      </div>

      {/* Detail View */}
      {sel ? (
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <button onClick={() => setSel(null)} className="text-primary text-sm hover:underline">← Voltar para lista</button>

          <div className="flex items-start gap-4">
            <span className="text-5xl">{sel.icone}</span>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold">{sel.titulo}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{sel.categoria}</span>
                {sel.urgencia && <span className={`text-xs px-2 py-0.5 rounded-full ${URGENCIA_COLORS[sel.urgencia]}`}>{URGENCIA_LABELS[sel.urgencia]}</span>}
                {sel.publicoAlvo && <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">👥 {sel.publicoAlvo}</span>}
              </div>
            </div>
          </div>

          <div className="bg-muted/20 rounded-lg p-4">
            <p className="text-sm text-foreground/90 leading-relaxed">{sel.conteudo}</p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3 text-primary">Pontos-chave:</h3>
            <div className="space-y-2">
              {sel.detalhes.map((d, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5 shrink-0">●</span>
                  <span className="text-foreground/80">{d}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-400"><strong>Fontes:</strong> {sel.fonte}</p>
          </div>

          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-xs text-yellow-400">⚠️ Informações de caráter educacional. Não substituem consulta médica profissional. Em emergências, ligue 192 (SAMU).</p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-3">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(t => (
              <button key={t.id} onClick={() => setSel(t)} className="bg-card border border-border rounded-xl p-4 text-left hover:bg-accent hover:border-primary/50 transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{t.icone}</span>
                  <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{t.categoria}</span>
                  {t.urgencia && <span className={`text-xs px-2 py-0.5 rounded-full ${URGENCIA_COLORS[t.urgencia]}`}>{URGENCIA_LABELS[t.urgencia]}</span>}
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{t.titulo}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{t.resumo}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-2">Fonte: {t.fonte}</p>
              </button>
            ))}
            {!filtered.length && (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                <p className="text-4xl mb-2">🔍</p>
                <p>Nenhuma dica encontrada para esta busca.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
