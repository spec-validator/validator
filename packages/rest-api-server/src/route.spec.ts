import { numberField, stringField } from '@validator/validator/fields'
import { $ } from '@validator/validator/segmentChain'
import { expectType } from '@validator/validator/TypeTestUtils.test'
import { WithoutOptional } from '@validator/validator/util-types'
import { Route, RequestExt, ResponseExt } from './route'

describe('Request', () => {

  it('empty by default', () => {
    const spec = {
      method: 'GET',
      pathParams: $._('/')
    }

    type Req = WithoutOptional<RequestExt<typeof spec>>

    // here the problem is in type hint of a segment
    expectType<Req, {
      method: string
    }>(true)
  })

  it('always contains the fields that are defined', () => {
    const spec = {
      method: 'GET' as const,
      headers: {
        headerKey: stringField()
      },
      pathParams: $._('pathKey', stringField())
    }

    type Req = WithoutOptional<RequestExt<typeof spec>>

    expectType<Req, {
      method: 'GET',
      headers: { headerKey: string },
      pathParams: { pathKey: string },
    }>(true)
  })

})

describe('Response', () => {

  it('contains nothing by default', () => {
    const spec = {
      statusCode: 200 as const
    }
    type Resp = WithoutOptional<ResponseExt<typeof spec>>

    expectType<Resp, {
      statusCode: 200
    }>(true)
  })

  it('always contains the fields that are defined', () => {
    const spec = {
      statusCode: 201 as const,
      data: stringField()
    }

    type Resp = WithoutOptional<ResponseExt<typeof spec>>

    expectType<Resp, {
      statusCode: 201,
      data: string
    }>(true)
  })

})

describe('Route', () => {

  it('works with defined request and response', () => {
    const reqSpec = {
      method: 'GET' as const,
      headers: {
        headerKey: stringField()
      },
      pathParams: $._('pathKey', stringField())
    }

    const respSpec = {
      statusCode: numberField(),
      data: stringField()
    }

    type Decor = Route<typeof reqSpec, typeof respSpec>

    expectType<Decor, {
      request: typeof reqSpec,
      response: typeof respSpec,
      handler: (request: {
        method: 'GET',
        headers: { headerKey: string },
        pathParams: { pathKey: string },
      }) => Promise<{
        statusCode: 201,
        data: string
      }>
        }>(true)
  })

})
