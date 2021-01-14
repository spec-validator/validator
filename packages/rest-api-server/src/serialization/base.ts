import { Json } from '@spec-validator/utils/Json'

export default interface SerializationFormat {
  mediaType: string
  serialize(deserialized: Json): string
  deserialize(serialized: string): Json
}
