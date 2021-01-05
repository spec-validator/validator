import { GET, Route } from '@validator/rest-api-server'
import {
  $, stringField, objectField, constantField, booleanField, numberField, arrayField
} from '@validator/validator/fields'
import genOpenApi from '.'
import { DEFAULT_SERVER_CONFIG } from '@validator/rest-api-server/server'
import withDoc from './withDoc'

test('fullRoute', () => {
  const routes: Route[] = [
    GET($._('/item/')._('id', stringField()), {
      request: {
        headers: objectField({
          key: withDoc(numberField(), {
            description: 'key header',
            examples: {
              sampleKey: {
                value: 13 as number,
                summary: 'Sample value'
              }
            }
          })
        }),
        queryParams: objectField({
          flag: booleanField(),
        }),
        data: objectField({
          title: stringField(/.*/),
          count: numberField()
        })
      },
      response: {
        // TODO static field for only one possible value
        statusCode: constantField(200),
        data: objectField({
          items: arrayField(numberField())
        })
      },
    },
    async () => Promise.resolve({
      statusCode: 200 as const,
      data: {
        items: [1, 2, 3]
      }
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
