import { Field, SpecUnion, TypeHint, ValidatorSpec } from '@validator/validator/core'
import { Segment, SegmentTypeHint } from '@validator/validator/segmentChain'
import { Optional } from '@validator/validator/utils'
import { StringMapping, Unknown, Response, Request } from './handler'

export type RequestSpec<
  Method extends string = string,
  PathParams extends Optional<StringMapping> = undefined,
  Data extends Optional<Unknown> = undefined,
  QueryParams extends Optional<StringMapping> = undefined,
  Headers extends Optional<StringMapping> = undefined,
> = {
  method: Field<Method>,
  pathParams: Segment<PathParams>,
  data?: ValidatorSpec<Data>,
  query?: ValidatorSpec<QueryParams>,
  headers?: ValidatorSpec<Headers>
}

export type ResponseSpec<
  StatusCode extends Optional<number> = undefined,
  Headers extends Optional<StringMapping> = undefined,
  Data extends Optional<Unknown> = undefined,
> = {
  statusCode?: Field<StatusCode>
  data?: SpecUnion<Data>,
  headers?: ValidatorSpec<Headers>
}

export type HandlerSpec<
  Req extends RequestSpec = RequestSpec,
  Resp extends Optional<ResponseSpec> = ResponseSpec
> = {
  request: Req,
  response: Resp
}

export type RequestExt<Spec extends RequestSpec = RequestSpec> = Request<
  TypeHint<Spec['method']>,
  SegmentTypeHint<Spec['pathParams']>,
  TypeHint<Spec['data']>,
  TypeHint<Spec['query']>,
  TypeHint<Spec['headers']>
>

export type ResponseExt<Spec extends ResponseSpec = ResponseSpec> = Response<
  TypeHint<Spec['statusCode']>,
  TypeHint<Spec['data']>,
  TypeHint<Spec['headers']>
>
