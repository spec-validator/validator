export type ValidatorFunction<ExpectedType> = (value: any) => ExpectedType;

export type ValidatorSpec<T extends {}> = {
    readonly [P in keyof T]: ValidatorFunction<T[P]>;
};

export type TypeHint<Spec extends ValidatorSpec<any>> = {
    readonly [P in keyof Spec]: ReturnType<Spec[P]>;
}

class GetParams {}

const GET_PARAMS = new GetParams();

const mapSpec = <T extends {}, R> (validatorSpec: ValidatorSpec<T>, transform: (validator: ValidatorFunction<T>, key: string) => R): any => Object.fromEntries(
    Object.entries(validatorSpec).map(
        ([key, validator]: [string, any]) => [key, transform(validator, key)]
    )
);

export const getParams = <T extends {}> (validatorSpec: ValidatorSpec<T>): any => 
    mapSpec(validatorSpec, validator => validator(GET_PARAMS));
    
export const validate = <T extends {}> (validatorSpec: ValidatorSpec<T>, value: any): T =>
    mapSpec(validatorSpec, (validator, key) => validator(value[key]));

export type ValidatorFunctionWithSpec<Params, T> = (params: Params, value: any) => any

const validateOrGetParams = <T extends {}, Params> (
    validatorFunctionWithSpec: ValidatorFunctionWithSpec<Params, T>, 
    params: Params, 
    value: any
): T => {
    if (value === GET_PARAMS) {
        // Doc generaton mode is possible only internally
        return params as any
    } else {
        return validatorFunctionWithSpec(params, value)
    }
}

const declareField = () => {}