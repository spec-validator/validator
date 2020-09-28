import { Json, ValidatorSpec } from '@validator/validator/core';
import { stringField } from '@validator/validator/fields';
import { root, Segment } from '@validator/validator/segmentChain';

type Method = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

type Request<PathParams, Data, QueryParams, Headers> = {
  pathParams: PathParams,
  queryParams: QueryParams
  data: Data,
  headers: Headers
}

type Response<Data extends Json, Headers> = {
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
    ResponseData extends Json=undefined,
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
