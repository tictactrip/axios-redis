enum EAxiosCacheHeaders {
  CacheDuration = 'Axios-Redis-Cache-Duration',
  Recache = 'Axios-Redis-Recache',
}

enum ERedisFlag {
  EXPIRATION_IN_MS = 'PX',
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

export { ERedisFlag, EHttpMethod, EAxiosCacheHeaders };
