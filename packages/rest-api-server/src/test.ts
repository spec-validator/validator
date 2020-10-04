import { numberField, stringField } from '@validator/validator/fields';
import { root } from '@validator/validator/segmentChain';
import { GET, serve } from './server';

serve({}, [
  GET({
    pathSpec: root._('/')._('username', stringField()),
    responseSpec: {
      data: {
        value: stringField(),
      },
      headers: {
        foo: stringField()
      }
    },
    requestSpec: {
      data: {
        title: stringField()
      },
      headers: {
        bla: stringField()
      }
    },
    handler: async (request) => ({
      data: {
        value: 'bla' + request.pathParams.username
      },
      headers: {
        foo: 'dd'
      }
    })
  })
])
