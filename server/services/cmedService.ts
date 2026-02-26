/**
 * CMED Medicine Service
 * 
 * Loads the official ANVISA/CMED medicine price database and provides
 * search, filter, and pagination capabilities.
 * 
 * Data source: https://dados.anvisa.gov.br/dados/TA_PRECO_MEDICAMENTO.csv
 * Updated daily via scheduled Cloud Function.
 */

import * as fs from 'fs';
import * as path from 'path';

interface MedicineProduct {
  nome: string;
  laboratorio: string;
  preco: number | null;
  apresentacao: string;
  tipo: string;
  apresentacoes: number;
  ean: string;
  registro: string;
}

interface Medicine {
  id: number;
  substancia: string;
  referencia: MedicineProduct;
  genericos: MedicineProduct[];
  similares: MedicineProduct[];
  classeCode: string;
  classeNome: string;
  classeFull: string;
  tarja: string;
  formaFarmaceutica: string;
  totalApresentacoes: number;
}

interface CMEDData {
  metadata: {
    source: string;
    url: string;
    lastUpdate: string;
    totalSubstances: number;
    totalWithGenerics: number;
    totalWithSimilars: number;
    totalCategories: number;
  };
  categories: string[];
  medicines: Medicine[];
}

let cachedData: CMEDData | null = null;
let lastLoadTime = 0;
const CACHE_TTL = 3600000; // 1 hour

function getDataDir(): string {
  // Try multiple paths to find the CMED data file
  // In production (Cloud Run): process.cwd() = /app, data at /app/server/data/
  // In development: process.cwd() = project root, data at server/data/
  const candidates = [
    path.join(process.cwd(), 'server', 'data'),
    path.join(process.cwd(), 'data'),
    path.resolve('server', 'data'),
    path.resolve('data'),
  ];
  
  // Also try using import.meta.url if available
  try {
    const fileUrl = new URL(import.meta.url);
    const dir = path.dirname(fileUrl.pathname);
    candidates.push(path.join(dir, '..', 'server', 'data'));
    candidates.push(path.join(dir, '..', 'data'));
    candidates.push(path.join(dir, 'data'));
  } catch (_) { /* ignore */ }

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(path.join(candidate, 'cmed_medicines.json'))) {
        console.log(`[CMED] Found data directory: ${candidate}`);
        return candidate;
      }
    } catch (_) { /* ignore */ }
  }
  
  console.warn('[CMED] Data directory not found, using default');
  return candidates[0]; // fallback to first candidate
}

function loadData(): CMEDData {
  const now = Date.now();
  if (cachedData && (now - lastLoadTime) < CACHE_TTL) {
    return cachedData;
  }

  const dataPath = path.join(getDataDir(), 'cmed_medicines.json');
  try {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    cachedData = JSON.parse(raw);
    lastLoadTime = now;
    console.log(`[CMED] Loaded ${cachedData!.medicines.length} medicines from ${dataPath}`);
    return cachedData!;
  } catch (err) {
    console.error('[CMED] Failed to load data:', err);
    return { metadata: { source: '', url: '', lastUpdate: '', totalSubstances: 0, totalWithGenerics: 0, totalWithSimilars: 0, totalCategories: 0 }, categories: [], medicines: [] };
  }
}

export function getCMEDMetadata() {
  const data = loadData();
  return data.metadata;
}

export function getCMEDCategories() {
  const data = loadData();
  return data.categories;
}

export function searchMedicines(params: {
  query?: string;
  category?: string;
  tarja?: string;
  forma?: string;
  onlyWithGenerics?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'price' | 'savings';
  sortOrder?: 'asc' | 'desc';
}) {
  const data = loadData();
  let results = [...data.medicines];

  // Text search
  if (params.query && params.query.trim()) {
    const q = params.query.toLowerCase().trim();
    results = results.filter(m => {
      return (
        m.substancia.toLowerCase().includes(q) ||
        m.referencia.nome.toLowerCase().includes(q) ||
        m.referencia.laboratorio.toLowerCase().includes(q) ||
        m.classeNome.toLowerCase().includes(q) ||
        m.genericos.some(g => g.nome.toLowerCase().includes(q)) ||
        m.similares.some(s => s.nome.toLowerCase().includes(q))
      );
    });
  }

  // Category filter
  if (params.category && params.category !== 'Todas') {
    results = results.filter(m => m.classeNome === params.category);
  }

  // Tarja filter
  if (params.tarja && params.tarja !== 'Todas') {
    results = results.filter(m => m.tarja.includes(params.tarja!));
  }

  // Forma farmacêutica filter
  if (params.forma && params.forma !== 'Todas') {
    results = results.filter(m => m.formaFarmaceutica === params.forma);
  }

  // Only with generics
  if (params.onlyWithGenerics) {
    results = results.filter(m => m.genericos.length > 0);
  }

  // Sorting
  const sortBy = params.sortBy || 'name';
  const sortOrder = params.sortOrder || 'asc';
  results.sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'name') {
      cmp = a.substancia.localeCompare(b.substancia);
    } else if (sortBy === 'price') {
      const pa = a.referencia.preco || 0;
      const pb = b.referencia.preco || 0;
      cmp = pa - pb;
    } else if (sortBy === 'savings') {
      const savingsA = getSavingsPercent(a);
      const savingsB = getSavingsPercent(b);
      cmp = savingsA - savingsB;
    }
    return sortOrder === 'desc' ? -cmp : cmp;
  });

  // Pagination
  const page = params.page || 1;
  const pageSize = params.pageSize || 50;
  const total = results.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const paged = results.slice(start, start + pageSize);

  return {
    medicines: paged,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
}

