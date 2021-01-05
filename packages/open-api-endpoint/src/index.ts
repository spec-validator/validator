import { GET, Route } from '@validator/rest-api-server'
import { $, constantField, stringField } from '@validator/validator/fields'

import genOpenApi from './genOpenApi'

export default (routes: Route[], schemaRoot: '/open-api'): Route[] => [
  ...routes,
  GET($._(schemaRoot),
    {
      request: {},
      response: {
        data: stringField(),
        statusCode: constantField(200 as const)
      }
    },
    async () => ({
      statusCode: 200 as const,
      data: JSON.stringify(genOpenApi(routes))
    })
  )
]
