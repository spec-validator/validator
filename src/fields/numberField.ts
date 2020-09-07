import { declareField } from "../core"

const numberField = declareField({}, (_, value: any): number => {
  if (typeof value !== 'number') {
      throw 'Not a number'
  }
  return value
})

export default numberField;
