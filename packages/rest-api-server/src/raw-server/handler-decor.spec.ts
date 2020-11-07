import { expectType } from '@validator/validator/TypeTestUtils.test'
import { Request, Response } from './handler'
import { RequestExt, ResponseExt } from './handler-decor'

describe('Request', () => {

  it('always contains a method', () => {
    type Req = Request

    expectType<{
      method: string
    }, Req>(true)
  })

  it('always contains the fields that are defined', () => {
    type Req = Request<string, {pathKey: string}, undefined, undefined, {headerKey: string}>

    expectType<{
      method: string,
      headers: { headerKey: string },
      pathParams: { pathKey: string },
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
