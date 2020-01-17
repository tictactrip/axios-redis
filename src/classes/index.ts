import { RedisClient } from 'redis';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as _ from 'lodash';
import * as flatted from 'flatted';
import { promisify } from 'util';

enum ERedisFlag {
  EXPIRATION = 'EX',
}

interface ICacheConfiguration {
  expirationInMS: number;
  separator: string;
  prefix: string;
  axiosConfigPaths: string[];
}

enum EHttpMethod {
  GET = 'get',
  DELETE = 'delete',
  HEAD = 'head',
  OPTIONS = 'options',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  LINK = 'link',
  UNLINK = 'unlink',
}

let axiosRedisInstance: AxiosRedis;

export class AxiosRedis {
  private readonly redis: RedisClient;
  private config: ICacheConfiguration;
  public redisSetAsync: (
    key: string,
    value: string,
    flag: ERedisFlag,
    expirationInMS: number,
  ) => Promise<string>;
  public redisGetAsync: (key: string) => Promise<string | null>;

  /**
   * @constructor
   * @param {RedisClient} redis
   * @param {ICacheConfiguration} config
   */
  constructor(redis: RedisClient, config: ICacheConfiguration) {
    this.redis = redis;
    this.config = config;
    this.redisSetAsync = promisify(this.redis.set).bind(this.redis);
    this.redisGetAsync = promisify(this.redis.get).bind(this.redis);

    axiosRedisInstance = this;
  }

  /**
   * @description Returns key value.
   * @param {string} key
   * @returns {string}
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
    return this.redisSetAsync(
      key,
      flatted.stringify(data),
      ERedisFlag.EXPIRATION,
      this.config.expirationInMS,
    );
  }

  /**
   * @description Axios adapter.
   * @param {AxiosRequestConfig} config
   */
  async axiosAdapter(config: AxiosRequestConfig) {
    let response: AxiosResponse | null = null;

    try {
      if (
        [EHttpMethod.GET].includes(<EHttpMethod>config.method.toLowerCase())
      ) {
        const key = axiosRedisInstance.createKey(config);

        // tslint:disable-next-line:insecure-random
        const data = await axiosRedisInstance.getCache(key);

        if (data) {
          return flatted.parse(data);
        }

        // Send the request an store the result
        response = await axiosRedisInstance.fetch(config);
        await axiosRedisInstance.setCache(key, response);

        return response;
      }
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
      const value = _.get(axiosConfig, key);

      if (typeof value !== 'string' || !value.length) {
        throw new Error(
          `Axios config "${value}" key doesn't exist or is empty.`,
        );
      }

      return value;
    });

    return arr.join('___');
  }

  /**
   * @description Fetch with default adapter.
   * @param {AxiosRequestConfig} config
   */
  private fetch(config: AxiosRequestConfig): Promise<any> {
    const axiosDefaultAdapter = axios.create(
      Object.assign(config, { adapter: axios.defaults.adapter }),
    );

    return axiosDefaultAdapter.request(config);
  }
}
