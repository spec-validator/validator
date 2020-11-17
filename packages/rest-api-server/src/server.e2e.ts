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
      // TODO static field for only one possible value
      statusCode: 200
    },
  },
  async (request) => {
    type Foo = typeof request
    return Promise.resolve({
      statusCode: 200
    })
  })
]

