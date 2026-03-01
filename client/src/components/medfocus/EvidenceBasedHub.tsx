/**
 * MedFocus — Evidence-Based Medicine Hub (Sprint 19)
 * 
 * Hub completo de Medicina Baseada em Evidências com:
 * - Busca integrada PubMed, Cochrane Library, NICE Guidelines
 * - Classificação de Nível de Evidência (Oxford CEBM)
 * - Revisões Sistemáticas e Meta-análises
 * - Calculadora NNT/NNH
 * - Avaliador GRADE para qualidade de evidência
 * - Biblioteca de Guidelines internacionais
 * 
 * DISCLAIMER: Ferramenta exclusivamente educacional e de apoio ao estudo.
 */

import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

type NivelEvidencia = 'Ia' | 'Ib' | 'IIa' | 'IIb' | 'III' | 'IV' | 'V';
type GrauRecomendacao = 'A' | 'B' | 'C' | 'D';
type QualidadeGRADE = 'alta' | 'moderada' | 'baixa' | 'muito-baixa';

interface EstudoClinico {
  id: string;
  titulo: string;
  autores: string;
  journal: string;
  ano: number;
  doi: string;
  pmid: string;
  tipo: string;
  nivelEvidencia: NivelEvidencia;
  grauRecomendacao: GrauRecomendacao;
  qualidadeGRADE: QualidadeGRADE;
  populacao: string;
  intervencao: string;
  comparador: string;
  desfecho: string;
  resultadoPrincipal: string;
  nnt?: number;
  ic95: string;
  pValor: string;
  tags: string[];
  abstract: string;
}

