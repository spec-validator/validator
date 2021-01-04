import { field, OfType } from '../registry'
import { FieldWithStringInputSupport, FieldWithRegExp } from './segmentField'

export interface StringField extends FieldWithStringInputSupport<string>, FieldWithRegExp<string> {}

export default field('@validator/fields.StringField', (
  regex?: RegExp
): StringField => {
  const field = {
    regex,
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
    serialize: (deserialized: string) => deserialized
  } as StringField & OfType<string>

  field.getFieldWithRegExp = () => field

  return field
})
