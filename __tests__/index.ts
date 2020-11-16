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
        const axiosResponseSetCache = `[{"status":200,"statusText":null,"headers":"1","config":"2","request":"3","data":"4"},{"content-type":"5"},{"url":"6","method":"7","headers":"8","baseURL":"9","transformRequest":"10","transformResponse":"11","timeout":0,"xsrfCookieName":"12","xsrfHeaderName":"13","maxContentLength":-1,"maxBodyLength":-1,"httpsAgent":"14"},{"_events":"15","_eventsCount":6,"outputData":"16","outputSize":0,"writable":true,"_last":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":false,"_removedConnection":false,"_removedContLen":false,"_removedTE":false,"_contentLength":null,"_hasBody":true,"_trailer":"17","finished":true,"_headerSent":false,"socket":"18","connection":"18","_header":null,"_keepAliveTimeout":0,"path":"6","method":"19","req":"3","options":"20","interceptors":"21","response":"22","requestBodyBuffers":"23","playbackStarted":false,"readyToStartPlaybackOnSocketEvent":false,"_redirectable":"24","headers":"25","res":"22"},{"success":true},"application/json","/example1?param1=true&param2=123","get",{"Accept":"26","User-Agent":"27","Api-Key":"28"},"https://api.example.com",[null],[null],"XSRF-TOKEN","X-XSRF-TOKEN",{"_events":"29","_eventsCount":2,"defaultPort":443,"protocol":"30","options":"31","requests":"32","sockets":"33","freeSockets":"34","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"maxCachedSessions":100,"_sessionCache":"35"},{},[],"",{"_events":"36","_eventsCount":3,"authorized":true,"bufferSize":0,"writableLength":0,"writable":true,"readable":true,"pending":false,"destroyed":false,"connecting":false,"_hadError":false,"timeout":0,"remoteFamily":"37","remoteAddress":"38","localAddress":"38","remotePort":443,"localPort":443},"GET",{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"30","path":"6","method":"19","headers":"39","agent":"14","agents":"40","hostname":"41","port":443,"nativeProtocols":"42","pathname":"43","search":"44","proto":"45","host":"46"},[],{"_readableState":"47","readable":false,"_events":"48","_eventsCount":3,"socket":"18","connection":"18","httpVersionMajor":null,"httpVersionMinor":null,"httpVersion":null,"complete":true,"headers":"1","rawHeaders":"49","trailers":"50","rawTrailers":"51","aborted":false,"upgrade":null,"url":"17","method":null,"statusCode":200,"statusMessage":null,"client":"18","_consuming":true,"_dumped":false,"req":"3","responseUrl":"52","redirects":"53"},[],{"_writableState":"54","writable":true,"_events":"55","_eventsCount":2,"_options":"56","_ended":true,"_ending":true,"_redirectCount":0,"_redirects":"53","_requestBodyLength":0,"_requestBodyBuffers":"57","_currentRequest":"3","_currentUrl":"52"},{"accept":"26","user-agent":"27","api-key":"28","host":"41"},"application/json, text/plain, */*","@scope/package","3b48b9fd18ecca20ed5b0accbfeb6b70",{},"https:",{"rejectUnauthorized":false,"path":null},{},{},{},{"map":"58","list":"59"},{},"IPv4","127.0.0.1",{"accept":"26","user-agent":"27","api-key":"28"},{"https":"14"},"api.example.com",{"http:":"60","https:":"61"},"/example1","?param1=true&param2=123","https","api.example.com:443",{"objectMode":false,"highWaterMark":16384,"buffer":"62","length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"emitClose":true,"autoDestroy":false,"destroyed":false,"defaultEncoding":"63","awaitDrainWriters":null,"multiAwaitDrain":false,"readingMore":false,"decoder":null,"encoding":null},{},["64","5"],{},[],"https://api.example.com/example1?param1=true&param2=123",[],{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":false,"ended":false,"finished":false,"destroyed":false,"decodeStrings":true,"defaultEncoding":"63","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"afterWriteTickInfo":null,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"emitClose":true,"autoDestroy":false,"bufferedRequestCount":0,"corkedRequestsFree":"65"},{},{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"30","path":"6","method":"19","headers":"8","agent":"14","agents":"40","hostname":"41","port":null,"nativeProtocols":"42","pathname":"43","search":"44"},[],{},[],{"METHODS":"66","STATUS_CODES":"67","maxHeaderSize":8192,"globalAgent":"68"},{"globalAgent":"69"},{"head":null,"tail":null,"length":0},"utf8","Content-Type",{"next":null,"entry":null},["70","71","72","73","74","75","19","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","101","102","103"],{"100":"104","101":"105","102":"106","103":"107","200":"108","201":"109","202":"110","203":"111","204":"112","205":"113","206":"114","207":"115","208":"116","226":"117","300":"118","301":"119","302":"120","303":"121","304":"122","305":"123","307":"124","308":"125","400":"126","401":"127","402":"128","403":"129","404":"130","405":"131","406":"132","407":"133","408":"134","409":"135","410":"136","411":"137","412":"138","413":"139","414":"140","415":"141","416":"142","417":"143","418":"144","421":"145","422":"146","423":"147","424":"148","425":"149","426":"150","428":"151","429":"152","431":"153","451":"154","500":"155","501":"156","502":"157","503":"158","504":"159","505":"160","506":"161","507":"162","508":"163","509":"164","510":"165","511":"166"},{"_events":"167","_eventsCount":2,"defaultPort":80,"protocol":"168","options":"169","requests":"170","sockets":"171","freeSockets":"172","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0},{"_events":"173","_eventsCount":2,"defaultPort":443,"protocol":"30","options":"174","requests":"175","sockets":"176","freeSockets":"177","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"maxCachedSessions":100,"_sessionCache":"178"},"ACL","BIND","CHECKOUT","CONNECT","COPY","DELETE","HEAD","LINK","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCALENDAR","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","POST","PRI","PROPFIND","PROPPATCH","PURGE","PUT","REBIND","REPORT","SEARCH","SOURCE","SUBSCRIBE","TRACE","UNBIND","UNLINK","UNLOCK","UNSUBSCRIBE","Continue","Switching Protocols","Processing","Early Hints","OK","Created","Accepted","Non-Authoritative Information","No Content","Reset Content","Partial Content","Multi-Status","Already Reported","IM Used","Multiple Choices","Moved Permanently","Found","See Other","Not Modified","Use Proxy","Temporary Redirect","Permanent Redirect","Bad Request","Unauthorized","Payment Required","Forbidden","Not Found","Method Not Allowed","Not Acceptable","Proxy Authentication Required","Request Timeout","Conflict","Gone","Length Required","Precondition Failed","Payload Too Large","URI Too Long","Unsupported Media Type","Range Not Satisfiable","Expectation Failed","I'm a Teapot","Misdirected Request","Unprocessable Entity","Locked","Failed Dependency","Unordered Collection","Upgrade Required","Precondition Required","Too Many Requests","Request Header Fields Too Large","Unavailable For Legal Reasons","Internal Server Error","Not Implemented","Bad Gateway","Service Unavailable","Gateway Timeout","HTTP Version Not Supported","Variant Also Negotiates","Insufficient Storage","Loop Detected","Bandwidth Limit Exceeded","Not Extended","Network Authentication Required",{},"http:",{"path":null},{},{},{},{},{"path":null},{},{},{},{"map":"179","list":"180"},{},[]]`;

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
        const axiosResponseSetCache = `[{"status":200,"statusText":null,"headers":"1","config":"2","request":"3","data":"4"},{"content-type":"5"},{"url":"6","method":"7","headers":"8","baseURL":"9","transformRequest":"10","transformResponse":"11","timeout":0,"xsrfCookieName":"12","xsrfHeaderName":"13","maxContentLength":-1,"maxBodyLength":-1,"httpsAgent":"14"},{"_events":"15","_eventsCount":6,"outputData":"16","outputSize":0,"writable":true,"_last":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":false,"_removedConnection":false,"_removedContLen":false,"_removedTE":false,"_contentLength":null,"_hasBody":true,"_trailer":"17","finished":true,"_headerSent":false,"socket":"18","connection":"18","_header":null,"_keepAliveTimeout":0,"path":"6","method":"19","req":"3","options":"20","interceptors":"21","response":"22","requestBodyBuffers":"23","playbackStarted":false,"readyToStartPlaybackOnSocketEvent":false,"_redirectable":"24","headers":"25","res":"22"},{"success":true},"application/json","/example2?param1=true&param2=123","get",{"Accept":"26","User-Agent":"27","Api-Key":"28"},"https://api.example.com",[null],[null],"XSRF-TOKEN","X-XSRF-TOKEN",{"_events":"29","_eventsCount":2,"defaultPort":443,"protocol":"30","options":"31","requests":"32","sockets":"33","freeSockets":"34","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"maxCachedSessions":100,"_sessionCache":"35"},{},[],"",{"_events":"36","_eventsCount":3,"authorized":true,"bufferSize":0,"writableLength":0,"writable":true,"readable":true,"pending":false,"destroyed":false,"connecting":false,"_hadError":false,"timeout":0,"remoteFamily":"37","remoteAddress":"38","localAddress":"38","remotePort":443,"localPort":443},"GET",{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"30","path":"6","method":"19","headers":"39","agent":"14","agents":"40","hostname":"41","port":443,"nativeProtocols":"42","pathname":"43","search":"44","proto":"45","host":"46"},[],{"_readableState":"47","readable":false,"_events":"48","_eventsCount":3,"socket":"18","connection":"18","httpVersionMajor":null,"httpVersionMinor":null,"httpVersion":null,"complete":true,"headers":"1","rawHeaders":"49","trailers":"50","rawTrailers":"51","aborted":false,"upgrade":null,"url":"17","method":null,"statusCode":200,"statusMessage":null,"client":"18","_consuming":true,"_dumped":false,"req":"3","responseUrl":"52","redirects":"53"},[],{"_writableState":"54","writable":true,"_events":"55","_eventsCount":2,"_options":"56","_ended":true,"_ending":true,"_redirectCount":0,"_redirects":"53","_requestBodyLength":0,"_requestBodyBuffers":"57","_currentRequest":"3","_currentUrl":"52"},{"accept":"26","user-agent":"27","api-key":"28","host":"41"},"application/json, text/plain, */*","@scope/package","3b48b9fd18ecca20ed5b0accbfeb6b70",{},"https:",{"rejectUnauthorized":false,"path":null},{},{},{},{"map":"58","list":"59"},{},"IPv4","127.0.0.1",{"accept":"26","user-agent":"27","api-key":"28"},{"https":"14"},"api.example.com",{"http:":"60","https:":"61"},"/example2","?param1=true&param2=123","https","api.example.com:443",{"objectMode":false,"highWaterMark":16384,"buffer":"62","length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"emitClose":true,"autoDestroy":false,"destroyed":false,"defaultEncoding":"63","awaitDrainWriters":null,"multiAwaitDrain":false,"readingMore":false,"decoder":null,"encoding":null},{},["64","5"],{},[],"https://api.example.com/example2?param1=true&param2=123",[],{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":false,"ended":false,"finished":false,"destroyed":false,"decodeStrings":true,"defaultEncoding":"63","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"afterWriteTickInfo":null,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"emitClose":true,"autoDestroy":false,"bufferedRequestCount":0,"corkedRequestsFree":"65"},{},{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"30","path":"6","method":"19","headers":"8","agent":"14","agents":"40","hostname":"41","port":null,"nativeProtocols":"42","pathname":"43","search":"44"},[],{},[],{"METHODS":"66","STATUS_CODES":"67","maxHeaderSize":8192,"globalAgent":"68"},{"globalAgent":"69"},{"head":null,"tail":null,"length":0},"utf8","Content-Type",{"next":null,"entry":null},["70","71","72","73","74","75","19","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","101","102","103"],{"100":"104","101":"105","102":"106","103":"107","200":"108","201":"109","202":"110","203":"111","204":"112","205":"113","206":"114","207":"115","208":"116","226":"117","300":"118","301":"119","302":"120","303":"121","304":"122","305":"123","307":"124","308":"125","400":"126","401":"127","402":"128","403":"129","404":"130","405":"131","406":"132","407":"133","408":"134","409":"135","410":"136","411":"137","412":"138","413":"139","414":"140","415":"141","416":"142","417":"143","418":"144","421":"145","422":"146","423":"147","424":"148","425":"149","426":"150","428":"151","429":"152","431":"153","451":"154","500":"155","501":"156","502":"157","503":"158","504":"159","505":"160","506":"161","507":"162","508":"163","509":"164","510":"165","511":"166"},{"_events":"167","_eventsCount":2,"defaultPort":80,"protocol":"168","options":"169","requests":"170","sockets":"171","freeSockets":"172","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0},{"_events":"173","_eventsCount":2,"defaultPort":443,"protocol":"30","options":"174","requests":"175","sockets":"176","freeSockets":"177","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"maxCachedSessions":100,"_sessionCache":"178"},"ACL","BIND","CHECKOUT","CONNECT","COPY","DELETE","HEAD","LINK","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCALENDAR","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","POST","PRI","PROPFIND","PROPPATCH","PURGE","PUT","REBIND","REPORT","SEARCH","SOURCE","SUBSCRIBE","TRACE","UNBIND","UNLINK","UNLOCK","UNSUBSCRIBE","Continue","Switching Protocols","Processing","Early Hints","OK","Created","Accepted","Non-Authoritative Information","No Content","Reset Content","Partial Content","Multi-Status","Already Reported","IM Used","Multiple Choices","Moved Permanently","Found","See Other","Not Modified","Use Proxy","Temporary Redirect","Permanent Redirect","Bad Request","Unauthorized","Payment Required","Forbidden","Not Found","Method Not Allowed","Not Acceptable","Proxy Authentication Required","Request Timeout","Conflict","Gone","Length Required","Precondition Failed","Payload Too Large","URI Too Long","Unsupported Media Type","Range Not Satisfiable","Expectation Failed","I\'m a Teapot","Misdirected Request","Unprocessable Entity","Locked","Failed Dependency","Unordered Collection","Upgrade Required","Precondition Required","Too Many Requests","Request Header Fields Too Large","Unavailable For Legal Reasons","Internal Server Error","Not Implemented","Bad Gateway","Service Unavailable","Gateway Timeout","HTTP Version Not Supported","Variant Also Negotiates","Insufficient Storage","Loop Detected","Bandwidth Limit Exceeded","Not Extended","Network Authentication Required",{},"http:",{"path":null},{},{},{},{},{"path":null},{},{},{},{"map":"179","list":"180"},{},[]]`;

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

        const axiosResponseSetCache = `[{"status":200,"statusText":null,"headers":"1","config":"2","request":"3","data":"4"},{"content-type":"5"},{"url":"6","method":"7","headers":"8","baseURL":"9","transformRequest":"10","transformResponse":"11","timeout":0,"xsrfCookieName":"12","xsrfHeaderName":"13","maxContentLength":-1,"maxBodyLength":-1,"httpsAgent":"14"},{"_events":"15","_eventsCount":6,"outputData":"16","outputSize":0,"writable":true,"_last":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":false,"_removedConnection":false,"_removedContLen":false,"_removedTE":false,"_contentLength":null,"_hasBody":true,"_trailer":"17","finished":true,"_headerSent":false,"socket":"18","connection":"18","_header":null,"_keepAliveTimeout":0,"path":"6","method":"19","req":"3","options":"20","interceptors":"21","response":"22","requestBodyBuffers":"23","playbackStarted":false,"readyToStartPlaybackOnSocketEvent":false,"_redirectable":"24","headers":"25","res":"22"},{"success":true},"application/json","/example1?param1=true&param2=123","get",{"Accept":"26","User-Agent":"27","Api-Key":"28"},"https://api.example.com",[null],[null],"XSRF-TOKEN","X-XSRF-TOKEN",{"_events":"29","_eventsCount":2,"defaultPort":443,"protocol":"30","options":"31","requests":"32","sockets":"33","freeSockets":"34","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"maxCachedSessions":100,"_sessionCache":"35"},{},[],"",{"_events":"36","_eventsCount":3,"authorized":true,"bufferSize":0,"writableLength":0,"writable":true,"readable":true,"pending":false,"destroyed":false,"connecting":false,"_hadError":false,"timeout":0,"remoteFamily":"37","remoteAddress":"38","localAddress":"38","remotePort":443,"localPort":443},"GET",{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"30","path":"6","method":"19","headers":"39","agent":"14","agents":"40","hostname":"41","port":443,"nativeProtocols":"42","pathname":"43","search":"44","proto":"45","host":"46"},[],{"_readableState":"47","readable":false,"_events":"48","_eventsCount":3,"socket":"18","connection":"18","httpVersionMajor":null,"httpVersionMinor":null,"httpVersion":null,"complete":true,"headers":"1","rawHeaders":"49","trailers":"50","rawTrailers":"51","aborted":false,"upgrade":null,"url":"17","method":null,"statusCode":200,"statusMessage":null,"client":"18","_consuming":true,"_dumped":false,"req":"3","responseUrl":"52","redirects":"53"},[],{"_writableState":"54","writable":true,"_events":"55","_eventsCount":2,"_options":"56","_ended":true,"_ending":true,"_redirectCount":0,"_redirects":"53","_requestBodyLength":0,"_requestBodyBuffers":"57","_currentRequest":"3","_currentUrl":"52"},{"accept":"26","user-agent":"27","api-key":"28","host":"41"},"application/json, text/plain, */*","@scope/package","3b48b9fd18ecca20ed5b0accbfeb6b70",{},"https:",{"rejectUnauthorized":false,"path":null},{},{},{},{"map":"58","list":"59"},{},"IPv4","127.0.0.1",{"accept":"26","user-agent":"27","api-key":"28"},{"https":"14"},"api.example.com",{"http:":"60","https:":"61"},"/example1","?param1=true&param2=123","https","api.example.com:443",{"objectMode":false,"highWaterMark":16384,"buffer":"62","length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"emitClose":true,"autoDestroy":false,"destroyed":false,"defaultEncoding":"63","awaitDrainWriters":null,"multiAwaitDrain":false,"readingMore":false,"decoder":null,"encoding":null},{},["64","5"],{},[],"https://api.example.com/example1?param1=true&param2=123",[],{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":false,"ended":false,"finished":false,"destroyed":false,"decodeStrings":true,"defaultEncoding":"63","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"afterWriteTickInfo":null,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"emitClose":true,"autoDestroy":false,"bufferedRequestCount":0,"corkedRequestsFree":"65"},{},{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"30","path":"6","method":"19","headers":"8","agent":"14","agents":"40","hostname":"41","port":null,"nativeProtocols":"42","pathname":"43","search":"44"},[],{},[],{"METHODS":"66","STATUS_CODES":"67","maxHeaderSize":8192,"globalAgent":"68"},{"globalAgent":"69"},{"head":null,"tail":null,"length":0},"utf8","Content-Type",{"next":null,"entry":null},["70","71","72","73","74","75","19","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","101","102","103"],{"100":"104","101":"105","102":"106","103":"107","200":"108","201":"109","202":"110","203":"111","204":"112","205":"113","206":"114","207":"115","208":"116","226":"117","300":"118","301":"119","302":"120","303":"121","304":"122","305":"123","307":"124","308":"125","400":"126","401":"127","402":"128","403":"129","404":"130","405":"131","406":"132","407":"133","408":"134","409":"135","410":"136","411":"137","412":"138","413":"139","414":"140","415":"141","416":"142","417":"143","418":"144","421":"145","422":"146","423":"147","424":"148","425":"149","426":"150","428":"151","429":"152","431":"153","451":"154","500":"155","501":"156","502":"157","503":"158","504":"159","505":"160","506":"161","507":"162","508":"163","509":"164","510":"165","511":"166"},{"_events":"167","_eventsCount":2,"defaultPort":80,"protocol":"168","options":"169","requests":"170","sockets":"171","freeSockets":"172","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0},{"_events":"173","_eventsCount":2,"defaultPort":443,"protocol":"30","options":"174","requests":"175","sockets":"176","freeSockets":"177","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"maxCachedSessions":100,"_sessionCache":"178"},"ACL","BIND","CHECKOUT","CONNECT","COPY","DELETE","HEAD","LINK","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCALENDAR","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","POST","PRI","PROPFIND","PROPPATCH","PURGE","PUT","REBIND","REPORT","SEARCH","SOURCE","SUBSCRIBE","TRACE","UNBIND","UNLINK","UNLOCK","UNSUBSCRIBE","Continue","Switching Protocols","Processing","Early Hints","OK","Created","Accepted","Non-Authoritative Information","No Content","Reset Content","Partial Content","Multi-Status","Already Reported","IM Used","Multiple Choices","Moved Permanently","Found","See Other","Not Modified","Use Proxy","Temporary Redirect","Permanent Redirect","Bad Request","Unauthorized","Payment Required","Forbidden","Not Found","Method Not Allowed","Not Acceptable","Proxy Authentication Required","Request Timeout","Conflict","Gone","Length Required","Precondition Failed","Payload Too Large","URI Too Long","Unsupported Media Type","Range Not Satisfiable","Expectation Failed","I'm a Teapot","Misdirected Request","Unprocessable Entity","Locked","Failed Dependency","Unordered Collection","Upgrade Required","Precondition Required","Too Many Requests","Request Header Fields Too Large","Unavailable For Legal Reasons","Internal Server Error","Not Implemented","Bad Gateway","Service Unavailable","Gateway Timeout","HTTP Version Not Supported","Variant Also Negotiates","Insufficient Storage","Loop Detected","Bandwidth Limit Exceeded","Not Extended","Network Authentication Required",{},"http:",{"path":null},{},{},{},{},{"path":null},{},{},{},{"map":"179","list":"180"},{},[]]`;

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
          '[{"status":200,"statusText":null,"headers":"1","config":"2","request":"3","data":"4"},{"content-type":"5"},{"url":"6","method":"7","data":"8","headers":"9","baseURL":"10","transformRequest":"11","transformResponse":"12","timeout":0,"xsrfCookieName":"13","xsrfHeaderName":"14","maxContentLength":-1,"maxBodyLength":-1,"httpsAgent":"15"},{"_events":"16","_eventsCount":6,"outputData":"17","outputSize":0,"writable":true,"_last":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":false,"_removedConnection":false,"_removedContLen":false,"_removedTE":false,"_contentLength":null,"_hasBody":true,"_trailer":"18","finished":true,"_headerSent":false,"socket":"19","connection":"19","_header":null,"_keepAliveTimeout":0,"path":"6","method":"20","req":"3","options":"21","interceptors":"22","response":"23","requestBodyBuffers":"24","playbackStarted":false,"readyToStartPlaybackOnSocketEvent":false,"_redirectable":"25","headers":"26","res":"23"},{"success":true},"application/json","/example1?param1=true&param2=123","post","{\\"hello\\":\\"world\\"}",{"Accept":"27","Content-Type":"28","User-Agent":"29","Api-Key":"30","Content-Length":17},"https://api.example.com",[null],[null],"XSRF-TOKEN","X-XSRF-TOKEN",{"_events":"31","_eventsCount":2,"defaultPort":443,"protocol":"32","options":"33","requests":"34","sockets":"35","freeSockets":"36","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"maxCachedSessions":100,"_sessionCache":"37"},{},[],"",{"_events":"38","_eventsCount":3,"authorized":true,"bufferSize":0,"writableLength":0,"writable":true,"readable":true,"pending":false,"destroyed":false,"connecting":false,"_hadError":false,"timeout":0,"remoteFamily":"39","remoteAddress":"40","localAddress":"40","remotePort":443,"localPort":443},"POST",{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"32","path":"6","method":"20","headers":"41","agent":"15","agents":"42","hostname":"43","port":443,"nativeProtocols":"44","pathname":"45","search":"46","proto":"47","host":"48"},[],{"_readableState":"49","readable":false,"_events":"50","_eventsCount":3,"socket":"19","connection":"19","httpVersionMajor":null,"httpVersionMinor":null,"httpVersion":null,"complete":true,"headers":"1","rawHeaders":"51","trailers":"52","rawTrailers":"53","aborted":false,"upgrade":null,"url":"18","method":null,"statusCode":200,"statusMessage":null,"client":"19","_consuming":true,"_dumped":false,"req":"3","responseUrl":"54","redirects":"55"},["56"],{"_writableState":"57","writable":true,"_events":"58","_eventsCount":2,"_options":"59","_ended":true,"_ending":true,"_redirectCount":0,"_redirects":"55","_requestBodyLength":17,"_requestBodyBuffers":"60","_currentRequest":"3","_currentUrl":"54"},{"accept":"27","content-type":"28","user-agent":"29","api-key":"30","content-length":17,"host":"43"},"application/json, text/plain, */*","application/json;charset=utf-8","@scope/package","3b48b9fd18ecca20ed5b0accbfeb6b70",{},"https:",{"rejectUnauthorized":false,"path":null},{},{},{},{"map":"61","list":"62"},{},"IPv4","127.0.0.1",{"accept":"27","content-type":"28","user-agent":"29","api-key":"30","content-length":17},{"https":"15"},"api.example.com",{"http:":"63","https:":"64"},"/example1","?param1=true&param2=123","https","api.example.com:443",{"objectMode":false,"highWaterMark":16384,"buffer":"65","length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"emitClose":true,"autoDestroy":false,"destroyed":false,"defaultEncoding":"66","awaitDrainWriters":null,"multiAwaitDrain":false,"readingMore":false,"decoder":null,"encoding":null},{},["67","5"],{},[],"https://api.example.com/example1?param1=true&param2=123",[],{"type":"68","data":"69"},{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":false,"ended":false,"finished":false,"destroyed":false,"decodeStrings":true,"defaultEncoding":"66","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"afterWriteTickInfo":null,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"emitClose":true,"autoDestroy":false,"bufferedRequestCount":0,"corkedRequestsFree":"70"},{},{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"32","path":"6","method":"20","headers":"9","agent":"15","agents":"42","hostname":"43","port":null,"nativeProtocols":"44","pathname":"45","search":"46"},[],{},[],{"METHODS":"71","STATUS_CODES":"72","maxHeaderSize":8192,"globalAgent":"73"},{"globalAgent":"74"},{"head":null,"tail":null,"length":0},"utf8","Content-Type","Buffer",[123,34,104,101,108,108,111,34,58,34,119,111,114,108,100,34,125],{"next":null,"entry":null},["75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","20","94","95","96","97","98","99","100","101","102","103","104","105","106","107","108"],{"100":"109","101":"110","102":"111","103":"112","200":"113","201":"114","202":"115","203":"116","204":"117","205":"118","206":"119","207":"120","208":"121","226":"122","300":"123","301":"124","302":"125","303":"126","304":"127","305":"128","307":"129","308":"130","400":"131","401":"132","402":"133","403":"134","404":"135","405":"136","406":"137","407":"138","408":"139","409":"140","410":"141","411":"142","412":"143","413":"144","414":"145","415":"146","416":"147","417":"148","418":"149","421":"150","422":"151","423":"152","424":"153","425":"154","426":"155","428":"156","429":"157","431":"158","451":"159","500":"160","501":"161","502":"162","503":"163","504":"164","505":"165","506":"166","507":"167","508":"168","509":"169","510":"170","511":"171"},{"_events":"172","_eventsCount":2,"defaultPort":80,"protocol":"173","options":"174","requests":"175","sockets":"176","freeSockets":"177","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0},{"_events":"178","_eventsCount":2,"defaultPort":443,"protocol":"32","options":"179","requests":"180","sockets":"181","freeSockets":"182","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"maxCachedSessions":100,"_sessionCache":"183"},"ACL","BIND","CHECKOUT","CONNECT","COPY","DELETE","GET","HEAD","LINK","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCALENDAR","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","PRI","PROPFIND","PROPPATCH","PURGE","PUT","REBIND","REPORT","SEARCH","SOURCE","SUBSCRIBE","TRACE","UNBIND","UNLINK","UNLOCK","UNSUBSCRIBE","Continue","Switching Protocols","Processing","Early Hints","OK","Created","Accepted","Non-Authoritative Information","No Content","Reset Content","Partial Content","Multi-Status","Already Reported","IM Used","Multiple Choices","Moved Permanently","Found","See Other","Not Modified","Use Proxy","Temporary Redirect","Permanent Redirect","Bad Request","Unauthorized","Payment Required","Forbidden","Not Found","Method Not Allowed","Not Acceptable","Proxy Authentication Required","Request Timeout","Conflict","Gone","Length Required","Precondition Failed","Payload Too Large","URI Too Long","Unsupported Media Type","Range Not Satisfiable","Expectation Failed","I\'m a Teapot","Misdirected Request","Unprocessable Entity","Locked","Failed Dependency","Unordered Collection","Upgrade Required","Precondition Required","Too Many Requests","Request Header Fields Too Large","Unavailable For Legal Reasons","Internal Server Error","Not Implemented","Bad Gateway","Service Unavailable","Gateway Timeout","HTTP Version Not Supported","Variant Also Negotiates","Insufficient Storage","Loop Detected","Bandwidth Limit Exceeded","Not Extended","Network Authentication Required",{},"http:",{"path":null},{},{},{},{},{"path":null},{},{},{},{"map":"184","list":"185"},{},[]]';

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
          '[{"status":200,"statusText":null,"headers":"1","config":"2","request":"3","data":"4"},{"content-type":"5"},{"url":"6","method":"7","data":"8","headers":"9","baseURL":"10","transformRequest":"11","transformResponse":"12","timeout":0,"xsrfCookieName":"13","xsrfHeaderName":"14","maxContentLength":-1,"maxBodyLength":-1,"httpsAgent":"15"},{"_events":"16","_eventsCount":6,"outputData":"17","outputSize":0,"writable":true,"_last":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":false,"_removedConnection":false,"_removedContLen":false,"_removedTE":false,"_contentLength":null,"_hasBody":true,"_trailer":"18","finished":true,"_headerSent":false,"socket":"19","connection":"19","_header":null,"_keepAliveTimeout":0,"path":"6","method":"20","req":"3","options":"21","interceptors":"22","response":"23","requestBodyBuffers":"24","playbackStarted":false,"readyToStartPlaybackOnSocketEvent":false,"_redirectable":"25","headers":"26","res":"23"},{"success":true},"application/json","/example1?param1=true&param2=123","post","{\\"hello\\":\\"world\\"}",{"Accept":"27","Content-Type":"28","User-Agent":"29","Api-Key":"30","Content-Length":17},"https://api.example.com",[null],[null],"XSRF-TOKEN","X-XSRF-TOKEN",{"_events":"31","_eventsCount":2,"defaultPort":443,"protocol":"32","options":"33","requests":"34","sockets":"35","freeSockets":"36","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"maxCachedSessions":100,"_sessionCache":"37"},{},[],"",{"_events":"38","_eventsCount":3,"authorized":true,"bufferSize":0,"writableLength":0,"writable":true,"readable":true,"pending":false,"destroyed":false,"connecting":false,"_hadError":false,"timeout":0,"remoteFamily":"39","remoteAddress":"40","localAddress":"40","remotePort":443,"localPort":443},"POST",{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"32","path":"6","method":"20","headers":"41","agent":"15","agents":"42","hostname":"43","port":443,"nativeProtocols":"44","pathname":"45","search":"46","proto":"47","host":"48"},[],{"_readableState":"49","readable":false,"_events":"50","_eventsCount":3,"socket":"19","connection":"19","httpVersionMajor":null,"httpVersionMinor":null,"httpVersion":null,"complete":true,"headers":"1","rawHeaders":"51","trailers":"52","rawTrailers":"53","aborted":false,"upgrade":null,"url":"18","method":null,"statusCode":200,"statusMessage":null,"client":"19","_consuming":true,"_dumped":false,"req":"3","responseUrl":"54","redirects":"55"},["56"],{"_writableState":"57","writable":true,"_events":"58","_eventsCount":2,"_options":"59","_ended":true,"_ending":true,"_redirectCount":0,"_redirects":"55","_requestBodyLength":17,"_requestBodyBuffers":"60","_currentRequest":"3","_currentUrl":"54"},{"accept":"27","content-type":"28","user-agent":"29","api-key":"30","content-length":17,"host":"43"},"application/json, text/plain, */*","application/json;charset=utf-8","@scope/package","3b48b9fd18ecca20ed5b0accbfeb6b70",{},"https:",{"rejectUnauthorized":false,"path":null},{},{},{},{"map":"61","list":"62"},{},"IPv4","127.0.0.1",{"accept":"27","content-type":"28","user-agent":"29","api-key":"30","content-length":17},{"https":"15"},"api.example.com",{"http:":"63","https:":"64"},"/example1","?param1=true&param2=123","https","api.example.com:443",{"objectMode":false,"highWaterMark":16384,"buffer":"65","length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"emitClose":true,"autoDestroy":false,"destroyed":false,"defaultEncoding":"66","awaitDrainWriters":null,"multiAwaitDrain":false,"readingMore":false,"decoder":null,"encoding":null},{},["67","5"],{},[],"https://api.example.com/example1?param1=true&param2=123",[],{"type":"68","data":"69"},{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":false,"ended":false,"finished":false,"destroyed":false,"decodeStrings":true,"defaultEncoding":"66","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"afterWriteTickInfo":null,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"emitClose":true,"autoDestroy":false,"bufferedRequestCount":0,"corkedRequestsFree":"70"},{},{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"32","path":"6","method":"20","headers":"9","agent":"15","agents":"42","hostname":"43","port":null,"nativeProtocols":"44","pathname":"45","search":"46"},[],{},[],{"METHODS":"71","STATUS_CODES":"72","maxHeaderSize":8192,"globalAgent":"73"},{"globalAgent":"74"},{"head":null,"tail":null,"length":0},"utf8","Content-Type","Buffer",[123,34,104,101,108,108,111,34,58,34,119,111,114,108,100,34,125],{"next":null,"entry":null},["75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","20","94","95","96","97","98","99","100","101","102","103","104","105","106","107","108"],{"100":"109","101":"110","102":"111","103":"112","200":"113","201":"114","202":"115","203":"116","204":"117","205":"118","206":"119","207":"120","208":"121","226":"122","300":"123","301":"124","302":"125","303":"126","304":"127","305":"128","307":"129","308":"130","400":"131","401":"132","402":"133","403":"134","404":"135","405":"136","406":"137","407":"138","408":"139","409":"140","410":"141","411":"142","412":"143","413":"144","414":"145","415":"146","416":"147","417":"148","418":"149","421":"150","422":"151","423":"152","424":"153","425":"154","426":"155","428":"156","429":"157","431":"158","451":"159","500":"160","501":"161","502":"162","503":"163","504":"164","505":"165","506":"166","507":"167","508":"168","509":"169","510":"170","511":"171"},{"_events":"172","_eventsCount":2,"defaultPort":80,"protocol":"173","options":"174","requests":"175","sockets":"176","freeSockets":"177","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0},{"_events":"178","_eventsCount":2,"defaultPort":443,"protocol":"32","options":"179","requests":"180","sockets":"181","freeSockets":"182","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"maxCachedSessions":100,"_sessionCache":"183"},"ACL","BIND","CHECKOUT","CONNECT","COPY","DELETE","GET","HEAD","LINK","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCALENDAR","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","PRI","PROPFIND","PROPPATCH","PURGE","PUT","REBIND","REPORT","SEARCH","SOURCE","SUBSCRIBE","TRACE","UNBIND","UNLINK","UNLOCK","UNSUBSCRIBE","Continue","Switching Protocols","Processing","Early Hints","OK","Created","Accepted","Non-Authoritative Information","No Content","Reset Content","Partial Content","Multi-Status","Already Reported","IM Used","Multiple Choices","Moved Permanently","Found","See Other","Not Modified","Use Proxy","Temporary Redirect","Permanent Redirect","Bad Request","Unauthorized","Payment Required","Forbidden","Not Found","Method Not Allowed","Not Acceptable","Proxy Authentication Required","Request Timeout","Conflict","Gone","Length Required","Precondition Failed","Payload Too Large","URI Too Long","Unsupported Media Type","Range Not Satisfiable","Expectation Failed","I\'m a Teapot","Misdirected Request","Unprocessable Entity","Locked","Failed Dependency","Unordered Collection","Upgrade Required","Precondition Required","Too Many Requests","Request Header Fields Too Large","Unavailable For Legal Reasons","Internal Server Error","Not Implemented","Bad Gateway","Service Unavailable","Gateway Timeout","HTTP Version Not Supported","Variant Also Negotiates","Insufficient Storage","Loop Detected","Bandwidth Limit Exceeded","Not Extended","Network Authentication Required",{},"http:",{"path":null},{},{},{},{},{"path":null},{},{},{},{"map":"184","list":"185"},{},[]]';

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
