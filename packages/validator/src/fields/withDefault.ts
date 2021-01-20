import { declareField, Field, SpecUnion } from '../core'
import { getFieldForSpec } from '../interface'
import { Any } from '@spec-validator/utils/util-types'
import { FieldWithRegExp, FieldWithStringInputSupport, isFieldWithStringInputSupport } from './segmentField'

export interface WithDefault<T extends Any> extends Field<T> {
  readonly innerSpec: SpecUnion<T>,
  readonly defaultValue: T
}

export default declareField('@spec-validator/validator/fields/withDefault', <T extends Any, Spec extends SpecUnion<T>> (
  innerSpec: Spec & SpecUnion<T>,
  defaultValue: T
): Spec extends FieldWithStringInputSupport<T>
? WithDefault<T> & { getFieldWithRegExp(): FieldWithRegExp<T> }
: WithDefault<T> => {
  const innerField = getFieldForSpec(innerSpec) as Field<T>
  const getRawField = (inner: Field<T>): WithDefault<T> => ({
    innerSpec,
    defaultValue,
    validate: (value: any): T => {
      if (value === undefined) {
        value = defaultValue
      }
      return inner.validate(value)
    },
    serialize: (deserialized: T) => inner.serialize(deserialized),
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
