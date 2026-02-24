/**
 * Bíblia Farmacológica — Serviço de Dados Farmacológicos
 * Integra OpenFDA, DailyMed, RxNorm e Gemini AI para referência completa
 */

const OPENFDA_BASE = "https://api.fda.gov";
const DAILYMED_BASE = "https://dailymed.nlm.nih.gov/dailymed/services/v2";
const RXNORM_BASE = "https://rxnav.nlm.nih.gov/REST";

// ─── Tipos ──────────────────────────────────────────────────────

export interface DrugMonograph {
  genericName: string;
  brandNames: string[];
  drugClass: string;
  subClass: string;
  mechanismOfAction: string;
  pharmacokinetics: {
    absorption: string;
    distribution: string;
    metabolism: string;
    elimination: string;
    halfLife: string;
    bioavailability: string;
    proteinBinding: string;
    onsetOfAction: string;
    peakEffect: string;
    duration: string;
  };
  pharmacodynamics: string;
  indications: string[];
  contraindications: string[];
  dosage: {
    adult: string;
    pediatric: string;
    geriatric: string;
    renalAdjustment: string;
    hepaticAdjustment: string;
    maxDose: string;
  };
  routes: string[];
  dosageForms: string[];
  adverseEffects: {
    common: string[];
    serious: string[];
    rare: string[];
    blackBoxWarning: string;
  };
  interactions: {
    drugs: { name: string; severity: string; effect: string }[];
    food: string[];
    alcohol: string;
    labTests: string[];
  };
  specialPopulations: {
    pregnancy: string;
    lactation: string;
    pediatric: string;
    geriatric: string;
    renalImpairment: string;
    hepaticImpairment: string;
  };
  monitoring: string[];
  patientCounseling: string[];
  storage: string;
  references: string[];
}

export interface DrugClassInfo {
  className: string;
  description: string;
  commonMechanism: string;
  prototypeDrug: string;
  drugs: {
    name: string;
    distinguishingFeature: string;
    relativeEfficacy: string;
  }[];
  commonIndications: string[];
  classEffects: string[];
  classContraindications: string[];
  clinicalPearls: string[];
}

export interface PrescriptionGuide {
  condition: string;
  firstLine: { drug: string; dose: string; duration: string; evidence: string }[];
  secondLine: { drug: string; dose: string; duration: string; evidence: string }[];
  thirdLine: { drug: string; dose: string; duration: string; evidence: string }[];
  specialConsiderations: string[];
  monitoringRequired: string[];
  referenceGuidelines: string[];
}

export interface DrugComparisonResult {
  drugs: string[];
  comparison: {
    parameter: string;
    values: Record<string, string>;
  }[];
  clinicalAdvantages: Record<string, string[]>;
  recommendation: string;
}

// ─── Classes Terapêuticas Completas ─────────────────────────────

