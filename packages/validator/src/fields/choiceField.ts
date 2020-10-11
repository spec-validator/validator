import { Field } from '../core'
import { WithRegExp, WithStringInputSupport } from '../WithStringInputSupport'
import { escapeRegex } from '../utils'
import { Primitive, Json } from '../Json'

type Params<Choices> = {
  choices: Choices,
  description?: string
}

class ChoiceField<
  Choice extends Primitive,
> implements Field<Choice>, WithStringInputSupport {
  protected params: Params<Choice[]>
  private choicesSet: Set<Primitive>

  constructor(params: Params<Choice[]>) {
    this.params = params
    this.choicesSet = new Set(params.choices)
  }
  getFieldWithRegExp(): Field<unknown> & WithRegExp {
    return new ChoiceFieldWithRegExp(this.params)
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
  getParams() {
    return this.params
  }

}

class ChoiceFieldWithRegExp<
  Choice extends Primitive
> extends ChoiceField<Choice> implements WithRegExp {

  private fullChoiceMap: Map<any, Primitive>

  constructor(params: Params<Choice[]>) {
    super(params)
    this.fullChoiceMap = new Map<any, Primitive>()

    params.choices.forEach(it => {
      this.fullChoiceMap.set(it, it)
      this.fullChoiceMap.set(it.toString(), it)
    })
  }

  regex() {
    return new RegExp(Object.keys(this.params.choices)
      .map(it => it.toString())
      .map(escapeRegex)
      .join('|')
    )
  }

  validate(value: any): Choice {
    return super.validate(this.fullChoiceMap.get(value))
  }

}

const choiceField = <
  Choice extends Primitive,
> (choices: Choice[], description?: string): ChoiceField<Choice> =>
    new ChoiceField({
      choices,
      description
    })

export default choiceField

