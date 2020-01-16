import { RedisClient } from 'redis';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as _ from 'lodash';

enum ERedisFlag {
  EXPIRATION = 'EX',
}

interface ICacheConfiguration {
  expirationInMS: number;
  separator: string;
  prefix: string;
  keyStrategy: string[];
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


  /**
   * @description Axios interceptor.
   * @param {AxiosInstance} axios
   * @returns {AxiosInstance}
   */
  axiosInterceptor(axios: AxiosInstance): AxiosInstance {
    const dataCached = undefined;

    // Add a request interceptor
    axios.interceptors.request.use(
      async (config) => {

        if([EHttpMethod.GET, EHttpMethod.POST].includes(<EHttpMethod> config.method.toLowerCase())) {
          console.log('=> TODO: cache implementation');
        }

        // Do something before request is sent
        return config;
      },
      error => {
        // Do something with request error
        return Promise.reject(error);
      },
    );

    // Add a response interceptor
    axios.interceptors.response.use(
      response => {
        // If the data was cached, we return it
        if(dataCached) {
          return dataCached;
        }

        return response;
      },
      error => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
      },
    );

    return axios;
  }

  /**
   * @description Create key from config paths.
   * @param {AxiosRequestConfig} configPaths
   * @param {AxiosRequestConfig} axiosConfig
   * @returns {string}
   */
  private createKey(configPaths: string[], axiosConfig: AxiosRequestConfig): string {
    const arr = configPaths.map((key: string) => {
      const value = _.get(axiosConfig, key);
      if(typeof value !== 'string' && !value.length) {
        throw new Error(`"${value}" key doesn't exist or is empty.`);
      }

      return value;
    });

    return arr.join('___');
  }
}
