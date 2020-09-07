import { Field, declareField, Mode, withErrorDecoration } from '../core';

const arrayField = <T> (itemField: Field<T>): Field<T[]> => declareField({
  validate: (value: any): T[] => {
    if (!Array.isArray(value)) {
      throw 'Not an array'
    }
    return value.map(
      (it, index) => withErrorDecoration(index, () => itemField(it, Mode.VALIDATE))
    );
  },
  serialize: (value: T[]) => value.map(
    (it, index) => withErrorDecoration(index, () => itemField(it, Mode.SERIALIZE))
  ),
  getParams: () => ({item: itemField(undefined, Mode.GET_PARAMS)}),
})

export default arrayField;
