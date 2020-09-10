import { Field, declareField, Mode, Json } from '../core';
import { merge } from '../utils';

const defaultValueDecor = <T> (innerField: Field<T>, defaultValue: T): Field<T> => declareField({
  validate: (value: any): T => {
    if (value === undefined) {
      value = defaultValue
    }
    return innerField(value, Mode.VALIDATE)
  },
  serialize: (value: T) => innerField(value, Mode.SERIALIZE) as unknown as Json,
  getParams: () => merge(innerField(undefined, Mode.GET_PARAMS), {defaultValue: defaultValue}),
})

export default defaultValueDecor;
