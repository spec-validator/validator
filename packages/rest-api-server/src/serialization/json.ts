import SerializationBase from './base'

export default class JsonProtocol implements SerializationBase {
  serialize = JSON.stringify;
  deserialize = JSON.parse;
}
