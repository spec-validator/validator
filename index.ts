type ValidatorFunction<ExpectedType> = (value: any) => ExpectedType

type Validator = Record<string, ValidatorFunction<unknown> | Validator>