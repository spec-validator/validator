import { declareField } from "./core"
import { optionalOf } from "./fields/optional"






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
