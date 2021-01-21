import { declareField, withErrorDecoration } from '@spec-validator/validator/core'
import { FieldWithStringInputSupport } from '@spec-validator/validator/fields/segmentField'

export interface HeaderArrayField<T> extends FieldWithStringInputSupport<T[]> {
  readonly itemField: FieldWithStringInputSupport<T>,
  readonly regex: RegExp
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Language
const SEPARATOR = ', '

export default declareField('@spec-validator/rest-api/fields/headerArrayField', <T>(
  itemField: FieldWithStringInputSupport<T>
): HeaderArrayField<T> => {

  const fieldWithStringSupport = itemField.getFieldWithRegExp()
  const regex = fieldWithStringSupport.regex.source

  const result = {
    itemField,
    regex: new RegExp(`${regex}(${SEPARATOR}${regex})+`),
    validate: (value: any): T[] => {
      if (typeof value !== 'string') {
        throw 'Not a string'
      }
      return value.split(SEPARATOR).map(
        (it, index) => withErrorDecoration(index, () => fieldWithStringSupport.validate(it))
      )
    },
    serialize: (deserialized: T[]): string =>
      deserialized.map(
        (it, index) => withErrorDecoration(index, () => fieldWithStringSupport.serialize(it))
      ).join(SEPARATOR),
  } as HeaderArrayField<T>

  result.getFieldWithRegExp = () => result

  return result
})
