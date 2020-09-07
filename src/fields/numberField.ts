import { declareParametrizedField } from '../core'

const numberField = declareParametrizedField({
  defaultParams: {},
  validate: (_, value: any): number => {
    if (typeof value !== 'number') {
      throw 'Not a number'
    }
    return value
  }
})

export default numberField;
