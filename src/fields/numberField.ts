import { declareParametrizedField } from '../core'
import { optionalOf } from '../utils';

const numberField = declareParametrizedField({
  defaultParams: {
    description: optionalOf<string>()
  },
  validate: (_, value: any): number => {
    if (typeof value !== 'number') {
      throw 'Not a number'
    }
    return value
  }
})

export default numberField;
