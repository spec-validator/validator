import { declareField, Field } from '../core'
import { Any, Optional } from '../util-types'

export interface OptionalField<T extends Any> extends Field<Optional<T>> {
  readonly innerField: Field<T>
}

export default declareField('@spec-validator/fields.Optional', <T extends Any> (
  innerField: Field<T>
): OptionalField<T> => ({
    innerField,
    validate: (value: any): Optional<T> => {
      if (value === undefined) {
        return value
      }
      return innerField.validate(value)
    },
    serialize: (deserialized: Optional<T>) =>
      deserialized === undefined ? deserialized : innerField.serialize(deserialized) as any,
  }))

