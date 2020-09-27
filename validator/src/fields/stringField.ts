import { Field, Json } from '../core';
import { WithRegExp, WithStringInputSupport } from '../WithStringInputSupport';

type Params = {
  regex?: RegExp,
  description?: string
}

class StringField implements Field<string>, WithStringInputSupport, WithRegExp {
  private params?: Params;

  constructor(params?: Params) {
    this.params = params;
  }
  getFieldWithRegExp(): StringField & WithRegExp {
    return this
  }
  regex() {
    return this?.params?.regex || /.*/
  }
  validate(value: any): string {
    if (typeof value !== 'string') {
      throw 'Not a string'
    }
    if (this.params?.regex) {
      const match = value.match(`^${this.params.regex.source}$`)
      if (!match) {
        throw 'Doesn\'t match a regex'
      }
    }
    return value;
  }
  serialize(deserialized: string): Json {
    return deserialized
  }
  getParams() {
    return {
      regex: this.params?.regex?.source,
      descriotion: this.params?.description
    }
  }

}

const stringField = (params?: Params): Field<string> & WithStringInputSupport => new StringField(params);

export default stringField;
