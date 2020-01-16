import { RedisClient } from 'redis';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
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
  }

  /**
   * @description Returns key value.
   * @param {string} key
   * @returns {string}
   */
  getCache(key: string): Promise<string|null> {
    // @ts-ignore
    return this.redis.getAsync(key);
  }

  /**
   * @description Caches data.
   * @param {string} key
   * @param {AxiosResponse} data
   * @returns Promise<string>
   */
  setCache(key: string, data: AxiosResponse): Promise<string> {
    // @ts-ignore
    return this.redis.setAsync(key, flatted.stringify(data), ERedisFlag.EXPIRATION, this.config.expirationInMS);
  }

  /**
   * @description Request Axios interceptor.
   * @param {AxiosRequestConfig} config
   * @returns {Promise<AxiosRequestConfig>}
   */
  async requestInterceptor(config: AxiosRequestConfig, axiosInstance: AxiosInstance): Promise<AxiosRequestConfig> {
    if([EHttpMethod.GET].includes(<EHttpMethod> config.method.toLowerCase())) {
      const key = this.createKey(config);

      const data = await this.getCache(key);

      if(data) {
        return flatted.parse(data);
      }

      // @ts-ignore
      config.isCached = false;
    }

    console.log('should stop the request');

    return config;
  }

  /**
   * @description Response Axios interceptor.
   * @param {AxiosResponse} response
   * @returns {Promise<AxiosRequestConfig>}
   */
  async responseInterceptor(response: AxiosResponse<any>): Promise<AxiosResponse<any>> {
    // @ts-ignore
    if(response.config.isCached === false) {
      // @ts-ignore
      response.config.isCached = true;

      const key = this.createKey(response.config);
      await this.setCache(key, response.data);
    }

    return response;
  }


  /**
   * @description Axios interceptor.
   * @param {AxiosInstance} axios
   * @returns {AxiosInstance}
   */
  axiosInterceptor(axios: AxiosInstance): AxiosInstance {
    const cache = this;

    // Add a request interceptor
    axios.interceptors.request.use(
      config => cache.requestInterceptor(config, axios),
      error => {

        return Promise.reject(error);
      },
    );

    // Add a response interceptor
    axios.interceptors.response.use(
      response => cache.responseInterceptor(response),
      error => Promise.reject(error),
    );

    return axios;
  }

  /**
   * @description Create key from config paths.
   * @param {AxiosRequestConfig} axiosConfig
   * @returns {string}
   */
  private createKey(axiosConfig: AxiosRequestConfig): string {
    const arr = this.config.axiosConfigPaths.map((key: string) => {
      const value = _.get(axiosConfig, key);

      if(typeof value !== 'string' || !value.length) {
        throw new Error(`Axios config "${value}" key doesn't exist or is empty.`);
      }

      return value;
    });

    return arr.join('___');
  }
}
