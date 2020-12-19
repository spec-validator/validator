import {
  Field,
  ValidatorSpec,
  validate,
  serialize,
} from '../core'
import { declareField } from '../docRegistry'
import { Json } from '../Json'
import { Any } from '../util-types'

class ObjectField<DeserializedType extends Record<string, Any>> implements Field<DeserializedType> {
  constructor(readonly objectSpec: ValidatorSpec<DeserializedType>) {}

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

export default declareField('@validator/fields.ObjectField', ObjectField) as
<DeserializedType extends Record<string, Any>> (
  objectSpec: ValidatorSpec<DeserializedType>,
) => ObjectField<DeserializedType>
