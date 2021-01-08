import { OpenAPIV3 as OpenAPI } from 'openapi-types'

import { ServerConfig, Route } from '@validator/rest-api-server'
import { Field, Json } from '@validator/validator'
import { $, optional } from '@validator/validator/fields'
import { GetRepresentation, OfType } from '@validator/validator/registry'

import getFieldSchema from './schemaRegistry'
import { Any, ConstructorArgs } from '@validator/validator/util-types'
import { isResponsesSpec, ResponseSpec } from '@validator/rest-api-server/route'
import { withoutOptional } from '@validator/validator/utils'

const mergeValues = (pairs: [a: string, b: OpenAPI.PathItemObject][]): Record<string, OpenAPI.PathItemObject> => {
  const record: Record<string, OpenAPI.PathItemObject>  = {}
  pairs.forEach(([a, b]) => {
    record[a] = {
      ...(record[a] || {}),
      ...b,
    }
  })
  return record
}

export type Info = {
  title: string,
  version: string
}

export type WithInfo = {
  info?: Info
}

export const DEFAULT_INFO: Info = {
  title: 'Test',
  version: '0.0.1',
}

const getDescription = (field: unknown): string | undefined =>
  (field as { description?: string })?.description?.toString()

const isRequired = (field: unknown) =>
  (field as OfType<string>).type !== optional.type

type ParameterType = 'query' | 'path'

class OpenApiGenerator {

  getSchema: GetRepresentation

  constructor(
    readonly config: ServerConfig & WithInfo,
    getSchema: GetRepresentation = getFieldSchema
  ) {
    this.getSchema = (field) => withoutOptional(getSchema(field))
  }

  createOpenApiSpec = (): OpenAPI.Document => withoutOptional({
    openapi: '3.0.3',
    info: this.config.info || DEFAULT_INFO,
    servers: [
      {
        url: this.config.baseUrl,
      },
    ],
    paths: mergeValues(this.config.routes.map(this.createPath)),
  })

  createParameterBaseObject = (
    field: Field<unknown>
  ): OpenAPI.ParameterBaseObject => withoutOptional({
    description: getDescription(field),
    required: isRequired(field),
    schema: this.getSchema(field),
  })

  createParameter = (
    type: ParameterType,
    name: string,
    field: Field<unknown>
  ): OpenAPI.ParameterObject => withoutOptional({
    name: name,
    in: type,
    ...this.createParameterBaseObject(field),
  })

  specToParams = (
    type: ParameterType,
    spec?: Record<string, Field<unknown>>
  ): OpenAPI.ParameterObject[] => Object.entries(spec || {}).map(
    ([name, field]) => this.createParameter(type, name, field)
  )

  createContentObject = (data: Field<unknown>): {
    [media: string]: OpenAPI.MediaTypeObject
  } => Object.fromEntries(this.config.serializationFormats.map(
    it => [it.mediaType, {
      schema: this.getSchema(data),
    }]
  ))

  createResponseObject = (response: ResponseSpec): OpenAPI.ResponseObject => withoutOptional({
    headers: response.headers && Object.fromEntries(Object.entries(response.headers.objectSpec).map(([name, value]) => [
      name,
      this.createParameterBaseObject(value),
    ])),
    description: getDescription(response) || '',
    content: response.data && this.createContentObject(response.data),
  })

  createRequestBodyObject = (data: Field<Any>): OpenAPI.RequestBodyObject => withoutOptional({
    content: this.createContentObject(data),
    required: isRequired(data),
  })

  createResponses = (spec: Route['response']) => {
    const result: Record<string, OpenAPI.ResponseObject> = {}
    if (isResponsesSpec(spec)) {
      spec.variants.forEach((it) => {
        result[it.objectSpec.statusCode.constant.toString()] = this.createResponseObject(it.objectSpec)
      })
    } else {
      result[spec.statusCode.constant.toString()] = this.createResponseObject(spec)
    }
    return result
  }

  createOperationObject = (route: Route): OpenAPI.OperationObject => withoutOptional({
    parameters: [
      ...this.specToParams('query', route.request.queryParams?.objectSpec),
      ...this.specToParams('path', route.request.pathParams.getObjectSpec()),
    ],
    requestBody: route.request.data && this.createRequestBodyObject(route.request.data),
    responses: this.createResponses(route.response),
  })

  createPathString = (pathParams: typeof $): string =>
    pathParams.getSegments().map(it => it.field ? `{${it.key}}` : it.key || '').join('')

  createPath = (route: Route): [string, OpenAPI.PathItemObject] => [this.createPathString(route.request.pathParams), {
    [(route.request.method.constant as string).toLowerCase()]: this.createOperationObject(route),
  }]

}

export default (...params: ConstructorArgs<typeof OpenApiGenerator>): Json =>
  new OpenApiGenerator(...params).createOpenApiSpec() as unknown as Json
