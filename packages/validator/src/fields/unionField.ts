import { Field, TypeHint } from '../core'
import { declareField, OfType } from '../registry'
import { Json } from '../Json'

type Unioned<T extends Field<any>[]> = {
  [P in keyof T]: T[P] extends Field<any> ? TypeHint<T[P]> : never
}[number];

class UnionField<
  Variants extends Field<any>[]
> implements Field<Variants> {
  readonly variants: Variants

  constructor(...variants: Variants) {
    this.variants = variants
  }

  validate(value: any): Unioned<Variants> {
    for (const variant of this.variants) {
      try {
        return variant.validate(value)
      } catch {
        // SKIP
      }
    }
    throw 'Invalid variant'
  }
  serialize(deserialized: Unioned<Variants>): Json {
    for (const variant of this.variants) {
      try {
        return variant.serialize(variant.validate(deserialized))
      } catch {
        // SKIP
      }
    }
    throw 'Invalid variant - should have matched'
  }
}

const t = '@validator/fields.UnionField' as const
type Type = OfType<typeof t>
export default declareField(t, UnionField) as
  (<Variants extends Field<any>[]> (...variants: Variants) => UnionField<Variants> & Type) & Type
