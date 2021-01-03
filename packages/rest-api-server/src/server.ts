import http from 'http'
import { URL } from 'url'
import { StringMapping } from './route'

import { ServerConfig, handle } from './handler-impl'
import { JsonSerialization } from './serialization'
import { Route, RequestSpec, ResponseSpec } from './route'

import { Field } from '@validator/validator'
import { constantField, $} from '@validator/validator/fields'

const DEFAULT_SERVER_CONFIG: ServerConfig = {
  baseUrl: 'http://localhost:8000',
  serialization: new JsonSerialization(),
  encoding: 'utf-8',
  frameworkErrorStatusCode: 502,
  appErrorStatusCode: 500,
  reportError: (error: unknown) => {
    console.error(error)
    return Promise.resolve(undefined)
  },
}

const mergeServerConfigs = (
  serverConfig: Partial<ServerConfig>
): ServerConfig => ({
  ...DEFAULT_SERVER_CONFIG,
  ...serverConfig,
})

type RequestSpecMethod = Omit<RequestSpec, 'method' | 'pathParams'>

type PathSpec<PathParams extends StringMapping> = typeof $ & Field<PathParams>

export const withMethod = <
  Method extends string,
> (method: Method) => <
  PathParams extends StringMapping = StringMapping,
  ReqSpec extends RequestSpecMethod = RequestSpecMethod,
  RespSpec extends ResponseSpec = ResponseSpec
  > (
      pathParams: PathSpec<PathParams>,
      spec: {
      request: ReqSpec,
      response: RespSpec
    },
      handler: Route<ReqSpec & {
        readonly method: ReturnType<typeof constantField> & Field<string>,
        readonly pathParams: PathSpec<PathParams>
      }, RespSpec>['handler']
    ): Route => ({
      request: {
        ...spec.request,
        method: constantField(method),
        pathParams,
      },
      response: spec.response,
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
  routes: Route[],
): void => {
  const merged = mergeServerConfigs(config)
  http.createServer(handle.bind(null, merged, routes)).listen(getPort(merged.baseUrl))
}
