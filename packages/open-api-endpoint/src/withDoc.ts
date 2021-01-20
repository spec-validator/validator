import { declareField, Field, OfType, SpecUnion } from '@spec-validator/validator/core'
import { Any } from '@spec-validator/utils/util-types'
import { getFieldForSpec } from '@spec-validator/validator/interface'
import {
  FieldWithStringInputSupport, FieldWithRegExp, isFieldWithStringInputSupport,
} from '@spec-validator/validator/fields/segmentField'

type Example<T extends Any> = {
  value: T,
  summary: string
}

type Doc<T extends Any> = {
  description?: string,
  format?: string,
  examples?: Record<string, Example<T>>
}

export interface WithDoc<T extends Any> extends Field<T> {
  readonly innerSpec: SpecUnion<T>,
  readonly doc: Doc<T>
}

// workaround for: https://github.com/microsoft/TypeScript/issues/42349
export type Placeholder = OfType<'Placeholder'>

export default declareField('@spec-validator/fields.WithDoc', <T extends Any, Spec extends SpecUnion<T>> (
  innerSpec: Spec & SpecUnion<T>,
  doc: Doc<T>
): Spec extends FieldWithStringInputSupport<T> ? WithDoc<T> & {
  getFieldWithRegExp(): FieldWithRegExp<T>
} : WithDoc<T> => {
  const innerField = getFieldForSpec(innerSpec) as Field<T>

  const getRawField = (inner: Field<T>): WithDoc<T> => ({
    innerSpec,
    doc,
    validate: (it: any) => inner.validate(it),
    serialize: (it: T) => inner.serialize(it),
  }) // as unknown as WithDoc<T> & FieldWithRegExp<T> & FieldWithStringInputSupport<T>

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
    return getRawField(innerField) as any
  }
})
