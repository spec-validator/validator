import { Field, Json } from '../core';
import { WithRegExp, WithRegExpSupport } from '../segmentChain';

type Params = {
  regex?: RegExp,
  description?: string
}

class StringField implements Field<string>, WithRegExpSupport {
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

const stringField = (params?: Params): Field<string> & WithRegExp => new StringField(params);

export default stringField;
