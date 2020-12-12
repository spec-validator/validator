import { Field, Json, FieldDecorator } from '@validator/validator'
import { Any } from '@validator/validator/util-types'
import { merge } from '@validator/validator/utils'

const FieldSymbol = Symbol('@open-api-endpoint/WithDescription')

class WithDescription<T extends Any> implements Field<T>, FieldDecorator {
  constructor(readonly innerField: Field<T>, private readonly description: string) {}
  type = FieldSymbol

  validate(value: any): T {
    return this.innerField.validate(value)
  }
  serialize(deserialized: T): Json {
    return this.innerField.serialize(deserialized)
  }
  getParams() {
    return merge({
      description: this.description,
    }, this.innerField.getParams())
  }
}

const withDescription = <T extends Any> (innerField: Field<T>, description: string): Field<T> =>
  new WithDescription(innerField, description)

withDescription.type = FieldSymbol

export default withDescription
