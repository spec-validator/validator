import { ServerConfig, Route } from '@validator/rest-api-server'
import { Field } from '@validator/validator'
import { Segment } from '@validator/validator/segmentChain'

import { OpenAPIV3 as OpenAPI } from 'openapi-types'

const createParameter = (name: string, field: Field<unknown>): OpenAPI.ParameterObject => {
  return {
    name: name,
    in: 'qeurty', //'query' | 'path';
    description?: string;
    required?: boolean;
    allowEmptyValue?: boolean;
    style?: string;
    explode?: boolean;
    allowReserved?: boolean;
    schema?: SchemaObject;
    example?: any;
    examples?: { [media: string]: ExampleObject };
    content?: { [media: string]: MediaTypeObject };
  }
}


const createRoute = (segment: Segment<unknown>): string => {
  return "//"
}


const createPath = (route: Route): [string, OpenAPI.PathItemObject] => [createRoute(route.request.pathParams), {
  summary: 'FILL ME',
  [route.request.method.toLowerCase()]: {
    summary: 'FILL ME',
    parameters: [
      ...Object.entries(route.request.queryParams || {}).map(([name, field]) => createParameter(name, field))
    ],
    requestBody?: {
      description?: string;
      content: { [media: string]: MediaTypeObject };
      required?: boolean;
    }
    responses?: {
      code: {
        description: string;
        headers?: { [header: string]: HeaderObject };
        content?: { [media: string]: MediaTypeObject };
        links?: { [link: string]:  LinkObject };
      }
    };
  }
}]

const createOpenApiRoute = (
  config: Partial<ServerConfig>,
  routes: Route[],
): OpenAPI.Document => ({
  openapi: 'FILL ME',
  info: {
    title: 'FILL ME',
    version: 'FILL ME'
  },
  servers: [
    {
      url: 'FILL ME'
    }
  ],
  paths: Object.fromEntries(routes.map(createPath))
})

export default createOpenApiRoute
