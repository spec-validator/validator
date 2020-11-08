import { choiceField, stringField } from '@validator/validator/fields'
import { $ } from '@validator/validator/segmentChain'
import { expectType } from '@validator/validator/TypeTestUtils.test'
import { HandlerDecor, RequestExt, ResponseExt } from './handler-decor'

describe('Request', () => {

  it('always contains a method', () => {
    const spec = {}
    type Req = RequestExt<typeof spec>

    expectType<Req, undefined>(true)
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

    expectType<Req, {
      method: string,
      headers: { headerKey: string },
      pathParams: { pathKey: string },
    }>(true)
  })

})

describe('Response', () => {

  it('contains nothing by default', () => {
    const spec = {}
    type Resp = ResponseExt<typeof spec>

    expectType<Resp, undefined>(true)
  })

  it('always contains the fields that are defined', () => {
    const spec = {
      statusCode: choiceField(201, 404),
      data: stringField()
    }

    type Resp = ResponseExt<typeof spec>

    expectType<Resp, {
      statusCode: 201 | 404,
      data: string
    }>(true)
  })

})

describe('HandlerDecor', () => {

  it('expects undefined request and response', () => {
    type Decor = HandlerDecor

    expectType<Decor, {
      request: undefined,
      response: undefined,
      handler: (request: undefined) => undefined
        }>(true)
  })

  it('works with defined request and response', () => {
    const reqSpec = {
      method: stringField(),
      headers: {
        headerKey: stringField()
      },
      pathParams: $._('pathKey', stringField())
    }

    const respSpec = {
      statusCode: choiceField(201, 404),
      data: stringField()
    }

    type Decor = HandlerDecor<typeof reqSpec, typeof respSpec>

    expectType<Decor, {
      request: typeof reqSpec,
      response: typeof respSpec,
      handler: (request: {
        method: string,
        headers: { headerKey: string },
        pathParams: { pathKey: string },
      }) => ({
        statusCode: 201 | 404,
        data: string
      })
        }>(true)
  })

})
