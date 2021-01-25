import { declareField } from '../core'
import { Json } from '@spec-validator/utils/Json'
import { FieldWithRegExpSupport } from './segmentField'

export interface NumberField extends FieldWithRegExpSupport<number> {
  canBeFloat: boolean
  signed: boolean
}

export default declareField('@spec-validator/validator/fields/numberField', ({ canBeFloat, signed }: {
  readonly canBeFloat?: boolean,
  readonly signed?: boolean
} = {}): NumberField => {
  const parts: string[] = []
  if (signed) {
    parts.push('-?')
  }
  parts.push('\\d+')
  if (canBeFloat) {
    parts.push('(\\.\\d+)?')
  }

  const base = {
    canBeFloat: canBeFloat || false,
    signed: signed || false,
    regex: RegExp(parts.join('')),
    validate: (value: any): number => {
      if (typeof value !== 'number') {
        throw 'Not a number'
      }
      if (!canBeFloat && value !== Math.floor(value)) {
        throw 'Not an int'
      }
      if (!signed && value < 0) {
        throw 'Must be unsigned'
      }
      return value
    },
    serialize: (deserialized: number): Json => deserialized,
  }

  return {
    ...base,
    getStringField: () => ({
      ...base,
      validate: (value: any) => base.validate(Number.parseFloat(value)),
      serialize: (value: number) => value.toString(),
    }),
  }

})
