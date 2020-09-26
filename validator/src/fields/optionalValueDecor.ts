import { Field, Json } from '../core';
import { merge, Optional } from '../utils';

class OptionalValueDecorator<T> implements Field<Optional<T>> {
  private innerField: Field<T>;

  constructor(innerField: Field<T>) {
    this.innerField = innerField;
  }

  validate(value: any): Optional<T> {
    if (value === undefined) {
      return value
    }
    return this.innerField.validate(value)
  }
  serialize(deserialized: Optional<T>): Json {
    return deserialized === undefined ? deserialized : this.innerField.serialize(deserialized) as any
  }
  getParams() {
    return merge(
      { isOptional: true },
      this.innerField.getParams()
    )
  }

}

const optionalValueDecor = <T> (innerField: Field<T>): Field<Optional<T>> => new OptionalValueDecorator(innerField);

export default optionalValueDecor;
