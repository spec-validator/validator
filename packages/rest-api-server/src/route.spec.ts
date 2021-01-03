import { objectField, stringField } from '@validator/validator/fields'
import constantField from '@validator/validator/fields/constantField'
import $ from '@validator/validator/fields/segmentField'

import { expectType } from '@validator/validator/TypeTestUtils.test'
import { Route } from './route'

describe('Route', () => {

  it('always contains the fields that are defined', () => {
    const reqSpec = {
      method: constantField('GET'),
      headers: objectField({
        headerKey: stringField()
      }),
      pathParams: $._('pathKey', stringField())
    }

    const respSpec = {
      statusCode: constantField(201),
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

  it('always contains a method in a request and statusCode in a response', () => {
    const reqSpec = {
      method: constantField('GET'),
    }

    const respSpec = {
      statusCode: constantField(201),
    }

    type Decor = Route<typeof reqSpec, typeof respSpec>

    expectType<Decor, {
      request: typeof reqSpec,
      response: typeof respSpec,
      handler: (request: {
        method: 'GET',
      }) => Promise<{
        statusCode: 201,
      }>
        }>(true)
  })

})
