import { Json } from '@spec-validator/utils/Json'
import SerializationFormat from './base'

export default class HtmlSerialization implements SerializationFormat {
  mediaType = 'text/html'
  serialize = (value: Json): string => value?.toString() || ''
  deserialize = (value: string): Json => value
}
