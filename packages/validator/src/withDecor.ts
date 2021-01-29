import { Field, SpecUnion, StringBasedField } from './core'
import {
  FieldWithRegExpSupport, isFieldWithStringInputSupport,
} from './fields/segmentField'
import { getFieldForSpec } from './interface'

export type Decor<
  FieldIn extends Field<unknown>,
  SpecIn extends SpecUnion,
  T = ReturnType<FieldIn['validate']>
> = SpecIn extends FieldWithRegExpSupport<T> ? FieldIn & {
  getStringField(): StringBasedField<T, SpecIn>
} : FieldIn

/**
 * Apply decoration to the fields respecting their string input acceptance
 */
export default <
  T,
  FieldIn extends Field<T>,
  SpecIn extends SpecUnion,
  Out extends Field<T>
>(
  innerSpec: SpecIn,
  getRawField: (fieldForSpec: FieldIn) => Out
): Decor<Out, SpecIn> => {
  const innerField = getFieldForSpec(innerSpec) as any

  const raw = getRawField(innerField)

  if (isFieldWithStringInputSupport(innerField)) {
    const withRegex = innerField.getStringField() as any
    return {
      ...raw,
      getStringField: () => ({
        ...getRawField(withRegex),
        regex: withRegex.regex,
      }),
    } as any
  } else {
    return getRawField(innerField) as any
  }
}
