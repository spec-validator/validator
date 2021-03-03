import querystring from 'querystring'

import { validate, serialize, TypeHint } from '@spec-validator/validator'
import { RequestSpec, ResponseSpec, route as declareRoute, Route, StringMapping, VoidOrUndefined } from './route'
import { cached } from '@spec-validator/utils/utils'
import { HtmlSerialization, JsonSerialization, SerializationFormat } from './serialization'
import { Any, WithoutOptional } from '@spec-validator/utils/util-types'
import { SegmentField, ConstantField, constantField } from '@spec-validator/validator/fields'
import { getFieldForSpec } from '@spec-validator/validator/interface'
import { Field } from '@spec-validator/validator/core'

export type ServerConfig = {
  readonly baseUrl: string,
  readonly serializationFormats: [SerializationFormat, ...SerializationFormat[]],
  readonly encoding: BufferEncoding,
  readonly appErrorStatusCode: number,
  readonly reportError: (error: unknown) => Promise<void>
  readonly routes: Route[],
}

const splitPath = (url: string) => {
  const [pathParams, queryParams] = url.split('?', 2)
  return {
    pathParams,
    queryParams: querystring.decode(queryParams),
  }
}

const DEFAULT_SERVER_CONFIG: ServerConfig = {
  baseUrl: 'http://localhost:8000',
  serializationFormats: [new JsonSerialization(), new HtmlSerialization()],
  encoding: 'utf-8',
  appErrorStatusCode: 500,
  reportError: (error: unknown) => {
    console.error(error)
    return Promise.resolve(undefined)
  },
  routes: [],
}

export const getServerConfigs = <C extends Partial<ServerConfig>> (
  serverConfig: C
): ServerConfig => ({
    ...DEFAULT_SERVER_CONFIG,
    ...serverConfig,
  })

const matchRoute = (
  request: WildCardRequest,
  requestSpec: Pick<RequestSpec, 'method' | 'pathParams'>,
): boolean => {
  try {
    validate(
      {
        method: requestSpec.method,
        pathParams: requestSpec.pathParams,
      },
      {
        method: request.method,
        pathParams: splitPath(request.url).pathParams,
      }
    )
    return true
  } catch (_) {
    return false
  }
}

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
        reason: error,
      }
    }
  }
}

export type WildCardRequest = {
  body: string,
  headers: Record<string, any>,
  method: string,
  url: string
}

export type WildCardResponse = {
  body?: string,
  headers?: Record<string, any>,
  statusCode: number
}

const getSerializationMapping = (
  serializationFormats: SerializationFormat[],
): Record<string, SerializationFormat> =>
  // To prevent serialization mapping construction on every request
  cached('formats', () => Object.fromEntries(serializationFormats.map(it =>
    [it.mediaType,  it]
  )))

export const firstHeader = (value: string | string[] | undefined): string | undefined => {
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
  requestIn: WildCardRequest,
  headerKey: string,
  fallback?: string
) => {
  const serializationFormats = getSerializationMapping(config.serializationFormats)
  const types = firstHeader(requestIn.headers[headerKey]) || config.serializationFormats[0].mediaType
  const ttype = types
    .split(',')
    .map(it => it.split(';')[0])
    .find((it) => it === ANY_MEDIA_TYPE || serializationFormats[it]) || fallback

  const eventualType = ttype === ANY_MEDIA_TYPE ? config.serializationFormats[0] : ttype && serializationFormats[ttype]
  if (!eventualType) {
    throw {
      statusCode: 415,
      isPublic: true,
      reason: `Not supported '${headerKey}': ${types}`,
    }
  }
  return eventualType
}

