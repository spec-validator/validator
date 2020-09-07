import { Field, declareField, Mode } from '../core';
import { merge } from '../utils';

const defaultValueDecor = <T> (params: { innerField: Field<T>, defaultValue: T}): Field<T> => declareField({
  validate: (value: any): T => {
    if (value === undefined) {
      return params.defaultValue
    }
    return params.innerField(value, Mode.VALIDATE)
  },
  serialize: (value: T) => value === undefined ? value : params.innerField(value, Mode.SERIALIZE),
  getParams: () => merge(params.innerField(undefined, Mode.GET_PARAMS), {defaultValue: params.defaultValue}),
})

export default defaultValueDecor;
