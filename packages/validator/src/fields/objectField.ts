import {
  Field,
  ValidatorSpec,
  validate,
  serialize,
  getParams,
} from '../core'
import { Json } from '../Json'

class ObjectField<DeserializedType> implements Field<DeserializedType> {
  private objectSpec: ValidatorSpec<DeserializedType>

  constructor(objectSpec: ValidatorSpec<DeserializedType>) {
    this.objectSpec = objectSpec
  }

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

const objectField = <DeserializedType> (
  objectSpec: ValidatorSpec<DeserializedType>,
): ObjectField<DeserializedType> => new ObjectField(objectSpec)

export default objectField
