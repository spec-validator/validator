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
  headers: Headers
}

class Server {

  route<PathParams, RequestData, ResponseData, QueryParams, RequestHeaders, ResponseHeaders>(config: {
    method: Method,
    requestSpec: {
      path: Segment<PathParams>,
      data: ValidatorSpec<RequestData>,
      query: ValidatorSpec<QueryParams>,
      headers: ValidatorSpec<RequestHeaders>
    },
    responseSpec: {
      data: ValidatorSpec<ResponseData>,
      headers: ValidatorSpec<ResponseHeaders>
    }
    handler: (
      request: Request<PathParams, RequestData, QueryParams, RequestHeaders>
    ) => Response<ResponseData, ResponseHeaders>
  }) {
    config
    // TODO
  }


}
