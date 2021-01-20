import { Any } from '@spec-validator/utils/util-types'
import { declareField, TypeHint, withErrorDecoration } from '@spec-validator/validator/core'
import {
  FieldWithStringInputSupport,
} from '@spec-validator/validator/fields/segmentField'

export type HeaderSpec<DeserializedType extends Record<string, Any> = Record<string, Any>> = {
  [P in keyof DeserializedType]: FieldWithStringInputSupport<DeserializedType[P]>
}

export interface HeaderObjectField<Spec extends HeaderSpec = HeaderSpec>
  extends FieldWithStringInputSupport<TypeHint<Spec>> {
  readonly objectSpec: Spec,
  readonly separator: string
  readonly regex: RegExp
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie
export default declareField('@spec-validator/rest-api/fields/headerObjectField', <Spec extends HeaderSpec>(
  objectSpec: Spec,
  separator='; '
): HeaderObjectField<Spec> => {

  const regex = '.+=.+'

  const result = {
    objectSpec,
    separator,
    regex: new RegExp(`${regex}(${separator}${regex})*`),
    validate: (value: any): TypeHint<Spec> => {
      if (typeof value !== 'string') {
        throw 'Not a string'
      }
      const payload = Object.fromEntries(value.split(separator)
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
        .join(separator),
  } as HeaderObjectField<Spec>

  result.getFieldWithRegExp = () => result

  return result
})
