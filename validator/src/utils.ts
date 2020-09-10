// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const merge = (...objects: any) => Object.assign({}, ...objects)

export type Optional<T> = T | undefined;

export const optionalOf = <T>(): Optional<T> => undefined

export const tuple = <T extends any[]>(...args: T): T => args
