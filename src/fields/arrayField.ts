import { Field, declareField, Mode } from '../core';

const arrayField = <T> (itemField: Field<T>): Field<T[]> => declareField({
  validate: (value: any): T[] => {
    if (!Array.isArray(value)) {
      throw 'Not an array'
    }
    return value.map((it) => itemField(it, Mode.VALIDATE));
  },
  serialize: (value: T[]) => value.map((it) => itemField(it, Mode.SERIALIZE)),
  getParams: () => Object.assign({item: itemField(undefined, Mode.GET_PARAMS)}),
})

export default arrayField;
