import { Json } from '@validator/validator/Json'

export interface MediaTypeProtocol {
  serialize(deserialized: Json): string
  deserialize(serialized: string): Json
}
