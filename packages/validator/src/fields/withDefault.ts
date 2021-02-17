import { declareField, Field, SpecUnion, TypeHint } from '../core'
import withDecor from '../withDecor'

export interface WithDefault<T> extends Field<T> {
  readonly innerSpec: SpecUnion,
  readonly defaultValue: T
}

export default declareField('@spec-validator/validator/fields/withDefault', <
  Spec extends SpecUnion,
> (
    innerSpec: Spec,
    defaultValue: TypeHint<Spec>
  ) => withDecor(innerSpec, (inner: Field<TypeHint<Spec>>): WithDefault<TypeHint<Spec>> => ({
    innerSpec,
    defaultValue,
    validate: (value: any): TypeHint<Spec> => {
      if (value === undefined) {
        value = defaultValue
      }
      return inner.validate(value)
    },
    serialize: (deserialized: TypeHint<Spec>) => inner.serialize(deserialized),
  })))
