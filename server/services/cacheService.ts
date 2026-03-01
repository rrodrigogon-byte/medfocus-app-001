/**
 * MedFocus — Cache Service
 * Sprint 52: Cache inteligente para APIs externas
 * In-memory cache com TTL, LRU eviction e métricas
 * Preparado para migração futura para Redis/Memcached
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  createdAt: number;
  hitCount: number;
}

interface CacheConfig {
  maxEntries: number;
  defaultTTLSeconds: number;
  cleanupIntervalMs: number;
}

interface CacheMetrics {
  hits: number;
  misses: number;
  sets: number;
  evictions: number;
  totalEntries: number;
  hitRate: number;
}

const DEFAULT_CONFIG: CacheConfig = {
  maxEntries: 1000,
  defaultTTLSeconds: 300, // 5 minutos padrão
  cleanupIntervalMs: 60000, // Limpa a cada 1 minuto
};

// TTLs específicos por tipo de API (em segundos)
export const API_CACHE_TTLS = {
  PUBMED_SEARCH: 600,        // 10 min — resultados de busca
  PUBMED_ARTICLE: 86400,     // 24h — artigos não mudam
  OPENFDA_DRUGS: 3600,       // 1h — dados de medicamentos
  OPENFDA_INTERACTIONS: 3600, // 1h — interações
  CMED_PRICES: 86400,        // 24h — preços CMED (atualização mensal)
  ANVISA_BULA: 86400,        // 24h — bulas
  CID10_LOOKUP: 604800,      // 7 dias — CID-10 é estático
  INFERMEDICA: 300,          // 5 min — diagnósticos são contextuais
  GEMINI_RESPONSE: 1800,     // 30 min — respostas IA
  GCP_HEALTHCARE: 300,       // 5 min — dados de saúde
};

class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private config: CacheConfig;
  private metrics: Omit<CacheMetrics, 'totalEntries' | 'hitRate'> = {
    hits: 0,
    misses: 0,
    sets: 0,
    evictions: 0,
  };
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.startCleanup();
  }

  /**
   * Busca um valor no cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.metrics.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.metrics.misses++;
      return null;
    }

    entry.hitCount++;
    this.metrics.hits++;
    return entry.data as T;
  }

  /**
   * Armazena um valor no cache com TTL
   */
  set<T>(key: string, data: T, ttlSeconds?: number): void {
    // Evict se atingiu o limite
    if (this.cache.size >= this.config.maxEntries) {
      this.evictLRU();
    }

    const ttl = ttlSeconds ?? this.config.defaultTTLSeconds;
    const now = Date.now();

    this.cache.set(key, {
      data,
      expiresAt: now + ttl * 1000,
      createdAt: now,
      hitCount: 0,
    });

    this.metrics.sets++;
  }

  /**
   * Wrapper para cache-aside pattern
   * Busca no cache; se não encontrar, executa a função e armazena o resultado
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlSeconds?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;

    const data = await fetchFn();
    this.set(key, data, ttlSeconds);
    return data;
  }

  /**
   * Invalida uma entrada específica
   */
  invalidate(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Invalida todas as entradas que começam com um prefixo
   */
  invalidateByPrefix(prefix: string): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Retorna métricas do cache
   */
  getMetrics(): CacheMetrics {
    const total = this.metrics.hits + this.metrics.misses;
    return {
      ...this.metrics,
      totalEntries: this.cache.size,
      hitRate: total > 0 ? Math.round((this.metrics.hits / total) * 100) : 0,
    };
  }

  /**
   * Evicta a entrada menos recentemente usada (LRU)
   */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      const lastAccess = entry.createdAt + entry.hitCount;
      if (lastAccess < oldestTime) {
        oldestTime = lastAccess;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.metrics.evictions++;
    }
  }

  /**
   * Remove entradas expiradas periodicamente
   */
  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now > entry.expiresAt) {
          this.cache.delete(key);
        }
      }
    }, this.config.cleanupIntervalMs);

    // Não bloqueia o processo
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  /**
   * Para o cleanup timer
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
}

// ── Instância global do cache ──────────────────────────────────
export const apiCache = new CacheService({
  maxEntries: 2000,
  defaultTTLSeconds: 300,
  cleanupIntervalMs: 60000,
});

// ── Helpers para gerar chaves de cache ─────────────────────────
export function cacheKey(namespace: string, ...parts: string[]): string {
  return `${namespace}:${parts.join(':')}`;
}

export default CacheService;
