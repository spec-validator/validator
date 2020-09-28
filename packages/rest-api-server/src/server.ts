import { request } from 'http';

import { ValidatorSpec } from '@validator/validator/core';
import { root, Segment } from '@validator/validator/segmentChain';

type UnmatchedRequest = {
  method: string;
  path: string;
  body: any;
  headers: Record<string, string>
}

type UnmatchedResponse = {
  body: any;
  headers: Record<string, string>
}

type Request<PathParams=undefined, Data=undefined, QueryParams=undefined, Headers=undefined> = {
  path: string;
  method: string,
  pathParams: PathParams,
  queryParams: QueryParams
  data: Data,
  headers: Headers
}

type Response<Data=undefined, Headers=undefined> = {
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
  path: Segment<unknown>,
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

const matchRoute = (request: UnmatchedRequest, route: Route): boolean => {
  if (route.method && request.method !== route.method) {
    return false;
  }
  try {
    route.path.match(request.path);
  } catch (err) {
    return false;
  }
  return true;
};

const handleRoute = async (route: Route, request: UnmatchedRequest): Promise<UnmatchedResponse> => {

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


