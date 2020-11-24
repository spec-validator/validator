import { Json } from '@validator/validator/Json'

export default interface SerializationFormat {
  serialize(deserialized: Json): string
  deserialize(serialized: string): Json
}