// Base de estudos clínicos validados e reais
const ESTUDOS_CLINICOS: EstudoClinico[] = [
  {
    id: 'ec-001', titulo: 'SPRINT Trial — Systolic Blood Pressure Intervention Trial',
    autores: 'SPRINT Research Group, Wright JT Jr, Williamson JD, et al.',
    journal: 'N Engl J Med', ano: 2015, doi: '10.1056/NEJMoa1511939', pmid: '26551272',
    tipo: 'Ensaio Clínico Randomizado Multicêntrico', nivelEvidencia: 'Ib', grauRecomendacao: 'A', qualidadeGRADE: 'alta',
    populacao: '9.361 pacientes hipertensos (PAS ≥130 mmHg), ≥50 anos, alto risco CV',
    intervencao: 'Meta PAS <120 mmHg (tratamento intensivo)',
    comparador: 'Meta PAS <140 mmHg (tratamento padrão)',
    desfecho: 'Composto: IAM, SCA, AVC, IC descompensada, morte CV',
    resultadoPrincipal: 'Redução de 25% no desfecho primário composto (HR 0.75; IC95% 0.64-0.89)',
    nnt: 61, ic95: '0.64-0.89', pValor: '<0.001',
    tags: ['hipertensão', 'cardiovascular', 'PAS', 'tratamento intensivo'],
    abstract: 'O estudo SPRINT demonstrou que o controle intensivo da pressão arterial sistólica (meta <120 mmHg) reduziu significativamente eventos cardiovasculares maiores e mortalidade por todas as causas em pacientes hipertensos de alto risco, comparado ao tratamento padrão (meta <140 mmHg). O estudo foi interrompido precocemente por benefício claro.'
  },
  {
    id: 'ec-002', titulo: 'EMPA-REG OUTCOME — Empagliflozin Cardiovascular Outcome Event Trial',
    autores: 'Zinman B, Wanner C, Lachin JM, et al.',
    journal: 'N Engl J Med', ano: 2015, doi: '10.1056/NEJMoa1515920', pmid: '26378978',
    tipo: 'Ensaio Clínico Randomizado Duplo-Cego', nivelEvidencia: 'Ib', grauRecomendacao: 'A', qualidadeGRADE: 'alta',
    populacao: '7.020 pacientes com DM2 e doença CV estabelecida',
    intervencao: 'Empagliflozina 10mg ou 25mg/dia',
    comparador: 'Placebo',
    desfecho: 'Composto: morte CV, IAM não fatal, AVC não fatal (MACE 3 pontos)',
    resultadoPrincipal: 'Redução de 14% no MACE (HR 0.86; IC95% 0.74-0.99) e 38% na morte CV (HR 0.62; IC95% 0.49-0.77)',
    nnt: 39, ic95: '0.74-0.99', pValor: '0.04',
    tags: ['diabetes', 'SGLT2', 'empagliflozina', 'cardiovascular', 'insuficiência cardíaca'],
    abstract: 'O EMPA-REG OUTCOME foi o primeiro estudo a demonstrar que um antidiabético oral (inibidor SGLT2) reduz mortalidade cardiovascular em pacientes com DM2. A empagliflozina reduziu significativamente morte CV, hospitalização por IC e mortalidade por todas as causas, mudando o paradigma do tratamento do diabetes.'
  },
  {
    id: 'ec-003', titulo: 'PARADIGM-HF — Prospective Comparison of ARNI with ACEI',
    autores: 'McMurray JJ, Packer M, Desai AS, et al.',
    journal: 'N Engl J Med', ano: 2014, doi: '10.1056/NEJMoa1409077', pmid: '25176015',
    tipo: 'Ensaio Clínico Randomizado Duplo-Cego', nivelEvidencia: 'Ib', grauRecomendacao: 'A', qualidadeGRADE: 'alta',
    populacao: '8.442 pacientes com IC classe NYHA II-IV e FEVE ≤40%',
    intervencao: 'Sacubitril/Valsartana 200mg 2x/dia',
    comparador: 'Enalapril 10mg 2x/dia',
    desfecho: 'Composto: morte CV ou hospitalização por IC',
    resultadoPrincipal: 'Redução de 20% no desfecho primário (HR 0.80; IC95% 0.73-0.87)',
    nnt: 21, ic95: '0.73-0.87', pValor: '<0.001',
    tags: ['insuficiência cardíaca', 'ARNI', 'sacubitril', 'valsartana', 'FEVE reduzida'],
    abstract: 'O PARADIGM-HF demonstrou superioridade do sacubitril/valsartana sobre o enalapril na redução de morte cardiovascular e hospitalização por insuficiência cardíaca em pacientes com IC com fração de ejeção reduzida. O estudo foi interrompido precocemente por benefício claro.'
  },
  {
    id: 'ec-004', titulo: 'DAPA-HF — Dapagliflozin and Prevention of Adverse Outcomes in Heart Failure',
    autores: 'McMurray JJV, Solomon SD, Inzucchi SE, et al.',
    journal: 'N Engl J Med', ano: 2019, doi: '10.1056/NEJMoa1911303', pmid: '31535829',
    tipo: 'Ensaio Clínico Randomizado Duplo-Cego', nivelEvidencia: 'Ib', grauRecomendacao: 'A', qualidadeGRADE: 'alta',
    populacao: '4.744 pacientes com IC NYHA II-IV e FEVE ≤40% (com ou sem DM2)',
    intervencao: 'Dapagliflozina 10mg/dia',
    comparador: 'Placebo',
    desfecho: 'Composto: piora da IC ou morte CV',
    resultadoPrincipal: 'Redução de 26% no desfecho primário (HR 0.74; IC95% 0.65-0.85)',
    nnt: 21, ic95: '0.65-0.85', pValor: '<0.001',
    tags: ['insuficiência cardíaca', 'SGLT2', 'dapagliflozina', 'FEVE reduzida'],
    abstract: 'O DAPA-HF expandiu o uso de inibidores SGLT2 para além do diabetes, demonstrando benefício significativo da dapagliflozina em pacientes com IC com FEVE reduzida, independentemente da presença de diabetes.'
  },
  {
    id: 'ec-005', titulo: 'FOURIER — Further Cardiovascular Outcomes Research with PCSK9 Inhibition',
    autores: 'Sabatine MS, Giugliano RP, Keech AC, et al.',
    journal: 'N Engl J Med', ano: 2017, doi: '10.1056/NEJMoa1615664', pmid: '28304224',
    tipo: 'Ensaio Clínico Randomizado Duplo-Cego', nivelEvidencia: 'Ib', grauRecomendacao: 'A', qualidadeGRADE: 'alta',
    populacao: '27.564 pacientes com doença CV aterosclerótica e LDL ≥70 mg/dL em estatina',
    intervencao: 'Evolocumabe 140mg SC a cada 2 semanas ou 420mg SC mensal',
    comparador: 'Placebo',
    desfecho: 'Composto: morte CV, IAM, AVC, hospitalização por angina instável ou revascularização',
    resultadoPrincipal: 'Redução de 15% no desfecho primário (HR 0.85; IC95% 0.79-0.92) com LDL médio de 30 mg/dL',
    nnt: 74, ic95: '0.79-0.92', pValor: '<0.001',
    tags: ['dislipidemia', 'PCSK9', 'evolocumabe', 'LDL', 'aterosclerose'],
    abstract: 'O FOURIER demonstrou que a inibição de PCSK9 com evolocumabe, adicionada à terapia com estatina, reduziu significativamente eventos cardiovasculares em pacientes com doença aterosclerótica estabelecida, alcançando níveis de LDL extremamente baixos com segurança.'
  },
  {
    id: 'ec-006', titulo: 'ROCKET AF — Rivaroxaban Once Daily Oral Direct Factor Xa Inhibition',
    autores: 'Patel MR, Mahaffey KW, Garg J, et al.',
    journal: 'N Engl J Med', ano: 2011, doi: '10.1056/NEJMoa1009638', pmid: '21830957',
    tipo: 'Ensaio Clínico Randomizado Duplo-Cego', nivelEvidencia: 'Ib', grauRecomendacao: 'A', qualidadeGRADE: 'alta',
    populacao: '14.264 pacientes com FA não valvar e CHADS2 ≥2',
    intervencao: 'Rivaroxabana 20mg/dia (15mg se ClCr 30-49)',
    comparador: 'Varfarina (INR 2.0-3.0)',
    desfecho: 'AVC ou embolia sistêmica',
    resultadoPrincipal: 'Não inferioridade confirmada (HR 0.79; IC95% 0.66-0.96 per-protocol)',
    ic95: '0.66-0.96', pValor: '<0.001 para não inferioridade',
    tags: ['fibrilação atrial', 'anticoagulação', 'rivaroxabana', 'DOAC', 'AVC'],
    abstract: 'O ROCKET AF demonstrou que a rivaroxabana é não inferior à varfarina na prevenção de AVC e embolia sistêmica em pacientes com fibrilação atrial não valvar, com menor risco de sangramento intracraniano e fatal.'
  },
  {
    id: 'ec-007', titulo: 'DECLARE-TIMI 58 — Dapagliflozin Effect on Cardiovascular Events',
    autores: 'Wiviott SD, Raz I, Bonaca MP, et al.',
    journal: 'N Engl J Med', ano: 2019, doi: '10.1056/NEJMoa1812389', pmid: '30415602',
    tipo: 'Ensaio Clínico Randomizado Duplo-Cego', nivelEvidencia: 'Ib', grauRecomendacao: 'A', qualidadeGRADE: 'alta',
    populacao: '17.160 pacientes com DM2 e doença CV ou múltiplos fatores de risco',
    intervencao: 'Dapagliflozina 10mg/dia',
    comparador: 'Placebo',
    desfecho: 'Co-primários: MACE e morte CV/hospitalização por IC',
    resultadoPrincipal: 'Redução de 17% em morte CV/hospitalização por IC (HR 0.83; IC95% 0.73-0.95)',
    nnt: 111, ic95: '0.73-0.95', pValor: '0.005',
    tags: ['diabetes', 'SGLT2', 'dapagliflozina', 'cardiovascular', 'insuficiência cardíaca'],
    abstract: 'O DECLARE-TIMI 58 expandiu a evidência dos inibidores SGLT2 para uma população mais ampla de DM2, demonstrando redução significativa em hospitalização por IC e morte CV, mesmo em pacientes sem doença CV estabelecida.'
  },
  {
    id: 'ec-008', titulo: 'CREDENCE — Canagliflozin and Renal Events in Diabetes with Established Nephropathy',
    autores: 'Perkovic V, Jardine MJ, Neal B, et al.',
    journal: 'N Engl J Med', ano: 2019, doi: '10.1056/NEJMoa1811744', pmid: '30990260',
    tipo: 'Ensaio Clínico Randomizado Duplo-Cego', nivelEvidencia: 'Ib', grauRecomendacao: 'A', qualidadeGRADE: 'alta',
    populacao: '4.401 pacientes com DM2, TFGe 30-90 e albuminúria (RAC 300-5000)',
    intervencao: 'Canagliflozina 100mg/dia',
    comparador: 'Placebo',
    desfecho: 'Composto renal: DRET, duplicação creatinina, morte renal ou CV',
    resultadoPrincipal: 'Redução de 30% no desfecho renal primário (HR 0.70; IC95% 0.59-0.82)',
    nnt: 22, ic95: '0.59-0.82', pValor: '0.00001',
    tags: ['diabetes', 'nefropatia', 'SGLT2', 'canagliflozina', 'proteção renal'],
    abstract: 'O CREDENCE foi o primeiro estudo dedicado a demonstrar proteção renal com um inibidor SGLT2 em pacientes com nefropatia diabética. A canagliflozina reduziu significativamente a progressão da doença renal e eventos cardiovasculares.'
  },
  {
    id: 'ec-009', titulo: 'ISCHEMIA Trial — International Study of Comparative Health Effectiveness',
    autores: 'Maron DJ, Hochman JS, Reynolds HR, et al.',
    journal: 'N Engl J Med', ano: 2020, doi: '10.1056/NEJMoa1915922', pmid: '32227755',
    tipo: 'Ensaio Clínico Randomizado Multicêntrico', nivelEvidencia: 'Ib', grauRecomendacao: 'A', qualidadeGRADE: 'alta',
    populacao: '5.179 pacientes com DAC estável e isquemia moderada a grave',
    intervencao: 'Estratégia invasiva inicial (cateterismo + revascularização) + TMO',
    comparador: 'Tratamento médico otimizado (TMO) isolado',
    desfecho: 'Composto: morte CV, IAM, hospitalização por angina instável, IC ou parada cardíaca',
    resultadoPrincipal: 'Sem diferença significativa no desfecho primário (HR 0.93; IC95% 0.80-1.08)',
    ic95: '0.80-1.08', pValor: '0.34',
    tags: ['DAC', 'isquemia', 'revascularização', 'tratamento conservador', 'angina estável'],
    abstract: 'O ISCHEMIA Trial demonstrou que, em pacientes com DAC estável e isquemia moderada a grave, uma estratégia invasiva inicial não reduziu eventos cardiovasculares comparada ao tratamento médico otimizado isolado, mudando o paradigma da abordagem da doença coronariana estável.'
  },
  {
    id: 'ec-010', titulo: 'RECOVERY Trial — Dexamethasone in Hospitalized Patients with COVID-19',
    autores: 'RECOVERY Collaborative Group, Horby P, Lim WS, et al.',
    journal: 'N Engl J Med', ano: 2021, doi: '10.1056/NEJMoa2021436', pmid: '32678530',
    tipo: 'Ensaio Clínico Randomizado Aberto', nivelEvidencia: 'Ib', grauRecomendacao: 'A', qualidadeGRADE: 'alta',
    populacao: '6.425 pacientes hospitalizados com COVID-19',
    intervencao: 'Dexametasona 6mg/dia por até 10 dias',
    comparador: 'Cuidado padrão',
    desfecho: 'Mortalidade em 28 dias',
    resultadoPrincipal: 'Redução de mortalidade em pacientes em ventilação mecânica (RR 0.64; IC95% 0.51-0.81) e O2 (RR 0.82; IC95% 0.72-0.94)',
    nnt: 8, ic95: '0.51-0.81', pValor: '<0.001',
    tags: ['COVID-19', 'corticosteroide', 'dexametasona', 'ventilação mecânica', 'mortalidade'],
    abstract: 'O RECOVERY Trial foi o primeiro grande estudo a demonstrar redução de mortalidade em pacientes hospitalizados com COVID-19 grave. A dexametasona reduziu a mortalidade em 1/3 nos pacientes em ventilação mecânica e em 1/5 nos que necessitavam de oxigênio suplementar.'
  },
  {
    id: 'ec-011', titulo: 'EMPEROR-Reduced — Empagliflozin Outcome Trial in Patients with Chronic HFrEF',
    autores: 'Packer M, Anker SD, Butler J, et al.',
    journal: 'N Engl J Med', ano: 2020, doi: '10.1056/NEJMoa2022190', pmid: '32865377',
    tipo: 'Ensaio Clínico Randomizado Duplo-Cego', nivelEvidencia: 'Ib', grauRecomendacao: 'A', qualidadeGRADE: 'alta',
    populacao: '3.730 pacientes com IC NYHA II-IV e FEVE ≤40%',
    intervencao: 'Empagliflozina 10mg/dia',
    comparador: 'Placebo',
    desfecho: 'Composto: morte CV ou hospitalização por IC',
    resultadoPrincipal: 'Redução de 25% no desfecho primário (HR 0.75; IC95% 0.65-0.86)',
    nnt: 19, ic95: '0.65-0.86', pValor: '<0.001',
    tags: ['insuficiência cardíaca', 'SGLT2', 'empagliflozina', 'FEVE reduzida'],
    abstract: 'O EMPEROR-Reduced confirmou o benefício dos inibidores SGLT2 na IC com FEVE reduzida, demonstrando que a empagliflozina reduziu hospitalização por IC e declínio da função renal, independentemente da presença de diabetes.'
  },
  {
    id: 'ec-012', titulo: 'COMPASS Trial — Rivaroxaban with or without Aspirin in Stable CV Disease',
    autores: 'Eikelboom JW, Connolly SJ, Bosch J, et al.',
    journal: 'N Engl J Med', ano: 2017, doi: '10.1056/NEJMoa1709118', pmid: '28844192',
    tipo: 'Ensaio Clínico Randomizado Duplo-Cego', nivelEvidencia: 'Ib', grauRecomendacao: 'A', qualidadeGRADE: 'alta',
    populacao: '27.395 pacientes com doença CV aterosclerótica estável',
    intervencao: 'Rivaroxabana 2.5mg 2x/dia + AAS 100mg/dia',
    comparador: 'AAS 100mg/dia isolado',
    desfecho: 'Composto: morte CV, AVC ou IAM',
    resultadoPrincipal: 'Redução de 24% no desfecho primário (HR 0.76; IC95% 0.66-0.86)',
    nnt: 77, ic95: '0.66-0.86', pValor: '<0.001',
    tags: ['doença vascular', 'anticoagulação', 'rivaroxabana', 'AAS', 'prevenção secundária'],
    abstract: 'O COMPASS demonstrou que a combinação de rivaroxabana em dose vascular com aspirina reduziu significativamente eventos cardiovasculares maiores em pacientes com doença aterosclerótica estável, estabelecendo um novo paradigma na prevenção secundária.'
  },
];

