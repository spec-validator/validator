import { OpenAPIV3 as OpenAPI } from 'openapi-types'

import { ServerConfig, Route } from '@validator/rest-api-server'
import { Field } from '@validator/validator'
import { optional } from '@validator/validator/fields'
import { GetRepresentation, OfType } from '@validator/validator/registry'

import getFieldSchema from './schemaRegistry'
import { Any, ConstructorArgs } from '@validator/validator/util-types'
import { isResponsesSpec, ResponseSpec } from '@validator/rest-api-server/route'

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

type WithInfo = {
  info: {
    title: string,
    version: string
  }
}

const getDescription = (field: unknown) =>
  (field as { description?: string })?.description?.toString() || ''

const isRequired = (field: unknown) =>
  (field as OfType<string>).type !== optional.type

type ParameterType = 'query' | 'path'

class OpenApiGenerator {

  constructor(
    readonly config: ServerConfig & WithInfo,
    readonly routes: Route[],
    readonly getSchema: GetRepresentation = getFieldSchema
  ) {}

  createOpenApiSpec = (): OpenAPI.Document => ({
    openapi: '3.0.3',
    info: this.config.info,
    servers: [
      {
        url: this.config.baseUrl
      }
    ],
    paths: mergeValues(this.routes.map(this.createPath))
  })

  createParameterBaseObject = (
    field: Field<unknown>
  ): OpenAPI.ParameterBaseObject => ({
    description: getDescription(field),
    required: isRequired(field),
    schema: this.getSchema(field)
  })

  createParameter = (
    type: ParameterType,
    name: string,
    field: Field<unknown>
  ): OpenAPI.ParameterObject => ({
    name: name,
    in: type,
    ...this.createParameterBaseObject(field)
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
      schema: this.getSchema(data)
    }]
  ))

  createResponseObject = (response: ResponseSpec): OpenAPI.ResponseObject => ({
    headers: response.headers && Object.fromEntries(Object.entries(response.headers).map(([name, value]) => [
      name,
      this.createParameterBaseObject(value)
    ])),
    description: getDescription(response),
    content: response.data && this.createContentObject(response.data),
  })

  createRequestBodyObject = (data: Field<Any>): OpenAPI.RequestBodyObject => ({
    content: this.createContentObject(data),
    required: isRequired(data)
  })

  createResponses = (spec: Route['response']) => {
    const result: Record<string, OpenAPI.ResponseObject> = {}
    if (isResponsesSpec(spec)) {
      spec.variants.forEach(it => {
        result[it.statusCode] = this.createResponseObject(it)
      })
    } else {
      this.createResponseObject(spec)
    }
    return result
  }

  createOperationObject = (route: Route): OpenAPI.OperationObject => ({
    parameters: [
      ...this.specToParams('query', route.request.queryParams?.objectSpec),
      ...this.specToParams('path', route.request.pathParams.getObjectSpec())
    ],
    requestBody: route.request.data && this.createRequestBodyObject(route.request.data),
    responses: this.createResponses(route.response)
  })

  createPath = (route: Route): [string, OpenAPI.PathItemObject] => [route.request.pathParams.toString(), {
    [(route.request.method.constant as string).toLowerCase()]: this.createOperationObject(route)
  }]

}

export default (...params: ConstructorArgs<typeof OpenApiGenerator>): OpenAPI.Document =>
  new OpenApiGenerator(...params).createOpenApiSpec()
