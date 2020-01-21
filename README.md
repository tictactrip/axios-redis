# axios-redis

[![Dependencies][prod-dependencies-badge]][prod-dependencies]
[![Coverage][coverage-badge]][coverage]
[![Build Status][travis-badge]][travis-ci]
[![License][license-badge]][LICENSE]
[![PRs Welcome][prs-badge]][prs]

## Description

This repository provides an axios redis cache adapter.

## Install

```
yarn add @tictactrip/axios-redis
```

## How to use it?

```ts
import * as redis from 'redis';
import axios from 'axios';
import { AxiosRedis } from '@tictactrip/axios-redis';

// Redis connexion
const redis = redisClient.createClient({ host: 'localhost' });

// Create your AxiosRedis instance
const axiosRedis = new AxiosRedis(redis, {
  expirationInMS: 30000,
  prefix: '@tictactrip/package@1.0.0',
  separator: '___',
  axiosConfigPaths: ['method', 'url', 'params', 'data'],
});

// Create your Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://api.example.com',
  adapter: axiosRedis.axiosAdapter,
});

// Response will be cache on first call
await axiosInstance.get('/user?ID=12345');

// On second call, if response is still cached, adapter returns cached response without sending the request
await axiosInstance.get('/user?ID=12345');
```

### Which are caches HTTP methods?

As default, all *GET* and *POST* responses are cached.
If you want to customize it, you can also override them:

```ts 
axiosRedis.methodsToCache: = [EHttpMethod.GET];
```

### What's the de key structure?

As default, keys have bellow pattern:

```ts
{prefix}___{http_method}___{axios_config_url}___base64{axios_config_params}___base64{axios_config_data}
```

Example:

```ts
@scope/package@1.0.1___["post"]___WyIvZXhhbXBsZTE/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___WyJ7XCJoZWxsb1wiOlwid29ybGRcIn0iXQ==
```

If you want to customize the keys, you just need to customize your `AxiosRedis` instance.

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

[prod-dependencies-badge]: https://david-dm.org/tictactrip/axios-redis/status.svg
[prod-dependencies]: https://david-dm.org/tictactrip/axios-redis
[coverage-badge]: https://codecov.io/gh/tictactrip/axios-redis/branch/master/graph/badge.svg
[coverage]: https://codecov.io/gh/tictactrip/axios-redis
[travis-badge]: https://travis-ci.org/tictactrip/axios-redis.svg?branch=master
[travis-ci]: https://travis-ci.org/tictactrip/axios-redis
[license-badge]: https://img.shields.io/badge/license-GPL3-blue.svg?style=flat-square
[license]: https://github.com/tictactrip/axios-redis/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
