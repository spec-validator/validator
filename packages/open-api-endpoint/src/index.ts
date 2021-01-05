import { GET, ServerConfig } from '@validator/rest-api-server'
import { $, stringField } from '@validator/validator/fields'

import genOpenApi, { WithInfo } from './genOpenApi'

export default (config: ServerConfig & WithInfo, schemaRoot: '/open-api'): ServerConfig => {

  const routes = [
    ...config.routes,
    GET($._(schemaRoot),
      {
        response: {
          data: stringField(),
        }
      },
      async () => ({
        data: JSON.stringify(genOpenApi(config))
      })
    )
  ]

  return {
    ...config,
    routes
  }
}
