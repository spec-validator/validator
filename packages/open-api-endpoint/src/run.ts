import { serve } from '@validator/rest-api-server'
import { DEFAULT_SERVER_CONFIG, DELETE, GET, PATCH, POST, PUT } from '@validator/rest-api-server/server'
import {
  $, arrayField, constantField, numberField, objectField, optional, stringField
} from '@validator/validator/fields'
import withOpenApi from './withOpenApi'

const itemSpec = objectField({
  title: stringField(),
  description: stringField()
})

const ofItems = {
  data: arrayField(itemSpec)
}

const ofItem = {
  data: itemSpec
}

serve(withOpenApi({
  ...DEFAULT_SERVER_CONFIG,
  routes: [
    GET($._('/expected-error'),
      {
        response: {
          data: constantField(42)
        }
      },
      async () => {
        throw {
          statusCode: 442,
          isPublic: true,
          reason: 'Boom!'
        }
      }
    ),
    GET($._('/unexpected-error'),
      {
        response: {
          data: constantField(42)
        }
      },
      async () => {
        throw {
          reason: 'Boom!'
        }
      }
    ),
    GET($._('/items'),
      {
        response: ofItems
      },
      async () => ({
        data: [
          {
            title: 'Item N',
            description: 'Description'
          }
        ]
      })
    ),
    POST($._('/items'),
      {
        request: ofItem,
        response: {
          data: numberField()
        }
      },
      async () => ({
        data: 42
      })
    ),
    GET($._('/items/')._('id', numberField()),
      {
        response: ofItem
      },
      async (request) => ({
        data:
          {
            title: `Item ${request.pathParams.id}`,
            description: 'Description'
          }
      })
    ),
    PUT($._('/items/')._('id', numberField()),
      {
        request: ofItem
      },
      async () => undefined
    ),
    DELETE($._('/items/')._('id', numberField()),
      {},
      async () => undefined
    ),
    PATCH($._('/items/')._('id', numberField()),
      {
        request: {
          data: objectField({
            title: optional(stringField()),
            description: optional(stringField())
          })
        }
      },
      async () => undefined
    ),
  ]

}))
