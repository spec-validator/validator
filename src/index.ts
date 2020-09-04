type ValidatorFunction<ExpectedType> = (value: any) => ExpectedType;

type Unvalidated = any;

type ValidatorSpec<T extends {}> = {
    readonly [P in keyof T]: ValidatorFunction<T[P]>;
};

type TypeHint<Spec extends ValidatorSpec<any>> = {
    readonly [P in keyof Spec]: ReturnType<Spec[P]>;
}

const GEN_DOC = 'GEN_DOC'

const genDoc = <T extends {}> (validatorSpec: ValidatorSpec<T>): any => Object.fromEntries(
    Object.entries(validatorSpec).map(
        ([key, validator]: [string, any]) => [key, validator(GEN_DOC)]
    )
) as T;
    

const validate = <T extends {}> (validatorSpec: ValidatorSpec<T>, value: Unvalidated): T => 
    Object.fromEntries(
        Object.entries(validatorSpec).map(
            ([key, validator]: [string, any]) => [key, validator(value[key])]
        )
    ) as T;

const optional = <T> (validate: (value: any) => T): ValidatorFunction<T | null | undefined>  => (value: any): T | null | undefined => {
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
    if (value === GEN_DOC) {
        return {
            ...(params || {})
        } as any
    }

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
    if (value === GEN_DOC) {
        return {}
    }
    if (typeof value !== 'number') {
        throw 'Not a number'
    }
    return value as any
}

const currencyField = (): ValidatorFunction<number> => (value: any): any => {
    if (value === GEN_DOC) {
        return {}
    }
    if (typeof value !== 'number') {
        throw 'Not a number'
    }
    return value as any
}

const addressField = (): ValidatorFunction<number> => (value: any): any => {
    if (value === GEN_DOC) {
        return {}
    }
    if (typeof value !== 'number') {
        throw 'Not a number'
    }
    return value as any
}

const timeField = (): ValidatorFunction<number> => (value: any): any => {
    if (value === GEN_DOC) {
        return {}
    }
    if (typeof value !== 'number') {
        throw 'Not a number'
    }
    return value as any
}

const arrayField = <T> (itemValidator: ValidatorFunction<T>) => (value: any): T[] => {
    if (value === GEN_DOC) {
        return {
            itemSpec: itemValidator(GEN_DOC)
        } as any
    }

    if (!Array.isArray(value)) {
        throw 'Not an array'
    }
    return value.map(itemValidator);
}

const safeCall = <T, R> (spec: ValidatorSpec<T>, call: (value: T) => R): (value: any) => R => 
    (value: any): R => {
        const valid = validate<T>(spec, value);
        return call(valid)
    }

const listingSpec = {
    one: numberField(),
    two: stringField({
        description: 'Two'
    }),
    three: stringField(),
    four: arrayField(stringField({
        description: 'BLa'
    }))
}

type ListingType = TypeHint<typeof listingSpec>;

const runtimeCheckedCall = safeCall(myTypeSafeCallSpec, ({one, two, three}) => {
    one.toExponential();
});

console.log(runtimeCheckedCall({ two: 'dfdf', three: 'dfdf', four: []}))

const server = express()


server.post('/listings/#listing-id', listingSpec, (request: Request<ListingType>) => {

})