import { declareParametrizedField } from '../core'
import { optionalOf } from '../utils';

const numberField = declareParametrizedField({
  defaultParams: {
    description: optionalOf<string>()
  },
  validate: (_, value: any): number => {
    value = Number.parseInt(value);
    if (typeof value !== 'number') {
      throw 'Not a number'
    }
    return value
  },
  serialize: (_, value: number) => value,
  getParams: (params) => params
})

export default numberField;
