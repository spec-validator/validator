import http from 'http'
import { URL } from 'url'
import { StringMapping } from './route'

import { ServerConfig, handle } from './handler'
import { JsonSerialization } from './serialization'
import { Route, RequestSpec, ResponseSpec } from './route'

import { Field, TypeHint } from '@validator/validator'
import { constantField, $, stringField } from '@validator/validator/fields'
import { WithoutOptional } from '@validator/validator/util-types'
import { ConstantField } from '@validator/validator/fields/constantField'

type RequestSpecMethod = Omit<RequestSpec, 'method' | 'pathParams'>

type ResponseSpecMethod = Omit<ResponseSpec, 'statusCode'>

type PathSpec<PathParams extends StringMapping> = typeof $ & Field<PathParams>

// Make it fluid API - to make things work with autocomplete
export const withMethod = <
  Method extends string,
  OkStatusCode extends number
> (method: Method, okStatusCode: OkStatusCode) => <
  PathParams extends StringMapping = StringMapping,
  ReqSpec extends RequestSpecMethod = RequestSpecMethod,
  RespSpec extends ResponseSpecMethod = ResponseSpecMethod,
  > (
      pathParams: PathSpec<PathParams>,
      spec: {
        request?: ReqSpec,
        response?: RespSpec
      },
      handler: (request: WithoutOptional<TypeHint<
        ReqSpec
        & {
            readonly method: ConstantField<Method>,
            readonly pathParams: PathSpec<PathParams>
          }
      >>) => Promise<
        WithoutOptional<TypeHint<RespSpec>>
      > | WithoutOptional<TypeHint<RespSpec>>
    ): Route => {
  const requestSchema = {
    ...(spec.request || {}),
    method: constantField(method),
    pathParams,
  }
  return ({
    request: requestSchema,
    response: {
      ...(spec.response || {}),
      statusCode: constantField(okStatusCode)
    },
    handler: (async (request: Route['request']) => ({
      ...await handler(request as any) as any,
      statusCode: okStatusCode,
    })) as unknown as Route['handler']
  })
}

export const GET = withMethod('GET', 200)
export const HEAD = withMethod('HEAD', 200)
export const POST = withMethod('POST', 201)
export const PUT = withMethod('PUT', 204)
export const DELETE = withMethod('DELETE', 204)
export const PATCH = withMethod('PATCH', 204)

export const DEFAULT_SERVER_CONFIG: ServerConfig = {
  baseUrl: 'http://localhost:8000',
  serializationFormats: [new JsonSerialization()],
  encoding: 'utf-8',
  frameworkErrorStatusCode: 503,
  appErrorStatusCode: 500,
  reportError: (error: unknown) => {
    console.error(error)
    return Promise.resolve(undefined)
  },
  routes: [
    GET($._('/'),
      {
        response: {
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

export const createServer = (
  config: Partial<ServerConfig>,
): http.Server => http.createServer(handle.bind(null, mergeServerConfigs(config)))

export const serve = (
  config: Partial<ServerConfig>,
): void => {
  const merged = mergeServerConfigs(config)
  http.createServer(handle.bind(null, merged)).listen(getPort(merged.baseUrl))
}
