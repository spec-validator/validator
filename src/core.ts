export type ValidatorFunction<ExpectedType> = (value: any) => ExpectedType;

export type ValidatorSpec<T extends {}> = {
    readonly [P in keyof T]: ValidatorFunction<T[P]>;
};

export type TypeHint<Spec extends ValidatorSpec<any>> = {
    readonly [P in keyof Spec]: ReturnType<Spec[P]>;
}

class GenDoc {}

const GEN_DOC = new GenDoc();

export const genDoc = <T extends {}> (validatorSpec: ValidatorSpec<T>): any => Object.fromEntries(
    Object.entries(validatorSpec).map(
        ([key, validator]: [string, any]) => [key, validator(GEN_DOC)]
    )
) as T;
    
export const validate = <T extends {}> (validatorSpec: ValidatorSpec<T>, value: any): T => 
    Object.fromEntries(
        Object.entries(validatorSpec).map(
            ([key, validator]: [string, any]) => [key, validator(value[key])]
        )
    ) as T;

export type ValidatorFunctionWithSpec<Params, T> = (params: Params, value: any) => any

const validateOrGenerateDoc = <T extends {}, Params> (
    validatorFunctionWithSpec: ValidatorFunctionWithSpec<Params, T>, 
    params: Params, 
    value: any
): T => {
    if (value === GEN_DOC) {
        // Doc generaton mode is possible only internally
        return params as any
    } else {
        return validatorFunctionWithSpec(params, value)
    }
}
