import { Field } from '@validator/validator'
import { field } from '@validator/validator/registry'
import { Any } from '@validator/validator/util-types'

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

export default field('@validator/fields.WithDoc', <T extends Any, F extends Field<T>> (
  innerField: F,
  doc: Doc<T>
): WithDoc<T, F> => ({
    ...innerField,
    innerField,
    doc
  }))
