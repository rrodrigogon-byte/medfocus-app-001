/**
 * Infermedica API Integration - Symptom Checker & Medical Triage
 * Provides AI-driven symptom assessment, diagnostic suggestions,
 * and patient triage capabilities.
 * 
 * API Documentation: https://developer.infermedica.com/documentation/engine-api/
 * Base URL: https://api.infermedica.com/v3
 * Auth: App-Id + App-Key headers
 * Free Tier: English model only, limited requests
 */

const INFERMEDICA_BASE = "https://api.infermedica.com/v3";
const INFERMEDICA_APP_ID = process.env.INFERMEDICA_APP_ID || "";
const INFERMEDICA_APP_KEY = process.env.INFERMEDICA_APP_KEY || "";

// ─── Interfaces ──────────────────────────────────────────────

export interface InfermedicaEvidence {
  id: string;
  choice_id: "present" | "absent" | "unknown";
  source?: "initial" | "suggest" | "predefined" | "red_flags";
}

export interface InfermedicaPatient {
  sex: "male" | "female";
  age: { value: number; unit?: "year" | "month" };
  evidence: InfermedicaEvidence[];
}

export interface InfermedicaCondition {
  id: string;
  name: string;
  common_name?: string;
  probability: number;
}

export interface InfermedicaDiagnosisResult {
  question?: {
    type: "single" | "group_single" | "group_multiple";
    text: string;
    items: {
      id: string;
      name: string;
      choices: { id: string; label: string }[];
    }[];
    extras?: Record<string, any>;
  };
  conditions: InfermedicaCondition[];
  extras?: Record<string, any>;
  has_emergency_evidence?: boolean;
  should_stop?: boolean;
}

export interface InfermedicaTriageResult {
  triage_level: "emergency" | "emergency_ambulance" | "consultation_24" | "consultation" | "self_care";
  serious: { id: string; name: string; common_name: string; is_emergency: boolean }[];
  root_cause: string;
  teleconsultation_applicable: boolean;
  description: string;
}

export interface InfermedicaSymptom {
  id: string;
  name: string;
  common_name: string;
  sex_filter: "both" | "male" | "female";
  category: string;
  extras?: Record<string, any>;
}

export interface InfermedicaConditionInfo {
  id: string;
  name: string;
  common_name: string;
  sex_filter: string;
  categories: string[];
  prevalence: string;
  acuteness: string;
  severity: string;
  extras: {
    icd10_code?: string;
    hint?: string;
  };
}

export interface InfermedicaParseResult {
  mentions: {
    id: string;
    name: string;
    common_name: string;
    orth: string;
    choice_id: "present" | "absent" | "unknown";
    type: "symptom" | "risk_factor";
  }[];
  obvious: boolean;
}

export interface InfermedicaExplainResult {
  supporting_evidence: { id: string; name: string; common_name: string }[];
  conflicting_evidence: { id: string; name: string; common_name: string }[];
  unconfirmed_evidence: { id: string; name: string; common_name: string }[];
}

export interface InfermedicaSuggestResult {
  id: string;
  name: string;
  common_name: string;
}

// ─── Helper: API Request ─────────────────────────────────────

