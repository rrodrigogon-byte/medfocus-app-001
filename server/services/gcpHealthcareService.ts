/**
 * Google Cloud Healthcare API Integration
 * Provides FHIR R4, HL7v2, and DICOM support for the MedFocus SaaS platform.
 * 
 * Features:
 * - FHIR R4 Patient records management
 * - Clinical observations and conditions
 * - Medication management
 * - DICOM medical imaging support
 * - HL7v2 message processing
 * 
 * Documentation: https://cloud.google.com/healthcare-api/docs
 * Free tier: 1GB structured data + 1GB blob storage
 * 
 * Exclusively on Google Cloud Platform (GCP)
 */

const GCP_PROJECT = process.env.GOOGLE_CLOUD_PROJECT || "viralgram-4-0-rodrigo";
const GCP_LOCATION = process.env.GCP_HEALTHCARE_LOCATION || "southamerica-east1";
const GCP_DATASET = process.env.GCP_HEALTHCARE_DATASET || "medfocus-health-data";
const FHIR_STORE = process.env.GCP_FHIR_STORE || "medfocus-fhir-store";
const DICOM_STORE = process.env.GCP_DICOM_STORE || "medfocus-dicom-store";
const HL7V2_STORE = process.env.GCP_HL7V2_STORE || "medfocus-hl7v2-store";

const HEALTHCARE_BASE = `https://healthcare.googleapis.com/v1/projects/${GCP_PROJECT}/locations/${GCP_LOCATION}/datasets/${GCP_DATASET}`;

// ─── Interfaces ──────────────────────────────────────────────

export interface FHIRPatient {
  resourceType: "Patient";
  id?: string;
  meta?: { versionId: string; lastUpdated: string };
  identifier?: { system: string; value: string }[];
  active?: boolean;
  name: { use?: string; family: string; given: string[] }[];
  telecom?: { system: string; value: string; use?: string }[];
  gender: "male" | "female" | "other" | "unknown";
  birthDate: string;
  address?: {
    use?: string;
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }[];
}

export interface FHIRObservation {
  resourceType: "Observation";
  id?: string;
  status: "registered" | "preliminary" | "final" | "amended" | "corrected" | "cancelled";
  category?: { coding: { system: string; code: string; display: string }[] }[];
  code: { coding: { system: string; code: string; display: string }[]; text?: string };
  subject: { reference: string };
  effectiveDateTime?: string;
  valueQuantity?: { value: number; unit: string; system?: string; code?: string };
  valueString?: string;
  valueCodeableConcept?: { coding: { system: string; code: string; display: string }[] };
  interpretation?: { coding: { system: string; code: string; display: string }[] }[];
  note?: { text: string }[];
}

export interface FHIRCondition {
  resourceType: "Condition";
  id?: string;
  clinicalStatus: { coding: { system: string; code: string }[] };
  verificationStatus?: { coding: { system: string; code: string }[] };
  category?: { coding: { system: string; code: string; display: string }[] }[];
  severity?: { coding: { system: string; code: string; display: string }[] };
  code: { coding: { system: string; code: string; display: string }[]; text?: string };
  subject: { reference: string };
  onsetDateTime?: string;
  recordedDate?: string;
  note?: { text: string }[];
}

export interface FHIRMedicationRequest {
  resourceType: "MedicationRequest";
  id?: string;
  status: "active" | "on-hold" | "cancelled" | "completed" | "stopped" | "draft";
  intent: "proposal" | "plan" | "order" | "original-order" | "reflex-order" | "filler-order" | "instance-order" | "option";
  medicationCodeableConcept: { coding: { system: string; code: string; display: string }[]; text?: string };
  subject: { reference: string };
  authoredOn?: string;
  dosageInstruction?: {
    text?: string;
    timing?: { repeat?: { frequency?: number; period?: number; periodUnit?: string } };
    route?: { coding: { system: string; code: string; display: string }[] };
    doseAndRate?: { doseQuantity?: { value: number; unit: string } }[];
  }[];
  note?: { text: string }[];
}

