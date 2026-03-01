import React, { useState, useMemo } from 'react';
import { EXPANDED_FLOWCHARTS } from '../../data/expandedFlowcharts';

// ═══════════════════════════════════════════════════════════
// FLUXOGRAMAS CLÍNICOS VISUAIS — Árvores de decisão interativas
// ═══════════════════════════════════════════════════════════

interface FlowNode {
  id: string;
  type: 'question' | 'action' | 'alert' | 'end';
  text: string;
  detail?: string;
  options?: { label: string; nextId: string; color?: string }[];
}

interface Flowchart {
  id: string;
  name: string;
  category: string;
  description: string;
  reference: string;
  nodes: FlowNode[];
  startNodeId: string;
}

const FLOWCHARTS: Flowchart[] = [
  {
    id: 'dor_toracica', name: 'Dor Torácica na Emergência', category: 'Cardiologia', description: 'Abordagem inicial da dor torácica aguda — protocolo ESC/AHA',
    reference: 'ESC Guidelines 2023 / AHA 2021',
    startNodeId: 'start',
    nodes: [
      { id: 'start', type: 'question', text: 'Paciente com dor torácica aguda', detail: 'Avaliar sinais vitais, ECG em 10 min, acesso venoso', options: [
        { label: 'ECG com supra de ST', nextId: 'iamcsst', color: 'red' },
        { label: 'ECG sem supra de ST', nextId: 'sem_supra' },
        { label: 'ECG normal', nextId: 'ecg_normal' },
      ]},
      { id: 'iamcsst', type: 'alert', text: 'IAM COM SUPRA DE ST — EMERGÊNCIA', detail: 'Ativar protocolo de reperfusão imediatamente. Tempo porta-balão < 90 min ou porta-agulha < 30 min', options: [
        { label: 'Hemodinâmica disponível < 120 min', nextId: 'angioplastia', color: 'green' },
        { label: 'Sem hemodinâmica disponível', nextId: 'trombolitico', color: 'yellow' },
      ]},
      { id: 'angioplastia', type: 'action', text: 'Angioplastia Primária', detail: 'AAS 300mg VO + Ticagrelor 180mg VO + Heparina IV. Encaminhar para hemodinâmica. Meta: porta-balão < 90 min', options: [{ label: 'Protocolo completo', nextId: 'end_iam' }]},
      { id: 'trombolitico', type: 'action', text: 'Trombólise Química', detail: 'AAS 300mg + Clopidogrel 300mg + Tenecteplase (dose por peso) ou Alteplase. Meta: porta-agulha < 30 min. Transferir para centro com hemodinâmica em 3-24h', options: [{ label: 'Protocolo completo', nextId: 'end_iam' }]},
      { id: 'end_iam', type: 'end', text: 'UTI Coronariana — Monitorização contínua, ecocardiograma, estratificação de risco' },
      { id: 'sem_supra', type: 'question', text: 'Avaliar troponina seriada (0h e 3h)', detail: 'Calcular escore HEART ou TIMI. Manter monitorização', options: [
        { label: 'Troponina elevada / em ascensão', nextId: 'scasst', color: 'red' },
        { label: 'Troponina normal seriada', nextId: 'baixo_risco', color: 'green' },
      ]},
      { id: 'scasst', type: 'action', text: 'SCA sem supra — Estratégia invasiva', detail: 'AAS + Anticoagulação (Enoxaparina 1mg/kg 12/12h). Cateterismo em 24-72h conforme risco. Dupla antiagregação', options: [{ label: 'Internação', nextId: 'end_scasst' }]},
      { id: 'end_scasst', type: 'end', text: 'UCO — Cateterismo em 24-72h, otimizar terapia medicamentosa' },
      { id: 'baixo_risco', type: 'question', text: 'Troponina normal — Avaliar outras causas', detail: 'Considerar: TEP, dissecção aórtica, pneumotórax, pericardite, causa musculoesquelética, DRGE', options: [
        { label: 'Suspeita de TEP', nextId: 'tep' },
        { label: 'Suspeita de dissecção', nextId: 'disseccao' },
        { label: 'Dor musculoesquelética / DRGE', nextId: 'end_baixo', color: 'green' },
      ]},
      { id: 'tep', type: 'action', text: 'Protocolo TEP', detail: 'D-dímero (se probabilidade baixa/intermediária) ou AngioTC de tórax. Se confirmado: anticoagulação plena', options: [{ label: 'Investigar', nextId: 'end_tep' }]},
      { id: 'end_tep', type: 'end', text: 'Se TEP confirmado: Anticoagulação com Heparina → Rivaroxabana/Apixabana por 3-6 meses' },
      { id: 'disseccao', type: 'alert', text: 'Dissecção Aórtica — EMERGÊNCIA', detail: 'AngioTC de aorta URGENTE. Controle pressórico agressivo (PAS < 120, FC < 60). Cirurgia se tipo A (Stanford)', options: [{ label: 'Protocolo', nextId: 'end_disseccao' }]},
      { id: 'end_disseccao', type: 'end', text: 'Tipo A: Cirurgia de emergência. Tipo B: Tratamento clínico + monitorização em UTI' },
      { id: 'end_baixo', type: 'end', text: 'Alta com orientações. Acompanhamento ambulatorial. Teste ergométrico se necessário' },
      { id: 'ecg_normal', type: 'question', text: 'ECG normal — Avaliar probabilidade pré-teste', detail: 'Escore HEART: H (história), E (ECG), A (age), R (risk factors), T (troponina)', options: [
        { label: 'HEART ≥ 4', nextId: 'sem_supra', color: 'yellow' },
        { label: 'HEART 0-3', nextId: 'end_baixo', color: 'green' },
      ]},
    ]
  },
  {
    id: 'sepse', name: 'Sepse — Protocolo Hour-1 Bundle', category: 'Emergência / UTI', description: 'Reconhecimento e tratamento inicial da sepse — Surviving Sepsis Campaign 2021',
    reference: 'Surviving Sepsis Campaign 2021 / ILAS Brasil',
    startNodeId: 'start',
    nodes: [
      { id: 'start', type: 'question', text: 'Suspeita de infecção + disfunção orgânica', detail: 'qSOFA ≥ 2 (PAS ≤ 100, FR ≥ 22, Glasgow < 15) OU SOFA ≥ 2', options: [
        { label: 'qSOFA ≥ 2 ou SOFA ≥ 2', nextId: 'sepse_confirmada', color: 'red' },
        { label: 'qSOFA 0-1', nextId: 'monitorar', color: 'yellow' },
      ]},
      { id: 'sepse_confirmada', type: 'alert', text: 'SEPSE — Iniciar HOUR-1 BUNDLE', detail: 'TODAS as medidas devem ser iniciadas na PRIMEIRA HORA', options: [{ label: 'Iniciar protocolo', nextId: 'bundle' }]},
      { id: 'bundle', type: 'action', text: 'Hour-1 Bundle (Pacote de 1 hora)', detail: '1) Lactato sérico\n2) Hemoculturas (2 pares) ANTES do ATB\n3) Antibiótico de amplo espectro IV\n4) Cristaloide 30 mL/kg se hipotensão ou lactato ≥ 4\n5) Vasopressor se PAM < 65 após volume', options: [
        { label: 'PAM ≥ 65 após volume', nextId: 'resposta_ok', color: 'green' },
        { label: 'PAM < 65 após 30 mL/kg', nextId: 'choque', color: 'red' },
      ]},
      { id: 'choque', type: 'alert', text: 'CHOQUE SÉPTICO', detail: 'Noradrenalina: iniciar 0,1 mcg/kg/min, titular para PAM ≥ 65. Se dose > 0,5: adicionar Vasopressina 0,03 UI/min. Considerar hidrocortisona 200mg/dia se refratário', options: [
        { label: 'Resposta ao vasopressor', nextId: 'uti' },
        { label: 'Refratário', nextId: 'refratario', color: 'red' },
      ]},
      { id: 'refratario', type: 'action', text: 'Choque refratário', detail: 'Hidrocortisona 50mg 6/6h IV. Considerar: ecocardiograma (disfunção miocárdica), dobutamina se baixo DC, monitorização invasiva (PiCCO/Swan-Ganz)', options: [{ label: 'UTI', nextId: 'uti' }]},
      { id: 'resposta_ok', type: 'action', text: 'Boa resposta ao volume', detail: 'Reavaliar lactato em 2-4h (meta: clearance > 10%). Descalonar ATB conforme culturas em 48-72h. Manter monitorização', options: [{ label: 'Continuar', nextId: 'uti' }]},
      { id: 'uti', type: 'end', text: 'UTI: Reavaliar lactato 2-4h, culturas 48h, descalonar ATB, controle glicêmico (140-180), profilaxia TVP/úlcera de estresse' },
      { id: 'monitorar', type: 'action', text: 'Monitorar de perto', detail: 'Reavaliar em 1-2h. Se piora clínica ou qSOFA ≥ 2: iniciar protocolo de sepse. Colher exames: hemograma, PCR, procalcitonina, lactato', options: [
        { label: 'Piora → qSOFA ≥ 2', nextId: 'sepse_confirmada', color: 'red' },
        { label: 'Estável', nextId: 'end_estavel', color: 'green' },
      ]},
      { id: 'end_estavel', type: 'end', text: 'Infecção sem disfunção orgânica. Tratar infecção de base. Monitorar sinais de deterioração' },
    ]
  },
  {
    id: 'pcr', name: 'Parada Cardiorrespiratória (ACLS)', category: 'Emergência', description: 'Algoritmo de PCR — ACLS/AHA 2020',
    reference: 'AHA Guidelines 2020 — ACLS',
    startNodeId: 'start',
    nodes: [
      { id: 'start', type: 'alert', text: 'PCR identificada — Iniciar RCP', detail: 'Verificar responsividade e pulso (< 10 seg). Chamar ajuda. Desfibrilador. Iniciar compressões 100-120/min, profundidade 5-6 cm', options: [{ label: 'Desfibrilador chegou — Analisar ritmo', nextId: 'ritmo' }]},
      { id: 'ritmo', type: 'question', text: 'Qual o ritmo cardíaco?', detail: 'Analisar no monitor/desfibrilador', options: [
        { label: 'FV / TV sem pulso (chocável)', nextId: 'chocavel', color: 'red' },
        { label: 'Assistolia / AESP (não chocável)', nextId: 'nao_chocavel', color: 'yellow' },
      ]},
      { id: 'chocavel', type: 'action', text: 'CHOQUE — 200J bifásico', detail: 'Choque → RCP 2 min imediatamente → Reavaliar ritmo. Acesso IV/IO. Adrenalina 1mg IV após 2° choque. Amiodarona 300mg IV após 3° choque', options: [
        { label: 'Após 2 min RCP → Reavaliar', nextId: 'reavaliacao' },
      ]},
      { id: 'nao_chocavel', type: 'action', text: 'RCP + Adrenalina imediata', detail: 'RCP 2 min. Adrenalina 1mg IV/IO a cada 3-5 min. Acesso IV/IO. IOT quando possível. Tratar causas reversíveis (5H e 5T)', options: [
        { label: 'Após 2 min RCP → Reavaliar', nextId: 'reavaliacao' },
      ]},
      { id: 'reavaliacao', type: 'question', text: 'Reavaliar ritmo após 2 min de RCP', detail: 'Pausar compressões brevemente (< 10 seg) para checar ritmo', options: [
        { label: 'FV/TV persistente', nextId: 'chocavel', color: 'red' },
        { label: 'Assistolia/AESP', nextId: 'nao_chocavel', color: 'yellow' },
        { label: 'Ritmo organizado → Checar pulso', nextId: 'rosc', color: 'green' },
      ]},
      { id: 'rosc', type: 'action', text: 'ROSC — Retorno da Circulação Espontânea', detail: 'Cuidados pós-PCR: Otimizar ventilação (SpO2 92-98%, PaCO2 35-45). PA: vasopressores se PAM < 65. Temperatura: hipotermia terapêutica 32-36°C por 24h. ECG 12 derivações. Cateterismo se IAMCSST', options: [{ label: 'Cuidados pós-PCR', nextId: 'end_rosc' }]},
      { id: 'end_rosc', type: 'end', text: 'UTI: Hipotermia terapêutica 24h, cateterismo se indicado, neuroprognóstico em 72h, investigar causa' },
    ]
  },
  {
    id: 'has_emergencia', name: 'Crise Hipertensiva', category: 'Cardiologia', description: 'Urgência vs Emergência hipertensiva — SBC 2024',
    reference: 'SBC — Diretrizes de HAS 2024',
    startNodeId: 'start',
    nodes: [
      { id: 'start', type: 'question', text: 'PA ≥ 180/120 mmHg', detail: 'Avaliar presença de lesão de órgão-alvo (LOA)', options: [
        { label: 'COM lesão de órgão-alvo', nextId: 'emergencia', color: 'red' },
        { label: 'SEM lesão de órgão-alvo', nextId: 'urgencia', color: 'yellow' },
      ]},
      { id: 'emergencia', type: 'alert', text: 'EMERGÊNCIA HIPERTENSIVA', detail: 'LOA: AVC, EAP, IAM, dissecção aórtica, eclâmpsia, encefalopatia hipertensiva, IRA', options: [
        { label: 'AVC isquêmico', nextId: 'avc_isch' },
        { label: 'AVC hemorrágico', nextId: 'avc_hem' },
        { label: 'EAP / IC aguda', nextId: 'eap' },
        { label: 'Dissecção aórtica', nextId: 'disseccao' },
        { label: 'Eclâmpsia', nextId: 'eclampsia' },
      ]},
      { id: 'avc_isch', type: 'action', text: 'AVC isquêmico', detail: 'Se candidato a trombólise: PA < 185/110 antes. Nitroprussiato ou Labetalol IV. Após trombólise: manter PA < 180/105 por 24h. Se não trombólise: tratar se PA > 220/120', options: [{ label: 'UTI AVC', nextId: 'end_emergencia' }]},
      { id: 'avc_hem', type: 'action', text: 'AVC hemorrágico', detail: 'Meta: PAS 140 mmHg na primeira hora. Nitroprussiato ou Labetalol IV. Redução rápida e agressiva', options: [{ label: 'UTI', nextId: 'end_emergencia' }]},
      { id: 'eap', type: 'action', text: 'Edema Agudo de Pulmão', detail: 'Nitroglicerina IV (5-200 mcg/min) + Furosemida 40-80mg IV + VNI (CPAP 10 cmH2O). Se refratário: Nitroprussiato', options: [{ label: 'UTI', nextId: 'end_emergencia' }]},
      { id: 'disseccao', type: 'action', text: 'Dissecção Aórtica', detail: 'Meta URGENTE: PAS < 120 e FC < 60 em 20 min. Esmolol IV (1ª escolha) + Nitroprussiato. Cirurgia se tipo A', options: [{ label: 'UTI/CC', nextId: 'end_emergencia' }]},
      { id: 'eclampsia', type: 'action', text: 'Eclâmpsia', detail: 'Sulfato de Magnésio (Zuspan: 4g IV em 20 min + 1-2g/h). Hidralazina 5mg IV ou Nifedipino 10mg VO. Meta: PAS 140-155 / PAD 90-105. Parto após estabilização', options: [{ label: 'UTI obstétrica', nextId: 'end_emergencia' }]},
      { id: 'end_emergencia', type: 'end', text: 'Monitorização contínua em UTI. Drogas IV. Redução gradual (25% na 1ª hora, normalizar em 24-48h)' },
      { id: 'urgencia', type: 'action', text: 'URGÊNCIA HIPERTENSIVA', detail: 'Sem LOA. Ambiente calmo, repouso. Captopril 25mg VO ou Clonidina 0,1-0,2mg VO. Meta: reduzir PA em 24-48h (não agudamente)', options: [
        { label: 'PA reduziu em 2-4h', nextId: 'end_urgencia', color: 'green' },
        { label: 'PA não reduziu', nextId: 'refrataria', color: 'yellow' },
      ]},
      { id: 'refrataria', type: 'action', text: 'Urgência refratária', detail: 'Repetir Captopril 25mg ou Clonidina 0,1mg a cada hora (máx 0,6mg). Se não responder em 4-6h: considerar internação e droga IV', options: [{ label: 'Reavaliar', nextId: 'end_urgencia' }]},
      { id: 'end_urgencia', type: 'end', text: 'Alta com prescrição anti-hipertensiva ajustada. Retorno em 72h. Encaminhar para acompanhamento ambulatorial' },
    ]
  },
  {
    id: 'cetoacidose', name: 'Cetoacidose Diabética (CAD)', category: 'Endocrinologia', description: 'Manejo da CAD — ADA/SBD',
    reference: 'ADA Standards of Care 2025 / SBD 2024',
    startNodeId: 'start',
    nodes: [
      { id: 'start', type: 'question', text: 'Glicemia > 250 + Cetonemia/Cetonúria + pH < 7,3 ou HCO3 < 18', detail: 'Classificar gravidade: Leve (pH 7,25-7,30), Moderada (pH 7,0-7,24), Grave (pH < 7,0)', options: [
        { label: 'CAD confirmada', nextId: 'hidratacao', color: 'red' },
      ]},
      { id: 'hidratacao', type: 'action', text: '1° PASSO: Hidratação IV', detail: 'SF 0,9% 1.000-1.500 mL na 1ª hora. Depois: 250-500 mL/h. Se Na+ corrigido > 135: trocar para NaCl 0,45%. Quando glicemia < 200: adicionar SG 5% ao soro', options: [{ label: 'Próximo passo', nextId: 'potassio' }]},
      { id: 'potassio', type: 'question', text: '2° PASSO: Avaliar Potássio', detail: 'SEMPRE checar K+ ANTES de iniciar insulina', options: [
        { label: 'K+ < 3,3 mEq/L', nextId: 'k_baixo', color: 'red' },
        { label: 'K+ 3,3-5,3 mEq/L', nextId: 'k_normal', color: 'green' },
        { label: 'K+ > 5,3 mEq/L', nextId: 'k_alto', color: 'yellow' },
      ]},
      { id: 'k_baixo', type: 'alert', text: 'K+ < 3,3 — REPOR ANTES DA INSULINA', detail: 'KCl 20-40 mEq/h IV. NÃO iniciar insulina até K+ > 3,3 (risco de arritmia fatal). Monitorar ECG', options: [{ label: 'K+ > 3,3 → Iniciar insulina', nextId: 'insulina' }]},
      { id: 'k_normal', type: 'action', text: 'K+ 3,3-5,3 — Repor K+ no soro', detail: 'Adicionar KCl 20-30 mEq/L de soro. Meta: K+ 4-5 mEq/L. Monitorar K+ a cada 2h', options: [{ label: 'Iniciar insulina', nextId: 'insulina' }]},
      { id: 'k_alto', type: 'action', text: 'K+ > 5,3 — Não repor K+', detail: 'Iniciar insulina (que reduzirá o K+). Monitorar K+ a cada 2h. ECG contínuo', options: [{ label: 'Iniciar insulina', nextId: 'insulina' }]},
      { id: 'insulina', type: 'action', text: '3° PASSO: Insulina Regular IV', detail: 'Bolus: 0,1 UI/kg IV. Manutenção: 0,1 UI/kg/h em BIC. Meta: queda de glicemia 50-70 mg/dL/h. Se não cair: dobrar a dose', options: [
        { label: 'Glicemia < 200', nextId: 'transicao', color: 'green' },
      ]},
      { id: 'transicao', type: 'action', text: 'Glicemia < 200 — Ajustar', detail: 'Reduzir insulina para 0,02-0,05 UI/kg/h. Adicionar SG 5% ao soro. Manter glicemia 150-200 até resolver acidose (pH > 7,3, HCO3 > 18, AG < 12)', options: [{ label: 'Acidose resolvida', nextId: 'resolucao', color: 'green' }]},
      { id: 'resolucao', type: 'action', text: 'CAD resolvida — Transição para SC', detail: 'Iniciar insulina SC (basal-bolus) 30 min ANTES de desligar a BIC. Dose: 0,5-0,8 UI/kg/dia. Alimentação VO. Investigar fator precipitante', options: [{ label: 'Alta', nextId: 'end' }]},
      { id: 'end', type: 'end', text: 'Alta com insulina SC ajustada. Educação em diabetes. Retorno em 1 semana. Investigar causa precipitante (infecção, má adesão, debut)' },
    ]
  },
  {
    id: 'anafilaxia', name: 'Anafilaxia', category: 'Emergência', description: 'Manejo da anafilaxia — WAO/ASBAI',
    reference: 'WAO Anaphylaxis Guidelines 2020 / ASBAI',
    startNodeId: 'start',
    nodes: [
      { id: 'start', type: 'alert', text: 'ANAFILAXIA — Reação alérgica grave', detail: 'Critérios: envolvimento de pele/mucosa + respiratório OU cardiovascular. Ou: exposição a alérgeno conhecido + hipotensão', options: [{ label: 'Confirmar e tratar', nextId: 'adrenalina' }]},
      { id: 'adrenalina', type: 'action', text: '1° PASSO: ADRENALINA IM — IMEDIATAMENTE', detail: 'Adrenalina 1:1.000 (1 mg/mL) — 0,3-0,5 mg IM na face anterolateral da coxa. Crianças: 0,01 mg/kg (máx 0,3 mg). Repetir a cada 5-15 min se necessário.', options: [{ label: 'Medidas adicionais', nextId: 'medidas' }]},
      { id: 'medidas', type: 'action', text: 'Medidas simultâneas', detail: '• Deitar o paciente com MMII elevados (se hipotensão)\n• O2 alto fluxo\n• Acesso venoso calibroso\n• SF 0,9% 1-2L rápido (se hipotensão)\n• Monitorização contínua\n• Remover alérgeno se possível', options: [
        { label: 'Respondeu à adrenalina', nextId: 'respondeu', color: 'green' },
        { label: 'Não respondeu / choque', nextId: 'refrataria', color: 'red' },
      ]},
      { id: 'respondeu', type: 'action', text: 'Boa resposta — Medicações adjuvantes', detail: '• Difenidramina 50mg IV (anti-H1)\n• Ranitidina 50mg IV (anti-H2)\n• Metilprednisolona 125mg IV (previne fase tardia)\n• Salbutamol inalatório se broncoespasmo', options: [{ label: 'Observação', nextId: 'observacao' }]},
      { id: 'refrataria', type: 'alert', text: 'Anafilaxia refratária', detail: 'Adrenalina IV: 0,1 mg (1:10.000) IV lento. Ou infusão contínua: 1-10 mcg/min. Glucagon 1-5 mg IV se uso de betabloqueador. IOT se edema de glote', options: [{ label: 'UTI', nextId: 'end_uti' }]},
      { id: 'observacao', type: 'action', text: 'Observação por 6-12h', detail: 'Risco de reação bifásica (até 20% dos casos, ocorre em 1-72h). Manter monitorização. Prescrever auto-injetor de adrenalina na alta', options: [{ label: 'Alta', nextId: 'end_alta' }]},
      { id: 'end_alta', type: 'end', text: 'Alta com: auto-injetor de adrenalina, plano de ação escrito, encaminhamento ao alergista, orientação sobre alérgeno' },
      { id: 'end_uti', type: 'end', text: 'UTI: Infusão de adrenalina, monitorização invasiva, investigar causa, triptase sérica' },
    ]
  },
];

