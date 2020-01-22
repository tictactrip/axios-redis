interface ICacheConfiguration {
  expirationInMS: number;
  separator: string;
  prefix: string;
  axiosConfigPaths: string[];
}

const defaultConfiguration: ICacheConfiguration = {
  expirationInMS: 30 * 1000,
  separator: '___',
  prefix: '@tictactrip/axios-redis',
  axiosConfigPaths: ['method', 'url', 'params', 'data'],
};

export { defaultConfiguration, ICacheConfiguration };
