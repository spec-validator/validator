
type BLOCK = {
  type?: string,
  snippet: string[]
} | 'OUT'

const hasDelimiter = (line: string): boolean => line.trim().startsWith('```')

const extractType = (line: string): string | undefined =>
  line.match(/```(?<type>\w+)/)?.groups?.type?.trim()


/**
 * Really primitive FSM based README parser aiming to extract code snippets
 * from the documentation.
 */
const extractSnippets = (text: string): string[][] => {
  let block: BLOCK = 'OUT'
  const result: string[][] = []
  text.split('\n').forEach(line => {
    if (block === 'OUT') {
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
        result.push(block.snippet)
        block = 'OUT'
      } else {
        block.snippet.push(line)
      }
    }
  })
  return result
}
