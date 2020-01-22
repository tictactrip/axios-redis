import { RedisClient } from 'redis';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as _ from 'lodash';
import * as flatted from 'flatted';
import { promisify } from 'util';
import { EHttpMethod, ERedisFlag } from './types';
import { ICacheConfiguration, defaultConfiguration } from './config';

let axiosRedisInstance: AxiosRedis;

/**
 * @description AxiosRedis class.
 */
export class AxiosRedis {
  private readonly redis: RedisClient;
  private config: ICacheConfiguration;
  public redisSetAsync: (key: string, value: string, flag: ERedisFlag, expirationInMS: number) => Promise<string>;
  public redisGetAsync: (key: string) => Promise<string | null>;
  public keyDoNotEncode: string[] = ['method'];
  public methodsToCache: EHttpMethod[] = [EHttpMethod.GET, EHttpMethod.POST];

  /**
   * @constructor
   * @param {RedisClient} redis
   * @param {ICacheConfiguration} config
   */
  constructor(redis: RedisClient, config: ICacheConfiguration = {}) {
    this.redis = redis;
    this.config = { ...defaultConfiguration, ...config };
    this.redisSetAsync = promisify(this.redis.set).bind(this.redis);
    this.redisGetAsync = promisify(this.redis.get).bind(this.redis);

    axiosRedisInstance = this;
  }

  /**
   * @description Returns key value.
   * @param {string} key
   * @returns {Promise<string|null>}
   */
  getCache(key: string): Promise<string | null> {
    return this.redisGetAsync(key);
  }

  /**
   * @description Caches data.
   * @param {string} key
   * @param {AxiosResponse} data
   * @returns Promise<string>
   */
  setCache(key: string, data: AxiosResponse): Promise<string> {
    return this.redisSetAsync(key, flatted.stringify(data), ERedisFlag.EXPIRATION, this.config.expirationInMS);
  }

  /**
   * @description Axios adapter.
   * @param {AxiosRequestConfig} config
   * @returns {Promise<AxiosResponse>}
   */
  async axiosAdapter(config: AxiosRequestConfig): Promise<AxiosResponse> {
    let response: AxiosResponse | null = null;

    try {
      if (axiosRedisInstance.methodsToCache.includes(<EHttpMethod>config.method.toLowerCase())) {
        const key = axiosRedisInstance.createKey(config);

        const data = await axiosRedisInstance.getCache(key);

        if (data) {
          return flatted.parse(data);
        }

        // Send the request and store the result in case of success
        response = await axiosRedisInstance.fetch(config);
        await axiosRedisInstance.setCache(key, response);

        return response;
      }

      return axiosRedisInstance.fetch(config);
    } catch (error) {
      if (error.isAxiosError) {
        throw error;
      }

      return axiosRedisInstance.fetch(config);
    }
  }

  /**
   * @description Creates key from config paths.
   * @param {AxiosRequestConfig} axiosConfig
   * @returns {string}
   */
  private createKey(axiosConfig: AxiosRequestConfig): string {
    const arr = this.config.axiosConfigPaths.map((key: string) => {
      let value = flatted.stringify(_.get(axiosConfig, key));

      if (!this.keyDoNotEncode.includes(key)) {
        return Buffer.from(value).toString('base64');
      }

      return value;
    });

    return [this.config.prefix, ...arr].join(this.config.separator);
  }

  /**
   * @description Fetch with default adapter.
   * @param {AxiosRequestConfig} config
   * @returns {Promise<AxiosResponse>}
   */
  private fetch(config: AxiosRequestConfig): Promise<AxiosResponse> {
    const axiosDefaultAdapter = axios.create(Object.assign(config, { adapter: axios.defaults.adapter }));

    return axiosDefaultAdapter.request(config);
  }
}
