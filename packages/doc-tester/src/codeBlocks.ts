type CodeBlock = {
  type: string,
  snippet: string[]
}

type Block = CodeBlock | undefined

const hasDelimiter = (line: string): boolean => line.trim().startsWith('```')

const extractType = (line: string): string =>
  line.match(/```(?<type>.+)/)?.groups?.type?.trim()?.toLowerCase() || ''

/**
 * Really primitive FSM based README parser aiming to extract code snippets
 * from the documentation.
 */
const extractCodeBlocks = (text: string, types: string[]): CodeBlock[] => {
  let block: Block = undefined
  const typeSet = new Set(types)
  const result: CodeBlock[] = []
  text.split('\n').forEach(line => {
    if (!block) {
      if (hasDelimiter(line)) {
        block = {
          type: extractType(line),
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
