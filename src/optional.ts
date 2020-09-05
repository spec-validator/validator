import { ValidatorFunction } from "./core";

export type Optional<T> = T | null | undefined;

export const optional = <T> (validate: (value: any) => T): ValidatorFunction<Optional<T>>  => (value: any): Optional<T> => {
    if (value === undefined || value === null) {
        return value
    }
    return validate(value)
}