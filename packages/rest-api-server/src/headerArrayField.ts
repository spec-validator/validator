import { declareField, withErrorDecoration } from '@spec-validator/validator/core'
import { FieldWithStringInputSupport } from '@spec-validator/validator/fields/segmentField'

export interface HeaderArrayField<T> extends FieldWithStringInputSupport<T[]> {
  readonly itemField: FieldWithStringInputSupport<T>,
  readonly separator: string
  readonly regex: RegExp
}

export default declareField('@spec-validator/rest-api/headerArrayField', <T>(
  itemField: FieldWithStringInputSupport<T>,
  separator=','
): HeaderArrayField<T> => {

  const fieldWithStringSupport = itemField.getFieldWithRegExp()
  const regex = fieldWithStringSupport.regex.source

  const result = {
    itemField,
    separator,
    regex: new RegExp(`${regex}(${separator}${regex})+`),
    validate: (value: any): T[] => {
      if (typeof value !== 'string') {
        throw 'Not a string'
      }
      return value.split(separator).map(
        (it, index) => withErrorDecoration(index, () => fieldWithStringSupport.validate(it))
      )
    },
    serialize: (deserialized: T[]): string =>
      deserialized.map(
        (it, index) => withErrorDecoration(index, () => fieldWithStringSupport.serialize(it))
      ).join(separator),
  } as HeaderArrayField<T>

  result.getFieldWithRegExp = () => result

  return result
})
