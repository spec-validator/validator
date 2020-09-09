import { declareParametrizedField } from '../core'
import { optionalOf } from '../utils';

const booleanField = declareParametrizedField({
  defaultParams: {
    description: optionalOf<string>()
  },
  validate: (_, value: any): boolean => {
    if (value !== true && value !== false) {
      throw 'Not a boolean'
    }
    return value
  },
  serialize: (_, value: boolean) => value,
  getParams: (params) => params
})

export default booleanField;
