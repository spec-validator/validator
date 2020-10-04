import { Field } from '../core'
import { Json } from '../Json';
import { WithRegExp, WithStringInputSupport } from '../WithStringInputSupport';

type Params = {
  description?: string
}

class BooleanField implements Field<boolean>, WithStringInputSupport {
  private params?: Params;

  constructor(params?: Params) {
    this.params = params;
  }
  getFieldWithRegExp(): Field<unknown> & WithRegExp {
    return new BooleanFieldWithRegExp(this.params)
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
      description: this.params?.description
    }
  }
}

class BooleanFieldWithRegExp extends BooleanField implements WithRegExp {

  regex() {
    return /true|false|1|0/
  }

  validate(value: any): boolean {
    if (value === 'true' || value === '1') {
      value = true
    }
    if (value === 'false' || value === '0') {
      value = false
    }
    return super.validate(value)
  }

}

const booleanField = (params?: Params): BooleanField => new BooleanField(params)

export default booleanField;
