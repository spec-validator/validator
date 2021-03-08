import { Route } from '@spec-validator/rest-api-server/route'
import { FilterFlags } from '@spec-validator/utils/util-types'
import { SegmentField } from '@spec-validator/validator/fields'

export type WithAlias<Alias extends string> = {
  alias: Alias
}

export const withAlias = <Alias extends string>(
  route: Route,
  alias: Alias
): Route & WithAlias<Alias> =>
    ({
      ...route,
      alias,
    })

export const aliasesOf = <T extends readonly Route[]>(...routes: T): FilterFlags<T, WithAlias<string>> =>
  routes.filter(it => (it as any).alias) as any

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


/*
export const detectRoutingConflicts = (routes: Route[]): void => {
  // TODO
}
*/
