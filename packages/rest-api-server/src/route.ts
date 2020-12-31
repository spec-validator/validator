import { TypeHint } from '@validator/validator'
import { ValidatorSpec } from '@validator/validator/core'
import segmentField from '@validator/validator/fields/segmentField'
import singletonField from '@validator/validator/fields/singletonField'
import { Any, Optional, WithoutOptional } from '@validator/validator/util-types'

export type StringMapping = Record<string, Any>

export type HeaderMapping = Record<string, string | string[] | number>

export type DataMapping = StringMapping | Any

export type Request<
  Method extends string = string,
  PathParams extends Optional<StringMapping> = Optional<StringMapping>,
  Data extends Optional<Any> = Optional<Any>,
  QueryParams extends Optional<StringMapping> = Optional<StringMapping>,
  Headers extends Optional<HeaderMapping> = Optional<HeaderMapping>,
> = {
  readonly method: Method,
  readonly pathParams?: PathParams,
  readonly data?: Data,
  readonly headers?: Headers,
  readonly queryParams?: QueryParams
}

export type Response<
  StatusCode extends number = number,
  Data extends Optional<Any> = Optional<Any>,
  Headers extends Optional<HeaderMapping> = Optional<HeaderMapping>,
> = {
  readonly statusCode: StatusCode,
  readonly data?: Data,
  readonly headers?: Headers,
}

export type Handler<
  Req extends Request = Request,
  Resp extends Response = Response
> = (request: WithoutOptional<Req>) => Promise<WithoutOptional<Resp>>


type RequestSpect = ValidatorSpec<Request> & {
  method: ReturnType<typeof singletonField>
  pathParams: typeof segmentField
}

export type Route<
  ReqSpec extends RequestSpect = RequestSpect,
  RespSpec extends ValidatorSpec<Response> = ValidatorSpec<Response>
> = {
  readonly request: ReqSpec,
  readonly response: RespSpec,
  readonly handler: Handler<
    TypeHint<ReqSpec>,
    TypeHint<RespSpec>
  >
}
