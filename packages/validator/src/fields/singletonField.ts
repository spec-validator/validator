import { Field } from '../core'
import { Json } from '../Json'
import { OfType, declareField } from '../registry'

class SingletonField<Choice extends Json> implements Field<Choice> {
  constructor(private readonly choice: Choice) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  validate(_: any): Choice {
    return this.choice
  }
  serialize(_: Choice): Json {
    return this.choice
  }
}

const t = '@validator/fields.SingletonField' as const
type Type = OfType<typeof t>
export default declareField(t, SingletonField) as
  (<Choice extends Json> (
    choice: Choice
  ) => SingletonField<Choice> & Type) & Type
