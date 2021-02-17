// eslint-disable-next-line max-statements
export default (graph: Record<string, string[]>): string[] => {
  const result: string[] = []
  const stack = Object.keys(graph)
  const processed = new Set()
  while (stack.length > 0) {
    const item = stack.pop() as string
    if (processed.has(item)) {
      continue
    }
    result.push(item)
    processed.add(item)
    graph[item].forEach(it => stack.push(it))
  }
  return result
}
