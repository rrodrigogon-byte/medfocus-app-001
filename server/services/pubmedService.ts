/**
 * PubMed / NCBI Entrez API - Advanced Integration
 * Provides comprehensive access to millions of biomedical citations,
 * abstracts, and full-text articles for medical education and research.
 * 
 * API Documentation: https://www.ncbi.nlm.nih.gov/books/NBK25501/
 * Free API - No key required (but recommended for higher rate limits)
 */

const PUBMED_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const PUBMED_API_KEY = process.env.NCBI_API_KEY || ""; // Optional: increases rate limit from 3/s to 10/s

function buildUrl(endpoint: string, params: Record<string, string | number>): string {
  const url = new URL(`${PUBMED_BASE}/${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  if (PUBMED_API_KEY) {
    url.searchParams.set("api_key", PUBMED_API_KEY);
  }
  return url.toString();
}

// ─── Interfaces ──────────────────────────────────────────────

export interface PubMedArticleDetailed {
  pmid: string;
  title: string;
  authors: { lastName: string; foreName: string; affiliation?: string }[];
  journal: string;
  journalAbbrev: string;
  pubDate: string;
  doi: string;
  pmcId?: string;
  abstractText: string;
  abstractSections?: { label: string; text: string }[];
  keywords: string[];
  meshTerms: string[];
  publicationType: string[];
  language: string;
  fullTextUrl?: string;
  citedByCount?: number;
}

export interface PubMedSearchResult {
  articles: PubMedArticleDetailed[];
  totalCount: number;
  query: string;
  translatedQuery?: string;
  page: number;
  pageSize: number;
}

export interface PubMedTrendingTopic {
  term: string;
  count: number;
  recentArticles: { pmid: string; title: string }[];
}

export interface PubMedCitation {
  pmid: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  doi: string;
  citationFormat: {
    apa: string;
    vancouver: string;
    abnt: string;
  };
}

// ─── Core Search ─────────────────────────────────────────────

export async function searchPubMedAdvanced(
  query: string,
  options: {
    maxResults?: number;
    page?: number;
    sort?: "relevance" | "date" | "pub_date";
    dateFrom?: string; // YYYY/MM/DD
    dateTo?: string;
    articleTypes?: string[];
    language?: string;
  } = {}
): Promise<PubMedSearchResult> {
  const {
    maxResults = 10,
    page = 1,
    sort = "relevance",
    dateFrom,
    dateTo,
    articleTypes,
    language,
  } = options;

  try {
    // Build enhanced query with filters
    let enhancedQuery = query;
    if (articleTypes && articleTypes.length > 0) {
      const typeFilter = articleTypes.map(t => `"${t}"[pt]`).join(" OR ");
      enhancedQuery += ` AND (${typeFilter})`;
    }
    if (language) {
      enhancedQuery += ` AND "${language}"[la]`;
    }

    const retstart = (page - 1) * maxResults;
    const searchParams: Record<string, string | number> = {
      db: "pubmed",
      term: enhancedQuery,
      retmax: maxResults,
      retstart,
      retmode: "json",
      sort: sort === "date" ? "pub_date" : sort,
      usehistory: "y",
    };
    if (dateFrom) searchParams.mindate = dateFrom;
    if (dateTo) searchParams.maxdate = dateTo;
    if (dateFrom || dateTo) searchParams.datetype = "pdat";

    // Step 1: Search for PMIDs
    const searchUrl = buildUrl("esearch.fcgi", searchParams);
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) {
      console.error("[PubMed] Search failed:", searchRes.status);
      return { articles: [], totalCount: 0, query, page, pageSize: maxResults };
    }

    const searchData = await searchRes.json();
    const ids: string[] = searchData.esearchresult?.idlist || [];
    const totalCount = parseInt(searchData.esearchresult?.count || "0", 10);
    const translatedQuery = searchData.esearchresult?.querytranslation;

    if (ids.length === 0) {
      return { articles: [], totalCount, query, translatedQuery, page, pageSize: maxResults };
    }

    // Step 2: Fetch detailed article data
    const articles = await fetchArticleDetails(ids);

    return {
      articles,
      totalCount,
      query,
      translatedQuery,
      page,
      pageSize: maxResults,
    };
  } catch (err) {
    console.error("[PubMed] Advanced search error:", err);
    return { articles: [], totalCount: 0, query, page, pageSize: maxResults };
  }
}

// ─── Fetch Article Details ───────────────────────────────────

async function fetchArticleDetails(pmids: string[]): Promise<PubMedArticleDetailed[]> {
  try {
    const fetchUrl = buildUrl("efetch.fcgi", {
      db: "pubmed",
      id: pmids.join(","),
      rettype: "xml",
      retmode: "xml",
    });

    const fetchRes = await fetch(fetchUrl);
    if (!fetchRes.ok) return [];
    const xmlText = await fetchRes.text();

    return parseArticlesXml(xmlText);
  } catch (err) {
    console.error("[PubMed] Fetch details error:", err);
    return [];
  }
}

function parseArticlesXml(xmlText: string): PubMedArticleDetailed[] {
  const articles: PubMedArticleDetailed[] = [];
  const articleMatches = xmlText.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || [];

  for (const articleXml of articleMatches) {
    try {
      const pmid = articleXml.match(/<PMID[^>]*>(\d+)<\/PMID>/)?.[1] || "";
      const title = articleXml.match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/)?.[1]?.replace(/<[^>]+>/g, "") || "";
      const journal = articleXml.match(/<Title>([\s\S]*?)<\/Title>/)?.[1] || "";
      const journalAbbrev = articleXml.match(/<ISOAbbreviation>([\s\S]*?)<\/ISOAbbreviation>/)?.[1] || "";
      const year = articleXml.match(/<Year>(\d{4})<\/Year>/)?.[1] || "";
      const month = articleXml.match(/<Month>(\w+)<\/Month>/)?.[1] || "";
      const day = articleXml.match(/<Day>(\d+)<\/Day>/)?.[1] || "";
      const doi = articleXml.match(/<ArticleId IdType="doi">([\s\S]*?)<\/ArticleId>/)?.[1] || "";
      const pmcId = articleXml.match(/<ArticleId IdType="pmc">([\s\S]*?)<\/ArticleId>/)?.[1] || undefined;
      const language = articleXml.match(/<Language>(\w+)<\/Language>/)?.[1] || "eng";

      // Parse structured abstract
      const abstractSections: { label: string; text: string }[] = [];
      const abstractMatches = articleXml.match(/<AbstractText[^>]*>[\s\S]*?<\/AbstractText>/g) || [];
      for (const abs of abstractMatches) {
        const label = abs.match(/Label="([^"]+)"/)?.[1] || "Abstract";
        const text = abs.replace(/<[^>]+>/g, "").trim();
        abstractSections.push({ label, text });
      }
      const abstractText = abstractSections.map(s => s.text).join(" ");

      // Parse authors with affiliations
      const authorMatches = articleXml.match(/<Author[^>]*>[\s\S]*?<\/Author>/g) || [];
      const authors = authorMatches.map(a => {
        const lastName = a.match(/<LastName>([\s\S]*?)<\/LastName>/)?.[1] || "";
        const foreName = a.match(/<ForeName>([\s\S]*?)<\/ForeName>/)?.[1] || "";
        const affiliation = a.match(/<Affiliation>([\s\S]*?)<\/Affiliation>/)?.[1] || undefined;
        return { lastName, foreName, affiliation };
      }).filter(a => a.lastName);

      // Parse keywords
      const keywordMatches = articleXml.match(/<Keyword[^>]*>([\s\S]*?)<\/Keyword>/g) || [];
      const keywords = keywordMatches.map(k => k.replace(/<[^>]+>/g, "").trim()).filter(Boolean);

      // Parse MeSH terms
      const meshMatches = articleXml.match(/<DescriptorName[^>]*>([\s\S]*?)<\/DescriptorName>/g) || [];
      const meshTerms = meshMatches.map(m => m.replace(/<[^>]+>/g, "").trim()).filter(Boolean);

      // Parse publication types
      const pubTypeMatches = articleXml.match(/<PublicationType[^>]*>([\s\S]*?)<\/PublicationType>/g) || [];
      const publicationType = pubTypeMatches.map(p => p.replace(/<[^>]+>/g, "").trim()).filter(Boolean);

      // Full text URL
      const fullTextUrl = pmcId
        ? `https://www.ncbi.nlm.nih.gov/pmc/articles/${pmcId}/`
        : doi
        ? `https://doi.org/${doi}`
        : undefined;

      articles.push({
        pmid,
        title,
        authors,
        journal,
        journalAbbrev,
        pubDate: [year, month, day].filter(Boolean).join(" "),
        doi,
        pmcId,
        abstractText,
        abstractSections: abstractSections.length > 1 ? abstractSections : undefined,
        keywords,
        meshTerms,
        publicationType,
        language,
        fullTextUrl,
      });
    } catch (parseErr) {
      console.error("[PubMed] Article parse error:", parseErr);
    }
  }

  return articles;
}

