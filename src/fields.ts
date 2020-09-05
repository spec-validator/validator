import { ValidatorFunction, declareField } from "./core"

export const stringField = declareField({}, (params: {
    minLength?: number,
    maxLength?: number,
    description?: string,
}, value: any): string => {
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
})

export const numberField = declareField({}, (_: {}, value: any): number => {
    if (typeof value !== 'number') {
        throw 'Not a number'
    }
    return value
})


/** 

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
*/