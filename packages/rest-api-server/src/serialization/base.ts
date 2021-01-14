import { Json } from 'utils/src/Json'

export default interface SerializationFormat {
  mediaType: string
  serialize(deserialized: Json): string
  deserialize(serialized: string): Json
}
