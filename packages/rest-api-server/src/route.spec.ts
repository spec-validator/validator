import { choiceField, numberField, objectField, stringField, unionField } from '@validator/validator/fields'
import constantField from '@validator/validator/fields/constantField'
import $ from '@validator/validator/fields/segmentField'

import { expectType } from '@validator/validator/TypeTestUtils.test'
import { Promisable } from '@validator/validator/util-types'
import { Route } from './route'

describe('Route', () => {

  it('always contains the fields that are defined', () => {
    const reqSpec = {
      method: constantField('GET'),
      headers: objectField({
        headerKey: stringField(),
      }),
      pathParams: $._('pathKey', stringField()),
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
      }) => Promisable<{
        statusCode: 201,
        data: string
      }>
        }>(true)
  })

  it('always contains a method in a request and statusCode in a response', () => {
    const reqSpec = {
      method: constantField('GET'),
      pathParams: $,
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
      }) => Promisable<{
        statusCode: 201,
      }>
        }>(true)
  })

  it('works with a union of responses', () => {
    const reqSpec = {
      method: constantField('GET'),
      pathParams: $,
    }

    const respSpec = unionField(objectField({
      statusCode: constantField(201),
      data: numberField(),
    }), objectField({
      statusCode: constantField(202),
      data: choiceField('one', 'two'),
      headers: objectField({
        headerKey: stringField(),
      }),
    }))

    type Decor = Route<typeof reqSpec, typeof respSpec>

    expectType<Decor, {
      request: typeof reqSpec,
      response: typeof respSpec,
      handler: (request: {
        method: 'GET',
      }) => Promisable<{
        statusCode: 201,
        data: number
      } | {
        statusCode: 202,
        data: 'one' | 'two',
        headers: {
          headerKey: string
        }
      }>}>(true)
  })
})
