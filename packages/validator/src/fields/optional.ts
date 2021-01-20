import { declareField, Field, SpecUnion } from '../core'
import { getFieldForSpec } from '../interface'
import { Any, Optional } from '@spec-validator/utils/util-types'

export interface OptionalField<T extends Any, Spec extends SpecUnion<T>> extends Field<Optional<T>> {
  readonly innerSpec: Spec
}

export default declareField('@spec-validator/validator/fields/optional', <T extends Any, Spec extends SpecUnion<T>> (
  innerSpec: Spec
): OptionalField<T, Spec> => {
  const innerField = getFieldForSpec(innerSpec) as Field<T>
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
