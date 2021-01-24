import { declareField, OfType, StringBasedField } from '../core'
import { Json } from '@spec-validator/utils/Json'
import { FieldWithRegExpSupport } from './segmentField'

export type BooleanField = FieldWithRegExpSupport<boolean>

export default declareField('@spec-validator/validator/fields/booleanField', (): BooleanField => {
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

  result.getStringField = (): StringBasedField<boolean, BooleanField> & OfType<string> => ({
    type: result.type,
    validate: (value: any): boolean => {
      if (value === 'true' || value === '1') {
        return true
      }
      if (value === 'false' || value === '0') {
        return false
      }
      return validate(value)
    },
    serialize: (value: boolean): string => value.toString(),
    regex: /true|false|1|0/,
  })

  return result
})
