import { TypeHint } from '@spec-validator/validator'
import { isFieldSpec, SpecUnion, OfType } from '@spec-validator/validator/core'
import { SegmentField, unionField } from '@spec-validator/validator/fields'
import { ConstantField } from '@spec-validator/validator/fields/constantField'
import { UnionField } from '@spec-validator/validator/fields/unionField'
import { Any, WithoutOptional } from '@spec-validator/utils/util-types'

import { StringObjectSpec } from './fields/stringSpec'

export type StringMapping = Record<string, Any>

export type RequestSpec = {
  readonly method: ConstantField<string>,
  readonly pathParams: SegmentField<StringMapping | undefined>,
  readonly body?: SpecUnion,
  readonly headers?: StringObjectSpec<StringMapping>,
  readonly queryParams?: StringObjectSpec<StringMapping>
}

export type ResponseSpec = {
  readonly statusCode: ConstantField<number>,
  readonly body?: SpecUnion,
  readonly headers?: StringObjectSpec<StringMapping>,
}

type ResponseField<Spec extends ResponseSpec=ResponseSpec > = WithoutOptional<Spec>

type ResponsesSpec<ResponseVariants extends ResponseField[] = ResponseField[]> =
  UnionField<ResponseVariants>

export type VoidOrUndefined<T> = T extends undefined ? void | undefined : T

export interface Route {
  readonly request: RequestSpec,
  readonly response: ResponsesSpec | ResponseSpec,
  readonly handler: (request: WithoutOptional<TypeHint<this['request']>>) => Promise<
    VoidOrUndefined<WithoutOptional<TypeHint<this['response']>>>
  >
}

export const isResponsesSpec = (spec: ResponsesSpec | ResponseSpec): spec is ResponsesSpec =>
  isFieldSpec(spec) && (spec as unknown as OfType<string>).type === unionField.type

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
