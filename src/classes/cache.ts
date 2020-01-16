import { RedisClient } from 'redis';

enum ERedisFlag {
  EXPIRATION = 'EX',
}

interface ICacheConfiguration {
  expirationInMS: number;
  prefix: string;
}

interface ISetCache {
  key: string;
  data: string;
}

export class Cache {
  private redis: RedisClient;
  private config: ICacheConfiguration;

  /**
   * @constructor
   * @param {RedisClient} redis
   * @param {ICacheConfiguration} config
   */
  constructor(redis: RedisClient, config: ICacheConfiguration) {
    this.redis = redis;
    this.config = config;
  }

  /**
   * @description Returns key value.
   * @param {string} key
   * @returns {string}
   */
  getCache(key: string): string {
    // @ts-ignore
    return this.redis.getAsync(key);
  }

  /**
   * @description Caches data.
   * @param {ISetCache} params
   * @returns {Promise<string>}
   */
  setCache(params: ISetCache): Promise<string> {
    const { key, data } = params;

    // @ts-ignore
    return this.redis.setAsync(key, JSON.stringify(data), ERedisFlag.EXPIRATION, this.config.expirationInMS);
  }
}
