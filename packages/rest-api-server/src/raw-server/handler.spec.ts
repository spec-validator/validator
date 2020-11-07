import { expectType } from '@validator/validator/TypeTestUtils.test'
import { Request, Response, Handler } from './handler'

describe('Request', () => {

  it('always contains a method', () => {
    type Req = Request

    expectType<{
      method: string
    }, Req>(true)
  })

  it('always contains the fields that are defined', () => {
    type Req = Request<{key: string}, undefined, {key: string}>

    expectType<{
      method: string,
      headers: { key: string },
      queryParams: {key: string},
    }, Req>(true)
  })

})

describe('Response', () => {

  it('contains nothing by default', () => {
    type Resp = Response

    expectType<{
    }, Resp>(true)
  })

  it('always contains the fields that are defined', () => {
    type Resp = Response<201 | 404, undefined, string>

    expectType<{
      statusCode: 201 | 404,
      data: string
    }, Resp>(true)
  })

})

describe('Handler', () => {

  it('in request always contains a method', () => {
    type H = Handler
    expectType<H, ((request: {method: string}) => undefined)>(true)
  })

  it('in request always contains the fields that are defined', () => {
    type Req = Request<{key: string}, undefined, {key: string}>
    type H = Handler<Req>
    expectType<H, ((request: {
      method: string,
      headers: { key: string },
      queryParams: {key: string},
    }) => undefined)>(true)
  })

  it('in response always contains the fields that are defined', () => {
    type H = Handler
    expectType<H, ((request: {method: string}) => undefined)>(true)
  })

})
