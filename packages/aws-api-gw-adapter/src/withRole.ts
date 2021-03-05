//import { Route } from '@spec-validator/rest-api-server/route'
import { FilterFlags } from '@spec-validator/utils/util-types'

type WithRole<Role extends string> = {
  role: Role
}

/*
export const withRole = <Role extends string>(route: Route, role: Role): Route & WithRole<Role> => ({
  ...route,
  role,
})

const hasRole = (item: any): item is WithRole<string> =>
  typeof item.role === 'string'

export const getRouteRoles = <T extends Route[]> (routes: T): FilterFlags<T, WithRole<string>> =>
  routes.filter(hasRole)

*/

type Route = {
  foo: number
}

type Routes<Roles extends string[]> = (Route | Route & WithRole<Roles[number]>)[]

const routes = [
  {
    foo: 11,
  },
  {
    foo: 12,
  },
  {
    foo: 13,
    role: 'role 11',
  },
  {
    foo: 14,
    role: 'role 12',
  },
] as const

type FF = FilterFlags<typeof routes, WithRole<string>>
