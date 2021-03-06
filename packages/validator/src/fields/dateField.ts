import { declareField } from '../core'

import { FieldWithRegExpSupport } from './segmentField'

const DateRegexps = {
  'date': /\d{4}-\d{2}-\d{2}/,
  'date-time': /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/,
  'time': /\d{2}:\d{2}:\d{2}(\.\d{3})?Z/,
}

export interface DateField extends FieldWithRegExpSupport<Date> {
  format: keyof typeof DateRegexps
  serialize(input: Date): string
}

export default declareField('@spec-validator/validator/fields/dateField', (
  format: keyof typeof DateRegexps = 'date-time'
): DateField => {
  const regex = DateRegexps[format]
  const result = {
    regex,
    validate: (value: any): Date => {
      if (typeof value !== 'string') {
        throw 'Not a string'
      }
      if (!regex.test(value)) {
        throw `Invalid ${format} string`
      }
      if (format === 'date-time') {
        return new Date(value)
      } else if (format === 'date') {
        return new Date(value)
      } else {
        return new Date('1970-01-01T' + value)
      }
    },
    serialize: (deserialized: Date) => {
      if (format === 'date-time') {
        return deserialized.toISOString()
      } else if (format === 'date') {
        return deserialized.toISOString().split('T')[0]
      } else {
        return deserialized.toISOString().split('T')[1]
      }
    },
  } as DateField

  result.getStringField = () => result
  result.format = format

  return result
})
