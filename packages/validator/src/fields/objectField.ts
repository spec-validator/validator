import {
  Field,
  ValidatorSpec,
  validate,
  serialize,
  getParams,
} from '../core'
import { Json } from '../Json'

type Params<DeserializedType> = {
  objectSpec: ValidatorSpec<DeserializedType>,
  description?: string
}

class ObjectField<DeserializedType> implements Field<DeserializedType> {
  private params: Params<DeserializedType>

  constructor(params: Params<DeserializedType>) {
    this.params = params
  }

  validate(value: any): DeserializedType {
    if (typeof value !== 'object' || value === null) {
      throw 'Not an object'
    }
    return validate(this.params.objectSpec, value)
  }
  serialize(deserialized: DeserializedType): Json {
    return serialize(this.params.objectSpec, deserialized)
  }
  getParams() {
    return {
      description: this.params.description,
      spec: getParams(this.params.objectSpec)
    }
  }

}

const objectField = <DeserializedType> (
  objectSpec: ValidatorSpec<DeserializedType>,
  description?: string
): ObjectField<DeserializedType> => new ObjectField({
    objectSpec,
    description
  })

export default objectField
