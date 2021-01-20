import { declareField, Field, SpecUnion } from '../core'
import { Any, Optional } from '@spec-validator/utils/util-types'
import { Json } from '@spec-validator/utils/Json'
import withDecor from '../withDecor'

export interface OptionalField<T extends Any> extends Field<Optional<T>> {
  readonly innerSpec: SpecUnion<T>
}

export default declareField('@spec-validator/validator/fields/optional', <T extends Any, Spec extends SpecUnion<T>> (
  innerSpec: Spec & SpecUnion<T>
) => withDecor(innerSpec, (fieldForSpec: Field<T>): OptionalField<T> => ({
    innerSpec,
    validate: (value: any): Optional<T> => {
      if (value === undefined) {
        return value
      }
      return fieldForSpec.validate(value)
    },
    serialize: (deserialized: Optional<T>): Json =>
      deserialized === undefined ?  undefined : fieldForSpec.serialize(deserialized),
  })))
