import { Field, validate, ValidatorSpec } from './core'

const withValidation = <T extends any[], R> (
  argSpec: ValidatorSpec<T>,
  returnValueSpec: Field<R>,
  rawCall: (...values: T) => R
) =>
    (...value: any[]): any => returnValueSpec.serialize(
      rawCall(...validate<T>(argSpec, value)),
    )

export default withValidation
