import { Field } from '../core'
import { field } from '../registry'
import { Json } from '../Json'

export type WildcardObjectField = Field<Record<string, Json>>

export default field('@validator/fields.WildcardObjectField', (): WildcardObjectField => ({
  validate: (value: any): Record<string, Json> => JSON.parse(value),
  serialize: (deserialized: Json): Json => deserialized
}))

