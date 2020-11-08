import { Field, SpecUnion, TypeHint, ValidatorSpec } from '@validator/validator/core'
import { Segment, SegmentTypeHint } from '@validator/validator/segmentChain'
import { Optional } from '@validator/validator/utils'
import { StringMapping, Unknown, Response, Request } from './handler'

export type RequestSpec<
  Method extends Optional<string> = Optional<string>,
  PathParams extends Optional<StringMapping> = Optional<StringMapping>,
  Data extends Optional<Unknown> = Optional<Unknown> ,
  QueryParams extends Optional<StringMapping> = Optional<StringMapping>,
  Headers extends Optional<StringMapping> = Optional<StringMapping>,
> = {
  method?: Field<Method>,
  pathParams?: Segment<PathParams>,
  data?: ValidatorSpec<Data>,
  query?: ValidatorSpec<QueryParams>,
  headers?: ValidatorSpec<Headers>
}

export type ResponseSpec<
  StatusCode extends Optional<number> = Optional<number>,
  Headers extends Optional<StringMapping> = Optional<StringMapping>,
  Data extends Optional<Unknown> = Optional<Unknown>,
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

export type HandlerDecor<
  Req extends Optional<RequestSpec> = undefined,
  Resp extends Optional<ResponseSpec> = undefined
> = {
  request: Req,
  response: Resp,
  handler: (request: Req extends RequestSpec ? RequestExt<Req> : undefined)
    => Resp extends ResponseSpec ? ResponseExt<Resp> : undefined
}
