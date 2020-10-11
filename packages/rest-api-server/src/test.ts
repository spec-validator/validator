import { numberField, objectField, stringField } from '@validator/validator/fields'
import { root } from '@validator/validator/segmentChain'
import { ANY_METHOD, GET, serve } from './server'

serve({}, [
  GET({
    pathSpec: root._('/foo/')._('username', stringField()),
    responseSpec: {
      data: {
        value: stringField(),
      },
    },
    handler: async (request) => ({
      data: {
        value: 'foo ' + request.pathParams.username,
      },
    })
  }),
  GET({
    pathSpec: root._('/bla/')._('username', stringField()),
    responseSpec: {
      data: { value: stringField() },
    },
    handler: async (request) => ({
      data: { value: 'bla ' + request.pathParams.username },
    })
  }),
  ANY_METHOD({
    pathSpec: root._('anyPath', stringField()),
    responseSpec: {
      data: {
        message: stringField()
      }
    },
    handler: async () => ({
      data: {
        message: 'NOT FOUND',
      },
    })
  })
])
