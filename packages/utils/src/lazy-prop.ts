// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default <T>(self: any, name: string, compute: () => T): T => {
  if (self[`${name}Ready`]) {
    return self[`${name}Cache`]
  }
  const value = compute()
  self[`${name}Cache`] = value
  self[`${name}Ready`] = true
  return value
}
