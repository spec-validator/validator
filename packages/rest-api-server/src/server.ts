import http from 'http';

import { ValidatorSpec, validate, serialize } from '@validator/validator/core';
import { root, Segment } from '@validator/validator/segmentChain';
import { Json } from '@validator/validator/Json';

interface MediaTypeProtocol {
  serialize(deserialized: Json): Promise<string>
  deserialize(serialized: string): Promise<Json>
}

type Request<PathParams=any, Data=any, QueryParams=any, Headers=any> = {
  path: string;
  method: string,
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

const splitUrl = (url: string): [string, Record<string, string>] => ['', {}]

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
  const [path, query] = splitUrl(request.url || '');
  const req: Request = {
    path: path,
    method: request.method || '',
    pathParams: route.pathSpec.match(request.url || ''),
    queryParams: validate(route?.requestSpec?.query || {}, query),
    data: validate(route?.requestSpec?.data || {}, await protocol.deserialize(await getData(request))),
    headers: validate(route?.requestSpec?.headers || {}, request.headers),
  }
  const resp = await route.handler(req);
  if (resp.headers) {
    Object.entries(resp.headers).forEach(([key, value]) => {
      response.setHeader(key, value as any);
    });
  }

  const data = protocol.serialize(serialize(route.responseSpec?.data || {}, resp.data))

  response.statusCode = resp.statusCode || data ? 200 : 201;

  response.write()

  response.end();
};

const handle = async (
  routes: Route[],
  request: UnmatchedRequest
): Promise<UnmatchedResponse> => {
  const route = routes.find(matchRoute.bind(null, request));
  if (!route) {
    return Promise.reject(404);
  }
  return handleRoute(route, request);
}


const server = http.createServer((request, response) => {



});
