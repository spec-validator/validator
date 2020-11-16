import { Segment } from '@validator/validator/segmentChain'
import { Optional } from '@validator/validator/util-types'
import http from 'http'
import { StringMapping } from './handler'

import { ServerConfig, handle } from './handler-impl'
import JsonProtocol from './protocols/json'
import { RequestSpec, ResponseSpec, Route } from './route'

const DEFAULT_SERVER_CONFIG: ServerConfig = {
  protocol: new JsonProtocol(),
  encoding: 'utf-8',
  port: 8000,
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

export const withMethod = <
  Method extends string,
> (method: Method) => <
  PathParams extends Optional<StringMapping> = Optional<StringMapping>,
  ReqSpec extends Omit<RequestSpec, 'method' | 'pathParams'> = Omit<RequestSpec, 'method' | 'pathParams'>,
  RespSpec extends ResponseSpec = ResponseSpec
  > (
      pathParams: Segment<PathParams>,
      spec: {
      request: ReqSpec,
      response: RespSpec
    },
      handler: Route<ReqSpec & { method: Method, pathParams: Segment<PathParams> }, RespSpec>['handler']
    ): Route => ({
      request: {
        ...spec.request,
        method,
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

export const serve = (
  config: Partial<ServerConfig>,
  routes: Route[],
): void => {
  const merged = mergeServerConfigs(config)
  http.createServer(handle.bind(null, merged, routes)).listen(merged.port)
}