export const THERAPEUTIC_CLASSES: Record<string, {
  name: string;
  icon: string;
  description: string;
  subclasses: string[];
  prototypes: string[];
}> = {
  cardiovascular: {
    name: "Cardiovascular",
    icon: "❤️",
    description: "Medicamentos para doenças cardíacas, hipertensão, arritmias e insuficiência cardíaca",
    subclasses: [
      "Anti-hipertensivos (IECA, BRA, BCC, Diuréticos, Betabloqueadores)",
      "Antiarrítmicos (Classe I-IV de Vaughan-Williams)",
      "Antianginosos (Nitratos, BCC, Betabloqueadores)",
      "Inotrópicos (Digitálicos, Dobutamina, Milrinona)",
      "Vasodilatadores (Hidralazina, Nitroprussiato)",
      "Anticoagulantes (Heparina, Warfarina, DOACs)",
      "Antiplaquetários (AAS, Clopidogrel, Ticagrelor)",
      "Hipolipemiantes (Estatinas, Fibratos, Ezetimiba)"
    ],
    prototypes: ["Enalapril", "Losartana", "Anlodipino", "Atenolol", "Amiodarona", "Warfarina", "Atorvastatina"]
  },
  antibiotics: {
    name: "Antibióticos",
    icon: "🦠",
    description: "Antimicrobianos para infecções bacterianas, incluindo betalactâmicos, quinolonas e aminoglicosídeos",
    subclasses: [
      "Penicilinas (Amoxicilina, Ampicilina, Piperacilina)",
      "Cefalosporinas (1ª a 5ª geração)",
      "Carbapenêmicos (Meropenem, Imipenem, Ertapenem)",
      "Quinolonas (Ciprofloxacino, Levofloxacino, Moxifloxacino)",
      "Aminoglicosídeos (Gentamicina, Amicacina, Tobramicina)",
      "Macrolídeos (Azitromicina, Claritromicina, Eritromicina)",
      "Tetraciclinas (Doxiciclina, Minociclina, Tigeciclina)",
      "Glicopeptídeos (Vancomicina, Teicoplanina)",
      "Oxazolidinonas (Linezolida)",
      "Sulfonamidas (Sulfametoxazol-Trimetoprima)"
    ],
    prototypes: ["Amoxicilina", "Ceftriaxona", "Meropenem", "Ciprofloxacino", "Azitromicina", "Vancomicina"]
  },
  analgesics: {
    name: "Analgésicos e Anti-inflamatórios",
    icon: "💊",
    description: "AINEs, opioides, paracetamol e corticosteroides para dor e inflamação",
    subclasses: [
      "AINEs não seletivos (Ibuprofeno, Diclofenaco, Naproxeno)",
      "AINEs COX-2 seletivos (Celecoxibe, Etoricoxibe)",
      "Opioides fracos (Tramadol, Codeína)",
      "Opioides fortes (Morfina, Fentanil, Oxicodona, Metadona)",
      "Analgésicos simples (Paracetamol, Dipirona)",
      "Corticosteroides (Prednisona, Dexametasona, Hidrocortisona)",
      "Adjuvantes (Gabapentina, Pregabalina, Amitriptilina)"
    ],
    prototypes: ["Ibuprofeno", "Morfina", "Paracetamol", "Prednisona", "Tramadol"]
  },
  neuropsychiatric: {
    name: "Neuropsiquiátricos",
    icon: "🧠",
    description: "Antidepressivos, antipsicóticos, ansiolíticos, antiepilépticos e antiparkinsonianos",
    subclasses: [
      "ISRS (Fluoxetina, Sertralina, Escitalopram, Paroxetina)",
      "ISRSN (Venlafaxina, Duloxetina, Desvenlafaxina)",
      "Tricíclicos (Amitriptilina, Nortriptilina, Clomipramina)",
      "Antipsicóticos típicos (Haloperidol, Clorpromazina)",
      "Antipsicóticos atípicos (Risperidona, Quetiapina, Olanzapina, Clozapina)",
      "Benzodiazepínicos (Diazepam, Clonazepam, Alprazolam, Midazolam)",
      "Antiepilépticos (Carbamazepina, Valproato, Fenitoína, Levetiracetam, Lamotrigina)",
      "Antiparkinsonianos (Levodopa/Carbidopa, Pramipexol, Selegilina)",
      "Estabilizadores de humor (Lítio, Valproato, Lamotrigina)"
    ],
    prototypes: ["Fluoxetina", "Haloperidol", "Quetiapina", "Diazepam", "Carbamazepina", "Levodopa"]
  },
  endocrine: {
    name: "Endocrinológicos",
    icon: "⚗️",
    description: "Antidiabéticos, hormônios tireoidianos, corticosteroides e hormônios sexuais",
    subclasses: [
      "Insulinas (Rápida, Regular, NPH, Glargina, Detemir, Degludeca)",
      "Sulfonilureias (Glibenclamida, Glimepirida, Gliclazida)",
      "Biguanidas (Metformina)",
      "Inibidores DPP-4 (Sitagliptina, Vildagliptina, Saxagliptina)",
      "Agonistas GLP-1 (Liraglutida, Semaglutida, Dulaglutida)",
      "Inibidores SGLT2 (Dapagliflozina, Empagliflozina, Canagliflozina)",
      "Tiazolidinedionas (Pioglitazona)",
      "Hormônios tireoidianos (Levotiroxina)",
      "Antitireoidianos (Metimazol, Propiltiouracil)",
      "Corticosteroides sistêmicos (Prednisona, Prednisolona, Dexametasona)"
    ],
    prototypes: ["Metformina", "Insulina Glargina", "Semaglutida", "Levotiroxina", "Dapagliflozina"]
  },
  respiratory: {
    name: "Respiratórios",
    icon: "🫁",
    description: "Broncodilatadores, corticosteroides inalatórios, antitussígenos e mucolíticos",
    subclasses: [
      "Beta-2 agonistas de curta ação — SABA (Salbutamol, Fenoterol)",
      "Beta-2 agonistas de longa ação — LABA (Formoterol, Salmeterol)",
      "Anticolinérgicos — SAMA/LAMA (Ipratrópio, Tiotrópio)",
      "Corticosteroides inalatórios (Budesonida, Fluticasona, Beclometasona)",
      "Combinações ICS/LABA (Budesonida/Formoterol, Fluticasona/Salmeterol)",
      "Antileucotrienos (Montelucaste)",
      "Xantinas (Aminofilina, Teofilina)",
      "Mucolíticos (N-acetilcisteína, Ambroxol)",
      "Anti-IgE (Omalizumabe)"
    ],
    prototypes: ["Salbutamol", "Budesonida", "Tiotrópio", "Montelucaste"]
  },
  gastrointestinal: {
    name: "Gastrointestinais",
    icon: "🔬",
    description: "Antiácidos, IBPs, procinéticos, antieméticos, laxantes e antidiarreicos",
    subclasses: [
      "Inibidores da bomba de prótons (Omeprazol, Pantoprazol, Esomeprazol, Lansoprazol)",
      "Antagonistas H2 (Ranitidina, Famotidina)",
      "Antiácidos (Hidróxido de alumínio, Hidróxido de magnésio)",
      "Procinéticos (Metoclopramida, Domperidona, Bromoprida)",
      "Antieméticos (Ondansetrona, Dimenidrinato, Prometazina)",
      "Laxantes (Lactulose, Bisacodil, Polietilenoglicol, Fibras)",
      "Antidiarreicos (Loperamida, Racecadotrila)",
      "Antiespasmódicos (Hioscina, Escopolamina, Trimebutina)",
      "Hepatoprotetores (Ácido ursodesoxicólico)"
    ],
    prototypes: ["Omeprazol", "Ondansetrona", "Metoclopramida", "Lactulose"]
  },
  antifungals: {
    name: "Antifúngicos",
    icon: "🍄",
    description: "Azóis, polienos, equinocandinas e alilaminas para infecções fúngicas",
    subclasses: [
      "Azóis (Fluconazol, Itraconazol, Voriconazol, Posaconazol)",
      "Polienos (Anfotericina B, Nistatina)",
      "Equinocandinas (Caspofungina, Micafungina, Anidulafungina)",
      "Alilaminas (Terbinafina)",
      "Antimetabólitos (Flucitosina)"
    ],
    prototypes: ["Fluconazol", "Anfotericina B", "Caspofungina"]
  },
  antivirals: {
    name: "Antivirais",
    icon: "🧬",
    description: "Antivirais para HIV, hepatites, herpes e influenza",
    subclasses: [
      "Antirretrovirais ITRN (Tenofovir, Lamivudina, Zidovudina)",
      "Antirretrovirais ITRNN (Efavirenz, Nevirapina)",
      "Inibidores de protease (Atazanavir, Darunavir, Lopinavir/Ritonavir)",
      "Inibidores de integrase (Dolutegravir, Raltegravir)",
      "Anti-hepatite C (Sofosbuvir, Daclatasvir, Ledipasvir)",
      "Anti-herpéticos (Aciclovir, Valaciclovir, Ganciclovir)",
      "Anti-influenza (Oseltamivir, Zanamivir)"
    ],
    prototypes: ["Tenofovir", "Dolutegravir", "Aciclovir", "Oseltamivir"]
  },
  antiparasitic: {
    name: "Antiparasitários",
    icon: "🪱",
    description: "Antimaláricos, anti-helmínticos e antiprotozoários",
    subclasses: [
      "Antimaláricos (Cloroquina, Artemisinina, Mefloquina, Primaquina)",
      "Anti-helmínticos (Albendazol, Mebendazol, Ivermectina, Praziquantel)",
      "Antiprotozoários (Metronidazol, Secnidazol, Nitazoxanida)",
      "Antileishmania (Anfotericina B lipossomal, Antimoniais pentavalentes)"
    ],
    prototypes: ["Albendazol", "Ivermectina", "Metronidazol", "Cloroquina"]
  },
  oncology: {
    name: "Oncológicos",
    icon: "🎗️",
    description: "Quimioterápicos, imunoterápicos, terapias-alvo e hormonioterapia",
    subclasses: [
      "Alquilantes (Ciclofosfamida, Cisplatina, Carboplatina)",
      "Antimetabólitos (Metotrexato, 5-Fluorouracil, Capecitabina, Gencitabina)",
      "Antraciclinas (Doxorrubicina, Epirrubicina)",
      "Taxanos (Paclitaxel, Docetaxel)",
      "Inibidores de tirosina quinase (Imatinibe, Erlotinibe, Osimertinibe)",
      "Anticorpos monoclonais (Trastuzumabe, Bevacizumabe, Rituximabe, Pembrolizumabe)",
      "Inibidores de checkpoint (Nivolumabe, Pembrolizumabe, Atezolizumabe)",
      "Hormonioterapia (Tamoxifeno, Anastrozol, Letrozol, Enzalutamida)"
    ],
    prototypes: ["Cisplatina", "Metotrexato", "Paclitaxel", "Pembrolizumabe", "Tamoxifeno"]
  },
  immunosuppressants: {
    name: "Imunossupressores",
    icon: "🛡️",
    description: "Medicamentos para transplantes, doenças autoimunes e imunossupressão",
    subclasses: [
      "Inibidores de calcineurina (Ciclosporina, Tacrolimus)",
      "Antimetabólitos (Azatioprina, Micofenolato)",
      "Inibidores de mTOR (Sirolimus, Everolimus)",
      "Biológicos (Infliximabe, Adalimumabe, Etanercepte, Tocilizumabe)",
      "Corticosteroides (Prednisona, Metilprednisolona)"
    ],
    prototypes: ["Tacrolimus", "Micofenolato", "Infliximabe", "Prednisona"]
  },
  dermatological: {
    name: "Dermatológicos",
    icon: "🧴",
    description: "Tópicos, retinoides, antifúngicos cutâneos e imunobiológicos para pele",
    subclasses: [
      "Corticosteroides tópicos (Hidrocortisona, Betametasona, Clobetasol)",
      "Retinoides (Isotretinoína, Tretinoína, Adapaleno)",
      "Antibióticos tópicos (Mupirocina, Ácido fusídico, Clindamicina gel)",
      "Antifúngicos tópicos (Cetoconazol, Terbinafina creme)",
      "Imunobiológicos para psoríase (Secuquinumabe, Ustequinumabe)",
      "Emolientes e queratolíticos (Ureia, Ácido salicílico)"
    ],
    prototypes: ["Isotretinoína", "Betametasona tópica", "Secuquinumabe"]
  },
  hematological: {
    name: "Hematológicos",
    icon: "🩸",
    description: "Anticoagulantes, antiplaquetários, fibrinolíticos e fatores de coagulação",
    subclasses: [
      "Heparinas (HNF, Enoxaparina, Dalteparina)",
      "Antagonistas da vitamina K (Warfarina)",
      "DOACs (Rivaroxabana, Apixabana, Dabigatrana, Edoxabana)",
      "Antiplaquetários (AAS, Clopidogrel, Ticagrelor, Prasugrel)",
      "Fibrinolíticos (Alteplase, Tenecteplase, Estreptoquinase)",
      "Antifibrinolíticos (Ácido tranexâmico, Ácido aminocaproico)",
      "Eritropoietina e análogos (EPO, Darbepoetina)",
      "Ferro (Sulfato ferroso, Ferro IV, Carboximaltose férrica)"
    ],
    prototypes: ["Enoxaparina", "Rivaroxabana", "Clopidogrel", "Alteplase"]
  },
  nephrology: {
    name: "Nefrológicos",
    icon: "🫘",
    description: "Diuréticos, quelantes de fósforo, eritropoietina e medicamentos para DRC",
    subclasses: [
      "Diuréticos de alça (Furosemida, Bumetanida)",
      "Tiazídicos (Hidroclorotiazida, Clortalidona, Indapamida)",
      "Poupadores de potássio (Espironolactona, Amilorida)",
      "Inibidores da anidrase carbônica (Acetazolamida)",
      "Osmóticos (Manitol)",
      "Quelantes de fósforo (Sevelâmer, Carbonato de cálcio)",
      "Análogos de vitamina D (Calcitriol, Alfacalcidol)"
    ],
    prototypes: ["Furosemida", "Espironolactona", "Hidroclorotiazida"]
  },
  anesthetics: {
    name: "Anestésicos e Sedativos",
    icon: "😴",
    description: "Anestésicos gerais, locais, sedativos e bloqueadores neuromusculares",
    subclasses: [
      "Anestésicos gerais IV (Propofol, Etomidato, Cetamina, Tiopental)",
      "Anestésicos inalatórios (Sevoflurano, Desflurano, Isoflurano)",
      "Anestésicos locais (Lidocaína, Bupivacaína, Ropivacaína, Levobupivacaína)",
      "Bloqueadores neuromusculares (Succinilcolina, Rocurônio, Atracúrio, Cisatracúrio)",
      "Sedativos (Midazolam, Dexmedetomidina, Propofol em infusão)",
      "Antagonistas (Flumazenil, Naloxona, Sugamadex, Neostigmina)"
    ],
    prototypes: ["Propofol", "Lidocaína", "Rocurônio", "Midazolam", "Cetamina"]
  },
  emergency: {
    name: "Emergência e UTI",
    icon: "🚑",
    description: "Vasopressores, antiarrítmicos de emergência, antídotos e reanimação",
    subclasses: [
      "Vasopressores (Noradrenalina, Adrenalina, Vasopressina, Dopamina)",
      "Inotrópicos (Dobutamina, Milrinona, Levosimendan)",
      "Antiarrítmicos de emergência (Amiodarona IV, Adenosina, Atropina)",
      "Antídotos (N-acetilcisteína, Flumazenil, Naloxona, Atropina, Pralidoxima)",
      "Sedação e analgesia em UTI (Fentanil, Midazolam, Dexmedetomidina, Propofol)",
      "Cristaloides e coloides (SF 0.9%, Ringer Lactato, Albumina)"
    ],
    prototypes: ["Noradrenalina", "Adrenalina", "Amiodarona", "N-acetilcisteína"]
  },
  ophthalmology: {
    name: "Oftalmológicos",
    icon: "👁️",
    description: "Colírios, antiglaucomatosos e anti-inflamatórios oculares",
    subclasses: [
      "Antiglaucomatosos (Timolol, Latanoprosta, Brimonidina, Dorzolamida)",
      "Antibióticos oftálmicos (Ciprofloxacino colírio, Tobramicina, Moxifloxacino)",
      "Anti-inflamatórios oculares (Dexametasona colírio, Cetorolaco, Nepafenaco)",
      "Lubrificantes (Lágrima artificial, Carmelose, Hialuronato)",
      "Midriáticos (Tropicamida, Fenilefrina, Atropina colírio)"
    ],
    prototypes: ["Timolol colírio", "Latanoprosta", "Dexametasona colírio"]
  },
  pediatric: {
    name: "Pediatria",
    icon: "👶",
    description: "Medicamentos com doses e considerações específicas para crianças",
    subclasses: [
      "Antitérmicos pediátricos (Paracetamol, Dipirona, Ibuprofeno — doses por kg)",
      "Antibióticos pediátricos (Amoxicilina susp., Azitromicina susp., Ceftriaxona)",
      "Broncodilatadores pediátricos (Salbutamol nebulização, Budesonida nebulização)",
      "Antieméticos pediátricos (Ondansetrona, Dimenidrinato)",
      "Suplementos (Vitamina D, Ferro, Polivitamínicos)",
      "Vacinas (Calendário Nacional de Vacinação)"
    ],
    prototypes: ["Paracetamol gotas", "Amoxicilina suspensão", "Salbutamol nebulização"]
  },
  geriatric: {
    name: "Geriatria",
    icon: "🧓",
    description: "Considerações especiais para idosos, critérios de Beers e desprescrição",
    subclasses: [
      "Critérios de Beers (Medicamentos potencialmente inapropriados)",
      "Critérios STOPP/START",
      "Desprescrição (Protocolos de retirada segura)",
      "Polifarmácia (Gestão de múltiplos medicamentos)",
      "Ajustes de dose para idosos",
      "Prevenção de quedas (Medicamentos de risco)"
    ],
    prototypes: ["Lista de Beers", "Protocolo STOPP/START"]
  }
};

