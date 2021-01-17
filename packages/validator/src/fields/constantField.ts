import { Primitive } from '@spec-validator/utils/Json'
import { declareField, Field } from '../core'

export interface ConstantField<Constant extends Primitive> extends Field<Constant> {
  readonly constant: Constant
}

export default declareField('@spec-validator/fields.ConstantField', <Constant extends Primitive> (
  constant: Constant
): ConstantField<Constant> => ({
    constant,
    validate: (value: any): Constant => {
      if (value !== constant) {
        throw `${value} !== ${constant}`
      }
      return constant
    },
    serialize: () => constant,
  }))
