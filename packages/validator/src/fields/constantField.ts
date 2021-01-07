import { Field } from '../core'
import { Primitive } from '../Json'
import { field } from '../registry'

export interface ConstantField<Constant extends Primitive> extends Field<Constant> {
  readonly constant: Constant
}

export default field('@validator/fields.ConstantField', <Constant extends Primitive> (
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
