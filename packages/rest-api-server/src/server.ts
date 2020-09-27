import { Json, ValidatorSpec } from '@validator/validator/core';
import { Segment } from '@validator/validator/segmentChain';

type Method = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

type Request<PathParams, Data> = {
  pathParams: PathParams,
  data: Data
}

type Response<Data> = {
  data: Data
}

class Server {

  route<PathParams, RequestData, ResponseData>(config: {
    method: Method,
    path: Segment<PathParams>,
    requestDataSpec: ValidatorSpec<RequestData>,
    responseDataSpec: ValidatorSpec<ResponseData>,
    handler: (request: Request<PathParams, RequestData>) => Response<ResponseData>
  }) {
    config
    // TODO
  }


}
