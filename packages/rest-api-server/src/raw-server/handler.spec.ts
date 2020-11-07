import { expectType } from '@validator/validator/TypeTestUtils.test'
import { Request, Response } from './handler'

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
