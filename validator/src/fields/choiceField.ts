import { Field, Json, Primitive } from '../core';
import { WithRegExp, WithRegExpSupport } from '../segmentChain';
import { escapeRegex } from '../utils';

type Params<Choices> = {
  choices: Choices,
  description?: string
}

class ChoiceField<Choices extends readonly Primitive[], T=Choices[number]> implements Field<T>, WithRegExpSupport {
  private params: Params<Choices>
  private choicesSet: Set<Primitive>

  constructor(params: Params<Choices>) {
    this.params = params
    this.choicesSet = new Set(params.choices)
  }
  getFieldWithRegExp(): Field<unknown> & WithRegExp {
    return new ChoiceFieldWithRegexp(this.params);
  }

  validate(value: any): T {
    if (this.choicesSet.has(value)) {
      return value as T
    }
    throw 'Invalid choice'
  }
  serialize(deserialized: T): Json {
    return deserialized as unknown as Primitive
  }
  getParams() {
    return this.params
  }

}

class ChoiceFieldWithRegexp<
  Choices extends readonly Primitive[]
> extends ChoiceField<Choices> implements WithRegExp {

  private fullChoiceMap: Map<any, Primitive>

  constructor(params: Params<Choices>) {
    super(params);
    this.fullChoiceMap = new Map<any, Primitive>()

    params.choices.forEach(it => {
      this.fullChoiceMap.set(it, it);
      this.fullChoiceMap.set(it.toString(), it)
    })
  }

  regex() {
    return new RegExp(Object.keys(this.fullChoiceMap).map(escapeRegex).join('|'));
  }

  validate(value: any): Choices[number] {
    return super.validate(this.fullChoiceMap.get(value));
  }

}

const choiceField = <
  Choices extends readonly Primitive[],
  T=Choices[number]
> (choices: Choices, description?: string): Field<T> & WithRegExpSupport =>
    new ChoiceField({
      choices,
      description
    })

export default choiceField;

