import { declareField, Field, SpecUnion, TypeHint } from '../core'
import withDecor from '../withDecor'

export interface WithDefault<T> extends Field<T> {
  readonly innerSpec: SpecUnion,
  readonly defaultValue: T
}

export default declareField('@spec-validator/validator/fields/withDefault', <
  Spec extends SpecUnion,
  T=TypeHint<Spec>
> (
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
