import React, { useState } from 'react';
import { trpc } from '../../lib/trpc';
import { toast } from 'sonner';
import EducationalDisclaimer from './EducationalDisclaimer';

// ─── PROTOCOLOS OFFLINE COMPLETOS ─────────────────────────────────
interface ProtocolStep {
  title: string;
  content: string;
  highlight?: 'green' | 'yellow' | 'red' | 'blue';
}

interface Protocol {
  name: string;
  icon: string;
  category: string;
  sources: string[];
  summary: string;
  criteria: string[];
  flowchart: ProtocolStep[];
  treatment: string[];
  referral: string[];
  references: string[];
}

const OFFLINE_PROTOCOLS: Protocol[] = [
  {
    name: 'Hipertensão Arterial Sistêmica',
    icon: '💓',
    category: 'Cardiologia',
    sources: ['SBC 2020', 'ESC/ESH 2023', 'AHA/ACC 2017'],
    summary: 'Manejo da hipertensão arterial sistêmica conforme diretrizes brasileiras e internacionais. Meta pressórica geral < 130/80 mmHg para maioria dos pacientes.',
    criteria: [
      'PAS ≥ 140 mmHg e/ou PAD ≥ 90 mmHg (consultório)',
      'MAPA 24h: ≥ 130/80 mmHg',
      'MRPA: ≥ 135/85 mmHg',
      'Classificação: Ótima (<120/80), Normal (120-129/80-84), Pré-HAS (130-139/85-89), HAS Estágio 1 (140-159/90-99), HAS Estágio 2 (160-179/100-109), HAS Estágio 3 (≥180/≥110)',
    ],
    flowchart: [
      { title: '1. Avaliação Inicial', content: 'Confirmar diagnóstico com 2 medidas em 2 consultas OU MAPA/MRPA. Avaliar LOA (lesão de órgão-alvo), risco CV global e causas secundárias.', highlight: 'blue' },
      { title: '2. Estratificação de Risco', content: 'Usar calculadora de risco CV (Framingham adaptado ou SCORE2). Avaliar: DM, DRC, LOA, DCV estabelecida, fatores de risco adicionais.', highlight: 'blue' },
      { title: '3. MEV (Mudanças de Estilo de Vida)', content: 'Restrição de sódio (<2g/dia), dieta DASH, exercício aeróbico (150min/sem), perda de peso (IMC <25), cessação tabágica, moderação de álcool.', highlight: 'green' },
      { title: '4. Monoterapia Inicial', content: 'IECA ou BRA (preferidos em jovens, DM, DRC) OU BCC (preferido em idosos, negros) OU Tiazídico (clortalidona ou indapamida).', highlight: 'yellow' },
      { title: '5. Terapia Combinada', content: 'Se PAS ≥ 20 ou PAD ≥ 10 acima da meta: iniciar combinação dupla. Preferir: IECA/BRA + BCC ou IECA/BRA + Tiazídico.', highlight: 'yellow' },
      { title: '6. HAS Resistente', content: 'PAS não controlada com 3 drogas (incluindo diurético) em doses otimizadas. Adicionar espironolactona 25-50mg. Investigar causas secundárias.', highlight: 'red' },
    ],
    treatment: [
      '1ª linha: IECA (enalapril 10-40mg, ramipril 2.5-10mg) ou BRA (losartana 50-100mg, valsartana 80-320mg)',
      '1ª linha: BCC (anlodipino 5-10mg, nifedipino retard 30-60mg)',
      '1ª linha: Tiazídico (clortalidona 12.5-25mg, indapamida 1.5mg)',
      '2ª linha: Espironolactona 25-50mg (HAS resistente)',
      '3ª linha: Betabloqueador (se IC, FA, angina), Alfa-bloqueador, Hidralazina, Clonidina',
      'Emergência hipertensiva: Nitroprussiato IV, Nitroglicerina IV, Labetalol IV',
    ],
    referral: [
      'HAS resistente (3 drogas em doses otimizadas)',
      'Suspeita de HAS secundária (jovem, hipocalemia, sopro renal)',
      'LOA avançada (DRC estágio 4-5, retinopatia grau III-IV)',
      'Emergência/Urgência hipertensiva com LOA aguda',
    ],
    references: [
      'Barroso WKS et al. Diretrizes Brasileiras de Hipertensão Arterial 2020. Arq Bras Cardiol. 2021;116(3):516-658',
      'Mancia G et al. 2023 ESH Guidelines. J Hypertens. 2023;41(12):1874-2071',
      'Whelton PK et al. 2017 ACC/AHA Guideline. J Am Coll Cardiol. 2018;71(19):e127-e248',
    ],
  },
  {
    name: 'Infarto Agudo do Miocárdio com Supra de ST',
    icon: '🫀',
    category: 'Cardiologia',
    sources: ['SBC 2019', 'ESC 2023', 'AHA/ACC 2013'],
    summary: 'Protocolo de manejo do IAMCSST — tempo porta-balão < 90 min ou porta-agulha < 30 min. Mortalidade reduzida com reperfusão precoce.',
    criteria: [
      'Dor torácica típica > 20 min + Supra de ST ≥ 1mm em 2 derivações contíguas',
      'Ou BRE novo + clínica sugestiva (critérios de Sgarbossa)',
      'Ou Infra de ST V1-V3 (IAM posterior) — solicitar V7-V9',
      'Troponina elevada (confirma, mas NÃO aguardar para iniciar reperfusão)',
    ],
    flowchart: [
      { title: '1. Reconhecimento (< 10 min)', content: 'ECG 12 derivações em até 10 min da chegada. Se supra de ST → ativar protocolo de reperfusão imediatamente.', highlight: 'red' },
      { title: '2. Terapia Inicial (MONAB)', content: 'Morfina (se dor refratária), O₂ (se SpO₂ < 90%), Nitrato SL (se PAS > 90), AAS 300mg VO, Beta-bloqueador (se sem contraindicação).', highlight: 'yellow' },
      { title: '3. Antitrombóticos', content: 'AAS 300mg + Clopidogrel 300-600mg (ou Ticagrelor 180mg). Heparina não fracionada IV ou Enoxaparina SC.', highlight: 'yellow' },
      { title: '4a. ICP Primária (preferida)', content: 'Se disponível em < 120 min: Angioplastia primária com stent. Meta: porta-balão < 90 min. Acesso radial preferido.', highlight: 'green' },
      { title: '4b. Fibrinólise', content: 'Se ICP não disponível em < 120 min: Tenecteplase (TNK) peso-ajustada ou Alteplase. Porta-agulha < 30 min. Contraindicações absolutas: AVC hemorrágico, neoplasia SNC, sangramento ativo.', highlight: 'red' },
      { title: '5. Pós-reperfusão', content: 'Monitorização em UCO 24-48h. Ecocardiograma. Estatina de alta potência. IECA/BRA. Beta-bloqueador. DAPT por 12 meses.', highlight: 'blue' },
    ],
    treatment: [
      'AAS 100mg/dia indefinidamente + Clopidogrel 75mg ou Ticagrelor 90mg 2x/dia por 12 meses',
      'Atorvastatina 80mg ou Rosuvastatina 40mg (alta intensidade)',
      'IECA (ramipril 10mg) ou BRA se intolerância — iniciar em 24h',
      'Beta-bloqueador (metoprolol, carvedilol) — iniciar em 24h se estável',
      'Espironolactona 25mg se FEVE ≤ 40% + IC ou DM',
      'Anticoagulação: Enoxaparina 1mg/kg SC 12/12h durante internação',
    ],
    referral: [
      'Todo IAMCSST → Hemodinâmica para ICP primária (se disponível)',
      'Choque cardiogênico → UTI + suporte mecânico',
      'Complicações mecânicas (CIV, ruptura de parede livre, IM aguda)',
      'Arritmias ventriculares sustentadas',
    ],
    references: [
      'Nicolau JC et al. Diretriz da SBC sobre IAMCSST. Arq Bras Cardiol. 2019;113(3):449-663',
      'Byrne RA et al. 2023 ESC Guidelines for ACS. Eur Heart J. 2023;44(38):3720-3826',
      'O\'Gara PT et al. 2013 ACCF/AHA STEMI Guideline. Circulation. 2013;127(4):e362-e425',
    ],
  },
  {
    name: 'Sepse e Choque Séptico',
    icon: '🦠',
    category: 'Emergência/UTI',
    sources: ['Surviving Sepsis 2021', 'ILAS 2018', 'SBC/AMIB'],
    summary: 'Bundle da primeira hora: reconhecimento precoce, lactato, hemoculturas, antibiótico empírico e ressuscitação volêmica agressiva. Mortalidade aumenta 7.6% a cada hora de atraso no ATB.',
    criteria: [
      'Sepse: Infecção suspeita/confirmada + SOFA ≥ 2 (ou aumento ≥ 2 do basal)',
      'Choque séptico: Sepse + necessidade de vasopressor para PAM ≥ 65 + Lactato > 2 mmol/L após ressuscitação',
      'Triagem: qSOFA ≥ 2 (FR ≥ 22, PAS ≤ 100, Glasgow < 15) → avaliar SOFA',
    ],
    flowchart: [
      { title: '1. Reconhecimento (Hora Zero)', content: 'Suspeita de infecção + qSOFA ≥ 2 ou sinais de disfunção orgânica. Ativar protocolo de sepse. Hora zero = momento da identificação.', highlight: 'red' },
      { title: '2. Lactato (< 30 min)', content: 'Coletar lactato arterial. Se > 2 mmol/L: repetir em 2-4h. Meta: clearance > 10% ou normalização.', highlight: 'yellow' },
      { title: '3. Hemoculturas (< 45 min)', content: '2 sets de hemoculturas (aeróbio + anaeróbio) de sítios diferentes ANTES do ATB. Não atrasar ATB se coleta demorar.', highlight: 'yellow' },
      { title: '4. Antibiótico (< 1 hora)', content: 'ATB empírico de amplo espectro IV. Foco pulmonar: Ceftriaxona + Azitromicina. Abdominal: Piperacilina-tazobactam. Urinário: Ceftriaxona. Pele: Oxacilina + Ceftriaxona.', highlight: 'red' },
      { title: '5. Ressuscitação Volêmica', content: 'Cristaloide 30 mL/kg nas primeiras 3h (Ringer Lactato preferido). Reavaliar responsividade a volume: elevação passiva de MMII, variação de PP, ecografia point-of-care.', highlight: 'green' },
      { title: '6. Vasopressor', content: 'Se PAM < 65 após volume: Noradrenalina 0.1-2 mcg/kg/min (1ª escolha). Se refratário: adicionar Vasopressina 0.03 UI/min. Se disfunção miocárdica: Dobutamina.', highlight: 'red' },
      { title: '7. Reavaliação (1-6h)', content: 'Reavaliar perfusão: lactato, diurese (>0.5 mL/kg/h), TEC, mottling. Ajustar ATB conforme culturas em 48-72h. Controle glicêmico (< 180 mg/dL). Profilaxia de TVP e úlcera de estresse.', highlight: 'blue' },
    ],
    treatment: [
      'Cristaloide: Ringer Lactato 30 mL/kg em 3h (preferido sobre SF 0.9%)',
      'Noradrenalina: 0.1-2 mcg/kg/min IV (vasopressor de 1ª escolha)',
      'Vasopressina: 0.03 UI/min (adjuvante para reduzir dose de noradrenalina)',
      'Hidrocortisona: 200mg/dia IV (se choque refratário a vasopressores)',
      'ATB empírico: ajustar conforme foco e epidemiologia local',
      'Hemotransfusão: se Hb < 7 g/dL (alvo 7-9 g/dL)',
    ],
    referral: [
      'Todo paciente com sepse → internação em UTI ou semi-intensiva',
      'Choque séptico → UTI obrigatória',
      'Necessidade de ventilação mecânica',
      'Foco cirúrgico (abscesso, peritonite, fasciíte necrotizante)',
    ],
    references: [
      'Evans L et al. Surviving Sepsis Campaign 2021. Crit Care Med. 2021;49(11):e1063-e1143',
      'ILAS. Protocolo de Tratamento da Sepse. Instituto Latino-Americano de Sepse. 2018',
      'Singer M et al. Sepsis-3 Definitions. JAMA. 2016;315(8):801-810',
    ],
  },
  {
    name: 'AVC Isquêmico Agudo',
    icon: '🧠',
    category: 'Neurologia',
    sources: ['AHA/ASA 2019', 'SBN 2021', 'ESO 2021'],
    summary: 'Janela terapêutica: trombólise IV até 4.5h e trombectomia mecânica até 24h (com seleção por imagem). Tempo é cérebro — cada minuto sem reperfusão = 1.9 milhão de neurônios perdidos.',
    criteria: [
      'Déficit neurológico focal agudo (hemiparesia, afasia, hemianopsia, negligência)',
      'TC de crânio sem hemorragia',
      'Início dos sintomas < 4.5h para trombólise IV',
      'Oclusão de grande vaso + mismatch perfusão/core para trombectomia (até 24h)',
    ],
    flowchart: [
      { title: '1. Porta-TC (< 25 min)', content: 'ABC, glicemia capilar, ECG, acesso venoso. TC de crânio SEM contraste urgente. Excluir hemorragia. NIHSS.', highlight: 'red' },
      { title: '2. Avaliação para Trombólise', content: 'Se < 4.5h e sem contraindicações: Alteplase 0.9 mg/kg IV (máx 90mg), 10% em bolus + 90% em 1h. Se < 3h: critérios mais permissivos.', highlight: 'red' },
      { title: '3. Avaliação para Trombectomia', content: 'Se oclusão de grande vaso (ACI, M1, basilar): AngioTC. Se < 6h: trombectomia direta. Se 6-24h: selecionar por perfusão (DAWN/DEFUSE-3).', highlight: 'red' },
      { title: '4. Manejo PA', content: 'Se candidato a trombólise: PA < 185/110 antes e < 180/105 após. Se não trombólise: permitir PA até 220/120 nas primeiras 24h (hipertensão permissiva).', highlight: 'yellow' },
      { title: '5. Cuidados Gerais', content: 'Monitorização neurológica (NIHSS seriado). Glicemia 140-180 mg/dL. Temperatura < 37.5°C. Cabeceira 30°. Disfagia screening antes de VO. Profilaxia TVP.', highlight: 'green' },
      { title: '6. Prevenção Secundária', content: 'AAS 100-300mg (iniciar 24h pós-trombólise). Estatina alta potência. Investigar etiologia (ECO, Holter, angioTC). Se FA: anticoagulação em 4-14 dias.', highlight: 'blue' },
    ],
    treatment: [
      'Alteplase (rt-PA): 0.9 mg/kg IV (máx 90mg) — 10% bolus + 90% em 1h',
      'Tenecteplase: 0.25 mg/kg IV bolus (alternativa em estudos recentes)',
      'Trombectomia mecânica: stent retriever ou aspiração direta',
      'AAS 100-300mg/dia + Clopidogrel 75mg (DAPT por 21 dias se AVC minor/AIT)',
      'Atorvastatina 80mg/dia (LDL alvo < 70 mg/dL)',
      'Anticoagulação (se FA): DOAC preferido (Apixabana, Rivaroxabana)',
    ],
    referral: [
      'Todo AVC agudo → Centro de AVC ou Unidade de AVC',
      'Oclusão de grande vaso → Hemodinâmica para trombectomia',
      'AVC maligno (edema cerebral) → Neurocirurgia (craniectomia descompressiva)',
      'Estenose carotídea > 70% sintomática → Endarterectomia em 2 semanas',
    ],
    references: [
      'Powers WJ et al. AHA/ASA Guidelines for Stroke. Stroke. 2019;50(12):e344-e418',
      'Turc G et al. ESO Guidelines. Eur Stroke J. 2019;4(1):6-12',
      'Nogueira RG et al. DAWN Trial. N Engl J Med. 2018;378(1):11-21',
      'Albers GW et al. DEFUSE-3 Trial. N Engl J Med. 2018;378(8):708-718',
    ],
  },
  {
    name: 'Pneumonia Adquirida na Comunidade',
    icon: '🫁',
    category: 'Pneumologia',
    sources: ['SBPT 2022', 'ATS/IDSA 2019', 'NICE 2019'],
    summary: 'Estratificação por CURB-65 ou PSI para definir local de tratamento. Antibioticoterapia empírica precoce (< 4h) reduz mortalidade.',
    criteria: [
      'Sintomas respiratórios agudos (tosse, dispneia, dor pleurítica) + febre',
      'Infiltrado novo no RX de tórax',
      'Excluir: TB, TEP, IC descompensada, neoplasia',
    ],
    flowchart: [
      { title: '1. Diagnóstico', content: 'Clínica + RX tórax PA e perfil. Laboratório: hemograma, PCR, ureia, gasometria (se grave). Considerar TC se RX inconclusivo.', highlight: 'blue' },
      { title: '2. Estratificação (CURB-65)', content: '0-1: ambulatorial. 2: internação em enfermaria. 3-5: UTI. Avaliar também: SpO₂ < 92%, derrame pleural, multilobar, comorbidades.', highlight: 'yellow' },
      { title: '3. ATB Ambulatorial', content: 'Sem comorbidades: Amoxicilina 500mg 8/8h por 5-7 dias. Com comorbidades: Amoxicilina-clavulanato 875mg 12/12h + Azitromicina 500mg/dia por 5 dias.', highlight: 'green' },
      { title: '4. ATB Enfermaria', content: 'Ceftriaxona 1g IV 12/12h + Azitromicina 500mg IV/dia. Alternativa: Levofloxacino 750mg IV/dia (monoterapia).', highlight: 'yellow' },
      { title: '5. ATB UTI (PAC Grave)', content: 'Ceftriaxona 2g IV/dia + Azitromicina 500mg IV/dia. Se risco de Pseudomonas: Piperacilina-tazobactam + Levofloxacino. Se MRSA: adicionar Vancomicina ou Linezolida.', highlight: 'red' },
      { title: '6. Reavaliação 48-72h', content: 'Melhora clínica → switch IV→VO. Sem melhora → reavaliar diagnóstico, complicações (empiema, abscesso), resistência. Duração total: 5-7 dias (mínimo 5 dias + afebril 48h).', highlight: 'blue' },
    ],
    treatment: [
      'Ambulatorial leve: Amoxicilina 500mg 8/8h VO por 5 dias',
      'Ambulatorial com comorbidades: Amoxicilina-clavulanato 875mg 12/12h + Azitromicina 500mg/dia',
      'Enfermaria: Ceftriaxona 1g IV 12/12h + Azitromicina 500mg IV/dia',
      'UTI: Ceftriaxona 2g IV/dia + Azitromicina 500mg IV/dia',
      'Corticoide: Dexametasona 6mg/dia por 4 dias (se PAC grave com PCR > 150)',
      'Suporte: O₂ para SpO₂ > 92%, hidratação, analgesia',
    ],
    referral: [
      'CURB-65 ≥ 3 ou PSI classe IV-V → UTI',
      'Necessidade de ventilação mecânica',
      'Choque séptico',
      'Derrame pleural complicado/empiema → Drenagem torácica',
    ],
    references: [
      'Corrêa RA et al. Diretrizes SBPT para PAC. J Bras Pneumol. 2022;48(4):e20220261',
      'Metlay JP et al. ATS/IDSA Guidelines for CAP. Am J Respir Crit Care Med. 2019;200(7):e45-e67',
      'NICE. Pneumonia (community-acquired). NG138. 2019',
    ],
  },
  {
    name: 'Cetoacidose Diabética',
    icon: '⚗️',
    category: 'Endocrinologia',
    sources: ['SBD 2022', 'ADA 2024', 'ISPAD 2022'],
    summary: 'Emergência metabólica com mortalidade de 1-5%. Tríade: hiperglicemia, cetose e acidose metabólica. Tratamento: hidratação agressiva, insulina IV e reposição de potássio.',
    criteria: [
      'Glicemia > 250 mg/dL (geralmente > 300)',
      'pH arterial < 7.30 e/ou Bicarbonato < 18 mEq/L',
      'Cetonemia > 3 mmol/L ou cetonúria ≥ 2+',
      'Classificação: Leve (pH 7.25-7.30, Bic 15-18), Moderada (pH 7.0-7.24, Bic 10-14.9), Grave (pH < 7.0, Bic < 10)',
    ],
    flowchart: [
      { title: '1. Avaliação Inicial', content: 'ABC, acesso venoso calibroso, monitorização. Labs: glicemia, gasometria, eletrólitos (Na, K, Cl, Mg, P), ureia, creatinina, hemograma, cetonemia, ECG.', highlight: 'red' },
      { title: '2. Hidratação (1ª hora)', content: 'SF 0.9% 1000-1500 mL na 1ª hora. Se Na > 135: trocar para NaCl 0.45%. Meta: 4-5L nas primeiras 24h. Monitorar balanço hídrico.', highlight: 'red' },
      { title: '3. Potássio (ANTES da insulina)', content: 'Se K < 3.3: repor K 20-40 mEq/h IV e ADIAR insulina. Se K 3.3-5.3: repor K 20-30 mEq/L no soro + iniciar insulina. Se K > 5.3: não repor, monitorar 2/2h.', highlight: 'red' },
      { title: '4. Insulina', content: 'Insulina Regular 0.1 UI/kg/h IV contínua (ou bolus 0.1 UI/kg + 0.1 UI/kg/h). Meta: queda de glicemia 50-70 mg/dL/h. Se queda < 50: dobrar taxa.', highlight: 'yellow' },
      { title: '5. Quando glicemia < 250', content: 'Adicionar SG 5% ao soro (manter glicemia 150-200). Reduzir insulina para 0.05 UI/kg/h. NÃO suspender insulina até resolver cetoacidose.', highlight: 'yellow' },
      { title: '6. Critérios de Resolução', content: 'pH > 7.30 + Bic > 18 + AG < 12 + cetonemia < 1 mmol/L. Transição para insulina SC: aplicar dose SC 1-2h ANTES de suspender bomba IV. Investigar fator precipitante.', highlight: 'green' },
    ],
    treatment: [
      'Hidratação: SF 0.9% 1-1.5L/h na 1ª hora, depois 250-500 mL/h',
      'Insulina Regular: 0.1 UI/kg/h IV contínua',
      'Potássio: 20-40 mEq/L no soro (manter K 4-5 mEq/L)',
      'Bicarbonato: APENAS se pH < 6.9 (100 mL NaHCO₃ 8.4% em 2h)',
      'Fosfato: repor se < 1 mg/dL (K₂HPO₄ 20-30 mEq em 500 mL)',
      'Transição: Insulina SC basal-bolus quando tolerando VO + CAD resolvida',
    ],
    referral: [
      'CAD moderada-grave → UTI',
      'CAD com rebaixamento de consciência → UTI + TC crânio (edema cerebral)',
      'K < 3.3 mEq/L → monitorização contínua',
      'Primeiro episódio de CAD → investigar DM1, avaliar autoanticorpos',
    ],
    references: [
      'Sociedade Brasileira de Diabetes. Diretrizes SBD 2022. Editora Clannad',
      'Kitabchi AE et al. Hyperglycemic crises. Diabetes Care. 2009;32(7):1335-1343',
      'ADA Standards of Care in Diabetes 2024. Diabetes Care. 2024;47(Suppl 1)',
    ],
  },
  {
    name: 'Insuficiência Cardíaca Descompensada',
    icon: '❤️',
    category: 'Cardiologia',
    sources: ['SBC 2018', 'ESC 2021', 'AHA/ACC 2022'],
    summary: 'IC agudamente descompensada — perfil hemodinâmico (quente/frio x seco/úmido) guia o tratamento. Mortalidade intra-hospitalar 4-7%.',
    criteria: [
      'Sintomas de IC (dispneia, ortopneia, edema) com piora aguda',
      'BNP > 100 pg/mL ou NT-proBNP > 300 pg/mL',
      'Classificação funcional NYHA I-IV',
      'Perfil hemodinâmico: A (quente-seco), B (quente-úmido), C (frio-úmido), L (frio-seco)',
    ],
    flowchart: [
      { title: '1. Avaliação Inicial', content: 'Perfil hemodinâmico (congestão x perfusão). Labs: BNP/NT-proBNP, troponina, função renal, eletrólitos, hemograma, TSH. ECG + RX tórax + Ecocardiograma.', highlight: 'blue' },
      { title: '2. Perfil B (Quente-Úmido) — 67%', content: 'Diurético IV: Furosemida 40-80mg IV (dose ≥ dose oral habitual). Vasodilatador: Nitroglicerina IV se PAS > 110. Manter IECA/BRA e BB (reduzir se hipotensão).', highlight: 'yellow' },
      { title: '3. Perfil C (Frio-Úmido) — 28%', content: 'Inotrópico: Dobutamina 2-20 mcg/kg/min. Se PAS < 90: Noradrenalina. Diurético após estabilização hemodinâmica. Considerar dispositivo de assistência ventricular.', highlight: 'red' },
      { title: '4. Perfil L (Frio-Seco) — 5%', content: 'Volume cauteloso (250 mL SF em 15-30 min, reavaliar). Se sem resposta: inotrópico. Avaliar causas: desidratação, diurético excessivo.', highlight: 'yellow' },
      { title: '5. Descongestão', content: 'Meta: perda de peso 0.5-1 kg/dia. Monitorar diurese (>100 mL/h nas primeiras horas). Se resistência a diurético: associar tiazídico (bloqueio sequencial do néfron).', highlight: 'green' },
      { title: '6. Otimização pré-alta', content: 'Iniciar/otimizar: IECA/BRA/ARNI + BB + Espironolactona + iSGLT2 (pilares da IC). Vacinar (influenza, pneumococo). Reabilitação cardíaca. Seguimento em 7-14 dias.', highlight: 'blue' },
    ],
    treatment: [
      'Furosemida 40-240mg IV/dia (ajustar conforme resposta diurética)',
      'Nitroglicerina IV 5-200 mcg/min (se PAS > 110 e congestão)',
      'Dobutamina 2-20 mcg/kg/min (se baixo débito)',
      'Pilares crônicos: IECA/BRA/Sacubitril-valsartana + BB + Espironolactona + Dapagliflozina/Empagliflozina',
      'Hidralazina + Nitrato (se intolerância a IECA/BRA, especialmente afrodescendentes)',
      'Ivabradina (se FC > 70 em ritmo sinusal, apesar de BB)',
    ],
    referral: [
      'Perfil C (choque cardiogênico) → UTI + considerar dispositivo de assistência',
      'IC refratária → Avaliação para transplante cardíaco',
      'FEVE ≤ 35% + QRS ≥ 150ms → TRC (terapia de ressincronização)',
      'FEVE ≤ 35% + classe II-III → CDI (cardiodesfibrilador implantável)',
    ],
    references: [
      'Rohde LEP et al. Diretriz SBC de IC. Arq Bras Cardiol. 2018;111(3):436-539',
      'McDonagh TA et al. 2021 ESC Guidelines for HF. Eur Heart J. 2021;42(36):3599-3726',
      'Heidenreich PA et al. 2022 AHA/ACC/HFSA HF Guideline. Circulation. 2022;145(18):e895-e1032',
    ],
  },
  {
    name: 'Tromboembolismo Pulmonar',
    icon: '🩺',
    category: 'Pneumologia',
    sources: ['ESC 2019', 'SBPT 2020', 'AHA 2011'],
    summary: 'Estratificação de risco com Wells/Geneva + D-dímero + AngioTC. TEP maciço com instabilidade hemodinâmica → trombólise sistêmica.',
    criteria: [
      'Dispneia súbita, dor pleurítica, taquicardia, hemoptise',
      'Wells ≥ 5 (provável) ou Geneva ≥ 11 (provável)',
      'D-dímero > 500 ng/mL (ou ajustado por idade: idade × 10 se > 50 anos)',
      'AngioTC: falha de enchimento em artéria pulmonar',
    ],
    flowchart: [
      { title: '1. Suspeita Clínica', content: 'Avaliar probabilidade pré-teste: Wells ou Geneva. Se baixa probabilidade: aplicar PERC Rule. Se PERC negativo: excluir TEP sem exames.', highlight: 'blue' },
      { title: '2. D-dímero', content: 'Se probabilidade baixa/intermediária: D-dímero. Se negativo (< 500 ou ajustado por idade): excluir TEP. Se positivo: AngioTC.', highlight: 'yellow' },
      { title: '3. AngioTC de Tórax', content: 'Exame confirmatório. Se contraindicação (DRC, alergia): Cintilografia V/Q. Se gestante: preferir cintilografia ou USG de MMII primeiro.', highlight: 'yellow' },
      { title: '4. Estratificação de Risco', content: 'Alto risco (maciço): PAS < 90 ou choque → trombólise. Risco intermediário-alto: VD dilatado + troponina elevada → monitorar em UTI. Baixo risco: sPESI = 0 → considerar tratamento domiciliar.', highlight: 'red' },
      { title: '5. Anticoagulação', content: 'DOAC preferido: Rivaroxabana 15mg 12/12h por 21 dias, depois 20mg/dia. Ou Apixabana 10mg 12/12h por 7 dias, depois 5mg 12/12h. Alternativa: Enoxaparina + Varfarina (INR 2-3).', highlight: 'green' },
      { title: '6. Trombólise (TEP Maciço)', content: 'Alteplase 100mg IV em 2h. Ou Tenecteplase peso-ajustada. Indicação: instabilidade hemodinâmica (PAS < 90 por > 15 min). Se contraindicação: trombectomia cirúrgica ou por cateter.', highlight: 'red' },
    ],
    treatment: [
      'Rivaroxabana 15mg 12/12h × 21d, depois 20mg/dia (preferido)',
      'Apixabana 10mg 12/12h × 7d, depois 5mg 12/12h',
      'Enoxaparina 1mg/kg SC 12/12h + Varfarina (INR 2-3) — bridge',
      'Duração: 3 meses (provocado) ou indefinido (não provocado/recorrente)',
      'Trombólise: Alteplase 100mg IV em 2h (TEP maciço)',
      'Filtro de VCI: se contraindicação absoluta à anticoagulação',
    ],
    referral: [
      'TEP maciço (choque) → UTI + trombólise',
      'TEP submassivo (VD dilatado) → UTI para monitorização',
      'TEP recorrente apesar de anticoagulação → Hematologia',
      'Hipertensão pulmonar tromboembólica crônica → Centro especializado',
    ],
    references: [
      'Konstantinides SV et al. 2019 ESC Guidelines for PE. Eur Heart J. 2020;41(4):543-603',
      'Terra-Filho M et al. Diretrizes SBPT para TEP. J Bras Pneumol. 2020;46(2):e20190252',
      'Jaff MR et al. AHA Scientific Statement on PE. Circulation. 2011;123(16):1788-1830',
    ],
  },
  {
    name: 'Diabetes Mellitus Tipo 2',
    icon: '🩸',
    category: 'Endocrinologia',
    sources: ['SBD 2024', 'ADA 2024', 'EASD 2022'],
    summary: 'Abordagem centrada no paciente: controle glicêmico individualizado (HbA1c < 7% na maioria), proteção cardiorrenal com iSGLT2 e aGLP-1, e manejo multifatorial de fatores de risco.',
    criteria: [
      'Glicemia de jejum ≥ 126 mg/dL (2 ocasiões)',
      'Glicemia 2h pós-TOTG ≥ 200 mg/dL',
      'HbA1c ≥ 6.5%',
      'Glicemia aleatória ≥ 200 mg/dL + sintomas clássicos',
    ],
    flowchart: [
      { title: '1. Diagnóstico e Avaliação', content: 'Confirmar com 2 testes alterados (ou 1 teste + sintomas). Avaliar: HbA1c, perfil lipídico, função renal (TFG + albuminúria), fundo de olho, pé diabético, ECG.', highlight: 'blue' },
      { title: '2. MEV + Metformina', content: 'Dieta + exercício + Metformina 500-2000mg/dia (1ª linha universal). Se HbA1c > 7.5%: considerar terapia combinada inicial.', highlight: 'green' },
      { title: '3. Doença CV Aterosclerótica', content: 'Se DCV estabelecida ou alto risco CV: adicionar aGLP-1 (Liraglutida, Semaglutida) — benefício CV comprovado. Ou iSGLT2 (Empagliflozina, Dapagliflozina).', highlight: 'yellow' },
      { title: '4. Insuficiência Cardíaca', content: 'Se IC (FEVE reduzida ou preservada): iSGLT2 obrigatório (Dapagliflozina 10mg ou Empagliflozina 10mg). Benefício independente do controle glicêmico.', highlight: 'yellow' },
      { title: '5. Doença Renal Crônica', content: 'Se TFG 20-60 ou albuminúria: iSGLT2 (nefroproteção). Se TFG < 20: suspender iSGLT2. Finerenona se albuminúria persistente com IECA/BRA.', highlight: 'yellow' },
      { title: '6. Insulinização', content: 'Se HbA1c > 10% ou sintomas catabólicos: iniciar insulina basal (Glargina 10 UI/dia, titular 2-4 UI a cada 3 dias). Se pós-prandial elevada: adicionar insulina rápida.', highlight: 'red' },
    ],
    treatment: [
      'Metformina 500-2000mg/dia (1ª linha)',
      'iSGLT2: Dapagliflozina 10mg ou Empagliflozina 10mg (cardiorrenal)',
      'aGLP-1: Semaglutida 0.25-1mg/sem SC ou Liraglutida 1.8mg/dia (CV + peso)',
      'iDPP-4: Sitagliptina 100mg/dia (neutro em peso e CV)',
      'Insulina basal: Glargina ou Degludeca (se HbA1c > 10% ou falha oral)',
      'Metas: HbA1c < 7% (geral), < 8% (idoso frágil), < 6.5% (jovem sem hipoglicemia)',
    ],
    referral: [
      'DM1 ou dúvida diagnóstica → Endocrinologista',
      'DRC estágio 4-5 → Nefrologista',
      'Retinopatia diabética → Oftalmologista',
      'Pé diabético com úlcera → Equipe multidisciplinar (vascular + ortopedia)',
      'Gestação com DM → Pré-natal de alto risco',
    ],
    references: [
      'Sociedade Brasileira de Diabetes. Diretrizes SBD 2024',
      'ADA Standards of Care in Diabetes 2024. Diabetes Care. 2024;47(Suppl 1)',
      'Davies MJ et al. ADA/EASD Consensus 2022. Diabetes Care. 2022;45(11):2753-2786',
    ],
  },
  {
    name: 'DPOC Exacerbada',
    icon: '💨',
    category: 'Pneumologia',
    sources: ['GOLD 2024', 'SBPT 2021', 'NICE 2019'],
    summary: 'Exacerbação aguda de DPOC: piora sustentada dos sintomas respiratórios além da variação diária. Classificar gravidade e tratar com broncodilatadores, corticoides e ATB se indicado.',
    criteria: [
      'Piora da dispneia, aumento do volume e/ou purulência do escarro',
      'Classificação: Leve (apenas broncodilatador), Moderada (ATB e/ou corticoide), Grave (internação/UTI)',
      'Critérios de Anthonisen: Tipo 1 (3 sintomas cardinais), Tipo 2 (2 sintomas), Tipo 3 (1 sintoma + infecção)',
    ],
    flowchart: [
      { title: '1. Avaliação', content: 'SpO₂, gasometria (se SpO₂ < 92%), RX tórax (excluir pneumonia, pneumotórax). Labs: hemograma, PCR, BNP (excluir IC). ECG (excluir arritmia, IAM).', highlight: 'blue' },
      { title: '2. Broncodilatadores', content: 'Salbutamol 400-800 mcg (4-8 jatos) + Ipratrópio 80 mcg (4 jatos) via espaçador a cada 20 min na 1ª hora. Depois a cada 4-6h. Nebulização se necessário.', highlight: 'green' },
      { title: '3. Corticoide Sistêmico', content: 'Prednisona 40mg VO/dia por 5 dias. Ou Metilprednisolona 40mg IV se não tolerar VO. NÃO prolongar além de 5-7 dias (sem benefício adicional).', highlight: 'yellow' },
      { title: '4. Antibiótico', content: 'Indicado se: escarro purulento + dispneia/volume aumentado, ou necessidade de VM. 1ª linha: Amoxicilina-clavulanato 875mg 12/12h × 5-7 dias. Alternativa: Azitromicina 500mg/dia × 3 dias.', highlight: 'yellow' },
      { title: '5. Oxigenoterapia', content: 'Alvo SpO₂ 88-92% (CUIDADO com hipercapnia). VNI (BiPAP) se: pH < 7.35 e PaCO₂ > 45 (acidose respiratória). IOT se: pH < 7.25 ou falha de VNI.', highlight: 'red' },
      { title: '6. Pós-exacerbação', content: 'Reavaliar terapia de manutenção (LABA + LAMA ± ICS). Reabilitação pulmonar em 2-4 semanas. Vacinação (influenza, pneumococo, COVID-19). Cessação tabágica.', highlight: 'blue' },
    ],
    treatment: [
      'SABA: Salbutamol 400-800 mcg a cada 4-6h',
      'SAMA: Ipratrópio 80 mcg a cada 6-8h',
      'Prednisona 40mg VO/dia × 5 dias',
      'ATB: Amoxicilina-clavulanato 875mg 12/12h × 5-7 dias',
      'O₂: alvo SpO₂ 88-92% (cateter nasal ou Venturi)',
      'VNI (BiPAP): IPAP 10-20, EPAP 4-8 cmH₂O',
    ],
    referral: [
      'pH < 7.35 com PaCO₂ > 45 → UTI + VNI',
      'Falha de VNI ou pH < 7.25 → IOT + VM',
      'Exacerbações frequentes (≥ 2/ano) → Pneumologista',
      'Candidato a O₂ domiciliar (PaO₂ < 55 ou SpO₂ < 88% em repouso)',
    ],
    references: [
      'GOLD 2024 Report. Global Strategy for DPOC. goldcopd.org',
      'Fernandes FLA et al. Diretrizes SBPT para DPOC. J Bras Pneumol. 2021;47(1):e20210089',
      'NICE. COPD: diagnosis and management. NG115. Updated 2019',
    ],
  },
  {
    name: 'Asma Aguda (Crise Asmática)',
    icon: '🌬️',
    category: 'Pneumologia',
    sources: ['GINA 2024', 'SBPT 2020', 'BTS/SIGN 2019'],
    summary: 'Classificar gravidade da crise (leve/moderada/grave/quase-fatal). Tratamento escalonado: SABA + corticoide sistêmico + ipratrópio. Reavaliação em 1h.',
    criteria: [
      'Dispneia aguda, sibilância, tosse, aperto torácico com piora progressiva',
      'PFE < 80% do previsto (leve), < 60% (moderada), < 40% (grave)',
      'Sinais de gravidade: frases incompletas, FR > 30, FC > 120, SpO₂ < 92%, uso de musculatura acessória',
      'Quase-fatal: sonolência, confusão, tórax silencioso, bradicardia, PFE < 25%',
    ],
    flowchart: [
      { title: '1. Avaliação Rápida', content: 'SpO₂, FR, FC, PFE (se possível), nível de consciência. Classificar: leve-moderada, grave ou quase-fatal. Excluir: anafilaxia, corpo estranho, IC.', highlight: 'red' },
      { title: '2. Leve-Moderada', content: 'Salbutamol 4-8 jatos via espaçador a cada 20 min × 3 doses. Prednisolona 40-50mg VO. O₂ para SpO₂ > 93%. Reavaliar em 1h.', highlight: 'green' },
      { title: '3. Grave', content: 'Salbutamol nebulização contínua (10-15mg/h) + Ipratrópio 500mcg nebulização a cada 20 min × 3. Prednisolona 40-50mg VO ou Hidrocortisona 200mg IV. Sulfato de Magnésio 2g IV em 20 min.', highlight: 'yellow' },
      { title: '4. Quase-Fatal', content: 'IOT + VM se: apneia, rebaixamento, bradicardia. Adrenalina 0.5mg IM (se anafilaxia associada). Aminofilina IV (considerar). UTI imediata.', highlight: 'red' },
      { title: '5. Reavaliação 1h', content: 'Se PFE > 60-80% e estável: alta com Prednisolona 40mg/dia × 5-7 dias + SABA de resgate + agendar consulta em 2-7 dias. Se sem melhora: internar.', highlight: 'blue' },
      { title: '6. Pós-crise', content: 'Revisar terapia de manutenção (Step-up GINA). Iniciar/otimizar ICS + formoterol (MART). Plano de ação escrito. Verificar técnica inalatória e adesão.', highlight: 'blue' },
    ],
    treatment: [
      'SABA: Salbutamol 400-800 mcg (4-8 jatos) a cada 20 min × 3',
      'Ipratrópio: 80 mcg (4 jatos) ou 500 mcg nebulização (se grave)',
      'Prednisolona 40-50mg VO/dia × 5-7 dias',
      'MgSO₄: 2g IV em 20 min (se grave, sem resposta ao SABA)',
      'O₂: alvo SpO₂ 93-95% (adultos)',
      'Manutenção: ICS-formoterol (budesonida-formoterol) como MART',
    ],
    referral: [
      'Crise grave sem resposta em 1h → Internação',
      'Quase-fatal → UTI',
      'Asma de difícil controle (≥ 2 exacerbações/ano) → Pneumologista',
      'Considerar biológicos (anti-IgE, anti-IL5) se asma grave refratária',
    ],
    references: [
      'GINA 2024. Global Strategy for Asthma Management. ginasthma.org',
      'Pizzichini MMM et al. Diretrizes SBPT para Asma. J Bras Pneumol. 2020;46(1):e20190307',
      'BTS/SIGN. British Guideline on Asthma Management. 2019',
    ],
  },
  {
    name: 'Insuficiência Renal Aguda',
    icon: '🫘',
    category: 'Nefrologia',
    sources: ['KDIGO 2012', 'SBN 2021', 'NICE 2019'],
    summary: 'Classificação KDIGO: aumento de creatinina ≥ 0.3 mg/dL em 48h ou ≥ 1.5x basal em 7 dias ou diurese < 0.5 mL/kg/h por 6h. Identificar e tratar causa (pré-renal, renal, pós-renal).',
    criteria: [
      'Estágio 1: Cr ≥ 0.3 acima do basal ou 1.5-1.9x basal ou diurese < 0.5 mL/kg/h por 6-12h',
      'Estágio 2: Cr 2.0-2.9x basal ou diurese < 0.5 mL/kg/h por ≥ 12h',
      'Estágio 3: Cr ≥ 3x basal ou Cr ≥ 4.0 ou diurese < 0.3 mL/kg/h por ≥ 24h ou anúria ≥ 12h ou início de TRS',
    ],
    flowchart: [
      { title: '1. Identificar e Classificar', content: 'Creatinina basal vs atual. Diurese horária. USG renal (excluir obstrução). Urina 1 + sódio urinário + FENa. Classificar: pré-renal (FENa < 1%), renal intrínseca (FENa > 2%), pós-renal (hidronefrose).', highlight: 'blue' },
      { title: '2. Pré-Renal (mais comum)', content: 'Ressuscitação volêmica com cristaloide. Suspender nefrotóxicos (AINEs, aminoglicosídeos, contraste). Otimizar hemodinâmica (PAM > 65). Suspender IECA/BRA temporariamente.', highlight: 'green' },
      { title: '3. Renal Intrínseca', content: 'NTA (necrose tubular aguda): suporte + evitar nefrotóxicos. Nefrite intersticial: suspender droga causadora ± corticoide. Glomerulonefrite: biópsia + imunossupressão conforme tipo.', highlight: 'yellow' },
      { title: '4. Pós-Renal', content: 'Desobstrução urgente: sonda vesical (se bexigoma), nefrostomia ou duplo-J (se obstrução ureteral). Monitorar poliúria pós-obstrutiva.', highlight: 'yellow' },
      { title: '5. Indicações de Diálise de Urgência', content: 'AEIOU: Acidose refratária (pH < 7.1), Eletrólitos (K > 6.5 refratário), Intoxicação (metanol, etilenoglicol, lítio), Overload (edema pulmonar refratário), Uremia (encefalopatia, pericardite).', highlight: 'red' },
      { title: '6. Recuperação', content: 'Monitorar função renal diariamente. Ajustar doses de medicamentos pela TFG. Evitar nefrotóxicos. Seguimento nefrológico se Cr não normalizar em 7-10 dias.', highlight: 'blue' },
    ],
    treatment: [
      'Cristaloide: Ringer Lactato (preferido sobre SF 0.9% — menos acidose hiperclorêmica)',
      'Suspender nefrotóxicos: AINEs, aminoglicosídeos, contraste iodado, IECA/BRA',
      'Furosemida: APENAS para hipervolemia (NÃO para "estimular" diurese)',
      'Hipercalemia: Gluconato de cálcio 10% IV + Insulina 10UI + Glicose 50% + Salbutamol nebulização',
      'Diálise: hemodiálise intermitente ou CRRT (terapia contínua) conforme estabilidade',
      'Bicarbonato: se pH < 7.2 e Bic < 12 (controverso, avaliar caso a caso)',
    ],
    referral: [
      'IRA estágio 3 ou necessidade de diálise → Nefrologia + UTI',
      'Suspeita de glomerulonefrite → Nefrologia (biópsia renal)',
      'Obstrução ureteral → Urologia',
      'IRA sem recuperação em 7-10 dias → Nefrologia (avaliar DRC)',
    ],
    references: [
      'KDIGO Clinical Practice Guideline for AKI. Kidney Int Suppl. 2012;2(1):1-138',
      'Sociedade Brasileira de Nefrologia. Diretrizes para IRA. 2021',
      'NICE. Acute kidney injury: prevention, detection and management. NG148. 2019',
    ],
  },
  {
    name: 'Fibrilação Atrial',
    icon: '💗',
    category: 'Cardiologia',
    sources: ['ESC 2024', 'SBC 2022', 'AHA/ACC 2023'],
    summary: 'Arritmia sustentada mais comum. Abordagem ABC: Anticoagulação (CHA₂DS₂-VASc), Better symptom control (controle de frequência/ritmo), Comorbidades. Risco de AVC 5x maior sem anticoagulação.',
    criteria: [
      'ECG: ausência de ondas P, intervalos RR irregulares, atividade atrial desorganizada',
      'Classificação: Paroxística (<7 dias), Persistente (>7 dias), Permanente (aceita)',
      'CHA₂DS₂-VASc ≥ 2 (homens) ou ≥ 3 (mulheres): anticoagulação obrigatória',
      'HAS-BLED ≥ 3: alto risco de sangramento (não contraindica ACO, mas monitorar)',
    ],
    flowchart: [
      { title: '1. Diagnóstico', content: 'ECG 12 derivações confirmatório. Se paroxística: Holter 24-48h ou monitor de eventos. Labs: TSH, eletrólitos, hemograma, função renal, coagulograma. Ecocardiograma TT.', highlight: 'blue' },
      { title: '2. Anticoagulação (A)', content: 'CHA₂DS₂-VASc ≥ 2 (H) ou ≥ 3 (M): DOAC preferido (Apixabana 5mg 12/12h, Rivaroxabana 20mg/dia, Edoxabana 60mg/dia). Varfarina se: prótese mecânica ou estenose mitral moderada-grave.', highlight: 'red' },
      { title: '3. Controle de Frequência (B)', content: '1ª linha: Betabloqueador (Metoprolol 25-200mg, Bisoprolol 2.5-10mg) ou BCC não-dihidropiridínico (Diltiazem 120-360mg, Verapamil 120-480mg). Alvo FC < 110 bpm (lenient) ou < 80 bpm (strict).', highlight: 'green' },
      { title: '4. Controle de Ritmo', content: 'Se sintomático apesar do controle de frequência: Cardioversão elétrica (se > 48h: ACO 3 semanas antes ou ETE para excluir trombo). Antiarrítmicos: Amiodarona (se IC), Propafenona/Flecainida (se sem cardiopatia).', highlight: 'yellow' },
      { title: '5. Ablação por Cateter', content: 'Indicada se: FA paroxística/persistente sintomática refratária a ≥ 1 antiarrítmico. Isolamento das veias pulmonares. Taxa de sucesso 70-80%. Pode ser 1ª linha em pacientes selecionados (EAST-AFNET 4).', highlight: 'yellow' },
      { title: '6. Comorbidades (C)', content: 'Tratar: HAS, obesidade (perda de 10% reduz recorrência), apneia do sono (CPAP), DM, IC, etilismo. Exercício moderado. Controle de fatores de risco = pilar do tratamento.', highlight: 'blue' },
    ],
    treatment: [
      'DOAC: Apixabana 5mg 12/12h (preferido em idosos e DRC) ou Rivaroxabana 20mg/dia',
      'Betabloqueador: Bisoprolol 2.5-10mg/dia ou Metoprolol 50-200mg/dia',
      'Amiodarona: 200mg/dia (manutenção) — se IC ou cardiopatia estrutural',
      'Propafenona: 150-300mg 8/8h (pill-in-the-pocket para FA paroxística sem cardiopatia)',
      'Digoxina: 0.125-0.25mg/dia (adjuvante se IC com FEVE reduzida)',
      'Cardioversão elétrica: 150-200J bifásica (sincronizada)',
    ],
    referral: [
      'FA com instabilidade hemodinâmica → Cardioversão elétrica de emergência',
      'FA refratária a antiarrítmicos → Ablação por cateter (Eletrofisiologia)',
      'FA + WPW (pré-excitação) → Ablação urgente (risco de FV)',
      'FA valvar (estenose mitral, prótese mecânica) → Cardiologia + Varfarina',
    ],
    references: [
      'Van Gelder IC et al. 2024 ESC Guidelines for AF. Eur Heart J. 2024;45(36):3314-3414',
      'Magalhães LP et al. Diretriz SBC de FA. Arq Bras Cardiol. 2022;119(1):1-96',
      'Joglar JA et al. 2023 ACC/AHA/ACCP/HRS AF Guideline. Circulation. 2024;149(1):e1-e156',
    ],
  },
  {
    name: 'Anafilaxia',
    icon: '⚠️',
    category: 'Emergência',
    sources: ['WAO 2020', 'ASBAI 2022', 'EAACI 2021'],
    summary: 'Reação alérgica sistêmica grave, potencialmente fatal. Adrenalina IM é o tratamento de 1ª linha — atraso na administração aumenta mortalidade. Tempo médio para parada cardíaca: 5 min (IV), 15 min (inseto), 30 min (alimento).',
    criteria: [
      'Critério 1: Pele/mucosa (urticária, angioedema) + respiratório OU hipotensão',
      'Critério 2: ≥ 2 sistemas após exposição a alérgeno provável: pele, respiratório, GI, cardiovascular',
      'Critério 3: Hipotensão após exposição a alérgeno conhecido (PAS < 90 ou queda > 30%)',
    ],
    flowchart: [
      { title: '1. Reconhecimento Imediato', content: 'Identificar sinais: urticária/angioedema + dispneia/sibilância/estridor OU hipotensão/síncope. Remover alérgeno se possível. Chamar ajuda.', highlight: 'red' },
      { title: '2. ADRENALINA IM (1ª LINHA)', content: 'Adrenalina 1:1000 (1mg/mL) — 0.3-0.5mg IM na face anterolateral da coxa. Repetir a cada 5-15 min se necessário. Crianças: 0.01mg/kg (máx 0.3mg). NÃO ATRASAR.', highlight: 'red' },
      { title: '3. Posicionamento', content: 'Decúbito dorsal com MMII elevados (se hipotensão). Se dispneia: sentado. Se vômitos: decúbito lateral. NUNCA colocar em pé (risco de colapso).', highlight: 'yellow' },
      { title: '4. Medidas Adjuvantes', content: 'O₂ alto fluxo (10-15L/min). Acesso venoso calibroso. SF 0.9% 1-2L rápido (se hipotensão). Salbutamol nebulização (se broncoespasmo). Anti-histamínico: Difenidramina 50mg IV. Corticoide: Metilprednisolona 125mg IV (previne fase tardia).', highlight: 'yellow' },
      { title: '5. Refratária', content: 'Se sem resposta a 2-3 doses IM: Adrenalina IV 0.1-0.5 mcg/kg/min em bomba. Glucagon 1-5mg IV (se uso de betabloqueador). Vasopressina se choque refratário.', highlight: 'red' },
      { title: '6. Observação e Alta', content: 'Observar 6-8h (risco de reação bifásica em 5-20%). Prescrever: Adrenalina autoinjetável (EpiPen). Encaminhar para Alergista. Plano de ação escrito. Pulseira de alerta médico.', highlight: 'blue' },
    ],
    treatment: [
      'Adrenalina IM 0.3-0.5mg (1:1000) — PRIMEIRA LINHA, repetir a cada 5-15 min',
      'SF 0.9% 1-2L IV rápido (se hipotensão)',
      'Difenidramina 50mg IV + Ranitidina 50mg IV (anti-H1 + anti-H2)',
      'Metilprednisolona 125mg IV ou Hidrocortisona 200mg IV',
      'Salbutamol nebulização 5mg (se broncoespasmo)',
      'Adrenalina IV em bomba: 0.1-0.5 mcg/kg/min (se refratária)',
    ],
    referral: [
      'Anafilaxia refratária → UTI',
      'Edema de glote com obstrução → IOT ou cricotireoidostomia',
      'Todos os pacientes → Alergista para investigação e prescrição de EpiPen',
      'Anafilaxia por veneno de inseto → Imunoterapia específica',
    ],
    references: [
      'Cardona V et al. WAO Anaphylaxis Guidance 2020. World Allergy Organ J. 2020;13(10):100472',
      'ASBAI. Guia Prático de Anafilaxia. Arq Asma Alerg Imunol. 2022;6(3):281-346',
      'Muraro A et al. EAACI Anaphylaxis Guidelines. Allergy. 2021;76(2):357-377',
    ],
  },
  {
    name: 'Meningite Bacteriana',
    icon: '🧬',
    category: 'Infectologia',
    sources: ['IDSA 2017', 'SBI 2020', 'NICE 2024'],
    summary: 'Emergência infecciosa com mortalidade de 15-25%. Tríade clássica (cefaleia, febre, rigidez de nuca) presente em apenas 44%. ATB empírico em até 1 hora — cada hora de atraso aumenta mortalidade em 13%.',
    criteria: [
      'Suspeita: febre + cefaleia + rigidez de nuca (tríade clássica)',
      'Sinais meníngeos: Kernig, Brudzinski, rigidez de nuca',
      'LCR: pleocitose neutrofílica (>1000 células), proteína elevada (>100mg/dL), glicose baixa (<40mg/dL ou <40% da sérica)',
      'Agentes: S. pneumoniae (adultos), N. meningitidis (jovens), L. monocytogenes (>50 anos, imunossuprimidos)',
    ],
    flowchart: [
      { title: '1. Suspeita Clínica', content: 'Febre + cefaleia + alteração de consciência. Sinais meníngeos. Petéquias/púrpura (meningococo). Se rebaixamento ou sinais focais: TC ANTES da punção lombar.', highlight: 'red' },
      { title: '2. ATB Empírico IMEDIATO', content: 'NÃO atrasar ATB para exames. Se suspeita forte: Ceftriaxona 2g IV 12/12h + Dexametasona 0.15mg/kg IV 6/6h (iniciar 15-20 min ANTES ou junto do ATB). Se >50 anos: adicionar Ampicilina 2g IV 4/4h (Listeria).', highlight: 'red' },
      { title: '3. Punção Lombar', content: 'Coletar LCR: citologia, bioquímica, bacterioscopia (Gram), cultura, látex. Se TC necessária: coletar hemoculturas + iniciar ATB → TC → PL. Contraindicações à PL: HIC, coagulopatia, infecção no local.', highlight: 'yellow' },
      { title: '4. Dexametasona', content: '0.15mg/kg IV 6/6h por 4 dias. Iniciar ANTES ou junto do ATB. Benefício comprovado para pneumococo (reduz mortalidade e sequelas auditivas). Suspender se não for pneumococo.', highlight: 'yellow' },
      { title: '5. Ajuste do ATB', content: 'Pneumococo: Ceftriaxona 2g 12/12h × 10-14 dias (se sensível). Meningococo: Penicilina G cristalina 4 milhões UI 4/4h × 7 dias. Listeria: Ampicilina 2g 4/4h × 21 dias.', highlight: 'green' },
      { title: '6. Quimioprofilaxia', content: 'Meningococo: Rifampicina 600mg 12/12h × 2 dias para contactantes íntimos. Alternativa: Ceftriaxona 250mg IM dose única ou Ciprofloxacino 500mg VO dose única. Notificação compulsória.', highlight: 'blue' },
    ],
    treatment: [
      'Ceftriaxona 2g IV 12/12h (empírico — cobre pneumococo e meningococo)',
      'Ampicilina 2g IV 4/4h (adicionar se >50 anos ou imunossuprimido — Listeria)',
      'Vancomicina 15-20mg/kg IV 8-12h (se suspeita de pneumococo resistente)',
      'Dexametasona 0.15mg/kg IV 6/6h × 4 dias (iniciar antes do ATB)',
      'Duração: Pneumococo 10-14d, Meningococo 7d, Listeria 21d, H. influenzae 7d',
      'Profilaxia contactantes: Rifampicina 600mg 12/12h × 2 dias',
    ],
    referral: [
      'Toda meningite bacteriana → Internação + UTI se grave',
      'Rebaixamento de consciência ou convulsões → UTI',
      'Hidrocefalia ou empiema subdural → Neurocirurgia',
      'Notificação compulsória ao SINAN (meningococo, pneumococo, H. influenzae)',
    ],
    references: [
      'Tunkel AR et al. IDSA Guidelines for Bacterial Meningitis. Clin Infect Dis. 2017;64(12):e51-e100',
      'SBI. Meningites Bacterianas: Diagnóstico e Tratamento. 2020',
      'NICE. Meningitis (bacterial) and meningococcal disease. NG51. Updated 2024',
    ],
  },
  {
    name: 'Hemorragia Digestiva Alta',
    icon: '🩸',
    category: 'Gastroenterologia',
    sources: ['ESGE 2021', 'ACG 2021', 'SBAD 2020'],
    summary: 'Sangramento acima do ângulo de Treitz. Mortalidade 2-10%. Estabilização hemodinâmica + EDA em 24h (ou 12h se alto risco). Escore de Glasgow-Blatchford para triagem.',
    criteria: [
      'Hematêmese (vômito com sangue vivo ou em borra de café)',
      'Melena (fezes escuras, fétidas, tipo alcatrão)',
      'Hematoquezia (se sangramento maciço — trânsito acelerado)',
      'Glasgow-Blatchford Score (GBS): 0 = baixo risco (alta precoce), ≥ 7 = alto risco',
    ],
    flowchart: [
      { title: '1. Estabilização (ABC)', content: '2 acessos venosos calibrosos (14-16G). Cristaloide IV. Hemograma, coagulograma, tipagem sanguínea, função renal, lactato. Monitorização contínua. SNG se necessário (controverso).', highlight: 'red' },
      { title: '2. Transfusão', content: 'Alvo Hb 7-8 g/dL (restritiva — TRIGGER trial). Se instabilidade ou sangramento ativo: transfundir imediatamente. Plaquetas se < 50.000. PFC se INR > 1.5 com sangramento ativo.', highlight: 'red' },
      { title: '3. IBP IV', content: 'Omeprazol 80mg IV bolus + 8mg/h infusão contínua (ou Pantoprazol). Iniciar ANTES da EDA. Reduz ressangramento e necessidade de cirurgia.', highlight: 'yellow' },
      { title: '4. EDA (Endoscopia)', content: 'Em 24h para todos. Em 12h se: GBS ≥ 7, instabilidade, hematêmese ativa. Classificação de Forrest: Ia/Ib (ativo) → hemostasia endoscópica. IIa (vaso visível) → hemostasia. IIb/IIc/III → IBP oral.', highlight: 'yellow' },
      { title: '5. Varizes Esofágicas', content: 'Se suspeita de cirrose: Terlipressina 2mg IV 4/4h (ou Octreotide 50mcg bolus + 50mcg/h) ANTES da EDA. Ligadura elástica na EDA. Ceftriaxona 1g/dia IV × 7 dias (profilaxia PBE).', highlight: 'red' },
      { title: '6. Falha Endoscópica', content: 'Se ressangramento: repetir EDA. Se falha na 2ª tentativa: Embolização angiográfica (radiologia intervencionista) ou Cirurgia (gastrectomia parcial, sutura). TIPS se varizes refratárias.', highlight: 'red' },
    ],
    treatment: [
      'Omeprazol 80mg IV bolus + 8mg/h infusão contínua por 72h',
      'Terlipressina 2mg IV 4/4h (se varizes) — reduzir para 1mg após controle',
      'Ceftriaxona 1g/dia IV × 7 dias (profilaxia em cirróticos)',
      'Hemostasia endoscópica: injeção de adrenalina + clipe/termocoagulação',
      'Ligadura elástica de varizes esofágicas',
      'Transfusão restritiva: alvo Hb 7-8 g/dL',
    ],
    referral: [
      'HDA com instabilidade hemodinâmica → UTI + EDA urgente',
      'Sangramento varicoso → Gastro/Hepatologia + EDA urgente',
      'Falha endoscópica → Radiologia intervencionista ou Cirurgia',
      'HDA recorrente → Investigar H. pylori, suspender AINEs',
    ],
    references: [
      'Gralnek IM et al. ESGE Guideline on GI Bleeding. Endoscopy. 2021;53(8):850-868',
      'Laine L et al. ACG Guideline on Upper GI Bleeding. Am J Gastroenterol. 2021;116(5):899-917',
      'SBAD. Hemorragia Digestiva Alta Não-Varicosa. 2020',
    ],
  },
  {
    name: 'Pancreatite Aguda',
    icon: '🟡',
    category: 'Gastroenterologia',
    sources: ['ACG 2024', 'IAP/APA 2024', 'SBAD 2021'],
    summary: 'Diagnóstico: 2 de 3 critérios (dor abdominal típica, lipase >3x, imagem). Causas: biliar (40%) e alcoólica (30%). Gravidade por BISAP/Ranson/APACHE II. Hidratação agressiva nas primeiras 24h.',
    criteria: [
      'Dor abdominal epigástrica intensa, em faixa, irradiando para dorso',
      'Lipase sérica > 3x o limite superior do normal (mais específica que amilase)',
      'TC com contraste: inflamação pancreática ou necrose (solicitar após 72h se grave)',
      'Classificação Atlanta revisada: Leve (sem falência orgânica), Moderada (falência transitória <48h), Grave (falência persistente >48h)',
    ],
    flowchart: [
      { title: '1. Diagnóstico', content: 'Dor típica + Lipase > 3x LSN = diagnóstico. Labs: hemograma, PCR, função renal, eletrólitos, cálcio, TGO/TGP, bilirrubinas, triglicerídeos. USG abdominal (colelitíase).', highlight: 'blue' },
      { title: '2. Hidratação Agressiva', content: 'Ringer Lactato 1.5 mL/kg/h nas primeiras 24h (ou 250-500 mL/h). Reavaliar em 6h: diurese >0.5 mL/kg/h, queda de ureia, melhora clínica. Reduzir taxa após 24-48h.', highlight: 'green' },
      { title: '3. Analgesia', content: 'Dipirona 1g IV 6/6h + Tramadol 100mg IV 8/8h. Se refratária: Morfina IV (NÃO há evidência de que piore — mito do espasmo de Oddi). PCA se necessário.', highlight: 'yellow' },
      { title: '4. Nutrição', content: 'Dieta oral precoce (nas primeiras 24h se tolerada) — dieta leve, baixa em gordura. Se não tolerar: SNE (enteral > parenteral). Jejum prolongado NÃO é mais recomendado.', highlight: 'green' },
      { title: '5. Pancreatite Biliar', content: 'Se coledocolitíase + colangite: CPRE em 24h. Se colelitíase sem colangite: colecistectomia na mesma internação (se leve) ou em 6 semanas (se grave/necrose).', highlight: 'yellow' },
      { title: '6. Necrose e Complicações', content: 'TC com contraste após 72h se grave. Necrose infectada: ATB (Meropenem) + drenagem (step-up approach: percutânea → endoscópica → cirúrgica). Pseudocisto: observar se assintomático.', highlight: 'red' },
    ],
    treatment: [
      'Ringer Lactato 1.5 mL/kg/h nas primeiras 24h',
      'Analgesia: Dipirona + Tramadol ± Morfina IV',
      'Dieta oral precoce (24h) — baixa em gordura',
      'CPRE urgente se colangite associada',
      'Meropenem 1g IV 8/8h (se necrose infectada)',
      'Colecistectomia: na mesma internação (leve) ou 6 semanas (grave)',
    ],
    referral: [
      'Pancreatite grave (falência orgânica) → UTI',
      'Necrose infectada → Gastro/Cirurgia (step-up approach)',
      'Colangite aguda → CPRE urgente',
      'Pancreatite recorrente → Investigar causas (autoimune, genética, IPMN)',
    ],
    references: [
      'Tenner S et al. ACG Guideline on Acute Pancreatitis. Am J Gastroenterol. 2024;119(3):419-437',
      'IAP/APA Evidence-Based Guidelines. Pancreatology. 2024;24(1):1-30',
      'SBAD. Pancreatite Aguda: Diagnóstico e Tratamento. 2021',
    ],
  },
  {
    name: 'Estado de Mal Epiléptico',
    icon: '⚡',
    category: 'Neurologia',
    sources: ['AES 2016', 'ILAE 2015', 'ABN 2021'],
    summary: 'Crise epiléptica contínua > 5 min ou ≥ 2 crises sem recuperação da consciência. Emergência neurológica com mortalidade de 20%. Tratamento escalonado: benzodiazepínico → fenitoína → anestésicos.',
    criteria: [
      'Crise tônico-clônica generalizada > 5 minutos contínuos',
      '≥ 2 crises sem recuperação completa da consciência entre elas',
      'EME não convulsivo: alteração de consciência + atividade epileptiforme no EEG',
      'EME refratário: persiste após 2ª linha de tratamento (fenitoína/valproato)',
    ],
    flowchart: [
      { title: '1. Fase Estabilização (0-5 min)', content: 'ABC, O₂, acesso venoso, glicemia capilar. Se hipoglicemia: Glicose 50% 50mL IV. Tiamina 100mg IV (se etilismo/desnutrição). Monitorização. Posição lateral de segurança.', highlight: 'red' },
      { title: '2. 1ª Linha: Benzodiazepínico (5-20 min)', content: 'Diazepam 10mg IV (2mg/min) — pode repetir 1x. OU Midazolam 10mg IM (se sem acesso IV — RAMPART trial). OU Lorazepam 4mg IV (preferido nos EUA). Eficácia: 60-70%.', highlight: 'red' },
      { title: '3. 2ª Linha: Antiepiléptico IV (20-40 min)', content: 'Fenitoína 20mg/kg IV (máx 50mg/min) com monitorização cardíaca. OU Valproato 40mg/kg IV (máx 6mg/kg/min) — preferido se epilepsia generalizada. OU Levetiracetam 60mg/kg IV (máx 4500mg).', highlight: 'yellow' },
      { title: '4. EME Refratário (>40 min)', content: 'IOT + VM. Midazolam IV contínuo: 0.2mg/kg bolus + 0.1-2mg/kg/h. OU Propofol: 2mg/kg bolus + 1-5mg/kg/h. OU Tiopental: 3-5mg/kg bolus + 1-5mg/kg/h. EEG contínuo obrigatório.', highlight: 'red' },
      { title: '5. Monitorização', content: 'EEG contínuo (meta: supressão de surtos por 24-48h). Monitorar: PA, FC, temperatura, eletrólitos, gasometria, CPK, função renal. Investigar causa: TC, RM, PL se indicado.', highlight: 'blue' },
      { title: '6. Desmame', content: 'Após 24-48h de controle: desmame gradual do anestésico em 12-24h. Manter antiepiléptico de base em dose terapêutica. Se recorrência: retornar ao passo anterior.', highlight: 'blue' },
    ],
    treatment: [
      '1ª linha: Diazepam 10mg IV ou Midazolam 10mg IM',
      '2ª linha: Fenitoína 20mg/kg IV (máx 50mg/min)',
      '2ª linha alternativa: Valproato 40mg/kg IV ou Levetiracetam 60mg/kg IV',
      'Refratário: Midazolam 0.2mg/kg bolus + 0.1-2mg/kg/h infusão contínua',
      'Super-refratário: Propofol ou Tiopental + EEG contínuo',
      'Glicose 50% 50mL IV + Tiamina 100mg IV (se hipoglicemia/etilismo)',
    ],
    referral: [
      'Todo EME → UTI com EEG contínuo',
      'EME refratário → Neurologista/Epileptologista',
      'Primeiro episódio → Investigação etiológica completa (RM, EEG, labs)',
      'EME super-refratário → Centro terciário de epilepsia',
    ],
    references: [
      'Glauser T et al. AES Treatment of Convulsive SE. Epilepsy Curr. 2016;16(1):48-61',
      'Trinka E et al. ILAE Definition of SE. Epilepsia. 2015;56(10):1515-1523',
      'ABN. Protocolo de Estado de Mal Epiléptico. 2021',
    ],
  },
  {
    name: 'Pré-eclâmpsia e Eclâmpsia',
    icon: '🤰',
    category: 'Ginecologia/Obstetrícia',
    sources: ['ACOG 2020', 'FEBRASGO 2022', 'ISSHP 2021'],
    summary: 'Hipertensão gestacional com proteinúria ou lesão de órgão-alvo após 20 semanas. Eclâmpsia = convulsão. Principal causa de morte materna no Brasil. Sulfato de magnésio é o tratamento da convulsão.',
    criteria: [
      'PAS ≥ 140 e/ou PAD ≥ 90 mmHg após 20 semanas de gestação',
      'Proteinúria ≥ 300mg/24h ou relação proteína/creatinina ≥ 0.3',
      'Ou: trombocitopenia (<100.000), Cr > 1.1, TGO > 2x, edema pulmonar, sintomas cerebrais/visuais',
      'Grave: PAS ≥ 160 e/ou PAD ≥ 110, ou qualquer sinal de gravidade acima',
    ],
    flowchart: [
      { title: '1. Diagnóstico', content: 'PA ≥ 140/90 + proteinúria ou LOA. Labs: hemograma com plaquetas, TGO/TGP, bilirrubinas, Cr, ácido úrico, LDH, proteinúria 24h. Avaliar bem-estar fetal: CTG + USG com Doppler.', highlight: 'blue' },
      { title: '2. Pré-eclâmpsia Leve', content: 'PA 140-159/90-109 sem sinais de gravidade. Monitorização ambulatorial 2x/semana. Labs semanais. Repouso relativo. Anti-hipertensivo se PA persistente: Metildopa 250-500mg 8/8h.', highlight: 'green' },
      { title: '3. Pré-eclâmpsia Grave', content: 'Internação obrigatória. Sulfato de magnésio (profilaxia de eclâmpsia): Zuspan — 4g IV em 20 min + 1-2g/h manutenção. Anti-hipertensivo: Nifedipino 10-20mg VO ou Hidralazina 5mg IV.', highlight: 'red' },
      { title: '4. Eclâmpsia (Convulsão)', content: 'ABC + Decúbito lateral esquerdo. MgSO₄: 4-6g IV em 20 min (se não estava em uso). Manter 1-2g/h por 24h pós-parto. Monitorar: reflexo patelar, FR >16, diurese >25mL/h. Antídoto: Gluconato de cálcio 1g IV.', highlight: 'red' },
      { title: '5. Resolução da Gestação', content: '≥ 37 semanas: parto (indução ou cesárea). 34-37 semanas com gravidade: parto após corticoide (Betametasona 12mg IM 2 doses). < 34 semanas: tentar prolongar se estável + corticoide para maturação pulmonar.', highlight: 'yellow' },
      { title: '6. Síndrome HELLP', content: 'Hemólise + Elevação de enzimas hepáticas + Plaquetopenia. Emergência obstétrica. Estabilizar + MgSO₄ + Parto (independente da IG se grave). Transfusão de plaquetas se < 20.000 ou < 50.000 para cesárea.', highlight: 'red' },
    ],
    treatment: [
      'MgSO₄ (Zuspan): 4g IV em 20 min + 1-2g/h manutenção por 24h pós-parto',
      'Nifedipino 10-20mg VO a cada 30 min (máx 60mg) — anti-hipertensivo de emergência',
      'Hidralazina 5mg IV a cada 20 min (máx 20mg) — alternativa',
      'Metildopa 250-500mg 8/8h VO (manutenção crônica)',
      'Betametasona 12mg IM × 2 doses (24/24h) — maturação pulmonar fetal',
      'Antídoto do MgSO₄: Gluconato de cálcio 10% 10mL IV lento',
    ],
    referral: [
      'Pré-eclâmpsia grave → Internação em centro obstétrico de referência',
      'Eclâmpsia → UTI obstétrica',
      'Síndrome HELLP → UTI + resolução da gestação',
      'Pré-eclâmpsia precoce (<34 sem) → Centro de medicina fetal',
    ],
    references: [
      'ACOG Practice Bulletin No. 222: Gestational Hypertension and Preeclampsia. Obstet Gynecol. 2020;135(6):e237-e260',
      'FEBRASGO. Pré-eclâmpsia: Protocolo de Manejo. 2022',
      'Brown MA et al. ISSHP Hypertensive Disorders of Pregnancy. Pregnancy Hypertens. 2021;27:148-169',
    ],
  },
  {
    name: 'Dengue',
    icon: '🦟',
    category: 'Infectologia',
    sources: ['MS Brasil 2024', 'OMS 2023', 'OPAS 2024'],
    summary: 'Arbovirose mais prevalente no Brasil. Classificação: Dengue sem sinais de alarme, com sinais de alarme e Dengue grave. Hidratação é o pilar do tratamento. Prova do laço para triagem.',
    criteria: [
      'Febre (2-7 dias) + ≥ 2: cefaleia, dor retro-orbitária, mialgia, artralgia, exantema, petéquias',
      'Prova do laço positiva (≥ 20 petéquias em 2.5cm²)',
      'Sinais de alarme: dor abdominal intensa, vômitos persistentes, acúmulo de líquidos, sangramento mucoso, letargia, hepatomegalia >2cm, aumento de Ht com queda de plaquetas',
      'Dengue grave: choque (pulso fino, PA convergente), sangramento grave, comprometimento orgânico',
    ],
    flowchart: [
      { title: '1. Classificação de Risco', content: 'Grupo A: sem sinais de alarme, sem comorbidades → ambulatorial. Grupo B: sangramento espontâneo ou induzido, comorbidades, gestante → observação. Grupo C: sinais de alarme → internação. Grupo D: dengue grave → UTI.', highlight: 'blue' },
      { title: '2. Grupo A (Ambulatorial)', content: 'Hidratação oral: 60-80 mL/kg/dia (1/3 com SRO). Paracetamol 500-750mg 6/6h (analgesia). PROIBIDO: AAS, AINEs (risco de sangramento). Retorno diário até 48h após defervescência.', highlight: 'green' },
      { title: '3. Grupo B (Observação)', content: 'Hidratação oral supervisionada. Hemograma com plaquetas (resultado em 4h). Se Ht normal: tratar como Grupo A. Se Ht elevado: hidratação IV 40 mL/kg em 4h. Reavaliar.', highlight: 'yellow' },
      { title: '4. Grupo C (Internação)', content: 'Hidratação IV imediata: SF 0.9% 20 mL/kg em 2h (rápida). Reavaliar: se melhora → 25 mL/kg em 6h. Se sem melhora → repetir fase rápida (máx 3x). Hemograma 2/2h.', highlight: 'red' },
      { title: '5. Grupo D (UTI)', content: 'Expansão volêmica: SF 0.9% 20 mL/kg em 20 min (repetir até 3x). Se choque refratário: Albumina 0.5-1g/kg ou Colóide. Noradrenalina se necessário. Hemograma 1/1h. Monitorização invasiva.', highlight: 'red' },
      { title: '6. Fase Crítica e Recuperação', content: 'Fase crítica: 3º-7º dia (defervescência). Risco de choque e sangramento. Monitorar Ht e plaquetas. Fase de recuperação: reabsorção de líquidos (risco de hipervolemia). Reduzir hidratação IV.', highlight: 'blue' },
    ],
    treatment: [
      'Hidratação oral: 60-80 mL/kg/dia (Grupo A e B)',
      'Hidratação IV: SF 0.9% 20 mL/kg em 2h (Grupo C) ou em 20 min (Grupo D)',
      'Paracetamol 500-750mg 6/6h ou Dipirona 500mg-1g 6/6h',
      'PROIBIDO: AAS, Ibuprofeno, Diclofenaco e outros AINEs',
      'Transfusão de plaquetas: APENAS se sangramento ativo grave (NÃO por número isolado)',
      'Concentrado de hemácias: se Hb < 7 g/dL ou sangramento grave',
    ],
    referral: [
      'Grupo C (sinais de alarme) → Internação em enfermaria',
      'Grupo D (dengue grave/choque) → UTI',
      'Gestante com dengue → Pré-natal de alto risco',
      'Notificação compulsória ao SINAN (todos os casos)',
    ],
    references: [
      'Ministério da Saúde. Dengue: Diagnóstico e Manejo Clínico. 5ª ed. 2024',
      'WHO. Dengue Guidelines for Diagnosis, Treatment, Prevention and Control. 2023',
      'OPAS. Dengue: Diretrizes para o Diagnóstico e Tratamento. 2024',
    ],
  },
  {
    name: 'Cirrose Hepática Descompensada',
    icon: '🟤',
    category: 'Gastroenterologia',
    sources: ['EASL 2023', 'AASLD 2023', 'SBH 2021'],
    summary: 'Descompensação: ascite, encefalopatia hepática, HDA varicosa ou icterícia. Child-Pugh e MELD para prognóstico e prioridade de transplante. Mortalidade em 1 ano: Child C = 45%.',
    criteria: [
      'Ascite: USG + paracentese diagnóstica (GASA ≥ 1.1 = hipertensão portal)',
      'Encefalopatia hepática: confusão, flapping, inversão do ciclo sono-vigília (West-Haven I-IV)',
      'HDA varicosa: hematêmese + cirrose conhecida',
      'MELD: bilirrubina + INR + creatinina (calculadora online) — prioridade para transplante',
    ],
    flowchart: [
      { title: '1. Avaliação', content: 'Labs: hemograma, coagulograma, bilirrubinas, albumina, TGO/TGP, Cr, Na, amônia. USG com Doppler portal. Calcular Child-Pugh e MELD. Paracentese se ascite nova ou febre.', highlight: 'blue' },
      { title: '2. Ascite', content: 'Restrição de sódio (<2g/dia). Espironolactona 100mg/dia (titular até 400mg) + Furosemida 40mg/dia (titular até 160mg). Razão 100:40. Paracentese de alívio se tensa (>5L: repor albumina 8g/L removido).', highlight: 'yellow' },
      { title: '3. PBE (Peritonite Bacteriana Espontânea)', content: 'Paracentese: PMN > 250/mm³ = PBE. ATB: Ceftriaxona 2g/dia IV × 5 dias. Albumina 1.5g/kg no D1 + 1g/kg no D3 (previne síndrome hepatorrenal). Profilaxia secundária: Norfloxacino 400mg/dia.', highlight: 'red' },
      { title: '4. Encefalopatia Hepática', content: 'Identificar precipitante: infecção, sangramento, constipação, medicamentos, desidratação. Lactulose 15-30mL 8/8h (meta: 2-3 evacuações pastosas/dia). Rifaximina 550mg 12/12h (prevenção de recorrência).', highlight: 'yellow' },
      { title: '5. Síndrome Hepatorrenal', content: 'Tipo 1 (aguda): Cr > 2.5 em < 2 semanas. Terlipressina 0.5-2mg IV 4/4h + Albumina 20-40g/dia. Tipo 2 (crônica): ascite refratária. Considerar TIPS. Transplante hepático é o tratamento definitivo.', highlight: 'red' },
      { title: '6. Transplante Hepático', content: 'Indicação: MELD ≥ 15, descompensação recorrente, hepatocarcinoma dentro dos critérios de Milão. Encaminhar precocemente. Avaliação multidisciplinar. Abstinência alcoólica ≥ 6 meses (se etiologia alcoólica).', highlight: 'blue' },
    ],
    treatment: [
      'Espironolactona 100-400mg/dia + Furosemida 40-160mg/dia (ascite)',
      'Lactulose 15-30mL 8/8h + Rifaximina 550mg 12/12h (encefalopatia)',
      'Ceftriaxona 2g/dia IV × 5 dias (PBE)',
      'Terlipressina 0.5-2mg IV 4/4h + Albumina (síndrome hepatorrenal)',
      'Propranolol 20-80mg 12/12h (profilaxia primária de varizes)',
      'Norfloxacino 400mg/dia (profilaxia secundária de PBE)',
    ],
    referral: [
      'Descompensação aguda → Internação + Gastro/Hepatologia',
      'MELD ≥ 15 → Avaliação para transplante hepático',
      'HDA varicosa → EDA urgente + Gastro',
      'Hepatocarcinoma → Oncologia + Hepatologia (critérios de Milão)',
    ],
    references: [
      'EASL Clinical Practice Guidelines on Decompensated Cirrhosis. J Hepatol. 2023;78(5):1082-1131',
      'Biggins SW et al. AASLD Practice Guidance on Ascites. Hepatology. 2023;78(5):1636-1665',
      'SBH. Consenso Brasileiro de Cirrose Hepática. 2021',
    ],
  },
  {
    name: 'Infecção do Trato Urinário',
    icon: '💧',
    category: 'Infectologia',
    sources: ['IDSA 2022', 'EAU 2024', 'SBI 2021'],
    summary: 'ITU não complicada (cistite) vs complicada (pielonefrite, gestante, cateter, anomalia). Resistência crescente a fluoroquinolonas e sulfametoxazol. Urocultura obrigatória em ITU complicada.',
    criteria: [
      'Cistite: disúria, polaciúria, urgência miccional, dor suprapúbica',
      'Pielonefrite: febre, dor lombar, calafrios ± sintomas de cistite',
      'EAS: leucocitúria (>10/campo), nitrito positivo, bacteriúria',
      'Urocultura: ≥ 100.000 UFC/mL (ou ≥ 1.000 se sintomática)',
    ],
    flowchart: [
      { title: '1. Classificação', content: 'Não complicada: mulher jovem, não gestante, sem anomalia. Complicada: homem, gestante, DM, DRC, cateter, anomalia anatômica, imunossupressão, ITU recorrente.', highlight: 'blue' },
      { title: '2. Cistite Não Complicada', content: 'Fosfomicina 3g VO dose única (1ª escolha no Brasil). OU Nitrofurantoína 100mg 6/6h × 5 dias. OU Sulfametoxazol-trimetoprim 800/160mg 12/12h × 3 dias (se sensibilidade local > 80%).', highlight: 'green' },
      { title: '3. Pielonefrite Não Complicada', content: 'Ambulatorial se estável: Ciprofloxacino 500mg 12/12h × 7 dias OU Ceftriaxona 1g IM/dia × 7 dias. Urocultura obrigatória. Reavaliar em 48-72h.', highlight: 'yellow' },
      { title: '4. Pielonefrite Complicada', content: 'Internação. Ceftriaxona 1-2g IV/dia OU Piperacilina-tazobactam 4.5g IV 8/8h. Hemoculturas + urocultura. USG/TC se: sem melhora em 72h, suspeita de abscesso ou obstrução.', highlight: 'red' },
      { title: '5. ITU na Gestante', content: 'Bacteriúria assintomática DEVE ser tratada. Cefalexina 500mg 6/6h × 7 dias OU Amoxicilina 500mg 8/8h × 7 dias OU Nitrofurantoína 100mg 6/6h × 7 dias (evitar no 3º trimestre). PROIBIDO: Fluoroquinolonas, SMX-TMP (1º trimestre).', highlight: 'yellow' },
      { title: '6. ITU Recorrente', content: '≥ 3 episódios/ano ou ≥ 2 em 6 meses. Investigar: USG, uretrocistografia (se suspeita de refluxo). Profilaxia: Nitrofurantoína 100mg/noite × 6-12 meses. Medidas comportamentais: hidratação, urinar pós-coito, cranberry (evidência limitada).', highlight: 'blue' },
    ],
    treatment: [
      'Cistite: Fosfomicina 3g VO dose única (1ª escolha)',
      'Cistite alternativa: Nitrofurantoína 100mg 6/6h × 5 dias',
      'Pielonefrite ambulatorial: Ciprofloxacino 500mg 12/12h × 7 dias',
      'Pielonefrite internação: Ceftriaxona 1-2g IV/dia × 10-14 dias',
      'Gestante: Cefalexina 500mg 6/6h × 7 dias',
      'Profilaxia recorrente: Nitrofurantoína 100mg/noite × 6-12 meses',
    ],
    referral: [
      'Pielonefrite com sepse → UTI',
      'Abscesso renal ou obstrução → Urologia (drenagem)',
      'ITU recorrente em homem → Urologia (investigar próstata)',
      'Gestante com pielonefrite → Internação + Obstetrícia',
    ],
    references: [
      'Anger J et al. IDSA/AUA Recurrent UTI Guideline. J Urol. 2022;208(3):536-541',
      'EAU Guidelines on Urological Infections. 2024',
      'SBI. Infecção do Trato Urinário: Diagnóstico e Tratamento. 2021',
    ],
  },
  {
    name: 'Dor Torácica na Emergência',
    icon: '🫁',
    category: 'Emergência',
    sources: ['ESC 2024', 'AHA 2021', 'SBC 2021'],
    summary: 'Diagnóstico diferencial amplo: SCA, TEP, dissecção aórtica, pneumotórax, pericardite. ECG em 10 min + troponina. Protocolo 0/1h ou 0/3h com troponina de alta sensibilidade para rule-in/rule-out rápido.',
    criteria: [
      'Dor torácica aguda com < 12h de evolução',
      'ECG 12 derivações em até 10 minutos da chegada',
      'Troponina de alta sensibilidade (hs-cTn) na admissão',
      'Avaliar: HEART Score, TIMI Score, GRACE Score para estratificação',
    ],
    flowchart: [
      { title: '1. Triagem Imediata (< 10 min)', content: 'ECG 12 derivações. Se supra de ST → protocolo IAMCSST. Sinais vitais, SpO₂, acesso venoso. Avaliar instabilidade: hipotensão, taquicardia, dispneia grave, assimetria de pulsos.', highlight: 'red' },
      { title: '2. Excluir Emergências', content: 'Dissecção aórtica: dor lancinante + assimetria de PA/pulsos → AngioTC. Pneumotórax hipertensivo: dispneia + desvio de traqueia → descompressão imediata. TEP: dispneia + taquicardia → Wells + D-dímero.', highlight: 'red' },
      { title: '3. Protocolo Troponina 0/1h', content: 'hs-cTn na admissão (0h) e em 1h. Rule-out: valor basal muito baixo + delta < limiar. Rule-in: valor elevado ou delta significativo. Zona cinzenta: repetir em 3h. Sensibilidade >99% para IAM.', highlight: 'yellow' },
      { title: '4. SCA sem Supra de ST', content: 'Se troponina elevada + clínica: IAMSSST. AAS 300mg + Ticagrelor 180mg ou Clopidogrel 300mg. Enoxaparina 1mg/kg SC 12/12h. Estratégia invasiva precoce (<24h) se alto risco (GRACE >140).', highlight: 'yellow' },
      { title: '5. Outras Causas', content: 'Pericardite: dor pleurítica + supra de ST difuso + derrame pericárdico → AINEs + Colchicina. Costocondrite: dor reprodutível à palpação → analgesia. Espasmo esofágico: relação com alimentação → IBP.', highlight: 'green' },
      { title: '6. Alta Segura', content: 'Se troponina negativa (0/1h ou 0/3h) + ECG normal + HEART ≤ 3: alta com seguimento ambulatorial em 72h. Orientar retorno se recorrência. Teste funcional ou AngioTC coronariana ambulatorial.', highlight: 'blue' },
    ],
    treatment: [
      'AAS 300mg VO (se suspeita de SCA)',
      'Nitroglicerina SL 0.4mg a cada 5 min × 3 (se dor isquêmica, PAS > 90)',
      'Morfina 2-4mg IV (se dor refratária — uso cauteloso)',
      'Enoxaparina 1mg/kg SC 12/12h (IAMSSST)',
      'AINEs + Colchicina 0.5mg 12/12h (pericardite)',
      'Descompressão com agulha (pneumotórax hipertensivo)',
    ],
    referral: [
      'Supra de ST → Hemodinâmica para ICP primária',
      'IAMSSST alto risco (GRACE >140) → Cateterismo em 24h',
      'Dissecção aórtica → Cirurgia cardiovascular de emergência',
      'TEP maciço → UTI + trombólise',
    ],
    references: [
      'Byrne RA et al. 2024 ESC Guidelines for ACS. Eur Heart J. 2024;45(38):3720-3826',
      'Gulati M et al. 2021 AHA Chest Pain Guideline. Circulation. 2021;144(22):e364-e454',
      'SBC. Diretriz de Dor Torácica na Emergência. Arq Bras Cardiol. 2021;117(1):181-247',
    ],
  },
  {
    name: 'Anemia Falciforme — Crise Vaso-oclusiva',
    icon: '🔴',
    category: 'Hematologia',
    sources: ['ASH 2020', 'SBHH 2022', 'NICE 2023'],
    summary: 'Crise álgica é a manifestação mais comum. Dor intensa por isquemia tecidual. Tratamento: hidratação, analgesia escalonada (incluindo opioides) e investigação de complicações (STA, AVC, sequestro esplênico).',
    criteria: [
      'Dor intensa em ossos, articulações, tórax ou abdome em paciente com doença falciforme',
      'Síndrome Torácica Aguda (STA): infiltrado pulmonar novo + febre/dor torácica/hipoxemia',
      'AVC: déficit neurológico focal agudo (risco 11% até 20 anos)',
      'Sequestro esplênico: esplenomegalia aguda + queda de Hb ≥ 2g/dL + reticulocitose',
    ],
    flowchart: [
      { title: '1. Avaliação Inicial', content: 'Dor (escala 0-10), sinais vitais, SpO₂. Labs: hemograma, reticulócitos, LDH, bilirrubinas, função renal, tipagem. RX tórax se febre ou sintomas respiratórios. Hemocultura se febre ≥ 38.5°C.', highlight: 'blue' },
      { title: '2. Analgesia Escalonada', content: 'Dor leve (1-3): Dipirona 1g IV + Paracetamol 750mg VO. Dor moderada (4-6): adicionar Tramadol 100mg IV ou Codeína 30mg VO. Dor intensa (7-10): Morfina 0.1mg/kg IV a cada 15-20 min até controle + PCA.', highlight: 'red' },
      { title: '3. Hidratação', content: 'SF 0.9% ou Ringer Lactato: 1-1.5x manutenção (NÃO hiper-hidratar — risco de STA). Manter euvolemia. Monitorar balanço hídrico. Evitar desidratação.', highlight: 'green' },
      { title: '4. Síndrome Torácica Aguda', content: 'Infiltrado novo + febre/dor/hipoxemia. O₂ para SpO₂ > 95%. ATB: Ceftriaxona 2g/dia + Azitromicina 500mg/dia. Transfusão simples se Hb < 7. Exsanguineotransfusão se grave (SpO₂ < 90%, piora rápida).', highlight: 'red' },
      { title: '5. Transfusão', content: 'Simples: se Hb < 7g/dL ou queda > 2g/dL. Alvo Hb 9-10 (NÃO ultrapassar 10 — hiperviscosidade). Exsanguineotransfusão: STA grave, AVC, priapismo refratário. Alvo HbS < 30%.', highlight: 'yellow' },
      { title: '6. Prevenção', content: 'Hidroxiureia 15-35mg/kg/dia (reduz crises em 50%). Ácido fólico 5mg/dia. Vacinação completa (pneumococo, meningococo, influenza, hepatite B). Penicilina V profilática até 5 anos. Doppler transcraniano anual (2-16 anos).', highlight: 'blue' },
    ],
    treatment: [
      'Morfina 0.1mg/kg IV a cada 15-20 min (dor intensa) + PCA',
      'Dipirona 1g IV 6/6h + Paracetamol 750mg VO 6/6h (adjuvantes)',
      'Hidratação: 1-1.5x manutenção (evitar hiper-hidratação)',
      'Ceftriaxona 2g/dia + Azitromicina 500mg/dia (STA)',
      'Transfusão simples: alvo Hb 9-10 g/dL (se Hb < 7)',
      'Hidroxiureia 15-35mg/kg/dia (prevenção crônica)',
    ],
    referral: [
      'STA grave (SpO₂ < 90%) → UTI + Exsanguineotransfusão',
      'AVC → Neurologia + Exsanguineotransfusão de emergência',
      'Sequestro esplênico → Transfusão urgente + Cirurgia (esplenectomia)',
      'Priapismo > 4h → Urologia (aspiração/irrigação)',
    ],
    references: [
      'Brandow AM et al. ASH Guidelines for Sickle Cell Disease: Pain. Blood Adv. 2020;4(12):2656-2701',
      'SBHH. Doença Falciforme: Diretrizes Brasileiras. 2022',
      'NICE. Sickle cell disease: managing acute painful episodes. NG143. Updated 2023',
    ],
  },
  {
    name: 'Intoxicação Exógena',
    icon: '☠️',
    category: 'Emergência',
    sources: ['AACT 2023', 'ABRACIT 2022', 'Goldfrank 2023'],
    summary: 'Abordagem toxicológica: identificar o tóxico, estabilizar (ABC), descontaminar se indicado, administrar antídoto específico. Carvão ativado em até 1h da ingestão. Ligar para CEATOX.',
    criteria: [
      'Ingestão, inalação ou exposição a substância potencialmente tóxica',
      'Síndromes toxicológicas: colinérgica, anticolinérgica, simpatomimética, opioide, sedativa',
      'Exames: glicemia, eletrólitos, gasometria, ECG (QTc), osmolaridade, gap aniônico',
    ],
    flowchart: [
      { title: '1. Estabilização (ABC)', content: 'Via aérea (IOT se rebaixamento). Ventilação. Circulação (acesso venoso, cristaloide). Glicemia capilar. Tiamina 100mg IV + Glicose 50% (se hipoglicemia). Naloxona 0.4-2mg IV (se suspeita de opioide).', highlight: 'red' },
      { title: '2. Identificar o Tóxico', content: 'Anamnese: O quê? Quanto? Quando? Via? Intencional? Exame físico: pupilas, FC, PA, temperatura, sudorese, peristalse. Toxidrome: colinérgica (SLUDGE), anticolinérgica (seco/quente/midríase), opioide (miose/bradicardia/depressão respiratória).', highlight: 'blue' },
      { title: '3. Descontaminação', content: 'Carvão ativado 1g/kg VO (máx 50g) se: ingestão < 1h, via oral, paciente consciente, substância adsorvível. CONTRAINDICADO: cáusticos, hidrocarbonetos, metais (ferro, lítio). Lavagem gástrica: raramente indicada (< 1h, dose letal).', highlight: 'yellow' },
      { title: '4. Antídotos Específicos', content: 'Paracetamol: N-acetilcisteína (NAC) 140mg/kg VO + 70mg/kg 4/4h × 17 doses. Benzodiazepínicos: Flumazenil 0.2mg IV (CUIDADO se epiléptico). Organofosforados: Atropina 2mg IV a cada 5 min + Pralidoxima.', highlight: 'yellow' },
      { title: '5. Eliminação Aumentada', content: 'Alcalinização urinária (NaHCO₃): salicilatos, fenobarbital. Hemodiálise: metanol, etilenoglicol, lítio, salicilatos graves, metformina. Doses múltiplas de carvão: carbamazepina, teofilina, dapsona.', highlight: 'yellow' },
      { title: '6. Monitorização e Psiquiatria', content: 'Monitorização 6-24h conforme substância. ECG seriado (QTc). Se tentativa de suicídio: avaliação psiquiátrica OBRIGATÓRIA antes da alta. CEATOX: 0800-722-6001 (São Paulo) ou CIT local.', highlight: 'blue' },
    ],
    treatment: [
      'Carvão ativado 1g/kg VO (máx 50g) — se ingestão < 1h',
      'NAC (N-acetilcisteína): 140mg/kg + 70mg/kg 4/4h × 17 doses (paracetamol)',
      'Naloxona 0.4-2mg IV (opioides) — repetir a cada 2-3 min',
      'Atropina 2mg IV a cada 5 min (organofosforados) — até secar secreções',
      'Flumazenil 0.2mg IV (benzodiazepínicos) — CUIDADO se epiléptico',
      'NaHCO₃ 1-2 mEq/kg IV (alcalinização para salicilatos)',
    ],
    referral: [
      'Rebaixamento de consciência → IOT + UTI',
      'Arritmia ou QTc prolongado → UTI + Cardiologia',
      'Tentativa de suicídio → Psiquiatria obrigatória',
      'Intoxicação grave → CEATOX + UTI toxicológica',
    ],
    references: [
      'AACT. Position Statements on GI Decontamination. 2023',
      'ABRACIT. Manual de Toxicologia Clínica. 2022',
      'Nelson LS et al. Goldfrank Toxicologic Emergencies. 11th ed. McGraw-Hill. 2023',
    ],
  },
  {
    name: 'Hipotireoidismo',
    icon: '🦋',
    category: 'Endocrinologia',
    sources: ['ATA 2014', 'SBEM 2023', 'ETA 2023'],
    summary: 'Deficiência de hormônios tireoidianos. Causa mais comum: tireoidite de Hashimoto. Diagnóstico: TSH elevado + T4L baixo. Tratamento: levotiroxina em jejum. Coma mixedematoso é emergência.',
    criteria: [
      'Hipotireoidismo primário: TSH elevado + T4L baixo',
      'Hipotireoidismo subclínico: TSH elevado (4.5-10) + T4L normal',
      'Sintomas: fadiga, ganho de peso, constipação, pele seca, intolerância ao frio, bradicardia',
      'Anti-TPO positivo: confirma etiologia autoimune (Hashimoto)',
    ],
    flowchart: [
      { title: '1. Diagnóstico', content: 'TSH + T4L. Se TSH elevado + T4L baixo: hipotireoidismo clínico. Se TSH elevado + T4L normal: subclínico. Solicitar: Anti-TPO, perfil lipídico, hemograma. USG de tireoide se nódulo palpável.', highlight: 'blue' },
      { title: '2. Levotiroxina (LT4)', content: 'Dose inicial: 1.6 mcg/kg/dia (adulto jovem saudável). Idosos ou cardiopatas: iniciar com 12.5-25 mcg/dia e titular lentamente. Tomar em jejum, 30-60 min antes do café. Longe de cálcio, ferro, IBP.', highlight: 'green' },
      { title: '3. Monitorização', content: 'TSH em 6-8 semanas após início ou ajuste de dose. Meta: TSH 0.5-2.5 mUI/L (adultos). Ajustar dose em 12.5-25 mcg conforme TSH. Após estabilização: TSH anual.', highlight: 'green' },
      { title: '4. Subclínico', content: 'Tratar se: TSH > 10, ou TSH 4.5-10 com sintomas, anti-TPO positivo, dislipidemia, gestação ou desejo de engravidar. Observar se: TSH 4.5-10 assintomático — repetir em 3-6 meses.', highlight: 'yellow' },
      { title: '5. Gestação', content: 'Meta TSH: < 2.5 (1º trimestre), < 3.0 (2º e 3º). Aumentar dose de LT4 em 30-50% assim que confirmar gestação. TSH a cada 4 semanas no 1º trimestre. Hipotireoidismo não tratado: risco de aborto, pré-eclâmpsia, déficit cognitivo fetal.', highlight: 'yellow' },
      { title: '6. Coma Mixedematoso', content: 'Emergência: hipotermia, rebaixamento, bradicardia, hipotensão, hiponatremia. LT4 200-500 mcg IV + Hidrocortisona 100mg IV 8/8h (antes da LT4 — risco de insuficiência adrenal). UTI. Aquecimento passivo.', highlight: 'red' },
    ],
    treatment: [
      'Levotiroxina (LT4): 1.6 mcg/kg/dia (dose plena em adulto jovem)',
      'Idosos/cardiopatas: iniciar 12.5-25 mcg/dia, titular a cada 6-8 semanas',
      'Gestante: aumentar 30-50% da dose ao confirmar gestação',
      'Coma mixedematoso: LT4 200-500 mcg IV + Hidrocortisona 100mg IV 8/8h',
      'Meta TSH: 0.5-2.5 mUI/L (adultos), < 2.5 (gestante 1º tri)',
      'Interações: tomar longe de cálcio, ferro, IBP, colestiramina (4h de intervalo)',
    ],
    referral: [
      'Coma mixedematoso → UTI + Endocrinologia',
      'Nódulo tireoidiano → USG + PAAF se indicado',
      'Hipotireoidismo central (TSH baixo + T4L baixo) → Endocrinologia (avaliar hipófise)',
      'Gestante com hipotireoidismo → Pré-natal de alto risco',
    ],
    references: [
      'Jonklaas J et al. ATA Guidelines for Hypothyroidism. Thyroid. 2014;24(12):1670-1751',
      'SBEM. Consenso Brasileiro de Hipotireoidismo. 2023',
      'Pearce SHS et al. ETA Guideline on Subclinical Hypothyroidism. Eur Thyroid J. 2023;12(2):e220204',
    ],
  },
  {
    name: 'Depressão Maior',
    icon: '💭',
    category: 'Psiquiatria',
    sources: ['APA 2023', 'ABP 2022', 'NICE 2022'],
    summary: 'Transtorno depressivo maior: humor deprimido e/ou anedonia por ≥ 2 semanas + ≥ 5 critérios DSM-5. ISRS é 1ª linha farmacológica. Risco de suicídio deve ser avaliado em toda consulta.',
    criteria: [
      'Humor deprimido e/ou anedonia por ≥ 2 semanas (obrigatório pelo menos 1)',
      '+ ≥ 5 de 9 critérios: humor deprimido, anedonia, alteração de peso/apetite, insônia/hipersonia, agitação/retardo psicomotor, fadiga, culpa/inutilidade, dificuldade de concentração, ideação suicida',
      'PHQ-9 ≥ 10: rastreio positivo. HAM-D para gravidade',
      'Excluir: bipolaridade (MDQ), hipotireoidismo, anemia, deficiência de B12/folato',
    ],
    flowchart: [
      { title: '1. Avaliação', content: 'PHQ-9 para rastreio e gravidade. Avaliar risco de suicídio (ideação, plano, meios, tentativas prévias). Excluir causas orgânicas: TSH, hemograma, B12, folato. Avaliar bipolaridade (MDQ). Comorbidades: ansiedade, uso de substâncias.', highlight: 'blue' },
      { title: '2. Leve (PHQ-9: 5-9)', content: 'Psicoterapia (TCC ou interpessoal) como 1ª linha. Exercício físico regular (150 min/sem). Higiene do sono. Reavaliação em 2-4 semanas. Farmacoterapia se sem resposta.', highlight: 'green' },
      { title: '3. Moderada (PHQ-9: 10-19)', content: 'ISRS: Sertralina 50mg/dia (1ª escolha — melhor perfil) ou Escitalopram 10mg/dia. Associar psicoterapia. Latência de resposta: 2-4 semanas. Reavaliação em 2-4 semanas.', highlight: 'yellow' },
      { title: '4. Grave (PHQ-9: 20-27)', content: 'ISRS em dose otimizada + Psicoterapia. Se ideação suicida ativa: internação. Se psicose: associar antipsicótico (Quetiapina, Aripiprazol). Considerar ECT (eletroconvulsoterapia) se refratária ou risco iminente.', highlight: 'red' },
      { title: '5. Sem Resposta (4-8 sem)', content: 'Otimizar dose. Se sem resposta: trocar ISRS ou mudar para IRSN (Venlafaxina 75-225mg, Duloxetina 60-120mg). Associar: Bupropiona, Lítio, Aripiprazol. Depressão resistente: Esketamina intranasal, ECT.', highlight: 'yellow' },
      { title: '6. Manutenção', content: 'Manter antidepressivo por ≥ 6-12 meses após remissão (1º episódio). Se recorrente (≥ 3 episódios): manutenção indefinida. Retirada gradual (reduzir 25% a cada 2-4 semanas). Monitorar recaída.', highlight: 'blue' },
    ],
    treatment: [
      'ISRS: Sertralina 50-200mg/dia ou Escitalopram 10-20mg/dia (1ª linha)',
      'IRSN: Venlafaxina 75-225mg/dia ou Duloxetina 60-120mg/dia (2ª linha)',
      'Bupropiona 150-300mg/dia (se fadiga, ganho de peso, disfunção sexual)',
      'Mirtazapina 15-45mg/dia (se insônia e perda de peso)',
      'Lítio 600-900mg/dia (potencialização em depressão resistente)',
      'ECT: 6-12 sessões (depressão grave refratária ou risco suicida iminente)',
    ],
    referral: [
      'Ideação suicida com plano → Emergência psiquiátrica / Internação',
      'Depressão resistente (falha a ≥ 2 antidepressivos) → Psiquiatra',
      'Depressão com psicose → Psiquiatra + internação',
      'Suspeita de bipolaridade → Psiquiatra (ISRS pode induzir mania)',
    ],
    references: [
      'APA. Practice Guideline for Major Depressive Disorder. 3rd ed. 2023',
      'ABP. Diretrizes para Tratamento da Depressão. 2022',
      'NICE. Depression in adults: treatment and management. NG222. Updated 2022',
    ],
  },
  {
    name: 'Doença Renal Crônica',
    icon: '🫘',
    category: 'Nefrologia',
    sources: ['KDIGO 2024', 'SBN 2023', 'NICE 2021'],
    summary: 'TFG < 60 mL/min/1.73m² e/ou albuminúria ≥ 30mg/g por > 3 meses. Estágios G1-G5. Pilares: IECA/BRA + iSGLT2 + controle de PA/DM. Encaminhar para nefrologista se TFG < 30 ou queda rápida.',
    criteria: [
      'TFG < 60 mL/min/1.73m² por > 3 meses (CKD-EPI)',
      'Albuminúria ≥ 30 mg/g creatinina (A2-A3) por > 3 meses',
      'Estágios: G1 (≥90), G2 (60-89), G3a (45-59), G3b (30-44), G4 (15-29), G5 (<15)',
      'Categorias albuminúria: A1 (<30), A2 (30-300), A3 (>300 mg/g)',
    ],
    flowchart: [
      { title: '1. Diagnóstico e Estadiamento', content: 'Creatinina + TFG (CKD-EPI). Albuminúria (relação albumina/creatinina urinária). Repetir em 3 meses para confirmar cronicidade. Causa: DM (40%), HAS (30%), glomerulonefrites, policística.', highlight: 'blue' },
      { title: '2. Nefroproteção', content: 'IECA ou BRA: obrigatório se albuminúria ≥ 30 (titular para dose máxima tolerada). iSGLT2: Dapagliflozina 10mg ou Empagliflozina 10mg (até TFG 20). Finerenona: se DM2 + albuminúria persistente com IECA/BRA.', highlight: 'green' },
      { title: '3. Controle de PA', content: 'Meta: < 120/80 mmHg (se albuminúria) ou < 130/80 (geral). IECA/BRA como base. Adicionar: BCC, diurético tiazídico (se TFG > 30) ou de alça (se TFG < 30). Evitar: AINEs.', highlight: 'yellow' },
      { title: '4. Controle Metabólico', content: 'DM: HbA1c < 7% (individualizar). iSGLT2 + Metformina (suspender se TFG < 30). Dislipidemia: Atorvastatina (G3-G5 sem diálise). Hiperuricemia: tratar se sintomática.', highlight: 'yellow' },
      { title: '5. Complicações', content: 'Anemia: EPO se Hb < 10 + ferro IV se ferritina < 200. Osteodistrofia: Vitamina D, quelante de fósforo (Sevelamer). Acidose: NaHCO₃ se Bic < 22. Hipercalemia: dieta + resina (Patiromer).', highlight: 'yellow' },
      { title: '6. Terapia Renal Substitutiva', content: 'Preparar acesso vascular (FAV) quando TFG < 20. Iniciar diálise se: TFG < 10-15 + sintomas urêmicos, hipercalemia refratária, hipervolemia refratária, acidose refratária. Transplante renal: avaliar quando TFG < 20.', highlight: 'red' },
    ],
    treatment: [
      'IECA/BRA: dose máxima tolerada (nefroproteção + anti-hipertensivo)',
      'iSGLT2: Dapagliflozina 10mg/dia (até TFG 20 mL/min)',
      'Finerenona 10-20mg/dia (se DM2 + albuminúria com IECA/BRA)',
      'EPO (Eritropoetina) SC: se Hb < 10 g/dL + ferro adequado',
      'Sevelamer 800mg 3x/dia (quelante de fósforo)',
      'NaHCO₃ 500-1000mg 8/8h VO (se Bic < 22 mEq/L)',
    ],
    referral: [
      'TFG < 30 (G4-G5) → Nefrologia',
      'Queda de TFG > 5 mL/min/ano → Nefrologia urgente',
      'Albuminúria A3 (> 300 mg/g) → Nefrologia',
      'TFG < 20 → Preparar acesso vascular (FAV) + avaliar transplante',
    ],
    references: [
      'KDIGO 2024 Clinical Practice Guideline for CKD. Kidney Int. 2024;105(4S):S117-S314',
      'SBN. Diretrizes de Doença Renal Crônica. 2023',
      'NICE. Chronic kidney disease: assessment and management. NG203. 2021',
    ],
  },
  {
    name: 'COVID-19 Grave',
    icon: '🦠',
    category: 'Pneumologia',
    sources: ['NIH 2024', 'MS Brasil 2024', 'WHO 2024'],
    summary: 'COVID-19 grave: SpO₂ < 94% em ar ambiente, FR > 30, infiltrado > 50%. Dexametasona reduz mortalidade em pacientes com O₂. Antivirais (Paxlovid) em 5 dias para alto risco.',
    criteria: [
      'Grave: SpO₂ < 94% em ar ambiente, FR > 30, PaO₂/FiO₂ < 300',
      'Crítico: insuficiência respiratória (VM), choque, falência multiorgânica',
      'Fatores de risco: idade > 60, DM, HAS, obesidade, imunossupressão, DRC, DCV',
      'Diagnóstico: RT-PCR ou antígeno + clínica + imagem (TC com vidro fosco)',
    ],
    flowchart: [
      { title: '1. Avaliação', content: 'SpO₂, FR, PA, FC, temperatura. Labs: hemograma, PCR, D-dímero, ferritina, LDH, troponina, função renal, gasometria. TC de tórax (se disponível). Classificar gravidade.', highlight: 'blue' },
      { title: '2. Oxigenoterapia', content: 'Cateter nasal até 6L/min (alvo SpO₂ 92-96%). Se insuficiente: máscara com reservatório 10-15L/min. Cateter nasal de alto fluxo (CNAF) 30-60L/min. Posição prona acordado (melhora oxigenação).', highlight: 'yellow' },
      { title: '3. Dexametasona', content: '6mg/dia IV ou VO × 10 dias (RECOVERY trial). APENAS se necessidade de O₂ suplementar. NÃO usar em casos leves sem hipoxemia. Alternativas: Metilprednisolona 32mg/dia, Hidrocortisona 50mg 8/8h.', highlight: 'green' },
      { title: '4. Anticoagulação', content: 'Profilática: Enoxaparina 40mg SC/dia (todos internados). Terapêutica: Enoxaparina 1mg/kg 12/12h (se D-dímero muito elevado + enfermaria — ATTACC/ACTIV-4a). NÃO usar dose terapêutica em UTI/críticos.', highlight: 'yellow' },
      { title: '5. Terapias Adicionais', content: 'Tocilizumab 8mg/kg IV (se PCR > 75 + O₂ progressivo, dentro de 24h da UTI). Baricitinib 4mg/dia VO × 14 dias (alternativa ao Tocilizumab). Remdesivir 200mg IV D1 + 100mg/dia × 5 dias (se < 7 dias de sintomas).', highlight: 'yellow' },
      { title: '6. Ventilação Mecânica', content: 'Se falha de CNAF/VNI: IOT precoce. Ventilação protetora: Vt 6 mL/kg peso predito, Pplatô < 30, PEEP titulada, FiO₂ para SpO₂ 92-96%. Prona 16h/dia se P/F < 150. Bloqueio neuromuscular se necessário.', highlight: 'red' },
    ],
    treatment: [
      'Dexametasona 6mg/dia × 10 dias (se O₂ suplementar)',
      'Enoxaparina 40mg SC/dia (profilaxia) ou 1mg/kg 12/12h (terapêutica em enfermaria)',
      'Tocilizumab 8mg/kg IV dose única (se PCR > 75 + deterioração)',
      'Remdesivir 200mg IV D1 + 100mg/dia × 5 dias (se < 7 dias)',
      'Paxlovid (Nirmatrelvir/Ritonavir): ambulatorial em 5 dias para alto risco',
      'Ventilação protetora: Vt 6 mL/kg, Pplatô < 30, prona se P/F < 150',
    ],
    referral: [
      'SpO₂ < 94% → Internação + O₂',
      'Necessidade de CNAF ou VNI → UTI ou semi-intensiva',
      'IOT/VM → UTI',
      'Tromboembolismo → Anticoagulação terapêutica + imagem',
    ],
    references: [
      'NIH COVID-19 Treatment Guidelines. Updated 2024. covid19treatmentguidelines.nih.gov',
      'Ministério da Saúde. Diretrizes para Diagnóstico e Tratamento da COVID-19. 2024',
      'WHO. Therapeutics and COVID-19: Living Guideline. 2024',
    ],
  },
  {
    name: 'Queimaduras',
    icon: '🔥',
    category: 'Cirurgia/Emergência',
    sources: ['ABA 2023', 'SBCP 2022', 'ISBI 2023'],
    summary: 'Classificação por profundidade (1º, 2º, 3º grau) e extensão (regra dos 9 de Wallace). Grande queimado: > 20% SCQ em adulto. Fórmula de Parkland para ressuscitação volêmica nas primeiras 24h.',
    criteria: [
      '1º grau: eritema, dor, sem bolhas (epiderme) — ex: queimadura solar',
      '2º grau superficial: bolhas, dor intensa, base úmida rósea (derme superficial)',
      '2º grau profundo: bolhas, dor reduzida, base esbranquiçada (derme profunda)',
      '3º grau: escara, indolor, branca/marrom/preta, não branqueia (toda derme + subcutâneo)',
    ],
    flowchart: [
      { title: '1. Avaliação Inicial (ABCDE)', content: 'Via aérea: rouquidão, estridor, queimadura facial, vibrissas chamuscadas → IOT precoce. Respiração: inalação de fumaça → O₂ 100%. Circulação: 2 acessos calibrosos. Calcular SCQ (regra dos 9 de Wallace).', highlight: 'red' },
      { title: '2. Ressuscitação Volêmica', content: 'Fórmula de Parkland: 4 mL × peso (kg) × %SCQ. 50% nas primeiras 8h (desde a queimadura), 50% nas próximas 16h. Ringer Lactato preferido. Meta: diurese 0.5-1 mL/kg/h (adulto). NÃO contar 1º grau na SCQ.', highlight: 'red' },
      { title: '3. Analgesia', content: 'Dor intensa: Morfina 0.1mg/kg IV. Ketamina 0.5mg/kg IV (para procedimentos). Dipirona + Tramadol (manutenção). Sedação para curativos: Midazolam + Ketamina.', highlight: 'yellow' },
      { title: '4. Cuidados com a Ferida', content: 'Lavar com SF 0.9% morno. Desbridamento de tecido desvitalizado. 1º grau: hidratante. 2º grau: Sulfadiazina de prata 1% ou curativo de prata nanocristalina. 3º grau: enxertia de pele (após estabilização).', highlight: 'yellow' },
      { title: '5. Escarotomia', content: 'Indicação: queimadura circunferencial de 3º grau em tórax (restrição respiratória) ou extremidades (síndrome compartimental). Incisão longitudinal na escara até tecido viável. Sem necessidade de anestesia (3º grau é indolor).', highlight: 'red' },
      { title: '6. Suporte', content: 'Profilaxia de tétano (se não vacinado). ATB: APENAS se infecção (NÃO profilático). Nutrição hipercalórica e hiperproteica precoce (Harris-Benedict × 1.5-2). Fisioterapia precoce. Suporte psicológico.', highlight: 'blue' },
    ],
    treatment: [
      'Parkland: Ringer Lactato 4 mL × kg × %SCQ (50% em 8h + 50% em 16h)',
      'Morfina 0.1mg/kg IV (analgesia) + Ketamina para procedimentos',
      'Sulfadiazina de prata 1% tópica (2º grau)',
      'Escarotomia: queimadura circunferencial com comprometimento vascular/respiratório',
      'Nutrição: 25-30 kcal/kg/dia + 1.5-2g proteína/kg/dia',
      'Profilaxia de tétano: dT ou dTpa se esquema incompleto',
    ],
    referral: [
      'Grande queimado (>20% SCQ adulto, >10% criança) → Centro de Queimados',
      'Queimadura de via aérea → IOT precoce + UTI',
      'Queimadura elétrica → ECG + monitorização (risco de arritmia)',
      'Queimadura de face, mãos, pés, genitália, articulações → Centro especializado',
    ],
    references: [
      'ABA. Practice Guidelines for Burn Care. J Burn Care Res. 2023;44(Suppl 2):S1-S76',
      'SBCP. Diretrizes de Tratamento de Queimaduras. 2022',
      'ISBI. Practice Guidelines for Burn Care. Burns. 2023;49(6):1163-1220',
    ],
  },
  {
    name: 'Doença Renal Crônica Avançada',
    icon: '🔬',
    category: 'Nefrologia',
    sources: ['KDIGO 2024', 'SBN 2023', 'ERA 2023'],
    summary: 'Estágios G4-G5 (TFG < 30). Preparação para terapia renal substitutiva. Confecção de FAV quando TFG < 20. Diálise quando TFG < 10-15 com sintomas urêmicos ou complicações refratárias.',
    criteria: [
      'G4: TFG 15-29 mL/min/1.73m²',
      'G5: TFG < 15 mL/min/1.73m² (doença renal terminal)',
      'Sintomas urêmicos: náusea, anorexia, prurido, neuropatia, encefalopatia',
      'Indicações de diálise: hipercalemia refratária, acidose refratária, hipervolemia refratária, pericardite urêmica',
    ],
    flowchart: [
      { title: '1. Acompanhamento Intensivo', content: 'Consulta nefrológica mensal. Labs: hemograma, eletrólitos, Ca, P, PTH, ferritina, saturação de transferrina, gasometria venosa, albumina. Monitorar TFG a cada 1-3 meses.', highlight: 'blue' },
      { title: '2. Preparo para TRS', content: 'Quando TFG < 20: discutir opções (hemodiálise, diálise peritoneal, transplante preemptivo). Confecção de FAV (fístula arteriovenosa) 6 meses antes da diálise prevista. Vacinação: Hepatite B (dose dupla).', highlight: 'yellow' },
      { title: '3. Manejo de Complicações', content: 'Anemia: EPO SC quando Hb < 10 (alvo 10-11.5). Ferro IV se ferritina < 200 ou sat < 20%. Osteodistrofia: Calcitriol se PTH > 3x LSN. Sevelamer para hiperfosfatemia. Acidose: NaHCO₃ oral.', highlight: 'yellow' },
      { title: '4. Dieta', content: 'Proteína: 0.6-0.8 g/kg/dia (pré-diálise). Sódio: < 2g/dia. Potássio: restringir se K > 5.5. Fósforo: restringir laticínios, embutidos, refrigerantes. Líquidos: restringir se oligúria.', highlight: 'green' },
      { title: '5. Início de Diálise', content: 'Indicação: TFG < 10-15 + sintomas urêmicos OU complicações refratárias (hipercalemia, acidose, hipervolemia, pericardite). Hemodiálise: 3x/semana, 4h. Diálise peritoneal: diária, domiciliar.', highlight: 'red' },
      { title: '6. Transplante Renal', content: 'Melhor opção de TRS (sobrevida e qualidade de vida). Preemptivo (antes da diálise) é ideal. Avaliação: compatibilidade ABO/HLA, crossmatch, avaliação cardiovascular, rastreio de neoplasia. Doador vivo: preferido.', highlight: 'blue' },
    ],
    treatment: [
      'EPO (Eritropoetina) 4000-10000 UI SC 1-3x/semana (alvo Hb 10-11.5)',
      'Ferro IV: Sacarato de hidróxido férrico 200mg IV/semana',
      'Calcitriol 0.25-0.5 mcg/dia (se PTH elevado)',
      'Sevelamer 800mg 3x/dia às refeições (quelante de fósforo)',
      'NaHCO₃ 500-1500mg 8/8h VO (se Bic < 22)',
      'Dieta hipoproteica: 0.6-0.8 g/kg/dia + restrição de Na, K, P',
    ],
    referral: [
      'TFG < 30 → Nefrologia obrigatória',
      'TFG < 20 → Confecção de FAV (Cirurgia Vascular)',
      'TFG < 15 → Avaliar transplante renal',
      'Complicações refratárias → Diálise de urgência',
    ],
    references: [
      'KDIGO 2024 Clinical Practice Guideline for CKD. Kidney Int. 2024;105(4S):S117-S314',
      'SBN. Diretrizes de Doença Renal Crônica. 2023',
      'ERA. Clinical Practice Guideline on CKD. Nephrol Dial Transplant. 2023;38(Suppl 1):i1-i98',
    ],
  },
  {
    name: 'Choque Anafilático — Pediatria',
    icon: '👶',
    category: 'Pediatria',
    sources: ['ESPACI 2023', 'SBP 2022', 'AAP 2023'],
    summary: 'Anafilaxia em crianças: mesmos critérios do adulto, mas doses ajustadas por peso. Adrenalina IM 0.01mg/kg (máx 0.3mg). Causas mais comuns: alimentos (leite, ovo, amendoim), medicamentos e insetos.',
    criteria: [
      'Mesmos critérios de anafilaxia do adulto adaptados para pediatria',
      'Lactentes: irritabilidade, choro inconsolável, recusa alimentar, hipotonia',
      'Crianças: urticária + vômitos/diarreia + sibilância/estridor + hipotensão',
      'PAS baixa para idade: < 70 + (2 × idade em anos) mmHg',
    ],
    flowchart: [
      { title: '1. Reconhecimento', content: 'Exposição a alérgeno + sintomas multissistêmicos. Lactentes: difícil diagnóstico — irritabilidade, vômitos, hipotonia podem ser únicos sinais. Sempre considerar anafilaxia se reação alérgica + qualquer sinal respiratório ou cardiovascular.', highlight: 'red' },
      { title: '2. Adrenalina IM', content: 'Adrenalina 1:1000 — 0.01 mg/kg IM (máx 0.3mg em < 30kg, 0.5mg em > 30kg). Face anterolateral da coxa. Repetir a cada 5-15 min se necessário. NÃO ATRASAR. Autoinjector: < 30kg = 0.15mg, > 30kg = 0.3mg.', highlight: 'red' },
      { title: '3. Posicionamento', content: 'Decúbito dorsal com MMII elevados. Se vômitos: decúbito lateral. Se dispneia: sentado. Lactente: posição confortável no colo (não forçar decúbito). NUNCA colocar em pé.', highlight: 'yellow' },
      { title: '4. Suporte', content: 'O₂ alto fluxo (máscara com reservatório). Acesso venoso: SF 0.9% 20 mL/kg em bolus (repetir até 60 mL/kg se choque). Salbutamol nebulização 0.15mg/kg (se broncoespasmo). Difenidramina 1mg/kg IV (máx 50mg).', highlight: 'yellow' },
      { title: '5. Refratária', content: 'Adrenalina IV: 0.1-1 mcg/kg/min em bomba. Glucagon 20-30 mcg/kg IV (se uso de betabloqueador). Vasopressina. Considerar ECMO em parada refratária.', highlight: 'red' },
      { title: '6. Observação e Seguimento', content: 'Observar 6-8h (mínimo 4h se leve). Prescrever autoinjector de adrenalina. Plano de ação para escola/creche. Encaminhar para alergista pediátrico. Dieta de exclusão se alergia alimentar confirmada.', highlight: 'blue' },
    ],
    treatment: [
      'Adrenalina IM 0.01mg/kg (máx 0.3mg em < 30kg) — 1ª LINHA',
      'SF 0.9% 20 mL/kg IV em bolus (repetir até 60 mL/kg)',
      'Salbutamol nebulização 0.15mg/kg (mín 2.5mg) se broncoespasmo',
      'Difenidramina 1mg/kg IV (máx 50mg) + Ranitidina 1mg/kg IV',
      'Metilprednisolona 1-2mg/kg IV (previne fase tardia)',
      'Adrenalina IV 0.1-1 mcg/kg/min (se refratária)',
    ],
    referral: [
      'Anafilaxia refratária → UTI pediátrica',
      'Edema de glote → IOT pediátrica (tubo sem cuff se < 8 anos)',
      'Todos → Alergista pediátrico para investigação',
      'Alergia alimentar confirmada → Nutricionista pediátrico',
    ],
    references: [
      'ESPACI. European Guidelines on Anaphylaxis in Children. Pediatr Allergy Immunol. 2023;34(2):e13920',
      'SBP. Anafilaxia na Infância: Protocolo de Atendimento. 2022',
      'AAP. Management of Anaphylaxis in Pediatric Settings. Pediatrics. 2023;151(3):e2022060953',
    ],
  },

];

