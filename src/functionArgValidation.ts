import { validate, ValidatorSpec } from "./core";
import { numberField, stringField } from "./fields";

export const tuple = <T extends any[]>(...args: T): T => args

export const withValidation = <T extends any[], R> (spec: ValidatorSpec<T>, rawCall: (...T) => R): (value: any) => R => 
    (value: any): R => rawCall(...validate<T>(spec, value))

const test = () => {

    // TODO: how to force a list to be interpreted as a
    const spec = tuple(
        stringField(),
        stringField(),
        numberField(),
    )

    const someFunction = (a: string, b: string, c: number) => `${a}${b}${c}`

    const validated = withValidation(spec, someFunction)

}