const nodeColors = {
  question: { bg: 'bg-blue-900/50', border: 'border-blue-500/50', icon: '❓' },
  action: { bg: 'bg-emerald-900/50', border: 'border-emerald-500/50', icon: '✅' },
  alert: { bg: 'bg-red-900/50', border: 'border-red-500/50', icon: '🚨' },
  end: { bg: 'bg-gray-800', border: 'border-gray-600', icon: '🏁' },
};

// Convert expanded flowcharts to component format
const EXPANDED_AS_FLOWS: Flowchart[] = EXPANDED_FLOWCHARTS.filter(e => !FLOWCHARTS.some(f => f.id === e.id)).map(e => ({
  id: e.id, name: e.name, category: e.specialty, description: e.description, reference: e.reference,
  startNodeId: e.nodes[0]?.id || 'start',
  nodes: e.nodes.map(n => ({
    id: n.id, type: n.type === 'start' ? 'action' as const : n.type === 'decision' ? 'question' as const : n.type as any,
    text: n.text, detail: n.detail,
    options: e.edges.filter(edge => edge.from === n.id).map(edge => ({ label: edge.label || 'Próximo', nextId: edge.to })),
  })),
}));
const ALL_FLOWCHARTS = [...FLOWCHARTS, ...EXPANDED_AS_FLOWS];
const FLOW_CATEGORIES = ['Todos', ...new Set(ALL_FLOWCHARTS.map(f => f.category))];

