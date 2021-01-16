type Meta = {
  type: string,
  label: string
}

type CodeBlock = {
  lineno: number,
  lines: string[]
} & Meta

const hasDelimiter = (line: string): boolean => line.trim().startsWith('```')

export const extractType = (line: string): Meta => {
  const groups = line.match(/```(?<type>[^\s]+)?(\s+(?<label>[^\s]+))?/)?.groups

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
const extractCodeBlocks = (lines: string[]): CodeBlock[] => {
  let block: CodeBlock | undefined = undefined
  const result: CodeBlock[] = []

  // eslint-disable-next-line max-statements
  lines.forEach((line, i) => {
    if (block) {
      //block.label = block.label || getLabelCheckpoint(line)
      if (hasDelimiter(line)) {
        result.push(block)
        block = undefined
      } else {
        block.lines.push(line)
      }
    } else {
      if (hasDelimiter(line)) {
        block = {
          ...extractType(line),
          lineno: i + 1 + 1, // 1 based index + skip the delimiter
          lines: [],
        }
      } else {
        // IGNORE
      }
    }
  })
  return result
}

type Buckets = Record<string, CodeBlock[]>

const splitIntoBuckets = (blocks: CodeBlock[]): Buckets => {
  const buckets: Buckets = {}
  blocks.forEach(it => {
    const key = `${it.label}.${it.type}`
    buckets[key] = buckets[key] || []
    buckets[key].push(it)
  })
  return buckets
}

export default (lines: string[]): Buckets =>
  splitIntoBuckets(extractCodeBlocks(lines))

/**
const joinCodeBlocks = (snippets: CodeBlock[]): string => snippets
  .map(it => it.lines.join('\n'))
  .join('\n\n')

export default (text: string, types: string[]): string =>
  joinCodeBlocks(extractCodeBlocks(text.split('\n'), types))
 */
