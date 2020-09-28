import { ValidatorSpec } from '@validator/validator/core';
import { stringField } from '@validator/validator/fields';
import { root, Segment } from '@validator/validator/segmentChain';

type Method = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

type Request<PathParams=undefined, Data=undefined, QueryParams=undefined, Headers=undefined> = {
  pathParams: PathParams,
  queryParams: QueryParams
  data: Data,
  headers: Headers
}

type Response<Data=undefined, Headers=undefined> = {
  statusCode: number,
  data?: Data,
  headers?: Headers,
}

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
    method: Method,
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
    ) => Response<ResponseData, ResponseHeaders>
  }) {
    config
    // TODO
  }

  get<ResponseData, RequestParams=undefined>(
    path: Segment<RequestParams>,
    handler: (request: Request<RequestParams>) => Response<ResponseData>
  ) {
    return this.route({
      method: 'GET',
      path: path,
      handler: handler
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
