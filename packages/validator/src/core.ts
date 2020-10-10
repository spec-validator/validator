import { Json } from './Json'

export interface Field<ExpectedType> {
  validate(value: any): ExpectedType;
  serialize(deserialized: ExpectedType): Json
  getParams: () => Json
}

export type ValidatorSpec<ExpectedType> = {
  [P in keyof ExpectedType]: Field<ExpectedType[P]>;
};

export type SpecUnion<ExpectedType> = ValidatorSpec<ExpectedType> | Field<ExpectedType> | undefined;

export type TypeHint<Spec extends SpecUnion<any> | undefined> = Spec extends ValidatorSpec<any> ? {
  [P in keyof Spec]: ReturnType<Spec[P]['validate']>;
} : Spec extends Field<any> ? ReturnType<Spec['validate']> : undefined;

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

const isField = <ExpectedType>(object: any): object is Field<ExpectedType> =>
  'validate' in object && 'serialize' in object && 'getParams' in object

const mapSpec = <ExpectedType, R> (
  validatorSpec: SpecUnion<ExpectedType>,
  transform: (
    validator: Field<ExpectedType>,
    key: any
  ) => R
): any => {
  if (validatorSpec === undefined) {
    return undefined
  } else if (isField<ExpectedType>(validatorSpec)) {
    return transform(validatorSpec, undefined)
  } else if (Array.isArray(validatorSpec)) {
    return validatorSpec.map(transform)
  } else {
    return Object.fromEntries(
      Object.entries(validatorSpec).map(
        ([key, validator]: [string, any]) => [key, withErrorDecoration(key, () => transform(validator, key))]
      )
    )
  }
}

export const getParams = <ExpectedType> (validatorSpec: SpecUnion<ExpectedType>): any =>
  mapSpec(validatorSpec, validator => validator.getParams())

// The whole point of the library is to validate wildcard objects
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const validate = <ExpectedType> (validatorSpec: SpecUnion<ExpectedType>, value: any): ExpectedType =>
  mapSpec(validatorSpec,
    (validator, key) => validator.validate(key === undefined ? value : value[key])
  )

export const serialize = <ExpectedType> (validatorSpec: SpecUnion<ExpectedType>, value: ExpectedType): any =>
  mapSpec(validatorSpec, (validator, key) =>
    validator.serialize(key === undefined ? value : (value as any)[key])
  )
