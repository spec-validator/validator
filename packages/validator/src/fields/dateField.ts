import { declareField } from '../core'

import { FieldWithRegExp, FieldWithStringInputSupport } from './segmentField'

export interface DateField extends FieldWithStringInputSupport<Date>, FieldWithRegExp<Date> {}

export default declareField('@spec-validator/fields.DateField', (): DateField => {
  const result = {
    regex: /.*/,
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
