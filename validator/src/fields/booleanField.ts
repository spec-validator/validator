import { Field, Json } from '../core'

type Params = {
  description?: string
}

class BooleanField implements Field<boolean> {
  private params: Params;

  constructor(params: Params) {
    this.params = params;
  }

  validate(value: any): boolean {
    if (value !== true && value !== false) {
      throw 'Not a boolean'
    }
    return value
  }
  serialize(deserialized: boolean): Json {
    return deserialized
  }
  getParams() {
    return {
      description: this.params.description
    }
  }

}

const booleanField = (params: Params): Field<boolean> => new BooleanField(params)

export default booleanField;