async function infermedicaRequest<T>(
  method: "GET" | "POST",
  endpoint: string,
  body?: any,
  interviewId?: string,
  model?: string
): Promise<T | null> {
  if (!INFERMEDICA_APP_ID || !INFERMEDICA_APP_KEY) {
    console.warn("[Infermedica] API credentials not configured. Set INFERMEDICA_APP_ID and INFERMEDICA_APP_KEY.");
    return null;
  }

  try {
    const headers: Record<string, string> = {
      "App-Id": INFERMEDICA_APP_ID,
      "App-Key": INFERMEDICA_APP_KEY,
      "Content-Type": "application/json",
    };

    if (interviewId) {
      headers["Interview-Id"] = interviewId;
    }

    // Use Portuguese (Brazil) model if available, fallback to English
    if (model) {
      headers["Model"] = model;
    }

    const options: RequestInit = { method, headers };
    if (body && method === "POST") {
      options.body = JSON.stringify(body);
    }

    const url = `${INFERMEDICA_BASE}${endpoint}`;
    const res = await fetch(url, options);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[Infermedica] ${method} ${endpoint} failed (${res.status}):`, errorText);
      return null;
    }

    return await res.json() as T;
  } catch (err) {
    console.error(`[Infermedica] Request error (${endpoint}):`, err);
    return null;
  }
}

// ─── Generate Interview ID ───────────────────────────────────

export function generateInterviewId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : 
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
}

// ─── Diagnosis (Core Endpoint) ───────────────────────────────

export async function getDiagnosis(
  patient: InfermedicaPatient,
  interviewId: string,
  extras?: { disable_groups?: boolean; enable_triage_5?: boolean }
): Promise<InfermedicaDiagnosisResult | null> {
  const body: any = {
    sex: patient.sex,
    age: patient.age,
    evidence: patient.evidence,
  };

  if (extras) {
    body.extras = extras;
  }

  return infermedicaRequest<InfermedicaDiagnosisResult>("POST", "/diagnosis", body, interviewId);
}

// ─── Triage ──────────────────────────────────────────────────

export async function getTriage(
  patient: InfermedicaPatient,
  interviewId: string
): Promise<InfermedicaTriageResult | null> {
  const body = {
    sex: patient.sex,
    age: patient.age,
    evidence: patient.evidence,
  };

  return infermedicaRequest<InfermedicaTriageResult>("POST", "/triage", body, interviewId);
}

// ─── NLP Parse (Extract symptoms from text) ──────────────────

export async function parseSymptoms(
  text: string,
  patient: { sex: "male" | "female"; age: { value: number } },
  interviewId: string
): Promise<InfermedicaParseResult | null> {
  const body = {
    text,
    age: patient.age,
    sex: patient.sex,
    include_tokens: false,
    correct_spelling: true,
  };

  return infermedicaRequest<InfermedicaParseResult>("POST", "/parse", body, interviewId);
}

// ─── Explain (Why a condition was suggested) ─────────────────

export async function explainCondition(
  patient: InfermedicaPatient,
  conditionId: string,
  interviewId: string
): Promise<InfermedicaExplainResult | null> {
  const body = {
    sex: patient.sex,
    age: patient.age,
    evidence: patient.evidence,
    target: conditionId,
  };

  return infermedicaRequest<InfermedicaExplainResult>("POST", "/explain", body, interviewId);
}

// ─── Suggest Related Concepts ────────────────────────────────

export async function suggestSymptoms(
  patient: InfermedicaPatient,
  interviewId: string,
  maxResults = 8
): Promise<InfermedicaSuggestResult[] | null> {
  const body = {
    sex: patient.sex,
    age: patient.age,
    evidence: patient.evidence,
    suggest_method: "symptoms",
    max_results: maxResults,
  };

  return infermedicaRequest<InfermedicaSuggestResult[]>("POST", "/suggest", body, interviewId);
}

// ─── Search Symptoms ─────────────────────────────────────────

export async function searchSymptoms(
  phrase: string,
  sex?: "male" | "female",
  maxResults = 10
): Promise<InfermedicaSymptom[] | null> {
  let endpoint = `/search?phrase=${encodeURIComponent(phrase)}&max_results=${maxResults}&type=symptom`;
  if (sex) endpoint += `&sex=${sex}`;

  return infermedicaRequest<InfermedicaSymptom[]>("GET", endpoint);
}

// ─── Search Conditions ───────────────────────────────────────

export async function searchConditions(
  phrase: string,
  maxResults = 10
): Promise<InfermedicaSymptom[] | null> {
  const endpoint = `/search?phrase=${encodeURIComponent(phrase)}&max_results=${maxResults}&type=condition`;
  return infermedicaRequest<InfermedicaSymptom[]>("GET", endpoint);
}

// ─── Get All Symptoms ────────────────────────────────────────

export async function getAllSymptoms(): Promise<InfermedicaSymptom[] | null> {
  return infermedicaRequest<InfermedicaSymptom[]>("GET", "/symptoms");
}

// ─── Get All Conditions ──────────────────────────────────────

export async function getAllConditions(): Promise<InfermedicaConditionInfo[] | null> {
  return infermedicaRequest<InfermedicaConditionInfo[]>("GET", "/conditions");
}

// ─── Get Condition Details ───────────────────────────────────

export async function getConditionDetails(conditionId: string): Promise<InfermedicaConditionInfo | null> {
  return infermedicaRequest<InfermedicaConditionInfo>("GET", `/conditions/${conditionId}`);
}

// ─── Get Risk Factors ────────────────────────────────────────

export async function getRiskFactors(): Promise<InfermedicaSymptom[] | null> {
  return infermedicaRequest<InfermedicaSymptom[]>("GET", "/risk_factors");
}

// ─── API Info / Health Check ─────────────────────────────────

export async function getApiInfo(): Promise<{
  updated_at: string;
  conditions_count: number;
  symptoms_count: number;
  risk_factors_count: number;
  lab_tests_count: number;
} | null> {
  return infermedicaRequest("GET", "/info");
}

// ─── Check if API is configured ──────────────────────────────

export function isInfermedicaConfigured(): boolean {
  return !!(INFERMEDICA_APP_ID && INFERMEDICA_APP_KEY);
}

// ─── Triage Level Descriptions (PT-BR) ──────────────────────

export function getTriageLevelDescription(level: string): {
  label: string;
  description: string;
  color: string;
  urgency: number;
} {
  const levels: Record<string, { label: string; description: string; color: string; urgency: number }> = {
    emergency: {
      label: "Emergencia",
      description: "Procure atendimento de emergencia imediatamente. Ligue 192 (SAMU) ou va ao pronto-socorro mais proximo.",
      color: "#DC2626",
      urgency: 5,
    },
    emergency_ambulance: {
      label: "Emergencia - Ambulancia",
      description: "Ligue 192 (SAMU) imediatamente. Nao dirija, aguarde a ambulancia.",
      color: "#DC2626",
      urgency: 5,
    },
    consultation_24: {
      label: "Consulta em 24h",
      description: "Agende uma consulta medica nas proximas 24 horas. Se os sintomas piorarem, procure o pronto-socorro.",
      color: "#F59E0B",
      urgency: 3,
    },
    consultation: {
      label: "Consulta Medica",
      description: "Agende uma consulta medica nos proximos dias. Monitore os sintomas.",
      color: "#3B82F6",
      urgency: 2,
    },
    self_care: {
      label: "Autocuidado",
      description: "Os sintomas sugerem que voce pode cuidar em casa. Se os sintomas persistirem ou piorarem, consulte um medico.",
      color: "#10B981",
      urgency: 1,
    },
  };

  return levels[level] || levels.self_care;
}

// ─── Full Symptom Check Workflow Helper ──────────────────────

export async function startSymptomCheck(
  sex: "male" | "female",
  age: number,
  initialSymptomText: string
): Promise<{
  interviewId: string;
  parsedSymptoms: InfermedicaParseResult | null;
  initialDiagnosis: InfermedicaDiagnosisResult | null;
  patient: InfermedicaPatient;
} | null> {
  if (!isInfermedicaConfigured()) {
    return null;
  }

  const interviewId = generateInterviewId();
  const patient: InfermedicaPatient = {
    sex,
    age: { value: age },
    evidence: [],
  };

  // Step 1: Parse natural language symptoms
  const parsed = await parseSymptoms(initialSymptomText, { sex, age: { value: age } }, interviewId);

  if (parsed && parsed.mentions.length > 0) {
    // Add parsed symptoms as evidence
    patient.evidence = parsed.mentions.map(m => ({
      id: m.id,
      choice_id: m.choice_id,
      source: "initial" as const,
    }));
  }

  // Step 2: Get initial diagnosis
  const diagnosis = await getDiagnosis(patient, interviewId);

  return {
    interviewId,
    parsedSymptoms: parsed,
    initialDiagnosis: diagnosis,
    patient,
  };
}

// ─── Continue Interview ──────────────────────────────────────

export async function continueInterview(
  patient: InfermedicaPatient,
  interviewId: string,
  answeredEvidence: InfermedicaEvidence[]
): Promise<{
  diagnosis: InfermedicaDiagnosisResult | null;
  triage: InfermedicaTriageResult | null;
  isComplete: boolean;
}> {
  // Add new evidence
  patient.evidence = [...patient.evidence, ...answeredEvidence];

  // Get updated diagnosis
  const diagnosis = await getDiagnosis(patient, interviewId);

  // Check if we should stop
  const isComplete = diagnosis?.should_stop || false;

  // If complete or enough evidence, get triage
  let triage: InfermedicaTriageResult | null = null;
  if (isComplete || patient.evidence.length >= 5) {
    triage = await getTriage(patient, interviewId);
  }

  return { diagnosis, triage, isComplete };
}
