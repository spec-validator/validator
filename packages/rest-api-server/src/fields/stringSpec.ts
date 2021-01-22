import { Any, Optional } from '@spec-validator/utils/util-types'
import { FieldWithStringInputSupport } from '@spec-validator/validator/fields/segmentField'

export type StringObjectSpec<DeserializedType extends Record<string, Any> = Record<string, Any>> = {
  [P in keyof DeserializedType]: FieldWithStringInputSupport<DeserializedType[P]>
}

export type WildcardStringObjectSpec = {
  [key: string]: Optional<StringSpecUnion<unknown>>
}

export type StringArraySpec<DeserializedType extends Any[] = Any[]> = StringSpecUnion<DeserializedType[number]>[]

export type StringSpecUnion<DeserializedType> =
  WildcardStringObjectSpec | StringObjectSpec | StringArraySpec |
  FieldWithStringInputSupport<DeserializedType> | undefined
