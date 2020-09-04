type ValidatorFunction<ExpectedType> = (value: any) => ExpectedType;

type Unvalidated = any;

type ValidatorSpec<T extends {}> = {
    readonly [P in keyof T]: ValidatorFunction<T[P]>;
};

const validate = <T extends {}> (validatorSpec: ValidatorSpec<T>, value: Unvalidated, skipValidation: boolean=false): T => {
    if (skipValidation) {
        return {} as T;
    } else {
        return Object.fromEntries(
            Object.entries(validatorSpec).map(
                ([key, validator]: [string, any]) => [key, validator(value[key])]
            )
        ) as T;
    }
}

const optional = <T> (validate: (value: any) => T): ValidatorFunction<T | null>  => (value: any): T | null => {
    if (value === undefined || value === null) {
        return null
    }
    return validate(value)
}

const stringField = (params?: {
    minLength?: number,
    maxLength?: number,
    description?: string,
}): ValidatorFunction<string> => (value: any): string => {
    if (typeof value !== 'string') {
        throw 'Not a string'
    }
    if (params?.minLength !== undefined) {
        if (value.length < params.minLength) {
            throw 'String is too short'
        }
    }
    if (params?.maxLength !== undefined) {
        if (value.length > params.maxLength) {
            throw 'String is too long'
        }
    }
    return value;
}

const numberField = (): ValidatorFunction<number> => (value: any): any => {
    if (typeof value !== 'number') {
        throw 'Not a number'
    }
    return value as any
}

const safeCall = <T, R> (spec: ValidatorSpec<T>, call: (value: T) => R): (value: any) => R => 
    (value: any): R => {
        const valid = validate<T>(spec, value);
        return call(valid)
    }

const myTypeSafeCallSpec = {
    one: numberField(),
    two: stringField(),
    three: stringField(),
}

const obtainObjectSpec = <T> (spec: ValidatorSpec<T>) : T => {
    return validate(spec, {} as any, true);
}

const obj = obtainObjectSpec(myTypeSafeCallSpec);
type TType = typeof obj;

const runtimeCheckedCall = safeCall(myTypeSafeCallSpec, ({one, two, three}) => `${one} ${two} ${three}`);

console.log(runtimeCheckedCall({one: 11, two: 'foo', three: 'bla'}))
