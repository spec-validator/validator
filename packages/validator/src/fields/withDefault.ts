import { Field, FieldDecorator } from '../core'
import { Json } from '../Json'
import { Any } from '../util-types'
import { merge } from '../utils'

class DefaultFieldDecorator<T extends Any> implements Field<T>, FieldDecorator {
  constructor(readonly innerField: Field<T>, private readonly defaultValue: T) {}

  validate(value: any): T {
    if (value === undefined) {
      value = this.defaultValue
    }
    return this.innerField.validate(value)
  }
  serialize(deserialized: T): Json {
    return this.innerField.serialize(deserialized)
  }
  getParams() {
    return merge({
      defaultValue: this.defaultValue,
    }, this.innerField.getParams())
  }
}

const defaultValueDecor = <T extends Any> (innerField: Field<T>, defaultValue: T): Field<T> =>
  new DefaultFieldDecorator(innerField, defaultValue)

export default defaultValueDecor
