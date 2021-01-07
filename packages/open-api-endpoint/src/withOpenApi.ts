import { _, ServerConfig } from '@validator/rest-api-server'
import { Json } from '@validator/validator'
import { $, constantField, objectField, stringField } from '@validator/validator/fields'
import wildcardObjectField from '@validator/validator/fields/wildcardObjectField'
import genOpenApi, { DEFAULT_INFO, Info, WithInfo } from './genOpenApi'

const getUI = (url: string, info: Info) => `
  <html>
  <head>
    <title>${info.title} : ${info.version}</title>

    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3.38.0/swagger-ui.css">
  <body>

    <div id="swagger-ui"></div>

    <script src="https://unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js" charset="UTF-8"></script>
    <script src="https://unpkg.com/swagger-ui-dist@3/swagger-ui-standalone-preset.js" charset="UTF-8"></script>

    <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: "${url}",
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ]
      })

      window.ui = ui
    }
    </script>

  </body>
  </html>
`

export default (config: ServerConfig & WithInfo, schemaRoot = '/open-api'): ServerConfig => {

  const routes = [
    ...config.routes,
    _.GET($._(schemaRoot)).spec(
      {
        response: {
          data: wildcardObjectField(),
        },
      },
    ).handler(
      async () => ({
        data: genOpenApi(config) as unknown as Record<string, Json>,
      })
    ),
    _.GET($._(schemaRoot)._('-ui')).spec(
      {
        response: {
          data: stringField(),
          headers: objectField({
            'content-type': constantField('text/html'),
          }),
        },
      },
    ).handler(
      async () => ({
        data: getUI(config.baseUrl + schemaRoot, config.info || DEFAULT_INFO),
        headers: {
          'content-type': 'text/html' as const,
        },
      })
    ),
  ]

  return {
    ...config,
    routes,
  }
}
