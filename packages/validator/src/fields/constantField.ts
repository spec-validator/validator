import { Primitive } from '@spec-validator/utils/Json'
import { declareField, Field } from '../core'

export interface ConstantField<Constant extends Primitive> extends Field<Constant> {
  readonly constant: Constant
}

export default declareField('@spec-validator/validator/fields/constantField', <Constant extends Primitive> (
  constant: Constant
): ConstantField<Constant> => ({
    constant,
    validate: (value: any): Constant => {
      if (value !== constant) {
        throw 'Constant does not match the requirement'
      }
      return constant
    },
    serialize: () => constant,
  }))
