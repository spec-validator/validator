import http from 'http';

import { ValidatorSpec, validate } from '@validator/validator/core';
import { root, Segment } from '@validator/validator/segmentChain';

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
  headers?: Headers,
}

type Route<
  RequestParams=undefined,
  RequestData=undefined,
  RequestQueryParams=undefined,
  RequestHeaders=undefined,
  ResponseData=undefined,
  ResponseHeaders=undefined,
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

const handleRoute = async (
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
    data: validate(route?.requestSpec?.data || {}, request.read()),
    headers: validate(route?.requestSpec?.headers || {}, request.headers),
  }
  const resp = route.handler(req);

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
