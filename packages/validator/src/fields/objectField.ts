import {
  Field,
  ValidatorSpec,
  validate,
  serialize,
} from '../core'
import { Json } from '../Json'
import { Any } from '../util-types'

const FieldSymbol = Symbol('@validator/fields.ObjectField')

class ObjectField<DeserializedType extends Record<string, Any>> implements Field<DeserializedType> {
  constructor(readonly objectSpec: ValidatorSpec<DeserializedType>) {}
  type = FieldSymbol

  validate(value: any): DeserializedType {
    if (typeof value !== 'object' || value === null) {
      throw 'Not an object'
    }
    return validate(this.objectSpec, value) as DeserializedType
  }
  serialize(deserialized: DeserializedType): Json {
    return serialize(this.objectSpec, deserialized as any)
  }
}

const objectField = <DeserializedType extends Record<string, Any>> (
  objectSpec: ValidatorSpec<DeserializedType>,
): ObjectField<DeserializedType> => new ObjectField(objectSpec)

objectField.type = FieldSymbol

export default objectField
