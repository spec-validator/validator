import { Field } from '@validator/validator/core'
import { choiceField, stringField } from '@validator/validator/fields'
import { $ } from '@validator/validator/segmentChain'
import { expectType } from '@validator/validator/TypeTestUtils.test'
import { Request, Response } from './handler'
import { RequestExt, ResponseExt } from './handler-decor'

describe('Request', () => {

  it('always contains a method', () => {
    type Req = RequestExt

    expectType<{
      method: string
    }, Req>(true)
  })

  it('always contains the fields that are defined', () => {
    const spec = {
      method: stringField(),
      headers: {
        headerKey: stringField()
      },
      pathParams: $._('pathKey', stringField())
    }

    type Req = RequestExt<typeof spec>

    expectType<{
      method: string,
      headers: { headerKey: string },
      pathParams: { pathKey: string },
    }, Req>(true)
  })

})

describe('Response', () => {

  it('contains nothing by default', () => {
    type Resp = ResponseExt

    expectType<{
    }, Resp>(true)
  })

  it('always contains the fields that are defined', () => {
    const spec = {
      statusCode: choiceField(201, 404),
      data: stringField()
    }

    type Resp = ResponseExt<typeof spec>

    expectType<{
      statusCode: 201 | 404,
      data: string
    }, Resp>(true)
  })

})
