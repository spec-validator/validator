import { expectType } from '@validator/validator/TypeTestUtils.test'
import { Request } from './handler'

describe('Request', () => {

  it('always contains a method', () => {
    type Req = Request

    expectType<{
      method: string
    }, Req>(true)
  })

  it('always contains the fields that', () => {
    type Req = Request<{key: string}, undefined, {key: string}>

    expectType<{
      method: string,
      headers: { key: string },
      queryParams: {key: string}
    }, Req>(true)
  })

})
