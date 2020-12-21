import { Optional } from './util-types'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const merge = (...objects: any) => Object.assign({}, ...objects)

export const tuple = <T extends any[]>(...args: T): T => args

// eslint-disable-next-line no-useless-escape
export const escapeRegex = (value: string): string => value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

export const getOrUndefined = <R>(get: () => R): Optional<R> => {
  try {
    return get()
  } catch (err) {
    return undefined
  }
}

export const assertEqual = <R, T extends R>(expected: T, actual: R, errorMessage: string): T => {
  if (expected !== actual) {
    throw errorMessage
  }
  return expected
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const withParentFields = <T>(parent: any, child: T, fields: string[]): T => {
  fields.forEach(it => {
    (child as any)[it] = (parent as any)[it]
  })
  return child
}

export const mapValues = <Key extends string, Src, Trg>(
  source: Record<Key, Src>, mapValue: (src: Src) => Trg
): Record<Key, Src> =>
    Object.fromEntries(Object.entries(source)
      .map(([key, value]) => [key, mapValue(value as Src)]))as unknown as Record<Key, Src>
