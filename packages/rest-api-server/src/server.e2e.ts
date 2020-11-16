import { stringField } from '@validator/validator/fields'
import { $ } from '@validator/validator/segmentChain'
import { Route } from './route'
import { PUT } from './server'

const routes: Route[] = [
  PUT($._('/item/')._('id', stringField()), {
    request: {
      queryParams: {
        pk: stringField()
      },
      data: {
        title: stringField()
      }
    },
    response: {
      // TODO static field for only one possible value
      statusCode: 200 as const
    },
  },
  async (request) => {
    type Foo = typeof request
    return Promise.resolve({
      statusCode: 200
    })
  })
]
