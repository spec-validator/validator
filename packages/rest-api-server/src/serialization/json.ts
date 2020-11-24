import SerializationFormat from './base'

export default class JsonProtocol implements SerializationFormat {
  serialize = JSON.stringify;
  deserialize = JSON.parse;
}