export default function ClinicalFlowcharts() {
  const [selectedFlowchart, setSelectedFlowchart] = useState<Flowchart | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filtered = useMemo(() => {
    return ALL_FLOWCHARTS.filter(f => selectedCategory === 'Todos' || f.category === selectedCategory);
  }, [selectedCategory]);

  const startFlowchart = (fc: Flowchart) => {
    setSelectedFlowchart(fc);
    setCurrentNodeId(fc.startNodeId);
    setHistory([fc.startNodeId]);
  };

  const goToNode = (nodeId: string) => {
    setCurrentNodeId(nodeId);
    setHistory(prev => [...prev, nodeId]);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentNodeId(newHistory[newHistory.length - 1]);
    }
  };

  const restart = () => {
    if (selectedFlowchart) {
      setCurrentNodeId(selectedFlowchart.startNodeId);
      setHistory([selectedFlowchart.startNodeId]);
    }
  };

  if (selectedFlowchart) {
    const currentNode = selectedFlowchart.nodes.find(n => n.id === currentNodeId);
    if (!currentNode) return null;
    const style = nodeColors[currentNode.type];

    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => { setSelectedFlowchart(null); setHistory([]); }}
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Voltar aos fluxogramas
          </button>
          <div className="flex gap-2">
            <button onClick={goBack} disabled={history.length <= 1} className="px-3 py-1 bg-gray-800 text-gray-400 rounded text-xs disabled:opacity-30">← Anterior</button>
            <button onClick={restart} className="px-3 py-1 bg-gray-800 text-gray-400 rounded text-xs">↺ Reiniciar</button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-4 border border-indigo-700/30">
          <h2 className="text-xl font-bold text-white">{selectedFlowchart.name}</h2>
          <p className="text-gray-400 text-xs mt-1">{selectedFlowchart.reference}</p>
        </div>

        {/* Progress breadcrumb */}
        <div className="flex items-center gap-1 flex-wrap">
          {history.map((nodeId, i) => {
            const node = selectedFlowchart.nodes.find(n => n.id === nodeId);
            return (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-gray-600 text-xs">→</span>}
                <button onClick={() => { setCurrentNodeId(nodeId); setHistory(history.slice(0, i + 1)); }}
                  className={`px-2 py-0.5 rounded text-xs ${nodeId === currentNodeId ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
                  {node?.text.substring(0, 25)}...
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Current Node */}
        <div className={`${style.bg} rounded-2xl p-6 border-2 ${style.border}`}>
          <div className="flex items-start gap-3">
            <span className="text-3xl">{style.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase text-gray-500 font-bold">{currentNode.type === 'question' ? 'Decisão' : currentNode.type === 'action' ? 'Conduta' : currentNode.type === 'alert' ? 'Alerta' : 'Desfecho'}</span>
                <span className="text-xs text-gray-600">Passo {history.length}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{currentNode.text}</h3>
              {currentNode.detail && (
                <p className="text-gray-300 text-sm mt-2 whitespace-pre-line">{currentNode.detail}</p>
              )}
            </div>
          </div>
        </div>

        {/* Options */}
        {currentNode.options && currentNode.options.length > 0 && (
          <div className="space-y-2">
            <p className="text-gray-500 text-xs font-bold uppercase">Próximo passo:</p>
            {currentNode.options.map((opt, i) => (
              <button key={i} onClick={() => goToNode(opt.nextId)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  opt.color === 'red' ? 'bg-red-900/20 border-red-700/30 hover:border-red-500' :
                  opt.color === 'green' ? 'bg-emerald-900/20 border-emerald-700/30 hover:border-emerald-500' :
                  opt.color === 'yellow' ? 'bg-yellow-900/20 border-yellow-700/30 hover:border-yellow-500' :
                  'bg-gray-800/50 border-gray-700 hover:border-blue-500'
                }`}>
                <span className="text-white font-medium">{opt.label}</span>
                <svg className="w-4 h-4 text-gray-500 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            ))}
          </div>
        )}

        {currentNode.type === 'end' && (
          <div className="text-center py-4">
            <button onClick={restart} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
              ↺ Reiniciar Fluxograma
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-6 border border-indigo-700/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-2xl">🔀</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Fluxogramas Clínicos</h2>
            <p className="text-indigo-300 text-sm">{ALL_FLOWCHARTS.length} protocolos interativos com árvores de decisão baseadas em evidências</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FLOW_CATEGORIES.map(c => (
          <button key={c} onClick={() => setSelectedCategory(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${selectedCategory === c ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map(fc => (
          <button key={fc.id} onClick={() => startFlowchart(fc)}
            className="text-left bg-gray-900 rounded-xl p-5 border border-gray-700 hover:border-indigo-500/50 transition-all group">
            <h3 className="text-white font-bold group-hover:text-indigo-300 transition-colors">{fc.name}</h3>
            <p className="text-gray-400 text-sm mt-1">{fc.description}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500">{fc.nodes.length} etapas</span>
              <span className="text-xs text-gray-600">{fc.reference}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
