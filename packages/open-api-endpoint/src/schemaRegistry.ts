import { OpenAPIV3 as OpenAPI } from 'openapi-types'

import { Field } from '@validator/validator'
import {
  arrayField, booleanField, choiceField, numberField, objectField, optional, stringField, unionField, withDefault
} from '@validator/validator/fields'

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

type WithType = {
  type: symbol
}

type Mapping = Record<symbol, (field: Field<unknown>) => OpenAPI.SchemaObject>

type MappingTuple = [WithType, (mapping: MappingTuple, field: Field<unknown>) => OpenAPI.SchemaObject]

const mappingTuples: MappingTuple[] = [
  [arrayField, (mapping, field) => ({})],
  [booleanField, (mapping, field) => ({})],
  [choiceField, (mapping, field) => ({})],
  [numberField, (mapping, field) => ({})],
  [objectField, (mapping, field) => ({})],
  [optional, (mapping, field) => ({})],
  [stringField, (mapping, field) => ({})],
  [unionField, (mapping, field) => ({})],
  [withDefault, (mapping, field) => ({})]
]

export const getSchema = (mapping: MappingTuple, field: Field<unknown>): OpenAPI.SchemaObject =>
  mapping[field.type as any] as any

const schemaRegistry = (mappingTuples: MappingTuple[]):Mapping =>
  Object.fromEntries(mappingTuples.map(it => [it[0].type, it[1]]))

export default schemaRegistry
