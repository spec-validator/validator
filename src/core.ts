import { Json } from "./json";

export type ValidatorFunction<ExpectedType> = (value: any) => ExpectedType;

type ValidatorFunctionConstructor<Params, ExpectedType> = (params?: Params) => ValidatorFunction<ExpectedType>

export type ValidatorSpec<ExpectedType> = {
    readonly [P in keyof ExpectedType]: ValidatorFunction<ExpectedType[P]>;
};

export type TypeHint<Spec extends ValidatorSpec<any>> = {
    readonly [P in keyof Spec]: ReturnType<Spec[P]>;
}

enum Mode {
    GET_PARAMS = '~~GET~~PARAMS~~',
    SERIALIZE = '~~SERIALIZE~~',
    DESERIALIZE = '~~DESERIALIZE~~'
}

const withErrorDecoration = <R> (key: any, call: () => R) => {
    try {
        return call()
    } catch (err) {
        if (err.path && err.inner) {
            throw {
                path: [key, ...err.path],
                inner: err.inner
            }
        } else {
            throw {
                path: [key],
                inner: err
            }
        }
    }
}

const mapSpec = <ExpectedType, R> (
    validatorSpec: ValidatorSpec<ExpectedType>,
    transform: (
        validator: ValidatorFunction<ExpectedType>,
        key: any
    ) => R
): any => {
    if (Array.isArray(validatorSpec)) {
        return validatorSpec.map(transform)
    } else {
        return Object.fromEntries(
            Object.entries(validatorSpec).map(
                ([key, validator]: [string, any]) => [key, withErrorDecoration(key, () => transform(validator, key))]
            )
        );
    }
}

export const getParams = <T> (validatorSpec: ValidatorSpec<T>): any =>
    mapSpec(validatorSpec, validator => validator(Mode.GET_PARAMS));

export const validate = <T> (validatorSpec: ValidatorSpec<T>, value: any): T =>
    mapSpec(validatorSpec, (validator, key) => validator(value[key]));

export type ValidatorFunctionWithSpec<Params, ExpectedType> = (params: Params, value: any) => ExpectedType

export const declareField = <ExpectedType, Params> (
    defaultParams: Params,
    validateWithSpec: ValidatorFunctionWithSpec<Params, ExpectedType>,
    serialize: (params: Params, value: ExpectedType) => Json,
    getParams: (params: Params) => any = (params: Params) => params
): ValidatorFunctionConstructor<Params, ExpectedType> =>
    (params?: Params) =>
    (value: any) => {
        switch(value) {
            case Mode.GET_PARAMS:
                return getParams(params || defaultParams);
            case Mode.SERIALIZE:
                return serialize(params || defaultParams, value);
            default:
                return validateWithSpec(params || defaultParams, value);
        }
    }
