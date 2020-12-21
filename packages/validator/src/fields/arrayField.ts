import { Field, withErrorDecoration } from '../core'
import { declareField, OfType } from '../registry'
import { Json } from '../Json'

class ArrayField<T> implements Field<T[]> {
  constructor(readonly itemField: Field<T>) {}

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

type Type = OfType<'@validator/fields.ArrayField'>

const field = declareField('@validator/fields.ArrayField', ArrayField) as
  (<T> (itemField: Field<T>) => ArrayField<T> & Type) & Type

export default field
