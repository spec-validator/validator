import { StringObjectSpec } from '@spec-validator/rest-api-server/fields/stringSpec'
import { Route } from '@spec-validator/rest-api-server/route'
import { Any, FilterFlags, Optional } from '@spec-validator/utils/util-types'
import { SegmentField } from '@spec-validator/validator/fields'

export type WithAwsMeta<
  Alias extends string,
  DeserializedType extends Optional<Record<string, Any>> = undefined
> = {
  awsMeta:
  DeserializedType extends Record<string, Any> ? {
    alias: Alias
    spec: StringObjectSpec<DeserializedType>
  } : { alias: Alias}
}

export const withAwsMeta = <Alias extends string, DeserializedType extends Optional<Record<string, Any>> = undefined>(
  route: Route,
  awsMeta: WithAwsMeta<Alias, DeserializedType>['awsMeta']
): Route & WithAwsMeta<Alias, DeserializedType> =>
    ({
      ...route,
      awsMeta,
    })

export const awsMetasOf = <T extends readonly Route[]>(...routes: T): FilterFlags<T, WithAwsMeta<string>> =>
  routes.filter(it => (it as any).awsMeta) as any

export const getPathParamsKey = (route: SegmentField<unknown>): string =>
  route.segments.map((it => it.field ? `{${it.key}}` : `${it.key}`)).join('')

export const getRouteKey = (route: Route): string =>
  `${route.request.method}:${getPathParamsKey(route.request.pathParams)}`

export const toAwsRouteMap = <T extends readonly Route[]>(...routes: T): Record<string, Route> => {
  const mapping: Record<string, Route> = {}
  routes.forEach(it => {
    const key = getRouteKey(it)
    if (mapping[key]) {
      throw `AWS routing key ${key} is already registered`
    }
    mapping[key] = it
  })
  return mapping
}

