import { declareField, TypeHint, withErrorDecoration } from '@spec-validator/validator/core'
import {
  FieldWithStringInputSupport,
} from '@spec-validator/validator/fields/segmentField'
import { StringSpec } from './stringSpec'

export interface HeaderObjectField<Spec extends StringSpec = StringSpec>
  extends FieldWithStringInputSupport<TypeHint<Spec>> {
  readonly objectSpec: Spec,
  readonly separator: string
  readonly regex: RegExp
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie
const SEPARATOR = '; '

export default declareField('@spec-validator/rest-api/fields/headerObjectField', <Spec extends StringSpec>(
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
        key, withErrorDecoration(key, () => valueSpec.getFieldWithRegExp().validate(payload[key])),
      ])) as TypeHint<Spec>
    },
    serialize: (deserialized: TypeHint<Spec>): string =>
      Object.entries(objectSpec)
        .map(([key, valueSpec]) => [
          key, withErrorDecoration(key, () => valueSpec.getFieldWithRegExp().serialize(deserialized[key])),
        ])
        .map(([key, value]) => `${key}=${value}`)
        .join(SEPARATOR),
  } as HeaderObjectField<Spec>

  result.getFieldWithRegExp = () => result

  return result
})
