import {
  createServer, IncomingMessage, ServerResponse,
} from 'http'

import qs from 'qs'

import { validate, serialize, isField } from '@validator/validator/core'
import { Segment } from '@validator/validator/segmentChain'
import { Json } from '@validator/validator/Json'
import { Route } from './raw-server/route'

interface MediaTypeProtocol {
  serialize(deserialized: Json): string
  deserialize(serialized: string): Json
}

class JsonProtocol implements MediaTypeProtocol {
  serialize = JSON.stringify;
  deserialize = JSON.parse;
}

export type ServerConfig = {
  protocol: MediaTypeProtocol,
  encoding: BufferEncoding,
  port: number,
  frameworkErrorStatusCode: number,
  appErrorStatusCode: number,
  reportError: (error: unknown) => Promise<void>
}

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

const matchRoute = (
  request: IncomingMessage,
  route: Route
): boolean => {
  const method = (route.request as any)?.method
  if (method && request.method !== method) {
    return false
  }
  try {
    (route.pathParams as any).match(request.url || '')
  } catch (err) {
    return false
  }
  return true
}

const getData = async (msg: IncomingMessage): Promise<string> => new Promise<string> ((resolve, reject) => {
  try {
    const chunks: string[] = []
    msg.on('readable', () => chunks.push(msg.read()))
    msg.on('error', reject)
    msg.on('end', () => resolve(chunks.join('')))
  } catch (err) {
    reject(err)
  }
})

const withAppErrorStatusCode = async <T>(statusCode: number, inner: () => Promise<T>): Promise<T> => {
  try {
    return await inner()
  } catch (error) {
    throw {
      statusCode: statusCode,
      error: error,
    }
  }
}

const handleRoute = async (
  config: ServerConfig,
  route: WildCardRoute,
  request: IncomingMessage,
  response: ServerResponse
): Promise<void> => {
  const [path, queryString] = (request.url || '').split('?', 2)

  const queryParams = route.requestSpec?.query
    ? validate(route.requestSpec.query, qs.parse(queryString))
    : undefined
  const pathParams = route.pathSpec.match(path)
  const method = request.method?.toUpperCase()
  const data = route.requestSpec?.data
    ? validate(route.requestSpec.data, config.protocol.deserialize(await getData(request)))
    : undefined
  const headers = route.requestSpec?.headers
    ? validate(route.requestSpec.headers, request.headers)
    : undefined

  const resp = await withAppErrorStatusCode(
    config.appErrorStatusCode,
    route.handler.bind(null, { method, pathParams, queryParams, data, headers })
  )

  Object.entries((resp as any).headers || {}).forEach(([key, value]) =>
    response.setHeader(key, value as any)
  )

  response.statusCode = resp.statusCode || data ? 200 : 201

  const dataSpec = isField(route.responseSpec) ? route.requestSpec : route.requestSpec?.data

  if (!dataSpec) {
    return
  }

  response.write(
    config.protocol.serialize(serialize(dataSpec, (resp as any).data)),
    config.encoding
  )

}

export const handle = async (
  config: ServerConfig,
  routes: WildCardRoute[],
  request: IncomingMessage,
  response: ServerResponse
): Promise<void> => {
  const route = routes.find(matchRoute.bind(null, request))
  if (route) {
    try {
      await handleRoute(config, route, request, response)
    } catch (error) {
      try {
        await config.reportError(error)
      } catch (reportingError) {
        console.error(reportingError)
      }
      response.statusCode = error.statusCode || config.frameworkErrorStatusCode
    }
  } else {
    response.statusCode = 404
  }
  response.end()
}

export type Method =
  'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH' | string

export type MethodRoute = <
  RequestPathParams,
  TResponseSpec extends Optional<WildCardResponseSpec> = undefined,
  TRequestSpec extends Optional<WildCardRequestSpec> = undefined,
> (
    pathSpec: Segment<RequestPathParams>,
    routeConfig: Omit<Route<RequestPathParams, TResponseSpec, TRequestSpec>, 'method' | 'pathSpec'>
  )
  => Route<RequestPathParams, TResponseSpec, TRequestSpec>

const withMethod = (method: string | undefined): MethodRoute => (pathSpec, routeConfig) => ({
  method,
  pathSpec,
  ...routeConfig,
})

export const ANY_METHOD = withMethod(undefined)
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
  routes: WildCardRoute[],
): void => {
  const merged = mergeServerConfigs(config)
  createServer(handle.bind(null, merged, routes)).listen(merged.port)
}
