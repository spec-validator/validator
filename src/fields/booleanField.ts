import { declareParametrizedField } from '../core'

const booleanField = declareParametrizedField({
  defaultParams: {},
  validate: (_, value: any): number => {
    if (typeof value !== 'number') {
      throw 'Not a number'
    }
    return value
  }
})

export default booleanField;
