import nock from 'nock';
import Redis from 'ioredis';
import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import { AxiosRedis } from '../src';

describe('index.ts', () => {
  let redis: Redis;
  let axiosRedis: AxiosRedis;
  let axiosInstance: AxiosInstance;

  beforeAll(async () => {
    redis = new Redis('redis://:@redis:6379');
    await redis.flushall();
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
          'G2EAICwOeHPIdVFmZtBmT4hSi+xtycwYmZlkgekrna4UaYFxynGgWFtyDC/cBe42tl0epRKqfUQDzGbHRckrS1+IEDxkWh4L8ROjp40=';

        // tslint:disable-next-line:no-backbone-get-set-outside-model
        const apiNock = nock('https://api.example.com')
          .get('/example1')
          .query({ param1: true, param2: 123 })
          .matchHeader('User-Agent', '@scope/package')
          .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
          .reply(200, {
            success: true,
          });

        const redisSetAsyncSpy = jest.spyOn(axiosRedis.redis, 'set');
        const redisGetAsyncSpy = jest.spyOn(axiosRedis.redis, 'get');

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
          'G2EAICwOeHPIdVFmZtBmT4hSi+xtycwYmZlkgekrna4UaYFxynGgWFtyDC/cBe42tl0epRKqfUQDzGbHRckrS1+IEDxkWh4L8ROjp40=';

        // tslint:disable-next-line:no-backbone-get-set-outside-model
        const apiNock = nock('https://api.example.com')
          .get('/example2')
          .query({ param1: true, param2: 123 })
          .matchHeader('User-Agent', '@scope/package')
          .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
          .reply(200, {
            success: true,
          });

        const redisSetAsyncSpy = jest.spyOn(axiosRedis.redis, 'set');
        const redisGetAsyncSpy = jest.spyOn(axiosRedis.redis, 'get');

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

      it('should recache the response on the first call (with custom recache header value)', async () => {
        // tslint:disable-next-line:no-backbone-get-set-outside-model
        const apiNock = nock('https://api.example.com')
          .get('/example-recache')
          .query({ param1: true, param2: 123 })
          .matchHeader('User-Agent', '@scope/package')
          .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
          .times(2)
          .reply(200, {
            success: true,
          });

        const redisSetAsyncSpy = jest.spyOn(axiosRedis.redis, 'set');
        const redisGetAsyncSpy = jest.spyOn(axiosRedis.redis, 'get');

        const url = '/example-recache?param1=true&param2=123';

        // tslint:disable-next-line:no-backbone-get-set-outside-model
        const responseLive = await axiosInstance.get(url, {
          headers: { 'Axios-Redis-Cache-Duration': '90000' },
        });

        const response2Live = await axiosInstance.get(url, {
          headers: { 'Axios-Redis-Recache': 'true' },
        });

        const responseFromCache = await axiosInstance.get(url);

        apiNock.done();

        const key = '@scope/package@1.0.1___["get"]___WyIvZXhhbXBsZS1yZWNhY2hlP3BhcmFtMT10cnVlJnBhcmFtMj0xMjMiXQ==___W10=___W10=';

        expect(redisGetAsyncSpy).toBeCalledTimes(2);
        expect(redisGetAsyncSpy.mock.calls).toEqual([[key], [key]]);

        expect(redisSetAsyncSpy).toBeCalledTimes(2);
        expect(redisSetAsyncSpy.mock.calls).toEqual([
          [
            '@scope/package@1.0.1___["get"]___WyIvZXhhbXBsZS1yZWNhY2hlP3BhcmFtMT10cnVlJnBhcmFtMj0xMjMiXQ==___W10=___W10=',
            'G2EAICwOeHPIdVFmZtBmT4hSi+xtycwYmZlkgekrna4UaYFxynGgWFtyDC/cBe42tl0epRKqfUQDzGbHRckrS1+IEDxkWh4L8ROjp40=',
            'PX',
            90000,
          ],
          [
            '@scope/package@1.0.1___["get"]___WyIvZXhhbXBsZS1yZWNhY2hlP3BhcmFtMT10cnVlJnBhcmFtMj0xMjMiXQ==___W10=___W10=',
            'G2EAICwOeHPIdVFmZtBmT4hSi+xtycwYmZlkgekrna4UaYFxynGgWFtyDC/cBe42tl0epRKqfUQDzGbHRckrS1+IEDxkWh4L8ROjp40=',
            'PX',
            30000,
          ],
        ]);

        expect(responseLive.status).toEqual(200);
        expect(responseLive.data).toStrictEqual({ success: true });
        expect(response2Live.status).toEqual(200);
        expect(response2Live.data).toStrictEqual({ success: true });
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
          'G2EAICwOeHPIdVFmZtBmT4hSi+xtycwYmZlkgekrna4UaYFxynGgWFtyDC/cBe42tl0epRKqfUQDzGbHRckrS1+IEDxkWh4L8ROjp40=';

        // tslint:disable-next-line:no-backbone-get-set-outside-model
        const apiNock = nock('https://api.example.com')
          .get('/example1')
          .query({ param1: true, param2: 123 })
          .matchHeader('User-Agent', '@scope/package')
          .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
          .reply(200, {
            success: true,
          });

        const redisSetAsyncSpy = jest.spyOn(axiosRedisRaw.redis, 'set');
        const redisGetAsyncSpy = jest.spyOn(axiosRedisRaw.redis, 'get');

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
          'G2EAICwOeHPIdVFmZtBmT4hSi+xtycwYmZlkgekrna4UaYFxynGgWFtyDC/cBe42tl0epRKqfUQDzGbHRckrS1+IEDxkWh4L8ROjp40=';

        const apiNock = nock('https://api.example.com')
          .post('/example1', { hello: 'world' })
          .query({ param1: true, param2: 123 })
          .matchHeader('User-Agent', '@scope/package')
          .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
          .reply(200, {
            success: true,
          });

        const redisSetAsyncSpy = jest.spyOn(axiosRedis.redis, 'set');
        const redisGetAsyncSpy = jest.spyOn(axiosRedis.redis, 'get');

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
          'G2EAICwOeHPIdVFmZtBmT4hSi+xtycwYmZlkgekrna4UaYFxynGgWFtyDC/cBe42tl0epRKqfUQDzGbHRckrS1+IEDxkWh4L8ROjp40=';

        const apiNock = nock('https://api.example.com')
          .post('/example1', { hello: 'world' })
          .query({ param1: true, param2: 123 })
          .matchHeader('User-Agent', '@scope/package')
          .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
          .reply(200, {
            success: true,
          });

        const redisSetAsyncSpy = jest.spyOn(axiosRedisRaw.redis, 'set');
        const redisGetAsyncSpy = jest.spyOn(axiosRedisRaw.redis, 'get');

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

        const redisSetAsyncSpy = jest.spyOn(axiosRedis.redis, 'set');
        const redisGetAsyncSpy = jest.spyOn(axiosRedis.redis, 'get');

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

        const redisSetAsyncSpy = jest.spyOn(axiosRedis.redis, 'set');
        const redisGetAsyncSpy = jest.spyOn(axiosRedis.redis, 'get');

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

        const redisSetAsyncSpy = jest.spyOn(axiosRedis.redis, 'set');
        const redisGetAsyncSpy = jest.spyOn(axiosRedis.redis, 'get');

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

        const redisSetAsyncSpy = jest.spyOn(axiosRedis.redis, 'set');
        const redisGetAsyncSpy = jest.spyOn(axiosRedis.redis, 'get');

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

        const redisSetAsyncSpy = jest.spyOn(axiosRedis.redis, 'set');
        const redisGetAsyncSpy = jest.spyOn(axiosRedis.redis, 'get');

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

        const redisSetAsyncSpy = jest.spyOn(axiosRedis.redis, 'set');
        const redisGetAsyncSpy = jest.spyOn(axiosRedis.redis, 'get');

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

      const redisSetAsyncSpy = jest.spyOn(axiosRedis.redis, 'set');
      const redisGetAsyncSpy = jest.spyOn(axiosRedis.redis, 'get');

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

      const redisSetAsyncSpy = jest.spyOn(axiosRedis.redis, 'set');
      const redisGetAsyncSpy = jest.spyOn(axiosRedis.redis, 'get').mockRejectedValue(new Error('Unexpected error.'));

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
