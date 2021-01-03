import { TypeHint } from '@validator/validator'
import { Field } from '@validator/validator/core'
import { $, constantField, objectField } from '@validator/validator/fields'
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

export type ResponseSpec<
  StatusCode extends number = number,
  Data extends Any = Any,
  Headers extends HeaderMapping = HeaderMapping,
> = {
  readonly statusCode: ReturnType<typeof constantField> & Field<StatusCode>,
  readonly data?: Field<Data>,
  readonly headers?: ReturnType<typeof objectField> & Field<Headers>,
}

export type Route<
  ReqSpec extends RequestSpec = RequestSpec,
  RespSpec extends ResponseSpec = ResponseSpec
> = {
  readonly request: ReqSpec,
  readonly response: RespSpec,
  readonly handler: (request: WithoutOptional<TypeHint<ReqSpec>>) => Promise<WithoutOptional<TypeHint<RespSpec>>>
}
