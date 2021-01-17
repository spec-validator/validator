import { declareField } from '../core'

import { FieldWithRegExp, FieldWithStringInputSupport } from './segmentField'

export interface DateField extends FieldWithStringInputSupport<Date>, FieldWithRegExp<Date> {}

const DateRegexps = {
  'date': /.*/,
  'date-time': /.*/,
  'time': /.*/,
}

export default declareField('@spec-validator/fields.DateField', ({ type }: {
  type: keyof typeof DateRegexps
}): DateField => {
  const result = {
    regex: DateRegexps[type],
    validate: (value: any): Date => {
      if (typeof value !== 'string') {
        throw 'Not a string'
      }
      if (!Date.parse(value)) {
        throw 'Invalid string'
      }
      return new Date(value)
    },
    serialize: (deserialized: Date) => deserialized.toISOString(),
  } as DateField

  result.getFieldWithRegExp = () => result

  return result
})
