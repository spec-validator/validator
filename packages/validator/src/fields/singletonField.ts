import { Field } from '../core'
import { Json } from '../Json'

class SingletonField<Choice extends Json> implements Field<Choice> {
  constructor(private readonly choice: Choice) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  validate(_: any): Choice {
    return this.choice
  }
  serialize(_: Choice): Json {
    return this.choice
  }
  getParams(): Json  {
    return
  }
}

export default <Choice extends Json>(choice: Choice): SingletonField<Choice> => new SingletonField(choice)
