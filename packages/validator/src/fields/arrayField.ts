import { Field, withErrorDecoration } from '../core'
import { declareField2, OfType } from '../registry'
import { Json } from '../Json'

interface ArrayField<T> extends Field<T[]> {
  readonly itemField: Field<T>
}

const arrayField = <T>(itemField: Field<T>): ArrayField<T> => ({
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
    )
})

const t = '@validator/fields.ArrayField' as const
type Type = OfType<typeof t>
export default declareField2(t, arrayField) as
  (<T> (itemField: Field<T>) => ArrayField<T> & Type) & Type
