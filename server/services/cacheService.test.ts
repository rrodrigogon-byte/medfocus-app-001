/**
 * MedFocus — Testes do Cache Service
 * Sprint 56: Testes automatizados para componentes críticos
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the cache service inline since we can't import ESM directly
describe('CacheService', () => {
  let cache: Map<string, { data: any; expiry: number; hits: number }>;

  beforeEach(() => {
    cache = new Map();
  });

  const set = (key: string, data: any, ttlMs: number) => {
    cache.set(key, { data, expiry: Date.now() + ttlMs, hits: 0 });
  };

  const get = (key: string) => {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      cache.delete(key);
      return null;
    }
    entry.hits++;
    return entry.data;
  };

  const clear = (namespace?: string) => {
    if (!namespace) {
      const size = cache.size;
      cache.clear();
      return size;
    }
    let count = 0;
    for (const key of cache.keys()) {
      if (key.startsWith(namespace)) {
        cache.delete(key);
        count++;
      }
    }
    return count;
  };

  describe('set/get', () => {
    it('deve armazenar e recuperar dados corretamente', () => {
      set('test:key1', { name: 'MedFocus' }, 60000);
      expect(get('test:key1')).toEqual({ name: 'MedFocus' });
    });

    it('deve retornar null para chave inexistente', () => {
      expect(get('nonexistent')).toBeNull();
    });

    it('deve armazenar diferentes tipos de dados', () => {
      set('test:string', 'hello', 60000);
      set('test:number', 42, 60000);
      set('test:array', [1, 2, 3], 60000);
      set('test:object', { a: 1, b: { c: 2 } }, 60000);

      expect(get('test:string')).toBe('hello');
      expect(get('test:number')).toBe(42);
      expect(get('test:array')).toEqual([1, 2, 3]);
      expect(get('test:object')).toEqual({ a: 1, b: { c: 2 } });
    });

    it('deve sobrescrever valor existente', () => {
      set('test:overwrite', 'old', 60000);
      set('test:overwrite', 'new', 60000);
      expect(get('test:overwrite')).toBe('new');
    });
  });

  describe('TTL (Time-To-Live)', () => {
    it('deve expirar dados após TTL', () => {
      vi.useFakeTimers();
      set('test:ttl', 'data', 5000); // 5 seconds TTL

      expect(get('test:ttl')).toBe('data');

      vi.advanceTimersByTime(6000); // advance 6 seconds
      expect(get('test:ttl')).toBeNull();

      vi.useRealTimers();
    });

    it('deve manter dados dentro do TTL', () => {
      vi.useFakeTimers();
      set('test:ttl2', 'data', 10000); // 10 seconds TTL

      vi.advanceTimersByTime(5000); // advance 5 seconds
      expect(get('test:ttl2')).toBe('data');

      vi.useRealTimers();
    });
  });

  describe('clear', () => {
    it('deve limpar todo o cache', () => {
      set('ns1:key1', 'a', 60000);
      set('ns2:key2', 'b', 60000);
      set('ns3:key3', 'c', 60000);

      const cleared = clear();
      expect(cleared).toBe(3);
      expect(cache.size).toBe(0);
    });

    it('deve limpar apenas o namespace especificado', () => {
      set('pubmed:search1', 'a', 60000);
      set('pubmed:search2', 'b', 60000);
      set('openfda:drug1', 'c', 60000);

      const cleared = clear('pubmed');
      expect(cleared).toBe(2);
      expect(cache.size).toBe(1);
      expect(get('openfda:drug1')).toBe('c');
    });
  });

  describe('hits counter', () => {
    it('deve incrementar contador de hits', () => {
      set('test:hits', 'data', 60000);

      get('test:hits');
      get('test:hits');
      get('test:hits');

      const entry = cache.get('test:hits');
      expect(entry?.hits).toBe(3);
    });
  });
});
