enum ERedisFlag {
  EXPIRATION = 'EX',
}

interface ICacheConfiguration {
  expirationInMS: number;
  separator: string;
  prefix: string;
  axiosConfigPaths: string[];
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

export { ERedisFlag, ICacheConfiguration, EHttpMethod };
