import { declareField, Field, OfType, SpecUnion } from '@spec-validator/validator/core'
import { Any } from '@spec-validator/utils/util-types'

import withDecor from '@spec-validator/validator/withDecor'

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
) =>
    withDecor(innerSpec, (inner: Field<T>): WithDoc<T> => ({
      innerSpec,
      doc,
      validate: (it: any) => inner.validate(it),
      serialize: (it: T) => inner.serialize(it),
    })))
