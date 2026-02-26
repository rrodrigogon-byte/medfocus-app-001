/**
 * Bulário Digital Service
 * 
 * Serves 27,000+ individual medicine presentations from the ANVISA/CMED database.
 * Provides search, filter, and pagination for the Bulário Digital component.
 */

import * as fs from 'fs';
import * as path from 'path';

interface BularioEntry {
  id: number;
  substancia: string;
  produto: string;
  laboratorio: string;
  apresentacao: string;
  classe: string;
  tipo: string;
  tarja: string;
  preco: number;
  ean: string;
  registro: string;
}

interface BularioData {
  metadata: {
    source: string;
    totalEntries: number;
    totalSubstances: number;
    totalLabs: number;
    totalClasses: number;
  };
  entries: BularioEntry[];
}

let cachedData: BularioData | null = null;
let lastLoadTime = 0;
const CACHE_TTL = 3600000; // 1 hour

function getDataPath(): string {
  const candidates = [
    path.join(process.cwd(), 'server', 'data', 'bulario_cmed.json'),
    path.join(process.cwd(), 'data', 'bulario_cmed.json'),
    path.resolve('server', 'data', 'bulario_cmed.json'),
    path.resolve('data', 'bulario_cmed.json'),
  ];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    } catch (_) { /* ignore */ }
  }
  return candidates[0];
}

function loadData(): BularioData {
  const now = Date.now();
  if (cachedData && (now - lastLoadTime) < CACHE_TTL) {
    return cachedData;
  }

  const dataPath = getDataPath();
  try {
    const raw = fs.readFileSync(dataPath, 'utf-8');
    cachedData = JSON.parse(raw);
    lastLoadTime = now;
    console.log(`[Bulario] Loaded ${cachedData!.entries.length} entries from ${dataPath}`);
    return cachedData!;
  } catch (err) {
    console.error('[Bulario] Failed to load data:', err);
    return { metadata: { source: '', totalEntries: 0, totalSubstances: 0, totalLabs: 0, totalClasses: 0 }, entries: [] };
  }
}

export function getBularioStats() {
  const data = loadData();
  const entries = data.entries;
  
  const tipos: Record<string, number> = {};
  const tarjas: Record<string, number> = {};
  entries.forEach(e => {
    tipos[e.tipo] = (tipos[e.tipo] || 0) + 1;
    tarjas[e.tarja] = (tarjas[e.tarja] || 0) + 1;
  });

  return {
    ...data.metadata,
    tipos,
    tarjas,
  };
}

export function searchBulario(params: {
  query?: string;
  tipo?: string;
  tarja?: string;
  classe?: string;
  laboratorio?: string;
  page?: number;
  pageSize?: number;
}) {
  const data = loadData();
  let results = data.entries;

  // Text search
  if (params.query && params.query.trim()) {
    const q = params.query.toLowerCase().trim();
    results = results.filter(e =>
      e.substancia.toLowerCase().includes(q) ||
      e.produto.toLowerCase().includes(q) ||
      e.laboratorio.toLowerCase().includes(q) ||
      e.classe.toLowerCase().includes(q) ||
      e.ean.includes(q)
    );
  }

  // Tipo filter
  if (params.tipo && params.tipo !== 'Todos') {
    results = results.filter(e => e.tipo === params.tipo);
  }

  // Tarja filter
  if (params.tarja && params.tarja !== 'Todas') {
    results = results.filter(e => e.tarja === params.tarja);
  }

  // Classe filter
  if (params.classe && params.classe !== 'Todas') {
    results = results.filter(e => e.classe.toLowerCase().includes(params.classe!.toLowerCase()));
  }

  // Lab filter
  if (params.laboratorio && params.laboratorio !== 'Todos') {
    results = results.filter(e => e.laboratorio === params.laboratorio);
  }

  // Pagination
  const page = params.page || 1;
  const pageSize = params.pageSize || 50;
  const total = results.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const paged = results.slice(start, start + pageSize);

  return {
    entries: paged,
    pagination: { page, pageSize, total, totalPages },
  };
}

export function getBularioClasses() {
  const data = loadData();
  const classes = new Set(data.entries.map(e => e.classe).filter(c => c));
  return Array.from(classes).sort();
}

export function getBularioLabs() {
  const data = loadData();
  const labs = new Set(data.entries.map(e => e.laboratorio).filter(l => l));
  return Array.from(labs).sort();
}

export function getBularioById(id: number) {
  const data = loadData();
  return data.entries.find(e => e.id === id) || null;
}
