import { TypeHint } from '@validator/validator'
import { ValidatorSpec } from '@validator/validator/core'
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
  readonly pathParams: PathParams,
  readonly data: Data,
  readonly headers: Headers,
  readonly queryParams: QueryParams
}

export type Response<
  StatusCode extends number = number,
  Data extends Optional<Any> = Optional<Any>,
  Headers extends Optional<HeaderMapping> = Optional<HeaderMapping>,
> = {
  readonly statusCode: StatusCode,
  readonly data: Data,
  readonly headers: Headers,
}

export type Handler<
  Req extends Request = Request,
  Resp extends Response = Response
> = (request: WithoutOptional<Req>) => Promise<WithoutOptional<Resp>>

export type Route<
  ReqSpec extends ValidatorSpec<Request> = ValidatorSpec<Request>,
  RespSpec extends ValidatorSpec<Response> = ValidatorSpec<Response>
> = {
  readonly request: ReqSpec,
  readonly response: RespSpec,
  readonly handler: Handler<
    TypeHint<ReqSpec>,
    TypeHint<RespSpec>
  >
}
