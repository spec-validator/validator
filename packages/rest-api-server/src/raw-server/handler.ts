import { Optional } from '@validator/validator/utils'
import { WithoutOptional } from './util-types'

export type Request<
  PathParams = undefined,
  Data = undefined,
  QueryParams = undefined,
  Headers = undefined
> = WithoutOptional<{
  method: string,
  pathParams: PathParams,
  data: Data,
  headers: Headers,
  queryParams: QueryParams
}>

export type Response<
  StatusCode extends Optional<number> = undefined,
  Data = undefined,
  Headers = undefined
> = WithoutOptional<{
  statusCode: StatusCode,
  data: Data,
  headers: Headers,
}>

export type Handler<
  Req extends Request,
  Resp extends Response
> = (request: Req) => Resp
