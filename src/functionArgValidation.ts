import { validate, ValidatorSpec } from "./core";
import { numberField, stringField } from "./fields";

export const tuple = <T extends any[]>(...args: T): T => args

export const withValidation = <T extends any[], R> (spec: ValidatorSpec<T>, rawCall: (...values: T) => R) => 
    (...value: any[]): R => rawCall(...validate<T>(spec, value))

const wildCard = withValidation(tuple(
    stringField(),
    stringField(),
    numberField(),
), (a, b, c) => `${a}${b}${c}`)

console.log(wildCard('a', 'b', 1))