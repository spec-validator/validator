const cache = {} as Record<string, unknown>

export default <T>(key: string, call:() => T): T => {
  if (!cache[key]) {
    cache[key] = call()
  }
  return cache[key] as T
}
