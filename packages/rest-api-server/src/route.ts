import { TypeHint } from '@validator/validator'
import { Field, ValidatorSpec } from '@validator/validator/core'
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


type RequestSpect<Req extends Request=Request>  = ValidatorSpec<Req> & {
  method: Field<Req['method']>
}

type FF = RequestSpect<{method: 'GET', pathParams: Optional<StringMapping>}>

const ff: FF = undefined as any

ff.method

type LL = TypeHint<FF>

let r: Request = undefined as any

const rc: LL = undefined as any

r = rc


export type Route<
  ReqSpec extends RequestSpect,
  RespSpec extends ValidatorSpec<Response> = ValidatorSpec<Response>
> = {
  readonly request: ReqSpec,
  readonly response: RespSpec,
  readonly handler: Handler<
    TypeHint<ReqSpec>,
    TypeHint<RespSpec>
  >
}
