import http from 'http'
import { validate, serialize, TypeHint } from '@validator/validator'
import { RequestSpec, ResponseSpec, Route } from './route'
import { pick } from '@validator/validator/utils'
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

const matchRoute = (
  request: http.IncomingMessage,
  route: Route,
): boolean => {
  try {
    validate(
      pick(route.request, ROUTE_KEYS),
      pick(getWildcardRequestBase(request), ROUTE_KEYS)
    )
    return true
  } catch (_) {
    return false
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

const withAppErrorStatusCode = async <T>(
  statusCode: number,
  inner: () => Promise<T> | T
): Promise<T> => {
  try {
    return await inner()
  } catch (error) {
    if (error.statusCode && error.isPublic) {
      throw error
    } else {
      throw {
        statusCode,
        isPublic: statusCode < 500,
        reason: error
      }
    }
  }
}

const getWildcardRoute = async (
  serialization: SerializationFormat,
  request: http.IncomingMessage,
) => {
  const data = await getData(request)
  return ({
    ...getWildcardRequestBase(request),
    data: data && await withAppErrorStatusCode(400, () => serialization.deserialize(data)),
    headers: request.headers
  })
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

const ANY_MEDIA_TYPE = '*/*'

const getMediaType = (
  config: ServerConfig,
  requestIn: http.IncomingMessage,
  headerKey: string,
  fallback?: string
) => {
  const serializationFormats = getSerializationMapping(config.serializationFormats)
  const types = firstHeader(requestIn.headers[headerKey]) || config.serializationFormats[0].mediaType
  const ttype = types
    .split(',')
    .map(it => it.split(';')[0])
    .find((it) => it === ANY_MEDIA_TYPE || serializationFormats[it]) || fallback
  const eventualType = ttype && serializationFormats[ttype]
  if (!eventualType) {
    throw {
      statusCode: 415,
      isPublic: true,
      reason: `Not supported: ${headerKey}`
    }
  }
  return eventualType
}

const handleRoute = async (
  config: ServerConfig,
  route: Route,
  requestIn: http.IncomingMessage,
  response: http.ServerResponse
): Promise<void> => {

  requestIn.headers['accept'] = requestIn.headers['accept'] || requestIn.headers['content-type']

  const _getMediaType = getMediaType.bind(null, config, requestIn)

  const contentType = _getMediaType('content-type')

  const wildcardRequest = await getWildcardRoute(contentType, requestIn)

  const request = await withAppErrorStatusCode(
    400,
    async () => validate(route.request, wildcardRequest, true),
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

  const accept = _getMediaType('accept')

  response.setHeader('content-type', accept.mediaType)

  if (resp.data !== undefined) {
    response.write(
      accept.serialize(resp.data),
      config.encoding
    )
  }
}

export const handle = async (
  config: ServerConfig,
  request: http.IncomingMessage,
  response: http.ServerResponse
): Promise<void> => {
  const route = config.routes.find(matchRoute.bind(null, request))

  const reportError = async (error: unknown) => {
    try {
      await config.reportError(error)
    } catch (reportingError) {
      console.error(reportingError)
    }
  }

  if (route) {
    try {
      await handleRoute(config, route, request, response)
    } catch (error) {
      response.statusCode = error.statusCode || config.frameworkErrorStatusCode
      if (error.isPublic) {
        try {
          const accept = getMediaType(
            config, request, 'accept',
            config.serializationFormats[0].mediaType
          )
          response.write(
            accept.serialize(error),
            config.encoding
          )
        } catch (error2) {
          reportError(error2)
        }
      } else {
        reportError(error)
      }
    }
  } else {
    response.statusCode = 404
  }
  response.end()
}
