import { Route } from '@spec-validator/rest-api-server/route'
import { FilterFlags } from '@spec-validator/utils/util-types'

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
