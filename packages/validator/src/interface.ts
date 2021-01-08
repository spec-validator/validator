import { Json } from './Json'
import { Field, TypeHint, ObjectSpec, ArraySpec, SpecUnion } from './core'
import { undefinedField, arrayField, objectField } from './fields'
import { Any } from './util-types'

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

export const getFieldForSpec = <DeserializedType> (spec: SpecUnion<DeserializedType>): Field<DeserializedType> => {
  if (spec === undefined) {
    return undefinedField()
  } else if (isFieldSpec<DeserializedType>(spec)) {
    return spec
  } else if (isArraySpec<DeserializedType>(spec)) {
    return arrayField<DeserializedType[number]>(getFieldForSpec(spec[0]))
  } else if (isObjectSpec<DeserializedType>(spec)) {
    return objectField<DeserializedType>(getFieldForSpec(spec))
  }
}

// The whole point of the library is to validate wildcard objects
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const validate = <TSpec extends SpecUnion<Any>> (
  spec: TSpec,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  value: any,
): TypeHint<TSpec> => getFieldForSpec(spec).validate(value)

export const serialize = <TSpec extends SpecUnion<Any>> (
  spec: TSpec,
  value: TypeHint<TSpec>
): Json => getFieldForSpec(spec).serialize(value)
