import { Json } from './Json'

export interface Field<DeserializedType> {
  validate(value: any): DeserializedType;
  serialize(deserialized: DeserializedType): Json
  getParams: () => Json
}

export type ValidatorSpec<DeserializedType> = {
  [P in keyof DeserializedType]: Field<DeserializedType[P]>;
};

export type SpecUnion<DeserializedType> = ValidatorSpec<DeserializedType> | Field<DeserializedType> | undefined;

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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isField = <DeserializedType>(object: any): object is Field<DeserializedType> =>
  'validate' in object && 'serialize' in object && 'getParams' in object

const mapSpec = <DeserializedType, R> (
  validatorSpec: SpecUnion<DeserializedType>,
  transform: (
    validator: Field<DeserializedType>,
    key: any
  ) => R
): any => {
  if (validatorSpec === undefined) {
    return undefined
  } else if (isField<DeserializedType>(validatorSpec)) {
    return transform(validatorSpec, undefined)
  } else {
    return Object.fromEntries(
      Object.entries(validatorSpec).map(
        ([key, validator]: [string, any]) => [key, withErrorDecoration(key, () => transform(validator, key))]
      )
    )
  }
}

export const getParams = <DeserializedType> (validatorSpec: SpecUnion<DeserializedType>): Json =>
  mapSpec(validatorSpec, validator => validator.getParams())

// The whole point of the library is to validate wildcard objects
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const validate = <DeserializedType> (validatorSpec: SpecUnion<DeserializedType>, value: any): DeserializedType =>
  mapSpec(validatorSpec,
    (validator, key) => validator.validate(key === undefined ? value : value[key])
  )

export const serialize = <DeserializedType> (
  validatorSpec: SpecUnion<DeserializedType>,
  value: DeserializedType
): Json =>
    mapSpec(validatorSpec, (validator, key) =>
      validator.serialize(key === undefined ? value : (value as any)[key])
    )