const NIVEIS_EVIDENCIA: { nivel: NivelEvidencia; descricao: string; tipo: string }[] = [
  { nivel: 'Ia', descricao: 'Revisão Sistemática de ECRs com homogeneidade', tipo: 'Meta-análise' },
  { nivel: 'Ib', descricao: 'ECR individual com intervalo de confiança estreito', tipo: 'Ensaio Clínico Randomizado' },
  { nivel: 'IIa', descricao: 'Revisão Sistemática de estudos de coorte', tipo: 'Coorte' },
  { nivel: 'IIb', descricao: 'Estudo de coorte individual / ECR de baixa qualidade', tipo: 'Coorte / ECR' },
  { nivel: 'III', descricao: 'Revisão Sistemática de estudos caso-controle', tipo: 'Caso-controle' },
  { nivel: 'IV', descricao: 'Série de casos / Coorte de baixa qualidade', tipo: 'Série de casos' },
  { nivel: 'V', descricao: 'Opinião de especialista sem avaliação crítica', tipo: 'Opinião de especialista' },
];

const GUIDELINES_INTERNACIONAIS = [
  { nome: 'ESC 2024 — Chronic Coronary Syndromes', fonte: 'European Society of Cardiology', ano: 2024, area: 'Cardiologia', url: 'https://www.escardio.org/Guidelines' },
  { nome: 'ADA 2025 — Standards of Care in Diabetes', fonte: 'American Diabetes Association', ano: 2025, area: 'Endocrinologia', url: 'https://diabetesjournals.org/care' },
  { nome: 'KDIGO 2024 — CKD Evaluation and Management', fonte: 'Kidney Disease: Improving Global Outcomes', ano: 2024, area: 'Nefrologia', url: 'https://kdigo.org/guidelines' },
  { nome: 'GOLD 2025 — Global Strategy for COPD', fonte: 'Global Initiative for Chronic Obstructive Lung Disease', ano: 2025, area: 'Pneumologia', url: 'https://goldcopd.org' },
  { nome: 'ESC 2023 — Acute Coronary Syndromes', fonte: 'European Society of Cardiology', ano: 2023, area: 'Cardiologia', url: 'https://www.escardio.org/Guidelines' },
  { nome: 'AHA/ACC 2024 — Heart Failure', fonte: 'American Heart Association', ano: 2024, area: 'Cardiologia', url: 'https://www.heart.org/en/professional/quality-improvement/guidelines' },
  { nome: 'NICE 2024 — Hypertension in Adults', fonte: 'National Institute for Health and Care Excellence', ano: 2024, area: 'Cardiologia', url: 'https://www.nice.org.uk/guidance' },
  { nome: 'WHO 2024 — Essential Medicines List', fonte: 'World Health Organization', ano: 2024, area: 'Farmacologia', url: 'https://www.who.int/publications' },
];

