import { Json } from '@spec-validator/utils/Json'
import { Field, TypeHint, SpecUnion, isArraySpec, isFieldSpec, isObjectSpec } from './core'
import { undefinedField, arrayField, objectField } from './fields'

export const getFieldForSpec = (
  spec: SpecUnion,
  allowExtraFields = false
): Field<TypeHint<typeof spec>> => {
  type F = Field<TypeHint<typeof spec>>
  if (isFieldSpec(spec)) {
    return spec as F
  } else if (isArraySpec(spec)) {
    return arrayField(getFieldForSpec(spec[0])) as unknown as F
  } else if (isObjectSpec(spec)) {
    return objectField(Object.fromEntries(
      Object.entries(spec).map(([key, value]) => [key, getFieldForSpec(value)])
    ), allowExtraFields) as unknown as F
  } else {
    return undefinedField()
  }
}

// The whole point of the library is to validate wildcard objects
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const validate = (
  spec: SpecUnion,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  value: any,
  allowExtraFields = false
): TypeHint<typeof spec> => getFieldForSpec(spec, allowExtraFields).validate(value) as unknown as TypeHint<typeof spec>

export const serialize = (
  spec: SpecUnion,
  value: TypeHint<typeof spec>
): Json => getFieldForSpec(spec).serialize(value)
