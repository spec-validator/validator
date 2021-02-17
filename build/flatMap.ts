export default <T>(items: T[][]): T[] => {
  const result: T[] = []
  items.forEach(it => {
    it.forEach(it2 => result.push(it2))
  })
  return result
}
