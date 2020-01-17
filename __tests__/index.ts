// @flow
import * as nock from 'nock';
import * as bluebird from 'bluebird';
import * as redisClient from 'redis';
import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import { AxiosRedis } from '../src';

describe('index.ts', () => {
  let redis: redisClient.RedisClient;
  let axiosRedis: AxiosRedis;
  let axiosInstance: AxiosInstance;

  beforeAll(() => {
    bluebird.promisifyAll(redisClient.RedisClient.prototype);
    bluebird.promisifyAll(redisClient.Multi.prototype);
    redis = redisClient.createClient({ host: 'redis' });
    redis.flushall('ASYNC'); // TMP

    axiosRedis = new AxiosRedis(redis, {
      expirationInMS: 30 * 1000,
      prefix: '@scope/package',
      separator: '___',
      axiosConfigPaths: ['method'],
    });

    axiosInstance = axios.create({
      baseURL: 'https://api.example.com',
      headers: {
        'User-Agent': '@scope/example',
        'Api-Key': '3b48b9fd18ecca20ed5b0accbfeb6b70',
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      adapter: axiosRedis.axiosAdapter,
    });
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('GET', () => {
    it('should cache cache axios response, and direct returning axios response from cache on the second call', async () => {
      const axiosResponseSetCache =
        '[{"status":200,"statusText":null,"headers":"1","config":"2","request":"3","data":"4"},{"content-type":"5"},{"url":"6","method":"7","headers":"8","baseURL":"9","transformRequest":"10","transformResponse":"11","timeout":0,"xsrfCookieName":"12","xsrfHeaderName":"13","maxContentLength":-1,"httpsAgent":"14"},{"_events":"15","_eventsCount":5,"outputData":"16","outputSize":0,"writable":true,"_last":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":false,"_removedConnection":false,"_removedContLen":false,"_removedTE":false,"_contentLength":null,"_hasBody":true,"_trailer":"17","finished":false,"_headerSent":false,"socket":"18","connection":"18","_header":null,"path":"6","method":"19","req":"3","options":"20","interceptors":"21","response":"22","playbackStarted":false,"requestBodyBuffers":"23","_redirectable":"24","headers":"25"},{"success":true},"application/json","/example?param1=true&param2=123","get",{"Accept":"26","User-Agent":"27","Api-Key":"28"},"https://api.example.com",[null],[null],"XSRF-TOKEN","X-XSRF-TOKEN",{"_events":"29","_eventsCount":1,"defaultPort":443,"protocol":"30","options":"31","requests":"32","sockets":"33","freeSockets":"34","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxCachedSessions":100,"_sessionCache":"35"},{},[],"",{"_events":"36","_eventsCount":2,"authorized":true,"bufferSize":0,"writable":true,"readable":true,"pending":false,"destroyed":false,"connecting":false,"totalDelayMs":0,"timeoutMs":null,"remoteFamily":"37","remoteAddress":"38","localAddress":"38","remotePort":443,"localPort":443},"GET",{"protocol":"30","maxRedirects":21,"maxBodyLength":10485760,"path":"6","method":"19","headers":"39","agent":"14","agents":"40","hostname":"41","port":443,"nativeProtocols":"42","pathname":"43","search":"44","proto":"45","host":"46"},[],{"_readableState":"47","readable":false,"_events":"48","_eventsCount":3,"socket":"18","connection":"18","httpVersionMajor":null,"httpVersionMinor":null,"httpVersion":null,"complete":true,"headers":"1","rawHeaders":"49","trailers":"50","rawTrailers":"51","aborted":false,"upgrade":null,"url":"17","method":null,"statusCode":200,"statusMessage":null,"client":"18","_consuming":true,"_dumped":false,"req":"3","responseUrl":"52","redirects":"53"},[],{"_writableState":"54","writable":true,"_events":"55","_eventsCount":2,"_options":"56","_redirectCount":0,"_redirects":"53","_requestBodyLength":0,"_requestBodyBuffers":"57","_currentRequest":"3","_currentUrl":"52"},{"accept":"26","user-agent":"27","api-key":"28","host":"41"},"application/json, text/plain, */*","@scope/example","3b48b9fd18ecca20ed5b0accbfeb6b70",{},"https:",{"rejectUnauthorized":false,"path":null},{},{},{},{"map":"58","list":"59"},{},"IPv4","127.0.0.1",{"accept":"26","user-agent":"27","api-key":"28"},{"https":"14"},"api.example.com",{"http:":"60","https:":"61"},"/example","?param1=true&param2=123","https","api.example.com:443",{"objectMode":false,"highWaterMark":16384,"buffer":"62","length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"paused":false,"emitClose":true,"autoDestroy":false,"destroyed":false,"defaultEncoding":"63","awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},{},["64","5"],{},[],"https://api.example.com/example?param1=true&param2=123",[],{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":false,"ended":false,"finished":false,"destroyed":false,"decodeStrings":true,"defaultEncoding":"63","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"afterWriteTickInfo":null,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"emitClose":true,"autoDestroy":false,"bufferedRequestCount":0,"corkedRequestsFree":"65"},{},{"protocol":"30","maxRedirects":21,"maxBodyLength":10485760,"path":"6","method":"19","headers":"8","agent":"14","agents":"40","hostname":"41","port":null,"nativeProtocols":"42","pathname":"43","search":"44"},[],{},[],{"METHODS":"66","STATUS_CODES":"67","maxHeaderSize":8192,"globalAgent":"68"},{"globalAgent":"69"},{"head":null,"tail":null,"length":0},"utf8","Content-Type",{"next":null,"entry":null},["70","71","72","73","74","75","19","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","101","102"],{"100":"103","101":"104","102":"105","103":"106","200":"107","201":"108","202":"109","203":"110","204":"111","205":"112","206":"113","207":"114","208":"115","226":"116","300":"117","301":"118","302":"119","303":"120","304":"121","305":"122","307":"123","308":"124","400":"125","401":"126","402":"127","403":"128","404":"129","405":"130","406":"131","407":"132","408":"133","409":"134","410":"135","411":"136","412":"137","413":"138","414":"139","415":"140","416":"141","417":"142","418":"143","421":"144","422":"145","423":"146","424":"147","425":"148","426":"149","428":"150","429":"151","431":"152","451":"153","500":"154","501":"155","502":"156","503":"157","504":"158","505":"159","506":"160","507":"161","508":"162","509":"163","510":"164","511":"165"},{"_events":"166","_eventsCount":1,"defaultPort":80,"protocol":"167","options":"168","requests":"169","sockets":"170","freeSockets":"171","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256},{"_events":"172","_eventsCount":1,"defaultPort":443,"protocol":"30","options":"173","requests":"174","sockets":"175","freeSockets":"176","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxCachedSessions":100,"_sessionCache":"177"},"ACL","BIND","CHECKOUT","CONNECT","COPY","DELETE","HEAD","LINK","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCALENDAR","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","POST","PROPFIND","PROPPATCH","PURGE","PUT","REBIND","REPORT","SEARCH","SOURCE","SUBSCRIBE","TRACE","UNBIND","UNLINK","UNLOCK","UNSUBSCRIBE","Continue","Switching Protocols","Processing","Early Hints","OK","Created","Accepted","Non-Authoritative Information","No Content","Reset Content","Partial Content","Multi-Status","Already Reported","IM Used","Multiple Choices","Moved Permanently","Found","See Other","Not Modified","Use Proxy","Temporary Redirect","Permanent Redirect","Bad Request","Unauthorized","Payment Required","Forbidden","Not Found","Method Not Allowed","Not Acceptable","Proxy Authentication Required","Request Timeout","Conflict","Gone","Length Required","Precondition Failed","Payload Too Large","URI Too Long","Unsupported Media Type","Range Not Satisfiable","Expectation Failed","I\'m a Teapot","Misdirected Request","Unprocessable Entity","Locked","Failed Dependency","Unordered Collection","Upgrade Required","Precondition Required","Too Many Requests","Request Header Fields Too Large","Unavailable For Legal Reasons","Internal Server Error","Not Implemented","Bad Gateway","Service Unavailable","Gateway Timeout","HTTP Version Not Supported","Variant Also Negotiates","Insufficient Storage","Loop Detected","Bandwidth Limit Exceeded","Not Extended","Network Authentication Required",{},"http:",{"path":null},{},{},{},{},{"path":null},{},{},{},{"map":"178","list":"179"},{},[]]';

      // tslint:disable-next-line:no-backbone-get-set-outside-model
      const apiNock = nock('https://api.example.com')
        .get('/example')
        .query({ param1: 'true', param2: '123' })
        .matchHeader('User-Agent', '@scope/example')
        .matchHeader('Api-Key', '3b48b9fd18ecca20ed5b0accbfeb6b70')
        .reply(200, {
          success: true,
        });

      const redisSetAsyncSpy = jest.spyOn(axiosRedis, 'redisSetAsync');
      const redisGetAsyncSpy = jest.spyOn(axiosRedis, 'redisGetAsync');

      // tslint:disable-next-line:no-backbone-get-set-outside-model
      const response = await axiosInstance.get(
        '/example?param1=true&param2=123',
      );

      // tslint:disable-next-line:no-backbone-get-set-outside-model
      const responseFromCache = await axiosInstance.get(
        '/example?param1=true&param2=123',
      );

      apiNock.done();
      expect(redisSetAsyncSpy).toBeCalledTimes(1);
      expect(redisSetAsyncSpy).nthCalledWith(
        1,
        'get',
        axiosResponseSetCache,
        'EX',
        30000,
      );
      expect(redisGetAsyncSpy).toBeCalledTimes(2);
      expect(redisGetAsyncSpy).nthCalledWith(1, 'get');
      expect(redisGetAsyncSpy).nthCalledWith(2, 'get');
      expect(response.status).toEqual(200);
      expect(response.data).toStrictEqual({ success: true });
      expect(responseFromCache.status).toEqual(200);
      expect(responseFromCache.data).toStrictEqual({ success: true });
    });
  });
});
