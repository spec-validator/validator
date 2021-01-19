import { declareField, Field, SpecUnion } from '../core'
import { getFieldForSpec } from '../interface'
import { Any, Optional } from '@spec-validator/utils/util-types'

export interface OptionalField<T extends Any> extends Field<Optional<T>> {
  readonly innerSpec: SpecUnion<T>
}

export default declareField('@spec-validator/validator/fields/optional', <T extends Any> (
  innerSpec: SpecUnion<T>
): OptionalField<T> => {
  const innerField = getFieldForSpec(innerSpec)
  return {
    innerSpec,
    validate: (value: any): Optional<T> => {
      if (value === undefined) {
        return value
      }
      return innerField.validate(value)
    },
    serialize: (deserialized: Optional<T>) =>
      deserialized === undefined ? deserialized : innerField.serialize(deserialized) as any,
  }
})
