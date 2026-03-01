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
  { name: 'DPOC Exacerbada', icon: '💨' },
  { name: 'Asma Aguda', icon: '🌬️' },
  { name: 'Cetoacidose Diabética', icon: '⚗️' },
  { name: 'Tromboembolismo Pulmonar', icon: '🩺' },
  { name: 'Insuficiência Renal Aguda', icon: '🫘' },
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
            <p className="text-cyan-300 text-sm">10 protocolos completos offline + busca por IA — PCDT/SUS, WHO, NICE, AHA/ACC, ESC</p>
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
