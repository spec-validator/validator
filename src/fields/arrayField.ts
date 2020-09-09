import { Field, declareField, Mode, withErrorDecoration, Json } from '../core';

const arrayField = <T> (itemField: Field<T>, description?: string): Field<T[]> => declareField({
  validate: (value: any): T[] => {
    if (!Array.isArray(value)) {
      throw 'Not an array'
    }
    return value.map(
      (it, index) => withErrorDecoration(index, () => itemField(it, Mode.VALIDATE))
    );
  },
  serialize: (value: T[]) => value.map(
    (it, index) => withErrorDecoration(index, () => itemField(it, Mode.SERIALIZE) as unknown as Json)
  ),
  getParams: () => ({
    description: description,
    itemSpec: itemField(undefined, Mode.GET_PARAMS) as unknown as Json
  }),
})

export default arrayField;
