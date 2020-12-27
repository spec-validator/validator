import { escapeRegex, withParentFields } from '../utils'
import { Primitive, Json } from '../Json'
import { declareField, OfType } from '../registry'
import { FieldWithRegExp, FieldWithStringInputSupport } from './segmentField'

class ChoiceField<
  Choice extends Primitive,
> implements FieldWithStringInputSupport<Choice> {
  choices: readonly Choice[]
  private choicesSet: Set<Primitive>

  constructor(...choices: readonly Choice[]) {
    this.choices = choices
    this.choicesSet = new Set(choices)
  }
  getFieldWithRegExp(): ChoiceFieldWithRegExp<Choice> {
    return withParentFields(this, new ChoiceFieldWithRegExp(...this.choices), ['type'])
  }

  validate(value: any): Choice {
    if (this.choicesSet.has(value)) {
      return value as Choice
    }
    throw 'Invalid choice'
  }
  serialize(deserialized: Choice): Json {
    return deserialized as unknown as Primitive
  }
}

class ChoiceFieldWithRegExp<
  Choice extends Primitive
> extends ChoiceField<Choice> implements FieldWithRegExp<Choice> {

  private fullChoiceMap: Map<any, Primitive>

  constructor(...choices: readonly Choice[]) {
    super(...choices)
    this.fullChoiceMap = new Map<any, Primitive>()

    choices.forEach(it => {
      this.fullChoiceMap.set(it, it)
      this.fullChoiceMap.set(it.toString(), it)
    })
  }

  asString(value: Choice) {
    return value.toString()
  }

  get regex() {
    return new RegExp(Object.keys(this.choices)
      .map(it => it.toString())
      .map(escapeRegex)
      .join('|')
    )
  }

  validate(value: any): Choice {
    return super.validate(this.fullChoiceMap.get(value))
  }

}

const t = '@validator/fields.ChoiceField' as const
type Type = OfType<typeof t>
export default declareField(t, ChoiceField) as
  (<Choice extends Primitive> (...choices: readonly Choice[]) => ChoiceField<Choice> & Type) & Type
