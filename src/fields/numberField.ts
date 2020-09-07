import { declareField } from "../core"

export const numberField = declareField({}, (_, value: any): number => {
  if (typeof value !== 'number') {
      throw 'Not a number'
  }
  return value
})
