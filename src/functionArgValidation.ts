import { validate, ValidatorSpec } from "./core";

export const withValidation = <T, R> (spec: ValidatorSpec<T>, rawCall: (value: T) => R): (value: any) => R => 
    (value: any): R => rawCall(validate<T>(spec, value))
