import { validate, ValidatorSpec, getParams, TypeHint } from "./core";
import { numberField, stringField } from "./fields";

export const tuple = <T extends any[]>(...args: T): T => args

export const withValidation = <T extends any[], R> (spec: ValidatorSpec<T>, rawCall: (...values: T) => R) =>
    (...value: any[]): R => rawCall(...validate<T>(spec, value))

const test = () => {
    const spec = tuple(
        stringField({
            maxLength: 123,
            description: 'FooBar'
        }),
        stringField(),
        numberField(),
    );
    const wildCard = withValidation(spec, (a, b, c) => `${a}${b}${c}`)
    //console.log(wildCard('a', 'b', 1))
    console.log(getParams(spec))
}

test();
