import { Field } from '../core'
import { Json } from '../Json'
import { Any, Optional } from '../util-types'
import { merge } from '../utils'

class OptionalValueDecorator<T extends Any> implements Field<Optional<T>> {
  private innerField: Field<T>;

  constructor(innerField: Field<T>) {
    this.innerField = innerField
  }

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

const optionalValueDecor = <T extends Any> (
  innerField: Field<T>
): Field<Optional<T>> => new OptionalValueDecorator(innerField)

export default optionalValueDecor
