import { escapeRegex } from '@spec-validator/utils/utils'
import { Primitive, Json } from '@spec-validator/utils/Json'
import { declareField } from '../core'
import { FieldWithRegExpSupport } from './segmentField'

export interface ChoiceField<Choice extends Primitive> extends FieldWithRegExpSupport<Choice> {
  choices: readonly Choice[]
}

export default declareField('@spec-validator/validator/fields/choiceField', <Choice extends Primitive>(
  ...choices: readonly Choice[]
): ChoiceField<Choice> => {
  const choicesSet = new Set(choices)

  const base = {
    choices,
    regex: new RegExp(
      Object.keys(choices)
        .map(it => it.toString())
        .map(escapeRegex)
        .join('|')
    ),
    validate: (value: any): Choice => {
      if (choicesSet.has(value)) {
        return value as Choice
      }
      throw 'Invalid choice'
    },
    serialize: (deserialized: Choice): Json => deserialized,
  }

  return {
    ...base,
    getStringField: () => {
      const fullChoiceMap: Map<any, Primitive> = new Map<any, Primitive>()
      choices.forEach(it => {
        fullChoiceMap.set(it, it)
        fullChoiceMap.set(it.toString(), it)
      })
      return {
        ...base,
        serialize: (value: Choice) => value.toString(),
        validate: (value: any): Choice => base.validate(fullChoiceMap.get(value)),
      }
    },
  }
})
