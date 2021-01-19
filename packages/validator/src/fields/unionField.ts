import { getFieldForSpec } from '../interface'
import { Field, SpecUnion, TypeHint, declareField } from '../core'

export type Unioned<T extends SpecUnion<unknown>[]> = {
  [P in keyof T]: T[P] extends SpecUnion<unknown> ? TypeHint<T[P]> : never
}[number]

export interface UnionField<Variants extends SpecUnion<any>[]> extends Field<Unioned<Variants>> {
  readonly variants: Variants
}

export default declareField('@spec-validator/validator/fields/unionField', <Variants extends SpecUnion<unknown>[]> (
  ...variants: Variants
): UnionField<Variants> => {
  const fieldVariants = variants.map(it => getFieldForSpec(it))
  return {
    variants,
    validate: (value: any): Unioned<Variants> => {
      for (const variant of fieldVariants) {
        try {
          return variant.validate(value) as Unioned<Variants>
        } catch {
          // SKIP
        }
      }
      throw 'Invalid variant'
    },
    serialize: (deserialized: Unioned<Variants>) => {
      for (const variant of fieldVariants) {
        try {
          return variant.serialize(variant.validate(deserialized))
        } catch {
          // SKIP
        }
      }
      throw 'Invalid variant - should have matched'
    },
  }
})
