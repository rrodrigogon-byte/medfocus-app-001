/**
 * Metriport API Integration - Patient Data Consolidation & Wearables
 * Open-source solution that consolidates patient data from multiple sources
 * into a single FHIR API. Connects wearables, EHRs, and health records.
 * 
 * Documentation: https://docs.metriport.com/
 * Features:
 * - Medical API: Consolidated patient records (FHIR R4)
 * - Devices API: Wearable data (Fitbit, Garmin, Apple Health, etc.)
 * - Clinical documents: C-CDA, FHIR bundles
 * 
 * Self-hosted or Cloud (Metriport Cloud)
 */

const METRIPORT_BASE_URL = process.env.METRIPORT_BASE_URL || "https://api.metriport.com";
const METRIPORT_API_KEY = process.env.METRIPORT_API_KEY || "";
const METRIPORT_FACILITY_ID = process.env.METRIPORT_FACILITY_ID || "";

// ─── Interfaces ──────────────────────────────────────────────

export interface MetriportPatient {
  id?: string;
  externalId?: string;
  firstName: string;
  lastName: string;
  dob: string; // YYYY-MM-DD
  genderAtBirth: "M" | "F";
  personalIdentifiers?: {
    type: "driversLicense" | "ssn" | "stateId";
    value: string;
    state?: string;
  }[];
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }[];
  contact?: {
    phone?: string;
    email?: string;
  }[];
}

export interface MetriportDocumentReference {
  id: string;
  fileName: string;
  description?: string;
  status: string;
  indexed: string;
  mimeType: string;
  size: number;
  type?: {
    coding: { system: string; code: string; display: string }[];
    text: string;
  };
  content: {
    attachment: {
      title: string;
      url?: string;
      contentType: string;
    };
  }[];
}

