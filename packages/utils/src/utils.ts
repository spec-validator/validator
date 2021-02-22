import { WithoutOptional } from './util-types'

// eslint-disable-next-line no-useless-escape
export const escapeRegex = (value: string): string => value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

export const omit = <T, K extends keyof T>(full: T, keys: K[]): Omit<T, K> => {
  const toDrop = new Set(keys)
  return Object.fromEntries(
    Object.entries(full).filter(it => !toDrop.has(it[0] as K))
  ) as Omit<T, K>
}

export const pick = <T, K extends keyof T>(full: T, keys: K[]): Pick<T, K> => {
  const toPick = new Set(keys)
  return Object.fromEntries(
    Object.entries(full).filter(it => toPick.has(it[0] as K))
  ) as Pick<T, K>
}

export const withoutOptional = <T> (item: T): WithoutOptional<T> =>
  Object.fromEntries(Object.entries(item).filter(([_, value]) => value !== undefined)) as WithoutOptional<T>

const cache = {} as Record<string, unknown>

export const cached = <T>(key: string, call:() => T): T => {
  if (!cache[key]) {
    cache[key] = call()
  }
  return cache[key] as T
}

export const flatMap = <T>(items: T[][]): T[] => {
  const result: T[] = []
  items.forEach(it => {
    it.forEach(it2 => result.push(it2))
  })
  return result
}

export const removePrefix = (str: string, prefix: string): string =>
  str.startsWith(prefix) ? str.slice(prefix.length) : str
