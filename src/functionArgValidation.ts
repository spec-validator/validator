import { validate, ValidatorSpec } from "./core";
import { numberField, stringField } from "./fields";

export const tuple = <T extends any[]>(...args: T): T => args

export const withValidation = <T extends any[], R> (spec: ValidatorSpec<T>, rawCall: (...values: T) => R) => 
    (...value: any[]): R => {
        const vv = validate<T>(spec, value)
        console.log('VV', vv)
        return rawCall(...vv)
    }


// TODO: how to force a list to be interpreted as a
const spec = tuple(
    stringField(),
    stringField(),
    numberField(),
)

const someFunction = (a: string, b: string, c: number) => `${a}${b}${c}`

const wildCard = withValidation(spec, someFunction)

wildCard('a', 'b', 1)