/**
 * Medical API Routes - PubMed, Infermedica, GCP Healthcare, Metriport
 * Exposes REST endpoints for all 4 medical API integrations.
 */

import { Router, Request, Response } from "express";

// PubMed
import {
  searchPubMedAdvanced,
  getArticleByPmid,
  getRelatedArticles,
  getCitedBy,
  generateCitation,
  getTrendingMedicalTopics,
  searchBySpecialty,
  searchClinicalTrials,
  searchSystematicReviews,
  getPubMedStats,
} from "../services/pubmedService";

// Infermedica
import {
  isInfermedicaConfigured,
  generateInterviewId,
  getDiagnosis,
  getTriage,
  parseSymptoms,
  explainCondition,
  suggestSymptoms,
  searchSymptoms,
  searchConditions,
  getAllSymptoms,
  getAllConditions,
  getConditionDetails,
  getRiskFactors,
  getApiInfo,
  startSymptomCheck,
  continueInterview,
  getTriageLevelDescription,
} from "../services/infermedicaService";

// GCP Healthcare
import {
  isHealthcareApiAvailable,
  createPatient,
  getPatient,
  updatePatient,
  searchPatients,
  deletePatient,
  createObservation,
  getPatientObservations,
  createCondition,
  getPatientConditions,
  createMedicationRequest,
  getPatientMedications,
  createEncounter,
  getPatientEncounters,
  getPatientEverything,
  executeBundleTransaction,
  searchDicomStudies,
  getDicomStudy,
  getDicomStudySeries,
  sendHL7v2Message,
  getHL7v2Messages,
  buildFHIRPatient,
  buildVitalSignObservation,
  buildConditionResource,
  ensureHealthcareInfrastructure,
} from "../services/gcpHealthcareService";

// Metriport
import {
  isMetriportConfigured,
  createMetriportPatient,
  getMetriportPatient,
  updateMetriportPatient,
  deleteMetriportPatient,
  listMetriportPatients,
  matchPatient,
  queryDocuments,
  listDocuments,
  getDocumentUrl,
  startConsolidatedQuery,
  getConsolidatedData,
  getPatientCount,
  getConnectToken,
  getActivityData,
  getBodyData,
  getBiometricsData,
  getNutritionData,
  getSleepData,
  getUserConnectedProviders,
  revokeProviderAccess,
  getSupportedWearableProviders,
  formatWearableSummary,
  calculateHealthScore,
} from "../services/metriportService";

const router = Router();

// ═══════════════════════════════════════════════════════════════
// PUBMED API ROUTES
// ═══════════════════════════════════════════════════════════════

