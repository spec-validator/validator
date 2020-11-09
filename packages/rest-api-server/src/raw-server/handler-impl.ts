import {
  createServer, IncomingMessage, ServerResponse,
} from 'http'

import qs from 'qs'

import { validate, serialize, isField } from '@validator/validator/core'
import { Segment } from '@validator/validator/segmentChain'
import { Json } from '@validator/validator/Json'
import { Route } from './route'

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
  try {
    route.request.method.validate(request.method)
    route.request.pathParams.match(request.url || '')
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
  route: Route,
  request: IncomingMessage,
  response: ServerResponse
): Promise<void> => {
  const [path, queryString] = (request.url || '').split('?', 2)

  route.request.data

  const query = validate(route.request.query, qs.parse(queryString))
  const pathParams = route.request.pathParams.match(path)
  const method = route.request.method.validate(request.method)
  const data = validate(route.request.data, config.protocol.deserialize(await getData(request)))
  const headers = validate(route.request.headers, request.headers)

  const resp = await withAppErrorStatusCode(
    config.appErrorStatusCode,
    // Here casting to any is truly intentional since
    async () => route.handler({ method, pathParams, query, data, headers } as any)
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
