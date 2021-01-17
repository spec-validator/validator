import { declareField } from '../core'

import { FieldWithRegExp, FieldWithStringInputSupport } from './segmentField'

const DateRegexps = {
  'date': /\d{4}-\d{2}-\d{2}/,
  'date-time': /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/,
  'time': /\d{2}:\d{2}:\d{2}\.\d{3}Z/,
}

export interface DateField extends FieldWithStringInputSupport<Date>, FieldWithRegExp<Date> {
  format: keyof typeof DateRegexps
}

export default declareField('@spec-validator/fields.DateField', (
  format: keyof typeof DateRegexps
): DateField => {
  const regex = DateRegexps[format]
  const result = {
    regex,
    validate: (value: any): Date => {
      if (typeof value !== 'string') {
        throw 'Not a string'
      }
      if (!regex.test(value) || !Date.parse(value)) {
        throw 'Invalid date string'
      }
      return new Date(value)
    },
    serialize: (deserialized: Date) => deserialized.toISOString(),
  } as DateField

  result.getFieldWithRegExp = () => result
  result.format = format

  return result
})
