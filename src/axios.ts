import { AxiosInstance } from 'axios';
import { RedisClient } from 'redis';

interface IConfiguration {
  keyStrategy: [],
}

export function axiosRedisCache(axios: AxiosInstance): AxiosInstance {
// export function axiosRedisCache(axios: AxiosInstance, redisClient: RedisClient, config: IConfiguration): AxiosInstance {

  const dataCached = undefined;


  // Add a request interceptor
  axios.interceptors.request.use(
    config => {



      console.log(JSON.stringify(config));
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
