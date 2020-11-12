import { Any, Optional, WithoutOptional } from '../../../validator/src/util-types'

export type StringMapping = Record<string, Any>

export type HeaderMapping = Record<string, string | string[] | number>

export type DataMapping = StringMapping | Any

export type Request<
  Method extends Optional<string> = Optional<string>,
  PathParams extends Optional<StringMapping> = Optional<StringMapping>,
  Data extends Optional<Any> = Optional<Any>,
  QueryParams extends Optional<StringMapping> = Optional<StringMapping>,
  Headers extends Optional<HeaderMapping> = Optional<HeaderMapping>,
> = {
  method: Method,
  pathParams: PathParams,
  data: Data,
  headers: Headers,
  queryParams: QueryParams
}

export type Response<
  StatusCode extends Optional<number> = Optional<number>,
  Data extends Optional<Any> = Optional<Any>,
  Headers extends Optional<HeaderMapping> = Optional<HeaderMapping>,
> = {
  statusCode: StatusCode,
  data: Data,
  headers: Headers,
}

export type Handler<
  Req extends Optional<Request> = Optional<Request>,
  Resp extends Optional<Response> = Optional<Response>
> = (request: WithoutOptional<Req>) => Promise<WithoutOptional<Resp>>
