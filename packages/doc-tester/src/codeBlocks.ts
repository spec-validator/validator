type Meta = {
  type: string,
  label: string
}

type CodeBlock = {
  meta: Meta,
  offset: number,
  lines: string[]
}

type CodeBucket = {
  blocks: CodeBlock[]
}

const hasDelimiter = (line: string): boolean => line.trim().startsWith('```')

const extractType = (line: string): Meta => {
  const groups = line.match(/```(?<type>.+)(\w+(?<label>.+))?/)?.groups

  const extract = (key: string): string =>
    (groups && groups[key]?.trim()?.toLowerCase()) || ''

  return {
    type: extract('type'),
    label: extract('label'),
  }
}

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
        if (typeSet.has(block.meta.type)) {
          result.push(block)
        }
        block = undefined
      } else {
        block.lines.push(line)
      }
    } else {
      if (hasDelimiter(line)) {
        block = {
          meta: extractType(line),
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
