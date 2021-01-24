import {
  $, choiceField, numberField, stringField,
  unionField, constantField,
} from '@spec-validator/validator/fields'
import { expectType } from '@spec-validator/test-utils/expectType'

import { Route, route } from './route'
import { headerObjectField } from './fields'

describe('Route', () => {

  it('works with cookies', () => {
    const reqSpec = {
      method: constantField('GET'),
      headers: {
        cookies: headerObjectField({
          cookie1: stringField(),
        }),
      },
      pathParams: $._('pathKey', stringField()),
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
        headers: { cookies: {
          cookie1: string
        } },
        pathParams: { pathKey: string },
      }) => Promise<{
        statusCode: 201,
      }>
        }>(true)
  })

  it('always contains the fields that are defined', () => {
    const reqSpec = {
      method: constantField('GET'),
      headers: {
        headerKey: stringField(),
      },
      pathParams: $._('pathKey', stringField()),
    }

    const respSpec = {
      statusCode: constantField(201),
      body: stringField(),
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
        body: string
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
      }) => Promise<{
        statusCode: 201,
      }>
        }>(true)
  })

  it('works with a union of responses', () => {
    const reqSpec = {
      method: constantField('GET'),
      pathParams: $,
    }

    const respSpec = unionField({
      statusCode: constantField(201),
      body: numberField(),
    }, {
      statusCode: constantField(202),
      body: choiceField('one', 'two'),
      headers: {
        headerKey: stringField(),
      },
    })

    type Decor = Route<typeof reqSpec, typeof respSpec>

    expectType<Decor, {
      request: typeof reqSpec,
      response: typeof respSpec,
      handler: (request: {
        method: 'GET',
      }) => Promise<{
        statusCode: 201,
        body: number
      } | {
        statusCode: 202,
        body: 'one' | 'two',
        headers: {
          headerKey: string
        }
      }>}>(true)
  })
})

describe('route function', () => {
  it('returns a proper route object', () => {
    const routeObject = route({
      request: {
        method: constantField('GET'),
        headers: {
          headerKey: stringField(),
        },
        pathParams: $._('pathKey', stringField()),
      },
      response: unionField({
        statusCode: constantField(201),
        body: numberField(),
      }, {
        statusCode: constantField(202),
        body: choiceField('one', 'two'),
        headers: {
          headerKey: stringField(),
        },
      }),
    }).handler(async (request) => ({
      statusCode: 202,
      body: 'one',
      headers: {
        headerKey: request.pathParams.pathKey,
      },
    }))
    expect(routeObject.request).toMatchSnapshot()
    expect(routeObject.response).toMatchSnapshot()
  })
})
