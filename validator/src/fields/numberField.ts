import { Field, Json } from '../core'

type Params = {
  description?: string
}

class NumberField implements Field<number> {
  private params?: Params

  constructor(params?: Params) {
    this.params = params;
  }

  validate(value: any): number {
    value = Number.parseInt(value);
    if (typeof value !== 'number') {
      throw 'Not a number'
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

const numberField = (params?: Params): Field<number> => new NumberField(params);

export default numberField;
