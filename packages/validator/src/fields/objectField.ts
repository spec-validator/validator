import { Field, TypeHint } from '../core'
import { field } from '../registry'
import { Json } from '../Json'
import { Any } from '../util-types'

export type ObjectFields<DeserializedType extends Record<string, Any> = Record<string, Any>> = {
  [P in keyof DeserializedType]: Field<DeserializedType[P]>
}


export interface ObjectField<
  Spec extends ObjectFields = ObjectFields
> extends Field<TypeHint<Spec>> {
  readonly objectSpec: Spec
}

export default field('@validator/fields.ObjectField', <
  Spec extends ObjectFields = ObjectFields
> (
    objectSpec: Spec
  ): ObjectField<Spec> => ({
    objectSpec,
    validate: (value: any): TypeHint<Spec> => {
      if (typeof value !== 'object' || value === null) {
        throw 'Not an object'
      }
      return validate(objectSpec, value) as TypeHint<Spec>
    },
    serialize: (deserialized: TypeHint<Spec>): Json => serialize(objectSpec, deserialized as any),
  }))

