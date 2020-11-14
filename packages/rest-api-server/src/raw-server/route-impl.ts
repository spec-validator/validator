import {
  createServer, IncomingMessage, ServerResponse,
} from 'http'

import qs from 'qs'

import { validate, serialize } from '@validator/validator/core'
import { Json } from '@validator/validator/Json'
import { RequestExt, RequestSpec, ResponseSpec, Route } from './route'
import { Request, Response } from './handler'
import { Optional } from '@validator/validator/util-types'
import { choiceField } from '@validator/validator/fields'
import { getOrUndefined } from '@validator/validator/utils'

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
  route: Route,
): {
  method: Route['request']['method'],
  queryParams: RequestExt<Route['request']>['queryParams'],
  pathParams: RequestExt<Route['request']>['pathParams']
} => {
  const [path, queryString] = (request.url || '').split('?', 2)
  const method = route.request.method.toLowerCase()
  if (method !== request.method?.toLowerCase()) {
    throw 'Method is not supported'
  }
  return {
    queryParams: validate(route.request.queryParams, qs.parse(queryString)),
    pathParams: route.request.pathParams.match(path),
    method
  }
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
  const match = matchRoute(request, route)
  const data = validate(route.request.data, config.protocol.deserialize(await getData(request)))
  const headers = validate(route.request.headers, request.headers)

  // This cast is totally reasoanble because in the interface we exclude
  // null values.
  const handler = route.handler as unknown as (req: Request) => Promise<Response>

  const resp = await withAppErrorStatusCode(
    config.appErrorStatusCode,
    handler.bind(null, { ...match, data, headers })
  )

  Object.entries(resp?.headers || {}).forEach(([key, value]) => {
    response.setHeader(key, value)
  })

  response.statusCode = resp.statusCode

  const dataSpec = route.response?.data

  if (!dataSpec) {
    return
  }

  response.write(
    config.protocol.serialize(serialize(dataSpec, resp?.data)),
    config.encoding
  )

}

const handle = async (
  config: ServerConfig,
  routes: Route[],
  request: IncomingMessage,
  response: ServerResponse
): Promise<void> => {
  const route = routes.find(getOrUndefined.bind(null, () => matchRoute.bind(null, request)))
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

const withMethod = <
  ReqSpec extends RequestSpec = RequestSpec,
  RespSpec extends ResponseSpec = ResponseSpec
> (method: Optional<Method>) => (pathParams: ReqSpec['pathParams'], spec:
  Route<ReqSpec, RespSpec> & {request: Exclude<ReqSpec, 'method' | 'pathParams'>}
  ): Route<ReqSpec, RespSpec> => ({
    request: {
      ...spec.request,
      method: method === undefined ? undefined : choiceField(method),
      pathParams,
    },
    response: spec.response,
    handler: spec.handler
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
  routes: Route[],
): void => {
  const merged = mergeServerConfigs(config)
  createServer(handle.bind(null, merged, routes)).listen(merged.port)
}
