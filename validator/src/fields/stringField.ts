import { Field, Json } from '../core';
import { WithRegExp, WithRegExpSupport } from '../segmentChain';

type Params = {
  minLength?: number,
  maxLength?: number,
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
    return /.*/
  }
  validate(value: any): string {
    if (typeof value !== 'string') {
      throw 'Not a string'
    }
    if (this.params?.minLength !== undefined) {
      if (value.length < this.params.minLength) {
        throw 'String is too short'
      }
    }
    if (this.params?.maxLength !== undefined) {
      if (value.length > this.params.maxLength) {
        throw 'String is too long'
      }
    }
    return value;
  }
  serialize(deserialized: string): Json {
    return deserialized
  }
  getParams() {
    return this.params
  }

}

const stringField = (params?: Params): Field<string> & WithRegExp => new StringField(params);

export default stringField;
