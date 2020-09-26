import { Field, Json, Primitive } from '../core';
import { WithRegExp } from '../segmentChain';
import { escapeRegex } from '../utils';

type Params<Choices> = {
  choices: Choices,
  description?: string
}

class ChoiceField<Choices extends readonly Primitive[], T=Choices[number]> implements Field<T>, WithRegExp {
  private params: Params<Choices>
  private choicesSet: Set<Primitive>
  private stringChoiceMap: Record<string, Primitive>

  constructor(params: {
    choices: Choices,
    description?: string
  }) {
    this.params = params
    this.choicesSet = new Set(params.choices)
    this.stringChoiceMap = Object.fromEntries(params.choices.map(it => [it.toString(), it]))
  }
  regex() {
    return new RegExp(Object.keys(this.stringChoiceMap).map(escapeRegex).join('|'));
  }

  validate(value: any): T {
    if (this.choicesSet.has(value)) {
      return value as T
    }
    const mapped = this.stringChoiceMap[value];
    if (mapped !== undefined) {
      return mapped as any;
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

const choiceField = <
  Choices extends readonly Primitive[],
  T=Choices[number]
> (choices: Choices, description?: string): Field<T> & WithRegExp =>
    new ChoiceField({
      choices,
      description
    })

export default choiceField;

