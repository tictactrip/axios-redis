import Redis from 'ioredis';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosPromise, AxiosInstance } from 'axios';
import get from 'lodash.get';
import flatted from 'flatted';
import { EHttpMethod, ERedisFlag, EAxiosCacheHeaders } from './types';
import { ICacheConfiguration, defaultConfiguration } from './config';
import { compress, decompress } from '../utils/compression';

/**
 * @description AxiosRedis class.
 */
export class AxiosRedis {
  private config: ICacheConfiguration;
  public readonly redis: Redis;
  public keysToNotEncode: string[] = ['method'];
  public methodsToCache: EHttpMethod[] = [EHttpMethod.GET, EHttpMethod.POST];

  /**
   * @constructor
   * @param {Redis} redis
   * @param {ICacheConfiguration} config
   */
  constructor(redis: Redis, config: ICacheConfiguration = {}) {
    this.redis = redis;
    this.config = { ...defaultConfiguration, ...config };
  }

  /**
   * @description Returns key value.
   * @param {string} key
   * @returns {Promise<string|null>}
   */
  async getCache(key: string): Promise<string | null> {
    const data = await this.redis.get(key);

    if (data) {
      return decompress(data);
    } else {
      return data;
    }
  }

  /**
   * @description Caches data.
   * @param {string} key
   * @param {AxiosResponse} data
   * @param {undefined | number | null} durationInMS
   * @returns Promise<string | void>
   */
  async setCache(key: string, data: AxiosResponse, durationInMS: undefined | number | string | null): Promise<string | void> {
    if (durationInMS === 0 || typeof durationInMS === 'object' || typeof durationInMS === null || durationInMS === '0') {
      return;
    }

    let duration: number;

    if (typeof durationInMS === 'string') {
      duration = parseInt(durationInMS, 10);
    }

    duration = duration || this.config.expirationInMS;

    const compressedData: string = await compress(flatted.stringify(data));

    return this.redis.set(key, compressedData, ERedisFlag.EXPIRATION_IN_MS, duration);
  }

  /**
   * @description Axios adapter.
   * @param {AxiosRequestConfig} config
   * @param {AxiosRedis} axiosRedis
   * @returns {Promise<AxiosResponse>}
   */
  static async ADAPTER(config: AxiosRequestConfig, axiosRedis: AxiosRedis): Promise<AxiosResponse> {
    let response: AxiosResponse | null = null;

    try {
      if (axiosRedis.methodsToCache.includes(<EHttpMethod>config.method.toLowerCase())) {
        const key: string = axiosRedis.createKey(config);

        // Check if the request should be recached
        if (!config.headers[EAxiosCacheHeaders.Recache] || config.headers[EAxiosCacheHeaders.Recache] === 'false') {
          const data: string | null = await axiosRedis.getCache(key);

          if (data) {
            return flatted.parse(data);
          }
        }

        // Send the request and store the result in case of success
        const cacheDuration: string | number = config.headers[EAxiosCacheHeaders.CacheDuration];

        response = await axiosRedis.fetch(config);

        await axiosRedis.setCache(key, response, cacheDuration);

        return response;
      }

      return axiosRedis.fetch(config);
    } catch (error) {
      if (error.isAxiosError) {
        throw error;
      }

      return axiosRedis.fetch(config);
    }
  }

  /**
   * @description Creates key from config paths.
   * @param {AxiosRequestConfig} axiosConfig
   * @returns {string}
   */
  private createKey(axiosConfig: AxiosRequestConfig): string {
    const arr: string[] = this.config.axiosConfigPaths.map((key: string) => {
      const value: string = flatted.stringify(get(axiosConfig, key));

      if (!this.keysToNotEncode.includes(key)) {
        return Buffer.from(value).toString('base64');
      }

      return value;
    });

    return [this.config.prefix, ...arr].join(this.config.separator);
  }

  /**
   * @description Fetch with default adapter.
   * @param {AxiosRequestConfig} config
   * @returns {AxiosPromise}
   */
  private fetch(config: AxiosRequestConfig): AxiosPromise {
    delete config.headers[EAxiosCacheHeaders.CacheDuration];
    delete config.headers[EAxiosCacheHeaders.Recache];

    const axiosDefaultAdapter: AxiosInstance = axios.create(Object.assign(config, { adapter: axios.defaults.adapter }));

    return axiosDefaultAdapter.request(config);
  }
}
