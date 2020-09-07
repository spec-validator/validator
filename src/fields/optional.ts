import { Field, declareField } from '../core';

export type Optional<T> = T | undefined;

export const optionalOf = <T>(): Optional<T> => undefined

export const optional = <T> (validate: (value: any) => T): Field<Optional<T>>  => declareField(
  (value: any): Optional<T> => {
    if (value === undefined) {
      return value
    }
    return validate(value)
  })
