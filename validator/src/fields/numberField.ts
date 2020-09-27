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
    throw new Error('Method not implemented.');
  }

  regex() {
    return /\d+/
  }

  validate(value: any): number {
    if (this.params?.canBeFloat) {
      value = Number.parseFloat(value);
      if (typeof value !== 'number') {
        throw 'Not a float'
      }
    } else {
      value = Number.parseInt(value);
      if (typeof value !== 'number') {
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

const numberField = (params?: Params): Field<number> & WithRegExp => new NumberField(params);

export default numberField;
