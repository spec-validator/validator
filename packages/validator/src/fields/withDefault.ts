import { declareField, Field, SpecUnion } from '../core'
import { Any } from '@spec-validator/utils/util-types'
import withDecor from '../withDecor'

export interface WithDefault<T extends Any> extends Field<T> {
  readonly innerSpec: SpecUnion<T>,
  readonly defaultValue: T
}

export default declareField('@spec-validator/validator/fields/withDefault', <T extends Any, Spec extends SpecUnion<T>> (
  innerSpec: Spec,
  defaultValue: T
) => withDecor(innerSpec, (inner: Field<T>): WithDefault<T> => ({
    innerSpec,
    defaultValue,
    validate: (value: any): T => {
      if (value === undefined) {
        value = defaultValue
      }
      return inner.validate(value)
    },
    serialize: (deserialized: T) => inner.serialize(deserialized),
  })))
