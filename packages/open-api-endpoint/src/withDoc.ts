import { declareField, Field } from '@spec-validator/validator/core'
import { Any } from '@spec-validator/utils/util-types'

type Example<T extends Any> = {
  value: T,
  summary: string
}

type Doc<T extends Any> = {
  description?: string,
  format?: string,
  examples?: Record<string, Example<T>>
}

export interface WithDoc<T extends Any, F extends Field<T>> extends Field<T> {
  readonly innerField: F,
  readonly doc: Doc<T>
}

export default declareField('@spec-validator/fields.WithDoc', <T extends Any, F extends Field<T>> (
  innerField: F,
  doc: Doc<T>
): WithDoc<T, F> => ({
    innerField,
    doc,
    validate: (it) => innerField.validate(it),
    serialize: (it) => innerField.serialize(it),
  }))
