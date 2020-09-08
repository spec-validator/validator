import { serialize, validate, ValidatorSpec } from './core';

export const tuple = <T extends any[]>(...args: T): T => args

export const withValidation = <T extends any[], R> (
  argSpec: ValidatorSpec<T>,
  returnValueSpec: ValidatorSpec<R>,
  rawCall: (...values: T) => R
) =>
    (...value: any[]): any => serialize(
      returnValueSpec,
      rawCall(...validate<T>(argSpec, value))
    )

