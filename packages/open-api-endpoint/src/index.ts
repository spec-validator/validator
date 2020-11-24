import { ServerConfig, Route } from '@validator/rest-api-server'
import { Field } from '@validator/validator'
import { ValidatorSpec } from '@validator/validator/core'
import { Segment } from '@validator/validator/segmentChain'

import { OpenAPIV3 as OpenAPI } from 'openapi-types'

// https://swagger.io/specification/

const createParameter = (type: 'query' | 'path', name: string, field: Field<unknown>): OpenAPI.ParameterObject => {
  return {
    name: name,
    in: type,
    description?: string;
    required?: boolean;
    allowEmptyValue?: boolean;
    style?: string;
    explode?: boolean;
    schema?: SchemaObject;
    examples?: { [media: string]: ExampleObject };
    content?: { [media: string]: MediaTypeObject };
  }
}


const createRoute = (segment: Segment<unknown>): string => {
  return "//"
}

const createPathParams = (segment: Segment<unknown>): ValidatorSpec<Record<string, unknown>> => {
  return {}
}

const specToParams = (type: 'query' | 'path', spec?: ValidatorSpec<Record<string, unknown>>): OpenAPI.ParameterObject[] =>
  Object.entries(spec || {}).map(
    ([name, field]) => createParameter(type, name, field)
  )

const createPath = (route: Route): [string, OpenAPI.PathItemObject] => [createRoute(route.request.pathParams), {
  summary: 'FILL ME',
  [route.request.method.toLowerCase()]: {
    summary: 'FILL ME',
    parameters: [
      ...specToParams('query', route.request.queryParams),
      ...specToParams('path', createPathParams(route.request.pathParams))
    ],
    requestBody: {
      description?: string;
      content: { [media: string]: MediaTypeObject };
      required: boolean;
    },
    responses: {
      code: {
        description: string;
        headers?: { [header: string]: HeaderObject };
        content?: { [media: string]: MediaTypeObject };
        links?: { [link: string]:  LinkObject };
      }
    };
  }
}]

const createOpenApiSpec = (
  config: ServerConfig,
  routes: Route[],
): OpenAPI.Document => ({
  openapi: '3.0.3',
  info: {
    title: 'FILL ME',
    version: 'FILL ME'
  },
  servers: [
    {
      url: config.baseUrl
    }
  ],
  paths: Object.fromEntries(routes.map(createPath))
})

export default createOpenApiSpec
