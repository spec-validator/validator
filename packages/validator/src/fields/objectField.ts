import {
  Field,
  ValidatorSpec,
  validate,
  serialize,
  getParams,
} from '../core'
import { Json } from '../Json'

type Params<ExpectedType> = {
  objectSpec: ValidatorSpec<ExpectedType>,
  description?: string
}

class ObjectField<ExpectedType> implements Field<ExpectedType> {
  private params: Params<ExpectedType>

  constructor(params: Params<ExpectedType>) {
    this.params = params
  }

  validate(value: any): ExpectedType {
    if (typeof value !== 'object' || value === null) {
      throw 'Not an object'
    }
    return validate(this.params.objectSpec, value)
  }
  serialize(deserialized: ExpectedType): Json {
    return serialize(this.params.objectSpec, deserialized)
  }
  getParams() {
    return {
      description: this.params.description,
      spec: getParams(this.params.objectSpec)
    }
  }

}

const objectField = <ExpectedType> (
  objectSpec: ValidatorSpec<ExpectedType>,
  description?: string
): ObjectField<ExpectedType> => new ObjectField({
    objectSpec,
    description
  })

export default objectField
