import { Json } from './Json'
import { Any } from './util-types'

export interface Field<DeserializedType> {
  validate(value: any): DeserializedType;
  serialize(deserialized: DeserializedType): Json
}

export type ObjectSpec<DeserializedType extends Record<string, Any> = Record<string, Any>> = {
  [P in keyof DeserializedType]: SpecUnion<DeserializedType[P]>
}

export type ArraySpec<DeserializedType extends Any[] = Any[]> = Field<DeserializedType[number]>[]

export type SpecUnion<DeserializedType> =
  ObjectSpec | ArraySpec | Field<DeserializedType> | undefined;

export type TypeHint<Spec extends SpecUnion<Any>> =
  Spec extends ArraySpec ?
    TypeHint<Spec[0]>[]
  : Spec extends ObjectSpec ?
    { [P in keyof Spec]: TypeHint<Spec[P]>; }
  : Spec extends Field<Any> ?
    ReturnType<Spec['validate']>
  :
    undefined

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
  obj && typeof obj.validate === 'function' && typeof obj.serialize === 'function'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isObjectSpec = (obj: any): obj is ObjectSpec => {
  const keys = Object.keys(obj)
  for (const i in keys) {
    const key = keys[i]
    if (typeof key !== 'string') {
      return false
    }
    if (!isValidChild(obj[key])) {
      return false
    }
  }
  return true
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isArraySpec = (obj: any): obj is ArraySpec => {
  if (!Array.isArray(obj)) {
    return false
  }
  if (obj.length !== 1) {
    return false
  }
  if (!isValidChild(obj[0])) {
    return false
  }
  return true
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isValidChild = (obj: any) =>
  isFieldSpec(obj) || isArraySpec(obj) || isObjectSpec(obj)
