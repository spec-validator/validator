import { Field } from '../core'
import { Json } from '../Json'
import { OfType, declareField } from '../registry'

export class ConstantField<Constant extends Json> implements Field<Constant> {
  constructor(readonly choice: Constant) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  validate(_: any): Constant {
    return this.choice
  }
  serialize(_: Constant): Json {
    return this.choice
  }
}

const t = '@validator/fields.ConstantField' as const
type Type = OfType<typeof t>
export default declareField(t, ConstantField) as
  (<Constant extends Json> (
    choice: Constant
  ) => ConstantField<Constant> & Type) & Type