router.get("/pubmed/search", async (req: Request, res: Response) => {
  try {
    const { q, maxResults, page, sort, dateFrom, dateTo, articleTypes, language } = req.query;
    const result = await searchPubMedAdvanced(String(q || ""), {
      maxResults: Number(maxResults) || 10,
      page: Number(page) || 1,
      sort: (sort as "relevance" | "date") || "relevance",
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
      articleTypes: articleTypes ? String(articleTypes).split(",") : undefined,
      language: language as string,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar no PubMed" });
  }
});

router.get("/pubmed/article/:pmid", async (req: Request, res: Response) => {
  try {
    const article = await getArticleByPmid(req.params.pmid);
    if (!article) return res.status(404).json({ error: "Artigo nao encontrado" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar artigo" });
  }
});

router.get("/pubmed/article/:pmid/related", async (req: Request, res: Response) => {
  try {
    const articles = await getRelatedArticles(req.params.pmid, Number(req.query.max) || 5);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar artigos relacionados" });
  }
});

router.get("/pubmed/article/:pmid/cited-by", async (req: Request, res: Response) => {
  try {
    const articles = await getCitedBy(req.params.pmid, Number(req.query.max) || 10);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar citacoes" });
  }
});

router.get("/pubmed/article/:pmid/citation", async (req: Request, res: Response) => {
  try {
    const article = await getArticleByPmid(req.params.pmid);
    if (!article) return res.status(404).json({ error: "Artigo nao encontrado" });
    const citation = generateCitation(article);
    res.json(citation);
  } catch (err) {
    res.status(500).json({ error: "Erro ao gerar citacao" });
  }
});

router.get("/pubmed/trending", async (_req: Request, res: Response) => {
  try {
    const topics = await getTrendingMedicalTopics();
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar topicos em alta" });
  }
});

router.get("/pubmed/specialty/:specialty", async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const result = await searchBySpecialty(req.params.specialty, String(q || ""), Number(req.query.max) || 10);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar por especialidade" });
  }
});

router.get("/pubmed/clinical-trials", async (req: Request, res: Response) => {
  try {
    const { condition, intervention, max } = req.query;
    const result = await searchClinicalTrials(String(condition || ""), intervention as string, Number(max) || 10);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar ensaios clinicos" });
  }
});

router.get("/pubmed/systematic-reviews", async (req: Request, res: Response) => {
  try {
    const { topic, max } = req.query;
    const result = await searchSystematicReviews(String(topic || ""), Number(max) || 10);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar revisoes sistematicas" });
  }
});

router.get("/pubmed/stats", async (_req: Request, res: Response) => {
  try {
    const stats = await getPubMedStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar estatisticas" });
  }
});

// ═══════════════════════════════════════════════════════════════
// INFERMEDICA API ROUTES
// ═══════════════════════════════════════════════════════════════

router.get("/infermedica/status", async (_req: Request, res: Response) => {
  try {
    const configured = isInfermedicaConfigured();
    if (!configured) return res.json({ configured: false, message: "Infermedica API nao configurada" });
    const info = await getApiInfo();
    res.json({ configured: true, info });
  } catch (err) {
    res.status(500).json({ error: "Erro ao verificar status da Infermedica" });
  }
});

router.post("/infermedica/symptom-check/start", async (req: Request, res: Response) => {
  try {
    const { sex, age, symptoms } = req.body;
    if (!sex || !age || !symptoms) {
      return res.status(400).json({ error: "Campos obrigatorios: sex, age, symptoms" });
    }
    const result = await startSymptomCheck(sex, age, symptoms);
    if (!result) return res.status(503).json({ error: "Infermedica API nao disponivel" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao iniciar verificacao de sintomas" });
  }
});

router.post("/infermedica/symptom-check/continue", async (req: Request, res: Response) => {
  try {
    const { patient, interviewId, answers } = req.body;
    if (!patient || !interviewId || !answers) {
      return res.status(400).json({ error: "Campos obrigatorios: patient, interviewId, answers" });
    }
    const result = await continueInterview(patient, interviewId, answers);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao continuar entrevista" });
  }
});

router.post("/infermedica/diagnosis", async (req: Request, res: Response) => {
  try {
    const { patient, interviewId } = req.body;
    const result = await getDiagnosis(patient, interviewId || generateInterviewId());
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter diagnostico" });
  }
});

router.post("/infermedica/triage", async (req: Request, res: Response) => {
  try {
    const { patient, interviewId } = req.body;
    const result = await getTriage(patient, interviewId || generateInterviewId());
    if (result) {
      const levelInfo = getTriageLevelDescription(result.triage_level);
      res.json({ ...result, levelInfo });
    } else {
      res.status(503).json({ error: "Infermedica API nao disponivel" });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter triagem" });
  }
});

router.post("/infermedica/parse", async (req: Request, res: Response) => {
  try {
    const { text, sex, age, interviewId } = req.body;
    const result = await parseSymptoms(text, { sex, age: { value: age } }, interviewId || generateInterviewId());
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao analisar sintomas" });
  }
});

router.post("/infermedica/explain", async (req: Request, res: Response) => {
  try {
    const { patient, conditionId, interviewId } = req.body;
    const result = await explainCondition(patient, conditionId, interviewId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao explicar condicao" });
  }
});

router.post("/infermedica/suggest", async (req: Request, res: Response) => {
  try {
    const { patient, interviewId, maxResults } = req.body;
    const result = await suggestSymptoms(patient, interviewId, maxResults);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao sugerir sintomas" });
  }
});

router.get("/infermedica/symptoms/search", async (req: Request, res: Response) => {
  try {
    const { phrase, sex, max } = req.query;
    const result = await searchSymptoms(String(phrase || ""), sex as any, Number(max) || 10);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar sintomas" });
  }
});

router.get("/infermedica/symptoms", async (_req: Request, res: Response) => {
  try {
    const result = await getAllSymptoms();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar sintomas" });
  }
});

router.get("/infermedica/conditions", async (_req: Request, res: Response) => {
  try {
    const result = await getAllConditions();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar condicoes" });
  }
});

router.get("/infermedica/conditions/:id", async (req: Request, res: Response) => {
  try {
    const result = await getConditionDetails(req.params.id);
    if (!result) return res.status(404).json({ error: "Condicao nao encontrada" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar detalhes da condicao" });
  }
});

router.get("/infermedica/risk-factors", async (_req: Request, res: Response) => {
  try {
    const result = await getRiskFactors();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar fatores de risco" });
  }
});

// ═══════════════════════════════════════════════════════════════
// GCP HEALTHCARE API ROUTES (FHIR)
// ═══════════════════════════════════════════════════════════════

router.get("/healthcare/status", async (_req: Request, res: Response) => {
  try {
    const available = await isHealthcareApiAvailable();
    res.json({ available, message: available ? "GCP Healthcare API disponivel" : "GCP Healthcare API nao disponivel" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao verificar status" });
  }
});

router.post("/healthcare/setup", async (_req: Request, res: Response) => {
  try {
    const result = await ensureHealthcareInfrastructure();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao configurar infraestrutura" });
  }
});

// FHIR Patient
router.post("/healthcare/fhir/patient", async (req: Request, res: Response) => {
  try {
    const patient = await createPatient(req.body);
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar paciente" });
  }
});

router.get("/healthcare/fhir/patient/:id", async (req: Request, res: Response) => {
  try {
    const patient = await getPatient(req.params.id);
    if (!patient) return res.status(404).json({ error: "Paciente nao encontrado" });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar paciente" });
  }
});

router.put("/healthcare/fhir/patient/:id", async (req: Request, res: Response) => {
  try {
    const patient = await updatePatient(req.params.id, req.body);
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar paciente" });
  }
});

router.get("/healthcare/fhir/patients", async (req: Request, res: Response) => {
  try {
    const result = await searchPatients(req.query as any);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar pacientes" });
  }
});

router.delete("/healthcare/fhir/patient/:id", async (req: Request, res: Response) => {
  try {
    await deletePatient(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar paciente" });
  }
});

// FHIR Observations
router.post("/healthcare/fhir/observation", async (req: Request, res: Response) => {
  try {
    const obs = await createObservation(req.body);
    res.status(201).json(obs);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar observacao" });
  }
});

router.get("/healthcare/fhir/patient/:id/observations", async (req: Request, res: Response) => {
  try {
    const result = await getPatientObservations(req.params.id, req.query.category as string, req.query.code as string);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar observacoes" });
  }
});

// FHIR Conditions
router.post("/healthcare/fhir/condition", async (req: Request, res: Response) => {
  try {
    const condition = await createCondition(req.body);
    res.status(201).json(condition);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar condicao" });
  }
});

router.get("/healthcare/fhir/patient/:id/conditions", async (req: Request, res: Response) => {
  try {
    const result = await getPatientConditions(req.params.id, req.query.status as string);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar condicoes" });
  }
});

// FHIR Medications
router.post("/healthcare/fhir/medication-request", async (req: Request, res: Response) => {
  try {
    const medReq = await createMedicationRequest(req.body);
    res.status(201).json(medReq);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar prescricao" });
  }
});

router.get("/healthcare/fhir/patient/:id/medications", async (req: Request, res: Response) => {
  try {
    const result = await getPatientMedications(req.params.id, req.query.status as string);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar medicacoes" });
  }
});

// FHIR Encounters
router.post("/healthcare/fhir/encounter", async (req: Request, res: Response) => {
  try {
    const encounter = await createEncounter(req.body);
    res.status(201).json(encounter);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar encontro" });
  }
});

router.get("/healthcare/fhir/patient/:id/encounters", async (req: Request, res: Response) => {
  try {
    const result = await getPatientEncounters(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar encontros" });
  }
});

// Patient Everything
router.get("/healthcare/fhir/patient/:id/everything", async (req: Request, res: Response) => {
  try {
    const result = await getPatientEverything(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados completos do paciente" });
  }
});

// FHIR Bundle Transaction
router.post("/healthcare/fhir/bundle", async (req: Request, res: Response) => {
  try {
    const result = await executeBundleTransaction(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao executar transacao" });
  }
});

// FHIR Helpers
router.post("/healthcare/helpers/build-patient", (req: Request, res: Response) => {
  try {
    const patient = buildFHIRPatient(req.body);
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: "Erro ao construir recurso FHIR Patient" });
  }
});

router.post("/healthcare/helpers/build-vital-sign", (req: Request, res: Response) => {
  try {
    const obs = buildVitalSignObservation(req.body);
    res.json(obs);
  } catch (err) {
    res.status(500).json({ error: "Erro ao construir recurso FHIR Observation" });
  }
});

router.post("/healthcare/helpers/build-condition", (req: Request, res: Response) => {
  try {
    const condition = buildConditionResource(req.body);
    res.json(condition);
  } catch (err) {
    res.status(500).json({ error: "Erro ao construir recurso FHIR Condition" });
  }
});

// DICOM
router.get("/healthcare/dicom/studies", async (req: Request, res: Response) => {
  try {
    const result = await searchDicomStudies(req.query as any);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar estudos DICOM" });
  }
});

router.get("/healthcare/dicom/studies/:uid", async (req: Request, res: Response) => {
  try {
    const result = await getDicomStudy(req.params.uid);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar estudo DICOM" });
  }
});

router.get("/healthcare/dicom/studies/:uid/series", async (req: Request, res: Response) => {
  try {
    const result = await getDicomStudySeries(req.params.uid);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar series DICOM" });
  }
});

// HL7v2
router.post("/healthcare/hl7v2/messages", async (req: Request, res: Response) => {
  try {
    const result = await sendHL7v2Message(req.body.message);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao enviar mensagem HL7v2" });
  }
});

router.get("/healthcare/hl7v2/messages", async (req: Request, res: Response) => {
  try {
    const result = await getHL7v2Messages(req.query.filter as string);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar mensagens HL7v2" });
  }
});

// ═══════════════════════════════════════════════════════════════
// METRIPORT API ROUTES
// ═══════════════════════════════════════════════════════════════

router.get("/metriport/status", (_req: Request, res: Response) => {
  const configured = isMetriportConfigured();
  res.json({
    configured,
    message: configured ? "Metriport API configurada" : "Metriport API nao configurada. Configure METRIPORT_API_KEY e METRIPORT_FACILITY_ID.",
    supportedProviders: getSupportedWearableProviders(),
  });
});

// Patient Management
router.post("/metriport/patients", async (req: Request, res: Response) => {
  try {
    const patient = await createMetriportPatient(req.body);
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar paciente no Metriport" });
  }
});

router.get("/metriport/patients", async (_req: Request, res: Response) => {
  try {
    const patients = await listMetriportPatients();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar pacientes" });
  }
});

router.get("/metriport/patients/:id", async (req: Request, res: Response) => {
  try {
    const patient = await getMetriportPatient(req.params.id);
    if (!patient) return res.status(404).json({ error: "Paciente nao encontrado" });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar paciente" });
  }
});

router.put("/metriport/patients/:id", async (req: Request, res: Response) => {
  try {
    const patient = await updateMetriportPatient(req.params.id, req.body);
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar paciente" });
  }
});

router.delete("/metriport/patients/:id", async (req: Request, res: Response) => {
  try {
    await deleteMetriportPatient(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar paciente" });
  }
});

// Patient Match
router.post("/metriport/patients/:id/match", async (req: Request, res: Response) => {
  try {
    const result = await matchPatient(req.params.id);
    res.json({ success: result });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar correspondencia do paciente" });
  }
});

// Documents
router.post("/metriport/patients/:id/documents/query", async (req: Request, res: Response) => {
  try {
    const result = await queryDocuments(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao consultar documentos" });
  }
});

router.get("/metriport/patients/:id/documents", async (req: Request, res: Response) => {
  try {
    const docs = await listDocuments(req.params.id);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar documentos" });
  }
});

router.get("/metriport/documents/download", async (req: Request, res: Response) => {
  try {
    const { patientId, fileName, format } = req.query;
    const result = await getDocumentUrl(String(patientId), String(fileName), format as any);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter URL do documento" });
  }
});

// Consolidated Data (FHIR)
router.post("/metriport/patients/:id/consolidated/query", async (req: Request, res: Response) => {
  try {
    const { resources, dateFrom, dateTo } = req.body;
    const result = await startConsolidatedQuery(req.params.id, resources, dateFrom, dateTo);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao iniciar consulta consolidada" });
  }
});

router.get("/metriport/patients/:id/consolidated", async (req: Request, res: Response) => {
  try {
    const { resources, dateFrom, dateTo } = req.query;
    const result = await getConsolidatedData(
      req.params.id,
      resources ? String(resources).split(",") : undefined,
      dateFrom as string,
      dateTo as string
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados consolidados" });
  }
});

router.get("/metriport/patients/:id/consolidated/count", async (req: Request, res: Response) => {
  try {
    const result = await getPatientCount(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao contar recursos" });
  }
});

// Devices API
router.get("/metriport/devices/connect-token", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const token = await getConnectToken(String(userId));
    res.json(token);
  } catch (err) {
    res.status(500).json({ error: "Erro ao gerar token de conexao" });
  }
});

router.get("/metriport/devices/providers", (_req: Request, res: Response) => {
  res.json(getSupportedWearableProviders());
});

router.get("/metriport/devices/activity", async (req: Request, res: Response) => {
  try {
    const { userId, date } = req.query;
    const data = await getActivityData(String(userId), String(date));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados de atividade" });
  }
});

router.get("/metriport/devices/body", async (req: Request, res: Response) => {
  try {
    const { userId, date } = req.query;
    const data = await getBodyData(String(userId), String(date));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados corporais" });
  }
});

router.get("/metriport/devices/biometrics", async (req: Request, res: Response) => {
  try {
    const { userId, date } = req.query;
    const data = await getBiometricsData(String(userId), String(date));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados biometricos" });
  }
});

router.get("/metriport/devices/nutrition", async (req: Request, res: Response) => {
  try {
    const { userId, date } = req.query;
    const data = await getNutritionData(String(userId), String(date));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados de nutricao" });
  }
});

router.get("/metriport/devices/sleep", async (req: Request, res: Response) => {
  try {
    const { userId, date } = req.query;
    const data = await getSleepData(String(userId), String(date));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados de sono" });
  }
});

router.get("/metriport/devices/user/:userId", async (req: Request, res: Response) => {
  try {
    const data = await getUserConnectedProviders(req.params.userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados do usuario" });
  }
});

router.delete("/metriport/devices/user/:userId/revoke", async (req: Request, res: Response) => {
  try {
    const { provider } = req.query;
    await revokeProviderAccess(req.params.userId, String(provider));
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erro ao revogar acesso" });
  }
});

// Health Score
router.post("/metriport/health-score", (req: Request, res: Response) => {
  try {
    const score = calculateHealthScore(req.body);
    res.json(score);
  } catch (err) {
    res.status(500).json({ error: "Erro ao calcular health score" });
  }
});

// ═══════════════════════════════════════════════════════════════
// API STATUS OVERVIEW
// ═══════════════════════════════════════════════════════════════

router.get("/medical-apis/status", async (_req: Request, res: Response) => {
  try {
    const [pubmedStats, infermedicaConfigured, healthcareAvailable, metriportConfigured] = await Promise.all([
      getPubMedStats(),
      Promise.resolve(isInfermedicaConfigured()),
      isHealthcareApiAvailable(),
      Promise.resolve(isMetriportConfigured()),
    ]);

    res.json({
      pubmed: {
        status: "active",
        description: "Busca de artigos cientificos - PubMed/NCBI",
        totalRecords: pubmedStats.totalRecords,
        requiresKey: false,
      },
      infermedica: {
        status: infermedicaConfigured ? "active" : "not_configured",
        description: "Triagem e verificacao de sintomas com IA",
        requiresKey: true,
        configured: infermedicaConfigured,
      },
      gcpHealthcare: {
        status: healthcareAvailable ? "active" : "not_available",
        description: "FHIR R4, HL7v2, DICOM - Google Cloud Healthcare",
        requiresKey: true,
        available: healthcareAvailable,
      },
      metriport: {
        status: metriportConfigured ? "active" : "not_configured",
        description: "Consolidacao de dados e wearables - Metriport",
        requiresKey: true,
        configured: metriportConfigured,
        supportedProviders: getSupportedWearableProviders().length,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao verificar status das APIs" });
  }
});

export default router;
