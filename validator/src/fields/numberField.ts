import { Field, Json } from '../core'
import { WithRegExp, WithRegExpSupport } from '../segmentChain';

type Params = {
  canBeFloat?: boolean,
  description?: string
}

class NumberField implements Field<number>, WithRegExpSupport {
  private params?: Params

  constructor(params?: Params) {
    this.params = params;
  }
  getFieldWithRegExp(): Field<unknown> & WithRegExp {
    return new NumberFieldWithRegExp(this.params)
  }

  validate(value: any): number {
    if (this.params?.canBeFloat) {
      if (typeof value !== 'number') {
        throw 'Not a float'
      }
    } else {
      if (typeof value !== 'number' || value !== Math.floor(value)) {
        throw 'Not an int'
      }
    }
    return value
  }
  serialize(deserialized: number): Json {
    return deserialized;
  }
  getParams() {
    return {
      description: this.params?.description
    }
  }
}

class NumberFieldWithRegExp extends NumberField implements WithRegExp {

  regex() {
    return /\d+/
  }

  validate(value: any) {
    return super.validate(Number.parseFloat(value));
  }

}

const numberField = (params?: Params): Field<number> & WithRegExpSupport => new NumberField(params);

export default numberField;
