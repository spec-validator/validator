import { Field, TypeHint } from '../core'
import { Json } from '../Json'

type Unioned<T extends Field<any>[]> = {
  [P in keyof T]: T[P] extends Field<any> ? TypeHint<T[P]> : never
}[number];

const FieldSymbol = Symbol('@validator/fields.UnionField')

class UnionField<
  Variants extends Field<any>[]
> implements Field<Variants> {

  constructor(private readonly variants: Variants) {}

  type = FieldSymbol

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

const unionField = <
  Variants extends Field<any>[],
> (...variants: Variants): UnionField<Variants> =>
    new UnionField(variants)

unionField.type = FieldSymbol

export default unionField
