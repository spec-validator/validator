import { Field, Json, FieldDecorator } from '@validator/validator'
import { declareField } from '@validator/validator/registry'
import { Any } from '@validator/validator/util-types'

type Example<T extends Any> = {
  value: T,
  summary: string
}

type Doc<T extends Any> = {
  description?: string,
  examples?: Record<string, Example<T>>
}

class WithDoc<T extends Any> implements Field<T>, FieldDecorator {
  constructor(readonly innerField: Field<T>, readonly doc: Doc<T>) {}

  validate(value: any): T {
    return this.innerField.validate(value)
  }
  serialize(deserialized: T): Json {
    return this.innerField.serialize(deserialized)
  }
}

const withDoc = declareField('@validator/fields.WithDoc', WithDoc)

export default withDoc