// ─── Funções de Busca via OpenFDA ────────────────────────────────

export async function getFullDrugLabel(drugName: string): Promise<any> {
  try {
    const url = `${OPENFDA_BASE}/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(drugName)}"+openfda.brand_name:"${encodeURIComponent(drugName)}"&limit=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0] || null;
  } catch (err) {
    console.error("[PharmaBible] Full label error:", err);
    return null;
  }
}

export async function getDrugAdverseEventStats(drugName: string): Promise<any> {
  try {
    const url = `${OPENFDA_BASE}/drug/event.json?search=patient.drug.openfda.generic_name:"${encodeURIComponent(drugName)}"&count=patient.reaction.reactionmeddrapt.exact&limit=20`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("[PharmaBible] Adverse stats error:", err);
    return [];
  }
}

export async function getDrugRecalls(drugName: string): Promise<any[]> {
  try {
    const url = `${OPENFDA_BASE}/drug/enforcement.json?search=openfda.generic_name:"${encodeURIComponent(drugName)}"&limit=5`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((r: any) => ({
      recallNumber: r.recall_number,
      reason: r.reason_for_recall,
      status: r.status,
      classification: r.classification,
      date: r.recall_initiation_date,
      product: r.product_description,
    }));
  } catch (err) {
    console.error("[PharmaBible] Recalls error:", err);
    return [];
  }
}

export async function searchDailyMed(drugName: string): Promise<any[]> {
  try {
    const url = `${DAILYMED_BASE}/spls.json?drug_name=${encodeURIComponent(drugName)}&page=1&pagesize=5`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).map((r: any) => ({
      setId: r.setid,
      title: r.title,
      publishedDate: r.published_date,
    }));
  } catch (err) {
    console.error("[PharmaBible] DailyMed error:", err);
    return [];
  }
}

export async function getRxNormDrugInfo(drugName: string): Promise<any> {
  try {
    const url = `${RXNORM_BASE}/drugs.json?name=${encodeURIComponent(drugName)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const concepts = data.drugGroup?.conceptGroup || [];
    const results: any[] = [];
    for (const group of concepts) {
      if (group.conceptProperties) {
        for (const prop of group.conceptProperties) {
          results.push({
            rxcui: prop.rxcui,
            name: prop.name,
            synonym: prop.synonym,
            tty: prop.tty,
          });
        }
      }
    }
    return results.slice(0, 10);
  } catch (err) {
    console.error("[PharmaBible] RxNorm error:", err);
    return null;
  }
}

export async function getRxNormInteractions(rxcui: string): Promise<any[]> {
  try {
    const url = `${RXNORM_BASE}/interaction/interaction.json?rxcui=${rxcui}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const interactions: any[] = [];
    for (const group of data.interactionTypeGroup || []) {
      for (const type of group.interactionType || []) {
        for (const pair of type.interactionPair || []) {
          interactions.push({
            severity: pair.severity,
            description: pair.description,
            drugs: pair.interactionConcept?.map((c: any) => c.minConceptItem?.name) || [],
          });
        }
      }
    }
    return interactions.slice(0, 20);
  } catch (err) {
    console.error("[PharmaBible] RxNorm interactions error:", err);
    return [];
  }
}
