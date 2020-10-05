import {
  createServer, IncomingMessage, ServerResponse
} from 'http';

import { URL } from 'url';

import { ValidatorSpec, validate, serialize, TypeHint } from '@validator/validator/core';
import { Segment } from '@validator/validator/segmentChain';
import { Json } from '@validator/validator/Json';

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

type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];
type RequiredKeys<T> = Exclude<KeysOfType<T, Exclude<T[keyof T], undefined>>, undefined>;
type WithoutOptional<T> = Pick<T, RequiredKeys<T>>;

type HttpHeaders = Record<string, string | string[]>

type DataType = Record<string, unknown>

type Optional<T> = T | undefined;

export type Request<PathParams, Data, QueryParams, Headers> = { method?: string }
  & WithoutOptional<{
    pathParams: PathParams,
    data: Data,
    headers: Headers,
    queryParams: QueryParams
  }>

export type Response<
  Data,
  Headers
> = { statusCode?: number }
  & WithoutOptional<{
    data: Data,
    headers: Headers,
  }>

type RequestSpec<
  RequestData extends Optional<DataType>,
  RequestQueryParams extends Optional<DataType>,
  RequestHeaders extends Optional<HttpHeaders>,
> = {
  data?: ValidatorSpec<RequestData>,
  query?: ValidatorSpec<RequestQueryParams>,
  headers?: ValidatorSpec<RequestHeaders>
}

type WildCardRequestSpec = RequestSpec<DataType, DataType, HttpHeaders>;

type ResponseSpec<
  ResponseData extends Optional<DataType> = undefined,
  ResponseHeaders extends Optional<HttpHeaders> = undefined
> = {
  data?: ValidatorSpec<ResponseData>
  headers?: ValidatorSpec<ResponseHeaders>
}

type WildCardResponseSpec = ResponseSpec<DataType, HttpHeaders>;

export type Route<
  RequestPathParams extends DataType,
  TResponseSpec extends WildCardResponseSpec,
  TRequestSpec extends Optional<WildCardRequestSpec> = undefined,
> = {
  method?: string,
  pathSpec: Segment<RequestPathParams>,
  requestSpec?: TRequestSpec,
  responseSpec: TResponseSpec
  handler: (
    request: TRequestSpec extends WildCardRequestSpec ? Request<
      RequestPathParams,
      TypeHint<TRequestSpec['data']>,
      TypeHint<TRequestSpec['query']>,
      TypeHint<TRequestSpec['headers']>
    > : Request<RequestPathParams, never, never, never>
  ) => Promise< Response<
      TypeHint<TResponseSpec['data']>,
      TypeHint<TResponseSpec['headers']>
    >
  >
}

type WildCardRoute = Route<any, WildCardResponseSpec, WildCardRequestSpec>

const matchRoute = (
  request: IncomingMessage,
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

const getData = async (msg: IncomingMessage): Promise<string> => new Promise<string> ((resolve, reject) => {
  try {
    const chunks: string[] = [];
    msg.on('readable', () => chunks.push(msg.read()));
    msg.on('error', reject);
    msg.on('end', () => resolve(chunks.join('')));
  } catch (err) {
    reject(err);
  }
})

const handleRoute = async (
  config: ServerConfig,
  route: WildCardRoute,
  request: IncomingMessage,
  response: ServerResponse
): Promise<void> => {
  const url = new URL(request.url || '')

  const queryParams = route.requestSpec?.query
    ? validate(route.requestSpec.query, Object.fromEntries(url.searchParams))
    : undefined;
  const pathParams = route.pathSpec.match(url.pathname);
  const method = request.method?.toUpperCase();
  const data = route.requestSpec?.data
    ? validate(route.requestSpec.data, config.protocol.deserialize(await getData(request)))
    : undefined
  const headers = route.requestSpec?.headers
    ? validate(route.requestSpec.headers, request.headers)
    : undefined

  const resp = await route.handler({ method, pathParams, queryParams, data, headers } as any);

  Object.entries((resp as any).headers || {}).forEach(([key, value]) =>
    response.setHeader(key, value as any)
  );

  response.statusCode = resp.statusCode || data ? 200 : 201;

  if (route.responseSpec?.data) {
    response.write(
      config.protocol.serialize(serialize(route.responseSpec.data, (resp as any).data)),
      config.encoding
    );
  }

  response.end();
};

const handle = async (
  config: ServerConfig,
  routes: WildCardRoute[],
  request: IncomingMessage,
  response: ServerResponse
): Promise<void> => {
  const route = routes.find(matchRoute.bind(null, request));
  if (!route) {
    return Promise.reject(404);
  }
  await handleRoute(config, route, request, response);
}

type MethodRoute = <
  RequestPathParams extends DataType,
  TResponseSpec extends WildCardResponseSpec,
  TRequestSpec extends Optional<WildCardRequestSpec> = undefined,
> (routeConfig:
    Omit<Route<RequestPathParams, TResponseSpec, TRequestSpec>, 'method'>
  )
  => Route<RequestPathParams, TResponseSpec, TRequestSpec>

export const withMethod = (method: string | undefined): MethodRoute => (routeConfig) => ({
  method,
  ...routeConfig
});

export const ANY_METHOD = withMethod(undefined)
export const GET = withMethod('GET')
export const HEAD = withMethod('HEAD')
export const POST = withMethod('POST')
export const PUT = withMethod('PUT')
export const DELETE = withMethod('DELETE')
export const CONNECT = withMethod('CONNECT')
export const OPTIONS = withMethod('OPTIONS')
export const TRACE = withMethod('TRACE')
export const PATCH = withMethod('PATCH')

export const serve = (config: Partial<ServerConfig>, routes: any[]): void => {
  createServer(handle.bind(null, mergeServerConfigs(config), routes))
}
