import { ValidatorFunction } from "./core";

export type Optional<T> = T | undefined;

export const undefinedOf = <T>(): Optional<T> => undefined

export const optional = <T> (validate: (value: any) => T): ValidatorFunction<Optional<T>>  => (value: any): Optional<T> => {
    if (value === undefined) {
        return value
    }
    return validate(value)
}
