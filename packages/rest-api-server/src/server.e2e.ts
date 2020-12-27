import { stringField } from '@validator/validator/fields'
import { $ } from '@validator/validator/fields/segmentField'
import { Route } from './route'
import { GET } from './server'

const routes: Route[] = [
  GET($._('/item/')._('id', stringField()), {
    request: {
      queryParams: {
        pk: stringField()
      }
    },
    response: {
      // TODO static field for only one possible value
      statusCode: 200
    },
  },
  async (request) => Promise.resolve({
    statusCode: 200
  }))
]
