import { Json } from '@spec-validator/utils/Json'
import { Any, Optional } from '@spec-validator/utils/util-types'

export type OfType<Type extends string> = {
  readonly type: Type
}

export interface Field<DeserializedType> {
  validate(serialized: any): DeserializedType
  serialize(deserialized: DeserializedType): Json
}

export type ObjectSpec = {
  [key: string]: SpecUnion
}

export type WildcardObjectSpec = {
  [key: string]: Optional<SpecUnion>
}

export type ArraySpec = SpecUnion[]

export type SpecUnion =
  WildcardObjectSpec | ObjectSpec | ArraySpec | Field<unknown> | undefined

export type TypeHint<Spec extends SpecUnion> =
  Spec extends WildcardObjectSpec ?
    { [P in keyof Spec]: TypeHint<Spec[P]> }
  : Spec extends ArraySpec ?
    TypeHint<Spec[0]>[]
  : Spec extends ObjectSpec ?
    { [P in keyof Spec]: TypeHint<Spec[P]> }
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
export const isObjectSpec = (obj: any): obj is ObjectSpec =>
  obj && !Object.keys(obj).find(key => typeof key !== 'string' || !isValidChild(obj[key]))

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isArraySpec = (obj: any): obj is ArraySpec =>
  Array.isArray(obj) && obj.length === 1 && isValidChild(obj[0])

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isValidChild = (obj: any) =>
  isFieldSpec(obj) || isArraySpec(obj) || isObjectSpec(obj)

export type StringBasedField<
  DeserializedType,
  Base extends Field<unknown>,
> = {
  serialize(deserialized: DeserializedType): string
} & Omit<Base, 'getStringField'>

export interface FieldWithStringSupport<
  DeserializedType,
> extends Field<DeserializedType> {
  getStringField(): StringBasedField<DeserializedType, this>
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isFieldWithStringSupport = <DeserializedType>(obj: any):
  obj is FieldWithStringSupport<DeserializedType> =>
    isFieldSpec(obj) && typeof (obj as any).getStringField === 'function'

export const declareField = <
  Type extends string,
  Params extends any[],
  FieldType extends Field<unknown>,
  Constructor extends (...params: Params) => FieldType
> (
    type: Type,
    constructor: Constructor
  ): Constructor & OfType<Type>  => {
  const wrapper = (...params: any[]) => {
    const result = (constructor as any)(...params)
    result.type = type
    if (isFieldWithStringSupport(result)) {
      const oldStringField = result.getStringField() as any
      result.getStringField = () => {
        oldStringField.type = type
        return oldStringField
      }
    }
    return result
  }
  wrapper.type = type
  return wrapper as Constructor & OfType<Type>
}
