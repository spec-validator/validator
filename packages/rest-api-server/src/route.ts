import { TypeHint } from '@validator/validator'
import { Field, isField, ValidatorSpec } from '@validator/validator/core'
import { $, unionField } from '@validator/validator/fields'
import { ConstantField } from '@validator/validator/fields/constantField'
import { ObjectField } from '@validator/validator/fields/objectField'
import { UnionField } from '@validator/validator/fields/unionField'
import { OfType } from '@validator/validator/registry'
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
  readonly data?: Field<Data>,
  readonly headers?: ObjectField<ValidatorSpec<Headers>>,
  readonly queryParams?: ObjectField<ValidatorSpec<QueryParams>>
}

export type ResponseSpec<
  StatusCode extends number = number,
  Data extends Any = Any,
  Headers extends HeaderMapping = HeaderMapping,
> = {
  readonly statusCode: ConstantField<StatusCode>,
  readonly data?: Field<Data>,
  readonly headers?: ObjectField<ValidatorSpec<Headers>>,
}

type ResponseField<Spec extends ResponseSpec=ResponseSpec> = ObjectField<WithoutOptional<Spec>>

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
  isField(spec) && (spec as unknown as OfType<string>).type !== unionField.type
