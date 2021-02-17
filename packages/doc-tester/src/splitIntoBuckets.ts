type Meta = {
  type: string,
  label: string
}

type CodeBlock = {
  lineno: number,
  lines: string[]
} & Meta

const countDelimiters = (line: string): number =>
  (line.match(/```/g) || []).length

const hasOddDelimiterCount = (line: string): boolean =>
  countDelimiters(line) % 2 !== 0

const hasDelimiter = (line: string): boolean => hasOddDelimiterCount(line)

export const extractType = (line: string): Meta => {
  const parts = line.split('```')
  const suffix = parts.length ? parts[parts.length - 1] : ''

  const groups = suffix.match(/(?<type>[^\s]+)?(\s+(?<label>[^\s]+))?/)?.groups

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
        if ((!typeSet.size || typeSet.has(block.type)) && !block.label.startsWith('#')) {
          result.push(block)
        }
        block = undefined
      } else {
        block.lines.push(line)
      }
    } else {
      if (hasDelimiter(line)) {
        block = {
          ...extractType(line),
          lineno: i + 1, // skip the delimiter - block - next line
          lines: [],
        }
      } else {
        // IGNORE
      }
    }
  })
  return result
}

export type Buckets = Record<string, CodeBlock[]>

const splitIntoBuckets = (blocks: CodeBlock[]): Buckets => {
  const buckets: Buckets = {}
  blocks.forEach(it => {
    const key = `${it.label}.${it.type}`
    buckets[key] = buckets[key] || []
    buckets[key].push(it)
  })
  return buckets
}

export const toCode = (blocks: CodeBlock[]): string => {
  const lines: string[] = []
  blocks.forEach(block => {
    while (lines.length < block.lineno) {
      lines.push('\n')
    }
    block.lines.forEach(it => {
      lines.push(it + '\n')
    })
  })
  return lines.join('')
}

export default (lines: string[], types: string[]=[]): Buckets =>
  splitIntoBuckets(extractCodeBlocks(lines, types))

