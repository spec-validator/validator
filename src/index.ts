type ValidatorFunction<ExpectedType> = (value: any) => ExpectedType;

type Unvalidated = any;

type ValidatorSpec<T extends {}> = {
    readonly [P in keyof T]: ValidatorFunction<T[P]>;
};

const validate = <T extends {}> (validatorSpec: ValidatorSpec<T>, value: Unvalidated): T => 
    Object.fromEntries(
        Object.entries(validatorSpec).map(
            ([key, validator]: [string, any]) => [key, validator(value[key])]
        )
    ) as T;

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

const main = () => {
    const spec = {
        title: stringField(),
        count2: numberField(),

    }
    const valid = validate(spec, {})

}

const safeCall = <T, R> (spec: ValidatorSpec<T>, call: (value: T) => R): (value: any) => R => {
    const wrapped = (value: any): R => {
        const valid = validate<T>(spec, value);
        return call(valid)
    }
    return wrapped;
} 



/*
type Validator = { [key: string]: ValidatorFunction<unknown> };

type Valid = { [key: string]: unknown };

const validate = (value: Unvalidated): Valid => {
    if (typeof value === 'object') {
        return 
    }
}
*/

const server = express()

