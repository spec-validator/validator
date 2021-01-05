import { GET, Route } from '@validator/rest-api-server'
import { $, constantField, stringField } from '@validator/validator/fields'

import genOpenApi from './genOpenApi'

export default (routes: Route[], schemaRoot: '/open-api'): Route[] => [
  ...routes,
  GET($._(schemaRoot), {
    response: {
      data: stringField(),
      statusCode: constantField(200)
    }
  },
  async () => Promise.resolve(JSON.stringify(genOpenApi(routes)))
  )
]
