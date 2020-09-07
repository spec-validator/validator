import { declareParametrizedField } from '../core';
import { optionalOf } from './optional';

const stringField = declareParametrizedField({
  defaultParams: {
    minLength: optionalOf<number>(),
    maxLength: optionalOf<number>(),
    description: optionalOf<string>()
  },
  validate: (params, value): string => {
    if (typeof value !== 'string') {
      throw 'Not a string'
    }
    if (params?.minLength !== undefined) {
      if (value.length < params.minLength) {
        throw 'String is too short'
      }
    }
    if (params?.maxLength !== undefined) {
      if (value.length > params.maxLength) {
        throw 'String is too long'
      }
    }
    return value;
  }
})

export default stringField;
