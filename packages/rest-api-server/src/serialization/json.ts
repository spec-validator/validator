import SerializationFormat from './base'

export default class JsonSerialization implements SerializationFormat {
  serialize = JSON.stringify;
  deserialize = JSON.parse;
}
