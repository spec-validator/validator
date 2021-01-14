import { Json } from '../../utils/src/Json'
import { Field, TypeHint, SpecUnion, isArraySpec, isFieldSpec, isObjectSpec } from './core'
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

// The whole point of the library is to validate wildcard objects
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const validate = <TSpec extends SpecUnion<unknown>> (
  spec: TSpec,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  value: any,
  allowExtraFields = false
): TypeHint<TSpec> => getFieldForSpec(spec, allowExtraFields).validate(value) as unknown as TypeHint<TSpec>

export const serialize = <TSpec extends SpecUnion<unknown>> (
  spec: TSpec,
  value: TypeHint<TSpec>
): Json => getFieldForSpec(spec).serialize(value)
