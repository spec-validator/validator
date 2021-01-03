import { Field } from '../core'
import { Json } from '../Json'
import { OfType, declareField } from '../registry'

export interface ConstantField<Constant extends Json> extends Field<Constant> {
  readonly constant: Constant
}

class _ConstantField<Constant extends Json> implements Field<Constant> {
  constructor(readonly constant: Constant) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  validate(value: any): Constant {
    if (value !== this.constant) {
      throw 'Constant does not match the requirement'
    }
    return this.constant
  }
  serialize(_: Constant): Json {
    return this.constant
  }
}

const t = '@validator/fields.ConstantField' as const
type Type = OfType<typeof t>
export default declareField(t, _ConstantField) as
  (<Constant extends Json> (
    constant: Constant
  ) => ConstantField<Constant> & Type) & Type
