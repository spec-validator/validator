import { Route } from '@spec-validator/rest-api-server/route'
import { FilterFlags } from '@spec-validator/utils/util-types'

export type WithRole<Role extends string> = {
  role: Role
}

export const withRole = <Role extends string>(route: Route, role: Role): Route & WithRole<Role> => ({
  ...route,
  role,
})

export const rolesOf = <T extends readonly Route[]>(...routes: T): FilterFlags<T, WithRole<string>> =>
  routes.filter(it => (it as any).role) as any
