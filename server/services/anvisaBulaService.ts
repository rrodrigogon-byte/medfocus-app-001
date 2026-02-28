/**
 * ANVISA Bula Service — Bíblia Farmacológica
 * 
 * Integrates with ANVISA Bulário Eletrônico for complete drug package insert data.
 * Uses the ANVISA consultation API at consultas.anvisa.gov.br for bula search.
 * Falls back to AI-generated pharmacological summaries when bula data is unavailable.
 * 
 * Data sources:
 * 1. ANVISA Bulário Eletrônico (web scraping / API proxy)
 * 2. CMED price table (already loaded by bularioService)
 * 3. OpenFDA API for international drug data
 * 4. AI-powered pharmacological summaries
 */

import fetch from 'node-fetch';

// ─── Types ───────────────────────────────────────────────────
export interface BulaResult {
  idProduto: string;
  nomeProduto: string;
  nomeEmpresa: string;
  expediente: string;
  dataBula: string;
  tipoBula: string; // 'PACIENTE' | 'PROFISSIONAL'
  urlBula?: string;
}

export interface DrugInfo {
  nome: string;
  principioAtivo: string;
  classeTerapeutica: string;
  laboratorio: string;
  registro: string;
  tarja: string;
  tipo: string;
  apresentacao: string;
  preco?: number;
  bulas: BulaResult[];
  farmacoInfo?: FarmacoInfo;
}

export interface FarmacoInfo {
  mecanismoAcao: string;
  farmacocinetica: string;
  indicacoes: string[];
  contraindicacoes: string[];
  efeitosAdversos: string[];
  interacoes: string[];
  posologia: string;
  populacoesEspeciais: string;
  classificacaoRisco: string; // A, B, C, D, X for pregnancy
}

// ─── Cache ───────────────────────────────────────────────────
const bulaCache = new Map<string, { data: BulaResult[]; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// ─── ANVISA Bulário Search ──────────────────────────────────
/**
 * Search ANVISA Bulário Eletrônico for drug package inserts.
 * Uses the public consultation endpoint.
 */
export async function searchBulasAnvisa(nomeProduto: string): Promise<BulaResult[]> {
  const cacheKey = nomeProduto.toLowerCase().trim();
  const cached = bulaCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    // ANVISA Bulário API endpoint
    const url = `https://consultas.anvisa.gov.br/api/consulta/bulario?count=20&filter%5BnomeProduto%5D=${encodeURIComponent(nomeProduto)}&page=1`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MedFocus-Academic/1.0',
        'Authorization': 'Guest',
      },
      timeout: 10000,
    });

    if (!response.ok) {
      console.log(`[ANVISA Bula] API returned ${response.status} for "${nomeProduto}"`);
      return [];
    }

    const data = await response.json() as any;
    const results: BulaResult[] = [];

    if (data?.content && Array.isArray(data.content)) {
      for (const item of data.content) {
        results.push({
          idProduto: item.idProduto || '',
          nomeProduto: item.nomeProduto || nomeProduto,
          nomeEmpresa: item.nomeEmpresa || '',
          expediente: item.expediente || '',
          dataBula: item.dataPublicacao || '',
          tipoBula: item.tipoBula || 'PACIENTE',
          urlBula: item.linkBula || undefined,
        });
      }
    }

    bulaCache.set(cacheKey, { data: results, timestamp: Date.now() });
    console.log(`[ANVISA Bula] Found ${results.length} bulas for "${nomeProduto}"`);
    return results;
  } catch (err: any) {
    console.error(`[ANVISA Bula] Error searching "${nomeProduto}":`, err.message);
    return [];
  }
}

// ─── OpenFDA Drug Data ──────────────────────────────────────
/**
 * Search OpenFDA for international drug label data.
 * Useful for drugs with international names.
 */
