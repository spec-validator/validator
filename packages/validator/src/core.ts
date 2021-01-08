import { Json } from './Json'
import { Any, Optional } from './util-types'

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
