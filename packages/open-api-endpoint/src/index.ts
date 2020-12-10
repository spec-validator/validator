import { ServerConfig, Route } from '@validator/rest-api-server'
import { Field } from '@validator/validator'
import { ValidatorSpec } from '@validator/validator/core'
import { Segment } from '@validator/validator/segmentChain'

import { OpenAPIV3 as OpenAPI } from 'openapi-types'

// https://swagger.io/specification/

const createParameter = (type: 'query' | 'path', name: string, field: Field<unknown>): OpenAPI.ParameterObject => ({
  name: name,
  in: type,
  description: (field as any)?.description,
  required: !(field as any)?.isOptional,
  schema: {
    type: 'string'
  }
})


const createRoute = (segment: Segment<unknown>): string => '//'

const createPathParams = (segment: Segment<unknown>): ValidatorSpec<Record<string, unknown>> => ({})

const specToParams = (
  type: 'query' | 'path',
  spec?: ValidatorSpec<Record<string, unknown>>
): OpenAPI.ParameterObject[] =>
  Object.entries(spec || {}).map(
    ([name, field]) => createParameter(type, name, field)
  )

const createPath = (route: Route): [string, OpenAPI.PathItemObject] => [createRoute(route.request.pathParams), {
  [route.request.method.toLowerCase()]: {
    parameters: [
      ...specToParams('query', route.request.queryParams),
      ...specToParams('path', createPathParams(route.request.pathParams))
    ],
    requestBody: {
      // TODO: inject media type from server configs
      content: { 'application/json': {
        schema: {

        }
      } },
      required: false
    },
    responses: {
      code: {
        headers: { 'header-name': 'header-value' },
        content: { 'application/json': {
          schema: {

          }
        } }
      }
    }
  }
}]

type WithInfo = {
  info: {
    title: string,
    version: string
  }
}

const mergeValues = (pairs: [a: string, b: OpenAPI.PathItemObject][]): Record<string, OpenAPI.PathItemObject> => {
  const record: Record<string, OpenAPI.PathItemObject>  = {}
  pairs.forEach(([a, b]) => {
    record[a] = {
      ...(record[a] || {}),
      ...b
    }
  })
  return record
}

const createOpenApiSpec = (
  config: ServerConfig & WithInfo,
  routes: Route[],
): OpenAPI.Document => ({
  openapi: '3.0.3',
  info: config.info,
  servers: [
    {
      url: config.baseUrl
    }
  ],
  paths: mergeValues(routes.map(createPath))
})

export default createOpenApiSpec
