export const expectType = <A, B>(

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  value: A extends B ? B extends A ? true : false : false
): void => undefined
