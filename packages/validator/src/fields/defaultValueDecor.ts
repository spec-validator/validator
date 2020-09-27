import { Field, Json } from '../core';
import { merge } from '../utils';

class DefaultFieldDecorator<T> implements Field<T> {
  private innerField: Field<T>;
  private defaultValue: T;

  constructor(innerField: Field<T>, defaultValue: T) {
    this.innerField = innerField;
    this.defaultValue = defaultValue;
  }

  validate(value: any): T {
    if (value === undefined) {
      value = this.defaultValue
    }
    return this.innerField.validate(value)
  }
  serialize(deserialized: T): Json {
    return this.innerField.serialize(deserialized)
  }
  getParams() {
    return merge({
      defaultValue: this.defaultValue
    }, this.innerField.getParams())
  }
}

const defaultValueDecor = <T> (innerField: Field<T>, defaultValue: T): Field<T> =>
  new DefaultFieldDecorator(innerField, defaultValue);

export default defaultValueDecor;
