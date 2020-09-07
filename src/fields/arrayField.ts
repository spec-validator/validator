import { ValidatorFunction } from "../core";

const arrayField = <T> (itemValidator: ValidatorFunction<T>) => (value: any): T[] => {

}

const field = declareField({}, (_, value: any): number => {
    if (!Array.isArray(value)) {
        throw 'Not an array'
    }
    return value.map(itemValidator);
})

export default field;
