import { Field, withErrorDecoration } from '../core'
import { Json } from '../Json'

const FieldSymbol = Symbol('@validator/fields.ArrayField')

class ArrayField<T> implements Field<T[]> {
  constructor(readonly itemField: Field<T>) {}
  type = FieldSymbol

  validate(value: any): T[] {
    if (!Array.isArray(value)) {
      throw 'Not an array'
    }
    return value.map(
      (it, index) => withErrorDecoration(index, () => this.itemField.validate(it))
    )
  }
  serialize(deserialized: T[]): Json {
    return deserialized.map(
      (it, index) => withErrorDecoration(index, () => this.itemField.serialize(it) as unknown as Json)
    )
  }
}

const arrayField = <T> (
  itemField: Field<T>,
): ArrayField<T> =>
    new ArrayField(itemField)

arrayField.type = FieldSymbol

export default arrayField
