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
