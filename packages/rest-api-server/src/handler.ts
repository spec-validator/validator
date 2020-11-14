import { Any, Optional, WithoutOptional } from '@validator/validator/util-types'

export type StringMapping = Record<string, Any>

export type HeaderMapping = Record<string, string | string[] | number>

export type DataMapping = StringMapping | Any

export type Request<
  Method extends string = string,
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
  StatusCode extends number = number,
  Data extends Optional<Any> = Optional<Any>,
  Headers extends Optional<HeaderMapping> = Optional<HeaderMapping>,
> = {
  statusCode: StatusCode,
  data: Data,
  headers: Headers,
}

export type Handler<
  Req extends Request = Request,
  Resp extends Response = Response
> = (request: WithoutOptional<Req>) => Promise<WithoutOptional<Resp>>
