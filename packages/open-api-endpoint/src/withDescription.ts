import { Field, Json } from '@validator/validator'
import { Any } from '@validator/validator/util-types'
import { merge } from '@validator/validator/utils'

class WithDescription<T extends Any> implements Field<T> {
  private innerField: Field<T>;
  private description: string;

  constructor(innerField: Field<T>, description: string) {
    this.innerField = innerField
    this.description = description
  }

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

export default withDescription
