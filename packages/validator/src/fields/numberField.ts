import { declareField, OfType } from '../core'
import { Json } from '@spec-validator/utils/Json'
import { FieldWithRegExp, FieldWithStringInputSupport } from './segmentField'

export interface NumberField extends FieldWithStringInputSupport<number> {
  canBeFloat: boolean
  signed: boolean
}

export default declareField('@spec-validator/fields.NumberField', ({ canBeFloat, signed }: {
  readonly canBeFloat?: boolean,
  readonly signed?: boolean
} = {}): NumberField => {
  const validate = (value: any): number => {
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
  }
  const serialize = (deserialized: number): Json => deserialized

  const result = {
    canBeFloat,
    validate,
    serialize,
  } as NumberField & OfType<string>

  result.getFieldWithRegExp = ():
    Omit<NumberField, 'getFieldWithRegExp'> & FieldWithRegExp<number> & OfType<string> => {
    const parts: string[] = []
    if (signed) {
      parts.push('-?')
    }
    parts.push('\\d+')
    if (canBeFloat) {
      parts.push('(\\.\\d+)?')
    }

    return {
      canBeFloat: canBeFloat || false,
      signed: signed || false,
      type: result.type,
      validate: (value: any) => validate(Number.parseFloat(value)),
      serialize: (value: number) => value.toString(),
      regex: RegExp(parts.join('')),
    }
  }

  return result
})
