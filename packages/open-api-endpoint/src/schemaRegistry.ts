import { OpenAPIV3 as OpenAPI } from 'openapi-types'

import {
  arrayField, booleanField, choiceField, numberField, objectField, optional, stringField, unionField, withDefault,
} from '@validator/validator/fields'
import createRegistry, { $ } from '@validator/validator/registry'
import withDoc from './withDoc'

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

const getSchema = createRegistry<OpenAPI.SchemaObject>([
  $(arrayField, (field) => ({})),
  $(booleanField, (field) => ({})),
  $(choiceField, (field) => ({})),
  $(numberField, (field) => ({})),
  $(objectField, (field) => ({})),
  $(optional, (field) => ({})),
  $(stringField, (field) => ({})),
  $(unionField, (field) => ({})),
  $(withDefault, (field) => ({})),
  $(withDoc, (field) => ({})),
])

export default getSchema
