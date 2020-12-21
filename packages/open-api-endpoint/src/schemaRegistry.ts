import { OpenAPIV3 as OpenAPI } from 'openapi-types'

import {
  arrayField, booleanField, choiceField, numberField, objectField, optional, stringField, unionField, withDefault,
} from '@validator/validator/fields'
import createRegistry, { $ } from '@validator/validator/registry'
import withDoc from './withDoc'
import { Primitive } from '@validator/validator/Json'

/*
type Schema = {
  title?: string, // name of the field
  type?: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object',
  format?: string, // for any string based field
  pattern?: string, // for regex in string fields
  default?: unknown,
  oneOf?: unknown[], // for union field (excludes type)
  enum?: unknown[], // for choice field (for multitype choices use oneOf + type + enum since enums must be of type)
  // array type
  items?: Schema, // for inner items' schema
  // object type
  properties?: Record<string, Schema>, // for type object
  required?: string[], // for type object (required is an object level field not a property field)
  additionalProperties?: boolean // if extra, unspecified keys are allowed
}
*/

const getSchema = createRegistry([
  $(arrayField, (field, requestSchema): OpenAPI.ArraySchemaObject => ({
    items: requestSchema(field.itemField),
    type: 'array'
  })),
  $(booleanField, (): OpenAPI.NonArraySchemaObject  => ({
    type: 'boolean',
  })),
  $(choiceField, (field): OpenAPI.NonArraySchemaObject => ({
    enum: field.choices as Primitive[] // Do type splitting into oneOfs
  })),
  $(numberField, (field): OpenAPI.NonArraySchemaObject => ({
    type: field.params?.canBeFloat ? 'number' : 'integer'
  })),
  $(objectField, (field, requestSchema): OpenAPI.NonArraySchemaObject  => ({
    properties: Object.fromEntries(
      Object.entries(field.objectSpec).map(([key, value]) => [key, requestSchema(value)] )
    ),
    required: Object.entries(field.objectSpec).filter(
      ([_, value]) => (value as any).type !== optional.type
    ).map(([key, _]) => key)
  })),
  $(optional, (field, requestSchema): OpenAPI.SchemaObject  => ({
    ...requestSchema(field)
  })),
  $(stringField, (field): OpenAPI.NonArraySchemaObject => ({
    type: 'string',
    pattern: field.regex.source
  })),
  $(unionField, (field, requestSchema): OpenAPI.SchemaObject => ({
    oneOf: field.variants.map(requestSchema)
  })),
  $(withDefault, (field, requestSchema): OpenAPI.SchemaObject => ({
    ...requestSchema(field.innerField),
    default: field.defaultValue
  })),
  $(withDoc, (field, requestSchema): OpenAPI.SchemaObject  => ({
    ...requestSchema(field.innerField),
    description: field.doc
  })),
])

export default getSchema