export async function searchOpenFDA(drugName: string): Promise<any | null> {
  try {
    const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(drugName)}"&limit=1`;
    const response = await fetch(url, { timeout: 8000 });
    
    if (!response.ok) return null;
    
    const data = await response.json() as any;
    if (data?.results?.[0]) {
      const result = data.results[0];
      return {
        indicationsAndUsage: result.indications_and_usage?.[0] || '',
        contraindications: result.contraindications?.[0] || '',
        warnings: result.warnings?.[0] || '',
        adverseReactions: result.adverse_reactions?.[0] || '',
        drugInteractions: result.drug_interactions?.[0] || '',
        dosageAndAdministration: result.dosage_and_administration?.[0] || '',
        mechanismOfAction: result.mechanism_of_action?.[0] || result.clinical_pharmacology?.[0] || '',
        pharmacokinetics: result.clinical_pharmacology?.[0] || '',
        pregnancyCategory: result.pregnancy?.[0] || '',
        nursingMothers: result.nursing_mothers?.[0] || '',
        pediatricUse: result.pediatric_use?.[0] || '',
        geriatricUse: result.geriatric_use?.[0] || '',
      };
    }
    return null;
  } catch {
    return null;
  }
}

// ─── Pharmacological Database ───────────────────────────────
/**
 * Built-in pharmacological reference for common drugs.
 * Covers the most prescribed medications in Brazil.
 */
