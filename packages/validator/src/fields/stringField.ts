import { declareField } from '../core'
import { FieldWithStringInputSupport, FieldWithRegExp } from './segmentField'

export interface StringField extends FieldWithStringInputSupport<string>, FieldWithRegExp<string> {}

export default declareField('@spec-validator/validator/fields/stringField', (
  regex?: RegExp
): StringField => {
  const result = {
    regex: regex || /.*/,
    validate: (value: any): string => {
      if (typeof value !== 'string') {
        throw 'Not a string'
      }
      if (regex) {
        const match = value.match(regex)
        if (!match) {
          throw 'Doesn\'t match a regex'
        }
      }
      return value
    },
    serialize: (deserialized: string) => deserialized,
  } as StringField

  result.getFieldWithRegExp = () => result

  return result
})
