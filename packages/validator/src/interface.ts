import { Json } from '@spec-validator/utils/Json'
import { Field, TypeHint, SpecUnion, isArraySpec, isFieldSpec, isObjectSpec } from './core'
import { undefinedField, arrayField, objectField } from './fields'

export const getFieldForSpec = <Spec extends SpecUnion> (
  spec: Spec,
  allowExtraFields = false
): Field<TypeHint<Spec>> => {
  type F = Field<TypeHint<Spec>>
  if (isFieldSpec(spec)) {
    return spec as F
  } else if (isArraySpec(spec)) {
    return arrayField(getFieldForSpec(spec[0])) as unknown as F
  } else if (isObjectSpec(spec)) {
    return objectField(Object.fromEntries(
      Object.entries(spec).map(([key, value]) => [key, getFieldForSpec(value)])
    ), allowExtraFields) as unknown as F
  } else {
    return undefinedField() as F
  }
}

// The whole point of the library is to validate wildcard objects
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const validate = <Spec extends SpecUnion>(
  spec: Spec,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  value: any,
  allowExtraFields = false
): TypeHint<Spec> => getFieldForSpec(spec, allowExtraFields).validate(value) as unknown as TypeHint<Spec>

export const serialize = <Spec extends SpecUnion>(
  spec: Spec,
  value: TypeHint<Spec>
): Json => getFieldForSpec(spec).serialize(value)
