import http from 'http'
import { URL } from 'url'
import { StringMapping } from './route'

import { ServerConfig, handle } from './handler'
import { HtmlSerialization, JsonSerialization } from './serialization'
import { Route, RequestSpec, ResponseSpec } from './route'

import { Field, TypeHint } from '@validator/validator'
import { constantField, $, stringField } from '@validator/validator/fields'
import { Promisable, WithoutOptional } from '@validator/validator/util-types'
import { ConstantField } from '@validator/validator/fields/constantField'

type RequestSpecMethod = Omit<RequestSpec, 'method' | 'pathParams'>

type ResponseSpecMethod = Omit<ResponseSpec, 'statusCode'>

type PathSpec<PathParams extends StringMapping> = typeof $ & Field<PathParams>

// Make it fluid API - to make things work with autocomplete
export const withMethod = <
  Method extends string,
  OkStatusCode extends number
> (method: Method, okStatusCode: OkStatusCode) =>
  <PathParams extends StringMapping = StringMapping> (pathParams: PathSpec<PathParams>): {
    spec:  <
      ReqSpec extends RequestSpecMethod = RequestSpecMethod,
      RespSpec extends ResponseSpecMethod = ResponseSpecMethod,
      > (spec: {
      request?: ReqSpec,
      response?: RespSpec
    }) => ({
      handler: (
        handler: (request: WithoutOptional<TypeHint<
        ReqSpec
        & {
            readonly method: ConstantField<Method>,
            readonly pathParams: PathSpec<PathParams>
          }
      >>) => Promisable<
        WithoutOptional<TypeHint<RespSpec>>
      >) => Route
    })
  } => ({spec: (spec) => ({handler: ( handler ) => {
      const requestSchema = {
        ...(spec.request || {}),
        method: constantField(method),
        pathParams,
      }
      return ({
        request: requestSchema,
        response: {
          ...(spec.response || {}),
          statusCode: constantField(okStatusCode),
        },
        handler: (async (request: Route['request']) => ({
          ...await handler(request as any) as any,
          statusCode: okStatusCode,
        })) as unknown as Route['handler'],
      })
    }})})

export const _ = {
  GET: withMethod('GET', 200),
  HEAD: withMethod('HEAD', 200),
  POST: withMethod('POST', 201),
  PUT: withMethod('PUT', 204),
  DELETE: withMethod('DELETE', 204),
  PATCH: withMethod('PATCH', 204),
}

export const DEFAULT_SERVER_CONFIG: ServerConfig = {
  baseUrl: 'http://localhost:8000',
  serializationFormats: [new JsonSerialization(), new HtmlSerialization()],
  encoding: 'utf-8',
  frameworkErrorStatusCode: 503,
  appErrorStatusCode: 500,
  reportError: (error: unknown) => {
    console.error(error)
    return Promise.resolve(undefined)
  },
  routes: [
    _.GET($._('/')).spec({
      response: {
        data: stringField(),
      },
    }).handler(
      async () => ({
        data: 'ROOT',
      })
    ),
  ],
}

const mergeServerConfigs = (
  serverConfig: Partial<ServerConfig>
): ServerConfig => ({
  ...DEFAULT_SERVER_CONFIG,
  ...serverConfig,
})

const SUPPORTED_PROTOCOLS= {
  'http': 80,
  'https': 443,
} as const

const supportedProtocols = new Set(Object.keys(SUPPORTED_PROTOCOLS))

const verifyProtocol = (protocol: string): protocol is keyof typeof SUPPORTED_PROTOCOLS =>
  supportedProtocols.has(protocol)

const getPort = (baseUrl: string): number => {
  const url = new URL(baseUrl)
  // Node's protocol has a trailing column
  const protocol = url.protocol.replace(/:$/, '')
  if (!verifyProtocol(protocol)) {
    throw `Protocol ${url.protocol} is not supported`
  }
  return url.port ? Number.parseInt(url.port) : SUPPORTED_PROTOCOLS[protocol]
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
