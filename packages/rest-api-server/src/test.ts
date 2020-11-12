/*
import { numberField, objectField, stringField } from '@validator/validator/fields'
import { $ } from '@validator/validator/segmentChain'
import { resource, serve } from './raw-server'


serve({}, {
  foo: resource(
    $._('/foo/')._('username', stringField()),
    {
      GET: {
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
      }
    }
  )
})

  GET($._('/bla/')._('username', stringField()), {
    responseSpec: stringField(),
    handler: async (request) => 'bla ' + request.pathParams.username,
  }),
  ANY_METHOD($._('anyPath', stringField()), {
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
*/
