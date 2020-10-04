import { Json } from './Json';

export interface Field<ExpectedType> {
  validate(value: any): ExpectedType;
  serialize(deserialized: ExpectedType): Json
  getParams: () => Json
}

export type ValidatorSpec<ExpectedType> = {
  [P in keyof ExpectedType]: Field<ExpectedType[P]>;
};

export type TypeHint<Spec extends ValidatorSpec<any> | undefined> = Spec extends ValidatorSpec<any> ? {
  [P in keyof Spec]: ReturnType<Spec[P]['validate']>;
} : undefined;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const withErrorDecoration = <R> (key: any, call: () => R): R => {
  try {
    return call()
  } catch (err) {
    if (err.path && err.inner) {
      throw {
        path: [key, ...err.path],
        inner: err.inner
      }
    } else {
      throw {
        path: [key],
        inner: err
      }
    }
  }
}

const mapSpec = <ExpectedType, R> (
  validatorSpec: ValidatorSpec<ExpectedType>,
  transform: (
    validator: Field<ExpectedType>,
    key: any
  ) => R
): any => {
  if (Array.isArray(validatorSpec)) {
    return validatorSpec.map(transform);
  } else {
    return Object.fromEntries(
      Object.entries(validatorSpec).map(
        ([key, validator]: [string, any]) => [key, withErrorDecoration(key, () => transform(validator, key))]
      )
    );
  }
}

export const getParams = <ExpectedType> (validatorSpec: ValidatorSpec<ExpectedType>): any =>
  mapSpec(validatorSpec, validator => validator.getParams());

// The whole point of the library is to validate wildcard objects
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const validate = <ExpectedType> (validatorSpec: ValidatorSpec<ExpectedType>, value: any): ExpectedType =>
  mapSpec(validatorSpec, (validator, key) => validator.validate(value[key]));

export const serialize = <ExpectedType> (validatorSpec: ValidatorSpec<ExpectedType>, value: ExpectedType): any =>
  mapSpec(validatorSpec, (validator, key) => validator.serialize((value as any)[key]));
