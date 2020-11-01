import { $, Segment } from '@validator/validator/segmentChain'
import { Field } from '@validator/validator/core'

import { WithStringInputSupport } from '@validator/validator/WithStringInputSupport'

type Method = () => string

type Handler<Methods extends string> = Record<Methods, Method>

const createProxy = (trg: any) => new Proxy(
  trg,
  {
    get(target, name, receiver) {
      const rv = Reflect.get(target, name, receiver)
      if (rv === undefined) {
        return () => name
      } else {
        console.log(222)
        return rv
      }
    }
  }
) as any

class _Route<DeserializedType> {

  constructor(readonly segment: Segment<DeserializedType>) {
    this.segment = segment
  }

  _<Key extends string, ExtraDeserializedType=undefined>(
    key: Key,
    field?: Field<ExtraDeserializedType> & WithStringInputSupport
  ): _Route<[ExtraDeserializedType] extends [undefined] ? DeserializedType : DeserializedType & {
    [P in Key]: ExtraDeserializedType
  }> {
    return createProxy(new _Route(this.segment._(key, field)))
  }

}

export type Route<DeserializedType, Methods extends string> = Handler<Methods> & {

  _<Key extends string, ExtraDeserializedType=undefined>(
    key: Key,
    field?: Field<ExtraDeserializedType> & WithStringInputSupport
  ): Route<[ExtraDeserializedType] extends [undefined] ? DeserializedType : DeserializedType & {
    [P in Key]: ExtraDeserializedType
  }, Methods>

}

class _Server extends _Route<void> {

  constructor() {
    super($)
  }

  serve(): void {
    // Nothing
  }

}

export type CommonHttpMethods = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'trace';

export type Server<Methods extends string = CommonHttpMethods> = Route<void, Methods> & {
  serve(): void
}

export const server = <Methods extends string = CommonHttpMethods>(): Server<Methods> => createProxy(new _Server())

const s = server()
console.log(s._('foo').get())
