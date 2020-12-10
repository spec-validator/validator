import {
  Field,
  ValidatorSpec,
  validate,
  serialize,
  getParams,
} from '../core'
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
  getParams() {
    return {
      spec: getParams(this.objectSpec),
    }
  }

}

const objectField = <DeserializedType extends Record<string, Any>> (
  objectSpec: ValidatorSpec<DeserializedType>,
): ObjectField<DeserializedType> => new ObjectField(objectSpec)

export default objectField
