import nock from 'nock';
import * as redisClient from 'redis';
import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import { AxiosRedis } from '../src';

describe('index.ts', () => {
  let redis: redisClient.RedisClientType;
  let axiosRedis: AxiosRedis;
  let axiosInstance: AxiosInstance;

  beforeAll(async () => {
    redis = redisClient.createClient({
      url: 'redis://:@redis:6379',
      legacyMode: true,
    });
    await redis.connect();
    await redis.flushAll();
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
          'G28eUZQPznuiqNwcgNAigafulYNiIYVCXsPYtw8yLLey5QhyE5VtTtPlAdZhmilBJ0bSGUP2t3T96eq8/aVl/OnuniytZwg8FQswBEtrlq62vsWio9FVkTcP5KknhUtwcv7XNE1p61JhAAmBpcN0hu/9smPpzp7R3tkzWutSatvVpUhJZ72gABqaCSAgCBrQ8HxwmTz/XerEFi1NYTWl2R1oSgUJxlo1CbBF8F6ysnFa+30n+QghgC7R6nV2LP+6ABZEeoenkINN3NSwjSjH2Q8qNSbjSBGN2bjI9EbIe7cUkFiEbcD7/QCPUXI8EDyOBDGhJxPa6kz1M69lQtQNqjH3ff6Nn1CeDYzPLdEbngb7AOE2BHAzLzEsTuRGWP5biVh+t+EkFT3lKC7JjEJKoL4gfj7qNyGmohNZIP80PJvmxsKLmfysj0+VpZSzMzejhgAMlRIIdafj8PjwWbOYrOvAJ3y/qOr+qnnLOthnpvBsC/piJuImC7iY7s7igMzDzwZxJ4DnWpLjF8kRdFEXv6c6wpGM/OiiYoSbyrP4yDnBQqGd/F1Yaix0LbiuBfkJNwcl9gxF85UHPTUs1elnRnNqmlpT1GmIMPveaEcSJlDc0kj8Z6iJb6j91kZhtoBDYpA5y4IAkaOSHtBkYiSJbJmTB4pVh8yMnq78Yhmp7bjLSXeTHo4wU3pggHMoKiM12LSKDID6h1oSdZTTX2hiZLMQD5AHJDVD9EmmuaEMaXWj+Y4YVIoEctgCIn2YGV/kpNO0nUOJsQHniwxiYr7wRjpB1yUQ7Sg/ojCqYF+X6IRdmfSsLXqF0bDCgm/u9CT/R8HyT2+DC7iU0QL2X+eYDvpl65ISN5ZrFiRZ+PJO6ED8E0JBuA0NM7wxJy0BMOr67JziVgPvkGolU5bLuJ+cdcXqjRmXQDW/FW9BFL/kDmRcxBJjy+4uK9IT4cd6MWxVE2WAVPUwz1PuMQZAXQ9Yll4MoTAqA6iRZds9rQTpJ+y2lYXmJDxsYtCagLVylidLH8m4PCaB9ywmubmWZVAxYKlyM4Q5CSN1iCaUiiRSpRSOvKGYEnryAJCmq7PfNlhmnwyU/lj0zsnO5p8XGHvHlvB1gar0S3hzxEfGh8bYstfLamDkKIP+CgXVd2VgadwTy4W58Em5fJdOGYFeUCjkeC/5HxijCoWkq7HuUaJK2UJjOw/1M8NgsbYxmyUrI540rmVAiWdB/o/p6CzVImIDzFCugandSxn4dsVjKHBGvbDlCoA5tsTCMjM+v8MKawrToM+vKNxrRJ2zwaxu1ZRDS/joZMw2GQCmCHu8tLowvGSDifCkrUnO2QgNuzQg/Yn4qt4UitgdYk6S27rQLQ7aOhcKVdPQ8tgucq3S0vsHSKMg+G40AAxSO6JAUyg7vUhiqUfcWVnYUqbYQjMOm1DCxPaEX3psjIoVr89sZluNqgfsDZXA9xE7nxQCVmlajZiOcOgLqpol8kDUhA+sgbTv6bR5UA8Oen0rEq+I0z8zgnV4AkTIKgKShYkynAioetv2DZc3qJc+7wta0epAYERX3QAlAOnhOlFtg3Qj03fehBiy0UGT1Y/TANkEw25geMBtp5n4AWAAJP88ldL0fmTO/ZP+A/9kV8la6TW6fx9w/70+P3/M7jelxImb+fP/l9J4g3Eww4C92D64+rcdQerov43hZv8up2INlsaFXJIjXj4zEuJbeMkJOSZGX6YVEVPdt/X9uCPfSPmWKEJnAaV6zwYn1m9r3YsHW68Hvv1PfE0BTLjSJN8EsVJjQ6KZL9CS0xCA2s/q0NfDsxRUnj9ELMrAyiqNTcGQlYthntqbWkRhIEflqA2xkSZJgogCWH9Piuv3stPcsDlWDGHx/ktd3449dYdmAElqaYenwl53Gw+nZw1inC+hUh+QafIJDMWTVNIhG8kDoCryozSGUYs5rCF3YrjflkOzaELRh3LVxIGfCV+a8DQ6IQWA3aEAlI1YTEpx3pqhxrfLoHHK4P0ECawx2SX8uGjbDNiU2fdtxGvsT7BkkeXP9RE/ipMckyEnnfBlXnGNdQJMc6b+W4+YLqSo4/hnKp3JJnWrhzCKU+lMNqk7JfBw1ozgK7HSxkquCSTeKQ08lnEWyJ7HRUOWK3tKUkczChMhk2KtjLZGsq2pDAZc2AYhk2KtrJaaoQCLQi7ugkJNhq0S7TJNWBRycTcUajJslaRbNGRZlEv3wKCQi9tMTbp6aMCgJWGX6oVGQ5ZFuXQTBh/crYGv26zfP87g/jP3pi8YzJ8Zzl8zmn/NeJ4Do8/TfYR5x9RWj3Fat9ebjXb7888/p8zN136FJge4+uwnnFvInc5oCFyieBotHO/OgEscfxSolAJwY9h8nGQI/jXWKbRb1qWHx9LeUr9SeppsXHR0vOv5hvRD0ikeZzcy/2i7M6yV4+n/S23qkrhnnKlKWkaSlmxIc1RK2sW50y/Vg/80omdAh//GoWc4w5H5ftjPgd2onRT/Rn14wjumKI1e4KE2R054j4ttyrR5ipHXHvDxzKqcQ3M6OcoBFlQ189KHbSksd5nwNiOKov/3nym33QAk490DIA18b1rHbyiAsaU6Hv4aoNZKjZIFdU6VA6t4wKk0vCZIjgHmqHcH8aDghNik+TWT2EIBMZJbCuu6q2bjLiDTCF7kCduR2IvAylWHob86Rp1wcTq+bVRwUNx46CugciQSiRNcAiQHikmK2gUKs04ZFSDIyJ4Uu8BQe7B9JkU2bGDZhJTxFN6kzkcuYfxxq70fSvkbN6GK7X4N5KXY1tj6CZC/rViW5NSLuwsHxPBkw6uQl25qM3pJWXtqP5dKvA+JkgwwzRM3i4i4cvMeHADOKgnDzb0+XtLDGw+4zoq4upGjoOFAlrgYr7yh5vZqrkGSEl7LgkAloS07VPMw55g6U8LlwJel3sWxHAalC3hS8yhm2kYpzRzuakG4CnutyK4Ed3FxCosogChhW8MDR3yviPjaOgUw2Bwu19e0cSsNJ6a/RH7wciCXHPDJP1lEgxQtJ5gLB3mJX1K6UUTGp3oVmDo4jK2dbpTAfamG6ak67ObbL34iYlMFnudo7rL54zn7Ys7tyzNWspIA';

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
