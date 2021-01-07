import { OpenAPIV3 as OpenAPI } from 'openapi-types'

import {
  arrayField, booleanField, choiceField, constantField,
  numberField, objectField, optional, stringField, unionField, wildcardObjectField, withDefault,
} from '@validator/validator/fields'
import createRegistry, { $ } from '@validator/validator/registry'
import withDoc from './withDoc'
import { Primitive } from '@validator/validator/Json'

const TYPES = ['number' as const, 'boolean'as const, 'string'as const]

const splitIntoOneOfs = (choices: readonly Primitive[]): OpenAPI.NonArraySchemaObject [] => {
  const result: OpenAPI.NonArraySchemaObject[] = []
  TYPES.forEach(type => {
    const items = choices.filter(it => typeof it === type)
    if (items.length) {
      result.push({
        type,
        enum: items,
      })
    }
  })
  return result
}

const splitOfOneOrMany = (choices: readonly Primitive[]): OpenAPI.NonArraySchemaObject => {
  const result = splitIntoOneOfs(choices)
  if (result.length === 0) {
    return {}
  } else if (result.length === 1) {
    return result[0]
  } else {
    return {
      oneOf: result,
    }
  }
}

export const BASE_PAIRS = [
  $(arrayField, (field, requestSchema): OpenAPI.ArraySchemaObject => ({
    items: requestSchema(field.itemField),
    type: 'array',
  })),
  $(booleanField, (): OpenAPI.NonArraySchemaObject  => ({
    type: 'boolean',
  })),
  $(wildcardObjectField, (): OpenAPI.NonArraySchemaObject => ({
    type: 'object',
    additionalProperties: true,
  })),
  $(choiceField, (field): OpenAPI.NonArraySchemaObject => splitOfOneOrMany(field.choices)),
  $(constantField, (field): OpenAPI.NonArraySchemaObject => splitOfOneOrMany([field.constant])),
  $(numberField, (field): OpenAPI.NonArraySchemaObject => ({
    type: field.params?.canBeFloat ? 'number' : 'integer',
  })),
  $(objectField, (field, requestSchema): OpenAPI.NonArraySchemaObject  => {
    const required = Object.entries(field.objectSpec).filter(
      ([_, value]) => (value as any).type !== optional.type && (value as any).type !== withDefault.type
    ).map(([key, _]) => key)
    const result: OpenAPI.NonArraySchemaObject = {
      type: 'object',
      additionalProperties: false,
      properties: Object.fromEntries(
        Object.entries(field.objectSpec).map(([key, value]) => [key, requestSchema(value)] )
      ),
    }
    if (required.length) {
      result.required = required
    }
    return result
  }),
  $(optional, (field, requestSchema): OpenAPI.SchemaObject  => ({
    ...requestSchema(field.innerField),
  })),
  $(stringField, (field): OpenAPI.NonArraySchemaObject => ({
    type: 'string',
    pattern: field.regex.source,
  })),
  $(unionField, (field, requestSchema): OpenAPI.SchemaObject => ({
    oneOf: field.variants.map(requestSchema),
  })),
  $(withDefault, (field, requestSchema): OpenAPI.SchemaObject => ({
    ...requestSchema(field.innerField),
    default: field.defaultValue,
  })),
  $(withDoc, (field, requestSchema): OpenAPI.SchemaObject  => ({
    ...requestSchema(field.innerField),
    description: field.doc,
  })),
]

const getSchema = createRegistry(BASE_PAIRS)

export default getSchema
