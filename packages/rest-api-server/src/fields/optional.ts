import { Any, Optional } from '@spec-validator/utils/util-types'
import { Field, declareField } from '@spec-validator/validator/core'
import { FieldWithStringInputSupport } from '@spec-validator/validator/fields/segmentField'

export interface OptionalHeaderField<T extends Any> extends Field<Optional<T>> {
  readonly innerField: FieldWithStringInputSupport<T>
}

export default declareField('@spec-validator/rest-api/fields/optional', <T extends Any> (
  innerField: FieldWithStringInputSupport<T>
): OptionalHeaderField<T> => {
  const realField = innerField.getFieldWithRegExp()
  return {
    innerField,
    validate: (value: any): Optional<T> => {
      if (value === undefined) {
        return value
      }
      return realField.validate(value)
    },
    serialize: (deserialized: Optional<T>) =>
      deserialized === undefined ? deserialized : realField.serialize(deserialized) as any,
  }
})
