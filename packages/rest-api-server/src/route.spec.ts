import {
  segmentField as $, choiceField, numberField, stringField,
  unionField, constantField,
} from '@spec-validator/validator/fields'
import { expectType } from '@spec-validator/test-utils/expectType'

import { route } from './route'
import { headerObjectField } from './fields'

describe('Route', () => {

  it('works with cookies', () => {
    const rt = route({
      request: {
        method: constantField('GET'),
        headers: {
          cookies: headerObjectField({
            cookie1: stringField(),
          }),
        },
        pathParams: $._('pathKey', stringField()),
      },
      response: {
        statusCode: constantField(201),
      },
    })

    expectType<Parameters<typeof rt.handler>[0],  (request: {
        method: 'GET',
        headers: { cookies: {
          cookie1: string
        } },
        pathParams: { pathKey: string },
      }) => Promise<{
        statusCode: 201,
      }>>(true)
  })

  it('always contains the fields that are defined', () => {

    const rt = route({
      request: {
        method: constantField('GET'),
        headers: {
          headerKey: stringField(),
        },
        pathParams: $._('pathKey', stringField()),
      },
      response: {
        statusCode: constantField(201),
        body: stringField(),
      },
    })

    expectType<Parameters<typeof rt.handler>[0], (request: {
        method: 'GET',
        headers: { headerKey: string },
        pathParams: { pathKey: string },
      }) => Promise<{
        statusCode: 201,
        body: string
      }>>(true)
  })

  it('always contains a method in a request and statusCode in a response', () => {
    const rt = route({
      request: {
        method: constantField('GET'),
        pathParams: $,
      },
      response: {
        statusCode: constantField(201),
      },
    })

    expectType<Parameters<typeof rt.handler>[0], (request: {
        method: 'GET',
      }) => Promise<{
        statusCode: 201,
      }>>(true)
  })

  it('works with a union of responses', () => {
    const rt = route({
      request: {
        method: constantField('GET'),
        pathParams: $,
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
    })

    expectType<Parameters<typeof rt.handler>[0], (request: {
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
      }>>(true)
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
