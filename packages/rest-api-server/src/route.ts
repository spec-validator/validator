import { TypeHint } from '@validator/validator'
import { Field } from '@validator/validator/core'
import { ChoiceField } from '@validator/validator/fields/choiceField'
import { ObjectField } from '@validator/validator/fields/objectField'
import { SegmentField } from '@validator/validator/fields/segmentField'
import { Any, WithoutOptional } from '@validator/validator/util-types'

export type StringMapping = Record<string, Any>

export type HeaderMapping = Record<string, string | string[] | number>

export type DataMapping = StringMapping | Any

export type RequestSpec<
  Method extends string = string,
  PathParams extends StringMapping = StringMapping,
  Data extends Any = Any,
  QueryParams extends StringMapping = StringMapping,
  Headers extends HeaderMapping = HeaderMapping,
> = {
  readonly method: ChoiceField<Method>,
  readonly pathParams?: SegmentField<PathParams>,
  readonly data?: Field<Data>,
  readonly headers?: ObjectField<Headers>,
  readonly queryParams?: ObjectField<QueryParams>
}

export type ResponseSpec<
  StatusCode extends number = number,
  Data extends Any = Any,
  Headers extends HeaderMapping = HeaderMapping,
> = {
  readonly statusCode: ChoiceField<StatusCode>,
  readonly data?: Field<Data>,
  readonly headers?: ObjectField<Headers>,
}

export type Route<
  ReqSpec extends RequestSpec = RequestSpec,
  RespSpec extends ResponseSpec = ResponseSpec
> = {
  readonly request: ReqSpec,
  readonly response: RespSpec,
  readonly handler: (request: WithoutOptional<TypeHint<ReqSpec>>) => Promise<WithoutOptional<TypeHint<RespSpec>>>
}
