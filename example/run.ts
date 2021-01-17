import { createServer } from '@spec-validator/rest-api-server'
import { DEFAULT_SERVER_CONFIG, _ } from '@spec-validator/rest-api-server/server'
import {
  $, constantField, numberField, optional, stringField,
} from '@spec-validator/validator/fields'
import withOpenApi from '@spec-validator/open-api-endpoint/withOpenApi'

const itemSpec = {
  title: stringField(),
  description: stringField(),
}

const ofItems = {
  data: [itemSpec],
}

const ofItem = {
  data: itemSpec,
}

createServer(withOpenApi({
  ...DEFAULT_SERVER_CONFIG,
  routes: [
    _.GET($._('/expected-error')).spec(
      {
        response: {
          data: constantField(42),
        },
      }
    ).handler(
      async () => {
        throw {
          statusCode: 442,
          isPublic: true,
          reason: 'Boom!',
        }
      }
    ),
    _.GET($._('/unexpected-error')).spec(
      {
        response: {
          data: constantField(42),
        },
      },
    ).handler(
      async () => {
        throw {
          reason: 'Boom!',
        }
      }
    ),
    _.GET($._('/items')).spec(
      {
        response: ofItems,
      },
    ).handler(
      async () => ({
        data: [
          {
            title: 'Item N',
            description: 'Description',
          },
        ],
      })
    ),
    _.POST($._('/items')).spec(
      {
        request: ofItem,
        response: {
          data: numberField(),
        },
      },
    ).handler(
      async () => ({
        data: 42,
      })
    ),
    _.GET($._('/items/')._('id', numberField())).spec(
      {
        response: ofItem,
      },
    ).handler(
      async (request) => ({
        data:
          {
            title: `Item ${request.pathParams.id}`,
            description: 'Description',
          },
      })
    ),
    _.PUT($._('/items/')._('id', numberField())).spec(
      {
        request: ofItem,
      },
    ).handler(
      async () => undefined
    ),
    _.DELETE($._('/items/')._('id', numberField())).spec(
      {}
    ).handler(
      async () => undefined
    ),
    _.PATCH($._('/items/')._('id', numberField())).spec(
      {
        request: {
          data: {
            title: optional(stringField()),
            description: optional(stringField()),
          },
        },
      },
    ).handler(
      async () => undefined
    ),
  ],

})).serve()