export interface FHIRBundle {
  resourceType: "Bundle";
  type: "searchset" | "batch" | "transaction" | "collection";
  total?: number;
  entry?: { resource: any; fullUrl?: string; search?: { mode: string } }[];
  link?: { relation: string; url: string }[];
}

export interface FHIREncounter {
  resourceType: "Encounter";
  id?: string;
  status: "planned" | "arrived" | "triaged" | "in-progress" | "onleave" | "finished" | "cancelled";
  class: { system: string; code: string; display: string };
  type?: { coding: { system: string; code: string; display: string }[] }[];
  subject: { reference: string };
  period?: { start: string; end?: string };
  reasonCode?: { coding: { system: string; code: string; display: string }[]; text?: string }[];
}

// ─── Auth Helper ─────────────────────────────────────────────

async function getAccessToken(): Promise<string | null> {
  try {
    // Use GCP metadata server for Cloud Run or service account
    const metadataUrl = "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token";
    const res = await fetch(metadataUrl, {
      headers: { "Metadata-Flavor": "Google" },
    });
    if (res.ok) {
      const data = await res.json();
      return data.access_token;
    }

    // Fallback: use GOOGLE_APPLICATION_CREDENTIALS or gcloud
    if (process.env.GOOGLE_ACCESS_TOKEN) {
      return process.env.GOOGLE_ACCESS_TOKEN;
    }

    console.warn("[GCP Healthcare] Could not obtain access token. Running outside GCP?");
    return null;
  } catch (err) {
    console.error("[GCP Healthcare] Auth error:", err);
    return null;
  }
}

