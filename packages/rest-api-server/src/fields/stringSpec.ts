import { Any, Optional } from '@spec-validator/utils/util-types'
import { FieldWithStringSupport } from '@spec-validator/validator/withStringSerialization'

export type StringObjectSpec<DeserializedType extends Record<string, Any> = Record<string, Any>> = {
  [P in keyof DeserializedType]: FieldWithStringSupport<DeserializedType[P]>
}

export type WildcardStringObjectSpec = {
  [key: string]: Optional<StringSpecUnion<unknown>>
}

export type StringArraySpec<DeserializedType extends Any[] = Any[]> = StringSpecUnion<DeserializedType[number]>[]

export type StringSpecUnion<DeserializedType> =
  WildcardStringObjectSpec | StringObjectSpec | StringArraySpec |
  FieldWithStringSupport<DeserializedType> | undefined
