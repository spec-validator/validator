import { $, Segment } from '@validator/validator/segmentChain'
import { Field } from '@validator/validator/core'

import { WithStringInputSupport } from '@validator/validator/WithStringInputSupport'
import { serve, ServerConfig, WildCardRequestSpec, WildCardResponseSpecUnion, WildCardRoute } from './raw-server'
import { Optional } from '@validator/validator/utils'

type MethodSpec<
  RequestPathParams extends any,
  TResponseSpec extends WildCardResponseSpecUnion,
  TRequestSpec extends Optional<WildCardRequestSpec> = undefined,
> = (config: ) => string

type Handler<Methods extends string> = Record<Methods, MethodSpec<>>

const createProxy = (trg: any) => new Proxy(
  trg,
  {
    get(target, name, receiver) {
      const rv = Reflect.get(target, name, receiver)
      if (rv === undefined && typeof name === 'string') {
        const routes: WildCardRoute[] = target.root.routes
        return (params: {
          requestSpec: any,
          responseSpec: any,
          handler: any
        }) => {
          routes.push({
            method: name,
            pathSpec: (target as _Route<unknown>).segment,
            ...params
          })
        }
      } else {
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

  routes: WildCardRoute[]

  constructor(readonly config: Partial<ServerConfig>) {
    super($)
    this.config = config
    this.routes = []
  }

  serve(): void {
    serve(this.config, this.routes)
  }

}

export type CommonHttpMethods = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'trace';

export type Server<Methods extends string = CommonHttpMethods> = Route<void, Methods> & {
  serve(): void
}

export const server = <Methods extends string = CommonHttpMethods>(): Server<Methods> => createProxy(new _Server())

const s = server()
console.log(s._('foo').get())
