import http from 'http';

import { ValidatorSpec, validate, serialize } from '@validator/validator/core';
import { root, Segment } from '@validator/validator/segmentChain';
import { Json } from '@validator/validator/Json';
import { URL } from 'url';
import { stringField } from '@validator/validator/fields';

interface MediaTypeProtocol {
  serialize(deserialized: Json): string
  deserialize(serialized: string): Json
}

class JsonProtocol implements MediaTypeProtocol {
  serialize = JSON.stringify;
  deserialize = JSON.parse;
}

type ServerConfig = {
  protocol: MediaTypeProtocol,
  encoding: BufferEncoding
}

const DEFAULT_SERVER_CONFIG: ServerConfig = {
  protocol: new JsonProtocol(),
  encoding: 'utf-8'
}

const mergeServerConfigs = (
  serverConfig: Partial<ServerConfig>
): ServerConfig => ({
  ...DEFAULT_SERVER_CONFIG,
  ...serverConfig,
})

type HeadersType = Record<string, string | string[]>

type Request<PathParams, Data, QueryParams, Headers extends HeadersType> = {
  pathParams: PathParams,
  queryParams: QueryParams
  data: Data,
  headers: Headers
}

type Response<Data, Headers extends HeadersType> = {
  statusCode: number,
  data: Data,
  headers: Headers
}

type Route<
  RequestParams,
  RequestData,
  RequestQueryParams,
  RequestHeaders extends HeadersType,
  ResponseData,
  ResponseHeaders extends HeadersType,
> = {
  method?: string,
  pathSpec: Segment<unknown>,
  requestSpec?: {
    data?: ValidatorSpec<RequestData>,
    query?: ValidatorSpec<RequestQueryParams>,
    headers?: ValidatorSpec<RequestHeaders>
  },
  responseSpec: {
    data?: ValidatorSpec<ResponseData>,
    headers?: ValidatorSpec<ResponseHeaders>
  }
  handler: (
    request: Request<RequestParams, RequestData, RequestQueryParams, RequestHeaders>
  ) => Promise<Response<ResponseData, ResponseHeaders>>,
}

type WildCardRoute = Route<unknown, unknown, unknown, unknown, unknown, unknown>;

const matchRoute = (
  request: http.IncomingMessage,
  route: WildCardRoute
): boolean => {
  if (route.method && request.method !== route.method) {
    return false;
  }
  try {
    route.pathSpec.match(request.url || '');
  } catch (err) {
    return false;
  }
  return true;
};

const getData = async (msg: http.IncomingMessage): Promise<string> => new Promise<string> ((resolve, reject) => {
  try {
    const chunks: string[] = [];
    msg.on('readable', () => chunks.push(msg.read()));
    msg.on('error', reject);
    msg.on('end', () => resolve(chunks.join('')));
  } catch (err) {
    reject(err);
  }
})

const handleRoute = async <R extends WildCardRoute>(
  config: ServerConfig,
  route: R,
  request: http.IncomingMessage,
  response: http.ServerResponse
): Promise<void> => {
  const url = new URL(request.url || '')

  const data = config.protocol.deserialize(await getData(request));

  const resp = await route.handler({
    pathParams: route.pathSpec.match(url.pathname),
    queryParams: validate(route?.requestSpec?.query || {}, Object.fromEntries(url.searchParams)),
    data: validate(route?.requestSpec?.data || {}, data),
    headers: validate(route?.requestSpec?.headers || {}, request.headers),
  });

  Object.entries(resp.headers || {}).forEach(([key, value]) =>
    response.setHeader(key, value as any)
  );

  response.statusCode = resp.statusCode || data ? 200 : 201;

  response.write(
    config.protocol.serialize(serialize(route.responseSpec?.data || {}, resp.data)),
    config.encoding
  );

  response.end();
};

const handle = async (
  config: ServerConfig,
  routes: Route[],
  request: http.IncomingMessage,
  response: http.ServerResponse
): Promise<void> => {
  const route = routes.find(matchRoute.bind(null, request));
  if (!route) {
    return Promise.reject(404);
  }
  await handleRoute(config, route, request, response);
}

const serve = (config: Partial<ServerConfig>, routes: Route[]) => {
  http.createServer(handle.bind(null, mergeServerConfigs(config), routes))
}

serve({}, [
  {
    pathSpec: root._('/'),
    responseSpec: {
      data: {
        value: stringField()
      }
    },
    handler: async (request) => {
      console.log('foo');
      return {
        data: {
          value: 'test'
        }
      }
    }
  }
])
