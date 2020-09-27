import { Field, withErrorDecoration, Json } from '../core';

type Params<T> = {
  itemField: Field<T>,
  description?: string
}

class ArrayField<T> implements Field<T[]> {
  private params: Params<T>;

  constructor(params: Params<T>) {
    this.params = params
  }

  validate(value: any): T[] {
    if (!Array.isArray(value)) {
      throw 'Not an array'
    }
    return value.map(
      (it, index) => withErrorDecoration(index, () => this.params.itemField.validate(it))
    );
  }
  serialize(deserialized: T[]): Json {
    return deserialized.map(
      (it, index) => withErrorDecoration(index, () => this.params.itemField.serialize(it) as unknown as Json)
    )
  }
  getParams(): Json {
    return {
      description: this.params.description,
      itemSpec: this.params.itemField.getParams()
    };
  }
}

const arrayField = <T> (
  itemField: Field<T>,
  description?: string
): Field<T[]> =>
    new ArrayField({
      itemField,
      description
    });

export default arrayField;
