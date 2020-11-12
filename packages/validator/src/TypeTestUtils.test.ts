export const expectType = <A, B>(
  // eslint-disable-next-line unused-imports/no-unused-vars-ts
  value: A extends B ? B extends A ? true : false : false
): void => undefined
