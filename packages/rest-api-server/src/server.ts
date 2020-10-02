import http from 'http';

import { ValidatorSpec, validate, serialize } from '@validator/validator/core';
import { root, Segment } from '@validator/validator/segmentChain';
import { Json } from '@validator/validator/Json';
import { URL } from 'url';

interface MediaTypeProtocol {
  serialize(deserialized: Json): string
  deserialize(serialized: string): Json
  encoding: BufferEncoding
}

class JsonProtocol implements MediaTypeProtocol {
  serialize = JSON.stringify;
  deserialize = JSON.parse;
  encoding: 'utf-8';
}

type Request<PathParams=any, Data=any, QueryParams=any, Headers=any> = {
  pathParams: PathParams,
  queryParams: QueryParams
  data: Data,
  headers: Headers
}

type Response<Data=any, Headers=any> = {
  statusCode?: number,
  data?: Data,
  headers?: Headers
}

type Route<
  RequestParams=any,
  RequestData=any,
  RequestQueryParams=any,
  RequestHeaders=any,
  ResponseData=any,
  ResponseHeaders=any,
> = {
  method?: string,
  pathSpec: Segment<unknown>,
  requestSpec?: {
    data?: ValidatorSpec<RequestData>,
    query?: ValidatorSpec<RequestQueryParams>,
    headers?: ValidatorSpec<RequestHeaders>
  },
  responseSpec?: {
    data?: ValidatorSpec<ResponseData>,
    headers?: ValidatorSpec<ResponseHeaders>
  }
  handler: (
    request: Request<RequestParams, RequestData, RequestQueryParams, RequestHeaders>
  ) => Promise<Response<ResponseData, ResponseHeaders>>,
}

const matchRoute = (request: http.IncomingMessage, route: Route): boolean => {
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

const handleRoute = async (
  protocol: MediaTypeProtocol,
  route: Route,
  request: http.IncomingMessage,
  response: http.ServerResponse
): Promise<void> => {
  const url = new URL(request.url || '')

  const data = protocol.deserialize(await getData(request));

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
    protocol.serialize(serialize(route.responseSpec?.data || {}, resp.data)),
    protocol.encoding
  );

  response.end();
};

const handle = async (
  protocol: MediaTypeProtocol,
  routes: Route[],
  request: http.IncomingMessage,
  response: http.ServerResponse
): Promise<void> => {
  const route = routes.find(matchRoute.bind(null, request));
  if (!route) {
    return Promise.reject(404);
  }
  await handleRoute(protocol, route, request, response);
}

/*
const server = http.createServer((request, response) => {
});
*/
