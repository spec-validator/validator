import { SpecUnion, TypeHint, ValidatorSpec } from '@validator/validator/core'
import { Segment } from '@validator/validator/segmentChain'
import { StringMapping, Response, Request, Handler, HeaderMapping } from './handler'
import { Any, Optional } from '@validator/validator/util-types'

export type RequestSpec<
  Method extends string = string,
  PathParams extends Optional<StringMapping> = Optional<StringMapping>,
  Data extends Optional<Any> = Optional<Any>,
  QueryParams extends Optional<StringMapping> = Optional<StringMapping>,
  Headers extends Optional<HeaderMapping> = Optional<HeaderMapping>,
> = {
  readonly method: Method,
  readonly pathParams: Segment<PathParams>,
  readonly data?: SpecUnion<Data>,
  readonly queryParams?: ValidatorSpec<QueryParams>,
  readonly headers?: ValidatorSpec<Headers>
}

// TODO:
// TODO: response is a union field of an array of response specs

export type ResponseSpec<
  StatusCode extends number = number,
  Headers extends Optional<HeaderMapping> = Optional<HeaderMapping>,
  Data extends Optional<Any> = Optional<Any>,
> = {
  readonly statusCode: StatusCode
  readonly data?: SpecUnion<Data>,
  readonly headers?: ValidatorSpec<Headers>
}

export type RequestExt<
  Spec extends RequestSpec,
> = Request<
  Spec['method'],
  TypeHint<Spec['pathParams']>,
  TypeHint<Spec['data']>,
  TypeHint<Spec['queryParams']>,
  TypeHint<Spec['headers']>
>

export type ResponseExt<Spec extends ResponseSpec> = Response<
  Spec['statusCode'],
  TypeHint<Spec['data']>,
  TypeHint<Spec['headers']>
>

export type Route<
  ReqSpec extends RequestSpec = RequestSpec,
  RespSpec extends ResponseSpec = ResponseSpec
> = {
  readonly request: ReqSpec,
  readonly response: RespSpec,
  readonly handler: Handler<
    RequestExt<ReqSpec>,
    ResponseExt<RespSpec>
  >
}
