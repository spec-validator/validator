import { WithoutOptional } from './util-types'

export type Request<PathParams, Data, QueryParams, Headers> = WithoutOptional<{
  method: string,
  pathParams: PathParams,
  data: Data,
  headers: Headers,
  queryParams: QueryParams
}>

export type Response<
  StatusCode,
  Data,
  Headers
> = WithoutOptional<{
  statusCode: StatusCode,
  data: Data,
  headers: Headers,
}>
