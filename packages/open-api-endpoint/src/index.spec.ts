import { GET, Route } from '@validator/rest-api-server'
import { $, stringField, objectField, constantField } from '@validator/validator/fields'
import genOpenApi from '.'
import { DEFAULT_SERVER_CONFIG } from '@validator/rest-api-server/server'

test('fullRoute', () => {
  const routes: Route[] = [
    GET($._('/item/')._('id', stringField()), {
      request: {
        queryParams: objectField({
          pk: stringField()
        })
      },
      response: {
        // TODO static field for only one possible value
        statusCode: constantField(200)
      },
    },
    async () => Promise.resolve({
      statusCode: 200 as const
    }))
  ]

  expect(genOpenApi({
    ...DEFAULT_SERVER_CONFIG,
    info: {
      title: 'Test',
      version: '1.0.0'
    }
  }, routes)).toMatchSnapshot()


})
