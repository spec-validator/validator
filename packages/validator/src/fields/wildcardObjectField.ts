import { declareField, Field } from '../core'
import { Json } from '@spec-validator/utils/Json'

export type WildcardObjectField = Field<Record<string, Json>>

// TODO
export default declareField('@spec-validator/validator/fields/wildcardObjectField', (): WildcardObjectField => ({
  validate: (value: any): Record<string, Json> => JSON.parse(value),
  serialize: (deserialized: Json): Json => deserialized,
}))
