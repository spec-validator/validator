import { Any } from '@spec-validator/utils/util-types'
import { FieldWithRegExpSupport } from '@spec-validator/validator/fields/segmentField'

export type HeadersSpec<DeserializedType extends Record<string, Any> = Record<string, Any>> = {
  [P in keyof DeserializedType]: FieldWithRegExpSupport<DeserializedType[P]>
}
