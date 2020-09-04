type ValidatorFunction<ExpectedType> = (value: any) => ExpectedType

type ValidatorValue = ValidatorFunction<unknown> | Validator

type Validator = Record<string, ValidatorValue>