export interface MetriportConsolidatedData {
  bundle: {
    resourceType: "Bundle";
    type: "searchset";
    total: number;
    entry: {
      resource: any;
    }[];
  };
  filters?: {
    resources?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export interface MetriportDeviceData {
  activity?: MetriportActivity[];
  body?: MetriportBodyMetrics[];
  biometrics?: MetriportBiometrics[];
  nutrition?: MetriportNutrition[];
  sleep?: MetriportSleep[];
  user?: MetriportUserInfo;
}

export interface MetriportActivity {
  metadata: { date: string; source: string };
  summary?: {
    durations?: { active_seconds?: number; intensity?: { rest_seconds?: number; low_seconds?: number; med_seconds?: number; high_seconds?: number } };
    energy_expenditure?: { active_kcal?: number; basal_kcal?: number; total_kcal?: number };
    movement?: { steps_count?: number; floors_count?: number; distance_meters?: number; elevation_gain_meters?: number };
  };
}

export interface MetriportBodyMetrics {
  metadata: { date: string; source: string };
  weight_kg?: number;
  height_cm?: number;
  body_fat_pct?: number;
  body_mass_index?: number;
  lean_mass_kg?: number;
  bone_mass_kg?: number;
  muscle_mass_kg?: number;
  water_pct?: number;
  waist_circumference_cm?: number;
  hip_circumference_cm?: number;
}

export interface MetriportBiometrics {
  metadata: { date: string; source: string };
  heart_rate?: {
    min_bpm?: number;
    max_bpm?: number;
    avg_bpm?: number;
    resting_bpm?: number;
  };
  hrv?: { rmssd?: { avg_millis?: number }; sdnn?: { avg_millis?: number } };
  respiration?: { breaths_per_minute?: { avg?: number; min?: number; max?: number } };
  temperature?: { core?: { avg_celcius?: number }; skin?: { avg_celcius?: number }; ambient?: { avg_celcius?: number } };
  blood_glucose?: { avg_mg_dL?: number; samples_mg_dL?: { value: number; time: string }[] };
  blood_pressure?: {
    diastolic_mm_Hg?: { avg?: number; samples?: { value: number; time: string }[] };
    systolic_mm_Hg?: { avg?: number; samples?: { value: number; time: string }[] };
  };
  blood_oxygen?: { avg_pct?: number; samples_pct?: { value: number; time: string }[] };
}

export interface MetriportNutrition {
  metadata: { date: string; source: string };
  summary?: {
    macros?: { calories?: number; carbs_g?: number; fat_g?: number; protein_g?: number; fiber_g?: number; sugar_g?: number };
    micros?: { sodium_mg?: number; cholesterol_mg?: number; calcium_mg?: number; iron_mg?: number; potassium_mg?: number };
    water_ml?: number;
  };
  foods?: { name: string; amount?: number; unit?: string; calories?: number }[];
}

export interface MetriportSleep {
  metadata: { date: string; source: string };
  start_time?: string;
  end_time?: string;
  durations?: {
    total_seconds?: number;
    awake_seconds?: number;
    light_seconds?: number;
    deep_seconds?: number;
    rem_seconds?: number;
    in_bed_seconds?: number;
  };
  biometrics?: {
    heart_rate?: { avg_bpm?: number; min_bpm?: number; max_bpm?: number };
    hrv?: { rmssd?: { avg_millis?: number } };
    respiration?: { avg_breaths_per_minute?: number };
    temperature_delta_celcius?: number;
  };
}

export interface MetriportUserInfo {
  userId: string;
  connectedProviders: string[];
  dateCreated: string;
}

export interface MetriportConnectToken {
  token: string;
  url: string;
}

// ─── Helper: API Request ─────────────────────────────────────

async function metriportRequest<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  body?: any,
  queryParams?: Record<string, string>
): Promise<T | null> {
  if (!METRIPORT_API_KEY) {
    console.warn("[Metriport] API key not configured. Set METRIPORT_API_KEY.");
    return null;
  }

  try {
    let url = `${METRIPORT_BASE_URL}${endpoint}`;
    if (queryParams) {
      const params = new URLSearchParams(queryParams);
      url += `?${params.toString()}`;
    }

    const headers: Record<string, string> = {
      "x-api-key": METRIPORT_API_KEY,
      "Content-Type": "application/json",
    };

    const options: RequestInit = { method, headers };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(url, options);
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[Metriport] ${method} ${endpoint} failed (${res.status}):`, errorText);
      return null;
    }

    if (res.status === 204) return null;
    return await res.json() as T;
  } catch (err) {
    console.error(`[Metriport] Request error (${endpoint}):`, err);
    return null;
  }
}

// ─── Check if Metriport is configured ────────────────────────

export function isMetriportConfigured(): boolean {
  return !!(METRIPORT_API_KEY && METRIPORT_FACILITY_ID);
}

// ═══════════════════════════════════════════════════════════════
// MEDICAL API - Patient Records & Clinical Data
// ═══════════════════════════════════════════════════════════════

// ─── Patient Management ──────────────────────────────────────

export async function createMetriportPatient(
  patient: MetriportPatient
): Promise<MetriportPatient | null> {
  return metriportRequest<MetriportPatient>(
    "POST",
    `/medical/v1/patient`,
    patient,
    { facilityId: METRIPORT_FACILITY_ID }
  );
}

export async function getMetriportPatient(patientId: string): Promise<MetriportPatient | null> {
  return metriportRequest<MetriportPatient>(
    "GET",
    `/medical/v1/patient/${patientId}`,
    undefined,
    { facilityId: METRIPORT_FACILITY_ID }
  );
}

export async function updateMetriportPatient(
  patientId: string,
  patient: Partial<MetriportPatient>
): Promise<MetriportPatient | null> {
  return metriportRequest<MetriportPatient>(
    "PUT",
    `/medical/v1/patient/${patientId}`,
    patient,
    { facilityId: METRIPORT_FACILITY_ID }
  );
}

export async function deleteMetriportPatient(patientId: string): Promise<boolean> {
  await metriportRequest("DELETE", `/medical/v1/patient/${patientId}`, undefined, {
    facilityId: METRIPORT_FACILITY_ID,
  });
  return true;
}

export async function listMetriportPatients(): Promise<MetriportPatient[] | null> {
  return metriportRequest<MetriportPatient[]>(
    "GET",
    `/medical/v1/patient`,
    undefined,
    { facilityId: METRIPORT_FACILITY_ID }
  );
}

// ─── Patient Match (Find across HIEs) ────────────────────────

export async function matchPatient(patientId: string): Promise<boolean> {
  const result = await metriportRequest(
    "POST",
    `/medical/v1/patient/${patientId}/match`,
    undefined,
    { facilityId: METRIPORT_FACILITY_ID }
  );
  return result !== null;
}

// ─── Document Query ──────────────────────────────────────────

export async function queryDocuments(patientId: string): Promise<{
  requestId: string;
} | null> {
  return metriportRequest(
    "POST",
    `/medical/v1/document/query`,
    undefined,
    { patientId, facilityId: METRIPORT_FACILITY_ID }
  );
}

export async function listDocuments(patientId: string): Promise<MetriportDocumentReference[] | null> {
  return metriportRequest<MetriportDocumentReference[]>(
    "GET",
    `/medical/v1/document`,
    undefined,
    { patientId, facilityId: METRIPORT_FACILITY_ID }
  );
}

export async function getDocumentUrl(
  patientId: string,
  fileName: string,
  conversionType?: "html" | "pdf"
): Promise<{ url: string } | null> {
  const params: Record<string, string> = {
    patientId,
    facilityId: METRIPORT_FACILITY_ID,
    fileName,
  };
  if (conversionType) params.conversionType = conversionType;

  return metriportRequest<{ url: string }>("GET", `/medical/v1/document/download-url`, undefined, params);
}

// ─── Consolidated Data (FHIR) ────────────────────────────────

export async function startConsolidatedQuery(
  patientId: string,
  resources?: string[],
  dateFrom?: string,
  dateTo?: string
): Promise<{ requestId: string } | null> {
  const params: Record<string, string> = {
    patientId,
    facilityId: METRIPORT_FACILITY_ID,
  };
  if (resources) params.resources = resources.join(",");
  if (dateFrom) params.dateFrom = dateFrom;
  if (dateTo) params.dateTo = dateTo;

  return metriportRequest("POST", `/medical/v1/patient/${patientId}/consolidated/query`, undefined, params);
}

export async function getConsolidatedData(
  patientId: string,
  resources?: string[],
  dateFrom?: string,
  dateTo?: string
): Promise<MetriportConsolidatedData | null> {
  const params: Record<string, string> = {
    patientId,
    facilityId: METRIPORT_FACILITY_ID,
  };
  if (resources) params.resources = resources.join(",");
  if (dateFrom) params.dateFrom = dateFrom;
  if (dateTo) params.dateTo = dateTo;

  return metriportRequest<MetriportConsolidatedData>(
    "GET",
    `/medical/v1/patient/${patientId}/consolidated`,
    undefined,
    params
  );
}

export async function getPatientCount(patientId: string): Promise<{
  total: number;
  resources: Record<string, number>;
} | null> {
  return metriportRequest(
    "GET",
    `/medical/v1/patient/${patientId}/consolidated/count`,
    undefined,
    { patientId, facilityId: METRIPORT_FACILITY_ID }
  );
}

// ═══════════════════════════════════════════════════════════════
// DEVICES API - Wearable Data
// ═══════════════════════════════════════════════════════════════

// ─── Connect Token (for widget) ──────────────────────────────

export async function getConnectToken(userId: string): Promise<MetriportConnectToken | null> {
  return metriportRequest<MetriportConnectToken>(
    "GET",
    `/devices/v1/connect/token`,
    undefined,
    { userId }
  );
}

// ─── Activity Data ───────────────────────────────────────────

export async function getActivityData(
  userId: string,
  date: string
): Promise<MetriportActivity[] | null> {
  return metriportRequest<MetriportActivity[]>(
    "GET",
    `/devices/v1/activity`,
    undefined,
    { userId, date }
  );
}

// ─── Body Metrics ────────────────────────────────────────────

export async function getBodyData(
  userId: string,
  date: string
): Promise<MetriportBodyMetrics[] | null> {
  return metriportRequest<MetriportBodyMetrics[]>(
    "GET",
    `/devices/v1/body`,
    undefined,
    { userId, date }
  );
}

// ─── Biometrics ──────────────────────────────────────────────

export async function getBiometricsData(
  userId: string,
  date: string
): Promise<MetriportBiometrics[] | null> {
  return metriportRequest<MetriportBiometrics[]>(
    "GET",
    `/devices/v1/biometrics`,
    undefined,
    { userId, date }
  );
}

// ─── Nutrition ───────────────────────────────────────────────

export async function getNutritionData(
  userId: string,
  date: string
): Promise<MetriportNutrition[] | null> {
  return metriportRequest<MetriportNutrition[]>(
    "GET",
    `/devices/v1/nutrition`,
    undefined,
    { userId, date }
  );
}

// ─── Sleep ───────────────────────────────────────────────────

export async function getSleepData(
  userId: string,
  date: string
): Promise<MetriportSleep[] | null> {
  return metriportRequest<MetriportSleep[]>(
    "GET",
    `/devices/v1/sleep`,
    undefined,
    { userId, date }
  );
}

// ─── User Info ───────────────────────────────────────────────

export async function getUserConnectedProviders(userId: string): Promise<MetriportUserInfo | null> {
  return metriportRequest<MetriportUserInfo>(
    "GET",
    `/devices/v1/user`,
    undefined,
    { userId }
  );
}

// ─── Revoke Provider Access ──────────────────────────────────

export async function revokeProviderAccess(
  userId: string,
  provider: string
): Promise<boolean> {
  await metriportRequest(
    "DELETE",
    `/devices/v1/user/${userId}/revoke`,
    undefined,
    { provider }
  );
  return true;
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

// ─── Supported Wearable Providers ────────────────────────────

export function getSupportedWearableProviders(): {
  id: string;
  name: string;
  category: string;
  icon: string;
}[] {
  return [
    { id: "fitbit", name: "Fitbit", category: "Fitness Tracker", icon: "fitbit" },
    { id: "garmin", name: "Garmin", category: "Fitness/GPS Watch", icon: "garmin" },
    { id: "withings", name: "Withings", category: "Health Devices", icon: "withings" },
    { id: "whoop", name: "WHOOP", category: "Performance Tracker", icon: "whoop" },
    { id: "oura", name: "Oura Ring", category: "Sleep/Recovery Tracker", icon: "oura" },
    { id: "cronometer", name: "Cronometer", category: "Nutrition Tracker", icon: "cronometer" },
    { id: "apple", name: "Apple Health", category: "Health Platform", icon: "apple" },
    { id: "google", name: "Google Fit", category: "Health Platform", icon: "google" },
    { id: "dexcom", name: "Dexcom", category: "Glucose Monitor", icon: "dexcom" },
    { id: "tenovi", name: "Tenovi", category: "Remote Patient Monitoring", icon: "tenovi" },
  ];
}

// ─── Format Wearable Data for Display ────────────────────────

export function formatWearableSummary(data: MetriportDeviceData): {
  steps: number;
  calories: number;
  heartRate: { avg: number; min: number; max: number; resting: number };
  sleep: { totalHours: number; deepHours: number; remHours: number; quality: string };
  bloodOxygen: number;
  temperature: number;
  weight: number;
  connectedDevices: string[];
} {
  const activity = data.activity?.[0]?.summary;
  const bio = data.biometrics?.[0];
  const sleep = data.sleep?.[0];
  const body = data.body?.[0];

  const sleepTotal = (sleep?.durations?.total_seconds || 0) / 3600;
  const sleepDeep = (sleep?.durations?.deep_seconds || 0) / 3600;
  const sleepRem = (sleep?.durations?.rem_seconds || 0) / 3600;

  let sleepQuality = "Sem dados";
  if (sleepTotal > 0) {
    if (sleepTotal >= 7 && sleepDeep >= 1.5 && sleepRem >= 1.5) sleepQuality = "Excelente";
    else if (sleepTotal >= 6 && sleepDeep >= 1) sleepQuality = "Bom";
    else if (sleepTotal >= 5) sleepQuality = "Regular";
    else sleepQuality = "Insuficiente";
  }

  return {
    steps: activity?.movement?.steps_count || 0,
    calories: activity?.energy_expenditure?.total_kcal || 0,
    heartRate: {
      avg: bio?.heart_rate?.avg_bpm || 0,
      min: bio?.heart_rate?.min_bpm || 0,
      max: bio?.heart_rate?.max_bpm || 0,
      resting: bio?.heart_rate?.resting_bpm || 0,
    },
    sleep: {
      totalHours: Math.round(sleepTotal * 10) / 10,
      deepHours: Math.round(sleepDeep * 10) / 10,
      remHours: Math.round(sleepRem * 10) / 10,
      quality: sleepQuality,
    },
    bloodOxygen: bio?.blood_oxygen?.avg_pct || 0,
    temperature: bio?.temperature?.core?.avg_celcius || 0,
    weight: body?.weight_kg || 0,
    connectedDevices: data.user?.connectedProviders || [],
  };
}

// ─── Health Score Calculator ─────────────────────────────────

export function calculateHealthScore(data: MetriportDeviceData): {
  score: number;
  maxScore: number;
  category: string;
  breakdown: { metric: string; score: number; maxScore: number; status: string }[];
} {
  const summary = formatWearableSummary(data);
  const breakdown: { metric: string; score: number; maxScore: number; status: string }[] = [];
  let totalScore = 0;
  const maxScore = 100;

  // Steps (0-20 points)
  let stepsScore = 0;
  if (summary.steps >= 10000) stepsScore = 20;
  else if (summary.steps >= 7500) stepsScore = 15;
  else if (summary.steps >= 5000) stepsScore = 10;
  else if (summary.steps >= 2500) stepsScore = 5;
  totalScore += stepsScore;
  breakdown.push({
    metric: "Passos Diarios",
    score: stepsScore,
    maxScore: 20,
    status: summary.steps >= 10000 ? "Excelente" : summary.steps >= 7500 ? "Bom" : summary.steps >= 5000 ? "Regular" : "Insuficiente",
  });

  // Sleep (0-25 points)
  let sleepScore = 0;
  if (summary.sleep.totalHours >= 7 && summary.sleep.totalHours <= 9) sleepScore = 25;
  else if (summary.sleep.totalHours >= 6) sleepScore = 15;
  else if (summary.sleep.totalHours >= 5) sleepScore = 8;
  totalScore += sleepScore;
  breakdown.push({
    metric: "Qualidade do Sono",
    score: sleepScore,
    maxScore: 25,
    status: summary.sleep.quality,
  });

  // Resting Heart Rate (0-20 points)
  let hrScore = 0;
  const rhr = summary.heartRate.resting;
  if (rhr > 0) {
    if (rhr < 60) hrScore = 20;
    else if (rhr < 70) hrScore = 15;
    else if (rhr < 80) hrScore = 10;
    else hrScore = 5;
  }
  totalScore += hrScore;
  breakdown.push({
    metric: "Frequencia Cardiaca em Repouso",
    score: hrScore,
    maxScore: 20,
    status: rhr > 0 ? (rhr < 60 ? "Atletico" : rhr < 70 ? "Bom" : rhr < 80 ? "Normal" : "Elevado") : "Sem dados",
  });

  // Blood Oxygen (0-15 points)
  let spo2Score = 0;
  if (summary.bloodOxygen > 0) {
    if (summary.bloodOxygen >= 97) spo2Score = 15;
    else if (summary.bloodOxygen >= 95) spo2Score = 10;
    else if (summary.bloodOxygen >= 92) spo2Score = 5;
  }
  totalScore += spo2Score;
  breakdown.push({
    metric: "Saturacao de Oxigenio",
    score: spo2Score,
    maxScore: 15,
    status: summary.bloodOxygen > 0 ? (summary.bloodOxygen >= 97 ? "Normal" : summary.bloodOxygen >= 95 ? "Aceitavel" : "Baixo") : "Sem dados",
  });

  // Calories (0-20 points)
  let calScore = 0;
  if (summary.calories >= 2000) calScore = 20;
  else if (summary.calories >= 1500) calScore = 15;
  else if (summary.calories >= 1000) calScore = 10;
  else if (summary.calories > 0) calScore = 5;
  totalScore += calScore;
  breakdown.push({
    metric: "Gasto Calorico",
    score: calScore,
    maxScore: 20,
    status: summary.calories >= 2000 ? "Ativo" : summary.calories >= 1500 ? "Moderado" : summary.calories > 0 ? "Sedentario" : "Sem dados",
  });

  let category = "Sem dados suficientes";
  if (totalScore >= 80) category = "Excelente";
  else if (totalScore >= 60) category = "Bom";
  else if (totalScore >= 40) category = "Regular";
  else if (totalScore > 0) category = "Precisa melhorar";

  return { score: totalScore, maxScore, category, breakdown };
}