// ─── Get Article by PMID ─────────────────────────────────────

export async function getArticleByPmid(pmid: string): Promise<PubMedArticleDetailed | null> {
  const articles = await fetchArticleDetails([pmid]);
  return articles[0] || null;
}

// ─── Related Articles ────────────────────────────────────────

export async function getRelatedArticles(pmid: string, maxResults = 5): Promise<PubMedArticleDetailed[]> {
  try {
    const linkUrl = buildUrl("elink.fcgi", {
      dbfrom: "pubmed",
      db: "pubmed",
      id: pmid,
      cmd: "neighbor_score",
      retmode: "json",
    });

    const linkRes = await fetch(linkUrl);
    if (!linkRes.ok) return [];
    const linkData = await linkRes.json();

    const linkSets = linkData.linksets?.[0]?.linksetdbs || [];
    const relatedSet = linkSets.find((ls: any) => ls.linkname === "pubmed_pubmed");
    if (!relatedSet) return [];

    const relatedIds = relatedSet.links?.slice(0, maxResults).map((l: any) => String(l.id || l)) || [];
    if (relatedIds.length === 0) return [];

    return fetchArticleDetails(relatedIds);
  } catch (err) {
    console.error("[PubMed] Related articles error:", err);
    return [];
  }
}

// ─── Cited By (PMC) ─────────────────────────────────────────

