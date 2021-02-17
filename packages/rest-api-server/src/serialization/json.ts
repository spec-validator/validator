import SerializationFormat from './base'

export default class JsonSerialization implements SerializationFormat {
  mediaType = 'application/json'
  serialize = JSON.stringify
  deserialize = JSON.parse
}
