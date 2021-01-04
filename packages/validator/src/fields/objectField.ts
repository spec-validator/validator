import {
  Field,
  ValidatorSpec,
  validate,
  serialize,
} from '../core'
import { field } from '../registry'
import { Json } from '../Json'
import { Any } from '../util-types'

export interface ObjectField<DeserializedType extends Record<string, Any>> extends Field<DeserializedType> {
  readonly objectSpec: ValidatorSpec<DeserializedType>
}

export default field('@validator/fields.ObjectField', <DeserializedType extends Record<string, Any>> (
  objectSpec: ValidatorSpec<DeserializedType>
): ObjectField<DeserializedType> => ({
    objectSpec,
    validate: (value: any): DeserializedType => {
      if (typeof value !== 'object' || value === null) {
        throw 'Not an object'
      }
      return validate(objectSpec, value) as DeserializedType
    },
    serialize: (deserialized: DeserializedType): Json => serialize(objectSpec, deserialized as any)
  }))

