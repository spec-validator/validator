import { declareField, Field, OfType, SpecUnion, TypeHint } from '@spec-validator/validator/core'

import withDecor from '@spec-validator/validator/withDecor'

type Example<T> = {
  value: T,
  summary: string
}

type Doc<T> = {
  description?: string,
  format?: string,
  examples?: Record<string, Example<T>>
}

export interface WithDoc<Spec extends SpecUnion, T = TypeHint<Spec>> extends Field<T> {
  readonly innerSpec: Spec,
  readonly doc: Doc<T>
}

// workaround for: https://github.com/microsoft/TypeScript/issues/42349
export type Placeholder = OfType<'Placeholder'>

export default declareField('@spec-validator/fields.WithDoc', <Spec extends SpecUnion, T = TypeHint<Spec>> (
  innerSpec: Spec,
  doc: Doc<T>
) =>
    withDecor(innerSpec, (inner: Field<T>): WithDoc<Spec, T> => ({
      innerSpec,
      doc,
      validate: (it: any) => inner.validate(it),
      serialize: (it: T) => inner.serialize(it),
    })))
