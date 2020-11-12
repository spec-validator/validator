import { Field, SpecUnion, TypeHint, ValidatorSpec } from '@validator/validator/core'
import { Segment } from '@validator/validator/segmentChain'
import { StringMapping, Response, Request, Handler } from './handler'
import { Any, Optional } from '../../../validator/src/util-types'

export type RequestSpec<
  Method extends Optional<string> = Optional<string>,
  PathParams extends Optional<StringMapping> = Optional<StringMapping>,
  Data extends Optional<Any> = Optional<Any>,
  QueryParams extends Optional<StringMapping> = Optional<StringMapping>,
  Headers extends Optional<StringMapping> = Optional<StringMapping>,
> = {
  pathParams: Segment<PathParams>,
  method: Field<Method>,
  data?: SpecUnion<Data>,
  queryParams?: ValidatorSpec<QueryParams>,
  headers?: ValidatorSpec<Headers>
}

export type ResponseSpec<
  StatusCode extends Optional<number> = Optional<number>,
  Headers extends Optional<StringMapping> = Optional<StringMapping>,
  Data extends Optional<Any> = Optional<Any>,
> = {
  statusCode?: Field<StatusCode>
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
