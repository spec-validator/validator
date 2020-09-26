import { Field, Json } from '../core'
import { WithRegExp } from '../segmentChain';

type Params = {
  description?: string
}

class BooleanField implements Field<boolean>, WithRegExp {
  private params: Params;

  constructor(params: Params) {
    this.params = params;
  }
  regex() {
    return /[true|false|1|0]/
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
