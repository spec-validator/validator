import { TypeHint, ValidatorSpec } from '@validator/validator/core'
import { expectType } from '@validator/validator/TypeTestUtils.test'
import { WithoutOptional } from '@validator/validator/util-types'
import { Request, Response, Handler } from './route'

describe('Request', () => {

  it('contains nothing by default', () => {
    type Req = TypeHint<ValidatorSpec<Request>>

    expectType<Req, {
      method: string
    }>(true)
  })

  it('always contains the fields that are defined', () => {
    type Req = WithoutOptional<Request<'GET', {pathKey: string}, undefined, undefined, {headerKey: string}>>

    expectType<{
      method: 'GET',
      headers: { headerKey: string },
      pathParams: { pathKey: string },
    }, Req>(true)
  })

})

describe('Response', () => {

  it('contains nothing by default', () => {
    type Resp = Response

    expectType<Resp, {
      statusCode: number
    }>(true)
  })

  it('always contains the fields that are defined', () => {
    type Resp = Response<201 | 404, string>

    expectType<{
      statusCode: 201 | 404,
      data: string
    }, Resp>(true)
  })

})

describe('Handler', () => {

  it('in request: always contains a method', () => {
    type H = Handler
    expectType<H, ((request: {
      method: string
    }) => Promise<{
      statusCode: number
    }>)>(true)
  })

  it('in request: always contains the fields that are defined', () => {
    type Req = Request<'GET', {pathKey: string}, undefined, undefined, {headerKey: string}>
    type H = Handler<Req>
    expectType<H, ((request: {
      method: 'GET',
      headers: { headerKey: string },
      pathParams: { pathKey: string },
    }) => Promise<{
      statusCode: number
    }>)>(true)
  })

  it('in response: always contains the fields that are defined', () => {
    type H = Handler<Request, Response<201 | 404, string>>
    expectType<H, ((request: {
      method: string
    }) => Promise<{
      statusCode: 201 | 404,
      data: string
    }>)>(true)
  })

})