function getSavingsPercent(m: Medicine): number {
  if (!m.referencia.preco || m.genericos.length === 0) return 0;
  const cheapestGeneric = m.genericos.find(g => g.preco !== null);
  if (!cheapestGeneric || !cheapestGeneric.preco) return 0;
  return ((m.referencia.preco - cheapestGeneric.preco) / m.referencia.preco) * 100;
}

export function getMedicineById(id: number) {
  const data = loadData();
  return data.medicines.find(m => m.id === id) || null;
}

export function getMedicineBySubstance(substance: string) {
  const data = loadData();
  const q = substance.toLowerCase();
  return data.medicines.find(m => m.substancia.toLowerCase() === q) || null;
}

export function getTopSavings(limit: number = 20) {
  const data = loadData();
  const withSavings = data.medicines
    .filter(m => m.referencia.preco && m.genericos.length > 0)
    .map(m => {
      const cheapest = m.genericos.find(g => g.preco !== null);
      const savings = cheapest && cheapest.preco && m.referencia.preco
        ? ((m.referencia.preco - cheapest.preco) / m.referencia.preco) * 100
        : 0;
      return { ...m, savingsPercent: Math.round(savings * 10) / 10 };
    })
    .filter(m => m.savingsPercent > 0)
    .sort((a, b) => b.savingsPercent - a.savingsPercent);

  return withSavings.slice(0, limit);
}

export function getStats() {
  const data = loadData();
  const meds = data.medicines;
  
  const formas = new Set(meds.map(m => m.formaFarmaceutica));
  const tarjas = new Set(meds.map(m => m.tarja));
  
  const withPrice = meds.filter(m => m.referencia.preco !== null);
  const avgPrice = withPrice.length > 0
    ? withPrice.reduce((sum, m) => sum + (m.referencia.preco || 0), 0) / withPrice.length
    : 0;

  return {
    totalMedicines: meds.length,
    totalWithGenerics: meds.filter(m => m.genericos.length > 0).length,
    totalWithSimilars: meds.filter(m => m.similares.length > 0).length,
    totalCategories: data.categories.length,
    totalFormas: formas.size,
    avgPrice: Math.round(avgPrice * 100) / 100,
    lastUpdate: data.metadata.lastUpdate,
    source: data.metadata.source,
    formas: Array.from(formas).sort(),
    tarjas: Array.from(tarjas).sort(),
  };
}

/**
 * Refresh CMED data from ANVISA servers.
 * Downloads the latest CSV, parses it, and updates the local JSON cache.
 * Called by the daily scheduled function.
 */
