import { SpecUnion, TypeHint, ValidatorSpec } from '@validator/validator/core'
import { Segment } from '@validator/validator/segmentChain'
import { StringMapping, Response, Request, Handler, HeaderMapping } from './handler'
import { Any, Optional } from '../../../validator/src/util-types'

export type RequestSpec<
  Method extends string = 'GET',
  PathParams extends Optional<StringMapping> = Optional<StringMapping>,
  Data extends Optional<Any> = Optional<Any>,
  QueryParams extends Optional<StringMapping> = Optional<StringMapping>,
  Headers extends Optional<HeaderMapping> = Optional<HeaderMapping>,
> = {
  method: Method,
  pathParams: Segment<PathParams>,
  data?: SpecUnion<Data>,
  queryParams?: ValidatorSpec<QueryParams>,
  headers?: ValidatorSpec<Headers>
}

// TODO:
// TODO: response is a union field of an array of response specs

export type ResponseSpec<
  StatusCode extends number = 200,
  Headers extends Optional<HeaderMapping> = Optional<HeaderMapping>,
  Data extends Optional<Any> = Optional<Any>,
> = {
  statusCode: StatusCode
  data?: SpecUnion<Data>,
  headers?: ValidatorSpec<Headers>
}

export type RequestExt<
  Spec extends RequestSpec,
> = Request<
  TypeHint<Spec['method']>,
  TypeHint<Spec['pathParams']>,
  TypeHint<Spec['data']>,
  TypeHint<Spec['queryParams']>,
  TypeHint<Spec['headers']>
>

export type ResponseExt<Spec extends ResponseSpec> = Response<
  TypeHint<Spec['statusCode']>,
  TypeHint<Spec['data']>,
  TypeHint<Spec['headers']>
>

export type Route<
  ReqSpec extends RequestSpec = RequestSpec,
  RespSpec extends Optional<ResponseSpec> = Optional<ResponseSpec>
> = {
  request: ReqSpec,
  response: RespSpec,
  handler: Handler<
    RequestExt<ReqSpec>,
    RespSpec extends ResponseSpec ? ResponseExt<RespSpec> : undefined
  >
}
