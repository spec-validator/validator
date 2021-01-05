import { OpenAPIV3 as OpenAPI } from 'openapi-types'

import {
  arrayField, booleanField, choiceField, numberField, objectField, optional, stringField, unionField, withDefault,
} from '@validator/validator/fields'
import createRegistry, { $ } from '@validator/validator/registry'
import withDoc from './withDoc'
import { Primitive } from '@validator/validator/Json'

const splitIntoOnOfs = (choices: readonly Primitive[]): OpenAPI.NonArraySchemaObject [] => {
  const numbers = choices.filter(it => typeof it === 'number')
  const booleans = choices.filter(it => typeof it === 'boolean')
  const strings = choices.filter(it => typeof it === 'string')

  const result: OpenAPI.NonArraySchemaObject[] = []
  if (numbers) {
    result.push({
      type: 'number',
      enum: numbers
    })
  }
  if (booleans) {
    result.push({
      type: 'boolean',
      enum: booleans
    })
  }
  if (strings) {
    result.push({
      type: 'string',
      enum: strings
    })
  }
  return result
}

const splitOfOneOrMany = (choices: readonly Primitive[]): OpenAPI.NonArraySchemaObject => {
  const result = splitIntoOnOfs(choices)
  if (result.length === 0) {
    return {}
  } else if (result.length === 1) {
    return result[0]
  } else {
    return {
      oneOf: result
    }
  }
}

export const BASE_PAIRS = [
  $(arrayField, (field, requestSchema): OpenAPI.ArraySchemaObject => ({
    items: requestSchema(field.itemField),
    type: 'array'
  })),
  $(booleanField, (): OpenAPI.NonArraySchemaObject  => ({
    type: 'boolean',
  })),
  $(choiceField, (field): OpenAPI.NonArraySchemaObject => splitOfOneOrMany(field.choices)),
  $(numberField, (field): OpenAPI.NonArraySchemaObject => ({
    type: field.params?.canBeFloat ? 'number' : 'integer'
  })),
  $(objectField, (field, requestSchema): OpenAPI.NonArraySchemaObject  => ({
    properties: Object.fromEntries(
      Object.entries(field.objectSpec).map(([key, value]) => [key, requestSchema(value)] )
    ),
    required: Object.entries(field.objectSpec).filter(
      ([_, value]) => (value as any).type !== optional.type && (value as any).type !== withDefault.type
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
]

const getSchema = createRegistry(BASE_PAIRS)

export default getSchema
