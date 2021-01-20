import { declareField, Field, SpecUnion } from '../core'
import { getFieldForSpec } from '../interface'
import { Any } from '@spec-validator/utils/util-types'

export interface WithDefault<T extends Any, Spec extends SpecUnion<T>> extends Field<T> {
  readonly innerSpec: Spec,
  readonly defaultValue: T
}

export default declareField('@spec-validator/validator/fields/withDefault', <T extends Any, Spec extends SpecUnion<T>> (
  innerSpec: Spec,
  defaultValue: T
): WithDefault<T, Spec> => {
  const innerField = getFieldForSpec(innerSpec) as Field<T>
  return {
    innerSpec,
    defaultValue,
    validate: (value: any): T => {
      if (value === undefined) {
        value = defaultValue
      }
      return innerField.validate(value)
    },
    serialize: (deserialized: T) => innerField.serialize(deserialized),
  }
})
