import { stringField } from '@validator/validator/fields'
import { $ } from '@validator/validator/segmentChain'
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
      statusCode: 200 as const
    },
  },
  async (request) => Promise.resolve({
    statusCode: 200
  }))
]
