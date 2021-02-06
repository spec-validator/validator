import { Field, FieldWithStringSupport, isFieldSpec, SpecUnion, StringBasedField } from './core'
import { getFieldForSpec } from './interface'

export type Decor<
  FieldIn extends Field<unknown>,
  SpecIn extends SpecUnion,
  T = ReturnType<FieldIn['validate']>
> = SpecIn extends FieldWithStringSupport<T> ? FieldIn & {
  getStringField(): StringBasedField<T, SpecIn>
} : FieldIn

const isFieldWithStringSupport = <DeserializedType>(obj: any):
  obj is FieldWithStringSupport<DeserializedType> =>
    isFieldSpec(obj) && typeof (obj as any).getStringField === 'function'

/**
 * Apply decoration to the fields respecting their string input acceptance
 */
export default <
  T,
  R,
  FieldIn extends Field<T>,
  SpecIn extends SpecUnion,
  Out extends Field<R>
>(
  innerSpec: SpecIn,
  getRawField: (fieldForSpec: FieldIn) => Out
): Decor<Out, SpecIn> => {
  const innerField = getFieldForSpec(innerSpec) as any

  const raw = getRawField(innerField) as any

  if (isFieldWithStringSupport(innerField)) {
    const withRegex = innerField.getStringField() as any
    return {
      ...raw,
      getStringField: () => ({
        ...getRawField(withRegex),
      }),
    } as any
  } else {
    return raw
  }
}
