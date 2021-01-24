import { declareField, Field, SpecUnion, TypeHint } from '../core'
import { Optional } from '@spec-validator/utils/util-types'
import { Json } from '@spec-validator/utils/Json'
import withDecor from '../withDecor'

export interface OptionalField<T> extends Field<Optional<T>> {
  readonly innerSpec: SpecUnion<T>
}

export default declareField('@spec-validator/validator/fields/optional', <
  Spec extends SpecUnion<unknown>,
  T = TypeHint<Spec>
> (
    innerSpec: Spec
  ) => withDecor(innerSpec, (fieldForSpec: Field<T>): OptionalField<T> => ({
    innerSpec: innerSpec as unknown as SpecUnion<T>,
    validate: (value: any): Optional<T> => {
      if (value === undefined) {
        return value
      }
      return fieldForSpec.validate(value)
    },
    serialize: (deserialized: Optional<T>): Json =>
      deserialized === undefined ?  undefined : fieldForSpec.serialize(deserialized),
  })))
