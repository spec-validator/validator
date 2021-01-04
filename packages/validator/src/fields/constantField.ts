import { Field } from '../core'
import { Primitive } from '../Json'
import { OfType, declareField } from '../registry'

class ConstantField<Constant extends Primitive> implements Field<Constant> {
  constructor(readonly constant: Constant) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  validate(value: any): Constant {
    if (value !== this.constant) {
      throw 'Constant does not match the requirement'
    }
    return this.constant
  }
  serialize(_: Constant): Primitive {
    return this.constant
  }
}

const t = '@validator/fields.ConstantField' as const
type Type = OfType<typeof t>
export default declareField(t, ConstantField) as
  (<Constant extends Primitive> (
    constant: Constant
  ) => ConstantField<Constant> & Type) & Type
