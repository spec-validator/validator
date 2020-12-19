import { Field, TypeHint } from '../core'
import { declareField } from '../docRegistry'
import { Json } from '../Json'

type Unioned<T extends Field<any>[]> = {
  [P in keyof T]: T[P] extends Field<any> ? TypeHint<T[P]> : never
}[number];

class UnionField<
  Variants extends Field<any>[]
> implements Field<Variants> {
  private readonly variants: Variants

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

export default declareField('@validator/fields.UnionField', UnionField) as
  <Variants extends Field<any>[]> (...variants: Variants) => UnionField<Variants>
