import { OpenAPIV3 as OpenAPI } from 'openapi-types'

import { ServerConfig, Route } from '@validator/rest-api-server'
import { Field } from '@validator/validator'
import { GetRepresentation, OfType } from '@validator/validator/registry'

import getFieldSchema from './schemaRegistry'
import { optional } from '@validator/validator/fields'

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

class OpenApiGenerator {

  constructor(
    readonly config: ServerConfig & WithInfo,
    readonly routes: Route[],
    readonly getSchema: GetRepresentation = getFieldSchema
  ) {}

  createOpenApiSpec(): OpenAPI.Document {
    return {
      openapi: '3.0.3',
      info: this.config.info,
      servers: [
        {
          url: this.config.baseUrl
        }
      ],
      paths: mergeValues(this.routes.map(this.createPath))
    }
  }

  createParameter(
    type: 'query' | 'path',
    name: string,
    field: Field<unknown>
  ): OpenAPI.ParameterObject {
    return {
      name: name,
      in: type,
      description: (field as any)?.description,
      required: !(field as any)?.isOptional,
      schema: this.getSchema(field)
    }
  }

  specToParams(
    type: 'query' | 'path',
    spec?: Record<string, Field<unknown>>
  ): OpenAPI.ParameterObject[] {
    return Object.entries(spec || {}).map(
      ([name, field]) => this.createParameter(type, name, field)
    )
  }

  createOperationObject(route: Route): OpenAPI.OperationObject {
    return {
      parameters: [
        ...this.specToParams('query', route.request.queryParams?.objectSpec || {}),
        ...this.specToParams('path', route.request.pathParams.getObjectSpec())
      ],
      requestBody: route.request.data && {
      // TODO: inject media type from server configs
        content: { 'application/json': {
          schema: this.getSchema(route.request.data)
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
    }
  }

  createPath(route: Route): [string, OpenAPI.PathItemObject] {
    return [route.request.pathParams.toString(), {
      [(route.request.method.constant as string).toLowerCase()]: this.createOperationObject(route)
    }]
  }

}
