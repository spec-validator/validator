import { Field } from '../core'
import { field } from '../registry'
import { Any, Optional } from '../util-types'

export interface OptionalField<T extends Any> extends Field<T> {
  readonly innerField: Field<T>
}

export default field('@validator/fields.Optional', <T extends Any> (
  innerField: Field<T>
): OptionalField<T> => ({
    innerField,
    validate: (value: any): T => {
      if (value === undefined) {
        return value
      }
      return innerField.validate(value)
    },
    serialize: (deserialized: Optional<T>) =>
      deserialized === undefined ? deserialized : innerField.serialize(deserialized) as any
  }))

