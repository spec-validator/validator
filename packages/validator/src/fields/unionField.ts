import { Field, serialize, SpecUnion, TypeHint, validate } from '../core'
import { declareField, OfType } from '../registry'
import { Json } from '../Json'

type Unioned<T extends SpecUnion<any>[]> = {
  [P in keyof T]: T[P] extends SpecUnion<any> ? TypeHint<T[P]> : never
}[number];

class UnionField<
  Variants extends SpecUnion<any>[]
> implements Field<Variants> {
  readonly variants: Variants

  constructor(...variants: Variants) {
    this.variants = variants
  }

  validate(value: any): Unioned<Variants> {
    for (const variant of this.variants) {
      try {
        return validate(variant, value)
      } catch {
        // SKIP
      }
    }
    throw 'Invalid variant'
  }
  serialize(deserialized: Unioned<Variants>): Json {
    for (const variant of this.variants) {
      try {
        return serialize(variant, validate(variant, deserialized))
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
