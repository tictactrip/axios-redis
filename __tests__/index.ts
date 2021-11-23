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
          '[{"status":200,"statusText":null,"headers":"1","config":"2","request":"3","data":"4"},{"content-type":"5"},{"transitional":"6","transformRequest":"7","transformResponse":"8","timeout":0,"xsrfCookieName":"9","xsrfHeaderName":"10","maxContentLength":-1,"maxBodyLength":-1,"headers":"11","baseURL":"12","httpsAgent":"13","method":"14","url":"15"},{"_events":"16","_eventsCount":6,"outputData":"17","outputSize":0,"writable":true,"_last":false,"chunkedEncoding":false,"shouldKeepAlive":true,"_defaultKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":false,"_removedConnection":false,"_removedContLen":false,"_removedTE":false,"_contentLength":null,"_hasBody":true,"_trailer":"18","finished":true,"_headerSent":false,"socket":"19","connection":"19","_header":null,"_keepAliveTimeout":0,"path":"15","method":"20","req":"3","options":"21","interceptors":"22","response":"23","requestBodyBuffers":"24","playbackStarted":false,"readyToStartPlaybackOnSocketEvent":false,"_redirectable":"25","headers":"26","res":"23"},{"success":true},"application/json",{"silentJSONParsing":true,"forcedJSONParsing":true,"clarifyTimeoutError":false},[null],[null],"XSRF-TOKEN","X-XSRF-TOKEN",{"Accept":"27","User-Agent":"28","Api-Key":"29"},"https://api.example.com",{"_events":"30","_eventsCount":2,"defaultPort":443,"protocol":"31","options":"32","requests":"33","sockets":"34","freeSockets":"35","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"scheduling":"36","maxCachedSessions":100,"_sessionCache":"37"},"get","/example1?param1=true&param2=123",{},[],"",{"_events":"38","_eventsCount":3,"authorized":true,"encrypted":true,"bufferSize":0,"writableLength":0,"writable":true,"readable":true,"pending":false,"destroyed":false,"connecting":false,"_hadError":false,"timeout":0,"remoteFamily":"39","remoteAddress":"40","localAddress":"40","remotePort":443,"localPort":443},"GET",{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"31","path":"15","method":"20","headers":"41","agent":"13","agents":"42","hostname":"43","port":443,"nativeProtocols":"44","pathname":"45","search":"46","proto":"47","host":"48"},[],{"_readableState":"49","readable":false,"_events":"50","_eventsCount":3,"socket":"19","connection":"19","httpVersionMajor":null,"httpVersionMinor":null,"httpVersion":null,"complete":true,"headers":"1","rawHeaders":"51","trailers":"52","rawTrailers":"53","aborted":false,"upgrade":null,"url":"18","method":null,"statusCode":200,"statusMessage":null,"client":"19","_consuming":true,"_dumped":false,"req":"3","responseUrl":"54","redirects":"55"},[],{"_writableState":"56","writable":true,"_events":"57","_eventsCount":2,"_options":"58","_ended":true,"_ending":true,"_redirectCount":0,"_redirects":"55","_requestBodyLength":0,"_requestBodyBuffers":"59","_currentRequest":"3","_currentUrl":"54"},{"accept":"27","user-agent":"28","api-key":"29","host":"43"},"application/json, text/plain, */*","@scope/package","3b48b9fd18ecca20ed5b0accbfeb6b70",{},"https:",{"rejectUnauthorized":false,"path":null},{},{},{},"fifo",{"map":"60","list":"61"},{},"IPv4","127.0.0.1",{"accept":"27","user-agent":"28","api-key":"29"},{"https":"13"},"api.example.com",{"http:":"62","https:":"63"},"/example1","?param1=true&param2=123","https","api.example.com:443",{"objectMode":false,"highWaterMark":16384,"buffer":"64","length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"emitClose":true,"autoDestroy":false,"destroyed":false,"defaultEncoding":"65","awaitDrainWriters":null,"multiAwaitDrain":false,"readingMore":false,"decoder":null,"encoding":null},{},["66","5"],{},[],"https://api.example.com/example1?param1=true&param2=123",[],{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":false,"ended":false,"finished":false,"destroyed":false,"decodeStrings":true,"defaultEncoding":"65","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"afterWriteTickInfo":null,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"emitClose":true,"autoDestroy":false,"bufferedRequestCount":0,"corkedRequestsFree":"67"},{},{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"31","path":"15","method":"20","headers":"11","agent":"13","agents":"42","hostname":"43","port":null,"nativeProtocols":"44","pathname":"45","search":"46"},[],{},[],{"METHODS":"68","STATUS_CODES":"69","maxHeaderSize":8192,"globalAgent":"70"},{"globalAgent":"71"},{"head":null,"tail":null,"length":0},"utf8","Content-Type",{"next":null,"entry":null},["72","73","74","75","76","77","20","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","101","102","103","104","105"],{"100":"106","101":"107","102":"108","103":"109","200":"110","201":"111","202":"112","203":"113","204":"114","205":"115","206":"116","207":"117","208":"118","226":"119","300":"120","301":"121","302":"122","303":"123","304":"124","305":"125","307":"126","308":"127","400":"128","401":"129","402":"130","403":"131","404":"132","405":"133","406":"134","407":"135","408":"136","409":"137","410":"138","411":"139","412":"140","413":"141","414":"142","415":"143","416":"144","417":"145","418":"146","421":"147","422":"148","423":"149","424":"150","425":"151","426":"152","428":"153","429":"154","431":"155","451":"156","500":"157","501":"158","502":"159","503":"160","504":"161","505":"162","506":"163","507":"164","508":"165","509":"166","510":"167","511":"168"},{"_events":"169","_eventsCount":2,"defaultPort":80,"protocol":"170","options":"171","requests":"172","sockets":"173","freeSockets":"174","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"scheduling":"36"},{"_events":"175","_eventsCount":2,"defaultPort":443,"protocol":"31","options":"176","requests":"177","sockets":"178","freeSockets":"179","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"scheduling":"36","maxCachedSessions":100,"_sessionCache":"180"},"ACL","BIND","CHECKOUT","CONNECT","COPY","DELETE","HEAD","LINK","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCALENDAR","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","POST","PRI","PROPFIND","PROPPATCH","PURGE","PUT","REBIND","REPORT","SEARCH","SOURCE","SUBSCRIBE","TRACE","UNBIND","UNLINK","UNLOCK","UNSUBSCRIBE","Continue","Switching Protocols","Processing","Early Hints","OK","Created","Accepted","Non-Authoritative Information","No Content","Reset Content","Partial Content","Multi-Status","Already Reported","IM Used","Multiple Choices","Moved Permanently","Found","See Other","Not Modified","Use Proxy","Temporary Redirect","Permanent Redirect","Bad Request","Unauthorized","Payment Required","Forbidden","Not Found","Method Not Allowed","Not Acceptable","Proxy Authentication Required","Request Timeout","Conflict","Gone","Length Required","Precondition Failed","Payload Too Large","URI Too Long","Unsupported Media Type","Range Not Satisfiable","Expectation Failed","I\'m a Teapot","Misdirected Request","Unprocessable Entity","Locked","Failed Dependency","Unordered Collection","Upgrade Required","Precondition Required","Too Many Requests","Request Header Fields Too Large","Unavailable For Legal Reasons","Internal Server Error","Not Implemented","Bad Gateway","Service Unavailable","Gateway Timeout","HTTP Version Not Supported","Variant Also Negotiates","Insufficient Storage","Loop Detected","Bandwidth Limit Exceeded","Not Extended","Network Authentication Required",{},"http:",{"path":null},{},{},{},{},{"path":null},{},{},{},{"map":"181","list":"182"},{},[]]';

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
          '[{"status":200,"statusText":null,"headers":"1","config":"2","request":"3","data":"4"},{"content-type":"5"},{"transitional":"6","transformRequest":"7","transformResponse":"8","timeout":0,"xsrfCookieName":"9","xsrfHeaderName":"10","maxContentLength":-1,"maxBodyLength":-1,"headers":"11","baseURL":"12","httpsAgent":"13","method":"14","url":"15"},{"_events":"16","_eventsCount":6,"outputData":"17","outputSize":0,"writable":true,"_last":false,"chunkedEncoding":false,"shouldKeepAlive":true,"_defaultKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":false,"_removedConnection":false,"_removedContLen":false,"_removedTE":false,"_contentLength":null,"_hasBody":true,"_trailer":"18","finished":true,"_headerSent":false,"socket":"19","connection":"19","_header":null,"_keepAliveTimeout":0,"path":"15","method":"20","req":"3","options":"21","interceptors":"22","response":"23","requestBodyBuffers":"24","playbackStarted":false,"readyToStartPlaybackOnSocketEvent":false,"_redirectable":"25","headers":"26","res":"23"},{"success":true},"application/json",{"silentJSONParsing":true,"forcedJSONParsing":true,"clarifyTimeoutError":false},[null],[null],"XSRF-TOKEN","X-XSRF-TOKEN",{"Accept":"27","User-Agent":"28","Api-Key":"29"},"https://api.example.com",{"_events":"30","_eventsCount":2,"defaultPort":443,"protocol":"31","options":"32","requests":"33","sockets":"34","freeSockets":"35","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"scheduling":"36","maxCachedSessions":100,"_sessionCache":"37"},"get","/example2?param1=true&param2=123",{},[],"",{"_events":"38","_eventsCount":3,"authorized":true,"encrypted":true,"bufferSize":0,"writableLength":0,"writable":true,"readable":true,"pending":false,"destroyed":false,"connecting":false,"_hadError":false,"timeout":0,"remoteFamily":"39","remoteAddress":"40","localAddress":"40","remotePort":443,"localPort":443},"GET",{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"31","path":"15","method":"20","headers":"41","agent":"13","agents":"42","hostname":"43","port":443,"nativeProtocols":"44","pathname":"45","search":"46","proto":"47","host":"48"},[],{"_readableState":"49","readable":false,"_events":"50","_eventsCount":3,"socket":"19","connection":"19","httpVersionMajor":null,"httpVersionMinor":null,"httpVersion":null,"complete":true,"headers":"1","rawHeaders":"51","trailers":"52","rawTrailers":"53","aborted":false,"upgrade":null,"url":"18","method":null,"statusCode":200,"statusMessage":null,"client":"19","_consuming":true,"_dumped":false,"req":"3","responseUrl":"54","redirects":"55"},[],{"_writableState":"56","writable":true,"_events":"57","_eventsCount":2,"_options":"58","_ended":true,"_ending":true,"_redirectCount":0,"_redirects":"55","_requestBodyLength":0,"_requestBodyBuffers":"59","_currentRequest":"3","_currentUrl":"54"},{"accept":"27","user-agent":"28","api-key":"29","host":"43"},"application/json, text/plain, */*","@scope/package","3b48b9fd18ecca20ed5b0accbfeb6b70",{},"https:",{"rejectUnauthorized":false,"path":null},{},{},{},"fifo",{"map":"60","list":"61"},{},"IPv4","127.0.0.1",{"accept":"27","user-agent":"28","api-key":"29"},{"https":"13"},"api.example.com",{"http:":"62","https:":"63"},"/example2","?param1=true&param2=123","https","api.example.com:443",{"objectMode":false,"highWaterMark":16384,"buffer":"64","length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"emitClose":true,"autoDestroy":false,"destroyed":false,"defaultEncoding":"65","awaitDrainWriters":null,"multiAwaitDrain":false,"readingMore":false,"decoder":null,"encoding":null},{},["66","5"],{},[],"https://api.example.com/example2?param1=true&param2=123",[],{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":false,"ended":false,"finished":false,"destroyed":false,"decodeStrings":true,"defaultEncoding":"65","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"afterWriteTickInfo":null,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"emitClose":true,"autoDestroy":false,"bufferedRequestCount":0,"corkedRequestsFree":"67"},{},{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"31","path":"15","method":"20","headers":"11","agent":"13","agents":"42","hostname":"43","port":null,"nativeProtocols":"44","pathname":"45","search":"46"},[],{},[],{"METHODS":"68","STATUS_CODES":"69","maxHeaderSize":8192,"globalAgent":"70"},{"globalAgent":"71"},{"head":null,"tail":null,"length":0},"utf8","Content-Type",{"next":null,"entry":null},["72","73","74","75","76","77","20","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","101","102","103","104","105"],{"100":"106","101":"107","102":"108","103":"109","200":"110","201":"111","202":"112","203":"113","204":"114","205":"115","206":"116","207":"117","208":"118","226":"119","300":"120","301":"121","302":"122","303":"123","304":"124","305":"125","307":"126","308":"127","400":"128","401":"129","402":"130","403":"131","404":"132","405":"133","406":"134","407":"135","408":"136","409":"137","410":"138","411":"139","412":"140","413":"141","414":"142","415":"143","416":"144","417":"145","418":"146","421":"147","422":"148","423":"149","424":"150","425":"151","426":"152","428":"153","429":"154","431":"155","451":"156","500":"157","501":"158","502":"159","503":"160","504":"161","505":"162","506":"163","507":"164","508":"165","509":"166","510":"167","511":"168"},{"_events":"169","_eventsCount":2,"defaultPort":80,"protocol":"170","options":"171","requests":"172","sockets":"173","freeSockets":"174","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"scheduling":"36"},{"_events":"175","_eventsCount":2,"defaultPort":443,"protocol":"31","options":"176","requests":"177","sockets":"178","freeSockets":"179","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"scheduling":"36","maxCachedSessions":100,"_sessionCache":"180"},"ACL","BIND","CHECKOUT","CONNECT","COPY","DELETE","HEAD","LINK","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCALENDAR","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","POST","PRI","PROPFIND","PROPPATCH","PURGE","PUT","REBIND","REPORT","SEARCH","SOURCE","SUBSCRIBE","TRACE","UNBIND","UNLINK","UNLOCK","UNSUBSCRIBE","Continue","Switching Protocols","Processing","Early Hints","OK","Created","Accepted","Non-Authoritative Information","No Content","Reset Content","Partial Content","Multi-Status","Already Reported","IM Used","Multiple Choices","Moved Permanently","Found","See Other","Not Modified","Use Proxy","Temporary Redirect","Permanent Redirect","Bad Request","Unauthorized","Payment Required","Forbidden","Not Found","Method Not Allowed","Not Acceptable","Proxy Authentication Required","Request Timeout","Conflict","Gone","Length Required","Precondition Failed","Payload Too Large","URI Too Long","Unsupported Media Type","Range Not Satisfiable","Expectation Failed","I\'m a Teapot","Misdirected Request","Unprocessable Entity","Locked","Failed Dependency","Unordered Collection","Upgrade Required","Precondition Required","Too Many Requests","Request Header Fields Too Large","Unavailable For Legal Reasons","Internal Server Error","Not Implemented","Bad Gateway","Service Unavailable","Gateway Timeout","HTTP Version Not Supported","Variant Also Negotiates","Insufficient Storage","Loop Detected","Bandwidth Limit Exceeded","Not Extended","Network Authentication Required",{},"http:",{"path":null},{},{},{},{},{"path":null},{},{},{},{"map":"181","list":"182"},{},[]]';

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
          '[{"status":200,"statusText":null,"headers":"1","config":"2","request":"3","data":"4"},{"content-type":"5"},{"transitional":"6","transformRequest":"7","transformResponse":"8","timeout":0,"xsrfCookieName":"9","xsrfHeaderName":"10","maxContentLength":-1,"maxBodyLength":-1,"headers":"11","baseURL":"12","httpsAgent":"13","method":"14","url":"15"},{"_events":"16","_eventsCount":6,"outputData":"17","outputSize":0,"writable":true,"_last":false,"chunkedEncoding":false,"shouldKeepAlive":true,"_defaultKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":false,"_removedConnection":false,"_removedContLen":false,"_removedTE":false,"_contentLength":null,"_hasBody":true,"_trailer":"18","finished":true,"_headerSent":false,"socket":"19","connection":"19","_header":null,"_keepAliveTimeout":0,"path":"15","method":"20","req":"3","options":"21","interceptors":"22","response":"23","requestBodyBuffers":"24","playbackStarted":false,"readyToStartPlaybackOnSocketEvent":false,"_redirectable":"25","headers":"26","res":"23"},{"success":true},"application/json",{"silentJSONParsing":true,"forcedJSONParsing":true,"clarifyTimeoutError":false},[null],[null],"XSRF-TOKEN","X-XSRF-TOKEN",{"Accept":"27","User-Agent":"28","Api-Key":"29"},"https://api.example.com",{"_events":"30","_eventsCount":2,"defaultPort":443,"protocol":"31","options":"32","requests":"33","sockets":"34","freeSockets":"35","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"scheduling":"36","maxCachedSessions":100,"_sessionCache":"37"},"get","/example1?param1=true&param2=123",{},[],"",{"_events":"38","_eventsCount":3,"authorized":true,"encrypted":true,"bufferSize":0,"writableLength":0,"writable":true,"readable":true,"pending":false,"destroyed":false,"connecting":false,"_hadError":false,"timeout":0,"remoteFamily":"39","remoteAddress":"40","localAddress":"40","remotePort":443,"localPort":443},"GET",{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"31","path":"15","method":"20","headers":"41","agent":"13","agents":"42","hostname":"43","port":443,"nativeProtocols":"44","pathname":"45","search":"46","proto":"47","host":"48"},[],{"_readableState":"49","readable":false,"_events":"50","_eventsCount":3,"socket":"19","connection":"19","httpVersionMajor":null,"httpVersionMinor":null,"httpVersion":null,"complete":true,"headers":"1","rawHeaders":"51","trailers":"52","rawTrailers":"53","aborted":false,"upgrade":null,"url":"18","method":null,"statusCode":200,"statusMessage":null,"client":"19","_consuming":true,"_dumped":false,"req":"3","responseUrl":"54","redirects":"55"},[],{"_writableState":"56","writable":true,"_events":"57","_eventsCount":2,"_options":"58","_ended":true,"_ending":true,"_redirectCount":0,"_redirects":"55","_requestBodyLength":0,"_requestBodyBuffers":"59","_currentRequest":"3","_currentUrl":"54"},{"accept":"27","user-agent":"28","api-key":"29","host":"43"},"application/json, text/plain, */*","@scope/package","3b48b9fd18ecca20ed5b0accbfeb6b70",{},"https:",{"rejectUnauthorized":false,"path":null},{},{},{},"fifo",{"map":"60","list":"61"},{},"IPv4","127.0.0.1",{"accept":"27","user-agent":"28","api-key":"29"},{"https":"13"},"api.example.com",{"http:":"62","https:":"63"},"/example1","?param1=true&param2=123","https","api.example.com:443",{"objectMode":false,"highWaterMark":16384,"buffer":"64","length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"emitClose":true,"autoDestroy":false,"destroyed":false,"defaultEncoding":"65","awaitDrainWriters":null,"multiAwaitDrain":false,"readingMore":false,"decoder":null,"encoding":null},{},["66","5"],{},[],"https://api.example.com/example1?param1=true&param2=123",[],{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":false,"ended":false,"finished":false,"destroyed":false,"decodeStrings":true,"defaultEncoding":"65","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"afterWriteTickInfo":null,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"emitClose":true,"autoDestroy":false,"bufferedRequestCount":0,"corkedRequestsFree":"67"},{},{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"31","path":"15","method":"20","headers":"11","agent":"13","agents":"42","hostname":"43","port":null,"nativeProtocols":"44","pathname":"45","search":"46"},[],{},[],{"METHODS":"68","STATUS_CODES":"69","maxHeaderSize":8192,"globalAgent":"70"},{"globalAgent":"71"},{"head":null,"tail":null,"length":0},"utf8","Content-Type",{"next":null,"entry":null},["72","73","74","75","76","77","20","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99","100","101","102","103","104","105"],{"100":"106","101":"107","102":"108","103":"109","200":"110","201":"111","202":"112","203":"113","204":"114","205":"115","206":"116","207":"117","208":"118","226":"119","300":"120","301":"121","302":"122","303":"123","304":"124","305":"125","307":"126","308":"127","400":"128","401":"129","402":"130","403":"131","404":"132","405":"133","406":"134","407":"135","408":"136","409":"137","410":"138","411":"139","412":"140","413":"141","414":"142","415":"143","416":"144","417":"145","418":"146","421":"147","422":"148","423":"149","424":"150","425":"151","426":"152","428":"153","429":"154","431":"155","451":"156","500":"157","501":"158","502":"159","503":"160","504":"161","505":"162","506":"163","507":"164","508":"165","509":"166","510":"167","511":"168"},{"_events":"169","_eventsCount":2,"defaultPort":80,"protocol":"170","options":"171","requests":"172","sockets":"173","freeSockets":"174","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"scheduling":"36"},{"_events":"175","_eventsCount":2,"defaultPort":443,"protocol":"31","options":"176","requests":"177","sockets":"178","freeSockets":"179","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"scheduling":"36","maxCachedSessions":100,"_sessionCache":"180"},"ACL","BIND","CHECKOUT","CONNECT","COPY","DELETE","HEAD","LINK","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCALENDAR","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","POST","PRI","PROPFIND","PROPPATCH","PURGE","PUT","REBIND","REPORT","SEARCH","SOURCE","SUBSCRIBE","TRACE","UNBIND","UNLINK","UNLOCK","UNSUBSCRIBE","Continue","Switching Protocols","Processing","Early Hints","OK","Created","Accepted","Non-Authoritative Information","No Content","Reset Content","Partial Content","Multi-Status","Already Reported","IM Used","Multiple Choices","Moved Permanently","Found","See Other","Not Modified","Use Proxy","Temporary Redirect","Permanent Redirect","Bad Request","Unauthorized","Payment Required","Forbidden","Not Found","Method Not Allowed","Not Acceptable","Proxy Authentication Required","Request Timeout","Conflict","Gone","Length Required","Precondition Failed","Payload Too Large","URI Too Long","Unsupported Media Type","Range Not Satisfiable","Expectation Failed","I\'m a Teapot","Misdirected Request","Unprocessable Entity","Locked","Failed Dependency","Unordered Collection","Upgrade Required","Precondition Required","Too Many Requests","Request Header Fields Too Large","Unavailable For Legal Reasons","Internal Server Error","Not Implemented","Bad Gateway","Service Unavailable","Gateway Timeout","HTTP Version Not Supported","Variant Also Negotiates","Insufficient Storage","Loop Detected","Bandwidth Limit Exceeded","Not Extended","Network Authentication Required",{},"http:",{"path":null},{},{},{},{},{"path":null},{},{},{},{"map":"181","list":"182"},{},[]]';

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
          '[{"status":200,"statusText":null,"headers":"1","config":"2","request":"3","data":"4"},{"content-type":"5"},{"transitional":"6","transformRequest":"7","transformResponse":"8","timeout":0,"xsrfCookieName":"9","xsrfHeaderName":"10","maxContentLength":-1,"maxBodyLength":-1,"headers":"11","baseURL":"12","httpsAgent":"13","method":"14","url":"15","data":"16"},{"_events":"17","_eventsCount":6,"outputData":"18","outputSize":0,"writable":true,"_last":false,"chunkedEncoding":false,"shouldKeepAlive":true,"_defaultKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":false,"_removedConnection":false,"_removedContLen":false,"_removedTE":false,"_contentLength":null,"_hasBody":true,"_trailer":"19","finished":true,"_headerSent":false,"socket":"20","connection":"20","_header":null,"_keepAliveTimeout":0,"path":"15","method":"21","req":"3","options":"22","interceptors":"23","response":"24","requestBodyBuffers":"25","playbackStarted":false,"readyToStartPlaybackOnSocketEvent":false,"_redirectable":"26","headers":"27","res":"24"},{"success":true},"application/json",{"silentJSONParsing":true,"forcedJSONParsing":true,"clarifyTimeoutError":false},[null],[null],"XSRF-TOKEN","X-XSRF-TOKEN",{"Accept":"28","Content-Type":"5","User-Agent":"29","Api-Key":"30","Content-Length":17},"https://api.example.com",{"_events":"31","_eventsCount":2,"defaultPort":443,"protocol":"32","options":"33","requests":"34","sockets":"35","freeSockets":"36","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"scheduling":"37","maxCachedSessions":100,"_sessionCache":"38"},"post","/example1?param1=true&param2=123","{\\"hello\\":\\"world\\"}",{},[],"",{"_events":"39","_eventsCount":3,"authorized":true,"encrypted":true,"bufferSize":0,"writableLength":0,"writable":true,"readable":true,"pending":false,"destroyed":false,"connecting":false,"_hadError":false,"timeout":0,"remoteFamily":"40","remoteAddress":"41","localAddress":"41","remotePort":443,"localPort":443},"POST",{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"32","path":"15","method":"21","headers":"42","agent":"13","agents":"43","hostname":"44","port":443,"nativeProtocols":"45","pathname":"46","search":"47","proto":"48","host":"49"},[],{"_readableState":"50","readable":false,"_events":"51","_eventsCount":3,"socket":"20","connection":"20","httpVersionMajor":null,"httpVersionMinor":null,"httpVersion":null,"complete":true,"headers":"1","rawHeaders":"52","trailers":"53","rawTrailers":"54","aborted":false,"upgrade":null,"url":"19","method":null,"statusCode":200,"statusMessage":null,"client":"20","_consuming":true,"_dumped":false,"req":"3","responseUrl":"55","redirects":"56"},["57"],{"_writableState":"58","writable":true,"_events":"59","_eventsCount":2,"_options":"60","_ended":true,"_ending":true,"_redirectCount":0,"_redirects":"56","_requestBodyLength":17,"_requestBodyBuffers":"61","_currentRequest":"3","_currentUrl":"55"},{"accept":"28","content-type":"5","user-agent":"29","api-key":"30","content-length":17,"host":"44"},"application/json, text/plain, */*","@scope/package","3b48b9fd18ecca20ed5b0accbfeb6b70",{},"https:",{"rejectUnauthorized":false,"path":null},{},{},{},"fifo",{"map":"62","list":"63"},{},"IPv4","127.0.0.1",{"accept":"28","content-type":"5","user-agent":"29","api-key":"30","content-length":17},{"https":"13"},"api.example.com",{"http:":"64","https:":"65"},"/example1","?param1=true&param2=123","https","api.example.com:443",{"objectMode":false,"highWaterMark":16384,"buffer":"66","length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"emitClose":true,"autoDestroy":false,"destroyed":false,"defaultEncoding":"67","awaitDrainWriters":null,"multiAwaitDrain":false,"readingMore":false,"decoder":null,"encoding":null},{},["68","5"],{},[],"https://api.example.com/example1?param1=true&param2=123",[],{"type":"69","data":"70"},{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":false,"ended":false,"finished":false,"destroyed":false,"decodeStrings":true,"defaultEncoding":"67","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"afterWriteTickInfo":null,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"emitClose":true,"autoDestroy":false,"bufferedRequestCount":0,"corkedRequestsFree":"71"},{},{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"32","path":"15","method":"21","headers":"11","agent":"13","agents":"43","hostname":"44","port":null,"nativeProtocols":"45","pathname":"46","search":"47"},[],{},[],{"METHODS":"72","STATUS_CODES":"73","maxHeaderSize":8192,"globalAgent":"74"},{"globalAgent":"75"},{"head":null,"tail":null,"length":0},"utf8","Content-Type","Buffer",[123,34,104,101,108,108,111,34,58,34,119,111,114,108,100,34,125],{"next":null,"entry":null},["76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","21","95","96","97","98","99","100","101","102","103","104","105","106","107","108","109"],{"100":"110","101":"111","102":"112","103":"113","200":"114","201":"115","202":"116","203":"117","204":"118","205":"119","206":"120","207":"121","208":"122","226":"123","300":"124","301":"125","302":"126","303":"127","304":"128","305":"129","307":"130","308":"131","400":"132","401":"133","402":"134","403":"135","404":"136","405":"137","406":"138","407":"139","408":"140","409":"141","410":"142","411":"143","412":"144","413":"145","414":"146","415":"147","416":"148","417":"149","418":"150","421":"151","422":"152","423":"153","424":"154","425":"155","426":"156","428":"157","429":"158","431":"159","451":"160","500":"161","501":"162","502":"163","503":"164","504":"165","505":"166","506":"167","507":"168","508":"169","509":"170","510":"171","511":"172"},{"_events":"173","_eventsCount":2,"defaultPort":80,"protocol":"174","options":"175","requests":"176","sockets":"177","freeSockets":"178","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"scheduling":"37"},{"_events":"179","_eventsCount":2,"defaultPort":443,"protocol":"32","options":"180","requests":"181","sockets":"182","freeSockets":"183","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"scheduling":"37","maxCachedSessions":100,"_sessionCache":"184"},"ACL","BIND","CHECKOUT","CONNECT","COPY","DELETE","GET","HEAD","LINK","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCALENDAR","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","PRI","PROPFIND","PROPPATCH","PURGE","PUT","REBIND","REPORT","SEARCH","SOURCE","SUBSCRIBE","TRACE","UNBIND","UNLINK","UNLOCK","UNSUBSCRIBE","Continue","Switching Protocols","Processing","Early Hints","OK","Created","Accepted","Non-Authoritative Information","No Content","Reset Content","Partial Content","Multi-Status","Already Reported","IM Used","Multiple Choices","Moved Permanently","Found","See Other","Not Modified","Use Proxy","Temporary Redirect","Permanent Redirect","Bad Request","Unauthorized","Payment Required","Forbidden","Not Found","Method Not Allowed","Not Acceptable","Proxy Authentication Required","Request Timeout","Conflict","Gone","Length Required","Precondition Failed","Payload Too Large","URI Too Long","Unsupported Media Type","Range Not Satisfiable","Expectation Failed","I\'m a Teapot","Misdirected Request","Unprocessable Entity","Locked","Failed Dependency","Unordered Collection","Upgrade Required","Precondition Required","Too Many Requests","Request Header Fields Too Large","Unavailable For Legal Reasons","Internal Server Error","Not Implemented","Bad Gateway","Service Unavailable","Gateway Timeout","HTTP Version Not Supported","Variant Also Negotiates","Insufficient Storage","Loop Detected","Bandwidth Limit Exceeded","Not Extended","Network Authentication Required",{},"http:",{"path":null},{},{},{},{},{"path":null},{},{},{},{"map":"185","list":"186"},{},[]]';

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
          '[{"status":200,"statusText":null,"headers":"1","config":"2","request":"3","data":"4"},{"content-type":"5"},{"transitional":"6","transformRequest":"7","transformResponse":"8","timeout":0,"xsrfCookieName":"9","xsrfHeaderName":"10","maxContentLength":-1,"maxBodyLength":-1,"headers":"11","baseURL":"12","httpsAgent":"13","method":"14","url":"15","data":"16"},{"_events":"17","_eventsCount":6,"outputData":"18","outputSize":0,"writable":true,"_last":false,"chunkedEncoding":false,"shouldKeepAlive":true,"_defaultKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":false,"_removedConnection":false,"_removedContLen":false,"_removedTE":false,"_contentLength":null,"_hasBody":true,"_trailer":"19","finished":true,"_headerSent":false,"socket":"20","connection":"20","_header":null,"_keepAliveTimeout":0,"path":"15","method":"21","req":"3","options":"22","interceptors":"23","response":"24","requestBodyBuffers":"25","playbackStarted":false,"readyToStartPlaybackOnSocketEvent":false,"_redirectable":"26","headers":"27","res":"24"},{"success":true},"application/json",{"silentJSONParsing":true,"forcedJSONParsing":true,"clarifyTimeoutError":false},[null],[null],"XSRF-TOKEN","X-XSRF-TOKEN",{"Accept":"28","Content-Type":"5","User-Agent":"29","Api-Key":"30","Content-Length":17},"https://api.example.com",{"_events":"31","_eventsCount":2,"defaultPort":443,"protocol":"32","options":"33","requests":"34","sockets":"35","freeSockets":"36","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"scheduling":"37","maxCachedSessions":100,"_sessionCache":"38"},"post","/example1?param1=true&param2=123","{\\"hello\\":\\"world\\"}",{},[],"",{"_events":"39","_eventsCount":3,"authorized":true,"encrypted":true,"bufferSize":0,"writableLength":0,"writable":true,"readable":true,"pending":false,"destroyed":false,"connecting":false,"_hadError":false,"timeout":0,"remoteFamily":"40","remoteAddress":"41","localAddress":"41","remotePort":443,"localPort":443},"POST",{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"32","path":"15","method":"21","headers":"42","agent":"13","agents":"43","hostname":"44","port":443,"nativeProtocols":"45","pathname":"46","search":"47","proto":"48","host":"49"},[],{"_readableState":"50","readable":false,"_events":"51","_eventsCount":3,"socket":"20","connection":"20","httpVersionMajor":null,"httpVersionMinor":null,"httpVersion":null,"complete":true,"headers":"1","rawHeaders":"52","trailers":"53","rawTrailers":"54","aborted":false,"upgrade":null,"url":"19","method":null,"statusCode":200,"statusMessage":null,"client":"20","_consuming":true,"_dumped":false,"req":"3","responseUrl":"55","redirects":"56"},["57"],{"_writableState":"58","writable":true,"_events":"59","_eventsCount":2,"_options":"60","_ended":true,"_ending":true,"_redirectCount":0,"_redirects":"56","_requestBodyLength":17,"_requestBodyBuffers":"61","_currentRequest":"3","_currentUrl":"55"},{"accept":"28","content-type":"5","user-agent":"29","api-key":"30","content-length":17,"host":"44"},"application/json, text/plain, */*","@scope/package","3b48b9fd18ecca20ed5b0accbfeb6b70",{},"https:",{"rejectUnauthorized":false,"path":null},{},{},{},"fifo",{"map":"62","list":"63"},{},"IPv4","127.0.0.1",{"accept":"28","content-type":"5","user-agent":"29","api-key":"30","content-length":17},{"https":"13"},"api.example.com",{"http:":"64","https:":"65"},"/example1","?param1=true&param2=123","https","api.example.com:443",{"objectMode":false,"highWaterMark":16384,"buffer":"66","length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"emitClose":true,"autoDestroy":false,"destroyed":false,"defaultEncoding":"67","awaitDrainWriters":null,"multiAwaitDrain":false,"readingMore":false,"decoder":null,"encoding":null},{},["68","5"],{},[],"https://api.example.com/example1?param1=true&param2=123",[],{"type":"69","data":"70"},{"objectMode":false,"highWaterMark":16384,"finalCalled":false,"needDrain":false,"ending":false,"ended":false,"finished":false,"destroyed":false,"decodeStrings":true,"defaultEncoding":"67","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"afterWriteTickInfo":null,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"emitClose":true,"autoDestroy":false,"bufferedRequestCount":0,"corkedRequestsFree":"71"},{},{"maxRedirects":21,"maxBodyLength":10485760,"protocol":"32","path":"15","method":"21","headers":"11","agent":"13","agents":"43","hostname":"44","port":null,"nativeProtocols":"45","pathname":"46","search":"47"},[],{},[],{"METHODS":"72","STATUS_CODES":"73","maxHeaderSize":8192,"globalAgent":"74"},{"globalAgent":"75"},{"head":null,"tail":null,"length":0},"utf8","Content-Type","Buffer",[123,34,104,101,108,108,111,34,58,34,119,111,114,108,100,34,125],{"next":null,"entry":null},["76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","21","95","96","97","98","99","100","101","102","103","104","105","106","107","108","109"],{"100":"110","101":"111","102":"112","103":"113","200":"114","201":"115","202":"116","203":"117","204":"118","205":"119","206":"120","207":"121","208":"122","226":"123","300":"124","301":"125","302":"126","303":"127","304":"128","305":"129","307":"130","308":"131","400":"132","401":"133","402":"134","403":"135","404":"136","405":"137","406":"138","407":"139","408":"140","409":"141","410":"142","411":"143","412":"144","413":"145","414":"146","415":"147","416":"148","417":"149","418":"150","421":"151","422":"152","423":"153","424":"154","425":"155","426":"156","428":"157","429":"158","431":"159","451":"160","500":"161","501":"162","502":"163","503":"164","504":"165","505":"166","506":"167","507":"168","508":"169","509":"170","510":"171","511":"172"},{"_events":"173","_eventsCount":2,"defaultPort":80,"protocol":"174","options":"175","requests":"176","sockets":"177","freeSockets":"178","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"scheduling":"37"},{"_events":"179","_eventsCount":2,"defaultPort":443,"protocol":"32","options":"180","requests":"181","sockets":"182","freeSockets":"183","keepAliveMsecs":1000,"keepAlive":false,"maxSockets":null,"maxFreeSockets":256,"maxTotalSockets":null,"totalSocketCount":0,"scheduling":"37","maxCachedSessions":100,"_sessionCache":"184"},"ACL","BIND","CHECKOUT","CONNECT","COPY","DELETE","GET","HEAD","LINK","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCALENDAR","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","PRI","PROPFIND","PROPPATCH","PURGE","PUT","REBIND","REPORT","SEARCH","SOURCE","SUBSCRIBE","TRACE","UNBIND","UNLINK","UNLOCK","UNSUBSCRIBE","Continue","Switching Protocols","Processing","Early Hints","OK","Created","Accepted","Non-Authoritative Information","No Content","Reset Content","Partial Content","Multi-Status","Already Reported","IM Used","Multiple Choices","Moved Permanently","Found","See Other","Not Modified","Use Proxy","Temporary Redirect","Permanent Redirect","Bad Request","Unauthorized","Payment Required","Forbidden","Not Found","Method Not Allowed","Not Acceptable","Proxy Authentication Required","Request Timeout","Conflict","Gone","Length Required","Precondition Failed","Payload Too Large","URI Too Long","Unsupported Media Type","Range Not Satisfiable","Expectation Failed","I\'m a Teapot","Misdirected Request","Unprocessable Entity","Locked","Failed Dependency","Unordered Collection","Upgrade Required","Precondition Required","Too Many Requests","Request Header Fields Too Large","Unavailable For Legal Reasons","Internal Server Error","Not Implemented","Bad Gateway","Service Unavailable","Gateway Timeout","HTTP Version Not Supported","Variant Also Negotiates","Insufficient Storage","Loop Detected","Bandwidth Limit Exceeded","Not Extended","Network Authentication Required",{},"http:",{"path":null},{},{},{},{},{"path":null},{},{},{},{"map":"185","list":"186"},{},[]]';

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
