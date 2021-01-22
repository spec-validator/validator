/*
import { Field, SpecUnion, isArraySpec, isFieldSpec, isObjectSpec } from './core'
import { undefinedField, arrayField, objectField } from './fields'

export const getFieldForSpec = <DeserializedType> (
  spec: SpecUnion<DeserializedType>,
  allowExtraFields = false
): Field<DeserializedType> => {
  if (isFieldSpec(spec)) {
    return spec
  } else if (isArraySpec(spec)) {
    return arrayField(getFieldForSpec(spec[0])) as unknown as Field<DeserializedType>
  } else if (isObjectSpec(spec)) {
    return objectField(Object.fromEntries(
      Object.entries(spec).map(([key, value]) => [key, getFieldForSpec(value)])
    ), allowExtraFields) as unknown as Field<DeserializedType>
  } else {
    return undefinedField()
  }
}
*/
