import { _, Route, route } from '@spec-validator/rest-api-server'
import {
  segmentField as $, stringField, booleanField, numberField, arrayField, unionField, constantField,
} from '@spec-validator/validator/fields'
import genOpenApi from './genOpenApi'
import { DEFAULT_SERVER_CONFIG } from '@spec-validator/rest-api-server/server'
import withDoc from './withDoc'

test('fullRoute', () => {
  const routes: Route[] = [
    route(
      {
        request: {
          pathParams: $._('/multi-response'),
          method: constantField('GET'),
        },
        response: unionField({
          statusCode: constantField(201),
        }, {
          statusCode: constantField(202),
        }),
      }
    ).handler(
      async () => Promise.resolve({
        statusCode: 201,
      })
    ),
    _.POST($._('/items')).spec(
      {
        request: {
          body: {
            title: stringField(/.*/),
            count: numberField(),
          },
        },
      }
    ).handler(
      async () => Promise.resolve(undefined)
    ),
    _.GET($._('/item/')._('id', stringField())).spec(
      {
        request: {
          headers: {
            key: withDoc(numberField(), {
              description: 'key header',
              examples: {
                sampleKey: {
                  value: 13 as number,
                  summary: 'Sample value',
                },
              },
            }),
          },
          queryParams: {
            flag: booleanField(),
          },
        },
        response: {
          headers: {
            key: withDoc(numberField(), {
              description: 'key header',
              examples: {
                sampleKey: {
                  value: 13 as number,
                  summary: 'Sample value',
                },
              },
            }),
          },
          body: {
            items: arrayField(numberField()),
          },
        },
      }
    ).handler(
      async () => ({
        statusCode: 200,
        headers: {
          key: 13,
        },
        body: {
          items: [1, 2, 3],
        },
      })
    ),
  ]

  expect(genOpenApi(
    {
      ...DEFAULT_SERVER_CONFIG,
      routes,
      info: {
        title: 'Test',
        version: '1.0.0',
      },
    })).toMatchSnapshot()

})
