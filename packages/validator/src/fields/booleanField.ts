import { declareField } from '../core'
import { Json } from '@spec-validator/utils/Json'
import { FieldWithRegExpSupport } from './segmentField'

export type BooleanField = FieldWithRegExpSupport<boolean>

export default declareField('@spec-validator/validator/fields/booleanField', (): BooleanField => {
  const base = {
    validate: (value: any): boolean => {
      if (value !== true && value !== false) {
        throw 'Not a boolean'
      }
      return value
    },
    serialize: (deserialized: boolean): Json => deserialized,
    regex: /true|false|1|0/,
  }
  return {
    ...base,
    getStringField: () => ({
      ...base,
      validate: (value: any): boolean => {
        if (value === 'true' || value === '1') {
          return true
        }
        if (value === 'false' || value === '0') {
          return false
        }
        return base.validate(value)
      },
      serialize: (value: boolean): string => value.toString(),
    }),
  }

})
