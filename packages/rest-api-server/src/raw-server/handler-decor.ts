import { SpecUnion, ValidatorSpec } from '@validator/validator/core'
import { Optional } from '@validator/validator/utils'
import { StringMapping, Unknown } from './handler'

export type RequestSpec<
  Data extends Optional<Unknown> = undefined,
  QueryParams extends Optional<StringMapping> ,
  Headers extends Optional<StringMapping>,
> = {
  data?: ValidatorSpec<RequestData>,
  query?: ValidatorSpec<RequestQueryParams>,
  headers?: ValidatorSpec<RequestHeaders>
}

export type ResponseSpec<
  ResponseData extends Optional<any> = undefined,
  ResponseHeaders extends Optional<StringMapping> = undefined
> = {
  data?: SpecUnion<ResponseData>,
  headers?: ValidatorSpec<ResponseHeaders>
}
