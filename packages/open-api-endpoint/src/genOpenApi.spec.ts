import { _, Route } from '@spec-validator/rest-api-server'
import {
  $, stringField, booleanField, numberField, arrayField,
} from '@spec-validator/validator/fields'
import genOpenApi from './genOpenApi'
import { DEFAULT_SERVER_CONFIG } from '@spec-validator/rest-api-server/server'
import withDoc from './withDoc'

test('fullRoute', () => {
  const routes: Route[] = [
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
