import { Field } from '../core'
import { declareField } from '../registry'
import { Json } from '../Json'

export type WildcardObjectField = Field<Record<string, Json>>

// TODO
export default declareField('@validator/fields.WildcardObjectField', (): WildcardObjectField => ({
  validate: (value: any): Record<string, Json> => JSON.parse(value),
  serialize: (deserialized: Json): Json => deserialized,
}))
