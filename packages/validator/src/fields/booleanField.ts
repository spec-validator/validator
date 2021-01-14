import { declareField, OfType } from '../core'
import { Json } from '@spec-validator/utils/Json'
import { FieldWithRegExp, FieldWithStringInputSupport } from './segmentField'

export type BooleanField = FieldWithStringInputSupport<boolean>

export default declareField('@spec-validator/fields.BooleanField', (): BooleanField => {
  const validate = (value: any): boolean => {
    if (value !== true && value !== false) {
      throw 'Not a boolean'
    }
    return value
  }
  const serialize = (deserialized: boolean): Json => deserialized

  const result = {
    validate,
    serialize,
  } as BooleanField & OfType<string>

  result.getFieldWithRegExp = ():
    Omit<BooleanField, 'getFieldWithRegExp'> & FieldWithRegExp<boolean> & OfType<string> => ({
    type: result.type,
    validate: (value: any) => {
      if (value === 'true' || value === '1') {
        value = true
      }
      if (value === 'false' || value === '0') {
        value = false
      }
      return validate(value)
    },
    serialize: (value: boolean): string => value.toString(),
    regex: /true|false|1|0/,
  })

  return result
})
