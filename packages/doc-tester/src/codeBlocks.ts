type CodeBlock = {
  type: string,
  offset: number,
  snippet: string[]
}

const hasDelimiter = (line: string): boolean => line.trim().startsWith('```')

const extractType = (line: string): string =>
  line.match(/```(?<type>.+)/)?.groups?.type?.trim()?.toLowerCase() || ''

/**
 * Really primitive FSM based README parser aiming to extract code snippets
 * from the documentation.
 */
const extractCodeBlocks = (text: string, types: string[]): CodeBlock[] => {
  let block: CodeBlock | undefined = undefined
  const typeSet = new Set(types)
  const result: CodeBlock[] = []
  text.split('\n').forEach((line, i) => {
    if (!block) {
      if (hasDelimiter(line)) {
        block = {
          type: extractType(line),
          offset: i + 1 + 1, // 1 based index + skip the delimiter
          snippet: [],
        }
      } else {
        // IGNORE
      }
    } else {
      if (hasDelimiter(line)) {
        if (typeSet.has(block.type)) {
          result.push(block)
        }
        block = undefined
      } else {
        block.snippet.push(line)
      }
    }
  })
  return result
}

const joinCodeBlocks = (snippets: CodeBlock[]): string => snippets
  .map(it => it.snippet.join('\n'))
  .join('\n\n')

export default (text: string, types: string[]): string =>
  joinCodeBlocks(extractCodeBlocks(text, types))
