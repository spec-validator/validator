import { Field, SpecUnion, TypeHint } from '../core'
import { Json } from '../Json'
import { merge } from '../utils'
import booleanField from './booleanField'
import choiceField from './choiceField'
import objectField from './objectField'
import stringField from './stringField'


type Unioned<T extends SpecUnion<any>[]> = {
  [P in keyof T]: T[P] extends SpecUnion<any> ? TypeHint<T[P]> : never
};

const bla = <T extends SpecUnion<any>[]>(alts: T): Unioned<T> => null as any

const ff = bla([stringField(), choiceField([1, 2, 3] as const), booleanField(), objectField({foo: stringField()})])


/*

import { Field } from '../core'
import { WithRegExp } from '../WithStringInputSupport'
import { escapeRegex } from '../utils'
import { Primitive, Json } from '../Json'

type Unioned<T extends SpecUnion<any>[]> = {
  [P in keyof T]: T[P] extends SpecUnion<any> ? TypeHint<T[P]> : never
};

type Params<Variants extends SpecUnion<any>[]> = {
  readonly variants: Variants,
  readonly description?: string
}

class ChoiceField<
  Variants extends SpecUnion<any>[]
> implements Field<Variants> {
  private choicesSet: Set<Primitive>

  constructor(readonly params: Params<readonly Choice[]>) {
    this.choicesSet = new Set(params.choices)
  }
  getFieldWithRegExp(): Field<unknown> & WithRegExp {
    return new ChoiceFieldWithRegExp(this.params)
  }

  validate(value: any): Unioned<Variants> {
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


const choiceField = <
  Choice extends Primitive,
> (choices: readonly Choice[], description?: string): ChoiceField<Choice> =>
    new ChoiceField({
      choices,
      description
    })

export default choiceField

*/
