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

