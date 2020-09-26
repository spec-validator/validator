import { Field, Json, Primitive } from '../core';

type Params<Choices> = {
  choices: Choices,
  description?: string
}

class ChoiceField<Choices extends readonly Primitive[], T=Choices[number]> implements Field<T> {
  private params: Params<Choices>
  private choicesSet: Set<Primitive>

  constructor(params: {
    choices: Choices,
    description?: string
  }) {
    this.params = params
    this.choicesSet = new Set(params.choices)
  }

  validate(value: any): T {
    if (!this.choicesSet.has(value)) {
      throw 'Invalid choice'
    }
    return value as T
  }
  serialize(deserialized: T): Json {
    return deserialized as unknown as Primitive
  }
  getParams() {
    return this.params
  }

}


const choiceField = <Choices extends readonly Primitive[], T=Choices[number]> (params: Params<Choices>): Field<T> =>
  new ChoiceField(params)

export default choiceField;

