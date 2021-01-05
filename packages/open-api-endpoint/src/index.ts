import { GET, ServerConfig } from '@validator/rest-api-server'
import { $, constantField, stringField } from '@validator/validator/fields'

import genOpenApi, { WithInfo } from './genOpenApi'

export default (config: ServerConfig & WithInfo, schemaRoot: '/open-api'): ServerConfig => {

  const routes = [
    ...config.routes,
    GET($._(schemaRoot),
      {
        response: {
          data: stringField(),
          statusCode: constantField(200)
        }
      },
      async () => ({
        statusCode: 200,
        data: JSON.stringify(genOpenApi(config))
      })
    )
  ]

  return {
    ...config,
    routes
  }
}
