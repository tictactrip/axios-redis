import { RedisClient } from 'redis';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as _ from 'lodash';
import * as flatted from 'flatted';

enum ERedisFlag {
  EXPIRATION = 'EX',
}

interface ICacheConfiguration {
  expirationInMS: number;
  separator: string;
  prefix: string;
  axiosConfigPaths: string[];
}

interface ISetCache {
  key: string;
  data: string;
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
    axiosRedisInstance = this;
  }

  /**
   * @description Returns key value.
   * @param {string} key
   * @returns {string}
   */
  getCache(key: string): Promise<string | null> {
    return new Promise<string>((resolve, reject) => {
      this.redis.get(key, (error, data) => {
        if(error) {
          return reject(error);
        }

        return resolve(data);
      });
    });
  }

  /**
   * @description Caches data.
   * @param {string} key
   * @param {AxiosResponse} data
   * @returns Promise<string>
   */
  setCache(key: string, data: AxiosResponse): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.redis.set(
        key,
        flatted.stringify(data),
        ERedisFlag.EXPIRATION,
        this.config.expirationInMS,
        (error, data) => {
          if(error) {
            return reject(error);
          }

          return resolve(data);
        });
    });
  }

  static FETCH(config: AxiosRequestConfig) {
    const axiosWithoutAdapter = axios.create(
      Object.assign(config, { adapter: axios.defaults.adapter }),
    );

    return axiosWithoutAdapter.request(config);
  }

  /**
   * @description Axios adapter.
   * @param {AxiosRequestConfig} config
   */
  async axiosAdapter(config: AxiosRequestConfig) {
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
        const response = await AxiosRedis.FETCH(config);
        await axiosRedisInstance.setCache(key, response);

        return response;
      }
    } catch (error) {
      return AxiosRedis.FETCH(config);
    }
  }

  /**
   * @description Create key from config paths.
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
}
