import http from 'http'
import { URL } from 'url'
import { StringMapping } from './route'

import { ServerConfig, handle } from './handler-impl'
import { JsonSerialization } from './serialization'
import { Route, RequestSpec, ResponseSpec } from './route'

import { Field } from '@validator/validator'
import { constantField, $, stringField } from '@validator/validator/fields'
import { ConstantField } from '@validator/validator/fields/constantField'

type RequestSpecMethod = Omit<RequestSpec, 'method' | 'pathParams'>

type ResponseSpecMethod = Omit<ResponseSpec, 'statusCode'>

type PathSpec<PathParams extends StringMapping> = typeof $ & Field<PathParams>

// Make it fluid API - to make things work with autocomplete
export const withMethod = <
  Method extends string,
> (method: Method) => <
  StatusCode extends number = 200,
  PathParams extends StringMapping = StringMapping,
  ReqSpec extends RequestSpecMethod = RequestSpecMethod,
  RespSpec extends ResponseSpecMethod = ResponseSpecMethod
  > (
      pathParams: PathSpec<PathParams>,
      spec: {
        request?: ReqSpec,
        response?: RespSpec & {
          readonly statusCode?: ConstantField<StatusCode>
        }
      },
      handler: Route<ReqSpec & {
        readonly method: ConstantField<string>,
        readonly pathParams: PathSpec<PathParams>
      }, RespSpec & {
        readonly statusCode: ConstantField<StatusCode>
      }>['handler']
    ): Route => ({
      request: {
        ...(spec.request || {}),
        method: constantField(method),
        pathParams,
      },
      response: {
        ...spec.response,
        statusCode: spec.response?.statusCode || constantField(200)
      },
      handler: handler as unknown as Route['handler']
    })

export const GET = withMethod('GET')
export const HEAD = withMethod('HEAD')
export const POST = withMethod('POST')
export const PUT = withMethod('PUT')
export const DELETE = withMethod('DELETE')
export const CONNECT = withMethod('CONNECT')
export const OPTIONS = withMethod('OPTIONS')
export const TRACE = withMethod('TRACE')
export const PATCH = withMethod('PATCH')

export const DEFAULT_SERVER_CONFIG: ServerConfig = {
  baseUrl: 'http://localhost:8000',
  serializationFormats: [new JsonSerialization()],
  encoding: 'utf-8',
  frameworkErrorStatusCode: 502,
  appErrorStatusCode: 500,
  reportError: (error: unknown) => {
    console.error(error)
    return Promise.resolve(undefined)
  },
  routes: [
    GET($._('/'),
      {
        response: {
          statusCode: constantField(200),
          data: stringField()
        }
      },
      async () => ({
        statusCode: 200 as const,
        data: 'ROOT'
      })
    )
  ]
}

const mergeServerConfigs = (
  serverConfig: Partial<ServerConfig>
): ServerConfig => ({
  ...DEFAULT_SERVER_CONFIG,
  ...serverConfig,
})

const SUPPORTED_PROTOCOLS= {
  'http': 80,
  'https': 443
} as const

const supportedProtocols = new Set(Object.keys(SUPPORTED_PROTOCOLS))

const verifyProtocol = (protocol: string): protocol is keyof typeof SUPPORTED_PROTOCOLS =>
  supportedProtocols.has(protocol)

const getPort = (baseUrl: string): number => {
  const url = new URL(baseUrl)
  if (!verifyProtocol(url.protocol)) {
    throw `Protocol ${url.protocol} is not supported`
  }
  return url.port ? Number.parseInt(url.port) : SUPPORTED_PROTOCOLS[url.protocol]
}

export const serve = (
  config: Partial<ServerConfig>,
): void => {
  const merged = mergeServerConfigs(config)
  http.createServer(handle.bind(null, merged)).listen(getPort(merged.baseUrl))
}
