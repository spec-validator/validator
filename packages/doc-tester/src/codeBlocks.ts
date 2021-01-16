type CodeBlock = {
  type: string,
  offset: number,
  lines: string[]
}

type CodeBucket = {
  blocks: CodeBlock[]
}

const hasDelimiter = (line: string): boolean => line.trim().startsWith('```')

const extractValue = (regex: RegExp, line: string): string =>
  line.match(/```(?<value>.+)/)?.groups?.value?.trim()?.toLowerCase() || ''

const extractType = extractValue.bind(null, /```(?<value>.+)/)

const getLabelCheckpoint = extractValue.bind(null, /\w*mark\((?<value>.+)\)\w*/)

const getLabelReset = extractValue.bind(null, /\w*reset\((?<value>.+)\)\w*/)

/**
 * Really primitive FSM based README parser aiming to extract code snippets
 * from the documentation.
 */
const extractCodeBlocks = (lines: string[], types: string[]): CodeBlock[] => {
  let block: CodeBlock | undefined = undefined
  const typeSet = new Set(types)
  const result: CodeBlock[] = []

  // eslint-disable-next-line max-statements
  lines.forEach((line, i) => {
    if (block) {
      //block.label = block.label || getLabelCheckpoint(line)
      if (hasDelimiter(line)) {
        if (typeSet.has(block.type)) {
          result.push(block)
        }
        block = undefined
      } else {
        block.lines.push(line)
      }
    } else {
      if (hasDelimiter(line)) {
        block = {
          type: extractType(line),
          offset: i + 1 + 1, // 1 based index + skip the delimiter
          lines: [],
        }
      } else {
        // IGNORE
      }
    }
  })
  return result
}

const splitIntoBucets = (blocks: CodeBlock[]): CodeBucket[] => {
  const buckets: CodeBucket[] = []

  return buckets
}

const joinCodeBlocks = (snippets: CodeBlock[]): string => snippets
  .map(it => it.lines.join('\n'))
  .join('\n\n')

export default (text: string, types: string[]): string =>
  joinCodeBlocks(extractCodeBlocks(text.split('\n'), types))
