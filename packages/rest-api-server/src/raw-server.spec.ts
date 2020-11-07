import { stringField } from '@validator/validator/fields'
import { $ } from '@validator/validator/segmentChain'
import { GET, ANY_METHOD, serve } from './raw-server'

serve({}, [
  GET($._('/bla/')._('username', stringField()), {
    responseSpec: {
      data: stringField(),
      headers: {},
    },
    handler: async (request) => ({
      data: 'bla ' + request.pathParams.username,
      headers: {},
    }),
  }),
  ANY_METHOD($._('anyPath', stringField()), {
    responseSpec: {
      data: {
        message: stringField(),
      },
    },
    handler: async () => ({
      data: {
        message: 'NOT FOUND',
      },
    }),
  }),
])
