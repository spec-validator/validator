import { Primitive } from '@validator/validator/Json'
import { Optional } from '@validator/validator/utils'
import { WithoutOptional } from './util-types'

export type HttpHeaders = Record<string, Primitive | Primitive[]>

export type Request<
  Headers = undefined,
  PathParams = undefined,
  QueryParams = undefined,
  Data = undefined,
> = WithoutOptional<{
  method: string,
  pathParams: PathParams,
  data: Data,
  headers: Headers,
  queryParams: QueryParams
}>

export type Response<
  StatusCode extends Optional<number> = undefined,
  Headers = undefined,
  Data = undefined,
> = WithoutOptional<{
  statusCode: StatusCode,
  data: Data,
  headers: Headers,
}>

export type Handler<
  Req extends Request,
  Resp extends Response
> = (request: Req) => Resp
