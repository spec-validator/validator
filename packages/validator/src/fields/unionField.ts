import { Field, TypeHint } from '../core'
import { Json } from '../Json'

type Unioned<T extends Field<any>[]> = {
  [P in keyof T]: T[P] extends Field<any> ? TypeHint<T[P]> : never
}[number];

type Params<Variants extends readonly Field<any>[]> = {
  readonly variants: Variants,
  readonly description?: string
}

class UnionField<
  Variants extends Field<any>[]
> implements Field<Variants> {

  constructor(readonly params: Params<Variants>) {}

  validate(value: any): Unioned<Variants> {
    for (const variant of this.params.variants) {
      try {
        return variant.validate(value)
      } catch {
        // SKIP
      }
    }
    throw 'Invalid variant'
  }
  serialize(deserialized: Unioned<Variants>): Json {
    for (const variant of this.params.variants) {
      try {
        return variant.serialize(variant.validate(deserialized))
      } catch {
        // SKIP
      }
    }
    throw 'Invalid variant - should have matched'
  }
  getParams() {
    return {
      description: this.params.description,
      innerSpecs: this.params.variants.map(it => it.getParams())
    }
  }

}

const unionField = <
  Variants extends Field<any>[],
> (variants: Variants, description?: string): UnionField<Variants> =>
    new UnionField({
      variants,
      description
    })

export default unionField
