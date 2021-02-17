import { Field, withErrorDecoration, declareField } from '../core'
import { Json } from '@spec-validator/utils/Json'

export interface ArrayField<T> extends Field<T[]> {
  readonly itemField: Field<T>,
}

export default declareField('@spec-validator/validator/fields/arrayField', <T>(itemField: Field<T>): ArrayField<T> => ({
  itemField,
  validate: (value: any): T[] => {
    if (!Array.isArray(value)) {
      throw 'Not an array'
    }
    return value.map(
      (it, index) => withErrorDecoration(index, () => itemField.validate(it))
    )
  },
  serialize: (deserialized: T[]): Json =>
    deserialized.map(
      (it, index) => withErrorDecoration(index, () => itemField.serialize(it) as unknown as Json)
    ),
}))
