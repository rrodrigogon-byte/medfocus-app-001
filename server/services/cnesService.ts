/**
 * CNES Service — Cadastro Nacional de Estabelecimentos de Saúde
 * 
 * Integrates with the official DataSUS Open Data API to provide
 * real-time access to 300,000+ health establishments across Brazil.
 * 
 * API Base: https://apidadosabertos.saude.gov.br
 * Endpoints:
 *   GET /cnes/estabelecimentos — All establishments (paginated, max 20/page)
 *   GET /cnes/estabelecimentos/{codigo_cnes} — Single establishment by CNES code
 *   GET /cnes/tipounidades — Unit types
 *   GET /assistencia-a-saude/hospitais-e-leitos — Hospitals with bed data
 * 
 * Strategy: Server-side proxy with in-memory cache (TTL-based) to avoid
 * hitting the API rate limits and provide fast search to frontend.
 */

import { MUNICIPIO_NAMES } from './municipioNames';

const API_BASE = 'https://apidadosabertos.saude.gov.br';
const MAX_PER_PAGE = 20; // API limit

// ─── Types ───────────────────────────────────────────────────

export interface CnesEstabelecimento {
  codigo_cnes: number;
  nome_razao_social: string;
  nome_fantasia: string;
  codigo_tipo_unidade: number;
  descricao_tipo_unidade?: string;
  codigo_uf: number;
  codigo_municipio: number;
  nome_municipio?: string;
  sigla_uf?: string;
  endereco_estabelecimento: string;
  numero_estabelecimento: string;
  bairro_estabelecimento: string;
  codigo_cep_estabelecimento: string;
  numero_telefone_estabelecimento: string;
  endereco_email_estabelecimento: string;
  latitude_estabelecimento_decimo_grau: number | null;
  longitude_estabelecimento_decimo_grau: number | null;
  descricao_turno_atendimento: string;
  estabelecimento_faz_atendimento_ambulatorial_sus: string;
  estabelecimento_possui_centro_cirurgico: number;
  estabelecimento_possui_centro_obstetrico: number;
  estabelecimento_possui_centro_neonatal: number;
  estabelecimento_possui_atendimento_hospitalar: number;
  estabelecimento_possui_servico_apoio: number;
  estabelecimento_possui_atendimento_ambulatorial: number;
  descricao_esfera_administrativa: string;
  descricao_natureza_juridica_estabelecimento: string;
  tipo_gestao: string;
  data_atualizacao: string;
}

export interface HospitalLeito {
  nome_do_hospital: string;
  nome_da_razao_social_do_hospital: string;
  unidade_da_federacao_onde_fica_o_hospital: string;
  nome_do_municipio_onde_fica_o_hospital: string;
  descricao_do_tipo_da_unidade: string;
  descricao_da_natureza_juridica_do_hosptial: string;
  enderco_do_hospital: string;
  numero_do_endereco_do_hospital: string;
  nome_do_bairro_do_endereco_do_hosptial: string;
  numero_do_cep_do_hospital: string;
  quantidade_total_de_leitos_do_hosptial: number;
  quantidade_total_de_leitos_sus_do_hosptial: number;
  quantidade_de_leitos_de_uti_do_hosptial: number;
  quantidade_de_leitos_de_uti_sus_do_hosptial: number;
  codigo_ibge_do_municipio: string | null;
}

export interface TipoUnidade {
  codigo_tipo_unidade: number;
  descricao_tipo_unidade: string;
}

// ─── UF Code Mapping ─────────────────────────────────────────

const UF_CODES: Record<string, number> = {
  AC: 12, AL: 27, AM: 13, AP: 16, BA: 29, CE: 23, DF: 53,
  ES: 32, GO: 52, MA: 21, MG: 31, MS: 50, MT: 51, PA: 15,
  PB: 25, PE: 26, PI: 22, PR: 41, RJ: 33, RN: 24, RO: 11,
  RR: 14, RS: 43, SC: 42, SE: 28, SP: 35, TO: 17,
};

