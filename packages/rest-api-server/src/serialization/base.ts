import { Json } from '@spec-validator/validator/Json'

export default interface SerializationFormat {
  mediaType: string
  serialize(deserialized: Json): string
  deserialize(serialized: string): Json
}
