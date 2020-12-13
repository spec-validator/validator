import { Field, Json, FieldDecorator } from '@validator/validator'
import { Any } from '@validator/validator/util-types'
const FieldSymbol = Symbol('@open-api-endpoint/WithDoc')

type Example<T extends Any> = {
  value: T,
  summary: string
}

type Doc<T extends Any> = {
  description?: string,
  examples?: Record<string, Example<T>>
}

class WithDoc<T extends Any> implements Field<T>, FieldDecorator {
  constructor(readonly innerField: Field<T>, private readonly doc: Doc<T>) {}
  type = FieldSymbol

  validate(value: any): T {
    return this.innerField.validate(value)
  }
  serialize(deserialized: T): Json {
    return this.innerField.serialize(deserialized)
  }
}

const withDoc = <T extends Any> (innerField: Field<T>, doc: Doc<T>): Field<T> =>
  new WithDoc(innerField, doc)

withDoc.type = FieldSymbol

export default withDoc
