import { GET, ServerConfig } from '@validator/rest-api-server'
import { Json } from '@validator/validator'
import { $, constantField, objectField, stringField } from '@validator/validator/fields'
import wildcardObjectField from '@validator/validator/fields/wildcardObjectField'
import genOpenApi, { DEFAULT_INFO, Info, WithInfo } from './genOpenApi'

const getUI = (url: string, info: Info) => `
  <html>
  <head>
    <title>${info.title} : ${info.version}</title>
    <script src="https://unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js" charset="UTF-8"></script>

    <script>
    var SwaggerUIBundle = require('swagger-ui-dist').SwaggerUIBundle
    const ui = SwaggerUIBundle({
        url: "${url}",
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout"
      })
    </script>
  </head>
  <body>
    <div id='swagger-ui' />
  </body>
  </html>
`

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
    ),
    GET($._(schemaRoot)._('-ui'),
      {
        response: {
          data: stringField(),
          headers: objectField({
            'content-type': constantField('text/html')
          })
        }
      },
      async () => ({
        data: getUI(config.baseUrl, config.info || DEFAULT_INFO),
        headers: {
          'content-type': 'text/html' as const
        }
      })
    )
  ]

  return {
    ...config,
    routes
  }
}
