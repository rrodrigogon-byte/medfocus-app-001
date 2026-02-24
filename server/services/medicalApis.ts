/**
 * Medical External APIs Integration
 * OpenFDA, ANVISA, PubMed/NCBI, CID-10, Drug Interactions
 */

// ─── OpenFDA API ──────────────────────────────────────────────
const OPENFDA_BASE = "https://api.fda.gov";

export interface FDADrugResult {
  brand_name?: string;
  generic_name?: string;
  manufacturer_name?: string;
  route?: string[];
  dosage_form?: string;
  active_ingredients?: { name: string; strength: string }[];
  warnings?: string;
  indications_and_usage?: string[];
  adverse_reactions?: string;
  drug_interactions?: string;
  boxed_warning?: string;
}

export async function searchFDADrugs(query: string, limit = 10): Promise<FDADrugResult[]> {
  try {
    const url = `${OPENFDA_BASE}/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(query)}"+openfda.generic_name:"${encodeURIComponent(query)}"&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((r: any) => ({
      brand_name: r.openfda?.brand_name?.[0],
      generic_name: r.openfda?.generic_name?.[0],
      manufacturer_name: r.openfda?.manufacturer_name?.[0],
      route: r.openfda?.route,
      dosage_form: r.openfda?.dosage_form?.[0],
      active_ingredients: r.openfda?.substance_name?.map((n: string) => ({ name: n, strength: '' })),
      warnings: r.warnings?.[0]?.substring(0, 2000),
      indications_and_usage: r.indications_and_usage,
      adverse_reactions: r.adverse_reactions?.[0]?.substring(0, 2000),
      drug_interactions: r.drug_interactions?.[0]?.substring(0, 2000),
      boxed_warning: r.boxed_warning?.[0]?.substring(0, 1000),
    }));
  } catch (err) {
    console.error("[OpenFDA] Search error:", err);
    return [];
  }
}

export async function getFDAAdverseEvents(drugName: string, limit = 10) {
  try {
    const url = `${OPENFDA_BASE}/drug/event.json?search=patient.drug.openfda.generic_name:"${encodeURIComponent(drugName)}"&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((r: any) => ({
      receivedate: r.receivedate,
      serious: r.serious,
      seriousnessdeath: r.seriousnessdeath,
      seriousnesshospitalization: r.seriousnesshospitalization,
      patient: {
        age: r.patient?.patientonsetage,
        sex: r.patient?.patientsex === '1' ? 'Male' : r.patient?.patientsex === '2' ? 'Female' : 'Unknown',
        reactions: r.patient?.reaction?.map((rx: any) => rx.reactionmeddrapt) || [],
        drugs: r.patient?.drug?.map((d: any) => ({
          name: d.medicinalproduct,
          indication: d.drugindication,
          characterization: d.drugcharacterization,
        })) || [],
      },
    }));
  } catch (err) {
    console.error("[OpenFDA] Adverse events error:", err);
    return [];
  }
}

