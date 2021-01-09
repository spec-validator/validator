import { TypeHint } from '@validator/validator'
import { Field, isFieldSpec, ObjectSpec, SpecUnion, OfType } from '@validator/validator/core'
import { $, unionField } from '@validator/validator/fields'
import { ConstantField } from '@validator/validator/fields/constantField'
import { UnionField } from '@validator/validator/fields/unionField'
import { Any, Promisable, WithoutOptional } from '@validator/validator/util-types'

export type StringMapping = Record<string, Any>

export type HeaderMapping = Record<string, string | string[] | number>

export type DataMapping = StringMapping | Any

export type RequestSpec<
  Method extends string = string,
  PathParams extends StringMapping | unknown = StringMapping | unknown,
  Data extends Any = Any,
  QueryParams extends StringMapping = StringMapping,
  Headers extends HeaderMapping = HeaderMapping,
> = {
  readonly method: ConstantField<Method>,
  readonly pathParams: typeof $ & Field<PathParams>,
  readonly data?: SpecUnion<Data>,
  readonly headers?: ObjectSpec<Headers>,
  readonly queryParams?: ObjectSpec<QueryParams>
}

export type ResponseSpec<
  StatusCode extends number = number,
  Data extends Any = Any,
  Headers extends HeaderMapping = HeaderMapping,
> = {
  readonly statusCode: ConstantField<StatusCode>,
  readonly data?: SpecUnion<Data>,
  readonly headers?: ObjectSpec<Headers>,
}

type ResponseField<Spec extends ResponseSpec=ResponseSpec > = WithoutOptional<Spec>

// TODO: how to extract schema from
type ResponsesSpec<ResponseVariants extends ResponseField[] = ResponseField[]> =
  UnionField<ResponseVariants>

export type Route<
  ReqSpec extends RequestSpec = RequestSpec,
  RespSpec extends ResponsesSpec | ResponseSpec = ResponsesSpec | ResponseSpec
> = {
  readonly request: ReqSpec,
  readonly response: RespSpec,
  readonly handler: (request: WithoutOptional<TypeHint<ReqSpec>>) => Promisable<
    WithoutOptional<TypeHint<RespSpec>>
  >
}

export const isResponsesSpec = (spec: ResponsesSpec | ResponseSpec): spec is ResponsesSpec =>
  isFieldSpec(spec) && (spec as unknown as OfType<string>).type !== unionField.type
