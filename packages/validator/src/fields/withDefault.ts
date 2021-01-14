import { declareField, Field, SpecUnion } from '../core'
import { getFieldForSpec } from '../interface'
import { Any } from '@spec-validator/utils/util-types'

export interface WithDefault<T extends Any> extends Field<T> {
  readonly innerSpec: SpecUnion<T>,
  readonly defaultValue: T
}

export default declareField('@spec-validator/fields.WithDefault', <T extends Any> (
  innerSpec: SpecUnion<T>,
  defaultValue: T
): WithDefault<T> => {
  const innerField = getFieldForSpec(innerSpec)
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
