import { TypeHint, ValidatorSpec } from '@validator/validator/core'
import { Request, Handler, Response } from './handler'

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
