import { escapeRegex } from '@spec-validator/utils/utils'
import { Primitive, Json } from '@spec-validator/utils/Json'
import { declareField, OfType } from '../core'
import { FieldWithRegExpSupport } from './segmentField'
import { StringBasedField } from '../withStringSerialization'

export interface ChoiceField<Choice extends Primitive> extends FieldWithRegExpSupport<Choice> {
  choices: readonly Choice[]
}

export default declareField('@spec-validator/validator/fields/choiceField', <Choice extends Primitive>(
  ...choices: readonly Choice[]
): ChoiceField<Choice> => {
  const choicesSet = new Set(choices)

  const validate = (value: any): Choice => {
    if (choicesSet.has(value)) {
      return value as Choice
    }
    throw 'Invalid choice'
  }
  const serialize = (deserialized: Choice): Json => deserialized

  const result = {
    choices,
    validate,
    serialize,
  } as ChoiceField<Choice> & OfType<string>

  result.getStringField = (): StringBasedField<Choice, ChoiceField<Choice>> & OfType<string> => {

    const fullChoiceMap: Map<any, Primitive> = new Map<any, Primitive>()
    choices.forEach(it => {
      fullChoiceMap.set(it, it)
      fullChoiceMap.set(it.toString(), it)
    })

    return {
      type: result.type,
      choices,
      regex: new RegExp(
        Object.keys(choices)
          .map(it => it.toString())
          .map(escapeRegex)
          .join('|')
      ),
      serialize: (value: Choice) => value.toString(),
      validate: (value: any): Choice => validate(fullChoiceMap.get(value)),
    }
  }

  return result
})
