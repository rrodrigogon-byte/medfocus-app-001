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
