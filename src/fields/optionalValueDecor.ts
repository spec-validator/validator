import { Field, declareField, Mode } from '../core';
import { merge, Optional } from '../utils';

const optionalValueDecor = <T> (innerField: Field<T>): Field<Optional<T>> => declareField({
  validate: (value: any): Optional<T> => {
    if (value === undefined) {
      return value
    }
    return innerField(value, Mode.VALIDATE)
  },
  serialize: (value: Optional<T>) => value === undefined ? value : innerField(value, Mode.SERIALIZE),
  getParams: () => merge(innerField(undefined, Mode.GET_PARAMS), {isOptional: true}),
})

export default optionalValueDecor;
