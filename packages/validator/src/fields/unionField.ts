import { serialize, validate } from '..'
import { Field, SpecUnion, TypeHint } from '../core'
import { field } from '../registry'

export type Unioned<T extends SpecUnion<unknown>[]> = {
  [P in keyof T]: T[P] extends SpecUnion<unknown> ? TypeHint<T[P]> : never
}[number];

export interface UnionField<Variants extends SpecUnion<any>[]> extends Field<Unioned<Variants>> {
  readonly variants: Variants
}

export default field('@validator/fields.UnionField', <Variants extends Field<unknown>[]> (
  ...variants: Variants
): UnionField<Variants> => ({
    variants,
    validate: (value: any): Unioned<Variants> => {
      for (const variant of variants) {
        try {
          return validate(variant, value) as Unioned<Variants>
        } catch {
          // SKIP
        }
      }
      throw 'Invalid variant'
    },
    serialize: (deserialized: Unioned<Variants>) => {
      for (const variant of variants) {
        try {
          return serialize(variant, validate(variant, deserialized))
        } catch {
          // SKIP
        }
      }
      throw 'Invalid variant - should have matched'
    },
  }))
