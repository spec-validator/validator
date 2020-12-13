import { Field, FieldDecorator } from '../core'
import { Json } from '../Json'
import { Any } from '../util-types'
const FieldSymbol = Symbol('@validator/fields.WithDefault')

class WithDefault<T extends Any> implements Field<T>, FieldDecorator {
  constructor(readonly innerField: Field<T>, readonly defaultValue: T) {}
  type = FieldSymbol

  validate(value: any): T {
    if (value === undefined) {
      value = this.defaultValue
    }
    return this.innerField.validate(value)
  }
  serialize(deserialized: T): Json {
    return this.innerField.serialize(deserialized)
  }
}

const defaultValueDecor = <T extends Any> (innerField: Field<T>, defaultValue: T): Field<T> =>
  new WithDefault(innerField, defaultValue)

defaultValueDecor.type = FieldSymbol

export default defaultValueDecor
