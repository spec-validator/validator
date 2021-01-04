import { OpenAPIV3 as OpenAPI } from 'openapi-types'

import { ServerConfig, Route } from '@validator/rest-api-server'
import { Field } from '@validator/validator'
import { GetRepresentation, OfType } from '@validator/validator/registry'

import getFieldSchema from './schemaRegistry'
import { optional } from '@validator/validator/fields'

const createParameter = (
  getSchema: GetRepresentation,
  type: 'query' | 'path',
  name: string,
  field: Field<unknown>
): OpenAPI.ParameterObject => ({
  name: name,
  in: type,
  description: (field as any)?.description,
  required: !(field as any)?.isOptional,
  schema: getSchema(field)
})

const specToParams = (
  getSchema: GetRepresentation,
  type: 'query' | 'path',
  spec?: Record<string, Field<unknown>>
): OpenAPI.ParameterObject[] =>
  Object.entries(spec || {}).map(
    ([name, field]) => createParameter(getSchema, type, name, field)
  )

const createOperationObject = (getSchema: GetRepresentation, route: Route): OpenAPI.OperationObject => ({
  parameters: [
    ...specToParams(getSchema, 'query', route.request.queryParams?.objectSpec || {}),
    ...specToParams(getSchema, 'path', route.request.pathParams.getObjectSpec())
  ],
  requestBody: route.request.data && {
    // TODO: inject media type from server configs
    content: { 'application/json': {
      schema: getSchema(route.request.data)
    } },
    // TODO: extra test is required
    required: (route.request.data as unknown as OfType<string>).type !== optional.type
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
})

const createPath = (getSchema: GetRepresentation, route: Route):
  [string, OpenAPI.PathItemObject] => [route.request.pathParams.toString(), {
  [(route.request.method.constant as string).toLowerCase()]: createOperationObject(getSchema, route)
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
  getSchema: GetRepresentation = getFieldSchema
): OpenAPI.Document => ({
  openapi: '3.0.3',
  info: config.info,
  servers: [
    {
      url: config.baseUrl
    }
  ],
  paths: mergeValues(routes.map(createPath.bind(null, getSchema, config.serialization)))
})

export default createOpenApiSpec
