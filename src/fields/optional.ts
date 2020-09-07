import { Field, declareField, Mode } from '../core';

export type Optional<T> = T | undefined;

export const optionalOf = <T>(): Optional<T> => undefined

const optional = <T> (innerField: Field<T>): Field<Optional<T>> => declareField({
  validate: (value: any): Optional<T> => {
    if (value === undefined) {
      return value
    }
    return innerField(value, Mode.VALIDATE)
  },
  serialize: (value: Optional<T>) => value === undefined ? value : innerField(value, Mode.SERIALIZE),
  getParams: () => Object.assign({optional: true}, innerField(undefined, Mode.GET_PARAMS)),
})

export default optional;