// eslint-disable-next-line max-statements
const handleRoute = async (
  config: ServerConfig,
  route: {
    request: {
      headers?: Field<TypeHint<Route['request']['headers']>>,
      queryParams?: Field<TypeHint<Route['request']['queryParams']>>,
      method: Route['request']['method'],
      pathParams: Route['request']['pathParams'],
      body?: Route['request']['body']
    },
    response: Route['response'],
    handler: Route['handler']
  },
  wildcardRequest: WildCardRequest
): Promise<WildCardResponse> => {

  wildcardRequest.headers['accept'] = wildcardRequest.headers['accept'] || wildcardRequest.headers['content-type']

  const _getMediaType = getMediaType.bind(null, config, wildcardRequest)

  const contentType = _getMediaType('content-type')

  const request = await withAppErrorStatusCode(
    400,
    async () => validate(route.request, {
      ...wildcardRequest,
      ...splitPath(wildcardRequest.url),
      body: route.request.body ?
        await withAppErrorStatusCode(400, () => contentType.deserialize(wildcardRequest.body)) :
        undefined,
    }, true),
  )

  // This cast is totally reasoanble because in the interface we exclude
  // null values.
  const handler = route.handler as unknown as (req: TypeHint<RequestSpec>) => Promise<TypeHint<ResponseSpec>>

  // TODO: no any here
  const resp = serialize(route.response, await withAppErrorStatusCode(
    config.appErrorStatusCode,
    async () => await handler(request as any)
  ) as any) as any

  const accept = _getMediaType('accept')

  return {
    body: accept.serialize(resp.body),
    headers: {
      ...resp.headers,
      'content-type': accept.mediaType,
    },
    statusCode: resp.statusCode,
  }
}

export type Placeholder = Any

type RequestSpecMethod = Omit<RequestSpec, 'method' | 'pathParams'>

type ResponseSpecMethod = Omit<ResponseSpec, 'statusCode'>

// Make it fluid API - to make things work with autocomplete
export const withMethod = <
  Method extends string,
  OkStatusCode extends number
> (method: Method, okStatusCode: OkStatusCode, routes?: Route[]) =>
  <PathParams extends StringMapping | undefined = StringMapping | undefined> (pathParams: SegmentField<PathParams>): {
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
              readonly pathParams: SegmentField<PathParams>
            }
        >>
      ) => Promise<
        VoidOrUndefined<WithoutOptional<TypeHint<RespSpec>>>
      >) => Route
    })
  } => ({
      spec: (spec) => ({ handler: ( handler ) => {
        const entry = declareRoute({
          request: {
            ...(spec.request || {}),
            method: constantField(method),
            pathParams: pathParams as SegmentField<StringMapping | undefined>,
          },
          response: {
            ...(spec.response || {}),
            statusCode: constantField(okStatusCode),
          },
        }).handler(
          async (req) => ({ ...((await handler(req as any)) as any), statusCode: okStatusCode })
        )
        routes?.push(entry)
        return entry
      },
      }),
    })

// We don't want to define the types explicitly because those definitions are quite large
// - better to infer them
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createRouteCollection = (routes: Route[] | undefined = []) => [({
  GET: withMethod('GET', 200, routes),
  HEAD: withMethod('HEAD', 200, routes),
  POST: withMethod('POST', 201, routes),
  PUT: withMethod('PUT', 204, routes),
  DELETE: withMethod('DELETE', 204, routes),
  PATCH: withMethod('PATCH', 204, routes),
}), routes] as const

export const _ = createRouteCollection(undefined)[0]

const jsonSerialization = new JsonSerialization()

// eslint-disable-next-line max-statements
export default (
  config: ServerConfig
): ((request: WildCardRequest) => Promise<WildCardResponse>) => {

  const routes = config.routes.map(it => ({
    ...it,
    path: {
      method: it.request.method,
      pathParams: it.request.pathParams,
    },
    request: {
      ...it.request,
      headers: getFieldForSpec(it.request.headers, true),
      queryParams: getFieldForSpec(it.request.queryParams, true),
    },
  }))

  // eslint-disable-next-line max-statements
  return async (request: WildCardRequest): Promise<WildCardResponse> => {

    try {
      const route = routes.find(it => matchRoute(request, it.path))

      if (!route) {
        return {
          statusCode: 404,
        }
      }

      return await handleRoute(config, route, request)
    } catch (error) {
      const statusCode = error.statusCode || config.appErrorStatusCode
      if (error.isPublic) {
        const accept = getMediaType(config, request, 'accept', jsonSerialization.mediaType)
        return {
          statusCode,
          body: accept.serialize(error),
        }
      } else {
        await config.reportError(error)
        return {
          statusCode,
        }
      }
    }

  }
}
