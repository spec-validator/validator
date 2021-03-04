import { createServer, createRouteCollection } from '@spec-validator/rest-api-server'
import {
  segmentField as $, constantField, numberField, optional, stringField,
} from '@spec-validator/validator/fields'
import { withOpenApi } from '@spec-validator/open-api-endpoint'

const itemSpec = {
  title: stringField(),
  description: stringField(),
}

const ofItems = {
  body: [itemSpec],
}

const ofItem = {
  body: itemSpec,
}

const _ = createRouteCollection()

_.GET($._('/expected-error')).spec(
  {
    response: {
      body: constantField(42),
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
)

_.GET($._('/unexpected-error')).spec(
  {
    response: {
      body: constantField(42),
    },
  },
).handler(
  async () => {
    throw {
      reason: 'Boom!',
    }
  }
)

_.GET($._('/items')).spec(
  {
    response: ofItems,
  },
).handler(
  async () => ({
    body: [
      {
        title: 'Item N',
        description: 'Description',
      },
    ],
  })
)

_.POST($._('/items')).spec(
  {
    request: ofItem,
    response: {
      body: numberField(),
    },
  },
).handler(
  async () => ({
    body: 42,
  })
)

_.GET($._('/items/')._('id', numberField())).spec(
  {
    response: ofItem,
  },
).handler(
  async (request) => ({
    body:
      {
        title: `Item ${request.pathParams.id}`,
        description: 'Description',
      },
  })
)

_.PUT($._('/items/')._('id', numberField())).spec(
  {
    request: ofItem,
  },
).handler(
  async () => undefined
)

_.DELETE($._('/items/')._('id', numberField())).spec(
  {}
).handler(
  async () => undefined
)

_.PATCH($._('/items/')._('id', numberField())).spec(
  {
    request: {
      body: {
        title: optional(stringField()),
        description: optional(stringField()),
      },
    },
  },
).handler(
  async () => undefined
)

createServer(withOpenApi({ routes: _.routes })).serve()
