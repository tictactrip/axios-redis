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
          '[{"status":200,"statusText":null,"headers":"1","config":"2","request":"3","data":"4"},{"content-type":"5"},{"url":"6","method":"7","headers":"8","baseURL":"9","transformRequest":"10","transformResponse":"11","timeout":0,"xsrfCookieName":"12","xsrfHeaderName":"13","maxContentLength":-1,"httpsAgent":"14"},{"_events":"15","_eventsCount":5,"outputData":"16","outputSize":0,"writable":true,"_last":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":false,"_removedConnection":false,"_removedContLen":false,"_removedTE":false,"_contentLength":null,"_hasBody":true,"_trailer":"17","finished":true,"_headerSent":false,"socket":"18","connection":"18","_header":null,"path":"6","method":"19","req":"3","options":"20","interceptors":"21","response":"22","playbackStarted":false,"requestBodyBuffers":"23","_redirectable":"24","headers":"25"},{"success":true},"application/json","/example1?param1=true&param2=123","get",{"Accept":"26","User-Agent":"27","Api-Key":"28"},"https://api.example.com",[null],[null],"XSRF-TOKEN","X-XSRF-TOKEN",{"_events":"29","_eventsCount":2,"defaultPort":443,"protocol":"30","options":"31","requests":"32","sockets":"33","freeSockets":"34","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxCachedSessions":100,"_sessionCache":"35"},{},[],"",{"_events":"36","_eventsCount":2,"authorized":true,"bufferSize":0,"writableLength":0,"writable":true,"readable":true,"pending":false,"destroyed":false,"connecting":false,"totalDelayMs":0,"timeoutMs":null,"remoteFamily":"37","remoteAddress":"38","localAddress":"38","remotePort":443,"localPort":443},"GET",{"protocol":"30","maxRedirects":21,"maxBodyLength":10485760,"path":"6","method":"19","headers":"39","agent":"14","agents":"40","hostname":"41","port":443,"nativeProtocols":"42","pathname":"43","search":"44","proto":"45","host":"46"},[],{"_readableState":"47","readable":false,"_events":"48","_eventsCount":3,"socket":"18","connection":"18","httpVersionMajor":null,"httpVersionMinor":null,"httpVersion":null,"complete":true,"headers":"1","rawHeaders":"49","trailers":"50","rawTrailers":"51","aborted":false,"upgrade":null,"url":"17","method":null,"statusCode":200,"statusMessage":null,"client":"18","_consuming":true,"_dumped":false,"req":"3","responseUrl":"52","redirects":"53"},[],{"_writableState":"54","writable":true,"_events":"55","_eventsCount":2,"_options":"56","_redirectCount":0,"_redirects":"53","_requestBodyLength":0,"_requestBodyBuffers":"57","_currentRequest":"3","_currentUrl":"52"},{"accept":"26","user-agent":"27","api-key":"28","host":"41"},"application/json, text/plain, */*","@scope/package","3b48b9fd18ecca20ed5b0accbfeb6b70",{},"https:",{"rejectUnauthorized":false,"path":null},{},{},{},{"map":"58","list":"59"},{},"IPv4","127.0.0.1",{"accept":"26","user-agent":"27","api-key":"28"},{"https":"14"},"api.example.com",{"http:":"60","https:":"61"},"/example1","?param1=true&param2=123","https","api.example.com:443",{"objectMode":false,"highWaterMark":16384,"buffer":"62","length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"emitClose":true,"autoDestroy":false,"destroyed":false,"defaultEncoding":"63","awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},{},["64","5"],{},[],"https://api.example.com/example1?param1=true&param2=123",[],{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":false,"ended":false,"finished":false,"destroyed":false,"decodeStrings":true,"defaultEncoding":"63","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"afterWriteTickInfo":null,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"emitClose":true,"autoDestroy":false,"bufferedRequestCount":0,"corkedRequestsFree":"65"},{},{"protocol":"30","maxRedirects":21,"maxBodyLength":10485760,"path":"6","method":"19","headers":"8","agent":"14","agents":"40","hostname":"41","port":null,"nativeProtocols":"42","pathname":"43","search":"44"},[],{},[],{"METHODS":"66","STATUS_CODES":"67","maxHeaderSize":8192,"globalAgent":"68"},{"globalAgent":"69"},{"head":null,"tail":null,"length":0},"utf8","Content-Type",{"next":null,"entry":null},["70","71","72","73","74","75","19","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","101","102"],{"100":"103","101":"104","102":"105","103":"106","200":"107","201":"108","202":"109","203":"110","204":"111","205":"112","206":"113","207":"114","208":"115","226":"116","300":"117","301":"118","302":"119","303":"120","304":"121","305":"122","307":"123","308":"124","400":"125","401":"126","402":"127","403":"128","404":"129","405":"130","406":"131","407":"132","408":"133","409":"134","410":"135","411":"136","412":"137","413":"138","414":"139","415":"140","416":"141","417":"142","418":"143","421":"144","422":"145","423":"146","424":"147","425":"148","426":"149","428":"150","429":"151","431":"152","451":"153","500":"154","501":"155","502":"156","503":"157","504":"158","505":"159","506":"160","507":"161","508":"162","509":"163","510":"164","511":"165"},{"_events":"166","_eventsCount":2,"defaultPort":80,"protocol":"167","options":"168","requests":"169","sockets":"170","freeSockets":"171","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256},{"_events":"172","_eventsCount":2,"defaultPort":443,"protocol":"30","options":"173","requests":"174","sockets":"175","freeSockets":"176","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxCachedSessions":100,"_sessionCache":"177"},"ACL","BIND","CHECKOUT","CONNECT","COPY","DELETE","HEAD","LINK","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCALENDAR","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","POST","PROPFIND","PROPPATCH","PURGE","PUT","REBIND","REPORT","SEARCH","SOURCE","SUBSCRIBE","TRACE","UNBIND","UNLINK","UNLOCK","UNSUBSCRIBE","Continue","Switching Protocols","Processing","Early Hints","OK","Created","Accepted","Non-Authoritative Information","No Content","Reset Content","Partial Content","Multi-Status","Already Reported","IM Used","Multiple Choices","Moved Permanently","Found","See Other","Not Modified","Use Proxy","Temporary Redirect","Permanent Redirect","Bad Request","Unauthorized","Payment Required","Forbidden","Not Found","Method Not Allowed","Not Acceptable","Proxy Authentication Required","Request Timeout","Conflict","Gone","Length Required","Precondition Failed","Payload Too Large","URI Too Long","Unsupported Media Type","Range Not Satisfiable","Expectation Failed","I\'m a Teapot","Misdirected Request","Unprocessable Entity","Locked","Failed Dependency","Unordered Collection","Upgrade Required","Precondition Required","Too Many Requests","Request Header Fields Too Large","Unavailable For Legal Reasons","Internal Server Error","Not Implemented","Bad Gateway","Service Unavailable","Gateway Timeout","HTTP Version Not Supported","Variant Also Negotiates","Insufficient Storage","Loop Detected","Bandwidth Limit Exceeded","Not Extended","Network Authentication Required",{},"http:",{"path":null},{},{},{},{},{"path":null},{},{},{},{"map":"178","list":"179"},{},[]]';

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
          'EX',
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
          '[{"status":200,"statusText":null,"headers":"1","config":"2","request":"3","data":"4"},{"content-type":"5"},{"url":"6","method":"7","headers":"8","baseURL":"9","transformRequest":"10","transformResponse":"11","timeout":0,"xsrfCookieName":"12","xsrfHeaderName":"13","maxContentLength":-1,"httpsAgent":"14"},{"_events":"15","_eventsCount":5,"outputData":"16","outputSize":0,"writable":true,"_last":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":false,"_removedConnection":false,"_removedContLen":false,"_removedTE":false,"_contentLength":null,"_hasBody":true,"_trailer":"17","finished":true,"_headerSent":false,"socket":"18","connection":"18","_header":null,"path":"6","method":"19","req":"3","options":"20","interceptors":"21","response":"22","playbackStarted":false,"requestBodyBuffers":"23","_redirectable":"24","headers":"25"},{"success":true},"application/json","/example2?param1=true&param2=123","get",{"Accept":"26","User-Agent":"27","Api-Key":"28"},"https://api.example.com",[null],[null],"XSRF-TOKEN","X-XSRF-TOKEN",{"_events":"29","_eventsCount":2,"defaultPort":443,"protocol":"30","options":"31","requests":"32","sockets":"33","freeSockets":"34","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxCachedSessions":100,"_sessionCache":"35"},{},[],"",{"_events":"36","_eventsCount":2,"authorized":true,"bufferSize":0,"writableLength":0,"writable":true,"readable":true,"pending":false,"destroyed":false,"connecting":false,"totalDelayMs":0,"timeoutMs":null,"remoteFamily":"37","remoteAddress":"38","localAddress":"38","remotePort":443,"localPort":443},"GET",{"protocol":"30","maxRedirects":21,"maxBodyLength":10485760,"path":"6","method":"19","headers":"39","agent":"14","agents":"40","hostname":"41","port":443,"nativeProtocols":"42","pathname":"43","search":"44","proto":"45","host":"46"},[],{"_readableState":"47","readable":false,"_events":"48","_eventsCount":3,"socket":"18","connection":"18","httpVersionMajor":null,"httpVersionMinor":null,"httpVersion":null,"complete":true,"headers":"1","rawHeaders":"49","trailers":"50","rawTrailers":"51","aborted":false,"upgrade":null,"url":"17","method":null,"statusCode":200,"statusMessage":null,"client":"18","_consuming":true,"_dumped":false,"req":"3","responseUrl":"52","redirects":"53"},[],{"_writableState":"54","writable":true,"_events":"55","_eventsCount":2,"_options":"56","_redirectCount":0,"_redirects":"53","_requestBodyLength":0,"_requestBodyBuffers":"57","_currentRequest":"3","_currentUrl":"52"},{"accept":"26","user-agent":"27","api-key":"28","host":"41"},"application/json, text/plain, */*","@scope/package","3b48b9fd18ecca20ed5b0accbfeb6b70",{},"https:",{"rejectUnauthorized":false,"path":null},{},{},{},{"map":"58","list":"59"},{},"IPv4","127.0.0.1",{"accept":"26","user-agent":"27","api-key":"28"},{"https":"14"},"api.example.com",{"http:":"60","https:":"61"},"/example2","?param1=true&param2=123","https","api.example.com:443",{"objectMode":false,"highWaterMark":16384,"buffer":"62","length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"emitClose":true,"autoDestroy":false,"destroyed":false,"defaultEncoding":"63","awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},{},["64","5"],{},[],"https://api.example.com/example2?param1=true&param2=123",[],{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":false,"ended":false,"finished":false,"destroyed":false,"decodeStrings":true,"defaultEncoding":"63","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"afterWriteTickInfo":null,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"emitClose":true,"autoDestroy":false,"bufferedRequestCount":0,"corkedRequestsFree":"65"},{},{"protocol":"30","maxRedirects":21,"maxBodyLength":10485760,"path":"6","method":"19","headers":"8","agent":"14","agents":"40","hostname":"41","port":null,"nativeProtocols":"42","pathname":"43","search":"44"},[],{},[],{"METHODS":"66","STATUS_CODES":"67","maxHeaderSize":8192,"globalAgent":"68"},{"globalAgent":"69"},{"head":null,"tail":null,"length":0},"utf8","Content-Type",{"next":null,"entry":null},["70","71","72","73","74","75","19","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","101","102"],{"100":"103","101":"104","102":"105","103":"106","200":"107","201":"108","202":"109","203":"110","204":"111","205":"112","206":"113","207":"114","208":"115","226":"116","300":"117","301":"118","302":"119","303":"120","304":"121","305":"122","307":"123","308":"124","400":"125","401":"126","402":"127","403":"128","404":"129","405":"130","406":"131","407":"132","408":"133","409":"134","410":"135","411":"136","412":"137","413":"138","414":"139","415":"140","416":"141","417":"142","418":"143","421":"144","422":"145","423":"146","424":"147","425":"148","426":"149","428":"150","429":"151","431":"152","451":"153","500":"154","501":"155","502":"156","503":"157","504":"158","505":"159","506":"160","507":"161","508":"162","509":"163","510":"164","511":"165"},{"_events":"166","_eventsCount":2,"defaultPort":80,"protocol":"167","options":"168","requests":"169","sockets":"170","freeSockets":"171","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256},{"_events":"172","_eventsCount":2,"defaultPort":443,"protocol":"30","options":"173","requests":"174","sockets":"175","freeSockets":"176","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxCachedSessions":100,"_sessionCache":"177"},"ACL","BIND","CHECKOUT","CONNECT","COPY","DELETE","HEAD","LINK","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCALENDAR","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","POST","PROPFIND","PROPPATCH","PURGE","PUT","REBIND","REPORT","SEARCH","SOURCE","SUBSCRIBE","TRACE","UNBIND","UNLINK","UNLOCK","UNSUBSCRIBE","Continue","Switching Protocols","Processing","Early Hints","OK","Created","Accepted","Non-Authoritative Information","No Content","Reset Content","Partial Content","Multi-Status","Already Reported","IM Used","Multiple Choices","Moved Permanently","Found","See Other","Not Modified","Use Proxy","Temporary Redirect","Permanent Redirect","Bad Request","Unauthorized","Payment Required","Forbidden","Not Found","Method Not Allowed","Not Acceptable","Proxy Authentication Required","Request Timeout","Conflict","Gone","Length Required","Precondition Failed","Payload Too Large","URI Too Long","Unsupported Media Type","Range Not Satisfiable","Expectation Failed","I\'m a Teapot","Misdirected Request","Unprocessable Entity","Locked","Failed Dependency","Unordered Collection","Upgrade Required","Precondition Required","Too Many Requests","Request Header Fields Too Large","Unavailable For Legal Reasons","Internal Server Error","Not Implemented","Bad Gateway","Service Unavailable","Gateway Timeout","HTTP Version Not Supported","Variant Also Negotiates","Insufficient Storage","Loop Detected","Bandwidth Limit Exceeded","Not Extended","Network Authentication Required",{},"http:",{"path":null},{},{},{},{},{"path":null},{},{},{},{"map":"178","list":"179"},{},[]]';

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
          headers: { 'Axios-Redis-Cache-Duration': 90000 },
        });

        // tslint:disable-next-line:no-backbone-get-set-outside-model
        const responseFromCache = await axiosInstance.get('/example2?param1=true&param2=123');

        apiNock.done();
        expect(redisSetAsyncSpy).toBeCalledTimes(1);
        expect(redisSetAsyncSpy).nthCalledWith(
          1,
          '@scope/package@1.0.1___["get"]___WyIvZXhhbXBsZTI/cGFyYW0xPXRydWUmcGFyYW0yPTEyMyJd___W10=___W10=',
          axiosResponseSetCache,
          'EX',
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
          '[{"status":200,"statusText":null,"headers":"1","config":"2","request":"3","data":"4"},{"content-type":"5"},{"url":"6","method":"7","headers":"8","baseURL":"9","transformRequest":"10","transformResponse":"11","timeout":0,"xsrfCookieName":"12","xsrfHeaderName":"13","maxContentLength":-1,"httpsAgent":"14"},{"_events":"15","_eventsCount":5,"outputData":"16","outputSize":0,"writable":true,"_last":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":false,"_removedConnection":false,"_removedContLen":false,"_removedTE":false,"_contentLength":null,"_hasBody":true,"_trailer":"17","finished":true,"_headerSent":false,"socket":"18","connection":"18","_header":null,"path":"6","method":"19","req":"3","options":"20","interceptors":"21","response":"22","playbackStarted":false,"requestBodyBuffers":"23","_redirectable":"24","headers":"25"},{"success":true},"application/json","/example1?param1=true&param2=123","get",{"Accept":"26","User-Agent":"27","Api-Key":"28"},"https://api.example.com",[null],[null],"XSRF-TOKEN","X-XSRF-TOKEN",{"_events":"29","_eventsCount":2,"defaultPort":443,"protocol":"30","options":"31","requests":"32","sockets":"33","freeSockets":"34","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxCachedSessions":100,"_sessionCache":"35"},{},[],"",{"_events":"36","_eventsCount":2,"authorized":true,"bufferSize":0,"writableLength":0,"writable":true,"readable":true,"pending":false,"destroyed":false,"connecting":false,"totalDelayMs":0,"timeoutMs":null,"remoteFamily":"37","remoteAddress":"38","localAddress":"38","remotePort":443,"localPort":443},"GET",{"protocol":"30","maxRedirects":21,"maxBodyLength":10485760,"path":"6","method":"19","headers":"39","agent":"14","agents":"40","hostname":"41","port":443,"nativeProtocols":"42","pathname":"43","search":"44","proto":"45","host":"46"},[],{"_readableState":"47","readable":false,"_events":"48","_eventsCount":3,"socket":"18","connection":"18","httpVersionMajor":null,"httpVersionMinor":null,"httpVersion":null,"complete":true,"headers":"1","rawHeaders":"49","trailers":"50","rawTrailers":"51","aborted":false,"upgrade":null,"url":"17","method":null,"statusCode":200,"statusMessage":null,"client":"18","_consuming":true,"_dumped":false,"req":"3","responseUrl":"52","redirects":"53"},[],{"_writableState":"54","writable":true,"_events":"55","_eventsCount":2,"_options":"56","_redirectCount":0,"_redirects":"53","_requestBodyLength":0,"_requestBodyBuffers":"57","_currentRequest":"3","_currentUrl":"52"},{"accept":"26","user-agent":"27","api-key":"28","host":"41"},"application/json, text/plain, */*","@scope/package","3b48b9fd18ecca20ed5b0accbfeb6b70",{},"https:",{"rejectUnauthorized":false,"path":null},{},{},{},{"map":"58","list":"59"},{},"IPv4","127.0.0.1",{"accept":"26","user-agent":"27","api-key":"28"},{"https":"14"},"api.example.com",{"http:":"60","https:":"61"},"/example1","?param1=true&param2=123","https","api.example.com:443",{"objectMode":false,"highWaterMark":16384,"buffer":"62","length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"emitClose":true,"autoDestroy":false,"destroyed":false,"defaultEncoding":"63","awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},{},["64","5"],{},[],"https://api.example.com/example1?param1=true&param2=123",[],{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":false,"ended":false,"finished":false,"destroyed":false,"decodeStrings":true,"defaultEncoding":"63","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"afterWriteTickInfo":null,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"emitClose":true,"autoDestroy":false,"bufferedRequestCount":0,"corkedRequestsFree":"65"},{},{"protocol":"30","maxRedirects":21,"maxBodyLength":10485760,"path":"6","method":"19","headers":"8","agent":"14","agents":"40","hostname":"41","port":null,"nativeProtocols":"42","pathname":"43","search":"44"},[],{},[],{"METHODS":"66","STATUS_CODES":"67","maxHeaderSize":8192,"globalAgent":"68"},{"globalAgent":"69"},{"head":null,"tail":null,"length":0},"utf8","Content-Type",{"next":null,"entry":null},["70","71","72","73","74","75","19","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","101","102"],{"100":"103","101":"104","102":"105","103":"106","200":"107","201":"108","202":"109","203":"110","204":"111","205":"112","206":"113","207":"114","208":"115","226":"116","300":"117","301":"118","302":"119","303":"120","304":"121","305":"122","307":"123","308":"124","400":"125","401":"126","402":"127","403":"128","404":"129","405":"130","406":"131","407":"132","408":"133","409":"134","410":"135","411":"136","412":"137","413":"138","414":"139","415":"140","416":"141","417":"142","418":"143","421":"144","422":"145","423":"146","424":"147","425":"148","426":"149","428":"150","429":"151","431":"152","451":"153","500":"154","501":"155","502":"156","503":"157","504":"158","505":"159","506":"160","507":"161","508":"162","509":"163","510":"164","511":"165"},{"_events":"166","_eventsCount":2,"defaultPort":80,"protocol":"167","options":"168","requests":"169","sockets":"170","freeSockets":"171","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256},{"_events":"172","_eventsCount":2,"defaultPort":443,"protocol":"30","options":"173","requests":"174","sockets":"175","freeSockets":"176","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxCachedSessions":100,"_sessionCache":"177"},"ACL","BIND","CHECKOUT","CONNECT","COPY","DELETE","HEAD","LINK","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCALENDAR","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","POST","PROPFIND","PROPPATCH","PURGE","PUT","REBIND","REPORT","SEARCH","SOURCE","SUBSCRIBE","TRACE","UNBIND","UNLINK","UNLOCK","UNSUBSCRIBE","Continue","Switching Protocols","Processing","Early Hints","OK","Created","Accepted","Non-Authoritative Information","No Content","Reset Content","Partial Content","Multi-Status","Already Reported","IM Used","Multiple Choices","Moved Permanently","Found","See Other","Not Modified","Use Proxy","Temporary Redirect","Permanent Redirect","Bad Request","Unauthorized","Payment Required","Forbidden","Not Found","Method Not Allowed","Not Acceptable","Proxy Authentication Required","Request Timeout","Conflict","Gone","Length Required","Precondition Failed","Payload Too Large","URI Too Long","Unsupported Media Type","Range Not Satisfiable","Expectation Failed","I\'m a Teapot","Misdirected Request","Unprocessable Entity","Locked","Failed Dependency","Unordered Collection","Upgrade Required","Precondition Required","Too Many Requests","Request Header Fields Too Large","Unavailable For Legal Reasons","Internal Server Error","Not Implemented","Bad Gateway","Service Unavailable","Gateway Timeout","HTTP Version Not Supported","Variant Also Negotiates","Insufficient Storage","Loop Detected","Bandwidth Limit Exceeded","Not Extended","Network Authentication Required",{},"http:",{"path":null},{},{},{},{},{"path":null},{},{},{},{"map":"178","list":"179"},{},[]]';

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
          'EX',
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
          '[{"status":200,"statusText":null,"headers":"1","config":"2","request":"3","data":"4"},{"content-type":"5"},{"url":"6","method":"7","data":"8","headers":"9","baseURL":"10","transformRequest":"11","transformResponse":"12","timeout":0,"xsrfCookieName":"13","xsrfHeaderName":"14","maxContentLength":-1,"httpsAgent":"15"},{"_events":"16","_eventsCount":5,"outputData":"17","outputSize":0,"writable":true,"_last":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":false,"_removedConnection":false,"_removedContLen":false,"_removedTE":false,"_contentLength":null,"_hasBody":true,"_trailer":"18","finished":true,"_headerSent":false,"socket":"19","connection":"19","_header":null,"path":"6","method":"20","req":"3","options":"21","interceptors":"22","response":"23","playbackStarted":false,"requestBodyBuffers":"24","_redirectable":"25","headers":"26"},{"success":true},"application/json","/example1?param1=true&param2=123","post","{\\"hello\\":\\"world\\"}",{"Accept":"27","Content-Type":"28","User-Agent":"29","Api-Key":"30","Content-Length":17},"https://api.example.com",[null],[null],"XSRF-TOKEN","X-XSRF-TOKEN",{"_events":"31","_eventsCount":2,"defaultPort":443,"protocol":"32","options":"33","requests":"34","sockets":"35","freeSockets":"36","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxCachedSessions":100,"_sessionCache":"37"},{},[],"",{"_events":"38","_eventsCount":2,"authorized":true,"bufferSize":0,"writableLength":0,"writable":true,"readable":true,"pending":false,"destroyed":false,"connecting":false,"totalDelayMs":0,"timeoutMs":null,"remoteFamily":"39","remoteAddress":"40","localAddress":"40","remotePort":443,"localPort":443},"POST",{"protocol":"32","maxRedirects":21,"maxBodyLength":10485760,"path":"6","method":"20","headers":"41","agent":"15","agents":"42","hostname":"43","port":443,"nativeProtocols":"44","pathname":"45","search":"46","proto":"47","host":"48"},[],{"_readableState":"49","readable":false,"_events":"50","_eventsCount":3,"socket":"19","connection":"19","httpVersionMajor":null,"httpVersionMinor":null,"httpVersion":null,"complete":true,"headers":"1","rawHeaders":"51","trailers":"52","rawTrailers":"53","aborted":false,"upgrade":null,"url":"18","method":null,"statusCode":200,"statusMessage":null,"client":"19","_consuming":true,"_dumped":false,"req":"3","responseUrl":"54","redirects":"55"},["56"],{"_writableState":"57","writable":true,"_events":"58","_eventsCount":2,"_options":"59","_redirectCount":0,"_redirects":"55","_requestBodyLength":17,"_requestBodyBuffers":"60","_currentRequest":"3","_currentUrl":"54"},{"accept":"27","content-type":"28","user-agent":"29","api-key":"30","content-length":17,"host":"43"},"application/json, text/plain, */*","application/json;charset=utf-8","@scope/package","3b48b9fd18ecca20ed5b0accbfeb6b70",{},"https:",{"rejectUnauthorized":false,"path":null},{},{},{},{"map":"61","list":"62"},{},"IPv4","127.0.0.1",{"accept":"27","content-type":"28","user-agent":"29","api-key":"30","content-length":17},{"https":"15"},"api.example.com",{"http:":"63","https:":"64"},"/example1","?param1=true&param2=123","https","api.example.com:443",{"objectMode":false,"highWaterMark":16384,"buffer":"65","length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"emitClose":true,"autoDestroy":false,"destroyed":false,"defaultEncoding":"66","awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},{},["67","5"],{},[],"https://api.example.com/example1?param1=true&param2=123",[],{"type":"68","data":"69"},{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":false,"ended":false,"finished":false,"destroyed":false,"decodeStrings":true,"defaultEncoding":"66","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"afterWriteTickInfo":null,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"emitClose":true,"autoDestroy":false,"bufferedRequestCount":0,"corkedRequestsFree":"70"},{},{"protocol":"32","maxRedirects":21,"maxBodyLength":10485760,"path":"6","method":"20","headers":"9","agent":"15","agents":"42","hostname":"43","port":null,"nativeProtocols":"44","pathname":"45","search":"46"},[],{},[],{"METHODS":"71","STATUS_CODES":"72","maxHeaderSize":8192,"globalAgent":"73"},{"globalAgent":"74"},{"head":null,"tail":null,"length":0},"utf8","Content-Type","Buffer",[123,34,104,101,108,108,111,34,58,34,119,111,114,108,100,34,125],{"next":null,"entry":null},["75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","20","94","95","96","97","98","99","100","101","102","103","104","105","106","107"],{"100":"108","101":"109","102":"110","103":"111","200":"112","201":"113","202":"114","203":"115","204":"116","205":"117","206":"118","207":"119","208":"120","226":"121","300":"122","301":"123","302":"124","303":"125","304":"126","305":"127","307":"128","308":"129","400":"130","401":"131","402":"132","403":"133","404":"134","405":"135","406":"136","407":"137","408":"138","409":"139","410":"140","411":"141","412":"142","413":"143","414":"144","415":"145","416":"146","417":"147","418":"148","421":"149","422":"150","423":"151","424":"152","425":"153","426":"154","428":"155","429":"156","431":"157","451":"158","500":"159","501":"160","502":"161","503":"162","504":"163","505":"164","506":"165","507":"166","508":"167","509":"168","510":"169","511":"170"},{"_events":"171","_eventsCount":2,"defaultPort":80,"protocol":"172","options":"173","requests":"174","sockets":"175","freeSockets":"176","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256},{"_events":"177","_eventsCount":2,"defaultPort":443,"protocol":"32","options":"178","requests":"179","sockets":"180","freeSockets":"181","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxCachedSessions":100,"_sessionCache":"182"},"ACL","BIND","CHECKOUT","CONNECT","COPY","DELETE","GET","HEAD","LINK","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCALENDAR","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","PROPFIND","PROPPATCH","PURGE","PUT","REBIND","REPORT","SEARCH","SOURCE","SUBSCRIBE","TRACE","UNBIND","UNLINK","UNLOCK","UNSUBSCRIBE","Continue","Switching Protocols","Processing","Early Hints","OK","Created","Accepted","Non-Authoritative Information","No Content","Reset Content","Partial Content","Multi-Status","Already Reported","IM Used","Multiple Choices","Moved Permanently","Found","See Other","Not Modified","Use Proxy","Temporary Redirect","Permanent Redirect","Bad Request","Unauthorized","Payment Required","Forbidden","Not Found","Method Not Allowed","Not Acceptable","Proxy Authentication Required","Request Timeout","Conflict","Gone","Length Required","Precondition Failed","Payload Too Large","URI Too Long","Unsupported Media Type","Range Not Satisfiable","Expectation Failed","I\'m a Teapot","Misdirected Request","Unprocessable Entity","Locked","Failed Dependency","Unordered Collection","Upgrade Required","Precondition Required","Too Many Requests","Request Header Fields Too Large","Unavailable For Legal Reasons","Internal Server Error","Not Implemented","Bad Gateway","Service Unavailable","Gateway Timeout","HTTP Version Not Supported","Variant Also Negotiates","Insufficient Storage","Loop Detected","Bandwidth Limit Exceeded","Not Extended","Network Authentication Required",{},"http:",{"path":null},{},{},{},{},{"path":null},{},{},{},{"map":"183","list":"184"},{},[]]';

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
          'EX',
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
          '[{"status":200,"statusText":null,"headers":"1","config":"2","request":"3","data":"4"},{"content-type":"5"},{"url":"6","method":"7","data":"8","headers":"9","baseURL":"10","transformRequest":"11","transformResponse":"12","timeout":0,"xsrfCookieName":"13","xsrfHeaderName":"14","maxContentLength":-1,"httpsAgent":"15"},{"_events":"16","_eventsCount":5,"outputData":"17","outputSize":0,"writable":true,"_last":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":false,"_removedConnection":false,"_removedContLen":false,"_removedTE":false,"_contentLength":null,"_hasBody":true,"_trailer":"18","finished":true,"_headerSent":false,"socket":"19","connection":"19","_header":null,"path":"6","method":"20","req":"3","options":"21","interceptors":"22","response":"23","playbackStarted":false,"requestBodyBuffers":"24","_redirectable":"25","headers":"26"},{"success":true},"application/json","/example1?param1=true&param2=123","post","{\\"hello\\":\\"world\\"}",{"Accept":"27","Content-Type":"28","User-Agent":"29","Api-Key":"30","Content-Length":17},"https://api.example.com",[null],[null],"XSRF-TOKEN","X-XSRF-TOKEN",{"_events":"31","_eventsCount":2,"defaultPort":443,"protocol":"32","options":"33","requests":"34","sockets":"35","freeSockets":"36","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxCachedSessions":100,"_sessionCache":"37"},{},[],"",{"_events":"38","_eventsCount":2,"authorized":true,"bufferSize":0,"writableLength":0,"writable":true,"readable":true,"pending":false,"destroyed":false,"connecting":false,"totalDelayMs":0,"timeoutMs":null,"remoteFamily":"39","remoteAddress":"40","localAddress":"40","remotePort":443,"localPort":443},"POST",{"protocol":"32","maxRedirects":21,"maxBodyLength":10485760,"path":"6","method":"20","headers":"41","agent":"15","agents":"42","hostname":"43","port":443,"nativeProtocols":"44","pathname":"45","search":"46","proto":"47","host":"48"},[],{"_readableState":"49","readable":false,"_events":"50","_eventsCount":3,"socket":"19","connection":"19","httpVersionMajor":null,"httpVersionMinor":null,"httpVersion":null,"complete":true,"headers":"1","rawHeaders":"51","trailers":"52","rawTrailers":"53","aborted":false,"upgrade":null,"url":"18","method":null,"statusCode":200,"statusMessage":null,"client":"19","_consuming":true,"_dumped":false,"req":"3","responseUrl":"54","redirects":"55"},["56"],{"_writableState":"57","writable":true,"_events":"58","_eventsCount":2,"_options":"59","_redirectCount":0,"_redirects":"55","_requestBodyLength":17,"_requestBodyBuffers":"60","_currentRequest":"3","_currentUrl":"54"},{"accept":"27","content-type":"28","user-agent":"29","api-key":"30","content-length":17,"host":"43"},"application/json, text/plain, */*","application/json;charset=utf-8","@scope/package","3b48b9fd18ecca20ed5b0accbfeb6b70",{},"https:",{"rejectUnauthorized":false,"path":null},{},{},{},{"map":"61","list":"62"},{},"IPv4","127.0.0.1",{"accept":"27","content-type":"28","user-agent":"29","api-key":"30","content-length":17},{"https":"15"},"api.example.com",{"http:":"63","https:":"64"},"/example1","?param1=true&param2=123","https","api.example.com:443",{"objectMode":false,"highWaterMark":16384,"buffer":"65","length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"emitClose":true,"autoDestroy":false,"destroyed":false,"defaultEncoding":"66","awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},{},["67","5"],{},[],"https://api.example.com/example1?param1=true&param2=123",[],{"type":"68","data":"69"},{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":false,"ended":false,"finished":false,"destroyed":false,"decodeStrings":true,"defaultEncoding":"66","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"afterWriteTickInfo":null,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"emitClose":true,"autoDestroy":false,"bufferedRequestCount":0,"corkedRequestsFree":"70"},{},{"protocol":"32","maxRedirects":21,"maxBodyLength":10485760,"path":"6","method":"20","headers":"9","agent":"15","agents":"42","hostname":"43","port":null,"nativeProtocols":"44","pathname":"45","search":"46"},[],{},[],{"METHODS":"71","STATUS_CODES":"72","maxHeaderSize":8192,"globalAgent":"73"},{"globalAgent":"74"},{"head":null,"tail":null,"length":0},"utf8","Content-Type","Buffer",[123,34,104,101,108,108,111,34,58,34,119,111,114,108,100,34,125],{"next":null,"entry":null},["75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","20","94","95","96","97","98","99","100","101","102","103","104","105","106","107"],{"100":"108","101":"109","102":"110","103":"111","200":"112","201":"113","202":"114","203":"115","204":"116","205":"117","206":"118","207":"119","208":"120","226":"121","300":"122","301":"123","302":"124","303":"125","304":"126","305":"127","307":"128","308":"129","400":"130","401":"131","402":"132","403":"133","404":"134","405":"135","406":"136","407":"137","408":"138","409":"139","410":"140","411":"141","412":"142","413":"143","414":"144","415":"145","416":"146","417":"147","418":"148","421":"149","422":"150","423":"151","424":"152","425":"153","426":"154","428":"155","429":"156","431":"157","451":"158","500":"159","501":"160","502":"161","503":"162","504":"163","505":"164","506":"165","507":"166","508":"167","509":"168","510":"169","511":"170"},{"_events":"171","_eventsCount":2,"defaultPort":80,"protocol":"172","options":"173","requests":"174","sockets":"175","freeSockets":"176","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256},{"_events":"177","_eventsCount":2,"defaultPort":443,"protocol":"32","options":"178","requests":"179","sockets":"180","freeSockets":"181","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxCachedSessions":100,"_sessionCache":"182"},"ACL","BIND","CHECKOUT","CONNECT","COPY","DELETE","GET","HEAD","LINK","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCALENDAR","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","PROPFIND","PROPPATCH","PURGE","PUT","REBIND","REPORT","SEARCH","SOURCE","SUBSCRIBE","TRACE","UNBIND","UNLINK","UNLOCK","UNSUBSCRIBE","Continue","Switching Protocols","Processing","Early Hints","OK","Created","Accepted","Non-Authoritative Information","No Content","Reset Content","Partial Content","Multi-Status","Already Reported","IM Used","Multiple Choices","Moved Permanently","Found","See Other","Not Modified","Use Proxy","Temporary Redirect","Permanent Redirect","Bad Request","Unauthorized","Payment Required","Forbidden","Not Found","Method Not Allowed","Not Acceptable","Proxy Authentication Required","Request Timeout","Conflict","Gone","Length Required","Precondition Failed","Payload Too Large","URI Too Long","Unsupported Media Type","Range Not Satisfiable","Expectation Failed","I\'m a Teapot","Misdirected Request","Unprocessable Entity","Locked","Failed Dependency","Unordered Collection","Upgrade Required","Precondition Required","Too Many Requests","Request Header Fields Too Large","Unavailable For Legal Reasons","Internal Server Error","Not Implemented","Bad Gateway","Service Unavailable","Gateway Timeout","HTTP Version Not Supported","Variant Also Negotiates","Insufficient Storage","Loop Detected","Bandwidth Limit Exceeded","Not Extended","Network Authentication Required",{},"http:",{"path":null},{},{},{},{},{"path":null},{},{},{},{"map":"183","list":"184"},{},[]]';

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
          'EX',
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
          { headers: { 'Axios-Redis-Cache-Duration': 0 } },
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
        expect(redisGetAsyncSpy).nthCalledWith(
          1,
          '@scope/package@1.0.1___["get"]___WyIvZXhhbXBsZS8xP3NvcnQ9ZGVzYyJd___W10=___W10=',
        );
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
          headers: { 'Axios-Redis-Cache-Duration': 0 },
        });

        apiNock.done();
        expect(redisSetAsyncSpy).toBeCalledTimes(0);
        expect(redisGetAsyncSpy).toBeCalledTimes(1);
        expect(redisGetAsyncSpy).nthCalledWith(
          1,
          '@scope/package@1.0.1___["get"]___WyIvZXhhbXBsZS8xP3NvcnQ9ZGVzYyJd___W10=___W10=',
        );
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
      const redisGetAsyncSpy = jest
        .spyOn(axiosRedis, 'redisGetAsync')
        .mockRejectedValue(new Error('Unexpected error.'));

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
