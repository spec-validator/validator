import { declareField, TypeHint, withErrorDecoration } from '@spec-validator/validator/core'
import {
  FieldWithRegExp,
  FieldWithStringInputSupport,
} from '@spec-validator/validator/fields/segmentField'
import { StringObjectSpec } from './stringSpec'

export interface HeaderObjectField<Spec extends StringObjectSpec = StringObjectSpec>
  extends FieldWithStringInputSupport<TypeHint<Spec>>, FieldWithRegExp<TypeHint<Spec>> {
  readonly objectSpec: Spec,
  readonly separator: string
  readonly regex: RegExp
  serialize(input: TypeHint<Spec>): string
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie
const SEPARATOR = '; '

export default declareField('@spec-validator/rest-api/fields/headerObjectField', <Spec extends StringObjectSpec>(
  objectSpec: Spec
): HeaderObjectField<Spec> => {

  const regex = '.+=.+'

  const result = {
    objectSpec,
    regex: new RegExp(`${regex}(${SEPARATOR}${regex})*`),
    validate: (value: any): TypeHint<Spec> => {
      if (typeof value !== 'string') {
        throw 'Not a string'
      }
      const payload = Object.fromEntries(value.split(SEPARATOR)
        .map(it =>it.split(/=(.*)/, 2)))

      return Object.fromEntries(Object.entries(objectSpec).map(([key, valueSpec]) => [
        key, withErrorDecoration(key, () => valueSpec.getFieldWithRegExp().validate(
          decodeURI(payload[key]))
        ),
      ])) as TypeHint<Spec>
    },
    serialize: (deserialized: TypeHint<Spec>): string =>
      Object.entries(objectSpec)
        .map(([key, valueSpec]) => [
          key, withErrorDecoration(key, () => encodeURI(valueSpec.getFieldWithRegExp().serialize(deserialized[key]))),
        ])
        .map(([key, value]) => `${key}=${value}`)
        .join(SEPARATOR),
  } as HeaderObjectField<Spec>

  result.getFieldWithRegExp = () => result

  return result
})
