import { choiceField, stringField } from '@validator/validator/fields'
import { $ } from '@validator/validator/fields/segmentField'
import { expectType } from '@validator/validator/TypeTestUtils.test'
import { WithoutOptional } from '@validator/validator/util-types'
import { Route, RequestExt } from './route'

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
      statusCode: choiceField(201),
      data: stringField(),
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
