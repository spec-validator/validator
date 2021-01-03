import {
  Field,
  ValidatorSpec,
  validate,
  serialize,
} from '../core'
import { declareField, OfType } from '../registry'
import { Json } from '../Json'
import { Any } from '../util-types'

class ObjectField<DeserializedType extends Record<string, Any>> implements Field<DeserializedType> {
  constructor(readonly objectSpec: ValidatorSpec<DeserializedType>) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  validate(value: any): DeserializedType {
    if (typeof value !== 'object' || value === null) {
      throw 'Not an object'
    }
    return validate(this.objectSpec, value) as DeserializedType
  }
  serialize(deserialized: DeserializedType): Json {
    return serialize(this.objectSpec, deserialized as any)
  }
}

const t = '@validator/fields.ObjectField' as const
type Type = OfType<typeof t>
export default declareField(t, ObjectField) as
(<DeserializedType extends Record<string, Any>> (
  objectSpec: ValidatorSpec<DeserializedType>,
) => ObjectField<DeserializedType> & Type) & Type