export async function refreshCMEDData(): Promise<{ success: boolean; message: string }> {
  const https = await import('https');
  const csvUrl = 'https://dados.anvisa.gov.br/dados/TA_PRECO_MEDICAMENTO.csv';
  const dataDir = getDataDir();
  const csvPath = path.join(dataDir, 'TA_PRECO_MEDICAMENTO.csv');
  const jsonPath = path.join(dataDir, 'cmed_medicines.json');

  return new Promise((resolve) => {
    console.log('[CMED] Starting daily refresh from ANVISA...');
    
    const file = fs.createWriteStream(csvPath);
    const request = https.get(csvUrl, { rejectUnauthorized: false }, (response: any) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          try {
            // Parse the downloaded CSV
            const csvContent = fs.readFileSync(csvPath, 'utf-8');
            const lines = csvContent.split('\n');
            
            // Find header row
            let headerIdx = -1;
            for (let i = 0; i < Math.min(70, lines.length); i++) {
              if (lines[i].startsWith('SUBST')) {
                headerIdx = i;
                break;
              }
            }
            
            if (headerIdx === -1) {
              resolve({ success: false, message: 'Header row not found in CSV' });
              return;
            }

            // Parse data rows
            const dataRows: string[][] = [];
            for (let i = headerIdx + 1; i < lines.length; i++) {
              const line = lines[i].trim();
              if (!line) continue;
              // Simple CSV parse with semicolon
              const fields: string[] = [];
              let current = '';
              let inQuotes = false;
              for (const char of line) {
                if (char === '"') {
                  inQuotes = !inQuotes;
                } else if (char === ';' && !inQuotes) {
                  fields.push(current.trim());
                  current = '';
                } else {
                  current += char;
                }
              }
              fields.push(current.trim());
              if (fields.length >= 15) {
                dataRows.push(fields);
              }
            }

            // Group by substance and build medicine objects
            const bySubstance = new Map<string, string[][]>();
            for (const row of dataRows) {
              const sub = row[0].replace(/"/g, '').trim();
              if (!sub) continue;
              if (!bySubstance.has(sub)) bySubstance.set(sub, []);
              bySubstance.get(sub)!.push(row);
            }

            const parsePrice = (val: string): number | null => {
              if (!val || val.trim() === '' || val.includes('-')) return null;
              try { return parseFloat(val.replace(/\./g, '').replace(',', '.')); } catch { return null; }
            };

            const medicines: any[] = [];
            let medId = 0;

            for (const [substance, rows] of Array.from(bySubstance.entries()).sort()) {
              const productsMap = new Map<string, string[][]>();
              for (const row of rows) {
                const product = row[8]?.replace(/"/g, '').trim() || '';
                if (!productsMap.has(product)) productsMap.set(product, []);
                productsMap.get(product)!.push(row);
              }

              let reference: any = null;
              let refPrice: number | null = null;
              const generics: any[] = [];
              const similars: any[] = [];

              for (const [productName, productRows] of productsMap) {
                const tipo = (productRows[0][11] || '').toLowerCase();
                const lab = productRows[0][2]?.replace(/"/g, '').trim() || '';
                const pmc18 = parsePrice(productRows[0][47] || '');
                const pmc17 = parsePrice(productRows[0][43] || '');
                const pf17 = parsePrice(productRows[0][17] || '');
                const price = pmc18 || pmc17 || pf17;
                
                const entry = {
                  nome: productName,
                  laboratorio: lab,
                  preco: price,
                  apresentacao: (productRows[0][9] || '').replace(/"/g, '').trim(),
                  tipo: (productRows[0][11] || '').replace(/"/g, '').trim(),
                  apresentacoes: productRows.length,
                  ean: (productRows[0][5] || '').replace(/"/g, '').trim(),
                  registro: (productRows[0][4] || '').replace(/"/g, '').trim(),
                };

                if (tipo.includes('novo') || tipo.includes('refer') || tipo.includes('biológ')) {
                  if (!reference || (price && (!refPrice || price > refPrice))) {
                    reference = entry;
                    refPrice = price;
                  }
                } else if (tipo.includes('genér') || tipo.includes('genic')) {
                  generics.push(entry);
                } else {
                  similars.push(entry);
                }
              }

              if (!reference && (generics.length > 0 || similars.length > 0)) {
                const all = [...generics, ...similars];
                reference = all[0];
                refPrice = all[0]?.preco;
              }
              if (!reference) continue;

              const classe = (rows[0][10] || '').replace(/"/g, '').trim();
              const tarja = (rows[0][72] || '').replace(/"/g, '').trim();
              
              medId++;
              medicines.push({
                id: medId,
                substancia: substance,
                referencia: reference,
                genericos: generics.sort((a: any, b: any) => (a.preco || 999999) - (b.preco || 999999)),
                similares: similars.sort((a: any, b: any) => (a.preco || 999999) - (b.preco || 999999)),
                classeCode: classe.split(' - ')[0]?.trim() || '',
                classeNome: classe.includes(' - ') ? classe.split(' - ').slice(1).join(' - ').trim() : classe,
                classeFull: classe,
                tarja: tarja.toLowerCase().includes('preta') ? 'Receita Especial (Tarja Preta)' :
                       tarja.toLowerCase().includes('vermelha') ? 'Receita Simples (Tarja Vermelha)' :
                       tarja.toLowerCase().includes('amarela') ? 'Receita Amarela' :
                       'Venda Livre (Sem Tarja)',
                formaFarmaceutica: 'Outro',
                totalApresentacoes: rows.length,
              });
            }

            const categories = Array.from(new Set(medicines.map((m: any) => m.classeNome))).sort();
            const output = {
              metadata: {
                source: 'ANVISA/CMED - Lista de Preços de Medicamentos',
                url: csvUrl,
                lastUpdate: new Date().toISOString().split('T')[0],
                totalSubstances: medicines.length,
                totalWithGenerics: medicines.filter((m: any) => m.genericos.length > 0).length,
                totalWithSimilars: medicines.filter((m: any) => m.similares.length > 0).length,
                totalCategories: categories.length,
              },
              categories,
              medicines,
            };

            fs.writeFileSync(jsonPath, JSON.stringify(output));
            
            // Invalidate cache
            cachedData = null;
            lastLoadTime = 0;

            console.log(`[CMED] Refresh complete: ${medicines.length} medicines updated`);
            resolve({ success: true, message: `Updated ${medicines.length} medicines from ANVISA/CMED` });
          } catch (parseErr: any) {
            console.error('[CMED] Parse error:', parseErr);
            resolve({ success: false, message: `Parse error: ${parseErr.message}` });
          }
        });
      } else {
        resolve({ success: false, message: `HTTP ${response.statusCode}` });
      }
    });

    request.on('error', (err: any) => {
      console.error('[CMED] Download error:', err);
      resolve({ success: false, message: `Download error: ${err.message}` });
    });

    // Timeout after 5 minutes
    request.setTimeout(300000, () => {
      request.destroy();
      resolve({ success: false, message: 'Download timeout (5 min)' });
    });
  });
}
