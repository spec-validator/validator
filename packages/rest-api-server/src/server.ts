import { ValidatorSpec } from '@validator/validator/core';
import { stringField } from '@validator/validator/fields';
import { root, Segment } from '@validator/validator/segmentChain';
import { request } from 'http';

type Request<PathParams=undefined, Data=undefined, QueryParams=undefined, Headers=undefined> = {
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

type WRequest = Request<any, any, any, any>
type WResponse = Response<any, any>

type Route = {
  method: string,
  path: Segment<unknown>,
  handler: (request: WRequest) => Promise<WResponse>
}

export const handle = (
  routes: Route[],
  request: WRequest
): Promise<WResponse> =>



  class Server {
  private docsRoute: string;

  constructor(docsRoute='/docs') {
    this.docsRoute = docsRoute;
  }

  route<
    RequestParams=undefined,
    RequestData=undefined,
    RequestQueryParams=undefined,
    RequestHeaders=undefined,
    ResponseData=undefined,
    ResponseHeaders=undefined,
  >(config: {
    method: string,
    path: Segment<RequestParams>,
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
    ) => Promise<Response<ResponseData, ResponseHeaders>>
  }): void {

  }

  get<ResponseData, RequestParams=undefined>(
    path: Segment<RequestParams>,
    handler: (request: Request<RequestParams>) => ResponseData
  ) {
    return this.route({
      method: 'GET',
      path: path,
      handler: (request) => {
        const resp = handler(request);
        return {
          statusCode: 200,
          data: handler(request)
        }
      }
    })
  }

  }

const srv = new Server();

srv.route({
  method: 'GET',
  path: root._('/')._('username', stringField()),
  handler: (request) => ({
    data: {
      username: request.pathParams.username
    }
  })
})
