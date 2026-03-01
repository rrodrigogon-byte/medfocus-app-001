/**
 * MedFocus — Cached Medical APIs
 * Sprint 52: Wrapper com cache para todas as APIs médicas externas
 * Reduz latência, economiza quota e melhora resiliência
 */
import { apiCache, cacheKey, API_CACHE_TTLS } from './cacheService';
import { searchFDADrugs, getFDAAdverseEvents, type FDADrugResult } from './medicalApis';
import { searchPubMedAdvanced, getArticleByPmid, getRelatedArticles, type PubMedSearchResult, type PubMedArticleDetailed } from './pubmedService';

// ── PubMed Cached ──────────────────────────────────────────────

export async function cachedSearchPubMed(
  query: string,
  options: {
    maxResults?: number;
    page?: number;
    sort?: "relevance" | "date" | "pub_date";
    dateFrom?: string;
    dateTo?: string;
  } = {}
): Promise<PubMedSearchResult> {
  const key = cacheKey('pubmed:search', query, JSON.stringify(options));
  return apiCache.getOrFetch(key, () => searchPubMedAdvanced(query, options), API_CACHE_TTLS.PUBMED_SEARCH);
}

export async function cachedGetArticleByPmid(pmid: string): Promise<PubMedArticleDetailed | null> {
  const key = cacheKey('pubmed:article', pmid);
  return apiCache.getOrFetch(key, () => getArticleByPmid(pmid), API_CACHE_TTLS.PUBMED_ARTICLE);
}

export async function cachedGetRelatedArticles(pmid: string, maxResults = 5): Promise<PubMedArticleDetailed[]> {
  const key = cacheKey('pubmed:related', pmid, String(maxResults));
  return apiCache.getOrFetch(key, () => getRelatedArticles(pmid, maxResults), API_CACHE_TTLS.PUBMED_SEARCH);
}

// ── OpenFDA Cached ─────────────────────────────────────────────

export async function cachedSearchFDADrugs(query: string, limit = 10): Promise<FDADrugResult[]> {
  const key = cacheKey('openfda:drugs', query, String(limit));
  return apiCache.getOrFetch(key, () => searchFDADrugs(query, limit), API_CACHE_TTLS.OPENFDA_DRUGS);
}

export async function cachedGetFDAAdverseEvents(drugName: string, limit = 10) {
  const key = cacheKey('openfda:adverse', drugName, String(limit));
  return apiCache.getOrFetch(key, () => getFDAAdverseEvents(drugName, limit), API_CACHE_TTLS.OPENFDA_INTERACTIONS);
}

// ── CID-10 Cached (dados estáticos) ───────────────────────────

const CID10_DATA = new Map<string, { code: string; description: string }>();

export function cachedCID10Lookup(query: string): { code: string; description: string }[] {
  const key = cacheKey('cid10', query.toLowerCase());
  const cached = apiCache.get<{ code: string; description: string }[]>(key);
  if (cached) return cached;

  // CID-10 é estático, cache por 7 dias
  const results = Array.from(CID10_DATA.values()).filter(
    item => item.code.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 20);

  apiCache.set(key, results, API_CACHE_TTLS.CID10_LOOKUP);
  return results;
}

// ── Cache Metrics Endpoint ─────────────────────────────────────

export function getCacheMetrics() {
  return apiCache.getMetrics();
}

export function clearApiCache(namespace?: string) {
  if (namespace) {
    return apiCache.invalidateByPrefix(namespace);
  }
  apiCache.clear();
  return 0;
}
