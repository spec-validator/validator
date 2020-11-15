import { TypeHint, Field } from '@validator/validator/core'
import { Segment } from '@validator/validator/segmentChain'
import { Optional, Any } from '@validator/validator/util-types'
import { WithStringInputSupport } from '@validator/validator/WithStringInputSupport'
import { StringMapping } from './handler'
import { RequestSpec, ResponseSpec, Route } from './route'

const createProxy = (trg: any) => new Proxy(
  trg,
  {
    get(target, name, receiver) {
      const rv = Reflect.get(target, name, receiver)
      if (rv === undefined && typeof name === 'string') {
        const routes: Route<any, any>[] = target.root.routes
        return <
          ReqSpec extends RequestSpec = RequestSpec,
          RespSpec extends ResponseSpec = ResponseSpec,
        > (
          spec: Exclude<Route<ReqSpec, RespSpec>, 'handler'> & {
            request: Exclude<ReqSpec, 'method' | 'pathParams'>
          },
          handler: Route<ReqSpec, RespSpec>['handler']
        ) => {
          routes.push({
            request: {
              ...spec.request,
              method: name as ReqSpec['method'],
              pathParams: (target as _Route<TypeHint<ReqSpec['pathParams']>>).segment,
            },
            response: spec.response,
            handler: handler as Route<ReqSpec, RespSpec>['handler']
          })
        }
      } else {
        return rv
      }
    }
  }
) as any

class _Route<DeserializedType extends Optional<StringMapping> = Optional<StringMapping>> {

  constructor(readonly segment: Segment<DeserializedType>) {
    this.segment = segment
  }

  _<Key extends string, ExtraDeserializedType extends Any=undefined>(
    key: Key,
    field?: Field<ExtraDeserializedType> & WithStringInputSupport
  ): _Route<[ExtraDeserializedType] extends [undefined] ? DeserializedType : DeserializedType & {
    [P in Key]: ExtraDeserializedType
  }> {
    return createProxy(new _Route(this.segment._(key, field)))
  }

}

type MethodSpec<
  RequestPathParams extends any,
  TResponseSpec extends WildCardResponseSpecUnion,
  TRequestSpec extends Optional<WildCardRequestSpec> = undefined,
  Config = Omit<
    RawRoute<RequestPathParams, TResponseSpec, TRequestSpec>,
    'method' | 'pathSpec'
  >
> = (config: Config, handler: Config[]) => string

type SegmentHandler<Methods extends string> = Record<Methods, MethodSpec<any, any>>


export type RouteSegment<DeserializedType, Methods extends string> = SegmentHandler<Methods> & {

  _<Key extends string, ExtraDeserializedType extends Any=undefined>(
    key: Key,
    field?: Field<ExtraDeserializedType> & WithStringInputSupport
  ): _Route<[ExtraDeserializedType] extends [undefined] ? DeserializedType : DeserializedType & {
    [P in Key]: ExtraDeserializedType
  }>

}
