import { Optional } from './util-types'

// eslint-disable-next-line no-useless-escape
export const escapeRegex = (value: string): string => value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

export const getOrUndefined = <R>(get: () => R): Optional<R> => {
  try {
    return get()
  } catch (err) {
    return undefined
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const withParentFields = <T>(parent: any, child: T, fields: string[]): T => {
  fields.forEach(it => {
    (child as any)[it] = (parent as any)[it]
  })
  return child
}

export const omit = <T, K extends keyof T>(full: T, keys: K[]): Omit<T, K> => {
  const toDrop = new Set(keys)
  return Object.fromEntries(
    Object.entries(full).filter(it => !toDrop.has(it[0] as K))
  ) as Omit<T, K>
}
