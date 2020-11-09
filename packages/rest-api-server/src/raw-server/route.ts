import { Field, SpecUnion, TypeHint, ValidatorSpec } from '@validator/validator/core'
import { Segment, SegmentTypeHint } from '@validator/validator/segmentChain'
import { StringMapping, Response, Request, Handler } from './handler'
import { Any, Optional } from '../../../validator/src/util-types'

export type RequestSpec<
  Method extends Optional<string> = Optional<string>,
  PathParams extends Optional<StringMapping> | unknown = Optional<StringMapping> | unknown,
  Data extends Optional<Any> = Optional<Any> ,
  QueryParams extends Optional<StringMapping> = Optional<StringMapping>,
  Headers extends Optional<StringMapping> = Optional<StringMapping>,
> = {
  pathParams: Segment<PathParams>,
  method?: Field<Method>,
  data?: ValidatorSpec<Data>,
  query?: ValidatorSpec<QueryParams>,
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
  SegmentTypeHint<Spec['pathParams']>,
  TypeHint<Spec['data']>,
  TypeHint<Spec['query']>,
  TypeHint<Spec['headers']>
>

export type ResponseExt<Spec extends ResponseSpec> = Response<
  TypeHint<Spec['statusCode']>,
  TypeHint<Spec['data']>,
  TypeHint<Spec['headers']>
>

export type Route<
  Req extends Optional<RequestSpec> = Optional<RequestSpec>,
  Resp extends Optional<ResponseSpec> = Optional<ResponseSpec>
> = {
  request: Req,
  response: Resp,
  handler: Handler<
    Req extends RequestSpec ? RequestExt<Req> : undefined,
    Resp extends ResponseSpec ? ResponseExt<Resp> : undefined
  >
}