export async function getCitedBy(pmid: string, maxResults = 10): Promise<PubMedArticleDetailed[]> {
  try {
    const linkUrl = buildUrl("elink.fcgi", {
      dbfrom: "pubmed",
      db: "pubmed",
      id: pmid,
      cmd: "neighbor",
      linkname: "pubmed_pubmed_citedin",
      retmode: "json",
    });

    const linkRes = await fetch(linkUrl);
    if (!linkRes.ok) return [];
    const linkData = await linkRes.json();

    const linkSets = linkData.linksets?.[0]?.linksetdbs || [];
    const citedBySet = linkSets.find((ls: any) => ls.linkname === "pubmed_pubmed_citedin");
    if (!citedBySet) return [];

    const citedByIds = citedBySet.links?.slice(0, maxResults).map((l: any) => String(l.id || l)) || [];
    if (citedByIds.length === 0) return [];

    return fetchArticleDetails(citedByIds);
  } catch (err) {
    console.error("[PubMed] Cited by error:", err);
    return [];
  }
}

// ─── Generate Citation Formats ───────────────────────────────

export function generateCitation(article: PubMedArticleDetailed): PubMedCitation {
  const authorsStr = article.authors
    .map(a => `${a.lastName} ${a.foreName.charAt(0)}`)
    .join(", ");
  const authorsApa = article.authors
    .map(a => `${a.lastName}, ${a.foreName.charAt(0)}.`)
    .join(", ");
  const year = article.pubDate.split(" ")[0];

  // Vancouver format (used in medicine)
  const vancouver = `${authorsStr}. ${article.title}. ${article.journalAbbrev || article.journal}. ${year};${article.doi ? ` doi:${article.doi}` : ""} PMID: ${article.pmid}.`;

  // APA format
  const apa = `${authorsApa} (${year}). ${article.title}. *${article.journal}*.${article.doi ? ` https://doi.org/${article.doi}` : ""}`;

  // ABNT format (Brazilian standard)
  const authorsAbnt = article.authors
    .map(a => `${a.lastName.toUpperCase()}, ${a.foreName}`)
    .join("; ");
  const abnt = `${authorsAbnt}. ${article.title}. **${article.journal}**, ${year}.${article.doi ? ` DOI: ${article.doi}.` : ""} Disponível em: https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`;

  return {
    pmid: article.pmid,
    title: article.title,
    authors: authorsStr,
    journal: article.journal,
    year,
    doi: article.doi,
    citationFormat: { apa, vancouver, abnt },
  };
}

// ─── Trending Topics in Medicine ─────────────────────────────

export async function getTrendingMedicalTopics(): Promise<PubMedTrendingTopic[]> {
  const topics = [
    "artificial intelligence medicine",
    "CRISPR gene therapy",
    "long COVID treatment",
    "GLP-1 agonist obesity",
    "immunotherapy cancer",
    "antibiotic resistance",
    "telemedicine outcomes",
    "mRNA vaccine technology",
  ];

  const results: PubMedTrendingTopic[] = [];

  for (const term of topics) {
    try {
      const searchUrl = buildUrl("esearch.fcgi", {
        db: "pubmed",
        term: `${term} AND "last 30 days"[dp]`,
        retmax: 3,
        retmode: "json",
        sort: "relevance",
      });

      const res = await fetch(searchUrl);
      if (!res.ok) continue;
      const data = await res.json();
      const count = parseInt(data.esearchresult?.count || "0", 10);
      const ids = data.esearchresult?.idlist || [];

      if (count > 0 && ids.length > 0) {
        const articles = await fetchArticleDetails(ids.slice(0, 3));
        results.push({
          term,
          count,
          recentArticles: articles.map(a => ({ pmid: a.pmid, title: a.title })),
        });
      }
    } catch (err) {
      console.error(`[PubMed] Trending topic error for "${term}":`, err);
    }
  }

  return results.sort((a, b) => b.count - a.count);
}

