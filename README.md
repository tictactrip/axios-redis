# axios-redis

[![Coverage][coverage-badge]][coverage]
[![Build Status][travis-badge]][travis-ci]
[![License][license-badge]][LICENSE]
[![PRs Welcome][prs-badge]][prs]

## Description

This repository provides a smart and powerful Axios Redis cache adapter.
Cached data is compressed with [zlib](https://nodejs.org/api/zlib.html) and [Brotli](https://nodejs.org/api/zlib.html#class-brotlioptions).

## Install

```
yarn add @tictactrip/axios-redis
```

## Example

```ts
import * as redis from 'redis';
import axios from 'axios';
import { AxiosRedis } from '@tictactrip/axios-redis';

// Redis connexion
const redis = redisClient.createClient({ host: 'localhost' });

// Create your AxiosRedis instance (config parameter is optional)
const axiosRedis = new AxiosRedis(redis, {
  expirationInMS: 30000,
  separator: '___',
  prefix: '@tictactrip/axios-redis',
  axiosConfigPaths: ['method', 'url', 'params', 'data'],
});

// Create your Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://api.example.com',
  adapter: (config) => AxiosRedis.ADAPTER(config, axiosRedis),
});

// Response will be cached on first call
await axiosInstance.get('/user?ID=12345');

// On second call, if response is still cached, adapter returns cached response without sending the request
await axiosInstance.get('/user?ID=12345');
```

### HTTP methods cached 

As default, all **GET** and **POST** responses are cached.
If you want to customize them, you can also do:

```ts 
axiosRedis.methodsToCache = [EHttpMethod.GET];
```

### Key structure

By default, redis keys follow this pattern

```ts
{prefix}___{http_method}___{axios_config_url}___base64{axios_config_params}___base64{axios_config_data}
```

Example:

```ts
@scope/package@1.0.1___["post"]___WyIvZXhhbXBsZTE/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___WyJ7XCJoZWxsb1wiOlwid29ybGRcIn0iXQ==
```

If you want to customize the keys, you just need to customize your `AxiosRedis` instance.

### Disable cache for one request

```ts
// This request won't be cached
await axiosInstance.get('/user?ID=12345', { 
  headers: {
    'Axios-Redis-Cache-Duration': null,
  },
});
```

### Customize cache duration for one request

```ts
// This request will be cached during 90000ms
await axiosInstance.get('/user?ID=12345', { 
  headers: {
    'Axios-Redis-Cache-Duration': 90000,
  },
});
```

### Tests

How can I mock Redis connection with Jest in my unit tests?

```ts
import * as redis from 'redis';
import { AxiosRedis } from '@tictactrip/axios-redis';

describe('Example', () => {
  it('should send the request without a redis connection', () => {
    const redisClient = redis.createClient({ retry_strategy: jest.fn() });

    const axiosRedisSpy = jest.spyOn(AxiosRedis.prototype, 'getCache')
      .mockRejectedValue(new Error('Bypass Redis for tests'));
      
    // ...
  });
});
```

## Scripts

Run using yarn run `<script>` command.

    clean       - Remove temporarily folders.
    build       - Compile source files.
    build:watch - Interactive watch mode, compile sources on change.
    lint        - Lint source files.
    lint:fix    - Fix lint source files.
    test        - Runs all tests with coverage.

## License

GPL-3.0 © [Tictactrip](https://www.tictactrip.eu)

[coverage-badge]: https://codecov.io/gh/tictactrip/axios-redis/branch/master/graph/badge.svg
[coverage]: https://codecov.io/gh/tictactrip/axios-redis
[travis-badge]: https://travis-ci.org/tictactrip/axios-redis.svg?branch=master
[travis-ci]: https://travis-ci.org/tictactrip/axios-redis
[license-badge]: https://img.shields.io/badge/license-GPL3-blue.svg?style=flat-square
[license]: https://github.com/tictactrip/axios-redis/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
