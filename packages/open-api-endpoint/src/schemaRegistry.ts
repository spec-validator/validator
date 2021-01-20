import { OpenAPIV3 as OpenAPI } from 'openapi-types'

import {
  arrayField, booleanField, choiceField, constantField, dateField,
  numberField, objectField, optional, stringField, unionField, wildcardObjectField, withDefault,
} from '@spec-validator/validator/fields'
import createRegistry, {
  FieldPair, GetRepresentation, registryDeclaration as $,
} from '@spec-validator/validator/registry'

import { headerArrayField, headerObjectField } from '@spec-validator/rest-api-server/fields'

import { Primitive } from '@spec-validator/utils/Json'

import withDoc from './withDoc'

const TYPES = ['number' as const, 'boolean' as const, 'string' as const]

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

export const BASE_PAIRS: FieldPair[] = [
  $(dateField, (field) => ({
    type: 'string',
    format: field.format,
    pattern: field.regex.source,
  })),
  ...[arrayField, headerArrayField].map(it => $(it, (field, requestSchema): OpenAPI.ArraySchemaObject => ({
    items: requestSchema(field.itemField),
    type: 'array',
  }))),
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
    type: field.canBeFloat ? 'number' : 'integer',
    minimum: field.signed ? undefined : 0,
  })),
  ...[objectField, headerObjectField].map(it =>
    $(it, (field, requestSchema): OpenAPI.NonArraySchemaObject  => {
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
    })),
  $(optional, (field, requestSchema): OpenAPI.SchemaObject  => ({
    ...requestSchema(field.innerSpec),
  })),
  $(stringField, (field): OpenAPI.NonArraySchemaObject => ({
    type: 'string',
    pattern: field.regex.source,
  })),
  $(unionField, (field, requestSchema): OpenAPI.SchemaObject => ({
    oneOf: field.variants.map(it => requestSchema(it)),
  })),
  $(withDefault, (field, requestSchema): OpenAPI.SchemaObject => ({
    ...requestSchema(field.innerSpec),
    default: field.defaultValue,
  })),
  $(withDoc, (field, requestSchema): OpenAPI.SchemaObject => ({
    ...requestSchema(field.innerField),
    description: field.doc,
  })),
]

const getSchema: GetRepresentation = createRegistry(BASE_PAIRS)

export default getSchema
