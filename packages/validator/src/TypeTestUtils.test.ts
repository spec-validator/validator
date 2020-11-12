export const expectType = <A, B>(
  _: A extends B ? B extends A ? true : false : false
): void => undefined