// ─── Search by Medical Specialty ─────────────────────────────

export async function searchBySpecialty(
  specialty: string,
  query: string,
  maxResults = 10
): Promise<PubMedSearchResult> {
  const specialtyMeshTerms: Record<string, string> = {
    cardiologia: "Cardiology[MeSH] OR Heart Diseases[MeSH]",
    neurologia: "Neurology[MeSH] OR Nervous System Diseases[MeSH]",
    pneumologia: "Pulmonary Medicine[MeSH] OR Respiratory Tract Diseases[MeSH]",
    gastroenterologia: "Gastroenterology[MeSH] OR Digestive System Diseases[MeSH]",
    endocrinologia: "Endocrinology[MeSH] OR Endocrine System Diseases[MeSH]",
    nefrologia: "Nephrology[MeSH] OR Kidney Diseases[MeSH]",
    infectologia: "Communicable Diseases[MeSH] OR Infection[MeSH]",
    oncologia: "Medical Oncology[MeSH] OR Neoplasms[MeSH]",
    pediatria: "Pediatrics[MeSH] OR Child[MeSH]",
    geriatria: "Geriatrics[MeSH] OR Aged[MeSH]",
    psiquiatria: "Psychiatry[MeSH] OR Mental Disorders[MeSH]",
    ortopedia: "Orthopedics[MeSH] OR Musculoskeletal Diseases[MeSH]",
    dermatologia: "Dermatology[MeSH] OR Skin Diseases[MeSH]",
    oftalmologia: "Ophthalmology[MeSH] OR Eye Diseases[MeSH]",
    otorrinolaringologia: "Otolaryngology[MeSH]",
    urologia: "Urology[MeSH] OR Urologic Diseases[MeSH]",
    ginecologia: "Gynecology[MeSH] OR Genital Diseases, Female[MeSH]",
    cirurgia: "Surgery[MeSH] OR Surgical Procedures, Operative[MeSH]",
    emergencia: "Emergency Medicine[MeSH] OR Emergencies[MeSH]",
    "medicina_intensiva": "Critical Care[MeSH] OR Intensive Care Units[MeSH]",
  };

  const meshFilter = specialtyMeshTerms[specialty.toLowerCase()] || "";
  const enhancedQuery = meshFilter ? `(${query}) AND (${meshFilter})` : query;

  return searchPubMedAdvanced(enhancedQuery, { maxResults });
}

// ─── Clinical Trial Search ───────────────────────────────────

export async function searchClinicalTrials(
  condition: string,
  intervention?: string,
  maxResults = 10
): Promise<PubMedSearchResult> {
  let query = `${condition} AND "Clinical Trial"[pt]`;
  if (intervention) {
    query += ` AND ${intervention}`;
  }
  return searchPubMedAdvanced(query, { maxResults, sort: "date" });
}

// ─── Systematic Reviews Search ───────────────────────────────

export async function searchSystematicReviews(
  topic: string,
  maxResults = 10
): Promise<PubMedSearchResult> {
  const query = `${topic} AND ("Systematic Review"[pt] OR "Meta-Analysis"[pt])`;
  return searchPubMedAdvanced(query, { maxResults, sort: "date" });
}

// ─── Database Statistics ─────────────────────────────────────

export async function getPubMedStats(): Promise<{
  totalRecords: number;
  lastUpdate: string;
  description: string;
}> {
  try {
    const infoUrl = buildUrl("einfo.fcgi", { db: "pubmed", retmode: "json" });
    const res = await fetch(infoUrl);
    if (!res.ok) return { totalRecords: 0, lastUpdate: "", description: "" };
    const data = await res.json();
    const dbInfo = data.einforesult?.dbinfo?.[0] || data.result?.pubmed || {};
    return {
      totalRecords: parseInt(dbInfo.count || "0", 10),
      lastUpdate: dbInfo.lastupdate || "",
      description: dbInfo.description || "PubMed biomedical literature database",
    };
  } catch (err) {
    console.error("[PubMed] Stats error:", err);
    return { totalRecords: 0, lastUpdate: "", description: "" };
  }
}
