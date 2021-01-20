import { Field, SpecUnion } from './core'
import {
  FieldWithRegExp, FieldWithStringInputSupport, isFieldWithStringInputSupport,
} from './fields/segmentField'
import { getFieldForSpec } from './interface'

export type Decor<
  FieldIn extends Field<unknown>,
  SpecIn extends SpecUnion<unknown>,
  T = ReturnType<FieldIn['validate']>
> = SpecIn extends FieldWithStringInputSupport<T> ? FieldIn & {
  getFieldWithRegExp(): FieldWithRegExp<T>
} : FieldIn

/**
 * Apply decoration to the fields respecting their string input acceptance
 */
export default <
  FieldIn extends Field<unknown>,
  SpecIn extends SpecUnion<unknown>,
  Out extends Field<unknown>
>(
  innerSpec: SpecIn,
  getRawField: (fieldForSpec: FieldIn) => Out
): Decor<Out, SpecIn> => {
  const innerField = getFieldForSpec(innerSpec) as any

  const raw = getRawField(innerField)

  if (isFieldWithStringInputSupport(innerField)) {
    const withRegex = innerField.getFieldWithRegExp() as any
    return {
      ...raw,
      getFieldWithRegExp: () => ({
        ...getRawField(withRegex),
        regex: withRegex.regex,
      }),
    } as any
  } else {
    return getRawField(innerField) as any
  }
}
