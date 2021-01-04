import { field, OfType } from '../registry'
import { Json } from '../Json'
import { FieldWithRegExp, FieldWithStringInputSupport } from './segmentField'

export interface NumberField extends FieldWithStringInputSupport<number> {
  readonly params?: {
    canBeFloat?: boolean
  }
}

export default field('@validator/fields.NumberField', (params?: {
  canBeFloat?: boolean
}): NumberField => {
  const validate = (value: any): number => {
    if (typeof value !== 'number') {
      throw 'Not a number'
    }
    if (!params?.canBeFloat && value !== Math.floor(value)) {
      throw 'Not an int'
    }
    return value
  }
  const serialize = (deserialized: number): Json => deserialized

  const field = {
    params,
    validate,
    serialize,
  } as NumberField & OfType<string>

  field.getFieldWithRegExp = (): Omit<NumberField, 'getFieldWithRegExp'> & FieldWithRegExp<number> & OfType<string> => {
    const parts: string[] = []
    parts.push('-?')
    parts.push('\\d+')
    if (params?.canBeFloat) {
      parts.push('(\\.\\d+)?')
    }

    return {
      params,
      type: field.type,
      validate: (value: any) => validate(Number.parseFloat(value)),
      serialize,
      regex: RegExp(parts.join('')),
      asString: (value: number): string => value.toString()
    }
  }

  return field
})
