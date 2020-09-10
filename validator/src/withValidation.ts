import { Field, Mode, validate, ValidatorSpec } from './core';

const withValidation = <T extends any[], R> (
  argSpec: ValidatorSpec<T>,
  returnValueSpec: Field<R>,
  rawCall: (...values: T) => R
) =>
    (...value: any[]): any => returnValueSpec(
      rawCall(...validate<T>(argSpec, value)),
      Mode.SERIALIZE
    )

export default withValidation;
