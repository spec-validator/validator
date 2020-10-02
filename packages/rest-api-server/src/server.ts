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

type WildCardRequest = Request<unknown, unknown, unknown, HeadersType>

type Response<Data, Headers extends HeadersType> = {
  statusCode: number,
  data: Data,
  headers: Headers
}

type WildCardResponse = Response<unknown, HeadersType>

type Route<
  RequestType extends WildCardRequest,
  ResponseType extends WildCardResponse
> = {
  method?: string,
  pathSpec: Segment<RequestType['pathParams']>,
  requestSpec: {
    data: ValidatorSpec<RequestType['data']>,
    query: ValidatorSpec<RequestType['queryParams']>,
    headers: ValidatorSpec<RequestType['headers']>
  },
  responseSpec: {
    data: ValidatorSpec<ResponseType['data']>,
    headers: ValidatorSpec<ResponseType['headers']>
  }
  handler: (
    request: RequestType
  ) => Promise<ResponseType>,
}

type WildCardRoute = Route<WildCardRequest, WildCardResponse>

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
    queryParams: validate(route.requestSpec.query, Object.fromEntries(url.searchParams)),
    data: validate(route.requestSpec.data, data),
    headers: validate(route.requestSpec.headers, request.headers),
  });

  Object.entries(resp.headers).forEach(([key, value]) =>
    response.setHeader(key, value as any)
  );

  response.statusCode = resp.statusCode;

  response.write(
    config.protocol.serialize(serialize(route.responseSpec.data, resp.data)),
    config.encoding
  );

  response.end();
};

const handle = async (
  config: ServerConfig,
  routes: WildCardRoute[],
  request: http.IncomingMessage,
  response: http.ServerResponse
): Promise<void> => {
  const route = routes.find(matchRoute.bind(null, request));
  if (!route) {
    return Promise.reject(404);
  }
  await handleRoute(config, route, request, response);
}

const serve = (config: Partial<ServerConfig>, routes: WildCardRoute[]) => {
  http.createServer(handle.bind(null, mergeServerConfigs(config), routes))
}

const route = <T extends WildCardRoute> (route: T): T => route

serve({}, [
  route({
    pathSpec: root._('/')._('username', stringField()),
    responseSpec: {
      headers: {},
      data: {
        value: stringField()
      }
    },
    requestSpec: {
      data: {},
      headers: {},
      query: {}
    },
    handler: async (request) => {
      console.log(request.pathParams);
      return {
        headers: {},
        statusCode: 200,
        data: {
          value: 'test'
        }
      }
    }
  })
])