const CATEGORIES = ['Todos', ...Array.from(new Set(OFFLINE_PROTOCOLS.map(p => p.category)))];

const COMMON_CONDITIONS = [
  { name: 'Hipertensão Arterial', icon: '💓' },
  { name: 'Diabetes Mellitus tipo 2', icon: '🩸' },
  { name: 'Infarto Agudo do Miocárdio', icon: '🫀' },
  { name: 'AVC Isquêmico', icon: '🧠' },
  { name: 'Pneumonia Comunitária', icon: '🫁' },
  { name: 'Sepse', icon: '🦠' },
  { name: 'Insuficiência Cardíaca', icon: '❤️' },
  { name: 'Fibrilação Atrial', icon: '💗' },
  { name: 'DPOC Exacerbada', icon: '💨' },
  { name: 'Asma Aguda', icon: '🌬️' },
  { name: 'Cetoacidose Diabética', icon: '⚗️' },
  { name: 'Tromboembolismo Pulmonar', icon: '🩺' },
  { name: 'Insuficiência Renal Aguda', icon: '🫘' },
  { name: 'Anafilaxia', icon: '⚠️' },
  { name: 'Meningite Bacteriana', icon: '🧬' },
  { name: 'Hemorragia Digestiva', icon: '🩸' },
  { name: 'Dengue', icon: '🦟' },
  { name: 'Dor Torácica', icon: '🫁' },
  { name: 'Pancreatite Aguda', icon: '🟡' },
  { name: 'Depressão Maior', icon: '💭' },
  { name: 'Pré-eclâmpsia', icon: '🤰' },
  { name: 'Queimaduras', icon: '🔥' },
  { name: 'Intoxicação Exógena', icon: '☠️' },
  { name: 'Hipotireoidismo', icon: '🦋' },
];

