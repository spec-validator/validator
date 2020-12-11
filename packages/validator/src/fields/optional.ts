import { Field, FieldDecorator } from '../core'
import { Json } from '../Json'
import { Any, Optional } from '../util-types'
import { merge } from '../utils'

const FieldSymbol = Symbol('@validator/fields.Optional')

class OptionalValueDecorator<T extends Any> implements Field<Optional<T>>, FieldDecorator {
  constructor(readonly innerField: Field<T>) {}
  type = FieldSymbol

  validate(value: any): Optional<T> {
    if (value === undefined) {
      return value
    }
    return this.innerField.validate(value)
  }
  serialize(deserialized: Optional<T>): Json {
    return deserialized === undefined ? deserialized : this.innerField.serialize(deserialized) as any
  }
  getParams() {
    return merge(
      { isOptional: true },
      this.innerField.getParams()
    )
  }

}

const optional = <T extends Any> (
  innerField: Field<T>
): Field<Optional<T>> => new OptionalValueDecorator(innerField)

optional.type = FieldSymbol

export default optional