async function healthcareRequest<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: any,
  contentType = "application/fhir+json"
): Promise<T | null> {
  const token = await getAccessToken();
  if (!token) {
    console.error("[GCP Healthcare] No access token available");
    return null;
  }

  try {
    const url = `${HEALTHCARE_BASE}${path}`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      "Content-Type": contentType,
    };

    const options: RequestInit = { method, headers };
    if (body) {
      options.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    const res = await fetch(url, options);
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[GCP Healthcare] ${method} ${path} failed (${res.status}):`, errorText);
      return null;
    }

    if (res.status === 204) return null;
    return await res.json() as T;
  } catch (err) {
    console.error(`[GCP Healthcare] Request error (${path}):`, err);
    return null;
  }
}

// ─── Check if Healthcare API is available ────────────────────

export async function isHealthcareApiAvailable(): Promise<boolean> {
  const token = await getAccessToken();
  return !!token;
}

// ─── FHIR Patient Operations ─────────────────────────────────

export async function createPatient(patient: FHIRPatient): Promise<FHIRPatient | null> {
  return healthcareRequest<FHIRPatient>("POST", `/fhirStores/${FHIR_STORE}/fhir/Patient`, patient);
}

export async function getPatient(patientId: string): Promise<FHIRPatient | null> {
  return healthcareRequest<FHIRPatient>("GET", `/fhirStores/${FHIR_STORE}/fhir/Patient/${patientId}`);
}

export async function updatePatient(patientId: string, patient: FHIRPatient): Promise<FHIRPatient | null> {
  return healthcareRequest<FHIRPatient>("PUT", `/fhirStores/${FHIR_STORE}/fhir/Patient/${patientId}`, patient);
}

export async function searchPatients(params: {
  name?: string;
  identifier?: string;
  birthdate?: string;
  gender?: string;
  _count?: number;
}): Promise<FHIRBundle | null> {
  const queryParams = new URLSearchParams();
  if (params.name) queryParams.set("name", params.name);
  if (params.identifier) queryParams.set("identifier", params.identifier);
  if (params.birthdate) queryParams.set("birthdate", params.birthdate);
  if (params.gender) queryParams.set("gender", params.gender);
  queryParams.set("_count", String(params._count || 20));

  return healthcareRequest<FHIRBundle>("GET", `/fhirStores/${FHIR_STORE}/fhir/Patient?${queryParams.toString()}`);
}

export async function deletePatient(patientId: string): Promise<boolean> {
  const result = await healthcareRequest("DELETE", `/fhirStores/${FHIR_STORE}/fhir/Patient/${patientId}`);
  return result !== null || true; // DELETE returns 204
}

// ─── FHIR Observation Operations ─────────────────────────────

export async function createObservation(observation: FHIRObservation): Promise<FHIRObservation | null> {
  return healthcareRequest<FHIRObservation>("POST", `/fhirStores/${FHIR_STORE}/fhir/Observation`, observation);
}

export async function getPatientObservations(
  patientId: string,
  category?: string,
  code?: string,
  count = 50
): Promise<FHIRBundle | null> {
  const queryParams = new URLSearchParams();
  queryParams.set("patient", `Patient/${patientId}`);
  if (category) queryParams.set("category", category);
  if (code) queryParams.set("code", code);
  queryParams.set("_count", String(count));
  queryParams.set("_sort", "-date");

  return healthcareRequest<FHIRBundle>("GET", `/fhirStores/${FHIR_STORE}/fhir/Observation?${queryParams.toString()}`);
}

// ─── FHIR Condition Operations ───────────────────────────────

export async function createCondition(condition: FHIRCondition): Promise<FHIRCondition | null> {
  return healthcareRequest<FHIRCondition>("POST", `/fhirStores/${FHIR_STORE}/fhir/Condition`, condition);
}

export async function getPatientConditions(
  patientId: string,
  clinicalStatus?: string,
  count = 50
): Promise<FHIRBundle | null> {
  const queryParams = new URLSearchParams();
  queryParams.set("patient", `Patient/${patientId}`);
  if (clinicalStatus) queryParams.set("clinical-status", clinicalStatus);
  queryParams.set("_count", String(count));
  queryParams.set("_sort", "-recorded-date");

  return healthcareRequest<FHIRBundle>("GET", `/fhirStores/${FHIR_STORE}/fhir/Condition?${queryParams.toString()}`);
}

// ─── FHIR Medication Request Operations ──────────────────────

export async function createMedicationRequest(medReq: FHIRMedicationRequest): Promise<FHIRMedicationRequest | null> {
  return healthcareRequest<FHIRMedicationRequest>("POST", `/fhirStores/${FHIR_STORE}/fhir/MedicationRequest`, medReq);
}

export async function getPatientMedications(
  patientId: string,
  status?: string,
  count = 50
): Promise<FHIRBundle | null> {
  const queryParams = new URLSearchParams();
  queryParams.set("patient", `Patient/${patientId}`);
  if (status) queryParams.set("status", status);
  queryParams.set("_count", String(count));

  return healthcareRequest<FHIRBundle>("GET", `/fhirStores/${FHIR_STORE}/fhir/MedicationRequest?${queryParams.toString()}`);
}

// ─── FHIR Encounter Operations ───────────────────────────────

export async function createEncounter(encounter: FHIREncounter): Promise<FHIREncounter | null> {
  return healthcareRequest<FHIREncounter>("POST", `/fhirStores/${FHIR_STORE}/fhir/Encounter`, encounter);
}

export async function getPatientEncounters(
  patientId: string,
  count = 20
): Promise<FHIRBundle | null> {
  const queryParams = new URLSearchParams();
  queryParams.set("patient", `Patient/${patientId}`);
  queryParams.set("_count", String(count));
  queryParams.set("_sort", "-date");

  return healthcareRequest<FHIRBundle>("GET", `/fhirStores/${FHIR_STORE}/fhir/Encounter?${queryParams.toString()}`);
}

// ─── Patient Summary (Everything operation) ──────────────────

export async function getPatientEverything(patientId: string): Promise<FHIRBundle | null> {
  return healthcareRequest<FHIRBundle>("GET", `/fhirStores/${FHIR_STORE}/fhir/Patient/${patientId}/$everything`);
}

// ─── FHIR Bundle Transaction ─────────────────────────────────

export async function executeBundleTransaction(bundle: FHIRBundle): Promise<FHIRBundle | null> {
  return healthcareRequest<FHIRBundle>("POST", `/fhirStores/${FHIR_STORE}/fhir`, bundle);
}

// ─── DICOM Operations ────────────────────────────────────────

export async function searchDicomStudies(params: {
  patientName?: string;
  patientId?: string;
  studyDate?: string;
  modality?: string;
}): Promise<any[] | null> {
  const queryParams = new URLSearchParams();
  if (params.patientName) queryParams.set("PatientName", params.patientName);
  if (params.patientId) queryParams.set("PatientID", params.patientId);
  if (params.studyDate) queryParams.set("StudyDate", params.studyDate);
  if (params.modality) queryParams.set("ModalitiesInStudy", params.modality);

  return healthcareRequest<any[]>(
    "GET",
    `/dicomStores/${DICOM_STORE}/dicomWeb/studies?${queryParams.toString()}`,
    undefined,
    "application/dicom+json"
  );
}

export async function getDicomStudy(studyUid: string): Promise<any | null> {
  return healthcareRequest(
    "GET",
    `/dicomStores/${DICOM_STORE}/dicomWeb/studies/${studyUid}`,
    undefined,
    "application/dicom+json"
  );
}

export async function getDicomStudySeries(studyUid: string): Promise<any[] | null> {
  return healthcareRequest<any[]>(
    "GET",
    `/dicomStores/${DICOM_STORE}/dicomWeb/studies/${studyUid}/series`,
    undefined,
    "application/dicom+json"
  );
}

// ─── HL7v2 Operations ────────────────────────────────────────

export async function sendHL7v2Message(messageData: string): Promise<any | null> {
  const body = {
    message: {
      data: Buffer.from(messageData).toString("base64"),
    },
  };

  return healthcareRequest("POST", `/hl7V2Stores/${HL7V2_STORE}/messages:ingest`, body, "application/json");
}

export async function getHL7v2Messages(filter?: string, count = 20): Promise<any | null> {
  const queryParams = new URLSearchParams();
  if (filter) queryParams.set("filter", filter);
  queryParams.set("pageSize", String(count));

  return healthcareRequest("GET", `/hl7V2Stores/${HL7V2_STORE}/messages?${queryParams.toString()}`);
}

// ─── Helper: Create FHIR Resources ──────────────────────────

export function buildFHIRPatient(data: {
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other";
  birthDate: string;
  email?: string;
  phone?: string;
  cpf?: string;
}): FHIRPatient {
  const patient: FHIRPatient = {
    resourceType: "Patient",
    active: true,
    name: [{ use: "official", family: data.lastName, given: [data.firstName] }],
    gender: data.gender,
    birthDate: data.birthDate,
  };

  if (data.cpf) {
    patient.identifier = [{ system: "urn:oid:2.16.840.1.113883.13.237", value: data.cpf }];
  }

  const telecom: { system: string; value: string; use: string }[] = [];
  if (data.email) telecom.push({ system: "email", value: data.email, use: "home" });
  if (data.phone) telecom.push({ system: "phone", value: data.phone, use: "mobile" });
  if (telecom.length > 0) patient.telecom = telecom;

  return patient;
}

export function buildVitalSignObservation(data: {
  patientId: string;
  type: "heart-rate" | "blood-pressure" | "temperature" | "respiratory-rate" | "oxygen-saturation" | "weight" | "height" | "bmi";
  value: number;
  value2?: number; // For blood pressure (diastolic)
  unit: string;
  dateTime?: string;
}): FHIRObservation {
  const loincCodes: Record<string, { code: string; display: string }> = {
    "heart-rate": { code: "8867-4", display: "Heart rate" },
    "blood-pressure": { code: "85354-9", display: "Blood pressure panel" },
    temperature: { code: "8310-5", display: "Body temperature" },
    "respiratory-rate": { code: "9279-1", display: "Respiratory rate" },
    "oxygen-saturation": { code: "2708-6", display: "Oxygen saturation" },
    weight: { code: "29463-7", display: "Body weight" },
    height: { code: "8302-2", display: "Body height" },
    bmi: { code: "39156-5", display: "Body mass index" },
  };

  const loinc = loincCodes[data.type] || { code: "unknown", display: data.type };

  return {
    resourceType: "Observation",
    status: "final",
    category: [{
      coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "vital-signs", display: "Vital Signs" }],
    }],
    code: {
      coding: [{ system: "http://loinc.org", code: loinc.code, display: loinc.display }],
      text: loinc.display,
    },
    subject: { reference: `Patient/${data.patientId}` },
    effectiveDateTime: data.dateTime || new Date().toISOString(),
    valueQuantity: { value: data.value, unit: data.unit, system: "http://unitsofmeasure.org" },
  };
}

export function buildConditionResource(data: {
  patientId: string;
  icd10Code: string;
  displayName: string;
  clinicalStatus: "active" | "recurrence" | "relapse" | "inactive" | "remission" | "resolved";
  severity?: "mild" | "moderate" | "severe";
  onsetDate?: string;
  note?: string;
}): FHIRCondition {
  const condition: FHIRCondition = {
    resourceType: "Condition",
    clinicalStatus: {
      coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: data.clinicalStatus }],
    },
    code: {
      coding: [{ system: "http://hl7.org/fhir/sid/icd-10", code: data.icd10Code, display: data.displayName }],
      text: data.displayName,
    },
    subject: { reference: `Patient/${data.patientId}` },
    recordedDate: new Date().toISOString(),
  };

  if (data.severity) {
    const severityCodes: Record<string, string> = { mild: "255604002", moderate: "6736007", severe: "24484000" };
    condition.severity = {
      coding: [{ system: "http://snomed.info/sct", code: severityCodes[data.severity], display: data.severity }],
    };
  }

  if (data.onsetDate) condition.onsetDateTime = data.onsetDate;
  if (data.note) condition.note = [{ text: data.note }];

  return condition;
}

// ─── Dataset & Store Management ──────────────────────────────

export async function ensureHealthcareInfrastructure(): Promise<{
  dataset: boolean;
  fhirStore: boolean;
  dicomStore: boolean;
  hl7v2Store: boolean;
}> {
  const token = await getAccessToken();
  if (!token) {
    return { dataset: false, fhirStore: false, dicomStore: false, hl7v2Store: false };
  }

  const results = { dataset: false, fhirStore: false, dicomStore: false, hl7v2Store: false };

  try {
    // Check/Create Dataset
    const datasetUrl = `https://healthcare.googleapis.com/v1/projects/${GCP_PROJECT}/locations/${GCP_LOCATION}/datasets/${GCP_DATASET}`;
    let res = await fetch(datasetUrl, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 404) {
      const createUrl = `https://healthcare.googleapis.com/v1/projects/${GCP_PROJECT}/locations/${GCP_LOCATION}/datasets?datasetId=${GCP_DATASET}`;
      res = await fetch(createUrl, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    }
    results.dataset = res.ok || res.status === 409;

    // Check/Create FHIR Store
    const fhirUrl = `${HEALTHCARE_BASE}/fhirStores/${FHIR_STORE}`;
    res = await fetch(fhirUrl, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 404) {
      res = await fetch(`${HEALTHCARE_BASE}/fhirStores?fhirStoreId=${FHIR_STORE}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ version: "R4", enableUpdateCreate: true }),
      });
    }
    results.fhirStore = res.ok || res.status === 409;

    // Check/Create DICOM Store
    const dicomUrl = `${HEALTHCARE_BASE}/dicomStores/${DICOM_STORE}`;
    res = await fetch(dicomUrl, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 404) {
      res = await fetch(`${HEALTHCARE_BASE}/dicomStores?dicomStoreId=${DICOM_STORE}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    }
    results.dicomStore = res.ok || res.status === 409;

    // Check/Create HL7v2 Store
    const hl7Url = `${HEALTHCARE_BASE}/hl7V2Stores/${HL7V2_STORE}`;
    res = await fetch(hl7Url, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 404) {
      res = await fetch(`${HEALTHCARE_BASE}/hl7V2Stores?hl7V2StoreId=${HL7V2_STORE}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ parserConfig: { version: "V2" } }),
      });
    }
    results.hl7v2Store = res.ok || res.status === 409;

    console.log("[GCP Healthcare] Infrastructure check:", results);
  } catch (err) {
    console.error("[GCP Healthcare] Infrastructure setup error:", err);
  }

  return results;
}
