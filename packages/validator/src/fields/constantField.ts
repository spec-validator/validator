import { Primitive } from '@spec-validator/utils/Json'
import { escapeRegex } from '@spec-validator/utils/utils'
import { declareField } from '../core'
import { FieldWithRegExpSupport } from './segmentField'

export interface ConstantField<Constant extends Primitive> extends FieldWithRegExpSupport<Constant> {
  readonly constant: Constant
}

export default declareField('@spec-validator/validator/fields/constantField', <Constant extends Primitive> (
  constant: Constant
): ConstantField<Constant> => {
  const base = {
    regex: new RegExp(escapeRegex(constant.toString())),
    constant,
    validate: (value: any): Constant => {
      if (value !== constant) {
        throw 'Constant does not match the requirement'
      }
      return constant
    },
    serialize: () => constant,
  }

  return {
    ...base,
    getStringField: () => ({
      ...base,
      validate: (value: string): Constant => {
        if (value !== constant.toString()) {
          throw 'Constant does not match the requirement'
        }
        return constant
      },
      serialize: (value: Constant): string => value.toString(),
    }),
  }
})
