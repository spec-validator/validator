import { _, ServerConfig, getServerConfigs } from '@spec-validator/rest-api-server'
import { Json } from '@spec-validator/utils/Json'
import { segmentField as $, constantField, stringField, wildcardObjectField } from '@spec-validator/validator/fields'
import genOpenApi, { DEFAULT_INFO, Info, WithInfo } from './genOpenApi'

const getUI = (info: Info) => `
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
        url: window.location.href.split('?')[0].replace(/-ui$/, ''),
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

export default <C extends Partial<ServerConfig> & WithInfo>(config: C, schemaRoot = '/open-api'): ServerConfig => {
  const merged = getServerConfigs(config)
  const routes = [
    ...merged.routes,
    _.GET($._(schemaRoot)).spec(
      {
        response: {
          body: wildcardObjectField(),
        },
      },
    ).handler(
      async () => ({
        body: genOpenApi(merged) as unknown as Record<string, Json>,
      })
    ),
    _.GET($._(schemaRoot)._('-ui')).spec(
      {
        response: {
          body: stringField(),
          headers: {
            'content-type': constantField('text/html'),
          },
        },
      },
    ).handler(
      async () => ({
        body: getUI(config.info || DEFAULT_INFO),
        headers: {
          'content-type': 'text/html' as const,
        },
      })
    ),
  ]

  return {
    ...merged,
    routes,
  }
}
