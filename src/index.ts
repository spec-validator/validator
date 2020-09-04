type ValidatorFunction<ExpectedType> = (value: any) => ExpectedType;

type ValueOrArray<T> = T | Array<ValueOrArray<T>>;

type Validator = | { [key: string]: ValidatorFunction<unknown> | Validator };
