import { Field, declareField, Mode, withErrorDecoration, Json } from '../core';

const arrayField = <T> (params: { itemField: Field<T>, description?: string}): Field<T[]> => declareField({
  validate: (value: any): T[] => {
    if (!Array.isArray(value)) {
      throw 'Not an array'
    }
    return value.map(
      (it, index) => withErrorDecoration(index, () => params.itemField(it, Mode.VALIDATE))
    );
  },
  serialize: (value: T[]) => value.map(
    (it, index) => withErrorDecoration(index, () => params.itemField(it, Mode.SERIALIZE) as unknown as Json)
  ),
  getParams: () => ({
    description: params.description,
    itemSpec: params.itemField(undefined, Mode.GET_PARAMS) as unknown as Json
  }),
})

export default arrayField;
