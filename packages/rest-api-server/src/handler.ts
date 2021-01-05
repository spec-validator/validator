import http from 'http'
import { validate, serialize, TypeHint } from '@validator/validator'
import { RequestSpec, ResponseSpec, Route } from './route'
import { getOrUndefined, pick } from '@validator/validator/utils'
import { SerializationFormat } from './serialization'

export type ServerConfig = {
  readonly baseUrl: string,
  readonly serializationFormats: [SerializationFormat, ...SerializationFormat[]],
  readonly encoding: BufferEncoding,
  readonly frameworkErrorStatusCode: number,
  readonly appErrorStatusCode: number,
  readonly reportError: (error: unknown) => Promise<void>
  readonly routes: Route[],
}

const splitPath = (url?: string) => {
  const [pathParams, queryParams] = (url || '').split('?', 2)
  return {
    pathParams, queryParams
  }
}

const getWildcardRequestBase = (
  request: http.IncomingMessage,
) => ({
  ...splitPath(request.url),
  method: request.method,
})

const ROUTE_KEYS = ['method' as const, 'pathParams' as const]

const matchRoute = async (
  request: http.IncomingMessage,
  route: Route,
): Promise<boolean> => !!validate(
  pick(route.request, ROUTE_KEYS),
  pick(getWildcardRequestBase(request), ROUTE_KEYS)
)

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

const getWildcardRoute = async (
  serialization: SerializationFormat,
  request: http.IncomingMessage,
) => {
  const data = await getData(request)
  return ({
    ...getWildcardRequestBase(request),
    data: data && serialization.deserialize(data),
    headers: request.headers
  })
}

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

// TODO: CACHING
const getSerializationMapping = (
  serializationFormats: SerializationFormat[],
): Record<string, SerializationFormat> =>
  Object.fromEntries(serializationFormats.map(it =>
    [it.mediaType,  it]
  ))

const firstHeader = (value: string | string[] | undefined): string | undefined => {
  if (!value) {
    return undefined
  } if (typeof value === 'string') {
    return value
  } else {
    return value[0]
  }
}

const handleRoute = async (
  config: ServerConfig,
  route: Route,
  requestIn: http.IncomingMessage,
  response: http.ServerResponse
): Promise<void> => {
  const serializationFormats = getSerializationMapping(config.serializationFormats)

  // default to the top-most media type
  const contentType = firstHeader(requestIn.headers['Content-Type']) || config.serializationFormats[0].mediaType
  const requestSerializationFormat = serializationFormats[contentType]

  if (!requestSerializationFormat) {
    throw {
      statusCode: 415,
      reason: 'Not supported: Content-Type'
    }
  }

  const wildcardRequest = await getWildcardRoute(requestSerializationFormat, requestIn)

  const request = await withAppErrorStatusCode(
    400,
    async () => validate(route.request, wildcardRequest, true)
  )

  // This cast is totally reasoanble because in the interface we exclude
  // null values.
  const handler = route.handler as unknown as (req: TypeHint<RequestSpec>) => Promise<TypeHint<ResponseSpec>>

  const resp = serialize(route.response, await withAppErrorStatusCode(
    config.appErrorStatusCode,
    () => handler(request)
  )) as any

  Object.entries(resp?.headers || {}).forEach(([key, value]) => {
    response.setHeader(key, value as any)
  })

  response.statusCode = resp.statusCode

  // default to the same media type as content
  const accept = firstHeader(requestIn.headers.accept) || contentType
  const responseSerializationFormat = serializationFormats[accept]

  if (!responseSerializationFormat) {
    throw {
      statusCode: 415,
      reason: 'Not supported: Accept'
    }
  }

  response.setHeader('Content-Type', accept)

  if (resp.data !== undefined) {
    console.log(responseSerializationFormat.serialize(resp.data))
    response.write(
      responseSerializationFormat.serialize(resp.data),
      config.encoding
    )
  }
  response.end()
}

export const handle = async (
  config: ServerConfig,
  request: http.IncomingMessage,
  response: http.ServerResponse
): Promise<void> => {
  const route = config.routes.find(getOrUndefined.bind(null, () => matchRoute.bind(null, request)))
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
