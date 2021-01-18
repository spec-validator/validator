import { TypeHint } from '@spec-validator/validator'
import { Field, isFieldSpec, ObjectSpec, SpecUnion, OfType } from '@spec-validator/validator/core'
import { $, unionField } from '@spec-validator/validator/fields'
import { ConstantField } from '@spec-validator/validator/fields/constantField'
import { UnionField } from '@spec-validator/validator/fields/unionField'
import { Any, WithoutOptional } from '@spec-validator/utils/util-types'

export type StringMapping = Record<string, Any>

export type HeaderMapping = Record<string, string | string[] | number>

export type DataMapping = StringMapping | Any

export type RequestSpec<
  Method extends string = string,
  PathParams extends StringMapping | unknown = StringMapping | unknown,
  Body extends Any = Any,
  QueryParams extends StringMapping = StringMapping,
  Headers extends HeaderMapping = HeaderMapping,
> = {
  readonly method: ConstantField<Method>,
  readonly pathParams: typeof $ & Field<PathParams>,
  readonly body?: SpecUnion<Body>,
  readonly headers?: ObjectSpec<Headers>,
  readonly queryParams?: ObjectSpec<QueryParams>
}

export type ResponseSpec<
  StatusCode extends number = number,
  Body extends Any = Any,
  Headers extends HeaderMapping = HeaderMapping,
> = {
  readonly statusCode: ConstantField<StatusCode>,
  readonly body?: SpecUnion<Body>,
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
  readonly handler: (request: WithoutOptional<TypeHint<ReqSpec>>) => Promise<
    WithoutOptional<TypeHint<RespSpec>>
  >
}

export const isResponsesSpec = (spec: ResponsesSpec | ResponseSpec): spec is ResponsesSpec =>
  isFieldSpec(spec) && (spec as unknown as OfType<string>).type !== unionField.type

export const route = <
  ReqSpec extends RequestSpec = RequestSpec,
  RespSpec extends ResponsesSpec | ResponseSpec = ResponsesSpec | ResponseSpec,
  >(spec: {
    request: ReqSpec,
    response: RespSpec
  }): {
    handler: (handler:
      (request: WithoutOptional<TypeHint<ReqSpec>>) => Promise<WithoutOptional<TypeHint<RespSpec>>>
    ) => Route
  } => ({
    handler: (handler): Route => ({
      ...spec,
      handler: async (request) => await handler(request as any),
    }),
  })
