import { Field, withErrorDecoration } from '../core'
import { declareField2, OfType } from '../registry'
import { Json } from '../Json'

const t = '@validator/fields.ArrayField' as const

interface ArrayField<T> extends Field<T[]>, OfType<typeof t> {
  readonly itemField: Field<T>,
}

const arrayField = <T>(itemField: Field<T>): ArrayField<T> => ({
  itemField,
  type: t,
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

type Type = OfType<typeof t>
export default declareField2(t, arrayField) as
  (<T> (itemField: Field<T>) => ArrayField<T> & Type) & Type