const CODE_TO_UF: Record<number, string> = {};
for (const [uf, code] of Object.entries(UF_CODES)) {
  CODE_TO_UF[code] = uf;
}

// Unit type codes relevant for medical facilities
const RELEVANT_UNIT_TYPES: Record<number, string> = {
  1: 'Posto de Saúde',
  2: 'Centro de Saúde/UBS',
  4: 'Policlínica',
  5: 'Hospital Geral',
  7: 'Hospital Especializado',
  15: 'Unidade Mista',
  20: 'Pronto-Socorro Geral',
  21: 'Pronto-Socorro Especializado',
  22: 'Consultório Isolado',
  36: 'Clínica/Centro de Especialidade',
  39: 'SADT (Diagnose e Terapia)',
  43: 'Farmácia',
  50: 'Vigilância em Saúde',
  61: 'Centro de Parto Normal',
  62: 'Hospital/Dia',
  67: 'LACEN',
  69: 'Centro de Hemoterapia/Hematologia',
  70: 'CAPS',
  71: 'NASF',
  72: 'Saúde Indígena',
  73: 'Pronto Atendimento',
  74: 'Polo Academia da Saúde',
  77: 'Home Care',
  78: 'Atenção em Regime Residencial',
  79: 'Oficina Ortopédica',
  85: 'Centro de Imunização',
};

// Types we show in the hospital finder (hospitals, clinics, UPAs, etc.)
const HOSPITAL_FINDER_TYPES = [1, 2, 4, 5, 7, 15, 20, 21, 36, 39, 61, 62, 69, 70, 73, 85];

// ─── Cache ───────────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
  // Limit cache size
  if (cache.size > 500) {
    const oldest = Array.from(cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .slice(0, 100);
    for (const [k] of oldest) cache.delete(k);
  }
}

// ─── API Fetch Helper ────────────────────────────────────────

