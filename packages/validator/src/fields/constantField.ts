import { Primitive } from '@spec-validator/utils/Json'
import { escapeRegex } from '@spec-validator/utils/utils'
import { declareField } from '../core'
import { FieldWithRegExp, FieldWithRegExpSupport } from './segmentField'

export interface ConstantField<Constant extends Primitive> extends FieldWithRegExpSupport<Constant> {
  readonly constant: Constant
}

export default declareField('@spec-validator/validator/fields/constantField', <Constant extends Primitive> (
  constant: Constant
): ConstantField<Constant> => {

  const result = {
    regexp: escapeRegex(constant.toString()),
    constant,
    validate: (value: any): Constant => {
      if (value !== constant) {
        throw 'Constant does not match the requirement'
      }
      return constant
    },
    serialize: () => constant,
  } as unknown as ConstantField<Constant> & FieldWithRegExp<Constant>
  result.getStringField = () => result

  return result
})
