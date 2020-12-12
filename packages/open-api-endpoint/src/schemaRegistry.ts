import { Field } from '@validator/validator'

type Schema = {
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object',
  format?: string, // for any string based field
  pattern?: string,
  default?: unknown
  oneOf?: unknown[] // for union field
}

type WithType = {
  type: symbol
}

const schemaRegistry = (mappingTuples: [WithType, (field: Field<unknown>) => Schema][]):
  Record<symbol, (field: Field<unknown>) => Schema> =>
  Object.fromEntries(mappingTuples.map(it => [it[0].type, it[1]]))

export default schemaRegistry