export default function ClinicalProtocols() {
  const [condition, setCondition] = useState('');
  const [source, setSource] = useState<'sus' | 'who' | 'nice' | 'aha' | 'all'>('all');
  const [protocol, setProtocol] = useState<string | null>(null);
  const [selectedOffline, setSelectedOffline] = useState<Protocol | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [viewMode, setViewMode] = useState<'protocols' | 'ai'>('protocols');

  const searchMutation = trpc.protocols.search.useMutation({
    onSuccess: (data) => { setProtocol(data.protocol); toast.success('Protocolo encontrado!'); },
    onError: (err) => toast.error(`Erro: ${err.message}`),
  });

  const handleSearch = (cond?: string) => {
    const q = cond || condition;
    if (!q.trim()) { toast.error('Informe a condição clínica'); return; }
    setCondition(q);
    setSelectedOffline(null);
    searchMutation.mutate({ condition: q, source });
  };

  const filteredProtocols = categoryFilter === 'Todos'
    ? OFFLINE_PROTOCOLS
    : OFFLINE_PROTOCOLS.filter(p => p.category === categoryFilter);

  const highlightColor = (h?: string) => {
    switch (h) {
      case 'green': return 'border-green-500/50 bg-green-900/10';
      case 'yellow': return 'border-yellow-500/50 bg-yellow-900/10';
      case 'red': return 'border-red-500/50 bg-red-900/10';
      case 'blue': return 'border-blue-500/50 bg-blue-900/10';
      default: return 'border-gray-600 bg-gray-800/50';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <EducationalDisclaimer variant="banner" moduleName="Protocolos Clínicos" showAIWarning />
      <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-2xl p-6 border border-cyan-700/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center text-2xl">📘</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Protocolos Clínicos e Diretrizes</h2>
            <p className="text-cyan-300 text-sm">30 protocolos completos offline + busca por IA — PCDT/SUS, WHO, NICE, AHA/ACC, ESC</p>
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button onClick={() => setViewMode('protocols')} className={`px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'protocols' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
          📋 Protocolos Completos ({OFFLINE_PROTOCOLS.length})
        </button>
        <button onClick={() => setViewMode('ai')} className={`px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'ai' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
          🤖 Busca por IA
        </button>
      </div>

      {viewMode === 'protocols' ? (
        <>
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { setCategoryFilter(cat); setSelectedOffline(null); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${categoryFilter === cat ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Protocol cards */}
          {!selectedOffline ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredProtocols.map(p => (
                <button key={p.name} onClick={() => setSelectedOffline(p)} className="p-4 bg-gray-900 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all text-left group">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{p.name}</h3>
                      <span className="text-xs text-gray-500">{p.category}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">{p.summary}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.sources.map(s => (
                      <span key={s} className="text-xs bg-cyan-900/30 text-cyan-400 px-2 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <button onClick={() => setSelectedOffline(null)} className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1">
                ← Voltar aos protocolos
              </button>

              {/* Protocol header */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{selectedOffline.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedOffline.name}</h3>
                    <div className="flex gap-2 mt-1">
                      {selectedOffline.sources.map(s => (
                        <span key={s} className="text-xs bg-cyan-900/30 text-cyan-400 px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300">{selectedOffline.summary}</p>
              </div>

              {/* Diagnostic criteria */}
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
                <h4 className="text-lg font-bold text-white mb-3">🔍 Critérios Diagnósticos</h4>
                <ul className="space-y-2">
                  {selectedOffline.criteria.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Flowchart */}
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
                <h4 className="text-lg font-bold text-white mb-4">📊 Fluxograma de Manejo</h4>
                <div className="space-y-3">
                  {selectedOffline.flowchart.map((step, i) => (
                    <div key={i} className={`p-4 rounded-lg border-l-4 ${highlightColor(step.highlight)}`}>
                      <h5 className="font-bold text-white mb-1">{step.title}</h5>
                      <p className="text-sm text-gray-300">{step.content}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500/50 rounded"></span> Urgente/Crítico</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500/50 rounded"></span> Atenção</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500/50 rounded"></span> Seguro/Estável</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500/50 rounded"></span> Avaliação/Seguimento</span>
                </div>
              </div>

              {/* Treatment */}
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
                <h4 className="text-lg font-bold text-white mb-3">💊 Tratamento</h4>
                <ul className="space-y-2">
                  {selectedOffline.treatment.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300">
                      <span className="text-emerald-400 font-bold mt-0.5 text-sm">{i + 1}.</span>
                      <span className="text-sm">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Referral criteria */}
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
                <h4 className="text-lg font-bold text-white mb-3">
🚨 Critérios de Encaminhamento</h4>
                <ul className="space-y-2">
                  {selectedOffline.referral.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300">
                      <span className="text-red-400 mt-1">→</span>
                      <span className="text-sm">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* References */}
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
                <h4 className="text-lg font-bold text-white mb-3">📚 Referências</h4>
                <ul className="space-y-2">
                  {selectedOffline.references.map((ref, i) => (
                    <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">[{i + 1}]</span>
                      <span>{ref}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      ) : (
        /* AI Search Mode */
        <>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
            <div className="flex gap-3 mb-4">
              <input type="text" value={condition} onChange={e => setCondition(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Condição clínica (ex: Hipertensão, Sepse, IAM)..." className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white" />
              <select value={source} onChange={e => setSource(e.target.value as any)} className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white">
                <option value="all">Todas as fontes</option>
                <option value="sus">SUS/PCDT</option>
                <option value="who">OMS/WHO</option>
                <option value="nice">NICE</option>
                <option value="aha">AHA/ACC</option>
              </select>
              <button onClick={() => handleSearch()} disabled={searchMutation.isPending} className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-500 disabled:opacity-50">
                {searchMutation.isPending ? '⏳' : '🔍 Buscar'}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {COMMON_CONDITIONS.map(c => (
                <button key={c.name} onClick={() => handleSearch(c.name)} className="p-3 bg-gray-800 rounded-lg text-center hover:bg-gray-700 transition-all">
                  <div className="text-xl mb-1">{c.icon}</div>
                  <div className="text-xs text-gray-400">{c.name}</div>
                </button>
              ))}
            </div>
          </div>

          {protocol && (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">📘 Protocolo: {condition}</h3>
              <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">{protocol}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
