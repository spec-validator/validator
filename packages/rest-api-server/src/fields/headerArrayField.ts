import { declareField, withErrorDecoration } from '@spec-validator/validator/core'
import { FieldWithRegExpSupport } from '@spec-validator/validator/fields/segmentField'

export interface HeaderArrayField<T> extends FieldWithRegExpSupport<T[]> {
  readonly itemField: FieldWithRegExpSupport<T>,
  readonly regex: RegExp,
  serialize(input: T[]): string
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Language
const SEPARATOR = ', '

export default declareField('@spec-validator/rest-api/fields/headerArrayField', <T>(
  itemField: FieldWithRegExpSupport<T>
): HeaderArrayField<T> => {

  const fieldWithStringSupport = itemField.getStringField()
  const regex = fieldWithStringSupport.regex.source

  const result = {
    itemField,
    regex: new RegExp(`${regex}(${SEPARATOR}${regex})+`),
    validate: (value: any): T[] => {
      if (typeof value !== 'string') {
        throw 'Not a string'
      }
      return value.split(SEPARATOR).map(
        (it, index) => withErrorDecoration(index, () => fieldWithStringSupport.validate(decodeURI(it)))
      )
    },
    serialize: (deserialized: T[]): string =>
      deserialized.map(
        (it, index) => withErrorDecoration(index, () => encodeURI(fieldWithStringSupport.serialize(it)))
      ).join(SEPARATOR),
  } as HeaderArrayField<T>

  result.getStringField = () => result

  return result
})
