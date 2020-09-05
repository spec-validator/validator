export type ValidatorFunction<ExpectedType> = (value: any) => ExpectedType;

export type ValidatorSpec<T extends {}> = {
    readonly [P in keyof T]: ValidatorFunction<T[P]>;
};

export type TypeHint<Spec extends ValidatorSpec<any>> = {
    readonly [P in keyof Spec]: ReturnType<Spec[P]>;
}

const GEN_DOC = 'GEN_DOC'

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

export type Optional<T> = T | null | undefined;

export const optional = <T> (validate: (value: any) => T): ValidatorFunction<Optional<T>>  => (value: any): Optional<T> => {
    if (value === undefined || value === null) {
        return value
    }
    return validate(value)
}

export const safeCall = <T, R> (spec: ValidatorSpec<T>, call: (value: T) => R): (value: any) => R => 
    (value: any): R => {
        const valid = validate<T>(spec, value);
        return call(valid)
    }


