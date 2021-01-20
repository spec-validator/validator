import { declareField, Field, SpecUnion } from '../core'
import { getFieldForSpec } from '../interface'
import { Any, Optional } from '@spec-validator/utils/util-types'
import { FieldWithRegExp, FieldWithStringInputSupport, isFieldWithStringInputSupport } from './segmentField'
import { Json } from '@spec-validator/utils/Json'

export interface OptionalField<T extends Any, Spec extends SpecUnion<T>> extends Field<Optional<T>> {
  readonly innerSpec: Spec
}

export default declareField('@spec-validator/validator/fields/optional', <T extends Any, Spec extends SpecUnion<T>> (
  innerSpec: Spec
): Spec extends FieldWithStringInputSupport<unknown>
  ? OptionalField<T, Spec> & { getFieldWithRegExp(): FieldWithRegExp<Optional<T>> }
  : OptionalField<T, Spec> => {
  const innerField = getFieldForSpec(innerSpec) as Field<T>
  const getRawField = (inner: Field<T>): OptionalField<T, Spec> => ({
    innerSpec,
    validate: (value: any): Optional<T> => {
      if (value === undefined) {
        return value
      }
      return inner.validate(value)
    },
    serialize: (deserialized: Optional<T>): Json =>
      deserialized === undefined ?  undefined : inner.serialize(deserialized),
  })

  const raw = getRawField(innerField)

  if (isFieldWithStringInputSupport(innerField)) {
    const withRegex = innerField.getFieldWithRegExp() as FieldWithRegExp<T>

    return {
      ...raw,
      getFieldWithRegExp: () => ({
        ...getRawField(withRegex),
        regex: withRegex.regex,
      }),
    } as any

  } else {
    return raw as any
  }

})
