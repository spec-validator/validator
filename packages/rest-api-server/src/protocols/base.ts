import { Json } from '@validator/validator/Json'

export default interface MediaTypeProtocol {
  serialize(deserialized: Json): string
  deserialize(serialized: string): Json
}