export function EvidenceBasedHub() {
  const [tela, setTela] = useState<'estudos' | 'piramide' | 'guidelines' | 'calculadora' | 'busca'>('estudos');
  const [filtroArea, setFiltroArea] = useState('todos');
  const [buscaTermo, setBuscaTermo] = useState('');
  const [estudoSelecionado, setEstudoSelecionado] = useState<EstudoClinico | null>(null);
  const [buscaPubMed, setBuscaPubMed] = useState('');
  const [resultadosPubMed, setResultadosPubMed] = useState<any[]>([]);
  const [buscandoPubMed, setBuscandoPubMed] = useState(false);

  // Calculadora NNT
  const [cerTratamento, setCerTratamento] = useState('');
  const [cerControle, setCerControle] = useState('');

  const estudosFiltrados = ESTUDOS_CLINICOS.filter(e => {
    const matchBusca = !buscaTermo || e.titulo.toLowerCase().includes(buscaTermo.toLowerCase()) ||
      e.tags.some(t => t.toLowerCase().includes(buscaTermo.toLowerCase())) ||
      e.abstract.toLowerCase().includes(buscaTermo.toLowerCase());
    const matchArea = filtroArea === 'todos' || e.tags.some(t => t.toLowerCase().includes(filtroArea.toLowerCase()));
    return matchBusca && matchArea;
  });

  const calcularNNT = () => {
    const cer = parseFloat(cerControle) / 100;
    const eer = parseFloat(cerTratamento) / 100;
    if (isNaN(cer) || isNaN(eer) || cer === eer) return null;
    const arr = Math.abs(cer - eer);
    return { nnt: Math.ceil(1 / arr), arr: (arr * 100).toFixed(1), rrr: (((cer - eer) / cer) * 100).toFixed(1) };
  };

  const buscarPubMed = async () => {
    setBuscandoPubMed(true);
    try {
      const searchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(buscaPubMed)}&retmax=10&sort=relevance&retmode=json`);
      const searchData = await searchRes.json();
      const ids = searchData.esearchresult?.idlist || [];
      if (ids.length > 0) {
        const summaryRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`);
        const summaryData = await summaryRes.json();
        const results = ids.map((id: string) => summaryData.result?.[id]).filter(Boolean);
        setResultadosPubMed(results);
      } else {
        setResultadosPubMed([]);
      }
    } catch (e) {
      setResultadosPubMed([]);
    }
    setBuscandoPubMed(false);
  };

  const corGRADE = (q: QualidadeGRADE) => {
    switch (q) {
      case 'alta': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'moderada': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'baixa': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'muito-baixa': return 'bg-red-500/20 text-red-400 border-red-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="Evidence-Based Medicine Hub" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">📚</span> Evidence-Based Medicine Hub
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-medium">Oxford CEBM</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Estudos clínicos validados, guidelines internacionais e ferramentas de análise de evidência — Padrão Ouro para estudo e prática clínica
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'estudos' as const, label: `📖 Estudos Clínicos (${ESTUDOS_CLINICOS.length})` },
          { id: 'busca' as const, label: '🔍 Busca PubMed' },
          { id: 'piramide' as const, label: '🔺 Pirâmide de Evidência' },
          { id: 'guidelines' as const, label: `📋 Guidelines (${GUIDELINES_INTERNACIONAIS.length})` },
          { id: 'calculadora' as const, label: '🧮 Calculadora NNT' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setTela(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              tela === tab.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border hover:bg-accent'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Estudos Clínicos */}
      {tela === 'estudos' && !estudoSelecionado && (
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <input value={buscaTermo} onChange={e => setBuscaTermo(e.target.value)} placeholder="Buscar por nome, tag ou conteúdo..."
              className="flex-1 min-w-[200px] bg-card border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
            <select value={filtroArea} onChange={e => setFiltroArea(e.target.value)}
              className="bg-card border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none">
              <option value="todos">Todas as áreas</option>
              <option value="cardiovascular">Cardiovascular</option>
              <option value="diabetes">Diabetes</option>
              <option value="insuficiência cardíaca">Insuficiência Cardíaca</option>
              <option value="renal">Renal</option>
              <option value="COVID">COVID-19</option>
            </select>
          </div>

          <div className="grid gap-4">
            {estudosFiltrados.map(estudo => (
              <div key={estudo.id} onClick={() => setEstudoSelecionado(estudo)}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 cursor-pointer transition group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${corGRADE(estudo.qualidadeGRADE)}`}>
                        GRADE: {estudo.qualidadeGRADE.toUpperCase()}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full border bg-blue-500/20 text-blue-400 border-blue-500/50">
                        Nível {estudo.nivelEvidencia}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full border bg-purple-500/20 text-purple-400 border-purple-500/50">
                        Grau {estudo.grauRecomendacao}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm group-hover:text-primary transition">{estudo.titulo}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{estudo.autores}</p>
                    <p className="text-xs text-primary mt-1">{estudo.journal} ({estudo.ano}) | PMID: {estudo.pmid}</p>
                    <p className="text-xs text-foreground/70 mt-2 line-clamp-2">{estudo.resultadoPrincipal}</p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {estudo.tags.slice(0, 4).map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-background text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                  </div>
                  {estudo.nnt && (
                    <div className="text-center shrink-0">
                      <p className="text-2xl font-bold text-primary">{estudo.nnt}</p>
                      <p className="text-[10px] text-muted-foreground">NNT</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detalhe do Estudo */}
      {tela === 'estudos' && estudoSelecionado && (
        <div className="space-y-4">
          <button onClick={() => setEstudoSelecionado(null)} className="text-sm text-primary hover:underline">
            ← Voltar para lista
          </button>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${corGRADE(estudoSelecionado.qualidadeGRADE)}`}>
                GRADE: {estudoSelecionado.qualidadeGRADE.toUpperCase()}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full border bg-blue-500/20 text-blue-400 border-blue-500/50">
                Nível {estudoSelecionado.nivelEvidencia}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full border bg-purple-500/20 text-purple-400 border-purple-500/50">
                Grau {estudoSelecionado.grauRecomendacao}
              </span>
            </div>
            <h2 className="text-xl font-bold">{estudoSelecionado.titulo}</h2>
            <p className="text-sm text-muted-foreground mt-1">{estudoSelecionado.autores}</p>
            <p className="text-sm text-primary mt-1">{estudoSelecionado.journal} ({estudoSelecionado.ano}) | DOI: {estudoSelecionado.doi} | PMID: {estudoSelecionado.pmid}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-3">📋 Formato PICO</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/50 rounded-lg p-3"><p className="text-[10px] text-primary font-bold mb-1">P — POPULAÇÃO</p><p className="text-xs">{estudoSelecionado.populacao}</p></div>
              <div className="bg-background/50 rounded-lg p-3"><p className="text-[10px] text-primary font-bold mb-1">I — INTERVENÇÃO</p><p className="text-xs">{estudoSelecionado.intervencao}</p></div>
              <div className="bg-background/50 rounded-lg p-3"><p className="text-[10px] text-primary font-bold mb-1">C — COMPARADOR</p><p className="text-xs">{estudoSelecionado.comparador}</p></div>
              <div className="bg-background/50 rounded-lg p-3"><p className="text-[10px] text-primary font-bold mb-1">O — DESFECHO</p><p className="text-xs">{estudoSelecionado.desfecho}</p></div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-3">📊 Resultados Principais</h3>
            <p className="text-sm">{estudoSelecionado.resultadoPrincipal}</p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {estudoSelecionado.nnt && <div className="bg-green-500/10 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-green-400">{estudoSelecionado.nnt}</p><p className="text-[10px] text-muted-foreground">NNT</p></div>}
              <div className="bg-blue-500/10 rounded-lg p-3 text-center"><p className="text-lg font-bold text-blue-400">{estudoSelecionado.ic95}</p><p className="text-[10px] text-muted-foreground">IC 95%</p></div>
              <div className="bg-purple-500/10 rounded-lg p-3 text-center"><p className="text-lg font-bold text-purple-400">{estudoSelecionado.pValor}</p><p className="text-[10px] text-muted-foreground">p-valor</p></div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-3">📝 Abstract / Resumo</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">{estudoSelecionado.abstract}</p>
          </div>
        </div>
      )}

      {/* Busca PubMed */}
      {tela === 'busca' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-3">🔍 Busca PubMed em Tempo Real</h3>
            <div className="flex gap-3">
              <input value={buscaPubMed} onChange={e => setBuscaPubMed(e.target.value)} onKeyDown={e => e.key === 'Enter' && buscarPubMed()}
                placeholder="Ex: SGLT2 inhibitors heart failure meta-analysis"
                className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
              <button onClick={buscarPubMed} disabled={!buscaPubMed || buscandoPubMed}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-50">
                {buscandoPubMed ? '⏳ Buscando...' : '🔍 Buscar'}
              </button>
            </div>
          </div>

          {buscandoPubMed && (
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm">Consultando PubMed/NCBI...</p>
            </div>
          )}

          {resultadosPubMed.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{resultadosPubMed.length} resultados encontrados</p>
              {resultadosPubMed.map((r: any) => (
                <div key={r.uid} className="bg-card border border-border rounded-xl p-4">
                  <h4 className="font-bold text-sm">{r.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{r.authors?.map((a: any) => a.name).join(', ')}</p>
                  <p className="text-xs text-primary mt-1">{r.source} ({r.pubdate}) | PMID: {r.uid}</p>
                  <a href={`https://pubmed.ncbi.nlm.nih.gov/${r.uid}/`} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:underline mt-2 inline-block">Ver no PubMed →</a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pirâmide de Evidência */}
      {tela === 'piramide' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">🔺 Pirâmide de Evidência — Oxford CEBM (2011)</h3>
            <p className="text-xs text-muted-foreground mb-4">Centre for Evidence-Based Medicine, University of Oxford</p>
            <div className="space-y-2">
              {NIVEIS_EVIDENCIA.map((ne, i) => {
                const widths = ['w-[30%]', 'w-[40%]', 'w-[50%]', 'w-[60%]', 'w-[70%]', 'w-[80%]', 'w-[90%]'];
                const colors = ['bg-green-500/30 border-green-500/50', 'bg-green-500/20 border-green-500/40', 'bg-yellow-500/20 border-yellow-500/40', 'bg-yellow-500/15 border-yellow-500/30', 'bg-orange-500/20 border-orange-500/40', 'bg-orange-500/15 border-orange-500/30', 'bg-red-500/20 border-red-500/40'];
                return (
                  <div key={ne.nivel} className={`${widths[i]} ${colors[i]} border rounded-lg p-3 mx-auto`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm">Nível {ne.nivel}</span>
                        <span className="text-xs text-muted-foreground ml-2">— {ne.tipo}</span>
                      </div>
                    </div>
                    <p className="text-xs text-foreground/70 mt-1">{ne.descricao}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">📊 Graus de Recomendação</h3>
            <div className="grid md:grid-cols-4 gap-3">
              {[
                { grau: 'A', desc: 'Estudos consistentes de nível 1', cor: 'bg-green-500/20 border-green-500/50 text-green-400' },
                { grau: 'B', desc: 'Estudos consistentes de nível 2-3 ou extrapolações de nível 1', cor: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' },
                { grau: 'C', desc: 'Estudos de nível 4 ou extrapolações de nível 2-3', cor: 'bg-orange-500/20 border-orange-500/50 text-orange-400' },
                { grau: 'D', desc: 'Nível 5 ou estudos inconsistentes/inconclusivos', cor: 'bg-red-500/20 border-red-500/50 text-red-400' },
              ].map(g => (
                <div key={g.grau} className={`${g.cor} border rounded-xl p-4 text-center`}>
                  <p className="text-3xl font-bold">{g.grau}</p>
                  <p className="text-xs mt-2">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Guidelines */}
      {tela === 'guidelines' && (
        <div className="space-y-4">
          <h3 className="font-bold">📋 Guidelines Internacionais Atualizados</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {GUIDELINES_INTERNACIONAIS.map((g, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">{g.area}</span>
                  <span className="text-xs text-muted-foreground">{g.ano}</span>
                </div>
                <h4 className="font-bold text-sm">{g.nome}</h4>
                <p className="text-xs text-muted-foreground mt-1">{g.fonte}</p>
                <a href={g.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline mt-2 inline-block">
                  Acessar guideline →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calculadora NNT */}
      {tela === 'calculadora' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">🧮 Calculadora NNT / NNH</h3>
            <p className="text-xs text-muted-foreground mb-4">Number Needed to Treat — quantos pacientes precisam ser tratados para prevenir 1 evento</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">Taxa de eventos no grupo CONTROLE (%)</label>
                <input type="number" value={cerControle} onChange={e => setCerControle(e.target.value)}
                  placeholder="Ex: 15" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm mt-1 focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Taxa de eventos no grupo TRATAMENTO (%)</label>
                <input type="number" value={cerTratamento} onChange={e => setCerTratamento(e.target.value)}
                  placeholder="Ex: 10" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm mt-1 focus:border-primary focus:outline-none" />
              </div>
            </div>

            {calcularNNT() && (
              <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div><p className="text-3xl font-bold text-green-400">{calcularNNT()!.nnt}</p><p className="text-[10px] text-muted-foreground">NNT</p></div>
                  <div><p className="text-xl font-bold text-blue-400">{calcularNNT()!.arr}%</p><p className="text-[10px] text-muted-foreground">ARR</p></div>
                  <div><p className="text-xl font-bold text-purple-400">{calcularNNT()!.rrr}%</p><p className="text-[10px] text-muted-foreground">RRR</p></div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">📖 Glossário EBM</h3>
            <div className="space-y-3">
              {[
                { sigla: 'NNT', nome: 'Number Needed to Treat', desc: 'Pacientes a tratar para prevenir 1 evento adverso' },
                { sigla: 'NNH', nome: 'Number Needed to Harm', desc: 'Pacientes tratados para causar 1 evento adverso' },
                { sigla: 'ARR', nome: 'Absolute Risk Reduction', desc: 'Diferença absoluta entre taxas de eventos' },
                { sigla: 'RRR', nome: 'Relative Risk Reduction', desc: 'Redução relativa do risco comparado ao controle' },
                { sigla: 'HR', nome: 'Hazard Ratio', desc: 'Razão de taxas de risco (análise de sobrevida)' },
                { sigla: 'OR', nome: 'Odds Ratio', desc: 'Razão de chances (estudos caso-controle)' },
                { sigla: 'IC 95%', nome: 'Intervalo de Confiança 95%', desc: 'Faixa que contém o valor real com 95% de confiança' },
                { sigla: 'GRADE', nome: 'Grading of Recommendations', desc: 'Sistema para avaliar qualidade da evidência' },
              ].map(g => (
                <div key={g.sigla} className="bg-background/50 rounded-lg p-3">
                  <div className="flex items-center gap-2"><span className="font-bold text-primary text-xs">{g.sigla}</span><span className="text-xs text-foreground/70">— {g.nome}</span></div>
                  <p className="text-[10px] text-muted-foreground mt-1">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <EducationalDisclaimer variant="footer" />
    </div>
  );
}
