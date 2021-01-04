import { TypeHint } from '@validator/validator'
import { Field, isField } from '@validator/validator/core'
import { $, constantField, objectField, unionField } from '@validator/validator/fields'
import { Unioned } from '@validator/validator/fields/unionField'
import { OfType } from '@validator/validator/registry'
import { Any, WithoutOptional } from '@validator/validator/util-types'

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
  readonly method: ReturnType<typeof constantField> & Field<Method>,
  readonly pathParams: typeof $ & Field<PathParams>,
  readonly data?: Field<Data>,
  readonly headers?: ReturnType<typeof objectField> & Field<Headers>,
  readonly queryParams?: ReturnType<typeof objectField> & Field<QueryParams>
}

type ObjectField<T> = ReturnType<typeof objectField> & Field<T>

export type ResponseSpec<
  StatusCode extends number = number,
  Data extends Any = Any,
  Headers extends HeaderMapping = HeaderMapping,
> = {
  readonly statusCode: ReturnType<typeof constantField> & Field<StatusCode>,
  readonly data?: Field<Data>,
  readonly headers?: ObjectField<Headers>,
}

export type ResponseField<Spec extends ResponseSpec=ResponseSpec> = ObjectField<TypeHint<Spec>>

// TODO: how to extract schema from
export type ResponsesSpec<ResponseVariants extends ResponseField[] = ResponseField[]> =
  ReturnType<typeof unionField> & Field<Unioned<ResponseVariants>>

export type Route<
  ReqSpec extends RequestSpec = RequestSpec,
  RespSpec extends ResponsesSpec | ResponseSpec = ResponsesSpec | ResponseSpec
> = {
  readonly request: ReqSpec,
  readonly response: RespSpec,
  readonly handler: (request: WithoutOptional<TypeHint<ReqSpec>>) => Promise<
    WithoutOptional<TypeHint<RespSpec>>
  >
}

export const isResponsesSpec = (spec: ResponsesSpec | ResponseSpec): spec is ResponsesSpec =>
  isField(spec) && (spec as OfType<string>).type !== unionField.type
