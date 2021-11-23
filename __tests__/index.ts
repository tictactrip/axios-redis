import * as nock from 'nock';
import * as redisClient from 'redis';
import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import { AxiosRedis } from '../src';

describe('index.ts', () => {
  let redis: redisClient.RedisClient;
  let axiosRedis: AxiosRedis;
  let axiosInstance: AxiosInstance;

  beforeAll(() => {
    redis = redisClient.createClient({ host: 'redis' });
    redis.flushall('ASYNC');
    axiosRedis = new AxiosRedis(redis, {
      prefix: '@scope/package@1.0.1',
    });

    axiosInstance = axios.create({
      baseURL: 'https://api.example.com',
      headers: {
        'User-Agent': '@scope/package',
        'Api-Key': '3b48b9fd18ecca20ed5b0accbfeb6b70',
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      adapter: (config) => AxiosRedis.ADAPTER(config, axiosRedis),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    nock.cleanAll();
  });

  describe('Cache', () => {
    describe('GET', () => {
      it('should cache the response on the first call', async () => {
        const axiosResponseSetCache =
          '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';

        // tslint:disable-next-line:no-backbone-get-set-outside-model
        const apiNock = nock('https://api.example.com')
          .get('/example1')
          .query({ param1: true, param2: 123 })
          .matchHeader('User-Agent', '@scope/package')
          .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
          .reply(200, {
            success: true,
          });

        const redisSetAsyncSpy = jest.spyOn(axiosRedis, 'redisSetAsync');
        const redisGetAsyncSpy = jest.spyOn(axiosRedis, 'redisGetAsync');

        // tslint:disable-next-line:no-backbone-get-set-outside-model
        const response = await axiosInstance.get('/example1?param1=true&param2=123');

        // tslint:disable-next-line:no-backbone-get-set-outside-model
        const responseFromCache = await axiosInstance.get('/example1?param1=true&param2=123');

        apiNock.done();
        expect(redisSetAsyncSpy).toBeCalledTimes(1);
        expect(redisSetAsyncSpy).nthCalledWith(
          1,
          '@scope/package@1.0.1___["get"]___WyIvZXhhbXBsZTE/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___W10=',
          axiosResponseSetCache,
          'PX',
          30000,
        );
        expect(redisGetAsyncSpy).toBeCalledTimes(2);
        expect(redisGetAsyncSpy).nthCalledWith(
          1,
          '@scope/package@1.0.1___["get"]___WyIvZXhhbXBsZTE/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___W10=',
        );
        expect(redisGetAsyncSpy).nthCalledWith(
          2,
          '@scope/package@1.0.1___["get"]___WyIvZXhhbXBsZTE/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___W10=',
        );
        expect(response.status).toEqual(200);
        expect(response.data).toStrictEqual({ success: true });
        expect(responseFromCache.status).toEqual(200);
        expect(responseFromCache.data).toStrictEqual({ success: true });
      });

      it('should cache the response on the first call (with custom cache expiration value)', async () => {
        const axiosResponseSetCache =
          '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';

        // tslint:disable-next-line:no-backbone-get-set-outside-model
        const apiNock = nock('https://api.example.com')
          .get('/example2')
          .query({ param1: true, param2: 123 })
          .matchHeader('User-Agent', '@scope/package')
          .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
          .reply(200, {
            success: true,
          });

        const redisSetAsyncSpy = jest.spyOn(axiosRedis, 'redisSetAsync');
        const redisGetAsyncSpy = jest.spyOn(axiosRedis, 'redisGetAsync');

        // tslint:disable-next-line:no-backbone-get-set-outside-model
        const response = await axiosInstance.get('/example2?param1=true&param2=123', {
          headers: { 'Axios-Redis-Cache-Duration': '90000' },
        });

        // tslint:disable-next-line:no-backbone-get-set-outside-model
        const responseFromCache = await axiosInstance.get('/example2?param1=true&param2=123');

        apiNock.done();
        expect(redisSetAsyncSpy).toBeCalledTimes(1);
        expect(redisSetAsyncSpy).nthCalledWith(
          1,
          '@scope/package@1.0.1___["get"]___WyIvZXhhbXBsZTI/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___W10=',
          axiosResponseSetCache,
          'PX',
          90000,
        );
        expect(redisGetAsyncSpy).toBeCalledTimes(2);
        expect(redisGetAsyncSpy).nthCalledWith(
          1,
          '@scope/package@1.0.1___["get"]___WyIvZXhhbXBsZTI/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___W10=',
        );
        expect(redisGetAsyncSpy).nthCalledWith(
          2,
          '@scope/package@1.0.1___["get"]___WyIvZXhhbXBsZTI/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___W10=',
        );
        expect(response.status).toEqual(200);
        expect(response.data).toStrictEqual({ success: true });
        expect(responseFromCache.status).toEqual(200);
        expect(responseFromCache.data).toStrictEqual({ success: true });
      });

      it('should cache the response on the first call (with default configuration)', async () => {
        const axiosRedisRaw = new AxiosRedis(redis);

        const axiosInstanceRaw = axios.create({
          baseURL: 'https://api.example.com',
          headers: {
            'User-Agent': '@scope/package',
            'Api-Key': '3b48b9fd18ecca20ed5b0accbfeb6b70',
          },
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
          adapter: (config) => AxiosRedis.ADAPTER(config, axiosRedisRaw),
        });

        const axiosResponseSetCache =
          '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';

        // tslint:disable-next-line:no-backbone-get-set-outside-model
        const apiNock = nock('https://api.example.com')
          .get('/example1')
          .query({ param1: true, param2: 123 })
          .matchHeader('User-Agent', '@scope/package')
          .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
          .reply(200, {
            success: true,
          });

        const redisSetAsyncSpy = jest.spyOn(axiosRedisRaw, 'redisSetAsync');
        const redisGetAsyncSpy = jest.spyOn(axiosRedisRaw, 'redisGetAsync');

        // tslint:disable-next-line:no-backbone-get-set-outside-model
        const response = await axiosInstanceRaw.get('/example1?param1=true&param2=123');

        // tslint:disable-next-line:no-backbone-get-set-outside-model
        const responseFromCache = await axiosInstanceRaw.get('/example1?param1=true&param2=123');

        apiNock.done();
        expect(redisSetAsyncSpy).toBeCalledTimes(1);
        expect(redisSetAsyncSpy).nthCalledWith(
          1,
          '@tictactrip/axios-redis___["get"]___WyIvZXhhbXBsZTE/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___W10=',
          axiosResponseSetCache,
          'PX',
          30000,
        );
        expect(redisGetAsyncSpy).toBeCalledTimes(2);
        expect(redisGetAsyncSpy).nthCalledWith(
          1,
          '@tictactrip/axios-redis___["get"]___WyIvZXhhbXBsZTE/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___W10=',
        );
        expect(redisGetAsyncSpy).nthCalledWith(
          2,
          '@tictactrip/axios-redis___["get"]___WyIvZXhhbXBsZTE/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___W10=',
        );
        expect(response.status).toEqual(200);
        expect(response.data).toStrictEqual({ success: true });
        expect(responseFromCache.status).toEqual(200);
        expect(responseFromCache.data).toStrictEqual({ success: true });
      });
    });

    describe('POST', () => {
      it('should cache the response on the first call', async () => {
        const axiosResponseSetCache =
          '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';

        const apiNock = nock('https://api.example.com')
          .post('/example1', { hello: 'world' })
          .query({ param1: true, param2: 123 })
          .matchHeader('User-Agent', '@scope/package')
          .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
          .reply(200, {
            success: true,
          });

        const redisSetAsyncSpy = jest.spyOn(axiosRedis, 'redisSetAsync');
        const redisGetAsyncSpy = jest.spyOn(axiosRedis, 'redisGetAsync');

        const response = await axiosInstance.post('/example1?param1=true&param2=123', { hello: 'world' });

        const responseFromCache = await axiosInstance.post('/example1?param1=true&param2=123', { hello: 'world' });

        apiNock.done();

        expect(redisSetAsyncSpy).toBeCalledTimes(1);
        expect(redisSetAsyncSpy).nthCalledWith(
          1,
          '@scope/package@1.0.1___["post"]___WyIvZXhhbXBsZTE/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___WyJ7XCJoZWxsb1wiOlwid29ybGRcIn0iXQ==',
          axiosResponseSetCache,
          'PX',
          30000,
        );
        expect(redisGetAsyncSpy).toBeCalledTimes(2);
        expect(redisGetAsyncSpy).nthCalledWith(
          1,
          '@scope/package@1.0.1___["post"]___WyIvZXhhbXBsZTE/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___WyJ7XCJoZWxsb1wiOlwid29ybGRcIn0iXQ==',
        );
        expect(redisGetAsyncSpy).nthCalledWith(
          2,
          '@scope/package@1.0.1___["post"]___WyIvZXhhbXBsZTE/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___WyJ7XCJoZWxsb1wiOlwid29ybGRcIn0iXQ==',
        );
        expect(response.status).toEqual(200);
        expect(response.data).toStrictEqual({ success: true });
        expect(responseFromCache.status).toEqual(200);
        expect(responseFromCache.data).toStrictEqual({ success: true });
      });

      it('should cache the response on the first call (with default configuration)', async () => {
        const axiosRedisRaw = new AxiosRedis(redis);

        const axiosInstanceRaw = axios.create({
          baseURL: 'https://api.example.com',
          headers: {
            'User-Agent': '@scope/package',
            'Api-Key': '3b48b9fd18ecca20ed5b0accbfeb6b70',
          },
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
          adapter: (config) => AxiosRedis.ADAPTER(config, axiosRedisRaw),
        });

        const axiosResponseSetCache =
          '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';

        const apiNock = nock('https://api.example.com')
          .post('/example1', { hello: 'world' })
          .query({ param1: true, param2: 123 })
          .matchHeader('User-Agent', '@scope/package')
          .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
          .reply(200, {
            success: true,
          });

        const redisSetAsyncSpy = jest.spyOn(axiosRedisRaw, 'redisSetAsync');
        const redisGetAsyncSpy = jest.spyOn(axiosRedisRaw, 'redisGetAsync');

        const response = await axiosInstanceRaw.post('/example1?param1=true&param2=123', { hello: 'world' });

        const responseFromCache = await axiosInstanceRaw.post('/example1?param1=true&param2=123', { hello: 'world' });

        apiNock.done();

        expect(redisSetAsyncSpy).toBeCalledTimes(1);
        expect(redisSetAsyncSpy).nthCalledWith(
          1,
          '@tictactrip/axios-redis___["post"]___WyIvZXhhbXBsZTE/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___WyJ7XCJoZWxsb1wiOlwid29ybGRcIn0iXQ==',
          axiosResponseSetCache,
          'PX',
          30000,
        );
        expect(redisGetAsyncSpy).toBeCalledTimes(2);
        expect(redisGetAsyncSpy).nthCalledWith(
          1,
          '@tictactrip/axios-redis___["post"]___WyIvZXhhbXBsZTE/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___WyJ7XCJoZWxsb1wiOlwid29ybGRcIn0iXQ==',
        );
        expect(redisGetAsyncSpy).nthCalledWith(
          2,
          '@tictactrip/axios-redis___["post"]___WyIvZXhhbXBsZTE/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___WyJ7XCJoZWxsb1wiOlwid29ybGRcIn0iXQ==',
        );
        expect(response.status).toEqual(200);
        expect(response.data).toStrictEqual({ success: true });
        expect(responseFromCache.status).toEqual(200);
        expect(responseFromCache.data).toStrictEqual({ success: true });
      });
    });
  });

  describe('Not cache', () => {
    describe('POST', () => {
      it('should not cache (if "Axios-Redis-Cache-Duration" header = null)', async () => {
        const apiNock = nock('https://api.example.com')
          .post('/example/1', { hello: 'world' })
          .query({ sort: 'desc' })
          .matchHeader('User-Agent', '@scope/package')
          .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
          .reply(200, {
            success: true,
          });

        const redisSetAsyncSpy = jest.spyOn(axiosRedis, 'redisSetAsync');
        const redisGetAsyncSpy = jest.spyOn(axiosRedis, 'redisGetAsync');

        const response = await axiosInstance.post(
          '/example/1?sort=desc',
          {
            hello: 'world',
          },
          { headers: { 'Axios-Redis-Cache-Duration': null } },
        );

        apiNock.done();
        expect(redisSetAsyncSpy).toBeCalledTimes(0);
        expect(redisGetAsyncSpy).toBeCalledTimes(1);
        expect(redisGetAsyncSpy).nthCalledWith(
          1,
          '@scope/package@1.0.1___["post"]___WyIvZXhhbXBsZS8xP3NvcnQ9ZGVzYyJd___W10=___WyJ7XCJoZWxsb1wiOlwid29ybGRcIn0iXQ==',
        );
        expect(response.status).toEqual(200);
        expect(response.data).toStrictEqual({ success: true });
      });

      it('should not cache (if "Axios-Redis-Cache-Duration" header = 0)', async () => {
        const apiNock = nock('https://api.example.com')
          .post('/example/1', { hello: 'world' })
          .query({ sort: 'desc' })
          .matchHeader('User-Agent', '@scope/package')
          .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
          .reply(200, {
            success: true,
          });

        const redisSetAsyncSpy = jest.spyOn(axiosRedis, 'redisSetAsync');
        const redisGetAsyncSpy = jest.spyOn(axiosRedis, 'redisGetAsync');

        const response = await axiosInstance.post(
          '/example/1?sort=desc',
          {
            hello: 'world',
          },
          { headers: { 'Axios-Redis-Cache-Duration': '0' } },
        );

        apiNock.done();
        expect(redisSetAsyncSpy).toBeCalledTimes(0);
        expect(redisGetAsyncSpy).toBeCalledTimes(1);
        expect(redisGetAsyncSpy).nthCalledWith(
          1,
          '@scope/package@1.0.1___["post"]___WyIvZXhhbXBsZS8xP3NvcnQ9ZGVzYyJd___W10=___WyJ7XCJoZWxsb1wiOlwid29ybGRcIn0iXQ==',
        );
        expect(response.status).toEqual(200);
        expect(response.data).toStrictEqual({ success: true });
      });
    });

    describe('GET', () => {
      it('should not cache (if "Axios-Redis-Cache-Duration" header = null)', async () => {
        const apiNock = nock('https://api.example.com')
          .get('/example/1')
          .query({ sort: 'desc' })
          .matchHeader('User-Agent', '@scope/package')
          .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
          .reply(200, {
            success: true,
          });

        const redisSetAsyncSpy = jest.spyOn(axiosRedis, 'redisSetAsync');
        const redisGetAsyncSpy = jest.spyOn(axiosRedis, 'redisGetAsync');

        const response = await axiosInstance.get('/example/1?sort=desc', {
          headers: { 'Axios-Redis-Cache-Duration': null },
        });

        apiNock.done();
        expect(redisSetAsyncSpy).toBeCalledTimes(0);
        expect(redisGetAsyncSpy).toBeCalledTimes(1);
        expect(redisGetAsyncSpy).nthCalledWith(1, '@scope/package@1.0.1___["get"]___WyIvZXhhbXBsZS8xP3NvcnQ9ZGVzYyJd___W10=___W10=');
        expect(response.status).toEqual(200);
        expect(response.data).toStrictEqual({ success: true });
      });

      it('should not cache (if "Axios-Redis-Cache-Duration" header = 0)', async () => {
        const apiNock = nock('https://api.example.com')
          .get('/example/1')
          .query({ sort: 'desc' })
          .matchHeader('User-Agent', '@scope/package')
          .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
          .reply(200, {
            success: true,
          });

        const redisSetAsyncSpy = jest.spyOn(axiosRedis, 'redisSetAsync');
        const redisGetAsyncSpy = jest.spyOn(axiosRedis, 'redisGetAsync');

        const response = await axiosInstance.get('/example/1?sort=desc', {
          headers: { 'Axios-Redis-Cache-Duration': '0' },
        });

        apiNock.done();
        expect(redisSetAsyncSpy).toBeCalledTimes(0);
        expect(redisGetAsyncSpy).toBeCalledTimes(1);
        expect(redisGetAsyncSpy).nthCalledWith(1, '@scope/package@1.0.1___["get"]___WyIvZXhhbXBsZS8xP3NvcnQ9ZGVzYyJd___W10=___W10=');
        expect(response.status).toEqual(200);
        expect(response.data).toStrictEqual({ success: true });
      });
    });

    describe('PUT', () => {
      it('should not cache', async () => {
        const apiNock = nock('https://api.example.com')
          .put('/example/1', { hello: 'world' })
          .query({ sort: 'desc' })
          .matchHeader('User-Agent', '@scope/package')
          .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
          .reply(200, {
            success: true,
          });

        const redisSetAsyncSpy = jest.spyOn(axiosRedis, 'redisSetAsync');
        const redisGetAsyncSpy = jest.spyOn(axiosRedis, 'redisGetAsync');

        const response = await axiosInstance.put('/example/1?sort=desc', {
          hello: 'world',
        });

        apiNock.done();
        expect(redisSetAsyncSpy).toBeCalledTimes(0);
        expect(redisGetAsyncSpy).toBeCalledTimes(0);
        expect(response.status).toEqual(200);
        expect(response.data).toStrictEqual({ success: true });
      });
    });

    describe('DELETE', () => {
      it('should not cache', async () => {
        const apiNock = nock('https://api.example.com')
          .delete('/example/1', { hello: 'world' })
          .query({ sort: 'desc' })
          .matchHeader('User-Agent', '@scope/package')
          .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
          .reply(200);

        const redisSetAsyncSpy = jest.spyOn(axiosRedis, 'redisSetAsync');
        const redisGetAsyncSpy = jest.spyOn(axiosRedis, 'redisGetAsync');

        const response = await axiosInstance.delete('/example/1', {
          data: { hello: 'world' },
          params: { sort: 'desc' },
        });

        apiNock.done();
        expect(redisSetAsyncSpy).toBeCalledTimes(0);
        expect(redisGetAsyncSpy).toBeCalledTimes(0);
        expect(response.status).toEqual(200);
      });
    });
  });

  describe('Error handling', () => {
    it('should return axios error on failure request', async () => {
      // tslint:disable-next-line:no-backbone-get-set-outside-model
      const apiNock = nock('https://api.example.com')
        .get('/example3')
        .query({ param1: true, param2: 123 })
        .matchHeader('User-Agent', '@scope/package')
        .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
        .reply(400, {
          success: false,
        });

      const redisSetAsyncSpy = jest.spyOn(axiosRedis, 'redisSetAsync');
      const redisGetAsyncSpy = jest.spyOn(axiosRedis, 'redisGetAsync');

      let error: Error | null = null;

      try {
        // tslint:disable-next-line:no-backbone-get-set-outside-model
        await axiosInstance.get('/example3?param1=true&param2=123');
      } catch (err) {
        error = err;
      }

      apiNock.done();
      expect(error).toEqual(new Error('Request failed with status code 400'));
      expect(redisSetAsyncSpy).toBeCalledTimes(0);
      expect(redisGetAsyncSpy).toBeCalledTimes(1);
      expect(redisGetAsyncSpy).nthCalledWith(
        1,
        '@scope/package@1.0.1___["get"]___WyIvZXhhbXBsZTM/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___W10=',
      );
    });

    it('should send the request in case of any error (excepted axios request)', async () => {
      // tslint:disable-next-line:no-backbone-get-set-outside-model
      const apiNock = nock('https://api.example.com')
        .get('/example4')
        .query({ param1: true, param2: 123 })
        .matchHeader('User-Agent', '@scope/package')
        .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
        .reply(200, {
          success: true,
        });

      const redisSetAsyncSpy = jest.spyOn(axiosRedis, 'redisSetAsync');
      const redisGetAsyncSpy = jest.spyOn(axiosRedis, 'redisGetAsync').mockRejectedValue(new Error('Unexpected error.'));

      // tslint:disable-next-line:no-backbone-get-set-outside-model
      const response = await axiosInstance.get('/example4?param1=true&param2=123');

      apiNock.done();
      expect(redisSetAsyncSpy).toBeCalledTimes(0);
      expect(redisGetAsyncSpy).toBeCalledTimes(1);
      expect(redisGetAsyncSpy).nthCalledWith(
        1,
        '@scope/package@1.0.1___["get"]___WyIvZXhhbXBsZTQ/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___W10=',
      );
      expect(response.status).toEqual(200);
      expect(response.data).toStrictEqual({ success: true });
    });
  });
});
