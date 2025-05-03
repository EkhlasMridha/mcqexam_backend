import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

interface QueryWithStoreParam<T extends any> {
  cacheKey: { getKey: keyof T; setKey: (keyof T)[] } | keyof T;
  query: () => Promise<T | null>;
  cacheTtl?: number;
}
interface WriteDataWithStoreParams<T extends any> {
  cacheKey: (keyof T)[];
  query: () => Promise<T>;
  ttl?: number;
}
interface ReadWriteBulkDataWithStore<T extends any> {
  cacheKey: any;
  query: () => Promise<T>;
  ttlInMs?: number;
}

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private async setDataToCache<T extends any>(
    cachekey: (keyof T)[],
    result: T,
    ttl?: number,
  ) {
    await Promise.all(
      cachekey.map((key) =>
        this.cacheManager.set(`${result[key]}`, result, ttl),
      ),
    );
  }

  async getQueryWithCacheStore<T extends any>({
    cacheKey,
    query,
    cacheTtl,
  }: QueryWithStoreParam<T>) {
    let result: Awaited<T> | null = null;
    const getCacheKey =
      typeof cacheKey === 'object' ? cacheKey?.getKey : cacheKey;
    result = await this.cacheManager.get<T>(getCacheKey.toString());
    if (result) return result;

    result = await query();
    if (!result) return null;

    if (typeof cacheKey === 'string') {
      await this.cacheManager.set(`${result[cacheKey]}`, result, cacheTtl);
    } else if (typeof cacheKey === 'object') {
      await this.setDataToCache(cacheKey.setKey, result, cacheTtl);
    }

    return result;
  }

  async writeDataWithStore<T extends any>({
    cacheKey,
    query,
    ttl,
  }: WriteDataWithStoreParams<T>) {
    const result = await query();

    await this.setDataToCache(cacheKey, result, ttl);

    return result;
  }

  async writeBulkDataWithStore<T extends any[]>({
    cacheKey,
    query,
    ttlInMs,
  }: ReadWriteBulkDataWithStore<T>) {
    const result = await query();
    if (cacheKey) {
      await this.cacheManager.set(cacheKey, result, ttlInMs);
    }

    return result;
  }

  async getBulkDataWithStore<T extends any>({
    cacheKey,
    query,
    ttlInMs,
  }: ReadWriteBulkDataWithStore<T>) {
    let result: Awaited<T> | null = null;
    if (!!cacheKey) {
      result = await this.cacheManager.get<T>(cacheKey);
    }
    if (!!result) return result;

    result = await query();
    if (!!result) {
      this.cacheManager.set(cacheKey, result, ttlInMs);
    }

    return result;
  }

  async getData<T = any>(key: string) {
    return await this.cacheManager.get<T>(key);
  }

  async setData<T = any>(key: string, data: T, ttl?: number) {
    return await this.cacheManager.set<T>(key, data, ttl);
  }

  async deleteData(key: string) {
    return await this.cacheManager.del(key);
  }
}