const PHARMA_DB: Record<string, FarmacoInfo> = {
  'dipirona': {
    mecanismoAcao: 'Inibição da ciclooxigenase (COX) central e periférica, com ação predominante no SNC. Também atua na via óxido nítrico-GMPc e no sistema canabinoide endógeno.',
    farmacocinetica: 'Absorção oral rápida (Tmax 1-2h). Metabolização hepática em metabólitos ativos (4-MAA, 4-AA). Meia-vida 2-5h. Excreção renal.',
    indicacoes: ['Dor leve a moderada', 'Febre', 'Cólicas'],
    contraindicacoes: ['Hipersensibilidade', 'Discrasias sanguíneas', 'Porfiria hepática', 'Deficiência de G6PD', 'Gestação (3° trimestre)'],
    efeitosAdversos: ['Agranulocitose (rara)', 'Reações anafiláticas', 'Hipotensão (IV)', 'Rash cutâneo'],
    interacoes: ['Metotrexato (↑toxicidade)', 'Ciclosporina (↓níveis)', 'Anticoagulantes orais (↑efeito)'],
    posologia: 'Adultos: 500-1000mg VO/IV a cada 6h. Máx: 4g/dia.',
    populacoesEspeciais: 'Gestantes: categoria C. Lactantes: excretada no leite. Idosos: ajuste de dose. Crianças: 10-25mg/kg/dose.',
    classificacaoRisco: 'C',
  },
  'amoxicilina': {
    mecanismoAcao: 'Antibiótico beta-lactâmico. Inibe a síntese da parede celular bacteriana ao se ligar às PBPs (proteínas ligadoras de penicilina), impedindo a transpeptidação.',
    farmacocinetica: 'Absorção oral 75-90%. Tmax 1-2h. Distribuição ampla, incluindo ouvido médio, seios paranasais, pulmões. Meia-vida 1-1,5h. Excreção renal (60% inalterada).',
    indicacoes: ['Infecções do trato respiratório superior e inferior', 'Otite média', 'Sinusite', 'ITU não complicada', 'Erradicação de H. pylori (esquema tríplice)', 'Profilaxia de endocardite'],
    contraindicacoes: ['Hipersensibilidade a penicilinas', 'Mononucleose infecciosa (rash)', 'Histórico de icterícia colestática por amoxicilina'],
    efeitosAdversos: ['Diarreia (5-10%)', 'Náusea', 'Rash cutâneo (3-5%)', 'Candidíase', 'Colite pseudomembranosa (rara)'],
    interacoes: ['Probenecida (↑níveis)', 'Alopurinol (↑rash)', 'Metotrexato (↑toxicidade)', 'Anticoncepcionais orais (↓eficácia — controverso)'],
    posologia: 'Adultos: 500mg VO 8/8h ou 875mg 12/12h. Crianças: 25-50mg/kg/dia divididos em 8/8h.',
    populacoesEspeciais: 'Gestantes: categoria B (segura). Lactantes: excretada em pequenas quantidades. IRC: ajuste se ClCr < 30mL/min.',
    classificacaoRisco: 'B',
  },
  'losartana': {
    mecanismoAcao: 'Antagonista do receptor AT1 da angiotensina II (BRA). Bloqueia a vasoconstrição, secreção de aldosterona e remodelamento cardiovascular mediados pela angiotensina II.',
    farmacocinetica: 'Absorção oral ~33%. Metabolismo hepático via CYP2C9 e CYP3A4 em metabólito ativo (EXP3174, 10-40x mais potente). Meia-vida: losartana 2h, EXP3174 6-9h. Excreção biliar (60%) e renal (35%).',
    indicacoes: ['Hipertensão arterial', 'Nefropatia diabética (DM2)', 'Insuficiência cardíaca (quando IECA não tolerado)', 'Redução de risco de AVC em hipertensos com HVE'],
    contraindicacoes: ['Gestação', 'Hipersensibilidade', 'Uso concomitante com alisquireno em DM ou IRC'],
    efeitosAdversos: ['Tontura (3%)', 'Hipotensão', 'Hipercalemia', 'Elevação de creatinina', 'Angioedema (raro)'],
    interacoes: ['Suplementos de potássio (↑hipercalemia)', 'AINEs (↓efeito anti-hipertensivo)', 'Lítio (↑níveis)', 'Rifampicina (↓níveis de losartana)'],
    posologia: 'Adultos: 50-100mg VO 1x/dia. Pode iniciar com 25mg se depleção volêmica.',
    populacoesEspeciais: 'Gestantes: CONTRAINDICADO (categoria D). Lactantes: não recomendado. Idosos: não necessita ajuste. Insuficiência hepática: iniciar com 25mg.',
    classificacaoRisco: 'D',
  },
  'metformina': {
    mecanismoAcao: 'Biguanida. Reduz a produção hepática de glicose (inibição da gliconeogênese), aumenta a sensibilidade periférica à insulina e reduz a absorção intestinal de glicose. Ativa a AMPK.',
    farmacocinetica: 'Absorção oral 50-60%. Não se liga a proteínas plasmáticas. Não é metabolizada. Meia-vida 4-8h. Excreção renal (90% em 12h).',
    indicacoes: ['Diabetes mellitus tipo 2 (1ª linha)', 'Pré-diabetes', 'SOP (off-label)', 'Prevenção de DM2 em alto risco'],
    contraindicacoes: ['TFG < 30 mL/min', 'Acidose metabólica aguda', 'Insuficiência hepática grave', 'Uso de contraste iodado (suspender 48h)', 'Alcoolismo'],
    efeitosAdversos: ['Diarreia (10-30%)', 'Náusea', 'Dor abdominal', 'Deficiência de B12 (uso crônico)', 'Acidose láctica (rara, grave)'],
    interacoes: ['Álcool (↑risco acidose láctica)', 'Contraste iodado (↑risco acidose)', 'Cimetidina (↑níveis)', 'Diuréticos (↑risco desidratação)'],
    posologia: 'Iniciar 500mg 1-2x/dia com refeições. Titular a cada 1-2 semanas. Máx: 2550mg/dia (850mg 3x/dia).',
    populacoesEspeciais: 'Gestantes: categoria B (pode ser usada). Lactantes: excretada em pequenas quantidades. Idosos: monitorar função renal. IRC: ajuste se TFG 30-45 mL/min.',
    classificacaoRisco: 'B',
  },
  'omeprazol': {
    mecanismoAcao: 'Inibidor da bomba de prótons (IBP). Liga-se irreversivelmente à H+/K+-ATPase na célula parietal gástrica, bloqueando a secreção ácida basal e estimulada.',
    farmacocinetica: 'Absorção oral com revestimento entérico. Biodisponibilidade 30-40% (aumenta com doses repetidas). Metabolismo hepático via CYP2C19 e CYP3A4. Meia-vida 0,5-1h, mas efeito dura 24h (ligação irreversível).',
    indicacoes: ['DRGE', 'Úlcera péptica', 'Erradicação de H. pylori (esquema tríplice)', 'Síndrome de Zollinger-Ellison', 'Profilaxia de úlcera por AINEs', 'Dispepsia funcional'],
    contraindicacoes: ['Hipersensibilidade a IBPs', 'Uso concomitante com rilpivirina, nelfinavir, atazanavir'],
    efeitosAdversos: ['Cefaleia (3-7%)', 'Diarreia', 'Náusea', 'Deficiência de B12 e magnésio (uso crônico)', 'Fraturas osteoporóticas (uso prolongado)', 'Nefrite intersticial (rara)'],
    interacoes: ['Clopidogrel (↓ativação — controverso)', 'Metotrexato (↑níveis)', 'Diazepam (↑níveis)', 'Fenitoína (↑níveis)', 'Tacrolimus (↑níveis)'],
    posologia: 'Adultos: 20-40mg VO 1x/dia, 30min antes do café. Úlcera: 4-8 semanas. DRGE: 4-8 semanas.',
    populacoesEspeciais: 'Gestantes: categoria C. Lactantes: excretado no leite. Idosos: não necessita ajuste. Insuficiência hepática: máx 20mg/dia em grave.',
    classificacaoRisco: 'C',
  },
  'enalapril': {
    mecanismoAcao: 'Inibidor da ECA (enzima conversora de angiotensina). Pró-fármaco convertido em enalaprilato. Reduz a conversão de angiotensina I em angiotensina II, diminuindo vasoconstrição e secreção de aldosterona. Também inibe a degradação de bradicinina.',
    farmacocinetica: 'Absorção oral 60%. Conversão hepática em enalaprilato (metabólito ativo). Tmax enalaprilato: 3-4h. Meia-vida 11h. Excreção renal.',
    indicacoes: ['Hipertensão arterial', 'Insuficiência cardíaca', 'Disfunção ventricular esquerda assintomática', 'Nefropatia diabética'],
    contraindicacoes: ['Gestação', 'Angioedema prévio por IECA', 'Estenose bilateral de artéria renal', 'Uso concomitante com sacubitril'],
    efeitosAdversos: ['Tosse seca (5-20%)', 'Hipotensão (1ª dose)', 'Hipercalemia', 'Angioedema (0,1-0,5%)', 'Insuficiência renal aguda', 'Disgeusia'],
    interacoes: ['Suplementos de potássio (↑hipercalemia)', 'AINEs (↓efeito, ↑nefrotoxicidade)', 'Lítio (↑níveis)', 'Diuréticos (↑hipotensão)'],
    posologia: 'HAS: 5-40mg/dia VO em 1-2 doses. IC: iniciar 2,5mg 2x/dia, titular até 20mg 2x/dia.',
    populacoesEspeciais: 'Gestantes: CONTRAINDICADO (categoria D). Lactantes: excretado no leite. Idosos: iniciar com dose baixa. IRC: ajuste se ClCr < 30mL/min.',
    classificacaoRisco: 'D',
  },
  'sinvastatina': {
    mecanismoAcao: 'Inibidor da HMG-CoA redutase (estatina). Pró-fármaco convertido em forma ativa. Reduz a síntese hepática de colesterol, aumentando a expressão de receptores de LDL e reduzindo LDL-c plasmático.',
    farmacocinetica: 'Absorção oral, extenso metabolismo de 1ª passagem (biodisponibilidade <5%). Metabolismo hepático via CYP3A4. Meia-vida 1-3h. Excreção biliar (60%) e renal (13%).',
    indicacoes: ['Hipercolesterolemia', 'Dislipidemia mista', 'Prevenção cardiovascular primária e secundária', 'Hipercolesterolemia familiar heterozigótica'],
    contraindicacoes: ['Doença hepática ativa', 'Gestação e lactação', 'Uso concomitante com inibidores potentes de CYP3A4', 'Miopatia'],
    efeitosAdversos: ['Mialgia (5-10%)', 'Elevação de transaminases', 'Rabdomiólise (rara)', 'Diabetes (↑risco)', 'Cefaleia', 'Distúrbios GI'],
    interacoes: ['Fibratos (↑risco miopatia)', 'Ciclosporina, eritromicina, cetoconazol (↑níveis — EVITAR)', 'Amiodarona (limitar a 20mg)', 'Varfarina (↑INR)', 'Suco de grapefruit (↑níveis)'],
    posologia: 'Adultos: 20-40mg VO 1x/dia à noite. Máx: 80mg (apenas se já em uso). Iniciar com 10-20mg.',
    populacoesEspeciais: 'Gestantes: CONTRAINDICADO (categoria X). Lactantes: contraindicado. Idosos: monitorar CPK. IRC: iniciar com 5mg se grave.',
    classificacaoRisco: 'X',
  },
  'ibuprofeno': {
    mecanismoAcao: 'AINE não seletivo. Inibe a COX-1 e COX-2, reduzindo a síntese de prostaglandinas, tromboxano A2 e prostaciclina. Efeito anti-inflamatório, analgésico e antipirético.',
    farmacocinetica: 'Absorção oral rápida (Tmax 1-2h). Ligação proteica >99%. Metabolismo hepático via CYP2C9. Meia-vida 2h. Excreção renal (90% como metabólitos).',
    indicacoes: ['Dor leve a moderada', 'Febre', 'Artrite reumatoide', 'Osteoartrite', 'Dismenorreia', 'Cefaleia tensional'],
    contraindicacoes: ['Úlcera péptica ativa', 'IRC grave', 'IC grave', 'Gestação (3° trimestre)', 'Pós-operatório de cirurgia cardíaca (CABG)', 'Hipersensibilidade a AINEs'],
    efeitosAdversos: ['Dispepsia (10-15%)', 'Úlcera GI', 'Sangramento GI', 'Retenção hídrica', 'HAS', 'IRA', 'Eventos cardiovasculares (uso prolongado)'],
    interacoes: ['Anticoagulantes (↑sangramento)', 'IECA/BRA (↓efeito, ↑nefrotoxicidade)', 'Lítio (↑níveis)', 'Metotrexato (↑toxicidade)', 'AAS (↓efeito antiagregante)'],
    posologia: 'Adultos: 200-400mg VO 6-8h. Anti-inflamatório: 400-800mg 6-8h. Máx: 3200mg/dia.',
    populacoesEspeciais: 'Gestantes: categoria C (1°-2° tri), D (3° tri — EVITAR). Lactantes: compatível em doses baixas. Idosos: ↑risco GI e renal. Crianças >6m: 5-10mg/kg/dose.',
    classificacaoRisco: 'C',
  },
};

/**
 * Get pharmacological info for a drug from the built-in database.
 */
export function getFarmacoInfo(principioAtivo: string): FarmacoInfo | null {
  const key = principioAtivo.toLowerCase().trim();
  
  // Direct match
  if (PHARMA_DB[key]) return PHARMA_DB[key];
  
  // Partial match
  for (const [dbKey, info] of Object.entries(PHARMA_DB)) {
    if (key.includes(dbKey) || dbKey.includes(key)) {
      return info;
    }
  }
  
  return null;
}

/**
 * Get all available drugs in the pharmacological database.
 */
export function getAvailableDrugs(): string[] {
  return Object.keys(PHARMA_DB);
}

/**
 * Get comprehensive drug information combining all sources.
 */
export async function getDrugInfo(nomeProduto: string): Promise<{
  bulas: BulaResult[];
  farmacoInfo: FarmacoInfo | null;
  openFdaData: any | null;
}> {
  // Parallel fetch from all sources
  const [bulas, openFdaData] = await Promise.all([
    searchBulasAnvisa(nomeProduto),
    searchOpenFDA(nomeProduto),
  ]);

  const farmacoInfo = getFarmacoInfo(nomeProduto);

  return { bulas, farmacoInfo, openFdaData };
}
