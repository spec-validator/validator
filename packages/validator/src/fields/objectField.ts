import { Field, TypeHint, withErrorDecoration, declareField } from '../core'
import { Json } from '@spec-validator/utils/Json'
import { Any } from '@spec-validator/utils/util-types'

export type ObjectFields<DeserializedType extends Record<string, Any> = Record<string, Any>> = {
  [P in keyof DeserializedType]: Field<DeserializedType[P]>
}

export interface ObjectField<
  Spec extends ObjectFields = ObjectFields
> extends Field<TypeHint<Spec>> {
  readonly objectSpec: Spec
  readonly canHaveExtraKeys: boolean
}

const ensureNoExtraFields = (
  validatorSpec: ObjectFields,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  value: any
) => {
  const extraKeys = new Set(Object.keys(value))
  Object.keys(validatorSpec as any).forEach((it) => extraKeys.delete(it))
  if (extraKeys.size !== 0) {
    throw {
      extraKeys: Array.from(extraKeys),
    }
  }
}

export default declareField('@spec-validator/validator/fields/objectField', <
  Spec extends ObjectFields = ObjectFields
> (
    objectSpec: Spec,
    canHaveExtraKeys = false
  ): ObjectField<Spec> => ({
    objectSpec,
    canHaveExtraKeys,
    validate: (value: any): TypeHint<Spec> => {
      if (typeof value !== 'object' || value === null) {
        throw 'Not an object'
      }
      const result = Object.fromEntries(Object.entries(objectSpec).map(([key, valueSpec]) => [
        key, withErrorDecoration(key, () => valueSpec.validate(value[key])),
      ])) as TypeHint<Spec>
      if (!canHaveExtraKeys) {
        ensureNoExtraFields(objectSpec, value)
      }
      return result
    },
    serialize: (deserialized: TypeHint<Spec>): Json =>
    Object.fromEntries(Object.entries(objectSpec).map(([key, valueSpec]) => [
      key, withErrorDecoration(key, () => valueSpec.serialize(deserialized[key])),
    ])) as Json,
  }))

