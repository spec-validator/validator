import { Field } from '@validator/validator'

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

type WithType = {
  type: symbol
}

const schemaRegistry = (mappingTuples: [WithType, (field: Field<unknown>) => Schema][]):
  Record<symbol, (field: Field<unknown>) => Schema> =>
  Object.fromEntries(mappingTuples.map(it => [it[0].type, it[1]]))

export default schemaRegistry