async function fetchAPI<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${API_BASE}${endpoint}`);
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '') {
      url.searchParams.set(key, String(val));
    }
  }

  const cacheKey = url.toString();
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json() as T;
    setCache(cacheKey, data);
    return data;
  } catch (err: any) {
    console.error(`[CNES] API error for ${endpoint}:`, err.message);
    throw err;
  }
}

// ─── Public API Functions ────────────────────────────────────

/**
 * Get unit types from CNES
 */
export async function getTipoUnidades(): Promise<TipoUnidade[]> {
  const data = await fetchAPI<{ tipo_unidade: TipoUnidade[] }>('/cnes/tipounidades');
  return data.tipo_unidade || [];
}

/**
 * Search establishments with filters.
 * The DataSUS API has a max of 20 per page, so we fetch multiple pages
 * when needed (up to a reasonable limit).
 */
export async function searchEstabelecimentos(params: {
  uf?: string;
  municipio?: number;
  tipoUnidade?: number;
  status?: number;
  limit?: number;
  offset?: number;
}): Promise<{ estabelecimentos: CnesEstabelecimento[]; total_estimado: number }> {
  const apiParams: Record<string, string | number> = {
    status: params.status ?? 1,
    limit: Math.min(params.limit || 20, 20),
    offset: params.offset || 0,
  };

  if (params.uf && UF_CODES[params.uf]) {
    apiParams.codigo_uf = UF_CODES[params.uf];
  }
  if (params.municipio) {
    apiParams.codigo_municipio = params.municipio;
  }
  if (params.tipoUnidade) {
    apiParams.codigo_tipo_unidade = params.tipoUnidade;
  }

  const data = await fetchAPI<{ estabelecimentos: CnesEstabelecimento[] }>(
    '/cnes/estabelecimentos',
    apiParams
  );

  const estabelecimentos = (data.estabelecimentos || []).map(e => ({
    ...e,
    sigla_uf: CODE_TO_UF[e.codigo_uf] || '',
    nome_municipio: MUNICIPIO_NAMES[e.codigo_municipio] || '',
    descricao_tipo_unidade: RELEVANT_UNIT_TYPES[e.codigo_tipo_unidade] || `Tipo ${e.codigo_tipo_unidade}`,
  }));

  return {
    estabelecimentos,
    total_estimado: estabelecimentos.length === 20 ? -1 : estabelecimentos.length, // -1 means "more available"
  };
}

/**
 * Fetch multiple pages of establishments for a given UF + type.
 * Used for building a comprehensive list for a state.
 * Max 5 pages (100 results) to avoid excessive API calls.
 */
export async function fetchEstabelecimentosPaginados(params: {
  uf?: string;
  municipio?: number;
  tipoUnidade?: number;
  maxPages?: number;
}): Promise<CnesEstabelecimento[]> {
  const maxPages = Math.min(params.maxPages || 5, 20);
  const allResults: CnesEstabelecimento[] = [];

  for (let page = 0; page < maxPages; page++) {
    try {
      const result = await searchEstabelecimentos({
        ...params,
        status: 1,
        limit: 20,
        offset: page * 20,
      });

      allResults.push(...result.estabelecimentos);

      // If we got less than 20, we've reached the end
      if (result.estabelecimentos.length < 20) break;
    } catch (err) {
      console.error(`[CNES] Error fetching page ${page}:`, err);
      break;
    }
  }

  return allResults;
}

/**
 * Get a single establishment by CNES code
 */
export async function getEstabelecimentoByCnes(codigoCnes: number): Promise<CnesEstabelecimento | null> {
  try {
    const data = await fetchAPI<CnesEstabelecimento>(
      `/cnes/estabelecimentos/${codigoCnes}`
    );
    return {
      ...data,
      sigla_uf: CODE_TO_UF[data.codigo_uf] || '',
      nome_municipio: MUNICIPIO_NAMES[data.codigo_municipio] || '',
      descricao_tipo_unidade: RELEVANT_UNIT_TYPES[data.codigo_tipo_unidade] || `Tipo ${data.codigo_tipo_unidade}`,
    };
  } catch {
    return null;
  }
}

/**
 * Get hospitals with bed data from the dedicated endpoint.
 * This endpoint provides richer data for hospitals specifically.
 */
export async function getHospitaisComLeitos(params: {
  limit?: number;
  offset?: number;
}): Promise<{ hospitais: HospitalLeito[]; total_estimado: number }> {
  const data = await fetchAPI<{ hospitais_leitos: HospitalLeito[] }>(
    '/assistencia-a-saude/hospitais-e-leitos',
    {
      limit: Math.min(params.limit || 20, 20),
      offset: params.offset || 0,
    }
  );

  return {
    hospitais: data.hospitais_leitos || [],
    total_estimado: (data.hospitais_leitos || []).length === 20 ? -1 : (data.hospitais_leitos || []).length,
  };
}

/**
 * Get CNES statistics (cached heavily)
 */
export function getCnesStats() {
  return {
    totalEstabelecimentos: 384_000, // Approximate from CNES
    totalHospitais: 7_500,
    totalUBS: 42_000,
    totalUPAs: 600,
    totalClinicas: 85_000,
    totalLaboratorios: 22_000,
    fonte: 'CNES/DataSUS - Ministério da Saúde',
    ultimaAtualizacao: new Date().toISOString().split('T')[0],
    apiUrl: API_BASE,
  };
}

/**
 * Get relevant unit type codes for the hospital finder
 */
export function getRelevantUnitTypes() {
  return HOSPITAL_FINDER_TYPES.map(code => ({
    codigo: code,
    descricao: RELEVANT_UNIT_TYPES[code] || `Tipo ${code}`,
  }));
}

/**
 * Get UF codes mapping
 */
export function getUFCodes() {
  return UF_CODES;
}
