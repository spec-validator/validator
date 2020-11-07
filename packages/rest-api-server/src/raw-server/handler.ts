import { Optional } from '@validator/validator/utils'
import { WithoutOptional } from './util-types'

export type Unknown = unknown | unknown[]

export type StringMapping = Record<string, Unknown>

export type DataMapping = StringMapping | Unknown

export type Request<
  Headers extends Optional<StringMapping> = undefined,
  PathParams extends Optional<StringMapping> = undefined,
  QueryParams extends Optional<StringMapping> = undefined,
  Data extends Optional<Unknown> = undefined,
> = WithoutOptional<{
  method: string,
  pathParams: PathParams,
  data: Data,
  headers: Headers,
  queryParams: QueryParams
}>

export type Response<
  StatusCode extends Optional<number> = undefined,
  Headers extends Optional<StringMapping> = undefined,
  Data extends Optional<Unknown> = undefined,
> = WithoutOptional<{
  statusCode: StatusCode,
  data: Data,
  headers: Headers,
}>

export type Handler<
  Req extends Request = Request,
  Resp extends Optional<Response> = undefined
> = (request: Req) => Promise<Resp>
