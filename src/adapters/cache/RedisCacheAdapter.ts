import { CacheGatewayPort } from '@/application/ports/gateways/ExternalGatewayPorts';
import { LoggerService } from '@/application/services/logger/LoggerService';

/**
 * Redis Cache Adapter - Implementação concreta do CacheGatewayPort
 * 
 * Este adapter pode ser facilmente substituído por outras implementações
 * como MemoryCache, FileCache, etc. sem afetar a lógica de negócio.
 */
export class RedisCacheAdapter implements CacheGatewayPort {
  private readonly logger = new LoggerService(RedisCacheAdapter.name);
  private readonly cache = new Map<string, { value: any; expires?: number }>();

  constructor(
    private readonly defaultTTL: number = 3600 // 1 hora em segundos
  ) { }

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = this.cache.get(key);

      if (!item) {
        this.logger.debug(`Cache miss for key: ${key}`);
        return null;
      }

      // Verifica se o item expirou
      if (item.expires && Date.now() > item.expires) {
        this.cache.delete(key);
        this.logger.debug(`Cache expired for key: ${key}`);
        return null;
      }

      this.logger.debug(`Cache hit for key: ${key}`);
      return item.value as T;
    } catch (error) {
      this.logger.error(`Error getting cache key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const expires = ttl || this.defaultTTL;
      const expiresAt = expires > 0 ? Date.now() + (expires * 1000) : undefined;

      this.cache.set(key, {
        value,
        expires: expiresAt
      });

      this.logger.debug(`Cache set for key: ${key}, TTL: ${expires}s`);
    } catch (error) {
      this.logger.error(`Error setting cache key ${key}:`, error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const deleted = this.cache.delete(key);
      this.logger.debug(`Cache delete for key: ${key}, existed: ${deleted}`);
    } catch (error) {
      this.logger.error(`Error deleting cache key ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      this.cache.clear();
      this.logger.info('Cache cleared');
    } catch (error) {
      this.logger.error('Error clearing cache:', error);
      throw error;
    }
  }

  // Método específico para Redis (não faz parte do port)
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}