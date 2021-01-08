import { Json } from './Json'
import { Any, Optional } from './util-types'

export interface FieldDecorator {
  innerField: Field<unknown>
}

export interface Field<DeserializedType> {
  validate(value: any): DeserializedType;
  serialize(deserialized: DeserializedType): Json
}

export type ObjectSpec<DeserializedType> = {
  [P in keyof DeserializedType]: Field<DeserializedType[P]>
};

export type ArraySpec<DeserializedType> = [Field<DeserializedType>]

export type WildcardObjectSpec = {
  [key: string]: Optional<Field<unknown>>
};

export type SpecUnion<DeserializedType> =
  WildcardObjectSpec | ObjectSpec<DeserializedType> | Field<DeserializedType> | undefined;

export type TypeHint<Spec extends SpecUnion<Any> | undefined> =
  Spec extends WildcardObjectSpec ?
    { [P in keyof Spec]: TypeHint<Spec[P]>; }
  : Spec extends ObjectSpec<Record<string, Any>> ?
    { [P in keyof Spec]: TypeHint<Spec[P]>; }
  : Spec extends Field<Any> ?
    ReturnType<Spec['validate']>
  :
    undefined;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const withErrorDecoration = <R> (key: any, call: () => R): R => {
  try {
    return call()
  } catch (err) {
    if (err.path && err.inner) {
      throw {
        path: [key, ...err.path],
        inner: err.inner,
      }
    } else {
      throw {
        path: [key],
        inner: err,
      }
    }
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isFieldSpec = <DeserializedType>(obj: any): obj is Field<DeserializedType> =>
  typeof obj.validate === 'function' && typeof obj.serialize === 'function'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isObjectSpec = <DeserializedType>(obj: any): obj is ObjectSpec<DeserializedType> => {
  for (const key in Object.keys(obj)) {
    if (typeof key !== 'string') {
      return false
    }
    if (!isFieldSpec(obj[key])) {
      return false
    }
  }
  return true
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isArraySpec = <DeserializedType>(obj: any): obj is ArraySpec<DeserializedType> => {
  if (!Array.isArray(obj)) {
    return false
  }
  if (obj.length !== 1) {
    return false
  }
  if (!isFieldSpec(obj[0])) {
    return false
  }
  return true
}

const mapSpec = <DeserializedType extends Any, TSpec extends SpecUnion<DeserializedType>, R> (
  validatorSpec: TSpec,
  transform: (
    validator: Field<DeserializedType>,
    key: any
  ) => R
): any => {
  if (validatorSpec === undefined) {
    return undefined
  } else if (isFieldSpec<DeserializedType>(validatorSpec)) {
    return transform(validatorSpec, undefined)
  } else {
    return Object.fromEntries(
      Object.entries(validatorSpec as ObjectSpec<{ [property: string]: Any }>).map(
        ([key, validator]: [string, any]) => [key, withErrorDecoration(key, () => transform(validator, key))]
      )
    )
  }
}

const ensureNoExtraFields = <DeserializedType extends Any, TSpec extends SpecUnion<DeserializedType>> (
  validatorSpec: TSpec,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  value: any
) => {
  if (validatorSpec === undefined || isFieldSpec<DeserializedType>(validatorSpec)|| Array.isArray(validatorSpec)) {
    // OK
  } else {
    const extraKeys = new Set(Object.keys(value))
    Object.keys(validatorSpec as ObjectSpec<DeserializedType>).forEach((it) => extraKeys.delete(it))
    if (extraKeys.size !== 0) {
      throw {
        extraKeys: Array.from(extraKeys),
      }
    }
  }
}

// The whole point of the library is to validate wildcard objects
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const validate = <TSpec extends SpecUnion<Any>> (
  validatorSpec: TSpec,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  value: any,
  canHaveExtras = false
): TypeHint<TSpec> => {
  const result = mapSpec(validatorSpec,
    (validator, key) => validator.validate(key === undefined ? value : value[key])
  )
  !canHaveExtras && ensureNoExtraFields(validatorSpec, value)
  return result
}

export const serialize = <TSpec extends SpecUnion<Any>> (
  validatorSpec: TSpec,
  value: TypeHint<TSpec>
): Json =>
    mapSpec(validatorSpec, (validator, key) =>
      validator.serialize(key === undefined ? value : (value as any)[key])
    )
