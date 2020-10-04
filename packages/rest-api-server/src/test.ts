import { stringField } from '@validator/validator/fields';
import { root } from '@validator/validator/segmentChain';
import { GET, serve } from './server';

serve({}, [
  GET({
    pathSpec: root._('/')._('username', stringField()),
    responseSpec: {
      data: {
        value: stringField(),
      },
    },
    handler: async (request) => ({
      data: {
        foo: 12,
        value: 'bla' + request.pathParams.username
      },
    })
  })
])
