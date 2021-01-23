import { Field } from './core'

export interface StringBasedField<
  DeserializedType,
> extends Field<DeserializedType> {
  serialize(deserialized: DeserializedType): string
}

export interface WithStringSupport<
  DeserializedType,
  StrField extends StringBasedField<DeserializedType>
> extends Field<DeserializedType> {
  getStringField(): StrField
}
