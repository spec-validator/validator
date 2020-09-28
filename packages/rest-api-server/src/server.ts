import { ValidatorSpec } from '@validator/validator/core';
import { Segment } from '@validator/validator/segmentChain';

type Method = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

type Request<PathParams, Data, QueryParams, Headers> = {
  pathParams: PathParams,
  queryParams: QueryParams
  data: Data,
  headers: Headers
}

type Response<Data, Headers> = {
  data: Data,
  headers: Headers,
}

class Server {
  private docsRoute: string;

  constructor(docsRoute='/docs') {
    this.docsRoute = docsRoute;
  }

  route<
    TRequest extends Request<unknown, unknown, unknown, unknown>,
    TResponse extends Response<unknown, unknown>
  >(config: {
    method: Method,
    path: Segment<TRequest['pathParams']>,
    requestSpec: {
      data: ValidatorSpec<TRequest['data']>,
      query: ValidatorSpec<TRequest['queryParams']>,
      headers: ValidatorSpec<TRequest['headers']>
    },
    responseSpec: {
      data: ValidatorSpec<TResponse['data']>,
      headers: ValidatorSpec<TResponse['headers']>
    }
    handler: (
      request: TRequest
    ) => TResponse
  }) {
    config
    // TODO
  }


}
