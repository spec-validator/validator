import http from 'http'
import qs from 'qs'

import { validate, serialize, TypeHint } from '@validator/validator'
import { Route } from './route'
import { Request, Response } from './handler'
import { getOrUndefined } from '@validator/validator/utils'
import { SerializationFormat } from './serialization'

export type ServerConfig = {
  readonly baseUrl: string,
  readonly serialization: SerializationFormat,
  readonly encoding: BufferEncoding,
  readonly frameworkErrorStatusCode: number,
  readonly appErrorStatusCode: number,
  readonly reportError: (error: unknown) => Promise<void>
}

const splitPath = (url?: string) => {
  const [pathParams, queryParams] = (url || '').split('?', 2)
  return {
    pathParams, queryParams
  }
}

const getWildcardRoute = async (
  serialization: SerializationFormat,
  request: http.IncomingMessage,
) => ({
  ...splitPath(request.url),
  method: request.method,
  data: serialization.deserialize(await getData(request)),
  headers: request.headers
})

export const matchRoute = (
  request: http.IncomingMessage,
  route: Route,
): {
  method: TypeHint<Route['request']['method']>,
  queryParams: TypeHint<Route['request']['queryParams']>,
  pathParams: TypeHint<Route['request']['pathParams']>
} => {
  const [path, queryString] = (request.url || '').split('?', 2)
  return {
    queryParams: validate(route.request.queryParams, qs.parse(queryString)),
    pathParams: route.request.pathParams?.validate(path),
    method: validate(route.request.method, request.method),
  }
}

const getData = async (msg: http.IncomingMessage): Promise<string> => new Promise<string> ((resolve, reject) => {
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

export const handleRoute = async (
  config: ServerConfig,
  route: Route,
  request: http.IncomingMessage,
  response: http.ServerResponse
): Promise<void> => {
  const match = matchRoute(request, route)
  const data = validate(route.request.data, config.serialization.deserialize(await getData(request)))
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

  response.write(
    config.serialization.serialize(serialize(route.response?.data, resp?.data)),
    config.encoding
  )

}

export const handle = async (
  config: ServerConfig,
  routes: Route[],
  request: http.IncomingMessage,
  response: http.ServerResponse
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
