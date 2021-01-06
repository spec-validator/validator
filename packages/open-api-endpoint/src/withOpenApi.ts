import { GET, ServerConfig } from '@validator/rest-api-server'
import { Json } from '@validator/validator'
import { $ } from '@validator/validator/fields'
import wildcardObjectField from '@validator/validator/fields/wildcardObjectField'
import genOpenApi, { WithInfo } from './genOpenApi'

export default (config: ServerConfig & WithInfo, schemaRoot = '/open-api'): ServerConfig => {

  const routes = [
    GET($._(schemaRoot),
      {
        response: {
          data: wildcardObjectField(),
        }
      },
      async () => ({
        data: genOpenApi(config) as unknown as Record<string, Json>
      })
    )
  ]

  return {
    ...config,
    routes
  }
}