export async function getFDADrugInteractions(drugName: string) {
  try {
    const url = `${OPENFDA_BASE}/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(drugName)}"&limit=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const result = data.results?.[0];
    if (!result) return null;
    return {
      drug_name: result.openfda?.generic_name?.[0] || drugName,
      brand_name: result.openfda?.brand_name?.[0],
      drug_interactions: result.drug_interactions?.[0] || 'No interaction data available',
      contraindications: result.contraindications?.[0] || '',
      warnings_and_cautions: result.warnings_and_cautions?.[0] || result.warnings?.[0] || '',
      pregnancy: result.pregnancy?.[0] || '',
      nursing_mothers: result.nursing_mothers?.[0] || '',
      pediatric_use: result.pediatric_use?.[0] || '',
      geriatric_use: result.geriatric_use?.[0] || '',
      overdosage: result.overdosage?.[0] || '',
    };
  } catch (err) {
    console.error("[OpenFDA] Drug interactions error:", err);
    return null;
  }
}

// ─── ANVISA Integration (via dados abertos CSV/web scraping) ──
export interface ANVISADrug {
  nome_comercial: string;
  principio_ativo: string;
  empresa: string;
  registro: string;
  classe_terapeutica: string;
  forma_farmaceutica: string;
  vencimento_registro: string;
}

export async function searchANVISADrugs(query: string): Promise<ANVISADrug[]> {
  // ANVISA doesn't have a public REST API, so we use the Gemini AI to provide
  // accurate ANVISA-registered drug information based on its training data
  // For production, this would integrate with ANVISA's dados abertos CSV files
  return [];
}

// ─── PubMed/NCBI E-utilities ──────────────────────────────────
const PUBMED_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

export interface PubMedArticle {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  pubDate: string;
  doi: string;
  abstractText: string;
}

export async function searchPubMed(query: string, maxResults = 10): Promise<PubMedArticle[]> {
  try {
    // Step 1: Search for PMIDs
    const searchUrl = `${PUBMED_BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&retmode=json&sort=relevance`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) return [];
    const searchData = await searchRes.json();
    const ids = searchData.esearchresult?.idlist || [];
    if (ids.length === 0) return [];

    // Step 2: Fetch article details
    const fetchUrl = `${PUBMED_BASE}/efetch.fcgi?db=pubmed&id=${ids.join(',')}&rettype=abstract&retmode=xml`;
    const fetchRes = await fetch(fetchUrl);
    if (!fetchRes.ok) return [];
    const xmlText = await fetchRes.text();

    // Parse XML response
    const articles: PubMedArticle[] = [];
    const articleMatches = xmlText.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || [];
    
    for (const articleXml of articleMatches) {
      const pmid = articleXml.match(/<PMID[^>]*>(\d+)<\/PMID>/)?.[1] || '';
      const title = articleXml.match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/)?.[1]?.replace(/<[^>]+>/g, '') || '';
      const journal = articleXml.match(/<Title>([\s\S]*?)<\/Title>/)?.[1] || '';
      const year = articleXml.match(/<Year>(\d{4})<\/Year>/)?.[1] || '';
      const month = articleXml.match(/<Month>(\w+)<\/Month>/)?.[1] || '';
      const doi = articleXml.match(/<ArticleId IdType="doi">([\s\S]*?)<\/ArticleId>/)?.[1] || '';
      const abstractText = articleXml.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g)
        ?.map(t => t.replace(/<[^>]+>/g, ''))
        .join(' ') || '';
      
      const authorMatches = articleXml.match(/<Author[^>]*>[\s\S]*?<\/Author>/g) || [];
      const authors = authorMatches.map(a => {
        const lastName = a.match(/<LastName>([\s\S]*?)<\/LastName>/)?.[1] || '';
        const foreName = a.match(/<ForeName>([\s\S]*?)<\/ForeName>/)?.[1] || '';
        return `${lastName} ${foreName}`.trim();
      }).filter(Boolean);

      articles.push({
        pmid,
        title,
        authors,
        journal,
        pubDate: `${year} ${month}`.trim(),
        doi,
        abstractText,
      });
    }
    return articles;
  } catch (err) {
    console.error("[PubMed] Search error:", err);
    return [];
  }
}

// ─── CID-10 (ICD-10) Lookup ──────────────────────────────────
export interface CID10Code {
  code: string;
  description: string;
  category: string;
  chapter: string;
}

// CID-10 codes are embedded in the AI model's knowledge
// For production, integrate with WHO ICD API: https://icd.who.int/icdapi
export async function searchCID10(query: string): Promise<CID10Code[]> {
  // This will be handled by the Gemini AI with structured output
  return [];
}

// ─── Medical Calculators ──────────────────────────────────────
export interface CalculatorResult {
  name: string;
  score: number;
  interpretation: string;
  details: Record<string, any>;
}

export function calculateGlasgow(eyeResponse: number, verbalResponse: number, motorResponse: number): CalculatorResult {
  const score = eyeResponse + verbalResponse + motorResponse;
  let interpretation = '';
  if (score <= 8) interpretation = 'Coma grave (TCE grave) — Indicação de intubação orotraqueal';
  else if (score <= 12) interpretation = 'Coma moderado (TCE moderado)';
  else if (score <= 14) interpretation = 'Coma leve (TCE leve)';
  else interpretation = 'Normal — Sem alteração do nível de consciência';
  
  return {
    name: 'Escala de Coma de Glasgow (ECG)',
    score,
    interpretation,
    details: { eyeResponse, verbalResponse, motorResponse, min: 3, max: 15 },
  };
}

export function calculateSOFA(
  pao2fio2: number, platelets: number, bilirubin: number,
  map: number, creatinine: number, glasgowScore: number
): CalculatorResult {
  let score = 0;
  // Respiratory (PaO2/FiO2)
  if (pao2fio2 < 100) score += 4;
  else if (pao2fio2 < 200) score += 3;
  else if (pao2fio2 < 300) score += 2;
  else if (pao2fio2 < 400) score += 1;
  // Coagulation (Platelets x10³/µL)
  if (platelets < 20) score += 4;
  else if (platelets < 50) score += 3;
  else if (platelets < 100) score += 2;
  else if (platelets < 150) score += 1;
  // Liver (Bilirubin mg/dL)
  if (bilirubin >= 12) score += 4;
  else if (bilirubin >= 6) score += 3;
  else if (bilirubin >= 2) score += 2;
  else if (bilirubin >= 1.2) score += 1;
  // Cardiovascular (MAP mmHg)
  if (map < 70) score += 1;
  // Renal (Creatinine mg/dL)
  if (creatinine >= 5) score += 4;
  else if (creatinine >= 3.5) score += 3;
  else if (creatinine >= 2) score += 2;
  else if (creatinine >= 1.2) score += 1;
  // CNS (Glasgow)
  if (glasgowScore < 6) score += 4;
  else if (glasgowScore < 10) score += 3;
  else if (glasgowScore < 13) score += 2;
  else if (glasgowScore < 15) score += 1;

  let interpretation = '';
  if (score >= 15) interpretation = 'Mortalidade estimada > 80% — Falência orgânica múltipla grave';
  else if (score >= 12) interpretation = 'Mortalidade estimada 40-50%';
  else if (score >= 9) interpretation = 'Mortalidade estimada 33%';
  else if (score >= 6) interpretation = 'Mortalidade estimada < 33%';
  else if (score >= 3) interpretation = 'Mortalidade estimada < 20%';
  else interpretation = 'Mortalidade estimada < 10%';

  return {
    name: 'SOFA Score (Sequential Organ Failure Assessment)',
    score,
    interpretation,
    details: { pao2fio2, platelets, bilirubin, map, creatinine, glasgowScore, min: 0, max: 24 },
  };
}

export function calculateAPACHEII(
  age: number, temperature: number, map: number, heartRate: number,
  respiratoryRate: number, pao2: number, arterialPh: number,
  sodium: number, potassium: number, creatinine: number,
  hematocrit: number, wbc: number, glasgowScore: number,
  chronicHealth: number
): CalculatorResult {
  let score = 0;
  // Age points
  if (age >= 75) score += 6;
  else if (age >= 65) score += 5;
  else if (age >= 55) score += 3;
  else if (age >= 45) score += 2;
  // Temperature
  if (temperature >= 41 || temperature <= 29.9) score += 4;
  else if (temperature >= 39 || temperature <= 31.9) score += 3;
  else if (temperature >= 38.5 || temperature <= 33.9) score += 1;
  // MAP
  if (map >= 160 || map <= 49) score += 4;
  else if (map >= 130 || map <= 69) score += 2;
  else if (map >= 110) score += 1;
  // Heart Rate
  if (heartRate >= 180 || heartRate <= 39) score += 4;
  else if (heartRate >= 140 || heartRate <= 54) score += 3;
  else if (heartRate >= 110 || heartRate <= 69) score += 2;
  // GCS
  score += (15 - glasgowScore);
  // Chronic health
  score += chronicHealth;

  let mortality = '';
  if (score >= 35) mortality = 'Mortalidade estimada > 73%';
  else if (score >= 25) mortality = 'Mortalidade estimada ~55%';
  else if (score >= 20) mortality = 'Mortalidade estimada ~40%';
  else if (score >= 15) mortality = 'Mortalidade estimada ~25%';
  else if (score >= 10) mortality = 'Mortalidade estimada ~15%';
  else mortality = 'Mortalidade estimada < 10%';

  return { name: 'APACHE II Score', score, interpretation: mortality, details: { min: 0, max: 71 } };
}

export function calculateWells(
  clinicalDVT: boolean, alternativeDiagnosisLessLikely: boolean,
  heartRate100: boolean, immobilization: boolean,
  previousDVTPE: boolean, hemoptysis: boolean, malignancy: boolean
): CalculatorResult {
  let score = 0;
  if (clinicalDVT) score += 3;
  if (alternativeDiagnosisLessLikely) score += 3;
  if (heartRate100) score += 1.5;
  if (immobilization) score += 1.5;
  if (previousDVTPE) score += 1.5;
  if (hemoptysis) score += 1;
  if (malignancy) score += 1;

  let interpretation = '';
  if (score > 6) interpretation = 'Alta probabilidade de TEP — Considerar angiotomografia imediata';
  else if (score >= 2) interpretation = 'Probabilidade moderada de TEP — Solicitar D-dímero e considerar angiotomografia';
  else interpretation = 'Baixa probabilidade de TEP — Solicitar D-dímero';

  return { name: 'Critérios de Wells para TEP', score, interpretation, details: { min: 0, max: 12.5 } };
}

export function calculateCHA2DS2VASc(
  chf: boolean, hypertension: boolean, age75: boolean,
  diabetes: boolean, stroke: boolean, vascular: boolean,
  age65: boolean, female: boolean
): CalculatorResult {
  let score = 0;
  if (chf) score += 1;
  if (hypertension) score += 1;
  if (age75) score += 2;
  if (diabetes) score += 1;
  if (stroke) score += 2;
  if (vascular) score += 1;
  if (age65) score += 1;
  if (female) score += 1;

  let interpretation = '';
  if (score >= 2) interpretation = 'Alto risco de AVC — Anticoagulação oral recomendada';
  else if (score === 1) interpretation = 'Risco moderado — Considerar anticoagulação oral';
  else interpretation = 'Baixo risco — Sem necessidade de anticoagulação';

  return { name: 'CHA₂DS₂-VASc Score', score, interpretation, details: { min: 0, max: 9 } };
}

export function calculateChildPugh(
  bilirubin: number, albumin: number, inr: number,
  ascites: 'none' | 'mild' | 'moderate_severe',
  encephalopathy: 'none' | 'grade1_2' | 'grade3_4'
): CalculatorResult {
  let score = 0;
  // Bilirubin
  if (bilirubin > 3) score += 3;
  else if (bilirubin >= 2) score += 2;
  else score += 1;
  // Albumin
  if (albumin < 2.8) score += 3;
  else if (albumin <= 3.5) score += 2;
  else score += 1;
  // INR
  if (inr > 2.3) score += 3;
  else if (inr >= 1.7) score += 2;
  else score += 1;
  // Ascites
  if (ascites === 'moderate_severe') score += 3;
  else if (ascites === 'mild') score += 2;
  else score += 1;
  // Encephalopathy
  if (encephalopathy === 'grade3_4') score += 3;
  else if (encephalopathy === 'grade1_2') score += 2;
  else score += 1;

  let classification = '';
  if (score >= 10) classification = 'Child-Pugh C — Cirrose descompensada — Sobrevida 1 ano: 45%';
  else if (score >= 7) classification = 'Child-Pugh B — Comprometimento funcional significativo — Sobrevida 1 ano: 80%';
  else classification = 'Child-Pugh A — Função hepática bem preservada — Sobrevida 1 ano: 100%';

  return { name: 'Classificação de Child-Pugh', score, interpretation: classification, details: { min: 5, max: 15 } };
}

export function calculateMELD(bilirubin: number, inr: number, creatinine: number, sodium?: number): CalculatorResult {
  const bil = Math.max(1, bilirubin);
  const cr = Math.max(1, Math.min(4, creatinine));
  const inrVal = Math.max(1, inr);
  
  let score = Math.round(
    10 * (0.957 * Math.log(cr) + 0.378 * Math.log(bil) + 1.120 * Math.log(inrVal) + 0.643)
  );
  score = Math.max(6, Math.min(40, score));

  // MELD-Na if sodium provided
  if (sodium !== undefined) {
    const na = Math.max(125, Math.min(137, sodium));
    score = Math.round(score + 1.32 * (137 - na) - 0.033 * score * (137 - na));
    score = Math.max(6, Math.min(40, score));
  }

  let interpretation = '';
  if (score >= 30) interpretation = 'Mortalidade em 3 meses: 52-75% — Prioridade alta para transplante';
  else if (score >= 20) interpretation = 'Mortalidade em 3 meses: 20-52%';
  else if (score >= 10) interpretation = 'Mortalidade em 3 meses: 6-20%';
  else interpretation = 'Mortalidade em 3 meses: < 6%';

  return { name: sodium ? 'MELD-Na Score' : 'MELD Score', score, interpretation, details: { min: 6, max: 40 } };
}


// ─── CURB-65 — Pneumonia Severity (Lim WS et al. Thorax. 2003;58(5):377-382) ───
export function calculateCURB65(
  confusion: boolean, urea: number, respiratoryRate: number,
  systolicBP: number, diastolicBP: number, age: number
): CalculatorResult {
  let score = 0;
  if (confusion) score++;
  if (urea > 7) score++; // >7 mmol/L (or >42 mg/dL BUN)
  if (respiratoryRate >= 30) score++;
  if (systolicBP < 90 || diastolicBP <= 60) score++;
  if (age >= 65) score++;

  let interpretation = '';
  if (score === 0) interpretation = 'Baixo risco (mortalidade 0.6%) — Tratamento ambulatorial';
  else if (score === 1) interpretation = 'Baixo risco (mortalidade 2.7%) — Considerar tratamento ambulatorial';
  else if (score === 2) interpretation = 'Risco moderado (mortalidade 6.8%) — Internação hospitalar';
  else if (score === 3) interpretation = 'Alto risco (mortalidade 14.0%) — Internação + considerar UTI';
  else interpretation = 'Muito alto risco (mortalidade 27.8-57.3%) — UTI obrigatória';

  return {
    name: 'CURB-65',
    score,
    interpretation,
    details: {
      min: 0, max: 5,
      reference: 'Lim WS et al. Thorax. 2003;58(5):377-382. PMID: 12728155',
      criteria: { confusion, urea_elevated: urea > 7, tachypnea: respiratoryRate >= 30, hypotension: systolicBP < 90 || diastolicBP <= 60, age_65: age >= 65 }
    }
  };
}

// ─── HEART Score — Chest Pain Risk (Six AJ et al. Neth Heart J. 2008;16(6):191-196) ───
export function calculateHEART(
  history: 0 | 1 | 2, ecg: 0 | 1 | 2, age: 0 | 1 | 2,
  riskFactors: 0 | 1 | 2, troponin: 0 | 1 | 2
): CalculatorResult {
  const score = history + ecg + age + riskFactors + troponin;

  let interpretation = '';
  if (score <= 3) interpretation = 'Baixo risco (MACE 0.9-1.7%) — Alta precoce, seguimento ambulatorial';
  else if (score <= 6) interpretation = 'Risco moderado (MACE 12-16.6%) — Observação + investigação';
  else interpretation = 'Alto risco (MACE 50-65%) — Estratégia invasiva precoce';

  return {
    name: 'HEART Score',
    score,
    interpretation,
    details: {
      min: 0, max: 10,
      reference: 'Six AJ et al. Neth Heart J. 2008;16(6):191-196. Backus BE et al. Int J Cardiol. 2013;168(3):2153-2158',
      components: { history, ecg, age, riskFactors, troponin }
    }
  };
}

// ─── PERC Rule — PE Rule-Out (Kline JA et al. J Thromb Haemost. 2008;6(5):772-780) ───
export function calculatePERC(
  age50: boolean, hr100: boolean, spo2_95: boolean, unilateralLegSwelling: boolean,
  hemoptysis: boolean, recentSurgery: boolean, priorDVTPE: boolean, estrogenUse: boolean
): CalculatorResult {
  const criteria = [age50, hr100, spo2_95, unilateralLegSwelling, hemoptysis, recentSurgery, priorDVTPE, estrogenUse];
  const positiveCount = criteria.filter(Boolean).length;
  const allNegative = positiveCount === 0;

  return {
    name: 'PERC Rule',
    score: positiveCount,
    interpretation: allNegative
      ? 'PERC negativo — TEP pode ser excluído sem D-dímero (se pré-teste baixo)'
      : `PERC positivo (${positiveCount} critério(s)) — Prosseguir com D-dímero ou angioTC`,
    details: {
      min: 0, max: 8,
      reference: 'Kline JA et al. J Thromb Haemost. 2008;6(5):772-780. PMID: 18318689',
      percNegative: allNegative,
      criteria: { age50, hr100, spo2_95, unilateralLegSwelling, hemoptysis, recentSurgery, priorDVTPE, estrogenUse }
    }
  };
}

// ─── NEWS-2 — National Early Warning Score (Royal College of Physicians, 2017) ───
export function calculateNEWS2(
  respiratoryRate: number, spo2: number, onSupplementalO2: boolean,
  temperature: number, systolicBP: number, heartRate: number,
  consciousness: 'alert' | 'confusion' | 'voice' | 'pain' | 'unresponsive'
): CalculatorResult {
  let score = 0;

  // Respiratory rate
  if (respiratoryRate <= 8) score += 3;
  else if (respiratoryRate <= 11) score += 1;
  else if (respiratoryRate <= 20) score += 0;
  else if (respiratoryRate <= 24) score += 2;
  else score += 3;

  // SpO2 Scale 1 (no hypercapnic risk)
  if (spo2 <= 91) score += 3;
  else if (spo2 <= 93) score += 2;
  else if (spo2 <= 95) score += 1;
  else score += 0;

  // Supplemental O2
  if (onSupplementalO2) score += 2;

  // Temperature
  if (temperature <= 35.0) score += 3;
  else if (temperature <= 36.0) score += 1;
  else if (temperature <= 38.0) score += 0;
  else if (temperature <= 39.0) score += 1;
  else score += 2;

  // Systolic BP
  if (systolicBP <= 90) score += 3;
  else if (systolicBP <= 100) score += 2;
  else if (systolicBP <= 110) score += 1;
  else if (systolicBP <= 219) score += 0;
  else score += 3;

  // Heart rate
  if (heartRate <= 40) score += 3;
  else if (heartRate <= 50) score += 1;
  else if (heartRate <= 90) score += 0;
  else if (heartRate <= 110) score += 1;
  else if (heartRate <= 130) score += 2;
  else score += 3;

  // Consciousness
  if (consciousness === 'alert') score += 0;
  else if (consciousness === 'confusion') score += 3;
  else if (consciousness === 'voice') score += 3;
  else if (consciousness === 'pain') score += 3;
  else score += 3;

  let interpretation = '';
  if (score === 0) interpretation = 'Baixo risco — Monitoramento de rotina';
  else if (score <= 4) interpretation = 'Baixo risco — Avaliação por enfermeiro, considerar aumento de monitoramento';
  else if (score <= 6) interpretation = 'Risco médio — Resposta urgente, avaliação médica';
  else interpretation = 'Alto risco — Resposta de emergência, considerar UTI';

  return {
    name: 'NEWS-2',
    score,
    interpretation,
    details: {
      min: 0, max: 20,
      reference: 'Royal College of Physicians. NEWS2. 2017. www.rcplondon.ac.uk/projects/outputs/national-early-warning-score-news-2',
    }
  };
}

// ─── qSOFA — Quick SOFA (Seymour CW et al. JAMA. 2016;315(8):762-774) ───
export function calculateQSOFA(
  alteredMentation: boolean, respiratoryRate: number, systolicBP: number
): CalculatorResult {
  let score = 0;
  if (alteredMentation) score++;
  if (respiratoryRate >= 22) score++;
  if (systolicBP <= 100) score++;

  let interpretation = '';
  if (score === 0) interpretation = 'Baixo risco de sepse — Monitorar clinicamente';
  else if (score === 1) interpretation = 'Risco intermediário — Avaliar SOFA completo se infecção suspeita';
  else interpretation = 'Alto risco de sepse (mortalidade 3-14x maior) — Avaliar SOFA + iniciar bundle de sepse';

  return {
    name: 'qSOFA',
    score,
    interpretation,
    details: {
      min: 0, max: 3,
      reference: 'Seymour CW et al. JAMA. 2016;315(8):762-774. Singer M et al. JAMA. 2016;315(8):801-810',
      criteria: { alteredMentation, tachypnea: respiratoryRate >= 22, hypotension: systolicBP <= 100 }
    }
  };
}

// ─── HAS-BLED — Bleeding Risk in AF (Pisters R et al. Chest. 2010;138(5):1093-1100) ───
export function calculateHASBLED(
  hypertension: boolean, abnormalRenal: boolean, abnormalLiver: boolean,
  stroke: boolean, bleeding: boolean, labileINR: boolean,
  elderly: boolean, drugs: boolean, alcohol: boolean
): CalculatorResult {
  let score = 0;
  if (hypertension) score++;
  if (abnormalRenal) score++;
  if (abnormalLiver) score++;
  if (stroke) score++;
  if (bleeding) score++;
  if (labileINR) score++;
  if (elderly) score++;
  if (drugs) score++;
  if (alcohol) score++;

  let interpretation = '';
  if (score <= 2) interpretation = 'Baixo risco de sangramento — Anticoagulação segura';
  else interpretation = `Alto risco de sangramento (score ${score}) — Cautela com anticoagulação, corrigir fatores modificáveis`;

  return {
    name: 'HAS-BLED',
    score,
    interpretation,
    details: {
      min: 0, max: 9,
      reference: 'Pisters R et al. Chest. 2010;138(5):1093-1100. PMID: 20299623',
      criteria: { hypertension, abnormalRenal, abnormalLiver, stroke, bleeding, labileINR, elderly, drugs, alcohol }
    }
  };
}

// ─── GRACE Score — ACS Risk (Fox KAA et al. BMJ. 2006;333(7578):1091) ───
export function calculateGRACE(
  age: number, heartRate: number, systolicBP: number,
  creatinine: number, killipClass: 1 | 2 | 3 | 4,
  cardiacArrest: boolean, stDeviation: boolean, elevatedBiomarkers: boolean
): CalculatorResult {
  // Simplified GRACE score calculation
  let score = 0;

  // Age
  if (age < 30) score += 0;
  else if (age < 40) score += 8;
  else if (age < 50) score += 25;
  else if (age < 60) score += 41;
  else if (age < 70) score += 58;
  else if (age < 80) score += 75;
  else if (age < 90) score += 91;
  else score += 100;

  // Heart rate
  if (heartRate < 50) score += 0;
  else if (heartRate < 70) score += 3;
  else if (heartRate < 90) score += 9;
  else if (heartRate < 110) score += 15;
  else if (heartRate < 150) score += 24;
  else if (heartRate < 200) score += 38;
  else score += 46;

  // Systolic BP
  if (systolicBP < 80) score += 58;
  else if (systolicBP < 100) score += 53;
  else if (systolicBP < 120) score += 43;
  else if (systolicBP < 140) score += 34;
  else if (systolicBP < 160) score += 24;
  else if (systolicBP < 200) score += 10;
  else score += 0;

  // Creatinine (mg/dL)
  if (creatinine < 0.4) score += 1;
  else if (creatinine < 0.8) score += 4;
  else if (creatinine < 1.2) score += 7;
  else if (creatinine < 1.6) score += 10;
  else if (creatinine < 2.0) score += 13;
  else if (creatinine < 4.0) score += 21;
  else score += 28;

  // Killip class
  score += (killipClass - 1) * 20;

  // Other
  if (cardiacArrest) score += 39;
  if (stDeviation) score += 28;
  if (elevatedBiomarkers) score += 14;

  let interpretation = '';
  if (score <= 108) interpretation = 'Baixo risco (mortalidade hospitalar <1%) — Estratégia conservadora';
  else if (score <= 140) interpretation = 'Risco intermediário (mortalidade 1-3%) — Estratégia invasiva precoce';
  else interpretation = 'Alto risco (mortalidade >3%) — Estratégia invasiva urgente (<24h)';

  return {
    name: 'GRACE Score',
    score,
    interpretation,
    details: {
      min: 0, max: 372,
      reference: 'Fox KAA et al. BMJ. 2006;333(7578):1091. Granger CB et al. Arch Intern Med. 2003;163(19):2345-2353',
    }
  };
}

// ─── NIHSS — National Institutes of Health Stroke Scale ───
export function calculateNIHSS(
  consciousness: 0 | 1 | 2 | 3, questions: 0 | 1 | 2, commands: 0 | 1 | 2,
  gaze: 0 | 1 | 2, visual: 0 | 1 | 2 | 3, facialPalsy: 0 | 1 | 2 | 3,
  motorArmLeft: 0 | 1 | 2 | 3 | 4, motorArmRight: 0 | 1 | 2 | 3 | 4,
  motorLegLeft: 0 | 1 | 2 | 3 | 4, motorLegRight: 0 | 1 | 2 | 3 | 4,
  ataxia: 0 | 1 | 2, sensory: 0 | 1 | 2,
  language: 0 | 1 | 2 | 3, dysarthria: 0 | 1 | 2,
  extinction: 0 | 1 | 2
): CalculatorResult {
  const score = consciousness + questions + commands + gaze + visual + facialPalsy +
    motorArmLeft + motorArmRight + motorLegLeft + motorLegRight +
    ataxia + sensory + language + dysarthria + extinction;

  let interpretation = '';
  if (score === 0) interpretation = 'Sem déficit neurológico';
  else if (score <= 4) interpretation = 'AVC leve — Considerar trombólise se <4.5h';
  else if (score <= 15) interpretation = 'AVC moderado — Trombólise + considerar trombectomia se oclusão de grande vaso';
  else if (score <= 20) interpretation = 'AVC moderado-grave — Trombólise + trombectomia se elegível';
  else interpretation = 'AVC grave — Trombólise + trombectomia urgente se elegível';

  return {
    name: 'NIHSS',
    score,
    interpretation,
    details: {
      min: 0, max: 42,
      reference: 'Brott T et al. Stroke. 1989;20(7):864-870. Powers WJ et al. Stroke. 2019;50(12):e344-e418',
    }
  };
}
